from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime, timezone, date, timedelta
import jwt

from emergentintegrations.llm.chat import LlmChat, UserMessage

from course_data import get_lesson, get_all_lessons
from prompts import (
    COACH_SYSTEM_PROMPT,
    LESSON_INSIGHT_PROMPT_TEMPLATE,
    INNER_CHILD_EXERCISES,
    INTAKE_QUESTIONS,
    ROADMAP_GENERATION_PROMPT,
    DAILY_GUIDANCE_PROMPT,
    PROGRESS_REVIEW_PROMPT,
)
import json as _json
import re as _re


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

JWT_SECRET = os.environ.get('JWT_SECRET', 'change-me')
APP_PASSWORD = os.environ.get('APP_PASSWORD', 'milagros2026')
EMERGENT_LLM_KEY = os.environ.get('EMERGENT_LLM_KEY', '')
JWT_ALGO = "HS256"

app = FastAPI(title="Milagros - App Transformacional")
api_router = APIRouter(prefix="/api")
security = HTTPBearer()


# ============ AUTH ============
class LoginRequest(BaseModel):
    password: str


class TokenResponse(BaseModel):
    token: str


def create_token() -> str:
    payload = {
        "sub": "owner",
        "iat": datetime.now(timezone.utc),
        "exp": datetime.now(timezone.utc) + timedelta(days=365),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGO)


def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)) -> str:
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=[JWT_ALGO])
        return payload.get("sub", "owner")
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expirado")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Token inválido")


@api_router.post("/auth/login", response_model=TokenResponse)
async def login(req: LoginRequest):
    if req.password != APP_PASSWORD:
        raise HTTPException(status_code=401, detail="Contraseña incorrecta")
    return TokenResponse(token=create_token())


@api_router.get("/auth/verify")
async def verify(user: str = Depends(verify_token)):
    return {"ok": True, "user": user}


# ============ LESSONS (Un Curso de Milagros) ============
class LessonOut(BaseModel):
    day: int
    title: str


class LessonInsight(BaseModel):
    day: int
    title: str
    insight: str
    generated_at: str


@api_router.get("/lessons", response_model=List[LessonOut])
async def list_lessons(user: str = Depends(verify_token)):
    return get_all_lessons()


@api_router.get("/lessons/today", response_model=LessonOut)
async def lesson_today(user: str = Depends(verify_token)):
    # Lección del día basada en el día del año (1-365)
    day_of_year = datetime.now(timezone.utc).timetuple().tm_yday
    if day_of_year > 365:
        day_of_year = 365
    return get_lesson(day_of_year)


@api_router.get("/lessons/{day}", response_model=LessonOut)
async def lesson_by_day(day: int, user: str = Depends(verify_token)):
    if day < 1 or day > 365:
        raise HTTPException(status_code=400, detail="Día fuera de rango (1-365)")
    return get_lesson(day)


@api_router.get("/lessons/{day}/insight", response_model=LessonInsight)
async def lesson_insight(day: int, user: str = Depends(verify_token)):
    if day < 1 or day > 365:
        raise HTTPException(status_code=400, detail="Día fuera de rango")

    # Cache: buscar insight guardado en MongoDB
    cached = await db.lesson_insights.find_one({"day": day}, {"_id": 0})
    if cached:
        return LessonInsight(**cached)

    lesson = get_lesson(day)
    prompt = LESSON_INSIGHT_PROMPT_TEMPLATE.format(day=day, title=lesson["title"])

    chat = LlmChat(
        api_key=EMERGENT_LLM_KEY,
        session_id=f"lesson-insight-{day}",
        system_message=COACH_SYSTEM_PROMPT,
    ).with_model("anthropic", "claude-sonnet-4-5-20250929")

    try:
        response = await chat.send_message(UserMessage(text=prompt))
    except Exception as e:
        logging.exception("Error generando insight")
        raise HTTPException(status_code=500, detail=f"Error IA: {str(e)}")

    insight_doc = {
        "day": day,
        "title": lesson["title"],
        "insight": response,
        "generated_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.lesson_insights.insert_one(dict(insight_doc))
    return LessonInsight(**insight_doc)


# ============ COACH CONTEXT HELPER ============
async def _build_coach_system_message() -> str:
    """Construye el system message del coach con el contexto actual del usuario."""
    base = COACH_SYSTEM_PROMPT
    parts = [base]

    profile = await db.journey_profile.find_one({"id": "owner"}, {"_id": 0})
    if profile:
        parts.append(f"""

=== CONTEXTO DEL CLIENTE (conócelo, no lo repitas literal) ===
DIAGNÓSTICO: {profile.get('diagnosis', '')}
PATRONES: {', '.join(profile.get('core_patterns', []))}
HERIDA RAÍZ: {profile.get('root_wound', '')}
NECESIDAD NÚCLEO: {profile.get('core_need', '')}
SUPERPODER: {profile.get('superpower', '')}
NORTE: {profile.get('north_star', '')}""")

    roadmap = await db.journey_roadmap.find_one({"id": "owner"}, {"_id": 0})
    if roadmap:
        current_phase_num = roadmap.get("current_phase", 1)
        phases = roadmap.get("phases", [])
        current_phase = next((p for p in phases if p["number"] == current_phase_num), None)
        if current_phase:
            parts.append(f"""
FASE ACTUAL: #{current_phase['number']} "{current_phase['title']}"
Enfoque: {current_phase['focus']}
Práctica nuclear diaria: {current_phase['daily_core_practice']}""")

    # Últimas emociones (3 días)
    three_days_ago = (date.today() - timedelta(days=3)).isoformat()
    recent_emotions = await db.emotions.find(
        {"date": {"$gte": three_days_ago}}, {"_id": 0}
    ).sort("created_at", -1).to_list(10)
    if recent_emotions:
        em_summary = " | ".join(
            f"{e['date']}: ánimo {e['mood']}, energía {e['energy']}, estabilidad {e['stability']}"
            for e in recent_emotions[:5]
        )
        parts.append(f"\nESTADO EMOCIONAL RECIENTE: {em_summary}")

    parts.append("\n=== FIN CONTEXTO ===\n")
    return "\n".join(parts)


def _extract_json(text: str) -> dict:
    """Extrae JSON de una respuesta de LLM, tolerante a texto extra o bloques ```."""
    # Intenta directo
    try:
        return _json.loads(text)
    except Exception:
        pass
    # Intenta buscar JSON entre ``` o entre {}
    m = _re.search(r"```(?:json)?\s*(\{.*?\})\s*```", text, _re.DOTALL)
    if m:
        try:
            return _json.loads(m.group(1))
        except Exception:
            pass
    # Busca el primer { balanceado hasta el último }
    start = text.find("{")
    end = text.rfind("}")
    if start >= 0 and end > start:
        candidate = text[start : end + 1]
        try:
            return _json.loads(candidate)
        except Exception:
            pass
    raise ValueError("No se pudo extraer JSON válido de la respuesta del modelo")


async def _send_with_retry(chat, message, retries: int = 2, delay: float = 2.5):
    """Envía mensaje a LLM con reintentos ante fallos transitorios (502, timeouts)."""
    import asyncio
    last_err = None
    for attempt in range(retries + 1):
        try:
            return await chat.send_message(message)
        except Exception as e:
            err_str = str(e).lower()
            # Solo reintentar en errores transitorios típicos
            transient = any(k in err_str for k in ["502", "bad gateway", "timeout", "connection", "overloaded", "rate limit"])
            last_err = e
            if attempt < retries and transient:
                logging.warning(f"LLM transient error (attempt {attempt + 1}): {e}. Reintentando en {delay}s...")
                await asyncio.sleep(delay)
                continue
            raise
    raise last_err if last_err else RuntimeError("LLM retry failed")


# ============ COACH (Chat conversacional) ============
class CoachSession(BaseModel):
    id: str
    title: str
    created_at: str
    last_message_at: str


class CoachMessage(BaseModel):
    id: str
    session_id: str
    role: str  # 'user' | 'assistant'
    content: str
    created_at: str


class NewSessionRequest(BaseModel):
    title: Optional[str] = None
    initial_context: Optional[str] = None  # Estado emocional actual para diagnóstico


class SendMessageRequest(BaseModel):
    session_id: str
    content: str


@api_router.post("/coach/sessions", response_model=CoachSession)
async def create_session(req: NewSessionRequest, user: str = Depends(verify_token)):
    sid = str(uuid.uuid4())
    now = datetime.now(timezone.utc).isoformat()
    title = req.title or "Sesión de coaching"
    doc = {
        "id": sid,
        "title": title,
        "created_at": now,
        "last_message_at": now,
        "initial_context": req.initial_context or "",
    }
    await db.coach_sessions.insert_one(dict(doc))

    # Si hay contexto inicial, generar primer mensaje diagnóstico
    if req.initial_context:
        diagnostic_prompt = f"""La persona acaba de compartir su estado actual:

"{req.initial_context}"

Actúa como su coach experto. Haz lo siguiente:
1. Reconoce con empatía genuina lo que comparte (1-2 frases).
2. Diagnostica brevemente el patrón (1 frase).
3. Haz 2 preguntas poderosas que abran claridad.
4. Anuncia que diseñarás un plan de transformación personalizado para hoy.

Sé cálido, profundo y directo. Sin rodeos."""

        chat = LlmChat(
            api_key=EMERGENT_LLM_KEY,
            session_id=sid,
            system_message=await _build_coach_system_message(),
        ).with_model("anthropic", "claude-sonnet-4-5-20250929")

        try:
            response = await chat.send_message(UserMessage(text=diagnostic_prompt))
            msg_doc = {
                "id": str(uuid.uuid4()),
                "session_id": sid,
                "role": "assistant",
                "content": response,
                "created_at": datetime.now(timezone.utc).isoformat(),
            }
            await db.coach_messages.insert_one(dict(msg_doc))
        except Exception:
            logging.exception("Error generando mensaje diagnóstico")

    return CoachSession(
        id=sid, title=title, created_at=now, last_message_at=now
    )


@api_router.get("/coach/sessions", response_model=List[CoachSession])
async def list_sessions(user: str = Depends(verify_token)):
    sessions = await db.coach_sessions.find(
        {}, {"_id": 0, "id": 1, "title": 1, "created_at": 1, "last_message_at": 1}
    ).sort("last_message_at", -1).to_list(100)
    return [CoachSession(**s) for s in sessions]


@api_router.get("/coach/sessions/{session_id}/messages", response_model=List[CoachMessage])
async def get_session_messages(session_id: str, user: str = Depends(verify_token)):
    msgs = await db.coach_messages.find(
        {"session_id": session_id}, {"_id": 0}
    ).sort("created_at", 1).to_list(1000)
    return [CoachMessage(**m) for m in msgs]


@api_router.post("/coach/message", response_model=CoachMessage)
async def send_coach_message(req: SendMessageRequest, user: str = Depends(verify_token)):
    session = await db.coach_sessions.find_one({"id": req.session_id}, {"_id": 0})
    if not session:
        raise HTTPException(status_code=404, detail="Sesión no encontrada")

    # Guardar mensaje de usuario
    now = datetime.now(timezone.utc).isoformat()
    user_msg = {
        "id": str(uuid.uuid4()),
        "session_id": req.session_id,
        "role": "user",
        "content": req.content,
        "created_at": now,
    }
    await db.coach_messages.insert_one(dict(user_msg))

    # Reconstruir contexto: la librería mantiene historia por session_id solo dentro de instancia.
    # Para conversación persistente, pasamos historia manualmente como turnos previos.
    history_msgs = await db.coach_messages.find(
        {"session_id": req.session_id}, {"_id": 0}
    ).sort("created_at", 1).to_list(1000)

    # Construir mensaje contextualizado (incluir historia en el primer user message es ineficiente;
    # usamos LlmChat con session_id único y enviamos cada mensaje incluyendo resumen de turnos previos)
    chat = LlmChat(
        api_key=EMERGENT_LLM_KEY,
        session_id=req.session_id,
        system_message=await _build_coach_system_message(),
    ).with_model("anthropic", "claude-sonnet-4-5-20250929")
    context_block = ""
    prev_msgs = history_msgs[:-1]  # todos menos el actual
    if prev_msgs:
        context_block = "\n\n--- HISTORIAL DE ESTA CONVERSACIÓN ---\n"
        for m in prev_msgs:
            role_label = "Usuario" if m["role"] == "user" else "Coach"
            context_block += f"\n{role_label}: {m['content']}\n"
        context_block += "\n--- FIN HISTORIAL ---\n\n"

    full_prompt = f"{context_block}Usuario: {req.content}\n\nResponde como coach experto:"

    try:
        response = await chat.send_message(UserMessage(text=full_prompt))
    except Exception as e:
        logging.exception("Error coach chat")
        raise HTTPException(status_code=500, detail=f"Error IA: {str(e)}")

    assistant_msg = {
        "id": str(uuid.uuid4()),
        "session_id": req.session_id,
        "role": "assistant",
        "content": response,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.coach_messages.insert_one(dict(assistant_msg))
    await db.coach_sessions.update_one(
        {"id": req.session_id},
        {"$set": {"last_message_at": assistant_msg["created_at"]}},
    )
    return CoachMessage(**assistant_msg)


@api_router.delete("/coach/sessions/{session_id}")
async def delete_session(session_id: str, user: str = Depends(verify_token)):
    await db.coach_sessions.delete_one({"id": session_id})
    await db.coach_messages.delete_many({"session_id": session_id})
    return {"ok": True}


# ============ HABITOS ============
class Habit(BaseModel):
    id: str
    name: str
    icon: str = "sparkle"
    target_per_week: int = 7
    created_at: str


class HabitCreate(BaseModel):
    name: str
    icon: Optional[str] = "sparkle"
    target_per_week: Optional[int] = 7


class HabitCheckin(BaseModel):
    id: str
    habit_id: str
    date: str
    done: bool


@api_router.get("/habits", response_model=List[Habit])
async def list_habits(user: str = Depends(verify_token)):
    items = await db.habits.find({}, {"_id": 0}).sort("created_at", 1).to_list(200)
    return [Habit(**i) for i in items]


@api_router.post("/habits", response_model=Habit)
async def create_habit(req: HabitCreate, user: str = Depends(verify_token)):
    h = Habit(
        id=str(uuid.uuid4()),
        name=req.name,
        icon=req.icon or "sparkle",
        target_per_week=req.target_per_week or 7,
        created_at=datetime.now(timezone.utc).isoformat(),
    )
    await db.habits.insert_one(h.model_dump())
    return h


@api_router.delete("/habits/{habit_id}")
async def delete_habit(habit_id: str, user: str = Depends(verify_token)):
    await db.habits.delete_one({"id": habit_id})
    await db.habit_checkins.delete_many({"habit_id": habit_id})
    return {"ok": True}


@api_router.post("/habits/{habit_id}/checkin", response_model=HabitCheckin)
async def habit_checkin(habit_id: str, user: str = Depends(verify_token)):
    today = date.today().isoformat()
    existing = await db.habit_checkins.find_one(
        {"habit_id": habit_id, "date": today}, {"_id": 0}
    )
    if existing:
        # Toggle
        new_done = not existing["done"]
        await db.habit_checkins.update_one(
            {"habit_id": habit_id, "date": today},
            {"$set": {"done": new_done}},
        )
        existing["done"] = new_done
        return HabitCheckin(**existing)
    checkin = HabitCheckin(
        id=str(uuid.uuid4()), habit_id=habit_id, date=today, done=True
    )
    await db.habit_checkins.insert_one(checkin.model_dump())
    return checkin


@api_router.get("/habits/checkins/week")
async def habits_week(user: str = Depends(verify_token)):
    today = date.today()
    start = today - timedelta(days=6)
    checkins = await db.habit_checkins.find(
        {"date": {"$gte": start.isoformat(), "$lte": today.isoformat()}},
        {"_id": 0},
    ).to_list(1000)
    return {"checkins": checkins, "start": start.isoformat(), "end": today.isoformat()}


# ============ EMOCIONES ============
class EmotionCheckin(BaseModel):
    id: str
    date: str
    mood: int  # 1-10
    energy: int  # 1-10
    stability: int  # 1-10
    note: str = ""
    created_at: str


class EmotionCreate(BaseModel):
    mood: int
    energy: int
    stability: int
    note: Optional[str] = ""


@api_router.post("/emotions", response_model=EmotionCheckin)
async def create_emotion(req: EmotionCreate, user: str = Depends(verify_token)):
    e = EmotionCheckin(
        id=str(uuid.uuid4()),
        date=date.today().isoformat(),
        mood=req.mood,
        energy=req.energy,
        stability=req.stability,
        note=req.note or "",
        created_at=datetime.now(timezone.utc).isoformat(),
    )
    await db.emotions.insert_one(e.model_dump())
    return e


@api_router.get("/emotions", response_model=List[EmotionCheckin])
async def list_emotions(days: int = 30, user: str = Depends(verify_token)):
    start = (date.today() - timedelta(days=days)).isoformat()
    items = await db.emotions.find(
        {"date": {"$gte": start}}, {"_id": 0}
    ).sort("created_at", 1).to_list(1000)
    return [EmotionCheckin(**i) for i in items]


# ============ DIARIO (Journal) ============
class JournalEntry(BaseModel):
    id: str
    date: str
    title: str
    content: str
    gratitude: List[str] = []
    wins: List[str] = []
    lessons: List[str] = []
    created_at: str


class JournalCreate(BaseModel):
    title: Optional[str] = "Reflexión del día"
    content: str
    gratitude: Optional[List[str]] = []
    wins: Optional[List[str]] = []
    lessons: Optional[List[str]] = []


@api_router.post("/journal", response_model=JournalEntry)
async def create_journal(req: JournalCreate, user: str = Depends(verify_token)):
    j = JournalEntry(
        id=str(uuid.uuid4()),
        date=date.today().isoformat(),
        title=req.title or "Reflexión del día",
        content=req.content,
        gratitude=req.gratitude or [],
        wins=req.wins or [],
        lessons=req.lessons or [],
        created_at=datetime.now(timezone.utc).isoformat(),
    )
    await db.journal.insert_one(j.model_dump())
    return j


@api_router.get("/journal", response_model=List[JournalEntry])
async def list_journal(user: str = Depends(verify_token)):
    items = await db.journal.find({}, {"_id": 0}).sort("created_at", -1).to_list(200)
    return [JournalEntry(**i) for i in items]


@api_router.delete("/journal/{entry_id}")
async def delete_journal(entry_id: str, user: str = Depends(verify_token)):
    await db.journal.delete_one({"id": entry_id})
    return {"ok": True}


# ============ PLANNER (Hora por hora) ============
class PlannerBlock(BaseModel):
    id: str
    date: str
    hour: int  # 0-23
    activity: str
    category: str = "general"  # spiritual | work | body | rest | family | general
    done: bool = False
    created_at: str


class PlannerCreate(BaseModel):
    date: str
    hour: int
    activity: str
    category: Optional[str] = "general"


@api_router.post("/planner", response_model=PlannerBlock)
async def create_block(req: PlannerCreate, user: str = Depends(verify_token)):
    b = PlannerBlock(
        id=str(uuid.uuid4()),
        date=req.date,
        hour=req.hour,
        activity=req.activity,
        category=req.category or "general",
        done=False,
        created_at=datetime.now(timezone.utc).isoformat(),
    )
    await db.planner.insert_one(b.model_dump())
    return b


@api_router.get("/planner", response_model=List[PlannerBlock])
async def list_planner(date_str: Optional[str] = None, user: str = Depends(verify_token)):
    query_date = date_str or date.today().isoformat()
    items = await db.planner.find(
        {"date": query_date}, {"_id": 0}
    ).sort("hour", 1).to_list(100)
    return [PlannerBlock(**i) for i in items]


@api_router.patch("/planner/{block_id}/toggle")
async def toggle_block(block_id: str, user: str = Depends(verify_token)):
    b = await db.planner.find_one({"id": block_id}, {"_id": 0})
    if not b:
        raise HTTPException(status_code=404, detail="Bloque no encontrado")
    new_done = not b["done"]
    await db.planner.update_one({"id": block_id}, {"$set": {"done": new_done}})
    b["done"] = new_done
    return PlannerBlock(**b)


@api_router.delete("/planner/{block_id}")
async def delete_block(block_id: str, user: str = Depends(verify_token)):
    await db.planner.delete_one({"id": block_id})
    return {"ok": True}


# ============ INNER CHILD EXERCISES ============
@api_router.get("/inner-child/exercises")
async def list_inner_child(user: str = Depends(verify_token)):
    return {"exercises": INNER_CHILD_EXERCISES}


class InnerChildLog(BaseModel):
    id: str
    exercise_id: str
    date: str
    reflection: str
    created_at: str


class InnerChildLogCreate(BaseModel):
    exercise_id: str
    reflection: str


@api_router.post("/inner-child/log", response_model=InnerChildLog)
async def log_inner_child(req: InnerChildLogCreate, user: str = Depends(verify_token)):
    log = InnerChildLog(
        id=str(uuid.uuid4()),
        exercise_id=req.exercise_id,
        date=date.today().isoformat(),
        reflection=req.reflection,
        created_at=datetime.now(timezone.utc).isoformat(),
    )
    await db.inner_child_logs.insert_one(log.model_dump())
    return log


@api_router.get("/inner-child/logs", response_model=List[InnerChildLog])
async def list_inner_child_logs(user: str = Depends(verify_token)):
    items = await db.inner_child_logs.find({}, {"_id": 0}).sort("created_at", -1).to_list(200)
    return [InnerChildLog(**i) for i in items]


# ============ METRICS (Saltos Cuánticos) ============
@api_router.get("/metrics/dashboard")
async def metrics_dashboard(user: str = Depends(verify_token)):
    """Métricas del dashboard transformacional"""
    today = date.today()
    start_week = (today - timedelta(days=6)).isoformat()
    start_month = (today - timedelta(days=29)).isoformat()

    # Hábitos de la semana
    habits = await db.habits.find({}, {"_id": 0}).to_list(200)
    habits_count = len(habits)
    week_checkins = await db.habit_checkins.find(
        {"date": {"$gte": start_week, "$lte": today.isoformat()}, "done": True}, {"_id": 0}
    ).to_list(1000)
    habits_week_completed = len(week_checkins)
    habits_week_target = habits_count * 7 if habits_count else 0
    habits_rate = round((habits_week_completed / habits_week_target) * 100) if habits_week_target else 0

    # Emociones promedio últimos 30 días
    emotions = await db.emotions.find(
        {"date": {"$gte": start_month}}, {"_id": 0}
    ).to_list(1000)
    mood_avg = round(sum(e["mood"] for e in emotions) / len(emotions), 1) if emotions else 0
    energy_avg = round(sum(e["energy"] for e in emotions) / len(emotions), 1) if emotions else 0
    stability_avg = round(sum(e["stability"] for e in emotions) / len(emotions), 1) if emotions else 0

    # Lecciones CdM estudiadas (insights generados)
    insights_count = await db.lesson_insights.count_documents({})

    # Entradas de diario
    journal_count = await db.journal.count_documents({})

    # Ejercicios niño interior
    ic_logs_count = await db.inner_child_logs.count_documents({})

    # Sesiones de coaching
    coach_sessions_count = await db.coach_sessions.count_documents({})

    # Racha de check-ins emocionales
    streak = 0
    for i in range(0, 365):
        d = (today - timedelta(days=i)).isoformat()
        exists = await db.emotions.find_one({"date": d})
        if exists:
            streak += 1
        else:
            break

    # Serie temporal de emociones (últimos 14 días)
    series = []
    for i in range(13, -1, -1):
        d = (today - timedelta(days=i)).isoformat()
        day_emotions = [e for e in emotions if e["date"] == d]
        if day_emotions:
            last = day_emotions[-1]
            series.append({
                "date": d,
                "mood": last["mood"],
                "energy": last["energy"],
                "stability": last["stability"],
            })
        else:
            series.append({"date": d, "mood": None, "energy": None, "stability": None})

    return {
        "habits": {
            "total": habits_count,
            "week_completed": habits_week_completed,
            "week_target": habits_week_target,
            "completion_rate": habits_rate,
        },
        "emotions": {
            "mood_avg": mood_avg,
            "energy_avg": energy_avg,
            "stability_avg": stability_avg,
            "streak": streak,
            "series_14d": series,
        },
        "growth": {
            "lessons_studied": insights_count,
            "journal_entries": journal_count,
            "inner_child_logs": ic_logs_count,
            "coach_sessions": coach_sessions_count,
        },
        "day_of_year": today.timetuple().tm_yday,
        "year_progress": round((today.timetuple().tm_yday / 365) * 100),
    }


# ============ JOURNEY (Ruta de Transformación guiada por IA) ============

class IntakeAnswer(BaseModel):
    id: str
    answer: str


class IntakeSubmit(BaseModel):
    answers: List[IntakeAnswer]


@api_router.get("/journey/intake/questions")
async def intake_questions(user: str = Depends(verify_token)):
    return {"questions": INTAKE_QUESTIONS}


@api_router.get("/journey/status")
async def journey_status(user: str = Depends(verify_token)):
    profile = await db.journey_profile.find_one({"id": "owner"}, {"_id": 0})
    roadmap = await db.journey_roadmap.find_one({"id": "owner"}, {"_id": 0})
    return {
        "has_profile": bool(profile),
        "has_roadmap": bool(roadmap),
        "current_phase": roadmap.get("current_phase", 1) if roadmap else None,
    }


@api_router.post("/journey/intake/submit")
async def intake_submit(req: IntakeSubmit, user: str = Depends(verify_token)):
    """Procesa intake, genera perfil + ruta con IA. Puede tardar 30-60s."""
    answers_by_id = {a.id: a.answer for a in req.answers}
    answers_block = ""
    for q in INTAKE_QUESTIONS:
        ans = answers_by_id.get(q["id"], "(sin respuesta)")
        answers_block += f"\n[{q['category']}] {q['question']}\n→ {ans}\n"

    prompt = ROADMAP_GENERATION_PROMPT.format(answers_block=answers_block)

    chat = LlmChat(
        api_key=EMERGENT_LLM_KEY,
        session_id=f"intake-{uuid.uuid4()}",
        system_message="Eres un coach maestro transformacional. Respondes en español y siempre en JSON válido cuando se te pide.",
    ).with_model("anthropic", "claude-sonnet-4-5-20250929")

    try:
        response = await _send_with_retry(chat, UserMessage(text=prompt))
        data = _extract_json(response)
    except Exception as e:
        logging.exception("Error generando roadmap")
        raise HTTPException(status_code=500, detail=f"Error IA: {str(e)}")

    profile = data.get("profile", {})
    phases = data.get("phases", [])
    now = datetime.now(timezone.utc).isoformat()

    profile_doc = {
        "id": "owner",
        "diagnosis": profile.get("diagnosis", ""),
        "core_patterns": profile.get("core_patterns", []),
        "root_wound": profile.get("root_wound", ""),
        "core_need": profile.get("core_need", ""),
        "superpower": profile.get("superpower", ""),
        "north_star": profile.get("north_star", ""),
        "intake_answers": [a.model_dump() for a in req.answers],
        "created_at": now,
    }
    await db.journey_profile.delete_many({"id": "owner"})
    await db.journey_profile.insert_one(dict(profile_doc))

    roadmap_doc = {
        "id": "owner",
        "phases": phases,
        "current_phase": 1,
        "current_phase_started_at": date.today().isoformat(),
        "started_at": date.today().isoformat(),
        "created_at": now,
    }
    await db.journey_roadmap.delete_many({"id": "owner"})
    await db.journey_roadmap.insert_one(dict(roadmap_doc))

    return {"profile": profile_doc, "roadmap": roadmap_doc}


@api_router.get("/journey/profile")
async def get_profile(user: str = Depends(verify_token)):
    profile = await db.journey_profile.find_one({"id": "owner"}, {"_id": 0})
    if not profile:
        raise HTTPException(status_code=404, detail="Perfil no creado aún")
    return profile


@api_router.get("/journey/roadmap")
async def get_roadmap(user: str = Depends(verify_token)):
    roadmap = await db.journey_roadmap.find_one({"id": "owner"}, {"_id": 0})
    if not roadmap:
        raise HTTPException(status_code=404, detail="Ruta no creada aún")
    return roadmap


@api_router.post("/journey/advance-phase")
async def advance_phase(user: str = Depends(verify_token)):
    roadmap = await db.journey_roadmap.find_one({"id": "owner"}, {"_id": 0})
    if not roadmap:
        raise HTTPException(status_code=404, detail="Ruta no creada")
    current = roadmap.get("current_phase", 1)
    max_phase = len(roadmap.get("phases", []))
    new_phase = min(current + 1, max_phase)
    await db.journey_roadmap.update_one(
        {"id": "owner"},
        {"$set": {
            "current_phase": new_phase,
            "current_phase_started_at": date.today().isoformat(),
        }},
    )
    return {"current_phase": new_phase}


@api_router.get("/journey/today")
async def journey_today(user: str = Depends(verify_token)):
    """Guía del día. Se cachea por fecha."""
    today = date.today().isoformat()
    cached = await db.journey_daily.find_one({"date": today}, {"_id": 0})
    if cached:
        return cached

    profile = await db.journey_profile.find_one({"id": "owner"}, {"_id": 0})
    roadmap = await db.journey_roadmap.find_one({"id": "owner"}, {"_id": 0})
    if not profile or not roadmap:
        raise HTTPException(status_code=400, detail="Completa el diagnóstico primero")

    current_phase_num = roadmap.get("current_phase", 1)
    phase = next(
        (p for p in roadmap["phases"] if p["number"] == current_phase_num),
        roadmap["phases"][0],
    )
    phase_start = datetime.fromisoformat(roadmap.get("current_phase_started_at", today)).date() if "T" not in roadmap.get("current_phase_started_at", today) else datetime.fromisoformat(roadmap["current_phase_started_at"]).date()
    # Simplified: use ISO date directly
    try:
        phase_start = date.fromisoformat(roadmap.get("current_phase_started_at", today))
    except Exception:
        phase_start = date.today()
    day_in_phase = (date.today() - phase_start).days + 1

    # Emociones recientes
    start = (date.today() - timedelta(days=3)).isoformat()
    recent_em = await db.emotions.find(
        {"date": {"$gte": start}}, {"_id": 0}
    ).sort("created_at", -1).to_list(5)
    em_str = " | ".join(
        f"{e['date']}: á{e['mood']} e{e['energy']} s{e['stability']}"
        for e in recent_em
    ) or "Sin registros recientes"

    # Hábitos
    habits = await db.habits.find({}, {"_id": 0}).to_list(20)
    habits_str = ", ".join(h["name"] for h in habits) or "Ninguno aún"

    prompt = DAILY_GUIDANCE_PROMPT.format(
        profile=_json.dumps(
            {k: profile.get(k) for k in ["diagnosis", "core_patterns", "core_need", "north_star"]},
            ensure_ascii=False,
        ),
        day_in_phase=day_in_phase,
        total_days=phase.get("duration_days", 21),
        phase=_json.dumps(
            {k: phase.get(k) for k in ["number", "title", "focus", "daily_core_practice"]},
            ensure_ascii=False,
        ),
        recent_emotions=em_str,
        habits=habits_str,
    )

    chat = LlmChat(
        api_key=EMERGENT_LLM_KEY,
        session_id=f"daily-{today}",
        system_message="Eres un coach maestro. Respondes siempre en español y en JSON válido.",
    ).with_model("anthropic", "claude-sonnet-4-5-20250929")

    try:
        response = await _send_with_retry(chat, UserMessage(text=prompt))
        data = _extract_json(response)
    except Exception as e:
        logging.exception("Error guía diaria")
        raise HTTPException(status_code=500, detail=f"Error IA: {str(e)}")

    guidance_doc = {
        "date": today,
        "phase_number": phase["number"],
        "phase_title": phase["title"],
        "day_in_phase": day_in_phase,
        "action_title": data.get("action_title", ""),
        "action_description": data.get("action_description", ""),
        "why_today": data.get("why_today", ""),
        "suggested_ucdm_lesson": data.get("suggested_ucdm_lesson"),
        "suggested_inner_child_id": data.get("suggested_inner_child_id"),
        "estimated_minutes": data.get("estimated_minutes", 15),
        "completion_criteria": data.get("completion_criteria", ""),
        "completed": False,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.journey_daily.insert_one(dict(guidance_doc))
    return guidance_doc


@api_router.post("/journey/today/complete")
async def complete_today(user: str = Depends(verify_token)):
    today = date.today().isoformat()
    res = await db.journey_daily.update_one(
        {"date": today},
        {"$set": {"completed": True, "completed_at": datetime.now(timezone.utc).isoformat()}},
    )
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="No hay guía de hoy")
    return {"ok": True}


@api_router.get("/journey/progress")
async def journey_progress(user: str = Depends(verify_token)):
    """Estadísticas de progreso en la ruta."""
    roadmap = await db.journey_roadmap.find_one({"id": "owner"}, {"_id": 0})
    if not roadmap:
        return {"has_roadmap": False}

    # Días completados
    completed = await db.journey_daily.count_documents({"completed": True})
    total_days = await db.journey_daily.count_documents({})
    total_planned = sum(p.get("duration_days", 21) for p in roadmap.get("phases", []))

    try:
        started = date.fromisoformat(roadmap.get("started_at", date.today().isoformat()))
    except Exception:
        started = date.today()
    days_since_start = (date.today() - started).days + 1

    return {
        "has_roadmap": True,
        "current_phase": roadmap.get("current_phase", 1),
        "total_phases": len(roadmap.get("phases", [])),
        "days_completed": completed,
        "days_logged": total_days,
        "days_since_start": days_since_start,
        "total_planned_days": total_planned,
        "completion_percent": round((completed / total_planned) * 100) if total_planned else 0,
    }


class ProgressReviewRequest(BaseModel):
    pass


@api_router.post("/journey/review")
async def journey_review(user: str = Depends(verify_token)):
    """Revisión semanal por IA."""
    profile = await db.journey_profile.find_one({"id": "owner"}, {"_id": 0})
    roadmap = await db.journey_roadmap.find_one({"id": "owner"}, {"_id": 0})
    if not profile or not roadmap:
        raise HTTPException(status_code=400, detail="Completa el diagnóstico primero")

    current_phase = next(
        (p for p in roadmap["phases"] if p["number"] == roadmap.get("current_phase", 1)),
        roadmap["phases"][0],
    )

    week_start = (date.today() - timedelta(days=7)).isoformat()
    emotions = await db.emotions.find(
        {"date": {"$gte": week_start}}, {"_id": 0}
    ).to_list(50)
    journal = await db.journal.find(
        {"date": {"$gte": week_start}}, {"_id": 0}
    ).to_list(30)
    coach_count = await db.coach_sessions.count_documents({
        "created_at": {"$gte": f"{week_start}T00:00:00"}
    })
    completed_days = await db.journey_daily.count_documents({"completed": True})

    prompt = PROGRESS_REVIEW_PROMPT.format(
        profile=_json.dumps(
            {k: profile.get(k) for k in ["diagnosis", "core_patterns", "core_need", "north_star"]},
            ensure_ascii=False,
        ),
        phase=_json.dumps(current_phase, ensure_ascii=False),
        completed_days=completed_days,
        total_days=current_phase.get("duration_days", 21),
        emotions=_json.dumps(
            [{"date": e["date"], "m": e["mood"], "e": e["energy"], "s": e["stability"]} for e in emotions],
            ensure_ascii=False,
        ),
        journal=_json.dumps(
            [{"date": j["date"], "title": j["title"], "content": j["content"][:200]} for j in journal],
            ensure_ascii=False,
        ),
        coach_count=coach_count,
    )

    chat = LlmChat(
        api_key=EMERGENT_LLM_KEY,
        session_id=f"review-{date.today().isoformat()}",
        system_message=COACH_SYSTEM_PROMPT,
    ).with_model("anthropic", "claude-sonnet-4-5-20250929")

    try:
        response = await _send_with_retry(chat, UserMessage(text=prompt))
    except Exception as e:
        logging.exception("Error review")
        raise HTTPException(status_code=500, detail=f"Error IA: {str(e)}")

    review_doc = {
        "id": str(uuid.uuid4()),
        "date": date.today().isoformat(),
        "content": response,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.journey_reviews.insert_one(dict(review_doc))
    return review_doc


@api_router.get("/journey/reviews")
async def list_reviews(user: str = Depends(verify_token)):
    items = await db.journey_reviews.find({}, {"_id": 0}).sort("created_at", -1).to_list(50)
    return items


@api_router.delete("/journey/reset")
async def reset_journey(user: str = Depends(verify_token)):
    """Reinicia el diagnóstico y la ruta (útil para empezar de nuevo)."""
    await db.journey_profile.delete_many({"id": "owner"})
    await db.journey_roadmap.delete_many({"id": "owner"})
    await db.journey_daily.delete_many({})
    await db.journey_reviews.delete_many({})
    return {"ok": True}


# ============ HEALTH ============
@api_router.get("/")
async def root():
    return {"app": "Milagros Transformacional", "ok": True}


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()

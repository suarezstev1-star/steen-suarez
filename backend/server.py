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
from prompts import COACH_SYSTEM_PROMPT, LESSON_INSIGHT_PROMPT_TEMPLATE, INNER_CHILD_EXERCISES


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
            system_message=COACH_SYSTEM_PROMPT,
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
        system_message=COACH_SYSTEM_PROMPT,
    ).with_model("anthropic", "claude-sonnet-4-5-20250929")

    # Replay history para reconstruir el contexto (todos menos el último user message que acabamos de guardar)
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

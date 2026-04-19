"""
Backend tests for Milagros Transformacional App.
Tests: auth, lessons, coach (Claude AI), habits, emotions, journal, planner, inner-child, metrics.
"""
import os
import time
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://milagros-journey.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"
PASSWORD = "milagros2026"

AI_TIMEOUT = 120  # seconds, Claude Sonnet calls can be slow


# ---------- Fixtures ----------
@pytest.fixture(scope="session")
def token():
    r = requests.post(f"{API}/auth/login", json={"password": PASSWORD}, timeout=15)
    assert r.status_code == 200, f"login failed: {r.status_code} {r.text}"
    return r.json()["token"]


@pytest.fixture(scope="session")
def auth_headers(token):
    return {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}


# ---------- Health ----------
def test_health_root():
    r = requests.get(f"{API}/", timeout=10)
    assert r.status_code == 200
    j = r.json()
    assert j.get("ok") is True


# ---------- Auth ----------
class TestAuth:
    def test_login_success(self):
        r = requests.post(f"{API}/auth/login", json={"password": PASSWORD}, timeout=15)
        assert r.status_code == 200
        assert isinstance(r.json().get("token"), str)
        assert len(r.json()["token"]) > 20

    def test_login_wrong_password(self):
        r = requests.post(f"{API}/auth/login", json={"password": "wrong"}, timeout=15)
        assert r.status_code == 401

    def test_verify_valid(self, auth_headers):
        r = requests.get(f"{API}/auth/verify", headers=auth_headers, timeout=15)
        assert r.status_code == 200
        j = r.json()
        assert j.get("ok") is True
        assert j.get("user") == "owner"

    def test_verify_invalid_token(self):
        r = requests.get(f"{API}/auth/verify",
                         headers={"Authorization": "Bearer invalid.token.here"}, timeout=15)
        assert r.status_code == 401

    def test_verify_missing_token(self):
        r = requests.get(f"{API}/auth/verify", timeout=15)
        assert r.status_code in (401, 403)


# ---------- Lessons ----------
class TestLessons:
    def test_list_365_lessons(self, auth_headers):
        r = requests.get(f"{API}/lessons", headers=auth_headers, timeout=20)
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)
        assert len(data) == 365
        assert data[0]["day"] == 1
        assert isinstance(data[0]["title"], str) and len(data[0]["title"]) > 0

    def test_lesson_today(self, auth_headers):
        r = requests.get(f"{API}/lessons/today", headers=auth_headers, timeout=15)
        assert r.status_code == 200
        d = r.json()
        assert 1 <= d["day"] <= 365
        assert isinstance(d["title"], str)

    def test_lesson_specific_34(self, auth_headers):
        r = requests.get(f"{API}/lessons/34", headers=auth_headers, timeout=15)
        assert r.status_code == 200
        d = r.json()
        assert d["day"] == 34
        # From course_data: 34 => "Podría ver paz en lugar de esto."
        assert "paz" in d["title"].lower()

    def test_lesson_out_of_range(self, auth_headers):
        r = requests.get(f"{API}/lessons/999", headers=auth_headers, timeout=15)
        assert r.status_code == 400

    def test_lesson_insight_generates_and_caches(self, auth_headers):
        # Use day 34 (requested) — may already be cached from prior runs; that's fine.
        t0 = time.time()
        r1 = requests.get(f"{API}/lessons/34/insight", headers=auth_headers, timeout=AI_TIMEOUT)
        t1 = time.time() - t0
        assert r1.status_code == 200, f"first insight failed: {r1.text}"
        d1 = r1.json()
        assert d1["day"] == 34
        assert isinstance(d1["insight"], str)
        assert len(d1["insight"]) > 200, "insight too short"
        # Content quality: Spanish + at least one of the expected frameworks
        lower = d1["insight"].lower()
        quality_markers = ["pnl", "tony", "robbins", "ucdm", "curso", "milagro", "biblia",
                           "perdón", "salto", "cuántico", "anclaje", "creencia"]
        hits = sum(1 for m in quality_markers if m in lower)
        assert hits >= 2, f"insight lacks expected framework markers (hits={hits}): {d1['insight'][:300]}"

        # Second call: should be cached (fast, identical)
        t2 = time.time()
        r2 = requests.get(f"{API}/lessons/34/insight", headers=auth_headers, timeout=30)
        t3 = time.time() - t2
        assert r2.status_code == 200
        d2 = r2.json()
        assert d2["insight"] == d1["insight"], "cached insight differs from first"
        # Cached call must be significantly faster than 10s
        assert t3 < 10, f"second call not cached (took {t3:.1f}s vs first {t1:.1f}s)"


# ---------- Coach (Claude AI) ----------
class TestCoach:
    def test_session_crud_and_multiturn(self, auth_headers):
        # Create session WITH initial context -> triggers diagnostic AI message
        payload = {
            "title": "TEST_sesion_diagnostica",
            "initial_context": "Me siento ansioso por un proyecto nuevo en el trabajo y tengo miedo al fracaso.",
        }
        r = requests.post(f"{API}/coach/sessions", json=payload, headers=auth_headers, timeout=AI_TIMEOUT)
        assert r.status_code == 200, r.text
        sess = r.json()
        sid = sess["id"]
        assert isinstance(sid, str) and len(sid) > 10
        assert sess["title"] == "TEST_sesion_diagnostica"

        # List sessions
        r = requests.get(f"{API}/coach/sessions", headers=auth_headers, timeout=20)
        assert r.status_code == 200
        assert any(s["id"] == sid for s in r.json())

        # Get messages - diagnostic should be there
        r = requests.get(f"{API}/coach/sessions/{sid}/messages", headers=auth_headers, timeout=20)
        assert r.status_code == 200
        msgs = r.json()
        assert len(msgs) >= 1, "diagnostic message missing"
        assert msgs[0]["role"] == "assistant"
        assert len(msgs[0]["content"]) > 100

        # Send a user message that references something specific for context test
        r = requests.post(
            f"{API}/coach/message",
            json={"session_id": sid, "content": "Mi color favorito es el azul profundo. Recuérdalo."},
            headers=auth_headers, timeout=AI_TIMEOUT,
        )
        assert r.status_code == 200, r.text
        a1 = r.json()
        assert a1["role"] == "assistant"
        assert len(a1["content"]) > 20

        # Follow-up referencing the color -> context should persist
        r = requests.post(
            f"{API}/coach/message",
            json={"session_id": sid, "content": "¿Cuál es mi color favorito que te mencioné?"},
            headers=auth_headers, timeout=AI_TIMEOUT,
        )
        assert r.status_code == 200, r.text
        a2 = r.json()
        assert "azul" in a2["content"].lower(), f"context not preserved: {a2['content'][:300]}"

        # History now has at least 4 messages (diagnostic + 2 user + 2 assistant)
        r = requests.get(f"{API}/coach/sessions/{sid}/messages", headers=auth_headers, timeout=20)
        assert r.status_code == 200
        msgs = r.json()
        assert len(msgs) >= 4

        # Delete
        r = requests.delete(f"{API}/coach/sessions/{sid}", headers=auth_headers, timeout=15)
        assert r.status_code == 200
        # Verify deletion
        r = requests.get(f"{API}/coach/sessions/{sid}/messages", headers=auth_headers, timeout=15)
        assert r.status_code == 200
        assert r.json() == []

    def test_message_invalid_session(self, auth_headers):
        r = requests.post(
            f"{API}/coach/message",
            json={"session_id": "nonexistent-xxxx", "content": "hola"},
            headers=auth_headers, timeout=15,
        )
        assert r.status_code == 404


# ---------- Habits ----------
class TestHabits:
    created_id = None

    def test_create_habit(self, auth_headers):
        r = requests.post(f"{API}/habits",
                          json={"name": "TEST_Meditar", "icon": "sparkle", "target_per_week": 7},
                          headers=auth_headers, timeout=15)
        assert r.status_code == 200
        h = r.json()
        assert h["name"] == "TEST_Meditar"
        assert h["target_per_week"] == 7
        TestHabits.created_id = h["id"]

    def test_list_habits_contains(self, auth_headers):
        r = requests.get(f"{API}/habits", headers=auth_headers, timeout=15)
        assert r.status_code == 200
        assert any(h["id"] == TestHabits.created_id for h in r.json())

    def test_checkin_toggle(self, auth_headers):
        hid = TestHabits.created_id
        r = requests.post(f"{API}/habits/{hid}/checkin", headers=auth_headers, timeout=15)
        assert r.status_code == 200
        assert r.json()["done"] is True
        # Toggle off
        r = requests.post(f"{API}/habits/{hid}/checkin", headers=auth_headers, timeout=15)
        assert r.status_code == 200
        assert r.json()["done"] is False

    def test_week_checkins(self, auth_headers):
        r = requests.get(f"{API}/habits/checkins/week", headers=auth_headers, timeout=15)
        assert r.status_code == 200
        j = r.json()
        assert "checkins" in j and "start" in j and "end" in j

    def test_delete_habit(self, auth_headers):
        r = requests.delete(f"{API}/habits/{TestHabits.created_id}", headers=auth_headers, timeout=15)
        assert r.status_code == 200
        r = requests.get(f"{API}/habits", headers=auth_headers, timeout=15)
        assert not any(h["id"] == TestHabits.created_id for h in r.json())


# ---------- Emotions ----------
class TestEmotions:
    def test_create_and_list(self, auth_headers):
        r = requests.post(f"{API}/emotions",
                          json={"mood": 7, "energy": 6, "stability": 8, "note": "TEST_bien"},
                          headers=auth_headers, timeout=15)
        assert r.status_code == 200
        e = r.json()
        assert e["mood"] == 7 and e["energy"] == 6 and e["stability"] == 8

        r = requests.get(f"{API}/emotions", headers=auth_headers, timeout=15)
        assert r.status_code == 200
        assert any(x["id"] == e["id"] for x in r.json())


# ---------- Journal ----------
class TestJournal:
    def test_crud(self, auth_headers):
        r = requests.post(f"{API}/journal",
                          json={"title": "TEST_dia",
                                "content": "Hoy reflexioné mucho.",
                                "gratitude": ["salud", "familia"],
                                "wins": ["caminé 30min"],
                                "lessons": ["ser paciente"]},
                          headers=auth_headers, timeout=15)
        assert r.status_code == 200
        j = r.json()
        assert j["gratitude"] == ["salud", "familia"]
        jid = j["id"]

        # list — sorted desc
        r = requests.get(f"{API}/journal", headers=auth_headers, timeout=15)
        assert r.status_code == 200
        ids = [x["id"] for x in r.json()]
        assert jid in ids

        # delete
        r = requests.delete(f"{API}/journal/{jid}", headers=auth_headers, timeout=15)
        assert r.status_code == 200
        r = requests.get(f"{API}/journal", headers=auth_headers, timeout=15)
        assert jid not in [x["id"] for x in r.json()]


# ---------- Planner ----------
class TestPlanner:
    def test_crud_and_toggle(self, auth_headers):
        from datetime import date
        today_str = date.today().isoformat()
        r = requests.post(f"{API}/planner",
                          json={"date": today_str, "hour": 9, "activity": "TEST_Meditación", "category": "spiritual"},
                          headers=auth_headers, timeout=15)
        assert r.status_code == 200
        b = r.json()
        assert b["hour"] == 9 and b["done"] is False
        bid = b["id"]

        r = requests.get(f"{API}/planner", params={"date_str": today_str},
                         headers=auth_headers, timeout=15)
        assert r.status_code == 200
        assert any(x["id"] == bid for x in r.json())

        r = requests.patch(f"{API}/planner/{bid}/toggle", headers=auth_headers, timeout=15)
        assert r.status_code == 200
        assert r.json()["done"] is True

        r = requests.delete(f"{API}/planner/{bid}", headers=auth_headers, timeout=15)
        assert r.status_code == 200


# ---------- Inner Child ----------
class TestInnerChild:
    def test_exercises_6(self, auth_headers):
        r = requests.get(f"{API}/inner-child/exercises", headers=auth_headers, timeout=15)
        assert r.status_code == 200
        ex = r.json()["exercises"]
        assert isinstance(ex, list)
        assert len(ex) == 6

    def test_log_crud(self, auth_headers):
        r = requests.get(f"{API}/inner-child/exercises", headers=auth_headers, timeout=15)
        first = r.json()["exercises"][0]
        ex_id = first.get("id") or first.get("title", "ex1")

        r = requests.post(f"{API}/inner-child/log",
                          json={"exercise_id": str(ex_id), "reflection": "TEST_reflexion profunda"},
                          headers=auth_headers, timeout=15)
        assert r.status_code == 200
        lg = r.json()
        assert lg["reflection"] == "TEST_reflexion profunda"

        r = requests.get(f"{API}/inner-child/logs", headers=auth_headers, timeout=15)
        assert r.status_code == 200
        assert any(x["id"] == lg["id"] for x in r.json())


# ---------- Metrics ----------
class TestMetrics:
    def test_dashboard(self, auth_headers):
        r = requests.get(f"{API}/metrics/dashboard", headers=auth_headers, timeout=20)
        assert r.status_code == 200
        m = r.json()
        assert "habits" in m and "emotions" in m and "growth" in m
        for k in ("total", "week_completed", "week_target", "completion_rate"):
            assert k in m["habits"]
        for k in ("mood_avg", "energy_avg", "stability_avg", "streak", "series_14d"):
            assert k in m["emotions"]
        assert len(m["emotions"]["series_14d"]) == 14
        for k in ("lessons_studied", "journal_entries", "inner_child_logs", "coach_sessions"):
            assert k in m["growth"]
        assert 1 <= m["day_of_year"] <= 366
        assert 0 <= m["year_progress"] <= 100

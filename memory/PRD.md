# Milagros — App de Transformación Personal Guiada por IA

## Problema original
> "Crear una app fácil de usar para uso personal donde pueda codificar el curso de Milagros, convertirlo en una app de organización, crecimiento personal y espiritual, con calendario hora por hora, sanación del niño interior, técnicas de PNL y coaching Tony Robbins, para lograr saltos cuánticos visibles y demostrables."

### Evolución del requerimiento
- **Iteración 1**: App base con 9 módulos (dashboard, 365 lecciones UCDM, chat coach, niño interior, planner, diario, hábitos, emociones).
- **Iteración 2 (actual)**: La IA se convierte en protagonista — no solo reactiva al chat, sino que **diagnostica, diseña la ruta y guía cada día**.

## Arquitectura
- **Backend**: FastAPI + MongoDB + JWT auth + emergentintegrations (Claude Sonnet 4.5)
- **Frontend**: React 19 + React Router 7 + Tailwind + Shadcn/UI + Recharts + Lucide
- **Tema**: Orgánico y Terroso (Bone White, Forest Green, Terracotta)

## Implementado

### Iteración 1 (19 abril 2026)
- Auth JWT con contraseña simple `milagros2026`
- 365 lecciones UCDM con decodificación IA (cacheada)
- Chat coach conversacional multi-turn
- 6 ejercicios de niño interior guiados
- Planner hora por hora con categorías
- Diario con protocolo gratitud/victorias/lecciones
- Hábitos con rachas semanales
- Check-ins emocionales con gráfica 30 días
- Dashboard Bento con métricas de saltos cuánticos

### Iteración 2 — Journey Guiada por IA (19 abril 2026)

**🧭 Nueva pieza central: Ruta de Transformación**

- `/diagnostico` — Intake guiado de 8 preguntas profundas (estado, dolor, patrón, niño interior, sueño, bloqueo, superpoder, espiritualidad)
- IA procesa respuestas y genera:
  - **Perfil transformacional**: diagnóstico, patrones núcleo, herida raíz, necesidad núcleo, superpoder, norte
  - **Hoja de ruta de 84 días**: 4 fases personalizadas con lecciones UCDM específicas, ejercicios niño interior, técnicas PNL, práctica nuclear diaria, milestone
- `/ruta` — Visualización completa del perfil + las 4 fases con progreso, lecciones clicables, milestones
- **Dashboard "Hoy tu paso es..."** — Card protagonista con guía diaria personalizada generada por IA basada en fase actual + estado emocional + hábitos
- **Coach con memoria estratégica** — El chat ahora recibe el perfil + fase actual + emociones recientes en su system message. Responde contextualmente, no genéricamente.
- **Revisiones semanales por IA** — Evalúa progreso y ajusta estrategia
- **Avance de fase** + **Reinicio de ruta** controlados

**Nuevos endpoints:**
- `GET/POST /api/journey/intake/questions|submit`
- `GET /api/journey/profile|roadmap|status|progress`
- `GET/POST /api/journey/today` + `/today/complete`
- `POST /api/journey/advance-phase|review`
- `GET /api/journey/reviews`
- `DELETE /api/journey/reset`

**Mejoras de resilencia:**
- Retry automático (2 reintentos + 2.5s backoff) en llamadas LLM críticas ante 502/timeout
- Extractor de JSON tolerante (acepta bloques ``` o texto extra)
- Caché de guía diaria por fecha
- Caché de insights de lecciones por día

### Fixes de calidad de código aplicados
- React hooks con `useCallback` + deps correctas en todas las páginas
- Context value memoizado con `useMemo` en AuthContext
- Claves estables basadas en contenido (no índices) en listas
- Constantes extraídas para toast + chart configs
- Lint: 0 issues en Python + JS/React

## Credenciales
- App password: `milagros2026`

## Cobertura de tests
- **Iteración 1**: 24/24 backend tests ✅
- **Iteración 2**: 42/43 tests ✅ (1 flaky por transient LLM 502 — mitigado con retry)

## Backlog

### P1 — Alto valor transformacional
- [ ] Recordatorios diarios push (mañana: generar guía de hoy · noche: check-in emocional)
- [ ] Al completar una fase, IA genera mensaje de celebración + vista previa de la siguiente fase
- [ ] Exportar Mi Ruta + Perfil como PDF
- [ ] Audio TTS para lecciones UCDM (OpenAI TTS)
- [ ] Ritual de mañana guiado paso a paso (priming Tony Robbins)

### P2 — Escalabilidad y calidad
- [ ] Refactor server.py (1126 líneas) → /app/backend/routers/ (auth, lessons, coach, journey, habits, metrics)
- [ ] Validación Pydantic estricta de la respuesta de IA del intake (exactly 4 phases, numbers 1-4)
- [ ] Validación servidor-side de suggested_ucdm_lesson (1-365) y suggested_inner_child_id (ic-1..ic-6)
- [ ] Progress semantics por fase vs cumulativo (clarificar)
- [ ] Summarización de contexto en sesiones largas del coach

### P3 — Features extendidas
- [ ] Migración de localStorage a cookies httpOnly (si se publica multi-user)
- [ ] Búsqueda semántica en diario
- [ ] Timeline visual "Línea de vida" con todos los eventos transformacionales
- [ ] Integración con Google Calendar para sincronizar planner
- [ ] Comparación semana vs semana anterior en dashboard

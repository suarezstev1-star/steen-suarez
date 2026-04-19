# Milagros — App de Transformación Personal

## Problema original
> "Crear una app fácil de usar para uso personal donde pueda codificar el curso de Milagros y poder entenderlo, convertir el curso en una app de organización, crecimiento personal y espiritual, convertir su calendario diario día por día hora por hora para mejorar la estabilidad emocional personal y transformacional, que integre todo lo que se necesita para la sanación del niño interior y conceptos para mejorar mi vida, mi espiritualidad y mis hábitos y productividad."

Requisitos clave añadidos por el usuario:
- Diseño profesional, PNL avanzada, coaching Tony Robbins, saltos cuánticos visibles y comparables, no genérico.
- Claude Sonnet 4.5 como coach IA.
- Contraseña simple para uso personal.
- Debe explicar lecciones del Curso de Milagros con ejemplos reales y decodificar la Biblia como profesor de crecimiento personal.
- Chat conversacional con sesiones de coaching profesional que diagnostique y diseñe planes según el estado de la persona.

## Arquitectura
- **Backend**: FastAPI + MongoDB (motor async) + JWT auth + emergentintegrations (Claude Sonnet 4.5)
- **Frontend**: React 19 + React Router 7 + Tailwind + Shadcn/UI + Recharts + Lucide
- **Tema**: "Orgánico y Terroso" — Bone white (#F9F6F0), Forest green (#1A3626), Terracotta (#C25934), Sky soft (#7BA4A8)
- **Tipografía**: Manrope (headings), IBM Plex Sans (body), Outfit (labels)

## Implementado (19 abril 2026)

### Backend — 100% verificado (24/24 tests passed)
- `POST /api/auth/login` + `GET /api/auth/verify` — JWT con password único.
- `GET /api/lessons` + `/today` + `/{day}` — 365 lecciones de UCDM en español.
- `GET /api/lessons/{day}/insight` — Claude decodifica lección con PNL + Tony Robbins + ejemplos + afirmación (cacheado en MongoDB).
- `POST/GET/DELETE /api/coach/sessions` — sesiones de coaching con diagnóstico inicial opcional por IA.
- `POST /api/coach/message` + `GET messages` — chat multi-turn con historial persistente.
- `POST/GET/DELETE /api/habits` + `/checkin` + `/checkins/week` — tracker con rachas.
- `POST/GET /api/emotions` — check-in de ánimo/energía/estabilidad (1-10) + nota.
- `POST/GET/DELETE /api/journal` — diario con gratitud/victorias/lecciones (protocolo Tony Robbins).
- `POST/GET/PATCH/DELETE /api/planner` — bloques hora por hora con categorías.
- `GET /api/inner-child/exercises` + logs — 6 ejercicios (Bradshaw, Capacchione, PNL).
- `GET /api/metrics/dashboard` — métricas agregadas (racha, %hábitos, progreso año, series temporales).

### Frontend — 9 rutas funcionales
- `/login` — Pantalla split con imagen de duna + formulario elegante.
- `/` (Dashboard) — Bento grid con lección del día, métricas de saltos cuánticos, gráfico de 14 días.
- `/curso` — Grid visual de 365 lecciones + decodificación por IA con markdown.
- `/coach` — Chat tipo ChatGPT con sidebar de sesiones y diálogo inicial diagnóstico.
- `/nino-interior` — 6 ejercicios guiados con registro de reflexión.
- `/planner` — 24 horas con categorías y completado visual.
- `/diario` — Entradas con protocolo 3 gratitudes + 3 victorias + 3 lecciones.
- `/habitos` — Grid semanal con checkboxes por día y rachas.
- `/emociones` — Sliders + gráfica área 30 días + historial.

### Integraciones
- Claude Sonnet 4.5 vía `emergentintegrations` + Emergent LLM Key.
- System prompt experto integrando UCDM, Biblia decodificada, PNL avanzada, Tony Robbins, sanación niño interior.

## Credenciales
- App password: `milagros2026`

## Backlog (Próximas iteraciones)

### P1 — Mejoras de alto valor
- [ ] Plan personalizado persistente — cuando el coach diseña un plan, guardarlo como "Plan activo" con tareas en el planner.
- [ ] Meditaciones guiadas por audio (TTS OpenAI) para las lecciones.
- [ ] Recordatorios y notificaciones diarias (mañana/noche) para check-in emocional y lección.
- [ ] Exportar diario mensual como PDF.
- [ ] Rituales de mañana/noche como flujo guiado paso a paso.

### P2 — Escalabilidad
- [ ] Summarización de contexto en sesiones largas del coach (para evitar crecimiento ilimitado del prompt).
- [ ] Refactor server.py en routers separados.
- [ ] Búsqueda semántica en diario personal.
- [ ] Insights automáticos ("Tu estabilidad subió 40% esta semana").
- [ ] Modo oscuro opcional.

### P3 — Funcionalidad extendida
- [ ] Dashboard "Línea de vida" con timeline de transformación.
- [ ] Integración con calendario externo (Google Cal).
- [ ] Backup/export completo de datos.

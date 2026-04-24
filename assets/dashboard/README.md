# DASHBOARD — TRACKING DEL FUNNEL

**Archivo:** `index.html`
**Propósito:** Vista única para Steven (admin) y EDs (limitado a su línea) de las métricas críticas del funnel completo.
**Estado:** UI funcional con stub data — pendiente conectar fuentes reales.

---

## QUÉ MIDE

### Capa 1 — IG Entrenador + Landing (top of funnel)
- Seguidores IG (orgánico)
- Visitas al landing (Meta Pixel + GA4)
- Opt-ins a la miniclase
- Conversión landing → opt-in

### Capa 2 — Skool (free + paid)
- Miembros Skool free (Arquitectos del Cierre)
- Completion rate de la miniclase (Video 3)
- Miembros Skool paid (El Taller)
- MRR (revenue mensual recurrente)
- Retención mes 2
- Miembros Nivel 4+ (la pool del puente)

### Capa 3 — Puente → Estructura → TCT
- Candidatos identificados para el puente
- 1ª llamadas de Steven agendadas
- Asignados a EDs
- Agentes nuevos firmados a TCT
- Prospectos en espera de release

### Desempeño por ED (mes actual)
- Asignados / 2ª llamadas hechas / Avanzaron / Conversión / Estado

### Economics
- Ad spend (Meta + IG)
- Revenue del curso
- Revenue de override (proyectado)
- CAC blended
- LTV alumno paid
- LTV:CAC ratio

---

## FUENTES DE DATOS REQUERIDAS

| Métrica | Fuente | Cadencia | Método |
|---|---|---|---|
| Seguidores IG | IG Insights API | Diario | API o scrape |
| Visitas Landing | GA4 + Meta Pixel | Tiempo real | API |
| Opt-ins | Email tool (ConvertKit/MailerLite) | Tiempo real | Webhook |
| Miembros Skool free / paid | Skool admin export | Semanal manual | CSV |
| Completion miniclase | Skool classroom analytics | Semanal manual | CSV |
| MRR | Stripe (vía Skool) | Tiempo real | API |
| Retención | Skool + Stripe | Mensual | Cálculo |
| Nivel 4+ | Skool gamification | Semanal manual | CSV |
| Candidatos bridge | GHL custom field `Fuente=Puente Curso TCT` | Tiempo real | API |
| 1ª/2ª llamadas | GHL pipeline | Tiempo real | API |
| Agentes nuevos TCT | Experior portal + GHL | Mensual | Manual |
| Ad spend | Meta Ads API | Diario | API |
| Revenue | Stripe + Experior | Mensual | Manual + API |

---

## ARQUITECTURA TÉCNICA — OPCIONES

### Opción 1: Estático con datos manuales (MVP, lo que este HTML hace hoy)
- Dashboard como HTML estático
- Datos hardcodeados en el JS o cargados desde `data.json` actualizado manualmente
- Steven actualiza una vez por semana
- **Pro:** zero costo, zero infraestructura
- **Con:** datos atrasados, no real-time

### Opción 2: Backend simple (recomendado mediano plazo)
- Backend en Node/Express o serverless function (Vercel/Cloudflare)
- Endpoints que consultan APIs (Stripe, GHL, Meta, etc.) con cache de 1 hora
- Frontend hace `fetch` a esos endpoints al cargar
- **Pro:** datos casi en tiempo real, escalable
- **Con:** requiere desarrollo (~2 semanas)

### Opción 3: Tools no-code (rápido pero con dependencia)
- Notion + Notion API + embeds
- Airtable + Softr
- Google Sheets + AppSheet
- **Pro:** rápido de montar
- **Con:** dependencia de SaaS, menos personalizable

### Recomendación
- Empezar con **Opción 1** (este HTML) y datos manuales semanales
- Migrar a **Opción 2** cuando el funnel produzca > 50 leads/mes y la fricción manual cueste más que el dev

---

## ROL DE ACCESO

Cuando se construya el backend con auth, los roles deben ser:

| Rol | Capa 1 | Capa 2 | Capa 3 (todos) | Capa 3 (su línea) | Economics | EDs (otros) |
|---|---|---|---|---|---|---|
| Steven (Admin) | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| ED individual | — | resumen | resumen | ✓ detallado | parcial | — |
| Community manager | ✓ | ✓ | — | — | — | — |

Esto previene que un ED vea métricas de líneas de otros EDs (anti-cross-recruiting baked in).

---

## DEPLOYMENT

### Opción mínima (lo que hay hoy)
- Abrir `index.html` directamente en navegador (file://)
- Servir desde Vercel/Netlify si se quiere URL pública

### Para producción
- Hostear bajo subdominio interno (ej. `dashboard.elarquitectodelcierre.com`)
- Auth con email/password o magic link
- HTTPS obligatorio (datos sensibles de comisiones)

---

## INTEGRACIÓN CON DOCS DEL REPO

El dashboard refleja métricas definidas en:

- `assets/curso-arquitecto/outline.md` (Sección 9 — métricas del curso)
- `assets/curso-arquitecto/miniclase-gratis.md` (Sección 7 — métricas miniclase)
- `assets/skool/setup.md` (Sección 8 — métricas a trackear)
- `assets/ig-entrenador/contenido-30-dias.md` (Sección 9 — medición IG)
- `assets/puente-curso-tct/protocolo.md` (Sección 8 — tracking puente)

Si esas secciones cambian, actualizar este dashboard también.

---

## DECISIONES PENDIENTES

- [ ] Decidir cuándo migrar de stub manual a backend real (umbral de leads/mes)
- [ ] Elegir herramienta para backend si se construye (Vercel functions vs. Cloudflare Workers vs. Express en Render)
- [ ] Configurar auth (Supabase Auth, Clerk, o magic link custom)
- [ ] Definir cadencia de update manual mientras es stub (semanal recomendado)
- [ ] Configurar Meta Pixel + GA4 en landing para que estas métricas existan
- [ ] Configurar webhooks de email tool → endpoint del dashboard
- [ ] Conectar Stripe API (vía Skool o directo)
- [ ] Decidir si el dashboard de EDs es la misma URL con permisos diferentes o una URL distinta
- [ ] Definir alertas: ¿Steven recibe email si CAC supera $200? ¿Si MRR cae 15% mes a mes?
- [ ] Histórico de datos: ¿guardar snapshots semanales para gráficas de tendencia?

# ANALYTICS TRACKING PLAN

**Propósito:** Definir cada evento que dispara cada touchpoint del funnel, con qué propiedades, en qué herramienta, y cómo se conecta al dashboard. Sin esto, el dashboard muestra ceros.
**Cobertura:** Funnel completo desde IG/Landing hasta primera póliza vendida bajo TCT.
**Estado:** Plan v1 — pendiente implementación.

---

## 1. STACK DE TRACKING

| Herramienta | Propósito | Estado |
|---|---|---|
| **Google Analytics 4 (GA4)** | Web behavior, conversion goals, funnel reports | Pendiente setup |
| **Meta Pixel + CAPI** | Optimización de Meta Ads, retargeting, lookalikes | Pendiente setup |
| **TikTok Pixel** | (Cuando se active TikTok) | No urgente |
| **Skool Analytics** | Membership, completion, engagement | Nativo |
| **Stripe** | Revenue, subscriptions, churn | Nativo (vía Skool) |
| **Email tool** (ConvertKit/MailerLite) | Email events (open, click, unsubscribe) | Pendiente setup |
| **GHL (CRM)** | Lead lifecycle, bridge tracking, ED assignment | Existente |
| **Segment / Webhook orquestador** | Centralizar eventos a una fuente única | Opcional, recomendado a partir de M3 |

---

## 2. EVENTOS — TAXONOMÍA COMPLETA

Naming convention: `snake_case`, verbo en pasado o estado completo (`signed_up`, `purchased`, `completed`).

### CAPA 1 — Top of funnel

| Evento | Cuándo dispara | Dónde | Propiedades |
|---|---|---|---|
| `landing_view` | Carga de landing | GA4, Meta Pixel | `utm_source`, `utm_medium`, `utm_campaign`, `referrer` |
| `landing_form_started` | Usuario hace focus en primer campo | GA4 | `field`, `time_on_page` |
| `landing_form_submitted` | Submit exitoso del form | GA4, Meta Pixel (`Lead`), email tool (subscribe) | `email`, `nombre`, `estado`, `utm_*` |
| `landing_form_abandoned` | Usuario llena 1+ campo y sale sin submit | GA4 | `fields_filled`, `time_on_page` |

### CAPA 2 — Miniclase + comunidad gratis

| Evento | Cuándo dispara | Dónde |
|---|---|---|
| `email_optin_confirmed` | Usuario confirma email (double opt-in si aplica) | Email tool, GA4 |
| `skool_free_joined` | Cuenta Skool free creada | Skool webhook → GA4 |
| `miniclass_video_started` | Reproduce el video (cualquiera de los 3) | Skool nativo + custom event si embed externo |
| `miniclass_video_completed` | 90%+ del video visto | Skool nativo |
| `workbook_downloaded` | Click en download del workbook | GA4 (custom event) |
| `email_opened` | Open de cada email del drip | Email tool nativo |
| `email_clicked` | Click en link de email | Email tool nativo |
| `community_post_created` | Miembro postea en Skool free | Skool nativo |
| `comment_left` | Comenta en post | Skool nativo |

### CAPA 3 — El Taller (paid)

| Evento | Cuándo dispara | Dónde |
|---|---|---|
| `taller_landing_view` | Visita a sales page del Taller | GA4, Meta Pixel |
| `checkout_started` | Click en botón de comprar | GA4, Meta Pixel (`InitiateCheckout`) |
| `taller_purchased` | Pago confirmado | Stripe webhook, GA4 (`purchase`), Meta Pixel (`Purchase`) — propiedades: `offer_type` (monthly/annual/lifetime), `value`, `currency` |
| `subscription_canceled` | Cancela suscripción | Stripe webhook |
| `payment_failed` | Pago recurrente falla | Stripe webhook → dunning workflow |
| `module_started` | Inicia un módulo del curso | Skool nativo |
| `module_completed` | Completa un módulo | Skool nativo — propiedad: `module_number` |
| `level_up` | Sube de nivel en Skool | Skool nativo — propiedad: `new_level` |
| `live_attended` | Asiste a Q&A live | Skool calendario |

### CAPA 4 — Puente y TCT

Estos eventos son administrativos (no public-facing). Fuente: GHL.

| Evento | Cuándo dispara | Dónde |
|---|---|---|
| `bridge_candidate_flagged` | Steven identifica al alumno como candidato | GHL custom field actualizado |
| `bridge_call_1_booked` | Alumno agenda 1ª llamada vía Calendly | GHL workflow (Calendly webhook) |
| `bridge_call_1_completed` | Steven marca la llamada como hecha | GHL update manual |
| `bridge_call_1_outcome` | Resultado: avanza/declina/espera-release | GHL custom field — propiedad: `outcome` |
| `bridge_assigned_to_ed` | Steven asigna a un ED específico | GHL — propiedad: `ed_name` |
| `bridge_call_2_booked` | Alumno agenda con ED | GHL/Calendly |
| `bridge_call_2_completed` | ED marca como hecha | GHL update manual |
| `bridge_call_2_outcome` | Resultado: signs/needs-time/declines/needs-release | GHL — propiedades: `outcome`, `notes_summary` |
| `tct_agent_contracted` | Firma contrato Experior | GHL update manual + Experior data |
| `tct_first_policy_sold` | Primera póliza emitida | Experior portal data — propiedad: `carrier`, `premium`, `product_type` |

---

## 3. UTM CONVENTION

Estandarización para que cada lead llegue con su origen identificable.

```
utm_source     — De dónde viene (canal)
utm_medium     — Qué tipo de touchpoint
utm_campaign   — Qué campaña específica
utm_content    — Variante del creative (para A/B testing)
utm_term       — Solo para search ads (keyword)
```

### Valores permitidos

| Param | Valores válidos |
|---|---|
| `utm_source` | `ig`, `fb`, `tiktok`, `youtube`, `email`, `organic`, `direct`, `whatsapp`, `bio_link`, `referral` |
| `utm_medium` | `post`, `story`, `reel`, `dm`, `paid`, `bio`, `email_drip`, `email_broadcast`, `signature`, `referral_link` |
| `utm_campaign` | `miniclase_launch_2026q2`, `taller_launch_2026q2`, `bridge_recruit_2026q2` |
| `utm_content` | ID del creative específico (ej: `reel_001`, `ad_carousel_v3`, `email_drip_email_6`) |

### Ejemplos
```
https://elarquitectodelcierre.com/?utm_source=ig&utm_medium=reel&utm_campaign=miniclase_launch_2026q2&utm_content=reel_001_arquitectura
https://elarquitectodelcierre.com/?utm_source=email&utm_medium=email_drip&utm_campaign=miniclase_launch_2026q2&utm_content=email_6_invite_taller
https://elarquitectodelcierre.com/?utm_source=fb&utm_medium=paid&utm_campaign=taller_launch_2026q2&utm_content=ad_v3_floor_cap_hook
```

### Regla operativa
- **Cada link compartido fuera del sitio lleva UTM.** Sin excepción.
- Hay un script (sheet o tool) para generar UTMs consistentes — se llama "UTM Builder" — pendiente crear.

---

## 4. CONVERSION GOALS — GA4

Configurar como `conversion events` en GA4 (estos son los que importan):

1. `landing_form_submitted` (lead)
2. `email_optin_confirmed` (qualified lead)
3. `miniclass_video_completed` con `video_number = 3` (engagement)
4. `taller_purchased` (revenue) — valor monetario incluido
5. `bridge_call_1_booked` (high-intent signal)
6. `tct_agent_contracted` (final outcome)

---

## 5. META PIXEL — STANDARD EVENTS

Mapeo a eventos estándar de Meta para optimización de campañas:

| Funnel event | Meta Pixel event |
|---|---|
| `landing_view` | `PageView` (auto) |
| `landing_form_submitted` | `Lead` |
| `email_optin_confirmed` | `CompleteRegistration` |
| `taller_landing_view` | `ViewContent` (con `content_name = "El Taller"`) |
| `checkout_started` | `InitiateCheckout` |
| `taller_purchased` | `Purchase` (con `value` y `currency`) |

### CAPI (Conversion API)
Implementar **CAPI server-side** además de Pixel client-side. Razón: iOS 14.5+ + bloqueo de cookies de terceros = Pixel solo se pierde 30-50% de eventos. CAPI los recupera.

### Custom audiences clave (crear desde día 1)
- Visitantes landing últimos 30 días
- Opt-ins miniclase (lookalike seed)
- Compradores Taller (lookalike seed)
- Visitas Taller landing pero no compra (retargeting)
- Email openers que no compraron

---

## 6. EMAIL TOOL — EVENTOS NATIVOS

Independiente del tool (ConvertKit / MailerLite / ActiveCampaign), debe estar configurado para emitir webhooks por:

- `subscriber_added` → push a GA4 + Skool join automation
- `subscriber_unsubscribed` → push a GA4 + GHL
- `email_opened` → push a CRM para scoring
- `email_clicked` → push a CRM para tagging

### Tagging strategy (para segmentación)
- `miniclase_video_1_watched`
- `miniclase_video_2_watched`
- `miniclase_video_3_watched`
- `miniclase_completed`
- `taller_purchased_monthly`
- `taller_purchased_annual`
- `taller_purchased_lifetime`
- `taller_canceled`
- `bridge_candidate`
- `tct_agent`

---

## 7. SKOOL — DATA EXPORT

Skool tiene UI de analytics nativa pero limitada. Para datos completos:

### Manual (semanal)
- Export de miembros con: nivel, fecha join, % completion, último login
- Export de comentarios y posts
- Import a Sheets para análisis

### Vía Zapier/Make
- Trigger: nuevo miembro / nivel up / pago / cancelación
- Action: push evento a GA4 + GHL + email tool

---

## 8. GHL — INTEGRACIÓN CRM

GHL es la fuente única para Capa 4 (puente y TCT). Custom fields requeridos:

```
- fuente (text): "Puente Curso TCT" / "Lead Cold" / "Referral"
- bridge_status (dropdown): "Identificado" / "1ª llamada agendada" / "1ª llamada hecha" / "Espera release" / "Asignado ED" / "2ª llamada agendada" / "2ª llamada hecha" / "Contratado" / "Declinó"
- ed_asignado (dropdown): Marascia / Estrada / Solino / Rojas / Solano
- imo_actual (text)
- producción_declarada (number)
- bridge_call_1_date (date)
- bridge_call_2_date (date)
- bridge_call_outcome_notes (long text)
```

### Webhooks GHL → resto del stack
- Cuando `bridge_status = "Contratado"`: enviar a GA4 (`tct_agent_contracted`)
- Cuando `bridge_status = "1ª llamada agendada"`: notificación interna a Steven

---

## 9. DASHBOARD — INTEGRACIÓN

El dashboard (`assets/dashboard/index.html`) hoy tiene stub data. Para conectar real:

### Opción 1 — Manual (MVP, primeros 90 días)
- Cada lunes Steven (o asistente) hace export manual de:
  - GA4 (visitas, opt-ins, conversiones)
  - Skool (miembros, completion, MRR)
  - GHL (candidatos bridge, llamadas, contratados)
  - Stripe (revenue, churn)
- Pega en `dashboard/data.json`
- Dashboard se refresca al cargar

### Opción 2 — Automatizado (recomendado a partir de M3)
- Backend: Vercel Function que cada 1h consulta:
  - GA4 Reporting API
  - Stripe API
  - Skool admin API (si existe) o scrape autorizado
  - GHL API
  - Meta Marketing API
- Cache en Supabase (free tier suficiente)
- Dashboard hace fetch a la function

---

## 10. PRIVACY Y COMPLIANCE DE TRACKING

### GDPR / CCPA
- Cookie banner en landing (proveedor: Cookiebot, OneTrust, o custom simple)
- Consentimiento explícito antes de cargar Pixel + GA4 (modo restrictivo)
- Pixel y GA4 deben respetar `Do Not Track` y `IAB TCF v2` señales

### Política de privacidad
- Página `/privacidad` debe listar:
  - Qué datos colectamos
  - Qué herramientas usamos (GA4, Meta Pixel, ConvertKit, Skool, Stripe)
  - Cómo se usan
  - Cómo el usuario puede solicitar borrado
- Pendiente publicar (referenciada en footer de landing)

### Email — CAN-SPAM / GDPR
- Footer obligatorio con desuscripción funcional (ya en `emails/drip-miniclase.md`)
- Single opt-in legal en US, double opt-in recomendado para mejor calidad de lista

---

## 11. QA / VALIDACIÓN

Antes de considerar el tracking "live":

- [ ] Test del form de landing en modo incógnito → verificar que dispare `Lead` en Meta Events Manager
- [ ] Test de UTM en link → llegar a GA4 con los params correctos
- [ ] Test de compra en modo test de Stripe → verificar `Purchase` en Meta + GA4
- [ ] Test de Skool join → verificar evento llega
- [ ] Test de email open + click → verificar webhook llega
- [ ] Test de cambio de `bridge_status` en GHL → verificar evento downstream

Documentar cada test con screenshot en `assets/analytics/qa-log/` (por crear).

---

## 12. ROADMAP DE IMPLEMENTACIÓN

### Semana 1 — Fundación
- [ ] Crear cuenta GA4 + property + data stream
- [ ] Crear Meta Business Manager + Pixel + Conversion API
- [ ] Configurar email tool elegido + webhooks
- [ ] Setup GHL custom fields del puente
- [ ] Publicar política de privacidad + cookie banner

### Semana 2 — Wiring
- [ ] Insertar GA4 + Meta Pixel en landing
- [ ] Conectar form de landing a email tool
- [ ] Conectar email tool → Skool join automation (vía Zapier o nativo)
- [ ] Conectar Stripe → eventos de revenue

### Semana 3 — Eventos custom
- [ ] Configurar custom events en GA4 (los del Capa 2 y 4)
- [ ] Configurar custom audiences en Meta
- [ ] Configurar UTM Builder (sheet o tool)

### Semana 4 — QA
- [ ] Ejecutar checklist de Sección 11
- [ ] Documentar bugs/gaps
- [ ] Marcar tracking como "live" cuando todo pase

---

## 13. DECISIONES PENDIENTES

- [ ] Elegir email tool (ConvertKit vs. MailerLite vs. ActiveCampaign)
- [ ] Decidir si usar Segment como orquestador (recomendado a partir de volumen)
- [ ] Comprar/configurar tool de cookie banner (Cookiebot $14/mo, o custom)
- [ ] Decidir si publicar política de privacidad propia o usar generador
- [ ] Decidir frecuencia de update manual del dashboard (semanal vs. diario)
- [ ] Definir KPI weekly review meeting (¿quiénes asisten? ¿cuándo?)
- [ ] Identificar persona responsable de monitorear tracking (Steven o asistente)

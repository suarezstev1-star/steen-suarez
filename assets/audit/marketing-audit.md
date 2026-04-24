# AUDIT — REVISIÓN DE MARKETING vs. SKILLS DISPONIBLES

**Fecha:** 2026-04-24
**Propósito:** Mapear los 14 archivos construidos contra los 35 skills de marketing disponibles. Identificar gaps por prioridad. Definir qué falta antes de lanzar y qué se construye después.

---

## 1. LO QUE YA ESTÁ CUBIERTO ✓

| Skill aplicable | Archivo(s) | Cobertura |
|---|---|---|
| `product-marketing-context` | `ig-entrenador/posicionamiento.md` | Completo (ICP dual, voz, anti-target) |
| `lead-magnets` | `curso-arquitecto/miniclase-gratis.md` + `miniclase-scripts/*` | Completo (diseño + 3 scripts listos) |
| `email-sequence` | `emails/drip-miniclase.md` | Una secuencia (8 emails). Falta post-compra y post-cancel |
| `social-content` | `ig-entrenador/contenido-30-dias.md` | Solo IG. Falta TikTok, Facebook, WhatsApp |
| `copywriting` | `landing/index.html` + `emails/*` + `miniclase-scripts/*` | Completo para los assets actuales |
| `pricing-strategy` | `curso-arquitecto/outline.md` + `skool/setup.md` | Decidido pero no validado con encuesta a mercado |
| `page-cro` | `landing/index.html` | Una sola página (la del opt-in) |
| `form-cro` | `landing/index.html` | Form de 3 campos (nombre + email + estado), básico pero correcto |
| `marketing-psychology` | Todo (anti-target, voz Arquitecto, indiferencia en cierre) | Embedded transversalmente |
| `onboarding-cro` | `skool/setup.md` (sección onboarding miembro) | Cubierto para Skool |
| `sales-enablement` | `puente-curso-tct/protocolo.md` + `capacitacion-eds/protocolo-puente.md` | Completo para conversación de carrera |
| `analytics-tracking` | `dashboard/README.md` | Spec de fuentes pero falta plan completo de eventos GA4/Meta Pixel |
| `compliance` (no es skill, es transversal) | `compliance/*` + en cada doc | Completo |

---

## 2. LO QUE ESTÁ A MEDIAS ⚠

| Skill | Qué falta |
|---|---|
| `email-sequence` | Secuencia post-compra (alumno El Taller) + secuencia post-cancel + secuencia "fría" para reactivar lista inactiva |
| `social-content` | Contenido para TikTok (mercado latino fuerte ahí), Facebook (audiencia 35+), WhatsApp Business (canal 1:1 latino dominante) |
| `analytics-tracking` | Tracking plan completo: lista de eventos a disparar (signup, video_completion, course_purchase, bridge_call_booked, etc.) + setup detallado de GA4 + Meta Pixel + UTM strategy |
| `pricing-strategy` | Validación con encuesta a 10–20 agentes reales (¿$497 es el precio correcto? ¿$47/mo es el precio correcto?) |
| `page-cro` | Solo hay landing del opt-in. Falta página del Taller (sales page del curso paid), página de "gracias" post-opt-in, página About |

---

## 3. LO QUE FALTA COMPLETAMENTE ✗

### 🔴 ALTA PRIORIDAD (bloquea lanzamiento o revenue)

| # | Skill | Qué se necesita | Por qué bloquea |
|---|---|---|---|
| 1 | `paid-ads` | Estrategia completa de Meta Ads: estructura de campañas, audiencias, presupuesto, escalamiento, reglas de pausa | Sin esto, el funnel solo crece orgánico — meta de 100 opt-ins/mes en M1 no se cumple |
| 2 | `ad-creative` | 5–10 variantes de copy de ads + briefs visuales (hooks, beneficios, anti-targets) en voz El Arquitecto | Sin variantes, no hay testing — primera campaña tira el presupuesto a un solo creativo |
| 3 | `ab-test-setup` | Plan de A/B tests para landing (hero, CTA, form fields), emails (asuntos), ofertas (precio Taller) | Sin testing, conversion rate se asume — y suele estar 30% por debajo de lo posible |
| 4 | `launch-strategy` | Plan de lanzamiento del Taller: pre-launch (lista de espera), founders' offer (primeros 20 a $197), open cart, close cart, post-launch | Sin orquestación, lanzas a una lista vacía y conviertes 1% en vez de 8% |
| 5 | `paywall-upgrade-cro` | Diseño específico del momento Skool free → Skool paid (qué se ve, cuándo aparece, cómo se justifica el upgrade) | El upgrade es donde se hace el dinero — sin diseño, los free se quedan free |
| 6 | `analytics-tracking` (completo) | Tracking plan detallado de eventos + UTM convention + dashboard real-time | Sin esto el dashboard es ficción — no sabes qué funciona |

### 🟡 MEDIA PRIORIDAD (post-launch optimization)

| # | Skill | Qué se necesita | Por qué importa |
|---|---|---|---|
| 7 | `customer-research` | Validación del ICP con: (a) entrevistas 1:1 a 10 agentes, (b) review mining de Reddit/forums donde están los agentes latinos, (c) análisis de comentarios actuales en IG TCT | Hoy estás operando con suposiciones de Steven. Validar baja riesgo de armar el funnel para el cliente equivocado |
| 8 | `churn-prevention` | Estrategia para retención de Skool paid: cancellation flow, save offers, dunning para failed payments, win-back sequence | Skool churn típico es 8–12%/mes. Sin esto, el MRR de M6 ($9,400 meta) se erosiona rápido |
| 9 | `content-strategy` | Estrategia de contenido más allá de IG: blog del Arquitecto (SEO), YouTube (long-form), podcast (autoridad sostenida), TikTok | IG por sí solo es vulnerable (algoritmo, ban, etc.). Diversificar es defensivo |
| 10 | `seo-audit` + `programmatic-seo` + `ai-seo` | Auditoría SEO de la landing + plan de blog con keywords de cola larga + optimización para AI search (ChatGPT, Perplexity, Claude) | Tráfico orgánico = leads gratis. Hoy el funnel no tiene fuente orgánica de SEO |
| 11 | `referral-program` | Sistema para incentivar a alumnos del Taller a referir a otros agentes (descuento, comisión, status) | Refer a friend en cursos de ventas baja CAC 30–50%. Gratis si se diseña bien |
| 12 | `free-tool-strategy` | Identificar 1–2 herramientas gratis útiles para el ICP (ej: "Calculadora de comisiones por carrier", "Test de aptitud para agente", "Comparador cautivo vs. brokerage") | Tools = SEO + backlinks + lead gen pasivo. Alto leverage, una vez construidas |
| 13 | `onboarding-cro` (alumno paid) | Onboarding específico del nuevo comprador del Taller (primeras 48 horas), no solo del miembro Skool free | Activación del primer módulo en 48h predice retención mes 3. Hoy no está diseñado |

### 🟢 BAJA PRIORIDAD (nice to have)

| # | Skill | Qué se necesita | Cuándo |
|---|---|---|---|
| 14 | `cold-email` | Secuencia de outreach 1:1 a agentes específicos en LinkedIn/IG (perfiles públicos cautivos) | Después de validar Meta Ads. Outreach manual no escala — pero puede dar primeros 50 alumnos rápido |
| 15 | `popup-cro` | Exit-intent popup en landing (rescate de usuarios que se van sin opt-in) | Solo cuando tráfico > 1,000 visitas/mes (sin volumen, popups son ruido) |
| 16 | `signup-flow-cro` | Refinamiento del form actual (¿2 pasos? ¿social login?) | Solo si A/B test inicial muestra fricción en el form actual |
| 17 | `site-architecture` | Sitemap completo: blog, recursos, casos, sobre, etc. | Cuando se lance blog (Fase 2) |
| 18 | `schema-markup` | Structured data en landing y blog | Cuando exista blog y queramos rich snippets |
| 19 | `competitor-alternatives` | Páginas comparativas (sin nombrar competidores: "vs. modelo cautivo") | Si SEO se vuelve canal serio |
| 20 | `revops` | Definición formal de MQL/SQL marketing-side | Cuando volumen justifique definiciones formales (>200 leads/mes) |
| 21 | `marketing-ideas` | Brainstorming de tácticas no convencionales (PR, partnerships, eventos) | Anual, como sesión de creatividad |
| 22 | `copy-editing` | Auditoría completa de copy publicado | A los 90 días de tener copy en producción real |
| 23 | `aso-audit` | (No aplica — no hay app móvil) | N/A |

---

## 4. RESUMEN — QUÉ HACER AHORA

### Pre-launch obligatorio (orden recomendado)
1. `analytics-tracking` completo → sin esto no sabes nada
2. `paid-ads` estrategia + `ad-creative` variantes → para alimentar el funnel
3. `ab-test-setup` plan inicial → para iterar rápido
4. `paywall-upgrade-cro` diseño → para convertir free a paid
5. `launch-strategy` orquestación → para el go-live

### Post-launch primer 90 días
6. `customer-research` validación → ajustar el ICP con datos reales
7. `onboarding-cro` (alumno paid) → activación del primer módulo
8. `churn-prevention` Skool retention → defender el MRR
9. `referral-program` → bajar CAC

### Mes 4 en adelante
10. `content-strategy` (multi-canal)
11. `seo-audit` + `programmatic-seo` + `ai-seo`
12. `free-tool-strategy`

---

## 5. RECOMENDACIÓN

**Empezar por el #1 de la lista pre-launch:** `analytics-tracking` completo.

Razón: el dashboard que ya construimos asume que los datos llegan. Sin un tracking plan ejecutado (eventos GA4, Meta Pixel, UTMs, webhooks de Skool/Stripe), el dashboard muestra ceros para siempre. Y sin números reales, todo el resto (paid ads, A/B testing, optimización) es ciego.

Con tracking real montado, los siguientes 4 (paid ads, ad creative, A/B test, paywall) se pueden ejecutar en paralelo.

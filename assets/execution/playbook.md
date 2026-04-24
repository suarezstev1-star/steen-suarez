# PLAYBOOK MAESTRO DE EJECUCIÓN

**Propósito:** Consolidar los ~80 pendientes dispersos en los 21 docs en un único backlog priorizado y secuenciado. Esta es la lista que se ejecuta. Los otros docs son referencia.
**Cómo usarlo:** revisar diariamente. Marcar completados. Re-priorizar si hay bloqueador inesperado.
**Ownership:** S = Steven · D = Diseñador · E = Editor video · L = Abogado · M = Media buyer · A = Asistente · ★ = Crítico

---

## 0. DECISIONES BLOQUEADORAS (esta semana, antes de empezar)

Sin estas decisiones, no se puede arrancar. Tomar todas en una sola sesión de 2 horas.

| # | Decisión | Opciones | Recomendación | Owner |
|---|---|---|---|---|
| 0.1 | ★ Email tool | ConvertKit / MailerLite / ActiveCampaign | **MailerLite** ($10–30/mo, simple, deliverability buena) | S |
| 0.2 | ★ Hosting de landing | Vercel / Netlify / Carrd | **Vercel** (free, conectado a este repo) | S |
| 0.3 | ★ Dominio | `elarquitectodelcierre.com` / otro | **`elarquitectodelcierre.com`** ($15/año en Namecheap) | S |
| 0.4 | ★ Skool — confirmar handles disponibles | `arquitectos-del-cierre` + `el-taller-del-arquitecto` | Verificar hoy en skool.com | S |
| 0.5 | ★ IG handle final | `@steven.arquitecto` o alternativa | Verificar disponibilidad | S |
| 0.6 | Cookie banner tool | Cookiebot ($14/mo) / Custom / sin banner inicial | **Custom simple** (gratis, ver implementación) | S |
| 0.7 | Tool A/B testing | GA4 Experiments / VWO / Convert | **GA4 Experiments** (gratis para empezar) | S |
| 0.8 | Aceptar presupuesto inicial | $0 / $500 / $1,500 / $3,000 | **~$1,500 mes 1** (incluye ad spend Fase 1 + tools + diseñador one-time) | S |

**Total costo mes 1 estimado:** ~$1,000–1,500 (depende de si Steven graba/edita él mismo o contrata).

---

## 1. SPRINT 1 — SEMANA 1 (DÍAS 1–7)

**Objetivo de la semana:** infraestructura técnica funcionando + IG @steven.arquitecto live + miniclase grabada.

### Día 1 (Lunes)
- [ ] S — Tomar las 8 decisiones de Sección 0 (sesión 2h en la mañana)
- [ ] S — Comprar dominio en Namecheap (15 min)
- [ ] S — Crear cuenta MailerLite (15 min) → guardar API key
- [ ] S — Crear cuenta Skool con email corporativo (10 min)
- [ ] S — Crear las 2 comunidades en Skool (free + paid) y configurar branding básico (60 min)
- [ ] S — Conectar Stripe a Skool paid (configurar 3 ofertas: $47/mo, $470/yr, $497 lifetime) (30 min)
- [ ] S — Crear cuenta IG @steven.arquitecto + bio + foto perfil temporal (30 min)
- [ ] S — Crear Meta Business Manager + Pixel (30 min)
- [ ] S — Crear GA4 property (30 min)

### Día 2 (Martes)
- [ ] S — Sesión de fotos profesional (DIY o local fotógrafo, presupuesto $0–200) — necesita 4 fotos: retrato fondo negro, retrato fondo blanco, working at desk, frente a whiteboard
- [ ] S — Grabar 3 videos de la miniclase en una sola sesión (3–4 horas con descansos) — usar scripts de `assets/curso-arquitecto/miniclase-scripts/`
- [ ] D — Diseñar logo final El Arquitecto (símbolo + variantes) — entrega: 5 días
- [ ] D — Diseñar 5 plantillas Canva base (Reel cover, Carousel cover, Carousel inner, Static, Story) — entrega: 5 días

### Día 3 (Miércoles)
- [ ] S — Editar los 3 videos (DIY en CapCut, ~2h cada uno) o entregar a editor
- [ ] S — Diseñar 3 workbooks PDF (Notion + export a PDF, o Canva) (2 horas total)
- [ ] S — Deploy de landing a Vercel desde repo (instrucciones abajo en sección 4) (30 min)
- [ ] S — Conectar dominio a Vercel (45 min con propagación)
- [ ] S — Configurar Meta Pixel + GA4 en landing (30 min)

### Día 4 (Jueves)
- [ ] S — Subir videos editados a Skool free como secuencia con drip 48h
- [ ] S — Subir workbooks como descarga en cada lección
- [ ] S — Configurar drip de 8 emails en MailerLite usando `assets/emails/drip-miniclase.md`
- [ ] S — Conectar form de landing → MailerLite (vía API o Zapier)
- [ ] S — Configurar Skool DM de bienvenida automática

### Día 5 (Viernes)
- [ ] S — QA end-to-end: opt-in en landing → email recibido → Skool join → Video 1 accesible → email Día 1 dispara correctamente
- [ ] S — QA pago Skool paid en modo test de Stripe
- [ ] S — Documentar bugs/issues encontrados, arreglar
- [ ] S — Publicar primer post en IG @steven.arquitecto (post fijado: video de bienvenida 60–90s)

### Día 6 (Sábado)
- [ ] S — Grabar 5 Reels para Semana 1 del calendario IG (batch 3h)
- [ ] S — Editar Reels en CapCut (2h)
- [ ] S — Programar 5 Reels en Meta Business Suite

### Día 7 (Domingo)
- [ ] S — Review semanal: ¿qué quedó pendiente? Re-prioritizar Semana 2
- [ ] S — Decidir si contratar editor de video (si DIY se siente insostenible)

---

## 2. SPRINT 2 — SEMANA 2 (DÍAS 8–14)

**Objetivo:** primeros opt-ins orgánicos + lanzamiento ads $30/día + lista de espera del Taller activa.

### Día 8 (Lunes)
- [ ] S — Reel L-01 publicado (según calendario contenido-30-dias)
- [ ] S — Story diaria con CTA a bio (link a landing)
- [ ] S — Crear pixel de "lista de espera" en landing (campo opcional checkbox: "quiero acceso anticipado al Taller")
- [ ] S — Crear primera campaña Meta Ads — solo TOFU, $30/día, audiencia interest-based amplia
- [ ] S — Lanzar 3 creatives TOFU (TOFU_Reel_AntiHype_v1, TOFU_Carousel_3Cuellos_v1, TOFU_Reel_Diagnostico_v1)

### Día 9 (Martes)
- [ ] S — Carousel M-02 publicado
- [ ] S — Stories diarias
- [ ] S — Monitor primeros datos de ads (CTR, CPC, CPL)
- [ ] S — Si hay opt-ins: revisar si emails llegan correctamente, si form trackea bien

### Día 10–14 (Mié–Dom)
- [ ] S — Resto del calendario IG semana 1 (X-03, J-04, V-05)
- [ ] S — Stories diarias
- [ ] S — Daily check de ads: pausar creatives con CAC > $300, escalar los que están bajo target
- [ ] S — Responder DMs y comentarios
- [ ] S — Domingo: review métricas semana, ajustar Semana 3

**KPIs target Semana 2:**
- 50+ visitas a landing
- 10–15 opt-ins
- 5–10 nuevos miembros Skool free
- Primer feedback cualitativo de los videos

---

## 3. WEEKS 3–4

**Objetivo:** alcanzar 100 miembros Skool free + identificar los primeros candidatos para founders' offer.

- [ ] S — Producción semanal: 5 posts IG batched cada domingo
- [ ] S — Iteración de creatives Meta: pausar perdedores, lanzar 2 nuevos por semana
- [ ] S — A/B test #1 de la lista (`ab-testing/experiments-plan.md`): hook del hero del landing
- [ ] S — Sub-contratar editor de video si volumen lo justifica
- [ ] D — Logo final entregado, aplicado en todos los assets
- [ ] S — Mes 1: reach out personal (DM IG) a top-50 followers más engagados invitándolos a la lista de espera del Taller con beneficio "founders' offer cuando abra"

**KPIs target Mes 1:**
- 100+ Skool free
- 50+ en lista de espera para founders' offer
- CAC sub-$200 estabilizado
- 5 testimonios cualitativos (sin permiso firmado todavía, solo sentimiento)

---

## 4. CÓMO DEPLOYAR LA LANDING (paso a paso)

### Pre-requisitos
- Cuenta Vercel (free) en `vercel.com`
- Acceso al repo de GitHub `suarezstev1-star/steen-suarez`

### Pasos
1. Login en Vercel
2. "Add New Project" → Import Git Repository → seleccionar `suarezstev1-star/steen-suarez`
3. Framework Preset: **Other** (es HTML estático)
4. Root Directory: `assets/landing/`
5. Build & Output Settings: dejar default (ningún build command)
6. Deploy
7. Una vez deployado, Vercel da URL tipo `steen-suarez-xxx.vercel.app`
8. Verificar que `index.html` carga y form funciona

### Conectar dominio
1. Vercel → Project → Settings → Domains
2. Add Domain → `elarquitectodelcierre.com`
3. Vercel da DNS records (A record + CNAME)
4. En Namecheap → Dashboard → Manage Domain → Advanced DNS → agregar records
5. Esperar propagación (5 min – 24h)
6. HTTPS automático via Vercel

### Conectar tracking
- Insertar snippets de GA4 + Meta Pixel en `<head>` de `index.html`
- Hacer commit, Vercel re-deploya automáticamente

### Reemplazar el `handleSubmit` stub
Editar el `<script>` al final de `index.html`:

```js
async function handleSubmit(event) {
  event.preventDefault();
  const data = {
    nombre: document.getElementById('nombre').value,
    email: document.getElementById('email').value,
    estado: document.getElementById('estado').value,
  };

  // POST a MailerLite
  const response = await fetch('https://connect.mailerlite.com/api/subscribers', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer YOUR_API_KEY_HERE'
    },
    body: JSON.stringify({
      email: data.email,
      fields: { name: data.nombre, estado: data.estado },
      groups: ['MINICLASE_GROUP_ID']
    })
  });

  if (response.ok) {
    // Tracking
    if (typeof gtag !== 'undefined') gtag('event', 'landing_form_submitted', { value: 1 });
    if (typeof fbq !== 'undefined') fbq('track', 'Lead');
    window.location.href = '/gracias.html';
  } else {
    alert('Error. Inténtalo de nuevo o escríbenos.');
  }
}
```

**SECURITY NOTE:** la API key NO debe estar en HTML cliente. Crear un endpoint serverless en Vercel (ver Sección 5) que reciba el form y haga el POST a MailerLite con la key del lado servidor.

---

## 5. CÓDIGO QUE CLAUDE PUEDE BUILDAR (preguntar antes)

Las siguientes piezas son código real, no docs. Las puedo implementar si las quieres en el repo:

| Componente | Stack | Tiempo estimado |
|---|---|---|
| Vercel serverless function para form opt-in | Node.js + MailerLite API | 30 min |
| Webhook receiver de Skool/Stripe → GA4 | Node.js + GA4 Measurement Protocol | 1 hora |
| UTM Builder tool (página HTML interactiva) | HTML + JS vanilla | 30 min |
| Página `/gracias.html` post-opt-in con tracking | HTML | 15 min |
| Página `/taller` (sales page del curso paid) | HTML + brand kit | 1 hora |
| Página `/privacidad.html` y `/terminos.html` | HTML | 30 min |
| Cookie banner custom (sin Cookiebot) | HTML + JS | 30 min |
| Script para refresh manual del dashboard data | Node.js que pulla GA4/Stripe/Skool | 2 horas |
| GitHub Action para deploy automático | YAML | 15 min |

**Decisión necesaria:** ¿quieres que implemente alguno de estos ahora?

---

## 6. LO QUE NECESITAS HACER TÚ (no automatizable)

Cosas que requieren acción humana real:

- [ ] Sesión de fotos
- [ ] Grabación de videos (cara a cámara)
- [ ] Grabación de Reels
- [ ] Configurar cuentas (Skool, MailerLite, Stripe, Vercel, Namecheap, Meta Business Manager)
- [ ] Comprar tools de pago
- [ ] Aprobar copy con abogado (revisión legal de compliance docs)
- [ ] Reuniones con los 5 EDs para capacitación del puente
- [ ] DMs personales a primeros 50 followers para founders' offer

---

## 7. CHECKLIST DE GO-LIVE (cuando todo esté listo)

Día del lanzamiento de Founders' Offer:

- [ ] Landing live + dominio funcionando + HTTPS
- [ ] GA4 + Meta Pixel + CAPI verificados
- [ ] Form de opt-in conecta a MailerLite (no al alert stub)
- [ ] Drip de 8 emails configurado y testeado
- [ ] Skool free abierto con miniclase live
- [ ] Skool paid creado pero cerrado al público (solo founders pueden entrar)
- [ ] Stripe configurado con las 3 ofertas
- [ ] Meta Pixel custom audiences creadas (visitantes landing, opt-ins, etc.)
- [ ] Página de privacidad + términos publicadas y linkeadas
- [ ] IG @steven.arquitecto con 10+ posts y 500+ followers (target pre-launch)
- [ ] Lista de espera con 100+ personas
- [ ] 3 creatives Meta TOFU lanzados con CAC validado
- [ ] Compliance docs revisados por abogado
- [ ] Steven mentalmente preparado para 7 días de cart abierto

---

## 8. CADENCIA DE REVIEW

| Cadencia | Quién | Duración | Qué |
|---|---|---|---|
| Diario | S | 15 min | Check de ads, DMs, comentarios IG |
| Semanal (domingo) | S | 90 min | Review métricas semana + plan semana siguiente |
| Quincenal | S | 30 min | Decisión de A/B test próximo |
| Mensual | S + asistente | 2 horas | Review profundo de funnel + ajuste de estrategia |
| Trimestral | S + abogado | 1 hora | Auditoría compliance |

---

## 9. RIESGOS DE EJECUCIÓN MÁS COMUNES

| Riesgo | Probabilidad | Mitigación |
|---|---|---|
| Steven se atasca en producción de video por ser perfeccionista | Alta | Aceptar v1 de los videos como "good enough", iterar después |
| Skool tarda más de lo estimado en configurar | Media | Reservar 1 día completo, no 1 hora |
| Meta Ads se rechazan por compliance | Media | Tener creatives backup sin mención de seguros |
| Conversión inicial es 1% en vez de 5% target | Alta | Aceptar — es normal en beta. Iterar con A/B tests del backlog. |
| Steven se quema haciendo todo solo | Alta | Contratar editor + asistente en M2 si MRR lo permite |

---

## 10. SIGUIENTE PASO INMEDIATO

**Hoy:** ejecutar Sección 0 (las 8 decisiones bloqueadoras) en una sola sesión de 2 horas. Sin esas decisiones, todo el resto está parado.

**Esta semana:** ejecutar Sprint 1 (Sección 1).

**Este mes:** llegar al final de Mes 1 con Skool free abierto + lista de espera de 100+ + ads validados con CAC sub-$200.

# LANDING — SITIO PÚBLICO COMPLETO

**Estado:** Funnel web completo v1, listo para deploy. Pendiente: env vars en Vercel + URLs de Skool checkout.

## Archivos

| Archivo | Ruta pública | Propósito |
|---|---|---|
| `index.html` | `/` | Landing del opt-in a miniclase |
| `gracias.html` | `/gracias` | Confirmación post-opt-in |
| `taller.html` | `/taller` | Sales page de El Taller (paid) |
| `privacidad.html` | `/privacidad` | Política de privacidad (GDPR/CCPA) |
| `terminos.html` | `/terminos` | Términos de uso |
| `api/optin.js` | `/api/optin` | Serverless function: form → MailerLite |
| `vercel.json` | — | Config de deployment (clean URLs + security headers) |

---

## ESTRUCTURA

| Sección | Propósito |
|---|---|
| Hero | Headline + subheadline + form de opt-in (above the fold) |
| Lo que vas a aprender | 3 cards con resumen de cada video |
| Quién soy | Bio breve de Steven con disclaimer de "resultados no típicos" |
| Para quién NO es / SÍ es | Anti-target explícito (filtro automático del lead) |
| Final CTA | Botón ancla al form |
| Footer | Disclaimer legal completo + links |

---

## DECISIONES DE DISEÑO

- **Fondo dominante negro** (`#0D0D0D`) según brand kit — diferenciación inmediata vs. landings genéricos blancos
- **Gold (`#FFD700`)** solo en headlines, números, y CTA — discreto, no decorativo
- **Tipografía Inter/Arial** sin licencia premium (escalable inmediatamente)
- **Sección "NO es para ti"** en lugar de las típicas testimonials infladas — califica el lead antes de capturar
- **Form de 3 campos** (nombre, email, estado) — más datos que estándar pero necesario para segmentación + compliance estatal
- **Disclaimer legal completo en footer** — versión larga del compliance checklist (Sección 4)
- **Sin testimonios ni números de ingreso** en la versión inicial — se agregan cuando estén archivados con permisos firmados

---

## DEPLOYMENT

### Opciones (en orden de simplicidad)
1. **Carrd** — pegar HTML, dominio custom, $19/año. Más simple.
2. **Vercel + GitHub** — push desde este repo, dominio custom, $0. Recomendado para iteración rápida.
3. **Netlify** — equivalente a Vercel.
4. **Webflow** — si se quiere editar visualmente sin tocar código.
5. **Skool nativo** — Skool tiene landing builder pero limitado.

### Para deploy en Vercel desde este repo

1. Login en Vercel → Add New Project → Import `suarezstev1-star/steen-suarez`
2. Framework Preset: **Other**
3. **Root Directory: `assets/landing`** (importante)
4. Build Command: dejar vacío (HTML estático)
5. Output Directory: dejar vacío
6. Deploy

### Variables de entorno requeridas (Vercel dashboard)

```
MAILERLITE_API_KEY    = (tu API key de MailerLite)
MAILERLITE_GROUP_ID   = (ID del grupo "Miniclase" en MailerLite)
```

Sin estas, el form de opt-in retorna error 500. Configurar antes del primer deploy productivo.

### Conectar dominio
- Vercel → Project → Settings → Domains → Add `elarquitectodelcierre.com`
- En Namecheap, agregar A record + CNAME que Vercel te indique
- HTTPS automático

### Wiring pendiente post-deploy
1. **Tracking:** insertar snippets de GA4 + Meta Pixel en `<head>` de cada `.html` (o usar GTM)
2. **Skool checkout URLs:** en `taller.html`, los 3 botones de pricing tienen `data-tier` pero `href="#"`. Reemplazar con URLs reales de Skool checkout cuando estén configurados

### Para integración con email/Skool
Reemplazar el `handleSubmit` en el `<script>` con:
- POST a webhook de ConvertKit / MailerLite / ActiveCampaign
- O POST a webhook de Skool (vía Zapier o Make.com)
- O POST a GHL custom webhook que dispare workflow

Ejemplo con ConvertKit:
```js
fetch('https://api.convertkit.com/v3/forms/{FORM_ID}/subscribe', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    api_key: 'PUBLIC_KEY',
    email: data.email,
    first_name: data.nombre,
    fields: { estado: data.estado }
  })
});
```

---

## TRACKING

Antes de lanzar, agregar:
- [ ] Meta Pixel (para remarketing y conversión de ads)
- [ ] GA4 (analytics)
- [ ] Conversión goal "opt-in" en GA4
- [ ] Conversion event "Lead" en Meta Pixel cuando se completa form

Snippets para insertar en `<head>`:
```html
<!-- Meta Pixel -->
<script>!function(f,b,e,v,n,t,s){...}('init','PIXEL_ID');</script>

<!-- GA4 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXX"></script>
```

---

## COMPLIANCE CHECKLIST

Antes de publicar, validar contra `compliance/checklist-contenido.md`:

- [x] Sin income claims en headline o subhead
- [x] Sin promesa de resultados específicos
- [x] Disclaimer estándar completo en footer
- [x] No menciona TCT ni Experior
- [x] No nombra competidores (WFG, Primerica, etc.)
- [x] Bio de Steven incluye disclaimer "resultados no típicos"
- [x] Form pide estado (necesario para compliance multi-state)
- [ ] Política de privacidad publicada (link en footer apunta a `#` — pendiente)
- [ ] Términos de uso publicados (pendiente)
- [ ] Email de opt-in confirma desuscripción funcional (CAN-SPAM)

---

## RESPONSIVE / ACCESIBILIDAD

- Mobile-first via media queries
- `prefers-reduced-motion` no implementado (sin animaciones agresivas)
- Contraste cumple WCAG AA en gold/black
- Form labels visibles (no solo placeholders)
- Inputs con `autocomplete` para autofill móvil

---

## DECISIONES PENDIENTES

- [ ] Comprar dominio (`elarquitectodelcierre.com` u otro)
- [ ] Configurar DNS apuntando a Vercel/Netlify
- [ ] Subir foto profesional de Steven (reemplazar placeholder)
- [ ] Decidir tool de email (ConvertKit / MailerLite) y reemplazar `handleSubmit`
- [ ] Crear página de gracias post-opt-in (`/gracias.html`)
- [ ] Crear página de privacidad y términos (linkeadas en footer)
- [ ] Configurar Meta Pixel + GA4
- [ ] Configurar redirect de Skool join automático (opcional — usuario completa opt-in y entra a comunidad gratis automáticamente)

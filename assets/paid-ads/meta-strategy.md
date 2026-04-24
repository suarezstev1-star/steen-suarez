# PAID ADS STRATEGY — META (FACEBOOK + INSTAGRAM)

**Propósito:** Estructura completa de campañas para alimentar el funnel del Arquitecto. Reemplaza el approach previo de Meta Ads con HeyGen avatar (que no estaba dando resultados al volumen necesario).
**Plataforma principal:** Meta Ads Manager (FB + IG inventory).
**TikTok / YouTube:** mencionados pero fuera del scope inicial.
**Estado:** Strategy v1 — pendiente activación.

---

## 1. OBJETIVO DEL PROGRAMA

**Meta de revenue M3:** $2,820 MRR del Taller (60 alumnos paid).
**Meta de M6:** $9,400 MRR (200 alumnos paid).
**CAC blended objetivo:** < $150 al M3 / < $100 al M6.
**LTV:CAC objetivo:** 4x al M3, 8x al M6.

**Significa que:** con CAC $150 y 60 alumnos en M3, ad spend total acumulado = $9,000 en 90 días = **~$100/día promedio**.

---

## 2. ESTRUCTURA DE CAMPAÑAS (CBO)

3 campañas activas en paralelo, cada una con propósito claro.

### Campaña 1 — TOFU (Cold Acquisition)
**Objetivo:** Lead (form fill = opt-in a miniclase)
**Audiencia:** fría, sin retargeting
**Creative:** hook contrarian al estilo "El Arquitecto"
**Destino:** Landing del opt-in
**Conversion event:** `landing_form_submitted` (Meta Pixel `Lead`)
**Presupuesto inicial:** 50% del total ($50/día)

### Campaña 2 — MOFU (Retargeting Video Viewers)
**Objetivo:** Lead (mismo opt-in)
**Audiencia:** custom audience de gente que vio 50%+ de videos del IG @steven.arquitecto pero no se registró
**Creative:** énfasis en lo que viene en la miniclase + social proof
**Destino:** Landing del opt-in
**Presupuesto:** 30% ($30/día)

### Campaña 3 — BOFU (Conversion: Free → Paid Taller)
**Objetivo:** Purchase
**Audiencia:** custom audience de opt-ins de miniclase que no han comprado el Taller
**Creative:** énfasis en lo que el Taller incluye que la miniclase no — específicamente comunidad + soporte
**Destino:** Sales page del Taller (pendiente crear, ver gap en audit)
**Conversion event:** `taller_purchased` (Meta Pixel `Purchase`)
**Presupuesto:** 20% ($20/día)

---

## 3. AUDIENCIAS

### Cold (Campaña 1)

#### Interest-based
- Insurance agents (interés explícito)
- Personal finance + Spanish language preference + US location
- "Insurance career" + "Latino entrepreneurship"
- Lookalike de seguidores del IG @steven.arquitecto (cuando haya 1,000+ seguidores)

#### Demográfico
- Edad: 25–55
- Idioma: Spanish (primary)
- Ubicación: US (todos los estados, prioridad inicial Florida, Texas, California, Georgia, NJ — donde está el mercado latino más concentrado)
- Excluir: bachelor's in finance + analyst roles (audiencia ya saturada por otros marketers)

#### NO usar audiencias prohibidas por Meta
- "Credit problems"
- "Financial hardship"
- "Income < $X"
- "Unemployed"
Meta restringe targeting de seguros — usar criterios amplios y dejar que el algoritmo filtre.

### Warm (Campaña 2)

Custom audiences:
- Video viewers 50%+ últimos 30 días (IG + FB)
- Engagers con perfil IG @steven.arquitecto últimos 30 días
- Visitors landing últimos 30 días que NO submitearon

### Hot (Campaña 3)

Custom audiences:
- Email subscribers del email tool (sync vía CAPI)
- Skool free members (vía export manual o Zapier)
- Visitors a sales page del Taller que NO compraron, últimos 14 días

### Lookalike (alimentadas progresivamente)

Crear cuando haya semilla mínima:
- LAL 1% de opt-ins miniclase (cuando haya 100+)
- LAL 1% de compradores Taller (cuando haya 50+)
- LAL 1% de Taller monthly subscribers retenidos > 60 días

---

## 4. PRESUPUESTO Y ESCALAMIENTO

### Fase 1 — Test (días 1–14)
- Total: **$30/día** ($420 en 14 días)
- Distribución: 100% en Campaña 1 (TOFU). Campañas 2 y 3 no se activan hasta tener data
- Objetivo: validar que CAC inicial está entre $50–$200. Si arriba de $300, ajustar creative o audiencia

### Fase 2 — Validación (días 15–30)
- Total: **$50/día** ($1,500 acumulado)
- Distribución: 70% Campaña 1, 30% Campaña 2 (cuando haya warm audience)
- Objetivo: bajar CAC a $100–$150

### Fase 3 — Escala (días 31–90)
- Total: **$100/día** ($9,000 acumulado a fin de M3)
- Distribución: 50%/30%/20% (TOFU/MOFU/BOFU)
- Reglas de escala:
  - Si campaña tiene CAC < target Y consistencia 7 días: subir presupuesto 20%
  - Si CAC > target 3 días seguidos: pausar y revisar creative
- Objetivo M3: 60 alumnos del Taller a $150 CAC = $9K spend → cubre $9.4K MRR (auto-financia desde M3+)

### Fase 4 — Crecimiento (M4+)
- Subir hasta donde el CAC se mantenga sub-$150
- Diversificar a TikTok cuando Meta plateau

---

## 5. CREATIVE TESTING — REGLA DE 3

Por cada campaña activa, mantener al menos **3 creatives diferentes corriendo en simultáneo**. Cuando uno gana claramente (CAC + CTR), pausar los otros y rotar nuevos.

### Variables a testear (en orden de impacto)
1. **Hook visual + verbal** (primer 3 segundos del video o primer slide del carousel)
2. **Formato** (Reel video corto vs. carousel vs. static)
3. **Ángulo del beneficio** (sistema vs. compliance vs. anti-MLM)
4. **CTA** ("Acceder a la miniclase" vs. "Empezar gratis" vs. "Ver Video 1")

### Regla anti-fatiga
- Cada creative se rota out después de 14 días consecutivos OR cuando CTR cae 30% del peak
- Mantener pool de 10+ creatives en rotación constante

(Las variantes específicas de copy de ads están en `assets/paid-ads/ad-creatives.md` — pendiente)

---

## 6. LANDING DESTINATION POR CAMPAÑA

| Campaña | Destino | Mensaje matched |
|---|---|---|
| 1 (TOFU) | `/` (landing miniclase) | Hook genérico anti-hype |
| 2 (MOFU) | `/` (landing miniclase) | Hook que asume conocen al Arquitecto |
| 3 (BOFU) | `/taller` (sales page del Taller — por crear) | Énfasis en comunidad + lives + soporte |

---

## 7. COMPLIANCE — ADS DE SEGUROS EN META

Meta tiene política específica para ads de financial services. Si el ad menciona seguros directamente, riesgo de rechazo automático.

### Estrategia para evitar rechazo
- **No mencionar "seguro de vida" en headline/copy del ad** — se enfoca en "ventas" y "agentes"
- **Posicionarse como entrenamiento, no como producto financiero** — vendemos curso, no póliza
- **Disclaimer en caption:** ver Sección 4 de `compliance/checklist-contenido.md` (versión Meta corta)
- **Landing del destino debe coincidir con el ad** — Meta cruza para ver si hay mismatch

### Ads NUNCA aprobados (no probar)
- Imágenes de billetes, autos lujosos, "lifestyle" de riqueza
- Promesas explícitas de ingreso
- Comparaciones con otras compañías por nombre
- Frases tipo "cambia tu vida en 30 días"

---

## 8. KPIs POR FASE

### Fase 1 (test)
| KPI | Target | Acción si no |
|---|---|---|
| CTR | > 1.5% | Cambiar hook |
| CPM | < $25 | Ampliar audiencia |
| CPC | < $1.50 | Mejorar creative |
| CPL (cost per lead) | $50–$200 | Iterar landing |

### Fase 2 (validation)
| KPI | Target |
|---|---|
| CPL blended | < $150 |
| Form completion rate | > 25% |
| Lead → email confirmed | > 80% |

### Fase 3 (scale)
| KPI | Target |
|---|---|
| CPL | < $100 |
| Lead → Taller purchase | > 5% |
| CAC blended | < $150 |
| ROAS (revenue / ad spend) | > 1.5x |

---

## 9. GESTIÓN OPERATIVA

### Daily (5 min)
- Check CAC de cada campaña en Ads Manager
- Pausar creatives con CAC > 2x target
- Verificar que no hay rechazos pendientes

### Weekly (45 min)
- Review por campaña: gasto, leads, CAC, conversión a paid
- Decidir scaling/pausing por campaña
- Producir 2 creatives nuevos para la semana siguiente
- Actualizar dashboard

### Monthly (90 min)
- Análisis de cohortes (¿leads de cuál mes convierten mejor?)
- Refresh de audiencias (eliminar las que saturaron)
- Decisión de presupuesto del mes siguiente

---

## 10. INTEGRACIÓN CON RESTO DEL FUNNEL

```
Meta Ad
  ↓ (landing_view event)
Landing /
  ↓ (landing_form_submitted event)
Email tool subscribe
  ↓ (email_optin_confirmed event)
Skool free join
  ↓ (skool_free_joined event)
Miniclase drip (8 emails)
  ↓ (taller_purchased event)
El Taller
  ↓ (engagement Skool)
[Algunos llegan a Nivel 4+]
  ↓ (bridge_candidate_flagged en GHL)
Steven evalúa → 1ª llamada → ED → TCT
```

Cada flecha es un evento del tracking plan. Sin tracking, los ads optimizan a ciegas.

---

## 11. DECISIONES PENDIENTES

- [ ] Confirmar presupuesto Fase 1 ($30/día x 14 días = $420 inversión inicial)
- [ ] Configurar Conversion API server-side antes de lanzar (CAPI critical post-iOS 14.5)
- [ ] Crear sales page del Taller para Campaña 3 (gap del audit)
- [ ] Producir 5 creatives iniciales (ver `paid-ads/ad-creatives.md` cuando se cree)
- [ ] Decidir si manejar ads in-house o contratar media buyer ($500-2K/mes según volumen)
- [ ] Configurar reporting automático weekly al dashboard
- [ ] Decidir cuándo activar TikTok (recomendado M4+, después de validar Meta)
- [ ] Configurar tracking de calidad de lead (no todos los opt-ins son iguales — los que vienen de cierto ángulo convierten mejor)

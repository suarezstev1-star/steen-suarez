# A/B TESTING — PLAN DE EXPERIMENTOS

**Propósito:** Backlog priorizado de experimentos con hipótesis, métrica primaria, duración mínima, y criterio de éxito. Sin testing, asumimos los conversion rates — y el negocio típicamente está 30% bajo el techo posible.
**Marco:** ICE score (Impact / Confidence / Ease) para priorizar cada experimento.
**Cadencia:** lanzar 1 experimento nuevo cada 2 semanas. No paralelizar más de 2 al mismo tiempo en el mismo touchpoint (riesgo de contaminación).
**Estado:** Backlog v1 + experimento #1 listo para lanzar.

---

## 1. PRINCIPIOS

1. **Hipótesis explícita.** "Creo que X cambio aumentará la métrica Y porque Z." Si no puedes escribirla en una frase, no es un experimento — es un parche.
2. **Una variable a la vez.** Cambiar 3 cosas y ganar = no sabes cuál ganó. Ganar pequeño con causa clara es más valioso que ganar grande con causa ambigua.
3. **Sample size mínimo.** Necesitas mínimo 100 conversiones por variante para llegar a significancia. Calculadora: `https://www.evanmiller.org/ab-testing/sample-size.html`
4. **Duración mínima 14 días.** Capturar variación día-a-día (lunes ≠ domingo).
5. **Decisión binaria al final.** Mantener variante ganadora, descartar perdedora. Sin "gris".

---

## 2. SCORING — ICE FRAMEWORK

Cada experimento se puntúa 1–10 en:
- **Impact:** ¿Cuánto puede mover la métrica clave?
- **Confidence:** ¿Qué tan seguro estoy de que va a ganar?
- **Ease:** ¿Qué tan rápido se implementa?

Score final = (I + C + E) / 3. Priorizar > 7. Considerar 5–7. Descartar < 5.

---

## 3. BACKLOG INICIAL — 12 EXPERIMENTOS

Ordenados por ICE score descendente.

### #1 — Hook de hero del landing (ICE: 8.7)
- **Impact:** 9 (afecta toda la conversión del funnel desde día 1)
- **Confidence:** 8 (hooks contrarian suelen ganar a hooks descriptivos)
- **Ease:** 9 (cambiar headline, sin código nuevo)
- **Hipótesis:** "Cambiar el headline de 'La Arquitectura de un Cierre' a 'El Sistema de Cierre que Tu Upline No te Enseña' aumentará el opt-in rate en >20% porque agrega antagonismo claro."
- **Variante A (control):** "La Arquitectura de un Cierre"
- **Variante B (test):** "El Sistema de Cierre que Tu Upline No te Enseña"
- **Métrica primaria:** % visitas → opt-ins
- **Sample size:** 200 visitas por variante mínimo
- **Duración:** 14 días o sample size — lo que llegue primero
- **Tool:** Google Optimize sustituido por GA4 Experiments, o servicio externo (Convert.com, Optimizely)
- **Status:** Listo para lanzar Día 1

### #2 — Asunto del Email 6 (Invitación a Taller) (ICE: 8.3)
- **Impact:** 9 (este email convierte free → paid, momento crítico)
- **Confidence:** 7 (asuntos directos vs. curiosidad — depende del contexto)
- **Ease:** 9 (solo copy)
- **Hipótesis:** "Asunto 'Si los 3 videos te ayudaron, esto es lo que sigue' (control) tiene open rate más alto que 'El Taller del Arquitecto está abierto' (más directo). Pero el directo puede convertir mejor a click."
- **Variante A:** "Si los 3 videos te ayudaron, esto es lo que sigue"
- **Variante B:** "El Taller del Arquitecto está abierto"
- **Métrica primaria:** Click-through rate (no open rate — open puede engañar)
- **Métrica secundaria:** Conversión a Taller
- **Duración:** Continuo, hasta 200 envíos por variante
- **Status:** Pendiente

### #3 — Form fields del landing (ICE: 7.7)
- **Impact:** 8 (cada campo extra reduce conversión ~10%)
- **Confidence:** 8 (best practice conocida)
- **Ease:** 7 (requiere segmentación posterior)
- **Hipótesis:** "Quitar el campo 'Estado' del form aumenta opt-in 15%. Pero pierdo capacidad de segmentar por estado en email + ads."
- **Variante A (control):** 3 campos (nombre, email, estado)
- **Variante B (test):** 2 campos (nombre, email)
- **Métrica primaria:** % submit / visitas que abren form
- **Métrica secundaria:** quality score downstream (¿los leads sin estado convierten igual?)
- **Status:** Pendiente

### #4 — CTA del Hero (ICE: 7.7)
- **Hipótesis:** "Cambiar 'Acceder a la miniclase' a 'Empezar con el Video 1' aumenta clicks porque promete acción inmediata vs. acceso genérico."
- **Variante A:** "Acceder a la miniclase"
- **Variante B:** "Empezar con el Video 1"
- **Métrica primaria:** Click rate del CTA (medida por scroll + form_started)
- **Status:** Pendiente

### #5 — Precio del Taller — $497 vs. $397 (ICE: 7.0)
- **Impact:** 10 (precio es la métrica más sensible)
- **Confidence:** 4 (puede ir cualquier dirección, riesgo alto)
- **Ease:** 7 (cambiar Stripe products)
- **Hipótesis:** "Bajar lifetime de $497 a $397 aumenta conversión >25% — el revenue per customer baja pero el volumen compensa."
- **Variante A:** $497 lifetime
- **Variante B:** $397 lifetime
- **Métrica primaria:** Revenue total (no conversion rate aislado)
- **Sample size:** 50 ventas por variante mínimo (variante crítica — más sample importante)
- **Status:** Pendiente. Ejecutar SOLO después de validar conversion rate base con $497

### #6 — Pricing display order (ICE: 6.7)
- **Hipótesis:** "Mostrar lifetime $497 primero (anchor alto) hace que mensual $47 se sienta barato y aumenta conversión a mensual."
- **Variante A:** Order: mensual → anual → lifetime
- **Variante B:** Order: lifetime → anual → mensual
- **Métrica primaria:** Conversion total a cualquier tier
- **Métrica secundaria:** distribución entre tiers
- **Status:** Pendiente

### #7 — Sección "NO es para ti" (ICE: 6.7)
- **Hipótesis:** "Quitar la sección anti-target aumenta opt-in (más fricción no significa mejor lead)."
- **Variante A (control):** Sección visible
- **Variante B (test):** Sección oculta
- **Métrica primaria:** opt-in rate
- **Métrica secundaria:** Quality score downstream (¿conversión a Taller cae si quito el filtro?)
- **Status:** Pendiente

### #8 — Form de 1 paso vs. 2 pasos (ICE: 6.3)
- **Hipótesis:** "Form en 2 pasos (paso 1: solo email; paso 2: nombre + estado en página de gracias) aumenta conversión inicial pero baja calidad."
- **Variante A:** 1 paso, 3 campos
- **Variante B:** 2 pasos, primero email
- **Métrica primaria:** Final completed (todos los campos)
- **Status:** Pendiente

### #9 — Disclaimer del IUL en hero (ICE: 5.3)
- **Hipótesis:** "Mover disclaimer al footer (en vez de visible en hero) sube conversión sin afectar compliance."
- **Variante A (control):** Disclaimer en hero
- **Variante B:** Disclaimer solo en footer
- **Métrica primaria:** opt-in rate
- **Compliance check:** validar con abogado antes de lanzar
- **Status:** Pendiente. Bloqueado hasta opinión legal.

### #10 — Foto de Steven en sección "Quién soy" (ICE: 5.7)
- **Hipótesis:** "Foto profesional con saco vs. foto casual en oficina afecta credibilidad percibida y conversión."
- **Variante A:** Foto formal
- **Variante B:** Foto casual
- **Métrica primaria:** scroll depth + opt-in rate
- **Status:** Pendiente. Necesita 2 fotos producidas.

### #11 — Color del CTA — Gold vs. Verde (ICE: 5.3)
- **Hipótesis:** "Verde (asociado a 'go') puede convertir más que gold (asociado a brand pero no urgencia)."
- **Variante A:** CTA gold
- **Variante B:** CTA verde
- **Métrica primaria:** click rate del CTA
- **Status:** Pendiente. Bajo impacto pero fácil de testear.

### #12 — Email cadencia: 8 emails vs. 5 emails (ICE: 4.3)
- **Hipótesis:** "Comprimir el drip a 5 emails (combinar recordatorios) reduce unsubscribes sin perder conversiones."
- **Variante A:** 8 emails actuales
- **Variante B:** 5 emails (skip recordatorios día 1 y 3)
- **Métrica primaria:** Conversión a Taller
- **Métrica secundaria:** Unsubscribe rate
- **Status:** Pendiente. Riesgo: pérdida de oportunidades de conversión.

---

## 4. EXPERIMENTOS A NO HACER

### Por qué no se testean
- **Cosas con sample size insuficiente.** Si el cambio requiere 1,000 conversiones/variante y solo tenemos 200, el test nunca llega a significancia. No vale ejecutarlo.
- **Cambios drásticos a brand.** Cambiar "El Arquitecto" a otro nombre requiere rebuild completo, no test.
- **Compliance trade-offs sin validación legal.** Cualquier test que potencialmente debilite disclaimers necesita opinión legal previa.
- **Tests durante eventos especiales.** Black Friday, holidays, lanzamientos = baseline anormal. Pausar testing.

---

## 5. INFRAESTRUCTURA

### Tools necesarios
| Tool | Propósito | Costo |
|---|---|---|
| **GA4 Experiments** | A/B test landing simple | Gratis |
| **VWO o Convert.com** | Tests más complejos (multivariate, multi-página) | $200–500/mes |
| **Email tool nativo** | Subject line A/B, content A/B | Incluido |
| **Stripe (test mode)** | Tests de precio en sandbox antes de production | Gratis |
| **Hotjar / FullStory** | Heatmaps + session replay para entender por qué un experimento ganó | $40–100/mes |

**Recomendación inicial:** GA4 Experiments + email tool nativo. Suficiente para los primeros 6 experimentos. Agregar VWO cuando volumen lo justifique.

---

## 6. PROTOCOLO DE EJECUCIÓN

### Antes de lanzar un experimento
1. Escribir hipótesis en una frase
2. Definir métrica primaria (UNA, no varias)
3. Calcular sample size mínimo
4. Confirmar duración mínima (14 días)
5. Documentar variantes en `ab-testing/log/[fecha]-[nombre].md`
6. Configurar tracking (cada variante debe tener su propio identificador en eventos)

### Durante el experimento
- No mirar resultados antes del sample mínimo (peeking → false positives)
- No cambiar otras variables
- Si pasa algo extraordinario (campaña viral, mención en prensa) → pausar y reanudar después

### Después del experimento
- Calcular significancia estadística (no asumir — usar calculadora)
- Si ganador con confianza > 95% → implementar
- Si confianza < 90% → declarar empate, mantener control
- Documentar resultado + screenshots en log
- Decidir próximo experimento basado en aprendizaje

---

## 7. KPIs DEL PROGRAMA DE TESTING

| KPI | Meta |
|---|---|
| Experimentos lanzados/mes | 2 |
| Tasa de "ganadores" (>95% confianza) | 25–40% |
| Lift acumulado del funnel (desde baseline) | +50% en 6 meses |
| Tiempo promedio entre hipótesis y resultado | < 21 días |

---

## 8. DECISIONES PENDIENTES

- [ ] Decidir tool inicial (GA4 Experiments o pagar VWO desde el principio)
- [ ] Configurar tracking para que cada variante sea identificable en analytics
- [ ] Crear template de documentación de experimento en `ab-testing/log/`
- [ ] Definir quién es el "owner" del programa de testing (Steven o asistente)
- [ ] Establecer cadencia de review semanal de experimentos en curso
- [ ] Priorizar primer experimento (recomendado #1 — hook del hero)

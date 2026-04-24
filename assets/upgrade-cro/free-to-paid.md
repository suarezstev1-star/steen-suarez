# UPGRADE CRO — SKOOL FREE → EL TALLER (PAID)

**Propósito:** Diseñar los momentos específicos donde un miembro de Skool free (Arquitectos del Cierre) decide convertirse en alumno pago de El Taller. Sin estos momentos diseñados, los free se quedan free.
**Meta de conversión:** 5% mes 1 → 8% mes 3 → 12% mes 6 (de free → paid).
**Estado:** Diseño v1 — pendiente integrar en Skool.

---

## 1. POR QUÉ EL UPGRADE NECESITA DISEÑO PROPIO

El error común: asumir que el miembro free "se convertirá solo si le sigue gustando el contenido". Falso. La conversión necesita momentos diseñados donde:
1. El miembro **percibe el límite** del nivel gratis
2. **Ve la solución** en el nivel paid
3. Tiene **fricción mínima** para hacer el upgrade
4. Tiene **razón emocional + lógica** para hacerlo ahora

Los siguientes 7 momentos cubren todo el journey del miembro free desde que se une hasta el día 60.

---

## 2. LOS 7 MOMENTOS DE UPGRADE

### Momento 1 — Final del Video 3 de la miniclase (Día 4)
**Trigger:** El miembro completa el Video 3.
**Mensaje:** Soft pitch verbal al final del video + visual con precios + CTA al final del workbook.
**Touchpoint:** Video + workbook PDF (ambos de la miniclase).
**Tono:** Indiferente. "Si te ayudó, esto es lo que sigue."
**Conversion target:** 3% en este momento.

**Implementación:**
- Última escena del Video 3 (16:00–17:30 según script): "Tres opciones de acceso..."
- Última página del workbook 3: comparativa miniclase vs. Taller + link a `/taller`.

---

### Momento 2 — Email 6 (Día 5)
**Trigger:** Automatización del drip.
**Mensaje:** Email con qué incluye El Taller + 3 opciones de precio.
**Touchpoint:** Email.
**Tono:** "Si los 3 videos te ayudaron, esto es lo que sigue."
**Conversion target:** 1.5% incremental.

**Implementación:** ya está en `assets/emails/drip-miniclase.md` (Email 6).

---

### Momento 3 — Limit Hit en Skool free (Día 7+)
**Trigger:** El miembro free llega al "límite" del valor gratis. Específicamente:
- Termina los 3 videos de la miniclase
- Postea pregunta técnica avanzada en canal "Preguntas"
- Comenta queriendo "más profundidad" en algún tema

**Mensaje:** Pop-up suave en Skool (o post fijado) que reconoce que ya extrajeron todo el valor del nivel gratis.

**Texto del pop-up / post fijado:**
> "Veo que estás avanzando rápido en la comunidad gratis. Eso significa que ya estás listo para el siguiente nivel.
>
> El Taller del Arquitecto tiene los 10 módulos completos, comunidad privada, y Q&A live mensual conmigo.
>
> Tres opciones: $47/mes, $470/año, $497 lifetime. 14 días de garantía.
>
> [VER EL TALLER →]"

**Conversion target:** 1% incremental.

**Implementación:** Skool no tiene popups custom — usar post fijado en el feed de la persona o automation vía Zapier que detecta engagement alto.

---

### Momento 4 — Comparativa "free vs. paid" (siempre visible)
**Trigger:** Permanente. Visible en página principal de Skool free.
**Mensaje:** Tabla comparativa explícita.
**Touchpoint:** Sidebar o post fijado en el feed.
**Conversion target:** 0.5% pasivo continuo.

**Tabla:**

| | Skool Free (Arquitectos del Cierre) | El Taller (Paid) |
|---|---|---|
| Miniclase 3 videos | ✓ | ✓ |
| Curso completo (10 módulos) | — | ✓ |
| Workbooks descargables | Solo de miniclase | De cada módulo |
| Comunidad / preguntas | Limitado al feed público | Canales avanzados privados |
| Q&A live mensual | — | ✓ |
| Cierre de la semana cada lunes | — | ✓ |
| Library de scripts y plantillas | — | ✓ |
| Acceso a Steven directo | — | Vía Q&A live + canales privados |
| Niveles 1–5 (gamificación) | — | ✓ |

---

### Momento 5 — Live Q&A abierta (1× cada 2 meses)
**Trigger:** Steven hace un live abierto a Skool free como teaser.
**Mensaje:** En el live, demostrar el ambiente del Taller (sin pitchearlo abiertamente — solo mostrar que esto es lo que pasa adentro).
**Touchpoint:** Live event.
**Tono:** Educacional, indirecto.
**Conversion target:** 1.5% durante las 48 horas post-live.

**Mecánica:**
- Anunciar live 7 días antes
- Live de 30–45 min con preguntas reales del feed gratis
- Al final: "Esto es lo que pasa dentro del Taller cada mes. Si quieres acceso, link en el chat."
- Email de seguimiento al día siguiente con replay + invitación al Taller

---

### Momento 6 — Founders' offer (solo M1–M2)
**Trigger:** Lanzamiento inicial del Taller.
**Mensaje:** Precio reducido para los primeros 20–30 alumnos a cambio de feedback.
**Tono:** Honesto. "Beta. Tú me ayudas a iterar. Yo te doy precio reducido."
**Conversion target:** 60% de los free actuales en M1.

**Oferta beta:**
- Lifetime $197 (vs. $497 normal) **únicamente para los primeros 30**
- Mensual $27 (vs. $47 normal) durante 6 meses, después sube a $47
- Compromiso del alumno: completar primeros 3 módulos en 14 días + dar feedback estructurado

**Comunicación:**
- Email broadcast a todos los free
- Post fijado en feed
- Story serie en IG
- Live de explicación

**Restricciones:**
- Solo abierto 7 días
- 30 plazas máximo (reales)
- Después se cierra y vuelve a precio normal

---

### Momento 7 — Reactivación inactivos (Día 30+ sin actividad)
**Trigger:** Miembro free sin login en 30 días.
**Mensaje:** Email de "qué te perdiste" + invitación a Taller.
**Touchpoint:** Email re-engagement.
**Tono:** Curioso, no manipulador.
**Conversion target:** 2% de reactivados, de los cuales 0.5% conviertan a paid.

**Email texto:**

```
Asunto: ¿Sigues construyendo, o lo dejaste?

[NOMBRE],

Hace 30 días te uniste a Arquitectos del Cierre.
No has vuelto.

Sin presión. Solo curiosidad: ¿qué te frenó?

Tres respuestas válidas:
1. La miniclase no me ayudó → respóndeme y dime por qué
2. Estoy ocupado, voy a volver → todo bien, te espero
3. No es para mí → te puedes desuscribir abajo, sin drama

Si la respuesta es "la miniclase me ayudó pero necesito más profundidad",
El Taller existe exactamente para eso. Link → [LINK_TALLER]

Steven.
```

---

## 3. PRICING ARCHITECTURE

Las 3 opciones de pago se diseñan para maximizar lifetime value diferente:

### Mensual $47/mo
- **Para quién:** quien quiere probar antes de comprometerse
- **Riesgo del usuario:** mínimo
- **LTV esperado:** $47 × 6 meses retención = $282
- **Cómo presentar:** primera opción listada (default)

### Anual $470/yr (ahorro 2 meses)
- **Para quién:** comprometido, paga upfront por descuento
- **Riesgo del usuario:** medio
- **LTV esperado:** $470 (full year)
- **Cómo presentar:** segunda opción con badge "más popular"

### Lifetime $497 one-time
- **Para quién:** el que quiere acabar de decidir y ya
- **Riesgo del usuario:** alto (paga todo)
- **LTV esperado:** $497 inicial + churn imposible
- **Cómo presentar:** tercera opción con badge "ahorra largo plazo"
- **Riesgo del negocio:** ofrece acceso permanente. Implícita: tienes que mantener la comunidad activa por años. Si decides cerrar, devolver pro-rata o explicar antes.

### Anchor strategy
Mostrar **lifetime primero** crea anchor alto que hace que mensual se sienta barato. Pero algunos análisis muestran lo contrario. Esto se A/B testea (ver Experimento #6 en `ab-testing/experiments-plan.md`).

---

## 4. CHECKOUT — REDUCCIÓN DE FRICCIÓN

### Variables a optimizar
- **Cantidad de campos:** mínimo (email + tarjeta). Skool nativo lo hace simple.
- **Tarjeta de crédito visible vs. PayPal:** ofrecer ambos
- **Trust signals:** "14 días de garantía" arriba del CTA, no en footer
- **Mobile-first:** la mayoría va a comprar desde IG en móvil
- **Velocidad:** < 3 segundos para cargar el checkout

### Garantía 14 días — específica
**Texto:**
> "Si en 14 días no encuentras valor, escríbenos a hola@elarquitectodelcierre.com y te devolvemos el 100% sin preguntas. Después de 14 días, sin refund."

**Por qué 14 y no 30:**
- 14 días es suficiente para que el alumno consuma 2 módulos y haga 1 cita aplicando el sistema
- 30+ días = abuso (el alumno consume todo y devuelve)
- Ojo: NO ofrecer "satisfacción garantizada para siempre" — abre a fraude

### Cuando el pago falla (Stripe)
- Email automático: "Tu pago falló. Actualiza tarjeta aquí: [LINK]"
- 3 reintentos en 7 días
- Si todos fallan: pausar acceso al Taller pero mantener acceso a Skool free
- Email final: "Si quieres volver, aquí está tu enlace para reactivar"

---

## 5. PROHIBICIONES

Cosas que el upgrade flow NUNCA hace:

- ❌ Banner "última oportunidad" cuando no es real (manipulación)
- ❌ Countdown timer falso
- ❌ "Solo quedan 2 plazas" si es mentira
- ❌ Dark patterns (botón gris para "no upgrade", botón gold para "sí")
- ❌ Enviar más de 1 email de upgrade por día durante 7+ días seguidos
- ❌ Bloquear acceso a free como táctica de presión

---

## 6. MÉTRICAS DE TRACKING

| Métrica | Fuente | Target M3 |
|---|---|---|
| Free → Paid conversion (lifetime) | Skool + Stripe | 8% |
| Time from join to upgrade | GA4 | < 21 días promedio |
| Distribución mensual/anual/lifetime | Stripe | Idealmente 50/30/20 |
| Cancellation rate (mensual subscribers) | Stripe | < 8%/mes |
| Reactivation rate (post-cancel) | Stripe | 5% en 90 días |

---

## 7. DECISIONES PENDIENTES

- [ ] Confirmar que Skool soporta los 7 momentos diseñados (algunos requieren workaround)
- [ ] Crear sales page específica de El Taller (`/taller`) — gap del audit
- [ ] Diseñar visual de la tabla comparativa Free vs. Paid
- [ ] Configurar Skool automation para "Limit Hit" detection
- [ ] Definir mecánica del Founders' Offer (cuándo, qué emails, cómo cerrar)
- [ ] Validar que Stripe maneja las 3 opciones (mensual recurrente + anual + lifetime one-time)
- [ ] Definir política de refund detallada y publicarla
- [ ] Diseñar página de "post-checkout" (qué ve el usuario justo después de pagar)

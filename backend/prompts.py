"""
System prompts para el Coach IA - PNL, Tony Robbins, Curso de Milagros, Biblia decodificada
"""

COACH_SYSTEM_PROMPT = """Eres "Luz Interior", un coach maestro transformacional de élite. Hablas siempre en español con calidez, precisión y profunda sabiduría.

IDENTIDAD Y EXPERTISE:
Integras con maestría estas disciplinas como una sola voz:
1. **Un Curso de Milagros (UCDM)** - Conoces profundamente las 365 lecciones del libro de ejercicios, el texto y el manual. Aplicas sus principios del perdón, los milagros, la percepción verdadera y la ilusión del ego a situaciones concretas de la vida diaria.
2. **Biblia decodificada para crecimiento personal** - Explicas los pasajes bíblicos desde una óptica espiritual, psicológica y simbólica (no religiosa dogmática). Revelas los "secretos" del crecimiento personal que hay detrás de las parábolas, los salmos y las enseñanzas de Jesús.
3. **Programación Neurolingüística (PNL) avanzada** - Aplicas anclajes, reencuadres, submodalidades, cambio de creencias limitantes, metamodelo, patrones Milton, líneas del tiempo, y el modelo SCORE.
4. **Coaching Tony Robbins** - Usas sus 6 Necesidades Humanas, el Triángulo del Poder (fisiología, enfoque, lenguaje), las reglas de vida, los estados de peak performance, y la filosofía del "salto cuántico" y la "masividad".
5. **Sanación del Niño Interior** - Conoces el trabajo de John Bradshaw, Lucia Capacchione y las técnicas de reparentalización.

ESTILO DE COACHING (EXTRAORDINARIO, NO GENÉRICO):
- Diagnostica primero: Escucha, haz 2-3 preguntas poderosas antes de dar consejos.
- Usa lenguaje sensorial, metáforas vivas y analogías memorables.
- Da ejemplos CONCRETOS aplicados a la vida real (trabajo, pareja, dinero, familia, salud).
- Crea SALTOS CUÁNTICOS visibles: propón acciones específicas para las próximas 24-72 horas con métricas claras.
- Cuando sea apropiado, diseña un PLAN PERSONALIZADO según el estado emocional actual de la persona.
- Reencuadra creencias limitantes con precisión quirúrgica.
- Termina cada respuesta con UNA acción concreta o UNA pregunta de apertura.

TONO: Cálido pero directo. Inspirador sin ser cursi. Sabio sin ser distante. Hablas de tú. Eres el coach que se nota que SÍ sabe.

FORMATO:
- Respuestas en párrafos claros (no listas excesivas).
- Cuando hagas un plan, usa encabezados en negrita con markdown.
- Cita lecciones de UCDM con número y frase cuando sea relevante. Ejemplo: "Como dice la Lección 34 de UCDM: 'Podría ver paz en lugar de esto.'"
- Referencia pasajes bíblicos con interpretación transformacional cuando aporte.

PROHIBIDO: Respuestas genéricas tipo "respira profundo y todo estará bien". Cada respuesta debe ser quirúrgicamente útil y transformacional."""


LESSON_INSIGHT_PROMPT_TEMPLATE = """Soy estudiante de Un Curso de Milagros. Hoy trabajo la Lección {day}: "{title}"

Necesito que me expliques esta lección de forma EXTRAORDINARIA y PRÁCTICA, no genérica:

1. **Esencia (2-3 frases)**: ¿Qué está diciendo realmente la lección? Traduce el lenguaje espiritual a lenguaje cotidiano.
2. **Decodificación bíblica** (si aplica): Conecta esta lección con algún pasaje bíblico que ilumine su significado, aplicado a crecimiento personal.
3. **3 ejemplos de vida real**: Da tres situaciones concretas (ej. discusión con pareja, jefe tóxico, miedo financiero) donde aplicaría esta lección hoy mismo.
4. **Técnica PNL integrada**: Propón UNA técnica específica de PNL (anclaje, reencuadre, submodalidades, etc.) para integrar esta lección.
5. **Práctica del día (formato Tony Robbins)**: Una acción de 5-10 minutos que genere un salto cuántico visible.
6. **Afirmación de poder**: Una frase corta, en primera persona, para repetir hoy.

Responde en español, con formato markdown claro y encabezados en negrita. Sé profundo, vivo y transformacional."""


INNER_CHILD_EXERCISES = [
    {
        "id": "ic-1",
        "title": "Carta al niño interior herido",
        "duration_min": 15,
        "description": "Escribe una carta a tu yo de 5-10 años dándole lo que necesitó y no recibió.",
        "steps": [
            "Siéntate en un lugar tranquilo. Respira profundo 5 veces.",
            "Visualiza a tu niño/niña interior a esa edad. Obsérvale con amor.",
            "Escribe: 'Querido/a [tu nombre], quiero decirte que...'",
            "Valida su dolor, sus miedos, lo que necesitó escuchar.",
            "Termina con una promesa concreta que sí vas a cumplir hoy.",
        ],
    },
    {
        "id": "ic-2",
        "title": "Reparentalización activa",
        "duration_min": 20,
        "description": "Identifica un patrón emocional actual y reparéntate con la voz del adulto sabio.",
        "steps": [
            "Identifica una emoción difícil reciente (rabia, tristeza, vergüenza).",
            "Pregunta: '¿Qué edad tiene esta emoción? ¿Cuándo la sentí por primera vez?'",
            "Habla en voz alta a ese niño: 'Estoy aquí. Te veo. No estás solo/a.'",
            "Ofrécele exactamente lo que necesitó en ese momento original.",
            "Cierra con un abrazo físico (abrázate a ti mismo/a).",
        ],
    },
    {
        "id": "ic-3",
        "title": "Ritual del espejo",
        "duration_min": 5,
        "description": "Reconstruye la autoestima mirándote a los ojos con amor incondicional.",
        "steps": [
            "Mírate al espejo a los ojos durante 2 minutos en silencio.",
            "Di en voz alta: 'Te amo. Te veo. Te perdono.'",
            "Di tu nombre completo 5 veces con ternura.",
            "Observa las emociones sin juzgar. Respira.",
            "Termina con: 'Hoy te cuido como nadie más puede.'",
        ],
    },
    {
        "id": "ic-4",
        "title": "Línea del tiempo sanadora (PNL)",
        "duration_min": 25,
        "description": "Técnica de PNL para resignificar un evento doloroso de la infancia.",
        "steps": [
            "Identifica un recuerdo doloroso específico de la infancia.",
            "Visualízalo como una película en blanco y negro, lejana, pequeña.",
            "Viaja mentalmente a ese momento como el adulto que eres hoy.",
            "Dale al niño lo que necesitó: palabras, abrazo, seguridad.",
            "Añade color, sonido y recursos a la escena. Guárdala así en tu memoria.",
        ],
    },
    {
        "id": "ic-5",
        "title": "Juego libre consciente",
        "duration_min": 30,
        "description": "Recupera la alegría del niño mediante juego sin propósito.",
        "steps": [
            "Elige una actividad que te gustaba antes de los 10 años (dibujar, bailar, jugar con plastilina).",
            "Hazla SIN objetivo, SIN productividad, SIN mostrarla a nadie.",
            "Sé torpe. Ríete. Ensúciate.",
            "Observa qué emociones surgen (a veces tristeza, a veces gozo).",
            "Al terminar, escribe una línea: '¿Qué me dijo hoy mi niño interior?'",
        ],
    },
    {
        "id": "ic-6",
        "title": "Diálogo con mano no dominante",
        "duration_min": 15,
        "description": "Técnica de Lucia Capacchione para acceder al niño interior directamente.",
        "steps": [
            "Toma dos hojas. Con tu mano DOMINANTE escribe: 'Hola, ¿cómo estás hoy?'",
            "Con tu mano NO DOMINANTE responde lo que venga (sin editar).",
            "Continúa el diálogo 10 minutos.",
            "Pregunta: '¿Qué necesitas de mí hoy?'",
            "Cierra con una acción concreta que vas a hacer hoy para honrar esa respuesta.",
        ],
    },
]

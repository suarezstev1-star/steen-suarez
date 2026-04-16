/**
 * Meta Ads Compliance — Seguros de Vida y Reclutamiento de Agentes
 *
 * Reglas para evitar bloqueos y restricciones en Facebook/Instagram Ads.
 * Este archivo se usa como referencia al generar copy y estructura de videos.
 */

// CATEGORÍA ESPECIAL: Seguros y Empleo
// Meta requiere "Special Ad Category" para:
// - Insurance (crédito/seguros/finanzas)
// - Employment (reclutamiento de agentes)

/** Palabras y frases PROHIBIDAS que disparan bloqueos */
export const BANNED_PHRASES = [
  "tú necesitas", "vos necesitás", "sé que estás",
  "tu situación financiera", "tu deuda", "tu crédito",
  "ganá $", "gana $", "ganarás $",
  "ingresos garantizados", "dinero fácil", "dinero rápido",
  "hazte rico", "hacete rico", "libertad financiera garantizada",
  "comentá", "comenta", "dale like", "comparte esto",
  "etiqueta a", "tagea a", "escribe SI",
  "secreto que nadie te cuenta", "truco", "hack",
  "100% gratis", "totalmente gratis sin compromiso",
  "antes de que mueras", "tu familia quedará en la calle",
] as const;

/** Frases SEGURAS — alternativas que cumplen políticas */
export const SAFE_ALTERNATIVES = {
  income: [
    "Conocé una oportunidad en la industria de seguros",
    "Muchos agentes están generando ingresos adicionales",
    "Una carrera con potencial de crecimiento real",
  ],
  cta: [
    "Más información en el link de la bio",
    "Agenda una llamada informativa",
    "Conocé los detalles → link en bio",
  ],
  insurance_value: [
    "Proteger a tu familia es una decisión inteligente",
    "La tranquilidad de saber que están protegidos",
    "Opciones accesibles para cada presupuesto",
  ],
  hooks: [
    "¿Sabías que el 60% de las familias no tienen seguro de vida?",
    "3 cosas que nadie te explicó sobre los seguros de vida",
    "El mercado de seguros crece un 8% cada año",
  ],
  recruitment: [
    "¿Te interesa una carrera en la industria de seguros?",
    "5 beneficios de ser agente de seguros de vida",
    "Buscamos personas con mentalidad emprendedora",
  ],
} as const;

/** Colores seguros para ads de seguros */
export const META_AD_COLORS = {
  dark: {
    bg: ["#0a0a14", "#12121f"],
    text: "#ffffff",
    accent: "#3b82f6",
    accentAlt: "#6366f1",
    cta: "#22c55e",
  },
  light: {
    bg: ["#f8fafc", "#e2e8f0"],
    text: "#0f172a",
    accent: "#1e40af",
    accentAlt: "#3b82f6",
    cta: "#059669",
  },
  warm: {
    bg: ["#1c1008", "#2a1a10"],
    text: "#fef3c7",
    accent: "#f59e0b",
    accentAlt: "#d97706",
    cta: "#22c55e",
  },
} as const;

export type MetaAdColorScheme = keyof typeof META_AD_COLORS;

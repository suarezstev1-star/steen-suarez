/**
 * THE CASH TEAM — Brand Identity
 * Paleta, tipografía, y reglas de marca para todas las composiciones.
 */

export const TCT_COLORS = {
  black: "#0D0D0D",
  dark: "#111111",
  greenLime: "#BEFF00",
  greenAlt: "#AAEE00",
  greenBright: "#C8FF00",
  red: "#E63946",
  redBright: "#FF2D2D",
  white: "#ffffff",
  muted: "#8a8a8a",
} as const;

export const TCT_GRADIENTS = {
  dark: [TCT_COLORS.black, TCT_COLORS.dark, "#0a0a0a"],
  greenGlow: [TCT_COLORS.black, "#0a1a00", TCT_COLORS.black],
  redAlert: [TCT_COLORS.black, "#1a0505", TCT_COLORS.black],
} as const;

export const TCT_FONTS = {
  headline: "'Arial Black', 'Impact', sans-serif",
  body: "'Inter', 'Calibri', sans-serif",
  mono: "'JetBrains Mono', monospace",
} as const;

export const TCT_DIMENSIONS = {
  feed: {width: 1440, height: 1800},
  reel: {width: 1080, height: 1920},
  story: {width: 1080, height: 1920},
  square: {width: 1080, height: 1080},
} as const;

export const TCT_COPY_RULES = {
  banned_in_hook: ["seguro de vida", "póliza", "insurance", "policy", "life insurance"],
  approved_terms: {
    iul: "Cuenta de Ahorro Indexada",
    life_insurance: "Plan de Protección Familiar",
    final_expense: "Plan de Gastos Finales",
    term: "Plan de Protección Temporal",
  },
  tone: "directo, sin emojis excesivos, autoridad + empatía dura",
  maxEmojisPerPost: 2,
  emojisInHeadlines: false,
} as const;

export const TCT_BRAND = {
  name: "The Cash Team Insurance Agency",
  handle: "@stev_cash",
  tagline: "Arquitecto de agentes, no motivador",
  founder: "Steven Suárez",
  structure: "IMO bajo Experior Financial Group",
  methods: {
    sales: "C.A.S.H. (Conciencia → Análisis → Solución → Hábitos)",
    development: "V.I.D.A. (Visión → Impacto → Decisión → Acción)",
  },
  whatsapp: {
    recruitment: "Hola, vi el anuncio sobre la oportunidad de trabajar en seguros de vida. Me gustaría saber más.",
    iul: "Hola, me interesa conocer más sobre el Plan de Protección Familiar y la Cuenta de Ahorro Indexada.",
    final_expense: "Hola, quiero información sobre el Plan de Gastos Finales para proteger a mi familia.",
  },
} as const;

export const PRICING_HYPOTHESIS = "Pricing hypothesis — not validated yet.";

export const tiers = [
  {
    id: "free" as const,
    name: "PAUSA Free",
    price: "MXN 0",
    duration: "Sin plazo de cobro. Dura mientras la herramienta pública exista.",
    payer: "Nadie. No hay pagador.",
    includes: [
      "Mi Pausa",
      "Comprar ahora y Esperar",
      "El resultado financiero",
      "Obligaciones y la explicación de qué queda",
    ],
    excludes: ["No es un historial de varios meses", "No es una suscripción"],
  },
  {
    id: "reuse" as const,
    name: "PAUSA Reuse",
    price: "MXN 39",
    duration: "Hipótesis de pago único por reutilizar, no una suscripción recurrente.",
    payer: "La misma persona, solo si más adelante decide pagar. Hoy nadie está cobrando.",
    includes: [
      "La hipótesis de guardar un escenario",
      "Reabrirlo",
      "Volver a comparar sin reescribir todo",
    ],
    excludes: [
      "No bloquea el resultado de Mi Pausa",
      "No es una renovación mensual validada",
    ],
  },
  {
    id: "plus" as const,
    name: "PAUSA+",
    price: "MXN 79/mes",
    duration: "Hipótesis mensual. No hay renovación medida.",
    payer: "La misma persona, solo como hipótesis. No hay pagos registrados.",
    includes: [
      "La hipótesis de historial",
      "Varios escenarios",
      "Contexto y comparaciones en el tiempo",
      "Un resumen descargable del escenario del simulador",
    ],
    excludes: [
      "No mejora mágicamente tu situación financiera",
      "No incluye asesoría ni una instrucción de comprar o no comprar",
    ],
  },
] as const;

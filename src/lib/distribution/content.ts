export const COVERAGE_LINES = [
  "PAUSA MX calcula únicamente con los datos que ingresas.",
  "No verifica que hayas incluido todas tus obligaciones.",
  "El resultado no determina si una compra es asequible para ti.",
] as const;

export const OFFICIAL_CLAIM =
  "Antes de comprar, compara qué cambia en tu dinero disponible con los datos que ingreses.";

export const LAUNCH_CTA = "Prueba una compra";

export type ClaimClass = "VERIFIED" | "ASSUMPTION" | "DEMO" | "UNKNOWN";

export type ContentSeries = {
  id: "antes-de-comprar" | "lo-que-comprometes" | "comprar-vs-esperar";
  title: string;
  purpose: string;
  rule: string;
};

export const SERIES: readonly ContentSeries[] = [
  {
    id: "antes-de-comprar",
    title: "Antes de comprar",
    purpose:
      "Mostrar compras cotidianas con datos de demostración, en el momento previo a pagar.",
    rule: "El ejemplo no califica la compra.",
  },
  {
    id: "lo-que-comprometes",
    title: "Lo que realmente comprometes",
    purpose:
      "Mostrar cómo el precio y los pagos escritos cambian el dinero disponible.",
    rule: "El mensual no sustituye al total escrito.",
  },
  {
    id: "comprar-vs-esperar",
    title: "Comprar ahora vs esperar",
    purpose: "Mostrar los mismos datos en dos escenarios.",
    rule: "Ningún escenario es el ganador.",
  },
];

export type Concept = {
  id: "C1" | "C2" | "C3" | "C4" | "C5" | "C6";
  seriesId: ContentSeries["id"];
  title: string;
  hook: string;
  audience: string;
  moment: string;
  demoScenario: string;
  format: string;
  cta: string;
  claim: string;
  claimClass: ClaimClass;
  evidenceNeeded: string;
  risk: string;
  status: "concept";
};

const audience =
  "Adulto en México a punto de hacer una compra discrecional que mueve su dinero disponible. Es un público de diseño, no una persona entrevistada.";
const moment = "Justo antes de pagar, financiar o esperar.";
const evidenceNeeded =
  "Una interpretación registrada por una persona que vio la pieza. No hay cita adjunta.";
const risk =
  "Un diseño cuidado puede leerse como permiso para comprar o como prueba de que la compra es asequible.";

export const CONCEPTS: readonly Concept[] = [
  {
    id: "C1",
    seriesId: "antes-de-comprar",
    title: "El celular de $12,000",
    hook: "Antes de comprar un celular de $12,000…",
    audience,
    moment,
    demoScenario:
      "DEMO. Disponible $18,000, esenciales $9,000, comprometidos $2,500, precio de contado $12,000. Después de esas obligaciones quedan $6,500. Si se paga hoy, quedan −$5,500.",
    format: "Plan de carrusel",
    cta: LAUNCH_CTA,
    claim: "La resta usa solo esas cifras de demostración.",
    claimClass: "DEMO",
    evidenceNeeded,
    risk,
    status: "concept",
  },
  {
    id: "C2",
    seriesId: "antes-de-comprar",
    title: "Los audífonos de $1,800",
    hook: "Un precio más bajo también cambia el dinero disponible.",
    audience,
    moment,
    demoScenario:
      "DEMO. Las mismas obligaciones dejan $6,500. Un precio de contado de $1,800 dejaría $4,700 hoy. Esa cifra no dice que la compra sea asequible.",
    format: "Plan de pie de foto",
    cta: LAUNCH_CTA,
    claim: "La resta usa solo esas cifras de demostración.",
    claimClass: "DEMO",
    evidenceNeeded,
    risk,
    status: "concept",
  },
  {
    id: "C3",
    seriesId: "lo-que-comprometes",
    title: "El mensual no es el compromiso",
    hook: "Ver $1,100 no muestra los doce pagos.",
    audience,
    moment,
    demoScenario:
      "DEMO. Enganche $2,000 y 12 pagos de $1,100 suman $15,200 escritos, $3,200 más que el precio de contado de $12,000. No se inventó una tasa.",
    format: "Plan de tarjeta",
    cta: LAUNCH_CTA,
    claim: "El total es la suma de las cifras escritas en el ejemplo.",
    claimClass: "DEMO",
    evidenceNeeded,
    risk,
    status: "concept",
  },
  {
    id: "C4",
    seriesId: "lo-que-comprometes",
    title: "Enganche y lo que sigue",
    hook: "El enganche es lo que sale hoy. Los pagos escritos siguen después.",
    audience,
    moment,
    demoScenario:
      "DEMO. Con $6,500 después de las obligaciones del ejemplo, un enganche de $2,000 dejaría $4,500 hoy. Los $13,200 restantes no se comparan contra un ingreso futuro porque no hay ese dato.",
    format: "Plan de nota corta",
    cta: LAUNCH_CTA,
    claim: "Hoy y después se muestran por separado, con los datos del ejemplo.",
    claimClass: "DEMO",
    evidenceNeeded,
    risk,
    status: "concept",
  },
  {
    id: "C5",
    seriesId: "comprar-vs-esperar",
    title: "Las dos columnas",
    hook: "Mismos datos. Comprar ahora y esperar.",
    audience,
    moment,
    demoScenario:
      "DEMO. Comprar ahora deja −$5,500 hoy. Esperar deja $6,500 hoy, sin pagos nuevos de esta compra.",
    format: "Plan de guion vertical",
    cta: LAUNCH_CTA,
    claim: "Las dos columnas salen de los mismos datos de demostración.",
    claimClass: "DEMO",
    evidenceNeeded,
    risk,
    status: "concept",
  },
  {
    id: "C6",
    seriesId: "comprar-vs-esperar",
    title: "Esperar no es el premio",
    hook: "Esperar muestra el dinero que esta compra no usa hoy.",
    audience,
    moment,
    demoScenario:
      "DEMO. Esperar no gana. Comprar ahora no queda autorizado. La decisión no está en la pieza.",
    format: "Plan de pie de foto",
    cta: LAUNCH_CTA,
    claim: "La pieza se niega a elegir un escenario.",
    claimClass: "DEMO",
    evidenceNeeded,
    risk,
    status: "concept",
  },
];

export type FinishedAsset = {
  id: "carousel" | "storyboard" | "card";
  title: string;
  format: "carousel" | "vertical-storyboard" | "share-card";
  files: readonly string[];
  alt: string;
  claimClass: "DEMO";
  status: "finished-file";
};

export const ASSETS: readonly FinishedAsset[] = [
  {
    id: "carousel",
    title: "Antes de comprar un celular de $12,000…",
    format: "carousel",
    files: [
      "/week15/carousel-1-pausa.svg",
      "/week15/carousel-2-datos.svg",
      "/week15/carousel-3-columnas.svg",
      "/week15/carousel-4-limites.svg",
    ],
    alt: "Carrusel de demostración: antes de comprar un celular de 12000 pesos, con datos ficticios y sin veredicto.",
    claimClass: "DEMO",
    status: "finished-file",
  },
  {
    id: "storyboard",
    title: "Comprar ahora vs esperar",
    format: "vertical-storyboard",
    files: ["/week15/storyboard-comprar-ahora-vs-esperar.svg"],
    alt: "Guion visual vertical de demostración con comprar ahora y esperar, sin ganador y sin video grabado.",
    claimClass: "DEMO",
    status: "finished-file",
  },
  {
    id: "card",
    title: "Lo que realmente comprometes",
    format: "share-card",
    files: ["/week15/card-lo-que-comprometes.svg"],
    alt: "Tarjeta de demostración: el precio de contado frente al total escrito del plan de pagos.",
    claimClass: "DEMO",
    status: "finished-file",
  },
];

export const BANNED_COPY = [
  "Sí te alcanza",
  "si te alcanza",
  "Compra inteligentemente",
  "Esta compra es mala",
  "Estás desperdiciando tu dinero",
  "No compres",
  "no compres",
] as const;

import {
  formatMxn,
  fromCents,
  MAX_CENTS,
  MAX_INSTALLMENTS,
  MIN_INSTALLMENTS,
  toCents,
} from "./money";
import type { EvaluationIssue, EvaluationResult, PurchaseInput } from "./types";

function issue(
  code: EvaluationIssue["code"],
  message: string,
  field?: EvaluationIssue["field"],
): EvaluationIssue {
  return { code, message, field };
}

function isPresentNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function validateAmount(
  value: number | undefined,
  field: EvaluationIssue["field"],
  label: string,
  issues: EvaluationIssue[],
  required: boolean,
): number | null {
  if (value === undefined || value === null || Number.isNaN(value as number)) {
    if (required) {
      issues.push(issue("required", `Falta ${label}.`, field));
    }
    return null;
  }
  if (!Number.isFinite(value)) {
    issues.push(issue("non_finite", `${label} no es un número válido.`, field));
    return null;
  }
  if (value < 0) {
    issues.push(issue("negative", `${label} no puede ser negativo.`, field));
    return null;
  }
  const cents = toCents(value);
  if (Math.abs(cents) > MAX_CENTS) {
    issues.push(
      issue("too_large", `${label} rebasa el límite de $10,000,000.00 MXN.`, field),
    );
    return null;
  }
  return cents;
}

export function evaluatePurchase(input: PurchaseInput): EvaluationResult {
  const issues: EvaluationIssue[] = [];

  const availableCents = validateAmount(
    input.availableMoney,
    "availableMoney",
    "el dinero disponible",
    issues,
    true,
  );
  const essentialCents = validateAmount(
    input.essentialExpenses,
    "essentialExpenses",
    "los gastos esenciales",
    issues,
    true,
  );
  const committedCents = validateAmount(
    input.committedPayments,
    "committedPayments",
    "los pagos ya comprometidos",
    issues,
    true,
  );
  const priceCents = validateAmount(
    input.purchasePrice,
    "purchasePrice",
    "el precio de la compra",
    issues,
    true,
  );

  if (input.paymentMethod !== "full" && input.paymentMethod !== "installments") {
    issues.push(issue("required", "Elige contado o meses.", "paymentMethod"));
  }

  let downCents: number | null = null;
  let count: number | null = null;
  let installmentCents: number | null = null;

  if (input.paymentMethod === "installments") {
    downCents = validateAmount(
      input.downPayment,
      "downPayment",
      "el enganche",
      issues,
      true,
    );
    if (!isPresentNumber(input.installmentCount)) {
      issues.push(
        issue(
          "required",
          "Falta el número de mensualidades.",
          "installmentCount",
        ),
      );
    } else if (
      !Number.isInteger(input.installmentCount) ||
      input.installmentCount < MIN_INSTALLMENTS ||
      input.installmentCount > MAX_INSTALLMENTS
    ) {
      issues.push(
        issue(
          "invalid_count",
          `El número de mensualidades debe ser un entero entre ${MIN_INSTALLMENTS} y ${MAX_INSTALLMENTS}.`,
          "installmentCount",
        ),
      );
    } else {
      count = input.installmentCount;
    }
    installmentCents = validateAmount(
      input.installmentAmount,
      "installmentAmount",
      "el monto de cada mensualidad",
      issues,
      true,
    );
  }

  if (issues.length > 0) {
    return {
      ok: false,
      issues,
      moneyAfterObligations: null,
      immediateCost: null,
      futurePaymentsTotal: null,
      remainingAfterImmediate: null,
      enteredPurchaseTotal: null,
      differenceVsCashPrice: null,
      futureAffordabilityEstablished: false,
      futureAffordabilityWarning: null,
      explanation:
        "No se calculó un resultado porque faltan datos o hay valores que no se pueden usar. No se inventó ningún número.",
      comparison: null,
    };
  }

  const moneyAfterObligationsCents =
    (availableCents as number) -
    (essentialCents as number) -
    (committedCents as number);

  const immediateCostCents =
    input.paymentMethod === "full"
      ? (priceCents as number)
      : (downCents as number);

  const futureCount = input.paymentMethod === "full" ? 0 : (count as number);
  const futureAmountCents =
    input.paymentMethod === "full" ? 0 : (installmentCents as number);
  const futurePaymentsTotalCents = futureCount * futureAmountCents;
  const remainingAfterImmediateCents =
    moneyAfterObligationsCents - immediateCostCents;

  let enteredPurchaseTotalCents: number | null = null;
  let differenceVsCashPriceCents: number | null = null;

  if (input.paymentMethod === "installments") {
    enteredPurchaseTotalCents = (downCents as number) + futurePaymentsTotalCents;
    differenceVsCashPriceCents =
      enteredPurchaseTotalCents - (priceCents as number);
  } else {
    enteredPurchaseTotalCents = priceCents as number;
    differenceVsCashPriceCents = 0;
  }

  const futureAffordabilityEstablished = false;
  const futureAffordabilityWarning =
    input.paymentMethod === "installments"
      ? "Esta evaluación no establece si las mensualidades futuras te alcanzarán. Solo se usó el dinero que indicaste para este momento; no hay ingreso futuro en el cálculo y no se inventó una tasa de interés."
      : null;

  const moneyAfterObligations = fromCents(moneyAfterObligationsCents);
  const immediateCost = fromCents(immediateCostCents);
  const futurePaymentsTotal = fromCents(futurePaymentsTotalCents);
  const remainingAfterImmediate = fromCents(remainingAfterImmediateCents);
  const enteredPurchaseTotal =
    enteredPurchaseTotalCents === null
      ? null
      : fromCents(enteredPurchaseTotalCents);
  const differenceVsCashPrice =
    differenceVsCashPriceCents === null
      ? null
      : fromCents(differenceVsCashPriceCents);

  const explanation = buildExplanation({
    available: fromCents(availableCents as number),
    essential: fromCents(essentialCents as number),
    committed: fromCents(committedCents as number),
    moneyAfterObligations,
    immediateCost,
    remainingAfterImmediate,
    paymentMethod: input.paymentMethod,
    futureCount,
    futureAmount: fromCents(futureAmountCents),
    futurePaymentsTotal,
    purchasePrice: fromCents(priceCents as number),
    enteredPurchaseTotal,
    differenceVsCashPrice,
  });

  return {
    ok: true,
    issues: [],
    moneyAfterObligations,
    immediateCost,
    futurePaymentsTotal,
    remainingAfterImmediate,
    enteredPurchaseTotal,
    differenceVsCashPrice,
    futureAffordabilityEstablished,
    futureAffordabilityWarning,
    explanation,
    comparison: {
      buyNow: {
        remainingAfterImmediate,
        immediateCost,
        futurePaymentsTotal,
        futurePaymentCount: futureCount,
        futurePaymentAmount: fromCents(futureAmountCents),
      },
      wait: {
        remainingAfterImmediate: moneyAfterObligations,
        immediateCost: 0,
        futurePaymentsTotal: 0,
        futurePaymentCount: 0,
        futurePaymentAmount: 0,
      },
    },
  };
}

function buildExplanation(args: {
  available: number;
  essential: number;
  committed: number;
  moneyAfterObligations: number;
  immediateCost: number;
  remainingAfterImmediate: number;
  paymentMethod: PurchaseInput["paymentMethod"];
  futureCount: number;
  futureAmount: number;
  futurePaymentsTotal: number;
  purchasePrice: number;
  enteredPurchaseTotal: number | null;
  differenceVsCashPrice: number | null;
}): string {
  const lines: string[] = [];
  lines.push(
    `Dinero disponible ${formatMxn(args.available)} menos gastos esenciales ${formatMxn(args.essential)} menos pagos ya comprometidos ${formatMxn(args.committed)} deja ${formatMxn(args.moneyAfterObligations)} antes de esta compra.`,
  );

  if (args.paymentMethod === "full") {
    lines.push(
      `Si compras ahora de contado, el costo inmediato es el precio ${formatMxn(args.purchasePrice)}. Después de pagarlo quedarían ${formatMxn(args.remainingAfterImmediate)}. Esta compra no crea mensualidades futuras en los datos que escribiste.`,
    );
  } else {
    lines.push(
      `Si compras ahora a meses, el costo inmediato es el enganche ${formatMxn(args.immediateCost)}. Después de pagarlo quedarían ${formatMxn(args.remainingAfterImmediate)}. Quedarían ${args.futureCount} pagos de ${formatMxn(args.futureAmount)}, que suman ${formatMxn(args.futurePaymentsTotal)} según lo que escribiste.`,
    );
    if (
      args.enteredPurchaseTotal !== null &&
      args.differenceVsCashPrice !== null
    ) {
      if (args.differenceVsCashPrice > 0) {
        lines.push(
          `Enganche más mensualidades suman ${formatMxn(args.enteredPurchaseTotal)}, que es ${formatMxn(args.differenceVsCashPrice)} más que el precio de contado ${formatMxn(args.purchasePrice)}. Esa diferencia sale de tus cifras; no se inventó un interés.`,
        );
      } else if (args.differenceVsCashPrice < 0) {
        lines.push(
          `Enganche más mensualidades suman ${formatMxn(args.enteredPurchaseTotal)}, que es ${formatMxn(Math.abs(args.differenceVsCashPrice))} menos que el precio de contado ${formatMxn(args.purchasePrice)}. Revisa si faltó algún pago o comisión en lo que escribiste.`,
        );
      } else {
        lines.push(
          `Enganche más mensualidades suman ${formatMxn(args.enteredPurchaseTotal)}, igual al precio de contado en los datos capturados.`,
        );
      }
    }
  }

  lines.push(
    `Si esperas, no sale dinero hoy por esta compra y no se crean esos pagos futuros. Seguirías con ${formatMxn(args.moneyAfterObligations)} después de esenciales y compromisos. La decisión de comprar o esperar es tuya.`,
  );

  return lines.join(" ");
}

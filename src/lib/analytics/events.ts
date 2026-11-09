export const PRODUCT_EVENTS = [
  "evaluation_started",
  "validation_error",
  "comparison_viewed",
  "save_attempted",
  "evaluation_saved",
  "feedback_submitted",
] as const;

export type ProductEventName = (typeof PRODUCT_EVENTS)[number];

export const DETAIL_CODES = [
  "availablemoney",
  "essentialexpenses",
  "committedpayments",
  "purchaseprice",
  "paymentmethod",
  "downpayment",
  "installmentcount",
  "installmentamount",
  "form",
  "full",
  "installments",
  "unauthenticated",
  "unconfigured",
  "invalid",
  "error",
  "saved",
  "ok",
  "rate_limited",
] as const;

export type DetailCode = (typeof DETAIL_CODES)[number];

const FIELD_TO_DETAIL: Record<string, DetailCode> = {
  availableMoney: "availablemoney",
  essentialExpenses: "essentialexpenses",
  committedPayments: "committedpayments",
  purchasePrice: "purchaseprice",
  paymentMethod: "paymentmethod",
  downPayment: "downpayment",
  installmentCount: "installmentcount",
  installmentAmount: "installmentamount",
};

const SESSION_PATTERN = /^[A-Za-z0-9_-]{16,64}$/;

export function detailForField(field: string): DetailCode {
  return FIELD_TO_DETAIL[field] ?? "form";
}

export type ParsedProductEvent = {
  sessionId: string;
  event: ProductEventName;
  detail: DetailCode | null;
};

export function parseProductEvent(
  raw: unknown,
): { ok: true; value: ParsedProductEvent } | { ok: false; code: "invalid" } {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return { ok: false, code: "invalid" };
  }

  const record = raw as Record<string, unknown>;
  for (const key of Object.keys(record)) {
    if (key !== "sessionId" && key !== "event" && key !== "detail") {
      return { ok: false, code: "invalid" };
    }
  }

  const { sessionId, event, detail } = record;
  if (typeof sessionId !== "string" || !SESSION_PATTERN.test(sessionId)) {
    return { ok: false, code: "invalid" };
  }
  if (typeof event !== "string" || !isProductEvent(event)) {
    return { ok: false, code: "invalid" };
  }

  if (detail === undefined || detail === null || detail === "") {
    return { ok: true, value: { sessionId, event, detail: null } };
  }
  if (typeof detail !== "string" || !isDetailCode(detail)) {
    return { ok: false, code: "invalid" };
  }

  return { ok: true, value: { sessionId, event, detail } };
}

function isProductEvent(value: string): value is ProductEventName {
  return (PRODUCT_EVENTS as readonly string[]).includes(value);
}

function isDetailCode(value: string): value is DetailCode {
  return (DETAIL_CODES as readonly string[]).includes(value);
}

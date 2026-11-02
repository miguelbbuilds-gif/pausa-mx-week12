export type PaymentMethod = "full" | "installments";

export type PurchaseInput = {
  availableMoney: number;
  essentialExpenses: number;
  committedPayments: number;
  purchasePrice: number;
  paymentMethod: PaymentMethod;
  downPayment?: number;
  installmentCount?: number;
  installmentAmount?: number;
};

export type EvaluationIssue = {
  code:
    | "required"
    | "negative"
    | "too_large"
    | "non_finite"
    | "invalid_installments"
    | "invalid_count";
  field?: keyof PurchaseInput | "paymentMethod";
  message: string;
};

export type SideBySide = {
  remainingAfterImmediate: number;
  immediateCost: number;
  futurePaymentsTotal: number;
  futurePaymentCount: number;
  futurePaymentAmount: number;
};

export type EvaluationResult = {
  ok: boolean;
  issues: EvaluationIssue[];
  moneyAfterObligations: number | null;
  immediateCost: number | null;
  futurePaymentsTotal: number | null;
  remainingAfterImmediate: number | null;
  enteredPurchaseTotal: number | null;
  differenceVsCashPrice: number | null;
  futureAffordabilityEstablished: boolean;
  futureAffordabilityWarning: string | null;
  explanation: string;
  comparison: {
    buyNow: SideBySide;
    wait: SideBySide;
  } | null;
};

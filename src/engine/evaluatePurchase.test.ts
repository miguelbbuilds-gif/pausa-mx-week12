import { describe, expect, it } from "vitest";
import { evaluatePurchase } from "./evaluatePurchase";
import { purchaseFormSchema } from "../validation/schema";
import { toCents } from "./money";

describe("evaluatePurchase", () => {
  it("computes a valid full-payment purchase", () => {
    const result = evaluatePurchase({
      availableMoney: 10000,
      essentialExpenses: 4000,
      committedPayments: 1000,
      purchasePrice: 2500,
      paymentMethod: "full",
    });
    expect(result.ok).toBe(true);
    expect(result.moneyAfterObligations).toBe(5000);
    expect(result.immediateCost).toBe(2500);
    expect(result.futurePaymentsTotal).toBe(0);
    expect(result.remainingAfterImmediate).toBe(2500);
    expect(result.comparison?.buyNow.remainingAfterImmediate).toBe(2500);
    expect(result.comparison?.wait.remainingAfterImmediate).toBe(5000);
    expect(result.futureAffordabilityWarning).toBeNull();
  });

  it("allows a purchase that exceeds available money and shows a negative remainder", () => {
    const result = evaluatePurchase({
      availableMoney: 3000,
      essentialExpenses: 2000,
      committedPayments: 500,
      purchasePrice: 4000,
      paymentMethod: "full",
    });
    expect(result.ok).toBe(true);
    expect(result.moneyAfterObligations).toBe(500);
    expect(result.remainingAfterImmediate).toBe(-3500);
  });

  it("handles zero available money", () => {
    const result = evaluatePurchase({
      availableMoney: 0,
      essentialExpenses: 0,
      committedPayments: 0,
      purchasePrice: 100,
      paymentMethod: "full",
    });
    expect(result.ok).toBe(true);
    expect(result.remainingAfterImmediate).toBe(-100);
  });

  it("computes a valid installment plan from entered figures only", () => {
    const result = evaluatePurchase({
      availableMoney: 12000,
      essentialExpenses: 7800,
      committedPayments: 1200,
      purchasePrice: 14999,
      paymentMethod: "installments",
      downPayment: 3000,
      installmentCount: 12,
      installmentAmount: 1250,
    });
    expect(result.ok).toBe(true);
    expect(result.immediateCost).toBe(3000);
    expect(result.futurePaymentsTotal).toBe(15000);
    expect(result.enteredPurchaseTotal).toBe(18000);
    expect(result.differenceVsCashPrice).toBe(3001);
    expect(result.remainingAfterImmediate).toBe(0);
    expect(result.futureAffordabilityEstablished).toBe(false);
    expect(result.futureAffordabilityWarning).toMatch(/no establece/i);
  });

  it("rejects invalid installment data", () => {
    const result = evaluatePurchase({
      availableMoney: 5000,
      essentialExpenses: 0,
      committedPayments: 0,
      purchasePrice: 4000,
      paymentMethod: "installments",
      downPayment: 500,
      installmentCount: 1,
      installmentAmount: 3500,
    });
    expect(result.ok).toBe(false);
    expect(result.issues.some((item) => item.field === "installmentCount")).toBe(
      true,
    );
  });

  it("rejects negative amounts", () => {
    const result = evaluatePurchase({
      availableMoney: -1,
      essentialExpenses: 0,
      committedPayments: 0,
      purchasePrice: 10,
      paymentMethod: "full",
    });
    expect(result.ok).toBe(false);
    expect(result.issues[0]?.code).toBe("negative");
  });

  it("rejects extremely large values", () => {
    const result = evaluatePurchase({
      availableMoney: 10_000_000.01,
      essentialExpenses: 0,
      committedPayments: 0,
      purchasePrice: 1,
      paymentMethod: "full",
    });
    expect(result.ok).toBe(false);
    expect(result.issues[0]?.code).toBe("too_large");
  });

  it("keeps two-decimal cent rounding consistent", () => {
    const result = evaluatePurchase({
      availableMoney: 10.1,
      essentialExpenses: 0.2,
      committedPayments: 0.3,
      purchasePrice: 1.15,
      paymentMethod: "full",
    });
    expect(result.ok).toBe(true);
    expect(result.moneyAfterObligations).toBe(9.6);
    expect(result.remainingAfterImmediate).toBe(8.45);
  });

  it("rounds half-up to the nearest cent even when binary floats are inexact", () => {
    expect(toCents(1.005)).toBe(101);
    expect(toCents(2.005)).toBe(201);
    expect(toCents(1.015)).toBe(102);
    expect(toCents(9.995)).toBe(1000);
  });
});

describe("purchaseFormSchema", () => {
  it("rejects empty required fields instead of coercing them to zero", () => {
    const parsed = purchaseFormSchema.safeParse({
      availableMoney: "",
      essentialExpenses: "",
      committedPayments: "",
      purchasePrice: "",
      paymentMethod: "full",
    });
    expect(parsed.success).toBe(false);
  });
});

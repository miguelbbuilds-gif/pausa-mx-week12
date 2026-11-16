import { describe, expect, it } from "vitest";
import { projectRevenue, projectUnitEconomics, type CostInput } from "./calculate";

const zeroCosts: CostInput = {
  cac: 0,
  onboardingCost: 0,
  supportCost: 0,
  infrastructureCost: 0,
  paymentProcessing: 0,
  reviewCost: 0,
  correctionCost: 0,
  exceptionCost: 0,
  churnPercent: null,
};

describe("projectRevenue", () => {
  it("keeps zero users and zero conversion at zero revenue", () => {
    const result = projectRevenue({
      users: 0,
      conversionPercent: 0,
      monthlyPrice: 79,
      annualPrice: null,
      b2bAccounts: 0,
      employeesPerAccount: 0,
      pricePerEmployee: 0,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.payingUsers).toBe(0);
    expect(result.value.freeUsers).toBe(0);
    expect(result.value.mrr).toBe(0);
    expect(result.value.arr).toBe(0);
    expect(result.value.revenuePerUser).toBeNull();
  });

  it("treats 100 percent conversion as every user paying", () => {
    const result = projectRevenue({
      users: 10,
      conversionPercent: 100,
      monthlyPrice: 79,
      annualPrice: 790,
      b2bAccounts: 0,
      employeesPerAccount: 0,
      pricePerEmployee: 0,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.payingUsers).toBe(10);
    expect(result.value.freeUsers).toBe(0);
    expect(result.value.mrr).toBe(790);
    expect(result.value.arr).toBe(9480);
    expect(result.value.annualPlanRevenue).toBe(7900);
  });

  it("accepts decimals without inventing a sale", () => {
    const result = projectRevenue({
      users: 8,
      conversionPercent: 12.5,
      monthlyPrice: 39.5,
      annualPrice: null,
      b2bAccounts: 2,
      employeesPerAccount: 3,
      pricePerEmployee: 10,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.payingUsers).toBeCloseTo(1);
    expect(result.value.mrr).toBeCloseTo(39.5);
    expect(result.value.sponsorMrr).toBe(60);
    expect(result.value.combinedMrr).toBeCloseTo(99.5);
  });

  it("rejects negatives and unbounded values", () => {
    expect(
      projectRevenue({
        users: -1,
        conversionPercent: 10,
        monthlyPrice: 79,
        annualPrice: null,
        b2bAccounts: 0,
        employeesPerAccount: 0,
        pricePerEmployee: 0,
      }).ok,
    ).toBe(false);
    expect(
      projectRevenue({
        users: 10,
        conversionPercent: 101,
        monthlyPrice: 79,
        annualPrice: null,
        b2bAccounts: 0,
        employeesPerAccount: 0,
        pricePerEmployee: 0,
      }).ok,
    ).toBe(false);
    expect(
      projectRevenue({
        users: 10,
        conversionPercent: 10,
        monthlyPrice: 79,
        annualPrice: null,
        b2bAccounts: 2_000_000_000,
        employeesPerAccount: 1,
        pricePerEmployee: 1,
      }).ok,
    ).toBe(false);
  });
});

describe("projectUnitEconomics", () => {
  it("does not call a negative contribution profitable", () => {
    const revenue = projectRevenue({
      users: 10,
      conversionPercent: 100,
      monthlyPrice: 79,
      annualPrice: null,
      b2bAccounts: 0,
      employeesPerAccount: 0,
      pricePerEmployee: 0,
    });
    expect(revenue.ok).toBe(true);
    if (!revenue.ok) return;
    const economics = projectUnitEconomics(revenue.value, 79, {
      ...zeroCosts,
      supportCost: 100,
      cac: 200,
    });
    expect(economics.ok).toBe(true);
    if (!economics.ok) return;
    expect(economics.value.contribution).toBeLessThan(0);
    expect(economics.value.profitable).toBe(false);
    expect(economics.value.cacPaybackMonths).toBeNull();
  });

  it("estimates payback only when monthly contribution is positive", () => {
    const revenue = projectRevenue({
      users: 4,
      conversionPercent: 50,
      monthlyPrice: 79,
      annualPrice: null,
      b2bAccounts: 0,
      employeesPerAccount: 0,
      pricePerEmployee: 0,
    });
    expect(revenue.ok).toBe(true);
    if (!revenue.ok) return;
    const economics = projectUnitEconomics(revenue.value, 79, {
      ...zeroCosts,
      supportCost: 9,
      cac: 140,
    });
    expect(economics.ok).toBe(true);
    if (!economics.ok) return;
    expect(economics.value.contribution).toBe(140);
    expect(economics.value.cacPaybackMonths).toBe(2);
    expect(economics.value.profitable).toBe(false);
  });
});

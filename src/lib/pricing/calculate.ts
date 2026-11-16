export const MAX_COUNT = 1_000_000_000;
export const MAX_MONEY = 1_000_000;

export type EvidenceLabel = "MEASURED" | "ASSUMED" | "UNKNOWN";

export type RevenueInput = {
  users: number;
  conversionPercent: number;
  monthlyPrice: number;
  annualPrice: number | null;
  b2bAccounts: number;
  employeesPerAccount: number;
  pricePerEmployee: number;
};

export type CostInput = {
  cac: number;
  onboardingCost: number;
  supportCost: number;
  infrastructureCost: number;
  paymentProcessing: number;
  reviewCost: number;
  correctionCost: number;
  exceptionCost: number;
  churnPercent: number | null;
};

export type RevenueProjection = {
  payingUsers: number;
  freeUsers: number;
  mrr: number;
  arr: number;
  projectedGrossRevenueMonthly: number;
  revenuePerUser: number | null;
  annualPlanRevenue: number | null;
  sponsorMrr: number;
  combinedMrr: number;
  combinedArr: number;
};

export type UnitEconomics = {
  revenue: number;
  variableCost: number;
  oneTimeOnboarding: number;
  contribution: number;
  contributionMarginPercent: number | null;
  contributionPerPayer: number | null;
  cacPaybackMonths: number | null;
  profitable: false;
};

const numberError = "Usa un número válido, cero o mayor.";

function isMoney(value: number): boolean {
  return Number.isFinite(value) && value >= 0 && value <= MAX_MONEY;
}

function isCount(value: number): boolean {
  return Number.isInteger(value) && value >= 0 && value <= MAX_COUNT;
}

export function projectRevenue(
  input: RevenueInput,
): { ok: true; value: RevenueProjection } | { ok: false; message: string } {
  if (!isCount(input.users) || !isCount(input.b2bAccounts) || !isCount(input.employeesPerAccount)) {
    return { ok: false, message: "Las cantidades de personas o cuentas no pueden ser negativas ni enormes." };
  }
  if (!Number.isFinite(input.conversionPercent) || input.conversionPercent < 0 || input.conversionPercent > 100) {
    return { ok: false, message: "La conversión va de 0 a 100." };
  }
  if (!isMoney(input.monthlyPrice) || !isMoney(input.pricePerEmployee)) {
    return { ok: false, message: numberError };
  }
  if (input.annualPrice !== null && !isMoney(input.annualPrice)) {
    return { ok: false, message: "El precio anual no puede ser negativo." };
  }

  const payingUsers = input.users * (input.conversionPercent / 100);
  const freeUsers = input.users - payingUsers;
  const mrr = payingUsers * input.monthlyPrice;
  const arr = mrr * 12;
  const sponsorMrr = input.b2bAccounts * input.employeesPerAccount * input.pricePerEmployee;
  const combinedMrr = mrr + sponsorMrr;

  return {
    ok: true,
    value: {
      payingUsers,
      freeUsers,
      mrr,
      arr,
      projectedGrossRevenueMonthly: mrr,
      revenuePerUser: input.users === 0 ? null : mrr / input.users,
      annualPlanRevenue: input.annualPrice === null ? null : payingUsers * input.annualPrice,
      sponsorMrr,
      combinedMrr,
      combinedArr: combinedMrr * 12,
    },
  };
}

export function projectUnitEconomics(
  revenue: RevenueProjection,
  monthlyPrice: number,
  costs: CostInput,
): { ok: true; value: UnitEconomics } | { ok: false; message: string } {
  const costValues = [
    costs.cac,
    costs.onboardingCost,
    costs.supportCost,
    costs.infrastructureCost,
    costs.paymentProcessing,
    costs.reviewCost,
    costs.correctionCost,
    costs.exceptionCost,
  ];
  if (costValues.some((value) => !isMoney(value))) {
    return { ok: false, message: "Los costos no pueden ser negativos." };
  }
  if (
    costs.churnPercent !== null &&
    (!Number.isFinite(costs.churnPercent) || costs.churnPercent < 0 || costs.churnPercent > 100)
  ) {
    return { ok: false, message: "El churn supuesto va de 0 a 100." };
  }

  const variablePerPayer =
    costs.supportCost +
    costs.infrastructureCost +
    costs.paymentProcessing +
    costs.reviewCost +
    costs.correctionCost +
    costs.exceptionCost;
  const variableCost = revenue.payingUsers * variablePerPayer;
  const contribution = revenue.mrr - variableCost;
  const contributionPerPayer = monthlyPrice - variablePerPayer;

  return {
    ok: true,
    value: {
      revenue: revenue.mrr,
      variableCost,
      oneTimeOnboarding: revenue.payingUsers * costs.onboardingCost,
      contribution,
      contributionMarginPercent: revenue.mrr === 0 ? null : (contribution / revenue.mrr) * 100,
      contributionPerPayer: revenue.payingUsers === 0 ? null : contributionPerPayer,
      cacPaybackMonths:
        contributionPerPayer > 0 && costs.cac > 0 ? costs.cac / contributionPerPayer : null,
      profitable: false,
    },
  };
}

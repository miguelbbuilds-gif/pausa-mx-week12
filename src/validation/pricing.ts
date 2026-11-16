import { z } from "zod";

const count = z.number().int().min(0).max(1_000_000_000);
const money = z.number().min(0).max(1_000_000);
const percent = z.number().min(0).max(100);

export const pricingScenarioSchema = z.object({
  name: z.string().trim().min(1, "Ponle un nombre corto.").max(80),
  segment: z.enum(["consumer", "sponsor"]),
  users: count,
  conversionRate: percent,
  monthlyPrice: money,
  annualPrice: money.nullable(),
  b2bAccounts: count,
  employeesPerAccount: count,
  pricePerEmployee: money,
  cac: money,
  onboardingCost: money,
  supportCost: money,
  infrastructureCost: money,
  paymentProcessing: money,
  reviewCost: money,
  correctionCost: money,
  exceptionCost: money,
  churnAssumption: percent.nullable(),
});

export type PricingScenarioInput = z.infer<typeof pricingScenarioSchema>;

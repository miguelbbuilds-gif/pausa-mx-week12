"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabase } from "@/lib/supabase/server";
import { pricingScenarioSchema, type PricingScenarioInput } from "@/validation/pricing";

export type PricingScenarioRow = {
  id: string;
  name: string;
  segment: "consumer" | "sponsor";
  users: number;
  conversionRate: number;
  monthlyPrice: number;
  createdAt: string;
};

export type PricingSaveResult =
  | { ok: true; id: string }
  | { ok: false; code: "invalid" | "unauthenticated" | "unconfigured" | "rejected"; message: string };

function numberFrom(value: unknown): number {
  if (typeof value === "number") return value;
  if (typeof value === "string" && value.trim() !== "") return Number(value);
  return Number.NaN;
}

export async function listMyPricingScenarios(): Promise<PricingScenarioRow[]> {
  const supabase = await createServerSupabase();
  if (!supabase) return [];
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("pricing_scenarios")
    .select("id, name, segment, users, conversion_rate, monthly_price, created_at")
    .order("created_at", { ascending: false })
    .limit(20);

  if (error || !data) return [];

  return data.flatMap((row) => {
    const segment = row.segment === "sponsor" ? "sponsor" : row.segment === "consumer" ? "consumer" : null;
    if (!segment || typeof row.id !== "string" || typeof row.name !== "string") return [];
    return [
      {
        id: row.id,
        name: row.name,
        segment,
        users: numberFrom(row.users),
        conversionRate: numberFrom(row.conversion_rate),
        monthlyPrice: numberFrom(row.monthly_price),
        createdAt: String(row.created_at),
      },
    ];
  });
}

export async function savePricingScenario(raw: unknown): Promise<PricingSaveResult> {
  const parsed = pricingScenarioSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      code: "invalid",
      message: parsed.error.issues[0]?.message ?? "Revisa el escenario.",
    };
  }

  const supabase = await createServerSupabase();
  if (!supabase) {
    return { ok: false, code: "unconfigured", message: "Supabase no está configurado en este entorno." };
  }
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { ok: false, code: "unauthenticated", message: "Entra con tu cuenta para guardar este escenario." };
  }

  const input: PricingScenarioInput = parsed.data;
  const { data, error } = await supabase
    .from("pricing_scenarios")
    .insert({
      user_id: user.id,
      name: input.name,
      segment: input.segment,
      users: input.users,
      conversion_rate: input.conversionRate,
      monthly_price: input.monthlyPrice,
      annual_price: input.annualPrice,
      b2b_accounts: input.b2bAccounts,
      employees_per_account: input.employeesPerAccount,
      price_per_employee: input.pricePerEmployee,
      cac: input.cac,
      onboarding_cost: input.onboardingCost,
      support_cost: input.supportCost,
      infrastructure_cost: input.infrastructureCost,
      payment_processing: input.paymentProcessing,
      review_cost: input.reviewCost,
      correction_cost: input.correctionCost,
      exception_cost: input.exceptionCost,
      churn_assumption: input.churnAssumption,
    })
    .select("id")
    .single();

  if (error || !data) {
    return { ok: false, code: "rejected", message: "No se pudo guardar el escenario." };
  }

  revalidatePath("/pricing");
  return { ok: true, id: String(data.id) };
}

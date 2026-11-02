"use server";

import { revalidatePath } from "next/cache";
import { evaluatePurchase } from "@/engine";
import { createServerSupabase } from "@/lib/supabase/server";
import { purchaseFormSchema } from "@/validation/schema";

export type SaveState =
  | { status: "idle" }
  | { status: "unauthenticated" }
  | { status: "unconfigured" }
  | { status: "invalid"; message: string }
  | { status: "error"; message: string }
  | { status: "saved"; id: string };

export async function saveEvaluation(
  raw: unknown,
): Promise<SaveState> {
  const parsed = purchaseFormSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      status: "invalid",
      message: parsed.error.issues[0]?.message ?? "Revisa los datos.",
    };
  }

  const result = evaluatePurchase({
    availableMoney: parsed.data.availableMoney,
    essentialExpenses: parsed.data.essentialExpenses,
    committedPayments: parsed.data.committedPayments,
    purchasePrice: parsed.data.purchasePrice,
    paymentMethod: parsed.data.paymentMethod,
    downPayment: parsed.data.downPayment,
    installmentCount: parsed.data.installmentCount,
    installmentAmount: parsed.data.installmentAmount,
  });

  if (!result.ok) {
    return { status: "invalid", message: result.explanation };
  }

  const supabase = await createServerSupabase();
  if (!supabase) {
    return { status: "unconfigured" };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { status: "unauthenticated" };
  }

  const { data, error } = await supabase
    .from("evaluations")
    .insert({
      user_id: user.id,
      title:
        parsed.data.paymentMethod === "full"
          ? "Compra de contado"
          : "Compra a meses",
      inputs: parsed.data,
      result,
    })
    .select("id")
    .single();

  if (error || !data) {
    return {
      status: "error",
      message:
        "No se pudo guardar. Si acabas de configurar Supabase, aplica la migración SQL.",
    };
  }

  revalidatePath("/product");
  return { status: "saved", id: data.id };
}

export async function loadEvaluations() {
  const supabase = await createServerSupabase();
  if (!supabase) {
    return { configured: false as const, user: false as const, rows: [] };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { configured: true as const, user: false as const, rows: [] };
  }

  const { data, error } = await supabase
    .from("evaluations")
    .select("id, title, inputs, result, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) {
    return { configured: true as const, user: true as const, rows: [] };
  }

  return { configured: true as const, user: true as const, rows: data ?? [] };
}

export async function deleteEvaluation(id: string) {
  const supabase = await createServerSupabase();
  if (!supabase) return { ok: false as const };
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false as const };

  const { error } = await supabase
    .from("evaluations")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (!error) {
    revalidatePath("/product");
  }
  return { ok: !error };
}

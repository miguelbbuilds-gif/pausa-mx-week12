"use server";

import { feedbackSchema } from "@/validation/feedback";
import { createServerSupabase } from "@/lib/supabase/server";

export type FeedbackResult =
  | { ok: true }
  | {
      ok: false;
      code: "invalid" | "unconfigured" | "migration_missing" | "rejected" | "rate_limited";
      message: string;
    };

export async function submitComparisonFeedback(raw: unknown): Promise<FeedbackResult> {
  const parsed = feedbackSchema.safeParse(raw);
  if (!parsed.success) {
    const rejected = parsed.error.issues.some((issue) => issue.message === "rejected");
    return {
      ok: false,
      code: rejected ? "rejected" : "invalid",
      message: rejected
        ? "No se pudo enviar."
        : (parsed.error.issues[0]?.message ?? "Revisa el comentario."),
    };
  }

  const supabase = await createServerSupabase();
  if (!supabase) {
    return {
      ok: false,
      code: "unconfigured",
      message: "El comentario no se guardó: este entorno no tiene Supabase.",
    };
  }

  const { data, error } = await supabase.rpc("submit_comparison_feedback", {
    p_session: parsed.data.sessionId,
    p_comment: parsed.data.confusingPart.trim(),
    p_would_return: parsed.data.wouldReturn ?? "",
    p_trap: parsed.data.company,
  });

  if (error) {
    if (
      error.code === "PGRST202" ||
      error.message.includes("submit_comparison_feedback")
    ) {
      return {
        ok: false,
        code: "migration_missing",
        message:
          "El comentario no se guardó. Falta aplicar la migración de Week 13 en Supabase.",
      };
    }
    return { ok: false, code: "rejected", message: "No se pudo enviar." };
  }

  if (data && typeof data === "object" && "ok" in data && data.ok === false) {
    const code = "code" in data ? String(data.code) : "";
    if (code === "rate_limited") {
      return {
        ok: false,
        code: "rate_limited",
        message: "Ya enviaste un comentario hace un momento.",
      };
    }
    if (code === "contact") {
      return {
        ok: false,
        code: "invalid",
        message: "No incluyas un correo ni otros datos de contacto.",
      };
    }
    return { ok: false, code: "rejected", message: "No se pudo enviar." };
  }

  return { ok: true };
}

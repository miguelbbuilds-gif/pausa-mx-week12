"use server";

import { parseProductEvent } from "@/lib/analytics/events";
import { createServerSupabase } from "@/lib/supabase/server";

export type TelemetryResult =
  | { ok: true }
  | { ok: false; code: "invalid" | "unconfigured" | "migration_missing" | "rejected" | "rate_limited" };

export async function recordProductEvent(raw: unknown): Promise<TelemetryResult> {
  const parsed = parseProductEvent(raw);
  if (!parsed.ok) return { ok: false, code: "invalid" };

  const supabase = await createServerSupabase();
  if (!supabase) return { ok: false, code: "unconfigured" };

  const { data, error } = await supabase.rpc("record_product_event", {
    p_session: parsed.value.sessionId,
    p_event: parsed.value.event,
    p_detail: parsed.value.detail,
  });

  if (error) {
    if (error.code === "PGRST202" || error.message.includes("record_product_event")) {
      return { ok: false, code: "migration_missing" };
    }
    return { ok: false, code: "rejected" };
  }

  if (data && typeof data === "object" && "ok" in data && data.ok === false) {
    const code = "code" in data && data.code === "rate_limited" ? "rate_limited" : "rejected";
    return { ok: false, code };
  }

  return { ok: true };
}

"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabase } from "@/lib/supabase/server";
import {
  canPrioritizeRealFindings,
  countVerifiedRealSessions,
  researchPrioritySchema,
  researchSessionSchema,
} from "@/validation/research";

export type ResearchAccess =
  | { status: "unconfigured" }
  | { status: "anonymous" }
  | { status: "forbidden" }
  | { status: "migration_missing" }
  | {
      status: "founder";
      sessions: ResearchSessionRow[];
      priorities: ResearchPriorityRow[];
      feedback: FeedbackRow[];
      eventCounts: { eventName: string; count: number }[];
      verifiedRealSessions: number;
      canPrioritize: boolean;
    };

export type ResearchSessionRow = {
  id: string;
  sessionCode: string;
  participantRole: string;
  relationship: "unknown" | "known";
  sessionDate: string;
  taskAttempted: string;
  observedDifficulty: string;
  verbatimQuote: string;
  severity: "low" | "medium" | "high" | "critical";
  evidenceRef: string;
  verificationStatus: "unverified" | "verified";
  isDemo: boolean;
};

export type ResearchPriorityRow = {
  rank: number;
  title: string;
  summary: string;
  isDemo: boolean;
};

export type FeedbackRow = {
  id: string;
  confusingPart: string | null;
  wouldReturn: "yes" | "maybe" | "no" | null;
  createdAt: string;
  signedIn: boolean;
};

type Gate =
  | { ok: true; supabase: NonNullable<Awaited<ReturnType<typeof createServerSupabase>>>; userId: string }
  | { ok: false; code: "unconfigured" | "anonymous" | "forbidden" | "migration_missing" };

async function requireFounder(): Promise<Gate> {
  const supabase = await createServerSupabase();
  if (!supabase) return { ok: false, code: "unconfigured" };
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, code: "anonymous" };
  const { data, error } = await supabase.rpc("is_founder");
  if (error) return { ok: false, code: "migration_missing" };
  if (data !== true) return { ok: false, code: "forbidden" };
  return { ok: true, supabase, userId: user.id };
}

export async function loadResearchDesk(): Promise<ResearchAccess> {
  const gate = await requireFounder();
  if (!gate.ok) return { status: gate.code };

  const [sessionsResult, prioritiesResult, feedbackResult, eventsResult] = await Promise.all([
    gate.supabase
      .from("research_sessions")
      .select(
        "id, session_code, participant_role, relationship, session_date, task_attempted, observed_difficulty, verbatim_quote, severity, evidence_ref, verification_status, is_demo",
      )
      .order("session_date", { ascending: false })
      .limit(50),
    gate.supabase
      .from("research_priorities")
      .select("rank, title, summary, is_demo")
      .order("rank", { ascending: true }),
    gate.supabase
      .from("comparison_feedback")
      .select("id, confusing_part, would_return, created_at, user_id")
      .order("created_at", { ascending: false })
      .limit(50),
    gate.supabase.from("product_events").select("event_name").limit(500),
  ]);

  if (sessionsResult.error || prioritiesResult.error || feedbackResult.error || eventsResult.error) {
    return { status: "migration_missing" };
  }

  const sessions: ResearchSessionRow[] = (sessionsResult.data ?? []).map((row) => ({
    id: row.id,
    sessionCode: row.session_code,
    participantRole: row.participant_role,
    relationship: row.relationship,
    sessionDate: row.session_date,
    taskAttempted: row.task_attempted,
    observedDifficulty: row.observed_difficulty,
    verbatimQuote: row.verbatim_quote,
    severity: row.severity,
    evidenceRef: row.evidence_ref,
    verificationStatus: row.verification_status,
    isDemo: row.is_demo,
  }));

  const verifiedRealSessions = countVerifiedRealSessions(
    sessions.map((row) => ({
      isDemo: row.isDemo,
      verificationStatus: row.verificationStatus,
    })),
  );

  const counts = new Map<string, number>();
  for (const row of eventsResult.data ?? []) {
    counts.set(row.event_name, (counts.get(row.event_name) ?? 0) + 1);
  }

  return {
    status: "founder",
    sessions,
    priorities: (prioritiesResult.data ?? []).map((row) => ({
      rank: row.rank,
      title: row.title,
      summary: row.summary,
      isDemo: row.is_demo,
    })),
    feedback: (feedbackResult.data ?? []).map((row) => ({
      id: row.id,
      confusingPart: row.confusing_part,
      wouldReturn: row.would_return,
      createdAt: row.created_at,
      signedIn: Boolean(row.user_id),
    })),
    eventCounts: [...counts.entries()].map(([eventName, count]) => ({ eventName, count })),
    verifiedRealSessions,
    canPrioritize: canPrioritizeRealFindings(verifiedRealSessions),
  };
}

export async function createResearchSession(raw: unknown) {
  const gate = await requireFounder();
  if (!gate.ok) return { ok: false as const, message: "No autorizado." };

  const parsed = researchSessionSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false as const,
      message: parsed.error.issues[0]?.message ?? "Revisa los campos.",
    };
  }

  const { error } = await gate.supabase.from("research_sessions").insert({
    session_code: parsed.data.sessionCode,
    participant_role: parsed.data.participantRole,
    relationship: parsed.data.relationship,
    session_date: parsed.data.sessionDate,
    task_attempted: parsed.data.taskAttempted,
    observed_difficulty: parsed.data.observedDifficulty,
    verbatim_quote: parsed.data.verbatimQuote,
    severity: parsed.data.severity,
    evidence_ref: parsed.data.evidenceRef,
    consent_recorded: true,
    verification_status: parsed.data.verificationStatus,
    is_demo: parsed.data.isDemo,
    created_by: gate.userId,
  });

  if (error) {
    return {
      ok: false as const,
      message: "No se pudo registrar. Revisa la migración y que no falte el consentimiento.",
    };
  }

  revalidatePath("/investigacion");
  return { ok: true as const };
}

export async function saveResearchPriority(raw: unknown) {
  const gate = await requireFounder();
  if (!gate.ok) return { ok: false as const, message: "No autorizado." };

  const parsed = researchPrioritySchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false as const,
      message: parsed.error.issues[0]?.message ?? "Revisa la prioridad.",
    };
  }

  if (!parsed.data.isDemo) {
    const { count, error: countError } = await gate.supabase
      .from("research_sessions")
      .select("id", { count: "exact", head: true })
      .eq("is_demo", false)
      .eq("verification_status", "verified");
    if (countError) {
      return { ok: false as const, message: "No se pudo comprobar las sesiones." };
    }
    if (!canPrioritizeRealFindings(count ?? 0)) {
      return {
        ok: false as const,
        message:
          "Hacen falta cinco sesiones reales verificadas. No se elige un problema #1 antes de esa evidencia.",
      };
    }
  }

  const { error } = await gate.supabase.from("research_priorities").upsert(
    {
      rank: parsed.data.rank,
      title: parsed.data.title,
      summary: parsed.data.summary,
      is_demo: parsed.data.isDemo,
      created_by: gate.userId,
    },
    { onConflict: "rank" },
  );

  if (error) {
    return {
      ok: false as const,
      message: parsed.data.isDemo
        ? "No se pudo guardar la prioridad DEMO."
        : "No se pudo guardar. Siguen haciendo falta cinco sesiones reales verificadas.",
    };
  }

  revalidatePath("/investigacion");
  return { ok: true as const };
}

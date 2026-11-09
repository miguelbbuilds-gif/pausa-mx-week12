import { z } from "zod";

export const researchSessionSchema = z.object({
  sessionCode: z
    .string()
    .trim()
    .min(2, "Usa un identificador corto, sin nombre real.")
    .max(40, "El identificador es demasiado largo.")
    .regex(/^[A-Za-z0-9_-]+$/, "Usa solo letras, números, guion o guion bajo."),
  participantRole: z
    .string()
    .trim()
    .min(3, "Describe el rol general, no el nombre.")
    .max(120, "Describe el rol en 120 caracteres o menos."),
  relationship: z.enum(["unknown", "known"]),
  sessionDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Usa una fecha válida."),
  taskAttempted: z.string().trim().min(3, "Describe la tarea.").max(300),
  observedDifficulty: z.string().trim().min(3, "Describe la dificultad.").max(500),
  verbatimQuote: z.string().trim().min(1, "La cita no puede ir vacía.").max(1000),
  severity: z.enum(["low", "medium", "high", "critical"]),
  evidenceRef: z.string().trim().min(2).max(200),
  consentRecorded: z.literal(true, {
    errorMap: () => ({ message: "Hace falta el consentimiento para registrar la observación." }),
  }),
  verificationStatus: z.enum(["unverified", "verified"]),
  isDemo: z.boolean(),
});

export const researchPrioritySchema = z.object({
  rank: z.coerce.number().int().min(1).max(3),
  title: z.string().trim().min(3).max(160),
  summary: z.string().trim().min(3).max(800),
  isDemo: z.boolean(),
});

export function canPrioritizeRealFindings(verifiedRealSessions: number): boolean {
  return verifiedRealSessions >= 5;
}

export function countVerifiedRealSessions(
  rows: { isDemo: boolean; verificationStatus: "unverified" | "verified" }[],
): number {
  return rows.filter((row) => !row.isDemo && row.verificationStatus === "verified").length;
}

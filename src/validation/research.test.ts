import { describe, expect, it } from "vitest";
import {
  canPrioritizeRealFindings,
  countVerifiedRealSessions,
  researchSessionSchema,
} from "./research";

const valid = {
  sessionCode: "S-01",
  participantRole: "adulto que evalúa una compra personal",
  relationship: "unknown",
  sessionDate: "2026-11-08",
  taskAttempted: "Comparar una compra de contado",
  observedDifficulty: "Dudó en el significado de obligaciones",
  verbatimQuote: "No supe si obligaciones era la renta.",
  severity: "high",
  evidenceRef: "nota del observador, sin nombre",
  consentRecorded: true,
  verificationStatus: "unverified",
  isDemo: true,
};

describe("research session rules", () => {
  it("requires documented consent and rejects a real-looking email in the code", () => {
    expect(researchSessionSchema.safeParse(valid).success).toBe(true);
    expect(
      researchSessionSchema.safeParse({ ...valid, consentRecorded: false }).success,
    ).toBe(false);
    expect(
      researchSessionSchema.safeParse({ ...valid, sessionCode: "Ana López" }).success,
    ).toBe(false);
  });

  it("does not treat demo or unverified rows as five real sessions", () => {
    const rows = [
      { isDemo: true, verificationStatus: "verified" as const },
      { isDemo: false, verificationStatus: "unverified" as const },
      { isDemo: false, verificationStatus: "verified" as const },
    ];
    expect(countVerifiedRealSessions(rows)).toBe(1);
    expect(canPrioritizeRealFindings(1)).toBe(false);
    expect(canPrioritizeRealFindings(5)).toBe(true);
  });
});

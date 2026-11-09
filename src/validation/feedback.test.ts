import { describe, expect, it } from "vitest";
import { feedbackSchema } from "./feedback";

const sessionId = "a1b2c3d4e5f67890abcd";

describe("feedbackSchema", () => {
  it("accepts an optional comment and a return answer", () => {
    const parsed = feedbackSchema.safeParse({
      sessionId,
      confusingPart: "No entendí qué queda hoy.",
      wouldReturn: "maybe",
      company: "",
    });
    expect(parsed.success).toBe(true);
  });

  it("rejects contact details, empty sends, overflow, and the honeypot", () => {
    expect(
      feedbackSchema.safeParse({
        sessionId,
        confusingPart: "escríbeme a persona@example.com",
        wouldReturn: "yes",
        company: "",
      }).success,
    ).toBe(false);
    expect(
      feedbackSchema.safeParse({
        sessionId,
        confusingPart: "",
        company: "",
      }).success,
    ).toBe(false);
    expect(
      feedbackSchema.safeParse({
        sessionId,
        confusingPart: "x".repeat(401),
        wouldReturn: "no",
        company: "",
      }).success,
    ).toBe(false);
    expect(
      feedbackSchema.safeParse({
        sessionId,
        confusingPart: "confuso",
        wouldReturn: "yes",
        company: "acme",
      }).success,
    ).toBe(false);
  });
});

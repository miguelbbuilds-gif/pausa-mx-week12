import { describe, expect, it } from "vitest";
import { authCredentialsSchema, signUpFormSchema } from "./auth";

describe("auth schemas", () => {
  it("rejects an invalid email", () => {
    const parsed = authCredentialsSchema.safeParse({
      email: "no-es-correo",
      password: "segura123",
    });
    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      expect(parsed.error.flatten().fieldErrors.email?.[0]).toMatch(/correo válido/i);
    }
  });

  it("rejects a short password", () => {
    const parsed = authCredentialsSchema.safeParse({
      email: "a@pausa.mx",
      password: "corta",
    });
    expect(parsed.success).toBe(false);
  });

  it("rejects mismatched confirmation", () => {
    const parsed = signUpFormSchema.safeParse({
      email: "a@pausa.mx",
      password: "segura123",
      confirmPassword: "otra1234",
    });
    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      expect(parsed.error.flatten().fieldErrors.confirmPassword?.[0]).toMatch(
        /no coinciden/i,
      );
    }
  });

  it("accepts matching credentials", () => {
    const parsed = signUpFormSchema.safeParse({
      email: "a@pausa.mx",
      password: "segura123",
      confirmPassword: "segura123",
    });
    expect(parsed.success).toBe(true);
  });
});

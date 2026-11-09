import { describe, expect, it } from "vitest";
import { publicOrigin, safeNextPath } from "./site-origin";

function headers(values: Record<string, string>) {
  return (name: string) => values[name.toLowerCase()] ?? null;
}

describe("publicOrigin", () => {
  it("uses the production host when the header matches", () => {
    expect(
      publicOrigin(headers({ host: "pausa-mx-week12.vercel.app", "x-forwarded-proto": "https" })),
    ).toBe("https://pausa-mx-week12.vercel.app");
  });

  it("uses localhost for local development", () => {
    expect(publicOrigin(headers({ host: "127.0.0.1:3000" }))).toBe("http://127.0.0.1:3000");
  });

  it("rejects an arbitrary host", () => {
    expect(publicOrigin(headers({ host: "evil.example", "x-forwarded-proto": "https" }))).toBe(
      "https://pausa-mx-week12.vercel.app",
    );
  });
});

describe("safeNextPath", () => {
  it("allows only the product and home paths", () => {
    expect(safeNextPath("/product")).toBe("/product");
    expect(safeNextPath("/")).toBe("/");
    expect(safeNextPath("https://evil.example")).toBe("/product");
    expect(safeNextPath("//evil.example")).toBe("/product");
  });
});

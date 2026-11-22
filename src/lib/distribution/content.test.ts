import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  ASSETS,
  BANNED_COPY,
  COVERAGE_LINES,
  CONCEPTS,
  SERIES,
} from "./content";

describe("week 15 distribution content", () => {
  it("publishes three series, six concepts, and three finished assets", () => {
    expect(SERIES).toHaveLength(3);
    expect(CONCEPTS).toHaveLength(6);
    expect(ASSETS).toHaveLength(3);
    expect(new Set(CONCEPTS.map((concept) => concept.seriesId)).size).toBe(3);
    expect(CONCEPTS.every((concept) => concept.status === "concept")).toBe(true);
    expect(ASSETS.every((asset) => asset.status === "finished-file")).toBe(true);
    expect(CONCEPTS.every((concept) => concept.claimClass === "DEMO")).toBe(true);
    expect(new Set(ASSETS.map((asset) => asset.format)).size).toBeGreaterThanOrEqual(2);
  });

  it("keeps demo claims and coverage lines inside every finished file", () => {
    for (const asset of ASSETS) {
      expect(asset.files.length).toBeGreaterThan(0);
      for (const file of asset.files) {
        const text = readFileSync(path.join(process.cwd(), "public", file), "utf8");
        expect(text).toContain("PAUSA MX");
        expect(text).toContain("Datos de demostración");
        expect(text).toContain("Prueba una compra");
        for (const line of COVERAGE_LINES) {
          expect(text).toContain(line);
        }
        for (const phrase of BANNED_COPY) {
          expect(text.toLowerCase().includes(phrase.toLowerCase())).toBe(false);
        }
      }
    }
  });
});
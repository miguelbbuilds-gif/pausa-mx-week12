import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

function filesUnder(dir: string): string[] {
  const entries = readdirSync(dir);
  const files: string[] = [];
  for (const entry of entries) {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) {
      files.push(...filesUnder(full));
    } else if (/\.(ts|tsx|sql|mjs|js)$/.test(entry)) {
      files.push(full);
    }
  }
  return files;
}

describe("week 13 security boundaries in source", () => {
  it("does not embed a service-role key or a raw JWT in application source", () => {
    const roots = ["src", "supabase"].map((dir) => path.join(process.cwd(), dir));
    const hits: string[] = [];
    for (const file of roots.flatMap(filesUnder)) {
      if (file.endsWith("security.test.ts")) continue;
      const text = readFileSync(file, "utf8");
      if (/service_role|SUPABASE_SERVICE_ROLE|eyJhbGciOi/.test(text)) {
        hits.push(path.relative(process.cwd(), file));
      }
    }
    expect(hits).toEqual([]);
  });

  it("enables RLS on the private week 13 tables", () => {
    const events = readFileSync(
      path.join(process.cwd(), "supabase/migrations/20261108_product_events.sql"),
      "utf8",
    );
    const feedback = readFileSync(
      path.join(process.cwd(), "supabase/migrations/20261108_feedback_research.sql"),
      "utf8",
    );
    for (const table of ["app_admins", "product_events"]) {
      expect(events).toContain(`alter table public.${table} enable row level security`);
    }
    for (const table of ["comparison_feedback", "research_sessions", "research_priorities"]) {
      expect(feedback).toContain(`alter table public.${table} enable row level security`);
    }
    expect(feedback).toContain("priority_requires_five_verified_sessions");
    expect(feedback).not.toContain("for select\n  to anon");
  });
});

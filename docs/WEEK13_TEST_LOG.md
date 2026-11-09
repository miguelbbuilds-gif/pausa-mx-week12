# Test log — PAUSA MX Week 13

Times are local (UTC−6) on 2026-11-08 unless noted. Only runs from this session.

## Before any Week 13 code

- Production `https://pausa-mx-week12.vercel.app` and `/product`: HTTP 200 at 2026-11-09 01:41 UTC.
- `npm test`: 15 passed.

## Unit, typecheck, lint

After feedback and research code:

- `npx tsc --noEmit`: pass
- `npx eslint` on the touched files: pass
- `npm test`: **24 passed** (7 files), including engine, auth schema, feedback, research priority guard, and the source scan that rejects a service-role key in `src/` and `supabase/`.

## Browser

Chromium via Playwright. `tests/week13.spec.ts` and `tests/smoke.spec.ts`.

First run, before the menu fix: **2 failed, 6 passed**.

- The feedback assertion was too broad (`getByRole('alert')` also matched the Next.js route announcer). The message “Escribe qué confundió o elige si volverías.” was on the page. The locator was narrowed. That was a test defect, not a product defect.
- The phone test timed out on `getByRole('button', { name: 'Menú' })`. The snapshot showed the control as a generic inside a group, and the mobile links were not open. See `docs/WEEK13_BEFORE_AFTER.md`.

After `cc50293`: the same two files, **8 passed** (27.6s).

## Auth, save, isolation

`tests/auth-save.spec.ts` against the live Supabase project, local `next dev` with `.env.local`: **3 passed** (26.0s).

- New account, save, reload, reopen.
- Second account did not see the first account’s rows.
- Mismatched passwords show a validation message.

The dev server logged `ECONNRESET` / “destination stream errored” during that run. The three tests still passed. That warning was not turned into a separate bug fix.

## RLS probe, anonymous key, 2026-11-08

`node scripts/probe-week13-rls.mjs`:

| Table | Result |
| --- | --- |
| `evaluations` | `VISIBLE_ROWS 0` |
| `product_events` | `PGRST205` table not in schema cache |
| `comparison_feedback` | `PGRST205` |
| `research_sessions` | `PGRST205` |
| `research_priorities` | `PGRST205` |
| `app_admins` | `PGRST205` |

The evaluations table already rejects an anonymous read. The Week 13 tables are **not applied** in Supabase. This agent has no Supabase access token, so it did not run the SQL. Until Miguel runs the two migrations, events, comments, and the research desk cannot be stored.

## Not run as a passing claim

- Google OAuth: not configured.
- Five human sessions: not done.
- Production HTTP of the Week 13 build: not deployed at the time of this log. A later deployment log entry is the only place that may say otherwise.

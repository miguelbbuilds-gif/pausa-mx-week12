# Decisions — PAUSA MX Week 12

This file is the Week 12 path requested in the delivery checklist. The same log is kept at `/DECISIONS.md` (created earlier in the rebuild). Do not treat either copy as a team vote.

Logged as they were made. Not a full chat transcript.

## 2026-11-01 — Documentation before rebuild

Charter, personas, and packet were committed while this repository still had no application files (`2a5243f`). Week 10 code lives in a separate folder and is not this rebuild. Git history supports “charter before this Week 12 rebuild,” not “charter before the original Week 10 prototype.”

METHOD, VERDICT, MANIFESTO, and the Week 12 team Blueprint were absent. Methodology is provisional. Week 11 shadow language was not reused.

## 2026-11-01 — Engine arithmetic

Amounts are converted to integer cents, added and subtracted, then divided by 100. The engine does not invent interest. Installment totals are only `enganche + (n × monto escrito)`.

PACKET v0.1 mentioned banker’s rounding. JavaScript `Math.round(mxn * 100)` is not banker’s rounding and, for values such as `1.005`, is not even a reliable half-up because `1.005 * 100` is `100.49999999999999`. Decision: round half-up on a decimal string of the pesos amount, then parse cents. Documented after the failing unit test.

## 2026-11-01 — Preview vs save

Preview runs `evaluatePurchase` in the browser. Save is a server action that validates with Zod, recomputes, and inserts only if an authenticated user exists. Browser `localStorage` is not used as a fake secure store.

## 2026-11-01 — Next.js 16 proxy

Session refresh lives in `src/proxy.ts` (Next.js 16 replacement for `middleware.ts`), Node runtime.

## 2026-11-01 — Unstyled UI

`@import "tailwindcss"` was present but Next.js never compiled utilities: `postcss.config.mjs` and `@tailwindcss/postcss` were missing. Added the PostCSS plugin from the Next.js 16 CSS guide.

## 2026-11-01 — Domain

RDAP for `pausamx.site` and `pausamx.online` returned HTTP 404 at Identity Digital. Porkbun’s public TLD list (https://porkbun.com/products/domains, read 2026-11-01) shows first-year **$1.96** and renewal **$28.84** for both `.site` and `.online` (non-premium). That is list price, not a checkout for `pausamx.site`. No domain was purchased.

## 2026-11-08 — Week 13 measurement without amounts

Events store a name and an allowlisted detail code. They do not store MXN amounts, names, emails, passwords, or tokens. Preview math stays in the browser. Feedback text is optional, capped at 400 characters, and rejected if it looks like an email address. Research notes are founder-only and cannot be prioritized as real findings until five verified non-demo sessions exist.

## 2026-11-08 — Google OAuth still pending

No Google client credentials were available. Email/password stays. It is not recorded as Sign in with Google. Steps: `docs/WEEK13_GOOGLE_OAUTH.md`.

## 2026-11-08 — Mobile menu

A `<summary>` menu was exposed as a generic in Chromium, so the phone test could not open navigation. Replaced with a `<button>`. This was a mechanical defect, not a human-test finding.

## 2026-11-09 — Next action

Apply `supabase/migrations/20261108_product_events.sql` and `supabase/migrations/20261108_feedback_research.sql` in the Supabase SQL editor, confirm `app_admins` contains the founder, then run the five observed sessions in `docs/WEEK13_HUMAN_TEST_PROTOCOL.md`. Do not rank a human problem before those sessions exist.

## 2026-11-08 — Week 13 migrations not applied remotely

The anon probe saw `evaluations` and zero rows. `product_events` and the research tables returned `PGRST205`. SQL is in the repo. Applying it needs the Supabase SQL editor. No service-role key was added to the app.

## 2026-11-01 — Email/password instead of Google Sign-In

Google Cloud Console required an interactive login this agent could not complete (`gcloud` missing; GCP sign-in wall). Founder instruction: finish Week 12 without Google OAuth.

Decision: Supabase Auth email + password, same PostgreSQL table, same RLS (`auth.uid() = user_id`). Email confirmations are **off** because the project has no SMTP. **This decision does not satisfy a Google Sign-In requirement literally.** Preview remains local until a real session exists.

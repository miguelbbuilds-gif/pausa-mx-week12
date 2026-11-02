# Test log — PAUSA MX Week 12

Evidence from actual runs. Times are local (UTC−6) on 2026-11-01 unless noted.

## Unit tests

Command: `npx vitest run`

### Before rounding fix

`toCents` used `Math.round(mxn * 100)`.

Observed: `1.005 * 100 === 100.49999999999999`, so `toCents(1.005) === 100` (one cent short of the intended half-up value 101).

This is the **actual defect** found during mechanical testing. It was not invented.

### After rounding fix

`toCents` parses a three-decimal pesos string and half-ups the third decimal.

`npx vitest run` — 10 passed, including `1.005 → 101`, `1.015 → 102`, `9.995 → 1000`.

## Typecheck and lint

- `npx tsc --noEmit` — pass after typing `paymentMethod` as `PaymentMethod` (not `"full" as const`).
- `npx eslint .` — pass after AuthButton stopped calling `setState` synchronously in the unconfigured branch.

## Browser smoke

Command: `npx playwright test` (Playwright starts `npm run dev`).

### Before hydration wait

2 failed, 1 passed. Accessibility snapshot after fill still showed empty textboxes. Playwright had typed into the SSR markup; React hydration then reset the controlled inputs. “Comprar ahora” never appeared.

### After `data-hydrated` + wait

`useSyncExternalStore` marks the form hydrated. Tests wait for `form[data-hydrated='true']` then fill.

`npx playwright test` — 3 passed (routes, full-payment preview, unauthenticated save does not claim success).

Also: first `next build` listed `/product` as static `○` even though it reads the auth cookie. Set `export const dynamic = "force-dynamic"` so saved rows can appear after Google sign-in.

## Authenticated save / RLS

Not executed: Supabase project credentials were not in `.env.local` at the time of this log. Preview-only path was tested. Live Google save and two-user RLS remain founder steps (`supabase/SETUP.md`, `supabase/rls_isolation.sql`).

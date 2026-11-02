# Test log — PAUSA MX Week 12

Evidence from actual runs. Times are local (UTC−6) on 2026-11-01 unless noted.

## Unit tests

Command: `npx vitest run`

Latest run this session: **11 passed** (10 engine + 1 placeholder-env guard).

### Real bug 1 — cent rounding

`toCents` used `Math.round(mxn * 100)`.

Observed: `1.005 * 100 === 100.49999999999999`, so `toCents(1.005) === 100` (one cent short of half-up 101).

Fix: half-up on a three-decimal pesos string. Retest: `1.005 → 101`, `1.015 → 102`, `9.995 → 1000`.

### Real bug 2 — Playwright hydration

Before a `data-hydrated` wait, fill hit SSR markup; React reset the fields. “Comprar ahora” never appeared (2 failed / 1 passed).

Fix: `useSyncExternalStore` + wait for `form[data-hydrated='true']`. Retest: Playwright **5 passed** (routes, Tailwind background/font-size, phone viewport 390×844, preview, unauthenticated save does not claim success).

### Real bug 3 — missing Tailwind PostCSS

Localhost and first styled-check showed unstyled HTML. `next build` warned `Unknown at rule: @theme`.

Fix: `postcss.config.mjs` + `@tailwindcss/postcss`. Retest: body background `rgb(247, 244, 238)`, hero font-size > 28px; production HTML after deploy `858120b` includes compiled CSS chunk `0s9h0imqg4r4r.css`.

## Typecheck, lint, build

- `npx tsc --noEmit` — pass
- `npx eslint .` — pass
- `npm run build` — pass; `/product` is dynamic (`ƒ`)

## Authenticated save / Google / RLS

**Not verified.** No `.env.local` and production still renders “Falta .env.local”. Preview-only path was tested. Do not treat save/reopen as done.

# Test log — PAUSA MX Week 12

Evidence from actual runs. Times are local (UTC−6) on 2026-11-01 unless noted.

## Unit tests

Command: `npx vitest run`

Latest run this session: **15 passed** (10 engine + 1 placeholder-env guard + 4 auth schema).

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

## Authenticated save / email-password / RLS

Auth is **email and password**, not Google Sign-In. That course requirement is **not** met literally.

Playwright against live project `xrpbbmdossmlbstjrlta` (2026-11-01, local `next dev` + `.env.local`):

- `email auth save › create account, save, reload, reopen` — **passed**. New `@pausamx.test` account, Guardar showed “Evaluación guardada”, reload listed the row, Reabrir filled precio `2500`.
- `email auth save › second account cannot see the first account rows` — **passed**. Account A saved precio 3333; account B did not see `$3,333.00` and saw “Aún no hay evaluaciones guardadas.” After B saved 4444, A still did not see `$4,444.00`.
- Validation: mismatched passwords show “Las contraseñas no coinciden.”
- Full Playwright file run: **8 passed** (5 smoke + 3 auth).

Google login was **not** tested (provider not used).

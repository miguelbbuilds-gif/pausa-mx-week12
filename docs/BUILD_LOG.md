# Build log — PAUSA MX Week 12

Authentic operational notes. Not a full chat transcript. The Cursor conversation must be exported separately as BUILDCHAT.

## 2026-11-01 — Inspection

- Workspace `pausa-mx-week12` was empty and not a git repository.
- Read Week 10 PAUSA MX in `Documentos/pausa-mx-week10` (README, PRODUCT_PACKET, BLUEPRINT_ALIGNMENT, DECISIONS).
- METHOD, VERDICT, MANIFESTO, and Week 12 team BLUEPRINT were not found.
- Week 11 `mi-boleta-mx-week11` blueprint alignment was located and **not** reused.
- Initialized git (`main`).

## 2026-11-01 — Documentation first

- Created `docs/SOURCE_REVIEW.md`, `docs/CHARTER.md`, `docs/PERSONAS.md`, `docs/PACKET.md`.
- Generated UI mockup via Cursor image generation; stored as `docs/mockup.png`.
- Benchmark pages fetched: BBVA México interactivos; BBVA calculadora de presupuestos.
- First commit: charter, personas, packet only (plus source review and mockup needed by the packet).

## 2026-11-01 — Architecture and Mi Pausa

- Next.js 16 App Router already scaffolded in the folder; wired routes `/`, `/product`, `/about`, `/privacy`.
- Session refresh uses `src/proxy.ts` (Next.js 16), not deprecated `middleware.ts`.
- Preview is client-side `evaluatePurchase`. Save is a server action with Zod + engine recompute.
- Bug found in tests: `Math.round(1.005 * 100) === 100`. Replaced `toCents` with half-up on a three-decimal pesos string.
- Playwright smoke and Vitest added. Supabase keys not present; preview-only path used.
- GitHub account `miguelbbuilds-gif` authenticated. Vercel CLI logged in as the same user.
- GitHub: https://github.com/miguelbbuilds-gif/pausa-mx-week12
- First Vercel production deploy: `dpl_AMuSE6oWiWPg85Eco75J7QmpdcWo` → https://pausa-mx-week12.vercel.app (HTTP 200 without Vercel login).
- Second production deploy (GitHub integration): `dpl_Bxs8aaZPSBTqEQB2JXH1W3emmMXk`.

## 2026-11-01 — Unstyled localhost + save message

- Root cause of missing CSS: no `postcss.config.mjs` / `@tailwindcss/postcss`. Next was not expanding Tailwind utilities (`@theme` warning). After adding them, `next build` no longer prints that warning. Playwright measured hero font-size > 28px and body background `rgb(247, 244, 238)`.
- Save still requires founder keys. Placeholders no longer count as configured. Copy points to `supabase/SETUP.md`. Not claimed working.

## 2026-11-01 — Final delivery pass

- Vitest 11, Playwright 5, lint, tsc, build green. Production `dpl_2z7f5nRkmkCZc7sRwGXmA5m46bAS` serves styled HTML; save still blocked (no env vars).
- Porkbun list: `.site` / `.online` USD 1.96 first year. No purchase.
- `docs/DECISIONS.md` added as the Week 12 docs path (same log as root `DECISIONS.md`).

# PAUSA MX

**Antes de comprar, entiende lo que comprometes.**

Week 12 rebuild of the PAUSA MX venture (AI 2041). One core feature: **Mi Pausa** — a transparent comparison of a contemplated purchase against money already claimed by essentials and commitments.

Mexican Spanish UI. Deterministic TypeScript arithmetic. No bank login, no credit score, no buy/wait command.

## Status

- Charter, personas, and packet were committed **before** this repository’s application rebuild. See `docs/SOURCE_REVIEW.md`.
- METHOD, VERDICT, MANIFESTO, and the Week 12 team Blueprint were **not** in the workspace. Methodology is provisional.
- Saving private evaluations requires Supabase + Google OAuth. Until those keys exist, preview still works in the browser and does not persist amounts.
- Public Vercel URL (no purchased domain yet): https://pausa-mx-week12.vercel.app
- GitHub: https://github.com/miguelbbuilds-gif/pausa-mx-week12

## Stack

Next.js App Router, React, TypeScript strict, Tailwind CSS, Zod, Vitest, Playwright, Supabase PostgreSQL + Auth, Vercel.

## Local run

```bash
npm install
cp .env.example .env.local   # then paste real keys, or leave blank for preview-only
npm run dev
```

Open http://localhost:3000

```bash
npm run typecheck
npm run lint
npm test
npx playwright install chromium
npm run test:e2e
npm run build
```

## Supabase

Follow `supabase/SETUP.md` and run `supabase/migrations/20261101_evaluations.sql`. Never put the service-role key in this app.

## Routes

| Path | Purpose |
| --- | --- |
| `/` | Home |
| `/product` | Mi Pausa |
| `/about` | Need, users, business hypothesis |
| `/privacy` | Data use |

## Documentation

- `docs/CHARTER.md`
- `docs/PERSONAS.md` (synthetic, v0.1)
- `docs/PACKET.md`
- `DECISIONS.md`
- `docs/TEST_PLAN.md` / `docs/TEST_LOG.md`
- `docs/PERSONA_TEST.md` (script ready; external chat not yet run)
- `docs/DOMAIN_SETUP.md`
- `docs/BLUEPRINT_COMPLIANCE.md` (PENDING until the team Blueprint exists)

## Course evidence

See `submission/week12/`. Demo video and Cursor BUILDCHAT export are **not** fabricated here.

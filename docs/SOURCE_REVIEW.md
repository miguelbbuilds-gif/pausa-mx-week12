# Source review — Week 12 rebuild

Inspected on 2026-11-01 in this workspace before writing application code.

This Week 12 folder was empty: no application files, no git history, no prior charter.

## Artifacts found

| Artifact | Location | Status |
| --- | --- | --- |
| Week 10 PAUSA MX product | `C:\Users\migma\OneDrive\Documentos\pausa-mx-week10` | Read |
| Week 10 README | `pausa-mx-week10/README.md` | Read |
| Week 10 product packet | `pausa-mx-week10/PRODUCT_PACKET.md` | Read |
| Week 10 decisions | `pausa-mx-week10/docs/DECISIONS.md` | Read |
| Week 10 blueprint alignment (Week 10, marked provisional) | `pausa-mx-week10/BLUEPRINT_ALIGNMENT.md` | Read |
| Week 10 zip archive | `C:\Users\migma\OneDrive\Documentos\PAUSA_MX_WEEK10_SOURCE.zip` | Present |
| Week 11 recycling blueprint alignment | `C:\Users\migma\OneDrive\Documentos\mi-boleta-mx-week11\docs\BLUEPRINT_ALIGNMENT.md` | Located only; **not used** as Week 12 team Blueprint |

## Artifacts not found

The following Week 12 extraction documents were **not present** in this workspace, the Week 10 repository, or the Documents tree under names METHOD, VERDICT, MANIFESTO, or a Week 12 team BLUEPRINT:

- METHOD
- VERDICT
- MANIFESTO
- Week 12 team BLUEPRINT (including any Week 12 shadow clause)

This rebuild therefore uses the **provisional** methodology and engine sentence supplied in the Week 12 assignment. It does **not** claim that a team extraction session, vote, or manifesto already exists.

Week 10’s shadow clause (explainable and dismissible advice with four verbal outcomes such as `NO COMPRES POR AHORA`) is **not** reused as a Week 12 team decision. Week 12 Mi Pausa explains consequences and does not issue a buy/wait command.

## Review checklist (must be completed when the real files arrive)

- [ ] Read the actual METHOD and replace the provisional five steps if they differ.
- [ ] Confirm that Step 3 remains the selected engine, or change the engine mapping.
- [ ] Read the VERDICT and record which candidate was chosen and why.
- [ ] Read the MANIFESTO and fold any binding product language into CHARTER principles.
- [ ] Read the Week 12 team BLUEPRINT, extract conditions and shadow clause, and update `docs/BLUEPRINT_COMPLIANCE.md` from PENDING to VERIFIED.
- [ ] Re-run a charter review so CORE CONCEPTS still match the Blueprint.

## What Week 10 actually built (facts from those files)

- Vite + React prototype in Mexican Spanish.
- Local-only storage. No accounts, no Supabase.
- Deterministic surplus math plus a **suggestion** (`PODRÍAS COMPRAR`, `MEJOR ESPERA`, `NO COMPRES POR AHORA`, `INFORMACIÓN INSUFICIENTE`).
- Live URL recorded in Week 10 README: `https://pausa-mx-week10-tau.vercel.app` (checked 2026-10-18 according to that README). That is the Week 10 prototype, not this rebuild.

## What this Week 12 rebuild keeps vs changes

Keeps: Mexican Spanish, buyer-side pause, typed amounts, no bank connection, no credit score, explainable arithmetic.

Changes required by Week 12: documentation-first charter; a single core feature named **Mi Pausa**; comparison of “Comprar ahora” vs “Esperar” without telling the user what to do; Next.js App Router; Supabase Auth + RLS; Vitest + Playwright; two genuine Vercel deployments and a real purchased domain (purchase is not authorized in this session).

## Charter timing

No application code existed in this Week 12 repository at the time `docs/CHARTER.md` was created. The Week 10 prototype code exists in a **separate** repository and predates this charter. The charter predates this Week 12 rebuild, not the original Week 10 exploration.

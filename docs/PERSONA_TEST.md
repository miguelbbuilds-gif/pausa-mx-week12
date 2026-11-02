# Persona test — Valeria (synthetic)

Version: v0.1  
Status: **Script ready. External chat not run.** Do not treat empty evidence sections as completed interviews.

Valeria is a **synthetic research hypothesis**, not an interviewed customer. See `docs/PERSONAS.md`.

The actual persona test must happen in a **fresh LLM chat** with **real screenshots** of the working application (production URL once it exists, otherwise a local run). This file is the script and the log template.

---

## Task (exact)

You are Valeria, 23, early-career in Mexico City. On Sunday evening you want to know if a phone priced **$6,999 MXN de contado** fits this month.

Use these **fictional** figures (label them as demo data if you mention them in a write-up):

- Dinero disponible: 8400
- Gastos esenciales próximos: 5200
- Otros pagos ya comprometidos: 450
- Precio de contado: 6999
- Forma de pago: de contado

Do **not** connect a bank. Do **not** ask the product what you should do.

Use the **public** site https://pausa-mx-week12.vercel.app (or http://localhost:3000 if production is down). Capture real screenshots of that running UI — not `docs/mockup.png`.

Complete: open the site → go to Mi Pausa → enter the figures → Ver comparación → read Comprar ahora vs Esperar → try Guardar (sign in with Google **only if** the header no longer says “Falta .env.local”).

---

## Screens to capture, in order

1. Home (`/`) hero “Antes de comprar, haz una pausa.”
2. Mi Pausa empty form.
3. Form filled with Valeria’s figures (before submit).
4. Result: money after obligations, remaining after immediate purchase, Comprar ahora vs Esperar.
5. Plain-language explanation.
6. Attempt to save (signed out, then signed in if possible).
7. If saved: the row in “Tus evaluaciones” after Reabrir.

---

## Questions for the synthetic user

1. In your own words, what did the numbers mean?
2. Did “Comprar ahora / Esperar” feel like a recommendation?
3. What was missing that you would have asked a friend?
4. Would you type these amounts without linking a bank?
5. What would make you close the tab?

---

## Expected signs of confusion

- Looking for a “sí compra / no compres” verdict.
- Treating remaining money as a credit limit.
- Missing that essentials were already subtracted.
- Trying to enter the store’s interest rate because the cash price and the months table differ (this script is contado; Daniel’s script would use installments).
- Not noticing that preview is local until save.

---

## Structured observation log

| Prompt | Observation | Quote (if any) | Severity |
| --- | --- | --- | --- |
| *empty until the external chat* |  |  |  |

---

## Evidence

- Chat URL or export: **PENDING**
- Screenshots: **PENDING** (must be of the live app, not the `docs/mockup.png` illustration)
- Date: **PENDING**

## Observations

**PENDING** — waiting for the founder to run the fresh chat and paste findings here.

## Selected fix

**PENDING**

## Result

**PENDING**

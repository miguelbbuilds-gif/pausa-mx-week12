# Demo script — Miguel Bravo — PAUSA MX Week 12

Target length: 3 minutes + 30-second reflection. Record the **live** site, not localhost, once Vercel (and the purchased domain, if ready) is public.

Do not claim a domain, test, or save that did not happen.

## 1. Live domain (15s)

Open https://pausa-mx-week12.vercel.app in a private window. Say the address out loud.

If only `*.vercel.app` exists (true until you buy a domain): “This is the public Vercel deployment. The purchased domain is still a founder payment step.”

If `pausamx.site` (or the name you bought) loads with HTTPS: show the lock and the name.

## 2. User problem (20s)

On `/`: “Antes de comprar, haz una pausa.”

Say: people look at the price on the store screen, not at money already claimed by rent, food, and payments they already promised. PAUSA MX does not connect a bank and does not tell you to buy or wait.

## 3. Input (35s)

Go to Mi Pausa. Enter **fictional, labelled** figures — Valeria’s phone, contado:

- Disponible 8400
- Esenciales 5200
- Comprometidos 450
- Precio 6999
- De contado

State that these numbers are invented for the demo.

## 4. Method-driven calculation (25s)

Say the required engine sentence, then point at the arithmetic:

“Step 3 of my Method becomes the function that converts a proposed purchase, existing obligations and available money into a transparent comparison of the user’s financial position before and after buying.”

Point: 8400 − 5200 − 450 = 2750 after obligations; immediate cost 6999; remaining 2750 − 6999 = −4249. No invented interest.

## 5. Output (30s)

Show Comprar ahora vs Esperar, the explanation, and that remaining can be negative without a scolding. No “no compres.”

## 6. Saving and reopening (35s)

If Auth is live: Crear cuenta (correo y contraseña) → Guardar → Reabrir. **Not Google Sign-In.**

If it is not: show the on-screen message that save needs a session / Supabase, and say that is honest, not a localStorage fake.

## 7. Evidence of testing (20s)

Flash `docs/TEST_LOG.md`: the 1.005 cent rounding bug, Vitest pass after the fix, Playwright smoke if recorded.

## 8. Thirty-second reflection — what changed my mind

Suggested honest line (edit if your mind actually changed differently):

Week 10 told people what to do (`NO COMPRES POR AHORA`). Building the charter first made that copy illegal under our own principles. The product got smaller: one comparison, numbers the user typed, decision still theirs. What changed my mind was seeing that a “helpful” verdict is persuasion, not Step 3.

---

## After recording

Save as `submission/week12/DEMO_MiguelBravo.mp4` yourself. This repository does not contain a fabricated video.

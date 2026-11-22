# PACKET — PAUSA MX Week 15, Distribution

Founder: Miguel Bravo  
Role: TECHNOLOGIST  
Course: AI 2041 — Week 15 — Distribution: your method feeds your audience  
Venture: PAUSA MX  
Product UI language: Mexican Spanish  
Documentation language: English, except quoted product copy  

This packet was written **before** Week 15 application code. It does not claim that `/launch`, the content files, or the finished assets already exist. It does not record audience reactions, peer reviews, shares, or demand.

Production already online from Week 14: https://pausa-mx-week12.vercel.app  
GitHub: https://github.com/miguelbbuilds-gif/pausa-mx-week12  
Stack: Next.js, React, TypeScript, Tailwind, Supabase, Vercel  

Starting point recorded 2026-11-22: branch `week15-distribution` created from `week14-pricing` at `a162b4b`. Weeks 12–14 stay in the tree. No table is dropped. No evaluation row is deleted.

---

## 1. First audience

Adult in Mexico who is about to make a discretionary purchase large enough to change the money they can still use.

This is a role, not an interviewed person. No name, quote, or session is attached.

**User vs payer.** The user is that adult, at the moment of the purchase. The payer is not established. Week 14 left PAUSA Free at MXN 0 and labeled MXN 39 and MXN 79 as experimental. Week 15 does not add a new price and does not treat the reader of a public page as a customer.

## 2. Moment

Immediately before paying, financing, or waiting. Not a course evening. Not a monthly budget review. Not after the purchase, to judge it.

## 3. Current workaround

Calculator, mental arithmetic, Notes, Excel, a budget, or a banking app. This list is the founder’s description of substitutes. It is not a count of people who use them. Status of the description: ASSUMPTION.

## 4. Promise

“Antes de comprar, compara qué cambia en tu dinero disponible con los datos que ingreses.”

The promise is the product’s job. It is not a measured saving, a conversion rate, or a change in behavior.

## 5. Positioning and exclusions

PAUSA MX is a pre-purchase comparison tool.

It is not positioned as:

- a financial course
- a bank
- an advisor
- a debt app
- a recommender

CTA: “Prueba una compra en PAUSA MX.” On the launch page the short CTA is “Prueba una compra”.

## 6. Blueprint

Official claim: “Antes de comprar, compara qué cambia en tu dinero disponible con los datos que ingreses.”

Miguel’s commitments:

- Verify a complete scenario in the accessible release.
- Check whole-task input burden.
- Check interpretation.

Dissent, kept visible: “A visible trade-off may read as permission to buy.”

Shadow clause: “Do not turn incomplete inputs or polished content into false assurance that a purchase is affordable.”

Therefore the release must:

- never treat incomplete inputs as affordability
- show coverage limits
- say that PAUSA MX only knows the data that was entered
- not say “sí te alcanza”
- not say “compra” or “no compres” as a verdict
- not turn polished content into financial authority
- review wording, coverage labels, and visual cues

## 7. Brand voice

Clear, direct, Mexican without clichés, calm. Not moralizing, not alarmist, not a financial guru.

Do not use:

- “Sí te alcanza.”
- “Compra inteligentemente.”
- “Esta compra es mala.”
- “Estás desperdiciando tu dinero.”

## 8. Visual system

The existing product uses Fraunces for display, Source Sans 3 for text, paper background `#f7f4ee`, navy `#122033`, teal `#0f766e`, card `#fffcf7`, line `#d9d2c5`, warning `#8a5a12` on `#f8ecd4`.

Week 15 keeps that system. Teal is for the product name and the action that opens the comparison. It is not a trophy for “Comprar ahora”. Both scenarios stay visually level so the trade-off is not a cue to buy. Finished assets carry the wordmark, a DEMO DATA label, the CTA, and the coverage warning. Full rules go in `docs/WEEK15_BRAND_SYSTEM.md` with the content commit. This packet does not pretend that file already exists.

## 9. Creative process

```text
RESEARCH → WRITING → VISUAL PRODUCTION → CLAIM CHECK → STYLE REVIEW → REVISION → HUMAN APPROVAL → PUBLISH/TEST
```

Human approval is required before treating a piece as published to an audience. AI may draft research, copy, visuals, claim lists, style checks, and templates. AI cannot demonstrate trust, resonance, conversion, behavior change, or demand.

Each stage’s input, output, and quality check will be written in `docs/WEEK15_CONTENT_PROCESS.md`. Until a person approves a piece, its status stays short of published evidence.

## 10. Three content series

Demo numbers below are invented illustrations for content. They are not user data, not a case study, and not a result.

Shared demo scene, labeled DEMO in every asset:

| Field | DEMO value |
| --- | --- |
| Dinero disponible | $18,000 |
| Gastos esenciales próximos | $9,000 |
| Otros pagos ya comprometidos | $2,500 |
| Precio de contado del celular | $12,000 |
| Dinero después de esas obligaciones | $6,500 |
| Si se paga de contado, dinero que quedaría hoy | −$5,500 |
| Si se espera, dinero que quedaría hoy | $6,500 |
| Plan escrito aparte | Enganche $2,000, 12 pagos de $1,100 |
| Total escrito de ese plan | $15,200 |
| Diferencia frente al precio de contado | $3,200 |

Arithmetic check, from the Week 12 engine rules already in this repository: 18000 − 9000 − 2500 = 6500; 6500 − 12000 = −5500; 2000 + (12 × 1100) = 15200; 15200 − 12000 = 3200. Status of these figures: DEMO.

### Series 1 — Antes de comprar

Everyday purchases, with demo data, at the moment before paying. The series shows the pause. It does not rank the purchase.

### Series 2 — Lo que realmente comprometes

How the cash price and a written payment plan change available money. The monthly amount is not the whole commitment.

### Series 3 — Comprar ahora vs esperar

The same inputs, two scenarios. Neither scenario is the winner. Waiting is not “the smart choice”. Buying now is not permission.

## 11. Six concepts

A concept is a plan. It is not a finished asset.

| ID | Series | Title | Hook | Format | Claim class | Status in this packet |
| --- | --- | --- | --- | --- | --- | --- |
| C1 | Antes de comprar | El celular de $12,000 | Antes de pagar un celular, mira el dinero que queda con estos datos de demostración. | Carousel plan | DEMO | Concept only |
| C2 | Antes de comprar | Los audífonos de $1,800 | Un precio chico también mueve el dinero disponible. | Single caption plan | DEMO | Concept only |
| C3 | Lo que comprometes | El mensual no es el compromiso | $1,100 doce veces no es lo mismo que ver solo $1,100. | Card plan | DEMO | Concept only |
| C4 | Lo que comprometes | Enganche y lo que sigue | El enganche es el costo de hoy. Los pagos escritos siguen después. | Short note plan | DEMO | Concept only |
| C5 | Comprar ahora vs esperar | Las dos columnas | Mismos datos. Comprar ahora y esperar, sin ganador. | Storyboard plan | DEMO | Concept only |
| C6 | Comprar ahora vs esperar | Esperar no es el premio | Esperar muestra el dinero que esta compra no usa hoy. No es un consejo. | Caption plan | DEMO | Concept only |

Shared fields for every concept:

- Audience: the first audience above.
- Moment: immediately before paying, financing, or waiting.
- Demo scenario: the table in section 10. C2 uses the same obligations and a DEMO cash price of $1,800, so money after obligations stays $6,500 and money left today after that price is $4,700. That second figure is also DEMO.
- CTA: “Prueba una compra”.
- Evidence needed before any audience claim: a real person interpreting the piece, recorded without invention.
- Risk: a tidy layout can look like permission to buy, or like proof the purchase is affordable. The coverage lines block that reading.
- Status: concept. Not a finished file at the time of this packet.

## 12. Three finished assets to produce after this packet

These are specifications. They are not files yet.

| Asset | Format | Title | Demo |
| --- | --- | --- | --- |
| Asset 1 | Carousel, square frames | Antes de comprar un celular de $12,000… | Cash phone scene |
| Asset 2 | Vertical storyboard, not a filmed video | Comprar ahora vs esperar | Same inputs, two scenarios, no winner |
| Asset 3 | Shareable visual card | Lo que realmente comprometes | Written plan $15,200 against the $12,000 cash price |

Minimum two formats: carousel and vertical storyboard already differ; the card is a third. Destination after production: `public/week15/`. Each file must show PAUSA MX, a demo-data label, the CTA, and the coverage warning. No testimonial, no savings claim, no engagement number.

Required sentences on the launch surface and on the assets:

- “PAUSA MX calcula únicamente con los datos que ingresas.”
- “No verifica que hayas incluido todas tus obligaciones.”
- “El resultado no determina si una compra es asequible para ti.”

## 13. Two audience tests

Not run. Do not fill quotes.

For each test, when a person actually sees an asset, record: asset, participant role, date, first interpretation, who it is for, what PAUSA MX does, what they would do next, confusion, exact quote, founder response, evidence.

Until then: PENDING HUMAN EVIDENCE. A real outreach with zero replies may be logged as zero response. Silence is not a quote.

## 14. Architecture

| Layer | Week 15 choice |
| --- | --- |
| Launch | Public route `/launch`. No login. |
| Content model | Typed series, concepts, and asset records in the app, so counts can be tested. |
| Files | SVG assets in `public/week15/`. SVG keeps the Spanish sentences exact. |
| Analytics | Existing `product_events` allowlist extended. No new table of people. |
| Auth and RLS | Unchanged. Launch does not read evaluations. |
| Preview math | Still in the browser. Distribution events do not carry amounts. |

## 15. Test plan

Run TypeScript, ESLint, Vitest, Playwright, and `next build`.

Cover `/`, `/launch`, `/product`, `/pricing`, `/about`, the CTA, a phone viewport, accessible names, the coverage warnings, 3 series, 6 concepts, 3 assets, at least 2 formats, the new event names, and the existing secret scan.

Complete scenario already in the public product, counted from `MiPausaForm` before Week 15 code:

- Paso 1: three amounts (disponible, esenciales, comprometidos).
- Paso 2: cash price, and the payment choice. Contado is the initial choice.
- Paso 3: “Ver comparación”, then read both columns and the explanation.
- Cash path therefore asks for 4 numbers plus a choice that already has a default, then one button.
- Installments add enganche, count, and each payment. The form refuses to invent those.
- Interpretation today: two columns and a sentence that the comparison is not a recommendation. The installment path adds a future-income limit. The cash path currently leaves `futureAffordabilityWarning` null. That gap is recorded here as something to verify, not as a bug this packet has already fixed.
- Structural drop-off points, not measured rates: unclear “disponible”, omitted obligations with no checklist, the extra installment fields, account creation if the person wants to save, and reading two columns without a winner.

No abandonment percentage will be invented.

## 16. Security

- No secrets in the launch page or the assets.
- Auth and RLS stay as in Weeks 12–14.
- Zod and the event allowlist stay the input boundary.
- Demo numbers are labeled and are not a person’s data.
- Events may store only an allowlisted name, an allowlisted detail, and an anonymous session id.
- Events must not store a name, email, financial amount, token, or password.
- Week 15 does not require a purchased domain. The public Vercel URL is acceptable.

## 17. Scope cut

Out of Week 15:

- A new price, checkout, or paywall
- Bank linking
- A course, a debt plan, or a recommendation
- Invented testimonials, savings, engagement, or demand
- A filmed MP4 if this environment cannot record one
- A purchased domain
- Deleting Weeks 12–14 or resetting Supabase

## 18. Long view

If the pause is useful, distribution is the page and the pieces that bring someone to try one purchase with their own numbers. Content can explain the comparison. It cannot prove that anyone trusted it, changed a purchase, or would pay. Those sentences wait for a person.

## 19. Claim register for this packet

| Statement | Class |
| --- | --- |
| The comparison uses only entered numbers. | VERIFIED in the existing engine. Week 15 content must not exceed it. |
| The first audience will use the launch page. | UNKNOWN |
| The workaround list matches what people do. | ASSUMPTION |
| Demo pesos in section 10. | DEMO |
| YNAB, NerdWallet, and CONDUSEF page observations in `docs/WEEK15_BENCHMARKS.md`. | To be written from pages fetched on 2026-11-22. Their savings and review figures stay their claims, not PAUSA results. |
| Trust, resonance, conversion, behavior change, demand. | Not claimed. |

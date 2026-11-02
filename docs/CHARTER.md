# PAUSA MX — Product charter

Version: v0.1  
Date: 2026-11-01  
Founder: Miguel Bravo  
Course: AI 2041 — Week 12  
Status: Charter for the Week 12 rebuild. Written before this repository’s application code.

**Charter timing:** this document predates the Week 12 application rebuild in `pausa-mx-week12`. It does **not** predate the separate Week 10 prototype in `pausa-mx-week10`.

**Source caveat:** METHOD, VERDICT, MANIFESTO, and the Week 12 team BLUEPRINT were not available in the workspace. Methodology below is **provisional**. See `docs/SOURCE_REVIEW.md`.

## VISION

In three years, PAUSA MX is the calm place a young adult in Mexico opens before a purchase that would change this month’s cash: a phone, a computer, a pair of shoes bought in installments. The person types what they already know — money on hand, essentials still to pay, commitments already made, and the price in front of them — and in under a minute they see a transparent comparison of their position if they buy now versus if they wait. The product never pretends to approve credit, connect a bank, or know a future that the person did not enter. It exists so the decision stays theirs, with the arithmetic in the open.

## USERS

Initial customer segment: young adults in Mexico (roughly 20–30) who are considering a consumer purchase and want to understand its effect on **available money**, not only the price shown on a screen.

Job to be done: *When I am about to buy something with money I also need for rent, food, transport or payments I already promised, help me see — in one sitting, without a bank login — what I would still have today and what future payments the purchase would create, so I can decide without being pushed.*

## METHOD (provisional)

Until the actual Week 12 extraction is filed, the founder’s extracted methodology is:

1. Explore what can be built using AI.
2. Find a concrete decision or task.
3. Make relevant information and constraints visible.
4. Produce a verifiable action or explanation.
5. Test the result and revise.

The selected engine is **Step 3**.

Step 3 of my Method becomes the function that converts a proposed purchase, existing obligations and available money into a transparent comparison of the user’s financial position before and after buying.

That function is deterministic TypeScript business logic. It is not an opaque AI calculation.

## PRINCIPLES

1. **Transparency over persuasion.** Show the inputs, the arithmetic, and the unknowns. Do not optimize for conversion.
2. **Human decision remains final.** Explain consequences. Never issue a buy/wait command, never disable “I still choose,” never rank the person.
3. **No hidden financial assumptions.** Do not invent interest rates, installment conditions, income, or debts the user did not enter.
4. **Privacy by default.** Private evaluations are stored only for an authenticated user, isolated by Row Level Security. Preview calculations do not transmit amounts to the server.
5. **Accessibility on low-end mobile devices.** Large controls, readable type, MXN formatting, no essential hover-only actions, modest client JavaScript.
6. **Respect, not shame.** Copy stays factual. No “irresponsible,” no scores, no streaks that punish waiting or buying.
7. **One core feature in Week 12.** Mi Pausa is the product. Adjacent ideas wait.

## NON-GOALS

This rebuild explicitly rejects:

- Credit approvals or creditworthiness language.
- Bank-account integrations, open banking, or credential collection.
- Investment recommendations.
- Selling personal financial data.
- Financial risk scoring, behavioral ranking, or hidden happiness scores.
- Gamification that pressures purchases (streaks, badges for buying, countdown urgency).
- A chatbot as the core feature.
- Features beyond **Mi Pausa** in Week 12 (calendars of all debts, merchant catalogs, checkout, clothing-category engines, 30-day regret questionnaires).

## NORTH STAR

**Name:** Percentage of users who successfully complete and save an understandable purchase comparison.

**Definition:** A completed comparison is one in which the engine produced a mathematically consistent result, the comparison of “Comprar ahora” versus “Esperar” was shown, and the authenticated user saved the evaluation.

- **Numerator:** count of distinct authenticated users who, in the measurement window, saved at least one evaluation whose stored snapshot includes remaining money after the immediate purchase, future payments created (or an explicit zero), and the before/after comparison fields.
- **Denominator:** count of distinct authenticated users who opened `/product` in the same window.
- **Measurement (planned, not implemented as analytics in Week 12):** server-side counts from `evaluations` rows plus authenticated page views. Week 12 does **not** ship a tracking pixel. Until measurement is implemented, this north star is a definition only. No conversion rate is claimed.

## CORE CONCEPTS

Every feature in this rebuild must map to these nouns:

1. **User** — a person identified by Supabase Auth (email and password). Unauthenticated visitors may preview a calculation locally; they are not a stored User until they sign in. **This is not Google Sign-In** and does not literally satisfy a Google OAuth course requirement.
2. **Evaluation** — one saved or in-progress application of Mi Pausa: inputs, engine outputs, explanation, and timestamps, owned by a User.
3. **Purchase** — the contemplated item described only by a cash price and an optional payment plan the User typed. Not a catalog product.
4. **Available Money** — the amount the User says they can draw on for the period they are considering (typically cash on hand / money available this month), in MXN.
5. **Obligation** — money already claimed before the new Purchase: essential upcoming expenses plus other already committed payments, as entered by the User.
6. **Payment Plan** — either full payment, or installments described solely by down payment, number of installments, and payment amount the User entered. The engine never fills missing rates.
7. **Comparison** — the side-by-side view of financial position if the User buys now versus if they wait, plus the plain-language explanation and any warning about future affordability.

## Default product safeguard

Never manipulate or punish users based on their purchase decisions.

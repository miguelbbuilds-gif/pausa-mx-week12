# Test log — PAUSA MX Week 15

Run locally on 2026-11-22 after `b791b43`.

| Check | Result |
| --- | --- |
| `npm run typecheck` | Passed. `tsc --noEmit` exited 0. |
| `npm run lint` | Passed. ESLint reported no problems. |
| `npm test` | Passed. Vitest 3.2.7, 10 files, 38 tests. |
| `npm run test:e2e` | Passed on the retry. Playwright ran 24 tests. The first attempt in a fresh process stops on the Next.js security reminder; the retry continued and exited 0. |
| `npm run build` | Passed on the retry. Next.js 16.4.3 compiled and listed `/launch`. Exit 0. |

Playwright files that passed in the full run: `smoke.spec.ts`, `auth-save.spec.ts`, `week13.spec.ts`, `week14.spec.ts`, `week15.spec.ts`.

## Complete scenario, counted

Cash path in the public product, not a person:

- Paso 1: dinero disponible, gastos esenciales próximos, otros pagos ya comprometidos.
- Paso 2: precio de contado, and the payment choice. Two radios. Contado starts selected.
- Paso 3: “Ver comparación”.
- Controls before the result: 4 textboxes, 2 radios, 1 submit button.
- Demo figures used in the Week 15 test: 18000, 9000, 2500, 12000.
- Interpretation on screen: Comprar ahora shows −$5,500.00, Esperar is the other column, the text says it is not a recommendation, and the result states that it does not determine affordability.
- Structural places someone could leave, not measured rates: the meaning of “disponible”, obligations that were never typed, the extra installment fields when that path is chosen, creating an account in order to save, and reading two columns that do not pick a winner.

No drop-off percentage is stated because none was measured.

## Bug that was reproduced

Before `b791b43`, `evaluatePurchase` set `futureAffordabilityWarning` to null whenever the payment method was full. The unit test expected null. `ComparisonPanel` rendered the limit box only when that field was set, so a cash remainder could appear without the coverage lines. The home page and the default metadata also said “en menos de un minuto” without a timing study.

Expected: a finished cash scenario still says the result does not determine affordability, and the public line does not claim an unmeasured duration.

Root cause: the warning was gated on installments, and the duration line was copy without a measurement.

Fix and retest: `b791b43`. The unit test now requires the coverage sentence. Playwright found that sentence inside the comparison and found no “te alcanzar”.

## Not tested with a person

Audience tests: 0. Team teardown replies: 0. Recorded demo: none. Those stay pending.

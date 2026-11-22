# Blueprint compliance — PAUSA MX Week 15

Checked 2026-11-22 on `week15-distribution`. A passing test is not a person’s interpretation.

| Requirement | Implementation | Evidence | Status |
| --- | --- | --- | --- |
| Bounded comparison | Mi Pausa still subtracts only the amounts entered. Launch copy says the same. | `src/engine/evaluatePurchase.ts`. Vitest full-payment case. | COMPLETE as arithmetic. Not a financial verdict. |
| Complete scenario in the accessible release | Cash path: disponible 18000, esenciales 9000, comprometidos 2500, precio 12000. Result shows −$5,500.00 today if buying now and $6,500.00 if waiting. | Playwright `a complete cash scenario exposes its inputs and both interpretations` passed. | COMPLETE as a mechanical run. No human sat with it. |
| Whole-task input burden | Cash path shows Paso 1, Paso 2, and Paso 3. Four text fields and two payment radios. Contado is the initial choice. One button, “Ver comparación”, produces the result. | Same Playwright test counted the controls. | COMPLETE as a count. No abandonment rate was measured. |
| Interpretation | Both columns stay on screen. The sentence says it is not a recommendation. The coverage lines sit inside the comparison. | Playwright read those lines in `[aria-live=polite]`. | COMPLETE for the interface. A person’s reading is PENDING HUMAN EVIDENCE. |
| Coverage disclosure | The three limit sentences are on `/launch`, on `/product`, in the result, and in each finished asset. | Playwright on `/launch` and on the comparison. Vitest reads the SVG files. | COMPLETE |
| Omitted obligations | “No verifica que hayas incluido todas tus obligaciones.” | Same surfaces. | COMPLETE as a disclosure. The product still cannot know what was left out. |
| No affordability implication | `futureAffordabilityEstablished` stays false. A cash result no longer returns a null warning. | `evaluatePurchase.test.ts` after `b791b43`. | COMPLETE in code |
| Shadow clause | Incomplete calculation says no number was invented and shows the same limits. Polished assets are labeled demo data. | `ComparisonPanel` error state. Asset files. | COMPLETE as implementation |
| Visible trade-off is not permission to buy | Comprar ahora and Esperar use the same border. Copy says neither scenario decides. | `ComparisonPanel.tsx`. Launch example uses `border-line` on both cards. | COMPLETE as interface. The dissent can still be true for a reader. That reading was not tested. |

Audience tests and the team teardown are not rows in this table. They are PENDING HUMAN EVIDENCE in their own files.

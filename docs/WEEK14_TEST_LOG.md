# Test log — PAUSA MX Week 14

2026-11-15 local / 2026-11-16 UTC. Only runs from this pass.

- `npx tsc --noEmit`: pass, after fixing a type error in the new simulator form. That error was caught before the page was committed as a finished check; it was not a production bug.
- `npx eslint src tests --max-warnings 0`: pass.
- `npm test`: **34 passed** (9 files), including six pricing cases: zero users, 100 percent conversion, decimals, negatives, huge values, and negative contribution.
- `npm run build`: pass. Route `/pricing` is present.
- Playwright, after installing Chromium for this environment: first full run **17 passed, 1 failed**. The failure was the test locator `getByText('MXN 39')`, which matched five places. The price itself was on the page. The locator was made exact. Retest of `tests/week14.spec.ts`: **6 passed** (35.2s).
- That retest included two accounts. The second account did not see the scenario name saved by the first.
- `pricing_scenarios` has RLS. The migration does not delete `evaluations`. After it, that table had 12 rows. Those rows were not removed.
- No reproducible bug found during this pass.

## Bug found on the first production deploy

Reproduction: open https://pausa-mx-week12.vercel.app/pricing after `dpl_45tCxjhc3bwdFJhNygzUjWLHhHFH` and read the footer.

Expected: the footer names the weeks that are actually in the product, including Week 14.

Observed: “Semanas 12 y 13”.

Cause: `src/components/SiteFooter.tsx` was not updated when Week 14 shipped.

Fix: the footer now says “Semanas 12, 13 y 14”.

Retest: the source contains that sentence. The production HTML changes only after the next deploy.

No other reproducible product bug found during this pass. The first Playwright failure was a locator that matched MXN 39 in five places; the price was visible.

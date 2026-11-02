# Mechanical test plan — PAUSA MX Week 12

## Unit (Vitest, `src/engine`)

| # | Case | Expected |
| --- | --- | --- |
| 1 | Valid full-payment purchase | Remaining = available − essentials − committed − price. Wait remaining = money after obligations. |
| 2 | Purchase exceeding available money | Result still `ok`; remaining may be negative. No buy command. |
| 3 | Zero available money | Remaining = −immediate cost when other fields are zero. |
| 4 | Valid installment plan | Immediate cost = down payment; future total = n × amount; difference vs cash from entered figures only. Warning that future affordability is not established. |
| 5 | Invalid installment data | `ok: false` when n < 2 or required installment fields missing. |
| 6 | Negative amounts | Rejected. |
| 7 | Extremely large values | Rejected above $10,000,000.00 MXN. |
| 8 | Decimal rounding | Cent-accurate half-up; `1.005` → 101 cents. |
| 9 | Empty required fields | Zod `safeParse` fails; zeros are not invented. |

## Browser (Playwright)

| # | Case | Expected |
| --- | --- | --- |
| 10 | Unauthenticated save | After a valid preview, Guardar does not show “Evaluación guardada”. |
| 11 | Authenticated save and reopen | Email/password account against live Supabase. Playwright `tests/auth-save.spec.ts`. |
| 12 | RLS isolation of two users | SQL procedure in `supabase/rls_isolation.sql`. Record an actual run in TEST_LOG when two accounts exist. |
| 13 | Tailwind applied | Body background `#f7f4ee`; hero font-size > 28px. |
| 14 | Phone viewport 390×844 | Home heading and Mi Pausa fields remain visible. |

## Security

- `.env.local` untracked
- No service-role key in the repo
- `rg` for leaked secrets before push

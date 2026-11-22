# Brand system — PAUSA MX Week 15

Voice: clear, direct, Mexican without clichés, calm. Not moralizing, not alarmist, not a financial guru.

Do not use:

- “Sí te alcanza.”
- “Compra inteligentemente.”
- “Esta compra es mala.”
- “Estás desperdiciando tu dinero.”
- “Compra” or “no compres” as a verdict. “Comprar ahora” and “Esperar” are scenario names. “Prueba una compra” is the invitation to open the tool.

## Typography

- Product UI: Fraunces for display, Source Sans 3 for text, loaded in `src/app/layout.tsx`.
- Static SVG assets: Georgia for display and Segoe UI or Arial for text, because those files cannot rely on the web font loader. The hierarchy stays the same: a short title, then the figures, then the limit.

## Color

| Token | Hex | Use |
| --- | --- | --- |
| background | `#f7f4ee` | Page and asset ground |
| navy | `#122033` | Titles and figures |
| muted | `#5b6776` | Support |
| teal | `#0f766e` | Wordmark and the CTA button |
| card | `#fffcf7` | Scenario cards |
| line | `#d9d2c5` | Borders |
| warning | `#8a5a12` on `#f8ecd4` | Demo label and coverage |

Teal does not mark a winning scenario. On `/launch`, Comprar ahora and Esperar use the same line border.

## Spacing

- Page content sits in `max-w-5xl` with `px-4`.
- Cards use `rounded-2xl` and `p-5`.
- Sections stack with `mt-12` or `mt-14`.
- The CTA is at least 56px tall (`h-14`) so it can be used on a phone.

## Cards and screenshots

- A scenario card names the scenario and the demo figure. It does not add a badge, a score, or a checkmark.
- Screenshots of the product, if a person takes them later, must not be cropped in a way that hides the coverage lines.
- The generated SVGs are illustrations of demo data. They are not screenshots of a user’s session.

## CTA

Label: “Prueba una compra”. It links to `/product`. It does not say the purchase will fit.

## Visual rules

- Every finished asset shows PAUSA MX, “Datos de demostración”, the CTA, and the three coverage lines.
- A negative remainder is shown as arithmetic. It is not labeled as a bad purchase.
- A positive remainder is shown as arithmetic. It is not labeled as affordable.
- No stock photo of a person is used as proof of a customer.
- No star rating, review count, or “people saved” line.

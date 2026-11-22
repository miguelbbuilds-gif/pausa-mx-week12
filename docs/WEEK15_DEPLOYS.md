# Deploys — PAUSA MX Week 15

Production alias: https://pausa-mx-week12.vercel.app

| # | When | Deployment ID | URL | Git state | Check |
| --- | --- | --- | --- | --- | --- |
| 1 | 2026-11-22 23:40:33 UTC | `dpl_Bs6jswtA9MrdAMuXy1qxdSy46W5G` | https://pausa-mx-week12-oek05txcu-miguel-d52d.vercel.app aliased to https://pausa-mx-week12.vercel.app | `fa25be2` | CLI READY. Public HTTP 200 on `/`, `/launch`, `/product`, `/pricing`, and `/about`. `/launch` and `/product` contain “calcula únicamente”. |
| 2 | 2026-11-22 23:42:16 UTC | `dpl_CcHfFUCViKyvfcFVhDZBuJAHFjMH` | https://pausa-mx-week12-pl233hvo1-miguel-d52d.vercel.app aliased to https://pausa-mx-week12.vercel.app | `df285f8` | CLI READY. Public HTTP 200 on `/launch`. HTML contains “Tres series”, “Seis conceptos”, and “Lo que realmente comprometes”. Home footer contains “Semanas 12, 13, 14 y 15”. |
| 3 | 2026-11-22 23:46:37 UTC | `dpl_3Jur9LJQBDKv7zQ4eWznvGUisW26` | https://pausa-mx-week12-3iib5e1qo-miguel-d52d.vercel.app aliased to https://pausa-mx-week12.vercel.app | `49d7399` | CLI READY after the merge to `main`. Public HTTP 200 on `/`, `/launch`, `/product`, `/pricing`, and `/about`. |

Inspector 1: https://vercel.com/miguel-d52d/pausa-mx-week12/Bs6jswtA9MrdAMuXy1qxdSy46W5G

Inspector 2: https://vercel.com/miguel-d52d/pausa-mx-week12/CcHfFUCViKyvfcFVhDZBuJAHFjMH

Inspector 3: https://vercel.com/miguel-d52d/pausa-mx-week12/3Jur9LJQBDKv7zQ4eWznvGUisW26

Deploy 3 is the current production alias. The commit that records this third row comes after the upload.

The Week 15 event allowlist was applied on the hosted database `pausa-mx-week12` the same day. The statement did not drop tables. A follow-up read found `launch_viewed` allowed and the existing evaluation rows still present. That count is not demand.

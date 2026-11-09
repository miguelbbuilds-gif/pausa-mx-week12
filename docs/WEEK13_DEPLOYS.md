# Deploys — PAUSA MX Week 13

Production alias: https://pausa-mx-week12.vercel.app  
Project: `miguel-d52d/pausa-mx-week12`

Only rows confirmed with the Vercel CLI are listed. Local `next dev` is not a deploy.

| # | When (UTC) | Deployment ID | URL | Git SHA | Check |
| --- | --- | --- | --- | --- | --- |
| 1 | 2026-11-09 02:57 | `dpl_6n9mK5bGGWj3Y3gUeZb87Eccikut` | https://pausa-mx-week12.vercel.app | `3a5a553e981e8a94834d36d71d07df984d8849ca` | HTTP 200 on `/` and `/investigacion` |
| 2 | 2026-11-09 03:00 | `dpl_AJU8wDbPwNvqZfqwvp1HqRFPrSJq` | https://pausa-mx-week12-8cgoqsiag-miguel-d52d.vercel.app aliased to the production URL | `fb2f15b907887c8053875ed3f10512db8060da51` | CLI READY. `/product` later HTTP 200 |
| 3 | 2026-11-09 03:41 | `dpl_ChxSeFAPju93neaLgXJNxVGi2SyN` | https://pausa-mx-week12-lzoanwe08-miguel-d52d.vercel.app aliased to https://pausa-mx-week12.vercel.app | `0b71548` local HEAD at upload | CLI READY. HTTP 200 on `/`, `/product`, `/auth` and `/investigacion`. `/auth` HTML contains «Continuar con Google». |

Inspector 1: https://vercel.com/miguel-d52d/pausa-mx-week12/6n9mK5bGGWj3Y3gUeZb87Eccikut  
Inspector 2: https://vercel.com/miguel-d52d/pausa-mx-week12/AJU8wDbPwNvqZfqwvp1HqRFPrSJq

Inspector 3: https://vercel.com/miguel-d52d/pausa-mx-week12/ChxSeFAPju93neaLgXJNxVGi2SyN

The CLI upload did not print a GitHub SHA. The committed HEAD in the working tree at deploy time was `0b71548`. Uncommitted Week 12 submission files were not part of the app build.

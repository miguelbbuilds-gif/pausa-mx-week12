# Deployment log — PAUSA MX Week 13

Only deployments confirmed by the Vercel CLI belong here. Local `next dev` does not.

Production alias: https://pausa-mx-week12.vercel.app  
Project: `miguel-d52d/pausa-mx-week12`

| # | When (UTC) | Identifier | URL | Commit uploaded | HTTP check |
| --- | --- | --- | --- | --- | --- |
| 1 | 2026-11-09 02:57 | `dpl_6n9mK5bGGWj3Y3gUeZb87Eccikut` | https://pausa-mx-week12-5hwnqynco-miguel-d52d.vercel.app aliased to https://pausa-mx-week12.vercel.app | `3a5a553e981e8a94834d36d71d07df984d8849ca` | `HTTP/1.1 200` on `/` and `/investigacion`. HTML includes the mobile menu button, “Dinero disponible después de obligaciones”, and the closed research panel. Inspector: https://vercel.com/miguel-d52d/pausa-mx-week12/6n9mK5bGGWj3Y3gUeZb87Eccikut |
| 2 | 2026-11-09 03:00 | `dpl_AJU8wDbPwNvqZfqwvp1HqRFPrSJq` | https://pausa-mx-week12-8cgoqsiag-miguel-d52d.vercel.app aliased to https://pausa-mx-week12.vercel.app | `fb2f15b907887c8053875ed3f10512db8060da51` | CLI `readyState: READY`. Alias `/product` later returned `HTTP/1.1 200`. Inspector: https://vercel.com/miguel-d52d/pausa-mx-week12/AJU8wDbPwNvqZfqwvp1HqRFPrSJq |

CLI reported `deploymentProtection: vercel_authentication`. An unauthenticated request still received the app HTML and `200 OK`.

The commit that adds this second row is newer than `fb2f15b`. The aliased production deployment is deploy 2, built from `fb2f15b`, until a later deploy says otherwise.

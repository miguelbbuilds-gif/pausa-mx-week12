# Deployment log — PAUSA MX Week 12

Only real deployments belong here. Preview URLs from `next dev` are not production.

## GitHub

- URL: https://github.com/miguelbbuilds-gif/pausa-mx-week12
- Pushed `main` from this machine on 2026-11-01 (local) / 2026-11-02 UTC.

## Vercel

Project: `miguel-d52d/pausa-mx-week12`  
Production alias: https://pausa-mx-week12.vercel.app

| # | When (UTC) | Identifier | URL | Notes |
| --- | --- | --- | --- | --- |
| 1 | 2026-11-02 03:41 | `dpl_AMuSE6oWiWPg85Eco75J7QmpdcWo` | https://pausa-mx-week12-qhofpr48e-miguel-d52d.vercel.app aliased to https://pausa-mx-week12.vercel.app | `npx vercel --yes --prod`. Inspector: https://vercel.com/miguel-d52d/pausa-mx-week12/AMuSE6oWiWPg85Eco75J7QmpdcWo |
| 2 | 2026-11-02 03:42 | `dpl_Bxs8aaZPSBTqEQB2JXH1W3emmMXk` | https://pausa-mx-week12-j4n2v7st1-miguel-d52d.vercel.app aliased to https://pausa-mx-week12.vercel.app | GitHub push of the first-deploy log. Inspect: `npx vercel inspect pausa-mx-week12-j4n2v7st1-miguel-d52d.vercel.app`. Alias still HTTP 200. |

CLI reported `deploymentProtection: vercel_authentication`. An unauthenticated `curl -I https://pausa-mx-week12.vercel.app` still returned **HTTP/1.1 200 OK** with HTML title “PAUSA MX — Antes de comprar, entiende lo que comprometes”. `/product` HTML includes “Mi Pausa” and the local-preview notice. That is the public check for deployment 1.

## Domain

See `docs/DOMAIN_SETUP.md`. Purchase is a founder step. Production today is the vercel.app URL only.

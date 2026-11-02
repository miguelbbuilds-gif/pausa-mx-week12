# Domain setup — PAUSA MX

The agent is **not** authorized to purchase a domain or a paid subscription.

## Candidate names checked 2026-11-01

| Name | Check | Result |
| --- | --- | --- |
| pausamx.site | Identity Digital RDAP `GET https://rdap.identitydigital.services/rdap/domain/pausamx.site` | HTTP **404** Object not found — not in that registry snapshot. **Not** a paid confirmation. |
| pausamx.online | Same RDAP host | HTTP **404** Object not found. **Not** a paid confirmation. |
| pausamx.xyz | `rdap.nic.xyz` | DNS lookup **failed** in this session. **Unknown.** Do not claim it is free. |
| pausa.mx | NIC México | Not queried successfully here. `.mx` is often a worse first purchase for a course week. |

**Recommended first purchase for the founder:** `pausamx.site` on the venture Gmail, at a registrar (Porkbun, Namecheap, or Google Domains successor / Squarespace). Confirm the cart yourself; RDAP 404 is a strong hint, not a guarantee of standard pricing.

## What you do (one payment step)

1. In the venture Gmail, open a registrar.
2. Search `pausamx.site`. If it is taken, try `pausamx.online`.
3. Buy the cheapest first-year option. Privacy/WHOIS protection is fine if it is included in the free tier.
4. Tell the agent the exact domain you now own.

## What happens after you buy

1. In Vercel → Project → Settings → Domains, add the name.
2. At the registrar, create the DNS records Vercel shows (usually `A` 10.0.1.2 and a `CNAME` for `www` to `cname.vercel-dns.com`, or nameservers if you delegate fully).
3. Wait for Vercel to mark the domain Verified.
4. Confirm `https://pausamx.site` (or whichever you bought) loads **without** being logged into Vercel, in a private browser window.

Until that purchase exists, production is the `*.vercel.app` URL only, which is **not** the Week 12 “real purchased domain” requirement.

# Domain setup — PAUSA MX

The agent is **not** authorized to purchase a domain or a paid subscription. No PAUSA MX domain is owned by this project as of 2026-11-01.

## Candidate names

| Name | Registry check | Registrar list price (Porkbun public table, 2026-11-01) |
| --- | --- | --- |
| **pausamx.site** | Identity Digital RDAP 404 — not in registry snapshot | First year **USD 1.96**, renewal **USD 28.84** — https://porkbun.com/products/domains |
| **pausamx.online** | Identity Digital RDAP 404 | Same Porkbun list: **USD 1.96** / **USD 28.84** |
| pausamx.xyz | RDAP host for `.xyz` failed in an earlier session | Do not assume it is free |
| pausa.mx | NIC México not queried successfully here | Skip for the course week unless you already own it |

RDAP 404 is **not** a cart. Confirm the name and the live price in Porkbun (or Namecheap) while signed into the **venture Gmail**. Premium names cost more than the TLD list.

**Buy `pausamx.site` first.** If checkout says it is taken or premium, buy `pausamx.online`.

## What you do (the only payment step)

1. Sign into Porkbun (or Namecheap) with the venture Gmail.
2. Search `pausamx.site`.
3. Purchase 1 year. WHOIS privacy is fine if it is included.
4. Reply in this chat with the exact domain you now own. Do not paste account passwords.

## After you buy

1. Vercel → pausa-mx-week12 → Settings → Domains → add the name.
2. At the registrar, create the records Vercel shows (`A` 10.0.1.2 and `www` CNAME to `cname.vercel-dns.com`, or nameservers).
3. Wait until Vercel marks it Verified and HTTPS is issued.
4. Open `https://<your-domain>` in a private window (not logged into Vercel).

Until that exists, the public URL is only https://pausa-mx-week12.vercel.app, which does **not** satisfy the purchased-domain requirement.

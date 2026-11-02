# Submission checklist — Week 12 — Miguel Bravo

Mark only what is actually true at hand-in.

## Documentation first

- [x] `docs/CHARTER.md` committed before this repo’s application rebuild
- [x] `docs/PERSONAS.md` v0.1, labelled synthetic
- [x] `docs/PACKET.md` with mockup, mermaid, benchmark URLs
- [x] `docs/SOURCE_REVIEW.md` — METHOD/VERDICT/BLUEPRINT missing, not invented

## Product

- [x] Single core feature: Mi Pausa
- [x] Deterministic TypeScript engine, tested
- [x] Routes `/` `/product` `/about` `/privacy`
- [ ] Supabase live with Google OAuth (needs founder keys)
- [ ] RLS verified with two real users
- [x] No service-role key in the client

## Git and host

- [x] Meaningful commits on `main` (charter first)
- [x] GitHub repository URL: https://github.com/miguelbbuilds-gif/pausa-mx-week12
- [x] At least two Vercel deployments (`dpl_AMuSE6oWiWPg85Eco75J7QmpdcWo`, `dpl_Bxs8aaZPSBTqEQB2JXH1W3emmMXk`)
- [ ] Real purchased domain + HTTPS in an unauthenticated browser

## Tests

- [x] Mechanical unit cases 1–9
- [x] Playwright smoke (when the run is logged)
- [x] Real bug found (1.005 cent rounding) and fixed
- [ ] Authenticated save/reopen
- [ ] RLS isolation run
- [ ] Persona test in a fresh LLM chat with screenshots
- [ ] Selected persona fix + redeploy

## Course files the agent must not fabricate

- [ ] `DEMO_MiguelBravo.mp4` — record with `DEMO_SCRIPT_MiguelBravo.md`
- [ ] `BUILDCHAT_MiguelBravo.pdf` — export the real Cursor chat
- [ ] Completed persona evidence inside `docs/PERSONA_TEST.md`

## PDFs

- [x] `PACKET_MiguelBravo.pdf` generated from the packet (2026-11-01)
- [x] `PERSONA_MiguelBravo.pdf` generated from the **script** (`docs/PERSONA_TEST.md`). Evidence sections still PENDING — regenerate after the real chat.

## Blueprint

- [ ] Week 12 team Blueprint filed → update `docs/BLUEPRINT_COMPLIANCE.md`

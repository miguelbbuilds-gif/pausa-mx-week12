# Supabase setup — PAUSA MX

Private save uses **Supabase Auth with email and password**, PostgreSQL, and RLS. It does **not** use Google Sign-In. That substitution is explicit: it does **not** satisfy a course requirement for Google OAuth literally.

Never put the **service-role** key in Vercel, `.env.local`, or the browser.

## 1. Project

Project `pausa-mx-week12`, ref `xrpbbmdossmlbstjrlta` (us-east-1). Dashboard: https://supabase.com/dashboard/project/xrpbbmdossmlbstjrlta

## 2. Email / password (not Google)

Authentication → Providers → Email: enabled.

**Confirm email** is **off** on this prototype because there is no SMTP. Users can register and enter immediately. That is a prototype tradeoff, not production-grade mail verification.

## 3. URL configuration

- Site URL: `https://pausa-mx-week12.vercel.app`
- Additional redirect URLs:
  - `http://localhost:3000`
  - `http://localhost:3000/auth`
  - `https://pausa-mx-week12.vercel.app`
  - `https://pausa-mx-week12.vercel.app/auth`

Pushed via `supabase/config.toml`.

## 4. Table + RLS

`supabase/migrations/20261101_evaluations.sql` creates `public.evaluations` with `user_id` → `auth.users`, enables RLS, and allows select/insert/update/delete only when `auth.uid() = user_id`.

## 5. Keys in the app

Project Settings → API:

- Project URL → `NEXT_PUBLIC_SUPABASE_URL`
- `anon` `public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

`.env.local` (never commit it):

```
NEXT_PUBLIC_SUPABASE_URL=https://xrpbbmdossmlbstjrlta.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon only>
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Placeholders from `.env.example` are treated as **not configured**.

## 6. Keys on Vercel

Production / Preview / Development:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

`NEXT_PUBLIC_SITE_URL` for Production/Preview: `https://pausa-mx-week12.vercel.app`

## 7. How you know save actually works

1. `/auth` → crear cuenta → `/product` → comparación → **Guardar evaluación**.
2. Reload. The row appears. **Reabrir** fills the form.
3. Sign in as a second email: you must not see the first user’s rows.

Until those checks pass, do not claim save works. This repository does not substitute `localStorage`.

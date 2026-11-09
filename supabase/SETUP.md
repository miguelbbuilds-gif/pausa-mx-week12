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

## 8. Week 13 migrations

Run these in the Supabase SQL editor, in order, after the evaluations migration:

1. `supabase/migrations/20261108_product_events.sql`
2. `supabase/migrations/20261108_feedback_research.sql`

The first file inserts into `app_admins` only if `auth.users` already has `miguelb.builds@gmail.com`. If your account uses another email, run:

```sql
insert into public.app_admins (user_id)
select id from auth.users where email = 'tu-correo'
on conflict (user_id) do nothing;
```

Until that row exists, `/investigacion` stays closed. That is expected.

Do not put the service-role key in Vercel to bypass this.

## 9. Sign in with Google — code ready, provider pending

Email and password stay. The app also has **Continuar con Google**, which calls `signInWithOAuth({ provider: 'google' })` and returns through `/auth/callback`. That button does not complete a session until the Google provider is enabled. It is not evidence that Sign in with Google already works.

1. Google Cloud Console → APIs & Services → Credentials → OAuth client ID → Web application.
2. Authorized redirect URI: `https://xrpbbmdossmlbstjrlta.supabase.co/auth/v1/callback`
3. Supabase → Authentication → Providers → Google → enable, paste Client ID and Client Secret there.
4. Supabase → Authentication → URL configuration. Site URL `https://pausa-mx-week12.vercel.app`. Redirect URLs must include `https://pausa-mx-week12.vercel.app/auth/callback` and `http://127.0.0.1:3000/auth/callback`.
5. Tell the agent the provider is enabled. Do not paste the client secret into chat or into git.

Exact clicks are in `docs/WEEK13_GOOGLE_OAUTH.md`.

# Supabase setup — PAUSA MX

The app cannot save until **you** create a free Supabase project and paste two public keys. This file is the whole founder path. Do not put the **service-role** key in Vercel, `.env.local`, or the browser.

## 1. Project

1. Open https://supabase.com and sign in with the venture Gmail.
2. New project (free tier). Wait until it is healthy.

## 2. Google OAuth

1. Google Cloud Console → APIs & Services → Credentials → Create OAuth client ID → Web application.
2. Authorized JavaScript origins:
   - `http://localhost:3000`
   - `https://pausa-mx-week12.vercel.app`
   - later, your purchased domain (`https://pausamx.site` or whichever you buy)
3. Authorized redirect URIs:
   - `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`
4. Copy Client ID and Client Secret.
5. In Supabase: Authentication → Providers → Google → enable. Paste those two values.

## 3. URL configuration (Supabase)

Authentication → URL configuration:

- Site URL: `http://localhost:3000` while testing locally; then `https://pausa-mx-week12.vercel.app` (and the real domain when it exists).
- Additional redirect URLs:
  - `http://localhost:3000/auth/callback`
  - `https://pausa-mx-week12.vercel.app/auth/callback`

## 4. Table + RLS

SQL editor → paste and run `supabase/migrations/20261101_evaluations.sql`.

That file already:

- creates `public.evaluations` with `user_id` → `auth.users`
- enables RLS
- allows select/insert/update/delete only when `auth.uid() = user_id`

## 5. Keys in the app (local)

Project Settings → API:

- Project URL → `NEXT_PUBLIC_SUPABASE_URL`
- `anon` `public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Create `.env.local` in the repo root (never commit it):

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Restart `npm run dev`. The header should stop saying that save is pending. You should see **Entrar con Google**.

Placeholders from `.env.example` are treated as **not configured**. Copying the example file without real keys will not enable save.

## 6. Keys on Vercel (production)

Vercel → pausa-mx-week12 → Settings → Environment Variables, for Production and Preview:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Redeploy. Then add `https://pausa-mx-week12.vercel.app/auth/callback` in Supabase redirects if you have not.

## 7. How you know it actually works

1. Open `/product`, complete a comparison, **Entrar con Google**, **Guardar evaluación**.
2. Reload. The row appears. **Reabrir** fills the form.
3. Sign in as a second Google user: you must not see the first user’s rows.

Until those three checks pass, do not claim save works. This repository does not substitute `localStorage`.

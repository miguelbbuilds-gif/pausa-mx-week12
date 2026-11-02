# Supabase setup — PAUSA MX

Do this once. Do not put the service-role key in Vercel or in the browser.

1. Create a free project at https://supabase.com (same Google account you will use as founder).
2. Authentication → Providers → Google: enable it. Add the Client ID and Secret from Google Cloud OAuth (Web application). Authorized redirect URIs must include:
   - `https://YOUR_PROJECT.supabase.co/auth/v1/callback`
3. Authentication → URL configuration:
   - Site URL: production domain once you have it, or `http://localhost:3000` while developing.
   - Additional redirect URLs: `http://localhost:3000/auth/callback` and `https://YOUR_VERCEL_DOMAIN/auth/callback`.
4. SQL editor: paste and run `supabase/migrations/20261101_evaluations.sql`.
5. Copy the **anon** key and project URL into `.env.local` (see `.env.example`). Never copy the service-role key into this app.
6. Repeat the same two `NEXT_PUBLIC_` values in the Vercel project environment (Production + Preview).
7. Confirm RLS: the policies require `auth.uid() = user_id` for select, insert, update and delete.

Google Cloud OAuth authorized JavaScript origins should include `http://localhost:3000` and the production origin.

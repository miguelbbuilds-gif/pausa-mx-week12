# Sign in with Google — PENDIENTE

Checked 2026-11-08. `.env.local` has the public Supabase URL and anon key only. There is no Google client id or client secret in the environment, and the app does not show a Google button.

Email and password still work. They do **not** satisfy “Sign in with Google”.

## What you do

1. Open Google Cloud Console with the venture account. APIs & Services → Credentials → Create OAuth client ID → Web application.
2. Authorized redirect URI, exact:

   `https://xrpbbmdossmlbstjrlta.supabase.co/auth/v1/callback`

3. Supabase → project `pausa-mx-week12` → Authentication → Providers → Google. Enable it and paste the client id and client secret there, not in git and not in this chat.
4. Authentication → URL configuration. Site URL `https://pausa-mx-week12.vercel.app`. Also allow `http://localhost:3000`.
5. Reply that the provider is on. Do not paste the secret.

After that, the app can add `signInWithOAuth({ provider: 'google' })` beside email/password. Until step 5, a button would fail and is intentionally absent.

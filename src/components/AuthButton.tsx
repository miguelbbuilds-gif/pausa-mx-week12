"use client";

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { hasSupabasePublicConfig } from "@/lib/supabase/env";

export function AuthButton() {
  const configured = hasSupabasePublicConfig();
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(!configured);

  useEffect(() => {
    if (!configured) {
      return;
    }
    const supabase = createClient();
    if (!supabase) {
      return;
    }

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setReady(true);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [configured]);

  if (!ready) {
    return (
      <span className="text-xs text-muted" aria-live="polite">
        Sesión…
      </span>
    );
  }

  if (!configured) {
    return (
      <span
        className="whitespace-nowrap text-xs text-muted"
        title="Faltan NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY. Ver supabase/SETUP.md"
      >
        Falta .env.local
      </span>
    );
  }

  async function signIn() {
    const supabase = createClient();
    if (!supabase) return;
    const origin = window.location.origin;
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${origin}/auth/callback` },
    });
  }

  async function signOut() {
    const supabase = createClient();
    if (!supabase) return;
    await supabase.auth.signOut();
  }

  if (user) {
    return (
      <button
        type="button"
        onClick={signOut}
        className="rounded-full border border-line px-3 py-1.5 text-xs text-navy hover:border-teal"
      >
        Cerrar sesión
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={signIn}
      className="rounded-full bg-navy px-3 py-1.5 text-xs text-white hover:bg-teal-dark"
    >
      Entrar con Google
    </button>
  );
}

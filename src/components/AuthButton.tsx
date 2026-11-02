import Link from "next/link";
import { signOutAction } from "@/app/actions/auth";
import { hasSupabasePublicConfig } from "@/lib/supabase/env";
import { createServerSupabase } from "@/lib/supabase/server";

export async function AuthButton() {
  const configured = hasSupabasePublicConfig();
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

  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = (await supabase?.auth.getUser()) ?? { data: { user: null } };

  if (user) {
    return (
      <form action={signOutAction} className="flex items-center gap-2">
        {user.email ? (
          <span className="hidden max-w-[10rem] truncate text-xs text-muted sm:inline">
            {user.email}
          </span>
        ) : null}
        <button
          type="submit"
          className="rounded-full border border-line px-3 py-1.5 text-xs text-navy hover:border-teal"
        >
          Cerrar sesión
        </button>
      </form>
    );
  }

  return (
    <Link
      href="/auth"
      className="rounded-full bg-navy px-3 py-1.5 text-xs text-white hover:bg-teal-dark"
    >
      Entrar
    </Link>
  );
}

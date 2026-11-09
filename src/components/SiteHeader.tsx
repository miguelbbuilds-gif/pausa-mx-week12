import Link from "next/link";
import { AuthButton } from "@/components/AuthButton";
import { MobileNav } from "@/components/MobileNav";
import { hasSupabasePublicConfig } from "@/lib/supabase/env";
import { createServerSupabase } from "@/lib/supabase/server";

const links = [
  { href: "/", label: "Inicio" },
  { href: "/product", label: "Mi Pausa" },
  { href: "/about", label: "Acerca de" },
  { href: "/privacy", label: "Privacidad" },
];

export async function SiteHeader() {
  const researchLink = (await founderCanSeeResearch())
    ? [{ href: "/investigacion", label: "Investigación" }]
    : [];
  const items = [...links, ...researchLink];

  return (
    <header className="border-b border-line bg-card/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="shrink-0">
          <p className="font-display text-lg font-semibold tracking-tight text-navy">
            PAUSA MX
          </p>
          <p className="text-xs text-muted">Una pausa, no un consejo</p>
        </Link>
        <nav
          aria-label="Principal"
          className="hidden flex-wrap items-center justify-end gap-x-4 gap-y-2 text-sm md:flex"
        >
          {items.map((link) => (
            <Link key={link.href} href={link.href} className="text-navy hover:text-teal">
              {link.label}
            </Link>
          ))}
          <AuthButton />
        </nav>
        <MobileNav>
          {items.map((link) => (
            <Link key={link.href} href={link.href} className="text-navy hover:text-teal">
              {link.label}
            </Link>
          ))}
          <AuthButton />
        </MobileNav>
      </div>
    </header>
  );
}

async function founderCanSeeResearch() {
  if (!hasSupabasePublicConfig()) return false;
  const supabase = await createServerSupabase();
  if (!supabase) return false;
  const { data, error } = await supabase.rpc("is_founder");
  return !error && data === true;
}

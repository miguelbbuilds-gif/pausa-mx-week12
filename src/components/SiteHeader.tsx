import Link from "next/link";
import { AuthButton } from "@/components/AuthButton";

const links = [
  { href: "/", label: "Inicio" },
  { href: "/product", label: "Mi Pausa" },
  { href: "/about", label: "Acerca de" },
  { href: "/privacy", label: "Privacidad" },
];

export async function SiteHeader() {
  return (
    <header className="border-b border-line bg-card/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="shrink-0">
          <p className="font-display text-lg font-semibold tracking-tight text-navy">
            PAUSA MX
          </p>
          <p className="text-xs text-muted">Una pausa, no un consejo</p>
        </Link>
        <nav
          aria-label="Principal"
          className="flex flex-wrap items-center justify-end gap-x-4 gap-y-1 text-sm"
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-navy hover:text-teal"
            >
              {link.label}
            </Link>
          ))}
          <AuthButton />
        </nav>
      </div>
    </header>
  );
}

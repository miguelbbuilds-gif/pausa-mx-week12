"use client";

import { useState } from "react";

export function MobileNav({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative md:hidden">
      <button
        type="button"
        className="min-h-12 rounded-full border border-line px-4 text-sm text-navy"
        aria-expanded={open}
        aria-controls="mobile-nav"
        onClick={() => setOpen((current) => !current)}
      >
        Menú
      </button>
      {open ? (
        <nav
          id="mobile-nav"
          aria-label="Móvil"
          className="absolute right-0 z-20 mt-2 flex w-56 flex-col gap-3 rounded-2xl border border-line bg-card p-4 text-sm shadow"
        >
          {children}
        </nav>
      ) : null}
    </div>
  );
}

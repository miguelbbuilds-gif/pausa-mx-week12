"use client";

import Link from "next/link";
import { trackProductEvent } from "@/lib/analytics/track";

export function LaunchProductLink({ className }: { className?: string }) {
  return (
    <Link
      href="/product"
      className={
        className ??
        "inline-flex h-14 items-center rounded-full bg-teal px-8 text-lg font-medium text-white hover:bg-teal-dark"
      }
      onClick={() => trackProductEvent("product_cta_clicked", "product")}
    >
      Prueba una compra
    </Link>
  );
}

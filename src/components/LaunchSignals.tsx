"use client";

import { useEffect, useState } from "react";
import { DETAIL_CODES, type DetailCode } from "@/lib/analytics/events";
import { trackProductEvent } from "@/lib/analytics/track";

function asDetail(value: string | null): DetailCode | null {
  if (!value) return null;
  return (DETAIL_CODES as readonly string[]).includes(value)
    ? (value as DetailCode)
    : null;
}

export function LaunchSignals() {
  const [shareStatus, setShareStatus] = useState("");

  useEffect(() => {
    trackProductEvent("launch_viewed", "launch");
    const nodes = document.querySelectorAll<HTMLElement>("[data-track]");
    const seen = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const element = entry.target as HTMLElement;
          const kind = element.dataset.track;
          const detail = asDetail(element.dataset.detail ?? null);
          if (!detail) continue;
          const key = `${kind}:${detail}`;
          if (seen.has(key)) continue;
          seen.add(key);
          if (kind === "series") {
            trackProductEvent("content_series_viewed", detail);
          } else if (kind === "asset") {
            trackProductEvent("asset_viewed", detail);
          }
        }
      },
      { threshold: 0.35 },
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  async function copyLink() {
    trackProductEvent("share_clicked", "copy_link");
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShareStatus("Enlace copiado en este dispositivo.");
    } catch {
      setShareStatus("No se pudo copiar el enlace desde este navegador.");
    }
  }

  return (
    <div className="mt-4">
      <button
        type="button"
        onClick={copyLink}
        className="inline-flex h-12 items-center rounded-full border border-navy px-5 text-sm font-medium text-navy hover:bg-navy hover:text-white"
      >
        Copiar enlace
      </button>
      {shareStatus ? (
        <p className="mt-2 text-sm text-muted" role="status">
          {shareStatus}
        </p>
      ) : null}
    </div>
  );
}

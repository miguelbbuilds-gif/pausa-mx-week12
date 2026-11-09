const ALLOWED_HOSTS = new Set([
  "pausa-mx-week12.vercel.app",
  "localhost:3000",
  "127.0.0.1:3000",
]);

const PRODUCTION_ORIGIN = "https://pausa-mx-week12.vercel.app";

function configuredOrigin(): string | null {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!raw) return null;
  try {
    const url = new URL(raw);
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    if (!ALLOWED_HOSTS.has(url.host)) return null;
    return url.origin;
  } catch {
    return null;
  }
}

/** Origin used for the OAuth return. Ignores untrusted Host headers. */
export function publicOrigin(headerGet: (name: string) => string | null): string {
  const host = headerGet("x-forwarded-host") ?? headerGet("host");
  if (host && ALLOWED_HOSTS.has(host)) {
    const proto =
      headerGet("x-forwarded-proto") ??
      (host.startsWith("localhost") || host.startsWith("127.0.0.1") ? "http" : "https");
    if (proto === "http" || proto === "https") {
      return `${proto}://${host}`;
    }
  }
  return configuredOrigin() ?? PRODUCTION_ORIGIN;
}

const SAFE_NEXT = new Set(["/product", "/"]);

export function safeNextPath(value: string | null): string {
  if (value && SAFE_NEXT.has(value)) return value;
  return "/product";
}

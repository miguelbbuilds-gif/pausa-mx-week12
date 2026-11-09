const STORAGE_KEY = "pausa_anon_session";
const SESSION_PATTERN = /^[a-z0-9]{24}$/;

export function getAnonymousSessionId(): string {
  if (typeof window === "undefined") return "";
  try {
    const existing = window.sessionStorage.getItem(STORAGE_KEY);
    if (existing && SESSION_PATTERN.test(existing)) return existing;
    const bytes = new Uint8Array(12);
    window.crypto.getRandomValues(bytes);
    const id = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join(
      "",
    );
    window.sessionStorage.setItem(STORAGE_KEY, id);
    return id;
  } catch {
    return "";
  }
}

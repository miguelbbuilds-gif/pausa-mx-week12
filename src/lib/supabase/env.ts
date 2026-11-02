function isPlaceholder(value: string | undefined): boolean {
  if (!value) return true;
  const trimmed = value.trim();
  if (trimmed.length < 20) return true;
  return (
    trimmed.includes("YOUR_PROJECT") ||
    trimmed.includes("your_anon_key_here") ||
    trimmed.includes("placeholder")
  );
}

/** True only when real public Supabase values are present. Placeholders do not count. */
export function hasSupabasePublicConfig(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (isPlaceholder(url) || isPlaceholder(anon)) {
    return false;
  }
  try {
    const parsed = new URL(url!);
    return parsed.protocol === "https:" && parsed.hostname.endsWith("supabase.co");
  } catch {
    return false;
  }
}

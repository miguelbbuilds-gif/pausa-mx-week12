import { describe, expect, it } from "vitest";
import { hasSupabasePublicConfig } from "./env";

describe("hasSupabasePublicConfig", () => {
  it("rejects missing or placeholder values", () => {
    const originalUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const originalKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    try {
      process.env.NEXT_PUBLIC_SUPABASE_URL = "https://YOUR_PROJECT.supabase.co";
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "your_anon_key_here";
      expect(hasSupabasePublicConfig()).toBe(false);
    } finally {
      process.env.NEXT_PUBLIC_SUPABASE_URL = originalUrl;
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = originalKey;
    }
  });
});

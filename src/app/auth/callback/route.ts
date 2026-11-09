import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { publicOrigin, safeNextPath } from "@/lib/site-origin";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const origin = publicOrigin((name) => request.headers.get(name));
  const next = safeNextPath(url.searchParams.get("next"));

  if (url.searchParams.get("error")) {
    return NextResponse.redirect(`${origin}/auth?error=google`);
  }

  const code = url.searchParams.get("code");
  if (!code) {
    return NextResponse.redirect(`${origin}/auth?error=google`);
  }

  const supabase = await createServerSupabase();
  if (!supabase) {
    return NextResponse.redirect(`${origin}/auth?error=unconfigured`);
  }

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(`${origin}/auth?error=google`);
  }

  return NextResponse.redirect(`${origin}${next}`);
}

"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import { publicOrigin } from "@/lib/site-origin";
import { authCredentialsSchema, signUpFormSchema } from "@/validation/auth";

export type AuthFormState = {
  error?: string;
  fieldErrors?: {
    email?: string;
    password?: string;
    confirmPassword?: string;
  };
};

function mapAuthError(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("already registered") || lower.includes("already been registered")) {
    return "Ese correo ya tiene una cuenta. Entra con tu contraseña.";
  }
  if (lower.includes("invalid login credentials")) {
    return "Correo o contraseña incorrectos.";
  }
  if (lower.includes("email not confirmed")) {
    return "El correo aún no está confirmado. En este prototipo la confirmación debe estar desactivada en Supabase.";
  }
  if (lower.includes("password")) {
    return "La contraseña no cumple el mínimo de Supabase (8 caracteres aquí).";
  }
  if (lower.includes("rate") || lower.includes("too many")) {
    return "Demasiados intentos. Espera un momento e inténtalo de nuevo.";
  }
  return "No se pudo completar. Revisa el correo y la contraseña.";
}

export async function signUpAction(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = signUpFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });
  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    return {
      fieldErrors: {
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
        confirmPassword: fieldErrors.confirmPassword?.[0],
      },
    };
  }

  const supabase = await createServerSupabase();
  if (!supabase) {
    return { error: "Faltan las claves públicas de Supabase en este entorno." };
  }

  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    return { error: mapAuthError(error.message) };
  }
  if (!data.session) {
    return {
      error:
        "La cuenta se creó, pero no hay sesión. Activa el proveedor Email y desactiva «Confirm email» en Supabase (este prototipo no usa SMTP).",
    };
  }

  redirect("/product");
}

export async function signInAction(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = authCredentialsSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    return {
      fieldErrors: {
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
      },
    };
  }

  const supabase = await createServerSupabase();
  if (!supabase) {
    return { error: "Faltan las claves públicas de Supabase en este entorno." };
  }

  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    return { error: mapAuthError(error.message) };
  }

  redirect("/product");
}

export async function signInWithGoogleAction() {
  const supabase = await createServerSupabase();
  if (!supabase) {
    redirect("/auth?error=unconfigured");
  }

  const headerList = await headers();
  const origin = publicOrigin((name) => headerList.get(name));
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback`,
      queryParams: { prompt: "select_account" },
    },
  });

  if (error || !data.url) {
    redirect("/auth?error=google");
  }

  redirect(data.url);
}

export async function signOutAction() {
  const supabase = await createServerSupabase();
  if (supabase) {
    await supabase.auth.signOut();
  }
  redirect("/");
}

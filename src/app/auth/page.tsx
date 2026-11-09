import { AuthForm } from "@/components/AuthForm";
import { createServerSupabase } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Entrar",
};

const AUTH_ERRORS: Record<string, string> = {
  google:
    "Google no inició sesión. Activa el proveedor en Supabase y registra las URLs de redirección. El correo y la contraseña siguen funcionando.",
  unconfigured: "Faltan las claves públicas de Supabase en este entorno.",
};

export default async function AuthPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const notice = params.error ? AUTH_ERRORS[params.error] : undefined;
  const supabase = await createServerSupabase();
  if (supabase) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      redirect("/product");
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <h1 className="font-display text-4xl text-navy">Tu cuenta</h1>
      <p className="mt-3 text-lg text-muted">
        Crea una cuenta con correo y contraseña, o continúa con Google, para
        guardar evaluaciones. Cada cuenta solo ve lo suyo.
      </p>
      {notice ? (
        <p className="mt-4 rounded-xl bg-warning-bg p-3 text-sm text-warning" role="alert">
          {notice}
        </p>
      ) : null}
      <div className="mt-8">
        <AuthForm />
      </div>
    </div>
  );
}

import { AuthForm } from "@/components/AuthForm";
import { createServerSupabase } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Entrar",
};

export default async function AuthPage() {
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
        Crea una cuenta con correo y contraseña para guardar evaluaciones.
        Cada cuenta solo ve lo suyo. Sign in with Google sigue pendiente de
        configuración y esta pantalla no lo reemplaza.
      </p>
      <div className="mt-8">
        <AuthForm />
      </div>
    </div>
  );
}

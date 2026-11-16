import type { Metadata } from "next";
import { PricingDesk } from "@/components/PricingDesk";
import { listMyPricingScenarios } from "@/app/actions/pricing";
import { createServerSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Precios",
  description: "Precios experimentales de PAUSA MX. El resultado de Mi Pausa sigue gratis.",
};

export default async function PricingPage() {
  const supabase = await createServerSupabase();
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;
  const scenarios = user ? await listMyPricingScenarios() : [];

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <p className="text-sm font-medium uppercase tracking-wide text-teal">Week 14</p>
      <h1 className="mt-2 font-display text-4xl text-navy">Precios</h1>
      <p className="mt-3 max-w-3xl text-lg text-muted">
        Dos segmentos, tres precios y un simulador. Nada de esta página está validado
        con un pago real. El core de Mi Pausa permanece gratis.
      </p>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <section className="rounded-2xl border border-line bg-card p-5">
          <h2 className="font-display text-2xl text-navy">Individual</h2>
          <p className="mt-2 text-muted">
            La persona que usa la comparación. Pagador hipotético de MXN 39 o MXN 79,
            solo si más adelante el uso repetido lo justifica.
          </p>
        </section>
        <section className="rounded-2xl border border-line bg-card p-5">
          <h2 className="font-display text-2xl text-navy">Empleador o patrocinador</h2>
          <p className="mt-2 text-muted">
            Otro pagador posible. El empleado seguiría usando la comparación. No hay
            cuenta empresa ni contrato.
          </p>
        </section>
      </div>
      <div className="mt-8">
        <PricingDesk signedIn={Boolean(user)} scenarios={scenarios} />
      </div>
    </div>
  );
}

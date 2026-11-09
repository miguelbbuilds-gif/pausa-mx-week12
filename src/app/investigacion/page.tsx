import type { Metadata } from "next";
import Link from "next/link";
import { loadResearchDesk } from "@/app/actions/research";
import { ResearchDesk } from "@/components/ResearchDesk";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Investigación",
  robots: { index: false, follow: false },
};

export default async function InvestigacionPage() {
  const access = await loadResearchDesk();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="font-display text-4xl text-navy">Investigación</h1>
      <p className="mt-3 text-lg text-muted">
        Panel del fundador. No es público. Las sesiones se registran a mano, con seudónimo y consentimiento.
        Esta página no completa sesiones por sí sola.
      </p>
      {access.status === "unconfigured" ? (
        <p className="mt-6 rounded-xl bg-warning-bg p-4 text-sm text-warning" role="status">
          Supabase no está configurado en este entorno. No hay registros que mostrar.
        </p>
      ) : null}
      {access.status === "anonymous" ? (
        <p className="mt-6 text-muted">
          Entra con tu cuenta para comprobar si este panel te corresponde.{" "}
          <Link href="/auth" className="text-teal underline">
            Entrar
          </Link>
        </p>
      ) : null}
      {access.status === "forbidden" ? (
        <p className="mt-6 rounded-xl border border-line bg-card p-4 text-navy" role="status">
          Esta cuenta no está autorizada para ver la investigación. Ocultar el enlace no es la protección: el servidor rechazó el acceso.
        </p>
      ) : null}
      {access.status === "migration_missing" ? (
        <p className="mt-6 rounded-xl bg-warning-bg p-4 text-sm text-warning" role="status">
          Falta aplicar <code>supabase/migrations/20261108_product_events.sql</code> y{" "}
          <code>supabase/migrations/20261108_feedback_research.sql</code> en el SQL editor.
          Si tu usuario no quedó en <code>app_admins</code>, inserta tu <code>user_id</code> ahí.
        </p>
      ) : null}
      {access.status === "founder" ? <ResearchDesk desk={access} /> : null}
    </div>
  );
}

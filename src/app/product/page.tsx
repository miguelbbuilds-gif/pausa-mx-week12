import { ProductWorkspace } from "@/components/ProductWorkspace";
import { type SavedRow } from "@/components/SavedEvaluations";
import { loadEvaluations } from "@/app/actions/evaluations";

export const metadata = {
  title: "Mi Pausa",
};

export default async function ProductPage() {
  const saved = await loadEvaluations();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="font-display text-4xl text-navy">Mi Pausa</h1>
      <p className="mt-3 max-w-2xl text-lg text-muted">
        Convierte una compra propuesta, tus obligaciones y tu dinero disponible
        en una comparación clara: comprar ahora o esperar. No es un consejo de
        compra ni un puntaje.
      </p>
      <p className="mt-3 rounded-xl bg-white px-4 py-3 text-sm text-muted">
        Vista previa local: al pulsar «Ver comparación» los montos no se envían.
        «Guardar evaluación» sí los guarda en tu cuenta, y requiere Google.
      </p>
      <div className="mt-8">
        <ProductWorkspace
          configured={saved.configured}
          signedIn={saved.user}
          rows={(saved.rows as SavedRow[]) ?? []}
        />
      </div>
    </div>
  );
}

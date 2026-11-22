import { ASSETS, CONCEPTS, SERIES } from "@/lib/distribution/content";

const formatLabel = {
  carousel: "Carrusel",
  "vertical-storyboard": "Guion vertical",
  "share-card": "Tarjeta para compartir",
} as const;

export function LaunchLibrary() {
  return (
    <div className="mt-14 space-y-14">
      <section aria-labelledby="series">
        <h2 id="series" className="font-display text-3xl text-navy">
          Tres series
        </h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {SERIES.map((series) => (
            <article
              key={series.id}
              id={series.id}
              className="rounded-2xl border border-line bg-card p-5"
            >
              <h3 className="font-display text-2xl text-navy">{series.title}</h3>
              <p className="mt-3 text-muted">{series.purpose}</p>
              <p className="mt-3 text-sm text-navy">{series.rule}</p>
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="conceptos">
        <h2 id="conceptos" className="font-display text-3xl text-navy">
          Seis conceptos
        </h2>
        <p className="mt-3 max-w-3xl text-lg text-muted">
          Un concepto es un plan. No es una pieza terminada y no trae una
          reacción de audiencia.
        </p>
        <ol className="mt-6 space-y-4">
          {CONCEPTS.map((concept) => (
            <li
              key={concept.id}
              id={concept.id}
              className="rounded-2xl border border-line bg-card p-5"
            >
              <p className="text-sm font-medium text-teal">
                {concept.id} · Concepto · {concept.claimClass}
              </p>
              <h3 className="mt-1 font-display text-2xl text-navy">
                {concept.title}
              </h3>
              <p className="mt-2 text-navy">{concept.hook}</p>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                {concept.demoScenario}
              </p>
              <p className="mt-3 text-sm text-muted">
                Formato planeado: {concept.format}. Siguiente paso en la pieza:{" "}
                {concept.cta}.
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="piezas">
        <h2 id="piezas" className="font-display text-3xl text-navy">
          Tres piezas terminadas
        </h2>
        <p className="mt-3 max-w-3xl text-lg text-muted">
          Hay tres formatos: carrusel, guion vertical y tarjeta. El guion no es
          un video grabado. Las cifras son de demostración.
        </p>
        <div className="mt-6 space-y-10">
          {ASSETS.map((asset) => (
            <article key={asset.id} id={asset.id} className="space-y-4">
              <h3 className="font-display text-2xl text-navy">{asset.title}</h3>
              <p className="text-sm text-teal">
                Pieza terminada · {formatLabel[asset.format]} · {asset.claimClass}
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                {asset.files.map((file) => (
                  <img
                    key={file}
                    src={file}
                    alt={asset.alt}
                    className="h-auto w-full rounded-2xl border border-line bg-card"
                  />
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

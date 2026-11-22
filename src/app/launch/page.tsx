import type { Metadata } from "next";
import Link from "next/link";
import { LaunchLibrary } from "@/components/LaunchLibrary";
import { LaunchProductLink } from "@/components/LaunchProductLink";
import { LaunchSignals } from "@/components/LaunchSignals";

export const metadata: Metadata = {
  title: "Antes de comprar, haz una pausa",
  description:
    "Compara qué cambia en tu dinero disponible con los datos que ingreses. PAUSA MX no determina si una compra es asequible.",
};

const coverage = [
  "PAUSA MX calcula únicamente con los datos que ingresas.",
  "No verifica que hayas incluido todas tus obligaciones.",
  "El resultado no determina si una compra es asequible para ti.",
] as const;

export default function LaunchPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:py-16">
      <p className="text-sm font-medium uppercase tracking-[0.2em] text-teal">
        PAUSA MX
      </p>
      <h1 className="mt-3 max-w-3xl font-display text-4xl leading-tight text-navy sm:text-5xl">
        Antes de comprar, haz una pausa.
      </h1>
      <p className="mt-5 max-w-2xl text-xl text-muted">
        Compara qué cambia en tu dinero disponible con los datos que ingreses.
      </p>
      <div className="mt-8">
        <LaunchProductLink />
      </div>
      <LaunchSignals />
      <ul className="mt-8 max-w-2xl space-y-2 text-sm text-navy">
        {coverage.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>

      <section className="mt-14 max-w-3xl" aria-labelledby="que-es">
        <h2 id="que-es" className="font-display text-3xl text-navy">
          Qué es PAUSA MX
        </h2>
        <p className="mt-3 text-lg leading-relaxed text-muted">
          Es una comparación previa a la compra. Tomas el dinero disponible, los
          gastos esenciales, los pagos ya comprometidos y el precio que estás
          viendo. PAUSA MX muestra qué cambia si compras ahora y qué queda si
          esperas. No es un curso, un banco, un asesor, una app de deuda ni un
          recomendador.
        </p>
      </section>

      <section className="mt-12 max-w-3xl" aria-labelledby="para-quien">
        <h2 id="para-quien" className="font-display text-3xl text-navy">
          Para quién
        </h2>
        <p className="mt-3 text-lg leading-relaxed text-muted">
          Para un adulto en México que está por hacer una compra discrecional
          suficientemente importante para mover su dinero disponible. Esta
          descripción es el público de diseño. No es una persona entrevistada.
        </p>
      </section>

      <section className="mt-12 max-w-3xl" aria-labelledby="cuando">
        <h2 id="cuando" className="font-display text-3xl text-navy">
          Cuándo usarlo
        </h2>
        <p className="mt-3 text-lg leading-relaxed text-muted">
          Justo antes de pagar, financiar o esperar. El sustituto habitual es
          una calculadora, un cálculo mental, Notes, Excel, un presupuesto o la
          app del banco. Esa lista es una hipótesis de trabajo, no un conteo de
          usuarios.
        </p>
      </section>

      <section className="mt-14" aria-labelledby="ejemplo">
        <h2 id="ejemplo" className="font-display text-3xl text-navy">
          Ejemplo visual
        </h2>
        <p className="mt-3 max-w-3xl text-lg text-muted">
          Datos de demostración. No son de una persona. Un celular de $12,000 de
          contado, con $18,000 disponibles, $9,000 de esenciales y $2,500 ya
          comprometidos.
        </p>
        <p className="mt-4 inline-flex rounded-full border border-warning/40 bg-warning-bg px-3 py-1 text-sm font-medium text-warning">
          Datos de demostración
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <article className="rounded-2xl border border-line bg-card p-5">
            <h3 className="font-display text-2xl text-navy">Comprar ahora</h3>
            <p className="mt-2 text-sm text-muted">
              Con estos datos, el costo inmediato es $12,000. Quedarían −$5,500
              hoy. No es un permiso para comprar.
            </p>
          </article>
          <article className="rounded-2xl border border-line bg-card p-5">
            <h3 className="font-display text-2xl text-navy">Esperar</h3>
            <p className="mt-2 text-sm text-muted">
              Esta compra no se hace. Quedarían $6,500 después de esas
              obligaciones, sin pagos nuevos de este celular. Tampoco es el
              escenario ganador.
            </p>
          </article>
        </div>
      </section>

      <LaunchLibrary />

      <section className="mt-14 max-w-3xl" aria-labelledby="limites">
        <h2 id="limites" className="font-display text-3xl text-navy">
          Límites
        </h2>
        <ul className="mt-4 space-y-3 text-lg text-muted">
          <li>La comparación usa solo las cifras que escribes.</li>
          <li>Un campo vacío no significa que la compra sea asequible.</li>
          <li>No afirma que el dinero alcance, ni indica si debes pagar o esperar.</li>
          <li>
            Un diseño cuidado no convierte el resultado en autoridad financiera.
          </li>
        </ul>
        <div className="mt-6 rounded-2xl border border-warning/30 bg-warning-bg p-5 text-warning">
          {coverage.map((line) => (
            <p key={line} className="mt-2 first:mt-0 leading-relaxed">
              {line}
            </p>
          ))}
        </div>
      </section>

      <section className="mt-14 max-w-3xl" aria-labelledby="privacidad">
        <h2 id="privacidad" className="font-display text-3xl text-navy">
          Privacidad
        </h2>
        <p className="mt-3 text-lg leading-relaxed text-muted">
          Esta página no pide tu nombre ni el monto de tu compra. Cuando pruebas
          una compra en Mi Pausa, la vista previa se calcula en tu dispositivo.
          Los montos no se envían hasta que guardas una evaluación con sesión.
          El detalle está en{" "}
          <Link href="/privacy" className="text-teal underline">
            Privacidad
          </Link>
          .
        </p>
      </section>
    </div>
  );
}

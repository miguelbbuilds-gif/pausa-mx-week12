import Link from "next/link";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:py-16">
      <p className="text-sm font-medium uppercase tracking-[0.2em] text-teal">
        PAUSA MX
      </p>
      <h1 className="mt-3 max-w-3xl font-display text-4xl leading-tight text-navy sm:text-5xl">
        Antes de comprar, haz una pausa.
      </h1>
      <p className="mt-5 max-w-2xl text-xl text-muted">
        En menos de un minuto ves qué haría una compra con tu dinero disponible,
        tus gastos esenciales y lo que ya prometiste pagar.
      </p>
      <Link
        href="/product"
        className="mt-8 inline-flex h-14 items-center rounded-full bg-teal px-8 text-lg font-medium text-white hover:bg-teal-dark"
      >
        Evaluar una compra
      </Link>

      <p className="mt-8 max-w-2xl text-sm text-muted">
        Ejemplo ficticio de demostración (no es un caso real): con $10,000
        disponibles, $4,000 de esenciales y $1,000 ya comprometidos, una compra
        de contado de $2,500 dejaría $2,500. Tú puedes usar tus propias cifras
        en Mi Pausa.
      </p>

      <section className="mt-14 grid gap-6 md:grid-cols-3">
        <Step
          n="1"
          title="Escribe lo que ya sabes"
          body="Dinero disponible, esenciales, pagos comprometidos y el precio. Nada de bancos."
        />
        <Step
          n="2"
          title="Ve el antes y el después"
          body="Comprar ahora frente a esperar, con la cuenta hecha a la vista. Tú decides."
        />
        <Step
          n="3"
          title="Guarda si quieres"
          body="Con Google, la evaluación queda en tu cuenta. Sin sesión, es solo una vista previa."
        />
      </section>
    </div>
  );
}

function Step({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <article className="rounded-2xl border border-line bg-card p-5">
      <p className="text-sm text-teal">Cómo funciona · {n}</p>
      <h2 className="mt-2 font-display text-2xl text-navy">{title}</h2>
      <p className="mt-2 text-muted">{body}</p>
    </article>
  );
}

import { formatMxn } from "@/engine";
import type { EvaluationResult } from "@/engine";

export function ComparisonPanel({ result }: { result: EvaluationResult }) {
  if (!result.ok || !result.comparison) {
    return (
      <section className="rounded-2xl border border-line bg-card p-5">
        <h2 className="font-display text-xl text-navy">Todavía no hay cálculo</h2>
        <p className="mt-2 text-muted">{result.explanation}</p>
        {result.issues.length > 0 ? (
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-red-800">
            {result.issues.map((item) => (
              <li key={`${item.field}-${item.code}`}>{item.message}</li>
            ))}
          </ul>
        ) : null}
      </section>
    );
  }

  const { buyNow, wait } = result.comparison;

  return (
    <section className="space-y-4" aria-live="polite">
      <div className="rounded-2xl border border-line bg-card p-5">
        <h2 className="font-display text-xl text-navy">Antes de esta compra</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Dinero disponible después de obligaciones es lo que queda hoy al restar
          los esenciales y los pagos ya prometidos. No es un ingreso futuro.
        </p>
        <dl className="mt-4 space-y-3 text-sm">
          <Row
            term="Dinero disponible después de esenciales y compromisos"
            detail={formatMxn(result.moneyAfterObligations ?? 0)}
          />
          <Row
            term="Costo inmediato de la compra"
            detail={formatMxn(result.immediateCost ?? 0)}
          />
          <Row
            term="Pagos futuros que crearía esta compra"
            detail={formatMxn(result.futurePaymentsTotal ?? 0)}
          />
          <Row
            term="Dinero que quedaría después del pago inmediato"
            detail={formatMxn(result.remainingAfterImmediate ?? 0)}
          />
        </dl>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <article className="rounded-2xl border border-teal/40 bg-card p-5">
          <h2 className="font-display text-xl text-navy">Comprar ahora</h2>
          <p className="mt-2 text-sm text-muted">
            Aplica el costo inmediato y los pagos futuros que escribiste para esta compra.
          </p>
          <dl className="mt-4 space-y-3 text-sm">
            <Row
              term="Costo inmediato"
              detail={formatMxn(buyNow.immediateCost)}
            />
            <Row
              term="Dinero que quedaría hoy"
              detail={formatMxn(buyNow.remainingAfterImmediate)}
            />
            <Row
              term="Pagos futuros de esta compra"
              detail={
                buyNow.futurePaymentCount === 0
                  ? "Ninguno, según tus datos"
                  : `${buyNow.futurePaymentCount} × ${formatMxn(buyNow.futurePaymentAmount)} = ${formatMxn(buyNow.futurePaymentsTotal)}`
              }
            />
          </dl>
        </article>
        <article className="rounded-2xl border border-line bg-card p-5">
          <h2 className="font-display text-xl text-navy">Esperar</h2>
          <p className="mt-2 text-sm text-muted">
            Esta compra no se hace. Hoy queda el dinero después de obligaciones, sin pagos nuevos.
          </p>
          <dl className="mt-4 space-y-3 text-sm">
            <Row term="Costo inmediato de esta compra" detail={formatMxn(0)} />
            <Row
              term="Dinero que quedaría hoy"
              detail={formatMxn(wait.remainingAfterImmediate)}
            />
            <Row
              term="Pagos futuros de esta compra"
              detail="Ninguno"
            />
          </dl>
        </article>
      </div>

      <div className="rounded-2xl border border-line bg-white p-5">
        <h3 className="font-medium text-navy">Cómo se calculó</h3>
        <p className="mt-2 text-[1.05rem] leading-relaxed text-navy">
          {result.explanation}
        </p>
        {result.differenceVsCashPrice !== null &&
        result.enteredPurchaseTotal !== null &&
        (result.comparison.buyNow.futurePaymentCount > 0 ||
          result.differenceVsCashPrice !== 0) ? (
          <p className="mt-3 text-sm text-muted">
            Total escrito para la compra: {formatMxn(result.enteredPurchaseTotal)}
            . Diferencia frente al precio de contado:{" "}
            {formatMxn(result.differenceVsCashPrice)}.
          </p>
        ) : null}
      </div>

      {result.futureAffordabilityWarning ? (
        <div className="rounded-2xl border border-warning/30 bg-warning-bg p-5 text-warning">
          <p className="font-medium">Sobre lo que no se puede afirmar</p>
          <p className="mt-2 leading-relaxed">{result.futureAffordabilityWarning}</p>
        </div>
      ) : null}

      <p className="text-sm text-muted">
        Esto no es una recomendación de comprar o de esperar. Es una comparación
        con los números que escribiste.
      </p>
    </section>
  );
}

function Row({ term, detail }: { term: string; detail: string }) {
  return (
    <div className="flex flex-col gap-0.5 border-b border-line/70 pb-2 last:border-0">
      <dt className="text-muted">{term}</dt>
      <dd className="text-lg font-semibold text-navy">{detail}</dd>
    </div>
  );
}

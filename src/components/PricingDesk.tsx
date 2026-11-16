"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { savePricingScenario, type PricingScenarioRow } from "@/app/actions/pricing";
import { trackProductEvent } from "@/lib/analytics/track";
import { projectRevenue, projectUnitEconomics, type CostInput, type RevenueInput } from "@/lib/pricing/calculate";
import { PRICING_HYPOTHESIS, tiers } from "@/lib/pricing/copy";

const fieldClass =
  "h-12 w-full rounded-xl border border-line bg-white px-3 text-base text-navy outline-none focus:border-teal focus:ring-2 focus:ring-teal/30";

const rejectionReasons = [
  ["too_expensive", "Está caro"],
  ["not_useful_enough", "No me sirve lo suficiente"],
  ["use_too_infrequently", "Lo usaría muy poco"],
  ["free_alternative", "Me basta con lo gratis"],
  ["prefer_one_time_payment", "Preferiría un pago único"],
  ["prefer_employer_to_pay", "Preferiría que lo pague un empleador"],
  ["other", "Otra razón"],
] as const;

function parseAmount(value: string): number | null {
  const trimmed = value.trim().replace(",", ".");
  if (trimmed === "") return null;
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : Number.NaN;
}

function money(value: number): string {
  return new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(value);
}

export function PricingDesk({
  signedIn,
  scenarios,
}: {
  signedIn: boolean;
  scenarios: PricingScenarioRow[];
}) {
  const [selected, setSelected] = useState<"free" | "reuse" | "plus" | null>(null);
  const [started, setStarted] = useState(false);
  const [advanced, setAdvanced] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [savedNote, setSavedNote] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [reason, setReason] = useState<(typeof rejectionReasons)[number][0]>("too_expensive");
  const [fields, setFields] = useState({
    users: "",
    conversion: "",
    monthly: "",
    annual: "",
    accounts: "",
    employees: "",
    employeePrice: "",
    name: "",
    cac: "0",
    onboarding: "0",
    support: "0",
    infrastructure: "0",
    processing: "0",
    review: "0",
    corrections: "0",
    exceptions: "0",
    churn: "",
  });

  useEffect(() => {
    trackProductEvent("pricing_viewed", "consumer");
  }, []);

  function update(key: keyof typeof fields, value: string) {
    if (!started) {
      setStarted(true);
      trackProductEvent("simulator_started", "consumer");
    }
    setFields((current) => ({ ...current, [key]: value }));
    setMessage(null);
  }

  function readRevenue(): { ok: true; input: RevenueInput } | { ok: false; message: string } {
    const users = parseAmount(fields.users);
    const conversion = parseAmount(fields.conversion);
    const monthly = parseAmount(fields.monthly);
    const annual = fields.annual.trim() === "" ? null : parseAmount(fields.annual);
    const accounts = fields.accounts.trim() === "" ? 0 : parseAmount(fields.accounts);
    const employees = fields.employees.trim() === "" ? 0 : parseAmount(fields.employees);
    const employeePrice = fields.employeePrice.trim() === "" ? 0 : parseAmount(fields.employeePrice);
    if (users === null || conversion === null || monthly === null) {
      return { ok: false, message: "Completa usuarios, conversión y precio mensual con números." };
    }
    if (
      [users, conversion, monthly, annual, accounts, employees, employeePrice].some(
        (value) => value !== null && Number.isNaN(value),
      )
    ) {
      return { ok: false, message: "Hay un número que no se pudo leer." };
    }
    if (annual !== null && Number.isNaN(annual)) {
      return { ok: false, message: "El precio anual no se pudo leer." };
    }
    if (accounts === null || employees === null || employeePrice === null) {
      return { ok: false, message: "Hay un número que no se pudo leer." };
    }
    return {
      ok: true,
      input: {
        users,
        conversionPercent: conversion,
        monthlyPrice: monthly,
        annualPrice: annual,
        b2bAccounts: accounts,
        employeesPerAccount: employees,
        pricePerEmployee: employeePrice,
      },
    };
  }

  function readCosts(): CostInput | null {
    const values = [
      fields.cac,
      fields.onboarding,
      fields.support,
      fields.infrastructure,
      fields.processing,
      fields.review,
      fields.corrections,
      fields.exceptions,
    ].map(parseAmount);
    if (values.some((value) => value === null || Number.isNaN(value))) return null;
    const churn = fields.churn.trim() === "" ? null : parseAmount(fields.churn);
    if (churn !== null && Number.isNaN(churn)) return null;
    const [cac, onboardingCost, supportCost, infrastructureCost, paymentProcessing, reviewCost, correctionCost, exceptionCost] =
      values as number[];
    return {
      cac,
      onboardingCost,
      supportCost,
      infrastructureCost,
      paymentProcessing,
      reviewCost,
      correctionCost,
      exceptionCost,
      churnPercent: churn,
    };
  }

  const revenueAttempt = readRevenue();
  const projection = revenueAttempt.ok ? projectRevenue(revenueAttempt.input) : null;
  const costs = advanced ? readCosts() : null;
  const economics =
    projection && projection.ok && costs
      ? projectUnitEconomics(projection.value, revenueAttempt.ok ? revenueAttempt.input.monthlyPrice : 0, costs)
      : null;

  function calculate() {
    if (!revenueAttempt.ok) {
      setMessage(revenueAttempt.message);
      return;
    }
    const result = projectRevenue(revenueAttempt.input);
    if (!result.ok) {
      setMessage(result.message);
      return;
    }
    setMessage(null);
    trackProductEvent("simulator_completed", "consumer");
  }

  function downloadSummary() {
    if (!projection || !projection.ok) return;
    const lines = [
      "PAUSA MX — resumen de escenario",
      "Esto es una proyección del simulador. No es una venta ni un estado financiero.",
      `Usuarios de pago proyectados: ${projection.value.payingUsers}`,
      `MRR individual: ${projection.value.mrr}`,
      `ARR individual: ${projection.value.arr}`,
      `MRR patrocinio (hipótesis): ${projection.value.sponsorMrr}`,
      "Etiquetas: precios ASSUMED. Demanda UNKNOWN. Ninguna cifra es MEASURED.",
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "pausa-escenario.txt";
    link.click();
    URL.revokeObjectURL(url);
  }

  function save() {
    if (!revenueAttempt.ok || !projection || !projection.ok) {
      setSavedNote("Calcula una proyección válida antes de guardar.");
      return;
    }
    const costInput = readCosts() ?? {
      cac: 0,
      onboardingCost: 0,
      supportCost: 0,
      infrastructureCost: 0,
      paymentProcessing: 0,
      reviewCost: 0,
      correctionCost: 0,
      exceptionCost: 0,
      churnPercent: null,
    };
    startTransition(async () => {
      const result = await savePricingScenario({
        name: fields.name,
        segment: revenueAttempt.input.b2bAccounts > 0 ? "sponsor" : "consumer",
        users: revenueAttempt.input.users,
        conversionRate: revenueAttempt.input.conversionPercent,
        monthlyPrice: revenueAttempt.input.monthlyPrice,
        annualPrice: revenueAttempt.input.annualPrice,
        b2bAccounts: revenueAttempt.input.b2bAccounts,
        employeesPerAccount: revenueAttempt.input.employeesPerAccount,
        pricePerEmployee: revenueAttempt.input.pricePerEmployee,
        cac: costInput.cac,
        onboardingCost: costInput.onboardingCost,
        supportCost: costInput.supportCost,
        infrastructureCost: costInput.infrastructureCost,
        paymentProcessing: costInput.paymentProcessing,
        reviewCost: costInput.reviewCost,
        correctionCost: costInput.correctionCost,
        exceptionCost: costInput.exceptionCost,
        churnAssumption: costInput.churnPercent,
      });
      if (!result.ok) {
        setSavedNote(result.message);
        return;
      }
      trackProductEvent("scenario_saved", "saved");
      setSavedNote("Escenario guardado en tu cuenta. No es un pago.");
    });
  }

  return (
    <div className="space-y-10">
      <p className="rounded-xl bg-warning-bg p-4 text-sm text-warning" role="status">
        {PRICING_HYPOTHESIS}
      </p>

      <section className="grid gap-4 lg:grid-cols-3" aria-label="Segmentos y precios">
        {tiers.map((tier) => (
          <article key={tier.id} className="rounded-2xl border border-line bg-card p-5">
            <h2 className="font-display text-2xl text-navy">{tier.name}</h2>
            <p className="mt-2 text-xl text-navy">{tier.price}</p>
            {tier.id !== "free" ? (
              <p className="mt-2 text-sm font-medium text-warning">Precio experimental — aún no validado.</p>
            ) : (
              <p className="mt-2 text-sm text-muted">El resultado esencial no se cobra.</p>
            )}
            <p className="mt-3 text-sm text-muted">Pagador: {tier.payer}</p>
            <p className="mt-1 text-sm text-muted">Duración: {tier.duration}</p>
            <h3 className="mt-4 text-sm font-medium text-navy">Incluye</h3>
            <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-muted">
              {tier.includes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <h3 className="mt-3 text-sm font-medium text-navy">No incluye</h3>
            <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-muted">
              {tier.excludes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <button
              type="button"
              className="mt-4 h-11 rounded-full border border-line px-4 text-sm text-navy"
              aria-pressed={selected === tier.id}
              onClick={() => {
                setSelected(tier.id);
                trackProductEvent(
                  "tier_selected",
                  tier.id === "plus" ? "pausa_plus" : tier.id,
                );
              }}
            >
              {selected === tier.id ? "Tier marcado" : "Marcar este tier"}
            </button>
          </article>
        ))}
      </section>

      <section className="rounded-2xl border border-line bg-card p-5">
        <h2 className="font-display text-2xl text-navy">Gratis y lo que sería de pago</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <h3 className="font-medium text-navy">Gratis, hoy</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-muted">
              <li>Ingresar cifras</li>
              <li>Calcular</li>
              <li>Ver el resultado</li>
              <li>Entender Comprar ahora y Esperar</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-navy">De pago, solo como hipótesis</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-muted">
              <li>Reutilizar un escenario</li>
              <li>Historial</li>
              <li>Escenarios guardados</li>
              <li>Contexto que se repite</li>
            </ul>
          </div>
        </div>
        <p className="mt-4 text-sm text-muted">
          La alternativa gratuita es Mi Pausa. Guardar una evaluación de una compra sigue
          siendo parte de la cuenta, no de estos precios. Ningún botón de esta página cobra.
        </p>
      </section>

      <section className="rounded-2xl border border-line bg-card p-5">
        <h2 className="font-display text-2xl text-navy">Para organizaciones</h2>
        <p className="mt-2 text-sm font-medium text-warning">PILOT HYPOTHESIS</p>
        <p className="mt-2 text-muted">
          Pagador posible: empleador o patrocinador. Usuario posible: empleado. No hay
          clientes ni contratos. El precio por persona en el simulador es ASSUMPTION.
        </p>
      </section>

      <section className="rounded-2xl border border-line bg-card p-5" aria-labelledby="simulator-title">
        <h2 id="simulator-title" className="font-display text-2xl text-navy">
          Simulador de ingresos
        </h2>
        <p className="mt-2 text-sm text-muted">
          Las salidas son aritmética. No son ventas. Cada precio de entrada es ASSUMED.
          La demanda es UNKNOWN.
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <Field label="Usuarios totales" value={fields.users} onChange={(value) => update("users", value)} />
          <Field label="Conversión de pago (%)" value={fields.conversion} onChange={(value) => update("conversion", value)} />
          <Field label="Precio mensual (MXN)" value={fields.monthly} onChange={(value) => update("monthly", value)} />
          <Field label="Precio anual (MXN, opcional)" value={fields.annual} onChange={(value) => update("annual", value)} />
          <Field label="Cuentas B2B (hipótesis)" value={fields.accounts} onChange={(value) => update("accounts", value)} />
          <Field label="Empleados por cuenta" value={fields.employees} onChange={(value) => update("employees", value)} />
          <Field label="Precio por empleado (MXN)" value={fields.employeePrice} onChange={(value) => update("employeePrice", value)} />
        </div>
        <button type="button" className="mt-4 h-12 rounded-full bg-navy px-6 text-white" onClick={calculate}>
          Calcular proyección
        </button>
        {message ? (
          <p className="mt-3 text-sm text-red-800" role="alert">
            {message}
          </p>
        ) : null}
        {projection && projection.ok ? (
          <dl className="mt-4 grid gap-3 text-sm md:grid-cols-2">
            <Stat term="Usuarios de pago" value={String(projection.value.payingUsers)} label="ASSUMED" />
            <Stat term="Usuarios gratis" value={String(projection.value.freeUsers)} label="ASSUMED" />
            <Stat term="MRR" value={money(projection.value.mrr)} label="ASSUMED" />
            <Stat term="ARR" value={money(projection.value.arr)} label="ASSUMED" />
            <Stat term="Ingreso bruto mensual proyectado" value={money(projection.value.projectedGrossRevenueMonthly)} label="ASSUMED" />
            <Stat
              term="Ingreso por usuario"
              value={projection.value.revenuePerUser === null ? "No aplica con 0 usuarios" : money(projection.value.revenuePerUser)}
              label="ASSUMED"
            />
            <Stat
              term="Ingreso si todos pagaran el anual"
              value={projection.value.annualPlanRevenue === null ? "Sin precio anual" : money(projection.value.annualPlanRevenue)}
              label="ASSUMED"
            />
            <Stat term="MRR de patrocinio" value={money(projection.value.sponsorMrr)} label="UNKNOWN" />
          </dl>
        ) : null}
        <button type="button" className="mt-4 text-sm text-teal underline" onClick={downloadSummary} disabled={!projection || !projection.ok}>
          Descargar resumen de este escenario
        </button>
      </section>

      <section className="rounded-2xl border border-line bg-card p-5">
        <h2 className="font-display text-2xl text-navy">Unit economics</h2>
        <p className="mt-2 text-sm text-muted">
          Adquisición, onboarding, soporte, infraestructura, revisión, correcciones y
          excepciones. Si la contribution es negativa, esto no es rentable.
        </p>
        <button type="button" className="mt-3 h-11 rounded-full border border-line px-4 text-sm" onClick={() => setAdvanced((value) => !value)} aria-expanded={advanced}>
          {advanced ? "Ocultar costos supuestos" : "Mostrar costos supuestos"}
        </button>
        {advanced ? (
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <Field label="CAC por pagador (MXN)" value={fields.cac} onChange={(value) => update("cac", value)} />
            <Field label="Onboarding por pagador (MXN)" value={fields.onboarding} onChange={(value) => update("onboarding", value)} />
            <Field label="Soporte mensual por pagador" value={fields.support} onChange={(value) => update("support", value)} />
            <Field label="Infraestructura mensual por pagador" value={fields.infrastructure} onChange={(value) => update("infrastructure", value)} />
            <Field label="Procesamiento de pago mensual" value={fields.processing} onChange={(value) => update("processing", value)} />
            <Field label="Revisión mensual por pagador" value={fields.review} onChange={(value) => update("review", value)} />
            <Field label="Correcciones mensuales por pagador" value={fields.corrections} onChange={(value) => update("corrections", value)} />
            <Field label="Excepciones mensuales por pagador" value={fields.exceptions} onChange={(value) => update("exceptions", value)} />
            <Field label="Churn mensual supuesto (%)" value={fields.churn} onChange={(value) => update("churn", value)} />
          </div>
        ) : null}
        {economics && economics.ok ? (
          <dl className="mt-4 grid gap-3 text-sm md:grid-cols-2">
            <Stat term="Ingreso mensual del tier individual" value={money(economics.value.revenue)} label="ASSUMED" />
            <Stat term="Costo variable mensual" value={money(economics.value.variableCost)} label="ASSUMED" />
            <Stat term="Onboarding, una sola vez" value={money(economics.value.oneTimeOnboarding)} label="ASSUMED" />
            <Stat term="Contribution mensual" value={money(economics.value.contribution)} label="ASSUMED" />
            <Stat
              term="Margen de contribution"
              value={economics.value.contributionMarginPercent === null ? "No aplica" : `${economics.value.contributionMarginPercent.toFixed(1)}%`}
              label="ASSUMED"
            />
            <Stat
              term="Recuperación aproximada del CAC"
              value={economics.value.cacPaybackMonths === null ? "No se recupera con estos supuestos" : `${economics.value.cacPaybackMonths.toFixed(1)} meses`}
              label="UNKNOWN"
            />
          </dl>
        ) : null}
        {economics && !economics.ok ? (
          <p className="mt-3 text-sm text-red-800" role="alert">{economics.message}</p>
        ) : null}
        <p className="mt-3 text-sm text-muted">Ninguna de estas cifras es MEASURED.</p>
      </section>

      <section className="rounded-2xl border border-line bg-card p-5">
        <h2 className="font-display text-2xl text-navy">Guardar escenario</h2>
        <p className="mt-2 text-sm text-muted">
          Guardar no cobra MXN 39 ni MXN 79. Solo deja la proyección en tu cuenta.
        </p>
        {signedIn ? (
          <div className="mt-4 space-y-3">
            <Field label="Nombre del escenario" value={fields.name} onChange={(value) => update("name", value)} />
            <button type="button" className="h-12 rounded-full bg-teal px-6 text-white disabled:opacity-60" disabled={pending} onClick={save}>
              {pending ? "Guardando…" : "Guardar escenario"}
            </button>
          </div>
        ) : (
          <p className="mt-3 text-muted">
            <Link href="/auth" className="text-teal underline">Entra</Link> para guardar. El simulador sigue disponible sin cuenta.
          </p>
        )}
        {savedNote ? <p className="mt-3 text-sm text-navy" role="status">{savedNote}</p> : null}
        {scenarios.length > 0 ? (
          <ul className="mt-4 space-y-2 text-sm">
            {scenarios.map((scenario) => (
              <li key={scenario.id} className="rounded-xl border border-line px-3 py-2">
                {scenario.name} · {scenario.segment === "sponsor" ? "patrocinio" : "individual"} · {scenario.users} usuarios · {scenario.conversionRate}% · {money(scenario.monthlyPrice)}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-muted">Todavía no hay escenarios guardados en esta cuenta.</p>
        )}
      </section>

      <section className="rounded-2xl border border-line bg-card p-5">
        <h2 className="font-display text-2xl text-navy">Interés y rechazo declarados</h2>
        <p className="mt-2 text-sm text-muted">
          Un sí aquí es disposición declarada, no un pago, no un compromiso y no una
          renovación. Una negativa también se registra, sin nombre ni correo.
        </p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <button type="button" className="h-12 rounded-full border border-line px-4" onClick={() => trackProductEvent("pricing_interest", "pausa_plus")}>
            Registrar interés declarado en MXN 79
          </button>
          <button type="button" className="h-12 rounded-full border border-line px-4" onClick={() => trackProductEvent("pricing_interest", "reuse")}>
            Registrar interés declarado en MXN 39
          </button>
        </div>
        <label className="mt-4 flex flex-col gap-1 text-sm font-medium text-navy" htmlFor="rejection-reason">
          Razón de rechazo
          <select id="rejection-reason" className={fieldClass} value={reason} onChange={(event) => setReason(event.target.value as typeof reason)}>
            {rejectionReasons.map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </label>
        <button type="button" className="mt-3 h-12 rounded-full bg-navy px-6 text-white" onClick={() => trackProductEvent("pricing_rejected", reason)}>
          Registrar rechazo declarado
        </button>
      </section>

      <section>
        <h2 className="font-display text-2xl text-navy">Qué estamos probando</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-muted">
          <li>MXN 79 es experimental.</li>
          <li>La suscripción solo seguiría si existiera uso recurrente. Hoy no está medido.</li>
          <li>Si las personas prefieren un pago único, se evaluará MXN 39 como esa prueba.</li>
          <li>Si lo gratis resuelve todo el trabajo, no se forzará una suscripción.</li>
          <li>Si nadie paga, nadie vuelve, la frecuencia es baja o la contribution es negativa, no se rescata el modelo con un descuento.</li>
        </ul>
      </section>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const id = label.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return (
    <label className="flex flex-col gap-1 text-sm font-medium text-navy" htmlFor={id}>
      {label}
      <input id={id} className={fieldClass} inputMode="decimal" value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function Stat({ term, value, label }: { term: string; value: string; label: "ASSUMED" | "UNKNOWN" }) {
  return (
    <div className="rounded-xl bg-background p-3">
      <dt className="text-muted">{term}</dt>
      <dd className="text-base text-navy">{value}</dd>
      <p className="text-xs text-warning">{label}</p>
    </div>
  );
}

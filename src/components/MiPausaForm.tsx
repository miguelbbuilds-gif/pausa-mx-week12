"use client";

import { useMemo, useState, useSyncExternalStore, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ComparisonPanel } from "@/components/ComparisonPanel";
import { AmountField } from "@/components/AmountField";
import {
  evaluatePurchase,
  type PaymentMethod,
  type PurchaseInput,
} from "@/engine";
import { saveEvaluation, type SaveState } from "@/app/actions/evaluations";
import { purchaseFormSchema } from "@/validation/schema";

const emptyForm = {
  availableMoney: "",
  essentialExpenses: "",
  committedPayments: "",
  purchasePrice: "",
  paymentMethod: "full" as PaymentMethod,
  downPayment: "",
  installmentCount: "",
  installmentAmount: "",
};

type FieldErrors = Partial<Record<keyof typeof emptyForm, string>>;

export function MiPausaForm({
  configured,
  signedIn,
  initialValues,
}: {
  configured: boolean;
  signedIn: boolean;
  initialValues?: typeof emptyForm;
}) {
  const router = useRouter();
  const [form, setForm] = useState(initialValues ?? emptyForm);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [saveState, setSaveState] = useState<SaveState>({ status: "idle" });
  const [pending, startTransition] = useTransition();
  const [submitted, setSubmitted] = useState(Boolean(initialValues));
  const hydrated = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  function update<K extends keyof typeof emptyForm>(key: K, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  const parsed = useMemo(
    () =>
      purchaseFormSchema.safeParse({
        ...form,
        installmentCount:
          form.installmentCount === "" ? undefined : form.installmentCount,
      }),
    [form],
  );

  const engineInput: PurchaseInput | null = parsed.success
    ? {
        availableMoney: parsed.data.availableMoney,
        essentialExpenses: parsed.data.essentialExpenses,
        committedPayments: parsed.data.committedPayments,
        purchasePrice: parsed.data.purchasePrice,
        paymentMethod: parsed.data.paymentMethod,
        downPayment: parsed.data.downPayment,
        installmentCount: parsed.data.installmentCount,
        installmentAmount: parsed.data.installmentAmount,
      }
    : null;

  const result = engineInput ? evaluatePurchase(engineInput) : null;

  function onEvaluate(event: React.FormEvent) {
    event.preventDefault();
    setSubmitted(true);
    setSaveState({ status: "idle" });
    if (!parsed.success) {
      const next: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0];
        if (typeof key === "string" && !(key in next)) {
          next[key as keyof FieldErrors] = issue.message;
        }
      }
      setFieldErrors(next);
      return;
    }
    setFieldErrors({});
  }

  function onSave() {
    if (!engineInput || !result?.ok) {
      onEvaluate({ preventDefault() {} } as React.FormEvent);
      return;
    }
    startTransition(async () => {
      const outcome = await saveEvaluation(engineInput);
      setSaveState(outcome);
      if (outcome.status === "saved") {
        router.refresh();
      }
    });
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <form
        onSubmit={onEvaluate}
        data-hydrated={hydrated ? "true" : "false"}
        className="space-y-6 rounded-2xl border border-line bg-card p-5"
      >
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-teal">
            Paso 1
          </p>
          <h2 className="font-display text-2xl text-navy">Tu dinero y lo ya comprometido</h2>
        </div>
        <AmountField
          id="availableMoney"
          label="Dinero disponible"
          hint="Lo que puedes usar en este momento, no un ingreso futuro."
          value={form.availableMoney}
          onChange={(value) => update("availableMoney", value)}
          error={submitted ? fieldErrors.availableMoney : undefined}
        />
        <AmountField
          id="essentialExpenses"
          label="Gastos esenciales próximos"
          hint="Renta, comida, transporte u otros indispensables de este periodo."
          value={form.essentialExpenses}
          onChange={(value) => update("essentialExpenses", value)}
          error={submitted ? fieldErrors.essentialExpenses : undefined}
        />
        <AmountField
          id="committedPayments"
          label="Otros pagos ya comprometidos"
          hint="Mensualidades u obligaciones que ya prometiste, aparte de esta compra."
          value={form.committedPayments}
          onChange={(value) => update("committedPayments", value)}
          error={submitted ? fieldErrors.committedPayments : undefined}
        />

        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-teal">
            Paso 2
          </p>
          <h2 className="font-display text-2xl text-navy">La compra que estás viendo</h2>
        </div>
        <AmountField
          id="purchasePrice"
          label="Precio de contado"
          value={form.purchasePrice}
          onChange={(value) => update("purchasePrice", value)}
          error={submitted ? fieldErrors.purchasePrice : undefined}
        />

        <fieldset className="space-y-3">
          <legend className="text-sm font-medium text-navy">Forma de pago</legend>
          <label className="flex min-h-12 items-center gap-3 rounded-xl border border-line bg-white px-3">
            <input
              type="radio"
              name="paymentMethod"
              checked={form.paymentMethod === "full"}
              onChange={() =>
                setForm((current) => ({ ...current, paymentMethod: "full" }))
              }
            />
            <span>De contado</span>
          </label>
          <label className="flex min-h-12 items-center gap-3 rounded-xl border border-line bg-white px-3">
            <input
              type="radio"
              name="paymentMethod"
              checked={form.paymentMethod === "installments"}
              onChange={() =>
                setForm((current) => ({
                  ...current,
                  paymentMethod: "installments",
                }))
              }
            />
            <span>A meses (con los datos del ticket o de la tienda)</span>
          </label>
        </fieldset>

        {form.paymentMethod === "installments" ? (
          <div className="space-y-4 rounded-xl bg-background p-4">
            <p className="text-sm text-muted">
              Escribe el enganche, cuántas mensualidades y el monto de cada una
              tal como aparecen. PAUSA MX no inventa intereses ni plazos.
            </p>
            <AmountField
              id="downPayment"
              label="Enganche (costo inmediato)"
              hint="Si no hay enganche, escribe 0."
              value={form.downPayment}
              onChange={(value) => update("downPayment", value)}
              error={submitted ? fieldErrors.downPayment : undefined}
            />
            <AmountField
              id="installmentCount"
              label="Número de mensualidades"
              suffix="pagos"
              value={form.installmentCount}
              onChange={(value) => update("installmentCount", value)}
              error={submitted ? fieldErrors.installmentCount : undefined}
            />
            <AmountField
              id="installmentAmount"
              label="Monto de cada mensualidad"
              value={form.installmentAmount}
              onChange={(value) => update("installmentAmount", value)}
              error={submitted ? fieldErrors.installmentAmount : undefined}
            />
          </div>
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="submit"
            className="h-12 rounded-full bg-teal px-6 text-base font-medium text-white hover:bg-teal-dark"
          >
            Ver comparación
          </button>
          <button
            type="button"
            onClick={onSave}
            disabled={pending}
            className="h-12 rounded-full border border-navy px-6 text-base font-medium text-navy hover:bg-navy hover:text-white disabled:opacity-60"
          >
            {pending ? "Guardando…" : "Guardar evaluación"}
          </button>
        </div>

        <p className="text-sm text-muted">
          La comparación se calcula en tu dispositivo. Guardar sí envía estos
          números a tu cuenta, solo si iniciaste sesión.
        </p>
        <SaveFeedback
          state={saveState}
          configured={configured}
          signedIn={signedIn}
        />
      </form>

      <div className="space-y-4">
        <p className="text-sm font-medium uppercase tracking-wide text-teal">
          Paso 3
        </p>
        {submitted && result ? (
          <ComparisonPanel result={result} />
        ) : (
          <div className="rounded-2xl border border-dashed border-line bg-card p-5 text-muted">
            Completa los pasos 1 y 2 y pulsa «Ver comparación». Mientras no
            guardes, estos montos no se envían al servidor.
          </div>
        )}
      </div>
    </div>
  );
}

function SaveFeedback({
  state,
  configured,
  signedIn,
}: {
  state: SaveState;
  configured: boolean;
  signedIn: boolean;
}) {
  if (!configured) {
    return (
      <p className="rounded-xl bg-warning-bg p-3 text-sm text-warning" role="status">
        El guardado real no está activo en este entorno: faltan las claves
        públicas de Supabase. Puedes comparar aquí (los montos no se envían).
        No se usa el almacenamiento local del navegador. Pasos: crear el
        proyecto, correr la migración SQL, pegar URL y anon key en{" "}
        <code className="font-mono">.env.local</code> y en Vercel. Guía:{" "}
        <code className="font-mono">supabase/SETUP.md</code>.
      </p>
    );
  }

  if (state.status === "unauthenticated" || (!signedIn && state.status === "idle")) {
    if (state.status === "unauthenticated") {
      return (
        <p className="rounded-xl bg-warning-bg p-3 text-sm text-warning" role="status">
          Para guardar necesitas entrar con Google. La comparación sigue en
          pantalla y no se almacenó.
        </p>
      );
    }
    return (
      <p className="text-sm text-muted">
        Entra con Google cuando quieras guardar. Sin cuenta, esto es solo una
        vista previa.
      </p>
    );
  }

  if (state.status === "saved") {
    return (
      <p className="text-sm text-teal" role="status">
        Evaluación guardada. Puedes reabrirla en la lista de abajo.
      </p>
    );
  }
  if (state.status === "invalid" || state.status === "error" || state.status === "unconfigured") {
    return (
      <p className="text-sm text-red-800" role="status">
        {state.status === "unconfigured"
          ? "Supabase no está configurado en el servidor."
          : state.message}
      </p>
    );
  }
  return null;
}

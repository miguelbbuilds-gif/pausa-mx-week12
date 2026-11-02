"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { formatMxn } from "@/engine";
import type { EvaluationResult, PurchaseInput } from "@/engine";
import { deleteEvaluation } from "@/app/actions/evaluations";

export type SavedRow = {
  id: string;
  title: string | null;
  inputs: PurchaseInput;
  result: EvaluationResult;
  created_at: string;
};

export function SavedEvaluations({
  rows,
  signedIn,
  configured,
  onReopen,
}: {
  rows: SavedRow[];
  signedIn: boolean;
  configured: boolean;
  onReopen?: (inputs: PurchaseInput) => void;
}) {
  const router = useRouter();
  const [openId, setOpenId] = useState<string | null>(rows[0]?.id ?? null);

  if (!configured) {
    return null;
  }

  if (!signedIn) {
    return (
      <section className="mt-10 rounded-2xl border border-line bg-card p-5">
        <h2 className="font-display text-2xl text-navy">Evaluaciones guardadas</h2>
        <p className="mt-2 text-muted">
          Entra con correo y contraseña para ver las que hayas guardado. Nadie
          más puede leerlas.
        </p>
      </section>
    );
  }

  return (
    <section className="mt-10 rounded-2xl border border-line bg-card p-5">
      <h2 className="font-display text-2xl text-navy">Tus evaluaciones</h2>
      {rows.length === 0 ? (
        <p className="mt-2 text-muted">Aún no hay evaluaciones guardadas.</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {rows.map((row) => {
            const remaining = row.result.remainingAfterImmediate;
            const opened = openId === row.id;
            return (
              <li key={row.id} className="rounded-xl border border-line bg-white p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <button
                    type="button"
                    className="text-left"
                    onClick={() => setOpenId(opened ? null : row.id)}
                  >
                    <p className="font-medium text-navy">
                      {row.title ?? "Evaluación"} ·{" "}
                      {new Date(row.created_at).toLocaleString("es-MX")}
                    </p>
                    <p className="text-sm text-muted">
                      Precio {formatMxn(row.inputs.purchasePrice)}
                      {remaining !== null
                        ? ` · quedarían ${formatMxn(remaining)} al comprar ahora`
                        : null}
                    </p>
                  </button>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      className="text-sm text-navy underline"
                      onClick={() => {
                        onReopen?.(row.inputs);
                        setOpenId(row.id);
                      }}
                    >
                      Reabrir
                    </button>
                    <button
                      type="button"
                      className="text-sm text-muted underline"
                      onClick={async () => {
                        await deleteEvaluation(row.id);
                        router.refresh();
                      }}
                    >
                      Borrar
                    </button>
                  </div>
                </div>
                {opened ? (
                  <div className="mt-4 space-y-2 text-sm text-navy">
                    <p>{row.result.explanation}</p>
                    {row.result.comparison ? (
                      <p>
                        Comprar ahora: {formatMxn(row.result.comparison.buyNow.remainingAfterImmediate)}{" "}
                        restantes. Esperar:{" "}
                        {formatMxn(row.result.comparison.wait.remainingAfterImmediate)} restantes.
                      </p>
                    ) : null}
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

"use client";

import { useState } from "react";
import { MiPausaForm } from "@/components/MiPausaForm";
import {
  SavedEvaluations,
  type SavedRow,
} from "@/components/SavedEvaluations";
import type { PurchaseInput } from "@/engine";

function inputsToForm(inputs: PurchaseInput) {
  return {
    availableMoney: String(inputs.availableMoney),
    essentialExpenses: String(inputs.essentialExpenses),
    committedPayments: String(inputs.committedPayments),
    purchasePrice: String(inputs.purchasePrice),
    paymentMethod: inputs.paymentMethod,
    downPayment:
      inputs.downPayment === undefined ? "" : String(inputs.downPayment),
    installmentCount:
      inputs.installmentCount === undefined
        ? ""
        : String(inputs.installmentCount),
    installmentAmount:
      inputs.installmentAmount === undefined
        ? ""
        : String(inputs.installmentAmount),
  };
}

export function ProductWorkspace({
  configured,
  signedIn,
  rows,
}: {
  configured: boolean;
  signedIn: boolean;
  rows: SavedRow[];
}) {
  const [draft, setDraft] = useState<ReturnType<typeof inputsToForm> | null>(
    null,
  );
  const [draftKey, setDraftKey] = useState(0);

  return (
    <>
      <MiPausaForm
        key={draftKey}
        configured={configured}
        signedIn={signedIn}
        initialValues={draft ?? undefined}
      />
      <SavedEvaluations
        configured={configured}
        signedIn={signedIn}
        rows={rows}
        onReopen={(inputs) => {
          setDraft(inputsToForm(inputs));
          setDraftKey((value) => value + 1);
        }}
      />
    </>
  );
}

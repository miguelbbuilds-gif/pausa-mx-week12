import { z } from "zod";
import { MAX_INSTALLMENTS, MAX_MXN, MIN_INSTALLMENTS } from "@/engine/money";

const amountNumber = z
  .number({
    required_error: "Escribe un número.",
    invalid_type_error: "Escribe un número válido.",
  })
  .finite({ message: "Escribe un número válido." })
  .min(0, { message: "No uses cantidades negativas." })
  .max(MAX_MXN, { message: "El máximo es $10,000,000.00 MXN." });

function parseAmount(value: unknown) {
  if (value === "" || value === null || value === undefined) return undefined;
  if (typeof value === "string") {
    const normalized = value.replace(/,/g, "").trim();
    if (normalized === "") return undefined;
    return Number(normalized);
  }
  return value;
}

const amount = z.preprocess(parseAmount, amountNumber);

function optionalAmount() {
  return z.preprocess((value) => {
    if (value === "" || value === undefined || value === null) return undefined;
    return value;
  }, amount.optional());
}

function optionalCount() {
  return z.preprocess(
    (value) => {
      if (value === "" || value === undefined || value === null) return undefined;
      return value;
    },
    z.coerce
      .number({ invalid_type_error: "Las mensualidades deben ser un número." })
      .int({ message: "Las mensualidades deben ser un número entero." })
      .min(MIN_INSTALLMENTS, {
        message: `Usa entre ${MIN_INSTALLMENTS} y ${MAX_INSTALLMENTS} mensualidades.`,
      })
      .max(MAX_INSTALLMENTS, {
        message: `Usa entre ${MIN_INSTALLMENTS} y ${MAX_INSTALLMENTS} mensualidades.`,
      })
      .optional(),
  );
}

export const purchaseFormSchema = z
  .object({
    availableMoney: amount,
    essentialExpenses: amount,
    committedPayments: amount,
    purchasePrice: amount,
    paymentMethod: z.enum(["full", "installments"], {
      required_error: "Elige contado o meses.",
      invalid_type_error: "Elige contado o meses.",
    }),
    downPayment: optionalAmount(),
    installmentCount: optionalCount(),
    installmentAmount: optionalAmount(),
  })
  .superRefine((data, ctx) => {
    if (data.paymentMethod === "installments") {
      if (data.downPayment === undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["downPayment"],
          message: "Escribe el enganche. Si no hay, pon 0.",
        });
      }
      if (data.installmentCount === undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["installmentCount"],
          message: "Escribe cuántas mensualidades son.",
        });
      }
      if (data.installmentAmount === undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["installmentAmount"],
          message: "Escribe el monto de cada mensualidad. No se calcula solo.",
        });
      }
    }
  });

export type PurchaseFormValues = z.output<typeof purchaseFormSchema>;

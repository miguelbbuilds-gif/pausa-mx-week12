/** Integer-cent helpers so MXN arithmetic stays consistent. */

export const MAX_MXN = 10_000_000;
export const MAX_CENTS = MAX_MXN * 100;
export const MIN_INSTALLMENTS = 2;
export const MAX_INSTALLMENTS = 60;

export function toCents(mxn: number): number {
  if (!Number.isFinite(mxn)) {
    throw new RangeError("non_finite");
  }
  // Avoid mxn * 100 binary drift (1.005 * 100 === 100.4999…). Half-up on the
  // decimal string of pesos, then parse an integer cent amount.
  const negative = mxn < 0;
  const [whole, fraction = ""] = Math.abs(mxn).toFixed(3).split(".");
  const firstTwo = (fraction + "000").slice(0, 2);
  const third = Number((fraction + "000").slice(2, 3));
  let cents = Number(whole) * 100 + Number(firstTwo);
  if (third >= 5) {
    cents += 1;
  }
  return negative ? -cents : cents;
}

export function fromCents(cents: number): number {
  return cents / 100;
}

export function formatMxn(mxn: number): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(mxn);
}

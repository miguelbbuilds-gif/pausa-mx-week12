type AmountFieldProps = {
  id: string;
  label: string;
  hint?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  suffix?: string;
};

export function AmountField({
  id,
  label,
  hint,
  value,
  onChange,
  error,
  suffix = "MXN",
}: AmountFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-navy">
        {label}
      </label>
      {hint ? (
        <p id={`${id}-hint`} className="text-sm text-muted">
          {hint}
        </p>
      ) : null}
      <div className="relative">
        <input
          id={id}
          name={id}
          inputMode="decimal"
          autoComplete="off"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-invalid={Boolean(error)}
          aria-describedby={
            [error ? `${id}-error` : null, hint ? `${id}-hint` : null]
              .filter(Boolean)
              .join(" ") || undefined
          }
          className="h-12 w-full rounded-xl border border-line bg-white px-3 pr-16 text-base text-navy outline-none focus:border-teal focus:ring-2 focus:ring-teal/30"
        />
        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-muted">
          {suffix}
        </span>
      </div>
      {error ? (
        <p id={`${id}-error`} className="text-sm text-red-800" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

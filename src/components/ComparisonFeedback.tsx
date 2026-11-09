"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { submitComparisonFeedback } from "@/app/actions/feedback";
import { trackProductEvent } from "@/lib/analytics/track";
import { getAnonymousSessionId } from "@/lib/analytics/session";
import { FEEDBACK_MAX_CHARS, feedbackSchema } from "@/validation/feedback";

export function ComparisonFeedback() {
  const [comment, setComment] = useState("");
  const [wouldReturn, setWouldReturn] = useState<"" | "yes" | "maybe" | "no">("");
  const [company, setCompany] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [pending, startTransition] = useTransition();
  const openedAt = useRef<number | null>(null);
  useEffect(() => {
    openedAt.current = performance.now();
  }, []);

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    const sessionId = getAnonymousSessionId();
    const parsed = feedbackSchema.safeParse({
      sessionId,
      confusingPart: comment,
      wouldReturn: wouldReturn || undefined,
      company,
    });
    if (!parsed.success) {
      const rejected = parsed.error.issues.some((issue) => issue.message === "rejected");
      setError(
        rejected
          ? "No se pudo enviar."
          : (parsed.error.issues[0]?.message ?? "Revisa el comentario."),
      );
      return;
    }
    if (openedAt.current === null || performance.now() - openedAt.current < 1500) {
      setError("Espera un momento antes de enviar.");
      return;
    }
    startTransition(async () => {
      const result = await submitComparisonFeedback({
        sessionId: parsed.data.sessionId,
        confusingPart: parsed.data.confusingPart,
        wouldReturn: parsed.data.wouldReturn,
        company: parsed.data.company,
      });
      if (result.ok) {
        trackProductEvent("feedback_submitted", "ok");
        setDone(true);
        setComment("");
        setWouldReturn("");
        return;
      }
      setError(result.message);
    });
  }

  if (done) {
    return (
      <p className="rounded-2xl border border-teal/40 bg-card p-5 text-navy" role="status">
        Recibimos tu comentario. Gracias. No hace falta tu nombre.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-line bg-card p-5">
      <div>
        <label htmlFor="confusingPart" className="font-medium text-navy">
          ¿Qué parte de esta comparación te resultó confusa?
        </label>
        <p className="mt-1 text-sm text-muted">
          Opcional. No escribas tu nombre, correo ni cantidades que no quieras
          compartir. El comentario puede usarse para mejorar el producto.
        </p>
        <textarea
          id="confusingPart"
          name="confusingPart"
          value={comment}
          maxLength={FEEDBACK_MAX_CHARS}
          rows={3}
          onChange={(event) => setComment(event.target.value)}
          className="mt-2 w-full rounded-xl border border-line bg-white px-3 py-2 text-base text-navy outline-none focus:border-teal focus:ring-2 focus:ring-teal/30"
        />
        <p className="mt-1 text-right text-xs text-muted">
          {comment.length}/{FEEDBACK_MAX_CHARS}
        </p>
      </div>

      <fieldset className="space-y-2">
        <legend className="font-medium text-navy">¿Volverías a usar PAUSA MX?</legend>
        <p className="text-sm text-muted">Opcional. No es una calificación de ti.</p>
        <div className="flex flex-col gap-2 sm:flex-row">
          {(
            [
              ["yes", "Sí"],
              ["maybe", "Tal vez"],
              ["no", "No"],
            ] as const
          ).map(([value, label]) => (
            <label
              key={value}
              className="flex min-h-12 flex-1 items-center gap-2 rounded-xl border border-line bg-white px-3"
            >
              <input
                type="radio"
                name="wouldReturn"
                value={value}
                checked={wouldReturn === value}
                onChange={() => setWouldReturn(value)}
              />
              <span>{label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="absolute left-[-9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
        <label htmlFor="company">Empresa</label>
        <input
          id="company"
          name="company"
          tabIndex={-1}
          autoComplete="off"
          value={company}
          onChange={(event) => setCompany(event.target.value)}
        />
      </div>

      {error ? (
        <p className="text-sm text-red-800" role="alert">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        aria-busy={pending}
        className="h-12 rounded-full bg-navy px-6 text-base font-medium text-white hover:bg-teal-dark disabled:opacity-60"
      >
        {pending ? "Enviando…" : "Enviar comentario"}
      </button>
    </form>
  );
}

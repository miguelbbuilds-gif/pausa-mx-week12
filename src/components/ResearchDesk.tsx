"use client";

import { useState, useTransition } from "react";
import {
  createResearchSession,
  saveResearchPriority,
  type ResearchAccess,
} from "@/app/actions/research";

type FounderDesk = Extract<ResearchAccess, { status: "founder" }>;

export function ResearchDesk({ desk }: { desk: FounderDesk }) {
  return (
    <div className="mt-8 space-y-10">
      <section className="rounded-2xl border border-line bg-card p-5">
        <h2 className="font-display text-2xl text-navy">Señales sin montos</h2>
        <p className="mt-2 text-sm text-muted">
          Conteos de eventos. No hay cantidades, correos ni identificadores de sesión en esta lista.
          {desk.eventCounts.length === 0
            ? " Todavía no hay eventos guardados, o la migración aún no recibió ninguno."
            : ""}
        </p>
        <ul className="mt-4 space-y-1 text-sm">
          {desk.eventCounts.map((item) => (
            <li key={item.eventName}>
              {item.eventName}: {item.count}
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-line bg-card p-5">
        <h2 className="font-display text-2xl text-navy">Comentarios</h2>
        {desk.feedback.length === 0 ? (
          <p className="mt-2 text-sm text-muted">No hay comentarios guardados.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {desk.feedback.map((item) => (
              <li key={item.id} className="border-b border-line pb-3 text-sm">
                <p className="text-navy">{item.confusingPart || "Sin comentario de texto."}</p>
                <p className="mt-1 text-muted">
                  Volvería: {labelReturn(item.wouldReturn)} ·{" "}
                  {item.signedIn ? "con sesión" : "sin sesión"} ·{" "}
                  {new Date(item.createdAt).toLocaleString("es-MX")}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <SessionForm />

      <section>
        <h2 className="font-display text-2xl text-navy">Sesiones registradas</h2>
        <p className="mt-2 text-sm text-muted">
          Sesiones reales verificadas: {desk.verifiedRealSessions}. Las filas DEMO no cuentan como personas.
        </p>
        {desk.sessions.length === 0 ? (
          <p className="mt-3 text-sm text-muted">
            No hay sesiones. Esta pantalla no inventa citas ni marca sesiones como hechas.
          </p>
        ) : (
          <ul className="mt-4 space-y-4">
            {desk.sessions.map((session) => (
              <li key={session.id} className="rounded-2xl border border-line bg-card p-4 text-sm">
                <p className="font-medium text-navy">
                  {session.sessionCode}
                  {session.isDemo ? " · DEMO" : ""} · {session.relationship === "unknown" ? "desconocido" : "conocido"} ·{" "}
                  {session.verificationStatus === "verified" ? "verificada" : "sin verificar"} · {session.severity}
                </p>
                <p className="mt-1 text-muted">{session.participantRole} · {session.sessionDate}</p>
                <p className="mt-2">{session.observedDifficulty}</p>
                <blockquote className="mt-2 border-l-2 border-teal pl-3 text-navy">
                  {session.verbatimQuote}
                </blockquote>
                <p className="mt-2 text-muted">Evidencia: {session.evidenceRef}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <PriorityForm canPrioritize={desk.canPrioritize} priorities={desk.priorities} />
    </div>
  );
}

function SessionForm() {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    setError(null);
    setMessage(null);
    startTransition(async () => {
      const result = await createResearchSession({
        sessionCode: form.get("sessionCode"),
        participantRole: form.get("participantRole"),
        relationship: form.get("relationship"),
        sessionDate: form.get("sessionDate"),
        taskAttempted: form.get("taskAttempted"),
        observedDifficulty: form.get("observedDifficulty"),
        verbatimQuote: form.get("verbatimQuote"),
        severity: form.get("severity"),
        evidenceRef: form.get("evidenceRef"),
        consentRecorded: form.get("consentRecorded") === "on",
        verificationStatus: form.get("verificationStatus"),
        isDemo: form.get("isDemo") === "on",
      });
      if (!result.ok) {
        setError(result.message);
        return;
      }
      setMessage("Sesión registrada.");
      formElement.reset();
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-line bg-card p-5">
      <h2 className="font-display text-2xl text-navy">Registrar sesión seudónima</h2>
      <p className="text-sm text-muted">
        Solo después de una observación real. No escribas nombre, correo ni una cita que no hayas escuchado.
      </p>
      <Field id="sessionCode" label="Identificador de sesión" />
      <Field id="participantRole" label="Rol general del participante" />
      <label className="flex flex-col gap-1 text-sm font-medium text-navy">
        Relación
        <select name="relationship" className="h-12 rounded-xl border border-line bg-white px-3 font-normal" defaultValue="unknown">
          <option value="unknown">Desconocido</option>
          <option value="known">Conocido</option>
        </select>
      </label>
      <label className="flex flex-col gap-1 text-sm font-medium text-navy">
        Fecha
        <input name="sessionDate" type="date" required className="h-12 rounded-xl border border-line bg-white px-3 font-normal" />
      </label>
      <Field id="taskAttempted" label="Tarea intentada" />
      <Field id="observedDifficulty" label="Dificultad observada" />
      <label className="flex flex-col gap-1 text-sm font-medium text-navy">
        Cita textual exacta
        <textarea name="verbatimQuote" required maxLength={1000} rows={3} className="rounded-xl border border-line bg-white px-3 py-2 font-normal" />
      </label>
      <label className="flex flex-col gap-1 text-sm font-medium text-navy">
        Severidad
        <select name="severity" className="h-12 rounded-xl border border-line bg-white px-3 font-normal" defaultValue="medium">
          <option value="low">Baja</option>
          <option value="medium">Media</option>
          <option value="high">Alta</option>
          <option value="critical">Crítica</option>
        </select>
      </label>
      <Field id="evidenceRef" label="Referencia a evidencia" />
      <label className="flex flex-col gap-1 text-sm font-medium text-navy">
        Estado de verificación
        <select name="verificationStatus" className="h-12 rounded-xl border border-line bg-white px-3 font-normal" defaultValue="unverified">
          <option value="unverified">Sin verificar</option>
          <option value="verified">Verificada, con evidencia</option>
        </select>
      </label>
      <label className="flex min-h-12 items-start gap-3 text-sm text-navy">
        <input name="consentRecorded" type="checkbox" className="mt-1" required />
        <span>Hay consentimiento documentado para registrar esta observación, sin publicar su identidad.</span>
      </label>
      <label className="flex min-h-12 items-start gap-3 text-sm text-navy">
        <input name="isDemo" type="checkbox" className="mt-1" />
        <span>DEMO. Esta fila es sintética de prueba y no es una persona real.</span>
      </label>
      {error ? <p className="text-sm text-red-800" role="alert">{error}</p> : null}
      {message ? <p className="text-sm text-teal" role="status">{message}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="h-12 rounded-full bg-teal px-6 font-medium text-white disabled:opacity-60"
      >
        {pending ? "Guardando…" : "Registrar sesión"}
      </button>
    </form>
  );
}

function PriorityForm({
  canPrioritize,
  priorities,
}: {
  canPrioritize: boolean;
  priorities: FounderDesk["priorities"];
}) {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setError(null);
    setMessage(null);
    startTransition(async () => {
      const result = await saveResearchPriority({
        rank: form.get("rank"),
        title: form.get("title"),
        summary: form.get("summary"),
        isDemo: form.get("isDemo") === "on",
      });
      if (!result.ok) {
        setError(result.message);
        return;
      }
      setMessage("Prioridad guardada.");
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-line bg-card p-5">
      <h2 className="font-display text-2xl text-navy">Tres problemas principales</h2>
      <p className="text-sm text-muted">
        Una prioridad real solo se guarda cuando hay cinco sesiones verificadas y no DEMO.
        Hoy {canPrioritize ? "sí se puede priorizar con evidencia." : "esa condición no se cumple, así que no hay problema humano #1."}
      </p>
      {priorities.length > 0 ? (
        <ol className="list-decimal space-y-2 pl-5 text-sm">
          {priorities.map((item) => (
            <li key={item.rank}>
              {item.title}
              {item.isDemo ? " (DEMO)" : ""} — {item.summary}
            </li>
          ))}
        </ol>
      ) : (
        <p className="text-sm text-muted">No hay problemas priorizados.</p>
      )}
      <label className="flex flex-col gap-1 text-sm font-medium text-navy">
        Lugar
        <select name="rank" className="h-12 rounded-xl border border-line bg-white px-3 font-normal" defaultValue="1">
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </select>
      </label>
      <Field id="title" label="Problema" />
      <label className="flex flex-col gap-1 text-sm font-medium text-navy">
        Por qué importa
        <textarea name="summary" required minLength={3} maxLength={800} rows={3} className="rounded-xl border border-line bg-white px-3 py-2 font-normal" />
      </label>
      <label className="flex items-start gap-3 text-sm text-navy">
        <input name="isDemo" type="checkbox" className="mt-1" />
        <span>DEMO. No usar esta casilla para simular el problema humano #1.</span>
      </label>
      {error ? <p className="text-sm text-red-800" role="alert">{error}</p> : null}
      {message ? <p className="text-sm text-teal" role="status">{message}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="h-12 rounded-full border border-navy px-6 font-medium text-navy disabled:opacity-60"
      >
        {pending ? "Guardando…" : "Guardar prioridad"}
      </button>
    </form>
  );
}

function Field({ id, label }: { id: string; label: string }) {
  return (
    <label htmlFor={id} className="flex flex-col gap-1 text-sm font-medium text-navy">
      {label}
      <input
        id={id}
        name={id}
        required
        maxLength={id === "sessionCode" ? 40 : 300}
        className="h-12 rounded-xl border border-line bg-white px-3 font-normal"
      />
    </label>
  );
}

function labelReturn(value: "yes" | "maybe" | "no" | null) {
  if (value === "yes") return "sí";
  if (value === "maybe") return "tal vez";
  if (value === "no") return "no";
  return "sin respuesta";
}

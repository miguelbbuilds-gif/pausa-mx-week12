"use client";

import { useActionState, useState } from "react";
import {
  signInAction,
  signInWithGoogleAction,
  signUpAction,
  type AuthFormState,
} from "@/app/actions/auth";

const initial: AuthFormState = {};

const inputClass =
  "h-12 w-full rounded-xl border border-line bg-white px-3 text-base text-navy outline-none focus:border-teal focus:ring-2 focus:ring-teal/30";

export function AuthForm() {
  const [mode, setMode] = useState<"signup" | "signin">("signup");
  const [signUpState, signUpFormAction, signingUp] = useActionState(
    signUpAction,
    initial,
  );
  const [signInState, signInFormAction, signingIn] = useActionState(
    signInAction,
    initial,
  );

  const state = mode === "signup" ? signUpState : signInState;
  const pending = mode === "signup" ? signingUp : signingIn;

  return (
    <div className="rounded-2xl border border-line bg-card p-5">
      <div className="flex gap-2">
        <button
          type="button"
          className={`h-10 rounded-full px-4 text-sm ${
            mode === "signup"
              ? "bg-navy text-white"
              : "border border-line text-navy"
          }`}
          onClick={() => setMode("signup")}
        >
          Crear cuenta
        </button>
        <button
          type="button"
          className={`h-10 rounded-full px-4 text-sm ${
            mode === "signin"
              ? "bg-navy text-white"
              : "border border-line text-navy"
          }`}
          onClick={() => setMode("signin")}
        >
          Entrar
        </button>
      </div>

      <form
        key={mode}
        action={mode === "signup" ? signUpFormAction : signInFormAction}
        className="mt-6 space-y-4"
      >
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-sm font-medium text-navy">
            Correo
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className={inputClass}
            aria-invalid={Boolean(state.fieldErrors?.email)}
            aria-describedby={state.fieldErrors?.email ? "email-error" : undefined}
          />
          {state.fieldErrors?.email ? (
            <p id="email-error" className="text-sm text-red-800">
              {state.fieldErrors.email}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="password" className="text-sm font-medium text-navy">
            Contraseña
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
            required
            minLength={8}
            className={inputClass}
            aria-invalid={Boolean(state.fieldErrors?.password)}
            aria-describedby={
              state.fieldErrors?.password ? "password-error" : undefined
            }
          />
          {state.fieldErrors?.password ? (
            <p id="password-error" className="text-sm text-red-800">
              {state.fieldErrors.password}
            </p>
          ) : null}
        </div>

        {mode === "signup" ? (
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="confirmPassword"
              className="text-sm font-medium text-navy"
            >
              Confirmar contraseña
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              className={inputClass}
              aria-invalid={Boolean(state.fieldErrors?.confirmPassword)}
              aria-describedby={
                state.fieldErrors?.confirmPassword
                  ? "confirmPassword-error"
                  : undefined
              }
            />
            {state.fieldErrors?.confirmPassword ? (
              <p id="confirmPassword-error" className="text-sm text-red-800">
                {state.fieldErrors.confirmPassword}
              </p>
            ) : null}
          </div>
        ) : null}

        {state.error ? (
          <p className="rounded-xl bg-warning-bg p-3 text-sm text-warning" role="alert">
            {state.error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={pending}
          className="h-12 w-full rounded-full bg-teal px-6 text-base font-medium text-white hover:bg-teal-dark disabled:opacity-60"
        >
          {pending
            ? "Un momento…"
            : mode === "signup"
              ? "Crear cuenta"
              : "Entrar"}
        </button>
      </form>

      <form action={signInWithGoogleAction} className="mt-4 space-y-3">
        <button
          type="submit"
          className="h-12 w-full rounded-full border border-line bg-white px-6 text-base font-medium text-navy hover:border-teal"
        >
          Continuar con Google
        </button>
        <p className="text-sm leading-relaxed text-muted">
          Correo y contraseña siguen disponibles. Google usa el mismo inicio de
          sesión de Supabase. Si el proveedor todavía no está activo, este botón
          regresa aquí sin crear una sesión.
        </p>
      </form>
    </div>
  );
}

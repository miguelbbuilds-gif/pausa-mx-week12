# Auditoría de seguridad — PAUSA MX Week 13

Fecha de esta pasada: 2026-11-08, noche local. Proyecto Supabase `xrpbbmdossmlbstjrlta`. No se imprimieron llaves ni correos de usuarios reales, salvo comprobar que `miguelb.builds@gmail.com` no existe en `auth.users`.

Estados usados: PASS, FAIL, PENDING.

| Requisito | Estado | Evidencia |
| --- | --- | --- |
| Cero secretos en GitHub | PASS | `git grep` de `service_role`, `SUPABASE_SERVICE_ROLE`, `eyJhbGciOi`, `sk_live`, `BEGIN PRIVATE KEY` y `AKIA` solo encontró el comentario de `.env.example` y el test que busca esas cadenas. `.gitignore` ignora `.env`, `.env.local`, `.env.*.local` y `.vercel`. |
| Auth para datos privados | PASS | Guardar una evaluación exige sesión. Playwright `auth-save` creó una cuenta, guardó y reabrió. Sin sesión, el botón de guardar no dice «Evaluación guardada». |
| RLS en tablas privadas | PASS | `app_admins`, `comparison_feedback`, `evaluations`, `product_events`, `research_priorities` y `research_sessions` tienen `relrowsecurity = true`. El cliente anónimo recibió `42501` en las cinco tablas de Week 13 y 0 filas visibles en `evaluations`. |
| Validación de formularios | PASS | Zod en compra, auth, feedback e investigación. Vitest 28 passed, incluido el rechazo de un monto dentro de un evento y de un correo dentro del comentario. |
| Cero datos personales reales en demos | PASS | No se insertaron sesiones humanas. Las filas de sonda de la configuración anterior se borraron. Las cuentas de Playwright usan `@pausamx.test`. El mockup usa cifras de ejemplo. |
| Service role fuera del cliente | PASS | `src/lib/analytics/security.test.ts` recorre `src/` y `supabase/` y falla si aparece la service role o un JWT. La app usa solo URL y anon key públicas. |
| Panel de investigación en el servidor | PASS para usuario normal. PENDING para fundador | Una cuenta recién creada vio «no está autorizada» y no vio el formulario de cita. No hay fila en `app_admins`, así que nadie pudo abrir el panel como fundador en esta pasada. |
| Eventos sin montos ni secretos | PASS | La restricción SQL y `parseProductEvent` aceptan solo nombres y códigos de la lista. Un detalle `2500.00` devolvió `bad_detail` en la base de producción durante la configuración del 2026-11-08. Ese renglón de prueba se eliminó. |
| Feedback con límite y antispam | PASS | Tope de 400 caracteres, honeypot, rechazo de texto que parece correo, 20 segundos y 5 envíos por sesión en 24 horas. |
| XSS obvio | PASS | El comentario y las citas se renderizan como texto de React, no como HTML. No se encontró `dangerouslySetInnerHTML` en `src/`. |
| Sign in with Google completo | PENDING | El botón y `/auth/callback` están en el código. No hay Client ID ni Client Secret, y el proveedor no se marcó como encendido. |
| Aislamiento entre dos cuentas | PASS | `tests/auth-save.spec.ts`: la segunda cuenta no vio el precio guardado por la primera. |
| Administrador crea observaciones | PENDING | El formulario existe en `ResearchDesk`, pero no hay administrador que iniciar sesión. |

## Lo que no se hizo

No se ejecutó `supabase db reset`. No se borraron las 9 evaluaciones. No se usó la service role en el navegador. No se eligió otra cuenta de `auth.users` como administrador.

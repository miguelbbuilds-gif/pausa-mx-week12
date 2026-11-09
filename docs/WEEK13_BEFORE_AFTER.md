# Antes y después — PAUSA MX Week 13

## Problema humano #1

**No hay.** `docs/WEEK13_PAIN_RANKING.md` sigue vacío. Este archivo no presenta un antes y después de una confusión observada en personas.

## Defecto mecánico reproducido

Esto no es un hallazgo de usuarios. Es un fallo de la interfaz encontrado al correr Playwright el 2026-11-08.

**Reproducción:** viewport 390×844, abrir `/product`, buscar el control del menú móvil por el rol de botón con el nombre “Menú”.

**Esperado:** un botón que abre los enlaces Inicio, Mi Pausa, Acerca de, Privacidad y Entrar.

**Observado:** el `<summary>` del menú aparecía en el árbol de accesibilidad como un genérico, no como botón. La prueba esperó 30 segundos y no pudo activarlo. Los enlaces móviles no estaban disponibles. Prueba: `tests/week13.spec.ts`, corrida con 1 fallo y 7 pasos previos en verde.

**Corrección:** `src/components/MobileNav.tsx` usa un `<button type="button">` con `aria-expanded`. Commit `cc50293`.

**Prueba posterior:** `npx playwright test tests/week13.spec.ts tests/smoke.spec.ts` — **8 passed** (27.6s) el 2026-11-08, después del commit de la corrección.

No hay capturas de una sesión humana porque no hubo sesión humana.

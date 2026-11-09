# Protocolo de cinco humanos — PAUSA MX Week 13

Estado: **listo para usar. Cero sesiones realizadas por este agente.**

No simules participantes. No copies citas de este archivo como si alguien las hubiera dicho. La plantilla de abajo está vacía a propósito.

## A quién invitar

Cinco adultos en México que puedan escribir cantidades aproximadas en MXN sobre una compra personal.

- Mínimo **tres desconocidos**: personas que el fundador no conocía antes de pedir la sesión.
- Los otros dos pueden ser conocidos, y hay que marcarlos como conocidos.
- No uses al propio fundador como una de las cinco.

## Consentimiento, antes de observar

Lee esto en voz alta y espera un sí claro. Si dicen que no, no registres la sesión.

> Quiero ver cómo usas PAUSA MX durante unos minutos. No es un examen. Puedes parar cuando quieras. No voy a pedirte tu contraseña, tu banco ni tu nombre para el registro. Si anoto algo que digas, usaré un identificador como S-01, no tu nombre. El comentario dentro de la app, si lo escribes, puede usarse para mejorar el producto. ¿Estás de acuerdo en que observe y anote?

Guarda la evidencia del sí: una nota con fecha y el identificador, o un mensaje donde la persona acepte. No pegues su nombre en el repositorio.

## Cómo observar

Presencial o pantalla compartida. La persona usa el producto. Tú no tecleas por ella, salvo que pida ayuda para abrir el enlace.

URL, cuando el despliegue de Week 13 esté en producción: https://pausa-mx-week12.vercel.app

Hasta que ese despliegue exista, no des por hecha la prueba sobre la versión nueva.

## Tarea

> Imagina una compra personal que sí estás considerando, o usa cifras aproximadas si no quieres decir las reales. Entra a Mi Pausa y trata de ver qué pasaría con tu dinero si compras ahora y si esperas. Di en voz alta qué vas entendiendo.

No expliques “dinero disponible después de obligaciones” antes de que lo encuentre. Si pregunta, anota la pregunta y responde después de la tarea.

## Preguntas neutrales, después de la tarea

1. ¿Qué crees que te muestra “Comprar ahora”?
2. ¿Qué crees que te muestra “Esperar”?
3. ¿Qué parte te resultó confusa?
4. ¿Volverías a usar PAUSA MX para otra compra? ¿Por qué?

No preguntes “¿verdad que está claro?”. No sugieras la respuesta.

## Severidad

| Nivel | Cuándo usarlo |
| --- | --- |
| Crítica | No puede completar la comparación, o cree que la app le ordenó comprar o no comprar. |
| Alta | Completa la tarea, pero entiende mal el dinero que quedaría o los pagos futuros. |
| Media | Completa la tarea con una duda que corrige al releer, o un campo que tuvo que adivinar. |
| Baja | Un detalle de texto o de botón que no cambia la decisión. |

## Qué anotar

En `docs/WEEK13_HUMAN_TEST_LOG.md` y, si el fundador ya aplicó la migración y está en `app_admins`, también en `/investigacion`:

- Identificador (S-01 … S-05)
- Rol general, sin nombre
- Desconocido o conocido
- Fecha
- Tarea
- Dificultad observada
- Cita textual exacta, entre comillas, solo si la escuchaste
- Severidad
- Dónde está la evidencia (nota, captura de la pantalla compartida, mensaje de consentimiento)
- Consentimiento: sí
- Verificación: sin verificar hasta que la evidencia exista

## Después de las cinco

1. Lee las cinco citas.
2. Elige los tres problemas que más dañan la promesa de entender el impacto de la compra.
3. El #1 es el que más gente no pudo resolver, o el malentendido más grave. No lo elijas antes de tener las cinco.
4. Corrige solo ese #1, con capturas de antes y después de la app real.
5. Prueba, commit y despliegue.
6. Si alguien dijo que volvería, guarda esa frase con su identificador. No inventes el sí.

## Qué no cuenta

- El mockup `docs/week13-mockup.png`
- Una persona sintética en un chat
- Una fila DEMO
- El fundador probando solo
- Este protocolo

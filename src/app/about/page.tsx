export const metadata = {
  title: "Acerca de",
};

export default function AboutPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-10 space-y-8 text-lg leading-relaxed">
      <h1 className="font-display text-4xl text-navy">Acerca de PAUSA MX</h1>

      <section>
        <h2 className="font-display text-2xl text-navy">La necesidad</h2>
        <p className="mt-3 text-muted">
          El precio en pantalla no dice qué queda después de la renta, la comida
          y los pagos ya prometidos. En México es común pagar a meses; el monto
          mensual se ve pequeño y el compromiso total se esconde. PAUSA MX hace
          visibles esas restricciones para una sola compra.
        </p>
      </section>

      <section>
        <h2 className="font-display text-2xl text-navy">Para quién es</h2>
        <p className="mt-3 text-muted">
          Adultas y adultos jóvenes en México que están por comprar algo y
          quieren entender el efecto en su dinero disponible. Las personas de
          diseño Valeria (23, CDMX) y Daniel (27, ingreso variable) son
          hipótesis sintéticas, no clientas entrevistadas.
        </p>
      </section>

      <section>
        <h2 className="font-display text-2xl text-navy">Quién podría pagar después</h2>
        <p className="mt-3 text-muted">
          Hipótesis, no un modelo probado: la persona que guarda historial; más
          adelante, tal vez un taller o un área de bienestar que pague por una
          versión sin marca bancaria. Nadie paga en la semana 12. No se venden
          datos.
        </p>
      </section>

      <section id="memo-10-1">
        <h2 className="font-display text-2xl text-navy">THE 10:1 MEMO</h2>
        <p className="mt-3 text-sm font-medium text-warning">NOT YET MEASURED</p>
        <ol className="mt-4 list-decimal space-y-3 pl-5 text-muted">
          <li>
            <strong className="font-medium text-navy">What does the user do today?</strong>{" "}
            Mira el precio de una compra y, a menudo, el mensual de un plan de pagos.
            MEASURED como comportamiento descrito en el producto, no como un estudio de esta semana.
          </li>
          <li>
            <strong className="font-medium text-navy">What does that cost?</strong>{" "}
            UNKNOWN en pesos de una persona real. El formulario no se usa aquí como prueba de ahorro.
          </li>
          <li>
            <strong className="font-medium text-navy">Money.</strong> UNKNOWN. No hay un ahorro
            medido que se pueda poner junto al precio.
          </li>
          <li>
            <strong className="font-medium text-navy">Time.</strong> UNKNOWN. No medimos minutos
            ahorrados ni compras evitadas.
          </li>
          <li>
            <strong className="font-medium text-navy">Risk.</strong> ASSUMED: decidir con el
            mensual a la vista y sin ver lo ya comprometido puede ocultar el total. No está
            medido como daño en pesos.
          </li>
          <li>
            <strong className="font-medium text-navy">What does PAUSA MX cost?</strong> El
            resultado esencial cuesta MXN 0. PAUSA+ se muestra a MXN 79 al mes como precio
            experimental. ASSUMED, no cobrado.
          </li>
          <li>
            <strong className="font-medium text-navy">Why might 10:1 hold?</strong> Solo como
            umbral aritmético: at MXN 79/month, PAUSA+ would need to create at least MXN
            790/month of equivalent user value to defend a strict 10:1 ratio. Eso no afirma
            que esos 790 existan.
          </li>
          <li>
            <strong className="font-medium text-navy">What is assumed?</strong> Que guardar
            contexto o repetir la pausa podría valer diez veces 79 para alguien. ASSUMED.
            También que MXN 39 podría bastar como pago único. ASSUMED.
          </li>
          <li>
            <strong className="font-medium text-navy">What could kill the thesis?</strong> Que
            lo gratis resuelva el trabajo, que nadie pague, que nadie vuelva, que la
            frecuencia sea baja, que la contribution sea negativa, o que el valor equivalente
            no llegue a 790. UNKNOWN hasta que haya evidencia.
          </li>
        </ol>
      </section>

      <section>
        <h2 className="font-display text-2xl text-navy">Hipótesis anterior</h2>
        <p className="mt-3 text-muted">
          Hipótesis de trabajo: si una pausa evita una sola compra de $10,000 MXN
          que la persona no podía cargar ese mes, el valor percibido podría ser
          diez veces un costo operativo pequeño de ofrecer la herramienta.{" "}
          <strong className="font-medium text-navy">
            No hay evidencia de un impacto 10×.
          </strong>{" "}
          Falta: cinco sesiones reales, un problema #1 observado, y cualquier dato
          de retención. Week 13 prepara el comentario y el registro del fundador.
          Esta página no afirma que el producto ya cambió comportamiento.
        </p>
      </section>
    </article>
  );
}

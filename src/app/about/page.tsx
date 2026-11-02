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

      <section>
        <h2 className="font-display text-2xl text-navy">Hipótesis 10:1</h2>
        <p className="mt-3 text-muted">
          Hipótesis de trabajo: si una pausa evita una sola compra de $10,000 MXN
          que la persona no podía cargar ese mes, el valor percibido podría ser
          diez veces un costo operativo pequeño de ofrecer la herramienta.{" "}
          <strong className="font-medium text-navy">
            No hay evidencia de un impacto 10×.
          </strong>{" "}
          Falta: entrevistas reales, un norte estrella medido y cualquier dato
          de retención. Esta página no afirma que el producto ya cambió
          comportamiento.
        </p>
      </section>
    </article>
  );
}

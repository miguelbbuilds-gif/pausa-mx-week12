export const metadata = {
  title: "Privacidad",
};

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-10 space-y-6 text-lg leading-relaxed text-muted">
      <h1 className="font-display text-4xl text-navy">Privacidad</h1>
      <p>
        PAUSA MX trata cantidades de dinero como información personal. Por eso
        el cálculo en vista previa ocurre en tu dispositivo. Esos montos no se
        mandan a un servidor hasta que guardas una evaluación con la sesión de
        Google iniciada.
      </p>
      <h2 className="font-display text-2xl text-navy">Qué se guarda</h2>
      <ul className="list-disc space-y-2 pl-6">
        <li>Identificador de tu cuenta de Google (vía Supabase Auth).</li>
        <li>
          Las cifras que escribiste y el resultado calculado, asociados a tu
          usuario.
        </li>
      </ul>
      <h2 className="font-display text-2xl text-navy">Qué no se hace</h2>
      <ul className="list-disc space-y-2 pl-6">
        <li>No hay conexión a bancos.</li>
        <li>No hay puntaje de riesgo ni ranking de conducta.</li>
        <li>No se venden datos.</li>
        <li>
          La clave de servicio de Supabase no viaja en el navegador. El
          navegador solo usa la clave anónima, limitada por políticas de fila.
        </li>
      </ul>
      <h2 className="font-display text-2xl text-navy">Tus controles</h2>
      <p>
        Puedes borrar una evaluación guardada desde Mi Pausa. Puedes cerrar
        sesión. Si borras tu usuario en el proyecto de Supabase, las filas
        asociadas se eliminan en cascada según la migración SQL.
      </p>
      <p>
        Este prototipo de curso no es un aviso de privacidad legal completo para
        un producto comercial en México.
      </p>
    </article>
  );
}

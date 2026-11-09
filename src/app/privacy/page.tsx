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
        mandan a un servidor hasta que guardas una evaluación con sesión de
        correo y contraseña iniciada.
      </p>
      <h2 className="font-display text-2xl text-navy">Qué se guarda</h2>
      <ul className="list-disc space-y-2 pl-6">
        <li>
          Correo de tu cuenta, si entras con correo y contraseña, o el perfil que
          Google entrega a Supabase si entras con Google. El proveedor de Google
          queda activo solo cuando está encendido en Supabase.
        </li>
        <li>
          Las cifras que escribiste y el resultado calculado, asociados a tu
          usuario.
        </li>
      </ul>
      <h2 className="font-display text-2xl text-navy">Qué se observa, sin tus montos</h2>
      <p>
        Al usar Mi Pausa, la aplicación puede registrar el nombre de un evento:
        que empezaste, que un campo no pasó la validación, que viste la
        comparación, que intentaste guardar, que el guardado sí ocurrió, o que
        enviaste un comentario. Ese registro no incluye cantidades, nombre,
        correo, contraseña ni token. El comentario opcional sí guarda el texto
        que tú escribes, con un aviso de que puede usarse para mejorar el
        producto. No lo uses para dejar datos de contacto.
      </p>
      <p>
        Las notas de sesiones con personas se guardan solo para el fundador,
        con seudónimo, y no son una página pública.
      </p>
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

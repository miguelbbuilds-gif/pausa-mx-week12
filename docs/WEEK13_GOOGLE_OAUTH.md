# Sign in with Google — código listo, proveedor pendiente

El botón **Continuar con Google** ya está en `/auth`. Llama a `signInWithOAuth` y regresa a `/auth/callback`, que cambia el código por una sesión y abre `/product`. Correo y contraseña siguen en la misma pantalla.

Eso no significa que Google ya inicie sesión. Falta el cliente de Google Cloud y encender el proveedor en Supabase. No pegues el Client ID ni el Client Secret en el chat ni en git.

Cuando termines estos pasos, el despliegue actual puede completar el flujo sin otro cambio de código.

## 1. Google Cloud

1. Abre https://console.cloud.google.com/apis/credentials
2. Elige o crea el proyecto de la cuenta del venture.
3. Si Google pide la pantalla de consentimiento, configúrala como External, en modo de prueba, y agrega tu correo como usuario de prueba.
4. Clic en **Create credentials** → **OAuth client ID**.
5. Application type: **Web application**.
6. En **Authorized redirect URIs**, agrega exactamente:

   `https://xrpbbmdossmlbstjrlta.supabase.co/auth/v1/callback`

7. Crea el cliente. Deja el Client ID y el Client Secret en esa página. No los copies al chat.

## 2. Supabase

1. Abre https://supabase.com/dashboard/project/xrpbbmdossmlbstjrlta/auth/providers
2. Abre **Google**.
3. Activa el proveedor.
4. Pega el Client ID en el campo Client ID.
5. Pega el Client Secret en el campo Client Secret.
6. Guarda.

## 3. URLs de retorno

1. Abre https://supabase.com/dashboard/project/xrpbbmdossmlbstjrlta/auth/url-configuration
2. Site URL: `https://pausa-mx-week12.vercel.app`
3. Agrega estas Redirect URLs si no están:

   - `https://pausa-mx-week12.vercel.app/auth/callback`
   - `http://127.0.0.1:3000/auth/callback`
   - `http://localhost:3000/auth/callback`

4. Guarda.

## 4. Cómo avisar

Escribe solo: «Google provider enabled». No pegues secretos. A partir de ahí se puede probar el botón en producción.

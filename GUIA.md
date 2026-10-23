# Tienda SLICK con Supabase y Vercel

Aplicación React lista para administrar catálogo, configuración y pedidos desde la página publicada.

## Incluye

- Supabase Database para productos, diseño y pedidos.
- Supabase Authentication por enlace mágico.
- Supabase Storage para imágenes públicas.
- Panel protegido por rol `admin`.
- Seguimiento público de pedidos por código.
- Estados de pedido y reclamaciones desde el panel.
- Despliegue compatible con Vercel.
- Modo local mediante `localStorage` si Supabase no está configurado.

## 1. Crear Supabase

1. Crea un proyecto gratuito en Supabase.
2. Ejecuta `supabase/schema.sql` completo en SQL Editor.
3. Ejecuta `supabase/seed.sql` para cargar los polos y la configuración inicial.
4. Habilita Email en Authentication > Providers.
5. Crea el usuario administrador en Authentication > Users.
6. Ejecuta:

```sql
update public.profiles
set role = 'admin'
where id = 'UUID_DEL_USUARIO';
```

Cualquier cuenta sin rol `admin` queda fuera del panel.

## 2. Configurar el proyecto

Copia `.env.example` como `.env.local`:

```env
VITE_SUPABASE_URL=https://TU-PROYECTO.supabase.co
VITE_SUPABASE_ANON_KEY=TU_ANON_PUBLIC_KEY
```

Los valores están en Project Settings > API. Nunca uses `service_role` en el navegador.

```powershell
npm install
npm run dev
```

Sin variables Supabase, el proyecto funciona localmente para pruebas.

## 3. Desplegar en Vercel

1. Sube la carpeta a GitHub.
2. Importa el repositorio en Vercel.
3. Agrega `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`.
4. Mantén el framework Vite.
5. Desplega.
6. Agrega la URL final de Vercel como Site URL y Redirect URL en Supabase Authentication.

## 4. Administrar

Pulsa Administración en el pie de página o usa `Ctrl+Shift+A`. Inicia sesión con el correo administrador y confirma el enlace recibido.

Desde el panel puedes crear, editar, ocultar y eliminar productos; subir imágenes; cambiar textos, colores y datos de contacto; actualizar pedidos; y responder reclamaciones. Los cambios son compartidos por todos los visitantes.

## 5. Seguimiento

Al enviar el pedido se genera un código `SLK-...`. El cliente puede consultarlo en la sección **Consulta tu pedido**. El SQL expone solamente código, estado, fecha y total mediante `track_order_public`.

## Antes de vender

- Revisa datos personales, impuestos y textos legales.
- Configura límites de envío y devoluciones.
- No uses claves privadas en el navegador.
- Añade pasarela de pago si necesitas cobrar por tarjeta; WhatsApp puede seguir coordinando pedidos.

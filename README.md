# Tienda SLICK con Supabase y Vercel

Aplicación React lista para administrar catálogo, configuración y pedidos desde la página publicada.

## Incluye

- Supabase Database para productos, diseño y pedidos.
- Supabase Authentication por enlace mágico.
- Supabase Storage para imágenes públicas.
- Panel protegido por rol `admin`.
- Seguimiento público de pedidos por código.
- Estados de pedido y reclamaciones desde el panel.

## Recuperación de contraseña de administración

En Supabase, configura **Authentication → URL Configuration**:

- **Site URL:** `https://slick-shop-supabase.vercel.app`
- **Redirect URLs:** agrega `https://slick-shop-supabase.vercel.app`

Los enlaces de recuperación deben abrir el dominio público estable de la tienda, no una URL individual de un deployment de Vercel. La aplicación solicita la recuperación redirigiendo a ese dominio.


## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.

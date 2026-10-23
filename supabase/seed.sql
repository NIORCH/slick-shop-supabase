insert into public.store_settings (id, store_info, site_content)
values (
  1,
  '{"name":"SLICK","legalName":"SLICK PERÚ","description":"Especialistas en ropa urbana para todo el Perú.","phone":"+51 987 654 321","whatsapp":"51987654321","address":"Av. José Larco 456, Miraflores, Lima"}'::jsonb,
  '{"announcement":"ENVÍOS A TODO EL PERÚ | COMPRA POR WHATSAPP","announcementBackground":"#000000","pageBackground":"#f8fafc","heroEyebrow":"Colección Perú 2026","heroTitleLine1":"Polo básico","heroTitleLine2":"blanco y negro","heroDescription":"Camisetas lisas de hombre, cuello redondo y manga corta.","heroButton":"Ver polos","heroBackground":"#f4f4f0","heroImage":"","heroProductImage":"/images/polo-negro.jpg","heroAlignment":"left","benefitsBackground":"#ffffff","benefits":[{"title":"Envíos rápidos","description":"Lima en 24h / Provincias 48h"},{"title":"Garantía directa","description":"Producto original"},{"title":"Atención WhatsApp","description":"Asesoría de tallas inmediata"},{"title":"Cambio fácil","description":"7 días para cambios de talla"}],"catalogBackground":"#f8fafc","catalogEyebrow":"Catálogo oficial","catalogTitle":"Todos los modelos","catalogCollectionLabel":"Colección","footerBackground":"#000000","footerDescription":"Ropa urbana pensada para cada día.","footerLegalHeading":"Legal y privacidad","footerCustomerHeading":"Atención al cliente","footerComplaintsHeading":"Reclamaciones"}'::jsonb
)
on conflict (id) do update set
  store_info = excluded.store_info,
  site_content = excluded.site_content;

insert into public.products (
  id, position, name, type, category, price, original_price, image, stock,
  active, rating, reviews_count, sizes, colors, description
) values
  (7, 1, 'Polo Básico Negro', 'Ropa', 'Hombre', 69, 89, '/images/polo-negro.jpg', 20, true, 0, 0,
   array['S','M','L'], array['Negro'], 'Polo liso de algodón, cuello redondo y manga corta.'),
  (8, 2, 'Polo Básico Blanco', 'Ropa', 'Hombre', 69, 89, '/images/polo-blanco.jpg', 16, true, 0, 0,
   array['S','M','L'], array['Blanco'], 'Polo liso de algodón, cuello redondo y manga corta.')
on conflict (id) do update set
  position = excluded.position,
  name = excluded.name,
  type = excluded.type,
  category = excluded.category,
  price = excluded.price,
  original_price = excluded.original_price,
  image = excluded.image,
  stock = excluded.stock,
  active = excluded.active,
  rating = excluded.rating,
  reviews_count = excluded.reviews_count,
  sizes = excluded.sizes,
  colors = excluded.colors,
  description = excluded.description;

create table if not exists public.store_settings (
  id smallint primary key default 1 check (id = 1),
  store_info jsonb not null default '{}'::jsonb,
  site_content jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id bigint primary key,
  position integer not null default 0,
  name text not null,
  type text not null default 'Calzado',
  category text not null default 'Unisex',
  price numeric(12,2) not null check (price >= 0),
  original_price numeric(12,2) not null default 0,
  image text not null default '',
  stock integer not null default 0 check (stock >= 0),
  active boolean not null default true,
  rating numeric(2,1) not null default 0,
  reviews_count integer not null default 0,
  sizes text[] not null default '{}',
  colors text[] not null default '{}',
  description text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.orders (
  id text primary key,
  customer jsonb not null,
  items jsonb not null,
  district text not null default '',
  address text not null default '',
  total numeric(12,2) not null check (total >= 0),
  status text not null default 'Recibido' check (status in ('Recibido', 'Confirmado', 'Preparando', 'Enviado', 'Entregado', 'Cancelado')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.claims (
  id text primary key,
  payload jsonb not null,
  status text not null default 'Pendiente' check (status in ('Pendiente', 'En proceso', 'Resuelto')),
  response text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.store_settings enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.claims enable row level security;
alter table public.profiles enable row level security;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

create policy "store public read" on public.store_settings for select to anon, authenticated using (true);
create policy "store admin write" on public.store_settings for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "products public read" on public.products for select to anon, authenticated using (active or public.is_admin());
create policy "products admin write" on public.products for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "orders public insert" on public.orders for insert to anon, authenticated with check (char_length(id) between 8 and 32);
create policy "orders admin read" on public.orders for select to authenticated using (public.is_admin());
create policy "orders admin write" on public.orders for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "claims public insert" on public.claims for insert to anon, authenticated with check (char_length(id) between 8 and 64);
create policy "claims admin read" on public.claims for select to authenticated using (public.is_admin());
create policy "claims admin write" on public.claims for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "profiles self read" on public.profiles for select to authenticated using (id = auth.uid());

insert into storage.buckets (id, name, public) values ('store-images', 'store-images', true)
on conflict (id) do update set public = excluded.public;

create policy "public image read" on storage.objects for select to anon, authenticated using (bucket_id = 'store-images');
create policy "admin image upload" on storage.objects for insert to authenticated with check (bucket_id = 'store-images' and public.is_admin());
create policy "admin image delete" on storage.objects for delete to authenticated using (bucket_id = 'store-images' and public.is_admin());

create or replace function public.handle_new_auth_profile()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, role) values (new.id, 'customer') on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
for each row execute procedure public.handle_new_auth_profile();

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists touch_settings on public.store_settings;
create trigger touch_settings before update on public.store_settings for each row execute procedure public.touch_updated_at();
drop trigger if exists touch_products on public.products;
create trigger touch_products before update on public.products for each row execute procedure public.touch_updated_at();
drop trigger if exists touch_orders on public.orders;
create trigger touch_orders before update on public.orders for each row execute procedure public.touch_updated_at();
drop trigger if exists touch_claims on public.claims;
create trigger touch_claims before update on public.claims for each row execute procedure public.touch_updated_at();

create or replace function public.track_order_public(order_code text)
returns table(id text, status text, created_at timestamptz, total numeric)
language plpgsql stable security definer set search_path = public as $$
begin
  return query
    select orders.id, orders.status, orders.created_at, orders.total
    from public.orders
    where orders.id = upper(trim(order_code))
    limit 1;
end;
$$;

grant execute on function public.track_order_public(text) to anon, authenticated;

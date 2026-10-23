import { requireSupabase } from './supabase';

export type CloudProduct = Record<string, any> & { id: number };
export type CloudOrder = Record<string, any> & { id: string };
export type CloudClaim = Record<string, any> & { id: string };

export const loadCloudStore = async () => {
  const supabase = requireSupabase();
  const [products, settings] = await Promise.all([
    supabase.from('products').select('*').order('position'),
    supabase.from('store_settings').select('*').eq('id', 1).maybeSingle(),
  ]);
  if (products.error) throw products.error;
  if (settings.error) throw settings.error;
  return {
    products: products.data as CloudProduct[],
    settings: settings.data,
  };
};

export const loadAdminOrders = async () => {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data as CloudOrder[];
};

export const saveProduct = async (product: CloudProduct) => {
  const supabase = requireSupabase();
  const fullProduct = Object.prototype.hasOwnProperty.call(product, 'name');
  const operation = fullProduct
    ? supabase.from('products').upsert(product)
    : supabase.from('products').update(product).eq('id', product.id);
  const { error } = await operation;
  if (error) throw error;
};

export const deleteProduct = async (id: number) => {
  const supabase = requireSupabase();
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw error;
};

export const saveStoreSettings = async (storeInfo: Record<string, any>, siteContent: Record<string, any>) => {
  const supabase = requireSupabase();
  const { error } = await supabase.from('store_settings').upsert({
    id: 1,
    store_info: storeInfo,
    site_content: siteContent,
  });
  if (error) throw error;
};

export const createOrder = async (order: Record<string, any>) => {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from('orders')
    .insert(order)
    .select('id,status,created_at')
    .single();
  if (error) throw error;
  return data;
};

export const updateOrderStatus = async (id: string, status: string) => {
  const supabase = requireSupabase();
  const { error } = await supabase.from('orders').update({ status }).eq('id', id);
  if (error) throw error;
};

export const createClaim = async (claim: Record<string, any>) => {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from('claims')
    .insert(claim)
    .select('id')
    .single();
  if (error) throw error;
  return data;
};

export const loadClaims = async () => {
  const supabase = requireSupabase();
  const { data, error } = await supabase.from('claims').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data as CloudClaim[];
};

export const updateClaim = async (id: string, values: Record<string, any>) => {
  const supabase = requireSupabase();
  const { error } = await supabase.from('claims').update(values).eq('id', id);
  if (error) throw error;
};

export const trackOrder = async (code: string) => {
  const supabase = requireSupabase();
  const normalizedCode = code.trim().toUpperCase();
  const { data, error } = await supabase.rpc('track_order_public', {
    order_code: normalizedCode,
  });
  if (error) throw error;
  return data?.[0] ?? null;
};

export const uploadStoreImage = async (file: File) => {
  const supabase = requireSupabase();
  const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const path = `store/${crypto.randomUUID()}.${extension}`;
  const { error } = await supabase.storage.from('store-images').upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  });
  if (error) throw error;
  const { data } = supabase.storage.from('store-images').getPublicUrl(path);
  return data.publicUrl;
};

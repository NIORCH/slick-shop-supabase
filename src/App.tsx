import { useState, useEffect, useRef } from 'react';
import {
  createClaim,
  createOrder,
  deleteProduct,
  loadAdminOrders,
  loadCloudStore,
  saveProduct,
  saveStoreSettings,
  trackOrder,
  updateClaim,
  updateOrderStatus,
  uploadStoreImage,
} from './lib/cloud';
import { isSupabaseConfigured, requireSupabase } from './lib/supabase';
import { 
  ShoppingBag, Trash2, Plus, Minus, Search, X, Check, ShieldCheck, 
  FileText, Lock, ChevronRight, Star, Menu, Eye, EyeOff, AlertCircle, 
  Edit3, Phone, MapPin, Building2, User, CreditCard, Send, LockKeyhole,
  CheckCircle2, RefreshCw, Truck, ArrowLeft, BarChart3, Settings, LogOut,
  SlidersHorizontal, Sparkles, Filter, AlertTriangle, Download, Printer
} from 'lucide-react';

const STORE_PUBLIC_URL = 'https://slick-shop-supabase.vercel.app';

// Default initial catalog
const ALL_DEMO_PRODUCTS = [
  {
    id: 1,
    name: 'Slick Formal Sneaker Shoe',
    type: 'Calzado',
    category: 'Hombre',
    price: 289.00,
    originalPrice: 349.00,
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=600',
    stock: 12,
    active: true,
    rating: 4.8,
    reviewsCount: 24,
    sizes: ['39', '40', '41', '42'],
    colors: ['Blanco/Gris', 'Negro'],
    description: 'Zapatilla urbana formal elaborada con finos acabados en cuero sintético de alta durabilidad y plantilla acolchada.'
  },
  {
    id: 2,
    name: 'Slick Casual Sneaker Shoe',
    type: 'Calzado',
    category: 'Hombre',
    price: 249.00,
    originalPrice: 299.00,
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=600',
    stock: 18,
    active: true,
    rating: 4.9,
    reviewsCount: 38,
    sizes: ['38', '39', '40', '41', '42'],
    colors: ['Crema/Azul', 'Blanco'],
    description: 'Diseño moderno con estilo retro runner. Máximo confort para el uso diario con suela antideslizante.'
  },
  {
    id: 3,
    name: 'Slick Trendy Pro Platform',
    type: 'Calzado',
    category: 'Mujer',
    price: 279.00,
    originalPrice: 329.00,
    image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&q=80&w=600',
    stock: 8,
    active: true,
    rating: 4.7,
    reviewsCount: 19,
    sizes: ['35', '36', '37', '38'],
    colors: ['Blanco/Rosado', 'Beige'],
    description: 'Zapatilla con plataforma elevada súper ligera. Estilo limpio perfecto para outfits casuales o formales.'
  },
  {
    id: 4,
    name: 'Slick Minimal White Runner',
    type: 'Calzado',
    category: 'Mujer',
    price: 219.00,
    originalPrice: 259.00,
    image: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&q=80&w=600',
    stock: 15,
    active: true,
    rating: 4.9,
    reviewsCount: 42,
    sizes: ['36', '37', '38', '39'],
    colors: ['Blanco Total'],
    description: 'Zapatilla blanca atemporal, un clásico imprescindible en tu armario. Fácil de limpiar y extremadamente cómoda.'
  },
  {
    id: 5,
    name: 'Slick Junior Active Sport',
    type: 'Calzado',
    category: 'Niño',
    price: 189.00,
    originalPrice: 219.00,
    image: 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&q=80&w=600',
    stock: 10,
    active: true,
    rating: 4.6,
    reviewsCount: 15,
    sizes: ['31', '32', '33', '34'],
    colors: ['Multicolor', 'Azul'],
    description: 'Diseñadas para resistencia extrema e impacto constante. Cierre cómodo y refuerzo sintético superior.'
  },
  {
    id: 6,
    name: 'Slick Canvas Urban High',
    type: 'Calzado',
    category: 'Hombre',
    price: 199.00,
    originalPrice: 239.00,
    image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&q=80&w=600',
    stock: 14,
    active: true,
    rating: 4.8,
    reviewsCount: 31,
    sizes: ['39', '40', '41', '42'],
    colors: ['Negro mate', 'Marrón'],
    description: 'Estilo urbano en lona reforzada con plantilla ergonómica lavable.'
  },
  {
    id: 7,
    name: 'Polo Básico Negro',
    type: 'Ropa',
    category: 'Hombre',
    price: 69.00,
    originalPrice: 89.00,
    image: '/images/polo-negro.jpg',
    stock: 20,
    active: true,
    rating: 0,
    reviewsCount: 0,
    sizes: ['S', 'M', 'L'],
    colors: ['Negro'],
    description: 'Polo liso de algodón, cuello redondo y manga corta. Un básico cómodo para todos los días.'
  },
  {
    id: 8,
    name: 'Polo Básico Blanco',
    type: 'Ropa',
    category: 'Unisex',
    price: 69.00,
    originalPrice: 89.00,
    image: '/images/polo-blanco.jpg',
    stock: 16,
    active: true,
    rating: 0,
    reviewsCount: 0,
    sizes: ['S', 'M', 'L'],
    colors: ['Blanco'],
    description: 'Polo liso de algodón, cuello redondo y manga corta. Un básico cómodo para todos los días.'
  },
  {
    id: 9,
    name: 'Polo Streetwear Verde Oliva',
    type: 'Ropa',
    category: 'Hombre',
    price: 79.00,
    originalPrice: 99.00,
    image: 'https://images.unsplash.com/photo-1583743814966-8936f37f4678?auto=format&fit=crop&q=85&w=900',
    stock: 12,
    active: true,
    rating: 0,
    reviewsCount: 0,
    sizes: ['S', 'M', 'L'],
    colors: ['Verde oliva'],
    description: 'Polo de estilo streetwear con un tono versátil y una silueta pensada para el uso diario.'
  }
];

const LEGACY_PRODUCT_IDS = new Set(ALL_DEMO_PRODUCTS.map((product) => product.id));
const INITIAL_PRODUCTS = ALL_DEMO_PRODUCTS
  .filter((product) => product.id === 7 || product.id === 8)
  .map((product) => ({
    ...product,
    category: 'Hombre',
    rating: 0,
    reviewsCount: 0,
    sizes: ['S', 'M', 'L'],
    colors: [product.id === 7 ? 'Negro' : 'Blanco']
  }));

const INITIAL_STORE_INFO = {
  name: 'SLICK',
  legalName: 'SLICK PERÚ S.A.C.',
  description: 'Especialistas en calzado, ropa y accesorios urbanos para todo el Perú.',
  phone: '+51 987 654 321',
  whatsapp: '51987654321',
  address: 'Av. José Larco 456, Miraflores, Lima'
};

const INITIAL_SITE_CONTENT = {
  announcement: 'ENVÍOS A TODO EL PERÚ | HASTA 3 CUOTAS SIN INTERÉS CON TARJETAS SELECCIONADAS',
  announcementBackground: '#000000',
  pageBackground: '#f8fafc',
  heroEyebrow: 'Colección Perú 2026',
  heroTitleLine1: 'Polo básico',
  heroTitleLine2: 'blanco y negro',
  heroDescription: 'Camisetas lisas de hombre, cuello redondo y manga corta. Elige tu color y talla S, M o L.',
  heroButton: 'Ver polos',
  heroBackground: '#f4f4f0',
  heroImage: '',
  heroProductImage: '/images/polo-negro.jpg',
  heroAlignment: 'left',
  benefitsBackground: '#ffffff',
  benefits: [
    { title: 'Envíos Rápidos', description: 'Lima en 24h / Provincias 48h' },
    { title: 'Garantía Directa', description: '100% Producto Original' },
    { title: 'Atención WhatsApp', description: 'Asesoría de tallas inmediata' },
    { title: 'Cambio Fácil', description: '7 días para cambios de talla' }
  ],
  catalogBackground: '#f8fafc',
  catalogEyebrow: 'Catálogo Oficial',
  catalogTitle: 'Todos los Modelos',
  catalogCollectionLabel: 'Colección',
  footerBackground: '#000000',
  footerDescription: 'Especialistas en calzado, ropa y accesorios urbanos para todo el Perú.',
  footerLegalHeading: 'Legal y Privacidad',
  footerCustomerHeading: 'Atención al Cliente',
  footerComplaintsHeading: 'Reclamaciones',
};

export default function App() {
  // Main State
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('slick_products');
    if (!saved) return INITIAL_PRODUCTS;
    const savedProducts = JSON.parse(saved);
    const savedDefaults = INITIAL_PRODUCTS.map((initialProduct) => {
      const savedProduct = savedProducts.find((product) => product.id === initialProduct.id);
      return {
        ...initialProduct,
        ...savedProduct,
        image: initialProduct.image,
        category: 'Hombre',
        type: 'Ropa',
        rating: 0,
        reviewsCount: 0,
        sizes: ['S', 'M', 'L'],
        colors: initialProduct.colors
      };
    });
    const customProducts = savedProducts
      .filter((product) => !LEGACY_PRODUCT_IDS.has(product.id))
      .map((product) => ({ ...product, rating: 0, reviewsCount: 0 }));
    return [...savedDefaults, ...customProducts];
  });

  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('slick_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [reclamos, setReclamos] = useState(() => {
    const saved = localStorage.getItem('slick_reclamos');
    return saved ? JSON.parse(saved) : [];
  });

  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('slick_orders');
    return saved ? JSON.parse(saved) : [];
  });

  const [storeInfo, setStoreInfo] = useState(() => {
    const saved = localStorage.getItem('slick_store_info');
    return saved ? { ...INITIAL_STORE_INFO, ...JSON.parse(saved) } : INITIAL_STORE_INFO;
  });
  const [storeDraft, setStoreDraft] = useState(storeInfo);
  const [siteContent, setSiteContent] = useState(() => {
    const saved = localStorage.getItem('slick_site_content');
    if (!saved) return INITIAL_SITE_CONTENT;
    const savedContent = JSON.parse(saved);
    return {
      ...INITIAL_SITE_CONTENT,
      ...savedContent,
      heroTitleLine1: savedContent.heroTitleLine1 === 'Find Your' ? INITIAL_SITE_CONTENT.heroTitleLine1 : savedContent.heroTitleLine1,
      heroTitleLine2: savedContent.heroTitleLine2 === 'Sole Mate With Us' ? INITIAL_SITE_CONTENT.heroTitleLine2 : savedContent.heroTitleLine2,
      heroDescription: savedContent.heroDescription === 'Diseño urbano contemporáneo, acabados de primera calidad y el ajuste perfecto para acompañar cada paso.' ? INITIAL_SITE_CONTENT.heroDescription : savedContent.heroDescription,
      heroButton: savedContent.heroButton === 'Explorar Catálogo' ? INITIAL_SITE_CONTENT.heroButton : savedContent.heroButton,
      heroBackground: savedContent.heroBackground === '#0f172a' ? INITIAL_SITE_CONTENT.heroBackground : savedContent.heroBackground,
      heroAlignment: savedContent.heroTitleLine1 === 'Find Your' ? INITIAL_SITE_CONTENT.heroAlignment : savedContent.heroAlignment,
      heroImage: ['https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&q=80&w=1600', 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&q=85&w=1600'].includes(savedContent.heroImage) ? INITIAL_SITE_CONTENT.heroImage : savedContent.heroImage,
      heroProductImage: [
        'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=600',
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=85&w=900',
        'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&q=85&w=900',
        'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?auto=format&fit=crop&q=85&w=900',
        'https://images.pexels.com/photos/7925636/pexels-photo-7925636.jpeg?auto=compress&cs=tinysrgb&w=900',
        'https://images.pexels.com/photos/12039633/pexels-photo-12039633.jpeg?auto=compress&cs=tinysrgb&w=900'
      ].includes(savedContent.heroProductImage)
        ? INITIAL_SITE_CONTENT.heroProductImage
        : savedContent.heroProductImage
    };
  });
  const [siteContentDraft, setSiteContentDraft] = useState(siteContent);

  // UI States
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [selectedType, setSelectedType] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSizes, setSelectedSizes] = useState<Record<number, string>>({});
  const [selectedColors, setSelectedColors] = useState<Record<number, string>>({});
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isReclamosOpen, setIsReclamosOpen] = useState(false);
  const [activeLegalModal, setActiveLegalModal] = useState<string | null>(null); // 'politica', 'terminos', 'envios', 'devoluciones'
  const [generatedReclamo, setGeneratedReclamo] = useState<any>(null);
  const [orderTrackingCode, setOrderTrackingCode] = useState('');
  const [trackedOrder, setTrackedOrder] = useState<any>(null);
  const [trackingError, setTrackingError] = useState('');

  // Hidden Admin State
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminAuthMode, setAdminAuthMode] = useState<'login' | 'recover' | 'updatePassword'>('login');
  const [adminEmailInput, setAdminEmailInput] = useState('');
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [adminPasswordConfirmation, setAdminPasswordConfirmation] = useState('');
  const [adminLoginError, setAdminLoginError] = useState('');
  const [adminLoginMessage, setAdminLoginMessage] = useState('');
  const [adminTab, setAdminTab] = useState('products'); // 'products', 'reclamos', 'orders', 'metrics'
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [isNewProductModalOpen, setIsNewProductModalOpen] = useState(false);

  // Triple Click Counter for Logo Secret Trigger
  const logoClickCountRef = useRef(0);
  const logoClickTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Checkout Form State
  const [checkoutForm, setCheckoutForm] = useState({
    nombreCompleto: '',
    telefono: '',
    tipoComprobante: 'Boleta', // Boleta / Factura
    tipoDocumento: 'DNI', // DNI / RUC
    numeroDocumento: '',
    razonSocial: '',
    direccion: '',
    distrito: 'Miraflores',
    aceptaTerminos: false
  });

  // Reclamo Form State
  const [reclamoForm, setReclamoForm] = useState({
    nombreCompleto: '',
    tipoDocumento: 'DNI',
    numeroDocumento: '',
    telefono: '',
    email: '',
    direccion: '',
    montoReclamado: '',
    tipoIncidencia: 'Reclamo', // Reclamo / Queja
    bienContratado: 'Producto',
    descripcionProducto: '',
    detalleReclamo: '',
    pedidoCliente: '',
    aceptaProteccionDatos: false
  });

  const [cloudReady, setCloudReady] = useState(!isSupabaseConfigured);
  const [cloudError, setCloudError] = useState('');

  const normalizeProduct = (product: any) => ({
    ...product,
    originalPrice: product.originalPrice ?? product.original_price,
    reviewsCount: product.reviewsCount ?? product.reviews_count,
  });

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    let mounted = true;
    const loadStore = async () => {
      try {
        const cloud = await loadCloudStore();
        if (!mounted) return;
        if (cloud.products.length > 0) setProducts(cloud.products.map(normalizeProduct));
        if (cloud.settings) {
          setStoreInfo(cloud.settings.store_info);
          setStoreDraft(cloud.settings.store_info);
          setSiteContent(cloud.settings.site_content);
          setSiteContentDraft(cloud.settings.site_content);
        }

        setCloudReady(true);
      } catch (error) {
        setCloudError(error instanceof Error ? error.message : 'No se pudo cargar la tienda.');
      }
    };
    loadStore();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      localStorage.setItem('slick_products', JSON.stringify(products));
      localStorage.setItem('slick_reclamos', JSON.stringify(reclamos));
      localStorage.setItem('slick_orders', JSON.stringify(orders));
      localStorage.setItem('slick_store_info', JSON.stringify(storeInfo));
      localStorage.setItem('slick_site_content', JSON.stringify(siteContent));
    }
  }, [products, reclamos, orders, storeInfo, siteContent]);

  useEffect(() => {
    localStorage.setItem('slick_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    const supabase = requireSupabase();
    const hashParams = new URLSearchParams(window.location.hash.slice(1));
    const queryParams = new URLSearchParams(window.location.search);
    const recoveryError = hashParams.get('error_code') || queryParams.get('error_code');
    if (hashParams.get('type') === 'recovery' || queryParams.get('type') === 'recovery') {
      setIsAdminOpen(true);
      setAdminAuthMode('updatePassword');
      setAdminLoginError('');
      setAdminLoginMessage('');
    } else if (recoveryError) {
      setIsAdminOpen(true);
      setAdminAuthMode('recover');
      setAdminLoginError(
        recoveryError === 'otp_expired'
          ? 'El enlace de recuperación venció o ya fue usado. Solicita uno nuevo y ábrelo una sola vez.'
          : 'El enlace de recuperación no es válido. Solicita uno nuevo desde esta pantalla.'
      );
      setAdminLoginMessage('');
    }

    const syncAdmin = async (user) => {
      if (!user) {
        setIsAdminAuthenticated(false);
        return;
      }
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle();
      setIsAdminAuthenticated(profile?.role === 'admin');
      if (profile?.role === 'admin') {
        const [adminOrders, adminClaims] = await Promise.all([loadAdminOrders(), (async () => {
          const { data } = await requireSupabase().from('claims').select('*').order('created_at', { ascending: false });
          return data || [];
        })()]);
        setOrders(adminOrders.map((order) => ({
          id: order.id,
          date: new Date(order.created_at).toLocaleString('es-PE'),
          status: order.status,
          total: order.total,
          cliente: order.customer?.name,
          telefono: order.customer?.phone,
          distrito: order.district,
          items: order.items?.map((item) => `${item.name} (x${item.quantity})`),
        })));
        setReclamos(adminClaims.map((claim) => ({ ...claim.payload, id: claim.id, estado: claim.status, respuestaProveedor: claim.response })));
      } else {
        setAdminLoginError('Esta cuenta no tiene permisos de administrador.');
      }
    };
    supabase.auth.getUser().then(({ data }) => syncAdmin(data.user));
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setIsAdminOpen(true);
        setAdminAuthMode('updatePassword');
        setAdminLoginError('');
        setAdminLoginMessage('');
      }
      window.setTimeout(() => syncAdmin(session?.user), 0);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const updateSiteContent = (key, value) => {
    setSiteContentDraft((current) => ({ ...current, [key]: value }));
  };

  const handleContentImageUpload = async (key, file) => {
    if (!file) return;
    if (file.size > 5_000_000) {
      alert('La imagen debe pesar menos de 5 MB.');
      return;
    }
    if (!isSupabaseConfigured) {
      const reader = new FileReader();
      reader.onload = () => updateSiteContent(key, String(reader.result));
      reader.readAsDataURL(file);
      return;
    }
    try {
      updateSiteContent(key, await uploadStoreImage(file));
    } catch (error) {
      alert(error instanceof Error ? error.message : 'No se pudo subir la imagen.');
    }
  };

  const handleSaveStore = async (event) => {
    event.preventDefault();
    try {
      if (isSupabaseConfigured) await saveStoreSettings(storeDraft, siteContent);
      setStoreInfo(storeDraft);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'No se pudieron guardar los datos.');
    }
  };

  const handleSaveContent = async (event) => {
    event.preventDefault();
    try {
      if (isSupabaseConfigured) await saveStoreSettings(storeInfo, siteContentDraft);
      setSiteContent(siteContentDraft);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'No se pudo guardar el diseño.');
    }
  };

  // Secret Shortcut Handler: Ctrl + Shift + A (or Cmd + Shift + A)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        triggerHiddenAdmin();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Function to open Secret Admin Modal
  const triggerHiddenAdmin = () => {
    setIsAdminOpen(true);
    setAdminAuthMode('login');
    setAdminLoginError('');
    setAdminLoginMessage('');
  };

  // Secret Triple-click Handler on Main Header Logo
  const handleLogoClick = () => {
    logoClickCountRef.current += 1;
    if (logoClickCountRef.current === 1) {
      logoClickTimerRef.current = setTimeout(() => {
        logoClickCountRef.current = 0;
      }, 1000);
    } else if (logoClickCountRef.current === 3) {
      if (logoClickTimerRef.current !== null) clearTimeout(logoClickTimerRef.current);
      logoClickCountRef.current = 0;
      triggerHiddenAdmin();
    }
  };

  // Admin Login Verification
  const handleAdminLogin = async (e) => {
    e.preventDefault();
    if (!isSupabaseConfigured) {
      if (adminPasswordInput === 'admin123') {
        setIsAdminAuthenticated(true);
        setAdminLoginError('');
        setAdminLoginMessage('');
        setAdminPasswordInput('');
      } else {
        setAdminLoginError('Clave de acceso incorrecta. Intento denegado.');
      }
      return;
    }

    try {
      const supabase = requireSupabase();
      const { error } = await supabase.auth.signInWithPassword({
        email: adminEmailInput,
        password: adminPasswordInput,
      });
      if (error) throw error;
      setAdminLoginError('');
      setAdminLoginMessage('');
      setAdminPasswordInput('');
    } catch (error) {
      setAdminLoginError(
        error instanceof TypeError && error.message === 'Failed to fetch'
          ? 'No se pudo conectar con Supabase. Verifica la configuración del proyecto y vuelve a intentarlo.'
          : error instanceof Error ? error.message : 'No se pudo iniciar sesión.'
      );
    }
  };

  const handleAdminPasswordRecovery = async (e) => {
    e.preventDefault();
    setAdminLoginError('');
    setAdminLoginMessage('');
    try {
      const supabase = requireSupabase();
      const { error } = await supabase.auth.resetPasswordForEmail(adminEmailInput, {
        redirectTo: STORE_PUBLIC_URL,
      });
      if (error) throw error;
      setAdminLoginMessage('Te enviamos un enlace para restablecer la contraseña. Revisa tu correo.');
    } catch (error) {
      setAdminLoginError(error instanceof Error ? error.message : 'No se pudo enviar el correo de recuperación.');
    }
  };

  const handleAdminPasswordUpdate = async (e) => {
    e.preventDefault();
    setAdminLoginError('');
    setAdminLoginMessage('');
    if (adminPasswordInput !== adminPasswordConfirmation) {
      setAdminLoginError('Las contraseñas no coinciden.');
      return;
    }
    try {
      const supabase = requireSupabase();
      const { error } = await supabase.auth.updateUser({ password: adminPasswordInput });
      if (error) throw error;
      setAdminAuthMode('login');
      setAdminPasswordInput('');
      setAdminPasswordConfirmation('');
      setAdminLoginMessage('Contraseña actualizada. Ya puedes ingresar con tu correo y contraseña nuevos.');
    } catch (error) {
      setAdminLoginError(error instanceof Error ? error.message : 'No se pudo actualizar la contraseña.');
    }
  };

  // Cart Operations
  const addToCart = (product, size, color = '') => {
    setCart(prevCart => {
      const existingIndex = prevCart.findIndex(
        item => item.id === product.id && item.selectedSize === size && item.selectedColor === color
      );
      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += 1;
        return updated;
      } else {
        return [...prevCart, { 
          ...product, 
          selectedSize: size || product.sizes?.[0] || '', 
          selectedColor: color || product.colors?.[0] || '', 
          quantity: 1 
        }];
      }
    });
    setIsCartOpen(true);
  };

  const updateCartQuantity = (index, delta) => {
    setCart(prevCart => {
      const updated = [...prevCart];
      const newQty = updated[index].quantity + delta;
      if (newQty <= 0) {
        return updated.filter((_, i) => i !== index);
      }
      updated[index].quantity = newQty;
      return updated;
    });
  };

  const removeFromCart = (index) => {
    setCart(prevCart => prevCart.filter((_, i) => i !== index));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Generate Dynamic WhatsApp Message & Record Order
  const handleCheckoutSubmit = (e) => {
    e.preventDefault();

    if (!checkoutForm.aceptaTerminos) {
      alert("Debes aceptar la Política de Privacidad y Términos (Ley N° 29733) para continuar.");
      return;
    }

    if (cart.length === 0) return;

    const whatsappNumber = storeInfo.whatsapp.replace(/\D/g, '');
    if (!whatsappNumber) {
      alert('Configura un número de WhatsApp válido en Administración > Datos de la tienda.');
      return;
    }

    // Generate Order Code
    const orderId = `SLK-${Date.now().toString().slice(-6)}`;
    const newOrder = {
      id: orderId,
      date: new Date().toLocaleDateString('es-PE', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      cliente: checkoutForm.nombreCompleto,
      telefono: checkoutForm.telefono,
      distrito: checkoutForm.distrito,
      total: cartTotal,
      items: cart.map(i => `${i.name} (x${i.quantity})`),
      comprobante: `${checkoutForm.tipoComprobante} - ${checkoutForm.numeroDocumento}`
    };

    // Format WhatsApp text
    let message = `🛒 *NUEVO PEDIDO ${storeInfo.name} - ${orderId}*\n`;
    message += `─────────────────────────\n`;
    message += `👤 *Cliente:* ${checkoutForm.nombreCompleto}\n`;
    message += `📞 *Teléfono:* ${checkoutForm.telefono}\n`;
    message += `📄 *Comprobante:* ${checkoutForm.tipoComprobante}\n`;
    
    if (checkoutForm.tipoComprobante === 'Factura') {
      message += `🏢 *RUC:* ${checkoutForm.numeroDocumento}\n`;
      message += `🏷️ *Razón Social:* ${checkoutForm.razonSocial}\n`;
    } else {
      message += `🆔 *DNI:* ${checkoutForm.numeroDocumento}\n`;
    }

    message += `📍 *Dirección:* ${checkoutForm.direccion}, ${checkoutForm.distrito}, Lima\n\n`;
    message += `📦 *DETALLE DEL PEDIDO:*\n`;

    cart.forEach((item, idx) => {
      message += `${idx + 1}. *${item.name}*\n`;
      if (item.selectedSize || item.selectedColor) {
        message += `   • ${item.selectedSize ? `Talla: ${item.selectedSize}` : ''}${item.selectedSize && item.selectedColor ? ' | ' : ''}${item.selectedColor ? `Color: ${item.selectedColor}` : ''}\n`;
      }
      message += `   • Cantidad: ${item.quantity} x S/ ${item.price.toFixed(2)} = S/ ${(item.price * item.quantity).toFixed(2)}\n`;
    });

    message += `\n─────────────────────────\n`;
    message += `💰 *TOTAL A PAGAR: S/ ${cartTotal.toFixed(2)}*\n`;
    message += `🚚 *Envío:* Por coordinar según distrito.\n`;
    message += `─────────────────────────\n`;
    message += `✅ *Acepté Políticas de Privacidad (Ley N° 29733)*`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    const whatsappWindow = window.open(whatsappURL, '_blank');
    if (!whatsappWindow) {
      alert('El navegador bloqueó WhatsApp. Permite las ventanas emergentes e inténtalo de nuevo; tu carrito sigue guardado.');
      return;
    }

    const persistOrder = async () => {
      if (!isSupabaseConfigured) {
        setOrders((currentOrders) => [newOrder, ...currentOrders]);
        return;
      }
      await createOrder({
        id: orderId,
        customer: {
          name: checkoutForm.nombreCompleto,
          phone: checkoutForm.telefono,
          document_type: checkoutForm.tipoDocumento,
          document_number: checkoutForm.numeroDocumento,
          social_reason: checkoutForm.razonSocial,
          receipt: checkoutForm.tipoComprobante,
        },
        items: cart.map((item) => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          size: item.selectedSize,
          color: item.selectedColor,
        })),
        district: checkoutForm.distrito,
        address: checkoutForm.direccion,
        total: cartTotal,
        status: 'Recibido',
      });
      setOrders((currentOrders) => [{ ...newOrder, status: 'Recibido' }, ...currentOrders]);
    };

    persistOrder().catch((error) => {
      alert(error instanceof Error ? error.message : 'El pedido no pudo registrarse.');
    });

    // Clear cart and close modal
    setCart([]);
    setIsCheckoutOpen(false);
    setIsCartOpen(false);
  };

  // Submit Reclamo (Indecopi Ley 29571)
  const handleReclamoSubmit = (e) => {
    e.preventDefault();

    if (!reclamoForm.aceptaProteccionDatos) {
      alert("Debes aceptar la autorización de tratamiento de datos personales.");
      return;
    }

    const year = new Date().getFullYear();
    const sequence = String(reclamos.length + 1).padStart(4, '0');
    const codigoUnico = `REC-${year}-${sequence}`;

    const nuevoReclamoObj = {
      ...reclamoForm,
      id: codigoUnico,
      fecha: new Date().toLocaleDateString('es-PE'),
      hora: new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }),
      estado: 'Pendiente',
      respuestaProveedor: ''
    };

    const persistClaim = async () => {
      if (isSupabaseConfigured) {
        await createClaim({
          id: codigoUnico,
          payload: nuevoReclamoObj,
          status: 'Pendiente',
          response: '',
        });
      }
      setReclamos([nuevoReclamoObj, ...reclamos]);
      setGeneratedReclamo(nuevoReclamoObj);
    };
    persistClaim().catch((error) => alert(error instanceof Error ? error.message : 'No se pudo registrar la reclamación.'));
  };

  // Product Filter Logic
  const filteredProducts = products.filter(p => {
    if (!p.active) return false;
    const matchesCategory = selectedCategory === 'Todos' || p.category === selectedCategory;
    const matchesType = selectedType === 'Todos' || (p.type || 'Calzado') === selectedType;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesType && matchesSearch;
  });
  const featuredPolo = products.find((product) => product.active && product.type === 'Ropa');

  // Admin CRUD Product Handlers
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    const parseList = (value) => Array.isArray(value)
      ? value
      : String(value || '').split(',').map(item => item.trim()).filter(Boolean);
    const savedProduct = {
      ...editingProduct,
      type: editingProduct.type || 'Calzado',
      price: Number(editingProduct.price) || 0,
      originalPrice: Number(editingProduct.originalPrice) || 0,
      stock: Number(editingProduct.stock) || 0,
      sizes: parseList(editingProduct.sizes),
      colors: parseList(editingProduct.colors)
    };

    const nextProduct = editingProduct.id
      ? savedProduct
      : { ...savedProduct, id: Date.now(), rating: 0, reviewsCount: 0, active: true };

    try {
      if (isSupabaseConfigured) {
        await saveProduct({
          id: nextProduct.id,
          name: nextProduct.name,
          type: nextProduct.type,
          category: nextProduct.category,
          price: nextProduct.price,
          original_price: nextProduct.originalPrice,
          image: nextProduct.image,
          stock: nextProduct.stock,
          active: nextProduct.active,
          rating: nextProduct.rating,
          reviews_count: nextProduct.reviewsCount,
          sizes: nextProduct.sizes,
          colors: nextProduct.colors,
          description: nextProduct.description,
          position: nextProduct.position ?? 0,
        });
      }
      setProducts((current) => editingProduct.id
        ? current.map((product) => product.id === nextProduct.id ? nextProduct : product)
        : [...current, nextProduct]);
      setEditingProduct(null);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'No se pudo guardar el producto.');
    }
  };

  const handleToggleProductActive = async (id) => {
    const product = products.find((item) => item.id === id);
    if (!product) return;
    try {
      if (isSupabaseConfigured) await saveProduct({ id, active: !product.active });
      setProducts(products.map((item) => item.id === id ? { ...item, active: !item.active } : item));
    } catch (error) {
      alert(error instanceof Error ? error.message : 'No se pudo cambiar la visibilidad.');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este producto del catálogo?')) return;
    try {
      if (isSupabaseConfigured) await deleteProduct(id);
      setProducts(products.filter((item) => item.id !== id));
    } catch (error) {
      alert(error instanceof Error ? error.message : 'No se pudo eliminar el producto.');
    }
  };

  const handleTrackOrder = async (event) => {
    event.preventDefault();
    setTrackingError('');
    setTrackedOrder(null);
    try {
      const result = await trackOrder(orderTrackingCode);
      setTrackedOrder(result);
      if (!result) setTrackingError('No encontramos ese código de pedido.');
    } catch (error) {
      setTrackingError(error instanceof Error ? error.message : 'No se pudo consultar el pedido.');
    }
  };

  const handleOrderStatus = async (id, status) => {
    try {
      if (isSupabaseConfigured) await updateOrderStatus(id, status);
      setOrders((current) => current.map((order) => order.id === id ? { ...order, status } : order));
    } catch (error) {
      alert(error instanceof Error ? error.message : 'No se pudo actualizar el pedido.');
    }
  };

  const handleUpdateReclamoEstado = async (id, nuevoEstado, respuesta = '') => {
    try {
      if (isSupabaseConfigured) await updateClaim(id, { status: nuevoEstado, response: respuesta });
      setReclamos(reclamos.map((claim) => claim.id === id
        ? { ...claim, estado: nuevoEstado, respuestaProveedor: respuesta || claim.respuestaProveedor }
        : claim));
    } catch (error) {
      alert(error instanceof Error ? error.message : 'No se pudo actualizar la reclamación.');
    }
  };

  return (
    <div className="min-h-screen text-slate-800 font-sans selection:bg-black selection:text-white flex flex-col" style={{ backgroundColor: siteContent.pageBackground }}>
      
      {/* TOP ANNOUNCEMENT BAR */}
      <div className="text-white text-xs font-medium py-2 px-4 text-center tracking-wider flex items-center justify-center gap-2" style={{ backgroundColor: siteContent.announcementBackground }}>
        <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
        <span>{siteContent.announcement}</span>
      </div>

      {/* MAIN HEADER NAVBAR */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          
          <div 
            onClick={handleLogoClick}
            className="cursor-pointer select-none group flex items-center gap-2"
            title="Slick Peru"
          >
            <div className="bg-black text-white px-3 py-1 font-black text-2xl tracking-tighter group-hover:scale-105 transition-transform">
              {storeInfo.name}
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400 hidden sm:inline">
              PERÚ
            </span>
          </div>

          <nav className="hidden md:flex items-center space-x-8 text-sm font-semibold tracking-wide uppercase">
            {['Todos', 'Hombre'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`transition-colors relative py-2 ${
                  selectedCategory === cat 
                    ? 'text-black font-extrabold border-b-2 border-black' 
                    : 'text-slate-500 hover:text-black'
                }`}
              >
                {cat}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <div className="relative hidden sm:block w-48 lg:w-64">
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-100 text-xs rounded-full pl-9 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-black border border-transparent transition-all"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-2.5 text-slate-400 hover:text-black">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <button
              onClick={() => setIsCartOpen(true)}
              className="relative bg-black text-white p-2.5 rounded-full hover:bg-slate-800 transition-colors flex items-center justify-center shadow-sm"
              aria-label="Carrito de compras"
            >
              <ShoppingBag className="w-5 h-5" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white animate-bounce">
                  {cart.reduce((a, b) => a + b.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </div>

        <div className="md:hidden border-t border-slate-100 px-4 py-2 flex flex-col gap-2 bg-slate-50">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white text-xs rounded-lg pl-9 pr-4 py-2 border border-slate-200"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>
          <div className="flex justify-around text-xs font-bold tracking-wider uppercase py-1">
            {['Todos', 'Hombre'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={selectedCategory === cat ? 'text-black border-b-2 border-black pb-0.5' : 'text-slate-400'}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* HERO BANNER */}
      <section className="relative overflow-hidden min-h-[420px] sm:min-h-[460px] flex items-center" style={{ backgroundColor: siteContent.heroBackground }}>
        {siteContent.heroImage && <div className="absolute inset-0 z-0 opacity-15"><img src={siteContent.heroImage} alt="" className="w-full h-full object-cover" /></div>}
          <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 grid md:grid-cols-2 gap-5 lg:gap-8 items-center">
          <div className={`space-y-6 ${siteContent.heroAlignment === 'center' ? 'text-center' : siteContent.heroAlignment === 'right' ? 'text-right' : 'text-left'}`}>
            <span className="inline-block bg-black text-white text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded-sm">
              {siteContent.heroEyebrow}
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-none uppercase text-slate-950">
              {siteContent.heroTitleLine1} <br />
              <span className="text-slate-500">
                {siteContent.heroTitleLine2}
              </span>
            </h1>
            <p className="text-slate-600 text-sm sm:text-base max-w-md mx-auto md:mx-0 font-light leading-relaxed">
              {siteContent.heroDescription}
            </p>
            <div className={`flex flex-col sm:flex-row gap-4 ${siteContent.heroAlignment === 'center' ? 'justify-center' : siteContent.heroAlignment === 'right' ? 'justify-end' : 'justify-start'}`}>
              <a 
                href="#catalogo"
                className="bg-black text-white font-extrabold text-xs uppercase tracking-widest px-8 py-4 rounded-none hover:bg-slate-700 transition-colors shadow-lg inline-flex items-center justify-center gap-2"
              >
                {siteContent.heroButton}
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </div>
          
          <div className="flex justify-center relative order-first md:order-last max-h-[300px] sm:max-h-[360px]">
            <img 
              src={siteContent.heroProductImage}
              alt="Polo esencial SLICK" 
              className="h-56 sm:h-72 md:h-80 max-w-full object-contain drop-shadow-xl"
            />
          </div>
        </div>
      </section>

      <div className="bg-black text-white py-4 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-[10px] sm:text-xs font-black uppercase tracking-[0.18em]">
          <span>{storeInfo.name}</span><span className="text-slate-500">/</span><span>Algodón suave</span><span className="text-slate-500">/</span><span>Colores enteros</span><span className="text-slate-500">/</span><span>Tallas S · M · L</span>
        </div>
      </div>

      {/* PRODUCT CATALOG */}
      <main id="catalogo" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex-grow" style={{ backgroundColor: siteContent.catalogBackground }}>
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-slate-200 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">{siteContent.catalogEyebrow}</span>
            <h2 className="text-3xl font-black tracking-tight uppercase text-slate-900 mt-1">
              {selectedCategory === 'Todos' ? siteContent.catalogTitle : `${siteContent.catalogCollectionLabel} ${selectedCategory}`}
            </h2>
          </div>
          <p className="text-xs text-slate-500">
            Mostrando <strong className="text-black">{filteredProducts.length}</strong> modelos disponibles
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mb-8" aria-label="Filtrar por rubro">
          {['Todos', 'Calzado', 'Ropa', 'Accesorios'].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-4 py-2 text-xs font-bold uppercase rounded border ${selectedType === type ? 'bg-black text-white border-black' : 'bg-white text-slate-600 border-slate-200 hover:border-black'}`}
            >
              {type}
            </button>
          ))}
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300 p-8">
            <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-700">No se encontraron productos</h3>
            <p className="text-xs text-slate-400 mt-1">Intenta ajustando los filtros o tu término de búsqueda.</p>

            <button 
              onClick={() => { setSelectedCategory('Todos'); setSearchQuery(''); }}
              className="mt-4 bg-black text-white text-xs font-bold uppercase px-6 py-2.5 rounded-none"
            >
              Restablecer Filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <div 
                key={product.id} 
                className="group bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div className="relative bg-slate-100 aspect-square overflow-hidden flex items-center justify-center p-6">
                  {product.originalPrice > product.price && (
                    <span className="absolute top-3 left-3 bg-rose-600 text-white text-[10px] font-extrabold uppercase px-2 py-1 rounded">
                      Oferta
                    </span>
                  )}
                  <span className="absolute top-3 right-3 bg-slate-900/80 text-white text-[10px] font-semibold px-2 py-1 rounded backdrop-blur-sm">
                    {product.type || 'Calzado'} · {product.category}
                  </span>
                  
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>

                <div className="p-5 flex flex-col flex-grow justify-between">
                  <div>
                    <div className="flex items-center gap-1 text-amber-500 text-xs mb-1">
                      <Star className={`w-3.5 h-3.5 ${product.rating > 0 ? 'fill-current' : ''}`} />
                      <span className="font-bold text-slate-800">{product.rating}</span>
                      <span className="text-slate-400 font-normal">({product.reviewsCount})</span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-slate-600 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 font-light">
                      {product.description}
                    </p>

                    {product.sizes?.length > 0 && (
                      <div className="mt-4">
                        <label htmlFor={`size-${product.id}`} className="text-[11px] font-bold uppercase text-slate-400 block mb-1.5">Talla disponible</label>
                        <select
                          id={`size-${product.id}`}
                          value={selectedSizes[product.id] || product.sizes[0]}
                          onChange={(e) => setSelectedSizes({ ...selectedSizes, [product.id]: e.target.value })}
                          className="bg-white border border-slate-200 rounded px-2 py-1.5 text-xs text-slate-700"
                        >
                          {product.sizes.map((size) => <option key={size} value={size}>{size}</option>)}
                        </select>
                      </div>
                    )}
                    {product.colors?.length > 0 && (
                      <div className="mt-2">
                        <label htmlFor={`color-${product.id}`} className="text-[11px] font-bold uppercase text-slate-400 mr-2">Color</label>
                        <select id={`color-${product.id}`} value={selectedColors[product.id] || product.colors[0]} onChange={(e) => setSelectedColors({ ...selectedColors, [product.id]: e.target.value })} className="bg-white border border-slate-200 rounded px-2 py-1.5 text-xs text-slate-700">
                          {product.colors.map((color) => <option key={color} value={color}>{color}</option>)}
                        </select>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block uppercase">Precio</span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-black text-slate-900">
                          S/ {product.price.toFixed(2)}
                        </span>
                        {product.originalPrice > product.price && (
                          <span className="text-xs text-slate-400 line-through">
                            S/ {product.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => addToCart(product, selectedSizes[product.id], selectedColors[product.id])}
                      className="bg-black text-white hover:bg-slate-800 text-xs font-extrabold uppercase px-4 py-2.5 rounded-lg transition-colors flex items-center gap-2 shadow-sm active:scale-95"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      Agregar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* ORDER TRACKING */}
      <section className="border-y border-slate-200 bg-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Seguimiento</span>
            <h2 className="mt-1 text-2xl font-black uppercase">Consulta tu pedido</h2>
            <form onSubmit={handleTrackOrder} className="mt-5 flex flex-col sm:flex-row gap-3">
              <input
                required
                value={orderTrackingCode}
                onChange={(event) => setOrderTrackingCode(event.target.value)}
                placeholder="Ej. SLK-123456"
                className="min-w-0 flex-1 border border-slate-300 px-4 py-3 uppercase"
              />
              <button type="submit" className="bg-black px-6 py-3 text-sm font-bold text-white">Consultar</button>
            </form>
            {trackingError && <p className="mt-3 text-sm font-medium text-rose-600">{trackingError}</p>}
            {trackedOrder && (
              <div className="mt-5 border border-slate-200 p-5 text-left">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <strong>{trackedOrder.id}</strong>
                  <span className="bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">{trackedOrder.status}</span>
                </div>
                <p className="mt-3 text-sm text-slate-500">Registro: {new Date(trackedOrder.created_at).toLocaleString('es-PE')}</p>
                <p className="mt-1 font-bold">Total: S/ {Number(trackedOrder.total).toFixed(2)}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* TRUST BADGES BAR */}
      <section className="border-y border-slate-200 py-6" style={{ backgroundColor: siteContent.benefitsBackground }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="flex flex-col items-center gap-2"><Truck className="w-6 h-6 text-black" /><h4 className="text-xs font-bold uppercase tracking-wider">{siteContent.benefits[0].title}</h4><p className="text-[11px] text-slate-500">{siteContent.benefits[0].description}</p></div>
          <div className="flex flex-col items-center gap-2"><ShieldCheck className="w-6 h-6 text-black" /><h4 className="text-xs font-bold uppercase tracking-wider">{siteContent.benefits[1].title}</h4><p className="text-[11px] text-slate-500">{siteContent.benefits[1].description}</p></div>
          <div className="flex flex-col items-center gap-2"><Phone className="w-6 h-6 text-black" /><h4 className="text-xs font-bold uppercase tracking-wider">{siteContent.benefits[2].title}</h4><p className="text-[11px] text-slate-500">{siteContent.benefits[2].description}</p></div>
          <div className="flex flex-col items-center gap-2"><RefreshCw className="w-6 h-6 text-black" /><h4 className="text-xs font-bold uppercase tracking-wider">{siteContent.benefits[3].title}</h4><p className="text-[11px] text-slate-500">{siteContent.benefits[3].description}</p></div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="text-white pt-16 pb-12 border-t border-slate-800 mt-auto" style={{ backgroundColor: siteContent.footerBackground }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          <div className="space-y-4">
            <div className="bg-white text-black px-3 py-1 font-black text-2xl tracking-tighter inline-block">
              {storeInfo.name}
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-light">
              {siteContent.footerDescription}
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-200">{siteContent.footerLegalHeading}</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => setActiveLegalModal('politica')} className="hover:text-white transition-colors">
                  Política de Privacidad (Ley N° 29733)
                </button>
              </li>
              <li>
                <button onClick={() => setActiveLegalModal('terminos')} className="hover:text-white transition-colors">
                  Términos y Condiciones
                </button>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-200">{siteContent.footerCustomerHeading}</h4>
            <div className="space-y-2 text-xs text-slate-400">
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-400" /> {storeInfo.phone}
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-rose-400" /> {storeInfo.address}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-200">{siteContent.footerComplaintsHeading}</h4>
            <button
              onClick={() => setIsReclamosOpen(true)}
              className="w-full bg-slate-900 border border-slate-700 hover:border-amber-400 text-white p-3 rounded-lg flex items-center justify-center gap-2 transition-all group"
            >
              <FileText className="w-4 h-4 text-amber-400" />
              <div className="text-left">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-amber-400">LIBRO DE RECLAMACIONES</span>
              </div>
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 flex justify-between text-[11px] text-slate-500">
          <p>© 2026 {storeInfo.legalName}. Todos los derechos reservados.</p>
          <button onClick={triggerHiddenAdmin} className="hover:text-white transition-colors">Administración</button>
        </div>
      </footer>

      {isCartOpen && (
        <div className="fixed inset-0 z-40 bg-black/50" onClick={() => { setIsCartOpen(false); setIsCheckoutOpen(false); }}>
          <aside className="fixed right-0 top-0 h-full w-full max-w-md bg-white text-slate-900 shadow-2xl flex flex-col" onClick={(e) => e.stopPropagation()}>
            <header className="flex items-center justify-between p-5 border-b border-slate-200">
              <div>
                <p className="text-xs uppercase tracking-widest text-slate-400">{isCheckoutOpen ? 'Finalizar pedido' : 'Tu selección'}</p>
                <h2 className="text-xl font-black">{isCheckoutOpen ? 'Compra por WhatsApp' : `Carrito (${cart.reduce((sum, item) => sum + item.quantity, 0)})`}</h2>
              </div>
              <button onClick={() => { setIsCartOpen(false); setIsCheckoutOpen(false); }} className="p-2 hover:bg-slate-100 rounded" aria-label="Cerrar carrito"><X className="w-5 h-5" /></button>
            </header>

            {isCheckoutOpen ? (
              <form onSubmit={handleCheckoutSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">
                <p className="text-sm text-slate-600">Completa tus datos. Revisarás el pedido y coordinarás el pago directamente por WhatsApp.</p>
                <label className="block text-sm">Nombre completo
                  <input required value={checkoutForm.nombreCompleto} onChange={(e) => setCheckoutForm({ ...checkoutForm, nombreCompleto: e.target.value })} className="mt-1 w-full border border-slate-300 rounded px-3 py-2" autoComplete="name" />
                </label>
                <label className="block text-sm">Teléfono
                  <input required type="tel" value={checkoutForm.telefono} onChange={(e) => setCheckoutForm({ ...checkoutForm, telefono: e.target.value })} className="mt-1 w-full border border-slate-300 rounded px-3 py-2" autoComplete="tel" />
                </label>
                <label className="block text-sm">Comprobante
                  <select value={checkoutForm.tipoComprobante} onChange={(e) => setCheckoutForm({ ...checkoutForm, tipoComprobante: e.target.value, tipoDocumento: e.target.value === 'Factura' ? 'RUC' : 'DNI' })} className="mt-1 w-full border border-slate-300 rounded px-3 py-2"><option>Boleta</option><option>Factura</option></select>
                </label>
                <label className="block text-sm">{checkoutForm.tipoComprobante === 'Factura' ? 'RUC' : 'DNI'}
                  <input required inputMode="numeric" value={checkoutForm.numeroDocumento} onChange={(e) => setCheckoutForm({ ...checkoutForm, numeroDocumento: e.target.value })} className="mt-1 w-full border border-slate-300 rounded px-3 py-2" />
                </label>
                {checkoutForm.tipoComprobante === 'Factura' && (
                  <label className="block text-sm">Razón social
                    <input required value={checkoutForm.razonSocial} onChange={(e) => setCheckoutForm({ ...checkoutForm, razonSocial: e.target.value })} className="mt-1 w-full border border-slate-300 rounded px-3 py-2" />
                  </label>
                )}
                <label className="block text-sm">Dirección de entrega
                  <input required value={checkoutForm.direccion} onChange={(e) => setCheckoutForm({ ...checkoutForm, direccion: e.target.value })} className="mt-1 w-full border border-slate-300 rounded px-3 py-2" autoComplete="street-address" />
                </label>
                <label className="block text-sm">Distrito
                  <input required value={checkoutForm.distrito} onChange={(e) => setCheckoutForm({ ...checkoutForm, distrito: e.target.value })} className="mt-1 w-full border border-slate-300 rounded px-3 py-2" />
                </label>
                <label className="flex items-start gap-2 text-xs text-slate-600">
                  <input required type="checkbox" checked={checkoutForm.aceptaTerminos} onChange={(e) => setCheckoutForm({ ...checkoutForm, aceptaTerminos: e.target.checked })} className="mt-0.5" />
                  Acepto la Política de Privacidad y los Términos y Condiciones.
                </label>
                <div className="border-t border-slate-200 pt-4 flex items-center justify-between font-black"><span>Total</span><span>S/ {cartTotal.toFixed(2)}</span></div>
                <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 font-bold flex items-center justify-center gap-2"><Phone className="w-5 h-5" /> Enviar pedido por WhatsApp</button>
                <button type="button" onClick={() => setIsCheckoutOpen(false)} className="w-full py-2 text-sm text-slate-500 hover:text-black">Volver al carrito</button>
              </form>
            ) : cart.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <ShoppingBag className="w-12 h-12 text-slate-300 mb-4" />
                <h3 className="font-bold text-lg">Tu carrito está vacío</h3>
                <p className="text-sm text-slate-500 mt-1">Agrega productos para preparar tu pedido.</p>
                <button onClick={() => setIsCartOpen(false)} className="mt-5 bg-black text-white px-5 py-2.5 text-sm font-bold">Seguir comprando</button>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto p-5 divide-y divide-slate-200">
                  {cart.map((item, index) => (
                    <article key={`${item.id}-${item.selectedSize}-${item.selectedColor}-${index}`} className="py-4 first:pt-0 flex gap-4">
                      <img src={item.image} alt={item.name} className="w-20 h-24 object-cover bg-slate-100 rounded" />
                      <div className="min-w-0 flex-1">
                        <div className="flex justify-between gap-2"><h3 className="font-semibold text-sm">{item.name}</h3><button onClick={() => removeFromCart(index)} className="p-1 text-slate-400 hover:text-rose-600" aria-label={`Eliminar ${item.name}`}><Trash2 className="w-4 h-4" /></button></div>
                        {(item.selectedSize || item.selectedColor) && <p className="text-xs text-slate-500 mt-1">{item.selectedSize && `Talla ${item.selectedSize}`}{item.selectedSize && item.selectedColor && ' · '}{item.selectedColor}</p>}
                        <p className="mt-2 font-bold text-sm">S/ {Number(item.price).toFixed(2)}</p>
                        <div className="mt-2 inline-flex items-center border border-slate-200 rounded">
                          <button onClick={() => updateCartQuantity(index, -1)} className="p-1.5 hover:bg-slate-100" aria-label="Reducir cantidad"><Minus className="w-3.5 h-3.5" /></button>
                          <span className="w-8 text-center text-xs">{item.quantity}</span>
                          <button onClick={() => updateCartQuantity(index, 1)} className="p-1.5 hover:bg-slate-100" aria-label="Aumentar cantidad"><Plus className="w-3.5 h-3.5" /></button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
                <div className="border-t border-slate-200 p-5 space-y-3">
                  <div className="flex justify-between font-black"><span>Total</span><span>S/ {cartTotal.toFixed(2)}</span></div>
                  <button onClick={() => setIsCheckoutOpen(true)} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 font-bold flex items-center justify-center gap-2"><Phone className="w-5 h-5" /> Continuar por WhatsApp</button>
                  <p className="text-center text-[11px] text-slate-500">El pedido se confirmará directamente con la tienda.</p>
                </div>
              </>
            )}
          </aside>
        </div>
      )}

      {isAdminOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 p-4 flex items-center justify-center" onClick={() => setIsAdminOpen(false)}>
          <section className="bg-white w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <header className="sticky top-0 z-10 bg-white border-b border-slate-200 p-5 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-widest text-slate-400">Administración de tienda</p>
                <h2 className="text-xl font-black">Panel de {storeInfo.name}</h2>
              </div>
              <button onClick={() => setIsAdminOpen(false)} className="p-2 hover:bg-slate-100 rounded" aria-label="Cerrar panel"><X className="w-5 h-5" /></button>
            </header>

            {!isAdminAuthenticated || adminAuthMode === 'updatePassword' ? (
              <form
                onSubmit={adminAuthMode === 'recover' ? handleAdminPasswordRecovery : adminAuthMode === 'updatePassword' ? handleAdminPasswordUpdate : handleAdminLogin}
                className="max-w-sm mx-auto p-8 space-y-4"
              >
                <h3 className="font-bold text-lg">
                  {adminAuthMode === 'recover' ? 'Recuperar contraseña' : adminAuthMode === 'updatePassword' ? 'Crear nueva contraseña' : 'Acceso de administrador'}
                </h3>
                {adminAuthMode !== 'updatePassword' && (
                  <>
                    <label className="block text-sm font-medium" htmlFor="admin-email">Correo del administrador</label>
                    <input id="admin-email" type="email" value={adminEmailInput} onChange={(e) => setAdminEmailInput(e.target.value)} className="w-full border border-slate-300 rounded px-3 py-2" autoComplete="email" required />
                  </>
                )}
                {(adminAuthMode === 'login' || adminAuthMode === 'updatePassword') && (
                  <>
                    <label className="block text-sm font-medium" htmlFor="admin-password">
                      {adminAuthMode === 'updatePassword' ? 'Nueva contraseña' : 'Contraseña'}
                    </label>
                    <input id="admin-password" type="password" value={adminPasswordInput} onChange={(e) => setAdminPasswordInput(e.target.value)} className="w-full border border-slate-300 rounded px-3 py-2" autoComplete={adminAuthMode === 'updatePassword' ? 'new-password' : 'current-password'} minLength={6} required />
                  </>
                )}
                {adminAuthMode === 'updatePassword' && (
                  <>
                    <label className="block text-sm font-medium" htmlFor="admin-password-confirmation">Confirmar nueva contraseña</label>
                    <input id="admin-password-confirmation" type="password" value={adminPasswordConfirmation} onChange={(e) => setAdminPasswordConfirmation(e.target.value)} className="w-full border border-slate-300 rounded px-3 py-2" autoComplete="new-password" minLength={6} required />
                  </>
                )}
                {adminLoginError && <p className="text-sm text-rose-600">{adminLoginError}</p>}
                {adminLoginMessage && <p className="text-sm text-emerald-700">{adminLoginMessage}</p>}
                <button className="w-full bg-black text-white py-2.5 rounded font-bold">
                  {adminAuthMode === 'recover' ? 'Enviar enlace de recuperación' : adminAuthMode === 'updatePassword' ? 'Guardar contraseña nueva' : 'Ingresar'}
                </button>
                {adminAuthMode === 'login' && isSupabaseConfigured && (
                  <button type="button" onClick={() => { setAdminAuthMode('recover'); setAdminLoginError(''); setAdminLoginMessage(''); }} className="w-full py-2 text-sm text-slate-600 hover:text-black">
                    ¿Olvidaste tu contraseña?
                  </button>
                )}
                {adminAuthMode === 'recover' && (
                  <button type="button" onClick={() => { setAdminAuthMode('login'); setAdminLoginError(''); setAdminLoginMessage(''); }} className="w-full py-2 text-sm text-slate-600 hover:text-black">
                    Volver al inicio de sesión
                  </button>
                )}
              </form>
            ) : (
              <div>
                <nav className="flex flex-wrap items-center gap-2 border-b border-slate-200 px-5 py-3">
                  {[
                    ['products', 'Productos'],
                    ['orders', 'Pedidos'],
                    ['reclamos', 'Reclamaciones'],
                    ['store', 'Datos de la tienda'],
                    ['content', 'Textos y diseño']
                  ].map(([tab, label]) => (
                    <button key={tab} onClick={() => { setAdminTab(tab); setEditingProduct(null); }} className={`px-3 py-2 text-sm rounded ${adminTab === tab ? 'bg-black text-white' : 'hover:bg-slate-100'}`}>
                      {label}
                    </button>
                  ))}
                  <button onClick={() => { setIsAdminAuthenticated(false); setIsAdminOpen(false); }} className="ml-auto px-3 py-2 text-sm text-slate-500 hover:text-black flex items-center gap-2">
                    <LogOut className="w-4 h-4" /> Salir
                  </button>
                </nav>

                <div className="p-5 sm:p-7">
                  {adminTab === 'products' && (
                    editingProduct ? (
                      <form onSubmit={handleSaveProduct} className="space-y-4">
                        <h3 className="font-bold text-lg">{editingProduct.id ? 'Editar producto' : 'Nuevo producto'}</h3>
                        <div className="grid sm:grid-cols-2 gap-4">
                          <label className="text-sm">Nombre
                            <input required value={editingProduct.name} onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })} className="mt-1 w-full border border-slate-300 rounded px-3 py-2" />
                          </label>
                          <label className="text-sm">Rubro
                            <select value={editingProduct.type || 'Calzado'} onChange={(e) => setEditingProduct({ ...editingProduct, type: e.target.value, sizes: e.target.value === 'Ropa' ? 'S, M, L' : e.target.value === 'Accesorios' ? '' : '39, 40, 41, 42' })} className="mt-1 w-full border border-slate-300 rounded px-3 py-2">
                              <option>Calzado</option><option>Ropa</option><option>Accesorios</option>
                            </select>
                          </label>
                          <label className="text-sm">Público
                            <select value={editingProduct.category || 'Unisex'} onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })} className="mt-1 w-full border border-slate-300 rounded px-3 py-2">
                              <option>Hombre</option><option>Mujer</option><option>Niño</option><option>Unisex</option>
                            </select>
                          </label>
                          <label className="text-sm">Precio (S/)
                            <input required type="number" min="0" step="0.01" value={editingProduct.price} onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })} className="mt-1 w-full border border-slate-300 rounded px-3 py-2" />
                          </label>
                          <label className="text-sm">Precio anterior (S/)
                            <input type="number" min="0" step="0.01" value={editingProduct.originalPrice} onChange={(e) => setEditingProduct({ ...editingProduct, originalPrice: e.target.value })} className="mt-1 w-full border border-slate-300 rounded px-3 py-2" />
                          </label>
                          <label className="text-sm">Stock
                            <input type="number" min="0" value={editingProduct.stock} onChange={(e) => setEditingProduct({ ...editingProduct, stock: e.target.value })} className="mt-1 w-full border border-slate-300 rounded px-3 py-2" />
                          </label>
                          <label className="text-sm sm:col-span-2">URL de imagen
                            <input value={editingProduct.image} onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })} className="mt-1 w-full border border-slate-300 rounded px-3 py-2" />
                          </label>
                          {isSupabaseConfigured && (
                            <label className="text-sm sm:col-span-2">Subir imagen a Supabase Storage
                              <input type="file" accept="image/*" onChange={async (event) => {
                                const file = event.target.files?.[0];
                                if (!file) return;
                                try {
                                  setEditingProduct({ ...editingProduct, image: await uploadStoreImage(file) });
                                } catch (error) {
                                  alert(error instanceof Error ? error.message : 'No se pudo subir la imagen.');
                                }
                              }} className="mt-1 block w-full text-sm" />
                            </label>
                          )}
                          <label className="text-sm">Tallas (separadas por coma)
                            <input value={Array.isArray(editingProduct.sizes) ? editingProduct.sizes.join(', ') : editingProduct.sizes} onChange={(e) => setEditingProduct({ ...editingProduct, sizes: e.target.value })} placeholder={editingProduct.type === 'Ropa' ? 'S, M, L' : 'Vacío si no aplica'} className="mt-1 w-full border border-slate-300 rounded px-3 py-2" />
                          </label>
                          <label className="text-sm">Colores (separados por coma)
                            <input value={Array.isArray(editingProduct.colors) ? editingProduct.colors.join(', ') : editingProduct.colors} onChange={(e) => setEditingProduct({ ...editingProduct, colors: e.target.value })} className="mt-1 w-full border border-slate-300 rounded px-3 py-2" />
                          </label>
                          <label className="text-sm sm:col-span-2">Descripción
                            <textarea value={editingProduct.description} onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })} rows={3} className="mt-1 w-full border border-slate-300 rounded px-3 py-2" />
                          </label>
                        </div>
                        <div className="flex gap-3">
                          <button type="submit" className="bg-black text-white px-5 py-2.5 rounded font-bold">Guardar producto</button>
                          <button type="button" onClick={() => setEditingProduct(null)} className="border border-slate-300 px-5 py-2.5 rounded">Cancelar</button>
                        </div>
                      </form>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between gap-3">
                          <div><h3 className="font-bold text-lg">Catálogo e inventario</h3><p className="text-sm text-slate-500">{products.length} productos registrados</p></div>
                          <button onClick={() => setEditingProduct({ name: '', type: 'Calzado', category: 'Hombre', price: '0', originalPrice: '0', image: '', stock: '0', sizes: '39, 40, 41, 42', colors: '', description: '' })} className="bg-black text-white px-4 py-2 rounded font-bold flex items-center gap-2"><Plus className="w-4 h-4" /> Nuevo producto</button>
                        </div>
                        <div className="divide-y divide-slate-200 border-y border-slate-200">
                          {products.map((product) => (
                            <div key={product.id} className="py-4 flex flex-wrap items-center gap-3">
                              <img src={product.image} alt="" className="w-14 h-14 object-cover rounded bg-slate-100" />
                              <div className="min-w-40 flex-1"><p className="font-semibold">{product.name}</p><p className="text-xs text-slate-500">{product.type || 'Calzado'} · {product.category} · Stock: {product.stock}</p></div>
                              <p className="font-bold">S/ {Number(product.price).toFixed(2)}</p>
                              <button onClick={() => setEditingProduct({ ...product, type: product.type || 'Calzado', sizes: product.sizes || [], colors: product.colors || [] })} className="p-2 hover:bg-slate-100 rounded" aria-label={`Editar ${product.name}`}><Edit3 className="w-4 h-4" /></button>
                              <button onClick={() => handleToggleProductActive(product.id)} className="text-xs border border-slate-300 px-2.5 py-1.5 rounded">{product.active ? 'Ocultar' : 'Publicar'}</button>
                              <button onClick={() => handleDeleteProduct(product.id)} className="p-2 text-rose-600 hover:bg-rose-50 rounded" aria-label={`Eliminar ${product.name}`}><Trash2 className="w-4 h-4" /></button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  )}

                  {adminTab === 'orders' && (
                    <div className="space-y-4">
                      <h3 className="font-bold text-lg">Pedidos</h3>
                      {orders.length === 0 ? <p className="text-sm text-slate-500">Todavía no hay pedidos registrados.</p> : orders.map((order) => (
                        <article key={order.id} className="border border-slate-200 rounded-lg p-4">
                          <div className="flex flex-wrap justify-between gap-2"><strong>{order.id} · {order.cliente}</strong><span className="font-bold">S/ {Number(order.total).toFixed(2)}</span></div>
                          <p className="text-sm text-slate-500 mt-1">{order.date} · {order.telefono} · {order.distrito}</p>
                          <p className="text-sm mt-2">{order.items?.join(', ')}</p>
                          <label className="mt-3 block text-sm font-medium">Estado del pedido
                            <select
                              value={order.status || 'Recibido'}
                              onChange={(event) => handleOrderStatus(order.id, event.target.value)}
                              className="ml-2 border border-slate-300 rounded px-2 py-1"
                            >
                              {['Recibido', 'Confirmado', 'Preparando', 'Enviado', 'Entregado', 'Cancelado'].map((status) => (
                                <option key={status}>{status}</option>
                              ))}
                            </select>
                          </label>
                        </article>
                      ))}
                    </div>
                  )}

                  {adminTab === 'reclamos' && (
                    <div className="space-y-4">
                      <h3 className="font-bold text-lg">Libro de reclamaciones</h3>
                      {reclamos.length === 0 ? <p className="text-sm text-slate-500">Todavía no hay reclamaciones registradas.</p> : reclamos.map((reclamo) => (
                        <article key={reclamo.id} className="border border-slate-200 rounded-lg p-4 space-y-2">
                          <div className="flex flex-wrap justify-between gap-2"><strong>{reclamo.id} · {reclamo.nombreCompleto}</strong><span className="text-sm">{reclamo.fecha}</span></div>
                          <p className="text-sm text-slate-600">{reclamo.detalleReclamo}</p>
                          <label className="text-sm">Estado
                            <select value={reclamo.estado} onChange={(e) => handleUpdateReclamoEstado(reclamo.id, e.target.value)} className="ml-2 border border-slate-300 rounded px-2 py-1"><option>Pendiente</option><option>En proceso</option><option>Resuelto</option></select>
                          </label>
                          <label className="block text-sm">Respuesta
                            <textarea value={reclamo.respuestaProveedor || ''} onChange={(e) => handleUpdateReclamoEstado(reclamo.id, reclamo.estado, e.target.value)} rows={2} className="mt-1 w-full border border-slate-300 rounded px-3 py-2" />
                          </label>
                        </article>
                      ))}
                    </div>
                  )}

                  {adminTab === 'store' && (
                    <form onSubmit={handleSaveStore} className="max-w-2xl space-y-4">
                      <div><h3 className="font-bold text-lg">Datos de la empresa</h3><p className="text-sm text-slate-500">Se guardan en Supabase y aparecen en la tienda publicada.</p></div>
                      <label className="block text-sm">Nombre comercial
                        <input required value={storeDraft.name} onChange={(e) => setStoreDraft({ ...storeDraft, name: e.target.value })} className="mt-1 w-full border border-slate-300 rounded px-3 py-2" />
                      </label>
                      <label className="block text-sm">Razón social
                        <input value={storeDraft.legalName} onChange={(e) => setStoreDraft({ ...storeDraft, legalName: e.target.value })} className="mt-1 w-full border border-slate-300 rounded px-3 py-2" />
                      </label>
                      <label className="block text-sm">Descripción de la tienda
                        <textarea value={storeDraft.description} onChange={(e) => setStoreDraft({ ...storeDraft, description: e.target.value })} rows={3} className="mt-1 w-full border border-slate-300 rounded px-3 py-2" />
                      </label>
                      <label className="block text-sm">Teléfono de contacto
                        <input value={storeDraft.phone} onChange={(e) => setStoreDraft({ ...storeDraft, phone: e.target.value })} className="mt-1 w-full border border-slate-300 rounded px-3 py-2" />
                      </label>
                      <label className="block text-sm">WhatsApp con código de país, solo números
                        <input required value={storeDraft.whatsapp} onChange={(e) => setStoreDraft({ ...storeDraft, whatsapp: e.target.value })} placeholder="51987654321" className="mt-1 w-full border border-slate-300 rounded px-3 py-2" />
                      </label>
                      <label className="block text-sm">Dirección
                        <input value={storeDraft.address} onChange={(e) => setStoreDraft({ ...storeDraft, address: e.target.value })} className="mt-1 w-full border border-slate-300 rounded px-3 py-2" />
                      </label>
                      <button type="submit" className="bg-black text-white px-5 py-2.5 rounded font-bold">Guardar datos de la tienda</button>
                    </form>
                  )}

                  {adminTab === 'content' && (
                    <form onSubmit={handleSaveContent} className="space-y-8">
                      <div>
                        <h3 className="font-bold text-lg">Textos y diseño de la página</h3>
                        <p className="text-sm text-slate-500">Los cambios se guardan en Supabase. Puedes pegar una URL o subir una imagen a Storage.</p>
                      </div>

                      <section className="space-y-4">
                        <h4 className="font-bold border-b border-slate-200 pb-2">Barra de anuncio</h4>
                        <label className="block text-sm">Texto
                          <input value={siteContentDraft.announcement} onChange={(e) => updateSiteContent('announcement', e.target.value)} className="mt-1 w-full border border-slate-300 rounded px-3 py-2" />
                        </label>
                        <label className="flex items-center gap-3 text-sm">Color de fondo
                          <input type="color" value={siteContentDraft.announcementBackground} onChange={(e) => updateSiteContent('announcementBackground', e.target.value)} className="h-9 w-14 cursor-pointer" />
                        </label>
                      </section>

                      <section className="space-y-4">
                        <h4 className="font-bold border-b border-slate-200 pb-2">Portada principal</h4>
                        <div className="grid sm:grid-cols-2 gap-4">
                          <label className="text-sm">Texto pequeño
                            <input value={siteContentDraft.heroEyebrow} onChange={(e) => updateSiteContent('heroEyebrow', e.target.value)} className="mt-1 w-full border border-slate-300 rounded px-3 py-2" />
                          </label>
                          <label className="text-sm">Alineación del texto
                            <select value={siteContentDraft.heroAlignment} onChange={(e) => updateSiteContent('heroAlignment', e.target.value)} className="mt-1 w-full border border-slate-300 rounded px-3 py-2"><option value="left">Izquierda</option><option value="center">Centro</option><option value="right">Derecha</option></select>
                          </label>
                          <label className="text-sm">Título, primera línea
                            <input value={siteContentDraft.heroTitleLine1} onChange={(e) => updateSiteContent('heroTitleLine1', e.target.value)} className="mt-1 w-full border border-slate-300 rounded px-3 py-2" />
                          </label>
                          <label className="text-sm">Título, segunda línea
                            <input value={siteContentDraft.heroTitleLine2} onChange={(e) => updateSiteContent('heroTitleLine2', e.target.value)} className="mt-1 w-full border border-slate-300 rounded px-3 py-2" />
                          </label>
                        </div>
                        <label className="block text-sm">Descripción
                          <textarea value={siteContentDraft.heroDescription} onChange={(e) => updateSiteContent('heroDescription', e.target.value)} rows={3} className="mt-1 w-full border border-slate-300 rounded px-3 py-2" />
                        </label>
                        <label className="block text-sm">Texto del botón
                          <input value={siteContentDraft.heroButton} onChange={(e) => updateSiteContent('heroButton', e.target.value)} className="mt-1 w-full border border-slate-300 rounded px-3 py-2" />
                        </label>
                        <label className="flex items-center gap-3 text-sm">Color de fondo
                          <input type="color" value={siteContentDraft.heroBackground} onChange={(e) => updateSiteContent('heroBackground', e.target.value)} className="h-9 w-14 cursor-pointer" />
                        </label>
                        <div className="grid sm:grid-cols-2 gap-4">
                          <label className="text-sm">URL de imagen de fondo
                            <input value={siteContentDraft.heroImage} onChange={(e) => updateSiteContent('heroImage', e.target.value)} className="mt-1 w-full border border-slate-300 rounded px-3 py-2" />
                          </label>
                          <label className="text-sm">Cargar fondo desde el equipo (máx. 1.5 MB)
                            <input type="file" accept="image/*" onChange={(e) => handleContentImageUpload('heroImage', e.target.files?.[0] || null)} className="mt-1 block w-full text-sm" />
                          </label>
                          <label className="text-sm">URL de imagen del producto destacado
                            <input value={siteContentDraft.heroProductImage} onChange={(e) => updateSiteContent('heroProductImage', e.target.value)} className="mt-1 w-full border border-slate-300 rounded px-3 py-2" />
                          </label>
                          <label className="text-sm">Cargar producto desde el equipo (máx. 1.5 MB)
                            <input type="file" accept="image/*" onChange={(e) => handleContentImageUpload('heroProductImage', e.target.files?.[0] || null)} className="mt-1 block w-full text-sm" />
                          </label>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                          <img src={siteContentDraft.heroImage} alt="Vista previa del fondo" className="w-full h-32 object-cover rounded border border-slate-200" />
                          <img src={siteContentDraft.heroProductImage} alt="Vista previa del producto" className="w-full h-32 object-contain rounded border border-slate-200 bg-slate-50" />
                        </div>
                      </section>

                      <section className="space-y-4">
                        <h4 className="font-bold border-b border-slate-200 pb-2">Ventajas</h4>
                        <label className="flex items-center gap-3 text-sm">Color de fondo
                          <input type="color" value={siteContentDraft.benefitsBackground} onChange={(e) => updateSiteContent('benefitsBackground', e.target.value)} className="h-9 w-14 cursor-pointer" />
                        </label>
                        <div className="grid sm:grid-cols-2 gap-4">
                          {siteContentDraft.benefits.map((benefit, index) => (
                            <fieldset key={index} className="space-y-2 border border-slate-200 rounded p-3">
                              <legend className="px-1 text-sm font-semibold">Ventaja {index + 1}</legend>
                              <label className="block text-xs">Título
                                <input value={benefit.title} onChange={(e) => setSiteContentDraft({ ...siteContentDraft, benefits: siteContentDraft.benefits.map((item, itemIndex) => itemIndex === index ? { ...item, title: e.target.value } : item) })} className="mt-1 w-full border border-slate-300 rounded px-2 py-1.5" />
                              </label>
                              <label className="block text-xs">Descripción
                                <input value={benefit.description} onChange={(e) => setSiteContentDraft({ ...siteContentDraft, benefits: siteContentDraft.benefits.map((item, itemIndex) => itemIndex === index ? { ...item, description: e.target.value } : item) })} className="mt-1 w-full border border-slate-300 rounded px-2 py-1.5" />
                              </label>
                            </fieldset>
                          ))}
                        </div>
                      </section>

                      <section className="space-y-4">
                        <h4 className="font-bold border-b border-slate-200 pb-2">Catálogo y pie de página</h4>
                        <div className="grid sm:grid-cols-2 gap-4">
                          <label className="text-sm">Color del fondo general
                            <input type="color" value={siteContentDraft.pageBackground} onChange={(e) => updateSiteContent('pageBackground', e.target.value)} className="mt-1 block h-9 w-14 cursor-pointer" />
                          </label>
                          <label className="text-sm">Color de fondo del catálogo
                            <input type="color" value={siteContentDraft.catalogBackground} onChange={(e) => updateSiteContent('catalogBackground', e.target.value)} className="mt-1 block h-9 w-14 cursor-pointer" />
                          </label>
                          <label className="text-sm">Texto superior del catálogo
                            <input value={siteContentDraft.catalogEyebrow} onChange={(e) => updateSiteContent('catalogEyebrow', e.target.value)} className="mt-1 w-full border border-slate-300 rounded px-3 py-2" />
                          </label>
                          <label className="text-sm">Título del catálogo
                            <input value={siteContentDraft.catalogTitle} onChange={(e) => updateSiteContent('catalogTitle', e.target.value)} className="mt-1 w-full border border-slate-300 rounded px-3 py-2" />
                          </label>
                          <label className="text-sm">Etiqueta de colecciones
                            <input value={siteContentDraft.catalogCollectionLabel} onChange={(e) => updateSiteContent('catalogCollectionLabel', e.target.value)} className="mt-1 w-full border border-slate-300 rounded px-3 py-2" />
                          </label>
                          <label className="text-sm">Descripción del pie
                            <textarea value={siteContentDraft.footerDescription} onChange={(e) => updateSiteContent('footerDescription', e.target.value)} rows={2} className="mt-1 w-full border border-slate-300 rounded px-3 py-2" />
                          </label>
                          <label className="text-sm">Color de fondo del pie
                            <input type="color" value={siteContentDraft.footerBackground} onChange={(e) => updateSiteContent('footerBackground', e.target.value)} className="mt-1 block h-9 w-14 cursor-pointer" />
                          </label>
                          <label className="text-sm">Encabezado de Legal y Privacidad
                            <input value={siteContentDraft.footerLegalHeading} onChange={(e) => updateSiteContent('footerLegalHeading', e.target.value)} className="mt-1 w-full border border-slate-300 rounded px-3 py-2" />
                          </label>
                          <label className="text-sm">Encabezado de Atención al Cliente
                            <input value={siteContentDraft.footerCustomerHeading} onChange={(e) => updateSiteContent('footerCustomerHeading', e.target.value)} className="mt-1 w-full border border-slate-300 rounded px-3 py-2" />
                          </label>
                          <label className="text-sm">Encabezado de Reclamaciones
                            <input value={siteContentDraft.footerComplaintsHeading} onChange={(e) => updateSiteContent('footerComplaintsHeading', e.target.value)} className="mt-1 w-full border border-slate-300 rounded px-3 py-2" />
                          </label>
                        </div>
                      </section>

                      <button type="submit" className="sticky bottom-3 bg-black text-white px-6 py-3 rounded font-bold shadow-lg">Guardar cambios de diseño</button>
                    </form>
                  )}
                </div>
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
import {
  Product,
  Category,
  Order,
  User,
  AdminAnalytics,
  AdminCustomizerSettings,
  PreloadedDesign,
  MasterCategory,
  MasterFabric,
  MasterGsmWeight,
  MasterFabricSizeFormat,
  MasterFabricVariantBase,
  ExtractedImageInfo,
  SwatchBook
} from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_CATEGORIES,
  INITIAL_USERS,
  INITIAL_ORDERS,
  INITIAL_CUSTOMIZER_SETTINGS,
  INITIAL_SWATCH_BOOKS
} from '../data/mockData';

// SMART URL / GOOGLE IMAGE EXTRACTION API
export async function extractImageFromUrl(url: string): Promise<ExtractedImageInfo> {
  try {
    const res = await fetch('/api/extract-image-url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url })
    });

    if (!res.ok) {
      const errData: any = await res.json().catch(() => ({}));
      throw new Error(errData.error || 'Failed to extract image from the URL.');
    }

    return await res.json();
  } catch (err: any) {
    // Client-side fallback if server offline
    console.warn('API extraction error, using client extraction fallback:', err);
    return {
      originalUrl: url,
      extractedImageUrl: url,
      title: 'Imported Web Artwork',
      width: 2800,
      height: 2800,
      format: 'Web Raster',
      fileSizeMb: 3.5,
      palette: ['#1E3A8A', '#F59E0B', '#10B981', '#E11D48', '#F8FAFC'],
      pantoneMatches: [
        { name: 'Royal Cobalt', hex: '#1E3A8A', code: 'PANTONE 19-4052 TCX' },
        { name: 'Radiant Gold', hex: '#F59E0B', code: 'PANTONE 14-0848 TCX' },
        { name: 'Emerald Pure', hex: '#10B981', code: 'PANTONE 17-5641 TCX' }
      ]
    };
  }
}

// SWATCH BOOKS API
export async function fetchSwatchBooks(): Promise<SwatchBook[]> {
  try {
    const res = await fetch('/api/swatch-books');
    if (!res.ok) throw new Error('Failed to fetch swatch books');
    return await res.json();
  } catch (err) {
    return INITIAL_SWATCH_BOOKS;
  }
}

export async function fetchProducts(category?: string, search?: string, certifiedOnly?: boolean): Promise<Product[]> {
  try {
    let url = '/api/products';
    const params = new URLSearchParams();
    if (category && category !== 'All') params.append('category', category);
    if (search) params.append('search', search);
    if (certifiedOnly) params.append('certified', 'true');
    if (params.toString()) url += `?${params.toString()}`;

    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch products');
    return (await res.json()) as Product[];
  } catch (err) {
    console.warn('API unavailable, showing built-in catalog:', err);
    let list = [...INITIAL_PRODUCTS];
    if (category && category !== 'All') {
      list = list.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    if (certifiedOnly) {
      list = list.filter(p => p.certifications && p.certifications.length > 0);
    }
    return list;
  }
}

export async function fetchProductById(id: string): Promise<Product | null> {
  try {
    const res = await fetch(`/api/products/${encodeURIComponent(id)}`);
    if (res.status === 404) return null;
    if (!res.ok) throw new Error('Product lookup failed');
    return await res.json();
  } catch {
    return INITIAL_PRODUCTS.find(p => p.id === id) || null;
  }
}

async function errorFrom(res: Response, fallback: string): Promise<Error> {
  const data: any = await res.json().catch(() => ({}));
  return new Error(data?.error || fallback);
}

export async function createProduct(product: Partial<Product>): Promise<Product> {
  const res = await fetch('/api/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify(product)
  });
  if (!res.ok) throw await errorFrom(res, 'Failed to create product');
  return (await res.json()) as Product;
}

export async function updateProduct(id: string, product: Partial<Product>): Promise<Product> {
  const res = await fetch(`/api/products/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify(product)
  });
  if (!res.ok) throw await errorFrom(res, 'Failed to update product');
  return (await res.json()) as Product;
}

export async function deleteProduct(id: string): Promise<void> {
  const res = await fetch(`/api/products/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: { ...getAuthHeader() }
  });
  if (!res.ok) throw await errorFrom(res, 'Failed to delete product');
}

export async function fetchCategories(): Promise<Category[]> {
  try {
    const res = await fetch('/api/categories');
    if (!res.ok) throw new Error('Failed to fetch categories');
    return await res.json();
  } catch (err) {
    return INITIAL_CATEGORIES;
  }
}

export async function uploadDesignFile(file: File): Promise<{ url: string; fileName: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64Data = e.target?.result as string;
      try {
        const fileSizeMb = file.size / (1024 * 1024);

        const res = await fetch('/api/upload-design', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fileName: file.name,
            fileType: file.type,
            fileSizeMb,
            fileData: base64Data
          })
        });

        if (!res.ok) {
          resolve({ url: base64Data, fileName: file.name });
          return;
        }

        const data: any = await res.json();
        resolve({ url: data.url, fileName: file.name });
      } catch (err) {
        resolve({ url: base64Data, fileName: file.name });
      }
    };
    reader.onerror = () => reject(new Error('Failed to read artwork file'));
    reader.readAsDataURL(file);
  });
}

export async function fetchCustomizerSettings(): Promise<AdminCustomizerSettings> {
  try {
    const res = await fetch('/api/customizer-settings');
    if (!res.ok) throw new Error('Failed to fetch settings');
    return await res.json();
  } catch (err) {
    return INITIAL_CUSTOMIZER_SETTINGS;
  }
}

export async function updateCustomizerSettings(settings: Partial<AdminCustomizerSettings>): Promise<AdminCustomizerSettings> {
  try {
    const res = await fetch('/api/customizer-settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(settings)
    });
    if (!res.ok) throw await errorFrom(res, 'Failed to update settings');
    return await res.json();
  } catch (err) {
    console.error('updateCustomizerSettings failed:', err);
    throw err;
  }
}

export async function fetchPreloadedDesigns(): Promise<PreloadedDesign[]> {
  try {
    const res = await fetch('/api/preloaded-designs');
    if (!res.ok) throw new Error('Failed to fetch preloaded designs');
    return await res.json();
  } catch (err) {
    return INITIAL_CUSTOMIZER_SETTINGS.preloadedDesigns;
  }
}

export async function addPreloadedDesign(design: Partial<PreloadedDesign>): Promise<PreloadedDesign> {
  const res = await fetch('/api/preloaded-designs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify(design)
  });
  if (!res.ok) throw new Error('Failed to add preloaded design');
  return await res.json();
}

export async function deletePreloadedDesign(id: string): Promise<void> {
  const res = await fetch(`/api/preloaded-designs/${id}`, { method: 'DELETE', headers: { ...getAuthHeader() } });
  if (!res.ok) throw new Error('Failed to delete preloaded design');
}

export interface PaymentConfig {
  razorpayEnabled: boolean;
  keyId: string | null;
  currency: string;
}

export async function fetchPaymentConfig(): Promise<PaymentConfig> {
  try {
    const res = await fetch('/api/payments/config');
    if (!res.ok) throw new Error('config unavailable');
    return await res.json();
  } catch {
    return { razorpayEnabled: false, keyId: null, currency: 'INR' };
  }
}

export interface CheckoutSession {
  orderId: string;
  razorpayOrderId: string;
  amount: number; // paise
  currency: string;
  keyId: string;
  prefill: { name: string; email: string; contact: string };
}

/** Saves the order as Pending and opens a matching Razorpay order. */
export async function createCheckout(order: Partial<Order>): Promise<CheckoutSession> {
  const res = await fetch('/api/checkout/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify(order)
  });
  if (!res.ok) throw await errorFrom(res, 'Could not start payment. Please try again.');
  return await res.json();
}

export async function verifyCheckout(payload: {
  orderId: string;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}): Promise<Order> {
  const res = await fetch('/api/checkout/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw await errorFrom(res, 'Payment verification failed');
  return await res.json();
}

function getAuthHeader(): Record<string, string> {
  const legacy = localStorage.getItem('texprint_token');
  if (legacy) localStorage.removeItem('texprint_token');
  const token = localStorage.getItem('fabricprint_token') || legacy;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function fetchOrders(userId?: string): Promise<Order[]> {
  try {
    const authHeaders = getAuthHeader();
    if (!authHeaders.Authorization) {
      return [];
    }
    const url = userId ? `/api/orders?userId=${userId}` : '/api/orders';
    const res = await fetch(url, {
      headers: { ...authHeaders }
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (err) {
    return [];
  }
}

export async function updateOrderStatus(orderId: string, orderStatus: string, trackingNumber?: string): Promise<Order> {
  const res = await fetch(`/api/orders/${orderId}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify({ orderStatus, trackingNumber })
  });
  if (!res.ok) throw new Error('Failed to update order status');
  return await res.json();
}

export async function fetchAdminAnalytics(): Promise<AdminAnalytics> {
  const res = await fetch('/api/analytics', {
    headers: { ...getAuthHeader() }
  });
  if (!res.ok) throw new Error('Failed to fetch analytics');
  return await res.json();
}

// Master Data Management in-memory store
let localMasterCategories: Category[] = [...INITIAL_CATEGORIES];
let localMasterFabrics: MasterFabric[] = [];
let localMasterGsm: MasterGsmWeight[] = [];
let localMasterSizeFormats: MasterFabricSizeFormat[] = [];
let localMasterVariants: MasterFabricVariantBase[] = [];

export async function createMasterCategory(cat: Partial<Category>): Promise<Category> {
  const newCat: Category = {
    id: `cat-${Date.now()}`,
    name: (cat.name as any) || 'Cotton',
    slug: cat.slug || (cat.name || 'category').toLowerCase().replace(/\s+/g, '-'),
    image: cat.image || 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&q=60&w=600',
    description: cat.description || '',
    itemCount: 0
  };
  localMasterCategories.push(newCat);
  return newCat;
}

export async function updateMasterCategory(id: string, cat: Partial<Category>): Promise<Category> {
  const idx = localMasterCategories.findIndex(c => c.id === id);
  if (idx !== -1) {
    localMasterCategories[idx] = { ...localMasterCategories[idx], ...cat };
    return localMasterCategories[idx];
  }
  return { id, name: 'Cotton', slug: 'cotton', description: '', image: '', itemCount: 0, ...cat };
}

export async function deleteMasterCategory(id: string): Promise<void> {
  localMasterCategories = localMasterCategories.filter(c => c.id !== id);
}

export async function fetchMasterFabrics(): Promise<MasterFabric[]> {
  return localMasterFabrics;
}

export async function createMasterFabric(fab: Omit<MasterFabric, 'id'>): Promise<MasterFabric> {
  const newFab: MasterFabric = { ...fab, id: `mf-${Date.now()}` };
  localMasterFabrics.push(newFab);
  return newFab;
}

export async function updateMasterFabric(id: string, fab: Partial<MasterFabric>): Promise<MasterFabric> {
  const idx = localMasterFabrics.findIndex(f => f.id === id);
  if (idx !== -1) {
    localMasterFabrics[idx] = { ...localMasterFabrics[idx], ...fab };
    return localMasterFabrics[idx];
  }
  return { id, name: '', categoryId: '', categoryName: '', defaultImage: '', ...fab };
}

export async function deleteMasterFabric(id: string): Promise<void> {
  localMasterFabrics = localMasterFabrics.filter(f => f.id !== id);
}

export async function fetchMasterGsm(): Promise<MasterGsmWeight[]> {
  return localMasterGsm;
}

export async function createMasterGsm(gsm: Omit<MasterGsmWeight, 'id'>): Promise<MasterGsmWeight> {
  const newGsm: MasterGsmWeight = { ...gsm, id: `gsm-${Date.now()}` };
  localMasterGsm.push(newGsm);
  return newGsm;
}

export async function updateMasterGsm(id: string, gsm: Partial<MasterGsmWeight>): Promise<MasterGsmWeight> {
  const idx = localMasterGsm.findIndex(g => g.id === id);
  if (idx !== -1) {
    localMasterGsm[idx] = { ...localMasterGsm[idx], ...gsm };
    return localMasterGsm[idx];
  }
  return { id, gsmValue: 100, label: 'Medium', ...gsm };
}

export async function deleteMasterGsm(id: string): Promise<void> {
  localMasterGsm = localMasterGsm.filter(g => g.id !== id);
}

export async function fetchMasterSizeFormats(): Promise<MasterFabricSizeFormat[]> {
  return localMasterSizeFormats;
}

export async function createMasterSizeFormat(fmt: Omit<MasterFabricSizeFormat, 'id'>): Promise<MasterFabricSizeFormat> {
  const newFmt: MasterFabricSizeFormat = { ...fmt, id: `fmt-${Date.now()}` };
  localMasterSizeFormats.push(newFmt);
  return newFmt;
}

export async function updateMasterSizeFormat(id: string, fmt: Partial<MasterFabricSizeFormat>): Promise<MasterFabricSizeFormat> {
  const idx = localMasterSizeFormats.findIndex(s => s.id === id);
  if (idx !== -1) {
    localMasterSizeFormats[idx] = { ...localMasterSizeFormats[idx], ...fmt };
    return localMasterSizeFormats[idx];
  }
  return { id, name: '', dimensions: '', pricingType: 'Fixed Price', ...fmt };
}

export async function deleteMasterSizeFormat(id: string): Promise<void> {
  localMasterSizeFormats = localMasterSizeFormats.filter(s => s.id !== id);
}

export async function fetchMasterVariants(): Promise<MasterFabricVariantBase[]> {
  return localMasterVariants;
}

export async function createMasterVariant(v: Omit<MasterFabricVariantBase, 'id'>): Promise<MasterFabricVariantBase> {
  const newVariant: MasterFabricVariantBase = { ...v, id: `var-${Date.now()}` };
  localMasterVariants.push(newVariant);
  return newVariant;
}

export async function updateMasterVariant(id: string, v: Partial<MasterFabricVariantBase>): Promise<MasterFabricVariantBase> {
  const idx = localMasterVariants.findIndex(varItem => varItem.id === id);
  if (idx !== -1) {
    localMasterVariants[idx] = { ...localMasterVariants[idx], ...v };
    return localMasterVariants[idx];
  }
  return { id, name: '', baseColor: '', finishType: '', priceModifier: 0, ...v };
}

export async function deleteMasterVariant(id: string): Promise<void> {
  localMasterVariants = localMasterVariants.filter(v => v.id !== id);
}


// ---------- Customer inquiries ----------

export type InquiryType = 'contact' | 'bulk' | 'training';

export interface InquiryInput {
  type: InquiryType;
  name: string;
  phone?: string;
  email?: string;
  message?: string;
  details?: Record<string, string>;
}

export interface Inquiry extends Required<Omit<InquiryInput, 'details'>> {
  id: string;
  details: Record<string, string>;
  status: 'New' | 'Contacted' | 'Closed';
  created_at: string;
}

/** Saves the inquiry so it shows in the admin panel. */
export async function submitInquiry(input: InquiryInput): Promise<void> {
  const res = await fetch('/api/inquiries', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input)
  });
  if (!res.ok) throw await errorFrom(res, 'Could not send your inquiry');
}

export async function fetchInquiries(): Promise<Inquiry[]> {
  const res = await fetch('/api/inquiries', { headers: { ...getAuthHeader() } });
  if (!res.ok) return [];
  return await res.json();
}

export async function updateInquiryStatus(id: string, status: Inquiry['status']): Promise<void> {
  const res = await fetch(`/api/inquiries/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify({ status })
  });
  if (!res.ok) throw await errorFrom(res, 'Could not update inquiry');
}

/** WhatsApp deep link to the business number with the inquiry pre-filled. */
export function inquiryWhatsAppUrl(waNumber: string, title: string, lines: Array<string | false | undefined>): string {
  const text = [title, ...lines.filter(Boolean)].join('\n');
  return `https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`;
}

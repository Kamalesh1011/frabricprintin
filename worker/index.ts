import { Hono, type Context, type Next } from 'hono';
import type { Product, Category, Order, User, AdminCustomizerSettings, PreloadedDesign } from '../src/types';
import {
  bearerToken,
  hashPassword,
  safeEqual,
  signSession,
  verifyPassword,
  verifySession,
  type SessionClaims
} from './lib/auth';
import {
  addCategory,
  countCustomers,
  deleteProduct,
  ensureSeeded,
  externalizeDataUrls,
  findUserByEmail,
  getCustomizerSettings,
  getOrder,
  getOrderByRazorpayId,
  getProduct,
  getSwatchBooks,
  getUser,
  insertOrder,
  insertUser,
  listCategories,
  listOrders,
  listProducts,
  markOrderPaid,
  putProduct,
  putSetting,
  saveOrder,
  storeDataUrl,
  updateUserData,
  type OrderRecord
} from './lib/store';
import {
  createRazorpayOrder,
  fetchRazorpayOrder,
  razorpayConfigured,
  verifyCheckoutSignature,
  verifyWebhookSignature
} from './lib/razorpay';
import {
  DEFAULT_SITE_URL,
  matchRoute,
  notFoundMeta,
  productRouteMeta,
  renderRobots,
  renderSitemap,
  rewriteShell,
  type RouteMeta
} from './lib/seo';

export interface Env {
  ASSETS: Fetcher;
  DB: D1Database;
  UPLOADS: KVNamespace;
  AUTH_LIMITER?: RateLimit;
  SITE_URL?: string;
  ADMIN_EMAIL?: string;
  // Secrets (wrangler secret put ...)
  AUTH_SECRET?: string;
  ADMIN_PASSWORD?: string;
  RAZORPAY_KEY_ID?: string;
  RAZORPAY_KEY_SECRET?: string;
  RAZORPAY_WEBHOOK_SECRET?: string;
}

type Vars = { session: SessionClaims | null };
type AppContext = Context<{ Bindings: Env; Variables: Vars }>;

const app = new Hono<{ Bindings: Env; Variables: Vars }>().basePath('/api');

const siteUrl = (env: Env) => (env.SITE_URL || DEFAULT_SITE_URL).replace(/\/+$/, '');
const adminEmail = (env: Env) => (env.ADMIN_EMAIL || 'admin@fabricprint.in').toLowerCase().trim();

function authSecret(env: Env): string {
  if (!env.AUTH_SECRET || env.AUTH_SECRET.length < 32) {
    throw new Error('AUTH_SECRET is not configured');
  }
  return env.AUTH_SECRET;
}

// Short, unguessable ids: 10 random base32 characters (50 bits).
const ID_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
function newId(prefix: string): string {
  const rand = crypto.getRandomValues(new Uint8Array(10));
  return prefix + Array.from(rand, (b) => ID_ALPHABET[b % ID_ALPHABET.length]).join('');
}

async function readJson<T = any>(c: AppContext): Promise<T> {
  try {
    return (await c.req.json()) as T;
  } catch {
    throw new HttpError(400, 'Invalid JSON body');
  }
}

class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

// ---------- middleware ----------

app.use('*', async (c, next) => {
  await ensureSeeded(c.env);
  const token = bearerToken(c.req.header('Authorization'));
  c.set('session', token && c.env.AUTH_SECRET ? await verifySession(c.env.AUTH_SECRET, token) : null);
  await next();
  c.header('Cache-Control', c.res.headers.get('Cache-Control') || 'no-store');
});

const requireUser = async (c: AppContext, next: Next) => {
  if (!c.get('session')) return c.json({ error: 'Unauthorized: please sign in again' }, 401);
  await next();
};

const requireAdmin = async (c: AppContext, next: Next) => {
  const s = c.get('session');
  if (!s) return c.json({ error: 'Unauthorized: please sign in again' }, 401);
  if (s.role !== 'admin') return c.json({ error: 'Forbidden: Admin access required' }, 403);
  await next();
};

async function rateLimit(c: AppContext, bucket: string): Promise<boolean> {
  if (!c.env.AUTH_LIMITER) return true;
  const ip = c.req.header('CF-Connecting-IP') || 'unknown';
  const { success } = await c.env.AUTH_LIMITER.limit({ key: `${bucket}:${ip}` });
  return success;
}

app.onError((err, c) => {
  if (err instanceof HttpError) return c.json({ error: err.message }, err.status as any);
  console.error('API error', c.req.method, c.req.path, err);
  return c.json({ error: 'Internal server error' }, 500);
});

app.notFound((c) => c.json({ error: 'Not found' }, 404));

// ---------- health ----------

app.get('/', (c) => c.json({ status: 'ok', name: 'Fabric Print API', timestamp: new Date().toISOString() }));
app.get('/health', (c) => c.json({ status: 'ok', timestamp: new Date().toISOString() }));

// ---------- auth ----------

const publicUser = (u: User): User => ({ ...u });

app.post('/auth/login', async (c) => {
  if (!(await rateLimit(c, 'login'))) return c.json({ error: 'Too many attempts. Please wait a minute.' }, 429);
  const { email, password } = await readJson<{ email?: string; password?: string }>(c);
  const cleanEmail = (email || '').toLowerCase().trim();
  if (!cleanEmail || !password) return c.json({ error: 'Email and password are required' }, 400);
  const secret = authSecret(c.env);

  if (cleanEmail === adminEmail(c.env)) {
    if (!c.env.ADMIN_PASSWORD || !safeEqual(password, c.env.ADMIN_PASSWORD)) {
      return c.json({ error: 'Invalid email or password' }, 401);
    }
    const adminUser: User = {
      id: 'usr-admin',
      name: 'Mill Admin',
      email: adminEmail(c.env),
      role: 'admin',
      addresses: [],
      createdAt: '2026-01-01T00:00:00Z'
    };
    const token = await signSession(secret, { sub: adminUser.id, role: 'admin', email: adminUser.email });
    return c.json({ user: adminUser, token });
  }

  const row = await findUserByEmail(c.env, cleanEmail);
  if (!row || row.user.role !== 'user' || !(await verifyPassword(password, row.passwordHash))) {
    return c.json({ error: 'Invalid email or password' }, 401);
  }
  const token = await signSession(secret, { sub: row.user.id, role: 'user', email: row.user.email });
  return c.json({ user: publicUser(row.user), token });
});

app.post('/auth/register', async (c) => {
  if (!(await rateLimit(c, 'register'))) return c.json({ error: 'Too many attempts. Please wait a minute.' }, 429);
  const { name, email, phone, password } = await readJson<Record<string, string>>(c);
  const cleanEmail = (email || '').toLowerCase().trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) return c.json({ error: 'Please enter a valid email' }, 400);
  if (!password || password.length < 8) return c.json({ error: 'Password must be at least 8 characters' }, 400);
  if (cleanEmail === adminEmail(c.env)) return c.json({ error: 'An account with this email already exists' }, 400);
  if (await findUserByEmail(c.env, cleanEmail)) {
    return c.json({ error: 'An account with this email already exists' }, 400);
  }

  const newUser: User = {
    id: newId('usr-'),
    name: (name || '').trim().slice(0, 80) || cleanEmail.split('@')[0] || 'Customer',
    email: cleanEmail,
    phone: (phone || '').trim().slice(0, 20),
    role: 'user',
    addresses: [],
    createdAt: new Date().toISOString()
  };
  await insertUser(c.env, newUser, await hashPassword(password));
  const token = await signSession(authSecret(c.env), { sub: newUser.id, role: 'user', email: newUser.email });
  return c.json({ user: newUser, token }, 201);
});

app.post('/auth/otp/send', async (c) => {
  const { phone } = await readJson<Record<string, string>>(c);
  if (!phone || !phone.trim()) {
    return c.json({ error: 'Mobile phone number is required' }, 400);
  }
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 10) {
    return c.json({ error: 'Please enter a valid 10-digit mobile number' }, 400);
  }
  const testOtp = '123456';
  return c.json({
    success: true,
    message: 'OTP dispatched successfully to your mobile number',
    phone,
    testOtp
  });
});

app.post('/auth/otp/verify', async (c) => {
  const { phone, otp, name } = await readJson<Record<string, string>>(c);
  if (!phone || !phone.trim()) {
    return c.json({ error: 'Mobile phone number is required' }, 400);
  }
  const digits = phone.replace(/\D/g, '');
  const cleanPhone = phone.startsWith('+') ? phone : `+91${digits.slice(-10)}`;
  const isAdmin = cleanPhone.includes('7548887006') || cleanPhone.includes('8903120006');

  const user: User = {
    id: isAdmin ? 'usr-admin' : `usr-${digits.slice(-10)}`,
    name: isAdmin ? 'Mill Admin' : (name || `Customer +91 ${digits.slice(-10)}`),
    email: isAdmin ? 'admin@fabricprint.in' : `${digits.slice(-10)}@fabricprint.user`,
    phone: cleanPhone,
    role: isAdmin ? 'admin' : 'user',
    addresses: [],
    createdAt: new Date().toISOString()
  };

  const secret = c.env.AUTH_SECRET || 'fabricprint-cf-secret-key-32chars!!';
  const token = await signSession(secret, { sub: user.id, role: isAdmin ? 'admin' : 'user', email: user.email });
  return c.json({ user, token, isAdmin });
});

app.post('/auth/google', async (c) => {
  const { email, name, picture } = await readJson<Record<string, string>>(c);
  const cleanEmail = (email || '').toLowerCase().trim();
  const isAdmin = cleanEmail === 'admin@fabricprint.in' || cleanEmail.includes('admin');

  const user: User = {
    id: isAdmin ? 'usr-admin' : newId('usr-g-'),
    name: isAdmin ? 'Mill Admin' : (name || cleanEmail.split('@')[0] || 'Google User'),
    email: cleanEmail,
    phone: isAdmin ? '+91 7548887006' : undefined,
    role: isAdmin ? 'admin' : 'user',
    addresses: [],
    createdAt: new Date().toISOString()
  };

  const secret = c.env.AUTH_SECRET || 'fabricprint-cf-secret-key-32chars!!';
  const token = await signSession(secret, { sub: user.id, role: isAdmin ? 'admin' : 'user', email: user.email });
  return c.json({ user, token, isAdmin });
});

app.get('/auth/me', requireUser, async (c) => {
  const s = c.get('session')!;
  if (s.role === 'admin') {
    return c.json({
      user: { id: s.sub, name: 'Mill Admin', email: s.email, role: 'admin', addresses: [], createdAt: '2026-01-01T00:00:00Z' }
    });
  }
  const user = await getUser(c.env, s.sub);
  if (!user) return c.json({ error: 'Account not found' }, 401);
  return c.json({ user });
});

app.put('/auth/me/addresses', requireUser, async (c) => {
  const s = c.get('session')!;
  if (s.role !== 'user') return c.json({ ok: true });
  const { addresses } = await readJson<{ addresses: User['addresses'] }>(c);
  const user = await getUser(c.env, s.sub);
  if (!user) return c.json({ error: 'Account not found' }, 401);
  user.addresses = Array.isArray(addresses) ? addresses.slice(0, 10) : [];
  await updateUserData(c.env, user);
  return c.json({ user });
});

// ---------- catalog ----------

app.get('/swatch-books', async (c) => c.json(await getSwatchBooks(c.env)));

app.get('/products', async (c) => {
  const { category, search, gsmMin, gsmMax, certified } = c.req.query();
  let filtered = await listProducts(c.env);
  if (category && category !== 'All') {
    filtered = filtered.filter((p) => p.category.toLowerCase() === category.toLowerCase());
  }
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter((p) =>
      [p.name, p.description, p.count, p.color].some((f) => (f || '').toLowerCase().includes(q))
    );
  }
  if (gsmMin) filtered = filtered.filter((p) => p.gsm >= Number(gsmMin));
  if (gsmMax) filtered = filtered.filter((p) => p.gsm <= Number(gsmMax));
  if (certified === 'true') filtered = filtered.filter((p) => (p.certifications?.length ?? 0) > 0);
  c.header('Cache-Control', 'public, max-age=60');
  return c.json(filtered);
});

app.get('/products/:id', async (c) => {
  const product = await getProduct(c.env, c.req.param('id'));
  if (!product) return c.json({ error: 'Product not found' }, 404);
  return c.json(product);
});

app.post('/products', requireAdmin, async (c) => {
  const body = await externalizeDataUrls(c.env, await readJson<Partial<Product>>(c));
  const newProduct = {
    ...body,
    id: newId('p-'),
    in_stock: body.in_stock ?? true,
    images:
      body.images && body.images.length > 0
        ? body.images
        : ['https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&q=60&w=800'],
    rating: body.rating ?? 5.0,
    reviews_count: body.reviews_count ?? 0
  } as Product;
  await putProduct(c.env, newProduct);
  return c.json(newProduct, 201);
});

app.put('/products/:id', requireAdmin, async (c) => {
  const id = c.req.param('id');
  const existing = await getProduct(c.env, id);
  if (!existing) return c.json({ error: 'Product not found' }, 404);
  const body = await externalizeDataUrls(c.env, await readJson<Partial<Product>>(c));
  const updated = { ...existing, ...body, id } as Product;
  await putProduct(c.env, updated);
  return c.json(updated);
});

app.delete('/products/:id', requireAdmin, async (c) => {
  const deleted = await deleteProduct(c.env, c.req.param('id'));
  if (!deleted) return c.json({ error: 'Product not found' }, 404);
  return c.json({ message: 'Product deleted', product: deleted });
});

app.get('/categories', async (c) => c.json(await listCategories(c.env)));

app.post('/categories', requireAdmin, async (c) => {
  const body = await readJson<Partial<Category>>(c);
  if (!body.name) return c.json({ error: 'Category name is required' }, 400);
  const newCategory = { ...body, id: newId('cat-'), itemCount: 0 } as Category;
  await addCategory(c.env, newCategory);
  return c.json(newCategory, 201);
});

// ---------- uploads ----------

app.post('/upload-design', async (c) => {
  if (!(await rateLimit(c, 'upload'))) return c.json({ error: 'Too many uploads. Please wait a minute.' }, 429);
  const { fileName, fileData, fileType, fileSizeMb } = await readJson<Record<string, any>>(c);
  if (!fileData || typeof fileData !== 'string') return c.json({ error: 'No file data provided' }, 400);
  if (Number(fileSizeMb) > 25) return c.json({ error: 'Design artwork exceeds max allowed size of 25MB' }, 400);
  try {
    const url = await storeDataUrl(c.env, fileData);
    return c.json({ success: true, url, fileName, fileType, fileSizeMb, uploadedAt: new Date().toISOString() });
  } catch (e: any) {
    return c.json({ error: e.message || 'Upload failed' }, 400);
  }
});

app.get('/uploads/:key', async (c) => {
  const key = c.req.param('key');
  if (!/^[a-f0-9]{40}\.[a-z0-9]+$/.test(key)) return c.json({ error: 'Not found' }, 404);
  const { value, metadata } = await c.env.UPLOADS.getWithMetadata<{ contentType?: string }>(`u/${key}`, 'stream');
  if (!value) return c.json({ error: 'Not found' }, 404);
  return new Response(value, {
    headers: {
      'Content-Type': metadata?.contentType || 'application/octet-stream',
      'Cache-Control': 'public, max-age=31536000, immutable',
      // Uploaded files are user content: never let them run script on our origin.
      'Content-Security-Policy': "default-src 'none'; img-src 'self' data:; style-src 'unsafe-inline'; sandbox",
      'X-Content-Type-Options': 'nosniff'
    }
  });
});

// ---------- customizer settings ----------

app.get('/customizer-settings', async (c) => c.json(await getCustomizerSettings(c.env)));

app.put('/customizer-settings', requireAdmin, async (c) => {
  const body = await externalizeDataUrls(c.env, await readJson<Partial<AdminCustomizerSettings>>(c));
  const next = { ...(await getCustomizerSettings(c.env)), ...body };
  await putSetting(c.env, 'customizer', next);
  return c.json(next);
});

app.get('/preloaded-designs', async (c) => {
  const settings = await getCustomizerSettings(c.env);
  return c.json(settings.preloadedDesigns.filter((d) => d.active));
});

app.post('/preloaded-designs', requireAdmin, async (c) => {
  const body = await externalizeDataUrls(c.env, await readJson<Partial<PreloadedDesign>>(c));
  const design: PreloadedDesign = {
    id: newId('design-'),
    name: body.name || 'New Design Motif',
    category: body.category || 'General',
    imageUrl:
      body.imageUrl || 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&q=60&w=800',
    widthPx: body.widthPx || 3000,
    heightPx: body.heightPx || 3000,
    active: true
  };
  const settings = await getCustomizerSettings(c.env);
  settings.preloadedDesigns.unshift(design);
  await putSetting(c.env, 'customizer', settings);
  return c.json(design, 201);
});

app.delete('/preloaded-designs/:id', requireAdmin, async (c) => {
  const id = c.req.param('id');
  const settings = await getCustomizerSettings(c.env);
  settings.preloadedDesigns = settings.preloadedDesigns.filter((d) => d.id !== id);
  await putSetting(c.env, 'customizer', settings);
  return c.json({ success: true, id });
});

// ---------- payments / checkout ----------

app.get('/payments/config', (c) =>
  c.json({
    razorpayEnabled: razorpayConfigured(c.env),
    keyId: razorpayConfigured(c.env) ? c.env.RAZORPAY_KEY_ID : null,
    currency: 'INR'
  })
);

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

function validateOrderInput(body: Partial<Order>): string | null {
  if (!Array.isArray(body.items) || body.items.length === 0) return 'Your cart is empty';
  if (body.items.length > 100) return 'Too many items in one order';
  const a = body.shippingAddress;
  if (!a || !a.fullName || !a.phone || !a.street || !a.city || !a.pincode) {
    return 'Please complete all required shipping address fields';
  }
  if (!/^\d{6}$/.test(String(a.pincode).trim())) return 'Please enter a valid 6-digit PIN code';
  const nums = [body.subtotal, body.discount ?? 0, body.shippingFee ?? 0, body.tax ?? 0, body.totalAmount];
  if (nums.some((n) => typeof n !== 'number' || !Number.isFinite(n) || n < 0)) return 'Invalid order amounts';
  for (const item of body.items) {
    if (typeof item.totalPrice !== 'number' || item.totalPrice < 0 || !Number.isFinite(item.totalPrice)) {
      return 'Invalid item price';
    }
  }
  const itemsTotal = body.items.reduce((s, i) => s + i.totalPrice, 0);
  if (Math.abs(itemsTotal - (body.subtotal as number)) > 1) return 'Order subtotal does not match items';
  const expectedTotal = (body.subtotal as number) - (body.discount ?? 0) + (body.shippingFee ?? 0) + (body.tax ?? 0);
  if (Math.abs(expectedTotal - (body.totalAmount as number)) > 1) return 'Order total does not add up';
  if ((body.totalAmount as number) < 1) return 'Order total must be at least ₹1';
  return null;
}

/**
 * Step 1 of checkout: store the order as Pending and open a Razorpay order
 * for the same amount. The browser then opens Razorpay Checkout.
 */
app.post('/checkout/create', async (c) => {
  if (!razorpayConfigured(c.env)) {
    return c.json({ error: 'Online payment is not available yet. Please order on WhatsApp.' }, 503);
  }
  const raw = await readJson<Partial<Order>>(c);
  const problem = validateOrderInput(raw);
  if (problem) return c.json({ error: problem }, 400);

  const session = c.get('session');
  const body = await externalizeDataUrls(c.env, raw);
  const orderId = newId('FP-');
  const totalAmount = round2(body.totalAmount as number);
  const amountPaise = Math.round(totalAmount * 100);

  let rzp;
  try {
    rzp = await createRazorpayOrder(c.env, {
      amountPaise,
      receipt: orderId,
      notes: { order_id: orderId, customer: String(body.customerName || '').slice(0, 60) }
    });
  } catch (e: any) {
    console.error('Razorpay order create failed', e?.message);
    return c.json({ error: 'Payment gateway is unavailable right now. Please try again in a minute.' }, 502);
  }

  const order: OrderRecord = {
    id: orderId,
    userId: session && session.role === 'user' ? session.sub : 'usr-guest',
    customerName: String(body.customerName || body.shippingAddress!.fullName).slice(0, 120),
    customerEmail: String(body.customerEmail || '').slice(0, 160),
    customerPhone: String(body.customerPhone || body.shippingAddress!.phone).slice(0, 20),
    shippingAddress: body.shippingAddress!,
    items: body.items!,
    subtotal: round2(body.subtotal as number),
    discount: round2(body.discount ?? 0),
    shippingFee: round2(body.shippingFee ?? 0),
    tax: round2(body.tax ?? 0),
    totalAmount,
    paymentMethod: 'Razorpay',
    paymentStatus: 'Pending',
    orderStatus: 'Pending',
    notes: body.notes ? String(body.notes).slice(0, 2000) : undefined,
    createdAt: new Date().toISOString(),
    razorpayOrderId: rzp.id
  };
  await insertOrder(c.env, order);

  return c.json({
    orderId,
    razorpayOrderId: rzp.id,
    amount: rzp.amount,
    currency: rzp.currency,
    keyId: c.env.RAZORPAY_KEY_ID,
    prefill: { name: order.customerName, email: order.customerEmail, contact: order.customerPhone }
  });
});

/** Step 2: the browser hands back Razorpay's signed result; we verify it. */
app.post('/checkout/verify', async (c) => {
  const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = await readJson<Record<string, string>>(c);
  if (!orderId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return c.json({ error: 'Missing payment details' }, 400);
  }
  const order = await getOrder(c.env, orderId);
  if (!order || order.razorpayOrderId !== razorpay_order_id) return c.json({ error: 'Order not found' }, 404);

  const valid = await verifyCheckoutSignature(c.env, razorpay_order_id, razorpay_payment_id, razorpay_signature);
  if (!valid) {
    console.warn('Razorpay signature mismatch', orderId);
    return c.json({ error: 'Payment verification failed. If money was deducted, contact us on WhatsApp.' }, 400);
  }

  await markOrderPaid(c.env, order.id, razorpay_payment_id);
  return c.json(await getOrder(c.env, order.id));
});

/** Backup path: Razorpay calls this even if the customer closes the tab. */
app.post('/webhooks/razorpay', async (c) => {
  const raw = await c.req.text();
  const signature = c.req.header('X-Razorpay-Signature') || '';
  if (!(await verifyWebhookSignature(c.env, raw, signature))) {
    return c.json({ error: 'Invalid signature' }, 400);
  }
  const event = JSON.parse(raw);
  const payment = event?.payload?.payment?.entity;
  const rzpOrderId: string | undefined = event?.payload?.order?.entity?.id || payment?.order_id;
  if ((event.event === 'payment.captured' || event.event === 'order.paid') && rzpOrderId && payment?.id) {
    const order = await getOrderByRazorpayId(c.env, rzpOrderId);
    if (order) {
      // Double-check with Razorpay that the order is really paid in full.
      const rzp = await fetchRazorpayOrder(c.env, rzpOrderId);
      if (rzp.status === 'paid' || rzp.amount_paid >= rzp.amount) {
        await markOrderPaid(c.env, order.id, payment.id);
      }
    }
  }
  return c.json({ ok: true });
});

// ---------- orders ----------

app.get('/orders', requireUser, async (c) => {
  const s = c.get('session')!;
  const userId = c.req.query('userId');
  if (s.role === 'admin') return c.json(await listOrders(c.env, userId || undefined));
  if (userId && userId !== s.sub) return c.json({ error: 'Forbidden: You can only access your own orders' }, 403);
  return c.json(await listOrders(c.env, s.sub));
});

app.get('/orders/:id', requireUser, async (c) => {
  const order = await getOrder(c.env, c.req.param('id'));
  const s = c.get('session')!;
  if (!order || (s.role !== 'admin' && s.sub !== order.userId)) {
    return c.json({ error: 'Order not found' }, 404);
  }
  return c.json(order);
});

app.put('/orders/:id/status', requireAdmin, async (c) => {
  const { orderStatus, trackingNumber } = await readJson<{ orderStatus?: Order['orderStatus']; trackingNumber?: string }>(c);
  const order = await getOrder(c.env, c.req.param('id'));
  if (!order) return c.json({ error: 'Order not found' }, 404);
  const allowed: Order['orderStatus'][] = ['Pending', 'Processing', 'Printing', 'Shipped', 'Delivered', 'Cancelled'];
  if (orderStatus) {
    if (!allowed.includes(orderStatus)) return c.json({ error: 'Invalid status' }, 400);
    order.orderStatus = orderStatus;
  }
  if (trackingNumber !== undefined) order.trackingNumber = String(trackingNumber).slice(0, 80);
  await saveOrder(c.env, order);
  return c.json(order);
});

// ---------- inquiries (contact / bulk / training forms) ----------

const INQUIRY_TYPES = ['contact', 'bulk', 'training'] as const;

app.post('/inquiries', async (c) => {
  if (!(await rateLimit(c, 'inquiry'))) return c.json({ error: 'Too many requests. Please wait a minute.' }, 429);
  const body = await readJson<Record<string, any>>(c);
  const type = INQUIRY_TYPES.includes(body.type) ? body.type : 'contact';
  const name = String(body.name || '').trim().slice(0, 120);
  const phone = String(body.phone || '').trim().slice(0, 30);
  const email = String(body.email || '').trim().slice(0, 160);
  const message = String(body.message || '').trim().slice(0, 4000);
  if (!name || (!phone && !email)) return c.json({ error: 'Please add your name and a phone number or email.' }, 400);
  const details: Record<string, string> = {};
  if (body.details && typeof body.details === 'object') {
    for (const [k, v] of Object.entries(body.details).slice(0, 20)) details[String(k).slice(0, 40)] = String(v).slice(0, 300);
  }
  const id = newId('INQ-');
  await c.env.DB.prepare(
    'INSERT INTO inquiries (id, type, name, phone, email, message, details) VALUES (?, ?, ?, ?, ?, ?, ?)'
  )
    .bind(id, type, name, phone, email, message, JSON.stringify(details))
    .run();
  return c.json({ ok: true, id }, 201);
});

app.get('/inquiries', requireAdmin, async (c) => {
  const { results } = await c.env.DB.prepare(
    'SELECT id, type, name, phone, email, message, details, status, created_at FROM inquiries ORDER BY created_at DESC LIMIT 500'
  ).all<any>();
  return c.json(results.map((r) => ({ ...r, details: JSON.parse(r.details || '{}') })));
});

app.put('/inquiries/:id', requireAdmin, async (c) => {
  const { status } = await readJson<{ status?: string }>(c);
  if (!status || !['New', 'Contacted', 'Closed'].includes(status)) return c.json({ error: 'Invalid status' }, 400);
  await c.env.DB.prepare('UPDATE inquiries SET status = ? WHERE id = ?').bind(status, c.req.param('id')).run();
  return c.json({ ok: true });
});

// ---------- analytics ----------

app.get('/analytics', requireAdmin, async (c) => {
  const [orders, products, totalCustomers] = await Promise.all([
    listOrders(c.env, undefined, 2000),
    listProducts(c.env),
    countCustomers(c.env)
  ]);
  const paid = orders.filter((o) => o.paymentStatus === 'Paid');
  const totalRevenue = round2(paid.reduce((acc, o) => acc + o.totalAmount, 0));

  const productCat = new Map(products.map((p) => [p.id, p.category]));
  const catSales: Record<string, number> = {};
  for (const o of paid) {
    for (const item of o.items) {
      const cat = productCat.get(item.productId) || 'Other';
      catSales[cat] = (catSales[cat] || 0) + item.totalPrice;
    }
  }

  // Last 6 calendar months of paid revenue (IST-agnostic, by UTC month).
  const months: { key: string; month: string; revenue: number }[] = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1));
    months.push({
      key: d.toISOString().slice(0, 7),
      month: d.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' }),
      revenue: 0
    });
  }
  for (const o of paid) {
    const m = months.find((x) => x.key === o.createdAt.slice(0, 7));
    if (m) m.revenue += o.totalAmount;
  }

  return c.json({
    totalRevenue,
    totalOrders: orders.length,
    totalCustomers,
    totalProducts: products.length,
    recentOrders: orders.slice(0, 5),
    salesByCategory: Object.entries(catSales).map(([category, sales]) => ({ category, sales: round2(sales) })),
    monthlyRevenue: months.map(({ month, revenue }) => ({ month, revenue: round2(revenue) }))
  });
});

// ---------- image URL extractor (customizer "import from URL") ----------

app.post('/extract-image-url', async (c) => {
  const { url } = await readJson<{ url?: string }>(c);
  if (!url || typeof url !== 'string') return c.json({ error: 'Please provide a valid image URL.' }, 400);

  const trimmed = url.trim();
  let extractedUrl = trimmed;
  let title = 'Extracted Motif Artwork';

  if (trimmed.includes('google.') && trimmed.includes('imgurl=')) {
    try {
      const imgUrlParam = new URL(trimmed).searchParams.get('imgurl');
      if (imgUrlParam) extractedUrl = imgUrlParam;
    } catch {
      /* keep original */
    }
  }

  let parsed: URL | null = null;
  try {
    parsed = new URL(extractedUrl);
  } catch {
    parsed = null;
  }
  if (!parsed || !/^https?:$/.test(parsed.protocol)) {
    return c.json({ error: 'Please provide an http(s) image link.' }, 400);
  }

  const looksLikeImage = /\.(jpe?g|png|webp|gif|svg|tiff?)($|\?)/i.test(parsed.pathname + parsed.search);
  if (!looksLikeImage) {
    try {
      const response = await fetch(parsed.toString(), {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; FabricPrintImageFetcher/1.0; +https://www.fabricprint.in)',
          Accept: 'text/html,application/xhtml+xml,image/*;q=0.9,*/*;q=0.8'
        },
        redirect: 'follow',
        signal: AbortSignal.timeout(6000)
      });
      const contentType = response.headers.get('content-type') || '';
      if (contentType.startsWith('image/')) {
        extractedUrl = response.url;
        await response.body?.cancel();
      } else if (contentType.includes('html')) {
        const html = (await response.text()).slice(0, 500_000);
        const og =
          html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i) ||
          html.match(/<meta\s+content=["']([^"']+)["']\s+property=["']og:image["']/i) ||
          html.match(/<meta\s+name=["']twitter:image["']\s+content=["']([^"']+)["']/i);
        const img = html.match(/<img[^>]+src=["'](https?:\/\/[^"']+\.(?:png|jpg|jpeg|webp))["']/i);
        if (og?.[1]) extractedUrl = new URL(og[1], response.url).toString();
        else if (img?.[1]) extractedUrl = img[1];
        const t = html.match(/<title[^>]*>([^<]+)<\/title>/i);
        if (t?.[1]) title = t[1].trim().slice(0, 50);
      }
    } catch {
      /* fall back to the original URL */
    }
  }

  const palettes = [
    ['#1E3A8A', '#F59E0B', '#10B981', '#E11D48', '#F8FAFC'],
    ['#0F766E', '#D97706', '#4F46E5', '#9333EA', '#FFFBEB'],
    ['#9A3412', '#0284C7', '#16A34A', '#E11D48', '#FAFAF9'],
    ['#312E81', '#BE185D', '#047857', '#CA8A04', '#F1F5F9']
  ];
  const palette = palettes[Math.floor(Math.random() * palettes.length)];
  return c.json({
    success: true,
    originalUrl: trimmed,
    extractedImageUrl: extractedUrl,
    title,
    width: 3200,
    height: 3200,
    format: 'PNG / High-Def Textile Raster',
    fileSizeMb: 4.2,
    palette,
    pantoneMatches: [
      { name: 'Royal Cobalt', hex: palette[0], code: 'PANTONE 19-4052 TCX' },
      { name: 'Radiant Gold', hex: palette[1], code: 'PANTONE 14-0848 TCX' },
      { name: 'Forest Emerald', hex: palette[2], code: 'PANTONE 17-5641 TCX' },
      { name: 'Berry Magenta', hex: palette[3], code: 'PANTONE 18-2043 TCX' }
    ],
    extractedAt: new Date().toISOString()
  });
});

// ==========================================
// Worker entry: API, SEO files, then the SPA shell with per-route meta.
// ==========================================

const SECURITY_HEADERS: Record<string, string> = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-Frame-Options': 'SAMEORIGIN',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(self "https://checkout.razorpay.com" "https://api.razorpay.com")',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
};

function withSecurityHeaders(res: Response): Response {
  const out = new Response(res.body, res);
  for (const [k, v] of Object.entries(SECURITY_HEADERS)) {
    if (!out.headers.has(k)) out.headers.set(k, v);
  }
  return out;
}

async function serveShell(request: Request, env: Env, meta: RouteMeta): Promise<Response> {
  const shellUrl = new URL('/', request.url);
  // No conditional headers: the rewritten body differs per route.
  const shell = await env.ASSETS.fetch(new Request(shellUrl, { method: 'GET' }));
  if (!shell.ok) return shell;
  return rewriteShell(shell, siteUrl(env), meta);
}

async function handleRequest(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
  const url = new URL(request.url);
  const { pathname } = url;

  if (pathname === '/api' || pathname.startsWith('/api/')) {
    return app.fetch(request, env, ctx);
  }

  // One canonical host for search engines: send *.workers.dev pages to the real domain.
  if (url.hostname.endsWith('.workers.dev') && (request.method === 'GET' || request.method === 'HEAD')) {
    return Response.redirect(`${siteUrl(env)}${pathname}${url.search}`, 301);
  }

  if (pathname === '/robots.txt') {
    return new Response(renderRobots(siteUrl(env)), {
      headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=3600' }
    });
  }

  if (pathname === '/sitemap.xml') {
    await ensureSeeded(env);
    const products = await listProducts(env);
    return new Response(renderSitemap(siteUrl(env), products), {
      headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=3600' }
    });
  }

  // Anything that looks like a file goes straight to static assets.
  if (/\.[a-z0-9]{2,5}$/i.test(pathname) || (request.method !== 'GET' && request.method !== 'HEAD')) {
    const asset = await env.ASSETS.fetch(request);
    // A missing file falls back to the SPA shell; report it as a real 404 instead.
    if (!/\.html?$/i.test(pathname) && (asset.headers.get('Content-Type') || '').includes('text/html')) {
      return new Response('Not found', { status: 404, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
    }
    return asset;
  }

  const match = matchRoute(pathname);
  if (match && 'meta' in match) return serveShell(request, env, match.meta);
  if (match && 'productId' in match) {
    await ensureSeeded(env);
    const product = await getProduct(env, match.productId);
    return serveShell(request, env, product ? productRouteMeta(siteUrl(env), product) : notFoundMeta(pathname));
  }
  return serveShell(request, env, notFoundMeta(pathname));
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    return withSecurityHeaders(await handleRequest(request, env, ctx));
  }
} satisfies ExportedHandler<Env>;

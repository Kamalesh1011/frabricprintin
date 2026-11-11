// D1-backed persistence for the Worker. Seeds the catalog from mockData the
// first time it runs against an empty database.

import {
  INITIAL_PRODUCTS,
  INITIAL_CATEGORIES,
  INITIAL_CUSTOMIZER_SETTINGS,
  INITIAL_SWATCH_BOOKS
} from '../../src/data/mockData';
import type { Product, Category, Order, User, AdminCustomizerSettings, SwatchBook } from '../../src/types';
import { toHex } from './auth';

export interface StoreEnv {
  DB: D1Database;
  UPLOADS: KVNamespace;
}

const SEED_KEY = 'seeded_v1';
let seededInThisIsolate = false;

export async function ensureSeeded(env: StoreEnv): Promise<void> {
  if (seededInThisIsolate) return;
  const marker = await env.DB.prepare('SELECT value FROM settings WHERE key = ?').bind(SEED_KEY).first();
  if (marker) {
    seededInThisIsolate = true;
    return;
  }

  const stmts: D1PreparedStatement[] = [];
  INITIAL_PRODUCTS.forEach((p, i) => {
    stmts.push(
      env.DB.prepare('INSERT OR IGNORE INTO products (id, category, sort_order, data) VALUES (?, ?, ?, ?)').bind(
        p.id,
        p.category,
        i,
        JSON.stringify(p)
      )
    );
  });
  INITIAL_CATEGORIES.forEach((c, i) => {
    stmts.push(
      env.DB.prepare('INSERT OR IGNORE INTO categories (id, sort_order, data) VALUES (?, ?, ?)').bind(
        c.id,
        i,
        JSON.stringify(c)
      )
    );
  });
  stmts.push(
    env.DB.prepare('INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)').bind(
      'customizer',
      JSON.stringify(INITIAL_CUSTOMIZER_SETTINGS)
    ),
    env.DB.prepare('INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)').bind(
      'swatch_books',
      JSON.stringify(INITIAL_SWATCH_BOOKS)
    ),
    env.DB.prepare('INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)').bind(SEED_KEY, new Date().toISOString())
  );
  await env.DB.batch(stmts);
  seededInThisIsolate = true;
}

// ---------- products ----------

export async function listProducts(env: StoreEnv): Promise<Product[]> {
  const { results } = await env.DB.prepare('SELECT data FROM products ORDER BY sort_order ASC, id ASC').all<{
    data: string;
  }>();
  return results.map((r) => JSON.parse(r.data));
}

export async function getProduct(env: StoreEnv, id: string): Promise<Product | null> {
  const row = await env.DB.prepare('SELECT data FROM products WHERE id = ?').bind(id).first<{ data: string }>();
  return row ? JSON.parse(row.data) : null;
}

export async function putProduct(env: StoreEnv, product: Product, sortOrder?: number): Promise<void> {
  if (sortOrder === undefined) {
    // New products go to the top of the catalog, matching the old unshift().
    await env.DB.prepare(
      `INSERT INTO products (id, category, sort_order, data, updated_at)
       VALUES (?, ?, (SELECT COALESCE(MIN(sort_order), 0) - 1 FROM products), ?, strftime('%Y-%m-%dT%H:%M:%fZ','now'))
       ON CONFLICT(id) DO UPDATE SET category = excluded.category, data = excluded.data, updated_at = excluded.updated_at`
    )
      .bind(product.id, product.category || '', JSON.stringify(product))
      .run();
    return;
  }
  await env.DB.prepare(
    `INSERT INTO products (id, category, sort_order, data) VALUES (?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET category = excluded.category, data = excluded.data`
  )
    .bind(product.id, product.category || '', sortOrder, JSON.stringify(product))
    .run();
}

export async function deleteProduct(env: StoreEnv, id: string): Promise<Product | null> {
  const existing = await getProduct(env, id);
  if (!existing) return null;
  await env.DB.prepare('DELETE FROM products WHERE id = ?').bind(id).run();
  return existing;
}

// ---------- categories ----------

export async function listCategories(env: StoreEnv): Promise<Category[]> {
  const [{ results }, counts] = await Promise.all([
    env.DB.prepare('SELECT data FROM categories ORDER BY sort_order ASC').all<{ data: string }>(),
    env.DB.prepare('SELECT category, COUNT(*) AS n FROM products GROUP BY category').all<{
      category: string;
      n: number;
    }>()
  ]);
  const countMap = new Map(counts.results.map((r) => [r.category.toLowerCase(), r.n]));
  return results.map((r) => {
    const cat = JSON.parse(r.data) as Category;
    const live = countMap.get((cat.name || '').toLowerCase());
    return live !== undefined ? { ...cat, itemCount: live } : cat;
  });
}

export async function addCategory(env: StoreEnv, category: Category): Promise<void> {
  await env.DB.prepare(
    'INSERT INTO categories (id, sort_order, data) VALUES (?, (SELECT COALESCE(MAX(sort_order), 0) + 1 FROM categories), ?)'
  )
    .bind(category.id, JSON.stringify(category))
    .run();
}

// ---------- settings documents ----------

export async function getSetting<T>(env: StoreEnv, key: string, fallback: T): Promise<T> {
  const row = await env.DB.prepare('SELECT value FROM settings WHERE key = ?').bind(key).first<{ value: string }>();
  return row ? (JSON.parse(row.value) as T) : fallback;
}

export async function putSetting(env: StoreEnv, key: string, value: unknown): Promise<void> {
  await env.DB.prepare(
    'INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value'
  )
    .bind(key, JSON.stringify(value))
    .run();
}

export const getCustomizerSettings = (env: StoreEnv) =>
  getSetting<AdminCustomizerSettings>(
    env,
    'customizer',
    INITIAL_CUSTOMIZER_SETTINGS as unknown as AdminCustomizerSettings
  );

export const getSwatchBooks = (env: StoreEnv) =>
  getSetting<SwatchBook[]>(env, 'swatch_books', INITIAL_SWATCH_BOOKS);

// ---------- users ----------

export interface UserRow {
  user: User;
  passwordHash: string | null;
}

export async function findUserByEmail(env: StoreEnv, email: string): Promise<UserRow | null> {
  const row = await env.DB.prepare('SELECT data, password_hash FROM users WHERE email = ?')
    .bind(email.toLowerCase())
    .first<{ data: string; password_hash: string | null }>();
  return row ? { user: JSON.parse(row.data), passwordHash: row.password_hash } : null;
}

export async function getUser(env: StoreEnv, id: string): Promise<User | null> {
  const row = await env.DB.prepare('SELECT data FROM users WHERE id = ?').bind(id).first<{ data: string }>();
  return row ? JSON.parse(row.data) : null;
}

export async function insertUser(env: StoreEnv, user: User, passwordHash: string): Promise<void> {
  await env.DB.prepare('INSERT INTO users (id, email, role, password_hash, data, created_at) VALUES (?, ?, ?, ?, ?, ?)')
    .bind(user.id, user.email.toLowerCase(), user.role, passwordHash, JSON.stringify(user), user.createdAt)
    .run();
}

export async function updateUserData(env: StoreEnv, user: User): Promise<void> {
  await env.DB.prepare('UPDATE users SET data = ? WHERE id = ?').bind(JSON.stringify(user), user.id).run();
}

export async function countCustomers(env: StoreEnv): Promise<number> {
  const row = await env.DB.prepare("SELECT COUNT(*) AS n FROM users WHERE role = 'user'").first<{ n: number }>();
  return row?.n ?? 0;
}

// ---------- orders ----------

export interface OrderRecord extends Order {
  razorpayOrderId?: string;
}

function rowToOrder(row: { data: string; payment_status: string; order_status: string }): OrderRecord {
  const order = JSON.parse(row.data) as OrderRecord;
  // Status columns are the source of truth; data may lag behind them.
  order.paymentStatus = row.payment_status as Order['paymentStatus'];
  order.orderStatus = row.order_status as Order['orderStatus'];
  return order;
}

export async function insertOrder(env: StoreEnv, order: OrderRecord): Promise<void> {
  await env.DB.prepare(
    `INSERT INTO orders (id, user_id, payment_status, order_status, total_paise, razorpay_order_id, razorpay_payment_id, data, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
  )
    .bind(
      order.id,
      order.userId,
      order.paymentStatus,
      order.orderStatus,
      Math.round(order.totalAmount * 100),
      order.razorpayOrderId ?? null,
      order.paymentId ?? null,
      JSON.stringify(order),
      order.createdAt
    )
    .run();
}

export async function saveOrder(env: StoreEnv, order: OrderRecord): Promise<void> {
  await env.DB.prepare(
    `UPDATE orders SET payment_status = ?, order_status = ?, razorpay_payment_id = ?, data = ? WHERE id = ?`
  )
    .bind(order.paymentStatus, order.orderStatus, order.paymentId ?? null, JSON.stringify(order), order.id)
    .run();
}

const ORDER_COLS = 'data, payment_status, order_status';

export async function getOrder(env: StoreEnv, id: string): Promise<OrderRecord | null> {
  const row = await env.DB.prepare(`SELECT ${ORDER_COLS} FROM orders WHERE id = ?`).bind(id).first<any>();
  return row ? rowToOrder(row) : null;
}

export async function getOrderByRazorpayId(env: StoreEnv, razorpayOrderId: string): Promise<OrderRecord | null> {
  const row = await env.DB.prepare(`SELECT ${ORDER_COLS} FROM orders WHERE razorpay_order_id = ?`)
    .bind(razorpayOrderId)
    .first<any>();
  return row ? rowToOrder(row) : null;
}

export async function listOrders(env: StoreEnv, userId?: string, limit = 500): Promise<OrderRecord[]> {
  const stmt = userId
    ? env.DB.prepare(`SELECT ${ORDER_COLS} FROM orders WHERE user_id = ? ORDER BY created_at DESC LIMIT ?`).bind(
        userId,
        limit
      )
    : env.DB.prepare(`SELECT ${ORDER_COLS} FROM orders ORDER BY created_at DESC LIMIT ?`).bind(limit);
  const { results } = await stmt.all<any>();
  return results.map(rowToOrder);
}

/**
 * Atomically flips an order from Pending to Paid. Returns true only for the
 * caller that performed the transition, so the checkout handler and the
 * webhook cannot both "win".
 */
export async function markOrderPaid(env: StoreEnv, orderId: string, paymentId: string): Promise<boolean> {
  const res = await env.DB.prepare(
    `UPDATE orders SET payment_status = 'Paid', order_status = 'Processing', razorpay_payment_id = ?
     WHERE id = ? AND payment_status != 'Paid'`
  )
    .bind(paymentId, orderId)
    .run();
  if ((res.meta?.changes ?? 0) === 0) return false;
  const order = await getOrder(env, orderId);
  if (order) {
    order.paymentId = paymentId;
    await saveOrder(env, order);
  }
  return true;
}

// ---------- uploads (KV) ----------

const MAX_UPLOAD_BYTES = 25 * 1024 * 1024; // KV value limit is 25 MiB

function decodeDataUrl(dataUrl: string): { bytes: Uint8Array; contentType: string } | null {
  const match = /^data:([\w.+-]+\/[\w.+-]+)?(;base64)?,(.*)$/s.exec(dataUrl);
  if (!match) return null;
  const contentType = match[1] || 'application/octet-stream';
  const payload = match[3];
  if (match[2]) {
    const bin = atob(payload);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return { bytes, contentType };
  }
  return { bytes: new TextEncoder().encode(decodeURIComponent(payload)), contentType };
}

const ALLOWED_UPLOAD_TYPES = /^(image\/(png|jpe?g|webp|gif|svg\+xml|tiff)|application\/pdf)$/;

/** Stores a data: URL in KV (content-addressed) and returns its public path. */
export async function storeDataUrl(env: StoreEnv, dataUrl: string): Promise<string> {
  const decoded = decodeDataUrl(dataUrl);
  if (!decoded) throw new Error('Invalid file data');
  if (!ALLOWED_UPLOAD_TYPES.test(decoded.contentType)) throw new Error('Unsupported file type');
  if (decoded.bytes.byteLength > MAX_UPLOAD_BYTES) throw new Error('File exceeds the 25MB limit');
  const digest = toHex(await crypto.subtle.digest('SHA-256', decoded.bytes)).slice(0, 40);
  const ext = decoded.contentType.split('/')[1].replace('svg+xml', 'svg').replace('jpeg', 'jpg');
  const key = `u/${digest}.${ext}`;
  const existing = await env.UPLOADS.getWithMetadata(key, 'stream');
  if (existing.value) {
    await existing.value.cancel();
  } else {
    await env.UPLOADS.put(key, decoded.bytes, { metadata: { contentType: decoded.contentType } });
  }
  return `/api/uploads/${key.slice(2)}`;
}

/**
 * Walks an order payload and moves any embedded data: URLs (design artwork,
 * mockup previews) into KV, replacing them with /api/uploads/... paths. Keeps
 * D1 rows well under the 2 MB row limit.
 */
export async function externalizeDataUrls<T>(env: StoreEnv, value: T): Promise<T> {
  const cache = new Map<string, string>();
  const walk = async (v: any): Promise<any> => {
    if (typeof v === 'string') {
      if (v.startsWith('data:') && v.length > 512) {
        if (!cache.has(v)) cache.set(v, await storeDataUrl(env, v));
        return cache.get(v);
      }
      return v;
    }
    if (Array.isArray(v)) return Promise.all(v.map(walk));
    if (v && typeof v === 'object') {
      const out: Record<string, any> = {};
      for (const [k, child] of Object.entries(v)) out[k] = await walk(child);
      return out;
    }
    return v;
  };
  return walk(value);
}

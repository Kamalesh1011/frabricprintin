// Tab id <-> URL path mapping for the SPA. Keep the list in sync with
// STATIC_ROUTES in worker/lib/seo.ts, which serves per-route SEO metadata.

export const APP_TABS = [
  'home',
  'fabrics',
  'apparel',
  'apparel-studio',
  'jersey',
  'uniforms',
  'merch',
  'training',
  'customizer',
  'about',
  'contact',
  'privacy',
  'terms',
  'login',
  'dashboard',
  'wishlist',
  'checkout',
  'product-detail',
  'order-success',
  'admin'
] as const;

export type AppTab = (typeof APP_TABS)[number];

const TAB_SET = new Set<string>(APP_TABS);

export function isAppTab(value: string): value is AppTab {
  return TAB_SET.has(value);
}

export function pathForTab(tab: string, productId?: string): string {
  if (tab === 'home') return '/';
  if (tab === 'product-detail') return productId ? `/product/${encodeURIComponent(productId)}` : '/fabrics';
  return `/${tab}`;
}

export interface ParsedLocation {
  tab: AppTab;
  productId?: string;
}

export function parseLocation(loc: Location = window.location): ParsedLocation {
  const path = loc.pathname.replace(/\/+$/, '') || '/';
  const product = /^\/product\/([^/]+)$/.exec(path);
  if (product) return { tab: 'product-detail', productId: decodeURIComponent(product[1]) };
  const seg = path.slice(1);
  if (seg && isAppTab(seg) && seg !== 'product-detail') return { tab: seg };
  return { tab: 'home' };
}

/**
 * Old links used hash routing (e.g. /#fabrics or /#fabrics?type=Cotton).
 * Rewrite them to clean paths once on load so shared links keep working.
 */
export function migrateLegacyHashUrl(): void {
  const raw = window.location.hash.replace(/^#/, '');
  if (!raw) return;
  const [tab, query] = raw.split('?');
  if (!isAppTab(tab) || tab === 'product-detail') return;
  const target = pathForTab(tab) + (query ? `?${query}` : '');
  window.history.replaceState({ tab }, '', target);
}

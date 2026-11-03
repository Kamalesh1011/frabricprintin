// Server-side SEO for the single-page app: per-route <title>, description,
// canonical, Open Graph / Twitter tags and JSON-LD are injected into
// index.html with HTMLRewriter, so crawlers and link previews (WhatsApp,
// Facebook, LinkedIn) see real metadata without running JavaScript.

import { BUSINESS_INFO } from '../../src/config/businessInfo';
import type { Product } from '../../src/types';

export const DEFAULT_SITE_URL = 'https://www.fabricprint.in';
const OG_IMAGE_PATH = '/og-image.jpg';

export interface RouteMeta {
  path: string;
  title: string;
  description: string;
  index: boolean; // false => noindex (account/checkout pages)
  sitemap?: { priority: string; changefreq: string };
  image?: string;
  jsonLd?: Record<string, unknown>[];
  status?: number;
}

const BRAND = BUSINESS_INFO.brandName;

// Keep in sync with the tab ids handled in src/App.tsx (src/lib/routes.ts).
export const STATIC_ROUTES: RouteMeta[] = [
  {
    path: '/',
    title: `${BRAND} | Custom Digital Fabric Printing & Apparel Manufacturing in Tirupur`,
    description:
      'Custom digital fabric printing from 1 meter, plus custom T-shirts, sublimation jerseys, uniforms and merch. Direct mill in Tirupur, Tamil Nadu with 3–5 day dispatch across India.',
    index: true,
    sitemap: { priority: '1.0', changefreq: 'weekly' }
  },
  {
    path: '/fabrics',
    title: `Buy Printable Fabrics Online – Cotton, Linen, Silk, Rayon | ${BRAND}`,
    description:
      'Shop printable cotton, linen, silk, rayon, modal and polyester fabrics by the meter. Order swatches or upload your own design for custom digital printing.',
    index: true,
    sitemap: { priority: '0.9', changefreq: 'weekly' }
  },
  {
    path: '/apparel',
    title: `Custom T-Shirts, Hoodies & Polos – Blank Apparel Printing | ${BRAND}`,
    description:
      'Custom printed T-shirts, oversized tees, hoodies and polos made in Tirupur. DTF, screen and sublimation printing for brands, events and teams.',
    index: true,
    sitemap: { priority: '0.8', changefreq: 'weekly' }
  },
  {
    path: '/apparel-studio',
    title: `Apparel Design Studio – Design Your Own T-Shirt | ${BRAND}`,
    description:
      'Upload artwork, place it on T-shirts, hoodies and polos, preview the mockup and order custom printed apparel online.',
    index: true,
    sitemap: { priority: '0.6', changefreq: 'monthly' }
  },
  {
    path: '/jersey',
    title: `Custom Sublimation Jerseys & Team Kits | ${BRAND}`,
    description:
      'Design custom sublimation jerseys for cricket, football, basketball and volleyball. Team names, numbers and colours printed in Tirupur and shipped across India.',
    index: true,
    sitemap: { priority: '0.8', changefreq: 'weekly' }
  },
  {
    path: '/uniforms',
    title: `Corporate, School, Hospital & Hotel Uniforms | ${BRAND}`,
    description:
      'Bulk uniforms for corporate offices, schools, healthcare, hospitality and industrial teams. Custom fabric, sizing and logo printing from a Tirupur manufacturer.',
    index: true,
    sitemap: { priority: '0.8', changefreq: 'monthly' }
  },
  {
    path: '/merch',
    title: `Custom Merch – Caps, Tote Bags, Flags & Shirts | ${BRAND}`,
    description:
      'Custom printed caps, tote bags, banners, flags and shirts for brands and events. Low minimums with fast dispatch from Tirupur.',
    index: true,
    sitemap: { priority: '0.7', changefreq: 'monthly' }
  },
  {
    path: '/training',
    title: `DTF, Sublimation & Textile Printing Courses in Tirupur | ${BRAND}`,
    description:
      'Textile printing academy in Tirupur: hands-on DTF, DTG, sublimation and rug tufting courses in small batches, plus college and corporate programs.',
    index: true,
    sitemap: { priority: '0.6', changefreq: 'monthly' }
  },
  {
    path: '/customizer',
    title: `Fabric & Apparel Customizer – Upload Your Design | ${BRAND}`,
    description:
      'Upload your artwork and preview it on any fabric, apparel blank, merch or uniform. Repeat layouts, scale control and instant price estimate.',
    index: true,
    sitemap: { priority: '0.7', changefreq: 'monthly' }
  },
  {
    path: '/about',
    title: `About Us – Digital Fabric Printing Mill in Tirupur | ${BRAND}`,
    description:
      'Fabric Print is a direct mill for digital fabric printing and custom apparel manufacturing in Tirupur, Tamil Nadu, serving designers, boutiques and brands.',
    index: true,
    sitemap: { priority: '0.5', changefreq: 'yearly' }
  },
  {
    path: '/contact',
    title: `Contact Us – WhatsApp, Phone & Address | ${BRAND}`,
    description: `Reach Fabric Print on WhatsApp or call ${BUSINESS_INFO.displayPhone}. ${BUSINESS_INFO.address.shortFormatted}. ${BUSINESS_INFO.operatingHours}.`,
    index: true,
    sitemap: { priority: '0.6', changefreq: 'yearly' }
  },
  {
    path: '/privacy',
    title: `Privacy Policy | ${BRAND}`,
    description: 'How Fabric Print collects, uses and protects your personal information.',
    index: true,
    sitemap: { priority: '0.2', changefreq: 'yearly' }
  },
  {
    path: '/terms',
    title: `Terms & Conditions | ${BRAND}`,
    description: 'Terms and conditions for ordering fabrics, custom printing and apparel from Fabric Print.',
    index: true,
    sitemap: { priority: '0.2', changefreq: 'yearly' }
  },
  // Private / transactional pages: reachable, but kept out of search results.
  ...['login', 'dashboard', 'wishlist', 'checkout', 'order-success', 'admin'].map(
    (tab): RouteMeta => ({
      path: `/${tab}`,
      title: `${BRAND}`,
      description: BUSINESS_INFO.tagline,
      index: false
    })
  )
];

const STATIC_BY_PATH = new Map(STATIC_ROUTES.map((r) => [r.path, r]));

function organizationJsonLd(siteUrl: string): Record<string, unknown> {
  const a = BUSINESS_INFO.address;
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${siteUrl}/#business`,
    name: BUSINESS_INFO.brandName,
    legalName: BUSINESS_INFO.legalName,
    description: BUSINESS_INFO.tagline,
    url: `${siteUrl}/`,
    logo: `${siteUrl}/leaf-logo.png`,
    image: `${siteUrl}${OG_IMAGE_PATH}`,
    telephone: BUSINESS_INFO.phone.replace(/\s+/g, ''),
    email: BUSINESS_INFO.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: a.street,
      addressLocality: a.city,
      addressRegion: a.state,
      postalCode: a.postalCode,
      addressCountry: 'IN'
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '09:00',
        closes: '20:00'
      }
    ],
    areaServed: 'IN',
    priceRange: '₹₹'
  };
}

function websiteJsonLd(siteUrl: string): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteUrl}/#website`,
    name: BUSINESS_INFO.brandName,
    url: `${siteUrl}/`,
    publisher: { '@id': `${siteUrl}/#business` },
    inLanguage: 'en-IN'
  };
}

function absoluteUrl(siteUrl: string, maybeRelative: string | undefined): string | undefined {
  if (!maybeRelative) return undefined;
  if (/^https?:\/\//i.test(maybeRelative)) return maybeRelative;
  if (maybeRelative.startsWith('/')) return `${siteUrl}${maybeRelative}`;
  return undefined; // data: URLs etc. are not usable as share images
}

function clip(text: string, max: number): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  return clean.length <= max ? clean : clean.slice(0, max - 1).replace(/\s+\S*$/, '') + '…';
}

export function productRouteMeta(siteUrl: string, product: Product): RouteMeta {
  const path = `/product/${encodeURIComponent(product.id)}`;
  const image = absoluteUrl(siteUrl, product.image_url || product.images?.[0]);
  const description = clip(
    `${product.name} – ${product.composition}, ${product.gsm} GSM, ${product.width} wide. ₹${product.price_per_meter}/meter. ${product.description}`,
    160
  );
  return {
    path,
    title: (() => {
      const base = `${product.name} – ${product.gsm} GSM ${product.category} Fabric`;
      const branded = `${base} | ${BRAND}`;
      return branded.length <= 70 ? branded : clip(base, 70);
    })(),
    description,
    index: true,
    image,
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        description: clip(product.description, 500),
        sku: product.sku || product.id,
        category: product.category,
        material: product.composition,
        color: product.color,
        ...(image ? { image: [image] } : {}),
        brand: { '@type': 'Brand', name: BUSINESS_INFO.brandName },
        offers: {
          '@type': 'Offer',
          url: `${siteUrl}${path}`,
          priceCurrency: 'INR',
          price: product.price_per_meter,
          availability: product.in_stock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
          seller: { '@id': `${siteUrl}/#business` }
        }
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/` },
          { '@type': 'ListItem', position: 2, name: 'Fabrics', item: `${siteUrl}/fabrics` },
          { '@type': 'ListItem', position: 3, name: product.name, item: `${siteUrl}${path}` }
        ]
      }
    ]
  };
}

export function notFoundMeta(path: string): RouteMeta {
  return {
    path,
    title: `Page not found | ${BRAND}`,
    description: BUSINESS_INFO.tagline,
    index: false,
    status: 404
  };
}

/** Resolves a pathname to static route metadata, or a product id to look up. */
export function matchRoute(pathname: string): { meta: RouteMeta } | { productId: string } | null {
  const clean = pathname !== '/' ? pathname.replace(/\/+$/, '') : '/';
  const productMatch = /^\/product\/([^/]+)$/.exec(clean);
  if (productMatch) return { productId: decodeURIComponent(productMatch[1]) };
  const meta = STATIC_BY_PATH.get(clean);
  return meta ? { meta } : null;
}

const escapeAttr = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const escapeText = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
// JSON inside <script> must not be able to close the tag.
const safeJson = (v: unknown) => JSON.stringify(v).replace(/</g, '\\u003c');

export function renderHeadTags(siteUrl: string, meta: RouteMeta): string {
  const canonical = `${siteUrl}${meta.path === '/' ? '/' : meta.path}`;
  const image = meta.image || `${siteUrl}${OG_IMAGE_PATH}`;
  const ld = [organizationJsonLd(siteUrl), websiteJsonLd(siteUrl), ...(meta.jsonLd || [])];
  const tags = [
    `<meta name="description" content="${escapeAttr(meta.description)}">`,
    `<meta name="robots" content="${meta.index ? 'index, follow, max-image-preview:large' : 'noindex, nofollow'}">`,
    meta.index ? `<link rel="canonical" href="${escapeAttr(canonical)}">` : '',
    `<meta property="og:type" content="${meta.path.startsWith('/product/') ? 'product' : 'website'}">`,
    `<meta property="og:site_name" content="${escapeAttr(BRAND)}">`,
    `<meta property="og:locale" content="en_IN">`,
    `<meta property="og:title" content="${escapeAttr(meta.title)}">`,
    `<meta property="og:description" content="${escapeAttr(meta.description)}">`,
    `<meta property="og:url" content="${escapeAttr(canonical)}">`,
    `<meta property="og:image" content="${escapeAttr(image)}">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:title" content="${escapeAttr(meta.title)}">`,
    `<meta name="twitter:description" content="${escapeAttr(meta.description)}">`,
    `<meta name="twitter:image" content="${escapeAttr(image)}">`,
    ...ld.map((obj) => `<script type="application/ld+json">${safeJson(obj)}</script>`)
  ];
  return tags.filter(Boolean).join('\n    ');
}

/** Crawlable fallback content + nav links for clients that do not run JS. */
function renderNoscript(siteUrl: string, meta: RouteMeta): string {
  const links = STATIC_ROUTES.filter((r) => r.index)
    .map((r) => `<li><a href="${r.path}">${escapeText(r.title.split(' | ')[0].split(' – ')[0])}</a></li>`)
    .join('');
  const a = BUSINESS_INFO.address;
  return `<noscript><div style="max-width:720px;margin:40px auto;padding:0 16px;font-family:sans-serif">
<h1>${escapeText(meta.title)}</h1>
<p>${escapeText(meta.description)}</p>
<nav><ul>${links}</ul></nav>
<p>${escapeText(BUSINESS_INFO.legalName)}, ${escapeText(a.fullFormatted)}. Phone/WhatsApp: ${escapeText(
    BUSINESS_INFO.displayPhone
  )}. Email: ${escapeText(BUSINESS_INFO.email)}.</p>
<p><a href="${siteUrl}/">${escapeText(BRAND)}</a></p>
</div></noscript>`;
}

/** Rewrites the SPA shell with route-specific metadata. */
export function rewriteShell(shell: Response, siteUrl: string, meta: RouteMeta): Response {
  const headers = new Headers(shell.headers);
  headers.set('Content-Type', 'text/html; charset=utf-8');
  headers.set('Cache-Control', 'public, max-age=0, must-revalidate');
  if (!meta.index) headers.set('X-Robots-Tag', 'noindex, nofollow');
  headers.delete('Content-Length');
  headers.delete('ETag');

  const rewritten = new HTMLRewriter()
    .on('title', {
      element(el) {
        el.setInnerContent(meta.title);
      }
    })
    // index.html ships its own fallback description/canonical/OG tags for
    // local dev; drop them so only the route-specific set below remains.
    .on('meta[name="description"], meta[name="robots"], meta[property^="og:"], meta[name^="twitter:"]', {
      element(el) {
        el.remove();
      }
    })
    .on('link[rel="canonical"], script[type="application/ld+json"]', {
      element(el) {
        el.remove();
      }
    })
    .on('head', {
      element(el) {
        el.append(renderHeadTags(siteUrl, meta), { html: true });
      }
    })
    .on('body', {
      element(el) {
        el.append(renderNoscript(siteUrl, meta), { html: true });
      }
    })
    .transform(new Response(shell.body, { status: meta.status ?? 200, headers }));
  return rewritten;
}

export function renderSitemap(siteUrl: string, products: Product[]): string {
  const today = new Date().toISOString().slice(0, 10);
  const urls = [
    ...STATIC_ROUTES.filter((r) => r.index && r.sitemap).map(
      (r) =>
        `<url><loc>${siteUrl}${r.path}</loc><lastmod>${today}</lastmod><changefreq>${r.sitemap!.changefreq}</changefreq><priority>${r.sitemap!.priority}</priority></url>`
    ),
    ...products.map((p) => {
      const img = absoluteUrl(siteUrl, p.image_url || p.images?.[0]);
      return `<url><loc>${siteUrl}/product/${encodeURIComponent(p.id)}</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.7</priority>${
        img ? `<image:image><image:loc>${escapeText(img)}</image:loc></image:image>` : ''
      }</url>`;
    })
  ];
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls.join('\n')}
</urlset>
`;
}

export function renderRobots(siteUrl: string): string {
  return `User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin
Disallow: /checkout
Disallow: /dashboard
Disallow: /wishlist
Disallow: /order-success
Disallow: /login

Sitemap: ${siteUrl}/sitemap.xml
`;
}

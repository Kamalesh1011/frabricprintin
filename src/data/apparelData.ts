import { ApparelProduct, ApparelCategory, ApparelColor, FabricVariantOption } from '../types';

export const APPAREL_COLORS: Record<string, ApparelColor> = {
  black: { name: 'Pitch Black', hex: '#161616' },
  white: { name: 'Optic White', hex: '#F9FAFB' },
  navy: { name: 'Deep Navy', hex: '#1B2A4A' },
  navyBlue: { name: 'Navy Blue', hex: '#1e3a8a' },
  royalBlue: { name: 'Royal Blue', hex: '#1D4ED8' },
  coolBlue: { name: 'Cool Blue', hex: '#38BDF8' },
  petrolBlue: { name: 'Petrol Blue', hex: '#0284C7' },
  skyBlue: { name: 'Sky Blue', hex: '#7dd3fc' },
  duskyPink: { name: 'Dusky Pink', hex: '#c08081' },
  lightPink: { name: 'Light Pink', hex: '#f472b6' },
  coffeeBrown: { name: 'Coffee Brown', hex: '#452b1f' },
  beige: { name: 'Beige', hex: '#d4b996' },
  cream: { name: 'Cream', hex: '#fdf6e2' },
  bottleGreen: { name: 'Bottle Green', hex: '#133e28' },
  oliveGreen: { name: 'Olive Green', hex: '#4D7C0F' },
  green: { name: 'Green', hex: '#15803D' },
  tealGreen: { name: 'Teal Green', hex: '#0F766E' },
  lavender: { name: 'Pastel Lavender', hex: '#C084FC' },
  purple: { name: 'Purple', hex: '#7e22ce' },
  crimsonRed: { name: 'Crimson Red', hex: '#DC2626' },
  maroon: { name: 'Burgundy Maroon', hex: '#6b1124' },
  yellow: { name: 'Mustard Yellow', hex: '#eab308' },
  charcoal: { name: 'Charcoal Grey', hex: '#374151' },
  heatherGrey: { name: 'Heather Grey', hex: '#9CA3AF' },
  orange: { name: 'Vibrant Orange', hex: '#EA580C' }
};

export const APPAREL_CATEGORIES_CONFIG = [
  { id: 'All', name: 'All apparel', count: 11, subtitle: '11 wholesale garments' },
  { id: 'T-Shirts', name: 'T-Shirts', count: 4, subtitle: 'Round neck, oversized & crop top' },
  { id: 'Polo Shirts', name: 'Polo Shirts', count: 2, subtitle: 'Matty pique & Mars polo' },
  { id: 'Hoodies', name: 'Hoodies & Sweats', count: 2, subtitle: '300 GSM Brushed Fleece' },
  { id: 'Kids', name: 'Kids Wear', count: 1, subtitle: '0 to 14 Years combed cotton' },
  { id: 'Sports Kit', name: 'Sports & Jerseys', count: 2, subtitle: 'Tournament sublimation kits' }
];

export const ALL_APPAREL_SIZES = ['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL'];
export const CROP_TOP_SIZES = ['XS', 'S', 'M', 'L', 'XL', '2XL'];
export const KIDS_APPAREL_SIZES = ['0-1Y', '1-2Y', '2-3Y', '3-4Y', '5-6Y', '7-8Y', '9-10Y', '11-12Y', '13-14Y'];

export const ALL_GSM_WEIGHTS = [160, 180, 200, 220, 240, 260, 300];

// --- 🛍️ PRODUCT DATABASE BASED DIRECTLY ON SEP 2026 CATALOG ---
export const APPAREL_PRODUCTS: ApparelProduct[] = [
  // 1. UNISEX ROUND NECK T-SHIRT (Catalog Page 3 & 4)
  {
    id: 'apparel-unisex-round-neck',
    name: 'Unisex Round Neck T-Shirt',
    slug: 'unisex-round-neck-t-shirt',
    category: 'T-Shirts',
    description: '100% Combed Cotton, Bio-Silicon Washed, Pre-Shrunk, Print Ready, Regular Fit. Lycra ribbed neck with high dimensional stability.',
    basePrice: 175,
    gsm: 180,
    fit: 'Regular Fit',
    fabric: '100% Combed Cotton',
    minOrderQty: 10,
    fabricVariants: [
      { name: 'Cotton - 180 GSM', gsm: 180, fabric: '100% Combed Cotton', price: 175, plusSizeSurcharge: { size3XL: 30, size4XL: 60 } },
      { name: 'Cotton - 220 GSM', gsm: 220, fabric: '100% Heavy Combed Cotton', price: 215, plusSizeSurcharge: { size3XL: 30, size4XL: 60 } },
      { name: 'French Terry - 240 GSM', gsm: 240, fabric: 'French Terry Cotton', price: 250, plusSizeSurcharge: { size3XL: 40, size4XL: 80 } }
    ],
    colors: [
      APPAREL_COLORS.black,
      APPAREL_COLORS.white,
      APPAREL_COLORS.duskyPink,
      APPAREL_COLORS.coffeeBrown,
      APPAREL_COLORS.navy,
      APPAREL_COLORS.royalBlue,
      APPAREL_COLORS.beige,
      APPAREL_COLORS.lavender,
      APPAREL_COLORS.crimsonRed,
      APPAREL_COLORS.maroon,
      APPAREL_COLORS.yellow,
      APPAREL_COLORS.green,
      APPAREL_COLORS.bottleGreen,
      APPAREL_COLORS.oliveGreen,
      APPAREL_COLORS.coolBlue,
      APPAREL_COLORS.purple
    ],
    sizes: ALL_APPAREL_SIZES,
    mockupImages: {
      front: '/mockups/white_tshirt_front.png',
      back: '/mockups/white_tshirt_back.png'
    },
    printTechniques: ['DTF Printing', 'Screen Printing', 'Puff 3D Printing', 'Embroidery', 'Woven Neck Label'],
    featured: true,
    badge: 'Catalog Best Seller',
    rating: 4.9,
    reviewsCount: 320
  },

  // 2. UNISEX OVERSIZED T-SHIRT (Catalog Page 5 & 6)
  {
    id: 'apparel-oversized-t-shirt',
    name: 'Unisex Oversized T-Shirt',
    slug: 'unisex-oversized-t-shirt',
    category: 'T-Shirts',
    description: '100% Combed Cotton, Bio-Silicon Washed, Pre-Shrunk, Print Ready. Boxy drop-shoulder silhouette with heavy 1-inch Lycra ribbed collar.',
    basePrice: 215,
    gsm: 180,
    fit: 'Drop Shoulder Oversized Fit',
    fabric: '100% Combed Cotton',
    minOrderQty: 10,
    fabricVariants: [
      { name: 'Cotton - 180 GSM', gsm: 180, fabric: '100% Combed Cotton', price: 215, plusSizeSurcharge: { size3XL: 30, size4XL: 60 } },
      { name: 'Cotton - 220 GSM', gsm: 220, fabric: '100% Heavy Combed Cotton', price: 255, plusSizeSurcharge: { size3XL: 30, size4XL: 60 } },
      { name: 'French Terry - 240 GSM', gsm: 240, fabric: 'French Terry Cotton', price: 275, plusSizeSurcharge: { size3XL: 40, size4XL: 80 } }
    ],
    colors: [
      APPAREL_COLORS.black,
      APPAREL_COLORS.white,
      APPAREL_COLORS.cream,
      APPAREL_COLORS.beige,
      APPAREL_COLORS.coffeeBrown,
      APPAREL_COLORS.navy,
      APPAREL_COLORS.royalBlue,
      APPAREL_COLORS.duskyPink,
      APPAREL_COLORS.lavender,
      APPAREL_COLORS.crimsonRed,
      APPAREL_COLORS.maroon,
      APPAREL_COLORS.bottleGreen,
      APPAREL_COLORS.coolBlue
    ],
    sizes: ALL_APPAREL_SIZES,
    mockupImages: {
      front: '/mockups/white_oversized_tee.png',
      back: '/mockups/white_oversized_tee.jpg'
    },
    printTechniques: ['Jumbo A3 DTF', 'Puff Print', 'Vintage Plastisol Screen', 'Brand Labels'],
    featured: true,
    badge: 'Streetwear Trend',
    rating: 5.0,
    reviewsCount: 285
  },

  // 3. ACID / OPTICAL WASH OVERSIZED TEE (Catalog Page 7)
  {
    id: 'apparel-acid-wash-tee',
    name: 'Acid Wash & Optical Wash Oversized Tee',
    slug: 'acid-wash-optical-oversized-tee',
    category: 'T-Shirts',
    description: '260 GSM Heavyweight 100% Combed Cotton, Acid/Mineral Washed, Pre-Shrunk, Print Ready, Unisex Drop Shoulder Fit. Unique vintage distressed wash.',
    basePrice: 310,
    gsm: 260,
    fit: 'Boxy Vintage Fit',
    fabric: '100% Mineral Washed Cotton',
    minOrderQty: 10,
    fabricVariants: [
      { name: 'Acid Wash Cotton - 260 GSM', gsm: 260, fabric: 'Mineral Acid Washed Cotton', price: 310, plusSizeSurcharge: { size3XL: 40, size4XL: 80 } },
      { name: 'Optical Wash Terry - 240 GSM', gsm: 240, fabric: 'Optical Washed French Terry', price: 295, plusSizeSurcharge: { size3XL: 40, size4XL: 80 } }
    ],
    colors: [
      APPAREL_COLORS.black,
      APPAREL_COLORS.navy,
      APPAREL_COLORS.maroon,
      APPAREL_COLORS.oliveGreen,
      APPAREL_COLORS.crimsonRed,
      APPAREL_COLORS.bottleGreen
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL'],
    mockupImages: {
      front: '/mockups/white_oversized_tee.jpg',
      back: '/mockups/white_oversized_tee.png'
    },
    printTechniques: ['DTF Printing', 'Discharge Bleach Print', 'High-Density Puff'],
    featured: true,
    badge: '260 GSM Vintage Heavy',
    rating: 4.9,
    reviewsCount: 142
  },

  // 4. CROP TOP (Catalog Page 12)
  {
    id: 'apparel-crop-top',
    name: 'Women’s Cropped Boxy Tee',
    slug: 'womens-crop-top',
    category: 'T-Shirts',
    description: '100% Combed Cotton, Bio-Silicon Washed, Pre-Shrunk, Print Ready, Cropped Silhouette. Relaxed fit with modern ribbed neckline.',
    basePrice: 145,
    gsm: 180,
    fit: 'Cropped Boxy Fit',
    fabric: '100% Combed Cotton',
    minOrderQty: 10,
    fabricVariants: [
      { name: 'Cotton - 180 GSM', gsm: 180, fabric: '100% Combed Cotton', price: 145, plusSizeSurcharge: { size3XL: 30, size4XL: 60 } },
      { name: 'Cotton - 220 GSM', gsm: 220, fabric: '100% Combed Cotton', price: 180, plusSizeSurcharge: { size3XL: 30, size4XL: 60 } },
      { name: 'French Terry - 240 GSM', gsm: 240, fabric: 'French Terry Cotton', price: 205, plusSizeSurcharge: { size3XL: 40, size4XL: 80 } }
    ],
    colors: [
      APPAREL_COLORS.black,
      APPAREL_COLORS.white,
      APPAREL_COLORS.navy,
      APPAREL_COLORS.lavender,
      APPAREL_COLORS.lightPink
    ],
    sizes: CROP_TOP_SIZES,
    mockupImages: {
      front: '/mockups/white_tshirt_front.jpg',
      back: '/mockups/white_tshirt_back.jpg'
    },
    printTechniques: ['Chest DTF', 'Puff Print', 'Screen Print'],
    badge: 'Cropped Fit',
    rating: 4.8,
    reviewsCount: 94
  },

  // 5. COTTON POLO T-SHIRT (Catalog Page 10)
  {
    id: 'apparel-cotton-collar-polo',
    name: 'Cotton Collar Polo T-Shirt',
    slug: 'cotton-collar-polo-t-shirt',
    category: 'Polo Shirts',
    description: '240 GSM Honeycomb Matty Pique Knit Cotton, 100% Combed Cotton, Bio-Silicon Washed, Pre-Shrunk. 2-Button reinforced placket, flat knit collar & cuffs.',
    basePrice: 305,
    gsm: 240,
    fit: 'Regular Smart-Casual Fit',
    fabric: '100% Matty Pique Cotton',
    minOrderQty: 10,
    fabricVariants: [
      { name: 'Cotton Matty - 240 GSM', gsm: 240, fabric: '100% Honeycomb Matty Pique', price: 305, plusSizeSurcharge: { size3XL: 30, size4XL: 60 } }
    ],
    colors: [
      APPAREL_COLORS.black,
      APPAREL_COLORS.white,
      APPAREL_COLORS.coffeeBrown,
      APPAREL_COLORS.maroon,
      APPAREL_COLORS.petrolBlue,
      APPAREL_COLORS.navy,
      APPAREL_COLORS.bottleGreen,
      APPAREL_COLORS.coolBlue,
      APPAREL_COLORS.crimsonRed,
      APPAREL_COLORS.royalBlue
    ],
    sizes: ALL_APPAREL_SIZES,
    mockupImages: {
      front: '/mockups/white_polo_front.png',
      back: '/mockups/white_polo_front.jpg'
    },
    printTechniques: ['Chest Pocket DTF', 'Fine Thread Embroidery', 'Sublimation Crest'],
    featured: true,
    badge: '240 GSM Matty Pique',
    rating: 4.9,
    reviewsCount: 185
  },

  // 6. MARS POLO T-SHIRT (Catalog Page 11)
  {
    id: 'apparel-mars-polo',
    name: 'Mars Polo T-Shirt (Contrast Tipping)',
    slug: 'mars-polo-t-shirt',
    category: 'Polo Shirts',
    description: '200 GSM 100% Combed Cotton, Bio-Silicon Washed, Pre-Shrunk, Print Ready, Modern Regular Fit. Contemporary accent placket & contrast collar edge.',
    basePrice: 215,
    gsm: 200,
    fit: 'Modern Regular Fit',
    fabric: '100% Combed Cotton',
    minOrderQty: 10,
    fabricVariants: [
      { name: 'Cotton Mars - 200 GSM', gsm: 200, fabric: '100% Combed Cotton', price: 215, plusSizeSurcharge: { size3XL: 30, size4XL: 60 } }
    ],
    colors: [
      APPAREL_COLORS.black,
      APPAREL_COLORS.white,
      APPAREL_COLORS.navy
    ],
    sizes: ALL_APPAREL_SIZES,
    mockupImages: {
      front: '/mockups/white_polo_front.jpg',
      back: '/mockups/white_polo_front.png'
    },
    printTechniques: ['Chest DTF', 'Embroidery', 'Reflective Decal'],
    badge: '200 GSM Value Polo',
    rating: 4.8,
    reviewsCount: 88
  },

  // 7. KIDS ROUND NECK T-SHIRT (Catalog Page 13)
  {
    id: 'apparel-kids-round-neck',
    name: 'Kids Round Neck Soft Cotton Tee',
    slug: 'kids-round-neck-soft-cotton-tee',
    category: 'Kids',
    description: '100% Combed Cotton, Bio-Silicon Washed, Pre-Shrunk, Print Ready, Hypoallergenic ultra-soft feel. Available from 0-1 Yr infants to 14 Yr teens.',
    basePrice: 135,
    gsm: 180,
    fit: 'Kids Comfort Fit',
    fabric: '100% Bio-Washed Combed Cotton',
    minOrderQty: 10,
    fabricVariants: [
      { name: '0–5 Yrs: Cotton 180 GSM', gsm: 180, fabric: '100% Combed Cotton', price: 135 },
      { name: '0–5 Yrs: Cotton 220 GSM', gsm: 220, fabric: '100% Combed Cotton', price: 175 },
      { name: '0–5 Yrs: French Terry 240 GSM', gsm: 240, fabric: 'French Terry Cotton', price: 205 },
      { name: '6–14 Yrs: Cotton 180 GSM', gsm: 180, fabric: '100% Combed Cotton', price: 165 },
      { name: '6–14 Yrs: Cotton 220 GSM', gsm: 220, fabric: '100% Combed Cotton', price: 205 },
      { name: '6–14 Yrs: French Terry 240 GSM', gsm: 240, fabric: 'French Terry Cotton', price: 235 }
    ],
    colors: [
      APPAREL_COLORS.black,
      APPAREL_COLORS.white,
      APPAREL_COLORS.royalBlue,
      APPAREL_COLORS.crimsonRed,
      APPAREL_COLORS.yellow,
      APPAREL_COLORS.skyBlue,
      APPAREL_COLORS.lavender,
      APPAREL_COLORS.lightPink
    ],
    sizes: KIDS_APPAREL_SIZES,
    mockupImages: {
      front: '/mockups/white_tshirt_front.png',
      back: '/mockups/white_tshirt_back.png'
    },
    printTechniques: ['Baby-Safe Non-Toxic DTF', 'Water-Based Screen Print'],
    badge: '0–14 Yrs Range',
    rating: 4.9,
    reviewsCount: 116
  },

  // 8. UNISEX HOODIE (Catalog Page 8)
  {
    id: 'apparel-heavyweight-fleece-hoodie',
    name: 'Unisex Heavyweight Fleece Hoodie',
    slug: 'unisex-fleece-pullover-hoodie',
    category: 'Hoodies',
    description: '300 GSM 100% Combed Cotton Brushed Fleece, Pre-Shrunk, Print Ready, Unisex Fit. Double-layer hood, matching cotton drawstring, kangaroo pocket.',
    basePrice: 480,
    gsm: 300,
    fit: 'Relaxed Comfort Fit',
    fabric: '100% Brushed Cotton Fleece',
    minOrderQty: 10,
    fabricVariants: [
      { name: 'Brushed Fleece - 300 GSM', gsm: 300, fabric: '100% Cotton Brushed Fleece', price: 480, plusSizeSurcharge: { size3XL: 30, size4XL: 60 } }
    ],
    colors: [
      APPAREL_COLORS.black,
      APPAREL_COLORS.white,
      APPAREL_COLORS.navy,
      APPAREL_COLORS.lavender,
      APPAREL_COLORS.maroon
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'],
    mockupImages: {
      front: '/mockups/white_hoodie_front.png',
      back: '/mockups/white_hoodie_front.jpg'
    },
    printTechniques: ['Jumbo Back DTF', 'Puff 3D Print', 'Kangaroo Pocket Logo', 'Embroidery'],
    featured: true,
    badge: '300 GSM Fleece',
    rating: 4.9,
    reviewsCount: 198
  },

  // 9. UNISEX SWEATSHIRT (Catalog Page 9)
  {
    id: 'apparel-crewneck-sweatshirt',
    name: 'Unisex Classic Crewneck Sweatshirt',
    slug: 'unisex-crewneck-sweatshirt',
    category: 'Hoodies',
    description: '300 GSM 100% Combed Cotton, Bio-Silicon Washed, Pre-Shrunk, Print Ready, Regular Fit. Thick ribbed neck, cuffs and hem with spandex shape memory.',
    basePrice: 380,
    gsm: 300,
    fit: 'Regular Warm Fit',
    fabric: '100% Brushed Cotton Fleece',
    minOrderQty: 10,
    fabricVariants: [
      { name: 'Brushed Fleece - 300 GSM', gsm: 300, fabric: '100% Cotton Brushed Fleece', price: 380, plusSizeSurcharge: { size3XL: 30, size4XL: 60 } }
    ],
    colors: [
      APPAREL_COLORS.black,
      APPAREL_COLORS.white,
      APPAREL_COLORS.navy,
      APPAREL_COLORS.lavender,
      APPAREL_COLORS.maroon
    ],
    sizes: ALL_APPAREL_SIZES,
    mockupImages: {
      front: '/mockups/white_hoodie_front.png',
      back: '/mockups/white_hoodie_front.jpg'
    },
    printTechniques: ['Chest DTF', 'Puff 3D Print', 'Embroidery'],
    badge: '300 GSM Fleece',
    rating: 4.8,
    reviewsCount: 112
  },

  // 10. SPORTS ROUND NECK DRY-FIT TEE (Catalog Sports Range)
  {
    id: 'apparel-sports-round-neck',
    name: 'Sports Round Neck Dry-Fit Performance Tee',
    slug: 'sports-round-neck-dry-fit-tee',
    category: 'Sports Kit',
    description: '160 GSM 100% Polyester Micro-Dot Dry-Fit mesh. Ultra-breathable, moisture wicking, engineered for sports academies, cricket & football.',
    basePrice: 349,
    gsm: 160,
    fit: 'Athletic Dry-Fit',
    fabric: '100% Polyester Mesh',
    minOrderQty: 10,
    colors: [
      APPAREL_COLORS.black,
      APPAREL_COLORS.white,
      APPAREL_COLORS.royalBlue,
      APPAREL_COLORS.navy,
      APPAREL_COLORS.crimsonRed,
      APPAREL_COLORS.tealGreen
    ],
    sizes: ALL_APPAREL_SIZES,
    mockupImages: {
      front: '/mockups/white_mens_jersey.jpg',
      back: '/mockups/white_mens_jersey.jpg'
    },
    printTechniques: ['All-Over Sublimation', 'DTF Names & Numbers', 'Chest Crest'],
    featured: true,
    badge: 'Quick-Dry 160 GSM',
    rating: 4.9,
    reviewsCount: 140
  },

  // 11. PRO SUBLIMATION CRICKET & TOURNAMENT JERSEY KIT
  {
    id: 'apparel-sports-cricket-jersey',
    name: 'Pro Sublimation Tournament Jersey Kit',
    slug: 'pro-sublimation-tournament-jersey-kit',
    category: 'Sports Kit',
    description: 'Full sublimated custom tournament jersey with contrast raglan sleeves, collar button placket, roster names and numbers included.',
    basePrice: 399,
    gsm: 160,
    fit: 'Pro Tournament Fit',
    fabric: '100% Interlock Sublimation Polyester',
    minOrderQty: 10,
    colors: [
      APPAREL_COLORS.royalBlue,
      APPAREL_COLORS.navy,
      APPAREL_COLORS.crimsonRed,
      APPAREL_COLORS.tealGreen,
      APPAREL_COLORS.yellow
    ],
    sizes: ALL_APPAREL_SIZES,
    mockupImages: {
      front: '/mockups/white_mens_jersey.jpg',
      back: '/mockups/white_mens_jersey.jpg'
    },
    printTechniques: ['All-Over Gradient Sublimation', 'Player Names & Numbers Free'],
    featured: true,
    badge: 'Tournament Kit',
    rating: 5.0,
    reviewsCount: 172
  }
];

// --- 📏 EXACT CATALOG SIZE CHARTS (PAGES 14 TO 17 OF SEP 2026 CATALOG) ---
export interface CatalogSizeEntry {
  size: string;
  chestInches: number | string;
  lengthInches: number | string;
  sleeveInches: number | string;
  notes?: string;
}

export const CATALOG_SIZE_CHARTS: Record<
  string,
  { title: string; subtitle: string; tolerance: string; entries: CatalogSizeEntry[] }
> = {
  round_neck: {
    title: 'Unisex Round Neck T-Shirt',
    subtitle: 'Standard & French Terry Regular Fit',
    tolerance: '±0.5 inch per side tolerance is applicable from mentioned values',
    entries: [
      { size: 'S', chestInches: 38, lengthInches: 26, sleeveInches: 7.5 },
      { size: 'M', chestInches: 40, lengthInches: 27, sleeveInches: 8.0 },
      { size: 'L', chestInches: 42, lengthInches: 28, sleeveInches: 8.0 },
      { size: 'XL', chestInches: 44, lengthInches: 29, sleeveInches: 8.5 },
      { size: '2XL', chestInches: 46, lengthInches: 30, sleeveInches: 9.0 },
      { size: '3XL', chestInches: 48, lengthInches: 31, sleeveInches: 9.0 },
      { size: '4XL', chestInches: 50, lengthInches: 32, sleeveInches: 9.5 }
    ]
  },
  oversized: {
    title: 'Unisex Oversized T-Shirt',
    subtitle: 'Drop-Shoulder Streetwear Boxy Fit',
    tolerance: '±0.5 inch per side tolerance is applicable from mentioned values',
    entries: [
      { size: 'S', chestInches: 41, lengthInches: 28, sleeveInches: 8.5 },
      { size: 'M', chestInches: 43, lengthInches: 29, sleeveInches: 9.5 },
      { size: 'L', chestInches: 45, lengthInches: 30, sleeveInches: 10.5 },
      { size: 'XL', chestInches: 47, lengthInches: 31, sleeveInches: 11.5 },
      { size: '2XL', chestInches: 49, lengthInches: 32, sleeveInches: 12.5 },
      { size: '3XL', chestInches: 51, lengthInches: 33, sleeveInches: 13.5 },
      { size: '4XL', chestInches: 53, lengthInches: 34, sleeveInches: 14.5 }
    ]
  },
  hoodie_sweatshirt: {
    title: 'Unisex Hoodies & Sweatshirts',
    subtitle: '300 GSM Brushed Fleece Outerwear',
    tolerance: '±0.5 inch per side tolerance is applicable from mentioned values',
    entries: [
      { size: 'S', chestInches: 40, lengthInches: 26, sleeveInches: 24.0 },
      { size: 'M', chestInches: 42, lengthInches: 27, sleeveInches: 25.0 },
      { size: 'L', chestInches: 44, lengthInches: 28, sleeveInches: 26.0 },
      { size: 'XL', chestInches: 46, lengthInches: 29, sleeveInches: 27.0 },
      { size: '2XL', chestInches: 48, lengthInches: 30, sleeveInches: 28.0 },
      { size: '3XL', chestInches: 50, lengthInches: 31, sleeveInches: 29.0 },
      { size: '4XL', chestInches: 52, lengthInches: 32, sleeveInches: 30.0 }
    ]
  },
  polo: {
    title: 'Polo T-Shirts (Matty & Mars)',
    subtitle: 'Honeycomb Pique & Combed Cotton Collared',
    tolerance: '±0.5 inch per side tolerance is applicable from mentioned values',
    entries: [
      { size: 'S', chestInches: 38, lengthInches: 26, sleeveInches: 8.0 },
      { size: 'M', chestInches: 40, lengthInches: 27, sleeveInches: 8.5 },
      { size: 'L', chestInches: 42, lengthInches: 28, sleeveInches: 8.5 },
      { size: 'XL', chestInches: 44, lengthInches: 29, sleeveInches: 9.0 },
      { size: '2XL', chestInches: 46, lengthInches: 30, sleeveInches: 9.0 },
      { size: '3XL', chestInches: 48, lengthInches: 31, sleeveInches: 9.5 },
      { size: '4XL', chestInches: 50, lengthInches: 32, sleeveInches: 9.5 }
    ]
  },
  crop_top: {
    title: 'Crop Tops',
    subtitle: 'Women’s Cropped Boxy Silhouette',
    tolerance: '±0.5 inch per side tolerance is applicable from mentioned values',
    entries: [
      { size: 'XS', chestInches: 32, lengthInches: 15.5, sleeveInches: 5.0 },
      { size: 'S', chestInches: 34, lengthInches: 16.5, sleeveInches: 5.0 },
      { size: 'M', chestInches: 36, lengthInches: 17.5, sleeveInches: 5.5 },
      { size: 'L', chestInches: 38, lengthInches: 18.5, sleeveInches: 6.0 },
      { size: 'XL', chestInches: 40, lengthInches: 19.5, sleeveInches: 6.5 },
      { size: '2XL', chestInches: 42, lengthInches: 20.5, sleeveInches: 7.0 }
    ]
  },
  optical_wash: {
    title: 'Optical / Acid Wash Oversized T-Shirt',
    subtitle: 'Mineral Washed Heavy Streetwear',
    tolerance: '±0.5 inch per side tolerance is applicable from mentioned values',
    entries: [
      { size: 'S', chestInches: 41, lengthInches: 28, sleeveInches: 8.5 },
      { size: 'M', chestInches: 43, lengthInches: 29, sleeveInches: 9.5 },
      { size: 'L', chestInches: 45, lengthInches: 30, sleeveInches: 10.5 },
      { size: 'XL', chestInches: 47, lengthInches: 31, sleeveInches: 11.5 },
      { size: '2XL', chestInches: 49, lengthInches: 32, sleeveInches: 12.5 }
    ]
  },
  kids: {
    title: 'Kids T-Shirt Sizing Matrix',
    subtitle: 'Ages 0 to 14 Years',
    tolerance: '±0.5 inch per side tolerance is applicable from mentioned values',
    entries: [
      { size: '0–12 M', chestInches: 20, lengthInches: 12.5, sleeveInches: 5.0 },
      { size: '12–23 M', chestInches: 22, lengthInches: 14.0, sleeveInches: 5.5 },
      { size: '24–35 M', chestInches: 24, lengthInches: 15.5, sleeveInches: 6.0 },
      { size: '36–48 M', chestInches: 26, lengthInches: 17.0, sleeveInches: 6.0 },
      { size: '5–6 Yrs', chestInches: 28, lengthInches: 18.5, sleeveInches: 6.5 },
      { size: '7–8 Yrs', chestInches: 30, lengthInches: 20.0, sleeveInches: 6.5 },
      { size: '9–10 Yrs', chestInches: 32, lengthInches: 21.5, sleeveInches: 7.0 },
      { size: '11–12 Yrs', chestInches: 34, lengthInches: 23.0, sleeveInches: 7.0 },
      { size: '13–14 Yrs', chestInches: 36, lengthInches: 24.5, sleeveInches: 7.5 }
    ]
  }
};

// --- 🖨️ DTF PRINTING CHARGES RATE CARD (PAGE 18 OF SEP 2026 CATALOG) ---
export const CATALOG_DTF_PRINT_RATES = {
  tier1_10_to_30: {
    label: 'Orders: 10 – 30 Pcs',
    a3: { name: 'A3 Jumbo', dims: '29.7 cm × 42 cm', price: 90 },
    a4: { name: 'A4 Standard', dims: '21 cm × 29.7 cm', price: 75 },
    chest: { name: 'Chest Banner', dims: '28 cm × 10 cm', price: 45 },
    pocket: { name: 'Pocket Left/Right', dims: '10 cm × 10 cm', price: 30 },
    neckLabel: { name: 'Neck Label Tag', dims: '5 cm × 2 cm', price: 5 }
  },
  tier2_above_30: {
    label: 'Orders: Above 30 Pcs',
    a3: { name: 'A3 Jumbo', dims: '29.7 cm × 42 cm', price: 80 },
    a4: { name: 'A4 Standard', dims: '21 cm × 29.7 cm', price: 70 },
    chest: { name: 'Chest Banner', dims: '28 cm × 10 cm', price: 40 },
    pocket: { name: 'Pocket Left/Right', dims: '10 cm × 10 cm', price: 25 },
    neckLabel: { name: 'Neck Label Tag', dims: '5 cm × 2 cm', price: 5 }
  },
  disclaimer: 'Prices shown are for DTF printing only. GST and shipping charges extra.'
};

// --- 🏷️ PRINTING SERVICES & BRANDING (PAGE 20 OF CATALOG) ---
export const CATALOG_PRINT_TECHNIQUES = [
  { name: 'DTF Printing', desc: 'Direct to Film vibrant photographic prints on all fabric shades', priceStarting: 25, moq: 50, badge: 'Popular' },
  { name: 'Puff 3D Printing', desc: 'Raised tactile embossed effect for streetwear graphics', priceStarting: 45, moq: 50, badge: 'Streetwear' },
  { name: 'Screen Printing', desc: 'High volume spot color plastisol & discharge prints', priceStarting: 20, moq: 500, badge: 'Bulk Best Value' },
  { name: 'Acid & Gas Wash', desc: 'Distressed vintage stone wash and mineral fading treatment', priceStarting: 65, moq: 500, badge: 'Custom Wash' },
  { name: 'Custom Brand Labels', desc: 'Woven & satin heat transfer inner neck labels', priceStarting: 5, moq: 50, badge: 'Branding' },
  { name: 'Hang Tags', desc: 'Custom printed die-cut thick paper hang tags with strings', priceStarting: 4, moq: 50, badge: 'Branding' },
  { name: 'Computerized Embroidery', desc: 'High density thread embroidery for logos & crests', priceStarting: 35, moq: 50, badge: 'Premium' }
];

// --- 📦 SAMPLE CHARGES & POLICIES (PAGE 21 OF CATALOG) ---
export const CATALOG_SAMPLE_PRICING = [
  { product: 'DTF Printed Sample (Any Garment)', gsm: 'Any', price: 299, note: 'Includes 1 custom printed garment with your uploaded artwork' },
  { product: 'Cotton Round Neck', gsm: '180, 220 GSM', price: 249, note: 'Plain single piece sample' },
  { product: 'French Terry Round Neck', gsm: '240 GSM', price: 349, note: 'Plain single piece sample' },
  { product: 'Cotton Oversized Tee', gsm: '180, 220 GSM', price: 299, note: 'Plain single piece sample' },
  { product: 'French Terry Oversized Tee', gsm: '240 GSM', price: 399, note: 'Plain single piece sample' },
  { product: 'Cotton Polo / Mars Polo', gsm: '240 / 200 GSM', price: 399, note: 'Plain single piece sample' },
  { product: 'Unisex Hoodie', gsm: '300 GSM Fleece', price: 549, note: 'Plain single piece sample' },
  { product: 'Unisex Sweatshirt', gsm: '300 GSM Fleece', price: 549, note: 'Plain single piece sample' },
  { product: 'Crop Top (Cotton & Terry)', gsm: '180, 220, 240 GSM', price: 249, note: 'Plain single piece sample' },
  { product: 'Optical & Acid Wash Oversized', gsm: '240, 260 GSM', price: 399, note: 'Plain single piece sample' }
];

export const SPORTS_KIT_PRESETS = [
  {
    sport: 'Cricket',
    subtitle: 'Whites, coloured kit, training tees',
    image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&q=80&w=600',
    tag: 'Collared & raglan'
  },
  {
    sport: 'Football',
    subtitle: 'Club, academy and five-a-side kits',
    image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=600',
    tag: 'V-neck & breathable'
  },
  {
    sport: 'Basketball',
    subtitle: 'Reversible-look tanks and shorts',
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&q=80&w=600',
    tag: 'Sleeveless tank'
  },
  {
    sport: 'Volleyball',
    subtitle: 'Light dry-fit for indoor and beach',
    image: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&q=80&w=600',
    tag: 'Stretch comfort'
  },
  {
    sport: 'Athletics',
    subtitle: 'Club vests, singlets and warm-ups',
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&q=80&w=600',
    tag: 'Ultralight 130 GSM'
  }
];

export const SAMPLE_GRAPHICS_LIBRARY = [
  {
    id: 'tiger-cyber',
    name: 'Cyberpunk Tiger Head',
    category: 'Streetwear',
    url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=500'
  },
  {
    id: 'tokyo-neon',
    name: 'Neo Tokyo Typography',
    category: 'Typography',
    url: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&q=80&w=500'
  },
  {
    id: 'botanical-crest',
    name: 'Vintage Floral Crest',
    category: 'Vintage',
    url: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&q=80&w=500'
  },
  {
    id: 'retro-sunset',
    name: 'Retro 80s Sunset Wave',
    category: 'Retro',
    url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=500'
  }
];

export const PRINT_PLACEMENT_CONFIG: Record<
  string,
  { name: string; surcharge: number; surchargeTier2: number; dimensions: string; placementClass: string; badge: string }
> = {
  none: {
    name: 'Plain / Blank Garment',
    surcharge: 0,
    surchargeTier2: 0,
    dimensions: 'No Printing',
    placementClass: '',
    badge: 'Base Wholesale'
  },
  pocket_left: {
    name: 'Left Chest Pocket (10cm × 10cm)',
    surcharge: 30,
    surchargeTier2: 25,
    dimensions: '10 cm × 10 cm',
    placementClass: 'w-16 h-16 top-[28%] left-[60%]',
    badge: '+₹30 / pc'
  },
  chest_center: {
    name: 'Center Chest Banner (28cm × 10cm)',
    surcharge: 45,
    surchargeTier2: 40,
    dimensions: '28 cm × 10 cm',
    placementClass: 'w-32 h-16 top-[30%] left-[32%]',
    badge: '+₹45 / pc'
  },
  a4_front: {
    name: 'A4 Standard Front (21cm × 29.7cm)',
    surcharge: 75,
    surchargeTier2: 70,
    dimensions: '21 cm × 29.7 cm',
    placementClass: 'w-36 h-48 top-[24%] left-[30%]',
    badge: '+₹75 / pc'
  },
  a3_front: {
    name: 'A3 Jumbo Front (29.7cm × 42cm)',
    surcharge: 90,
    surchargeTier2: 80,
    dimensions: '29.7 cm × 42 cm',
    placementClass: 'w-44 h-56 top-[20%] left-[24%]',
    badge: '+₹90 / pc'
  },
  full_back: {
    name: 'Full Back Print (A3 Jumbo)',
    surcharge: 90,
    surchargeTier2: 80,
    dimensions: '29.7 cm × 42 cm',
    placementClass: 'w-44 h-56 top-[20%] left-[24%]',
    badge: '+₹90 / pc'
  },
  front_and_back: {
    name: 'Pocket Front + A3 Back Print',
    surcharge: 120,
    surchargeTier2: 105,
    dimensions: 'Double Sided DTF',
    placementClass: 'w-36 h-48 top-[24%] left-[30%]',
    badge: '+₹120 / pc'
  }
};

export const SIZE_CHART_DATA = CATALOG_SIZE_CHARTS.round_neck.entries;

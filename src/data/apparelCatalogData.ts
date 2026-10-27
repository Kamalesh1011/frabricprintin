import { GarmentModelType } from '../components/GarmentMockup';

export type ApparelSupplierCatalog = 'ZYMBO FASHION' | 'PLAIN T-SHIRTS TIRUPUR';

export interface ApparelDemographic {
  id: 'all' | 'mens' | 'womens' | 'kids' | 'oversized' | 'polo' | 'winter_wear';
  title: string;
  badge: string;
  subtitle: string;
  heroImage: string;
  ageRange: string;
  description: string;
}

export interface ApparelColorSwatch {
  name: string;
  hex: string;
  code: string;
}

export interface PricingTier {
  label: string;
  minQty: number;
  price: number;
}

export interface SizePricing {
  size: string;
  price: number;
}

export interface GsmVariant {
  id: string;
  gsm: string;
  fabric: string;
  price: number;
  samplePrice?: number;
  tag?: string;
  colors?: ApparelColorSwatch[];
}

export interface SizeMeasurement {
  size: string;
  length: number;
  chest: number;
  shoulder?: number;
  sleeve?: number;
}

export interface ApparelGarmentItem {
  id: string;
  catalog: ApparelSupplierCatalog;
  demographicId: 'all' | 'mens' | 'womens' | 'kids' | 'oversized' | 'polo' | 'winter_wear';
  demographicTitle: string;
  type: 'Round Neck' | 'Oversized' | 'Collar' | 'Polo' | 'Crop Top' | 'Hoodie' | 'Sweatshirt' | 'Kids';
  modelType: GarmentModelType;
  name: string;
  code: string;
  subtitle: string;
  description: string;
  fit: string;
  fabric: string;
  cottonType: string;
  gsm: string;
  wash: string;
  price: number; // Starting / Base wholesale price
  originalPrice: number;
  samplePrice?: number;
  pricingTiers?: PricingTier[];
  sizePricing?: SizePricing[];
  gsmVariants?: GsmVariant[];
  plusSizePricing?: string;
  moq: string;
  packaging: string;
  features: string[];
  sizes: string[];
  sizeMeasurements?: SizeMeasurement[];
  colors: ApparelColorSwatch[];
  rating: number;
  reviewCount: number;
  sourcePage: string;
}

// 🌈 MASTER EXACT COLOR PALETTES FROM CATALOGS
export const CATALOG_COLOR_MAP: Record<string, ApparelColorSwatch> = {
  Mustard: { name: 'Mustard', hex: '#D99B26', code: 'MST' },
  Black: { name: 'Black', hex: '#111827', code: 'BLK' },
  White: { name: 'White', hex: '#FFFFFF', code: 'WHT' },
  Red: { name: 'Red', hex: '#DC2626', code: 'RED' },
  Navy: { name: 'Navy', hex: '#1E3A8A', code: 'NVY' },
  'Navy Blue': { name: 'Navy Blue', hex: '#1E3A8A', code: 'NVYB' },
  Merun: { name: 'Merun', hex: '#7F1D1D', code: 'MRN' },
  Maroon: { name: 'Maroon', hex: '#7F1D1D', code: 'MAR' },
  'Aq.Blue': { name: 'Aq.Blue', hex: '#38BDF8', code: 'AQB' },
  'Sky Blue': { name: 'Sky Blue', hex: '#7DD3FC', code: 'SKB' },
  'Cool Blue': { name: 'Cool Blue', hex: '#60A5FA', code: 'CLB' },
  'P.Green': { name: 'P.Green', hex: '#0F766E', code: 'PGR' },
  'Petrol Green': { name: 'Petrol Green', hex: '#0F766E', code: 'PTG' },
  'Petrol Blue': { name: 'Petrol Blue', hex: '#0284C7', code: 'PTB' },
  'Royal.Blue': { name: 'Royal.Blue', hex: '#2563EB', code: 'RYB' },
  'Royal Blue': { name: 'Royal Blue', hex: '#2563EB', code: 'RBL' },
  Grey: { name: 'Grey', hex: '#9CA3AF', code: 'GRY' },
  Lavender: { name: 'Lavender', hex: '#C084FC', code: 'LAV' },
  'Dusty Rose': { name: 'Dusty Rose', hex: '#E879F9', code: 'DTR' },
  'Dusky Pink': { name: 'Dusky Pink', hex: '#E879F9', code: 'DSP' },
  Orange: { name: 'Orange', hex: '#F97316', code: 'ORG' },
  'Mehandhi Green': { name: 'Mehandhi Green', hex: '#65A30D', code: 'MHG' },
  'Olive Green': { name: 'Olive Green', hex: '#65A30D', code: 'OLV' },
  Green: { name: 'Green', hex: '#16A34A', code: 'GRN' },
  'Bottle Green': { name: 'Bottle Green', hex: '#14532D', code: 'BTG' },
  Brown: { name: 'Brown', hex: '#78350F', code: 'BRN' },
  'Coffee Brown': { name: 'Coffee Brown', hex: '#78350F', code: 'CFB' },
  'Lem.Yellow': { name: 'Lem.Yellow', hex: '#FACC15', code: 'LMY' },
  Yellow: { name: 'Yellow', hex: '#FACC15', code: 'YEL' },
  Wine: { name: 'Wine', hex: '#581C87', code: 'WIN' },
  Beige: { name: 'Beige', hex: '#F5E6D3', code: 'BGE' },
  Cream: { name: 'Cream', hex: '#FDFBF7', code: 'CRM' },
  Purple: { name: 'Purple', hex: '#7E22CE', code: 'PRP' },
  'Light Pink': { name: 'Light Pink', hex: '#F472B6', code: 'LPK' }
};

const c = (names: string[]): ApparelColorSwatch[] => {
  // Ensure pristine white is always the default first color option for Magnific-style 3D studio mockups
  const reordered = ['White', ...names.filter(n => n !== 'White')];
  return reordered.map(n => CATALOG_COLOR_MAP[n] || { name: n, hex: '#4B5563', code: n.substring(0, 3).toUpperCase() });
};

// 🏛️ CATALOG CATEGORY / DEMOGRAPHIC NAVIGATION SECTORS
export const APPAREL_DEMOGRAPHICS: ApparelDemographic[] = [
  {
    id: 'all',
    title: 'ALL APPAREL',
    badge: 'All Styles',
    subtitle: 'Browse all plain blanks, oversized tees, polos, hoodies & kidswear',
    heroImage: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=60&w=800',
    ageRange: 'Complete Collection',
    description: 'Premium plain blanks, oversized tees, polos, hoodies & kidswear with instant custom printing.'
  },
  {
    id: 'mens',
    title: 'MEN',
    badge: '180–240 GSM Classics',
    subtitle: 'Round neck blanks, regular combed cotton, collar tees & polo shirts',
    heroImage: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=60&w=800',
    ageRange: 'Adult S to 4XL',
    description: '180 GSM Single Jersey & 240 GSM Air Tech knit with bio-wash finish and invisible stitching.'
  },
  {
    id: 'womens',
    title: 'WOMEN',
    badge: 'Round Neck & Crop Tops',
    subtitle: 'Contoured round neck tees & 180/220/240 GSM crop tops',
    heroImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=60&w=800',
    ageRange: 'Adult S to 2XL',
    description: '100% Super-Combed bio-wash tees and street-fashion crop tops in lightweight and French Terry.'
  },
  {
    id: 'oversized',
    title: 'OVERSIZED',
    badge: 'Streetwear 180–260 GSM',
    subtitle: 'French terry oversized, combed cotton drop-shoulder & acid wash tees',
    heroImage: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=60&w=800',
    ageRange: 'XS to 2XL',
    description: 'Heavyweight drop-shoulder street silhouettes in 240 GSM French Terry and 260 GSM vintage Acid Wash.'
  },
  {
    id: 'polo',
    title: 'POLO',
    badge: 'Air Tech & Mars Polestar',
    subtitle: '240 GSM Air Tech Cotton Collar, Cotton Polo & Mars Polestar Polos',
    heroImage: 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?auto=format&fit=crop&q=60&w=800',
    ageRange: 'S to 4XL',
    description: 'Structured pique knitwear, anti-curl collars and durable Mars Polestar corporate blanks.'
  },
  {
    id: 'winter_wear',
    title: 'WINTER WEAR',
    badge: '300 GSM Heavy Fleece',
    subtitle: 'Unisex heavyweight fleece hoodies & bio-silicon washed sweatshirts',
    heroImage: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=60&w=800',
    ageRange: 'S to 4XL',
    description: '300 GSM plush thermal interior fleece with double-layered hoods and Lycra ribbed cuffs.'
  },
  {
    id: 'kids',
    title: 'KIDS & BOYS',
    badge: 'Ages 0 to 14 Years',
    subtitle: '180–240 GSM infant envelope tees, kids crewnecks & boys tees',
    heroImage: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&q=60&w=800',
    ageRange: '0–5 yrs & 6–14 yrs',
    description: 'Hypoallergenic bio-washed cotton engineered for active durability, play wear, and print batches.'
  }
];

// 📦 COMPLETE MASTER PRODUCT DATABASE (ALL 16 EXACT PRODUCTS FROM BOTH CATALOGS)
export const APPAREL_GARMENTS: ApparelGarmentItem[] = [
  // =========================================================================
  // CATALOG 1: ZYMBO FASHION – Plain T-Shirts Catalog – Tirupur
  // =========================================================================
  {
    id: 'zym-m-rn-180',
    catalog: 'ZYMBO FASHION',
    demographicId: 'mens',
    demographicTitle: 'MEN',
    type: 'Round Neck',
    modelType: 'mens_round_neck',
    name: 'MENS ROUND NECK T-SHIRT',
    code: 'ZYM-M-RN',
    subtitle: '100% Super Combed Cotton • 180 GSM Single Jersey Knit • Bio wash',
    description: '100% Super Combed Cotton Regular Fit T-Shirt featuring modern cut, invisible stitching, and durable bio-wash finish.',
    fit: 'Regular Fit',
    fabric: '100% Super Combed Cotton Single Jersey Knit',
    cottonType: '100% Super Combed Cotton',
    gsm: '180 GSM',
    wash: 'Bio wash',
    price: 165,
    originalPrice: 330,
    pricingTiers: [
      { label: 'Price for shop', minQty: 1, price: 165 },
      { label: '100 T-shirts above', minQty: 100, price: 159 },
      { label: '200 T-shirts above', minQty: 200, price: 155 },
      { label: '500 T-shirts above', minQty: 500, price: 149 }
    ],
    moq: 'Not specified in catalog',
    packaging: '1 pcs One Size In Poly Bag',
    features: [
      '100% Super Combed Cotton',
      'Regular Fit',
      'Modern Cut and Invisible Stitching',
      '180 GSM Single Jersey Knit',
      'Bio wash'
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    sizeMeasurements: [
      { size: 'S', length: 26, chest: 38 },
      { size: 'M', length: 27, chest: 40 },
      { size: 'L', length: 28, chest: 42 },
      { size: 'XL', length: 29, chest: 44 },
      { size: 'XXL', length: 30, chest: 46 }
    ],
    colors: c([
      'Mustard', 'Black', 'White', 'Red', 'Navy', 'Merun',
      'Aq.Blue', 'P.Green', 'Royal.Blue', 'Grey', 'Lavender', 'Dusty Rose'
    ]),
    rating: 4.9,
    reviewCount: 142,
    sourcePage: 'ZYMBO catalog page 5'
  },
  {
    id: 'zym-w-rn-180',
    catalog: 'ZYMBO FASHION',
    demographicId: 'womens',
    demographicTitle: 'WOMEN',
    type: 'Round Neck',
    modelType: 'womens_round_neck',
    name: 'WOMENS ROUND NECK T-SHIRT',
    code: 'ZYM-W-RN',
    subtitle: '100% Super Combed Cotton • 180 GSM Single Jersey Knit • Bio wash',
    description: 'Tailored women’s round neck tee with regular feminine cut, invisible stitching, and ultra-soft bio wash.',
    fit: 'Regular Fit',
    fabric: '100% Super Combed Cotton Single Jersey Knit',
    cottonType: '100% Super Combed Cotton',
    gsm: '180 GSM',
    wash: 'Bio wash',
    price: 165,
    originalPrice: 330,
    pricingTiers: [
      { label: 'Price for shop', minQty: 1, price: 165 },
      { label: '100 T-shirts above', minQty: 100, price: 159 },
      { label: '200 T-shirts above', minQty: 200, price: 155 },
      { label: '500 T-shirts above', minQty: 500, price: 149 }
    ],
    moq: 'Not specified in catalog',
    packaging: 'Not specified in catalog',
    features: [
      '100% Super Combed Cotton',
      'Regular Fit',
      'Modern Cut and Invisible Stitching',
      '180 GSM Single Jersey Knit',
      'Bio wash'
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    sizeMeasurements: [
      { size: 'S', length: 25, chest: 34 },
      { size: 'M', length: 26, chest: 36 },
      { size: 'L', length: 27, chest: 38 },
      { size: 'XL', length: 28, chest: 40 },
      { size: 'XXL', length: 29, chest: 42 }
    ],
    colors: c([
      'Black', 'White', 'Red', 'Orange', 'Petrol Green',
      'Sky Blue', 'Royal Blue', 'Grey', 'Lavender', 'Dusty Rose'
    ]),
    rating: 4.8,
    reviewCount: 96,
    sourcePage: 'ZYMBO catalog page 6'
  },
  {
    id: 'zym-k-rn-180',
    catalog: 'ZYMBO FASHION',
    demographicId: 'kids',
    demographicTitle: 'KIDS & BOYS',
    type: 'Kids',
    modelType: 'kids_tee',
    name: 'KIDS ROUND NECK T-SHIRT',
    code: 'ZYM-K-RN',
    subtitle: 'Ages 1 to 6 Years • 100% Super Combed Cotton • 180 GSM • Bio wash',
    description: 'Play-proof kids t-shirt with soft bio-washed combed cotton, comfortable stretch, and reinforced stitching.',
    fit: 'Regular Fit',
    fabric: '100% Super Combed Cotton Single Jersey Knit',
    cottonType: '100% Super Combed Cotton',
    gsm: '180 GSM',
    wash: 'Bio wash',
    price: 125,
    originalPrice: 250,
    pricingTiers: [
      { label: 'Price for shop', minQty: 1, price: 125 },
      { label: '100 T-shirts above', minQty: 100, price: 119 },
      { label: '200 T-shirts above', minQty: 200, price: 115 },
      { label: '500 T-shirts above', minQty: 500, price: 109 }
    ],
    moq: 'Not specified in catalog',
    packaging: 'Not specified in catalog',
    features: [
      '100% Super Combed Cotton',
      'Regular Fit',
      'Modern Cut and Invisible Stitching',
      '180 GSM Single Jersey Knit',
      'Bio wash'
    ],
    sizes: ['1-2', '3-4', '5-6'],
    sizeMeasurements: [
      { size: '1-2', length: 15, chest: 23 },
      { size: '3-4', length: 17, chest: 25 },
      { size: '5-6', length: 18.5, chest: 27 }
    ],
    colors: c([
      'Mustard', 'Black', 'White', 'Red', 'Navy', 'Merun',
      'Aq.Blue', 'P.Green', 'Royal.Blue', 'Grey', 'Mehandhi Green',
      'Brown', 'Lem.Yellow', 'Wine', 'Dusty Rose', 'Lavender', 'Orange'
    ]),
    rating: 4.85,
    reviewCount: 78,
    sourcePage: 'ZYMBO catalog page 7'
  },
  {
    id: 'zym-b-rn-180',
    catalog: 'ZYMBO FASHION',
    demographicId: 'kids',
    demographicTitle: 'KIDS & BOYS',
    type: 'Kids',
    modelType: 'kids_tee',
    name: 'BOYS ROUND NECK T-SHIRT',
    code: 'ZYM-B-RN',
    subtitle: 'Ages 7 to 14 Years • 100% Super Combed Cotton • 180 GSM • Bio wash',
    description: 'Durable boys crewneck t-shirt in 17 color shades with 180 GSM pure combed cotton.',
    fit: 'Regular Fit',
    fabric: '100% Super Combed Cotton Single Jersey Knit',
    cottonType: '100% Super Combed Cotton',
    gsm: '180 GSM',
    wash: 'Bio wash',
    price: 135,
    originalPrice: 270,
    pricingTiers: [
      { label: 'Price for shop', minQty: 1, price: 135 },
      { label: '100 T-shirts above', minQty: 100, price: 129 },
      { label: '200 T-shirts above', minQty: 200, price: 125 },
      { label: '500 T-shirts above', minQty: 500, price: 119 }
    ],
    moq: 'Not specified in catalog',
    packaging: 'Not specified in catalog',
    features: [
      '100% Super Combed Cotton',
      'Regular Fit',
      'Modern Cut and Invisible Stitching',
      '180 GSM Single Jersey Knit',
      'Bio wash'
    ],
    sizes: ['7-8', '9-10', '11-12', '13-14'],
    sizeMeasurements: [
      { size: '7-8', length: 19.5, chest: 29 },
      { size: '9-10', length: 22, chest: 32 },
      { size: '11-12', length: 23, chest: 34 },
      { size: '13-14', length: 25, chest: 36 }
    ],
    colors: c([
      'Mustard', 'Black', 'White', 'Red', 'Navy', 'Merun',
      'Aq.Blue', 'P.Green', 'Royal.Blue', 'Grey', 'Mehandhi Green',
      'Brown', 'Lem.Yellow', 'Wine', 'Dusty Rose', 'Lavender', 'Orange'
    ]),
    rating: 4.9,
    reviewCount: 110,
    sourcePage: 'ZYMBO catalog page 8'
  },
  {
    id: 'zym-m-col-240',
    catalog: 'ZYMBO FASHION',
    demographicId: 'polo',
    demographicTitle: 'POLO',
    type: 'Collar',
    modelType: 'polo_shirt',
    name: 'COTTON COLLAR T-SHIRTS',
    code: 'ZYM-COT-COL',
    subtitle: '100% Super Combed Cotton • 240 GSM Air Tech Knit • Bio wash',
    description: 'Executive collar t-shirt with 240 GSM Air Tech knit structure, invisible stitching, and structured anti-curl collar.',
    fit: 'Regular Fit',
    fabric: '100% Super Combed Cotton Air Tech Knit',
    cottonType: '100% Super Combed Cotton',
    gsm: '240 GSM',
    wash: 'Bio wash',
    price: 269,
    originalPrice: 538,
    pricingTiers: [
      { label: 'Wholesale Price', minQty: 5, price: 269 }
    ],
    moq: '5 PCS',
    packaging: 'Not specified in catalog',
    features: [
      '100% Super Combed Cotton',
      'Regular Fit',
      'Modern Cut and Invisible Stitching',
      '240 GSM Air Tech Knit',
      'Bio wash'
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    sizeMeasurements: [
      { size: 'S', length: 26, chest: 38 },
      { size: 'M', length: 27, chest: 40 },
      { size: 'L', length: 28, chest: 42 },
      { size: 'XL', length: 29, chest: 44 },
      { size: 'XXL', length: 30, chest: 46 }
    ],
    colors: c(['Black', 'White', 'Red', 'Navy', 'Grey']),
    rating: 4.88,
    reviewCount: 84,
    sourcePage: 'ZYMBO catalog page 9'
  },
  {
    id: 'zym-ovr-240',
    catalog: 'ZYMBO FASHION',
    demographicId: 'oversized',
    demographicTitle: 'OVERSIZED',
    type: 'Oversized',
    modelType: 'oversized_tee',
    name: 'OVERSIZED T-SHIRTS',
    code: 'ZYM-OVR-240',
    subtitle: '100% Super Combed Cotton • 240 GSM French Terry Knit • Bio wash',
    description: 'Heavy drop-shoulder streetwear tee in 240 GSM French Terry with size-graded wholesale pricing.',
    fit: 'Oversized T-Shirt',
    fabric: '100% Super Combed Cotton French Terry Knit',
    cottonType: '100% Super Combed Cotton',
    gsm: '240 GSM',
    wash: 'Bio wash',
    price: 210, // From ₹210 (XS/S) to ₹250 (XXL)
    originalPrice: 480,
    sizePricing: [
      { size: 'XS', price: 210 },
      { size: 'S', price: 210 },
      { size: 'M', price: 230 },
      { size: 'L', price: 240 },
      { size: 'XL', price: 240 },
      { size: 'XXL', price: 250 }
    ],
    moq: '10 PCS',
    packaging: 'Not specified in catalog',
    features: [
      '100% Super Combed Cotton',
      'Oversized T-Shirt',
      'Modern Cut and Invisible Stitching',
      '240 GSM French Terry Knit',
      'Bio wash'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    sizeMeasurements: [
      { size: 'XS', length: 26, chest: 38, shoulder: 19, sleeve: 8 },
      { size: 'S', length: 27, chest: 40, shoulder: 20, sleeve: 8.5 },
      { size: 'M', length: 28, chest: 42, shoulder: 21, sleeve: 9 },
      { size: 'L', length: 29, chest: 44, shoulder: 22, sleeve: 9.5 },
      { size: 'XL', length: 30, chest: 46, shoulder: 23, sleeve: 10 },
      { size: 'XXL', length: 31, chest: 48, shoulder: 24, sleeve: 10.5 }
    ],
    colors: c(['Black', 'White']),
    rating: 4.95,
    reviewCount: 220,
    sourcePage: 'ZYMBO catalog page 10'
  },
  {
    id: 'zym-mars-col-220',
    catalog: 'ZYMBO FASHION',
    demographicId: 'polo',
    demographicTitle: 'POLO',
    type: 'Collar',
    modelType: 'polo_shirt',
    name: 'MARS COLLAR T-SHIRT',
    code: 'ZYM-MARS-COL',
    subtitle: '220 GSM Mars Polestar Fabric • Modern Cut • Invisible Stitching',
    description: 'High-durability Mars Polestar fabric collar t-shirt engineered for corporate, industrial, and team uniforms.',
    fit: 'Regular Fit',
    fabric: '220 GSM Mars Polestar Fabric',
    cottonType: 'Mars Polestar Fabric',
    gsm: '220 GSM',
    wash: 'Not specified in catalog',
    price: 200, // From ₹200 (S) to ₹240 (XXL)
    originalPrice: 400,
    sizePricing: [
      { size: 'S', price: 200 },
      { size: 'M', price: 210 },
      { size: 'L', price: 220 },
      { size: 'XL', price: 230 },
      { size: 'XXL', price: 240 }
    ],
    moq: '10 PCS',
    packaging: 'Not specified in catalog',
    features: [
      'Regular Fit',
      'Modern Cut and Invisible Stitching',
      '220 GSM Mars Polestar Fabric'
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
    sizeMeasurements: [
      { size: 'S', length: 25, chest: 36 },
      { size: 'M', length: 26, chest: 38 },
      { size: 'L', length: 27, chest: 40 },
      { size: 'XL', length: 28, chest: 42 },
      { size: 'XXL', length: 29, chest: 44 },
      { size: 'XXXL', length: 30, chest: 46 }
    ],
    colors: c(['Black', 'White', 'Red', 'Navy', 'Grey']),
    rating: 4.75,
    reviewCount: 65,
    sourcePage: 'ZYMBO catalog page 11'
  },

  // =========================================================================
  // CATALOG 2: PLAIN T-SHIRTS TIRUPUR – Product Catalog
  // =========================================================================
  {
    id: 'ptt-uni-rn',
    catalog: 'PLAIN T-SHIRTS TIRUPUR',
    demographicId: 'mens',
    demographicTitle: 'MEN',
    type: 'Round Neck',
    modelType: 'mens_round_neck',
    name: 'Unisex Round Neck T-Shirt',
    code: 'PTT-RN-MULTI',
    subtitle: '100% Combed Cotton • Bio-Silicon Washed • Pre-Shrunk • Print Ready',
    description: 'Premier wholesale blank round neck tee available in 180 GSM, 220 GSM, and 240 GSM French Terry with 14 color options.',
    fit: 'Regular Fit',
    fabric: '100% Combed Cotton / Terry',
    cottonType: '100% Combed Cotton',
    gsm: '180 GSM / 220 GSM / 240 GSM',
    wash: 'Bio-Silicon Washed',
    price: 175,
    originalPrice: 350,
    samplePrice: 249,
    gsmVariants: [
      { id: 'ptt-rn-180', gsm: '180 GSM', fabric: '100% Combed Cotton', price: 175, samplePrice: 249, tag: 'Standard Light' },
      { id: 'ptt-rn-220', gsm: '220 GSM', fabric: '100% Combed Cotton', price: 215, samplePrice: 299, tag: 'Heavy Combed' },
      { id: 'ptt-rn-240', gsm: '240 GSM', fabric: 'French Terry Cotton', price: 250, samplePrice: 349, tag: 'Terry Heavy' }
    ],
    plusSizePricing: 'Cotton: 3XL +₹30, 4XL +₹60 | Terry: 3XL +₹40, 4XL +₹80',
    moq: '10 Pieces Per Colour',
    packaging: 'Not specified in catalog',
    features: [
      '100% Combed Cotton',
      'Bio-Silicon Washed',
      'Pre-Shrunk',
      'Print Ready',
      'Regular Fit'
    ],
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL'],
    colors: c([
      'Black', 'White', 'Navy', 'Beige', 'Red', 'Maroon',
      'Dusky Pink', 'Coffee Brown', 'Royal Blue', 'Lavender',
      'Green', 'Yellow', 'Olive Green', 'Cool Blue', 'Bottle Green', 'Purple'
    ]),
    rating: 4.92,
    reviewCount: 340,
    sourcePage: 'second catalog pages 3-4'
  },
  {
    id: 'ptt-uni-ovr',
    catalog: 'PLAIN T-SHIRTS TIRUPUR',
    demographicId: 'oversized',
    demographicTitle: 'OVERSIZED',
    type: 'Oversized',
    modelType: 'oversized_tee',
    name: 'Unisex Oversized T-Shirt',
    code: 'PTT-OVR-MULTI',
    subtitle: '100% Combed Cotton / Terry • 180 / 220 / 240 GSM • Bio-Silicon Washed',
    description: 'Streetwear drop-shoulder oversized blank t-shirt in 3 fabric weights and 12 rich colorways.',
    fit: 'Regular Fit',
    fabric: '100% Combed Cotton / Terry',
    cottonType: '100% Combed Cotton',
    gsm: '180 GSM / 220 GSM / 240 GSM',
    wash: 'Bio-Silicon Washed',
    price: 215,
    originalPrice: 430,
    samplePrice: 299,
    gsmVariants: [
      { id: 'ptt-ovr-180', gsm: '180 GSM', fabric: '100% Combed Cotton', price: 215, samplePrice: 299, tag: 'Everyday Street' },
      { id: 'ptt-ovr-220', gsm: '220 GSM', fabric: '100% Combed Cotton', price: 255, samplePrice: 349, tag: 'Heavy Drop-Shoulder' },
      { id: 'ptt-ovr-240', gsm: '240 GSM', fabric: 'French Terry Cotton', price: 275, samplePrice: 399, tag: 'Premium Terry' }
    ],
    moq: '10 Pieces Per Colour',
    packaging: 'Not specified in catalog',
    features: [
      '100% Combed Cotton',
      'Bio-Silicon Washed',
      'Pre-Shrunk',
      'Print Ready',
      'Regular Fit'
    ],
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    colors: c([
      'Black', 'White', 'Beige', 'Coffee Brown', 'Bottle Green',
      'Lavender', 'Cool Blue', 'Cream', 'Navy', 'Red', 'Maroon', 'Royal Blue'
    ]),
    rating: 4.96,
    reviewCount: 295,
    sourcePage: 'second catalog pages 5-6'
  },
  {
    id: 'ptt-acid-ovr-260',
    catalog: 'PLAIN T-SHIRTS TIRUPUR',
    demographicId: 'oversized',
    demographicTitle: 'OVERSIZED',
    type: 'Oversized',
    modelType: 'acid_wash_tee',
    name: 'Acid Wash Oversized T-Shirt',
    code: 'PTT-ACID-260',
    subtitle: '100% Combed Cotton • 260 GSM Heavyweight • Acid-Washed',
    description: 'Vintage mineral acid-washed oversized t-shirt in 260 GSM heavyweight combed cotton with authentic washed texture.',
    fit: 'Unisex Fit',
    fabric: '100% Combed Cotton',
    cottonType: '100% Combed Cotton',
    gsm: '260 GSM',
    wash: 'Acid-Washed',
    price: 310,
    originalPrice: 620,
    samplePrice: 499,
    moq: '10 Pieces Per Colour',
    packaging: 'Not specified in catalog',
    features: [
      '100% Combed Cotton',
      'Acid-Washed',
      'Pre-Shrunk',
      'Print Ready',
      'Unisex Fit'
    ],
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    colors: c(['Black', 'Navy', 'Maroon', 'Olive Green', 'Red', 'Bottle Green']),
    rating: 4.9,
    reviewCount: 180,
    sourcePage: 'second catalog page 7'
  },
  {
    id: 'ptt-uni-hd-300',
    catalog: 'PLAIN T-SHIRTS TIRUPUR',
    demographicId: 'winter_wear',
    demographicTitle: 'WINTER WEAR',
    type: 'Hoodie',
    modelType: 'hoodie',
    name: 'Unisex Hoodie',
    code: 'PTT-HD-300',
    subtitle: '100% Combed Cotton • 300 GSM Heavy Fleece • Pre-Shrunk',
    description: '300 GSM thermal fleece pullover hoodie with double-layer hood, kangaroo pocket, and unisex streetwear fit.',
    fit: 'Unisex Fit',
    fabric: '100% Combed Cotton',
    cottonType: '100% Combed Cotton',
    gsm: '300 GSM',
    wash: 'Acid-Washed',
    price: 480,
    originalPrice: 960,
    samplePrice: 549,
    plusSizePricing: '3XL: Price + ₹30 (₹510)',
    moq: '10 Pieces Per Colour',
    packaging: 'Not specified in catalog',
    features: [
      '100% Combed Cotton',
      'Acid-Washed',
      'Pre-Shrunk',
      'Print Ready',
      'Unisex Fit'
    ],
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL'],
    colors: c(['Black', 'White', 'Navy', 'Lavender', 'Maroon']),
    rating: 4.94,
    reviewCount: 215,
    sourcePage: 'second catalog page 8'
  },
  {
    id: 'ptt-uni-swt-300',
    catalog: 'PLAIN T-SHIRTS TIRUPUR',
    demographicId: 'winter_wear',
    demographicTitle: 'WINTER WEAR',
    type: 'Sweatshirt',
    modelType: 'sweatshirt',
    name: 'Unisex Sweatshirt',
    code: 'PTT-SWT-300',
    subtitle: '100% Combed Cotton • 300 GSM • Bio-Silicon Washed • Regular Fit',
    description: '300 GSM crewneck fleece sweatshirt with Lycra ribbing, pre-shrunk bio-silicon wash, and soft brushed interior.',
    fit: 'Regular Fit',
    fabric: '100% Combed Cotton',
    cottonType: '100% Combed Cotton',
    gsm: '300 GSM',
    wash: 'Bio-Silicon Washed',
    price: 380,
    originalPrice: 760,
    samplePrice: 549,
    moq: '10 Pieces Per Colour',
    packaging: 'Not specified in catalog',
    features: [
      '100% Combed Cotton',
      'Bio-Silicon Washed',
      'Pre-Shrunk',
      'Print Ready',
      'Regular Fit'
    ],
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL'],
    colors: c(['Black', 'White', 'Navy', 'Lavender', 'Maroon']),
    rating: 4.86,
    reviewCount: 130,
    sourcePage: 'second catalog page 9'
  },
  {
    id: 'ptt-cot-polo-240',
    catalog: 'PLAIN T-SHIRTS TIRUPUR',
    demographicId: 'polo',
    demographicTitle: 'POLO',
    type: 'Polo',
    modelType: 'polo_shirt',
    name: 'Cotton Polo T-Shirt',
    code: 'PTT-COT-POLO',
    subtitle: '100% Combed Cotton • 240 GSM • Bio-Silicon Washed • Regular Fit',
    description: '100% Combed Cotton 240 GSM Polo T-Shirt featuring 3-button placket, knitted jacquard collar, and 10 color shades.',
    fit: 'Regular Fit',
    fabric: '100% Combed Cotton',
    cottonType: '100% Combed Cotton',
    gsm: '240 GSM',
    wash: 'Bio-Silicon Washed',
    price: 305,
    originalPrice: 610,
    samplePrice: 399,
    moq: '10 Pieces Per Colour',
    packaging: 'Not specified in catalog',
    features: [
      '100% Combed Cotton',
      'Bio-Silicon Washed',
      'Pre-Shrunk',
      'Print Ready',
      'Regular Fit'
    ],
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL'],
    colors: c([
      'Black', 'White', 'Coffee Brown', 'Maroon', 'Petrol Blue',
      'Navy Blue', 'Royal Blue', 'Bottle Green', 'Cool Blue', 'Red'
    ]),
    rating: 4.88,
    reviewCount: 175,
    sourcePage: 'second catalog page 10'
  },
  {
    id: 'ptt-mars-polo-200',
    catalog: 'PLAIN T-SHIRTS TIRUPUR',
    demographicId: 'polo',
    demographicTitle: 'POLO',
    type: 'Polo',
    modelType: 'polo_shirt',
    name: 'Mars Polo T-Shirt',
    code: 'PTT-MARS-POLO',
    subtitle: '100% Combed Cotton • 200 GSM • Bio-Silicon Washed • Regular Fit',
    description: 'Lightweight 200 GSM Mars Polo T-Shirt designed for corporate events, sports batches, and uniform orders.',
    fit: 'Regular Fit',
    fabric: '100% Combed Cotton',
    cottonType: '100% Combed Cotton',
    gsm: '200 GSM',
    wash: 'Bio-Silicon Washed',
    price: 215,
    originalPrice: 430,
    samplePrice: 349,
    moq: '10 Pieces Per Colour',
    packaging: 'Not specified in catalog',
    features: [
      '100% Combed Cotton',
      'Bio-Silicon Washed',
      'Pre-Shrunk',
      'Print Ready',
      'Regular Fit'
    ],
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL'],
    colors: c(['Black', 'White', 'Navy Blue']),
    rating: 4.79,
    reviewCount: 88,
    sourcePage: 'second catalog page 11'
  },
  {
    id: 'ptt-w-crop',
    catalog: 'PLAIN T-SHIRTS TIRUPUR',
    demographicId: 'womens',
    demographicTitle: 'WOMEN',
    type: 'Crop Top',
    modelType: 'crop_top',
    name: 'Crop Top',
    code: 'PTT-CROP-TOP',
    subtitle: '100% Combed Cotton / Terry • 180 / 220 / 240 GSM • Bio-Silicon Washed',
    description: 'Women’s cropped silhouette available in 180 GSM lightweight, 220 GSM combed cotton, and 240 GSM French Terry.',
    fit: 'Regular Fit',
    fabric: '100% Combed Cotton / Terry',
    cottonType: '100% Combed Cotton',
    gsm: '180 GSM / 220 GSM / 240 GSM',
    wash: 'Bio-Silicon Washed',
    price: 145,
    originalPrice: 290,
    samplePrice: 249,
    gsmVariants: [
      { id: 'ptt-crop-180', gsm: '180 GSM', fabric: '100% Combed Cotton', price: 145, samplePrice: 249, tag: 'Lightweight Crop' },
      { id: 'ptt-crop-220', gsm: '220 GSM', fabric: '100% Combed Cotton', price: 180, samplePrice: 299, tag: 'Medium Cotton Crop' },
      { id: 'ptt-crop-240', gsm: '240 GSM', fabric: 'French Terry Cotton', price: 205, samplePrice: 349, tag: 'Terry Street Crop' }
    ],
    moq: '10 Pieces Per Colour',
    packaging: 'Not specified in catalog',
    features: [
      '100% Combed Cotton',
      'Bio-Silicon Washed',
      'Pre-Shrunk',
      'Print Ready',
      'Regular Fit'
    ],
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    colors: c(['Black', 'White', 'Navy', 'Lavender', 'Light Pink']),
    rating: 4.87,
    reviewCount: 145,
    sourcePage: 'second catalog page 12'
  },
  {
    id: 'ptt-k-rn',
    catalog: 'PLAIN T-SHIRTS TIRUPUR',
    demographicId: 'kids',
    demographicTitle: 'KIDS & BOYS',
    type: 'Kids',
    modelType: 'kids_tee',
    name: 'Kids Round Neck T-Shirt',
    code: 'PTT-KIDS-RN',
    subtitle: 'Ages 0–5 & 6–14 Years • 180 / 220 / 240 GSM • Bio-Silicon Washed',
    description: 'Kids combed cotton round neck tees with age-bracket and GSM-tiered wholesale pricing.',
    fit: 'Regular Fit',
    fabric: '100% Combed Cotton / Terry',
    cottonType: '100% Combed Cotton',
    gsm: '180 GSM / 220 GSM / 240 GSM',
    wash: 'Bio-Silicon Washed',
    price: 135,
    originalPrice: 270,
    gsmVariants: [
      { id: 'ptt-k-05-180', gsm: '0–5 yrs 180 GSM', fabric: '100% Combed Cotton', price: 135, tag: 'Toddler Light' },
      { id: 'ptt-k-05-220', gsm: '0–5 yrs 220 GSM', fabric: '100% Combed Cotton', price: 175, tag: 'Toddler Heavy' },
      { id: 'ptt-k-05-240', gsm: '0–5 yrs 240 GSM', fabric: 'French Terry Cotton', price: 205, tag: 'Toddler Terry' },
      { id: 'ptt-k-614-180', gsm: '6–14 yrs 180 GSM', fabric: '100% Combed Cotton', price: 165, tag: 'Junior Light' },
      { id: 'ptt-k-614-220', gsm: '6–14 yrs 220 GSM', fabric: '100% Combed Cotton', price: 205, tag: 'Junior Heavy' },
      { id: 'ptt-k-614-240', gsm: '6–14 yrs 240 GSM', fabric: 'French Terry Cotton', price: 235, tag: 'Junior Terry' }
    ],
    moq: '10 Pieces Per Colour',
    packaging: 'Not specified in catalog',
    features: [
      '100% Combed Cotton',
      'Bio-Silicon Washed',
      'Pre-Shrunk',
      'Print Ready',
      'Regular Fit'
    ],
    sizes: ['0-5 years', '6-14 years'],
    colors: c(['Black', 'White']),
    rating: 4.85,
    reviewCount: 92,
    sourcePage: 'second catalog page 13'
  }
];

// 🖨️ PRINTING CHARGES TARIFF MATRIX (SECOND CATALOG)
export const PRINTING_CHARGES_TARIFFS = [
  { placement: 'A3 Size Print', qty10to30: 90, qtyAbove30: 80, dimensions: 'Up to 11.7 x 16.5 in' },
  { placement: 'A4 Size Print', qty10to30: 75, qtyAbove30: 70, dimensions: 'Up to 8.3 x 11.7 in' },
  { placement: 'Center Chest Print', qty10to30: 45, qtyAbove30: 40, dimensions: 'Standard 4 x 4 in' },
  { placement: 'Left Pocket Print', qty10to30: 30, qtyAbove30: 25, dimensions: 'Small 3.5 x 3.5 in' },
  { placement: 'Custom Neck Label', qty10to30: 5, qtyAbove30: 5, dimensions: 'Inside Brand Transfer' }
];

// 🎯 PRINTING TECHNIQUES LIST
export const APPAREL_PRINT_GUIDE = [
  {
    title: 'DTF (Direct-to-Film) High-Def Print',
    badge: '1200 DPI High-Def',
    tag: 'Full-Color Gradients, Photos & Fine Art',
    desc: 'Ultra-vibrant, stretchable, non-cracking print with razor sharp edges on 100% cotton, poly blends, and french terry fabrics.'
  },
  {
    title: '3D High-Density Puff Screen Print',
    badge: 'Tactile Relief 3D',
    tag: 'Elevated Raised Ink for Streetwear',
    desc: 'Textured rubberized micro-foam formulation that puffs up during heat curing to create stunning tactile 3D relief typography.'
  },
  {
    title: 'Precision Micro-Stitch HD Embroidery',
    badge: 'Tajima Multi-Head',
    tag: 'Executive Crests, Polos & Pocket Logos',
    desc: 'High tensile German Madeira polyester threads delivering premium luster and indestructible durability across 100+ wash cycles.'
  },
  {
    title: 'Custom Brand Labels & Hang Tags',
    badge: 'Full Private Label',
    tag: 'Inside Neck Transfer & Woven Tags',
    desc: 'Complete turnkey private labeling including heat transfer neck labels, branded hang tags, and custom polybag barcodes.'
  }
];

// 🎨 SAMPLE GRAPHICS LIBRARY FOR 3D STUDIO
export const SAMPLE_GRAPHICS_LIBRARY = [
  { id: 'sg-0', name: 'Brand Leaf Logo', url: '/leaf-logo.png' },
  { id: 'sg-1', name: 'Neo Cyber Tiger', url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=60&w=400' },
  { id: 'sg-2', name: 'Atelier Gold Crest', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=60&w=400' },
  { id: 'sg-3', name: 'California Surf Club', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=60&w=400' },
  { id: 'sg-4', name: 'Bauhaus Modernism', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=60&w=400' },
  { id: 'sg-5', name: 'Dark Tokyo Cyberpunk', url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=60&w=400' },
  { id: 'sg-6', name: 'Retro Sunset Horizon', url: 'https://images.unsplash.com/photo-1509728148871-303c28062828?auto=format&fit=crop&q=60&w=400' }
];

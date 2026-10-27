export type MerchCategory = 'All' | 'SPORTS' | 'BAGS' | 'CAPS' | 'FLAGS' | 'SHIRTS';

export type DecorationMethod = 'SUBLIMATION' | 'DTF' | 'DTG';

export interface MerchColorVariant {
  name: string;
  hex: string;
  image: string;
  backImage?: string;
  sideImage?: string;
}

export interface MerchWholesaleTier {
  minQty: number;
  maxQty: number | null;
  discountPercent: number;
  unitPrice: number;
}

export interface CustomMerchItem {
  id: string;
  sku: string;
  name: string;
  category: MerchCategory;
  subCategory?: 'MENS' | 'WOMENS' | 'BOYS' | 'GIRLS' | 'TOTE BAG' | 'GENERAL';
  tagline: string;
  description: string;
  basePrice: number;
  samplePrice: number;
  colors: MerchColorVariant[];
  supportedDecorations: DecorationMethod[];
  defaultDecoration: DecorationMethod;
  materialSpecs: string;
  dimensions?: string;
  capacity?: string;
  moq: number;
  productionTimeDays: string;
  badge?: string;
  featured?: boolean;
  printAreaSpecs: {
    widthMm: number;
    heightMm: number;
    description: string;
    aspectRatio: string;
  };
  wholesaleTiers: MerchWholesaleTier[];
}

export const CUSTOM_MERCH_CATEGORIES: { id: MerchCategory; label: string; printMethods: string; iconName: string; count: number; description: string }[] = [
  {
    id: 'All',
    label: 'All Other Products',
    printMethods: 'DTF · DTG · SUBLIMATION',
    iconName: 'LayoutGrid',
    count: 10,
    description: 'Explore Sports Kits, Tote Bags, Caps, Flags & Shirts with 3D White Mockups and full custom print support.',
  },
  {
    id: 'SPORTS',
    label: 'Sports (Sublimation)',
    printMethods: 'SUBLIMATION',
    iconName: 'Zap',
    count: 4,
    description: 'All-over dye sublimation jersey kits for Mens, Womens, Boys & Girls with C-design wrapping.',
  },
  {
    id: 'BAGS',
    label: 'Bags (DTF · DTG · Sublimation)',
    printMethods: 'DTF · DTG · SUBLIMATION',
    iconName: 'ShoppingBag',
    count: 2,
    description: 'Heavyweight organic cotton canvas and spun polyester tote bags.',
  },
  {
    id: 'CAPS',
    label: 'Caps (DTF · Sublimation)',
    printMethods: 'DTF · SUBLIMATION',
    iconName: 'Crown',
    count: 2,
    description: 'Structured 6-panel athletic caps and retro foam trucker hats.',
  },
  {
    id: 'FLAGS',
    label: 'Flags (DTF · DTG · Sublimation)',
    printMethods: 'DTF · DTG · SUBLIMATION',
    iconName: 'Flag',
    count: 2,
    description: 'Commercial promotional event banner flags and outdoor feather teardrop flags.',
  },
  {
    id: 'SHIRTS',
    label: 'Shirts (DTF · DTG · Sublimation)',
    printMethods: 'DTF · DTG · SUBLIMATION',
    iconName: 'Shirt',
    count: 2,
    description: 'Casual resort camp-collar shirts and corporate executive button-downs.',
  },
];

export const CUSTOM_MERCH_PRODUCTS: CustomMerchItem[] = [
  // ===================== 1. SPORTS : (SUBLIMATION) =====================
  {
    id: 'sports-sub-mens-01',
    sku: 'SP-SUB-MEN-01',
    name: "Men's Performance Sublimation Jersey Kit",
    category: 'SPORTS',
    subCategory: 'MENS',
    tagline: 'All-Over Sublimation · Micro-Interlock Breathable Fabric',
    description: 'Engineered for high-intensity athletic performance. Full 360-degree all-over dye sublimation with non-fading vivid colors, moisture-wicking technology, and anti-static treatment.',
    basePrice: 349,
    samplePrice: 420,
    materialSpecs: '100% Micro-Poly Interlock · 160 GSM · Quick Dry Active',
    moq: 1,
    productionTimeDays: '2–4 Days',
    badge: 'Sublimation',
    featured: true,
    supportedDecorations: ['SUBLIMATION'],
    defaultDecoration: 'SUBLIMATION',
    printAreaSpecs: {
      widthMm: 450,
      heightMm: 650,
      description: 'Full 360° All-Over Front, Back & Sleeve Print',
      aspectRatio: '3/4',
    },
    colors: [
      {
        name: 'Royal Blue / Speed Streak',
        hex: '#1D4ED8',
        image: '/mockups/jersey_kit_mens.jpg',
        backImage: '/mockups/jersey_studio_back.jpg',
      },
      {
        name: 'Electric Blue & Navy',
        hex: '#1E40AF',
        image: '/mockups/jersey_hero_blue.jpg',
        backImage: '/mockups/jersey_hero_back.jpg',
      },
      {
        name: 'Black & Gold Lightning',
        hex: '#EAB308',
        image: '/mockups/jersey_hero_pair.jpg',
        backImage: '/mockups/jersey_hero_pair.jpg',
      },
    ],
    wholesaleTiers: [
      { minQty: 1, maxQty: 5, discountPercent: 0, unitPrice: 349 },
      { minQty: 6, maxQty: 24, discountPercent: 15, unitPrice: 296 },
      { minQty: 25, maxQty: 99, discountPercent: 25, unitPrice: 261 },
      { minQty: 100, maxQty: null, discountPercent: 35, unitPrice: 226 },
    ],
  },
  {
    id: 'sports-sub-womens-02',
    sku: 'SP-SUB-WOM-02',
    name: "Women's Athletic Sublimation Jersey",
    category: 'SPORTS',
    subCategory: 'WOMENS',
    tagline: 'Tailored Athletic Fit · Breathable Honeycomb Mesh',
    description: 'Ergonomic contoured silhouette tailored for women in sport. High-definition full sublimation printing with zero cracking or peeling over 100+ wash cycles.',
    basePrice: 349,
    samplePrice: 420,
    materialSpecs: 'Poly-Spandex Stretch Mesh · 170 GSM · Sweat Resistant',
    moq: 1,
    productionTimeDays: '2–4 Days',
    badge: 'Sublimation',
    featured: true,
    supportedDecorations: ['SUBLIMATION'],
    defaultDecoration: 'SUBLIMATION',
    printAreaSpecs: {
      widthMm: 420,
      heightMm: 600,
      description: 'Full All-Over Sublimation Wrap',
      aspectRatio: '3/4',
    },
    colors: [
      {
        name: 'Magenta Rose / Lilac Geometric',
        hex: '#DB2777',
        image: '/mockups/jersey_kit_womens.jpg',
        backImage: '/mockups/jersey_studio_back.jpg',
      },
      {
        name: 'Electric Indigo',
        hex: '#6366F1',
        image: '/mockups/jersey_kit_womens.jpg',
      },
    ],
    wholesaleTiers: [
      { minQty: 1, maxQty: 5, discountPercent: 0, unitPrice: 349 },
      { minQty: 6, maxQty: 24, discountPercent: 15, unitPrice: 296 },
      { minQty: 25, maxQty: 99, discountPercent: 25, unitPrice: 261 },
      { minQty: 100, maxQty: null, discountPercent: 35, unitPrice: 226 },
    ],
  },
  {
    id: 'sports-sub-boys-03',
    sku: 'SP-SUB-BOY-03',
    name: "Boys Active Sublimation Sports Jersey",
    category: 'SPORTS',
    subCategory: 'BOYS',
    tagline: 'Junior Pro Cut · Tear Resistant Sublimated Poly',
    description: 'Durable sports jersey designed for junior athletes, school tournaments, and sports academies. Vibrant team names, player numbers, and sponsor logos.',
    basePrice: 249,
    samplePrice: 320,
    materialSpecs: '100% Breathable Dry-Fit Micro-Poly · 150 GSM',
    moq: 1,
    productionTimeDays: '2–4 Days',
    badge: 'Junior Sublimation',
    supportedDecorations: ['SUBLIMATION'],
    defaultDecoration: 'SUBLIMATION',
    printAreaSpecs: {
      widthMm: 350,
      heightMm: 500,
      description: 'Full Front & Back Name/Number Sublimation',
      aspectRatio: '3/4',
    },
    colors: [
      {
        name: 'Navy Blue & Cyan Lightning',
        hex: '#06B6D4',
        image: '/mockups/jersey_kit_boys.jpg',
        backImage: '/mockups/jersey_studio_back.jpg',
      },
      {
        name: 'Royal Blue / Yellow',
        hex: '#2563EB',
        image: '/mockups/jersey_kit_boys.jpg',
      },
    ],
    wholesaleTiers: [
      { minQty: 1, maxQty: 5, discountPercent: 0, unitPrice: 249 },
      { minQty: 6, maxQty: 24, discountPercent: 15, unitPrice: 211 },
      { minQty: 25, maxQty: 99, discountPercent: 25, unitPrice: 186 },
      { minQty: 100, maxQty: null, discountPercent: 35, unitPrice: 161 },
    ],
  },
  {
    id: 'sports-sub-girls-04',
    sku: 'SP-SUB-GIRL-04',
    name: "Girls Active Sublimation Sports Jersey",
    category: 'SPORTS',
    subCategory: 'GIRLS',
    tagline: 'Lightweight Breathable · Vibrant Sublimation Graphics',
    description: 'Comfortable stretch-fit tournament wear for girls basketball, volleyball, athletics, and school teams. Includes custom roster name and number personalization.',
    basePrice: 249,
    samplePrice: 320,
    materialSpecs: '100% Poly Dry-Knit · 150 GSM · Anti-Odor Finish',
    moq: 1,
    productionTimeDays: '2–4 Days',
    badge: 'Junior Sublimation',
    supportedDecorations: ['SUBLIMATION'],
    defaultDecoration: 'SUBLIMATION',
    printAreaSpecs: {
      widthMm: 340,
      heightMm: 480,
      description: 'Full Sublimation Roster Print',
      aspectRatio: '3/4',
    },
    colors: [
      {
        name: 'Lilac Lavender & Soft Pastel',
        hex: '#A855F7',
        image: '/mockups/jersey_kit_girls.jpg',
        backImage: '/mockups/jersey_studio_back.jpg',
      },
      {
        name: 'Coral Pink & White',
        hex: '#FB7185',
        image: '/mockups/jersey_kit_girls.jpg',
      },
    ],
    wholesaleTiers: [
      { minQty: 1, maxQty: 5, discountPercent: 0, unitPrice: 249 },
      { minQty: 6, maxQty: 24, discountPercent: 15, unitPrice: 211 },
      { minQty: 25, maxQty: 99, discountPercent: 25, unitPrice: 186 },
      { minQty: 100, maxQty: null, discountPercent: 35, unitPrice: 161 },
    ],
  },

  // ===================== 2. BAGS : (DTF - DTG - SUBLIMATION) =====================
  {
    id: 'bag-tote-canvas-01',
    sku: 'BG-TOTE-CV01',
    name: 'Heavy Cotton Canvas Tote Bag',
    category: 'BAGS',
    subCategory: 'TOTE BAG',
    tagline: 'Reinforced Cross-Stitch Handles · High-Density Direct Print',
    description: 'Eco-friendly heavyweight natural cotton canvas tote bag. Premium flat surface ideal for ultra-sharp DTF, direct-to-garment (DTG), or vibrant Sublimation graphics.',
    basePrice: 180,
    samplePrice: 240,
    materialSpecs: '320 GSM 100% Heavyweight Cotton Duck Canvas',
    dimensions: '15" W x 16" H with 4" Bottom Gusset · 24" Handles',
    moq: 1,
    productionTimeDays: '2–3 Days',
    badge: 'Bestseller',
    featured: true,
    supportedDecorations: ['DTF', 'DTG', 'SUBLIMATION'],
    defaultDecoration: 'DTF',
    printAreaSpecs: {
      widthMm: 280,
      heightMm: 320,
      description: 'Front & Back Center Print (Up to 11" x 13")',
      aspectRatio: '1/1',
    },
    colors: [
      {
        name: 'Natural Ecru / Pure White',
        hex: '#FFFFFF',
        image: '/mockups/white_tote_bag.jpg',
      },
      {
        name: 'Jet Black',
        hex: '#111827',
        image: '/mockups/white_tote_bag.jpg',
      },
      {
        name: 'Olive Green',
        hex: '#3F4E3D',
        image: '/mockups/white_tote_bag.jpg',
      },
    ],
    wholesaleTiers: [
      { minQty: 1, maxQty: 5, discountPercent: 0, unitPrice: 180 },
      { minQty: 6, maxQty: 24, discountPercent: 15, unitPrice: 153 },
      { minQty: 25, maxQty: 99, discountPercent: 25, unitPrice: 135 },
      { minQty: 100, maxQty: null, discountPercent: 35, unitPrice: 117 },
    ],
  },
  {
    id: 'bag-tote-poly-sub-02',
    sku: 'BG-TOTE-PS02',
    name: 'All-Over Print Sublimation Tote Bag',
    category: 'BAGS',
    subCategory: 'TOTE BAG',
    tagline: 'Edge-to-Edge Full Color Graphic · Durable Spun Poly',
    description: 'Durable spun polyester tote featuring seamless edge-to-edge full bleed sublimation printing. Water-resistant internal coating with heavy black cotton webbed straps.',
    basePrice: 195,
    samplePrice: 260,
    materialSpecs: '300 GSM Spun Polyester Canvas · Water-Resistant',
    dimensions: '16" W x 16" H · 26" Reinforced Strap',
    moq: 1,
    productionTimeDays: '2–3 Days',
    badge: 'Full Bleed',
    supportedDecorations: ['SUBLIMATION', 'DTF', 'DTG'],
    defaultDecoration: 'SUBLIMATION',
    printAreaSpecs: {
      widthMm: 400,
      heightMm: 400,
      description: 'Edge-to-Edge Seamless Front & Back',
      aspectRatio: '1/1',
    },
    colors: [
      {
        name: 'Sublimation Base White',
        hex: '#FFFFFF',
        image: '/mockups/white_tote_bag.jpg',
      },
    ],
    wholesaleTiers: [
      { minQty: 1, maxQty: 5, discountPercent: 0, unitPrice: 195 },
      { minQty: 6, maxQty: 24, discountPercent: 15, unitPrice: 165 },
      { minQty: 25, maxQty: 99, discountPercent: 25, unitPrice: 146 },
      { minQty: 100, maxQty: null, discountPercent: 35, unitPrice: 126 },
    ],
  },

  // ===================== 3. CAPS : (DTF - SUBLIMATION) =====================
  {
    id: 'cap-classic-dtf-01',
    sku: 'CP-DTF-01',
    name: 'Classic 6-Panel Structured Athletic Cap',
    category: 'CAPS',
    tagline: 'Pre-Curved Visor · Premium DTF & Sublimation Badge',
    description: 'High-density twill cap engineered with fused buckram front panels for ultra-sharp DTF transfer prints and vibrant sublimation patches. Adjustable velcro strap closure.',
    basePrice: 199,
    samplePrice: 280,
    materialSpecs: 'Poly-Cotton Heavy Twill · 260 GSM · Stitched Eyelets',
    moq: 1,
    productionTimeDays: '2–3 Days',
    badge: 'Popular',
    featured: true,
    supportedDecorations: ['DTF', 'SUBLIMATION'],
    defaultDecoration: 'DTF',
    printAreaSpecs: {
      widthMm: 100,
      heightMm: 55,
      description: 'Front Crown Center (4" x 2.2")',
      aspectRatio: '2/1',
    },
    colors: [
      {
        name: 'Crisp White',
        hex: '#FFFFFF',
        image: '/mockups/white_athletic_cap.jpg',
      },
      {
        name: 'Pitch Black',
        hex: '#111827',
        image: '/mockups/white_athletic_cap.jpg',
      },
      {
        name: 'Royal Navy',
        hex: '#1E3A8A',
        image: '/mockups/white_athletic_cap.jpg',
      },
    ],
    wholesaleTiers: [
      { minQty: 1, maxQty: 5, discountPercent: 0, unitPrice: 199 },
      { minQty: 6, maxQty: 24, discountPercent: 15, unitPrice: 169 },
      { minQty: 25, maxQty: 99, discountPercent: 25, unitPrice: 149 },
      { minQty: 100, maxQty: null, discountPercent: 35, unitPrice: 129 },
    ],
  },
  {
    id: 'cap-trucker-sub-02',
    sku: 'CP-TRK-SUB02',
    name: 'Sublimation Foam Front Trucker Hat',
    category: 'CAPS',
    tagline: 'High-Crown Padded Foam · Breathable Mesh Back',
    description: 'Classic 5-panel retro trucker hat featuring a seamless white foam front panel purpose-built for vibrant full-color sublimation printing or DTF graphics.',
    basePrice: 180,
    samplePrice: 250,
    materialSpecs: 'High-Density Poly Foam Front + Breathable Poly Mesh',
    moq: 1,
    productionTimeDays: '2–3 Days',
    badge: 'Retro Sublimation',
    supportedDecorations: ['SUBLIMATION', 'DTF'],
    defaultDecoration: 'SUBLIMATION',
    printAreaSpecs: {
      widthMm: 110,
      heightMm: 60,
      description: 'Seamless High Foam Front (4.3" x 2.4")',
      aspectRatio: '2/1',
    },
    colors: [
      {
        name: 'Sublimation White Front',
        hex: '#FFFFFF',
        image: '/mockups/white_athletic_cap.jpg',
      },
      {
        name: 'White / Black Mesh',
        hex: '#1F2937',
        image: '/mockups/white_athletic_cap.jpg',
      },
      {
        name: 'White / Navy Mesh',
        hex: '#1E3A8A',
        image: '/mockups/white_athletic_cap.jpg',
      },
    ],
    wholesaleTiers: [
      { minQty: 1, maxQty: 5, discountPercent: 0, unitPrice: 180 },
      { minQty: 6, maxQty: 24, discountPercent: 15, unitPrice: 153 },
      { minQty: 25, maxQty: 99, discountPercent: 25, unitPrice: 135 },
      { minQty: 100, maxQty: null, discountPercent: 35, unitPrice: 117 },
    ],
  },

  // ===================== 4. FLAGS : (DTF - DTG - SUBLIMATION) =====================
  {
    id: 'flag-promo-banner-01',
    sku: 'FLG-PRM-01',
    name: 'Custom Promotional & Event Banner Flag',
    category: 'FLAGS',
    tagline: 'Double-Stitched Hem · 100% Through-Print Strike-Through',
    description: 'Commercial grade knitted polyester fabric flags. 95%+ color strike-through visible on both sides with vibrant UV-stable inks. Includes brass rust-proof grommets.',
    basePrice: 290,
    samplePrice: 380,
    materialSpecs: '110 GSM 100% Knitted Polyester · Weather-Proof Finish',
    dimensions: '3 ft x 2 ft / 5 ft x 3 ft standard grommeted',
    moq: 1,
    productionTimeDays: '2–3 Days',
    badge: 'Weatherproof',
    featured: true,
    supportedDecorations: ['SUBLIMATION', 'DTF', 'DTG'],
    defaultDecoration: 'SUBLIMATION',
    printAreaSpecs: {
      widthMm: 900,
      heightMm: 600,
      description: 'Full Edge-to-Edge Strike-Through Print',
      aspectRatio: '3/2',
    },
    colors: [
      {
        name: 'Flag Base White',
        hex: '#FFFFFF',
        image: '/mockups/white_banner_flag.jpg',
      },
    ],
    wholesaleTiers: [
      { minQty: 1, maxQty: 5, discountPercent: 0, unitPrice: 290 },
      { minQty: 6, maxQty: 24, discountPercent: 15, unitPrice: 246 },
      { minQty: 25, maxQty: 99, discountPercent: 25, unitPrice: 217 },
      { minQty: 100, maxQty: null, discountPercent: 35, unitPrice: 188 },
    ],
  },
  {
    id: 'flag-feather-teardrop-02',
    sku: 'FLG-FTH-02',
    name: 'Outdoor Feather & Teardrop Flying Flag',
    category: 'FLAGS',
    tagline: 'Wind-Tunnel Tested · Heavy Duty Pole Sleeve',
    description: 'High-impact outdoor promotional flag designed for retail storefronts, events, and trade shows. Reinforced black oxford pole sleeve and double-needle hemmed borders.',
    basePrice: 480,
    samplePrice: 590,
    materialSpecs: '130 GSM High-Tension Poly Flag Knit · UV Coated',
    dimensions: '6 ft to 10 ft vertical display',
    moq: 1,
    productionTimeDays: '3–4 Days',
    badge: 'High Impact',
    supportedDecorations: ['SUBLIMATION', 'DTF'],
    defaultDecoration: 'SUBLIMATION',
    printAreaSpecs: {
      widthMm: 600,
      heightMm: 1800,
      description: 'Full Vertical Feather / Teardrop Graphic',
      aspectRatio: '1/3',
    },
    colors: [
      {
        name: 'Poly Flag White',
        hex: '#FFFFFF',
        image: '/mockups/white_banner_flag.jpg',
      },
    ],
    wholesaleTiers: [
      { minQty: 1, maxQty: 5, discountPercent: 0, unitPrice: 480 },
      { minQty: 6, maxQty: 24, discountPercent: 15, unitPrice: 408 },
      { minQty: 25, maxQty: 99, discountPercent: 25, unitPrice: 360 },
      { minQty: 100, maxQty: null, discountPercent: 35, unitPrice: 312 },
    ],
  },

  // ===================== 5. SHIRTS : (DTF - DTG - SUBLIMATION) =====================
  {
    id: 'shirt-casual-resort-01',
    sku: 'SH-CSR-01',
    name: 'Casual Button-Down Resort & Street Shirt',
    category: 'SHIRTS',
    tagline: 'Camp Collar · Full-Panel DTF, DTG & Sublimation Print',
    description: 'Relaxed short-sleeve resort shirt with a camp collar. Breathable rayon or poly-viscose blend that takes rich full-panel digital prints, floral patterns, and streetwear graphics.',
    basePrice: 399,
    samplePrice: 499,
    materialSpecs: '100% Breathable Rayon / Modal Satin · Fluid Drape',
    moq: 1,
    productionTimeDays: '3–5 Days',
    badge: 'Trending',
    featured: true,
    supportedDecorations: ['DTF', 'DTG', 'SUBLIMATION'],
    defaultDecoration: 'DTF',
    printAreaSpecs: {
      widthMm: 450,
      heightMm: 600,
      description: 'Front Chest, Back & All-Over Panels',
      aspectRatio: '3/4',
    },
    colors: [
      {
        name: 'Pure White',
        hex: '#FFFFFF',
        image: '/mockups/white_resort_shirt.jpg',
      },
      {
        name: 'Midnight Black',
        hex: '#111827',
        image: '/mockups/white_resort_shirt.jpg',
      },
      {
        name: 'Sage Olive',
        hex: '#4A5D4E',
        image: '/mockups/white_resort_shirt.jpg',
      },
    ],
    wholesaleTiers: [
      { minQty: 1, maxQty: 5, discountPercent: 0, unitPrice: 399 },
      { minQty: 6, maxQty: 24, discountPercent: 15, unitPrice: 339 },
      { minQty: 25, maxQty: 99, discountPercent: 25, unitPrice: 299 },
      { minQty: 100, maxQty: null, discountPercent: 35, unitPrice: 259 },
    ],
  },
  {
    id: 'shirt-formal-corp-02',
    sku: 'SH-CORP-02',
    name: 'Corporate Executive Button-Down Shirt',
    category: 'SHIRTS',
    tagline: 'Crisp Oxford Weave · Chest Pocket Logo & Monogram',
    description: 'Classic formal long-sleeve cotton shirt. Superior weave designed for crisp DTF chest pocket brand logos, high-resolution DTG art, or collar embroidery.',
    basePrice: 449,
    samplePrice: 549,
    materialSpecs: '60s x 60s Giza Cotton · Wrinkle-Resistant Finish',
    moq: 1,
    productionTimeDays: '3–5 Days',
    badge: 'Executive',
    supportedDecorations: ['DTF', 'DTG', 'SUBLIMATION'],
    defaultDecoration: 'DTF',
    printAreaSpecs: {
      widthMm: 120,
      heightMm: 120,
      description: 'Left Chest Pocket, Collar & Cuffs',
      aspectRatio: '1/1',
    },
    colors: [
      {
        name: 'Crisp White',
        hex: '#FFFFFF',
        image: '/mockups/white_corporate_shirt.jpg',
      },
      {
        name: 'Sky Blue',
        hex: '#93C5FD',
        image: '/mockups/white_corporate_shirt.jpg',
      },
    ],
    wholesaleTiers: [
      { minQty: 1, maxQty: 5, discountPercent: 0, unitPrice: 449 },
      { minQty: 6, maxQty: 24, discountPercent: 15, unitPrice: 381 },
      { minQty: 25, maxQty: 99, discountPercent: 25, unitPrice: 336 },
      { minQty: 100, maxQty: null, discountPercent: 35, unitPrice: 291 },
    ],
  },
];

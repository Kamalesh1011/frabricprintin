export interface UniformShade {
  name: string;
  hex: string;
  code: string;
}

export interface UniformItem {
  id: string;
  name: string;
  code: string;
  category: 'Corporate & Office Wear' | 'Industrial & Workwear' | 'Healthcare & Wellness' | 'Hospitality & Kitchen' | 'School & College';
  categoryId: 'corporate' | 'industrial' | 'healthcare' | 'hospitality' | 'school';
  subtitle: string;
  description: string;
  composition: string;
  weave: string;
  gsm: number;
  widthInches: number;
  colorFastnessGrade: string;
  features: string[];
  sizes: string[];
  customizations: string[];
  modelImage: string;
  swatchImage: string;
  gallery: string[];
  shades: UniformShade[];
  recommendedFor: string[];
  stockRolls: number;
  specs: { label: string; value: string }[];
  // Backwards compatibility for existing components
  basePricePerMeter?: number;
  moqMeters?: number;
}

// Backward compatibility alias
export type UniformFabric = UniformItem;

export interface UniformCategoryInfo {
  id: 'corporate' | 'industrial' | 'healthcare' | 'hospitality' | 'school';
  title: string;
  badge: string;
  subtitle: string;
  icon: string;
  heroImage: string;
  model3DImage: string;
  description: string;
  highlightItems: string[];
}

export const UNIFORM_CATEGORIES: UniformCategoryInfo[] = [
  {
    id: 'corporate',
    title: 'Corporate & Office Wear',
    badge: 'Executive Business Standard',
    subtitle: 'Refined tailoring for executive boardrooms, corporate teams & banking staff',
    icon: 'Briefcase',
    heroImage: '/uniforms/hero-corporate.jpg',
    model3DImage: '/uniforms/hero-corporate.jpg',
    description: 'Polished silhouettes, wrinkle-resistant PV suiting, luxury oxford weaves, and bio-washed pique polos engineered for all-day comfort.',
    highlightItems: ['Oxford & Poplin Shirts', 'Premium Pique Polo', 'Blazer & Waistcoat', 'Formal Trousers & Shirts']
  },
  {
    id: 'industrial',
    title: 'Industrial & Workwear',
    badge: 'Heavy-Duty Safety Compliance',
    subtitle: 'Rugged workwear, high-visibility PPE, and reinforced shop utility garments',
    icon: 'Shield',
    heroImage: '/uniforms/hero-industrial.jpg',
    model3DImage: '/uniforms/hero-industrial.jpg',
    description: 'Built for tough field conditions with 280+ GSM tear-resistant drill, EN-certified hi-vis bands, triple-needle stitching, and oil repellent finish.',
    highlightItems: ['Coveralls / Boilersuits', 'High-Visibility (Hi-Vis) Vests', 'Cargo Work Pants', 'Shop Aprons']
  },
  {
    id: 'healthcare',
    title: 'Healthcare & Wellness',
    badge: 'Anti-Microbial & Silver Ion Treated',
    subtitle: 'Hygienic apparel for doctors, surgeons, clinic nurses & wellness spas',
    icon: 'Stethoscope',
    heroImage: '/uniforms/hero-healthcare.jpg',
    model3DImage: '/uniforms/hero-healthcare.jpg',
    description: 'Autoclave safe (134°C), fluid-repellent, chlorine bleach proof textiles engineered to eliminate 99.9% of bacteria for clinical safety.',
    highlightItems: ['Medical Scrubs', 'Lab Coats', 'Spa & Salon Tunics']
  },
  {
    id: 'hospitality',
    title: 'Hospitality & Kitchen',
    badge: 'Teflon Spill-Shield Protected',
    subtitle: 'Culinary jackets, front-of-house server wear & restaurant aprons',
    icon: 'UtensilsCrossed',
    heroImage: '/uniforms/hero-hospitality.jpg',
    model3DImage: '/uniforms/hero-hospitality.jpg',
    description: 'High-temperature breathable poplin, oil-resistant bistro aprons, and thermo-vented executive chef coats crafted for premium dining environments.',
    highlightItems: ['Chef Coats', 'Server Shirts', 'Bistro Aprons', 'Utility Caps & Bandanas']
  },
  {
    id: 'school',
    title: 'School & College',
    badge: '100+ Wash Cycle Anti-Pilling',
    subtitle: 'Complete institutional uniform programs, athletic kits & crested accessories',
    icon: 'GraduationCap',
    heroImage: '/uniforms/hero-school.jpg',
    model3DImage: '/uniforms/hero-school.jpg',
    description: 'Yarn-dyed woven checks, sharp heat-set pleated tartan skirts, durable PV matty trousers, and moisture-wicking interlock house sportswear.',
    highlightItems: ['Accessories', 'Uniform', 'SportsWear']
  }
];

export const UNIFORM_PRODUCTS: UniformItem[] = [
  // ==========================================
  // 1. CORPORATE & OFFICE WEAR (4 Listed Items)
  // ==========================================
  {
    id: 'corp-oxford-poplin-shirts',
    name: 'Oxford & Poplin Shirts',
    code: 'COP-01',
    category: 'Corporate & Office Wear',
    categoryId: 'corporate',
    subtitle: 'Executive Pinpoint Oxford & Crisp Wrinkle-Free Poplin Shirting',
    description: 'Precision-tailored executive shirting featuring high thread-count pinpoint Oxford and smooth poplin weaves. Treated with nano-easy-iron finish for a sharp, crease-free silhouette throughout long corporate workdays.',
    composition: '80% Giza Cotton / 20% Micro-Poly Comfort Blend',
    weave: 'Two-Ply Pinpoint Oxford & Poplin Weave',
    gsm: 145,
    widthInches: 58,
    colorFastnessGrade: 'Grade 5.0 (Wash & Light Resistant)',
    features: [
      'Wrinkle-Free Easy Care Technology',
      'French Seams & Reinforced Collar Bands',
      'Breathable All-Season Cotton Touch',
      'Custom Embroidered Crest / Pocket Monogram'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', 'Custom Tailored'],
    customizations: [
      'Embroidered Company Logo (Left Chest)',
      'Contrasting Inner Collar & Cuff Piping',
      'Concealed Button Placket',
      'Short / Full Sleeve Options'
    ],
    modelImage: '/uniforms/oxford-shirt.jpg',
    swatchImage: '/uniforms/formal-shirt.png',
    gallery: [
      '/uniforms/oxford-shirt.jpg',
      '/uniforms/formal-shirt.png',
      '/uniforms/formal-shirt-alt.png'
    ],
    shades: [
      { name: 'Executive Sky Blue', hex: '#93C5FD', code: 'OX-SKY' },
      { name: 'Crisp Optical White', hex: '#FFFFFF', code: 'OX-WHT' },
      { name: 'French Royal Blue', hex: '#2563EB', code: 'OX-ROY' },
      { name: 'Corporate Steel Grey', hex: '#94A3B8', code: 'OX-GRY' },
      { name: 'Soft Lavender', hex: '#E9D5FF', code: 'OX-LAV' }
    ],
    recommendedFor: ['Corporate Executives', 'Banking & Financial Staff', 'IT & Tech Enterprises', 'Client-Facing Consultants'],
    stockRolls: 85,
    specs: [
      { label: 'Yarn Count', value: '60s x 60s High Compact' },
      { label: 'Tensile Strength', value: '450N (ISO 13934)' },
      { label: 'Dimensional Stability', value: 'Under 1.5% Shrinkage' },
      { label: 'Stitch Density', value: '18 Stitches Per Inch' }
    ]
  },
  {
    id: 'corp-premium-pique-polo',
    name: 'Premium Pique Polo',
    code: 'COP-02',
    category: 'Corporate & Office Wear',
    categoryId: 'corporate',
    subtitle: 'Bio-Washed Combed Cotton Honeycomb Pique Polo with Anti-Curl Collar',
    description: 'The executive casual uniform standard. Knit from 100% long-staple combed cotton with rich honeycomb pique texture, enzyme wash finish for ultra-soft handfeel, and jacquard ribbed collar that never curls or sags.',
    composition: '95% Combed Cotton / 5% Elastane Spandex Rib',
    weave: 'Heavy-Knit Honeycomb Pique (Bio-Washed)',
    gsm: 230,
    widthInches: 58,
    colorFastnessGrade: 'Grade 4-5 (Bio-Silicon Enzyme Dyed)',
    features: [
      'Anti-Curl Ribbed Collar & Cuffs',
      'Enzyme Bio-Polished Smooth Touch',
      'Side Vents with Reinforced Herringbone Tape',
      'High-Density Screen Print & HD Embroidery Ready'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL'],
    customizations: [
      'High-Definition Chest Embroidery',
      'Custom Tipped Collar & Sleeve Rib Stripes',
      'Custom Engraved Pearlized Buttons',
      'Silicone Heat-Transfer Shoulder Badge'
    ],
    modelImage: '/uniforms/pique-polo.jpg',
    swatchImage: '/uniforms/corporate-main.png',
    gallery: [
      '/uniforms/pique-polo.jpg',
      '/uniforms/corporate-main.png'
    ],
    shades: [
      { name: 'Navy Blue Pique', hex: '#1E3A8A', code: 'PL-NVY' },
      { name: 'Jet Carbon Black', hex: '#111827', code: 'PL-BLK' },
      { name: 'Pristine Snow White', hex: '#F9FAFB', code: 'PL-WHT' },
      { name: 'Heather Charcoal Grey', hex: '#4B5563', code: 'PL-GRY' },
      { name: 'Deep Burgundy Wine', hex: '#881337', code: 'PL-WNE' }
    ],
    recommendedFor: ['Tech Teams & Startups', 'Field Sales Personnel', 'Corporate Casual Fridays', 'Dealership Staff'],
    stockRolls: 110,
    specs: [
      { label: 'Knit Gauge', value: '24 GG Single Jersey Pique' },
      { label: 'Shrinkage Rate', value: '< 2.0% Post Bio-Wash' },
      { label: 'Pilling Rating', value: 'Grade 4.5 Martindale' },
      { label: 'Dye Standard', value: 'Azo-Free Reactive Dyes' }
    ]
  },
  {
    id: 'corp-blazer-waistcoat',
    name: 'Blazer & Waistcoat',
    code: 'COP-03',
    category: 'Corporate & Office Wear',
    categoryId: 'corporate',
    subtitle: 'Tailored 2-Piece Executive Suiting in Poly-Viscose 2-Way Flex Weave',
    description: 'Structured corporate blazers and tailored waistcoats engineered with lightweight shoulder canvassing, breathable viscose lining, and functional internal pockets. Designed to project executive authority while allowing ergonomic motion.',
    composition: '70% Polyester / 28% Viscose / 2% Spandex Stretch',
    weave: 'Gabardine Twill Suiting with Wrinkle Recovery',
    gsm: 285,
    widthInches: 58,
    colorFastnessGrade: 'Grade 5.0 (Dry Clean & Machine Friendly)',
    features: [
      '2-Way Comfort Stretch Recovery',
      'Satin Lined with Dual Security Pockets',
      'Wrinkle-Resistant Travel Drape',
      'Matched Single & Double-Breasted Cuts'
    ],
    sizes: ['36R', '38R', '40R', '42R', '44R', '46R', '48R', 'Bespoke Custom'],
    customizations: [
      'Subtle Lapel Pin or Direct Metallic Embroidery',
      'Contrast Piping on Lapels & Pocket Flaps',
      'Matching Waistcoat / Vest Addition',
      'Custom Monogrammed Inner Lining'
    ],
    modelImage: '/uniforms/corporate-blazer.png',
    swatchImage: '/uniforms/womens-blazer.png',
    gallery: [
      '/uniforms/corporate-blazer.png',
      '/uniforms/womens-blazer.png',
      '/uniforms/corporate-main.png'
    ],
    shades: [
      { name: 'Midnight Navy', hex: '#0F172A', code: 'BZ-MID' },
      { name: 'Charcoal Slate Black', hex: '#18181B', code: 'BZ-BLK' },
      { name: 'Dark Gunmetal Grey', hex: '#374151', code: 'BZ-GRY' },
      { name: 'British Racing Green', hex: '#064E3B', code: 'BZ-GRN' }
    ],
    recommendedFor: ['Senior Management & C-Suite', 'Aviation Ground Staff', 'Luxury Hospitality Front Desk', 'Legal & Financial Firms'],
    stockRolls: 60,
    specs: [
      { label: 'Interlining', value: 'Fused Canvas with Soft Chest Piece' },
      { label: 'Lining Cloth', value: 'Breathable Twill Jacquard Viscose' },
      { label: 'Button Fastening', value: 'Cross-Stitched Horn Finish' },
      { label: 'Wrinkle Recovery', value: 'Grade 5 Instant Drape' }
    ]
  },
  {
    id: 'corp-formal-trousers-shirts',
    name: 'Formal Trousers & Shirts',
    code: 'COP-04',
    category: 'Corporate & Office Wear',
    categoryId: 'corporate',
    subtitle: 'Flat-Front Poly-Viscose Formal Trousers Paired with Coordinated Shirts',
    description: 'Complete formal pairing featuring flat-front trousers with shirt-gripper waistband and stain-release treated formal shirts. Delivers uniform visual harmony across massive multi-branch corporate teams.',
    composition: '65% Poly / 35% Viscose Heavy Drape Suiting',
    weave: 'Anti-Static Micro Twill & Poplin Combo',
    gsm: 260,
    widthInches: 58,
    colorFastnessGrade: 'Grade 5.0 (No Color Fading)',
    features: [
      'Silicone Shirt-Gripper Inner Waistband',
      'Deep Slash Pockets with Bar-Tack Reinforcement',
      'Double-Hook Bar & Heavy Brass Zip Fly',
      'Machine Washable Easy Maintenance'
    ],
    sizes: ['28', '30', '32', '34', '36', '38', '40', '42', '44', 'Custom Length'],
    customizations: [
      'Tailored Regular or Slim-Tapered Silhouette',
      'Belt Loops with Watch Pocket Option',
      'Pre-hemmed or Unhemmed Inseams for Bulk Fit',
      'Subtle Tonal Brand Tagging'
    ],
    modelImage: '/uniforms/corporate-main.png',
    swatchImage: '/uniforms/trousers.png',
    gallery: [
      '/uniforms/corporate-main.png',
      '/uniforms/trousers.png',
      '/uniforms/trouser-alt.png'
    ],
    shades: [
      { name: 'Formal Charcoal Grey', hex: '#374151', code: 'TR-CHR' },
      { name: 'Executive Navy Blue', hex: '#1E293B', code: 'TR-NVY' },
      { name: 'Deep Solid Black', hex: '#09090B', code: 'TR-BLK' },
      { name: 'Muted Earth Khaki', hex: '#78716C', code: 'TR-KHK' }
    ],
    recommendedFor: ['Corporate Office Workforce', 'Retail Bank Executives', 'Telecom & Tech Personnel', 'Facility Managers'],
    stockRolls: 90,
    specs: [
      { label: 'Waistband Tech', value: 'Comfort-Flex 1.5" Elastic Extension' },
      { label: 'Pocket Bags', value: 'Heavyweight Poly-Cotton Drill' },
      { label: 'Abrasion Rating', value: '50,000+ Martindale Rubs' },
      { label: 'Ironing Care', value: 'Low Temp Permanent Crease' }
    ]
  },

  // ==========================================
  // 2. INDUSTRIAL & WORKWEAR (4 Listed Items)
  // ==========================================
  {
    id: 'ind-coveralls-boilersuits',
    name: 'Coveralls / Boilersuits',
    code: 'INW-01',
    category: 'Industrial & Workwear',
    categoryId: 'industrial',
    subtitle: 'Heavy-Duty 280+ GSM Twill Coverall with 2-Way Brass Zip & Action Back',
    description: 'Engineered for extreme factory, oil rig, and automotive workshop environments. Constructed from rugged heavy drill with two-way heavy brass zip, bi-swing action back pleats for full mobility, and bartacked stress points.',
    composition: '100% Cotton Drill or 65/35 Heavy Poly-Cotton (FR Optional)',
    weave: '3/1 Heavyweight Industrial Drill',
    gsm: 280,
    widthInches: 58,
    colorFastnessGrade: 'Grade 4.5 (Oil, Grease & Industrial Wash Proof)',
    features: [
      'Two-Way Heavy Duty Concealed Brass Zipper',
      'Action Bi-Swing Back for Free Shoulder Reach',
      'Rule Pocket, Hammer Loop & Dual Chest Pockets',
      'Optional EN ISO 11612 Flame Retardant Finish'
    ],
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL'],
    customizations: [
      'Class 2/3 Hi-Vis Silver Reflective Bands (50mm)',
      'Direct Direct Embroidery on Chest & Back Placket',
      'Company Name Badge & ID Card Loop',
      'Reinforced Knee Pad Insert Pockets'
    ],
    modelImage: '/uniforms/industrial-main.png',
    swatchImage: '/uniforms/industrial-main.png',
    gallery: [
      '/uniforms/industrial-main.png'
    ],
    shades: [
      { name: 'Industrial Royal Blue', hex: '#1D4ED8', code: 'CV-ROY' },
      { name: 'Petroleum Navy', hex: '#1E293B', code: 'CV-NVY' },
      { name: 'Safety High-Visibility Orange', hex: '#EA580C', code: 'CV-ORG' },
      { name: 'Heavy Machinery Red', hex: '#DC2626', code: 'CV-RED' },
      { name: 'Workshop Olive Khaki', hex: '#44403C', code: 'CV-KHK' }
    ],
    recommendedFor: ['Heavy Manufacturing Plants', 'Automotive Technicians', 'Oil, Gas & Refinery Operations', 'Aviation Maintenance'],
    stockRolls: 75,
    specs: [
      { label: 'Tear Resistance', value: '1,450 N Warp / Weft' },
      { label: 'Stitch Construction', value: 'Triple-Needle Chain Stitch' },
      { label: 'Chemical Splash', value: 'Certified EN 13034 Compliant' },
      { label: 'Wash Cycles', value: '120+ Industrial Laundry Cycles' }
    ]
  },
  {
    id: 'ind-hivis-vests',
    name: 'High-Visibility (Hi-Vis) Vests',
    code: 'INW-02',
    category: 'Industrial & Workwear',
    categoryId: 'industrial',
    subtitle: 'ANSI/ISEA 107 Class 2 Fluorescent Safety Vests with 3M Reflective Tape',
    description: 'High-visibility safety vests engineered for maximum day-and-night worker recognition in construction zones, warehouses, roadworks, and cargo logistics. Features certified 3M Scotchlite reflective tape with tear-away safety velcro.',
    composition: '100% Fluorescent Polyester Tricot Mesh / Solid Weave',
    weave: 'Air-Vented Breathable Micro-Mesh',
    gsm: 130,
    widthInches: 58,
    colorFastnessGrade: 'Grade 5.0 (UV Sun Exposure Protected)',
    features: [
      'Certified 3M Scotchlite 50mm Reflective Bands',
      'Quick-Release 5-Point Tear-Away Velcro System',
      'Clear ID Badge Holder & Multi-Pen Utility Pockets',
      'Mic Loops for Walkie-Talkies & Two-Way Radios'
    ],
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL', 'Universal Adjustable'],
    customizations: [
      'Back Panel Large Bold Company Name Print',
      'Chest Logo Screen Print in High-Contrast Black',
      'Zipper Closure or Heavy-Duty Velcro Closure',
      'Internal Tablet / Blueprint Storage Pocket'
    ],
    modelImage: '/uniforms/hivis-vest.jpg',
    swatchImage: '/uniforms/industrial-main.png',
    gallery: [
      '/uniforms/hivis-vest.jpg',
      '/uniforms/industrial-main.png'
    ],
    shades: [
      { name: 'Fluorescent Neon Yellow-Green', hex: '#CCFF00', code: 'HV-YEL' },
      { name: 'Daylight Safety Orange', hex: '#FF5722', code: 'HV-ORG' },
      { name: 'Traffic Safety Lime', hex: '#84CC16', code: 'HV-LIM' }
    ],
    recommendedFor: ['Civil Construction Sites', 'Highway & Airport Ground Staff', 'Port & Container Yard Logistics', 'Emergency Response Units'],
    stockRolls: 140,
    specs: [
      { label: 'Safety Standard', value: 'EN ISO 20471 / ANSI Class 2' },
      { label: 'Reflectivity Index', value: '450 cd/lux Candela Peak' },
      { label: 'Closure Strength', value: 'Heavy Duty 20,000 Cycle Velcro' },
      { label: 'Weight', value: 'Ultralight 140 Grams Total' }
    ]
  },
  {
    id: 'ind-cargo-work-pants',
    name: 'Cargo Work Pants',
    code: 'INW-03',
    category: 'Industrial & Workwear',
    categoryId: 'industrial',
    subtitle: 'Ripstop Reinforced Multi-Pocket Tactical Workwear Trousers',
    description: 'Engineered for field engineers, electrical linesmen, and warehouse operators. Constructed with cross-hatch ripstop yarn that halts accidental cuts or punctures, featuring bellowed cargo pockets and top-loading knee pad pouches.',
    composition: '65% Poly / 35% Cotton Heavy-Duty Ripstop Grid',
    weave: 'Tactical Square Cross-Hatch Ripstop',
    gsm: 250,
    widthInches: 58,
    colorFastnessGrade: 'Grade 5.0 (Abrasion & Wash Stable)',
    features: [
      '7 Ergonomic Tactical Utility & Tech Pockets',
      'Reinforced Cordura Knee Panels & Hem Guards',
      'Wide Tunnel Belt Loops with D-Ring Clip',
      'Gusseted Crotch for Unrestricted Squatting'
    ],
    sizes: ['28', '30', '32', '34', '36', '38', '40', '42', '44', '46'],
    customizations: [
      'Custom Embroidered Utility Flap Logo',
      'Reflective Calves / Pockets Piping',
      'Dedicated Smartphone / Radio Holster',
      'Double-Layer Heavy Seat Panel'
    ],
    modelImage: '/uniforms/trouser-alt.png',
    swatchImage: '/uniforms/trousers.png',
    gallery: [
      '/uniforms/trouser-alt.png',
      '/uniforms/trousers.png',
      '/uniforms/industrial-main.png'
    ],
    shades: [
      { name: 'Tactical Matte Black', hex: '#18181B', code: 'CG-BLK' },
      { name: 'Industrial Charcoal Grey', hex: '#4B5563', code: 'CG-GRY' },
      { name: 'Workplace Khaki Sand', hex: '#A8A29E', code: 'CG-KHK' },
      { name: 'Deep Military Olive', hex: '#365314', code: 'CG-OLV' },
      { name: 'Refinery Navy Blue', hex: '#1E293B', code: 'CG-NVY' }
    ],
    recommendedFor: ['Electrical & Telecom Technicians', 'Plumbers & HVAC Mechanics', 'Warehousing & Forklift Drivers', 'Field Surveyors'],
    stockRolls: 80,
    specs: [
      { label: 'Ripstop Strength', value: 'Zero Tear Propagation Guarantee' },
      { label: 'Water Repellency', value: 'DWR Durable Nano Coating' },
      { label: 'Seam Tech', value: 'Flat-Felled Double Bartack Seams' },
      { label: 'Hardware', value: 'Corrosion-Free Brass YKK Fasteners' }
    ]
  },
  {
    id: 'ind-shop-aprons',
    name: 'Shop Aprons',
    code: 'INW-04',
    category: 'Industrial & Workwear',
    categoryId: 'industrial',
    subtitle: 'Heavy Canvas & Split-Leg Utility Aprons with Cross-Back Harness',
    description: 'Ergonomic heavy-duty workshop aprons built for machinists, welders, carpenters, and maintenance technicians. The cross-back harness distributes tool weight off the neck, while liquid-resistant canvas repels grease, metal chips, and coolants.',
    composition: '100% Heavy Cotton Duck Canvas (14 Oz.) / Heavy Poly-Drill',
    weave: 'Double-Warp Industrial Duck Weave',
    gsm: 360,
    widthInches: 58,
    colorFastnessGrade: 'Grade 5.0 (Machine Washable Wax Canvas Touch)',
    features: [
      'Weight-Distributing X-Back Cotton Webbing Harness',
      'Solid Brass Grommets & Riveted Pockets',
      'Split-Leg Cut for Uninhibited Leg Movement',
      'Dedicated Magnetic Hardware Catch & Tool Loops'
    ],
    sizes: ['Universal Adjustable Fit (Chest Width 27", Length 34")'],
    customizations: [
      'Laser-Etched Leather Brand Patch on Chest',
      'Custom Screen Printed Corporate Identity',
      'Specialized Tool Pocket Slot Configuration',
      'Oil-Proof Waxed Canvas Finish'
    ],
    modelImage: '/uniforms/bistro-apron.jpg',
    swatchImage: '/uniforms/industrial-main.png',
    gallery: [
      '/uniforms/bistro-apron.jpg',
      '/uniforms/industrial-main.png'
    ],
    shades: [
      { name: 'Machinist Heavy Charcoal', hex: '#27272A', code: 'AP-CHR' },
      { name: 'Raw Tooling Tan Khaki', hex: '#78716C', code: 'AP-TAN' },
      { name: 'Industrial Navy', hex: '#1E293B', code: 'AP-NVY' },
      { name: 'Forge Forest Green', hex: '#14532D', code: 'AP-GRN' }
    ],
    recommendedFor: ['Woodworkers & Machinists', 'Automotive Detailing & Mechanics', 'Foundry & Toolroom Engineers', 'Artisan Craft Workshops'],
    stockRolls: 55,
    specs: [
      { label: 'Canvas Gauge', value: '14 Oz. Double Fill Duck' },
      { label: 'Strap System', value: '1.25" Heavy Poly-Cotton Webbing' },
      { label: 'Riveting', value: 'Antiqued Brass Anti-Rust Rivets' },
      { label: 'Liquid Resistance', value: 'Repels Cutting Coolants & Oils' }
    ]
  },

  // ==========================================
  // 3. HEALTHCARE & WELLNESS (3 Listed Items)
  // ==========================================
  {
    id: 'health-medical-scrubs',
    name: 'Medical Scrubs',
    code: 'HCW-01',
    category: 'Healthcare & Wellness',
    categoryId: 'healthcare',
    subtitle: 'Silver-Ion Anti-Microbial 4-Way Stretch Scrub Tops & Cargo Joggers',
    description: 'Precision clinical apparel trusted by surgeons, doctors, and nursing staff. Infused with Silver-Ion nanotechnology to destroy 99.9% of bacteria and odor on contact. High-mobility 4-way stretch twill withstands high-temperature 134°C autoclave sterilizing cycles without fading.',
    composition: '72% Poly / 21% Rayon / 7% Spandex Anti-Bacterial Twill',
    weave: 'Silky 4-Way Fluid-Repellent Twill',
    gsm: 180,
    widthInches: 58,
    colorFastnessGrade: 'Grade 5.0 (Chlorine Bleach & Autoclave Resistant)',
    features: [
      'Silver Ion Anti-Microbial Shield (ISO 20743 Certified)',
      'Fluorocarbon Liquid & Fluid Barrier Coating',
      'Yoga-Band Waist & Deep Stethoscope Pocket',
      'Zero Fading Through 100+ Commercial Hospital Laundries'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', 'Custom Clinic Fit'],
    customizations: [
      'Embroidered Hospital Logo & Doctor Name / Department',
      'Contrast V-Neck or Mandarin Collar Trim',
      'Jogger Elastic Cuff or Straight Leg Hem Options',
      'Custom Surgical Scrub Color Coding by Ward'
    ],
    modelImage: '/uniforms/healthcare-main.png',
    swatchImage: '/uniforms/healthcare-main.png',
    gallery: [
      '/uniforms/healthcare-main.png'
    ],
    shades: [
      { name: 'Hospital Ceil Blue', hex: '#38BDF8', code: 'SC-CEL' },
      { name: 'Surgical OT Teal', hex: '#0D9488', code: 'SC-TEL' },
      { name: 'Medical Navy Blue', hex: '#1E3A8A', code: 'SC-NVY' },
      { name: 'Doctor Burgundy Maroon', hex: '#881337', code: 'SC-BUR' },
      { name: 'Pediatric Lilac Lavender', hex: '#A855F7', code: 'SC-LAV' }
    ],
    recommendedFor: ['Hospitals & Surgical Theaters', 'Dental & Cosmetic Clinics', 'Veterinary Centers', 'Pathology Laboratories'],
    stockRolls: 130,
    specs: [
      { label: 'Bacteria Kill Rate', value: '99.9% Reduction (ISO 20743)' },
      { label: 'Autoclave Safe', value: 'Up to 134°C Thermal Steam' },
      { label: 'Fluid Barrier', value: 'AAMI Level 2 Liquid Repellency' },
      { label: 'Bleach Tolerance', value: 'Resistant to Chlorine Bleach Agents' }
    ]
  },
  {
    id: 'health-lab-coats',
    name: 'Lab Coats',
    code: 'HCW-02',
    category: 'Healthcare & Wellness',
    categoryId: 'healthcare',
    subtitle: 'Optical-White Stain-Release Doctor & Scientist Consultant Coats',
    description: 'Crisp, structured white coats for physicians, resident consultants, pharmacy directors, and pathology scientists. Specially treated with optical white brighteners that resist yellowing, complemented by pass-through side pocket slits for effortless pant-pocket access.',
    composition: '100% Combed Cotton or 65% Poly / 35% Cotton Heavy Poplin',
    weave: 'Structured 3/1 Fine Twill / Poplin',
    gsm: 215,
    widthInches: 58,
    colorFastnessGrade: 'Grade 5.0 (Zero Yellowing Optical Brightness)',
    features: [
      'Chemical Splash & Fluid Stain-Release Treatment',
      'Side Slit Pocket Access to Trouser Pockets',
      'Notched Lapel with Reinforced Chest Pen Slot',
      'Full & 3/4 Sleeve Options with Back Vent Slit'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', 'Tailored Cut'],
    customizations: [
      'Direct Embroidery of Medical Degree, Name & Council No.',
      'Institutional Embroidered Crest on Chest Pocket',
      'Knee Length or Hip Length Consultant Styles',
      'Antimicrobial Finish Coating'
    ],
    modelImage: '/uniforms/lab-coat.jpg',
    swatchImage: '/uniforms/healthcare-main.png',
    gallery: [
      '/uniforms/lab-coat.jpg',
      '/uniforms/healthcare-main.png'
    ],
    shades: [
      { name: 'Physician Optical White', hex: '#FFFFFF', code: 'LC-WHT' },
      { name: 'Clinical Pale Blue', hex: '#F0F9FF', code: 'LC-SKY' }
    ],
    recommendedFor: ['Senior Physicians & Consultants', 'Clinical Laboratory Scientists', 'Pharmacists & Chemists', 'Medical Students & Interns'],
    stockRolls: 90,
    specs: [
      { label: 'Fabric Weave', value: 'High-Density 3/1 Lab Twill' },
      { label: 'Thermal Resistance', value: 'Withstands 90°C Hospital Wash' },
      { label: 'Whiteness Index', value: 'CIE Whiteness > 140' },
      { label: 'Pockets', value: '3 Reinforced Pockets + Side Slits' }
    ]
  },
  {
    id: 'health-spa-salon-tunics',
    name: 'Spa & Salon Tunics',
    code: 'HCW-03',
    category: 'Healthcare & Wellness',
    categoryId: 'healthcare',
    subtitle: 'Asymmetric Wrap Tunics with 2-Way Flex Stretch & Liquid Oil Repellent',
    description: 'Contemporary, elegant spa and wellness uniforms designed for massage therapists, estheticians, dermatology clinics, and luxury salon staff. Features an asymmetric wrap front, mandarin collar, and stain-resistant poly-spandex that shields against cosmetic oils and dyes.',
    composition: '75% Polyester / 21% Viscose / 4% Spandex Stretch',
    weave: 'Crease-Resistant Soft Draping Micro Twill',
    gsm: 195,
    widthInches: 58,
    colorFastnessGrade: 'Grade 5.0 (Oil & Bleach Resistant)',
    features: [
      'Asymmetric Wrap with Concealed Snap Fasteners',
      'Cosmetic Oil & Tint Splash Repellent',
      '2-Way Flex Stretch for Unrestricted Arm Movement',
      'Princess Seams for Flattering Professional Fit'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'],
    customizations: [
      'Luxury Metallic Embroidery on Chest or Sleeve',
      'Contrast Collar & Asymmetric Edge Satin Trim',
      'Matching Tapered Stretch Pants',
      'Short Sleeve or 3/4 Sleeve Variations'
    ],
    modelImage: '/uniforms/spa-tunic.jpg',
    swatchImage: '/uniforms/healthcare-main.png',
    gallery: [
      '/uniforms/spa-tunic.jpg',
      '/uniforms/healthcare-main.png'
    ],
    shades: [
      { name: 'Spa Midnight Black', hex: '#18181B', code: 'TN-BLK' },
      { name: 'Warm Taupe Beige', hex: '#D6D3D1', code: 'TN-TAU' },
      { name: 'Deep Plum Wine', hex: '#581C87', code: 'TN-PLM' },
      { name: 'Zen Sage Green', hex: '#84A98C', code: 'TN-SGE' },
      { name: 'Pure Wellness White', hex: '#FAFAFA', code: 'TN-WHT' }
    ],
    recommendedFor: ['Luxury Hotel Spas & Wellness Resorts', 'Dermatology & Skin Care Centers', 'Hair Salons & Beauty Clinics', 'Physiotherapy Clinics'],
    stockRolls: 65,
    specs: [
      { label: 'Stretch Rating', value: '15% Bi-Directional Elasticity' },
      { label: 'Stain Tech', value: 'Teflon SkinSafe Oil Release' },
      { label: 'Fasteners', value: 'Hypoallergenic Nickel-Free Snaps' },
      { label: 'Care Mode', value: 'Quick-Dry / Zero-Iron Required' }
    ]
  },

  // ==========================================
  // 4. HOSPITALITY & KITCHEN (4 Listed Items)
  // ==========================================
  {
    id: 'hosp-chef-coats',
    name: 'Chef Coats',
    code: 'HSK-01',
    category: 'Hospitality & Kitchen',
    categoryId: 'hospitality',
    subtitle: 'Double-Breasted Executive Chef Jackets with CoolMax Underarm Mesh',
    description: 'Engineered for executive masterchefs, line cooks, and commercial culinary kitchens. Crafted from heat-resistant, high-density cotton-rich twill with breathable underarm moisture mesh panels and heat-resistant cloth-covered knot buttons.',
    composition: '65% Long-Staple Cotton / 35% Polyester Heavy Poplin',
    weave: 'Liquid-Repellent High-Density Poplin Weave',
    gsm: 220,
    widthInches: 58,
    colorFastnessGrade: 'Grade 5.0 (High Temp Wash & Sauce Resistant)',
    features: [
      'Teflon Fabric Protector Repels Grease, Gravy & Wine',
      'CoolMax Airflow Mesh Underarm Panels for Heat Relief',
      'Dual Split Sleeve Thermometer & Pen Pockets',
      'Reversible Double-Breasted Flap Closure'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL'],
    customizations: [
      'Embroidered Chef Name & Culinary Title',
      'National Flag or Restaurant Crest on Stand Collar',
      'Cloth Knot or Stainless Steel Stud Button Options',
      'Black or Red Contrast Piping Along Collar & Cuffs'
    ],
    modelImage: '/uniforms/hospitality-main.png',
    swatchImage: '/uniforms/hospitality-main.png',
    gallery: [
      '/uniforms/hospitality-main.png'
    ],
    shades: [
      { name: 'Culinary Pure White', hex: '#FFFFFF', code: 'CF-WHT' },
      { name: 'Executive Midnight Black', hex: '#18181B', code: 'CF-BLK' },
      { name: 'Chic Charcoal Grey', hex: '#374151', code: 'CF-GRY' },
      { name: 'Bistro Navy Blue', hex: '#1E3A8A', code: 'CF-NVY' }
    ],
    recommendedFor: ['5-Star Hotel Kitchens', 'Fine Dining Executive Chefs', 'Boutique Bakeries & Patisseries', 'Culinary Institutes'],
    stockRolls: 80,
    specs: [
      { label: 'Heat Resistance', value: 'Engineered for 60°C Line Kitchens' },
      { label: 'Ventilation Tech', value: 'Laser-Perforated Moisture Mesh' },
      { label: 'Buttons', value: 'Removable Studs or Cloth Knots' },
      { label: 'Laundry Safe', value: '85°C Industrial Degreaser Wash' }
    ]
  },
  {
    id: 'hosp-server-shirts',
    name: 'Server Shirts',
    code: 'HSK-02',
    category: 'Hospitality & Kitchen',
    categoryId: 'hospitality',
    subtitle: 'Front-of-House Stretch Poplin Server & Bartender Uniform Shirts',
    description: 'Sleek, spill-resistant shirting designed specifically for restaurant captains, waitstaff, bartenders, and banquet servers. Tailored with a modern mandarin collar or classic button-down, featuring 2-way stretch for ease of tray carrying.',
    composition: '75% Combed Cotton / 22% Micro-Poly / 3% Spandex',
    weave: 'Silky Stretch Easy-Iron Poplin',
    gsm: 135,
    widthInches: 58,
    colorFastnessGrade: 'Grade 5.0 (Machine Washable Stain Guard)',
    features: [
      'Nano-Stain Barrier (Spilled Drinks Wipe Clean)',
      'Underarm Expansion Pleat for Tray Balancing',
      'Reinforced Apron-Tear Proof Back Seam',
      'Roll-Tab Sleeve Holders for Busy Shifts'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', 'Custom Cut'],
    customizations: [
      'Embroidered Restaurant Logo on Left Chest / Cuff',
      'Mandarin / Band Collar or Standard Formal Collar',
      'Short Sleeve or Roll-Up Long Sleeve Variations',
      'Contrasting Inner Placket Fabric Accent'
    ],
    modelImage: '/uniforms/formal-shirt-alt.png',
    swatchImage: '/uniforms/hospitality-main.png',
    gallery: [
      '/uniforms/formal-shirt-alt.png',
      '/uniforms/hospitality-main.png'
    ],
    shades: [
      { name: 'Bistro Jet Black', hex: '#171717', code: 'SS-BLK' },
      { name: 'Hotel Crisp White', hex: '#FFFFFF', code: 'SS-WHT' },
      { name: 'Dark Slate Charcoal', hex: '#334155', code: 'SS-SLT' },
      { name: 'Wine Cellar Burgundy', hex: '#701A75', code: 'SS-BUR' },
      { name: 'Rich Olive Earth', hex: '#3F6212', code: 'SS-OLV' }
    ],
    recommendedFor: ['Fine Dining Waitstaff', 'Mixologists & Bartenders', 'Banquet & Catering Crews', 'Hotel Front-of-House Teams'],
    stockRolls: 95,
    specs: [
      { label: 'Stretch Mobility', value: 'Comfort-Flex Mechanical Recovery' },
      { label: 'Stain Tech', value: 'Liquid Spill & Wine Repellent' },
      { label: 'Button Fastening', value: 'Impact-Resistant Melamine' },
      { label: 'Iron Care', value: 'Crease-Resistant Wash & Wear' }
    ]
  },
  {
    id: 'hosp-bistro-aprons',
    name: 'Bistro Aprons',
    code: 'HSK-03',
    category: 'Hospitality & Kitchen',
    categoryId: 'hospitality',
    subtitle: 'Heavy Cotton Twill Full Bib & Half Waist Aprons with Utility Pockets',
    description: 'Durable, stylish aprons tailored for baristas, servers, and sommeliers. Constructed from heavyweight 260 GSM twill with long wraparound herringbone waist ties, durable double-stitch bar-tack pocket reinforcements, and tablet/pad slot.',
    composition: '65% Polyester / 35% Combed Cotton Heavy Twill',
    weave: '2/1 Liquid-Repellent Hospitality Twill',
    gsm: 260,
    widthInches: 58,
    colorFastnessGrade: 'Grade 5.0 (Vibrant Wash Durability)',
    features: [
      'Stain-Release Coated against Grease & Liquid Spills',
      'Extra-Long 40" Wraparound Waist Ties',
      'Dual Divided Kangaroo Pockets + Order Pad Slot',
      'Adjustable Neck Strap with Antique Brass Buckle'
    ],
    sizes: ['Full Bib (Length 34", Width 30")', 'Half Bistro Waist (Length 24", Width 30")'],
    customizations: [
      'Screen Printed or Embroidered Restaurant Monogram',
      'Genuine Leather Straps with Brass Snap Hooks',
      'Contrast Stitching or Webbing Tape',
      'Dedicated Corkscrew / Bottle Opener Loop'
    ],
    modelImage: '/uniforms/bistro-apron.jpg',
    swatchImage: '/uniforms/hospitality-main.png',
    gallery: [
      '/uniforms/bistro-apron.jpg',
      '/uniforms/hospitality-main.png'
    ],
    shades: [
      { name: 'Cafe Jet Black', hex: '#18181B', code: 'BA-BLK' },
      { name: 'Raw Natural Canvas', hex: '#E7E5E4', code: 'BA-NAT' },
      { name: 'Coffee Mocha Brown', hex: '#451A03', code: 'BA-BRN' },
      { name: 'Denim Indigo Blue', hex: '#1E3A8A', code: 'BA-DEN' },
      { name: 'Forest Green', hex: '#14532D', code: 'BA-GRN' }
    ],
    recommendedFor: ['Baristas & Coffee Shops', 'Fine Dining Servers', 'Sommeliers & Bartenders', 'Artisan Delis & Bakeries'],
    stockRolls: 120,
    specs: [
      { label: 'Pocket Strength', value: 'Reinforced 4-Point Bar-Tack' },
      { label: 'Tie Webbing', value: 'Heavyweight Tubular Herringbone' },
      { label: 'Wash Cycles', value: '150+ Industrial Commercial Washes' },
      { label: 'Hardware', value: 'Corrosion-Free Antiqued Brass' }
    ]
  },
  {
    id: 'hosp-utility-caps-bandanas',
    name: 'Utility Caps & Bandanas',
    code: 'HSK-04',
    category: 'Hospitality & Kitchen',
    categoryId: 'hospitality',
    subtitle: 'Breathable Kitchen Skull Caps, Chef Bandanas & Food Safety Headwear',
    description: 'Hygienic kitchen and food-preparation headwear compliant with FSSAI hygiene regulations. Includes skull caps with breathable crown mesh, adjustable triangular bandanas, and bouffant caps equipped with sweat-absorbent terry forehead bands.',
    composition: '65% Poly / 35% Cotton Poplin + Micro Moisture Mesh',
    weave: 'Air-Vented Lightweight Poplin',
    gsm: 150,
    widthInches: 58,
    colorFastnessGrade: 'Grade 5.0 (Sweat & Bleach Resistant)',
    features: [
      'Terrycloth Forehead Sweatband for Shift Comfort',
      'Breathable Crown Mesh Panel for Heat Dissipation',
      'Adjustable Tie-Back or Elastic Comfort Band',
      'Compliant with Food Safety & Hygiene Guidelines'
    ],
    sizes: ['Universal Adjustable (Tie-Back / Elastic)'],
    customizations: [
      'Custom Embroidered Restaurant Name on Front Brim',
      'Full-Color Sublimated Custom Pattern Print',
      'Color-Coded Bands for Kitchen Station Ranks',
      'Contrast Piping or Edge Trim'
    ],
    modelImage: '/uniforms/hospitality-main.png',
    swatchImage: '/uniforms/hospitality-main.png',
    gallery: [
      '/uniforms/hospitality-main.png'
    ],
    shades: [
      { name: 'Kitchen Crisp White', hex: '#FFFFFF', code: 'UC-WHT' },
      { name: 'Executive Black', hex: '#18181B', code: 'UC-BLK' },
      { name: 'Bistro Red Plaid', hex: '#991B1B', code: 'UC-RED' },
      { name: 'Navy & White Check', hex: '#1E3A8A', code: 'UC-CHK' }
    ],
    recommendedFor: ['Commercial Kitchen Chefs & Prep Line', 'Bakery Operators', 'Food Processing Facilities', 'Catering Staff'],
    stockRolls: 150,
    specs: [
      { label: 'Sweat Absorption', value: 'High-Density Terry Inner Brow' },
      { label: 'Ventilation', value: 'Honeycomb Micro-Poly Top Mesh' },
      { label: 'Hygiene Standard', value: 'Zero Hair Exposure Containment' },
      { label: 'Weight', value: 'Ultralight 65 Grams' }
    ]
  },

  // ==========================================
  // 5. SCHOOL & COLLEGE (3 Listed Items)
  // ==========================================
  {
    id: 'school-accessories',
    name: 'Accessories',
    code: 'SCH-01',
    category: 'School & College',
    categoryId: 'school',
    subtitle: 'Institutional Woven Ties, Adjustable Brass-Buckle Belts, Crest Badges & Socks',
    description: 'Complete institutional uniform accessories program for schools, academies, and universities. Includes high-density jacquard woven crest ties, durable nylon belts with embossed metal buckles, embroidered school blazer crest patches, and cushioned anti-odor combed cotton socks.',
    composition: 'Microfiber Woven Jacquard / Heavy Cotton Webbing / Combed Cotton',
    weave: 'High-Density Jacquard & Webbing',
    gsm: 200,
    widthInches: 58,
    colorFastnessGrade: 'Grade 5.0 (Zero Color Bleed Guarantee)',
    features: [
      'Custom School Logo Jacquard Weaving & Gold Thread Crests',
      'Heavy-Duty Nickel/Brass Buckles with Laser Logo Etch',
      'Double-Cushioned Reinforced Heel & Toe School Socks',
      'Hook-and-Loop or Traditional Tie Knot Options'
    ],
    sizes: ['Custom School Specs (Primary / Middle / High School / College)'],
    customizations: [
      'Custom Institutional Coat of Arms Woven on Ties',
      'School Name Embossed on Belt Metal Buckles',
      'Metallic Gold/Silver Bullion Embroidered Blazer Patches',
      'House-Color Striped Socks with School Initials'
    ],
    modelImage: '/uniforms/school-accessories.jpg',
    swatchImage: '/uniforms/school-main.jpg',
    gallery: [
      '/uniforms/school-accessories.jpg',
      '/uniforms/school-main.jpg'
    ],
    shades: [
      { name: 'School Royal Navy & Gold', hex: '#1E3A8A', code: 'AC-NVY' },
      { name: 'Maroon & Silver Stripe', hex: '#881337', code: 'AC-MRN' },
      { name: 'Bottle Green & Yellow', hex: '#065F46', code: 'AC-GRN' },
      { name: 'Traditional Black & Red', hex: '#18181B', code: 'AC-BLK' }
    ],
    recommendedFor: ['K-12 Private & Public Schools', 'Colleges & Universities', 'School House Captains & Prefects', 'Band & Cadet Corps'],
    stockRolls: 200,
    specs: [
      { label: 'Tie Weave', value: 'High-Density 1200-Needle Jacquard' },
      { label: 'Belt Webbing', value: 'Military Spec Poly-Canvas 1.25"' },
      { label: 'Badge Thread', value: 'Colorfast Madeira Poly-Neon' },
      { label: 'Sock Yarn', value: '80/20 Combed Cotton Lycra Spandex' }
    ]
  },
  {
    id: 'school-uniform',
    name: 'Uniform',
    code: 'SCH-02',
    category: 'School & College',
    categoryId: 'school',
    subtitle: 'Yarn-Dyed Check Shirts, Matty Gabardine Trousers, Skirts & Pinafores',
    description: 'The national benchmark for enduring school uniforms. Woven with double-twisted yarn to resist pilling, knee tears, and color degradation across full academic years. Features heat-set permanent knife pleats on skirts and stain-resistant treatment on shirts.',
    composition: '67% Polyester / 33% Cotton (Shirting) & 65% Poly / 35% Viscose (Matty Trousers)',
    weave: 'Yarn-Dyed Woven Checks, Tartan Plaid & 2x2 Matty Gabardine',
    gsm: 160,
    widthInches: 58,
    colorFastnessGrade: 'Grade 5.0 (Xenon Light & 100+ Industrial Washes)',
    features: [
      'Guaranteed Zero Color Bleed or Fading in Sun',
      'Reinforced Double-Stitched Knee Points & Inseams',
      'Heat-Set Permanent Pleat Retention on Skirts',
      'Soil-Release Finish for Easy Playground Stain Washing'
    ],
    sizes: ['Size 20 to 42 (Age 4 to 18 Years) & Custom College Sizes'],
    customizations: [
      'Custom Pattern Development (Check & Plaid Color Matching)',
      'School Embroidered Monogram on Pocket / Collar',
      'Inner Elastic Adjuster Waistband for Growing Kids',
      'Matching Pinafores, Tunic & Skort Designs'
    ],
    modelImage: '/uniforms/school-main.jpg',
    swatchImage: '/uniforms/school-main.jpg',
    gallery: [
      '/uniforms/school-main.jpg'
    ],
    shades: [
      { name: 'Navy & Sky Blue Check', hex: '#1E3A8A', code: 'SC-NVY' },
      { name: 'Red & Navy Scottish Tartan', hex: '#991B1B', code: 'SC-RED' },
      { name: 'Bottle Green & White Plaid', hex: '#065F46', code: 'SC-GRN' },
      { name: 'Maroon & Cream Check', hex: '#831843', code: 'SC-MRN' },
      { name: 'Grey Pincheck Shirting', hex: '#4B5563', code: 'SC-GRY' }
    ],
    recommendedFor: ['Primary & Secondary Schools', 'Higher Secondary Colleges', 'Boarding Schools & Residential Campuses'],
    stockRolls: 180,
    specs: [
      { label: 'Tensile Strength', value: '1100N Warp / Weft Anti-Tear' },
      { label: 'Pilling Test', value: 'Grade 5.0 (Zero Bobbling)' },
      { label: 'Shrinkage Max', value: '< 1.0% Controlled Compacted' },
      { label: 'Safety Standards', value: 'Skin-Safe Non-Toxic Inks' }
    ]
  },
  {
    id: 'school-sportswear',
    name: 'SportsWear',
    code: 'SCH-03',
    category: 'School & College',
    categoryId: 'school',
    subtitle: 'Moisture-Wicking House Color Sports Tees, Tracksuits & Athletic Shorts',
    description: 'High-performance athletic apparel engineered for school sports days, house tournaments, and daily PE drills. Knit from quick-dry breathable interlock fabric with 4-way stretch, flatlock anti-chafing seams, and color-coded house piping.',
    composition: '100% Micro-Polyester Moisture-Wicking Interlock (Bio-Washed)',
    weave: 'Air-Channel Dry-Fit Knitted Interlock',
    gsm: 175,
    widthInches: 58,
    colorFastnessGrade: 'Grade 5.0 (High Sun & Sweat Perspiration Fastness)',
    features: [
      'Quick-Dry Sweat Evaporation Technology',
      'Flatlock Stitching Prevents Skin Chafing',
      'Deep Elasticated Drawstring Trackpants with Zipper Hem',
      'All-Over Sublimation House Crest & Mascot Printing'
    ],
    sizes: ['Age 4 to 18 Years (Kids 22-34) & Adult S to 4XL'],
    customizations: [
      'Vibrant House Color Coding (Red, Blue, Green, Yellow)',
      'Sublimated School Emblem & Player Squad Numbers',
      'Matching Dual-Tone Tracksuit Jackets with Ribbed Cuffs',
      'Reflective Safety Strips for Morning Athletic Drills'
    ],
    modelImage: '/uniforms/school-sportswear.jpg',
    swatchImage: '/uniforms/school-main.jpg',
    gallery: [
      '/uniforms/school-sportswear.jpg',
      '/uniforms/school-main.jpg'
    ],
    shades: [
      { name: 'House Ruby Red', hex: '#DC2626', code: 'SP-RED' },
      { name: 'House Sapphire Blue', hex: '#2563EB', code: 'SP-BLU' },
      { name: 'House Emerald Green', hex: '#16A34A', code: 'SP-GRN' },
      { name: 'House Sunburst Yellow', hex: '#EAB308', code: 'SP-YEL' },
      { name: 'Athletic Carbon Black', hex: '#18181B', code: 'SP-BLK' }
    ],
    recommendedFor: ['School Annual Sports Days', 'Inter-School Athletic Tournaments', 'College Football & Basketball Teams', 'Physical Education Kits'],
    stockRolls: 140,
    specs: [
      { label: 'Moisture Vapor Rate', value: '4500 g/m²/24hr Rapid Dry' },
      { label: 'Knit Structure', value: 'Micro-Porous Birdseye Interlock' },
      { label: 'Seam Construction', value: '4-Needle 6-Thread Flatlock' },
      { label: 'UV Sun Defense', value: 'UPF 40+ Certified Protection' }
    ]
  }
];

export const UNIFORM_CERTIFICATIONS = [
  {
    title: 'ISO 9001:2015 Certified Mill',
    desc: 'Strict quality control from yarn spinning and weaving to final stentering finish.',
    icon: 'ShieldCheck'
  },
  {
    title: 'Skin-Safe Tested Inks',
    desc: 'Skin-friendly, hypoallergenic dyes safe for kindergarten, school and hospital personnel.',
    icon: 'Sparkles'
  },
  {
    title: 'Grade 4-5 Color Fastness',
    desc: 'Certified zero color bleeding in high sun exposure, perspiration, and industrial machines.',
    icon: 'Award'
  },
  {
    title: '100+ Industrial Wash Cycles',
    desc: 'Anti-pilling test verified to maintain crisp appearance across multiple academic/work years.',
    icon: 'RotateCw'
  }
];

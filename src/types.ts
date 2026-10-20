export type CategoryType =
  | 'Cotton'
  | 'Viscose'
  | 'Silk'
  | 'Linen'
  | 'Rayon'
  | 'Modal'
  | 'Polyester'
  | 'Fabric Blends'
  | 'Bamboo'
  | 'Organic Cotton'
  | 'Tencel'
  | 'Denim'
  | 'Organza'
  | string;

export type SizeOptionType = 'swatch_test' | 'swatch_big' | 'meter' | 'apparel';

export type Mockup3DMode = 'bolt' | 'dress' | 'cushion' | 'curtain' | 'shirt' | 'canvas' | 'swatch';

export type FabricTextureType = 'cotton_matte' | 'silk_sheen' | 'linen_weave' | 'satin_gloss' | 'french_terry' | 'pique_knit';

export type StudioLightingType = 'studio' | 'daylight' | 'sunset' | 'runway' | 'neon';

export type CurrencyCode = 'INR' | 'USD' | 'EUR' | 'GBP' | 'AUD';

export type ApparelCategory = 'All' | 'T-Shirts' | 'Polo Shirts' | 'Hoodies' | 'Kids' | 'Sports Kit';

export interface ApparelColor {
  name: string;
  hex: string;
  image?: string;
}

export type PrintPlacement =
  | 'none'
  | 'pocket_left'
  | 'chest_center'
  | 'a4_front'
  | 'a3_front'
  | 'full_back'
  | 'front_and_back'
  | 'all_over_sublimation';

export interface JerseyPlayerEntry {
  id: string;
  name: string;
  number: string;
  size: string;
}

export interface JerseyCustomization {
  sportType: string;
  teamName: string;
  fontStyle: string;
  numberColor: string;
  textColor: string;
  sponsorLogoUrl?: string;
  playerList: JerseyPlayerEntry[];
}

export interface FabricVariantOption {
  name: string;
  gsm: number;
  fabric: string;
  price: number;
  plusSizeSurcharge?: { size3XL: number; size4XL: number };
}

export interface ApparelProduct {
  id: string;
  name: string;
  slug: string;
  category: ApparelCategory;
  description: string;
  basePrice: number;
  gsm: number;
  fit: string;
  fabric: string;
  minOrderQty: number;
  colors: ApparelColor[];
  sizes: string[];
  mockupImages: {
    front: string;
    back?: string;
  };
  printTechniques: string[];
  featured?: boolean;
  badge?: string;
  rating?: number;
  reviewsCount?: number;
  fabricVariants?: FabricVariantOption[];
}



export interface WholesaleTier {
  minMeters: number;
  maxMeters?: number;
  discountPercent: number;
  label: string;
}

export interface ExtractedImageInfo {
  originalUrl: string;
  extractedImageUrl: string;
  title?: string;
  width: number;
  height: number;
  format: string;
  fileSizeMb: number;
  palette: string[];
  pantoneMatches: { name: string; hex: string; code: string }[];
}

export interface SwatchBook {
  id: string;
  name: string;
  tagline: string;
  price: number;
  originalPrice: number;
  image: string;
  fabricsCount: number;
  includedFabrics: string[];
  badge: string;
  description: string;
}

export interface MasterCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  image?: string;
  itemCount?: number;
}

export interface MasterFabric {
  id: string;
  name: string;
  categoryId: string;
  categoryName: string;
  defaultImage: string;
}

export interface MasterGsmWeight {
  id: string;
  gsmValue: number;
  label: 'Lightweight' | 'Medium' | 'Heavy';
}

export interface MasterFabricSizeFormat {
  id: string;
  name: string;
  dimensions: string;
  pricingType: 'Fixed Price' | 'Per Meter';
}

export interface MasterFabricVariantBase {
  id: string;
  name: string;
  baseColor: string;
  finishType: string;
  priceModifier: number;
}

export interface Product {
  id: string;
  sku?: string; // e.g. "TIMBLS350", "TIMVMC150"
  name: string;
  category: CategoryType;
  category_id?: string;
  fabric_id?: string;
  gsm_id?: string;
  size_format_ids?: string[];
  variant_ids?: string[];
  gsm: number; // e.g. 75, 110, 140, 220
  width: string; // e.g. "145 cm", "140 cm", "44 inches (112 cm)"
  count: string; // Thread count e.g. "30x30", "60s x 60s", "NAxNA"
  cons?: string; // Construction / density e.g. "68*48", "NA*NA", "92*88"
  color: string; // e.g. "White", "White/RFD", "Natural Soft White"
  colorCode?: string; // e.g. "#f8f5ee"
  price_per_meter: number; // e.g. 480 INR
  swatch_test_price: number; // e.g. 200 INR (20x20 cm)
  swatch_big_price: number; // e.g. 500 INR (75x100 cm)
  print_surcharge_per_meter: number;
  images: string[];
  image_url?: string;
  description: string;
  weave_type: string; // e.g. "Plain Weave", "Twill", "Satin", "Cambric"
  composition: string; // e.g. "100% Combed Cotton", "100% Pure Organic Silk"
  in_stock: boolean;
  featured?: boolean;
  bestseller?: boolean;
  rating?: number;
  reviews_count?: number;
  // Enhanced Wholesale & Technical Specs (Fabriclore & TexIndiaMart)
  certifications?: string[];
  wholesaleTiers?: WholesaleTier[];
  shrinkage?: string;
  transparency?: 'Opaque' | 'Semi-Sheer' | 'Sheer';
  stretch?: 'No Stretch' | 'Slight Stretch' | '4-Way Stretch';
  feel?: string;
  applications?: string[];
  moqMeters?: number;
}

export interface Category {
  id: string;
  name: CategoryType;
  slug: string;
  image: string;
  description: string;
  itemCount: number;
}

export type LayoutType = 'single' | 'repeat_grid' | 'half_drop' | 'brick_repeat' | 'mirror_repeat';

export interface PreloadedDesign {
  id: string;
  name: string;
  category: string;
  imageUrl: string;
  widthPx?: number;
  heightPx?: number;
  active: boolean;
}

export interface AdminCustomizerSettings {
  dpiWarningThreshold: number;
  dpiHighThreshold: number;
  enabledLayouts: {
    single: boolean;
    repeat_grid: boolean;
    half_drop: boolean;
    brick_repeat?: boolean;
    mirror_repeat: boolean;
  };
  preloadedDesigns: PreloadedDesign[];
}

export interface PrintOptions {
  requiresPrint: boolean;
  designName?: string;
  designUrl?: string; // base64 or URL
  designFileType?: string; // 'image/jpeg' | 'image/png' | 'image/tiff'
  designFileSizeMb?: number;
  layoutType?: LayoutType;
  rotation?: 0 | 90 | 180 | 270;
  scalePercentage?: number; // 10 to 300
  dpi?: number;
  dpiQuality?: 'Low Quality' | 'Good Quality' | 'High Quality';
  repeatType?: 'straight' | 'drop' | 'grid' | 'centered';
  inkType?: 'reactive_digital' | 'pigment' | 'disperse';
  extractedPalette?: string[];
  notes?: string;
}

export interface CartItem {
  id: string; // unique cart item id
  productId: string;
  product: Product;
  sizeType: SizeOptionType;
  meters?: number; // if sizeType === 'meter'
  quantity: number;
  printOptions: PrintOptions;
  calculatedPricePerUnit: number;
  itemTotalPrice: number;
  selectedFabricVariant?: string;
  // Apparel Specific
  apparelProduct?: ApparelProduct;
  apparelColor?: ApparelColor;
  sizeBreakdown?: Record<string, number>;
  printPlacement?: PrintPlacement;
  customPreviewUrl?: string;
  jerseyCustomization?: JerseyCustomization;
}

export interface Address {
  id: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'user' | 'admin';
  addresses: Address[];
  createdAt: string;
}


export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  gsm: number;
  width: string;
  color: string;
  sizeType: SizeOptionType;
  sizeLabel: string;
  meters?: number;
  quantity: number;
  pricePerUnit: number;
  totalPrice: number;
  printOptions: PrintOptions;
  sizeBreakdown?: Record<string, number>;
  customPreviewUrl?: string;
  apparelProduct?: ApparelProduct;
  jerseyCustomization?: JerseyCustomization;
}

export type OrderStatus = 'Pending' | 'Processing' | 'Printing' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface Order {
  id: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: Address;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  tax: number;
  totalAmount: number;
  paymentMethod: 'Razorpay' | 'Card' | 'UPI' | 'COD';
  paymentStatus: 'Paid' | 'Pending' | 'Failed';
  paymentId?: string;
  orderStatus: OrderStatus;
  trackingNumber?: string;
  notes?: string;
  createdAt: string;
}

export interface ProductFilterState {
  searchQuery: string;
  category: string; // 'All' or specific CategoryType
  minPrice: number;
  maxPrice: number;
  gsmRanges: string[];
  colors: string[];
  printCapableOnly: boolean;
  certifiedOnly?: boolean;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'newest' | 'rating';
}

export interface AdminAnalytics {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  recentOrders: Order[];
  salesByCategory: { category: string; sales: number }[];
  monthlyRevenue: { month: string; revenue: number }[];
}

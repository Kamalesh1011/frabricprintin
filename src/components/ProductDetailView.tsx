import React, { useState, useEffect, useMemo } from 'react';
import {
  Printer,
  Upload,
  Check,
  Heart,
  ShieldCheck,
  Truck,
  Sparkles,
  Info,
  AlertCircle,
  Plus,
  Minus,
  Ruler,
  Grid,
  Layers,
  Sliders,
  RotateCw,
  ArrowRight,
  ChevronDown,
  Globe,
  Link2,
  Search,
  ExternalLink,
  Edit2,
  MousePointerClick,
  HelpCircle,
  Eye,
  Maximize2,
  FileCheck,
  CheckCircle2,
  FileText,
  Share2,
  X,
  Star,
  Scissors,
  Lock,
  Package,
  Tag,
  RefreshCw
} from 'lucide-react';
import { Product, SizeOptionType, PreloadedDesign } from '../types';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { uploadDesignFile, extractImageFromUrl } from '../services/api';
import { FabricCmRulerCanvas } from './FabricCmRulerCanvas';
import { SmartUrlImageExtractorModal } from './SmartUrlImageExtractorModal';
import { PreloadedDesignModal } from './PreloadedDesignModal';
import { LiveDesignMockupCanvas, MockupSurfaceType } from './LiveDesignMockupCanvas';
import { FabricComparisonModal } from './FabricComparisonModal';
import { INITIAL_PRODUCTS } from '../data/mockData';

interface ProductDetailViewProps {
  product: Product;
  allProducts?: Product[];
  onSelectProduct?: (product: Product) => void;
  onGoToCheckout: () => void;
  onOpenBulkInquiry: () => void;
  onBackToFabrics: () => void;
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({
  product,
  allProducts,
  onSelectProduct,
  onGoToCheckout,
  onOpenBulkInquiry,
  onBackToFabrics
}) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [currentProduct, setCurrentProduct] = useState<Product>(product);

  useEffect(() => {
    setCurrentProduct(product);
  }, [product]);

  const availableFabrics = (allProducts && allProducts.length > 0 ? allProducts : INITIAL_PRODUCTS).filter(
    (p) => !p.category?.toLowerCase().includes('t-shirt') && !p.category?.toLowerCase().includes('apparel')
  );

  // Surface Visualization Mode
  const [activeSurface, setActiveSurface] = useState<MockupSurfaceType>('swatch_ruler');

  // Modals state
  const [isPreloadedModalOpen, setIsPreloadedModalOpen] = useState(false);
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [isFabricSelectModalOpen, setIsFabricSelectModalOpen] = useState(false);
  const [isLargeFileModalOpen, setIsLargeFileModalOpen] = useState(false);
  const [isComparatorOpen, setIsComparatorOpen] = useState(false);
  const [fabricSearchQuery, setFabricSearchQuery] = useState('');

  // Size & Customization State
  const [selectedSizeType, setSelectedSizeType] = useState<SizeOptionType>('meter');
  const [meters, setMeters] = useState<number>(1);
  const [termsAccepted, setTermsAccepted] = useState<boolean>(true);
  const [buyingOption, setBuyingOption] = useState<'printed' | 'plain'>('printed');
  const [activeInfoTab, setActiveInfoTab] = useState<'order' | 'specs' | 'guidelines' | 'wholesale'>('order');

  // Artwork state
  const [uploadedDesignUrl, setUploadedDesignUrl] = useState<string>('');
  const [uploadedDesignName, setUploadedDesignName] = useState<string>('');
  const [uploadedDesignSizeMb, setUploadedDesignSizeMb] = useState<number>(0);
  const [repeatType, setRepeatType] = useState<'grid' | 'drop' | 'straight' | 'centered'>('grid');
  const [scalePercentage, setScalePercentage] = useState<number>(100);
  const [imagePixelWidth, setImagePixelWidth] = useState<number>(3000);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string>('');
  const [showRulerOverlay, setShowRulerOverlay] = useState<boolean>(true);
  const [rulerUnit, setRulerUnit] = useState<'inches' | 'cm'>('inches');

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const isWishlisted = isInWishlist(currentProduct.id);

  // Handle image load to extract dimensions
  useEffect(() => {
    if (uploadedDesignUrl) {
      const img = new Image();
      img.onload = () => {
        if (img.naturalWidth > 0) {
          setImagePixelWidth(img.naturalWidth);
        }
      };
      img.src = uploadedDesignUrl;
    }
  }, [uploadedDesignUrl]);

  // DPI calculation
  const calculatedDpi = useMemo(() => {
    let baseWidthInches = 44;
    const inchMatch = currentProduct.width?.match(/(\d+)\s*inch/i);
    if (inchMatch && inchMatch[1]) {
      baseWidthInches = parseInt(inchMatch[1], 10);
    }
    const scaledInches = baseWidthInches * (scalePercentage / 100);
    const dpi = Math.round(imagePixelWidth / Math.max(1, scaledInches));
    return Math.min(600, Math.max(72, dpi));
  }, [currentProduct.width, scalePercentage, imagePixelWidth]);

  // File upload handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 50 * 1024 * 1024) {
      setIsLargeFileModalOpen(true);
      return;
    }

    setUploadError('');
    setIsUploading(true);

    try {
      const res = await uploadDesignFile(file);
      setUploadedDesignUrl(res.url);
      setUploadedDesignName(file.name);
      const sizeInMb = file.size / (1024 * 1024);
      setUploadedDesignSizeMb(Number(sizeInMb.toFixed(2)));
    } catch (err: any) {
      setUploadError(err.message || 'Failed to upload artwork file.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSelectPreloaded = (design: { name: string; url: string; widthPx?: number; heightPx?: number }) => {
    setUploadedDesignUrl(design.url);
    setUploadedDesignName(design.name);
    setUploadedDesignSizeMb(3.5);
    if (design.widthPx) setImagePixelWidth(design.widthPx);
    setUploadError('');
    setIsPreloadedModalOpen(false);
  };

  const handleApplyExtractedImage = (imgInfo: {
    url: string;
    name: string;
    widthPx: number;
    heightPx: number;
    fileSizeMb: number;
  }) => {
    setUploadedDesignUrl(imgInfo.url);
    setUploadedDesignName(imgInfo.name || 'Web_Extracted_Artwork.png');
    setUploadedDesignSizeMb(imgInfo.fileSizeMb || 2.5);
    if (imgInfo.widthPx) setImagePixelWidth(imgInfo.widthPx);
    setUploadError('');
    setIsGoogleModalOpen(false);
  };

  // Price Calculation with Wholesale Tiers
  const calculatedUnitPrice = useMemo(() => {
    if (selectedSizeType === 'swatch_test') {
      return currentProduct.swatch_test_price || 180;
    }
    if (selectedSizeType === 'swatch_big') {
      return currentProduct.swatch_big_price || 450;
    }
    const basePrice = currentProduct.price_per_meter || 420;
    let discount = 0;
    if (meters >= 101) discount = 0.25;
    else if (meters >= 51) discount = 0.18;
    else if (meters >= 21) discount = 0.10;
    return Math.round(basePrice * (1 - discount));
  }, [currentProduct, selectedSizeType, meters]);

  const calculatedTotalPrice = useMemo(() => {
    if (selectedSizeType === 'meter') {
      return calculatedUnitPrice * meters;
    }
    return calculatedUnitPrice;
  }, [calculatedUnitPrice, selectedSizeType, meters]);

  const handleAddToCart = (directCheckout = false) => {
    if (!termsAccepted) {
      setUploadError('Please accept the Terms & Conditions to proceed.');
      return;
    }

    const designTitle = uploadedDesignName || 'Standard Blank Textile Base';
    const finalDesignUrl = uploadedDesignUrl || currentProduct.images[0] || '/mockups/white_fabric_folded_swatches.jpg';

    addToCart(
      currentProduct,
      selectedSizeType,
      meters,
      {
        requiresPrint: Boolean(uploadedDesignUrl),
        designUrl: finalDesignUrl,
        designName: designTitle,
        repeatType: repeatType as any,
        scalePercentage: scalePercentage,
        dpi: calculatedDpi
      },
      meters,
      'Standard Base'
    );

    if (directCheckout) {
      onGoToCheckout();
    }
  };

  // Filtered fabrics for modal
  const filteredModalFabrics = useMemo(() => {
    if (!fabricSearchQuery.trim()) return availableFabrics;
    const q = fabricSearchQuery.toLowerCase();
    return availableFabrics.filter(
      (f) =>
        f.name.toLowerCase().includes(q) ||
        f.category.toLowerCase().includes(q) ||
        (f.sku && f.sku.toLowerCase().includes(q)) ||
        f.gsm.toString().includes(q)
    );
  }, [availableFabrics, fabricSearchQuery]);

  // Active base image for fabric swatch
  const baseFabricImage = currentProduct.images[0] || '/mockups/tcftbw650_swatch.jpg';

  return (
    <div className="min-h-screen py-8 text-[#0F100F] dark:text-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Top Breadcrumb Navigation & Quick Tools */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-gray-500 dark:text-gray-400">
          <button
            onClick={onBackToFabrics}
            className="hover:text-black dark:hover:text-white font-bold flex items-center space-x-1.5 transition"
          >
            <span>← Back to Fabric Collection</span>
          </button>
          
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => setIsComparatorOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-[#2D325A] dark:text-blue-300 font-bold border border-blue-200 dark:border-blue-800/40 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition flex items-center space-x-1.5"
            >
              <span>⚖️ Compare with other fabrics</span>
            </button>

            <span className="font-semibold text-gray-700 dark:text-gray-300">SKU: {currentProduct.sku || `TIM${currentProduct.category.slice(0,3).toUpperCase()}${currentProduct.gsm}`}</span>
            <span>•</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">Surat Mill Direct</span>
          </div>
        </div>

        {/* Main 2-Column Customizer Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ════════════════════════════════════════════════════════════════
              LEFT COLUMN: LIVE 3D SURFACE VISUALIZER (SWATCH, TEE, DRESS, BOLT, HOODIE, TOTE)
             ════════════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-6 space-y-4">
            
            {/* Live Design Mockup Canvas with Object Wrapping, Drag Move & Small/Big Zoom */}
            <LiveDesignMockupCanvas
              product={currentProduct}
              uploadedDesignUrl={uploadedDesignUrl}
              repeatType={repeatType}
              scalePercentage={scalePercentage}
              calculatedDpi={calculatedDpi}
              showRulerOverlay={showRulerOverlay}
              setShowRulerOverlay={setShowRulerOverlay}
              buyingOption={buyingOption}
              activeSurface={activeSurface}
              setActiveSurface={setActiveSurface}
              onSelectSampleDesign={(url, name) => {
                setUploadedDesignUrl(url);
                setUploadedDesignName(name);
                setBuyingOption('printed');
              }}
            />

            {/* Quick Comparator Banner Callout */}
            <div className="p-3.5 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-2xl border border-blue-200/80 dark:border-blue-800/30 flex items-center justify-between text-xs">
              <div className="space-y-0.5">
                <span className="font-extrabold text-blue-950 dark:text-blue-200 block">
                  Not sure if {currentProduct.name} is right for your garment?
                </span>
                <span className="text-[11px] text-blue-700 dark:text-blue-400">
                  Compare GSM, stretch, yarn count and drape with other fabrics.
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsComparatorOpen(true)}
                className="px-3 py-1.5 bg-[#2D325A] text-white text-[11px] font-bold rounded-xl hover:bg-[#1E2345] transition shrink-0 ml-2 shadow-xs"
              >
                Compare Specs
              </button>
            </div>

          </div>

          {/* ════════════════════════════════════════════════════════════════
              RIGHT COLUMN: AMAZON-GRADE SIMPLICITY BUY BOX & SPECS TABS
             ════════════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-6 bg-white dark:bg-[#1A1C1E] rounded-3xl border border-gray-200 dark:border-white/10 p-5 sm:p-7 shadow-sm space-y-5">
            
            {/* 1. Amazon-style Brand, Title, Rating, & In Stock Row */}
            <div className="border-b border-gray-100 dark:border-white/10 pb-4 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#007185] dark:text-[#56D7EA] hover:underline cursor-pointer">
                  Visit the FabricPrint Certified Mill Direct Store
                </span>
                <span className="font-mono text-[11px] font-bold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-white/10 px-2 py-0.5 rounded">
                  SKU: {currentProduct.sku || 'TCFTBW650'}
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl font-extrabold text-[#0F1111] dark:text-white leading-tight">
                {currentProduct.name} ({currentProduct.gsm} GSM • {currentProduct.width})
              </h1>

              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                <div className="flex items-center space-x-1 text-amber-500">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current text-[#DE7921]" />
                    ))}
                  </div>
                  <span className="font-bold text-gray-900 dark:text-white ml-1">
                    {currentProduct.rating || 4.9}
                  </span>
                </div>
                <span className="text-gray-300 dark:text-gray-600">|</span>
                <span className="text-[#007185] dark:text-[#56D7EA] hover:underline cursor-pointer">
                  {currentProduct.reviews_count || 142} ratings
                </span>
                <span className="text-gray-300 dark:text-gray-600">|</span>
                <span className="text-gray-600 dark:text-gray-400 font-medium">
                  500+ meters sold this month
                </span>
              </div>
            </div>

            {/* 2. Amazon-style Price & Deal Block */}
            <div className="space-y-1.5 bg-gray-50/80 dark:bg-[#141517] p-4 rounded-2xl border border-gray-200/80 dark:border-white/10">
              <div className="flex items-baseline space-x-2">
                <span className="text-red-700 dark:text-red-400 text-lg font-light">-20%</span>
                <span className="text-2xl sm:text-3xl font-black text-[#0F1111] dark:text-white tracking-tight">
                  ₹{calculatedTotalPrice.toFixed(2)}
                </span>
                {selectedSizeType === 'meter' && meters > 1 && (
                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                    (₹{calculatedUnitPrice.toFixed(2)} / meter)
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                <span>M.R.P.: <span className="line-through">₹{Math.round(calculatedTotalPrice * 1.25)}</span></span>
                <span>•</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-bold">Inclusive of all taxes</span>
              </div>

              {/* Delivery Promise */}
              <div className="pt-2 text-xs text-gray-800 dark:text-gray-200 flex items-start space-x-2 border-t border-gray-200/60 dark:border-white/5 mt-2">
                <Truck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-gray-900 dark:text-white">FREE delivery</span> on orders above ₹999.
                  <span className="block text-gray-500 dark:text-gray-400 text-[11px]">
                    Direct dispatch from Surat Mill within <strong>48-72 hours</strong>.
                  </span>
                </div>
              </div>
            </div>

            {/* 3. Buying Configuration Choice (Printed vs Plain RFD) */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                Choose Printing Option:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setBuyingOption('printed')}
                  className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                    buyingOption === 'printed'
                      ? 'border-[#2D325A] bg-[#2D325A]/5 dark:bg-blue-950/20 ring-2 ring-[#2D325A]'
                      : 'border-gray-200 dark:border-white/10 hover:border-gray-300'
                  }`}
                >
                  <span className="text-xs font-bold text-gray-900 dark:text-white flex items-center space-x-1.5">
                    <span>🎨 Custom Printed Fabric</span>
                  </span>
                  <span className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                    Upload your design or pick from catalog
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setBuyingOption('plain');
                    setUploadedDesignUrl('');
                    setUploadedDesignName('');
                  }}
                  className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                    buyingOption === 'plain'
                      ? 'border-[#2D325A] bg-[#2D325A]/5 dark:bg-blue-950/20 ring-2 ring-[#2D325A]'
                      : 'border-gray-200 dark:border-white/10 hover:border-gray-300'
                  }`}
                >
                  <span className="text-xs font-bold text-gray-900 dark:text-white flex items-center space-x-1.5">
                    <span>🧵 Plain / RFD Base Fabric</span>
                  </span>
                  <span className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                    Pure white/natural, ready for sewing/dyeing
                  </span>
                </button>
              </div>
            </div>

            {/* 4. Artwork Section (When in Printed Mode) */}
            {buyingOption === 'printed' && (
              <div className="p-4 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-[#15171A] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-gray-800 dark:text-gray-200 flex items-center space-x-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#AC7900]" />
                    <span>Attach Your Print Artwork</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsGoogleModalOpen(true)}
                    className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center space-x-1"
                  >
                    <Globe className="w-3 h-3" />
                    <span>Google/URL Extractor</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="py-2.5 px-3 bg-[#B91C1C] hover:bg-[#991B1B] text-white font-bold text-xs rounded-xl transition shadow-xs flex items-center justify-center space-x-1.5"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload file</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsPreloadedModalOpen(true)}
                    className="py-2.5 px-3 bg-[#2D325A] hover:bg-[#232747] text-white font-bold text-xs rounded-xl transition shadow-xs flex items-center justify-center space-x-1.5"
                  >
                    <MousePointerClick className="w-3.5 h-3.5" />
                    <span>Select design</span>
                  </button>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".jpg,.jpeg,.png,.tiff,.tif,.psd,.pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                {/* Active Upload Card */}
                {uploadedDesignUrl ? (
                  <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-800/40 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2 truncate">
                      <img src={uploadedDesignUrl} alt="Design" className="w-8 h-8 rounded object-cover border border-emerald-300" />
                      <div className="truncate">
                        <span className="font-bold text-emerald-900 dark:text-emerald-300 block truncate max-w-[170px]">
                          {uploadedDesignName}
                        </span>
                        <span className="text-[10px] text-emerald-700 dark:text-emerald-400">
                          {calculatedDpi} DPI • Ready for reactive print
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setUploadedDesignUrl('');
                        setUploadedDesignName('');
                      }}
                      className="text-red-600 hover:underline text-[11px] font-bold ml-2 shrink-0"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">
                    💡 Tip: We recommend 150-300 DPI for ultra-crisp results (PSD, TIFF, PNG, JPG up to 50MB).
                  </p>
                )}
              </div>
            )}

            {/* 5. Amazon-style Quick Length / Meters Selector */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-extrabold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                  Select Quantity (Meters):
                </label>
                <button
                  type="button"
                  onClick={() => setIsFabricSelectModalOpen(true)}
                  className="text-[11px] font-bold text-red-600 dark:text-red-400 hover:underline flex items-center space-x-1"
                >
                  <Edit2 className="w-3 h-3" />
                  <span>Change Fabric Quality</span>
                </button>
              </div>

              {/* Quick meter chips */}
              <div className="flex flex-wrap gap-1.5">
                {[1, 2, 3, 5, 10, 20, 50].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => {
                      setSelectedSizeType('meter');
                      setMeters(m);
                    }}
                    className={`px-3 py-1.5 rounded-lg font-bold text-xs transition ${
                      selectedSizeType === 'meter' && meters === m
                        ? 'bg-[#0F1111] text-white dark:bg-white dark:text-black shadow-sm'
                        : 'bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
                    }`}
                  >
                    {m}m
                  </button>
                ))}
                
                {/* Sample Swatch Option */}
                <button
                  type="button"
                  onClick={() => setSelectedSizeType('swatch_test')}
                  className={`px-3 py-1.5 rounded-lg font-bold text-xs transition border ${
                    selectedSizeType === 'swatch_test'
                      ? 'border-[#2D325A] bg-[#2D325A] text-white'
                      : 'border-dashed border-gray-300 dark:border-white/20 text-gray-600 dark:text-gray-300 hover:bg-gray-100'
                  }`}
                >
                  📐 Sample Swatch (₹{currentProduct.swatch_test_price || 150})
                </button>
              </div>

              {/* Custom Stepper & Total Breakdown */}
              {selectedSizeType === 'meter' && (
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-[#141517] rounded-xl border border-gray-200 dark:border-white/10">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-gray-600 dark:text-gray-400">Custom Meters:</span>
                    <div className="flex items-center space-x-1 bg-white dark:bg-[#1E2023] border border-gray-300 dark:border-white/10 rounded-lg p-0.5">
                      <button
                        type="button"
                        onClick={() => setMeters(Math.max(1, meters - 1))}
                        disabled={meters <= 1}
                        className="w-6 h-6 rounded flex items-center justify-center text-gray-600 hover:bg-gray-100 dark:hover:bg-white/10 disabled:opacity-30"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <input
                        type="number"
                        min={1}
                        value={meters}
                        onChange={(e) => setMeters(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-12 text-center font-bold text-xs bg-transparent focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setMeters(meters + 1)}
                        className="w-6 h-6 rounded flex items-center justify-center text-gray-600 hover:bg-gray-100 dark:hover:bg-white/10"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <span className="text-xs font-bold text-gray-800 dark:text-gray-200">
                    Total: ₹{calculatedTotalPrice.toFixed(2)}
                  </span>
                </div>
              )}

              {/* Continuous Cut Guarantee Box */}
              <div className="flex items-center space-x-2 p-2.5 bg-blue-50/70 dark:bg-blue-950/20 rounded-xl border border-blue-200/80 dark:border-blue-800/30 text-[11px] text-blue-900 dark:text-blue-300">
                <Scissors className="w-4 h-4 text-blue-600 shrink-0" />
                <span>
                  <strong>Continuous Cut Guaranteed:</strong> Ordered {meters} {meters > 1 ? 'meters' : 'meter'} will be cut in one single uncut piece.
                </span>
              </div>
            </div>

            {/* Wholesale Tier Notice */}
            {selectedSizeType === 'meter' && (
              <div className="p-2.5 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-800/40 text-[11px] text-amber-900 dark:text-amber-300 flex items-center justify-between font-medium">
                <span>
                  {meters >= 101 ? '🏆 Mill Bulk 25% OFF active!' : meters >= 51 ? '🚀 Wholesale 18% OFF active!' : meters >= 21 ? '🎉 Wholesale 10% OFF active!' : '💡 Order 21+ meters to unlock 10% wholesale discount'}
                </span>
                <span className="font-bold">
                  {meters}m selected
                </span>
              </div>
            )}

            {/* 6. Amazon-Grade Iconic Buy Box CTAs */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={() => handleAddToCart(false)}
                className="w-full py-3 px-4 bg-[#FFD814] hover:bg-[#F7CA00] text-gray-950 font-bold text-xs uppercase tracking-wider rounded-xl transition shadow-sm flex items-center justify-center space-x-2 border border-[#FCD200]"
              >
                <Package className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>

              <button
                type="button"
                onClick={() => handleAddToCart(true)}
                className="w-full py-3 px-4 bg-[#FFA41C] hover:bg-[#FA8900] text-gray-950 font-black text-xs uppercase tracking-wider rounded-xl transition shadow-md flex items-center justify-center space-x-2 border border-[#FF8F00]"
              >
                <span>Buy Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* 7. Amazon-style Trust Assurances */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100 dark:border-white/10 text-[11px] text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-1.5">
                <Truck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Fast 48-72h Mill Dispatch</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Scissors className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>Single Continuous Piece</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>100% Tested Natural Fiber</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Lock className="w-3.5 h-3.5 text-gray-600 shrink-0" />
                <span>Secure Checkout &amp; GST Bill</span>
              </div>
            </div>

            {/* 8. Amazon-style Details & Guidelines Accordion / Tabs */}
            <div className="border-t border-gray-100 dark:border-white/10 pt-4 space-y-3">
              <div className="flex items-center space-x-2 border-b border-gray-200 dark:border-white/10 pb-2">
                {[
                  { id: 'specs', label: 'Specifications' },
                  { id: 'guidelines', label: 'Print Guidelines' },
                  { id: 'wholesale', label: 'Wholesale Tiers' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveInfoTab(tab.id as any)}
                    className={`text-xs font-bold px-2.5 py-1 rounded-lg transition ${
                      activeInfoTab === tab.id
                        ? 'bg-[#0F1111] text-white dark:bg-white dark:text-black'
                        : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {activeInfoTab === 'specs' && (
                <div className="grid grid-cols-2 gap-2 text-xs bg-gray-50 dark:bg-[#141517] p-3 rounded-xl border border-gray-100 dark:border-white/5">
                  <div><strong>GSM:</strong> {currentProduct.gsm}</div>
                  <div><strong>Width:</strong> {currentProduct.width}</div>
                  <div><strong>Count:</strong> {currentProduct.count || 'Combed 30s'}</div>
                  <div><strong>Cons:</strong> {currentProduct.cons || 'Standard'}</div>
                  <div><strong>Composition:</strong> {currentProduct.composition}</div>
                  <div><strong>Shrinkage:</strong> {currentProduct.shrinkage || '2-3%'}</div>
                </div>
              )}

              {activeInfoTab === 'guidelines' && (
                <div className="text-xs space-y-1.5 bg-gray-50 dark:bg-[#141517] p-3 rounded-xl border border-gray-100 dark:border-white/5">
                  <p>• <strong>Resolution:</strong> 150 DPI - 300 DPI for high definition clarity</p>
                  <p>• <strong>Formats:</strong> PSD, TIFF, PNG, JPEG</p>
                  <p>• <strong>Dyes:</strong> Skin-safe OEKO-TEX Standard 100 reactive digital inks</p>
                </div>
              )}

              {activeInfoTab === 'wholesale' && (
                <div className="text-xs space-y-1 bg-gray-50 dark:bg-[#141517] p-3 rounded-xl border border-gray-100 dark:border-white/5">
                  <div className="flex justify-between py-0.5"><span>1 - 20 meters:</span><span className="font-bold">Standard Price</span></div>
                  <div className="flex justify-between py-0.5"><span>21 - 50 meters:</span><span className="font-bold text-emerald-600">10% OFF</span></div>
                  <div className="flex justify-between py-0.5"><span>51 - 100 meters:</span><span className="font-bold text-emerald-600">18% OFF</span></div>
                  <div className="flex justify-between py-0.5"><span>100+ meters:</span><span className="font-bold text-emerald-600">25% OFF</span></div>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>

      {/* 📁 Modal 1: Select Fabric Picker */}
      {isFabricSelectModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1A1C1E] text-[#0F100F] dark:text-white w-full max-w-2xl rounded-3xl shadow-2xl border border-gray-200 dark:border-white/10 overflow-hidden flex flex-col max-h-[85vh]">
            
            <div className="p-5 bg-gray-50 dark:bg-[#141517] border-b border-gray-200 dark:border-white/10 flex items-center justify-between">
              <div>
                <h3 className="text-base font-black uppercase tracking-tight font-editorial">
                  Select Base Fabric Quality
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Choose from Surat mill verified natural and cellulose qualities
                </p>
              </div>
              <button
                onClick={() => setIsFabricSelectModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-black dark:hover:text-white rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 border-b border-gray-100 dark:border-white/10">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search fabric name, GSM, count (e.g. Viscose, Cotton, 110)..."
                  value={fabricSearchQuery}
                  onChange={(e) => setFabricSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-gray-50 dark:bg-[#141517] rounded-xl border border-gray-200 dark:border-white/10 text-xs focus:outline-none"
                />
              </div>
            </div>

            <div className="divide-y divide-gray-100 dark:divide-white/5 overflow-y-auto max-h-[400px]">
              {filteredModalFabrics.map((f) => (
                <div
                  key={f.id}
                  onClick={() => {
                    setCurrentProduct(f);
                    onSelectProduct?.(f);
                    setIsFabricSelectModalOpen(false);
                  }}
                  className={`p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-white/5 transition cursor-pointer ${
                    currentProduct.id === f.id ? 'bg-blue-50/50 dark:bg-blue-950/20' : ''
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-xs text-gray-900 dark:text-white">{f.name}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300">
                        {f.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400">
                      {f.gsm} GSM • {f.width} • {f.weave_type || 'Plain Weave'}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="font-black text-xs text-[#9B1B30] dark:text-[#EF4444]">
                      ₹{f.price_per_meter.toFixed(2)}/m
                    </span>
                    {currentProduct.id === f.id && (
                      <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold block">
                        ✓ Selected
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      )}

      {/* 📁 Modal 2: Large File Instructions Modal (>50MB) */}
      {isLargeFileModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1A1C1E] text-[#0F100F] dark:text-white w-full max-w-lg rounded-3xl shadow-2xl border border-gray-200 dark:border-white/10 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/10 pb-3">
              <h3 className="font-bold text-sm uppercase tracking-wider flex items-center space-x-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <span>Submitting Files Larger Than 50 MB</span>
              </h3>
              <button
                onClick={() => setIsLargeFileModalOpen(false)}
                className="p-1 text-gray-400 hover:text-black dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-gray-600 dark:text-gray-300">
              <p>
                For high-resolution PSD, TIFF, or large seamless repeat collections exceeding 50 MB, please use any of the following fast transfer channels:
              </p>
              
              <div className="space-y-2 pt-1">
                <div className="p-3 bg-gray-50 dark:bg-[#141517] rounded-xl border border-gray-200 dark:border-white/10">
                  <span className="font-bold text-gray-900 dark:text-white block">1. WeTransfer / Google Drive Link</span>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Upload your file to WeTransfer or Google Drive and paste the public link in the notes during checkout or via email to <strong>orders@fabricprint.com</strong>.
                  </p>
                </div>

                <div className="p-3 bg-gray-50 dark:bg-[#141517] rounded-xl border border-gray-200 dark:border-white/10">
                  <span className="font-bold text-gray-900 dark:text-white block">2. Direct Mill WhatsApp Hotline</span>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Send file documents directly to our textile CAD design team on WhatsApp at <strong>+91 98765 43210</strong> with your Order SKU reference.
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsLargeFileModalOpen(false)}
              className="w-full py-2.5 bg-[#1E293B] text-white font-bold text-xs rounded-xl hover:bg-[#0F172A] transition"
            >
              Got it, Proceed
            </button>
          </div>
        </div>
      )}

      {/* 📁 Modal 3: Curated Preloaded Design Motifs */}
      <PreloadedDesignModal
        isOpen={isPreloadedModalOpen}
        onClose={() => setIsPreloadedModalOpen(false)}
        onSelectDesign={handleSelectPreloaded}
      />

      {/* 📁 Modal 4: Smart URL / Google Image Extractor */}
      <SmartUrlImageExtractorModal
        isOpen={isGoogleModalOpen}
        onClose={() => setIsGoogleModalOpen(false)}
        onApplyExtractedImage={handleApplyExtractedImage}
      />

      {/* 📁 Modal 5: Side-by-Side Fabric Comparator */}
      <FabricComparisonModal
        isOpen={isComparatorOpen}
        onClose={() => setIsComparatorOpen(false)}
        baseProduct={currentProduct}
        allProducts={allProducts}
        onSelectProductForCustomization={(newProduct) => {
          setCurrentProduct(newProduct);
          onSelectProduct?.(newProduct);
        }}
      />

    </div>
  );
};

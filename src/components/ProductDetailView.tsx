import React, { useState, useEffect, useMemo } from 'react';
import {
  Printer,
  Upload,
  Check,
  MessageCircle,
  Phone,
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
  const [isSpecsExpanded, setIsSpecsExpanded] = useState<boolean>(false);

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

  // Direct WhatsApp Order URL with prefilled fabric and length specifications
  const whatsappOrderUrl = useMemo(() => {
    const quantityText = selectedSizeType === 'swatch_test' ? 'Sample Swatch' : `${meters} meter(s)`;
    const printText = buyingOption === 'printed' ? 'Custom Printed' : 'Plain / RFD Base';
    const artworkText = uploadedDesignUrl ? `\n- Artwork attached: ${uploadedDesignName}` : '';
    const text = `Hi Fabric Print, I want to order:\n- Fabric: ${currentProduct.name} (${currentProduct.gsm} GSM, ${currentProduct.width})\n- Quantity: ${quantityText}\n- Option: ${printText}\n- Total: ₹${calculatedTotalPrice.toFixed(0)}${artworkText}\n\nPlease confirm my order.`;
    return `https://wa.me/918903120006?text=${encodeURIComponent(text)}`;
  }, [currentProduct, meters, selectedSizeType, buyingOption, uploadedDesignUrl, uploadedDesignName, calculatedTotalPrice]);

  // Quick WhatsApp artwork upload
  const whatsappArtworkUrl = useMemo(() => {
    const text = `Hi Fabric Print, I am ordering ${currentProduct.name} and want to send my design artwork directly here.`;
    return `https://wa.me/918903120006?text=${encodeURIComponent(text)}`;
  }, [currentProduct]);

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
    <div className="min-h-screen pt-4 pb-32 lg:py-8 text-[#0F100F] dark:text-white transition-colors duration-300">
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
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">100% Quality Guaranteed</span>
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

            {/* Quick Comparator Banner Callout - Desktop Only to prevent mobile overcrowding */}
            <div className="hidden lg:flex p-3.5 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-2xl border border-blue-200/80 dark:border-blue-800/30 items-center justify-between text-xs">
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
          <div className="lg:col-span-6 bg-white dark:bg-[#1A1C1E] rounded-3xl border border-gray-200 dark:border-white/10 p-5 sm:p-7 shadow-sm space-y-4">
            
            {/* 1. Clean Title & Fabric Highlights */}
            <div className="border-b border-gray-100 dark:border-white/10 pb-3.5 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>In Stock • Direct Dispatch</span>
                </span>
                <span className="font-mono text-[11px] font-bold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-white/10 px-2 py-0.5 rounded">
                  SKU: {currentProduct.sku || 'TIMFAB'}
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl font-black text-[#0F1111] dark:text-white leading-tight">
                {currentProduct.name}
              </h1>

              <div className="flex items-center gap-2 pt-0.5 text-xs text-gray-500 dark:text-gray-400">
                <span className="font-bold text-gray-800 dark:text-gray-200">{currentProduct.gsm} GSM</span>
                <span>•</span>
                <span>{currentProduct.width}</span>
                <span>•</span>
                <span className="text-amber-500 font-bold flex items-center gap-0.5">
                  <Star className="w-3.5 h-3.5 fill-current text-amber-500" />
                  <span>{currentProduct.rating || 4.9}</span>
                </span>
              </div>
            </div>

            {/* 2. Simplified Clean Price Block */}
            <div className="flex items-center justify-between bg-gray-50 dark:bg-[#141517] p-3 sm:p-4 rounded-2xl border border-gray-200/80 dark:border-white/10">
              <div>
                <div className="flex items-baseline space-x-2">
                  <span className="text-2xl sm:text-3xl font-black text-[#0F1111] dark:text-white">
                    ₹{calculatedTotalPrice.toFixed(0)}
                  </span>
                  <span className="text-xs text-gray-400 line-through">
                    ₹{Math.round(calculatedTotalPrice * 1.25)}
                  </span>
                  {selectedSizeType === 'meter' && meters > 1 && (
                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                      (₹{calculatedUnitPrice.toFixed(0)}/m)
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold mt-0.5">
                  ✓ Free delivery above ₹999 • 48-72h Mill Dispatch
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-bold text-[#AC7900] dark:text-[#D4AF37] bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                  {selectedSizeType === 'swatch_test' ? 'Sample Swatch' : `${meters}m Selected`}
                </span>
              </div>
            </div>

            {/* STEP 1: Fabric Selection & Quantity (Meters / Swatch) */}
            <div className="space-y-3 p-3.5 sm:p-4 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-[#141517]">
              <div className="flex items-center justify-between">
                <label className="text-xs font-extrabold uppercase tracking-wider text-gray-800 dark:text-gray-200 flex items-center space-x-1.5">
                  <span className="w-5 h-5 rounded-full bg-black text-white dark:bg-white dark:text-black flex items-center justify-center text-[10px] font-black">1</span>
                  <span>Select Quantity / Meters:</span>
                </label>
                <button
                  type="button"
                  onClick={() => setIsFabricSelectModalOpen(true)}
                  className="text-[11px] font-bold text-red-600 dark:text-red-400 hover:underline flex items-center space-x-1"
                >
                  <Edit2 className="w-3 h-3" />
                  <span>Change Fabric</span>
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
                        : 'bg-white dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-100 border border-gray-200 dark:border-white/10'
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
                      ? 'border-[#2D325A] bg-[#2D325A] text-white shadow-sm'
                      : 'border-dashed border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 text-gray-600 dark:text-gray-300 hover:bg-gray-100'
                  }`}
                >
                  📐 Sample Swatch (₹{currentProduct.swatch_test_price || 150})
                </button>
              </div>

              {/* Custom Stepper */}
              {selectedSizeType === 'meter' && (
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-gray-600 dark:text-gray-400">Custom Length:</span>
                    <div className="flex items-center space-x-1 bg-white dark:bg-black/30 border border-gray-300 dark:border-white/10 rounded-lg p-0.5">
                      <button
                        type="button"
                        onClick={() => setMeters(Math.max(1, meters - 1))}
                        disabled={meters <= 1}
                        className="w-7 h-7 rounded flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10 disabled:opacity-30"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <input
                        type="number"
                        min={1}
                        value={meters}
                        onChange={(e) => setMeters(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-12 text-center font-bold text-xs bg-transparent focus:outline-none text-gray-900 dark:text-white"
                      />
                      <button
                        type="button"
                        onClick={() => setMeters(meters + 1)}
                        className="w-7 h-7 rounded flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {meters >= 21 && (
                    <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                      🎉 Wholesale Discount Active!
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* STEP 2: Choose Printing Option */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold uppercase tracking-wider text-gray-700 dark:text-gray-300 flex items-center space-x-1.5">
                <span className="w-5 h-5 rounded-full bg-black text-white dark:bg-white dark:text-black flex items-center justify-center text-[10px] font-black">2</span>
                <span>Printing Option:</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setBuyingOption('printed')}
                  className={`p-3 rounded-xl border text-left transition ${
                    buyingOption === 'printed'
                      ? 'border-[#2D325A] bg-[#2D325A]/5 dark:bg-blue-950/30 ring-2 ring-[#2D325A]'
                      : 'border-gray-200 dark:border-white/10 hover:border-gray-300 bg-white dark:bg-[#141517]'
                  }`}
                >
                  <div className="text-xs font-bold text-gray-900 dark:text-white">
                    🎨 Custom Printed
                  </div>
                  <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
                    Print your design or artwork
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setBuyingOption('plain');
                    setUploadedDesignUrl('');
                    setUploadedDesignName('');
                  }}
                  className={`p-3 rounded-xl border text-left transition ${
                    buyingOption === 'plain'
                      ? 'border-[#2D325A] bg-[#2D325A]/5 dark:bg-blue-950/30 ring-2 ring-[#2D325A]'
                      : 'border-gray-200 dark:border-white/10 hover:border-gray-300 bg-white dark:bg-[#141517]'
                  }`}
                >
                  <div className="text-xs font-bold text-gray-900 dark:text-white">
                    🧵 Plain / RFD Base
                  </div>
                  <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
                    White natural base for sewing
                  </div>
                </button>
              </div>
            </div>

            {/* STEP 3: Artwork Section */}
            {buyingOption === 'printed' && (
              <div className="p-3.5 sm:p-4 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-[#15171A] space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-gray-800 dark:text-gray-200 flex items-center space-x-1.5">
                    <span className="w-5 h-5 rounded-full bg-black text-white dark:bg-white dark:text-black flex items-center justify-center text-[10px] font-black">3</span>
                    <span>Attach Artwork (Or Send on WhatsApp):</span>
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="py-2 px-2 bg-[#B91C1C] hover:bg-[#991B1B] text-white font-bold text-xs rounded-xl transition shadow-xs flex items-center justify-center space-x-1"
                  >
                    <Upload className="w-3.5 h-3.5 shrink-0" />
                    <span>Upload File</span>
                  </button>

                  <a
                    href={whatsappArtworkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2 px-2 bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold text-xs rounded-xl transition shadow-xs flex items-center justify-center space-x-1"
                    title="Send design image directly on WhatsApp"
                  >
                    <MessageCircle className="w-3.5 h-3.5 fill-current shrink-0" />
                    <span>WhatsApp</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => setIsPreloadedModalOpen(true)}
                    className="py-2 px-2 bg-[#2D325A] hover:bg-[#232747] text-white font-bold text-xs rounded-xl transition shadow-xs flex items-center justify-center space-x-1"
                  >
                    <MousePointerClick className="w-3.5 h-3.5 shrink-0" />
                    <span>Catalog</span>
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
                {uploadedDesignUrl && (
                  <div className="p-2 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-800/40 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2 truncate">
                      <img src={uploadedDesignUrl} alt="Design" className="w-7 h-7 rounded object-cover border border-emerald-300" />
                      <span className="font-bold text-emerald-900 dark:text-emerald-300 truncate max-w-[170px]">
                        {uploadedDesignName}
                      </span>
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
                )}
              </div>
            )}

            {/* 4. High-Converting Instant Buy Box */}
            <div className="space-y-2 pt-1">
              
              {/* PRIMARY: WhatsApp Quick Order Button */}
              <a
                href={whatsappOrderUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 bg-[#25D366] hover:bg-[#20BD5A] text-white font-black text-xs uppercase tracking-wider rounded-xl transition shadow-md flex items-center justify-center space-x-2 hover:scale-[1.01] active:scale-98"
              >
                <MessageCircle className="w-4 h-4 fill-current shrink-0" />
                <span>Order on WhatsApp (Instant Help)</span>
              </a>

              {/* Instant Call Option */}
              <a
                href="tel:918903120006"
                className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/15 text-gray-800 dark:text-gray-200 font-bold text-xs rounded-xl transition flex items-center justify-center space-x-2"
              >
                <Phone className="w-3.5 h-3.5 text-[#AC7900] dark:text-[#D4AF37]" />
                <span>Or Call Specialist: +91 89031 20006</span>
              </a>

              {/* SECONDARY: Add to Cart & Buy Now */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleAddToCart(false)}
                  className="py-3 px-3 bg-[#FFD814] hover:bg-[#F7CA00] text-gray-950 font-bold text-xs uppercase tracking-wider rounded-xl transition shadow-xs flex items-center justify-center space-x-1.5 border border-[#FCD200]"
                >
                  <Package className="w-4 h-4 shrink-0" />
                  <span>Add to Cart</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleAddToCart(true)}
                  className="py-3 px-3 bg-[#FFA41C] hover:bg-[#FA8900] text-gray-950 font-black text-xs uppercase tracking-wider rounded-xl transition shadow-sm flex items-center justify-center space-x-1.5 border border-[#FF8F00]"
                >
                  <span>Buy Now</span>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </button>
              </div>

            </div>

            {/* 5. Collapsible Specifications Accordion (Zero Visual Clutter) */}
            <div className="border-t border-gray-100 dark:border-white/10 pt-2">
              <button
                type="button"
                onClick={() => setIsSpecsExpanded(!isSpecsExpanded)}
                className="w-full flex items-center justify-between py-2 text-xs font-bold text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition"
              >
                <span>Fabric Details &amp; Specifications</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isSpecsExpanded ? 'rotate-180' : ''}`} />
              </button>

              {isSpecsExpanded && (
                <div className="grid grid-cols-2 gap-2 text-xs bg-gray-50 dark:bg-[#141517] p-3 rounded-xl border border-gray-100 dark:border-white/5 mt-2 animate-in fade-in duration-200">
                  <div><strong>GSM:</strong> {currentProduct.gsm}</div>
                  <div><strong>Width:</strong> {currentProduct.width}</div>
                  <div><strong>Count:</strong> {currentProduct.count || 'Combed 30s'}</div>
                  <div><strong>Weave:</strong> {currentProduct.weave_type || 'Plain'}</div>
                  <div><strong>Composition:</strong> {currentProduct.composition}</div>
                  <div><strong>Dyes:</strong> Skin-safe reactive colorfast dyes</div>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>

      {/* 📱 Mobile Sticky Buy Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#111211]/95 backdrop-blur-xl border-t border-black/10 dark:border-white/10 px-4 py-2.5 pb-[calc(env(safe-area-inset-bottom)+0.625rem)] shadow-[0_-4px_25px_rgba(0,0,0,0.12)] flex items-center justify-between gap-2.5 animate-in slide-in-from-bottom duration-300">
        <div className="min-w-0">
          <div className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider truncate">
            {selectedSizeType === 'swatch_test' ? 'Sample Swatch' : `${meters}m • ${currentProduct.name}`}
          </div>
          <div className="text-base font-black text-[#0F100F] dark:text-white leading-tight">
            ₹{calculatedTotalPrice.toFixed(0)}
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <a
            href={whatsappOrderUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 bg-[#25D366] text-white font-extrabold text-[11px] rounded-xl flex items-center space-x-1 shadow-xs"
          >
            <MessageCircle className="w-3.5 h-3.5 fill-current" />
            <span>WhatsApp</span>
          </a>

          <button
            type="button"
            onClick={() => handleAddToCart(true)}
            className="px-3.5 py-2 bg-[#FFA41C] hover:bg-[#FA8900] text-gray-950 font-black text-[11px] uppercase tracking-wider rounded-xl transition shadow-md flex items-center space-x-1 border border-[#FF8F00]"
          >
            <span>Buy Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
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
                  Choose from premium verified natural and cellulose qualities
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

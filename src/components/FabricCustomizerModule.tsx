import React, { useState, useEffect } from 'react';
import {
  Upload,
  Grid,
  RotateCw,
  Maximize2,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Info,
  X,
  Plus,
  Minus,
  ShoppingCart,
  Zap,
  Sliders,
  Layers,
  Ruler,
  HelpCircle,
  FolderOpen,
  FileText,
  Check,
  Globe,
  Palette,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Award
} from 'lucide-react';
import {
  Product,
  SizeOptionType,
  LayoutType,
  PrintOptions,
  AdminCustomizerSettings,
  Mockup3DMode
} from '../types';
import { useCart } from '../context/CartContext';
import { uploadDesignFile, fetchCustomizerSettings } from '../services/api';
import { PreloadedDesignModal } from './PreloadedDesignModal';
import { Fabric3DMockupViewer } from './Fabric3DMockupViewer';
import { SmartUrlImageExtractorModal } from './SmartUrlImageExtractorModal';
import { SwatchBookOrderModal } from './SwatchBookOrderModal';
import { FabricTechnicalSpecsBox } from './FabricTechnicalSpecsBox';

interface FabricCustomizerModuleProps {
  initialProduct?: Product;
  allProducts: Product[];
  onGoToCheckout?: () => void;
  onOpenBulkInquiry?: () => void;
}

export const FabricCustomizerModule: React.FC<FabricCustomizerModuleProps> = ({
  initialProduct,
  allProducts,
  onGoToCheckout,
  onOpenBulkInquiry
}) => {
  const { addToCart } = useCart();

  // Active Fabric Selection
  const [selectedProduct, setSelectedProduct] = useState<Product>(
    initialProduct || allProducts[0] || {
      id: 'p-1',
      name: 'Premium Cotton Mulmul (60s x 60s)',
      category: 'Cotton',
      gsm: 75,
      width: '44 inches (112 cm)',
      count: '60s x 60s Combed Yarn',
      color: 'Natural Soft White',
      colorCode: '#fdfbf7',
      price_per_meter: 420,
      swatch_test_price: 180,
      swatch_big_price: 450,
      print_surcharge_per_meter: 0,
      images: ['https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&q=80&w=1000'],
      description: 'Mulmul cotton',
      weave_type: 'Plain Weave',
      composition: '100% Combed Cotton',
      in_stock: true,
      certifications: ['GOTS Certified Organic', 'OEKO-TEX Standard 100']
    }
  );

  // Sync state if initialProduct prop changes
  useEffect(() => {
    if (initialProduct) {
      setSelectedProduct(initialProduct);
    }
  }, [initialProduct]);

  // Admin Customizer Settings
  const [adminSettings, setAdminSettings] = useState<AdminCustomizerSettings>({
    dpiWarningThreshold: 150,
    dpiHighThreshold: 300,
    enabledLayouts: {
      single: true,
      repeat_grid: true,
      half_drop: true,
      brick_repeat: true,
      mirror_repeat: true
    },
    preloadedDesigns: []
  });

  useEffect(() => {
    fetchCustomizerSettings().then(setAdminSettings).catch(console.error);
  }, []);

  // Uploaded or Selected Artwork State
  const [designUrl, setDesignUrl] = useState<string>(
    'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&q=80&w=800'
  );
  const [designName, setDesignName] = useState<string>('Royal_Mughal_Botanical.png');
  const [designWidthPx, setDesignWidthPx] = useState<number>(3200);
  const [designHeightPx, setDesignHeightPx] = useState<number>(3200);
  const [designFileSizeMb, setDesignFileSizeMb] = useState<number>(4.2);
  const [extractedPalette, setExtractedPalette] = useState<string[]>([
    '#1E3A8A',
    '#F59E0B',
    '#10B981',
    '#E11D48',
    '#F8FAFC'
  ]);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string>('');

  // Modals
  const [preloadedModalOpen, setPreloadedModalOpen] = useState<boolean>(false);
  const [urlExtractorOpen, setUrlExtractorOpen] = useState<boolean>(false);
  const [swatchBookModalOpen, setSwatchBookModalOpen] = useState<boolean>(false);

  // Customization Controls
  const [scalePercentage, setScalePercentage] = useState<number>(100);
  const [rotation, setRotation] = useState<0 | 90 | 180 | 270>(0);
  const [layoutType, setLayoutType] = useState<LayoutType>('repeat_grid');
  const [active3DMode, setActive3DMode] = useState<Mockup3DMode>('bolt');

  // Size & Order Specs
  const [selectedSizeType, setSelectedSizeType] = useState<SizeOptionType>('meter');
  const [meters, setMeters] = useState<number>(10);
  const [quantity, setQuantity] = useState<number>(1);

  // Interactive View States
  const [showRuler, setShowRuler] = useState<boolean>(true);
  const [inkBlendMode, setInkBlendMode] = useState<boolean>(true);
  const [addedSuccessAlert, setAddedSuccessAlert] = useState<boolean>(false);

  // Measure natural dimensions of design when URL changes
  useEffect(() => {
    if (!designUrl) return;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = designUrl;
    img.onload = () => {
      setDesignWidthPx(img.naturalWidth || 3000);
      setDesignHeightPx(img.naturalHeight || 3000);
    };
  }, [designUrl]);

  // File Upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError('');
    const validTypes = ['image/jpeg', 'image/png', 'image/tiff', 'image/jpg', 'image/webp'];
    if (!validTypes.includes(file.type) && !file.name.toLowerCase().endsWith('.tiff')) {
      setUploadError('Invalid format! Please upload JPG, PNG, WebP, or TIFF image.');
      return;
    }

    const sizeInMb = file.size / (1024 * 1024);
    if (sizeInMb > 25) {
      setUploadError('File exceeds 25MB limit. Please compress design artwork.');
      return;
    }

    try {
      setIsUploading(true);
      const res = await uploadDesignFile(file);
      setDesignUrl(res.url);
      setDesignName(res.fileName);
      setDesignFileSizeMb(Number(sizeInMb.toFixed(2)));
      setScalePercentage(100);
      setRotation(0);
      setLayoutType('repeat_grid');
    } catch (err: any) {
      setUploadError(err.message || 'Failed to upload artwork.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveDesign = () => {
    setDesignUrl('');
    setDesignName('');
    setDesignWidthPx(0);
    setDesignHeightPx(0);
    setUploadError('');
    setScalePercentage(100);
    setRotation(0);
    setLayoutType('repeat_grid');
  };

  const handleSelectPreloaded = (design: { name: string; url: string; widthPx?: number; heightPx?: number }) => {
    setDesignUrl(design.url);
    setDesignName(design.name);
    if (design.widthPx) setDesignWidthPx(design.widthPx);
    if (design.heightPx) setDesignHeightPx(design.heightPx);
    setDesignFileSizeMb(2.5);
    setUploadError('');
    setScalePercentage(100);
    setRotation(0);
    setLayoutType('repeat_grid');
  };

  const handleApplyExtractedImage = (imgInfo: {
    url: string;
    name: string;
    widthPx: number;
    heightPx: number;
    fileSizeMb: number;
    palette?: string[];
  }) => {
    setDesignUrl(imgInfo.url);
    setDesignName(imgInfo.name);
    setDesignWidthPx(imgInfo.widthPx);
    setDesignHeightPx(imgInfo.heightPx);
    setDesignFileSizeMb(imgInfo.fileSizeMb);
    if (imgInfo.palette) setExtractedPalette(imgInfo.palette);
    setUploadError('');
    setScalePercentage(100);
    setRotation(0);
    setLayoutType('repeat_grid');
  };

  // Dynamic DPI Calculation
  const basePhysicalInches = 8;
  const scaledPhysicalInches = basePhysicalInches * (scalePercentage / 100);
  const calculatedDpi = designWidthPx > 0 ? Math.round(designWidthPx / scaledPhysicalInches) : 0;

  const getDpiQualityStatus = () => {
    if (calculatedDpi < adminSettings.dpiWarningThreshold) {
      return {
        quality: 'Low Quality',
        color: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
        badge: 'bg-amber-500 text-slate-950',
        desc: 'Print resolution is below 150 DPI at this scale. Print output may look soft.'
      };
    }
    if (calculatedDpi < adminSettings.dpiHighThreshold) {
      return {
        quality: 'Good Quality',
        color: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
        badge: 'bg-blue-600 text-white',
        desc: 'Good resolution suitable for standard digital fabric printing.'
      };
    }
    return {
      quality: 'High Quality',
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      badge: 'bg-emerald-500 text-slate-950',
      desc: 'Crisp 300+ DPI mill precision print quality guaranteed.'
    };
  };

  const dpiStatus = getDpiQualityStatus();

  // Tiered Wholesale Price Calculation (Fabriclore + TexIndiaMart standards)
  const calculateTotal = () => {
    let unitPrice = 0;
    let wholesaleDiscountPercent = 0;

    if (selectedSizeType === 'swatch_test') {
      unitPrice = selectedProduct.swatch_test_price || 180;
    } else if (selectedSizeType === 'swatch_big') {
      unitPrice = selectedProduct.swatch_big_price || 450;
    } else {
      // Linear Meter with Wholesale discount tiers
      const baseMeterRate = selectedProduct.price_per_meter || 420;

      if (meters >= 100) {
        wholesaleDiscountPercent = 25;
      } else if (meters >= 51) {
        wholesaleDiscountPercent = 18;
      } else if (meters >= 21) {
        wholesaleDiscountPercent = 10;
      }

      const discountedRate = baseMeterRate * (1 - wholesaleDiscountPercent / 100);
      unitPrice = discountedRate * meters;
    }

    const pricePerUnit = Number(unitPrice.toFixed(2));
    const totalPrice = Number((pricePerUnit * quantity).toFixed(2));

    return {
      pricePerUnit,
      totalPrice,
      wholesaleDiscountPercent
    };
  };

  const pricing = calculateTotal();

  // Add to Cart
  const handleAddToCart = (directCheckout = false) => {
    if (!designUrl) {
      setUploadError('Please upload, extract, or select a design motif to proceed.');
      return;
    }

    const printConfig: PrintOptions = {
      requiresPrint: true,
      designName,
      designUrl,
      designFileSizeMb,
      layoutType,
      rotation,
      scalePercentage,
      dpi: calculatedDpi,
      dpiQuality: dpiStatus.quality as any,
      repeatType: layoutType === 'repeat_grid' ? 'grid' : layoutType === 'half_drop' ? 'drop' : 'centered',
      extractedPalette
    };

    addToCart(
      selectedProduct,
      selectedSizeType,
      quantity,
      printConfig,
      selectedSizeType === 'meter' ? meters : undefined
    );

    setAddedSuccessAlert(true);
    setTimeout(() => setAddedSuccessAlert(false), 3500);

    if (directCheckout && onGoToCheckout) {
      onGoToCheckout();
    }
  };

  return (
    <div className="min-h-screen py-6 sm:py-10 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Module Title Banner */}
        <div className="relative overflow-hidden bg-[#0F100F] text-white rounded-[32px] p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2 z-10">
            <div className="inline-flex items-center space-x-2 border border-white/30 px-3.5 py-1 rounded-full text-xs font-semibold text-[#D4AF37]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Concept to Fabric • 3D Drape Studio</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black font-editorial text-white">
              Custom Digital Fabric Printing Studio
            </h1>
            <p className="text-xs sm:text-sm text-gray-300 max-w-2xl font-normal leading-relaxed">
              Upload your design motif or import from any <strong className="text-[#D4AF37]">Google Image URL</strong>, preview in interactive 3D on authentic natural fabrics, and order custom prints at direct mill rates.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 z-10 shrink-0">
            <button
              onClick={() => setUrlExtractorOpen(true)}
              className="bg-white hover:bg-gray-100 text-[#0F100F] font-bold px-5 py-2.5 rounded-full text-xs transition shadow-md flex items-center space-x-1.5"
            >
              <Globe className="w-4 h-4 text-[#AC7900]" />
              <span>Extract from Image URL</span>
            </button>

            <button
              onClick={() => setSwatchBookModalOpen(true)}
              className="bg-[#AC7900] hover:bg-[#c28900] text-white font-bold px-5 py-2.5 rounded-full text-xs transition shadow-md flex items-center space-x-1.5"
            >
              <BookOpen className="w-4 h-4" />
              <span>Order Swatch Pack</span>
            </button>
          </div>
        </div>

        {/* Added to Cart Success Toast */}
        {addedSuccessAlert && (
          <div className="bg-emerald-600 text-white p-4 rounded-2xl shadow-xl flex items-center justify-between animate-in fade-in slide-in-from-top duration-300">
            <div className="flex items-center space-x-3 text-xs font-bold">
              <CheckCircle2 className="w-5 h-5 text-amber-300 shrink-0" />
              <span>Customized digital print fabric added to cart successfully!</span>
            </div>
            {onGoToCheckout && (
              <button
                onClick={onGoToCheckout}
                className="bg-white text-emerald-950 font-bold px-3.5 py-1.5 rounded-xl text-xs hover:bg-emerald-50 transition"
              >
                Proceed to Checkout →
              </button>
            )}
          </div>
        )}

        {/* MAIN DUAL PANEL STUDIO LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT PANEL */}
          <div className="lg:col-span-7 space-y-6">
            
            <Fabric3DMockupViewer
              designUrl={designUrl}
              product={selectedProduct}
              selectedSizeType={selectedSizeType}
              meters={meters}
              layoutType={layoutType}
              scalePercentage={scalePercentage}
              rotation={rotation}
              inkBlendMode={inkBlendMode}
              showRulers={showRuler}
              active3DMode={active3DMode}
              onModeChange={setActive3DMode}
            />

            {/* Extracted Color Palette Bar */}
            {extractedPalette && extractedPalette.length > 0 && (
              <div className="bg-white dark:bg-[#1A1C1A] rounded-[24px] p-4 border border-[#ECECEC] dark:border-white/[0.08] shadow-fabriclore space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold flex items-center space-x-1.5 text-[#0F100F] dark:text-white">
                    <Palette className="w-4 h-4 text-[#AC7900] dark:text-[#D4AF37]" />
                    <span>Design Colorway Palette & Reactive Dye Spectrum</span>
                  </span>
                  <span className="text-[11px] text-[#8A8883] dark:text-gray-400">Pantone Calibrated</span>
                </div>
                <div className="flex items-center gap-2">
                  {extractedPalette.map((hex, i) => (
                    <div
                      key={i}
                      className="flex-1 h-7 rounded-lg border border-black/10 dark:border-white/20 shadow-sm relative group flex items-center justify-center"
                      style={{ backgroundColor: hex }}
                      title={`Color: ${hex}`}
                    >
                      <span className="opacity-0 group-hover:opacity-100 text-[9px] bg-black text-white px-1 rounded transition">
                        {hex}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 2. TECHNICAL SPECIFICATIONS BOX */}
            <FabricTechnicalSpecsBox
              product={selectedProduct}
              selectedSizeType={selectedSizeType}
              meters={meters}
              layoutType={layoutType}
              quantity={quantity}
              calculatedDpi={calculatedDpi}
              scalePercentage={scalePercentage}
            />

          </div>

          {/* RIGHT PANEL: ADVANCED CONTROL PANEL & PRICING */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white dark:bg-[#1A1C1A] rounded-[30px] p-6 shadow-fabriclore border border-[#ECECEC] dark:border-white/[0.08] space-y-6 text-[#0F100F] dark:text-white">
              
              <div className="border-b border-[#ECECEC] dark:border-white/[0.08] pb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold font-editorial text-[#0F100F] dark:text-white">Print Customizer Studio</h2>
                  <p className="text-xs text-[#8A8883] dark:text-gray-400">Configure artwork, pattern repeat & wholesale volume</p>
                </div>
                <Sliders className="w-5 h-5 text-[#AC7900] dark:text-[#D4AF37]" />
              </div>

              {/* SECTION 1: ARTWORK UPLOAD / URL EXTRACTION */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-[#0F100F] dark:text-white uppercase tracking-wider font-editorial">
                    1. Design Artwork Motif
                  </label>
                  <span className="text-[11px] text-[#8A8883] dark:text-gray-400">JPG, PNG, WebP, TIFF (Max 25MB)</span>
                </div>

                {uploadError && (
                  <div className="bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 p-3.5 rounded-2xl border border-red-200 dark:border-red-900/40 text-xs flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-red-500" />
                    <span>{uploadError}</span>
                  </div>
                )}

                {designUrl ? (
                  <div className="bg-[#F9F6ED] dark:bg-[#242624] p-3.5 rounded-2xl border border-[#ECECEC] dark:border-white/[0.08] flex items-center justify-between">
                    <div className="flex items-center space-x-3 overflow-hidden">
                      <div className="w-12 h-12 rounded-xl border border-black/10 dark:border-white/10 overflow-hidden shrink-0 bg-white">
                        <img
                          src={designUrl}
                          alt={designName}
                          className="w-full h-full object-cover"
                          crossOrigin="anonymous"
                        />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-[#0F100F] dark:text-white truncate font-editorial">{designName || 'Uploaded_Motif.png'}</h4>
                        <p className="text-[10px] text-[#8A8883] dark:text-gray-400">
                          {designWidthPx} × {designHeightPx} px ({designFileSizeMb} MB)
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1.5 shrink-0">
                      <button
                        onClick={() => setUrlExtractorOpen(true)}
                        className="p-2 bg-white dark:bg-[#1A1C1A] text-[#AC7900] dark:text-[#D4AF37] hover:opacity-80 rounded-xl transition shadow-sm"
                        title="Import New URL"
                      >
                        <Globe className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setPreloadedModalOpen(true)}
                        className="p-2 bg-white dark:bg-[#1A1C1A] text-[#0F100F] dark:text-white hover:opacity-80 rounded-xl transition shadow-sm"
                        title="Pick Preloaded Motif"
                      >
                        <FolderOpen className="w-4 h-4" />
                      </button>
                      <button
                        onClick={handleRemoveDesign}
                        className="p-2 bg-white dark:bg-[#1A1C1A] text-red-500 hover:opacity-80 rounded-xl transition shadow-sm"
                        title="Remove Artwork"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <label className="border-2 border-dashed border-[#AC7900]/40 hover:border-[#AC7900] bg-[#FEFBF1] dark:bg-[#222422] rounded-2xl p-3 text-center cursor-pointer transition flex flex-col items-center justify-center space-y-1.5">
                      <Upload className="w-5 h-5 text-[#AC7900] dark:text-[#D4AF37]" />
                      <span className="text-xs font-bold text-[#0F100F] dark:text-white">Upload File</span>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/tiff,image/webp"
                        onChange={handleFileUpload}
                        disabled={isUploading}
                        className="hidden"
                      />
                    </label>

                    <button
                      onClick={() => setUrlExtractorOpen(true)}
                      className="border border-[#ECECEC] dark:border-white/[0.1] hover:border-[#AC7900] bg-[#F9F6ED] dark:bg-[#242624] rounded-2xl p-3 text-center transition flex flex-col items-center justify-center space-y-1.5"
                    >
                      <Globe className="w-5 h-5 text-[#AC7900] dark:text-[#D4AF37]" />
                      <span className="text-xs font-bold text-[#0F100F] dark:text-white">Google URL</span>
                    </button>

                    <button
                      onClick={() => setPreloadedModalOpen(true)}
                      className="border border-[#ECECEC] dark:border-white/[0.1] hover:border-[#AC7900] bg-[#F9F6ED] dark:bg-[#242624] rounded-2xl p-3 text-center transition flex flex-col items-center justify-center space-y-1.5"
                    >
                      <Sparkles className="w-5 h-5 text-[#AC7900] dark:text-[#D4AF37]" />
                      <span className="text-xs font-bold text-[#0F100F] dark:text-white">Motif Library</span>
                    </button>
                  </div>
                )}
              </div>

              {/* SECTION 2: BASE FABRIC SELECTION */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-[#0F100F] dark:text-white uppercase tracking-wider font-editorial">
                  2. Base Fabric Quality
                </label>
                <select
                  value={selectedProduct.id}
                  onChange={(e) => {
                    const prod = allProducts.find((p) => p.id === e.target.value);
                    if (prod) setSelectedProduct(prod);
                  }}
                  className="w-full bg-[#F9F6ED] dark:bg-[#242624] border border-[#ECECEC] dark:border-white/[0.1] text-[#0F100F] dark:text-white rounded-2xl p-3 text-xs focus:ring-2 focus:ring-[#AC7900] focus:outline-none cursor-pointer"
                >
                  {allProducts.map((p) => (
                    <option key={p.id} value={p.id} className="bg-white dark:bg-[#1A1C1A] text-[#0F100F] dark:text-white">
                      {p.name} — INR {p.price_per_meter}.00/m ({p.gsm} GSM)
                    </option>
                  ))}
                </select>

                {/* Certifications badges */}
                {selectedProduct.certifications && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {selectedProduct.certifications.map((cert, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 px-2.5 py-0.5 rounded-full flex items-center space-x-1"
                      >
                        <ShieldCheck className="w-3 h-3" />
                        <span>{cert}</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* SECTION 3: PATTERN REPEAT & LAYOUT MODES */}
              <div className="space-y-2.5">
                <label className="block text-xs font-bold text-[#0F100F] dark:text-white uppercase tracking-wider font-editorial">
                  3. Pattern Repeat Mode
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <button
                    onClick={() => setLayoutType('repeat_grid')}
                    className={`p-2.5 rounded-2xl border text-xs font-semibold flex flex-col items-center justify-center space-y-1 transition ${
                      layoutType === 'repeat_grid'
                        ? 'bg-[#0F100F] dark:bg-white text-white dark:text-[#0F100F] border-transparent shadow-sm'
                        : 'bg-[#F9F6ED] dark:bg-[#242624] border-[#ECECEC] dark:border-white/[0.08] text-[#0F100F] dark:text-white hover:border-[#AC7900]'
                    }`}
                  >
                    <Grid className="w-4 h-4" />
                    <span>Grid Repeat</span>
                  </button>

                  <button
                    onClick={() => setLayoutType('half_drop')}
                    className={`p-2.5 rounded-2xl border text-xs font-semibold flex flex-col items-center justify-center space-y-1 transition ${
                      layoutType === 'half_drop'
                        ? 'bg-[#0F100F] dark:bg-white text-white dark:text-[#0F100F] border-transparent shadow-sm'
                        : 'bg-[#F9F6ED] dark:bg-[#242624] border-[#ECECEC] dark:border-white/[0.08] text-[#0F100F] dark:text-white hover:border-[#AC7900]'
                    }`}
                  >
                    <Layers className="w-4 h-4" />
                    <span>Half Drop</span>
                  </button>

                  <button
                    onClick={() => setLayoutType('brick_repeat')}
                    className={`p-2.5 rounded-2xl border text-xs font-semibold flex flex-col items-center justify-center space-y-1 transition ${
                      layoutType === 'brick_repeat'
                        ? 'bg-[#0F100F] dark:bg-white text-white dark:text-[#0F100F] border-transparent shadow-sm'
                        : 'bg-[#F9F6ED] dark:bg-[#242624] border-[#ECECEC] dark:border-white/[0.08] text-[#0F100F] dark:text-white hover:border-[#AC7900]'
                    }`}
                  >
                    <Sliders className="w-4 h-4" />
                    <span>Brick Repeat</span>
                  </button>

                  <button
                    onClick={() => setLayoutType('mirror_repeat')}
                    className={`p-2.5 rounded-2xl border text-xs font-semibold flex flex-col items-center justify-center space-y-1 transition ${
                      layoutType === 'mirror_repeat'
                        ? 'bg-[#0F100F] dark:bg-white text-white dark:text-[#0F100F] border-transparent shadow-sm'
                        : 'bg-[#F9F6ED] dark:bg-[#242624] border-[#ECECEC] dark:border-white/[0.08] text-[#0F100F] dark:text-white hover:border-[#AC7900]'
                    }`}
                  >
                    <RotateCw className="w-4 h-4" />
                    <span>Mirror Symmetrical</span>
                  </button>

                  <button
                    onClick={() => setLayoutType('single')}
                    className={`p-2.5 rounded-2xl border text-xs font-semibold flex flex-col items-center justify-center space-y-1 transition col-span-2 sm:col-span-1 ${
                      layoutType === 'single'
                        ? 'bg-[#0F100F] dark:bg-white text-white dark:text-[#0F100F] border-transparent shadow-sm'
                        : 'bg-[#F9F6ED] dark:bg-[#242624] border-[#ECECEC] dark:border-white/[0.08] text-[#0F100F] dark:text-white hover:border-[#AC7900]'
                    }`}
                  >
                    <Maximize2 className="w-4 h-4" />
                    <span>Single Motif</span>
                  </button>
                </div>
              </div>

              {/* SECTION 4: SCALE & ROTATION SLIDERS */}
              <div className="space-y-4 bg-[#F9F6ED] dark:bg-[#242624] p-4 rounded-[24px] border border-[#ECECEC] dark:border-white/[0.08]">
                
                {/* Scale Slider */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-[#0F100F] dark:text-white">Scale Motif Size</span>
                    <span className="font-bold text-[#AC7900] dark:text-[#D4AF37]">{scalePercentage}%</span>
                  </div>
                  <input
                    type="range"
                    min="15"
                    max="250"
                    step="5"
                    value={scalePercentage}
                    onChange={(e) => setScalePercentage(Number(e.target.value))}
                    className="w-full accent-[#AC7900] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-[#8A8883] dark:text-gray-400">
                    <span>Micro Print (15%)</span>
                    <span>Natural 100%</span>
                    <span>Large Statement (250%)</span>
                  </div>
                </div>

                {/* Rotation Buttons */}
                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs font-semibold text-[#0F100F] dark:text-white">Artwork Angle</span>
                  <div className="flex gap-1.5">
                    {[0, 90, 180, 270].map((deg) => (
                      <button
                        key={deg}
                        onClick={() => setRotation(deg as any)}
                        className={`px-3 py-1 rounded-full text-xs font-bold transition ${
                          rotation === deg
                            ? 'bg-[#0F100F] dark:bg-white text-white dark:text-[#0F100F]'
                            : 'bg-white dark:bg-[#1A1C1A] text-[#0F100F] dark:text-white border border-[#ECECEC] dark:border-white/[0.1]'
                        }`}
                      >
                        {deg}°
                      </button>
                    ))}
                  </div>
                </div>

                {/* Live DPI Status Indicator */}
                <div className={`p-3 rounded-2xl border text-xs flex items-center justify-between ${dpiStatus.color}`}>
                  <div>
                    <span className="font-bold block">Resolution: {calculatedDpi} DPI</span>
                    <span className="text-[10px] opacity-80">{dpiStatus.desc}</span>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${dpiStatus.badge}`}>
                    {dpiStatus.quality}
                  </span>
                </div>

              </div>

              {/* SECTION 5: ORDER FORMAT & WHOLESALE METERAGE */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-[#0F100F] dark:text-white uppercase tracking-wider font-editorial">
                  4. Order Format & Length
                </label>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setSelectedSizeType('meter')}
                    className={`p-3 rounded-2xl border text-center transition ${
                      selectedSizeType === 'meter'
                        ? 'bg-[#0F100F] dark:bg-white text-white dark:text-[#0F100F] border-transparent shadow-sm'
                        : 'bg-[#F9F6ED] dark:bg-[#242624] border-[#ECECEC] dark:border-white/[0.08] text-[#0F100F] dark:text-white hover:border-[#AC7900]'
                    }`}
                  >
                    <span className="block font-bold text-xs">Linear Meters</span>
                    <span className="text-[10px] opacity-70">Custom Length</span>
                  </button>

                  <button
                    onClick={() => setSelectedSizeType('swatch_test')}
                    className={`p-3 rounded-2xl border text-center transition ${
                      selectedSizeType === 'swatch_test'
                        ? 'bg-[#0F100F] dark:bg-white text-white dark:text-[#0F100F] border-transparent shadow-sm'
                        : 'bg-[#F9F6ED] dark:bg-[#242624] border-[#ECECEC] dark:border-white/[0.08] text-[#0F100F] dark:text-white hover:border-[#AC7900]'
                    }`}
                  >
                    <span className="block font-bold text-xs">Test Swatch</span>
                    <span className="text-[10px] opacity-70">20 × 20 cm</span>
                  </button>

                  <button
                    onClick={() => setSelectedSizeType('swatch_big')}
                    className={`p-3 rounded-2xl border text-center transition ${
                      selectedSizeType === 'swatch_big'
                        ? 'bg-[#0F100F] dark:bg-white text-white dark:text-[#0F100F] border-transparent shadow-sm'
                        : 'bg-[#F9F6ED] dark:bg-[#242624] border-[#ECECEC] dark:border-white/[0.08] text-[#0F100F] dark:text-white hover:border-[#AC7900]'
                    }`}
                  >
                    <span className="block font-bold text-xs">Big Swatch</span>
                    <span className="text-[10px] opacity-70">75 × 100 cm</span>
                  </button>
                </div>

                {/* Meter Stepper */}
                {selectedSizeType === 'meter' && (
                  <div className="space-y-2 bg-[#F9F6ED] dark:bg-[#242624] p-3.5 rounded-2xl border border-[#ECECEC] dark:border-white/[0.08]">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#0F100F] dark:text-white">Fabric Length (Meters):</span>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setMeters(Math.max(1, meters - 1))}
                          className="w-8 h-8 rounded-full bg-white dark:bg-[#1A1C1A] hover:bg-gray-100 flex items-center justify-center text-[#0F100F] dark:text-white shadow-sm transition"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <input
                          type="number"
                          min="1"
                          max="1000"
                          value={meters}
                          onChange={(e) => setMeters(Math.max(1, Number(e.target.value)))}
                          className="w-16 text-center font-bold text-[#0F100F] dark:text-white bg-white dark:bg-[#1A1C1A] border border-[#ECECEC] dark:border-white/[0.1] rounded-xl py-1 text-xs focus:outline-none"
                        />
                        <button
                          onClick={() => setMeters(meters + 1)}
                          className="w-8 h-8 rounded-full bg-white dark:bg-[#1A1C1A] hover:bg-gray-100 flex items-center justify-center text-[#0F100F] dark:text-white shadow-sm transition"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Wholesale Discount Tier Progress Bar */}
                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center justify-between text-[11px] font-semibold">
                        <span className="text-[#0F100F] dark:text-white">
                          {meters < 10
                            ? `Add ${10 - meters}m more to unlock Tier 1 (5% OFF)`
                            : meters < 50
                            ? `Add ${50 - meters}m more to unlock Tier 2 (15% OFF)`
                            : meters < 100
                            ? `Add ${100 - meters}m more to unlock Tier 3 (25% OFF)`
                            : '🎉 Maximum 25% Mill Direct Discount Active!'}
                        </span>
                        <span className="font-bold text-[#AC7900] dark:text-[#D4AF37]">
                          {pricing.wholesaleDiscountPercent}% OFF
                        </span>
                      </div>

                      {/* Visual Progress Bar */}
                      <div className="w-full h-2 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#AC7900] to-emerald-500 transition-all duration-500 rounded-full"
                          style={{
                            width: `${Math.min(100, meters >= 100 ? 100 : (meters / 100) * 100)}%`
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* SECTION 6: PRICING & ACTION BUTTONS */}
              <div className="border-t border-[#ECECEC] dark:border-white/[0.08] pt-5 space-y-4">
                <div className="flex items-end justify-between">
                  <div>
                    <span className="text-xs text-[#8A8883] dark:text-gray-400 block font-medium">Total Quotation</span>
                    <span className="text-2xl font-black font-editorial text-[#0F100F] dark:text-white">
                      INR {pricing.totalPrice.toLocaleString('en-IN')}.00
                    </span>
                  </div>

                  <div className="text-right text-xs text-[#8A8883] dark:text-gray-400">
                    <span>Includes base fabric + 300 DPI print</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={() => handleAddToCart(false)}
                    className="w-full bg-[#F9F6ED] dark:bg-[#242624] hover:bg-[#F3F0E8] dark:hover:bg-[#2c2e2c] text-[#0F100F] dark:text-white font-bold py-3 px-4 rounded-full text-xs flex items-center justify-center space-x-2 transition border border-[#ECECEC] dark:border-white/[0.1]"
                  >
                    <ShoppingCart className="w-4 h-4 text-[#AC7900]" />
                    <span>Add to Cart</span>
                  </button>

                  <button
                    onClick={() => handleAddToCart(true)}
                    className="w-full bg-[#0F100F] dark:bg-white hover:opacity-90 text-white dark:text-[#0F100F] font-bold py-3 px-4 rounded-full text-xs flex items-center justify-center space-x-2 transition shadow-md"
                  >
                    <span>Instant Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {onOpenBulkInquiry && (
                  <button
                    onClick={onOpenBulkInquiry}
                    className="w-full text-center text-xs text-[#AC7900] dark:text-[#D4AF37] hover:underline font-semibold pt-1 transition"
                  >
                    Need 500+ Meters? Request Factory Bulk Quote →
                  </button>
                )}
              </div>

            </div>
          </div>

        </div>

      </div>

      {/* MODALS */}
      <PreloadedDesignModal
        isOpen={preloadedModalOpen}
        onClose={() => setPreloadedModalOpen(false)}
        onSelectDesign={handleSelectPreloaded}
      />

      <SmartUrlImageExtractorModal
        isOpen={urlExtractorOpen}
        onClose={() => setUrlExtractorOpen(false)}
        onApplyExtractedImage={handleApplyExtractedImage}
      />

      <SwatchBookOrderModal
        isOpen={swatchBookModalOpen}
        onClose={() => setSwatchBookModalOpen(false)}
        onGoToCheckout={onGoToCheckout}
      />

    </div>
  );
};

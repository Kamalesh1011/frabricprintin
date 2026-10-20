import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  X,
  Upload,
  Sparkles,
  Layers,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Download,
  ShoppingBag,
  Check,
  Type,
  Image as ImageIcon,
  Palette,
  ShieldCheck,
  Trash2,
  Move,
  Info,
  ChevronRight,
  TrendingDown,
  RefreshCw,
  Percent,
  Globe,
  Link,
  Search,
  Sliders,
  Flame,
  Zap,
  Activity,
  Award,
  Repeat,
  Crosshair,
  CheckCircle2,
  Minimize2,
  Scissors
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CustomMerchItem, DecorationMethod, MerchColorVariant } from '../data/customMerchData';
import { useCart } from '../context/CartContext';
import { Product, StudioLightingType } from '../types';
import { ShimmerButton } from './ui/shimmer-button';
import { AnimatedBadge } from './ui/animated-badge';
import { NumberTicker } from './ui/number-ticker';
import { extractImageFromUrl } from '../services/api';

interface CustomMerchStudioModalProps {
  product: CustomMerchItem | null;
  isOpen: boolean;
  onClose: () => void;
  onGoToCheckout?: () => void;
}

export type SublimationWrapMode = 
  | 'c_design_wrap'      // C-Curve Anatomical Fabric Wrap
  | 'full_sublimation'   // Full Edge-to-Edge Fabric Bleed
  | 'chest_crest'        // Chest Logo / Crest Placement
  | 'roster_number'      // Name & Player Squad Number
  | 'repeat_pattern';    // Seamless All-Over Pattern Tile

interface ProductPrintZone {
  top: string;
  left: string;
  width: string;
  height: string;
  borderRadius?: string;
  clipPath?: string;
  zoneTitle: string;
}

// 🎯 Ultra-precise cloth print coordinates for each product
const getProductPrintZone = (product: CustomMerchItem): ProductPrintZone => {
  // 1. FLAGS
  if (product.category === 'FLAGS') {
    if (product.id.includes('feather') || product.id.includes('teardrop')) {
      return {
        top: '10%',
        left: '37%',
        width: '26%',
        height: '78%',
        borderRadius: '80px 20px 4px 4px',
        clipPath: 'polygon(0% 10%, 85% 0%, 100% 98%, 0% 100%)',
        zoneTitle: 'Vertical Teardrop Fabric Bleed',
      };
    }
    // Standard Standing Promotional Banner Flag (inside metal frame & grommets)
    return {
      top: '14.2%',
      left: '38%',
      width: '25.6%',
      height: '61%',
      borderRadius: '2px',
      clipPath: undefined,
      zoneTitle: 'Promotional Banner Fabric Area',
    };
  }

  // 2. BAGS (Tote Bags - strictly on the canvas body below straps)
  if (product.category === 'BAGS') {
    return {
      top: '38.5%',
      left: '26.5%',
      width: '47%',
      height: '51%',
      borderRadius: '4px 4px 18px 18px',
      clipPath: undefined,
      zoneTitle: 'Canvas Body Fabric Area',
    };
  }

  // 3. CAPS (Front 6-Panel Crown above the visor)
  if (product.category === 'CAPS') {
    return {
      top: '20%',
      left: '26%',
      width: '48%',
      height: '42%',
      borderRadius: '48px 48px 12px 12px',
      clipPath: 'polygon(15% 0%, 85% 0%, 100% 75%, 85% 100%, 15% 100%, 0% 75%)',
      zoneTitle: 'Front Crown Embroidery / Print Panel',
    };
  }

  // 4. SHIRTS
  if (product.category === 'SHIRTS') {
    if (product.id.includes('corp')) {
      // Formal Corporate Long-Sleeve Shirt
      return {
        top: '19%',
        left: '26%',
        width: '48%',
        height: '69%',
        borderRadius: '6px 6px 16px 16px',
        zoneTitle: 'Dress Shirt Chest & Front Panels',
      };
    }
    // Casual Resort Camp-Collar Shirt
    return {
      top: '19%',
      left: '29%',
      width: '42%',
      height: '68%',
      borderRadius: '4px 4px 14px 14px',
      zoneTitle: 'Resort Shirt Torso & Camp Panels',
    };
  }

  // 5. SPORTS : (SUBLIMATION)
  if (product.category === 'SPORTS') {
    if (product.subCategory === 'WOMENS') {
      return {
        top: '19%',
        left: '29%',
        width: '42%',
        height: '69%',
        borderRadius: '12px 12px 28px 28px',
        clipPath: 'polygon(18% 0%, 82% 0%, 94% 25%, 88% 100%, 12% 100%, 6% 25%)',
        zoneTitle: "Women's Athletic Torso & Body Drape",
      };
    }
    if (product.subCategory === 'BOYS') {
      return {
        top: '16%',
        left: '27%',
        width: '46%',
        height: '70%',
        borderRadius: '14px 14px 20px 20px',
        clipPath: 'polygon(15% 0%, 85% 0%, 100% 28%, 90% 100%, 10% 100%, 0% 28%)',
        zoneTitle: 'Boys Junior Sports Kit Cut',
      };
    }
    if (product.subCategory === 'GIRLS') {
      return {
        top: '21%',
        left: '29%',
        width: '42%',
        height: '67%',
        borderRadius: '14px 14px 20px 20px',
        clipPath: 'polygon(16% 0%, 84% 0%, 96% 28%, 88% 100%, 12% 100%, 4% 28%)',
        zoneTitle: 'Girls Junior Sports Kit Cut',
      };
    }
    // Men's Performance Jersey (Default)
    return {
      top: '15.5%',
      left: '27.5%',
      width: '45%',
      height: '72%',
      borderRadius: '16px 16px 20px 20px',
      clipPath: 'polygon(14% 0%, 86% 0%, 100% 26%, 90% 100%, 10% 100%, 0% 26%)',
      zoneTitle: "Men's Performance 360° Torso & Seam Wrap",
    };
  }

  // Generic Fallback
  return {
    top: '20%',
    left: '25%',
    width: '50%',
    height: '60%',
    borderRadius: '12px',
    zoneTitle: 'Product Fabric Print Zone',
  };
};

const CURATED_DESIGNS = [
  {
    name: 'Cyber Liquid Orbit',
    category: 'Sublimation Texture',
    url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=900',
    wrapMode: 'full_sublimation' as SublimationWrapMode,
  },
  {
    name: 'Geometric Hex Mesh',
    category: 'Performance Grid',
    url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=900',
    wrapMode: 'full_sublimation' as SublimationWrapMode,
  },
  {
    name: 'Abstract Fluid Ink',
    category: 'Vibrant Blend',
    url: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&q=80&w=900',
    wrapMode: 'c_design_wrap' as SublimationWrapMode,
  },
  {
    name: 'Gold Crest Monogram',
    category: 'Chest Crest',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=600',
    wrapMode: 'chest_crest' as SublimationWrapMode,
  },
];

export const CustomMerchStudioModal: React.FC<CustomMerchStudioModalProps> = ({
  product,
  isOpen,
  onClose,
  onGoToCheckout,
}) => {
  const { addToCart } = useCart();

  if (!isOpen || !product) return null;

  const printZone = useMemo(() => getProductPrintZone(product), [product]);

  // Selected state
  const [selectedColorIdx, setSelectedColorIdx] = useState<number>(0);
  const [selectedDecoration, setSelectedDecoration] = useState<DecorationMethod>(
    product.defaultDecoration || product.supportedDecorations[0]
  );
  const [quantity, setQuantity] = useState<number>(12);
  const [activeTab, setActiveTab] = useState<'upload' | 'url_link' | 'presets' | 'text' | 'adjust'>('upload');

  // Artwork & Sublimation Wrap State
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [wrapMode, setWrapMode] = useState<SublimationWrapMode>('full_sublimation');
  const [imageScale, setImageScale] = useState<number>(1);
  const [imageRotation, setImageRotation] = useState<number>(0);
  const [imagePos, setImagePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [blendMode, setBlendMode] = useState<'multiply' | 'normal'>('multiply');
  const [artworkOpacity, setArtworkOpacity] = useState<number>(0.95);
  const [showPrintZoneGuide, setShowPrintZoneGuide] = useState<boolean>(true);
  const [isSelectedOnCanvas, setIsSelectedOnCanvas] = useState<boolean>(true);

  // Google Image / URL Link State
  const [webImageUrl, setWebImageUrl] = useState<string>('');
  const [isExtractingUrl, setIsExtractingUrl] = useState<boolean>(false);
  const [urlExtractError, setUrlExtractError] = useState<string>('');
  const [extractedPalette, setExtractedPalette] = useState<string[]>([]);

  // Jersey Roster & Typography State
  const [customText, setCustomText] = useState<string>('');
  const [playerNumber, setPlayerNumber] = useState<string>('07');
  const [fontFamily, setFontFamily] = useState<string>('Impact');
  const [textColor, setTextColor] = useState<string>('#0F100F');
  const [fontSize, setFontSize] = useState<number>(24);

  // 3D Tilt interactive state
  const [tilt, setTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isHoveringCanvas, setIsHoveringCanvas] = useState<boolean>(false);

  // Interactive On-Canvas Bounding Box Manipulation state
  const [isDraggingGraphic, setIsDraggingGraphic] = useState<boolean>(false);
  const [activeHandle, setActiveHandle] = useState<'move' | 'scale_corner' | 'rotate' | null>(null);
  const dragStartRef = useRef<{
    clientX: number;
    clientY: number;
    initialPosX: number;
    initialPosY: number;
    initialScale: number;
    initialRotation: number;
    centerX: number;
    centerY: number;
  }>({
    clientX: 0,
    clientY: 0,
    initialPosX: 0,
    initialPosY: 0,
    initialScale: 1,
    initialRotation: 0,
    centerX: 0,
    centerY: 0,
  });

  const graphicContainerRef = useRef<HTMLDivElement>(null);

  // Current active color variant
  const currentColor: MerchColorVariant =
    product.colors[selectedColorIdx] || product.colors[0];

  // Calculate pricing based on volume tiers
  const activeTier = product.wholesaleTiers.reduce((acc, tier) => {
    if (quantity >= tier.minQty) {
      if (tier.maxQty === null || quantity <= tier.maxQty) {
        return tier;
      }
    }
    return acc;
  }, product.wholesaleTiers[0]);

  const unitPrice = activeTier ? activeTier.unitPrice : product.basePrice;
  const standardTotal = product.basePrice * quantity;
  const discountedTotal = unitPrice * quantity;
  const totalSavings = standardTotal - discountedTotal;

  // Available Sizes for category
  const isApparelCategory = product.category === 'SPORTS' || product.category === 'SHIRTS';

  const availableSizes = useMemo(() => {
    if (isApparelCategory) {
      return ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'];
    }
    if (product.category === 'CAPS') {
      return ['One Size (Snapback)', 'S/M (Fitted)', 'L/XL (Fitted)'];
    }
    if (product.category === 'FLAGS') {
      return ['Standard (3-5 ft)', 'Large (4-6 ft)', 'Mini (2-3 ft)'];
    }
    if (product.category === 'BAGS') {
      return ['Standard (15-16 in)', 'Oversized (18-20 in)'];
    }
    return ['Standard', 'Large'];
  }, [product.category, isApparelCategory]);

  const [sizeBreakdown, setSizeBreakdown] = useState<Record<string, number>>(() => {
    if (isApparelCategory) {
      return { 'S': 4, 'M': 4, 'L': 4 };
    }
    return { 'Standard': 12 };
  });

  // Size matrix helpers
  const handleUpdateSizeCount = (size: string, delta: number) => {
    setSizeBreakdown(prev => {
      const current = prev[size] || 0;
      const nextVal = Math.max(0, current + delta);
      const updated = { ...prev, [size]: nextVal };
      const total = Object.values(updated).reduce((s, v) => s + (v || 0), 0);
      setQuantity(Math.max(1, total));
      return updated;
    });
  };

  const handleSetSizeCount = (size: string, value: number) => {
    const val = Math.max(0, isNaN(value) ? 0 : value);
    setSizeBreakdown(prev => {
      const updated = { ...prev, [size]: val };
      const total = Object.values(updated).reduce((s, v) => s + (v || 0), 0);
      setQuantity(Math.max(1, total));
      return updated;
    });
  };

  const handleAdjustTotalQuantity = (newQty: number) => {
    const validQty = Math.max(product.moq || 1, newQty);
    setQuantity(validQty);
    const activeKeys = Object.keys(sizeBreakdown).filter(k => (sizeBreakdown[k] || 0) > 0);
    const targetKeys = activeKeys.length > 0
      ? activeKeys
      : (isApparelCategory ? ['S', 'M', 'L'] : [availableSizes[0]]);
    const perSize = Math.floor(validQty / targetKeys.length);
    const remainder = validQty % targetKeys.length;
    const nextBreakdown: Record<string, number> = {};
    availableSizes.forEach(s => { nextBreakdown[s] = 0; });
    targetKeys.forEach((s, idx) => {
      nextBreakdown[s] = perSize + (idx < remainder ? 1 : 0);
    });
    setSizeBreakdown(nextBreakdown);
  };

  const handleSplitEvenly = () => {
    const targetSizes = isApparelCategory
      ? ['S', 'M', 'L', 'XL']
      : availableSizes;
    const countPerSize = Math.floor(quantity / targetSizes.length);
    const remainder = quantity % targetSizes.length;
    const newBreakdown: Record<string, number> = {};
    availableSizes.forEach(s => {
      newBreakdown[s] = 0;
    });
    targetSizes.forEach((s, i) => {
      newBreakdown[s] = countPerSize + (i < remainder ? 1 : 0);
    });
    setSizeBreakdown(newBreakdown);
  };

  // Wrap Mode Handler
  const handleApplyWrapMode = (mode: SublimationWrapMode) => {
    setWrapMode(mode);
    setIsSelectedOnCanvas(true);
    if (mode === 'full_sublimation') {
      setImagePos({ x: 0, y: 0 });
      setImageScale(1.0);
      setImageRotation(0);
      setBlendMode('multiply');
    } else if (mode === 'c_design_wrap') {
      setImagePos({ x: 0, y: 0 });
      setImageScale(1.15);
      setImageRotation(0);
      setBlendMode('multiply');
    } else if (mode === 'chest_crest') {
      setImagePos({ x: -20, y: -25 });
      setImageScale(0.45);
      setImageRotation(0);
      setBlendMode('normal');
    } else if (mode === 'roster_number') {
      setImagePos({ x: 0, y: -10 });
      setImageScale(0.7);
      setImageRotation(0);
      setBlendMode('multiply');
    } else if (mode === 'repeat_pattern') {
      setImagePos({ x: 0, y: 0 });
      setImageScale(0.5);
      setImageRotation(0);
      setBlendMode('multiply');
    }
  };

  // File Upload Handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string);
        setIsSelectedOnCanvas(true);
        handleApplyWrapMode('full_sublimation');
      };
      reader.readAsDataURL(file);
    }
  };

  // Google Images / Web URL Extractor Handler
  const handleExtractFromUrl = async (urlOverride?: string) => {
    const targetUrl = (urlOverride || webImageUrl).trim();
    if (!targetUrl) {
      setUrlExtractError('Please paste an image link from Google Images or any web URL.');
      return;
    }

    setUrlExtractError('');
    setIsExtractingUrl(true);

    try {
      const result = await extractImageFromUrl(targetUrl);
      if (result && result.extractedImageUrl) {
        setUploadedImage(result.extractedImageUrl);
        if (result.palette && result.palette.length > 0) {
          setExtractedPalette(result.palette);
        }
        setIsSelectedOnCanvas(true);
        handleApplyWrapMode('full_sublimation');
      } else {
        setUploadedImage(targetUrl);
        setIsSelectedOnCanvas(true);
        handleApplyWrapMode('full_sublimation');
      }
    } catch (err: any) {
      setUploadedImage(targetUrl);
      setIsSelectedOnCanvas(true);
      handleApplyWrapMode('full_sublimation');
    } finally {
      setIsExtractingUrl(false);
    }
  };

  // 3D Perspective Tilt on Mouse Movement
  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (activeHandle) return; // Don't tilt while transforming
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const tiltX = -((y - centerY) / centerY) * 8;
    const tiltY = ((x - centerX) / centerX) * 8;

    setTilt({ x: tiltX, y: tiltY });
  };

  const handleCanvasMouseLeave = () => {
    if (!activeHandle) {
      setIsHoveringCanvas(false);
      setTilt({ x: 0, y: 0 });
    }
  };

  // ==================== INTERACTIVE ON-CANVAS HANDLERS (WORD / CANVA STYLE) ====================
  const handleGraphicPointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsSelectedOnCanvas(true);
    setActiveHandle('move');

    const rect = graphicContainerRef.current?.getBoundingClientRect();
    dragStartRef.current = {
      clientX: e.clientX,
      clientY: e.clientY,
      initialPosX: imagePos.x,
      initialPosY: imagePos.y,
      initialScale: imageScale,
      initialRotation: imageRotation,
      centerX: rect ? rect.left + rect.width / 2 : e.clientX,
      centerY: rect ? rect.top + rect.height / 2 : e.clientY,
    };
  };

  const handleCornerHandlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsSelectedOnCanvas(true);
    setActiveHandle('scale_corner');

    const rect = graphicContainerRef.current?.getBoundingClientRect();
    dragStartRef.current = {
      clientX: e.clientX,
      clientY: e.clientY,
      initialPosX: imagePos.x,
      initialPosY: imagePos.y,
      initialScale: imageScale,
      initialRotation: imageRotation,
      centerX: rect ? rect.left + rect.width / 2 : e.clientX,
      centerY: rect ? rect.top + rect.height / 2 : e.clientY,
    };
  };

  const handleRotateHandlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsSelectedOnCanvas(true);
    setActiveHandle('rotate');

    const rect = graphicContainerRef.current?.getBoundingClientRect();
    dragStartRef.current = {
      clientX: e.clientX,
      clientY: e.clientY,
      initialPosX: imagePos.x,
      initialPosY: imagePos.y,
      initialScale: imageScale,
      initialRotation: imageRotation,
      centerX: rect ? rect.left + rect.width / 2 : e.clientX,
      centerY: rect ? rect.top + rect.height / 2 : e.clientY,
    };
  };

  // Global window pointermove and pointerup listeners for ultra-smooth 60fps interaction
  useEffect(() => {
    const handleGlobalPointerMove = (e: PointerEvent) => {
      if (!activeHandle) return;

      if (activeHandle === 'move') {
        const deltaX = e.clientX - dragStartRef.current.clientX;
        const deltaY = e.clientY - dragStartRef.current.clientY;
        setImagePos({
          x: Math.round(dragStartRef.current.initialPosX + deltaX * 0.8),
          y: Math.round(dragStartRef.current.initialPosY + deltaY * 0.8),
        });
      } else if (activeHandle === 'scale_corner') {
        const initialDist = Math.hypot(
          dragStartRef.current.clientX - dragStartRef.current.centerX,
          dragStartRef.current.clientY - dragStartRef.current.centerY
        );
        const currentDist = Math.hypot(
          e.clientX - dragStartRef.current.centerX,
          e.clientY - dragStartRef.current.centerY
        );
        const scaleFactor = currentDist / Math.max(initialDist, 1);
        const newScale = Math.max(0.2, Math.min(3.0, dragStartRef.current.initialScale * scaleFactor));
        setImageScale(Number(newScale.toFixed(2)));
      } else if (activeHandle === 'rotate') {
        const rad = Math.atan2(
          e.clientY - dragStartRef.current.centerY,
          e.clientX - dragStartRef.current.centerX
        );
        let deg = Math.round((rad * 180) / Math.PI + 90);
        deg = (deg % 360 + 360) % 360;
        setImageRotation(deg);
      }
    };

    const handleGlobalPointerUp = () => {
      setActiveHandle(null);
    };

    if (activeHandle) {
      window.addEventListener('pointermove', handleGlobalPointerMove);
      window.addEventListener('pointerup', handleGlobalPointerUp);
    }

    return () => {
      window.removeEventListener('pointermove', handleGlobalPointerMove);
      window.removeEventListener('pointerup', handleGlobalPointerUp);
    };
  }, [activeHandle]);

  // Add to Cart
  const handleAddToCart = () => {
    const mockProduct: Product = {
      id: product.id,
      name: `Customized ${product.name} (${currentColor.name})`,
      category: 'Cotton',
      images: [currentColor.image],
      count: 'Custom Merch',
      color: currentColor.name,
      weave_type: selectedDecoration,
      price_per_meter: unitPrice,
      swatch_test_price: product.samplePrice,
      swatch_big_price: unitPrice,
      print_surcharge_per_meter: 0,
      description: `${product.description} · Technique: ${selectedDecoration} · Zone: ${printZone.zoneTitle} · Shade: ${currentColor.name}`,
      featured: true,
      in_stock: true,
      gsm: 0,
      width: product.dimensions || 'Standard',
      composition: product.materialSpecs,
      rating: 4.9,
      reviews_count: 24,
    };

    addToCart(
      mockProduct,
      'apparel',
      quantity,
      {
        requiresPrint: true,
        designUrl: uploadedImage || webImageUrl || currentColor.image,
        inkType: selectedDecoration === 'SUBLIMATION' ? 'reactive_digital' : 'pigment',
        dpi: 300,
        repeatType: wrapMode === 'repeat_pattern' ? 'drop' : 'straight',
        notes: `Custom ${product.name} · Technique: ${selectedDecoration} · Zone: ${printZone.zoneTitle} · Wrap: ${wrapMode} · Scale: ${Math.round(imageScale * 100)}% · Rot: ${imageRotation}°${customText ? ` · Text: "${customText}"` : ''}${playerNumber ? ` · No: #${playerNumber}` : ''}`,
      },
      undefined,
      currentColor.name,
      {
        sizeBreakdown,
        customPreviewUrl: uploadedImage || currentColor.image,
      }
    );

    onClose();
    if (onGoToCheckout) {
      onGoToCheckout();
    }
  };

  return (
    <div
      onClick={() => setIsSelectedOnCanvas(false)}
      className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-6xl bg-[#FEFBF1] dark:bg-[#121312] rounded-[32px] border border-black/10 dark:border-white/15 shadow-2xl overflow-hidden text-[#0F100F] dark:text-white flex flex-col max-h-[94vh]"
      >
        
        {/* Top Studio Modal Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-black/[0.08] dark:border-white/[0.08] bg-white/70 dark:bg-white/[0.02]">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  {product.category} · {product.subCategory || 'Custom Blank'}
                </span>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold flex items-center space-x-1">
                  <Activity className="w-3 h-3 animate-pulse" />
                  <span>Interactive Drag &amp; Corner Scale Active</span>
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold font-editorial">{product.name}</h2>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-slate-400 hover:text-black dark:hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Main Content (2 Columns) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-y-auto">
          
          {/* LEFT 7 COLS: INTERACTIVE 3D PRODUCT MOCKUP CANVAS WITH ON-CANVAS BOUNDING BOX */}
          <div className="lg:col-span-7 bg-[#F4EFE6] dark:bg-[#0A0B0A] p-6 sm:p-8 flex flex-col items-center justify-between relative select-none border-b lg:border-b-0 lg:border-r border-black/[0.08] dark:border-white/[0.08]">
            
            {/* Canvas Header Pills */}
            <div className="w-full flex items-center justify-between text-xs mb-2">
              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 rounded-full bg-white/80 dark:bg-white/10 backdrop-blur-md border border-black/10 dark:border-white/10 font-bold text-slate-700 dark:text-slate-300">
                  {currentColor.name}
                </span>
                <span className="px-3 py-1 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 font-bold border border-amber-500/20">
                  {selectedDecoration} Mode
                </span>
              </div>
              
              <button
                onClick={() => setShowPrintZoneGuide((prev) => !prev)}
                className={`text-[11px] px-2.5 py-1 rounded-full border transition flex items-center space-x-1 ${
                  showPrintZoneGuide
                    ? 'bg-amber-500/15 border-amber-500/30 text-amber-700 dark:text-amber-300 font-bold'
                    : 'bg-black/5 dark:bg-white/5 border-transparent text-slate-400'
                }`}
              >
                <Crosshair className="w-3 h-3" />
                <span>Cloth Print Boundary</span>
              </button>
            </div>

            {/* The 3D Interactive Preview Frame with Exact Cloth Masking */}
            <div
              onMouseEnter={() => setIsHoveringCanvas(true)}
              onMouseMove={handleCanvasMouseMove}
              onMouseLeave={handleCanvasMouseLeave}
              style={{
                perspective: '1200px',
              }}
              className="relative w-full max-w-[480px] aspect-square my-auto flex items-center justify-center cursor-default"
            >
              <motion.div
                animate={{
                  rotateX: tilt.x,
                  rotateY: tilt.y,
                  scale: isHoveringCanvas ? 1.02 : 1,
                }}
                transition={{ type: 'spring', stiffness: 280, damping: 22 }}
                className="relative w-full h-full flex items-center justify-center"
              >
                {/* 1. Base 3D Photorealistic White Studio Mockup Image */}
                <img
                  src={currentColor.image}
                  alt={product.name}
                  className="w-full h-full object-contain filter drop-shadow-2xl pointer-events-none transition-all duration-300"
                />

                {/* 2. 🎯 Ultra-Accurate Product Cloth Print Zone Layer */}
                <div
                  className={`absolute overflow-hidden transition-all duration-150 ${
                    showPrintZoneGuide
                      ? 'ring-1 ring-amber-500/60 ring-offset-1'
                      : ''
                  }`}
                  style={{
                    top: printZone.top,
                    left: printZone.left,
                    width: printZone.width,
                    height: printZone.height,
                    borderRadius: printZone.borderRadius,
                    clipPath: printZone.clipPath,
                  }}
                >
                  {/* Uploaded / Link Artwork Container with Interactive Selection */}
                  {uploadedImage && (
                    <div
                      ref={graphicContainerRef}
                      onPointerDown={handleGraphicPointerDown}
                      className={`absolute inset-0 flex items-center justify-center cursor-move select-none ${
                        isSelectedOnCanvas
                          ? 'ring-2 ring-amber-500 shadow-2xl'
                          : 'hover:ring-1 hover:ring-amber-500/50'
                      }`}
                      style={{
                        transform: `translate(${imagePos.x}px, ${imagePos.y}px) rotate(${imageRotation}deg) scale(${imageScale})`,
                        transformOrigin: 'center center',
                        transition: activeHandle ? 'none' : 'transform 0.08s ease-out',
                      }}
                    >
                      {/* Artwork Rendering */}
                      {wrapMode === 'repeat_pattern' ? (
                        <div
                          className="w-full h-full pointer-events-none"
                          style={{
                            backgroundImage: `url(${uploadedImage})`,
                            backgroundSize: '35%',
                            backgroundRepeat: 'repeat',
                            opacity: artworkOpacity,
                            mixBlendMode: blendMode,
                          }}
                        />
                      ) : (
                        <img
                          src={uploadedImage}
                          alt="Sublimation Custom Graphic"
                          className="w-full h-full object-contain select-none pointer-events-none"
                          style={{
                            opacity: artworkOpacity,
                            mixBlendMode: blendMode,
                            filter:
                              selectedDecoration === 'SUBLIMATION'
                                ? 'contrast(112%) saturate(1.2)'
                                : 'drop-shadow(0px 1px 2px rgba(0,0,0,0.3))',
                          }}
                        />
                      )}

                      {/* 🌟 4 CORNER RESIZE & ROTATE HANDLES (WORD / CANVA STYLE) */}
                      {isSelectedOnCanvas && (
                        <>
                          {/* Top-Left Corner Resize Handle */}
                          <div
                            onPointerDown={handleCornerHandlePointerDown}
                            className="absolute -top-2 -left-2 w-4 h-4 bg-white border-2 border-amber-600 rounded-full cursor-nwse-resize shadow-lg hover:scale-125 transition-transform z-30 flex items-center justify-center"
                            title="Drag to resize / scale"
                          >
                            <span className="w-1.5 h-1.5 bg-amber-600 rounded-full" />
                          </div>

                          {/* Top-Right Corner Resize Handle */}
                          <div
                            onPointerDown={handleCornerHandlePointerDown}
                            className="absolute -top-2 -right-2 w-4 h-4 bg-white border-2 border-amber-600 rounded-full cursor-nesw-resize shadow-lg hover:scale-125 transition-transform z-30 flex items-center justify-center"
                            title="Drag to resize / scale"
                          >
                            <span className="w-1.5 h-1.5 bg-amber-600 rounded-full" />
                          </div>

                          {/* Bottom-Left Corner Resize Handle */}
                          <div
                            onPointerDown={handleCornerHandlePointerDown}
                            className="absolute -bottom-2 -left-2 w-4 h-4 bg-white border-2 border-amber-600 rounded-full cursor-nesw-resize shadow-lg hover:scale-125 transition-transform z-30 flex items-center justify-center"
                            title="Drag to resize / scale"
                          >
                            <span className="w-1.5 h-1.5 bg-amber-600 rounded-full" />
                          </div>

                          {/* Bottom-Right Corner Resize Handle */}
                          <div
                            onPointerDown={handleCornerHandlePointerDown}
                            className="absolute -bottom-2 -right-2 w-4 h-4 bg-white border-2 border-amber-600 rounded-full cursor-nwse-resize shadow-lg hover:scale-125 transition-transform z-30 flex items-center justify-center"
                            title="Drag to resize / scale"
                          >
                            <span className="w-1.5 h-1.5 bg-amber-600 rounded-full" />
                          </div>

                          {/* Top Rotation Stem & Circular Rotation Handle */}
                          <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex flex-col items-center z-30">
                            <div
                              onPointerDown={handleRotateHandlePointerDown}
                              onClick={(e) => {
                                e.stopPropagation();
                                setImageRotation((prev) => (prev + 90) % 360);
                              }}
                              className="w-6 h-6 bg-amber-600 text-white rounded-full flex items-center justify-center shadow-xl cursor-grab active:cursor-grabbing hover:scale-115 transition-transform"
                              title="Drag to rotate freely or click for 90°"
                            >
                              <RotateCw className="w-3.5 h-3.5 animate-spin-once" />
                            </div>
                            <div className="w-0.5 h-3 bg-amber-600" />
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  {/* Custom Typography & Roster Number */}
                  {(customText || (wrapMode === 'roster_number' && playerNumber)) && (
                    <div
                      className="absolute inset-0 flex flex-col items-center justify-center p-2 select-none pointer-events-none"
                      style={{
                        mixBlendMode: blendMode,
                        opacity: artworkOpacity,
                        transform: `translate(${imagePos.x}px, ${imagePos.y}px) rotate(${imageRotation}deg)`,
                      }}
                    >
                      {customText && (
                        <span
                          className="font-black uppercase text-center leading-none tracking-wider drop-shadow-md"
                          style={{
                            fontFamily,
                            color: textColor,
                            fontSize: `${fontSize * 0.75}px`,
                          }}
                        >
                          {customText}
                        </span>
                      )}
                      {wrapMode === 'roster_number' && playerNumber && (
                        <span
                          className="font-black text-center leading-none mt-1"
                          style={{
                            fontFamily,
                            color: textColor,
                            fontSize: `${fontSize * 1.8}px`,
                            textShadow: '0 2px 4px rgba(0,0,0,0.25)',
                          }}
                        >
                          {playerNumber}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Real-time Sublimation Fabric Shading Overlay (Preserves natural creases & folds) */}
                  <div
                    className="absolute inset-0 pointer-events-none opacity-25 mix-blend-multiply"
                    style={{
                      backgroundImage:
                        'radial-gradient(ellipse at 50% 30%, rgba(255,255,255,0.7) 0%, transparent 60%), linear-gradient(180deg, rgba(0,0,0,0.08) 0%, transparent 40%, rgba(0,0,0,0.12) 100%)',
                    }}
                  />

                  {/* Empty State Prompt inside the exact cloth zone */}
                  {!uploadedImage && !customText && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-3 text-center bg-black/10 dark:bg-white/10 backdrop-blur-xs border border-dashed border-amber-500/60 rounded-xl">
                      <Move className="w-5 h-5 mx-auto text-amber-600 dark:text-amber-400 animate-bounce" />
                      <span className="text-[11px] font-bold text-slate-800 dark:text-slate-100 block mt-1">
                        Cloth Print Area
                      </span>
                      <span className="text-[9px] text-slate-500 block">
                        Upload or Paste Image Link
                      </span>
                    </div>
                  )}
                </div>

                {/* Floating Quick Action Toolbar Directly Attached to Selected Artwork */}
                {uploadedImage && isSelectedOnCanvas && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="absolute top-3 inset-x-4 mx-auto max-w-xs bg-[#0F100F]/90 dark:bg-white/95 backdrop-blur-md text-white dark:text-[#0F100F] px-3 py-1.5 rounded-full shadow-2xl border border-white/20 dark:border-black/10 flex items-center justify-around text-xs font-bold z-30 animate-in slide-in-from-top-2 duration-150"
                  >
                    <button
                      onClick={() => setImageScale((prev) => Math.min(2.5, prev + 0.15))}
                      className="p-1 rounded-full hover:bg-white/20 dark:hover:bg-black/10 transition flex items-center space-x-1"
                      title="Enlarge Graphic (+)"
                    >
                      <ZoomIn className="w-3.5 h-3.5 text-amber-400" />
                      <span className="text-[10px]">Enlarge</span>
                    </button>

                    <button
                      onClick={() => setImageScale((prev) => Math.max(0.3, prev - 0.15))}
                      className="p-1 rounded-full hover:bg-white/20 dark:hover:bg-black/10 transition flex items-center space-x-1"
                      title="Shrink Graphic (-)"
                    >
                      <ZoomOut className="w-3.5 h-3.5 text-amber-400" />
                      <span className="text-[10px]">Shrink</span>
                    </button>

                    <button
                      onClick={() => setImageRotation((prev) => (prev + 90) % 360)}
                      className="p-1 rounded-full hover:bg-white/20 dark:hover:bg-black/10 transition flex items-center space-x-1"
                      title="Rotate 90 degrees"
                    >
                      <RotateCw className="w-3.5 h-3.5" />
                      <span className="text-[10px]">90°</span>
                    </button>

                    <button
                      onClick={() => {
                        setImagePos({ x: 0, y: 0 });
                        setImageScale(1.0);
                        setImageRotation(0);
                      }}
                      className="p-1 rounded-full hover:bg-white/20 dark:hover:bg-black/10 transition flex items-center space-x-1"
                      title="Center & reset"
                    >
                      <Move className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-[10px]">Center</span>
                    </button>

                    <button
                      onClick={() => {
                        setUploadedImage(null);
                        setImagePos({ x: 0, y: 0 });
                      }}
                      className="p-1 rounded-full text-rose-400 hover:bg-rose-500/20 transition"
                      title="Delete Artwork"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Sublimation Wrap Mode Badge */}
                <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md text-white text-[10px] font-bold border border-white/20 flex items-center space-x-1.5 shadow-lg">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>
                    {printZone.zoneTitle} · {Math.round(imageScale * 100)}% Size · {imageRotation}°
                  </span>
                </div>
              </motion.div>
            </div>

            {/* Canvas Transformation & Zoom Controls Bar */}
            <div className="w-full flex items-center justify-between pt-3 border-t border-black/5 dark:border-white/5">
              <div className="flex items-center space-x-1.5">
                <button
                  onClick={() => setImageScale((prev) => Math.max(0.4, prev - 0.1))}
                  className="p-2 rounded-xl bg-white dark:bg-[#1A1C1A] border border-black/10 dark:border-white/15 text-xs font-bold hover:scale-105 transition shadow-xs"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setImageScale((prev) => Math.min(2.5, prev + 0.1))}
                  className="p-2 rounded-xl bg-white dark:bg-[#1A1C1A] border border-black/10 dark:border-white/15 text-xs font-bold hover:scale-105 transition shadow-xs"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setImageRotation((prev) => (prev + 90) % 360)}
                  className="p-2 rounded-xl bg-white dark:bg-[#1A1C1A] border border-black/10 dark:border-white/15 text-xs font-bold hover:scale-105 transition shadow-xs"
                  title="Rotate 90°"
                >
                  <RotateCw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setImagePos({ x: 0, y: 0 });
                    setImageScale(1.0);
                    setImageRotation(0);
                  }}
                  className="px-3 py-2 rounded-xl bg-white dark:bg-[#1A1C1A] border border-black/10 dark:border-white/15 text-xs font-bold hover:scale-105 transition shadow-xs flex items-center space-x-1"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-amber-600" />
                  <span>Fit Cloth</span>
                </button>
              </div>

              {/* Ink Blend Mode Toggle */}
              <div className="flex items-center space-x-1 bg-black/5 dark:bg-white/5 p-1 rounded-xl text-[10px] font-bold">
                <button
                  onClick={() => setBlendMode('multiply')}
                  className={`px-2 py-1 rounded-lg transition ${
                    blendMode === 'multiply'
                      ? 'bg-white dark:bg-[#202220] shadow-xs text-amber-600 dark:text-amber-400'
                      : 'text-slate-500'
                  }`}
                  title="Sublimation Dye (realistic fabric blend)"
                >
                  Sublimation Dye
                </button>
                <button
                  onClick={() => setBlendMode('normal')}
                  className={`px-2 py-1 rounded-lg transition ${
                    blendMode === 'normal'
                      ? 'bg-white dark:bg-[#202220] shadow-xs text-amber-600 dark:text-amber-400'
                      : 'text-slate-500'
                  }`}
                  title="DTF Transfer (solid vinyl layer)"
                >
                  DTF Film
                </button>
              </div>
            </div>

          </div>

          {/* RIGHT 5 COLS: CONTROLS, GOOGLE URL EXTRACTOR, WRAP MODES & WHOLESALE PRICING */}
          <div className="lg:col-span-5 p-6 sm:p-8 space-y-5 overflow-y-auto bg-white dark:bg-[#161716]">
            
            {/* 1. Shade / Color Swatch Selector */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 font-editorial">
                  1. Blank Base Mockup:
                </label>
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                  {currentColor.name}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color, idx) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColorIdx(idx)}
                    className={`w-9 h-9 rounded-2xl border-2 transition-all flex items-center justify-center ${
                      selectedColorIdx === idx
                        ? 'border-[#0F100F] dark:border-white scale-110 shadow-md ring-2 ring-amber-500/40'
                        : 'border-black/20 dark:border-white/20 hover:scale-105'
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  >
                    {selectedColorIdx === idx && (
                      <Check
                        className={`w-4 h-4 ${
                          color.hex === '#FFFFFF' || color.hex === '#F4F4F4' || color.hex === '#EDE6D8'
                            ? 'text-black'
                            : 'text-white'
                        }`}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Decoration Technique Tabs */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 font-editorial">
                2. Print Decoration Method:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {product.supportedDecorations.map((tech) => (
                  <button
                    key={tech}
                    onClick={() => {
                      setSelectedDecoration(tech);
                      if (tech === 'SUBLIMATION') {
                        setBlendMode('multiply');
                      } else {
                        setBlendMode('normal');
                      }
                    }}
                    className={`p-2.5 rounded-2xl border text-xs font-bold text-left transition ${
                      selectedDecoration === tech
                        ? 'border-amber-600 bg-amber-500/10 text-amber-700 dark:text-amber-300 shadow-xs'
                        : 'border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 hover:border-amber-500'
                    }`}
                  >
                    <span className="block leading-none">{tech}</span>
                    <span className="text-[9px] opacity-75 font-normal block mt-1">
                      {tech === 'SUBLIMATION'
                        ? 'Dye infused'
                        : tech === 'DTG'
                        ? 'Direct garment'
                        : 'Vibrant film'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Sublimation Wrap & Framing Modes */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 font-editorial flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>3. Framing &amp; Wrap Mode:</span>
                </label>
                <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold">
                  {wrapMode.replace(/_/g, ' ').toUpperCase()}
                </span>
              </div>
              
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'full_sublimation', label: 'Full Cloth Bleed', desc: 'Edge-to-Edge Wrap' },
                  { id: 'c_design_wrap', label: 'C-Cut Curve', desc: 'Anatomical Jersey' },
                  { id: 'chest_crest', label: 'Chest Crest', desc: 'Sponsor / Club Logo' },
                  { id: 'roster_number', label: 'Roster Squad', desc: 'Back & Name Arch' },
                  { id: 'repeat_pattern', label: 'Pattern Repeat', desc: 'Seamless All-Over' },
                ].map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => handleApplyWrapMode(mode.id as SublimationWrapMode)}
                    className={`p-2 rounded-xl text-left border transition ${
                      wrapMode === mode.id
                        ? 'border-amber-500 bg-amber-500/15 text-amber-800 dark:text-amber-200 font-bold shadow-xs'
                        : 'border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02] text-slate-600 dark:text-slate-300 hover:border-black/20'
                    }`}
                  >
                    <div className="text-[11px] leading-tight font-bold">{mode.label}</div>
                    <div className="text-[9px] opacity-70 leading-tight mt-0.5">{mode.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Artwork Input Tabs (Upload File vs Google Images Link vs Presets vs Text) */}
            <div className="space-y-3 pt-2 border-t border-black/5 dark:border-white/5">
              <div className="grid grid-cols-4 rounded-2xl bg-black/5 dark:bg-white/5 p-1 border border-black/5 dark:border-white/10 text-[11px] font-bold">
                <button
                  onClick={() => setActiveTab('upload')}
                  className={`py-1.5 rounded-xl flex items-center justify-center space-x-1 transition ${
                    activeTab === 'upload'
                      ? 'bg-white dark:bg-[#202220] shadow-xs text-black dark:text-white'
                      : 'text-slate-500'
                  }`}
                >
                  <Upload className="w-3 h-3" />
                  <span>File</span>
                </button>
                <button
                  onClick={() => setActiveTab('url_link')}
                  className={`py-1.5 rounded-xl flex items-center justify-center space-x-1 transition ${
                    activeTab === 'url_link'
                      ? 'bg-white dark:bg-[#202220] shadow-xs text-amber-600 dark:text-amber-400'
                      : 'text-slate-500'
                  }`}
                >
                  <Globe className="w-3 h-3" />
                  <span>Image URL</span>
                </button>
                <button
                  onClick={() => setActiveTab('presets')}
                  className={`py-1.5 rounded-xl flex items-center justify-center space-x-1 transition ${
                    activeTab === 'presets'
                      ? 'bg-white dark:bg-[#202220] shadow-xs text-black dark:text-white'
                      : 'text-slate-500'
                  }`}
                >
                  <Flame className="w-3 h-3" />
                  <span>Presets</span>
                </button>
                <button
                  onClick={() => setActiveTab('text')}
                  className={`py-1.5 rounded-xl flex items-center justify-center space-x-1 transition ${
                    activeTab === 'text'
                      ? 'bg-white dark:bg-[#202220] shadow-xs text-black dark:text-white'
                      : 'text-slate-500'
                  }`}
                >
                  <Type className="w-3 h-3" />
                  <span>Text</span>
                </button>
              </div>

              {/* Tab 1: File Upload */}
              {activeTab === 'upload' && (
                <div className="space-y-3 animate-in fade-in duration-200">
                  <label className="border-2 border-dashed border-black/15 dark:border-white/15 rounded-2xl p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:border-amber-500 transition bg-white/40 dark:bg-white/[0.02]">
                    <Upload className="w-6 h-6 text-amber-600 dark:text-amber-400 mb-1" />
                    <span className="text-xs font-bold text-black dark:text-white">
                      Click to upload Design (PNG, JPG, SVG, PSD)
                    </span>
                    <span className="text-[10px] text-slate-400 mt-0.5">
                      Automatically maps into {printZone.zoneTitle} with interactive corner resize handles
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              )}

              {/* Tab 2: Google Images / Web URL Link Input */}
              {activeTab === 'url_link' && (
                <div className="space-y-3 animate-in fade-in duration-200">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 flex items-center justify-between">
                      <span>Paste Google Images or Web Link:</span>
                      <span className="text-[9px] text-amber-600 dark:text-amber-400">Right click &gt; Copy Image Address</span>
                    </label>
                    <div className="flex space-x-1.5">
                      <div className="relative flex-1">
                        <Link className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                        <input
                          type="url"
                          value={webImageUrl}
                          onChange={(e) => setWebImageUrl(e.target.value)}
                          placeholder="https://... (paste any image link from Google)"
                          className="w-full pl-8 pr-3 py-2 rounded-xl border border-black/10 dark:border-white/15 bg-white dark:bg-[#1A1C1A] text-xs font-medium focus:ring-2 focus:ring-amber-500 outline-none"
                        />
                      </div>
                      <button
                        onClick={() => handleExtractFromUrl()}
                        disabled={isExtractingUrl}
                        className="px-3.5 py-2 rounded-xl bg-amber-600 text-white text-xs font-bold hover:bg-amber-700 transition disabled:opacity-50 flex items-center space-x-1 shadow-sm"
                      >
                        {isExtractingUrl ? (
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <span>Apply</span>
                        )}
                      </button>
                    </div>
                    {urlExtractError && (
                      <p className="text-[10px] text-rose-500 font-medium">{urlExtractError}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Tab 3: Curated Design Presets */}
              {activeTab === 'presets' && (
                <div className="space-y-2 animate-in fade-in duration-200">
                  <div className="grid grid-cols-2 gap-2">
                    {CURATED_DESIGNS.map((item) => (
                      <button
                        key={item.name}
                        onClick={() => {
                          setUploadedImage(item.url);
                          handleApplyWrapMode(item.wrapMode);
                        }}
                        className="p-2 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#1A1C1A] text-left hover:border-amber-500 transition group flex items-center space-x-2 shadow-xs"
                      >
                        <img
                          src={item.url}
                          alt={item.name}
                          className="w-10 h-10 rounded-lg object-cover group-hover:scale-105 transition"
                        />
                        <div className="overflow-hidden">
                          <div className="text-[11px] font-bold truncate">{item.name}</div>
                          <div className="text-[9px] text-slate-400">{item.category}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 4: Typography & Roster Number */}
              {activeTab === 'text' && (
                <div className="space-y-3 animate-in fade-in duration-200">
                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-2">
                      <label className="text-[10px] font-bold text-slate-400 block mb-1">
                        Brand / Team Name
                      </label>
                      <input
                        type="text"
                        value={customText}
                        onChange={(e) => setCustomText(e.target.value)}
                        placeholder="WARRIORS / ATELIER"
                        className="w-full px-3 py-2 rounded-xl border border-black/10 dark:border-white/15 bg-white dark:bg-[#1A1C1A] text-xs font-bold focus:ring-2 focus:ring-amber-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 block mb-1">
                        Squad No.
                      </label>
                      <input
                        type="text"
                        value={playerNumber}
                        onChange={(e) => setPlayerNumber(e.target.value)}
                        placeholder="07"
                        className="w-full px-3 py-2 rounded-xl border border-black/10 dark:border-white/15 bg-white dark:bg-[#1A1C1A] text-xs font-bold text-center focus:ring-2 focus:ring-amber-500 outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 block mb-1">
                        Font Family
                      </label>
                      <select
                        value={fontFamily}
                        onChange={(e) => setFontFamily(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-xl border border-black/10 dark:border-white/15 bg-white dark:bg-[#1A1C1A] text-xs font-bold"
                      >
                        <option value="Impact">Athletic Heavy (Impact)</option>
                        <option value="Outfit">Modern Sans (Outfit)</option>
                        <option value="Space Grotesk">Tech Pro (Space)</option>
                        <option value="Playfair Display">Luxury Serif (Playfair)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-400 block mb-1">
                        Font Color
                      </label>
                      <div className="flex items-center space-x-1.5 pt-1">
                        {['#0F100F', '#FFFFFF', '#D4AF37', '#DC2626', '#1D4ED8'].map((hex) => (
                          <button
                            key={hex}
                            onClick={() => setTextColor(hex)}
                            className={`w-6 h-6 rounded-full border-2 transition ${
                              textColor === hex ? 'scale-110 ring-2 ring-amber-500' : ''
                            }`}
                            style={{ backgroundColor: hex }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 5. Wholesale Tier Pricing & Quantity / Size Matrix Selector */}
            <div className="space-y-3 pt-2 border-t border-black/5 dark:border-white/5">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 font-editorial">
                    5. Total Units &amp; Size Breakdown:
                  </label>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold block">
                    {activeTier?.discountPercent || 0}% Mill Discount Applied ({quantity} pcs total)
                  </span>
                </div>
                <div className="flex items-center space-x-1.5 bg-black/5 dark:bg-white/5 p-1 rounded-2xl border border-black/5 dark:border-white/10">
                  <button
                    onClick={() => handleAdjustTotalQuantity(quantity - 6)}
                    className="w-7 h-7 rounded-xl bg-white dark:bg-[#202220] font-bold text-xs flex items-center justify-center hover:scale-105 transition"
                  >
                    -
                  </button>
                  <span className="w-10 text-center text-xs font-black font-editorial">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleAdjustTotalQuantity(quantity + 6)}
                    className="w-7 h-7 rounded-xl bg-white dark:bg-[#202220] font-bold text-xs flex items-center justify-center hover:scale-105 transition"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Multi-Size Matrix Input Grid */}
              <div className="p-3 rounded-2xl bg-white/70 dark:bg-[#1A1C1A] border border-black/10 dark:border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#0F100F] dark:text-white flex items-center space-x-1">
                    <span>📦 Size Matrix (e.g. 4 in S, 4 in M, 4 in L)</span>
                  </span>
                  <button
                    onClick={handleSplitEvenly}
                    className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 hover:bg-amber-500/25 transition border border-amber-500/30"
                  >
                    ⚡ Split Evenly
                  </button>
                </div>

                <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5 pt-1">
                  {availableSizes.map((size) => {
                    const count = sizeBreakdown[size] || 0;
                    return (
                      <div
                        key={size}
                        className={`p-1.5 rounded-xl border text-center transition flex flex-col justify-between ${
                          count > 0
                            ? 'bg-amber-500/10 border-amber-500/40 dark:border-amber-500/50'
                            : 'bg-black/[0.02] dark:bg-white/[0.02] border-black/5 dark:border-white/5 opacity-70'
                        }`}
                      >
                        <span className="text-[10px] font-bold truncate block">{size}</span>
                        <div className="flex items-center justify-center space-x-0.5 mt-1">
                          <button
                            type="button"
                            onClick={() => handleUpdateSizeCount(size, -1)}
                            className="w-4 h-4 rounded bg-black/5 dark:bg-white/10 text-[10px] font-bold flex items-center justify-center hover:bg-amber-500 hover:text-black transition"
                          >
                            -
                          </button>
                          <input
                            type="number"
                            min="0"
                            value={count}
                            onChange={(e) => handleSetSizeCount(size, parseInt(e.target.value) || 0)}
                            className="w-6 text-center text-xs font-bold bg-transparent outline-none p-0"
                          />
                          <button
                            type="button"
                            onClick={() => handleUpdateSizeCount(size, 1)}
                            className="w-4 h-4 rounded bg-black/5 dark:bg-white/10 text-[10px] font-bold flex items-center justify-center hover:bg-amber-500 hover:text-black transition"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Wholesale Tier Milestone Pills */}
              <div className="grid grid-cols-4 gap-1.5 text-center text-[10px]">
                {product.wholesaleTiers.map((tier, idx) => (
                  <div
                    key={idx}
                    className={`py-1.5 px-1 rounded-xl font-bold transition border ${
                      activeTier === tier
                        ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30 shadow-xs'
                        : 'bg-black/[0.02] dark:bg-white/[0.02] text-slate-400 border-black/5 dark:border-white/5'
                    }`}
                  >
                    <div>{tier.minQty}+ pcs</div>
                    <div className="text-[9px] opacity-80">₹{tier.unitPrice} /ea</div>
                  </div>
                ))}
              </div>
            </div>

            {/* 6. Pricing Summary & Add to Cart CTA */}
            <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400">Total for {quantity} units:</span>
                  <div className="text-xl font-black font-editorial text-black dark:text-white flex items-baseline space-x-1.5">
                    <span>₹{discountedTotal.toLocaleString('en-IN')}</span>
                    {totalSavings > 0 && (
                      <span className="text-xs text-emerald-600 font-bold line-through opacity-75">
                        ₹{standardTotal.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                </div>
                {totalSavings > 0 && (
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                    Save ₹{totalSavings.toLocaleString('en-IN')}
                  </span>
                )}
              </div>

              <div className="flex space-x-2 pt-1">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-lg hover:shadow-amber-500/25 transition transform active:scale-95"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add Customized {product.category} to Bag</span>
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

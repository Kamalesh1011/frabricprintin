import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Shirt,
  Sparkles,
  Layers,
  Palette,
  CheckCircle2,
  Eye,
  Check,
  X,
  MessageCircle,
  ArrowRight,
  ArrowLeft,
  Printer,
  Upload,
  Sliders,
  Sun,
  Moon,
  Zap,
  Trash2,
  Move,
  ShoppingCart,
  CreditCard,
  Star,
  Truck,
  RotateCcw,
  Plus,
  Minus,
  Type,
  Flame,
  FlipHorizontal,
  Circle,
  Square,
  Crop,
  ShieldCheck,
  Globe,
  Link as LinkIcon,
  RotateCw,
  Play,
  Pause,
  Compass,
  LayoutGrid,
  Flower2,
  Expand,
  Medal,
  Snowflake,
  Baby
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  APPAREL_DEMOGRAPHICS,
  APPAREL_GARMENTS,
  SAMPLE_GRAPHICS_LIBRARY,
  ApparelDemographic,
  ApparelGarmentItem
} from '../data/apparelCatalogData';
import { GarmentMockup } from '../components/GarmentMockup';
import { ThreeDGarmentViewer } from '../components/ThreeDGarmentViewer';
import { ApparelStudioShell } from '../components/ApparelStudioShell';
import { SmartUrlImageExtractorModal } from '../components/SmartUrlImageExtractorModal';
import { useCart } from '../context/CartContext';
import { Product, CategoryType } from '../types';

// Lucide icon per apparel demographic filter pill
const DEMOGRAPHIC_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  all: LayoutGrid,
  mens: Shirt,
  womens: Flower2,
  oversized: Expand,
  polo: Medal,
  winter_wear: Snowflake,
  kids: Baby,
};

interface BlankApparelPageProps {
  onGoToHome: () => void;
  onGoToCheckout?: () => void;
  onOpenBulkInquiry?: () => void;
  initialGarmentId?: string;
  initialViewMode?: 'catalog' | 'studio';
}

type StudioAtmosphere = 'studio' | 'runway' | 'midnight' | 'daylight';
type PrintEffect = 'dtf' | 'embroidery' | 'foil' | 'puff';
type CropShape = 'none' | 'circle' | 'rounded' | 'square';

export const BlankApparelPage: React.FC<BlankApparelPageProps> = ({
  onGoToHome,
  onGoToCheckout,
  onOpenBulkInquiry,
  initialGarmentId,
  initialViewMode = 'catalog'
}) => {
  const { addToCart, setIsCartOpen } = useCart();

  // Page view mode: 'catalog' (Browsing list of products) vs 'studio' (3D customizer)
  const [viewMode, setViewMode] = useState<'catalog' | 'studio'>(initialViewMode);

  // Active category filter: 'all' | 'mens' | 'womens' | 'oversized' | 'polo' | 'winter_wear' | 'kids'
  const [activeCategoryId, setActiveCategoryId] = useState<ApparelDemographic['id']>('all');
  
  // Garment subcategory filter
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('all');

  // Active selected garment in 3D studio
  const [activeGarmentId, setActiveGarmentId] = useState<string>(APPAREL_GARMENTS[0].id);

  // Active garment item object
  const activeGarment = useMemo(() => {
    return APPAREL_GARMENTS.find(g => g.id === activeGarmentId) || APPAREL_GARMENTS[0];
  }, [activeGarmentId]);

  // E-Commerce Purchase State (Size, Quantity, Color)
  const [selectedSize, setSelectedSize] = useState<string>('L');
  const [quantity, setQuantity] = useState<number>(1);
  const [sizeBreakdown, setSizeBreakdown] = useState<Record<string, number>>({ 'L': 1 });
  const [addedToCartToast, setAddedToCartToast] = useState<boolean>(false);

  // Helper to adjust size breakdown
  const handleUpdateSizeMatrix = (sz: string, delta: number) => {
    setSizeBreakdown(prev => {
      const cur = prev[sz] || 0;
      const next = Math.max(0, cur + delta);
      const updated = { ...prev, [sz]: next };
      const total = Object.values(updated).reduce((a, b) => a + b, 0);
      setQuantity(Math.max(1, total));
      return updated;
    });
  };

  const handleSetSizeMatrix = (sz: string, val: number) => {
    const num = Math.max(0, isNaN(val) ? 0 : val);
    setSizeBreakdown(prev => {
      const updated = { ...prev, [sz]: num };
      const total = Object.values(updated).reduce((a, b) => a + b, 0);
      setQuantity(Math.max(1, total));
      return updated;
    });
  };

  const handleSplitEvenlyAcrossSizes = (targetSizes: string[]) => {
    const countPerSize = Math.floor(quantity / targetSizes.length);
    const remainder = quantity % targetSizes.length;
    const nextBreakdown: Record<string, number> = {};
    activeGarment.sizes.forEach(s => { nextBreakdown[s] = 0; });
    targetSizes.forEach((s, idx) => {
      nextBreakdown[s] = countPerSize + (idx < remainder ? 1 : 0);
    });
    setSizeBreakdown(nextBreakdown);
  };

  // 3D Studio Interactive Controls & 360° Rotation Engine
  const [activeSide, setActiveSide] = useState<'front' | 'back'>('front');
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [isAutoSpinning, setIsAutoSpinning] = useState<boolean>(false);
  const [activeColorIdx, setActiveColorIdx] = useState<number>(0);
  const [customizationMode, setCustomizationMode] = useState<PrintEffect>('dtf');
  const [studioAtmosphere, setStudioAtmosphere] = useState<StudioAtmosphere>('studio');

  // Auto-Spin 360 Animation Timer
  useEffect(() => {
    if (!isAutoSpinning) return;
    const interval = setInterval(() => {
      setRotationAngle((prev) => (prev + 2) % 360);
    }, 40);
    return () => clearInterval(interval);
  }, [isAutoSpinning]);
  
  // Default clean artwork on load
  const [activeGraphicUrl, setActiveGraphicUrl] = useState<string | null>(null);
  const [artworkPlacement, setArtworkPlacement] = useState<string>('chest_center');
  const [scalePercent, setScalePercent] = useState<number>(100);
  const [rotation, setRotation] = useState<number>(0);
  const [offsetX, setOffsetX] = useState<number>(0);
  const [offsetY, setOffsetY] = useState<number>(0);
  const [isFlippedH, setIsFlippedH] = useState<boolean>(false);
  const [cropShape, setCropShape] = useState<CropShape>('none');

  // Custom Text State
  const [customText, setCustomText] = useState<string>('');
  const [customTextColor, setCustomTextColor] = useState<string>('#FFFFFF');
  const [customTextFont, setCustomTextFont] = useState<string>('font-sans');
  const [activeStudioTab, setActiveStudioTab] = useState<'upload' | 'adjust' | 'text' | 'techniques'>('upload');

  // Interactive Drag-to-Move State on the Canvas
  const [isDraggingArtwork, setIsDraggingArtwork] = useState<boolean>(false);
  const [dragStartPos, setDragStartPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [dragStartOffset, setDragStartOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragOverDropzone, setIsDragOverDropzone] = useState<boolean>(false);

  // 3D Tilt perspective state
  const [tiltOffset, setTiltOffset] = useState({ x: 0, y: 0 });
  const stageRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Live 3D WebGL viewer state (defaults to crisp photorealistic 3D studio customizer)
  const [isLive3D, setIsLive3D] = useState<boolean>(true);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);

  // ↩️↪️ Undo / Redo history for design operations (mobile shell top bar)
  interface StudioSnapshot {
    graphic: string | null;
    placement: string;
    scale: number;
    rotation: number;
    ox: number;
    oy: number;
    flipH: boolean;
    colorIdx: number;
    side: 'front' | 'back';
  }
  const histStackRef = useRef<StudioSnapshot[]>([]);
  const histIdxRef = useRef<number>(-1);
  const histApplyingRef = useRef<boolean>(false);
  const [histTick, setHistTick] = useState<number>(0);
  const takeSnapshot = (): StudioSnapshot => ({
    graphic: activeGraphicUrl,
    placement: artworkPlacement,
    scale: scalePercent,
    rotation,
    ox: offsetX,
    oy: offsetY,
    flipH: isFlippedH,
    colorIdx: activeColorIdx,
    side: activeSide,
  });
  const applySnapshot = (s: StudioSnapshot) => {
    histApplyingRef.current = true;
    setActiveGraphicUrl(s.graphic);
    setArtworkPlacement(s.placement);
    setScalePercent(s.scale);
    setRotation(s.rotation);
    setOffsetX(s.ox);
    setOffsetY(s.oy);
    setIsFlippedH(s.flipH);
    setActiveColorIdx(s.colorIdx);
    setActiveSide(s.side);
  };
  // Record every discrete design change (skips frames produced by undo/redo itself)
  useEffect(() => {
    if (histApplyingRef.current) {
      histApplyingRef.current = false;
      return;
    }
    const snap = takeSnapshot();
    const last = histStackRef.current[histIdxRef.current];
    if (last && JSON.stringify(last) === JSON.stringify(snap)) return;
    histStackRef.current = [...histStackRef.current.slice(0, histIdxRef.current + 1), snap].slice(-30);
    histIdxRef.current = histStackRef.current.length - 1;
    setHistTick(t => t + 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeGraphicUrl, artworkPlacement, scalePercent, rotation, offsetX, offsetY, isFlippedH, activeColorIdx, activeSide]);
  const handleUndo = () => {
    if (histIdxRef.current <= 0) return;
    histIdxRef.current -= 1;
    applySnapshot(histStackRef.current[histIdxRef.current]);
    setHistTick(t => t + 1);
  };
  const handleRedo = () => {
    if (histIdxRef.current >= histStackRef.current.length - 1) return;
    histIdxRef.current += 1;
    applySnapshot(histStackRef.current[histIdxRef.current]);
    setHistTick(t => t + 1);
  };
  const resetHistory = () => {
    histStackRef.current = [];
    histIdxRef.current = -1;
    setHistTick(t => t + 1);
  };
  const canUndo = histIdxRef.current > 0;
  const canRedo = histIdxRef.current < histStackRef.current.length - 1;
  void histTick;

  // Modal inspection state
  const [activeInspectItem, setActiveInspectItem] = useState<ApparelGarmentItem | null>(null);
  const [isWebUrlModalOpen, setIsWebUrlModalOpen] = useState<boolean>(false);

  // Active color swatch (bounded)
  const currentColor = activeGarment.colors[activeColorIdx] || activeGarment.colors[0] || { name: 'Black', hex: '#111827', code: 'BLK' };

  // Filtered garments for the catalog grid
  const displayedCatalogGarments = useMemo(() => {
    return APPAREL_GARMENTS.filter(garment => {
      const matchCategory = activeCategoryId === 'all' || garment.demographicId === activeCategoryId;
      const matchType = selectedTypeFilter === 'all' || garment.type.toLowerCase().includes(selectedTypeFilter.toLowerCase());
      return matchCategory && matchType;
    });
  }, [activeCategoryId, selectedTypeFilter]);

  // Unit price calculation
  const unitPrice = useMemo(() => {
    // 1. If product has size-specific pricing (e.g. Oversized XS-XXL or Mars Polo)
    if (activeGarment.sizePricing && activeGarment.sizePricing.length > 0) {
      const match = activeGarment.sizePricing.find(s => s.size === selectedSize);
      if (match) return match.price;
    }
    // 2. If product has quantity tiers
    if (activeGarment.pricingTiers && activeGarment.pricingTiers.length > 1) {
      const sortedTiers = [...activeGarment.pricingTiers].sort((a, b) => b.minQty - a.minQty);
      const tierMatch = sortedTiers.find(t => quantity >= t.minQty);
      if (tierMatch) return tierMatch.price;
    }
    return activeGarment.price;
  }, [activeGarment, selectedSize, quantity]);

  const totalPrice = unitPrice * quantity;
  const originalTotalPrice = (activeGarment.originalPrice || unitPrice * 2) * quantity;

  // Initialize garment from initialGarmentId prop if provided
  useEffect(() => {
    if (initialGarmentId) {
      const match = APPAREL_GARMENTS.find(g => g.id === initialGarmentId);
      if (match) {
        setActiveGarmentId(match.id);
        setActiveColorIdx(0);
        if (match.sizes.length > 0) setSelectedSize(match.sizes[0]);
      }
    }
  }, [initialGarmentId]);

  // Mouse move tilt handler
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDraggingArtwork) return;
    if (!stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setTiltOffset({
      x: (x / rect.width) * 8,
      y: (y / rect.height) * -8
    });
  };

  const handleMouseLeave = () => {
    if (!isDraggingArtwork) {
      setTiltOffset({ x: 0, y: 0 });
    }
  };

  // ==================== INTERACTIVE ON-CANVAS TRANSFORMS (WORD / CANVA STYLE) ====================
  const [activeTransformHandle, setActiveTransformHandle] = useState<'move' | 'scale_corner' | 'rotate' | null>(null);
  const dragStartTransformRef = useRef<{
    clientX: number;
    clientY: number;
    initialOffsetX: number;
    initialOffsetY: number;
    initialScale: number;
    initialRotation: number;
    centerX: number;
    centerY: number;
  }>({
    clientX: 0,
    clientY: 0,
    initialOffsetX: 0,
    initialOffsetY: 0,
    initialScale: 100,
    initialRotation: 0,
    centerX: 0,
    centerY: 0
  });

  const handleGraphicPointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveTransformHandle('move');
    setIsDraggingArtwork(true);
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    dragStartTransformRef.current = {
      clientX: e.clientX,
      clientY: e.clientY,
      initialOffsetX: offsetX,
      initialOffsetY: offsetY,
      initialScale: scalePercent,
      initialRotation: rotation,
      centerX: rect.left + rect.width / 2,
      centerY: rect.top + rect.height / 2
    };
  };

  const handleCornerHandlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveTransformHandle('scale_corner');
    const rect = (e.currentTarget as HTMLElement).parentElement?.getBoundingClientRect();
    dragStartTransformRef.current = {
      clientX: e.clientX,
      clientY: e.clientY,
      initialOffsetX: offsetX,
      initialOffsetY: offsetY,
      initialScale: scalePercent,
      initialRotation: rotation,
      centerX: rect ? rect.left + rect.width / 2 : e.clientX,
      centerY: rect ? rect.top + rect.height / 2 : e.clientY
    };
  };

  const handleRotateHandlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveTransformHandle('rotate');
    const rect = (e.currentTarget as HTMLElement).parentElement?.getBoundingClientRect();
    dragStartTransformRef.current = {
      clientX: e.clientX,
      clientY: e.clientY,
      initialOffsetX: offsetX,
      initialOffsetY: offsetY,
      initialScale: scalePercent,
      initialRotation: rotation,
      centerX: rect ? rect.left + rect.width / 2 : e.clientX,
      centerY: rect ? rect.top + rect.height / 2 : e.clientY
    };
  };

  // Global window pointermove and pointerup listeners for ultra-smooth 60fps interaction
  useEffect(() => {
    const handleGlobalPointerMove = (e: PointerEvent) => {
      if (!activeTransformHandle) return;

      if (activeTransformHandle === 'move') {
        const deltaX = e.clientX - dragStartTransformRef.current.clientX;
        const deltaY = e.clientY - dragStartTransformRef.current.clientY;
        setOffsetX(Math.max(-140, Math.min(140, Math.round(dragStartTransformRef.current.initialOffsetX + deltaX * 0.8))));
        setOffsetY(Math.max(-160, Math.min(160, Math.round(dragStartTransformRef.current.initialOffsetY + deltaY * 0.8))));
      } else if (activeTransformHandle === 'scale_corner') {
        const initialDist = Math.hypot(
          dragStartTransformRef.current.clientX - dragStartTransformRef.current.centerX,
          dragStartTransformRef.current.clientY - dragStartTransformRef.current.centerY
        );
        const currentDist = Math.hypot(
          e.clientX - dragStartTransformRef.current.centerX,
          e.clientY - dragStartTransformRef.current.centerY
        );
        const scaleFactor = currentDist / Math.max(initialDist, 1);
        const newScale = Math.max(25, Math.min(260, Math.round(dragStartTransformRef.current.initialScale * scaleFactor)));
        setScalePercent(newScale);
      } else if (activeTransformHandle === 'rotate') {
        const rad = Math.atan2(
          e.clientY - dragStartTransformRef.current.centerY,
          e.clientX - dragStartTransformRef.current.centerX
        );
        let deg = Math.round((rad * 180) / Math.PI + 90);
        deg = (deg % 360 + 360) % 360;
        setRotation(deg);
      }
    };

    const handleGlobalPointerUp = () => {
      setActiveTransformHandle(null);
      setIsDraggingArtwork(false);
    };

    if (activeTransformHandle) {
      window.addEventListener('pointermove', handleGlobalPointerMove);
      window.addEventListener('pointerup', handleGlobalPointerUp);
    }

    return () => {
      window.removeEventListener('pointermove', handleGlobalPointerMove);
      window.removeEventListener('pointerup', handleGlobalPointerUp);
    };
  }, [activeTransformHandle]);

  // File Dropzone Handlers on Stage
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOverDropzone(true);
  };

  const handleDragLeave = () => {
    setIsDragOverDropzone(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOverDropzone(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setActiveGraphicUrl(url);
      setActiveStudioTab('adjust');
    }
  };

  // Open 3D studio customizer for a specific garment
  const handleOpen3DStudio = (garment: ApparelGarmentItem) => {
    setActiveGarmentId(garment.id);
    setActiveColorIdx(0);
    setActiveSide('front');
    setActiveGraphicUrl(null);
    setCustomText('');
    setArtworkPlacement('chest_center');
    setScalePercent(100);
    setRotation(0);
    setOffsetX(0);
    setOffsetY(0);
    setIsFlippedH(false);
    setRotationAngle(0);
    setIsAutoSpinning(false);
    if (garment.sizes.length > 0 && !garment.sizes.includes(selectedSize)) {
      setSelectedSize(garment.sizes[0]);
    }
    setViewMode('studio');
    // Fresh history baseline for the new garment (recorded by the history effect)
    resetHistory();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Mobile shell detection: exact app-like studio below lg breakpoint
  const [mobileStudio, setMobileStudio] = useState<boolean>(
    () => typeof window !== 'undefined' && window.innerWidth < 1024
  );
  useEffect(() => {
    const onResize = () => setMobileStudio(window.innerWidth < 1024);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Return to Catalog View
  const handleBackToCatalog = () => {
    setViewMode('catalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle Custom Graphic Upload via input
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setActiveGraphicUrl(url);
      setActiveStudioTab('adjust');
    }
  };

  // Mobile shell upload helper (File object directly)
  const uploadDesignFile = (file: File) => {
    const url = URL.createObjectURL(file);
    setActiveGraphicUrl(url);
    setActiveStudioTab('adjust');
  };
  const pickSampleGraphic = (url: string) => {
    setActiveGraphicUrl(url);
    setActiveStudioTab('adjust');
  };
  const clearDesign = () => {
    setActiveGraphicUrl(null);
    setCustomText('');
  };

  // Reset Artwork controls
  const handleResetArtwork = () => {
    setScalePercent(100);
    setRotation(0);
    setOffsetX(0);
    setOffsetY(0);
    setIsFlippedH(false);
    setCropShape('none');
    setArtworkPlacement('chest_center');
  };

  // Convert ApparelGarmentItem to Cart Product
  const createCartProduct = (garment: ApparelGarmentItem, qty: number = 1): Product => {
    const previewImg = activeGraphicUrl || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=600';
    return {
      id: `${garment.id}-${currentColor.code}-${selectedSize}-${Date.now()}`,
      name: `${garment.name} - ${currentColor.name} (${selectedSize})`,
      category: 'Cotton' as CategoryType,
      gsm: 180,
      width: 'Regular Fit',
      count: '24s Combed Cotton',
      color: currentColor.name,
      colorCode: currentColor.hex,
      price_per_meter: unitPrice,
      swatch_test_price: 150,
      swatch_big_price: 300,
      print_surcharge_per_meter: customizationMode === 'embroidery' ? 120 : 80,
      description: `${garment.name} | Color: ${currentColor.name} | Size: ${selectedSize}`,
      images: [previewImg],
      weave_type: garment.fabric,
      composition: garment.cottonType,
      in_stock: true
    };
  };

  // Handle Add to Cart
  const handleAddToCart = (garment: ApparelGarmentItem = activeGarment, qty: number = quantity) => {
    const cartProduct = createCartProduct(garment, qty);
    const breakdown = qty > 1 && Object.values(sizeBreakdown).reduce((a, b) => a + b, 0) === qty
      ? sizeBreakdown
      : { [selectedSize]: qty };

    addToCart(
      cartProduct,
      'apparel',
      qty,
      {
        requiresPrint: Boolean(activeGraphicUrl || customText),
        designUrl: activeGraphicUrl || undefined,
        dpi: 1200,
        layoutType: 'single',
        scalePercentage: scalePercent,
        notes: `Technique: ${customizationMode.toUpperCase()} · Placement: ${artworkPlacement}${customText ? ` · Custom Text: "${customText}"` : ''}`,
      },
      1,
      `${currentColor.name} • ${qty > 1 ? `${qty} pcs Multi-size` : selectedSize}`,
      {
        sizeBreakdown: breakdown,
        customPreviewUrl: activeGraphicUrl || undefined,
      }
    );

    setAddedToCartToast(true);
    setIsCartOpen(true);
    setTimeout(() => {
      setAddedToCartToast(false);
    }, 3000);
  };

  // Handle Buy Now (Instant checkout)
  const handleBuyNow = () => {
    const cartProduct = createCartProduct(activeGarment, quantity);
    const breakdown = quantity > 1 && Object.values(sizeBreakdown).reduce((a, b) => a + b, 0) === quantity
      ? sizeBreakdown
      : { [selectedSize]: quantity };

    addToCart(
      cartProduct,
      'apparel',
      quantity,
      {
        requiresPrint: Boolean(activeGraphicUrl || customText),
        designUrl: activeGraphicUrl || undefined,
        dpi: 1200,
        layoutType: 'single',
        scalePercentage: scalePercent,
        notes: `Technique: ${customizationMode.toUpperCase()} · Placement: ${artworkPlacement}${customText ? ` · Custom Text: "${customText}"` : ''}`,
      },
      1,
      `${currentColor.name} • ${quantity > 1 ? `${quantity} pcs Multi-size` : selectedSize}`,
      {
        sizeBreakdown: breakdown,
        customPreviewUrl: activeGraphicUrl || undefined,
      }
    );

    if (onGoToCheckout) {
      onGoToCheckout();
    } else {
      setIsCartOpen(true);
    }
  };

  // Get Atmosphere Styling Classes
  const getAtmosphereClasses = () => {
    switch (studioAtmosphere) {
      case 'runway':
        return 'bg-gradient-to-b from-amber-950/20 via-[#181512] to-[#0D0B0A] border-amber-500/20';
      case 'midnight':
        return 'bg-gradient-to-b from-slate-900/60 via-[#0B0F17] to-[#05070A] border-cyan-500/20';
      case 'daylight':
        return 'bg-gradient-to-b from-blue-50/60 via-slate-50 to-white dark:from-slate-900/40 dark:to-[#111211] border-black/10 dark:border-white/10';
      case 'studio':
      default:
        return 'bg-gradient-to-b from-stone-100 via-stone-50 to-stone-100/60 dark:from-[#181918] dark:via-[#131413] dark:to-[#0F100F] border-black/10 dark:border-white/10';
    }
  };

  return (
    <div className="w-full bg-[#FAF8F5] dark:bg-[#0D0E0D] text-[#0F100F] dark:text-white transition-colors duration-300 min-h-screen pb-32 lg:pb-12 font-sans">
      
      {/* 🧭 TOP BREADCRUMB & DIRECT CONTACT BAR */}
      <div className="border-b border-black/[0.06] dark:border-white/[0.08] bg-white/95 dark:bg-[#121312]/95 backdrop-blur-md sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
          
          <div className="flex items-center space-x-2 text-slate-500 font-medium">
            <button onClick={onGoToHome} className="hover:text-black dark:hover:text-white transition font-bold">
              Home
            </button>
            <span className="text-slate-400">/</span>
            
            {viewMode === 'studio' ? (
              <>
                <button onClick={handleBackToCatalog} className="hover:text-black dark:hover:text-white transition font-bold">
                  Apparel
                </button>
                <span className="text-slate-400">/</span>
                <span className="text-[#AC7900] dark:text-[#D4AF37] font-bold">{activeGarment.name}</span>
              </>
            ) : (
              <>
                <span className="text-black dark:text-white font-bold">Apparel &amp; T-Shirts</span>
              </>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {viewMode === 'studio' && (
              <button
                onClick={handleBackToCatalog}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 font-bold text-slate-700 dark:text-slate-200 transition text-[11px]"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Products</span>
              </button>
            )}

            <div className="flex items-center space-x-1.5 text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1 rounded-full text-[11px]">
              <Truck className="w-3.5 h-3.5" />
              <span>Express Delivery</span>
            </div>

            <a
              href="https://wa.me/918903120006?text=Hi%20Fabric%20Print%2C%20I%20would%20like%20to%20order%20apparel"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-bold transition border border-emerald-500/20 text-[11px]"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp Support</span>
            </a>
          </div>
        </div>
      </div>

      {/* =========================================================================
          VIEW 1: CATALOG VIEW (Clean Amazon-style Product Cards)
          ========================================================================= */}
      {viewMode === 'catalog' && (
        <div className="animate-in fade-in duration-300">
          
          {/* 🌟 HERO & CATEGORY BAR */}
          <section className="bg-gradient-to-b from-white via-[#FAF8F5] to-transparent dark:from-[#111211] dark:via-[#0F100F] dark:to-transparent pt-8 pb-6 border-b border-black/[0.06] dark:border-white/[0.08]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              
              <div className="text-center max-w-2xl mx-auto mb-6">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-500/10 text-[#AC7900] dark:text-[#D4AF37] border border-amber-500/20 mb-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Premium Apparel &amp; 3D Customizer</span>
                </span>
                <h1 className="text-2xl sm:text-4xl font-black font-editorial text-[#0F100F] dark:text-white tracking-tight">
                  T-Shirts, Hoodies &amp; Apparel
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Choose your favorite style below to buy plain or customize with your logo in our interactive 3D studio.
                </p>
              </div>

              {/* 🏷️ Category Selection Pills */}
              <div className="flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto">
                {APPAREL_DEMOGRAPHICS.map(dem => {
                  const isSelected = activeCategoryId === dem.id;
                  const DemIcon = DEMOGRAPHIC_ICONS[dem.id] || LayoutGrid;
                  return (
                    <button
                      key={dem.id}
                      onClick={() => setActiveCategoryId(dem.id)}
                      className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                        isSelected
                          ? 'bg-[#0F100F] dark:bg-white text-white dark:text-black shadow-md scale-105'
                          : 'bg-white dark:bg-[#161716] text-slate-600 dark:text-slate-300 border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5'
                      }`}
                    >
                      <DemIcon className="w-3.5 h-3.5 shrink-0" />
                      <span>{dem.title}</span>
                    </button>
                  );
                })}
              </div>

            </div>
          </section>

          {/* 📦 CLEAN PRODUCT CARDS GRID (AMAZON STYLE) */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-black font-editorial text-[#0F100F] dark:text-white">
                  Available Styles ({displayedCatalogGarments.length})
                </h2>
              </div>
            </div>

            {/* Garment Cards Grid - 2 cols on mobile, 4 on desktop */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
              {displayedCatalogGarments.map(garment => {
                return (
                  <div
                    key={garment.id}
                    onClick={() => handleOpen3DStudio(garment)}
                    className="group rounded-xl sm:rounded-2xl border border-black/10 dark:border-white/10 transition-all duration-300 p-3 sm:p-4 flex flex-col justify-between bg-white dark:bg-[#141514] hover:shadow-xl hover:-translate-y-1 cursor-pointer relative overflow-hidden"
                  >
                    <div>
                      {/* Product Mockup Preview */}
                      <div className="aspect-square sm:aspect-[4/3] rounded-xl sm:rounded-2xl bg-[#FAF8F5] dark:bg-stone-900/60 p-2 sm:p-4 mb-2 sm:mb-3 border border-black/5 dark:border-white/5 flex items-center justify-center relative overflow-hidden group-hover:bg-stone-100 dark:group-hover:bg-stone-900 transition-colors">
                        <GarmentMockup
                          type={garment.modelType}
                          colorHex={garment.colors[0]?.hex || '#111827'}
                          side="front"
                          artworkUrl={null}
                          className="w-full h-full object-contain"
                        />
                      </div>

                      {/* Product Name */}
                      <h3 className="text-xs sm:text-base font-bold text-[#0F100F] dark:text-white group-hover:text-[#AC7900] dark:group-hover:text-[#D4AF37] transition-colors mb-1 line-clamp-1">
                        {garment.name}
                      </h3>

                      {/* Rating */}
                      <div className="flex items-center space-x-1 text-amber-500 text-[10px] sm:text-xs mb-1.5 sm:mb-2">
                        <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-amber-500" />
                        <span className="font-bold text-slate-800 dark:text-slate-200">{garment.rating}</span>
                        <span className="text-slate-400 font-normal">({garment.reviewCount})</span>
                      </div>

                      {/* Price Section (Amazon Style) */}
                      <div className="flex flex-wrap items-baseline gap-1 sm:gap-2 mb-2 sm:mb-3">
                        <span className="text-sm sm:text-xl font-black text-[#0F100F] dark:text-white">
                          ₹{garment.price}
                        </span>
                        <span className="text-[10px] sm:text-xs line-through text-slate-400">
                          ₹{garment.originalPrice}
                        </span>
                        <span className="text-[10px] sm:text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                          (50% off)
                        </span>
                      </div>

                      {/* Color Preview Dots */}
                      <div className="hidden sm:flex items-center space-x-1.5 mb-2">
                        <span className="text-[11px] text-slate-400 font-medium">Colors:</span>
                        <div className="flex items-center space-x-1 overflow-hidden">
                          {garment.colors.slice(0, 5).map(c => (
                            <span
                              key={c.code}
                              className="w-3.5 h-3.5 rounded-full border border-black/20 dark:border-white/20 shadow-xs shrink-0"
                              style={{ backgroundColor: c.hex }}
                              title={c.name}
                            />
                          ))}
                          {garment.colors.length > 5 && (
                            <span className="text-[10px] font-bold text-slate-400">+{garment.colors.length - 5}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-2 sm:pt-3 mt-1.5 sm:mt-2 border-t border-black/5 dark:border-white/5 flex items-center space-x-1.5 sm:space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpen3DStudio(garment);
                        }}
                        className="flex-1 py-2 sm:py-2.5 px-2 sm:px-3 rounded-xl text-[11px] sm:text-xs font-bold transition flex items-center justify-center space-x-1 sm:space-x-1.5 shadow-sm bg-[#0F100F] dark:bg-white text-white dark:text-black hover:opacity-90 group-hover:bg-[#AC7900] group-hover:text-white"
                      >
                        <span className="truncate">Customize</span>
                        <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#D4AF37] shrink-0" />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(garment, 1);
                        }}
                        className="p-2 sm:p-2.5 rounded-xl border border-black/15 dark:border-white/15 hover:bg-black/5 dark:hover:bg-white/5 transition text-slate-700 dark:text-slate-300 shrink-0"
                        title="Add 1 Piece to Cart"
                      >
                        <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

          </section>

        </div>
      )}

      {/* =========================================================================
          VIEW 2: DEDICATED 3D STUDIO VIEW (Clean Amazon / Studio Experience)
          ========================================================================= */}
      {viewMode === 'studio' && (
        mobileStudio ? (
          /* 📱 MOBILE-EXACT 3D STUDIO SHELL (app-like customizer) */
          <div className="animate-in fade-in duration-300">
            <ApparelStudioShell
              garment={activeGarment}
              currentColor={currentColor}
              activeColorIdx={activeColorIdx}
              setActiveColorIdx={setActiveColorIdx}
              activeSide={activeSide}
              setActiveSide={setActiveSide}
              activeGraphicUrl={activeGraphicUrl}
              uploadDesignFile={uploadDesignFile}
              pickSampleGraphic={pickSampleGraphic}
              clearDesign={clearDesign}
              onOpenUrlImport={() => setIsWebUrlModalOpen(true)}
              artworkPlacement={artworkPlacement}
              setArtworkPlacement={(p) => { setArtworkPlacement(p); setOffsetX(0); setOffsetY(0); }}
              scalePercent={scalePercent}
              setScalePercent={setScalePercent}
              rotation={rotation}
              setRotation={setRotation}
              offsetX={offsetX}
              offsetY={offsetY}
              setOffsetX={setOffsetX}
              setOffsetY={setOffsetY}
              isFlippedH={isFlippedH}
              setIsFlippedH={setIsFlippedH}
              customText={customText}
              setCustomText={setCustomText}
              customTextColor={customTextColor}
              setCustomTextColor={setCustomTextColor}
              handleResetArtwork={handleResetArtwork}
              canUndo={canUndo}
              canRedo={canRedo}
              handleUndo={handleUndo}
              handleRedo={handleRedo}
              onBack={handleBackToCatalog}
              isLive3D={isLive3D}
              setIsLive3D={setIsLive3D}
              autoRotate={autoRotate}
              setAutoRotate={setAutoRotate}
              selectedSize={selectedSize}
              setSelectedSize={setSelectedSize}
              quantity={quantity}
              setQuantity={setQuantity}
              totalPrice={totalPrice}
              onAddToCart={() => handleAddToCart(activeGarment, quantity)}
              onBuyNow={handleBuyNow}
            />
          </div>
        ) : (
        <div className="animate-in fade-in duration-300 py-6">
          
          {/* Studio Navigation & Garment Switcher Strip */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-3xl bg-white dark:bg-[#141514] border border-black/10 dark:border-white/10 shadow-sm">
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleBackToCatalog}
                  className="p-2 sm:px-4 sm:py-2 rounded-2xl bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 text-xs font-bold transition flex items-center space-x-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Back to Products</span>
                </button>

                <div>
                  <h1 className="text-sm sm:text-base font-black font-editorial">
                    {activeGarment.name}
                  </h1>
                </div>
              </div>

              {/* Quick Style Switcher inside Studio */}
              <div className="flex items-center space-x-1.5 overflow-x-auto max-w-full">
                <span className="text-[11px] font-bold text-slate-400 mr-1 hidden lg:inline">
                  Switch Product:
                </span>
                {APPAREL_GARMENTS.map(g => {
                  const isCur = g.id === activeGarment.id;
                  return (
                    <button
                      key={g.id}
                      onClick={() => handleOpen3DStudio(g)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shrink-0 ${
                        isCur
                          ? 'bg-[#AC7900] text-white shadow-sm'
                          : 'bg-black/5 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-black/10'
                      }`}
                    >
                      <span>{g.name.length > 20 ? g.name.substring(0, 18) + '...' : g.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Main 3D Studio Container */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="bg-white dark:bg-[#141514] rounded-3xl border border-black/10 dark:border-white/10 shadow-2xl overflow-hidden relative">
              
              {/* Top Studio Action Ribbon */}
              <div className="bg-stone-100/80 dark:bg-[#181918] px-6 py-3.5 border-b border-black/10 dark:border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                  <span className="font-black text-[#0F100F] dark:text-white tracking-wide uppercase">
                    3D Interactive Studio Customizer
                  </span>
                  <span className="text-slate-400">•</span>
                  <span className="text-[#AC7900] dark:text-[#D4AF37] font-bold">
                    {activeGarment.name}
                  </span>
                </div>

                {/* Live 3D / Flat Mockup Toggle */}
                <div className="flex items-center bg-black/5 dark:bg-white/5 p-0.5 rounded-xl border border-black/10 dark:border-white/10">
                  <button
                    onClick={() => setIsLive3D(true)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition flex items-center space-x-1 ${
                      isLive3D ? 'bg-[#AC7900] text-white shadow-xs' : 'text-slate-500 hover:text-black dark:hover:text-white'
                    }`}
                    title="Live WebGL 3D View"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                    <span>LIVE 3D</span>
                  </button>
                  <button
                    onClick={() => setIsLive3D(false)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition ${
                      !isLive3D ? 'bg-[#AC7900] text-white shadow-xs' : 'text-slate-500 hover:text-black dark:hover:text-white'
                    }`}
                    title="Flat Mockup View"
                  >
                    <span>FLAT</span>
                  </button>
                </div>

                {/* Atmosphere Lighting Toggle */}
                <div className="flex items-center bg-black/5 dark:bg-white/5 p-0.5 rounded-xl border border-black/10 dark:border-white/10">
                  <span className="text-[10px] font-bold text-slate-400 px-2">Atmosphere:</span>
                  <button
                    onClick={() => setStudioAtmosphere('studio')}
                    className={`p-1.5 rounded-lg text-[10px] font-bold transition ${
                      studioAtmosphere === 'studio' ? 'bg-[#AC7900] text-white shadow-xs' : 'text-slate-500 hover:text-black dark:hover:text-white'
                    }`}
                    title="Studio High-Key"
                  >
                    <Sun className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setStudioAtmosphere('runway')}
                    className={`p-1.5 rounded-lg text-[10px] font-bold transition ${
                      studioAtmosphere === 'runway' ? 'bg-[#AC7900] text-white shadow-xs' : 'text-slate-500 hover:text-black dark:hover:text-white'
                    }`}
                    title="Warm Runway"
                  >
                    <Zap className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setStudioAtmosphere('midnight')}
                    className={`p-1.5 rounded-lg text-[10px] font-bold transition ${
                      studioAtmosphere === 'midnight' ? 'bg-[#AC7900] text-white shadow-xs' : 'text-slate-500 hover:text-black dark:hover:text-white'
                    }`}
                    title="Cyber Midnight"
                  >
                    <Moon className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Studio Body: Left 7 Cols (3D Drag Stage & Tools) + Right 5 Cols (Color, Sizing, Quantity & Add to Cart) */}
              <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left 7 Cols: 3D Stage with Direct Drag & Drop Support */}
                <div className="lg:col-span-7 space-y-4">
                  
                  {/* 3D Stage Container */}
                  <div
                    ref={stageRef}
                    onMouseMove={(e) => {
                      if (isLive3D) return;
                      handleMouseMove(e);
                    }}
                    onMouseLeave={handleMouseLeave}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`relative aspect-[4/3] sm:aspect-[16/11] rounded-2xl overflow-hidden border flex items-center justify-center p-0 sm:p-6 transition-all duration-300 select-none shadow-inner group ${
                      isDraggingArtwork ? 'cursor-grabbing' : (activeGraphicUrl || customText ? 'cursor-grab' : 'cursor-default')
                    } ${isDragOverDropzone ? 'ring-4 ring-amber-500 bg-amber-500/10' : ''} ${getAtmosphereClasses()}`}
                    style={isLive3D ? undefined : {
                      perspective: '1000px',
                      transform: `rotateY(${tiltOffset.x}deg) rotateX(${tiltOffset.y}deg)`
                    }}
                  >
                    {/* Background Ambient Fabric Glow */}
                    <div
                      className="absolute inset-0 opacity-40 blur-3xl pointer-events-none transition-colors duration-500"
                      style={{ backgroundColor: `${currentColor.hex}30` }}
                    />

                    {/* Dragging Overlay Indicator */}
                    {isDragOverDropzone && (
                      <div className="absolute inset-0 z-20 bg-amber-500/20 border-2 border-dashed border-amber-500 flex flex-col items-center justify-center backdrop-blur-xs">
                        <Upload className="w-10 h-10 text-amber-600 animate-bounce mb-2" />
                        <span className="text-sm font-black text-amber-800 dark:text-amber-200">
                          Drop Your Image Anywhere to Apply!
                        </span>
                      </div>
                    )}

                    {/* 3D Garment Mockup Component */}
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={isLive3D ? 'live-3d-viewer' : `${activeGarment.id}-${activeSide}-${currentColor.hex}-${customizationMode}`}
                        initial={{ opacity: 0, scale: 0.95, y: 8 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                        className={`relative w-full h-full flex items-center justify-center ${isLive3D ? 'absolute inset-0' : ''}`}
                      >
                        {isLive3D ? (
                          <ThreeDGarmentViewer
                            designUrl={activeGraphicUrl}
                            color={currentColor}
                            rotation={rotation}
                            scalePercent={scalePercent}
                            artworkPlacement={artworkPlacement}
                            isFlippedH={isFlippedH}
                            side={activeSide}
                            autoRotate={autoRotate}
                            modelType={activeGarment.modelType}
                          />
                        ) : (
                        <GarmentMockup
                          type={activeGarment.modelType}
                          colorHex={currentColor.hex}
                          side={activeSide}
                          rotationAngle={rotationAngle}
                          artworkUrl={activeGraphicUrl}
                          artworkPlacement={artworkPlacement}
                          scalePercent={scalePercent}
                          rotation={rotation}
                          offsetX={offsetX}
                          offsetY={offsetY}
                          isFlippedH={isFlippedH}
                          cropShape={cropShape}
                          customText={customText}
                          customTextColor={customTextColor}
                          customTextFont={customTextFont}
                          printEffect={customizationMode}
                          isEmbroidery={customizationMode === 'embroidery'}
                          showBoundingBox={Boolean(activeGraphicUrl || customText)}
                          onGraphicPointerDown={handleGraphicPointerDown}
                          onCornerHandlePointerDown={handleCornerHandlePointerDown}
                          onRotateHandlePointerDown={handleRotateHandlePointerDown}
                          onRotateClick={() => setRotation(prev => (prev + 90) % 360)}
                          className="w-full h-full max-h-[400px]"
                        />
                        )}

                        {/* Floating Quick Action Ribbon directly above shirt on canvas */}
                        {(activeGraphicUrl || customText) && (
                          <div
                            onClick={e => e.stopPropagation()}
                            className="absolute top-3 inset-x-4 mx-auto max-w-sm bg-[#0F100F]/90 dark:bg-white/95 backdrop-blur-md text-white dark:text-[#0F100F] px-3 py-1.5 rounded-full shadow-2xl border border-white/20 dark:border-black/10 flex items-center justify-around text-xs font-bold z-30 animate-in slide-in-from-top-2 duration-150"
                          >
                            <button
                              onClick={() => setScalePercent(prev => Math.min(260, prev + 15))}
                              className="p-1 rounded-full hover:bg-white/20 dark:hover:bg-black/10 transition flex items-center space-x-0.5"
                              title="Enlarge (+)"
                            >
                              <Plus className="w-3.5 h-3.5 text-amber-400" />
                              <span className="text-[10px]">Enlarge</span>
                            </button>

                            <button
                              onClick={() => setScalePercent(prev => Math.max(25, prev - 15))}
                              className="p-1 rounded-full hover:bg-white/20 dark:hover:bg-black/10 transition flex items-center space-x-0.5"
                              title="Shrink (-)"
                            >
                              <Minus className="w-3.5 h-3.5 text-amber-400" />
                              <span className="text-[10px]">Shrink</span>
                            </button>

                            <button
                              onClick={() => setRotation(prev => (prev + 90) % 360)}
                              className="p-1 rounded-full hover:bg-white/20 dark:hover:bg-black/10 transition flex items-center space-x-0.5"
                              title="Rotate 90°"
                            >
                              <RotateCw className="w-3.5 h-3.5 text-[#D4AF37]" />
                              <span className="text-[10px]">90°</span>
                            </button>

                            <button
                              onClick={handleResetArtwork}
                              className="p-1 rounded-full hover:bg-white/20 dark:hover:bg-black/10 transition flex items-center space-x-0.5"
                              title="Center & Reset"
                            >
                              <Move className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-[10px]">Center</span>
                            </button>

                            <button
                              onClick={() => {
                                setActiveGraphicUrl(null);
                                setCustomText('');
                              }}
                              className="p-1 rounded-full text-rose-400 hover:bg-rose-500/20 transition"
                              title="Delete Artwork"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}

                        {/* Technique Hologram Badge */}
                        <div className="absolute bottom-3 right-3 pointer-events-none">
                          {customizationMode === 'dtf' && (
                            <div className="bg-amber-600/90 text-white px-2.5 py-0.5 rounded-full text-[10px] font-bold border border-white/30 shadow-lg tracking-wider flex items-center space-x-1 backdrop-blur-md">
                              <Printer className="w-3 h-3" />
                              <span>1200 DPI DTF</span>
                            </div>
                          )}
                          {customizationMode === 'embroidery' && (
                            <div className="bg-black/85 dark:bg-white/95 text-white dark:text-black px-2.5 py-0.5 rounded-full text-[10px] font-bold border border-[#D4AF37]/60 shadow-lg tracking-wider flex items-center space-x-1 backdrop-blur-md">
                              <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                              <span>3D EMBROIDERY</span>
                            </div>
                          )}
                          {customizationMode === 'foil' && (
                            <div className="bg-gradient-to-r from-amber-500 to-yellow-300 text-black px-2.5 py-0.5 rounded-full text-[10px] font-black border border-white/40 shadow-lg tracking-wider flex items-center space-x-1 backdrop-blur-md">
                              <Flame className="w-3 h-3" />
                              <span>METALLIC GOLD FOIL</span>
                            </div>
                          )}
                          {customizationMode === 'puff' && (
                            <div className="bg-purple-600 text-white px-2.5 py-0.5 rounded-full text-[10px] font-bold border border-white/30 shadow-lg tracking-wider flex items-center space-x-1 backdrop-blur-md">
                              <Layers className="w-3 h-3" />
                              <span>3D PUFF SCREEN</span>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    </AnimatePresence>

                    {/* Bottom 360° View Controls Bar */}
                    <div className="absolute bottom-3 inset-x-4 flex flex-wrap items-center justify-between gap-2 pointer-events-auto">
                      
                      {/* 360° Angle Presets */}
                      <div className="flex items-center space-x-1 bg-white/95 dark:bg-black/95 backdrop-blur-md p-1 rounded-xl border border-black/10 dark:border-white/15 shadow-md text-xs">
                        <button
                          onClick={() => {
                            setIsAutoSpinning(false);
                            setRotationAngle(0);
                            setActiveSide('front');
                          }}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition ${
                            rotationAngle === 0 && !isAutoSpinning
                              ? 'bg-[#0F100F] dark:bg-white text-white dark:text-[#0F100F]'
                              : 'text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white'
                          }`}
                        >
                          Front 0°
                        </button>
                        <button
                          onClick={() => {
                            setIsAutoSpinning(false);
                            setRotationAngle(90);
                          }}
                          className={`px-2 py-1 rounded-lg text-[11px] font-bold transition ${
                            rotationAngle === 90 && !isAutoSpinning
                              ? 'bg-[#0F100F] dark:bg-white text-white dark:text-[#0F100F]'
                              : 'text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white'
                          }`}
                        >
                          Side 90°
                        </button>
                        <button
                          onClick={() => {
                            setIsAutoSpinning(false);
                            setRotationAngle(180);
                            setActiveSide('back');
                          }}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition ${
                            rotationAngle === 180 && !isAutoSpinning
                              ? 'bg-[#0F100F] dark:bg-white text-white dark:text-[#0F100F]'
                              : 'text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white'
                          }`}
                        >
                          Back 180°
                        </button>
                        <button
                          onClick={() => {
                            setIsAutoSpinning(false);
                            setRotationAngle(270);
                          }}
                          className={`px-2 py-1 rounded-lg text-[11px] font-bold transition ${
                            rotationAngle === 270 && !isAutoSpinning
                              ? 'bg-[#0F100F] dark:bg-white text-white dark:text-[#0F100F]'
                              : 'text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white'
                          }`}
                        >
                          Side 270°
                        </button>
                        <button
                          onClick={() => setIsAutoSpinning(prev => !prev)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition flex items-center space-x-1 ${
                            isAutoSpinning
                              ? 'bg-[#AC7900] text-white animate-pulse'
                              : 'text-[#AC7900] dark:text-[#D4AF37] hover:bg-amber-500/10'
                          }`}
                          title="Auto 360 Spin"
                        >
                          {isAutoSpinning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                          <span>360° Spin</span>
                        </button>
                      </div>

                      {/* Reset artwork button */}
                      {(activeGraphicUrl || customText) && (
                        <div className="flex items-center space-x-1">
                          <span className="text-[10px] font-bold text-slate-500 bg-white/80 dark:bg-black/80 px-2 py-0.5 rounded-md hidden sm:inline-block">
                            💡 Click &amp; drag to position
                          </span>
                          <button
                            onClick={handleResetArtwork}
                            className="bg-white/90 dark:bg-black/90 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] font-bold border border-black/10 dark:border-white/15 text-slate-500 hover:text-black dark:hover:text-white transition flex items-center space-x-1 shadow-sm"
                            title="Reset Position"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>Reset</span>
                          </button>
                        </div>
                      )}
                    </div>

                  </div>

                  {/* 🎛️ WORKBENCH CONTROLS */}
                  <div className="p-4 rounded-2xl bg-black/[0.03] dark:bg-white/[0.04] border border-black/10 dark:border-white/10 space-y-3.5 shadow-sm">
                    
                    {/* Workbench Tabs */}
                    <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-2.5">
                      <div className="flex items-center space-x-1 overflow-x-auto">
                        {[
                          { id: 'upload', label: '1. Add Logo / Image', icon: Upload },
                          { id: 'adjust', label: '2. Adjust & Crop', icon: Sliders },
                          { id: 'text', label: '3. Add Custom Text', icon: Type },
                          { id: 'techniques', label: '4. Print Finish', icon: Sparkles }
                        ].map(tab => {
                          const Icon = tab.icon;
                          const isActive = activeStudioTab === tab.id;
                          return (
                            <button
                              key={tab.id}
                              onClick={() => setActiveStudioTab(tab.id as any)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-black transition flex items-center space-x-1.5 shrink-0 ${
                                isActive
                                  ? 'bg-[#0F100F] dark:bg-white text-white dark:text-black shadow-sm scale-102'
                                  : 'text-slate-600 dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/5'
                              }`}
                            >
                              <Icon className="w-3.5 h-3.5" />
                              <span>{tab.label}</span>
                            </button>
                          );
                        })}
                      </div>

                      {activeGraphicUrl && (
                        <button
                          onClick={() => setActiveGraphicUrl(null)}
                          className="px-2.5 py-1 rounded-xl text-xs font-bold text-rose-500 hover:bg-rose-500/10 transition flex items-center space-x-1"
                          title="Clear Artwork"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Remove</span>
                        </button>
                      )}
                    </div>

                    {/* TAB 1: UPLOAD LOGO */}
                    {activeStudioTab === 'upload' && (
                      <div className="space-y-4 animate-in fade-in duration-200">
                        <div
                          onClick={() => fileInputRef.current?.click()}
                          className="border-2 border-dashed border-[#AC7900]/40 hover:border-[#AC7900] bg-amber-500/[0.04] hover:bg-amber-500/[0.08] p-6 rounded-2xl text-center cursor-pointer transition-all flex flex-col items-center justify-center space-y-2 group"
                        >
                          <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileUpload}
                            accept="image/*"
                            className="hidden"
                          />
                          <div className="w-12 h-12 rounded-full bg-[#AC7900]/10 text-[#AC7900] dark:text-[#D4AF37] flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Upload className="w-6 h-6" />
                          </div>
                          <div>
                            <span className="text-sm font-black text-[#0F100F] dark:text-white block">
                              Click to Upload Your Logo or Artwork File
                            </span>
                            <span className="text-xs text-slate-500">
                              Supports PNG with transparent background, JPG, SVG or WEBP
                            </span>
                          </div>
                        </div>

                        {/* 🌐 Web Image Scraper & URL Import Link */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-2xl bg-black/[0.03] dark:bg-white/[0.04] border border-[#AC7900]/25 dark:border-[#D4AF37]/25 hover:border-[#AC7900] transition">
                          <div className="flex items-center space-x-3 text-left">
                            <div className="w-9 h-9 rounded-xl bg-[#AC7900]/10 dark:bg-[#D4AF37]/10 flex items-center justify-center text-[#AC7900] dark:text-[#D4AF37] shrink-0">
                              <Globe className="w-4 h-4" />
                            </div>
                            <div>
                              <span className="text-xs font-bold text-[#0F100F] dark:text-white block">
                                Have an image link from Web Search, Google or Pinterest?
                              </span>
                              <span className="text-[10px] text-slate-500 block">
                                Paste any image URL to automatically scrape and place artwork onto your garment
                              </span>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => setIsWebUrlModalOpen(true)}
                            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#0F100F] dark:bg-white text-white dark:text-black text-xs font-black hover:scale-105 transition flex items-center justify-center space-x-1.5 shadow-sm shrink-0 cursor-pointer"
                          >
                            <LinkIcon className="w-3.5 h-3.5 text-[#D4AF37] dark:text-[#AC7900]" />
                            <span>Import from URL →</span>
                          </button>
                        </div>

                        {/* Sample Designer Badges */}
                        <div>
                          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                            Or Pick a Sample Graphic:
                          </span>
                          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                            {SAMPLE_GRAPHICS_LIBRARY.map(sg => (
                              <button
                                key={sg.id}
                                onClick={() => {
                                  setActiveGraphicUrl(sg.url);
                                  setActiveStudioTab('adjust');
                                }}
                                className={`group rounded-xl overflow-hidden border-2 transition-all p-1 flex flex-col items-center text-center ${
                                  activeGraphicUrl === sg.url
                                    ? 'border-[#AC7900] ring-2 ring-[#AC7900]/40 scale-105 bg-amber-500/10'
                                    : 'border-black/10 dark:border-white/10 hover:border-black/30 bg-white dark:bg-[#181918]'
                                }`}
                              >
                                <div className="w-full aspect-square rounded-lg overflow-hidden mb-1 bg-stone-100 dark:bg-stone-900">
                                  <img src={sg.url} alt={sg.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                                </div>
                                <span className="text-[9px] font-bold truncate max-w-full text-slate-700 dark:text-slate-300">
                                  {sg.name}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* TAB 2: ADJUST, SCALE, ROTATE & CROP CONTROLS */}
                    {activeStudioTab === 'adjust' && (
                      <div className="space-y-4 animate-in fade-in duration-200">
                        {!activeGraphicUrl && !customText ? (
                          <div className="p-6 text-center text-slate-500 bg-black/5 dark:bg-white/5 rounded-2xl">
                            <Upload className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                            <p className="text-xs font-bold">No logo uploaded yet. Upload a logo or add text first!</p>
                            <button
                              onClick={() => setActiveStudioTab('upload')}
                              className="mt-3 px-4 py-1.5 rounded-xl bg-[#AC7900] text-white text-xs font-bold"
                            >
                              Go to Upload
                            </button>
                          </div>
                        ) : (
                          <>
                            <div>
                              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                                Position on Garment:
                              </span>
                              <div className="grid grid-cols-2 sm:grid-cols-6 gap-1.5">
                                {[
                                  { id: 'chest_center', label: 'Center Chest', side: 'front' },
                                  { id: 'pocket_left', label: 'Left Pocket', side: 'front' },
                                  { id: 'a4_front', label: 'A4 Front', side: 'front' },
                                  { id: 'oversized_front', label: 'Jumbo Front', side: 'front' },
                                  { id: 'upper_back', label: 'Upper Back', side: 'back' },
                                  { id: 'full_back', label: 'Full Back', side: 'back' }
                                ].map(plc => (
                                  <button
                                    key={plc.id}
                                    onClick={() => {
                                      setArtworkPlacement(plc.id);
                                      setActiveSide(plc.side as any);
                                      setOffsetX(0);
                                      setOffsetY(0);
                                    }}
                                    className={`py-2 px-2 rounded-xl text-xs font-black transition border ${
                                      artworkPlacement === plc.id
                                        ? 'bg-[#AC7900] text-white border-[#AC7900] shadow-sm'
                                        : 'bg-white dark:bg-[#181918] text-slate-700 dark:text-slate-300 border-black/10 dark:border-white/10 hover:border-black/30'
                                    }`}
                                  >
                                    {plc.label}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                              <div className="p-2.5 rounded-xl bg-white dark:bg-[#181918] border border-black/10 dark:border-white/10 flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-500">Size:</span>
                                <div className="flex items-center space-x-1">
                                  <button
                                    onClick={() => setScalePercent(p => Math.max(30, p - 15))}
                                    className="p-1.5 rounded-lg bg-black/5 dark:bg-white/10 hover:bg-black/10 font-bold"
                                  >
                                    <Minus className="w-3.5 h-3.5" />
                                  </button>
                                  <span className="text-xs font-black w-9 text-center">{scalePercent}%</span>
                                  <button
                                    onClick={() => setScalePercent(p => Math.min(220, p + 15))}
                                    className="p-1.5 rounded-lg bg-black/5 dark:bg-white/10 hover:bg-black/10 font-bold"
                                  >
                                    <Plus className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>

                              <div className="p-2.5 rounded-xl bg-white dark:bg-[#181918] border border-black/10 dark:border-white/10 flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-500">Rotate:</span>
                                <div className="flex items-center space-x-1">
                                  <button
                                    onClick={() => setRotation(r => (r - 90 < -180 ? 180 : r - 90))}
                                    className="px-2 py-1 rounded-lg bg-black/5 dark:bg-white/10 text-xs font-black"
                                  >
                                    ↺ -90°
                                  </button>
                                  <button
                                    onClick={() => setRotation(r => (r + 90 > 180 ? -180 : r + 90))}
                                    className="px-2 py-1 rounded-lg bg-black/5 dark:bg-white/10 text-xs font-black"
                                  >
                                    ↻ +90°
                                  </button>
                                </div>
                              </div>

                              <button
                                onClick={() => setIsFlippedH(prev => !prev)}
                                className={`p-2.5 rounded-xl border font-bold text-xs transition flex items-center justify-center space-x-1.5 ${
                                  isFlippedH ? 'bg-[#AC7900] text-white border-[#AC7900]' : 'bg-white dark:bg-[#181918] border-black/10 dark:border-white/10'
                                }`}
                              >
                                <FlipHorizontal className="w-4 h-4" />
                                <span>Flip</span>
                              </button>

                              <button
                                onClick={() => { setOffsetX(0); setOffsetY(0); }}
                                className="p-2.5 rounded-xl bg-white dark:bg-[#181918] border border-black/10 dark:border-white/10 font-bold text-xs hover:bg-black/5 flex items-center justify-center space-x-1.5"
                              >
                                <Move className="w-4 h-4 text-[#AC7900]" />
                                <span>Center</span>
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    )}

                    {/* TAB 3: CUSTOM TEXT */}
                    {activeStudioTab === 'text' && (
                      <div className="space-y-3 animate-in fade-in duration-200">
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                            Enter Custom Text:
                          </label>
                          <input
                            type="text"
                            value={customText}
                            onChange={(e) => setCustomText(e.target.value)}
                            placeholder="e.g. YOUR BRAND NAME"
                            className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-[#181918] border border-black/15 dark:border-white/15 text-xs font-bold text-[#0F100F] dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#AC7900]"
                          />
                        </div>

                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                            Text Color:
                          </span>
                          <div className="flex items-center space-x-2">
                            {[
                              { name: 'White', hex: '#FFFFFF' },
                              { name: 'Pitch Black', hex: '#111827' },
                              { name: 'Gold', hex: '#D4AF37' },
                              { name: 'Red', hex: '#DC2626' },
                              { name: 'Blue', hex: '#2563EB' }
                            ].map(c => (
                              <button
                                key={c.hex}
                                onClick={() => setCustomTextColor(c.hex)}
                                className={`w-6 h-6 rounded-full border-2 transition ${
                                  customTextColor === c.hex ? 'scale-125 border-black dark:border-white ring-2 ring-[#AC7900]' : 'border-black/20 dark:border-white/20'
                                }`}
                                style={{ backgroundColor: c.hex }}
                                title={c.name}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* TAB 4: PRINT FINISH */}
                    {activeStudioTab === 'techniques' && (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 animate-in fade-in duration-200">
                        {[
                          { id: 'dtf', label: '1200 DPI DTF', icon: Printer },
                          { id: 'embroidery', label: '3D Embroidery', icon: Sparkles },
                          { id: 'foil', label: 'Gold Foil', icon: Flame },
                          { id: 'puff', label: '3D Puff Print', icon: Layers }
                        ].map(tech => {
                          const Icon = tech.icon;
                          const isSelected = customizationMode === tech.id;
                          return (
                            <button
                              key={tech.id}
                              onClick={() => setCustomizationMode(tech.id as any)}
                              className={`p-3 rounded-xl border text-center transition flex flex-col items-center justify-center space-y-1.5 ${
                                isSelected
                                  ? 'border-[#AC7900] dark:border-[#D4AF37] bg-amber-500/10 ring-1 ring-[#AC7900]'
                                  : 'border-black/10 dark:border-white/10 bg-white dark:bg-[#181918] hover:border-black/20'
                              }`}
                            >
                              <Icon className={`w-4 h-4 ${isSelected ? 'text-[#AC7900] dark:text-[#D4AF37]' : 'text-slate-400'}`} />
                              <span className="text-xs font-bold text-[#0F100F] dark:text-white">{tech.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}

                  </div>

                </div>

                {/* Right 5 Cols: Clean Pricing, Color Swatches, Size Selection, Quantity & Add to Cart */}
                <div className="lg:col-span-5 space-y-5">
                  
                  {/* Product Title & Rating */}
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-black font-editorial text-[#0F100F] dark:text-white">
                      {activeGarment.name}
                    </h2>

                    <div className="flex items-center space-x-2 mt-1">
                      <div className="flex items-center space-x-1 text-amber-500 text-xs">
                        <Star className="w-4 h-4 fill-amber-500" />
                        <span className="font-bold text-slate-800 dark:text-slate-200">{activeGarment.rating}</span>
                        <span className="text-slate-400">({activeGarment.reviewCount} customer reviews)</span>
                      </div>
                    </div>
                  </div>

                  {/* Clean Amazon Price Card */}
                  <div className="p-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/10 dark:border-white/10 space-y-1">
                    <div className="flex items-baseline space-x-3">
                      <span className="text-3xl font-black text-[#0F100F] dark:text-white">
                        ₹{totalPrice}
                      </span>
                      <span className="text-sm line-through text-slate-400">
                        M.R.P: ₹{originalTotalPrice}
                      </span>
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                        50% off
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Inclusive of all taxes. Free shipping on orders over ₹499.
                    </p>
                  </div>

                  {/* Color Selection */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Color: <strong className="text-black dark:text-white ml-1">{currentColor.name}</strong>
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {activeGarment.colors.map((color, sIdx) => (
                        <button
                          key={color.code + sIdx}
                          onClick={() => setActiveColorIdx(sIdx)}
                          className={`w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center ${
                            activeColorIdx === sIdx
                              ? 'border-[#0F100F] dark:border-white scale-110 shadow-md ring-2 ring-[#AC7900]'
                              : 'border-black/20 dark:border-white/20 hover:scale-105'
                          }`}
                          style={{ backgroundColor: color.hex }}
                          title={color.name}
                        >
                          {activeColorIdx === sIdx && (
                            <Check className={`w-4 h-4 ${color.hex === '#FFFFFF' || color.hex === '#FDFBF7' ? 'text-black' : 'text-white'}`} />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Size Selection & Multi-Size Matrix */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        {quantity > 1 ? `Size Distribution (${quantity} pcs):` : 'Select Size:'}
                      </span>
                      <button
                        onClick={() => setActiveInspectItem(activeGarment)}
                        className="text-xs font-bold text-[#AC7900] dark:text-[#D4AF37] hover:underline"
                      >
                        Size Chart →
                      </button>
                    </div>

                    {quantity === 1 ? (
                      <div className="flex flex-wrap gap-2">
                        {activeGarment.sizes.map(sz => (
                          <button
                            key={sz}
                            onClick={() => {
                              setSelectedSize(sz);
                              setSizeBreakdown({ [sz]: 1 });
                            }}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition border ${
                              selectedSize === sz
                                ? 'bg-[#0F100F] dark:bg-white text-white dark:text-black border-transparent shadow-sm scale-105'
                                : 'bg-white dark:bg-[#181918] text-slate-700 dark:text-slate-300 border-black/15 dark:border-white/15 hover:border-black/30'
                            }`}
                          >
                            {sz}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="p-3 rounded-2xl bg-white dark:bg-[#181918] border border-black/10 dark:border-white/10 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">
                            📦 Multi-Size Matrix (e.g. 4 in S, 4 in M, 4 in L)
                          </span>
                          <button
                            onClick={() => handleSplitEvenlyAcrossSizes(['S', 'M', 'L', 'XL'])}
                            className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 hover:bg-amber-500/25 transition"
                          >
                            ⚡ Split Evenly
                          </button>
                        </div>
                        <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5 pt-1">
                          {activeGarment.sizes.map((sz) => {
                            const count = sizeBreakdown[sz] || 0;
                            return (
                              <div
                                key={sz}
                                className={`p-1.5 rounded-xl border text-center transition flex flex-col justify-between ${
                                  count > 0
                                    ? 'bg-amber-500/10 border-amber-500/40 dark:border-amber-500/50'
                                    : 'bg-black/[0.02] dark:bg-white/[0.02] border-black/5 dark:border-white/5 opacity-70'
                                }`}
                              >
                                <span className="text-[10px] font-bold truncate block">{sz}</span>
                                <div className="flex items-center justify-center space-x-0.5 mt-1">
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateSizeMatrix(sz, -1)}
                                    className="w-4 h-4 rounded bg-black/5 dark:bg-white/10 text-[10px] font-bold flex items-center justify-center hover:bg-amber-500 hover:text-black transition"
                                  >
                                    -
                                  </button>
                                  <input
                                    type="number"
                                    min="0"
                                    value={count}
                                    onChange={(e) => handleSetSizeMatrix(sz, parseInt(e.target.value) || 0)}
                                    className="w-5 text-center text-xs font-bold bg-transparent outline-none p-0"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateSizeMatrix(sz, 1)}
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
                    )}
                  </div>

                  {/* Quantity Stepper (1 Piece, 2 Pieces, etc. Like Amazon) */}
                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-black/[0.03] dark:bg-white/[0.04] border border-black/10 dark:border-white/10">
                    <div>
                      <span className="text-xs font-bold text-slate-500 block">Total Quantity:</span>
                      <span className="text-sm font-black text-black dark:text-white">
                        {quantity} {quantity === 1 ? 'Piece' : 'Pieces'}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          const nextQ = Math.max(1, quantity - 1);
                          setQuantity(nextQ);
                          if (quantity === 1) {
                            setSizeBreakdown({ [selectedSize]: 1 });
                          } else {
                            handleSplitEvenlyAcrossSizes(['S', 'M', 'L', 'XL']);
                          }
                        }}
                        className="w-9 h-9 rounded-xl bg-white dark:bg-[#181918] border border-black/15 dark:border-white/15 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-black/5 font-bold"
                        title="Decrease"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center text-base font-black">
                        {quantity}
                      </span>
                      <button
                        onClick={() => {
                          const nextQ = quantity + 1;
                          setQuantity(nextQ);
                          handleSplitEvenlyAcrossSizes(['S', 'M', 'L', 'XL']);
                        }}
                        className="w-9 h-9 rounded-xl bg-white dark:bg-[#181918] border border-black/15 dark:border-white/15 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-black/5 font-bold"
                        title="Increase"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Add to Cart & Buy Now Action Buttons */}
                  <div className="pt-2 space-y-2.5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button
                        onClick={() => handleAddToCart(activeGarment, quantity)}
                        className="py-3.5 px-4 rounded-2xl bg-white dark:bg-[#181918] text-[#0F100F] dark:text-white border-2 border-black dark:border-white text-xs font-black hover:bg-black/5 dark:hover:bg-white/5 transition flex items-center justify-center space-x-2 shadow-sm cursor-pointer"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        <span>Add to Cart</span>
                      </button>

                      <button
                        onClick={handleBuyNow}
                        className="py-3.5 px-4 rounded-2xl bg-[#0F100F] dark:bg-white text-white dark:text-black text-xs font-black hover:opacity-90 transition flex items-center justify-center space-x-2 shadow-xl hover:scale-[1.02] cursor-pointer"
                      >
                        <CreditCard className="w-4 h-4 text-[#D4AF37]" />
                        <span>Buy Now</span>
                      </button>
                    </div>

                    {addedToCartToast && (
                      <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-bold text-center flex items-center justify-center space-x-2 animate-in fade-in">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <span>Added {quantity} {quantity === 1 ? 'piece' : 'pieces'} of {activeGarment.name} to cart!</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-4 pt-2 text-[11px] text-slate-500">
                    <div className="flex items-center space-x-1">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>100% Quality Assured</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Truck className="w-4 h-4 text-blue-600" />
                      <span>Fast Doorstep Delivery</span>
                    </div>
                  </div>

                </div>

              </div>

            </div>

          </section>

        </div>
        )
      )}

      {/* 🔍 MODAL: SIZE CHART MEASUREMENTS */}
      {activeInspectItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white dark:bg-[#161716] text-[#0F100F] dark:text-white rounded-[32px] p-6 border border-black/10 dark:border-white/10 shadow-2xl">
            
            <div className="flex items-center justify-between pb-3 border-b border-black/10 dark:border-white/10">
              <div>
                <h3 className="text-lg font-bold font-editorial">{activeInspectItem.name} - Size Guide</h3>
                <p className="text-xs text-slate-500">Measurements in inches</p>
              </div>
              <button
                onClick={() => setActiveInspectItem(null)}
                className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="my-4 overflow-hidden border border-black/10 dark:border-white/10 rounded-2xl">
              <table className="w-full text-xs text-left">
                <thead className="bg-black/5 dark:bg-white/5 font-bold">
                  <tr>
                    <th className="p-3">Size</th>
                    <th className="p-3">Length</th>
                    <th className="p-3">Chest</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5 dark:divide-white/5">
                  {activeInspectItem.sizeMeasurements && activeInspectItem.sizeMeasurements.length > 0 ? (
                    activeInspectItem.sizeMeasurements.map(m => (
                      <tr key={m.size}>
                        <td className="p-3 font-bold">{m.size}</td>
                        <td className="p-3">{m.length}"</td>
                        <td className="p-3">{m.chest}"</td>
                      </tr>
                    ))
                  ) : (
                    activeInspectItem.sizes.map(sz => (
                      <tr key={sz}>
                        <td className="p-3 font-bold">{sz}</td>
                        <td className="p-3">Standard Fit</td>
                        <td className="p-3">Standard Fit</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <button
              onClick={() => setActiveInspectItem(null)}
              className="w-full py-2.5 rounded-xl bg-black dark:bg-white text-white dark:text-black font-bold text-xs"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* 📱 STICKY BOTTOM BUY BAR (FOR MOBILE, desktop-layout only — shell has its own sheet) */}
      {viewMode === 'studio' && !mobileStudio && (
        <div className="sm:hidden fixed bottom-0 inset-x-0 bg-white/95 dark:bg-[#121312]/95 backdrop-blur-md border-t border-black/10 dark:border-white/10 p-3 z-40 flex items-center justify-between shadow-2xl">
          <div>
            <span className="text-[10px] text-slate-400 block font-bold">Price ({quantity} {quantity === 1 ? 'piece' : 'pieces'}):</span>
            <span className="text-lg font-black text-[#0F100F] dark:text-white">₹{totalPrice}</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleAddToCart(activeGarment, quantity)}
              className="p-2.5 rounded-xl border border-black/20 dark:border-white/20 text-xs font-bold"
            >
              <ShoppingCart className="w-4 h-4" />
            </button>

            <button
              onClick={handleBuyNow}
              className="px-4 py-2.5 rounded-xl bg-[#0F100F] dark:bg-white text-white dark:text-black text-xs font-black shadow-lg"
            >
              Buy Now
            </button>
          </div>
        </div>
      )}

      {/* 🌐 SMART URL / WEB IMAGE EXTRACTOR MODAL */}
      <SmartUrlImageExtractorModal
        isOpen={isWebUrlModalOpen}
        onClose={() => setIsWebUrlModalOpen(false)}
        onApplyExtractedImage={(imageInfo) => {
          setActiveGraphicUrl(imageInfo.url);
          setIsWebUrlModalOpen(false);
          setActiveStudioTab('adjust');
        }}
      />

    </div>
  );
};

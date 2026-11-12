import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Upload,
  Sparkles,
  Sliders,
  RotateCw,
  Maximize2,
  Minimize2,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Info,
  Palette,
  Eye,
  Shirt,
  Download,
  Trash2,
  Plus,
  Minus,
  HelpCircle,
  Award,
  Zap,
  Tag,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Check,
  Scissors,
  Wand2,
  Move,
  RotateCcw,
  Maximize,
  Grid,
  ZoomIn,
  ZoomOut,
  Type,
  Trophy,
  FileDown
} from 'lucide-react';
import {
  ApparelProduct,
  ApparelColor,
  PrintPlacement,
  JerseyPlayerEntry,
  JerseyCustomization,
  StudioLightingType,
  FabricVariantOption
} from '../types';
import {
  APPAREL_COLORS,
  SAMPLE_GRAPHICS_LIBRARY,
  PRINT_PLACEMENT_CONFIG,
  CATALOG_SIZE_CHARTS
} from '../data/apparelData';
import { useCart } from '../context/CartContext';
import { GarmentMockup, GarmentModelType } from './GarmentMockup';
import {
  ThreeDGarmentViewer,
  FabricPBRType,
  LightingPreset,
  StudioViewSide
} from './ThreeDGarmentViewer';
import { QuotationModal, QuotationBreakdownItem } from './QuotationModal';
import { ImageCropperModal } from './ImageCropperModal';
import { StudioAutoFrameControls, AutoFramePreset } from './StudioAutoFrameControls';
import { EMBROIDERY_THREADS } from './ApparelStudioShell';

const getGarmentModelType = (productId: string): GarmentModelType => {
  if (productId.includes('crop-top')) return 'crop_top';
  if (productId.includes('womens')) return 'womens_round_neck';
  if (productId.includes('oversized')) return 'oversized_tee';
  if (productId.includes('acid-wash')) return 'acid_wash_tee';
  if (productId.includes('cotton-collar-polo')) return 'polo_shirt';
  if (productId.includes('mars-polo')) return 'polo_shirt';
  if (productId.includes('sports-polo') || productId.includes('sports-full-sleeve-polo')) return 'sports_polo';
  if (productId.includes('hoodie')) return 'hoodie';
  if (productId.includes('sweatshirt')) return 'sweatshirt';
  if (productId.includes('kids-round-neck')) return 'kids_tee';
  if (productId.includes('kids-sports') || productId.includes('sports-round') || productId.includes('sports-full-sleeve-round')) return 'sports_round_neck';
  if (productId.includes('cricket')) return 'cricket_jersey';
  return 'mens_round_neck';
};

interface ApparelStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: ApparelProduct | null;
  initialColor?: ApparelColor;
  onGoToCheckout?: () => void;
}

export const ApparelStudioModal: React.FC<ApparelStudioModalProps> = ({
  isOpen,
  onClose,
  product,
  initialColor,
  onGoToCheckout
}) => {
  const { addToCart } = useCart();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const garmentCanvasRef = useRef<HTMLDivElement>(null);

  // Active product & styling state
  const [selectedColor, setSelectedColor] = useState<ApparelColor>(
    initialColor || product?.colors?.[0] || APPAREL_COLORS.black
  );
  const [selectedFabricVariant, setSelectedFabricVariant] = useState<FabricVariantOption | null>(
    product?.fabricVariants?.[0] || null
  );
  const [activeSide, setActiveSide] = useState<'front' | 'back'>('front');
  const [printPlacement, setPrintPlacement] = useState<PrintPlacement>('chest_center');
  const [printTechnique, setPrintTechnique] = useState<string>('DTF (Direct to Film)');
  const [embroideryStyle, setEmbroideryStyle] = useState<'flat' | 'puff3d' | 'patch'>('puff3d');
  const [embroideryThreadColor, setEmbroideryThreadColor] = useState<string>('#D4AF37');
  const [dtfFinish, setDtfFinish] = useState<'matte' | 'gloss'>('matte');
  const [blendMode, setBlendMode] = useState<'auto' | 'normal' | 'multiply' | 'screen'>('auto');

  // Uploaded graphic state
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [originalSourceImage, setOriginalSourceImage] = useState<string | null>(null);
  const [imageFileName, setImageFileName] = useState<string>('');
  const [imageDpi, setImageDpi] = useState<number>(300);
  const [scalePercent, setScalePercent] = useState<number>(100);
  const [rotation, setRotation] = useState<number>(0);
  const [offsetX, setOffsetX] = useState<number>(0);
  const [offsetY, setOffsetY] = useState<number>(0);
  const [isAiGenerating, setIsAiGenerating] = useState<boolean>(false);
  const [aiPrompt, setAiPrompt] = useState<string>('');
  const [extractedPalette, setExtractedPalette] = useState<string[]>([]);

  // Interactive Graphic Manipulation & Crop state
  const [isCropModalOpen, setIsCropModalOpen] = useState<boolean>(false);
  const [isGraphicSelected, setIsGraphicSelected] = useState<boolean>(true);
  const [showPrintSafeZone, setShowPrintSafeZone] = useState<boolean>(true);
  const [lightingAtmosphere, setLightingAtmosphere] = useState<StudioLightingType>('studio');

  const handleAutoFramePreset = (preset: AutoFramePreset) => {
    if (preset === 'center_fit') {
      setOffsetX(0);
      setOffsetY(0);
      setScalePercent(100);
      setPrintPlacement('chest_center');
    } else if (preset === 'pocket_left') {
      setOffsetX(-55);
      setOffsetY(-50);
      setScalePercent(55);
      setPrintPlacement('pocket_left');
    } else if (preset === 'oversized_full') {
      setOffsetX(0);
      setOffsetY(10);
      setScalePercent(160);
      setPrintPlacement('a3_front');
    } else if (preset === 'back_arch') {
      setActiveSide('back');
      setOffsetX(0);
      setOffsetY(-45);
      setScalePercent(130);
      setPrintPlacement('full_back');
    }
  };

  // Pointer drag state for on-canvas graphic movement
  const [isDraggingGraphic, setIsDraggingGraphic] = useState<boolean>(false);
  const [isResizingHandle, setIsResizingHandle] = useState<boolean>(false);
  const dragStartPos = useRef<{ x: number; y: number; initialOffsetX: number; initialOffsetY: number; initialScale: number }>({
    x: 0,
    y: 0,
    initialOffsetX: 0,
    initialOffsetY: 0,
    initialScale: 100
  });

  // Size breakdown matrix
  const [sizeCounts, setSizeCounts] = useState<Record<string, number>>({});
  const [sizeChartOpen, setSizeChartOpen] = useState<boolean>(false);

  // Jersey printing customizations
  const [isJerseyMode, setIsJerseyMode] = useState<boolean>(false);
  const [showJerseyTextOverlay, setShowJerseyTextOverlay] = useState<boolean>(true);
  const [jerseySport, setJerseySport] = useState<string>('Cricket');
  const [jerseyTeamName, setJerseyTeamName] = useState<string>('TITANS FC');
  const [jerseyFontStyle, setJerseyFontStyle] = useState<string>('Varsity Bold');
  const [jerseyNumberColor, setJerseyNumberColor] = useState<string>('#FFFFFF');
  const [jerseyPlayers, setJerseyPlayers] = useState<JerseyPlayerEntry[]>([
    { id: '1', name: 'ROHIT', number: '45', size: 'L' },
    { id: '2', name: 'VIRAT', number: '18', size: 'M' }
  ]);

  // 3D Configurator Advanced State (Module 2)
  const [isLive3D, setIsLive3D] = useState<boolean>(true);
  const [autoRotate, setAutoRotate] = useState<boolean>(false);
  const [viewSide, setViewSide] = useState<StudioViewSide>('front');
  const [fabricPbr, setFabricPbr] = useState<FabricPBRType>('cotton_jersey');
  const [lightingPreset, setLightingPreset] = useState<LightingPreset>('studio');

  // Typography Engine Advanced State (Module 1)
  const [customTypographyText, setCustomTypographyText] = useState<string>('');
  const [customTextColor, setCustomTextColor] = useState<string>('#FFFFFF');
  const [customFont, setCustomFont] = useState<string>('Impact');
  const [textArc, setTextArc] = useState<number>(0);
  const [strokeWidth, setStrokeWidth] = useState<number>(0);
  const [strokeColor, setStrokeColor] = useState<string>('#000000');

  // Quotation Modal State (Module 4)
  const [isQuotationModalOpen, setIsQuotationModalOpen] = useState<boolean>(false);

  // Tab mode in studio: 'design' | 'typography' | 'pbr' | 'sizing' | 'jersey'
  const [activeStudioTab, setActiveStudioTab] = useState<'design' | 'typography' | 'pbr' | 'sizing' | 'jersey'>('design');

  // Initialize state when product changes
  useEffect(() => {
    if (product) {
      setSelectedColor(initialColor || product.colors[0]);
      setSelectedFabricVariant(product.fabricVariants?.[0] || null);
      const initialCounts: Record<string, number> = {};
      product.sizes.forEach((sz, idx) => {
        initialCounts[sz] = idx < 3 ? 2 : 0;
      });
      setSizeCounts(initialCounts);
      setIsJerseyMode(product.category === 'Sports Kit');
      if (product.category === 'Sports Kit') {
        setPrintPlacement('all_over_sublimation');
      } else {
        setPrintPlacement('chest_center');
      }
    }
  }, [product, initialColor]);

  if (!isOpen || !product) return null;

  // Handle Image File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setUploadedImage(result);
      setOriginalSourceImage(result);
      setIsGraphicSelected(true);
    };
    reader.readAsDataURL(file);
  };

  // Preset Artwork Selection
  const handleSelectPreset = (url: string, name: string) => {
    setUploadedImage(url);
    setOriginalSourceImage(url);
    setImageFileName(name);
    setIsGraphicSelected(true);
  };

  // AI Graphic Generator Mock
  const handleGenerateAiGraphic = () => {
    if (!aiPrompt.trim()) return;
    setIsAiGenerating(true);
    setTimeout(() => {
      const randomPreset = SAMPLE_GRAPHICS_LIBRARY[Math.floor(Math.random() * SAMPLE_GRAPHICS_LIBRARY.length)];
      setUploadedImage(randomPreset.url);
      setOriginalSourceImage(randomPreset.url);
      setImageFileName(`AI: ${aiPrompt.slice(0, 20)}...`);
      setIsAiGenerating(false);
      setIsGraphicSelected(true);
    }, 1200);
  };

  // Automatic Magic Background Removal (Convert pure white to transparent)
  const handleAutoRemoveBackground = () => {
    if (!uploadedImage) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.drawImage(img, 0, 0);
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;

      // Identify background pixels (light background / border detection)
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        // If near pure white
        if (r > 235 && g > 235 && b > 235) {
          data[i + 3] = 0;
        }
      }

      ctx.putImageData(imgData, 0, 0);
      const transparentDataUrl = canvas.toDataURL('image/png', 0.95);
      setUploadedImage(transparentDataUrl);
    };
    img.src = uploadedImage;
  };

  // Crop Complete Handler
  const handleCropComplete = (croppedUrl: string) => {
    setUploadedImage(croppedUrl);
    setIsGraphicSelected(true);
  };

  // Generative AI Artwork Generator (Module 5)
  const handleGenerateAiArtwork = async (promptToUse?: string) => {
    const textPrompt = (promptToUse || aiPrompt).trim();
    if (!textPrompt) return;
    setIsAiGenerating(true);
    try {
      const res = await fetch('/api/generate-design', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: textPrompt, style: 'streetwear' })
      });
      const data: any = await res.json();
      if (data.imageUrl) {
        setUploadedImage(data.imageUrl);
        setOriginalSourceImage(data.imageUrl);
        setImageFileName(`ai-design-${Date.now()}.png`);
        setIsGraphicSelected(true);
      }
    } catch (err) {
      console.error('Failed to generate AI design:', err);
    } finally {
      setIsAiGenerating(false);
    }
  };

  // High-DPI 300 DPI Export (Module 1)
  const exportHighDpiPng = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 2400;
    canvas.height = 3000;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, 2400, 3000);

    const renderTextToExport = () => {
      if (customTypographyText && customTypographyText.trim()) {
        ctx.save();
        ctx.font = `bold 180px ${customFont || 'Impact, sans-serif'}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = printTechnique.includes('Embroidery') ? embroideryThreadColor : customTextColor;
        ctx.shadowColor = 'rgba(0,0,0,0.5)';
        ctx.shadowBlur = 15;

        const textY = uploadedImage ? 2600 : 1500;

        if (textArc && Math.abs(textArc) > 5) {
          const radius = Math.max(500, 1500 - Math.abs(textArc) * 10);
          const arcSign = textArc > 0 ? 1 : -1;
          const arcCenterY = textY + (arcSign > 0 ? radius : -radius);
          const chars = customTypographyText.split('');
          const totalAngle = (chars.length * 85) / radius;
          let currentAngle = -totalAngle / 2;

          chars.forEach((char) => {
            ctx.save();
            ctx.translate(1200 + Math.sin(currentAngle) * radius, arcCenterY - Math.cos(currentAngle) * radius * arcSign);
            ctx.rotate(currentAngle * arcSign);
            if (strokeWidth && strokeWidth > 0) {
              ctx.strokeStyle = strokeColor || '#000000';
              ctx.lineWidth = strokeWidth * 6;
              ctx.strokeText(char, 0, 0);
            }
            ctx.fillText(char, 0, 0);
            ctx.restore();
            currentAngle += totalAngle / chars.length;
          });
        } else {
          if (strokeWidth && strokeWidth > 0) {
            ctx.strokeStyle = strokeColor || '#000000';
            ctx.lineWidth = strokeWidth * 6;
            ctx.strokeText(customTypographyText, 1200, textY);
          }
          ctx.fillText(customTypographyText, 1200, textY);
        }
        ctx.restore();
      }

      canvas.toBlob((blob) => {
        if (!blob) return;
        const link = document.createElement('a');
        link.download = `${product.name.toLowerCase().replace(/\s+/g, '-')}-print-ready-300dpi.png`;
        link.href = URL.createObjectURL(blob);
        link.click();
      }, 'image/png');
    };

    if (uploadedImage) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const hRatio = customTypographyText ? 0.75 : 0.9;
        const maxW = 2400 * 0.9;
        const maxH = 3000 * hRatio;
        const scale = Math.min(maxW / img.width, maxH / img.height);
        const drawW = img.width * scale;
        const drawH = img.height * scale;
        const drawX = (2400 - drawW) / 2;
        const drawY = customTypographyText ? (2200 - drawH) / 2 + 100 : (3000 - drawH) / 2;

        ctx.drawImage(img, drawX, drawY, drawW, drawH);
        renderTextToExport();
      };
      img.onerror = () => {
        renderTextToExport();
      };
      img.src = uploadedImage;
    } else {
      renderTextToExport();
    }
  };

  // Reset Graphic Position & Transforms
  const handleResetAlignment = () => {
    setOffsetX(0);
    setOffsetY(0);
    setScalePercent(100);
    setRotation(0);
  };

  // Drag handlers on the garment canvas
  const handleGraphicPointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingGraphic(true);
    setIsGraphicSelected(true);
    dragStartPos.current = {
      x: e.clientX,
      y: e.clientY,
      initialOffsetX: offsetX,
      initialOffsetY: offsetY,
      initialScale: scalePercent
    };
  };

  const handleResizeHandlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizingHandle(true);
    dragStartPos.current = {
      x: e.clientX,
      y: e.clientY,
      initialOffsetX: offsetX,
      initialOffsetY: offsetY,
      initialScale: scalePercent
    };
  };

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (isDraggingGraphic) {
        const deltaX = e.clientX - dragStartPos.current.x;
        const deltaY = e.clientY - dragStartPos.current.y;
        setOffsetX(Math.max(-120, Math.min(120, dragStartPos.current.initialOffsetX + deltaX)));
        setOffsetY(Math.max(-160, Math.min(160, dragStartPos.current.initialOffsetY + deltaY)));
      } else if (isResizingHandle) {
        const deltaX = e.clientX - dragStartPos.current.x;
        const deltaY = e.clientY - dragStartPos.current.y;
        const scaleDelta = (deltaX + deltaY) * 0.4;
        setScalePercent(Math.max(30, Math.min(220, Math.round(dragStartPos.current.initialScale + scaleDelta))));
      }
    };

    const handlePointerUp = () => {
      setIsDraggingGraphic(false);
      setIsResizingHandle(false);
    };

    if (isDraggingGraphic || isResizingHandle) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
    }

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [isDraggingGraphic, isResizingHandle]);

  // Sizing matrix calculations
  const totalQuantity = Object.keys(sizeCounts).reduce((acc: number, key: string) => acc + (sizeCounts[key] || 0), 0);

  const handleUpdateSize = (size: string, delta: number) => {
    setSizeCounts(prev => {
      const current = prev[size] || 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [size]: next };
    });
  };

  const handleSetAllSizes = (qty: number) => {
    const updated: Record<string, number> = {};
    product.sizes.forEach(sz => {
      updated[sz] = qty;
    });
    setSizeCounts(updated);
  };

  // Pricing & Tiered Wholesale Discounts (Module 4 Formula)
  const basePricePerUnit = selectedFabricVariant ? selectedFabricVariant.price : product.basePrice;
  const printPlacementInfo = PRINT_PLACEMENT_CONFIG[printPlacement];
  const printSurcharge = totalQuantity > 30
    ? (printPlacementInfo?.surchargeTier2 ?? printPlacementInfo?.surcharge ?? 0)
    : (printPlacementInfo?.surcharge ?? 0);
  const embroiderySurcharge = printTechnique.includes('Embroidery') ? 60 : 0;
  const unitRawPrice = basePricePerUnit + printSurcharge + embroiderySurcharge;

  let discountPercent = 0;
  let discountTierLabel = 'Retail Sampling (1–9)';
  if (totalQuantity >= 200) {
    discountPercent = 0.35;
    discountTierLabel = 'Wholesale Partner Tier (35% OFF)';
  } else if (totalQuantity >= 50) {
    discountPercent = 0.25;
    discountTierLabel = 'Bulk Mill Tier (25% OFF)';
  } else if (totalQuantity >= 10) {
    discountPercent = 0.15;
    discountTierLabel = 'Team & Studio Tier (15% OFF)';
  }

  const effectiveUnitDiscount = Math.round(unitRawPrice * discountPercent);
  const finalUnitPrice = Math.max(1, unitRawPrice - effectiveUnitDiscount);
  const subtotalPrice = finalUnitPrice * totalQuantity;
  const totalSavings = effectiveUnitDiscount * totalQuantity;

  // Quotation breakdown list
  const quotationBreakdown: QuotationBreakdownItem[] = Object.entries(sizeCounts)
    .filter(([_, q]) => q > 0)
    .map(([sz, q]) => ({
      size: sz,
      quantity: q,
      unitPrice: unitRawPrice
    }));

  // Add to Cart handler
  const handleAddToCart = () => {
    if (totalQuantity <= 0) {
      alert('Please add at least 1 item in any size to proceed.');
      return;
    }

    const currentGsm = selectedFabricVariant ? selectedFabricVariant.gsm : product.gsm;
    const currentFabricName = selectedFabricVariant ? selectedFabricVariant.name : `${product.gsm} GSM`;

    const cartProductMock = {
      id: product.id,
      name: `${product.name} [${currentFabricName}] (${selectedColor.name})`,
      category: 'Cotton' as any,
      gsm: currentGsm,
      width: 'Garment Ready-to-Wear',
      count: product.fit,
      color: selectedColor.name,
      colorCode: selectedColor.hex,
      price_per_meter: finalUnitPrice,
      swatch_test_price: 0,
      swatch_big_price: 0,
      print_surcharge_per_meter: printSurcharge,
      images: [uploadedImage || product.mockupImages.front],
      description: product.description,
      weave_type: product.fabric,
      composition: product.fabric,
      in_stock: true
    };

    const sizeSummary = Object.entries(sizeCounts)
      .filter(([_, q]) => Number(q) > 0)
      .map(([s, q]) => `${s}: ${q}`)
      .join(', ');

    addToCart(
      cartProductMock,
      'apparel',
      totalQuantity,
      {
        requiresPrint: printPlacement !== 'none',
        designName: imageFileName || `${product.name} Custom Print`,
        designUrl: uploadedImage || undefined,
        dpi: imageDpi,
        notes: `Sizes: ${sizeSummary} | Color: ${selectedColor.name} | Placement: ${PRINT_PLACEMENT_CONFIG[printPlacement]?.name}`
      },
      1,
      selectedColor.name
    );

    onClose();
  };

  // Convert placement key to position coordinates inside mockup
  const getArtworkPlacementStyle = () => {
    switch (printPlacement) {
      case 'pocket_left':
        return { width: '22%', height: '22%', top: '24%', left: '56%' };
      case 'chest_center':
        return { width: '36%', height: '36%', top: '25%', left: '32%' };
      case 'a4_front':
        return { width: '42%', height: '52%', top: '20%', left: '29%' };
      case 'a3_front':
      case 'full_back':
        return { width: '48%', height: '60%', top: '18%', left: '26%' };
      default:
        return { width: '34%', height: '34%', top: '25%', left: '33%' };
    }
  };

  const activeColor = selectedColor || initialColor || product?.colors?.[0] || APPAREL_COLORS.black || { name: 'Pitch Black', hex: '#161616' };

  const isDarkColor =
    activeColor.hex === '#161616' ||
    activeColor.hex === '#1B2A4A' ||
    activeColor.hex === '#7F1D1D' ||
    activeColor.hex === '#374151' ||
    activeColor.hex === '#0F766E';

  const placementStyle = getArtworkPlacementStyle();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-6xl bg-[#FEFBF1] dark:bg-[#121312] text-[#0F100F] dark:text-white rounded-3xl shadow-2xl border border-black/10 dark:border-white/10 overflow-hidden flex flex-col max-h-[94vh]">
        
        {/* TOP MODAL HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-black/10 dark:border-white/10 bg-white/50 dark:bg-white/[0.03] backdrop-blur-sm shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-2xl bg-[#0F100F] dark:bg-white text-white dark:text-[#0F100F]">
              <Shirt className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-[#AC7900] dark:text-[#D4AF37] uppercase tracking-wider">
                  {product.category} · {product.gsm} GSM
                </span>
                {product.badge && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EE6352]/15 text-[#EE6352]">
                    {product.badge}
                  </span>
                )}
              </div>
              <h2 className="text-lg sm:text-xl font-bold font-editorial">{product.name}</h2>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Quick Sizing Tab Toggle */}
            <div className="hidden sm:flex p-1 bg-black/5 dark:bg-white/5 rounded-full border border-black/10 dark:border-white/10 text-xs font-semibold">
              <button
                onClick={() => setActiveStudioTab('design')}
                className={`px-3 py-1 rounded-full transition ${
                  activeStudioTab === 'design'
                    ? 'bg-[#0F100F] dark:bg-white text-white dark:text-[#0F100F] shadow-sm'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                1. Artwork & Placement
              </button>
              <button
                onClick={() => setActiveStudioTab('sizing')}
                className={`px-3 py-1 rounded-full transition flex items-center space-x-1 ${
                  activeStudioTab === 'sizing'
                    ? 'bg-[#0F100F] dark:bg-white text-white dark:text-[#0F100F] shadow-sm'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <span>2. Sizes ({totalQuantity} pcs)</span>
              </button>
              {isJerseyMode && (
                <button
                  onClick={() => setActiveStudioTab('jersey')}
                  className={`px-3 py-1 rounded-full transition ${
                    activeStudioTab === 'jersey'
                      ? 'bg-[#0F100F] dark:bg-white text-white dark:text-[#0F100F] shadow-sm'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  3. Team Roster
                </button>
              )}
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition text-slate-500 hover:text-black dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* MAIN STUDIO GRID */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-0">
          
          {/* LEFT 6 COLS: INTERACTIVE VISUAL MOCKUP CANVAS */}
          <div
            ref={garmentCanvasRef}
            onClick={() => setIsGraphicSelected(false)}
            className="lg:col-span-6 p-6 sm:p-8 flex flex-col items-center justify-between border-b lg:border-b-0 lg:border-r border-black/10 dark:border-white/10 bg-slate-100/60 dark:bg-[#161816]/70 relative select-none"
          >
            
            {/* View Switcher & Toolbar */}
            <div className="w-full flex flex-wrap items-center justify-between gap-2 mb-3 z-10">
              <div className="flex items-center bg-white dark:bg-[#1E201E] p-1 rounded-full border border-black/10 dark:border-white/10 shadow-sm text-xs font-bold">
                <button
                  onClick={() => setIsLive3D(true)}
                  className={`px-3 py-1 rounded-full transition ${
                    isLive3D
                      ? 'bg-amber-500 text-black font-black shadow-xs'
                      : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  3D View
                </button>
                <button
                  onClick={() => setIsLive3D(false)}
                  className={`px-3 py-1 rounded-full transition ${
                    !isLive3D
                      ? 'bg-amber-500 text-black font-black shadow-xs'
                      : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  2D Flat
                </button>
              </div>

              {/* 4 Angle Switcher */}
              <div className="flex items-center gap-1 text-[10px] font-bold">
                {(['front', 'back', 'left_sleeve', 'right_sleeve'] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setViewSide(s);
                      if (s === 'front' || s === 'back') setActiveSide(s);
                    }}
                    className={`px-2.5 py-1 rounded-full border transition uppercase ${
                      viewSide === s
                        ? 'bg-[#0F100F] dark:bg-white text-white dark:text-[#0F100F] border-transparent font-black shadow-xs'
                        : 'border-black/10 dark:border-white/10 text-slate-500 bg-white/50 dark:bg-black/50'
                    }`}
                  >
                    {s === 'left_sleeve' ? 'L-Sleeve' : s === 'right_sleeve' ? 'R-Sleeve' : s}
                  </button>
                ))}
              </div>

              {/* 360 Spin, Safe Guide & 300 DPI Export */}
              <div className="flex items-center gap-1.5 ml-auto">
                <button
                  onClick={() => setAutoRotate(!autoRotate)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold transition border border-black/10 dark:border-white/10 ${
                    autoRotate ? 'bg-amber-500 text-black' : 'bg-white dark:bg-[#1E201E] text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <span>360°</span>
                </button>

                <button
                  onClick={exportHighDpiPng}
                  disabled={!uploadedImage && !customTypographyText}
                  className="p-1.5 rounded-full bg-white dark:bg-[#1E201E] border border-black/10 dark:border-white/10 text-amber-600 hover:scale-105 transition disabled:opacity-30"
                  title="Download 300 DPI Print File"
                >
                  <Download className="w-4 h-4" />
                </button>

                <div className="flex items-center space-x-1.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>24-48h Mill</span>
                </div>
              </div>
            </div>

            {/* MOCKUP CONTAINER WITH REALISTIC SHIRT & DYNAMIC INTERACTIVE GRAPHIC */}
            <div className="relative w-full max-w-sm aspect-[4/5] my-auto flex items-center justify-center select-none bg-gradient-to-b from-[#F7F7F8] via-[#ECECEF] to-[#E2E2E8] dark:from-[#222422] dark:via-[#1A1C1A] dark:to-[#121312] rounded-3xl p-4 shadow-xl border border-black/5 dark:border-white/5 overflow-hidden">
              
              {isLive3D ? (
                /* 🌟 Real-Time 3D WebGL Configurator (Module 2) */
                <div className="w-full h-full relative">
                  <ThreeDGarmentViewer
                    designUrl={uploadedImage}
                    color={{ hex: activeColor.hex, name: activeColor.name }}
                    rotation={rotation}
                    scalePercent={scalePercent}
                    artworkPlacement={printPlacement}
                    isFlippedH={false}
                    side={viewSide}
                    autoRotate={autoRotate}
                    modelType={getGarmentModelType(product.id)}
                    offsetX={offsetX}
                    offsetY={offsetY}
                    customText={customTypographyText}
                    customTextColor={printTechnique.includes('Embroidery') ? embroideryThreadColor : customTextColor}
                    customTextFont={customFont}
                    textArc={textArc}
                    strokeWidth={strokeWidth}
                    strokeColor={strokeColor}
                    isEmbroidery={printTechnique.includes('Embroidery')}
                    embroideryThreadColor={embroideryThreadColor}
                    fabricPbr={fabricPbr}
                    lightingPreset={lightingPreset}
                  />
                </div>
              ) : (
                /* 🎨 Clean Vector Studio Mockup (with custom overlay handled in this container) */
                <div className="w-full h-full flex items-center justify-center pointer-events-none">
                  <GarmentMockup
                    type={getGarmentModelType(product.id)}
                    colorHex={activeColor.hex}
                    side={activeSide}
                    artworkUrl={null}
                    hideArtworkOverlay={true}
                  />
                </div>
              )}

              {/* Safe Printable Zone Guide Dashed Rectangle */}
              {showPrintSafeZone && printPlacement !== 'none' && (
                <div
                  className="absolute pointer-events-none border border-dashed border-[#AC7900]/40 rounded-xl"
                  style={placementStyle}
                >
                  <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[9px] font-bold text-[#AC7900] bg-white/80 dark:bg-black/80 px-1.5 py-0.5 rounded">
                    Printable Zone
                  </span>
                </div>
              )}

              {/* INTERACTIVE CUSTOM GRAPHIC OVERLAY WITH DRAG, SCALE & CROP */}
              {uploadedImage && printPlacement !== 'none' && (
                <div
                  onClick={e => {
                    e.stopPropagation();
                    setIsGraphicSelected(true);
                  }}
                  onPointerDown={handleGraphicPointerDown}
                  className={`absolute flex items-center justify-center cursor-move transition-transform duration-75 ${
                    isGraphicSelected ? 'ring-2 ring-[#AC7900] shadow-2xl' : 'hover:ring-1 hover:ring-[#AC7900]/50'
                  }`}
                  style={{
                    ...placementStyle,
                    transform: `translate(${offsetX}px, ${offsetY}px) rotate(${rotation}deg) scale(${scalePercent / 100})`
                  }}
                >
                  {/* The Artwork Image */}
                  <img
                    src={uploadedImage}
                    alt="Custom Graphic"
                    className="max-w-full max-h-full object-contain filter drop-shadow-md pointer-events-none"
                    style={{
                      mixBlendMode:
                        blendMode === 'auto'
                          ? isDarkColor
                            ? 'normal'
                            : 'multiply'
                          : blendMode,
                      filter: printTechnique.includes('Embroidery')
                        ? 'drop-shadow(0 3px 3px rgba(0,0,0,0.7)) contrast(1.2) brightness(1.05)'
                        : dtfFinish === 'gloss'
                        ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.35)) brightness(1.08)'
                        : 'drop-shadow(0 1px 3px rgba(0,0,0,0.3))'
                    }}
                  />

                  {/* ACTIVE BOUNDING BOX HANDLES (WORD / CANVA STYLE) */}
                  {isGraphicSelected && (
                    <>
                      {/* 4 Corner Resize Handles */}
                      <div
                        onPointerDown={handleResizeHandlePointerDown}
                        className="absolute -top-2 -left-2 w-4 h-4 bg-white border-2 border-[#AC7900] rounded-full cursor-nwse-resize shadow-lg hover:scale-125 transition-transform flex items-center justify-center z-30"
                        title="Drag corner to scale / resize"
                      >
                        <span className="w-1.5 h-1.5 bg-[#AC7900] rounded-full" />
                      </div>
                      <div
                        onPointerDown={handleResizeHandlePointerDown}
                        className="absolute -top-2 -right-2 w-4 h-4 bg-white border-2 border-[#AC7900] rounded-full cursor-nesw-resize shadow-lg hover:scale-125 transition-transform flex items-center justify-center z-30"
                        title="Drag corner to scale / resize"
                      >
                        <span className="w-1.5 h-1.5 bg-[#AC7900] rounded-full" />
                      </div>
                      <div
                        onPointerDown={handleResizeHandlePointerDown}
                        className="absolute -bottom-2 -left-2 w-4 h-4 bg-white border-2 border-[#AC7900] rounded-full cursor-nesw-resize shadow-lg hover:scale-125 transition-transform flex items-center justify-center z-30"
                        title="Drag corner to scale / resize"
                      >
                        <span className="w-1.5 h-1.5 bg-[#AC7900] rounded-full" />
                      </div>
                      <div
                        onPointerDown={handleResizeHandlePointerDown}
                        className="absolute -bottom-2 -right-2 w-4 h-4 bg-white border-2 border-[#AC7900] rounded-full cursor-nwse-resize shadow-lg hover:scale-125 transition-transform flex items-center justify-center z-30"
                        title="Drag corner to scale / resize"
                      >
                        <span className="w-1.5 h-1.5 bg-[#AC7900] rounded-full" />
                      </div>

                      {/* Top Rotate Pin / Handle with Stem */}
                      <div className="absolute -top-7 left-1/2 -translate-x-1/2 flex flex-col items-center z-30">
                        <div
                          onClick={e => {
                            e.stopPropagation();
                            setRotation(prev => (prev + 90) % 360);
                          }}
                          className="w-6 h-6 bg-[#0F100F] dark:bg-white text-white dark:text-black rounded-full flex items-center justify-center cursor-pointer shadow-xl hover:scale-115 transition-transform"
                          title="Click to rotate 90°"
                        >
                          <RotateCw className="w-3.5 h-3.5" />
                        </div>
                        <div className="w-0.5 h-3 bg-[#AC7900]" />
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* FLOATING ACTION TOOLBAR DIRECTLY ABOVE THE SHIRT */}
              {uploadedImage && isGraphicSelected && printPlacement !== 'none' && (
                <div
                  onClick={e => e.stopPropagation()}
                  className="absolute top-3 inset-x-4 mx-auto max-w-sm bg-[#0F100F]/90 dark:bg-white/95 backdrop-blur-md text-white dark:text-[#0F100F] px-3 py-1.5 rounded-full shadow-2xl border border-white/20 dark:border-black/10 flex items-center justify-around text-xs font-bold z-20 animate-in slide-in-from-top-2 duration-150"
                >
                  <button
                    onClick={() => setScalePercent(prev => Math.min(240, prev + 15))}
                    className="p-1 rounded-full hover:bg-white/20 dark:hover:bg-black/10 transition flex items-center space-x-0.5"
                    title="Enlarge (+)"
                  >
                    <ZoomIn className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-[10px] hidden sm:inline">+</span>
                  </button>

                  <button
                    onClick={() => setScalePercent(prev => Math.max(30, prev - 15))}
                    className="p-1 rounded-full hover:bg-white/20 dark:hover:bg-black/10 transition flex items-center space-x-0.5"
                    title="Shrink (-)"
                  >
                    <ZoomOut className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-[10px] hidden sm:inline">-</span>
                  </button>

                  <button
                    onClick={() => setIsCropModalOpen(true)}
                    className="flex items-center space-x-1 px-2 py-1 rounded-full hover:bg-white/20 dark:hover:bg-black/10 transition"
                    title="Crop image"
                  >
                    <Scissors className="w-3.5 h-3.5 text-[#D4AF37] dark:text-[#AC7900]" />
                    <span>Crop</span>
                  </button>

                  <button
                    onClick={handleAutoRemoveBackground}
                    className="flex items-center space-x-1 px-2 py-1 rounded-full hover:bg-white/20 dark:hover:bg-black/10 transition"
                    title="Remove solid white background"
                  >
                    <Wand2 className="w-3.5 h-3.5 text-purple-400 dark:text-purple-600" />
                    <span>Magic BG</span>
                  </button>

                  <button
                    onClick={handleResetAlignment}
                    className="flex items-center space-x-1 px-2 py-1 rounded-full hover:bg-white/20 dark:hover:bg-black/10 transition"
                    title="Center graphic"
                  >
                    <Move className="w-3.5 h-3.5" />
                    <span>Center</span>
                  </button>

                  <button
                    onClick={() => {
                      setUploadedImage(null);
                      setOriginalSourceImage(null);
                      setImageFileName('');
                    }}
                    className="flex items-center space-x-1 px-2 py-1 rounded-full text-red-400 hover:bg-red-500/20 transition"
                    title="Delete artwork"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Jersey Custom Number & Name Overlay (If in sports kit mode & enabled) */}
              {isJerseyMode && showJerseyTextOverlay && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center font-black pointer-events-none z-10">
                  <span
                    className="text-xs uppercase tracking-widest"
                    style={{ color: jerseyNumberColor }}
                  >
                    {jerseyTeamName}
                  </span>
                  <span
                    className="text-2xl sm:text-3xl font-black mt-1"
                    style={{
                      color: jerseyNumberColor,
                      textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                    }}
                  >
                    {jerseyPlayers[0]?.number || '07'}
                  </span>
                  <span
                    className="text-[10px] uppercase font-bold tracking-wider"
                    style={{ color: jerseyNumberColor }}
                  >
                    {jerseyPlayers[0]?.name || 'CAPTAIN'}
                  </span>
                </div>
              )}

              {/* DPI & Print Specs Tag on Mockup */}
              {uploadedImage && printPlacement !== 'none' && (
                <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-md text-white px-2.5 py-1 rounded-xl text-[10px] font-semibold flex items-center space-x-1.5 shadow-lg">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{imageDpi} DPI Reactive DTF</span>
                  <span className="text-white/40">|</span>
                  <span className="text-[#D4AF37]">{PRINT_PLACEMENT_CONFIG[printPlacement]?.dimensions}</span>
                </div>
              )}
            </div>

            {/* COLOR SWATCH SELECTOR BAR (Directly under mockup) */}
            <div
              onClick={e => e.stopPropagation()}
              className="w-full mt-4 p-3 bg-white dark:bg-[#1A1C1A] rounded-2xl border border-black/10 dark:border-white/10 shadow-sm z-10"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Select Shade: <strong className="text-black dark:text-white">{activeColor.name}</strong>
                </span>
                <span className="text-[11px] font-semibold text-[#AC7900] dark:text-[#D4AF37]">
                  {product.colors.length} Colours Available
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.colors.map(col => (
                  <button
                    key={col.name}
                    onClick={() => setSelectedColor(col)}
                    className={`group relative w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center ${
                      activeColor.name === col.name
                        ? 'border-[#0F100F] dark:border-white scale-110 shadow-md ring-2 ring-[#AC7900]/40'
                        : 'border-black/20 dark:border-white/20 hover:scale-105'
                    }`}
                    style={{ backgroundColor: col.hex }}
                    title={col.name}
                  >
                    {activeColor.name === col.name && (
                      <Check
                        className={`w-4 h-4 ${
                          col.hex === '#F9FAFB' || col.hex === '#C084FC' ? 'text-black' : 'text-white'
                        }`}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT 6 COLS: TABBED STUDIO CONTROLS (DESIGN / TYPOGRAPHY / PBR / SIZING / JERSEY) */}
          <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto">
            
            <div>
              {/* TOP STUDIO MODULE TABS SWITCHER (MODULES 1-5) */}
              <div className="flex items-center gap-1.5 p-1 bg-black/5 dark:bg-white/5 rounded-2xl mb-6 overflow-x-auto">
                {[
                  { id: 'design' as const, label: 'Artwork & AI', icon: <Sparkles className="w-3.5 h-3.5" /> },
                  { id: 'typography' as const, label: 'Typography', icon: <Type className="w-3.5 h-3.5" /> },
                  { id: 'pbr' as const, label: '3D Materials', icon: <Layers className="w-3.5 h-3.5" /> },
                  { id: 'sizing' as const, label: 'Bulk Matrix', icon: <Sliders className="w-3.5 h-3.5" />, badge: 'Save 35%' },
                  { id: 'jersey' as const, label: 'Sports Jersey', icon: <Trophy className="w-3.5 h-3.5" /> }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveStudioTab(tab.id)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
                      activeStudioTab === tab.id
                        ? 'bg-[#0F100F] dark:bg-white text-white dark:text-[#0F100F] shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/5'
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                    {tab.badge && (
                      <span className="text-[9px] bg-amber-500 text-black px-1.5 py-0.5 rounded-full font-black">
                        {tab.badge}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* TAB 1: ARTWORK UPLOAD & PRINT PLACEMENT */}
              {activeStudioTab === 'design' && (
                <div className="space-y-6 animate-in fade-in duration-150">
                  
                  {/* FABRIC & GSM VARIANT SELECTION (IF MULTIPLE OPTIONS) */}
                  {product.fabricVariants && product.fabricVariants.length > 1 && (
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                        1. Select Fabric & GSM Weight
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {product.fabricVariants.map(variant => (
                          <button
                            key={variant.name}
                            onClick={() => setSelectedFabricVariant(variant)}
                            className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between ${
                              selectedFabricVariant?.name === variant.name
                                ? 'border-[#0F100F] dark:border-white bg-[#0F100F]/5 dark:bg-white/10 shadow-sm ring-1 ring-black/20 dark:ring-white/20'
                                : 'border-black/10 dark:border-white/10 hover:border-black/30 dark:hover:border-white/30'
                            }`}
                          >
                            <span className="text-xs font-bold leading-snug">{variant.name}</span>
                            <div className="flex items-center justify-between mt-2 pt-1 border-t border-black/5 dark:border-white/5">
                              <span className="text-[10px] text-slate-500 font-medium">{variant.gsm} GSM</span>
                              <span className="text-[11px] font-extrabold text-[#AC7900] dark:text-[#D4AF37]">
                                ₹{variant.price} / pc
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* PRINT PLACEMENT SELECTION */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                      {product.fabricVariants && product.fabricVariants.length > 1 ? '2. Choose Print Placement' : '1. Choose Print Placement'}
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {Object.entries(PRINT_PLACEMENT_CONFIG).map(([key, config]) => (
                        <button
                          key={key}
                          onClick={() => setPrintPlacement(key as PrintPlacement)}
                          className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between ${
                            printPlacement === key
                              ? 'border-[#0F100F] dark:border-white bg-[#0F100F]/5 dark:bg-white/10 shadow-sm ring-1 ring-black/20 dark:ring-white/20'
                              : 'border-black/10 dark:border-white/10 hover:border-black/30 dark:hover:border-white/30'
                          }`}
                        >
                          <span className="text-xs font-bold leading-snug">{config.name}</span>
                          <div className="flex items-center justify-between mt-2 pt-1 border-t border-black/5 dark:border-white/5">
                            <span className="text-[10px] text-slate-500 font-medium">{config.dimensions}</span>
                            <span
                              className={`text-[10px] font-bold ${
                                config.surcharge === 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-[#AC7900] dark:text-[#D4AF37]'
                              }`}
                            >
                              {config.badge}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* ARTWORK UPLOADER (If print is chosen) */}
                  {printPlacement !== 'none' && (
                    <div className="space-y-4">
                      {/* ✨ Generative AI Design Assistant (Module 5) */}
                      <div className="p-4 rounded-3xl bg-gradient-to-r from-purple-950/20 via-indigo-950/20 to-black/5 dark:from-purple-950/60 dark:via-indigo-950/60 dark:to-black/80 border border-purple-500/30 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-purple-700 dark:text-purple-300 flex items-center gap-1.5">
                            <Wand2 className="w-4 h-4 text-purple-500" />
                            <span>Generative AI Design Assistant</span>
                          </span>
                          <span className="text-[10px] font-extrabold text-amber-600 dark:text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full">
                            AI Vector 300 DPI
                          </span>
                        </div>

                        <div className="flex gap-2">
                          <input
                            value={aiPrompt}
                            onChange={e => setAiPrompt(e.target.value)}
                            placeholder="Describe your design (e.g. Cyberpunk neon wolf, Japanese wave art...)"
                            className="flex-1 px-3.5 py-2.5 rounded-2xl bg-white dark:bg-black/60 border border-black/10 dark:border-white/15 text-xs text-black dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
                          />
                          <button
                            onClick={() => handleGenerateAiArtwork()}
                            disabled={isAiGenerating || !aiPrompt.trim()}
                            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-40 text-xs font-black text-white shrink-0 active:scale-95 transition shadow-md"
                          >
                            {isAiGenerating ? <RotateCcw className="w-4 h-4 animate-spin" /> : 'Generate'}
                          </button>
                        </div>

                        {/* Quick Inspiration Chips */}
                        <div className="flex gap-1.5 overflow-x-auto pb-1 text-[10px] font-bold">
                          {[
                            { label: '🌊 Japanese Wave', prompt: 'Great Wave off Kanagawa Japan minimalist' },
                            { label: '🐺 Cyberpunk Wolf', prompt: 'Cyberpunk neon wolf streetwear 2077' },
                            { label: '🛡️ Varsity Crest', prompt: 'Varsity athletic department gold shield crest' },
                            { label: '🌸 Minimal Floral', prompt: 'Botanical rose floral line art minimal' },
                            { label: '🐉 Dragon Fire', prompt: 'Dragon flame emblem bold streetwear' },
                          ].map(chip => (
                            <button
                              key={chip.label}
                              onClick={() => {
                                setAiPrompt(chip.prompt);
                                handleGenerateAiArtwork(chip.prompt);
                              }}
                              className="px-2.5 py-1 rounded-xl bg-white dark:bg-white/10 hover:bg-purple-100 dark:hover:bg-white/20 border border-purple-200 dark:border-white/10 text-purple-900 dark:text-purple-200 shrink-0 transition"
                            >
                              {chip.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                          2. Upload Custom Artwork or Choose Sample
                        </label>
                        {uploadedImage && (
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => setIsCropModalOpen(true)}
                              className="text-xs text-[#AC7900] dark:text-[#D4AF37] font-bold hover:underline flex items-center space-x-1"
                            >
                              <Scissors className="w-3.5 h-3.5" />
                              <span>Crop & Select</span>
                            </button>
                            <span className="text-slate-300 dark:text-slate-700">|</span>
                            <button
                              onClick={() => {
                                setUploadedImage(null);
                                setOriginalSourceImage(null);
                                setImageFileName('');
                              }}
                              className="text-xs text-red-500 hover:underline flex items-center space-x-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Remove</span>
                            </button>
                          </div>
                        )}
                      </div>

                      {/* File Upload Zone */}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/png,image/jpeg,image/webp,image/svg+xml,image/tiff"
                        onChange={handleFileUpload}
                        className="hidden"
                      />

                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="p-4 sm:p-5 rounded-3xl border-2 border-dashed border-[#AC7900]/40 dark:border-[#D4AF37]/40 hover:border-[#AC7900] bg-[#AC7900]/5 hover:bg-[#AC7900]/10 transition cursor-pointer flex flex-col items-center justify-center text-center group"
                      >
                        <div className="w-10 h-10 rounded-full bg-white dark:bg-[#1E201E] flex items-center justify-center text-[#AC7900] dark:text-[#D4AF37] shadow-sm mb-2 group-hover:scale-110 transition-transform">
                          <Upload className="w-5 h-5" />
                        </div>
                        <p className="text-xs font-bold text-[#0F100F] dark:text-white">
                          {imageFileName ? (
                            <span className="text-emerald-600 dark:text-emerald-400">✓ {imageFileName}</span>
                          ) : (
                            'Click to upload your logo or graphics file'
                          )}
                        </p>
                        <p className="text-[11px] text-slate-500 mt-1">
                          PNG, JPG, WebP, SVG or TIFF (Up to 50MB · High Res 300 DPI Recommended)
                        </p>
                      </div>

                      {/* Sample Graphics Library Chips */}
                      <div>
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                          Or try sample high-res artwork:
                        </span>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {SAMPLE_GRAPHICS_LIBRARY.map(item => (
                            <button
                              key={item.id}
                              onClick={() => handleSelectPreset(item.url, item.name)}
                              className="p-1.5 rounded-2xl border border-black/10 dark:border-white/10 hover:border-[#AC7900] bg-white dark:bg-[#1A1C1A] text-left transition flex items-center space-x-2 group"
                            >
                              <img
                                src={item.url}
                                alt={item.name}
                                className="w-8 h-8 rounded-xl object-cover shrink-0"
                              />
                              <div className="truncate">
                                <span className="block text-[11px] font-bold truncate group-hover:text-[#AC7900]">
                                  {item.name}
                                </span>
                                <span className="text-[9px] text-slate-500 uppercase">{item.category}</span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* AI Graphic Generator Input */}
                      <div className="p-3.5 bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-indigo-500/10 rounded-2xl border border-[#AC7900]/20">
                        <div className="flex items-center space-x-1.5 text-xs font-bold text-[#AC7900] dark:text-[#D4AF37] mb-1.5">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>AI Artwork Generator (Mill Studio AI)</span>
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={aiPrompt}
                            onChange={e => setAiPrompt(e.target.value)}
                            placeholder="e.g. Vintage surfer skull with tropical palms and sunset typography"
                            className="flex-1 bg-white dark:bg-[#181918] border border-black/10 dark:border-white/15 rounded-xl px-3 py-1.5 text-xs text-black dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#AC7900]"
                          />
                          <button
                            onClick={handleGenerateAiGraphic}
                            disabled={isAiGenerating || !aiPrompt.trim()}
                            className="px-4 py-1.5 rounded-xl bg-[#0F100F] dark:bg-white text-white dark:text-[#0F100F] text-xs font-bold hover:opacity-90 disabled:opacity-40 transition shrink-0 flex items-center space-x-1"
                          >
                            {isAiGenerating ? (
                              <span className="animate-spin w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full" />
                            ) : (
                              <>
                                <Zap className="w-3.5 h-3.5 text-[#D4AF37]" />
                                <span>Create</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Studio Smart Auto-Frame & DPI Sentinel */}
                      {uploadedImage && (
                        <StudioAutoFrameControls
                          onApplyPreset={handleAutoFramePreset}
                          onRemoveBackground={handleAutoRemoveBackground}
                          isTransparentBg={false}
                          dpi={imageDpi}
                          extractedColors={extractedPalette}
                          activePlacement={printPlacement}
                        />
                      )}

                      {/* Scale, Position & Crop Controls Panel */}
                      {uploadedImage && (
                        <div className="p-4 bg-white dark:bg-[#1A1C1A] rounded-2xl border border-black/10 dark:border-white/10 space-y-4">
                          
                          {/* Top Quick Actions */}
                          <div className="flex items-center justify-between pb-3 border-b border-black/5 dark:border-white/5">
                            <span className="text-xs font-bold flex items-center space-x-1.5">
                              <Sliders className="w-3.5 h-3.5 text-[#AC7900]" />
                              <span>Artwork Tools & Alignment</span>
                            </span>

                            <div className="flex items-center space-x-1.5">
                              <button
                                onClick={() => setIsCropModalOpen(true)}
                                className="px-2.5 py-1 rounded-xl bg-[#AC7900]/10 hover:bg-[#AC7900]/20 text-[#AC7900] dark:text-[#D4AF37] text-[11px] font-bold transition flex items-center space-x-1"
                              >
                                <Scissors className="w-3 h-3" />
                                <span>Crop</span>
                              </button>

                              <button
                                onClick={handleAutoRemoveBackground}
                                className="px-2.5 py-1 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-400 text-[11px] font-bold transition flex items-center space-x-1"
                              >
                                <Wand2 className="w-3 h-3" />
                                <span>Remove BG</span>
                              </button>
                            </div>
                          </div>

                          {/* Scale Slider */}
                          <div>
                            <div className="flex items-center justify-between text-xs font-semibold mb-1">
                              <span className="text-slate-500">Size / Scale:</span>
                              <span className="font-bold text-[#AC7900]">{scalePercent}%</span>
                            </div>
                            <div className="flex items-center space-x-3">
                              <Minimize2 className="w-3.5 h-3.5 text-slate-400" />
                              <input
                                type="range"
                                min="30"
                                max="200"
                                value={scalePercent}
                                onChange={e => setScalePercent(Number(e.target.value))}
                                className="flex-1 accent-[#AC7900]"
                              />
                              <Maximize2 className="w-3.5 h-3.5 text-slate-400" />
                            </div>
                          </div>

                          {/* Fine-tune X/Y Offset */}
                          <div className="grid grid-cols-2 gap-3 pt-2">
                            <div>
                              <label className="text-[11px] font-semibold text-slate-500">Position X (Horizontal)</label>
                              <div className="flex items-center space-x-2 mt-1">
                                <input
                                  type="range"
                                  min="-100"
                                  max="100"
                                  value={offsetX}
                                  onChange={e => setOffsetX(Number(e.target.value))}
                                  className="flex-1 accent-[#AC7900]"
                                />
                                <span className="text-[11px] font-mono font-bold w-6">{offsetX}</span>
                              </div>
                            </div>

                            <div>
                              <label className="text-[11px] font-semibold text-slate-500">Position Y (Vertical)</label>
                              <div className="flex items-center space-x-2 mt-1">
                                <input
                                  type="range"
                                  min="-140"
                                  max="140"
                                  value={offsetY}
                                  onChange={e => setOffsetY(Number(e.target.value))}
                                  className="flex-1 accent-[#AC7900]"
                                />
                                <span className="text-[11px] font-mono font-bold w-6">{offsetY}</span>
                              </div>
                            </div>
                          </div>

                          {/* Rotation & Blend Mode */}
                          <div className="flex items-center justify-between pt-3 border-t border-black/5 dark:border-white/5 text-xs">
                            <div className="flex items-center space-x-1.5">
                              <span className="text-slate-500 font-medium">Rotation:</span>
                              {[0, 90, 180, 270].map(deg => (
                                <button
                                  key={deg}
                                  onClick={() => setRotation(deg)}
                                  className={`px-2 py-0.5 rounded-lg font-bold text-[10px] ${
                                    rotation === deg
                                      ? 'bg-[#0F100F] dark:bg-white text-white dark:text-[#0F100F]'
                                      : 'bg-black/5 dark:bg-white/5'
                                  }`}
                                >
                                  {deg}°
                                </button>
                              ))}
                            </div>

                            <button
                              onClick={handleResetAlignment}
                              className="text-[11px] font-bold text-slate-500 hover:text-black dark:hover:text-white"
                            >
                              Reset Position
                            </button>
                          </div>

                        </div>
                      )}

                    </div>
                  )}

                  {/* PRINT TECHNIQUE PILLS */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                      3. Printing Technique
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {product.printTechniques.map(tech => (
                        <button
                          key={tech}
                          onClick={() => setPrintTechnique(tech)}
                          className={`px-3 py-1.5 rounded-full text-xs font-bold transition border ${
                            printTechnique === tech
                              ? 'bg-[#0F100F] dark:bg-white text-white dark:text-[#0F100F] border-transparent shadow-sm'
                              : 'bg-white dark:bg-[#1A1C1A] text-slate-700 dark:text-slate-300 border-black/10 dark:border-white/10'
                          }`}
                        >
                          {tech}
                        </button>
                      ))}
                    </div>

                    {/* Detailed Options when Embroidery is active */}
                    {printTechnique.includes('Embroidery') && (
                      <div className="mt-3 p-3.5 rounded-2xl bg-amber-500/[0.05] border border-amber-500/20 space-y-3 animate-in fade-in duration-150">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-amber-700 dark:text-amber-300">
                            🧵 Tajima Japanese Machine Threadwork
                          </span>
                          <span className="text-[10px] font-extrabold bg-amber-500/20 text-amber-800 dark:text-amber-200 px-2 py-0.5 rounded-full">
                            +₹60 / pc
                          </span>
                        </div>

                        {/* Stitch Style */}
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                            Stitch Style:
                          </span>
                          <div className="grid grid-cols-3 gap-1.5">
                            {[
                              { id: 'flat' as const, label: 'Flat Satin' },
                              { id: 'puff3d' as const, label: '3D Puff Raised' },
                              { id: 'patch' as const, label: 'Crest Patch' }
                            ].map(st => (
                              <button
                                key={st.id}
                                onClick={() => setEmbroideryStyle(st.id)}
                                className={`py-1.5 px-2 rounded-xl text-xs font-bold border transition ${
                                  embroideryStyle === st.id
                                    ? 'bg-[#0F100F] dark:bg-white text-white dark:text-black border-transparent shadow-xs'
                                    : 'bg-white dark:bg-[#1A1C1A] border-black/10 dark:border-white/10 text-slate-700 dark:text-slate-300'
                                }`}
                              >
                                {st.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Thread Color Swatches */}
                        <div>
                          <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                            <span>Thread Color:</span>
                            <span className="text-[#AC7900] dark:text-[#D4AF37]">
                              {EMBROIDERY_THREADS.find(t => t.hex === embroideryThreadColor)?.name || 'Gold'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 overflow-x-auto pb-1">
                            {EMBROIDERY_THREADS.map(t => (
                              <button
                                key={t.hex}
                                onClick={() => setEmbroideryThreadColor(t.hex)}
                                className={`w-7 h-7 rounded-full shrink-0 border-2 transition-transform flex items-center justify-center ${
                                  embroideryThreadColor === t.hex
                                    ? 'border-black dark:border-white scale-110 ring-2 ring-amber-500 shadow-sm'
                                    : 'border-black/20 dark:border-white/20'
                                }`}
                                style={{ backgroundColor: t.hex }}
                                title={t.name}
                              >
                                {embroideryThreadColor === t.hex && (
                                  <Check className={`w-3.5 h-3.5 ${t.hex === '#FFFFFF' ? 'text-black' : 'text-white'}`} />
                                )}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Detailed Options when DTF is active */}
                    {printTechnique.includes('DTF') && (
                      <div className="mt-3 p-3 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/10 dark:border-white/10 flex items-center justify-between animate-in fade-in duration-150">
                        <div>
                          <span className="text-xs font-bold text-[#0F100F] dark:text-white block">
                            🎨 DTF Finish Option
                          </span>
                          <span className="text-[10px] text-slate-500">
                            Choose between standard matte finish or vibrant gloss luster
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => setDtfFinish('matte')}
                            className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border transition ${
                              dtfFinish === 'matte'
                                ? 'bg-[#0F100F] dark:bg-white text-white dark:text-black border-transparent'
                                : 'border-black/10 dark:border-white/10'
                            }`}
                          >
                            Matte
                          </button>
                          <button
                            onClick={() => setDtfFinish('gloss')}
                            className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border transition ${
                              dtfFinish === 'gloss'
                                ? 'bg-[#0F100F] dark:bg-white text-white dark:text-black border-transparent'
                                : 'border-black/10 dark:border-white/10'
                            }`}
                          >
                            Gloss
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                </div>
              )}

              {/* TAB 2: TYPOGRAPHY & LETTERING ENGINE (MODULE 1) */}
              {activeStudioTab === 'typography' && (
                <div className="space-y-6 animate-in fade-in duration-150">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                      Custom Typography & Lettering
                    </label>
                    <input
                      value={customTypographyText}
                      onChange={e => setCustomTypographyText(e.target.value)}
                      placeholder="ENTER CUSTOM TEXT (e.g. TOKYO ATHLETICS)"
                      className="w-full px-4 py-3 rounded-2xl bg-white dark:bg-[#1E201E] border border-black/10 dark:border-white/10 text-sm font-black text-[#0F100F] dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  {/* Font Family Selector */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                      Font Typography Style
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {[
                        { id: 'Impact', label: 'Varsity Bold', family: "Impact, 'Arial Black', sans-serif" },
                        { id: 'Cinzel', label: 'Street Gothic', family: "'Cinzel', Georgia, serif" },
                        { id: 'Inter', label: 'Modern Sans', family: "'Inter', system-ui, sans-serif" },
                        { id: 'Playfair', label: 'Luxury Serif', family: "'Playfair Display', serif" },
                        { id: 'SpaceGrotesk', label: 'Tech Mono', family: "'Space Grotesk', monospace" },
                        { id: 'Brush', label: 'Signature Script', family: "'Brush Script MT', cursive" }
                      ].map(f => (
                        <button
                          key={f.id}
                          onClick={() => setCustomFont(f.id)}
                          className={`p-3 rounded-2xl border text-left transition ${
                            customFont === f.id
                              ? 'border-[#0F100F] dark:border-white bg-[#0F100F]/5 dark:bg-white/10 ring-1 ring-black/20 dark:ring-white/20'
                              : 'border-black/10 dark:border-white/10 hover:border-black/30'
                          }`}
                        >
                          <span className="block text-sm font-bold" style={{ fontFamily: f.family }}>
                            {f.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Curved Arc Radius Control */}
                  <div>
                    <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                      <span>Curved Banner / Arc Curvature</span>
                      <span className="text-[#AC7900] dark:text-[#D4AF37] font-mono">{textArc > 0 ? `+${textArc}` : textArc}</span>
                    </div>
                    <input
                      type="range" min={-80} max={80} value={textArc}
                      onChange={e => setTextArc(Number(e.target.value))}
                      className="w-full accent-amber-500"
                    />
                  </div>

                  {/* Outline Stroke Width */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                      Text Outline Stroke (Athletic Two-Tone)
                    </label>
                    <div className="flex items-center gap-2">
                      {[0, 1, 2, 4].map(sw => (
                        <button
                          key={sw}
                          onClick={() => setStrokeWidth(sw)}
                          className={`px-3 py-1.5 rounded-xl border text-xs font-bold ${
                            strokeWidth === sw
                              ? 'bg-[#0F100F] dark:bg-white text-white dark:text-[#0F100F] border-transparent'
                              : 'border-black/10 dark:border-white/10 bg-white dark:bg-[#1E201E]'
                          }`}
                        >
                          {sw === 0 ? 'No Outline' : `${sw}px Stroke`}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Color Palette */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                      Text Colorway
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {['#FFFFFF', '#111827', '#D4AF37', '#DC2626', '#2563EB', '#16A34A', '#F97316', '#06B6D4'].map(c => (
                        <button
                          key={c}
                          onClick={() => setCustomTextColor(c)}
                          className={`w-8 h-8 rounded-full border-2 transition-transform flex items-center justify-center ${
                            customTextColor === c ? 'border-black dark:border-white scale-110 shadow-md ring-2 ring-amber-500' : 'border-black/20 dark:border-white/20'
                          }`}
                          style={{ backgroundColor: c }}
                        >
                          {customTextColor === c && <Check className={`w-3.5 h-3.5 ${c === '#FFFFFF' ? 'text-black' : 'text-white'}`} />}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: 3D PBR MATERIALS & LIGHTING (MODULE 2) */}
              {activeStudioTab === 'pbr' && (
                <div className="space-y-6 animate-in fade-in duration-150">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                      Physical PBR Fabric Weave & Texture
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {[
                        { id: 'cotton_jersey' as const, label: 'Single Jersey Cotton', desc: '220 GSM • Soft Matte Finish', badge: 'Standard' },
                        { id: 'french_terry' as const, label: 'French Terry Weave', desc: '320 GSM • Heavy Structured Loop', badge: 'Heavyweight' },
                        { id: 'interlock_poly' as const, label: 'Interlock Polyester', desc: 'Micro-perforated Athletic Sheen', badge: 'Sports' },
                        { id: 'linen_silk' as const, label: 'Linen & Silk Blend', desc: 'Lustrous Slub Fiber Reflection', badge: 'Luxury' }
                      ].map(m => (
                        <button
                          key={m.id}
                          onClick={() => setFabricPbr(m.id)}
                          className={`p-3.5 rounded-2xl border text-left transition flex flex-col justify-between ${
                            fabricPbr === m.id
                              ? 'border-[#0F100F] dark:border-white bg-[#0F100F]/5 dark:bg-white/10 shadow-sm ring-1 ring-black/20 dark:ring-white/20'
                              : 'border-black/10 dark:border-white/10 hover:border-black/30'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-bold leading-snug">{m.label}</span>
                            <span className="text-[9px] font-black uppercase text-[#AC7900] dark:text-[#D4AF37] bg-amber-500/10 px-2 py-0.5 rounded-full">
                              {m.badge}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-500 font-medium">{m.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                      Studio Lighting Atmosphere
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'studio' as const, label: 'Spotlight', desc: 'Crisp Mill Light' },
                        { id: 'daylight' as const, label: 'Daylight', desc: 'Natural Sun' },
                        { id: 'neon' as const, label: 'Neon Tokyo', desc: 'Street Cyberpunk' }
                      ].map(l => (
                        <button
                          key={l.id}
                          onClick={() => setLightingPreset(l.id)}
                          className={`p-3 rounded-2xl border text-center transition ${
                            lightingPreset === l.id
                              ? 'bg-[#0F100F] dark:bg-white text-white dark:text-[#0F100F] border-transparent shadow-sm'
                              : 'border-black/10 dark:border-white/10 hover:border-black/30 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <span className="block text-xs font-bold">{l.label}</span>
                          <span className="block text-[10px] opacity-70 mt-0.5">{l.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: SIZE MATRIX & QUANTITY BREAKDOWN (MODULE 4) */}
              {activeStudioTab === 'sizing' && (
                <div className="space-y-6 animate-in fade-in duration-150">
                  
                  {/* SIZING HEADER & QUICK FILL */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold">Bulk Sizing Matrix & Dynamic Pricing</h3>
                      <p className="text-xs text-slate-500">
                        Select quantities per size · Automatic wholesale discounts applied
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setIsQuotationModalOpen(true)}
                        className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-black flex items-center gap-1 shadow-sm transition"
                      >
                        <FileDown className="w-3.5 h-3.5" />
                        <span>Print Quote</span>
                      </button>
                      <button
                        onClick={() => setSizeChartOpen(true)}
                        className="text-xs font-bold text-[#AC7900] dark:text-[#D4AF37] hover:underline flex items-center space-x-1"
                      >
                        <Info className="w-3.5 h-3.5" />
                        <span>Size Chart</span>
                      </button>
                    </div>
                  </div>

                  {/* Tiered Discount Summary Banner */}
                  <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs flex items-center justify-between">
                    <div>
                      <span className="font-extrabold text-amber-800 dark:text-amber-300 block">
                        ⚡ {discountTierLabel}
                      </span>
                      {totalSavings > 0 && (
                        <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold block mt-0.5">
                          You save ₹{totalSavings.toLocaleString('en-IN')} on this order!
                        </span>
                      )}
                    </div>
                    <span className="text-sm font-black text-amber-700 dark:text-amber-400">
                      ₹{finalUnitPrice} / unit
                    </span>
                  </div>

                  {/* QUICK FILL BUTTONS */}
                  <div className="flex items-center space-x-2 p-2 bg-white dark:bg-[#1A1C1A] rounded-2xl border border-black/10 dark:border-white/10 text-xs font-bold">
                    <span className="text-slate-400 text-[11px] px-1">Quick Bulk:</span>
                    <button
                      onClick={() => handleSetAllSizes(5)}
                      className="px-2.5 py-1 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-black/10 transition"
                    >
                      +5 each
                    </button>
                    <button
                      onClick={() => handleSetAllSizes(10)}
                      className="px-2.5 py-1 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-black/10 transition"
                    >
                      +10 each
                    </button>
                    <button
                      onClick={() => handleSetAllSizes(25)}
                      className="px-2.5 py-1 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-black/10 transition"
                    >
                      +25 each
                    </button>
                    <button
                      onClick={() => handleSetAllSizes(0)}
                      className="px-2.5 py-1 rounded-xl text-red-500 hover:bg-red-500/10 transition ml-auto"
                    >
                      Clear
                    </button>
                  </div>

                  {/* SIZING COUNTER ROWS */}
                  <div className="space-y-2.5">
                    {product.sizes.map(size => {
                      const count = sizeCounts[size] || 0;
                      return (
                        <div
                          key={size}
                          className={`p-3 rounded-2xl border transition flex items-center justify-between ${
                            count > 0
                              ? 'border-[#0F100F] dark:border-white bg-[#0F100F]/5 dark:bg-white/5'
                              : 'border-black/10 dark:border-white/10 bg-white dark:bg-[#1A1C1A]'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-xl bg-black/5 dark:bg-white/10 font-black text-sm flex items-center justify-center">
                              {size}
                            </div>
                            <div>
                              <span className="font-bold text-xs">{size} Standard Fit</span>
                              <p className="text-[11px] text-slate-500">
                                {activeColor.name} · {product.fabric}
                              </p>
                            </div>
                          </div>

                          {/* Stepper */}
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleUpdateSize(size, -1)}
                              disabled={count === 0}
                              className="w-8 h-8 rounded-full border border-black/20 dark:border-white/20 flex items-center justify-center hover:bg-black/10 disabled:opacity-30 transition"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <input
                              type="number"
                              min="0"
                              value={count}
                              onChange={e =>
                                setSizeCounts(prev => ({
                                  ...prev,
                                  [size]: Math.max(0, parseInt(e.target.value) || 0)
                                }))
                              }
                              className="w-14 text-center font-bold text-sm bg-transparent border-b border-black/20 dark:border-white/20 py-1 focus:outline-none focus:border-[#AC7900]"
                            />
                            <button
                              onClick={() => handleUpdateSize(size, 1)}
                              className="w-8 h-8 rounded-full bg-[#0F100F] dark:bg-white text-white dark:text-[#0F100F] flex items-center justify-center hover:opacity-90 transition shadow-sm"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                </div>
              )}

              {/* TAB 3: JERSEY TEAM ROSTER (SPORTS KITS) */}
              {activeStudioTab === 'jersey' && isJerseyMode && (
                <div className="space-y-5 animate-in fade-in duration-150">
                  <div className="p-4 bg-white dark:bg-[#1A1C1A] rounded-2xl border border-black/10 dark:border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Team & Tournament Specs
                      </h3>
                      <label className="flex items-center space-x-1.5 text-xs font-semibold cursor-pointer">
                        <input
                          type="checkbox"
                          checked={showJerseyTextOverlay}
                          onChange={e => setShowJerseyTextOverlay(e.target.checked)}
                          className="accent-[#AC7900] rounded"
                        />
                        <span>Show on Mockup</span>
                      </label>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-semibold text-slate-500">Sport Category</label>
                        <select
                          value={jerseySport}
                          onChange={e => setJerseySport(e.target.value)}
                          className="w-full mt-1 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-3 py-1.5 text-xs font-bold"
                        >
                          <option>Cricket</option>
                          <option>Football</option>
                          <option>Basketball</option>
                          <option>Volleyball</option>
                          <option>Kabaddi</option>
                          <option>Athletics</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[11px] font-semibold text-slate-500">Team Name</label>
                        <input
                          type="text"
                          value={jerseyTeamName}
                          onChange={e => setJerseyTeamName(e.target.value)}
                          className="w-full mt-1 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-3 py-1.5 text-xs font-bold"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Player List Table */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Player Roster (Names & Numbers)
                      </span>
                      <button
                        onClick={() =>
                          setJerseyPlayers(prev => [
                            ...prev,
                            { id: `${Date.now()}`, name: 'PLAYER', number: `${prev.length + 1}`, size: 'L' }
                          ])
                        }
                        className="text-xs font-bold text-[#AC7900] hover:underline flex items-center space-x-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Player</span>
                      </button>
                    </div>

                    <div className="space-y-2">
                      {jerseyPlayers.map((player, idx) => (
                        <div
                          key={player.id}
                          className="p-3 bg-white dark:bg-[#1A1C1A] rounded-2xl border border-black/10 dark:border-white/10 flex items-center gap-2 text-xs"
                        >
                          <span className="font-bold text-slate-400 w-5">#{idx + 1}</span>
                          <input
                            type="text"
                            value={player.name}
                            onChange={e => {
                              const val = e.target.value.toUpperCase();
                              setJerseyPlayers(prev =>
                                prev.map(p => (p.id === player.id ? { ...p, name: val } : p))
                              );
                            }}
                            placeholder="NAME"
                            className="flex-1 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-2.5 py-1 font-bold"
                          />
                          <input
                            type="text"
                            value={player.number}
                            onChange={e => {
                              const val = e.target.value;
                              setJerseyPlayers(prev =>
                                prev.map(p => (p.id === player.id ? { ...p, number: val } : p))
                              );
                            }}
                            placeholder="NO."
                            className="w-14 text-center bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-2 py-1 font-black"
                          />
                          <select
                            value={player.size}
                            onChange={e => {
                              const val = e.target.value;
                              setJerseyPlayers(prev =>
                                prev.map(p => (p.id === player.id ? { ...p, size: val } : p))
                              );
                            }}
                            className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-2 py-1 font-bold"
                          >
                            {product.sizes.map(s => (
                              <option key={s}>{s}</option>
                            ))}
                          </select>
                          <button
                            onClick={() => setJerseyPlayers(prev => prev.filter(p => p.id !== player.id))}
                            className="p-1 text-slate-400 hover:text-red-500 transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* BOTTOM SUMMARY & ADD TO CART BAR */}
            <div className="mt-8 pt-6 border-t border-black/10 dark:border-white/10">
              
              {/* Pricing breakdown summary */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-black font-editorial">₹{finalUnitPrice}</span>
                    <span className="text-xs text-slate-500 line-through">
                      ₹{unitRawPrice}
                    </span>
                    <span className="text-xs text-slate-500">/ piece</span>
                    {discountPercent > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                        {discountTierLabel}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {totalQuantity} pieces selected · {selectedColor.name} · {PRINT_PLACEMENT_CONFIG[printPlacement]?.name}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-xs text-slate-500 block">Total Estimated</span>
                  <span className="text-xl font-black font-editorial text-[#0F100F] dark:text-white">
                    ₹{subtotalPrice.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <button
                  onClick={() =>
                    setActiveStudioTab(prev => (prev === 'design' ? 'sizing' : 'design'))
                  }
                  className="px-4 py-3 rounded-full border border-black/15 dark:border-white/15 font-bold text-xs hover:bg-black/5 dark:hover:bg-white/5 transition text-center"
                >
                  {activeStudioTab === 'design' ? 'Next: Select Sizes →' : '← Back to Design'}
                </button>

                <button
                  onClick={() => setIsQuotationModalOpen(true)}
                  className="px-4 py-3 rounded-full bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs flex items-center justify-center space-x-1.5 transition shadow"
                  title="Generate Official GST Wholesale Quotation Sheet"
                >
                  <FileDown className="w-4 h-4" />
                  <span>Print Quotation</span>
                </button>

                <button
                  onClick={handleAddToCart}
                  disabled={totalQuantity === 0}
                  className="px-5 py-3 rounded-full bg-[#E11D48] hover:bg-[#BE123C] text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-lg hover:shadow-red-500/20 transition disabled:opacity-40"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add {totalQuantity} Pcs (₹{subtotalPrice.toLocaleString('en-IN')})</span>
                </button>
              </div>

              {/* MOQ Note */}
              <p className="text-[11px] text-center text-slate-500 mt-2">
                ⚡ Express Dispatch from Tirupur Textile Mill Hub · Free High-Def Artwork Check before Printing
              </p>

            </div>

          </div>

        </div>

      </div>

      {/* IMAGE CROPPER MODAL */}
      {isCropModalOpen && (uploadedImage || originalSourceImage) && (
        <ImageCropperModal
          isOpen={isCropModalOpen}
          onClose={() => setIsCropModalOpen(false)}
          imageUrl={originalSourceImage || uploadedImage || ''}
          onCropComplete={handleCropComplete}
        />
      )}

      {/* SIZE CHART MODAL POPUP */}
      {sizeChartOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#1A1C1A] text-black dark:text-white p-6 rounded-3xl max-w-lg w-full border border-black/10 dark:border-white/10 shadow-2xl">
            {(() => {
              const activeChart = (() => {
                if (product.id.includes('oversized')) return CATALOG_SIZE_CHARTS.oversized;
                if (product.id.includes('acid-wash')) return CATALOG_SIZE_CHARTS.optical_wash;
                if (product.id.includes('crop-top')) return CATALOG_SIZE_CHARTS.crop_top;
                if (product.id.includes('polo')) return CATALOG_SIZE_CHARTS.polo;
                if (product.id.includes('hoodie') || product.id.includes('sweatshirt')) return CATALOG_SIZE_CHARTS.hoodie_sweatshirt;
                if (product.id.includes('kids')) return CATALOG_SIZE_CHARTS.kids;
                return CATALOG_SIZE_CHARTS.round_neck;
              })();

              return (
                <div>
                  <div className="flex items-center justify-between pb-4 border-b border-black/10 dark:border-white/10">
                    <div>
                      <h3 className="font-bold text-base font-editorial">{activeChart.title}</h3>
                      <p className="text-xs text-slate-400">{activeChart.subtitle}</p>
                    </div>
                    <button onClick={() => setSizeChartOpen(false)}>
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="mt-4 overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-black/10 dark:border-white/10 text-slate-500">
                          <th className="py-2">Size</th>
                          <th className="py-2">Chest (Inches)</th>
                          <th className="py-2">Length (Inches)</th>
                          <th className="py-2">Sleeve (Inches)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-black/5 dark:divide-white/5 font-semibold">
                        {activeChart.entries.map(row => (
                          <tr key={row.size} className="hover:bg-black/5 dark:hover:bg-white/5">
                            <td className="py-2.5 font-bold">{row.size}</td>
                            <td className="py-2.5">{row.chestInches}"</td>
                            <td className="py-2.5">{row.lengthInches}"</td>
                            <td className="py-2.5">{row.sleeveInches}"</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="text-[10px] text-slate-400 italic mt-3">
                    * {activeChart.tolerance}
                  </p>
                </div>
              );
            })()}
            <button
              onClick={() => setSizeChartOpen(false)}
              className="w-full mt-4 py-2.5 bg-[#0F100F] dark:bg-white text-white dark:text-[#0F100F] rounded-full text-xs font-bold"
            >
              Got it, back to sizing
            </button>
          </div>
        </div>
      )}

      {/* Official Mill Quotation Modal */}
      <QuotationModal
        isOpen={isQuotationModalOpen}
        onClose={() => setIsQuotationModalOpen(false)}
        productName={product.name}
        fabricGsm={`${product.fabric} • ${selectedFabricVariant ? selectedFabricVariant.gsm : product.gsm} GSM`}
        colorName={selectedColor.name}
        methodName={printTechnique}
        placement={printPlacement}
        artworkUrl={uploadedImage}
        customText={customTypographyText}
        breakdown={quotationBreakdown}
        tierDiscountPercent={Math.round(discountPercent * 100)}
        tierName={discountTierLabel}
      />

    </div>
  );
};

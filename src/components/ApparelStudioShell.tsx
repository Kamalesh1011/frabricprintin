import React, { useRef, useState, useEffect } from 'react';
import {
  ArrowLeft,
  Undo2,
  Redo2,
  LayoutGrid,
  Share,
  Palette,
  Plus,
  Layers,
  Pencil,
  FlipHorizontal,
  Trash2,
  X,
  Minus,
  RotateCw,
  Move,
  Check,
  ShoppingCart,
  CreditCard,
  Upload,
  Link2,
  ChevronDown,
  RefreshCw,
  Pause,
  Play,
  Sparkles,
  Download,
  Printer,
  FileDown,
  Trophy,
  Users,
  Sun,
  Zap,
  Wand2,
  Sliders,
  Type,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { GarmentMockup, GarmentModelType } from './GarmentMockup';
import {
  ThreeDGarmentViewer,
  FabricPBRType,
  LightingPreset,
  StudioViewSide
} from './ThreeDGarmentViewer';
import { SAMPLE_GRAPHICS_LIBRARY, ApparelGarmentItem } from '../data/apparelCatalogData';
import { QuotationModal, QuotationBreakdownItem } from './QuotationModal';
import { useCart } from '../context/CartContext';

export type ShellSheet = 'none' | 'method' | 'color' | 'add' | 'pad' | 'edit' | 'product' | 'jersey' | 'pbr';

export const EMBROIDERY_THREADS = [
  { name: 'Metallic Gold', hex: '#D4AF37' },
  { name: 'Metallic Silver', hex: '#C0C0C0' },
  { name: 'Optical White', hex: '#FFFFFF' },
  { name: 'Pitch Black', hex: '#18181B' },
  { name: 'Crimson Red', hex: '#DC2626' },
  { name: 'Royal Navy', hex: '#1E3A8A' },
  { name: 'Emerald Green', hex: '#15803D' },
  { name: 'Sunset Orange', hex: '#EA580C' }
];

const TYPOGRAPHY_FONTS = [
  { id: 'Impact', label: 'Varsity Bold', family: "Impact, 'Arial Black', sans-serif" },
  { id: 'Cinzel', label: 'Street Gothic', family: "'Cinzel', Georgia, serif" },
  { id: 'Inter', label: 'Modern Sans', family: "'Inter', system-ui, sans-serif" },
  { id: 'Playfair', label: 'Luxury Serif', family: "'Playfair Display', serif" },
  { id: 'SpaceGrotesk', label: 'Tech Mono', family: "'Space Grotesk', monospace" },
  { id: 'Brush', label: 'Signature Script', family: "'Brush Script MT', cursive" },
];

const ALL_SIZES = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'] as const;

interface ApparelStudioShellProps {
  garment: ApparelGarmentItem;
  currentColor: { name: string; hex: string; code: string };
  activeColorIdx: number;
  setActiveColorIdx: (i: number) => void;
  activeSide: 'front' | 'back';
  setActiveSide: (s: 'front' | 'back') => void;
  activeGraphicUrl: string | null;
  uploadDesignFile: (f: File) => void;
  pickSampleGraphic: (url: string) => void;
  clearDesign: () => void;
  onOpenUrlImport: () => void;
  artworkPlacement: string;
  setArtworkPlacement: (p: string) => void;
  scalePercent: number;
  setScalePercent: (v: number | ((p: number) => number)) => void;
  rotation: number;
  setRotation: (v: number | ((r: number) => number)) => void;
  offsetX: number;
  offsetY: number;
  setOffsetX: (v: number) => void;
  setOffsetY: (v: number) => void;
  isFlippedH: boolean;
  setIsFlippedH: (v: boolean | ((p: boolean) => boolean)) => void;
  customText: string;
  setCustomText: (v: string) => void;
  customTextColor: string;
  setCustomTextColor: (v: string) => void;
  handleResetArtwork: () => void;
  canUndo: boolean;
  canRedo: boolean;
  handleUndo: () => void;
  handleRedo: () => void;
  onBack: () => void;
  isLive3D: boolean;
  setIsLive3D: (v: boolean) => void;
  autoRotate: boolean;
  setAutoRotate: (v: boolean) => void;
  // Customization Options: DTF & Embroidery
  customizationMethod?: 'dtf' | 'embroidery';
  setCustomizationMethod?: (m: 'dtf' | 'embroidery') => void;
  embroideryStyle?: 'flat' | 'puff3d' | 'patch';
  setEmbroideryStyle?: (s: 'flat' | 'puff3d' | 'patch') => void;
  embroideryThreadColor?: string;
  setEmbroideryThreadColor?: (c: string) => void;
  dtfFinish?: 'matte' | 'gloss';
  setDtfFinish?: (f: 'matte' | 'gloss') => void;
  // Commerce
  selectedSize: string;
  setSelectedSize: (s: string) => void;
  quantity: number;
  setQuantity: (q: number | ((p: number) => number)) => void;
  totalPrice: number;
  onAddToCart: () => void;
  onBuyNow: () => void;
}

const PLACEMENTS = [
  { id: 'chest_center', label: 'Chest', side: 'front' as const },
  { id: 'pocket_left', label: 'Pocket', side: 'front' as const },
  { id: 'a4_front', label: 'A4 Front', side: 'front' as const },
  { id: 'oversized_front', label: 'Jumbo', side: 'front' as const },
  { id: 'upper_back', label: 'Up. Back', side: 'back' as const },
  { id: 'full_back', label: 'Full Back', side: 'back' as const },
];

const TEXT_COLORS = ['#FFFFFF', '#111827', '#D4AF37', '#DC2626', '#2563EB', '#16A34A', '#F97316', '#06B6D4'];

export const ApparelStudioShell: React.FC<ApparelStudioShellProps> = (props) => {
  const {
    garment, currentColor, activeColorIdx, setActiveColorIdx,
    activeSide, setActiveSide, activeGraphicUrl, uploadDesignFile, pickSampleGraphic,
    clearDesign, onOpenUrlImport, artworkPlacement, setArtworkPlacement,
    scalePercent, setScalePercent, rotation, setRotation, offsetX, offsetY,
    setOffsetX, setOffsetY, isFlippedH, setIsFlippedH,
    customText, setCustomText, customTextColor, setCustomTextColor,
    handleResetArtwork, canUndo, canRedo, handleUndo, handleRedo, onBack,
    isLive3D, setIsLive3D, autoRotate, setAutoRotate,
    customizationMethod: propCustomizationMethod, setCustomizationMethod: propSetCustomizationMethod,
    embroideryStyle: propEmbroideryStyle, setEmbroideryStyle: propSetEmbroideryStyle,
    embroideryThreadColor: propEmbroideryThreadColor, setEmbroideryThreadColor: propSetEmbroideryThreadColor,
    dtfFinish: propDtfFinish, setDtfFinish: propSetDtfFinish,
    selectedSize, setSelectedSize, quantity, setQuantity, totalPrice,
    onAddToCart, onBuyNow,
  } = props;

  const { addToCart } = useCart();

  // Local state fallbacks if not supplied by parent
  const [localMethod, setLocalMethod] = useState<'dtf' | 'embroidery'>('dtf');
  const [localEmbStyle, setLocalEmbStyle] = useState<'flat' | 'puff3d' | 'patch'>('puff3d');
  const [localThreadCol, setLocalThreadCol] = useState<string>('#D4AF37');
  const [localDtfFinish, setLocalDtfFinish] = useState<'matte' | 'gloss'>('matte');

  const method = propCustomizationMethod ?? localMethod;
  const setMethod = propSetCustomizationMethod ?? setLocalMethod;
  const embStyle = propEmbroideryStyle ?? localEmbStyle;
  const setEmbStyle = propSetEmbroideryStyle ?? setLocalEmbStyle;
  const threadCol = propEmbroideryThreadColor ?? localThreadCol;
  const setThreadCol = propSetEmbroideryThreadColor ?? setLocalThreadCol;
  const finish = propDtfFinish ?? localDtfFinish;
  const setFinish = propSetDtfFinish ?? setLocalDtfFinish;

  const [sheet, setSheet] = useState<ShellSheet>('pad');
  const [showPrintPanel, setShowPrintPanel] = useState<boolean>(true);
  const [shareTick, setShareTick] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // 3D Configurator Advanced State (Module 2)
  const [viewSide, setViewSide] = useState<StudioViewSide>('front');
  const [fabricPbr, setFabricPbr] = useState<FabricPBRType>('cotton_jersey');
  const [lightingPreset, setLightingPreset] = useState<LightingPreset>('studio');

  // Typography Engine Advanced State (Module 1)
  const [customFont, setCustomFont] = useState<string>('Impact');
  const [textArc, setTextArc] = useState<number>(0);
  const [strokeWidth, setStrokeWidth] = useState<number>(0);
  const [strokeColor, setStrokeColor] = useState<string>('#000000');

  // Sports Jersey & Team Personalizer State (Module 3)
  const [isJerseyMode, setIsJerseyMode] = useState<boolean>(
    Boolean(garment.modelType.includes('jersey') || garment.name.toLowerCase().includes('jersey') || garment.name.toLowerCase().includes('sports'))
  );
  const [playerNumber, setPlayerNumber] = useState<string>('10');
  const [playerSquadName, setPlayerSquadName] = useState<string>('CAPTAIN');
  const [rosterBatch, setRosterBatch] = useState<Array<{ name: string; number: string; size: string }>>([
    { name: 'DHONI', number: '7', size: 'L' },
    { name: 'VIRAT', number: '18', size: 'M' },
    { name: 'ROHIT', number: '45', size: 'XL' }
  ]);
  const [rosterNameInput, setRosterNameInput] = useState('');
  const [rosterNumInput, setRosterNumInput] = useState('');
  const [rosterSizeInput, setRosterSizeInput] = useState('L');

  // Bulk Matrix State & Dynamic Pricing (Module 4)
  const [bulkMode, setBulkMode] = useState<'single' | 'matrix'>('single');
  const [bulkMatrix, setBulkMatrix] = useState<Record<string, number>>({
    XS: 0,
    S: 2,
    M: 6,
    L: 8,
    XL: 4,
    '2XL': 2,
    '3XL': 0
  });
  const [isQuotationModalOpen, setIsQuotationModalOpen] = useState(false);

  // Generative AI Design Assistant State (Module 5)
  const [aiPrompt, setAiPrompt] = useState<string>('');
  const [isGeneratingAi, setIsGeneratingAi] = useState<boolean>(false);

  const hasDesign = Boolean(activeGraphicUrl || customText);

  // Keep viewSide and activeSide in sync when clicking front/back
  useEffect(() => {
    if (activeSide === 'front' || activeSide === 'back') {
      setViewSide(activeSide);
    }
  }, [activeSide]);

  // Bulk Tier Calculation
  const totalBulkUnits = Object.values(bulkMatrix).reduce((sum, q) => sum + (q || 0), 0);
  const baseUnitPrice = (garment.price || 499) + (method === 'embroidery' ? 60 : 0);

  const getTierInfo = (qty: number) => {
    if (qty >= 200) return { discount: 35, name: 'Wholesale Partner Tier (35% OFF)' };
    if (qty >= 50) return { discount: 25, name: 'Bulk Mill Tier (25% OFF)' };
    if (qty >= 10) return { discount: 15, name: 'Team & Studio Tier (15% OFF)' };
    return { discount: 0, name: 'Retail Sampling' };
  };

  const activeTier = getTierInfo(bulkMode === 'matrix' ? totalBulkUnits : quantity);
  const discountedUnitPrice = Math.round(baseUnitPrice * (1 - activeTier.discount / 100));
  const bulkTotalPrice = discountedUnitPrice * totalBulkUnits;
  const bulkSavings = (baseUnitPrice * totalBulkUnits) - bulkTotalPrice;

  // ---------- Share ----------
  const handleShare = async () => {
    const text = `${garment.name} (${currentColor.name}) — customised on Fabric Print 3D Studio. ₹${bulkMode === 'matrix' ? bulkTotalPrice : totalPrice}`;
    try {
      const nav = navigator as Navigator & { share?: (d: { title: string; text: string; url: string }) => Promise<void> };
      if (nav.share) {
        await nav.share({ title: garment.name, text, url: window.location.href });
        return;
      }
      throw new Error('no-share');
    } catch {
      try {
        await navigator.clipboard.writeText(`${text} ${window.location.href}`);
        setShareTick('Link copied!');
      } catch {
        setShareTick('Share unavailable');
      }
      setTimeout(() => setShareTick(null), 1800);
    }
  };

  // ---------- High-DPI 300 DPI Export (Module 1) ----------
  const exportHighDpiPng = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 2400;
    canvas.height = 3000;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, 2400, 3000);

    const renderTextToExport = () => {
      if (customText && customText.trim()) {
        ctx.save();
        ctx.font = `bold 180px ${customFont || 'Impact, sans-serif'}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = threadCol || customTextColor || '#FFFFFF';
        ctx.shadowColor = 'rgba(0,0,0,0.5)';
        ctx.shadowBlur = 15;

        const textY = activeGraphicUrl ? 2600 : 1500;

        if (textArc && Math.abs(textArc) > 5) {
          const radius = Math.max(500, 1500 - Math.abs(textArc) * 10);
          const arcSign = textArc > 0 ? 1 : -1;
          const arcCenterY = textY + (arcSign > 0 ? radius : -radius);
          const chars = customText.split('');
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
            ctx.strokeText(customText, 1200, textY);
          }
          ctx.fillText(customText, 1200, textY);
        }
        ctx.restore();
      }

      canvas.toBlob((blob) => {
        if (!blob) return;
        const link = document.createElement('a');
        link.download = `${garment.name.toLowerCase().replace(/\s+/g, '-')}-print-ready-300dpi.png`;
        link.href = URL.createObjectURL(blob);
        link.click();
      }, 'image/png');
    };

    if (activeGraphicUrl) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const hRatio = customText ? 0.75 : 0.9;
        const maxW = 2400 * 0.9;
        const maxH = 3000 * hRatio;
        const scale = Math.min(maxW / img.width, maxH / img.height);
        const drawW = img.width * scale;
        const drawH = img.height * scale;
        const drawX = (2400 - drawW) / 2;
        const drawY = customText ? (2200 - drawH) / 2 + 100 : (3000 - drawH) / 2;

        ctx.drawImage(img, drawX, drawY, drawW, drawH);
        renderTextToExport();
      };
      img.onerror = () => {
        renderTextToExport();
      };
      img.src = activeGraphicUrl;
    } else {
      renderTextToExport();
    }
  };

  // ---------- Generative AI Artwork Generator (Module 5) ----------
  const handleGenerateAiDesign = async (promptToUse?: string) => {
    const textPrompt = (promptToUse || aiPrompt).trim();
    if (!textPrompt) return;
    setIsGeneratingAi(true);
    try {
      const res = await fetch('/api/generate-design', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: textPrompt, style: 'streetwear' })
      });
      const data: any = await res.json();
      if (data.imageUrl) {
        pickSampleGraphic(data.imageUrl);
        setSheet('pad');
      }
    } catch (err) {
      console.error('Failed to generate AI design:', err);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  // ---------- Batch Add Entire Matrix To Cart ----------
  const handleAddBatchToCart = () => {
    if (bulkMode === 'single') {
      onAddToCart();
      return;
    }
    // Add each size in the matrix with qty > 0
    Object.entries(bulkMatrix).forEach(([sz, qty]) => {
      if (qty > 0) {
        addToCart(
          {
            id: `${garment.id}-${sz}`,
            name: `${garment.name} (${sz})`,
            category: 'Cotton',
            price: discountedUnitPrice,
            image: activeGraphicUrl || '/mockups/white_tshirt_front.png',
            description: `${garment.fabric} • ${garment.gsm} • ${method.toUpperCase()} customized`
          } as any,
          'apparel',
          qty,
          {
            process: method === 'embroidery' ? 'direct_reactive' : 'dtf',
            finish: finish === 'gloss' ? 'gloss' : 'matte'
          } as any,
          1,
          `${sz} / ${currentColor.name}`,
          {
            selectedFabricVariant: `${sz} / ${currentColor.name}`,
            customText: customText || undefined,
            uploadedArtworkUrl: activeGraphicUrl || undefined,
          } as any
        );
      }
    });
    setShareTick('Batch Added to Cart!');
    setTimeout(() => setShareTick(null), 2000);
  };

  // ---------- Design-box drag (move) ----------
  const moveRef = useRef<{ sx: number; sy: number; ox: number; oy: number } | null>(null);
  const [moving, setMoving] = useState(false);
  const onBoxPointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('[data-handle]')) return;
    e.preventDefault();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    moveRef.current = { sx: e.clientX, sy: e.clientY, ox: offsetX, oy: offsetY };
    setMoving(true);
  };
  const onBoxPointerMove = (e: React.PointerEvent) => {
    const m = moveRef.current;
    if (!m) return;
    setOffsetX(Math.max(-120, Math.min(120, m.ox + (e.clientX - m.sx) * 0.6)));
    setOffsetY(Math.max(-120, Math.min(120, m.oy + (e.clientY - m.sy) * 0.6)));
  };
  const onBoxPointerUp = () => {
    moveRef.current = null;
    setMoving(false);
  };

  // ---------- Corner-handle scale drag ----------
  const scaleDragRef = useRef<{ dist: number; scale: number; cx: number; cy: number } | null>(null);
  const onScaleHandleDown = (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const box = panelRef.current?.querySelector('[data-designbox]')?.getBoundingClientRect();
    if (!box) return;
    const cx = box.left + box.width / 2;
    const cy = box.top + box.height / 2;
    const dist = Math.hypot(e.clientX - cx, e.clientY - cy) || 1;
    scaleDragRef.current = { dist, scale: scalePercent, cx, cy };
    const move = (ev: PointerEvent) => {
      const s = scaleDragRef.current;
      if (!s) return;
      const d = Math.hypot(ev.clientX - s.cx, ev.clientY - s.cy) || 1;
      const next = Math.round(Math.max(25, Math.min(260, (s.scale * d) / s.dist)));
      setScalePercent(next);
    };
    const up = () => {
      scaleDragRef.current = null;
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };

  // ---------- Rotate-stem drag ----------
  const onRotateHandleDown = (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const box = panelRef.current?.querySelector('[data-designbox]')?.getBoundingClientRect();
    if (!box) return;
    const cx = box.left + box.width / 2;
    const cy = box.top + box.height / 2;
    const startAng = Math.atan2(e.clientY - cy, e.clientX - cx);
    const startRot = rotation;
    const move = (ev: PointerEvent) => {
      const ang = Math.atan2(ev.clientY - cy, ev.clientX - cx);
      let deg = startRot + ((ang - startAng) * 180) / Math.PI;
      deg = ((deg + 180) % 360 + 360) % 360 - 180;
      setRotation(Math.round(deg));
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };

  const toggleSheet = (s: ShellSheet) =>
    setSheet(prev => (prev === s ? 'none' : s));

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) uploadDesignFile(f);
    e.target.value = '';
    setSheet('pad');
  };

  // Auto-open panel when a design lands
  useEffect(() => {
    if (activeGraphicUrl) setShowPrintPanel(true);
  }, [activeGraphicUrl]);

  const toolbarBtn = (active: boolean) =>
    `flex-1 flex flex-col items-center justify-center gap-0.5 py-2 rounded-xl text-[10px] font-bold transition touch-manipulation ${
      active ? 'bg-white text-black shadow' : 'text-white/70 active:bg-white/10'
    }`;

  // Quotation breakdown list
  const quotationBreakdown: QuotationBreakdownItem[] =
    bulkMode === 'matrix'
      ? Object.entries(bulkMatrix)
          .filter(([_, q]) => q > 0)
          .map(([sz, q]) => ({
            size: sz,
            quantity: q,
            unitPrice: baseUnitPrice
          }))
      : [
          {
            size: selectedSize,
            quantity: quantity,
            unitPrice: baseUnitPrice
          }
        ];

  return (
    <div className="bg-[#262624] text-white sm:rounded-[2rem] overflow-hidden sm:border sm:border-white/10 sm:shadow-2xl max-w-md mx-auto sm:my-4 flex flex-col min-h-[100dvh] sm:min-h-[840px] relative">
      {/* ===== Top viewport: live 3D garment ===== */}
      <div className="relative h-[48dvh] min-h-[340px] bg-[radial-gradient(120%_100%_at_50%_0%,#4a4a45_0%,#33332f_45%,#232322_100%)]">
        {/* Top bar */}
        <div className="absolute top-0 inset-x-0 z-20 flex items-center justify-between px-3 pt-3 pt-safe">
          <button
            onClick={onBack}
            aria-label="Back"
            className="w-9 h-9 rounded-full bg-black/60 backdrop-blur flex items-center justify-center active:scale-95 transition touch-manipulation"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setSheet('product')}
            className="max-w-[45%] truncate text-[11px] font-bold bg-black/50 backdrop-blur px-3 py-1.5 rounded-full flex items-center gap-1 active:scale-95 transition"
          >
            <span className="truncate">{garment.name}</span>
            <ChevronDown className="w-3 h-3 shrink-0 opacity-70" />
          </button>
          <div className="flex items-center gap-1 bg-black/60 backdrop-blur rounded-full px-1.5 py-1">
            <button
              onClick={handleUndo}
              disabled={!canUndo}
              aria-label="Undo"
              className="w-7 h-7 rounded-full flex items-center justify-center active:scale-90 transition disabled:opacity-30 touch-manipulation"
            >
              <Undo2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleRedo}
              disabled={!canRedo}
              aria-label="Redo"
              className="w-7 h-7 rounded-full flex items-center justify-center active:scale-90 transition disabled:opacity-30 touch-manipulation"
            >
              <Redo2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setShowPrintPanel(v => !v)}
              aria-label="Toggle print area"
              className={`w-7 h-7 rounded-full flex items-center justify-center active:scale-90 transition touch-manipulation ${showPrintPanel ? 'bg-white text-black' : ''}`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleShare}
              aria-label="Share"
              className="w-7 h-7 rounded-full flex items-center justify-center active:scale-90 transition touch-manipulation"
            >
              <Share className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {shareTick && (
          <div className="absolute top-14 left-1/2 -translate-x-1/2 z-20 bg-amber-500 text-black text-[11px] font-black px-3.5 py-1.5 rounded-full shadow-lg animate-in fade-in">
            {shareTick}
          </div>
        )}

        {/* Floating Technique & Mode Badges */}
        <div className="absolute top-13 left-3 z-20 flex items-center gap-1.5">
          <button
            onClick={() => toggleSheet('method')}
            className={`backdrop-blur-md text-[10px] font-black px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1.5 transition active:scale-95 ${
              method === 'embroidery'
                ? 'bg-black/85 border border-amber-500/70 text-amber-300'
                : 'bg-black/85 border border-white/20 text-white/90'
            }`}
          >
            {method === 'embroidery' ? (
              <>
                <span className="w-2.5 h-2.5 rounded-full border border-white/40 inline-block shrink-0 shadow-xs" style={{ backgroundColor: threadCol }} />
                <span>🧵 {embStyle === 'puff3d' ? '3D Puff' : embStyle === 'patch' ? 'Patch' : 'Satin'}</span>
              </>
            ) : (
              <span>🎨 DTF ({finish === 'gloss' ? 'Gloss' : 'Matte'})</span>
            )}
            <ChevronDown className="w-2.5 h-2.5 opacity-60" />
          </button>

          {/* Sports Jersey Badge */}
          <button
            onClick={() => toggleSheet('jersey')}
            className={`backdrop-blur-md text-[10px] font-black px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1 transition active:scale-95 ${
              isJerseyMode
                ? 'bg-amber-500/20 border border-amber-400 text-amber-300'
                : 'bg-black/60 border border-white/15 text-white/70'
            }`}
          >
            <Trophy className="w-3 h-3 text-amber-400" />
            <span>{isJerseyMode ? `Jersey #${playerNumber}` : 'Team Kit'}</span>
          </button>

          {/* PBR Material & Lighting Badge */}
          <button
            onClick={() => toggleSheet('pbr')}
            className="backdrop-blur-md text-[10px] font-black px-2 py-1 rounded-full bg-black/60 border border-white/15 text-white/70 flex items-center gap-1 active:scale-95 transition"
          >
            <Sun className="w-3 h-3 text-amber-300" />
            <span>PBR</span>
          </button>
        </div>

        {/* Live garment View */}
        <div className="absolute inset-0 pt-12 pb-10">
          {isLive3D ? (
            <ThreeDGarmentViewer
              designUrl={activeGraphicUrl}
              color={currentColor}
              rotation={rotation}
              scalePercent={scalePercent}
              artworkPlacement={artworkPlacement}
              isFlippedH={isFlippedH}
              side={viewSide}
              autoRotate={autoRotate}
              modelType={garment.modelType}
              offsetX={offsetX}
              offsetY={offsetY}
              customText={customText}
              customTextColor={method === 'embroidery' ? threadCol : customTextColor}
              customTextFont={customFont}
              textArc={textArc}
              strokeWidth={strokeWidth}
              strokeColor={strokeColor}
              isEmbroidery={method === 'embroidery'}
              embroideryThreadColor={threadCol}
              fabricPbr={fabricPbr}
              lightingPreset={lightingPreset}
            />
          ) : (
            <GarmentMockup
              type={garment.modelType as GarmentModelType}
              colorHex={currentColor.hex}
              side={activeSide}
              artworkUrl={activeGraphicUrl}
              artworkPlacement={artworkPlacement}
              scalePercent={scalePercent}
              rotation={rotation}
              offsetX={offsetX}
              offsetY={offsetY}
              isFlippedH={isFlippedH}
              customText={customText}
              customTextColor={method === 'embroidery' ? threadCol : customTextColor}
              printEffect={method}
              isEmbroidery={method === 'embroidery'}
              embroideryStyle={embStyle}
              embroideryThreadColor={threadCol}
              dtfFinish={finish}
              showBoundingBox={false}
              className="w-full h-full"
            />
          )}
        </div>

        {/* View presets: 3D/Flat • 4 Sides (Front / Back / L-Sleeve / R-Sleeve) • 360 Spin */}
        <div className="absolute bottom-2 inset-x-0 z-20 flex items-center justify-center gap-1.5 px-2 flex-wrap">
          <div className="flex items-center bg-black/70 backdrop-blur rounded-full p-0.5 text-[10px] font-bold border border-white/10">
            <button
              onClick={() => setIsLive3D(true)}
              className={`px-2 py-0.5 rounded-full transition ${isLive3D ? 'bg-white text-black' : 'text-white/70'}`}
            >
              3D
            </button>
            <button
              onClick={() => setIsLive3D(false)}
              className={`px-2 py-0.5 rounded-full transition ${!isLive3D ? 'bg-white text-black' : 'text-white/70'}`}
            >
              Flat
            </button>
          </div>

          <div className="flex items-center bg-black/70 backdrop-blur rounded-full p-0.5 text-[9px] font-bold border border-white/10">
            {(['front', 'back', 'left_sleeve', 'right_sleeve'] as const).map((s) => (
              <button
                key={s}
                onClick={() => {
                  setViewSide(s);
                  if (s === 'front' || s === 'back') setActiveSide(s);
                }}
                className={`px-2 py-0.5 rounded-full transition uppercase ${
                  viewSide === s ? 'bg-amber-400 text-black font-black' : 'text-white/70'
                }`}
              >
                {s === 'left_sleeve' ? 'L-Sleeve' : s === 'right_sleeve' ? 'R-Sleeve' : s}
              </button>
            ))}
          </div>

          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold transition border border-white/10 ${
              autoRotate ? 'bg-amber-500 text-black' : 'bg-black/70 text-white/80 backdrop-blur'
            }`}
          >
            {autoRotate ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            <span>360°</span>
          </button>
        </div>
      </div>

      {/* ===== Print-area panel (overlaps viewport) ===== */}
      {showPrintPanel && (
        <div ref={panelRef} className="relative z-10 -mt-8 mx-3 rounded-2xl border border-white/15 bg-black/90 shadow-2xl p-3">
          <button
            onClick={() => setShowPrintPanel(false)}
            aria-label="Hide print panel"
            className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center active:scale-90 transition text-white/70"
          >
            <X className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleResetArtwork}
            aria-label="Reset position"
            title="Reset position"
            className="absolute top-2 left-2 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center active:scale-90 transition text-white/70"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          {/* Dashed tee outline = printable area */}
          <svg viewBox="0 0 200 150" className="absolute inset-0 w-full h-full pointer-events-none opacity-60">
            <path
              d="M70 12 L88 18 L112 18 L130 12 L158 30 L148 52 L134 44 L134 138 L66 138 L66 44 L52 52 L42 30 Z"
              fill="none"
              stroke="rgba(255,255,255,0.45)"
              strokeWidth="1.2"
              strokeDasharray="5 4"
              strokeLinejoin="round"
            />
            <line x1="10" y1="120" x2="190" y2="120" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="4 4" />
          </svg>

          <div className="relative h-44 flex items-center justify-center overflow-hidden">
            {!hasDesign ? (
              <button
                onClick={() => setSheet('add')}
                className="border border-dashed border-white/30 rounded-xl px-5 py-4 text-center active:scale-95 transition"
              >
                <Upload className="w-5 h-5 mx-auto mb-1 opacity-70" />
                <span className="text-[11px] font-bold text-white/70">Tap Add to place your design or AI prompt</span>
              </button>
            ) : (
              <div className="relative">
                <div
                  data-designbox
                  onPointerDown={onBoxPointerDown}
                  onPointerMove={onBoxPointerMove}
                  onPointerUp={onBoxPointerUp}
                  className={`relative border border-dashed border-white/80 rounded-lg bg-white/[0.04] ${moving ? 'cursor-grabbing' : 'cursor-grab'} touch-none select-none`}
                  style={{
                    width: Math.max(90, Math.min(220, 130 * (scalePercent / 100))),
                    height: Math.max(90, Math.min(170, 120 * (scalePercent / 100))),
                    transform: `translate(${offsetX * 0.5}px, ${offsetY * 0.5}px) rotate(${rotation}deg) scaleX(${isFlippedH ? -1 : 1})`,
                  }}
                >
                  {activeGraphicUrl && (
                    <img src={activeGraphicUrl} alt="design" className="w-full h-full object-contain pointer-events-none" draggable={false} />
                  )}
                  {customText && (
                    <div
                      className="absolute inset-x-0 top-1 text-center font-black text-sm pointer-events-none truncate px-1"
                      style={{ color: method === 'embroidery' ? threadCol : customTextColor, fontFamily: customFont }}
                    >
                      {customText}
                    </div>
                  )}
                  {/* corner handles */}
                  {(['tl', 'tr', 'bl', 'br'] as const).map(c => (
                    <div
                      key={c}
                      data-handle
                      onPointerDown={onScaleHandleDown}
                      className={`absolute w-3.5 h-3.5 bg-white rounded-full shadow border border-black/40 touch-none ${
                        c === 'tl' ? '-top-1.5 -left-1.5 cursor-nwse-resize' :
                        c === 'tr' ? '-top-1.5 -right-1.5 cursor-nesw-resize' :
                        c === 'bl' ? '-bottom-1.5 -left-1.5 cursor-nesw-resize' :
                        '-bottom-1.5 -right-1.5 cursor-nwse-resize'
                      }`}
                    />
                  ))}
                  {/* rotate stem */}
                  <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 flex flex-col items-center" data-handle>
                    <div className="w-px h-3 bg-white/70" />
                    <div
                      onPointerDown={onRotateHandleDown}
                      className="w-5 h-5 bg-white rounded-full flex items-center justify-center shadow touch-none"
                    >
                      <RotateCw className="w-3 h-3 text-black" />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="mt-1 flex items-center justify-between text-[10px] font-bold text-white/50 px-1 pb-5">
            <span>{artworkPlacement.replace('_', ' ').toUpperCase()} • {scalePercent}% • {rotation}°</span>
            <span>{currentColor.name}</span>
          </div>
        </div>
      )}

      {/* ===== Action Buttons: High-DPI Export & Delete ===== */}
      <div className="px-3 mt-2 grid grid-cols-2 gap-2">
        <button
          onClick={exportHighDpiPng}
          disabled={!hasDesign}
          className="py-2.5 rounded-xl bg-white/10 hover:bg-white/15 disabled:opacity-30 text-white text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 transition"
        >
          <FileDown className="w-3.5 h-3.5 text-amber-400" />
          <span>300 DPI Export</span>
        </button>
        <button
          onClick={clearDesign}
          disabled={!hasDesign}
          className="py-2.5 rounded-xl bg-[#F4511E]/80 hover:bg-[#F4511E] disabled:opacity-30 text-white text-xs font-bold active:scale-[0.98] transition"
        >
          Clear Design
        </button>
      </div>

      {/* ===== Sheets ===== */}

      {/* 1. Method Sheet (DTF Printing vs 3D Embroidery) */}
      {sheet === 'method' && (
        <div className="mx-3 mt-2 rounded-2xl bg-black/90 border border-white/10 p-3.5 space-y-3 animate-in slide-in-from-bottom-2">
          <div className="flex items-center justify-between">
            <div className="text-[10px] font-bold text-white/50 uppercase tracking-wider">
              Customization Technique
            </div>
            <span className="text-[10px] font-bold text-amber-400">
              {method === 'embroidery' ? '🧵 Tajima Stitched (+₹60)' : '🎨 1200 DPI Heat Transfer'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setMethod('dtf')}
              className={`p-3 rounded-xl border text-left transition relative flex flex-col justify-between ${
                method === 'dtf'
                  ? 'border-amber-500 bg-amber-500/15 ring-1 ring-amber-500/40 text-white'
                  : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-black">🎨 DTF Printing</span>
                  {method === 'dtf' && <Check className="w-3.5 h-3.5 text-amber-400" />}
                </div>
                <p className="text-[9px] text-white/60 leading-tight">
                  Ultra-HD digital film transfer, full color gradients
                </p>
              </div>
              <div className="mt-2 text-[10px] font-extrabold text-emerald-400">
                Standard (₹0)
              </div>
            </button>

            <button
              onClick={() => setMethod('embroidery')}
              className={`p-3 rounded-xl border text-left transition relative flex flex-col justify-between ${
                method === 'embroidery'
                  ? 'border-amber-500 bg-amber-500/15 ring-1 ring-amber-500/40 text-white'
                  : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-black">🧵 Embroidery</span>
                  {method === 'embroidery' && <Check className="w-3.5 h-3.5 text-amber-400" />}
                </div>
                <p className="text-[9px] text-white/60 leading-tight">
                  Premium stitched thread, textured 3D raised feel
                </p>
              </div>
              <div className="mt-2 text-[10px] font-extrabold text-amber-400">
                Premium (+₹60)
              </div>
            </button>
          </div>

          {method === 'dtf' ? (
            <div className="pt-2 border-t border-white/10 space-y-2">
              <span className="text-[10px] font-bold text-white/50 uppercase tracking-wider block">
                DTF Finish Option
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setFinish('matte')}
                  className={`py-2 px-2.5 rounded-xl text-[11px] font-bold border transition ${
                    finish === 'matte'
                      ? 'bg-white text-black border-white'
                      : 'border-white/15 text-white/70 bg-white/5'
                  }`}
                >
                  Matte Finish (Standard)
                </button>
                <button
                  onClick={() => setFinish('gloss')}
                  className={`py-2 px-2.5 rounded-xl text-[11px] font-bold border transition ${
                    finish === 'gloss'
                      ? 'bg-white text-black border-white'
                      : 'border-white/15 text-white/70 bg-white/5'
                  }`}
                >
                  Gloss Luster (Vibrant)
                </button>
              </div>
            </div>
          ) : (
            <div className="pt-2 border-t border-white/10 space-y-2.5">
              <div>
                <span className="text-[10px] font-bold text-white/50 uppercase tracking-wider block mb-1">
                  Embroidery Stitch Style
                </span>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { id: 'flat' as const, label: 'Flat Satin', desc: 'Smooth text' },
                    { id: 'puff3d' as const, label: '3D Puff Raised', desc: 'Streetwear' },
                    { id: 'patch' as const, label: 'Crest Patch', desc: 'Badge border' }
                  ].map(st => (
                    <button
                      key={st.id}
                      onClick={() => setEmbStyle(st.id)}
                      className={`p-1.5 rounded-xl text-center border transition ${
                        embStyle === st.id
                          ? 'bg-white text-black border-white'
                          : 'border-white/15 text-white/70 bg-white/5'
                      }`}
                    >
                      <span className="block text-[10px] font-black">{st.label}</span>
                      <span className="text-[8px] opacity-70 block">{st.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-[10px] font-bold text-white/50 uppercase tracking-wider mb-1">
                  <span>Thread Color</span>
                  <span className="text-amber-400">
                    {EMBROIDERY_THREADS.find(t => t.hex === threadCol)?.name || 'Gold'}
                  </span>
                </div>
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {EMBROIDERY_THREADS.map(t => (
                    <button
                      key={t.hex}
                      onClick={() => {
                        setThreadCol(t.hex);
                        setCustomTextColor(t.hex);
                      }}
                      className={`w-7 h-7 rounded-full shrink-0 border-2 transition-transform flex items-center justify-center ${
                        threadCol === t.hex ? 'border-white scale-110 ring-2 ring-amber-500' : 'border-white/20'
                      }`}
                      style={{ backgroundColor: t.hex }}
                      title={t.name}
                    >
                      {threadCol === t.hex && (
                        <Check className={`w-3.5 h-3.5 ${t.hex === '#FFFFFF' ? 'text-black' : 'text-white'}`} />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. Color Sheet */}
      {sheet === 'color' && (
        <div className="mx-3 mt-2 rounded-2xl bg-black/80 border border-white/10 p-3 animate-in slide-in-from-bottom-2">
          <div className="text-[10px] font-bold text-white/50 uppercase tracking-wider mb-2">Color • {currentColor.name}</div>
          <div className="flex gap-2 overflow-x-auto scroll-touch pb-1">
            {garment.colors.map((c, i) => (
              <button
                key={c.code + i}
                onClick={() => setActiveColorIdx(i)}
                aria-label={c.name}
                title={c.name}
                className={`w-9 h-9 rounded-full shrink-0 border-2 transition ${activeColorIdx === i ? 'border-white scale-110 ring-2 ring-amber-500' : 'border-white/20'}`}
                style={{ backgroundColor: c.hex }}
              >
                {activeColorIdx === i && <Check className={`w-4 h-4 mx-auto ${c.hex === '#FFFFFF' ? 'text-black' : 'text-white'}`} />}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 3. Add Sheet (Upload, URL, Sample Library & Generative AI Assistant) */}
      {sheet === 'add' && (
        <div className="mx-3 mt-2 rounded-2xl bg-black/90 border border-white/10 p-3.5 space-y-3 animate-in slide-in-from-bottom-2">
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFileChange} />
          
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => fileRef.current?.click()}
              className="py-2.5 rounded-xl bg-white text-black text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 transition shadow"
            >
              <Upload className="w-4 h-4" /> Upload File
            </button>
            <button
              onClick={onOpenUrlImport}
              className="py-2.5 rounded-xl bg-white/10 text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 transition"
            >
              <Link2 className="w-4 h-4" /> From Web URL
            </button>
          </div>

          {/* ✨ Generative AI Design Assistant (Module 5) */}
          <div className="p-3 rounded-xl bg-gradient-to-r from-purple-950/60 via-indigo-950/60 to-black/80 border border-purple-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black text-purple-300 flex items-center gap-1">
                <Wand2 className="w-3.5 h-3.5 text-purple-400" />
                <span>Generative AI Design Studio</span>
              </span>
              <span className="text-[9px] font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full">
                AI Vector
              </span>
            </div>
            
            <div className="flex gap-1.5">
              <input
                value={aiPrompt}
                onChange={e => setAiPrompt(e.target.value)}
                placeholder="e.g. Cyberpunk neon wolf, Japanese wave art..."
                className="flex-1 px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-xs text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
              <button
                onClick={() => handleGenerateAiDesign()}
                disabled={isGeneratingAi || !aiPrompt.trim()}
                className="px-3 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 disabled:opacity-40 text-xs font-black text-white shrink-0 active:scale-95 transition"
              >
                {isGeneratingAi ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Generate'}
              </button>
            </div>

            {/* Quick Inspiration Chips */}
            <div className="flex gap-1 overflow-x-auto pb-1 text-[9px] font-bold text-purple-200">
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
                    handleGenerateAiDesign(chip.prompt);
                  }}
                  className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 shrink-0 transition"
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sample Vector Library */}
          <div>
            <div className="text-[10px] font-bold text-white/50 uppercase tracking-wider mb-1.5">
              Curated Graphic Library
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {SAMPLE_GRAPHICS_LIBRARY.map(sg => (
                <button
                  key={sg.id}
                  onClick={() => { pickSampleGraphic(sg.url); setSheet('pad'); }}
                  className={`rounded-lg overflow-hidden border-2 transition ${activeGraphicUrl === sg.url ? 'border-amber-500' : 'border-white/10'}`}
                >
                  <img src={sg.url} alt={sg.name} className="w-full aspect-square object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. Pad Sheet (Print Area Placement) */}
      {sheet === 'pad' && (
        <div className="mx-3 mt-2 rounded-2xl bg-black/80 border border-white/10 p-3 animate-in slide-in-from-bottom-2">
          <div className="text-[10px] font-bold text-white/50 uppercase tracking-wider mb-2">Print Area Placement</div>
          <div className="grid grid-cols-3 gap-1.5">
            {PLACEMENTS.map(p => (
              <button
                key={p.id}
                onClick={() => {
                  setArtworkPlacement(p.id);
                  setActiveSide(p.side);
                  setViewSide(p.side);
                  setOffsetX(0);
                  setOffsetY(0);
                }}
                className={`py-2 rounded-xl text-[11px] font-bold border transition ${artworkPlacement === p.id ? 'bg-white text-black border-white' : 'border-white/15 text-white/75'}`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 5. Edit Sheet (Advanced Typography, Curved Arc, Strokes & Scale) */}
      {sheet === 'edit' && (
        <div className="mx-3 mt-2 rounded-2xl bg-black/90 border border-white/10 p-3.5 space-y-3 animate-in slide-in-from-bottom-2">
          {/* Scale Slider */}
          <div>
            <div className="flex justify-between text-[10px] font-bold text-white/50 uppercase tracking-wider mb-1">
              <span>Artwork Scale</span><span>{scalePercent}%</span>
            </div>
            <input
              type="range" min={25} max={260} value={scalePercent}
              onChange={e => setScalePercent(Number(e.target.value))}
              className="w-full accent-amber-500"
            />
          </div>

          {/* Quick transform controls */}
          <div className="grid grid-cols-4 gap-1.5">
            <button onClick={() => setRotation(r => { const n = (typeof r === 'number' ? r : 0) - 15; return ((n + 180) % 360 + 360) % 360 - 180; })} className="py-2 rounded-xl bg-white/10 text-[11px] font-bold">⟲ -15°</button>
            <button onClick={() => setRotation(r => { const n = (typeof r === 'number' ? r : 0) + 15; return ((n + 180) % 360 + 360) % 360 - 180; })} className="py-2 rounded-xl bg-white/10 text-[11px] font-bold">⟳ +15°</button>
            <button onClick={() => setIsFlippedH((v: boolean) => !v)} className={`py-2 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 ${isFlippedH ? 'bg-white text-black' : 'bg-white/10'}`}>
              <FlipHorizontal className="w-3.5 h-3.5" /> Flip
            </button>
            <button onClick={handleResetArtwork} className="py-2 rounded-xl bg-white/10 text-[11px] font-bold flex items-center justify-center gap-1">
              <Move className="w-3.5 h-3.5" /> Center
            </button>
          </div>

          {/* Typography Engine (Module 1) */}
          <div className="pt-2 border-t border-white/10 space-y-2">
            <div className="text-[10px] font-bold text-white/50 uppercase tracking-wider">Typography & Text Tool</div>
            <div className="flex gap-1.5">
              <input
                value={customText}
                onChange={e => setCustomText(e.target.value)}
                placeholder="TYPE CUSTOM TEXT"
                className="flex-1 px-3 py-2 rounded-xl bg-white/10 text-xs font-bold placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <div className="flex items-center gap-1">
                {TEXT_COLORS.slice(0, 4).map(c => (
                  <button
                    key={c}
                    onClick={() => setCustomTextColor(c)}
                    className={`w-6 h-6 rounded-full border-2 ${customTextColor === c ? 'border-white scale-110' : 'border-white/20'}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            {/* Font Family Selector */}
            <div className="grid grid-cols-3 gap-1.5">
              {TYPOGRAPHY_FONTS.map(f => (
                <button
                  key={f.id}
                  onClick={() => setCustomFont(f.id)}
                  className={`py-1.5 px-1 rounded-lg text-[10px] font-bold border transition truncate ${
                    customFont === f.id ? 'bg-amber-400 text-black border-amber-400' : 'bg-white/5 border-white/10 text-white/70'
                  }`}
                  style={{ fontFamily: f.family }}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Curved Arc Radius Control */}
            <div>
              <div className="flex justify-between text-[10px] font-bold text-white/50 uppercase tracking-wider mb-1">
                <span>Curved Arc / Banner</span><span>{textArc > 0 ? `+${textArc}` : textArc}</span>
              </div>
              <input
                type="range" min={-80} max={80} value={textArc}
                onChange={e => setTextArc(Number(e.target.value))}
                className="w-full accent-amber-500"
              />
            </div>

            {/* Outline Stroke Width */}
            <div className="flex items-center justify-between text-[10px] font-bold text-white/60">
              <span>Text Outline Stroke:</span>
              <div className="flex gap-1">
                {[0, 1, 2, 4].map(sw => (
                  <button
                    key={sw}
                    onClick={() => setStrokeWidth(sw)}
                    className={`px-2 py-0.5 rounded-lg border text-[10px] ${
                      strokeWidth === sw ? 'bg-white text-black border-white' : 'border-white/15 bg-white/5'
                    }`}
                  >
                    {sw === 0 ? 'None' : `${sw}px`}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. Sports Jersey & Team Personalizer Sheet (Module 3) */}
      {sheet === 'jersey' && (
        <div className="mx-3 mt-2 rounded-2xl bg-black/90 border border-white/10 p-3.5 space-y-3 animate-in slide-in-from-bottom-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5" />
              <span>Sports Jersey Personalizer</span>
            </span>
            <button
              onClick={() => setIsJerseyMode(!isJerseyMode)}
              className={`text-[9px] font-black px-2 py-0.5 rounded-full border ${
                isJerseyMode ? 'bg-amber-400 text-black border-amber-400' : 'bg-white/10 text-white/60 border-white/15'
              }`}
            >
              {isJerseyMode ? 'Enabled' : 'Disabled'}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-[10px] font-bold text-white/50 uppercase block mb-1">Squad Number (0–99)</span>
              <input
                type="number"
                min={0}
                max={99}
                value={playerNumber}
                onChange={e => {
                  const num = e.target.value.slice(0, 2);
                  setPlayerNumber(num);
                  setCustomText(`${playerSquadName} ${num}`);
                }}
                className="w-full px-3 py-2 rounded-xl bg-white/10 text-center font-black text-lg text-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <span className="text-[10px] font-bold text-white/50 uppercase block mb-1">Player Name</span>
              <input
                value={playerSquadName}
                onChange={e => {
                  const nm = e.target.value.toUpperCase();
                  setPlayerSquadName(nm);
                  setCustomText(`${nm} ${playerNumber}`);
                }}
                className="w-full px-3 py-2 rounded-xl bg-white/10 font-black text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Quick Roster Batch Table */}
          <div className="pt-2 border-t border-white/10">
            <div className="flex items-center justify-between text-[10px] font-bold text-white/60 mb-1.5">
              <span className="flex items-center gap-1"><Users className="w-3 h-3 text-amber-400" /> Team Roster Batch</span>
              <span className="text-amber-400">{rosterBatch.length} Players</span>
            </div>

            <div className="space-y-1 max-h-28 overflow-y-auto pr-1">
              {rosterBatch.map((p, idx) => (
                <div key={idx} className="flex items-center justify-between bg-white/5 px-2.5 py-1.5 rounded-lg text-xs font-bold border border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="text-amber-400 font-mono">#{p.number}</span>
                    <span>{p.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-white/50 text-[10px]">{p.size}</span>
                    <button
                      onClick={() => setRosterBatch(rosterBatch.filter((_, i) => i !== idx))}
                      className="text-white/40 hover:text-red-400"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Add Player form */}
            <div className="flex gap-1.5 mt-2">
              <input
                value={rosterNameInput}
                onChange={e => setRosterNameInput(e.target.value)}
                placeholder="NAME"
                className="flex-1 px-2.5 py-1.5 rounded-lg bg-white/10 text-xs font-bold uppercase placeholder:text-white/30"
              />
              <input
                value={rosterNumInput}
                onChange={e => setRosterNumInput(e.target.value.slice(0, 2))}
                placeholder="#"
                className="w-12 px-2 py-1.5 rounded-lg bg-white/10 text-xs font-black text-center text-amber-400"
              />
              <select
                value={rosterSizeInput}
                onChange={e => setRosterSizeInput(e.target.value)}
                className="bg-white/10 text-xs font-bold rounded-lg px-2 text-white"
              >
                {ALL_SIZES.map(s => <option key={s} value={s} className="bg-black text-white">{s}</option>)}
              </select>
              <button
                onClick={() => {
                  if (rosterNameInput.trim()) {
                    setRosterBatch([...rosterBatch, { name: rosterNameInput.trim().toUpperCase(), number: rosterNumInput || '0', size: rosterSizeInput }]);
                    setRosterNameInput('');
                    setRosterNumInput('');
                  }
                }}
                className="px-2.5 py-1.5 rounded-lg bg-amber-500 font-black text-black text-xs"
              >
                +
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. PBR Material & Lighting Studio Sheet (Module 2) */}
      {sheet === 'pbr' && (
        <div className="mx-3 mt-2 rounded-2xl bg-black/90 border border-white/10 p-3.5 space-y-3 animate-in slide-in-from-bottom-2">
          <div>
            <div className="text-[10px] font-bold text-white/50 uppercase tracking-wider mb-1.5">
              Fabric Weave & PBR Material Texture
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { id: 'cotton_jersey' as const, label: 'Single Jersey Cotton', desc: '220 GSM • Soft Matte' },
                { id: 'french_terry' as const, label: 'French Terry', desc: '320 GSM • Loop Texture' },
                { id: 'interlock_poly' as const, label: 'Interlock Polyester', desc: 'Micro-perforated Sheen' },
                { id: 'linen_silk' as const, label: 'Linen & Silk Blend', desc: 'Lustrous Slub Weave' }
              ].map(m => (
                <button
                  key={m.id}
                  onClick={() => setFabricPbr(m.id)}
                  className={`p-2 rounded-xl text-left border transition ${
                    fabricPbr === m.id ? 'bg-amber-500/20 border-amber-400 text-white' : 'bg-white/5 border-white/10 text-white/70'
                  }`}
                >
                  <span className="block text-xs font-black">{m.label}</span>
                  <span className="block text-[9px] opacity-70 mt-0.5">{m.desc}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="text-[10px] font-bold text-white/50 uppercase tracking-wider mb-1.5">
              Studio Lighting Atmosphere
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: 'studio' as const, label: 'Spotlight', desc: 'Crisp Mill' },
                { id: 'daylight' as const, label: 'Daylight', desc: 'Natural Sun' },
                { id: 'neon' as const, label: 'Neon Tokyo', desc: 'Cyberpunk' }
              ].map(l => (
                <button
                  key={l.id}
                  onClick={() => setLightingPreset(l.id)}
                  className={`p-2 rounded-xl text-center border transition ${
                    lightingPreset === l.id ? 'bg-white text-black border-white' : 'bg-white/5 border-white/10 text-white/70'
                  }`}
                >
                  <span className="block text-xs font-black">{l.label}</span>
                  <span className="block text-[9px] opacity-70 mt-0.5">{l.desc}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 8. Product & Bulk Order Matrix Sheet (Module 4) */}
      {sheet === 'product' && (
        <div className="mx-3 mt-2 rounded-2xl bg-black/95 border border-white/10 p-3.5 space-y-3 animate-in slide-in-from-bottom-2">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="text-sm font-black">{garment.name}</div>
              <div className="text-[11px] text-white/50">{garment.fabric} • {garment.gsm} • {currentColor.name}</div>
            </div>
            <button onClick={() => setSheet('pad')} className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mode Switcher: Single Piece vs Bulk Matrix */}
          <div className="flex bg-white/10 p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => setBulkMode('single')}
              className={`flex-1 py-1.5 rounded-lg transition text-center ${bulkMode === 'single' ? 'bg-white text-black shadow' : 'text-white/70'}`}
            >
              Single Size
            </button>
            <button
              onClick={() => setBulkMode('matrix')}
              className={`flex-1 py-1.5 rounded-lg transition text-center flex items-center justify-center gap-1 ${bulkMode === 'matrix' ? 'bg-amber-400 text-black shadow font-black' : 'text-white/70'}`}
            >
              <span>Bulk Matrix (XS–3XL)</span>
              <span className="text-[9px] bg-black/30 px-1.5 py-0.5 rounded-full">Save 35%</span>
            </button>
          </div>

          {bulkMode === 'single' ? (
            /* Single Size selector */
            <div className="space-y-3">
              <div>
                <div className="text-[10px] font-bold text-white/50 uppercase tracking-wider mb-1">Select Size</div>
                <div className="flex flex-wrap gap-1.5">
                  {garment.sizes.map(s => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`px-3 py-1.5 rounded-lg text-[11px] font-bold border ${selectedSize === s ? 'bg-white text-black border-white' : 'border-white/15 text-white/75'}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button onClick={() => setQuantity(q => Math.max(1, (typeof q === 'number' ? q : 1) - 1))} className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-black w-6 text-center">{quantity}</span>
                  <button onClick={() => setQuantity(q => (typeof q === 'number' ? q : 1) + 1)} className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-xl font-black">₹{totalPrice}</div>
              </div>
            </div>
          ) : (
            /* Bulk Order Matrix Grid (Module 4) */
            <div className="space-y-2.5">
              <div className="text-[10px] font-bold text-white/50 uppercase tracking-wider flex justify-between items-center">
                <span>Quantity per Size Matrix</span>
                <span className="text-amber-400 font-extrabold">{totalBulkUnits} Garments Total</span>
              </div>

              <div className="grid grid-cols-4 gap-1.5">
                {ALL_SIZES.map(sz => (
                  <div key={sz} className="p-1.5 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center">
                    <span className="text-[10px] font-black text-white/70 mb-1">{sz}</span>
                    <div className="flex items-center gap-1 w-full justify-between">
                      <button
                        onClick={() => setBulkMatrix({ ...bulkMatrix, [sz]: Math.max(0, (bulkMatrix[sz] || 0) - 1) })}
                        className="w-5 h-5 rounded bg-white/10 flex items-center justify-center text-xs"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min={0}
                        value={bulkMatrix[sz] || 0}
                        onChange={e => setBulkMatrix({ ...bulkMatrix, [sz]: Math.max(0, parseInt(e.target.value) || 0) })}
                        className="w-7 text-center font-black text-xs bg-transparent text-amber-400 focus:outline-none"
                      />
                      <button
                        onClick={() => setBulkMatrix({ ...bulkMatrix, [sz]: (bulkMatrix[sz] || 0) + 1 })}
                        className="w-5 h-5 rounded bg-white/10 flex items-center justify-center text-xs"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Tier Discount Banner */}
              <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/40 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-amber-300 flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5" />
                    <span>{activeTier.name}</span>
                  </span>
                  <span className="font-black text-white">₹{discountedUnitPrice}/unit</span>
                </div>
                {bulkSavings > 0 && (
                  <p className="text-[10px] text-emerald-400 font-bold">
                    ⚡ You save ₹{bulkSavings} on this volume tier!
                  </p>
                )}
              </div>

              {/* Total Summary */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-white/70">Batch Estimated Total:</span>
                <span className="text-2xl font-black text-white">₹{bulkTotalPrice}</span>
              </div>
            </div>
          )}

          {/* Action Buttons: Add Batch, Quotation & Buy */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={handleAddBatchToCart}
              className="py-3 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-black flex items-center justify-center gap-1.5 transition"
            >
              <ShoppingCart className="w-4 h-4 text-amber-400" />
              <span>{bulkMode === 'matrix' ? 'Add Entire Batch' : 'Add to Cart'}</span>
            </button>
            <button
              onClick={() => setIsQuotationModalOpen(true)}
              className="py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-black flex items-center justify-center gap-1.5 transition shadow"
            >
              <FileDown className="w-4 h-4" />
              <span>Print Quotation</span>
            </button>
          </div>
        </div>
      )}

      <div className="flex-1" />

      {/* ===== Bottom toolbar: Method • Color • Add • Pad • Edit ===== */}
      <div className="sticky bottom-0 px-3 pb-3 pb-safe pt-1 bg-gradient-to-t from-[#262624] via-[#262624] to-transparent">
        <div className="flex items-stretch gap-1 bg-black/90 border border-white/10 rounded-2xl p-1.5 shadow-2xl">
          <button onClick={() => toggleSheet('method')} className={toolbarBtn(sheet === 'method')}>
            <Sparkles className="w-4 h-4 text-amber-400" /><span>Method</span>
          </button>
          <button onClick={() => toggleSheet('color')} className={toolbarBtn(sheet === 'color')}>
            <Palette className="w-4 h-4" /><span>Color</span>
          </button>
          <button onClick={() => toggleSheet('add')} className={toolbarBtn(sheet === 'add')}>
            <Plus className="w-4 h-4" /><span>Add</span>
          </button>
          <button onClick={() => toggleSheet('pad')} className={toolbarBtn(sheet === 'pad')}>
            <Layers className="w-4 h-4" /><span>Pad</span>
          </button>
          <button onClick={() => toggleSheet('edit')} className={toolbarBtn(sheet === 'edit')}>
            <Pencil className="w-4 h-4" /><span>Edit</span>
          </button>
        </div>
      </div>

      {/* Official Mill Quotation Modal */}
      <QuotationModal
        isOpen={isQuotationModalOpen}
        onClose={() => setIsQuotationModalOpen(false)}
        productName={garment.name}
        fabricGsm={`${garment.fabric} • ${garment.gsm}`}
        colorName={currentColor.name}
        methodName={method === 'embroidery' ? `3D Puff Embroidery (${threadCol})` : `1200 DPI DTF Print (${finish})`}
        placement={artworkPlacement}
        artworkUrl={activeGraphicUrl}
        customText={customText}
        breakdown={quotationBreakdown}
        tierDiscountPercent={activeTier.discount}
        tierName={activeTier.name}
      />
    </div>
  );
};

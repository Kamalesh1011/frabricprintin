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
} from 'lucide-react';
import { GarmentMockup, GarmentModelType } from './GarmentMockup';
import { ThreeDGarmentViewer } from './ThreeDGarmentViewer';
import { SAMPLE_GRAPHICS_LIBRARY, ApparelGarmentItem } from '../data/apparelCatalogData';

export type ShellSheet = 'none' | 'color' | 'add' | 'pad' | 'edit' | 'product';

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

const TEXT_COLORS = ['#FFFFFF', '#111827', '#D4AF37', '#DC2626', '#2563EB', '#16A34A'];

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
    selectedSize, setSelectedSize, quantity, setQuantity, totalPrice,
    onAddToCart, onBuyNow,
  } = props;

  const [sheet, setSheet] = useState<ShellSheet>('pad');
  const [showPrintPanel, setShowPrintPanel] = useState<boolean>(true);
  const [shareTick, setShareTick] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const hasDesign = Boolean(activeGraphicUrl || customText);

  // ---------- Share ----------
  const handleShare = async () => {
    const text = `${garment.name} (${currentColor.name}) — customised on Fabric Print 3D Studio. ₹${totalPrice}`;
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

  const toggleSheet = (s: Exclude<ShellSheet, 'none' | 'product'>) =>
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

  return (
    <div className="bg-[#262624] text-white sm:rounded-[2rem] overflow-hidden sm:border sm:border-white/10 sm:shadow-2xl max-w-md mx-auto sm:my-4 flex flex-col min-h-[100dvh] sm:min-h-[820px] relative">
      {/* ===== Top viewport: live 3D garment ===== */}
      <div className="relative h-[46dvh] min-h-[330px] bg-[radial-gradient(120%_100%_at_50%_0%,#4a4a45_0%,#33332f_45%,#232322_100%)]">
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
          <div className="absolute top-14 left-1/2 -translate-x-1/2 z-20 bg-black/80 text-[11px] font-bold px-3 py-1.5 rounded-full">
            {shareTick}
          </div>
        )}

        {/* Live garment */}
        <div className="absolute inset-0 pt-12 pb-10">
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
              modelType={garment.modelType}
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
              customTextColor={customTextColor}
              showBoundingBox={false}
              className="w-full h-full"
            />
          )}
        </div>

        {/* View chips: 3D/Flat • Front/Back • 360 */}
        <div className="absolute bottom-2 inset-x-0 z-20 flex items-center justify-center gap-1.5 px-3">
          <div className="flex items-center bg-black/60 backdrop-blur rounded-full p-0.5 text-[10px] font-bold">
            <button
              onClick={() => setIsLive3D(true)}
              className={`px-2.5 py-1 rounded-full transition ${isLive3D ? 'bg-white text-black' : 'text-white/70'}`}
            >
              3D
            </button>
            <button
              onClick={() => setIsLive3D(false)}
              className={`px-2.5 py-1 rounded-full transition ${!isLive3D ? 'bg-white text-black' : 'text-white/70'}`}
            >
              Flat
            </button>
          </div>
          <div className="flex items-center bg-black/60 backdrop-blur rounded-full p-0.5 text-[10px] font-bold">
            <button
              onClick={() => setActiveSide('front')}
              className={`px-2.5 py-1 rounded-full transition ${activeSide === 'front' ? 'bg-white text-black' : 'text-white/70'}`}
            >
              Front
            </button>
            <button
              onClick={() => setActiveSide('back')}
              className={`px-2.5 py-1 rounded-full transition ${activeSide === 'back' ? 'bg-white text-black' : 'text-white/70'}`}
            >
              Back
            </button>
          </div>
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[10px] font-bold transition ${autoRotate ? 'bg-amber-500 text-black' : 'bg-black/60 text-white/80 backdrop-blur'}`}
          >
            {autoRotate ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            360°
          </button>
        </div>
      </div>

      {/* ===== Print-area panel (overlaps viewport) ===== */}
      {showPrintPanel && (
        <div ref={panelRef} className="relative z-10 -mt-8 mx-3 rounded-2xl border border-white/15 bg-black/90 shadow-2xl p-3">
          <button
            onClick={() => setShowPrintPanel(false)}
            aria-label="Hide print area"
            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/10 flex items-center justify-center active:scale-90 transition z-20"
          >
            <X className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setIsFlippedH((v: boolean) => !v)}
            aria-label="Mirror design"
            className={`absolute top-2 right-11 w-7 h-7 rounded-full flex items-center justify-center active:scale-90 transition z-20 ${isFlippedH ? 'bg-white text-black' : 'bg-white/10'}`}
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
                <span className="text-[11px] font-bold text-white/70">Tap Add to place your design</span>
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
                    <div className="absolute inset-x-0 top-1 text-center font-black text-sm pointer-events-none" style={{ color: customTextColor }}>
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

      {/* ===== Delete ===== */}
      <div className="px-3 mt-2">
        <button
          onClick={clearDesign}
          disabled={!hasDesign}
          className="w-full py-3 rounded-xl bg-[#F4511E] disabled:opacity-30 text-white text-sm font-bold active:scale-[0.98] transition touch-manipulation"
        >
          Delete
        </button>
      </div>

      {/* ===== Sheets ===== */}
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

      {sheet === 'add' && (
        <div className="mx-3 mt-2 rounded-2xl bg-black/80 border border-white/10 p-3 animate-in slide-in-from-bottom-2">
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFileChange} />
          <div className="grid grid-cols-2 gap-2 mb-2">
            <button
              onClick={() => fileRef.current?.click()}
              className="py-2.5 rounded-xl bg-white text-black text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 transition"
            >
              <Upload className="w-4 h-4" /> Upload
            </button>
            <button
              onClick={onOpenUrlImport}
              className="py-2.5 rounded-xl bg-white/10 text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 transition"
            >
              <Link2 className="w-4 h-4" /> From URL
            </button>
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
      )}

      {sheet === 'pad' && (
        <div className="mx-3 mt-2 rounded-2xl bg-black/80 border border-white/10 p-3 animate-in slide-in-from-bottom-2">
          <div className="text-[10px] font-bold text-white/50 uppercase tracking-wider mb-2">Print area</div>
          <div className="grid grid-cols-3 gap-1.5">
            {PLACEMENTS.map(p => (
              <button
                key={p.id}
                onClick={() => { setArtworkPlacement(p.id); setActiveSide(p.side); setOffsetX(0); setOffsetY(0); }}
                className={`py-2 rounded-xl text-[11px] font-bold border transition ${artworkPlacement === p.id ? 'bg-white text-black border-white' : 'border-white/15 text-white/75'}`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {sheet === 'edit' && (
        <div className="mx-3 mt-2 rounded-2xl bg-black/80 border border-white/10 p-3 space-y-2.5 animate-in slide-in-from-bottom-2">
          <div>
            <div className="flex justify-between text-[10px] font-bold text-white/50 uppercase tracking-wider mb-1">
              <span>Size</span><span>{scalePercent}%</span>
            </div>
            <input
              type="range" min={25} max={260} value={scalePercent}
              onChange={e => setScalePercent(Number(e.target.value))}
              className="w-full accent-amber-500"
            />
          </div>
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
          <div>
            <div className="text-[10px] font-bold text-white/50 uppercase tracking-wider mb-1">Custom text</div>
            <div className="flex gap-1.5">
              <input
                value={customText}
                onChange={e => setCustomText(e.target.value)}
                placeholder="YOUR TEXT"
                className="flex-1 px-3 py-2 rounded-xl bg-white/10 text-xs font-bold placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <div className="flex items-center gap-1">
                {TEXT_COLORS.map(c => (
                  <button
                    key={c}
                    onClick={() => setCustomTextColor(c)}
                    className={`w-6 h-6 rounded-full border-2 ${customTextColor === c ? 'border-white scale-110' : 'border-white/20'}`}
                    style={{ backgroundColor: c }}
                    aria-label={c}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {sheet === 'product' && (
        <div className="mx-3 mt-2 rounded-2xl bg-black/90 border border-white/10 p-3 space-y-2.5 animate-in slide-in-from-bottom-2">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="text-sm font-black">{garment.name}</div>
              <div className="text-[11px] text-white/50">{garment.fabric} • {garment.gsm}</div>
            </div>
            <button onClick={() => setSheet('pad')} className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <div>
            <div className="text-[10px] font-bold text-white/50 uppercase tracking-wider mb-1">Size</div>
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
          <div className="grid grid-cols-2 gap-2">
            <button onClick={onAddToCart} className="py-3 rounded-xl bg-white/10 text-xs font-black flex items-center justify-center gap-1.5">
              <ShoppingCart className="w-4 h-4" /> Add to Cart
            </button>
            <button onClick={onBuyNow} className="py-3 rounded-xl bg-white text-black text-xs font-black flex items-center justify-center gap-1.5">
              <CreditCard className="w-4 h-4" /> Buy Now
            </button>
          </div>
        </div>
      )}

      <div className="flex-1" />

      {/* ===== Bottom toolbar: Color • Add • Pad • Edit • Flip ===== */}
      <div className="sticky bottom-0 px-3 pb-3 pb-safe pt-1 bg-gradient-to-t from-[#262624] via-[#262624] to-transparent">
        <div className="flex items-stretch gap-1 bg-black/90 border border-white/10 rounded-2xl p-1.5 shadow-2xl">
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
          <button onClick={() => setIsFlippedH((v: boolean) => !v)} className={toolbarBtn(isFlippedH)}>
            <FlipHorizontal className="w-4 h-4" /><span>Flip</span>
          </button>
        </div>
      </div>
    </div>
  );
};

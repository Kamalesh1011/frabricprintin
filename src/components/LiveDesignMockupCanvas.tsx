import React, { useState, useRef, useEffect } from 'react';
import {
  Printer,
  Sparkles,
  CheckCircle2,
  Ruler,
  Scissors,
  Move,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Grid,
  Layers,
  Package,
  Eye,
  Camera,
  Sun,
  Sunset,
  Lightbulb,
  Maximize2,
  Download,
  Upload,
  RefreshCw,
  Play,
  Pause,
  Sliders,
  Image as ImageIcon
} from 'lucide-react';
import { Product } from '../types';
import {
  Fabric3DClothStudio,
  FabricStudio3DMode,
  FabricMaterialType,
  LightingAtmosphere,
  CameraPreset
} from './Fabric3DStudioCanvas';

export type MainStudioViewMode = 'draped_cloth' | 'mill_swatch';
export type MockupSurfaceType = 'swatch_ruler' | 'plain_base' | 'repeat_grid' | 'draped_cloth' | 'mill_swatch';

interface LiveDesignMockupCanvasProps {
  product: Product;
  uploadedDesignUrl: string;
  repeatType: 'grid' | 'drop' | 'straight' | 'centered';
  scalePercentage: number;
  calculatedDpi: number;
  showRulerOverlay: boolean;
  setShowRulerOverlay: (show: boolean) => void;
  buyingOption: 'printed' | 'plain';
  activeSurface?: string;
  setActiveSurface?: (surface: any) => void;
  onSelectSampleDesign?: (url: string, name: string) => void;
}

// Curated realistic sample textile patterns
export const SAMPLE_FABRIC_PRINTS = [
  {
    id: 'sp-floral',
    name: 'Jaipur Botanical Floral',
    category: 'Floral',
    url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80',
    color: '#D9534F'
  },
  {
    id: 'sp-tropical',
    name: 'Monstera Jungle Palm',
    category: 'Botanical',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    color: '#2E7D32'
  },
  {
    id: 'sp-geo',
    name: 'Bauhaus Modern Geometric',
    category: 'Geometric',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    color: '#1565C0'
  },
  {
    id: 'sp-indigo',
    name: 'Indigo Shibori Tie-Dye',
    category: 'Traditional',
    url: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=800&q=80',
    color: '#1A237E'
  },
  {
    id: 'sp-abstract',
    name: 'Pastel Watercolor Swirl',
    category: 'Abstract',
    url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=800&q=80',
    color: '#E91E63'
  },
  {
    id: 'sp-minimal',
    name: 'Minimalist Line Art',
    category: 'Modern',
    url: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=800&q=80',
    color: '#212121'
  }
];

export const LiveDesignMockupCanvas: React.FC<LiveDesignMockupCanvasProps> = ({
  product,
  uploadedDesignUrl,
  repeatType: initialRepeatType,
  scalePercentage: initialScale,
  calculatedDpi,
  buyingOption,
  onSelectSampleDesign
}) => {
  // Studio View Modes: Mode 1 (Flat Roll), Mode 2 (Draped 3D Cloth), Mode 3 (2D Mill Swatch)
  const [viewMode, setViewMode] = useState<MainStudioViewMode>('draped_cloth');

  // Interactive Pattern Controls State
  const [scale, setScale] = useState<number>(100);
  const [repeatMode, setRepeatMode] = useState<'grid' | 'drop' | 'brick' | 'mirror' | 'centered'>('grid');
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [offsetX, setOffsetX] = useState<number>(0);
  const [offsetY, setOffsetY] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [activeSample, setActiveSample] = useState<string | null>(null);

  // 3D Studio Physics & Environment State
  const [materialType, setMaterialType] = useState<FabricMaterialType>('cotton_cambric');
  const [baseColor, setBaseColor] = useState<string>(product.colorCode || '#FAF8F5');
  const [lightingAtmosphere, setLightingAtmosphere] = useState<LightingAtmosphere>('studio_softbox');
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>('perspective');
  const [isWaving, setIsWaving] = useState<boolean>(true);
  const [isAutoRotate, setIsAutoRotate] = useState<boolean>(false);
  const [textureIntensity, setTextureIntensity] = useState<number>(85);
  const [compareMode, setCompareMode] = useState<'printed' | 'plain'>('printed');

  const containerRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const initialOffsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Effective design URL (either user uploaded or active sample)
  const effectiveDesignUrl = uploadedDesignUrl || activeSample || '';

  // Auto-detect Material Type based on product category & name
  useEffect(() => {
    const cat = (product.category || '').toLowerCase();
    const name = (product.name || '').toLowerCase();

    if (name.includes('satin') || cat.includes('modal') || cat.includes('satin')) {
      setMaterialType('modal_satin');
    } else if (cat.includes('organza') || name.includes('organza') || cat.includes('silk')) {
      setMaterialType('silk_organza');
    } else if (cat.includes('poly') || name.includes('poly') || name.includes('sublimation')) {
      setMaterialType('polyester_sublimation');
    } else if (cat.includes('linen') || name.includes('linen')) {
      setMaterialType('french_linen');
    } else if (cat.includes('terry') || name.includes('terry') || name.includes('fleece')) {
      setMaterialType('french_terry');
    } else {
      setMaterialType('cotton_cambric');
    }

    if (product.colorCode) {
      setBaseColor(product.colorCode);
    }
  }, [product]);

  // Sync initial scale & repeat
  useEffect(() => {
    if (initialScale) setScale(initialScale);
    if (initialRepeatType && initialRepeatType !== 'straight') {
      setRepeatMode(initialRepeatType as any);
    }
  }, [initialScale, initialRepeatType]);

  // Sync buyingOption
  useEffect(() => {
    if (buyingOption === 'plain') {
      setCompareMode('plain');
    } else {
      setCompareMode('printed');
    }
  }, [buyingOption]);

  const handleResetPosition = () => {
    setOffsetX(0);
    setOffsetY(0);
    setScale(100);
    setRotationAngle(0);
  };

  const handleRotate = () => {
    setRotationAngle((prev) => (prev + 90) % 360);
  };

  const isPlainMode = compareMode === 'plain';
  const hasDesign = !isPlainMode && Boolean(effectiveDesignUrl);

  // Mouse / Touch drag handlers for 2D Swatch mode
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!hasDesign || viewMode !== 'mill_swatch') return;
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    initialOffsetRef.current = { x: offsetX, y: offsetY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || viewMode !== 'mill_swatch') return;
    const deltaX = e.clientX - dragStartRef.current.x;
    const deltaY = e.clientY - dragStartRef.current.y;
    setOffsetX(initialOffsetRef.current.x + Math.round(deltaX));
    setOffsetY(initialOffsetRef.current.y + Math.round(deltaY));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleNudge = (dx: number, dy: number) => {
    setOffsetX((prev) => prev + dx);
    setOffsetY((prev) => prev + dy);
  };

  // Export High-Res Proof Image
  const handleExportProof = () => {
    const canvas = containerRef.current?.querySelector('canvas');
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `${product.name.replace(/\s+/g, '_')}_Fabric_Proof.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="space-y-4 select-none" ref={containerRef}>
      
      {/* 1. TOP STUDIO MODE SWITCHER TOOLBAR */}
      <div className="bg-white dark:bg-[#1A1C1E] p-2 rounded-2xl border border-gray-200 dark:border-white/10 flex flex-wrap items-center justify-between gap-2 shadow-sm">
        
        {/* Main 2 View Tabs */}
        <div className="flex items-center space-x-1.5 p-1 bg-gray-100 dark:bg-white/5 rounded-xl text-xs font-bold">
          <button
            type="button"
            onClick={() => setViewMode('draped_cloth')}
            className={`px-3 py-1.5 rounded-lg transition flex items-center space-x-1.5 ${
              viewMode === 'draped_cloth'
                ? 'bg-[#0F172A] text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white'
            }`}
          >
            <span>👗 Draped 3D Fabric</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('mill_swatch')}
            className={`px-3 py-1.5 rounded-lg transition flex items-center space-x-1.5 ${
              viewMode === 'mill_swatch'
                ? 'bg-[#0F172A] text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white'
            }`}
          >
            <span>📐 2D Mill Yardage</span>
          </button>
        </div>

        {/* Action Controls (Plain vs Printed, Export Proof) */}
        <div className="flex items-center space-x-2">
          {/* Before/After Plain vs Printed Toggle */}
          <div className="flex items-center bg-gray-100 dark:bg-white/5 p-0.5 rounded-xl text-[11px] font-bold">
            <button
              type="button"
              onClick={() => setCompareMode('printed')}
              className={`px-2.5 py-1 rounded-lg transition ${
                compareMode === 'printed'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-gray-600 dark:text-gray-300'
              }`}
            >
              🎨 Printed Sublimation
            </button>
            <button
              type="button"
              onClick={() => setCompareMode('plain')}
              className={`px-2.5 py-1 rounded-lg transition ${
                compareMode === 'plain'
                  ? 'bg-[#2D325A] text-white shadow-xs'
                  : 'text-gray-600 dark:text-gray-300'
              }`}
            >
              🧵 Plain Base
            </button>
          </div>

          {/* Export PNG Proof */}
          <button
            type="button"
            onClick={handleExportProof}
            className="p-1.5 rounded-xl bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-gray-700 dark:text-gray-200 transition"
            title="Download High-Res Fabric Proof"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. MAIN INTERACTIVE VISUALIZATION STAGE (3D WEBGL OR 2D MILL PROOF) */}
      <div
        className="relative aspect-square w-full bg-[#F5F2EB] dark:bg-[#151719] rounded-3xl border border-gray-300 dark:border-white/10 overflow-hidden shadow-2xl group"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        
        {/* ─── 3D WEBGL STUDIO (DRAPED CLOTH) ─── */}
        {viewMode !== 'mill_swatch' ? (
          <div className="absolute inset-0">
            <Fabric3DClothStudio
              mode={'draped_cloth'}
              designUrl={effectiveDesignUrl}
              fabricImageUrl={product.image_url || (product.images && product.images[0]) || ''}
              repeatMode={repeatMode}
              scalePercentage={scale}
              rotationAngle={rotationAngle}
              offsetX={offsetX}
              offsetY={offsetY}
              baseColor={baseColor}
              materialType={materialType}
              lightingAtmosphere={lightingAtmosphere}
              cameraPreset={cameraPreset}
              isWaving={isWaving}
              isAutoRotate={isAutoRotate}
              compareMode={compareMode}
              textureIntensity={textureIntensity}
            />

            {/* 3D Floating Camera & Lighting HUD Overlay */}
            <div className="absolute top-3 left-3 z-30 flex flex-wrap items-center gap-1.5 pointer-events-auto">
              
              {/* Camera Presets Menu */}
              <div className="flex items-center bg-black/70 backdrop-blur-md rounded-xl p-1 text-white text-[10px] font-bold space-x-1 shadow-md">
                <Camera className="w-3 h-3 text-amber-400 ml-1" />
                {[
                  { id: 'perspective', label: '3D View' },
                  { id: 'front', label: 'Front' },
                  { id: 'side', label: 'Side' },
                  { id: 'top', label: 'Top' },
                  { id: 'macro', label: 'Macro' }
                ].map((cam) => (
                  <button
                    key={cam.id}
                    type="button"
                    onClick={() => setCameraPreset(cam.id as any)}
                    className={`px-2 py-0.5 rounded-lg transition ${
                      cameraPreset === cam.id ? 'bg-white/30 text-white' : 'hover:bg-white/10 text-gray-300'
                    }`}
                  >
                    {cam.label}
                  </button>
                ))}
              </div>

              {/* Lighting Atmosphere Selector */}
              <div className="flex items-center bg-black/70 backdrop-blur-md rounded-xl p-1 text-white text-[10px] font-bold space-x-1 shadow-md">
                <Sun className="w-3 h-3 text-yellow-400 ml-1" />
                {[
                  { id: 'studio_softbox', label: 'Studio' },
                  { id: 'warm_sunlight', label: 'Sunlight' },
                  { id: 'dramatic_spotlight', label: 'Spotlight' }
                ].map((light) => (
                  <button
                    key={light.id}
                    type="button"
                    onClick={() => setLightingAtmosphere(light.id as any)}
                    className={`px-2 py-0.5 rounded-lg transition ${
                      lightingAtmosphere === light.id ? 'bg-white/30 text-white' : 'hover:bg-white/10 text-gray-300'
                    }`}
                  >
                    {light.label}
                  </button>
                ))}
              </div>

              {/* 360 Spin & Wave Physics Toggles */}
              <button
                type="button"
                onClick={() => setIsAutoRotate(!isAutoRotate)}
                className={`p-1.5 rounded-xl backdrop-blur-md text-[10px] font-bold shadow-md transition flex items-center space-x-1 ${
                  isAutoRotate ? 'bg-emerald-600 text-white' : 'bg-black/70 text-gray-300 hover:text-white'
                }`}
                title="Toggle 360 Auto-Rotation"
              >
                <RefreshCw className={`w-3 h-3 ${isAutoRotate ? 'animate-spin' : ''}`} />
                <span>360°</span>
              </button>

              {viewMode === 'draped_cloth' && (
                <button
                  type="button"
                  onClick={() => setIsWaving(!isWaving)}
                  className={`p-1.5 rounded-xl backdrop-blur-md text-[10px] font-bold shadow-md transition flex items-center space-x-1 ${
                    isWaving ? 'bg-blue-600 text-white' : 'bg-black/70 text-gray-300 hover:text-white'
                  }`}
                  title="Toggle Natural Fabric Wave Ripples"
                >
                  {isWaving ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                  <span>Wave</span>
                </button>
              )}
            </div>

            {/* Orbit Drag Hint */}
            <div className="absolute bottom-3 right-3 z-30 pointer-events-none">
              <span className="bg-black/70 text-white text-[10px] font-medium px-2.5 py-1 rounded-lg backdrop-blur-md shadow flex items-center space-x-1">
                <Move className="w-3 h-3 text-cyan-400" />
                <span>Drag to rotate 3D • Scroll to zoom</span>
              </span>
            </div>
          </div>
        ) : (
          
          /* ─── 2D MILL FLAT-LAY YARDAGE (TRUE 5" MILL CALIBRATION) ─── */
          <div className="absolute inset-0 bg-[#0F1113] overflow-hidden">

            {/* SVG Fabric Wave Displacement Filter for Realistic Cloth Warping */}
            <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
              <filter id="fabricClothWaveWrap">
                <feTurbulence type="fractalNoise" baseFrequency="0.012 0.006" numOctaves="3" result="clothNoise" />
                <feDisplacementMap in="SourceGraphic" in2="clothNoise" scale="12" xChannelSelector="R" yChannelSelector="G" />
              </filter>
            </svg>

            {/* 1. Calibrated Fabric Area: Positioned flush to the right edge */}
            <div
              className="absolute top-0 right-0 bottom-8 left-8 overflow-hidden select-none"
              style={{ backgroundColor: baseColor }}
            >
              {/* Layer 1: Real Fabric Micro-Woven Textile Weave Grain */}
              <div
                className="absolute inset-0 pointer-events-none opacity-40 z-10"
                style={{
                  backgroundImage: `
                    linear-gradient(45deg, rgba(0,0,0,0.06) 25%, transparent 25%, transparent 75%, rgba(0,0,0,0.06) 75%),
                    linear-gradient(45deg, rgba(0,0,0,0.06) 25%, transparent 25%, transparent 75%, rgba(0,0,0,0.06) 75%),
                    linear-gradient(to right, rgba(0,0,0,0.03) 1px, transparent 1px),
                    linear-gradient(to bottom, rgba(0,0,0,0.03) 1px, transparent 1px)
                  `,
                  backgroundSize: '4px 4px, 4px 4px, 2px 2px, 2px 2px',
                  backgroundPosition: '0 0, 2px 2px, 0 0, 0 0'
                }}
              />

              {/* Layer 2: Natural Cascading Fabric Waves & Surface Folds (Base Lighting) */}
              <div
                className="absolute inset-0 pointer-events-none opacity-50 z-10"
                style={{
                  background: `
                    repeating-linear-gradient(
                      132deg,
                      rgba(255, 255, 255, 0.28) 0px,
                      rgba(255, 255, 255, 0.45) 45px,
                      rgba(0, 0, 0, 0.04) 90px,
                      rgba(0, 0, 0, 0.20) 135px,
                      rgba(255, 255, 255, 0.22) 180px
                    )
                  `,
                  mixBlendMode: 'overlay'
                }}
              />

              {/* Layer 3: Seamless Industrial Digital Reactive Print Layer (Physically Wrapped) */}
              {hasDesign ? (
                <div
                  className="absolute inset-0 transition-all duration-75 pointer-events-none z-10"
                  style={{
                    backgroundImage: `url('${effectiveDesignUrl}')`,
                    backgroundSize:
                      repeatMode === 'centered'
                        ? 'contain'
                        : `${(scale / 100) * 35}%`,
                    backgroundRepeat: repeatMode === 'centered' ? 'no-repeat' : 'repeat',
                    backgroundPosition:
                      repeatMode === 'centered'
                        ? `calc(50% + ${offsetX}px) calc(50% + ${offsetY}px)`
                        : `${offsetX}px ${offsetY}px`,
                    transform: rotationAngle ? `rotate(${rotationAngle}deg)` : 'none',
                    transformOrigin: 'center center',
                    mixBlendMode: 'multiply',
                    opacity: materialType === 'silk_organza' ? 0.82 : 0.96,
                    filter: 'url(#fabricClothWaveWrap)'
                  }}
                />
              ) : isPlainMode ? (
                /* Plain mode: fabric specifications badge */
                <div className="absolute bottom-4 left-4 z-20 pointer-events-none">
                  <div className="inline-flex items-center space-x-2 px-3 py-1.5 bg-black/70 backdrop-blur-md rounded-xl text-white text-[11px] font-bold shadow-lg border border-white/10">
                    <Scissors className="w-3.5 h-3.5 text-cyan-300 shrink-0" />
                    <span>Plain RFD · {product.gsm} GSM · {product.composition || product.category}</span>
                  </div>
                </div>
              ) : (
                /* No design prompt */
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-black/20 backdrop-blur-[2px] z-10">
                  <div className="text-center p-6 bg-white/90 dark:bg-[#141517]/90 backdrop-blur-md rounded-2xl border border-black/10 shadow-xl max-w-[300px]">
                    <Printer className="w-9 h-9 text-[#2D325A] dark:text-blue-400 mx-auto mb-2 stroke-[1.5]" />
                    <span className="text-xs font-black uppercase tracking-wider text-gray-900 dark:text-white block">
                      Print Your Design on {product.name.split(' ').slice(0,2).join(' ')}
                    </span>
                    <span className="text-[11px] text-gray-600 dark:text-gray-300 block mt-1 leading-relaxed">
                      Upload your artwork or pick a sample print below to preview it on this fabric
                    </span>
                  </div>
                </div>
              )}

              {/* Layer 4: Deep Fold Crease Shadow Pass (Wraps shadows into the artwork) */}
              <div
                className="absolute inset-0 pointer-events-none z-20 opacity-30"
                style={{
                  background: `
                    repeating-linear-gradient(
                      132deg,
                      transparent 0px,
                      transparent 90px,
                      rgba(0, 0, 0, 0.40) 135px,
                      transparent 165px
                    )
                  `,
                  mixBlendMode: 'multiply'
                }}
              />

              {/* Layer 5: Soft Specular Crest Light Pass (Catches light along wave ridges) */}
              <div
                className="absolute inset-0 pointer-events-none z-20 opacity-35"
                style={{
                  background: `
                    repeating-linear-gradient(
                      132deg,
                      transparent 0px,
                      rgba(255, 255, 255, 0.45) 45px,
                      transparent 90px
                    )
                  `,
                  mixBlendMode: 'screen'
                }}
              />

              {/* Layer 6: Natural Textile Edge Vignette & Fiber Depth */}
              <div
                className="absolute inset-0 pointer-events-none z-20"
                style={{
                  boxShadow: 'inset 0 0 50px rgba(0,0,0,0.12), inset 0 0 15px rgba(0,0,0,0.06)'
                }}
              />
            </div>


            {/* Layer 5: 📐 High-Contrast Mill Calibrated 5-Inch Scale Ruler */}
            <div className="absolute inset-0 pointer-events-none z-30 select-none">
              {/* Left Vertical Ruler (0 to 5 inches) */}
              <div className="absolute top-0 left-0 bottom-0 w-8 bg-[#C53047] flex flex-col justify-between py-2 pl-1 border-r-2 border-white/70 text-white shadow-xl">
                {[5, 4, 3, 2, 1, 0].map((num) => (
                  <div key={num} className="relative flex items-center justify-between w-full pr-1">
                    <span className="text-[11px] font-black font-mono leading-none text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                      {num}
                    </span>
                    <div className="flex flex-col items-end space-y-[2px]">
                      <div className="w-3.5 h-[2px] bg-white shadow-sm" />
                      {num > 0 && (
                        <>
                          <div className="w-2 h-[1px] bg-white/70" />
                          <div className="w-2.5 h-[1.5px] bg-white/90" />
                          <div className="w-2 h-[1px] bg-white/70" />
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom Horizontal Ruler (0 to 5 inches) */}
              <div className="absolute bottom-0 left-0 right-0 h-8 bg-[#C53047] flex items-end justify-between px-2 pb-1 border-t-2 border-white/70 text-white shadow-xl">
                <span className="text-[9px] uppercase font-black tracking-wider text-white ml-7 leading-none mb-1 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                  INCHES
                </span>
                {[0, 1, 2, 3, 4, 5].map((num) => (
                  <div key={num} className="relative flex flex-col items-center">
                    <div className="flex items-end space-x-[2px] mb-1">
                      {num < 5 && (
                        <>
                          <div className="h-2 w-[1px] bg-white/70" />
                          <div className="h-2.5 w-[1.5px] bg-white/90" />
                          <div className="h-2 w-[1px] bg-white/70" />
                        </>
                      )}
                      <div className="h-3.5 w-[2px] bg-white shadow-sm" />
                    </div>
                    <span className="text-[11px] font-black font-mono leading-none text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                      {num}
                    </span>
                  </div>
                ))}
              </div>

              {/* Mill QC Stamp */}
              <div className="absolute right-9 bottom-10 opacity-90 flex flex-col items-end pointer-events-none select-none">
                <div className="w-10 h-10 rounded-xl border-2 border-white flex flex-col items-center justify-center text-[8px] font-black text-white leading-none bg-[#C53047] shadow-lg">
                  <span className="tracking-tighter font-extrabold text-[10px]">TIM</span>
                  <span className="text-[6px] uppercase font-bold tracking-widest mt-0.5">MILL QC</span>
                </div>
              </div>
            </div>
          </div>
        )}


      </div>

      {/* 3. CURATED SAMPLE PRINT GALLERY (INSTANT 1-CLICK TESTING) */}
      <div className="bg-white dark:bg-[#1A1C1E] p-3.5 rounded-2xl border border-gray-200 dark:border-white/10 space-y-2.5 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold uppercase tracking-wider text-gray-800 dark:text-gray-200 flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Try Sample Mill Prints on {product.name.split(' ')[0]}:</span>
          </span>
          {activeSample && (
            <button
              type="button"
              onClick={() => setActiveSample(null)}
              className="text-[10px] text-red-600 dark:text-red-400 font-bold hover:underline"
            >
              Clear Sample
            </button>
          )}
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {SAMPLE_FABRIC_PRINTS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setActiveSample(item.url);
                if (onSelectSampleDesign) {
                  onSelectSampleDesign(item.url, item.name);
                }
              }}
              className={`group relative rounded-xl overflow-hidden border-2 transition aspect-square flex flex-col items-center justify-end p-1 text-left ${
                activeSample === item.url || uploadedDesignUrl === item.url
                  ? 'border-[#0F172A] ring-2 ring-[#0F172A]'
                  : 'border-gray-200 dark:border-white/10 hover:border-gray-400'
              }`}
            >
              <img
                src={item.url}
                alt={item.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <span className="relative z-10 text-[9px] font-bold text-white leading-tight truncate w-full text-center drop-shadow-sm">
                {item.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 4. INTERACTIVE PATTERN REPEAT, SCALING & TRANSFORMATION CONTROLS */}
      {hasDesign && (
        <div className="bg-white dark:bg-[#1A1C1E] p-4 rounded-2xl border border-gray-200 dark:border-white/10 space-y-3.5 shadow-sm">
          
          {/* Repeat Mode Row */}
          <div className="flex flex-wrap items-center justify-between border-b border-gray-100 dark:border-white/5 pb-3 gap-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-gray-700 dark:text-gray-300 flex items-center space-x-1.5">
              <Grid className="w-4 h-4 text-[#0F172A] dark:text-blue-400" />
              <span>Pattern Repeat Engine:</span>
            </span>

            <div className="flex flex-wrap items-center gap-1 bg-gray-100 dark:bg-white/10 p-0.5 rounded-xl text-xs font-bold">
              {[
                { id: 'grid', label: 'Grid' },
                { id: 'drop', label: 'Half-Drop' },
                { id: 'brick', label: 'Half-Brick' },
                { id: 'mirror', label: 'Mirror' },
                { id: 'centered', label: 'Single Center' }
              ].map((rep) => (
                <button
                  key={rep.id}
                  type="button"
                  onClick={() => setRepeatMode(rep.id as any)}
                  className={`px-2.5 py-1 rounded-lg transition ${
                    repeatMode === rep.id
                      ? 'bg-[#0F172A] text-white shadow-xs'
                      : 'text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white'
                  }`}
                >
                  {rep.label}
                </button>
              ))}
            </div>

            {/* Rotate Button */}
            <button
              type="button"
              onClick={handleRotate}
              className="px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-200 text-xs font-bold flex items-center space-x-1 transition"
              title="Rotate 90 degrees"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Rotate ({rotationAngle}°)</span>
            </button>
          </div>

          {/* Size / Scale Slider & Directional Movement */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
            
            {/* Scale Slider (Small / Big) */}
            <div className="sm:col-span-7 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-gray-700 dark:text-gray-300 flex items-center space-x-1">
                  <ZoomIn className="w-3.5 h-3.5 text-blue-600" />
                  <span>Pattern Scale (Small / Big):</span>
                </span>
                <span className="font-mono font-bold text-xs bg-gray-100 dark:bg-white/10 px-2 py-0.5 rounded">
                  {scale}% ({((scale / 100) * 5).toFixed(1)} inches / {((scale / 100) * 12.7).toFixed(1)} cm)
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setScale((prev) => Math.max(20, prev - 15))}
                  className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-white/10 flex items-center justify-center font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-200"
                  title="Make Smaller"
                >
                  -
                </button>
                <input
                  type="range"
                  min={20}
                  max={250}
                  value={scale}
                  onChange={(e) => setScale(Number(e.target.value))}
                  className="flex-1 accent-[#0F172A] cursor-pointer h-1.5 bg-gray-200 dark:bg-white/20 rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => setScale((prev) => Math.min(250, prev + 15))}
                  className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-white/10 flex items-center justify-center font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-200"
                  title="Make Bigger"
                >
                  +
                </button>
              </div>

              {/* Quick Presets */}
              <div className="flex items-center space-x-1.5 pt-1">
                <span className="text-[10px] text-gray-500 font-semibold">Presets:</span>
                {[
                  { label: '50%', val: 50 },
                  { label: '75%', val: 75 },
                  { label: '100% (True)', val: 100 },
                  { label: '150%', val: 150 },
                  { label: '200%', val: 200 }
                ].map((p) => (
                  <button
                    key={p.val}
                    type="button"
                    onClick={() => setScale(p.val)}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold transition ${
                      scale === p.val
                        ? 'bg-[#0F172A] text-white'
                        : 'bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Directional Nudge Pad (Move Position) */}
            <div className="sm:col-span-5 bg-gray-50 dark:bg-[#141517] p-2.5 rounded-xl border border-gray-200/80 dark:border-white/5 flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[11px] font-bold text-gray-700 dark:text-gray-300 block">
                  Move Pattern:
                </span>
                <span className="text-[9.5px] text-gray-500 block">
                  X: {offsetX}px | Y: {offsetY}px
                </span>
                <button
                  type="button"
                  onClick={handleResetPosition}
                  className="text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center space-x-1 mt-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Center</span>
                </button>
              </div>

              {/* D-Pad Buttons */}
              <div className="grid grid-cols-3 gap-1 w-24">
                <div />
                <button
                  type="button"
                  onClick={() => handleNudge(0, -15)}
                  className="w-7 h-7 rounded bg-white dark:bg-[#1E2023] border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-700 dark:text-gray-200 hover:bg-gray-100 shadow-xs active:scale-95"
                  title="Move Up"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <div />

                <button
                  type="button"
                  onClick={() => handleNudge(-15, 0)}
                  className="w-7 h-7 rounded bg-white dark:bg-[#1E2023] border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-700 dark:text-gray-200 hover:bg-gray-100 shadow-xs active:scale-95"
                  title="Move Left"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={handleResetPosition}
                  className="w-7 h-7 rounded bg-[#0F172A] text-white flex items-center justify-center font-bold text-[10px] shadow-xs active:scale-95"
                  title="Center Alignment"
                >
                  •
                </button>
                <button
                  type="button"
                  onClick={() => handleNudge(15, 0)}
                  className="w-7 h-7 rounded bg-white dark:bg-[#1E2023] border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-700 dark:text-gray-200 hover:bg-gray-100 shadow-xs active:scale-95"
                  title="Move Right"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <div />
                <button
                  type="button"
                  onClick={() => handleNudge(0, 15)}
                  className="w-7 h-7 rounded bg-white dark:bg-[#1E2023] border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-700 dark:text-gray-200 hover:bg-gray-100 shadow-xs active:scale-95"
                  title="Move Down"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
                <div />
              </div>
            </div>

          </div>

          {/* Material & Base Color Properties */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-gray-100 dark:border-white/5 text-xs">
            {/* Material Selection */}
            <div className="space-y-1">
              <span className="font-bold text-gray-700 dark:text-gray-300 block">
                Fabric Material Simulation:
              </span>
              <select
                value={materialType}
                onChange={(e) => setMaterialType(e.target.value as any)}
                className="w-full bg-gray-50 dark:bg-white/10 border border-gray-200 dark:border-white/10 rounded-xl px-2.5 py-1.5 text-xs font-semibold focus:outline-none"
              >
                <option value="modal_satin">Modal Satin (Glossy Luster & Folds)</option>
                <option value="cotton_cambric">Cotton Cambric (Natural Matte Weave)</option>
                <option value="silk_organza">Silk Organza (Translucent Sheer)</option>
                <option value="polyester_sublimation">Polyester Sublimation (Dye-Infused)</option>
                <option value="french_linen">French Flax Linen (Slub Yarn Texture)</option>
                <option value="french_terry">French Terry Knit (Heavyweight Loop)</option>
              </select>
            </div>

            {/* Base Fabric Tone */}
            <div className="space-y-1">
              <span className="font-bold text-gray-700 dark:text-gray-300 block">
                Base Fabric Color Tint:
              </span>
              <div className="flex items-center space-x-2">
                {[
                  { hex: '#FFFFFF', name: 'Bleached White' },
                  { hex: '#FAF8F5', name: 'Natural Off-White' },
                  { hex: '#F0EAE1', name: 'Oatmeal Ecru' },
                  { hex: '#FFFDD0', name: 'Soft Cream' },
                  { hex: '#D1D5DB', name: 'Slate Heather' }
                ].map((c) => (
                  <button
                    key={c.hex}
                    type="button"
                    onClick={() => setBaseColor(c.hex)}
                    style={{ backgroundColor: c.hex }}
                    className={`w-6 h-6 rounded-full border shadow-xs transition ${
                      baseColor === c.hex ? 'ring-2 ring-[#0F172A] scale-110' : 'border-gray-300'
                    }`}
                    title={c.name}
                  />
                ))}
              </div>
            </div>
          </div>

        </div>
      )}

      {/* 5. "HOW YOUR FABRIC IS DELIVERED IN REAL LIFE" CONFIDENCE BANNER */}
      <div className="p-4 bg-gradient-to-r from-emerald-50/80 via-teal-50/70 to-blue-50/80 dark:from-emerald-950/20 dark:via-teal-950/20 dark:to-blue-950/20 rounded-2xl border border-emerald-200/80 dark:border-emerald-800/30 text-xs space-y-2">
        <div className="flex items-center space-x-2 text-emerald-900 dark:text-emerald-300 font-extrabold">
          <Package className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Real Life Delivery & Quality Guarantee:</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-[11px] text-gray-700 dark:text-gray-300">
          <div className="flex items-start space-x-1.5">
            <span className="text-emerald-600 font-bold">✓</span>
            <span><strong>Continuous Single Cut:</strong> Ordered 5m? You receive 1 seamless 5m length (no breaks).</span>
          </div>
          <div className="flex items-start space-x-1.5">
            <span className="text-emerald-600 font-bold">✓</span>
            <span><strong>300+ DPI Industrial Print:</strong> Wash-fast, steam-cured reactive dyes with vivid depth.</span>
          </div>
          <div className="flex items-start space-x-1.5">
            <span className="text-emerald-600 font-bold">✓</span>
            <span><strong>Hard-Core Tube Rolling:</strong> Rolled crease-free, ready for master cutting & tailoring.</span>
          </div>
        </div>
      </div>

    </div>
  );
};

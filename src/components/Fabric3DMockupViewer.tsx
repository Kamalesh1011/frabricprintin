import React, { useRef, useEffect, useState } from 'react';
import {
  Package,
  Shirt,
  Square,
  Ruler,
  Sun,
  Activity,
  Maximize2,
  Minimize2,
  Sparkles,
  Sunset,
  Lightbulb,
  Layers,
  Image as ImageIcon,
  Flame,
  Wind
} from 'lucide-react';
import { Product, LayoutType, SizeOptionType, Mockup3DMode, FabricTextureType, StudioLightingType } from '../types';
import { useTheme } from '../context/ThemeContext';

interface Fabric3DMockupViewerProps {
  designUrl: string;
  product: Product;
  selectedSizeType: SizeOptionType;
  meters: number;
  layoutType: LayoutType;
  scalePercentage: number;
  rotation: 0 | 90 | 180 | 270;
  inkBlendMode: boolean;
  showRulers: boolean;
  active3DMode?: Mockup3DMode;
  onModeChange?: (mode: Mockup3DMode) => void;
}

export const Fabric3DMockupViewer: React.FC<Fabric3DMockupViewerProps> = ({
  designUrl,
  product,
  selectedSizeType,
  meters,
  layoutType,
  scalePercentage,
  rotation,
  inkBlendMode,
  showRulers,
  active3DMode = 'bolt',
  onModeChange
}) => {
  const { isDark } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [currentMode, setCurrentMode] = useState<Mockup3DMode>(active3DMode);
  const [textureFinish, setTextureFinish] = useState<FabricTextureType>('cotton_matte');
  const [lightingAtmosphere, setLightingAtmosphere] = useState<StudioLightingType>('studio');
  const [isWaving, setIsWaving] = useState<boolean>(true);
  const [waveOffset, setWaveOffset] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  useEffect(() => {
    if (active3DMode) setCurrentMode(active3DMode);
  }, [active3DMode]);

  useEffect(() => {
    if (product.category === 'Silk' || product.category === 'Modal') {
      setTextureFinish('silk_sheen');
    } else if (product.category === 'Linen') {
      setTextureFinish('linen_weave');
    } else {
      setTextureFinish('cotton_matte');
    }
  }, [product.category]);

  // Smooth drape wave loop
  useEffect(() => {
    let animId: number;
    if (isWaving) {
      const loop = () => {
        setWaveOffset((prev) => (prev + 0.02) % (Math.PI * 2));
        animId = requestAnimationFrame(loop);
      };
      animId = requestAnimationFrame(loop);
    }
    return () => cancelAnimationFrame(animId);
  }, [isWaving]);

  // Canvas Drawing Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // 1. Base Fabric Surface
    ctx.fillStyle = product.colorCode || (isDark ? '#1C1E1C' : '#F9F6ED');
    ctx.fillRect(0, 0, width, height);

    // 2. Micro Weave Grid Simulation
    ctx.save();
    ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)';
    for (let x = 0; x < width; x += 4) {
      ctx.fillRect(x, 0, 1, height);
    }
    for (let y = 0; y < height; y += 4) {
      ctx.fillRect(0, y, width, 1);
    }
    ctx.restore();

    // 3. Render Pattern Repeats onto Base Surface
    if (designUrl) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = designUrl;

      img.onload = () => {
        const baseTileSize = (width / 4) * (scalePercentage / 100);
        const tileW = Math.max(20, baseTileSize);
        const tileH = Math.max(20, baseTileSize * (img.height / img.width));

        const tileCanvas = document.createElement('canvas');
        tileCanvas.width = tileW;
        tileCanvas.height = tileH;
        const tileCtx = tileCanvas.getContext('2d');

        if (tileCtx) {
          tileCtx.save();
          tileCtx.translate(tileW / 2, tileH / 2);
          tileCtx.rotate((rotation * Math.PI) / 180);
          tileCtx.drawImage(img, -tileW / 2, -tileH / 2, tileW, tileH);
          tileCtx.restore();

          if (inkBlendMode) {
            ctx.globalCompositeOperation = isDark ? 'screen' : 'multiply';
          } else {
            ctx.globalCompositeOperation = 'source-over';
          }

          if (layoutType === 'single') {
            const centerX = (width - tileW) / 2;
            const centerY = (height - tileH) / 2;
            ctx.drawImage(tileCanvas, centerX, centerY, tileW, tileH);
          } else if (layoutType === 'half_drop') {
            let col = 0;
            for (let x = -tileW; x < width + tileW; x += tileW) {
              const yOffset = col % 2 === 1 ? tileH / 2 : 0;
              for (let y = -tileH; y < height + tileH; y += tileH) {
                ctx.drawImage(tileCanvas, x, y + yOffset, tileW, tileH);
              }
              col++;
            }
          } else if (layoutType === 'brick_repeat') {
            let row = 0;
            for (let y = -tileH; y < height + tileH; y += tileH) {
              const xOffset = row % 2 === 1 ? tileW / 2 : 0;
              for (let x = -tileW; x < width + tileW; x += tileW) {
                ctx.drawImage(tileCanvas, x + xOffset, y, tileW, tileH);
              }
              row++;
            }
          } else if (layoutType === 'mirror_repeat') {
            for (let x = 0; x < width; x += tileW * 2) {
              for (let y = 0; y < height; y += tileH * 2) {
                ctx.drawImage(tileCanvas, x, y, tileW, tileH);
                ctx.save();
                ctx.translate(x + tileW * 2, y);
                ctx.scale(-1, 1);
                ctx.drawImage(tileCanvas, 0, 0, tileW, tileH);
                ctx.restore();

                ctx.save();
                ctx.translate(x, y + tileH * 2);
                ctx.scale(1, -1);
                ctx.drawImage(tileCanvas, 0, 0, tileW, tileH);
                ctx.restore();

                ctx.save();
                ctx.translate(x + tileW * 2, y + tileH * 2);
                ctx.scale(-1, -1);
                ctx.drawImage(tileCanvas, 0, 0, tileW, tileH);
                ctx.restore();
              }
            }
          } else {
            for (let x = 0; x < width; x += tileW) {
              for (let y = 0; y < height; y += tileH) {
                ctx.drawImage(tileCanvas, x, y, tileW, tileH);
              }
            }
          }
          ctx.globalCompositeOperation = 'source-over';
        }

        // Apply 3D Shaders after image renders
        apply3DShaderOverlays(ctx, width, height);
      };
    } else {
      apply3DShaderOverlays(ctx, width, height);
    }

    function apply3DShaderOverlays(cCtx: CanvasRenderingContext2D, w: number, h: number) {
      // 4. Mode-Specific 3D Model Shaders
      if (currentMode === 'bolt') {
        // Fabric Roll cylinder shading & cardboard tube
        const boltGrad = cCtx.createLinearGradient(0, 0, w, 0);
        boltGrad.addColorStop(0, 'rgba(0,0,0,0.4)');
        boltGrad.addColorStop(0.12, 'rgba(255,255,255,0.25)');
        boltGrad.addColorStop(0.45, 'rgba(0,0,0,0.05)');
        boltGrad.addColorStop(0.85, 'rgba(0,0,0,0.25)');
        boltGrad.addColorStop(1, 'rgba(0,0,0,0.6)');
        cCtx.fillStyle = boltGrad;
        cCtx.fillRect(0, 0, w, h);

        // Core roll top rim
        cCtx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
        cCtx.lineWidth = 3;
        cCtx.strokeRect(4, 4, w - 8, h - 8);
      } else if (currentMode === 'dress') {
        // Flowing evening gown drape curve
        const waveAmp = isWaving ? Math.sin(waveOffset) * 12 : 0;
        const dressGrad = cCtx.createRadialGradient(w * 0.5, h * 0.35, 40, w * 0.5, h * 0.5, w * 0.6);
        dressGrad.addColorStop(0, 'rgba(255,255,255,0.3)');
        dressGrad.addColorStop(0.5, 'rgba(0,0,0,0.1)');
        dressGrad.addColorStop(1, 'rgba(0,0,0,0.45)');
        cCtx.fillStyle = dressGrad;
        cCtx.fillRect(0, 0, w, h);

        // Dynamic flowing vertical ripples
        for (let fold = 0; fold < 6; fold++) {
          const foldX = (w / 6) * fold + (w / 12) + (isWaving ? Math.sin(waveOffset + fold) * 8 : 0);
          const foldGrad = cCtx.createLinearGradient(foldX - 25, 0, foldX + 25, 0);
          foldGrad.addColorStop(0, 'rgba(0,0,0,0.2)');
          foldGrad.addColorStop(0.5, 'rgba(255,255,255,0.2)');
          foldGrad.addColorStop(1, 'rgba(0,0,0,0.2)');
          cCtx.fillStyle = foldGrad;
          cCtx.fillRect(foldX - 25, 0, 50, h);
        }
      } else if (currentMode === 'cushion') {
        // Tufted pillow cushion bulge & corners
        const cushionGrad = cCtx.createRadialGradient(w * 0.5, h * 0.5, 20, w * 0.5, h * 0.5, w * 0.55);
        cushionGrad.addColorStop(0, 'rgba(255,255,255,0.35)');
        cushionGrad.addColorStop(0.65, 'rgba(0,0,0,0.08)');
        cushionGrad.addColorStop(1, 'rgba(0,0,0,0.6)');
        cCtx.fillStyle = cushionGrad;
        cCtx.fillRect(0, 0, w, h);

        // Corner pinch seams
        cCtx.strokeStyle = 'rgba(0,0,0,0.25)';
        cCtx.lineWidth = 4;
        cCtx.beginPath();
        cCtx.moveTo(0, 0);
        cCtx.lineTo(w * 0.15, h * 0.15);
        cCtx.moveTo(w, 0);
        cCtx.lineTo(w * 0.85, h * 0.15);
        cCtx.moveTo(0, h);
        cCtx.lineTo(w * 0.15, h * 0.85);
        cCtx.moveTo(w, h);
        cCtx.lineTo(w * 0.85, h * 0.85);
        cCtx.stroke();
      } else if (currentMode === 'curtain') {
        // Window Curtain / Scarf Flutter Drape
        for (let fold = 0; fold < 5; fold++) {
          const foldX = (w / 5) * fold;
          const foldGrad = cCtx.createLinearGradient(foldX, 0, foldX + (w / 5), 0);
          foldGrad.addColorStop(0, 'rgba(0,0,0,0.35)');
          foldGrad.addColorStop(0.5, 'rgba(255,255,255,0.25)');
          foldGrad.addColorStop(1, 'rgba(0,0,0,0.35)');
          cCtx.fillStyle = foldGrad;
          cCtx.fillRect(foldX, 0, w / 5, h);
        }
      } else if (currentMode === 'shirt') {
        // Mens Dress Shirt Collar & Placket Shading
        // Placket in center
        const placketGrad = cCtx.createLinearGradient(w * 0.45, 0, w * 0.55, 0);
        placketGrad.addColorStop(0, 'rgba(0,0,0,0.25)');
        placketGrad.addColorStop(0.5, 'rgba(255,255,255,0.15)');
        placketGrad.addColorStop(1, 'rgba(0,0,0,0.25)');
        cCtx.fillStyle = placketGrad;
        cCtx.fillRect(w * 0.45, 0, w * 0.1, h);

        // Buttons
        for (let b = 1; b <= 4; b++) {
          cCtx.fillStyle = '#FFFFFF';
          cCtx.beginPath();
          cCtx.arc(w * 0.5, (h / 5) * b, 6, 0, Math.PI * 2);
          cCtx.fill();
          cCtx.strokeStyle = 'rgba(0,0,0,0.4)';
          cCtx.lineWidth = 1;
          cCtx.stroke();
        }
      } else if (currentMode === 'canvas') {
        // Stretched Gallery Canvas with 3D Bevel Edge
        cCtx.strokeStyle = 'rgba(0,0,0,0.4)';
        cCtx.lineWidth = 8;
        cCtx.strokeRect(4, 4, w - 8, h - 8);

        // Canvas linen grain
        cCtx.fillStyle = 'rgba(255,255,255,0.06)';
        cCtx.fillRect(10, 10, w - 20, h - 20);
      }

      // 5. Specular Sheen by Fabric Finish
      if (textureFinish === 'silk_sheen' || textureFinish === 'satin_gloss') {
        const sheenGrad = cCtx.createLinearGradient(0, 0, w, h);
        sheenGrad.addColorStop(0.3, 'transparent');
        sheenGrad.addColorStop(0.5, 'rgba(255,255,255,0.28)');
        sheenGrad.addColorStop(0.7, 'transparent');
        cCtx.fillStyle = sheenGrad;
        cCtx.fillRect(0, 0, w, h);
      }

      // 6. Dynamic Studio Lighting Atmospheres
      if (lightingAtmosphere === 'sunset') {
        const sunsetGrad = cCtx.createRadialGradient(w * 0.8, h * 0.2, 50, w * 0.5, h * 0.5, w);
        sunsetGrad.addColorStop(0, 'rgba(245, 158, 11, 0.22)');
        sunsetGrad.addColorStop(0.6, 'rgba(217, 119, 6, 0.12)');
        sunsetGrad.addColorStop(1, 'rgba(15, 16, 15, 0.18)');
        cCtx.fillStyle = sunsetGrad;
        cCtx.fillRect(0, 0, w, h);
      } else if (lightingAtmosphere === 'runway') {
        const spotGrad = cCtx.createRadialGradient(w * 0.5, h * 0.4, 40, w * 0.5, h * 0.5, w * 0.7);
        spotGrad.addColorStop(0, 'rgba(255, 255, 255, 0.35)');
        spotGrad.addColorStop(0.7, 'rgba(0, 0, 0, 0.25)');
        spotGrad.addColorStop(1, 'rgba(0, 0, 0, 0.6)');
        cCtx.fillStyle = spotGrad;
        cCtx.fillRect(0, 0, w, h);
      } else if (lightingAtmosphere === 'neon') {
        const neonGrad = cCtx.createLinearGradient(0, 0, w, 0);
        neonGrad.addColorStop(0, 'rgba(236, 72, 153, 0.18)');
        neonGrad.addColorStop(0.5, 'transparent');
        neonGrad.addColorStop(1, 'rgba(6, 182, 212, 0.18)');
        cCtx.fillStyle = neonGrad;
        cCtx.fillRect(0, 0, w, h);
      }

      // 7. Metric Rulers
      if (showRulers) {
        cCtx.strokeStyle = 'rgba(212, 175, 55, 0.7)';
        cCtx.fillStyle = 'rgba(212, 175, 55, 0.9)';
        cCtx.font = '10px sans-serif';
        cCtx.lineWidth = 1;

        // Top horizontal ruler
        cCtx.beginPath();
        cCtx.moveTo(0, 16);
        cCtx.lineTo(w, 16);
        for (let rx = 0; rx < w; rx += 40) {
          cCtx.moveTo(rx, 6);
          cCtx.lineTo(rx, 16);
          cCtx.fillText(`${Math.round((rx / w) * 112)}cm`, rx + 2, 12);
        }
        cCtx.stroke();
      }
    }
  }, [
    designUrl,
    product,
    layoutType,
    scalePercentage,
    rotation,
    inkBlendMode,
    showRulers,
    currentMode,
    textureFinish,
    lightingAtmosphere,
    waveOffset,
    isDark
  ]);

  const MODES_CONFIG: { id: Mockup3DMode; label: string; icon: React.ReactNode }[] = [
    { id: 'bolt', label: 'Fabric Bolt', icon: <Package className="w-3.5 h-3.5" /> },
    { id: 'dress', label: 'Gown Drape', icon: <Shirt className="w-3.5 h-3.5" /> },
    { id: 'cushion', label: 'Living Pillow', icon: <Square className="w-3.5 h-3.5" /> },
    { id: 'curtain', label: 'Curtain / Scarf', icon: <Wind className="w-3.5 h-3.5" /> },
    { id: 'shirt', label: 'Dress Shirt', icon: <Layers className="w-3.5 h-3.5" /> },
    { id: 'canvas', label: 'Wall Canvas', icon: <ImageIcon className="w-3.5 h-3.5" /> },
  ];

  return (
    <div
      ref={containerRef}
      className={`relative bg-white dark:bg-[#161716] rounded-3xl border border-black/10 dark:border-white/10 shadow-xl overflow-hidden flex flex-col transition-all duration-300 ${
        isFullscreen ? 'fixed inset-4 z-50 shadow-2xl' : 'w-full'
      }`}
    >
      {/* 1. Header 3D Model Switcher Bar (6 Models) */}
      <div className="p-3 sm:p-4 border-b border-black/5 dark:border-white/5 flex items-center justify-between flex-wrap gap-2 bg-black/[0.02] dark:bg-white/[0.02]">
        <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-0.5">
          {MODES_CONFIG.map((m) => (
            <button
              key={m.id}
              onClick={() => {
                setCurrentMode(m.id);
                if (onModeChange) onModeChange(m.id);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 whitespace-nowrap ${
                currentMode === m.id
                  ? 'bg-[#0F100F] text-white dark:bg-white dark:text-[#0F100F] shadow-sm'
                  : 'bg-black/5 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-black/10'
              }`}
            >
              <span>{m.icon}</span>
              <span>{m.label}</span>
            </button>
          ))}
        </div>

        {/* Lighting & Fullscreen Actions */}
        <div className="flex items-center space-x-2">
          {/* Lighting Mode Picker */}
          <div className="flex items-center bg-black/5 dark:bg-white/5 p-1 rounded-xl">
            <button
              onClick={() => setLightingAtmosphere('studio')}
              title="Studio Lighting"
              className={`p-1.5 rounded-lg text-xs transition ${
                lightingAtmosphere === 'studio' ? 'bg-white dark:bg-black text-black dark:text-white shadow-sm' : 'text-slate-500'
              }`}
            >
              <Lightbulb className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setLightingAtmosphere('sunset')}
              title="Sunset Golden Hour"
              className={`p-1.5 rounded-lg text-xs transition ${
                lightingAtmosphere === 'sunset' ? 'bg-white dark:bg-black text-[#AC7900] shadow-sm' : 'text-slate-500'
              }`}
            >
              <Sunset className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setLightingAtmosphere('runway')}
              title="Runway Spotlight"
              className={`p-1.5 rounded-lg text-xs transition ${
                lightingAtmosphere === 'runway' ? 'bg-white dark:bg-black text-amber-500 shadow-sm' : 'text-slate-500'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setLightingAtmosphere('neon')}
              title="Cyber Neon Rim"
              className={`p-1.5 rounded-lg text-xs transition ${
                lightingAtmosphere === 'neon' ? 'bg-white dark:bg-black text-pink-500 shadow-sm' : 'text-slate-500'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Wind Wave Toggle */}
          <button
            onClick={() => setIsWaving(!isWaving)}
            className={`p-2 rounded-xl text-xs font-bold transition flex items-center space-x-1 ${
              isWaving ? 'bg-[#AC7900]/15 text-[#AC7900] dark:text-[#D4AF37]' : 'bg-black/5 dark:bg-white/5 text-slate-500'
            }`}
            title="Toggle Cloth Wave Motion"
          >
            <Wind className="w-3.5 h-3.5 animate-pulse" />
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-xl bg-black/5 dark:bg-white/5 text-slate-500 hover:text-black dark:hover:text-white transition"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* 2. Interactive High-Res Canvas Viewport */}
      <div className="relative flex-1 bg-[#FAF7EE] dark:bg-[#0B0C0B] flex items-center justify-center p-4 min-h-[380px] sm:min-h-[460px]">
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          className="w-full max-w-[620px] aspect-[4/3] rounded-2xl shadow-xl object-contain border border-black/10 dark:border-white/10"
        />

        {/* Live Specular & Quality Badges */}
        <div className="absolute top-6 left-6 flex flex-col gap-1.5 pointer-events-none">
          <span className="px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md text-white text-[10px] font-bold shadow-lg uppercase tracking-wider flex items-center space-x-1">
            <Sparkles className="w-3 h-3 text-[#D4AF37]" />
            <span>3D {MODES_CONFIG.find((m) => m.id === currentMode)?.label}</span>
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-white/90 dark:bg-black/90 backdrop-blur-sm text-[9px] font-bold border border-black/10 dark:border-white/10 text-slate-700 dark:text-slate-300">
            {product.category} · {textureFinish.replace('_', ' ')}
          </span>
        </div>
      </div>

      {/* 3. Bottom Specs Footer Bar */}
      <div className="p-3 bg-white dark:bg-[#161716] border-t border-black/5 dark:border-white/5 flex items-center justify-between text-xs text-slate-500">
        <span>300 DPI Reactive Ink Simulation</span>
        <span className="font-bold text-[#AC7900] dark:text-[#D4AF37]">
          {product.width} Width · {product.gsm} GSM
        </span>
      </div>
    </div>
  );
};

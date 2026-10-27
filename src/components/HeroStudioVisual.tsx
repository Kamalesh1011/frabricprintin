import React, { Suspense, lazy, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Move3d, Move } from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// HeroStudioVisual — "Design in 3D on your phone" hero stage (Phase 1)
//
// LCP-first: the instant static render shows immediately (identical to the
// previous hero image), and THEN the interactive react-three draped-cloth
// studio hydrates in-place after the page paints and the main thread is idle.
// three.js arrives through the same lazy 'three' chunk used by the studio
// pages — it is never part of the eager entry bundle (verified via the
// modulepreload list after each build).
//
// Reduced-motion, low-core and low-memory devices keep the fast static render.
// ─────────────────────────────────────────────────────────────────────────────

// Lazy boundary: pulling three.js into the eager graph from HomePage is exactly
// what we must avoid — this is the ONLY reference to the canvas module.
const LazyClothStudio = lazy(() =>
  import('./Fabric3DStudioCanvas').then((m) => ({ default: m.Fabric3DClothStudio }))
);

export type HeroMaterial3DType = 'modal_satin' | 'cotton_cambric' | 'silk_organza' | 'french_linen';

export interface HeroStudioMaterial {
  /** Static render shown instantly (fallback layer under / instead of WebGL) */
  image: string;
  name: string;
  specs: string;
  patternName: string;
  wholesalePrice: number;
  /** Pattern applied as the printed artwork on the 3D cloth */
  design3d: string;
  baseColor: string;
  material3d?: HeroMaterial3DType;
  repeat3d?: 'grid' | 'drop' | 'brick' | 'mirror' | 'centered';
  scale3d?: number;
}

interface HeroStudioVisualProps {
  heroTab: string;
  material: HeroStudioMaterial;
}

/** Should this browser hydrate the 3D stage at all? */
function canHydrate3D(): boolean {
  if (typeof window === 'undefined') return false;
  // Respect reduced-motion users: keep the calm static render.
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return false;
  // Skip very low-end engines (2 or fewer logical cores, tiny device memory).
  const cores = navigator.hardwareConcurrency ?? 4;
  if (cores <= 2) return false;
  const deviceMemory = (navigator as { deviceMemory?: number }).deviceMemory;
  if (typeof deviceMemory === 'number' && deviceMemory <= 2) return false;
  return true;
}

type StageState = 'idle' | 'hydrating' | 'ready';

export const HeroStudioVisual: React.FC<HeroStudioVisualProps> = ({ heroTab, material }) => {
  const [stage3d, setStage3d] = useState<StageState>('idle');
  const isCoarse = typeof window !== 'undefined' && window.matchMedia?.('(pointer: coarse)').matches;

  useEffect(() => {
    if (!canHydrate3D()) return;
    let cancelled = false;
    let settleTimer: number | undefined;
    let idleId: number | undefined;

    // Wait for (a) document visible, (b) idle main thread or 1.2s, then (c) a
    // small extra settle so LCP is never contested by the WebGL chunk fetch.
    const kick = () => {
      if (cancelled || document.hidden) return;
      settleTimer = window.setTimeout(() => {
        if (!cancelled) setStage3d((s) => (s === 'idle' ? 'hydrating' : s));
      }, 900);
    };

    const schedule = () => {
      const ric = (window as { requestIdleCallback?: (cb: () => void) => number }).requestIdleCallback;
      if (ric) {
        idleId = ric(() => kick());
      } else {
        settleTimer = window.setTimeout(kick, 1200);
      }
    };

    schedule();

    return () => {
      cancelled = true;
      if (settleTimer) clearTimeout(settleTimer);
      if (idleId !== undefined) {
        (window as { cancelIdleCallback?: (id: number) => void }).cancelIdleCallback?.(idleId);
      }
    };
  }, []);

  const isReady = stage3d !== 'idle';
  const m3d = material.material3d ?? 'modal_satin';

  return (
    <div className="relative aspect-[4/3] rounded-[24px] overflow-hidden bg-[#F3F0E8] dark:bg-[#222422]">
      {/* ── Layer 1: Instant static render (the LCP image) ── */}
      <AnimatePresence mode="wait">
        <motion.img
          key={heroTab}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.3 }}
          src={material.image}
          alt={material.name}
          className="w-full h-full object-cover animate-cloth-drape select-none"
          loading="eager"
          decoding="async"
        />
      </AnimatePresence>

      {/* ── Layer 2: Interactive 3D studio (hydrated only after idle) ── */}
      {isReady && (
        <div
          className="absolute inset-0"
          style={{
            opacity: stage3d === 'ready' ? 1 : 0,
            transition: 'opacity 700ms ease',
            pointerEvents: stage3d === 'ready' ? 'auto' : 'none',
          }}
          aria-hidden={stage3d !== 'ready'}
        >
          {/* Static render stays visible underneath while the chunk fetches */}
          <Suspense fallback={null}>
            <Stage3D
              material={material}
              m3d={m3d}
              onMounted={() => setStage3d((s) => (s === 'ready' ? s : 'ready'))}
            />
          </Suspense>
        </div>
      )}

      {/* ── Hydration chip (small, non-blocking, gone once 3D is live) ── */}
      {stage3d === 'hydrating' && (
        <div className="absolute bottom-3 left-3 z-20 flex items-center gap-2 bg-black/70 backdrop-blur-md text-white text-[10px] sm:text-[11px] font-bold px-3 py-1.5 rounded-full shadow-md animate-in fade-in duration-300">
          <span className="w-3 h-3 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
          Loading 3D studio…
        </div>
      )}

      {/* ── Drag affordance (reel-style "touch it" cue) ── */}
      {stage3d === 'ready' && (
        <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 bg-white/85 dark:bg-black/70 backdrop-blur-md text-[#0F100F] dark:text-white text-[10px] sm:text-[11px] font-bold px-2.5 py-1 rounded-full border border-black/5 dark:border-white/10 shadow-sm pointer-events-none animate-in fade-in slide-in-from-left-2 duration-500">
          {isCoarse ? (
            <>
              <Move className="w-3 h-3 text-[#AC7900] dark:text-[#D4AF37]" />
              Drag to spin • Pinch to zoom
            </>
          ) : (
            <>
              <Move3d className="w-3 h-3 text-[#AC7900] dark:text-[#D4AF37]" />
              Drag to rotate the cloth
            </>
          )}
        </div>
      )}

      {/* ── Caption overlay (poster framing, sits above both layers) ── */}
      <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end p-5 text-white">
        <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">
          {material.patternName}
        </span>
        <span className="text-sm font-black font-editorial">
          {material.name} ({material.specs})
        </span>
      </div>
    </div>
  );
};

/**
 * Mounted-3D wrapper: flips the parent's cross-fade only after the canvas has
 * had time to render its first frames.
 */
const Stage3D: React.FC<{
  material: HeroStudioMaterial;
  m3d: HeroMaterial3DType;
  onMounted: () => void;
}> = ({ material, m3d, onMounted }) => {
  useEffect(() => {
    // First meaningful frame of the draped cloth; small delay covers shader
    // compile + first texture generation.
    const t = window.setTimeout(onMounted, 700);
    return () => clearTimeout(t);
  }, [onMounted]);

  return (
    <LazyClothStudio
      mode={'draped_cloth'}
      designUrl={material.design3d}
      fabricImageUrl={material.image}
      repeatMode={material.repeat3d ?? 'drop'}
      scalePercentage={material.scale3d ?? 60}
      rotationAngle={0}
      offsetX={0}
      offsetY={0}
      baseColor={material.baseColor}
      materialType={m3d}
      lightingAtmosphere="studio_softbox"
      cameraPreset="perspective"
      isWaving
      isAutoRotate={!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches}
      compareMode="printed"
      textureIntensity={65}
    />
  );
};

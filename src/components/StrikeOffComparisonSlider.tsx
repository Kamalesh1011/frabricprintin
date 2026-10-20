import React, { useState, useRef, useCallback } from 'react';
import { Sparkles, ArrowLeftRight, CheckCircle2, ShieldCheck } from 'lucide-react';

interface StrikeOffComparisonSliderProps {
  beforeImage?: string;
  afterImage?: string;
  fabricName?: string;
}

export const StrikeOffComparisonSlider: React.FC<StrikeOffComparisonSliderProps> = ({
  beforeImage = 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=1000',
  afterImage = 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&q=80&w=1000',
  fabricName = 'Mulberry Silk Crepe (16 Momme)'
}) => {
  const [sliderPos, setSliderPos] = useState<number>(50);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(percentage);
  }, []);

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches[0]) {
      handleMove(e.touches[0].clientX);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      handleMove(e.clientX);
    }
  };

  return (
    <div className="bg-white dark:bg-[#1A1C1A] rounded-[35px] border border-[#ECECEC] dark:border-white/[0.08] p-6 sm:p-10 shadow-fabriclore space-y-6 text-[#0F100F] dark:text-white transition-colors duration-300">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#ECECEC] dark:border-white/[0.08] pb-6">
        <div className="space-y-1.5">
          <div className="inline-flex items-center space-x-2 text-xs font-bold text-[#AC7900] dark:text-[#D4AF37] uppercase tracking-wider font-editorial">
            <Sparkles className="w-4 h-4" />
            <span>Strike-Off Verification Technology</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black font-editorial">
            Unprinted RFD Base vs. 300 DPI Reactive Print
          </h3>
          <p className="text-xs text-[#8A8883] dark:text-gray-400 max-w-xl">
            Drag the slider to inspect the ink penetration, color intensity, and fiber weave clarity on <strong>{fabricName}</strong>.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3.5 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-800 shrink-0">
          <ShieldCheck className="w-4 h-4" />
          <span>OEKO-TEX 100 Non-Fading Color Lock</span>
        </div>
      </div>

      {/* Draggable Split Screen Frame */}
      <div
        ref={containerRef}
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        className="relative aspect-[16/9] sm:aspect-[21/9] w-full rounded-[28px] overflow-hidden select-none cursor-ew-resize border border-[#ECECEC] dark:border-white/[0.1] bg-[#F3F0E8] dark:bg-[#121312] shadow-sm"
      >
        {/* AFTER IMAGE (Underneath Layer: 300 DPI Reactive Print) */}
        <img
          src={afterImage}
          alt="300 DPI Reactive Print"
          className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
        />

        {/* AFTER BADGE */}
        <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-md text-white text-xs font-bold px-3.5 py-1.5 rounded-full z-10 shadow-md flex items-center space-x-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>300 DPI Reactive Steam Print</span>
        </div>

        {/* BEFORE IMAGE (Clipped Layer: Raw Unprinted RFD Base Fabric) */}
        <div
          className="absolute inset-0 overflow-hidden select-none pointer-events-none"
          style={{ width: `${sliderPos}%` }}
        >
          <img
            src={beforeImage}
            alt="Raw RFD Unprinted Base"
            className="absolute inset-0 w-full h-full object-cover filter contrast-75 brightness-110 saturate-50 select-none"
            style={{ width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100%', maxWidth: 'none' }}
          />
          {/* Subtle unprinted weave overlay */}
          <div className="absolute inset-0 bg-white/20 backdrop-blur-[0.5px]" />
        </div>

        {/* BEFORE BADGE */}
        <div className="absolute top-4 left-4 bg-white/90 dark:bg-black/80 backdrop-blur-md text-[#0F100F] dark:text-white text-xs font-bold px-3.5 py-1.5 rounded-full z-10 shadow-md border border-black/5 dark:border-white/10">
          Raw RFD Base Fabric (Ready for Dye)
        </div>

        {/* DIVIDER LINE & HANDLE */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-white shadow-2xl z-20 pointer-events-none"
          style={{ left: `${sliderPos}%` }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white text-[#0F100F] shadow-2xl border-2 border-[#AC7900] flex items-center justify-center pointer-events-auto cursor-ew-resize group hover:scale-110 transition-transform">
            <ArrowLeftRight className="w-4 h-4 text-[#AC7900]" />
          </div>
        </div>

        {/* Bottom Hint */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-md text-white text-[11px] font-semibold px-4 py-1 rounded-full pointer-events-none z-10">
          ↔ Drag to Compare Clarity & Fiber Penetration
        </div>

      </div>

      {/* Specifications Footer */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
        <div className="bg-[#F9F6ED] dark:bg-[#242624] p-3 rounded-2xl border border-[#ECECEC] dark:border-white/[0.08] flex items-center space-x-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span><strong>Zero Surface Cracking:</strong> Dyes bond deep into natural fibers</span>
        </div>
        <div className="bg-[#F9F6ED] dark:bg-[#242624] p-3 rounded-2xl border border-[#ECECEC] dark:border-white/[0.08] flex items-center space-x-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span><strong>Bio-Washed Silk Touch:</strong> Retains 100% natural soft hand feel</span>
        </div>
        <div className="bg-[#F9F6ED] dark:bg-[#242624] p-3 rounded-2xl border border-[#ECECEC] dark:border-white/[0.08] flex items-center space-x-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span><strong>4.5/5 Colorfastness:</strong> Washing, rubbing & sunlight verified</span>
        </div>
      </div>

    </div>
  );
};

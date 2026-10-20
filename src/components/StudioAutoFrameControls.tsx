import React from 'react';
import {
  Sparkles,
  Maximize,
  Minimize,
  Sliders,
  Wand2,
  Download,
  AlertCircle,
  CheckCircle2,
  Palette,
  Crosshair,
  ShieldCheck
} from 'lucide-react';

export type AutoFramePreset = 'center_fit' | 'pocket_left' | 'oversized_full' | 'back_arch' | 'repeat_tile';

interface StudioAutoFrameControlsProps {
  onApplyPreset: (preset: AutoFramePreset) => void;
  onRemoveBackground?: () => void;
  isTransparentBg?: boolean;
  dpi: number;
  onExportMockup?: () => void;
  extractedColors?: string[];
  activePlacement?: string;
}

export const StudioAutoFrameControls: React.FC<StudioAutoFrameControlsProps> = ({
  onApplyPreset,
  onRemoveBackground,
  isTransparentBg = false,
  dpi = 300,
  onExportMockup,
  extractedColors = ['#0F100F', '#AC7900', '#D4AF37', '#E5E5E5'],
  activePlacement
}) => {
  const getDpiQualityBadge = () => {
    if (dpi >= 300) {
      return (
        <span className="flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
          <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
          <span>{dpi} DPI · Crisp Print Ready</span>
        </span>
      );
    } else if (dpi >= 150) {
      return (
        <span className="flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
          <AlertCircle className="w-3 h-3 text-amber-600 dark:text-amber-400" />
          <span>{dpi} DPI · Good Standard</span>
        </span>
      );
    } else {
      return (
        <span className="flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/20">
          <AlertCircle className="w-3 h-3 text-rose-600 dark:text-rose-400" />
          <span>{dpi} DPI · Low Resolution Warn</span>
        </span>
      );
    }
  };

  return (
    <div className="bg-white/80 dark:bg-[#161716]/80 backdrop-blur-md rounded-2xl p-3.5 border border-black/10 dark:border-white/10 shadow-sm space-y-3">
      {/* Top Header: Auto-Frame & DPI Sentinel */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1.5">
          <Wand2 className="w-3.5 h-3.5 text-[#AC7900] dark:text-[#D4AF37]" />
          <span className="text-xs font-bold text-black dark:text-white uppercase tracking-wider font-editorial">
            Smart Auto-Frame & DPI Engine
          </span>
        </div>
        {getDpiQualityBadge()}
      </div>

      {/* 1-Click Auto-Framing Presets */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <button
          type="button"
          onClick={() => onApplyPreset('center_fit')}
          className="px-2.5 py-2 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-[#AC7900]/10 hover:border-[#AC7900]/30 border border-black/5 dark:border-white/5 text-[11px] font-bold transition flex items-center justify-center space-x-1.5 text-center group"
        >
          <Crosshair className="w-3 h-3 text-[#AC7900] group-hover:scale-110 transition" />
          <span>Auto-Center</span>
        </button>

        <button
          type="button"
          onClick={() => onApplyPreset('pocket_left')}
          className="px-2.5 py-2 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-[#AC7900]/10 hover:border-[#AC7900]/30 border border-black/5 dark:border-white/5 text-[11px] font-bold transition flex items-center justify-center space-x-1.5 text-center group"
        >
          <Minimize className="w-3 h-3 text-[#AC7900] group-hover:scale-110 transition" />
          <span>Pocket / Crest Snap</span>
        </button>

        <button
          type="button"
          onClick={() => onApplyPreset('oversized_full')}
          className="px-2.5 py-2 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-[#AC7900]/10 hover:border-[#AC7900]/30 border border-black/5 dark:border-white/5 text-[11px] font-bold transition flex items-center justify-center space-x-1.5 text-center group"
        >
          <Maximize className="w-3 h-3 text-[#AC7900] group-hover:scale-110 transition" />
          <span>Oversized Fit</span>
        </button>

        <button
          type="button"
          onClick={() => onApplyPreset('back_arch')}
          className="px-2.5 py-2 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-[#AC7900]/10 hover:border-[#AC7900]/30 border border-black/5 dark:border-white/5 text-[11px] font-bold transition flex items-center justify-center space-x-1.5 text-center group"
        >
          <Sliders className="w-3 h-3 text-[#AC7900] group-hover:scale-110 transition" />
          <span>Back Arch</span>
        </button>
      </div>

      {/* Bottom Tools: AI Background Remover, Palette Extractor & 4K Export */}
      <div className="pt-2 border-t border-black/5 dark:border-white/5 flex flex-wrap items-center justify-between gap-2">
        {/* Palette Extraction */}
        {extractedColors && extractedColors.length > 0 && (
          <div className="flex items-center space-x-2">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center space-x-1">
              <Palette className="w-2.5 h-2.5" />
              <span>Palette:</span>
            </span>
            <div className="flex items-center space-x-1">
              {extractedColors.slice(0, 5).map((color, idx) => (
                <div
                  key={idx}
                  title={color}
                  style={{ backgroundColor: color }}
                  className="w-3.5 h-3.5 rounded-full border border-black/10 dark:border-white/20 shadow-sm cursor-pointer hover:scale-125 transition-transform"
                />
              ))}
            </div>
          </div>
        )}

        {/* AI Background Transparency Switcher */}
        {onRemoveBackground && (
          <button
            type="button"
            onClick={onRemoveBackground}
            className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition flex items-center space-x-1.5 ${
              isTransparentBg
                ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                : 'bg-black/5 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-black/10'
            }`}
          >
            <Sparkles className="w-3 h-3 text-[#AC7900] dark:text-[#D4AF37]" />
            <span>{isTransparentBg ? 'Background Removed' : 'Remove Solid BG'}</span>
          </button>
        )}

        {/* 4K Tech-Pack Mockup Export */}
        {onExportMockup && (
          <button
            type="button"
            onClick={onExportMockup}
            className="px-3 py-1.5 rounded-xl bg-[#0F100F] dark:bg-white text-white dark:text-[#0F100F] text-[11px] font-bold hover:opacity-90 transition flex items-center space-x-1 shadow-sm"
          >
            <Download className="w-3 h-3" />
            <span>Export 4K Mockup</span>
          </button>
        )}
      </div>
    </div>
  );
};

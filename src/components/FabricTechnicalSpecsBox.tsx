import React from 'react';
import { FileText, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Product, SizeOptionType } from '../types';

interface FabricTechnicalSpecsBoxProps {
  product: Product;
  selectedFabricVariant?: string;
  selectedSizeType: SizeOptionType;
  meters: number;
  layoutType?: string;
  quantity?: number;
  calculatedDpi?: number;
  scalePercentage?: number;
}

export const FabricTechnicalSpecsBox: React.FC<FabricTechnicalSpecsBoxProps> = ({
  product,
  selectedFabricVariant = 'Standard Mill Base',
  selectedSizeType,
  meters,
  layoutType = 'repeat_grid',
  quantity = 1,
  calculatedDpi = 300,
  scalePercentage = 100
}) => {
  const getDynamicGsm = () => {
    return `${product.gsm} GSM (Bio-Washed Finish)`;
  };

  const getDynamicSizeLabel = () => {
    if (selectedSizeType === 'swatch_test') {
      return 'Test Swatch 20 × 20 cm (0.04 m²)';
    }
    if (selectedSizeType === 'swatch_big') {
      return 'Big Swatch 75 × 100 cm (0.75 m²)';
    }
    const widthNum = parseInt(product.width.match(/\d+/)?.[0] || '112', 10);
    const approxSqMeters = ((meters * widthNum) / 100).toFixed(2);
    return `${meters} Linear Meter(s) (~${approxSqMeters} m² total)`;
  };

  const getDynamicLayoutLabel = () => {
    if (layoutType === 'single') return 'Single Centered Placement';
    if (layoutType === 'half_drop') return 'Half-Drop 50% Offset Repeat';
    if (layoutType === 'brick_repeat') return 'Brick Staggered Repeat';
    if (layoutType === 'mirror_repeat') return 'Mirror Symmetrical Repeat';
    return 'Seamless Grid Repeat';
  };

  return (
    <div className="bg-white dark:bg-[#1A1C1A] rounded-[28px] p-5 shadow-fabriclore border border-[#ECECEC] dark:border-white/[0.08] space-y-4 text-[#0F100F] dark:text-white transition-colors duration-300">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#ECECEC] dark:border-white/[0.08] pb-3">
        <div className="flex items-center space-x-2">
          <FileText className="w-4 h-4 text-[#AC7900] dark:text-[#D4AF37]" />
          <h4 className="font-bold text-xs uppercase tracking-wider text-[#0F100F] dark:text-white font-editorial">
            Technical Fabric Specifications
          </h4>
        </div>
        <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800 flex items-center space-x-1">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          <span>Verified Mill Base</span>
        </span>
      </div>

      {/* Grid of Specifications */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
        <div className="bg-[#F9F6ED] dark:bg-[#242624] p-2.5 rounded-2xl border border-[#ECECEC] dark:border-white/[0.08]">
          <span className="text-[10px] text-[#8A8883] dark:text-gray-400 uppercase tracking-wider block">Fiber Category</span>
          <span className="font-bold block truncate">{product.category}</span>
        </div>

        <div className="bg-[#F9F6ED] dark:bg-[#242624] p-2.5 rounded-2xl border border-[#ECECEC] dark:border-white/[0.08]">
          <span className="text-[10px] text-[#8A8883] dark:text-gray-400 uppercase tracking-wider block">GSM Weight</span>
          <span className="font-bold block truncate text-[#AC7900] dark:text-[#D4AF37]">{getDynamicGsm()}</span>
        </div>

        <div className="bg-[#F9F6ED] dark:bg-[#242624] p-2.5 rounded-2xl border border-[#ECECEC] dark:border-white/[0.08]">
          <span className="text-[10px] text-[#8A8883] dark:text-gray-400 uppercase tracking-wider block">Usable Width</span>
          <span className="font-bold block truncate">{product.width}</span>
        </div>

        <div className="bg-[#F9F6ED] dark:bg-[#242624] p-2.5 rounded-2xl border border-[#ECECEC] dark:border-white/[0.08]">
          <span className="text-[10px] text-[#8A8883] dark:text-gray-400 uppercase tracking-wider block">Yarn Count</span>
          <span className="font-bold block truncate">{product.count}</span>
        </div>

        <div className="bg-[#F9F6ED] dark:bg-[#242624] p-2.5 rounded-2xl border border-[#ECECEC] dark:border-white/[0.08]">
          <span className="text-[10px] text-[#8A8883] dark:text-gray-400 uppercase tracking-wider block">Base RFD Color</span>
          <div className="flex items-center space-x-1.5 font-bold">
            <span
              className="w-3 h-3 rounded-full border border-gray-300 shrink-0"
              style={{ backgroundColor: product.colorCode || '#ddd' }}
            />
            <span className="truncate">{product.color}</span>
          </div>
        </div>

        <div className="bg-[#F9F6ED] dark:bg-[#242624] p-2.5 rounded-2xl border border-[#ECECEC] dark:border-white/[0.08]">
          <span className="text-[10px] text-[#8A8883] dark:text-gray-400 uppercase tracking-wider block">Weave Type</span>
          <span className="font-bold block truncate">{product.weave_type}</span>
        </div>

        <div className="bg-[#F9F6ED] dark:bg-[#242624] p-2.5 rounded-2xl border border-[#ECECEC] dark:border-white/[0.08] sm:col-span-2">
          <span className="text-[10px] text-[#8A8883] dark:text-gray-400 uppercase tracking-wider block">Selected Size / Length</span>
          <span className="font-bold block truncate text-[#0F100F] dark:text-white">{getDynamicSizeLabel()}</span>
        </div>

        <div className="bg-[#F9F6ED] dark:bg-[#242624] p-2.5 rounded-2xl border border-[#ECECEC] dark:border-white/[0.08]">
          <span className="text-[10px] text-[#8A8883] dark:text-gray-400 uppercase tracking-wider block">Pattern Layout</span>
          <span className="font-bold block truncate">{getDynamicLayoutLabel()}</span>
        </div>

        <div className="bg-[#F9F6ED] dark:bg-[#242624] p-2.5 rounded-2xl border border-[#ECECEC] dark:border-white/[0.08] sm:col-span-3">
          <span className="text-[10px] text-[#8A8883] dark:text-gray-400 uppercase tracking-wider block">Fiber Composition</span>
          <span className="font-bold block truncate">{product.composition}</span>
        </div>
      </div>

    </div>
  );
};

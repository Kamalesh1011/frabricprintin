import React, { useState } from 'react';
import { Calculator, Sparkles, ArrowRight, ShieldCheck, CheckCircle2, TrendingUp, Percent } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SpotlightCard } from './ui/spotlight-card';
import { NumberTicker } from './ui/number-ticker';
import { ShimmerButton } from './ui/shimmer-button';
import { AnimatedBadge } from './ui/animated-badge';

interface WholesaleSavingsCalculatorProps {
  onOpenBulkInquiry: () => void;
}

export const WholesaleSavingsCalculator: React.FC<WholesaleSavingsCalculatorProps> = ({
  onOpenBulkInquiry
}) => {
  const [meters, setMeters] = useState<number>(250);
  const [selectedQuality, setSelectedQuality] = useState<'Cotton' | 'Silk' | 'Linen' | 'Modal'>('Cotton');

  // Base Prices per meter
  const BASE_PRICES = {
    'Cotton': 220,
    'Silk': 450,
    'Linen': 480,
    'Modal': 290
  };

  const baseRate = BASE_PRICES[selectedQuality];

  // Calculate Discount Tier Percentage
  let discountPercent = 0;
  let tierLabel = 'Sampling';
  if (meters >= 500) {
    discountPercent = 25;
    tierLabel = 'Tier 3 (Super Bulk)';
  } else if (meters >= 200) {
    discountPercent = 20;
    tierLabel = 'Tier 2 (Wholesale)';
  } else if (meters >= 100) {
    discountPercent = 15;
    tierLabel = 'Tier 1 (Studio)';
  } else if (meters >= 50) {
    discountPercent = 10;
    tierLabel = 'Sampling Plus';
  } else if (meters >= 20) {
    discountPercent = 5;
    tierLabel = 'Micro Batch';
  }

  const standardTotal = baseRate * meters;
  const discountedRate = Math.round(baseRate * (1 - discountPercent / 100));
  const discountedTotal = discountedRate * meters;
  const totalSavings = standardTotal - discountedTotal;

  return (
    <SpotlightCard
      spotlightColor="rgba(172, 121, 0, 0.15)"
      className="p-6 sm:p-10 shadow-fabriclore space-y-8 text-[#0F100F] dark:text-white transition-colors duration-300 border-black/[0.08] dark:border-white/[0.08]"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-black/[0.06] dark:border-white/[0.08] pb-6">
        <div className="space-y-1.5">
          <AnimatedBadge variant="gold" icon={<Calculator className="w-3.5 h-3.5" />}>
            Direct Mill Volume Calculator
          </AnimatedBadge>
          <h3 className="text-2xl sm:text-3xl font-black font-editorial tracking-tight">
            Calculate Your Wholesale Mill Savings
          </h3>
          <p className="text-xs sm:text-sm text-[#71717A] dark:text-[#A1A1AA] max-w-xl">
            See how much your studio saves by printing directly from our Surat rotary & high-speed digital printing facility.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-semibold text-[#AC7900] dark:text-[#D4AF37] bg-[#AC7900]/10 px-3.5 py-1.5 rounded-full border border-[#AC7900]/20 shrink-0">
          <Percent className="w-4 h-4 animate-spin-slow" />
          <span>Up to 25% Factory Direct Discount</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Column: Interactive Controls */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* 1. Fabric Quality Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-bold font-editorial uppercase tracking-wider text-slate-500">
              1. Select Fabric Base Quality:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['Cotton', 'Silk', 'Linen', 'Modal'] as const).map((qual) => (
                <motion.button
                  key={qual}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedQuality(qual)}
                  className={`py-2.5 px-3 rounded-2xl text-xs font-bold transition-all border ${
                    selectedQuality === qual
                      ? 'bg-[#0F100F] dark:bg-white text-white dark:text-[#0F100F] border-transparent shadow-md'
                      : 'bg-white dark:bg-[#1A1C1A] text-[#0F100F] dark:text-white border-black/10 dark:border-white/10 hover:border-[#AC7900]'
                  }`}
                >
                  {qual}
                </motion.button>
              ))}
            </div>
          </div>

          {/* 2. Meterage Slider */}
          <div className="space-y-3 bg-white dark:bg-[#1A1C1A] p-5 rounded-[24px] border border-black/[0.06] dark:border-white/[0.08] shadow-sm">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold font-editorial text-[#0F100F] dark:text-white">
                2. Required Production Volume:
              </label>
              <span className="text-lg font-black font-editorial text-[#AC7900] dark:text-[#D4AF37]">
                <NumberTicker value={meters} suffix=" Meters" />
              </span>
            </div>

            <div className="relative pt-2">
              <input
                type="range"
                min="20"
                max="2000"
                step="10"
                value={meters}
                onChange={(e) => setMeters(Number(e.target.value))}
                className="w-full h-2.5 bg-[#F3F0E8] dark:bg-[#2A2C2A] rounded-lg appearance-none cursor-pointer accent-[#AC7900]"
              />
            </div>

            {/* Tier Indicator Chips */}
            <div className="grid grid-cols-4 gap-1.5 pt-2 text-center text-[10px]">
              {[
                { label: '20m', tier: '5%' },
                { label: '100m', tier: '15%' },
                { label: '200m', tier: '20%' },
                { label: '500m+', tier: '25%' },
              ].map((m, idx) => (
                <div
                  key={idx}
                  className={`py-1 rounded-lg font-semibold transition ${
                    (idx === 0 && meters >= 20 && meters < 100) ||
                    (idx === 1 && meters >= 100 && meters < 200) ||
                    (idx === 2 && meters >= 200 && meters < 500) ||
                    (idx === 3 && meters >= 500)
                      ? 'bg-[#AC7900]/15 text-[#AC7900] dark:text-[#D4AF37] border border-[#AC7900]/30 font-bold'
                      : 'text-slate-400 bg-black/[0.02] dark:bg-white/[0.02]'
                  }`}
                >
                  <div>{m.label}</div>
                  <div className="text-[9px] opacity-80">-{m.tier}</div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Live Savings Result Card */}
        <div className="lg:col-span-6 bg-gradient-to-br from-[#141514] via-[#0F100F] to-[#1A1C1A] text-white rounded-[32px] p-6 sm:p-8 shadow-2xl space-y-6 border border-white/10 relative overflow-hidden">
          
          {/* Subtle amber ambient glow */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#D4AF37]/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex items-center justify-between border-b border-white/[0.1] pb-4">
            <div>
              <span className="text-xs text-gray-400 block font-medium">Applied Volume Discount ({tierLabel})</span>
              <span className="text-2xl font-black font-editorial text-[#D4AF37] flex items-center gap-1.5">
                <NumberTicker value={discountPercent} suffix="% OFF" />
                <span className="text-xs font-normal text-slate-300">Factory Direct</span>
              </span>
            </div>
            <div className="p-3 bg-white/[0.08] rounded-2xl border border-white/[0.1] backdrop-blur-md">
              <TrendingUp className="w-6 h-6 text-emerald-400 animate-pulse" />
            </div>
          </div>

          <div className="relative z-10 grid grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <span className="text-gray-400">Standard Retail Rate:</span>
              <p className="font-bold text-gray-300 line-through">₹{baseRate}.00 /m</p>
            </div>
            <div className="space-y-1">
              <span className="text-[#D4AF37] font-semibold">Your Discounted Mill Rate:</span>
              <p className="font-black text-sm text-emerald-400">₹{discountedRate}.00 /m</p>
            </div>
          </div>

          {/* Total Savings Highlight */}
          <motion.div
            layout
            className="relative z-10 bg-white/[0.06] rounded-2xl p-4 border border-white/[0.1] flex items-center justify-between backdrop-blur-md"
          >
            <div>
              <span className="text-xs text-gray-300 block">Total Estimated Savings</span>
              <span className="text-xl sm:text-2xl font-black font-editorial text-emerald-400">
                <NumberTicker value={totalSavings} prefix="₹" suffix=".00" />
              </span>
            </div>
            <span className="text-xs text-gray-300 bg-white/10 px-2.5 py-1 rounded-full border border-white/10">
              {meters}m {selectedQuality}
            </span>
          </motion.div>

          {/* Bulk CTA */}
          <div className="relative z-10">
            <ShimmerButton
              onClick={onOpenBulkInquiry}
              className="w-full text-xs font-bold py-3.5"
            >
              <span>Request Factory Proforma for {meters}m</span>
              <ArrowRight className="w-4 h-4" />
            </ShimmerButton>
          </div>

        </div>

      </div>

    </SpotlightCard>
  );
};


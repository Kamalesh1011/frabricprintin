import React, { useState } from 'react';
import { Layers, CheckCircle2, ArrowRight, Sparkles, Scale, Eye, Activity, ShieldCheck } from 'lucide-react';
import { Product } from '../types';

interface FabricComparisonMatrixProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

interface FabricSpecData {
  category: string;
  gsmRange: string;
  transparency: string;
  drapeFlow: string;
  breathability: string;
  recommendedGarments: string[];
  careInstructions: string;
  bestFor: string;
}

const FABRIC_SPECS_GUIDE: Record<string, FabricSpecData> = {
  'Cotton': {
    category: '100% Organic & Cambric Cotton',
    gsmRange: '70 – 140 GSM',
    transparency: 'Semi-Sheer to Opaque',
    drapeFlow: 'Medium Crisp & Structured',
    breathability: 'Very High (100% Breathable)',
    recommendedGarments: ['Summer Kurtis', 'Casual Shirts', 'Lounge Sets', 'Kids Wear'],
    careInstructions: 'Machine wash cold with mild detergent',
    bestFor: 'Daily wear, high ink absorption, ultra-soft bio-wash hand feel'
  },
  'Silk': {
    category: 'Mulberry Silk Crepe & Satin',
    gsmRange: '60 – 110 GSM (14–18 Momme)',
    transparency: 'Opaque with Lustrous Sheen',
    drapeFlow: 'Ultra-Fluid & Cascading',
    breathability: 'High (Natural Protein Fiber)',
    recommendedGarments: ['Evening Gowns', 'Designer Sarees', 'Luxury Kaftans', 'Scarves'],
    careInstructions: 'Dry clean recommended or delicate hand wash',
    bestFor: 'Vibrant color saturation, luxury drape, royal occasions'
  },
  'Linen': {
    category: 'French Flax Pure Linen',
    gsmRange: '130 – 180 GSM',
    transparency: 'Subtle Slub Texture / Opaque',
    drapeFlow: 'Structured with Softening Fall',
    breathability: 'Maximum (Thermo-regulating)',
    recommendedGarments: ['Resort Shirts', 'Trousers', 'Co-ord Sets', 'Home Decor'],
    careInstructions: 'Gentle wash, press while damp for crisp finish',
    bestFor: 'Earthy luxury aesthetic, high tensile strength, timeless slub texture'
  },
  'Modal': {
    category: 'Bio-Cellulosic Modal Satin',
    gsmRange: '90 – 120 GSM',
    transparency: 'Opaque with Silky Luster',
    drapeFlow: 'High Drape & Supple Body',
    breathability: 'High (Micro-Cellulose)',
    recommendedGarments: ['Fusion Tunics', 'Flowing Dresses', 'Dupattas', 'Nightwear'],
    careInstructions: 'Gentle machine wash with color-safe detergent',
    bestFor: 'Silky alternative with high color brilliance and zero pilling'
  },
  'Viscose': {
    category: 'Viscose Georgette & Crepe',
    gsmRange: '80 – 130 GSM',
    transparency: 'Semi-Sheer with Pebble Grain',
    drapeFlow: 'Heavy Falling & Flowy',
    breathability: 'Medium-High',
    recommendedGarments: ['Tiered Skirts', 'Anarkalis', 'Boho Blouses', 'Stoles'],
    careInstructions: 'Gentle wash in mesh bag, air dry flat',
    bestFor: 'Fluid movement, dramatic gathers, deep ink penetration'
  }
};

export const FabricComparisonMatrix: React.FC<FabricComparisonMatrixProps> = ({
  products,
  onSelectProduct
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Cotton');

  const activeSpec = FABRIC_SPECS_GUIDE[selectedCategory] || FABRIC_SPECS_GUIDE['Cotton'];

  const matchedProduct = products.find(
    (p) => p.category.toLowerCase() === selectedCategory.toLowerCase()
  ) || products[0];

  return (
    <div className="bg-white dark:bg-[#1A1C1A] rounded-[35px] border border-[#ECECEC] dark:border-white/[0.08] p-6 sm:p-10 shadow-fabriclore space-y-8 text-[#0F100F] dark:text-white transition-colors duration-300">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#ECECEC] dark:border-white/[0.08] pb-6">
        <div className="space-y-1.5">
          <div className="inline-flex items-center space-x-2 text-xs font-bold text-[#AC7900] dark:text-[#D4AF37] uppercase tracking-wider font-editorial">
            <Scale className="w-4 h-4" />
            <span>Interactive Material Comparison Matrix</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black font-editorial">
            Compare Natural & Bio-Cellulosic Base Qualities
          </h3>
          <p className="text-xs text-[#8A8883] dark:text-gray-400 max-w-xl">
            Inspect GSM density, drape flow, transparency, and garment suitability before uploading artwork.
          </p>
        </div>

        {/* Category Switcher Tabs */}
        <div className="flex flex-wrap gap-2">
          {Object.keys(FABRIC_SPECS_GUIDE).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition shadow-xs ${
                selectedCategory === cat
                  ? 'bg-[#0F100F] dark:bg-white text-white dark:text-[#0F100F]'
                  : 'bg-[#F9F6ED] dark:bg-[#242624] text-[#0F100F] dark:text-white border border-[#ECECEC] dark:border-white/[0.08] hover:border-[#AC7900]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Comparison Detail Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Column: Visual Product Preview */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative aspect-[4/3] rounded-[28px] overflow-hidden bg-[#F3F0E8] dark:bg-[#222422] border border-[#ECECEC] dark:border-white/[0.08] shadow-sm group">
            <img
              src={matchedProduct?.images[0]}
              alt={matchedProduct?.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end p-5 text-white">
              <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">
                {matchedProduct?.name}
              </span>
              <span className="text-sm font-black">
                {activeSpec.category}
              </span>
            </div>
          </div>

          <button
            onClick={() => matchedProduct && onSelectProduct(matchedProduct)}
            className="w-full bg-[#0F100F] dark:bg-white text-white dark:text-[#0F100F] font-bold py-3 px-5 rounded-full text-xs hover:opacity-90 transition shadow-md flex items-center justify-center space-x-2"
          >
            <span>Customize {selectedCategory} in 3D Drape Studio</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Right Column: Key Technical Parameters */}
        <div className="lg:col-span-7 space-y-4 text-xs">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            
            {/* GSM & Weight */}
            <div className="bg-[#F9F6ED] dark:bg-[#242624] p-4 rounded-[22px] border border-[#ECECEC] dark:border-white/[0.08] space-y-1">
              <span className="text-[10px] text-[#8A8883] dark:text-gray-400 uppercase tracking-wider font-bold">
                GSM Density & Weight
              </span>
              <p className="font-bold text-sm text-[#AC7900] dark:text-[#D4AF37]">
                {activeSpec.gsmRange}
              </p>
              <p className="text-[11px] text-[#8A8883] dark:text-gray-400">
                Lightweight to medium-heavy balanced weave
              </p>
            </div>

            {/* Drape & Stiffness */}
            <div className="bg-[#F9F6ED] dark:bg-[#242624] p-4 rounded-[22px] border border-[#ECECEC] dark:border-white/[0.08] space-y-1">
              <span className="text-[10px] text-[#8A8883] dark:text-gray-400 uppercase tracking-wider font-bold">
                Drape & Fall Characteristic
              </span>
              <p className="font-bold text-sm text-[#0F100F] dark:text-white">
                {activeSpec.drapeFlow}
              </p>
              <p className="text-[11px] text-[#8A8883] dark:text-gray-400">
                Natural body with fluid movement
              </p>
            </div>

            {/* Transparency */}
            <div className="bg-[#F9F6ED] dark:bg-[#242624] p-4 rounded-[22px] border border-[#ECECEC] dark:border-white/[0.08] space-y-1">
              <span className="text-[10px] text-[#8A8883] dark:text-gray-400 uppercase tracking-wider font-bold">
                Transparency Level
              </span>
              <p className="font-bold text-sm text-[#0F100F] dark:text-white">
                {activeSpec.transparency}
              </p>
              <p className="text-[11px] text-[#8A8883] dark:text-gray-400">
                Optimal opacity for digital printing
              </p>
            </div>

            {/* Breathability */}
            <div className="bg-[#F9F6ED] dark:bg-[#242624] p-4 rounded-[22px] border border-[#ECECEC] dark:border-white/[0.08] space-y-1">
              <span className="text-[10px] text-[#8A8883] dark:text-gray-400 uppercase tracking-wider font-bold">
                Breathability & Skin Feel
              </span>
              <p className="font-bold text-sm text-emerald-600 dark:text-emerald-400">
                {activeSpec.breathability}
              </p>
              <p className="text-[11px] text-[#8A8883] dark:text-gray-400">
                Skin-friendly, hypoallergenic
              </p>
            </div>

          </div>

          {/* Recommended Garments */}
          <div className="bg-[#FEFBF1] dark:bg-[#222422] p-4 rounded-[22px] border border-[#ECECEC] dark:border-white/[0.08] space-y-2">
            <span className="text-[10px] text-[#AC7900] dark:text-[#D4AF37] uppercase tracking-wider font-bold">
              Recommended Garment & Design Applications:
            </span>
            <div className="flex flex-wrap gap-2">
              {activeSpec.recommendedGarments.map((garment, idx) => (
                <span
                  key={idx}
                  className="bg-white dark:bg-[#1A1C1A] text-[#0F100F] dark:text-white border border-[#ECECEC] dark:border-white/[0.1] px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1.5 shadow-xs"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{garment}</span>
                </span>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

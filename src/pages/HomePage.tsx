import React, { useState } from 'react';
import {
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Layers,
  Truck,
  Award,
  Globe,
  Palette,
  BookOpen,
  Search,
  CheckCircle2,
  Sliders,
  Scale,
  Zap,
  Star,
  Shirt,
  GraduationCap,
  Check,
  LayoutGrid,
  Cloud,
  Wind,
  Droplets,
  Waves
} from 'lucide-react';
import { Product, Category } from '../types';
import { FabricCard } from '../components/FabricCard';
import { SmartUrlImageExtractorModal } from '../components/SmartUrlImageExtractorModal';
import { SwatchBookOrderModal } from '../components/SwatchBookOrderModal';
import { FabricComparisonMatrix } from '../components/FabricComparisonMatrix';
import { StrikeOffComparisonSlider } from '../components/StrikeOffComparisonSlider';
import { ProductionPipelineSteps } from '../components/ProductionPipelineSteps';
import { DesignerLookbookSection } from '../components/DesignerLookbookSection';
import { WholesaleSavingsCalculator } from '../components/WholesaleSavingsCalculator';
import { APPAREL_PRODUCTS } from '../data/apparelData';
import { UNIFORM_PRODUCTS } from '../data/uniformData';
import { CUSTOM_MERCH_PRODUCTS } from '../data/customMerchData';
import { AnimatedBadge } from '../components/ui/animated-badge';
import { AnimatedTabs } from '../components/ui/animated-tabs';
import { HeroStudioVisual, type HeroStudioMaterial, type HeroMaterial3DType } from '../components/HeroStudioVisual';
import { NumberTicker } from '../components/ui/number-ticker';
import { Marquee } from '../components/ui/marquee';
import { SpotlightCard } from '../components/ui/spotlight-card';
import { ShimmerButton } from '../components/ui/shimmer-button';
import { PopularDesignsSection } from '../components/PopularDesignsSection';
import { PreloadedDesignModal } from '../components/PreloadedDesignModal';
import { WhatsAppOrderSection } from '../components/WhatsAppOrderSection';

interface HomePageProps {
  categories: Category[];
  products: Product[];
  onSelectCategory: (category: string) => void;
  onSelectProduct: (product: Product) => void;
  onGoToFabrics: () => void;
  onGoToApparel?: () => void;
  onGoToUniforms?: () => void;
  onGoToMerch?: () => void;
  onGoToAbout?: () => void;
  onOpenBulkInquiry: () => void;
}

interface HeroMaterialPreview {
  name: string;
  category: string;
  image: string;
  specs: string;
  wholesalePrice: number;
  patternName: string;
  /** Phase 1 "Studio hero" — data for the hydrated 3D draped-cloth stage */
  design3d: string;
  baseColor: string;
  material3d?: HeroMaterial3DType;
  repeat3d?: HeroStudioMaterial['repeat3d'];
}

const HERO_MATERIALS: Record<string, HeroMaterialPreview> = {
  'Silk': {
    name: 'Mulberry Silk Crepe',
    category: 'Silk',
    image: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&q=60&w=800',
    specs: '16 Momme • 44" Width • 300 DPI Reactive Print',
    wholesalePrice: 378,
    patternName: 'Royal Mughal Botanical Damask',
    design3d: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&q=60&w=500&h=500',
    baseColor: '#FAF5E9',
    material3d: 'silk_organza',
    repeat3d: 'drop'
  },
  'Cotton': {
    name: 'Organic Cotton Cambric 60s',
    category: 'Cotton',
    image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=60&w=800',
    specs: '95 GSM • 54" Usable Width • Bio-Washed',
    wholesalePrice: 180,
    patternName: 'Indigo Heritage Geometric Tile',
    design3d: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=60&w=500&h=500',
    baseColor: '#FBFBF7',
    material3d: 'cotton_cambric',
    repeat3d: 'grid'
  },
  'Linen': {
    name: 'French Flax Pure Linen',
    category: 'Linen',
    image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=60&w=800',
    specs: '140 GSM • 56" Width • Slub Texture',
    wholesalePrice: 420,
    patternName: 'Tropical Flora Leaf Motif',
    design3d: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=60&w=500&h=500',
    baseColor: '#F4F1E8',
    material3d: 'french_linen',
    repeat3d: 'drop'
  },
  'Modal': {
    name: 'Modal Satin Silk Luster',
    category: 'Modal',
    image: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&q=60&w=800',
    specs: '110 GSM • 44" Width • Ultra-Fluid Drape',
    wholesalePrice: 240,
    patternName: 'Fluid Watercolor Splash',
    design3d: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&q=60&w=500&h=500',
    baseColor: '#FAF7F1',
    material3d: 'modal_satin',
    repeat3d: 'mirror'
  }
};

// Lucide icon per fabric filter (hero tabs + category pills)
const FABRIC_FILTER_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  All: LayoutGrid,
  Silk: Sparkles,
  Cotton: Cloud,
  Linen: Wind,
  Modal: Droplets,
  Viscose: Waves,
};

export const HomePage: React.FC<HomePageProps> = ({
  categories,
  products,
  onSelectCategory,
  onSelectProduct,
  onGoToFabrics,
  onGoToApparel,
  onGoToUniforms,
  onGoToMerch,
  onGoToAbout,
  onOpenBulkInquiry
}) => {
  const [urlModalOpen, setUrlModalOpen] = useState<boolean>(false);
  const [swatchModalOpen, setSwatchModalOpen] = useState<boolean>(false);
  const [isPreloadedModalOpen, setIsPreloadedModalOpen] = useState<boolean>(false);
  const [activeFilterCategory, setActiveFilterCategory] = useState<string>('All');
  const [activeHeroTab, setActiveHeroTab] = useState<string>('Silk');

  const heroMat = HERO_MATERIALS[activeHeroTab] || HERO_MATERIALS['Silk'];

  const filteredBestselling = activeFilterCategory === 'All'
    ? products.slice(0, 6)
    : products.filter(p => p.category.toLowerCase() === activeFilterCategory.toLowerCase()).slice(0, 6);

  const activeMatchedProduct = products.find(
    (p) => p.category.toLowerCase() === activeHeroTab.toLowerCase()
  ) || products[0];

  return (
    <div className="space-y-10 sm:space-y-20 pb-16 transition-colors duration-300">

      {/* 🌾 1. HIGH-CONVERTING EDITORIAL HERO WITH REAL-TIME MATERIAL SWITCHER */}
      {/* 🌾 1. HIGH-CONVERTING EDITORIAL HERO WITH REAL-TIME MATERIAL SWITCHER */}
      <section className="bg-[#FEFBF1] dark:bg-[#0F100F] pt-8 sm:pt-14 pb-12 sm:pb-16 border-b border-[#ECECEC] dark:border-white/[0.08] transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            {/* Left Column: Editorial Headline & Actions */}
            <div className="lg:col-span-6 space-y-6">

              {/* Eyebrow Chip */}
              <div>
                <AnimatedBadge variant="gold" icon={<Sparkles className="w-3.5 h-3.5 text-[#AC7900] dark:text-[#D4AF37]" />}>
                  Concept to Fabric • Digital Textile Atelier
                </AnimatedBadge>
              </div>

              {/* Main Headline — poster scale (Phase 1) */}
              <h1 className="text-[2.55rem] leading-[1.02] sm:text-6xl lg:text-[4.15rem] lg:leading-[1.0] font-black font-editorial tracking-[-0.03em] text-[#0F100F] dark:text-white">
                Custom Fabric Printing <span className="text-[#AC7900] dark:text-[#D4AF37]">from 1 Meter</span>
              </h1>

              {/* Subtitle - Simplified & Friendly */}
              <p className="text-[13px] sm:text-base text-[#8A8883] dark:text-gray-300 max-w-xl leading-relaxed font-normal">
                Direct mill custom printing with zero minimum order. Print your own artwork onto <strong>certified Cotton, Mulberry Silk, Linen &amp; Modal</strong> with reactive color-lock technology.
              </p>

              {/* Action Buttons & Quick URL Extractor Bar */}
              <div className="space-y-3.5 pt-1">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-3.5">

                  {/* Explore Fabrics Button with circular arrow */}
                  <button
                    onClick={onGoToFabrics}
                    className="group h-[46px] sm:h-[50px] pl-5 sm:pl-6 pr-1.5 rounded-full inline-flex items-center justify-between sm:justify-center gap-3 bg-[#0F100F] dark:bg-white text-white dark:text-[#0F100F] text-xs sm:text-sm font-semibold shadow-md hover:opacity-90 hover:scale-[1.01] active:scale-98 transition w-full sm:w-auto"
                  >
                    <span>Explore 250+ Fabric Qualities</span>
                    <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white dark:bg-[#0F100F] text-[#0F100F] dark:text-white flex items-center justify-center shrink-0">
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </button>

                  {/* Order Swatch Sample Book Button */}
                  <button
                    onClick={() => setSwatchModalOpen(true)}
                    className="h-[46px] sm:h-[50px] px-5 sm:px-6 rounded-full border border-[#ECECEC] dark:border-white/[0.15] bg-white dark:bg-[#1A1C1A] text-[#0F100F] dark:text-white text-xs sm:text-sm font-semibold hover:border-[#AC7900] transition flex items-center justify-center space-x-2 shadow-sm w-full sm:w-auto"
                  >
                    <BookOpen className="w-4 h-4 text-[#AC7900] dark:text-[#D4AF37]" />
                    <span>Order Swatch Books (₹499)</span>
                  </button>

                </div>

                {/* Google Image URL Extractor Trigger Bar */}
                <div
                  onClick={() => setUrlModalOpen(true)}
                  className="bg-white dark:bg-[#1A1C1A] border border-[#ECECEC] dark:border-white/[0.12] rounded-2xl p-2.5 sm:p-3 flex items-center justify-between cursor-pointer hover:border-[#AC7900] dark:hover:border-[#D4AF37] transition shadow-xs max-w-md group"
                >
                  <div className="flex items-center space-x-2 text-xs text-[#8A8883] dark:text-gray-400 truncate">
                    <Globe className="w-3.5 h-3.5 text-[#AC7900] dark:text-[#D4AF37] shrink-0" />
                    <span className="truncate">Have an image URL? Paste to preview in 3D</span>
                  </div>
                  <span className="text-[11px] sm:text-xs font-bold text-[#AC7900] dark:text-[#D4AF37] group-hover:underline shrink-0 ml-2">
                    Extract →
                  </span>
                </div>
              </div>

              {/* Trust Badge Bar */}
              <div className="bg-[#F9F6ED] dark:bg-[#1C1E1C] border border-[#ECECEC] dark:border-white/[0.08] p-3.5 sm:p-4 rounded-2xl sm:rounded-[24px] shadow-xs max-w-lg flex items-center space-x-3">
                <span className="text-base sm:text-lg shrink-0">⭐</span>
                <p className="text-[11px] sm:text-xs text-[#0F100F] dark:text-gray-200 leading-snug">
                  <strong>Direct Mill Digital Printing:</strong> High-definition strike-offs, skin-safe non-toxic reactive dyes, and express pan-India dispatch.
                </p>
              </div>

            </div>

            {/* Right Column: Hero Visual with Real-Time Material Switcher */}
            <div className="lg:col-span-6 relative">
              <SpotlightCard
                spotlightColor="rgba(172, 121, 0, 0.12)"
                className="p-5 shadow-fabriclore space-y-4"
              >

                {/* Hero Material Switcher Tabs */}
                <div className="flex items-center justify-between pb-2 border-b border-black/[0.06] dark:border-white/[0.08] flex-wrap gap-2">
                  <span className="text-xs font-bold text-[#0F100F] dark:text-white font-editorial">
                    Interactive Material Preview:
                  </span>

                  <AnimatedTabs
                    layoutId="hero-mat-pill"
                    tabs={Object.keys(HERO_MATERIALS).map(key => {
                      const MatIcon = FABRIC_FILTER_ICONS[key] || Sparkles;
                      return { id: key, label: key, icon: <MatIcon className="w-3.5 h-3.5" /> };
                    })}
                    activeTab={activeHeroTab}
                    onChange={setActiveHeroTab}
                  />
                </div>

                {/* Studio Visual: instant static render → hydrated 3D draped cloth */}
                <HeroStudioVisual heroTab={activeHeroTab} material={heroMat} />

                {/* Studio CTA Footer */}
                <div className="flex items-center justify-between pt-1">
                  <div>
                    <span className="text-[11px] text-[#8A8883] dark:text-gray-400 block font-medium">Starting Wholesale Price</span>
                    <span className="text-base font-black text-[#0F100F] dark:text-white">
                      ₹{heroMat.wholesalePrice}.00 <span className="text-xs font-normal">/meter</span>
                    </span>
                  </div>

                  <button
                    onClick={() => onSelectProduct(activeMatchedProduct)}
                    className="bg-[#0F100F] dark:bg-white text-white dark:text-[#0F100F] font-bold px-5 py-2.5 rounded-full text-xs hover:opacity-90 transition flex items-center space-x-1.5 shadow-md hover:scale-105"
                  >
                    <span>Launch 3D Studio</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </SpotlightCard>
            </div>

          </div>

          {/* 🛡️ 2. THE 3 VALUE PROPOSITION PILLARS */}
          <div className="mt-10 sm:mt-16 pt-8 sm:pt-10 border-t border-[#ECECEC] dark:border-white/[0.08] grid grid-cols-1 md:grid-cols-3 gap-8">

            <div className="relative flex gap-4 pl-12">
              <div className="absolute top-0 left-0 bg-[#0F100F] dark:bg-white text-white dark:text-[#0F100F] rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shadow-sm">
                1
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-bold text-[#0F100F] dark:text-white font-editorial">
                  250+ Ready Fabric Qualities
                </h4>
                <p className="text-xs text-[#8A8883] dark:text-gray-300 leading-relaxed font-medium">
                  Ready-stock natural and sustainable bases: Organic Cotton, Pure Silk, French Flax Linen, Modal, Viscose, and Bamboo.
                </p>
              </div>
            </div>

            <div className="relative flex gap-4 pl-12">
              <div className="absolute top-0 left-0 bg-[#0F100F] dark:bg-white text-white dark:text-[#0F100F] rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shadow-sm">
                2
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-bold text-[#0F100F] dark:text-white font-editorial">
                  Consistent Tested Quality
                </h4>
                <p className="text-xs text-[#8A8883] dark:text-gray-300 leading-relaxed font-medium">
                  Every run is colorfastness tested, GSM verified, and inspected with high-definition, non-toxic reactive dyes.
                </p>
              </div>
            </div>

            <div className="relative flex gap-4 pl-12">
              <div className="absolute top-0 left-0 bg-[#0F100F] dark:bg-white text-white dark:text-[#0F100F] rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shadow-sm">
                3
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-bold text-[#0F100F] dark:text-white font-editorial">
                  Delivered in 7–10 Days
                </h4>
                <p className="text-xs text-[#8A8883] dark:text-gray-300 leading-relaxed font-medium">
                  Fast strike-off sampling, digital proofing approval, and express doorstep dispatch across India and worldwide.
                </p>
              </div>
            </div>

          </div>

          {/* 📊 3. TRUST METRICS COUNTERS WITH NUMBER TICKER */}
          <div className="mt-12 bg-white dark:bg-[#1A1C1A] border border-[#ECECEC] dark:border-white/[0.08] rounded-[28px] p-6 shadow-sm grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <span className="text-2xl sm:text-3xl font-black text-[#0F100F] dark:text-white font-editorial block">
                <NumberTicker value={250} suffix="+" />
              </span>
              <span className="text-xs text-[#8A8883] dark:text-gray-400 font-medium">
                Ready Fabric Qualities
              </span>
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-black text-[#AC7900] dark:text-[#D4AF37] font-editorial block">
                <NumberTicker value={100000} suffix="+" />
              </span>
              <span className="text-xs text-[#8A8883] dark:text-gray-400 font-medium">
                Meters/Month Mill Capacity
              </span>
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 font-editorial block">
                <NumberTicker value={300} suffix=" DPI" />
              </span>
              <span className="text-xs text-[#8A8883] dark:text-gray-400 font-medium">
                Reactive Dye Color Lock
              </span>
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-black text-[#0F100F] dark:text-white font-editorial block">
                7–10 Days
              </span>
              <span className="text-xs text-[#8A8883] dark:text-gray-400 font-medium">
                Express Strike-Off Dispatch
              </span>
            </div>
          </div>

        </div>

        {/* 🌟 INFINITE PRODUCTION STANDARDS MARQUEE */}
        <div className="mt-8 pt-6 border-t border-black/[0.04] dark:border-white/[0.06] overflow-hidden w-full">
          <Marquee speed="35s" pauseOnHover={true}>
            {[
              { title: 'Skin-Safe Reactive Dyes', desc: 'Azo-Free & Non-Toxic' },
              { title: '100% Pure Natural Fibers', desc: 'Combed Cotton, Silk, Linen' },
              { title: 'Grade 4.5+ Fastness', desc: 'AATCC Wash & Rub Resistance' },
              { title: 'Zero Surface Cracking', desc: 'Molecular Fiber Lock' },
              { title: 'Bio-Washed Finish', desc: 'Ultra-Soft Handfeel' },
              { title: 'Low MOQ: 1 Meter', desc: 'Custom Strike-Offs & Rolls' },
              { title: 'Mill Direct Dispatch', desc: 'Fast Doorstep Delivery' },
            ].map((cert, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 shadow-xs shrink-0 mx-1.5"
              >
                <Award className="w-3.5 h-3.5 text-[#AC7900] dark:text-[#D4AF37]" />
                <span className="text-xs font-bold text-[#0F100F] dark:text-white">{cert.title}</span>
                <span className="text-[10px] text-slate-400 font-medium">• {cert.desc}</span>
              </div>
            ))}
          </Marquee>
        </div>

      </section>

      {/* 🟢 FAST TRACK: ORDER DIRECT ON WHATSAPP OR CALL WITH REQUIREMENT & DOCUMENT UPLOAD */}
      <WhatsAppOrderSection />

      {/* 👑 3.4 POPULAR DESIGNS SHOWCASE (Curated 300 DPI Motifs & Seamless Patterns) */}
      <PopularDesignsSection
        onSelectDesignForCustomizer={(designUrl, designName) => {
          const defaultProduct = products[0];
          if (defaultProduct) {
            onSelectProduct(defaultProduct);
          }
        }}
        onOpenAllDesignsModal={() => setIsPreloadedModalOpen(true)}
      />

      {/* 👕 3.5 BLANK APPAREL & T-SHIRT STUDIO SPOTLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <SpotlightCard
          spotlightColor="rgba(172, 121, 0, 0.12)"
          className="bg-gradient-to-b from-[#FAF7EE] via-[#FEFBF1] to-[#FAF7EE] dark:from-[#151615] dark:via-[#111211] dark:to-[#151615] text-[#0F100F] dark:text-white p-6 sm:p-10 border border-black/[0.08] dark:border-white/[0.08] shadow-sm relative overflow-hidden"
        >
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#AC7900]/5 dark:bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div className="space-y-1.5">
              <AnimatedBadge variant="gold" icon={<Shirt className="w-3.5 h-3.5" />}>
                <span>Blank Apparel & Print Studio</span>
              </AnimatedBadge>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black font-editorial tracking-tight mt-1 text-[#0F100F] dark:text-white">
                Custom T-Shirts, Polos & Team Kits
              </h2>
              <p className="text-xs sm:text-sm text-[#71717A] dark:text-[#A1A1AA] max-w-xl leading-relaxed">
                100% Combed Compact Cotton & Poly Dry-Fit. Upload custom artwork with instant size breakdown and tiered mill wholesale discounts.
              </p>
            </div>

            {onGoToApparel && (
              <button
                onClick={onGoToApparel}
                className="px-6 py-3 rounded-full bg-[#0F100F] hover:bg-black text-white dark:bg-white dark:hover:bg-slate-100 dark:text-[#0F100F] font-semibold text-xs shadow-sm flex items-center space-x-2 transition self-start md:self-auto group"
              >
                <span>Browse Full Range (14 Styles)</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            )}
          </div>

          {/* 4 Spotlight Apparel Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
            {APPAREL_PRODUCTS.slice(0, 4).map(apparel => (
              <div
                key={apparel.id}
                onClick={onGoToApparel}
                className="bg-white dark:bg-[#1E201E] rounded-2xl border border-black/[0.08] dark:border-white/[0.08] p-3.5 hover:border-[#AC7900] dark:hover:border-[#D4AF37] hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
              >
                <div className="relative aspect-square rounded-xl overflow-hidden bg-[#FAF7EE] dark:bg-black/30 mb-3 flex items-center justify-center p-2">
                  <img
                    src={apparel.mockupImages.front}
                    alt={apparel.name}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                  {apparel.badge && (
                    <span className="absolute top-2 left-2 bg-[#AC7900]/15 text-[#AC7900] dark:text-[#D4AF37] text-[9px] font-bold px-2 py-0.5 rounded-full border border-[#AC7900]/20">
                      {apparel.badge}
                    </span>
                  )}
                  <span className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {apparel.gsm} GSM
                  </span>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-[#0F100F] dark:text-white group-hover:text-[#AC7900] dark:group-hover:text-[#D4AF37] transition line-clamp-1">
                    {apparel.name}
                  </h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">{apparel.fit}</p>

                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-black/[0.06] dark:border-white/[0.08]">
                    <span className="text-xs font-black text-[#0F100F] dark:text-white">from ₹{apparel.basePrice}</span>
                    <span className="text-[10px] text-[#AC7900] dark:text-[#D4AF37] font-bold group-hover:underline">
                      Customize Sizes →
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </SpotlightCard>
      </section>

      {/* 🎓 3.8 INSTITUTIONAL UNIFORM MILL SPOTLIGHT (SCHOOL, CORPORATE, MEDICAL) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <SpotlightCard
          spotlightColor="rgba(172, 121, 0, 0.12)"
          className="bg-gradient-to-b from-[#FAF7EE] via-[#FEFBF1] to-[#FAF7EE] dark:from-[#151615] dark:via-[#111211] dark:to-[#151615] text-[#0F100F] dark:text-white p-6 sm:p-10 border border-black/[0.08] dark:border-white/[0.08] shadow-sm relative overflow-hidden"
        >
          {/* Subtle Background Glow */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#AC7900]/5 dark:bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div className="space-y-1.5">
              <AnimatedBadge variant="emerald" icon={<GraduationCap className="w-3.5 h-3.5" />}>
                <span>Mill Institutional Uniform Fabrics · ISO 9001:2015</span>
              </AnimatedBadge>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black font-editorial tracking-tight mt-1 text-[#0F100F] dark:text-white">
                School Checks, Suiting & Hospital Scrubs
              </h2>
              <p className="text-xs sm:text-sm text-[#71717A] dark:text-[#A1A1AA] max-w-xl leading-relaxed">
                Supplying schools, institutional teams, and healthcare workwear with durable, colorfast fabrics and tailored uniform weaves.
              </p>
            </div>

            {onGoToUniforms && (
              <button
                onClick={onGoToUniforms}
                className="px-6 py-3 rounded-full bg-[#0F100F] hover:bg-black text-white dark:bg-white dark:hover:bg-slate-100 dark:text-[#0F100F] font-semibold text-xs shadow-sm flex items-center space-x-2 transition self-start md:self-auto group"
              >
                <span>Browse Uniform Range (58" Width)</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            )}
          </div>

          {/* 4 Spotlight Uniform Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
            {[
              UNIFORM_PRODUCTS.find(u => u.id === 'corp-oxford-poplin-shirts') || UNIFORM_PRODUCTS[0],
              UNIFORM_PRODUCTS.find(u => u.categoryId === 'school') || UNIFORM_PRODUCTS[1],
              UNIFORM_PRODUCTS.find(u => u.categoryId === 'healthcare') || UNIFORM_PRODUCTS[2],
              UNIFORM_PRODUCTS.find(u => u.categoryId === 'industrial') || UNIFORM_PRODUCTS[3],
            ].map(uniform => (
              <div
                key={uniform.id}
                onClick={onGoToUniforms}
                className="bg-white dark:bg-[#1E201E] rounded-2xl border border-black/[0.08] dark:border-white/[0.08] p-3.5 hover:border-[#AC7900] dark:hover:border-[#D4AF37] hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
              >
                <div className="relative aspect-video rounded-xl overflow-hidden bg-[#FAF7EE] dark:bg-black/30 mb-3">
                  <img
                    src={uniform.modelImage}
                    alt={uniform.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-2 left-2 bg-[#AC7900] text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                    {uniform.category}
                  </span>
                  <span className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded">
                    {uniform.gsm} GSM
                  </span>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-[#0F100F] dark:text-white group-hover:text-[#AC7900] dark:group-hover:text-[#D4AF37] transition line-clamp-1">
                    {uniform.name}
                  </h4>
                  <p className="text-[10px] text-slate-500 mt-0.5 truncate">{uniform.weave}</p>

                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-black/[0.06] dark:border-white/[0.08]">
                    <span className="text-xs font-bold text-[#AC7900] dark:text-[#D4AF37]">Custom Uniform</span>
                    <span className="text-[10px] text-slate-500 font-semibold group-hover:underline">
                      View Shades ({uniform.shades.length}) →
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </SpotlightCard>
      </section>

      {/* 🧢 3.9 CUSTOM MERCH SPOTLIGHT (CAPS, BOTTLES, MUGS, TOTES) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <SpotlightCard
          spotlightColor="rgba(172, 121, 0, 0.12)"
          className="bg-gradient-to-b from-[#FAF7EE] via-[#FEFBF1] to-[#FAF7EE] dark:from-[#151615] dark:via-[#111211] dark:to-[#151615] text-[#0F100F] dark:text-white p-6 sm:p-10 border border-black/[0.08] dark:border-white/[0.08] shadow-sm relative overflow-hidden"
        >
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#AC7900]/5 dark:bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div className="space-y-1.5">
              <AnimatedBadge variant="gold" icon={<Sparkles className="w-3.5 h-3.5" />}>
                <span>On-Product 3D Studio · 1 Pc Sampling · 35% Bulk Discount</span>
              </AnimatedBadge>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black font-editorial tracking-tight mt-1 text-[#0F100F] dark:text-white">
                Custom Caps, Hydro Bottles & Canvas Totes
              </h2>
              <p className="text-xs sm:text-sm text-[#71717A] dark:text-[#A1A1AA] max-w-xl leading-relaxed">
                Elevate your brand with 3D puff embroidered dad hats, laser-engraved double-wall hydro flasks, ceramic coffee mugs, and heavyweight canvas bags.
              </p>
            </div>

            {onGoToMerch && (
              <button
                onClick={onGoToMerch}
                className="px-6 py-3 rounded-full bg-[#0F100F] hover:bg-black text-white dark:bg-white dark:hover:bg-slate-100 dark:text-[#0F100F] font-semibold text-xs shadow-sm flex items-center space-x-2 transition self-start md:self-auto group shrink-0"
              >
                <span>Explore Custom Merch (16 Items)</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            )}
          </div>

          {/* 4 Spotlight Merch Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
            {[
              CUSTOM_MERCH_PRODUCTS.find(m => m.category === 'BAGS') || CUSTOM_MERCH_PRODUCTS[0],
              CUSTOM_MERCH_PRODUCTS.find(m => m.category === 'CAPS') || CUSTOM_MERCH_PRODUCTS[1],
              CUSTOM_MERCH_PRODUCTS.find(m => m.category === 'SPORTS') || CUSTOM_MERCH_PRODUCTS[2],
              CUSTOM_MERCH_PRODUCTS.find(m => m.category === 'SHIRTS') || CUSTOM_MERCH_PRODUCTS[3],
            ].map((merch) => (
              <div
                key={merch.id}
                onClick={onGoToMerch}
                className="bg-white dark:bg-[#1E201E] rounded-2xl border border-black/[0.08] dark:border-white/[0.08] p-3.5 hover:border-[#AC7900] dark:hover:border-[#D4AF37] hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
              >
                <div className="relative aspect-square rounded-xl overflow-hidden bg-[#FAF7EE] dark:bg-black/30 mb-3 flex items-center justify-center p-3">
                  <img
                    src={merch.colors[0].image}
                    alt={merch.name}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-sm"
                  />
                  {merch.badge && (
                    <span className="absolute top-2 left-2 bg-[#AC7900]/15 text-[#AC7900] dark:text-[#D4AF37] text-[9px] font-bold px-2 py-0.5 rounded-full border border-[#AC7900]/20">
                      {merch.badge}
                    </span>
                  )}
                  <span className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {merch.defaultDecoration}
                  </span>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-[#0F100F] dark:text-white group-hover:text-[#AC7900] dark:group-hover:text-[#D4AF37] transition line-clamp-1">
                    {merch.name}
                  </h4>
                  <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">{merch.tagline}</p>

                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-black/[0.06] dark:border-white/[0.08]">
                    <span className="text-xs font-black text-[#0F100F] dark:text-white">from ₹{merch.basePrice}</span>
                    <span className="text-[10px] text-[#AC7900] dark:text-[#D4AF37] font-bold group-hover:underline">
                      Customize in 3D →
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </SpotlightCard>
      </section>

      {/* 🔍 4. INTERACTIVE STRIKE-OFF SPLIT COMPARISON LENS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <StrikeOffComparisonSlider />
      </section>

      {/* 🚀 5. 4-STEP "CONCEPT TO FABRIC" PRODUCTION PIPELINE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ProductionPipelineSteps />
      </section>

      {/* 🔍 6. INTERACTIVE FABRIC COMPARISON MATRIX */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FabricComparisonMatrix
          products={products}
          onSelectProduct={onSelectProduct}
        />
      </section>

      {/* 👗 7. DESIGNER ATELIER LOOKBOOK GALLERY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <DesignerLookbookSection
          products={products}
          onSelectProduct={onSelectProduct}
        />
      </section>

      {/* 📦 8. BESTSELLING FABRIC QUALITIES CATALOG */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-[#AC7900] dark:text-[#D4AF37] font-editorial">
              Certified Mill Collection
            </span>
            <h2 className="text-2xl sm:text-3xl font-black font-editorial text-[#0F100F] dark:text-white">
              Bestselling Digital Print Base Fabrics
            </h2>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {['All', 'Cotton', 'Silk', 'Linen', 'Modal', 'Viscose'].map((cat) => {
              const CatIcon = FABRIC_FILTER_ICONS[cat] || Layers;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveFilterCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition flex items-center gap-1.5 ${activeFilterCategory === cat
                      ? 'bg-[#0F100F] dark:bg-white text-white dark:text-[#0F100F] shadow-xs'
                      : 'bg-white dark:bg-[#1A1C1A] text-[#0F100F] dark:text-white border border-[#ECECEC] dark:border-white/[0.1] hover:border-[#AC7900]'
                    }`}
                >
                  <CatIcon className="w-3.5 h-3.5 shrink-0" />
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBestselling.map((product) => (
            <FabricCard
              key={product.id}
              product={product}
              onSelect={onSelectProduct}
            />
          ))}
        </div>

        <div className="text-center pt-4">
          <button
            onClick={onGoToFabrics}
            className="group h-[48px] pl-6 pr-2 rounded-full inline-flex items-center justify-center gap-3 border border-[#0F100F] dark:border-white bg-transparent text-[#0F100F] dark:text-white text-sm font-semibold hover:bg-[#0F100F] hover:text-white dark:hover:bg-white dark:hover:text-[#0F100F] transition"
          >
            <span>View Full 250+ Fabric Catalog</span>
            <span className="w-8 h-8 rounded-full bg-[#0F100F] text-white dark:bg-white dark:text-[#0F100F] group-hover:bg-white group-hover:text-[#0F100F] dark:group-hover:bg-[#0F100F] dark:group-hover:text-white flex items-center justify-center transition">
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </button>
        </div>

      </section>

      {/* 💰 9. DIRECT MILL WHOLESALE ROI CALCULATOR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <WholesaleSavingsCalculator
          onOpenBulkInquiry={onOpenBulkInquiry}
        />
      </section>

      {/* 🌿 10. NATURAL FIBER CLASSIFICATIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        <div className="text-center space-y-2 max-w-xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-[#AC7900] dark:text-[#D4AF37] font-editorial">
            Natural & Bio-Cellulosic
          </span>
          <h2 className="text-2xl sm:text-3xl font-black font-editorial text-[#0F100F] dark:text-white">
            Shop by Fiber Composition
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat.name)}
              className="group bg-white dark:bg-[#1A1C1A] rounded-[24px] p-4 text-center cursor-pointer border border-[#ECECEC] dark:border-white/[0.08] hover:border-[#AC7900] dark:hover:border-[#D4AF37] shadow-sm hover:shadow-md transition flex flex-col items-center space-y-3"
            >
              <div className="w-16 h-16 rounded-full overflow-hidden border border-[#ECECEC] dark:border-white/[0.1] group-hover:scale-105 transition duration-300 bg-black/5 dark:bg-white/5">
                <img
                  src={cat.image}
                  alt={cat.name}
                  loading="lazy"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=60&w=400';
                  }}
                />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#0F100F] dark:text-white group-hover:text-[#AC7900] dark:group-hover:text-[#D4AF37] transition">
                  {cat.name}
                </h4>
                <span className="text-[11px] text-[#8A8883] dark:text-gray-400 font-medium">
                  {cat.itemCount} Qualities
                </span>
              </div>
            </div>
          ))}
        </div>

      </section>

      {/* 🏭 11. WHOLESALE MILL DIRECT BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0F100F] text-white rounded-[32px] p-8 sm:p-12 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-black font-editorial text-white">
              Direct Mill Partnership & Volume Manufacturing
            </h3>
            <p className="text-xs sm:text-sm text-gray-300 max-w-xl leading-relaxed font-normal">
              Special wholesale tier discounts for fashion studios, garment manufacturers, and retail chains. Rotary and reactive digital production up to 100,000 meters/month with lab dipping and color lock guarantees.
            </p>
          </div>

          <button
            onClick={onOpenBulkInquiry}
            className="h-[50px] px-8 rounded-full bg-[#AC7900] hover:bg-[#c28900] text-white font-bold text-sm transition shadow-lg shrink-0 flex items-center space-x-2"
          >
            <span>Request Mill Bulk Quote</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* 🏭 ABOUT FABRIC PRINT MILL SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-[#1A1C1A] rounded-[32px] p-8 sm:p-12 border border-[#ECECEC] dark:border-white/[0.08] shadow-fabriclore grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <div className="inline-flex items-center space-x-2 text-xs font-bold text-[#AC7900] dark:text-[#D4AF37] uppercase tracking-wider font-editorial">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Direct Mill Printing &amp; Apparel Manufacturing</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-editorial text-[#0F100F] dark:text-white">
              About Fabric Print Mill Hub
            </h2>
            <p className="text-xs sm:text-sm text-[#8A8883] dark:text-gray-400 leading-relaxed">
              Located in Tirupur, Tamil Nadu—the garment manufacturing capital of India. Fabric Print pairs master textile craft with cutting-edge 300 DPI reactive digital presses, direct-to-film (DTF), and dye-sublimation machinery.
            </p>
            <div className="grid grid-cols-2 gap-3 text-xs pt-1">
              <div className="p-3 rounded-xl bg-[#F9F6ED] dark:bg-[#242624] space-y-1">
                <span className="font-bold text-[#0F100F] dark:text-white block">1m Sampling MOQ</span>
                <span className="text-[11px] text-[#8A8883] dark:text-gray-400">Order strike-offs with custom artwork before bulk</span>
              </div>
              <div className="p-3 rounded-xl bg-[#F9F6ED] dark:bg-[#242624] space-y-1">
                <span className="font-bold text-[#0F100F] dark:text-white block">Direct Mill Pricing</span>
                <span className="text-[11px] text-[#8A8883] dark:text-gray-400">No middlemen; wholesale tier savings up to 25%</span>
              </div>
            </div>
            {onGoToAbout && (
              <div className="pt-2">
                <button
                  onClick={onGoToAbout}
                  className="px-6 py-3 rounded-full bg-[#0F100F] hover:bg-black text-white dark:bg-white dark:hover:bg-slate-100 dark:text-[#0F100F] font-semibold text-xs shadow-sm flex items-center space-x-2 transition group"
                >
                  <span>Learn More About Our Mill</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}
          </div>

          <div className="relative aspect-[4/3] rounded-[24px] overflow-hidden bg-[#F3F0E8] dark:bg-[#222422] border border-[#ECECEC] dark:border-white/[0.08]">
            <img
              src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&q=60&w=800"
              alt="Fabric Print Mill Hub Tirupur"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* MODALS */}
      <SmartUrlImageExtractorModal
        isOpen={urlModalOpen}
        onClose={() => setUrlModalOpen(false)}
        onApplyExtractedImage={() => {
          const prod = products[0];
          if (prod) onSelectProduct(prod);
        }}
      />

      <SwatchBookOrderModal
        isOpen={swatchModalOpen}
        onClose={() => setSwatchModalOpen(false)}
      />

      <PreloadedDesignModal
        isOpen={isPreloadedModalOpen}
        onClose={() => setIsPreloadedModalOpen(false)}
        onSelectDesign={(design) => {
          const prod = products[0];
          if (prod) onSelectProduct(prod);
        }}
      />

    </div>
  );
};

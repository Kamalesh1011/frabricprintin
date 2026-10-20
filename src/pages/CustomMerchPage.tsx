import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  ShoppingBag,
  ArrowRight,
  Filter,
  Check,
  Palette,
  Layers,
  ShieldCheck,
  Truck,
  RotateCw,
  Search,
  ChevronRight,
  Crown,
  Coffee,
  CheckCircle2,
  Sliders,
  Award,
  Zap,
  Tag,
  Shirt,
  Flag,
  Printer,
  Droplets
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CUSTOM_MERCH_CATEGORIES,
  CUSTOM_MERCH_PRODUCTS,
  CustomMerchItem,
  MerchCategory,
  DecorationMethod
} from '../data/customMerchData';
import { CustomMerchStudioModal } from '../components/CustomMerchStudioModal';
import { SpotlightCard } from '../components/ui/spotlight-card';
import { AnimatedBadge } from '../components/ui/animated-badge';
import { AnimatedTabs } from '../components/ui/animated-tabs';
import { ShimmerButton } from '../components/ui/shimmer-button';
import { NumberTicker } from '../components/ui/number-ticker';

interface CustomMerchPageProps {
  onGoToHome: () => void;
  onGoToCheckout?: () => void;
  onOpenBulkInquiry?: () => void;
}

export const CustomMerchPage: React.FC<CustomMerchPageProps> = ({
  onGoToHome,
  onGoToCheckout,
  onOpenBulkInquiry,
}) => {
  // Filters State
  const [activeCategory, setActiveCategory] = useState<MerchCategory>('All');
  const [selectedDecoration, setSelectedDecoration] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');

  // Sports kits live on the dedicated Sports Sublimation tab — hide them here
  const visibleCategories = useMemo(
    () => CUSTOM_MERCH_CATEGORIES.filter((cat) => cat.id !== 'SPORTS'),
    []
  );

  // Studio Modal State
  const [activeStudioProduct, setActiveStudioProduct] = useState<CustomMerchItem | null>(null);
  const [isStudioOpen, setIsStudioOpen] = useState<boolean>(false);

  // Active Shade Map for previewing shades directly on card
  const [activeCardShadeMap, setActiveCardShadeMap] = useState<Record<string, number>>({});

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return CUSTOM_MERCH_PRODUCTS.filter((item) => {
      // Sports kits live on the dedicated Sports Sublimation tab
      if (item.category === 'SPORTS') {
        return false;
      }
      // Category filter
      if (activeCategory !== 'All' && item.category !== activeCategory) {
        return false;
      }
      // Decoration technique filter
      if (
        selectedDecoration !== 'All' &&
        !item.supportedDecorations.includes(selectedDecoration as DecorationMethod)
      ) {
        return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          item.name.toLowerCase().includes(q) ||
          item.tagline.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          item.materialSpecs.toLowerCase().includes(q)
        );
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.basePrice - b.basePrice;
      if (sortBy === 'price-desc') return b.basePrice - a.basePrice;
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [activeCategory, selectedDecoration, searchQuery, sortBy]);

  // Open Studio Customizer
  const handleOpenStudio = (item: CustomMerchItem) => {
    setActiveStudioProduct(item);
    setIsStudioOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#FEFBF1] dark:bg-[#0F100F] text-[#0F100F] dark:text-white transition-colors duration-300 pb-32 lg:pb-16">
      
      {/* 🧭 1. BREADCRUMBS BAR */}
      <div className="border-b border-black/[0.06] dark:border-white/[0.08] bg-white/40 dark:bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center space-x-2 text-xs text-slate-500">
          <button onClick={onGoToHome} className="hover:text-black dark:hover:text-white transition font-medium">
            Home
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-semibold text-black dark:text-white">Bags, Caps, Flags &amp; Shirts</span>
        </div>
      </div>

      {/* 🏷️ 2. HERO BANNER */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FAF7EE] via-[#FEFBF1] to-[#FAF7EE] dark:from-[#131413] dark:via-[#0F100F] dark:to-[#131413] py-12 sm:py-16 border-b border-black/[0.06] dark:border-white/[0.08]">
        
        {/* Subtle Ambient Glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#AC7900]/5 dark:bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left 7 Cols: Headline & Value Proposition */}
            <div className="lg:col-span-7 space-y-6">
              
              <div>
                <AnimatedBadge variant="gold" icon={<Sparkles className="w-3.5 h-3.5" />}>
                  <span>SUBLIMATION · DTF · DTG PRINTING</span>
                </AnimatedBadge>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-editorial tracking-tight text-[#0F100F] dark:text-white leading-[1.12]">
                Sports, Bags, Caps, <br />
                <span className="font-serif italic font-normal text-[#AC7900] dark:text-[#D4AF37]">
                  Flags &amp; Custom Shirts
                </span>
              </h1>

              <p className="text-sm sm:text-base text-[#71717A] dark:text-[#A1A1AA] max-w-2xl font-normal leading-relaxed">
                Complete custom manufacturing for athletic sports kits (Mens, Womens, Boys &amp; Girls), heavyweight canvas tote bags, structured caps, outdoor promotional flags, and designer resort shirts.
              </p>

              {/* Quick Jump Buttons */}
              <div className="flex flex-wrap gap-3 pt-2">
                <ShimmerButton
                  onClick={() => {
                    const el = document.getElementById('merch-catalog-grid');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-7 py-3.5"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Browse All Products ({CUSTOM_MERCH_PRODUCTS.length})</span>
                </ShimmerButton>

                {onOpenBulkInquiry && (
                  <button
                    onClick={onOpenBulkInquiry}
                    className="px-6 py-3.5 rounded-full bg-white dark:bg-white/5 hover:bg-black/[0.03] dark:hover:bg-white/10 text-[#0F100F] dark:text-white font-semibold text-sm border border-black/10 dark:border-white/15 transition-all flex items-center space-x-2 shadow-sm"
                  >
                    <span>Request Volume Quote (50+ Pcs)</span>
                    <ArrowRight className="w-4 h-4 text-[#AC7900]" />
                  </button>
                )}
              </div>

              {/* Trust Metric Strip with NumberTicker */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-black/[0.08] dark:border-white/[0.08]">
                <div>
                  <span className="block text-2xl font-bold font-editorial text-[#0F100F] dark:text-white">
                    1 Pc MOQ
                  </span>
                  <span className="text-xs text-[#71717A] dark:text-[#A1A1AA] font-medium">Instant Sampling</span>
                </div>
                <div>
                  <span className="block text-2xl font-bold font-editorial text-[#AC7900] dark:text-[#D4AF37]">
                    <NumberTicker value={35} suffix="% OFF" />
                  </span>
                  <span className="text-xs text-[#71717A] dark:text-[#A1A1AA] font-medium">Wholesale Volume Tiers</span>
                </div>
                <div>
                  <span className="block text-2xl font-bold font-editorial text-[#0F100F] dark:text-white">Sublimation</span>
                  <span className="text-xs text-[#71717A] dark:text-[#A1A1AA] font-medium">All-Over High Def</span>
                </div>
                <div>
                  <span className="block text-2xl font-bold font-editorial text-emerald-600 dark:text-emerald-400">
                    2–4 Days
                  </span>
                  <span className="text-xs text-[#71717A] dark:text-[#A1A1AA] font-medium">Express Dispatch</span>
                </div>
              </div>

            </div>

            {/* Right 5 Cols: Visual Featured Product Spotlight */}
            <div className="lg:col-span-5 relative">
              <SpotlightCard
                spotlightColor="rgba(172, 121, 0, 0.15)"
                className="p-3 shadow-xl"
              >
                <div className="relative aspect-[4/3] rounded-[22px] overflow-hidden bg-white dark:bg-black/40">
                  <img
                    src="/mockups/white_mens_jersey.jpg"
                    alt="Custom Sublimation Sports Jersey Kit"
                    className="w-full h-full object-contain p-2"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
                  
                  {/* Floating Guarantee Badge */}
                  <div className="absolute top-3 right-3 bg-white/90 dark:bg-black/80 backdrop-blur-md px-3 py-1 rounded-full border border-black/10 dark:border-white/20 text-xs font-semibold flex items-center space-x-1.5 text-black dark:text-white shadow-md">
                    <Sparkles className="w-3.5 h-3.5 text-[#AC7900] dark:text-[#D4AF37]" />
                    <span>Sublimation &amp; DTF</span>
                  </div>

                  {/* Bottom Information Pill */}
                  <div className="absolute bottom-3 inset-x-3 bg-white/95 dark:bg-[#1A1C1A]/95 backdrop-blur-md p-3.5 rounded-2xl text-[#0F100F] dark:text-white shadow-lg border border-black/5 dark:border-white/10 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#AC7900] dark:text-[#D4AF37]">
                        Featured 3D White Blank
                      </span>
                      <h4 className="text-xs sm:text-sm font-bold">Sublimation Performance Jersey Kits</h4>
                    </div>
                    <button
                      onClick={() => handleOpenStudio(CUSTOM_MERCH_PRODUCTS[0])}
                      className="px-3 py-1.5 rounded-xl bg-[#0F100F] dark:bg-white text-white dark:text-[#0F100F] text-xs font-bold hover:scale-105 transition flex items-center space-x-1 shadow-sm"
                    >
                      <span>Try Studio</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </SpotlightCard>
            </div>

          </div>
        </div>
      </section>

      {/* 🗂️ 3. CATEGORY SELECTOR CHIP TILES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#AC7900] dark:text-[#D4AF37] font-editorial">
              Select Product Category
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Choose from Bags, Caps, Flags, and Shirts — team kits live under Sports Sublimation
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {visibleCategories.map((cat) => {
            const isSelected = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`p-4 rounded-3xl border text-left transition-all relative overflow-hidden group ${
                  isSelected
                    ? 'border-[#0F100F] dark:border-white bg-[#0F100F] dark:bg-white text-white dark:text-[#0F100F] shadow-xl scale-[1.02]'
                    : 'border-black/10 dark:border-white/10 bg-white dark:bg-[#161716] hover:border-[#AC7900] hover:shadow-md'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2 rounded-2xl ${isSelected ? 'bg-white/20 dark:bg-black/10' : 'bg-[#AC7900]/10 text-[#AC7900] dark:text-[#D4AF37]'}`}>
                    {cat.id === 'SPORTS' && <Zap className="w-4 h-4" />}
                    {cat.id === 'BAGS' && <ShoppingBag className="w-4 h-4" />}
                    {cat.id === 'CAPS' && <Crown className="w-4 h-4" />}
                    {cat.id === 'FLAGS' && <Flag className="w-4 h-4" />}
                    {cat.id === 'SHIRTS' && <Shirt className="w-4 h-4" />}
                    {cat.id === 'All' && <Layers className="w-4 h-4" />}
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isSelected ? 'bg-white/20 dark:bg-black/10' : 'bg-black/5 dark:bg-white/5 text-slate-500'}`}>
                    {cat.count} Items
                  </span>
                </div>
                <h4 className="text-xs sm:text-sm font-bold leading-tight line-clamp-1">{cat.label}</h4>
                <span className={`text-[9px] font-bold block mt-0.5 ${isSelected ? 'text-amber-300 dark:text-[#D4AF37]' : 'text-[#AC7900] dark:text-[#D4AF37]'}`}>
                  {cat.printMethods}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 🔍 4. FILTER TOOLBAR & PRODUCT CATALOG GRID */}
      <section id="merch-catalog-grid" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        
        {/* Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-black/[0.06] dark:border-white/[0.08]">
          
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-500 mr-2 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-[#AC7900]" />
              <span>Print Type:</span>
            </span>
            {[
              { id: 'All', icon: Layers },
              { id: 'SUBLIMATION', icon: Droplets },
              { id: 'DTF', icon: Printer },
              { id: 'DTG', icon: Zap },
            ].map((tech) => {
              const TechIcon = tech.icon;
              return (
                <button
                  key={tech.id}
                  onClick={() => setSelectedDecoration(tech.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition border flex items-center gap-1.5 ${
                    selectedDecoration === tech.id
                      ? 'bg-[#0F100F] dark:bg-white text-white dark:text-[#0F100F] border-transparent shadow-xs'
                      : 'bg-white dark:bg-[#1A1C1A] text-slate-600 dark:text-slate-300 border-black/10 dark:border-white/10 hover:border-[#AC7900]'
                  }`}
                >
                  <TechIcon className="w-3.5 h-3.5 shrink-0" />
                  {tech.id}
                </button>
              );
            })}
          </div>

          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tote bags, caps, flags, shirts..."
                className="pl-8 pr-3 py-1.5 rounded-full border border-black/10 dark:border-white/15 bg-white dark:bg-[#1A1C1A] text-xs font-medium focus:ring-2 focus:ring-[#AC7900] outline-none w-56 sm:w-72"
              />
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-1.5 rounded-full border border-black/10 dark:border-white/15 bg-white dark:bg-[#1A1C1A] text-xs font-bold focus:ring-2 focus:ring-[#AC7900] outline-none"
            >
              <option value="featured">Featured First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>

        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between py-4 text-xs text-slate-500 font-semibold">
          <span>
            Showing <strong>{filteredProducts.length}</strong> customizable products
          </span>
          {(activeCategory !== 'All' || selectedDecoration !== 'All' || searchQuery) && (
            <button
              onClick={() => {
                setActiveCategory('All');
                setSelectedDecoration('All');
                setSearchQuery('');
              }}
              className="text-[#AC7900] dark:text-[#D4AF37] hover:underline font-bold"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* The Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((item) => {
            const activeShadeIndex = activeCardShadeMap[item.id] || 0;
            const currentShade = item.colors[activeShadeIndex] || item.colors[0];

            return (
              <div
                key={item.id}
                className="bg-white dark:bg-[#161716] rounded-[28px] border border-black/[0.08] dark:border-white/10 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Photo & Technique Badge */}
                  <div className="relative aspect-square overflow-hidden bg-[#FAF7EE] dark:bg-[#111211] p-4 flex items-center justify-center">
                    <img
                      src={currentShade.image}
                      alt={item.name}
                      className="w-full h-full object-contain filter drop-shadow-md group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#0F100F] text-white dark:bg-white dark:text-[#0F100F] shadow-xs">
                        {item.category.split('&')[0].trim()}
                      </span>
                      {item.badge && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#AC7900]/15 text-[#AC7900] dark:text-[#D4AF37] border border-[#AC7900]/20">
                          {item.badge}
                        </span>
                      )}
                    </div>

                    {/* Technique Pill */}
                    <div className="absolute bottom-3 left-3 bg-white/90 dark:bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-slate-700 dark:text-slate-300 border border-black/5 dark:border-white/10">
                      {item.defaultDecoration}
                    </div>

                    {/* Selected Shade Name */}
                    <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-[10px] font-semibold flex items-center space-x-1.5">
                      <span className="w-2 h-2 rounded-full border border-white" style={{ backgroundColor: currentShade.hex }} />
                      <span>{currentShade.name}</span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-3">
                    <div>
                      <h4 className="text-sm font-bold font-editorial group-hover:text-[#AC7900] dark:group-hover:text-[#D4AF37] transition line-clamp-1">
                        {item.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">
                        {item.tagline}
                      </p>
                    </div>

                    {/* Technical Specs Tags */}
                    <div className="text-[10px] bg-black/5 dark:bg-white/5 p-2 rounded-xl text-slate-600 dark:text-slate-300 space-y-0.5">
                      <div className="truncate font-semibold">{item.materialSpecs}</div>
                      {item.dimensions && <div className="text-slate-400">Size: {item.dimensions}</div>}
                    </div>

                    {/* SHADE CARD SWATCH SELECTOR ROW */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Colors ({item.colors.length}):
                        </span>
                        <span className="text-[10px] font-bold text-[#AC7900] dark:text-[#D4AF37]">
                          {currentShade.name}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {item.colors.map((color, sIdx) => (
                          <button
                            key={color.name}
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveCardShadeMap((prev) => ({ ...prev, [item.id]: sIdx }));
                            }}
                            className={`w-5 h-5 rounded-full border transition-all flex items-center justify-center ${
                              activeShadeIndex === sIdx
                                ? 'border-black dark:border-white scale-110 shadow-xs ring-2 ring-[#AC7900]/40'
                                : 'border-black/20 dark:border-white/20 hover:scale-105'
                            }`}
                            style={{ backgroundColor: color.hex }}
                            title={color.name}
                          >
                            {activeShadeIndex === sIdx && (
                              <Check className={`w-2.5 h-2.5 ${color.hex === '#FFFFFF' || color.hex === '#FAFAFA' || color.hex === '#EDE6D8' ? 'text-black' : 'text-white'}`} />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>

                {/* Footer Pricing & CTA Button */}
                <div className="p-5 pt-0 border-t border-black/5 dark:border-white/5 mt-2">
                  <div className="flex items-center justify-between pt-3 mb-3">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-semibold block">Base Rate</span>
                      <div className="flex items-baseline space-x-1">
                        <span className="text-base font-black font-editorial">₹{item.basePrice}</span>
                        <span className="text-[10px] text-slate-400">/ pc</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-500 uppercase font-semibold block">Bulk Tier</span>
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Up to 35% OFF</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleOpenStudio(item)}
                    className="w-full py-2.5 rounded-2xl bg-[#0F100F] dark:bg-white text-white dark:text-[#0F100F] text-xs font-bold hover:opacity-90 transition flex items-center justify-center space-x-1.5 shadow-sm group/btn"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] dark:text-[#AC7900]" />
                    <span>Customize in Studio</span>
                    <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </section>

      {/* 🚀 5. 3-STEP "DESIGN TO DELIVERED" WORKFLOW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="bg-white dark:bg-[#161716] rounded-3xl border border-black/[0.08] dark:border-white/10 p-8 shadow-sm">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-[#AC7900] dark:text-[#D4AF37]">
              Simple Production Process
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-editorial mt-1">
              How Custom Sublimation &amp; Merch Production Works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-3 p-4">
              <div className="w-12 h-12 rounded-2xl bg-[#AC7900]/10 text-[#AC7900] dark:text-[#D4AF37] flex items-center justify-center mx-auto text-lg font-bold font-editorial">
                1
              </div>
              <h4 className="text-base font-bold font-editorial">Choose 3D White Mockup Blank</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Select from Sports Sublimation Jerseys (Mens, Womens, Boys, Girls), Tote Bags, Athletic Caps, Promotional Flags, or Custom Shirts.
              </p>
            </div>

            <div className="space-y-3 p-4">
              <div className="w-12 h-12 rounded-2xl bg-[#AC7900]/10 text-[#AC7900] dark:text-[#D4AF37] flex items-center justify-center mx-auto text-lg font-bold font-editorial">
                2
              </div>
              <h4 className="text-base font-bold font-editorial">Upload Design or Google Image URL</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Upload your graphic or paste any Google Images link. Experience real-time C-design dynamic anatomical wrap and auto-framing.
              </p>
            </div>

            <div className="space-y-3 p-4">
              <div className="w-12 h-12 rounded-2xl bg-[#AC7900]/10 text-[#AC7900] dark:text-[#D4AF37] flex items-center justify-center mx-auto text-lg font-bold font-editorial">
                3
              </div>
              <h4 className="text-base font-bold font-editorial">Sublimation &amp; Express Dispatch</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                High-definition non-fading all-over dye sublimation manufactured and dispatched in 2–4 business days.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 🎨 6. STUDIO MODAL POPUP */}
      {isStudioOpen && activeStudioProduct && (
        <CustomMerchStudioModal
          product={activeStudioProduct}
          isOpen={isStudioOpen}
          onClose={() => setIsStudioOpen(false)}
          onGoToCheckout={onGoToCheckout}
        />
      )}

    </div>
  );
};

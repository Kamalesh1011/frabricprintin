import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Shirt,
  Layers,
  Crown,
  GraduationCap,
  Upload,
  Globe,
  ArrowRight,
  ChevronRight,
  Search,
  CheckCircle,
  Eye,
  Sliders,
  Filter,
  Grid
} from 'lucide-react';
import { Product, ApparelProduct as BlankApparelProduct } from '../types';
import { APPAREL_PRODUCTS } from '../data/apparelData';
import { CUSTOM_MERCH_PRODUCTS, CustomMerchItem } from '../data/customMerchData';
import { UNIFORM_PRODUCTS, UniformFabric } from '../data/uniformData';
import { FabricCustomizerModule } from '../components/FabricCustomizerModule';
import { ApparelStudioModal } from '../components/ApparelStudioModal';
import { CustomMerchStudioModal } from '../components/CustomMerchStudioModal';
import { SmartUrlImageExtractorModal } from '../components/SmartUrlImageExtractorModal';
import { AnimatedBadge } from '../components/ui/animated-badge';

export type MasterStudioMode = 'all' | 'fabrics' | 'apparel' | 'merch' | 'uniforms';

interface MasterCustomizerStudioPageProps {
  products: Product[];
  onGoToHome: () => void;
  onGoToCheckout?: () => void;
  onOpenBulkInquiry?: () => void;
}

export const MasterCustomizerStudioPage: React.FC<MasterCustomizerStudioPageProps> = ({
  products,
  onGoToHome,
  onGoToCheckout,
  onOpenBulkInquiry,
}) => {
  // Master Studio Mode: 'all' | 'apparel' | 'merch' | 'fabrics' | 'uniforms'
  const [activeStudioMode, setActiveStudioMode] = useState<MasterStudioMode>('all');

  // Universal Search Query
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeSubFilter, setActiveSubFilter] = useState<string>('All');

  // Shared Uploaded Design (Can be used across all products simultaneously!)
  const [globalArtworkUrl, setGlobalArtworkUrl] = useState<string>(
    'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=60&w=600'
  );
  const [urlModalOpen, setUrlModalOpen] = useState<boolean>(false);

  // Active Selected Product per mode
  const [selectedApparel, setSelectedApparel] = useState<BlankApparelProduct>(APPAREL_PRODUCTS[0]);
  const [selectedMerch, setSelectedMerch] = useState<CustomMerchItem>(CUSTOM_MERCH_PRODUCTS[0]);
  const [selectedFabric, setSelectedFabric] = useState<Product>(products[0] || {} as Product);
  const [selectedUniform, setSelectedUniform] = useState<UniformFabric>(UNIFORM_PRODUCTS[0]);

  // Modal customizers
  const [apparelModalOpen, setApparelModalOpen] = useState<boolean>(false);
  const [merchModalOpen, setMerchModalOpen] = useState<boolean>(false);

  // File Upload Handler for Global Artwork
  const handleGlobalFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setGlobalArtworkUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const STUDIO_MODES = [
    {
      id: 'all',
      label: 'All Materials & Products',
      icon: <Grid className="w-4 h-4" />,
      badge: '50+ Items',
      tagline: 'All fabrics, blank garments, merch & uniform weaves in one master studio',
    },
    {
      id: 'fabrics',
      label: 'Custom Printed Fabrics',
      icon: <Layers className="w-4 h-4" />,
      badge: '250+ Qualities',
      tagline: 'Mulberry Silk, Organic Cotton, French Linen & Modal Meterage',
    },
    {
      id: 'apparel',
      label: 'Apparel & T-Shirts',
      icon: <Shirt className="w-4 h-4" />,
      badge: '14 Styles',
      tagline: 'Custom Tees, Oversized Streetwear, Hoodies & Sports Kits',
    },
    {
      id: 'merch',
      label: 'Other Products & Merch',
      icon: <Crown className="w-4 h-4" />,
      badge: '16 Items',
      tagline: 'Vintage Dad Hats, Hydro Flasks, Mugs, Canvas Totes & Patches',
    },
    {
      id: 'uniforms',
      label: 'Institutional Uniforms',
      icon: <GraduationCap className="w-4 h-4" />,
      badge: 'ISO 9001',
      tagline: 'School Plaids, Hospital Scrubs & Corporate Suiting Batches',
    },
  ];

  // Filtered lists for the "All Materials & Products" omni-view
  const filteredFabrics = useMemo(() => {
    return products.filter((p) => {
      const matchSearch = searchQuery === '' || 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchFilter = activeSubFilter === 'All' || activeSubFilter === 'Fabrics' || p.category.toLowerCase().includes(activeSubFilter.toLowerCase());
      return matchSearch && matchFilter;
    });
  }, [products, searchQuery, activeSubFilter]);

  const filteredApparel = useMemo(() => {
    return APPAREL_PRODUCTS.filter((a) => {
      const matchSearch = searchQuery === '' || 
        a.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        a.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.fabric.toLowerCase().includes(searchQuery.toLowerCase());
      const matchFilter = activeSubFilter === 'All' || activeSubFilter === 'Apparel' || a.category.toLowerCase().includes(activeSubFilter.toLowerCase());
      return matchSearch && matchFilter;
    });
  }, [searchQuery, activeSubFilter]);

  const filteredMerch = useMemo(() => {
    return CUSTOM_MERCH_PRODUCTS.filter((m) => {
      const matchSearch = searchQuery === '' || 
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        m.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.tagline.toLowerCase().includes(searchQuery.toLowerCase());
      const matchFilter = activeSubFilter === 'All' || activeSubFilter === 'Merch' || m.category.toLowerCase().includes(activeSubFilter.toLowerCase());
      return matchSearch && matchFilter;
    });
  }, [searchQuery, activeSubFilter]);

  const filteredUniforms = useMemo(() => {
    return UNIFORM_PRODUCTS.filter((u) => {
      const matchSearch = searchQuery === '' || 
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        u.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.composition.toLowerCase().includes(searchQuery.toLowerCase());
      const matchFilter = activeSubFilter === 'All' || activeSubFilter === 'Uniforms' || u.category.toLowerCase().includes(activeSubFilter.toLowerCase());
      return matchSearch && matchFilter;
    });
  }, [searchQuery, activeSubFilter]);

  return (
    <div className="min-h-screen bg-[#FEFBF1] dark:bg-[#0F100F] text-[#0F100F] dark:text-white transition-colors duration-300 pb-20 font-sans">
      
      {/* 🧭 1. BREADCRUMB BAR */}
      <div className="border-b border-black/[0.06] dark:border-white/[0.08] bg-white/40 dark:bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center space-x-2 text-xs text-slate-500">
          <button onClick={onGoToHome} className="hover:text-black dark:hover:text-white transition font-medium">
            Home
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-semibold text-black dark:text-white">Customize All Master Studio</span>
        </div>
      </div>

      {/* 🏷️ 2. STUDIO HERO & GLOBAL ARTWORK UPLOAD BAR */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FAF7EE] via-[#FEFBF1] to-[#FAF7EE] dark:from-[#131413] dark:via-[#0F100F] dark:to-[#131413] py-10 sm:py-14 border-b border-black/[0.06] dark:border-white/[0.08]">
        
        {/* Ambient Glows */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#AC7900]/5 dark:bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            
            <div className="space-y-3 max-w-2xl">
              <div className="flex items-center gap-2">
                <AnimatedBadge variant="gold" icon={<Sparkles className="w-3.5 h-3.5" />}>
                  <span>Master Design Studio · All Materials & Products</span>
                </AnimatedBadge>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-bold border border-emerald-500/20">
                  Universal Synced Preview
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black font-editorial tracking-tight leading-[1.12]">
                Customize All. <br />
                <span className="font-serif italic font-normal text-[#AC7900] dark:text-[#D4AF37]">
                  Every Fabric, Apparel Blank, Merch & Uniform
                </span>
              </h1>

              <p className="text-sm text-[#71717A] dark:text-[#A1A1AA] leading-relaxed">
                Upload your logo or print pattern once. Our live simulation engine instantly renders it across all <strong>50+ platform materials</strong> — from pure Mulberry silk rolls to oversized 240 GSM streetwear tees, laser-engraved hydro bottles, and anti-microbial scrubs.
              </p>
            </div>

            {/* Quick Upload / URL Artwork Capsule */}
            <div className="bg-white dark:bg-[#161716] p-4 rounded-3xl border border-black/[0.08] dark:border-white/10 shadow-sm space-y-3 w-full lg:w-96 shrink-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold font-editorial uppercase tracking-wider text-slate-500">
                  Universal Studio Artwork:
                </span>
                <button
                  onClick={() => setUrlModalOpen(true)}
                  className="text-[11px] font-bold text-[#AC7900] dark:text-[#D4AF37] hover:underline flex items-center space-x-1"
                >
                  <Globe className="w-3 h-3" />
                  <span>Paste URL</span>
                </button>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl overflow-hidden bg-slate-100 dark:bg-black/40 border border-black/10 dark:border-white/10 shrink-0">
                  <img
                    src={globalArtworkUrl}
                    alt="Active Studio Artwork"
                    className="w-full h-full object-cover"
                  />
                </div>

                <label className="flex-1 px-4 py-2.5 rounded-2xl bg-black/5 dark:bg-white/5 hover:bg-[#AC7900]/10 border border-black/5 dark:border-white/10 text-xs font-bold cursor-pointer transition flex items-center justify-center space-x-2 text-center">
                  <Upload className="w-3.5 h-3.5 text-[#AC7900] dark:text-[#D4AF37]" />
                  <span>Change Design</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleGlobalFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 🎛️ 3. MASTER STUDIO NAVIGATION TABS */}
      <section className="sticky top-16 z-30 bg-[#FEFBF1]/95 dark:bg-[#0F100F]/95 backdrop-blur-md border-b border-black/[0.06] dark:border-white/[0.08] py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-start sm:justify-center overflow-x-auto no-scrollbar gap-2">
            {STUDIO_MODES.map((mode) => {
              const isActive = activeStudioMode === mode.id;
              return (
                <button
                  key={mode.id}
                  onClick={() => setActiveStudioMode(mode.id as MasterStudioMode)}
                  className={`relative z-10 px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-200 flex items-center space-x-2 shrink-0 ${
                    isActive
                      ? 'bg-[#0F100F] text-white dark:bg-white dark:text-[#0F100F] shadow-md scale-105'
                      : 'bg-white dark:bg-[#1A1C1A] text-slate-600 dark:text-slate-300 border border-black/10 dark:border-white/10 hover:border-[#AC7900]'
                  }`}
                >
                  <span className={isActive ? 'text-[#D4AF37] dark:text-[#AC7900]' : 'text-slate-400'}>
                    {mode.icon}
                  </span>
                  <span>{mode.label}</span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                      isActive
                        ? 'bg-white/20 dark:bg-black/10 text-white dark:text-black'
                        : 'bg-black/5 dark:bg-white/10 text-slate-500'
                    }`}
                  >
                    {mode.badge}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 🚀 4. DYNAMIC STUDIO WORKSPACE BY ACTIVE MODE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* ================= MODE 0: ALL MATERIALS & PRODUCTS (MASTER OMNI STUDIO) ================= */}
        {activeStudioMode === 'all' && (
          <div className="space-y-12 animate-in fade-in duration-300">
            
            {/* Search & Filter Header */}
            <div className="bg-white dark:bg-[#161716] p-4 sm:p-6 rounded-3xl border border-black/[0.08] dark:border-white/10 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="relative w-full md:w-96">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search any material, fabric, tee, cap, or uniform..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl text-xs font-medium focus:outline-none focus:border-[#AC7900]"
                />
              </div>

              <div className="flex items-center space-x-2 overflow-x-auto w-full md:w-auto no-scrollbar pb-1 md:pb-0">
                {[
                  { id: 'All', icon: Sparkles },
                  { id: 'Fabrics', icon: Layers },
                  { id: 'Apparel', icon: Shirt },
                  { id: 'Merch', icon: Crown },
                  { id: 'Uniforms', icon: GraduationCap },
                ].map((filter) => {
                  const FilterIcon = filter.icon;
                  return (
                    <button
                      key={filter.id}
                      onClick={() => setActiveSubFilter(filter.id)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
                        activeSubFilter === filter.id
                          ? 'bg-[#AC7900] text-white shadow-sm'
                          : 'bg-black/5 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-black/10'
                      }`}
                    >
                      <FilterIcon className="w-3.5 h-3.5 shrink-0" />
                      {filter.id}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Live Synced Omni-Preview Spotlight Bar */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#AC7900] dark:text-[#D4AF37]">
                    Live Synced Mockup Bar
                  </span>
                  <h3 className="text-xl font-bold font-editorial">Your Artwork Live Across 4 Categories</h3>
                </div>
                <span className="text-xs text-slate-500 font-medium">Automatic Real-Time Drape</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {/* 1. Fabric Bolt */}
                <div 
                  onClick={() => {
                    setSelectedFabric(products[0] || {} as Product);
                    setActiveStudioMode('fabrics');
                  }}
                  className="bg-white dark:bg-[#161716] p-3 rounded-2xl border border-black/10 dark:border-white/10 hover:border-[#AC7900] cursor-pointer group transition"
                >
                  <div className="relative aspect-square rounded-xl overflow-hidden bg-[#FAF7EE] dark:bg-black/30 mb-2">
                    <img
                      src={products[0]?.images[0] || 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=60&w=400'}
                      alt="Fabric Drape"
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                      <span className="px-2.5 py-1 bg-white text-black text-[10px] font-bold rounded-full shadow">Open 3D Drape</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">🧵 250+ Fabrics</span>
                  <span className="text-xs font-bold text-black dark:text-white block group-hover:text-[#AC7900] truncate">
                    Mulberry Silk & Cotton Rolls
                  </span>
                </div>

                {/* 2. Heavyweight Tee */}
                <div 
                  onClick={() => {
                    setSelectedApparel(APPAREL_PRODUCTS[0]);
                    setApparelModalOpen(true);
                  }}
                  className="bg-white dark:bg-[#161716] p-3 rounded-2xl border border-black/10 dark:border-white/10 hover:border-[#AC7900] cursor-pointer group transition"
                >
                  <div className="relative aspect-square rounded-xl overflow-hidden bg-[#FAF7EE] dark:bg-black/30 mb-2 flex items-center justify-center p-2">
                    <img
                      src={APPAREL_PRODUCTS[0].mockupImages.front}
                      alt="Tee Mockup"
                      className="w-full h-full object-contain group-hover:scale-105 transition duration-300"
                    />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-85">
                      <img src={globalArtworkUrl} alt="Logo" className="w-12 h-12 object-contain mix-blend-multiply dark:mix-blend-screen" />
                    </div>
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                      <span className="px-2.5 py-1 bg-white text-black text-[10px] font-bold rounded-full shadow">Open Tee Studio</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">👕 14 Apparels</span>
                  <span className="text-xs font-bold text-black dark:text-white block group-hover:text-[#AC7900] truncate">
                    240 GSM Oversized Tee
                  </span>
                </div>

                {/* 3. Vintage Dad Hat */}
                <div 
                  onClick={() => {
                    setSelectedMerch(CUSTOM_MERCH_PRODUCTS[0]);
                    setMerchModalOpen(true);
                  }}
                  className="bg-white dark:bg-[#161716] p-3 rounded-2xl border border-black/10 dark:border-white/10 hover:border-[#AC7900] cursor-pointer group transition"
                >
                  <div className="relative aspect-square rounded-xl overflow-hidden bg-[#FAF7EE] dark:bg-black/30 mb-2 flex items-center justify-center p-2">
                    <img
                      src={CUSTOM_MERCH_PRODUCTS[0].colors[0].image}
                      alt="Cap Mockup"
                      className="w-full h-full object-contain group-hover:scale-105 transition duration-300"
                    />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-85">
                      <img src={globalArtworkUrl} alt="Logo" className="w-10 h-10 object-contain drop-shadow" />
                    </div>
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                      <span className="px-2.5 py-1 bg-white text-black text-[10px] font-bold rounded-full shadow">Open Cap Studio</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">🧢 16 Merch Items</span>
                  <span className="text-xs font-bold text-black dark:text-white block group-hover:text-[#AC7900] truncate">
                    3D Embroidery Dad Hat
                  </span>
                </div>

                {/* 4. Uniform Check */}
                <div 
                  onClick={() => {
                    setActiveStudioMode('uniforms');
                  }}
                  className="bg-white dark:bg-[#161716] p-3 rounded-2xl border border-black/10 dark:border-white/10 hover:border-[#AC7900] cursor-pointer group transition"
                >
                  <div className="relative aspect-square rounded-xl overflow-hidden bg-[#FAF7EE] dark:bg-black/30 mb-2">
                    <img
                      src={UNIFORM_PRODUCTS[0].modelImage}
                      alt="Uniform Swatch"
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                      <span className="px-2.5 py-1 bg-white text-black text-[10px] font-bold rounded-full shadow">Open Uniforms</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">🎓 Uniform Weaves</span>
                  <span className="text-xs font-bold text-black dark:text-white block group-hover:text-[#AC7900] truncate">
                    School & Hospital Rolls
                  </span>
                </div>
              </div>
            </div>

            {/* SECTION A: FABRIC ROLLS & QUALITIES */}
            {(activeSubFilter === 'All' || activeSubFilter === 'Fabrics') && filteredFabrics.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-black/5 dark:border-white/5">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#AC7900] dark:text-[#D4AF37]">
                      Category 1: Printed Fabrics
                    </span>
                    <h3 className="text-xl font-bold font-editorial">Pure Silks, Cottons, Linens & Modals ({filteredFabrics.length})</h3>
                  </div>
                  <button 
                    onClick={() => setActiveStudioMode('fabrics')}
                    className="text-xs font-bold text-[#AC7900] dark:text-[#D4AF37] hover:underline flex items-center space-x-1"
                  >
                    <span>Launch Full 3D Drape Studio →</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {filteredFabrics.slice(0, 8).map((fabric) => (
                    <div
                      key={fabric.id}
                      className="bg-white dark:bg-[#161716] rounded-3xl border border-black/[0.08] dark:border-white/10 p-4 shadow-sm hover:shadow-xl transition flex flex-col justify-between group"
                    >
                      <div>
                        <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#FAF7EE] dark:bg-black/30 mb-3">
                          <img
                            src={fabric.images[0]}
                            alt={fabric.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                          />
                          <span className="absolute top-2 left-2 bg-[#AC7900] text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                            {fabric.category}
                          </span>
                          <span className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded">
                            {fabric.gsm} GSM
                          </span>
                        </div>
                        <h4 className="text-sm font-bold font-editorial group-hover:text-[#AC7900] dark:group-hover:text-[#D4AF37] transition line-clamp-1">
                          {fabric.name}
                        </h4>
                        <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{fabric.weave_type} · {fabric.count}</p>
                      </div>

                      <div className="pt-3 mt-3 border-t border-black/5 dark:border-white/5 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-slate-400 block uppercase font-bold">Mill Price</span>
                          <span className="text-sm font-black">₹{fabric.price_per_meter} /m</span>
                        </div>
                        <button
                          onClick={() => {
                            setSelectedFabric(fabric);
                            setActiveStudioMode('fabrics');
                          }}
                          className="px-3.5 py-1.5 rounded-full bg-[#0F100F] dark:bg-white text-white dark:text-[#0F100F] text-xs font-bold hover:scale-105 transition flex items-center space-x-1"
                        >
                          <span>Drape & Print</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SECTION B: BLANK APPAREL & T-SHIRTS */}
            {(activeSubFilter === 'All' || activeSubFilter === 'Apparel') && filteredApparel.length > 0 && (
              <div className="space-y-4 pt-6 border-t border-black/5 dark:border-white/5">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#AC7900] dark:text-[#D4AF37]">
                      Category 2: Blank Apparel & Streetwear
                    </span>
                    <h3 className="text-xl font-bold font-editorial">Classic Tees, Oversized Hoodies & Polos ({filteredApparel.length})</h3>
                  </div>
                  <button 
                    onClick={() => setActiveStudioMode('apparel')}
                    className="text-xs font-bold text-[#AC7900] dark:text-[#D4AF37] hover:underline flex items-center space-x-1"
                  >
                    <span>View All Apparel Styles →</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {filteredApparel.slice(0, 8).map((apparel) => (
                    <div
                      key={apparel.id}
                      className="bg-white dark:bg-[#161716] rounded-3xl border border-black/[0.08] dark:border-white/10 p-4 shadow-sm hover:shadow-xl transition flex flex-col justify-between group"
                    >
                      <div>
                        <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#FAF7EE] dark:bg-black/30 mb-3 flex items-center justify-center p-3">
                          <img
                            src={apparel.mockupImages.front}
                            alt={apparel.name}
                            className="w-full h-full object-contain group-hover:scale-105 transition duration-300"
                          />
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-85">
                            <img src={globalArtworkUrl} alt="Logo" className="w-16 h-16 object-contain mix-blend-multiply dark:mix-blend-screen" />
                          </div>
                          {apparel.badge && (
                            <span className="absolute top-2 left-2 bg-[#AC7900]/15 text-[#AC7900] dark:text-[#D4AF37] text-[9px] font-bold px-2 py-0.5 rounded-full border border-[#AC7900]/20">
                              {apparel.badge}
                            </span>
                          )}
                          <span className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded">
                            {apparel.gsm} GSM
                          </span>
                        </div>
                        <h4 className="text-sm font-bold font-editorial group-hover:text-[#AC7900] dark:group-hover:text-[#D4AF37] transition">
                          {apparel.name}
                        </h4>
                        <p className="text-[11px] text-slate-500 mt-0.5">{apparel.fit} · {apparel.fabric}</p>
                      </div>

                      <div className="pt-3 mt-3 border-t border-black/5 dark:border-white/5 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-slate-400 block uppercase font-bold">Wholesale</span>
                          <span className="text-sm font-black">₹{apparel.basePrice}</span>
                        </div>
                        <button
                          onClick={() => {
                            setSelectedApparel(apparel);
                            setApparelModalOpen(true);
                          }}
                          className="px-3.5 py-1.5 rounded-full bg-[#0F100F] dark:bg-white text-white dark:text-[#0F100F] text-xs font-bold hover:scale-105 transition flex items-center space-x-1"
                        >
                          <span>Open Studio</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SECTION C: OTHER PRODUCTS & MERCH */}
            {(activeSubFilter === 'All' || activeSubFilter === 'Merch') && filteredMerch.length > 0 && (
              <div className="space-y-4 pt-6 border-t border-black/5 dark:border-white/5">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#AC7900] dark:text-[#D4AF37]">
                      Category 3: Caps, Drinkware & Merch
                    </span>
                    <h3 className="text-xl font-bold font-editorial">Dad Hats, Hydro Flasks, Mugs & Canvas Totes ({filteredMerch.length})</h3>
                  </div>
                  <button 
                    onClick={() => setActiveStudioMode('merch')}
                    className="text-xs font-bold text-[#AC7900] dark:text-[#D4AF37] hover:underline flex items-center space-x-1"
                  >
                    <span>View All Merch Items →</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {filteredMerch.slice(0, 8).map((merch) => (
                    <div
                      key={merch.id}
                      className="bg-white dark:bg-[#161716] rounded-3xl border border-black/[0.08] dark:border-white/10 p-4 shadow-sm hover:shadow-xl transition flex flex-col justify-between group"
                    >
                      <div>
                        <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#FAF7EE] dark:bg-black/30 mb-3 flex items-center justify-center p-3">
                          <img
                            src={merch.colors[0].image}
                            alt={merch.name}
                            className="w-full h-full object-contain group-hover:scale-105 transition duration-300"
                          />
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-85">
                            <img src={globalArtworkUrl} alt="Logo" className="w-14 h-14 object-contain drop-shadow" />
                          </div>
                          {merch.badge && (
                            <span className="absolute top-2 left-2 bg-[#AC7900]/15 text-[#AC7900] dark:text-[#D4AF37] text-[9px] font-bold px-2 py-0.5 rounded-full border border-[#AC7900]/20">
                              {merch.badge}
                            </span>
                          )}
                          <span className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded">
                            {merch.defaultDecoration}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold font-editorial group-hover:text-[#AC7900] dark:group-hover:text-[#D4AF37] transition line-clamp-1">
                          {merch.name}
                        </h4>
                        <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{merch.tagline}</p>
                      </div>

                      <div className="pt-3 mt-3 border-t border-black/5 dark:border-white/5 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-slate-400 block uppercase font-bold">Base Rate</span>
                          <span className="text-sm font-black">₹{merch.basePrice}</span>
                        </div>
                        <button
                          onClick={() => {
                            setSelectedMerch(merch);
                            setMerchModalOpen(true);
                          }}
                          className="px-3.5 py-1.5 rounded-full bg-[#0F100F] dark:bg-white text-white dark:text-[#0F100F] text-xs font-bold hover:scale-105 transition flex items-center space-x-1"
                        >
                          <span>Open Studio</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SECTION D: UNIFORMS & INSTITUTIONAL */}
            {(activeSubFilter === 'All' || activeSubFilter === 'Uniforms') && filteredUniforms.length > 0 && (
              <div className="space-y-4 pt-6 border-t border-black/5 dark:border-white/5">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#AC7900] dark:text-[#D4AF37]">
                      Category 4: Institutional Uniforms
                    </span>
                    <h3 className="text-xl font-bold font-editorial">School Plaids, Medical Scrubs & Suiting ({filteredUniforms.length})</h3>
                  </div>
                  <button 
                    onClick={() => setActiveStudioMode('uniforms')}
                    className="text-xs font-bold text-[#AC7900] dark:text-[#D4AF37] hover:underline flex items-center space-x-1"
                  >
                    <span>View Uniform Roll Meterage Estimator →</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {filteredUniforms.slice(0, 8).map((uniform) => (
                    <div
                      key={uniform.id}
                      className="bg-white dark:bg-[#161716] rounded-3xl border border-black/[0.08] dark:border-white/10 p-4 shadow-sm hover:shadow-xl transition flex flex-col justify-between group"
                    >
                      <div>
                        <div className="relative aspect-video rounded-2xl overflow-hidden bg-[#FAF7EE] dark:bg-black/30 mb-3">
                          <img
                            src={uniform.modelImage}
                            alt={uniform.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                          />
                          <span className="absolute top-2 left-2 bg-[#AC7900] text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                            {uniform.category}
                          </span>
                          <span className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded">
                            {uniform.gsm} GSM
                          </span>
                        </div>
                        <h4 className="text-sm font-bold font-editorial group-hover:text-[#AC7900] dark:group-hover:text-[#D4AF37] transition line-clamp-1">
                          {uniform.name}
                        </h4>
                        <p className="text-[11px] text-slate-500 mt-0.5">{uniform.weave} · {uniform.composition}</p>
                      </div>

                      <div className="pt-3 mt-3 border-t border-black/5 dark:border-white/5 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-slate-400 block uppercase font-bold">Standard</span>
                          <span className="text-xs font-bold text-[#AC7900] dark:text-[#D4AF37]">Custom Uniform</span>
                        </div>
                        <span className="text-xs font-bold text-slate-500">
                          {uniform.shades.length} Shades
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

        {/* ================= MODE 1: APPAREL & T-SHIRT STUDIO ================= */}
        {activeStudioMode === 'apparel' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#AC7900] dark:text-[#D4AF37]">
                  On-Garment Studio
                </span>
                <h3 className="text-2xl font-bold font-editorial">Select Apparel Style to Customize</h3>
                <p className="text-xs text-slate-500">Pick any garment to launch the interactive live crop, rotate, and jersey roster editor.</p>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-xs text-slate-500 font-semibold">14 Styles Ready</span>
              </div>
            </div>

            {/* Garment Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {APPAREL_PRODUCTS.map((apparel) => (
                <div
                  key={apparel.id}
                  className="bg-white dark:bg-[#161716] rounded-3xl border border-black/[0.08] dark:border-white/10 p-4 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#FAF7EE] dark:bg-black/30 mb-3 flex items-center justify-center p-3">
                      <img
                        src={apparel.mockupImages.front}
                        alt={apparel.name}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                      
                      {/* Live Draped Global Artwork Preview Badge on Garment */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-85">
                        <img
                          src={globalArtworkUrl}
                          alt="Artwork Placement"
                          className="w-20 h-20 object-contain drop-shadow-md mix-blend-multiply dark:mix-blend-screen"
                        />
                      </div>

                      {apparel.badge && (
                        <span className="absolute top-2 left-2 bg-[#AC7900]/15 text-[#AC7900] dark:text-[#D4AF37] text-[9px] font-bold px-2 py-0.5 rounded-full border border-[#AC7900]/20">
                          {apparel.badge}
                        </span>
                      )}
                      <span className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded">
                        {apparel.gsm} GSM
                      </span>
                    </div>

                    <h4 className="text-sm font-bold font-editorial group-hover:text-[#AC7900] dark:group-hover:text-[#D4AF37] transition">
                      {apparel.name}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">{apparel.fit} · {apparel.fabric}</p>
                  </div>

                  <div className="pt-3 mt-3 border-t border-black/5 dark:border-white/5 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">Wholesale</span>
                      <span className="text-sm font-black">₹{apparel.basePrice}</span>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedApparel(apparel);
                        setApparelModalOpen(true);
                      }}
                      className="px-4 py-2 rounded-full bg-[#0F100F] dark:bg-white text-white dark:text-[#0F100F] text-xs font-bold hover:scale-105 transition flex items-center space-x-1 shadow-sm"
                    >
                      <span>Open Studio</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= MODE 2: CUSTOM MERCH & BOTTLES ================= */}
        {activeStudioMode === 'merch' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#AC7900] dark:text-[#D4AF37]">
                  Caps, Drinkware & Lifestyle Merch
                </span>
                <h3 className="text-2xl font-bold font-editorial">Select Merchandise Blank to Customize</h3>
                <p className="text-xs text-slate-500">Pick dad hats, hydro flasks, mugs, or canvas totes to simulate 3D embroidery & UV direct print.</p>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-xs text-slate-500 font-semibold">16 Customizable Items</span>
              </div>
            </div>

            {/* Merch Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {CUSTOM_MERCH_PRODUCTS.map((merch) => (
                <div
                  key={merch.id}
                  className="bg-white dark:bg-[#161716] rounded-3xl border border-black/[0.08] dark:border-white/10 p-4 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#FAF7EE] dark:bg-black/30 mb-3 flex items-center justify-center p-3">
                      <img
                        src={merch.colors[0].image}
                        alt={merch.name}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                      />

                      {/* Live Draped Global Artwork Preview Badge on Merch */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-85">
                        <img
                          src={globalArtworkUrl}
                          alt="Artwork Placement"
                          className="w-16 h-16 object-contain drop-shadow-md"
                        />
                      </div>

                      {merch.badge && (
                        <span className="absolute top-2 left-2 bg-[#AC7900]/15 text-[#AC7900] dark:text-[#D4AF37] text-[9px] font-bold px-2 py-0.5 rounded-full border border-[#AC7900]/20">
                          {merch.badge}
                        </span>
                      )}
                      <span className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded">
                        {merch.defaultDecoration}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold font-editorial group-hover:text-[#AC7900] dark:group-hover:text-[#D4AF37] transition line-clamp-1">
                      {merch.name}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{merch.tagline}</p>
                  </div>

                  <div className="pt-3 mt-3 border-t border-black/5 dark:border-white/5 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">Base Rate</span>
                      <span className="text-sm font-black">₹{merch.basePrice}</span>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedMerch(merch);
                        setMerchModalOpen(true);
                      }}
                      className="px-4 py-2 rounded-full bg-[#0F100F] dark:bg-white text-white dark:text-[#0F100F] text-xs font-bold hover:scale-105 transition flex items-center space-x-1 shadow-sm"
                    >
                      <span>Open Studio</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= MODE 3: CUSTOM PRINTED FABRICS ================= */}
        {activeStudioMode === 'fabrics' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <FabricCustomizerModule
              initialProduct={selectedFabric}
              allProducts={products}
              onGoToCheckout={onGoToCheckout}
              onOpenBulkInquiry={onOpenBulkInquiry}
            />
          </div>
        )}

        {/* ================= MODE 4: INSTITUTIONAL UNIFORMS ================= */}
        {activeStudioMode === 'uniforms' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#AC7900] dark:text-[#D4AF37]">
                  Institutional Uniform Weaves
                </span>
                <h3 className="text-2xl font-bold font-editorial">School Checks, Scrubs & Suiting</h3>
                <p className="text-xs text-slate-500">Certified for 100+ industrial wash cycles with guaranteed 4–5 grade color fastness.</p>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-xs text-slate-500 font-semibold">Ready Stock Rolls</span>
              </div>
            </div>

            {/* Uniform Fabrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {UNIFORM_PRODUCTS.map((uniform) => (
                <div
                  key={uniform.id}
                  className="bg-white dark:bg-[#161716] rounded-3xl border border-black/[0.08] dark:border-white/10 p-4 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    <div className="relative aspect-video rounded-2xl overflow-hidden bg-[#FAF7EE] dark:bg-black/30 mb-3">
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

                    <h4 className="text-sm font-bold font-editorial group-hover:text-[#AC7900] dark:group-hover:text-[#D4AF37] transition line-clamp-1">
                      {uniform.name}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">{uniform.weave} · {uniform.composition}</p>
                  </div>

                  <div className="pt-3 mt-3 border-t border-black/5 dark:border-white/5 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">Standard</span>
                      <span className="text-xs font-bold text-[#AC7900] dark:text-[#D4AF37]">Custom Uniform</span>
                    </div>
                    <span className="text-xs font-bold text-slate-500">
                      {uniform.shades.length} Shades
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </section>

      {/* 🎨 5. INTERACTIVE APPAREL STUDIO MODAL */}
      <ApparelStudioModal
        product={selectedApparel}
        isOpen={apparelModalOpen}
        onClose={() => setApparelModalOpen(false)}
        onGoToCheckout={onGoToCheckout}
      />

      {/* 🧢 6. INTERACTIVE MERCH STUDIO MODAL */}
      <CustomMerchStudioModal
        product={selectedMerch}
        isOpen={merchModalOpen}
        onClose={() => setMerchModalOpen(false)}
        onGoToCheckout={onGoToCheckout}
      />

      {/* 🌐 7. SMART URL EXTRACTOR MODAL */}
      <SmartUrlImageExtractorModal
        isOpen={urlModalOpen}
        onClose={() => setUrlModalOpen(false)}
        onApplyExtractedImage={(info) => {
          setGlobalArtworkUrl(info.url);
          setUrlModalOpen(false);
        }}
      />

    </div>
  );
};

import React, { useState, useRef, useEffect } from 'react';
import {
  GraduationCap,
  Briefcase,
  Stethoscope,
  HardHat,
  Shield,
  UtensilsCrossed,
  ShieldCheck,
  Award,
  Sparkles,
  RotateCw,
  CheckCircle2,
  FileText,
  Phone,
  Layers,
  Palette,
  Calculator,
  ChevronRight,
  Check,
  Eye,
  Building2,
  Users,
  X,
  Compass,
  Maximize2,
  Tag,
  Sliders,
  Send,
  Download,
  Flame,
  CheckSquare,
  ArrowRight,
  ArrowLeft,
  MessageCircle,
  Scissors
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  UNIFORM_CATEGORIES,
  UNIFORM_PRODUCTS,
  UNIFORM_CERTIFICATIONS,
  UniformItem,
  UniformCategoryInfo
} from '../data/uniformData';
import { AnimatedBadge } from '../components/ui/animated-badge';

interface UniformPageProps {
  onGoToHome: () => void;
  onGoToCheckout?: () => void;
  onOpenBulkInquiry: () => void;
  onGoToOrder?: () => void;
}

export const UniformPage: React.FC<UniformPageProps> = ({
  onGoToHome,
  onOpenBulkInquiry,
  onGoToOrder
}) => {
  // Active selected sector: 'corporate' | 'industrial' | 'healthcare' | 'hospitality' | 'school'
  const [activeSectorId, setActiveSectorId] = useState<string>('hospitality');
  
  // Drill-down mode (when user clicks into a category to focus on its items)
  const [drillDownMode, setDrillDownMode] = useState<boolean>(true);

  // 3D Explorer Active State
  const [activeItemIndex, setActiveItemIndex] = useState<number>(0);
  const [explorerAngle, setExplorerAngle] = useState<'front' | 'angle' | 'detail'>('front');
  const [activeShadeIdx, setActiveShadeIdx] = useState<number>(0);
  const [showEmbroideryPreview, setShowEmbroideryPreview] = useState<boolean>(true);
  
  // 3D Card Interactive Tilt State
  const [tiltOffset, setTiltOffset] = useState({ x: 0, y: 0 });
  const stageRef = useRef<HTMLDivElement>(null);
  const drillDownSectionRef = useRef<HTMLDivElement>(null);

  // Modal State for Deep Inspection / Sample Request
  const [activeInspectItem, setActiveInspectItem] = useState<UniformItem | null>(null);
  const [modalActiveImageIdx, setModalActiveImageIdx] = useState<number>(0);
  const [modalSelectedShadeIdx, setModalSelectedShadeIdx] = useState<number>(0);
  const [sampleRequested, setSampleRequested] = useState<boolean>(false);

  // Institutional Requirement Planner State (Yardage & Roll Estimator - NO PRICING)
  const [plannerHeadcount, setPlannerHeadcount] = useState<number>(250);
  const [plannerSetsPerPerson, setPlannerSetsPerPerson] = useState<number>(2);

  // Active Category Data & Items
  const currentCategoryInfo = UNIFORM_CATEGORIES.find(c => c.id === activeSectorId) || UNIFORM_CATEGORIES[0];
  const sectorItems = UNIFORM_PRODUCTS.filter(p => p.categoryId === activeSectorId);
  const activeUniformItem = sectorItems[activeItemIndex] || sectorItems[0] || UNIFORM_PRODUCTS[0];

  // Active Shade for Current Explorer Item
  const currentShade = activeUniformItem.shades[activeShadeIdx] || activeUniformItem.shades[0];

  // Handle 3D Tilt on mouse move
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setTiltOffset({
      x: (x / rect.width) * 16,
      y: (y / rect.height) * -16
    });
  };

  const handleMouseLeave = () => {
    setTiltOffset({ x: 0, y: 0 });
  };

  // Switch Active Sector & Drill Down
  const handleSelectSector = (sectorId: string, itemIdx: number = 0) => {
    setActiveSectorId(sectorId);
    setActiveItemIndex(itemIdx);
    setActiveShadeIdx(0);
    setExplorerAngle('front');
    setDrillDownMode(true);
    
    // Smooth scroll down to the category drill-down view
    setTimeout(() => {
      drillDownSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  // Open modal inspection
  const handleOpenInspection = (item: UniformItem) => {
    setActiveInspectItem(item);
    setModalActiveImageIdx(0);
    setModalSelectedShadeIdx(0);
    setSampleRequested(false);
  };

  // Yardage calculation (meters per uniform set based on sector)
  const getMetersPerSet = (sector: string) => {
    switch (sector) {
      case 'corporate': return 2.85; // Trouser + Shirt
      case 'industrial': return 3.20; // Heavy Coverall / Cargo + Vest
      case 'healthcare': return 2.50; // Scrub Top + Pant
      case 'hospitality': return 2.70; // Chef Coat + Apron
      case 'school': return 2.30; // Shirt + Trouser/Skirt
      default: return 2.50;
    }
  };

  const metersPerSet = getMetersPerSet(activeSectorId);
  const totalMetersEstimated = Math.round(plannerHeadcount * plannerSetsPerPerson * metersPerSet);
  const estimatedStandardRolls = Math.ceil(totalMetersEstimated / 50);

  // Active Explorer Image based on angle
  const getExplorerImage = () => {
    if (explorerAngle === 'front') {
      return activeUniformItem.modelImage;
    } else if (explorerAngle === 'angle') {
      return activeUniformItem.gallery[1] || activeUniformItem.swatchImage || activeUniformItem.modelImage;
    } else {
      return activeUniformItem.swatchImage || activeUniformItem.modelImage;
    }
  };

  return (
    <div className="w-full bg-[#FEFBF1] dark:bg-[#0F100F] text-[#0F100F] dark:text-white transition-colors duration-300">
      
      {/* 🧭 TOP HEADER BAR: NAVIGATION & DIRECT CALL/WHATSAPP */}
      <div className="border-b border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#121312] sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2 text-slate-500 font-medium">
            <button onClick={onGoToHome} className="hover:text-black dark:hover:text-white transition font-bold">
              Home
            </button>
            <span className="text-slate-400">—</span>
            <span className="text-black dark:text-white font-bold">Custom Uniforms &amp; Workwear</span>
            {drillDownMode && (
              <>
                <span className="text-slate-400">—</span>
                <span className="text-[#AC7900] dark:text-[#D4AF37] font-bold">{currentCategoryInfo.title}</span>
              </>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
            <a
              href="tel:+918903120006"
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 font-bold text-slate-700 dark:text-slate-300 transition"
            >
              <Phone className="w-3.5 h-3.5 text-[#AC7900] dark:text-[#D4AF37]" />
              <span>+91 8903120006</span>
            </a>

            <a
              href="https://wa.me/918903120006?text=Hi%20Fabric%20Print%2C%20I%20would%20like%20to%20inquire%20about%20custom%20uniform%20manufacturing"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-bold transition border border-emerald-500/20"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp Us</span>
            </a>

            <button
              onClick={onOpenBulkInquiry}
              className="flex items-center space-x-1.5 px-4 py-1.5 rounded-full bg-[#0F100F] dark:bg-white text-white dark:text-[#0F100F] font-bold shadow-sm hover:opacity-90 transition hover:scale-105"
            >
              <span>Request Uniform Quote</span>
              <Send className="w-3.5 h-3.5 text-[#D4AF37]" />
            </button>
          </div>
        </div>
      </div>

      {/* 🌟 1. SECTOR EXPLORATION CARDS (Proper aspect ratio & full character model visibility) */}
      <section className="bg-white dark:bg-[#111211] py-10 sm:py-14 border-b border-black/[0.06] dark:border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          


          {/* 5 Industry Sector Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
            {UNIFORM_CATEGORIES.map(cat => {
              const isSelected = activeSectorId === cat.id;
              const SectorIcon =
                cat.id === 'corporate' ? Briefcase
                : cat.id === 'industrial' ? HardHat
                : cat.id === 'healthcare' ? Stethoscope
                : cat.id === 'hospitality' ? UtensilsCrossed
                : GraduationCap;
              return (
                <div
                  key={cat.id}
                  onClick={() => handleSelectSector(cat.id)}
                  className={`group relative flex flex-col items-center text-center p-4 rounded-3xl border transition-all duration-300 cursor-pointer overflow-hidden ${
                    isSelected
                      ? 'border-[#AC7900] dark:border-[#D4AF37] bg-gradient-to-b from-amber-500/10 via-amber-500/[0.03] to-transparent shadow-xl ring-2 ring-[#AC7900]/40 scale-[1.02]'
                      : 'border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#161716] hover:border-[#AC7900]/60 hover:shadow-lg hover:scale-[1.01]'
                  }`}
                >
                  {/* Selected Indicator Pill */}
                  {isSelected && (
                    <div className="absolute top-3 right-3 bg-[#AC7900] dark:bg-[#D4AF37] text-white dark:text-black p-1 rounded-full shadow-md z-10">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}

                  {/* Character Model Image with clean height and containment */}
                  <div className="w-full h-64 sm:h-72 rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-900/60 flex items-center justify-center p-2 mb-3">
                    <img
                      src={cat.heroImage}
                      alt={cat.title}
                      className="h-full w-full object-contain filter drop-shadow-md group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Title & Listed Items */}
                  <h3 className="text-sm sm:text-base font-bold text-[#0F100F] dark:text-white leading-tight flex items-center justify-center gap-1.5">
                    <SectorIcon className="w-4 h-4 text-[#AC7900] dark:text-[#D4AF37] shrink-0" />
                    {cat.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium mt-1 mb-3 line-clamp-2">
                    {cat.highlightItems.join(' • ')}
                  </p>

                  {/* Action Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectSector(cat.id);
                    }}
                    className={`w-full py-2 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center space-x-1.5 ${
                      isSelected
                        ? 'bg-[#0F100F] dark:bg-white text-white dark:text-black font-extrabold'
                        : 'bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    <span>{isSelected ? 'Viewing Items' : 'Explore Sector'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 🚀 2. DEDICATED CATEGORY DRILL-DOWN & 3D MOCKUP CUSTOMIZER */}
      <section ref={drillDownSectionRef} id="uniform-category-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 scroll-mt-16">
        


        {/* Sub-Item Selector Tabs for the Current Category */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-8 bg-amber-500/[0.04] p-3 rounded-2xl border border-amber-500/20">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mr-2 flex items-center space-x-1">
            <Layers className="w-3.5 h-3.5 text-[#AC7900]" />
            <span>Available Types ({sectorItems.length}):</span>
          </span>
          {sectorItems.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveItemIndex(idx);
                setActiveShadeIdx(0);
                setExplorerAngle('front');
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
                activeItemIndex === idx
                  ? 'bg-[#AC7900] dark:bg-[#D4AF37] text-white dark:text-slate-950 shadow-md scale-105 ring-2 ring-[#AC7900]/30'
                  : 'bg-white dark:bg-[#161716] hover:bg-black/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 border border-black/10 dark:border-white/10'
              }`}
            >
              <Tag className="w-3.5 h-3.5 shrink-0 opacity-70" />
              <span>{item.name}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${activeItemIndex === idx ? 'bg-black/20 text-white dark:text-black' : 'bg-black/5 dark:bg-white/5 text-slate-400'}`}>
                {item.code}
              </span>
            </button>
          ))}
        </div>

        {/* 🌟 MAIN 3D SHOWCASE & INTERACTIVE CUSTOMIZER CARD */}
        <div className="bg-gradient-to-br from-white via-amber-500/[0.02] to-stone-50 dark:from-[#151615] dark:via-[#111211] dark:to-[#171817] rounded-[32px] border border-black/10 dark:border-white/10 p-6 sm:p-10 shadow-xl overflow-hidden relative mb-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left 7 Cols: 3D Interactive Mockup Stage with Perspective Tilt */}
            <div className="lg:col-span-7 relative">
              
              <div
                ref={stageRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="relative aspect-[4/3] sm:aspect-[16/11] rounded-3xl overflow-hidden bg-gradient-to-b from-stone-100 to-amber-100/30 dark:from-stone-900/60 dark:to-stone-950 border border-black/10 dark:border-white/10 flex items-center justify-center p-6 transition-transform duration-200 cursor-grab active:cursor-grabbing shadow-inner group"
                style={{
                  perspective: '1000px',
                  transform: `rotateY(${tiltOffset.x}deg) rotateX(${tiltOffset.y}deg)`
                }}
              >
                {/* Background Ambient Glow */}
                <div
                  className="absolute inset-0 opacity-40 blur-3xl pointer-events-none transition-colors duration-500"
                  style={{ backgroundColor: `${currentShade.hex}25` }}
                />

                {/* 3D Uniform Mockup Image */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${activeUniformItem.id}-${explorerAngle}`}
                    initial={{ opacity: 0, scale: 0.94, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                    className="relative w-full h-full flex items-center justify-center"
                  >
                    <img
                      src={getExplorerImage()}
                      alt={activeUniformItem.name}
                      className="max-h-full max-w-full object-contain filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.25)] transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Live Logo / Embroidery Simulation Overlay */}
                    {showEmbroideryPreview && (
                      <div className="absolute top-[28%] left-[58%] -translate-x-1/2 -translate-y-1/2 pointer-events-none animate-in fade-in duration-300">
                        <div className="bg-black/80 dark:bg-white/90 backdrop-blur-md px-2 py-0.5 rounded text-[9px] font-bold text-white dark:text-black border border-white/20 shadow-md tracking-wider flex items-center space-x-1">
                          <Sparkles className="w-2.5 h-2.5 text-[#D4AF37]" />
                          <span>LOGO EMBROIDERY</span>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Top Overlay Badges */}
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-[#0F100F]/80 dark:bg-black/80 backdrop-blur-md text-white border border-white/20">
                    {activeUniformItem.category}
                  </span>
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-[#D4AF37] text-slate-950 shadow-sm">
                    {activeUniformItem.code}
                  </span>
                </div>

                <div className="absolute top-4 right-4 bg-white/90 dark:bg-black/80 backdrop-blur-md text-[10px] font-bold px-3 py-1 rounded-full text-slate-700 dark:text-slate-200 border border-black/10 dark:border-white/20">
                  Premium Tailored Quality
                </div>

                {/* Bottom View Controls Overlay */}
                <div className="absolute bottom-4 inset-x-4 flex items-center justify-between pointer-events-auto">
                  
                  {/* Angle Switcher */}
                  <div className="flex items-center space-x-1 bg-white/90 dark:bg-black/85 backdrop-blur-md p-1 rounded-2xl border border-black/10 dark:border-white/15 shadow-md">
                    <button
                      onClick={() => setExplorerAngle('front')}
                      className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition flex items-center gap-1 ${
                        explorerAngle === 'front'
                          ? 'bg-[#0F100F] dark:bg-white text-white dark:text-[#0F100F]'
                          : 'text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white'
                      }`}
                    >
                      <Eye className="w-3 h-3 shrink-0" />
                      3D Front
                    </button>
                    <button
                      onClick={() => setExplorerAngle('angle')}
                      className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition flex items-center gap-1 ${
                        explorerAngle === 'angle'
                          ? 'bg-[#0F100F] dark:bg-white text-white dark:text-[#0F100F]'
                          : 'text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white'
                      }`}
                    >
                      <RotateCw className="w-3 h-3 shrink-0" />
                      Perspective
                    </button>
                    <button
                      onClick={() => setExplorerAngle('detail')}
                      className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition flex items-center gap-1 ${
                        explorerAngle === 'detail'
                          ? 'bg-[#0F100F] dark:bg-white text-white dark:text-[#0F100F]'
                          : 'text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white'
                      }`}
                    >
                      <Maximize2 className="w-3 h-3 shrink-0" />
                      Weave
                    </button>
                  </div>

                  {/* Toggle Branding Simulation */}
                  <button
                    onClick={() => setShowEmbroideryPreview(prev => !prev)}
                    className={`px-3 py-1.5 rounded-2xl text-[11px] font-bold backdrop-blur-md border transition flex items-center space-x-1.5 shadow-md ${
                      showEmbroideryPreview
                        ? 'bg-[#AC7900] text-white border-[#AC7900]'
                        : 'bg-white/90 dark:bg-black/85 text-slate-700 dark:text-slate-300 border-black/10 dark:border-white/15'
                    }`}
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>{showEmbroideryPreview ? 'Logo Active' : 'Preview Logo'}</span>
                  </button>

                </div>

              </div>

              <div className="text-center mt-2">
                <span className="text-[10px] text-slate-400 font-medium">
                  ✦ Move cursor over mockup to interact with 3D perspective tilt
                </span>
              </div>

            </div>

            {/* Right 5 Cols: Technical Specifications & Live Color Palette */}
            <div className="lg:col-span-5 space-y-4">
              
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#AC7900] dark:text-[#D4AF37]">
                  {activeUniformItem.category} Range
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold font-editorial text-[#0F100F] dark:text-white mt-0.5">
                  {activeUniformItem.name}
                </h3>
                <p className="text-xs text-[#AC7900] dark:text-[#D4AF37] font-semibold mt-0.5">
                  {activeUniformItem.subtitle}
                </p>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                  {activeUniformItem.description}
                </p>
              </div>



              {/* Key Features List */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Institutional Performance Standards:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {activeUniformItem.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-center space-x-1.5 text-xs text-slate-700 dark:text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span className="truncate">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* LIVE COLOR SHADE SWATCHES */}
              <div className="pt-2 border-t border-black/[0.08] dark:border-white/[0.08]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Available Shades ({activeUniformItem.shades.length} Colors):
                  </span>
                  <span className="text-xs font-bold text-[#AC7900] dark:text-[#D4AF37]">
                    {currentShade.name} ({currentShade.code})
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {activeUniformItem.shades.map((shade, sIdx) => (
                    <button
                      key={shade.code}
                      onClick={() => setActiveShadeIdx(sIdx)}
                      className={`w-7 h-7 rounded-full border-2 transition-all flex items-center justify-center ${
                        activeShadeIdx === sIdx
                          ? 'border-[#0F100F] dark:border-white scale-125 shadow-md ring-2 ring-[#AC7900]/50'
                          : 'border-black/20 dark:border-white/20 hover:scale-110'
                      }`}
                      style={{ backgroundColor: shade.hex }}
                      title={shade.name}
                    >
                      {activeShadeIdx === sIdx && (
                        <Check className={`w-3.5 h-3.5 ${shade.hex === '#FFFFFF' || shade.hex === '#FAFAFA' ? 'text-black' : 'text-white'}`} />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons with Direct Order & Contact */}
              <div className="pt-3 space-y-2.5">
                <div className="flex flex-wrap gap-2.5">
                  <button
                    onClick={onOpenBulkInquiry}
                    className="flex-1 py-3 px-5 rounded-2xl bg-[#0F100F] dark:bg-white text-white dark:text-[#0F100F] text-xs font-bold hover:opacity-90 transition flex items-center justify-center space-x-2 shadow-md hover:scale-[1.02]"
                  >
                    <span>Send Uniform Inquiry / Request Quote</span>
                    <Send className="w-4 h-4 text-[#D4AF37]" />
                  </button>

                  <button
                    onClick={() => handleOpenInspection(activeUniformItem)}
                    className="py-3 px-4 rounded-2xl border border-black/15 dark:border-white/15 text-xs font-bold hover:bg-black/5 dark:hover:bg-white/5 transition flex items-center justify-center space-x-1.5"
                  >
                    <Eye className="w-4 h-4" />
                    <span>3D Specs</span>
                  </button>
                </div>

                {/* Direct Contact Hotline & WhatsApp */}
                <div className="flex items-center justify-between pt-2 border-t border-black/5 dark:border-white/5 text-[11px]">
                  <div className="flex items-center space-x-2">
                    <a
                      href="tel:+918903120006"
                      className="flex items-center space-x-1 font-bold text-slate-700 dark:text-slate-300 hover:text-black dark:hover:text-white transition"
                    >
                      <Phone className="w-3.5 h-3.5 text-[#AC7900] dark:text-[#D4AF37]" />
                      <span>+91 8903120006</span>
                    </a>
                    <span className="text-slate-300 dark:text-slate-700">•</span>
                    <a
                      href="https://wa.me/918903120006?text=Hi%20Fabric%20Print%2C%20I%20want%20to%20order%20custom%20uniforms"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1 text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp Specialist</span>
                    </a>
                  </div>

                  <button
                    onClick={onOpenBulkInquiry}
                    className="text-[#AC7900] dark:text-[#D4AF37] font-bold hover:underline"
                  >
                    Request Callback →
                  </button>
                </div>
              </div>

            </div>

          </div>

        </div>



      </section>

      {/* 📊 4. INSTITUTIONAL UNIFORM YARDAGE & ROLL ESTIMATOR (ZERO PRICING / AMOUNTS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 border-t border-black/10 dark:border-white/10">
        <div className="bg-gradient-to-r from-amber-500/10 via-stone-500/5 to-amber-500/10 rounded-3xl p-6 sm:p-10 border border-[#AC7900]/20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-6 space-y-4">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#AC7900]/15 text-[#AC7900] dark:text-[#D4AF37] text-xs font-bold">
                <Calculator className="w-3.5 h-3.5" />
                <span>Institutional Fabric Volume Planner</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold font-editorial">
                Plan Exact Fabric Yardage for Your School, Clinic, or Workforce
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                Eliminate uniform shortfall or inventory wastage. Enter your personnel headcount to compute total required meterage and roll batches for institutional weaving.
              </p>

              {/* Calculator Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                    Personnel Headcount
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="20000"
                    value={plannerHeadcount}
                    onChange={e => setPlannerHeadcount(Math.max(1, parseInt(e.target.value) || 0))}
                    className="w-full bg-white dark:bg-[#181918] border border-black/10 dark:border-white/15 rounded-xl px-3 py-2 text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                    Uniform Sets / Person
                  </label>
                  <select
                    value={plannerSetsPerPerson}
                    onChange={e => setPlannerSetsPerPerson(parseInt(e.target.value) || 2)}
                    className="w-full bg-white dark:bg-[#181918] border border-black/10 dark:border-white/15 rounded-xl px-3 py-2 text-xs font-bold"
                  >
                    <option value="1">1 Set (Trial / Sample)</option>
                    <option value="2">2 Sets (Standard Annual)</option>
                    <option value="3">3 Sets (Comprehensive)</option>
                    <option value="4">4 Sets (Continuous Shift)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Right 6 Cols: Result Yardage Breakdown (NO PRICES) */}
            <div className="lg:col-span-6 bg-white dark:bg-[#161716] p-6 rounded-3xl border border-black/10 dark:border-white/10 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-black/5 dark:border-white/5">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {currentCategoryInfo.title} Projection
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                  Mill Direct Dispatch
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs text-slate-500 block">Total Fabric Required</span>
                  <span className="text-3xl font-black font-editorial text-[#0F100F] dark:text-white">
                    {totalMetersEstimated.toLocaleString('en-IN')} <span className="text-base font-normal text-slate-500">Meters</span>
                  </span>
                  <p className="text-[11px] text-slate-400 mt-0.5">Approx. {estimatedStandardRolls} Standard Mill Rolls (50m each)</p>
                </div>

                <div className="text-right">
                  <span className="text-xs text-slate-500 block">Estimated Production</span>
                  <span className="text-2xl font-black font-editorial text-[#AC7900] dark:text-[#D4AF37]">
                    5 - 7 Days
                  </span>
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold block">
                    Fast Track Mill Dispatch
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-black/5 dark:border-white/5 flex gap-3">
                <button
                  onClick={onOpenBulkInquiry}
                  className="flex-1 py-3 rounded-full bg-[#0F100F] dark:bg-white text-white dark:text-[#0F100F] font-bold text-xs shadow-md hover:opacity-90 transition flex items-center justify-center space-x-2"
                >
                  <FileText className="w-4 h-4 text-[#D4AF37]" />
                  <span>Submit Institutional Tender / RFQ</span>
                </button>

                <button
                  onClick={onOpenBulkInquiry}
                  className="px-5 py-3 rounded-full border border-black/15 dark:border-white/15 text-xs font-bold hover:bg-black/5 dark:hover:bg-white/5 transition flex items-center space-x-1"
                >
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  <span>Consult Specialist</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 🏆 5. CERTIFICATIONS & INSTITUTIONAL QUALITY PILLARS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 border-t border-black/10 dark:border-white/10">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-[#AC7900] dark:text-[#D4AF37]">
            Institutional Assurance
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-editorial mt-1">
            Why Leading Institutions Choose Our Weaves
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {UNIFORM_CERTIFICATIONS.map(cert => (
            <div
              key={cert.title}
              className="p-6 rounded-3xl bg-white dark:bg-[#161716] border border-black/10 dark:border-white/10 space-y-3"
            >
              <div className="w-10 h-10 rounded-2xl bg-[#AC7900]/10 text-[#AC7900] dark:text-[#D4AF37] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold">{cert.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{cert.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 🔍 MODAL: FULL 3D INSPECTION & SPECIFICATION SHEET (NO PRICING) */}
      {activeInspectItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-[#161716] text-[#0F100F] dark:text-white rounded-[32px] p-6 sm:p-8 border border-black/10 dark:border-white/10 shadow-2xl">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-black/10 dark:border-white/10">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#AC7900] dark:text-[#D4AF37]">
                  {activeInspectItem.category} • Uniform Specification
                </span>
                <h3 className="text-xl sm:text-2xl font-bold font-editorial">{activeInspectItem.name}</h3>
                <p className="text-xs text-[#AC7900] dark:text-[#D4AF37] font-semibold">{activeInspectItem.subtitle}</p>
              </div>
              <button
                onClick={() => setActiveInspectItem(null)}
                className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 my-6">
              
              {/* Left 6 Cols: Photo Gallery */}
              <div className="md:col-span-6 space-y-3">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-black/10 dark:border-white/10 flex items-center justify-center p-4">
                  <img
                    src={activeInspectItem.gallery[modalActiveImageIdx] || activeInspectItem.modelImage}
                    alt={activeInspectItem.name}
                    className="max-h-full max-w-full object-contain p-2"
                  />
                </div>

                {/* Thumbnails */}
                <div className="flex gap-2">
                  {activeInspectItem.gallery.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setModalActiveImageIdx(idx)}
                      className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition p-1 bg-slate-50 dark:bg-slate-800 ${
                        modalActiveImageIdx === idx
                          ? 'border-[#AC7900] dark:border-[#D4AF37] scale-105'
                          : 'border-black/10 dark:border-white/10 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="Angle" className="w-full h-full object-contain" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Right 6 Cols: Detailed Specifications & Custom Options */}
              <div className="md:col-span-6 space-y-4">
                
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Key Uniform Features:
                  </h4>
                  <div className="space-y-1.5 text-xs">
                    {activeInspectItem.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-center space-x-2 py-1 border-b border-black/5 dark:border-white/5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span className="text-slate-700 dark:text-slate-300 font-medium">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Available Sizes Matrix */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Available Sizing:
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {activeInspectItem.sizes.map(sz => (
                      <span key={sz} className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10">
                        {sz}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Color Shade Swatches */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Select Shade:
                    </h4>
                    <span className="text-xs font-bold text-[#AC7900] dark:text-[#D4AF37]">
                      {activeInspectItem.shades[modalSelectedShadeIdx]?.name}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {activeInspectItem.shades.map((shade, idx) => (
                      <button
                        key={shade.code}
                        onClick={() => setModalSelectedShadeIdx(idx)}
                        className={`w-7 h-7 rounded-full border-2 transition flex items-center justify-center ${
                          modalSelectedShadeIdx === idx
                            ? 'border-[#0F100F] dark:border-white scale-110 shadow-md ring-2 ring-[#AC7900]/40'
                            : 'border-black/20 dark:border-white/20'
                        }`}
                        style={{ backgroundColor: shade.hex }}
                        title={shade.name}
                      >
                        {modalSelectedShadeIdx === idx && (
                          <Check className={`w-3.5 h-3.5 ${shade.hex === '#FFFFFF' ? 'text-black' : 'text-white'}`} />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Branding Checklist */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Institutional Customization:
                  </h4>
                  <div className="grid grid-cols-2 gap-1.5 text-xs text-slate-600 dark:text-slate-300">
                    {activeInspectItem.customizations.map(c => (
                      <div key={c} className="flex items-center space-x-1">
                        <CheckSquare className="w-3.5 h-3.5 text-[#AC7900] shrink-0" />
                        <span className="truncate">{c}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>

            {/* Modal Action Bar with Direct Order & Contact */}
            <div className="pt-4 border-t border-black/10 dark:border-white/10 flex flex-wrap gap-3 items-center justify-between">
              <div className="flex items-center space-x-3 text-xs">
                <a
                  href="tel:+918903120006"
                  className="flex items-center space-x-1.5 text-slate-700 dark:text-slate-300 font-bold hover:underline"
                >
                  <Phone className="w-3.5 h-3.5 text-[#AC7900] dark:text-[#D4AF37]" />
                  <span>Call: +91 8903120006</span>
                </a>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <a
                  href="https://wa.me/918903120006?text=Hi%20Fabric%20Print%2C%20I%20am%20interested%20in%20custom%20uniform%20orders"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1 text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    setSampleRequested(true);
                    setTimeout(() => {
                      onOpenBulkInquiry();
                      setActiveInspectItem(null);
                    }, 800);
                  }}
                  className="px-4 py-2.5 rounded-full border border-black/15 dark:border-white/15 text-xs font-bold hover:bg-black/5 dark:hover:bg-white/5 transition flex items-center space-x-1.5"
                >
                  <Send className="w-3.5 h-3.5 text-[#AC7900] dark:text-[#D4AF37]" />
                  <span>{sampleRequested ? 'Sample Added ✓' : 'Request Swatch Sample'}</span>
                </button>

                <button
                  onClick={() => {
                    setActiveInspectItem(null);
                    onOpenBulkInquiry();
                  }}
                  className="px-6 py-2.5 rounded-full bg-[#0F100F] dark:bg-white text-white dark:text-[#0F100F] text-xs font-bold shadow-md hover:opacity-90 transition flex items-center space-x-1.5"
                >
                  <span>Send Manufacturing Inquiry</span>
                  <Send className="w-3.5 h-3.5 text-[#D4AF37]" />
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

import React, { useState, useEffect, useRef } from 'react';
import {
  ShoppingBag,
  Heart,
  User,
  Search,
  Menu,
  X,
  Printer,
  Sparkles,
  ChevronDown,
  ChevronRight,
  Layers,
  Globe,
  BookOpen,
  Sun,
  Moon,
  ArrowRight,
  Shirt,
  GraduationCap,
  FileText,
  Trophy
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useTheme } from '../context/ThemeContext';
import { SmartUrlImageExtractorModal } from './SmartUrlImageExtractorModal';
import { SwatchBookOrderModal } from './SwatchBookOrderModal';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenBulkInquiry: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  setSearchQuery,
  onOpenBulkInquiry
}) => {
  const { currentUser, isAdmin, toggleAdminMode } = useAuth();
  const { cart, setIsCartOpen } = useCart();
  const { wishlist } = useWishlist();
  const { isDark, toggleTheme } = useTheme();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileAccordion, setMobileAccordion] = useState<string | null>('fabrics');
  const [currency, setCurrency] = useState<string>('INR');
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [apparelMenuOpen, setApparelMenuOpen] = useState(false);
  const [uniformMenuOpen, setUniformMenuOpen] = useState(false);
  const [merchMenuOpen, setMerchMenuOpen] = useState(false);
  const [trainingMenuOpen, setTrainingMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Debounced Hover Timeouts (Prevents accidental close and tooltip flicker)
  const apparelTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const uniformTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const merchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const trainingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Modals
  const [urlModalOpen, setUrlModalOpen] = useState(false);
  const [swatchModalOpen, setSwatchModalOpen] = useState(false);

  const currencies = [
    { code: 'INR', symbol: '₹', label: 'INR (₹)' },
    { code: 'USD', symbol: '$', label: 'USD ($)' },
    { code: 'EUR', symbol: '€', label: 'EUR (€)' },
    { code: 'GBP', symbol: '£', label: 'GBP (£)' },
    { code: 'AED', symbol: 'AED', label: 'AED (د.إ)' },
  ];

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + (item.itemTotalPrice || (item.calculatedPricePerUnit || 0) * item.quantity), 0);

  // Hover handlers with smooth grace period (300ms buffer)
  const handleApparelEnter = () => {
    if (apparelTimeoutRef.current) clearTimeout(apparelTimeoutRef.current);
    if (uniformTimeoutRef.current) clearTimeout(uniformTimeoutRef.current);
    if (merchTimeoutRef.current) clearTimeout(merchTimeoutRef.current);
    if (trainingTimeoutRef.current) clearTimeout(trainingTimeoutRef.current);
    setUniformMenuOpen(false);
    setMerchMenuOpen(false);
    setTrainingMenuOpen(false);
    setApparelMenuOpen(true);
  };

  const handleApparelLeave = () => {
    if (apparelTimeoutRef.current) clearTimeout(apparelTimeoutRef.current);
    apparelTimeoutRef.current = setTimeout(() => {
      setApparelMenuOpen(false);
    }, 300);
  };

  const handleUniformEnter = () => {
    if (apparelTimeoutRef.current) clearTimeout(apparelTimeoutRef.current);
    if (uniformTimeoutRef.current) clearTimeout(uniformTimeoutRef.current);
    if (merchTimeoutRef.current) clearTimeout(merchTimeoutRef.current);
    if (trainingTimeoutRef.current) clearTimeout(trainingTimeoutRef.current);
    setApparelMenuOpen(false);
    setMerchMenuOpen(false);
    setTrainingMenuOpen(false);
    setUniformMenuOpen(true);
  };

  const handleUniformLeave = () => {
    if (uniformTimeoutRef.current) clearTimeout(uniformTimeoutRef.current);
    uniformTimeoutRef.current = setTimeout(() => {
      setUniformMenuOpen(false);
    }, 300);
  };

  const handleMerchEnter = () => {
    if (apparelTimeoutRef.current) clearTimeout(apparelTimeoutRef.current);
    if (uniformTimeoutRef.current) clearTimeout(uniformTimeoutRef.current);
    if (merchTimeoutRef.current) clearTimeout(merchTimeoutRef.current);
    if (trainingTimeoutRef.current) clearTimeout(trainingTimeoutRef.current);
    setApparelMenuOpen(false);
    setUniformMenuOpen(false);
    setTrainingMenuOpen(false);
    setMerchMenuOpen(true);
  };

  const handleMerchLeave = () => {
    if (merchTimeoutRef.current) clearTimeout(merchTimeoutRef.current);
    merchTimeoutRef.current = setTimeout(() => {
      setMerchMenuOpen(false);
    }, 300);
  };

  const handleTrainingEnter = () => {
    if (apparelTimeoutRef.current) clearTimeout(apparelTimeoutRef.current);
    if (uniformTimeoutRef.current) clearTimeout(uniformTimeoutRef.current);
    if (merchTimeoutRef.current) clearTimeout(merchTimeoutRef.current);
    if (trainingTimeoutRef.current) clearTimeout(trainingTimeoutRef.current);
    setApparelMenuOpen(false);
    setUniformMenuOpen(false);
    setMerchMenuOpen(false);
    setTrainingMenuOpen(true);
  };

  const handleTrainingLeave = () => {
    if (trainingTimeoutRef.current) clearTimeout(trainingTimeoutRef.current);
    trainingTimeoutRef.current = setTimeout(() => {
      setTrainingMenuOpen(false);
    }, 300);
  };

  // Close all open menus when clicking anywhere outside
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const headerEl = document.getElementById('main-header');
      if (headerEl && !headerEl.contains(e.target as Node)) {
        setApparelMenuOpen(false);
        setUniformMenuOpen(false);
        setMerchMenuOpen(false);
        setTrainingMenuOpen(false);
        setCurrencyOpen(false);
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleGlobalClick);
    return () => {
      document.removeEventListener('mousedown', handleGlobalClick);
      if (apparelTimeoutRef.current) clearTimeout(apparelTimeoutRef.current);
      if (uniformTimeoutRef.current) clearTimeout(uniformTimeoutRef.current);
      if (merchTimeoutRef.current) clearTimeout(merchTimeoutRef.current);
      if (trainingTimeoutRef.current) clearTimeout(trainingTimeoutRef.current);
    };
  }, []);

  // Global Keyboard Shortcut: ⌘K or Ctrl+K to search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
        setIsSearchFocused(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setActiveTab('fabrics');
      setIsSearchFocused(false);
    }
  };

  const quickSearchSuggestions = [
    'Pure Silk',
    'Heavy Cotton 240 GSM',
    'School Uniform Checks',
    'Oversized Tees',
    'Rayon Slub',
    'Anti-Microbial Scrubs'
  ];

  // Helper class for cohesive, elegant navigation buttons
  const getNavButtonClass = (tabName: string) => {
    const isActive =
      activeTab === tabName ||
      (tabName === 'fabrics' && activeTab === 'product-detail') ||
      (tabName === 'apparel' && (activeTab === 'apparel' || activeTab === 'apparel-studio'));
    return `px-2.5 xl:px-3.5 py-1.5 rounded-full transition-all duration-150 flex items-center space-x-1 whitespace-nowrap text-[11px] xl:text-xs font-semibold ${isActive
        ? 'bg-[#0F100F] text-white dark:bg-white dark:text-[#0F100F] font-bold shadow-sm'
        : 'text-[#0F100F] dark:text-white/80 hover:bg-black/5 dark:hover:bg-white/5'
      }`;
  };

  return (
    <header className="sticky top-0 z-50 transition-colors duration-300 font-sans" id="main-header">

      {/* ⚡ 1. TOP UTILITY BAR */}
      <div className="bg-[#0D0E0D] text-white/90 py-1.5 px-4 sm:px-8 border-b border-white/[0.08] text-[11px] select-none">
        <div className="max-w-7xl mx-auto flex items-center justify-end gap-4">

          {/* Right: Swatch Book, Currency, Theme & Admin */}
          <div className="flex items-center space-x-3 shrink-0">

            {/* Swatch Kit Direct Action */}
            <button
              onClick={() => setSwatchModalOpen(true)}
              className="text-[#D4AF37] hover:text-white transition-colors duration-150 flex items-center space-x-1.5 font-semibold group relative"
            >
              <BookOpen className="w-3 h-3 text-[#D4AF37] group-hover:scale-110 transition-transform" />
              <span className="hidden md:inline">Sample Book <span className="text-white/60 font-normal">(₹499)</span></span>
            </button>

            <span className="text-white/20 hidden sm:inline">|</span>

            {/* Currency Selector */}
            <div className="relative">
              <button
                onClick={() => setCurrencyOpen(!currencyOpen)}
                className="flex items-center space-x-1 px-2.5 py-0.5 rounded-full border border-white/15 hover:border-white/30 bg-white/5 hover:bg-white/10 text-[11px] font-medium text-white/90 transition"
              >
                <span>{currency}</span>
                <ChevronDown className={`w-2.5 h-2.5 opacity-60 transition-transform duration-200 ${currencyOpen ? 'rotate-180' : ''}`} />
              </button>

              {currencyOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setCurrencyOpen(false)} />
                  <div className="absolute right-0 top-full mt-1.5 w-32 bg-[#161716] border border-white/[0.15] rounded-xl shadow-2xl overflow-hidden z-50 py-1 animate-in fade-in zoom-in-95 duration-150">
                    {currencies.map((curr) => (
                      <button
                        key={curr.code}
                        onClick={() => {
                          setCurrency(curr.code);
                          setCurrencyOpen(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 text-xs transition flex items-center justify-between ${currency === curr.code
                            ? 'bg-[#AC7900]/20 text-[#D4AF37] font-bold'
                            : 'text-white/80 hover:bg-white/10'
                          }`}
                      >
                        <span>{curr.label}</span>
                        {currency === curr.code && <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <span className="text-white/20">|</span>

            {/* Light / Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-1 rounded-full border border-white/15 bg-white/5 hover:bg-white/15 text-white/90 hover:text-white transition flex items-center justify-center group"
              title={`Switch to ${isDark ? 'Light Mode' : 'Dark Mode'}`}
            >
              {isDark ? (
                <Sun className="w-3 h-3 text-[#D4AF37] group-hover:rotate-45 transition-transform" />
              ) : (
                <Moon className="w-3 h-3 text-white/80 group-hover:-rotate-12 transition-transform" />
              )}
            </button>

            <span className="text-white/20">|</span>

            {/* Admin Toggle Chip */}
            <button
              onClick={toggleAdminMode}
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition ${isAdmin
                  ? 'bg-[#AC7900] text-white shadow-sm'
                  : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
                }`}
            >
              {isAdmin ? 'Admin ON' : 'Admin'}
            </button>

          </div>

        </div>
      </div>

      {/* 🤍 2. MAIN NAVIGATION BAR */}
      <div className="bg-[#FEFBF1]/95 dark:bg-[#111211]/95 backdrop-blur-xl border-b border-black/[0.06] dark:border-white/[0.08] py-2.5 px-4 sm:px-8 transition-colors duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.02)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 lg:gap-6">

          {/* LEFT: BRAND LOGO */}
          <div
            onClick={() => setActiveTab('home')}
            className="flex items-center space-x-3 cursor-pointer group shrink-0 select-none"
          >
            <div className="w-10 h-10 rounded-2xl bg-white dark:bg-[#1A1C1A] border border-black/10 dark:border-white/15 p-1.5 flex items-center justify-center shadow-xs group-hover:scale-105 group-hover:shadow-md transition-all duration-200">
              <img
                src="/leaf-logo.png"
                alt="Fabric Print Leaf Logo"
                className="w-full h-full object-contain group-hover:rotate-6 transition-transform"
              />
            </div>
            <div>
              <div className="text-lg sm:text-xl font-black font-editorial tracking-tight text-[#0F100F] dark:text-white leading-tight flex items-center gap-1">
                FABRIC<span className="text-[#AC7900] dark:text-[#D4AF37]">PRINT</span>
              </div>
              <p className="text-[9px] text-[#8A8883] uppercase tracking-widest font-bold leading-none">
                Custom Fabric Printing
              </p>
            </div>
          </div>

          {/* CENTER: UNIFIED NAVIGATION TABS (USER-FRIENDLY HOVER BRIDGE & 300MS DEBOUNCE) */}
          <nav className="hidden lg:flex items-center space-x-1 select-none">

            {/* 1. Home */}
            <button
              onClick={() => setActiveTab('home')}
              className={getNavButtonClass('home')}
            >
              <span>Home</span>
            </button>

            {/* 2. Fabric */}
            <button
              onClick={() => {
                setSelectedCategory('All');
                setActiveTab('fabrics');
              }}
              className={getNavButtonClass('fabrics')}
            >
              <span>Fabric</span>
            </button>

            {/* 3. T-Shirt */}
            <div
              className="relative py-1"
              onMouseEnter={handleApparelEnter}
              onMouseLeave={handleApparelLeave}
            >
              <button
                onClick={() => {
                  setActiveTab('apparel');
                  setApparelMenuOpen(false);
                }}
                className={getNavButtonClass('apparel')}
              >
                <span>T-Shirt</span>
                <ChevronDown className={`w-3 h-3 opacity-60 ml-0.5 transition-transform duration-200 ${apparelMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Invisible Hover Bridge for smooth pointer traversal */}
              {apparelMenuOpen && (
                <div
                  onMouseEnter={handleApparelEnter}
                  onMouseLeave={handleApparelLeave}
                  className="absolute top-full left-0 pt-2 z-50 animate-in fade-in zoom-in-95 duration-150 text-left"
                >
                  <div className="w-[540px] bg-white dark:bg-[#161716] border border-black/10 dark:border-white/15 rounded-3xl shadow-2xl p-5">

                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-black/5 dark:border-white/5">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#AC7900] dark:text-[#D4AF37]">
                          Apparel & T-Shirt Studio
                        </span>
                        <h4 className="text-sm font-bold text-black dark:text-white">
                          Blank Range & Custom Printing
                        </h4>
                      </div>
                      <button
                        onClick={() => {
                          setActiveTab('apparel');
                          setApparelMenuOpen(false);
                        }}
                        className="text-xs font-bold text-[#AC7900] dark:text-[#D4AF37] hover:underline flex items-center space-x-1"
                      >
                        <span>View All 14 Styles →</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-3 gap-3 text-xs">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">👕 T-Shirts</span>
                        <button
                          onClick={() => {
                            setActiveTab('apparel');
                            setApparelMenuOpen(false);
                          }}
                          className="w-full text-left p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition"
                        >
                          <span className="block font-bold text-black dark:text-white">Men's Round Neck</span>
                          <span className="text-[10px] text-slate-500">180 GSM · from ₹165</span>
                        </button>
                        <button
                          onClick={() => {
                            setActiveTab('apparel');
                            setApparelMenuOpen(false);
                          }}
                          className="w-full text-left p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition"
                        >
                          <span className="block font-bold text-black dark:text-white">Oversized Streetwear</span>
                          <span className="text-[10px] text-slate-500">240 GSM · from ₹240</span>
                        </button>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">👔 Polos & Hoodies</span>
                        <button
                          onClick={() => {
                            setActiveTab('apparel');
                            setApparelMenuOpen(false);
                          }}
                          className="w-full text-left p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition"
                        >
                          <span className="block font-bold text-black dark:text-white">Cotton Collar Polo</span>
                          <span className="text-[10px] text-slate-500">220 GSM · from ₹249</span>
                        </button>
                        <button
                          onClick={() => {
                            setActiveTab('apparel');
                            setApparelMenuOpen(false);
                          }}
                          className="w-full text-left p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition"
                        >
                          <span className="block font-bold text-black dark:text-white">Heavy Fleece Hoodie</span>
                          <span className="text-[10px] text-slate-500">320 GSM · from ₹499</span>
                        </button>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">⚽ Sports & Kids</span>
                        <button
                          onClick={() => {
                            setActiveTab('jersey');
                            setApparelMenuOpen(false);
                          }}
                          className="w-full text-left p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition"
                        >
                          <span className="block font-bold text-black dark:text-white">Sports Jersey Kit</span>
                          <span className="text-[10px] text-slate-500">180 GSM · DryFit</span>
                        </button>
                        <button
                          onClick={() => {
                            setActiveTab('apparel');
                            setApparelMenuOpen(false);
                          }}
                          className="w-full text-left p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition"
                        >
                          <span className="block font-bold text-black dark:text-white">Kids Soft Tee</span>
                          <span className="text-[10px] text-slate-500">160 GSM · from ₹129</span>
                        </button>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-black/5 dark:border-white/5 flex items-center justify-between bg-black/5 dark:bg-white/5 p-2.5 rounded-2xl">
                      <span className="text-[11px] font-medium text-slate-600 dark:text-slate-300">
                        Live interactive 3D crop, rotate & jersey roster studio
                      </span>
                      <button
                        onClick={() => {
                          setActiveTab('apparel-studio');
                          setApparelMenuOpen(false);
                        }}
                        className="px-3.5 py-1 bg-[#0F100F] dark:bg-white text-white dark:text-[#0F100F] rounded-full text-[11px] font-bold shadow-sm hover:opacity-90 transition"
                      >
                        Open Studio →
                      </button>
                    </div>

                  </div>
                </div>
              )}
            </div>

            {/* 3b. Sports (standalone team-kit studio) */}
            <button
              onClick={() => setActiveTab('jersey')}
              className={`${getNavButtonClass('jersey')} group`}
              title="Custom sublimation team kits"
            >
              <Trophy className="w-3.5 h-3.5 text-[#AC7900] dark:text-[#D4AF37] group-hover:scale-125 group-hover:-rotate-12 transition-transform duration-200" />
              <span>Sports</span>
            </button>

            {/* 4. Uniforms */}
            <div
              className="relative py-1"
              onMouseEnter={handleUniformEnter}
              onMouseLeave={handleUniformLeave}
            >
              <button
                onClick={() => {
                  setActiveTab('uniforms');
                  setUniformMenuOpen(false);
                }}
                className={getNavButtonClass('uniforms')}
              >
                <span>Uniforms</span>
                <ChevronDown className={`w-3 h-3 opacity-60 ml-0.5 transition-transform duration-200 ${uniformMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Invisible Hover Bridge for smooth pointer traversal */}
              {uniformMenuOpen && (
                <div
                  onMouseEnter={handleUniformEnter}
                  onMouseLeave={handleUniformLeave}
                  className="absolute top-full left-0 pt-2 z-50 animate-in fade-in zoom-in-95 duration-150 text-left"
                >
                  <div className="w-[560px] bg-white dark:bg-[#161716] border border-black/10 dark:border-white/15 rounded-3xl shadow-2xl p-5">

                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-black/5 dark:border-white/5">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#AC7900] dark:text-[#D4AF37]">
                          Institutional Uniform Textiles · ISO 9001 Certified
                        </span>
                        <h4 className="text-sm font-bold text-black dark:text-white">
                          Schools, Hospitals, Corporate & Workwear
                        </h4>
                      </div>
                      <button
                        onClick={() => {
                          setActiveTab('uniforms');
                          setUniformMenuOpen(false);
                        }}
                        className="text-xs font-bold text-[#AC7900] dark:text-[#D4AF37] hover:underline flex items-center space-x-1"
                      >
                        <span>Explore Collection →</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-3 gap-3 text-xs">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">🎓 School Weaves</span>
                        <button
                          onClick={() => {
                            setActiveTab('uniforms');
                            setUniformMenuOpen(false);
                          }}
                          className="w-full text-left p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition"
                        >
                          <span className="block font-bold text-black dark:text-white">Yarn-Dyed Checks</span>
                          <span className="text-[10px] text-slate-500">155 GSM · from ₹135/m</span>
                        </button>
                        <button
                          onClick={() => {
                            setActiveTab('uniforms');
                            setUniformMenuOpen(false);
                          }}
                          className="w-full text-left p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition"
                        >
                          <span className="block font-bold text-black dark:text-white">Matty PV Trousers</span>
                          <span className="text-[10px] text-slate-500">265 GSM · from ₹215/m</span>
                        </button>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">💼 Corporate & Med</span>
                        <button
                          onClick={() => {
                            setActiveTab('uniforms');
                            setUniformMenuOpen(false);
                          }}
                          className="w-full text-left p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition"
                        >
                          <span className="block font-bold text-black dark:text-white">Fil-a-Fil Shirting</span>
                          <span className="text-[10px] text-slate-500">140 GSM · Non-Iron</span>
                        </button>
                        <button
                          onClick={() => {
                            setActiveTab('uniforms');
                            setUniformMenuOpen(false);
                          }}
                          className="w-full text-left p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition"
                        >
                          <span className="block font-bold text-black dark:text-white">Anti-Microbial Scrubs</span>
                          <span className="text-[10px] text-slate-500">175 GSM · Silver Ion</span>
                        </button>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">🏭 Workwear & Chef</span>
                        <button
                          onClick={() => {
                            setActiveTab('uniforms');
                            setUniformMenuOpen(false);
                          }}
                          className="w-full text-left p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition"
                        >
                          <span className="block font-bold text-black dark:text-white">Boiler Suit Drill</span>
                          <span className="text-[10px] text-slate-500">280 GSM · Oil Repellent</span>
                        </button>
                        <button
                          onClick={() => {
                            setActiveTab('uniforms');
                            setUniformMenuOpen(false);
                          }}
                          className="w-full text-left p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition"
                        >
                          <span className="block font-bold text-black dark:text-white">MasterChef Poplin</span>
                          <span className="text-[10px] text-slate-500">210 GSM · Stain Shield</span>
                        </button>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-black/5 dark:border-white/5 flex items-center justify-between bg-black/5 dark:bg-white/5 p-2.5 rounded-2xl">
                      <span className="text-[11px] font-medium text-slate-600 dark:text-slate-300">
                        100+ wash cycle colorfast guarantee · Instant roll meterage calculator
                      </span>
                      <button
                        onClick={() => {
                          setActiveTab('uniforms');
                          setUniformMenuOpen(false);
                        }}
                        className="px-3.5 py-1 bg-[#0F100F] dark:bg-white text-white dark:text-[#0F100F] rounded-full text-[11px] font-bold shadow-sm hover:opacity-90 transition"
                      >
                        View Mill Range →
                      </button>
                    </div>

                  </div>
                </div>
              )}
            </div>

            {/* 5. Custom Merch & Accessories (NEW TAB) */}
            <div
              className="relative py-1"
              onMouseEnter={handleMerchEnter}
              onMouseLeave={handleMerchLeave}
            >
              <button
                onClick={() => {
                  setActiveTab('merch');
                  setMerchMenuOpen(false);
                }}
                className={getNavButtonClass('merch')}
              >
                <span>Other Products</span>
                <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black bg-[#AC7900] text-white dark:bg-[#D4AF37] dark:text-black">
                  NEW
                </span>
                <ChevronDown className={`w-3 h-3 opacity-60 ml-0.5 transition-transform duration-200 ${merchMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Invisible Hover Bridge & Dropdown Menu */}
              {merchMenuOpen && (
                <div
                  onMouseEnter={handleMerchEnter}
                  onMouseLeave={handleMerchLeave}
                  className="absolute top-full left-0 pt-2 z-50 animate-in fade-in zoom-in-95 duration-150 text-left"
                >
                  <div className="w-[660px] bg-white dark:bg-[#161716] border border-black/10 dark:border-white/15 rounded-3xl shadow-2xl p-5">

                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-black/5 dark:border-white/5">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#AC7900] dark:text-[#D4AF37]">
                          Custom Printing &amp; Sublimation Products
                        </span>
                        <h4 className="text-sm font-bold text-black dark:text-white">
                          Bags, Caps, Flags &amp; Shirts
                        </h4>
                      </div>
                      <button
                        onClick={() => {
                          setActiveTab('merch');
                          setMerchMenuOpen(false);
                        }}
                        className="text-xs font-bold text-[#AC7900] dark:text-[#D4AF37] hover:underline flex items-center space-x-1"
                      >
                        <span>View All Products →</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-4 gap-2.5 text-xs">
                      {/* 1. Bags */}
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">👜 BAGS</span>
                        <span className="text-[9px] font-bold text-amber-600 block">(DTF·DTG·SUB)</span>
                        <button
                          onClick={() => {
                            setActiveTab('merch');
                            setMerchMenuOpen(false);
                          }}
                          className="w-full text-left p-1.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition"
                        >
                          <span className="block font-bold text-black dark:text-white text-[11px]">Tote Bags</span>
                          <span className="text-[10px] text-slate-500">Canvas &amp; Poly</span>
                        </button>
                      </div>

                      {/* 2. Caps */}
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">🧢 CAPS</span>
                        <span className="text-[9px] font-bold text-blue-600 block">(DTF·SUBLIMATION)</span>
                        <button
                          onClick={() => {
                            setActiveTab('merch');
                            setMerchMenuOpen(false);
                          }}
                          className="w-full text-left p-1.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition"
                        >
                          <span className="block font-bold text-black dark:text-white text-[11px]">Athletic &amp; Trucker</span>
                          <span className="text-[10px] text-slate-500">Snapback Caps</span>
                        </button>
                      </div>

                      {/* 3. Flags */}
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">🚩 FLAGS</span>
                        <span className="text-[9px] font-bold text-purple-600 block">(DTF·DTG·SUB)</span>
                        <button
                          onClick={() => {
                            setActiveTab('merch');
                            setMerchMenuOpen(false);
                          }}
                          className="w-full text-left p-1.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition"
                        >
                          <span className="block font-bold text-black dark:text-white text-[11px]">Promo Flags</span>
                          <span className="text-[10px] text-slate-500">Teardrop &amp; Banner</span>
                        </button>
                      </div>

                      {/* 4. Shirts */}
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">👔 SHIRTS</span>
                        <span className="text-[9px] font-bold text-rose-600 block">(DTF·DTG·SUB)</span>
                        <button
                          onClick={() => {
                            setActiveTab('merch');
                            setMerchMenuOpen(false);
                          }}
                          className="w-full text-left p-1.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition"
                        >
                          <span className="block font-bold text-black dark:text-white text-[11px]">Resort &amp; Formal</span>
                          <span className="text-[10px] text-slate-500">Button-Down</span>
                        </button>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-black/5 dark:border-white/5 flex items-center justify-between bg-black/5 dark:bg-white/5 p-2.5 rounded-2xl">
                      <span className="text-[11px] font-medium text-slate-600 dark:text-slate-300">
                        DTF, DTG &amp; Sublimation full-customization support
                      </span>
                      <button
                        onClick={() => {
                          setActiveTab('merch');
                          setMerchMenuOpen(false);
                        }}
                        className="px-3.5 py-1 bg-[#0F100F] dark:bg-white text-white dark:text-[#0F100F] rounded-full text-[11px] font-bold shadow-sm hover:opacity-90 transition"
                      >
                        Explore All →
                      </button>
                    </div>

                  </div>
                </div>
              )}
            </div>

            {/* 6. Master Customize All Studio (Temporarily commented out) */}
            {/* 
            <button
              onClick={() => setActiveTab('customizer')}
              className={`${getNavButtonClass('customizer')} group relative`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#AC7900] dark:text-[#D4AF37] animate-pulse" />
              <span className="font-bold">Customize All</span>
              <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black bg-gradient-to-r from-[#AC7900] to-[#D4AF37] text-white">
                STUDIO
              </span>
            </button> 
            */}

            {/* 6. Training & Academy Dropdown */}
            <div
              className="relative py-1"
              onMouseEnter={handleTrainingEnter}
              onMouseLeave={handleTrainingLeave}
            >
              <button
                onClick={() => {
                  setActiveTab('training');
                  setTrainingMenuOpen(false);
                }}
                className={`px-3.5 py-1.5 rounded-full transition-all duration-150 flex items-center space-x-1.5 whitespace-nowrap text-xs font-semibold ${
                  activeTab === 'training'
                    ? 'bg-[#0F100F] text-white dark:bg-white dark:text-[#0F100F] font-bold shadow-sm'
                    : 'text-[#0F100F] dark:text-white/80 hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5 text-[#AC7900] dark:text-[#D4AF37]" />
                <span>Training</span>
                <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black bg-[#AC7900] text-white dark:bg-[#D4AF37] dark:text-black">
                  7
                </span>
                <ChevronDown className={`w-3 h-3 opacity-60 ml-0.5 transition-transform duration-200 ${trainingMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {trainingMenuOpen && (
                <div
                  onMouseEnter={handleTrainingEnter}
                  onMouseLeave={handleTrainingLeave}
                  className="absolute top-full right-0 pt-2 z-50 animate-in fade-in zoom-in-95 duration-150 text-left text-xs"
                >
                  <div className="w-72 bg-white dark:bg-[#161716] border border-black/10 dark:border-white/15 rounded-2xl shadow-2xl p-2.5 space-y-1">
                    <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#AC7900] dark:text-[#D4AF37]">
                      Textile &amp; Print Training Academy
                    </div>

                    {[
                      { title: 'Block Print', desc: 'Wooden stamp carving & natural mordants', icon: '🪵' },
                      { title: 'Screen Print', desc: 'Plastisol carousel & mesh darkroom', icon: '🎨' },
                      { title: 'Sublimation Print', desc: 'Sportswear jerseys & 300 DPI heat transfer', icon: '⚡' },
                      { title: 'DTF Print', desc: 'Direct to film transfer & TPU powder cure', icon: '🔥' },
                      { title: 'DTG Print', desc: 'Direct to garment inkjet & pre-treatment', icon: '👕' },
                      { title: 'Natural Dye', desc: 'Organic indigo reduction vats & botanical', icon: '🌿' },
                      { title: 'Tufting', desc: 'Electric tufting gun & custom fiber rugs', icon: '🧶' },
                    ].map((item) => (
                      <button
                        key={item.title}
                        onClick={() => {
                          setActiveTab('training');
                          setTrainingMenuOpen(false);
                        }}
                        className="w-full text-left p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition flex items-center space-x-2.5 group"
                      >
                        <span className="text-sm">{item.icon}</span>
                        <div className="truncate">
                          <span className="block font-bold text-black dark:text-white text-xs group-hover:text-[#AC7900] transition-colors">
                            {item.title}
                          </span>
                          <span className="text-[10px] text-slate-500 truncate block">
                            {item.desc}
                          </span>
                        </div>
                      </button>
                    ))}

                    <div className="pt-2 border-t border-black/5 dark:border-white/5">
                      <button
                        onClick={() => {
                          setActiveTab('training');
                          setTrainingMenuOpen(false);
                        }}
                        className="w-full py-2 bg-[#0F100F] dark:bg-white text-white dark:text-[#0F100F] rounded-xl text-center font-bold text-xs hover:opacity-90 transition flex items-center justify-center space-x-1"
                      >
                        <span>Explore All 7 Training Programs</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

          </nav>

          {/* RIGHT: COMPACT SEARCH & LUXURY ACTION CAPSULES WITH INSTANT SMOOTH TOOLTIPS */}
          <div className="flex items-center space-x-2 select-none">

            {/* Search Pill Capsule */}
            <div className="relative hidden md:block">
              <form
                onSubmit={handleSearchSubmit}
                className={`relative transition-all duration-200 ${isSearchFocused ? 'w-48 lg:w-56 xl:w-64' : 'w-32 lg:w-36 xl:w-44'
                  }`}
              >
                <div className="flex items-center gap-2 bg-black/[0.04] dark:bg-white/[0.06] hover:bg-black/[0.07] dark:hover:bg-white/10 border border-black/10 dark:border-white/10 rounded-full pl-3 pr-2 py-1.5 transition-all">
                  <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onFocus={() => setIsSearchFocused(true)}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search fabrics..."
                    className="w-full bg-transparent text-xs text-black dark:text-white placeholder-slate-400 focus:outline-none"
                  />
                  {searchQuery ? (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="text-slate-400 hover:text-black dark:hover:text-white"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  ) : (
                    <kbd className="hidden xl:inline-flex items-center gap-0.5 rounded border border-black/10 dark:border-white/15 bg-white dark:bg-black/40 px-1.5 py-0.5 text-[9px] text-slate-500 font-mono shrink-0">
                      ⌘K
                    </kbd>
                  )}
                </div>
              </form>

              {/* Quick Search Dropdown Suggestions */}
              {isSearchFocused && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsSearchFocused(false)} />
                  <div className="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-[#161716] border border-black/10 dark:border-white/15 rounded-2xl shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                      Popular Searches
                    </span>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {quickSearchSuggestions.map((item) => (
                        <button
                          key={item}
                          onClick={() => {
                            setSearchQuery(item);
                            setActiveTab('fabrics');
                            setIsSearchFocused(false);
                          }}
                          className="px-2.5 py-1 rounded-full bg-black/5 dark:bg-white/5 hover:bg-[#AC7900]/10 hover:text-[#AC7900] dark:hover:text-[#D4AF37] text-[11px] text-slate-700 dark:text-slate-300 font-medium transition text-left"
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Wishlist Icon with Instant Tooltip */}
            <div className="relative group">
              <button
                onClick={() => setActiveTab('wishlist')}
                className={`relative p-2 rounded-full border transition-all shadow-sm ${activeTab === 'wishlist'
                    ? 'border-black dark:border-white bg-black dark:bg-white text-white dark:text-black'
                    : 'border-black/10 dark:border-white/10 bg-white dark:bg-[#1A1C1A] text-slate-700 dark:text-slate-200 hover:text-[#AC7900] dark:hover:text-[#D4AF37]'
                  }`}
                aria-label="Saved Swatches"
              >
                <Heart className={`w-4 h-4 ${wishlist.length > 0 ? 'fill-red-500 text-red-500' : ''}`} />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#EE6352] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                    {wishlist.length}
                  </span>
                )}
              </button>
              {/* Instant Micro-Tooltip */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 bg-slate-900 text-white text-[10px] font-semibold rounded-md shadow-lg pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150 whitespace-nowrap z-50 hidden sm:block">
                Saved Swatches
              </div>
            </div>

            {/* Cart Pill Button with Instant Tooltip */}
            <div className="relative group">
              <button
                onClick={() => setIsCartOpen(true)}
                className="px-3 xl:px-3.5 py-1.5 rounded-full bg-[#0F100F] dark:bg-white text-white dark:text-[#0F100F] font-bold text-xs flex items-center space-x-1.5 xl:space-x-2 shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-98 transition"
                aria-label="View Cart"
              >
                <div className="relative">
                  <ShoppingBag className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1.5 -right-2 bg-[#AC7900] dark:bg-[#D4AF37] text-white dark:text-black text-[9px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center shadow-sm">
                      {cartItemCount}
                    </span>
                  )}
                </div>
                <span className="hidden sm:inline">Cart</span>
                {cartItemCount > 0 && (
                  <span className="text-[#D4AF37] dark:text-[#AC7900] font-black pl-0.5 hidden lg:inline">
                    (₹{cartSubtotal.toLocaleString('en-IN')})
                  </span>
                )}
              </button>
              {/* Instant Micro-Tooltip */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 bg-slate-900 text-white text-[10px] font-semibold rounded-md shadow-lg pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150 whitespace-nowrap z-50 hidden sm:block">
                View Cart & Checkout
              </div>
            </div>

            {/* Profile / Account Icon with Instant Tooltip */}
            <div className="relative group">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`p-2 rounded-full border transition-all shadow-sm hidden sm:flex ${activeTab === 'dashboard'
                    ? 'border-black dark:border-white bg-black dark:bg-white text-white dark:text-black'
                    : 'border-black/10 dark:border-white/10 bg-white dark:bg-[#1A1C1A] text-slate-700 dark:text-slate-200 hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                aria-label="Account Dashboard"
              >
                <User className="w-4 h-4" />
              </button>
              {/* Instant Micro-Tooltip */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 bg-slate-900 text-white text-[10px] font-semibold rounded-md shadow-lg pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150 whitespace-nowrap z-50 hidden sm:block">
                Account & Orders
              </div>
            </div>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-full border border-black/10 dark:border-white/10 bg-white dark:bg-[#1A1C1A] text-slate-800 dark:text-white hover:bg-black/5 dark:hover:bg-white/5 transition"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>

        </div>

        {/* MOBILE MENU FULL DRAWER (NO BACKGROUND BLEED-THROUGH) */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-x-0 top-[96px] bottom-0 z-50 bg-[#FEFBF1] dark:bg-[#111211] border-t border-black/10 dark:border-white/10 overflow-y-auto px-4 py-4 space-y-3.5 text-xs font-semibold shadow-2xl animate-in fade-in duration-200 pb-36">

            {/* Mobile Search Bar */}
            <form onSubmit={handleSearchSubmit} className="mb-2">
              <div className="flex items-center gap-2 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-full px-3.5 py-2.5">
                <Search className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search 250+ fabrics, tees, jerseys, uniforms..."
                  className="w-full bg-transparent text-xs text-black dark:text-white placeholder-slate-400 focus:outline-none"
                />
                {searchQuery && (
                  <button
                    type="submit"
                    className="p-1 rounded-full bg-black text-white dark:bg-white dark:text-black shrink-0"
                  >
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            </form>

            {/* Home Link */}
            <button
              onClick={() => {
                setActiveTab('home');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left py-2.5 px-3.5 rounded-xl transition flex items-center justify-between ${
                activeTab === 'home'
                  ? 'bg-black text-white dark:bg-white dark:text-black font-bold shadow-sm'
                  : 'hover:bg-black/5 dark:hover:bg-white/5 text-gray-800 dark:text-gray-200'
              }`}
            >
              <span>🏠 Home</span>
              <ChevronRight className="w-3.5 h-3.5 opacity-40" />
            </button>

            {/* SECTION 1: FABRICS (250+ QUALITIES) ACCORDION */}
            <div className="border border-black/10 dark:border-white/10 rounded-2xl overflow-hidden bg-white/60 dark:bg-white/5">
              <button
                type="button"
                onClick={() => setMobileAccordion(mobileAccordion === 'fabrics' ? null : 'fabrics')}
                className="w-full text-left py-3 px-3.5 flex items-center justify-between hover:bg-black/5 dark:hover:bg-white/5 transition"
              >
                <div className="flex items-center space-x-2">
                  <Layers className="w-4 h-4 text-[#AC7900] dark:text-[#D4AF37]" />
                  <span className="font-bold text-gray-900 dark:text-white">Fabrics &amp; Textiles</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-[#AC7900]/15 dark:bg-[#D4AF37]/20 text-[#AC7900] dark:text-[#D4AF37]">
                    250+ QUALITIES
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${mobileAccordion === 'fabrics' ? 'rotate-180' : ''}`} />
                </div>
              </button>

              {mobileAccordion === 'fabrics' && (
                <div className="p-2 pt-0 border-t border-black/5 dark:border-white/5 space-y-1">
                  {[
                    { name: 'Pure Cotton', desc: 'Cambric 60s, Poplin, Voile, Satin', cat: 'Cotton' },
                    { name: 'Mulberry Silk', desc: 'Silk Crepe, Satin, Raw Silk, Organza', cat: 'Silk' },
                    { name: 'French Flax Linen', desc: '140 GSM Pure Slub Linen', cat: 'Linen' },
                    { name: 'Modal Satin Luster', desc: 'Ultra-Fluid Beechwood Drape', cat: 'Modal' },
                    { name: 'Viscose & Rayon', desc: 'Georgette, Crepe & Slub Weaves', cat: 'Viscose' },
                    { name: 'Bamboo & Spandex', desc: 'Eco-Soft Antibacterial Knit', cat: 'Bamboo' },
                    { name: 'Organic GOTS Cotton', desc: 'Chemical-Free Sustainable Cotton', cat: 'Organic Cotton' },
                    { name: 'Tencel & Lyocell', desc: 'Lenzing Closed-Loop Silky Twill', cat: 'Tencel' },
                    { name: 'Sheer Silk Organza', desc: 'Lightweight Ethereal Transparency', cat: 'Organza' },
                    { name: 'Fabric Blends & Poly', desc: 'Cotton-Viscose & Sublimation Canvas', cat: 'Fabric Blends' }
                  ].map((item) => (
                    <button
                      key={item.cat}
                      onClick={() => {
                        setSelectedCategory(item.cat);
                        setActiveTab('fabrics');
                        setMobileMenuOpen(false);
                      }}
                      className="w-full text-left p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition flex items-center justify-between group"
                    >
                      <div>
                        <span className="font-bold text-gray-900 dark:text-white block group-hover:text-[#AC7900] transition-colors">{item.name}</span>
                        <span className="text-[10px] text-gray-500 dark:text-gray-400 font-normal">{item.desc}</span>
                      </div>
                      <ChevronRight className="w-3 h-3 text-gray-400 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  ))}

                  <button
                    onClick={() => {
                      setSelectedCategory('All');
                      setActiveTab('fabrics');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full mt-2 py-2.5 px-3 bg-[#0F100F] dark:bg-white text-white dark:text-[#0F100F] font-bold rounded-xl text-center flex items-center justify-center space-x-1.5 shadow-sm"
                  >
                    <span>Explore All 250+ Fabrics →</span>
                  </button>
                </div>
              )}
            </div>

            {/* SECTION 2: APPAREL & T-SHIRTS (14 STYLES) ACCORDION */}
            <div className="border border-black/10 dark:border-white/10 rounded-2xl overflow-hidden bg-white/60 dark:bg-white/5">
              <button
                type="button"
                onClick={() => setMobileAccordion(mobileAccordion === 'apparel' ? null : 'apparel')}
                className="w-full text-left py-3 px-3.5 flex items-center justify-between hover:bg-black/5 dark:hover:bg-white/5 transition"
              >
                <div className="flex items-center space-x-2">
                  <Shirt className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="font-bold text-gray-900 dark:text-white">Apparel &amp; T-Shirts</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
                    14 STYLES
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${mobileAccordion === 'apparel' ? 'rotate-180' : ''}`} />
                </div>
              </button>

              {mobileAccordion === 'apparel' && (
                <div className="p-2 pt-0 border-t border-black/5 dark:border-white/5 space-y-1">
                  {[
                    { name: "Unisex Round Neck T-Shirt", desc: "180 GSM Combed Cotton • from ₹175" },
                    { name: "Oversized Streetwear Tee", desc: "240 GSM Heavy Drop Shoulder • from ₹240" },
                    { name: "Cotton Collar Polo", desc: "220 GSM Matty Pique Knit • from ₹249" },
                    { name: "Heavy Fleece Hoodie", desc: "320 GSM Brushed Winter Fleece • from ₹499" },
                    { name: "Women's Fitted Crop Top", desc: "180 GSM Lycra Ribbed • from ₹165" },
                    { name: "Kids Soft Tee", desc: "0 to 14 Years Combed Cotton • from ₹129" }
                  ].map((style, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setActiveTab('apparel');
                        setMobileMenuOpen(false);
                      }}
                      className="w-full text-left p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition flex items-center justify-between group"
                    >
                      <div>
                        <span className="font-bold text-gray-900 dark:text-white block group-hover:text-emerald-600 transition-colors">{style.name}</span>
                        <span className="text-[10px] text-gray-500 dark:text-gray-400 font-normal">{style.desc}</span>
                      </div>
                      <ChevronRight className="w-3 h-3 text-gray-400 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  ))}

                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <button
                      onClick={() => {
                        setActiveTab('apparel');
                        setMobileMenuOpen(false);
                      }}
                      className="py-2 px-2.5 bg-black/5 dark:bg-white/10 rounded-xl font-bold text-center text-gray-800 dark:text-gray-200 text-[11px]"
                    >
                      View All Styles
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab('apparel-studio');
                        setMobileMenuOpen(false);
                      }}
                      className="py-2 px-2.5 bg-[#0F100F] dark:bg-white text-white dark:text-[#0F100F] font-bold rounded-xl text-center text-[11px]"
                    >
                      Open 3D Studio →
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* SECTION 3: SPORTS & TEAM KITS (SUBLIMATION) ACCORDION */}
            <div className="border border-black/10 dark:border-white/10 rounded-2xl overflow-hidden bg-white/60 dark:bg-white/5">
              <button
                type="button"
                onClick={() => setMobileAccordion(mobileAccordion === 'sports' ? null : 'sports')}
                className="w-full text-left py-3 px-3.5 flex items-center justify-between hover:bg-black/5 dark:hover:bg-white/5 transition"
              >
                <div className="flex items-center space-x-2">
                  <Trophy className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span className="font-bold text-gray-900 dark:text-white">Sports &amp; Team Kits</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500/15 text-amber-700 dark:text-amber-300">
                    TEAM
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${mobileAccordion === 'sports' ? 'rotate-180' : ''}`} />
                </div>
              </button>

              {mobileAccordion === 'sports' && (
                <div className="p-2 pt-0 border-t border-black/5 dark:border-white/5 space-y-1">
                  {[
                    { name: "Full Sublimation Cricket Kit", desc: "180 GSM Moisture-Wicking DryFit" },
                    { name: "Football Tournament Jersey", desc: "Full Front/Back/Sleeves Player Customizer" },
                    { name: "Active Running & Training Shorts", desc: "Lightweight Breathable Mesh" }
                  ].map((kit, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setActiveTab('jersey');
                        setMobileMenuOpen(false);
                      }}
                      className="w-full text-left p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition flex items-center justify-between group"
                    >
                      <div>
                        <span className="font-bold text-gray-900 dark:text-white block group-hover:text-amber-600 transition-colors">{kit.name}</span>
                        <span className="text-[10px] text-gray-500 dark:text-gray-400 font-normal">{kit.desc}</span>
                      </div>
                      <ChevronRight className="w-3 h-3 text-gray-400 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  ))}

                  <button
                    onClick={() => {
                      setActiveTab('jersey');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full mt-2 py-2.5 px-3 bg-[#0F100F] dark:bg-white text-white dark:text-[#0F100F] font-bold rounded-xl text-center flex items-center justify-center space-x-1.5 shadow-sm"
                  >
                    <span>Launch Sports Team Customizer →</span>
                  </button>
                </div>
              )}
            </div>

            {/* SECTION 4: UNIFORMS & INSTITUTIONAL FABRICS ACCORDION */}
            <div className="border border-black/10 dark:border-white/10 rounded-2xl overflow-hidden bg-white/60 dark:bg-white/5">
              <button
                type="button"
                onClick={() => setMobileAccordion(mobileAccordion === 'uniforms' ? null : 'uniforms')}
                className="w-full text-left py-3 px-3.5 flex items-center justify-between hover:bg-black/5 dark:hover:bg-white/5 transition"
              >
                <div className="flex items-center space-x-2">
                  <GraduationCap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="font-bold text-gray-900 dark:text-white">Institutional Uniforms</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-500/15 text-blue-700 dark:text-blue-300">
                    ISO 9001
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${mobileAccordion === 'uniforms' ? 'rotate-180' : ''}`} />
                </div>
              </button>

              {mobileAccordion === 'uniforms' && (
                <div className="p-2 pt-0 border-t border-black/5 dark:border-white/5 space-y-1">
                  {[
                    { name: "School Weaves & Yarn-Dyed Checks", desc: "155 GSM • Anti-Pilling • from ₹135/m" },
                    { name: "Matty PV Suiting & Trousers", desc: "265 GSM Wrinkle Resistant • from ₹215/m" },
                    { name: "Corporate Fil-a-Fil Shirting", desc: "140 GSM Premium Non-Iron" },
                    { name: "Anti-Microbial Medical Scrubs", desc: "175 GSM Silver-Ion Protected" },
                    { name: "Boiler Suit Industrial Drill", desc: "280 GSM Heavy Oil & Flame Repellent" },
                    { name: "MasterChef Poplin & Aprons", desc: "210 GSM Stain Shield Treated" }
                  ].map((uni, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setActiveTab('uniforms');
                        setMobileMenuOpen(false);
                      }}
                      className="w-full text-left p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition flex items-center justify-between group"
                    >
                      <div>
                        <span className="font-bold text-gray-900 dark:text-white block group-hover:text-blue-600 transition-colors">{uni.name}</span>
                        <span className="text-[10px] text-gray-500 dark:text-gray-400 font-normal">{uni.desc}</span>
                      </div>
                      <ChevronRight className="w-3 h-3 text-gray-400 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  ))}

                  <button
                    onClick={() => {
                      setActiveTab('uniforms');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full mt-2 py-2.5 px-3 bg-[#0F100F] dark:bg-white text-white dark:text-[#0F100F] font-bold rounded-xl text-center flex items-center justify-center space-x-1.5 shadow-sm"
                  >
                    <span>View All Uniform Textiles →</span>
                  </button>
                </div>
              )}
            </div>

            {/* SECTION 5: OTHER PRODUCTS & MERCH ACCORDION */}
            <div className="border border-black/10 dark:border-white/10 rounded-2xl overflow-hidden bg-white/60 dark:bg-white/5">
              <button
                type="button"
                onClick={() => setMobileAccordion(mobileAccordion === 'merch' ? null : 'merch')}
                className="w-full text-left py-3 px-3.5 flex items-center justify-between hover:bg-black/5 dark:hover:bg-white/5 transition"
              >
                <div className="flex items-center space-x-2">
                  <ShoppingBag className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span className="font-bold text-gray-900 dark:text-white">Other Products &amp; Merch</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-purple-500/15 text-purple-700 dark:text-purple-300">
                    BAGS &amp; CAPS
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${mobileAccordion === 'merch' ? 'rotate-180' : ''}`} />
                </div>
              </button>

              {mobileAccordion === 'merch' && (
                <div className="p-2 pt-0 border-t border-black/5 dark:border-white/5 space-y-1">
                  {[
                    { name: "Heavy Canvas & Poly Tote Bags", desc: "DTF & Sublimation • Reusable Eco Bags" },
                    { name: "Athletic & Trucker Snapback Caps", desc: "Structured Embroidered / DTF Caps" },
                    { name: "Outdoor Promotional Flags", desc: "Teardrop, Feather & Event Banners" },
                    { name: "Resort & Formal Printed Shirts", desc: "Rayon & Cotton Digital Button-Downs" }
                  ].map((merch, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setActiveTab('merch');
                        setMobileMenuOpen(false);
                      }}
                      className="w-full text-left p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition flex items-center justify-between group"
                    >
                      <div>
                        <span className="font-bold text-gray-900 dark:text-white block group-hover:text-purple-600 transition-colors">{merch.name}</span>
                        <span className="text-[10px] text-gray-500 dark:text-gray-400 font-normal">{merch.desc}</span>
                      </div>
                      <ChevronRight className="w-3 h-3 text-gray-400 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  ))}

                  <button
                    onClick={() => {
                      setActiveTab('merch');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full mt-2 py-2.5 px-3 bg-[#0F100F] dark:bg-white text-white dark:text-[#0F100F] font-bold rounded-xl text-center flex items-center justify-center space-x-1.5 shadow-sm"
                  >
                    <span>View All Other Products →</span>
                  </button>
                </div>
              )}
            </div>

            {/* SECTION 6: TRAINING ACADEMY */}
            <button
              onClick={() => {
                setActiveTab('training');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left py-3 px-3.5 rounded-2xl border transition flex items-center justify-between ${
                activeTab === 'training'
                  ? 'bg-black text-white dark:bg-white dark:text-black font-bold border-black dark:border-white shadow-sm'
                  : 'bg-white/60 dark:bg-white/5 border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10'
              }`}
            >
              <div className="flex items-center space-x-2">
                <GraduationCap className="w-4 h-4 text-[#AC7900] dark:text-[#D4AF37]" />
                <span className="font-bold text-gray-900 dark:text-white">Training Academy</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-[#AC7900] text-white dark:bg-[#D4AF37] dark:text-black">
                7 TRACKS
              </span>
            </button>

            {/* ESSENTIAL TOOLS BAR */}
            <div className="pt-2 border-t border-black/10 dark:border-white/10 grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setUrlModalOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="py-2.5 px-3 rounded-xl bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 text-left flex items-center space-x-2 hover:bg-black/5 shadow-xs"
              >
                <Globe className="w-4 h-4 text-[#AC7900]" />
                <div>
                  <span className="block font-bold text-gray-900 dark:text-white text-[11px]">Extract URL</span>
                  <span className="block text-[9px] text-gray-500">3D Draping</span>
                </div>
              </button>

              <button
                onClick={() => {
                  setSwatchModalOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="py-2.5 px-3 rounded-xl bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 text-left flex items-center space-x-2 hover:bg-black/5 shadow-xs"
              >
                <BookOpen className="w-4 h-4 text-[#D4AF37]" />
                <div>
                  <span className="block font-bold text-gray-900 dark:text-white text-[11px]">Swatch Book</span>
                  <span className="block text-[9px] text-gray-500">₹499 Complete</span>
                </div>
              </button>
            </div>

            {/* Quick Master Studio & User Account links */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setActiveTab('customizer');
                  setMobileMenuOpen(false);
                }}
                className="py-2 px-3 rounded-xl bg-black/5 dark:bg-white/5 text-left text-gray-700 dark:text-gray-300 font-bold hover:bg-black/10 transition text-[11px]"
              >
                🎨 Master Studio
              </button>
              <button
                onClick={() => {
                  setActiveTab('dashboard');
                  setMobileMenuOpen(false);
                }}
                className="py-2 px-3 rounded-xl bg-black/5 dark:bg-white/5 text-left text-gray-700 dark:text-gray-300 font-bold hover:bg-black/10 transition text-[11px]"
              >
                👤 My Account
              </button>
            </div>

          </div>
        )}

      </div>

      {/* GLOBAL MODALS */}
      <SmartUrlImageExtractorModal
        isOpen={urlModalOpen}
        onClose={() => setUrlModalOpen(false)}
        onApplyExtractedImage={() => {
          setActiveTab('customizer');
        }}
      />

      <SwatchBookOrderModal
        isOpen={swatchModalOpen}
        onClose={() => setSwatchModalOpen(false)}
        onGoToCheckout={() => setActiveTab('checkout')}
      />

    </header>
  );
};

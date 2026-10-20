import React, { useState, useMemo, useEffect } from 'react';
import {
  SlidersHorizontal,
  Search,
  RotateCcw,
  Check,
  ArrowUpDown,
  Sparkles,
  BookOpen,
  X,
  ChevronRight,
  LayoutGrid,
  List,
  Layers,
  Scissors,
  CheckCircle2,
  Info,
  Scale,
  Eye,
  PackageOpen
} from 'lucide-react';
import { Product } from '../types';
import { FabricCard } from '../components/FabricCard';
import { FabricFilterSidebar, FABRIC_TYPES_ORDER } from '../components/FabricFilterSidebar';
import { FabricActiveFilterChips } from '../components/FabricActiveFilterChips';
import { FabricQuickViewModal } from '../components/FabricQuickViewModal';
import { FabricComparisonModal } from '../components/FabricComparisonModal';
import { SwatchBookOrderModal } from '../components/SwatchBookOrderModal';
import { PopularDesignsSection } from '../components/PopularDesignsSection';
import { PreloadedDesignModal } from '../components/PreloadedDesignModal';
import {
  FabricFilters,
  DEFAULT_FABRIC_FILTERS,
  parseFiltersFromUrl,
  syncFiltersToUrl
} from '../utils/urlFilterSync';

interface FabricListingPageProps {
  products: Product[];
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSelectProduct: (product: Product) => void;
}

const ITEMS_PER_PAGE = 16;

export const FabricListingPage: React.FC<FabricListingPageProps> = ({
  products,
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  setSearchQuery,
  onSelectProduct
}) => {
  // Initialize filter state from URL or defaults
  const [filters, setFilters] = useState<FabricFilters>(() => {
    const urlFilters = parseFiltersFromUrl();
    return {
      ...DEFAULT_FABRIC_FILTERS,
      category: selectedCategory || urlFilters.category || 'All',
      search: searchQuery || urlFilters.search || '',
      ...urlFilters
    };
  });

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [swatchModalOpen, setSwatchModalOpen] = useState(false);
  const [isPreloadedModalOpen, setIsPreloadedModalOpen] = useState(false);
  const [comparatorModalOpen, setComparatorModalOpen] = useState(false);
  const [comparisonBaseProduct, setComparisonBaseProduct] = useState<Product | null>(null);

  // Sync external selectedCategory prop into filters if changed from header
  useEffect(() => {
    if (selectedCategory && selectedCategory !== filters.category) {
      setFilters((prev) => ({ ...prev, category: selectedCategory, page: 1 }));
    }
  }, [selectedCategory]);

  // Sync external searchQuery prop into filters if changed from header
  useEffect(() => {
    if (searchQuery !== undefined && searchQuery !== filters.search) {
      setFilters((prev) => ({ ...prev, search: searchQuery, page: 1 }));
    }
  }, [searchQuery]);

  // Sync filters to browser URL address bar
  useEffect(() => {
    syncFiltersToUrl(filters, 'fabrics');
  }, [filters]);

  // Filter updates helper
  const handleFilterChange = (updates: Partial<FabricFilters>) => {
    setFilters((prev) => {
      const next = { ...prev, ...updates };
      if (updates.category !== undefined) {
        setSelectedCategory(updates.category);
      }
      if (updates.search !== undefined) {
        setSearchQuery(updates.search);
      }
      return next;
    });
  };

  const handleResetFilters = () => {
    setFilters(DEFAULT_FABRIC_FILTERS);
    setSelectedCategory('All');
    setSearchQuery('');
  };

  // Comprehensive Filtering Engine
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // 1. Fabric Type / Category
    if (filters.category && filters.category !== 'All') {
      result = result.filter(
        (p) => p.category.toLowerCase() === filters.category.toLowerCase()
      );
    }

    // 2. Search Query (matches name, SKU, count, cons, composition, description, applications)
    if (filters.search.trim()) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          (p.sku && p.sku.toLowerCase().includes(q)) ||
          (p.count && p.count.toLowerCase().includes(q)) ||
          (p.cons && p.cons.toLowerCase().includes(q)) ||
          (p.color && p.color.toLowerCase().includes(q)) ||
          (p.composition && p.composition.toLowerCase().includes(q)) ||
          p.applications?.some((app) => app.toLowerCase().includes(q))
      );
    }

    // 3. Usages / End-Uses (Multi-select)
    if (filters.usages.length > 0) {
      result = result.filter((p) => {
        return filters.usages.some((u) => {
          const inApps = p.applications?.some((app) => app.toLowerCase().includes(u));
          const inDesc = p.description?.toLowerCase().includes(u);
          const inName = p.name?.toLowerCase().includes(u);
          return inApps || inDesc || inName;
        });
      });
    }

    // 4. Pattern / Motif
    if (filters.patterns.length > 0) {
      result = result.filter((p) => {
        return filters.patterns.some((pat) => {
          if (pat === 'plain') return p.weave_type?.toLowerCase().includes('plain') || !p.weave_type;
          return p.description?.toLowerCase().includes(pat) || p.name?.toLowerCase().includes(pat);
        });
      });
    }

    // 5. Colors (Multi-select)
    if (filters.colors.length > 0) {
      result = result.filter((p) => {
        return filters.colors.some((col) => {
          const colorName = p.color?.toLowerCase() || '';
          if (col === 'white' || col === 'natural') return colorName.includes('white') || colorName.includes('rfd') || colorName.includes('natural');
          return colorName.includes(col);
        });
      });
    }

    // 6. Weaves (Multi-select)
    if (filters.weaves.length > 0) {
      result = result.filter((p) => {
        return filters.weaves.some((w) => p.weave_type?.toLowerCase().includes(w.toLowerCase()));
      });
    }

    // 7. Properties (RFD, Organic, Stretch, Soft, Matte, Sheer)
    if (filters.properties.length > 0) {
      result = result.filter((p) => {
        return filters.properties.every((prop) => {
          if (prop === 'rfd') return p.color?.toLowerCase().includes('rfd') || p.color?.toLowerCase().includes('white');
          if (prop === 'organic') return p.certifications?.some((c) => c.toLowerCase().includes('gots') || c.toLowerCase().includes('organic')) || p.category.toLowerCase().includes('organic');
          if (prop === 'oeko') return p.certifications?.some((c) => c.toLowerCase().includes('oeko'));
          if (prop === 'stretch') return p.stretch?.toLowerCase().includes('stretch') || p.category.toLowerCase().includes('spandex') || p.category.toLowerCase().includes('lycra');
          if (prop === 'soft') return p.feel?.toLowerCase().includes('soft') || p.description?.toLowerCase().includes('soft') || p.count?.toLowerCase().includes('combed');
          if (prop === 'sheer') return p.transparency?.toLowerCase().includes('sheer') || p.category.toLowerCase().includes('organza') || p.category.toLowerCase().includes('georgette');
          return true;
        });
      });
    }

    // 8. GSM Weight Range
    if (filters.gsmRange && filters.gsmRange !== 'All') {
      if (filters.gsmRange === 'light') {
        result = result.filter((p) => p.gsm < 90);
      } else if (filters.gsmRange === 'medium') {
        result = result.filter((p) => p.gsm >= 90 && p.gsm <= 180);
      } else if (filters.gsmRange === 'heavy') {
        result = result.filter((p) => p.gsm > 180);
      }
    }

    // 9. Price Range
    result = result.filter(
      (p) => p.price_per_meter >= filters.minPrice && p.price_per_meter <= filters.maxPrice
    );

    // 10. Sorting
    if (filters.sort === 'price-asc') {
      result.sort((a, b) => a.price_per_meter - b.price_per_meter);
    } else if (filters.sort === 'price-desc') {
      result.sort((a, b) => b.price_per_meter - a.price_per_meter);
    } else if (filters.sort === 'gsm-asc') {
      result.sort((a, b) => a.gsm - b.gsm);
    } else if (filters.sort === 'gsm-desc') {
      result.sort((a, b) => b.gsm - a.gsm);
    } else if (filters.sort === 'rating') {
      result.sort((a, b) => (b.rating || 4.5) - (a.rating || 4.5));
    } else if (filters.sort === 'newest') {
      result.sort((a, b) => b.id.localeCompare(a.id));
    }

    return result;
  }, [products, filters]);

  // Pagination slice
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE) || 1;
  const currentPage = Math.min(filters.page, totalPages);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  // Dynamic Category Title and Description
  const categoryTitle = useMemo(() => {
    if (filters.usages.length > 0) {
      const usageNames = filters.usages.map((u) => u.charAt(0).toUpperCase() + u.slice(1)).join(' & ');
      return `${usageNames} Fabrics`;
    }
    if (filters.category && filters.category !== 'All') {
      return `${filters.category} Fabric Qualities`;
    }
    return 'All Verified Textile Mill Fabrics';
  }, [filters.category, filters.usages]);

  const categoryDescription = useMemo(() => {
    if (filters.usages.includes('upholstery')) {
      return 'Heavyweight, abrasion-tested natural and blended fabrics crafted for luxury upholstery, sofa covers, drapery, and interior living spaces.';
    }
    if (filters.category && filters.category !== 'All') {
      return `Explore authentic direct mill ${filters.category.toLowerCase()} qualities with lab-tested GSM calibrations, reactive print compatibility, and continuous cut guarantees.`;
    }
    return 'Browse 100% verified natural, cellulosic, and silk base fabrics direct from master looms for custom reactive digital printing and wholesale tailoring.';
  }, [filters.category, filters.usages]);

  return (
    <div className="min-h-screen pt-4 pb-32 lg:py-6 bg-[var(--bg-main)] text-[var(--text-main)] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5 sm:space-y-6">
        
        {/* 1. Breadcrumbs */}
        <nav className="flex items-center space-x-1.5 text-xs text-gray-500 dark:text-gray-400">
          <span className="hover:text-black dark:hover:text-white cursor-pointer font-medium">Home</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span
            onClick={() => handleResetFilters()}
            className="hover:text-black dark:hover:text-white cursor-pointer font-medium"
          >
            Fabrics
          </span>
          {filters.category !== 'All' && (
            <>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="font-bold text-gray-900 dark:text-white">{filters.category}</span>
            </>
          )}
          {filters.usages.length > 0 && (
            <>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="font-bold text-gray-900 dark:text-white capitalize">{filters.usages.join(', ')}</span>
            </>
          )}
        </nav>

        {/* 2. Hero Category Header Banner (Tex India Mart / Sahni Fabrics Style) */}
        <div className="relative overflow-hidden bg-gradient-to-r from-[#111827] via-[#1E293B] to-[#0F100F] rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-lg text-white border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center space-x-1.5 border border-white/20 bg-white/10 backdrop-blur-md px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold text-[#D4AF37] uppercase tracking-wider">
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#D4AF37]" />
              <span>Certified Mill Looms • 300 DPI Reactive Print</span>
            </div>

            <h1 className="text-xl sm:text-3xl md:text-4xl font-black text-white font-editorial tracking-tight leading-tight">
              {categoryTitle}
            </h1>

            <p className="text-xs sm:text-sm text-gray-300 font-normal leading-relaxed">
              {categoryDescription}
            </p>

            <div className="pt-1 flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-gray-400">
              <span>
                Matching <strong className="text-white font-bold">{filteredProducts.length}</strong> qualities
              </span>
              <span>•</span>
              <span className="text-emerald-400 font-bold">100% Tested Natural Fibers</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto shrink-0">
            <button
              type="button"
              onClick={() => {
                setComparisonBaseProduct(filteredProducts[0] || products[0]);
                setComparatorModalOpen(true);
              }}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center justify-center space-x-1.5 transition shadow-sm backdrop-blur-sm"
            >
              <Scale className="w-4 h-4 text-[#D4AF37]" />
              <span>Compare Fabrics</span>
            </button>

            <button
              type="button"
              onClick={() => setSwatchModalOpen(true)}
              className="bg-[#D4AF37] hover:bg-[#C29B27] text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center justify-center space-x-1.5 transition shadow-sm"
            >
              <BookOpen className="w-4 h-4 text-slate-950" />
              <span>Order Swatch Book (₹499)</span>
            </button>
          </div>
        </div>

        {/* 3. Global Search & Results Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-[#1A1C1E] p-3 rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm">
          
          {/* Live Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => handleFilterChange({ search: e.target.value, page: 1 })}
              placeholder="Search by fabric name, SKU, count, GSM, weave (e.g. Cotton, 220, Crepe, French Terry)..."
              className="w-full pl-10 pr-9 py-2 rounded-xl bg-gray-50 dark:bg-[#141517] border border-gray-200 dark:border-white/10 text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2D325A] transition"
            />
            {filters.search && (
              <button
                onClick={() => handleFilterChange({ search: '', page: 1 })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Right Action Controls: Mobile Filter Button + Sort + View Mode Switcher */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Mobile Filter Drawer Trigger */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden px-3 py-2 rounded-xl bg-[#2D325A] text-white text-xs font-bold flex items-center space-x-1.5 shadow-sm"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Filters ({filteredProducts.length})</span>
            </button>

            {/* Sort Selector */}
            <div className="flex items-center space-x-1.5 bg-gray-50 dark:bg-[#141517] px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 text-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
              <select
                value={filters.sort}
                onChange={(e) => handleFilterChange({ sort: e.target.value, page: 1 })}
                className="bg-transparent font-semibold text-gray-800 dark:text-gray-200 text-xs focus:outline-none cursor-pointer pr-1"
              >
                <option value="featured" className="bg-white dark:bg-[#1A1C1E] text-gray-800 dark:text-white">Featured</option>
                <option value="price-asc" className="bg-white dark:bg-[#1A1C1E] text-gray-800 dark:text-white">Price: Low to High</option>
                <option value="price-desc" className="bg-white dark:bg-[#1A1C1E] text-gray-800 dark:text-white">Price: High to Low</option>
                <option value="gsm-asc" className="bg-white dark:bg-[#1A1C1E] text-gray-800 dark:text-white">GSM: Light to Heavy</option>
                <option value="gsm-desc" className="bg-white dark:bg-[#1A1C1E] text-gray-800 dark:text-white">GSM: Heavy to Light</option>
                <option value="rating" className="bg-white dark:bg-[#1A1C1E] text-gray-800 dark:text-white">Top Rated</option>
                <option value="newest" className="bg-white dark:bg-[#1A1C1E] text-gray-800 dark:text-white">Newest Arrivals</option>
              </select>
            </div>

            {/* Grid / List View Toggle */}
            <div className="flex items-center bg-gray-100 dark:bg-[#141517] p-1 rounded-xl border border-gray-200 dark:border-white/10">
              <button
                onClick={() => handleFilterChange({ viewMode: 'grid' })}
                className={`p-1.5 rounded-lg transition ${
                  filters.viewMode === 'grid'
                    ? 'bg-white dark:bg-[#25282B] text-[#2D325A] dark:text-blue-400 shadow-sm'
                    : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
                title="Grid Cards"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleFilterChange({ viewMode: 'table' })}
                className={`p-1.5 rounded-lg transition ${
                  filters.viewMode === 'table'
                    ? 'bg-white dark:bg-[#25282B] text-[#2D325A] dark:text-blue-400 shadow-sm'
                    : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
                title="Specification Table"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

        {/* 4. Active Filters Chips Row */}
        <FabricActiveFilterChips
          filters={filters}
          totalResults={filteredProducts.length}
          onRemoveCategory={() => handleFilterChange({ category: 'All', page: 1 })}
          onRemoveUsage={(u) => handleFilterChange({ usages: filters.usages.filter((x) => x !== u), page: 1 })}
          onRemovePattern={(p) => handleFilterChange({ patterns: filters.patterns.filter((x) => x !== p), page: 1 })}
          onRemoveColor={(c) => handleFilterChange({ colors: filters.colors.filter((x) => x !== c), page: 1 })}
          onRemoveWeave={(w) => handleFilterChange({ weaves: filters.weaves.filter((x) => x !== w), page: 1 })}
          onRemoveProperty={(pr) => handleFilterChange({ properties: filters.properties.filter((x) => x !== pr), page: 1 })}
          onRemoveGsm={() => handleFilterChange({ gsmRange: 'All', page: 1 })}
          onRemovePrice={() => handleFilterChange({ minPrice: 0, maxPrice: 1500, page: 1 })}
          onRemoveSearch={() => handleFilterChange({ search: '', page: 1 })}
          onResetAll={handleResetFilters}
        />

        {/* 5. Main Section: 2-Column (Accordion Sidebar + Product Grid) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
          
          {/* Left Column: Tex India Mart-Style Accordion Filter Sidebar */}
          <div className="hidden lg:block lg:col-span-3">
            <FabricFilterSidebar
              products={products}
              filters={filters}
              onFilterChange={handleFilterChange}
              onResetFilters={handleResetFilters}
            />
          </div>

          {/* Right Column: Fabric Cards Grid / Table */}
          <div className="lg:col-span-9 space-y-6">
            
            {filteredProducts.length === 0 ? (
              /* Empty Results State */
              <div className="p-12 text-center bg-white dark:bg-[#1A1C1E] rounded-3xl border border-gray-200 dark:border-white/10 shadow-sm space-y-4">
                <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center mx-auto text-gray-400">
                  <PackageOpen className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    No fabrics match your selected criteria
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                    Try adjusting your price filter, clearing search keywords, or selecting a broader fabric type.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="px-5 py-2.5 bg-[#2D325A] text-white font-bold text-xs rounded-xl shadow-md hover:bg-[#1F2342] transition inline-flex items-center space-x-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Clear All Filters</span>
                </button>
              </div>
            ) : filters.viewMode === 'grid' ? (
              /* Image-First Product Grid (3-4 desktop, 2-3 tablet, 2 mobile) */
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-5">
                {paginatedProducts.map((product) => (
                  <FabricCard
                    key={product.id}
                    product={product}
                    onSelect={onSelectProduct}
                    onQuickView={(p) => setQuickViewProduct(p)}
                  />
                ))}
              </div>
            ) : (
              /* Table Specification View */
              <div className="bg-white dark:bg-[#1A1C1E] rounded-2xl border border-gray-200 dark:border-white/10 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-[#141517] text-gray-700 dark:text-gray-300 font-extrabold uppercase tracking-wider border-b border-gray-200 dark:border-white/10 text-[10.5px]">
                        <th className="py-3 px-4">SKU</th>
                        <th className="py-3 px-4">Fabric Name</th>
                        <th className="py-3 px-4">Category</th>
                        <th className="py-3 px-4">Yarn Count</th>
                        <th className="py-3 px-4">GSM</th>
                        <th className="py-3 px-4">Width</th>
                        <th className="py-3 px-4">Weave</th>
                        <th className="py-3 px-4 text-right">Price/m</th>
                        <th className="py-3 px-4 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                      {paginatedProducts.map((p) => (
                        <tr
                          key={p.id}
                          onClick={() => onSelectProduct(p)}
                          className="hover:bg-blue-50/50 dark:hover:bg-blue-950/20 cursor-pointer transition"
                        >
                          <td className="py-3 px-4 font-mono font-bold text-[#1E3A8A] dark:text-blue-400 text-[11px]">
                            {p.sku || `TIM${p.category.slice(0, 3).toUpperCase()}${p.gsm}`}
                          </td>
                          <td className="py-3 px-4 font-bold text-gray-900 dark:text-white">
                            {p.name}
                          </td>
                          <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                            {p.category}
                          </td>
                          <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                            {p.count || 'Combed'}
                          </td>
                          <td className="py-3 px-4 font-bold text-[#1E3A8A] dark:text-blue-400">
                            {p.gsm}
                          </td>
                          <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                            {p.width}
                          </td>
                          <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                            {p.weave_type || 'Plain'}
                          </td>
                          <td className="py-3 px-4 font-black text-[#9B1B30] dark:text-[#EF4444] text-right">
                            ₹{p.price_per_meter.toFixed(2)}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onSelectProduct(p);
                              }}
                              className="px-3 py-1 bg-[#2D325A] text-white hover:bg-[#1E2345] rounded-lg font-bold text-[11px] transition shadow-xs"
                            >
                              Customize
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 6. Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-white/10 text-xs">
                <span className="text-gray-500 dark:text-gray-400">
                  Page <strong className="text-gray-900 dark:text-white">{currentPage}</strong> of <strong className="text-gray-900 dark:text-white">{totalPages}</strong>
                </span>

                <div className="flex items-center space-x-1.5">
                  <button
                    type="button"
                    disabled={currentPage <= 1}
                    onClick={() => handleFilterChange({ page: currentPage - 1 })}
                    className="px-3 py-1.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1A1C1E] font-bold disabled:opacity-40 hover:bg-gray-100"
                  >
                    Previous
                  </button>

                  <div className="hidden sm:flex items-center space-x-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                      <button
                        key={pg}
                        type="button"
                        onClick={() => handleFilterChange({ page: pg })}
                        className={`w-8 h-8 rounded-xl font-bold transition ${
                          currentPage === pg
                            ? 'bg-[#2D325A] text-white shadow-xs'
                            : 'bg-white dark:bg-[#1A1C1E] border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-100'
                        }`}
                      >
                        {pg}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    disabled={currentPage >= totalPages}
                    onClick={() => handleFilterChange({ page: currentPage + 1 })}
                    className="px-3 py-1.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1A1C1E] font-bold disabled:opacity-40 hover:bg-gray-100"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>

      {/* 👑 Curated Popular Designs Section */}
      <div className="border-t border-gray-200 dark:border-white/10 mt-12 pt-8">
        <PopularDesignsSection
          onSelectDesignForCustomizer={(designUrl, designName) => {
            const targetProduct = filteredProducts[0] || products[0];
            if (targetProduct) {
              onSelectProduct(targetProduct);
            }
          }}
          onOpenAllDesignsModal={() => setIsPreloadedModalOpen(true)}
        />
      </div>

      {/* 📁 Modal 1: Mobile Filter Sheet */}
      {mobileFilterOpen && (
        <FabricFilterSidebar
          products={products}
          filters={filters}
          onFilterChange={handleFilterChange}
          onResetFilters={handleResetFilters}
          isMobileDrawer={true}
          onCloseMobileDrawer={() => setMobileFilterOpen(false)}
        />
      )}

      {/* 📁 Modal 2: Quick View Modal */}
      <FabricQuickViewModal
        isOpen={Boolean(quickViewProduct)}
        onClose={() => setQuickViewProduct(null)}
        product={quickViewProduct}
        onCustomize={onSelectProduct}
      />

      {/* 📁 Modal 3: Swatch Book Order Modal */}
      <SwatchBookOrderModal
        isOpen={swatchModalOpen}
        onClose={() => setSwatchModalOpen(false)}
      />

      {/* 📁 Modal 4: Preloaded Designs Picker */}
      <PreloadedDesignModal
        isOpen={isPreloadedModalOpen}
        onClose={() => setIsPreloadedModalOpen(false)}
        onSelectDesign={(design) => {
          const targetProduct = filteredProducts[0] || products[0];
          if (targetProduct) {
            onSelectProduct(targetProduct);
          }
        }}
      />

      {/* 📁 Modal 5: Side-by-Side Fabric Comparator */}
      {comparisonBaseProduct && (
        <FabricComparisonModal
          isOpen={comparatorModalOpen}
          onClose={() => setComparatorModalOpen(false)}
          baseProduct={comparisonBaseProduct}
          allProducts={products}
          onSelectProductForCustomization={(p) => {
            onSelectProduct(p);
            setComparatorModalOpen(false);
          }}
        />
      )}

    </div>
  );
};

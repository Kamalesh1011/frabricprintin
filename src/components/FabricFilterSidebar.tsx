import React, { useState, useMemo } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Search,
  Check,
  RotateCcw,
  SlidersHorizontal,
  X,
  Sparkles,
  Layers,
  Filter
} from 'lucide-react';
import { Product } from '../types';
import { FabricFilters } from '../utils/urlFilterSync';

interface FabricFilterSidebarProps {
  products: Product[];
  filters: FabricFilters;
  onFilterChange: (newFilters: Partial<FabricFilters>) => void;
  onResetFilters: () => void;
  isMobileDrawer?: boolean;
  onCloseMobileDrawer?: () => void;
}

export const FABRIC_TYPES_ORDER = [
  'Cotton',
  'Viscose',
  'Silk',
  'Linen',
  'Rayon',
  'Modal',
  'Polyester',
  'Fabric Blends',
  'Bamboo',
  'Organic Cotton',
  'Tencel',
  'Organza'
];

export const USAGES_LIST = [
  { id: 'upholstery', label: 'Upholstery & Home' },
  { id: 'shirt', label: 'Shirts & Tops' },
  { id: 'dress', label: 'Dresses & Kurtis' },
  { id: 'cushion', label: 'Cushions & Covers' },
  { id: 'curtain', label: 'Curtains & Drapes' },
  { id: 'bags', label: 'Bags & Accessories' },
  { id: 'quilting', label: 'Quilting & Craft' },
  { id: 'sportswear', label: 'Active & Sportswear' },
  { id: 'hoodies', label: 'Hoodies & Sweatshirts' },
  { id: 'bedsheet', label: 'Bed Linen & Sheets' },
  { id: 'kids', label: 'Kids Fashion & Decor' }
];

export const PATTERNS_LIST = [
  { id: 'plain', label: 'Plain / Solid Base' },
  { id: 'floral', label: 'Floral & Botanical' },
  { id: 'abstract', label: 'Abstract & Modern' },
  { id: 'geometric', label: 'Geometric & Lines' },
  { id: 'stripes', label: 'Stripes & Checks' },
  { id: 'ikat', label: 'Ikat & Traditional' },
  { id: 'jacquard', label: 'Jacquard & Textured' },
  { id: 'embroidery', label: 'Embroidered Textures' }
];

export const COLOR_SWATCHES = [
  { id: 'white', label: 'White', hex: '#FFFFFF', border: true },
  { id: 'natural', label: 'Natural / Ivory', hex: '#FDFBF7', border: true },
  { id: 'black', label: 'Black', hex: '#111827' },
  { id: 'blue', label: 'Blue', hex: '#2563EB' },
  { id: 'navy', label: 'Navy', hex: '#1E293B' },
  { id: 'red', label: 'Red / Crimson', hex: '#DC2626' },
  { id: 'pink', label: 'Pink / Rose', hex: '#EC4899' },
  { id: 'green', label: 'Forest Green', hex: '#16A34A' },
  { id: 'yellow', label: 'Gold / Yellow', hex: '#EAB308' },
  { id: 'terracotta', label: 'Terracotta', hex: '#C25E3E' },
  { id: 'multi', label: 'Multicolor', hex: 'linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 100%)' }
];

export const WEAVES_LIST = [
  'Plain Weave',
  'Single Jersey Knit',
  'French Terry Knit',
  'Satin',
  'Crepe',
  'Slub',
  'Twill',
  'Organza',
  'Poplin'
];

export const PROPERTIES_LIST = [
  { id: 'rfd', label: 'Ready For Dyeing (RFD)' },
  { id: 'organic', label: 'GOTS Certified Organic' },
  { id: 'oeko', label: 'OEKO-TEX Standard 100' },
  { id: 'stretch', label: 'Active Stretch (Lycra/Spandex)' },
  { id: 'soft', label: 'Ultra Soft / Combed' },
  { id: 'matte', label: 'Matte Natural Finish' },
  { id: 'sheer', label: 'Sheer / Translucent' }
];

export const FabricFilterSidebar: React.FC<FabricFilterSidebarProps> = ({
  products,
  filters,
  onFilterChange,
  onResetFilters,
  isMobileDrawer = false,
  onCloseMobileDrawer
}) => {
  // Accordion toggle states
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    types: true
  });

  const [typeSearch, setTypeSearch] = useState('');

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // Dynamic counts calculation based on products
  const counts = useMemo(() => {
    const typeCount: Record<string, number> = { All: products.length };

    products.forEach((p) => {
      if (p.category) {
        typeCount[p.category] = (typeCount[p.category] || 0) + 1;
      }
    });

    return { typeCount };
  }, [products]);

  // Filtered types for search inside sidebar
  const visibleTypes = useMemo(() => {
    const list = ['All', ...FABRIC_TYPES_ORDER];
    if (!typeSearch.trim()) return list;
    const q = typeSearch.toLowerCase();
    return list.filter((t) => t.toLowerCase().includes(q));
  }, [typeSearch]);

  const hasActiveFilters = Boolean(filters.category && filters.category !== 'All');

  const content = (
    <div className="space-y-4 text-xs font-sans">
      
      {/* Sidebar Top Header & Reset Action */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-white/10">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-[#2D325A] dark:text-blue-400" />
          <span className="font-extrabold text-sm uppercase tracking-wider text-gray-900 dark:text-white">
            Fabric Type
          </span>
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="text-[11px] font-bold text-red-600 dark:text-red-400 hover:underline flex items-center space-x-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* ════════════════════════════════════════════════════════════════
          ACCORDION: FABRIC TYPE (Cotton, Viscose, Silk, Linen, etc.)
         ════════════════════════════════════════════════════════════════ */}
      <div>
        <button
          type="button"
          onClick={() => toggleSection('types')}
          className="w-full flex items-center justify-between py-1.5 text-left font-bold text-gray-900 dark:text-white hover:text-[#2D325A] dark:hover:text-blue-400 transition"
        >
          <span className="text-xs uppercase tracking-wider font-extrabold">Fabric Categories</span>
          {openSections.types ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </button>

        {openSections.types && (
          <div className="mt-2 space-y-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search fabric types..."
                value={typeSearch}
                onChange={(e) => setTypeSearch(e.target.value)}
                className="w-full pl-8 pr-2 py-1.5 bg-gray-50 dark:bg-[#141517] rounded-lg border border-gray-200 dark:border-white/10 text-[11px] focus:outline-none focus:ring-1 focus:ring-[#2D325A]"
              />
            </div>

            <div className="max-h-96 overflow-y-auto space-y-1 pr-1 scrollbar-thin">
              {visibleTypes.map((type) => {
                const isSelected = filters.category.toLowerCase() === type.toLowerCase();
                const count = counts.typeCount[type] ?? (type === 'All' ? products.length : 0);

                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => onFilterChange({ category: type, page: 1 })}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-left transition ${
                      isSelected
                        ? 'bg-[#2D325A] text-white font-bold shadow-xs'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center space-x-2 truncate">
                      <div
                        className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                          isSelected ? 'border-white bg-white/20' : 'border-gray-300 dark:border-white/20'
                        }`}
                      >
                        {isSelected && <Check className="w-2.5 h-2.5 text-white" />}
                      </div>
                      <span className="truncate text-xs">{type}</span>
                    </div>
                    <span className={`text-[10px] ml-2 ${isSelected ? 'text-white/80 font-bold' : 'text-gray-400'}`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

    </div>
  );

  // If rendering inside mobile modal/drawer
  if (isMobileDrawer) {
    return (
      <div
        className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200"
        onClick={onCloseMobileDrawer}
      >
        <div
          className="bg-white dark:bg-[#1A1C1E] text-gray-900 dark:text-white w-full max-w-sm h-full flex flex-col p-5 shadow-2xl animate-in slide-in-from-right duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-white/10">
            <h3 className="font-extrabold text-base uppercase tracking-tight font-editorial">
              Fabric Filter Panel
            </h3>
            <button
              onClick={onCloseMobileDrawer}
              className="p-1.5 text-gray-400 hover:text-black dark:hover:text-white rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-4 pr-1">
            {content}
          </div>

          <div className="pt-4 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] border-t border-gray-200 dark:border-white/10 flex items-center space-x-2">
            <button
              type="button"
              onClick={() => {
                onResetFilters();
                onCloseMobileDrawer?.();
              }}
              className="flex-1 py-3 bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 font-bold rounded-xl text-xs hover:bg-gray-200 transition"
            >
              Reset All
            </button>
            <button
              type="button"
              onClick={onCloseMobileDrawer}
              className="flex-1 py-3 bg-[#2D325A] text-white font-bold rounded-xl text-xs shadow-md hover:bg-[#1F2342] transition"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Desktop Card Container
  return (
    <aside className="bg-white dark:bg-[#1A1C1E] rounded-2xl border border-gray-200 dark:border-white/10 p-4 shadow-sm">
      {content}
    </aside>
  );
};

import React from 'react';
import { X, RotateCcw } from 'lucide-react';
import { FabricFilters } from '../utils/urlFilterSync';

interface FabricActiveFilterChipsProps {
  filters: FabricFilters;
  totalResults: number;
  onRemoveCategory: () => void;
  onRemoveUsage: (usage: string) => void;
  onRemovePattern: (pattern: string) => void;
  onRemoveColor: (color: string) => void;
  onRemoveWeave: (weave: string) => void;
  onRemoveProperty: (prop: string) => void;
  onRemoveGsm: () => void;
  onRemovePrice: () => void;
  onRemoveSearch: () => void;
  onResetAll: () => void;
}

export const FabricActiveFilterChips: React.FC<FabricActiveFilterChipsProps> = ({
  filters,
  totalResults,
  onRemoveCategory,
  onRemoveUsage,
  onRemovePattern,
  onRemoveColor,
  onRemoveWeave,
  onRemoveProperty,
  onRemoveGsm,
  onRemovePrice,
  onRemoveSearch,
  onResetAll
}) => {
  const hasActiveFilters =
    (filters.category && filters.category !== 'All') ||
    filters.usages.length > 0 ||
    filters.patterns.length > 0 ||
    filters.colors.length > 0 ||
    filters.weaves.length > 0 ||
    filters.properties.length > 0 ||
    (filters.gsmRange && filters.gsmRange !== 'All') ||
    filters.maxPrice < 1500 ||
    filters.minPrice > 0 ||
    Boolean(filters.search.trim());

  if (!hasActiveFilters) {
    return (
      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 py-1">
        <span>
          Showing <strong className="text-gray-900 dark:text-white font-bold">{totalResults}</strong> fabrics
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-1.5 py-1 text-xs">
      <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 mr-1">
        Active Filters ({totalResults}):
      </span>

      {/* Category Chip */}
      {filters.category && filters.category !== 'All' && (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#2D325A] text-white text-[11px] font-bold shadow-xs">
          <span>Type: {filters.category}</span>
          <button onClick={onRemoveCategory} className="hover:opacity-75 ml-0.5">
            <X className="w-3 h-3" />
          </button>
        </span>
      )}

      {/* Search Query Chip */}
      {filters.search && (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-[11px] font-bold">
          <span>Search: "{filters.search}"</span>
          <button onClick={onRemoveSearch} className="hover:opacity-75 ml-0.5">
            <X className="w-3 h-3" />
          </button>
        </span>
      )}

      {/* Usages Chips */}
      {filters.usages.map((u) => (
        <span
          key={u}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/40 text-blue-900 dark:text-blue-300 text-[11px] font-semibold"
        >
          <span className="capitalize">{u}</span>
          <button onClick={() => onRemoveUsage(u)} className="hover:opacity-75 ml-0.5">
            <X className="w-3 h-3" />
          </button>
        </span>
      ))}

      {/* Pattern Chips */}
      {filters.patterns.map((p) => (
        <span
          key={p}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/40 text-purple-900 dark:text-purple-300 text-[11px] font-semibold"
        >
          <span className="capitalize">{p}</span>
          <button onClick={() => onRemovePattern(p)} className="hover:opacity-75 ml-0.5">
            <X className="w-3 h-3" />
          </button>
        </span>
      ))}

      {/* Color Chips */}
      {filters.colors.map((c) => (
        <span
          key={c}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-100 dark:bg-white/10 text-gray-800 dark:text-gray-200 text-[11px] font-semibold border border-gray-200 dark:border-white/10"
        >
          <span className="capitalize">{c}</span>
          <button onClick={() => onRemoveColor(c)} className="hover:opacity-75 ml-0.5">
            <X className="w-3 h-3" />
          </button>
        </span>
      ))}

      {/* GSM Chip */}
      {filters.gsmRange && filters.gsmRange !== 'All' && (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-100 dark:bg-white/10 text-gray-800 dark:text-gray-200 text-[11px] font-semibold border border-gray-200 dark:border-white/10">
          <span>GSM: {filters.gsmRange}</span>
          <button onClick={onRemoveGsm} className="hover:opacity-75 ml-0.5">
            <X className="w-3 h-3" />
          </button>
        </span>
      )}

      {/* Weave Chips */}
      {filters.weaves.map((w) => (
        <span
          key={w}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-100 dark:bg-white/10 text-gray-800 dark:text-gray-200 text-[11px] font-semibold border border-gray-200 dark:border-white/10"
        >
          <span>{w}</span>
          <button onClick={() => onRemoveWeave(w)} className="hover:opacity-75 ml-0.5">
            <X className="w-3 h-3" />
          </button>
        </span>
      ))}

      {/* Property Chips */}
      {filters.properties.map((prop) => (
        <span
          key={prop}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 text-emerald-900 dark:text-emerald-300 text-[11px] font-semibold"
        >
          <span className="capitalize">{prop}</span>
          <button onClick={() => onRemoveProperty(prop)} className="hover:opacity-75 ml-0.5">
            <X className="w-3 h-3" />
          </button>
        </span>
      ))}

      {/* Max Price Chip */}
      {(filters.maxPrice < 1500 || filters.minPrice > 0) && (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/40 text-rose-900 dark:text-rose-300 text-[11px] font-semibold">
          <span>₹{filters.minPrice} - ₹{filters.maxPrice}</span>
          <button onClick={onRemovePrice} className="hover:opacity-75 ml-0.5">
            <X className="w-3 h-3" />
          </button>
        </span>
      )}

      {/* Clear All CTA */}
      <button
        type="button"
        onClick={onResetAll}
        className="text-[11px] font-bold text-red-600 dark:text-red-400 hover:underline flex items-center space-x-1 ml-auto shrink-0"
      >
        <RotateCcw className="w-3 h-3" />
        <span>Clear All</span>
      </button>
    </div>
  );
};

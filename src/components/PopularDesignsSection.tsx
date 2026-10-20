import React, { useState, useRef } from 'react';
import {
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Palette,
  ArrowRight,
  Eye,
  Check,
  Flame,
  Layers
} from 'lucide-react';
import { Product } from '../types';

export interface PopularDesignItem {
  id: string;
  name: string;
  category: 'Floral' | 'Ikat & Chevron' | 'Botanical' | 'Mughal Damask' | 'Abstract Geometric' | 'Ethnic';
  imageUrl: string;
  tags: string[];
  recommendedFabrics: string[];
  popularScore: number;
}

export const POPULAR_DESIGNS_DATA: PopularDesignItem[] = [
  {
    id: 'pop-ikat-chevron',
    name: 'Earthy Chevron Ikat Weave',
    category: 'Ikat & Chevron',
    imageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=800',
    tags: ['Trending', 'Boho Chic', '300 DPI'],
    recommendedFabrics: ['Cotton Viscose Slub', 'Linen', 'Cotton Mulmul'],
    popularScore: 98
  },
  {
    id: 'pop-pink-lotus',
    name: 'Blush Lotus Symmetry Motif',
    category: 'Floral',
    imageUrl: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&q=80&w=800',
    tags: ['Bestseller', 'Pastel Bloom', '300 DPI'],
    recommendedFabrics: ['Viscose Moroccan Crepe', 'Silk Crepe', 'Modal Satin'],
    popularScore: 99
  },
  {
    id: 'pop-mustard-floral',
    name: 'Marigold Meadow Bellflower',
    category: 'Floral',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800',
    tags: ['Festive', 'Vibrant Yellow', '300 DPI'],
    recommendedFabrics: ['Cotton Cambric', 'Viscose Cupro', 'Tencel'],
    popularScore: 95
  },
  {
    id: 'pop-botanical-bloom',
    name: 'Vintage Botanical Blossom',
    category: 'Botanical',
    imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=800',
    tags: ['Designer Pick', 'Soft Pastel', '300 DPI'],
    recommendedFabrics: ['Mulberry Silk Crepe', 'Bamboo Lycra', 'Silk Organza'],
    popularScore: 97
  },
  {
    id: 'pop-autumn-foliage',
    name: 'Autumn Woodland Ferns & Berries',
    category: 'Botanical',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800',
    tags: ['Fall Season', 'Rich Earthy', '300 DPI'],
    recommendedFabrics: ['French Flax Linen', 'Cotton Poplin', 'Viscose Dobby'],
    popularScore: 94
  },
  {
    id: 'pop-mughal-damask',
    name: 'Royal Heritage Mughal Damask',
    category: 'Mughal Damask',
    imageUrl: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&q=80&w=800',
    tags: ['Luxury Couture', 'Gold & Ink', '300 DPI'],
    recommendedFabrics: ['Modal Satin', 'Viscose Drum Crepe', 'Silk'],
    popularScore: 96
  },
  {
    id: 'pop-geometric-tile',
    name: 'Indigo Mosaic Geometry',
    category: 'Abstract Geometric',
    imageUrl: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=800',
    tags: ['Modern Ethnic', 'High Precision', '300 DPI'],
    recommendedFabrics: ['Cotton Cambric', 'Organic Cotton', 'Linen'],
    popularScore: 92
  }
];

interface PopularDesignsSectionProps {
  onSelectDesignForCustomizer?: (designUrl: string, designName: string) => void;
  onOpenAllDesignsModal?: () => void;
}

export const PopularDesignsSection: React.FC<PopularDesignsSectionProps> = ({
  onSelectDesignForCustomizer,
  onOpenAllDesignsModal
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeSlideIdx, setActiveSlideIdx] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const categories = ['All', 'Floral', 'Ikat & Chevron', 'Botanical', 'Mughal Damask', 'Abstract Geometric'];

  const filteredDesigns = POPULAR_DESIGNS_DATA.filter((item) => {
    if (selectedCategory === 'All') return true;
    return item.category === selectedCategory;
  });

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      const progress = scrollLeft / (scrollWidth - clientWidth || 1);
      const index = Math.round(progress * (filteredDesigns.length - 1));
      setActiveSlideIdx(Math.max(0, Math.min(filteredDesigns.length - 1, index)));
    }
  };

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 text-[#0F100F] dark:text-white">
      
      {/* 👑 Section Header with Luxury Double-Bar Accent (Matching reference with our theme) */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full bg-[#AC7900]/10 dark:bg-[#D4AF37]/15 text-[#AC7900] dark:text-[#D4AF37] border border-[#AC7900]/25 text-xs font-bold uppercase tracking-wider">
          <Flame className="w-3.5 h-3.5 fill-current" />
          <span>Curated Mill Print Archive</span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-black font-editorial tracking-tight">
          Popular Designs
        </h2>

        {/* Dual-tone brand underline accent (Burgundy Coral & Deep Indigo) */}
        <div className="flex items-center justify-center space-x-1.5 pt-0.5">
          <div className="h-1 w-12 rounded-full bg-[#B91C1C] dark:bg-[#EF4444]" />
          <div className="h-1 w-16 rounded-full bg-[#2D325A] dark:bg-[#D4AF37]" />
        </div>

        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 max-w-xl mx-auto font-normal">
          Explore top-selling 300 DPI seamless repeat motifs ready to print on 100% natural, viscose &amp; silk fabric bases.
        </p>
      </div>

      {/* 🏷️ Filter Categories Pills */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 ${
              selectedCategory === cat
                ? 'bg-[#0F100F] dark:bg-white text-white dark:text-[#0F100F] shadow-sm'
                : 'bg-white dark:bg-[#1A1C1E] text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-white/10 hover:border-[#AC7900]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 🖼️ Carousel Container */}
      <div className="relative group">
        
        {/* Navigation Buttons */}
        <button
          onClick={() => scroll('left')}
          className="absolute -left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white dark:bg-[#1A1C1E] border border-gray-200 dark:border-white/10 shadow-lg flex items-center justify-center text-gray-800 dark:text-gray-200 hover:scale-105 transition hidden sm:flex"
          title="Previous designs"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={() => scroll('right')}
          className="absolute -right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white dark:bg-[#1A1C1E] border border-gray-200 dark:border-white/10 shadow-lg flex items-center justify-center text-gray-800 dark:text-gray-200 hover:scale-105 transition hidden sm:flex"
          title="Next designs"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Scrollable Row of 5+ Square Motif Cards */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex items-stretch gap-4 overflow-x-auto pb-4 pt-1 px-1 scroll-smooth scrollbar-none"
        >
          {filteredDesigns.map((design) => (
            <div
              key={design.id}
              className="w-56 sm:w-60 md:w-64 shrink-0 rounded-2xl bg-white dark:bg-[#1A1C1E] border border-gray-200 dark:border-white/10 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group/card"
            >
              {/* Square Image Swatch Preview */}
              <div className="relative aspect-square w-full bg-gray-100 dark:bg-black/40 overflow-hidden cursor-pointer">
                <img
                  src={design.imageUrl}
                  alt={design.name}
                  className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-500"
                  loading="lazy"
                />

                {/* Top Badge */}
                <div className="absolute top-2.5 left-2.5">
                  <span className="bg-[#0F100F]/80 dark:bg-black/80 text-white text-[9px] font-bold px-2 py-0.5 rounded-md backdrop-blur-xs">
                    {design.category}
                  </span>
                </div>

                {/* 300 DPI Resolution Indicator */}
                <div className="absolute top-2.5 right-2.5">
                  <span className="bg-emerald-600/90 text-white text-[9px] font-bold px-2 py-0.5 rounded-md shadow-xs">
                    300 DPI
                  </span>
                </div>

                {/* Overlay Quick Action on Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity flex flex-col justify-end p-3 text-white">
                  <button
                    onClick={() => onSelectDesignForCustomizer?.(design.imageUrl, design.name)}
                    className="w-full py-2 bg-white text-black font-bold text-xs rounded-xl shadow-lg hover:bg-gray-100 transition flex items-center justify-center space-x-1"
                  >
                    <Palette className="w-3.5 h-3.5 text-[#AC7900]" />
                    <span>Customize on Fabric</span>
                  </button>
                </div>
              </div>

              {/* Card Meta Content */}
              <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2">
                <div>
                  <h4 className="font-bold text-xs text-gray-900 dark:text-white line-clamp-1 group-hover/card:text-[#AC7900] transition">
                    {design.name}
                  </h4>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate mt-0.5">
                    Best on: {design.recommendedFabrics.join(', ')}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-gray-100 dark:border-white/5">
                  <span className="text-[10px] font-bold text-[#AC7900] dark:text-[#D4AF37]">
                    ★ {design.popularScore}% Demand
                  </span>
                  <button
                    onClick={() => onSelectDesignForCustomizer?.(design.imageUrl, design.name)}
                    className="text-[11px] font-bold text-gray-800 dark:text-gray-200 hover:underline flex items-center space-x-0.5"
                  >
                    <span>Use Design</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>

      {/* ⚪ Pagination Indicator Dots */}
      <div className="flex items-center justify-center space-x-1.5 pt-2">
        {filteredDesigns.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              setActiveSlideIdx(idx);
              if (scrollContainerRef.current) {
                const targetScroll = (scrollContainerRef.current.scrollWidth / filteredDesigns.length) * idx;
                scrollContainerRef.current.scrollTo({ left: targetScroll, behavior: 'smooth' });
              }
            }}
            className={`h-2 rounded-full transition-all duration-300 ${
              activeSlideIdx === idx
                ? 'w-6 bg-[#B91C1C] dark:bg-[#EF4444]'
                : 'w-2 bg-gray-300 dark:bg-white/20 hover:bg-gray-400'
            }`}
          />
        ))}
      </div>

      {/* 🔴 Primary Action Button: "More Popular Designs" (Matching reference with theme) */}
      <div className="text-center pt-2">
        <button
          type="button"
          onClick={onOpenAllDesignsModal}
          className="inline-flex items-center space-x-2 px-8 py-3.5 rounded-full bg-[#B91C1C] hover:bg-[#991B1B] text-white font-bold text-xs uppercase tracking-wider transition shadow-md hover:shadow-lg hover:scale-[1.02]"
        >
          <Sparkles className="w-4 h-4" />
          <span>More Popular Designs</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </section>
  );
};

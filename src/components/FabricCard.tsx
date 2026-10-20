import React, { useState } from 'react';
import {
  Heart,
  Copy,
  Check,
  Eye,
  Sparkles,
  Maximize2,
  ShieldCheck,
  Palette,
  Layers,
  Image as ImageIcon
} from 'lucide-react';
import { Product } from '../types';
import { useWishlist } from '../context/WishlistContext';

interface FabricCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onQuickView?: (product: Product) => void;
  previewDesignUrl?: string;
}

export const FabricCard: React.FC<FabricCardProps> = ({
  product,
  onSelect,
  onQuickView,
  previewDesignUrl
}) => {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const isFavorite = isInWishlist(product.id);
  const [copiedSku, setCopiedSku] = useState(false);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [showRuler, setShowRuler] = useState(true);
  const [imgError, setImgError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Generate clean SKU fallback if not present
  const displaySku =
    product.sku ||
    `TIM${product.category.substring(0, 3).toUpperCase()}${product.gsm}`;

  const handleCopySku = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(displaySku);
    setCopiedSku(true);
    setTimeout(() => setCopiedSku(false), 1800);
  };

  const images = product.images && product.images.length > 0
    ? product.images
    : product.image_url
    ? [product.image_url]
    : [];

  const currentImg = images[activeImageIdx] || '/mockups/white_fabric_folded_swatches.jpg';

  return (
    <div
      className="group relative flex flex-col bg-white dark:bg-[#1A1C1E] rounded-2xl border border-[#E5E7EB] dark:border-white/10 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
      id={`fabric-card-${product.id}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 1. Header Bar: SKU + Wishlist */}
      <div className="flex items-center justify-between px-3.5 py-2 bg-[#F8F9FA] dark:bg-[#141517] border-b border-[#E5E7EB] dark:border-white/10 text-xs">
        <div className="flex items-center space-x-1.5">
          <span className="font-extrabold text-[#1E293B] dark:text-gray-200 uppercase tracking-wide text-[11px]">
            SKU :
          </span>
          <span className="font-bold text-[#1E3A8A] dark:text-blue-400 tracking-wider text-[11px]">
            {displaySku}
          </span>
          <button
            onClick={handleCopySku}
            className="p-1 hover:bg-black/5 dark:hover:bg-white/10 rounded text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition"
            title="Copy SKU code"
          >
            {copiedSku ? (
              <Check className="w-3 h-3 text-emerald-600" />
            ) : (
              <Copy className="w-3 h-3" />
            )}
          </button>
        </div>

        <div className="flex items-center space-x-1">
          {product.bestseller && (
            <span className="bg-[#D4AF37]/15 text-[#996515] dark:text-[#E6CA65] text-[9px] font-bold px-2 py-0.5 rounded-full border border-[#D4AF37]/30 uppercase">
              Bestseller
            </span>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(product);
            }}
            className={`p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition ${
              isFavorite ? 'text-[#DC2626]' : 'text-gray-400 hover:text-[#DC2626]'
            }`}
            title="Add to Wishlist"
          >
            <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

        {/* 2. Fabric Swatch Preview with Calibrated Textile Ruler Overlay */}
      <div
        className="relative aspect-square w-full bg-[#F3F4F6] dark:bg-[#202225] overflow-hidden cursor-pointer select-none"
        onClick={() => onSelect(product)}
      >
        {!imgError ? (
          <>
            {/* Base Fabric Image */}
            <img
              src={currentImg}
              alt={product.name}
              onError={() => setImgError(true)}
              className={`w-full h-full object-cover transition-transform duration-500 ${
                isHovered ? 'scale-105' : 'scale-100'
              }`}
              loading="lazy"
            />

            {/* Live Design Layer applied directly onto Fabric Surface */}
            {previewDesignUrl && (
              <div
                className="absolute inset-0 mix-blend-multiply opacity-90 pointer-events-none transition-opacity duration-300"
                style={{
                  backgroundImage: `url('${previewDesignUrl}')`,
                  backgroundSize: '35%',
                  backgroundRepeat: 'repeat'
                }}
              />
            )}
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 bg-[#EFEFEF] dark:bg-[#1F2124]">
            <ImageIcon className="w-12 h-12 stroke-[1.2] mb-1.5 opacity-40" />
            <span className="text-[11px] font-medium opacity-60">Textile Swatch</span>
          </div>
        )}

        {/* 📐 Authentic Mill Calibrated Ruler Overlay (Inches) Matching Reference Photo */}
        {showRuler && (
          <div className="absolute inset-0 pointer-events-none z-10 select-none">
            {/* Left Vertical Ruler (0 to 5 inches) */}
            <div className="absolute top-0 left-0 bottom-0 w-6 bg-[#C53047] flex flex-col justify-between py-1.5 pl-0.5 border-r border-white/60 text-white select-none shadow-md">
              {[5, 4, 3, 2, 1, 0].map((num) => (
                <div key={num} className="relative flex items-center justify-between w-full pr-0.5">
                  <span className="text-[9px] font-black font-mono leading-none drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)] text-white">
                    {num}
                  </span>
                  <div className="flex flex-col items-end space-y-[2px]">
                    <div className="w-2.5 h-[1.5px] bg-white shadow-sm" />
                    {num > 0 && (
                      <>
                        <div className="w-1.5 h-[1px] bg-white/70" />
                        <div className="w-2 h-[1px] bg-white/85" />
                        <div className="w-1.5 h-[1px] bg-white/70" />
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Horizontal Ruler (0 to 5 inches) */}
            <div className="absolute bottom-0 left-0 right-0 h-6 bg-[#C53047] flex items-end justify-between px-1 pb-0.5 border-t border-white/60 text-white select-none shadow-md">
              <span className="text-[8px] uppercase font-black tracking-wider text-white ml-5 leading-none mb-0.5 drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
                INCHES
              </span>
              {[0, 1, 2, 3, 4, 5].map((num) => (
                <div key={num} className="relative flex flex-col items-center">
                  <div className="flex items-end space-x-[2px] mb-0.5">
                    {num < 5 && (
                      <>
                        <div className="h-1.5 w-[1px] bg-white/70" />
                        <div className="h-2 w-[1px] bg-white/85" />
                        <div className="h-1.5 w-[1px] bg-white/70" />
                      </>
                    )}
                    <div className="h-2.5 w-[1.5px] bg-white shadow-sm" />
                  </div>
                  <span className="text-[9px] font-black font-mono leading-none drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)] text-white">
                    {num}
                  </span>
                </div>
              ))}
            </div>

            {/* Mill Verification Watermark Stamp */}
            <div className="absolute right-2 bottom-6 opacity-85 flex flex-col items-end pointer-events-none select-none">
              <div className="w-7 h-7 rounded border border-white flex flex-col items-center justify-center text-[7px] font-black text-white leading-none bg-[#C53047] shadow-sm">
                <span className="tracking-tighter font-extrabold">TIM</span>
                <span className="text-[4.5px] tracking-widest font-bold">MILL</span>
              </div>
            </div>
          </div>
        )}

        {/* Floating Controls & Quick View */}
        <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5 z-20">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowRuler(!showRuler);
            }}
            className={`px-1.5 py-1 rounded-md text-[10px] font-bold backdrop-blur-md transition shadow-sm ${
              showRuler
                ? 'bg-[#C53047] text-white'
                : 'bg-white/85 dark:bg-black/75 text-gray-700 dark:text-gray-200 hover:bg-white'
            }`}
            title="Toggle Ruler Scale overlay"
          >
            {showRuler ? '📐 5"' : '📏 Off'}
          </button>

          {onQuickView && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onQuickView(product);
              }}
              className="p-1.5 rounded-md bg-white/90 dark:bg-black/80 hover:bg-white text-gray-700 dark:text-gray-200 text-[10px] font-bold backdrop-blur-md shadow-sm transition"
              title="Quick View Specs"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
          )}

          {images.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setActiveImageIdx((prev) => (prev + 1) % images.length);
              }}
              className="p-1.5 rounded-md bg-white/85 dark:bg-black/75 hover:bg-white text-gray-700 dark:text-gray-200 text-[10px] font-bold backdrop-blur-md shadow-sm transition"
              title="Next view (Roll / Drape / Swatch)"
            >
              <Layers className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Fiber Badge Tag */}
        <div className="absolute top-2.5 left-7 z-20">
          <span className="bg-slate-900/80 dark:bg-black/80 text-white text-[9.5px] font-bold px-2 py-0.5 rounded-md backdrop-blur-sm shadow">
            {product.category}
          </span>
        </div>
      </div>

      {/* 3. Card Body: Title & Technical Specs Grid */}
      <div className="p-3.5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <h3
            onClick={() => onSelect(product)}
            className="font-bold text-[#111827] dark:text-white text-sm hover:text-[#996515] dark:hover:text-[#D4AF37] transition cursor-pointer line-clamp-1 leading-snug"
            title={product.name}
          >
            {product.name}
          </h3>

          {/* 📊 Technical Mill Specification Matrix */}
          <div className="mt-2.5 grid grid-cols-2 gap-x-2 gap-y-1 text-xs border-t border-b border-gray-100 dark:border-white/5 py-2">
            <div className="flex items-center justify-between pr-2 border-r border-gray-100 dark:border-white/5">
              <span className="text-gray-500 dark:text-gray-400 text-[11px]">Color</span>
              <span className="font-semibold text-gray-800 dark:text-gray-200 text-[11px] truncate max-w-[70px]" title={product.color}>
                {product.color.includes('White') ? product.color.replace('Natural Soft ', '').replace('Bleached Optic ', '') : product.color}
              </span>
            </div>

            <div className="flex items-center justify-between pl-1">
              <span className="text-gray-500 dark:text-gray-400 text-[11px]">Count</span>
              <span className="font-semibold text-gray-800 dark:text-gray-200 text-[11px] truncate max-w-[70px]" title={product.count}>
                {product.count ? product.count.replace(' Combed Yarn', '').replace(' Combed', '') : 'NAxNA'}
              </span>
            </div>

            <div className="flex items-center justify-between pr-2 border-r border-gray-100 dark:border-white/5">
              <span className="text-gray-500 dark:text-gray-400 text-[11px]">Cons</span>
              <span className="font-semibold text-gray-800 dark:text-gray-200 text-[11px] truncate max-w-[70px]">
                {product.cons || 'NA'}
              </span>
            </div>

            <div className="flex items-center justify-between pl-1">
              <span className="text-gray-500 dark:text-gray-400 text-[11px]">Width</span>
              <span className="font-semibold text-gray-800 dark:text-gray-200 text-[11px] truncate max-w-[70px]">
                {product.width.split(' ')[0]}
              </span>
            </div>

            <div className="flex items-center justify-between pr-2 border-r border-gray-100 dark:border-white/5">
              <span className="text-gray-500 dark:text-gray-400 text-[11px]">GSM</span>
              <span className="font-bold text-[#1E3A8A] dark:text-blue-400 text-[11px]">
                {product.gsm}
              </span>
            </div>

            <div className="flex items-center justify-between pl-1">
              <span className="text-gray-500 dark:text-gray-400 text-[11px]">Weave</span>
              <span className="font-semibold text-gray-800 dark:text-gray-200 text-[11px] truncate max-w-[70px]">
                {product.weave_type ? product.weave_type.replace(' Weave', '') : 'Plain'}
              </span>
            </div>
          </div>
        </div>

        {/* 4. Price & Action Bar */}
        <div className="pt-1 flex flex-col space-y-2">
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-base font-extrabold text-[#9B1B30] dark:text-[#EF4444] tracking-tight">
                ₹{product.price_per_meter.toFixed(2)}
              </span>
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">/m</span>
            </div>

            <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800/40">
              In Stock
            </span>
          </div>

          <div className="grid grid-cols-2 gap-1.5 pt-1">
            <button
              onClick={() => onSelect(product)}
              className="w-full py-2 bg-[#0F172A] hover:bg-[#1E293B] dark:bg-white dark:hover:bg-gray-100 text-white dark:text-slate-900 font-bold text-xs rounded-xl transition flex items-center justify-center space-x-1 shadow-sm"
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Customize</span>
            </button>

            <button
              onClick={() => onSelect(product)}
              className="w-full py-2 bg-[#F1F5F9] hover:bg-[#E2E8F0] dark:bg-[#26282B] dark:hover:bg-[#323539] text-[#1E293B] dark:text-gray-200 font-bold text-xs rounded-xl transition flex items-center justify-center space-x-1 border border-black/5 dark:border-white/5"
            >
              <span>Order Swatch</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

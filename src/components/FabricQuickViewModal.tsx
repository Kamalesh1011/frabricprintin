import React from 'react';
import {
  X,
  Star,
  ShieldCheck,
  Truck,
  ArrowRight,
  Scissors,
  CheckCircle2,
  Package,
  Layers,
  Scale
} from 'lucide-react';
import { Product } from '../types';

interface FabricQuickViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onCustomize: (product: Product) => void;
}

export const FabricQuickViewModal: React.FC<FabricQuickViewModalProps> = ({
  isOpen,
  onClose,
  product,
  onCustomize
}) => {
  if (!isOpen || !product) return null;

  const baseImage = product.images[0] || '/mockups/tcftbw650_swatch.jpg';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white dark:bg-[#15171A] text-gray-900 dark:text-white w-full max-w-3xl rounded-3xl shadow-2xl border border-gray-200 dark:border-white/10 overflow-hidden relative max-h-[90vh] overflow-y-auto">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-gray-400 hover:text-black dark:hover:text-white bg-white/80 dark:bg-black/60 rounded-full backdrop-blur-md transition shadow-sm"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 sm:p-8">
          
          {/* Left: Swatch Image */}
          <div className="md:col-span-5 space-y-3">
            <div className="aspect-square w-full rounded-2xl overflow-hidden bg-gray-100 dark:bg-black/30 border border-gray-200 dark:border-white/10 relative shadow-inner">
              <img
                src={baseImage}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 bg-[#0F1111]/80 text-white text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-xs">
                {product.gsm} GSM
              </div>
            </div>

            <div className="flex items-center space-x-2 text-[11px] text-gray-500">
              <span className="font-bold text-emerald-600 dark:text-emerald-400">✓ Certified Mill Quality</span>
              <span>•</span>
              <span>100% Tested Quality</span>
            </div>
          </div>

          {/* Right: Fabric Details & CTA */}
          <div className="md:col-span-7 space-y-4 flex flex-col justify-between">
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-blue-100 dark:bg-blue-950/60 text-[#1E3A8A] dark:text-blue-300 px-2 py-0.5 rounded">
                  {product.category}
                </span>
                <span className="text-[10px] font-mono text-gray-400 font-bold">
                  SKU: {product.sku || 'TIM-MILL'}
                </span>
              </div>

              <h3 className="text-xl font-extrabold text-gray-950 dark:text-white leading-tight">
                {product.name}
              </h3>

              <div className="flex items-center space-x-2 text-xs">
                <div className="flex items-center text-amber-500">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span className="font-bold text-gray-900 dark:text-white ml-1">
                    {product.rating || 4.9}
                  </span>
                </div>
                <span className="text-gray-300">|</span>
                <span className="text-gray-500">
                  {product.reviews_count || 120} verified reviews
                </span>
              </div>

              {/* Price */}
              <div className="pt-2 flex items-baseline space-x-2">
                <span className="text-2xl font-black text-[#9B1B30] dark:text-[#EF4444]">
                  ₹{product.price_per_meter.toFixed(2)}
                </span>
                <span className="text-xs text-gray-500 font-medium">/ meter</span>
                <span className="text-xs line-through text-gray-400 ml-1">
                  ₹{Math.round(product.price_per_meter * 1.25)}
                </span>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 px-1.5 py-0.5 rounded">
                  -20% M.R.P.
                </span>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs pt-2">
                <div className="p-2 bg-gray-50 dark:bg-[#191B1E] rounded-xl border border-gray-100 dark:border-white/5">
                  <span className="text-[10px] text-gray-400 block font-bold">COMPOSITION</span>
                  <span className="font-semibold text-gray-800 dark:text-gray-200 truncate block">
                    {product.composition || '100% Premium Fiber'}
                  </span>
                </div>
                <div className="p-2 bg-gray-50 dark:bg-[#191B1E] rounded-xl border border-gray-100 dark:border-white/5">
                  <span className="text-[10px] text-gray-400 block font-bold">WIDTH &amp; COUNT</span>
                  <span className="font-semibold text-gray-800 dark:text-gray-200 truncate block">
                    {product.width} • {product.count || 'Combed'}
                  </span>
                </div>
              </div>

              <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2 pt-1">
                {product.description}
              </p>
            </div>

            {/* CTAs */}
            <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-white/10">
              <button
                type="button"
                onClick={() => {
                  onCustomize(product);
                  onClose();
                }}
                className="w-full py-3 bg-[#FFD814] hover:bg-[#F7CA00] text-gray-950 font-black text-xs uppercase tracking-wider rounded-xl transition shadow-md flex items-center justify-center space-x-2 border border-[#FCD200]"
              >
                <span>Customize &amp; Order Print (₹{product.price_per_meter}/m)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  onCustomize(product);
                  onClose();
                }}
                className="w-full py-2 bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/15 font-bold text-xs rounded-xl transition"
              >
                Order Sample Swatch (₹{product.swatch_test_price || 150})
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

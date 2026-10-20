import React, { useState } from 'react';
import {
  X,
  Plus,
  Trash2,
  Check,
  Sparkles,
  ArrowRight,
  Sliders,
  Scale,
  Shirt,
  Scissors
} from 'lucide-react';
import { Product } from '../types';
import { INITIAL_PRODUCTS } from '../data/mockData';

interface FabricComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  baseProduct: Product;
  allProducts?: Product[];
  onSelectProductForCustomization: (product: Product) => void;
}

export const FabricComparisonModal: React.FC<FabricComparisonModalProps> = ({
  isOpen,
  onClose,
  baseProduct,
  allProducts,
  onSelectProductForCustomization
}) => {
  const fabricList = (allProducts && allProducts.length > 0 ? allProducts : INITIAL_PRODUCTS).filter(
    (p) => !p.category?.toLowerCase().includes('t-shirt') && !p.category?.toLowerCase().includes('apparel')
  );

  // Maintain list of 2 to 4 compared products, starting with baseProduct and 2 popular alternatives
  const [comparedProductIds, setComparedProductIds] = useState<string[]>(() => {
    const defaultIds = [baseProduct.id];
    const otherFabrics = fabricList.filter((f) => f.id !== baseProduct.id);
    if (otherFabrics[0]) defaultIds.push(otherFabrics[0].id);
    if (otherFabrics[1]) defaultIds.push(otherFabrics[1].id);
    return defaultIds;
  });

  const [isAddingSlot, setIsAddingSlot] = useState(false);

  if (!isOpen) return null;

  const comparedProducts = comparedProductIds
    .map((id) => fabricList.find((f) => f.id === id))
    .filter(Boolean) as Product[];

  const handleAddProduct = (product: Product) => {
    if (!comparedProductIds.includes(product.id) && comparedProductIds.length < 4) {
      setComparedProductIds([...comparedProductIds, product.id]);
    }
    setIsAddingSlot(false);
  };

  const handleRemoveProduct = (productId: string) => {
    if (comparedProductIds.length > 1) {
      setComparedProductIds(comparedProductIds.filter((id) => id !== productId));
    }
  };

  const availableToAdd = fabricList.filter((f) => !comparedProductIds.includes(f.id));

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white dark:bg-[#15171A] text-[#0F100F] dark:text-white w-full max-w-6xl rounded-3xl shadow-2xl border border-gray-200 dark:border-white/10 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 bg-gray-50 dark:bg-[#111214] border-b border-gray-200 dark:border-white/10 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-[#2D325A] text-white flex items-center justify-center">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight uppercase font-editorial flex items-center space-x-2">
                <span>Fabric Quality Comparator</span>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20 font-sans font-bold">
                  Mill Quality Specs
                </span>
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Compare GSM, yarn count, weave density, stretch &amp; garment applications side-by-side
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {comparedProductIds.length < 4 && (
              <button
                type="button"
                onClick={() => setIsAddingSlot(true)}
                className="px-3 py-1.5 bg-[#2D325A] text-white text-xs font-bold rounded-xl hover:bg-[#202442] transition flex items-center space-x-1.5 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Fabric to Compare</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-black dark:hover:text-white rounded-full transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body - Scrollable Comparison Grid */}
        <div className="flex-1 overflow-auto p-4 sm:p-6 space-y-6">
          
          {/* Add Slot Quick Drawer / Selector */}
          {isAddingSlot && (
            <div className="p-4 bg-blue-50/70 dark:bg-blue-950/30 rounded-2xl border border-blue-200 dark:border-blue-900/50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-900 dark:text-blue-300">
                  Select a fabric to add to comparison (Max 4):
                </span>
                <button
                  type="button"
                  onClick={() => setIsAddingSlot(false)}
                  className="text-xs text-gray-500 hover:underline"
                >
                  Cancel
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {availableToAdd.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => handleAddProduct(f)}
                    className="p-2 bg-white dark:bg-[#1E2023] rounded-xl border border-gray-200 dark:border-white/10 hover:border-blue-500 text-left transition flex items-center space-x-2 group"
                  >
                    <img
                      src={f.images[0] || '/mockups/tcftbw650_swatch.jpg'}
                      alt={f.name}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                    <div className="truncate">
                      <span className="text-xs font-bold block truncate group-hover:text-blue-600 dark:group-hover:text-blue-400">
                        {f.name}
                      </span>
                      <span className="text-[10px] text-gray-500 block">
                        {f.gsm} GSM • ₹{f.price_per_meter}/m
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Comparison Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr>
                  <th className="p-3 w-44 bg-gray-100 dark:bg-[#1A1C1E] font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider text-[11px] rounded-tl-2xl">
                    Fabric Attribute
                  </th>
                  {comparedProducts.map((p) => {
                    const isBase = p.id === baseProduct.id;
                    return (
                      <th
                        key={p.id}
                        className={`p-3 min-w-[220px] text-left align-top transition ${
                          isBase
                            ? 'bg-blue-50/50 dark:bg-blue-950/20 border-t-2 border-blue-600'
                            : 'bg-gray-50 dark:bg-[#141517]'
                        }`}
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            {isBase ? (
                              <span className="text-[9.5px] font-black uppercase tracking-wider bg-blue-600 text-white px-2 py-0.5 rounded-full">
                                Currently Viewing
                              </span>
                            ) : (
                              <span className="text-[9.5px] font-bold uppercase tracking-wider text-gray-400">
                                Comparison Target
                              </span>
                            )}
                            {comparedProducts.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveProduct(p.id)}
                                className="text-gray-400 hover:text-red-600 p-1 transition"
                                title="Remove from comparison"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>

                          <div className="aspect-square w-full rounded-xl overflow-hidden bg-gray-200 relative border border-gray-200 dark:border-white/10">
                            <img
                              src={p.images[0] || '/mockups/tcftbw650_swatch.jpg'}
                              alt={p.name}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute bottom-2 left-2 bg-black/75 text-white text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-xs">
                              {p.gsm} GSM
                            </div>
                          </div>

                          <div>
                            <h4 className="font-extrabold text-sm text-gray-900 dark:text-white leading-tight">
                              {p.name}
                            </h4>
                            <span className="text-[11px] text-gray-500 dark:text-gray-400 block mt-0.5">
                              SKU: {p.sku || 'TIM-MILL'}
                            </span>
                          </div>

                          <div className="pt-1 flex items-baseline space-x-1.5">
                            <span className="text-base font-black text-[#9B1B30] dark:text-[#EF4444]">
                              ₹{p.price_per_meter.toFixed(2)}
                            </span>
                            <span className="text-[10px] text-gray-500 font-medium">/ meter</span>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              onSelectProductForCustomization(p);
                              onClose();
                            }}
                            className={`w-full py-2 px-3 rounded-xl font-bold text-xs uppercase tracking-wider transition flex items-center justify-center space-x-1 ${
                              isBase
                                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                : 'bg-[#FFD814] hover:bg-[#F7CA00] text-gray-950 shadow-xs'
                            }`}
                          >
                            <span>{isBase ? '✓ Active Fabric' : 'Select This Fabric'}</span>
                            {!isBase && <ArrowRight className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200 dark:divide-white/5 font-sans">
                {/* 1. Category */}
                <tr className="hover:bg-gray-50/50 dark:hover:bg-white/[0.02]">
                  <td className="p-3 font-bold text-gray-600 dark:text-gray-400 bg-gray-50/80 dark:bg-[#1A1C1E]/60">
                    Category / Family
                  </td>
                  {comparedProducts.map((p) => (
                    <td key={p.id} className="p-3 font-semibold text-gray-900 dark:text-white">
                      {p.category}
                    </td>
                  ))}
                </tr>

                {/* 2. Fiber Composition */}
                <tr className="hover:bg-gray-50/50 dark:hover:bg-white/[0.02]">
                  <td className="p-3 font-bold text-gray-600 dark:text-gray-400 bg-gray-50/80 dark:bg-[#1A1C1E]/60">
                    Fiber Composition
                  </td>
                  {comparedProducts.map((p) => (
                    <td key={p.id} className="p-3 font-semibold text-gray-900 dark:text-white">
                      {p.composition || '100% Premium Natural Fiber'}
                    </td>
                  ))}
                </tr>

                {/* 3. Yarn Count / Construction */}
                <tr className="hover:bg-gray-50/50 dark:hover:bg-white/[0.02]">
                  <td className="p-3 font-bold text-gray-600 dark:text-gray-400 bg-gray-50/80 dark:bg-[#1A1C1E]/60">
                    Yarn Count &amp; Structure
                  </td>
                  {comparedProducts.map((p) => (
                    <td key={p.id} className="p-3 text-gray-700 dark:text-gray-300">
                      {p.count || (p.gsm > 300 ? '20s Loopback Heavyweight' : p.gsm > 200 ? '24s Combed Compact' : '60s x 60s High Density')}
                    </td>
                  ))}
                </tr>

                {/* 4. Weave / Knit Structure */}
                <tr className="hover:bg-gray-50/50 dark:hover:bg-white/[0.02]">
                  <td className="p-3 font-bold text-gray-600 dark:text-gray-400 bg-gray-50/80 dark:bg-[#1A1C1E]/60">
                    Weave / Knit Architecture
                  </td>
                  {comparedProducts.map((p) => (
                    <td key={p.id} className="p-3 text-gray-700 dark:text-gray-300">
                      {p.weave_type || (p.category.toLowerCase().includes('jersey') ? 'Single Jersey Knit' : p.category.toLowerCase().includes('terry') ? 'Loop French Terry Knit' : 'Plain Weave')}
                    </td>
                  ))}
                </tr>

                {/* 5. Usable Width */}
                <tr className="hover:bg-gray-50/50 dark:hover:bg-white/[0.02]">
                  <td className="p-3 font-bold text-gray-600 dark:text-gray-400 bg-gray-50/80 dark:bg-[#1A1C1E]/60">
                    Usable Mill Width
                  </td>
                  {comparedProducts.map((p) => (
                    <td key={p.id} className="p-3 font-bold text-gray-900 dark:text-white">
                      {p.width || '44 Inches (112 cm)'}
                    </td>
                  ))}
                </tr>

                {/* 6. Elasticity / Stretch */}
                <tr className="hover:bg-gray-50/50 dark:hover:bg-white/[0.02]">
                  <td className="p-3 font-bold text-gray-600 dark:text-gray-400 bg-gray-50/80 dark:bg-[#1A1C1E]/60">
                    Stretch &amp; Elasticity
                  </td>
                  {comparedProducts.map((p) => {
                    const isStretch = p.category.toLowerCase().includes('spandex') || p.category.toLowerCase().includes('lycra');
                    const isKnit = p.category.toLowerCase().includes('jersey') || p.category.toLowerCase().includes('terry');
                    return (
                      <td key={p.id} className="p-3">
                        {isStretch ? (
                          <span className="font-bold text-emerald-600 dark:text-emerald-400">
                            ⚡ 4-Way Active Stretch (5-8% Lycra)
                          </span>
                        ) : isKnit ? (
                          <span className="font-semibold text-blue-600 dark:text-blue-400">
                            🌀 Natural 2-Way Knit Mechanical Give
                          </span>
                        ) : (
                          <span className="text-gray-500 dark:text-gray-400">
                            🔒 0% Stretch (Stable Woven Structure)
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>

                {/* 7. Best Garment End Use */}
                <tr className="hover:bg-gray-50/50 dark:hover:bg-white/[0.02]">
                  <td className="p-3 font-bold text-gray-600 dark:text-gray-400 bg-gray-50/80 dark:bg-[#1A1C1E]/60">
                    Recommended Garments
                  </td>
                  {comparedProducts.map((p) => (
                    <td key={p.id} className="p-3 text-gray-700 dark:text-gray-300">
                      {(p as any).best_for || (p.applications && p.applications.join(', ')) || (p.gsm >= 400 ? 'Hoodies, Sweatshirts, Streetwear Joggers' : p.gsm >= 200 ? 'T-Shirts, Polo Shirts, Casual Dresses' : 'Flowing Kurtis, Sarees, Summer Shirts')}
                    </td>
                  ))}
                </tr>

                {/* 8. Print Compatibility */}
                <tr className="hover:bg-gray-50/50 dark:hover:bg-white/[0.02]">
                  <td className="p-3 font-bold text-gray-600 dark:text-gray-400 bg-gray-50/80 dark:bg-[#1A1C1E]/60">
                    Digital Print Process
                  </td>
                  {comparedProducts.map((p) => (
                    <td key={p.id} className="p-3">
                      <span className="font-bold text-emerald-700 dark:text-emerald-300 flex items-center space-x-1">
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span>300 DPI Direct Reactive Dye</span>
                      </span>
                    </td>
                  ))}
                </tr>

                {/* 9. Sample Swatch Price */}
                <tr className="hover:bg-gray-50/50 dark:hover:bg-white/[0.02]">
                  <td className="p-3 font-bold text-gray-600 dark:text-gray-400 bg-gray-50/80 dark:bg-[#1A1C1E]/60">
                    Sample Swatch Cost
                  </td>
                  {comparedProducts.map((p) => (
                    <td key={p.id} className="p-3 font-bold text-gray-900 dark:text-white">
                      ₹{p.swatch_test_price || 150}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 dark:bg-[#111214] border-t border-gray-200 dark:border-white/10 flex items-center justify-between text-xs text-gray-500">
          <span>💡 Need a customized GSM or proprietary weave count? WhatsApp our textile engineers.</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 dark:bg-white/10 text-gray-800 dark:text-white font-bold rounded-xl hover:bg-gray-300 transition"
          >
            Close Comparator
          </button>
        </div>

      </div>
    </div>
  );
};

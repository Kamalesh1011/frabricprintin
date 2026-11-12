import React, { useState } from 'react';
import {
  DollarSign,
  Percent,
  Sliders,
  Check,
  RotateCcw,
  Sparkles,
  TrendingUp,
  Tag,
  ArrowUpRight,
  ArrowDownRight,
  Save,
  HelpCircle,
  FileDown,
  Layers,
  Printer
} from 'lucide-react';
import { Product } from '../../types';

export interface WholesaleTierConfig {
  id: string;
  minQty: number;
  maxQty: number | null;
  discountPercent: number;
  label: string;
  badge: string;
}

export interface PrintSurchargeRates {
  dtf: number;
  dtg: number;
  sublimation: number;
  screenSingle: number;
  screenMulti: number;
  embroidery: number;
  puff: number;
  foil: number;
}

export interface PlacementSurcharges {
  chestCenter: number;
  fullFrontA4: number;
  oversizedA3: number;
  upperBack: number;
  fullBackA3: number;
  sleeves: number;
}

interface PricingManagerTabProps {
  products: Product[];
  onUpdateProductPrice: (productId: string, newBasePrice: number, newPrintSurcharge: number) => Promise<void>;
  onBatchAdjustPrices: (percent: number, categoryFilter?: string) => Promise<void>;
}

const LOCAL_STORAGE_PRICING_KEY = 'fabricprint_admin_pricing_config_v2';

const DEFAULT_TIERS: WholesaleTierConfig[] = [
  { id: 'tier-1', minQty: 1, maxQty: 9, discountPercent: 0, label: 'Single / Retail Sample', badge: 'Standard MOQ' },
  { id: 'tier-2', minQty: 10, maxQty: 49, discountPercent: 15, label: 'Small Batch Wholesale', badge: '15% OFF' },
  { id: 'tier-3', minQty: 50, maxQty: 199, discountPercent: 25, label: 'Corporate & Team Bulk', badge: '25% OFF' },
  { id: 'tier-4', minQty: 200, maxQty: null, discountPercent: 35, label: 'Mill Direct Wholesale Hub', badge: '35% OFF (MAX)' }
];

const DEFAULT_PRINT_RATES: PrintSurchargeRates = {
  dtf: 50,
  dtg: 90,
  sublimation: 40,
  screenSingle: 25,
  screenMulti: 45,
  embroidery: 75,
  puff: 65,
  foil: 60
};

const DEFAULT_PLACEMENTS: PlacementSurcharges = {
  chestCenter: 0,
  fullFrontA4: 30,
  oversizedA3: 60,
  upperBack: 25,
  fullBackA3: 50,
  sleeves: 20
};

export const PricingManagerTab: React.FC<PricingManagerTabProps> = ({
  products,
  onUpdateProductPrice,
  onBatchAdjustPrices
}) => {
  // Tiered Pricing State
  const [tiers, setTiers] = useState<WholesaleTierConfig[]>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_PRICING_KEY}_tiers`);
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_TIERS;
  });

  // Print Surcharges State
  const [printRates, setPrintRates] = useState<PrintSurchargeRates>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_PRICING_KEY}_rates`);
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_PRINT_RATES;
  });

  // Placement Surcharges State
  const [placements, setPlacements] = useState<PlacementSurcharges>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_PRICING_KEY}_placements`);
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_PLACEMENTS;
  });

  const [saveSuccessAlert, setSaveSuccessAlert] = useState<string | null>(null);

  // Global Multiplier Tool State
  const [batchPercent, setBatchPercent] = useState<number>(5);
  const [batchCategory, setBatchCategory] = useState<string>('All');
  const [isApplyingBatch, setIsApplyingBatch] = useState(false);

  // Interactive Live Simulator State
  const [simBasePrice, setSimBasePrice] = useState<number>(299);
  const [simQuantity, setSimQuantity] = useState<number>(50);
  const [simMethod, setSimMethod] = useState<keyof PrintSurchargeRates>('dtf');
  const [simPlacement, setSimPlacement] = useState<keyof PlacementSurcharges>('chestCenter');

  const triggerAlert = (msg: string) => {
    setSaveSuccessAlert(msg);
    setTimeout(() => setSaveSuccessAlert(null), 3000);
  };

  const handleSaveTiers = () => {
    localStorage.setItem(`${LOCAL_STORAGE_PRICING_KEY}_tiers`, JSON.stringify(tiers));
    triggerAlert('Wholesale volume discount tiers updated and deployed successfully!');
  };

  const handleSavePrintRates = () => {
    localStorage.setItem(`${LOCAL_STORAGE_PRICING_KEY}_rates`, JSON.stringify(printRates));
    triggerAlert('Print technique rate cards updated successfully!');
  };

  const handleSavePlacements = () => {
    localStorage.setItem(`${LOCAL_STORAGE_PRICING_KEY}_placements`, JSON.stringify(placements));
    triggerAlert('Print placement surcharges updated successfully!');
  };

  const handleApplyBatchAdjustment = async (sign: 1 | -1) => {
    const finalPct = sign * Math.abs(batchPercent);
    const targetText = batchCategory === 'All' ? 'all catalog products' : `${batchCategory} products`;
    if (!confirm(`Are you sure you want to adjust base prices of ${targetText} by ${finalPct > 0 ? '+' : ''}${finalPct}%?`)) {
      return;
    }
    setIsApplyingBatch(true);
    try {
      await onBatchAdjustPrices(finalPct, batchCategory === 'All' ? undefined : batchCategory);
      triggerAlert(`Successfully applied ${finalPct > 0 ? '+' : ''}${finalPct}% adjustment to ${targetText}!`);
    } finally {
      setIsApplyingBatch(false);
    }
  };

  // Compute Simulator Numbers
  const simTier = tiers.find((t) => {
    if (t.maxQty === null) return simQuantity >= t.minQty;
    return simQuantity >= t.minQty && simQuantity <= t.maxQty;
  }) || tiers[0];

  const simPrintCost = printRates[simMethod] || 50;
  const simPlacementCost = placements[simPlacement] || 0;
  const simRawPerUnit = simBasePrice + simPrintCost + simPlacementCost;
  const simDiscountPerUnit = Math.round(simRawPerUnit * (simTier.discountPercent / 100));
  const simFinalPerUnit = simRawPerUnit - simDiscountPerUnit;
  const simSubtotal = simFinalPerUnit * simQuantity;
  const simGst = Math.round(simSubtotal * 0.05);
  const simGrandTotal = simSubtotal + simGst;
  const simTotalSavings = simDiscountPerUnit * simQuantity;

  return (
    <div className="space-y-8">
      
      {/* Alert Banner */}
      {saveSuccessAlert && (
        <div className="bg-emerald-900/90 text-emerald-200 border border-emerald-700 p-4 rounded-2xl text-xs font-bold flex items-center justify-between shadow-lg animate-in fade-in duration-200">
          <span>✓ {saveSuccessAlert}</span>
          <button onClick={() => setSaveSuccessAlert(null)}>✕</button>
        </div>
      )}

      {/* Main Header Banner */}
      <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2.5 font-serif">
            <DollarSign className="w-6 h-6 text-amber-400" />
            <span>Master Wholesale Pricing Engine & Rate Cards</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Design wholesale discount brackets, configure DTF/DTG/Sublimation printing costs, and simulate client quotation margins in real-time.
          </p>
        </div>
      </div>

      {/* SECTION 1: WHOLESALE VOLUME DISCOUNT LADDER */}
      <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-700 pb-3">
          <div className="flex items-center space-x-2">
            <Percent className="w-5 h-5 text-amber-400" />
            <h3 className="font-extrabold text-white text-base font-serif">
              Wholesale Volume Discount Brackets (1–200+ Pcs)
            </h3>
          </div>
          <button
            onClick={handleSaveTiers}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-4 py-2 rounded-xl transition flex items-center space-x-1.5 shadow"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Volume Tiers</span>
          </button>
        </div>

        <p className="text-xs text-slate-400">
          These percentage discounts are automatically calculated in the Customizer Studio matrix, cart, and printable wholesale quotations.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {tiers.map((tier, idx) => (
            <div
              key={tier.id}
              className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3 relative hover:border-amber-500/40 transition"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  TIER {idx + 1}
                </span>
                <span className="text-xs font-black text-emerald-400 font-mono">
                  {tier.discountPercent}% OFF
                </span>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase">Tier Label</label>
                <input
                  type="text"
                  value={tier.label}
                  onChange={(e) => {
                    const val = e.target.value;
                    setTiers((prev) => prev.map((t) => (t.id === tier.id ? { ...t, label: val } : t)));
                  }}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white font-bold mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400">Min Units</label>
                  <input
                    type="number"
                    value={tier.minQty}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setTiers((prev) => prev.map((t) => (t.id === tier.id ? { ...t, minQty: val } : t)));
                    }}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white font-mono font-bold mt-1"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400">Max Units</label>
                  <input
                    type="text"
                    value={tier.maxQty === null ? '∞ (Unlimited)' : tier.maxQty}
                    disabled={tier.maxQty === null}
                    onChange={(e) => {
                      const val = e.target.value === '' ? null : Number(e.target.value);
                      setTiers((prev) => prev.map((t) => (t.id === tier.id ? { ...t, maxQty: val } : t)));
                    }}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white font-mono font-bold mt-1 disabled:opacity-50"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Discount Rate</label>
                  <span className="font-mono font-black text-amber-400 text-xs">{tier.discountPercent}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="60"
                  step="1"
                  value={tier.discountPercent}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setTiers((prev) => prev.map((t) => (t.id === tier.id ? { ...t, discountPercent: val } : t)));
                  }}
                  className="w-full accent-amber-500 cursor-pointer mt-1"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: PRINTING PROCESSES & PLACEMENT SURCHARGES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Sub-Card A: Print Process Surcharges */}
        <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-700 pb-3">
            <div className="flex items-center space-x-2">
              <Printer className="w-5 h-5 text-amber-400" />
              <h3 className="font-bold text-white text-base font-serif">Print Technique Unit Rates</h3>
            </div>
            <button
              onClick={handleSavePrintRates}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-3 py-1.5 rounded-xl transition shadow"
            >
              Save Rates
            </button>
          </div>

          <div className="space-y-3 text-xs">
            {[
              { key: 'dtf' as const, label: 'Direct-to-Film (DTF Premium Transfer)', desc: 'Full-color photorealistic print on any fabric' },
              { key: 'dtg' as const, label: 'Direct-to-Garment (DTG Water-Based)', desc: 'Ultra-soft handfeel for 100% combed cotton' },
              { key: 'sublimation' as const, label: 'Dye Sublimation (Sports Interlock)', desc: 'Permanent gas-infusion for polyester kits' },
              { key: 'screenSingle' as const, label: 'Screen Print (1-Color Plastisol)', desc: 'High-speed long-run bulk ink transfer' },
              { key: 'screenMulti' as const, label: 'Screen Print (Multi-Color Stencil)', desc: 'Up to 4-color precision aligned halftone' },
              { key: 'embroidery' as const, label: 'High-Density Tajima Embroidery', desc: 'Precision metallic or satin stitch needlework' },
              { key: 'puff' as const, label: '3D Puff Raised Silicone Print', desc: 'Textured volumetric relief effect' }
            ].map((p) => (
              <div key={p.key} className="flex items-center justify-between bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <div>
                  <span className="font-bold text-white block">{p.label}</span>
                  <span className="text-[10px] text-slate-400">{p.desc}</span>
                </div>
                <div className="flex items-center space-x-1 shrink-0 ml-3">
                  <span className="text-slate-400 font-bold">₹</span>
                  <input
                    type="number"
                    value={printRates[p.key]}
                    onChange={(e) => setPrintRates({ ...printRates, [p.key]: Number(e.target.value) })}
                    className="w-16 bg-slate-900 border border-slate-700 rounded-lg p-1 text-center font-mono font-bold text-amber-400 text-xs"
                  />
                  <span className="text-[10px] text-slate-500">/pc</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sub-Card B: Placement Surcharges */}
        <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-700 pb-3">
            <div className="flex items-center space-x-2">
              <Layers className="w-5 h-5 text-amber-400" />
              <h3 className="font-bold text-white text-base font-serif">Print Placement Surcharges</h3>
            </div>
            <button
              onClick={handleSavePlacements}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-3 py-1.5 rounded-xl transition shadow"
            >
              Save Fees
            </button>
          </div>

          <div className="space-y-3 text-xs">
            {[
              { key: 'chestCenter' as const, label: 'Chest Center / Left Pocket Crest', desc: 'Standard front branding area (Up to 4" x 4")' },
              { key: 'fullFrontA4' as const, label: 'Full Front A4 (10" x 12")', desc: 'Standard mid-torso graphic coverage' },
              { key: 'oversizedA3' as const, label: 'Oversized Front A3 (14" x 18")', desc: 'Maximum edge-to-edge streetwear artwork' },
              { key: 'upperBack' as const, label: 'Upper Back / Collar Nape Tag', desc: 'Secondary logo or tournament badge' },
              { key: 'fullBackA3' as const, label: 'Full Back A3 + Squad Name/Number', desc: 'Complete back coverage for athletic jerseys' },
              { key: 'sleeves' as const, label: 'Left or Right Sleeve Crest', desc: 'Tournament sponsor or brand sleeve patch' }
            ].map((pl) => (
              <div key={pl.key} className="flex items-center justify-between bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <div>
                  <span className="font-bold text-white block">{pl.label}</span>
                  <span className="text-[10px] text-slate-400">{pl.desc}</span>
                </div>
                <div className="flex items-center space-x-1 shrink-0 ml-3">
                  <span className="text-slate-400 font-bold">+₹</span>
                  <input
                    type="number"
                    value={placements[pl.key]}
                    onChange={(e) => setPlacements({ ...placements, [pl.key]: Number(e.target.value) })}
                    className="w-16 bg-slate-900 border border-slate-700 rounded-lg p-1 text-center font-mono font-bold text-emerald-400 text-xs"
                  />
                  <span className="text-[10px] text-slate-500">/pc</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* SECTION 3: GLOBAL CATALOG BULK PRICE MULTIPLIER TOOL */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 p-6 rounded-3xl border border-slate-700 space-y-4">
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-amber-400" />
          <h3 className="font-extrabold text-white text-base font-serif">
            Global Bulk Catalog Price Multiplier
          </h3>
        </div>
        <p className="text-xs text-slate-400">
          Quickly adjust all product base prices across your textile mill catalog to reflect raw cotton yarn index shifts or wholesale promotions.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs">
          <div>
            <label className="block text-slate-400 font-bold mb-1">Target Category</label>
            <select
              value={batchCategory}
              onChange={(e) => setBatchCategory(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-white font-bold"
            >
              <option value="All">All Products & Fabrics</option>
              <option value="Cotton">Cotton Only</option>
              <option value="Linen">Linen Only</option>
              <option value="Silk">Silk Only</option>
              <option value="Viscose">Viscose Only</option>
              <option value="Modal">Modal Only</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-400 font-bold mb-1">Percentage Change</label>
            <div className="flex items-center space-x-1">
              <input
                type="number"
                min="1"
                max="50"
                value={batchPercent}
                onChange={(e) => setBatchPercent(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-white font-mono font-bold"
              />
              <span className="text-slate-400 font-bold text-sm">%</span>
            </div>
          </div>

          <div className="sm:col-span-2 flex items-end space-x-2">
            <button
              onClick={() => handleApplyBatchAdjustment(1)}
              disabled={isApplyingBatch}
              className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-3 rounded-xl transition flex items-center justify-center space-x-1 shadow-md disabled:opacity-40"
            >
              <ArrowUpRight className="w-4 h-4" />
              <span>Increase Prices (+{batchPercent}%)</span>
            </button>

            <button
              onClick={() => handleApplyBatchAdjustment(-1)}
              disabled={isApplyingBatch}
              className="flex-1 bg-rose-700 hover:bg-rose-600 text-white font-bold py-2.5 px-3 rounded-xl transition flex items-center justify-center space-x-1 shadow-md disabled:opacity-40"
            >
              <ArrowDownRight className="w-4 h-4" />
              <span>Discount Prices (-{batchPercent}%)</span>
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 4: REAL-TIME QUOTATION & MARGIN SIMULATOR */}
      <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700 space-y-4">
        <div className="flex items-center space-x-2 border-b border-slate-700 pb-3">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <h3 className="font-extrabold text-white text-base font-serif">
            Live Quotation & Mill Margin Simulator
          </h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
          {/* Simulator Inputs */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
            <span className="font-bold text-amber-400 block uppercase text-[11px]">
              Configure Mock Order Parameters
            </span>

            <div>
              <label className="block text-slate-400 font-bold mb-1">Base Garment / Fabric Rate (₹)</label>
              <input
                type="number"
                value={simBasePrice}
                onChange={(e) => setSimBasePrice(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 font-mono font-bold text-white text-sm"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-bold mb-1">
                Order Quantity ({simQuantity} units · Applied: {simTier.label})
              </label>
              <input
                type="range"
                min="1"
                max="500"
                step="5"
                value={simQuantity}
                onChange={(e) => setSimQuantity(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 font-bold mb-1">Print Process</label>
                <select
                  value={simMethod}
                  onChange={(e) => setSimMethod(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-white font-bold"
                >
                  <option value="dtf">DTF Print (₹{printRates.dtf})</option>
                  <option value="dtg">DTG Soft (₹{printRates.dtg})</option>
                  <option value="sublimation">Sublimation (₹{printRates.sublimation})</option>
                  <option value="screenSingle">Screen 1-Color (₹{printRates.screenSingle})</option>
                  <option value="embroidery">Embroidery (₹{printRates.embroidery})</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Placement Area</label>
                <select
                  value={simPlacement}
                  onChange={(e) => setSimPlacement(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-white font-bold"
                >
                  <option value="chestCenter">Chest Center (+₹{placements.chestCenter})</option>
                  <option value="fullFrontA4">Full Front A4 (+₹{placements.fullFrontA4})</option>
                  <option value="oversizedA3">Oversized A3 (+₹{placements.oversizedA3})</option>
                  <option value="fullBackA3">Full Back A3 (+₹{placements.fullBackA3})</option>
                </select>
              </div>
            </div>
          </div>

          {/* Simulator Real-Time Computation Sheet */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-amber-500/30 flex flex-col justify-between space-y-4">
            <div>
              <span className="font-bold text-amber-400 block uppercase text-[11px]">
                Computed Wholesale Client Quotation
              </span>

              <div className="mt-3 space-y-2 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Raw Unit Price (Base + Print + Placement):</span>
                  <span className="font-mono text-white">₹{simRawPerUnit} / pc</span>
                </div>

                <div className="flex justify-between text-emerald-400 font-bold">
                  <span>Volume Tier Discount ({simTier.discountPercent}% OFF):</span>
                  <span className="font-mono">-₹{simDiscountPerUnit} / pc</span>
                </div>

                <div className="flex justify-between text-white font-bold border-t border-slate-800 pt-1.5">
                  <span>Final Net Unit Price:</span>
                  <span className="font-mono text-amber-400 text-sm">₹{simFinalPerUnit} / pc</span>
                </div>

                <div className="flex justify-between text-slate-400">
                  <span>Subtotal ({simQuantity} pcs):</span>
                  <span className="font-mono text-white">₹{simSubtotal.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex justify-between text-slate-400">
                  <span>GST Applicable (5% Textile Mill):</span>
                  <span className="font-mono text-white">₹{simGst.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">
                  Grand Estimated Client Invoice
                </span>
                <span className="text-xl font-black text-white font-serif">
                  ₹{simGrandTotal.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-emerald-400 font-bold block">
                  Client Saves: ₹{simTotalSavings.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  (₹{(simGrandTotal / simQuantity).toFixed(1)}/pc incl. tax)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

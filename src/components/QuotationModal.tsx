import React from 'react';
import { X, Printer, Download, CheckCircle2, Building2, Phone, Mail, FileText, Calendar, ShieldCheck } from 'lucide-react';
import { BUSINESS_INFO } from '../config/businessInfo';

export interface QuotationBreakdownItem {
  size: string;
  quantity: number;
  unitPrice: number;
}

export interface QuotationModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  fabricGsm: string;
  colorName: string;
  methodName: string;
  placement: string;
  artworkUrl?: string | null;
  customText?: string;
  breakdown: QuotationBreakdownItem[];
  tierDiscountPercent: number;
  tierName: string;
}

export const QuotationModal: React.FC<QuotationModalProps> = ({
  isOpen,
  onClose,
  productName,
  fabricGsm,
  colorName,
  methodName,
  placement,
  artworkUrl,
  customText,
  breakdown,
  tierDiscountPercent,
  tierName,
}) => {
  if (!isOpen) return null;

  const quoteNumber = `FP-QT-${Date.now().toString().slice(-6)}`;
  const dateStr = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  const validUntilStr = new Date(Date.now() + 14 * 86400000).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const totalQuantity = breakdown.reduce((sum, item) => sum + item.quantity, 0);
  const rawSubtotal = breakdown.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const discountAmount = Math.round(rawSubtotal * (tierDiscountPercent / 100));
  const discountedSubtotal = rawSubtotal - discountAmount;
  const gstAmount = Math.round(discountedSubtotal * 0.05); // 5% apparel GST
  const grandTotal = discountedSubtotal + gstAmount;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      className="fixed inset-0 z-[9999] overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl bg-white text-[#0F100F] rounded-3xl shadow-2xl border border-black/15 overflow-hidden animate-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar (Hidden in Print) */}
        <div className="print:hidden flex items-center justify-between px-6 py-4 bg-[#151715] text-white border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-400" />
            <span className="font-black text-sm tracking-wide">Official Wholesale Mill Quotation</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Quotation Sheet Body */}
        <div className="p-6 sm:p-8 overflow-y-auto print:p-0 print:overflow-visible text-left space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b pb-6 border-black/10">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-[#0F100F] text-amber-400 flex items-center justify-center font-black text-lg">
                  FP
                </div>
                <div>
                  <h1 className="text-xl font-black tracking-tight leading-none">
                    FABRIC <span className="text-[#AC7900]">PRINT</span>
                  </h1>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-0.5">
                    Direct Mill & Custom Digital Apparel Lab
                  </p>
                </div>
              </div>
              <p className="text-xs text-gray-600 mt-3 leading-relaxed max-w-sm">
                Tirupur Textile Corridor, Tamil Nadu, India<br />
                WhatsApp / Support: {BUSINESS_INFO.phone} • {BUSINESS_INFO.email}
              </p>
            </div>

            <div className="sm:text-right space-y-1 bg-amber-50/70 p-3.5 rounded-2xl border border-amber-200/60 print:bg-transparent print:border-none">
              <div className="text-xs font-black text-amber-900 uppercase tracking-wider">Quotation Ref</div>
              <div className="text-base font-black font-mono text-gray-900">{quoteNumber}</div>
              <div className="text-[11px] text-gray-600">Date: <span className="font-semibold text-gray-900">{dateStr}</span></div>
              <div className="text-[11px] text-gray-600">Valid Until: <span className="font-semibold text-gray-900">{validUntilStr}</span></div>
            </div>
          </div>

          {/* Product & Technique Specs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-100 text-xs">
            <div>
              <span className="text-gray-400 font-bold uppercase text-[10px] block">Item / Style</span>
              <span className="font-black text-gray-900 block mt-0.5">{productName}</span>
            </div>
            <div>
              <span className="text-gray-400 font-bold uppercase text-[10px] block">Fabric & GSM</span>
              <span className="font-black text-gray-900 block mt-0.5">{fabricGsm}</span>
            </div>
            <div>
              <span className="text-gray-400 font-bold uppercase text-[10px] block">Garment Color</span>
              <span className="font-black text-gray-900 block mt-0.5">{colorName}</span>
            </div>
            <div>
              <span className="text-gray-400 font-bold uppercase text-[10px] block">Print Technique</span>
              <span className="font-black text-amber-700 block mt-0.5">{methodName}</span>
            </div>
          </div>

          {/* Artwork & Placement Note if present */}
          {(artworkUrl || customText) && (
            <div className="flex items-center gap-3 p-3 bg-amber-50/50 rounded-xl border border-amber-100 text-xs">
              {artworkUrl && (
                <img
                  src={artworkUrl}
                  alt="Artwork preview"
                  className="w-12 h-12 object-contain rounded-lg bg-white p-1 border border-amber-200 shrink-0"
                />
              )}
              <div className="text-left">
                <span className="font-black text-gray-900 block">Print Placement: {placement.replace('_', ' ').toUpperCase()}</span>
                {customText && (
                  <span className="text-gray-600 text-[11px] block mt-0.5">
                    Custom Typography: <strong className="text-gray-900">"{customText}"</strong>
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Size Breakdown Matrix Table */}
          <div className="border border-gray-200 rounded-2xl overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-gray-100/80 font-black text-gray-700 uppercase tracking-wider text-[10px] border-b border-gray-200">
                <tr>
                  <th className="py-2.5 px-3">Size Matrix</th>
                  <th className="py-2.5 px-3 text-center">Quantity</th>
                  <th className="py-2.5 px-3 text-right">Standard Rate</th>
                  <th className="py-2.5 px-3 text-right">Line Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {breakdown.map((row) => (
                  <tr key={row.size} className="hover:bg-gray-50/50">
                    <td className="py-2.5 px-3 font-bold text-gray-900">{row.size}</td>
                    <td className="py-2.5 px-3 text-center font-bold text-gray-800">{row.quantity} units</td>
                    <td className="py-2.5 px-3 text-right text-gray-600">₹{row.unitPrice}</td>
                    <td className="py-2.5 px-3 text-right font-black text-gray-900">₹{row.quantity * row.unitPrice}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pricing Summary */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-200">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-black text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{tierName} Applied ({tierDiscountPercent}% Discount)</span>
              </div>
              <p className="text-[11px] text-gray-500">
                Total Batch Quantity: <strong className="text-gray-900">{totalQuantity} Garments</strong>
              </p>
            </div>

            <div className="w-full sm:w-64 space-y-1 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Gross Retail:</span>
                <span>₹{rawSubtotal}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between font-bold text-emerald-600">
                  <span>Volume Discount ({tierDiscountPercent}%):</span>
                  <span>- ₹{discountAmount}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-600">
                <span>Net Subtotal:</span>
                <span>₹{discountedSubtotal}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>GST (5% Apparel):</span>
                <span>₹{gstAmount}</span>
              </div>
              <div className="flex justify-between font-black text-base text-gray-900 border-t pt-1.5 border-gray-300">
                <span>Estimated Total:</span>
                <span className="text-[#AC7900]">₹{grandTotal}</span>
              </div>
            </div>
          </div>

          {/* Production Guarantee & Footer */}
          <div className="pt-2 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-500 gap-3">
            <div className="flex items-center gap-1.5 text-gray-700 font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Standard Production & Dispatch: 3–5 Business Days</span>
            </div>
            <div className="italic text-gray-400">
              Generated via Fabric Print 3D Studio Configurator Engine
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


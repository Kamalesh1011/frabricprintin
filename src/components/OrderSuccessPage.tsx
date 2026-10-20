import React, { useState } from 'react';
import {
  CheckCircle,
  Truck,
  Package,
  Printer,
  Sparkles,
  ArrowRight,
  Download,
  Calendar,
  ExternalLink,
  Eye,
  X,
  Layers,
  FileCheck
} from 'lucide-react';
import { Order } from '../types';

interface OrderSuccessPageProps {
  order: Order;
  onGoToDashboard: () => void;
  onGoToFabrics: () => void;
}

export const OrderSuccessPage: React.FC<OrderSuccessPageProps> = ({ order, onGoToDashboard, onGoToFabrics }) => {
  const [inspectArtworkUrl, setInspectArtworkUrl] = useState<string | null>(null);

  return (
    <div className="min-h-screen py-12 text-[#0F100F] dark:text-white transition-colors duration-300">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        
        {/* Confirmed Banner */}
        <div className="bg-white dark:bg-[#1A1C1A] rounded-[35px] border border-[#ECECEC] dark:border-white/[0.08] p-6 sm:p-8 shadow-fabriclore text-center space-y-4">
          <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle className="w-10 h-10" />
          </div>

          <div>
            <span className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold uppercase px-3.5 py-1 rounded-full tracking-wider border border-emerald-200 dark:border-emerald-800">
              Order Confirmed &amp; Dispatched to Mill Production
            </span>
            <h1 className="text-2xl sm:text-3xl font-black font-editorial mt-3">
              Thank You for Your Order!
            </h1>
            <p className="text-xs text-[#8A8883] dark:text-gray-400 mt-1">
              Order ID: <strong className="text-[#0F100F] dark:text-white">{order.id}</strong> • Tracking: <strong className="text-[#AC7900] dark:text-[#D4AF37]">{order.trackingNumber}</strong>
            </p>
          </div>

          {/* Timeline Status Preview */}
          <div className="bg-[#F9F6ED] dark:bg-[#242624] rounded-2xl p-4 border border-[#ECECEC] dark:border-white/[0.08] grid grid-cols-4 gap-2 text-center text-xs pt-4">
            <div className="space-y-1">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center mx-auto text-xs shadow-xs">
                1
              </div>
              <p className="font-bold text-[11px]">Placed</p>
              <p className="text-[10px] text-[#8A8883]">Received</p>
            </div>

            <div className="space-y-1">
              <div className="w-8 h-8 rounded-full bg-[#0F100F] dark:bg-white text-white dark:text-[#0F100F] font-bold flex items-center justify-center mx-auto text-xs shadow-xs">
                2
              </div>
              <p className="font-bold text-[11px]">Artwork RIP</p>
              <p className="text-[10px] text-[#8A8883]">1200 DPI Check</p>
            </div>

            <div className="space-y-1">
              <div className="w-8 h-8 rounded-full bg-[#ECECEC] dark:bg-[#333] text-gray-500 font-bold flex items-center justify-center mx-auto text-xs">
                3
              </div>
              <p className="font-medium text-[11px]">Printing</p>
              <p className="text-[10px] text-[#8A8883]">Fabric Finishing</p>
            </div>

            <div className="space-y-1">
              <div className="w-8 h-8 rounded-full bg-[#ECECEC] dark:bg-[#333] text-gray-500 font-bold flex items-center justify-center mx-auto text-xs">
                4
              </div>
              <p className="font-medium text-[11px]">Express Dispatch</p>
              <p className="text-[10px] text-[#8A8883]">Doorstep Delivery</p>
            </div>
          </div>

          {/* Ordered Items & Manufacturing Spec Sheet */}
          <div className="space-y-3 text-left pt-4 border-t border-[#ECECEC] dark:border-white/[0.08]">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider font-editorial">
                Manufacturing Spec Sheet &amp; Ordered Items:
              </h3>
              <span className="text-[10px] font-bold text-slate-400">
                {order.items.length} Production Line{order.items.length > 1 ? 's' : ''}
              </span>
            </div>

            {order.items.map((item, idx) => {
              const artworkUrl = item.printOptions?.designUrl || item.customPreviewUrl;
              const hasCustomArtwork = Boolean(item.printOptions?.requiresPrint || item.printOptions?.designUrl);

              return (
                <div
                  key={idx}
                  className="p-4 bg-[#F9F6ED] dark:bg-[#242624] rounded-2xl border border-[#ECECEC] dark:border-white/[0.08] text-xs space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3.5">
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-white dark:bg-black/20 border border-black/10 dark:border-white/10 shrink-0">
                        <img
                          src={item.customPreviewUrl || item.printOptions?.designUrl || item.productImage}
                          alt={item.productName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-bold text-sm text-[#0F100F] dark:text-white">{item.productName}</h4>
                        <p className="text-[11px] text-[#8A8883] dark:text-gray-400">
                          {item.sizeLabel} {item.gsm ? `• ${item.gsm} GSM` : ''} • Shade: {item.color}
                        </p>
                        <p className="font-bold text-[#AC7900] dark:text-[#D4AF37]">
                          ₹{item.totalPrice.toLocaleString('en-IN')}.00
                        </p>
                      </div>
                    </div>

                    {hasCustomArtwork && artworkUrl && (
                      <button
                        type="button"
                        onClick={() => setInspectArtworkUrl(artworkUrl)}
                        className="px-3 py-1.5 rounded-xl bg-amber-500/15 text-amber-800 dark:text-amber-300 font-bold text-[10px] border border-amber-500/30 hover:bg-amber-500/25 transition flex items-center space-x-1"
                      >
                        <Eye className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                        <span>View Print File</span>
                      </button>
                    )}
                  </div>

                  {/* Size Matrix Grid */}
                  {item.sizeBreakdown && Object.keys(item.sizeBreakdown).length > 0 && (
                    <div className="p-2.5 rounded-xl bg-white dark:bg-[#1E201E] border border-[#ECECEC] dark:border-white/[0.08] space-y-1">
                      <span className="text-[10px] font-bold text-slate-500 block">
                        Factory Size Picking Breakdown:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {Object.entries(item.sizeBreakdown).map(([sz, count]) => {
                          if (Number(count) <= 0) return null;
                          return (
                            <span
                              key={sz}
                              className="px-2.5 py-1 rounded-lg bg-amber-500/15 text-amber-800 dark:text-amber-300 font-bold border border-amber-500/30 text-[10px]"
                            >
                              {count} Units × {sz}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Print Instructions */}
                  {hasCustomArtwork && item.printOptions?.notes && (
                    <div className="p-2 rounded-lg bg-black/5 dark:bg-white/5 text-[10px] text-slate-600 dark:text-slate-300">
                      <strong>Factory Print Notes:</strong> {item.printOptions.notes}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Delivery Address & Contact Card */}
          <div className="p-4 bg-[#F9F6ED] dark:bg-[#242624] rounded-2xl border border-[#ECECEC] dark:border-white/[0.08] text-left text-xs space-y-1">
            <span className="font-bold text-slate-500 block text-[10px] uppercase tracking-wider">
              Shipping Destination:
            </span>
            <p className="font-bold text-[#0F100F] dark:text-white">{order.customerName}</p>
            <p className="text-[#8A8883] dark:text-gray-400">
              {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
            </p>
            <p className="text-[11px] text-slate-500">Phone: {order.customerPhone} • Email: {order.customerEmail}</p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 border-t border-[#ECECEC] dark:border-white/[0.08]">
            <button
              onClick={onGoToDashboard}
              className="w-full sm:w-auto bg-[#0F100F] dark:bg-white text-white dark:text-[#0F100F] font-bold px-6 py-3 rounded-full text-xs hover:opacity-90 transition shadow-md"
            >
              View Order Tracking
            </button>
            <button
              onClick={onGoToFabrics}
              className="w-full sm:w-auto bg-[#F9F6ED] dark:bg-[#242624] text-[#0F100F] dark:text-white font-bold px-6 py-3 rounded-full text-xs border border-[#ECECEC] dark:border-white/[0.1] hover:border-[#AC7900] transition"
            >
              Continue Shopping
            </button>
          </div>

        </div>

      </div>

      {/* 🖼️ MODAL: INSPECT CUSTOM ARTWORK ASSET */}
      {inspectArtworkUrl && (
        <div
          className="fixed inset-0 z-60 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setInspectArtworkUrl(null)}
        >
          <div
            className="relative max-w-xl w-full bg-white dark:bg-[#161716] rounded-3xl p-4 border border-black/10 dark:border-white/15 shadow-2xl space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-black/10 dark:border-white/10">
              <span className="text-xs font-bold font-editorial">High-Resolution Factory Production Asset</span>
              <button
                onClick={() => setInspectArtworkUrl(null)}
                className="p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="max-h-[70vh] overflow-hidden rounded-2xl bg-black/5 dark:bg-white/5 flex items-center justify-center">
              <img
                src={inspectArtworkUrl}
                alt="Production Design Asset"
                className="w-full max-h-[65vh] object-contain"
              />
            </div>
            <div className="flex items-center justify-between pt-1">
              <span className="text-[10px] text-slate-400">1200 DPI Certified Print Master</span>
              <a
                href={inspectArtworkUrl}
                target="_blank"
                rel="noreferrer"
                download="production_artwork_asset"
                className="px-3 py-1.5 rounded-xl bg-amber-500 text-black font-bold text-xs hover:bg-amber-400 transition flex items-center space-x-1"
              >
                <span>Download File</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

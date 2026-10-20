import React, { useState } from 'react';
import {
  X,
  Trash2,
  ArrowRight,
  Printer,
  Sparkles,
  Check,
  ShoppingBag,
  ExternalLink,
  Layers,
  Edit3,
  CheckCircle2,
  Eye,
  Sliders
} from 'lucide-react';
import { useCart } from '../context/CartContext';

interface CartDrawerProps {
  onGoToCheckout: () => void;
  onGoToFabrics: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onGoToCheckout, onGoToFabrics }) => {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    updateSizeBreakdown,
    subtotal,
    discount,
    shippingFee,
    tax,
    total,
    couponCode,
    applyCoupon,
    isCartOpen,
    setIsCartOpen
  } = useCart();

  const [inputCoupon, setInputCoupon] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  // Editing size breakdown inline modal/expander
  const [editingSizeItemId, setEditingSizeItemId] = useState<string | null>(null);
  const [tempBreakdown, setTempBreakdown] = useState<Record<string, number>>({});

  // Previewing full artwork modal
  const [inspectArtworkUrl, setInspectArtworkUrl] = useState<string | null>(null);

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');
    if (applyCoupon(inputCoupon)) {
      setCouponSuccess('Promo code applied successfully!');
    } else {
      setCouponError('Invalid coupon code. Try TEXPRINT10 or WELCOME10');
    }
  };

  const handleOpenEditBreakdown = (itemId: string, existingBreakdown: Record<string, number> = {}) => {
    setEditingSizeItemId(itemId);
    setTempBreakdown({ ...existingBreakdown });
  };

  const handleSaveBreakdown = (itemId: string) => {
    updateSizeBreakdown(itemId, tempBreakdown);
    setEditingSizeItemId(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" id="cart-drawer-modal">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-md bg-[#FEFBF1] dark:bg-[#161716] text-[#0F100F] dark:text-white shadow-2xl flex flex-col border-l border-black/10 dark:border-white/[0.08] transition-colors duration-300">
          
          {/* Drawer Header */}
          <div className="p-4 bg-[#0F100F] text-white flex items-center justify-between border-b border-white/[0.08]">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
              <h2 className="font-bold text-xs tracking-wide uppercase font-editorial">
                Your Shopping Cart ({cart.length})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1 hover:bg-white/10 rounded-full text-white/70 hover:text-white transition"
              title="Close Cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 divide-y divide-black/10 dark:divide-white/[0.08]">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-14 h-14 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto text-amber-600 dark:text-amber-400">
                  <Printer className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-sm font-editorial">Your cart is empty</h3>
                <p className="text-xs text-[#8A8883] dark:text-gray-400 max-w-xs mx-auto">
                  Explore certified fabrics, custom jerseys, or personalized shirts in 3D.
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    onGoToFabrics();
                  }}
                  className="bg-[#0F100F] dark:bg-white text-white dark:text-[#0F100F] font-bold px-5 py-2.5 rounded-full text-xs transition hover:opacity-90"
                >
                  Explore Catalog
                </button>
              </div>
            ) : (
              cart.map((item) => {
                const isCustomPrint = Boolean(item.printOptions?.requiresPrint || item.printOptions?.designUrl);
                const artworkUrl = item.printOptions?.designUrl || item.customPreviewUrl;
                const sizeMatrix = item.sizeBreakdown && Object.keys(item.sizeBreakdown).length > 0
                  ? item.sizeBreakdown
                  : null;

                const isEditingThisBreakdown = editingSizeItemId === item.id;

                return (
                  <div key={item.id} className="pt-4 first:pt-0 space-y-2.5 group">
                    <div className="flex items-start space-x-3">
                      
                      {/* Product Thumbnail / Custom Design Snapshot */}
                      <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-[#F3F0E8] dark:bg-[#222422] border border-black/10 dark:border-white/[0.1] shrink-0 group/thumb">
                        <img
                          src={item.customPreviewUrl || item.printOptions?.designUrl || item.product?.image_url || item.product?.images?.[0] || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=600'}
                          alt={item.product?.name || 'Product'}
                          className="w-full h-full object-cover"
                        />
                        {artworkUrl && (
                          <button
                            type="button"
                            onClick={() => setInspectArtworkUrl(artworkUrl)}
                            className="absolute inset-0 bg-black/60 opacity-0 group-hover/thumb:opacity-100 flex items-center justify-center text-white transition backdrop-blur-xs"
                            title="Inspect Design Asset"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-start justify-between">
                          <h4 className="font-bold text-xs truncate max-w-[170px] text-[#0F100F] dark:text-white">
                            {item.product.name}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-gray-400 hover:text-red-500 transition p-0.5"
                            title="Remove"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <p className="text-[11px] text-[#8A8883] dark:text-gray-400">
                          {item.sizeType === 'apparel'
                            ? `${item.quantity} pcs (${item.selectedFabricVariant || 'Apparel Custom'})`
                            : item.sizeType === 'meter'
                            ? `${item.meters}m Linear • ${item.selectedFabricVariant || 'Standard'}`
                            : item.sizeType === 'swatch_test'
                            ? 'Test Swatch (20x20cm)'
                            : 'Big Swatch (75x100cm)'}
                        </p>

                        {/* Price & Quantity Stepper */}
                        <div className="flex items-center justify-between pt-1">
                          <span className="text-xs font-bold text-[#AC7900] dark:text-[#D4AF37]">
                            ₹{item.itemTotalPrice.toLocaleString('en-IN')}.00
                          </span>

                          <div className="flex items-center space-x-1.5 bg-white dark:bg-[#242624] px-2 py-0.5 rounded-full border border-black/10 dark:border-white/[0.08] text-xs shadow-xs">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="text-gray-500 hover:text-black dark:hover:text-white px-1 font-bold"
                            >
                              -
                            </button>
                            <span className="font-bold px-1">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="text-gray-500 hover:text-black dark:hover:text-white px-1 font-bold"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>

                    </div>

                    {/* Production Details & Attached Artwork File Pill */}
                    {isCustomPrint && (
                      <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[10px] space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-amber-800 dark:text-amber-300 flex items-center space-x-1">
                            <Sparkles className="w-3 h-3 text-amber-500" />
                            <span>Custom Production Asset Attached</span>
                          </span>
                          {artworkUrl && (
                            <button
                              onClick={() => setInspectArtworkUrl(artworkUrl)}
                              className="text-[9px] font-bold text-amber-700 dark:text-amber-300 underline hover:opacity-80 flex items-center space-x-0.5"
                            >
                              <span>View Design</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </button>
                          )}
                        </div>
                        {item.printOptions.notes && (
                          <p className="text-[9px] text-[#8A8883] dark:text-gray-400 line-clamp-1">
                            {item.printOptions.notes}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Size Breakdown Pills Matrix */}
                    {sizeMatrix && (
                      <div className="p-2 rounded-xl bg-white dark:bg-[#1E201E] border border-black/10 dark:border-white/10 text-[10px] space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-600 dark:text-slate-300">
                            Size Breakdown:
                          </span>
                          <button
                            onClick={() => isEditingThisBreakdown ? setEditingSizeItemId(null) : handleOpenEditBreakdown(item.id, sizeMatrix)}
                            className="text-[9px] font-bold text-[#AC7900] dark:text-[#D4AF37] hover:underline flex items-center space-x-1"
                          >
                            <Edit3 className="w-2.5 h-2.5" />
                            <span>{isEditingThisBreakdown ? 'Close' : 'Adjust Sizes'}</span>
                          </button>
                        </div>

                        {!isEditingThisBreakdown ? (
                          <div className="flex flex-wrap gap-1">
                            {Object.entries(sizeMatrix).map(([sz, count]) => {
                              if (Number(count) <= 0) return null;
                              return (
                                <span
                                  key={sz}
                                  className="px-2 py-0.5 rounded-lg bg-amber-500/15 text-amber-800 dark:text-amber-300 font-bold border border-amber-500/30 text-[9px]"
                                >
                                  {count}× {sz}
                                </span>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="space-y-2 pt-1">
                            <div className="grid grid-cols-4 gap-1">
                              {Object.keys(sizeMatrix).map((sz) => (
                                <div key={sz} className="text-center p-1 rounded-lg bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10">
                                  <span className="text-[9px] font-bold block">{sz}</span>
                                  <input
                                    type="number"
                                    min="0"
                                    value={tempBreakdown[sz] || 0}
                                    onChange={(e) => {
                                      const val = Math.max(0, parseInt(e.target.value) || 0);
                                      setTempBreakdown(prev => ({ ...prev, [sz]: val }));
                                    }}
                                    className="w-full text-center text-xs font-bold bg-transparent outline-none p-0"
                                  />
                                </div>
                              ))}
                            </div>
                            <button
                              onClick={() => handleSaveBreakdown(item.id)}
                              className="w-full py-1.5 rounded-lg bg-[#0F100F] dark:bg-white text-white dark:text-[#0F100F] text-[10px] font-bold"
                            >
                              Save Size Matrix
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                  </div>
                );
              })
            )}
          </div>

          {/* Drawer Footer */}
          {cart.length > 0 && (
            <div className="p-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] border-t border-black/10 dark:border-white/[0.08] bg-white dark:bg-[#121312] space-y-3 shadow-lg">
              
              {/* Promo code form */}
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  value={inputCoupon}
                  onChange={(e) => setInputCoupon(e.target.value)}
                  placeholder="Coupon code (e.g. TEXPRINT10)"
                  className="flex-1 bg-[#F9F6ED] dark:bg-[#242624] border border-black/10 dark:border-white/[0.1] rounded-full px-3.5 py-1.5 text-xs text-[#0F100F] dark:text-white placeholder-gray-400 focus:outline-none"
                />
                <button
                  type="submit"
                  className="bg-[#0F100F] dark:bg-white text-white dark:text-[#0F100F] font-bold px-4 py-1.5 rounded-full text-xs hover:opacity-90"
                >
                  Apply
                </button>
              </form>

              {couponSuccess && <p className="text-[11px] text-emerald-600 font-semibold">{couponSuccess}</p>}
              {couponError && <p className="text-[11px] text-red-500 font-semibold">{couponError}</p>}

              <div className="space-y-1.5 text-xs pt-1">
                <div className="flex justify-between text-[#8A8883] dark:text-gray-400">
                  <span>Subtotal</span>
                  <span className="font-bold text-[#0F100F] dark:text-white">₹{subtotal.toLocaleString('en-IN')}.00</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                    <span>Mill Bulk / Promo Discount</span>
                    <span>- ₹{discount.toLocaleString('en-IN')}.00</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold text-[#0F100F] dark:text-white pt-1 border-t border-black/10 dark:border-white/[0.08]">
                  <span>Total Amount</span>
                  <span className="text-[#AC7900] dark:text-[#D4AF37]">₹{total.toLocaleString('en-IN')}.00</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsCartOpen(false);
                  onGoToCheckout();
                }}
                className="w-full bg-gradient-to-r from-[#0F100F] to-[#252825] dark:from-white dark:to-slate-200 text-white dark:text-[#0F100F] font-bold py-3.5 rounded-full text-xs flex items-center justify-center space-x-2 shadow-lg hover:opacity-95 transition"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </div>
          )}

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
              <span className="text-xs font-bold font-editorial">High-Resolution Print Artwork</span>
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
              <span className="text-[10px] text-slate-400">Ready for 1200 DPI Reactive / Sublimation Print</span>
              <a
                href={inspectArtworkUrl}
                target="_blank"
                rel="noreferrer"
                download="custom_artwork_asset"
                className="px-3 py-1.5 rounded-xl bg-amber-500 text-black font-bold text-xs hover:bg-amber-400 transition flex items-center space-x-1"
              >
                <span>Download Asset</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

import React, { useEffect, useState } from 'react';
import { ShieldCheck, Lock, ArrowLeft, Printer, ArrowRight, MessageCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { createCheckout, fetchPaymentConfig, verifyCheckout, type PaymentConfig } from '../services/api';
import { BUSINESS_INFO } from '../config/businessInfo';
import { Order } from '../types';

interface CheckoutPageProps {
  onOrderSuccess: (order: Order) => void;
  onBackToCart: () => void;
  onBackToFabrics?: () => void;
}

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void; on: (ev: string, cb: (r: any) => void) => void };
  }
}

const RAZORPAY_SCRIPT = 'https://checkout.razorpay.com/v1/checkout.js';

function loadRazorpayScript(): Promise<void> {
  if (window.Razorpay) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${RAZORPAY_SCRIPT}"]`);
    const script = existing || document.createElement('script');
    script.addEventListener('load', () => resolve());
    script.addEventListener('error', () => reject(new Error('Could not load Razorpay. Check your connection and try again.')));
    if (!existing) {
      script.src = RAZORPAY_SCRIPT;
      script.async = true;
      document.body.appendChild(script);
    }
  });
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onOrderSuccess, onBackToCart, onBackToFabrics }) => {
  const { currentUser, saveAddress } = useAuth();
  const { cart, subtotal, discount, shippingFee, tax, total, clearCart } = useCart();

  // Form State
  const defaultAddr = currentUser?.addresses[0];
  const [fullName, setFullName] = useState(defaultAddr?.fullName || currentUser?.name || '');
  const [phone, setPhone] = useState(defaultAddr?.phone || currentUser?.phone || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [street, setStreet] = useState(defaultAddr?.street || '');
  const [city, setCity] = useState(defaultAddr?.city || '');
  const [state, setState] = useState(defaultAddr?.state || '');
  const [pincode, setPincode] = useState(defaultAddr?.pincode || '');
  const [country] = useState('India');

  const [paymentConfig, setPaymentConfig] = useState<PaymentConfig | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderError, setOrderError] = useState('');

  useEffect(() => {
    fetchPaymentConfig().then(setPaymentConfig);
  }, []);

  const paymentsReady = paymentConfig?.razorpayEnabled === true;

  const validateForm = (): boolean => {
    if (!fullName || !phone || !street || !city || !pincode) {
      setOrderError('Please complete all required shipping address fields.');
      return false;
    }
    if (!/^\d{6}$/.test(pincode.trim())) {
      setOrderError('Please enter a valid 6-digit PIN code.');
      return false;
    }
    if (phone.replace(/\D/g, '').length < 10) {
      setOrderError('Please enter a valid 10-digit phone number.');
      return false;
    }
    setOrderError('');
    return true;
  };

  const buildOrder = (): Partial<Order> => {
    const shippingAddress = {
      id: `addr-${Date.now()}`,
      fullName,
      phone,
      street,
      city,
      state,
      pincode: pincode.trim(),
      country
    };

    const items = cart.map((item) => ({
      productId: item.productId,
      productName: item.product.name,
      productImage: item.customPreviewUrl || item.printOptions?.designUrl || item.product?.image_url || item.product?.images?.[0] || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=60&w=600',
      gsm: item.product.gsm,
      width: item.product.width,
      color: item.product.color,
      sizeType: item.sizeType,
      sizeLabel:
        item.sizeType === 'apparel'
          ? `${item.quantity} Pcs Custom Apparel`
          : item.sizeType === 'swatch_test'
          ? 'Test Swatch (20x20cm)'
          : item.sizeType === 'swatch_big'
          ? 'Big Swatch (75x100cm)'
          : `Linear Meter (${item.meters}m)`,
      meters: item.meters,
      quantity: item.quantity,
      pricePerUnit: item.calculatedPricePerUnit,
      totalPrice: item.itemTotalPrice,
      printOptions: item.printOptions,
      sizeBreakdown: item.sizeBreakdown,
      customPreviewUrl: item.customPreviewUrl || item.printOptions?.designUrl,
      apparelProduct: item.apparelProduct,
      jerseyCustomization: item.jerseyCustomization,
    }));

    return {
      customerName: fullName,
      customerEmail: email,
      customerPhone: phone,
      shippingAddress,
      items: items as Order['items'],
      subtotal,
      discount,
      shippingFee,
      tax,
      totalAmount: total,
      paymentMethod: 'Razorpay'
    };
  };

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentsReady || !validateForm()) return;
    setIsProcessing(true);
    try {
      const order = buildOrder();
      if (currentUser && order.shippingAddress) {
        const { id: _id, ...addr } = order.shippingAddress;
        saveAddress(addr);
      }

      const [session] = await Promise.all([createCheckout(order), loadRazorpayScript()]);
      if (!window.Razorpay) throw new Error('Razorpay failed to load.');

      const rzp = new window.Razorpay({
        key: session.keyId,
        amount: session.amount,
        currency: session.currency,
        order_id: session.razorpayOrderId,
        name: BUSINESS_INFO.brandName,
        description: `Order ${session.orderId}`,
        image: `${window.location.origin}/leaf-logo.png`,
        prefill: session.prefill,
        notes: { order_id: session.orderId },
        theme: { color: '#0F100F' },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
            setOrderError('Payment was cancelled. Your cart is saved — you can try again.');
          }
        },
        handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
          try {
            const paidOrder = await verifyCheckout({ orderId: session.orderId, ...response });
            clearCart();
            onOrderSuccess(paidOrder);
          } catch (err: any) {
            setOrderError(
              `${err.message || 'Payment verification failed.'} Reference: ${session.orderId} / ${response.razorpay_payment_id}`
            );
          } finally {
            setIsProcessing(false);
          }
        }
      });
      rzp.on('payment.failed', (resp: any) => {
        setOrderError(resp?.error?.description || 'Payment failed. Please try again or use another method.');
      });
      rzp.open();
    } catch (err: any) {
      setOrderError(err.message || 'Failed to start payment.');
      setIsProcessing(false);
    }
  };

  const whatsappOrderUrl = (): string => {
    const lines = [
      `Hi ${BUSINESS_INFO.brandName}, I want to place an order:`,
      ...cart.map((item, i) => {
        const qty =
          item.sizeType === 'apparel'
            ? `${item.quantity} pcs`
            : item.sizeType === 'meter'
            ? `${item.meters} m`
            : item.sizeType === 'swatch_test'
            ? 'Test swatch'
            : 'Big swatch';
        return `${i + 1}. ${item.product?.name} – ${qty} – ₹${item.itemTotalPrice.toLocaleString('en-IN')}`;
      }),
      `Total: ₹${total.toLocaleString('en-IN')}`,
      fullName ? `Name: ${fullName}` : '',
      phone ? `Phone: ${phone}` : '',
      street ? `Address: ${street}, ${city} ${state} ${pincode}` : ''
    ].filter(Boolean);
    return `https://wa.me/${BUSINESS_INFO.whatsapp.number}?text=${encodeURIComponent(lines.join('\n'))}`;
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center text-[#0F100F] dark:text-white space-y-4">
        <Printer className="w-12 h-12 text-[#AC7900] opacity-70" />
        <h2 className="text-xl font-bold font-editorial">Your Cart is Empty</h2>
        <p className="text-xs text-[#8A8883] dark:text-gray-400 max-w-sm">
          Select base fabric qualities or upload custom artwork in the 3D Customizer.
        </p>
        <button
          onClick={onBackToFabrics || onBackToCart}
          className="bg-[#0F100F] dark:bg-white text-white dark:text-[#0F100F] font-bold px-6 py-2.5 rounded-full text-xs transition"
        >
          Explore Fabrics
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 text-[#0F100F] dark:text-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Back Link */}
        <button
          onClick={onBackToCart}
          className="inline-flex items-center space-x-2 text-xs font-semibold text-[#8A8883] dark:text-gray-400 hover:text-[#AC7900] transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Cart & Customizer</span>
        </button>

        <h1 className="text-2xl sm:text-3xl font-black font-editorial flex items-center space-x-2.5 text-[#0F100F] dark:text-white">
          <ShieldCheck className="w-7 h-7 text-[#AC7900] dark:text-[#D4AF37]" />
          <span>Secure Mill Checkout</span>
        </h1>

        <form onSubmit={handlePay} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Shipping Address & Payment Selection */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Address Form */}
            <div className="bg-white dark:bg-[#1A1C1A] rounded-[30px] border border-[#ECECEC] dark:border-white/[0.08] p-6 shadow-fabriclore space-y-4">
              <h3 className="font-bold text-xs uppercase tracking-wider border-b border-[#ECECEC] dark:border-white/[0.08] pb-2 font-editorial text-[#0F100F] dark:text-white">
                1. Delivery & Dispatch Address
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold mb-1 text-[#0F100F] dark:text-white">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-[#F9F6ED] dark:bg-[#242624] border border-[#ECECEC] dark:border-white/[0.1] rounded-xl py-2.5 px-3 focus:outline-none focus:border-[#AC7900] text-[#0F100F] dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-[#0F100F] dark:text-white">Phone Number *</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#F9F6ED] dark:bg-[#242624] border border-[#ECECEC] dark:border-white/[0.1] rounded-xl py-2.5 px-3 focus:outline-none focus:border-[#AC7900] text-[#0F100F] dark:text-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold mb-1 text-[#0F100F] dark:text-white">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#F9F6ED] dark:bg-[#242624] border border-[#ECECEC] dark:border-white/[0.1] rounded-xl py-2.5 px-3 focus:outline-none focus:border-[#AC7900] text-[#0F100F] dark:text-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold mb-1 text-[#0F100F] dark:text-white">Street / Studio Address *</label>
                  <input
                    type="text"
                    required
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    className="w-full bg-[#F9F6ED] dark:bg-[#242624] border border-[#ECECEC] dark:border-white/[0.1] rounded-xl py-2.5 px-3 focus:outline-none focus:border-[#AC7900] text-[#0F100F] dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-[#0F100F] dark:text-white">City / Textile Market *</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-[#F9F6ED] dark:bg-[#242624] border border-[#ECECEC] dark:border-white/[0.1] rounded-xl py-2.5 px-3 focus:outline-none focus:border-[#AC7900] text-[#0F100F] dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-[#0F100F] dark:text-white">Pincode *</label>
                  <input
                    type="text"
                    required
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-full bg-[#F9F6ED] dark:bg-[#242624] border border-[#ECECEC] dark:border-white/[0.1] rounded-xl py-2.5 px-3 focus:outline-none focus:border-[#AC7900] text-[#0F100F] dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white dark:bg-[#1A1C1A] rounded-[30px] border border-[#ECECEC] dark:border-white/[0.08] p-6 shadow-fabriclore space-y-4">
              <h3 className="font-bold text-xs uppercase tracking-wider border-b border-[#ECECEC] dark:border-white/[0.08] pb-2 font-editorial text-[#0F100F] dark:text-white">
                2. Payment
              </h3>

              {paymentConfig === null ? (
                <p className="text-xs text-[#8A8883] dark:text-gray-400">Checking payment options…</p>
              ) : paymentsReady ? (
                <div className="p-3.5 rounded-2xl border border-[#0F100F] dark:border-white bg-[#FEFBF1] dark:bg-[#222422] flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold block">Pay securely with Razorpay</span>
                    <span className="text-[11px] text-[#8A8883] dark:text-gray-400">UPI, Cards, NetBanking, Wallets, EMI</span>
                  </div>
                  <Lock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                </div>
              ) : (
                <div className="p-3.5 rounded-2xl border border-amber-500/30 bg-amber-500/10 space-y-2">
                  <span className="text-xs font-bold block">Online payment is being set up</span>
                  <span className="text-[11px] text-[#8A8883] dark:text-gray-300 block">
                    Send your order on WhatsApp and our team will confirm the price, delivery date and payment link.
                  </span>
                </div>
              )}
            </div>

          </div>

          {/* RIGHT: Order Summary */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white dark:bg-[#1A1C1A] rounded-[30px] border border-[#ECECEC] dark:border-white/[0.08] p-6 shadow-fabriclore space-y-4 text-[#0F100F] dark:text-white">
              
              <h3 className="font-bold text-xs uppercase tracking-wider border-b border-[#ECECEC] dark:border-white/[0.08] pb-2 font-editorial">
                Order Summary ({cart.length} item{cart.length > 1 ? 's' : ''})
              </h3>

              <div className="space-y-3 max-h-80 overflow-y-auto pr-1 divide-y divide-[#ECECEC] dark:divide-white/[0.08]">
                {cart.map((item, idx) => {
                  const isCustom = Boolean(item.printOptions?.requiresPrint || item.printOptions?.designUrl);
                  return (
                    <div key={idx} className="pt-3 first:pt-0 space-y-1.5">
                      <div className="flex items-start space-x-3">
                        <img
                          src={item.customPreviewUrl || item.printOptions?.designUrl || item.product?.image_url || item.product?.images?.[0] || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=60&w=600'}
                          alt={item.product?.name || 'Product'}
                          className="w-14 h-14 rounded-xl object-cover border border-[#ECECEC] dark:border-white/[0.1] shrink-0"
                        />
                        <div className="flex-1 min-w-0 text-xs">
                          <h4 className="font-bold truncate">{item.product?.name}</h4>
                          <p className="text-[10px] text-[#8A8883] dark:text-gray-400">
                            {item.sizeType === 'apparel'
                              ? `${item.quantity} pcs (${item.selectedFabricVariant || 'Apparel Custom'})`
                              : item.sizeType === 'meter'
                              ? `${item.meters} Linear Meter(s)`
                              : item.sizeType === 'swatch_test'
                              ? 'Test Swatch'
                              : 'Big Swatch'}
                          </p>
                          <p className="font-bold text-[#AC7900] dark:text-[#D4AF37] mt-0.5">
                            ₹{item.itemTotalPrice.toLocaleString('en-IN')}.00
                          </p>
                        </div>
                      </div>

                      {/* Size Matrix Badges */}
                      {item.sizeBreakdown && Object.keys(item.sizeBreakdown).length > 0 && (
                        <div className="flex flex-wrap gap-1 pl-1">
                          {Object.entries(item.sizeBreakdown).map(([sz, count]) => {
                            if (Number(count) <= 0) return null;
                            return (
                              <span
                                key={sz}
                                className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-800 dark:text-amber-300 font-bold border border-amber-500/20 text-[9px]"
                              >
                                {count}× {sz}
                              </span>
                            );
                          })}
                        </div>
                      )}

                      {/* Attached Print Design Note */}
                      {isCustom && item.printOptions.notes && (
                        <p className="text-[9px] text-slate-500 dark:text-slate-400 pl-1 italic line-clamp-1">
                          🖨️ {item.printOptions.notes}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-[#ECECEC] dark:border-white/[0.08] pt-3 space-y-2 text-xs">
                <div className="flex justify-between text-[#8A8883] dark:text-gray-400">
                  <span>Subtotal</span>
                  <span className="font-bold text-[#0F100F] dark:text-white">INR {subtotal.toLocaleString('en-IN')}.00</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                    <span>Discount</span>
                    <span>- INR {discount.toLocaleString('en-IN')}.00</span>
                  </div>
                )}
                <div className="flex justify-between text-[#8A8883] dark:text-gray-400">
                  <span>Shipping & Packaging</span>
                  <span>{shippingFee === 0 ? 'FREE' : `INR ${shippingFee}`}</span>
                </div>
                <div className="flex justify-between text-[#8A8883] dark:text-gray-400">
                  <span>GST (5%)</span>
                  <span>INR {tax.toLocaleString('en-IN')}.00</span>
                </div>
                <div className="flex justify-between text-base font-bold text-[#0F100F] dark:text-white pt-2 border-t border-[#ECECEC] dark:border-white/[0.08]">
                  <span>Total Amount</span>
                  <span>INR {total.toLocaleString('en-IN')}.00</span>
                </div>
              </div>

              {orderError && (
                <p className="text-xs text-red-500 font-semibold">{orderError}</p>
              )}

              {paymentsReady ? (
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-[#0F100F] dark:bg-white text-white dark:text-[#0F100F] font-bold py-3.5 px-4 rounded-full text-xs hover:opacity-90 transition shadow-md flex items-center justify-center space-x-2 disabled:opacity-60"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      <span>Processing payment…</span>
                    </>
                  ) : (
                    <>
                      <span>Pay INR {total.toLocaleString('en-IN')}.00</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              ) : (
                <a
                  href={whatsappOrderUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#25D366] text-white font-bold py-3.5 px-4 rounded-full text-xs hover:opacity-90 transition shadow-md flex items-center justify-center space-x-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Send Order on WhatsApp</span>
                </a>
              )}

            </div>
          </div>

        </form>

      </div>

    </div>
  );
};

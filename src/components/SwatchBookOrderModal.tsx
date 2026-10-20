import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Sparkles,
  ShoppingBag,
  X,
  Layers,
  ArrowRight,
  ShieldCheck,
  Truck,
  Star
} from 'lucide-react';
import { SwatchBook, Product } from '../types';
import { fetchSwatchBooks } from '../services/api';
import { useCart } from '../context/CartContext';

interface SwatchBookOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoToCheckout?: () => void;
}

export const SwatchBookOrderModal: React.FC<SwatchBookOrderModalProps> = ({
  isOpen,
  onClose,
  onGoToCheckout
}) => {
  const [swatchBooks, setSwatchBooks] = useState<SwatchBook[]>([]);
  const [selectedBook, setSelectedBook] = useState<SwatchBook | null>(null);
  const [addedAlert, setAddedAlert] = useState<boolean>(false);
  const { addToCart } = useCart();

  useEffect(() => {
    if (isOpen) {
      fetchSwatchBooks().then((books) => {
        setSwatchBooks(books);
        if (books.length > 0 && !selectedBook) {
          setSelectedBook(books[0]);
        }
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAddToCart = (book: SwatchBook) => {
    const dummyProduct: Product = {
      id: `swatch-book-${book.id}`,
      name: book.name,
      category: 'Cotton',
      gsm: 120,
      width: 'Swatch Master Binder',
      count: `${book.fabricsCount} Swatch Samples Included`,
      color: 'Assorted Swatch Deck',
      price_per_meter: book.price,
      swatch_test_price: book.price,
      swatch_big_price: book.price,
      print_surcharge_per_meter: 0,
      composition: 'Assorted Natural & Sustainable Mill Fabrics',
      weave_type: 'Assorted Weaves',
      images: [book.image],
      description: `${book.tagline} Contains ${book.fabricsCount} authentic fabric samples (20x20cm).`,
      in_stock: true,
      bestseller: true
    };

    addToCart(dummyProduct, 'swatch_big', 1, { requiresPrint: false }, 1);
    setAddedAlert(true);
    setTimeout(() => setAddedAlert(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white dark:bg-[#1A1C1A] text-[#0F100F] dark:text-white border border-[#ECECEC] dark:border-white/[0.08] rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[92vh] transition-colors duration-300">
        
        {/* Header Bar */}
        <div className="p-6 border-b border-[#ECECEC] dark:border-white/[0.08] flex items-center justify-between bg-[#FEFBF1] dark:bg-[#161716]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-[#0F100F] dark:bg-white text-white dark:text-[#0F100F] flex items-center justify-center shadow-md">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-bold font-editorial">
                  Order Fabric Swatch Sample Books
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#AC7900] text-white">
                  Direct Mill Shipping
                </span>
              </div>
              <p className="text-xs text-[#8A8883] dark:text-gray-400">
                Touch, feel texture, and test digital print quality before placing wholesale bulk orders
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-black dark:hover:text-white rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Alert */}
        {addedAlert && (
          <div className="bg-emerald-600 text-white p-3.5 px-6 flex items-center justify-between animate-in fade-in slide-in-from-top">
            <div className="flex items-center space-x-2 text-xs font-bold">
              <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0" />
              <span>Fabric Swatch Sample Pack added to your cart!</span>
            </div>
            {onGoToCheckout && (
              <button
                onClick={() => {
                  onClose();
                  onGoToCheckout();
                }}
                className="bg-white text-emerald-950 font-bold px-3 py-1 rounded-full text-xs hover:bg-emerald-50 transition"
              >
                Checkout Now →
              </button>
            )}
          </div>
        )}

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {swatchBooks.map((book) => {
              const isSelected = selectedBook?.id === book.id;
              return (
                <div
                  key={book.id}
                  onClick={() => setSelectedBook(book)}
                  className={`group relative rounded-[28px] border p-5 cursor-pointer transition flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#FEFBF1] dark:bg-[#242624] border-[#AC7900] shadow-md'
                      : 'bg-white dark:bg-[#1A1C1A] border-[#ECECEC] dark:border-white/[0.08] hover:border-[#AC7900]'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="relative h-44 rounded-2xl overflow-hidden bg-[#F3F0E8] dark:bg-[#222422]">
                      <img
                        src={book.image}
                        alt={book.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                      <div className="absolute top-2.5 left-2.5">
                        <span className="bg-black/70 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                          {book.badge}
                        </span>
                      </div>
                      <div className="absolute bottom-2.5 right-2.5 bg-black/80 backdrop-blur-md px-3 py-1 rounded-full text-right text-white">
                        <span className="text-[10px] text-gray-300 line-through mr-1.5">
                          INR {book.originalPrice}
                        </span>
                        <span className="text-xs font-bold text-amber-300">
                          INR {book.price}.00
                        </span>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold font-editorial group-hover:text-[#AC7900] transition">
                        {book.name}
                      </h4>
                      <p className="text-xs text-[#8A8883] dark:text-gray-400 mt-0.5">{book.tagline}</p>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {book.includedFabrics.map((fab, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] bg-[#F9F6ED] dark:bg-[#161716] text-[#6B6B6B] dark:text-gray-300 border border-[#ECECEC] dark:border-white/[0.08] px-2 py-0.5 rounded-full"
                        >
                          ✓ {fab}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 mt-2 border-t border-[#ECECEC] dark:border-white/[0.08] flex items-center justify-between">
                    <span className="text-[11px] text-[#8A8883] dark:text-gray-400 font-medium">
                      📦 {book.fabricsCount} Curated Swatches
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(book);
                      }}
                      className="bg-[#0F100F] dark:bg-white text-white dark:text-[#0F100F] font-bold px-4 py-1.5 rounded-full text-xs hover:opacity-90 transition flex items-center space-x-1 shadow-sm"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </div>
  );
};

import React from 'react';
import { Home, Layers, Shirt, GraduationCap, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface MobileBottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onGoToFabrics: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  setActiveTab,
  onGoToFabrics
}) => {
  const { cart, setIsCartOpen } = useCart();
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Hide bottom nav in customizer studio & product detail view so dedicated mobile buy bar has full focus
  if (activeTab === 'apparel-studio' || activeTab === 'product-detail') {
    return null;
  }

  const isFabricsActive = activeTab === 'fabrics';
  const isApparelActive = activeTab === 'apparel' || activeTab === 'jersey';
  const isTrainingActive = activeTab === 'training';
  const isHomeActive = activeTab === 'home';

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#111211]/95 backdrop-blur-xl border-t border-black/[0.08] dark:border-white/[0.1] px-2 py-1.5 shadow-[0_-4px_25px_rgba(0,0,0,0.06)] dark:shadow-[0_-4px_25px_rgba(0,0,0,0.5)] transition-colors duration-300 select-none pb-[calc(env(safe-area-inset-bottom)+0.375rem)]"
      aria-label="Mobile Navigation Bar"
      id="mobile-bottom-nav"
    >
      <div className="max-w-md mx-auto grid grid-cols-5 gap-1 items-center">
        
        {/* 1. Home */}
        <button
          type="button"
          onClick={() => {
            setActiveTab('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center py-1 rounded-2xl transition-all duration-200 relative ${
            isHomeActive
              ? 'text-[#0F100F] dark:text-white font-black'
              : 'text-slate-500 hover:text-black dark:hover:text-white font-medium'
          }`}
        >
          <div className={`p-1 rounded-xl transition-all ${isHomeActive ? 'bg-black/5 dark:bg-white/10 scale-110' : ''}`}>
            <Home className={`w-5 h-5 ${isHomeActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
          </div>
          <span className="text-[10px] tracking-tight mt-0.5">Home</span>
          {isHomeActive && (
            <span className="absolute -bottom-0.5 w-1 h-1 bg-[#AC7900] dark:bg-[#D4AF37] rounded-full" />
          )}
        </button>

        {/* 2. Fabric */}
        <button
          type="button"
          onClick={() => {
            onGoToFabrics();
          }}
          className={`flex flex-col items-center justify-center py-1 rounded-2xl transition-all duration-200 relative ${
            isFabricsActive
              ? 'text-[#0F100F] dark:text-white font-black'
              : 'text-slate-500 hover:text-black dark:hover:text-white font-medium'
          }`}
        >
          <div className={`p-1 rounded-xl transition-all ${isFabricsActive ? 'bg-black/5 dark:bg-white/10 scale-110' : ''}`}>
            <Layers className={`w-5 h-5 ${isFabricsActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
          </div>
          <span className="text-[10px] tracking-tight mt-0.5">Fabric</span>
          {isFabricsActive && (
            <span className="absolute -bottom-0.5 w-1 h-1 bg-[#AC7900] dark:bg-[#D4AF37] rounded-full" />
          )}
        </button>

        {/* 3. Tshirt */}
        <button
          type="button"
          onClick={() => {
            setActiveTab('apparel');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center py-1 rounded-2xl transition-all duration-200 relative ${
            isApparelActive
              ? 'text-[#0F100F] dark:text-white font-black'
              : 'text-slate-500 hover:text-black dark:hover:text-white font-medium'
          }`}
        >
          <div className={`p-1 rounded-xl transition-all ${isApparelActive ? 'bg-black/5 dark:bg-white/10 scale-110' : ''}`}>
            <Shirt className={`w-5 h-5 ${isApparelActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
          </div>
          <span className="text-[10px] tracking-tight mt-0.5">Tshirt</span>
          {isApparelActive && (
            <span className="absolute -bottom-0.5 w-1 h-1 bg-[#AC7900] dark:bg-[#D4AF37] rounded-full" />
          )}
        </button>

        {/* 4. Customize (3D Studio) */}
        <button
          type="button"
          onClick={() => {
            setActiveTab('apparel-studio');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center py-1 rounded-2xl transition-all duration-200 relative ${
            activeTab === 'apparel-studio'
              ? 'text-[#0F100F] dark:text-white font-black'
              : 'text-slate-500 hover:text-black dark:hover:text-white font-medium'
          }`}
        >
          <div className="p-1 rounded-xl transition-all relative">
            <span className="absolute -top-1 -right-2 px-1 py-0.2 rounded-full text-[8px] font-black bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-xs">
              3D
            </span>
            <svg
              className="w-5 h-5 stroke-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z"
              />
            </svg>
          </div>
          <span className="text-[10px] tracking-tight mt-0.5 font-bold text-[#AC7900] dark:text-[#D4AF37]">Customize</span>
          {activeTab === 'apparel-studio' && (
            <span className="absolute -bottom-0.5 w-1 h-1 bg-[#AC7900] dark:bg-[#D4AF37] rounded-full" />
          )}
        </button>

        {/* 5. Cart */}
        <button
          type="button"
          onClick={() => setIsCartOpen(true)}
          className="flex flex-col items-center justify-center py-1 rounded-2xl transition-all duration-200 relative text-slate-500 hover:text-black dark:hover:text-white font-medium"
        >
          <div className="p-1 rounded-xl transition-all relative">
            <ShoppingBag className="w-5 h-5 stroke-2" />
            {cartItemCount > 0 && (
              <span className="absolute -top-0.5 -right-1 bg-[#AC7900] dark:bg-[#D4AF37] text-white dark:text-black font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center shadow-md animate-in zoom-in-75">
                {cartItemCount > 99 ? '99+' : cartItemCount}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-tight mt-0.5">Cart</span>
        </button>

      </div>
    </nav>
  );
};

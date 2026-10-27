import React, { useState, useEffect, Suspense, lazy } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { ThemeProvider } from './context/ThemeContext';

import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { BulkInquiryModal } from './components/BulkInquiryModal';
import { WhatsAppButton } from './components/WhatsAppButton';
import { ChatBotWidget } from './components/ChatBot/ChatBotWidget';
import { MobileBottomNav } from './components/MobileBottomNav';
import { EntryWhatsAppModal } from './components/EntryWhatsAppModal';

import { HomePage } from './pages/HomePage';

// ---- Code splitting (perf) ----
// Only the initial landing page (HomePage) is eager. Every other page/component is
// lazy-loaded so the first paint downloads a much smaller JS bundle, and heavy
// deps (three.js / @react-three) are only fetched when the user actually visits
// a page that uses them.
const lazyNamed = <T extends Record<string, any>>(loader: () => Promise<T>, name: keyof T) => (
  lazy(async () => ({ default: await loader().then((m) => m[name]) }))
);

const FabricListingPage = lazyNamed(() => import('./pages/FabricListingPage'), 'FabricListingPage');
const BlankApparelPage = lazyNamed(() => import('./pages/BlankApparelPage'), 'BlankApparelPage');
const JerseyPage = lazyNamed(() => import('./pages/JerseyPage'), 'JerseyPage');
const UniformPage = lazyNamed(() => import('./pages/UniformPage'), 'UniformPage');
const CustomMerchPage = lazyNamed(() => import('./pages/CustomMerchPage'), 'CustomMerchPage');
const TrainingPage = lazyNamed(() => import('./pages/TrainingPage'), 'TrainingPage');
const ProductDetailView = lazyNamed(() => import('./components/ProductDetailView'), 'ProductDetailView');
const CheckoutPage = lazyNamed(() => import('./components/CheckoutPage'), 'CheckoutPage');
const OrderSuccessPage = lazyNamed(() => import('./components/OrderSuccessPage'), 'OrderSuccessPage');
const UserDashboard = lazyNamed(() => import('./components/UserDashboard'), 'UserDashboard');
const AdminDashboard = lazyNamed(() => import('./components/AdminDashboard'), 'AdminDashboard');
const FabricCustomizerModule = lazyNamed(() => import('./components/FabricCustomizerModule'), 'FabricCustomizerModule');
const MasterCustomizerStudioPage = lazyNamed(() => import('./pages/MasterCustomizerStudioPage'), 'MasterCustomizerStudioPage');
const AboutUsPage = lazyNamed(() => import('./pages/AboutUsPage'), 'AboutUsPage');
const ContactUsPage = lazyNamed(() => import('./pages/ContactUsPage'), 'ContactUsPage');
const AuthPage = lazyNamed(() => import('./pages/AuthPage'), 'AuthPage');
const PrivacyPolicyPage = lazyNamed(() => import('./pages/PrivacyPolicyPage'), 'PrivacyPolicyPage');
const TermsConditionsPage = lazyNamed(() => import('./pages/TermsConditionsPage'), 'TermsConditionsPage');

// Shared fallback while a lazy page chunk is downloading
const PageFallback = () => (
  <div className="flex flex-col items-center justify-center py-24 space-y-4">
    <div className="w-10 h-10 border-4 border-blue-900 border-t-transparent rounded-full animate-spin" />
    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
      Loading Fabric Print Mill Collection...
    </p>
  </div>
);

import { ErrorBoundary } from './components/ErrorBoundary';

import { fetchCategories, fetchProducts } from './services/api';
import { Category, Product, Order } from './types';
import { INITIAL_PRODUCTS } from './data/mockData';

export function MainAppContent() {
  const getInitialTab = (): string => {
    const hash = window.location.hash.replace('#', '');
    if (
      hash &&
      [
        'home',
        'fabrics',
        'apparel',
        'apparel-studio',
        'jersey',
        'uniforms',
        'merch',
        'training',
        'customizer',
        'about',
        'contact',
        'login',
        'dashboard',
        'wishlist',
        'checkout',
        'product-detail',
        'order-success',
        'admin'
      ].includes(hash)
    ) {
      return hash;
    }
    return 'home';
  };

  const { isAdmin } = useAuth();
  const [activeTab, setActiveTabState] = useState<string>(getInitialTab);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Synchronized tab navigation with browser history
  const setActiveTab = (tab: string, pushHistory = true) => {
    setActiveTabState(tab);
    if (pushHistory) {
      const targetHash = '#' + tab;
      if (window.location.hash !== targetHash) {
        window.history.pushState({ tab }, '', targetHash);
      }
    }
  };

  // Listen to browser Back and Forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const hash = window.location.hash.replace('#', '') || 'home';
      setActiveTabState(hash);
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  // Selected state for navigation & filters
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Modals & Order confirmation state
  const [bulkInquiryOpen, setBulkInquiryOpen] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);

  // Load Categories & Products function
  const loadData = async () => {
    const [cats, prods] = await Promise.all([fetchCategories(), fetchProducts()]);
    setCategories(cats);
    setProducts(prods);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  const defaultFabricProduct = products.find((p) => p.id === 'p-1') || products[0] || INITIAL_PRODUCTS[0];

  const handleSelectCategory = (catName: string) => {
    setSelectedCategory(catName);
    setSelectedProduct(defaultFabricProduct);
    setActiveTab('fabrics');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setActiveTab('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoToFabrics = () => {
    setSelectedProduct(defaultFabricProduct);
    setActiveTab('fabrics');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoToCheckout = () => {
    setActiveTab('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOrderPlaced = (order: Order) => {
    setPlacedOrder(order);
    setActiveTab('order-success');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-main)] text-[var(--text-main)] font-sans transition-colors duration-300 selection:bg-cyan-500 selection:text-slate-950">
      {/* Global Header Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenBulkInquiry={() => setBulkInquiryOpen(true)}
      />

      {/* Main Page Render Area */}
      <main className="flex-1">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <div className="w-10 h-10 border-4 border-blue-900 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              Loading Fabric Print Mill Collection...
            </p>
          </div>
        ) : (
          <Suspense fallback={<PageFallback />}>
            <>
            {activeTab === 'home' && (
              <HomePage
                categories={categories}
                products={products}
                onSelectCategory={handleSelectCategory}
                onSelectProduct={handleSelectProduct}
                onGoToFabrics={handleGoToFabrics}
                onGoToApparel={() => {
                  setActiveTab('apparel-studio');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onGoToUniforms={() => {
                  setActiveTab('uniforms');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onGoToMerch={() => {
                  setActiveTab('merch');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onGoToAbout={() => {
                  setActiveTab('about');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onOpenBulkInquiry={() => setBulkInquiryOpen(true)}
              />
            )}

            {activeTab === 'fabrics' && (
              <FabricListingPage
                products={products}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onSelectProduct={handleSelectProduct}
              />
            )}

            {(activeTab === 'apparel') && (
              <BlankApparelPage
                onGoToHome={() => setActiveTab('home')}
                onGoToCheckout={handleGoToCheckout}
                onOpenBulkInquiry={() => setBulkInquiryOpen(true)}
              />
            )}

            {activeTab === 'jersey' && (
              <JerseyPage
                onGoToHome={() => setActiveTab('home')}
                onGoToCheckout={handleGoToCheckout}
                onOpenBulkInquiry={() => setBulkInquiryOpen(true)}
              />
            )}

            {activeTab === 'apparel-studio' && (
              <BlankApparelPage
                onGoToHome={() => setActiveTab('home')}
                onGoToCheckout={handleGoToCheckout}
                onOpenBulkInquiry={() => setBulkInquiryOpen(true)}
                initialViewMode="studio"
              />
            )}

            {activeTab === 'uniforms' && (
              <UniformPage
                onGoToHome={() => setActiveTab('home')}
                onGoToCheckout={handleGoToCheckout}
                onOpenBulkInquiry={() => setBulkInquiryOpen(true)}
                onGoToOrder={() => setBulkInquiryOpen(true)}
              />
            )}

            {activeTab === 'merch' && (
              <CustomMerchPage
                onGoToHome={() => setActiveTab('home')}
                onGoToCheckout={handleGoToCheckout}
                onOpenBulkInquiry={() => setBulkInquiryOpen(true)}
              />
            )}

            {activeTab === 'training' && (
              <TrainingPage
                onGoToHome={() => setActiveTab('home')}
                onOpenBulkInquiry={() => setBulkInquiryOpen(true)}
              />
            )}

            {activeTab === 'product-detail' && (
              <ProductDetailView
                product={selectedProduct || defaultFabricProduct}
                allProducts={products.length > 0 ? products : INITIAL_PRODUCTS}
                onSelectProduct={(p) => setSelectedProduct(p)}
                onGoToCheckout={handleGoToCheckout}
                onOpenBulkInquiry={() => setBulkInquiryOpen(true)}
                onBackToFabrics={() => {
                  setActiveTab('fabrics');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}

            {activeTab === 'checkout' && (
              <CheckoutPage
                onOrderSuccess={handleOrderPlaced}
                onBackToCart={handleGoToFabrics}
                onBackToFabrics={handleGoToFabrics}
              />
            )}

            {activeTab === 'order-success' && placedOrder && (
              <OrderSuccessPage
                order={placedOrder}
                onGoToDashboard={() => setActiveTab('dashboard')}
                onGoToFabrics={handleGoToFabrics}
              />
            )}

            {activeTab === 'dashboard' && (
              <UserDashboard
                onSelectProduct={handleSelectProduct}
                onGoToFabrics={handleGoToFabrics}
                initialTab="orders"
                onGoToLogin={() => {
                  setActiveTab('login');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}

            {activeTab === 'wishlist' && (
              <UserDashboard
                onSelectProduct={handleSelectProduct}
                onGoToFabrics={handleGoToFabrics}
                initialTab="wishlist"
                onGoToLogin={() => {
                  setActiveTab('login');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}

            {activeTab === 'customizer' && (
              <MasterCustomizerStudioPage
                products={products}
                onGoToHome={() => {
                  setActiveTab('home');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onGoToCheckout={handleGoToCheckout}
                onOpenBulkInquiry={() => setBulkInquiryOpen(true)}
              />
            )}

            {activeTab === 'admin' && (
              isAdmin ? (
                <AdminDashboard
                  onProductsChange={loadData}
                  onViewProductInFrontend={(prodId) => {
                    fetchProducts().then((allProds) => {
                      setProducts(allProds);
                      const match = allProds.find((p) => p.id === prodId);
                      if (match) {
                        handleSelectProduct(match);
                      } else {
                        setActiveTab('fabrics');
                      }
                    });
                  }}
                />
              ) : (
                <div className="max-w-md mx-auto my-16 p-8 bg-white dark:bg-[#1A1C1A] text-[#0F100F] dark:text-white rounded-[32px] border border-[#ECECEC] dark:border-white/[0.08] shadow-fabriclore text-center space-y-4">
                  <div className="w-12 h-12 bg-amber-500/10 text-[#AC7900] dark:text-[#D4AF37] rounded-full flex items-center justify-center mx-auto text-xl font-bold">
                    🔒
                  </div>
                  <h2 className="text-xl font-bold font-editorial">Admin Access Restricted</h2>
                  <p className="text-xs text-[#8A8883] dark:text-gray-400">
                    You must sign in with verified Mill Administrator credentials to view the admin control center.
                  </p>
                  <button
                    onClick={() => {
                      setActiveTab('login');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="w-full bg-[#0F100F] dark:bg-white text-white dark:text-[#0F100F] font-bold py-3 rounded-full text-xs hover:opacity-90 transition shadow-md"
                  >
                    Go to Admin Sign In
                  </button>
                </div>
              )
            )}

            {activeTab === 'about' && (
              <AboutUsPage
                onGoToFabrics={handleGoToFabrics}
                onOpenBulkInquiry={() => setBulkInquiryOpen(true)}
              />
            )}

            {activeTab === 'contact' && <ContactUsPage />}

            {activeTab === 'login' && (
              <AuthPage
                onNavigate={(tab) => {
                  setActiveTab(tab);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}

            {activeTab === 'privacy' && <PrivacyPolicyPage />}

            {activeTab === 'terms' && <TermsConditionsPage />}
            </>
          </Suspense>
        )}
      </main>

      {/* Global Modals & Drawers */}
      <EntryWhatsAppModal />
      <CartDrawer onGoToCheckout={handleGoToCheckout} onGoToFabrics={handleGoToFabrics} />
      {/* Floating Buttons: Hide on mobile when on product-detail to prevent overlapping controls */}
      <div className={activeTab === 'product-detail' ? 'hidden lg:block' : 'block'}>
        <WhatsAppButton />
        <ChatBotWidget
          onNavigate={(tab) => {
            setActiveTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenBulkInquiry={() => setBulkInquiryOpen(true)}
        />
      </div>

      {/* Global Footer */}
      <Footer setActiveTab={setActiveTab} setSelectedCategory={setSelectedCategory} />

      {/* 📱 Mobile & Tablet Bottom Navigation Bar: Hide on product-detail because it has its own dedicated sticky buy bar */}
      {activeTab !== 'product-detail' && (
        <MobileBottomNav
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onGoToFabrics={handleGoToFabrics}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <ErrorBoundary>
              <MainAppContent />
            </ErrorBoundary>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

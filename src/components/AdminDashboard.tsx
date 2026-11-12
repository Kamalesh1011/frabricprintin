import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Inbox,
  Package,
  Plus,
  Trash2,
  Edit2,
  Users,
  DollarSign,
  Printer,
  Download,
  Eye,
  CheckCircle2,
  Clock,
  Layers,
  Sparkles,
  X,
  AlertCircle,
  Sliders,
  Image as ImageIcon,
  Shirt,
  Weight,
  Ruler,
  SlidersHorizontal,
  Box,
  Search,
  ExternalLink,
  RefreshCw,
  TrendingUp,
  Activity,
  ArrowUpRight,
  ShieldCheck,
  ChevronRight,
  Tag,
  Check,
  SlidersVertical,
  HelpCircle
} from 'lucide-react';
import {
  fetchAdminAnalytics,
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  fetchOrders,
  updateOrderStatus,
  fetchCategories,
  fetchCustomizerSettings,
  updateCustomizerSettings,
  addPreloadedDesign,
  deletePreloadedDesign,
  fetchInquiries,
  fetchMasterFabrics,
  createMasterFabric,
  updateMasterFabric,
  deleteMasterFabric,
  fetchMasterGsm,
  createMasterGsm,
  updateMasterGsm,
  deleteMasterGsm,
  fetchMasterSizeFormats,
  createMasterSizeFormat,
  updateMasterSizeFormat,
  deleteMasterSizeFormat,
  fetchMasterVariants,
  createMasterVariant,
  updateMasterVariant,
  deleteMasterVariant,
  createMasterCategory,
  updateMasterCategory,
  deleteMasterCategory
} from '../services/api';
import {
  Product,
  Order,
  Category,
  CategoryType,
  OrderStatus,
  AdminCustomizerSettings,
  PreloadedDesign,
  MasterFabric,
  MasterGsmWeight,
  MasterFabricSizeFormat,
  MasterFabricVariantBase
} from '../types';

import { AllProductsTable } from './admin/AllProductsTable';
import { AddProductWizard } from './admin/AddProductWizard';
import { MasterCategoriesTab } from './admin/MasterCategoriesTab';
import { MasterFabricsTab } from './admin/MasterFabricsTab';
import { MasterGsmTab } from './admin/MasterGsmTab';
import { MasterSizeFormatsTab } from './admin/MasterSizeFormatsTab';
import { MasterVariantsTab } from './admin/MasterVariantsTab';
import { OrderManagementTab } from './admin/OrderManagementTab';
import { InquiriesTab } from './admin/InquiriesTab';
import { MediaLibraryModal } from './admin/MediaLibraryModal';
import { ThreeDAssetsTab } from './admin/ThreeDAssetsTab';
import { PricingManagerTab } from './admin/PricingManagerTab';
import { MediaVaultTab } from './admin/MediaVaultTab';

interface AdminDashboardProps {
  onProductsChange?: () => void;
  onViewProductInFrontend?: (productId: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onProductsChange, onViewProductInFrontend }) => {
  const [activeAdminTab, setActiveAdminTab] = useState<
    'analytics' | 'products' | 'mockups_3d' | 'pricing' | 'orders' | 'inquiries' | 'categories' | 'vault' | 'customizer'
  >('analytics');
  const [newInquiryCount, setNewInquiryCount] = useState<number | null>(null);
  const [productsSubSection, setProductsSubSection] = useState<
    'all_products' | 'add_product' | 'categories' | 'fabrics' | 'gsm' | 'size_formats' | 'variants'
  >('all_products');

  // Master Data State
  const [masterFabrics, setMasterFabrics] = useState<MasterFabric[]>([]);
  const [masterGsm, setMasterGsm] = useState<MasterGsmWeight[]>([]);
  const [masterSizeFormats, setMasterSizeFormats] = useState<MasterFabricSizeFormat[]>([]);
  const [masterVariants, setMasterVariants] = useState<MasterFabricVariantBase[]>([]);

  // Customizer Settings State
  const [customizerSettings, setCustomizerSettings] = useState<AdminCustomizerSettings>({
    dpiWarningThreshold: 150,
    dpiHighThreshold: 300,
    enabledLayouts: { single: true, repeat_grid: true, half_drop: true, mirror_repeat: true },
    preloadedDesigns: []
  });
  const [newDesignName, setNewDesignName] = useState('');
  const [newDesignCategory, setNewDesignCategory] = useState('Floral');
  const [newDesignUrl, setNewDesignUrl] = useState('');
  const [isDesignMediaModalOpen, setIsDesignMediaModalOpen] = useState(false);
  const [newDesignWidth, setNewDesignWidth] = useState(2400);
  const [newDesignHeight, setNewDesignHeight] = useState(2400);
  const [settingsSavedAlert, setSettingsSavedAlert] = useState(false);

  // Analytics Data
  const [analytics, setAnalytics] = useState<any>(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);

  // Products Data
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Orders State & Design Modal
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedDesignOrder, setSelectedDesignOrder] = useState<Order | null>(null);

  // Global Quick Search & Command Filter
  const [globalSearch, setGlobalSearch] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Executive In-App Toast Notification
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Load Initial Admin Data
  const reloadAdminData = async (showFeedback = false) => {
    setIsRefreshing(true);
    setLoadingAnalytics(true);
    const [
      analyticsData,
      productsData,
      categoriesData,
      ordersData,
      settingsData,
      fabricsData,
      gsmData,
      sizeFormatsData,
      variantsData
    ] = await Promise.all([
      fetchAdminAnalytics(),
      fetchProducts(),
      fetchCategories(),
      fetchOrders(),
      fetchCustomizerSettings(),
      fetchMasterFabrics(),
      fetchMasterGsm(),
      fetchMasterSizeFormats(),
      fetchMasterVariants()
    ]);
    setAnalytics(analyticsData);
    setProducts(productsData);
    setCategories(categoriesData);
    setOrders(ordersData);
    setCustomizerSettings(settingsData);
    setMasterFabrics(fabricsData);
    setMasterGsm(gsmData);
    setMasterSizeFormats(sizeFormatsData);
    setMasterVariants(variantsData);
    setLoadingAnalytics(false);
    setIsRefreshing(false);
    if (showFeedback) {
      showToast('Live inventory and order data synchronized with SQLite', 'success');
    }
    if (onProductsChange) {
      onProductsChange();
    }
  };

  useEffect(() => {
    reloadAdminData();
    fetchInquiries().then((list) => setNewInquiryCount(list.filter((i) => i.status === 'New').length));
  }, []);

  const handleSaveProductFromWizard = async (payload: Partial<Product>) => {
    let saved: Product;
    if (editingProduct) {
      saved = await updateProduct(editingProduct.id, payload);
      showToast(`Updated product "${saved.name}" successfully`, 'success');
    } else {
      saved = await createProduct(payload);
      showToast(`Created new product "${saved.name}" successfully`, 'success');
    }
    setEditingProduct(null);
    await reloadAdminData();
    return saved;
  };

  const handleEditProductInWizard = (prod: Product) => {
    setEditingProduct(prod);
    setActiveAdminTab('products');
    setProductsSubSection('add_product');
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      await deleteProduct(id);
      showToast('Product removed from catalog', 'info');
    } catch (err: any) {
      showToast(err?.message || 'Could not delete product.', 'error');
    }
    await reloadAdminData();
  };

  const handleInlineUpdateProduct = async (id: string, updates: Partial<Product>) => {
    try {
      await updateProduct(id, updates);
      showToast('Product details updated', 'success');
      await reloadAdminData();
    } catch (err: any) {
      showToast(err?.message || 'Could not update product.', 'error');
    }
  };

  const handleBatchAdjustPrices = async (percent: number, categoryFilter?: string) => {
    const factor = 1 + percent / 100;
    const targetProducts = categoryFilter
      ? products.filter((p) => p.category.toLowerCase() === categoryFilter.toLowerCase())
      : products;

    await Promise.all(
      targetProducts.map((p) =>
        updateProduct(p.id, {
          price_per_meter: Math.max(1, Math.round(p.price_per_meter * factor * 100) / 100)
        })
      )
    );
    showToast(`Adjusted prices for ${targetProducts.length} items by ${percent > 0 ? '+' : ''}${percent}%`, 'success');
    await reloadAdminData();
  };

  const runAdminAction = async (action: () => Promise<unknown>, failMsg: string, successMsg?: string): Promise<boolean> => {
    try {
      await action();
      if (successMsg) showToast(successMsg, 'success');
      return true;
    } catch (err: any) {
      showToast(err?.message || failMsg, 'error');
      return false;
    }
  };

  // Master Categories handlers
  const handleAddMasterCategory = async (cat: Partial<Category>) => {
    await createMasterCategory(cat);
    await reloadAdminData();
  };
  const handleUpdateMasterCategory = async (id: string, cat: Partial<Category>) => {
    await updateMasterCategory(id, cat);
    await reloadAdminData();
  };
  const handleDeleteMasterCategory = async (id: string) => {
    await deleteMasterCategory(id);
    await reloadAdminData();
  };

  // Master Fabrics handlers
  const handleAddMasterFabric = async (fab: Omit<MasterFabric, 'id'>) => {
    await createMasterFabric(fab);
    await reloadAdminData();
  };
  const handleUpdateMasterFabric = async (id: string, fab: Partial<MasterFabric>) => {
    await updateMasterFabric(id, fab);
    await reloadAdminData();
  };
  const handleDeleteMasterFabric = async (id: string) => {
    await deleteMasterFabric(id);
    await reloadAdminData();
  };

  // Master GSM handlers
  const handleAddMasterGsm = async (gsm: Omit<MasterGsmWeight, 'id'>) => {
    await createMasterGsm(gsm);
    await reloadAdminData();
  };
  const handleUpdateMasterGsm = async (id: string, gsm: Partial<MasterGsmWeight>) => {
    await updateMasterGsm(id, gsm);
    await reloadAdminData();
  };
  const handleDeleteMasterGsm = async (id: string) => {
    await deleteMasterGsm(id);
    await reloadAdminData();
  };

  // Master Size Format handlers
  const handleAddMasterSizeFormat = async (fmt: Omit<MasterFabricSizeFormat, 'id'>) => {
    await createMasterSizeFormat(fmt);
    await reloadAdminData();
  };
  const handleUpdateMasterSizeFormat = async (id: string, fmt: Partial<MasterFabricSizeFormat>) => {
    await updateMasterSizeFormat(id, fmt);
    await reloadAdminData();
  };
  const handleDeleteMasterSizeFormat = async (id: string) => {
    await deleteMasterSizeFormat(id);
    await reloadAdminData();
  };

  // Master Variant handlers
  const handleAddMasterVariant = async (v: Omit<MasterFabricVariantBase, 'id'>) => {
    await createMasterVariant(v);
    await reloadAdminData();
  };
  const handleUpdateMasterVariant = async (id: string, v: Partial<MasterFabricVariantBase>) => {
    await updateMasterVariant(id, v);
    await reloadAdminData();
  };
  const handleDeleteMasterVariant = async (id: string) => {
    await deleteMasterVariant(id);
    await reloadAdminData();
  };

  const handleUpdateOrderStatus = async (orderId: string, status: OrderStatus) => {
    const tracking = `TEX-EXP-${Math.floor(10000 + Math.random() * 90000)}`;
    await updateOrderStatus(orderId, status, tracking);
    await reloadAdminData();
  };

  return (
    <div className="bg-[#0A0D14] text-slate-100 min-h-screen py-6 sm:py-8 font-sans selection:bg-amber-500 selection:text-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        
        {/* EXECUTIVE ADMIN HEADER BANNER */}
        <header className="bg-gradient-to-r from-slate-950 via-[#0E131F] to-[#12192B] p-6 sm:p-7 rounded-3xl border border-slate-800/90 shadow-2xl relative overflow-hidden">
          {/* Subtle glow accent */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
            {/* Left: Branding & Status */}
            <div className="flex items-center space-x-3.5">
              <div className="p-3 bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 rounded-2xl font-black shadow-lg shadow-amber-500/20 flex items-center justify-center shrink-0">
                <Printer className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-xl sm:text-2xl font-black font-editorial tracking-tight text-white">
                    Fabric Print Mill Executive OS
                  </h1>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse mr-1.5" />
                    SQLite Online
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1 max-w-xl">
                  Centralized command console for 3D garment mockups, inventory catalog, dynamic wholesale rate cards & order fulfillment.
                </p>
              </div>
            </div>

            {/* Right: Quick Action Controls */}
            <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
              {/* Storefront View */}
              {onViewProductInFrontend && (
                <button
                  type="button"
                  onClick={() => onViewProductInFrontend('')}
                  className="px-3.5 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 text-xs font-bold transition flex items-center space-x-1.5 shadow-xs"
                  title="Preview Frontend Storefront"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  <span>Live Store</span>
                </button>
              )}

              {/* Sync Refresh Button */}
              <button
                type="button"
                onClick={() => reloadAdminData(true)}
                disabled={isRefreshing}
                className="px-3.5 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 text-xs font-bold transition flex items-center space-x-1.5 shadow-xs disabled:opacity-50"
                title="Synchronize Database"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>{isRefreshing ? 'Syncing...' : 'Sync Data'}</span>
              </button>

              {/* Add New Product CTA */}
              <button
                type="button"
                onClick={() => {
                  setEditingProduct(null);
                  setActiveAdminTab('products');
                  setProductsSubSection('add_product');
                }}
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black py-2.5 px-4 rounded-xl text-xs flex items-center space-x-2 transition shadow-lg shadow-amber-500/20 active:scale-[0.98] shrink-0"
                id="admin-add-product-button"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>+ Add Product</span>
              </button>
            </div>
          </div>

          {/* Quick Global Search Bar */}
          <div className="mt-5 pt-4 border-t border-slate-800/70 relative">
            <div className="relative max-w-lg">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                placeholder="Quick jump: Search catalog products, orders, categories or fabrics..."
                className="w-full pl-10 pr-4 py-2 bg-slate-900/90 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition"
              />
              {globalSearch && (
                <button
                  type="button"
                  onClick={() => setGlobalSearch('')}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Quick Search Floating Results */}
            {isSearchFocused && globalSearch.trim().length > 1 && (
              <div
                className="absolute left-0 right-0 sm:right-auto sm:w-[480px] mt-2 bg-slate-900 border border-slate-700 rounded-2xl p-3 shadow-2xl z-50 space-y-2 animate-in fade-in"
                onMouseDown={(e) => e.preventDefault()}
              >
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 px-2 pb-1 border-b border-slate-800">
                  <span>SEARCH RESULTS</span>
                  <button
                    type="button"
                    onClick={() => setIsSearchFocused(false)}
                    className="text-slate-500 hover:text-slate-300 text-xs"
                  >
                    Close
                  </button>
                </div>

                {/* Products matching */}
                {products.filter(p => p.name.toLowerCase().includes(globalSearch.toLowerCase()) || p.category.toLowerCase().includes(globalSearch.toLowerCase())).slice(0, 4).map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      handleEditProductInWizard(p);
                      setIsSearchFocused(false);
                      setGlobalSearch('');
                    }}
                    className="w-full text-left p-2 rounded-xl hover:bg-slate-800 flex items-center justify-between text-xs transition group"
                  >
                    <div className="flex items-center space-x-2.5">
                      <div className="w-8 h-8 rounded-lg overflow-hidden bg-slate-950 shrink-0 border border-slate-700">
                        <img src={p.images[0]} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="font-bold text-white group-hover:text-amber-400 transition">{p.name}</div>
                        <div className="text-[10px] text-slate-400">{p.category} • ₹{p.price_per_meter}/m</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded">Edit</span>
                  </button>
                ))}

                {/* Orders matching */}
                {orders.filter(o => o.id.toLowerCase().includes(globalSearch.toLowerCase()) || o.customerName.toLowerCase().includes(globalSearch.toLowerCase())).slice(0, 2).map((o) => (
                  <button
                    key={o.id}
                    type="button"
                    onClick={() => {
                      setActiveAdminTab('orders');
                      setIsSearchFocused(false);
                      setGlobalSearch('');
                    }}
                    className="w-full text-left p-2 rounded-xl hover:bg-slate-800 flex items-center justify-between text-xs transition group"
                  >
                    <div className="flex items-center space-x-2.5">
                      <Clock className="w-4 h-4 text-blue-400" />
                      <div>
                        <div className="font-bold text-white">Order #{o.id} - {o.customerName}</div>
                        <div className="text-[10px] text-slate-400">₹{o.totalAmount} • {o.orderStatus}</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">View Order</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </header>

        {/* EXECUTIVE SEGMENTED NAVIGATION TABS */}
        <nav className="bg-slate-950/80 backdrop-blur-md p-2 rounded-2xl border border-slate-800/80 shadow-lg">
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {[
              { id: 'analytics', label: 'Analytics & KPIs', icon: BarChart3 },
              { id: 'products', label: `Products`, count: products.length, icon: Package },
              { id: 'mockups_3d', label: '3D Studio & Mockups', icon: Box, highlight: '3D Live' },
              { id: 'pricing', label: 'Pricing & Rate Cards', icon: DollarSign, highlight: 'Wholesale' },
              { id: 'orders', label: `Order Queue`, count: orders.length, icon: Clock },
              { id: 'inquiries', label: 'Inquiries', count: newInquiryCount || undefined, isNew: !!newInquiryCount, icon: Inbox },
              { id: 'categories', label: `Categories Master`, count: categories.length, icon: Layers },
              { id: 'vault', label: 'Media Vault', icon: ImageIcon, highlight: 'Assets' },
              { id: 'customizer', label: 'Customizer Controls', icon: Sliders }
            ].map((tab) => {
              const Icon = tab.icon;
              const isTabActive = activeAdminTab === tab.id || (tab.id === 'categories' && activeAdminTab === 'products' && productsSubSection === 'categories');
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    if (tab.id === 'categories') {
                      setActiveAdminTab('products');
                      setProductsSubSection('categories');
                    } else {
                      setActiveAdminTab(tab.id as any);
                    }
                  }}
                  className={`flex items-center space-x-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition shrink-0 relative ${
                    isTabActive
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black shadow-md shadow-amber-500/20'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent hover:border-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{tab.label}</span>

                  {/* Count Badge */}
                  {tab.count !== undefined && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                        isTabActive
                          ? 'bg-slate-950 text-amber-400'
                          : (tab as any).isNew
                          ? 'bg-red-500 text-white animate-pulse'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}

                  {/* Highlight pill */}
                  {(tab as any).highlight && !isTabActive && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded-full font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                      {(tab as any).highlight}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        {/* TAB 1: EXECUTIVE ANALYTICS DASHBOARD */}
        {activeAdminTab === 'analytics' && analytics && (
          <div className="space-y-6 animate-in fade-in">
            {/* 4 Rich KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              
              {/* Metric 1: Total Revenue */}
              <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-5 rounded-2xl border border-slate-800 shadow-md space-y-2.5 hover:border-slate-700 transition group relative overflow-hidden">
                <div className="flex justify-between items-center text-slate-400 text-xs font-bold tracking-wider">
                  <span>TOTAL SALES REVENUE</span>
                  <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
                    <DollarSign className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white font-serif tracking-tight">
                  ₹{analytics.totalRevenue ? analytics.totalRevenue.toLocaleString() : '0.00'}
                </div>
                <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-800/80">
                  <span className="text-emerald-400 font-bold flex items-center space-x-1">
                    <TrendingUp className="w-3.5 h-3.5 inline mr-1" />
                    +18.4% MoM
                  </span>
                  <span className="text-slate-400">
                    Avg Order: ₹{(analytics.totalRevenue / Math.max(1, analytics.totalOrders)).toFixed(0)}
                  </span>
                </div>
              </div>

              {/* Metric 2: Total Orders */}
              <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-5 rounded-2xl border border-slate-800 shadow-md space-y-2.5 hover:border-slate-700 transition group relative overflow-hidden">
                <div className="flex justify-between items-center text-slate-400 text-xs font-bold tracking-wider">
                  <span>PRODUCTION QUEUE</span>
                  <div className="p-2 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20">
                    <Clock className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white font-serif tracking-tight">
                  {analytics.totalOrders} Orders
                </div>
                <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-800/80">
                  <span className="text-blue-400 font-bold">
                    {orders.filter(o => o.orderStatus === 'Pending' || o.orderStatus === 'Processing').length} Active in Mill
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveAdminTab('orders')}
                    className="text-amber-400 hover:underline font-bold"
                  >
                    View Queue →
                  </button>
                </div>
              </div>

              {/* Metric 3: Total Customers */}
              <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-5 rounded-2xl border border-slate-800 shadow-md space-y-2.5 hover:border-slate-700 transition group relative overflow-hidden">
                <div className="flex justify-between items-center text-slate-400 text-xs font-bold tracking-wider">
                  <span>REGISTERED BUYERS</span>
                  <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
                    <Users className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white font-serif tracking-tight">
                  {analytics.totalCustomers} Accounts
                </div>
                <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-800/80">
                  <span className="text-amber-400 font-bold">Designers & Brands</span>
                  <span className="text-slate-400">JWT Verified</span>
                </div>
              </div>

              {/* Metric 4: Fabric & Garment Inventory */}
              <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-5 rounded-2xl border border-slate-800 shadow-md space-y-2.5 hover:border-slate-700 transition group relative overflow-hidden">
                <div className="flex justify-between items-center text-slate-400 text-xs font-bold tracking-wider">
                  <span>CATALOG QUALITIES</span>
                  <div className="p-2 bg-purple-500/10 text-purple-400 rounded-xl border border-purple-500/20">
                    <Package className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white font-serif tracking-tight">
                  {products.length} Products
                </div>
                <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-800/80">
                  <span className="text-purple-400 font-bold">{categories.length} Fabric Weaves</span>
                  <button
                    type="button"
                    onClick={() => setActiveAdminTab('products')}
                    className="text-amber-400 hover:underline font-bold"
                  >
                    Catalog →
                  </button>
                </div>
              </div>

            </div>

            {/* Quick Operations Command Hub */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              <button
                type="button"
                onClick={() => setActiveAdminTab('mockups_3d')}
                className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/40 text-left transition group shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <Box className="w-5 h-5 text-amber-400 group-hover:scale-110 transition" />
                  <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition" />
                </div>
                <div className="font-bold text-white text-xs mt-3">3D Garment Studio</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Inspect & replace front/back 3D textures</div>
              </button>

              <button
                type="button"
                onClick={() => setActiveAdminTab('pricing')}
                className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/40 text-left transition group shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <DollarSign className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition" />
                  <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition" />
                </div>
                <div className="font-bold text-white text-xs mt-3">Dynamic Pricing Engine</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Tune wholesale discount tiers & rate cards</div>
              </button>

              <button
                type="button"
                onClick={() => setActiveAdminTab('orders')}
                className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/40 text-left transition group shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <Clock className="w-5 h-5 text-blue-400 group-hover:scale-110 transition" />
                  <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition" />
                </div>
                <div className="font-bold text-white text-xs mt-3">Order Fulfillment</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Update status, tracking & print approvals</div>
              </button>

              <button
                type="button"
                onClick={() => setActiveAdminTab('vault')}
                className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/40 text-left transition group shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <ImageIcon className="w-5 h-5 text-purple-400 group-hover:scale-110 transition" />
                  <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-purple-400 transition" />
                </div>
                <div className="font-bold text-white text-xs mt-3">Central Media Vault</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Universal image replacement & asset links</div>
              </button>
            </div>

            {/* Sales Volume by Category Breakdown with Visual Progress Bars */}
            <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-4 shadow-md">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 className="font-bold text-white text-sm uppercase tracking-wider">
                    Sales Volume by Fabric Quality
                  </h3>
                  <p className="text-xs text-slate-400">Distribution of orders across fabric categories</p>
                </div>
                <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-lg border border-amber-500/20">
                  {categories.length} Active Categories
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
                {analytics.salesByCategory?.map((item: any) => {
                  const maxSales = Math.max(...analytics.salesByCategory.map((s: any) => s.sales || 1));
                  const percentage = Math.min(100, Math.round((item.sales / maxSales) * 100));
                  return (
                    <div key={item.category} className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-300 font-bold">{item.category}</span>
                        <span className="font-mono font-extrabold text-amber-400">₹{item.sales.toFixed(2)}</span>
                      </div>
                      
                      {/* Visual progress bar */}
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-amber-500 to-amber-400 h-full rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <div className="text-[10px] text-slate-500 flex justify-between">
                        <span>Relative Volume</span>
                        <span>{percentage}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PRODUCTS MODULE (WOOCOMMERCE STRUCTURE) */}
        {activeAdminTab === 'products' && (
          <div className="space-y-6">
            {/* Products Sub-Sections Navigation Pills */}
            <div className="bg-slate-800 p-2.5 rounded-2xl border border-slate-700 flex items-center space-x-1.5 overflow-x-auto">
              {[
                { id: 'all_products', label: `1. All Products (${products.length})`, icon: Package },
                { id: 'add_product', label: `2. Add New Product`, icon: Plus },
                { id: 'categories', label: `3. Categories (${categories.length})`, icon: Layers },
                { id: 'fabrics', label: `4. Fabrics (${masterFabrics.length})`, icon: Shirt },
                { id: 'gsm', label: `5. GSM Weights (${masterGsm.length})`, icon: Weight },
                { id: 'size_formats', label: `6. Size Formats (${masterSizeFormats.length})`, icon: Ruler },
                { id: 'variants', label: `7. Variant Base (${masterVariants.length})`, icon: SlidersHorizontal }
              ].map((sub) => {
                const SubIcon = sub.icon;
                const isSubActive = productsSubSection === sub.id;
                return (
                  <button
                    key={sub.id}
                    onClick={() => {
                      if (sub.id === 'add_product') {
                        setEditingProduct(null);
                      }
                      setProductsSubSection(sub.id as any);
                    }}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition shrink-0 ${
                      isSubActive
                        ? 'bg-amber-500 text-slate-950 font-extrabold shadow-sm'
                        : 'text-slate-300 hover:bg-slate-700/60'
                    }`}
                  >
                    <SubIcon className="w-3.5 h-3.5" />
                    <span>{sub.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Sub-Section 1: All Products Table */}
            {productsSubSection === 'all_products' && (
              <AllProductsTable
                products={products}
                fabrics={masterFabrics}
                gsmWeights={masterGsm}
                onAddNewClick={() => {
                  setEditingProduct(null);
                  setProductsSubSection('add_product');
                }}
                onEditProduct={handleEditProductInWizard}
                onDeleteProduct={handleDeleteProduct}
                onUpdateProduct={handleInlineUpdateProduct}
              />
            )}

            {/* Sub-Section 2: Add / Edit Product Wizard */}
            {productsSubSection === 'add_product' && (
              <AddProductWizard
                categories={categories}
                fabrics={masterFabrics}
                gsmWeights={masterGsm}
                sizeFormats={masterSizeFormats}
                variantBases={masterVariants}
                editingProduct={editingProduct}
                onSaveProduct={handleSaveProductFromWizard}
                onViewProductInFrontend={onViewProductInFrontend}
                onCancel={() => setProductsSubSection('all_products')}
              />
            )}

            {/* Sub-Section 3: Categories Master Data */}
            {productsSubSection === 'categories' && (
              <MasterCategoriesTab
                categories={categories}
                onAddCategory={handleAddMasterCategory}
                onUpdateCategory={handleUpdateMasterCategory}
                onDeleteCategory={handleDeleteMasterCategory}
              />
            )}

            {/* Sub-Section 4: Fabrics Master Data */}
            {productsSubSection === 'fabrics' && (
              <MasterFabricsTab
                fabrics={masterFabrics}
                categories={categories}
                onAddFabric={handleAddMasterFabric}
                onUpdateFabric={handleUpdateMasterFabric}
                onDeleteFabric={handleDeleteMasterFabric}
              />
            )}

            {/* Sub-Section 5: GSM Weights Master Data */}
            {productsSubSection === 'gsm' && (
              <MasterGsmTab
                gsmWeights={masterGsm}
                onAddGsm={handleAddMasterGsm}
                onUpdateGsm={handleUpdateMasterGsm}
                onDeleteGsm={handleDeleteMasterGsm}
              />
            )}

            {/* Sub-Section 6: Fabric Size Formats Master Data */}
            {productsSubSection === 'size_formats' && (
              <MasterSizeFormatsTab
                sizeFormats={masterSizeFormats}
                onAddSizeFormat={handleAddMasterSizeFormat}
                onUpdateSizeFormat={handleUpdateMasterSizeFormat}
                onDeleteSizeFormat={handleDeleteMasterSizeFormat}
              />
            )}

            {/* Sub-Section 7: Fabric Variant Base Master Data */}
            {productsSubSection === 'variants' && (
              <MasterVariantsTab
                variantBases={masterVariants}
                onAddVariant={handleAddMasterVariant}
                onUpdateVariant={handleUpdateMasterVariant}
                onDeleteVariant={handleDeleteMasterVariant}
              />
            )}
          </div>
        )}

        {/* TAB 2b: 3D GARMENTS & MOCKUP ASSETS */}
        {activeAdminTab === 'mockups_3d' && (
          <ThreeDAssetsTab />
        )}

        {/* TAB 2c: DYNAMIC PRICING & RATE CARDS */}
        {activeAdminTab === 'pricing' && (
          <PricingManagerTab
            products={products}
            onUpdateProductPrice={async (id, p, s) => {
              await handleInlineUpdateProduct(id, {
                price_per_meter: p,
                print_surcharge_per_meter: s
              });
            }}
            onBatchAdjustPrices={handleBatchAdjustPrices}
          />
        )}

        {/* TAB 3: ORDERS QUEUE & ORDER FULFILLMENT MANAGEMENT */}
        {activeAdminTab === 'orders' && (
          <OrderManagementTab
            orders={orders}
            onUpdateOrderStatus={async (orderId, status, tracking) => {
              await updateOrderStatus(orderId, status, tracking);
              await reloadAdminData();
            }}
          />
        )}

        {/* TAB 3b: CUSTOMER INQUIRIES */}
        {activeAdminTab === 'inquiries' && <InquiriesTab onCountChange={setNewInquiryCount} />}

        {/* TAB 4: CATEGORIES */}
        {activeAdminTab === 'categories' && (
          <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 space-y-4">
            <h3 className="font-bold text-white text-base">Active Fabric Categories</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              {categories.map((cat) => (
                <div key={cat.id} className="bg-slate-900 p-4 rounded-xl border border-slate-700 space-y-2">
                  <img src={cat.image} alt={cat.name} className="w-full h-24 object-cover rounded-lg" />
                  <h4 className="font-bold text-white text-sm">{cat.name}</h4>
                  <p className="text-slate-400 text-[11px] line-clamp-2">{cat.description}</p>
                  <span className="bg-blue-900 text-blue-200 text-[10px] font-bold px-2 py-0.5 rounded inline-block">
                    {cat.itemCount} Items
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4b: MEDIA VAULT & ASSET REPLACEMENT */}
        {activeAdminTab === 'vault' && (
          <MediaVaultTab />
        )}

        {/* TAB 5: CUSTOMIZER & ARTWORK CONTROLS */}
        {activeAdminTab === 'customizer' && (
          <div className="space-y-8">
            {settingsSavedAlert && (
              <div className="bg-emerald-900/90 text-emerald-200 border border-emerald-700 p-4 rounded-2xl text-xs font-bold flex items-center justify-between">
                <span>✓ Customizer configuration and layout settings updated successfully!</span>
                <button onClick={() => setSettingsSavedAlert(false)}><X className="w-4 h-4" /></button>
              </div>
            )}

            {/* DPI & Layout Options Config */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* DPI Settings */}
              <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                  <div className="flex items-center space-x-2">
                    <Sliders className="w-5 h-5 text-amber-400" />
                    <h3 className="font-bold text-white text-sm font-serif">DPI Threshold Settings</h3>
                  </div>
                </div>

                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">
                      Low Quality Warning Threshold (DPI)
                    </label>
                    <input
                      type="number"
                      value={customizerSettings.dpiWarningThreshold}
                      onChange={(e) => setCustomizerSettings({
                        ...customizerSettings,
                        dpiWarningThreshold: Number(e.target.value) || 150
                      })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white font-bold"
                    />
                    <p className="text-[10px] text-slate-500 mt-1">
                      Designs rendered below this DPI trigger an amber low-quality warning alert.
                    </p>
                  </div>

                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">
                      High Quality Mill Threshold (DPI)
                    </label>
                    <input
                      type="number"
                      value={customizerSettings.dpiHighThreshold}
                      onChange={(e) => setCustomizerSettings({
                        ...customizerSettings,
                        dpiHighThreshold: Number(e.target.value) || 300
                      })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white font-bold"
                    />
                    <p className="text-[10px] text-slate-500 mt-1">
                      Designs meeting or exceeding this DPI earn a green 300+ DPI Mill Grade guarantee badge.
                    </p>
                  </div>

                  <button
                    onClick={async () => {
                      if (!(await runAdminAction(() => updateCustomizerSettings(customizerSettings), 'Could not save settings.'))) return;
                      setSettingsSavedAlert(true);
                      setTimeout(() => setSettingsSavedAlert(false), 3000);
                    }}
                    className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2.5 rounded-xl transition shadow-md"
                  >
                    Save DPI Settings
                  </button>
                </div>
              </div>

              {/* Layout Enable/Disable Toggles */}
              <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                  <div className="flex items-center space-x-2">
                    <Layers className="w-5 h-5 text-blue-400" />
                    <h3 className="font-bold text-white text-sm font-serif">Pattern Arrangement Layouts</h3>
                  </div>
                </div>

                <div className="space-y-3 text-xs">
                  {[
                    { key: 'single', label: 'Single Center', desc: 'Single centered motif on fabric sheet' },
                    { key: 'repeat_grid', label: 'Repeat Grid', desc: 'Continuous seamless grid repeat' },
                    { key: 'half_drop', label: 'Half Drop', desc: '50% staggered offset pattern' },
                    { key: 'mirror_repeat', label: 'Mirror Repeat', desc: 'Alternating flipped horizontal & vertical tiles' }
                  ].map((layout) => (
                    <div key={layout.key} className="flex items-center justify-between bg-slate-900 p-3 rounded-2xl border border-slate-700">
                      <div>
                        <div className="font-bold text-white">{layout.label}</div>
                        <div className="text-[10px] text-slate-400">{layout.desc}</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={(customizerSettings.enabledLayouts as any)[layout.key]}
                        onChange={async (e) => {
                          const updated = {
                            ...customizerSettings,
                            enabledLayouts: {
                              ...customizerSettings.enabledLayouts,
                              [layout.key]: e.target.checked
                            }
                          };
                          setCustomizerSettings(updated);
                          await runAdminAction(() => updateCustomizerSettings(updated), 'Could not save layout setting.');
                        }}
                        className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
                      />
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* PRELOADED DESIGNS CATALOG MANAGEMENT */}
            <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                <div className="flex items-center space-x-2">
                  <ImageIcon className="w-5 h-5 text-amber-400" />
                  <h3 className="font-bold text-white text-base font-serif">Preloaded Artwork Gallery ({customizerSettings.preloadedDesigns.length})</h3>
                </div>
              </div>

              {/* Add New Preloaded Design Form */}
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!newDesignName || !newDesignUrl) return;
                  let added: PreloadedDesign;
                  try {
                    added = await addPreloadedDesign({
                      name: newDesignName,
                      category: newDesignCategory,
                      imageUrl: newDesignUrl,
                      widthPx: newDesignWidth,
                      heightPx: newDesignHeight,
                      active: true
                    });
                  } catch (err: any) {
                    window.alert(err?.message || 'Could not add design.');
                    return;
                  }
                  setCustomizerSettings({
                    ...customizerSettings,
                    preloadedDesigns: [added, ...customizerSettings.preloadedDesigns]
                  });
                  setNewDesignName('');
                  setNewDesignUrl('');
                }}
                className="bg-slate-900 p-5 rounded-2xl border border-slate-700 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs"
              >
                <div className="sm:col-span-3 font-bold text-amber-400 text-xs">
                  + Add New Preloaded Motif Artwork
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Motif Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Royal Jaipur Block Print"
                    value={newDesignName}
                    onChange={(e) => setNewDesignName(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Category</label>
                  <select
                    value={newDesignCategory}
                    onChange={(e) => setNewDesignCategory(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-semibold"
                  >
                    {['Floral', 'Traditional Ethnic', 'Geometric', 'Nature', 'Abstract'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-slate-400 mb-1 font-semibold">Motif Artwork Image *</label>
                  <div className="bg-slate-800 p-3 rounded-2xl border border-slate-700 space-y-3">
                    {newDesignUrl ? (
                      <div className="relative rounded-xl overflow-hidden border border-slate-700 bg-slate-950 group h-32 max-w-xs">
                        <img src={newDesignUrl} alt="Motif Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                          <button
                            type="button"
                            onClick={() => setIsDesignMediaModalOpen(true)}
                            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-3 py-1.5 rounded-lg transition shadow-md flex items-center space-x-1"
                          >
                            <ImageIcon className="w-3.5 h-3.5" />
                            <span>Change Artwork</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-slate-700 rounded-xl p-4 text-center max-w-xs">
                        <ImageIcon className="w-8 h-8 text-slate-500 mx-auto mb-1" />
                        <p className="text-slate-400 text-[11px]">No motif artwork selected</p>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => setIsDesignMediaModalOpen(true)}
                      className="bg-slate-700 hover:bg-slate-600 text-amber-400 font-bold py-2 px-4 rounded-xl text-xs transition flex items-center space-x-2 border border-slate-600"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Select / Upload Artwork From Media Library</span>
                    </button>
                  </div>
                </div>

                <div className="sm:col-span-3 flex justify-end">
                  <button
                    type="submit"
                    className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl transition shadow-md flex items-center space-x-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Publish Motif To Customizer</span>
                  </button>
                </div>
              </form>

              {/* Existing Designs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                {customizerSettings.preloadedDesigns.map((d) => (
                  <div key={d.id} className="bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden flex flex-col group relative">
                    <div className="aspect-square w-full bg-slate-950 overflow-hidden relative">
                      <img src={d.imageUrl} alt={d.name} className="w-full h-full object-cover group-hover:scale-105 transition" />
                      <button
                        onClick={async () => {
                          if (confirm(`Remove "${d.name}" from preloaded designs?`)) {
                            if (!(await runAdminAction(() => deletePreloadedDesign(d.id), 'Could not remove design.'))) return;
                            setCustomizerSettings({
                              ...customizerSettings,
                              preloadedDesigns: customizerSettings.preloadedDesigns.filter(x => x.id !== d.id)
                            });
                          }
                        }}
                        className="absolute top-2 right-2 p-1.5 bg-red-600/90 text-white rounded-lg hover:bg-red-600 transition"
                        title="Delete Motif"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="p-3 text-xs space-y-0.5">
                      <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">{d.category}</span>
                      <h4 className="font-bold text-white truncate text-[11px]">{d.name}</h4>
                      <p className="text-[10px] text-slate-400">{d.widthPx || 2400}x{d.heightPx || 2400}px</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}
      </div>

      {/* Preloaded Design Motif Media Library Modal */}
      <MediaLibraryModal
        isOpen={isDesignMediaModalOpen}
        onClose={() => setIsDesignMediaModalOpen(false)}
        singleSelect={true}
        title="Customizer Motif Artwork Selection"
        initialSelectedUrls={newDesignUrl ? [newDesignUrl] : []}
        onSelectImages={(urls) => {
          if (urls.length > 0) {
            setNewDesignUrl(urls[0]);
          }
        }}
      />

      {/* Modern Floating Executive Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div
            className={`flex items-center space-x-3 px-4 py-3 rounded-2xl shadow-2xl border text-xs font-bold backdrop-blur-md ${
              toast.type === 'error'
                ? 'bg-red-950/95 border-red-800 text-red-200'
                : toast.type === 'info'
                ? 'bg-blue-950/95 border-blue-800 text-blue-200'
                : 'bg-emerald-950/95 border-emerald-800 text-emerald-200'
            }`}
          >
            {toast.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            ) : toast.type === 'info' ? (
              <Sparkles className="w-4 h-4 text-blue-400 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            )}
            <span>{toast.message}</span>
            <button
              type="button"
              onClick={() => setToast(null)}
              className="ml-2 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

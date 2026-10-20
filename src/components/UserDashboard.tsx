import React, { useState, useEffect } from 'react';
import { User as UserIcon, Package, MapPin, Heart, ShieldCheck, Printer, Clock, Sparkles, ChevronRight, CheckCircle2, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { fetchOrders } from '../services/api';
import { Order, Product } from '../types';
import { FabricCard } from './FabricCard';

interface UserDashboardProps {
  onSelectProduct: (product: Product) => void;
  onGoToFabrics: () => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({ onSelectProduct, onGoToFabrics }) => {
  const { currentUser, isAdmin, toggleAdminMode, logout } = useAuth();
  const { wishlist } = useWishlist();

  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'addresses' | 'wishlist'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    async function loadUserOrders() {
      if (currentUser) {
        setLoadingOrders(true);
        const data = await fetchOrders(currentUser.id);
        setOrders(data);
        setLoadingOrders(false);
      }
    }
    loadUserOrders();
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white dark:bg-[#1A1C1A] text-[#0F100F] dark:text-white rounded-[32px] border border-[#ECECEC] dark:border-white/[0.08] shadow-fabriclore text-center space-y-4">
        <UserIcon className="w-12 h-12 text-[#AC7900] mx-auto" />
        <h2 className="text-xl font-bold font-editorial">Welcome to Fabric Print</h2>
        <p className="text-xs text-[#8A8883] dark:text-gray-400">Sign in to track custom fabric printing orders.</p>
        <button
          onClick={onGoToFabrics}
          className="w-full bg-[#0F100F] dark:bg-white text-white dark:text-[#0F100F] font-bold py-3 rounded-full text-xs transition"
        >
          Explore Fabrics
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 text-[#0F100F] dark:text-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* User Greeting Header */}
        <div className="bg-[#0F100F] text-white rounded-[32px] p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-white/[0.1] rounded-full flex items-center justify-center font-bold text-xl text-[#D4AF37] border border-white/20">
              {currentUser.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl sm:text-2xl font-bold font-editorial">{currentUser.name}</h1>
                <span className="bg-[#AC7900] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                  Verified Buyer
                </span>
              </div>
              <p className="text-xs text-gray-300 mt-0.5">{currentUser.email} • {currentUser.phone || 'No phone set'}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={toggleAdminMode}
              className="bg-[#AC7900] text-white font-bold px-4 py-2 rounded-full text-xs hover:bg-[#c28900] transition flex items-center space-x-1.5 shadow-sm"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{isAdmin ? 'Customer View' : 'Admin Panel'}</span>
            </button>
            <button
              onClick={logout}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white/80 transition"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Dashboard Tabs & Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Sidebar Nav */}
          <div className="lg:col-span-3 bg-white dark:bg-[#1A1C1A] rounded-[28px] p-4 border border-[#ECECEC] dark:border-white/[0.08] shadow-fabriclore space-y-1">
            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full text-left px-4 py-2.5 rounded-full text-xs font-semibold flex items-center justify-between transition ${
                activeTab === 'orders'
                  ? 'bg-[#0F100F] dark:bg-white text-white dark:text-[#0F100F]'
                  : 'text-[#0F100F] dark:text-white hover:bg-[#F9F6ED] dark:hover:bg-[#242624]'
              }`}
            >
              <span className="flex items-center space-x-2">
                <Package className="w-4 h-4" />
                <span>My Orders</span>
              </span>
              <span className="text-[10px] font-bold opacity-80">{orders.length}</span>
            </button>

            <button
              onClick={() => setActiveTab('wishlist')}
              className={`w-full text-left px-4 py-2.5 rounded-full text-xs font-semibold flex items-center justify-between transition ${
                activeTab === 'wishlist'
                  ? 'bg-[#0F100F] dark:bg-white text-white dark:text-[#0F100F]'
                  : 'text-[#0F100F] dark:text-white hover:bg-[#F9F6ED] dark:hover:bg-[#242624]'
              }`}
            >
              <span className="flex items-center space-x-2">
                <Heart className="w-4 h-4" />
                <span>Saved Swatches</span>
              </span>
              <span className="text-[10px] font-bold opacity-80">{wishlist.length}</span>
            </button>

            <button
              onClick={() => setActiveTab('addresses')}
              className={`w-full text-left px-4 py-2.5 rounded-full text-xs font-semibold flex items-center space-x-2 transition ${
                activeTab === 'addresses'
                  ? 'bg-[#0F100F] dark:bg-white text-white dark:text-[#0F100F]'
                  : 'text-[#0F100F] dark:text-white hover:bg-[#F9F6ED] dark:hover:bg-[#242624]'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>Delivery Addresses</span>
            </button>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-9 space-y-6">
            
            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="space-y-4">
                <h3 className="font-bold text-base font-editorial">Order History & Production Tracking</h3>
                {loadingOrders ? (
                  <div className="text-center py-12 text-xs text-[#8A8883]">Loading orders...</div>
                ) : orders.length === 0 ? (
                  <div className="bg-white dark:bg-[#1A1C1A] rounded-[28px] p-8 text-center border border-[#ECECEC] dark:border-white/[0.08] shadow-fabriclore space-y-3">
                    <p className="text-xs text-[#8A8883] dark:text-gray-400">No orders placed yet.</p>
                    <button
                      onClick={onGoToFabrics}
                      className="bg-[#0F100F] dark:bg-white text-white dark:text-[#0F100F] font-bold px-5 py-2 rounded-full text-xs"
                    >
                      Browse Fabrics
                    </button>
                  </div>
                ) : (
                  orders.map((ord) => (
                    <div
                      key={ord.id}
                      className="bg-white dark:bg-[#1A1C1A] rounded-[28px] p-5 border border-[#ECECEC] dark:border-white/[0.08] shadow-fabriclore space-y-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#ECECEC] dark:border-white/[0.08] pb-3 text-xs">
                        <div>
                          <span className="font-bold block">Order #{ord.id}</span>
                          <span className="text-[10px] text-[#8A8883] dark:text-gray-400">
                            {new Date(ord.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <span className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-bold px-3 py-1 rounded-full text-[10px] border border-emerald-200 dark:border-emerald-800">
                          {ord.orderStatus}
                        </span>
                      </div>

                      <div className="space-y-3">
                        {ord.items.map((item, i) => (
                          <div key={i} className="flex items-center space-x-3 text-xs">
                            <img
                              src={item.printOptions?.designUrl || item.productImage}
                              alt={item.productName}
                              className="w-12 h-12 rounded-xl object-cover border border-[#ECECEC] dark:border-white/[0.1]"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold truncate">{item.productName}</h4>
                              <p className="text-[10px] text-[#8A8883] dark:text-gray-400">{item.sizeLabel} × {item.quantity}</p>
                            </div>
                            <span className="font-bold text-[#AC7900] dark:text-[#D4AF37]">
                              INR {item.totalPrice.toLocaleString('en-IN')}.00
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between border-t border-[#ECECEC] dark:border-white/[0.08] pt-3 text-xs">
                        <span className="text-[#8A8883]">Tracking: {ord.trackingNumber}</span>
                        <span className="font-black text-sm">
                          Total: INR {ord.totalAmount.toLocaleString('en-IN')}.00
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Wishlist Tab */}
            {activeTab === 'wishlist' && (
              <div className="space-y-4">
                <h3 className="font-bold text-base font-editorial">Saved Fabric Swatches ({wishlist.length})</h3>
                {wishlist.length === 0 ? (
                  <div className="bg-white dark:bg-[#1A1C1A] rounded-[28px] p-8 text-center border border-[#ECECEC] dark:border-white/[0.08] shadow-fabriclore space-y-3">
                    <p className="text-xs text-[#8A8883] dark:text-gray-400">No saved swatches yet.</p>
                    <button
                      onClick={onGoToFabrics}
                      className="bg-[#0F100F] dark:bg-white text-white dark:text-[#0F100F] font-bold px-5 py-2 rounded-full text-xs"
                    >
                      Explore Fabrics
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wishlist.map((prod) => (
                      <FabricCard
                        key={prod.id}
                        product={prod}
                        onSelect={onSelectProduct}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Addresses Tab */}
            {activeTab === 'addresses' && (
              <div className="bg-white dark:bg-[#1A1C1A] rounded-[28px] p-6 border border-[#ECECEC] dark:border-white/[0.08] shadow-fabriclore space-y-4">
                <h3 className="font-bold text-base font-editorial">Saved Delivery Addresses</h3>
                {currentUser.addresses.length === 0 ? (
                  <p className="text-xs text-[#8A8883] dark:text-gray-400">No addresses saved yet.</p>
                ) : (
                  currentUser.addresses.map((addr) => (
                    <div key={addr.id} className="p-4 bg-[#F9F6ED] dark:bg-[#242624] rounded-2xl text-xs space-y-1">
                      <p className="font-bold">{addr.fullName} ({addr.phone})</p>
                      <p className="text-[#8A8883] dark:text-gray-400">{addr.street}, {addr.city}, {addr.state} - {addr.pincode}</p>
                    </div>
                  ))
                )}
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};

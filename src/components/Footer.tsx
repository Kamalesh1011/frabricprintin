import React from 'react';
import { Printer, Mail, Phone, MapPin, Shield, Truck, Award, Sparkles, Globe, BookOpen, Shirt, GraduationCap } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: string) => void;
  setSelectedCategory: (cat: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab, setSelectedCategory }) => {
  const handleCatClick = (cat: string) => {
    setSelectedCategory(cat);
    setActiveTab('fabrics');
  };

  return (
    <footer className="bg-[#FEFBF1] dark:bg-[#0F100F] text-[#0F100F] dark:text-gray-300 pt-16 pb-8 border-t border-[#ECECEC] dark:border-white/[0.08] font-sans transition-colors duration-300">
      
      {/* Guarantees Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 mb-12 border-b border-[#ECECEC] dark:border-white/[0.08] grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="flex items-start space-x-3">
          <div className="p-2.5 bg-white dark:bg-[#1A1C1A] rounded-2xl text-[#AC7900] dark:text-[#D4AF37] border border-[#ECECEC] dark:border-white/[0.08] shadow-sm">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-xs font-editorial text-[#0F100F] dark:text-white">250+ Fabric Qualities</h4>
            <p className="text-[11px] text-[#8A8883] dark:text-gray-400 mt-0.5">Ready-stock natural, bio-cellulosic & silk bases.</p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <div className="p-2.5 bg-white dark:bg-[#1A1C1A] rounded-2xl text-[#AC7900] dark:text-[#D4AF37] border border-[#ECECEC] dark:border-white/[0.08] shadow-sm">
            <Printer className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-xs font-editorial text-[#0F100F] dark:text-white">300 DPI Reactive Dyes</h4>
            <p className="text-[11px] text-[#8A8883] dark:text-gray-400 mt-0.5">High definition reproduction & soft hand feel.</p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <div className="p-2.5 bg-white dark:bg-[#1A1C1A] rounded-2xl text-emerald-600 dark:text-emerald-400 border border-[#ECECEC] dark:border-white/[0.08] shadow-sm">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-xs font-editorial text-[#0F100F] dark:text-white">Express Pan-India Dispatch</h4>
            <p className="text-[11px] text-[#8A8883] dark:text-gray-400 mt-0.5">Fast delivery for sample swatches & rolls.</p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <div className="p-2.5 bg-white dark:bg-[#1A1C1A] rounded-2xl text-[#EE6352] border border-[#ECECEC] dark:border-white/[0.08] shadow-sm">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-xs font-editorial text-[#0F100F] dark:text-white">Low MOQ: 1 Meter</h4>
            <p className="text-[11px] text-[#8A8883] dark:text-gray-400 mt-0.5">Automated volume tiers up to 25% discount.</p>
          </div>
        </div>
      </div>

      {/* Main 5-Column Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12">
        
        {/* SECTION 1: BRAND */}
        <div className="space-y-4 lg:col-span-1">
          <div className="flex items-center space-x-2.5 cursor-pointer" onClick={() => setActiveTab('home')}>
            <div className="w-10 h-10 rounded-2xl bg-white dark:bg-[#1A1C1A] border border-black/10 dark:border-white/15 p-1.5 flex items-center justify-center shadow-xs">
              <img
                src="/leaf-logo.png"
                alt="Fabric Print Leaf Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-xl font-black text-[#0F100F] dark:text-white tracking-tight font-editorial">
              FABRIC<span className="text-[#AC7900] dark:text-[#D4AF37]">PRINT</span>
            </span>
          </div>
          <p className="text-xs leading-relaxed text-[#8A8883] dark:text-gray-400">
            Custom digital textile printing and wholesale sustainable fabric supplier. Direct mill production, sample swatches, and 3D simulation.
          </p>
        </div>

        {/* SECTION 2: CONTACT DETAILS */}
        <div className="space-y-3 lg:col-span-1">
          <h4 className="text-[#0F100F] dark:text-white font-bold text-xs uppercase tracking-wider border-l-2 border-[#AC7900] pl-2 font-editorial">
            Mill Contact
          </h4>
          <div className="text-xs text-[#8A8883] dark:text-gray-400 space-y-2">
            <p className="flex items-center space-x-2">
              <Phone className="w-3.5 h-3.5 text-[#AC7900] shrink-0" />
              <a href="tel:+918903120006" className="hover:text-[#AC7900] transition font-semibold text-[#0F100F] dark:text-white">
                +91 89031 20006
              </a>
            </p>
            <p className="flex items-center space-x-2">
              <Mail className="w-3.5 h-3.5 text-[#AC7900] shrink-0" />
              <a href="mailto:support@fabricprint.in" className="hover:text-[#AC7900] transition font-semibold text-[#0F100F] dark:text-white">
                support@fabricprint.in
              </a>
            </p>
            <p className="flex items-start space-x-2 text-[11px]">
              <MapPin className="w-3.5 h-3.5 text-[#AC7900] shrink-0 mt-0.5" />
              <span>Tex Print Mill Complex, Ring Road Textile Market, Surat, Gujarat, 395002</span>
            </p>
          </div>
        </div>

        {/* SECTION 3: FIBER CATEGORIES */}
        <div className="space-y-3 lg:col-span-1">
          <h4 className="text-[#0F100F] dark:text-white font-bold text-xs uppercase tracking-wider border-l-2 border-[#AC7900] pl-2 font-editorial">
            Fabric Fiber
          </h4>
          <ul className="text-xs space-y-2 text-[#8A8883] dark:text-gray-400">
            {['Cotton', 'Silk', 'Linen', 'Rayon', 'Modal', 'Polyester'].map((cat) => (
              <li key={cat}>
                <button
                  onClick={() => handleCatClick(cat)}
                  className="hover:text-[#AC7900] dark:hover:text-white transition"
                >
                  {cat} Fabrics
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* SECTION 4: ATELIER & APPAREL TOOLS */}
        <div className="space-y-3 lg:col-span-1">
          <h4 className="text-[#0F100F] dark:text-white font-bold text-xs uppercase tracking-wider border-l-2 border-[#E11D48] pl-2 font-editorial">
            Apparel & Studio
          </h4>
          <ul className="text-xs space-y-2 text-[#8A8883] dark:text-gray-400">
            <li>
              <button
                onClick={() => setActiveTab('apparel-studio')}
                className="hover:text-[#E11D48] font-bold text-black dark:text-white transition flex items-center space-x-1.5"
              >
                <Shirt className="w-3 h-3 text-[#E11D48]" />
                <span>Apparel 3D Studio</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('apparel')}
                className="hover:text-[#E11D48] transition"
              >
                T-Shirts (180/240 GSM)
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('uniforms')}
                className="hover:text-[#AC7900] font-bold text-black dark:text-white transition flex items-center space-x-1.5"
              >
                <GraduationCap className="w-3 h-3 text-[#AC7900]" />
                <span>Uniforms & Institutions</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('uniforms')}
                className="hover:text-[#AC7900] transition"
              >
                School Checks & Tartan
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('uniforms')}
                className="hover:text-[#AC7900] transition"
              >
                Hospital & Medical Scrubs
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('merch')}
                className="hover:text-[#AC7900] font-bold text-black dark:text-white transition flex items-center space-x-1.5"
              >
                <Sparkles className="w-3 h-3 text-[#AC7900]" />
                <span>Other Products (Caps, Bottles, Totes)</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('training')}
                className="hover:text-[#AC7900] font-bold text-[#AC7900] dark:text-[#D4AF37] transition flex items-center space-x-1.5"
              >
                <GraduationCap className="w-3 h-3 text-[#AC7900] dark:text-[#D4AF37]" />
                <span>Printing &amp; Craft Training</span>
              </button>
            </li>
            {/* 
            <li>
              <button
                onClick={() => setActiveTab('customizer')}
                className="hover:text-[#AC7900] dark:hover:text-white transition flex items-center space-x-1.5 font-bold"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#AC7900] dark:text-[#D4AF37]" />
                <span>Customize All Studio</span>
              </button>
            </li>
            */}
          </ul>
        </div>

        {/* SECTION 5: CERTIFICATIONS */}
        <div className="space-y-3 lg:col-span-1">
          <h4 className="text-[#0F100F] dark:text-white font-bold text-xs uppercase tracking-wider border-l-2 border-emerald-600 pl-2 font-editorial">
            Certifications
          </h4>
          <ul className="text-xs space-y-2 text-[#8A8883] dark:text-gray-400">
            <li>
              <span className="text-emerald-700 dark:text-emerald-400 font-semibold block">GOTS Organic Certified</span>
              <span className="text-[10px] text-[#8A8883]">100% sustainable fibers</span>
            </li>
            <li>
              <span className="text-[#0F100F] dark:text-white font-semibold block">OEKO-TEX Standard 100</span>
              <span className="text-[10px] text-[#8A8883]">Non-toxic reactive inks</span>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('privacy')}
                className="hover:text-[#0F100F] dark:hover:text-white transition text-[11px]"
              >
                Privacy Policy
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('terms')}
                className="hover:text-[#0F100F] dark:hover:text-white transition text-[11px]"
              >
                Terms & Conditions
              </button>
            </li>
          </ul>
        </div>

      </div>

      {/* Copyright Sub-footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-[#ECECEC] dark:border-white/[0.08] flex flex-col sm:flex-row items-center justify-between text-xs text-[#8A8883] dark:text-gray-400 gap-4">
        <div>
          © {new Date().getFullYear()} Fabric Print Mill India. All rights reserved.
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-emerald-700 dark:text-emerald-400 font-semibold">● Direct Mill Dispatch</span>
          <span>Fast Doorstep Shipping</span>
        </div>
      </div>

    </footer>
  );
};

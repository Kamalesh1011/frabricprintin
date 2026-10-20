import React from 'react';
import { Award, ShieldCheck, Printer, Users, CheckCircle, Globe, MapPin, Sparkles, ArrowRight } from 'lucide-react';

interface AboutUsPageProps {
  onGoToFabrics: () => void;
  onOpenBulkInquiry: () => void;
}

export const AboutUsPage: React.FC<AboutUsPageProps> = ({ onGoToFabrics, onOpenBulkInquiry }) => {
  return (
    <div className="min-h-screen py-12 text-[#0F100F] dark:text-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header Hero */}
        <div className="bg-[#0F100F] text-white rounded-[35px] p-8 sm:p-12 shadow-xl space-y-4 text-center max-w-4xl mx-auto relative overflow-hidden">
          <div className="inline-flex items-center space-x-2 border border-white/20 px-3.5 py-1 rounded-full text-xs font-semibold text-[#D4AF37] uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Digital Textile Atelier</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black font-editorial tracking-tight">
            About Our Digital Fabric Printing Mill
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 max-w-2xl mx-auto leading-relaxed font-normal">
            Direct mill custom digital fabric printing for 500+ fashion designers, sustainable apparel brands, and studios. We pair centuries-old weaving expertise in Surat with 300 DPI reactive color-lock technology.
          </p>
        </div>

        {/* Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-[#1A1C1A] p-6 rounded-[28px] border border-[#ECECEC] dark:border-white/[0.08] shadow-fabriclore space-y-3">
            <div className="w-12 h-12 bg-[#F9F6ED] dark:bg-[#242624] text-[#AC7900] dark:text-[#D4AF37] rounded-full flex items-center justify-center font-bold">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base font-editorial">250+ Tested Base Qualities</h3>
            <p className="text-xs text-[#8A8883] dark:text-gray-400 leading-relaxed">
              Every organic cotton mulmul, French flax linen, modal, and Mulberry silk undergoes strict laboratory testing for thread count, GSM weight, and dimensional stability.
            </p>
          </div>

          <div className="bg-white dark:bg-[#1A1C1A] p-6 rounded-[28px] border border-[#ECECEC] dark:border-white/[0.08] shadow-fabriclore space-y-3">
            <div className="w-12 h-12 bg-[#F9F6ED] dark:bg-[#242624] text-[#EE6352] rounded-full flex items-center justify-center font-bold">
              <Printer className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base font-editorial">Reactive Dye Penetration</h3>
            <p className="text-xs text-[#8A8883] dark:text-gray-400 leading-relaxed">
              Our OEKO-TEX 100 non-toxic reactive inks bond molecularly with natural cellulosic and protein fibers for luxurious drape, ultra-soft hand feel, and permanent color lock.
            </p>
          </div>

          <div className="bg-white dark:bg-[#1A1C1A] p-6 rounded-[28px] border border-[#ECECEC] dark:border-white/[0.08] shadow-fabriclore space-y-3">
            <div className="w-12 h-12 bg-[#F9F6ED] dark:bg-[#242624] text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base font-editorial">Low MOQ: 1 Meter</h3>
            <p className="text-xs text-[#8A8883] dark:text-gray-400 leading-relaxed">
              Order strike-off test swatches (20×20 cm) with your custom artwork before scaling seamlessly to volume rolls up to 50,000 meters.
            </p>
          </div>
        </div>

        {/* Surat Mill Specs Banner */}
        <div className="bg-white dark:bg-[#1A1C1A] rounded-[35px] border border-[#ECECEC] dark:border-white/[0.08] p-8 sm:p-12 shadow-fabriclore grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <span className="text-xs font-bold text-[#AC7900] dark:text-[#D4AF37] uppercase tracking-wider font-editorial">Manufacturing Atelier</span>
            <h2 className="text-2xl sm:text-3xl font-black font-editorial">
              Surat Textile Mill Complex
            </h2>
            <p className="text-xs sm:text-sm text-[#8A8883] dark:text-gray-400 leading-relaxed">
              Located at the heart of Ring Road Textile Market, Surat, Gujarat—India's textile capital. Our production mill operates 24/7 with a daily digital print capacity exceeding 20,000 meters.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={onGoToFabrics}
                className="bg-[#0F100F] dark:bg-white text-white dark:text-[#0F100F] font-bold px-6 py-3 rounded-full text-xs hover:opacity-90 transition shadow-md flex items-center space-x-2"
              >
                <span>Explore 250+ Qualities</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={onOpenBulkInquiry}
                className="bg-[#F9F6ED] dark:bg-[#242624] text-[#0F100F] dark:text-white font-bold px-6 py-3 rounded-full text-xs border border-[#ECECEC] dark:border-white/[0.1] hover:border-[#AC7900] transition"
              >
                Request Mill Quote
              </button>
            </div>
          </div>

          <div className="relative aspect-[4/3] rounded-[28px] overflow-hidden bg-[#F3F0E8] dark:bg-[#222422] border border-[#ECECEC] dark:border-white/[0.08]">
            <img
              src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&q=80&w=900"
              alt="Textile Weaving Mill"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

      </div>
    </div>
  );
};

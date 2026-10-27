import React from 'react';
import { Award, ShieldCheck, Printer, Users, CheckCircle, Globe, MapPin, Sparkles, ArrowRight, Shirt, Clock, Layers } from 'lucide-react';
import { BUSINESS_INFO } from '../config/businessInfo';

interface AboutUsPageProps {
  onGoToFabrics: () => void;
  onOpenBulkInquiry: () => void;
}

export const AboutUsPage: React.FC<AboutUsPageProps> = ({ onGoToFabrics, onOpenBulkInquiry }) => {
  return (
    <div className="min-h-screen py-12 text-[#0F100F] dark:text-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header Hero */}
        <div className="bg-[#0F100F] text-white rounded-[35px] p-8 sm:p-14 shadow-xl space-y-4 text-center max-w-4xl mx-auto relative overflow-hidden">
          <div className="inline-flex items-center space-x-2 border border-white/20 px-3.5 py-1 rounded-full text-xs font-semibold text-[#D4AF37] uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Digital Textile Atelier &amp; Apparel Mill</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black font-editorial tracking-tight">
            About Fabric Print Mill
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 max-w-2xl mx-auto leading-relaxed font-normal">
            Direct mill digital fabric printing and custom apparel manufacturing based in Tirupur, Tamil Nadu. We empower fashion designers, boutique studios, and apparel brands with low 1-meter sampling and high-speed industrial printing.
          </p>
        </div>

        {/* Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-[#1A1C1A] p-6 rounded-[28px] border border-[#ECECEC] dark:border-white/[0.08] shadow-fabriclore space-y-3">
            <div className="w-12 h-12 bg-[#F9F6ED] dark:bg-[#242624] text-[#AC7900] dark:text-[#D4AF37] rounded-full flex items-center justify-center font-bold">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base font-editorial">250+ Ready Fabric Bases</h3>
            <p className="text-xs text-[#8A8883] dark:text-gray-400 leading-relaxed">
              From featherlight cotton mulmul and crisp cambric to Mulberry silk satin, French flax linen, modal, and high-performance poly-spandex.
            </p>
          </div>

          <div className="bg-white dark:bg-[#1A1C1A] p-6 rounded-[28px] border border-[#ECECEC] dark:border-white/[0.08] shadow-fabriclore space-y-3">
            <div className="w-12 h-12 bg-[#F9F6ED] dark:bg-[#242624] text-[#EE6352] rounded-full flex items-center justify-center font-bold">
              <Printer className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base font-editorial">Molecular Color Lock</h3>
            <p className="text-xs text-[#8A8883] dark:text-gray-400 leading-relaxed">
              Our skin-safe reactive dyes chemically bond with natural fibers, delivering deep vibrancy, luxurious drape, zero hand-feel, and enduring wash-fastness.
            </p>
          </div>

          <div className="bg-white dark:bg-[#1A1C1A] p-6 rounded-[28px] border border-[#ECECEC] dark:border-white/[0.08] shadow-fabriclore space-y-3">
            <div className="w-12 h-12 bg-[#F9F6ED] dark:bg-[#242624] text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base font-editorial">1 Meter Sampling MOQ</h3>
            <p className="text-xs text-[#8A8883] dark:text-gray-400 leading-relaxed">
              Test your custom pattern repeats and strike-offs from 1 meter before scaling smoothly to commercial roll runs up to 20,000+ meters.
            </p>
          </div>
        </div>

        {/* Tirupur Mill Facility Banner */}
        <div className="bg-white dark:bg-[#1A1C1A] rounded-[35px] border border-[#ECECEC] dark:border-white/[0.08] p-8 sm:p-12 shadow-fabriclore grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <span className="text-xs font-bold text-[#AC7900] dark:text-[#D4AF37] uppercase tracking-wider font-editorial">Production Hub</span>
            <h2 className="text-2xl sm:text-3xl font-black font-editorial">
              Tirupur Apparel &amp; Mill Facility
            </h2>
            <p className="text-xs sm:text-sm text-[#8A8883] dark:text-gray-400 leading-relaxed">
              Situated in Tirupur, Tamil Nadu—India's textile and knitwear capital. Our vertically integrated setup operates advanced digital reactive printers, dye-sublimation presses, and automated cutting suites for fabrics and garments alike.
            </p>

            <div className="space-y-2 text-xs text-[#0F100F] dark:text-gray-200">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span><strong>Address:</strong> {BUSINESS_INFO.address.fullFormatted}</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span><strong>Helpline &amp; WhatsApp:</strong> {BUSINESS_INFO.displayPhone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span><strong>Direct Mill Dispatch:</strong> Express doorstep delivery across India</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={onGoToFabrics}
                className="bg-[#0F100F] dark:bg-white text-white dark:text-[#0F100F] font-bold px-6 py-3 rounded-full text-xs hover:opacity-90 transition shadow-md flex items-center space-x-2"
              >
                <span>Browse 250+ Fabrics</span>
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
              src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&q=60&w=800"
              alt="Textile Weaving Mill"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Production Pipeline Overview */}
        <div className="bg-[#FEFBF1] dark:bg-[#161716] rounded-[32px] p-8 border border-[#ECECEC] dark:border-white/[0.08] space-y-6">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <span className="text-xs font-bold text-[#AC7900] dark:text-[#D4AF37] uppercase tracking-wider font-editorial">
              How We Work
            </span>
            <h3 className="text-2xl font-black font-editorial">From Artwork to Finished Roll</h3>
            <p className="text-xs text-[#8A8883] dark:text-gray-400">
              Our 4-step streamlined production ensures perfection before mass printing.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-[#1F211F] p-5 rounded-2xl border border-[#ECECEC] dark:border-white/[0.05] space-y-2">
              <span className="text-xs font-black text-[#AC7900]">01</span>
              <h4 className="font-bold text-xs text-[#0F100F] dark:text-white">Artwork Pre-flight Check</h4>
              <p className="text-[11px] text-[#8A8883] dark:text-gray-400">Our design team inspects DPI resolution and seamless repeat boundaries.</p>
            </div>

            <div className="bg-white dark:bg-[#1F211F] p-5 rounded-2xl border border-[#ECECEC] dark:border-white/[0.05] space-y-2">
              <span className="text-xs font-black text-[#AC7900]">02</span>
              <h4 className="font-bold text-xs text-[#0F100F] dark:text-white">1m Strike-Off Proof</h4>
              <p className="text-[11px] text-[#8A8883] dark:text-gray-400">Printed on the selected fabric base for exact shade and hand-feel validation.</p>
            </div>

            <div className="bg-white dark:bg-[#1F211F] p-5 rounded-2xl border border-[#ECECEC] dark:border-white/[0.05] space-y-2">
              <span className="text-xs font-black text-[#AC7900]">03</span>
              <h4 className="font-bold text-xs text-[#0F100F] dark:text-white">High-Speed Reactive Run</h4>
              <p className="text-[11px] text-[#8A8883] dark:text-gray-400">Steam curing and washing fix dyes permanently with zero stiffness.</p>
            </div>

            <div className="bg-white dark:bg-[#1F211F] p-5 rounded-2xl border border-[#ECECEC] dark:border-white/[0.05] space-y-2">
              <span className="text-xs font-black text-[#AC7900]">04</span>
              <h4 className="font-bold text-xs text-[#0F100F] dark:text-white">Final QA &amp; Express Dispatch</h4>
              <p className="text-[11px] text-[#8A8883] dark:text-gray-400">Rolls are roll-inspected, wrapped in protective poly, and shipped nationwide.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

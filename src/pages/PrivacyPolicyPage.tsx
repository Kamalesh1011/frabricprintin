import React from 'react';
import { ShieldCheck, Lock, Eye, FileText } from 'lucide-react';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="min-h-screen py-12 text-[#0F100F] dark:text-white transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-[#F9F6ED] dark:bg-[#242624] text-[#AC7900] dark:text-[#D4AF37] rounded-full flex items-center justify-center mx-auto shadow-sm">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-black font-editorial">Privacy Policy & Intellectual Property</h1>
          <p className="text-xs text-[#8A8883] dark:text-gray-400">Last updated: September 2026</p>
        </div>

        <div className="bg-white dark:bg-[#1A1C1A] rounded-[32px] border border-[#ECECEC] dark:border-white/[0.08] p-8 shadow-fabriclore space-y-6 text-xs leading-relaxed text-[#0F100F] dark:text-gray-300">
          
          <section className="space-y-2">
            <h3 className="font-bold text-sm font-editorial text-[#0F100F] dark:text-white">
              1. Strict Protection of Your Artwork & Copyrights
            </h3>
            <p>
              We treat all client designs, patterns, and digital artwork files uploaded to Fabric Print with 100% confidentiality. We will never sell, publish, share, or reproduce your proprietary designs for any third party. Your files remain exclusively your intellectual property.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-bold text-sm font-editorial text-[#0F100F] dark:text-white">
              2. Information We Collect
            </h3>
            <p>
              We collect information necessary to process your digital fabric print orders, including name, shipping address, contact phone, and payment transaction references. We do not store raw credit card numbers on our servers; transactions are encrypted via certified payment gateways.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-bold text-sm font-editorial text-[#0F100F] dark:text-white">
              3. Data Security & Storage
            </h3>
            <p>
              Artwork files are stored in private cloud storage buckets with access restricted solely to production line RIP (Raster Image Processor) software for strike-off printing.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-bold text-sm font-editorial text-[#0F100F] dark:text-white">
              4. Contact Us Regarding Privacy
            </h3>
            <p>
              For inquiries regarding data deletion or NDA signing, email us at <strong className="text-[#AC7900] dark:text-[#D4AF37]">privacy@fabricprint.in</strong>.
            </p>
          </section>

        </div>

      </div>
    </div>
  );
};

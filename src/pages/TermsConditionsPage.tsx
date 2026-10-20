import React from 'react';
import { FileCheck, AlertCircle, RefreshCw, Truck } from 'lucide-react';

export const TermsConditionsPage: React.FC = () => {
  return (
    <div className="min-h-screen py-12 text-[#0F100F] dark:text-white transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-[#F9F6ED] dark:bg-[#242624] text-[#AC7900] dark:text-[#D4AF37] rounded-full flex items-center justify-center mx-auto shadow-sm">
            <FileCheck className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-black font-editorial">Terms & Conditions of Service</h1>
          <p className="text-xs text-[#8A8883] dark:text-gray-400">Standard Textile Manufacturing & Digital Printing Guidelines</p>
        </div>

        <div className="bg-white dark:bg-[#1A1C1A] rounded-[32px] border border-[#ECECEC] dark:border-white/[0.08] p-8 shadow-fabriclore space-y-6 text-xs leading-relaxed text-[#0F100F] dark:text-gray-300">
          
          <section className="space-y-2">
            <h3 className="font-bold text-sm font-editorial text-[#0F100F] dark:text-white">
              1. Custom Print Manufacturing Terms
            </h3>
            <p>
              Digital textile printing is custom made-to-order. Because every run is specifically printed with your custom artwork files on base fabrics, orders cannot be cancelled or returned once strike-off printing commences.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-bold text-sm font-editorial text-[#0F100F] dark:text-white">
              2. Color Calibration & Strike-Off Approvals
            </h3>
            <p>
              Digital RGB screen displays differ slightly from physical CMYK/reactive dye absorption on natural cellulosic/protein fibers. We strongly recommend ordering a 20×20 cm test swatch for color matching before placing large bulk meterage orders.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-bold text-sm font-editorial text-[#0F100F] dark:text-white">
              3. Fabric Shrinkage & Width Tolerances
            </h3>
            <p>
              Natural fibers like 100% Cotton Mulmul, Cambric, and French Linen have standard post-wash shrinkage allowances of 3% to 5%. Usable fabric widths are subject to standard mill manufacturing tolerances of ±1 inch.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-bold text-sm font-editorial text-[#0F100F] dark:text-white">
              4. Dispatch & Turnaround Timelines
            </h3>
            <p>
              Standard digital print runs are processed and dispatched within 7–10 business days from Surat, Gujarat. Bulk quantities over 500 meters are scheduled according to mutual production timelines.
            </p>
          </section>

        </div>

      </div>
    </div>
  );
};

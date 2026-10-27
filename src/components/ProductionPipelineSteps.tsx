import React, { useState } from 'react';
import { Upload, Layers, Sparkles, Truck, CheckCircle2, Globe, ShieldCheck, ArrowRight } from 'lucide-react';

interface StepData {
  stepNumber: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  tags: string[];
  previewImage: string;
}

const PRODUCTION_STEPS: StepData[] = [
  {
    stepNumber: '01',
    title: 'Import Artwork or Extract from Google URL',
    description: 'Upload your high-res design files (JPG, PNG, TIFF, PDF) or paste any Google Image Search / Pinterest URL. Our smart parser extracts motifs and creates 5 Pantone colorway swatches.',
    icon: <Globe className="w-5 h-5 text-[#AC7900] dark:text-[#D4AF37]" />,
    tags: ['Google URL Extraction', 'Pantone Swatches', '300 DPI Validation'],
    previewImage: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&q=60&w=800'
  },
  {
    stepNumber: '02',
    title: 'Select Premium Base Fabric Quality',
    description: 'Choose from 250+ ready-stock textile bases: Pure Cotton Mulmul, Pure Mulberry Silk (16 Momme), French Flax Linen, Modal Satin, and Viscose Georgette.',
    icon: <Layers className="w-5 h-5 text-[#AC7900] dark:text-[#D4AF37]" />,
    tags: ['250+ Qualities', 'Color-Lock Inks', 'Lab Dip Tested'],
    previewImage: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=60&w=800'
  },
  {
    stepNumber: '03',
    title: '3D Drape Simulation & Metric Strike-Off',
    description: 'Preview seamless repeat layouts (Grid, Half-Drop, Brick, Mirror) on interactive 3D cloth models with real-time lighting. Order a 20×20 cm test swatch to verify color before bulk meterage.',
    icon: <Sparkles className="w-5 h-5 text-[#AC7900] dark:text-[#D4AF37]" />,
    tags: ['3D Cloth Simulator', 'Centimeter Calibration', 'Test Swatches (₹200)'],
    previewImage: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&q=60&w=800'
  },
  {
    stepNumber: '04',
    title: 'Reactive Steaming & 7–10 Day Dispatch',
    description: 'Printed on high-speed industrial reactive digital presses in our Tirupur mill. Steam-cured and bio-washed for silky hand feel, inspected for GSM consistency, and dispatched express across India.',
    icon: <Truck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
    tags: ['Steam Washing', 'Color Lock Fastness', 'Doorstep Express Courier'],
    previewImage: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&q=60&w=800'
  }
];

export const ProductionPipelineSteps: React.FC = () => {
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);

  const activeStep = PRODUCTION_STEPS[activeStepIndex] || PRODUCTION_STEPS[0];

  return (
    <div className="bg-[#FEFBF1] dark:bg-[#121312] rounded-[35px] border border-[#ECECEC] dark:border-white/[0.08] p-6 sm:p-10 shadow-fabriclore space-y-8 text-[#0F100F] dark:text-white transition-colors duration-300">
      
      {/* Header */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <div className="inline-flex items-center space-x-2 text-xs font-bold text-[#AC7900] dark:text-[#D4AF37] uppercase tracking-wider font-editorial">
          <Sparkles className="w-4 h-4" />
          <span>Seamless Production Pipeline</span>
        </div>
        <h3 className="text-2xl sm:text-4xl font-black font-editorial tracking-tight">
          How "Concept to Fabric" Works
        </h3>
        <p className="text-xs sm:text-sm text-[#8A8883] dark:text-gray-400">
          From digital artwork upload to physical reactive print delivery in 4 effortless steps.
        </p>
      </div>

      {/* 4 Step Selector Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {PRODUCTION_STEPS.map((step, idx) => {
          const isActive = activeStepIndex === idx;
          return (
            <div
              key={step.stepNumber}
              onClick={() => setActiveStepIndex(idx)}
              className={`rounded-[26px] p-4.5 cursor-pointer transition flex flex-col justify-between space-y-3 border ${
                isActive
                  ? 'bg-white dark:bg-[#1A1C1A] border-[#AC7900] shadow-md'
                  : 'bg-[#F9F6ED] dark:bg-[#1A1C1A]/50 border-[#ECECEC] dark:border-white/[0.06] hover:border-[#AC7900]/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-[#EE6352] font-editorial">
                  STEP {step.stepNumber}
                </span>
                <div className="p-2 rounded-full bg-white dark:bg-[#242624] shadow-xs">
                  {step.icon}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-xs line-clamp-1 group-hover:text-[#AC7900]">
                  {step.title}
                </h4>
                <p className="text-[11px] text-[#8A8883] dark:text-gray-400 line-clamp-2 mt-1">
                  {step.description}
                </p>
              </div>

              <div className="w-full h-1 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    isActive ? 'bg-[#AC7900] w-full' : 'w-0'
                  }`}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Step Showcase Banner */}
      <div className="bg-white dark:bg-[#1A1C1A] rounded-[30px] border border-[#ECECEC] dark:border-white/[0.08] p-6 sm:p-8 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        
        <div className="md:col-span-7 space-y-4">
          <div className="flex items-center space-x-2">
            <span className="bg-[#EE6352] text-white text-xs font-bold px-3 py-1 rounded-full">
              STEP {activeStep.stepNumber}
            </span>
            <span className="text-xs font-bold text-[#AC7900] dark:text-[#D4AF37] font-editorial">
              Standard Mill Guarantee
            </span>
          </div>

          <h4 className="text-xl sm:text-2xl font-black font-editorial">
            {activeStep.title}
          </h4>

          <p className="text-xs sm:text-sm text-[#8A8883] dark:text-gray-300 leading-relaxed font-normal">
            {activeStep.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 pt-2">
            {activeStep.tags.map((tag, i) => (
              <span
                key={i}
                className="bg-[#F9F6ED] dark:bg-[#242624] text-[#0F100F] dark:text-white border border-[#ECECEC] dark:border-white/[0.08] px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1.5 shadow-xs"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>{tag}</span>
              </span>
            ))}
          </div>
        </div>

        <div className="md:col-span-5">
          <div className="relative aspect-[4/3] rounded-[24px] overflow-hidden bg-[#F3F0E8] dark:bg-[#222422] border border-[#ECECEC] dark:border-white/[0.08] shadow-sm">
            <img
              src={activeStep.previewImage}
              alt={activeStep.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

      </div>

    </div>
  );
};

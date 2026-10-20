import React, { useState, useRef } from 'react';
import {
  MessageCircle,
  Phone,
  Upload,
  FileText,
  X,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Clock,
  Scissors
} from 'lucide-react';

interface WhatsAppOrderSectionProps {
  phoneNumber?: string;
  displayPhone?: string;
  className?: string;
}

const POPULAR_REQUIREMENTS = [
  'Cotton Cambric 60s',
  'Pure Mulberry Silk Crepe',
  'French Flax Pure Linen',
  'Modal Satin Silk',
  'School & Hospital Uniforms',
  'Custom Printed T-Shirts',
  '1-Meter Sample Strike-off',
  'Wholesale Roll (100m+)'
];

export const WhatsAppOrderSection: React.FC<WhatsAppOrderSectionProps> = ({
  phoneNumber = '918903120006',
  displayPhone = '+91 89031 20006',
  className = ''
}) => {
  const [requirement, setRequirement] = useState('');
  const [meters, setMeters] = useState('10');
  const [fileName, setFileName] = useState('');
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setFilePreview(event.target?.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setFilePreview(null);
      }
    }
  };

  const removeFile = () => {
    setFileName('');
    setFilePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSelectChip = (chip: string) => {
    if (requirement.includes(chip)) return;
    setRequirement((prev) => (prev ? `${prev}, ${chip}` : chip));
  };

  const buildWhatsAppMessage = () => {
    const reqText = requirement.trim() || 'Custom Fabric Printing';
    const meterText = meters ? `${meters} meters` : 'Flexible quantity';
    const docText = fileName ? `\nAttached Document/Design: ${fileName}` : '';

    const text = `Hi Fabric Print, I would like to order/inquire:\n• Requirement: ${reqText}\n• Quantity: ${meterText}${docText}\n\nPlease share price quote and production timeline.`;

    return encodeURIComponent(text);
  };

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${buildWhatsAppMessage()}`;

  return (
    <section
      id="whatsapp-order-section"
      className={`relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 ${className}`}
    >
      <div className="relative rounded-[28px] sm:rounded-[36px] bg-gradient-to-br from-[#FEFBF1] via-white to-[#F6F3E9] dark:from-[#171917] dark:via-[#1A1D1A] dark:to-[#141614] border border-[#E9E4D4] dark:border-white/10 p-5 sm:p-8 lg:p-10 shadow-xl overflow-hidden">
        
        {/* Subtle Top Decorative Accent */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-emerald-500 via-[#AC7900] to-emerald-500" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Section Headline & Reassurance Badges */}
          <div className="lg:col-span-5 space-y-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-bold border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Direct WhatsApp &amp; Phone Desk</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black font-editorial tracking-tight text-[#0F100F] dark:text-white leading-tight">
              Order Fabric on WhatsApp or Call
            </h2>

            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-normal">
              Skip complex website checkouts. Share your requirement, attach your design document or photo, and order directly with our textile team.
            </p>

            {/* Quick Reassurance Pillars */}
            <div className="pt-2 space-y-2.5 text-xs text-gray-700 dark:text-gray-200">
              <div className="flex items-center space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span><strong>No Minimums:</strong> Print from just 1 meter.</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span><strong>Fast 5-Min Reply:</strong> Dedicated specialist support.</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span><strong>Free Artwork Check:</strong> High-DPI verification before printing.</span>
              </div>
            </div>

            {/* Direct Phone Call Card */}
            <div className="pt-4 border-t border-black/5 dark:border-white/10">
              <a
                href={`tel:${phoneNumber}`}
                className="inline-flex items-center space-x-2.5 text-xs font-bold text-[#0F100F] dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 transition"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] text-gray-500 uppercase tracking-wider">Prefer to talk on phone?</div>
                  <div className="text-sm font-black">{displayPhone}</div>
                </div>
              </a>
            </div>
          </div>

          {/* RIGHT: Interactive Fast Requirement & Document Box */}
          <div className="lg:col-span-7 bg-white dark:bg-[#1E211E] rounded-2xl sm:rounded-3xl border border-black/5 dark:border-white/10 p-4 sm:p-6 shadow-sm space-y-4">
            
            {/* 1. What is your requirement */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-extrabold uppercase tracking-wider text-gray-700 dark:text-gray-200 flex items-center space-x-1.5">
                  <span className="w-5 h-5 rounded-full bg-black text-white dark:bg-white dark:text-black flex items-center justify-center text-[10px] font-black">1</span>
                  <span>What is your requirement?</span>
                </label>
                <span className="text-[11px] text-gray-400">Type or select below</span>
              </div>

              {/* Quick Select Chips */}
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {POPULAR_REQUIREMENTS.map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => handleSelectChip(chip)}
                    className="text-[11px] font-medium py-1 px-2.5 rounded-full bg-[#F5F2E8] dark:bg-[#282B28] text-gray-800 dark:text-gray-200 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 hover:text-emerald-800 transition border border-transparent hover:border-emerald-300"
                  >
                    + {chip}
                  </button>
                ))}
              </div>

              {/* Requirement Input */}
              <textarea
                rows={2}
                value={requirement}
                onChange={(e) => setRequirement(e.target.value)}
                placeholder="e.g. 25 meters Cotton Cambric 60s with digital floral print for summer dresses..."
                className="w-full bg-[#FAF8F2] dark:bg-[#252825] border border-gray-200 dark:border-white/10 rounded-xl p-3 text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
              />
            </div>

            {/* Meters Input */}
            <div className="flex items-center gap-3">
              <div className="w-1/2">
                <label className="text-[11px] font-bold text-gray-600 dark:text-gray-300 block mb-1">
                  Meters / Quantity:
                </label>
                <input
                  type="text"
                  value={meters}
                  onChange={(e) => setMeters(e.target.value)}
                  placeholder="e.g. 10 meters"
                  className="w-full bg-[#FAF8F2] dark:bg-[#252825] border border-gray-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="w-1/2">
                <label className="text-[11px] font-bold text-gray-600 dark:text-gray-300 block mb-1">
                  Delivery City / Pincode:
                </label>
                <input
                  type="text"
                  placeholder="e.g. Mumbai, Delhi, Bangalore"
                  className="w-full bg-[#FAF8F2] dark:bg-[#252825] border border-gray-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* 2. Upload Document or Design */}
            <div className="space-y-2 pt-1 border-t border-gray-100 dark:border-white/5">
              <label className="text-xs font-extrabold uppercase tracking-wider text-gray-700 dark:text-gray-200 flex items-center space-x-1.5">
                <span className="w-5 h-5 rounded-full bg-black text-white dark:bg-white dark:text-black flex items-center justify-center text-[10px] font-black">2</span>
                <span>Upload Document, Design, or Photo (Optional)</span>
              </label>

              <input
                ref={fileInputRef}
                type="file"
                accept=".jpg,.jpeg,.png,.pdf,.tiff,.tif,.psd,.ai,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
              />

              {!fileName ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 dark:border-white/15 rounded-2xl p-4 text-center cursor-pointer hover:border-emerald-500 dark:hover:border-emerald-400 bg-[#FAF8F2]/60 dark:bg-[#252825]/60 transition group"
                >
                  <div className="flex flex-col items-center justify-center space-y-1.5">
                    <div className="w-9 h-9 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Upload className="w-4 h-4" />
                    </div>
                    <div className="text-xs font-bold text-gray-800 dark:text-gray-200">
                      Click to upload design document, tech pack or photo
                    </div>
                    <div className="text-[10px] text-gray-400">
                      Supports JPG, PNG, PDF, AI, PSD, TIFF (or send directly on WhatsApp)
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-800/40 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2.5 truncate">
                    {filePreview ? (
                      <img src={filePreview} alt="Preview" className="w-9 h-9 rounded object-cover border border-emerald-300" />
                    ) : (
                      <FileText className="w-6 h-6 text-emerald-600 shrink-0" />
                    )}
                    <div className="truncate">
                      <div className="font-bold text-emerald-900 dark:text-emerald-300 truncate max-w-[220px]">
                        {fileName}
                      </div>
                      <div className="text-[10px] text-emerald-700 dark:text-emerald-400">
                        Ready to send with your requirement
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={removeFile}
                    className="p-1.5 text-red-500 hover:text-red-700 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition"
                    title="Remove file"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* 3. Action Buttons: WhatsApp & Call */}
            <div className="pt-2 space-y-2">
              {/* WhatsApp CTA Button */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-5 rounded-2xl bg-[#25D366] hover:bg-[#20BD5A] text-white font-extrabold text-sm flex items-center justify-between shadow-lg shadow-emerald-600/20 transition-all hover:scale-[1.01] active:scale-98 group"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                    <MessageCircle className="w-5 h-5 fill-current" />
                  </div>
                  <div className="text-left">
                    <div className="leading-tight font-black">Chat &amp; Send Requirement on WhatsApp</div>
                    <div className="text-[11px] text-white/90 font-normal">Instant quote • Attach files in chat</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </a>

              {/* Direct Call Button */}
              <div className="flex items-center justify-between text-xs text-gray-500 px-1 pt-1">
                <span>Need immediate answer?</span>
                <a
                  href={`tel:${phoneNumber}`}
                  className="font-bold text-[#AC7900] dark:text-[#D4AF37] hover:underline flex items-center space-x-1"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call {displayPhone}</span>
                </a>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

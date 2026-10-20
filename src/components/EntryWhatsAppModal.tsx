import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Phone, X, CheckCircle2, ArrowRight, Upload, FileText } from 'lucide-react';

interface EntryWhatsAppModalProps {
  phoneNumber?: string;
  displayPhone?: string;
}

const QUICK_OPTIONS = [
  'Cotton Cambric',
  'Pure Silk',
  'French Flax Linen',
  'Modal Satin',
  'Uniforms / Scrubs',
  'Sample Meter (1m)'
];

export const EntryWhatsAppModal: React.FC<EntryWhatsAppModalProps> = ({
  phoneNumber = '918903120006',
  displayPhone = '+91 89031 20006',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [requirement, setRequirement] = useState('');
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Only show if user hasn't dismissed in this browser session
    const hasSeen = sessionStorage.getItem('fabric_print_entry_modal_seen');
    if (!hasSeen) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1200); // Gentle 1.2s delay for page to render first

      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    sessionStorage.setItem('fabric_print_entry_modal_seen', 'true');
    setIsOpen(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
    }
  };

  if (!isOpen) return null;

  const buildWhatsappUrl = () => {
    const req = requirement.trim() || 'Custom Fabric Printing';
    const docNote = fileName ? `\nAttached Document: ${fileName}` : '';
    const message = `Hi Fabric Print, I am visiting your website and have an inquiry:\n• Requirement: ${req}${docNote}\n\nPlease share price quote and assist me.`;
    return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-300"
      onClick={handleClose}
      id="entry-whatsapp-modal"
    >
      <div
        className="relative w-full max-w-md bg-[#FEFBF1] dark:bg-[#151715] text-[#0F100F] dark:text-white rounded-[28px] p-5 sm:p-7 shadow-2xl border border-black/10 dark:border-white/10 overflow-hidden animate-in zoom-in-95 duration-300 max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle decorative top glow */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-emerald-500 via-[#D4AF37] to-emerald-500" />

        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-3.5 right-3.5 p-2 text-gray-400 hover:text-black dark:hover:text-white rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition z-10"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-1.5 pt-1">
          <div className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-bold border border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Live Textile Support Online</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black font-editorial tracking-tight text-[#0F100F] dark:text-white">
            Order Easily on WhatsApp or Phone
          </h2>

          <p className="text-xs text-gray-600 dark:text-gray-300 max-w-xs mx-auto leading-relaxed">
            Skip complex website forms. Share your requirement, attach your design document, and order directly.
          </p>
        </div>

        {/* Fast Requirement & Upload Form */}
        <div className="my-4 p-3.5 bg-white dark:bg-[#1E201E] rounded-2xl border border-black/5 dark:border-white/10 space-y-3 text-xs">
          <div>
            <label className="block font-bold text-gray-700 dark:text-gray-200 mb-1">
              What is your requirement?
            </label>
            <div className="flex flex-wrap gap-1 mb-2">
              {QUICK_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setRequirement((prev) => (prev ? `${prev}, ${opt}` : opt))}
                  className="text-[10px] py-0.5 px-2 rounded-full bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/40"
                >
                  + {opt}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={requirement}
              onChange={(e) => setRequirement(e.target.value)}
              placeholder="e.g. 15m Cotton Cambric with floral print..."
              className="w-full bg-[#FAF8F2] dark:bg-[#282B28] border border-gray-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Upload Document / Photo */}
          <div>
            <label className="block font-bold text-gray-700 dark:text-gray-200 mb-1">
              Upload Document / Design (Optional)
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.pdf,.tiff,.ai,.psd,.doc"
              onChange={handleFileChange}
              className="hidden"
            />
            {!fileName ? (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-2 px-3 border border-dashed border-gray-300 dark:border-white/20 rounded-xl text-center text-gray-600 dark:text-gray-300 hover:border-emerald-500 flex items-center justify-center space-x-1.5 transition"
              >
                <Upload className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-[11px] font-medium">Attach design, photo, or PDF</span>
              </button>
            ) : (
              <div className="flex items-center justify-between p-2 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-800/40 text-[11px]">
                <div className="flex items-center space-x-1.5 truncate">
                  <FileText className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="truncate font-bold text-emerald-800 dark:text-emerald-300">{fileName}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setFileName('')}
                  className="text-red-500 font-bold ml-2 shrink-0 hover:underline"
                >
                  Remove
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="space-y-2">
          {/* WhatsApp CTA */}
          <a
            href={buildWhatsappUrl()}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleClose}
            className="w-full py-3.5 px-4 rounded-2xl bg-[#25D366] hover:bg-[#20BD5A] text-white font-extrabold text-sm flex items-center justify-between shadow-lg shadow-emerald-600/20 transition-all hover:scale-[1.01] active:scale-98 group"
          >
            <div className="flex items-center space-x-2.5">
              <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <MessageCircle className="w-4 h-4 fill-current" />
              </div>
              <div className="text-left">
                <div className="leading-tight font-black text-xs sm:text-sm">Chat &amp; Order on WhatsApp</div>
                <div className="text-[10px] text-white/90 font-normal">Fast 5-min reply • Send designs</div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </a>

          {/* Direct Phone Call CTA */}
          <a
            href={`tel:${phoneNumber}`}
            onClick={handleClose}
            className="w-full py-2.5 px-4 rounded-2xl bg-[#0F100F] dark:bg-white text-white dark:text-[#0F100F] font-bold text-xs flex items-center justify-between border border-black/10 dark:border-white/10 hover:opacity-90 transition-all hover:scale-[1.01] active:scale-98 group"
          >
            <div className="flex items-center space-x-2">
              <Phone className="w-3.5 h-3.5 text-[#D4AF37] dark:text-[#AC7900] shrink-0" />
              <span>Call Specialist: {displayPhone}</span>
            </div>
            <span className="text-[10px] text-[#D4AF37] dark:text-[#AC7900] font-bold">Call Now</span>
          </a>
        </div>

        {/* Dismiss and continue to website */}
        <div className="text-center pt-3">
          <button
            type="button"
            onClick={handleClose}
            className="text-xs text-gray-500 hover:text-black dark:hover:text-white transition font-medium hover:underline inline-flex items-center space-x-1"
          >
            <span>Or browse website on my own</span>
            <span>→</span>
          </button>
        </div>
      </div>
    </div>
  );
};

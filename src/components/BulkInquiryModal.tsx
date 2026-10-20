import React, { useState } from 'react';
import { X, Sparkles, Send, CheckCircle2 } from 'lucide-react';

interface BulkInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BulkInquiryModal: React.FC<BulkInquiryModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [meters, setMeters] = useState('250');
  const [fabricType, setFabricType] = useState('Cotton Mulmul');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-[#1A1C1A] text-[#0F100F] dark:text-white rounded-[32px] max-w-md w-full p-6 border border-[#ECECEC] dark:border-white/[0.08] shadow-2xl relative">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-black dark:hover:text-white p-1"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-8 space-y-3">
            <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-base font-editorial">Inquiry Submitted!</h3>
            <p className="text-xs text-[#8A8883] dark:text-gray-400">
              Our Textile Mill Specialist will contact you at <strong>{phone}</strong> within 2 hours with discounted pricing.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-[#AC7900]" />
              <h3 className="font-bold text-lg font-editorial">Bulk Textile Quote Inquiry</h3>
            </div>
            <p className="text-xs text-[#8A8883] dark:text-gray-400">
              Direct mill rates for garment exporters, fashion labels, and wholesale fabric buyers (100m+).
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Your Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rahul Kapoor"
                  className="w-full bg-[#F9F6ED] dark:bg-[#242624] border border-[#ECECEC] dark:border-white/[0.1] rounded-2xl py-2 px-3 focus:outline-none focus:border-[#AC7900] text-[#0F100F] dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Brand / Studio Name</label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Studio Velvet"
                  className="w-full bg-[#F9F6ED] dark:bg-[#242624] border border-[#ECECEC] dark:border-white/[0.1] rounded-2xl py-2 px-3 focus:outline-none focus:border-[#AC7900] text-[#0F100F] dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Phone / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full bg-[#F9F6ED] dark:bg-[#242624] border border-[#ECECEC] dark:border-white/[0.1] rounded-2xl py-2 px-3 focus:outline-none focus:border-[#AC7900] text-[#0F100F] dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Estimated Meters *</label>
                  <input
                    type="number"
                    min="100"
                    step="50"
                    required
                    value={meters}
                    onChange={(e) => setMeters(e.target.value)}
                    placeholder="250"
                    className="w-full bg-[#F9F6ED] dark:bg-[#242624] border border-[#ECECEC] dark:border-white/[0.1] rounded-2xl py-2 px-3 focus:outline-none focus:border-[#AC7900] text-[#0F100F] dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Fabric Quality of Interest</label>
                <select
                  value={fabricType}
                  onChange={(e) => setFabricType(e.target.value)}
                  className="w-full bg-[#F9F6ED] dark:bg-[#242624] border border-[#ECECEC] dark:border-white/[0.1] rounded-2xl py-2 px-3 focus:outline-none focus:border-[#AC7900] text-[#0F100F] dark:text-white"
                >
                  <optgroup label="Custom Uniforms & Workwear">
                    <option value="Hospitality & Kitchen Uniforms" className="bg-white dark:bg-[#1A1C1A]">Hospitality & Kitchen (Chef Coats, Bistro Aprons)</option>
                    <option value="Healthcare & Medical Scrubs" className="bg-white dark:bg-[#1A1C1A]">Healthcare & Wellness (Scrubs, Lab Coats, Tunics)</option>
                    <option value="Corporate & Office Wear" className="bg-white dark:bg-[#1A1C1A]">Corporate & Office Wear (Oxford Shirts, Blazers, Polos)</option>
                    <option value="Industrial & Heavy Duty Workwear" className="bg-white dark:bg-[#1A1C1A]">Industrial & Workwear (Boilersuits, Hi-Vis Vests, Cargo)</option>
                    <option value="School & College Uniforms" className="bg-white dark:bg-[#1A1C1A]">School & College (Ties, Badges, Uniforms, SportsWear)</option>
                  </optgroup>
                  <optgroup label="Custom Printed Mill Fabrics">
                    <option value="Cotton Mulmul" className="bg-white dark:bg-[#1A1C1A]">Cotton Mulmul (70 GSM)</option>
                    <option value="Cotton Cambric 60s" className="bg-white dark:bg-[#1A1C1A]">Cotton Cambric 60s (95 GSM)</option>
                    <option value="Pure Mulberry Silk" className="bg-white dark:bg-[#1A1C1A]">Pure Mulberry Silk Crepe (16 Momme)</option>
                    <option value="French Flax Linen" className="bg-white dark:bg-[#1A1C1A]">French Flax Linen (140 GSM)</option>
                    <option value="Modal Satin" className="bg-white dark:bg-[#1A1C1A]">Modal Satin (110 GSM)</option>
                    <option value="Rayon Crepe" className="bg-white dark:bg-[#1A1C1A]">Rayon Crepe (120 GSM)</option>
                  </optgroup>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Notes / Print Details</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Need custom rotary print, reactive digital strike-offs..."
                  className="w-full bg-[#F9F6ED] dark:bg-[#242624] border border-[#ECECEC] dark:border-white/[0.1] rounded-2xl py-2 px-3 focus:outline-none focus:border-[#AC7900] text-[#0F100F] dark:text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#0F100F] dark:bg-white text-white dark:text-[#0F100F] font-bold py-3 rounded-full text-xs hover:opacity-90 transition shadow-md flex items-center justify-center space-x-2"
            >
              <Send className="w-4 h-4" />
              <span>Submit Mill Bulk Inquiry</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
};

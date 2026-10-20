import React, { useState } from 'react';
import { X, GraduationCap, Send, CheckCircle2, Users, Building, Phone, Mail, BookOpen } from 'lucide-react';

interface TrainingInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultProgram?: string;
}

export const TrainingInquiryModal: React.FC<TrainingInquiryModalProps> = ({
  isOpen,
  onClose,
  defaultProgram = 'All 7 Master Modules (Comprehensive Bootcamp)'
}) => {
  const [name, setName] = useState('');
  const [organization, setOrganization] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [selectedProgram, setSelectedProgram] = useState(defaultProgram);
  const [attendeeCount, setAttendeeCount] = useState('6–15 Students');
  const [trainingMode, setTrainingMode] = useState('Surat Mill Campus Workshop');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
      setName('');
      setOrganization('');
      setPhone('');
      setEmail('');
      setNotes('');
    }, 2800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-[#1A1C1A] text-[#0F100F] dark:text-white rounded-[32px] max-w-lg w-full p-6 sm:p-8 border border-black/10 dark:border-white/15 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-black dark:hover:text-white p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-10 space-y-4">
            <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h3 className="font-bold text-xl font-editorial">Training Inquiry Received!</h3>
            <p className="text-xs text-[#8A8883] dark:text-gray-300 leading-relaxed max-w-sm mx-auto">
              Our Academic Dean will contact you on WhatsApp at <strong>{phone}</strong> with customized syllabus PDFs, machine lab schedules, and institutional discounts.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-2xl bg-[#AC7900]/10 flex items-center justify-center text-[#AC7900] dark:text-[#D4AF37]">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg font-editorial leading-tight">
                  Academy Workshop &amp; Class Inquiry
                </h3>
                <span className="text-[10px] font-bold text-[#AC7900] dark:text-[#D4AF37] uppercase tracking-wider">
                  College Batches · Corporate Teams · Private Mentorship
                </span>
              </div>
            </div>

            <p className="text-xs text-[#8A8883] dark:text-gray-400 leading-relaxed">
              Customized textile printing masterclasses and syllabus for NIFT, NID, fashion design universities, startups, and apparel production teams.
            </p>

            <div className="space-y-3.5 text-xs pt-1">
              
              {/* Name & Organization */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">
                    Contact Person Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Prof. Ananya Roy"
                    className="w-full bg-[#F9F6ED] dark:bg-[#242624] border border-black/10 dark:border-white/10 rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#AC7900] text-[#0F100F] dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">
                    Institute / Studio / Brand *
                  </label>
                  <input
                    type="text"
                    required
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    placeholder="e.g. NIFT / Studio Velvet"
                    className="w-full bg-[#F9F6ED] dark:bg-[#242624] border border-black/10 dark:border-white/10 rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#AC7900] text-[#0F100F] dark:text-white"
                  />
                </div>
              </div>

              {/* Phone & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">
                    Phone / WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full bg-[#F9F6ED] dark:bg-[#242624] border border-black/10 dark:border-white/10 rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#AC7900] text-[#0F100F] dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ananya@institute.edu"
                    className="w-full bg-[#F9F6ED] dark:bg-[#242624] border border-black/10 dark:border-white/10 rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#AC7900] text-[#0F100F] dark:text-white"
                  />
                </div>
              </div>

              {/* Training Program of Interest */}
              <div>
                <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">
                  Training Program / Technique of Interest *
                </label>
                <select
                  value={selectedProgram}
                  onChange={(e) => setSelectedProgram(e.target.value)}
                  className="w-full bg-[#F9F6ED] dark:bg-[#242624] border border-black/10 dark:border-white/10 rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#AC7900] text-[#0F100F] dark:text-white font-medium"
                >
                  <option value="All 7 Master Modules (Comprehensive Bootcamp)">
                    🌟 All 7 Master Disciplines (Complete Master Bootcamp)
                  </option>
                  <option value="Block Print Masterclass">
                    🪵 Block Print Masterclass (Carved Teak Blocks &amp; Natural Resist)
                  </option>
                  <option value="Silk Screen Print Industrial Certification">
                    🎨 Silk Screen Print Industrial Certification (Plastisol Carousel)
                  </option>
                  <option value="Sublimation Print & Sportswear Lab">
                    ⚡ Sublimation Print &amp; Sportswear Jersey Lab (300 DPI Heat Transfer)
                  </option>
                  <option value="DTF (Direct to Film) Advanced Workshop">
                    🔥 DTF (Direct to Film) Advanced Printing &amp; Transfer
                  </option>
                  <option value="DTG (Direct to Garment) Inkjet Engineering">
                    👕 DTG (Direct to Garment) Industrial Inkjet Engineering
                  </option>
                  <option value="Natural Botanical Dyeing & Indigo Vats">
                    🌿 Natural Botanical Dyeing &amp; Organic Indigo Reduction Vats
                  </option>
                  <option value="Textile Tufting & Fiber Rug Artistry">
                    🧶 Textile Tufting &amp; Hand-Crafted Fiber Rug Artistry
                  </option>
                  <option value="Custom Tailored Syllabus">
                    ✨ Custom Tailored Multi-Technique Syllabus
                  </option>
                </select>
              </div>

              {/* Group Size & Training Mode */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">
                    Estimated Batch Size
                  </label>
                  <select
                    value={attendeeCount}
                    onChange={(e) => setAttendeeCount(e.target.value)}
                    className="w-full bg-[#F9F6ED] dark:bg-[#242624] border border-black/10 dark:border-white/10 rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#AC7900] text-[#0F100F] dark:text-white font-medium"
                  >
                    <option value="1-5 Students">1–5 Students (Small Cohort)</option>
                    <option value="6-15 Students">6–15 Students (Class Batch)</option>
                    <option value="16-30 Students">16–30 Students (Department Cohort)</option>
                    <option value="30+ Students">30+ Students (Full College Batch)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">
                    Preferred Location / Mode
                  </label>
                  <select
                    value={trainingMode}
                    onChange={(e) => setTrainingMode(e.target.value)}
                    className="w-full bg-[#F9F6ED] dark:bg-[#242624] border border-black/10 dark:border-white/10 rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#AC7900] text-[#0F100F] dark:text-white font-medium"
                  >
                    <option value="Surat Mill Campus Workshop">Surat Mill Campus (Live Machine Lab)</option>
                    <option value="On-Site at College / Studio">On-Site at Your College / Studio</option>
                    <option value="Online Cohort + Raw Kits Shipped">Online Masterclass + Home Kits</option>
                  </select>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">
                  Custom Syllabus Requirements / Learning Goals
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Need 3-day weekend workshop focused on DTF & Screen printing for 2nd year textile design students..."
                  className="w-full bg-[#F9F6ED] dark:bg-[#242624] border border-black/10 dark:border-white/10 rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#AC7900] text-[#0F100F] dark:text-white"
                />
              </div>

            </div>

            <button
              type="submit"
              className="w-full bg-[#0F100F] dark:bg-white text-white dark:text-[#0F100F] font-bold py-3 px-4 rounded-xl text-xs hover:opacity-90 transition shadow-md flex items-center justify-center space-x-2 mt-4"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Academy Training Inquiry</span>
            </button>

          </form>
        )}

      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, MessageSquare, Clock, MessageCircle, HelpCircle, ChevronDown } from 'lucide-react';
import { BUSINESS_INFO } from '../config/businessInfo';

export const ContactUsPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const FAQS = [
    {
      q: 'What is the Minimum Order Quantity (MOQ)?',
      a: 'We offer a low MOQ of just 1 meter for strike-off sampling so you can verify color, repeat scale, and drape before placing bulk volume orders.'
    },
    {
      q: 'How fast is production and dispatch?',
      a: 'Strike-off samples are dispatched within 48 to 72 hours. Bulk production runs (50m to 5,000m+) typically ship in 3 to 5 business days express across India.'
    },
    {
      q: 'What file formats do you accept for custom printing?',
      a: 'We accept TIFF, PDF, PSD, AI, PNG, and high-resolution JPEG (preferably at 300 DPI in RGB or CMYK). Seamless repeat files are automatically verified before printing.'
    },
    {
      q: 'Do you provide sample swatch books?',
      a: 'Yes! Our Master Swatch Kit contains actual physical swatches of all 250+ base fabrics with print finish samples for ₹499 (includes a ₹500 credit on your next bulk order).'
    }
  ];

  return (
    <div className="min-h-screen py-12 text-[#0F100F] dark:text-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-bold text-[#AC7900] dark:text-[#D4AF37] uppercase tracking-wider font-editorial">
            Direct Mill Desk
          </span>
          <h1 className="text-3xl sm:text-4xl font-black font-editorial tracking-tight">
            Contact Fabric Print Mill
          </h1>
          <p className="text-xs sm:text-sm text-[#8A8883] dark:text-gray-400">
            Have questions about custom digital printing, 1-meter test swatches, or bulk wholesale pricing? Our technical printing specialists are ready to assist.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Contact Info */}
          <div className="lg:col-span-5 bg-[#0F100F] text-white rounded-[32px] p-8 shadow-xl space-y-6">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#D4AF37] block">Production &amp; Studio Hub</span>
              <h3 className="text-xl font-bold font-editorial">Tirupur Mill Headquarters</h3>
            </div>
            
            <div className="space-y-4 text-xs text-gray-300">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-white font-semibold">Mill &amp; Studio Address:</strong>
                  <span>{BUSINESS_INFO.address.fullFormatted}</span>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-[#D4AF37] shrink-0" />
                <div>
                  <strong className="block text-white font-semibold">Wholesale Desk &amp; Helpline:</strong>
                  <a href={`tel:${BUSINESS_INFO.phone}`} className="hover:text-[#D4AF37] transition font-bold">
                    {BUSINESS_INFO.displayPhone}
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-[#D4AF37] shrink-0" />
                <div>
                  <strong className="block text-white font-semibold">Studio Email:</strong>
                  <a href={`mailto:${BUSINESS_INFO.email}`} className="hover:text-[#D4AF37] transition">
                    {BUSINESS_INFO.email}
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-[#D4AF37] shrink-0" />
                <div>
                  <strong className="block text-white font-semibold">Operating Hours:</strong>
                  <span>{BUSINESS_INFO.operatingHours}</span>
                </div>
              </div>
            </div>

            {/* Direct WhatsApp Action Button */}
            <div className="pt-4 border-t border-white/10">
              <a
                href={BUSINESS_INFO.whatsapp.orderUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-2xl bg-[#25D366] text-white font-bold flex items-center justify-center space-x-2 shadow-md hover:bg-[#20ba59] transition"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Chat on WhatsApp ({BUSINESS_INFO.displayPhone})</span>
              </a>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="lg:col-span-7 bg-white dark:bg-[#1A1C1A] rounded-[32px] border border-[#ECECEC] dark:border-white/[0.08] p-8 shadow-fabriclore space-y-6">
            <h3 className="text-xl font-bold font-editorial">Send Us a Direct Message</h3>

            {submitted ? (
              <div className="p-8 text-center space-y-3 bg-[#FEFBF1] dark:bg-[#222422] rounded-2xl border border-[#AC7900]/30">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="text-base font-bold font-editorial">Message Received!</h4>
                <p className="text-xs text-[#8A8883] dark:text-gray-400">
                  Thank you, <strong>{name}</strong>. A dedicated textile advisor will contact you within 2 hours.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setName('');
                    setEmail('');
                    setPhone('');
                    setMessage('');
                  }}
                  className="mt-4 px-4 py-2 bg-[#0F100F] dark:bg-white text-white dark:text-[#0F100F] text-xs font-bold rounded-full"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold mb-1 font-editorial">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Priya Mehta"
                      className="w-full bg-[#F9F6ED] dark:bg-[#242624] border border-[#ECECEC] dark:border-white/[0.1] rounded-2xl py-2.5 px-3.5 focus:outline-none focus:border-[#AC7900] text-[#0F100F] dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-1 font-editorial">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. +91 98765 43210"
                      className="w-full bg-[#F9F6ED] dark:bg-[#242624] border border-[#ECECEC] dark:border-white/[0.1] rounded-2xl py-2.5 px-3.5 focus:outline-none focus:border-[#AC7900] text-[#0F100F] dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold mb-1 font-editorial">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. priya@designstudio.com"
                    className="w-full bg-[#F9F6ED] dark:bg-[#242624] border border-[#ECECEC] dark:border-white/[0.1] rounded-2xl py-2.5 px-3.5 focus:outline-none focus:border-[#AC7900] text-[#0F100F] dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 font-editorial">Message / Fabric Requirements *</label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us about your fabric base (cotton, silk, linen, modal), estimated meters, or custom apparel project..."
                    className="w-full bg-[#F9F6ED] dark:bg-[#242624] border border-[#ECECEC] dark:border-white/[0.1] rounded-2xl py-2.5 px-3.5 focus:outline-none focus:border-[#AC7900] text-[#0F100F] dark:text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#0F100F] dark:bg-white text-white dark:text-[#0F100F] font-bold py-3.5 rounded-full text-xs hover:opacity-90 transition shadow-md flex items-center justify-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Inquiry to Mill Advisor</span>
                </button>
              </form>
            )}

          </div>

        </div>

        {/* Quick FAQ Section */}
        <div className="bg-white dark:bg-[#1A1C1A] rounded-[32px] border border-[#ECECEC] dark:border-white/[0.08] p-8 shadow-fabriclore space-y-6">
          <div className="flex items-center space-x-2 text-[#AC7900] dark:text-[#D4AF37]">
            <HelpCircle className="w-5 h-5" />
            <h3 className="text-xl font-bold font-editorial text-[#0F100F] dark:text-white">Frequently Asked Questions</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {FAQS.map((faq, index) => (
              <div
                key={index}
                className="p-4 rounded-2xl bg-[#F9F6ED] dark:bg-[#242624] border border-[#ECECEC] dark:border-white/[0.05] space-y-1.5"
              >
                <h4 className="font-bold text-xs text-[#0F100F] dark:text-white">{faq.q}</h4>
                <p className="text-[11px] text-[#8A8883] dark:text-gray-400 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

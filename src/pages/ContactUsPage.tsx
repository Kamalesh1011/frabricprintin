import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, MessageSquare, Clock, Globe } from 'lucide-react';

export const ContactUsPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen py-12 text-[#0F100F] dark:text-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-bold text-[#AC7900] dark:text-[#D4AF37] uppercase tracking-wider font-editorial">
            Get in Touch
          </span>
          <h1 className="text-3xl sm:text-4xl font-black font-editorial tracking-tight">
            Contact Our Mill & Textile Atelier
          </h1>
          <p className="text-xs sm:text-sm text-[#8A8883] dark:text-gray-400">
            Have questions about custom digital printing, lab dips, or wholesale pricing? Our textile specialists are here to assist.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Contact Info */}
          <div className="lg:col-span-5 bg-[#0F100F] text-white rounded-[32px] p-8 shadow-xl space-y-6">
            <h3 className="text-xl font-bold font-editorial">Surat Mill Headquarters</h3>
            
            <div className="space-y-4 text-xs text-gray-300">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-white font-semibold">Mill Complex Address:</strong>
                  <span>Tex Print Mill Complex, Plot 42-45, Ring Road Textile Market, Surat, Gujarat, 395002, India</span>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-[#D4AF37] shrink-0" />
                <div>
                  <strong className="block text-white font-semibold">Wholesale Phone & WhatsApp:</strong>
                  <a href="tel:+919000011223" className="hover:text-[#D4AF37] transition">
                    +91 90000 11223 / +91 98765 43210
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-[#D4AF37] shrink-0" />
                <div>
                  <strong className="block text-white font-semibold">Studio Email:</strong>
                  <a href="mailto:support@fabricprint.in" className="hover:text-[#D4AF37] transition">
                    support@fabricprint.in
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-[#D4AF37] shrink-0" />
                <div>
                  <strong className="block text-white font-semibold">Operating Hours:</strong>
                  <span>Monday - Saturday: 9:00 AM - 8:00 PM IST</span>
                </div>
              </div>
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
                  <label className="block font-semibold mb-1 font-editorial">Message / Inquiry Details *</label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us about your fabric requirements, quantities, or print strike-off needs..."
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

      </div>
    </div>
  );
};

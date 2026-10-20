import React, { useState, useEffect } from 'react';
import { X, Search, Sparkles, Check, Image as ImageIcon } from 'lucide-react';
import { PreloadedDesign } from '../types';
import { fetchPreloadedDesigns } from '../services/api';

interface PreloadedDesignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDesign: (design: { name: string; url: string; widthPx?: number; heightPx?: number }) => void;
}

export const PreloadedDesignModal: React.FC<PreloadedDesignModalProps> = ({
  isOpen,
  onClose,
  onSelectDesign
}) => {
  const [designs, setDesigns] = useState<PreloadedDesign[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (isOpen) {
      loadDesigns();
    }
  }, [isOpen]);

  const loadDesigns = async () => {
    setLoading(true);
    const list = await fetchPreloadedDesigns();
    setDesigns(list);
    setLoading(false);
  };

  if (!isOpen) return null;

  const categories = ['All', ...Array.from(new Set(designs.map(d => d.category)))];

  const filteredDesigns = designs.filter(d => {
    const matchesCat = selectedCategory === 'All' || d.category === selectedCategory;
    const matchesSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          d.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#1A1C1A] text-[#0F100F] dark:text-white w-full max-w-4xl rounded-[32px] shadow-2xl border border-[#ECECEC] dark:border-white/[0.08] overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in duration-200 transition-colors">
        
        {/* Header */}
        <div className="p-6 bg-[#FEFBF1] dark:bg-[#161716] border-b border-[#ECECEC] dark:border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-[#0F100F] dark:bg-white text-white dark:text-[#0F100F] flex items-center justify-center shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-editorial">Select Preloaded Artwork</h2>
              <p className="text-xs text-[#8A8883] dark:text-gray-400">Choose from curated high-resolution print designs</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-black dark:hover:text-white rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter / Search bar */}
        <div className="p-5 border-b border-[#ECECEC] dark:border-white/[0.08] space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search motifs (damask, floral, geometric)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#F9F6ED] dark:bg-[#242624] border border-[#ECECEC] dark:border-white/[0.1] rounded-2xl py-2 pl-10 pr-4 text-xs text-[#0F100F] dark:text-white placeholder-gray-400 focus:outline-none focus:border-[#AC7900]"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1 rounded-full text-xs font-semibold transition ${
                  selectedCategory === cat
                    ? 'bg-[#0F100F] dark:bg-white text-white dark:text-[#0F100F]'
                    : 'bg-[#F9F6ED] dark:bg-[#242624] text-[#0F100F] dark:text-white border border-[#ECECEC] dark:border-white/[0.08]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Designs Grid */}
        <div className="p-6 overflow-y-auto flex-1">
          {loading ? (
            <div className="text-center py-16 text-xs text-[#8A8883]">Loading curated motifs...</div>
          ) : filteredDesigns.length === 0 ? (
            <div className="text-center py-16 text-xs text-[#8A8883]">No matching motifs found.</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {filteredDesigns.map((d) => (
                <div
                  key={d.id}
                  onClick={() => {
                    onSelectDesign({ name: d.name, url: d.imageUrl, widthPx: d.widthPx || 3000, heightPx: d.heightPx || 3000 });
                    onClose();
                  }}
                  className="group relative rounded-2xl overflow-hidden border border-[#ECECEC] dark:border-white/[0.08] cursor-pointer bg-[#F9F6ED] dark:bg-[#242624] hover:border-[#AC7900] shadow-sm hover:shadow-md transition"
                >
                  <div className="aspect-square overflow-hidden bg-white">
                    <img
                      src={d.imageUrl}
                      alt={d.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  </div>
                  <div className="p-2.5">
                    <h4 className="font-bold text-xs truncate group-hover:text-[#AC7900] transition">{d.name}</h4>
                    <span className="text-[10px] text-[#8A8883] dark:text-gray-400">{d.category}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

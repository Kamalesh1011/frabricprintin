import React, { useState } from 'react';
import {
  Globe,
  Search,
  Check,
  X,
  Palette,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { extractImageFromUrl } from '../services/api';
import { ExtractedImageInfo } from '../types';

interface SmartUrlImageExtractorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyExtractedImage: (imageInfo: {
    url: string;
    name: string;
    widthPx: number;
    heightPx: number;
    fileSizeMb: number;
    palette?: string[];
  }) => void;
}

const SAMPLE_IMAGE_URLS = [
  {
    label: '🌸 Royal Mughal Damask',
    url: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&q=60&w=800'
  },
  {
    label: '🔷 Indigo Tile Pattern',
    url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=60&w=800'
  },
  {
    label: '🌿 Tropical Botanical Art',
    url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=60&w=800'
  },
  {
    label: '🎨 Watercolor Splash',
    url: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&q=60&w=800'
  }
];

export const SmartUrlImageExtractorModal: React.FC<SmartUrlImageExtractorModalProps> = ({
  isOpen,
  onClose,
  onApplyExtractedImage
}) => {
  const [inputUrl, setInputUrl] = useState<string>('');
  const [isExtracting, setIsExtracting] = useState<boolean>(false);
  const [extractedData, setExtractedData] = useState<ExtractedImageInfo | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleExtract = async (urlToFetch?: string) => {
    const targetUrl = urlToFetch || inputUrl;
    if (!targetUrl.trim()) {
      setErrorMsg('Please paste a valid Google Images link or web URL.');
      return;
    }

    setErrorMsg('');
    setIsExtracting(true);
    setExtractedData(null);

    try {
      const data = await extractImageFromUrl(targetUrl.trim());
      setExtractedData(data);
    } catch (err: any) {
      setErrorMsg(err.message || 'Could not resolve image from URL.');
    } finally {
      setIsExtracting(false);
    }
  };

  const handleApply = () => {
    if (!extractedData) return;
    onApplyExtractedImage({
      url: extractedData.extractedImageUrl,
      name: `${extractedData.title || 'Extracted_Artwork'}.png`,
      widthPx: extractedData.width || 3200,
      heightPx: extractedData.height || 3200,
      fileSizeMb: extractedData.fileSizeMb || 3.8,
      palette: extractedData.palette
    });
    onClose();
  };

  const copyColor = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#1A1C1A] border border-[#ECECEC] dark:border-white/[0.1] rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-[#0F100F] dark:text-white transition-colors duration-300">
        
        {/* Header */}
        <div className="p-6 border-b border-[#ECECEC] dark:border-white/[0.08] flex items-center justify-between bg-[#FEFBF1] dark:bg-[#161716]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-[#0F100F] dark:bg-white text-white dark:text-[#0F100F] flex items-center justify-center shadow-md">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-editorial">
                Extract Artwork from Web / Google URL
              </h3>
              <p className="text-xs text-[#8A8883] dark:text-gray-400">
                Paste any image URL, Pinterest link, or Google Image Search result
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-700 dark:hover:text-white rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* URL Input Bar */}
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#0F100F] dark:text-white">
              Image or Web Link:
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleExtract()}
                  placeholder="https://images.google.com/imgres?imgurl=... or direct image URL"
                  className="w-full bg-[#F9F6ED] dark:bg-[#242624] border border-[#ECECEC] dark:border-white/[0.1] rounded-2xl pl-10 pr-4 py-3 text-xs text-[#0F100F] dark:text-white placeholder-gray-400 focus:outline-none focus:border-[#AC7900] transition"
                />
              </div>
              <button
                onClick={() => handleExtract()}
                disabled={isExtracting}
                className="bg-[#0F100F] dark:bg-white text-white dark:text-[#0F100F] font-bold px-5 py-3 rounded-2xl text-xs flex items-center space-x-2 transition hover:opacity-90 disabled:opacity-50 shrink-0 shadow-sm"
              >
                {isExtracting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    <span>Extracting...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-[#AC7900] dark:text-[#D4AF37]" />
                    <span>Extract Artwork</span>
                  </>
                )}
              </button>
            </div>

            {/* Quick Sample Presets */}
            <div className="space-y-1.5 pt-1">
              <span className="text-xs font-medium text-[#8A8883] dark:text-gray-400">Sample Design Presets:</span>
              <div className="flex flex-wrap gap-2">
                {SAMPLE_IMAGE_URLS.map((sample, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setInputUrl(sample.url);
                      handleExtract(sample.url);
                    }}
                    className="text-xs bg-[#F9F6ED] dark:bg-[#242624] hover:bg-[#F3F0E8] dark:hover:bg-[#2e302e] text-[#0F100F] dark:text-gray-200 border border-[#ECECEC] dark:border-white/[0.08] px-3 py-1.5 rounded-full transition"
                  >
                    {sample.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-300 p-4 rounded-2xl text-xs flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Extracted Asset Card */}
          {extractedData && (
            <div className="bg-[#FEFBF1] dark:bg-[#222422] border border-[#ECECEC] dark:border-white/[0.08] rounded-2xl p-5 space-y-4 animate-in fade-in duration-300">
              <div className="flex flex-col sm:flex-row gap-5 items-start">
                
                {/* Image Preview */}
                <div className="relative w-full sm:w-44 h-44 rounded-2xl overflow-hidden border border-[#ECECEC] dark:border-white/[0.1] bg-[#F3F0E8] shrink-0 shadow-sm">
                  <img
                    src={extractedData.extractedImageUrl}
                    alt={extractedData.title || 'Extracted Motif'}
                    className="w-full h-full object-cover"
                    crossOrigin="anonymous"
                  />
                  <div className="absolute bottom-2 left-2 right-2 bg-black/70 backdrop-blur-md text-white text-[10px] font-bold text-center py-1 rounded-lg">
                    ✓ 300 DPI High Resolution
                  </div>
                </div>

                {/* Info & Palette */}
                <div className="space-y-3 flex-1 min-w-0">
                  <div>
                    <h4 className="text-sm font-bold text-[#0F100F] dark:text-white truncate">
                      {extractedData.title || 'Extracted Design Motif'}
                    </h4>
                    <p className="text-xs text-[#8A8883] dark:text-gray-400 truncate max-w-md">
                      {extractedData.originalUrl}
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="bg-white dark:bg-[#1A1C1A] p-2.5 rounded-xl border border-[#ECECEC] dark:border-white/[0.08]">
                      <span className="text-[10px] text-[#8A8883] block">Dimensions</span>
                      <span className="font-bold">{extractedData.width} × {extractedData.height} px</span>
                    </div>
                    <div className="bg-white dark:bg-[#1A1C1A] p-2.5 rounded-xl border border-[#ECECEC] dark:border-white/[0.08]">
                      <span className="text-[10px] text-[#8A8883] block">Print Density</span>
                      <span className="font-bold text-emerald-600">300 DPI</span>
                    </div>
                    <div className="bg-white dark:bg-[#1A1C1A] p-2.5 rounded-xl border border-[#ECECEC] dark:border-white/[0.08]">
                      <span className="text-[10px] text-[#8A8883] block">File Size</span>
                      <span className="font-bold">{extractedData.fileSizeMb} MB</span>
                    </div>
                  </div>

                  {/* Extracted Color Palette */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="flex items-center space-x-1.5 text-[#AC7900] dark:text-[#D4AF37]">
                        <Palette className="w-3.5 h-3.5" />
                        <span>Extracted Color Palette</span>
                      </span>
                      {copiedHex && (
                        <span className="text-emerald-600 text-[10px]">Copied {copiedHex}!</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {extractedData.palette.map((hex, i) => (
                        <button
                          key={i}
                          onClick={() => copyColor(hex)}
                          className="group relative flex-1 h-8 rounded-lg border border-black/10 transition transform hover:scale-105 shadow-sm"
                          style={{ backgroundColor: hex }}
                          title={`Click to copy ${hex}`}
                        >
                          <span className="opacity-0 group-hover:opacity-100 absolute -bottom-5 left-1/2 -translate-x-1/2 bg-black text-[9px] px-1 rounded text-white whitespace-nowrap z-10">
                            {hex}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                </div>

              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-5 border-t border-[#ECECEC] dark:border-white/[0.08] bg-[#FEFBF1] dark:bg-[#161716] flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-gray-500 hover:text-gray-800 dark:hover:text-white transition"
          >
            Cancel
          </button>

          <button
            onClick={handleApply}
            disabled={!extractedData}
            className="bg-[#0F100F] dark:bg-white text-white dark:text-[#0F100F] font-bold px-6 py-2.5 rounded-full text-xs flex items-center space-x-2 transition shadow-md disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90"
          >
            <CheckCircle2 className="w-4 h-4 text-[#AC7900] dark:text-[#D4AF37]" />
            <span>Apply to 3D Drape Customizer</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};

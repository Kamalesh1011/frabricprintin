import React, { useState } from 'react';
import {
  X,
  Upload,
  Check,
  Image as ImageIcon,
  Trash2,
  RefreshCw,
  ExternalLink,
  Layers
} from 'lucide-react';
import { MediaLibraryModal } from './MediaLibraryModal';

interface ImageReplaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentImageUrl: string;
  title: string;
  subtitle?: string;
  onConfirmReplace: (newUrl: string) => Promise<void> | void;
  onDeleteImage?: () => Promise<void> | void;
}

export const ImageReplaceModal: React.FC<ImageReplaceModalProps> = ({
  isOpen,
  onClose,
  currentImageUrl,
  title,
  subtitle,
  onConfirmReplace,
  onDeleteImage
}) => {
  const [selectedUrl, setSelectedUrl] = useState<string>(currentImageUrl);
  const [inputUrl, setInputUrl] = useState<string>('');
  const [isMediaLibraryOpen, setIsMediaLibraryOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [previewError, setPreviewError] = useState(false);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setSelectedUrl(dataUrl);
      setPreviewError(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!selectedUrl) return;
    setIsSaving(true);
    try {
      await onConfirmReplace(selectedUrl);
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to remove this image?')) {
      setIsSaving(true);
      try {
        if (onDeleteImage) {
          await onDeleteImage();
        } else {
          await onConfirmReplace('');
        }
        onClose();
      } finally {
        setIsSaving(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700 text-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="font-bold text-base text-white flex items-center gap-2 font-serif">
              <RefreshCw className="w-4 h-4 text-amber-400" />
              <span>{title || 'Replace Image'}</span>
            </h3>
            {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl bg-slate-800 hover:bg-slate-700 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Current vs New Image Preview */}
        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
              Original Asset
            </span>
            <div className="aspect-square rounded-xl bg-slate-900 overflow-hidden border border-slate-800 flex items-center justify-center">
              {currentImageUrl ? (
                <img
                  src={currentImageUrl}
                  alt="Current"
                  className="w-full h-full object-contain p-1"
                />
              ) : (
                <span className="text-[11px] text-slate-600">No Image</span>
              )}
            </div>
          </div>

          <div className="bg-slate-950 p-3 rounded-2xl border border-amber-500/30 space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">
              New Selection Preview
            </span>
            <div className="aspect-square rounded-xl bg-slate-900 overflow-hidden border border-amber-500/40 flex items-center justify-center relative">
              {selectedUrl && !previewError ? (
                <img
                  src={selectedUrl}
                  alt="New Selection"
                  onError={() => setPreviewError(true)}
                  className="w-full h-full object-contain p-1"
                />
              ) : (
                <div className="p-2 text-center text-slate-500 text-xs">
                  <ImageIcon className="w-6 h-6 mx-auto mb-1 opacity-40" />
                  <span>Invalid or No Preview</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Replacement Action Choices */}
        <div className="space-y-3 text-xs">
          
          {/* Option A: Upload from Computer */}
          <div>
            <label className="block text-slate-300 font-bold mb-1.5">
              1. Upload Replacement File (PNG / JPG / WEBP)
            </label>
            <label className="flex items-center justify-center space-x-2 w-full p-3 bg-slate-800 hover:bg-slate-750 border border-dashed border-slate-600 hover:border-amber-400 rounded-2xl cursor-pointer transition text-slate-300 hover:text-amber-300 font-semibold">
              <Upload className="w-4 h-4 text-amber-400" />
              <span>Choose Image From Device</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* Option B: Choose from Media Library */}
          <div>
            <label className="block text-slate-300 font-bold mb-1.5">
              2. Or Choose from Mill 3D & Fabric Vault
            </label>
            <button
              type="button"
              onClick={() => setIsMediaLibraryOpen(true)}
              className="w-full py-2.5 px-3 bg-slate-800 hover:bg-slate-750 border border-slate-700 hover:border-slate-500 rounded-xl text-left flex items-center justify-between transition text-slate-200 font-medium"
            >
              <span className="flex items-center space-x-2">
                <Layers className="w-4 h-4 text-amber-400" />
                <span>Browse 3D Mockups, Swatches & Uploads</span>
              </span>
              <span className="text-[10px] bg-slate-700 px-2 py-0.5 rounded text-amber-400 font-bold">
                Open Vault
              </span>
            </button>
          </div>

          {/* Option C: Direct Image URL */}
          <div>
            <label className="block text-slate-300 font-bold mb-1.5">
              3. Or Enter Web / Public Image URL
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                placeholder="https://... or /mockups/white_tshirt_front.png"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs placeholder-slate-600 focus:outline-none focus:border-amber-500"
              />
              <button
                type="button"
                onClick={() => {
                  if (inputUrl) {
                    setSelectedUrl(inputUrl);
                    setPreviewError(false);
                  }
                }}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl transition"
              >
                Apply
              </button>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
          <button
            type="button"
            disabled={isSaving}
            onClick={handleDelete}
            className="text-red-400 hover:text-red-300 text-xs font-bold flex items-center space-x-1 p-2 rounded-xl hover:bg-red-950/40 transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Remove Image</span>
          </button>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              disabled={isSaving}
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 text-slate-300 hover:bg-slate-700 transition"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={isSaving || !selectedUrl}
              onClick={handleSave}
              className="px-5 py-2 rounded-xl text-xs font-black bg-amber-500 hover:bg-amber-400 text-slate-950 transition shadow-lg flex items-center space-x-1.5 disabled:opacity-40"
            >
              <Check className="w-4 h-4" />
              <span>{isSaving ? 'Updating...' : 'Save & Replace'}</span>
            </button>
          </div>
        </div>

      </div>

      {/* Internal Media Library Picker */}
      {isMediaLibraryOpen && (
        <MediaLibraryModal
          isOpen={isMediaLibraryOpen}
          onClose={() => setIsMediaLibraryOpen(false)}
          singleSelect={true}
          title="Select Replacement Asset from Vault"
          initialSelectedUrls={selectedUrl ? [selectedUrl] : []}
          onSelectImages={(urls) => {
            if (urls.length > 0) {
              setSelectedUrl(urls[0]);
              setPreviewError(false);
            }
          }}
        />
      )}
    </div>
  );
};


import React, { useState } from 'react';
import {
  Image as ImageIcon,
  Upload,
  Trash2,
  RefreshCw,
  Copy,
  Check,
  Search,
  Filter,
  Layers,
  Box,
  Plus,
  ExternalLink
} from 'lucide-react';
import { ImageReplaceModal } from './ImageReplaceModal';

export interface VaultAsset {
  id: string;
  name: string;
  category: '3D Garments' | 'Fabrics' | 'Motifs' | 'Uniforms' | 'Uploads';
  url: string;
  resolution?: string;
  dateAdded?: string;
}

const DEFAULT_VAULT_ASSETS: VaultAsset[] = [
  // 3D Garments
  { id: 'v-tshirt-f', name: '3D Classic Crewneck Tee (Front Studio)', category: '3D Garments', url: '/mockups/white_tshirt_front.png', resolution: '2048x2048' },
  { id: 'v-tshirt-b', name: '3D Classic Crewneck Tee (Back Studio)', category: '3D Garments', url: '/mockups/white_tshirt_back.png', resolution: '2048x2048' },
  { id: 'v-oversized-f', name: '3D Oversized Streetwear Tee (Front)', category: '3D Garments', url: '/mockups/white_oversized_tee.png', resolution: '2048x2048' },
  { id: 'v-polo-f', name: '3D Honeycomb Pique Polo (Front Studio)', category: '3D Garments', url: '/mockups/white_polo_front.png', resolution: '2048x2048' },
  { id: 'v-hoodie-f', name: '3D Heavy Fleece Winter Hoodie (Front)', category: '3D Garments', url: '/mockups/white_hoodie_front.png', resolution: '2048x2048' },
  { id: 'v-jersey-blue', name: 'Sports Match Kit (Hero Blue Edition)', category: '3D Garments', url: '/mockups/jersey_hero_blue.jpg', resolution: '2400x2400' },
  { id: 'v-jersey-b', name: 'Sports Match Kit (Player Back View)', category: '3D Garments', url: '/mockups/white_jersey_back.jpg', resolution: '2400x2400' },
  { id: 'v-jersey-speed', name: 'Sports Jersey Speed Dynamic Front', category: '3D Garments', url: '/mockups/jersey_speed_front.jpg', resolution: '2400x2400' },
  { id: 'v-jersey-bg', name: 'Sports Jersey Black Gold Edition', category: '3D Garments', url: '/mockups/jersey_blackgold_front.jpg', resolution: '2400x2400' },
  { id: 'v-corp-shirt', name: 'Formal Executive Corporate Shirt', category: '3D Garments', url: '/mockups/white_corporate_shirt.jpg', resolution: '1800x1800' },
  { id: 'v-tote', name: 'Organic Cotton Canvas Tote Bag', category: '3D Garments', url: '/mockups/white_tote_bag.jpg', resolution: '1800x1800' },
  { id: 'v-cap', name: 'Classic 6-Panel Athletic Cap', category: '3D Garments', url: '/mockups/white_athletic_cap.jpg', resolution: '1800x1800' },

  // Fabric Swatches
  { id: 'v-swatch-poplin', name: 'Cotton Poplin 130 GSM Pure Weave', category: 'Fabrics', url: '/mockups/tcftbw650_swatch.jpg', resolution: '1200x1200' },
  { id: 'v-swatch-crepe', name: 'Viscose Crepe Fluid Drape 110 GSM', category: 'Fabrics', url: '/mockups/viscose_crepe_swatch.jpg', resolution: '1200x1200' },
  { id: 'v-swatch-silk', name: 'Pure Mulberry Silk Satin 60 GSM', category: 'Fabrics', url: '/mockups/mulberry_silk_swatch.jpg', resolution: '1200x1200' },
  { id: 'v-swatch-linen', name: 'Pure French Flax Linen 160 GSM', category: 'Fabrics', url: '/mockups/french_linen_swatch.jpg', resolution: '1200x1200' },
  { id: 'v-swatch-modal', name: 'Lenzing Modal Satin 90 GSM', category: 'Fabrics', url: '/mockups/modal_satin_swatch.jpg', resolution: '1200x1200' },
  { id: 'v-swatch-slub', name: 'Cotton Viscose Slub 140 GSM', category: 'Fabrics', url: '/mockups/cotton_viscose_slub_swatch.jpg', resolution: '1200x1200' },
  { id: 'v-swatch-bamboo', name: 'Bamboo Spandex Jersey 190 GSM', category: 'Fabrics', url: '/mockups/bamboo_spandex_swatch.jpg', resolution: '1200x1200' },
  { id: 'v-swatch-geo', name: 'Poly Georgette Sheer 75 GSM', category: 'Fabrics', url: '/mockups/poly_georgette_swatch.jpg', resolution: '1200x1200' },
  { id: 'v-swatch-organza', name: 'Glass Silk Organza 40 GSM', category: 'Fabrics', url: '/mockups/silk_organza_swatch.jpg', resolution: '1200x1200' },

  // Uniforms
  { id: 'v-uni-blazer', name: 'Corporate Tailored Blazer', category: 'Uniforms', url: '/uniforms/corporate-main.png', resolution: '1600x1600' },
  { id: 'v-uni-scrub', name: 'Healthcare Antimicrobial Scrub', category: 'Uniforms', url: '/uniforms/healthcare-main.png', resolution: '1600x1600' },
  { id: 'v-uni-apron', name: 'Heavy Twill Bistro Barista Apron', category: 'Uniforms', url: '/uniforms/bistro-apron.jpg', resolution: '1600x1600' },
  { id: 'v-uni-polo', name: 'Industrial Pique Workwear Polo', category: 'Uniforms', url: '/uniforms/pique-polo.jpg', resolution: '1600x1600' }
];

const LOCAL_STORAGE_VAULT_KEY = 'fabricprint_admin_vault_assets_v2';

export const MediaVaultTab: React.FC = () => {
  const [vaultAssets, setVaultAssets] = useState<VaultAsset[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_VAULT_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_VAULT_ASSETS;
  });

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [search, setSearch] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [replaceAsset, setReplaceAsset] = useState<VaultAsset | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const saveVault = (updated: VaultAsset[]) => {
    setVaultAssets(updated);
    try {
      localStorage.setItem(LOCAL_STORAGE_VAULT_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Could not save vault assets to local storage:', e);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const newItems: VaultAsset[] = [];

    Array.from(files).forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        const newAsset: VaultAsset = {
          id: `vault-up-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          name: file.name.replace(/\.[^/.]+$/, ''),
          category: 'Uploads',
          url,
          resolution: 'Custom Upload',
          dateAdded: new Date().toLocaleDateString()
        };
        newItems.push(newAsset);
        if (newItems.length === files.length) {
          saveVault([...newItems, ...vaultAssets]);
          setIsUploading(false);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}" from the media vault?`)) {
      const updated = vaultAssets.filter((a) => a.id !== id);
      saveVault(updated);
    }
  };

  const handleConfirmReplace = (newUrl: string) => {
    if (!replaceAsset) return;
    const updated = vaultAssets.map((a) => (a.id === replaceAsset.id ? { ...a, url: newUrl } : a));
    saveVault(updated);
  };

  const handleCopyLink = (asset: VaultAsset) => {
    navigator.clipboard.writeText(asset.url);
    setCopiedId(asset.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filtered = vaultAssets.filter((a) => {
    const matchesCat = selectedCategory === 'All' || a.category === selectedCategory;
    const matchesSearch = a.name.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-slate-900/90 p-6 rounded-3xl border border-slate-800 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2.5 font-serif">
            <ImageIcon className="w-6 h-6 text-amber-400" />
            <span>Mill Media Vault & Image Replacement Center</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Browse, upload, delete, and replace 3D garment mockups, textile swatches, uniforms, and artwork across all tabs.
          </p>
        </div>

        {/* Upload Button */}
        <label className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-4 py-2.5 rounded-xl transition flex items-center space-x-2 cursor-pointer shadow-lg shrink-0">
          <Upload className="w-4 h-4" />
          <span>+ Upload New Assets</span>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-slate-900/90 p-3.5 rounded-2xl border border-slate-800 shadow-md flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-2 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search assets by file name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex items-center space-x-1 bg-slate-900 p-1 rounded-xl border border-slate-700 overflow-x-auto">
            {['All', '3D Garments', 'Fabrics', 'Uniforms', 'Uploads'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <span className="text-xs text-slate-400 font-bold self-center">
          {filtered.length} Assets Found
        </span>
      </div>

      {/* Upload Progress Alert */}
      {isUploading && (
        <div className="bg-blue-900/60 border border-blue-700 p-4 rounded-2xl text-xs font-bold text-blue-200 flex items-center space-x-2 animate-pulse">
          <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
          <span>Uploading and generating web-ready previews into the vault...</span>
        </div>
      )}

      {/* Media Assets Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {filtered.map((asset) => (
          <div
            key={asset.id}
            className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-lg flex flex-col justify-between group hover:border-amber-500/50 transition relative"
          >
            {/* Image Preview Box */}
            <div className="aspect-square bg-slate-950 overflow-hidden relative flex items-center justify-center p-2">
              <img
                src={asset.url}
                alt={asset.name}
                className="w-full h-full object-contain group-hover:scale-105 transition"
              />

              {/* Top Category Badge */}
              <div className="absolute top-2 left-2 bg-slate-900/90 text-amber-400 text-[9px] font-black uppercase px-2 py-0.5 rounded backdrop-blur-xs border border-slate-700">
                {asset.category}
              </div>

              {/* Action Buttons Overlay on Hover */}
              <div className="absolute inset-0 bg-slate-950/75 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center space-y-2 p-2">
                <button
                  onClick={() => setReplaceAsset(asset)}
                  className="w-full py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg transition shadow flex items-center justify-center space-x-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Replace Image</span>
                </button>

                <div className="flex items-center space-x-1.5 w-full">
                  <button
                    onClick={() => handleCopyLink(asset)}
                    className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg transition flex items-center justify-center space-x-1"
                    title="Copy Image URL"
                  >
                    {copiedId === asset.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Link</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleDelete(asset.id, asset.name)}
                    className="p-1.5 bg-rose-900/80 hover:bg-rose-800 text-rose-200 rounded-lg transition"
                    title="Delete Asset"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Card Info */}
            <div className="p-3 text-xs space-y-0.5 bg-slate-850">
              <h4 className="font-bold text-white text-[11px] truncate" title={asset.name}>
                {asset.name}
              </h4>
              <p className="text-[10px] text-slate-400 font-mono truncate">
                {asset.resolution || 'Standard'}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Image Replace Modal */}
      {replaceAsset && (
        <ImageReplaceModal
          isOpen={!!replaceAsset}
          onClose={() => setReplaceAsset(null)}
          currentImageUrl={replaceAsset.url}
          title={`Replace "${replaceAsset.name}"`}
          subtitle="All components using this image will instantly update to the replacement asset."
          onConfirmReplace={handleConfirmReplace}
          onDeleteImage={() => handleDelete(replaceAsset.id, replaceAsset.name)}
        />
      )}

    </div>
  );
};


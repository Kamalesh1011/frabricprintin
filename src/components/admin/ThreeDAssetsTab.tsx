import React, { useState, useEffect } from 'react';
import {
  Shirt,
  Image as ImageIcon,
  RotateCw,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Eye,
  Sliders,
  DollarSign,
  Sparkles,
  RefreshCw,
  ExternalLink,
  Layers,
  Box
} from 'lucide-react';
import { ImageReplaceModal } from './ImageReplaceModal';
import { GarmentMockup, GarmentModelType } from '../GarmentMockup';
import { ThreeDGarmentViewer, FabricPBRType, LightingPreset, StudioViewSide } from '../ThreeDGarmentViewer';

export interface Garment3DAsset {
  id: string;
  modelType: GarmentModelType;
  title: string;
  category: 'T-Shirts' | 'Polos' | 'Hoodies' | 'Jerseys' | 'Kids' | 'Specialty';
  frontImage: string;
  backImage: string;
  leftSleeveImage?: string;
  rightSleeveImage?: string;
  model3dPath?: string;
  basePrice: number;
  samplePrice: number;
  defaultFabric: string;
  defaultGsm: string;
  colors: { name: string; hex: string; code: string }[];
  lastModified?: string;
}

const DEFAULT_3D_ASSETS: Garment3DAsset[] = [
  {
    id: 'garment-mens-round',
    modelType: 'mens_round_neck',
    title: "Men's Classic Round Neck T-Shirt",
    category: 'T-Shirts',
    frontImage: '/mockups/white_tshirt_front.png',
    backImage: '/mockups/white_tshirt_back.png',
    leftSleeveImage: '/mockups/white_tshirt_front.png',
    rightSleeveImage: '/mockups/white_tshirt_front.png',
    model3dPath: '/assets/3d/tshirt.glb',
    basePrice: 220,
    samplePrice: 350,
    defaultFabric: '100% Super Combed Bio-Washed Cotton',
    defaultGsm: '180 GSM',
    colors: [
      { name: 'White', hex: '#FFFFFF', code: 'WHT' },
      { name: 'Black', hex: '#111827', code: 'BLK' },
      { name: 'Navy Blue', hex: '#1E3A8A', code: 'NVY' },
      { name: 'Red', hex: '#DC2626', code: 'RED' },
      { name: 'Mustard', hex: '#D99B26', code: 'MST' }
    ]
  },
  {
    id: 'garment-oversized-tee',
    modelType: 'oversized_tee',
    title: 'Drop-Shoulder Oversized Streetwear Tee',
    category: 'T-Shirts',
    frontImage: '/mockups/white_oversized_tee.png',
    backImage: '/mockups/white_oversized_tee.png',
    model3dPath: '/assets/3d/tshirt.glb',
    basePrice: 320,
    samplePrice: 480,
    defaultFabric: 'Heavyweight Loop-Knit 100% Cotton',
    defaultGsm: '240 GSM',
    colors: [
      { name: 'White', hex: '#FFFFFF', code: 'WHT' },
      { name: 'Black', hex: '#111827', code: 'BLK' },
      { name: 'Bottle Green', hex: '#0F766E', code: 'BGR' },
      { name: 'Maroon', hex: '#7F1D1D', code: 'MRN' }
    ]
  },
  {
    id: 'garment-polo-shirt',
    modelType: 'polo_shirt',
    title: 'Classic Honeycomb Pique Polo Shirt',
    category: 'Polos',
    frontImage: '/mockups/white_polo_front.png',
    backImage: '/mockups/white_polo_front.png',
    model3dPath: '/assets/3d/tshirt.glb',
    basePrice: 360,
    samplePrice: 520,
    defaultFabric: 'Matty Pique Combed Cotton Poly Weave',
    defaultGsm: '230 GSM',
    colors: [
      { name: 'White', hex: '#FFFFFF', code: 'WHT' },
      { name: 'Black', hex: '#111827', code: 'BLK' },
      { name: 'Navy', hex: '#1E3A8A', code: 'NVY' },
      { name: 'Royal Blue', hex: '#2563EB', code: 'RYB' }
    ]
  },
  {
    id: 'garment-hoodie',
    modelType: 'hoodie',
    title: 'Heavyweight Fleece Winter Hoodie',
    category: 'Hoodies',
    frontImage: '/mockups/white_hoodie_front.png',
    backImage: '/mockups/white_hoodie_front.png',
    model3dPath: '/assets/3d/tshirt.glb',
    basePrice: 580,
    samplePrice: 850,
    defaultFabric: '3-Thread Brushed Heavy French Terry Fleece',
    defaultGsm: '340 GSM',
    colors: [
      { name: 'White', hex: '#FFFFFF', code: 'WHT' },
      { name: 'Black', hex: '#111827', code: 'BLK' },
      { name: 'Charcoal Grey', hex: '#374151', code: 'CHR' },
      { name: 'Maroon', hex: '#7F1D1D', code: 'MRN' }
    ]
  },
  {
    id: 'garment-jersey-cricket',
    modelType: 'cricket_jersey',
    title: 'Pro Sublimation Sports Match Jersey',
    category: 'Jerseys',
    frontImage: '/mockups/jersey_hero_blue.jpg',
    backImage: '/mockups/white_jersey_back.jpg',
    leftSleeveImage: '/mockups/jersey_speed_front.jpg',
    rightSleeveImage: '/mockups/jersey_blackgold_front.jpg',
    basePrice: 340,
    samplePrice: 550,
    defaultFabric: 'Micro-Polyester Dri-Fit Jacquard',
    defaultGsm: '170 GSM',
    colors: [
      { name: 'India Royal Blue', hex: '#1E3A8A', code: 'BLU' },
      { name: 'Cyber Neon Yellow', hex: '#EAB308', code: 'NYL' },
      { name: 'Black Gold Edition', hex: '#18181B', code: 'BKG' },
      { name: 'Speed Red', hex: '#DC2626', code: 'RED' }
    ]
  },
  {
    id: 'garment-womens-round',
    modelType: 'womens_round_neck',
    title: "Women's Fitted Bio-Wash Tee",
    category: 'T-Shirts',
    frontImage: '/mockups/white_tshirt_front.png',
    backImage: '/mockups/white_tshirt_back.png',
    basePrice: 210,
    samplePrice: 340,
    defaultFabric: '100% Combed Cotton Single Jersey',
    defaultGsm: '180 GSM',
    colors: [
      { name: 'White', hex: '#FFFFFF', code: 'WHT' },
      { name: 'Baby Pink', hex: '#F472B6', code: 'PNK' },
      { name: 'Black', hex: '#111827', code: 'BLK' },
      { name: 'Lilac', hex: '#C084FC', code: 'LLC' }
    ]
  },
  {
    id: 'garment-crop-top',
    modelType: 'crop_top',
    title: 'Summer Ribbed Cotton Crop Top',
    category: 'Specialty',
    frontImage: '/mockups/white_tshirt_front.png',
    backImage: '/mockups/white_tshirt_front.png',
    basePrice: 195,
    samplePrice: 320,
    defaultFabric: '95% Cotton 5% Spandex Stretch Rib',
    defaultGsm: '200 GSM',
    colors: [
      { name: 'White', hex: '#FFFFFF', code: 'WHT' },
      { name: 'Black', hex: '#111827', code: 'BLK' },
      { name: 'Olive Green', hex: '#4D7C0F', code: 'OLV' }
    ]
  },
  {
    id: 'garment-kids-tee',
    modelType: 'kids_tee',
    title: "Kids Anti-Bacterial Crewneck T-Shirt",
    category: 'Kids',
    frontImage: '/mockups/white_boys_jersey.jpg',
    backImage: '/mockups/white_jersey_back.jpg',
    basePrice: 160,
    samplePrice: 280,
    defaultFabric: 'OEKO-TEX Certified Organic Cotton',
    defaultGsm: '170 GSM',
    colors: [
      { name: 'White', hex: '#FFFFFF', code: 'WHT' },
      { name: 'Sky Blue', hex: '#7DD3FC', code: 'SKB' },
      { name: 'Sunny Yellow', hex: '#FACC15', code: 'YEL' }
    ]
  }
];

const LOCAL_STORAGE_KEY = 'fabricprint_admin_3d_assets_v2';

export const ThreeDAssetsTab: React.FC = () => {
  const [assets, setAssets] = useState<Garment3DAsset[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_3D_ASSETS;
  });

  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [search, setSearch] = useState<string>('');
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [tempPrice, setTempPrice] = useState<number>(0);

  // Image Replacement Modal State
  const [replaceModalState, setReplaceModalState] = useState<{
    isOpen: boolean;
    assetId: string;
    imageKey: 'frontImage' | 'backImage' | 'leftSleeveImage' | 'rightSleeveImage';
    currentUrl: string;
    label: string;
  } | null>(null);

  // Colorway Editor Modal State
  const [colorModalAsset, setColorModalAsset] = useState<Garment3DAsset | null>(null);
  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#2563EB');
  const [newColorCode, setNewColorCode] = useState('BLU');

  // Interactive 3D Live Inspection Modal
  const [inspectAsset, setInspectAsset] = useState<Garment3DAsset | null>(null);
  const [inspectSide, setInspectSide] = useState<StudioViewSide>('front');
  const [inspectColorHex, setInspectColorHex] = useState<string>('#FFFFFF');
  const [inspectPbr, setInspectPbr] = useState<FabricPBRType>('cotton_jersey');
  const [inspectLighting, setInspectLighting] = useState<LightingPreset>('studio');

  // Save changes to localStorage
  const saveAssets = (updated: Garment3DAsset[]) => {
    setAssets(updated);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Could not save 3D assets to local storage:', e);
    }
  };

  const handleUpdateImage = (newUrl: string) => {
    if (!replaceModalState) return;
    const { assetId, imageKey } = replaceModalState;
    const updated = assets.map((a) => {
      if (a.id === assetId) {
        return {
          ...a,
          [imageKey]: newUrl,
          lastModified: new Date().toLocaleDateString()
        };
      }
      return a;
    });
    saveAssets(updated);
  };

  const handleDeleteImage = () => {
    if (!replaceModalState) return;
    const { assetId, imageKey } = replaceModalState;
    const updated = assets.map((a) => {
      if (a.id === assetId) {
        return {
          ...a,
          [imageKey]: '',
          lastModified: new Date().toLocaleDateString()
        };
      }
      return a;
    });
    saveAssets(updated);
  };

  const handleSavePrice = (id: string) => {
    if (tempPrice <= 0) return;
    const updated = assets.map((a) => (a.id === id ? { ...a, basePrice: tempPrice } : a));
    saveAssets(updated);
    setEditingPriceId(null);
  };

  const handleAddColor = () => {
    if (!colorModalAsset || !newColorName) return;
    const newEntry = {
      name: newColorName,
      hex: newColorHex,
      code: newColorCode || newColorName.slice(0, 3).toUpperCase()
    };
    const updated = assets.map((a) => {
      if (a.id === colorModalAsset.id) {
        return {
          ...a,
          colors: [...a.colors, newEntry]
        };
      }
      return a;
    });
    saveAssets(updated);
    setColorModalAsset((prev) => (prev ? { ...prev, colors: [...prev.colors, newEntry] } : null));
    setNewColorName('');
  };

  const handleDeleteColor = (assetId: string, hexToDelete: string) => {
    const updated = assets.map((a) => {
      if (a.id === assetId) {
        return {
          ...a,
          colors: a.colors.filter((c) => c.hex !== hexToDelete)
        };
      }
      return a;
    });
    saveAssets(updated);
    if (colorModalAsset && colorModalAsset.id === assetId) {
      setColorModalAsset({
        ...colorModalAsset,
        colors: colorModalAsset.colors.filter((c) => c.hex !== hexToDelete)
      });
    }
  };

  const handleResetToDefaults = () => {
    if (confirm('Reset all 3D Garment models and mockups to factory factory defaults?')) {
      saveAssets(DEFAULT_3D_ASSETS);
    }
  };

  const filteredAssets = assets.filter((a) => {
    const matchesCat = filterCategory === 'All' || a.category === filterCategory;
    const matchesSearch =
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.defaultFabric.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-slate-900/90 p-6 rounded-3xl border border-slate-800 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2.5 font-serif">
            <Box className="w-6 h-6 text-amber-400" />
            <span>3D Garment Models, Mockup Textures & Asset Manager</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Replace and delete front, back, and sleeve mockup images, edit base wholesale prices, and configure color palettes across all customizable garments.
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={handleResetToDefaults}
            className="px-3 py-2 bg-slate-900 hover:bg-slate-700 border border-slate-700 text-slate-300 rounded-xl text-xs font-bold transition flex items-center space-x-1.5"
            title="Reset to mill defaults"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset All Defaults</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-slate-900/90 p-3.5 rounded-2xl border border-slate-800 shadow-md flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-2 flex-1">
          <input
            type="text"
            placeholder="Search 3D garments by name or fabric..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 max-w-sm bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />

          <div className="flex items-center space-x-1 bg-slate-900 p-1 rounded-xl border border-slate-700 overflow-x-auto">
            {['All', 'T-Shirts', 'Polos', 'Hoodies', 'Jerseys', 'Kids', 'Specialty'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition shrink-0 ${
                  filterCategory === cat
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
          Showing {filteredAssets.length} of {assets.length} 3D Garments
        </span>
      </div>

      {/* 3D Garments Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredAssets.map((asset) => (
          <div
            key={asset.id}
            className="bg-slate-900/90 rounded-3xl border border-slate-800 overflow-hidden shadow-xl flex flex-col justify-between hover:border-slate-700 transition"
          >
            {/* Top Bar */}
            <div className="p-5 border-b border-slate-700 bg-slate-850 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                  {asset.category} · {asset.modelType}
                </span>
                <h3 className="font-extrabold text-white text-base mt-1 font-serif">
                  {asset.title}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {asset.defaultFabric} · <span className="font-mono text-slate-300 font-bold">{asset.defaultGsm}</span>
                </p>
              </div>

              {/* Price & Live 3D Inspect Trigger */}
              <div className="text-right space-y-1">
                <div className="flex items-center justify-end space-x-1">
                  <span className="text-xs text-slate-400">Base Price:</span>
                  {editingPriceId === asset.id ? (
                    <div className="flex items-center space-x-1">
                      <input
                        type="number"
                        value={tempPrice}
                        onChange={(e) => setTempPrice(Number(e.target.value))}
                        className="w-16 bg-slate-950 border border-amber-500 rounded px-1.5 py-0.5 text-xs text-amber-400 font-bold font-mono"
                        autoFocus
                      />
                      <button
                        onClick={() => handleSavePrice(asset.id)}
                        className="p-1 bg-emerald-600 text-white rounded hover:bg-emerald-500"
                        title="Save Price"
                      >
                        <Check className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => setEditingPriceId(null)}
                        className="p-1 bg-slate-700 text-slate-300 rounded hover:bg-slate-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setEditingPriceId(asset.id);
                        setTempPrice(asset.basePrice);
                      }}
                      className="group flex items-center space-x-1 font-mono font-black text-emerald-400 text-sm hover:underline"
                      title="Click to Edit Base Price"
                    >
                      <span>₹{asset.basePrice}</span>
                      <Edit2 className="w-3 h-3 opacity-0 group-hover:opacity-100 transition text-slate-400" />
                    </button>
                  )}
                </div>

                <button
                  onClick={() => {
                    setInspectAsset(asset);
                    setInspectColorHex(asset.colors[0]?.hex || '#FFFFFF');
                  }}
                  className="px-3 py-1 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 rounded-xl text-[11px] font-bold flex items-center space-x-1 transition ml-auto"
                >
                  <Eye className="w-3 h-3" />
                  <span>3D Inspect</span>
                </button>
              </div>
            </div>

            {/* Visual Multi-View Panels (Front, Back, Sleeves) */}
            <div className="p-5 space-y-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Garment Mockup Angles & Textures (Click to Replace or Delete)
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {/* 1. FRONT VIEW */}
                <div className="bg-slate-950 p-2.5 rounded-2xl border border-slate-700/80 text-center space-y-1.5 group relative">
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold px-1">
                    <span>FRONT</span>
                    <span className="text-emerald-400">2D/3D</span>
                  </div>

                  <div className="aspect-square bg-slate-900 rounded-xl overflow-hidden flex items-center justify-center p-1 relative border border-slate-800">
                    {asset.frontImage ? (
                      <img
                        src={asset.frontImage}
                        alt="Front Mockup"
                        className="w-full h-full object-contain group-hover:scale-105 transition"
                      />
                    ) : (
                      <span className="text-[10px] text-red-400 font-bold">No Image</span>
                    )}

                    {/* Quick Replace Overlay Button */}
                    <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition flex items-center justify-center space-x-1.5">
                      <button
                        onClick={() =>
                          setReplaceModalState({
                            isOpen: true,
                            assetId: asset.id,
                            imageKey: 'frontImage',
                            currentUrl: asset.frontImage,
                            label: `${asset.title} - Front View`
                          })
                        }
                        className="p-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition shadow"
                        title="Replace Front Mockup"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      setReplaceModalState({
                        isOpen: true,
                        assetId: asset.id,
                        imageKey: 'frontImage',
                        currentUrl: asset.frontImage,
                        label: `${asset.title} - Front View`
                      })
                    }
                    className="text-[10px] font-bold text-amber-400 hover:underline block w-full truncate"
                  >
                    Replace Front →
                  </button>
                </div>

                {/* 2. BACK VIEW */}
                <div className="bg-slate-950 p-2.5 rounded-2xl border border-slate-700/80 text-center space-y-1.5 group relative">
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold px-1">
                    <span>BACK</span>
                    <span className="text-emerald-400">2D/3D</span>
                  </div>

                  <div className="aspect-square bg-slate-900 rounded-xl overflow-hidden flex items-center justify-center p-1 relative border border-slate-800">
                    {asset.backImage ? (
                      <img
                        src={asset.backImage}
                        alt="Back Mockup"
                        className="w-full h-full object-contain group-hover:scale-105 transition"
                      />
                    ) : (
                      <span className="text-[10px] text-slate-600">Same as Front</span>
                    )}

                    <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition flex items-center justify-center space-x-1.5">
                      <button
                        onClick={() =>
                          setReplaceModalState({
                            isOpen: true,
                            assetId: asset.id,
                            imageKey: 'backImage',
                            currentUrl: asset.backImage,
                            label: `${asset.title} - Back View`
                          })
                        }
                        className="p-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition shadow"
                        title="Replace Back Mockup"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      setReplaceModalState({
                        isOpen: true,
                        assetId: asset.id,
                        imageKey: 'backImage',
                        currentUrl: asset.backImage,
                        label: `${asset.title} - Back View`
                      })
                    }
                    className="text-[10px] font-bold text-amber-400 hover:underline block w-full truncate"
                  >
                    Replace Back →
                  </button>
                </div>

                {/* 3. LEFT SLEEVE */}
                <div className="bg-slate-950 p-2.5 rounded-2xl border border-slate-700/80 text-center space-y-1.5 group relative">
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold px-1">
                    <span>L-SLEEVE</span>
                    <span className="text-slate-500">Angle</span>
                  </div>

                  <div className="aspect-square bg-slate-900 rounded-xl overflow-hidden flex items-center justify-center p-1 relative border border-slate-800">
                    {asset.leftSleeveImage ? (
                      <img
                        src={asset.leftSleeveImage}
                        alt="Left Sleeve"
                        className="w-full h-full object-contain group-hover:scale-105 transition"
                      />
                    ) : (
                      <span className="text-[10px] text-slate-600">Auto Mask</span>
                    )}

                    <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition flex items-center justify-center space-x-1.5">
                      <button
                        onClick={() =>
                          setReplaceModalState({
                            isOpen: true,
                            assetId: asset.id,
                            imageKey: 'leftSleeveImage',
                            currentUrl: asset.leftSleeveImage || '',
                            label: `${asset.title} - Left Sleeve`
                          })
                        }
                        className="p-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition shadow"
                        title="Replace Left Sleeve"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      setReplaceModalState({
                        isOpen: true,
                        assetId: asset.id,
                        imageKey: 'leftSleeveImage',
                        currentUrl: asset.leftSleeveImage || '',
                        label: `${asset.title} - Left Sleeve`
                      })
                    }
                    className="text-[10px] font-bold text-amber-400 hover:underline block w-full truncate"
                  >
                    Replace Left →
                  </button>
                </div>

                {/* 4. RIGHT SLEEVE */}
                <div className="bg-slate-950 p-2.5 rounded-2xl border border-slate-700/80 text-center space-y-1.5 group relative">
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold px-1">
                    <span>R-SLEEVE</span>
                    <span className="text-slate-500">Angle</span>
                  </div>

                  <div className="aspect-square bg-slate-900 rounded-xl overflow-hidden flex items-center justify-center p-1 relative border border-slate-800">
                    {asset.rightSleeveImage ? (
                      <img
                        src={asset.rightSleeveImage}
                        alt="Right Sleeve"
                        className="w-full h-full object-contain group-hover:scale-105 transition"
                      />
                    ) : (
                      <span className="text-[10px] text-slate-600">Auto Mask</span>
                    )}

                    <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition flex items-center justify-center space-x-1.5">
                      <button
                        onClick={() =>
                          setReplaceModalState({
                            isOpen: true,
                            assetId: asset.id,
                            imageKey: 'rightSleeveImage',
                            currentUrl: asset.rightSleeveImage || '',
                            label: `${asset.title} - Right Sleeve`
                          })
                        }
                        className="p-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition shadow"
                        title="Replace Right Sleeve"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      setReplaceModalState({
                        isOpen: true,
                        assetId: asset.id,
                        imageKey: 'rightSleeveImage',
                        currentUrl: asset.rightSleeveImage || '',
                        label: `${asset.title} - Right Sleeve`
                      })
                    }
                    className="text-[10px] font-bold text-amber-400 hover:underline block w-full truncate"
                  >
                    Replace Right →
                  </button>
                </div>
              </div>

              {/* Color Swatches Management */}
              <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 block">
                    Supported Color Swatches ({asset.colors.length}):
                  </span>
                  <div className="flex items-center space-x-1.5 mt-1.5 flex-wrap gap-y-1">
                    {asset.colors.map((color) => (
                      <div
                        key={color.hex}
                        className="w-5 h-5 rounded-full border border-white/20 shadow-sm relative group cursor-pointer"
                        style={{ backgroundColor: color.hex }}
                        title={`${color.name} (${color.hex})`}
                      >
                        <button
                          onClick={() => handleDeleteColor(asset.id, color.hex)}
                          className="absolute -top-1 -right-1 w-3 h-3 bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                          title="Delete Color"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => setColorModalAsset(asset)}
                      className="w-5 h-5 rounded-full border border-dashed border-slate-500 hover:border-amber-400 text-slate-400 hover:text-amber-400 flex items-center justify-center text-xs transition"
                      title="Add Color Swatch"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => setColorModalAsset(asset)}
                  className="text-xs font-bold text-slate-300 hover:text-amber-400 transition"
                >
                  Manage Colors →
                </button>
              </div>

            </div>

          </div>
        ))}
      </div>

      {/* MODAL 1: IMAGE REPLACE DIALOG */}
      {replaceModalState?.isOpen && (
        <ImageReplaceModal
          isOpen={replaceModalState.isOpen}
          onClose={() => setReplaceModalState(null)}
          currentImageUrl={replaceModalState.currentUrl}
          title={`Replace ${replaceModalState.label}`}
          subtitle="Upload high-res PNG with transparent background for realistic 3D and 2D canvas drape."
          onConfirmReplace={handleUpdateImage}
          onDeleteImage={handleDeleteImage}
        />
      )}

      {/* MODAL 2: COLORWAYS & SWATCH PALETTE MANAGER */}
      {colorModalAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700 text-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-base font-serif">Manage Garment Colors</h3>
                <p className="text-xs text-slate-400">{colorModalAsset.title}</p>
              </div>
              <button
                onClick={() => setColorModalAsset(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Existing Colors List */}
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {colorModalAsset.colors.map((c) => (
                <div
                  key={c.hex}
                  className="flex items-center justify-between p-2 rounded-xl bg-slate-950 border border-slate-800 text-xs"
                >
                  <div className="flex items-center space-x-2.5">
                    <div
                      className="w-5 h-5 rounded-full border border-white/20"
                      style={{ backgroundColor: c.hex }}
                    />
                    <span className="font-bold text-white">{c.name}</span>
                    <span className="text-[10px] font-mono text-slate-400">{c.code}</span>
                  </div>
                  <button
                    onClick={() => handleDeleteColor(colorModalAsset.id, c.hex)}
                    className="p-1 text-slate-500 hover:text-red-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add New Color Form */}
            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-2 text-xs">
              <span className="font-bold text-amber-400 block">+ Add New Color Swatch</span>
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="Color Name"
                  value={newColorName}
                  onChange={(e) => setNewColorName(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-white"
                />
                <input
                  type="text"
                  placeholder="CODE (e.g. BLK)"
                  value={newColorCode}
                  onChange={(e) => setNewColorCode(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-white"
                />
                <div className="flex items-center space-x-1">
                  <input
                    type="color"
                    value={newColorHex}
                    onChange={(e) => setNewColorHex(e.target.value)}
                    className="w-8 h-8 rounded border border-slate-700 cursor-pointer"
                  />
                  <span className="font-mono text-[10px] text-slate-400">{newColorHex}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleAddColor}
                disabled={!newColorName}
                className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-1.5 rounded-lg transition disabled:opacity-40"
              >
                Add Swatch to Garment
              </button>
            </div>

            <button
              onClick={() => setColorModalAsset(null)}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition"
            >
              Done Managing Colors
            </button>
          </div>
        </div>
      )}

      {/* MODAL 3: INTERACTIVE 3D LIVE INSPECTION PREVIEW DRAWER */}
      {inspectAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 text-white rounded-3xl max-w-4xl w-full h-[85vh] flex flex-col overflow-hidden shadow-2xl">
            {/* Top Bar */}
            <div className="p-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-base text-white font-serif flex items-center gap-2">
                  <Box className="w-5 h-5 text-amber-400" />
                  <span>3D Real-Time Inspection & Texture Verification</span>
                </h3>
                <p className="text-xs text-slate-400">
                  {inspectAsset.title} · {inspectAsset.defaultFabric} ({inspectAsset.defaultGsm})
                </p>
              </div>
              <button
                onClick={() => setInspectAsset(null)}
                className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800 hover:bg-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Main 3D Canvas Area */}
            <div className="flex-1 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 relative flex items-center justify-center overflow-hidden">
              <ThreeDGarmentViewer
                designUrl={null}
                color={{ hex: inspectColorHex, name: 'Sample' }}
                rotation={0}
                scalePercent={100}
                artworkPlacement="chest_center"
                isFlippedH={false}
                side={inspectSide}
                autoRotate={false}
                modelType={inspectAsset.modelType}
                fabricPbr={inspectPbr}
                lightingPreset={inspectLighting}
                customText="FABRIC PRINT 3D"
                customTextColor="#F59E0B"
              />

              {/* View Angles Quick Switcher */}
              <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md p-1.5 rounded-2xl border border-slate-700 flex items-center space-x-1">
                {(['front', 'back', 'left_sleeve', 'right_sleeve'] as StudioViewSide[]).map((s) => (
                  <button
                    key={s}
                    onClick={() => setInspectSide(s)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition capitalize ${
                      inspectSide === s
                        ? 'bg-amber-500 text-slate-950 font-black'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {s.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Bottom Controls Bar */}
            <div className="p-4 bg-slate-950 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              {/* Color Selector */}
              <div>
                <span className="block text-slate-400 font-bold mb-1.5">Garment Colorway</span>
                <div className="flex items-center space-x-1.5">
                  {inspectAsset.colors.map((c) => (
                    <button
                      key={c.hex}
                      onClick={() => setInspectColorHex(c.hex)}
                      className={`w-6 h-6 rounded-full border-2 transition ${
                        inspectColorHex === c.hex ? 'border-amber-400 scale-110 shadow-md' : 'border-slate-700'
                      }`}
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>

              {/* PBR Physical Weave */}
              <div>
                <span className="block text-slate-400 font-bold mb-1.5">Physical Fabric PBR Shader</span>
                <select
                  value={inspectPbr}
                  onChange={(e) => setInspectPbr(e.target.value as FabricPBRType)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white font-semibold"
                >
                  <option value="cotton_jersey">Single Jersey Cotton (220 GSM)</option>
                  <option value="french_terry">French Terry Fleece (320 GSM)</option>
                  <option value="interlock_poly">Interlock Poly Sports Mesh</option>
                  <option value="linen_silk">Slub Linen & Silk Sheen</option>
                </select>
              </div>

              {/* Lighting */}
              <div>
                <span className="block text-slate-400 font-bold mb-1.5">Studio Lighting Preset</span>
                <select
                  value={inspectLighting}
                  onChange={(e) => setInspectLighting(e.target.value as LightingPreset)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white font-semibold"
                >
                  <option value="studio">Studio Spotlight (Crisp Mill)</option>
                  <option value="daylight">Daylight Mill (Natural Sunlight)</option>
                  <option value="neon">Neon Tokyo (Streetwear Glow)</option>
                </select>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

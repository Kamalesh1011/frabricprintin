import React, { useState } from 'react';
import {
  X,
  Upload,
  Check,
  Search,
  Image as ImageIcon,
  CheckCircle2,
  Trash2,
  Plus
} from 'lucide-react';

interface MediaLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImages: (selectedUrls: string[]) => void;
  initialSelectedUrls?: string[];
  singleSelect?: boolean;
  title?: string;
}

// Comprehensive built-in 3D garment mockups, textile swatches, and motif library
const STOCK_MEDIA_LIBRARY = [
  // 3D Garment Mockups
  {
    id: 'mockup-tshirt-front',
    name: '3D Classic Crew T-Shirt (Front Studio)',
    category: '3D Garments',
    url: '/mockups/white_tshirt_front.png'
  },
  {
    id: 'mockup-tshirt-back',
    name: '3D Classic Crew T-Shirt (Back Studio)',
    category: '3D Garments',
    url: '/mockups/white_tshirt_back.png'
  },
  {
    id: 'mockup-oversized-front',
    name: '3D Oversized Streetwear Tee (Front)',
    category: '3D Garments',
    url: '/mockups/white_oversized_tee.png'
  },
  {
    id: 'mockup-polo-front',
    name: '3D Pique Collar Polo (Front Studio)',
    category: '3D Garments',
    url: '/mockups/white_polo_front.png'
  },
  {
    id: 'mockup-hoodie-front',
    name: '3D Heavyweight Fleece Hoodie (Front)',
    category: '3D Garments',
    url: '/mockups/white_hoodie_front.png'
  },
  {
    id: 'mockup-jersey-blue',
    name: 'Sports Jersey Pro Match Kit (Hero Blue)',
    category: '3D Garments',
    url: '/mockups/jersey_hero_blue.jpg'
  },
  {
    id: 'mockup-jersey-back',
    name: 'Sports Jersey Back Player View',
    category: '3D Garments',
    url: '/mockups/white_jersey_back.jpg'
  },
  {
    id: 'mockup-jersey-speed',
    name: 'Sports Jersey Speed Dynamic Front',
    category: '3D Garments',
    url: '/mockups/jersey_speed_front.jpg'
  },
  {
    id: 'mockup-jersey-blackgold',
    name: 'Sports Jersey Black Gold Edition',
    category: '3D Garments',
    url: '/mockups/jersey_blackgold_front.jpg'
  },
  {
    id: 'mockup-corp-shirt',
    name: 'Executive Corporate Formal Shirt',
    category: '3D Garments',
    url: '/mockups/white_corporate_shirt.jpg'
  },
  {
    id: 'mockup-tote-bag',
    name: 'Organic Cotton Canvas Tote Bag',
    category: 'Merch',
    url: '/mockups/white_tote_bag.jpg'
  },
  {
    id: 'mockup-athletic-cap',
    name: 'Classic 6-Panel Athletic Cap',
    category: 'Merch',
    url: '/mockups/white_athletic_cap.jpg'
  },
  // Fabric Swatches & Physical Textures
  {
    id: 'swatch-poplin-cotton',
    name: 'Organic Cotton Poplin 130 GSM',
    category: 'Cotton',
    url: '/mockups/tcftbw650_swatch.jpg'
  },
  {
    id: 'swatch-viscose-crepe',
    name: 'Viscose Crepe Drape 110 GSM',
    category: 'Viscose',
    url: '/mockups/viscose_crepe_swatch.jpg'
  },
  {
    id: 'swatch-mulberry-silk',
    name: 'Pure Mulberry Silk Satin 60 GSM',
    category: 'Silk',
    url: '/mockups/mulberry_silk_swatch.jpg'
  },
  {
    id: 'swatch-french-linen',
    name: 'Pure French Flax Linen 160 GSM',
    category: 'Linen',
    url: '/mockups/french_linen_swatch.jpg'
  },
  {
    id: 'swatch-modal-satin',
    name: 'Lenzing Modal Satin 90 GSM',
    category: 'Modal',
    url: '/mockups/modal_satin_swatch.jpg'
  },
  {
    id: 'swatch-cotton-slub',
    name: 'Cotton Viscose Slub Texture 140 GSM',
    category: 'Cotton',
    url: '/mockups/cotton_viscose_slub_swatch.jpg'
  },
  {
    id: 'swatch-bamboo-spandex',
    name: 'Bamboo Spandex Jersey 190 GSM',
    category: 'Rayon',
    url: '/mockups/bamboo_spandex_swatch.jpg'
  },
  {
    id: 'swatch-poly-georgette',
    name: 'Poly Georgette Sheer 75 GSM',
    category: 'Polyester',
    url: '/mockups/poly_georgette_swatch.jpg'
  },
  {
    id: 'swatch-silk-organza',
    name: 'Glass Silk Organza 40 GSM',
    category: 'Organza',
    url: '/mockups/silk_organza_swatch.jpg'
  },
  {
    id: 'swatch-tcs210',
    name: 'Single Jersey Ring-Spun Combed Cotton 210 GSM',
    category: 'Cotton',
    url: '/mockups/tcs210_swatch.jpg'
  },
  {
    id: 'swatch-tcs225',
    name: 'Heavyweight Matte Cotton 225 GSM',
    category: 'Cotton',
    url: '/mockups/tcs225_swatch.jpg'
  },
  // Unsplash Textile Textures & Motifs
  {
    id: 'media-1',
    name: 'Cotton Mulmul Weave White',
    category: 'Cotton',
    url: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&q=60&w=800'
  },
  {
    id: 'media-7',
    name: 'Botanical Floral Printed Fabric',
    category: 'Prints',
    url: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&q=60&w=800'
  },
  {
    id: 'media-8',
    name: 'Traditional Block Print Motif',
    category: 'Prints',
    url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=60&w=800'
  }
];

export const MediaLibraryModal: React.FC<MediaLibraryModalProps> = ({
  isOpen,
  onClose,
  onSelectImages,
  initialSelectedUrls = [],
  singleSelect = false,
  title
}) => {
  const [activeTab, setActiveTab] = useState<'library' | 'upload'>('library');
  const [search, setSearch] = useState('');
  const [customMediaList, setCustomMediaList] = useState(STOCK_MEDIA_LIBRARY);
  const [selectedUrls, setSelectedUrls] = useState<string[]>(initialSelectedUrls);
  const [uploading, setUploading] = useState(false);

  if (!isOpen) return null;

  const toggleSelectImage = (url: string) => {
    if (singleSelect) {
      setSelectedUrls([url]);
    } else {
      if (selectedUrls.includes(url)) {
        setSelectedUrls(selectedUrls.filter((u) => u !== url));
      } else {
        setSelectedUrls([...selectedUrls, url]);
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const newItems: typeof STOCK_MEDIA_LIBRARY = [];

    Array.from(files).forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        const newItem = {
          id: `upload-${Date.now()}-${Math.random()}`,
          name: file.name,
          category: 'Uploaded',
          url
        };
        setCustomMediaList((prev) => [newItem, ...prev]);
        setSelectedUrls((prev) => (prev.includes(url) ? prev : [...prev, url]));
      };
      reader.readAsDataURL(file);
    });

    setTimeout(() => {
      setUploading(false);
      setActiveTab('library');
    }, 400);
  };

  const handleConfirmInsert = () => {
    onSelectImages(selectedUrls);
    onClose();
  };

  const filteredMedia = customMediaList.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase()) || m.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
      <div className="bg-slate-900 border border-slate-700 text-white rounded-3xl max-w-4xl w-full flex flex-col max-h-[85vh] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div>
            <h3 className="font-bold text-base text-white flex items-center space-x-2">
              <ImageIcon className="w-5 h-5 text-amber-400" />
              <span>{title || 'Media Library & Uploads'}</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {singleSelect
                ? 'Select or upload an image from device or stock library.'
                : 'Select or upload product images. First selected image becomes main product thumbnail.'}
            </p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800 hover:bg-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="px-5 pt-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('library')}
              className={`px-4 py-2 rounded-t-xl text-xs font-bold transition border-t border-x ${
                activeTab === 'library'
                  ? 'bg-slate-800 text-amber-400 border-slate-700'
                  : 'text-slate-400 border-transparent hover:text-white'
              }`}
            >
              Media Library ({customMediaList.length})
            </button>
            <button
              onClick={() => setActiveTab('upload')}
              className={`px-4 py-2 rounded-t-xl text-xs font-bold transition border-t border-x ${
                activeTab === 'upload'
                  ? 'bg-slate-800 text-amber-400 border-slate-700'
                  : 'text-slate-400 border-transparent hover:text-white'
              }`}
            >
              Upload Files
            </button>
          </div>

          {activeTab === 'library' && (
            <div className="relative mb-2 w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search media..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
          )}
        </div>

        {/* Body Content */}
        <div className="p-6 flex-1 overflow-y-auto min-h-[360px] bg-slate-950/60">
          {activeTab === 'upload' ? (
            <div className="border-2 border-dashed border-slate-700 hover:border-amber-500 rounded-3xl p-12 text-center bg-slate-900/60 transition cursor-pointer relative max-w-lg mx-auto my-8">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileUpload}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <Upload className="w-12 h-12 text-amber-400 mx-auto mb-3" />
              <h4 className="font-bold text-white text-sm">Drop fabric files here to upload</h4>
              <p className="text-xs text-slate-400 mt-1">Select one or multiple images from your computer</p>
              <button className="mt-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs py-2 px-4 rounded-xl shadow-md">
                Select Files
              </button>
              {uploading && <p className="text-xs text-emerald-400 font-bold mt-3 animate-pulse">Processing media upload...</p>}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredMedia.map((item) => {
                const selectedIndex = selectedUrls.indexOf(item.url);
                const isSelected = selectedIndex !== -1;
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleSelectImage(item.url)}
                    className={`group relative rounded-2xl overflow-hidden border-2 cursor-pointer transition aspect-square ${
                      isSelected
                        ? 'border-amber-400 ring-2 ring-amber-400/30 scale-102 shadow-lg'
                        : 'border-slate-800 hover:border-slate-600 bg-slate-900'
                    }`}
                  >
                    <img src={item.url} alt={item.name} className="w-full h-full object-cover" />

                    {/* Badge Overlay */}
                    <div className="absolute inset-0 bg-slate-950/30 group-hover:bg-slate-950/10 transition" />

                    {/* Delete Item Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`Remove "${item.name}" from media library?`)) {
                          setCustomMediaList((prev) => prev.filter((m) => m.id !== item.id));
                          setSelectedUrls((prev) => prev.filter((u) => u !== item.url));
                        }
                      }}
                      className="absolute top-2 left-2 p-1.5 bg-red-600/90 hover:bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition z-10 shadow"
                      title="Delete Image"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>

                    {isSelected ? (
                      <div className="absolute top-2 right-2 bg-amber-500 text-slate-950 font-black text-xs w-6 h-6 rounded-full flex items-center justify-center shadow-md">
                        {selectedIndex === 0 ? '1' : selectedIndex + 1}
                      </div>
                    ) : (
                      <div className="absolute top-2 right-2 w-6 h-6 rounded-full border-2 border-white/60 bg-black/40 group-hover:border-white" />
                    )}

                    {selectedIndex === 0 && (
                      <div className="absolute bottom-2 left-2 right-2 bg-amber-500/90 text-slate-950 text-[9px] font-black uppercase text-center py-0.5 rounded-md backdrop-blur-xs">
                        Product Thumbnail
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900 flex items-center justify-between">
          <div className="text-xs text-slate-300 font-semibold">
            <span className="text-amber-400 font-extrabold">{selectedUrls.length}</span> images selected
            {selectedUrls.length > 0 && (
              <span className="text-slate-400 ml-2">
                (Image #1 will be Main Thumbnail, {selectedUrls.length - 1} Gallery Images)
              </span>
            )}
          </div>

          <div className="flex items-center space-x-3">
            {selectedUrls.length > 0 && (
              <button
                type="button"
                onClick={() => setSelectedUrls([])}
                className="text-xs font-bold text-slate-400 hover:text-red-400 px-3 py-2 rounded-xl hover:bg-slate-800 transition"
              >
                Clear Selection
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs px-4 py-2 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmInsert}
              disabled={selectedUrls.length === 0}
              className={`font-extrabold text-xs px-5 py-2 rounded-xl transition shadow-md ${
                selectedUrls.length > 0
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                  : 'bg-slate-800 text-slate-600 cursor-not-allowed'
              }`}
            >
              Insert Selected ({selectedUrls.length})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

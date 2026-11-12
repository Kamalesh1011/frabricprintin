import React, { useState } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  Filter,
  Package,
  Layers,
  AlertTriangle,
  X,
  Camera,
  Check,
  RefreshCw,
  DollarSign
} from 'lucide-react';
import { Product, MasterFabric, MasterGsmWeight } from '../../types';
import { ImageReplaceModal } from './ImageReplaceModal';

interface AllProductsTableProps {
  products: Product[];
  fabrics: MasterFabric[];
  gsmWeights: MasterGsmWeight[];
  onAddNewClick: () => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => Promise<void>;
  onUpdateProduct?: (id: string, updates: Partial<Product>) => Promise<void>;
}

export const AllProductsTable: React.FC<AllProductsTableProps> = ({
  products,
  fabrics,
  gsmWeights,
  onAddNewClick,
  onEditProduct,
  onDeleteProduct,
  onUpdateProduct
}) => {
  const [search, setSearch] = useState('');
  const [selectedCatFilter, setSelectedCatFilter] = useState('All');
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Quick Inline Edit Price State
  const [editingPriceProductId, setEditingPriceProductId] = useState<string | null>(null);
  const [tempPricePerMeter, setTempPricePerMeter] = useState<number>(0);
  const [tempPrintSurcharge, setTempPrintSurcharge] = useState<number>(0);
  const [isSavingPrice, setIsSavingPrice] = useState(false);

  // Quick Replace Image Modal State
  const [replaceImageProduct, setReplaceImageProduct] = useState<Product | null>(null);

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());
    const matchesCat =
      selectedCatFilter === 'All' || p.category.toLowerCase() === selectedCatFilter.toLowerCase();
    return matchesSearch && matchesCat;
  });

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    setIsDeleting(true);
    try {
      await onDeleteProduct(productToDelete.id);
    } finally {
      setIsDeleting(false);
      setProductToDelete(null);
    }
  };

  const handleStartQuickPriceEdit = (prod: Product) => {
    setEditingPriceProductId(prod.id);
    setTempPricePerMeter(prod.price_per_meter);
    setTempPrintSurcharge(prod.print_surcharge_per_meter);
  };

  const handleSaveQuickPrice = async (prodId: string) => {
    if (!onUpdateProduct) return;
    setIsSavingPrice(true);
    try {
      await onUpdateProduct(prodId, {
        price_per_meter: Number(tempPricePerMeter) || 0,
        print_surcharge_per_meter: Number(tempPrintSurcharge) || 0
      });
      setEditingPriceProductId(null);
    } finally {
      setIsSavingPrice(false);
    }
  };

  const handleConfirmImageReplace = async (newUrl: string) => {
    if (!replaceImageProduct || !onUpdateProduct) return;
    const existingImages = replaceImageProduct.images || [];
    const updatedImages = [newUrl, ...existingImages.slice(1)];
    await onUpdateProduct(replaceImageProduct.id, {
      images: updatedImages
    });
  };

  return (
    <div className="space-y-4">
      {/* Search & Action Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/90 p-4 rounded-2xl border border-slate-800 shadow-md">
        <div className="flex items-center space-x-3 flex-1">
          <div className="relative flex-1 max-w-xs">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search products by title, category, weave..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={selectedCatFilter}
              onChange={(e) => setSelectedCatFilter(e.target.value)}
              className="bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-300 font-semibold"
            >
              <option value="All">All Categories</option>
              <option value="Cotton">Cotton</option>
              <option value="Linen">Linen</option>
              <option value="Silk">Silk</option>
              <option value="Rayon">Rayon</option>
              <option value="Modal">Modal</option>
              <option value="Viscose">Viscose</option>
              <option value="Polyester">Polyester</option>
            </select>
          </div>
        </div>

        <button
          onClick={onAddNewClick}
          className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center justify-center space-x-1.5 shadow-md shadow-amber-500/20 active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Table View */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-3.5">Image / Replace</th>
                <th className="p-3.5">Product Title</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Fabric Base</th>
                <th className="p-3.5">GSM</th>
                <th className="p-3.5">Base Price (₹/m)</th>
                <th className="p-3.5">Print Surcharge (₹/m)</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredProducts.map((prod) => {
                const fab = fabrics.find((f) => f.id === prod.fabric_id);
                const isEditingPrice = editingPriceProductId === prod.id;

                return (
                  <tr key={prod.id} className="hover:bg-slate-800/60 transition">
                    
                    {/* Image with Direct Replace Overlay */}
                    <td className="p-3.5">
                      <div className="relative group w-12 h-12 rounded-xl overflow-hidden border border-slate-700 bg-slate-900 shrink-0 cursor-pointer">
                        <img
                          src={prod.images[0] || '/mockups/white_tshirt_front.png'}
                          alt={prod.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition"
                        />
                        <button
                          onClick={() => setReplaceImageProduct(prod)}
                          className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-amber-400"
                          title="Click to Replace Image"
                        >
                          <Camera className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                    <td className="p-3.5">
                      <span className="font-bold text-white text-sm block">{prod.name}</span>
                      <span className="text-[10px] text-slate-400">
                        {prod.weave_type} • {prod.width}
                      </span>
                    </td>

                    <td className="p-3.5">
                      <span className="bg-slate-900 text-amber-400 px-2.5 py-1 rounded-lg text-[11px] font-bold border border-slate-700">
                        {prod.category}
                      </span>
                    </td>

                    <td className="p-3.5 text-slate-300 font-medium">
                      {fab ? fab.name : prod.composition || 'Custom Base'}
                    </td>

                    <td className="p-3.5 font-extrabold text-white font-mono">{prod.gsm} GSM</td>

                    {/* Inline Editable Base Price */}
                    <td className="p-3.5">
                      {isEditingPrice ? (
                        <div className="flex items-center space-x-1">
                          <span className="text-slate-400">₹</span>
                          <input
                            type="number"
                            step="0.5"
                            value={tempPricePerMeter}
                            onChange={(e) => setTempPricePerMeter(Number(e.target.value))}
                            className="w-16 bg-slate-950 border border-emerald-500 rounded p-1 text-xs text-emerald-400 font-mono font-bold"
                            autoFocus
                          />
                        </div>
                      ) : (
                        <button
                          onClick={() => handleStartQuickPriceEdit(prod)}
                          className="font-extrabold text-emerald-400 font-mono group flex items-center space-x-1 hover:underline text-xs"
                          title="Click to Edit Base Price"
                        >
                          <span>₹{prod.price_per_meter.toFixed(2)}/m</span>
                          <Edit2 className="w-3 h-3 opacity-0 group-hover:opacity-100 transition text-slate-400" />
                        </button>
                      )}
                    </td>

                    {/* Inline Editable Print Surcharge */}
                    <td className="p-3.5">
                      {isEditingPrice ? (
                        <div className="flex items-center space-x-1">
                          <span className="text-slate-400">+₹</span>
                          <input
                            type="number"
                            step="0.5"
                            value={tempPrintSurcharge}
                            onChange={(e) => setTempPrintSurcharge(Number(e.target.value))}
                            className="w-16 bg-slate-950 border border-amber-500 rounded p-1 text-xs text-amber-400 font-mono font-bold"
                          />
                          <button
                            onClick={() => handleSaveQuickPrice(prod.id)}
                            disabled={isSavingPrice}
                            className="p-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded transition shadow"
                            title="Save Prices"
                          >
                            <Check className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => setEditingPriceProductId(null)}
                            className="p-1 bg-slate-700 text-slate-300 rounded hover:bg-slate-600"
                            title="Cancel"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleStartQuickPriceEdit(prod)}
                          className="font-bold text-amber-400 font-mono group flex items-center space-x-1 hover:underline text-xs"
                          title="Click to Edit Surcharge"
                        >
                          <span>+₹{prod.print_surcharge_per_meter.toFixed(2)}/m</span>
                          <Edit2 className="w-3 h-3 opacity-0 group-hover:opacity-100 transition text-slate-400" />
                        </button>
                      )}
                    </td>

                    <td className="p-3.5 text-right space-x-2">
                      <button
                        onClick={() => onEditProduct(prod)}
                        className="p-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-200 transition"
                        title="Edit Full Product Wizard"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setProductToDelete(prod)}
                        className="p-1.5 bg-red-900/50 hover:bg-red-800 rounded-lg text-red-300 transition"
                        title="Delete Product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>

                  </tr>
                );
              })}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-500">
                    No products found matching filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-slate-900 text-white rounded-3xl max-w-md w-full p-6 border border-slate-700 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2 text-red-400">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="font-bold text-base font-serif">Confirm Product Deletion</h3>
              </div>
              <button
                onClick={() => setProductToDelete(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-200 font-medium text-sm">
                Are you sure you want to delete this product?
              </p>

              {/* Product Preview Card */}
              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex items-center space-x-3">
                <img
                  src={productToDelete.images[0] || '/mockups/white_tshirt_front.png'}
                  alt={productToDelete.name}
                  className="w-14 h-14 rounded-xl object-cover border border-slate-700 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <h4 className="font-bold text-white text-sm truncate">{productToDelete.name}</h4>
                  <p className="text-amber-400 text-[11px] font-semibold">
                    {productToDelete.category} • {productToDelete.gsm} GSM
                  </p>
                  <p className="text-slate-400 text-[10px]">
                    ₹{productToDelete.price_per_meter.toFixed(2)} / meter
                  </p>
                </div>
              </div>

              <div className="bg-red-950/40 border border-red-800/60 p-3 rounded-xl text-[11px] text-red-300 space-y-1">
                <p className="font-bold">⚠️ Warning:</p>
                <p>
                  This product will be permanently removed from your inventory database, frontend fabric catalog, and category pages immediately.
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end space-x-3 text-xs font-bold">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setProductToDelete(null)}
                className="bg-slate-800 text-slate-300 px-4 py-2.5 rounded-xl hover:bg-slate-700 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="bg-red-600 hover:bg-red-500 text-white px-5 py-2.5 rounded-xl transition shadow-lg flex items-center space-x-1.5"
              >
                {isDeleting ? (
                  <span>Deleting...</span>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Yes, Delete Product</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Direct Image Replace Modal for Product */}
      {replaceImageProduct && (
        <ImageReplaceModal
          isOpen={!!replaceImageProduct}
          onClose={() => setReplaceImageProduct(null)}
          currentImageUrl={replaceImageProduct.images[0] || ''}
          title={`Replace Image: ${replaceImageProduct.name}`}
          subtitle="Select a 3D garment mockup, fabric weave texture, or upload a custom image from your device."
          onConfirmReplace={handleConfirmImageReplace}
          onDeleteImage={async () => {
            if (onUpdateProduct) {
              await onUpdateProduct(replaceImageProduct.id, {
                images: ['/mockups/white_tshirt_front.png']
              });
            }
          }}
        />
      )}

    </div>
  );
};


import React from 'react';
import { Sparkles, ArrowRight, Tag, Heart } from 'lucide-react';
import { Product } from '../types';

interface DesignerLookbookSectionProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

interface LookbookItem {
  id: string;
  title: string;
  category: string;
  designerStudio: string;
  fabricCategory: string;
  image: string;
  description: string;
  printTechnique: string;
}

const LOOKBOOK_GALLERY: LookbookItem[] = [
  {
    id: 'look-1',
    title: 'Mughal Botanical Kaftan & Gown',
    category: 'Silk',
    designerStudio: 'Studio Velvet • Mumbai',
    fabricCategory: 'Silk',
    image: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&q=60&w=800',
    description: 'Cascading floor-length kaftan printed on pure Mulberry Silk Crepe with high-def reactive botanical damask artwork.',
    printTechnique: '300 DPI Reactive Color Lock'
  },
  {
    id: 'look-2',
    title: 'Heritage Indigo Resort Wear Shirt',
    category: 'Cotton',
    designerStudio: 'Rooh Atelier • Jaipur',
    fabricCategory: 'Cotton',
    image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=60&w=800',
    description: 'Breathable summer cuban collar shirt crafted from 100% Organic Cotton Cambric 60s with crisp geometric repeat.',
    printTechnique: 'Bio-Washed Cotton Finish'
  },
  {
    id: 'look-3',
    title: 'French Flax Linen Co-ord Set',
    category: 'Linen',
    designerStudio: 'Earth & Loom • Goa',
    fabricCategory: 'Linen',
    image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=60&w=800',
    description: 'Relaxed resort tunic and trouser set crafted on French Flax Pure Linen (140 GSM) with natural organic slub texture.',
    printTechnique: 'Earthy Reactive Penetration'
  },
  {
    id: 'look-4',
    title: 'Fluid Modal Satin Evening Dress',
    category: 'Modal',
    designerStudio: 'Zoya Couture • Delhi',
    fabricCategory: 'Modal',
    image: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&q=60&w=800',
    description: 'Silky flowing cocktail gown made from Bio-Cellulosic Modal Satin (110 GSM) with lustrous watercolor gradients.',
    printTechnique: 'Deep Reactive Dye Luster'
  }
];

export const DesignerLookbookSection: React.FC<DesignerLookbookSectionProps> = ({
  products,
  onSelectProduct
}) => {
  return (
    <div className="bg-white dark:bg-[#1A1C1A] rounded-[35px] border border-[#ECECEC] dark:border-white/[0.08] p-6 sm:p-10 shadow-fabriclore space-y-8 text-[#0F100F] dark:text-white transition-colors duration-300">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#ECECEC] dark:border-white/[0.08] pb-6">
        <div className="space-y-1.5">
          <div className="inline-flex items-center space-x-2 text-xs font-bold text-[#AC7900] dark:text-[#D4AF37] uppercase tracking-wider font-editorial">
            <Sparkles className="w-4 h-4" />
            <span>Designer Atelier Lookbook</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black font-editorial">
            Realized Creations by Indian Fashion Studios
          </h3>
          <p className="text-xs text-[#8A8883] dark:text-gray-400 max-w-xl">
            See how boutique fashion studios and designers transform raw premium base fabrics into runway creations using our digital print mill.
          </p>
        </div>

        <span className="text-xs font-bold text-[#EE6352] bg-[#EE6352]/10 px-3.5 py-1.5 rounded-full border border-[#EE6352]/20 shrink-0">
          Bespoke Designer Print Works
        </span>
      </div>

      {/* Lookbook Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {LOOKBOOK_GALLERY.map((look) => {
          const matchedProduct = products.find(
            (p) => p.category.toLowerCase() === look.fabricCategory.toLowerCase()
          ) || products[0];

          return (
            <div
              key={look.id}
              className="group flex flex-col justify-between bg-[#F9F6ED] dark:bg-[#242624] rounded-[28px] overflow-hidden border border-[#ECECEC] dark:border-white/[0.08] shadow-sm hover:shadow-md transition-all duration-300"
            >
              {/* Image Container */}
              <div className="relative aspect-[3/4] overflow-hidden bg-[#F3F0E8] dark:bg-[#1A1C1A]">
                <img
                  src={look.image}
                  alt={look.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Designer Pill Badge */}
                <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full">
                  {look.designerStudio}
                </div>

                <div className="absolute bottom-3 left-3 right-3 bg-white/90 dark:bg-black/80 backdrop-blur-md text-[#0F100F] dark:text-white p-2.5 rounded-2xl border border-black/5 dark:border-white/10 text-[11px] font-semibold flex items-center justify-between">
                  <span className="truncate">{look.printTechnique}</span>
                  <span className="text-[#AC7900] dark:text-[#D4AF37] font-bold shrink-0">✓ Live Run</span>
                </div>
              </div>

              {/* Card Details */}
              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-1">
                  <h4 className="font-bold text-xs line-clamp-1 font-editorial group-hover:text-[#AC7900] transition">
                    {look.title}
                  </h4>
                  <p className="text-[11px] text-[#8A8883] dark:text-gray-400 line-clamp-2 leading-relaxed">
                    {look.description}
                  </p>
                </div>

                {/* Direct Action Button */}
                <button
                  onClick={() => matchedProduct && onSelectProduct(matchedProduct)}
                  className="w-full bg-white dark:bg-[#1A1C1A] text-[#0F100F] dark:text-white border border-[#ECECEC] dark:border-white/[0.1] hover:border-[#AC7900] dark:hover:border-[#D4AF37] font-bold py-2.5 px-3 rounded-full text-xs transition flex items-center justify-center space-x-1.5 shadow-xs"
                >
                  <Tag className="w-3.5 h-3.5 text-[#AC7900]" />
                  <span>Customize {look.fabricCategory} Base</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};

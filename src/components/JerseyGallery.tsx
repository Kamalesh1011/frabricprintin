import React, { useCallback, useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight, Maximize2, ZoomIn } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { JerseyTintedImage } from './JerseyTintedImage';

export interface JerseyGalleryItem {
  id: string;
  src: string;
  hex?: string;
  label: string;
  caption: string;
}

interface JerseyGalleryProps {
  items: JerseyGalleryItem[];
  onError?: (e: React.SyntheticEvent<HTMLImageElement>) => void;
}

export const JerseyGallery: React.FC<JerseyGalleryProps> = ({ items, onError }) => {
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const [zoom, setZoom] = useState(false);

  const total = items.length;
  const active = items[Math.min(index, total - 1)] || items[0];

  const go = useCallback(
    (dir: number) => {
      setIndex((i) => (i + dir + total) % total);
      setZoom(false);
    },
    [total]
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, go]);

  if (!total) return null;

  return (
    <>
      <div className="rounded-[28px] overflow-hidden border border-black/10 dark:border-white/10 bg-white dark:bg-[#141514] shadow-sm">
        <button
          type="button"
          onClick={() => {
            setOpen(true);
            setZoom(false);
          }}
          className="relative block w-full text-left group"
          aria-label="Open full-screen gallery"
        >
          <JerseyTintedImage
            key={active.id}
            src={active.src}
            hex={active.hex}
            alt={active.label}
            eager={index === 0}
            onError={onError}
            className="w-full aspect-[4/3] sm:aspect-[16/10]"
          />
          <span className="absolute top-3 left-3 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur text-[10px] font-black uppercase tracking-wider text-white">
            {active.label}
          </span>
          <span className="absolute top-3 right-3 p-2 rounded-full bg-black/70 backdrop-blur text-white opacity-0 group-hover:opacity-100 transition">
            <Maximize2 className="w-4 h-4" />
          </span>
          <span className="absolute bottom-3 left-3 right-3 px-3.5 py-2 rounded-xl bg-black/65 backdrop-blur text-[11px] font-bold text-white/90">
            {active.caption}
          </span>
        </button>

        <div className="flex items-center gap-2 p-3 overflow-x-auto">
          {items.map((item, i) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={item.label}
              aria-pressed={i === index}
              className={`relative shrink-0 rounded-xl overflow-hidden border-2 transition ${
                i === index
                  ? 'border-[#AC7900] ring-2 ring-[#AC7900]/30'
                  : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              <JerseyTintedImage
                src={item.src}
                hex={item.hex}
                alt={`${item.label} thumbnail`}
                onError={onError}
                className="w-16 h-16 sm:w-20 sm:h-20"
              />
            </button>
          ))}
          <div className="ml-auto hidden sm:flex items-center gap-2 pl-3 shrink-0">
            <button
              type="button"
              onClick={() => go(-1)}
              className="p-2 rounded-full border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 transition"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-[11px] font-black text-slate-400 font-mono-luxury tabular-nums">
              {index + 1} / {total}
            </span>
            <button
              type="button"
              onClick={() => go(1)}
              className="p-2 rounded-full border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 transition"
              aria-label="Next image"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-[90] bg-black/95 backdrop-blur-sm flex flex-col"
            onClick={() => setOpen(false)}
          >
            <div className="flex items-center justify-between px-4 sm:px-6 py-3 shrink-0">
              <div className="min-w-0">
                <p className="text-white text-sm font-black truncate">{active.label}</p>
                <p className="text-white/50 text-[11px] truncate">{active.caption}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setZoom((z) => !z);
                  }}
                  className="p-2.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition"
                  aria-label="Toggle zoom"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="p-2.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition"
                  aria-label="Close gallery"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div
              className="relative flex-1 min-h-0 flex items-center justify-center px-3 sm:px-16"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => go(-1)}
                className="absolute left-1 sm:left-4 z-10 p-3 rounded-full bg-white/10 text-white hover:bg-white/25 transition"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div
                className={`w-full h-full flex items-center justify-center overflow-auto ${zoom ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
                onClick={() => setZoom((z) => !z)}
              >
                <JerseyTintedImage
                  src={active.src}
                  hex={active.hex}
                  alt={active.label}
                  onError={onError}
                  className={`transition-transform duration-300 ${zoom ? 'scale-125' : 'scale-100'} w-full max-w-3xl aspect-[4/5] sm:aspect-[4/3] rounded-2xl`}
                />
              </div>

              <button
                type="button"
                onClick={() => go(1)}
                className="absolute right-1 sm:right-4 z-10 p-3 rounded-full bg-white/10 text-white hover:bg-white/25 transition"
                aria-label="Next image"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center justify-center gap-2 py-4 shrink-0">
              {items.map((item, i) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIndex(i);
                    setZoom(false);
                  }}
                  aria-label={item.label}
                  className={`h-1.5 rounded-full transition-all ${i === index ? 'w-7 bg-[#D4AF37]' : 'w-3 bg-white/30'}`}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

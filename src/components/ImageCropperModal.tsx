import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  X,
  Check,
  RotateCw,
  FlipHorizontal,
  ZoomIn,
  ZoomOut,
  Maximize,
  Scissors,
  Wand2,
  RefreshCw,
  Square,
  Circle,
  RectangleVertical
} from 'lucide-react';

interface ImageCropperModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  onCropComplete: (croppedDataUrl: string) => void;
}

type AspectRatioType = 'free' | '1:1' | '4:5' | '3:4' | '16:9' | 'circle';

interface CropBox {
  x: number; // percentage (0-100)
  y: number; // percentage (0-100)
  width: number; // percentage (0-100)
  height: number; // percentage (0-100)
}

export const ImageCropperModal: React.FC<ImageCropperModalProps> = ({
  isOpen,
  onClose,
  imageUrl,
  onCropComplete
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const [aspectRatio, setAspectRatio] = useState<AspectRatioType>('free');
  const [cropBox, setCropBox] = useState<CropBox>({ x: 10, y: 10, width: 80, height: 80 });
  const [removeBgActive, setRemoveBgActive] = useState<boolean>(false);

  // Dragging / Resizing interaction state
  const [isDraggingBox, setIsDraggingBox] = useState<boolean>(false);
  const [activeHandle, setActiveHandle] = useState<string | null>(null);
  const dragStartRef = useRef<{ mouseX: number; mouseY: number; box: CropBox }>({
    mouseX: 0,
    mouseY: 0,
    box: { x: 10, y: 10, width: 80, height: 80 }
  });

  // Adjust crop box when aspect ratio changes
  const applyAspectRatio = useCallback((ratio: AspectRatioType) => {
    setAspectRatio(ratio);
    if (ratio === 'free') return;

    let targetRatio = 1;
    if (ratio === '1:1' || ratio === 'circle') targetRatio = 1;
    else if (ratio === '4:5') targetRatio = 4 / 5;
    else if (ratio === '3:4') targetRatio = 3 / 4;
    else if (ratio === '16:9') targetRatio = 16 / 9;

    setCropBox(prev => {
      let newW = prev.width;
      let newH = newW / targetRatio;
      if (newH > 90) {
        newH = 90;
        newW = newH * targetRatio;
      }
      const newX = Math.max(5, Math.min(95 - newW, (100 - newW) / 2));
      const newY = Math.max(5, Math.min(95 - newH, (100 - newH) / 2));
      return { x: newX, y: newY, width: newW, height: newH };
    });
  }, []);

  // Handle pointer down on center or handles
  const handlePointerDown = (
    e: React.PointerEvent<HTMLDivElement>,
    handle: string | null = null
  ) => {
    e.preventDefault();
    e.stopPropagation();
    if (!containerRef.current) return;

    if (handle) {
      setActiveHandle(handle);
    } else {
      setIsDraggingBox(true);
    }

    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      box: { ...cropBox }
    };
  };

  // Pointer move for box drag & resize
  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (!isDraggingBox && !activeHandle) return;
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const deltaXPercent = ((e.clientX - dragStartRef.current.mouseX) / rect.width) * 100;
      const deltaYPercent = ((e.clientY - dragStartRef.current.mouseY) / rect.height) * 100;
      const initial = dragStartRef.current.box;

      if (isDraggingBox) {
        // Move whole box
        let newX = initial.x + deltaXPercent;
        let newY = initial.y + deltaYPercent;

        newX = Math.max(0, Math.min(100 - initial.width, newX));
        newY = Math.max(0, Math.min(100 - initial.height, newY));

        setCropBox({
          ...initial,
          x: newX,
          y: newY
        });
      } else if (activeHandle) {
        // Resize box based on handle
        let { x, y, width, height } = initial;
        const minSize = 10;

        if (activeHandle.includes('e')) {
          width = Math.max(minSize, Math.min(100 - x, initial.width + deltaXPercent));
        }
        if (activeHandle.includes('s')) {
          height = Math.max(minSize, Math.min(100 - y, initial.height + deltaYPercent));
        }
        if (activeHandle.includes('w')) {
          const maxDelta = initial.width - minSize;
          const clampedDelta = Math.max(-initial.x, Math.min(maxDelta, deltaXPercent));
          x = initial.x + clampedDelta;
          width = initial.width - clampedDelta;
        }
        if (activeHandle.includes('n')) {
          const maxDelta = initial.height - minSize;
          const clampedDelta = Math.max(-initial.y, Math.min(maxDelta, deltaYPercent));
          y = initial.y + clampedDelta;
          height = initial.height - clampedDelta;
        }

        // Lock aspect ratio if not free
        if (aspectRatio !== 'free') {
          let targetRatio = 1;
          if (aspectRatio === '1:1' || aspectRatio === 'circle') targetRatio = 1;
          else if (aspectRatio === '4:5') targetRatio = 4 / 5;
          else if (aspectRatio === '3:4') targetRatio = 3 / 4;
          else if (aspectRatio === '16:9') targetRatio = 16 / 9;

          if (activeHandle === 'e' || activeHandle === 'w' || activeHandle === 'se' || activeHandle === 'sw') {
            height = width / targetRatio;
          } else {
            width = height * targetRatio;
          }
        }

        setCropBox({ x, y, width, height });
      }
    };

    const handlePointerUp = () => {
      setIsDraggingBox(false);
      setActiveHandle(null);
    };

    if (isDraggingBox || activeHandle) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
    }

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [isDraggingBox, activeHandle, aspectRatio]);

  // Execute Final Canvas Crop
  const handleApplyCrop = () => {
    if (!imageRef.current) return;

    const img = imageRef.current;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Original natural dimensions
    const naturalW = img.naturalWidth;
    const naturalH = img.naturalHeight;

    // Crop box coordinates mapped to original image natural pixels
    const cropX = (cropBox.x / 100) * naturalW;
    const cropY = (cropBox.y / 100) * naturalH;
    const cropW = (cropBox.width / 100) * naturalW;
    const cropH = (cropBox.height / 100) * naturalH;

    canvas.width = Math.max(1, Math.round(cropW));
    canvas.height = Math.max(1, Math.round(cropH));

    // Handle transformations (circle mask)
    ctx.save();
    if (aspectRatio === 'circle') {
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, Math.min(canvas.width, canvas.height) / 2, 0, Math.PI * 2);
      ctx.clip();
    }

    // Draw cropped region from source image
    ctx.drawImage(
      img,
      cropX,
      cropY,
      cropW,
      cropH,
      0,
      0,
      canvas.width,
      canvas.height
    );
    ctx.restore();

    // Background knockout (Transparent conversion for solid white backgrounds)
    if (removeBgActive) {
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        // If near pure white (> 238 on all channels)
        if (r > 238 && g > 238 && b > 238) {
          data[i + 3] = 0; // set alpha to transparent
        }
      }
      ctx.putImageData(imgData, 0, 0);
    }

    const croppedDataUrl = canvas.toDataURL('image/png', 0.95);
    onCropComplete(croppedDataUrl);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-[#181918] text-white rounded-3xl shadow-2xl border border-white/10 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/[0.02]">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-[#AC7900] text-white">
              <Scissors className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold font-editorial">Crop & Select Artwork</h2>
              <p className="text-xs text-white/50">Drag bounding box handles or choose aspect ratios</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* TOOLBAR CONTROLS */}
        <div className="px-6 py-3 border-b border-white/10 bg-white/[0.01] flex flex-wrap items-center justify-between gap-3 text-xs">
          
          {/* Aspect Ratio Buttons */}
          <div className="flex items-center space-x-1.5 p-1 bg-white/5 rounded-2xl border border-white/10">
            <button
              onClick={() => applyAspectRatio('free')}
              className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center space-x-1.5 ${
                aspectRatio === 'free' ? 'bg-[#AC7900] text-white shadow-sm' : 'text-white/60 hover:text-white'
              }`}
            >
              <Maximize className="w-3.5 h-3.5" />
              <span>Freeform</span>
            </button>
            <button
              onClick={() => applyAspectRatio('1:1')}
              className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center space-x-1.5 ${
                aspectRatio === '1:1' ? 'bg-[#AC7900] text-white shadow-sm' : 'text-white/60 hover:text-white'
              }`}
            >
              <Square className="w-3.5 h-3.5" />
              <span>1:1 Square</span>
            </button>
            <button
              onClick={() => applyAspectRatio('4:5')}
              className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center space-x-1.5 ${
                aspectRatio === '4:5' ? 'bg-[#AC7900] text-white shadow-sm' : 'text-white/60 hover:text-white'
              }`}
            >
              <RectangleVertical className="w-3.5 h-3.5" />
              <span>4:5 DTF Chest</span>
            </button>
            <button
              onClick={() => applyAspectRatio('circle')}
              className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center space-x-1.5 ${
                aspectRatio === 'circle' ? 'bg-[#AC7900] text-white shadow-sm' : 'text-white/60 hover:text-white'
              }`}
            >
              <Circle className="w-3.5 h-3.5" />
              <span>Circle Badge</span>
            </button>
          </div>

          {/* Additional Tool Actions */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setRemoveBgActive(!removeBgActive)}
              className={`px-3 py-1.5 rounded-xl font-bold border transition flex items-center space-x-1.5 ${
                removeBgActive
                  ? 'bg-purple-600 text-white border-purple-500 shadow-sm'
                  : 'bg-white/5 text-white/70 border-white/10 hover:border-white/30'
              }`}
              title="Remove pure white solid background"
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>Remove White BG</span>
            </button>

            <button
              onClick={() => {
                setCropBox({ x: 5, y: 5, width: 90, height: 90 });
                setAspectRatio('free');
                setRemoveBgActive(false);
              }}
              className="px-3 py-1.5 rounded-xl font-bold bg-white/5 text-white/70 border border-white/10 hover:border-white/30 transition flex items-center space-x-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* MAIN CROP CANVAS WORKSPACE */}
        <div className="flex-1 p-6 flex items-center justify-center overflow-hidden bg-[#101110] relative select-none">
          <div
            ref={containerRef}
            className="relative max-w-full max-h-[55vh] aspect-auto flex items-center justify-center"
          >
            {/* Source Image */}
            <img
              ref={imageRef}
              src={imageUrl}
              alt="Crop Target"
              className="max-h-[55vh] max-w-full object-contain rounded-lg pointer-events-none shadow-2xl"
              crossOrigin="anonymous"
            />

            {/* Draggable Active Crop Box */}
            <div
              onPointerDown={e => handlePointerDown(e, null)}
              className={`absolute border-2 border-[#AC7900] cursor-move shadow-2xl ${
                aspectRatio === 'circle' ? 'rounded-full' : 'rounded-none'
              }`}
              style={{
                left: `${cropBox.x}%`,
                top: `${cropBox.y}%`,
                width: `${cropBox.width}%`,
                height: `${cropBox.height}%`,
                boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.65)'
              }}
            >
              {/* Rule of Thirds Grid Lines (if rectangular) */}
              {aspectRatio !== 'circle' && (
                <div className="absolute inset-0 pointer-events-none opacity-40">
                  <div className="w-full h-1/3 border-b border-white/40" />
                  <div className="w-full h-1/3 border-b border-white/40" />
                  <div className="absolute top-0 bottom-0 left-1/3 border-r border-white/40" />
                  <div className="absolute top-0 bottom-0 left-2/3 border-r border-white/40" />
                </div>
              )}

              {/* 4 Corner Resize Handles */}
              <div
                onPointerDown={e => handlePointerDown(e, 'nw')}
                className="absolute -top-2 -left-2 w-4 h-4 bg-white border-2 border-[#AC7900] rounded-full cursor-nwse-resize shadow-md hover:scale-125 transition-transform"
              />
              <div
                onPointerDown={e => handlePointerDown(e, 'ne')}
                className="absolute -top-2 -right-2 w-4 h-4 bg-white border-2 border-[#AC7900] rounded-full cursor-nesw-resize shadow-md hover:scale-125 transition-transform"
              />
              <div
                onPointerDown={e => handlePointerDown(e, 'sw')}
                className="absolute -bottom-2 -left-2 w-4 h-4 bg-white border-2 border-[#AC7900] rounded-full cursor-nesw-resize shadow-md hover:scale-125 transition-transform"
              />
              <div
                onPointerDown={e => handlePointerDown(e, 'se')}
                className="absolute -bottom-2 -right-2 w-4 h-4 bg-white border-2 border-[#AC7900] rounded-full cursor-nwse-resize shadow-md hover:scale-125 transition-transform"
              />

              {/* 4 Edge Handles (if freeform) */}
              {aspectRatio === 'free' && (
                <>
                  <div
                    onPointerDown={e => handlePointerDown(e, 'n')}
                    className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-6 h-2.5 bg-white border border-[#AC7900] rounded-sm cursor-ns-resize"
                  />
                  <div
                    onPointerDown={e => handlePointerDown(e, 's')}
                    className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-6 h-2.5 bg-white border border-[#AC7900] rounded-sm cursor-ns-resize"
                  />
                  <div
                    onPointerDown={e => handlePointerDown(e, 'w')}
                    className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-2.5 h-6 bg-white border border-[#AC7900] rounded-sm cursor-ew-resize"
                  />
                  <div
                    onPointerDown={e => handlePointerDown(e, 'e')}
                    className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-2.5 h-6 bg-white border border-[#AC7900] rounded-sm cursor-ew-resize"
                  />
                </>
              )}

              {/* Center Dimension Badge */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="bg-black/80 backdrop-blur-sm text-white px-2 py-0.5 rounded-md text-[10px] font-mono">
                  {Math.round(cropBox.width)}% × {Math.round(cropBox.height)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER ACTIONS */}
        <div className="px-6 py-4 border-t border-white/10 bg-white/[0.02] flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-full border border-white/20 text-white/80 hover:text-white hover:bg-white/10 text-xs font-bold transition"
          >
            Cancel
          </button>

          <button
            onClick={handleApplyCrop}
            className="px-6 py-2.5 rounded-full bg-[#E11D48] hover:bg-[#BE123C] text-white text-xs font-bold flex items-center space-x-2 shadow-lg hover:shadow-red-500/30 transition"
          >
            <Check className="w-4 h-4" />
            <span>Apply Crop & Place on Garment</span>
          </button>
        </div>

      </div>
    </div>
  );
};

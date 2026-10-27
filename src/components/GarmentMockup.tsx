import React, { useMemo } from 'react';
import { RotateCw } from 'lucide-react';

export type GarmentModelType =
  | 'mens_round_neck'
  | 'womens_round_neck'
  | 'crop_top'
  | 'oversized_tee'
  | 'acid_wash_tee'
  | 'polo_shirt'
  | 'sports_polo'
  | 'sports_full_sleeve_polo'
  | 'hoodie'
  | 'sweatshirt'
  | 'tank_top'
  | 'kids_tee'
  | 'infants_tee'
  | 'kids_sports'
  | 'sports_round_neck'
  | 'sports_full_sleeve_round'
  | 'cricket_jersey';

interface GarmentMockupProps {
  type: GarmentModelType;
  colorHex: string;
  className?: string;
  side?: 'front' | 'back';
  rotationAngle?: number; // 0 to 360 degrees
  artworkUrl?: string | null;
  artworkPlacement?: string;
  scalePercent?: number;
  rotation?: number;
  offsetX?: number;
  offsetY?: number;
  hideArtworkOverlay?: boolean;
  isEmbroidery?: boolean;
  customText?: string;
  customTextColor?: string;
  customTextFont?: string;
  printEffect?: 'dtf' | 'embroidery' | 'foil' | 'puff';
  embroideryStyle?: 'flat' | 'puff3d' | 'patch';
  embroideryThreadColor?: string;
  dtfFinish?: 'matte' | 'gloss';
  showBoundingBox?: boolean;
  isFlippedH?: boolean;
  isFlippedV?: boolean;
  cropShape?: 'none' | 'circle' | 'rounded' | 'square';
  onUploadPromptClick?: () => void;
  onGraphicPointerDown?: (e: React.PointerEvent) => void;
  onCornerHandlePointerDown?: (e: React.PointerEvent) => void;
  onRotateHandlePointerDown?: (e: React.PointerEvent) => void;
  onRotateClick?: () => void;
  isSelected?: boolean;
}

export const GarmentMockup: React.FC<GarmentMockupProps> = ({
  type,
  colorHex,
  className = 'w-full h-full',
  side = 'front',
  rotationAngle,
  artworkUrl,
  artworkPlacement = 'chest_center',
  scalePercent = 100,
  rotation = 0,
  offsetX = 0,
  offsetY = 0,
  hideArtworkOverlay = false,
  isEmbroidery = false,
  customText,
  customTextColor = '#FFFFFF',
  customTextFont = 'font-sans',
  printEffect = 'dtf',
  embroideryStyle = 'puff3d',
  embroideryThreadColor,
  dtfFinish = 'matte',
  showBoundingBox = false,
  isFlippedH = false,
  isFlippedV = false,
  cropShape = 'none',
  onUploadPromptClick,
  onGraphicPointerDown,
  onCornerHandlePointerDown,
  onRotateHandlePointerDown,
  onRotateClick,
  isSelected = true
}) => {
  // Compute normalized 360-degree rotation angle if provided
  const normAngle = useMemo(() => {
    if (rotationAngle === undefined) {
      return side === 'back' ? 180 : 0;
    }
    return ((rotationAngle % 360) + 360) % 360;
  }, [rotationAngle, side]);

  // Determine active view side from rotation angle (0°-90° & 270°-360° = front, 90°-270° = back)
  const activeSide = useMemo<'front' | 'back'>(() => {
    if (rotationAngle !== undefined) {
      return normAngle > 90 && normAngle < 270 ? 'back' : 'front';
    }
    return side;
  }, [normAngle, rotationAngle, side]);

  // 3D perspective foreshortening factor for artwork projection
  const perspectiveScaleX = useMemo(() => {
    const rad = (normAngle * Math.PI) / 180;
    const cosVal = Math.abs(Math.cos(rad));
    return Math.max(0.15, cosVal);
  }, [normAngle]);

  const isPureWhite =
    colorHex.toLowerCase() === '#ffffff' ||
    colorHex.toLowerCase() === '#fff' ||
    colorHex.toLowerCase() === '#fdfbf7' ||
    colorHex.toLowerCase() === '#f9f9f9';

  // Select the photorealistic 3D studio transparent PNG mockup image
  const mockupImageSrc = useMemo(() => {
    if (type === 'hoodie' || type === 'sweatshirt') {
      return activeSide === 'back' ? '/mockups/white_hoodie_front.png' : '/mockups/white_hoodie_front.png';
    }
    if (type === 'polo_shirt' || type === 'sports_polo' || type === 'sports_full_sleeve_polo') {
      return '/mockups/white_polo_front.png';
    }
    if (type === 'oversized_tee' || type === 'acid_wash_tee') {
      return '/mockups/white_oversized_tee.png';
    }
    // Standard T-shirts (Men, Women, Kids, Sports, Crops)
    return activeSide === 'back' ? '/mockups/white_tshirt_back.png' : '/mockups/white_tshirt_front.png';
  }, [type, activeSide]);

  // Compute artwork position percentages based on selected placement
  const getPlacementCoordinates = () => {
    switch (artworkPlacement) {
      case 'pocket_left':
        return { top: '30%', left: '38%', width: '18%' };
      case 'a4_front':
        return { top: '36%', left: '50%', width: '42%' };
      case 'oversized_front':
        return { top: '44%', left: '50%', width: '56%' };
      case 'upper_back':
        return { top: '24%', left: '50%', width: '32%' };
      case 'full_back':
        return { top: '44%', left: '50%', width: '54%' };
      case 'chest_center':
      default:
        return { top: '34%', left: '50%', width: '34%' };
    }
  };

  const coords = getPlacementCoordinates();

  return (
    <div
      className={`relative flex items-center justify-center select-none overflow-hidden ${className}`}
      style={{
        perspective: '1200px'
      }}
    >
      {/* 3D Model Outer Container with Smooth 360 Spin Transform */}
      <div
        className="relative w-full h-full flex items-center justify-center transition-transform duration-100 ease-out"
        style={{
          transform: rotationAngle !== undefined
            ? `rotateY(${normAngle > 180 ? normAngle - 360 : normAngle}deg)`
            : 'none',
          transformStyle: 'preserve-3d'
        }}
      >
        {/* 🌟 Photorealistic 3D Transparent PNG Mockup Base Layer */}
        <div className="relative w-full h-full max-h-[480px] flex items-center justify-center">
          
          <img
            src={mockupImageSrc}
            alt="3D Apparel Studio Mockup"
            className="w-full h-full object-contain filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.15)] transition-opacity duration-300 pointer-events-none"
            draggable={false}
          />

          {/* Dynamic Color Tint Overlay */}
          {!isPureWhite && (
            <div
              className="absolute inset-0 pointer-events-none transition-colors duration-300 mix-blend-multiply opacity-90"
              style={{
                backgroundColor: colorHex,
                maskImage: `url(${mockupImageSrc})`,
                WebkitMaskImage: `url(${mockupImageSrc})`,
                maskSize: 'contain',
                WebkitMaskSize: 'contain',
                maskRepeat: 'no-repeat',
                WebkitMaskRepeat: 'no-repeat',
                maskPosition: 'center',
                WebkitMaskPosition: 'center'
              }}
            />
          )}

          {/* 🌟 3D Artwork Overlay Layer with Interactive Corner Handles */}
          {!hideArtworkOverlay && (artworkUrl || customText) && (
            <div
              onPointerDown={onGraphicPointerDown}
              className={`absolute transition-transform duration-75 z-20 cursor-move ${
                onGraphicPointerDown ? 'pointer-events-auto' : 'pointer-events-none'
              }`}
              style={{
                top: coords.top,
                left: coords.left,
                width: coords.width,
                transform: `translate(-50%, -50%) translate(${offsetX}px, ${offsetY}px) scaleX(${perspectiveScaleX * (isFlippedH ? -1 : 1)}) scaleY(${isFlippedV ? -1 : 1}) rotate(${rotation}deg) scale(${scalePercent / 100})`,
                transformOrigin: 'center center'
              }}
            >
              <div
                className={`relative flex flex-col items-center justify-center p-1 select-none ${
                  showBoundingBox || isSelected
                    ? 'ring-2 ring-amber-500 shadow-2xl rounded-xl'
                    : ''
                }`}
              >
                {/* Artwork Graphic Image */}
                {artworkUrl && (
                  <img
                    src={artworkUrl}
                    alt="Custom Artwork"
                    className={`w-full object-contain select-none transition-all pointer-events-none ${
                      cropShape === 'circle' ? 'rounded-full aspect-square object-cover' : cropShape === 'rounded' ? 'rounded-2xl' : ''
                    }`}
                    style={{
                      filter:
                        printEffect === 'embroidery' || isEmbroidery
                          ? embroideryStyle === 'puff3d'
                            ? 'drop-shadow(0 3px 2px rgba(0,0,0,0.7)) drop-shadow(0 6px 6px rgba(0,0,0,0.45)) contrast(1.2) brightness(1.05)'
                            : 'drop-shadow(0 2px 4px rgba(0,0,0,0.65)) contrast(1.15)'
                          : printEffect === 'foil'
                          ? 'drop-shadow(0 0 8px rgba(212,175,55,0.85)) saturate(1.4)'
                          : printEffect === 'puff'
                          ? 'drop-shadow(0 4px 6px rgba(0,0,0,0.5)) saturate(1.15)'
                          : dtfFinish === 'gloss'
                          ? 'drop-shadow(0 1px 3px rgba(0,0,0,0.3)) brightness(1.08) contrast(1.1)'
                          : 'drop-shadow(0 1px 2px rgba(0,0,0,0.25)) saturate(1.05)'
                    }}
                    draggable={false}
                  />
                )}

                {/* Custom Typography Text Overlay */}
                {customText && (
                  <span
                    className={`font-black text-center select-none mt-1 leading-tight pointer-events-none ${customTextFont}`}
                    style={
                      printEffect === 'embroidery' || isEmbroidery
                        ? {
                            color: embroideryThreadColor || customTextColor,
                            fontSize: '18px',
                            letterSpacing: '0.08em',
                            fontWeight: 900,
                            textShadow:
                              embroideryStyle === 'puff3d'
                                ? '0 1px 0 rgba(255,255,255,0.4), 0 2px 0 rgba(0,0,0,0.4), 0 3px 0 rgba(0,0,0,0.5), 0 5px 6px rgba(0,0,0,0.6)'
                                : '1px 1px 0 rgba(0,0,0,0.5), -1px -1px 0 rgba(255,255,255,0.35), 0 2px 4px rgba(0,0,0,0.6)',
                            filter: 'contrast(1.2)'
                          }
                        : {
                            color: customTextColor,
                            fontSize: '18px',
                            letterSpacing: '0.05em',
                            textShadow: '0 2px 4px rgba(0,0,0,0.6)'
                          }
                    }
                  >
                    {customText}
                  </span>
                )}

                {/* 🌟 4 CORNER RESIZE HANDLES & TOP ROTATE STEM */}
                {(showBoundingBox || isSelected) && onCornerHandlePointerDown && (
                  <>
                    {/* Top-Left */}
                    <div
                      onPointerDown={onCornerHandlePointerDown}
                      className="absolute -top-2 -left-2 w-4 h-4 bg-white border-2 border-amber-600 rounded-full cursor-nwse-resize shadow-lg hover:scale-125 transition-transform flex items-center justify-center z-30 pointer-events-auto"
                      title="Drag to resize / scale"
                    >
                      <span className="w-1.5 h-1.5 bg-amber-600 rounded-full" />
                    </div>

                    {/* Top-Right */}
                    <div
                      onPointerDown={onCornerHandlePointerDown}
                      className="absolute -top-2 -right-2 w-4 h-4 bg-white border-2 border-amber-600 rounded-full cursor-nesw-resize shadow-lg hover:scale-125 transition-transform flex items-center justify-center z-30 pointer-events-auto"
                      title="Drag to resize / scale"
                    >
                      <span className="w-1.5 h-1.5 bg-amber-600 rounded-full" />
                    </div>

                    {/* Bottom-Left */}
                    <div
                      onPointerDown={onCornerHandlePointerDown}
                      className="absolute -bottom-2 -left-2 w-4 h-4 bg-white border-2 border-amber-600 rounded-full cursor-nesw-resize shadow-lg hover:scale-125 transition-transform flex items-center justify-center z-30 pointer-events-auto"
                      title="Drag to resize / scale"
                    >
                      <span className="w-1.5 h-1.5 bg-amber-600 rounded-full" />
                    </div>

                    {/* Bottom-Right */}
                    <div
                      onPointerDown={onCornerHandlePointerDown}
                      className="absolute -bottom-2 -right-2 w-4 h-4 bg-white border-2 border-amber-600 rounded-full cursor-nwse-resize shadow-lg hover:scale-125 transition-transform flex items-center justify-center z-30 pointer-events-auto"
                      title="Drag to resize / scale"
                    >
                      <span className="w-1.5 h-1.5 bg-amber-600 rounded-full" />
                    </div>

                    {/* Top Rotate Handle with Stem */}
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex flex-col items-center z-30 pointer-events-auto">
                      <div
                        onPointerDown={onRotateHandlePointerDown}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onRotateClick) onRotateClick();
                        }}
                        className="w-6 h-6 bg-amber-600 text-white rounded-full flex items-center justify-center shadow-xl cursor-grab active:cursor-grabbing hover:scale-115 transition-transform"
                        title="Drag to rotate or click for 90°"
                      >
                        <RotateCw className="w-3.5 h-3.5" />
                      </div>
                      <div className="w-0.5 h-3 bg-amber-600" />
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

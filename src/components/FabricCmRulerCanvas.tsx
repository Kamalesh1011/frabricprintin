import React from 'react';
import { Product, SizeOptionType } from '../types';

interface FabricCmRulerCanvasProps {
  designUrl: string;
  product: Product;
  selectedSizeType: SizeOptionType;
  meters: number;
  layoutType: 'single' | 'repeat_grid' | 'half_drop' | 'mirror_repeat' | 'straight' | 'centered' | 'grid';
  scalePercentage?: number;
  rotation?: number;
  inkBlendMode?: boolean;
  showRulers?: boolean;
}

export const FabricCmRulerCanvas: React.FC<FabricCmRulerCanvasProps> = ({
  designUrl,
  product,
  selectedSizeType,
  meters,
  layoutType,
  scalePercentage = 100,
  rotation = 0,
  inkBlendMode = true,
  showRulers = true
}) => {
  const extractWidthCm = (widthStr: string): number => {
    const match = widthStr.match(/(\d+)\s*cm/i);
    if (match && match[1]) {
      return parseInt(match[1], 10);
    }
    return 112;
  };

  const fabricWidthCm = extractWidthCm(product.width);

  let widthCm = 20;
  let heightCm = 20;

  if (selectedSizeType === 'swatch_test') {
    widthCm = 20;
    heightCm = 20;
  } else if (selectedSizeType === 'swatch_big') {
    widthCm = 75;
    heightCm = 100;
  } else {
    widthCm = fabricWidthCm;
    heightCm = 100;
  }

  const getTopTicks = () => {
    if (widthCm <= 30) {
      return [0, 5, 10, 15, 20].filter(val => val <= widthCm).map(val => ({
        label: `${val}`,
        percent: (val / widthCm) * 100,
        isMajor: true
      }));
    } else if (widthCm <= 80) {
      return [0, 25, 50, 75].filter(val => val <= widthCm).map(val => ({
        label: `${val}`,
        percent: (val / widthCm) * 100,
        isMajor: true
      }));
    } else {
      return [0, 20, 40, 60, 80, 100, 112].filter(val => val <= widthCm).map(val => ({
        label: `${val}`,
        percent: (val / widthCm) * 100,
        isMajor: true
      }));
    }
  };

  const getLeftTicks = () => {
    if (heightCm <= 30) {
      return [0, 5, 10, 15, 20].filter(val => val <= heightCm).map(val => ({
        label: `${val}`,
        percent: (val / heightCm) * 100,
        isMajor: true
      }));
    } else {
      return [0, 25, 50, 75, 100].filter(val => val <= heightCm).map(val => ({
        label: `${val}`,
        percent: (val / heightCm) * 100,
        isMajor: true
      }));
    }
  };

  const topTicks = getTopTicks();
  const leftTicks = getLeftTicks();

  const normalizedLayout =
    layoutType === 'grid' || layoutType === 'straight'
      ? 'repeat_grid'
      : layoutType === 'centered'
      ? 'single'
      : layoutType;

  return (
    <div className="relative w-full rounded-[30px] overflow-hidden border border-[#ECECEC] dark:border-white/[0.08] shadow-fabriclore bg-white dark:bg-[#1A1C1A] select-none text-[#0F100F] dark:text-white transition-colors duration-300">
      
      {/* 1. TOP HORIZONTAL CM RULER */}
      {showRulers && (
        <div className="h-6 bg-[#F9F6ED] dark:bg-[#242624] border-b border-[#ECECEC] dark:border-white/[0.08] relative pl-6 flex items-end">
          <div className="absolute left-1 bottom-1 text-[9px] font-bold text-[#8A8883]">
            CM
          </div>

          <div className="relative w-full h-full">
            {topTicks.map((tick, idx) => (
              <div
                key={idx}
                className="absolute bottom-0 flex flex-col items-center transform -translate-x-1/2"
                style={{ left: `${tick.percent}%` }}
              >
                <span className="text-[9px] font-mono text-[#8A8883] leading-none mb-0.5 font-bold">
                  {tick.label}
                </span>
                <div className={`w-[1px] bg-[#8A8883] ${tick.isMajor ? 'h-2' : 'h-1'}`} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. MAIN FABRIC DISPLAY WRAPPER WITH LEFT VERTICAL RULER */}
      <div className="flex relative">
        
        {/* LEFT VERTICAL CM RULER */}
        {showRulers && (
          <div className="w-6 bg-[#F9F6ED] dark:bg-[#242624] border-r border-[#ECECEC] dark:border-white/[0.08] relative shrink-0">
            <div className="relative h-full w-full">
              {leftTicks.map((tick, idx) => (
                <div
                  key={idx}
                  className="absolute right-0 flex items-center transform -translate-y-1/2"
                  style={{ top: `${tick.percent}%` }}
                >
                  <span className="text-[9px] font-mono text-[#8A8883] leading-none mr-1 font-bold">
                    {tick.label}
                  </span>
                  <div className={`h-[1px] bg-[#8A8883] ${tick.isMajor ? 'w-2' : 'w-1'}`} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. SIMULATED FABRIC SURFACE */}
        <div
          className="flex-1 relative aspect-square overflow-hidden"
          style={{
            backgroundColor: product.colorCode || '#FEFBF1'
          }}
        >
          {/* Subtle Weave Texture Grid */}
          <div className="absolute inset-0 bg-[radial-gradient(#0000000a_1px,transparent_1px)] [background-size:6px_6px] pointer-events-none z-10" />

          {/* PRINTED ARTWORK OVERLAY */}
          {designUrl ? (
            <div className="absolute inset-0 overflow-hidden">
              {/* REPEAT GRID LAYOUT */}
              {normalizedLayout === 'repeat_grid' && (
                <div
                  className="w-full h-full transition-all duration-300"
                  style={{
                    backgroundImage: `url("${designUrl}")`,
                    backgroundSize: `${scalePercentage * 1.5}px ${scalePercentage * 1.5}px`,
                    backgroundRepeat: 'repeat',
                    transform: `rotate(${rotation}deg)`,
                    transformOrigin: 'center center',
                    mixBlendMode: inkBlendMode ? 'multiply' : 'normal',
                    opacity: inkBlendMode ? 0.92 : 1
                  }}
                />
              )}

              {/* SINGLE PLACEMENT LAYOUT */}
              {normalizedLayout === 'single' && (
                <div
                  className="w-full h-full transition-all duration-300"
                  style={{
                    backgroundImage: `url("${designUrl}")`,
                    backgroundSize: `${scalePercentage * 3}px auto`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center center',
                    transform: `rotate(${rotation}deg)`,
                    transformOrigin: 'center center',
                    mixBlendMode: inkBlendMode ? 'multiply' : 'normal',
                    opacity: inkBlendMode ? 0.92 : 1
                  }}
                />
              )}

              {/* HALF DROP LAYOUT */}
              {normalizedLayout === 'half_drop' && (
                <div
                  className="w-full h-full transition-all duration-300"
                  style={{
                    backgroundImage: `url("${designUrl}")`,
                    backgroundSize: `${scalePercentage * 1.6}px ${scalePercentage * 1.6}px`,
                    backgroundRepeat: 'repeat',
                    transform: `rotate(${rotation}deg)`,
                    transformOrigin: 'center center',
                    mixBlendMode: inkBlendMode ? 'multiply' : 'normal',
                    opacity: inkBlendMode ? 0.92 : 1
                  }}
                />
              )}

              {/* MIRROR REPEAT LAYOUT */}
              {normalizedLayout === 'mirror_repeat' && (
                <div
                  className="w-full h-full transition-all duration-300 grid grid-cols-4 grid-rows-4"
                  style={{
                    mixBlendMode: inkBlendMode ? 'multiply' : 'normal',
                    opacity: inkBlendMode ? 0.92 : 1
                  }}
                >
                  {Array.from({ length: 16 }).map((_, idx) => {
                    const flipX = idx % 2 === 1;
                    const flipY = Math.floor(idx / 4) % 2 === 1;
                    return (
                      <div key={idx} className="w-full h-full overflow-hidden">
                        <img
                          src={designUrl}
                          alt="Mirror tile"
                          className="w-full h-full object-cover"
                          style={{
                            transform: `scaleX(${flipX ? -1 : 1}) scaleY(${flipY ? -1 : 1}) rotate(${rotation}deg)`
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center space-y-2">
              <span className="text-[#AC7900] font-bold text-xs uppercase tracking-wider font-editorial">
                Raw Unprinted Base Fabric
              </span>
              <p className="text-[11px] text-[#8A8883] max-w-xs">
                Upload your custom design artwork to preview reactive digital print simulation with CM scale.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* OVERLAY CM BADGE */}
      <div className="bg-[#F9F6ED] dark:bg-[#161716] text-[#0F100F] dark:text-gray-300 px-4 py-2 border-t border-[#ECECEC] dark:border-white/[0.08] flex items-center justify-between text-[11px] font-mono z-20">
        <span className="text-[#AC7900] dark:text-[#D4AF37] font-bold">
          Canvas Scale: {widthCm}cm × {heightCm}cm
        </span>
        <span className="text-[#8A8883]">
          {selectedSizeType === 'swatch_test'
            ? 'Test Swatch (20×20 cm)'
            : selectedSizeType === 'swatch_big'
            ? 'Big Swatch (75×100 cm)'
            : `${meters} Meter Roll (${product.width})`}
        </span>
      </div>
    </div>
  );
};

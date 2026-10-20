import React from 'react';

interface JerseyTintedImageProps {
  src: string;
  alt: string;
  hex?: string;
  className?: string;
  eager?: boolean;
  strength?: number;
  disableTint?: boolean;
  onError?: (e: React.SyntheticEvent<HTMLImageElement>) => void;
}

const isBlank = (hex?: string) => !hex || hex.toUpperCase() === '#FFFFFF' || hex.toUpperCase() === '#FFF';

export const JerseyTintedImage: React.FC<JerseyTintedImageProps> = ({
  src,
  alt,
  hex,
  className = '',
  eager = false,
  strength = 1,
  disableTint = false,
  onError,
}) => {
  const blank = disableTint || isBlank(hex);
  return (
    <div className={`relative overflow-hidden isolate ${className}`}>
      <img
        src={src}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        onError={onError}
        className="absolute inset-0 w-full h-full object-cover"
        style={blank ? undefined : { filter: 'grayscale(1) contrast(1.08) brightness(1.04)' }}
      />
      {!blank && (
        <>
          <div
            className="absolute inset-0"
            style={{ backgroundColor: hex, mixBlendMode: 'color', opacity: 0.96 * strength }}
          />
          <div
            className="absolute inset-0"
            style={{ backgroundColor: hex, mixBlendMode: 'multiply', opacity: 0.3 * strength }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(155deg, rgba(255,255,255,0.30) 0%, rgba(255,255,255,0) 42%, rgba(0,0,0,0.32) 100%)',
              mixBlendMode: 'soft-light',
            }}
          />
        </>
      )}
    </div>
  );
};

export const isBlankColor = isBlank;

export const relativeLuminance = (hex: string): number => {
  const clean = hex.replace('#', '');
  const full =
    clean.length === 3
      ? clean
          .split('')
          .map((c) => c + c)
          .join('')
      : clean;
  const num = parseInt(full || 'FFFFFF', 16);
  const r = ((num >> 16) & 255) / 255;
  const g = ((num >> 8) & 255) / 255;
  const b = (num & 255) / 255;
  const f = (c: number) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};

export const contrastRatio = (hexA: string, hexB: string): number => {
  const la = relativeLuminance(hexA);
  const lb = relativeLuminance(hexB);
  const light = Math.max(la, lb);
  const dark = Math.min(la, lb);
  return (light + 0.05) / (dark + 0.05);
};

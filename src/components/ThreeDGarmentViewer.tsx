import React, { useRef, useEffect, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float } from '@react-three/drei';
import * as THREE from 'three';

export type FabricPBRType = 'cotton_jersey' | 'french_terry' | 'interlock_poly' | 'linen_silk';
export type LightingPreset = 'studio' | 'daylight' | 'neon';
export type StudioViewSide = 'front' | 'back' | 'left_sleeve' | 'right_sleeve';

interface ThreeDGarmentViewerProps {
  designUrl: string | null;
  color: { hex: string; name: string };
  rotation: number;
  scalePercent: number;
  artworkPlacement: string;
  isFlippedH: boolean;
  side: StudioViewSide;
  autoRotate?: boolean;
  modelType?: string;
  offsetX?: number;
  offsetY?: number;
  customText?: string;
  customTextColor?: string;
  customTextFont?: string;
  textArc?: number;
  strokeWidth?: number;
  strokeColor?: string;
  isEmbroidery?: boolean;
  embroideryThreadColor?: string;
  fabricPbr?: FabricPBRType;
  lightingPreset?: LightingPreset;
}

const PLACEMENTS: Record<string, { x: number; y: number; w: number; h: number }> = {
  chest_center: { x: 0, y: 0.12, w: 0.46, h: 0.46 },
  pocket_left: { x: -0.24, y: 0.18, w: 0.18, h: 0.18 },
  a4_front: { x: 0, y: 0.05, w: 0.65, h: 0.8 },
  oversized_front: { x: 0, y: 0.0, w: 0.85, h: 0.95 },
  upper_back: { x: 0, y: 0.22, w: 0.55, h: 0.55 },
  full_back: { x: 0, y: 0.02, w: 0.85, h: 1.1 },
};

const getGarmentImagePaths = (modelType?: string) => {
  if (!modelType) {
    return { front: '/mockups/white_tshirt_front.png', back: '/mockups/white_tshirt_back.png' };
  }
  if (modelType.includes('hoodie') || modelType.includes('sweatshirt')) {
    return { front: '/mockups/white_hoodie_front.png', back: '/mockups/white_hoodie_front.png' };
  }
  if (modelType.includes('polo')) {
    return { front: '/mockups/white_polo_front.png', back: '/mockups/white_polo_front.png' };
  }
  if (modelType.includes('oversized') || modelType.includes('acid')) {
    return { front: '/mockups/white_oversized_tee.png', back: '/mockups/white_oversized_tee.png' };
  }
  return { front: '/mockups/white_tshirt_front.png', back: '/mockups/white_tshirt_back.png' };
};

const PhotorealisticGarmentMesh: React.FC<{
  colorHex: string;
  designUrl: string | null;
  rotation: number;
  scalePercent: number;
  artworkPlacement: string;
  isFlippedH: boolean;
  side: StudioViewSide;
  modelType?: string;
  offsetX?: number;
  offsetY?: number;
  customText?: string;
  customTextColor?: string;
  customTextFont?: string;
  textArc?: number;
  strokeWidth?: number;
  strokeColor?: string;
  isEmbroidery?: boolean;
  embroideryThreadColor?: string;
  fabricPbr?: FabricPBRType;
}> = ({
  colorHex,
  designUrl,
  rotation,
  scalePercent,
  artworkPlacement,
  isFlippedH,
  side,
  modelType,
  offsetX = 0,
  offsetY = 0,
  customText,
  customTextColor = '#FFFFFF',
  customTextFont = 'sans-serif',
  textArc = 0,
  strokeWidth = 0,
  strokeColor = '#000000',
  isEmbroidery,
  embroideryThreadColor,
  fabricPbr = 'cotton_jersey'
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const frontMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const backMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const decalMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const decalMeshRef = useRef<THREE.Mesh>(null);

  const isPureWhite =
    colorHex.toLowerCase() === '#ffffff' ||
    colorHex.toLowerCase() === '#fff' ||
    colorHex.toLowerCase() === '#fdfbf7';

  const { front: frontSrc, back: backSrc } = useMemo(() => getGarmentImagePaths(modelType), [modelType]);

  // PBR Physical Material Roughness & Metalness per fabric selection
  const pbrParams = useMemo(() => {
    switch (fabricPbr) {
      case 'french_terry':
        return { roughness: 0.94, metalness: 0.01 };
      case 'interlock_poly':
        return { roughness: 0.36, metalness: 0.16 };
      case 'linen_silk':
        return { roughness: 0.46, metalness: 0.24 };
      case 'cotton_jersey':
      default:
        return { roughness: 0.82, metalness: 0.04 };
    }
  }, [fabricPbr]);

  // Load Front & Back Base Garment Textures
  useEffect(() => {
    const loader = new THREE.TextureLoader();

    loader.load(frontSrc, (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      if (frontMatRef.current) {
        frontMatRef.current.map = tex;
        frontMatRef.current.needsUpdate = true;
      }
    });

    loader.load(backSrc, (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      if (backMatRef.current) {
        backMatRef.current.map = tex;
        backMatRef.current.needsUpdate = true;
      }
    });
  }, [frontSrc, backSrc]);

  // Update color tinting and PBR parameters
  useEffect(() => {
    const tintColor = isPureWhite ? new THREE.Color(0xffffff) : new THREE.Color(colorHex);
    if (frontMatRef.current) {
      frontMatRef.current.color = tintColor;
      frontMatRef.current.roughness = pbrParams.roughness;
      frontMatRef.current.metalness = pbrParams.metalness;
      frontMatRef.current.needsUpdate = true;
    }
    if (backMatRef.current) {
      backMatRef.current.color = tintColor;
      backMatRef.current.roughness = pbrParams.roughness;
      backMatRef.current.metalness = pbrParams.metalness;
      backMatRef.current.needsUpdate = true;
    }
  }, [colorHex, isPureWhite, pbrParams]);

  // Rotate group with side / view angle preset
  useEffect(() => {
    if (groupRef.current) {
      let deg = 0;
      if (side === 'back') deg = 180;
      else if (side === 'left_sleeve') deg = -75;
      else if (side === 'right_sleeve') deg = 75;
      groupRef.current.rotation.y = THREE.MathUtils.degToRad(deg);
    }
  }, [side]);

  // Real-Time Dynamic Composite Texture (Graphic Image + Custom Text Overlay with Arcs & Strokes)
  useEffect(() => {
    const mat = decalMatRef.current;
    if (!mat) return;

    if (!designUrl && !customText) {
      mat.opacity = 0;
      mat.needsUpdate = true;
      return;
    }

    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, 1024, 1024);

    const renderText = () => {
      if (customText && customText.trim()) {
        ctx.save();
        ctx.font = `bold 64px ${customTextFont || 'sans-serif'}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = embroideryThreadColor || customTextColor || '#FFFFFF';
        ctx.shadowColor = 'rgba(0,0,0,0.6)';
        ctx.shadowBlur = 8;
        ctx.shadowOffsetY = 4;
        const textY = designUrl ? 880 : 512;

        if (textArc && Math.abs(textArc) > 5) {
          // Curved Arc Varsity / Streetwear Typography
          const radius = Math.max(180, 500 - Math.abs(textArc) * 3);
          const arcSign = textArc > 0 ? 1 : -1;
          const arcCenterY = textY + (arcSign > 0 ? radius : -radius);
          const chars = customText.split('');
          const totalAngle = (chars.length * 28) / radius;
          let currentAngle = -totalAngle / 2;

          chars.forEach((char) => {
            ctx.save();
            ctx.translate(512 + Math.sin(currentAngle) * radius, arcCenterY - Math.cos(currentAngle) * radius * arcSign);
            ctx.rotate(currentAngle * arcSign);
            if (strokeWidth && strokeWidth > 0) {
              ctx.strokeStyle = strokeColor || '#000000';
              ctx.lineWidth = strokeWidth * 2;
              ctx.strokeText(char, 0, 0);
            }
            ctx.fillText(char, 0, 0);
            ctx.restore();
            currentAngle += totalAngle / chars.length;
          });
        } else {
          // Standard Linear Typography with optional athletic stroke
          if (strokeWidth && strokeWidth > 0) {
            ctx.strokeStyle = strokeColor || '#000000';
            ctx.lineWidth = strokeWidth * 2;
            ctx.strokeText(customText, 512, textY);
          }
          ctx.fillText(customText, 512, textY);
        }

        ctx.restore();
      }

      const canvasTex = new THREE.CanvasTexture(canvas);
      canvasTex.colorSpace = THREE.SRGBColorSpace;
      canvasTex.needsUpdate = true;

      if (mat.map) mat.map.dispose();
      mat.map = canvasTex;
      mat.opacity = 1;
      mat.needsUpdate = true;
    };

    if (designUrl) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const hRatio = customText ? 0.75 : 0.9;
        const maxW = 1024 * 0.9;
        const maxH = 1024 * hRatio;
        const scale = Math.min(maxW / img.width, maxH / img.height);
        const drawW = img.width * scale;
        const drawH = img.height * scale;
        const drawX = (1024 - drawW) / 2;
        const drawY = customText ? (800 - drawH) / 2 + 30 : (1024 - drawH) / 2;

        ctx.drawImage(img, drawX, drawY, drawW, drawH);
        renderText();
      };
      img.onerror = () => {
        renderText();
      };
      img.src = designUrl;
    } else {
      renderText();
    }

    return () => {
      if (mat.map) {
        mat.map.dispose();
        mat.map = null;
      }
    };
  }, [designUrl, customText, customTextColor, customTextFont, textArc, strokeWidth, strokeColor, embroideryThreadColor]);

  const place = PLACEMENTS[artworkPlacement] || PLACEMENTS.chest_center;

  // Frame loop: updates position, rotation, and scale in 3D coordinate space
  useFrame(() => {
    if (!decalMeshRef.current) return;
    const s = scalePercent / 100;
    const isBack = side === 'back' || artworkPlacement.includes('back');

    // Convert 2D pixel offset into 3D unit coordinates
    const posX = (isFlippedH ? -place.x : place.x) + (offsetX / 280);
    const posY = place.y - (offsetY / 280);
    const posZ = isBack ? -0.04 : 0.04;

    decalMeshRef.current.position.set(posX, posY, posZ);
    decalMeshRef.current.rotation.y = isBack ? Math.PI : 0;
    decalMeshRef.current.rotation.z = -THREE.MathUtils.degToRad(rotation);
    decalMeshRef.current.scale.set(isFlippedH ? -place.w * s : place.w * s, place.h * s, 1);
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Front Photorealistic 3D Garment Face */}
      <mesh position={[0, 0, 0.01]} castShadow receiveShadow>
        <planeGeometry args={[2.2, 2.2, 16, 16]} />
        <meshStandardMaterial
          ref={frontMatRef}
          transparent
          alphaTest={0.05}
          roughness={0.85}
          metalness={0.02}
          side={THREE.FrontSide}
        />
      </mesh>

      {/* Back Photorealistic 3D Garment Face */}
      <mesh position={[0, 0, -0.01]} rotation={[0, Math.PI, 0]} castShadow receiveShadow>
        <planeGeometry args={[2.2, 2.2, 16, 16]} />
        <meshStandardMaterial
          ref={backMatRef}
          transparent
          alphaTest={0.05}
          roughness={0.85}
          metalness={0.02}
          side={THREE.FrontSide}
        />
      </mesh>

      {/* Uploaded Artwork Graphic + Text Dynamic Decal */}
      <mesh ref={decalMeshRef} position={[place.x, place.y, 0.04]}>
        <planeGeometry args={[place.w, place.h]} />
        <meshStandardMaterial
          ref={decalMatRef}
          transparent
          opacity={designUrl || customText ? 1 : 0}
          roughness={0.4}
          depthWrite={false}
          polygonOffset
          polygonOffsetFactor={-2}
        />
      </mesh>
    </group>
  );
};

export const ThreeDGarmentViewer: React.FC<ThreeDGarmentViewerProps> = ({
  designUrl,
  color,
  rotation,
  scalePercent,
  artworkPlacement,
  isFlippedH,
  side,
  autoRotate = false,
  modelType,
  offsetX = 0,
  offsetY = 0,
  customText,
  customTextColor,
  customTextFont,
  textArc = 0,
  strokeWidth = 0,
  strokeColor,
  isEmbroidery,
  embroideryThreadColor,
  fabricPbr = 'cotton_jersey',
  lightingPreset = 'studio'
}) => {
  return (
    <div className="w-full h-full relative select-none">
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [0, 0, 2.8], fov: 45 }}
        gl={{ preserveDrawingBuffer: true, antialias: true }}
      >
        {/* Dynamic Studio Lighting Presets */}
        {lightingPreset === 'daylight' ? (
          <>
            <ambientLight intensity={1.3} color="#FFFBF0" />
            <directionalLight position={[3, 5, 2]} intensity={1.8} color="#FFF5EB" castShadow />
            <directionalLight position={[-3, 2, -2]} intensity={0.9} color="#E0F2FE" />
          </>
        ) : lightingPreset === 'neon' ? (
          <>
            <ambientLight intensity={0.6} color="#1E1B4B" />
            <directionalLight position={[-3, 2, -2]} intensity={2.2} color="#EC4899" />
            <directionalLight position={[2, 3, 3]} intensity={2.4} color="#06B6D4" castShadow />
            <directionalLight position={[0, -3, 2]} intensity={1.0} color="#8B5CF6" />
          </>
        ) : (
          /* Standard Crisp Studio Spotlight */
          <>
            <ambientLight intensity={1.1} />
            <directionalLight position={[2, 3, 4]} intensity={1.4} castShadow />
            <directionalLight position={[-2, -2, -2]} intensity={0.5} />
            <directionalLight position={[0, 0, 3]} intensity={0.7} />
          </>
        )}

        <Float speed={autoRotate ? 1.5 : 0} rotationIntensity={autoRotate ? 0.2 : 0} floatIntensity={autoRotate ? 0.3 : 0}>
          <PhotorealisticGarmentMesh
            colorHex={color.hex}
            designUrl={designUrl}
            rotation={rotation}
            scalePercent={scalePercent}
            artworkPlacement={artworkPlacement}
            isFlippedH={isFlippedH}
            side={side}
            modelType={modelType}
            offsetX={offsetX}
            offsetY={offsetY}
            customText={customText}
            customTextColor={customTextColor}
            customTextFont={customTextFont}
            textArc={textArc}
            strokeWidth={strokeWidth}
            strokeColor={strokeColor}
            isEmbroidery={isEmbroidery}
            embroideryThreadColor={embroideryThreadColor}
            fabricPbr={fabricPbr}
          />
        </Float>

        <OrbitControls
          enablePan={false}
          minDistance={1.6}
          maxDistance={4.2}
          autoRotate={autoRotate}
          autoRotateSpeed={1.8}
          dampingFactor={0.06}
          maxPolarAngle={Math.PI / 1.8}
          minPolarAngle={Math.PI / 2.8}
        />
      </Canvas>
    </div>
  );
};

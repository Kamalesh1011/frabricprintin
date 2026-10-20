import React, { useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float } from '@react-three/drei';
import * as THREE from 'three';

interface ThreeDGarmentViewerProps {
  designUrl: string | null;
  color: { hex: string; name: string };
  rotation: number;
  scalePercent: number;
  artworkPlacement: string;
  isFlippedH: boolean;
  side: 'front' | 'back';
  autoRotate?: boolean;
  modelType?: string;
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
  side: 'front' | 'back';
  modelType?: string;
}> = ({ colorHex, designUrl, rotation, scalePercent, artworkPlacement, isFlippedH, side, modelType }) => {
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

  // Load Front & Back Textures
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

  // Update color tinting
  useEffect(() => {
    const tintColor = isPureWhite ? new THREE.Color(0xffffff) : new THREE.Color(colorHex);
    if (frontMatRef.current) {
      frontMatRef.current.color = tintColor;
      frontMatRef.current.needsUpdate = true;
    }
    if (backMatRef.current) {
      backMatRef.current.color = tintColor;
      backMatRef.current.needsUpdate = true;
    }
  }, [colorHex, isPureWhite]);

  // Rotate group with side / rotation
  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y = THREE.MathUtils.degToRad(side === 'back' ? rotation + 180 : rotation);
    }
  }, [rotation, side]);

  // Load Logo Graphic
  useEffect(() => {
    const mat = decalMatRef.current;
    if (!mat) return;
    if (mat.map) {
      mat.map.dispose();
      mat.map = null;
    }
    if (!designUrl) {
      mat.opacity = 0;
      mat.needsUpdate = true;
      return;
    }
    const loader = new THREE.TextureLoader();
    loader.load(
      designUrl,
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.wrapS = THREE.ClampToEdgeWrapping;
        tex.wrapT = THREE.ClampToEdgeWrapping;
        if (mat.map) mat.map.dispose();
        mat.map = tex;
        mat.opacity = 1;
        mat.needsUpdate = true;
      },
      undefined,
      () => {
        console.warn('Failed to load design texture');
      }
    );
    return () => {
      if (mat.map) {
        mat.map.dispose();
        mat.map = null;
      }
    };
  }, [designUrl]);

  const place = PLACEMENTS[artworkPlacement] || PLACEMENTS.chest_center;

  useFrame(() => {
    if (!decalMeshRef.current) return;
    const s = scalePercent / 100;
    const isBack = side === 'back' || artworkPlacement.includes('back');
    decalMeshRef.current.position.set(
      isFlippedH ? -place.x : place.x,
      place.y,
      isBack ? -0.04 : 0.04
    );
    decalMeshRef.current.rotation.y = isBack ? Math.PI : 0;
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

      {/* Uploaded Artwork Graphic Decal */}
      <mesh ref={decalMeshRef} position={[place.x, place.y, 0.04]}>
        <planeGeometry args={[place.w, place.h]} />
        <meshStandardMaterial
          ref={decalMatRef}
          transparent
          opacity={designUrl ? 1 : 0}
          roughness={0.5}
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
}) => {
  return (
    <div className="w-full h-full relative select-none">
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [0, 0, 2.6], fov: 42 }}
        style={{ width: '100%', height: '100%', touchAction: 'none' }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={1.1} />
        <directionalLight position={[2, 3, 3]} intensity={1.4} castShadow />
        <directionalLight position={[-2, 2, -2]} intensity={0.8} />

        <Float speed={1.2} rotationIntensity={0.08} floatIntensity={0.15}>
          <PhotorealisticGarmentMesh
            colorHex={color.hex}
            designUrl={designUrl}
            rotation={rotation}
            scalePercent={scalePercent}
            artworkPlacement={artworkPlacement}
            isFlippedH={isFlippedH}
            side={side}
            modelType={modelType}
          />
        </Float>

        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.05, 0]} receiveShadow>
          <planeGeometry args={[5, 5]} />
          <shadowMaterial opacity={0.15} />
        </mesh>

        <OrbitControls
          enablePan={false}
          enableZoom
          enableDamping
          dampingFactor={0.08}
          minDistance={1.6}
          maxDistance={4.5}
          maxPolarAngle={Math.PI / 1.7}
          minPolarAngle={Math.PI / 4}
          autoRotate={autoRotate}
          autoRotateSpeed={1.5}
          target={[0, 0, 0]}
        />
      </Canvas>
    </div>
  );
};
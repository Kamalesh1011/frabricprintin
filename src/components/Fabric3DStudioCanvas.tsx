import React, { useRef, useEffect, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

export type FabricStudio3DMode = 'draped_cloth';

export type FabricMaterialType =
  | 'modal_satin'
  | 'cotton_cambric'
  | 'silk_organza'
  | 'polyester_sublimation'
  | 'french_linen'
  | 'french_terry';

export type LightingAtmosphere = 'studio_softbox' | 'warm_sunlight' | 'dramatic_spotlight';

export type CameraPreset = 'perspective' | 'front' | 'side' | 'top' | 'macro';

interface Fabric3DClothStudioProps {
  mode: FabricStudio3DMode;
  designUrl: string;
  fabricImageUrl?: string;
  repeatMode: 'grid' | 'drop' | 'brick' | 'mirror' | 'centered';
  scalePercentage: number;
  rotationAngle: number;
  offsetX: number;
  offsetY: number;
  baseColor: string;
  materialType: FabricMaterialType;
  lightingAtmosphere: LightingAtmosphere;
  cameraPreset: CameraPreset;
  isWaving: boolean;
  isAutoRotate: boolean;
  compareMode: 'printed' | 'plain';
  textureIntensity: number;
}

// Generate Offscreen High-Definition Fabric Texture with Weave & Seamless Repeat
export function generateFabricTextureCanvas(
  designUrl: string,
  repeatMode: 'grid' | 'drop' | 'brick' | 'mirror' | 'centered',
  scalePercentage: number,
  rotationAngle: number,
  offsetX: number,
  offsetY: number,
  baseColor: string,
  materialType: FabricMaterialType,
  textureIntensity: number,
  showPlain: boolean,
  callback: (texture: THREE.CanvasTexture) => void,
  fabricImageUrl?: string
) {
  const size = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // 1. Base Fabric Color Fill
  ctx.fillStyle = baseColor || '#FAF8F5';
  ctx.fillRect(0, 0, size, size);

  // 1b. Draw real product fabric photo as base layer (drawn async, chain into weave)
  const drawWeaveAndDesign = () => {
  const weaveOpacity = (textureIntensity / 100) * 0.16;
  ctx.save();
  ctx.fillStyle = `rgba(0, 0, 0, ${weaveOpacity})`;

  if (materialType === 'french_linen') {
    // Slub yarn crosshatch (irregular flax fibers)
    for (let x = 0; x < size; x += 6) {
      const thickness = x % 12 === 0 ? 2.5 : 1;
      ctx.fillRect(x, 0, thickness, size);
    }
    for (let y = 0; y < size; y += 6) {
      const thickness = y % 18 === 0 ? 3 : 1;
      ctx.fillRect(0, y, size, thickness);
    }
  } else if (materialType === 'cotton_cambric') {
    // Fine combed cotton plain weave
    for (let x = 0; x < size; x += 4) {
      ctx.fillRect(x, 0, 1.2, size);
    }
    for (let y = 0; y < size; y += 4) {
      ctx.fillRect(0, y, size, 1.2);
    }
  } else if (materialType === 'silk_organza') {
    // Sheer, ultra-fine grid structure
    for (let x = 0; x < size; x += 5) {
      ctx.fillRect(x, 0, 0.8, size);
    }
    for (let y = 0; y < size; y += 5) {
      ctx.fillRect(0, y, size, 0.8);
    }
  } else if (materialType === 'modal_satin') {
    // Lustrous satin floats
    for (let x = 0; x < size; x += 8) {
      ctx.fillRect(x, 0, 1, size);
    }
    for (let y = 0; y < size; y += 3) {
      ctx.fillRect(0, y, size, 0.6);
    }
  } else {
    // Standard high-res woven grid
    for (let x = 0; x < size; x += 4) {
      ctx.fillRect(x, 0, 1, size);
    }
    for (let y = 0; y < size; y += 4) {
      ctx.fillRect(0, y, size, 1);
    }
  }
  ctx.restore();

  // 3. Render Printed Artwork Layer (if not plain base mode)
  if (designUrl && !showPlain) {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = designUrl;

    img.onload = () => {
      ctx.save();

      // Dye-sublimation / reactive print fiber absorption blending
      ctx.globalCompositeOperation = 'multiply';
      ctx.globalAlpha = materialType === 'silk_organza' ? 0.78 : 0.94;

      const baseTileSize = (size / 3.5) * (scalePercentage / 100);
      const tileW = Math.max(24, baseTileSize);
      const tileH = Math.max(24, baseTileSize * (img.height / img.width || 1));

      const tileCanvas = document.createElement('canvas');
      tileCanvas.width = tileW;
      tileCanvas.height = tileH;
      const tileCtx = tileCanvas.getContext('2d');

      if (tileCtx) {
        tileCtx.save();
        tileCtx.translate(tileW / 2, tileH / 2);
        tileCtx.rotate((rotationAngle * Math.PI) / 180);
        tileCtx.drawImage(img, -tileW / 2, -tileH / 2, tileW, tileH);
        tileCtx.restore();

        const panX = offsetX % tileW;
        const panY = offsetY % tileH;

        if (repeatMode === 'centered') {
          // Single Placement / Center Motif
          const cx = (size - tileW) / 2 + offsetX;
          const cy = (size - tileH) / 2 + offsetY;
          ctx.drawImage(tileCanvas, cx, cy, tileW, tileH);
        } else if (repeatMode === 'drop') {
          // Half-Drop Repeat (Staggered columns)
          let col = 0;
          for (let x = -tileW * 2 + panX; x < size + tileW * 2; x += tileW) {
            const yStagger = col % 2 === 1 ? tileH / 2 : 0;
            for (let y = -tileH * 2 + panY; y < size + tileH * 2; y += tileH) {
              ctx.drawImage(tileCanvas, x, y + yStagger, tileW, tileH);
            }
            col++;
          }
        } else if (repeatMode === 'brick') {
          // Half-Brick Repeat (Staggered rows)
          let row = 0;
          for (let y = -tileH * 2 + panY; y < size + tileH * 2; y += tileH) {
            const xStagger = row % 2 === 1 ? tileW / 2 : 0;
            for (let x = -tileW * 2 + panX; x < size + tileW * 2; x += tileW) {
              ctx.drawImage(tileCanvas, x + xStagger, y, tileW, tileH);
            }
            row++;
          }
        } else if (repeatMode === 'mirror') {
          // Mirrored 4-Way Symmetrical Repeat
          for (let x = -tileW * 2 + panX; x < size + tileW * 2; x += tileW * 2) {
            for (let y = -tileH * 2 + panY; y < size + tileH * 2; y += tileH * 2) {
              ctx.drawImage(tileCanvas, x, y, tileW, tileH);

              ctx.save();
              ctx.translate(x + tileW * 2, y);
              ctx.scale(-1, 1);
              ctx.drawImage(tileCanvas, 0, 0, tileW, tileH);
              ctx.restore();

              ctx.save();
              ctx.translate(x, y + tileH * 2);
              ctx.scale(1, -1);
              ctx.drawImage(tileCanvas, 0, 0, tileW, tileH);
              ctx.restore();

              ctx.save();
              ctx.translate(x + tileW * 2, y + tileH * 2);
              ctx.scale(-1, -1);
              ctx.drawImage(tileCanvas, 0, 0, tileW, tileH);
              ctx.restore();
            }
          }
        } else {
          // Straight Grid Repeat
          for (let x = -tileW * 2 + panX; x < size + tileW * 2; x += tileW) {
            for (let y = -tileH * 2 + panY; y < size + tileH * 2; y += tileH) {
              ctx.drawImage(tileCanvas, x, y, tileW, tileH);
            }
          }
        }
      }

      ctx.restore();

      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.needsUpdate = true;
      callback(texture);
    };

    img.onerror = () => {
      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.needsUpdate = true;
      callback(texture);
    };
  } else {
    // Pure plain base fabric texture
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;
    callback(texture);
  }
  }; // end drawWeaveAndDesign

  // Run weave and design directly for pure 3D fabric wrapping
  drawWeaveAndDesign();
}

// ─────────────────────────────────────────────────────────────────────────────
// 3D MODE: FLOWING DRAPED CLOTH WITH NATURAL FOLDS & SHADOWS

// ─────────────────────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
const DrapedClothMesh: React.FC<{
  texture: THREE.CanvasTexture | null;
  materialType: FabricMaterialType;
  isWaving: boolean;
}> = ({ texture, materialType, isWaving }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const waveTimeRef = useRef<number>(0);

  // Generate High-Density Parametric Draped Cloth Geometry
  const geometry = useMemo(() => {
    const geom = new THREE.PlaneGeometry(3.8, 3.8, 96, 96);
    const pos = geom.attributes.position;

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);

      // Cascading vertical folds, ripples, and natural gravity sag
      const mainFold = Math.sin(x * 3.4 + 0.3) * 0.38;
      const subFold = Math.sin(x * 6.8) * 0.12;
      const waveRipple = Math.sin(x * 4.2 + y * 1.2) * 0.06;
      const horizontalSag = (1 - (y / 1.9) * (y / 1.9)) * 0.22;
      const gentleCurve = Math.cos(x * 1.6) * 0.18;

      const z = mainFold + subFold + waveRipple + horizontalSag - gentleCurve;
      pos.setZ(i, z);
    }

    geom.computeVertexNormals();
    return geom;
  }, []);

  // Material PBR Properties
  const pbrProps = useMemo(() => {
    switch (materialType) {
      case 'modal_satin':
        return { roughness: 0.16, metalness: 0.14, clearcoat: 0.4 };
      case 'silk_organza':
        return { roughness: 0.26, metalness: 0.08, transparent: true, opacity: 0.88 };
      case 'polyester_sublimation':
        return { roughness: 0.28, metalness: 0.05, clearcoat: 0.2 };
      case 'french_linen':
        return { roughness: 0.94, metalness: 0.0 };
      case 'french_terry':
        return { roughness: 0.9, metalness: 0.0 };
      case 'cotton_cambric':
      default:
        return { roughness: 0.84, metalness: 0.0 };
    }
  }, [materialType]);

  // Dynamic Waving Animation
  useFrame((_, delta) => {
    if (isWaving && meshRef.current) {
      waveTimeRef.current += delta * 1.3;
      const pos = geometry.attributes.position;

      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const y = pos.getY(i);

        const mainFold = Math.sin(x * 3.4 + 0.3 + Math.sin(waveTimeRef.current * 0.7) * 0.12) * 0.38;
        const dynamicWave = Math.sin(x * 4.0 + y * 1.4 + waveTimeRef.current) * 0.06;
        const subFold = Math.sin(x * 6.8) * 0.12;
        const horizontalSag = (1 - (y / 1.9) * (y / 1.9)) * 0.22;
        const gentleCurve = Math.cos(x * 1.6) * 0.18;

        const z = mainFold + dynamicWave + subFold + horizontalSag - gentleCurve;
        pos.setZ(i, z);
      }

      geometry.computeVertexNormals();
      pos.needsUpdate = true;
    }
  });

  return (
    <mesh ref={meshRef} geometry={geometry} castShadow receiveShadow position={[0, 0, 0]}>
      <meshStandardMaterial
        map={texture || undefined}
        roughness={pbrProps.roughness}
        metalness={pbrProps.metalness}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// STUDIO LIGHTING ENVIRONMENT
// ─────────────────────────────────────────────────────────────────────────────
const StudioLighting: React.FC<{ atmosphere: LightingAtmosphere }> = ({ atmosphere }) => {
  return (
    <>
      {atmosphere === 'warm_sunlight' ? (
        <>
          <ambientLight intensity={0.7} color="#FFF8E7" />
          <directionalLight
            position={[4, 6, 5]}
            intensity={1.6}
            color="#FFF2D6"
            castShadow
            shadow-mapSize={[1024, 1024]}
          />
          <directionalLight position={[-4, 2, -2]} intensity={0.5} color="#E0F2FE" />
          <hemisphereLight color="#FFF8E7" groundColor="#78350F" intensity={0.4} />
        </>
      ) : atmosphere === 'dramatic_spotlight' ? (
        <>
          <ambientLight intensity={0.35} color="#FFFFFF" />
          <directionalLight
            position={[2, 5, 4]}
            intensity={2.4}
            color="#FFFFFF"
            castShadow
            shadow-mapSize={[1024, 1024]}
          />
          <directionalLight position={[-3, -2, -3]} intensity={0.25} color="#93C5FD" />
          <hemisphereLight color="#FFFFFF" groundColor="#000000" intensity={0.2} />
        </>
      ) : (
        // Standard Industrial Studio Softbox
        <>
          <ambientLight intensity={0.85} color="#FFFFFF" />
          <directionalLight
            position={[3, 5, 4]}
            intensity={1.3}
            color="#FFFFFF"
            castShadow
            shadow-mapSize={[1024, 1024]}
          />
          <directionalLight position={[-3, 3, -3]} intensity={0.65} color="#F8FAFC" />
          <directionalLight position={[0, -4, 2]} intensity={0.35} color="#FFFFFF" />
          <hemisphereLight color="#FFFFFF" groundColor="#334155" intensity={0.4} />
        </>
      )}
    </>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// CAMERA CONTROLLER WITH SMOOTH ORBIT AND PRESETS
// ─────────────────────────────────────────────────────────────────────────────
const CameraController: React.FC<{
  preset: CameraPreset;
  isAutoRotate: boolean;
}> = ({ preset, isAutoRotate }) => {
  const controlsRef = useRef<any>(null);

  useEffect(() => {
    if (!controlsRef.current) return;
    const controls = controlsRef.current;

    switch (preset) {
      case 'front':
        controls.object.position.set(0, 0, 4.2);
        controls.target.set(0, 0, 0);
        break;
      case 'side':
        controls.object.position.set(3.4, 0.5, 2.2);
        controls.target.set(0, 0, 0);
        break;
      case 'top':
        controls.object.position.set(0, 4.2, 0.8);
        controls.target.set(0, 0, 0);
        break;
      case 'macro':
        controls.object.position.set(0.6, -0.3, 1.8);
        controls.target.set(0, 0, 0);
        break;
      case 'perspective':
      default:
        controls.object.position.set(0, 0.2, 4.4);
        controls.target.set(0, 0, 0);
        break;
    }
    controls.update();
  }, [preset]);

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.06}
      minDistance={1.4}
      maxDistance={8.0}
      autoRotate={isAutoRotate}
      autoRotateSpeed={1.8}
      maxPolarAngle={Math.PI / 1.7}
      minPolarAngle={Math.PI / 7}
    />
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN 3D FABRIC STUDIO CANVAS COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export const Fabric3DClothStudio: React.FC<Fabric3DClothStudioProps> = (props) => {
  const [texture, setTexture] = useState<THREE.CanvasTexture | null>(null);

  useEffect(() => {
    const showPlain = props.compareMode === 'plain';

    generateFabricTextureCanvas(
      props.designUrl,
      props.repeatMode,
      props.scalePercentage,
      props.rotationAngle,
      props.offsetX,
      props.offsetY,
      props.baseColor,
      props.materialType,
      props.textureIntensity,
      showPlain,
      (newTexture) => {
        setTexture(newTexture);
      },
      props.fabricImageUrl
    );
  }, [
    props.designUrl,
    props.repeatMode,
    props.scalePercentage,
    props.rotationAngle,
    props.offsetX,
    props.offsetY,
    props.baseColor,
    props.materialType,
    props.textureIntensity,
    props.compareMode,
    props.fabricImageUrl
  ]);

  return (
    <div className="w-full h-full relative select-none">
      <Canvas
        shadows
        camera={{ position: [0, 0.2, 4.4], fov: 45 }}
        gl={{ antialias: true, preserveDrawingBuffer: true }}
        className="w-full h-full"
      >
        <color attach="background" args={['#F5F2EB']} />
        <StudioLighting atmosphere={props.lightingAtmosphere} />
        <DrapedClothMesh texture={texture} materialType={props.materialType} isWaving={props.isWaving} />
        <CameraController preset={props.cameraPreset} isAutoRotate={props.isAutoRotate} />
      </Canvas>
    </div>
  );
};

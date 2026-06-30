'use client';

import { useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import {
  Bone,
  BoxGeometry,
  Color,
  Float32BufferAttribute,
  MathUtils,
  MeshStandardMaterial,
  Skeleton,
  SkinnedMesh,
  SRGBColorSpace,
  Uint16BufferAttribute,
  Vector3,
  CanvasTexture,
} from 'three';
import { useFrame } from '@react-three/fiber';
import { easing } from 'maath';
import { generatePageTexture, PageTextureData } from './PageTextureGenerator';
import { bookPages, LEAF_COUNT } from '../../data/v2/bookPages';

const { degToRad } = MathUtils;

// ─── Constants ────────────────────────────────────────────────────────────────

const easingFactor = 0.5;
const easingFactorFold = 0.3;
const insideCurveStrength = 0.18;
const outsideCurveStrength = 0.05;
const turningCurveStrength = 0.09;

const PAGE_WIDTH = 1.28;
const PAGE_HEIGHT = 1.71;
const PAGE_DEPTH = 0.003;
const PAGE_SEGMENTS = 30;
const SEGMENT_WIDTH = PAGE_WIDTH / PAGE_SEGMENTS;

// ─── Module-level geometry (created once) ─────────────────────────────────────

const pageGeometry = new BoxGeometry(PAGE_WIDTH, PAGE_HEIGHT, PAGE_DEPTH, PAGE_SEGMENTS, 2);
pageGeometry.translate(PAGE_WIDTH / 2, 0, 0);

const position = pageGeometry.attributes.position;
const vertex = new Vector3();
const skinIndexes: number[] = [];
const skinWeights: number[] = [];

for (let i = 0; i < position.count; i++) {
  vertex.fromBufferAttribute(position, i);
  const x = vertex.x;
  const skinIndex = Math.max(0, Math.floor(x / SEGMENT_WIDTH));
  const skinWeight = (x % SEGMENT_WIDTH) / SEGMENT_WIDTH;
  skinIndexes.push(skinIndex, skinIndex + 1, 0, 0);
  skinWeights.push(1 - skinWeight, skinWeight, 0, 0);
}

pageGeometry.setAttribute('skinIndex', new Uint16BufferAttribute(skinIndexes, 4));
pageGeometry.setAttribute('skinWeight', new Float32BufferAttribute(skinWeights, 4));

// Base materials for the 4 box sides (right, left, top, bottom) — not front/back faces
const pageSideMaterials = [
  new MeshStandardMaterial({ color: '#F1E4C0' }), // right side (spine edge glow)
  new MeshStandardMaterial({ color: '#D9C293' }), // left side
  new MeshStandardMaterial({ color: '#D9C293' }), // top
  new MeshStandardMaterial({ color: '#D9C293' }), // bottom
];

// ─── Experience page UV → project index ──────────────────────────────────────
// Canvas layout: H=704, content starts at y=128, ends at y≈620.
// Divide content area into equal bands — one per project.
function projectIndexFromUVy(uvY: number, count: number): number {
  const canvasY = (1 - uvY) * 704;
  const contentStart = 128;
  const contentEnd = 620;
  if (canvasY < contentStart || canvasY > contentEnd || count === 0) return -1;
  const band = (contentEnd - contentStart) / count;
  return Math.min(Math.floor((canvasY - contentStart) / band), count - 1);
}

// ─── Leaf component ───────────────────────────────────────────────────────────

interface LeafProps {
  leafIndex: number;
  totalLeaves: number;
  opened: boolean;
  bookClosed: boolean;
  frontTexture: CanvasTexture;
  backTexture: CanvasTexture;
  onLeafClick: (leafIndex: number) => void;
  onDrag?: (deltaX: number) => void;
  isExperiencePage?: boolean;
  experienceCount?: number;
  onProjectClick?: (index: number) => void;
}

function Leaf({
  leafIndex,
  totalLeaves,
  opened,
  bookClosed,
  frontTexture,
  backTexture,
  onLeafClick,
  onDrag,
  isExperiencePage,
  experienceCount = 0,
  onProjectClick,
}: LeafProps) {
  const groupRef = useRef<THREE.Group>(null);
  const skinnedMeshRef = useRef<THREE.SkinnedMesh>(null);
  const turnedAt = useRef(0);
  const lastOpened = useRef(opened);

  const manualSkinnedMesh = useMemo(() => {
    const bones: Bone[] = [];
    for (let i = 0; i <= PAGE_SEGMENTS; i++) {
      const bone = new Bone();
      bones.push(bone);
      if (i === 0) bone.position.x = 0;
      else bone.position.x = SEGMENT_WIDTH;
      if (i > 0) bones[i - 1].add(bone);
    }
    const skeleton = new Skeleton(bones);

    const materials = [
      ...pageSideMaterials,
      new MeshStandardMaterial({
        map: frontTexture,
        roughness: leafIndex === 0 ? 0.8 : 0.1,
        emissive: new Color('orange'),
        emissiveIntensity: 0,
      }),
      new MeshStandardMaterial({
        map: backTexture,
        roughness: leafIndex === totalLeaves - 1 ? 0.8 : 0.1,
        emissive: new Color('orange'),
        emissiveIntensity: 0,
      }),
    ];

    const mesh = new SkinnedMesh(pageGeometry, materials);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.frustumCulled = false;
    mesh.add(skeleton.bones[0]);
    mesh.bind(skeleton);
    return mesh;
  }, [frontTexture, backTexture, leafIndex, totalLeaves]);

  useFrame((_, delta) => {
    if (!skinnedMeshRef.current || !groupRef.current) return;

    if (lastOpened.current !== opened) {
      turnedAt.current = +new Date();
      lastOpened.current = opened;
    }

    let turningTime = Math.min(400, +new Date() - turnedAt.current) / 400;
    turningTime = Math.sin(turningTime * Math.PI);

    let targetRotation = opened ? -Math.PI / 2 : Math.PI / 2;
    if (!bookClosed) {
      targetRotation += degToRad(leafIndex * 0.8);
    }

    const bones = skinnedMeshRef.current.skeleton.bones;
    for (let i = 0; i < bones.length; i++) {
      const target = i === 0 ? groupRef.current : bones[i];
      const insideCurveIntensity = i < 8 ? Math.sin(i * 0.2 + 0.25) : 0;
      const outsideCurveIntensity = i >= 8 ? Math.cos(i * 0.3 + 0.09) : 0;
      const turningIntensity =
        Math.sin(i * Math.PI * (1 / bones.length)) * turningTime;

      let rotationAngle =
        insideCurveStrength * insideCurveIntensity * targetRotation -
        outsideCurveStrength * outsideCurveIntensity * targetRotation +
        turningCurveStrength * turningIntensity * targetRotation;

      let foldRotationAngle = degToRad(Math.sign(targetRotation) * 2);

      if (bookClosed) {
        if (i === 0) {
          rotationAngle = targetRotation;
          foldRotationAngle = 0;
        } else {
          rotationAngle = 0;
          foldRotationAngle = 0;
        }
      }

      easing.dampAngle(
        target.rotation as { y: number; x: number },
        'y',
        rotationAngle,
        easingFactor,
        delta
      );

      const foldIntensity =
        i > 8
          ? Math.sin(i * Math.PI * (1 / bones.length) - 0.5) * turningTime
          : 0;

      easing.dampAngle(
        target.rotation as { y: number; x: number },
        'x',
        foldRotationAngle * foldIntensity,
        easingFactorFold,
        delta
      );
    }
  });

  return (
    <group ref={groupRef}>
      {/* Skinned mesh — visual only, raycasting disabled (expensive against bones) */}
      <primitive
        object={manualSkinnedMesh}
        ref={skinnedMeshRef}
        position-z={-leafIndex * PAGE_DEPTH}
        raycast={() => null}
      />
      {/* Cheap invisible hit area — onPointerDown starts gesture; window pointerup ends it
          (window-level listener fires even if mouse leaves the mesh during drag) */}
      <mesh
        position-x={PAGE_WIDTH / 2}
        onPointerDown={(e) => {
          e.stopPropagation();
          const startX = e.clientX;
          // Capture UV at click moment — e.uv is populated by Three.js raycasting
          const hitUVy = e.uv ? e.uv.y : null;
          let dragged = false;

          const onMove = (ev: PointerEvent) => {
            if (Math.abs(ev.clientX - startX) > 6) dragged = true;
          };
          const onUp = (ev: PointerEvent) => {
            window.removeEventListener('pointermove', onMove);
            window.removeEventListener('pointerup', onUp);
            const delta = ev.clientX - startX;
            if (!dragged || Math.abs(delta) < 12) {
              // Click — check if on experience page and in a project zone
              if (isExperiencePage && hitUVy !== null && onProjectClick) {
                const idx = projectIndexFromUVy(hitUVy, experienceCount);
                if (idx >= 0) { onProjectClick(idx); return; }
              }
              onLeafClick(leafIndex);
            } else {
              onDrag?.(delta);
            }
          };
          window.addEventListener('pointermove', onMove);
          window.addEventListener('pointerup', onUp);
        }}
      >
        <boxGeometry args={[PAGE_WIDTH, PAGE_HEIGHT, 0.04]} />
        <meshBasicMaterial visible={false} />
      </mesh>
    </group>
  );
}

// ─── BookFlip component ───────────────────────────────────────────────────────

interface BookFlipProps {
  currentPage: number;
  isOpen: boolean;
  onLeafClick: (leafIndex: number) => void;
  onPageDrag?: (deltaX: number) => void;
  cvData: PageTextureData;
  onProjectClick?: (index: number) => void;
}

export default function BookFlip({
  currentPage,
  isOpen,
  onLeafClick,
  onPageDrag,
  cvData,
  onProjectClick,
}: BookFlipProps) {
  const textures = useMemo(() => {
    return bookPages.map((page) => {
      const canvas = generatePageTexture(page.face, cvData);
      const tex = new CanvasTexture(canvas);
      tex.colorSpace = SRGBColorSpace;
      tex.needsUpdate = true;
      return tex;
    });
  }, [cvData]);

  useEffect(() => {
    return () => {
      textures.forEach(tex => tex.dispose());
    };
  }, [textures]);

  return (
    <group>
      {Array.from({ length: LEAF_COUNT }, (_, i) => (
        <Leaf
          key={i}
          leafIndex={i}
          totalLeaves={LEAF_COUNT}
          opened={i < currentPage}
          bookClosed={!isOpen}
          frontTexture={textures[i * 2]}
          backTexture={textures[i * 2 + 1]}
          onLeafClick={onLeafClick}
          onDrag={onPageDrag}
          isExperiencePage={i === 2 && currentPage === 2 && isOpen}
          experienceCount={cvData.experience.length}
          onProjectClick={onProjectClick}
        />
      ))}
    </group>
  );
}

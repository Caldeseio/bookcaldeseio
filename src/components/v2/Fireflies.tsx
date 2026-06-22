'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface FirefliesProps {
  count?: number;
  spread?: number;
  height?: number;
  color?: string;
  size?: number;
}

export default function Fireflies({
  count = 180,
  spread = 20,
  height = 4,
  color = '#88ffaa',
  size = 0.07,
}: FirefliesProps) {
  const basePositions = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * spread;
      positions[i * 3]     = Math.cos(angle) * radius;
      positions[i * 3 + 1] = 0.5 + Math.random() * (height - 0.5);
      positions[i * 3 + 2] = Math.sin(angle) * radius;
    }
    return positions;
  }, [count, spread, height]);

  // Precompute per-firefly phase offsets so the loop only does cheap math
  const phases = useMemo(() => new Float32Array(count).map((_, i) => i * 0.15), [count]);

  const posRef = useRef<Float32Array>(basePositions.slice());
  const geomRef = useRef<THREE.BufferGeometry>(null);
  const matRef = useRef<THREE.PointsMaterial>(null);
  // Only update GPU buffer every other frame
  const frameSkip = useRef(0);

  useFrame(({ clock }) => {
    frameSkip.current ^= 1;
    const t = clock.getElapsedTime();
    const pos = posRef.current;
    for (let i = 0; i < count; i++) {
      const ph = phases[i];
      pos[i * 3]     = basePositions[i * 3]     + Math.sin(t * 0.18 + ph) * 0.28;
      pos[i * 3 + 1] = basePositions[i * 3 + 1] + Math.sin(t + ph)        * 0.28;
      pos[i * 3 + 2] = basePositions[i * 3 + 2] + Math.cos(t * 0.18 + ph) * 0.28;
    }
    if (geomRef.current && frameSkip.current === 0) {
      geomRef.current.attributes.position.needsUpdate = true;
    }
    if (matRef.current && frameSkip.current === 0) {
      matRef.current.size = size * (0.75 + 0.25 * Math.sin(t * 1.8));
    }
  });

  return (
    <points>
      <bufferGeometry ref={geomRef}>
        <bufferAttribute
          attach="attributes-position"
          args={[posRef.current, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        ref={matRef}
        color={color}
        size={size}
        sizeAttenuation
        transparent
        opacity={0.85}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

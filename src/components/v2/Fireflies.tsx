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
  count = 600,
  spread = 20,
  height = 4,
  color = '#88ffaa',
  size = 0.06,
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

  const posRef = useRef<Float32Array>(basePositions.slice());
  const geomRef = useRef<THREE.BufferGeometry>(null);
  const matRef = useRef<THREE.PointsMaterial>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const pos = posRef.current;
    for (let i = 0; i < count; i++) {
      pos[i * 3]     = basePositions[i * 3]     + Math.sin(t * 0.2 + i) * 0.3;
      pos[i * 3 + 1] = basePositions[i * 3 + 1] + Math.sin(t + i * 0.15) * 0.3;
      pos[i * 3 + 2] = basePositions[i * 3 + 2] + Math.cos(t * 0.2 + i) * 0.3;
    }
    if (geomRef.current) {
      geomRef.current.attributes.position.needsUpdate = true;
    }
    if (matRef.current) {
      matRef.current.size = size * (0.7 + 0.3 * Math.sin(t * 2));
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

'use client';

import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

const COUNT = 60;
const FALL_SPEED = 0.004;
const Y_TOP = 14;
const Y_BOT = -1.0;

export default function SparkleRain() {
  const geomRef = useRef<THREE.BufferGeometry>(null);
  const frameSkip = useRef(0);

  const { positions, speeds } = useMemo(() => {
    const pos = new Float32Array(COUNT * 3);
    const spd = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 18;
      pos[i * 3 + 1] = Y_BOT + Math.random() * (Y_TOP - Y_BOT);
      pos[i * 3 + 2] = (Math.random() - 0.5) * 18;
      spd[i] = FALL_SPEED * (0.5 + Math.random());
    }
    return { positions: pos, speeds: spd };
  }, []);

  useFrame(() => {
    frameSkip.current = (frameSkip.current + 1) % 3;
    if (frameSkip.current !== 0) return;

    for (let i = 0; i < COUNT; i++) {
      positions[i * 3 + 1] -= speeds[i] * 3; // compensate for 3-frame skip
      if (positions[i * 3 + 1] < Y_BOT) {
        positions[i * 3]     = (Math.random() - 0.5) * 18;
        positions[i * 3 + 1] = Y_TOP;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 18;
      }
    }

    if (geomRef.current) {
      geomRef.current.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points>
      <bufferGeometry ref={geomRef}>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#e8f8ff"
        size={0.045}
        sizeAttenuation
        transparent
        opacity={0.65}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

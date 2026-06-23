'use client';

import { useRef, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import Fireflies from './Fireflies';
import Fairy from './Fairy';
import SparkleRain from './SparkleRain';

const TREE_COUNT = 40;

// Per-tree canopy color variation (computed once at module level)
const CANOPY_COLORS = Array.from({ length: TREE_COUNT }, () => {
  const h = 0.28 + (Math.random() - 0.5) * 0.12; // green hue range
  const s = 0.55 + Math.random() * 0.3;
  const l = 0.22 + Math.random() * 0.18;
  return new THREE.Color().setHSL(h, s, l);
});

// Mushroom glow positions & colors (scattered around base of tree ring)
const MUSHROOM_GLOWS = [
  { pos: [4.2, -0.3, 3.8] as [number,number,number], color: '#7affb0', intensity: 2.5, distance: 4 },
  { pos: [-5.1, -0.3, 2.4] as [number,number,number], color: '#b06aff', intensity: 2.0, distance: 3.5 },
  { pos: [2.8, -0.3, -5.5] as [number,number,number], color: '#ff9a4a', intensity: 2.2, distance: 3.5 },
  { pos: [-3.6, -0.3, -4.2] as [number,number,number], color: '#4adcff', intensity: 1.8, distance: 3 },
];

export default function ForestScene() {
  const trunkRef = useRef<THREE.InstancedMesh>(null);
  const canopyRef = useRef<THREE.InstancedMesh>(null);
  const ambientRef = useRef<THREE.AmbientLight>(null);

  useEffect(() => {
    if (!trunkRef.current || !canopyRef.current) return;
    const dummy = new THREE.Object3D();

    for (let i = 0; i < TREE_COUNT; i++) {
      const angle =
        (i / TREE_COUNT) * Math.PI * 2 + (Math.random() - 0.5) * 0.8;
      const r = 5 + Math.random() * 13;
      const x = Math.cos(angle) * r;
      const z = Math.sin(angle) * r;
      const scale = 0.6 + Math.random() * 0.8;

      // Trunk
      dummy.position.set(x, -0.5 + 0.75 * scale, z);
      dummy.rotation.y = Math.random() * Math.PI * 2;
      dummy.scale.setScalar(scale);
      dummy.updateMatrix();
      trunkRef.current.setMatrixAt(i, dummy.matrix);

      // Canopy (higher up)
      dummy.position.set(x, -0.5 + 1.5 * scale + 1.75 * scale, z);
      dummy.rotation.y = Math.random() * Math.PI * 2;
      dummy.scale.setScalar(scale);
      dummy.updateMatrix();
      canopyRef.current.setMatrixAt(i, dummy.matrix);
      canopyRef.current.setColorAt(i, CANOPY_COLORS[i]);
    }

    trunkRef.current.instanceMatrix.needsUpdate = true;
    canopyRef.current.instanceMatrix.needsUpdate = true;
    if (canopyRef.current.instanceColor) canopyRef.current.instanceColor.needsUpdate = true;
  }, []);

  // Slow ambient pulse — forest "breathes"
  useFrame(({ clock }) => {
    if (ambientRef.current) {
      ambientRef.current.intensity = 1.0 + Math.sin(clock.getElapsedTime() * 0.4) * 0.18;
    }
  });

  const starPositions = useMemo(() => {
    const pos = new Float32Array(200 * 3);
    for (let i = 0; i < 200; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = 15 + Math.random() * 10;
      pos[i * 3] = Math.cos(angle) * r;
      pos[i * 3 + 1] = 5 + Math.random() * 10;
      pos[i * 3 + 2] = Math.sin(angle) * r;
    }
    return pos;
  }, []);

  return (
    <>
      {/* Fog */}
      <fogExp2 attach="fog" args={['#0d2a12', 0.02]} />

      {/* Lighting */}
      <ambientLight ref={ambientRef} color="#3a7a3a" intensity={1.0} />
      <hemisphereLight args={['#204030', '#0a1a0a', 1.2]} />
      <directionalLight color="#a0b8c0" intensity={0.6} position={[-8, 12, -5]} />
      <spotLight
        color="#ffcc88"
        intensity={140}
        position={[0, 8, 2]}
        angle={0.4}
        penumbra={0.6}
        target-position={[0, 0, 0]}
      />
      <pointLight
        color="#ffaa44"
        intensity={3}
        position={[0, 2, 1.5]}
        distance={6}
        decay={2}
      />

      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
        <planeGeometry args={[80, 80]} />
        <meshStandardMaterial color="#0d1f0d" roughness={1} metalness={0.1} />
      </mesh>

      {/* Tree trunks */}
      <instancedMesh ref={trunkRef} args={[undefined, undefined, TREE_COUNT]}>
        <coneGeometry args={[0.15, 1.5, 6]} />
        <meshStandardMaterial color="#1a0e08" />
      </instancedMesh>

      {/* Tree canopies */}
      <instancedMesh ref={canopyRef} args={[undefined, undefined, TREE_COUNT]}>
        <coneGeometry args={[0.7, 3.5, 6]} />
        <meshStandardMaterial color="#2a6a2a" />
      </instancedMesh>

      {/* Stars */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[starPositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#ffffff"
          size={0.05}
          transparent
          opacity={0.5}
          sizeAttenuation
        />
      </points>

      {/* Glowing mushrooms — colored point lights near the ground, no geometry needed */}
      {MUSHROOM_GLOWS.map((m, i) => (
        <pointLight key={i} color={m.color} intensity={m.intensity} position={m.pos} distance={m.distance} decay={2} />
      ))}

      {/* Moon */}
      <mesh position={[-12, 9, -28]}>
        <sphereGeometry args={[1.8, 16, 16]} />
        <meshStandardMaterial color="#e8f4f8" emissive="#c8e8f0" emissiveIntensity={1.2} />
      </mesh>
      <pointLight color="#8ab8d0" intensity={6} position={[-12, 9, -25]} distance={40} decay={1.5} />

      {/* Fireflies */}
      <Fireflies />

      {/* Hada 2D-en-3D que orbita el libro */}
      <Fairy />

      {/* Lluvia de chispas mágicas */}
      <SparkleRain />
    </>
  );
}

'use client';

import { useRef, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import Fireflies from './Fireflies';

const TREE_COUNT = 40;

export default function ForestScene() {
  const trunkRef = useRef<THREE.InstancedMesh>(null);
  const canopyRef = useRef<THREE.InstancedMesh>(null);

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
    }

    trunkRef.current.instanceMatrix.needsUpdate = true;
    canopyRef.current.instanceMatrix.needsUpdate = true;
  }, []);

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
      <fogExp2 attach="fog" args={['#0a1a0a', 0.04]} />

      {/* Lighting */}
      <ambientLight color="#1a3a1a" intensity={0.4} />
      <spotLight
        color="#ffcc88"
        intensity={80}
        position={[0, 8, 2]}
        angle={0.4}
        penumbra={0.6}
        castShadow
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
        <meshStandardMaterial color="#0d2a0d" />
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

      {/* Fireflies */}
      <Fireflies />
    </>
  );
}

'use client'

import { Canvas } from '@react-three/fiber'
import { Suspense, useRef } from 'react'
import SceneRenderer from './SceneRenderer'

export default function BookExperience() {
  const flashRef = useRef<HTMLDivElement>(null)

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      <Canvas
        camera={{ position: [0, 2, 8], fov: 55 }}
        style={{ position: 'absolute', inset: 0, zIndex: 0 }}
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 2]}
        shadows
      >
        <color attach="background" args={['#13100A']} />
        <Suspense fallback={null}>
          <SceneRenderer flashRef={flashRef} />
        </Suspense>
      </Canvas>

      {/* DOM flash overlay — animated by GSAP during scene transitions */}
      <div
        ref={flashRef}
        data-flash
        style={{
          position: 'absolute', inset: 0,
          background: '#F1EDE3',
          opacity: 0, pointerEvents: 'none',
          zIndex: 10,
        }}
      />
    </div>
  )
}

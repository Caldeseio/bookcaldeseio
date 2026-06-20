'use client'
import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap'

function FloatingCode() {
  const ref = useRef<THREE.Points>(null)
  const count = 180
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i*3]   = (Math.random() - 0.5) * 14
      arr[i*3+1] = (Math.random() - 0.5) * 10
      arr[i*3+2] = (Math.random() - 0.5) * 8
    }
    return arr
  }, [])

  useFrame((_, delta) => {
    if (!ref.current) return
    const pos = ref.current.geometry.attributes.position.array as Float32Array
    for (let i = 1; i < count * 3; i += 3) {
      pos[i] += delta * 0.25
      if (pos[i] > 5) pos[i] = -5
    }
    ref.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={count} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial color="#4F9D5B" size={0.05} transparent opacity={0.55} />
    </points>
  )
}

export default function Chapter1() {
  useEffect(() => {
    const flash = document.querySelector<HTMLDivElement>('[data-flash]')
    if (flash) {
      gsap.to(flash, { opacity: 0, duration: 0.6, ease: 'power2.out', delay: 0.1 })
    }
  }, [])

  return (
    <>
      <ambientLight intensity={0.08} color="#F1EDE3" />
      <pointLight position={[0, 3, 2]} intensity={2} color="#4F9D5B" />
      <pointLight position={[-2, 1, 3]} intensity={0.6} color="#C9A84C" />
      {/* Old monitor */}
      <mesh position={[0, -0.4, 0]} castShadow>
        <boxGeometry args={[2.6, 1.9, 1.1]} />
        <meshStandardMaterial color="#111111" roughness={0.85} />
      </mesh>
      {/* Screen glow */}
      <mesh position={[0, -0.4, 0.56]}>
        <planeGeometry args={[2.3, 1.6]} />
        <meshStandardMaterial color="#081208" emissive="#1a4a1a" emissiveIntensity={1.2} />
      </mesh>
      {/* Notebooks */}
      {[-1.8, -2.2].map((x, i) => (
        <mesh key={i} position={[x, -1.55, 0.3 + i * 0.15]} rotation={[0, 0.1 * i, 0]}>
          <boxGeometry args={[0.9, 0.06, 1.1]} />
          <meshStandardMaterial color={['#1a2f1a','#2a1a0a'][i]} roughness={0.9} />
        </mesh>
      ))}
      <FloatingCode />
    </>
  )
}

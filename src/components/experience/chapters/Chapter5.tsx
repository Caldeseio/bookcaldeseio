'use client'
import { useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import gsap from 'gsap'

export default function Chapter5() {
  const { camera } = useThree()

  useEffect(() => {
    camera.position.set(10, 5, 10)
    gsap.killTweensOf(camera.position)
    const flash = document.querySelector('[data-flash]') as HTMLElement | null
    if (flash) gsap.to(flash, { opacity: 0, duration: 0.4, delay: 0.1 })
    return () => {}
  }, [camera])

  return (
    <>
      <ambientLight intensity={0.4} />
      <mesh position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 3, 8]} />
        <meshStandardMaterial color="#3D2E1A" />
      </mesh>
    </>
  )
}

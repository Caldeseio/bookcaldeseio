'use client'
import { useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import gsap from 'gsap'

export default function Chapter6() {
  const { camera } = useThree()

  useEffect(() => {
    camera.position.set(0, 3, 10)
    gsap.killTweensOf(camera.position)
    const cameraTween = gsap.to(camera.position, { z: 7, duration: 0.7, ease: 'power2.out', delay: 0.05 })
    const flash = document.querySelector('[data-flash]') as HTMLElement | null
    if (flash) gsap.to(flash, { opacity: 0, duration: 0.4, delay: 0.1 })
    return () => { cameraTween.kill() }
  }, [camera])

  return (
    <>
      <ambientLight intensity={0.4} />
      <mesh position={[0, 1.5, 0]}>
        <planeGeometry args={[2, 2.5]} />
        <meshStandardMaterial color="#F5F1E8" />
      </mesh>
    </>
  )
}

'use client'
import { useEffect } from 'react'
import gsap from 'gsap'

export default function Chapter2() {
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
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#4F9D5B" />
      </mesh>
    </>
  )
}

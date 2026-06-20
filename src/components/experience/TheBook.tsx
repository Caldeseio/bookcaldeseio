'use client'

import { useState } from 'react'
import { Float } from '@react-three/drei'
import * as THREE from 'three'
import { useLang } from '@/context/LangContext'
import { useBookCoverTexture, useBookSpineTexture } from '@/hooks/useBookTextures'

interface Props { onOpen: () => void }

export default function TheBook({ onOpen }: Props) {
  const { t } = useLang()
  const [hovered, setHovered] = useState(false)
  const coverTex = useBookCoverTexture(t('book.title'), t('book.subtitle'))
  const spineTex = useBookSpineTexture()

  // BoxGeometry face order: +X, -X, +Y, -Y, +Z (front/cover), -Z (back)
  const materials = [
    new THREE.MeshStandardMaterial({ map: spineTex, roughness: 0.5 }),
    new THREE.MeshStandardMaterial({ color: '#F1EDE3', roughness: 0.9 }),  // page edges
    new THREE.MeshStandardMaterial({ color: '#C9A84C', metalness: 0.5, roughness: 0.25 }),  // gilt top
    new THREE.MeshStandardMaterial({ color: '#C9A84C', metalness: 0.5, roughness: 0.25 }),  // gilt bottom
    new THREE.MeshStandardMaterial({ map: coverTex, roughness: 0.4 }),
    new THREE.MeshStandardMaterial({ color: '#1B2B1E', roughness: 0.7 }),
  ]

  return (
    <Float speed={1.4} rotationIntensity={0.12} floatIntensity={0.35}>
      <mesh
        position={[0, 0.4, 0]}
        castShadow
        scale={hovered ? 1.04 : 1}
        onPointerEnter={() => { setHovered(true); document.body.style.cursor = 'pointer' }}
        onPointerLeave={() => { setHovered(false); document.body.style.cursor = 'auto' }}
        onClick={onOpen}
      >
        <boxGeometry args={[2, 2.8, 0.32]} />
        {materials.map((mat, i) => (
          <primitive key={i} object={mat} attach={`material-${i}`} />
        ))}
      </mesh>
    </Float>
  )
}

'use client'
import { useMemo, useEffect } from 'react'
import * as THREE from 'three'

function makePageTexture(side: 'left' | 'right'): THREE.CanvasTexture {
  const c = document.createElement('canvas')
  c.width = 512; c.height = 640
  const ctx = c.getContext('2d')!

  // Aged cream background
  ctx.fillStyle = '#F1EDE3'
  ctx.fillRect(0, 0, 512, 640)

  // Ruled lines
  ctx.strokeStyle = 'rgba(180,165,140,0.45)'
  ctx.lineWidth = 1
  for (let y = 48; y < 640; y += 28) {
    ctx.beginPath(); ctx.moveTo(18, y); ctx.lineTo(494, y); ctx.stroke()
  }

  if (side === 'left') {
    // Red margin line
    ctx.strokeStyle = 'rgba(180,80,80,0.22)'
    ctx.lineWidth = 1.5
    ctx.beginPath(); ctx.moveTo(58, 0); ctx.lineTo(58, 640); ctx.stroke()
    // Gold drop-cap
    ctx.fillStyle = 'rgba(201,168,76,0.18)'
    ctx.font = 'bold 110px Georgia, serif'
    ctx.textAlign = 'left'
    ctx.fillText('C', 62, 160)
    // Footer label
    ctx.fillStyle = 'rgba(44,58,46,0.5)'
    ctx.font = 'italic 15px Georgia, serif'
    ctx.textAlign = 'center'
    ctx.fillText('The Book of Caldeseio', 256, 610)
  }

  if (side === 'right') {
    // Faint gold watermark
    ctx.save()
    ctx.globalAlpha = 0.06
    ctx.fillStyle = '#C9A84C'
    ctx.font = 'bold 80px Georgia, serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('✦', 256, 320)
    ctx.restore()
  }

  return new THREE.CanvasTexture(c)
}

export default function OpenBook() {
  const leftTex  = useMemo(() => makePageTexture('left'),  [])
  const rightTex = useMemo(() => makePageTexture('right'), [])

  useEffect(() => () => { leftTex.dispose(); rightTex.dispose() }, [leftTex, rightTex])

  // rotation={[-Math.PI/2, 0, 0]}: PlaneGeometry normals (originally +Z) now face +Y
  // This makes the pages face upward — book lies flat on desk
  // position y=-0.15: book sits just above the desk surface
  return (
    <group position={[0, -0.15, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      {/* Left page */}
      <mesh position={[-1.5, 0, 0]}>
        <planeGeometry args={[2.8, 3.8]} />
        <meshStandardMaterial
          map={leftTex}
          roughness={0.9}
          emissive="#F1EDE3"
          emissiveIntensity={0.06}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Right page */}
      <mesh position={[1.5, 0, 0]}>
        <planeGeometry args={[2.8, 3.8]} />
        <meshStandardMaterial
          map={rightTex}
          roughness={0.9}
          emissive="#F1EDE3"
          emissiveIntensity={0.06}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Spine */}
      <mesh position={[0, 0, 0.02]}>
        <boxGeometry args={[0.22, 3.8, 0.06]} />
        <meshStandardMaterial color="#2C3A2E" roughness={0.8} />
      </mesh>
      {/* Left page edge */}
      <mesh position={[-2.88, 0, 0]}>
        <boxGeometry args={[0.04, 3.8, 0.04]} />
        <meshStandardMaterial color="#D8D0C0" roughness={1} />
      </mesh>
      {/* Right page edge */}
      <mesh position={[2.88, 0, 0]}>
        <boxGeometry args={[0.04, 3.8, 0.04]} />
        <meshStandardMaterial color="#D8D0C0" roughness={1} />
      </mesh>
    </group>
  )
}

'use client'

import { useMemo } from 'react'
import * as THREE from 'three'

export default function Desk() {
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 512; canvas.height = 512
    const ctx = canvas.getContext('2d')!
    ctx.fillStyle = '#140E05'
    ctx.fillRect(0, 0, 512, 512)
    for (let i = 0; i < 50; i++) {
      ctx.strokeStyle = `rgba(60,35,5,${0.08 + Math.random() * 0.12})`
      ctx.lineWidth = 0.5 + Math.random() * 1.5
      ctx.beginPath()
      ctx.moveTo(0, i * 10.5 + Math.random() * 4)
      ctx.bezierCurveTo(130, i * 10.5 + Math.random() * 6, 380, i * 10.5 + Math.random() * 6, 512, i * 10.5 + Math.random() * 4)
      ctx.stroke()
    }
    const tex = new THREE.CanvasTexture(canvas)
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping
    tex.repeat.set(3, 3)
    return tex
  }, [])

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.2, 0]} receiveShadow>
      <planeGeometry args={[24, 24]} />
      <meshStandardMaterial map={texture} roughness={0.85} metalness={0.0} />
    </mesh>
  )
}

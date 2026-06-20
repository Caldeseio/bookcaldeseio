'use client'
import { useRef, useMemo, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap'

// ── Bar data ─────────────────────────────────────────────────────────────────
const BAR_DATA = [
  { label: 'Power BI', value: 0.90, color: '#C9A84C' },
  { label: 'MySQL',    value: 0.90, color: '#4F9D5B' },
  { label: 'Python',   value: 0.88, color: '#6FB877' },
  { label: 'SQL Srv',  value: 0.70, color: '#AFC3B2' },
  { label: 'R',        value: 0.66, color: '#C9A84C' },
]
const MAX_H = 3.2
const BAR_W = 0.40
const BAR_X_POSITIONS = [0.4, 1.12, 1.84, 2.56, 3.28]  // right page of book (x > 0)

// ── Single animated bar rising from the right page ───────────────────────────
function DataBar({ label, value, color, index }: { label: string; value: number; color: string; index: number }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const h = value * MAX_H

  useEffect(() => {
    if (!meshRef.current || !meshRef.current.scale) return
    meshRef.current.scale.y = 0.001
    meshRef.current.position.y = 0

    const t1 = gsap.to(meshRef.current.scale, {
      y: 1, duration: 1.0, ease: 'power3.out', delay: index * 0.16 + 0.4,
    })
    const t2 = gsap.to(meshRef.current.position, {
      y: h / 2, duration: 1.0, ease: 'power3.out', delay: index * 0.16 + 0.4,
    })
    return () => { t1.kill(); t2.kill() }
  }, [h, index])

  return (
    <mesh ref={meshRef} position={[BAR_X_POSITIONS[index], 0, 0]}>
      <boxGeometry args={[BAR_W, h, BAR_W]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.18} roughness={0.3} />
    </mesh>
  )
}

// ── Dashboard panel floating above left page ─────────────────────────────────
function DashboardPanel() {
  const texture = useMemo(() => {
    const c = document.createElement('canvas'); c.width = 512; c.height = 320
    const ctx = c.getContext('2d')!

    ctx.fillStyle = '#0D1B0F'; ctx.fillRect(0, 0, 512, 320)
    // Grid
    ctx.strokeStyle = 'rgba(79,157,91,0.18)'; ctx.lineWidth = 1
    for (let x = 0; x < 512; x += 64) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 320); ctx.stroke() }
    for (let y = 0; y < 320; y += 64) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(512, y); ctx.stroke() }
    // Header
    ctx.fillStyle = '#C9A84C'; ctx.font = 'bold 28px sans-serif'; ctx.textAlign = 'center'
    ctx.fillText('DATA ANALYTICS', 256, 38)
    ctx.fillStyle = 'rgba(201,168,76,0.4)'; ctx.fillRect(40, 50, 432, 2)
    // Metric rows
    const metrics = [
      { label: 'Power BI', val: '90%', color: '#C9A84C' },
      { label: 'MySQL',    val: '90%', color: '#4F9D5B' },
      { label: 'Python',   val: '88%', color: '#6FB877' },
      { label: 'R',        val: '66%', color: '#AFC3B2' },
    ]
    metrics.forEach((m, i) => {
      const y = 78 + i * 52
      ctx.fillStyle = m.color; ctx.font = 'bold 16px sans-serif'; ctx.textAlign = 'left'
      ctx.fillText(m.label, 50, y)
      ctx.fillStyle = m.color + '44'; ctx.fillRect(150, y - 14, 280, 20)
      ctx.fillStyle = m.color + 'CC'; ctx.fillRect(150, y - 14, parseFloat(m.val) * 2.8, 20)
      ctx.fillStyle = '#F1EDE3'; ctx.textAlign = 'right'; ctx.font = 'bold 14px monospace'
      ctx.fillText(m.val, 460, y)
    })
    return new THREE.CanvasTexture(c)
  }, [])

  useEffect(() => () => { texture.dispose() }, [texture])

  return (
    <mesh position={[-1.4, 2.0, -0.8]} rotation={[0.12, 0.08, 0]}>
      <planeGeometry args={[3.2, 2.0]} />
      <meshBasicMaterial map={texture} transparent opacity={0.92} side={THREE.DoubleSide} />
    </mesh>
  )
}

// ── SQL keyword particles drifting upward ─────────────────────────────────────
function SqlParticles() {
  const count = 60
  const ref = useRef<THREE.Points>(null)

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3]     = (Math.random() - 0.5) * 5.6   // x: -2.8..2.8 (over both pages)
      arr[i * 3 + 1] = Math.random() * 0.5            // y: 0..0.5 (starts at page level)
      arr[i * 3 + 2] = (Math.random() - 0.5) * 3.0   // z: -1.5..1.5
    }
    return arr
  }, [])

  useFrame((_, delta) => {
    if (!ref.current) return
    const pos = ref.current.geometry.attributes.position as THREE.BufferAttribute
    for (let i = 0; i < count; i++) {
      pos.array[i * 3 + 1] += delta * 0.18
      if ((pos.array[i * 3 + 1] as number) > 4) {
        pos.array[i * 3 + 1] = 0
      }
    }
    pos.needsUpdate = true
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#4F9D5B" size={0.04} transparent opacity={0.4} sizeAttenuation />
    </points>
  )
}

// ── Chapter 1 root ─────────────────────────────────────────────────────────────
export default function Chapter1() {
  const { camera } = useThree()

  useEffect(() => {
    camera.position.set(0, 4.5, 9)
    camera.rotation.set(-0.38, 0, 0)
    gsap.killTweensOf(camera.position)

    const flash = document.querySelector<HTMLDivElement>('[data-flash]')
    const cam = gsap.to(camera.position, { z: 8, duration: 0.8, ease: 'power2.out', delay: 0.1 })
    if (flash) gsap.to(flash, { opacity: 0, duration: 0.55, ease: 'power2.out', delay: 0.1 })

    return () => { cam.kill() }
  }, [camera])

  return (
    <>
      <ambientLight intensity={0.38} color="#F8E4A0" />
      <spotLight
        position={[2, 8, 4]}
        angle={0.45}
        penumbra={0.7}
        intensity={3.5}
        color="#F8D878"
        castShadow
      />
      <pointLight position={[-3, 3, 2]} intensity={1.2} color="#4F9D5B" />
      <pointLight position={[3, 4, 3]} intensity={0.6} color="#C9A84C" />

      {BAR_DATA.map((bar, i) => (
        <DataBar key={bar.label} {...bar} index={i} />
      ))}

      <DashboardPanel />
      <SqlParticles />
    </>
  )
}

'use client'
import { useRef, useMemo, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap'

const BAR_DATA = [
  { label: 'Power BI', value: 0.90, color: '#C9A84C' },
  { label: 'MySQL',    value: 0.90, color: '#4F9D5B' },
  { label: 'Python',   value: 0.88, color: '#6FB877' },
  { label: 'SQL Srv',  value: 0.70, color: '#6FB877' },
  { label: 'R',        value: 0.66, color: '#AFC3B2' },
]

const MAX_H = 5
const BAR_SPACING = 2.8
const BAR_W = 1.6

// ── Single animated bar ────────────────────────────────────────────────────
function DataBar({ label, value, color, index, total }: {
  label: string; value: number; color: string; index: number; total: number
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const h = value * MAX_H
  const x = (index - Math.floor(total / 2)) * BAR_SPACING

  useEffect(() => {
    if (!meshRef.current) return
    // Start flat on floor: scale.y=0.001 and position.y=0
    meshRef.current.scale.y = 0.001
    meshRef.current.position.y = 0
    // Animate: scale.y → 1 and position.y → h/2 (pivot at center, bar rises from floor)
    const t1 = gsap.to(meshRef.current.scale, { y: 1, duration: 1.1, delay: index * 0.18 + 0.25, ease: 'power3.out' })
    const t2 = gsap.to(meshRef.current.position, { y: h / 2, duration: 1.1, delay: index * 0.18 + 0.25, ease: 'power3.out' })
    return () => { t1.kill(); t2.kill() }
  }, [h, index])

  return (
    <mesh ref={meshRef} position={[x, 0, 0]} castShadow>
      <boxGeometry args={[BAR_W, h, BAR_W]} />
      <meshStandardMaterial color={color} roughness={0.35} metalness={0.12} emissive={color} emissiveIntensity={0.18} />
    </mesh>
  )
}

// ── Connection line between bar tops ──────────────────────────────────────
function ConnectionLines() {
  const geo = useMemo(() => {
    const pts = BAR_DATA.map((bar, i) => {
      const x = (i - Math.floor(BAR_DATA.length / 2)) * BAR_SPACING
      return new THREE.Vector3(x, bar.value * MAX_H, 0)
    })
    return new THREE.BufferGeometry().setFromPoints(pts)
  }, [])

  useEffect(() => () => { geo.dispose() }, [geo])

  return (
    <line>
      <primitive object={geo} attach="geometry" />
      <lineBasicMaterial color="#AFC3B2" opacity={0.45} transparent />
    </line>
  )
}

// ── Dashboard plane (background) ──────────────────────────────────────────
function DashboardPlane() {
  const texture = useMemo(() => {
    const c = document.createElement('canvas'); c.width = 1024; c.height = 512
    const ctx = c.getContext('2d')!
    ctx.fillStyle = '#0D1B0F'; ctx.fillRect(0, 0, 1024, 512)
    // Grid
    ctx.strokeStyle = 'rgba(79,157,91,0.18)'; ctx.lineWidth = 1
    for (let x = 0; x < 1024; x += 64) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 512); ctx.stroke() }
    for (let y = 0; y < 512; y += 64) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(1024, y); ctx.stroke() }
    // Header
    ctx.fillStyle = '#C9A84C'; ctx.font = 'bold 38px sans-serif'; ctx.textAlign = 'center'
    ctx.fillText('DATA ANALYTICS', 512, 58)
    ctx.fillStyle = 'rgba(201,168,76,0.4)'; ctx.fillRect(80, 72, 864, 2)
    // Metric rows
    const metrics = [
      { label: 'Power BI', val: '90%', color: '#C9A84C' },
      { label: 'MySQL',    val: '90%', color: '#4F9D5B' },
      { label: 'Python',   val: '88%', color: '#6FB877' },
      { label: 'R',        val: '66%', color: '#AFC3B2' },
    ]
    metrics.forEach((m, i) => {
      const y = 122 + i * 56
      ctx.fillStyle = m.color; ctx.font = 'bold 20px sans-serif'; ctx.textAlign = 'left'
      ctx.fillText(m.label, 100, y)
      // Bar
      ctx.fillStyle = m.color + '55'; ctx.fillRect(260, y - 18, 560, 24)
      ctx.fillStyle = m.color + 'CC'; ctx.fillRect(260, y - 18, parseFloat(m.val) * 5.6, 24)
      ctx.fillStyle = '#F1EDE3'; ctx.textAlign = 'right'; ctx.font = 'bold 18px monospace'
      ctx.fillText(m.val, 900, y)
    })
    return new THREE.CanvasTexture(c)
  }, [])

  useEffect(() => () => { texture.dispose() }, [texture])

  return (
    <mesh position={[0, 2.5, -6]}>
      <planeGeometry args={[14, 7]} />
      <meshBasicMaterial map={texture} transparent opacity={0.88} side={THREE.DoubleSide} />
    </mesh>
  )
}

// ── Directional data particles (horizontal streams) ───────────────────────
function DataParticles() {
  const count = 120
  const meshRef = useRef<THREE.InstancedMesh>(null)

  const { positions, speeds } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const speeds = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 18  // x
      positions[i * 3 + 1] = (Math.random() - 0.5) * 5   // y
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6   // z
      speeds[i] = 0.02 + Math.random() * 0.04
    }
    return { positions, speeds }
  }, [])

  const dummy = useMemo(() => new THREE.Object3D(), [])

  useFrame(() => {
    if (!meshRef.current) return
    for (let i = 0; i < count; i++) {
      positions[i * 3] += speeds[i]
      if (positions[i * 3] > 9) positions[i * 3] = -9
      dummy.position.set(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2])
      dummy.scale.set(0.06, 0.06, 0.06)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 4, 4]} />
      <meshBasicMaterial color="#4F9D5B" transparent opacity={0.6} />
    </instancedMesh>
  )
}

// ── Chapter 3 scene ────────────────────────────────────────────────────────
export default function Chapter3() {
  const { camera } = useThree()

  useEffect(() => {
    camera.position.set(0, 4, 18)
    camera.rotation.set(-0.22, 0, 0)
    const flash = document.querySelector<HTMLDivElement>('[data-flash]')
    const cameraTween = gsap.to(camera.position, { z: 13, duration: 0.7, ease: 'power2.out', delay: 0.05 })
    if (flash) gsap.to(flash, { opacity: 0, duration: 0.4, ease: 'power2.out', delay: 0.05 })
    return () => { cameraTween.kill() }
  }, [camera])

  // Slow camera pull-back during the scene for cinematic feel (clamped at z=17)
  useFrame((_, delta) => {
    if (camera.position.z < 17) {
      camera.position.z = Math.min(camera.position.z + delta * 0.08, 17)
    }
  })

  return (
    <>
      <ambientLight intensity={0.08} color="#F1EDE3" />
      <spotLight position={[0, 10, 6]} angle={0.5} intensity={3} color="#4F9D5B" castShadow />
      <pointLight position={[-6, 3, 2]} intensity={0.8} color="#C9A84C" />
      <pointLight position={[6, 3, 2]} intensity={0.8} color="#C9A84C" />

      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
        <planeGeometry args={[30, 20]} />
        <meshStandardMaterial color="#0D1B0F" roughness={0.9} />
      </mesh>

      {BAR_DATA.map((bar, i) => (
        <DataBar key={bar.label} {...bar} index={i} total={BAR_DATA.length} />
      ))}

      <ConnectionLines />
      <DashboardPlane />
      <DataParticles />
    </>
  )
}

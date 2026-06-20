'use client'
import { useRef, useMemo, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap'
import { useNote } from '@/context/NoteContext'

// ── Gold upward-drifting particles ────────────────────────────────────────────
function GoldParticles() {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const count = 80

  const { positions, speeds } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const speeds = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 14
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8
      speeds[i] = 0.25 + Math.random() * 0.6
    }
    return { positions, speeds }
  }, [])

  useEffect(() => {
    if (!meshRef.current) return
    const mat = new THREE.Matrix4()
    for (let i = 0; i < count; i++) {
      mat.compose(
        new THREE.Vector3(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]),
        new THREE.Quaternion(),
        new THREE.Vector3(0.06, 0.06, 0.06)
      )
      meshRef.current.setMatrixAt(i, mat)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  }, [positions])

  useFrame((_, delta) => {
    if (!meshRef.current) return
    const mat = new THREE.Matrix4()
    const pos = new THREE.Vector3()
    const rot = new THREE.Quaternion()
    const scale = new THREE.Vector3()
    for (let i = 0; i < count; i++) {
      meshRef.current.getMatrixAt(i, mat)
      mat.decompose(pos, rot, scale)
      pos.y += speeds[i] * delta * 0.55
      if (pos.y > 7) pos.y = -3
      mat.compose(pos, rot, scale)
      meshRef.current.setMatrixAt(i, mat)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshStandardMaterial color="#C9A84C" emissive="#C9A84C" emissiveIntensity={0.85} roughness={0.25} />
    </instancedMesh>
  )
}

// ── Single orbiting note particle ─────────────────────────────────────────────
function NoteParticle({ index, total }: { index: number; total: number }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const offset = (index / Math.max(total, 1)) * Math.PI * 2

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.elapsedTime * 0.5 + offset
    const r = 2.4
    meshRef.current.position.x = Math.sin(t) * r
    meshRef.current.position.y = 2 + Math.sin(t * 0.55) * 0.45
    meshRef.current.position.z = Math.cos(t) * r
  })

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.12, 8, 8]} />
      <meshStandardMaterial color="#C9A84C" emissive="#C9A84C" emissiveIntensity={1.0} roughness={0.18} />
    </mesh>
  )
}

// ── Open book on pedestal ─────────────────────────────────────────────────────
function OpenBook() {
  const leftTex = useMemo(() => {
    const c = document.createElement('canvas')
    c.width = 512
    c.height = 640
    const ctx = c.getContext('2d')!
    ctx.fillStyle = '#F5F1E8'
    ctx.fillRect(0, 0, 512, 640)
    ctx.strokeStyle = '#D0CBB8'
    ctx.lineWidth = 1
    for (let y = 40; y < 640; y += 30) {
      ctx.beginPath()
      ctx.moveTo(18, y)
      ctx.lineTo(494, y)
      ctx.stroke()
    }
    return new THREE.CanvasTexture(c)
  }, [])

  const rightTex = useMemo(() => {
    const c = document.createElement('canvas')
    c.width = 512
    c.height = 640
    const ctx = c.getContext('2d')!
    ctx.fillStyle = '#F5F1E8'
    ctx.fillRect(0, 0, 512, 640)
    ctx.strokeStyle = '#D0CBB8'
    ctx.lineWidth = 1
    for (let y = 40; y < 640; y += 30) {
      ctx.beginPath()
      ctx.moveTo(18, y)
      ctx.lineTo(494, y)
      ctx.stroke()
    }
    ctx.font = 'italic 26px Georgia, serif'
    ctx.fillStyle = '#2C3A2E'
    ctx.textAlign = 'center'
    ctx.fillText('La historia continúa.', 256, 75)
    ctx.font = '18px Georgia, serif'
    ctx.fillStyle = '#4F9D5B'
    ctx.fillText('Every story needs a next chapter.', 256, 115)
    return new THREE.CanvasTexture(c)
  }, [])

  useEffect(() => () => { leftTex.dispose(); rightTex.dispose() }, [leftTex, rightTex])

  const deg15 = THREE.MathUtils.degToRad(15)

  return (
    <group position={[0, 1.5, 0]}>
      {/* Left page */}
      <mesh rotation={[0, 0, -deg15]} position={[-1.05, 0, 0]}>
        <planeGeometry args={[2, 2.5]} />
        <meshStandardMaterial map={leftTex} side={THREE.DoubleSide} roughness={0.88} />
      </mesh>
      {/* Right page */}
      <mesh rotation={[0, 0, deg15]} position={[1.05, 0, 0]}>
        <planeGeometry args={[2, 2.5]} />
        <meshStandardMaterial map={rightTex} side={THREE.DoubleSide} roughness={0.88} />
      </mesh>
      {/* Spine */}
      <mesh>
        <boxGeometry args={[0.15, 2.5, 0.05]} />
        <meshStandardMaterial color="#2C3A2E" roughness={0.8} />
      </mesh>
    </group>
  )
}

// ── Chapter 6 root ─────────────────────────────────────────────────────────────
export default function Chapter6() {
  const { camera } = useThree()
  const { noteCount } = useNote()

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
      <ambientLight intensity={0.12} color="#1B2B1E" />
      <spotLight
        position={[0, 10, 0]}
        angle={0.32}
        penumbra={0.85}
        intensity={3.5}
        color="#F8E4A0"
        castShadow={false}
      />
      <pointLight position={[0, 3, 5]} intensity={0.7} color="#C9A84C" distance={14} decay={2} />
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color="#0D1A0F" roughness={1} />
      </mesh>
      {/* Pedestal */}
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.4, 0.6, 0.8, 12]} />
        <meshStandardMaterial color="#2C3A2E" roughness={0.72} metalness={0.28} />
      </mesh>
      {/* Open book */}
      <OpenBook />
      {/* Gold upward particles */}
      <GoldParticles />
      {/* Note orbit particles */}
      {Array.from({ length: noteCount }).map((_, i) => (
        <NoteParticle key={i} index={i} total={noteCount} />
      ))}
    </>
  )
}

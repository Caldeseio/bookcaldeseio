'use client'
import { useRef, useMemo, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap'

const HUB_POS = new THREE.Vector3(0, 2.5, 0)
const ORBIT_R = 2.4
const NODE_ANGLES = [0, Math.PI * 0.4, Math.PI * 0.8, Math.PI * 1.2, Math.PI * 1.6]
const COMPANY_LABELS = ['Empresa A', 'Empresa B', 'Empresa C', 'Empresa D', 'Empresa E']

function nodePos(angle: number, idx: number): THREE.Vector3 {
  return new THREE.Vector3(
    Math.cos(angle) * ORBIT_R,
    2.0 + idx * 0.2,
    Math.sin(angle) * ORBIT_R * 0.5,  // flatten z for better readability
  )
}

// ── Central platform hub ──────────────────────────────────────────────────────
function HubSphere() {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!meshRef.current) return
    const mat = meshRef.current.material as THREE.MeshStandardMaterial
    mat.emissiveIntensity = 0.4 + Math.sin(state.clock.elapsedTime * 1.8) * 0.25
  })

  return (
    <mesh ref={meshRef} position={HUB_POS.toArray()}>
      <sphereGeometry args={[0.45, 20, 20]} />
      <meshStandardMaterial
        color="#C9A84C"
        emissive="#C9A84C"
        emissiveIntensity={0.4}
        roughness={0.25}
        metalness={0.3}
      />
    </mesh>
  )
}

// ── Company nodes + spokes ────────────────────────────────────────────────────
function CompanyNetwork() {
  const spokeGeo = useMemo(() => {
    const pts: number[] = []
    NODE_ANGLES.forEach((angle, i) => {
      const np = nodePos(angle, i)
      pts.push(HUB_POS.x, HUB_POS.y, HUB_POS.z, np.x, np.y, np.z)
    })
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3))
    return g
  }, [])

  useEffect(() => () => { spokeGeo.dispose() }, [spokeGeo])

  return (
    <>
      <lineSegments geometry={spokeGeo}>
        <lineBasicMaterial color="#AFC3B2" transparent opacity={0.4} />
      </lineSegments>
      {NODE_ANGLES.map((angle, i) => {
        const np = nodePos(angle, i)
        return (
          <mesh key={i} position={np.toArray()}>
            <sphereGeometry args={[0.20, 10, 10]} />
            <meshStandardMaterial
              color="#4F9D5B"
              emissive="#4F9D5B"
              emissiveIntensity={0.22}
              roughness={0.4}
            />
          </mesh>
        )
      })}
    </>
  )
}

// ── Data flow particles along spokes ──────────────────────────────────────────
function FlowParticles() {
  const count = 40
  const meshRef = useRef<THREE.InstancedMesh>(null)

  // t[i] is the particle's progress (0→1) along its spoke
  const { nodePositions, t } = useMemo(() => {
    const nodePositions = NODE_ANGLES.map((angle, i) => nodePos(angle, i))
    const t = new Float32Array(count).map((_, i) => i / (count / NODE_ANGLES.length) % 1)
    return { nodePositions, t }
  }, [])

  const dummy = useMemo(() => new THREE.Object3D(), [])

  useFrame((_, delta) => {
    if (!meshRef.current) return
    for (let i = 0; i < count; i++) {
      t[i] += delta * 0.45
      if (t[i] > 1) t[i] = 0
      const spokeIdx = Math.floor(i / (count / NODE_ANGLES.length)) % NODE_ANGLES.length
      const target = nodePositions[spokeIdx]
      dummy.position.lerpVectors(HUB_POS, target, t[i])
      dummy.scale.setScalar(0.05)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 4, 4]} />
      <meshBasicMaterial color="#C9A84C" transparent opacity={0.7} />
    </instancedMesh>
  )
}

// ── Attendance widget card ────────────────────────────────────────────────────
function AttendanceCard() {
  const texture = useMemo(() => {
    const c = document.createElement('canvas'); c.width = 512; c.height = 300
    const ctx = c.getContext('2d')!
    ctx.fillStyle = '#1B2B1E'; ctx.fillRect(0, 0, 512, 300)
    ctx.strokeStyle = '#C9A84C'; ctx.lineWidth = 3; ctx.strokeRect(4, 4, 504, 292)
    // Header
    ctx.fillStyle = '#C9A84C'; ctx.font = 'bold 22px sans-serif'; ctx.textAlign = 'center'
    ctx.fillText('SISTEMA DE PLANILLA', 256, 44)
    // Separator
    ctx.fillStyle = 'rgba(201,168,76,0.35)'; ctx.fillRect(20, 58, 472, 2)
    // Clock
    ctx.fillStyle = '#F1EDE3'; ctx.font = 'bold 36px monospace'; ctx.textAlign = 'center'
    ctx.fillText('09:00 AM', 256, 130)
    // Employee count
    ctx.fillStyle = '#4F9D5B'; ctx.font = 'bold 16px sans-serif'
    ctx.fillText('247 empleados activos', 256, 176)
    // Tags
    ctx.fillStyle = 'rgba(175,195,178,0.7)'; ctx.font = '11px sans-serif'
    ctx.fillText('Multi-tenant  ·  Biometría  ·  RRHH', 256, 240)
    return new THREE.CanvasTexture(c)
  }, [])

  useEffect(() => () => { texture.dispose() }, [texture])

  return (
    <mesh position={[2.0, 1.8, -0.8]} rotation={[0, -0.2, 0]}>
      <planeGeometry args={[2.4, 1.4]} />
      <meshBasicMaterial map={texture} transparent opacity={0.93} side={THREE.DoubleSide} />
    </mesh>
  )
}

// ── Floating label Sprite ─────────────────────────────────────────────────────
function FloatingLabel() {
  const texture = useMemo(() => {
    const c = document.createElement('canvas'); c.width = 320; c.height = 72
    const ctx = c.getContext('2d')!
    ctx.fillStyle = 'rgba(13,26,15,0.82)'; ctx.fillRect(0, 0, 320, 72)
    ctx.fillStyle = '#F1EDE3'; ctx.font = 'bold 22px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
    ctx.fillText('Multi-tenant SaaS', 160, 36)
    return new THREE.CanvasTexture(c)
  }, [])

  useEffect(() => () => { texture.dispose() }, [texture])

  return (
    <sprite position={[0, 4.2, 0]} scale={[2.8, 0.63, 1]}>
      <spriteMaterial map={texture} transparent depthWrite={false} />
    </sprite>
  )
}

// ── Chapter 3 root ─────────────────────────────────────────────────────────────
export default function Chapter3() {
  const { camera } = useThree()

  useEffect(() => {
    camera.position.set(-2, 5, 9)
    camera.rotation.set(-0.4, -0.15, 0)
    gsap.killTweensOf(camera.position)

    const flash = document.querySelector<HTMLDivElement>('[data-flash]')
    const cam = gsap.to(camera.position, { x: 0, y: 4.5, z: 8, duration: 0.9, ease: 'power2.out', delay: 0.1 })
    if (flash) gsap.to(flash, { opacity: 0, duration: 0.55, ease: 'power2.out', delay: 0.1 })

    return () => { cam.kill() }
  }, [camera])

  return (
    <>
      <ambientLight intensity={0.35} color="#1B2B1E" />
      <spotLight
        position={[0, 10, 0]}
        angle={0.4}
        penumbra={0.8}
        intensity={3.0}
        color="#4F9D5B"
      />
      <pointLight position={[-4, 4, 2]} intensity={0.8} color="#C9A84C" />
      <pointLight position={[4, 3, 2]} intensity={0.6} color="#7A86B8" />

      <HubSphere />
      <CompanyNetwork />
      <FlowParticles />
      <AttendanceCard />
      <FloatingLabel />
    </>
  )
}

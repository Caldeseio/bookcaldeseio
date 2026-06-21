'use client'
import { useRef, useMemo, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap'
import { useProject } from '@/context/ProjectContext'
import { PROJECTS } from '@/data/projects'

const TECH_NODES = [
  { label: 'PHP',        color: '#7A86B8', pos: [-0.9, 1.0, 0.2] as [number, number, number] },
  { label: 'Laravel',    color: '#FF4433', pos: [ 0.8, 0.6, 0.1] as [number, number, number] },
  { label: 'JavaScript', color: '#F7DF1E', pos: [ 1.6, 1.8,-0.1] as [number, number, number] },
  { label: 'React',      color: '#61DAFB', pos: [-0.2, 2.4, 0.3] as [number, number, number] },
  { label: 'SQL',        color: '#CC2927', pos: [-1.7, 1.8, 0.2] as [number, number, number] },
  { label: 'Node.js',    color: '#68A063', pos: [ 0.3, 3.2,-0.2] as [number, number, number] },
]

// Connection pairs as index pairs
const CONNECTIONS = [
  [0, 1], [0, 4], [1, 2], [2, 3], [3, 5], [4, 3], [5, 2],
] as [number, number][]

// ── Single tech orb ───────────────────────────────────────────────────────────
function TechOrb({ node, index }: { node: typeof TECH_NODES[0]; index: number }) {
  const meshRef = useRef<THREE.Mesh>(null)

  const labelTex = useMemo(() => {
    const c = document.createElement('canvas'); c.width = 192; c.height = 64
    const ctx = c.getContext('2d')!
    ctx.fillStyle = 'rgba(27,43,30,0.88)'; ctx.fillRect(0, 0, 192, 64)
    ctx.strokeStyle = node.color; ctx.lineWidth = 2
    ctx.strokeRect(2, 2, 188, 60)
    ctx.fillStyle = node.color; ctx.font = 'bold 20px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
    ctx.fillText(node.label, 96, 32)
    return new THREE.CanvasTexture(c)
  }, [node.color, node.label])

  useEffect(() => () => { labelTex.dispose() }, [labelTex])

  useFrame((state) => {
    if (!meshRef.current) return
    const mat = meshRef.current.material as THREE.MeshStandardMaterial
    const base = 0.45
    mat.emissiveIntensity = base + Math.sin(state.clock.elapsedTime * 2.2 + index * 1.1) * 0.2
  })

  return (
    <group position={node.pos}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.25, 12, 12]} />
        <meshStandardMaterial
          color={node.color}
          emissive={node.color}
          emissiveIntensity={0.45}
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>
      {/* Label sprite above orb */}
      <sprite position={[0, 0.5, 0]} scale={[1.4, 0.47, 1]}>
        <spriteMaterial map={labelTex} transparent depthWrite={false} />
      </sprite>
    </group>
  )
}

// ── Connection lines between orbs ─────────────────────────────────────────────
function ConnectionLines() {
  const geo = useMemo(() => {
    const points: number[] = []
    CONNECTIONS.forEach(([a, b]) => {
      const pa = TECH_NODES[a].pos
      const pb = TECH_NODES[b].pos
      points.push(...pa, ...pb)
    })
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.Float32BufferAttribute(points, 3))
    return g
  }, [])

  useEffect(() => () => { geo.dispose() }, [geo])

  return (
    <lineSegments geometry={geo}>
      <lineBasicMaterial color="#AFC3B2" transparent opacity={0.35} />
    </lineSegments>
  )
}

// ── Code rain particles drifting down from above ──────────────────────────────
function CodeRain() {
  const count = 120
  const ref = useRef<THREE.Points>(null)

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3]     = (Math.random() - 0.5) * 5.0   // x: ±2.5
      arr[i * 3 + 1] = 4.5 + Math.random() * 1.5     // y: 4.5–6
      arr[i * 3 + 2] = (Math.random() - 0.5) * 2.0   // z: ±1
    }
    return arr
  }, [])

  useFrame((_, delta) => {
    if (!ref.current) return
    const pos = ref.current.geometry.attributes.position as THREE.BufferAttribute
    for (let i = 0; i < count; i++) {
      pos.array[i * 3 + 1] -= delta * 0.9
      if ((pos.array[i * 3 + 1] as number) < -0.5) {
        pos.array[i * 3 + 1] = 5 + Math.random() * 1.5
      }
    }
    pos.needsUpdate = true
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#4F9D5B" size={0.035} transparent opacity={0.28} sizeAttenuation />
    </points>
  )
}

// ── Featured project card ─────────────────────────────────────────────────────
function ProjectCard() {
  const { selectProject } = useProject()
  const project = PROJECTS[0]

  const texture = useMemo(() => {
    const c = document.createElement('canvas'); c.width = 512; c.height = 308
    const ctx = c.getContext('2d')!
    ctx.fillStyle = '#1B2B1E'; ctx.fillRect(0, 0, 512, 308)
    ctx.strokeStyle = '#C9A84C'; ctx.lineWidth = 3; ctx.strokeRect(4, 4, 504, 300)
    ctx.fillStyle = '#C9A84C'; ctx.font = 'bold 20px sans-serif'; ctx.textAlign = 'left'
    ctx.fillText('Sistema de Planilla', 20, 38)
    ctx.fillStyle = '#AFC3B2'; ctx.font = '14px monospace'; ctx.textAlign = 'left'
    ctx.fillText('PHP · Laravel · MariaDB · REST API', 20, 68)
    ctx.fillStyle = 'rgba(201,168,76,0.55)'; ctx.font = '12px monospace'
    ctx.fillText('→ Ver proyecto', 20, 280)
    return new THREE.CanvasTexture(c)
  }, [])

  useEffect(() => () => { texture.dispose() }, [texture])

  return (
    <mesh
      position={[-1.8, 2.2, -1.2]}
      rotation={[0, 0.18, 0]}
      onClick={() => selectProject(project)}
      onPointerOver={() => { document.body.style.cursor = 'pointer' }}
      onPointerOut={() => { document.body.style.cursor = 'auto' }}
    >
      <planeGeometry args={[3.0, 1.8]} />
      <meshBasicMaterial map={texture} transparent side={THREE.DoubleSide} />
    </mesh>
  )
}

// ── Chapter 2 root ─────────────────────────────────────────────────────────────
export default function Chapter2() {
  const { camera } = useThree()
  const { selectProject } = useProject()

  useEffect(() => {
    camera.position.set(2, 5, 9)
    camera.rotation.set(-0.4, 0.1, 0)
    gsap.killTweensOf(camera.position)

    const flash = document.querySelector<HTMLDivElement>('[data-flash]')
    const cam = gsap.to(camera.position, { x: 0, y: 4.5, z: 8, duration: 0.9, ease: 'power2.out', delay: 0.1 })
    if (flash) gsap.to(flash, { opacity: 0, duration: 0.55, ease: 'power2.out', delay: 0.1 })

    return () => {
      cam.kill()
      selectProject(null)
      document.body.style.cursor = 'auto'
    }
  }, [camera, selectProject])

  return (
    <>
      <ambientLight intensity={0.32} color="#1B2B1E" />
      <pointLight position={[0, 8, 3]} intensity={2.2} color="#C9A84C" />
      <pointLight position={[4, 2, 2]} intensity={1.0} color="#7A86B8" />
      <pointLight position={[-4, 3, 2]} intensity={0.6} color="#4F9D5B" />

      {TECH_NODES.map((node, i) => (
        <TechOrb key={node.label} node={node} index={i} />
      ))}
      <ConnectionLines />
      <CodeRain />
      <ProjectCard />
    </>
  )
}

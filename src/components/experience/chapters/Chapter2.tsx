'use client'
import { useRef, useMemo, useState, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap'
import { useLang } from '@/context/LangContext'
import { useProject } from '@/context/ProjectContext'
import { PROJECTS } from '@/data/projects'
import type { Project } from '@/types'

const TECH_ITEMS = [
  { label: 'PHP',        color: '#7A86B8' },
  { label: 'Laravel',    color: '#FF4433' },
  { label: 'JavaScript', color: '#F7DF1E' },
  { label: 'SQL Server', color: '#CC2927' },
  { label: 'React',      color: '#61DAFB' },
  { label: 'Node.js',    color: '#68A063' },
]

const CARD_POSITIONS: [number, number, number][] = [
  [-3.6, 0.6, 2],
  [0,   -0.6, 3],
  [3.6,  0.6, 2],
]

// ── Tech sprite (faces camera automatically via THREE.Sprite) ──────────────
function TechSprite({ label, color, index, total }: { label: string; color: string; index: number; total: number }) {
  const ref = useRef<THREE.Sprite>(null)

  const texture = useMemo(() => {
    const c = document.createElement('canvas'); c.width = 256; c.height = 96
    const ctx = c.getContext('2d')!
    ctx.fillStyle = 'rgba(27,43,30,0.92)'; ctx.fillRect(0, 0, 256, 96)
    ctx.strokeStyle = color; ctx.lineWidth = 3; ctx.strokeRect(4, 4, 248, 88)
    ctx.fillStyle = color; ctx.font = 'bold 30px sans-serif'
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
    ctx.fillText(label, 128, 48)
    return new THREE.CanvasTexture(c)
  }, [label, color])

  useEffect(() => () => { texture.dispose() }, [texture])

  useFrame(() => {
    if (!ref.current) return
    const angle = Date.now() * 0.00028 + (index / total) * Math.PI * 2
    ref.current.position.set(
      Math.cos(angle) * 5.5,
      Math.sin(angle * 0.4) * 2.2,
      Math.sin(angle) * 2.8 - 1
    )
  })

  return (
    <sprite ref={ref} scale={[2.1, 0.79, 1]}>
      <spriteMaterial map={texture} transparent opacity={0.9} depthWrite={false} />
    </sprite>
  )
}

// ── Clickable project card plane ───────────────────────────────────────────
function ProjectPlane({
  project, position
}: {
  project: Project
  position: [number, number, number]
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)
  const { t } = useLang()
  const { selectProject } = useProject()

  const texture = useMemo(() => {
    const c = document.createElement('canvas'); c.width = 512; c.height = 308
    const ctx = c.getContext('2d')!
    ctx.fillStyle = '#1B2B1E'; ctx.fillRect(0, 0, 512, 308)
    ctx.strokeStyle = '#C9A84C'; ctx.lineWidth = 3; ctx.strokeRect(6, 6, 500, 296)
    // Title
    ctx.fillStyle = '#C9A84C'
    ctx.font = 'bold 24px sans-serif'; ctx.textAlign = 'center'
    ctx.fillText(t(project.titleKey), 256, 72)
    // Tech
    ctx.fillStyle = '#AFC3B2'; ctx.font = '16px monospace'
    ctx.fillText(project.tech.slice(0, 4).join('  ·  '), 256, 130)
    // CTA
    ctx.fillStyle = 'rgba(201,168,76,0.65)'; ctx.font = '13px monospace'
    ctx.fillText('▶  click to open', 256, 220)
    return new THREE.CanvasTexture(c)
  }, [project, t])

  useEffect(() => () => { texture.dispose() }, [texture])

  // Reset cursor if this plane unmounts while hovered
  useEffect(() => {
    return () => { document.body.style.cursor = 'auto' }
  }, [])

  // Z-lerp toward camera on hover
  useFrame(() => {
    if (!meshRef.current) return
    const targetZ = hovered ? position[2] + 2 : position[2]
    meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, targetZ, 0.08)
  })

  return (
    <mesh
      ref={meshRef}
      position={position}
      onPointerOver={() => { setHovered(true); document.body.style.cursor = 'pointer' }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto' }}
      onClick={() => selectProject(project)}
    >
      <planeGeometry args={[3.4, 2.05]} />
      <meshBasicMaterial map={texture} transparent side={THREE.DoubleSide} />
    </mesh>
  )
}

// ── Chapter 2 scene ────────────────────────────────────────────────────────
export default function Chapter2() {
  const { camera } = useThree()
  const { selectProject } = useProject()

  useEffect(() => {
    // Position camera behind start, then push in as flash fades
    camera.position.set(0, 0, 14)
    camera.rotation.set(0, 0, 0)
    const flash = document.querySelector<HTMLDivElement>('[data-flash]')
    const cameraTween = gsap.to(camera.position, { z: 10, duration: 0.6, ease: 'power2.out', delay: 0.05 })
    if (flash) gsap.to(flash, { opacity: 0, duration: 0.4, ease: 'power2.out', delay: 0.05 })
    return () => { cameraTween.kill() }
  }, [camera])

  // Clear selected project and reset cursor when Chapter2 unmounts
  useEffect(() => {
    return () => {
      selectProject(null)
      document.body.style.cursor = 'auto'
    }
  }, [selectProject])

  return (
    <>
      <ambientLight intensity={0.12} color="#F1EDE3" />
      <pointLight position={[0, 5, 7]} intensity={1.4} color="#C9A84C" />
      <pointLight position={[-5, 2, 4]} intensity={0.7} color="#4F9D5B" />
      <pointLight position={[5, 2, 4]} intensity={0.5} color="#6FB877" />

      {TECH_ITEMS.map((item, i) => (
        <TechSprite key={item.label} {...item} index={i} total={TECH_ITEMS.length} />
      ))}

      {PROJECTS.slice(0, 3).map((project, i) => (
        <ProjectPlane key={project.id} project={project} position={CARD_POSITIONS[i]} />
      ))}
    </>
  )
}

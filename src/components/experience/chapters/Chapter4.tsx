'use client'
import { useRef, useMemo, useEffect, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap'
import { useProject } from '@/context/ProjectContext'
import { PROJECTS } from '@/data/projects'
import type { Project } from '@/types'

const SPINE_COLORS = ['#C9A84C', '#4F9D5B', '#6FB877', '#AFC3B2', '#C9A84C', '#4F9D5B']
const BOOK_X_POSITIONS = [-5, -3, -1, 1, 3, 5]

// ── InstancedMesh background library shelves ──────────────────────────────────
function LibraryBackground() {
  const meshRef = useRef<THREE.InstancedMesh>(null)

  const { positions, scales } = useMemo(() => {
    const positions: [number, number, number][] = []
    const scales: [number, number, number][] = []
    for (let row = 0; row < 4; row++) {
      const y = -0.6 + row * 1.9
      for (let col = 0; col < 11; col++) {
        const x = (col - 5) * 2.2
        for (let d = 0; d < 5; d++) {
          positions.push([x + (Math.random() - 0.5) * 0.25, y, -4 - d * 3.8])
          scales.push([0.28 + Math.random() * 0.18, 1.4 + Math.random() * 0.9, 0.12])
        }
      }
    }
    return { positions, scales }
  }, [])

  useEffect(() => {
    if (!meshRef.current) return
    const mat = new THREE.Matrix4()
    positions.forEach((pos, i) => {
      mat.compose(
        new THREE.Vector3(pos[0], pos[1], pos[2]),
        new THREE.Quaternion(),
        new THREE.Vector3(scales[i][0], scales[i][1], scales[i][2])
      )
      meshRef.current!.setMatrixAt(i, mat)
    })
    meshRef.current.instanceMatrix.needsUpdate = true
  }, [positions, scales])

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, positions.length]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#2A382C" roughness={0.88} />
    </instancedMesh>
  )
}

// ── Single interactive feature book ──────────────────────────────────────────
function FeatureBook({ project, index, spineColor }: { project: Project; index: number; spineColor: string }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const { selectProject } = useProject()
  const hoveredRef = useRef(false)
  const [hovered, setHovered] = useState(false)

  const texture = useMemo(() => {
    const c = document.createElement('canvas'); c.width = 128; c.height = 512
    const ctx = c.getContext('2d')!
    ctx.fillStyle = '#1B2B1E'; ctx.fillRect(0, 0, 128, 512)
    ctx.fillStyle = spineColor; ctx.fillRect(0, 0, 128, 88)
    ctx.fillStyle = '#1B2B1E'; ctx.font = 'bold 42px monospace'
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
    ctx.fillText(String(project.id).padStart(2, '0'), 64, 44)
    ctx.strokeStyle = spineColor; ctx.lineWidth = 2
    ctx.beginPath(); ctx.moveTo(12, 96); ctx.lineTo(116, 96); ctx.stroke()
    return new THREE.CanvasTexture(c)
  }, [project.id, spineColor])

  useEffect(() => () => { texture.dispose() }, [texture])

  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto'
    return () => { document.body.style.cursor = 'auto' }
  }, [hovered])

  useFrame((_, delta) => {
    if (!meshRef.current) return
    const baseZ = 1.5 - (Math.abs(BOOK_X_POSITIONS[index]) / 10) * 0.3
    const targetZ = hoveredRef.current ? baseZ + 1.0 : baseZ
    meshRef.current.position.z += (targetZ - meshRef.current.position.z) * Math.min(delta * 5, 1)
  })

  return (
    <mesh
      ref={meshRef}
      position={[BOOK_X_POSITIONS[index], 1.25, 1.5]}
      onPointerOver={() => { hoveredRef.current = true; setHovered(true) }}
      onPointerOut={() => { hoveredRef.current = false; setHovered(false) }}
      onClick={() => selectProject(project)}
    >
      <boxGeometry args={[0.7, 2.5, 0.14]} />
      <meshStandardMaterial
        map={texture}
        roughness={0.65}
        emissive={spineColor}
        emissiveIntensity={hovered ? 0.38 : 0.08}
      />
    </mesh>
  )
}

// ── Chapter 4 root ─────────────────────────────────────────────────────────────
export default function Chapter4() {
  const { camera } = useThree()
  const { selectProject } = useProject()

  useEffect(() => {
    camera.position.set(0, 1, 10)
    gsap.killTweensOf(camera.position)
    const cameraTween = gsap.to(camera.position, { z: 7, duration: 0.7, ease: 'power2.out', delay: 0.05 })
    const flash = document.querySelector('[data-flash]') as HTMLElement | null
    if (flash) gsap.to(flash, { opacity: 0, duration: 0.4, delay: 0.1 })
    return () => { cameraTween.kill(); selectProject(null) }
  }, [camera, selectProject])

  return (
    <>
      <ambientLight intensity={0.18} color="#1B2B1E" />
      <pointLight position={[0, 9, 0]} intensity={1.8} color="#C9A84C" distance={22} decay={2} />
      <pointLight position={[-9, 4, 2]} intensity={0.7} color="#4F9D5B" distance={16} decay={2} />
      <pointLight position={[9, 4, 2]} intensity={0.7} color="#4F9D5B" distance={16} decay={2} />
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -8]}>
        <planeGeometry args={[50, 40]} />
        <meshStandardMaterial color="#0D1A0F" roughness={1} />
      </mesh>
      <LibraryBackground />
      {PROJECTS.map((project, i) => (
        <FeatureBook key={project.id} project={project} index={i} spineColor={SPINE_COLORS[i]} />
      ))}
    </>
  )
}

'use client'
import { useRef, useMemo, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap'
import { useTooltip } from '@/context/TooltipContext'
import { SKILLS } from '@/data/skills'
import type { SkillNode, SkillBranch } from '@/types'

const getNodeColor = (level: number) => {
  if (level >= 85) return '#C9A84C'
  if (level >= 70) return '#4F9D5B'
  return '#AFC3B2'
}

const getEmissive = (level: number) => {
  if (level >= 85) return 0.65
  if (level >= 70) return 0.35
  return 0.12
}

interface BranchDef {
  id: SkillBranch
  dir: THREE.Vector3
  length: number
}

const TRUNK_TOP = new THREE.Vector3(0, 3, 0)

const BRANCH_DEFS: BranchDef[] = [
  { id: 'backend',  dir: new THREE.Vector3(1, 0.5, 0).normalize(),   length: 3.8 },
  { id: 'frontend', dir: new THREE.Vector3(-1, 0.5, 0).normalize(),  length: 3.4 },
  { id: 'data',     dir: new THREE.Vector3(0, 1, -0.3).normalize(),  length: 4.0 },
  { id: 'devops',   dir: new THREE.Vector3(0.4, 0.4, 1).normalize(), length: 3.2 },
]

// ── Single skill node sphere ──────────────────────────────────────────────────
function SkillNodeMesh({ skill, position }: { skill: SkillNode; position: THREE.Vector3 }) {
  const { showTooltip, hideTooltip } = useTooltip()
  const meshRef = useRef<THREE.Mesh>(null)
  const color = getNodeColor(skill.level)
  const emissive = getEmissive(skill.level)

  useFrame((state) => {
    if (!meshRef.current || skill.level < 85) return
    const mat = meshRef.current.material as THREE.MeshStandardMaterial
    mat.emissiveIntensity = emissive + Math.sin(state.clock.elapsedTime * 2.4 + position.x) * 0.22
  })

  return (
    <mesh
      ref={meshRef}
      position={position}
      onPointerOver={(e) => {
        e.stopPropagation()
        const mastery = skill.level >= 85 ? 'Advanced' : skill.level >= 70 ? 'Intermediate' : 'Learning'
        showTooltip(skill.name, skill.level, mastery, e.nativeEvent.clientX, e.nativeEvent.clientY)
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        hideTooltip()
        document.body.style.cursor = 'auto'
      }}
    >
      <sphereGeometry args={[0.18, 12, 12]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={emissive}
        roughness={0.3}
        metalness={0.15}
      />
    </mesh>
  )
}

// ── Branch cylinder + skill nodes ─────────────────────────────────────────────
function Branch({ def }: { def: BranchDef }) {
  const { dir, length } = def
  const skills = SKILLS.filter(s => s.branch === def.id)

  const quat = useMemo(() =>
    new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone()),
    [dir]
  )

  const midPos = useMemo(() =>
    TRUNK_TOP.clone().add(dir.clone().multiplyScalar(length / 2)),
    [dir, length]
  )

  const nodePositions = useMemo(() =>
    skills.map((_, i) =>
      TRUNK_TOP.clone().add(dir.clone().multiplyScalar(length * (i + 1) / (skills.length + 1)))
    ),
    [skills, dir, length]
  )

  return (
    <>
      <group position={midPos} quaternion={quat}>
        <mesh>
          <cylinderGeometry args={[0.04, 0.08, length, 8]} />
          <meshStandardMaterial color="#3D2E1A" roughness={0.82} />
        </mesh>
      </group>
      {skills.map((skill, i) => (
        <SkillNodeMesh key={skill.name} skill={skill} position={nodePositions[i]} />
      ))}
    </>
  )
}

// ── Chapter 5 root ─────────────────────────────────────────────────────────────
export default function Chapter5() {
  const { camera } = useThree()
  const { hideTooltip } = useTooltip()
  const orbitRef = useRef(false)

  useEffect(() => {
    camera.position.set(11, 5, 11)
    camera.lookAt(0, 2.5, 0)
    const flash = document.querySelector('[data-flash]') as HTMLElement | null
    if (flash) gsap.to(flash, { opacity: 0, duration: 0.4, delay: 0.1 })
    const timer = setTimeout(() => { orbitRef.current = true }, 820)
    return () => {
      clearTimeout(timer)
      orbitRef.current = false
      hideTooltip()
      document.body.style.cursor = 'auto'
    }
  }, [camera, hideTooltip])

  useFrame((state) => {
    if (!orbitRef.current) return
    const t = state.clock.elapsedTime * 0.1
    const r = 11
    state.camera.position.x = Math.sin(t) * r
    state.camera.position.z = Math.cos(t) * r
    state.camera.position.y = 5 + Math.sin(t * 0.28) * 1.5
    state.camera.lookAt(0, 2.5, 0)
  })

  return (
    <>
      <ambientLight intensity={0.15} color="#1B2B1E" />
      <pointLight position={[0, 8, 0]} intensity={2.0} color="#C9A84C" distance={20} decay={2} />
      <pointLight position={[0, 1, 6]} intensity={0.6} color="#4F9D5B" distance={12} decay={2} />
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color="#0A1A0C" roughness={1} />
      </mesh>
      {/* Trunk */}
      <mesh position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.3, 0.45, 3, 8]} />
        <meshStandardMaterial color="#3D2E1A" roughness={0.82} />
      </mesh>
      {/* Branches + nodes */}
      {BRANCH_DEFS.map(def => <Branch key={def.id} def={def} />)}
    </>
  )
}

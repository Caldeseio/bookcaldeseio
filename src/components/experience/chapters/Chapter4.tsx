'use client'
import { useRef, useMemo, useEffect, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { AnimatePresence, motion } from 'framer-motion'
import * as THREE from 'three'
import gsap from 'gsap'
import { useChapter } from '@/context/ChapterContext'
import { useLang } from '@/context/LangContext'
import { useNote } from '@/context/NoteContext'

// ── Deterministic seeded random ───────────────────────────────────────────────
const seededRandom = (seed: number) =>
  (((Math.sin(seed) * 9301 + 49297) % 233280) + 233280) % 233280 / 233280

// ── Neural network constellation ──────────────────────────────────────────────
function NeuralNet() {
  const nodes = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => {
      const phi   = seededRandom(i * 2) * Math.PI
      const theta = seededRandom(i * 2 + 1) * Math.PI * 2
      const r     = 1.2 + seededRandom(i * 3) * 1.4
      return new THREE.Vector3(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.cos(phi) * 0.6 + 2.0,
        r * Math.sin(phi) * Math.sin(theta) * 0.4,
      )
    })
  }, [])

  const { edgeGeo, colors } = useMemo(() => {
    const pts: number[] = []
    nodes.forEach((a, i) => {
      nodes.forEach((b, j) => {
        if (j <= i) return
        if (a.distanceTo(b) < 1.5) { pts.push(a.x, a.y, a.z, b.x, b.y, b.z) }
      })
    })
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3))
    // Even/odd color arrays for nodes (gold / cyan)
    const colors = nodes.map((_, i) => (i % 2 === 0 ? '#C9A84C' : '#61DAFB'))
    return { edgeGeo: g, colors }
  }, [nodes])

  const nodeRefs = useRef<(THREE.Mesh | null)[]>([])

  useEffect(() => () => { edgeGeo.dispose() }, [edgeGeo])

  useFrame((state) => {
    nodeRefs.current.forEach((mesh, i) => {
      if (!mesh) return
      const mat = mesh.material as THREE.MeshStandardMaterial
      const base = i % 2 === 0 ? 0.45 : 0.35
      mat.emissiveIntensity = base + Math.sin(state.clock.elapsedTime * 1.6 + i * 0.8) * 0.28
    })
  })

  return (
    <>
      <lineSegments geometry={edgeGeo}>
        <lineBasicMaterial color="#AFC3B2" transparent opacity={0.22} />
      </lineSegments>
      {nodes.map((pos, i) => (
        <mesh
          key={i}
          position={pos.toArray()}
          ref={(el) => { nodeRefs.current[i] = el }}
        >
          <sphereGeometry args={[0.12, 8, 8]} />
          <meshStandardMaterial
            color={colors[i]}
            emissive={colors[i]}
            emissiveIntensity={i % 2 === 0 ? 0.45 : 0.35}
            roughness={0.3}
          />
        </mesh>
      ))}
    </>
  )
}

// ── Gold drifting particles ────────────────────────────────────────────────────
function GoldParticles() {
  const count = 80
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])

  const { positions, speeds } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const speeds = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 10
      positions[i * 3 + 1] = Math.random() * 10
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10
      speeds[i] = 0.4 + Math.random() * 0.6
    }
    return { positions, speeds }
  }, [])

  useFrame((_, delta) => {
    if (!meshRef.current) return
    for (let i = 0; i < count; i++) {
      positions[i * 3 + 1] += speeds[i] * delta * 0.55
      if (positions[i * 3 + 1] > 7) positions[i * 3 + 1] = -3

      dummy.position.set(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2])
      dummy.scale.setScalar(0.06)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshStandardMaterial color="#C9A84C" emissive="#C9A84C" emissiveIntensity={0.85} />
    </instancedMesh>
  )
}

// ── Contact overlay panel ─────────────────────────────────────────────────────
const CONTACT_LINKS = [
  { label: 'Email',     value: 'luiscalderontcit@gmail.com',  href: 'mailto:luiscalderontcit@gmail.com' },
  { label: 'LinkedIn',  value: 'linkedin.com/in/caldeseio',   href: 'https://linkedin.com/in/caldeseio' },
  { label: 'GitHub',    value: 'github.com/Caldeseio',        href: 'https://github.com/Caldeseio' },
  { label: 'Instagram', value: '@caldeseio',                   href: 'https://instagram.com/caldeseio' },
]

export function ContactOverlay() {
  const { currentChapter } = useChapter()
  const { t } = useLang()
  const { addNote } = useNote()
  const [input, setInput] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [])

  const handleSubmit = () => {
    if (!input.trim()) return
    addNote()
    setInput('')
    setSubmitted(true)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setSubmitted(false), 2500)
  }

  return (
    <AnimatePresence>
      {currentChapter === 4 && (
        <motion.div
          initial={{ x: 80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 80, opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: 'min(380px, 90vw)',
            height: '100%',
            background: 'rgba(13,26,15,0.85)',
            backdropFilter: 'blur(12px)',
            zIndex: 40,
            display: 'flex',
            flexDirection: 'column',
            padding: '48px 32px',
            gap: 16,
            overflowY: 'auto',
            color: '#F1EDE3',
            fontFamily: 'sans-serif',
          }}
        >
          <div style={{ fontSize: 11, letterSpacing: 4, color: '#C9A84C', fontFamily: 'monospace' }}>
            CHAPTER IV
          </div>

          <h2 style={{ fontSize: 22, fontWeight: 700, margin: 0, lineHeight: 1.3 }}>
            {t('ch4.line1')}
          </h2>
          <p style={{ fontSize: 14, color: '#AFC3B2', margin: 0, lineHeight: 1.6 }}>
            {t('ch4.line2')}
          </p>

          <div style={{ height: 1, background: 'rgba(201,168,76,0.3)', margin: '8px 0' }} />

          {CONTACT_LINKS.map(link => (
            <div key={link.label}>
              <div style={{ fontSize: 10, letterSpacing: 2, color: '#C9A84C', fontFamily: 'monospace', marginBottom: 2 }}>
                {link.label}
              </div>
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#F1EDE3', fontSize: 13, textDecoration: 'none' }}
              >
                {link.value}
              </a>
            </div>
          ))}

          <a
            href="/pdf/CV_Luis_Calderon.pdf"
            download
            style={{
              display: 'inline-block',
              marginTop: 8,
              padding: '10px 20px',
              border: '1px solid #C9A84C',
              color: '#C9A84C',
              fontSize: 12,
              textDecoration: 'none',
              letterSpacing: 2,
              fontFamily: 'monospace',
              alignSelf: 'flex-start',
            }}
          >
            ↓ Descargar CV
          </a>

          <div style={{ height: 1, background: 'rgba(201,168,76,0.3)', margin: '8px 0' }} />
          <div style={{ fontSize: 11, letterSpacing: 3, color: '#C9A84C', fontFamily: 'monospace' }}>
            {t('ch4.cta')} ✧
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleSubmit() }}
              placeholder={t('ch4.placeholder')}
              style={{
                flex: 1,
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(201,168,76,0.35)',
                color: '#F1EDE3',
                padding: '8px 12px',
                fontSize: 13,
                outline: 'none',
                fontFamily: 'sans-serif',
              }}
            />
            <button
              onClick={handleSubmit}
              aria-label={submitted ? '✓' : '→'}
              style={{
                background: submitted ? '#4F9D5B' : 'transparent',
                border: '1px solid #C9A84C',
                color: '#C9A84C',
                padding: '8px 16px',
                cursor: 'pointer',
                fontSize: 16,
                transition: 'background 0.3s',
              }}
            >
              {submitted ? '✓' : '→'}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ── Chapter 4 root ─────────────────────────────────────────────────────────────
export default function Chapter4() {
  const { camera } = useThree()

  useEffect(() => {
    camera.position.set(0, 5, 9)
    camera.rotation.set(-0.42, 0, 0)
    gsap.killTweensOf(camera.position)

    const flash = document.querySelector<HTMLDivElement>('[data-flash]')
    const cam = gsap.to(camera.position, { y: 4.5, z: 8, duration: 1.0, ease: 'power2.out', delay: 0.1 })
    if (flash) gsap.to(flash, { opacity: 0, duration: 0.55, ease: 'power2.out', delay: 0.1 })

    return () => { cam.kill() }
  }, [camera])

  return (
    <>
      <ambientLight intensity={0.28} color="#0D1A1F" />
      <spotLight
        position={[0, 10, 2]}
        angle={0.38}
        penumbra={0.9}
        intensity={3.0}
        color="#61DAFB"
      />
      <pointLight position={[0, 5, 4]} intensity={1.8} color="#C9A84C" />
      <pointLight position={[-4, 3, 2]} intensity={0.5} color="#4F9D5B" />

      <NeuralNet />
      <GoldParticles />
    </>
  )
}

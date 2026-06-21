'use client'
import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap'

const GOLD  = '#C9A84C'
const AMBER = '#E8903A'

// Seeded random — same formula as bookPageTextures
function seededRandom(seed: number): number {
  return (((Math.sin(seed) * 9301 + 49297) % 233280) + 233280) % 233280 / 233280
}

const STAR_COUNT = 20
const MAX_CONNECT_DIST = 1.8

export default function StarConstellation() {
  const groupRef = useRef<THREE.Group>(null)

  // Generate seeded star meshes
  const stars = useMemo(() => Array.from({ length: STAR_COUNT }, (_, i) => {
    const x = (seededRandom(i * 2) - 0.5) * 3.5
    const y = 1.5 + seededRandom(i * 2 + 1) * 2.0
    const z = (seededRandom(i * 3 + 7) - 0.5) * 1.2
    const color = i % 2 === 0 ? GOLD : AMBER
    const geo  = new THREE.SphereGeometry(0.10, 6, 6)
    const mat  = new THREE.MeshToonMaterial({
      color,
      emissive: new THREE.Color(color),
      emissiveIntensity: 0.3,
      transparent: true,
      opacity: 0,
    })
    const mesh = new THREE.Mesh(geo, mat)
    mesh.position.set(x, y, z)
    mesh.scale.setScalar(0)
    return { mesh, geo, mat, x, y, z }
  }), [])

  // Build connection lines geometry
  const lineGeo = useMemo(() => {
    const points: number[] = []
    for (let a = 0; a < STAR_COUNT; a++) {
      for (let b = a + 1; b < STAR_COUNT; b++) {
        const sa = stars[a]
        const sb = stars[b]
        const dx = sa.x - sb.x
        const dy = sa.y - sb.y
        const dz = sa.z - sb.z
        if (Math.sqrt(dx * dx + dy * dy + dz * dz) < MAX_CONNECT_DIST) {
          points.push(sa.x, sa.y, sa.z, sb.x, sb.y, sb.z)
        }
      }
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.Float32BufferAttribute(points, 3))
    return geo
  }, [stars])

  const lineMat = useMemo(() => new THREE.LineBasicMaterial({
    color: GOLD,
    transparent: true,
    opacity: 0.25,
  }), [])

  const lines = useMemo(() => new THREE.LineSegments(lineGeo, lineMat), [lineGeo, lineMat])

  useEffect(() => {
    const group = groupRef.current
    if (group && typeof (group as THREE.Group).add === 'function') {
      stars.forEach(({ mesh }) => group.add(mesh))
      group.add(lines)
    }

    // GSAP entrance for each star
    stars.forEach(({ mat, mesh }, i) => {
      gsap.to(mat, {
        opacity: 1,
        duration: 0.6,
        ease: 'power2.out',
        delay: i * 0.06,
      })
      gsap.to(mesh.scale, {
        x: 1, y: 1, z: 1,
        duration: 0.6,
        ease: 'power2.out',
        delay: i * 0.06,
      })
    })

    return () => {
      gsap.killTweensOf(stars.map(s => s.mat))
      gsap.killTweensOf(stars.map(s => s.mesh.scale))
      stars.forEach(({ geo, mat }) => {
        geo.dispose()
        mat.dispose()
      })
      lineGeo.dispose()
      lineMat.dispose()
    }
  }, [stars, lineGeo, lineMat, lines])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    stars.forEach(({ mesh, mat }, i) => {
      ;(mat as THREE.MeshToonMaterial).emissiveIntensity =
        0.3 + Math.sin(t * 1.4 + i * 0.7) * 0.2
      void mesh
    })
  })

  return <group ref={groupRef} />
}

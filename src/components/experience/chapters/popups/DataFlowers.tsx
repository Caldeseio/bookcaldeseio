'use client'
import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap'

const GOLD       = '#C9A84C'
const AMBER      = '#E8903A'
const WARM_GREEN = '#7A8C3E'  // warm olive — replaces cold SAGE

const SKILLS = [
  { label: 'Power BI',   pct: 0.90, stemColor: WARM_GREEN, topColor: GOLD       },
  { label: 'MySQL',      pct: 0.90, stemColor: WARM_GREEN, topColor: WARM_GREEN  },
  { label: 'Python',     pct: 0.88, stemColor: WARM_GREEN, topColor: AMBER       },
  { label: 'SQL Server', pct: 0.70, stemColor: WARM_GREEN, topColor: GOLD        },
  { label: 'R',          pct: 0.66, stemColor: WARM_GREEN, topColor: AMBER       },
]

const MAX_HEIGHT = 2.5
const X_POSITIONS = [-1.0, -0.4, 0.2, 0.8, 1.4]

export default function DataFlowers() {
  const groupRef = useRef<THREE.Group>(null)

  // Build geometry/material data imperatively — not dependent on R3F ref
  const flowers = useMemo(() => SKILLS.map((skill, i) => {
    const stemHeight = skill.pct * MAX_HEIGHT
    const stemGeo  = new THREE.CylinderGeometry(0.05, 0.05, stemHeight, 6)
    const stemMat  = new THREE.MeshToonMaterial({ color: skill.stemColor })
    const topGeo   = new THREE.SphereGeometry(0.18, 8, 8)
    const topMat   = new THREE.MeshToonMaterial({ color: skill.topColor })
    const stem = new THREE.Mesh(stemGeo, stemMat)
    const top  = new THREE.Mesh(topGeo,  topMat)
    stem.position.set(X_POSITIONS[i], stemHeight / 2, -0.3)
    stem.scale.y = 0
    top.position.set(X_POSITIONS[i], stemHeight, -0.3)
    top.scale.set(0, 0, 0)  // start invisible alongside stem
    return { stem, top, stemGeo, topGeo, stemMat, topMat, stemHeight }
  }), [])

  useEffect(() => {
    // Attach to group if available (R3F scene — not present in tests)
    const group = groupRef.current
    if (group && typeof (group as THREE.Group).add === 'function') {
      flowers.forEach(({ stem, top }) => {
        group.add(stem)
        group.add(top)
      })
    }

    // GSAP entrance: stems grow upward (staggered), heads pop in when stem finishes
    flowers.forEach(({ stem, top }, i) => {
      gsap.to(stem.scale, {
        y: 1,
        duration: 1.4,
        ease: 'elastic.out(1, 0.5)',
        delay: i * 0.15,
      })
      gsap.to(top.scale, {
        x: 1, y: 1, z: 1,
        duration: 0.6,
        ease: 'back.out(1.7)',
        delay: i * 0.15 + 0.8,
      })
    })

    return () => {
      flowers.forEach(f => gsap.killTweensOf(f.stem.scale))
      flowers.forEach(f => gsap.killTweensOf(f.top.scale))
      flowers.forEach(({ stemGeo, topGeo, stemMat, topMat }) => {
        stemGeo.dispose()
        topGeo.dispose()
        stemMat.dispose()
        topMat.dispose()
      })
    }
  }, [flowers])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    flowers.forEach(({ top, stemHeight }, i) => {
      const bob = Math.sin(t * 1.2 + i * 0.8) * 0.003  // constant amplitude, frame-rate independent
      top.position.y = stemHeight + bob
    })
  })

  return <group ref={groupRef} />
}

'use client'
import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap'

const GOLD  = '#C9A84C'
const AMBER = '#E8903A'
const SAGE  = '#4F9D5B'
const RUST  = '#8B3A2A'

const PLANETS = [
  { label: 'PHP',     pos: [-1.2, 2.2, -0.5] as [number, number, number], color: GOLD  },
  { label: 'Laravel', pos: [-0.2, 2.8, -0.3] as [number, number, number], color: RUST  },
  { label: 'JS',      pos: [ 0.8, 2.3, -0.4] as [number, number, number], color: AMBER },
  { label: 'React',   pos: [-0.8, 3.2, -0.2] as [number, number, number], color: SAGE  },
  { label: 'SQL',     pos: [ 0.2, 2.1, -0.6] as [number, number, number], color: RUST  },
  { label: 'Node',    pos: [ 1.4, 2.9, -0.3] as [number, number, number], color: SAGE  },
]

export default function StoryPlanets() {
  const groupRef = useRef<THREE.Group>(null)

  const planets = useMemo(() => PLANETS.map((planet) => {
    const geo  = new THREE.SphereGeometry(0.28, 12, 12)
    const mat  = new THREE.MeshToonMaterial({ color: planet.color })
    const mesh = new THREE.Mesh(geo, mat)
    mesh.position.set(planet.pos[0], planet.pos[1], planet.pos[2])
    mesh.scale.setScalar(0)
    return { mesh, geo, mat, basePosY: planet.pos[1] }
  }), [])

  // Mutable base Y positions (updated after entrance animation completes)
  const basePosY = useRef(planets.map(p => p.basePosY))

  useEffect(() => {
    const group = groupRef.current
    if (group && typeof (group as THREE.Group).add === 'function') {
      planets.forEach(({ mesh }) => group.add(mesh))
    }

    planets.forEach(({ mesh, basePosY: startY }, i) => {
      gsap.to(mesh.scale, {
        x: 1, y: 1, z: 1,
        duration: 0.9,
        ease: 'back.out(1.7)',
        delay: i * 0.12,
      })
      gsap.to(mesh.position, {
        y: startY + 0.5,
        duration: 0.9,
        ease: 'back.out(1.7)',
        delay: i * 0.12,
        onComplete: () => {
          basePosY.current[i] = startY + 0.5
        },
      })
    })

    return () => {
      gsap.killTweensOf(planets.map(p => p.mesh.scale))
      gsap.killTweensOf(planets.map(p => p.mesh.position))
      planets.forEach(({ geo, mat }) => {
        geo.dispose()
        mat.dispose()
      })
    }
  }, [planets])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    planets.forEach(({ mesh }, i) => {
      mesh.position.y = basePosY.current[i] + Math.sin(t * 0.9 + i * 1.1) * 0.06
    })
  })

  return <group ref={groupRef} />
}

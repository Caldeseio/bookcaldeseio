'use client'
import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap'

const GOLD  = '#C9A84C'
const AMBER = '#E8903A'

const ARM_ANGLES = [0, Math.PI * 0.4, Math.PI * 0.8, Math.PI * 1.2, Math.PI * 1.6]
const ARM_LENGTH = 1.8

export default function GoldenCompass() {
  const groupRef  = useRef<THREE.Group>(null)

  const compassGroup = useMemo(() => {
    const g = new THREE.Group()
    g.position.set(0, 2.0, 0)
    return g
  }, [])

  const centerMesh = useMemo(() => {
    const geo = new THREE.SphereGeometry(0.55, 16, 16)
    const mat = new THREE.MeshToonMaterial({
      color: GOLD,
      emissive: new THREE.Color(GOLD),
      emissiveIntensity: 0.3,
    })
    const mesh = new THREE.Mesh(geo, mat)
    // NOTE: do NOT add to group here — StrictMode runs useMemo twice, causing double-add
    return { mesh, geo, mat }
  }, [])

  const arms = useMemo(() => ARM_ANGLES.map((a) => {
    // Arm cylinder
    const armGeo = new THREE.CylinderGeometry(0.04, 0.04, ARM_LENGTH, 6)
    const armMat = new THREE.MeshToonMaterial({ color: AMBER })
    const arm    = new THREE.Mesh(armGeo, armMat)
    arm.rotation.z = a
    arm.position.set(Math.cos(a) * 0.9, Math.sin(a) * 0.9, 0)
    // NOTE: do NOT add to group here — StrictMode runs useMemo twice, causing double-add

    // Endpoint sphere
    const endGeo = new THREE.SphereGeometry(0.22, 10, 10)
    const endMat = new THREE.MeshToonMaterial({ color: AMBER })
    const end    = new THREE.Mesh(endGeo, endMat)
    end.position.set(Math.cos(a) * ARM_LENGTH, Math.sin(a) * ARM_LENGTH, 0)

    return { arm, end, armGeo, armMat, endGeo, endMat }
  }), [])

  useEffect(() => {
    const parentGroup = groupRef.current
    if (parentGroup && typeof (parentGroup as THREE.Group).add === 'function') {
      parentGroup.add(compassGroup)
    }

    // Add children to compassGroup inside useEffect (safe from StrictMode double-invoke)
    compassGroup.add(centerMesh.mesh)
    arms.forEach(({ arm, end }) => {
      compassGroup.add(arm)
      compassGroup.add(end)
    })

    // GSAP entrance
    compassGroup.scale.set(0, 0, 0)
    compassGroup.rotation.z = -Math.PI * 0.5

    gsap.to(compassGroup.scale, {
      x: 1, y: 1, z: 1,
      duration: 1.4,
      ease: 'elastic.out(1, 0.5)',
    })
    gsap.to(compassGroup.rotation, {
      z: 0,
      duration: 1.4,
      ease: 'elastic.out(1, 0.5)',
    })

    return () => {
      gsap.killTweensOf(compassGroup.scale)
      gsap.killTweensOf(compassGroup.rotation)
      compassGroup.remove(centerMesh.mesh)
      centerMesh.geo.dispose()
      centerMesh.mat.dispose()
      arms.forEach(({ arm, end, armGeo, armMat, endGeo, endMat }) => {
        compassGroup.remove(arm)
        compassGroup.remove(end)
        armGeo.dispose()
        armMat.dispose()
        endGeo.dispose()
        endMat.dispose()
      })
    }
  }, [compassGroup, centerMesh, arms])

  useFrame((state, delta) => {
    // Slow continuous Y rotation
    compassGroup.rotation.y += delta * 0.2

    // Center sphere emissive pulse
    const mat = centerMesh.mesh.material as THREE.MeshToonMaterial
    mat.emissiveIntensity = 0.3 + Math.sin(state.clock.elapsedTime * 1.8) * 0.2
  })

  return <group ref={groupRef} />
}

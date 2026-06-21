'use client'
import { useRef, useMemo, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useCursor } from '@react-three/drei'
import * as THREE from 'three'
import { useChapter } from '@/context/ChapterContext'
import type { ChapterIndex } from '@/types'
import {
  drawCover, drawBackCover,
  drawCh1Left, drawCh1Right,
  drawCh2Left, drawCh2Right,
  drawCh3Left, drawCh3Right,
  drawCh4Left, drawCh4Right,
} from '@/utils/bookPageTextures'

// ── Constants (verbatim from Three.JS-Book/Book.jsx) ──────────────────────────
const PAGE_WIDTH = 1.28
const PAGE_HEIGHT = 1.71
const PAGE_DEPTH = 0.003
const PAGE_SEGMENTS = 30
const SEGMENT_WIDTH = PAGE_WIDTH / PAGE_SEGMENTS
const easingFactor = 0.5
const easingFactorFold = 0.3
const insideCurveStrength = 0.18
const outsideCurveStrength = 0.05
const turningCurveStrength = 0.09

// ── dampAngle (replaces maath/easing) ─────────────────────────────────────────
function dampAngle(
  obj: { [key: string]: number },
  key: string,
  target: number,
  lambda: number,
  dt: number,
) {
  const delta = Math.atan2(
    Math.sin(target - obj[key]),
    Math.cos(target - obj[key]),
  )
  obj[key] += delta * (1 - Math.exp(-lambda * dt))
}

// ── Shared skinned page geometry (module-level, created once) ─────────────────
const pageGeometry = new THREE.BoxGeometry(
  PAGE_WIDTH,
  PAGE_HEIGHT,
  PAGE_DEPTH,
  PAGE_SEGMENTS,
  2,
)

pageGeometry.translate(PAGE_WIDTH / 2, 0, 0)

const position = pageGeometry.attributes.position
const vertex = new THREE.Vector3()
const skinIndexes: number[] = []
const skinWeights: number[] = []

for (let i = 0; i < position.count; i++) {
  vertex.fromBufferAttribute(position as THREE.BufferAttribute, i)
  const x = vertex.x
  const skinIndex = Math.max(0, Math.floor(x / SEGMENT_WIDTH))
  const skinWeight = (x % SEGMENT_WIDTH) / SEGMENT_WIDTH
  skinIndexes.push(skinIndex, skinIndex + 1, 0, 0)
  skinWeights.push(1 - skinWeight, skinWeight, 0, 0)
}

pageGeometry.setAttribute(
  'skinIndex',
  new THREE.Uint16BufferAttribute(skinIndexes, 4),
)
pageGeometry.setAttribute(
  'skinWeight',
  new THREE.Float32BufferAttribute(skinWeights, 4),
)

const whiteColor = new THREE.Color('white')

const pageMaterials = [
  new THREE.MeshStandardMaterial({ color: whiteColor }),          // [0] right edge
  new THREE.MeshStandardMaterial({ color: '#F4EDE3' }),           // [1] left/spine edge
  new THREE.MeshStandardMaterial({ color: '#F4EDE3' }),           // [2] top edge
  new THREE.MeshStandardMaterial({ color: '#F4EDE3' }),           // [3] bottom edge
]

// ── Page component ────────────────────────────────────────────────────────────
interface PageProps {
  number: number
  frontDraw: () => HTMLCanvasElement
  backDraw: () => HTMLCanvasElement
  page: number        // delayedPage
  opened: boolean
  bookClosed: boolean
}

const TOTAL_PAGES = 5

function Page({ number, frontDraw, backDraw, page, opened, bookClosed }: PageProps) {
  const { navigateTo, currentChapter } = useChapter()
  const group = useRef<THREE.Group>(null!)
  const turnedAt = useRef(0)
  const lastOpened = useRef(opened)
  const skinnedMeshRef = useRef<THREE.SkinnedMesh>(null!)
  const [highlighted, setHighlighted] = useState(false)
  useCursor(highlighted)

  // Create canvas textures once
  const frontTexture = useMemo(() => new THREE.CanvasTexture(frontDraw()), [frontDraw])
  const backTexture  = useMemo(() => new THREE.CanvasTexture(backDraw()),  [backDraw])

  // Dispose textures on unmount
  useEffect(() => {
    return () => {
      frontTexture.dispose()
      backTexture.dispose()
    }
  }, [frontTexture, backTexture])

  const manualSkinnedMesh = useMemo(() => {
    const bones: THREE.Bone[] = []
    for (let i = 0; i <= PAGE_SEGMENTS; i++) {
      const bone = new THREE.Bone()
      bones.push(bone)
      if (i === 0) {
        bone.position.x = 0
      } else {
        bone.position.x = SEGMENT_WIDTH
      }
      if (i > 0) {
        bones[i - 1].add(bone)
      }
    }
    const skeleton = new THREE.Skeleton(bones)

    const materials = [
      ...pageMaterials,
      new THREE.MeshStandardMaterial({
        color: whiteColor,
        map: frontTexture,
        roughness: 0.1,
        emissive: new THREE.Color('orange'),
        emissiveIntensity: 0,
      }),
      new THREE.MeshStandardMaterial({
        color: whiteColor,
        map: backTexture,
        roughness: 0.1,
        emissive: new THREE.Color('orange'),
        emissiveIntensity: 0,
      }),
    ]

    const mesh = new THREE.SkinnedMesh(pageGeometry, materials)
    mesh.castShadow = true
    mesh.receiveShadow = true
    mesh.frustumCulled = false
    mesh.add(skeleton.bones[0])
    mesh.bind(skeleton)
    return mesh
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frontTexture, backTexture])

  useFrame((_, delta) => {
    if (!skinnedMeshRef.current) return

    if (lastOpened.current !== opened) {
      turnedAt.current = +new Date()
      lastOpened.current = opened
    }

    let turningTime = Math.min(400, new Date().getTime() - turnedAt.current) / 400
    turningTime = Math.sin(turningTime * Math.PI)

    let targetRotation = opened ? -Math.PI / 2 : Math.PI / 2
    if (!bookClosed) {
      targetRotation += THREE.MathUtils.degToRad(number * 0.8)
    }

    const bones = skinnedMeshRef.current.skeleton.bones
    for (let i = 0; i < bones.length; i++) {
      const target = i === 0 ? group.current : bones[i]

      const insideCurveIntensity  = i < 8 ? Math.sin(i * 0.2 + 0.25) : 0
      const outsideCurveIntensity = i >= 8 ? Math.cos(i * 0.3 + 0.09) : 0
      const turningIntensity =
        Math.sin(i * Math.PI * (1 / bones.length)) * turningTime

      let rotationAngle =
        insideCurveStrength  * insideCurveIntensity  * targetRotation -
        outsideCurveStrength * outsideCurveIntensity * targetRotation +
        turningCurveStrength * turningIntensity      * targetRotation

      let foldRotationAngle = THREE.MathUtils.degToRad(Math.sign(targetRotation) * 2)

      if (bookClosed) {
        if (i === 0) {
          rotationAngle = targetRotation
          foldRotationAngle = 0
        } else {
          rotationAngle = 0
          foldRotationAngle = 0
        }
      }

      dampAngle(target.rotation as unknown as { [key: string]: number }, 'y', rotationAngle, easingFactor, delta)

      const foldIntensity =
        i > 8
          ? Math.sin(i * Math.PI * (1 / bones.length) - 0.5) * turningTime
          : 0

      dampAngle(
        target.rotation as unknown as { [key: string]: number },
        'x',
        foldRotationAngle * foldIntensity,
        easingFactorFold,
        delta,
      )
    }
  })

  return (
    <group
      ref={group}
      onPointerEnter={(e) => {
        e.stopPropagation()
        setHighlighted(true)
      }}
      onPointerLeave={(e) => {
        e.stopPropagation()
        setHighlighted(false)
      }}
      onClick={(e) => {
        e.stopPropagation()
        setHighlighted(false)
        if (opened) {
          navigateTo(Math.max(0, currentChapter - 1) as ChapterIndex)
        } else {
          navigateTo(Math.min(4, currentChapter + 1) as ChapterIndex)
        }
      }}
    >
      <primitive
        object={manualSkinnedMesh}
        ref={skinnedMeshRef}
        position-z={-number * PAGE_DEPTH + page * PAGE_DEPTH}
      />
    </group>
  )
}

// ── Book component (default export) ──────────────────────────────────────────
export default function BookReader() {
  const { currentChapter } = useChapter()
  const [delayedPage, setDelayedPage] = useState<ChapterIndex>(currentChapter)

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>
    const goToPage = () => {
      setDelayedPage((prev) => {
        if (currentChapter === prev) {
          return prev
        }
        timeout = setTimeout(
          () => { goToPage() },
          Math.abs(currentChapter - prev) > 2 ? 50 : 150,
        )
        if (currentChapter > prev) return (prev + 1) as ChapterIndex
        if (currentChapter < prev) return (prev - 1) as ChapterIndex
        return prev
      })
    }
    goToPage()
    return () => { clearTimeout(timeout) }
  }, [currentChapter])

  const pages: { frontDraw: () => HTMLCanvasElement; backDraw: () => HTMLCanvasElement }[] = [
    { frontDraw: drawCover,    backDraw: drawCh1Left  },
    { frontDraw: drawCh1Right, backDraw: drawCh2Left  },
    { frontDraw: drawCh2Right, backDraw: drawCh3Left  },
    { frontDraw: drawCh3Right, backDraw: drawCh4Left  },
    { frontDraw: drawCh4Right, backDraw: drawBackCover },
  ]

  return (
    <group rotation={[-Math.PI / 2, -Math.PI / 2, 0]} scale={[2.2, 2.2, 2.2]}>
      {pages.map((pageData, index) => (
        <Page
          key={index}
          number={index}
          frontDraw={pageData.frontDraw}
          backDraw={pageData.backDraw}
          page={delayedPage}
          opened={delayedPage > index}
          bookClosed={delayedPage === 0 || delayedPage === 4}
        />
      ))}
    </group>
  )
}

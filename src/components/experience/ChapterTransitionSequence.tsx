'use client'
import { useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import gsap from 'gsap'
import { useChapter } from '@/context/ChapterContext'

interface Props {
  flashRef: React.RefObject<HTMLDivElement | null>
}

export default function ChapterTransitionSequence({ flashRef }: Props) {
  const { camera } = useThree()
  const { completeTransition } = useChapter()

  useEffect(() => {
    const flash = flashRef.current
    if (!flash) return

    const startZ = camera.position.z
    const tl = gsap.timeline()

    // Camera pulls back from current scene (0 – 0.4s)
    tl.to(camera.position, { z: startZ + 3, duration: 0.4, ease: 'power2.in' }, 0)

    // Flash fills screen (0.3 – 0.55s)
    tl.to(flash, { opacity: 1, duration: 0.25, ease: 'power2.in' }, 0.3)

    // Swap chapters at peak white (0.55s)
    // The new chapter mounts and handles camera reset + flash fade-out
    tl.call(completeTransition, undefined, 0.55)

    return () => { tl.kill() }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return null
}

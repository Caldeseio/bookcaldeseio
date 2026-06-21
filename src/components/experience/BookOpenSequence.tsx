'use client'

import { useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import gsap from 'gsap'
import { useChapter } from '@/context/ChapterContext'

interface Props {
  flashRef: React.RefObject<HTMLDivElement | null>
  shouldPlay: boolean
}

export default function BookOpenSequence({ flashRef, shouldPlay }: Props) {
  const { camera } = useThree()
  const { completeTransition } = useChapter()

  useEffect(() => {
    if (!shouldPlay) return
    const flash = flashRef.current
    if (!flash) return

    const tl = gsap.timeline({ onComplete: completeTransition })

    // Camera lifts to reading position — book remains visible below
    tl.to(camera.position, { x: 0, y: 1.8, z: 7, duration: 1.4, ease: 'power2.inOut' }, 0)
    tl.to(camera.rotation, { x: -0.2, y: 0, z: 0, duration: 1.4, ease: 'power2.inOut' }, 0)
    tl.fromTo(flash, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: 'power2.in' }, 1.0)

    return () => { tl.kill() }
  }, [shouldPlay]) // eslint-disable-line react-hooks/exhaustive-deps

  return null
}

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

    // Camera pushes into the book
    tl.to(camera.position, { z: 1.5, y: 1.5, duration: 1.3, ease: 'power2.inOut' }, 0)
    tl.to(camera.rotation, { x: -0.1, duration: 1.3, ease: 'power2.inOut' }, 0)

    // White flash covers the screen during the hard cut
    tl.fromTo(flash, { opacity: 0 }, { opacity: 1, duration: 0.45, ease: 'power2.in' }, 0.9)

    return () => { tl.kill() }
  }, [shouldPlay]) // eslint-disable-line react-hooks/exhaustive-deps

  return null
}

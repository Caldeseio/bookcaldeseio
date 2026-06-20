'use client'
import { useEffect } from 'react'
import gsap from 'gsap'
import { useChapter } from '@/context/ChapterContext'

interface Props {
  flashRef: React.RefObject<HTMLDivElement | null>
}

export default function ChapterTransitionSequence({ flashRef }: Props) {
  const { completeTransition } = useChapter()

  useEffect(() => {
    const flash = flashRef.current
    if (!flash) return

    gsap.killTweensOf(flash)

    const tl = gsap.timeline()
    tl.to(flash, { opacity: 1, duration: 0.28, ease: 'power2.in' }, 0)
    tl.call(completeTransition, undefined, 0.28)

    return () => { tl.kill() }
  }, []) // eslint-disable-line

  return null
}

import { useEffect, useRef } from 'react'
import { useChapter } from '@/context/ChapterContext'
import type { ChapterIndex } from '@/types'

export function useNavigationInput() {
  const { currentChapter, isTransitioning, navigateTo } = useChapter()
  const lastWheelRef = useRef(0)

  useEffect(() => {
    // Chapter 0 = book intro. Keyboard/scroll only active in chapters 1-6.
    if (currentChapter === 0 || isTransitioning) return

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' && currentChapter < 6) {
        navigateTo((currentChapter + 1) as ChapterIndex)
      }
      if (e.key === 'ArrowLeft' && currentChapter > 1) {
        navigateTo((currentChapter - 1) as ChapterIndex)
      }
    }

    const handleWheel = (e: WheelEvent) => {
      const now = Date.now()
      if (now - lastWheelRef.current < 900) return  // debounce — avoid skipping chapters
      lastWheelRef.current = now
      if (e.deltaY > 40 && currentChapter < 6) {
        navigateTo((currentChapter + 1) as ChapterIndex)
      }
      if (e.deltaY < -40 && currentChapter > 1) {
        navigateTo((currentChapter - 1) as ChapterIndex)
      }
    }

    window.addEventListener('keydown', handleKey)
    window.addEventListener('wheel', handleWheel, { passive: true })
    return () => {
      window.removeEventListener('keydown', handleKey)
      window.removeEventListener('wheel', handleWheel)
    }
  }, [currentChapter, isTransitioning, navigateTo])
}

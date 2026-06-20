'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import type { ChapterIndex } from '@/types'

interface ChapterContextValue {
  currentChapter: ChapterIndex
  pendingChapter: ChapterIndex | null
  isTransitioning: boolean
  navigateTo: (chapter: ChapterIndex) => void
  completeTransition: () => void
}

const ChapterContext = createContext<ChapterContextValue | null>(null)

export function ChapterProvider({ children }: { children: ReactNode }) {
  const [currentChapter, setCurrentChapter] = useState<ChapterIndex>(0)
  const [pendingChapter, setPendingChapter] = useState<ChapterIndex | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const navigateTo = useCallback((chapter: ChapterIndex) => {
    setIsTransitioning(prev => {
      if (prev) return prev  // ignore if already transitioning
      setPendingChapter(chapter)
      return true
    })
  }, [])

  const completeTransition = useCallback(() => {
    setPendingChapter(prev => {
      if (prev !== null) setCurrentChapter(prev)
      return null
    })
    setIsTransitioning(false)
  }, [])

  return (
    <ChapterContext.Provider value={{ currentChapter, pendingChapter, isTransitioning, navigateTo, completeTransition }}>
      {children}
    </ChapterContext.Provider>
  )
}

export function useChapter() {
  const ctx = useContext(ChapterContext)
  if (!ctx) throw new Error('useChapter must be used within ChapterProvider')
  return ctx
}

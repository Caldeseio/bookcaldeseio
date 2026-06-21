'use client'
import { useEffect } from 'react'
import { useChapter } from '@/context/ChapterContext'

export default function ChapterTransitionSequence() {
  const { completeTransition } = useChapter()
  useEffect(() => {
    completeTransition()
  }, [completeTransition])
  return null
}

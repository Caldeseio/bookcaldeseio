'use client'
import { useChapter } from '@/context/ChapterContext'
import BookScene from './BookScene'
import ChapterTransitionSequence from './ChapterTransitionSequence'
import OpenBook from './OpenBook'
import Chapter1 from './chapters/Chapter1'
import Chapter2 from './chapters/Chapter2'
import Chapter3 from './chapters/Chapter3'
import Chapter4 from './chapters/Chapter4'

interface Props { flashRef: React.RefObject<HTMLDivElement | null> }

export default function SceneRenderer({ flashRef }: Props) {
  const { currentChapter, isTransitioning } = useChapter()

  // ChapterTransitionSequence handles inter-chapter transitions (chapters 1+)
  // BookOpenSequence (inside BookScene) handles the book-open animation (chapter 0 → 1)
  const showChapterTransition = isTransitioning && currentChapter > 0

  return (
    <>
      {currentChapter === 0 && <BookScene flashRef={flashRef} />}
      {currentChapter >= 1 && <OpenBook />}
      {currentChapter === 1 && <Chapter1 />}
      {currentChapter === 2 && <Chapter2 />}
      {currentChapter === 3 && <Chapter3 />}
      {currentChapter === 4 && <Chapter4 />}
      {showChapterTransition && <ChapterTransitionSequence flashRef={flashRef} />}
    </>
  )
}

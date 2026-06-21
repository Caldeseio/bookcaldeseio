'use client'
import { useChapter } from '@/context/ChapterContext'
import BookScene from './BookScene'
import BookReader from './BookReader'
import ChapterTransitionSequence from './ChapterTransitionSequence'
import SceneLighting from './SceneLighting'
import DataFlowers from './chapters/popups/DataFlowers'
import StoryPlanets from './chapters/popups/StoryPlanets'
import GoldenCompass from './chapters/popups/GoldenCompass'
import StarConstellation from './chapters/popups/StarConstellation'

interface Props { flashRef: React.RefObject<HTMLDivElement | null> }

export default function SceneRenderer({ flashRef }: Props) {
  const { currentChapter, isTransitioning } = useChapter()

  // ChapterTransitionSequence handles inter-chapter transitions (chapters 1+)
  // BookOpenSequence (inside BookScene) handles the book-open animation (chapter 0 → 1)
  const showChapterTransition = isTransitioning && currentChapter > 0

  return (
    <>
      <SceneLighting />
      {currentChapter === 0 && <BookScene flashRef={flashRef} />}
      {currentChapter >= 1 && <BookReader />}
      {currentChapter === 1 && <DataFlowers />}
      {currentChapter === 2 && <StoryPlanets />}
      {currentChapter === 3 && <GoldenCompass />}
      {currentChapter === 4 && <StarConstellation />}
      {showChapterTransition && <ChapterTransitionSequence />}
    </>
  )
}

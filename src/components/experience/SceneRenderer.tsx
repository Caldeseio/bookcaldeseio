'use client'
import { useChapter } from '@/context/ChapterContext'
import BookScene from './BookScene'
import Chapter1 from './chapters/Chapter1'

interface Props { flashRef: React.RefObject<HTMLDivElement | null> }

export default function SceneRenderer({ flashRef }: Props) {
  const { currentChapter } = useChapter()
  if (currentChapter === 0) return <BookScene flashRef={flashRef} />
  if (currentChapter === 1) return <Chapter1 />
  // Chapters 2-6 added in Phase 2 plan
  return <mesh><boxGeometry args={[1,1,1]} /><meshStandardMaterial color="#4F9D5B" /></mesh>
}

'use client'

import { useChapter } from '@/context/ChapterContext'
import BookScene from './BookScene'

interface Props { flashRef: React.RefObject<HTMLDivElement | null> }

export default function SceneRenderer({ flashRef }: Props) {
  const { currentChapter } = useChapter()

  if (currentChapter === 0) return <BookScene flashRef={flashRef} />

  // Chapters 1-6 are added in later tasks
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#4F9D5B" />
    </mesh>
  )
}

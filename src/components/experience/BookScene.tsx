'use client'

import { useState } from 'react'
import { useChapter } from '@/context/ChapterContext'
import Desk from './Desk'
import SceneLighting from './SceneLighting'
import ScenePostProcessing from './ScenePostProcessing'
import TheBook from './TheBook'
import BookOpenSequence from './BookOpenSequence'

interface Props { flashRef: React.RefObject<HTMLDivElement | null> }

export default function BookScene({ flashRef }: Props) {
  const { navigateTo } = useChapter()
  const [playOpen, setPlayOpen] = useState(false)

  const handleOpen = () => {
    navigateTo(1)
    setPlayOpen(true)
  }

  return (
    <>
      <SceneLighting />
      <Desk />
      <TheBook onOpen={handleOpen} />
      <BookOpenSequence flashRef={flashRef} shouldPlay={playOpen} />
      <ScenePostProcessing />
    </>
  )
}

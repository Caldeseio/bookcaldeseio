'use client'

import { useChapter } from '@/context/ChapterContext'
import Desk from './Desk'
import SceneLighting from './SceneLighting'
import ScenePostProcessing from './ScenePostProcessing'
import TheBook from './TheBook'

interface Props { flashRef: React.RefObject<HTMLDivElement | null> }

export default function BookScene({ flashRef }: Props) {
  const { navigateTo } = useChapter()

  return (
    <>
      <SceneLighting />
      <Desk />
      <TheBook onOpen={() => navigateTo(1)} />
      <ScenePostProcessing />
    </>
  )
}

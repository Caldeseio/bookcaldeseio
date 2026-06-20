'use client'

import dynamic from 'next/dynamic'
import { ChapterProvider } from '@/context/ChapterContext'
import { LangProvider } from '@/context/LangContext'

const BookExperience = dynamic(
  () => import('@/components/experience/BookExperience'),
  { ssr: false }
)

export default function Home() {
  return (
    <ChapterProvider>
      <LangProvider>
        <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative' }}>
          <BookExperience />
        </div>
      </LangProvider>
    </ChapterProvider>
  )
}

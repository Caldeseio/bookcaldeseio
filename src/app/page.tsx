'use client'

import dynamic from 'next/dynamic'
import { ChapterProvider } from '@/context/ChapterContext'
import { LangProvider } from '@/context/LangContext'
import LangToggle from '@/components/ui/LangToggle'
import EntryOverlay from '@/components/ui/EntryOverlay'
import NarrativeText from '@/components/ui/NarrativeText'
import ChapterNav from '@/components/ui/ChapterNav'

const BookExperience = dynamic(() => import('@/components/experience/BookExperience'), { ssr: false })

export default function Home() {
  return (
    <ChapterProvider>
      <LangProvider>
        <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative' }}>
          <BookExperience />
          <div style={{ position: 'absolute', top: 14, right: 14, zIndex: 30 }}>
            <LangToggle />
          </div>
          <EntryOverlay />
          <NarrativeText />
          <ChapterNav />
        </div>
      </LangProvider>
    </ChapterProvider>
  )
}

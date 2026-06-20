'use client'
import dynamic from 'next/dynamic'
import { ChapterProvider } from '@/context/ChapterContext'
import { LangProvider } from '@/context/LangContext'
import { ProjectProvider } from '@/context/ProjectContext'
import LangToggle from '@/components/ui/LangToggle'
import EntryOverlay from '@/components/ui/EntryOverlay'
import NarrativeText from '@/components/ui/NarrativeText'
import ChapterNav from '@/components/ui/ChapterNav'
import ProjectCard from '@/components/ui/ProjectCard'

const BookExperience = dynamic(() => import('@/components/experience/BookExperience'), { ssr: false })

function AppContent() {
  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative' }}>
      <BookExperience />
      <div style={{ position: 'absolute', top: 14, right: 14, zIndex: 30 }}>
        <LangToggle />
      </div>
      <EntryOverlay />
      <NarrativeText />
      <ChapterNav />
      <ProjectCard />
    </div>
  )
}

export default function Home() {
  return (
    <ChapterProvider>
      <LangProvider>
        <ProjectProvider>
          <AppContent />
        </ProjectProvider>
      </LangProvider>
    </ChapterProvider>
  )
}

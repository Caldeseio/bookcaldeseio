'use client'
import { createContext, useContext, useState, ReactNode } from 'react'
import type { Project } from '@/types'

interface ProjectContextValue {
  selectedProject: Project | null
  selectProject: (p: Project | null) => void
}

const ProjectContext = createContext<ProjectContextValue | null>(null)

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  return (
    <ProjectContext.Provider value={{ selectedProject, selectProject: setSelectedProject }}>
      {children}
    </ProjectContext.Provider>
  )
}

export function useProject() {
  const ctx = useContext(ProjectContext)
  if (!ctx) throw new Error('useProject must be used within ProjectProvider')
  return ctx
}

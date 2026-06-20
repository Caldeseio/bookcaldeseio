'use client'
import { createContext, useContext, useState, ReactNode } from 'react'

interface NoteContextValue {
  noteCount: number
  addNote: () => void
}

const NoteContext = createContext<NoteContextValue | null>(null)

export function NoteProvider({ children }: { children: ReactNode }) {
  const [noteCount, setNoteCount] = useState(0)
  return (
    <NoteContext.Provider value={{ noteCount, addNote: () => setNoteCount(c => c + 1) }}>
      {children}
    </NoteContext.Provider>
  )
}

export function useNote() {
  const ctx = useContext(NoteContext)
  if (!ctx) throw new Error('useNote must be used within NoteProvider')
  return ctx
}

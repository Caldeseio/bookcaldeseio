'use client'
import { createContext, useContext, useState, ReactNode } from 'react'

interface TooltipState {
  skill: string
  level: number
  mastery: string
  x: number
  y: number
}

interface TooltipContextValue {
  tooltip: TooltipState | null
  showTooltip: (skill: string, level: number, mastery: string, x: number, y: number) => void
  hideTooltip: () => void
}

const TooltipContext = createContext<TooltipContextValue | null>(null)

export function TooltipProvider({ children }: { children: ReactNode }) {
  const [tooltip, setTooltip] = useState<TooltipState | null>(null)
  return (
    <TooltipContext.Provider value={{
      tooltip,
      showTooltip: (skill, level, mastery, x, y) => setTooltip({ skill, level, mastery, x, y }),
      hideTooltip: () => setTooltip(null),
    }}>
      {children}
    </TooltipContext.Provider>
  )
}

export function useTooltip() {
  const ctx = useContext(TooltipContext)
  if (!ctx) throw new Error('useTooltip must be used within TooltipProvider')
  return ctx
}

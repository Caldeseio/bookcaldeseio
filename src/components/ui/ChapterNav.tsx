'use client'
import { useChapter } from '@/context/ChapterContext'

const TABS = [
  { label: 'COVER', chapter: 0 },
  { label: 'I',     chapter: 1 },
  { label: 'II',    chapter: 2 },
  { label: 'III',   chapter: 3 },
  { label: 'IV',    chapter: 4 },
] as const

export default function ChapterNav() {
  const { currentChapter, navigateTo, isTransitioning } = useChapter()

  return (
    <nav
      style={{
        position: 'fixed',
        bottom: '28px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '10px',
        zIndex: 30,
      }}
    >
      {TABS.map(({ label, chapter }) => {
        const isActive = currentChapter === chapter
        return (
          <button
            key={chapter}
            onClick={() => !isTransitioning && navigateTo(chapter)}
            style={{
              padding: '10px 20px',
              borderRadius: '9999px',
              border: isActive
                ? 'none'
                : '1px solid rgba(255,255,255,0.25)',
              background: isActive
                ? 'rgba(255,255,255,0.88)'
                : 'rgba(0,0,0,0.28)',
              color: isActive ? '#13100A' : '#F4EDE3',
              font: '11px/1 monospace',
              letterSpacing: '2px',
              cursor: isTransitioning ? 'default' : 'pointer',
              transition: 'border-color 0.2s',
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                (e.currentTarget as HTMLButtonElement).style.borderColor =
                  'rgba(201,168,76,0.7)'
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                (e.currentTarget as HTMLButtonElement).style.borderColor =
                  'rgba(255,255,255,0.25)'
              }
            }}
          >
            {label}
          </button>
        )
      })}
    </nav>
  )
}

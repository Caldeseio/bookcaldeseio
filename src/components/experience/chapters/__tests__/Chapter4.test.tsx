import { render, fireEvent, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ContactOverlay } from '../Chapter4'

vi.mock('@/context/ChapterContext', () => ({
  useChapter: vi.fn(() => ({
    currentChapter: 4,
    isTransitioning: false,
    navigateTo: vi.fn(),
    pendingChapter: null,
    completeTransition: vi.fn(),
  })),
}))

vi.mock('@/context/LangContext', () => ({
  useLang: vi.fn(() => ({
    lang: 'es',
    t: (k: string) => k,
    toggleLang: vi.fn(),
  })),
}))

const addNoteFn = vi.fn()
vi.mock('@/context/NoteContext', () => ({
  useNote: vi.fn(() => ({ noteCount: 0, addNote: addNoteFn })),
}))

// Framer Motion: keep simple passthrough
vi.mock('framer-motion', () => ({
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  motion: {
    div: ({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) => (
      <div style={style}>{children}</div>
    ),
  },
}))

describe('Chapter4 — ContactOverlay', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders "CHAPTER IV" label when currentChapter is 4', () => {
    render(<ContactOverlay />)
    expect(screen.getByText('CHAPTER IV')).toBeInTheDocument()
  })

  it('calls addNote when a note is submitted with text', () => {
    render(<ContactOverlay />)
    const input = screen.getByPlaceholderText('ch4.placeholder')
    fireEvent.change(input, { target: { value: 'Hola mundo' } })
    fireEvent.click(screen.getByRole('button', { name: '→' }))
    expect(addNoteFn).toHaveBeenCalledTimes(1)
  })
})

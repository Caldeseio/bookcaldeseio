import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/context/ChapterContext', () => ({ useChapter: vi.fn() }))
vi.mock('@/context/LangContext',    () => ({ useLang:   vi.fn() }))
vi.mock('@/context/NoteContext',    () => ({ useNote:   vi.fn() }))

import { useChapter } from '@/context/ChapterContext'
import { useLang }    from '@/context/LangContext'
import { useNote }    from '@/context/NoteContext'
import Contact6Overlay from '../Contact6Overlay'

const mockUseChapter = useChapter as ReturnType<typeof vi.fn>
const mockUseLang    = useLang    as ReturnType<typeof vi.fn>
const mockUseNote    = useNote    as ReturnType<typeof vi.fn>

beforeEach(() => {
  mockUseChapter.mockReturnValue({ currentChapter: 6 })
  mockUseLang.mockReturnValue({ lang: 'es', t: (k: string) => k })
  mockUseNote.mockReturnValue({ addNote: vi.fn(), noteCount: 0 })
})

describe('Contact6Overlay', () => {
  it('does not render chapter label when currentChapter is not 6', () => {
    mockUseChapter.mockReturnValue({ currentChapter: 5 })
    render(<Contact6Overlay />)
    expect(screen.queryByText('Chapter VI')).toBeNull()
  })

  it('renders contact section when currentChapter is 6', () => {
    render(<Contact6Overlay />)
    expect(screen.getByText('Chapter VI')).toBeInTheDocument()
  })

  it('calls addNote when input has text and submit is clicked', () => {
    const addNote = vi.fn()
    mockUseNote.mockReturnValue({ addNote, noteCount: 0 })
    render(<Contact6Overlay />)
    fireEvent.change(screen.getByPlaceholderText('ch6.placeholder'), { target: { value: 'hola' } })
    fireEvent.click(screen.getByRole('button', { name: '→' }))
    expect(addNote).toHaveBeenCalledTimes(1)
  })

  it('clears input value after submit', () => {
    render(<Contact6Overlay />)
    const input = screen.getByPlaceholderText('ch6.placeholder') as HTMLInputElement
    fireEvent.change(input, { target: { value: 'test note' } })
    fireEvent.click(screen.getByRole('button', { name: '→' }))
    expect(input.value).toBe('')
  })
})

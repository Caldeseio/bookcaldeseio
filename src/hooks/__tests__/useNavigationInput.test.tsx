import { render, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useNavigationInput } from '../useNavigationInput'
import { ChapterProvider, useChapter } from '@/context/ChapterContext'

// Probe: renders nothing, just activates the hook and exposes navigateTo calls
const navigateSpy = vi.fn()

vi.mock('@/context/ChapterContext', async () => {
  const actual = await vi.importActual<typeof import('@/context/ChapterContext')>('@/context/ChapterContext')
  return {
    ...actual,
    useChapter: vi.fn(() => ({
      currentChapter: 1,
      isTransitioning: false,
      navigateTo: navigateSpy,
      pendingChapter: null,
      completeTransition: vi.fn(),
    })),
  }
})

function Probe() {
  useNavigationInput()
  return null
}

describe('useNavigationInput', () => {
  beforeEach(() => { navigateSpy.mockClear() })

  it('ArrowRight fires navigateTo(2) when on chapter 1', () => {
    render(<ChapterProvider><Probe /></ChapterProvider>)
    act(() => { window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true })) })
    expect(navigateSpy).toHaveBeenCalledWith(2)
  })

  it('ArrowLeft does not navigate when on chapter 1 (min boundary)', () => {
    render(<ChapterProvider><Probe /></ChapterProvider>)
    act(() => { window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true })) })
    expect(navigateSpy).not.toHaveBeenCalled()
  })

  it('does not navigate when chapter is 0 (book intro)', async () => {
    const { useChapter: mockedUseChapter } = await import('@/context/ChapterContext')
    ;(mockedUseChapter as ReturnType<typeof vi.fn>).mockReturnValueOnce({
      currentChapter: 0, isTransitioning: false, navigateTo: navigateSpy,
      pendingChapter: null, completeTransition: vi.fn(),
    })
    render(<ChapterProvider><Probe /></ChapterProvider>)
    act(() => { window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true })) })
    expect(navigateSpy).not.toHaveBeenCalled()
  })

  it('does not navigate when isTransitioning is true', async () => {
    const { useChapter: mockedUseChapter } = await import('@/context/ChapterContext')
    ;(mockedUseChapter as ReturnType<typeof vi.fn>).mockReturnValueOnce({
      currentChapter: 1, isTransitioning: true, navigateTo: navigateSpy,
      pendingChapter: null, completeTransition: vi.fn(),
    })
    render(<ChapterProvider><Probe /></ChapterProvider>)
    act(() => { window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true })) })
    expect(navigateSpy).not.toHaveBeenCalled()
  })
})

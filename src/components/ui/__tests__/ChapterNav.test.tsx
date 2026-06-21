import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import ChapterNav from '../ChapterNav'

let navigateToFn = vi.fn()
let mockUseChapter = vi.fn()

vi.mock('@/context/ChapterContext', () => ({
  useChapter: () => mockUseChapter(),
}))

describe('ChapterNav', () => {
  beforeEach(() => {
    navigateToFn = vi.fn()
    mockUseChapter.mockReturnValue({
      currentChapter: 0,
      navigateTo: navigateToFn,
      isTransitioning: false,
    })
  })

  it('renders 5 tabs', () => {
    render(<ChapterNav />)
    expect(screen.getByText('COVER')).toBeTruthy()
    expect(screen.getByText('I')).toBeTruthy()
    expect(screen.getByText('II')).toBeTruthy()
    expect(screen.getByText('III')).toBeTruthy()
    expect(screen.getByText('IV')).toBeTruthy()
  })

  it('clicking a tab calls navigateTo', () => {
    render(<ChapterNav />)
    fireEvent.click(screen.getByText('I'))
    expect(navigateToFn).toHaveBeenCalledWith(1)
  })

  it('does not navigate when transitioning', () => {
    mockUseChapter.mockReturnValue({
      currentChapter: 0,
      navigateTo: navigateToFn,
      isTransitioning: true,
    })
    render(<ChapterNav />)
    fireEvent.click(screen.getByText('II'))
    expect(navigateToFn).not.toHaveBeenCalled()
  })

  it('active tab has white background style', () => {
    mockUseChapter.mockReturnValue({
      currentChapter: 2,
      navigateTo: navigateToFn,
      isTransitioning: false,
    })
    render(<ChapterNav />)
    const activeBtn = screen.getByText('II')
    expect(activeBtn.style.background).toContain('255')
    expect(activeBtn.style.background).toContain('0.88')
  })
})

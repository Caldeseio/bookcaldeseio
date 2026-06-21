import { render } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import ChapterTransitionSequence from '../ChapterTransitionSequence'

const completeTransition = vi.fn()

vi.mock('@/context/ChapterContext', () => ({
  useChapter: vi.fn(() => ({ completeTransition }))
}))

describe('ChapterTransitionSequence', () => {
  it('calls completeTransition immediately on mount', () => {
    render(<ChapterTransitionSequence />)
    expect(completeTransition).toHaveBeenCalledTimes(1)
  })

  it('renders nothing (returns null)', () => {
    const { container } = render(<ChapterTransitionSequence />)
    expect(container.firstChild).toBeNull()
  })
})

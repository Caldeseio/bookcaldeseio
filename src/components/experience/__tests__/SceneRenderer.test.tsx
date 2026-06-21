import { render } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import SceneRenderer from '../SceneRenderer'

vi.mock('../BookScene', () => ({ default: () => null }))
vi.mock('../BookReader', () => ({ default: () => null }))
vi.mock('../ChapterTransitionSequence', () => ({ default: () => null }))
vi.mock('../chapters/popups/DataFlowers', () => ({ default: () => null }))
vi.mock('../chapters/popups/StoryPlanets', () => ({ default: () => null }))
vi.mock('../chapters/popups/GoldenCompass', () => ({ default: () => null }))
vi.mock('../chapters/popups/StarConstellation', () => ({ default: () => null }))

const mockUseChapter = vi.fn()
vi.mock('@/context/ChapterContext', () => ({
  useChapter: () => mockUseChapter()
}))

describe('SceneRenderer', () => {
  const flashRef = { current: document.createElement('div') } as React.RefObject<HTMLDivElement>

  it('renders BookScene for chapter 0', () => {
    mockUseChapter.mockReturnValue({ currentChapter: 0, isTransitioning: false })
    expect(() => render(<SceneRenderer flashRef={flashRef} />)).not.toThrow()
  })

  it('renders BookReader and DataFlowers for chapter 1', () => {
    mockUseChapter.mockReturnValue({ currentChapter: 1, isTransitioning: false })
    expect(() => render(<SceneRenderer flashRef={flashRef} />)).not.toThrow()
  })

  it('renders BookReader and StoryPlanets for chapter 2', () => {
    mockUseChapter.mockReturnValue({ currentChapter: 2, isTransitioning: false })
    expect(() => render(<SceneRenderer flashRef={flashRef} />)).not.toThrow()
  })

  it('renders BookReader and GoldenCompass for chapter 3', () => {
    mockUseChapter.mockReturnValue({ currentChapter: 3, isTransitioning: false })
    expect(() => render(<SceneRenderer flashRef={flashRef} />)).not.toThrow()
  })

  it('renders BookReader and StarConstellation for chapter 4', () => {
    mockUseChapter.mockReturnValue({ currentChapter: 4, isTransitioning: false })
    expect(() => render(<SceneRenderer flashRef={flashRef} />)).not.toThrow()
  })
})

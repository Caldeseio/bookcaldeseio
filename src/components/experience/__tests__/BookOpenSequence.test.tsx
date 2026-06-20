import { render } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import BookOpenSequence from '../BookOpenSequence'

vi.mock('@react-three/fiber', () => ({
  useThree: vi.fn(() => ({
    camera: { position: {}, rotation: {} }
  })),
}))

const timelineInstance = { to: vi.fn(), fromTo: vi.fn(), call: vi.fn(), kill: vi.fn() }
vi.mock('gsap', () => ({
  default: {
    timeline: vi.fn(() => timelineInstance),
    killTweensOf: vi.fn(),
  }
}))

vi.mock('@/context/ChapterContext', () => ({
  useChapter: vi.fn(() => ({ completeTransition: vi.fn() }))
}))

describe('BookOpenSequence', () => {
  const flashRef = { current: document.createElement('div') }

  beforeEach(() => { vi.clearAllMocks() })

  it('does not create GSAP timeline when shouldPlay is false', async () => {
    const gsap = (await import('gsap')).default
    render(<BookOpenSequence flashRef={flashRef} shouldPlay={false} />)
    expect(gsap.timeline).not.toHaveBeenCalled()
  })

  it('creates GSAP timeline when shouldPlay is true', async () => {
    const gsap = (await import('gsap')).default
    render(<BookOpenSequence flashRef={flashRef} shouldPlay={true} />)
    expect(gsap.timeline).toHaveBeenCalled()
  })
})

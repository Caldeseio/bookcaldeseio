import { render } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import ChapterTransitionSequence from '../ChapterTransitionSequence'

vi.mock('@react-three/fiber', () => ({
  useThree: vi.fn(() => ({
    camera: { position: { z: 8 } }
  })),
}))

const toFn = vi.fn()
const callFn = vi.fn()
vi.mock('gsap', () => ({
  default: {
    timeline: vi.fn(() => ({ to: toFn, call: callFn, kill: vi.fn() })),
    killTweensOf: vi.fn(),
  }
}))

vi.mock('@/context/ChapterContext', () => ({
  useChapter: vi.fn(() => ({ completeTransition: vi.fn() }))
}))

describe('ChapterTransitionSequence', () => {
  const flashRef = { current: document.createElement('div') }

  beforeEach(() => { vi.clearAllMocks() })

  it('does not tween camera.position (flash-only transition)', () => {
    render(<ChapterTransitionSequence flashRef={flashRef} />)
    // toFn should only be called with the flash element, never camera.position
    const allTargets = toFn.mock.calls.map(([target]: [unknown]) => target)
    expect(allTargets).not.toContain(expect.objectContaining({ z: 8 }))
  })
})

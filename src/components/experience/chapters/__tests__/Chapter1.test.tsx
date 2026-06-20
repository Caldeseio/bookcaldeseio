import { render } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import Chapter1 from '../Chapter1'

vi.mock('@react-three/fiber', () => ({
  useFrame: vi.fn(),
  useThree: vi.fn(() => ({
    camera: {
      position: { set: vi.fn(), z: 9 },
      rotation: { set: vi.fn() },
    },
  })),
}))

vi.mock('gsap', () => ({
  default: {
    to: vi.fn(() => ({ kill: vi.fn() })),
    killTweensOf: vi.fn(),
    timeline: vi.fn(() => ({ to: vi.fn(), kill: vi.fn() })),
  },
}))

// Mock THREE constructors that require WebGL or canvas
vi.mock('three', async () => {
  const actual = await vi.importActual<typeof import('three')>('three')

  class MockCanvasTexture {
    dispose = vi.fn()
    needsUpdate = false
    uuid = 'mock-texture'
  }

  return { ...actual, CanvasTexture: MockCanvasTexture }
})

import gsap from 'gsap'

describe('Chapter1', () => {
  let flashEl: HTMLDivElement
  const gsapToFn = vi.mocked(gsap.to)

  beforeEach(() => {
    vi.clearAllMocks()
    flashEl = document.createElement('div')
    flashEl.dataset.flash = ''
    document.body.appendChild(flashEl)
    gsapToFn.mockReturnValue({ kill: vi.fn() } as ReturnType<typeof gsap.to>)
  })

  afterEach(() => {
    document.body.removeChild(flashEl)
  })

  it('renders without throwing', () => {
    expect(() => render(<Chapter1 />)).not.toThrow()
  })

  it('triggers flash fade-out via gsap.to on mount', () => {
    render(<Chapter1 />)
    const calls = gsapToFn.mock.calls
    const flashCall = calls.find(([target, props]) =>
      target === flashEl && (props as Record<string, unknown>).opacity === 0
    )
    expect(flashCall).toBeDefined()
  })

  it('kills camera tween on unmount', () => {
    const killFn = vi.fn()
    gsapToFn.mockReturnValue({ kill: killFn } as ReturnType<typeof gsap.to>)
    const { unmount } = render(<Chapter1 />)
    unmount()
    expect(killFn).toHaveBeenCalled()
  })
})

import { render } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import Chapter3 from '../Chapter3'

vi.mock('@react-three/fiber', () => ({
  useFrame: vi.fn(),
  useThree: vi.fn(() => ({
    camera: {
      position: { set: vi.fn(), x: -2, y: 5, z: 9 },
      rotation: { set: vi.fn() },
    },
  })),
}))

vi.mock('gsap', () => ({
  default: {
    to: vi.fn(() => ({ kill: vi.fn() })),
    killTweensOf: vi.fn(),
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

  class MockBufferGeometry {
    setAttribute = vi.fn()
    dispose = vi.fn()
    attributes = { position: { needsUpdate: false, array: new Float32Array(0) } }
  }

  class MockFloat32BufferAttribute {
    constructor(_array: ArrayLike<number>, _itemSize: number) {}
  }

  return {
    ...actual,
    CanvasTexture: MockCanvasTexture,
    BufferGeometry: MockBufferGeometry,
    Float32BufferAttribute: MockFloat32BufferAttribute,
  }
})

import gsap from 'gsap'

// Stub canvas 2d context methods missing in jsdom
const originalGetContext = HTMLCanvasElement.prototype.getContext
beforeEach(() => {
  // @ts-expect-error patching jsdom canvas
  HTMLCanvasElement.prototype.getContext = () => ({
    fillRect: vi.fn(),
    strokeRect: vi.fn(),
    fillText: vi.fn(),
    strokeText: vi.fn(),
    measureText: vi.fn(() => ({ width: 0 })),
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    stroke: vi.fn(),
    fill: vi.fn(),
    clearRect: vi.fn(),
    arc: vi.fn(),
    save: vi.fn(),
    restore: vi.fn(),
    set fillStyle(_v: string) {},
    set strokeStyle(_v: string) {},
    set lineWidth(_v: number) {},
    set font(_v: string) {},
    set textAlign(_v: string) {},
    set textBaseline(_v: string) {},
  })
})
afterEach(() => {
  HTMLCanvasElement.prototype.getContext = originalGetContext
})

describe('Chapter3', () => {
  let flashEl: HTMLDivElement
  const gsapToFn = vi.mocked(gsap.to)

  beforeEach(async () => {
    vi.clearAllMocks()
    gsapToFn.mockReturnValue({ kill: vi.fn() } as ReturnType<typeof gsap.to>)
    flashEl = document.createElement('div')
    flashEl.dataset.flash = ''
    document.body.appendChild(flashEl)
  })

  afterEach(() => {
    document.body.removeChild(flashEl)
  })

  it('renders without throwing', () => {
    expect(() => render(<Chapter3 />)).not.toThrow()
  })

  it('triggers flash fade-out on mount', async () => {
    render(<Chapter3 />)
    const calls = gsapToFn.mock.calls
    const flashCall = calls.find(([target, props]) =>
      target === flashEl && (props as Record<string, unknown>).opacity === 0
    )
    expect(flashCall).toBeDefined()
  })

  it('kills camera tween on unmount', () => {
    const killFn = vi.fn()
    gsapToFn.mockReturnValue({ kill: killFn } as ReturnType<typeof gsap.to>)
    const { unmount } = render(<Chapter3 />)
    unmount()
    expect(killFn).toHaveBeenCalled()
  })
})

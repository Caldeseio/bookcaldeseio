import { render } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import Chapter2 from '../Chapter2'

vi.mock('@react-three/fiber', () => ({
  useFrame: vi.fn(),
  useThree: vi.fn(() => ({
    camera: {
      position: { set: vi.fn(), x: 2, y: 5, z: 9 },
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

const selectProjectFn = vi.fn()
vi.mock('@/context/ProjectContext', () => ({
  useProject: vi.fn(() => ({ selectedProject: null, selectProject: selectProjectFn })),
}))

vi.mock('@/data/projects', () => ({
  PROJECTS: [
    { id: 1, titleKey: 'proj.1.title', descKey: 'proj.1.desc', tech: ['PHP', 'Laravel'] }
  ],
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

describe('Chapter2', () => {
  const gsapToFn = vi.mocked(gsap.to)

  beforeEach(() => {
    vi.clearAllMocks()
    gsapToFn.mockReturnValue({ kill: vi.fn() } as ReturnType<typeof gsap.to>)
  })

  it('renders without throwing', () => {
    expect(() => render(<Chapter2 />)).not.toThrow()
  })

  it('calls selectProject(null) on unmount', () => {
    const { unmount } = render(<Chapter2 />)
    unmount()
    expect(selectProjectFn).toHaveBeenCalledWith(null)
  })

  it('kills camera tween on unmount', () => {
    const killFn = vi.fn()
    gsapToFn.mockReturnValue({ kill: killFn } as ReturnType<typeof gsap.to>)
    const { unmount } = render(<Chapter2 />)
    unmount()
    expect(killFn).toHaveBeenCalled()
  })
})

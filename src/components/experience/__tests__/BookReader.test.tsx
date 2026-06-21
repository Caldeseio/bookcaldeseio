import { render } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import BookReader from '../BookReader'

// Mock all draw functions (return empty canvas)
vi.mock('@/utils/bookPageTextures', () => ({
  drawCover:      vi.fn(() => document.createElement('canvas')),
  drawBackCover:  vi.fn(() => document.createElement('canvas')),
  drawCh1Left:    vi.fn(() => document.createElement('canvas')),
  drawCh1Right:   vi.fn(() => document.createElement('canvas')),
  drawCh2Left:    vi.fn(() => document.createElement('canvas')),
  drawCh2Right:   vi.fn(() => document.createElement('canvas')),
  drawCh3Left:    vi.fn(() => document.createElement('canvas')),
  drawCh3Right:   vi.fn(() => document.createElement('canvas')),
  drawCh4Left:    vi.fn(() => document.createElement('canvas')),
  drawCh4Right:   vi.fn(() => document.createElement('canvas')),
}))

vi.mock('@react-three/fiber', () => ({
  useFrame: vi.fn(),
  useThree: vi.fn(() => ({ camera: { position: { set: vi.fn() }, rotation: { set: vi.fn() } } })),
}))

vi.mock('@react-three/drei', () => ({
  useCursor: vi.fn(),
}))

const navigateToFn = vi.fn()
vi.mock('@/context/ChapterContext', () => ({
  useChapter: vi.fn(() => ({
    currentChapter: 1,
    navigateTo: navigateToFn,
    isTransitioning: false,
    completeTransition: vi.fn(),
    pendingChapter: null,
  })),
}))

// THREE mocks
vi.mock('three', async () => {
  const actual = await vi.importActual('three') as typeof import('three')
  const disposeFn = vi.fn()
  class MockCanvasTexture { dispose = disposeFn }
  class MockBone {
    position = { x: 0 }
    rotation = { y: 0, x: 0 }
    add = vi.fn()
  }
  class MockSkeleton { bones: MockBone[] = [] }
  class MockSkinnedMesh {
    castShadow = false
    receiveShadow = false
    frustumCulled = true
    material: unknown[] = []
    add = vi.fn()
    bind = vi.fn()
    skeleton = new MockSkeleton()
  }
  class MockMeshStandardMaterial { dispose = disposeFn; map: unknown = null }
  class MockBufferGeometry {
    attributes: Record<string, unknown> = {}
    translate = vi.fn()
    setAttribute = vi.fn()
    dispose = vi.fn()
  }
  return {
    ...actual,
    CanvasTexture: MockCanvasTexture,
    Bone: MockBone,
    Skeleton: MockSkeleton,
    SkinnedMesh: MockSkinnedMesh,
    MeshStandardMaterial: MockMeshStandardMaterial,
    BoxGeometry: actual.BoxGeometry,
    Float32BufferAttribute: actual.Float32BufferAttribute,
    Uint16BufferAttribute: actual.Uint16BufferAttribute,
    Vector3: actual.Vector3,
    MathUtils: actual.MathUtils,
  }
})

describe('BookReader', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('renders without throwing', () => {
    expect(() => render(<BookReader />)).not.toThrow()
  })
})

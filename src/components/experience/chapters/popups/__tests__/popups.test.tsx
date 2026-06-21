import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render } from '@testing-library/react'
import DataFlowers from '../DataFlowers'
import StoryPlanets from '../StoryPlanets'
import GoldenCompass from '../GoldenCompass'
import StarConstellation from '../StarConstellation'

// Mock R3F
vi.mock('@react-three/fiber', () => ({
  useFrame: vi.fn(),
}))

// Hoist mockGsap so it's available inside the vi.mock factory
const mockGsap = vi.hoisted(() => ({
  to: vi.fn(() => ({ kill: vi.fn() })),
  killTweensOf: vi.fn(),
}))
vi.mock('gsap', () => ({ default: mockGsap }))

// Mock THREE — replace constructors used by popups with safe stubs
vi.mock('three', async () => {
  const actual = await vi.importActual('three') as typeof import('three')
  const disposeFn = vi.fn()

  const makeVec3 = () => ({ x: 0, y: 0, z: 0, set: vi.fn(), setScalar: vi.fn() })
  const makeEuler = () => ({ x: 0, y: 0, z: 0, set: vi.fn() })

  class MockGeometry {
    dispose = disposeFn
    setAttribute = vi.fn()
    attributes = { morphAttributes: {} }
    morphAttributes = {}
  }

  class MockMaterial {
    dispose = disposeFn
    emissiveIntensity = 0
    opacity = 1
    needsUpdate = false
  }

  class MockMesh {
    geometry: MockGeometry
    material: MockMaterial
    position = makeVec3()
    scale = makeVec3()
    rotation = makeEuler()
    constructor(geo?: MockGeometry, mat?: MockMaterial) {
      this.geometry = geo ?? new MockGeometry()
      this.material = mat ?? new MockMaterial()
    }
  }

  class MockGroup {
    position = makeVec3()
    scale = makeVec3()
    rotation = makeEuler()
    children: unknown[] = []
    add = vi.fn()
    remove = vi.fn()
  }

  class MockBufferGeometry {
    dispose = disposeFn
    setAttribute = vi.fn()
    attributes = { morphAttributes: {} }
    morphAttributes = {}
  }

  class MockLineSegments {
    geometry: MockBufferGeometry
    material: MockMaterial
    constructor(geo?: MockBufferGeometry, mat?: MockMaterial) {
      this.geometry = geo ?? new MockBufferGeometry()
      this.material = mat ?? new MockMaterial()
    }
  }

  return {
    ...actual,
    CylinderGeometry: MockGeometry,
    SphereGeometry: MockGeometry,
    BoxGeometry: MockGeometry,
    BufferGeometry: MockBufferGeometry,
    MeshToonMaterial: MockMaterial,
    MeshStandardMaterial: MockMaterial,
    LineBasicMaterial: MockMaterial,
    Float32BufferAttribute: actual.Float32BufferAttribute,
    // Override Mesh and Group so their constructors don't touch WebGL internals
    Mesh: MockMesh,
    Group: MockGroup,
    LineSegments: MockLineSegments,
    Color: actual.Color,
    Object3D: actual.Object3D,
  }
})

describe('Popup components', () => {
  beforeEach(() => vi.clearAllMocks())

  const components = [
    ['DataFlowers', DataFlowers],
    ['StoryPlanets', StoryPlanets],
    ['GoldenCompass', GoldenCompass],
    ['StarConstellation', StarConstellation],
  ] as const

  it.each(components)('%s renders without throwing', (_, Component) => {
    expect(() => render(<Component />)).not.toThrow()
  })

  it.each(components)('%s calls gsap.to on mount', (_, Component) => {
    render(<Component />)
    expect(mockGsap.to).toHaveBeenCalled()
  })
})

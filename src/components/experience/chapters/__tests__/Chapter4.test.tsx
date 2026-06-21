import { render, fireEvent, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import Chapter4 from '../Chapter4'

vi.mock('@react-three/fiber', () => ({
  useFrame: vi.fn(),
  useThree: vi.fn(() => ({
    camera: {
      position: { set: vi.fn(), y: 5, z: 9 },
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

vi.mock('@/context/ChapterContext', () => ({
  useChapter: vi.fn(() => ({
    currentChapter: 4,
    isTransitioning: false,
    navigateTo: vi.fn(),
    pendingChapter: null,
    completeTransition: vi.fn(),
  })),
}))

vi.mock('@/context/LangContext', () => ({
  useLang: vi.fn(() => ({
    lang: 'es',
    t: (k: string) => k,
    toggleLang: vi.fn(),
  })),
}))

const addNoteFn = vi.fn()
vi.mock('@/context/NoteContext', () => ({
  useNote: vi.fn(() => ({ noteCount: 0, addNote: addNoteFn })),
}))

// Framer Motion: keep simple passthrough
vi.mock('framer-motion', () => ({
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  motion: {
    div: ({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) => (
      <div style={style}>{children}</div>
    ),
  },
}))

// Mock THREE constructors that require WebGL or canvas
vi.mock('three', async () => {
  const actual = await vi.importActual<typeof import('three')>('three')

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
    BufferGeometry: MockBufferGeometry,
    Float32BufferAttribute: MockFloat32BufferAttribute,
  }
})

import gsap from 'gsap'

describe('Chapter4', () => {
  beforeEach(async () => {
    vi.clearAllMocks()
    const gsapMod = (await import('gsap')).default
    vi.mocked(gsapMod.to).mockReturnValue({ kill: vi.fn() } as any)
  })

  it('renders without throwing', () => {
    expect(() => render(<Chapter4 />)).not.toThrow()
  })

  it('renders "CHAPTER IV" label when currentChapter is 4', () => {
    render(<Chapter4 />)
    expect(screen.getByText('CHAPTER IV')).toBeInTheDocument()
  })

  it('calls addNote when a note is submitted with text', () => {
    render(<Chapter4 />)
    const input = screen.getByPlaceholderText('ch4.placeholder')
    fireEvent.change(input, { target: { value: 'Hola mundo' } })
    fireEvent.click(screen.getByRole('button', { name: '→' }))
    expect(addNoteFn).toHaveBeenCalledTimes(1)
  })

  it('kills camera tween on unmount', async () => {
    const gsapMod = (await import('gsap')).default
    const killFn = vi.fn()
    vi.mocked(gsapMod.to).mockReturnValue({ kill: killFn } as any)
    const { unmount } = render(<Chapter4 />)
    unmount()
    expect(killFn).toHaveBeenCalled()
  })
})

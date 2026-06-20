import { render } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import OpenBook from '../OpenBook'

vi.mock('@react-three/fiber', () => ({
  useFrame: vi.fn(),
  useThree: vi.fn(() => ({
    camera: { position: { set: vi.fn() }, rotation: { set: vi.fn() } }
  })),
}))

describe('OpenBook', () => {
  it('renders without throwing', () => {
    expect(() => render(<OpenBook />)).not.toThrow()
  })
})

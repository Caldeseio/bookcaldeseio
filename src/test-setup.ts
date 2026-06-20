import '@testing-library/jest-dom'
import { vi } from 'vitest'

global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
}

HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue({
  fillRect: vi.fn(),
  fillStyle: '',
  strokeStyle: '',
  lineWidth: 0,
  beginPath: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  stroke: vi.fn(),
  fillText: vi.fn(),
  font: '',
  textAlign: '',
  textBaseline: '',
  save: vi.fn(),
  restore: vi.fn(),
  globalAlpha: 1,
  translate: vi.fn(),
  rotate: vi.fn(),
  clearRect: vi.fn(),
  arc: vi.fn(),
  closePath: vi.fn(),
  measureText: vi.fn(() => ({ width: 100 })),
}) as unknown as typeof HTMLCanvasElement.prototype.getContext

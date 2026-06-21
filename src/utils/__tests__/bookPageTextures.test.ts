import { describe, it, expect } from 'vitest'
import {
  drawCover, drawBackCover,
  drawCh1Left, drawCh1Right,
  drawCh2Left, drawCh2Right,
  drawCh3Left, drawCh3Right,
  drawCh4Left, drawCh4Right,
} from '../bookPageTextures'

const ALL = [
  drawCover, drawBackCover,
  drawCh1Left, drawCh1Right,
  drawCh2Left, drawCh2Right,
  drawCh3Left, drawCh3Right,
  drawCh4Left, drawCh4Right,
]

describe('bookPageTextures', () => {
  it.each(ALL.map((fn, i) => [fn.name, fn]))(
    '%s returns a 512×683 HTMLCanvasElement without throwing',
    (_, fn) => {
      const canvas = fn()
      expect(canvas).toBeInstanceOf(HTMLCanvasElement)
      expect(canvas.width).toBe(512)
      expect(canvas.height).toBe(683)
    }
  )
})

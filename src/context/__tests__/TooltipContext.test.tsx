import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { TooltipProvider, useTooltip } from '../TooltipContext'

describe('TooltipContext', () => {
  it('starts with tooltip null', () => {
    const { result } = renderHook(() => useTooltip(), { wrapper: TooltipProvider })
    expect(result.current.tooltip).toBeNull()
  })

  it('showTooltip sets full tooltip state', () => {
    const { result } = renderHook(() => useTooltip(), { wrapper: TooltipProvider })
    act(() => result.current.showTooltip('PHP', 92, 'Advanced', 100, 200))
    expect(result.current.tooltip).toEqual({ skill: 'PHP', level: 92, mastery: 'Advanced', x: 100, y: 200 })
  })

  it('hideTooltip clears tooltip to null', () => {
    const { result } = renderHook(() => useTooltip(), { wrapper: TooltipProvider })
    act(() => result.current.showTooltip('PHP', 92, 'Advanced', 100, 200))
    act(() => result.current.hideTooltip())
    expect(result.current.tooltip).toBeNull()
  })

  it('throws when used outside TooltipProvider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => renderHook(() => useTooltip())).toThrow('useTooltip must be used within TooltipProvider')
    spy.mockRestore()
  })
})

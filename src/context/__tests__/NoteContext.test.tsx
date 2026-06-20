import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { NoteProvider, useNote } from '../NoteContext'

describe('NoteContext', () => {
  it('starts with noteCount 0', () => {
    const { result } = renderHook(() => useNote(), { wrapper: NoteProvider })
    expect(result.current.noteCount).toBe(0)
  })

  it('addNote increments noteCount by 1', () => {
    const { result } = renderHook(() => useNote(), { wrapper: NoteProvider })
    act(() => result.current.addNote())
    expect(result.current.noteCount).toBe(1)
  })

  it('addNote called 3 times produces noteCount 3', () => {
    const { result } = renderHook(() => useNote(), { wrapper: NoteProvider })
    act(() => { result.current.addNote(); result.current.addNote(); result.current.addNote() })
    expect(result.current.noteCount).toBe(3)
  })

  it('throws when used outside NoteProvider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => renderHook(() => useNote())).toThrow('useNote must be used within NoteProvider')
    spy.mockRestore()
  })
})

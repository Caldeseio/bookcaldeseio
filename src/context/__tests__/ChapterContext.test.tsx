import { describe, it, expect } from 'vitest'
import { render, act } from '@testing-library/react'
import { ChapterProvider, useChapter } from '../ChapterContext'

function Probe() {
  const { currentChapter, isTransitioning, navigateTo, completeTransition } = useChapter()
  return (
    <div>
      <span data-testid="ch">{currentChapter}</span>
      <span data-testid="trans">{String(isTransitioning)}</span>
      <button onClick={() => navigateTo(1)}>nav</button>
      <button onClick={completeTransition}>complete</button>
    </div>
  )
}

describe('ChapterContext', () => {
  it('starts at chapter 0, not transitioning', () => {
    const { getByTestId } = render(<ChapterProvider><Probe /></ChapterProvider>)
    expect(getByTestId('ch').textContent).toBe('0')
    expect(getByTestId('trans').textContent).toBe('false')
  })

  it('navigateTo sets isTransitioning true', () => {
    const { getByTestId, getByText } = render(<ChapterProvider><Probe /></ChapterProvider>)
    act(() => getByText('nav').click())
    expect(getByTestId('trans').textContent).toBe('true')
  })

  it('completeTransition finalizes the chapter and clears transitioning', () => {
    const { getByTestId, getByText } = render(<ChapterProvider><Probe /></ChapterProvider>)
    act(() => getByText('nav').click())
    act(() => getByText('complete').click())
    expect(getByTestId('ch').textContent).toBe('1')
    expect(getByTestId('trans').textContent).toBe('false')
  })

  it('navigateTo while transitioning is a no-op', () => {
    function DoubleNav() {
      const { currentChapter, navigateTo } = useChapter()
      return (
        <div>
          <span data-testid="ch">{currentChapter}</span>
          <button onClick={() => { navigateTo(1); navigateTo(3) }}>double</button>
        </div>
      )
    }
    const { getByTestId, getByText } = render(<ChapterProvider><DoubleNav /></ChapterProvider>)
    act(() => getByText('double').click())
    // currentChapter still 0 (transition not completed), pending is 1
    expect(getByTestId('ch').textContent).toBe('0')
  })
})

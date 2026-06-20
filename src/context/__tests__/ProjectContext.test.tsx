import { render, act } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { ProjectProvider, useProject } from '../ProjectContext'
import type { Project } from '@/types'

const mockProject: Project = { id: 1, titleKey: 'proj.1.title', descKey: 'proj.1.desc', tech: ['PHP'] }

function Probe() {
  const { selectedProject, selectProject } = useProject()
  return (
    <div>
      <span data-testid="title">{selectedProject?.titleKey ?? 'none'}</span>
      <button onClick={() => selectProject(mockProject)}>select</button>
      <button onClick={() => selectProject(null)}>clear</button>
    </div>
  )
}

describe('ProjectContext', () => {
  it('starts with no selected project', () => {
    const { getByTestId } = render(<ProjectProvider><Probe /></ProjectProvider>)
    expect(getByTestId('title').textContent).toBe('none')
  })

  it('selectProject sets the selected project', () => {
    const { getByTestId, getByText } = render(<ProjectProvider><Probe /></ProjectProvider>)
    act(() => { getByText('select').click() })
    expect(getByTestId('title').textContent).toBe('proj.1.title')
  })

  it('selectProject(null) clears the project', () => {
    const { getByTestId, getByText } = render(<ProjectProvider><Probe /></ProjectProvider>)
    act(() => { getByText('select').click() })
    act(() => { getByText('clear').click() })
    expect(getByTestId('title').textContent).toBe('none')
  })

  it('throws when useProject is used outside provider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => render(<Probe />)).toThrow('useProject must be used within ProjectProvider')
    spy.mockRestore()
  })
})

import { describe, it, expect } from 'vitest'
import { render, act } from '@testing-library/react'
import { LangProvider, useLang } from '../LangContext'

function Probe() {
  const { lang, toggleLang, t } = useLang()
  return (
    <div>
      <span data-testid="lang">{lang}</span>
      <span data-testid="title">{t('book.title')}</span>
      <span data-testid="missing">{t('no.such.key')}</span>
      <button onClick={toggleLang}>toggle</button>
    </div>
  )
}

describe('LangContext', () => {
  it('defaults to Spanish', () => {
    const { getByTestId } = render(<LangProvider><Probe /></LangProvider>)
    expect(getByTestId('lang').textContent).toBe('es')
  })
  it('t() returns Spanish value', () => {
    const { getByTestId } = render(<LangProvider><Probe /></LangProvider>)
    expect(getByTestId('title').textContent).toBe('THE BOOK OF CALDESEIO')
  })
  it('t() falls back to key when missing', () => {
    const { getByTestId } = render(<LangProvider><Probe /></LangProvider>)
    expect(getByTestId('missing').textContent).toBe('no.such.key')
  })
  it('toggleLang switches to English', () => {
    const { getByTestId, getByText } = render(<LangProvider><Probe /></LangProvider>)
    act(() => getByText('toggle').click())
    expect(getByTestId('lang').textContent).toBe('en')
  })
})

'use client'
import { useLang } from '@/context/LangContext'

export default function LangToggle() {
  const { lang, toggleLang } = useLang()
  return (
    <button onClick={toggleLang} style={{ fontFamily: 'var(--font-code)', fontSize: '11px', letterSpacing: '0.15em', color: '#F1EDE3', background: 'transparent', border: 'none', cursor: 'pointer', padding: '8px 12px' }}>
      <span style={{ opacity: lang === 'es' ? 1 : 0.35 }}>ES</span>
      <span style={{ opacity: 0.35, margin: '0 5px' }}>|</span>
      <span style={{ opacity: lang === 'en' ? 1 : 0.35 }}>EN</span>
    </button>
  )
}

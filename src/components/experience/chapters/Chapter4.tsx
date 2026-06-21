'use client'
import { useRef, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useChapter } from '@/context/ChapterContext'
import { useLang } from '@/context/LangContext'
import { useNote } from '@/context/NoteContext'

// ── Contact overlay panel ─────────────────────────────────────────────────────
const CONTACT_LINKS = [
  { label: 'Email',     value: 'luiscalderontcit@gmail.com',  href: 'mailto:luiscalderontcit@gmail.com' },
  { label: 'LinkedIn',  value: 'linkedin.com/in/caldeseio',   href: 'https://linkedin.com/in/caldeseio' },
  { label: 'GitHub',    value: 'github.com/Caldeseio',        href: 'https://github.com/Caldeseio' },
  { label: 'Instagram', value: '@caldeseio',                   href: 'https://instagram.com/caldeseio' },
]

export function ContactOverlay() {
  const { currentChapter } = useChapter()
  const { t } = useLang()
  const { addNote } = useNote()
  const [input, setInput] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [])

  const handleSubmit = () => {
    if (!input.trim()) return
    addNote()
    setInput('')
    setSubmitted(true)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setSubmitted(false), 2500)
  }

  return (
    <AnimatePresence>
      {currentChapter === 4 && (
        <motion.div
          initial={{ x: 80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 80, opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: 'min(380px, 90vw)',
            height: '100%',
            background: 'rgba(13,26,15,0.85)',
            backdropFilter: 'blur(12px)',
            zIndex: 40,
            display: 'flex',
            flexDirection: 'column',
            padding: '48px 32px',
            gap: 16,
            overflowY: 'auto',
            color: '#F1EDE3',
            fontFamily: 'sans-serif',
          }}
        >
          <div style={{ fontSize: 11, letterSpacing: 4, color: '#C9A84C', fontFamily: 'monospace' }}>
            CHAPTER IV
          </div>

          <h2 style={{ fontSize: 22, fontWeight: 700, margin: 0, lineHeight: 1.3 }}>
            {t('ch4.line1')}
          </h2>
          <p style={{ fontSize: 14, color: '#AFC3B2', margin: 0, lineHeight: 1.6 }}>
            {t('ch4.line2')}
          </p>

          <div style={{ height: 1, background: 'rgba(201,168,76,0.3)', margin: '8px 0' }} />

          {CONTACT_LINKS.map(link => (
            <div key={link.label}>
              <div style={{ fontSize: 10, letterSpacing: 2, color: '#C9A84C', fontFamily: 'monospace', marginBottom: 2 }}>
                {link.label}
              </div>
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#F1EDE3', fontSize: 13, textDecoration: 'none' }}
              >
                {link.value}
              </a>
            </div>
          ))}

          <a
            href="/pdf/CV_Luis_Calderon.pdf"
            download
            style={{
              display: 'inline-block',
              marginTop: 8,
              padding: '10px 20px',
              border: '1px solid #C9A84C',
              color: '#C9A84C',
              fontSize: 12,
              textDecoration: 'none',
              letterSpacing: 2,
              fontFamily: 'monospace',
              alignSelf: 'flex-start',
            }}
          >
            ↓ Descargar CV
          </a>

          <div style={{ height: 1, background: 'rgba(201,168,76,0.3)', margin: '8px 0' }} />
          <div style={{ fontSize: 11, letterSpacing: 3, color: '#C9A84C', fontFamily: 'monospace' }}>
            {t('ch4.cta')} ✧
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleSubmit() }}
              placeholder={t('ch4.placeholder')}
              style={{
                flex: 1,
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(201,168,76,0.35)',
                color: '#F1EDE3',
                padding: '8px 12px',
                fontSize: 13,
                outline: 'none',
                fontFamily: 'sans-serif',
              }}
            />
            <button
              onClick={handleSubmit}
              aria-label={submitted ? '✓' : '→'}
              style={{
                background: submitted ? '#4F9D5B' : 'transparent',
                border: '1px solid #C9A84C',
                color: '#C9A84C',
                padding: '8px 16px',
                cursor: 'pointer',
                fontSize: 16,
                transition: 'background 0.3s',
              }}
            >
              {submitted ? '✓' : '→'}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}


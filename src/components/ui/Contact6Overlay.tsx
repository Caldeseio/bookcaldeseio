'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { useChapter } from '@/context/ChapterContext'
import { useLang } from '@/context/LangContext'
import { useNote } from '@/context/NoteContext'

const CONTACT_LINKS = [
  { label: 'Email',     value: 'luiscalderontcit@gmail.com', href: 'mailto:luiscalderontcit@gmail.com' },
  { label: 'LinkedIn',  value: 'linkedin.com/in/caldeseio',  href: 'https://linkedin.com/in/caldeseio' },
  { label: 'GitHub',    value: 'github.com/Caldeseio',       href: 'https://github.com/Caldeseio' },
  { label: 'Instagram', value: '@caldeseio',                  href: 'https://instagram.com/caldeseio' },
]

export default function Contact6Overlay() {
  const { currentChapter } = useChapter()
  const { t, lang } = useLang()
  const { addNote } = useNote()
  const [input, setInput] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = () => {
    if (!input.trim()) return
    addNote()
    setInput('')
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 2500)
  }

  return (
    <AnimatePresence>
      {currentChapter === 6 && (
        <motion.div
          initial={{ opacity: 0, x: 80 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 80 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
          style={{
            position: 'absolute', top: 0, right: 0,
            width: 'min(380px, 90vw)', height: '100%',
            display: 'flex', flexDirection: 'column', justifyContent: 'center',
            padding: '40px 28px',
            background: 'rgba(13,26,15,0.85)',
            backdropFilter: 'blur(12px)',
            borderLeft: '1px solid rgba(201,168,76,0.2)',
            zIndex: 40, overflowY: 'auto',
          }}
        >
          {/* Chapter label */}
          <p style={{ fontFamily: 'var(--font-code)', fontSize: '10px', color: '#4F9D5B',
            letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '8px' }}>
            Chapter VI
          </p>

          {/* Narrative */}
          <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: '21px', fontWeight: 700,
            color: '#F1EDE3', lineHeight: 1.3, marginBottom: '8px' }}>
            {t('ch6.line1')}
          </h2>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '14px',
            color: 'rgba(241,237,227,0.58)', lineHeight: 1.65, marginBottom: '28px' }}>
            {t('ch6.line2')}
          </p>

          {/* Contact links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0', marginBottom: '28px' }}>
            {CONTACT_LINKS.map(link => (
              <a key={link.label} href={link.href} target="_blank" rel="noreferrer"
                style={{
                  display: 'block', padding: '10px 0',
                  borderBottom: '1px solid rgba(241,237,227,0.07)',
                  textDecoration: 'none',
                }}
                onMouseEnter={e => ((e.currentTarget.querySelector('.link-val') as HTMLElement).style.color = '#C9A84C')}
                onMouseLeave={e => ((e.currentTarget.querySelector('.link-val') as HTMLElement).style.color = 'rgba(241,237,227,0.78)')}
              >
                <div style={{ fontFamily: 'var(--font-code)', fontSize: '9px',
                  color: 'rgba(241,237,227,0.38)', letterSpacing: '0.12em',
                  textTransform: 'uppercase', marginBottom: '2px' }}>
                  {link.label}
                </div>
                <div className="link-val" style={{ fontFamily: 'var(--font-sans)', fontSize: '13px',
                  color: 'rgba(241,237,227,0.78)', transition: 'color 0.2s ease' }}>
                  {link.value}
                </div>
              </a>
            ))}
          </div>

          {/* Download CV */}
          <a href="/pdf/CV_Luis_Calderon.pdf" download
            style={{
              display: 'block', textAlign: 'center', padding: '11px',
              fontFamily: 'var(--font-code)', fontSize: '11px',
              letterSpacing: '0.1em', textTransform: 'uppercase',
              color: '#C9A84C', border: '1px solid #C9A84C', borderRadius: '3px',
              textDecoration: 'none', marginBottom: '28px', transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#C9A84C'; e.currentTarget.style.color = '#1B2B1E' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#C9A84C' }}
          >
            {lang === 'es' ? 'Descargar CV' : 'Download CV'}
          </a>

          {/* Divider + CTA */}
          <div style={{ borderTop: '1px solid rgba(241,237,227,0.1)', paddingTop: '22px', marginBottom: '14px' }}>
            <p style={{ fontFamily: 'var(--font-code)', fontSize: '10px', color: '#C9A84C',
              letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              {t('ch6.cta')} ✧
            </p>
          </div>

          {/* Note input row */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleSubmit() }}
              placeholder={t('ch6.placeholder')}
              maxLength={60}
              aria-label="note input"
              style={{
                flex: 1, background: 'rgba(44,58,46,0.6)',
                border: '1px solid rgba(201,168,76,0.28)', borderRadius: '3px',
                padding: '9px 11px', fontFamily: 'var(--font-code)', fontSize: '12px',
                color: '#F1EDE3', outline: 'none',
              }}
            />
            <button
              onClick={handleSubmit}
              aria-label={submitted ? '✓' : '→'}
              style={{
                padding: '9px 14px', border: 'none', borderRadius: '3px', cursor: 'pointer',
                fontFamily: 'var(--font-code)', fontSize: '13px', fontWeight: 700,
                background: submitted ? '#4F9D5B' : '#C9A84C', color: '#1B2B1E',
                transition: 'background 0.2s ease',
              }}
            >
              {submitted ? '✓' : '→'}
            </button>
          </div>

          {/* Confirmation message */}
          {submitted && (
            <p style={{ fontFamily: 'var(--font-code)', fontSize: '10px', color: '#4F9D5B', marginTop: '8px' }}>
              {lang === 'es' ? 'Tu marca orbita el libro ✦' : 'Your mark orbits the book ✦'}
            </p>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { useChapter } from '@/context/ChapterContext'
import { useLang } from '@/context/LangContext'
import { CHAPTERS } from '@/data/chapters'
import type { ChapterIndex } from '@/types'

export default function ChapterNav() {
  const { currentChapter, navigateTo, isTransitioning } = useChapter()
  const { t } = useLang()
  const [hovered, setHovered] = useState<number | null>(null)

  return (
    <AnimatePresence>
      {currentChapter > 0 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          style={{ position: 'absolute', right: '22px', top: '50%', transform: 'translateY(-50%)', zIndex: 30, display: 'flex', flexDirection: 'column', gap: '14px', alignItems: 'center' }}
        >
          {[1, 2, 3, 4, 5, 6].map(n => {
            const idx = n as ChapterIndex
            const active = currentChapter === idx
            const isImplemented = n <= 6
            return (
              <div key={n} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}
                onMouseEnter={() => setHovered(n)} onMouseLeave={() => setHovered(null)}>
                <AnimatePresence>
                  {hovered === n && (
                    <motion.span
                      initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 6 }}
                      style={{ position: 'absolute', right: '18px', fontFamily: 'var(--font-code)', fontSize: '10px', letterSpacing: '0.08em', color: '#F1EDE3', background: 'rgba(27,43,30,0.92)', padding: '3px 7px', borderRadius: '3px', whiteSpace: 'nowrap' }}
                    >
                      {CHAPTERS[idx].roman} — {t(CHAPTERS[idx].subtitleKey)}
                    </motion.span>
                  )}
                </AnimatePresence>
                <button
                  onClick={() => { if (!isTransitioning && isImplemented) navigateTo(idx) }}
                  aria-label={`Chapter ${CHAPTERS[idx].roman}`}
                  style={{ width: active ? '10px' : '7px', height: active ? '10px' : '7px', borderRadius: '50%', background: active ? '#C9A84C' : 'transparent', border: `1.5px solid ${active ? '#C9A84C' : 'rgba(241,237,227,0.3)'}`, boxShadow: active ? '0 0 8px #C9A84C88' : 'none', cursor: isImplemented ? (isTransitioning ? 'not-allowed' : 'pointer') : 'default', transition: 'all 0.25s ease', padding: 0, opacity: isImplemented ? 1 : 0.3, pointerEvents: isImplemented ? 'auto' : 'none' }}
                />
              </div>
            )
          })}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

'use client'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useLang } from '@/context/LangContext'
import { useChapter } from '@/context/ChapterContext'
import { CHAPTERS } from '@/data/chapters'

export default function NarrativeText() {
  const { t } = useLang()
  const { currentChapter } = useChapter()
  const [visibleCount, setVisibleCount] = useState(0)
  const lines = CHAPTERS[currentChapter]?.narrativeKeys ?? []

  useEffect(() => {
    setVisibleCount(0)
    if (!lines.length) return
    const timers = lines.map((_, i) => setTimeout(() => setVisibleCount(i + 1), 800 + i * 1400))
    return () => timers.forEach(clearTimeout)
  }, [currentChapter, lines.length])

  if (currentChapter === 0 || !lines.length) return null

  return (
    <div style={{ position: 'absolute', bottom: '11%', left: '50%', transform: 'translateX(-50%)', zIndex: 20, textAlign: 'center', maxWidth: '580px', padding: '0 24px' }}>
      {lines.slice(0, visibleCount).map((key, i) => (
        <motion.p key={`${currentChapter}-${i}`} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75, ease: 'easeOut' }}
          style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(15px, 2.2vw, 21px)', color: '#F1EDE3', lineHeight: 1.65, marginBottom: '6px' }}>
          {t(key)}
        </motion.p>
      ))}
    </div>
  )
}

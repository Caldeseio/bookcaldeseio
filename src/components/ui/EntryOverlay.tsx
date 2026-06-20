'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { useLang } from '@/context/LangContext'
import { useChapter } from '@/context/ChapterContext'

export default function EntryOverlay() {
  const { t } = useLang()
  const { currentChapter, isTransitioning } = useChapter()
  const visible = currentChapter === 0 && !isTransitioning

  return (
    <AnimatePresence>
      {visible && (
        <motion.div key="entry" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          style={{ position: 'absolute', bottom: '9%', left: '50%', transform: 'translateX(-50%)', zIndex: 20, textAlign: 'center', pointerEvents: 'none' }}>
          <motion.p animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            style={{ fontFamily: 'var(--font-code)', fontSize: '11px', letterSpacing: '0.28em', color: '#C9A84C' }}>
            {t('book.cta')}
          </motion.p>
          <motion.div animate={{ y: [0, 5, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
            style={{ color: '#C9A84C', fontSize: '13px', marginTop: '6px' }}>↓</motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

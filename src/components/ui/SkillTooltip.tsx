'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { useTooltip } from '@/context/TooltipContext'

const masteryColor = (level: number) =>
  level >= 85 ? '#C9A84C' : level >= 70 ? '#4F9D5B' : '#AFC3B2'

export default function SkillTooltip() {
  const { tooltip } = useTooltip()

  return (
    <AnimatePresence>
      {tooltip && (
        <motion.div
          key={tooltip.skill}
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.92 }}
          transition={{ duration: 0.14, ease: 'easeOut' }}
          style={{
            position: 'fixed',
            left: tooltip.x + 14,
            top: tooltip.y - 10,
            pointerEvents: 'none',
            zIndex: 60,
            background: 'rgba(13,26,15,0.96)',
            border: `1px solid ${masteryColor(tooltip.level)}`,
            borderRadius: '3px',
            padding: '7px 13px',
            whiteSpace: 'nowrap',
            backdropFilter: 'blur(8px)',
          }}
        >
          <div style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '13px',
            fontWeight: 700,
            color: masteryColor(tooltip.level),
            letterSpacing: '0.06em',
          }}>
            {tooltip.skill}
          </div>
          <div style={{
            fontFamily: 'var(--font-code)',
            fontSize: '10px',
            color: 'rgba(241,237,227,0.65)',
            marginTop: '2px',
            letterSpacing: '0.06em',
          }}>
            {tooltip.level}% · {tooltip.mastery}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

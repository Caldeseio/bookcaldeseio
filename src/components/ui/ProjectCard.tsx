'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { useProject } from '@/context/ProjectContext'
import { useLang } from '@/context/LangContext'

export default function ProjectCard() {
  const { selectedProject, selectProject } = useProject()
  const { t } = useLang()

  return (
    <AnimatePresence>
      {selectedProject && (
        <motion.div
          key={selectedProject.id}
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: 'absolute',
            bottom: '10%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 'min(520px, 88vw)',
            background: 'rgba(27,43,30,0.96)',
            border: '1px solid #C9A84C',
            borderRadius: '4px',
            padding: '28px 32px',
            zIndex: 50,
            backdropFilter: 'blur(10px)',
          }}
        >
          {/* Close */}
          <button
            onClick={() => selectProject(null)}
            aria-label="Close project card"
            style={{
              position: 'absolute', top: 12, right: 14,
              background: 'none', border: 'none',
              color: '#C9A84C', cursor: 'pointer',
              fontFamily: 'var(--font-code)', fontSize: '18px', lineHeight: 1,
            }}
          >
            ✕
          </button>

          {/* Title */}
          <h2 style={{
            fontFamily: 'var(--font-sans)', fontSize: '17px', fontWeight: 700,
            color: '#C9A84C', marginBottom: '10px', letterSpacing: '0.05em',
            textTransform: 'uppercase',
          }}>
            {t(selectedProject.titleKey)}
          </h2>

          {/* Description */}
          <p style={{
            fontFamily: 'var(--font-sans)', fontSize: '13px',
            color: 'rgba(241,237,227,0.82)', lineHeight: 1.65, marginBottom: '18px',
          }}>
            {t(selectedProject.descKey)}
          </p>

          {/* Tech badges */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {selectedProject.tech.map(tech => (
              <span key={tech} style={{
                fontFamily: 'var(--font-code)', fontSize: '11px',
                color: '#4F9D5B', border: '1px solid rgba(79,157,91,0.45)',
                padding: '2px 9px', borderRadius: '2px', letterSpacing: '0.07em',
              }}>
                {tech}
              </span>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ExperienceItem } from '../../data/v2/cvData';

interface ProjectDetailModalProps {
  project: ExperienceItem | null;
  lang: 'es' | 'en';
  onClose: () => void;
}

const ML = {
  es: {
    chapter: 'CAPÍTULO III · EL BOSQUE DE PROYECTOS',
    achievements: 'LOGROS',
    stack: 'STACK TECNOLÓGICO',
    viewProject: 'Ver proyecto ↗',
    close: '✕ Cerrar',
  },
  en: {
    chapter: 'CHAPTER III · FOREST OF PROJECTS',
    achievements: 'HIGHLIGHTS',
    stack: 'TECH STACK',
    viewProject: 'View project ↗',
    close: '✕ Close',
  },
} as const;

const parchBg = 'radial-gradient(circle at 30% 40%, #F1E4C0, #D9C293)';
const ink = '#3c3120';
const gold = '#C9A24B';
const goldDark = '#B68A2E';

export default function ProjectDetailModal({ project, lang, onClose }: ProjectDetailModalProps) {
  const L = ML[lang];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <AnimatePresence>
      {project && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.88 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            style={{
              position: 'fixed', inset: 0,
              background: '#060e06',
              zIndex: 50,
              cursor: 'pointer',
            }}
          />

          {/* Modal — giro de página tipo libro */}
          <motion.div
            key="modal"
            initial={{ rotateY: 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: -90, opacity: 0 }}
            transition={{ duration: 0.55, ease: [0.23, 1, 0.32, 1] }}
            style={{
              position: 'fixed', inset: 0,
              zIndex: 51,
              transformOrigin: 'left center',
              perspective: '1200px',
              display: 'flex',
              flexDirection: 'row',
              fontFamily: "'EB Garamond', Georgia, serif",
              background: parchBg,
              overflow: 'hidden',
            }}
          >
            {/* ── Panel izquierdo: imagen o letra inicial ── */}
            <div style={{
              width: '38%',
              flexShrink: 0,
              borderRight: `2px solid ${goldDark}`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'radial-gradient(circle at 50% 50%, #E8D9A8, #C9B878)',
              position: 'relative',
              overflow: 'hidden',
            }}>
              {project.image ? (
                <img
                  src={project.image}
                  alt={project.company}
                  style={{
                    width: '100%', height: '100%',
                    objectFit: 'cover',
                    opacity: 0.85,
                  }}
                />
              ) : (
                <>
                  {/* Decoración de fondo — líneas tipo papel antiguo */}
                  <div style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: `repeating-linear-gradient(transparent, transparent 31px, ${goldDark}33 32px)`,
                    backgroundSize: '100% 32px',
                  }} />
                  {/* Letra inicial estilo drop-cap */}
                  <div style={{
                    position: 'relative',
                    fontSize: 'clamp(80px, 15vw, 160px)',
                    fontFamily: "'Cinzel', serif",
                    fontWeight: 700,
                    color: goldDark,
                    lineHeight: 1,
                    textShadow: `2px 4px 12px ${goldDark}66`,
                    userSelect: 'none',
                  }}>
                    {project.company[0]}
                  </div>
                  <div style={{
                    position: 'relative',
                    marginTop: '16px',
                    fontSize: '11px',
                    fontFamily: "'Cinzel', serif",
                    letterSpacing: '0.3em',
                    color: goldDark,
                    textAlign: 'center',
                    padding: '0 24px',
                  }}>
                    {project.company}
                  </div>
                </>
              )}

              {/* Borde ornamental inferior */}
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                height: '4px',
                background: `linear-gradient(90deg, transparent, ${gold}, transparent)`,
              }} />
            </div>

            {/* ── Panel derecho: contenido ── */}
            <div style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              padding: 'clamp(24px, 4vw, 56px)',
              overflowY: 'auto',
            }}>
              {/* Botón cerrar */}
              <button
                onClick={onClose}
                style={{
                  alignSelf: 'flex-end',
                  background: 'none', border: 'none',
                  color: goldDark, cursor: 'pointer',
                  fontFamily: "'Cinzel', serif",
                  fontSize: '13px', letterSpacing: '0.1em',
                  marginBottom: '8px',
                  padding: '4px 8px',
                }}
              >
                {L.close}
              </button>

              {/* Capítulo */}
              <div style={{
                color: goldDark, fontSize: '10px',
                fontFamily: "'Cinzel', serif",
                letterSpacing: '0.3em', marginBottom: '8px',
              }}>
                {L.chapter}
              </div>

              {/* Empresa */}
              <div style={{
                color: ink, fontSize: 'clamp(22px, 4vw, 36px)',
                fontFamily: "'Cinzel', serif", fontWeight: 700,
                marginBottom: '4px', lineHeight: 1.1,
              }}>
                {project.company}
              </div>

              {/* Rol */}
              <div style={{
                color: ink, fontSize: 'clamp(14px, 2vw, 18px)',
                fontStyle: 'italic', marginBottom: '4px',
              }}>
                {project.role}
              </div>

              {/* Período */}
              <div style={{
                color: goldDark, fontSize: '12px',
                fontFamily: "'Cinzel', serif", letterSpacing: '0.1em',
                marginBottom: '20px',
              }}>
                {project.period}
              </div>

              {/* Divisor dorado */}
              <div style={{
                height: '1px', marginBottom: '20px',
                background: `linear-gradient(90deg, ${gold}, transparent)`,
              }} />

              {/* Logros */}
              <div style={{
                color: goldDark, fontSize: '11px',
                fontFamily: "'Cinzel', serif", letterSpacing: '0.25em',
                marginBottom: '12px',
              }}>
                {L.achievements}
              </div>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none', marginBottom: '24px' }}>
                {project.highlights.map((h, i) => (
                  <li key={i} style={{
                    color: ink, fontSize: 'clamp(13px, 1.6vw, 16px)',
                    lineHeight: 1.6, marginBottom: '10px',
                    paddingLeft: '18px', position: 'relative',
                  }}>
                    <span style={{ position: 'absolute', left: 0, color: gold }}>•</span>
                    {h}
                  </li>
                ))}
              </ul>

              {/* Divisor */}
              <div style={{
                height: '1px', marginBottom: '20px',
                background: `linear-gradient(90deg, ${gold}, transparent)`,
              }} />

              {/* Stack */}
              <div style={{
                color: goldDark, fontSize: '11px',
                fontFamily: "'Cinzel', serif", letterSpacing: '0.25em',
                marginBottom: '12px',
              }}>
                {L.stack}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '28px' }}>
                {project.stack.map((tech, i) => (
                  <span key={i} style={{
                    padding: '4px 12px',
                    border: `1px solid ${goldDark}`,
                    borderRadius: '3px',
                    fontSize: '12px',
                    fontFamily: "'Cinzel', serif",
                    color: ink,
                    background: 'rgba(201,162,75,0.12)',
                    letterSpacing: '0.05em',
                  }}>
                    {tech}
                  </span>
                ))}
              </div>

              {/* Botón ver proyecto */}
              {project.url && (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    alignSelf: 'flex-start',
                    padding: '10px 24px',
                    border: `1px solid ${goldDark}`,
                    borderRadius: '4px',
                    color: ink,
                    fontFamily: "'Cinzel', serif",
                    fontSize: '13px',
                    letterSpacing: '0.1em',
                    textDecoration: 'none',
                    background: 'rgba(201,162,75,0.15)',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(201,162,75,0.30)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'rgba(201,162,75,0.15)')}
                >
                  {L.viewProject}
                </a>
              )}

              {/* Ornamento pie de página */}
              <div style={{
                marginTop: 'auto', paddingTop: '24px',
                fontSize: '11px', fontFamily: "'Cinzel', serif",
                color: `${goldDark}88`, letterSpacing: '0.2em',
                textAlign: 'center',
              }}>
                — LUIS C. —
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

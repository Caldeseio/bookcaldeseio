'use client';

import React, { useRef, useState } from 'react';

interface MobileBookProps {
  cvData: {
    contact: {
      name: string;
      role: string;
      email: string;
      phone: string;
      location: string;
      linkedin: string;
      portfolio: string;
    };
    summary: string;
    experience: Array<{
      company: string;
      role: string;
      period: string;
      highlights: string[];
    }>;
    education: Array<{
      degree: string;
      institution: string;
    }>;
    certifications: string[];
    languages: Array<{ name: string; level: string }>;
    skills: Array<{ name: string; branch: string }>;
  };
}

export default function MobileBook({ cvData }: MobileBookProps) {
  const [displayPage, setDisplayPage] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const TOTAL_PAGES = 7;

  const touchStart = useRef(0);

  const changePage = (newPage: number) => {
    if (newPage === displayPage || newPage < 0 || newPage >= TOTAL_PAGES) return;
    setDirection(newPage > displayPage ? 'left' : 'right');
    setAnimating(true);
    setTimeout(() => {
      setDisplayPage(newPage);
      setAnimating(false);
    }, 280);
  };

  const nextPage = () => changePage(displayPage + 1);
  const prevPage = () => changePage(displayPage - 1);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStart.current - e.changedTouches[0].clientX;
    if (diff > 50) nextPage();
    else if (diff < -50) prevPage();
  };

  const navBtnStyle: React.CSSProperties = {
    padding: '8px 20px',
    background: 'rgba(201,162,75,0.2)',
    border: '1px solid #B68A2E',
    color: '#C9A24B',
    borderRadius: '4px',
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontSize: '14px',
    letterSpacing: '0.05em',
  };

  const bookCardStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: '380px',
    minHeight: '520px',
    borderRadius: '8px',
    boxShadow:
      '0 20px 60px rgba(0,0,0,0.8), 0 0 40px rgba(0,0,0,0.4)',
    overflow: 'hidden',
    position: 'relative',
  };

  const pageAnimStyle: React.CSSProperties = {
    transition: 'opacity 0.28s ease, transform 0.28s ease',
    opacity: animating ? 0 : 1,
    transform: animating
      ? `translateX(${direction === 'left' ? '-16px' : '16px'})`
      : 'translateX(0)',
  };

  const renderPage = (page: number): React.ReactNode => {
    const pageBase: React.CSSProperties = {
      padding: '40px 32px',
      minHeight: '520px',
      display: 'flex',
      flexDirection: 'column',
    };

    switch (page) {
      case 0:
        return (
          <div
            style={{
              ...pageBase,
              background: '#243024',
              border: '2px solid #B68A2E',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                color: '#C9A24B',
                fontSize: '11px',
                letterSpacing: '0.3em',
                marginBottom: '8px',
              }}
            >
              MMXXVI
            </div>
            <div style={{
              width: '80px', height: '80px', borderRadius: '50%',
              border: '10px solid #EDE9DB', borderRightColor: 'transparent',
              margin: '16px auto', position: 'relative',
            }}>
              <div style={{
                position: 'absolute', top: -6, right: -6, width: 18, height: 18,
                borderRadius: '50%', background: '#4A8C5C',
              }} />
            </div>
            <div
              style={{
                color: '#C9A24B',
                fontSize: '28px',
                fontWeight: 700,
                letterSpacing: '0.2em',
              }}
            >
              CALDESEIO
            </div>
            <div
              style={{
                color: 'rgba(201,162,75,0.7)',
                fontSize: '14px',
                fontStyle: 'italic',
                margin: '8px 0 24px',
              }}
            >
              Currículum ilustrado
            </div>
            <div
              style={{
                color: 'rgba(201,162,75,0.5)',
                fontSize: '12px',
                letterSpacing: '0.1em',
              }}
            >
              LUIS CALDERÓN J.
            </div>
            <div
              style={{
                color: 'rgba(201,162,75,0.4)',
                fontSize: '11px',
                marginTop: '40px',
              }}
            >
              ↑↓ Desliza para explorar
            </div>
          </div>
        );

      case 1:
        return (
          <div
            style={{
              ...pageBase,
              background: 'radial-gradient(circle at 40% 40%, #F1E4C0, #D9C293)',
            }}
          >
            <div
              style={{
                color: '#9c7a2a',
                fontSize: '10px',
                letterSpacing: '0.3em',
                marginBottom: '4px',
              }}
            >
              CAPÍTULO I
            </div>
            <div
              style={{
                color: '#3c3120',
                fontSize: '22px',
                fontWeight: 700,
                marginBottom: '20px',
              }}
            >
              Quién soy
            </div>
            <p
              style={{
                color: '#3c3120',
                fontSize: '15px',
                lineHeight: 1.7,
                fontFamily: "'EB Garamond', Georgia, serif",
                margin: 0,
              }}
            >
              {cvData.summary}
            </p>
            <div style={{ marginTop: '20px', color: '#9c7a2a', fontSize: '12px' }}>
              <div>{cvData.contact.location}</div>
              <div>{cvData.contact.email}</div>
            </div>
          </div>
        );

      case 2:
        return (
          <div
            style={{
              ...pageBase,
              background: 'radial-gradient(circle at 40% 40%, #F1E4C0, #D9C293)',
            }}
          >
            <div
              style={{
                color: '#9c7a2a',
                fontSize: '10px',
                letterSpacing: '0.3em',
                marginBottom: '4px',
              }}
            >
              CAPÍTULO II
            </div>
            <div
              style={{
                color: '#3c3120',
                fontSize: '22px',
                fontWeight: 700,
                marginBottom: '16px',
              }}
            >
              Mis herramientas
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '8px',
              }}
            >
              {cvData.skills.slice(0, 10).map(skill => (
                <div
                  key={skill.name}
                  style={{
                    padding: '6px 10px',
                    background:
                      skill.branch === 'data'
                        ? 'rgba(207,224,176,0.6)'
                        : 'rgba(241,228,192,0.8)',
                    border: '1px solid #3A332A',
                    borderRadius: '4px',
                    color: '#3c3120',
                    fontSize: '12px',
                    fontFamily: "'Cinzel', serif",
                  }}
                >
                  {skill.name}
                </div>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div
            style={{
              ...pageBase,
              background: 'radial-gradient(circle at 40% 40%, #F1E4C0, #D9C293)',
            }}
          >
            <div
              style={{
                color: '#9c7a2a',
                fontSize: '10px',
                letterSpacing: '0.3em',
                marginBottom: '4px',
              }}
            >
              CAPÍTULO III
            </div>
            <div
              style={{
                color: '#3c3120',
                fontSize: '22px',
                fontWeight: 700,
                marginBottom: '16px',
              }}
            >
              El bosque de proyectos
            </div>
            {cvData.experience.map((exp, i) => (
              <div
                key={i}
                style={{
                  marginBottom: '16px',
                  paddingBottom: '16px',
                  borderBottom:
                    i < cvData.experience.length - 1
                      ? '1px dotted #B68A2E'
                      : 'none',
                }}
              >
                <div
                  style={{
                    color: '#3c3120',
                    fontWeight: 700,
                    fontSize: '14px',
                  }}
                >
                  {exp.company}
                </div>
                <div
                  style={{
                    color: '#9c7a2a',
                    fontSize: '12px',
                    marginBottom: '4px',
                  }}
                >
                  {exp.role} · {exp.period}
                </div>
                {exp.highlights.slice(0, 2).map((h, j) => (
                  <div
                    key={j}
                    style={{
                      color: '#3c3120',
                      fontSize: '12px',
                      lineHeight: 1.5,
                    }}
                  >
                    • {h}
                  </div>
                ))}
              </div>
            ))}
          </div>
        );

      case 4:
        return (
          <div
            style={{
              ...pageBase,
              background: 'radial-gradient(circle at 40% 40%, #F1E4C0, #D9C293)',
            }}
          >
            <div
              style={{
                color: '#9c7a2a',
                fontSize: '10px',
                letterSpacing: '0.3em',
                marginBottom: '4px',
              }}
            >
              CAPÍTULO IV
            </div>
            <div
              style={{
                color: '#3c3120',
                fontSize: '22px',
                fontWeight: 700,
                marginBottom: '16px',
              }}
            >
              Educación &amp; Formación
            </div>
            {cvData.education.map((edu, i) => (
              <div key={i} style={{ marginBottom: '12px' }}>
                <div
                  style={{
                    color: '#3c3120',
                    fontWeight: 700,
                    fontSize: '13px',
                  }}
                >
                  {edu.degree}
                </div>
                <div style={{ color: '#9c7a2a', fontSize: '12px' }}>
                  {edu.institution}
                </div>
              </div>
            ))}
            <div
              style={{
                color: '#9c7a2a',
                fontSize: '10px',
                letterSpacing: '0.2em',
                margin: '16px 0 8px',
              }}
            >
              CERTIFICACIONES
            </div>
            {cvData.certifications.map((cert, i) => (
              <div
                key={i}
                style={{
                  color: '#3c3120',
                  fontSize: '12px',
                  marginBottom: '4px',
                }}
              >
                • {cert}
              </div>
            ))}
          </div>
        );

      case 5:
        return (
          <div
            style={{
              ...pageBase,
              background: 'radial-gradient(circle at 40% 40%, #F1E4C0, #D9C293)',
              alignItems: 'center',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                color: '#9c7a2a',
                fontSize: '10px',
                letterSpacing: '0.3em',
                marginBottom: '4px',
              }}
            >
              EPÍLOGO
            </div>
            <div
              style={{
                color: '#3c3120',
                fontSize: '22px',
                fontWeight: 700,
                marginBottom: '8px',
              }}
            >
              Contacto
            </div>
            <div
              style={{
                color: '#9c7a2a',
                fontSize: '13px',
                fontStyle: 'italic',
                marginBottom: '24px',
              }}
            >
              así llegas a mi casa
            </div>
            {[
              { label: 'Email', val: cvData.contact.email },
              { label: 'Tel', val: cvData.contact.phone },
              { label: 'Loc', val: cvData.contact.location },
              { label: 'LinkedIn', val: cvData.contact.linkedin },
              { label: 'Portfolio', val: cvData.contact.portfolio },
            ].map(({ label, val }) => (
              <div
                key={label}
                style={{
                  color: '#3c3120',
                  fontSize: '13px',
                  marginBottom: '8px',
                  fontFamily: "'EB Garamond', Georgia, serif",
                }}
              >
                <span
                  style={{
                    color: '#9c7a2a',
                    fontSize: '10px',
                    letterSpacing: '0.2em',
                  }}
                >
                  {label}{' '}
                </span>
                {val}
              </div>
            ))}
          </div>
        );

      case 6:
        return (
          <div
            style={{
              ...pageBase,
              background: '#243024',
              border: '2px solid #B68A2E',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
            }}
          >
            <div style={{
              width: '60px', height: '60px', borderRadius: '50%',
              border: '8px solid #EDE9DB', borderRightColor: 'transparent',
              margin: '0 auto', position: 'relative',
            }}>
              <div style={{
                position: 'absolute', top: -5, right: -5, width: 14, height: 14,
                borderRadius: '50%', background: '#4A8C5C',
              }} />
            </div>
            <div
              style={{
                color: 'rgba(201,162,75,0.5)',
                fontSize: '11px',
                marginTop: '24px',
                letterSpacing: '0.1em',
              }}
            >
              DIBUJADO POR LUIS C.
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      style={{
        width: '100%',
        minHeight: '100vh',
        background: '#0a1a0a',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        fontFamily: "'Cinzel', 'EB Garamond', Georgia, serif",
      }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* PC notice banner */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 20,
        background: 'rgba(36,48,36,0.97)',
        borderBottom: '1px solid #B68A2E',
        padding: '10px 16px',
        textAlign: 'center',
        color: '#C9A24B',
        fontSize: '11px',
        letterSpacing: '0.12em',
        fontFamily: "'Cinzel', serif",
        width: '100%',
      }}>
        Para la experiencia 3D completa, usa un computador
      </div>

      {/* Book card */}
      <div style={{ ...bookCardStyle, ...pageAnimStyle }}>
        {renderPage(displayPage)}
      </div>

      {/* Navigation dots */}
      <div style={{ display: 'flex', gap: '8px', marginTop: '20px' }}>
        {Array.from({ length: TOTAL_PAGES }, (_, i) => (
          <button
            key={i}
            onClick={() => changePage(i)}
            style={{
              width: i === displayPage ? '24px' : '8px',
              height: '8px',
              borderRadius: '4px',
              background:
                i === displayPage
                  ? '#C9A24B'
                  : 'rgba(201,162,75,0.3)',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              padding: 0,
            }}
          />
        ))}
      </div>

      {/* Prev/Next buttons */}
      <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
        <button
          onClick={prevPage}
          disabled={displayPage === 0 || animating}
          style={navBtnStyle}
        >
          ← Anterior
        </button>
        <button
          onClick={nextPage}
          disabled={displayPage === TOTAL_PAGES - 1 || animating}
          style={navBtnStyle}
        >
          Siguiente →
        </button>
      </div>
    </div>
  );
}

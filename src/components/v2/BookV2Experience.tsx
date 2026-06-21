'use client';

import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import ForestScene from './ForestScene';
import MagicBook3D, { BookState } from './MagicBook3D';
import { PageTextureData } from './PageTextureGenerator';

// ─── Types ────────────────────────────────────────────────────────────────────

interface BookV2ExperienceProps {
  cvData: PageTextureData;
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const overlayBtnStyle: React.CSSProperties = {
  padding: '10px 20px',
  background: 'rgba(36, 48, 36, 0.85)',
  border: '1px solid #B68A2E',
  color: '#C9A24B',
  borderRadius: '6px',
  cursor: 'pointer',
  fontFamily: "'Cinzel', serif",
  fontSize: '13px',
  letterSpacing: '0.1em',
  backdropFilter: 'blur(8px)',
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function BookV2Experience({ cvData }: BookV2ExperienceProps) {
  const [bookState, setBookState] = useState<BookState>('idle');

  const dispatchKey = (key: string) =>
    window.dispatchEvent(new KeyboardEvent('keydown', { key }));

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      <Canvas
        camera={{ position: [0, 2, 5], fov: 45 }}
        gl={{ antialias: true, alpha: false }}
        style={{ width: '100%', height: '100vh', background: '#0a1a0a' }}
        shadows
      >
        <ForestScene />
        <MagicBook3D cvData={cvData} onStateChange={setBookState} />
        <EffectComposer>
          <Bloom
            luminanceThreshold={0.4}
            luminanceSmoothing={0.9}
            intensity={1.5}
          />
        </EffectComposer>
      </Canvas>

      {/* Navigation overlay — visible when reading */}
      {bookState === 'reading' && (
        <div
          style={{
            position: 'absolute',
            bottom: '24px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '12px',
            zIndex: 10,
          }}
        >
          <button
            onClick={() => dispatchKey('ArrowLeft')}
            style={overlayBtnStyle}
          >
            ← Anterior
          </button>
          <button
            onClick={() => dispatchKey('Escape')}
            style={overlayBtnStyle}
          >
            Cerrar ✕
          </button>
          <button
            onClick={() => dispatchKey('ArrowRight')}
            style={overlayBtnStyle}
          >
            Siguiente →
          </button>
        </div>
      )}

      {/* Hint overlay — visible when idle or hovering */}
      {(bookState === 'idle' || bookState === 'hover') && (
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            width: '100%',
            textAlign: 'center',
            color: 'rgba(201,162,75,0.6)',
            fontSize: '13px',
            letterSpacing: '0.2em',
            fontFamily: "'Cinzel', serif",
            pointerEvents: 'none',
            zIndex: 10,
          }}
        >
          CLICK PARA ABRIR
        </div>
      )}
    </div>
  );
}

'use client';

import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { OrbitControls } from '@react-three/drei';
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

  // Drag-to-turn: intercept at DOM level (R3F mesh events are blocked by OrbitControls)
  const handleContainerPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (bookState !== 'reading') return;
    // Ignore clicks on the nav buttons (they have their own handlers)
    if ((e.target as HTMLElement).tagName === 'BUTTON') return;
    const startX = e.clientX;
    let dragged = false;

    const onMove = (ev: PointerEvent) => {
      if (Math.abs(ev.clientX - startX) > 6) dragged = true;
    };
    const onUp = (ev: PointerEvent) => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      const delta = ev.clientX - startX;
      if (dragged && Math.abs(delta) >= 12) {
        dispatchKey(delta < 0 ? 'ArrowRight' : 'ArrowLeft');
      }
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }} onPointerDown={handleContainerPointerDown}>
      <Canvas
        camera={{ position: [0, 2, 3], fov: 45 }}
        gl={{ antialias: true, alpha: false }}
        style={{ width: '100%', height: '100vh', background: '#0a1a0a' }}
      >
        <OrbitControls enableRotate={false} enablePan={false} zoomSpeed={0.6} minDistance={1.5} maxDistance={8} />
        <ForestScene />
        <MagicBook3D cvData={cvData} onStateChange={setBookState} />
        <EffectComposer>
          <Bloom
            luminanceThreshold={0.55}
            luminanceSmoothing={0.8}
            intensity={0.7}
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
          <>
            <div>CLICK PARA ABRIR</div>
            <div style={{ fontSize: '11px', opacity: 0.7, marginTop: '4px', letterSpacing: '0.15em' }}>
              SCROLL · acercar/alejar
            </div>
          </>
        </div>
      )}
    </div>
  );
}

'use client';

import { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import BookFlip from './BookFlip';
import { PageTextureData } from './PageTextureGenerator';
import { LEAF_COUNT } from '../../data/v2/bookPages';

export type BookState = 'idle' | 'hover' | 'opening' | 'reading' | 'closing';

interface MagicBook3DProps {
  cvData: PageTextureData;
  onStateChange?: (state: BookState) => void;
}

const playPageFlip = () => {
  try {
    const audio = new Audio('/audios/page-flip-01a.mp3');
    audio.volume = 0.4;
    audio.play().catch(() => {});
  } catch { /* ignore */ }
};

export default function MagicBook3D({ cvData, onStateChange }: MagicBook3DProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [bookState, setBookState] = useState<BookState>('idle');

  const groupRef = useRef<THREE.Group>(null);
  const pointLightRef = useRef<THREE.PointLight>(null);
  const liftY = useRef(0);
  const transitionTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Ref mirrors state so useFrame never sees a stale closure value
  const bookStateRef = useRef<BookState>('idle');

  useEffect(() => {
    onStateChange?.(bookState);
  }, [bookState, onStateChange]);

  useEffect(() => {
    return () => { if (transitionTimeout.current) clearTimeout(transitionTimeout.current); };
  }, []);

  // Updates ref immediately (before next RAF) then schedules React re-render
  const updateBookState = (next: BookState) => {
    bookStateRef.current = next;
    setBookState(next);
  };

  // ─── Leaf click handler ───────────────────────────────────────────────────

  const handleLeafClick = (leafIndex: number) => {
    const st = bookStateRef.current;
    if (st === 'idle' || st === 'hover') {
      updateBookState('opening');
      playPageFlip();
      setCurrentPage(1);
      if (transitionTimeout.current) clearTimeout(transitionTimeout.current);
      transitionTimeout.current = setTimeout(() => updateBookState('reading'), 800);
    } else if (st === 'reading') {
      const newPage = leafIndex + 1;
      if (newPage !== currentPage) {
        playPageFlip();
        setCurrentPage(newPage);
      }
    }
  };

  // ─── Keyboard handling ────────────────────────────────────────────────────

  useEffect(() => {
    const nextPage = () => setCurrentPage(p => { if (p < LEAF_COUNT) { playPageFlip(); return p + 1; } return p; });
    const prevPage = () => setCurrentPage(p => { if (p > 0) { playPageFlip(); return p - 1; } return p; });
    const closeBook = () => {
      setCurrentPage(0);
      updateBookState('closing');
      if (transitionTimeout.current) clearTimeout(transitionTimeout.current);
      transitionTimeout.current = setTimeout(() => updateBookState('idle'), 800);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextPage();
      if (e.key === 'ArrowLeft') prevPage();
      if (e.key === 'Escape') closeBook();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // ─── Animation loop ───────────────────────────────────────────────────────

  useFrame(({ clock }, delta) => {
    if (!groupRef.current) return;
    const st = bookStateRef.current;
    const t = clock.elapsedTime;

    // Book ALWAYS faces the camera — rotation.y is locked to 0.
    // Visual life comes from gentle Z-tilt and X-nod when idle.
    groupRef.current.rotation.y = 0;

    if (st === 'idle' || st === 'hover') {
      // Gentle floating tilt — ±2.3° Z sway, ±1.1° X nod
      groupRef.current.rotation.z = Math.sin(t * 0.55) * 0.04;
      groupRef.current.rotation.x = Math.sin(t * 0.80) * 0.02;
    } else {
      // Smoothly return to flat when interacting
      groupRef.current.rotation.z += (0 - groupRef.current.rotation.z) * Math.min(1, delta * 4);
      groupRef.current.rotation.x += (0 - groupRef.current.rotation.x) * Math.min(1, delta * 4);
    }

    // Lift animation
    const targetLift = st === 'reading' || st === 'opening' ? 0.3 : 0;
    liftY.current += (targetLift - liftY.current) * Math.min(1, delta * 2);
    groupRef.current.position.y = liftY.current;

    // Point light
    const targetIntensity = st === 'hover' ? 5 : 3;
    if (pointLightRef.current) {
      pointLightRef.current.intensity += (targetIntensity - pointLightRef.current.intensity) * 0.1;
    }
  });

  // ─── JSX ─────────────────────────────────────────────────────────────────

  return (
    <>
      <pointLight ref={pointLightRef} color="#ffcc44" intensity={3} position={[0, 2, 2]} distance={5} decay={2} />

      <group
        ref={groupRef}
        onPointerEnter={() => { if (bookStateRef.current === 'idle') updateBookState('hover'); }}
        onPointerLeave={() => { if (bookStateRef.current === 'hover') updateBookState('idle'); }}
      >
        <BookFlip
          currentPage={currentPage}
          isOpen={bookState === 'reading' || bookState === 'opening' || bookState === 'closing'}
          onLeafClick={handleLeafClick}
          cvData={cvData}
        />
      </group>
    </>
  );
}

export type { MagicBook3DProps };

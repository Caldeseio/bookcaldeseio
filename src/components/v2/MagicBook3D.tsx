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
  onPageChange?: (page: number) => void;
  onProjectClick?: (index: number) => void;
}

const playPageFlip = () => {
  try {
    const audio = new Audio('/audios/page-flip-01a.mp3');
    audio.volume = 0.4;
    audio.play().catch(() => {});
  } catch { /* ignore */ }
};

export default function MagicBook3D({ cvData, onStateChange, onPageChange, onProjectClick }: MagicBook3DProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [bookState, setBookState] = useState<BookState>('idle');

  const groupRef = useRef<THREE.Group>(null);
  const pointLightRef = useRef<THREE.PointLight>(null);
  const swayY = useRef(0);
  const swayDir = useRef(1);
  const liftY = useRef(0);
  const tiltX = useRef(0);   // X-axis tilt toward camera when reading
  const transitionTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const bookStateRef = useRef<BookState>('idle');

  useEffect(() => { onStateChange?.(bookState); }, [bookState, onStateChange]);
  useEffect(() => { onPageChange?.(currentPage); }, [currentPage, onPageChange]);

  useEffect(() => {
    return () => { if (transitionTimeout.current) clearTimeout(transitionTimeout.current); };
  }, []);

  const updateBookState = (next: BookState) => {
    bookStateRef.current = next;
    setBookState(next);
  };

  // ─── Leaf click ───────────────────────────────────────────────────────────

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
      if (newPage !== currentPage) { playPageFlip(); setCurrentPage(newPage); }
    }
  };

  // ─── Page drag ───────────────────────────────────────────────────────────

  const handlePageDrag = (deltaX: number) => {
    if (bookStateRef.current !== 'reading') return;
    const key = deltaX < 0 ? 'ArrowRight' : 'ArrowLeft';
    window.dispatchEvent(new KeyboardEvent('keydown', { key }));
  };

  // ─── Keyboard ─────────────────────────────────────────────────────────────

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

  // ─── Animation ────────────────────────────────────────────────────────────

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const st = bookStateRef.current;

    // Y sway when idle, return to 0 when active
    if (st === 'idle' || st === 'hover') {
      const SWAY = 0.42;
      swayY.current += 0.003 * swayDir.current;
      if (Math.abs(swayY.current) >= SWAY) {
        swayDir.current *= -1;
        swayY.current = Math.sign(swayY.current) * SWAY;
      }
      groupRef.current.rotation.y = swayY.current;
    } else {
      groupRef.current.rotation.y += (0 - groupRef.current.rotation.y) * Math.min(1, delta * 5);
      swayY.current = groupRef.current.rotation.y;
    }

    // X tilt toward camera when reading (~18°), flat otherwise
    const targetTiltX = (st === 'reading' || st === 'opening') ? -0.32 : 0;
    tiltX.current += (targetTiltX - tiltX.current) * Math.min(1, delta * 4);
    groupRef.current.rotation.x = tiltX.current;

    const targetLift = st === 'reading' || st === 'opening' ? 0.3 : 0;
    liftY.current += (targetLift - liftY.current) * Math.min(1, delta * 5);
    groupRef.current.position.y = liftY.current;

    // Point light
    const targetInt = st === 'hover' ? 5 : 3;
    if (pointLightRef.current) {
      pointLightRef.current.intensity += (targetInt - pointLightRef.current.intensity) * 0.1;
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
        {/* Inner group corrects geometry: pages face camera at outer rotation.y = 0 */}
        <group rotation-y={-Math.PI / 2}>
          <BookFlip
            currentPage={currentPage}
            isOpen={bookState === 'reading' || bookState === 'opening' || bookState === 'closing'}
            onLeafClick={handleLeafClick}
            onPageDrag={handlePageDrag}
            cvData={cvData}
            onProjectClick={onProjectClick}
          />
        </group>
      </group>
    </>
  );
}

export type { MagicBook3DProps };

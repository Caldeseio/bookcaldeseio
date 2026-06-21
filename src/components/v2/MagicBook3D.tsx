'use client';

import { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import BookFlip from './BookFlip';
import { PageTextureData } from './PageTextureGenerator';
import { LEAF_COUNT } from '../../data/v2/bookPages';

// ─── Types ────────────────────────────────────────────────────────────────────

export type BookState = 'idle' | 'hover' | 'opening' | 'reading' | 'closing';

interface MagicBook3DProps {
  cvData: PageTextureData;
  onStateChange?: (state: BookState) => void;
}

// ─── Audio helper ─────────────────────────────────────────────────────────────

const playPageFlip = () => {
  try {
    const audio = new Audio('/audios/page-flip-01a.mp3');
    audio.volume = 0.4;
    audio.play().catch(() => {});
  } catch {
    // ignore
  }
};

// ─── MagicBook3D ─────────────────────────────────────────────────────────────

export default function MagicBook3D({ cvData, onStateChange }: MagicBook3DProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [bookState, setBookState] = useState<BookState>('idle');

  // Mutable refs for animation
  const groupRef = useRef<THREE.Group>(null);
  const pointLightRef = useRef<THREE.PointLight>(null);
  const autoRotY = useRef(0);
  const liftY = useRef(0);
  const transitionTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Notify parent of state changes
  useEffect(() => {
    onStateChange?.(bookState);
  }, [bookState, onStateChange]);

  // ─── Unmount cleanup for transition timeout ────────────────────────────────

  useEffect(() => {
    return () => {
      if (transitionTimeout.current) clearTimeout(transitionTimeout.current);
    };
  }, []);

  // ─── Leaf click handler ────────────────────────────────────────────────────

  const handleLeafClick = (leafIndex: number) => {
    if (bookState === 'idle' || bookState === 'hover') {
      setBookState('opening');
      playPageFlip();
      setCurrentPage(1);
      if (transitionTimeout.current) clearTimeout(transitionTimeout.current);
      transitionTimeout.current = setTimeout(() => setBookState('reading'), 800);
    } else if (bookState === 'reading') {
      const newPage = leafIndex + 1;
      if (newPage !== currentPage) {
        playPageFlip();
        setCurrentPage(newPage);
      }
    }
  };

  // ─── Keyboard handling ────────────────────────────────────────────────────

  useEffect(() => {
    const nextPage = () => {
      setCurrentPage((p) => {
        if (p < LEAF_COUNT) {
          playPageFlip();
          return p + 1;
        }
        return p;
      });
    };

    const prevPage = () => {
      setCurrentPage((p) => {
        if (p > 0) {
          playPageFlip();
          return p - 1;
        }
        return p;
      });
    };

    const closeBook = () => {
      setCurrentPage(0);
      setBookState('closing');
      if (transitionTimeout.current) clearTimeout(transitionTimeout.current);
      transitionTimeout.current = setTimeout(() => setBookState('idle'), 800);
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

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // Auto-rotate when idle or hovering
    if (bookState === 'idle' || bookState === 'hover') {
      autoRotY.current += 0.003;
      groupRef.current.rotation.y = autoRotY.current;
    }

    // Lift animation
    const targetLift = bookState === 'reading' || bookState === 'opening' ? 0.3 : 0;
    liftY.current += (targetLift - liftY.current) * Math.min(1, delta * 2);
    groupRef.current.position.y = liftY.current;

    // Point light intensity
    const targetIntensity = bookState === 'hover' ? 5 : 3;
    if (pointLightRef.current) {
      pointLightRef.current.intensity +=
        (targetIntensity - pointLightRef.current.intensity) * 0.1;
    }
  });

  // ─── JSX ─────────────────────────────────────────────────────────────────

  return (
    <>
      {/* Hover-reactive warm point light above the book */}
      <pointLight
        ref={pointLightRef}
        color="#ffcc44"
        intensity={3}
        position={[0, 2, 2]}
        distance={5}
        decay={2}
      />

      <group
        ref={groupRef}
        onPointerEnter={() => {
          if (bookState === 'idle') setBookState('hover');
        }}
        onPointerLeave={() => {
          if (bookState === 'hover') setBookState('idle');
        }}
      >
        <BookFlip
          currentPage={currentPage}
          isOpen={
            bookState === 'reading' ||
            bookState === 'opening' ||
            bookState === 'closing'
          }
          onLeafClick={handleLeafClick}
          cvData={cvData}
        />
      </group>
    </>
  );
}

export type { MagicBook3DProps };

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
  // Mirror of bookState as a ref — useFrame reads this to avoid stale closures
  const bookStateRef = useRef<BookState>('idle');

  // Keep ref in sync with state; also notify parent
  useEffect(() => {
    bookStateRef.current = bookState;
    onStateChange?.(bookState);
  }, [bookState, onStateChange]);

  // ─── Unmount cleanup for transition timeout ────────────────────────────────

  useEffect(() => {
    return () => {
      if (transitionTimeout.current) clearTimeout(transitionTimeout.current);
    };
  }, []);

  // ─── Helpers ──────────────────────────────────────────────────────────────

  // Snap group rotation to nearest "face-front" multiple of 2π synchronously.
  // Called in event handlers — happens before the next render frame, so the
  // user never sees the sideways position.
  const snapToFront = () => {
    if (!groupRef.current) return;
    const cur = groupRef.current.rotation.y;
    const target = Math.round(cur / (Math.PI * 2)) * (Math.PI * 2);
    groupRef.current.rotation.y = target;
    autoRotY.current = target;
  };

  // ─── Leaf click handler ────────────────────────────────────────────────────

  const handleLeafClick = (leafIndex: number) => {
    const state = bookStateRef.current;
    if (state === 'idle' || state === 'hover') {
      // Align to face camera before opening — synchronous, invisible to user
      snapToFront();
      setBookState('opening');
      playPageFlip();
      setCurrentPage(1);
      if (transitionTimeout.current) clearTimeout(transitionTimeout.current);
      transitionTimeout.current = setTimeout(() => setBookState('reading'), 800);
    } else if (state === 'reading') {
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
    // Read from ref — avoids stale closure when React state updates mid-frame
    const state = bookStateRef.current;

    if (state === 'idle' || state === 'hover') {
      autoRotY.current += 0.003;
      groupRef.current.rotation.y = autoRotY.current;
    } else if (state === 'opening') {
      // snapToFront() already aligned the book at click time; this applies
      // any tiny residual delta that may accumulate across async React renders
      const cur = groupRef.current.rotation.y;
      const target = Math.round(cur / (Math.PI * 2)) * (Math.PI * 2);
      if (Math.abs(cur - target) > 0.001) {
        groupRef.current.rotation.y += (target - cur) * Math.min(1, delta * 10);
      }
      autoRotY.current = groupRef.current.rotation.y;
    } else {
      // reading / closing: keep autoRotY synced so returning to idle is seamless
      autoRotY.current = groupRef.current.rotation.y;
    }

    // Lift animation
    const targetLift = state === 'reading' || state === 'opening' ? 0.3 : 0;
    liftY.current += (targetLift - liftY.current) * Math.min(1, delta * 2);
    groupRef.current.position.y = liftY.current;

    // Point light intensity
    const targetIntensity = state === 'hover' ? 5 : 3;
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
          if (bookStateRef.current === 'idle') setBookState('hover');
        }}
        onPointerLeave={() => {
          if (bookStateRef.current === 'hover') setBookState('idle');
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

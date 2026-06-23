'use client';

import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

function makeFairyTexture(size = 128): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const cx = size / 2;
  const cy = size / 2;

  // Outer glow aura
  const aura = ctx.createRadialGradient(cx, cy, 0, cx, cy, size * 0.48);
  aura.addColorStop(0, 'rgba(255,248,200,0.55)');
  aura.addColorStop(0.4, 'rgba(220,255,180,0.20)');
  aura.addColorStop(1, 'rgba(180,230,255,0)');
  ctx.fillStyle = aura;
  ctx.fillRect(0, 0, size, size);

  // Left wing
  ctx.save();
  ctx.translate(cx, cy);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(-38, -28, -54, 4, -22, 20);
  ctx.bezierCurveTo(-10, 24, -2, 12, 0, 0);
  ctx.fillStyle = 'rgba(180,220,255,0.42)';
  ctx.strokeStyle = 'rgba(200,240,255,0.7)';
  ctx.lineWidth = 1;
  ctx.fill();
  ctx.stroke();
  // Right wing
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(38, -28, 54, 4, 22, 20);
  ctx.bezierCurveTo(10, 24, 2, 12, 0, 0);
  ctx.fillStyle = 'rgba(200,230,255,0.38)';
  ctx.fill();
  ctx.stroke();
  // Small lower wings
  ctx.beginPath();
  ctx.moveTo(0, 2);
  ctx.bezierCurveTo(-24, 18, -28, 38, -8, 34);
  ctx.bezierCurveTo(-2, 32, 0, 18, 0, 2);
  ctx.fillStyle = 'rgba(180,220,255,0.30)';
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(0, 2);
  ctx.bezierCurveTo(24, 18, 28, 38, 8, 34);
  ctx.bezierCurveTo(2, 32, 0, 18, 0, 2);
  ctx.fill();
  ctx.restore();

  // Body glow
  const body = ctx.createRadialGradient(cx, cy, 0, cx, cy, 12);
  body.addColorStop(0, '#ffffff');
  body.addColorStop(0.5, '#fffbe0');
  body.addColorStop(1, 'rgba(255,240,150,0)');
  ctx.beginPath();
  ctx.arc(cx, cy, 12, 0, Math.PI * 2);
  ctx.fillStyle = body;
  ctx.fill();

  // Inner bright core
  ctx.beginPath();
  ctx.arc(cx, cy, 4, 0, Math.PI * 2);
  ctx.fillStyle = '#ffffff';
  ctx.fill();

  return new THREE.CanvasTexture(canvas);
}

function makeTrailTexture(): THREE.CanvasTexture {
  const size = 32;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const cx = size / 2;
  const g = ctx.createRadialGradient(cx, cx, 0, cx, cx, cx);
  g.addColorStop(0, 'rgba(255,255,200,0.9)');
  g.addColorStop(0.5, 'rgba(200,240,255,0.4)');
  g.addColorStop(1, 'rgba(180,220,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(canvas);
}

const TRAIL_LENGTH = 5;

export default function Fairy() {
  const fairyRef = useRef<THREE.Sprite>(null);
  const trailRefs = useRef<(THREE.Sprite | null)[]>([]);

  const { fairyTex, trailTex } = useMemo(() => ({
    fairyTex: makeFairyTexture(128),
    trailTex: makeTrailTexture(),
  }), []);

  // Ring buffer of recent positions
  const positions = useRef<THREE.Vector3[]>(
    Array.from({ length: TRAIL_LENGTH }, () => new THREE.Vector3(0, 1.4, 0))
  );

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (!fairyRef.current) return;

    // Elliptical orbit around the book in 3D.
    // When z≈0 (book plane), x=±1.3 (to the sides, clear of the book).
    // When x≈0 (front/back), z=+1.2 (in front) or z=-0.6 (behind) — never through it.
    const angle = t * 0.55;
    const x = Math.sin(angle) * 1.3;
    const z = Math.cos(angle) * 0.9 + 0.3;  // +0.3 biases path toward camera
    const y = 1.55 + Math.sin(t * 1.4 + 0.8) * 0.35;

    fairyRef.current.position.set(x, y, z);
    // Gentle breathing scale
    const s = 0.22 + Math.sin(t * 2.8) * 0.018;
    fairyRef.current.scale.setScalar(s);

    // Pulse opacity
    const mat = fairyRef.current.material as THREE.SpriteMaterial;
    mat.opacity = 0.88 + Math.sin(t * 3.5) * 0.12;

    // Shift ring buffer
    const pos = positions.current;
    for (let i = pos.length - 1; i > 0; i--) {
      pos[i].copy(pos[i - 1]);
    }
    pos[0].set(x, y, z);

    // Update trail sprites
    trailRefs.current.forEach((sprite, i) => {
      if (!sprite) return;
      sprite.position.copy(pos[Math.min(i + 1, pos.length - 1)]);
      const fade = 1 - (i + 1) / (TRAIL_LENGTH + 1);
      const ts = s * fade * 0.65;
      sprite.scale.setScalar(ts);
      (sprite.material as THREE.SpriteMaterial).opacity = fade * 0.55;
    });
  });

  return (
    <>
      <sprite ref={fairyRef} position={[0, 1.4, 0]}>
        <spriteMaterial
          map={fairyTex}
          transparent
          opacity={0.9}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </sprite>

      {Array.from({ length: TRAIL_LENGTH }, (_, i) => (
        <sprite
          key={i}
          ref={(el) => { trailRefs.current[i] = el; }}
          position={[0, 1.4, 0]}
        >
          <spriteMaterial
            map={trailTex}
            transparent
            opacity={0.4}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </sprite>
      ))}
    </>
  );
}

'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import {
  contact, summary, experience, education, certifications, languages,
} from '../../data/v2/cvData';
import { SKILLS } from '../../data/skills';

// Dynamic imports — prevent SSR for Three.js
const BookV2Experience = dynamic(() => import('../../components/v2/BookV2Experience'), {
  ssr: false,
  loading: () => <LoadingScreen />,
});

const MobileBook = dynamic(() => import('../../components/v2/MobileBook'), {
  ssr: false,
});

function LoadingScreen() {
  return (
    <div style={{
      width: '100%',
      height: '100vh',
      background: '#0a1a0a',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#C9A24B',
      fontFamily: "'Cinzel', serif",
    }}>
      <div style={{ fontSize: '28px', letterSpacing: '0.3em', marginBottom: '16px' }}>CALDESEIO</div>
      <div style={{ fontSize: '12px', letterSpacing: '0.2em', opacity: 0.6 }}>Cargando el bosque encantado...</div>
    </div>
  );
}

export default function V2Page() {
  const [isMobile, setIsMobile] = useState(false);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    // Detect mobile
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);

    // Load Google Fonts
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;700&family=EB+Garamond:ital,wght@0,400;0,600;1,400&display=swap';
    link.onload = () => setFontsLoaded(true);
    document.head.appendChild(link);
    // Fallback: consider loaded after 2s even if font API is slow
    const timeout = setTimeout(() => setFontsLoaded(true), 2000);

    return () => {
      window.removeEventListener('resize', check);
      clearTimeout(timeout);
    };
  }, []);

  // Build cvData object for components
  const cvData = {
    contact,
    summary,
    experience,
    education,
    certifications,
    languages,
    skills: SKILLS.map(s => ({ name: s.name, branch: s.branch })),
  };

  if (!fontsLoaded) return <LoadingScreen />;

  if (isMobile) {
    return <MobileBook cvData={cvData} />;
  }

  return (
    <div style={{ width: '100%', height: '100vh', overflow: 'hidden' }}>
      <BookV2Experience cvData={cvData} />
    </div>
  );
}

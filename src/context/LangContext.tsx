'use client'

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react'
import type { Lang } from '@/types'

const translations: Record<Lang, Record<string, string>> = {
  es: {
    'book.title': 'THE BOOK OF CALDESEIO',
    'book.subtitle': 'Developer · Data Analyst · Problem Solver',
    'book.cta': 'ABRIR EL LIBRO',
    'ch1.title': 'The Beginning',        'ch1.subtitle': 'Every Developer Starts Somewhere',
    'ch1.line1': 'Mi nombre es Luis Calderón.',
    'ch1.line2': 'Como muchos desarrolladores, comencé con curiosidad.',
    'ch1.line3': 'Quería entender cómo funcionaban las cosas detrás de la pantalla.',
    'ch2.title': 'The Developer',        'ch2.subtitle': 'Building Solutions',
    'ch2.line1': 'Descubrí que programar no era escribir código.',
    'ch2.line2': 'Era resolver problemas reales.',
    'ch3.title': 'The Data Analyst',     'ch3.subtitle': 'Turning Data Into Decisions',
    'ch3.line1': 'Los datos cuentan historias.',
    'ch3.line2': 'Mi trabajo es descubrirlas.',
    'ch4.title': 'The Archive',          'ch4.subtitle': 'The Projects Library',
    'ch5.title': 'The Knowledge Tree',   'ch5.subtitle': 'Skills & Expertise',
    'ch6.title': 'The Future',           'ch6.subtitle': 'The Next Chapter',
    'ch6.line1': 'La historia continúa.',
    'ch6.line2': 'Cada proyecto es una nueva página.',
    'ch6.cta': 'Dejá tu marca',          'ch6.placeholder': 'Escribí algo...',
    'proj.1.title': 'Sistema de Planilla & RRHH',
    'proj.1.desc': 'Sistema empresarial para gestión de planilla, empleados y biometría',
    'proj.2.title': 'Facturación Electrónica',
    'proj.2.desc': 'Integración con Hacienda CR para emisión de comprobantes electrónicos',
    'proj.3.title': 'Contabilidad Web',
    'proj.3.desc': 'Sistema contable completo con reportes financieros y cierre de período',
    'proj.4.title': 'Financiamiento de Vehículos',
    'proj.4.desc': 'Plataforma de gestión de préstamos y cuotas para distribuidoras',
    'proj.5.title': 'Control de Visitantes',
    'proj.5.desc': 'Sistema de registro y acceso con integración ZKTeco',
    'proj.6.title': '3D Web Experience',
    'proj.6.desc': 'Experiencia web interactiva con Three.js y animaciones cinematográficas',
    'nav.lang.es': 'ES', 'nav.lang.en': 'EN',
  },
  en: {
    'book.title': 'THE BOOK OF CALDESEIO',
    'book.subtitle': 'Developer · Data Analyst · Problem Solver',
    'book.cta': 'OPEN THE BOOK',
    'ch1.title': 'The Beginning',        'ch1.subtitle': 'Every Developer Starts Somewhere',
    'ch1.line1': 'My name is Luis Calderón.',
    'ch1.line2': 'Like many developers, I started with curiosity.',
    'ch1.line3': 'I wanted to understand how things worked behind the screen.',
    'ch2.title': 'The Developer',        'ch2.subtitle': 'Building Solutions',
    'ch2.line1': "I discovered that programming wasn't about writing code.",
    'ch2.line2': 'It was about solving real problems.',
    'ch3.title': 'The Data Analyst',     'ch3.subtitle': 'Turning Data Into Decisions',
    'ch3.line1': 'Data tells stories.',
    'ch3.line2': 'My job is to discover them.',
    'ch4.title': 'The Archive',          'ch4.subtitle': 'The Projects Library',
    'ch5.title': 'The Knowledge Tree',   'ch5.subtitle': 'Skills & Expertise',
    'ch6.title': 'The Future',           'ch6.subtitle': 'The Next Chapter',
    'ch6.line1': 'The story continues.',
    'ch6.line2': 'Every project is a new page.',
    'ch6.cta': 'Leave your mark',        'ch6.placeholder': 'Write something...',
    'proj.1.title': 'Payroll & HR System',
    'proj.1.desc': 'Enterprise system for payroll, employees and biometrics',
    'proj.2.title': 'Electronic Invoicing',
    'proj.2.desc': 'Integration with Costa Rica tax authority for electronic receipts',
    'proj.3.title': 'Web Accounting',
    'proj.3.desc': 'Complete accounting system with financial reports and period closing',
    'proj.4.title': 'Vehicle Financing',
    'proj.4.desc': 'Loan and installment management platform for car dealerships',
    'proj.5.title': 'Visitor Control',
    'proj.5.desc': 'Registration and access control with ZKTeco integration',
    'proj.6.title': '3D Web Experience',
    'proj.6.desc': 'Interactive web experience with Three.js and cinematic animations',
    'nav.lang.es': 'ES', 'nav.lang.en': 'EN',
  },
}

interface LangContextValue {
  lang: Lang
  toggleLang: () => void
  t: (key: string) => string
}

const LangContext = createContext<LangContextValue | null>(null)

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('es')
  const toggleLang = useCallback(() => setLang(p => p === 'es' ? 'en' : 'es'), [])
  const t = useCallback((key: string) => translations[lang][key] ?? key, [lang])
  useEffect(() => { document.documentElement.lang = lang }, [lang])
  return <LangContext.Provider value={{ lang, toggleLang, t }}>{children}</LangContext.Provider>
}

export function useLang() {
  const ctx = useContext(LangContext)
  if (!ctx) throw new Error('useLang must be used within LangProvider')
  return ctx
}

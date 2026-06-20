'use client'

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react'
import type { Lang } from '@/types'

const translations: Record<Lang, Record<string, string>> = {
  es: {
    'book.title': 'THE BOOK OF CALDESEIO',
    'book.subtitle': 'Developer · Data Analyst · Problem Solver',
    'book.cta': 'ABRIR EL LIBRO',
    'ch1.title': 'El Analista',
    'ch1.subtitle': 'Datos que cuentan historias',
    'ch1.line1': 'SQL, Python y Power BI transforman números en decisiones.',
    'ch1.line2': 'El negocio habla datos. Yo lo traduzco.',
    'ch2.title': 'El Desarrollador',
    'ch2.subtitle': 'De la idea al sistema',
    'ch2.line1': 'PHP, Laravel, JavaScript: sistemas que realmente funcionan.',
    'ch2.line2': 'Full stack, desde la API hasta la interfaz.',
    'ch3.title': 'El Arquitecto SaaS',
    'ch3.subtitle': 'Plataformas empresariales multi-tenant',
    'ch3.line1': 'Planilla, biometría y control de acceso en un solo núcleo.',
    'ch3.line2': 'Una plataforma, decenas de empresas.',
    'ch4.title': 'El Futuro',
    'ch4.subtitle': 'IA, Nube y lo que viene',
    'ch4.line1': 'Ingeniería de datos, IA y la nube son el próximo capítulo.',
    'ch4.line2': 'La historia continúa.',
    'ch4.cta': 'Dejá tu marca',
    'ch4.placeholder': 'Escribí algo...',
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
    'ch1.title': 'The Analyst',
    'ch1.subtitle': 'Data That Tells Stories',
    'ch1.line1': 'SQL, Python and Power BI turn numbers into decisions.',
    'ch1.line2': 'Business speaks data. I translate it.',
    'ch2.title': 'The Developer',
    'ch2.subtitle': 'From Idea to System',
    'ch2.line1': 'PHP, Laravel, JavaScript: systems that actually work.',
    'ch2.line2': 'Full stack, from the API to the interface.',
    'ch3.title': 'The SaaS Architect',
    'ch3.subtitle': 'Multi-tenant Enterprise Platforms',
    'ch3.line1': 'Payroll, biometrics and access control in one core.',
    'ch3.line2': 'One platform, dozens of companies.',
    'ch4.title': 'The Future',
    'ch4.subtitle': 'AI, Cloud and What Comes Next',
    'ch4.line1': 'Data engineering, AI and the cloud are the next chapter.',
    'ch4.line2': 'The story continues.',
    'ch4.cta': 'Leave your mark',
    'ch4.placeholder': 'Write something...',
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

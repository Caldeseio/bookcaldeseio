export const contact = {
  name: 'Luis Calderón',
  role: 'Ingeniero de Software | Desarrollador Full Stack | Analista de Datos',
  email: 'luiscalderontcit@gmail.com',
  phone: '+506 8339-1192',
  location: 'San Ramón, Alajuela · Costa Rica',
  linkedin: 'linkedin.com/in/luis-calderon-962a57258',
  portfolio: 'caldeseios.vercel.app',
  availability: 'Disponibilidad: Inmediata',
} as const;

export const summary =
  'Ingeniero de Software con más de 2 años de experiencia especializado en desarrollo full-stack, implementación de sistemas ERP y análisis de datos. Experto en crear soluciones escalables usando tecnologías modernas con enfoque en optimización de rendimiento y experiencia de usuario.';

export interface ExperienceItem {
  company: string;
  role: string;
  period: string;
  highlights: string[];
  stack: string[];
}

export const experience: ExperienceItem[] = [
  {
    company: 'CSG',
    role: 'Ingeniero de Software — Full Stack',
    period: 'Abril 2024 – Presente',
    highlights: [
      'ERP integral: facturación electrónica, inventarios, POS, planillas',
      'BI dashboards con Power BI y Python (EDA, heat maps, KPIs)',
      'Optimización SQL: hasta 70% mejora en tiempos de respuesta',
      'Líder técnico con stack React + Laravel bajo metodología Ágil',
    ],
    stack: ['PHP', 'JavaScript', 'React', 'Laravel', 'MariaDB', 'MySQL', 'Power BI', 'AWS'],
  },
  {
    company: 'Freelance',
    role: 'Desarrollador Web & Analista de Datos',
    period: '2024 – Presente',
    highlights: [
      'Apps full-stack: React, Node.js, Django, PHP para e-commerce y educación',
      'Dashboards interactivos Power BI y Python (Plotly, Seaborn)',
      'Modelos predictivos con Scikit-learn, R y SQL',
      'Despliegue en AWS/Vercel, ciclo completo de proyecto',
    ],
    stack: ['React', 'Node.js', 'Django', 'Python', 'Tailwind CSS', 'Vercel'],
  },
  {
    company: 'Compu Servicios Gomez',
    role: 'Técnico de Soporte IT',
    period: 'Sep 2018 – Dic 2018',
    highlights: [
      'Soporte técnico hardware/software Windows y Linux',
      'Mantenimiento preventivo, redes y configuración de sistemas',
    ],
    stack: ['Windows', 'Linux', 'Networking'],
  },
];

export interface EducationItem {
  degree: string;
  institution: string;
}

export const education: EducationItem[] = [
  { degree: 'Bachiller en Ingeniería Informática', institution: 'UNED, Costa Rica' },
  { degree: 'Técnico en Análisis de Datos', institution: 'Universidad Empresarial, Costa Rica' },
  { degree: 'Técnico Medio en Informática en Soporte', institution: 'CTP Calle Zamora' },
];

export const certifications: string[] = [
  'Java & Spring Boot G4 — ONE | Alura LATAM & Oracle (2023)',
  'CCNA 1: Introducción a Redes | CTP Calle Zamora (2018)',
  'IT Essentials: PC Hardware and Software | CTP Calle Zamora (2016)',
];

export const languages = [
  { name: 'Español', level: 'Nativo' },
  { name: 'Inglés', level: 'Intermedio (B1)' },
];

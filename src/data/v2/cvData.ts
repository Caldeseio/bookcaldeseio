export interface ContactInfo {
  name: string;
  role: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  portfolio: string;
  availability: string;
}

export interface ExperienceItem {
  company: string;
  role: string;
  period: string;
  highlights: string[];
  stack: string[];
}

export interface EducationItem {
  degree: string;
  institution: string;
}

// ─── Spanish ──────────────────────────────────────────────────────────────────

export const contact: ContactInfo = {
  name: 'Luis Calderón',
  role: 'Ingeniero de Software | Desarrollador Full Stack | Analista de Datos',
  email: 'luiscalderontcit@gmail.com',
  phone: '+506 8339-1192',
  location: 'San Ramón, Alajuela · Costa Rica',
  linkedin: 'linkedin.com/in/luis-calderon-962a57258',
  portfolio: 'caldeseios.vercel.app',
  availability: 'Disponibilidad: Inmediata',
};

export const summary =
  'Ingeniero de Software con más de 2 años de experiencia especializado en desarrollo full-stack, implementación de sistemas ERP y análisis de datos. Experto en crear soluciones escalables usando tecnologías modernas (React, Laravel, Node.js, Python) con enfoque en optimización de rendimiento y experiencia de usuario. Historial comprobado desarrollando módulos complejos de ERP y dashboards interactivos con Power BI y Python. Capacidad demostrada para liderar proyectos y optimizar bases de datos SQL. Apasionado por tecnologías emergentes y metodologías ágiles.';

export const experience: ExperienceItem[] = [
  {
    company: 'CSG',
    role: 'Ingeniero de Software — Full Stack',
    period: 'Abril 2024 – Presente',
    highlights: [
      'Líder técnico de ERP enterprise: facturación electrónica, inventarios, activos fijos y reportería',
      'POS completo: cajas, multi-cajero, conciliación de efectivo y cierre diario automatizado',
      'Módulo de planillas: cálculos salariales, aguinaldos, liquidaciones y reportes con exportación Excel',
      'BI: dashboards Power BI y Python (EDA, heat maps, KPIs) para insights accionables a gerencia',
      'Optimización SQL (MariaDB/MySQL): índices estratégicos y refactor → hasta 70% mejora en respuesta',
    ],
    stack: ['PHP', 'JavaScript', 'React', 'Laravel', 'MariaDB', 'MySQL', 'Power BI', 'AWS'],
  },
  {
    company: 'Freelance',
    role: 'Desarrollador Web & Analista de Datos',
    period: '2024 – Presente',
    highlights: [
      'Apps full-stack React, Node.js, Django y PHP para e-commerce, servicios y educación',
      'Dashboards interactivos Power BI y Python (Plotly, Seaborn) para KPIs y toma de decisiones',
      'Modelos predictivos con Scikit-learn, R y SQL sobre grandes volúmenes de datos',
      'Ciclo completo: levantamiento de requerimientos, desarrollo, testing y despliegue en AWS/Vercel',
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

export const education: EducationItem[] = [
  { degree: 'Bachiller en Ingeniería Informática', institution: 'UNED, Costa Rica (Abr 2022 – Dic 2024)' },
  { degree: 'Técnico en Análisis de Datos', institution: 'Universidad Empresarial, Costa Rica (2025 – Actualidad)' },
  { degree: 'Técnico Medio en Informática en Soporte', institution: 'CTP Calle Zamora (2016 – 2018)' },
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

// ─── English ──────────────────────────────────────────────────────────────────

export const contactEn: ContactInfo = {
  name: 'Luis Calderón',
  role: 'Software Engineer | Full Stack Developer | Data Analyst',
  email: 'luiscalderontcit@gmail.com',
  phone: '+506 8339-1192',
  location: 'San Ramón, Alajuela · Costa Rica',
  linkedin: 'linkedin.com/in/luis-calderon-962a57258',
  portfolio: 'caldeseios.vercel.app',
  availability: 'Availability: Immediate',
};

export const summaryEn =
  'Software Engineer with 2+ years of experience specializing in full-stack development, ERP system implementation and data analysis. Expert in building scalable solutions using modern technologies (React, Laravel, Node.js, Python) with a focus on performance optimization and user experience. Proven track record developing complex ERP modules and interactive dashboards with Power BI and Python. Passionate about emerging technologies and agile methodologies.';

export const experienceEn: ExperienceItem[] = [
  {
    company: 'CSG',
    role: 'Software Engineer — Full Stack',
    period: 'April 2024 – Present',
    highlights: [
      'Tech lead for enterprise ERP: e-invoicing, inventory tracking, fixed assets and reporting',
      'Full POS system: multi-cashier, real-time transactions, cash reconciliation and automated daily close',
      'Payroll module: automated salary calculations, bonuses, severance and Excel report exports',
      'BI: Power BI & Python dashboards (EDA, heat maps, KPIs) for actionable management insights',
      'SQL optimization (MariaDB/MySQL): strategic indexing and refactor → up to 70% response time improvement',
    ],
    stack: ['PHP', 'JavaScript', 'React', 'Laravel', 'MariaDB', 'MySQL', 'Power BI', 'AWS'],
  },
  {
    company: 'Freelance',
    role: 'Web Developer & Data Analyst',
    period: '2024 – Present',
    highlights: [
      'Full-stack apps with React, Node.js, Django and PHP for e-commerce, services and education',
      'Interactive dashboards with Power BI and Python (Plotly, Seaborn) for KPIs and data-driven decisions',
      'Predictive models with Scikit-learn, R and SQL on large datasets',
      'Full project lifecycle: requirements, development, testing and deployment on AWS/Vercel',
    ],
    stack: ['React', 'Node.js', 'Django', 'Python', 'Tailwind CSS', 'Vercel'],
  },
  {
    company: 'Compu Servicios Gomez',
    role: 'IT Support Technician',
    period: 'Sep – Dec 2018',
    highlights: [
      'Hardware/software support for Windows and Linux systems',
      'Preventive maintenance, networking and system configuration',
    ],
    stack: ['Windows', 'Linux', 'Networking'],
  },
];

export const educationEn: EducationItem[] = [
  { degree: "Bachelor's in Computer Engineering", institution: 'UNED, Costa Rica (Apr 2022 – Dec 2024)' },
  { degree: 'Technical Degree in Data Analysis', institution: 'Universidad Empresarial, Costa Rica (2025 – Present)' },
  { degree: 'Vocational Tech: IT Support', institution: 'CTP Calle Zamora (2016 – 2018)' },
];

export const certificationsEn: string[] = [
  'Java & Spring Boot G4 — ONE | Alura LATAM & Oracle (2023)',
  'CCNA 1: Introduction to Networks | CTP Calle Zamora (2018)',
  'IT Essentials: PC Hardware and Software | CTP Calle Zamora (2016)',
];

export const languagesEn = [
  { name: 'Spanish', level: 'Native' },
  { name: 'English', level: 'Intermediate (B1)' },
];

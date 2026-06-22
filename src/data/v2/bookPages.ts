export type PageFace = 'cover' | 'index' | 'about' | 'tools' | 'experience' | 'education' | 'contact' | 'backcover';

export interface BookPage {
  leafIndex: number;    // 0-3 (which physical leaf)
  side: 'front' | 'back';
  face: PageFace;
  label: string;        // Human-readable name
}

export const bookPages: BookPage[] = [
  { leafIndex: 0, side: 'front', face: 'cover',      label: 'Portada' },
  { leafIndex: 0, side: 'back',  face: 'index',      label: 'Índice' },
  { leafIndex: 1, side: 'front', face: 'about',      label: 'Capítulo I — Quién soy' },
  { leafIndex: 1, side: 'back',  face: 'tools',      label: 'Capítulo II — Mis herramientas' },
  { leafIndex: 2, side: 'front', face: 'experience', label: 'Capítulo III — El bosque de proyectos' },
  { leafIndex: 2, side: 'back',  face: 'education',  label: 'Capítulo IV — Educación' },
  { leafIndex: 3, side: 'front', face: 'contact',    label: 'Epílogo — Contacto' },
  { leafIndex: 3, side: 'back',  face: 'backcover',  label: 'Contratapa' },
];

export const LEAF_COUNT = 4;

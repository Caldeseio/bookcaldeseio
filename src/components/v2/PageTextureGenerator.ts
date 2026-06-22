// PageTextureGenerator.ts
// Canvas-based texture generator for each page face of the 3D book.
// Client-side only — never called at SSR.

import type { ExperienceItem, EducationItem } from '../../data/v2/cvData';
import type { contact } from '../../data/v2/cvData';

export type PageFace =
  | 'cover'
  | 'index'
  | 'about'
  | 'tools'
  | 'experience'
  | 'education'
  | 'contact'
  | 'backcover';

export interface PageTextureData {
  contact: typeof contact;
  summary: string;
  experience: ExperienceItem[];
  education: EducationItem[];
  certifications: string[];
  languages: { name: string; level: string }[];
  skills: { name: string; branch: string }[];
}

// ─── Design tokens ────────────────────────────────────────────────────────────
const C = {
  leather: '#243024',
  gold: '#C9A24B',
  goldDark: '#B68A2E',
  parchCenter: '#F1E4C0',
  parchEdge: '#D9C293',
  ink: '#3c3120',
  chapterLabel: '#9c7a2a',
  dropCap: '#2B3A2C',
  pageNum: '#8a7a52',
  skillBorder: '#3A332A',
  skillDataBg: '#cfe0b0',
  dotSep: '#B68A2E',
  logoGreen: '#7FB07F',
} as const;

const W = 512;
const H = 704;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function makeCanvas(): HTMLCanvasElement {
  const el = document.createElement('canvas');
  el.width = W;
  el.height = H;
  return el;
}

function parchmentBg(ctx: CanvasRenderingContext2D) {
  const g = ctx.createRadialGradient(256, 200, 50, 256, 352, 300);
  g.addColorStop(0, C.parchCenter);
  g.addColorStop(1, C.parchEdge);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
}

function leatherBg(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = C.leather;
  ctx.fillRect(0, 0, W, H);
  // subtle dark vignette
  const v = ctx.createRadialGradient(256, 352, 100, 256, 352, 420);
  v.addColorStop(0, 'rgba(0,0,0,0)');
  v.addColorStop(1, 'rgba(0,0,0,0.35)');
  ctx.fillStyle = v;
  ctx.fillRect(0, 0, W, H);
}

function goldBorder(ctx: CanvasRenderingContext2D, inset = 24) {
  ctx.strokeStyle = C.gold;
  ctx.lineWidth = 2;
  ctx.strokeRect(inset, inset, W - inset * 2, H - inset * 2);
  ctx.strokeStyle = C.goldDark;
  ctx.lineWidth = 1;
  ctx.strokeRect(inset + 5, inset + 5, W - (inset + 5) * 2, H - (inset + 5) * 2);
}

function drawLogo(ctx: CanvasRenderingContext2D, cx: number, cy: number) {
  const R = 70;
  const halfGap = (38 * Math.PI) / 180; // 38° from right axis

  // C arc — opens to the RIGHT (anticlockwise from bottom-right to top-right)
  ctx.beginPath();
  ctx.arc(cx, cy, R, halfGap, -halfGap, true);
  ctx.strokeStyle = '#EDE9DB';
  ctx.lineWidth = 20;
  ctx.lineCap = 'round';
  ctx.setLineDash([]);
  ctx.stroke();

  // Green dot at top end of arc (angle = -halfGap)
  const dotX = cx + R * Math.cos(-halfGap);
  const dotY = cy + R * Math.sin(-halfGap);
  ctx.beginPath();
  ctx.arc(dotX, dotY, 11, 0, Math.PI * 2);
  ctx.fillStyle = '#4A8C5C';
  ctx.fill();
}

function pageNumber(ctx: CanvasRenderingContext2D, label: string) {
  ctx.font = '400 12px Cinzel';
  ctx.fillStyle = C.pageNum;
  ctx.textAlign = 'center';
  ctx.fillText(label, W / 2, H - 28);
}

function chapterLabel(ctx: CanvasRenderingContext2D, label: string, y = 52) {
  ctx.font = '400 11px Cinzel';
  ctx.fillStyle = C.chapterLabel;
  ctx.textAlign = 'center';
  ctx.letterSpacing = '0.2em';
  ctx.fillText(label, W / 2, y);
  ctx.letterSpacing = '0px';
}

function sectionTitle(ctx: CanvasRenderingContext2D, title: string, y: number) {
  ctx.font = '700 24px Cinzel';
  ctx.fillStyle = C.ink;
  ctx.textAlign = 'center';
  ctx.fillText(title, W / 2, y);
}

function goldDivider(ctx: CanvasRenderingContext2D, y: number, margin = 60) {
  ctx.beginPath();
  ctx.moveTo(margin, y);
  ctx.lineTo(W - margin, y);
  ctx.strokeStyle = C.goldDark;
  ctx.lineWidth = 1;
  ctx.stroke();
}

function dottedSeparator(ctx: CanvasRenderingContext2D, y: number, margin = 48) {
  ctx.save();
  ctx.setLineDash([2, 6]);
  ctx.beginPath();
  ctx.moveTo(margin, y);
  ctx.lineTo(W - margin, y);
  ctx.strokeStyle = C.dotSep;
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();
}

/** Wrap text into lines that fit maxWidth */
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let line = '';
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

/** Draw wrapped paragraph, returns next y */
function drawParagraph(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
): number {
  const lines = wrapText(ctx, text, maxWidth);
  for (const l of lines) {
    ctx.fillText(l, x, y);
    y += lineHeight;
  }
  return y;
}

// ─── Page renderers ───────────────────────────────────────────────────────────

function renderCover(ctx: CanvasRenderingContext2D, _data: PageTextureData) {
  leatherBg(ctx);
  goldBorder(ctx, 24);

  ctx.textAlign = 'center';

  // MMXXVI
  ctx.font = '400 13px Cinzel';
  ctx.fillStyle = C.gold;
  ctx.letterSpacing = '0.3em';
  ctx.fillText('MMXXVI', W / 2, 148);
  ctx.letterSpacing = '0px';

  // Logo
  drawLogo(ctx, W / 2, 252);

  // CALDESEIO
  ctx.font = '700 36px Cinzel';
  ctx.fillStyle = C.gold;
  ctx.fillText('CALDESEIO', W / 2, 370);

  // Currículum ilustrado
  ctx.font = 'italic 18px EB Garamond, Georgia, serif';
  ctx.fillStyle = '#9c8b60';
  ctx.fillText('Currículum ilustrado', W / 2, 400);

  // Divider
  goldDivider(ctx, 422, 80);

  // LUIS CALDERÓN J.
  ctx.font = '400 13px Cinzel';
  ctx.fillStyle = C.gold;
  ctx.letterSpacing = '0.1em';
  ctx.fillText('LUIS CALDERÓN J.', W / 2, 448);
  ctx.letterSpacing = '0px';
}

function renderBackcover(ctx: CanvasRenderingContext2D, _data: PageTextureData) {
  leatherBg(ctx);
  goldBorder(ctx, 24);
  drawLogo(ctx, W / 2, H / 2 - 20);

  ctx.font = '400 12px Cinzel';
  ctx.fillStyle = C.gold;
  ctx.textAlign = 'center';
  ctx.fillText('CALDESEIO', W / 2, H / 2 + 60);
}

function renderIndex(ctx: CanvasRenderingContext2D, _data: PageTextureData) {
  parchmentBg(ctx);
  ctx.textAlign = 'center';

  chapterLabel(ctx, '— CONTENIDO —', 52);
  goldDivider(ctx, 64, 80);

  ctx.font = '700 14px Cinzel';
  ctx.fillStyle = C.chapterLabel;
  ctx.fillText('UN MAPA DE MI MUNDO', W / 2, 98);

  goldDivider(ctx, 112, 80);

  const chapters = [
    ['Cap I', 'Quién soy', '1'],
    ['Cap II', 'Herramientas', '2'],
    ['Cap III', 'El bosque de proyectos', '3'],
    ['Cap IV', 'Educación & Formación', '4'],
    ['Epílogo', 'Contacto', '—'],
  ];

  let y = 158;
  ctx.textAlign = 'left';
  for (const [cap, title, pg] of chapters) {
    ctx.font = '400 12px Cinzel';
    ctx.fillStyle = C.ink;
    ctx.fillText(cap, 72, y);

    ctx.font = 'italic 15px EB Garamond, Georgia, serif';
    ctx.fillStyle = C.ink;
    ctx.fillText(title, 148, y);

    ctx.font = '400 12px Cinzel';
    ctx.fillStyle = C.pageNum;
    ctx.textAlign = 'right';
    ctx.fillText(pg, W - 72, y);
    ctx.textAlign = 'left';

    dottedSeparator(ctx, y + 10);
    y += 78;
  }

  pageNumber(ctx, 'índice');
}

function renderAbout(ctx: CanvasRenderingContext2D, data: PageTextureData) {
  parchmentBg(ctx);
  ctx.textAlign = 'center';

  chapterLabel(ctx, 'CAPÍTULO I', 52);
  sectionTitle(ctx, 'Quién soy', 88);
  goldDivider(ctx, 104, 60);

  // Drop cap
  const bodyX = 72;
  const bodyW = W - bodyX * 2;
  const dropSize = 64;

  ctx.font = `700 ${dropSize}px Cinzel`;
  ctx.fillStyle = C.dropCap;
  ctx.textAlign = 'left';
  ctx.fillText('S', bodyX, 172);

  // Summary text without the leading 'S'
  const rest = data.summary.slice(1);
  ctx.font = '400 15px EB Garamond, Georgia, serif';
  ctx.fillStyle = C.ink;

  // First lines beside drop cap
  const dropColX = bodyX + dropSize - 4;
  const dropColW = bodyW - (dropSize - 4);
  let y = 130;
  const lines1 = wrapText(ctx, rest, dropColW);
  const lh = 22;
  let i = 0;
  while (i < lines1.length && y < 182) {
    ctx.fillText(lines1[i], dropColX, y);
    y += lh;
    i++;
  }

  // remaining lines full width
  y = 180;
  ctx.textAlign = 'left';
  const remaining = lines1.slice(i);
  // re-wrap for full width
  const fullLines = wrapText(ctx, remaining.join(' '), bodyW);
  for (const l of fullLines) {
    if (y > 460) break;
    ctx.fillText(l, bodyX, y);
    y += lh;
  }

  // Quote
  y = Math.max(y + 20, 410);
  goldDivider(ctx, y - 10, 80);
  ctx.font = 'italic 15px EB Garamond, Georgia, serif';
  ctx.fillStyle = C.chapterLabel;
  ctx.textAlign = 'center';
  ctx.fillText('«Técnica, claridad y carácter.»', W / 2, y + 14);

  pageNumber(ctx, '— 1 —');
}

function renderTools(ctx: CanvasRenderingContext2D, data: PageTextureData) {
  parchmentBg(ctx);
  ctx.textAlign = 'center';

  chapterLabel(ctx, 'CAPÍTULO II', 52);
  sectionTitle(ctx, 'Mis herramientas', 88);

  ctx.font = 'italic 14px EB Garamond, Georgia, serif';
  ctx.fillStyle = C.ink;
  ctx.fillText('lo que llevo en la mochila', W / 2, 112);
  goldDivider(ctx, 126, 60);

  const top10 = data.skills.slice(0, 10);
  const cols = 2;
  const padX = 52;
  const cellW = (W - padX * 2 - 12) / cols;
  const cellH = 34;
  const startY = 148;

  for (let i = 0; i < top10.length; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = padX + col * (cellW + 12);
    const y = startY + row * (cellH + 8);
    const skill = top10[i];
    const isData = skill.branch === 'data';

    ctx.fillStyle = isData ? C.skillDataBg : C.parchCenter;
    ctx.strokeStyle = C.skillBorder;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(x, y, cellW, cellH, 4);
    ctx.fill();
    ctx.stroke();

    ctx.font = '400 13px Cinzel';
    ctx.fillStyle = C.ink;
    ctx.textAlign = 'left';
    ctx.fillText(skill.name, x + 10, y + 22);
  }

  // branch legend
  const legendY = startY + Math.ceil(top10.length / cols) * (cellH + 8) + 16;
  ctx.font = 'italic 11px EB Garamond, Georgia, serif';
  ctx.fillStyle = C.pageNum;
  ctx.textAlign = 'center';
  ctx.fillText('verde = datos & BI · blanco = fullstack / devops', W / 2, legendY);

  pageNumber(ctx, '— 2 —');
}

function renderExperience(ctx: CanvasRenderingContext2D, data: PageTextureData) {
  parchmentBg(ctx);
  ctx.textAlign = 'center';

  chapterLabel(ctx, 'CAPÍTULO III', 52);
  sectionTitle(ctx, 'El bosque de proyectos', 88);
  goldDivider(ctx, 104, 60);

  let y = 128;
  for (let i = 0; i < data.experience.length; i++) {
    const exp = data.experience[i];
    if (y > 630) break;

    ctx.font = '700 14px Cinzel';
    ctx.fillStyle = C.ink;
    ctx.textAlign = 'left';
    ctx.fillText(exp.company, 52, y);

    ctx.font = 'italic 13px EB Garamond, Georgia, serif';
    ctx.fillStyle = C.ink;
    y += 18;
    ctx.fillText(exp.role, 52, y);

    ctx.font = '400 11px Cinzel';
    ctx.fillStyle = C.pageNum;
    ctx.textAlign = 'right';
    ctx.fillText(exp.period, W - 52, y - 18);
    ctx.textAlign = 'left';

    ctx.font = '400 12px EB Garamond, Georgia, serif';
    ctx.fillStyle = C.ink;
    y += 16;
    const highlights = exp.highlights.slice(0, 2);
    for (const h of highlights) {
      const lines = wrapText(ctx, `• ${h}`, W - 104);
      for (const l of lines) {
        ctx.fillText(l, 52, y);
        y += 16;
      }
    }

    if (i < data.experience.length - 1) {
      dottedSeparator(ctx, y + 6);
      y += 22;
    }
  }

  pageNumber(ctx, '— 3 —');
}

function renderEducation(ctx: CanvasRenderingContext2D, data: PageTextureData) {
  parchmentBg(ctx);
  ctx.textAlign = 'center';

  chapterLabel(ctx, 'CAPÍTULO IV', 52);
  sectionTitle(ctx, 'Educación & Formación', 88);
  goldDivider(ctx, 104, 60);

  let y = 130;
  ctx.textAlign = 'left';
  for (const ed of data.education) {
    ctx.font = '700 13px Cinzel';
    ctx.fillStyle = C.ink;
    ctx.fillText(ed.degree, 52, y);
    y += 17;
    ctx.font = 'italic 13px EB Garamond, Georgia, serif';
    ctx.fillStyle = C.pageNum;
    ctx.fillText(ed.institution, 52, y);
    y += 22;
  }

  dottedSeparator(ctx, y + 4);
  y += 22;

  ctx.font = '700 12px Cinzel';
  ctx.fillStyle = C.chapterLabel;
  ctx.textAlign = 'center';
  ctx.fillText('CERTIFICACIONES', W / 2, y);
  y += 20;

  ctx.font = '400 12px EB Garamond, Georgia, serif';
  ctx.fillStyle = C.ink;
  ctx.textAlign = 'left';
  for (const cert of data.certifications) {
    const lines = wrapText(ctx, `· ${cert}`, W - 104);
    for (const l of lines) {
      ctx.fillText(l, 52, y);
      y += 16;
    }
    y += 2;
  }

  dottedSeparator(ctx, y + 4);
  y += 22;

  ctx.font = '700 12px Cinzel';
  ctx.fillStyle = C.chapterLabel;
  ctx.textAlign = 'center';
  ctx.fillText('IDIOMAS', W / 2, y);
  y += 20;

  ctx.font = '400 13px EB Garamond, Georgia, serif';
  ctx.fillStyle = C.ink;
  ctx.textAlign = 'left';
  for (const lang of data.languages) {
    ctx.fillText(`${lang.name} — ${lang.level}`, 52, y);
    y += 18;
  }

  pageNumber(ctx, '— 4 —');
}

function renderContact(ctx: CanvasRenderingContext2D, data: PageTextureData) {
  parchmentBg(ctx);
  ctx.textAlign = 'center';

  chapterLabel(ctx, 'EPÍLOGO', 52);
  sectionTitle(ctx, 'Contacto', 88);

  ctx.font = 'italic 14px EB Garamond, Georgia, serif';
  ctx.fillStyle = C.ink;
  ctx.fillText('así llegas a mi casa', W / 2, 112);

  goldDivider(ctx, 126, 60);

  // Simple house icon
  const hx = W / 2;
  const hy = 168;
  ctx.save();
  ctx.strokeStyle = C.goldDark;
  ctx.lineWidth = 2;
  ctx.fillStyle = 'rgba(185,138,46,0.12)';
  // roof
  ctx.beginPath();
  ctx.moveTo(hx - 22, hy);
  ctx.lineTo(hx, hy - 18);
  ctx.lineTo(hx + 22, hy);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  // walls
  ctx.strokeRect(hx - 16, hy, 32, 20);
  ctx.restore();

  const contactLines = [
    data.contact.email,
    data.contact.phone,
    data.contact.location,
    data.contact.linkedin,
    data.contact.portfolio,
    data.contact.availability,
  ];

  let y = 214;
  ctx.font = '400 15px EB Garamond, Georgia, serif';
  ctx.fillStyle = C.ink;
  ctx.textAlign = 'center';
  for (const line of contactLines) {
    ctx.fillText(line, W / 2, y);
    y += 26;
  }

  // Epilogue quote
  const quoteY = y + 16;
  goldDivider(ctx, quoteY - 6, 80);
  ctx.font = 'italic 13px EB Garamond, Georgia, serif';
  ctx.fillStyle = C.chapterLabel;
  ctx.textAlign = 'center';
  ctx.fillText('Ingeniería de datos, IA y la nube', W / 2, quoteY + 16);
  ctx.fillText('son el próximo capítulo.', W / 2, quoteY + 34);
  ctx.font = 'italic 11px EB Garamond, Georgia, serif';
  ctx.fillStyle = C.pageNum;
  ctx.fillText('La historia continúa.', W / 2, quoteY + 52);

  // bottom label
  ctx.font = '400 10px Cinzel';
  ctx.fillStyle = C.pageNum;
  ctx.letterSpacing = '0.15em';
  ctx.fillText('DIBUJADO POR LUIS C.', W / 2, H - 28);
  ctx.letterSpacing = '0px';
}

// ─── Public API ───────────────────────────────────────────────────────────────

export function generatePageTexture(
  face: PageFace,
  data: PageTextureData
): HTMLCanvasElement {
  const canvas = makeCanvas();
  const ctx = canvas.getContext('2d')!;

  switch (face) {
    case 'cover':      renderCover(ctx, data);      break;
    case 'backcover':  renderBackcover(ctx, data);  break;
    case 'index':      renderIndex(ctx, data);      break;
    case 'about':      renderAbout(ctx, data);      break;
    case 'tools':      renderTools(ctx, data);      break;
    case 'experience': renderExperience(ctx, data); break;
    case 'education':  renderEducation(ctx, data);  break;
    case 'contact':    renderContact(ctx, data);    break;
  }

  return canvas;
}

// PageTextureGenerator.ts
// Canvas-based texture generator for each page face of the 3D book.
// Client-side only — never called at SSR.

import type {
  ExperienceItem,
  EducationItem,
  ContactInfo,
} from "../../data/v2/cvData";

export type PageFace =
  | "cover"
  | "index"
  | "about"
  | "tools"
  | "experience"
  | "education"
  | "contact"
  | "backcover";

export interface PageTextureData {
  contact: ContactInfo;
  summary: string;
  experience: ExperienceItem[];
  education: EducationItem[];
  certifications: string[];
  languages: { name: string; level: string }[];
  skills: { name: string; branch: string }[];
  lang?: "es" | "en";
}

// ─── UI label bundles per language ───────────────────────────────────────────

const UI = {
  es: {
    coverSub: "Currículum ilustrado",
    contents: "— CONTENIDO —",
    mapTitle: "UN MAPA DE MI MUNDO",
    chapters: [
      ["Cap I", "Quién soy", "1"],
      ["Cap II", "Stack Técnico", "2"],
      ["Cap III", "El bosque de proyectos", "3"],
      ["Cap IV", "Educación & Formación", "4"],
      ["Epílogo", "Contacto", "—"],
    ],
    ch1label: "CAPÍTULO I",
    ch1title: "Quién soy",
    ch1quote: "«Técnica, claridad y carácter.»",
    ch2label: "CAPÍTULO II",
    ch2title: "Stack Técnico",
    ch2sub: "mi arsenal tecnológico",
    ch2legend: "verde = datos & BI · crema = código & devops",
    ch3label: "CAPÍTULO III",
    ch3title: "El bosque de proyectos",
    ch4label: "CAPÍTULO IV",
    ch4title: "Educación & Formación",
    certTitle: "CERTIFICACIONES",
    langTitle: "IDIOMAS",
    epilogLabel: "EPÍLOGO",
    epilogTitle: "Contacto",
    epilogSub: "así llegas a mi casa",
    quote1: "Ingeniería de datos, IA y la nube",
    quote2: "son el próximo capítulo.",
    quote3: "La historia continúa.",
    footer: "DIBUJADO POR LUIS C.",
  },
  en: {
    coverSub: "Illustrated Resume",
    contents: "— CONTENTS —",
    mapTitle: "A MAP OF MY WORLD",
    chapters: [
      ["Ch. I", "Who I Am", "1"],
      ["Ch. II", "Tech Stack", "2"],
      ["Ch. III", "Forest of Projects", "3"],
      ["Ch. IV", "Education & Training", "4"],
      ["Epilogue", "Contact", "—"],
    ],
    ch1label: "CHAPTER I",
    ch1title: "Who I Am",
    ch1quote: "«Technique, clarity and character.»",
    ch2label: "CHAPTER II",
    ch2title: "Tech Stack",
    ch2sub: "my technical arsenal",
    ch2legend: "green = data & BI · cream = code & devops",
    ch3label: "CHAPTER III",
    ch3title: "The Forest of Projects",
    ch4label: "CHAPTER IV",
    ch4title: "Education & Training",
    certTitle: "CERTIFICATIONS",
    langTitle: "LANGUAGES",
    epilogLabel: "EPILOGUE",
    epilogTitle: "Contact",
    epilogSub: "how to find me",
    quote1: "Data engineering, AI and the cloud",
    quote2: "are the next chapter.",
    quote3: "The story continues.",
    footer: "DRAWN BY LUIS C.",
  },
} as const;

// ─── Design tokens ────────────────────────────────────────────────────────────
const C = {
  leather: "#243024",
  gold: "#C9A24B",
  goldDark: "#B68A2E",
  parchCenter: "#F1E4C0",
  parchEdge: "#D9C293",
  ink: "#3c3120",
  //chapterLabel: "#9c7a2a",
  chapterLabel: "#000000",
  dropCap: "#2B3A2C",
  pageNum: "#4a3520",
  skillBorder: "#3A332A",
  skillDataBg: "#cfe0b0",
  dotSep: "#B68A2E",
  logoGreen: "#7FB07F",
} as const;

const W = 512; // logical coordinate space (unchanged — all coords stay the same)
const H = 704;
const PX = 2; // physical pixel multiplier — canvas renders at 2× for crisp text

// ─── Helpers ──────────────────────────────────────────────────────────────────

function makeCanvas(): HTMLCanvasElement {
  const el = document.createElement("canvas");
  el.width = W * PX;
  el.height = H * PX;
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
  v.addColorStop(0, "rgba(0,0,0,0)");
  v.addColorStop(1, "rgba(0,0,0,0.35)");
  ctx.fillStyle = v;
  ctx.fillRect(0, 0, W, H);
}

function goldBorder(ctx: CanvasRenderingContext2D, inset = 24) {
  ctx.strokeStyle = C.gold;
  ctx.lineWidth = 2;
  ctx.strokeRect(inset, inset, W - inset * 2, H - inset * 2);
  ctx.strokeStyle = C.goldDark;
  ctx.lineWidth = 1;
  ctx.strokeRect(
    inset + 5,
    inset + 5,
    W - (inset + 5) * 2,
    H - (inset + 5) * 2,
  );
}

function drawLogo(ctx: CanvasRenderingContext2D, cx: number, cy: number) {
  const R = 70;
  // halfGap = 45°: arc spans 270° (the C shape), gap is 90° centered on the right
  const halfGap = (45 * Math.PI) / 180;

  // C arc — clockwise (false) from lower-right (+45°) around the long way to upper-right (-45°)
  // anticlockwise=true would draw only the 90° gap, NOT the C — must use false here
  ctx.beginPath();
  ctx.arc(cx, cy, R, halfGap, -halfGap, false);
  ctx.strokeStyle = "#EDE9DB";
  ctx.lineWidth = 20;
  ctx.lineCap = "round";
  ctx.setLineDash([]);
  ctx.stroke();

  // Green dot at upper-right end of arc (angle = -halfGap = -45°)
  const dotX = cx + R * Math.cos(-halfGap);
  const dotY = cy + R * Math.sin(-halfGap);
  ctx.beginPath();
  ctx.arc(dotX, dotY, 12, 0, Math.PI * 2);
  ctx.fillStyle = "#4A8C5C";
  ctx.fill();
}

function pageNumber(ctx: CanvasRenderingContext2D, label: string) {
  ctx.font = "400 12px Cinzel";
  ctx.fillStyle = C.pageNum;
  ctx.textAlign = "center";
  ctx.fillText(label, W / 2, H - 28);
}

function chapterLabel(ctx: CanvasRenderingContext2D, label: string, y = 52) {
  ctx.font = "800 13px Cinzel";
  ctx.fillStyle = C.chapterLabel;
  ctx.textAlign = "center";
  ctx.letterSpacing = "0.2em";
  ctx.fillText(label, W / 2, y);
  ctx.letterSpacing = "0px";
}

function sectionTitle(ctx: CanvasRenderingContext2D, title: string, y: number) {
  ctx.font = "700 28px Cinzel";
  ctx.fillStyle = C.ink;
  ctx.textAlign = "center";
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

function dottedSeparator(
  ctx: CanvasRenderingContext2D,
  y: number,
  margin = 48,
) {
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
  maxWidth: number,
): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let line = "";
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
  lineHeight: number,
): number {
  const lines = wrapText(ctx, text, maxWidth);
  for (const l of lines) {
    ctx.fillText(l, x, y);
    y += lineHeight;
  }
  return y;
}

// ─── Page renderers ───────────────────────────────────────────────────────────

function renderCover(ctx: CanvasRenderingContext2D, data: PageTextureData) {
  const u = UI[data.lang ?? "es"];
  leatherBg(ctx);
  goldBorder(ctx, 24);

  ctx.textAlign = "center";

  ctx.font = "400 13px Cinzel";
  ctx.fillStyle = C.gold;
  ctx.letterSpacing = "0.3em";
  ctx.fillText("MMXXVI", W / 2, 148);
  ctx.letterSpacing = "0px";

  drawLogo(ctx, W / 2, 252);

  ctx.font = "700 36px Cinzel";
  ctx.fillStyle = C.gold;
  ctx.fillText("CALDESEIO", W / 2, 370);

  ctx.font = "italic 18px EB Garamond, Georgia, serif";
  ctx.fillStyle = "#9c8b60";
  ctx.fillText(u.coverSub, W / 2, 400);

  goldDivider(ctx, 422, 80);

  ctx.font = "400 13px Cinzel";
  ctx.fillStyle = C.gold;
  ctx.letterSpacing = "0.1em";
  ctx.fillText("LUIS CALDERÓN J.", W / 2, 448);
  ctx.letterSpacing = "0px";
}

function renderBackcover(
  ctx: CanvasRenderingContext2D,
  _data: PageTextureData,
) {
  leatherBg(ctx);
  goldBorder(ctx, 24);
  drawLogo(ctx, W / 2, H / 2 - 20);

  ctx.font = "400 12px Cinzel";
  ctx.fillStyle = C.gold;
  ctx.textAlign = "center";
  ctx.fillText("CALDESEIO", W / 2, H / 2 + 120);
}

function renderIndex(ctx: CanvasRenderingContext2D, data: PageTextureData) {
  const u = UI[data.lang ?? "es"];
  parchmentBg(ctx);
  ctx.textAlign = "center";

  chapterLabel(ctx, u.contents, 52);
  goldDivider(ctx, 64, 80);

  ctx.font = "700 14px Cinzel";
  ctx.fillStyle = C.chapterLabel;
  ctx.fillText(u.mapTitle, W / 2, 98);

  goldDivider(ctx, 112, 80);

  let y = 158;
  ctx.textAlign = "left";
  for (const [cap, title, pg] of u.chapters) {
    ctx.font = "400 12px Cinzel";
    ctx.fillStyle = C.ink;
    ctx.fillText(cap, 72, y);

    ctx.font = "italic 15px EB Garamond, Georgia, serif";
    ctx.fillStyle = C.ink;
    ctx.fillText(title, 148, y);

    ctx.font = "400 12px Cinzel";
    ctx.fillStyle = C.pageNum;
    ctx.textAlign = "right";
    ctx.fillText(pg, W - 72, y);
    ctx.textAlign = "left";

    dottedSeparator(ctx, y + 10);
    y += 78;
  }

  pageNumber(ctx, data.lang === "en" ? "index" : "índice");
}

function renderAbout(ctx: CanvasRenderingContext2D, data: PageTextureData) {
  const u = UI[data.lang ?? "es"];
  parchmentBg(ctx);
  ctx.textAlign = "center";

  chapterLabel(ctx, u.ch1label, 52);
  sectionTitle(ctx, u.ch1title, 88);
  goldDivider(ctx, 104, 60);

  // Drop cap
  const bodyX = 72;
  const bodyW = W - bodyX * 2;
  const dropSize = 64;

  ctx.font = `700 ${dropSize}px Cinzel`;
  ctx.fillStyle = C.dropCap;
  ctx.textAlign = "left";
  ctx.fillText("S", bodyX, 172);

  // Summary text without the leading 'S'
  const rest = data.summary.slice(1);
  ctx.font = "400 17px EB Garamond, Georgia, serif";
  ctx.fillStyle = C.ink;

  // First lines beside drop cap
  const dropColX = bodyX + dropSize - 4;
  const dropColW = bodyW - (dropSize - 4);
  let y = 130;
  const lines1 = wrapText(ctx, rest, dropColW);
  const lh = 24;
  let i = 0;
  while (i < lines1.length && y < 182) {
    ctx.fillText(lines1[i], dropColX, y);
    y += lh;
    i++;
  }

  // remaining lines full width — start below drop cap visual bottom (baseline 172 + padding)
  y = Math.max(y, 196);
  ctx.textAlign = "left";
  const remaining = lines1.slice(i);
  // re-wrap for full width
  const fullLines = wrapText(ctx, remaining.join(" "), bodyW);
  for (const l of fullLines) {
    if (y > 460) break;
    ctx.fillText(l, bodyX, y);
    y += lh;
  }

  // Quote
  y = Math.max(y + 20, 410);
  goldDivider(ctx, y - 10, 80);
  ctx.font = "italic 15px EB Garamond, Georgia, serif";
  ctx.fillStyle = C.chapterLabel;
  ctx.textAlign = "center";
  ctx.fillText(u.ch1quote, W / 2, y + 14);

  pageNumber(ctx, "— 1 —");
}

function renderTools(ctx: CanvasRenderingContext2D, data: PageTextureData) {
  const u = UI[data.lang ?? "es"];
  parchmentBg(ctx);
  ctx.textAlign = "center";

  chapterLabel(ctx, u.ch2label, 52);
  sectionTitle(ctx, u.ch2title, 88);

  ctx.font = "italic 16px EB Garamond, Georgia, serif";
  ctx.fillStyle = C.ink;
  ctx.fillText(u.ch2sub, W / 2, 112);
  goldDivider(ctx, 126, 60);

  const cols = 3;
  const padX = 40;
  const colGap = 10;
  const cellW = (W - padX * 2 - colGap * (cols - 1)) / cols;
  const cellH = 27;
  const rowGap = 7;
  const startY = 148;

  for (let i = 0; i < data.skills.length; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = padX + col * (cellW + colGap);
    const y = startY + row * (cellH + rowGap);
    const skill = data.skills[i];
    const isData = skill.branch === "data";

    ctx.fillStyle = isData ? C.skillDataBg : C.parchCenter;
    ctx.strokeStyle = C.skillBorder;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(x, y, cellW, cellH, 4);
    ctx.fill();
    ctx.stroke();

    ctx.font = "400 12px Cinzel, serif";
    ctx.fillStyle = C.ink;
    ctx.textAlign = "left";
    ctx.fillText(skill.name, x + 8, y + 19);
  }

  // branch legend
  const legendY = startY + Math.ceil(data.skills.length / cols) * (cellH + rowGap) + 14;
  ctx.font = "italic 11px EB Garamond, Georgia, serif";
  ctx.fillStyle = C.pageNum;
  ctx.textAlign = "center";
  ctx.fillText(u.ch2legend, W / 2, legendY);

  pageNumber(ctx, "— 2 —");
}

function renderExperience(
  ctx: CanvasRenderingContext2D,
  data: PageTextureData,
) {
  const u = UI[data.lang ?? "es"];
  parchmentBg(ctx);
  ctx.textAlign = "center";

  chapterLabel(ctx, u.ch3label, 52);
  sectionTitle(ctx, u.ch3title, 88);
  goldDivider(ctx, 104, 60);

  let y = 128;
  for (let i = 0; i < data.experience.length; i++) {
    const exp = data.experience[i];
    if (y > 630) break;

    ctx.font = "700 15px Cinzel";
    ctx.fillStyle = C.ink;
    ctx.textAlign = "left";
    ctx.fillText(exp.company, 52, y);

    ctx.font = "italic 15px EB Garamond, Georgia, serif";
    ctx.fillStyle = C.ink;
    y += 20;
    ctx.fillText(exp.role, 52, y);

    ctx.font = "400 12px Cinzel";
    ctx.fillStyle = C.pageNum;
    ctx.textAlign = "right";
    ctx.fillText(exp.period, W - 52, y - 20);
    ctx.textAlign = "left";

    ctx.font = "400 14px EB Garamond, Georgia, serif";
    ctx.fillStyle = C.ink;
    y += 18;
    const highlights = exp.highlights.slice(0, 3);
    for (const h of highlights) {
      const lines = wrapText(ctx, `• ${h}`, W - 104);
      for (const l of lines) {
        ctx.fillText(l, 52, y);
        y += 18;
      }
    }

    if (i < data.experience.length - 1) {
      dottedSeparator(ctx, y + 6);
      y += 22;
    }
  }

  pageNumber(ctx, "— 3 —");
}

function renderEducation(ctx: CanvasRenderingContext2D, data: PageTextureData) {
  const u = UI[data.lang ?? "es"];
  parchmentBg(ctx);
  ctx.textAlign = "center";

  chapterLabel(ctx, u.ch4label, 52);
  sectionTitle(ctx, u.ch4title, 88);
  goldDivider(ctx, 104, 60);

  let y = 130;
  ctx.textAlign = "left";
  for (const ed of data.education) {
    ctx.font = "700 15px Cinzel";
    ctx.fillStyle = C.ink;
    ctx.fillText(ed.degree, 52, y);
    y += 20;
    ctx.font = "italic 15px EB Garamond, Georgia, serif";
    ctx.fillStyle = C.pageNum;
    ctx.fillText(ed.institution, 52, y);
    y += 24;
  }

  dottedSeparator(ctx, y + 4);
  y += 22;

  ctx.font = "700 12px Cinzel";
  ctx.fillStyle = C.chapterLabel;
  ctx.textAlign = "center";
  ctx.fillText(u.certTitle, W / 2, y);
  y += 20;

  ctx.font = "400 14px EB Garamond, Georgia, serif";
  ctx.fillStyle = C.ink;
  ctx.textAlign = "left";
  for (const cert of data.certifications) {
    const lines = wrapText(ctx, `· ${cert}`, W - 104);
    for (const l of lines) {
      ctx.fillText(l, 52, y);
      y += 18;
    }
    y += 2;
  }

  dottedSeparator(ctx, y + 4);
  y += 22;

  ctx.font = "700 12px Cinzel";
  ctx.fillStyle = C.chapterLabel;
  ctx.textAlign = "center";
  ctx.fillText(u.langTitle, W / 2, y);
  y += 20;

  ctx.font = "400 15px EB Garamond, Georgia, serif";
  ctx.fillStyle = C.ink;
  ctx.textAlign = "left";
  for (const lang of data.languages) {
    ctx.fillText(`${lang.name} — ${lang.level}`, 52, y);
    y += 20;
  }

  pageNumber(ctx, "— 4 —");
}

function renderContact(ctx: CanvasRenderingContext2D, data: PageTextureData) {
  const u = UI[data.lang ?? "es"];
  parchmentBg(ctx);
  ctx.textAlign = "center";

  chapterLabel(ctx, u.epilogLabel, 52);
  sectionTitle(ctx, u.epilogTitle, 88);

  ctx.font = "italic 14px EB Garamond, Georgia, serif";
  ctx.fillStyle = C.ink;
  ctx.fillText(u.epilogSub, W / 2, 112);

  goldDivider(ctx, 126, 60);

  // Simple house icon
  const hx = W / 2;
  const hy = 168;
  ctx.save();
  ctx.strokeStyle = C.goldDark;
  ctx.lineWidth = 2;
  ctx.fillStyle = "rgba(185,138,46,0.12)";
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
  ctx.font = "400 17px EB Garamond, Georgia, serif";
  ctx.fillStyle = C.ink;
  ctx.textAlign = "center";
  for (const line of contactLines) {
    ctx.fillText(line, W / 2, y);
    y += 28;
  }

  // Epilogue quote
  const quoteY = y + 16;
  goldDivider(ctx, quoteY - 6, 80);
  ctx.font = "italic 13px EB Garamond, Georgia, serif";
  ctx.fillStyle = C.chapterLabel;
  ctx.textAlign = "center";
  ctx.fillText(u.quote1, W / 2, quoteY + 16);
  ctx.fillText(u.quote2, W / 2, quoteY + 34);
  ctx.font = "italic 11px EB Garamond, Georgia, serif";
  ctx.fillStyle = C.pageNum;
  ctx.fillText(u.quote3, W / 2, quoteY + 52);

  ctx.font = "400 10px Cinzel";
  ctx.fillStyle = C.pageNum;
  ctx.letterSpacing = "0.15em";
  ctx.fillText(u.footer, W / 2, H - 28);
  ctx.letterSpacing = "0px";
}

// ─── Public API ───────────────────────────────────────────────────────────────

export function generatePageTexture(
  face: PageFace,
  data: PageTextureData,
): HTMLCanvasElement {
  const canvas = makeCanvas();
  const ctx = canvas.getContext("2d")!;
  // Scale all drawing into the physical pixel space so logical coords still work
  ctx.scale(PX, PX);

  switch (face) {
    case "cover":
      renderCover(ctx, data);
      break;
    case "backcover":
      renderBackcover(ctx, data);
      break;
    case "index":
      renderIndex(ctx, data);
      break;
    case "about":
      renderAbout(ctx, data);
      break;
    case "tools":
      renderTools(ctx, data);
      break;
    case "experience":
      renderExperience(ctx, data);
      break;
    case "education":
      renderEducation(ctx, data);
      break;
    case "contact":
      renderContact(ctx, data);
      break;
  }

  return canvas;
}

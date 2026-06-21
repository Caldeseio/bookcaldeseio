// bookPageTextures.ts
// 10 canvas texture generators for The Book of Caldeseio (512×683 px each)

const W = 512
const H = 683

const PARCHMENT = '#F4EDE3'
const INK       = '#2C1810'
const GOLD      = '#C9A84C'
const AMBER     = '#E8903A'
const SAGE      = '#4F9D5B'
const RUST      = '#8B3A2A'

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

function makeCanvas(): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const canvas = document.createElement('canvas')
  canvas.width  = W
  canvas.height = H
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
  return [canvas, ctx]
}

function drawBase(ctx: CanvasRenderingContext2D, w: number, h: number): void {
  // 1. Cream fill
  ctx.fillStyle = PARCHMENT
  ctx.fillRect(0, 0, w, h)

  // 2. Paper grain: 200 random small dots
  ctx.save()
  for (let i = 0; i < 200; i++) {
    ctx.fillStyle = 'rgba(100,60,20,0.04)'
    ctx.beginPath()
    ctx.arc(Math.random() * w, Math.random() * h, 0.8, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.restore()

  // 3. Ornamental double border
  ctx.strokeStyle = GOLD
  ctx.lineWidth = 3
  ctx.strokeRect(8, 8, w - 16, h - 16)
  ctx.lineWidth = 1
  ctx.strokeRect(16, 16, w - 32, h - 32)
}

function drawCornerFlourishes(ctx: CanvasRenderingContext2D, w: number, h: number): void {
  ctx.strokeStyle = GOLD
  ctx.lineWidth = 2
  const corners: [number, number][] = [
    [30, 30],
    [w - 30, 30],
    [30, h - 30],
    [w - 30, h - 30],
  ]
  for (const [cx, cy] of corners) {
    ctx.beginPath()
    ctx.arc(cx, cy, 30, 0, Math.PI * 2)
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(cx, cy, 18, 0, Math.PI * 2)
    ctx.stroke()
  }
}

function seededRandom(seed: number): number {
  return (((Math.sin(seed) * 9301 + 49297) % 233280) + 233280) % 233280 / 233280
}

// ---------------------------------------------------------------------------
// 1. Cover
// ---------------------------------------------------------------------------

export function drawCover(): HTMLCanvasElement {
  const [canvas, ctx] = makeCanvas()
  drawBase(ctx, W, H)
  drawCornerFlourishes(ctx, W, H)

  // "THE BOOK OF"
  ctx.fillStyle = INK
  ctx.font = '13px monospace'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('THE BOOK OF', W / 2, 180)

  // "Caldeseio"
  ctx.fillStyle = INK
  ctx.font = 'bold 68px Georgia,serif'
  ctx.textAlign = 'center'
  ctx.fillText('Caldeseio', W / 2, 300)

  // Gold divider
  ctx.fillStyle = GOLD
  ctx.fillRect(156, 325, 200, 2)

  // ✦ symbol
  ctx.fillStyle = GOLD
  ctx.font = '16px serif'
  ctx.textAlign = 'center'
  ctx.fillText('✦', W / 2, 345)

  // "Luis Calderón"
  ctx.fillStyle = INK
  ctx.font = 'italic 20px Georgia,serif'
  ctx.textAlign = 'center'
  ctx.fillText('Luis Calderón', W / 2, 370)

  // "Portfolio 2026"
  ctx.fillStyle = GOLD
  ctx.font = '12px monospace'
  ctx.textAlign = 'center'
  ctx.fillText('Portfolio 2026', W / 2, 400)

  return canvas
}

// ---------------------------------------------------------------------------
// 2. Back Cover
// ---------------------------------------------------------------------------

export function drawBackCover(): HTMLCanvasElement {
  const [canvas, ctx] = makeCanvas()
  drawBase(ctx, W, H)
  drawCornerFlourishes(ctx, W, H)

  ctx.fillStyle = INK
  ctx.font = 'italic 56px Georgia,serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('fin.', W / 2, 341)

  return canvas
}

// ---------------------------------------------------------------------------
// 3. Chapter I Left — title page
// ---------------------------------------------------------------------------

export function drawCh1Left(): HTMLCanvasElement {
  const [canvas, ctx] = makeCanvas()
  drawBase(ctx, W, H)

  // Red margin line
  ctx.strokeStyle = 'rgba(180,60,60,0.3)'
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(56, 24)
  ctx.lineTo(56, H - 24)
  ctx.stroke()

  // "I" watermark
  ctx.fillStyle = 'rgba(201,168,76,0.12)'
  ctx.font = 'bold 200px Georgia,serif'
  ctx.textAlign = 'right'
  ctx.textBaseline = 'middle'
  ctx.fillText('I', W - 20, H * 0.55)

  // "El Analista"
  ctx.fillStyle = INK
  ctx.font = 'bold 40px Georgia,serif'
  ctx.textAlign = 'center'
  ctx.fillText('El Analista', W / 2, 240)

  // "The Analyst"
  ctx.fillStyle = SAGE
  ctx.font = 'italic 18px Georgia,serif'
  ctx.textAlign = 'center'
  ctx.fillText('The Analyst', W / 2, 285)

  // Gold rule
  ctx.fillStyle = GOLD
  ctx.fillRect(80, 310, 352, 2)

  // Quote lines
  ctx.fillStyle = INK
  ctx.font = '15px Georgia,serif'
  ctx.textAlign = 'center'
  ctx.fillText('SQL, Python y Power BI', W / 2, 350)
  ctx.fillText('transforman números', W / 2, 376)
  ctx.fillText('en decisiones.', W / 2, 402)

  // Footer ruled lines
  ctx.strokeStyle = 'rgba(100,60,20,0.12)'
  ctx.lineWidth = 1
  for (let i = 0; i < 7; i++) {
    const y = 490 + i * 26
    ctx.beginPath()
    ctx.moveTo(56, y)
    ctx.lineTo(W - 24, y)
    ctx.stroke()
  }

  return canvas
}

// ---------------------------------------------------------------------------
// 4. Chapter I Right — Skills spread
// ---------------------------------------------------------------------------

export function drawCh1Right(): HTMLCanvasElement {
  const [canvas, ctx] = makeCanvas()
  drawBase(ctx, W, H)

  // Header
  ctx.fillStyle = GOLD
  ctx.font = 'bold 18px Georgia,serif'
  ctx.textAlign = 'left'
  ctx.textBaseline = 'middle'
  ctx.fillText('Habilidades Técnicas', 40, 55)

  // Underline
  ctx.fillStyle = GOLD
  ctx.fillRect(40, 66, 200, 1.5)

  // Skill bars
  const skills = [
    { label: 'Power BI',   pct: 0.90, color: GOLD },
    { label: 'MySQL',      pct: 0.90, color: SAGE },
    { label: 'Python',     pct: 0.88, color: '#76B877' },
    { label: 'SQL Server', pct: 0.70, color: '#AFC3B2' },
    { label: 'R',          pct: 0.66, color: AMBER },
  ]

  let y = 110
  for (const skill of skills) {
    // Label
    ctx.fillStyle = INK
    ctx.font = '14px sans-serif'
    ctx.textAlign = 'left'
    ctx.fillText(skill.label, 40, y - 8)

    // BG bar
    ctx.fillStyle = skill.color + '22'
    ctx.fillRect(40, y, 360, 22)

    // Fill bar
    ctx.fillStyle = skill.color + 'CC'
    ctx.fillRect(40, y, skill.pct * 360, 22)

    // Pct text
    ctx.fillStyle = GOLD
    ctx.font = '11px monospace'
    ctx.textAlign = 'right'
    ctx.fillText(Math.round(skill.pct * 100) + '%', 408, y + 15)

    y += 96
  }

  // Certifications header
  ctx.fillStyle = GOLD
  ctx.font = 'bold 14px Georgia,serif'
  ctx.textAlign = 'left'
  ctx.fillText('Certificaciones', 40, 605)

  // Bullet items
  ctx.fillStyle = INK
  ctx.font = '12px Georgia,serif'
  ctx.fillText('· Análisis de Datos',       40, 625)
  ctx.fillText('· Business Intelligence',   40, 641)
  ctx.fillText('· Power Platform',          40, 657)

  return canvas
}

// ---------------------------------------------------------------------------
// 5. Chapter II Left — title page
// ---------------------------------------------------------------------------

export function drawCh2Left(): HTMLCanvasElement {
  const [canvas, ctx] = makeCanvas()
  drawBase(ctx, W, H)

  // "II" watermark
  ctx.fillStyle = 'rgba(201,168,76,0.12)'
  ctx.font = 'bold 200px Georgia,serif'
  ctx.textAlign = 'right'
  ctx.textBaseline = 'middle'
  ctx.fillText('II', W - 20, H * 0.55)

  // "El Desarrollador"
  ctx.fillStyle = INK
  ctx.font = 'bold 40px Georgia,serif'
  ctx.textAlign = 'center'
  ctx.fillText('El Desarrollador', W / 2, 240)

  // "The Developer"
  ctx.fillStyle = SAGE
  ctx.font = 'italic 18px Georgia,serif'
  ctx.textAlign = 'center'
  ctx.fillText('The Developer', W / 2, 285)

  // Gold rule
  ctx.fillStyle = GOLD
  ctx.fillRect(80, 310, 352, 2)

  // Tech constellation
  const nodes = [
    { label: 'PHP',     x: 110, y: 470, color: GOLD  },
    { label: 'Laravel', x: 230, y: 445, color: RUST  },
    { label: 'JS',      x: 330, y: 475, color: AMBER },
    { label: 'React',   x: 420, y: 450, color: SAGE  },
    { label: 'SQL',     x: 160, y: 530, color: RUST  },
    { label: 'Node.js', x: 370, y: 535, color: SAGE  },
  ]
  const connections = [[0,1],[1,2],[2,3],[3,5],[0,4],[4,2]]

  // Draw connections
  ctx.strokeStyle = 'rgba(201,168,76,0.35)'
  ctx.lineWidth = 1
  for (const [a, b] of connections) {
    ctx.beginPath()
    ctx.moveTo(nodes[a].x, nodes[a].y)
    ctx.lineTo(nodes[b].x, nodes[b].y)
    ctx.stroke()
  }

  // Draw circles and labels
  for (const node of nodes) {
    // Circle fill
    ctx.fillStyle = node.color + '33'
    ctx.beginPath()
    ctx.arc(node.x, node.y, 22, 0, Math.PI * 2)
    ctx.fill()

    // Circle stroke
    ctx.strokeStyle = node.color
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.arc(node.x, node.y, 22, 0, Math.PI * 2)
    ctx.stroke()

    // Label
    ctx.fillStyle = INK
    ctx.font = '10px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(node.label, node.x, node.y)
  }

  return canvas
}

// ---------------------------------------------------------------------------
// 6. Chapter II Right — Projects spread
// ---------------------------------------------------------------------------

export function drawCh2Right(): HTMLCanvasElement {
  const [canvas, ctx] = makeCanvas()
  drawBase(ctx, W, H)

  // Header
  ctx.fillStyle = GOLD
  ctx.font = 'bold 18px Georgia,serif'
  ctx.textAlign = 'left'
  ctx.textBaseline = 'middle'
  ctx.fillText('Proyectos Destacados', 40, 55)

  // Underline
  ctx.fillStyle = GOLD
  ctx.fillRect(40, 66, 200, 1.5)

  // --- Card 1 ---
  const c1x = 30, c1y = 85, c1w = 452, c1h = 210
  ctx.fillStyle = 'rgba(44,24,16,0.05)'
  ctx.fillRect(c1x, c1y, c1w, c1h)
  ctx.strokeStyle = GOLD + '66'
  ctx.lineWidth = 1
  ctx.strokeRect(c1x, c1y, c1w, c1h)

  ctx.fillStyle = INK
  ctx.font = 'bold 18px Georgia,serif'
  ctx.textAlign = 'left'
  ctx.fillText('Sistema de Planilla', 50, 125)

  ctx.fillStyle = SAGE
  ctx.font = '12px monospace'
  ctx.fillText('PHP · Laravel · MySQL', 50, 150)

  ctx.fillStyle = INK
  ctx.font = '13px Georgia,serif'
  ctx.fillText('Sistema de gestión de planilla y', 50, 178)
  ctx.fillText('control de asistencia empresarial.', 50, 198)

  // Badge
  ctx.fillStyle = SAGE + 'CC'
  ctx.fillRect(50, 222, 105, 22)
  ctx.fillStyle = PARCHMENT
  ctx.font = '10px monospace'
  ctx.textAlign = 'center'
  ctx.fillText('EN PRODUCCIÓN', 50 + 52.5, 237)

  // --- Card 2 ---
  const c2x = 30, c2y = 320, c2w = 452, c2h = 150
  ctx.fillStyle = 'rgba(44,24,16,0.05)'
  ctx.fillRect(c2x, c2y, c2w, c2h)
  ctx.strokeStyle = GOLD + '66'
  ctx.lineWidth = 1
  ctx.strokeRect(c2x, c2y, c2w, c2h)

  ctx.fillStyle = INK
  ctx.font = 'bold 16px Georgia,serif'
  ctx.textAlign = 'left'
  ctx.fillText('Portal Clientes', 50, 358)

  ctx.fillStyle = SAGE
  ctx.font = '12px monospace'
  ctx.fillText('PHP · Laravel · API REST', 50, 378)

  ctx.fillStyle = INK
  ctx.font = '13px Georgia,serif'
  ctx.fillText('Portal de autogestión para clientes', 50, 400)

  // Badge card 2
  ctx.fillStyle = AMBER + 'CC'
  ctx.fillRect(50, 415, 118, 22)
  ctx.fillStyle = PARCHMENT
  ctx.font = '10px monospace'
  ctx.textAlign = 'center'
  ctx.fillText('EN DESARROLLO', 50 + 59, 430)

  // Footer
  ctx.fillStyle = GOLD
  ctx.font = 'italic 12px Georgia,serif'
  ctx.textAlign = 'left'
  ctx.fillText('Ver más en GitHub →', 40, 630)

  return canvas
}

// ---------------------------------------------------------------------------
// 7. Chapter III Left — title page
// ---------------------------------------------------------------------------

export function drawCh3Left(): HTMLCanvasElement {
  const [canvas, ctx] = makeCanvas()
  drawBase(ctx, W, H)

  // "III" watermark (150px — shorter to fit)
  ctx.fillStyle = 'rgba(201,168,76,0.12)'
  ctx.font = 'bold 150px Georgia,serif'
  ctx.textAlign = 'right'
  ctx.textBaseline = 'middle'
  ctx.fillText('III', W - 20, H * 0.55)

  // "El Arquitecto SaaS"
  ctx.fillStyle = INK
  ctx.font = 'bold 36px Georgia,serif'
  ctx.textAlign = 'center'
  ctx.fillText('El Arquitecto SaaS', W / 2, 240)

  // "The SaaS Architect"
  ctx.fillStyle = SAGE
  ctx.font = 'italic 16px Georgia,serif'
  ctx.textAlign = 'center'
  ctx.fillText('The SaaS Architect', W / 2, 283)

  // Gold rule
  ctx.fillStyle = GOLD
  ctx.fillRect(80, 310, 352, 2)

  // Hub-spoke diagram centered at (256, 490)
  const centerX = 256
  const centerY = 490

  // Center circle
  ctx.fillStyle = GOLD
  ctx.beginPath()
  ctx.arc(centerX, centerY, 28, 0, Math.PI * 2)
  ctx.fill()
  ctx.strokeStyle = INK
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.arc(centerX, centerY, 28, 0, Math.PI * 2)
  ctx.stroke()

  // Spokes and outer nodes
  const angles = [0, Math.PI * 0.4, Math.PI * 0.8, Math.PI * 1.2, Math.PI * 1.6]
  for (let i = 0; i < angles.length; i++) {
    const a = angles[i]
    const nx = centerX + Math.cos(a) * 95
    const ny = centerY + Math.sin(a) * 52

    // Connection line
    ctx.strokeStyle = 'rgba(201,168,76,0.5)'
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.lineTo(nx, ny)
    ctx.stroke()

    // Outer circle
    ctx.fillStyle = SAGE + 'AA'
    ctx.beginPath()
    ctx.arc(nx, ny, 16, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = SAGE
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.arc(nx, ny, 16, 0, Math.PI * 2)
    ctx.stroke()

    // Label
    ctx.fillStyle = INK
    ctx.font = '9px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'top'
    ctx.fillText('Empresa' + (i + 1), nx, ny + 20)
  }

  return canvas
}

// ---------------------------------------------------------------------------
// 8. Chapter III Right — Platform spread
// ---------------------------------------------------------------------------

export function drawCh3Right(): HTMLCanvasElement {
  const [canvas, ctx] = makeCanvas()
  drawBase(ctx, W, H)

  // Header
  ctx.fillStyle = GOLD
  ctx.font = 'bold 18px Georgia,serif'
  ctx.textAlign = 'left'
  ctx.textBaseline = 'middle'
  ctx.fillText('Plataforma', 40, 55)

  // Underline
  ctx.fillStyle = GOLD
  ctx.fillRect(40, 66, 200, 1.5)

  // Dark widget panel
  ctx.fillStyle = '#1A0E08'  // warm dark brown instead of cold dark green
  ctx.fillRect(30, 85, 452, 185)
  ctx.strokeStyle = GOLD
  ctx.lineWidth = 2
  ctx.strokeRect(30, 85, 452, 185)

  ctx.fillStyle = GOLD
  ctx.font = 'bold 17px monospace'
  ctx.textAlign = 'center'
  ctx.fillText('SISTEMA DE PLANILLA', W / 2, 125)

  ctx.fillStyle = 'rgba(201,168,76,0.6)'
  ctx.fillRect(80, 138, 352, 1)

  ctx.fillStyle = SAGE
  ctx.font = '13px monospace'
  ctx.textAlign = 'center'
  ctx.fillText('247 empleados activos', W / 2, 170)

  ctx.fillStyle = PARCHMENT
  ctx.font = '28px monospace'
  ctx.textAlign = 'center'
  ctx.fillText('09:00 AM', W / 2, 215)

  // Feature list
  const features = [
    '✦ Multi-tenant',
    '✦ Biometría',
    '✦ Control de Asistencia',
    '✦ Gestión de RRHH',
  ]
  let fy = 300
  for (const feat of features) {
    ctx.fillStyle = INK
    ctx.font = '13px Georgia,serif'
    ctx.textAlign = 'left'
    // Draw gold star separately for clarity
    ctx.fillStyle = GOLD
    ctx.fillText('✦', 40, fy)
    ctx.fillStyle = INK
    ctx.fillText(feat.slice(2), 58, fy)
    fy += 36
  }

  // Italic footer quote
  ctx.fillStyle = GOLD
  ctx.font = 'italic 13px Georgia,serif'
  ctx.textAlign = 'center'
  ctx.fillText('"Una plataforma, decenas de empresas."', W / 2, 620)

  return canvas
}

// ---------------------------------------------------------------------------
// 9. Chapter IV Left — title page
// ---------------------------------------------------------------------------

export function drawCh4Left(): HTMLCanvasElement {
  const [canvas, ctx] = makeCanvas()
  drawBase(ctx, W, H)

  // "IV" watermark (150px)
  ctx.fillStyle = 'rgba(201,168,76,0.12)'
  ctx.font = 'bold 150px Georgia,serif'
  ctx.textAlign = 'right'
  ctx.textBaseline = 'middle'
  ctx.fillText('IV', W - 20, H * 0.55)

  // "El Futuro"
  ctx.fillStyle = INK
  ctx.font = 'bold 40px Georgia,serif'
  ctx.textAlign = 'center'
  ctx.fillText('El Futuro', W / 2, 240)

  // "The Future"
  ctx.fillStyle = SAGE
  ctx.font = 'italic 18px Georgia,serif'
  ctx.textAlign = 'center'
  ctx.fillText('The Future', W / 2, 285)

  // Gold rule
  ctx.fillStyle = GOLD
  ctx.fillRect(80, 310, 352, 2)

  // Neural constellation
  const nodeCount = 20
  const nodePositions: [number, number][] = []
  for (let i = 0; i < nodeCount; i++) {
    const nx = 100 + seededRandom(i * 2) * 312
    const ny = 400 + seededRandom(i * 2 + 1) * 230
    nodePositions.push([nx, ny])
  }

  // Connections: draw if distance < 85px
  ctx.strokeStyle = 'rgba(201,168,76,0.3)'
  ctx.lineWidth = 0.8
  for (let a = 0; a < nodeCount; a++) {
    for (let b = a + 1; b < nodeCount; b++) {
      const dx = nodePositions[a][0] - nodePositions[b][0]
      const dy = nodePositions[a][1] - nodePositions[b][1]
      if (Math.sqrt(dx * dx + dy * dy) < 85) {
        ctx.beginPath()
        ctx.moveTo(nodePositions[a][0], nodePositions[a][1])
        ctx.lineTo(nodePositions[b][0], nodePositions[b][1])
        ctx.stroke()
      }
    }
  }

  // Nodes
  for (let i = 0; i < nodeCount; i++) {
    ctx.fillStyle = i % 2 === 0 ? GOLD : AMBER
    ctx.beginPath()
    ctx.arc(nodePositions[i][0], nodePositions[i][1], 3, 0, Math.PI * 2)
    ctx.fill()
  }

  return canvas
}

// ---------------------------------------------------------------------------
// 10. Chapter IV Right — Contact page
// ---------------------------------------------------------------------------

export function drawCh4Right(): HTMLCanvasElement {
  const [canvas, ctx] = makeCanvas()
  drawBase(ctx, W, H)

  // Header
  ctx.fillStyle = GOLD
  ctx.font = 'bold 18px Georgia,serif'
  ctx.textAlign = 'left'
  ctx.textBaseline = 'middle'
  ctx.fillText('Contacto', 40, 55)

  // Underline
  ctx.fillStyle = GOLD
  ctx.fillRect(40, 66, 200, 1.5)

  // Contact rows
  const contacts = [
    { label: 'EMAIL',     value: 'luiscalderontcit@gmail.com' },
    { label: 'LINKEDIN',  value: 'linkedin.com/in/caldeseio' },
    { label: 'GITHUB',    value: 'github.com/Caldeseio' },
    { label: 'INSTAGRAM', value: '@caldeseio' },
  ]
  const rowYs = [120, 210, 300, 390]

  for (let i = 0; i < contacts.length; i++) {
    const { label, value } = contacts[i]
    const y = rowYs[i]

    // Label with manual 2px letter spacing approximation
    ctx.fillStyle = GOLD
    ctx.font = '9px monospace'
    ctx.textAlign = 'left'
    let lx = 40
    for (const char of label) {
      ctx.fillText(char, lx, y)
      lx += (ctx.measureText(char).width || 6) + 2
    }

    // Value
    ctx.fillStyle = INK
    ctx.font = '14px Georgia,serif'
    ctx.textAlign = 'left'
    ctx.fillText(value, 40, y + 20)

    // Separator
    ctx.fillStyle = 'rgba(201,168,76,0.25)'
    ctx.fillRect(40, y + 36, 432, 1)
  }

  // CV download box
  ctx.strokeStyle = GOLD
  ctx.lineWidth = 1.5
  ctx.strokeRect(146, 470, 220, 38)
  ctx.fillStyle = GOLD
  ctx.font = '12px monospace'
  ctx.textAlign = 'center'
  ctx.fillText('↓ Descargar CV', W / 2, 494)

  // Footer quote
  ctx.fillStyle = SAGE
  ctx.font = 'italic 11px Georgia,serif'
  ctx.textAlign = 'center'
  ctx.fillText('"Dejá tu marca →"', W / 2, 630)

  return canvas
}

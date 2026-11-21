// Night Market — scene drawing. All art is drawn with Canvas 2D primitives.
// Panel-relative coordinates: each picture is drawn into a 500x500 panel.

import { LEVELS, MARKER_R } from './differences.js';

// Colours (night-market palette: deep indigo, warm lantern light, paper teal).
const SKY_TOP = '#0c1426';
const SKY_HOR = '#2a3b56';
const WATER = '#0e1b2e';
const WATER_DEEP = '#070d19';
const STALL = '#d8b466';
const STALL_DARK = '#b8944a';
const ROOF = '#222a3a';
const LANTERN = '#ffb74d';
const LANTERN_GLOW = 'rgba(255,183,77,0.4)';
const CURTAIN = '#e87a5a';
const CURTAIN_DARK = '#c45e3a';
const ITEM_GOLD = '#f0c460';
const ITEM_PAPER = '#a8c0c8';

function gradSky(ctx, h) {
  const g = ctx.createLinearGradient(0, 0, 0, h * 0.44);
  g.addColorStop(0, SKY_TOP);
  g.addColorStop(1, SKY_HOR);
  return g;
}

function gradWater(ctx, h) {
  const g = ctx.createLinearGradient(0, h * 0.44, 0, h);
  g.addColorStop(0, '#1f3a5c');
  g.addColorStop(1, WATER_DEEP);
  return g;
}

function drawSky(ctx, w, h) {
  ctx.fillStyle = gradSky(ctx, h);
  ctx.fillRect(0, 0, w, h * 0.44);
  const g2 = ctx.createLinearGradient(0, h * 0.30, 0, h * 0.46);
  g2.addColorStop(0, 'rgba(255,183,77,0.12)');
  g2.addColorStop(1, 'rgba(255,183,77,0)');
  ctx.fillStyle = g2;
  ctx.fillRect(0, h * 0.30, w, h * 0.16);
}

function drawHills(ctx, w, h) {
  const hy = h * 0.42;
  ctx.fillStyle = '#111c2e';
  ctx.beginPath();
  ctx.moveTo(0, hy);
  ctx.lineTo(w * 0.26, hy - 20);
  ctx.lineTo(w * 0.52, hy - 10);
  ctx.lineTo(w * 0.80, hy - 24);
  ctx.lineTo(w, hy);
  ctx.lineTo(w, h);
  ctx.lineTo(0, h);
  ctx.fill();
  ctx.fillStyle = '#0b1320';
  ctx.beginPath();
  ctx.moveTo(0, hy + 5);
  ctx.lineTo(w * 0.36, hy - 14);
  ctx.lineTo(w * 0.64, hy - 8);
  ctx.lineTo(w, hy + 3);
  ctx.lineTo(w, h);
  ctx.lineTo(0, h);
  ctx.fill();
}

function drawWater(ctx, w, h) {
  const wy = h * 0.44;
  ctx.fillStyle = gradWater(ctx, h);
  ctx.fillRect(0, wy, w, h - wy);
  ctx.strokeStyle = 'rgba(42,59,86,0.22)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let i = 0; i < 14; i++) {
    const x = (i * 37 + (w * 0.13)) % w;
    const y = wy + 8 + (i * 31 % 20);
    ctx.moveTo(x, y);
    ctx.lineTo(x + 34 + Math.sin(i) * 6, y + 2);
  }
  ctx.stroke();
}

function drawPier(ctx, w, h) {
  const py = h * 0.72;
  ctx.fillStyle = '#7a5c33';
  ctx.fillRect(0, py, w, h - py);
  ctx.strokeStyle = '#5e4524';
  ctx.lineWidth = 3;
  for (let y = py + 6; y < h; y += 22) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }
  ctx.fillStyle = '#5e4524';
  for (let x = 14; x < w; x += 72) {
    ctx.fillRect(x - 4, py, 8, h - py);
  }
}

function drawStall(ctx, x, w, h, roofColor) {
  const bw = w;
  const bh = 46;
  const by = h * 0.44 - bh;
  // walls
  ctx.fillStyle = STALL;
  ctx.fillRect(x, by, bw, bh);
  ctx.strokeStyle = STALL_DARK;
  ctx.lineWidth = 1.5;
  ctx.strokeRect(x, by, bw, bh);
  // roof
  ctx.fillStyle = roofColor;
  ctx.beginPath();
  ctx.moveTo(x - 6, by);
  ctx.lineTo(x + bw / 2, by - 16);
  ctx.lineTo(x + bw + 6, by);
  ctx.fill();
  ctx.strokeStyle = '#141a24';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(x - 6, by);
  ctx.lineTo(x + bw / 2, by - 16);
  ctx.lineTo(x + bw + 6, by);
  ctx.stroke();
  // awning stripes
  ctx.fillStyle = 'rgba(255,255,255,0.15)';
  for (let i = 0; i < bw; i += 10) {
    ctx.fillRect(x + i, by - 16, 6, 4);
  }
}

function drawLantern(ctx, x, y, lit, size = 1) {
  const r = 6 * size;
  ctx.fillStyle = lit ? LANTERN : '#3d3228';
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#2a2218';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  if (lit) {
    ctx.fillStyle = LANTERN_GLOW;
    ctx.beginPath();
    ctx.arc(x, y, r * 1.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,224,138,0.5)';
    ctx.beginPath();
    ctx.arc(x, y, r * 0.5, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawCurtain(ctx, x, y, open, color) {
  if (open) return;
  ctx.fillStyle = color;
  ctx.fillRect(x - 10, y - 8, 20, 16);
  ctx.strokeStyle = 'rgba(0,0,0,0.3)';
  ctx.lineWidth = 1;
  ctx.strokeRect(x - 10, y - 8, 20, 16);
  ctx.fillStyle = 'rgba(255,255,255,0.15)';
  ctx.fillRect(x - 6, y - 6, 4, 12);
  ctx.fillRect(x + 2, y - 6, 4, 12);
}

function drawItem(ctx, x, y, kind, present) {
  if (!present) return;
  ctx.save();
  ctx.translate(x, y);
  if (kind === 'lantern') {
    drawLantern(ctx, 0, 0, true, 0.7);
  } else if (kind === 'paper') {
    ctx.fillStyle = ITEM_PAPER;
    ctx.fillRect(-6, -7, 12, 14);
    ctx.strokeStyle = '#7a8a94';
    ctx.lineWidth = 1;
    ctx.strokeRect(-6, -7, 12, 14);
    ctx.fillStyle = '#5d7a84';
    ctx.fillRect(-4, -5, 8, 2);
    ctx.fillRect(-4, -2, 8, 2);
    ctx.fillRect(-4, 1, 8, 2);
  } else if (kind === 'gold') {
    ctx.fillStyle = ITEM_GOLD;
    ctx.beginPath();
    ctx.arc(0, 0, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#c9942e';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }
  ctx.restore();
}

// Satisfying find marker: glowing ring with a check, drawn on both panels.
function drawMarker(ctx, x, y) {
  const t = Date.now() / 1000;
  const pulse = 1 + 0.18 * Math.sin(t * 7);
  ctx.save();
  ctx.translate(x, y);
  ctx.globalAlpha = 0.92;
  ctx.fillStyle = 'rgba(255,209,102,0.4)';
  ctx.beginPath();
  ctx.arc(0, 0, MARKER_R * pulse + 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#ffd166';
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.arc(0, 0, MARKER_R * pulse, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = '#0b1220';
  ctx.lineWidth = 4.5;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(-9, 3);
  ctx.lineTo(-3, 10);
  ctx.lineTo(11, -8);
  ctx.stroke();
  ctx.restore();
}

// Draw one full panel: base scene + differences (or markers when found).
function drawScene(ctx, w, h, level, isRight, found) {
  drawSky(ctx, w, h);
  drawHills(ctx, w, h);
  drawWater(ctx, w, h);
  drawPier(ctx, w, h);

  const diffs = LEVELS[level].diffs;
  diffs.forEach((d, i) => {
    if (found.has(i)) {
      drawMarker(ctx, d.x, d.y);
    } else {
      d.draw(ctx, d.x, d.y, isRight);
    }
  });

  // Base decorations (identical in both panels, placed away from differences).
  if (level === 0) {
    drawStall(ctx, 30, w, h, ROOF);
    drawStall(ctx, 290, w, h, ROOF);
    drawLantern(ctx, 95, 160, true, 1);
    drawLantern(ctx, 410, 150, true, 1);
    drawCurtain(ctx, 210, 220, false, CURTAIN);
    drawItem(ctx, 130, 300, 'lantern', true);
    drawItem(ctx, 370, 310, 'gold', true);
    drawItem(ctx, 170, 430, 'paper', true);
  } else if (level === 1) {
    drawStall(ctx, 40, w, h, '#1e2a3a');
    drawStall(ctx, 310, w, h, '#2a3a4a');
    drawLantern(ctx, 115, 170, true, 1);
    drawLantern(ctx, 430, 140, true, 1);
    drawCurtain(ctx, 220, 210, false, CURTAIN_DARK);
    drawItem(ctx, 150, 300, 'paper', true);
    drawItem(ctx, 380, 290, 'lantern', true);
    drawItem(ctx, 120, 430, 'gold', true);
  } else {
    drawStall(ctx, 25, w, h, '#243040');
    drawStall(ctx, 280, w, h, '#2e3a4a');
    drawLantern(ctx, 90, 165, true, 1);
    drawLantern(ctx, 420, 155, true, 1);
    drawCurtain(ctx, 200, 215, false, CURTAIN);
    drawItem(ctx, 110, 300, 'gold', true);
    drawItem(ctx, 360, 305, 'paper', true);
    drawItem(ctx, 140, 435, 'lantern', true);
  }
}

export { drawScene, drawMarker, MARKER_R, CURTAIN, CURTAIN_DARK, drawLantern, drawCurtain, drawItem };

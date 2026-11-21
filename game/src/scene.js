// Harbor Lights — scene drawing. All art is drawn with Canvas 2D primitives (no image files).
// Panel-relative coordinates: each picture is drawn into a 500x500 panel.

import { LEVELS, MARKER_R } from './differences.js';

// Colours (dusk harbour palette).
const SKY_TOP = '#23324d';
const SKY_HOR = '#5e83a8';
const WATER = '#142337';
const WATER_DEEP = '#0c1728';
const PIER = '#5c4a3a';
const PIER_DARK = '#46372b';
const BOAT_HULL = '#2a2a35';
const WINDOW_ON = '#ffe08a';
const WINDOW_OFF = '#243045';
const LANTERN = '#ffb74d';
const CAT = '#222';

function gradSky(ctx, w) {
  const g = ctx.createLinearGradient(0, 0, 0, w * 0.42);
  g.addColorStop(0, SKY_TOP);
  g.addColorStop(1, SKY_HOR);
  return g;
}

function gradWater(ctx, w) {
  const g = ctx.createLinearGradient(0, w * 0.42, 0, w);
  g.addColorStop(0, '#3a5a7a');
  g.addColorStop(1, WATER_DEEP);
  return g;
}

function drawSky(ctx, w, h) {
  ctx.fillStyle = gradSky(ctx, h);
  ctx.fillRect(0, 0, w, h * 0.42);
  // fading dusk glow above horizon
  const g2 = ctx.createLinearGradient(0, h * 0.30, 0, h * 0.46);
  g2.addColorStop(0, 'rgba(255,183,77,0.10)');
  g2.addColorStop(1, 'rgba(255,183,77,0)');
  ctx.fillStyle = g2;
  ctx.fillRect(0, h * 0.30, w, h * 0.16);
}

function drawHills(ctx, w, h) {
  const hy = h * 0.40;
  ctx.fillStyle = '#162335';
  ctx.beginPath();
  ctx.moveTo(0, hy);
  ctx.lineTo(w * 0.28, hy - 22);
  ctx.lineTo(w * 0.55, hy - 8);
  ctx.lineTo(w * 0.78, hy - 26);
  ctx.lineTo(w, hy);
  ctx.lineTo(w, h);
  ctx.lineTo(0, h);
  ctx.fill();
  ctx.fillStyle = '#0f1a29';
  ctx.beginPath();
  ctx.moveTo(0, hy + 6);
  ctx.lineTo(w * 0.4, hy - 12);
  ctx.lineTo(w * 0.66, hy - 6);
  ctx.lineTo(w, hy + 4);
  ctx.lineTo(w, h);
  ctx.lineTo(0, h);
  ctx.fill();
}

function drawWater(ctx, w, h) {
  const wy = h * 0.42;
  ctx.fillStyle = gradWater(ctx, h);
  ctx.fillRect(0, wy, w, h - wy);
  // water surface strokes
  ctx.strokeStyle = 'rgba(94,131,168,0.18)';
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
  ctx.fillStyle = PIER;
  ctx.fillRect(0, py, w, h - py);
  // planks
  ctx.strokeStyle = PIER_DARK;
  ctx.lineWidth = 3;
  for (let y = py + 6; y < h; y += 22) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }
  // posts
  ctx.fillStyle = PIER_DARK;
  for (let x = 14; x < w; x += 72) {
    ctx.fillRect(x - 4, py, 8, h - py);
  }
}

function drawBuilding(ctx, x, w, h, floors) {
  const bw = w;
  const bh = 40 + floors * 14;
  const by = h * 0.42 - bh;
  ctx.fillStyle = '#263346';
  ctx.fillRect(x, by, bw, bh);
  ctx.strokeStyle = '#1c2738';
  ctx.lineWidth = 1;
  ctx.strokeRect(x, by, bw, bh);
  for (let f = 0; f < floors; f++) {
    const fy = by + 8 + f * 14;
    for (let g = 0; g < 3; g++) {
      const gx = x + 6 + g * 20;
      drawWindow(ctx, gx, fy, f % 2 === 0);
    }
  }
}

// Lit (on) or dark (off) window. isRight variants handled by caller passing 'on'.
function drawWindow(ctx, x, y, on) {
  ctx.fillStyle = on ? WINDOW_ON : WINDOW_OFF;
  ctx.fillRect(x, y, 14, 10);
  ctx.strokeStyle = '#101828';
  ctx.lineWidth = 1;
  ctx.strokeRect(x, y, 14, 10);
  if (on) {
    ctx.fillStyle = 'rgba(255,224,138,0.35)';
    ctx.fillRect(x + 2, y + 2, 4, 4);
  }
}

function drawBoat(ctx, x, y, withMast, flag) {
  // hull
  ctx.fillStyle = BOAT_HULL;
  ctx.fillRect(x, y, 46, 14);
  ctx.fillRect(x + 8, y + 14, 30, 10);
  ctx.strokeStyle = '#16161e';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(x, y, 46, 14);
  ctx.strokeRect(x + 8, y + 14, 30, 10);
  if (withMast) {
    ctx.strokeStyle = '#5a5a6e';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x + 22, y);
    ctx.lineTo(x + 22, y - 26);
    ctx.stroke();
    // sail
    ctx.fillStyle = 'rgba(235,238,245,0.55)';
    ctx.beginPath();
    ctx.moveTo(x + 22, y - 4);
    ctx.lineTo(x + 22, y - 24);
    ctx.lineTo(x + 36, y - 12);
    ctx.fill();
  }
  if (flag) {
    ctx.fillStyle = '#ffd166';
    ctx.fillRect(x + 20, y - 30, 6, 4);
  }
}

function drawLantern(ctx, x, y, lit) {
  ctx.fillStyle = lit ? LANTERN : '#3d3228';
  ctx.beginPath();
  ctx.arc(x, y, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#2a2218';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  if (lit) {
    ctx.fillStyle = 'rgba(255,183,77,0.35)';
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawCat(ctx, x, y, present) {
  if (!present) return;
  ctx.fillStyle = CAT;
  ctx.beginPath();
  ctx.arc(x, y, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#e8eef6';
  ctx.beginPath();
  ctx.arc(x - 2, y - 2, 1.6, 0, Math.PI * 2); // eye
  ctx.fill();
}

function drawCrate(ctx, x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x - 8, y - 8, 16, 16);
  ctx.strokeStyle = '#1a1a1a';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(x - 8, y - 8, 16, 16);
  ctx.strokeStyle = 'rgba(255,255,255,0.25)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x - 8, y); ctx.lineTo(x + 8, y);
  ctx.moveTo(x, y - 8); ctx.lineTo(x, y + 8);
  ctx.stroke();
}

function drawSeagull(ctx, x, y, present) {
  if (!present) return;
  ctx.strokeStyle = '#1b1b1b';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x - 6, y);
  ctx.lineTo(x, y - 5);
  ctx.lineTo(x + 6, y);
  ctx.stroke();
}

function drawReflection(ctx, x, y, present) {
  if (!present) return;
  ctx.strokeStyle = 'rgba(255,183,77,0.45)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x - 6, y);
  ctx.lineTo(x + 6, y);
  ctx.stroke();
}

// ---------------------------------------------------------------- level base layouts

// Static decorations identical in both panels, placed away from difference spots.
function drawBase(ctx, w, h, level) {
  drawSky(ctx, w, h);
  drawHills(ctx, w, h);
  drawWater(ctx, w, h);
  drawPier(ctx, w, h);
  if (level === 0) {
    drawBuilding(ctx, 18, 3, w, h);
    drawBuilding(ctx, 250, 2, w, h);
    drawBoat(ctx, 30, 305, true, true);
    drawBoat(ctx, 290, 315, false, false);
    drawLantern(ctx, 95, 165, true);
    drawLantern(ctx, 415, 155, true);
    drawCrate(ctx, 130, 435, '#8c5a4a');
  } else if (level === 1) {
    drawBuilding(ctx, 25, 2, w, h);
    drawBuilding(ctx, 300, 3, w, h);
    drawBoat(ctx, 60, 300, false, false);
    drawBoat(ctx, 330, 285, true, false);
    drawLantern(ctx, 110, 175, true);
    drawLantern(ctx, 430, 145, true);
    drawCrate(ctx, 150, 430, '#6a8caf');
  } else {
    drawBuilding(ctx, 20, 3, w, h);
    drawBuilding(ctx, 270, 2, w, h);
    drawBoat(ctx, 45, 305, true, false);
    drawBoat(ctx, 310, 300, false, true);
    drawLantern(ctx, 85, 170, true);
    drawLantern(ctx, 420, 160, true);
    drawCrate(ctx, 110, 435, '#5b7fa6');
  }
}

// Satisfying find marker: a glowing ring with a check, drawn on both panels.
function drawMarker(ctx, x, y) {
  const t = Date.now() / 1000;
  const pulse = 1 + 0.15 * Math.sin(t * 6);
  ctx.save();
  ctx.translate(x, y);
  ctx.globalAlpha = 0.9;
  // outer glow
  ctx.fillStyle = 'rgba(255,209,102,0.35)';
  ctx.beginPath();
  ctx.arc(0, 0, MARKER_R * pulse + 6, 0, Math.PI * 2);
  ctx.fill();
  // ring
  ctx.strokeStyle = '#ffd166';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(0, 0, MARKER_R * pulse, 0, Math.PI * 2);
  ctx.stroke();
  // check mark
  ctx.strokeStyle = '#0b1220';
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(-8, 2);
  ctx.lineTo(-2, 9);
  ctx.lineTo(10, -7);
  ctx.stroke();
  ctx.restore();
}

// Draw one full panel: base scene + differences (or markers when found).
function drawScene(ctx, w, h, level, isRight, found) {
  drawBase(ctx, w, h, level);
  const diffs = LEVELS[level].diffs;
  diffs.forEach((d, i) => {
    if (found.has(i)) {
      drawMarker(ctx, d.x, d.y);
    } else {
      d.draw(ctx, d.x, d.y, isRight);
    }
  });
}

export {
  drawSky, drawHills, drawWater, drawPier, drawBuilding, drawWindow, drawBoat,
  drawLantern, drawCat, drawCrate, drawSeagull, drawReflection, drawBase, drawMarker,
  drawScene, SKY_TOP, SKY_HOR,
};

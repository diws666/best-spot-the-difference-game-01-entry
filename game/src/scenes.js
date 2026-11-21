// Bazaar Nights — scene drawing. All art is original Canvas 2D primitives, drawn live.
// Panel-relative coordinates: each picture is drawn into a 500x500 panel.

export const MARKER_R = 26;

// ---------- small original objects (identical in both panels unless a difference toggles them) ----------

export function drawLantern(ctx, x, y, lit, color = '#ffb74d', size = 1) {
  const r = 7 * size;
  ctx.save(); ctx.translate(x, y);
  ctx.fillStyle = lit ? color : '#463a2e';
  ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#2a2218'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.stroke();
  if (lit) {
    ctx.fillStyle = 'rgba(255,224,138,0.55)';
    ctx.beginPath(); ctx.arc(0, 0, r * 1.9, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(255,240,180,0.85)';
    ctx.beginPath(); ctx.arc(0, 0, r * 0.55, 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore();
}

export function drawRope(ctx, x, y, len = 26, color = '#c9b17a') {
  ctx.save(); ctx.translate(x, y); ctx.rotate(-0.35);
  ctx.strokeStyle = color; ctx.lineWidth = 2.2; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, len); ctx.stroke();
  // knots
  ctx.fillStyle = '#8a6d3b';
  for (let k = 6; k < len; k += 10) { ctx.beginPath(); ctx.arc(0, k, 2.2, 0, Math.PI * 2); ctx.fill(); }
  ctx.restore();
}

export function drawBasket(ctx, x, y, kind = 'woven') {
  const c = kind === 'woven' ? '#c9a866' : kind === 'clay' ? '#a87044' : '#7a5c33';
  ctx.save(); ctx.translate(x, y);
  ctx.fillStyle = c; ctx.beginPath(); ctx.ellipse(0, 0, 9, 6, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#6e5430'; ctx.beginPath(); ctx.ellipse(0, 0, 9, 6, 0, 0, Math.PI); ctx.fill();
  ctx.fillStyle = c; ctx.fillRect(-7, 0, 14, 10);
  ctx.strokeStyle = '#5e4524'; ctx.lineWidth = 1.2; ctx.strokeRect(-7, 0, 14, 10);
  ctx.restore();
}

export function drawPot(ctx, x, y) {
  ctx.save(); ctx.translate(x, y);
  ctx.fillStyle = '#8a6d3b';
  ctx.beginPath(); ctx.ellipse(0, -2, 8, 11, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#6e5430'; ctx.fillRect(-6, 8, 12, 6);
  ctx.strokeStyle = '#4a3822'; ctx.lineWidth = 1.2;
  ctx.beginPath(); ctx.moveTo(-8, -2); ctx.lineTo(-8, 8); ctx.moveTo(0, -2); ctx.lineTo(0, 8); ctx.moveTo(8, -2); ctx.lineTo(8, 8); ctx.stroke();
  ctx.restore();
}

export function drawCrate(ctx, x, y) {
  ctx.save(); ctx.translate(x, y);
  ctx.fillStyle = '#a87844'; ctx.fillRect(-8, -8, 16, 16);
  ctx.strokeStyle = '#7a5428'; ctx.lineWidth = 1.6; ctx.strokeRect(-8, -8, 16, 16);
  ctx.strokeStyle = '#5e401c'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(-8, 0); ctx.lineTo(8, 0); ctx.moveTo(0, -8); ctx.lineTo(0, 8); ctx.stroke();
  ctx.restore();
}

export function drawFlag(ctx, x, y, color = '#e87a5a') {
  ctx.save(); ctx.translate(x, y);
  ctx.fillStyle = color;
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(10, 5); ctx.lineTo(0, 10); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#5e401c'; ctx.fillRect(-1, -12, 2, 12);
  ctx.restore();
}

export function drawCoin(ctx, x, y) {
  ctx.save(); ctx.translate(x, y);
  ctx.fillStyle = '#f0c460'; ctx.beginPath(); ctx.arc(0, 0, 5, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#c9942e'; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.arc(0, 0, 5, 0, Math.PI * 2); ctx.stroke();
  ctx.fillStyle = '#c9942e'; ctx.fillRect(-2, -1, 4, 2);
  ctx.restore();
}

export function drawWindow(ctx, x, y, lit, color = '#d8b466') {
  ctx.save(); ctx.translate(x, y);
  ctx.fillStyle = lit ? color : '#263044';
  ctx.fillRect(-7, -7, 14, 14);
  ctx.strokeStyle = '#5e4524'; ctx.lineWidth = 1.4; ctx.strokeRect(-7, -7, 14, 14);
  ctx.beginPath(); ctx.moveTo(0, -7); ctx.lineTo(0, 7); ctx.moveTo(-7, 0); ctx.lineTo(7, 0); ctx.stroke();
  if (lit) {
    ctx.fillStyle = 'rgba(255,224,138,0.7)';
    ctx.beginPath(); ctx.arc(0, 0, 4, 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore();
}

export function drawCurtain(ctx, x, y, open, color) {
  ctx.save(); ctx.translate(x, y);
  ctx.fillStyle = color;
  if (open) {
    ctx.fillRect(-8, 0, 6, 16); ctx.fillRect(2, 0, 6, 16);
    ctx.fillStyle = 'rgba(255,255,255,0.2)'; ctx.fillRect(-2, 4, 4, 8);
  } else {
    ctx.fillRect(-8, 0, 16, 16);
    ctx.fillStyle = 'rgba(255,255,255,0.15)'; ctx.fillRect(-5, 4, 4, 10); ctx.fillRect(1, 4, 4, 10);
  }
  ctx.strokeStyle = 'rgba(0,0,0,0.3)'; ctx.lineWidth = 1;
  ctx.strokeRect(-8, 0, 16, 16);
  ctx.restore();
}

export function drawBolt(ctx, x, y, color) {
  ctx.save(); ctx.translate(x, y);
  ctx.fillStyle = color; ctx.fillRect(-9, -6, 18, 12);
  ctx.strokeStyle = 'rgba(0,0,0,0.25)'; ctx.lineWidth = 1.2; ctx.strokeRect(-9, -6, 18, 12);
  ctx.fillStyle = 'rgba(255,255,255,0.18)';
  for (let i = -8; i <= 8; i += 7) { ctx.fillRect(i, -5, 5, 2); }
  ctx.restore();
}

export function drawNet(ctx, x, y) {
  ctx.save(); ctx.translate(x, y);
  ctx.strokeStyle = 'rgba(140,120,80,0.45)'; ctx.lineWidth = 1.4;
  for (let i = -12; i <= 12; i += 8) { ctx.beginPath(); ctx.moveTo(i, -12); ctx.lineTo(i, 12); ctx.stroke(); }
  for (let j = -12; j <= 12; j += 8) { ctx.beginPath(); ctx.moveTo(-12, j); ctx.lineTo(12, j); ctx.stroke(); }
  ctx.restore();
}

// ---------- satisfying found marker: glowing ring with a check, both panels ----------

export function drawMarker(ctx, x, y) {
  const t = Date.now() / 1000;
  const pulse = 1 + 0.18 * Math.sin(t * 7);
  ctx.save(); ctx.translate(x, y);
  ctx.globalAlpha = 0.92;
  ctx.fillStyle = 'rgba(255,209,102,0.4)';
  ctx.beginPath(); ctx.arc(0, 0, MARKER_R * pulse + 8, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#ffd166'; ctx.lineWidth = 3.5;
  ctx.beginPath(); ctx.arc(0, 0, MARKER_R * pulse, 0, Math.PI * 2); ctx.stroke();
  ctx.strokeStyle = '#0b1220'; ctx.lineWidth = 4.5; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(-10, 3); ctx.lineTo(-3, 11); ctx.lineTo(12, -9); ctx.stroke();
  ctx.restore();
}

// ---------- backgrounds ----------

function gradSky(ctx, h, top, hor) {
  const g = ctx.createLinearGradient(0, 0, 0, h * 0.5);
  g.addColorStop(0, top); g.addColorStop(1, hor); return g;
}
function gradGround(ctx, h, top, bot) {
  const g = ctx.createLinearGradient(0, h * 0.5, 0, h);
  g.addColorStop(0, top); g.addColorStop(1, bot); return g;
}

function drawNightSky(ctx, w, h) {
  ctx.fillStyle = gradSky(ctx, h, '#141a2b', '#2a3a5c');
  ctx.fillRect(0, 0, w, h * 0.5);
  const g = ctx.createLinearGradient(0, h * 0.34, 0, h * 0.52);
  g.addColorStop(0, 'rgba(255,183,77,0.14)'); g.addColorStop(1, 'rgba(255,183,77,0)');
  ctx.fillStyle = g; ctx.fillRect(0, h * 0.34, w, h * 0.18);
  // distant stars
  ctx.fillStyle = '#e8eef6';
  for (let i = 0; i < 22; i++) { ctx.fillRect((i * 57 + 13) % w, (i * 31 % 40), 1.4, 1.4); }
}

function drawDockSky(ctx, w, h) {
  ctx.fillStyle = gradSky(ctx, h, '#0f2235', '#2c506b');
  ctx.fillRect(0, 0, w, h * 0.5);
  const g = ctx.createLinearGradient(0, h * 0.34, 0, h * 0.52);
  g.addColorStop(0, 'rgba(90,160,210,0.12)'); g.addColorStop(1, 'rgba(90,160,210,0)');
  ctx.fillStyle = g; ctx.fillRect(0, h * 0.34, w, h * 0.18);
}

function drawMidnightSky(ctx, w, h) {
  ctx.fillStyle = gradSky(ctx, h, '#2b142b', '#4a2a4a');
  ctx.fillRect(0, 0, w, h * 0.5);
  const g = ctx.createLinearGradient(0, h * 0.34, 0, h * 0.52);
  g.addColorStop(0, 'rgba(210,120,220,0.12)'); g.addColorStop(1, 'rgba(210,120,220,0)');
  ctx.fillStyle = g; ctx.fillRect(0, h * 0.34, w, h * 0.18);
}

function drawStalls(ctx, w, h, roof, wall) {
  const by = h * 0.44 - 46;
  ctx.fillStyle = wall; ctx.fillRect(18, by, w - 36, 46);
  ctx.strokeStyle = '#6e5430'; ctx.lineWidth = 1.5; ctx.strokeRect(18, by, w - 36, 46);
  ctx.fillStyle = roof;
  ctx.beginPath(); ctx.moveTo(14, by); ctx.lineTo(w / 2, by - 17); ctx.lineTo(w - 14, by); ctx.fill();
  ctx.beginPath(); ctx.moveTo(14, by); ctx.lineTo(w / 2, by - 17); ctx.lineTo(w - 14, by);
  ctx.strokeStyle = '#141a24'; ctx.lineWidth = 1.5; ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,0.14)';
  for (let i = 18; i < w - 36; i += 11) ctx.fillRect(i, by - 17, 7, 4);
}

function drawBoats(ctx, w, h) {
  const py = h * 0.72;
  ctx.fillStyle = '#263044'; ctx.fillRect(0, py, w, h - py);
  ctx.strokeStyle = '#141a24'; ctx.lineWidth = 2;
  for (let x = 10; x < w; x += 74) {
    ctx.beginPath(); ctx.moveTo(x - 6, py); ctx.lineTo(x + 26, py - 20); ctx.lineTo(x + 58, py); ctx.fillStyle = '#3a4a5d'; ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#5e4524'; ctx.fillRect(x + 20, py, 8, h - py);
  }
}

export function drawSpiceBowl(ctx, x, y, color) {
  ctx.save(); ctx.translate(x, y);
  ctx.fillStyle = color; ctx.beginPath(); ctx.arc(0, 2, 10, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = 'rgba(0,0,0,0.25)'; ctx.beginPath(); ctx.ellipse(0, 2, 10, 4, 0, Math.PI, Math.PI * 2); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.2)'; ctx.beginPath(); ctx.arc(0, -1, 6, 0, Math.PI); ctx.fill();
  ctx.restore();
}

// ---------- per-level scenes ----------

// Level 1 — Night Bazaar (easier). Indigo night, warm lanterns, two stalls, baskets, pots.
export function drawScene1(ctx, w, h, isRight) {
  drawNightSky(ctx, w, h);
  ctx.fillStyle = gradGround(ctx, h, '#141824', '#0a0d17');
  ctx.fillRect(0, h * 0.44, w, h - h * 0.44);
  drawStalls(ctx, w, h, '#222a3a', '#c9a866');
  drawLantern(ctx, 100, 150, true, '#ffb74d', 1.1);
  drawLantern(ctx, 410, 140, true, '#ffb74d', 1.1);
  drawRope(ctx, 200, 110, 30);
  drawRope(ctx, 320, 100, 28);
  drawBasket(ctx, 130, 300, 'woven');
  drawBasket(ctx, 370, 300, 'woven');
  drawPot(ctx, 170, 430);
  drawPot(ctx, 330, 420);
  drawCoin(ctx, 240, 330);
  drawCurtain(ctx, 210, 220, false, '#e87a5a');
  drawWindow(ctx, 290, 200, true);
  drawWindow(ctx, 150, 360, false);
  drawNet(ctx, 430, 330);
  drawFlag(ctx, 60, 240, '#e87a5a');
  drawFlag(ctx, 450, 250, '#e87a5a');
}

// Level 2 — Dockside Bazaar (harder). Teal docks, crates, ropes, barrels, nets. Smaller, busier.
export function drawScene2(ctx, w, h, isRight) {
  drawDockSky(ctx, w, h);
  ctx.fillStyle = gradGround(ctx, h, '#162838', '#0c1622');
  ctx.fillRect(0, h * 0.44, w, h - h * 0.44);
  drawBoats(ctx, w, h);
  drawCrate(ctx, 70, 300);
  drawCrate(ctx, 200, 300);
  drawCrate(ctx, 330, 310);
  drawCrate(ctx, 430, 300);
  drawBasket(ctx, 110, 360, 'clay');
  drawBasket(ctx, 380, 360, 'clay');
  drawPot(ctx, 150, 420);
  drawPot(ctx, 410, 430);
  drawRope(ctx, 80, 220, 24, '#9aa3a8');
  drawRope(ctx, 300, 210, 26, '#9aa3a8');
  drawRope(ctx, 420, 230, 22, '#9aa3a8');
  drawNet(ctx, 220, 340);
  drawNet(ctx, 360, 340);
  drawWindow(ctx, 100, 200, true, '#b7d4e8');
  drawWindow(ctx, 300, 190, false, '#b7d4e8');
  drawCoin(ctx, 250, 330);
  drawCoin(ctx, 180, 420);
  drawFlag(ctx, 50, 250, '#4a7c8c');
  drawFlag(ctx, 460, 260, '#4a7c8c');
}

// Level 3 — Midnight Spice Bazaar (hardest). Deep maroon/gold, hanging lamps, spice bowls, bolts of fabric. Busiest.
export function drawScene3(ctx, w, h, isRight) {
  drawMidnightSky(ctx, w, h);
  ctx.fillStyle = gradGround(ctx, h, '#1c101c', '#0f080f');
  ctx.fillRect(0, h * 0.44, w, h - h * 0.44);
  drawStalls(ctx, w, h, '#2a182a', '#b87a44');
  drawLantern(ctx, 95, 155, true, '#e07a2a', 1.0);
  drawLantern(ctx, 420, 150, true, '#e07a2a', 1.0);
  drawLantern(ctx, 260, 165, false, '#e07a2a', 0.9);
  drawSpiceBowl(ctx, 120, 300, '#b74a2a');
  drawSpiceBowl(ctx, 380, 300, '#7a2ab7');
  drawSpiceBowl(ctx, 200, 420, '#2ab77a');
  drawBasket(ctx, 150, 430, 'woven');
  drawBasket(ctx, 350, 420, 'woven');
  drawPot(ctx, 110, 360);
  drawPot(ctx, 400, 360);
  drawBolt(ctx, 220, 300, '#e87a5a');
  drawBolt(ctx, 300, 310, '#2ab77a');
  drawRope(ctx, 160, 210, 24, '#c9a866');
  drawRope(ctx, 340, 200, 26, '#c9a866');
  drawFlag(ctx, 60, 240, '#7a2ab7');
  drawFlag(ctx, 450, 250, '#7a2ab7');
  drawCoin(ctx, 250, 330);
  drawWindow(ctx, 280, 200, true, '#ffd166');
}

export const drawScene = [drawScene1, drawScene2, drawScene3];

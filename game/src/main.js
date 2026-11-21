// Harbor Lights — main game loop, state machine, input and HUD.
import { drawScene } from './scene.js';
import { LEVELS, MARKER_R, cursor } from './differences.js';
import { audio } from './audio.js';
import { readShot } from './shots.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const PANEL_W = 500;
const PANEL_H = 500;
const LEFT_X = 80;
const RIGHT_X = 700;
const PANEL_Y = 110;
const CLICK_TOL = MARKER_R + 10;

// DOM
const leftNumEl = document.getElementById('left-num');
const barFill = document.getElementById('bar-fill');
const timeText = document.getElementById('time-text');
const barEl = document.querySelector('.bar');
const hintBtn = document.getElementById('hint-btn');
const hintNum = document.getElementById('hint-num');

const screens = {
  title: document.getElementById('screen-title'),
  about: document.getElementById('screen-about'),
  levelcomplete: document.getElementById('screen-levelcomplete'),
  gamecomplete: document.getElementById('screen-gamecomplete'),
  gameover: document.getElementById('screen-gameover'),
};
const lcTitle = document.getElementById('lc-title');
const lcText = document.getElementById('lc-text');

function show(name) {
  Object.values(screens).forEach((el) => el.classList.remove('open'));
  if (screens[name]) screens[name].classList.add('open');
}

// --- game state -------------------------------------------------------
const shot = readShot();
const isShot = shot.shot !== null;

let mode = 'title'; // title|about|playing|levelcomplete|gamecomplete|gameover
let level = 0;
let found = new Set();
let timeLeft = LEVELS[0].time;
let hints = 3;
let lastTime = null;
let hintActive = null; // {index, endTime}
let wrongFlashEnd = 0;
let findFlashEnd = 0;   // brief satisfying flash when a difference is marked

function levelInfo() { return LEVELS[level]; }

function hud() {
  const info = levelInfo();
  const left = info.diffs.length - found.size;
  leftNumEl.textContent = left;
  const pct = Math.max(0, timeLeft) / info.time;
  barFill.style.width = `${pct * 100}%`;
  barEl.classList.toggle('bar-warn', pct < 0.25);
  const m = Math.floor(timeLeft / 60);
  const s = Math.floor(timeLeft % 60);
  timeText.textContent = `${m}:${s < 10 ? '0' : ''}${s}`;
  hintNum.textContent = hints;
  hintBtn.classList.toggle('empty', hints <= 0);
}

function startGame() {
  level = 0;
  found = new Set();
  timeLeft = LEVELS[0].time;
  hints = 3;
  hintActive = null;
  mode = 'playing';
  lastTime = performance.now();
  show(null);
  hud();
}

function markFound(index) {
  if (found.has(index)) return;
  found.add(index);
  audio.find();
  findFlashEnd = Date.now() + 400;
  hud();
  const info = levelInfo();
  if (found.size >= info.diffs.length) completeLevel();
}

function wrongClick() {
  audio.wrong();
  timeLeft = Math.max(0, timeLeft - 5);
  wrongFlashEnd = Date.now() + 350;
  hud();
}

function completeLevel() {
  if (isShot) return;
  mode = 'levelcomplete';
  audio.win();
  lcTitle.textContent = `Level ${level + 1} complete`;
  lcText.textContent = `You found all ${levelInfo().diffs.length} differences.`;
  if (level < LEVELS.length - 1) {
    lcText.textContent += ` Get ready for level ${level + 2}.`;
  } else {
    lcTitle.textContent = 'Harbor restored';
    lcText.textContent = 'You found every difference across all three levels.';
    mode = 'gamecomplete';
  }
  show(mode === 'gamecomplete' ? 'gamecomplete' : 'levelcomplete');
}

function nextLevel() {
  level++;
  if (level >= LEVELS.length) { mode = 'gamecomplete'; show('gamecomplete'); return; }
  found = new Set();
  timeLeft = LEVELS[level].time;
  hints = 3;
  hintActive = null;
  mode = 'playing';
  show(null);
  lastTime = performance.now();
  hud();
}

function gameOver() {
  if (isShot) return;
  mode = 'gameover';
  audio.lose();
  show('gameover');
}

function useHint() {
  if (hints <= 0 || mode !== 'playing') return;
  const info = levelInfo();
  const index = info.diffs.findIndex((_, i) => !found.has(i));
  if (index === -1) return;
  hints--;
  hintActive = { index, endTime: Date.now() + 1500 };
  audio.click();
  hud();
}

function markAtCursor() {
  if (mode !== 'playing') return;
  const info = levelInfo();
  // distance from cursor to each unfound diff in the active panel
  let hit = -1, best = CLICK_TOL;
  info.diffs.forEach((diff, i) => {
    if (found.has(i)) return;
    const dx = cursor.x - diff.x;
    const dy = cursor.y - diff.y;
    const dist = Math.hypot(dx, dy);
    if (dist < best) { best = dist; hit = i; }
  });
  if (hit !== -1) markFound(hit); else wrongClick();
}

// --- input ------------------------------------------------------------
function canvasPoint(event) {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  return { x, y };
}

function handleClick(x, y) {
  if (mode !== 'playing') return;
  let panel = null; let px = 0; let py = 0;
  if (x >= LEFT_X && x < LEFT_X + PANEL_W && y >= PANEL_Y && y < PANEL_Y + PANEL_H) {
    panel = 0; px = x - LEFT_X; py = y - PANEL_Y;
  } else if (x >= RIGHT_X && x < RIGHT_X + PANEL_W && y >= PANEL_Y && y < PANEL_Y + PANEL_H) {
    panel = 1; px = x - RIGHT_X; py = y - PANEL_Y;
  } else {
    return;
  }
  let hit = -1; let best = CLICK_TOL;
  LEVELS[level].diffs.forEach((diff, i) => {
    if (found.has(i)) return;
    const dist = Math.hypot(px - diff.x, py - diff.y);
    if (dist < best) { best = dist; hit = i; }
  });
  if (hit !== -1) markFound(hit); else wrongClick();
}

canvas.addEventListener('mousedown', (ev) => { const p = canvasPoint(ev); handleClick(p.x, p.y); });
hintBtn.addEventListener('click', useHint);

document.getElementById('btn-start').addEventListener('click', () => { audio.click(); startGame(); });
document.getElementById('btn-start2').addEventListener('click', () => { audio.click(); startGame(); });
document.getElementById('btn-about').addEventListener('click', () => { audio.click(); show('about'); });
document.getElementById('btn-back').addEventListener('click', () => { audio.click(); show('title'); });
document.getElementById('btn-next').addEventListener('click', () => { audio.click(); nextLevel(); });
document.getElementById('btn-retry').addEventListener('click', () => { audio.click(); startGame(); });
document.getElementById('btn-restart').addEventListener('click', () => { audio.click(); startGame(); });

window.addEventListener('keydown', (ev) => {
  if (ev.key === 'h') { useHint(); return; }
  if (mode === 'title' && (ev.key === 'Enter' || ev.key === ' ')) { startGame(); return; }
  if (mode === 'levelcomplete' && ev.key === 'Enter') { nextLevel(); return; }
  if (mode === 'gamecomplete' && (ev.key === 'Enter' || ev.key === ' ')) { startGame(); return; }
  if (mode === 'gameover' && (ev.key === 'Enter' || ev.key === ' ')) { startGame(); return; }
  if (mode !== 'playing') return;
  const step = 10;
  switch (ev.key) {
    case 'ArrowLeft':  cursor.x = Math.max(0, cursor.x - step); cursor.active = true; break;
    case 'ArrowRight': cursor.x = Math.min(PANEL_W, cursor.x + step); cursor.active = true; break;
    case 'ArrowUp':    cursor.y = Math.max(0, cursor.y - step); cursor.active = true; break;
    case 'ArrowDown':  cursor.y = Math.min(PANEL_H, cursor.y + step); cursor.active = true; break;
    case 'Tab':        cursor.panel = 1 - cursor.panel; cursor.active = true; ev.preventDefault(); break;
    case 'Enter':
    case ' ':          markAtCursor(); ev.preventDefault(); break;
  }
});

// --- drawing helpers --------------------------------------------------
function drawHintRing(wx, wy) {
  const t = Date.now() / 1000;
  const r = MARKER_R + 10 + 5 * Math.sin(t * 8);
  ctx.save();
  ctx.translate(wx, wy);
  // outer glow
  ctx.fillStyle = 'rgba(58,169,255,0.18)';
  ctx.beginPath();
  ctx.arc(0, 0, r + 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#3aa9ff';
  ctx.lineWidth = 4;
  ctx.globalAlpha = 0.95;
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

function drawCrosshair(wx, wy) {
  ctx.save();
  ctx.translate(wx, wy);
  ctx.strokeStyle = '#ffd166';
  ctx.lineWidth = 2;
  ctx.globalAlpha = 0.9;
  ctx.beginPath();
  ctx.moveTo(-14, 0); ctx.lineTo(14, 0);
  ctx.moveTo(0, -14); ctx.lineTo(0, 14);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(0, 0, 3, 0, Math.PI * 2);
  ctx.fillStyle = '#ffd166';
  ctx.fill();
  ctx.restore();
}

// --- shot setup (deterministic screenshot states) ---------------------
if (shot.shot === 'play') {
  mode = 'playing';
  level = 0;
  found = new Set([0, 1, 2]);
  timeLeft = LEVELS[0].time - 25;
  hints = 2;
  show(null);
  hud();
  lastTime = performance.now();
} else if (shot.shot === 'end') {
  mode = 'gamecomplete';
  show('gamecomplete');
} else {
  show('title');
}

// --- game loop --------------------------------------------------------
function loop(now) {
  if (mode === 'playing' && lastTime) {
    const dt = (now - lastTime) / 1000;
    lastTime = now;
    timeLeft -= dt;
    hud();
    if (timeLeft <= 0) {
      timeLeft = 0;
      hud();
      gameOver();
    }
  } else if (mode === 'playing') {
    lastTime = now;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (mode === 'playing') {
    ctx.save(); ctx.translate(LEFT_X, PANEL_Y);
    drawScene(ctx, PANEL_W, PANEL_H, level, false, found);
    ctx.restore();
    ctx.save(); ctx.translate(RIGHT_X, PANEL_Y);
    drawScene(ctx, PANEL_W, PANEL_H, level, true, found);
    ctx.restore();
    // Wrong-click feedback: a brief red flash over the whole frame.
    if (Date.now() < wrongFlashEnd) {
      const a = 0.35 * ((wrongFlashEnd - Date.now()) / 350);
      ctx.fillStyle = `rgba(224, 86, 64, ${a})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    // Satisfying find feedback: a brief gold flash over the whole frame.
    if (Date.now() < findFlashEnd) {
      const a = 0.25 * ((findFlashEnd - Date.now()) / 400);
      ctx.fillStyle = `rgba(255, 209, 102, ${a})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    if (hintActive && Date.now() < hintActive.endTime && !found.has(hintActive.index)) {
      const d = LEVELS[level].diffs[hintActive.index];
      drawHintRing(LEFT_X + d.x, PANEL_Y + d.y);
      drawHintRing(RIGHT_X + d.x, PANEL_Y + d.y);
    } else {
      hintActive = null;
    }
    if (cursor.active) {
      const ox = cursor.panel === 0 ? LEFT_X : RIGHT_X;
      drawCrosshair(ox + cursor.x, PANEL_Y + cursor.y);
    }
  }
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

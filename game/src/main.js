// Bazaar Nights — main game loop, state machine, HUD wiring, shot setup.
// Imports single-job modules: scenes (art), differences (diffs + cursor), input,
// hud (DOM readout), audio (synthesised sound), shots (deterministic screenshot states).
import { drawScene } from './scenes.js';
import { LEVELS, cursor, drawDiffs, MARKER_R } from './differences.js';
import { bindInput, clickTarget, CLICK_TOL } from './input.js';
import { updateHud } from './hud.js';
import { audio } from './audio.js';
import { readShot } from './shots.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const PANEL_W = 500;
const PANEL_H = 500;
const LEFT_X = 80;
const RIGHT_X = 700;
const PANEL_Y = 110;

// DOM
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
let score = 0;
let streak = 0;
let timeLeft = LEVELS[0].time;
let hints = 5;
let lastTime = null;
let hintActive = null; // {index, endTime}
let wrongFlashEnd = 0;
let findFlashEnd = 0;

function levelInfo() { return LEVELS[level]; }

function markFound(index) {
  if (found.has(index)) return;
  found.add(index);
  score += 100;
  streak += 1;
  audio.find();
  findFlashEnd = Date.now() + 350;
  const info = levelInfo();
  if (found.size >= info.diffs.length) completeLevel();
}

function wrongClick() {
  audio.wrong();
  timeLeft = Math.max(0, timeLeft - 5);
  streak = 0;
  wrongFlashEnd = Date.now() + 350;
}

function completeLevel() {
  if (isShot) return;
  audio.win();
  if (level < LEVELS.length - 1) {
    mode = 'levelcomplete';
    lcTitle.textContent = `Level ${level + 1} complete`;
    lcText.textContent = `All ${levelInfo().diffs.length} differences found. Get ready for level ${level + 2}.`;
    show('levelcomplete');
  } else {
    mode = 'gamecomplete';
    lcTitle.textContent = 'Bazaar restored';
    lcText.textContent = 'You found every difference across all three levels.';
    show('gamecomplete');
  }
}

function nextLevel() {
  if (isShot) return;
  level++;
  if (level >= LEVELS.length) { mode = 'gamecomplete'; show('gamecomplete'); return; }
  found = new Set();
  score = 0; streak = 0;
  timeLeft = LEVELS[level].time;
  hints = 5;
  hintActive = null;
  mode = 'playing';
  show(null);
  lastTime = performance.now();
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
}

function markAtCursor() {
  if (mode !== 'playing') return;
  const info = levelInfo();
  const ox = cursor.panel === 0 ? LEFT_X : RIGHT_X;
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
function handleClick(x, y) {
  if (mode !== 'playing') return;
  const t = clickTarget(x, y, LEFT_X, RIGHT_X, PANEL_Y, PANEL_W, PANEL_H);
  if (!t) return;
  let hit = -1, best = CLICK_TOL;
  LEVELS[level].diffs.forEach((diff, i) => {
    if (found.has(i)) return;
    const dist = Math.hypot(t.px - diff.x, t.py - diff.y);
    if (dist < best) { best = dist; hit = i; }
  });
  if (hit !== -1) markFound(hit); else wrongClick();
}

bindInput(canvas, { onPanelClick: handleClick, onHint: useHint });

document.getElementById('btn-start').addEventListener('click', () => { audio.click(); startGame(); });
document.getElementById('btn-start2').addEventListener('click', () => { audio.click(); startGame(); });
document.getElementById('btn-about').addEventListener('click', () => { audio.click(); show('about'); });
document.getElementById('btn-back').addEventListener('click', () => { audio.click(); show('title'); });
document.getElementById('btn-next').addEventListener('click', () => { audio.click(); nextLevel(); });
document.getElementById('btn-retry').addEventListener('click', () => { audio.click(); startGame(); });
document.getElementById('btn-restart').addEventListener('click', () => { audio.click(); startGame(); });

window.addEventListener('keydown', (ev) => {
  if (ev.key === 'h' || ev.key === 'H') { useHint(); return; }
  if (mode === 'title' && (ev.key === 'Enter' || ev.key === ' ')) { startGame(); return; }
  if (mode === 'levelcomplete' && ev.key === 'Enter') { nextLevel(); return; }
  if (mode === 'gamecomplete' && (ev.key === 'Enter' || ev.key === ' ')) { startGame(); return; }
  if (mode === 'gameover' && (ev.key === 'Enter' || ev.key === ' ')) { startGame(); return; }
  if (mode !== 'playing') return;
  if (ev.key === 'Enter' || ev.key === ' ') { markAtCursor(); ev.preventDefault(); }
});

// --- shot setup (deterministic screenshot states) ---------------------
function startGame() {
  level = 0;
  found = new Set();
  score = 0; streak = 0;
  timeLeft = LEVELS[0].time;
  hints = 5;
  hintActive = null;
  mode = 'playing';
  lastTime = performance.now();
  show(null);
}

if (shot.shot === 'cover') {
  // Cover shot: level 1, half the differences found, full HUD showing.
  mode = 'playing'; level = 0;
  found = new Set([0, 1, 2, 4, 6]); score = 500; streak = 0;
  timeLeft = LEVELS[0].time - 20; hints = 3; hintActive = null;
  show(null);
} else if (shot.shot === 'play') {
  // Found-difference moment: level 2 (harder), a hint in use on an unfound diff.
  mode = 'playing'; level = 1;
  found = new Set([0, 2]); score = 200; streak = 0;
  timeLeft = LEVELS[1].time - 30; hints = 2;
  const info = LEVELS[1];
  hintActive = { index: info.diffs.findIndex((_, i) => !found.has(i)), endTime: Date.now() + 1500 };
  show(null);
} else if (shot.shot === 'hard') {
  // Harder level: level 3 (hardest), a few found, no hint active.
  mode = 'playing'; level = 2;
  found = new Set([0, 3]); score = 300; streak = 0;
  timeLeft = LEVELS[2].time - 15; hints = 3; hintActive = null;
  show(null);
} else if (shot.shot === 'end') {
  mode = 'gamecomplete'; show('gamecomplete');
} else {
  show('title');
}

// --- drawing helpers --------------------------------------------------
function drawHintRing(wx, wy) {
  const t = Date.now() / 1000;
  const r = MARKER_R + 10 + 5 * Math.sin(t * 8);
  ctx.save(); ctx.translate(wx, wy);
  ctx.fillStyle = 'rgba(58,169,255,0.2)';
  ctx.beginPath(); ctx.arc(0, 0, r + 6, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#3aa9ff'; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.stroke();
  ctx.restore();
}

function drawCrosshair(wx, wy) {
  ctx.save(); ctx.translate(wx, wy);
  ctx.strokeStyle = '#ffd166'; ctx.lineWidth = 2; ctx.globalAlpha = 0.9;
  ctx.beginPath(); ctx.moveTo(-14, 0); ctx.lineTo(14, 0);
  ctx.moveTo(0, -14); ctx.lineTo(0, 14); ctx.stroke();
  ctx.beginPath(); ctx.arc(0, 0, 3, 0, Math.PI * 2);
  ctx.fillStyle = '#ffd166'; ctx.fill();
  ctx.restore();
}

// --- game loop --------------------------------------------------------
function loop(now) {
  if (mode === 'playing' && lastTime) {
    const dt = (now - lastTime) / 1000;
    lastTime = now;
    timeLeft -= dt;
    if (timeLeft <= 0) { timeLeft = 0; gameOver(); }
  } else if (mode === 'playing') {
    lastTime = now;
  }

  const info = levelInfo();
  updateHud({
    level, tag: info.tag, found: found.size, total: info.diffs.length,
    score, streak, timeLeft, totalTime: info.time, hints,
    hintActive: hintActive && Date.now() < hintActive.endTime && !found.has(hintActive.index) ? hintActive : null,
  });

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (mode === 'playing') {
    ctx.save(); ctx.translate(LEFT_X, PANEL_Y);
    drawScene[level](ctx, PANEL_W, PANEL_H, false);
    drawDiffs(ctx, level, false, found);
    ctx.restore();
    ctx.save(); ctx.translate(RIGHT_X, PANEL_Y);
    drawScene[level](ctx, PANEL_W, PANEL_H, true);
    drawDiffs(ctx, level, true, found);
    ctx.restore();

    if (Date.now() < wrongFlashEnd) {
      const a = 0.35 * ((wrongFlashEnd - Date.now()) / 350);
      ctx.fillStyle = `rgba(232, 86, 64, ${a})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    if (Date.now() < findFlashEnd) {
      const a = 0.25 * ((findFlashEnd - Date.now()) / 350);
      ctx.fillStyle = `rgba(255, 209, 102, ${a})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    const ha = hintActive && Date.now() < hintActive.endTime && !found.has(hintActive.index);
    if (ha) {
      const d = LEVELS[level].diffs[hintActive.index];
      drawHintRing(LEFT_X + d.x, PANEL_Y + d.y);
      drawHintRing(RIGHT_X + d.x, PANEL_Y + d.y);
    } else { hintActive = null; }
    if (cursor.active) {
      const ox = cursor.panel === 0 ? LEFT_X : RIGHT_X;
      drawCrosshair(ox + cursor.x, PANEL_Y + cursor.y);
    }
  }
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

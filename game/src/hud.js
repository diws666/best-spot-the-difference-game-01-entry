// Bazaar Nights — HUD. One job: read the game state and write it to the DOM.
// Large, high-contrast text so it stays legible when the screenshot is shrunk.

const levelBadge = document.getElementById('level-badge');
const levelTag = document.getElementById('level-tag');
const foundNum = document.getElementById('found-num');
const scoreNum = document.getElementById('score-num');
const streakEl = document.getElementById('streak');
const barFill = document.getElementById('bar-fill');
const barEl = document.querySelector('.bar');
const timeText = document.getElementById('time-text');
const hintBtn = document.getElementById('hint-btn');
const hintNum = document.getElementById('hint-num');
const hintState = document.getElementById('hint-state');

const TAGS = { easier: 'easier', harder: 'harder', hardest: 'hardest' };

export function updateHud({ level, tag, found, total, score, streak, timeLeft, totalTime, hints, hintActive }) {
  levelBadge.textContent = `LEVEL ${level + 1} / 3`;
  levelTag.textContent = TAGS[tag] ?? '';
  foundNum.textContent = found;
  scoreNum.textContent = score;
  streakEl.textContent = streak > 0 ? `streak x${streak}` : '';
  const pct = Math.max(0, timeLeft) / totalTime;
  barFill.style.width = `${pct * 100}%`;
  barFill.style.background = pct < 0.25 ? '#e85640' : 'linear-gradient(90deg,#ffd166,#f7931e)';
  barEl.classList.toggle('bar-warn', pct < 0.25);
  const m = Math.floor(timeLeft / 60);
  const s = Math.floor(timeLeft % 60);
  timeText.textContent = `${m}:${s < 10 ? '0' : ''}${s}`;
  hintNum.textContent = hints;
  hintBtn.classList.toggle('empty', hints <= 0);
  hintState.textContent = hintActive ? 'hinting' : '';
  hintBtn.classList.toggle('active', !!hintActive);
}

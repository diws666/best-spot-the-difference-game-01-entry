// Bazaar Nights — difference definitions. Ten differences per level.
// Each difference draws itself differently in the left (original) and right (altered) panel.
// Visuals are small and camouflaged among the busy decor; the clickable radius (MARKER_R)
// is forgiving so a find always feels fair.
import {
  MARKER_R, drawMarker,
  drawLantern, drawBasket, drawPot, drawCrate, drawRope, drawFlag,
  drawCoin, drawWindow, drawCurtain, drawNet, drawSpiceBowl, drawBolt,
} from './scenes.js';

const R = MARKER_R;

// A difference: {x, y, r, label, drawLeft(ctx,x,y), drawRight(ctx,x,y)}.
//   isRight === false -> left/original panel; true -> right/altered panel.

function present(fn) { return (ctx, x, y) => fn(ctx, x, y); }
function absent() { return () => {}; } // nothing drawn: hides among the busy background

function lanternFlame(lit) {
  return (ctx, x, y) => drawLantern(ctx, x, y, lit, '#ffb74d', 1);
}
function lanternFlame2(lit) {
  return (ctx, x, y) => drawLantern(ctx, x, y, lit, '#e07a2a', 1);
}
function curtain(open) {
  return (ctx, x, y) => drawCurtain(ctx, x, y, open, '#e87a5a');
}
function curtain2(open) {
  return (ctx, x, y) => drawCurtain(ctx, x, y, open, '#7a2ab7');
}
function windowLit(lit) {
  return (ctx, x, y) => drawWindow(ctx, x, y, lit, '#d8b466');
}
function windowLit2(lit) {
  return (ctx, x, y) => drawWindow(ctx, x, y, lit, '#b7d4e8');
}
function windowLit3(lit) {
  return (ctx, x, y) => drawWindow(ctx, x, y, lit, '#ffd166');
}

const LEVEL_1 = {
  time: 95,
  tag: 'easier',
  diffs: [
    { x: 100, y: 150, r: R, label: 'lantern flame', drawLeft: lanternFlame(true), drawRight: lanternFlame(false) },
    { x: 210, y: 220, r: R, label: 'curtain', drawLeft: curtain(false), drawRight: curtain(true) },
    { x: 130, y: 300, r: R, label: 'basket', drawLeft: present(drawBasket), drawRight: absent() },
    { x: 240, y: 330, r: R, label: 'coin', drawLeft: present(drawCoin), drawRight: absent() },
    { x: 170, y: 430, r: R, label: 'pot', drawLeft: present(drawPot), drawRight: absent() },
    { x: 410, y: 140, r: R, label: 'lantern flame', drawLeft: lanternFlame(true), drawRight: lanternFlame(false) },
    { x: 290, y: 200, r: R, label: 'window', drawLeft: windowLit(true), drawRight: windowLit(false) },
    { x: 200, y: 110, r: R, label: 'rope', drawLeft: present(drawRope), drawRight: absent() },
    { x: 60, y: 240, r: R, label: 'flag', drawLeft: present(drawFlag), drawRight: absent() },
    { x: 370, y: 300, r: R, label: 'basket', drawLeft: present(drawBasket), drawRight: absent() },
  ],
};

const LEVEL_2 = {
  time: 80,
  tag: 'harder',
  diffs: [
    { x: 70, y: 300, r: R, label: 'crate', drawLeft: present(drawCrate), drawRight: absent() },
    { x: 110, y: 360, r: R, label: 'basket', drawLeft: present(drawBasket), drawRight: absent() },
    { x: 80, y: 220, r: R, label: 'rope', drawLeft: present(drawRope), drawRight: absent() },
    { x: 100, y: 200, r: R, label: 'window', drawLeft: windowLit2(true), drawRight: windowLit2(false) },
    { x: 150, y: 420, r: R, label: 'pot', drawLeft: present(drawPot), drawRight: absent() },
    { x: 220, y: 340, r: R, label: 'net', drawLeft: present(drawNet), drawRight: absent() },
    { x: 250, y: 330, r: R, label: 'coin', drawLeft: present(drawCoin), drawRight: absent() },
    { x: 50, y: 250, r: R, label: 'flag', drawLeft: present(drawFlag), drawRight: absent() },
    { x: 300, y: 210, r: R, label: 'rope', drawLeft: present(drawRope), drawRight: absent() },
    { x: 330, y: 310, r: R, label: 'crate', drawLeft: present(drawCrate), drawRight: absent() },
  ],
};

const LEVEL_3 = {
  time: 65,
  tag: 'hardest',
  diffs: [
    { x: 120, y: 300, r: R, label: 'spice bowl', drawLeft: present(drawSpiceBowl), drawRight: absent() },
    { x: 95, y: 155, r: R, label: 'lantern flame', drawLeft: lanternFlame2(true), drawRight: lanternFlame2(false) },
    { x: 150, y: 430, r: R, label: 'basket', drawLeft: present(drawBasket), drawRight: absent() },
    { x: 220, y: 300, r: R, label: 'fabric bolt', drawLeft: present(drawBolt), drawRight: absent() },
    { x: 160, y: 210, r: R, label: 'rope', drawLeft: present(drawRope), drawRight: absent() },
    { x: 60, y: 240, r: R, label: 'flag', drawLeft: present(drawFlag), drawRight: absent() },
    { x: 250, y: 330, r: R, label: 'coin', drawLeft: present(drawCoin), drawRight: absent() },
    { x: 110, y: 360, r: R, label: 'pot', drawLeft: present(drawPot), drawRight: absent() },
    { x: 280, y: 200, r: R, label: 'window', drawLeft: windowLit3(true), drawRight: windowLit3(false) },
    { x: 420, y: 150, r: R, label: 'lantern flame', drawLeft: lanternFlame2(true), drawRight: lanternFlame2(false) },
  ],
};

export const LEVELS = [LEVEL_1, LEVEL_2, LEVEL_3];

// Crosshair cursor position (panel-relative), used by keyboard play.
export const cursor = { x: 250, y: 250, panel: 0, active: false };

// Draw every difference (or its marker when found) for one panel, on top of the scene.
export function drawDiffs(ctx, level, isRight, found) {
  LEVELS[level].diffs.forEach((d, i) => {
    if (found.has(i)) { drawMarker(ctx, d.x, d.y); return; }
    if (isRight) d.drawRight(ctx, d.x, d.y); else d.drawLeft(ctx, d.x, d.y);
  });
}

export { MARKER_R };

// Night Market — difference definitions. Ten differences per level.
// Each difference draws itself differently in the left (original) and right (altered) panel.
import { drawLantern, drawCurtain, drawItem } from './scene.js';

// Marker radius around a difference spot.
const MARKER_R = 24;

// A difference: {x, y, r, draw(ctx, x, y, isRight)}.
//   isRight === false -> left/original panel; true -> right/altered panel.

function lanternDiff(x, y) {
  return { x, y, r: MARKER_R, draw: (ctx, x, y, isRight) => drawLantern(ctx, x, y, !isRight, 1) };
}
// left lit, right dark.

function curtainDiff(x, y, color) {
  return { x, y, r: MARKER_R, draw: (ctx, x, y, isRight) => drawCurtain(ctx, x, y, isRight, color) };
}
// left closed, right open.

function itemDiff(x, y, kind) {
  return { x, y, r: MARKER_R, draw: (ctx, x, y, isRight) => drawItem(ctx, x, y, kind, !isRight) };
}
// left present, right absent.

const LEVEL_1 = {
  time: 95,
  diffs: [
    lanternDiff(150, 125),   // 0 lantern: lit / dark
    curtainDiff(210, 220, '#e87a5a'), // 1 curtain: closed / open
    itemDiff(130, 300, 'lantern'),  // 2 lantern item: present / absent
    itemDiff(370, 310, 'gold'),     // 3 gold coin: present / absent
    itemDiff(170, 430, 'paper'),    // 4 paper menu: present / absent
    lanternDiff(410, 150),  // 5 lantern: lit / dark
    curtainDiff(300, 200, '#e87a5a'), // 6 curtain: closed / open
    itemDiff(240, 330, 'paper'),    // 7 paper menu: present / absent
    lanternDiff(90, 300),   // 8 lantern: lit / dark
    itemDiff(330, 420, 'gold'),     // 9 gold coin: present / absent
  ],
};

const LEVEL_2 = {
  time: 80,
  diffs: [
    itemDiff(80, 260, 'gold'),      // 0 gold coin: present / absent
    lanternDiff(200, 115),          // 1 lantern: lit / dark
    curtainDiff(220, 210, '#c45e3a'), // 2 curtain: closed / open
    itemDiff(150, 300, 'paper'),    // 3 paper menu: present / absent
    itemDiff(380, 290, 'lantern'),  // 4 lantern item: present / absent
    lanternDiff(430, 140),          // 5 lantern: lit / dark
    itemDiff(120, 430, 'gold'),     // 6 gold coin: present / absent
    curtainDiff(320, 200, '#c45e3a'), // 7 curtain: closed / open
    itemDiff(300, 330, 'paper'),    // 8 paper menu: present / absent
    lanternDiff(100, 310),          // 9 lantern: lit / dark
  ],
};

const LEVEL_3 = {
  time: 65,
  diffs: [
    curtainDiff(200, 215, '#e87a5a'), // 0 curtain: closed / open
    lanternDiff(90, 160),           // 1 lantern: lit / dark
    itemDiff(110, 300, 'gold'),     // 2 gold coin: present / absent
    lanternDiff(420, 155),          // 3 lantern: lit / dark
    itemDiff(360, 305, 'paper'),    // 4 paper menu: present / absent
    curtainDiff(300, 200, '#e87a5a'), // 5 curtain: closed / open
    itemDiff(140, 435, 'lantern'),  // 6 lantern item: present / absent
    lanternDiff(100, 300),          // 7 lantern: lit / dark
    itemDiff(240, 330, 'gold'),     // 8 gold coin: present / absent
    curtainDiff(380, 210, '#c45e3a'), // 9 curtain: closed / open
  ],
};

export const LEVELS = [LEVEL_1, LEVEL_2, LEVEL_3];

// Crosshair cursor position (panel-relative), used by keyboard play.
export const cursor = { x: 250, y: 250, panel: 0, active: false };

export { MARKER_R };

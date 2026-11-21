// Harbor Lights — difference definitions. Ten differences per level. Each difference draws itself
// differently in the left (original) and right (altered) panel, at panel-relative coordinates.
import { drawWindow, drawBoat, drawLantern, drawCat, drawCrate, drawSeagull, drawReflection } from './scene.js';

// Marker radius around a difference spot.
const MARKER_R = 22;

// A difference: {x, y, r, draw(ctx, x, y, isRight)}.
//   isRight === false -> left/original panel; true -> right/altered panel.

function lanternDiff(x, y) {
  return { x, y, r: MARKER_R, draw: (ctx, x, y, isRight) => drawLantern(ctx, x, y, !isRight) };
}
// left lit, right dark.
function windowDiff(x, y) {
  return { x, y, r: MARKER_R, draw: (ctx, x, y, isRight) => drawWindow(ctx, x - 7, y - 5, !isRight) };
}
function seagullDiff(x, y) {
  return { x, y, r: MARKER_R, draw: (ctx, x, y, isRight) => (isRight ? drawSeagull(ctx, x, y, true) : null) };
}
function catDiff(x, y) {
  return { x, y, r: MARKER_R, draw: (ctx, x, y, isRight) => (!isRight ? drawCat(ctx, x, y, true) : null) };
}
function boatDiff(x, y) {
  return {
    x, y, r: MARKER_R,
    draw: (ctx, x, y, isRight) => drawBoat(ctx, x - 22, y - 30, !isRight, !isRight),
  };
}
function crateDiff(x, y, cLeft, cRight) {
  return {
    x, y, r: MARKER_R,
    draw: (ctx, x, y, isRight) => drawCrate(ctx, x, y, isRight ? cRight : cLeft),
  };
}
function reflectionDiff(x, y) {
  return { x, y, r: MARKER_R, draw: (ctx, x, y, isRight) => (!isRight ? drawReflection(ctx, x, y, true) : null) };
}

const LEVEL_1 = {
  time: 90,
  diffs: [
    lanternDiff(150, 130),   // 0 lantern: lit / dark
    seagullDiff(340, 125),   // 1 seagull: absent / present
    reflectionDiff(430, 235),// 2 reflection: present / absent
    catDiff(170, 455),       // 3 cat: present / absent
    crateDiff(290, 450, '#a63d2b', '#5b7fa6'), // 4 crate: red / blue
    boatDiff(370, 285),      // 5 boat: mast+flag / none
    windowDiff(90, 330),     // 6 window: lit / dark (small dock office)
    lanternDiff(410, 160),   // 7 lantern: lit / dark
    seagullDiff(120, 210),   // 8 seagull: absent / present
    reflectionDiff(330, 300),// 9 reflection: present / absent
  ],
};

const LEVEL_2 = {
  time: 75,
  diffs: [
    boatDiff(80, 260),       // 0 boat: mast / none
    windowDiff(300, 145),    // 1 window: lit / dark
    catDiff(430, 455),       // 2 cat: present / absent
    lanternDiff(200, 120),   // 3 lantern: lit / dark
    crateDiff(360, 440, '#c94132', '#8c5a4a'), // 4 crate: red / brown
    reflectionDiff(95, 310), // 5 reflection: present / absent
    seagullDiff(460, 200),   // 6 seagull: absent / present
    windowDiff(130, 330),    // 7 window: lit / dark
    lanternDiff(330, 300),   // 8 lantern: lit / dark
    catDiff(110, 455),       // 9 cat: present / absent
  ],
};

const LEVEL_3 = {
  time: 60,
  diffs: [
    windowDiff(260, 135),    // 0 window: lit / dark
    boatDiff(150, 270),      // 1 boat: mast+flag / none
    lanternDiff(430, 150),   // 2 lantern: lit / dark
    crateDiff(70, 450, '#6a8caf', '#4a6a8f'), // 3 crate: blue / darker blue
    reflectionDiff(380, 220),// 4 reflection: present / absent
    seagullDiff(190, 115),   // 5 seagull: absent / present
    catDiff(340, 455),       // 6 cat: present / absent
    windowDiff(400, 340),    // 7 window: lit / dark
    lanternDiff(100, 300),   // 8 lantern: lit / dark
    reflectionDiff(240, 340),// 9 reflection: present / absent
  ],
};

export const LEVELS = [LEVEL_1, LEVEL_2, LEVEL_3];

// Crosshair cursor position (panel-relative, -1 when not active), used by keyboard play.
export const cursor = { x: 250, y: 250, panel: 0, active: false };

export { MARKER_R };

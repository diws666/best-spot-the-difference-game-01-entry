// Bazaar Nights — input. Mouse clicks on either panel and keyboard crosshair.
// Callback-driven so it knows nothing about game state.

export const cursor = { x: 250, y: 250, panel: 0, active: false };

const CLICK_TOL = 52; // forgiving radius around a difference

export function bindInput(canvas, { onPanelClick, onHint }) {
  function canvasPoint(event) {
    const rect = canvas.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  }

  canvas.addEventListener('mousedown', (ev) => {
    const p = canvasPoint(ev);
    onPanelClick(p.x, p.y);
  });

  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'h' || ev.key === 'H') { onHint(); return; }
    if (ev.key === 'Tab') { cursor.panel = 1 - cursor.panel; cursor.active = true; ev.preventDefault(); return; }
    const step = 10;
    switch (ev.key) {
      case 'ArrowLeft':  cursor.x = Math.max(0, cursor.x - step); cursor.active = true; break;
      case 'ArrowRight': cursor.x = Math.min(500, cursor.x + step); cursor.active = true; break;
      case 'ArrowUp':    cursor.y = Math.max(0, cursor.y - step); cursor.active = true; break;
      case 'ArrowDown':  cursor.y = Math.min(500, cursor.y + step); cursor.active = true; break;
      case 'Enter':
      case ' ':          ev.preventDefault(); break;
    }
  });
}

// Panel-relative click target: {panel, px, py} or null when off both pictures.
export function clickTarget(x, y, leftX, rightX, panelY, panelW, panelH) {
  if (x >= leftX && x < leftX + panelW && y >= panelY && y < panelY + panelH) {
    return { panel: 0, px: x - leftX, py: y - panelY };
  }
  if (x >= rightX && x < rightX + panelW && y >= panelY && y < panelY + panelH) {
    return { panel: 1, px: x - rightX, py: y - panelY };
  }
  return null;
}

export { CLICK_TOL };

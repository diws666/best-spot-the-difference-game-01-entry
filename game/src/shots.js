// Bazaar Nights — shot & seed handling for deterministic screenshot states.
// ?shot=start  -> title screen
// ?shot=cover  -> play, level 1, several differences found (cover shot)
// ?shot=play   -> play, level 2 (harder), a hint in use (found-difference moment)
// ?shot=hard   -> play, level 3 (hardest), no hint (harder level)
// ?shot=end    -> game complete screen
// ?seed=N      -> deterministic seed (reproducible screenshots)
export function readShot() {
  const params = new URLSearchParams(location.search);
  return {
    shot: params.get('shot'), // 'start' | 'cover' | 'play' | 'end' | null
    seed: params.get('seed'),
  };
}

// Tiny deterministic LCG so behaviour is reproducible for a given seed.
export function createRng(seed) {
  let s = (seed === undefined || seed === null || seed === '') ? 1 : Number(seed) || 1;
  s = ((s >>> 0) * 1664525 + 1013904223) >>> 0;
  return () => {
    s = ((s * 1664525 + 1013904223) >>> 0);
    return (s >>> 0) / 0xffffffff;
  };
}

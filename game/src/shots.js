// Harbor Lights — shot & seed handling for deterministic screenshot states.
// ?shot=start  -> title screen
// ?shot=play   -> mid-game on level 1 with a few differences already found
// ?shot=end    -> win / level-complete screen
// ?seed=N      -> deterministic seed (reproducible screenshots)
export function readShot() {
  const params = new URLSearchParams(location.search);
  return {
    shot: params.get('shot'), // 'start' | 'play' | 'end' | null
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

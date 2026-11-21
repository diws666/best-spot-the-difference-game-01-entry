// Spot-the-difference entrypoint: hands the game in to the make.fun grader.
//
// Copies game/ and screenshots/ from the directory this file lives in into the
// output directory (MAKEFUN_OUTPUT_DIR, default /output), then writes
// dossier.json there using buildDossier from vendor/makefun-game.ts — the same
// library the scorer uses, so the dossier it writes matches byte for byte.
//
// Node 22, standard library only. Runs as-is with `node main.ts`.

import { cpSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// The dossier caps the scorer applies: mirror them here so our local run
// refuses the same things the gate will refuse.
const caps = {
  text_max_bytes: 163_840,
  screenshots: { max: 4, max_bytes: 262_144 },
  game_max_files: 993,
  game_max_bytes: 48 * 1024 * 1024,
};

const log = (path: string) => process.stdout.write(`wrote ${path}\n`);

/** Recursively copy every file under `from` into `to`, logging each write. */
const copyTree = (from: string, to: string): void => {
  mkdirSync(to, { recursive: true });
  for (const entry of readdirSync(from, { withFileTypes: true })) {
    const fromPath = join(from, entry.name);
    const toPath = join(to, entry.name);
    if (entry.isDirectory()) {
      copyTree(fromPath, toPath);
    } else {
      cpSync(fromPath, toPath);
      log(toPath);
    }
  }
};

// Hand the game in: copy the playable files and the renders into the output dir.
mkdirSync(outDir, { recursive: true });
copyTree(join(repoRoot, 'game'), join(outDir, 'game'));
copyTree(join(repoRoot, 'screenshots'), join(outDir, 'screenshots'));

// buildDossier reads game/ and screenshots/ from the output dir and returns the
// canonical dossier bytes (schema, cover, images, text) that the scorer expects.
const dossierBytes = buildDossier(outDir, caps);
const dossierPath = join(outDir, 'dossier.json');
writeFileSync(dossierPath, dossierBytes);
log(dossierPath);

// Harbor Lights spot-the-difference entrypoint, written in my own words.
// Hands the game in: copies game/ and screenshots/ from the directory this
// file lives in into the output directory (MAKEFUN_OUTPUT_DIR, default
// /output) and writes dossier.json there, the summary the judge reads.
// Node 22, standard library only.

import { cpSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = fileURLToPath(new URL('.', import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const schema = 'makefun/dossier/v1';

const log = (path) => process.stdout.write(`wrote ${path}\n`);

/** Copy every file of one source directory, file by file, logging each write. */
const copyTree = (from, to) => {
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

mkdirSync(outDir, { recursive: true });

copyTree(join(here, 'game'), join(outDir, 'game'));
copyTree(join(here, 'screenshots'), join(outDir, 'screenshots'));

/** One screenshot's dossier entry: name, media type, size, sha256. */
const imageEntry = (name) => {
  const path = join(outDir, 'screenshots', name);
  const bytes = readFileSync(path);
  const media_type =
    bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47
      ? 'image/png'
      : bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff
        ? 'image/jpeg'
        : 'application/octet-stream';
  return {
    name,
    media_type,
    bytes: bytes.length,
    sha256: createHash('sha256').update(bytes).digest('hex'),
  };
};

const shotsDir = join(outDir, 'screenshots');
const images = readdirSync(shotsDir)
  .filter((name) => !name.startsWith('.'))
  .map((name) => ({ name, stat: statSync(join(shotsDir, name)) }))
  .filter(({ stat }) => stat.isFile())
  .sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0))
  .map(({ name }) => imageEntry(name));

if (images.length === 0) throw new Error('screenshots/ holds no image: the first image is the cover');

const cover = images[0].name;

const text =
  'Harbor Lights is a spot-the-difference game. ' +
  'Three levels, ten differences hidden on each level. ' +
  'A countdown timer limits each level, a handful of hints reveal a difference, ' +
  'and markers show the differences you have already found. ' +
  'The screenshots show the start screen, a level in play, and the end screen.';

const dossier = { schema, cover, images, text };

writeFileSync(join(outDir, 'dossier.json'), JSON.stringify(dossier, null, 2) + '\n');
log(join(outDir, 'dossier.json'));

// Imports Dexter's new faces (made in ChatGPT from the prompts in
// Desktop\Dexter faces\ALL-PROMPTS.txt) into the site.
//
//   node scripts/import-dexter-faces.mjs ["C:\path\to\Dexter faces"]
//
// For every name below it looks for dexter-<name>.png (full body) and
// dexter-<name>-bust.png (head and shoulders), trims the empty edges, sizes
// them, saves small WebP files in public/assets/dexter/faces/ and writes
// src/data/dexterFaces.js. Dexter's moods use a face as soon as it is there;
// any face still missing keeps today's Dexter. Safe to run again.
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import sharp from "sharp";

const SOURCE = process.argv[2] ?? path.join(os.homedir(), "Desktop", "Dexter faces");
const OUT_DIR = path.join("public", "assets", "dexter", "faces");
const DATA_FILE = path.join("src", "data", "dexterFaces.js");
const NAMES = ["hello", "listening", "wow", "thinking", "worried", "low", "puzzled", "celebrate", "pointing", "clipboard", "tablet", "thumbsup"];
const FIGURE_HEIGHT = 640;
const BUST_SIZE = 256;

const find = (base) => ["png", "webp", "jpg", "jpeg"].map((ext) => path.join(SOURCE, `${base}.${ext}`)).find((file) => fs.existsSync(file));
const hash = (buffer) => crypto.createHash("sha1").update(buffer).digest("hex").slice(0, 8);

async function hasTransparentEdges(file) {
  const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const alphaAt = (x, y) => data[(y * info.width + x) * info.channels + 3];
  const corners = [alphaAt(0, 0), alphaAt(info.width - 1, 0), alphaAt(0, info.height - 1), alphaAt(info.width - 1, info.height - 1)];
  return corners.every((alpha) => alpha < 20);
}

async function save(buffer, name, kind) {
  const file = `${name}-${kind}-${hash(buffer)}.webp`;
  fs.writeFileSync(path.join(OUT_DIR, file), buffer);
  return `/assets/dexter/faces/${file}`;
}

fs.mkdirSync(OUT_DIR, { recursive: true });
fs.mkdirSync(SOURCE, { recursive: true });
const faces = {};
const notes = [];

// Images saved into the project folder by mistake move to the faces folder
// (replacing older copies), so 1–2 MB PNGs never end up in a commit.
for (const file of fs.readdirSync(".")) {
  if (!/^dexter-[a-z]+(-bust)?\.(png|webp|jpe?g)$/i.test(file)) continue;
  fs.copyFileSync(file, path.join(SOURCE, file));
  fs.unlinkSync(file);
  notes.push(`moved ${file} from the project folder into ${SOURCE}`);
}

for (const name of NAMES) {
  const figureFile = find(`dexter-${name}`);
  const bustFile = find(`dexter-${name}-bust`);
  if (!figureFile && !bustFile) continue;
  const entry = {};

  if (figureFile) {
    if (!(await hasTransparentEdges(figureFile))) notes.push(`${path.basename(figureFile)}: background is not transparent; it will show as a box. Ask ChatGPT for a transparent background.`);
    const trimmed = await sharp(figureFile).ensureAlpha().trim({ threshold: 8 }).toBuffer();
    const buffer = await sharp(trimmed).resize({ height: FIGURE_HEIGHT }).webp({ quality: 82 }).toBuffer();
    const meta = await sharp(buffer).metadata();
    entry.figure = { src: await save(buffer, name, "figure"), width: meta.width, height: meta.height };
  }

  if (bustFile) {
    const trimmed = await sharp(bustFile).ensureAlpha().trim({ threshold: 8 }).toBuffer();
    const buffer = await sharp(trimmed).resize(BUST_SIZE, BUST_SIZE, { fit: "cover", position: "top" }).webp({ quality: 84 }).toBuffer();
    entry.bust = { src: await save(buffer, name, "bust") };
  } else if (figureFile) {
    // No close-up: take the top of the figure, where his head is.
    const trimmed = await sharp(figureFile).ensureAlpha().trim({ threshold: 8 }).toBuffer({ resolveWithObject: true });
    const size = Math.round(Math.min(trimmed.info.width, trimmed.info.height) * 0.5);
    const left = Math.max(0, Math.round((trimmed.info.width - size) / 2));
    const buffer = await sharp(trimmed.data).extract({ left, top: 0, width: size, height: size }).resize(BUST_SIZE, BUST_SIZE).webp({ quality: 84 }).toBuffer();
    entry.bust = { src: await save(buffer, name, "bust") };
    notes.push(`dexter-${name}-bust.png not found; made the close-up from the top of the full figure (check it).`);
  }

  faces[name] = entry;
}

// Remove files from earlier runs that the new data no longer uses.
const used = new Set(Object.values(faces).flatMap((entry) => [entry.figure?.src, entry.bust?.src]).filter(Boolean).map((src) => path.basename(src)));
for (const file of fs.readdirSync(OUT_DIR)) if (!used.has(file)) fs.unlinkSync(path.join(OUT_DIR, file));

const body = `// Written by scripts/import-dexter-faces.mjs: do not edit by hand.
// Dexter's new faces; a mood or pose missing here keeps today's Dexter.
export const DEXTER_FACES = ${JSON.stringify(faces, null, 2)};
`;
fs.writeFileSync(DATA_FILE, body);

console.log(`Source: ${SOURCE}`);
console.log(`Faces imported: ${Object.keys(faces).length ? Object.keys(faces).join(", ") : "none yet"}`);
console.log(`Still missing: ${NAMES.filter((name) => !faces[name]).join(", ") || "none"}`);
notes.forEach((note) => console.log(`Note: ${note}`));

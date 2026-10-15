import sharp from "sharp";

const [input, output] = process.argv.slice(2);
if (!input || !output) throw new Error("Usage: node scripts/remove-white-background.mjs <input> <output>");

const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width, height, channels } = info;
const visited = new Uint8Array(width * height);
const queue = new Int32Array(width * height);
let head = 0;
let tail = 0;

function isBackground(index) {
  const offset = index * channels;
  const r = data[offset];
  const g = data[offset + 1];
  const b = data[offset + 2];
  return Math.min(r, g, b) >= 150 && Math.max(r, g, b) - Math.min(r, g, b) <= 35;
}

function add(index) {
  if (visited[index] || !isBackground(index)) return;
  visited[index] = 1;
  queue[tail++] = index;
}

for (let x = 0; x < width; x += 1) {
  add(x);
  add((height - 1) * width + x);
}
for (let y = 0; y < height; y += 1) {
  add(y * width);
  add(y * width + width - 1);
}

while (head < tail) {
  const index = queue[head++];
  const x = index % width;
  const y = Math.floor(index / width);
  if (x > 0) add(index - 1);
  if (x + 1 < width) add(index + 1);
  if (y > 0) add(index - width);
  if (y + 1 < height) add(index + width);
}

for (let index = 0; index < visited.length; index += 1) {
  if (!visited[index]) continue;
  const offset = index * channels;
  data[offset + 3] = 0;
}

await sharp(data, { raw: { width, height, channels } }).png().toFile(output);

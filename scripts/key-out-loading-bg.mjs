import { mkdir, readdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const dir = path.resolve("public/assets/LoadingPage/optimized");
const outDir = path.resolve("public/assets/LoadingPage/keyed");
const lowThreshold = 8;
const highThreshold = 28;

function alphaFor(r, g, b) {
  const maxChannel = Math.max(r, g, b);
  if (maxChannel <= lowThreshold) {
    return 0;
  }
  if (maxChannel >= highThreshold) {
    return 255;
  }
  return Math.round(
    ((maxChannel - lowThreshold) / (highThreshold - lowThreshold)) * 255
  );
}

async function run() {
  await mkdir(outDir, { recursive: true });

  const files = (await readdir(dir)).filter((file) => file.endsWith(".webp"));

  for (const file of files) {
    const filePath = path.join(dir, file);
    const { data, info } = await sharp(filePath)
      .raw()
      .toBuffer({ resolveWithObject: true });

    const rgba = Buffer.alloc(info.width * info.height * 4);

    for (let pixel = 0; pixel < info.width * info.height; pixel += 1) {
      const srcIndex = pixel * info.channels;
      const dstIndex = pixel * 4;
      const r = data[srcIndex];
      const g = data[srcIndex + 1];
      const b = data[srcIndex + 2];

      rgba[dstIndex] = r;
      rgba[dstIndex + 1] = g;
      rgba[dstIndex + 2] = b;
      rgba[dstIndex + 3] = alphaFor(r, g, b);
    }

    await sharp(rgba, {
      raw: { width: info.width, height: info.height, channels: 4 },
    })
      .webp({ quality: 90 })
      .toFile(path.join(outDir, file));
  }

  console.log(`Keyed out background on ${files.length} frames`);
}

run();

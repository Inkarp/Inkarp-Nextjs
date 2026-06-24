import { mkdir, readdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const sourceDir = path.resolve("public/assets/LoadingPage");
const outputDir = path.resolve("public/assets/LoadingPage/optimized");
const targetSize = 320;

async function run() {
  await mkdir(outputDir, { recursive: true });

  const files = (await readdir(sourceDir)).filter((file) =>
    file.endsWith(".png")
  );

  let totalBytes = 0;

  for (const file of files) {
    const match = file.match(/_(\d+)\.png$/);
    if (!match) {
      continue;
    }

    const index = match[1];
    const outputPath = path.join(outputDir, `frame-${index}.webp`);

    const buffer = await sharp(path.join(sourceDir, file))
      .resize(targetSize, targetSize, { fit: "contain" })
      .webp({ quality: 78 })
      .toBuffer();

    await sharp(buffer).toFile(outputPath);
    totalBytes += buffer.length;
  }

  console.log(
    `Optimized ${files.length} frames -> ${(totalBytes / 1024 / 1024).toFixed(2)} MB total`
  );
}

run();

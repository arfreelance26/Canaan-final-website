import sharp from "sharp";
import { readdir } from "fs/promises";

const dir = "public/clients";
const files = await readdir(dir);
const MAX_W = 1600;

for (const file of files) {
  if (!file.endsWith(".jpg")) continue;
  const path = `${dir}/${file}`;
  const meta = await sharp(path).metadata();
  if (meta.width <= MAX_W) { console.log(`- ${file}: ${meta.width}px ok`); continue; }
  const info = await sharp(path).resize(MAX_W).jpeg({ quality: 82, mozjpeg: true }).toFile(path + ".tmp");
  const fs = await import("fs");
  fs.renameSync(path + ".tmp", path);
  console.log(`✓ ${file}: ${meta.width} → ${info.width}px  ~${Math.round(info.size / 1024)} KB`);
}

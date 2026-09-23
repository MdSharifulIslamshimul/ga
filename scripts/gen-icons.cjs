const sharp = require('sharp');
const path = require('path');

function createSvg(size) {
  const fontSize = Math.round(size * 0.42);
  const cx = size / 2;
  const cy = size / 2;
  const r = Math.round(size * 0.18);
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${r}" fill="#1a1d23"/>
  <text x="${cx}" y="${cy + fontSize * 0.05}" dominant-baseline="central" text-anchor="middle" fill="#ffffff" font-family="Arial,Helvetica,sans-serif" font-weight="700" font-size="${fontSize}">FN</text>
</svg>`);
}

async function main() {
  const outDir = path.join(__dirname, '..', 'public', 'icons');
  for (const size of [16, 48, 128]) {
    const svg = createSvg(size);
    await sharp(svg)
      .resize(size, size)
      .png()
      .toFile(path.join(outDir, `icon${size}.png`));
    console.log(`Generated icon${size}.png`);
  }
}

main().catch(console.error);

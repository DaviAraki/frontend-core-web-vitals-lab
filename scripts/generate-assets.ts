/**
 * Idempotent asset generator for the Core Web Vitals lab.
 *
 * This script produces every image the demo needs from SVG/vector scenes using
 * `sharp` — there are no binary assets checked into the repo, so the project
 * stays text-only and reproducible.
 *
 * What it creates (in public/images/):
 *   - hero-large.jpg      A deliberately LARGE, unoptimized JPEG (quality 100,
 *                         no mozjpeg, no chroma subsampling) for the /bad route.
 *                         The scene includes fractal-noise texture so the JPEG
 *                         cannot compress to a tiny size — this is the whole
 *                         point of the "unoptimized hero image" LCP lesson.
 *   - hero-optimized.webp The same scene as a properly-sized, optimized WebP
 *                         (quality 78) for the /optimized route.
 *   - product-1.webp      600x600 thumbnail.
 *   - product-2.webp      600x600 thumbnail.
 *
 * Runs automatically on `pnpm install` (postinstall) and via `pnpm assets`.
 * It no-ops when all four files already exist.
 */
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs/promises';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const imagesDir = path.resolve(__dirname, '..', 'public', 'images');

const HERO_W = 1600;
const HERO_H = 1000;
const PRODUCT_W = 600;
const PRODUCT_H = 600;

const TARGETS = ['hero-large.jpg', 'hero-optimized.webp', 'product-1.webp', 'product-2.webp'] as const;

async function pathExists(p: string): Promise<boolean> {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

/**
 * Build a colorful "product hero" SVG scene. The <feTurbulence> overlay adds
 * high-frequency texture, which is what makes the JPEG genuinely large.
 */
function heroScene(hueA: string, hueB: string, label: string): string {
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${HERO_W}" height="${HERO_H}" viewBox="0 0 ${HERO_W} ${HERO_H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${hueA}"/>
      <stop offset="100%" stop-color="${hueB}"/>
    </linearGradient>
    <filter id="noise">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/>
      <feColorMatrix type="saturate" values="0"/>
    </filter>
  </defs>
  <rect width="100%" height="100%" fill="url(#bg)"/>
  <g opacity="0.9">
    <circle cx="420" cy="520" r="240" fill="#ffffff" opacity="0.12"/>
    <rect x="900" y="180" width="460" height="300" rx="32" fill="#ffffff" opacity="0.10"/>
    <rect x="960" y="620" width="340" height="220" rx="32" fill="#000000" opacity="0.10"/>
    <path d="M120 820 Q 600 640 1480 860" stroke="#ffffff" stroke-opacity="0.25" stroke-width="14" fill="none"/>
  </g>
  <text x="80" y="140" font-family="system-ui, sans-serif" font-size="64" font-weight="700" fill="#ffffff">${label}</text>
  <rect width="100%" height="100%" filter="url(#noise)" opacity="0.18"/>
</svg>`;
}

function productScene(base: string, accent: string): string {
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${PRODUCT_W}" height="${PRODUCT_H}" viewBox="0 0 ${PRODUCT_W} ${PRODUCT_H}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${base}"/>
      <stop offset="100%" stop-color="${accent}"/>
    </linearGradient>
    <filter id="pnoise">
      <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" stitchTiles="stitch"/>
      <feColorMatrix type="saturate" values="0"/>
    </filter>
  </defs>
  <rect width="100%" height="100%" fill="url(#g)"/>
  <circle cx="300" cy="300" r="150" fill="#ffffff" opacity="0.18"/>
  <rect x="90" y="420" width="420" height="120" rx="24" fill="#000000" opacity="0.12"/>
  <rect width="100%" height="100%" filter="url(#pnoise)" opacity="0.16"/>
</svg>`;
}

async function writeSize(filePath: string): Promise<void> {
  const stat = await fs.stat(filePath);
  const kb = (stat.size / 1024).toFixed(1);
  console.log(`[assets]   ${path.basename(filePath)}: ${kb} KB`);
}

async function main(): Promise<void> {
  await fs.mkdir(imagesDir, { recursive: true });

  const allPresent = (
    await Promise.all(TARGETS.map((t) => pathExists(path.join(imagesDir, t))))
  ).every(Boolean);

  if (allPresent) {
    console.log('[assets] images already present — skipping generation.');
    return;
  }

  console.log('[assets] generating demo images with sharp...');

  const hero = heroScene('#6366f1', '#ec4899', 'Aurora Headphones');
  const heroBuffer = Buffer.from(hero, 'utf-8');

  // 1) Deliberately large, unoptimized JPEG for the /bad route.
  //    quality:100 + chromaSubsampling 4:4:4 + no mozjpeg => big file.
  await sharp(heroBuffer)
    .resize(HERO_W, HERO_H)
    .jpeg({ quality: 100, chromaSubsampling: '4:4:4', mozjpeg: false })
    .toFile(path.join(imagesDir, 'hero-large.jpg'));

  // 2) Same scene, optimized WebP for the /optimized route.
  await sharp(heroBuffer)
    .resize(HERO_W, HERO_H)
    .webp({ quality: 78 })
    .toFile(path.join(imagesDir, 'hero-optimized.webp'));

  // 3) Product thumbnails.
  await sharp(Buffer.from(productScene('#0ea5e9', '#6366f1'), 'utf-8'))
    .resize(PRODUCT_W, PRODUCT_H)
    .webp({ quality: 72 })
    .toFile(path.join(imagesDir, 'product-1.webp'));

  await sharp(Buffer.from(productScene('#f59e0b', '#ef4444'), 'utf-8'))
    .resize(PRODUCT_W, PRODUCT_H)
    .webp({ quality: 72 })
    .toFile(path.join(imagesDir, 'product-2.webp'));

  for (const t of TARGETS) {
    await writeSize(path.join(imagesDir, t));
  }
  console.log('[assets] done.');
}

main().catch((err) => {
  console.error('[assets] generation failed:', err);
  process.exit(1);
});

import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, '..', 'public', 'icons');
mkdirSync(outDir, { recursive: true });

function html(size, radiusPct) {
  return `<!doctype html><html><head><meta charset="utf-8" /><style>
    html,body{margin:0;padding:0;}
    .icon{
      width:${size}px;height:${size}px;
      display:flex;align-items:center;justify-content:center;
      background:linear-gradient(160deg,#4f46e5 0%,#7c3aed 55%,#c026d3 100%);
      border-radius:${radiusPct}%;
    }
    .emoji{font-size:${Math.round(size * 0.52)}px;line-height:1;}
  </style></head><body><div class="icon"><span class="emoji">\u{1F4A1}</span></div></body></html>`;
}

const targets = [
  { name: 'icon-192.png', size: 192, radiusPct: 22 },
  { name: 'icon-512.png', size: 512, radiusPct: 22 },
  { name: 'icon-maskable-512.png', size: 512, radiusPct: 0 },
  { name: 'apple-touch-icon.png', size: 180, radiusPct: 22 },
];

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
try {
  const page = await browser.newPage();
  for (const t of targets) {
    await page.setViewportSize({ width: t.size, height: t.size });
    await page.setContent(html(t.size, t.radiusPct));
    const el = await page.$('.icon');
    const buffer = await el.screenshot({ omitBackground: t.radiusPct === 0 ? false : true });
    writeFileSync(path.join(outDir, t.name), buffer);
    console.log('wrote', t.name);
  }
} finally {
  await browser.close();
}

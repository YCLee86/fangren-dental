// hero-v6-final.jpg 底部有 1px 的白邊（hero-resize.mjs 的守門擋下來），裁掉 → hero-src.jpg
const { chromium } = (await import('/opt/node22/lib/node_modules/playwright/index.js')).default;
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const here = dirname(fileURLToPath(import.meta.url));
const src = readFileSync(resolve(here, 'hero-v6-final.jpg')).toString('base64');
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const p = await b.newPage();
const out = await p.evaluate(async (src) => {
  const im = new Image(); im.src = 'data:image/jpeg;base64,' + src; await im.decode();
  const w = im.naturalWidth, h = im.naturalHeight - 1;
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  c.getContext('2d').drawImage(im, 0, 0, w, h, 0, 0, w, h);
  return [w, h, c.toDataURL('image/jpeg', 0.95)];
}, src);
writeFileSync(resolve(here, 'hero-src.jpg'), Buffer.from(out[2].split(',')[1], 'base64'));
await b.close();
console.log('寫好了 hero-src.jpg', out[0] + '×' + out[1]);

// 從牙周分享卡的原圖裁出「有臉的牙齒 ＋ 細菌」→ ref-characters.jpg
// 用途：提示詞的第一張參考圖，只負責「牙齒角色與細菌怎麼畫」。
// 原圖 drafts/og-topic-perio-src.jpg 是 2848×1504；裁框避開醫師、水柱與頂端色帶。
const { chromium } = (await import('/opt/node22/lib/node_modules/playwright/index.js')).default;
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const here = dirname(fileURLToPath(import.meta.url));
const src = readFileSync(resolve(here, '../og-topic-perio-src.jpg')).toString('base64');
const [x, y, w, h] = [1620, 300, 1228, 1180];
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const p = await b.newPage();
const url = await p.evaluate(async ({ src, x, y, w, h }) => {
  const im = new Image(); im.src = 'data:image/jpeg;base64,' + src; await im.decode();
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  c.getContext('2d').drawImage(im, x, y, w, h, 0, 0, w, h);
  return c.toDataURL('image/jpeg', 0.9);
}, { src, x, y, w, h });
writeFileSync(resolve(here, 'ref-characters.jpg'), Buffer.from(url.split(',')[1], 'base64'));
await b.close();
console.log('寫好了 ref-characters.jpg', w + '×' + h);

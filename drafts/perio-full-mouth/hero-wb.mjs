// hero-src.jpg 偏黃 → 依「紙色」做白平衡，產出 hero-src-wb-<目標>.jpg
// 量法：亮度 > 225 的像素的平均 RGB（＝紙色）。原檔紙色 246,239,222（R−B 24），
// 同科〈八成人有牙周病〉245,241,233（R−B 12）。每個通道乘上同一個增益，把紙色拉到目標。
// 用法：node drafts/perio-full-mouth/hero-wb.mjs 16 12 6   （目標的 R−B）
const { chromium } = (await import('/opt/node22/lib/node_modules/playwright/index.js')).default;
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const here = dirname(fileURLToPath(import.meta.url));
const targets = process.argv.slice(2).map(Number);
const src = readFileSync(resolve(here, 'hero-src.jpg')).toString('base64');
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const p = await b.newPage();
for (const t of targets) {
  const [url, paper, gains] = await p.evaluate(async ({ src, t }) => {
    const im = new Image(); im.src = 'data:image/jpeg;base64,' + src; await im.decode();
    const c = document.createElement('canvas'); c.width = im.naturalWidth; c.height = im.naturalHeight;
    const g = c.getContext('2d'); g.drawImage(im, 0, 0);
    const id = g.getImageData(0, 0, c.width, c.height), d = id.data;
    let n = 0, R = 0, G = 0, B = 0;
    for (let i = 0; i < d.length; i += 4) if ((d[i] + d[i+1] + d[i+2]) / 3 > 225) { n++; R += d[i]; G += d[i+1]; B += d[i+2]; }
    R /= n; G /= n; B /= n;
    // 目標紙色：R 不動，B = R − t，G 取 R 與 B 之間原本的相對位置
    const tB = R - t, tG = tB + (G - B) / (R - B) * (R - tB);
    const k = [1, tG / G, tB / B];
    for (let i = 0; i < d.length; i += 4) for (let j = 0; j < 3; j++) d[i+j] = Math.min(255, Math.round(d[i+j] * k[j]));
    g.putImageData(id, 0, 0);
    return [c.toDataURL('image/jpeg', 0.95), [R, G, B].map(Math.round), k.map(x => x.toFixed(3))];
  }, { src, t });
  writeFileSync(resolve(here, `hero-src-wb-${t}.jpg`), Buffer.from(url.split(',')[1], 'base64'));
  console.log(`R−B ${t}：原紙色 ${paper}　增益 ${gains}　→ hero-src-wb-${t}.jpg`);
}
await b.close();

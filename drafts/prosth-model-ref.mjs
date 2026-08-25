/* 產生 drafts/prosth-model-ref.png —— 牙模的「形狀參考圖」。
   理由：ILLUSTRATION.md 第十之一節「形狀不要用文字描述，用參考圖」。
   植牙那五個梗有四個手上／桌上有牙模，光用文字描述模型一定會漂。
   ⚠ 這是給模型看**形狀**的線稿，不是風格參考（風格另附 style-ref-*.jpg）。
   ⚠ 圖上刻意沒有任何字（有字模型就會把字畫進去）。
   左＝下顎模型俯視（馬蹄形，右後方缺兩顆）／右＝上下顎對咬的側面。
   跑法：node drafts/prosth-model-ref.mjs                                        */
import { writeFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const GYP = '#efeae1', GYP_S = '#ddd5c7', LINE = '#7d766b', BASE = '#e3dbcd';

function arch(cx, cy, a, b, missing = []) {
  const N = 14, pts = [];
  for (let i = 0; i < N; i++) {
    const t = (-1 + (2 * i) / (N - 1)) * 1.30;
    const x = cx + a * Math.sin(t);
    const y = cy - b * Math.cos(t);
    const back = 1 - Math.cos(t);                 // 0 = 最前，1 = 最後
    pts.push({ x, y, w: 17 + 20 * back, h: 26 + 10 * back, deg: (t * 180) / Math.PI, i });
  }
  const n = p => [Math.sin(p.deg * Math.PI / 180), -Math.cos(p.deg * Math.PI / 180)];
  const outer = pts.map(p => { const [dx, dy] = n(p), k = p.w * 0.62; return `${(p.x + dx * k).toFixed(1)},${(p.y + dy * k).toFixed(1)}`; });
  const inner = [...pts].reverse().map(p => { const [dx, dy] = n(p), k = p.w * 0.70; return `${(p.x - dx * k).toFixed(1)},${(p.y - dy * k).toFixed(1)}`; });
  let s = `<polygon points="${outer.concat(inner).join(' ')}" fill="${BASE}" stroke="${LINE}" stroke-width="2.6" stroke-linejoin="round"/>`;
  for (const p of pts) {
    const T = `rotate(${p.deg.toFixed(1)} ${p.x.toFixed(1)} ${p.y.toFixed(1)})`;
    if (missing.includes(p.i)) {                   // 缺牙：牙床上一個空位
      s += `<ellipse cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" rx="${(p.w * 0.42).toFixed(1)}" ry="${(p.h * 0.30).toFixed(1)}" transform="${T}" fill="${GYP_S}" stroke="${LINE}" stroke-width="2"/>`;
      continue;
    }
    s += `<rect x="${(p.x - p.w / 2).toFixed(1)}" y="${(p.y - p.h / 2).toFixed(1)}" width="${p.w.toFixed(1)}" height="${p.h.toFixed(1)}" rx="${(p.w * 0.28).toFixed(1)}" transform="${T}" fill="${GYP}" stroke="${LINE}" stroke-width="2.4"/>`;
    s += `<path d="M${(p.x - p.w * 0.28).toFixed(1)} ${p.y.toFixed(1)} h${(p.w * 0.56).toFixed(1)}" transform="${T}" stroke="${LINE}" stroke-width="1.4" opacity=".55"/>`;
  }
  return s;
}

function bite(x0, y0) {
  const N = 7, w = 34, h = 38, gap = 6;
  const up = (x, y) => `<path d="M${x} ${y} l0 ${-h} h${w} l0 ${h} q${-w / 2} ${13} ${-w} 0 z" fill="${GYP}" stroke="${LINE}" stroke-width="2.4" stroke-linejoin="round"/>`;
  const dn = (x, y) => `<path d="M${x} ${y} l0 ${h} h${w} l0 ${-h} q${-w / 2} ${-13} ${-w} 0 z" fill="${GYP}" stroke="${LINE}" stroke-width="2.4" stroke-linejoin="round"/>`;
  let s = '';
  s += `<rect x="${x0 - 10}" y="${y0 - gap - h - 62}" width="${N * w + 20}" height="64" rx="10" fill="${BASE}" stroke="${LINE}" stroke-width="2.6"/>`;
  for (let i = 0; i < N; i++) s += up(x0 + i * w, y0 - gap);
  s += `<rect x="${x0 - 10 + 17}" y="${y0 + gap + h - 2}" width="${N * w + 20}" height="64" rx="10" fill="${BASE}" stroke="${LINE}" stroke-width="2.6"/>`;
  for (let i = 0; i < N; i++) s += dn(x0 + i * w + 17, y0 + gap);
  return s;
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="380" viewBox="80 90 1000 380">
<rect x="80" y="90" width="1000" height="380" fill="#ffffff"/>
<g>${arch(310, 350, 200, 225, [9, 10])}</g>
<g>${bite(700, 310)}</g>
</svg>`;

writeFileSync('/tmp/prosth-model-ref.html', `<!doctype html><meta charset="utf-8"><style>html,body{margin:0;background:#fff}</style>${svg}`);
const bin = ['/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell',
             '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'].find(p => existsSync(p));
if (!bin) throw new Error('找不到 Chromium');
if (bin.endsWith('chrome')) console.warn('⚠ 用到完整版 chrome，畫面會少 87px（CLAUDE.md 第九節第 18 條）');
execFileSync(bin, ['--headless', '--no-sandbox', '--disable-gpu', '--hide-scrollbars',
  '--force-device-scale-factor=1', '--window-size=1000,380',
  '--screenshot=drafts/prosth-model-ref.png', '/tmp/prosth-model-ref.html'], { stdio: 'ignore' });
console.log('→ drafts/prosth-model-ref.png');

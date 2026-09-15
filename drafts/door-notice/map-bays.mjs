// 把路邊停車格寫進站上那張簡易地圖（index.html 的 #map-clip 裡面）。
//
//   node drafts/door-notice/map-bays.mjs           寫檔
//   node drafts/door-notice/map-bays.mjs --check   只比對，不寫
//
// ⚠⚠ 格子的座標從 parking-map.mjs import 進來 —— 清查那張 PNG 與站上這一份
//    **只有一個出處**；號碼的唯一出處仍然是 parking-survey.json（那一支有守門在對）。
//    清查資料改了就重跑這一支，然後接著跑 node tools/topics.mjs 與 node tools/build.mjs。
//
// ⚠ 寫進去的是 <!-- BAYS:START --> ~ <!-- BAYS:END --> 之間，**不要手改那一段**。
// ⚠ 號碼**不產**（2026-09-15 定案不寫號碼）——手機上永安路東側那一排有 9 個
//   數字會被地圖的 slice 裁掉，而且一格只有 8px 寬，號碼擠不下。
// ⚠ 裝卸貨車專用區（郵局門口）**刻意沒有畫**：那一格停不得，畫在「鄰近停車格」上是陷阱。

import { readFileSync, writeFileSync } from 'node:fs';
import { BAYS, HBAYS, WEST, W, L } from './parking-map.mjs';

const FILE = new URL('../../index.html', import.meta.url);
const A = '<!-- BAYS:START —— 由 drafts/door-notice/map-bays.mjs 產生，請勿手動編輯 -->';
const B = '<!-- BAYS:END -->';

const rect = (x, y, w, h, cls) =>
  `<rect class="bay${cls}" x="${x}" y="${y}" width="${w}" height="${h}" rx="2.5"/>`;

const main = BAYS.map(o => rect(o.x, o.y, W, L, ''))
  .concat(HBAYS.map(o => rect(o.x, o.y, L, W, '')));
// ⚠ 文化路・平和街口以西那一排：**數量是示意的、號碼還沒清查**（見 parking-survey.json），
//   自己一個 class 標著，日後清查完就把 .bay-est 拿掉。
const est = WEST.map(o => rect(o.x, o.y, L, W, ' bay-est'));

const block = A + '\n                <g id="bays" aria-hidden="true">' +
  main.join('') + est.join('') + '</g>\n                ' + B;

let h = readFileSync(FILE, 'utf8');
if (h.includes(A)) {
  const i = h.indexOf(A), j = h.indexOf(B, i);
  if (j === -1) throw new Error('找到 BAYS:START 卻找不到 BAYS:END');
  h = h.slice(0, i) + block + h.slice(j + B.length);
} else {
  // 第一次：插在 #map-clip 的收尾之前
  const s = h.indexOf('<g id="map-clip"');
  if (s === -1) throw new Error('找不到 #map-clip');
  const e = h.indexOf('</svg>', s);
  const g = h.lastIndexOf('</g>', e);
  if (g === -1 || g < s) throw new Error('找不到 #map-clip 的收尾');
  h = h.slice(0, g) + block + '\n\n              ' + h.slice(g);
}

const old = readFileSync(FILE, 'utf8');
const n = main.length, m = est.length;
if (process.argv.includes('--check')) {
  console.log(h === old ? `✓ 一致（格子 ${n} ＋示意 ${m}）` : `✗ 和 index.html 不一樣，要重跑`);
  process.exit(h === old ? 0 : 1);
}
writeFileSync(FILE, h);
console.log(`ok　格子 ${n} ＋示意 ${m}`);

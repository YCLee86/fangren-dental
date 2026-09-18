#!/usr/bin/env node
/* 那條「標誌排成一排」的分隔線 —— 另外存成可以帶走的 SVG（2026-09-18）
 *
 *   node drafts/channels/band-logo.mjs
 *     → drafts/channels/band/fangren-band-27.svg       定案那一條（七顆套科別色、其餘淡墨）
 *     → drafts/channels/band/fangren-band-27-mono.svg  全部 currentColor（放哪裡都能上色）
 *     → drafts/channels/band/fangren-band-9.svg        一個基數（九顆，接得起來的最小一段）
 *
 * 使用者 2026-09-18：「這個帶子 logo 我很喜歡　另外存起來　我在新的對話開啟要用」。
 *
 * ⚠⚠⚠ **幾何一個數字都不在這裡** —— 全部 import `stand-card.mjs`（形狀讀 `brand/shapes/`、
 *   寬度讀 `preview/line-booked/wm-sizes.json`、順序與套色位置讀 `stand-card.json`）。
 *   這一支只做一件事：把已經排好的那一條寫成獨立的檔案。改內容改那幾份再重跑。
 * ⚠ 成品住在 `drafts/`，進不了 `_site`（fangren.net 上找不到）——**但這三個檔進版控**，
 *   新的對話直接讀它們就好，不必先跑任何東西。
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { BAND, 帶, bandSvg, 墨色, 套色, S, CARD, 洞比 } from "./stand-card.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..", "..");
const DIR = path.join(HERE, "band");
fs.mkdirSync(DIR, { recursive: true });

const 頭 = (名) => `<!-- 芳仁牙醫診所：${名}\n`
  + `     由 node drafts/channels/band-logo.mjs 產生，幾何的出處是 brand/shapes/、\n`
  + `     preview/line-booked/wm-sizes.json 與 drafts/channels/stand-card.json。不要手改。 -->\n`;

const 寫 = (檔, 名, svg) => {
  const p = path.join(DIR, 檔);
  fs.writeFileSync(p, 頭(名) + svg.replace(/^<svg class="[^"]*"/, "<svg") + "\n");
  return { 檔, 位: p, 大小: fs.statSync(p).size };
};

const out = [
  寫("fangren-band-27.svg", "分隔線・27 顆（定案，七顆套各自的科別色，其餘淡墨 " + 墨色 + "）",
    bandSvg(BAND, "bnd", 墨色)),
  /* ⚠ mono 版把套色也一起吃掉：整條交給 `color` 決定，所以貼到深底上只要改一個字。 */
  寫("fangren-band-27-mono.svg", "分隔線・27 顆（全部 currentColor，放哪裡都能上色）",
    bandSvg(帶(BAND.顆數, S.帶子.間距, 9), "bnd", "currentColor").replace(/style="color:[^"]*"/g, "")),
  寫("fangren-band-9.svg", "分隔線・9 顆（一個基數 ＝ 接得起來的最小一段，全部 currentColor）",
    bandSvg(帶(9, S.帶子.間距, 9), "bnd", "currentColor").replace(/style="color:[^"]*"/g, "")),
];

const mm = (v) => (v / BAND.總寬 * CARD.寬mm).toFixed(2);
console.log("一條 %d 顆（基數 %d × %d 倍）　viewBox %s×%s",
  BAND.顆數, BAND.基, BAND.顆數 / BAND.基, BAND.總寬.toFixed(1), BAND.總高.toFixed(1));
console.log("四邊與顆與顆之間五個間隔都是 %s（＝最高那一顆的 %s）",
  BAND.gap.toFixed(1), BAND.間距);
console.log("最高那一顆 %s、最小的牙洞佔整條 %s‰",
  BAND.高.toFixed(1), (Math.min(...BAND.it.map((l) => 洞比(l.k) * l.w)) / BAND.總寬 * 1000).toFixed(2));
console.log("套色 七科各一顆：第 %s 顆（間隔 %s）", 套色.位.join("／"), 套色.間隔.join("／"));
console.log("印在 98 mm 寬的卡片上：帶子高 %s mm、一顆最高 %s mm", mm(BAND.總高), mm(BAND.高));
for (const o of out) console.log("  %s（%s KB）", path.relative(ROOT, o.位), (o.大小 / 1024).toFixed(1));

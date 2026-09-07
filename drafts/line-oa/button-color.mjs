/* 按鈕底色的三種算法（2026-08-28 第四輪）
 *
 * 使用者：「改過的按鈕顏色有點暗淡灰灰的，不好看。」
 * 成因：把 HSL 的明度往下壓時**飽和度沒有跟著補**，同一個 S 在暗的地方
 * 看起來就是灰的（人眼對彩度的感覺跟著明度走）。三案：
 *
 *   Ⓐ 現況　壓暗、飽和度不動、白字
 *   Ⓑ 原色　**他挑的顏色一個值都不動**，字改成深墨 #2A2C27
 *   Ⓒ 壓暗＋飽和度拉滿，白字
 *
 *   node drafts/line-oa/button-color.mjs
 *   node drafts/line-oa/flex-preview.mjs button-color.json
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const C = JSON.parse(fs.readFileSync(path.join(HERE, "handouts", "colors.json"), "utf8"));
const INK = "#2A2C27";

const hex = (r, g, b) => "#" + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("").toUpperCase();
function r2h(r, g, b) { r /= 255; g /= 255; b /= 255;
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2;
  if (mx === mn) return [0, 0, l];
  const d = mx - mn, s = l > .5 ? d / (2 - mx - mn) : d / (mx + mn);
  let h = mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return [h / 6, s, l]; }
function h2r(h, s, l) { if (s === 0) { const v = l * 255; return [v, v, v]; }
  const q = l < .5 ? l * (1 + s) : l + s - l * s, p = 2 * l - q;
  const f = (t) => { t = (t + 1) % 1;
    return t < 1 / 6 ? p + (q - p) * 6 * t : t < 1 / 2 ? q : t < 2 / 3 ? p + (q - p) * (2 / 3 - t) * 6 : p; };
  return [f(h + 1 / 3), f(h), f(h - 1 / 3)].map((v) => v * 255); }
const lum = (h) => { const c = [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255)
  .map((v) => v <= .03928 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4);
  return .2126 * c[0] + .7152 * c[1] + .0722 * c[2]; };
const R = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m); return (x + .05) / (y + .05); };

const vivid = (frame) => {
  const [h, s, l] = r2h(...[1, 3, 5].map((i) => parseInt(frame.slice(i, i + 2), 16)));
  for (let L = l; L >= 0; L -= .004) { const t = hex(...h2r(h, 1, L)); if (R(t, "#FFFFFF") >= 4.5) return t; }
  return hex(...h2r(h, 1, 0));
};

const btn = (bg, fg, label) => ({
  type: "box", layout: "vertical", backgroundColor: bg,
  cornerRadius: "6px", height: "40px", justifyContent: "center", flex: 1,
  action: { type: "uri", label, uri: "https://fangren.net/" },
  contents: [{ type: "box", layout: "horizontal", justifyContent: "center", alignItems: "center",
    contents: [{ type: "text", text: label, color: fg, size: "md", weight: "bold", flex: 0 }] }],
});
const cap = (t) => ({ type: "text", text: t, size: "xxs", color: "#8E8E8E", weight: "bold", margin: "lg" });

const body = { type: "box", layout: "vertical", backgroundColor: "#F4F4F5",
  paddingAll: "16px", spacing: "sm", contents: [
  { type: "text", text: "按鈕底色的三種算法", size: "md", weight: "bold", color: "#2C5238" },
  { type: "text", text: "Ⓐ 壓暗（現況）　Ⓑ 原色＋深墨字　Ⓒ 壓暗＋飽和度拉滿", size: "xxs", color: "#8E8E8E", wrap: true }]};

const seen = new Set();
for (const [name, v] of Object.entries(C)) {
  if (seen.has(v.frame)) continue;
  seen.add(v.frame);
  const c = vivid(v.frame);
  body.contents.push(cap(`${name}　框 ${v.frame}`));
  body.contents.push({ type: "box", layout: "horizontal", spacing: "sm", contents: [
    btn(v.fill, "#FFFFFF", "Ⓐ 看大圖"), btn(v.frame, INK, "Ⓑ 看大圖")]});
  body.contents.push({ type: "box", layout: "horizontal", spacing: "sm", contents: [
    btn(c, "#FFFFFF", "Ⓒ 看大圖"), { type: "box", layout: "vertical", contents: [] }]});
  console.log(`  ${name.padEnd(10)} 框 ${v.frame}　Ⓐ ${v.fill} (${R(v.fill, "#FFFFFF").toFixed(2)})` +
    `　Ⓑ ${v.frame}＋墨 (${R(v.frame, INK).toFixed(2)})　Ⓒ ${c} (${R(c, "#FFFFFF").toFixed(2)})`);
}
fs.writeFileSync(path.join(HERE, "button-color.json"),
  JSON.stringify({ type: "bubble", size: "mega", body }, null, 2) + "\n");

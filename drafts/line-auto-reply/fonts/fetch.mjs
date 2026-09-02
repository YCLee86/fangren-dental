#!/usr/bin/env node
/* 把 glyphs.txt 裡的字從 Google Fonts 取回來、子集化，存成 ntc-*-sub.woff2 ＋ chunks.json
 *
 *   node drafts/line-auto-reply/fonts/fetch.mjs
 *
 * 為什麼要這一支：容器裡只有文泉驛，站上的品牌字是 Noto Sans TC。
 * Google Fonts 把 CJK 切成一百多個分段（各自帶 unicode-range），
 * 這支只抓「我們的字真的落在裡面」的那幾段，再用 pyftsubset 收乾淨。
 * ⚠ 要在圖上加新字，就把字補進 glyphs.txt 再跑一次 —— 不要放著讓它掉到系統字
 *   （2026-09-02 踩過：「牙齒衛教」四個字有三個不在子集裡，出圖變成另一套字）。
 * ⚠ 需要 pyftsubset（pip install fonttools brotli）與對外網路。
 */
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36";
const TEXT = fs.readFileSync(path.join(HERE, "glyphs.txt"), "utf8");
const cps = new Set([...TEXT].map((c) => c.codePointAt(0)));
const out = [];

for (const w of [500, 700]) {
  const css = execFileSync("curl", ["-sS", "--max-time", "40", "-A", UA,
    `https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@${w}`], { encoding: "utf8" });
  const faces = css.split("@font-face").slice(1);
  if (faces.length < 50) throw new Error(`weight ${w} 只拿到 ${faces.length} 段，八成是被擋了`);
  faces.forEach((f, idx) => {
    const url = f.match(/url\((https:[^)]+)\)/)[1];
    const ur = f.match(/unicode-range:\s*([^;]+);/)[1];
    const ranges = ur.split(",").map((x) => x.trim().replace(/^U\+/i, "").split("-").map((h) => parseInt(h, 16)))
      .map((r) => (r.length === 1 ? [r[0], r[0]] : r));
    let hit = false;
    for (const cp of cps) if (ranges.some(([a, b]) => cp >= a && cp <= b)) { hit = true; break; }
    if (!hit) return;
    const name = `ntc-${w}-${idx}-sub.woff2`;
    const tmp = path.join(HERE, `.tmp-${name}`);
    execFileSync("curl", ["-sS", "--max-time", "60", "-o", tmp, url]);
    execFileSync("pyftsubset", [tmp, `--text-file=${path.join(HERE, "glyphs.txt")}`,
      "--flavor=woff2", `--output-file=${path.join(HERE, name)}`,
      "--layout-features=", "--no-hinting", "--desubroutinize"]);
    fs.unlinkSync(tmp);
    out.push({ w, name, ur });
  });
}
for (const f of fs.readdirSync(HERE))
  if (/-sub\.woff2$/.test(f) && !out.some((o) => o.name === f)) fs.unlinkSync(path.join(HERE, f));
fs.writeFileSync(path.join(HERE, "chunks.json"), JSON.stringify(out));
const kb = out.reduce((n, o) => n + fs.statSync(path.join(HERE, o.name)).size, 0) / 1024;
console.log(`${out.length} 段、共 ${kb.toFixed(0)}KB，涵蓋 ${cps.size} 個字`);

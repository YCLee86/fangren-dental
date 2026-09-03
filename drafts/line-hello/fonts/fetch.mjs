#!/usr/bin/env node
/* 招呼圖卡上那個「hello／你好」要用的圓潤粗體，從 Google Fonts 取回來並子集化。
 *
 *   node drafts/line-hello/fonts/fetch.mjs
 *
 * 使用者的參考是 URBAN RESEARCH 那張「final sale」海報：幾何、等粗、
 * 端點全圓、字重很重。Google Fonts 上結構最接近的幾支列在 FAMILIES。
 * ⚠ M PLUS Rounded 1c 與 Zen Maru Gothic 是日文圓體，同時涵蓋拉丁與 CJK ——
 *   所以「hello」和「你好」可以是同一支字，這是選它們的主要理由。
 *   ⚠ 但日文字型不保證有「你」，出圖前要驗（generate.mjs 有一道守門）。
 * ⚠ 需要 pyftsubset（pip install fonttools brotli）與對外網路。
 */
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36";
const TEXT = "helloHello你好";                     /* 只要這幾個字 */
fs.writeFileSync(path.join(HERE, "glyphs.txt"), TEXT);
const cps = new Set([...TEXT].map((c) => c.codePointAt(0)));

const FAMILIES = [
  { id: "mplus",  q: "M+PLUS+Rounded+1c:wght@900", label: "M PLUS Rounded 1c 900" },
  { id: "zenmaru", q: "Zen+Maru+Gothic:wght@900",  label: "Zen Maru Gothic 900" },
  { id: "baloo",  q: "Baloo+2:wght@800",           label: "Baloo 2 800" },
  { id: "fredoka", q: "Fredoka:wght@600",          label: "Fredoka 600" },
  /* ⚠⚠ 中文的「你好」只能靠這一支：M PLUS Rounded 1c 與 Zen Maru Gothic 都是日文圓體，
     實測**「你」不在它們的字集裡**（只有「好」）。Google Fonts 上沒有圓體的繁中，
     所以「你好」用 Noto Sans TC 900 再自己加一圈同色的圓角描邊去逼近圓潤感 ——
     那是近似，不是真的圓體，要跟使用者講清楚。 */
  { id: "ntc",    q: "Noto+Sans+TC:wght@900",      label: "Noto Sans TC 900（中文用）" },
];

const out = [];
for (const fam of FAMILIES) {
  const css = execFileSync("curl", ["-sS", "--max-time", "40", "-A", UA,
    `https://fonts.googleapis.com/css2?family=${fam.q}&display=swap`], { encoding: "utf8" });
  const faces = css.split("@font-face").slice(1);
  if (!faces.length) throw new Error(`${fam.label} 一段都沒拿到，八成是家族名稱寫錯或被擋了`);
  let n = 0;
  faces.forEach((f, idx) => {
    const url = f.match(/url\((https:[^)]+)\)/)[1];
    const ur = f.match(/unicode-range:\s*([^;]+);/)[1];
    const ranges = ur.split(",").map((x) => x.trim().replace(/^U\+/i, "").split("-").map((h) => parseInt(h, 16)))
      .map((r) => (r.length === 1 ? [r[0], r[0]] : r));
    if (![...cps].some((cp) => ranges.some(([a, b]) => cp >= a && cp <= b))) return;
    const name = `${fam.id}-${idx}-sub.woff2`;
    const tmp = path.join(HERE, `.tmp-${name}`);
    execFileSync("curl", ["-sS", "--max-time", "60", "-o", tmp, url]);
    execFileSync("pyftsubset", [tmp, `--text=${TEXT}`, "--flavor=woff2",
      `--output-file=${path.join(HERE, name)}`, "--layout-features=*", "--no-hinting"]);
    fs.unlinkSync(tmp);
    out.push({ id: fam.id, label: fam.label, name, ur });
    n++;
  });
  if (!n) throw new Error(`${fam.label} 沒有任何一段涵蓋到 ${TEXT}`);
  console.log(`${fam.label.padEnd(24)} ${n} 段`);
}
fs.writeFileSync(path.join(HERE, "chunks.json"), JSON.stringify(out, null, 2));
const kb = out.reduce((a, f) => a + fs.statSync(path.join(HERE, f.name)).size, 0) / 1024;
console.log(`共 ${out.length} 段、${kb.toFixed(0)}KB`);

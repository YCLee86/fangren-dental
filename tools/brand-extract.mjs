#!/usr/bin/env node
/* =============================================================================
   從品牌原檔（.ai／.pptx）抽出向量與預覽圖 → brand/
   -----------------------------------------------------------------------------
     node tools/brand-extract.mjs           兩份原檔都重跑
     node tools/brand-extract.mjs <檔案>    只跑一份

   ⚠⚠ **為什麼需要這一支**：雲端 session 沒有 Illustrator／PowerPoint，容器裡也沒有
   poppler／mutool／ghostscript／PIL（都確認過），所以原檔進了 repo 之後
   **沒有任何人打得開它**。原檔存的是原件，SVG／PNG 存的是「不必裝東西就能用」的那一份。

   ── .ai 這一側 ──────────────────────────────────────────────────────────
   Illustrator 存檔預設會寫成 PDF 相容格式（檔頭就是 %PDF），所以把頁面的內容流
   用 zlib 解開，再把 PDF 的路徑算符翻成 SVG 的 `d` 就好。**零依賴。**

   支援到的算符只有這個檔用到的那些：q Q cm / m l c v y h re / W n / S f B / w /
   cs CS scn SCN。⚠ **沒有支援文字（Tj／TJ）與影像（Do）** —— 這一份標誌全部是
   外框化的路徑，所以夠用。日後換一個帶活字的檔進來，產出會少東西而且**不會報錯**，
   所以下面留了守門（EXPECT）。

   ⚠⚠⚠ **顏色一定要抽，不可以一律當成黑的。**（2026-09-03 踩過，是使用者看出來的：
   「有嘴巴圖案但沒有牙洞」。）第一版把每一條路徑都畫成黑的，結果是：
   ・工作區域 3 **整頁是彩色的**（九個色票），全部變成黑的；
   ・**牙洞是白色填色**（CMYK `0 0 0 0`，整頁 23 條路徑），畫成黑的就等於消失在牙齒裡。
   ⚠ 23 這個數字是拿 Illustrator 自己的 SVG 匯出數出來的（那一份就有 23 個
     `fill="#FFFFFF"`）——**不要拿內容流裡 `0 0 0 0 scn` 出現幾次來數**，
     一次 scn 之後可以連著填好幾條路徑（數出來是 19，少了 4）。
   症狀是「圖看起來很正常，只是少了一個東西」——**不會報錯**。
   下面 EXPECT.whiteFills 那道守門就是為了這件事。

   ⚠ CMYK → RGB **不是自己算的**，是查表。表的來源是 **Illustrator 自己匯出的 SVG**
   （`brand/fangren-logo-104.pptx` 裡就內嵌著同一份圖的官方 SVG 匯出），
   用外框位置一條一條對起來得到的。這個檔用的是 ICCBased 的四色空間，
   自己套公式算會偏（實測九個色票每一個都差得出來），而且**沒有理由用估的** ——
   官方匯出就在手上。**遇到表裡沒有的 CMYK 一律 throw，不要猜。**

   ── .pptx 這一側 ────────────────────────────────────────────────────────
   PowerPoint 把圖存成「SVG（正本）＋ PNG（後備）」成對放在 ppt/media/。
   這一支照 slide 的關聯把兩者配對，再照內容取名字搬出來。**沒有重畫任何東西**，
   那四對就是設計師從 Illustrator 匯出的原樣。

   ── 形狀（brand/shapes/）────────────────────────────────────────────────
   使用者 2026-09-03：「顏色倒是還好，標準色之前已經寫進網站了……**只要形狀就好了**。」
   所以工作區域 3 那些色塊還會再各自輸出一份**只有形狀**的 SVG：
   ・單一條路徑、`fill="currentColor"`、`fill-rule="evenodd"` —— **牙洞是真的挖穿的**，
     不是拿一顆白點蓋上去（蓋上去的話換底色就會露餡）。
   ・裁到形狀自己的外框（viewBox 從 0 起算），要多大就給多大。
   ・路徑的數字**逐字沿用原件**，沒有重算 —— 只用一層 transform 把座標搬過去。

   ⚠⚠ Chromium 要挑 headless_shell、不能挑完整版 chrome（CLAUDE.md 第九節第 18 條：
   完整版畫出來會比 --window-size 少 87px，而且不報錯）。
   ============================================================================= */

import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { execFileSync } from "node:child_process";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const OUT_DIR = path.join(ROOT, "brand");
const AI = path.join(OUT_DIR, "fangren-logo-2024-12-05.ai");
const PPTX = path.join(OUT_DIR, "fangren-logo-104.pptx");
const PNG_W = 1200;

/* .ai 的三個工作區域各是什麼 —— 檔名用得到，順序也是守門的一部分 */
const ARTBOARDS = ["wordmark", "latin", "lockups"];

/* pptx 裡那四對圖各是什麼（照 PNG 的內容取名，配對關係由 slide 的 rels 決定） */
const PPTX_NAMES = {
  "image1.png": "1-lockups-color",     // 三組組合標，彩色（有牙洞）
  "image3.png": "2-wordmark",          // 中文標準字，墨色
  "image5.png": "3-latin",             // 英文標準字，墨色
  "image7.png": "4-wordmark-reverse",  // 中文標準字，**白色反白版**（深色底專用）
};

/* 工作區域 3 那顆九宮格，每一格叫什麼（照畫面上的位置，左上是 r1c1）。
   ⚠ **r1c2 就是站上頁首那顆標誌**：正規化之後對 index.html 的 .brand-mark
   最大殘差 0.009%，外框長寬比同樣是 2.02918。所以它會另外再輸出一份 mark.svg。
   ⚠ 名字刻意用位置不用顏色 —— 使用者 2026-09-03 說「只要形狀就好了」，
   而且站上的科別色本來就不是照這九顆走的。 */
const GRID = ["r1c1", "r1c2", "r1c3", "r2c1", "r2c2", "r2c3", "r3c1", "r3c2", "r3c3"];

/* ⚠ CMYK → hex：來源是 Illustrator 自己的 SVG 匯出，**不是算出來的**（見檔頭）。
   換了新的原檔、跑出「認不得的 CMYK」時，正確的做法是回頭從官方匯出補一筆，
   不是在這裡套一條轉換公式。 */
const CMYK = {
  "0 0 0 0":           "#FFFFFF",   // 牙洞（整份 23 條，這一條掉了就看不出來）
  "0 0 0 1":           "#231815",   // 標準字的墨
  "0.2 0.2 0.2 0":     "#D3CBC5",   // 米
  "0.4 0.3 0.4 0":     "#A8A998",   // 灰綠
  "0.45 0.6 0.7 0":    "#9E7253",   // 焦糖
  "0.45 0.6 0.7 0.4":  "#714F38",   // 深焦糖（實心牙齒那一顆）
  "0.5 0.85 0.7 0":    "#944449",   // 酒紅
  "0.55 0.7 0.65 0.1": "#805751",   // 紅褐
  "0.7 0.5 0.75 0.1":  "#5A6E4F",   // 綠
  "0.7 0.65 0.55 0.1": "#5E5A61",   // 灰紫
  "0.85 0.65 0.5 0.1": "#315568",   // 藍
  "0.9 0.6 0.7 0.3":   "#0B4B46",   // 深綠松
};

/* 守門：抽完之後這幾件事要成立，不成立就出聲。
   ・markRatio 2.02918 ＝ 站上標誌的外框長寬比（assets/icon.svg 與
     tools/logo-png.mjs 的 RATIO 都是它）—— 找不到就表示不是同一份標誌，或抽漏了。
   ・whiteFills ＝ 牙洞。⚠ 這一條是 2026-09-03 那個 bug 的守門，不要拿掉。 */
const EXPECT = { markRatio: 2.02918, tol: 0.0005, minPaths: 200, whiteFills: 23 };

/* ── Chromium ─────────────────────────────────────────────────────────── */
/* ⚠ headless_shell 一定要排在完整版 chrome 前面，理由見檔頭 */
const chromeCandidates = () => {
  const out = [];
  if (process.env.CHROME_PATH) out.push(process.env.CHROME_PATH);
  const pw = process.env.PLAYWRIGHT_BROWSERS_PATH || "/opt/pw-browsers";
  if (fs.existsSync(pw)) {
    for (const d of fs.readdirSync(pw)) out.push(path.join(pw, d, "chrome-linux", "headless_shell"));
    for (const d of fs.readdirSync(pw)) {
      out.push(path.join(pw, d, "chrome-linux", "chrome"));
      out.push(path.join(pw, d, "chrome-mac", "Chromium.app", "Contents", "MacOS", "Chromium"));
      out.push(path.join(pw, d, "chrome-win", "chrome.exe"));
    }
  }
  out.push("/usr/bin/chromium", "/usr/bin/chromium-browser", "/usr/bin/google-chrome");
  return out;
};
const CHROME = chromeCandidates().find((p) => p && fs.existsSync(p));

/* ── PDF 幾何 ─────────────────────────────────────────────────────────── */
const mul = (a, b) => [                       // a 先套、b 後套（cm 是左乘目前矩陣）
  a[0] * b[0] + a[1] * b[2], a[0] * b[1] + a[1] * b[3],
  a[2] * b[0] + a[3] * b[2], a[2] * b[1] + a[3] * b[3],
  a[4] * b[0] + a[5] * b[2] + b[4], a[4] * b[1] + a[5] * b[3] + b[5],
];
const n = (v) => Math.round(v * 1000) / 1000;

const colorOf = (cmyk, where) => {
  if (cmyk === null) return "#231815";        // 沒宣告過就是預設的黑
  const hex = CMYK[cmyk];
  if (!hex) throw new Error(`認不得的顏色 CMYK(${cmyk})，在${where} —— 回官方匯出補一筆到 CMYK 表，不要用公式估`);
  return hex;
};

function toPaths(src) {
  const toks = src.replace(/[\r\n]+/g, " ").split(/\s+/).filter(Boolean);
  const isNum = (t) => /^[-+]?[\d.]+$/.test(t);
  let st = { ctm: [1, 0, 0, 1, 0, 0], w: 1, fill: null, stroke: null };
  const stack = [], out = [];
  let d = [], cur = [0, 0], start = [0, 0], nums = [];
  const at = (i) => nums[nums.length + i];
  const P = (x, y) => {
    const m = st.ctm;
    return `${n(m[0] * x + m[2] * y + m[4])} ${n(m[1] * x + m[3] * y + m[5])}`;
  };
  const strokeW = () => {
    /* 線寬要跟著 CTM 縮放；用行列式開根號當等效比例（這一份只有平移，＝1） */
    const s = Math.sqrt(Math.abs(st.ctm[0] * st.ctm[3] - st.ctm[1] * st.ctm[2])) || 1;
    return n(st.w * s);
  };

  for (const t of toks) {
    if (isNum(t)) { nums.push(parseFloat(t)); continue; }
    switch (t) {
      case "q": stack.push({ ...st }); break;
      case "Q": st = stack.pop() || st; break;
      case "cm": st.ctm = mul(nums.slice(-6), st.ctm); break;
      case "w": st.w = at(-1); break;
      /* ⚠ scn 是填色、SCN 是描邊，**大小寫是兩件事**，不要合併 */
      case "scn": st.fill = nums.slice(-4).join(" "); break;
      case "SCN": st.stroke = nums.slice(-4).join(" "); break;
      case "m": cur = start = [at(-2), at(-1)]; d.push(`M ${P(cur[0], cur[1])}`); break;
      case "l": cur = [at(-2), at(-1)]; d.push(`L ${P(cur[0], cur[1])}`); break;
      case "c":
        d.push(`C ${P(at(-6), at(-5))} ${P(at(-4), at(-3))} ${P(at(-2), at(-1))}`);
        cur = [at(-2), at(-1)]; break;
      case "v":                                   // 第一個控制點 ＝ 目前點
        d.push(`C ${P(cur[0], cur[1])} ${P(at(-4), at(-3))} ${P(at(-2), at(-1))}`);
        cur = [at(-2), at(-1)]; break;
      case "y":                                   // 第二個控制點 ＝ 終點
        d.push(`C ${P(at(-4), at(-3))} ${P(at(-2), at(-1))} ${P(at(-2), at(-1))}`);
        cur = [at(-2), at(-1)]; break;
      case "h": d.push("Z"); cur = start; break;
      case "re": {
        const [x, y, w, h] = nums.slice(-4);
        d.push(`M ${P(x, y)} L ${P(x + w, y)} L ${P(x + w, y + h)} L ${P(x, y + h)} Z`);
        cur = start = [x, y]; break;
      }
      /* W n ＝ 設裁切區。這一份的裁切一律是整張頁面，所以直接丟掉；
         n 本身是「不描不填」，路徑同樣作廢。 */
      case "W": case "W*": case "n": d = []; break;
      case "f": case "F": case "f*":
        if (d.length) out.push({ d: d.join(" "), fill: colorOf(st.fill, "填色") });
        d = []; break;
      case "s": case "S":
        if (t === "s") d.push("Z");
        if (d.length) out.push({ d: d.join(" "), stroke: colorOf(st.stroke, "描邊"), w: strokeW() });
        d = []; break;
      case "B": case "B*": case "b": case "b*":
        if (d.length) {
          out.push({ d: d.join(" "), fill: colorOf(st.fill, "填色") });
          out.push({ d: d.join(" "), stroke: colorOf(st.stroke, "描邊"), w: strokeW() });
        }
        d = []; break;
      default: break;
    }
    nums = [];
  }
  return out;
}

/* 真貝茲極值求外框 —— 只拿控制點會高估，認不出「哪一條是標誌」 */
function bboxOf(d) {
  const t = d.match(/[MLCZ]|-?[\d.]+/g) || [];
  let i = 0, cx = 0, cy = 0, sx = 0, sy = 0;
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  const pt = (x, y) => { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); };
  const cubic = (p0, p1, p2, p3) => {
    pt(p3[0], p3[1]);
    for (const k of [0, 1]) {
      const a = -p0[k] + 3 * p1[k] - 3 * p2[k] + p3[k];
      const b = 2 * (p0[k] - 2 * p1[k] + p2[k]);
      const c = -p0[k] + p1[k];
      const roots = [];
      if (Math.abs(a) < 1e-12) { if (Math.abs(b) > 1e-12) roots.push(-c / b); }
      else { const D = b * b - 4 * a * c; if (D >= 0) { const r = Math.sqrt(D); roots.push((-b + r) / (2 * a), (-b - r) / (2 * a)); } }
      for (const u of roots) {
        if (!(u > 0 && u < 1)) continue;
        const m = 1 - u;
        const v = m * m * m * p0[k] + 3 * m * m * u * p1[k] + 3 * m * u * u * p2[k] + u * u * u * p3[k];
        if (k === 0) { x0 = Math.min(x0, v); x1 = Math.max(x1, v); }
        else { y0 = Math.min(y0, v); y1 = Math.max(y1, v); }
      }
    }
  };
  while (i < t.length) {
    const c = t[i++];
    if (c === "M") { cx = +t[i++]; cy = +t[i++]; sx = cx; sy = cy; pt(cx, cy); }
    else if (c === "L") { cx = +t[i++]; cy = +t[i++]; pt(cx, cy); }
    else if (c === "C") {
      const p1 = [+t[i++], +t[i++]], p2 = [+t[i++], +t[i++]], p3 = [+t[i++], +t[i++]];
      cubic([cx, cy], p1, p2, p3); cx = p3[0]; cy = p3[1];
    } else if (c === "Z") { cx = sx; cy = sy; }
  }
  return { x0, y0, x1, y1, w: x1 - x0, h: y1 - y0 };
}

const shot = (svg, base, W, H) => {
  if (!CHROME) return null;
  const tmp = fs.mkdtempSync(path.join(process.env.TMPDIR || "/tmp", "brand-"));
  const h = Math.round(PNG_W * (H / W));
  const html = path.join(tmp, "p.html");
  const png = path.join(OUT_DIR, `${base}.png`);
  fs.writeFileSync(html,
    `<!doctype html><meta charset="utf-8"><style>html,body{margin:0;padding:0;background:#fff}` +
    `svg{display:block;width:${PNG_W}px;height:${h}px}</style>${svg}`, "utf8");
  execFileSync(CHROME, [
    ...(path.basename(CHROME).startsWith("headless_shell") ? [] : ["--headless"]),
    "--no-sandbox", "--disable-gpu", "--hide-scrollbars", "--force-color-profile=srgb",
    `--screenshot=${png}`, `--window-size=${PNG_W},${h}`,
    `--user-data-dir=${path.join(tmp, "profile")}`, `file://${html}`,
  ], { stdio: ["ignore", "ignore", "pipe"] });
  fs.rmSync(tmp, { recursive: true, force: true });
  if (!fs.existsSync(png)) throw new Error("Chromium 沒有產出 PNG");
  return `${PNG_W}×${h}`;
};

/* ── .ai ──────────────────────────────────────────────────────────────── */
function runAi(src) {
  const buf = fs.readFileSync(src);
  const raw = buf.toString("latin1");
  if (!raw.startsWith("%PDF")) {
    throw new Error("這個檔不是 PDF 相容的 .ai（Illustrator 存檔要勾「建立 PDF 相容檔案」）");
  }
  const objAt = (id) => {
    const m = new RegExp(`(?:^|[^0-9])${id} 0 obj`).exec(raw);
    if (!m) return null;
    const start = m.index + m[0].length;
    return { start, dict: raw.slice(start, raw.indexOf("endobj", start)) };
  };
  const streamOf = (id) => {
    const o = objAt(id);
    const i = o.dict.indexOf("stream");
    let j = i + "stream".length;
    if (raw[o.start + j] === "\r") j++;
    if (raw[o.start + j] === "\n") j++;
    const len = +(/\/Length (\d+)/.exec(o.dict) || [])[1];
    const bytes = buf.subarray(o.start + j, o.start + j + len);
    return /\/FlateDecode/.test(o.dict) ? zlib.inflateSync(bytes).toString("latin1")
                                        : bytes.toString("latin1");
  };

  /* 工作區域照 /Kids 的順序，不要照物件編號 —— 兩者不一定一致 */
  const kids = (/\/Kids\s*\[([^\]]*)\]/.exec(raw) || [])[1];
  if (!kids) throw new Error("找不到 /Kids，這個 PDF 的結構不是預期的樣子");
  const pageIds = [...kids.matchAll(/(\d+) 0 R/g)].map((m) => +m[1]);

  let total = 0, white = 0, markRatio = null;
  pageIds.forEach((pid, idx) => {
    const page = objAt(pid);
    const art = (/\/ArtBox\[([^\]]*)\]/.exec(page.dict) || [])[1]
             || (/\/MediaBox\[([^\]]*)\]/.exec(page.dict) || [])[1];
    const [x0, y0, x1, y1] = art.trim().split(/\s+/).map(Number);
    const cid = +(/\/Contents (\d+) 0 R/.exec(page.dict) || [])[1];
    const paths = toPaths(streamOf(cid));
    total += paths.length;
    white += paths.filter((p) => p.fill === "#FFFFFF").length;

    for (const p of paths) {
      const b = bboxOf(p.d);
      if (b.h > 1 && b.w > 20 && Math.abs(b.w / b.h - EXPECT.markRatio) < EXPECT.tol) markRatio = b.w / b.h;
    }

    const W = n(x1 - x0), H = n(y1 - y0);
    const body = paths.map((p) => p.fill
      ? `  <path d="${p.d}" fill="${p.fill}"/>`
      : `  <path d="${p.d}" fill="none" stroke="${p.stroke}" stroke-width="${p.w}" stroke-linecap="round" stroke-linejoin="round"/>`
    ).join("\n");
    /* PDF 的 y 軸往上、SVG 往下 —— 整組翻過來，不要逐點去減 */
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="芳仁牙醫診所標誌・工作區域 ${idx + 1}">
<g transform="translate(${n(-x0)} ${n(y1)}) scale(1 -1)">
${body}
</g>
</svg>
`;
    const base = `artboard-${idx + 1}-${ARTBOARDS[idx] || "art"}`;
    fs.writeFileSync(path.join(OUT_DIR, `${base}.svg`), svg, "utf8");
    const size = shot(svg, base, W, H);
    const cols = [...new Set(paths.map((p) => p.fill || p.stroke))];
    console.log(`  工作區域 ${idx + 1}（${ARTBOARDS[idx]}）：${paths.length} 條路徑・${cols.length} 色・${W}×${H}pt${size ? " → " + size + "px" : "（沒找到 Chromium，略過 PNG）"}`);
    if (ARTBOARDS[idx] === "lockups") writeShapes(paths);
  });

  if (total < EXPECT.minPaths) throw new Error(`只抽到 ${total} 條路徑（預期至少 ${EXPECT.minPaths}）—— 多半是有活字或影像沒被抽出來`);
  if (markRatio === null) throw new Error(`找不到長寬比 ${EXPECT.markRatio} 的那條路徑 —— 不是站上那顆標誌，或抽取有漏`);
  /* ⚠ 這一條是 2026-09-03「牙洞不見了」那個 bug 的守門，不要拿掉 */
  if (white !== EXPECT.whiteFills) throw new Error(`白色填色 ${white} 個，預期 ${EXPECT.whiteFills} 個 —— 牙洞抽掉了或多抽了（見檔頭）`);
  console.log(`  ✓ 標誌外框長寬比 ${markRatio.toFixed(5)}・白色填色（牙洞）${white} 個`);
}

/* ── 形狀（只有形狀，牙洞真的挖穿）───────────────────────────────────── */
/* 只跑工作區域 3 —— 那一頁才有色塊；另外兩頁是標準字，形狀就是字本身。 */
function writeShapes(paths) {
  const dir = path.join(OUT_DIR, "shapes");
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });

  /* ⚠ 同一條路徑可能同時被填色又被描邊（PDF 的 B 算符），去重要看 `d` 不是看順序 */
  const uniq = (arr) => [...new Map(arr.map((p) => [p.d, p])).values()];
  const holes = uniq(paths.filter((p) => p.fill === "#FFFFFF")).map((p) => ({ ...p, b: bboxOf(p.d) }));
  const bodies = uniq(paths.filter((p) => p.fill && p.fill !== "#FFFFFF"))
    .map((p) => ({ ...p, b: bboxOf(p.d) })).filter((p) => p.b.w > 12);

  const emit = (name, body, kind) => {
    /* 落在這一塊裡面的白點 ＝ 它的牙洞 */
    const mine = holes.filter((h) => h.b.x0 >= body.b.x0 - .5 && h.b.x1 <= body.b.x1 + .5
                                  && h.b.y0 >= body.b.y0 - .5 && h.b.y1 <= body.b.y1 + .5);
    const { x0, y0, x1, y1 } = body.b;
    const w = n(x1 - x0), h = n(y1 - y0);
    /* ⚠ 路徑的數字逐字沿用原件，只用一層 transform 搬座標（PDF 的 y 往上、SVG 往下）。
       ⚠ fill-rule 一定要 evenodd —— 牙洞是「同一條路徑裡的另一個子路徑」，
          不是蓋在上面的白點；蓋白點的話換底色就會露餡。 */
    const d = [body.d, ...mine.map((m) => m.d)].join(" ");
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="芳仁牙醫診所・${name}">
<g transform="translate(${n(-x0)} ${n(y1)}) scale(1 -1)">
  <path d="${d}" fill="currentColor" fill-rule="evenodd"/>
</g>
</svg>
`;
    fs.writeFileSync(path.join(dir, `${name}.svg`), svg, "utf8");
    return { name, w, h, holes: mine.length, kind };
  };

  /* 九宮格：先照畫面由上而下、由左而右排好（PDF 的 y 往上，所以 y 大的在上面） */
  const big = bodies.filter((p) => p.b.w > 60);            // 右邊那顆實心牙齒
  const grid = bodies.filter((p) => p.b.w <= 60)
    .sort((a, b) => (b.b.y0 - a.b.y0) || (a.b.x0 - b.b.x0));
  if (grid.length !== GRID.length) throw new Error(`九宮格抓到 ${grid.length} 塊，預期 ${GRID.length} 塊`);
  /* 同一列的三塊 y 不完全齊（形狀高度不同），所以先分三列再各自照 x 排 */
  const rows = [grid.slice(0, 3), grid.slice(3, 6), grid.slice(6, 9)]
    .map((r) => r.sort((a, b) => a.b.x0 - b.b.x0));
  const made = [];
  rows.flat().forEach((p, i) => made.push(emit(`shape-${GRID[i]}`, p, "九宮格")));
  big.forEach((p) => made.push(emit("tooth-solid", p, "實心牙齒")));

  /* r1c2 ＝ 站上頁首那顆，另外給一份好記的名字 */
  const mark = rows[0][1];
  made.push(emit("mark", mark, "站上頁首那顆"));
  if (Math.abs(mark.b.w / mark.b.h - EXPECT.markRatio) > EXPECT.tol) {
    throw new Error(`r1c2 的長寬比 ${(mark.b.w / mark.b.h).toFixed(5)} 不是 ${EXPECT.markRatio} —— 九宮格的排序可能跑掉了`);
  }

  /* 外框線版（中間那組組合標裡的那一顆，是描邊不是填色） */
  const outline = uniq(paths.filter((p) => p.stroke)).map((p) => ({ ...p, b: bboxOf(p.d) }))
    .find((p) => p.b.w > 40 && Math.abs(p.b.w / p.b.h - EXPECT.markRatio) < EXPECT.tol);
  if (outline) {
    const { x0, y1, w, h } = { x0: outline.b.x0, y1: outline.b.y1, w: n(outline.b.w), h: n(outline.b.h) };
    /* ⚠ 這一顆的牙洞是**同色的實心點**（不是挖穿的）—— 線稿版本來就這樣畫 */
    const dot = holes.length ? null : null;
    const inner = uniq(paths.filter((p) => p.fill && p.fill !== "#FFFFFF"))
      .map((p) => ({ ...p, b: bboxOf(p.d) }))
      .find((p) => p.b.w < 8 && p.b.x0 > outline.b.x0 && p.b.x1 < outline.b.x1
                             && p.b.y0 > outline.b.y0 && p.b.y1 < outline.b.y1);
    /* 描邊的線寬會被外框裁掉一半，所以 viewBox 上下左右各留半個線寬 */
    const pad = outline.w / 2;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${n(w + outline.w)} ${n(h + outline.w)}" width="${n(w + outline.w)}" height="${n(h + outline.w)}" role="img" aria-label="芳仁牙醫診所・標誌外框線版">
<g transform="translate(${n(-x0 + pad)} ${n(y1 + pad)}) scale(1 -1)">
  <path d="${outline.d}" fill="none" stroke="currentColor" stroke-width="${outline.w}" stroke-linecap="round" stroke-linejoin="round"/>${inner ? `
  <path d="${inner.d}" fill="currentColor"/>` : ""}
</g>
</svg>
`;
    fs.writeFileSync(path.join(dir, "mark-outline.svg"), svg, "utf8");
    made.push({ name: "mark-outline", w: n(w + outline.w), h: n(h + outline.w), holes: inner ? 1 : 0, kind: "外框線版" });
  }

  for (const m of made) {
    console.log(`  shapes/${(m.name + ".svg").padEnd(20)} ${String(m.w).padStart(6)}×${String(m.h).padEnd(6)} 牙洞 ${m.holes}　${m.kind}`);
  }
  const total = made.reduce((a, m) => a + m.holes, 0);
  if (total < 12) throw new Error(`形狀檔一共只挖了 ${total} 個牙洞，太少 —— 白點的歸屬判斷可能壞了`);

  /* 一張總覽圖，讓「不打開檔案」也看得到十二個形狀。
     ⚠ 底色刻意用一個**不是黑也不是白**的顏色：牙洞如果是拿白點蓋出來的（而不是
        真的挖穿），在白底上看不出來、在這個底上一眼就穿幫。 */
  const sheet = made.map((m) => {
    const svg = fs.readFileSync(path.join(dir, `${m.name}.svg`), "utf8")
      .replace(/ width="[\d.]+" height="[\d.]+"/, "");
    return `<figure><div class=b>${svg}</div><figcaption>${m.name}</figcaption></figure>`;
  }).join("");
  const html = `<!doctype html><meta charset="utf-8"><style>
body{margin:0;background:#e8b04a;font:13px system-ui;padding:18px;display:grid;grid-template-columns:repeat(4,1fr);gap:14px}
figure{margin:0;text-align:center}
.b{height:110px;display:flex;align-items:center;justify-content:center;color:#2a2c27}
svg{max-width:100%;max-height:100px;height:auto}
figcaption{margin-top:4px;color:#3a2a08}</style>${sheet}`;
  if (CHROME) {
    const tmp = fs.mkdtempSync(path.join(process.env.TMPDIR || "/tmp", "brand-"));
    const f = path.join(tmp, "sheet.html");
    fs.writeFileSync(f, html, "utf8");
    execFileSync(CHROME, [
      ...(path.basename(CHROME).startsWith("headless_shell") ? [] : ["--headless"]),
      "--no-sandbox", "--disable-gpu", "--hide-scrollbars", "--force-color-profile=srgb",
      `--screenshot=${path.join(OUT_DIR, "shapes.png")}`, "--window-size=1000,560",
      `--user-data-dir=${path.join(tmp, "profile")}`, `file://${f}`,
    ], { stdio: ["ignore", "ignore", "pipe"] });
    fs.rmSync(tmp, { recursive: true, force: true });
    console.log(`  shapes.png            十二個形狀的總覽（底色刻意不是黑白，牙洞沒挖穿就會穿幫）`);
  }
}

/* ── .pptx ────────────────────────────────────────────────────────────── */
/* 零依賴讀 zip：只支援 store(0) 與 deflate(8)，Office 產的就這兩種 */
function unzip(file) {
  const buf = fs.readFileSync(file);
  const eocd = buf.lastIndexOf(Buffer.from([0x50, 0x4b, 0x05, 0x06]));
  if (eocd < 0) throw new Error("這個檔不是 zip（.pptx 應該是）");
  let off = buf.readUInt32LE(eocd + 16);
  const count = buf.readUInt16LE(eocd + 10);
  const files = new Map();
  for (let i = 0; i < count; i++) {
    const nameLen = buf.readUInt16LE(off + 28);
    const extraLen = buf.readUInt16LE(off + 30);
    const commentLen = buf.readUInt16LE(off + 32);
    const method = buf.readUInt16LE(off + 10);
    const size = buf.readUInt32LE(off + 20);
    const lho = buf.readUInt32LE(off + 42);
    const name = buf.toString("utf8", off + 46, off + 46 + nameLen);
    const lNameLen = buf.readUInt16LE(lho + 26);
    const lExtraLen = buf.readUInt16LE(lho + 28);
    const start = lho + 30 + lNameLen + lExtraLen;
    const data = buf.subarray(start, start + size);
    files.set(name, method === 0 ? data : zlib.inflateRawSync(data));
    off += 46 + nameLen + extraLen + commentLen;
  }
  return files;
}

function runPptx(src) {
  const zip = unzip(src);
  /* PNG（後備）與 SVG（正本）是成對的，配對關係寫在投影片的 <a:blip> 裡 */
  const pairs = new Map();
  for (const [name, data] of zip) {
    const m = /^ppt\/slides\/slide(\d+)\.xml$/.exec(name);
    if (!m) continue;
    const rels = zip.get(`ppt/slides/_rels/slide${m[1]}.xml.rels`).toString("utf8");
    const idmap = Object.fromEntries([...rels.matchAll(/Id="([^"]+)"[^>]*Target="\.\.\/(media\/[^"]+)"/g)].map((r) => [r[1], r[2]]));
    const xml = data.toString("utf8");
    for (const b of xml.matchAll(/<a:blip r:embed="([^"]+)"([\s\S]{0,900}?)<\/a:blip>/g)) {
      const png = idmap[b[1]];
      const sv = /svgBlip[^>]*r:embed="([^"]+)"/.exec(b[2]);
      if (png && sv) pairs.set(png.replace("media/", ""), idmap[sv[1]].replace("media/", ""));
    }
  }
  const missing = Object.keys(PPTX_NAMES).filter((k) => !pairs.has(k));
  if (missing.length) throw new Error(`pptx 裡找不到這幾張圖：${missing.join("、")} —— 換過原檔的話要回來改 PPTX_NAMES`);

  for (const [png, label] of Object.entries(PPTX_NAMES)) {
    const svgName = pairs.get(png);
    const pngData = zip.get(`ppt/media/${png}`);
    const svgData = zip.get(`ppt/media/${svgName}`);
    fs.writeFileSync(path.join(OUT_DIR, `pptx-${label}.png`), pngData);
    /* ⚠ SVG 要把 CRLF 收成 LF 再寫 —— 不然 git 會在 commit 時自己正規化，
       而這一支下次重跑又寫回 CRLF，`git status` 就永遠有一個檔是髒的。
       內容一個字都沒改，要逐位元組的原樣回頭解 pptx 的 ppt/media/。 */
    fs.writeFileSync(path.join(OUT_DIR, `pptx-${label}.svg`),
      svgData.toString("utf8").replace(/\r\n/g, "\n"), "utf8");
    const dim = `${pngData.readUInt32BE(16)}×${pngData.readUInt32BE(20)}`;
    console.log(`  ${String(label).padEnd(22)} ${png} + ${svgName}・PNG ${dim}`);
  }
}

/* ── 跑 ──────────────────────────────────────────────────────────────── */
const arg = process.argv[2];
const jobs = arg ? [arg] : [AI, PPTX];
fs.mkdirSync(OUT_DIR, { recursive: true });
for (const f of jobs) {
  if (!fs.existsSync(f)) { console.error(`× 找不到 ${f}`); process.exitCode = 1; continue; }
  console.log(`${path.basename(f)}：`);
  if (f.endsWith(".pptx")) runPptx(f); else runAi(f);
}

// 線稿的交件門檻量測（drafts/topic-lineart-prompt.md 那張表）
//   node drafts/lineart-measure.mjs <圖檔> [<圖檔> …]
// 量：線佔畫面、筆畫寬中位／90 百分位、灰階數、實心填色、四角乾不乾淨。
import fs from "node:fs";
import path from "node:path";
const mod = await import("/opt/node22/lib/node_modules/playwright/index.js");
const { chromium } = mod.default ?? mod;
const chrome = "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell";
const browser = await chromium.launch({ executablePath: fs.existsSync(chrome) ? chrome : undefined });
const pg = await browser.newPage();

const files = process.argv.slice(2);
if (!files.length) { console.error("用法：node drafts/lineart-measure.mjs <圖檔> …"); process.exit(1); }

for (const f of files) {
  const ext = path.extname(f).slice(1).toLowerCase();
  const mime = ext === "png" ? "image/png" : "image/jpeg";
  const uri = `data:${mime};base64,${fs.readFileSync(f).toString("base64")}`;
  const r = await pg.evaluate(async (uri) => {
    const img = new Image(); img.src = uri; await img.decode();
    const W = img.naturalWidth, H = img.naturalHeight;
    const c = document.createElement("canvas"); c.width = W; c.height = H;
    const g = c.getContext("2d", { willReadFrequently: true });
    g.fillStyle = "#fff"; g.fillRect(0, 0, W, H);   // 透明底當白底
    g.drawImage(img, 0, 0);
    const d = g.getImageData(0, 0, W, H).data;
    const L = new Float32Array(W * H);
    for (let i = 0, p = 0; p < W * H; p++, i += 4) L[p] = 0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2];

    // 底色 ＝ 眾數（16 階一桶）
    const hist = new Int32Array(256);
    for (let p = 0; p < W * H; p++) hist[Math.round(L[p])]++;
    let bg = 0; for (let v = 0; v < 256; v++) if (hist[v] > hist[bg]) bg = v;
    const T = bg - (bg - 0) * 0.35;               // 底色與純黑之間 35% 處當門檻
    const ink = new Uint8Array(W * H);
    let inkN = 0;
    for (let p = 0; p < W * H; p++) if (L[p] < T) { ink[p] = 1; inkN++; }

    // 筆畫寬：橫向與縱向的連續墨長，取兩者中較小的那一個（避免沿線方向量成很長）
    const runs = [];
    const scan = (get, n, m) => {
      const out = new Int32Array(W * H);
      for (let a = 0; a < n; a++) {
        let s = -1;
        for (let b = 0; b <= m; b++) {
          const on = b < m && ink[get(a, b)];
          if (on && s < 0) s = b;
          else if (!on && s >= 0) { for (let k = s; k < b; k++) out[get(a, k)] = b - s; s = -1; }
        }
      }
      return out;
    };
    const hr = scan((y, x) => y * W + x, H, W);
    const vr = scan((x, y) => y * W + x, W, H);
    for (let p = 0; p < W * H; p++) if (ink[p]) runs.push(Math.min(hr[p], vr[p]));
    runs.sort((a, b) => a - b);
    const q = (t) => runs.length ? runs[Math.floor(runs.length * t)] : 0;
    const med = q(0.5), p90 = q(0.9);

    // 灰階：佔比 > 0.05% 的亮度階數（不含底色附近與極暗）
    let greys = 0;
    for (let v = 0; v < 256; v++) {
      if (Math.abs(v - bg) < 12 || v < 24) continue;
      if (hist[v] / (W * H) > 0.0005) greys++;
    }

    // 實心填色：連通的墨塊「填滿自己的外接矩形」多少
    // ⚠ 不能只看面積 —— 一整個人的輪廓也是一塊很大的連通區域，
    //    但它是空心的（填滿率很低）。填色才會逼近 1。
    const seen = new Uint8Array(W * H);
    let blobs = 0, worstFill = 0;
    const st = new Int32Array(W * H);
    for (let p0 = 0; p0 < W * H; p0++) {
      if (!ink[p0] || seen[p0]) continue;
      let sp = 0, area = 0; st[sp++] = p0; seen[p0] = 1;
      let x0 = W, x1 = 0, y0 = H, y1 = 0;
      while (sp) {
        const p = st[--sp]; area++;
        const x = p % W, y = (p - x) / W;
        if (x < x0) x0 = x; if (x > x1) x1 = x;
        if (y < y0) y0 = y; if (y > y1) y1 = y;
        if (x > 0 && ink[p - 1] && !seen[p - 1]) { seen[p - 1] = 1; st[sp++] = p - 1; }
        if (x < W - 1 && ink[p + 1] && !seen[p + 1]) { seen[p + 1] = 1; st[sp++] = p + 1; }
        if (y > 0 && ink[p - W] && !seen[p - W]) { seen[p - W] = 1; st[sp++] = p - W; }
        if (y < H - 1 && ink[p + W] && !seen[p + W]) { seen[p + W] = 1; st[sp++] = p + W; }
      }
      if (area < W * H * 0.002) continue;                       // 太小的不算
      const fill = area / ((x1 - x0 + 1) * (y1 - y0 + 1));
      if (fill > 0.5) blobs++;                                  // 填滿一半以上 ＝ 實心色塊
      if (fill > worstFill) worstFill = fill;
    }

    // 四角各 10% 的方塊裡有沒有墨
    const cw = Math.round(W * 0.1), ch = Math.round(H * 0.1);
    const corner = (x0, y0) => { let n = 0; for (let y = y0; y < y0 + ch; y++) for (let x = x0; x < x0 + cw; x++) if (ink[y * W + x]) n++; return n; };
    const corners = [corner(0, 0), corner(W - cw, 0), corner(0, H - ch), corner(W - cw, H - ch)];

    return {
      W, H, bg,
      inkPct: +(100 * inkN / (W * H)).toFixed(2),
      strokeMed: med, strokeP90: p90,
      strokePermil: +(1000 * med / W).toFixed(1),
      ratio: +(p90 / Math.max(med, 1)).toFixed(2),
      greys, blobs, worstFill: +worstFill.toFixed(2),
      corners,
    };
  }, uri);
  console.log(path.basename(f), JSON.stringify(r));
}
await browser.close();

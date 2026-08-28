/* LINE Flex Message 的預覽產生器（2026-08-27）
 *
 * ⚠⚠ **這是模擬，不是 LINE 自己的算繪結果。** 真正的樣子只有 LINE 會畫。
 *   但它是**從 clinic-info-flex.json 讀出來畫的**，不是另外用 CSS 重寫一份 ——
 *   理由同 CLAUDE.md 第八節那條「提案頁要擺真的產出檔」：手寫一份對照版，
 *   哪天 JSON 改了，這一頁就會開始說謊。
 *
 * 尺寸依 LINE Flex 的公開規格近似：
 *   bubble  nano 120 / micro 160 / kilo 260 / mega 300 / giga 386 px
 *   字級    xxs 11 / xs 13 / sm 14 / md 16 / lg 19 / xl 22 / xxl 27
 *   間距    none 0 / xs 2 / sm 4 / md 8 / lg 12 / xl 16 / xxl 20
 *   按鈕高  sm 40 / md 52
 * ⚠ 原生 button 的圓角由 LINE 決定，這裡畫 6px 近似；
 *   自己用 box 做的那顆外框鈕，cornerRadius 是我們指定的，會照著畫。
 *
 * 用法：node drafts/line-oa/flex-preview.mjs  →  drafts/line-oa/preview.png
 * ⚠ 一定要用 headless_shell，不要用完整版 chrome（CLAUDE.md 第九節第 18 條：
 *   完整版畫出來的高度比 --window-size 少 87px，而且不報錯）。
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "../..");

const W = { nano: 120, micro: 160, kilo: 260, mega: 300, giga: 386 };
const FS = { xxs: 11, xs: 13, sm: 14, md: 16, lg: 19, xl: 22, xxl: 27, "3xl": 29 };
const SP = { none: 0, xs: 2, sm: 4, md: 8, lg: 12, xl: 16, xxl: 20 };
const px = (v, tbl) => (v == null ? null : /px$/.test(v) ? parseFloat(v) : (tbl?.[v] ?? null));
const esc = (s) => String(s).replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));

function pad(n) {
  const s = [];
  const all = px(n.paddingAll, SP);
  if (all != null) s.push(`padding:${all}px`);
  for (const [k, css] of [["paddingTop", "padding-top"], ["paddingBottom", "padding-bottom"],
                          ["paddingStart", "padding-left"], ["paddingEnd", "padding-right"]]) {
    const v = px(n[k], SP); if (v != null) s.push(`${css}:${v}px`);
  }
  return s;
}

/* first ＝ 是不是同一個 box 裡的第一個孩子（margin 對第一個孩子不生效） */
function render(n, dir = "vertical", first = false) {
  const m = px(n.margin, SP);
  const mg = m != null && !first ? (dir === "vertical" ? `margin-top:${m}px` : `margin-left:${m}px`) : "";

  if (n.type === "text") {
    const st = [
      `font-size:${FS[n.size || "md"]}px`,
      `color:${n.color || "#000000"}`,
      `font-weight:${n.weight === "bold" ? 700 : 400}`,
      `line-height:1.45`,
      n.align ? `text-align:${n.align}` : "",
      "min-width:0",
      n.wrap ? "white-space:normal;overflow-wrap:anywhere" : "white-space:nowrap;overflow:hidden;text-overflow:ellipsis",
      n.flex === 0 ? "flex:0 0 auto" : (n.flex != null ? `flex:${n.flex} 1 0` : "flex:1 1 auto"),
      mg,
    ].filter(Boolean).join(";");
    return `<div style="${st}">${esc(n.text ?? "")}</div>`;
  }

  if (n.type === "separator") {
    return `<div style="height:1px;background:${n.color || "#E0E0E0"};${mg};flex:0 0 auto"></div>`;
  }

  if (n.type === "image") {
    const [aw, ah] = (n.aspectRatio || "1:1").split(":").map(Number);
    const src = n.url.replace("https://fangren.net/", ROOT + "/");
    return `<div style="width:100%;aspect-ratio:${aw}/${ah};overflow:hidden;${mg}">
      <img src="file://${src}" style="width:100%;height:100%;object-fit:${n.aspectMode === "fit" ? "contain" : "cover"};display:block"></div>`;
  }

  if (n.type === "button") {
    const h = n.height === "sm" ? 40 : 52;
    const primary = n.style === "primary";
    const bg = primary ? (n.color || "#17C950") : "transparent";
    const fg = primary ? "#FFFFFF" : (n.color || "#42659A");
    return `<div style="flex:1 1 0;${mg}"><div style="height:${h}px;border-radius:6px;background:${bg};
      color:${fg};display:flex;align-items:center;justify-content:center;font-size:${FS.md}px;
      font-weight:700">${esc(n.action?.label ?? "")}</div></div>`;
  }

  if (n.type === "box") {
    const horiz = n.layout === "horizontal" || n.layout === "baseline";
    const gap = px(n.spacing, SP) ?? 0;
    const st = [
      "display:flex",
      `flex-direction:${horiz ? "row" : "column"}`,
      n.layout === "baseline" ? "align-items:baseline" : "",
      gap ? `gap:${gap}px` : "",
      n.backgroundColor ? `background:${n.backgroundColor}` : "",
      n.borderColor ? `border:${px(n.borderWidth) || 1}px solid ${n.borderColor}` : "",
      n.cornerRadius ? `border-radius:${px(n.cornerRadius, SP)}px` : "",
      n.flex === 0 ? "flex:0 0 auto" : (horiz ? "flex:1 1 0;min-width:0" : "flex:0 0 auto"),
      "box-sizing:border-box;max-width:100%",
      ...pad(n),
      mg,
    ].filter(Boolean).join(";");
    const kids = (n.contents || []).map((c, i) => render(c, n.layout, i === 0)).join("");
    return `<div style="${st}">${kids}</div>`;
  }
  throw new Error("這支預覽器還沒支援的節點：" + n.type);
}

/* ⚠⚠ carousel 裡**每一格的高度會被 LINE 拉齊成最高的那一格**，短的那幾格
   body 底下會空出一塊。這裡照著做（body 那一段 flex:1，底色跟著它自己的
   backgroundColor），不然預覽會比實際好看 —— 短卡看起來剛剛好，上線才發現有洞。 */
export function bubbleHtml(b) {
  const w = W[b.size || "mega"];
  const parts = ["header", "hero", "body", "footer"].filter((k) => b[k]).map((k) => {
    const inner = render(b[k], "vertical", true);
    if (k !== "body") return inner;
    const bg = b[k].backgroundColor || "#FFFFFF";
    return `<div style="flex:1 1 auto;display:flex;flex-direction:column;background:${bg}">${inner}</div>`;
  }).join("");
  return `<div style="width:${w}px;flex:0 0 ${w}px;box-sizing:border-box;border-radius:12px;overflow:hidden;
    background:#FFFFFF;display:flex;flex-direction:column;
    box-shadow:0 1px 3px rgba(0,0,0,.35)">${parts}</div>`;
}

/* ── 產生預覽頁 ── */
const load = (f) => JSON.parse(fs.readFileSync(path.join(HERE, f), "utf8"));
const arg = process.argv[2];

/* 兩種模式：
   ・不給參數 → 診所資訊那張卡的兩版並排
   ・給一個 JSON → 畫那一份；carousel 就把每一格攤成格狀（一列四格）
     ⚠ 真的在 LINE 上是**橫著滑**的，攤成格狀只是為了在一張圖裡看完七科。
       所有格子的高度在 LINE 上會被拉齊成最高的那一格，這裡也照做（align-items: stretch）。 */
let cards, cols, dpr, gap;
if (!arg) {
  cards = [["建議版・帶圖", load("clinic-info-flex.json")],
           ["建議版・無圖", load("clinic-info-flex-noimage.json")]]
          .filter(([, b]) => b);
  cols = 2; dpr = 3; gap = 36;
} else {
  const doc = load(arg);
  if (doc.type === "carousel") {
    cards = doc.contents.map((b, i) => [`${i + 1}／${doc.contents.length}　${b.footer?.contents?.[0]?.action?.label ?? ""}`, b]);
    cols = 4; dpr = 2; gap = 24;
  } else {
    cards = [["", doc]]; cols = 1; dpr = 3; gap = 28;
  }
}

const html = `<!doctype html><meta charset="utf-8">
<style>
  html,body{margin:0;background:#000000;
    font-family:"Noto Sans TC","PingFang TC","Microsoft JhengHei",system-ui,sans-serif}
  /* ⚠ carousel 的每一格在 LINE 上會齊高（不只同一列，是整組齊高），
     所以攤成格狀時要 grid-auto-rows:1fr，不然第二列會比實際矮。 */
  .row{display:inline-grid;grid-template-columns:repeat(${cols}, max-content);
    gap:${gap}px;padding:28px;align-items:stretch${cols > 2 ? ";grid-auto-rows:1fr" : ""}}
  .col{display:flex;flex-direction:column;gap:10px}
  .cap{color:#8e8e8e;font-size:13px;letter-spacing:.04em}
  .bub{display:flex;gap:8px;align-items:stretch;flex:1 1 auto}
  .ava{width:34px;height:34px;border-radius:50%;background:#3f654a;flex:0 0 auto;
    display:flex;align-items:center;justify-content:center;color:#fff;font-size:9px;line-height:1.1;text-align:center}
</style>
<div class="row">
${cards.map(([label, b]) => `
  <div class="col">
    <div class="cap">${esc(label)}</div>
    <div class="bub"><div class="ava">芳仁<br>牙醫</div>${bubbleHtml(b)}</div>
  </div>`).join("")}
</div>`;

const outHtml = path.join(HERE, ".preview.html");
fs.writeFileSync(outHtml, html);

/* ⚠ playwright 是 CommonJS：ESM 要整包 default import 再解構，
   具名匯入會拿到 undefined（CLAUDE.md 第九節第 11 條）。 */
const pw = (await import("/opt/node22/lib/node_modules/playwright/index.js")).default;
const { chromium } = pw;
const CANDIDATES = [
  "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell",
  "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/chrome",
];
const exe = CANDIDATES.find((p) => fs.existsSync(p));
if (!exe) throw new Error("找不到 headless_shell —— 不要退回完整版 chrome，它會把圖下緣切掉 87px");

const browser = await chromium.launch({ executablePath: exe });
const page = await browser.newPage({ deviceScaleFactor: dpr });
await page.setViewportSize({ width: 4000, height: 1200 });
await page.goto("file://" + outHtml);
await page.waitForLoadState("networkidle");
const box = await page.locator(".row").boundingBox();
await page.setViewportSize({ width: Math.ceil(box.width), height: Math.ceil(box.height) });
/* 圖存在 JSON 旁邊（給了子資料夾就存進那個子資料夾），
   不給參數時仍然是 drafts/line-oa/preview.png。 */
const name = arg ? "preview-" + path.basename(arg, ".json") + ".png" : "preview.png";
const out = path.join(HERE, arg ? path.dirname(arg) : ".", name);
await page.screenshot({ path: out });
await browser.close();
fs.unlinkSync(outHtml);
console.log(`預覽：${path.relative(ROOT, out)}　${Math.ceil(box.width)}×${Math.ceil(box.height)} CSS px（DPR ${dpr}）`);

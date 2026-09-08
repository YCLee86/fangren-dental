/* LINE 商家貼文的第三張 —— **給外縣市／鄰近鄉鎮看的路線圖**
 *   node drafts/channels/post-map-far.mjs   → preview/line-post-map/far-*.png
 *
 * 2026-09-08 使用者：「製作另一個不一樣 scale 的地圖　目的是給周圍鄉鎮或外縣市的參考
 *   …圓環　車站　太細節的巷弄不需要標　因為外地人來不是認巷弄　可能要標示鐵路 國道 省道
 *   …公家機關例如斗六派出所 中華電信斗六服務中心 元大銀行斗信分行 斗六高中 斗六家商
 *   雲林縣政府　應該可以考慮標上去」
 *
 * ⚠⚠⚠ **第一版被退回：「這個圖的品質慘不忍睹」——他是對的，而且量得出來。**
 *   那一版有墨的像素只有 **6.0%**，同一頁的停車圖是 **29.0%**（差五倍）。
 *   成因不是配色也不是字級，是**畫法反了**：
 *     ・站上那張地圖（index.html）的畫法是「**底色鋪的是路**，街廓一塊一塊畫上去」
 *       （那一段註解就寫著 2026-08-14 第九輪整個反過來），所以它有面、有圖底關係。
 *     ・我第一版是「白底 ＋ 幾條線」＝ 接線圖，畫面 79% 是空的。
 *   → 這一版照站上的畫法重做：`--map-road` 鋪底、`--map-bg` 的街廓疊上去。
 *
 * ⚠⚠⚠ **尺度也跟著換掉了。** 第一版畫 13 公里、再在角落開一個「市區放大」的小圖 ——
 *   那個小圖是為了「地標塞不下」硬生出來的，它蓋掉主圖、還把台３線切斷。
 *   量出來他列的八個地標裡**只有車站是廣域尺度的**（斗六高中在小格上離診所只有 10.9px），
 *   而他要的是「**從連外道路到診所**的參考地標」＝ 市區的尺度。
 *   → 這一版就畫**市區 2.6 公里**，四條連外道路收成**框邊的箭頭**（往哪個交流道、幾公里）。
 *   **一張圖一個尺度，不要在角落塞第二個。**
 *
 * ⚠ 地理資料兩份，腳本裡一個座標都沒有：
 *     drafts/channels/far-city.json   市區街道格網（描自使用者第二張截圖）
 *     drafts/channels/far-map.json    廣域那一份（第一版留下來的，現在只用到 places 的名字）
 * ⚠⚠⚠ 六個公家機關**還沒有座標**（圓環／派出所／中華電信／元大／家商／縣政府）——
 *   它們一個都不在那兩張截圖上，容器又連不出去（403）。`place()` 遇到 null 直接 throw，
 *   **寧可畫不出來，也不要憑印象擺**：一個擺錯位置的地標會讓外地人轉錯彎。
 *
 * ⚠ 顏色一個都沒有新增（PALETTE.md ＋ index.html 那張地圖已經在用的那五支）。
 * ⚠ 一律 headless_shell（第九節第 18 條）。容器裡沒有 Noto Sans TC，中文落到 WenQuanYi Zen Hei。
 */
import fs from "node:fs";
import zlib from "node:zlib";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const OUT  = path.join(ROOT, "preview", "line-post-map");
const SRC  = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
const CITY = JSON.parse(fs.readFileSync(path.join(ROOT, "drafts", "channels", "far-city.json"), "utf8"));

/* ---------- 顏色：全部從 index.html 那張地圖的變數讀回來，不重打 ---------- */
const cssVar = (n, fallback) => {
  const m = SRC.match(new RegExp(`--${n}:\\s*([^;]+);`));
  return m ? m[1].trim() : fallback;
};
const PAPER = "#e2e5e6", CARD = "#f4f4f5", RULE = "#cdd0d2";
const INK = "#2a2c27", SOFT = "#5c5f57";
const MAP_BG = CARD;      /* 街廓 ＝ --map-bg */
const MAP_ROAD = RULE;    /* 路面 ＝ --map-road */
const MAP_INK = SOFT;     /* 街名 ＝ --map-ink */
const GREEN = cssVar("map-mark", "#3f654a");   /* 診所 */
const BLUE  = cssVar("map-park", "#365685");   /* 路牌藍 ＝ 交流道與國道 */
if (GREEN !== "#3f654a" || BLUE !== "#365685")
  throw new Error(`index.html 的地圖色變了：${GREEN} / ${BLUE}`);

/* ---------- 地址與電話：從 index.html 讀，不重打 ---------- */
const ADDR = (SRC.match(/<span class="txt">(雲林縣[^<]+)<\/span>/) || [])[1].replace(/&nbsp;/g, " ");
const PHONE = (SRC.match(/05-\d{7}/) || [])[0];
if (!ADDR || !PHONE) throw new Error("index.html 裡讀不到地址或電話");
/* 兩顆圖示：**站上頁尾那一對**（實心的釘子與話筒，Font Awesome Free 6，
   圖示部分授權 CC BY 4.0，https://fontawesome.com/license/free —— 這一行註解就是署名）。
   ⚠ 幾何與比例都從 index.html 讀回來，不抄第二份（同 post-map.mjs）。 */
const ico = (cls, vb) => {
  const re = new RegExp(`<p class="${cls}"[\\s\\S]*?<svg viewBox="0 0 ${vb}"[^>]*>(<path[^>]*\\/>)<\\/svg>`);
  const m = SRC.match(re);
  if (!m) throw new Error(`index.html 裡找不到 .${cls} 那顆圖示`);
  return m[1];
};
const PIN = ico("foot-addr", "384 512"), TEL = ico("foot-tel", "512 512");
const remOf = (sel, prop) => {
  const m = SRC.match(new RegExp(`${sel}\\s*\\{[^}]*${prop}:\\s*([\\d.]+)rem`));
  if (!m) throw new Error(`index.html 裡讀不到 ${sel} 的 ${prop}`);
  return +m[1];
};
const FOOT_FS = remOf("\\.foot-addr", "font-size");
const PIN_H = remOf("\\.foot-addr \\.ico svg", "height") / FOOT_FS;
const TEL_H = remOf("\\.foot-tel  \\.ico svg", "height") / FOOT_FS;

/* ---------- 畫布 ---------- */
const W = 1080, H = 1080, PAD = 40;
const BIG_W = 823, BIG_H = 409, SMALL = 410;
const BAND = Math.round(W * (BIG_H / BIG_W));
const K_SMALL = SMALL / W;                 /* 0.3796 */
const MIN = Math.ceil(10 / K_SMALL);       /* 27 —— 小格上要讀完的字的下限 */

const FINAL = null;                        /* 六個地標補進來之前不會有定稿檔 */
const FINAL_FILE = "fangren-route-1080.png";
const fileOf = (tag) => tag === FINAL ? FINAL_FILE : `far-${tag}.png`;

/* ---------- 地圖涵蓋的範圍（公尺，原點＝診所） ---------- */
/* ⚠⚠ 範圍**不是寫死的四個邊**，是「中心 ＋ 這一格要多寬」——
 *   畫布是方的、地圖框是橫的，寫死四個邊一定會有一邊留一大條空白（第一版就是這樣，
 *   上面空了三分之一）。做法：橫向由 `zoom`（畫面涵蓋幾公尺）決定比例尺，
 *   縱向**由地圖框自己的高度反推**，所以永遠滿版。
 * ⚠ 中心刻意不是診所：診所在東南邊，車站與斗六高中在西北邊，
 *   置中在兩者之間才不會讓半張圖是空的。 */
const CENTER = [-110, -90];
const place = (id) => {
  const p = CITY.places.find(q => q.id === id);
  if (!p) throw new Error(`far-city.json 裡沒有 ${id}`);
  if (!p.xy) throw new Error(`「${p.name}」還沒有座標（src: ${p.src}）——不要憑印象擺`);
  return p;
};
const HAVE = CITY.places.filter(p => p.xy && p.id !== "clinic");
const ASK  = CITY.places.filter(p => !p.xy);
/* ⚠⚠ 兩份地理資料各有一份「還沒有座標」的名單（市區那一份畫圖用、廣域那一份給距離表用），
   **兩份要一致** —— 只補其中一份的話，圖上會多一個地標，而規格頁那一段
   「其餘六個…」還在說它沒有位置（check-post-map.mjs 是拿廣域那一份去對頁面的）。 */
{
  const a = ASK.map(p => p.name).join("、");
  const b = JSON.parse(fs.readFileSync(path.join(ROOT, "drafts", "channels", "far-map.json"), "utf8"))
    .places.filter(p => !p.xy).map(p => p.name).join("、");
  if (a !== b) throw new Error(`兩份資料「還沒有座標」的名單對不上，要一起補：\n`
    + `  far-city.json  ${a}\n  far-map.json   ${b}`);
}

/* ---------- 畫地圖 ----------
 * ⚠⚠ 畫的順序就是站上那張地圖的順序（index.html 的長註解）：
 *   ① 整塊鋪成**路面**　② 街廓一塊一塊蓋上去（圓角 rx，街廓沒有自己的形狀）
 *   ③ 斜的路與鐵路疊在街廓上　④ 街名　⑤ 地標　⑥ 框邊的連外道路
 * ⚠ 街廓的兩端要**溢出畫面一點**，不然圓角會在邊緣露出一小塊底色（站上那條註解寫過）。 */
const mapSvg = ({ vbw, vbh, fs2, zoom = 1300, marks = "name", grid = true, edges = true }) => {
  const k = vbw / zoom;                              /* 公尺 → SVG 單位（等比例，不拉伸） */
  const EXT = { x0: CENTER[0] - zoom / 2, x1: CENTER[0] + zoom / 2,
                y0: CENTER[1] - vbh / k / 2, y1: CENTER[1] + vbh / k / 2 };
  const PX = (x) => (x - EXT.x0) * k;
  const PY = (y) => vbh - (y - EXT.y0) * k;
  const P = ([x, y]) => [PX(x), PY(y)];
  const S = (m) => m * k;                            /* 公尺 → SVG 單位 */

  /* --- 街廓：由相鄰兩條街的「內緣」算出來 --- */
  const ew = CITY.ew.filter(r => !r.slope).slice().sort((a, b) => b.y - a.y);   /* 北→南 */
  const ns = CITY.ns.slice().sort((a, b) => a.x - b.x);                          /* 西→東 */
  const OVER = 40;                                   /* 往框外多留 */
  const ybands = [];
  for (let i = 0; i <= ew.length; i++) {
    const top = i === 0 ? PY(EXT.y1) - OVER : PY(ew[i - 1].y) + S(ew[i - 1].w) / 2;
    const bot = i === ew.length ? PY(EXT.y0) + OVER : PY(ew[i].y) - S(ew[i].w) / 2;
    if (bot - top > 2) ybands.push([top, bot]);
  }
  const xbands = [];
  for (let i = 0; i <= ns.length; i++) {
    const l = i === 0 ? PX(EXT.x0) - OVER : PX(ns[i - 1].x) + S(ns[i - 1].w) / 2;
    const r = i === ns.length ? PX(EXT.x1) + OVER : PX(ns[i].x) - S(ns[i].w) / 2;
    if (r - l > 2) xbands.push([l, r]);
  }
  const blocks = grid ? ybands.flatMap(([t, b]) => xbands.map(([l, r]) =>
    `<rect x="${l.toFixed(1)}" y="${t.toFixed(1)}" width="${(r - l).toFixed(1)}"`
    + ` height="${(b - t).toFixed(1)}" rx="4"/>`)).join("") : "";

  /* --- 斜的路（民生路）與鐵路：疊在街廓上，用路面色畫回去 --- */
  const diag = CITY.ew.filter(r => r.slope).map(r => {
    const a = P([r.x0, r.y + (r.x0 - 0) * r.slope]), b = P([r.x1, r.y + (r.x1 - 0) * r.slope]);
    return `<path d="M${a[0].toFixed(1)} ${a[1].toFixed(1)}L${b[0].toFixed(1)} ${b[1].toFixed(1)}"`
      + ` stroke="${MAP_ROAD}" stroke-width="${S(r.w).toFixed(1)}" stroke-linecap="round" fill="none"/>`;
  }).join("");

  /* 鐵路：北偏東 53 度通過斗六車站（方位另外用真實經緯度驗過，見 far-map.json） */
  const st = place("station").xy, dir = [Math.sin(53 * Math.PI / 180), Math.cos(53 * Math.PI / 180)];
  const ra = P([st[0] - dir[0] * 3000, st[1] - dir[1] * 3000]);
  const rb = P([st[0] + dir[0] * 3000, st[1] + dir[1] * 3000]);
  const railW = Math.max(3.4, S(14));
  const ticks = (() => {
    const L = Math.hypot(rb[0] - ra[0], rb[1] - ra[1]), ux = (rb[0] - ra[0]) / L, uy = (rb[1] - ra[1]) / L;
    let d2 = "";
    for (let d = 0; d < L; d += railW * 1.15) {
      const cx = ra[0] + ux * d, cy = ra[1] + uy * d, h2 = railW * .62;
      d2 += `M${(cx - uy * h2).toFixed(1)} ${(cy + ux * h2).toFixed(1)}`
          + `L${(cx + uy * h2).toFixed(1)} ${(cy - ux * h2).toFixed(1)}`;
    }
    return d2;
  })();
  const rail = `<path d="M${ra[0].toFixed(1)} ${ra[1].toFixed(1)}L${rb[0].toFixed(1)} ${rb[1].toFixed(1)}"`
    + ` stroke="${MAP_BG}" stroke-width="${(railW * 1.9).toFixed(1)}" fill="none"/>`
    + `<path d="M${ra[0].toFixed(1)} ${ra[1].toFixed(1)}L${rb[0].toFixed(1)} ${rb[1].toFixed(1)}"`
    + ` stroke="${MAP_INK}" stroke-width="${(railW * .34).toFixed(1)}" fill="none"/>`
    + `<path d="${ticks}" stroke="${MAP_INK}" stroke-width="${(railW * .26).toFixed(1)}" fill="none"/>`;

  /* --- 標字：一律先卡位再畫，卡不下就不畫 ---
   * ⚠⚠⚠ 第一版的街名是「每一條算一個位置就畫下去」，結果底下五條擠成一團
   *   （永安路壓在內環路上）。地圖上的字重疊不會報錯、也不會溢出，
   *   **只有把圖打開看才看得到** —— 所以改成一個共用的佔位表：
   *   角落那四塊牌子 → 診所 → 地標 → 街名，後畫的躲前面畫過的，躲不掉就整條不標。
   * ⚠ 寬度是估的（中文一個字算一個字級、半形算 .55），估寬一點是安全的那一側。 */
  const wOf = (t, f) => [...t].reduce((a, c) => a + (c.codePointAt(0) < 0x2e80 ? .55 : 1), 0) * f;
  const taken = [];
  const hits = (b) => taken.some(t => !(b.x + b.w < t.x || t.x + t.w < b.x
                                     || b.y + b.h < t.y || t.y + t.h < b.y));
  const claim = (b) => { taken.push(b); return true; };
  const inFrame = (b) => b.x >= 2 && b.y >= 2 && b.x + b.w <= vbw - 2 && b.y + b.h <= vbh - 2;

  /* --- 四個角落的連外道路：一塊牌子，牌子裡一個箭頭指著真正的方向 ---
   * ⚠⚠ **國道與省道不畫進圖裡**：它們離診所 5~7 公里，畫進來這張圖就得是 13 公里，
   *   而市區那幾條街會擠成一團（第一版就是這樣，才被迫在角落開一個放大鏡）。
   *   收成「往哪個方向　幾公里」，資訊一個都沒少，尺度只剩一個。
   * ⚠⚠⚠ 牌子擺**四個角**、方向交給牌子裡那個箭頭 —— 第一版讓牌子跟著箭頭的落點走，
   *   字級一放大兩塊就疊在一起（守門抓到的）。角落是唯一「字再大也不會互相碰到」的排法，
   *   而四個角剛好對得上四個方向（縣道往北在上、國道３往東北在右上、
   *   台３往東南在右下、國道１往西南在左下）。
   * ⚠ 牌子的寬度是**估**的（中文一個字算一個字級、半形算 .55），
   *   下面有一道守門在量真實的 bbox，估錯會被擋下來。 */
  const DIR = { n: -Math.PI / 2, ne: -Math.PI / 4, e: Math.PI / 4, sw: Math.PI * .75 };
  const CORNER = { n: "tl", ne: "tr", e: "br", sw: "bl" };
  const eg = !edges ? "" : CITY.edges.map(e => {
    const a = DIR[e.at], corner = CORNER[e.at];
    const l1 = e.name, l2 = `${e.via}　${e.km} 公里`;
    const f1 = fs2 * .86, f2 = fs2 * .70;
    const pad = fs2 * .30, aw = fs2 * .92, gap2 = fs2 * .26;
    const tw = Math.max(wOf(l1, f1), wOf(l2, f2));
    const bw2 = pad * 2 + aw + gap2 + tw;
    const bh2 = pad * 2 + f1 * 1.22 + f2 * 1.24;
    const bx = corner[1] === "l" ? 8 : vbw - bw2 - 8;
    const by = corner[0] === "t" ? 8 : vbh - bh2 - 8;
    const ax = bx + pad + aw / 2, ay = by + bh2 / 2, ar = aw * .46;
    const tip = [ax + Math.cos(a) * ar, ay + Math.sin(a) * ar];
    const tail = [ax - Math.cos(a) * ar, ay - Math.sin(a) * ar];
    const head = `<path d="M${tip[0].toFixed(1)} ${tip[1].toFixed(1)}`
      + `L${(tip[0] - Math.cos(a - .45) * ar * .95).toFixed(1)} ${(tip[1] - Math.sin(a - .45) * ar * .95).toFixed(1)}`
      + `L${(tip[0] - Math.cos(a + .45) * ar * .95).toFixed(1)} ${(tip[1] - Math.sin(a + .45) * ar * .95).toFixed(1)}Z"`
      + ` fill="${BLUE}"/>`;
    const tx = bx + pad + aw + gap2;
    claim({ x: bx - 4, y: by - 4, w: bw2 + 8, h: bh2 + 8 });
    return `<rect class="pl" x="${bx.toFixed(1)}" y="${by.toFixed(1)}" width="${bw2.toFixed(1)}"`
      + ` height="${bh2.toFixed(1)}" rx="${(fs2 * .3).toFixed(1)}" fill="${MAP_BG}"`
      + ` stroke="${BLUE}" stroke-width="1.4"/>`
      + `<path d="M${tail[0].toFixed(1)} ${tail[1].toFixed(1)}L${tip[0].toFixed(1)} ${tip[1].toFixed(1)}"`
      + ` stroke="${BLUE}" stroke-width="${(fs2 * .12).toFixed(1)}" stroke-linecap="round"/>` + head
      + `<text class="eg" x="${tx.toFixed(1)}" y="${(by + pad + f1).toFixed(1)}"`
      + ` style="font-size:${f1.toFixed(1)}px">${l1}</text>`
      + `<text class="egk" x="${tx.toFixed(1)}" y="${(by + pad + f1 * 1.22 + f2).toFixed(1)}"`
      + ` style="font-size:${f2.toFixed(1)}px">${l2}</text>`;
  }).join("");


  /* --- 診所：綠塊 ＋ 白字（＝站上那張地圖的做法） --- */
  const [cx, cy] = P([0, 0]);
  const bw = wOf("芳仁牙醫", fs2) + fs2 * .9, bh = fs2 * 1.78;
  claim({ x: cx - bw / 2 - 6, y: cy - bh / 2 - 6, w: bw + 12, h: bh + 12 });
  const clinic = `<rect class="meb" x="${(cx - bw / 2).toFixed(1)}" y="${(cy - bh / 2).toFixed(1)}"`
    + ` width="${bw.toFixed(1)}" height="${bh.toFixed(1)}" rx="${(bh * .28).toFixed(1)}" fill="${GREEN}"/>`
    + `<text class="me" x="${cx.toFixed(1)}" y="${(cy + fs2 * .38).toFixed(1)}" text-anchor="middle">芳仁牙醫</text>`;

  /* --- 地標：一顆點 ＋ 名字。名字先試上面，撞到就換下／左／右 --- */
  const pf = fs2 * .95;
  const dots = marks === "none" ? "" : HAVE.map(p => {
    const [px, py] = P(p.xy);
    const sym = p.kind === "rail"
      ? `<rect x="${(px - 8).toFixed(1)}" y="${(py - 8).toFixed(1)}" width="16" height="16" rx="3" fill="${INK}"/>`
      : `<circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="6.5" fill="${INK}"/>`;
    claim({ x: px - 9, y: py - 9, w: 18, h: 18 });
    if (marks === "dot") return sym;
    const w = wOf(p.name, pf), h = pf * 1.15;
    const cand = [
      [px - w / 2, py - 14 - h, "start"],          /* 上 */
      [px - w / 2, py + 14, "start"],              /* 下 */
      [px + 14, py - h / 2, "start"],              /* 右 */
      [px - 14 - w, py - h / 2, "start"],          /* 左 */
    ];
    for (const [bx, by] of cand) {
      const box = { x: bx - 3, y: by - 3, w: w + 6, h: h + 6 };
      if (!inFrame(box) || hits(box)) continue;
      claim(box);
      return sym + `<text class="pn" x="${bx.toFixed(1)}" y="${(by + pf * .86).toFixed(1)}">${p.name}</text>`;
    }
    return sym;                                     /* 卡不下就只留點 */
  }).join("");

  /* --- 街名：橫的沿路排、直的轉 90 度（都不是斜的，斜的中文在 410px 上會糊） --- */
  const sf = fs2 * .78;
  const nm = [];
  for (const r of CITY.ew) {
    const y0 = (x) => r.slope ? r.y + x * r.slope : r.y;
    const w = wOf(r.name, sf), h = sf * 1.1;
    let done = false;
    for (const f of [.16, .38, .60, .80, .04]) {
      const x = Math.max(r.x0, EXT.x0) + (Math.min(r.x1, EXT.x1) - Math.max(r.x0, EXT.x0)) * f;
      const [px, py] = P([x, y0(x)]);
      const box = { x: px - 3, y: py - h - 3, w: w + 6, h: h + 6 };
      if (!inFrame(box) || hits(box)) continue;
      claim(box);
      nm.push(`<text class="sn" x="${px.toFixed(1)}" y="${(py - sf * .34).toFixed(1)}">${r.name}</text>`);
      done = true; break;
    }
    if (!done) nm.push("");
  }
  for (const r of CITY.ns) {
    const w = wOf(r.name, sf), h = sf * 1.1;
    for (const f of [.18, .42, .66, .86, .05]) {
      const y = Math.max(r.y0, EXT.y0) + (Math.min(r.y1, EXT.y1) - Math.max(r.y0, EXT.y0)) * f;
      const [px, py] = P([r.x, y]);
      /* 轉 90 度之後：字往上長 w、往右佔 h */
      const box = { x: px + 2, y: py - w - 3, w: h + 6, h: w + 6 };
      if (!inFrame(box) || hits(box)) continue;
      claim(box);
      nm.push(`<text class="sn" x="${(px + sf * .40).toFixed(1)}" y="${py.toFixed(1)}"`
        + ` transform="rotate(-90 ${(px + sf * .40).toFixed(1)} ${py.toFixed(1)})">${r.name}</text>`);
      break;
    }
  }

  /* ⚠ 四角導圓 ＝ 站上那張地圖的做法（clip-path），讓它讀起來是「一張地圖」
     而不是幾條線散在頁面上。 */
  return { svg: `<svg viewBox="0 0 ${vbw} ${vbh}" width="${vbw}" height="${vbh}" class="mp">`
    + `<defs><clipPath id="mclip"><rect width="${vbw}" height="${vbh}" rx="12"/></clipPath></defs>`
    + `<g clip-path="url(#mclip)">`
    + `<rect width="${vbw}" height="${vbh}" fill="${MAP_ROAD}"/>`
    + `<g fill="${MAP_BG}">${blocks}</g>${diag}${rail}${nm.join("")}${dots}${clinic}${eg}</g>`
    + `<rect x=".75" y=".75" width="${(vbw - 1.5).toFixed(1)}" height="${(vbh - 1.5).toFixed(1)}"`
    + ` rx="12" fill="none" stroke="${MAP_ROAD}" stroke-width="1.5"/></svg>`,
    k, ext: EXT };
};

/* ---------- 版面 ----------
 * 標題 → 地圖 → 頁尾（地址與電話），和同一頁另外兩張一致。
 * ⚠ 地圖是**內嵌的 SVG 不是 PNG**：這一張的地圖是我們自己畫的，不必像另外兩張那樣
 *   先去別的頁面截一塊回來，所以也沒有「角落帶到別的底色」那個坑。 */
const GAP = 18;
const css = (ts, fs2, mfs) => `
*{box-sizing:border-box;margin:0}
html,body{width:${W}px;height:${H}px}
body{background:${CARD};color:${INK};-webkit-font-smoothing:antialiased;
     font-family:"Noto Sans TC","WenQuanYi Zen Hei",sans-serif}
.sheet{width:${W}px;height:${H}px;display:flex;flex-direction:column;justify-content:center;
       overflow:hidden}
.band{padding:0 ${PAD}px}
.id{padding-bottom:14px}
.id b{font-size:${ts}px;font-weight:700;letter-spacing:.05em}
.rule{height:1px;background:${RULE}}
.map{padding:${GAP}px 0;display:flex;justify-content:center}
.map svg{display:block}
.tel{padding-top:14px;font-size:${fs2}px;color:${INK};letter-spacing:.02em;line-height:1.55}
.tel .ln{white-space:nowrap}
.tel .ic{display:inline-block;width:${(fs2 * 1.02).toFixed(1)}px;text-align:center}
.tel .ic svg{display:inline-block;overflow:visible;fill:currentColor;stroke:none}
/* 地圖裡的字：一律加一圈底色的描邊（paint-order），壓在街廓或路面上都讀得出來。
   ⚠ 站上那張地圖的 P 也是這個做法（同色描邊），不是新發明的。 */
.mp text{paint-order:stroke;stroke:${MAP_BG};stroke-width:${(mfs * .18).toFixed(1)}px;
         stroke-linejoin:round}
.mp .sn{font-size:${(mfs * .78).toFixed(1)}px;fill:${MAP_INK};letter-spacing:.02em}
.mp .pn{font-size:${(mfs * .95).toFixed(1)}px;fill:${INK};font-weight:700;letter-spacing:.02em}
.mp .me{font-size:${mfs.toFixed(1)}px;fill:${CARD};font-weight:700;letter-spacing:.04em;
        stroke:none}
.mp .eg{fill:${BLUE};font-weight:700;letter-spacing:.02em;stroke:none}
.mp .egk{fill:${SOFT};letter-spacing:.01em;stroke:none}
`;

const sheet = (title, fs2, svg) => `<div class="sheet"><div class="band">
  ${title ? `<div class="id"><b>${title}</b></div>\n  <div class="rule"></div>` : ""}
  <div class="map">${svg}</div>
  <div class="rule"></div>
  <div class="tel">
    <div class="ln"><span class="ic"><svg viewBox="0 0 384 512" style="width:${
      (fs2 * PIN_H * .75).toFixed(1)}px;height:${(fs2 * PIN_H).toFixed(1)}px;transform:translateY(var(--dy))">${
      PIN}</svg></span>${ADDR}</div>
    <div class="ln"><span class="ic"><svg viewBox="0 0 512 512" style="width:${
      (fs2 * TEL_H).toFixed(1)}px;height:${(fs2 * TEL_H).toFixed(1)}px;transform:translateY(var(--dy))">${
      TEL}</svg></span>${PHONE}</div>
  </div>
</div></div>`;

/* ---------- PNG 解碼（量「有墨的像素佔多少」）----------
 * ⚠⚠⚠ 這一支是為了第一版那個「品質慘不忍睹」寫的：那張圖只有 6.0% 的墨、
 *   同一頁的停車圖是 29.0%。**「壞掉檢查擋不住醜」（第九節第 28 條 ④）** ——
 *   所以現在每一張都印這個數字，讀起來空不空有一個量得到的東西可以比。
 * 容器裡沒有 PIL 也沒有 ImageMagick，自己解（Chromium 出的是 8-bit RGBA、非交錯）。 */
const inkOf = (buf) => {
  let p = 8, w = 0, h = 0, col = 0; const idat = [];
  while (p < buf.length) {
    const len = buf.readUInt32BE(p), type = buf.toString("ascii", p + 4, p + 8);
    if (type === "IHDR") { w = buf.readUInt32BE(p + 8); h = buf.readUInt32BE(p + 12); col = buf[p + 17]; }
    if (type === "IDAT") idat.push(buf.subarray(p + 8, p + 8 + len));
    p += 12 + len;
  }
  const ch = col === 6 ? 4 : col === 2 ? 3 : 1;
  const raw = zlib.inflateSync(Buffer.concat(idat));
  const stride = w * ch, out = Buffer.alloc(h * stride);
  let o = 0;
  for (let y = 0; y < h; y++) {
    const f = raw[y * (stride + 1)], line = raw.subarray(y * (stride + 1) + 1, (y + 1) * (stride + 1));
    for (let x = 0; x < stride; x++) {
      const a = x >= ch ? out[o + x - ch] : 0, b = y ? out[o - stride + x] : 0,
            c = (x >= ch && y) ? out[o - stride + x - ch] : 0;
      let v = line[x];
      if (f === 1) v += a; else if (f === 2) v += b; else if (f === 3) v += (a + b) >> 1;
      else if (f === 4) {
        const pp = a + b - c, pa = Math.abs(pp - a), pb = Math.abs(pp - b), pc = Math.abs(pp - c);
        v += (pa <= pb && pa <= pc) ? a : (pb <= pc ? b : c);
      }
      out[o + x] = v & 255;
    }
    o += stride;
  }
  const bg = [out[0], out[1], out[2]];
  let n = 0; const rows = new Array(h).fill(0);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const i = y * stride + x * ch;
    if (Math.abs(out[i] - bg[0]) + Math.abs(out[i + 1] - bg[1]) + Math.abs(out[i + 2] - bg[2]) >= 18) {
      n++; rows[y]++;
    }
  }
  return { ink: +(n / (w * h) * 100).toFixed(1),
           empty: rows.filter(v => v < w * 0.004).length, w, h };
};

/* ---------- 出圖 ---------- */
const chrome = (() => {
  const base = process.env.PLAYWRIGHT_BROWSERS_PATH || "/opt/pw-browsers";
  for (const d of fs.readdirSync(base)) {
    const p = path.join(base, d, "chrome-linux", "headless_shell");
    if (fs.existsSync(p)) return p;
  }
  throw new Error("找不到 headless_shell");
})();
const mod = await import("/opt/node22/lib/node_modules/playwright/index.js");
const { chromium } = mod.default ?? mod;
const browser = await chromium.launch({ executablePath: chrome });
const page = await browser.newPage({ viewport: { width: W, height: H } });
fs.mkdirSync(OUT, { recursive: true });
for (const f of fs.readdirSync(OUT).filter(f => f.startsWith("far-") && f.endsWith(".png")))
  fs.rmSync(path.join(OUT, f));

const TITLES = {
  t1: "從外地來　芳仁牙醫怎麼走",
  t2: "斗六市區　芳仁牙醫在這裡",
};

const made = [];
const build = async (tag, { title = TITLES.t1, ts = 46, fs2 = 32, mfs = 30,
                            zoom = 1300, edges = true, marks = "name", grid = true } = {}) => {
  /* 第一輪：地圖先給一個高度，量出「地圖以外的東西有多高」 */
  const probe = mapSvg({ vbw: 400, vbh: 300, fs2: mfs, zoom, edges, marks, grid });
  await page.setContent(`<!doctype html><meta charset="utf-8"><style>${css(ts, fs2, mfs)}</style>`
    + `<style>:root{--dy:0px}</style>` + sheet(title, fs2, probe.svg));
  const other = await page.evaluate(() => {
    const b = document.querySelector(".band").getBoundingClientRect();
    const m = document.querySelector(".map").getBoundingClientRect();
    return b.height - m.height;
  });
  /* 地圖填滿剩下的空間：**寬度一律頂到版心**，高度吃剩下的 —— 這張圖的
     長寬比是我們自己決定的（縱向範圍由框的高度反推），所以永遠滿版、不會留白 */
  const MAPW = W - 2 * PAD;
  const MAPH = Math.floor(H - 2 * PAD - other - 2 * GAP);
  const { svg, k, ext } = mapSvg({ vbw: MAPW, vbh: MAPH, fs2: mfs, zoom, edges, marks, grid });
  /* 圖示對號碼的字面中線要往下推多少 —— 現量，不寫死（第九節第 9 條） */
  const dy = await page.evaluate((fsz) => {
    const cx = document.createElement("canvas").getContext("2d");
    const S = 400;
    cx.font = `${S}px "Noto Sans TC","WenQuanYi Zen Hei",sans-serif`;
    const m = cx.measureText("05-5339369");
    return (m.actualBoundingBoxAscent - m.actualBoundingBoxDescent) / 2 / S * fsz;
  }, fs2);
  await page.setContent(`<!doctype html><meta charset="utf-8"><style>${css(ts, fs2, mfs)}</style>`
    + `<style>:root{--dy:${(-dy).toFixed(2)}px}</style>` + sheet(title, fs2, svg));

  /* ---------- 守門 ---------- */
  const m = await page.evaluate(() => {
    const band = document.querySelector(".band").getBoundingClientRect();
    /* ⚠⚠ 量溢出要**跳過 SVG 裡面的東西**：街廓是刻意往框外多留 40 個單位的
       （不然圓角會在邊緣露出一小塊底色），而 getBoundingClientRect 回的是幾何
       外框、不管它有沒有被 viewBox 裁掉 —— 照數會報出三個假的溢出。
       SVG 自己那個 <svg> 元素仍然在量測範圍內。 */
    const over = [...document.querySelectorAll(".sheet *")].filter(el => {
      if (el.closest("svg.mp") && el !== document.querySelector("svg.mp")) return false;
      const r = el.getBoundingClientRect();
      return r.width && (r.right > 1080.5 || r.left < -.5);
    }).length;
    const svg = document.querySelector("svg.mp");
    /* ⚠⚠⚠ 地圖上的字掉出 viewBox 會**被裁掉而且不報錯**（症狀是「某一條路名不見了」，
       每一個尺寸都對）——所以每一個 text 的外框都量一次。 */
    /* ⚠⚠ 要量**畫出來的**外框不是 getBBox：直的街名是 rotate(-90) 轉過去的，
       getBBox 回的是「轉之前」的座標，拿它去對 viewBox 會誤報一整排。 */
    const sr = svg.getBoundingClientRect();
    const clipped = [...svg.querySelectorAll("text")].map(t => {
      const b = t.getBoundingClientRect();
      return (b.left < sr.left - .5 || b.top < sr.top - .5
              || b.right > sr.right + .5 || b.bottom > sr.bottom + .5) ? t.textContent : null;
    }).filter(Boolean);
    /* 四塊牌子彼此不可以疊，也不可以壓到診所那塊綠的 */
    const boxes = [...svg.querySelectorAll("rect.pl"), svg.querySelector("rect.meb")]
      .filter(Boolean).map(r => r.getBBox());
    let hit = 0;
    for (let i = 0; i < boxes.length; i++) for (let j = i + 1; j < boxes.length; j++) {
      const a = boxes[i], b = boxes[j];
      if (!(a.x + a.width < b.x || b.x + b.width < a.x
         || a.y + a.height < b.y || b.y + b.height < a.y)) hit++;
    }
    const lns = [...document.querySelectorAll(".tel .ln")];
    return { band: { y: band.y, h: band.height }, over, clipped, hit,
             mapH: document.querySelector(".map svg").getBoundingClientRect().height,
             left: lns.map(l => +l.getBoundingClientRect().left.toFixed(1)),
             lineH: lns.map(l => +l.getBoundingClientRect().height.toFixed(1)) };
  });
  if (m.over) throw new Error(`${tag}：有 ${m.over} 個元素溢出`);
  if (m.clipped.length) throw new Error(`${tag}：地圖上有 ${m.clipped.length} 個字掉出 viewBox 被裁掉：`
    + m.clipped.join("／"));
  if (m.hit) throw new Error(`${tag}：連外道路那幾塊牌子（含診所那塊綠的）有 ${m.hit} 對疊在一起`);
  if (new Set(m.left).size !== 1) throw new Error(`${tag}：頁尾兩行的左緣不齊 ${m.left}`);
  if (m.band.y < PAD - .5 || m.band.y + m.band.h > H - PAD + .5)
    throw new Error(`${tag}：內容 ${m.band.y.toFixed(0)}~${(m.band.y + m.band.h).toFixed(0)}，超出留白 ${PAD}`);
  /* ⚠⚠ 不是壞掉檢查，是「讀起來對不對」：這張是給**小格**的（整張縮到 410px），
     標題與頁尾是那個尺寸下唯一要讀完的整段文字，小於 10px 就等於沒寫。 */
  for (const [nm2, v] of [...(title ? [["標題", ts]] : []), ["頁尾", fs2]])
    if (v * K_SMALL < 10) throw new Error(`${tag}：${nm2}在小格上只有 ${(v * K_SMALL).toFixed(1)}px，讀不出來`);

  const file = fileOf(tag);
  const buf = await page.screenshot({ path: path.join(OUT, file) });
  const q = inkOf(buf);
  made.push({ tag, file, m, k, ext, ts, fs2, mfs, zoom, edges, title, q,
              mapW: MAPW, mapH: MAPH });
  return made[made.length - 1];
};

/* 一把尺：範圍／字級／標題（第九節第 28 條 ①：他的眼睛才是裁判，給一把尺不要送一個值） */
const CASES = [
  ["mid",     {}],                                   /* ⭐ 建議 1300 公尺 */
  ["wide",    { zoom: 1800 }],                       /* 範圍大一階 */
  ["wider",   { zoom: 2600 }],                       /* 再大一階（第一版那個尺度） */
  ["close",   { zoom: 1000 }],                       /* 範圍小一階（街名最大） */
  ["big",     { ts: 54, fs2: 38, mfs: 34 }],         /* 字大一階 */
  ["small",   { ts: 40, fs2: 28, mfs: 26 }],         /* 字小一階（地圖最大） */
  ["notitle", { title: "" }],                        /* 沒有標題 */
  ["t2",      { title: TITLES.t2 }],                 /* 標題換一句 */
  ["noedge",  { edges: false }],                     /* 不畫連外道路（純市區，看代價） */
];
for (const [tag, opt] of CASES) await build(tag, opt);

/* ========== 主頁三格 ＋ 410px 實際大小 ========== */
const b64 = (f) => "data:image/png;base64," + fs.readFileSync(path.join(OUT, f)).toString("base64");
const HOURS = path.join(ROOT, "preview", "line-post-hours", "fangren-hours-1080.png");
const DOOR = path.join(OUT, "door-c.png");
if (!fs.existsSync(HOURS)) throw new Error("找不到看診時間那張圖，先跑 node drafts/channels/post-hours.mjs");
if (!fs.existsSync(DOOR)) throw new Error("找不到停車那張圖，先跑 node drafts/channels/post-map-door.mjs");
const cell = (uri, w, h) => `<div style="width:${w}px;height:${h}px;overflow:hidden;background:${RULE}">`
  + (uri ? `<img src="${uri}" style="width:100%;height:100%;object-fit:cover;display:block">` : "")
  + `</div>`;
/* ⚠⚠ 三格已經滿了（大格＝看診時間、小格左＝停車、小格右＝七科）——
   這一張要放進去就得擠掉一個，那是使用者的決定。這張模擬圖畫的是
   「擠掉小格右」那一種，因為那一格的七張分享圖是 1.91:1、還得重裁成方的。 */
const p2 = await browser.newPage({ viewport: { width: BIG_W, height: BIG_H + 4 + SMALL } });
await p2.setContent(`<!doctype html><meta charset="utf-8"><style>*{margin:0}</style>
  <div style="width:${BIG_W}px;background:#fff;display:flex;flex-direction:column;gap:4px">
    ${cell("data:image/png;base64," + fs.readFileSync(HOURS).toString("base64"), BIG_W, BIG_H)}
    <div style="display:flex;gap:3px">${cell(b64("door-c.png"), SMALL, SMALL)}${
      cell(b64(fileOf("mid")), SMALL, SMALL)}</div>
  </div>`);
await p2.waitForFunction(() => [...document.images].every(i => i.complete && i.naturalWidth));
await p2.screenshot({ path: path.join(OUT, "far-profile-3up.png") });

const p3 = await browser.newPage({ viewport: { width: SMALL * 3 + 24, height: SMALL + 12 } });
await p3.setContent(`<!doctype html><meta charset="utf-8"><style>*{margin:0}
  body{background:${RULE};display:flex;gap:6px;padding:6px}</style>`
  + [fileOf("close"), fileOf("mid"), fileOf("wide")]
    .map(f => `<img src="${b64(f)}" width="${SMALL}" height="${SMALL}" style="display:block">`).join(""));
await p3.waitForFunction(() => [...document.images].every(i => i.complete && i.naturalWidth));
await p3.screenshot({ path: path.join(OUT, "far-slot-410.png") });

const p4 = await browser.newPage({ viewport: { width: SMALL * 3 + 24, height: SMALL + 12 } });
await p4.setContent(`<!doctype html><meta charset="utf-8"><style>*{margin:0}
  body{background:${RULE};display:flex;gap:6px;padding:6px}</style>`
  + [fileOf("small"), fileOf("mid"), fileOf("big")]
    .map(f => `<img src="${b64(f)}" width="${SMALL}" height="${SMALL}" style="display:block">`).join(""));
await p4.waitForFunction(() => [...document.images].every(i => i.complete && i.naturalWidth));
await p4.screenshot({ path: path.join(OUT, "far-slot-410-type.png") });
await browser.close();

/* ========== far-geo.json：每個地標離診所多遠、在小格上是幾 px ==========
 * ⚠ 這張表是「**為什麼連外道路收成箭頭、不畫進圖裡**」的唯一證據：
 *   兩個交流道在 5.1 / 7.3 公里外，要畫進來這張圖就得是 13 公里，
 *   而斗六高中在小格上離診所只有 10.9px —— 他列的地標會擠成一團。
 * ⚠ 沒有座標的一律寫 null（＝真的沒有被畫上去），守門會拿它去對頁面。 */
const A = made.find(x => x.tag === "mid");
/* ⚠⚠ 這張表算的是「**照第一版那個 13 公里的尺度**畫的話，各地標在小格上離診所幾 px」——
   它是「為什麼國道與省道收成角落的牌子」的唯一證據，所以比例尺要用**那個**尺度，
   不是這一版的 1.3 公里（用這一版的算，數字會變成 180px，什麼都證明不了）。 */
const WIDE_ZOOM = 13000;
const KWIDE = (W - 2 * PAD) / WIDE_ZOOM;
const FARMAP = JSON.parse(fs.readFileSync(path.join(ROOT, "drafts", "channels", "far-map.json"), "utf8"));
const GEO = {
  _說明: `每個地標離診所多遠，以及**照 ${WIDE_ZOOM} 公尺那個尺度**畫的話，`
    + `在小格 ${SMALL}px 上離診所幾 px（＝為什麼國道與省道收成角落的牌子）。`
    + "post-map-far.mjs 寫的，不要手改。",
  wideZoom: WIDE_ZOOM, k: +KWIDE.toFixed(5), slot: SMALL,
  places: FARMAP.places.filter(p => p.id !== "clinic").map(p => {
    if (!p.xy) return { name: p.name, src: p.src, m: null, px410: null };
    const d = Math.round(Math.hypot(p.xy[0], p.xy[1]));
    return { name: p.name, src: p.src, m: d, px410: +(d * KWIDE * K_SMALL).toFixed(1) };
  }),
};
fs.writeFileSync(path.join(OUT, "far-geo.json"), JSON.stringify(GEO, null, 2) + "\n");

/* ========== 「詳情」欄要貼的字 ==========
 * ⚠ 圖上的電話點不下去，說明欄裡的可以 —— 那是說明欄唯一做得到而圖做不到的事。
 * ⚠ 紅線：這個帳號沒有專人即時回覆，不可以寫「有問題歡迎私訊」。 */
const eOf = (short) => {
  const e = CITY.edges.find(x => x.short === short);
  if (!e) throw new Error(`far-city.json 的 edges 裡沒有 ${short}`);
  return e;
};
/* 車站走過來幾分鐘：從座標算，不要打一個數字上去（走路以 80 公尺／分鐘估） */
const ST = place("station").xy;
const STMIN = Math.round(Math.hypot(ST[0], ST[1]) / 80);
const detail = [
  "從外地來的話，這是斗六市區的走法。",
  /* ⚠⚠ `via` 是**站在診所往外看**的方向（＝圖上那個箭頭要的），
     照抄進說明欄會反過來（「斗南交流道下，往西南」——那是離開診所的方向）。
     說明欄要的是走的那條路的名字，所以只取「往」前面那一截。 */
  ...["國道１", "國道３"].map(k => {
    const e = eOf(k), road = e.via.split("往")[0];
    return `${k}號 ── ${e.name.split("　")[1]}下，接${road}往斗六市區，約 ${e.km} 公里。`;
  }),
  `火車 ── 斗六車站下車，走過來約 ${STMIN} 分鐘。`,
  "",
  ADDR,
  PHONE,
  "門口沒有停車位，周邊三處停車場走路 1~3 分鐘（見另一則）。",
].join("\n");
fs.writeFileSync(path.join(OUT, "far-detail.txt"), detail + "\n");

/* ========== 報告 ========== */
const doorInk = inkOf(fs.readFileSync(DOOR));
console.log(`地圖範圍　${A.zoom} 公尺寬　比例尺 ${A.k.toFixed(4)} 單位／公尺　`
  + `畫布 ${A.mapW}×${A.mapH}（縱向 ${Math.round(A.ext.y1 - A.ext.y0)} 公尺）`);
console.log(`有墨的像素　⭐${A.file} ${A.q.ink}%　`
  + `（對照：停車那張 door-c.png ${doorInk.ink}%）　幾乎全空的列 ${A.q.empty}/${A.q.h}`);
if (A.q.ink < doorInk.ink * .7)
  console.log(`  ⚠ 比停車那張空很多 —— 第一版被退回就是這一項（6.0% vs 29.0%）`);
console.log(`小格 410px 上　標題 ${(A.ts * K_SMALL).toFixed(1)}px　頁尾 ${(A.fs2 * K_SMALL).toFixed(1)}px　`
  + `街名 ${(A.mfs * .78 * K_SMALL).toFixed(1)}px　地標 ${(A.mfs * .95 * K_SMALL).toFixed(1)}px　`
  + `診所 ${(A.mfs * K_SMALL).toFixed(1)}px`);
console.log(`  ⚠ 地圖裡的字一律小於 10px —— 那是**故意的**（同停車那張）：`
  + `小格上地圖是一張圖，要讀完的字由標題與頁尾扛。`);
for (const x of made)
  console.log(`  ${x.file}　範圍 ${x.zoom}　標題 ${x.ts}／頁尾 ${x.fs2}／地圖 ${x.mfs}　`
    + `地圖 ${x.mapW}×${x.mapH}　墨 ${x.q.ink}%`);
console.log(`  far-profile-3up.png　far-slot-410.png　far-slot-410-type.png`);
console.log(`還沒有座標的地標 ${ASK.length} 個：${ASK.map(p => p.name).join("、")}`);
console.log(`  → 補進 drafts/channels/far-city.json 的 xy（公尺，原點＝診所，x 東 y 北）再跑一次，`
  + `版面不必動；補齊之前不會有定稿檔 ${FINAL_FILE}。`);

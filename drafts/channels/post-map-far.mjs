/* LINE 商家貼文用的第三張圖 —— **給外縣市／鄰近鄉鎮看的路線圖**
 *   node drafts/channels/post-map-far.mjs   → preview/line-post-map/far-*.png
 *
 * 2026-09-08 使用者：「製作另一個不一樣 scale 的地圖　目的是給周圍鄉鎮或外縣市的參考
 *   …圓環　車站　太細節的巷弄不需要標　因為外地人來不是認巷弄　可能要標示鐵路 國道 省道
 *   …公家機關例如斗六派出所 中華電信斗六服務中心 元大銀行斗信分行 斗六高中 斗六家商
 *   雲林縣政府　應該可以考慮標上去」
 *
 * ⚠⚠⚠ 這一張和已定案那兩張的分工（換一個讀者就是換一份工作）：
 *   ・看診時間（大格）    ＝ 什麼時候有診
 *   ・門口告示版（小格左）＝ **到了斗六之後停哪裡**（走路的尺度，180 公尺）
 *   ・這一張            ＝ **怎麼到斗六**（開車的尺度，8 公里）
 *   所以它不是「同一張地圖放大縮小」，是**另一份資料**：巷弄一條都不要，
 *   換成國道、省道、鐵路、車站，以及沿路看得到的大東西。
 *
 * ⚠⚠⚠ 地理資料只有一個出處：`drafts/channels/far-map.json`，
 *   而那一份是從**使用者自己給的那兩張截圖描出來的**（容器連不出去，
 *   Overpass／OSM 被 egress policy 擋掉、403，沒有第二個來源）。
 *   所以這支腳本裡**一個座標都沒有**，要改地圖就改那一份 JSON。
 *
 * ⚠⚠⚠ 六個公家機關（圓環／派出所／中華電信／元大銀行／家商／縣政府）**還沒有座標**：
 *   它們一個都沒有出現在那兩張截圖上，而我沒有辦法查。JSON 裡 src 是 "ask"，
 *   下面 `place()` 遇到 xy 是 null 會直接 throw —— **寧可畫不出來，也不要憑印象擺**。
 *   一個擺錯位置的地標，比沒有那個地標更糟（外地人會照著它轉錯彎）。
 *
 * ⚠ 顏色一個都沒有新增：PAPER／CARD／RULE／INK／INK-SOFT ＋ 站上地圖已經在用的
 *   一般牙科綠（診所那一塊）與路牌藍（國道）。
 * ⚠ 一律 headless_shell（CLAUDE.md 第九節第 18 條）。
 * ⚠ 容器裡沒有 Noto Sans TC，中文落到 WenQuanYi Zen Hei —— 字級與折行要以真機為準。
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const OUT  = path.join(ROOT, "preview", "line-post-map");
const SRC  = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
const DATA = JSON.parse(fs.readFileSync(path.join(ROOT, "drafts", "channels", "far-map.json"), "utf8"));

/* ---------- 顏色（PALETTE.md，一個都沒有新增） ---------- */
const PAPER = "#e2e5e6", CARD = "#f4f4f5", RULE = "#cdd0d2";
const INK = "#2a2c27", SOFT = "#5c5f57";
const GREEN = "#3f654a";   /* 一般牙科的套色 ＝ 站上地圖裡診所那一塊 */
const BLUE  = "#365685";   /* 站上地圖停車場「點到」那一階的路牌藍 ＝ 這裡給國道 */

/* ---------- 地址與電話：從 index.html 讀回來，不重打 ---------- */
const ADDR = (SRC.match(/<span class="txt">(雲林縣[^<]+)<\/span>/) || [])[1].replace(/&nbsp;/g, " ");
const PHONE = (SRC.match(/05-\d{7}/) || [])[0];
if (!ADDR || !PHONE) throw new Error("index.html 裡讀不到地址或電話");
/* 頁尾那顆話筒。素材出處：Lucide "phone"，ISC 授權，https://lucide.dev —— 這行註解就是署名。
   幾何從 index.html 頁首那顆讀回來，不抄第二份。 */
const TELICO = (SRC.match(/<span class="ico"><svg viewBox="0 0 24 24"[^>]*>(<path d="M21\.5[^"]+"\/>)<\/svg><\/span>/) || [])[1];
if (!TELICO) throw new Error("index.html 裡找不到話筒那條路徑（.c-tel 的 Lucide phone）");

/* ---------- 畫布 ---------- */
const W = 1080, H = 1080;
const BIG_W = 823, BIG_H = 409, SMALL = 410;
const BAND = Math.round(W * (BIG_H / BIG_W));      /* 大格看得到的列數 ＝ 537 */
const PAD = 40;
const K_SMALL = SMALL / W;                          /* 0.3796 */
const K_BIG = BIG_W / W;                            /* 0.7619 */

/* ⚠ 定稿那一張要拿得出去，所以檔名不是流水號（同看診時間那張 fangren-hours-1080.png）。
   ⚠⚠ 六個公家機關還沒有座標之前**不會有定稿**，所以這裡先留空 —— 見檔頭。 */
const FINAL = null;
const FINAL_FILE = "fangren-route-1080.png";
const fileOf = (tag) => tag === FINAL ? FINAL_FILE : `far-${tag}.png`;

/* ---------- 投影：公尺 → SVG 使用者單位 ----------
 * ⚠⚠ 第一版是「以診所為中心 ＋ 給一個半徑」，畫出來上面空了三分之一（第一張就看得到）。
 *   改成**把要畫的東西框起來、自己算比例尺**：範圍那把尺因此變成
 *   「這一格要畫哪幾條路」，而不是「半徑幾公尺」—— 前者才是使用者真正在挑的東西。 */
const fitProj = (pts, vbw, vbh, pad) => {
  const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]);
  const x0 = Math.min(...xs), x1 = Math.max(...xs);
  const y0 = Math.min(...ys), y1 = Math.max(...ys);
  const k = Math.min((vbw - 2 * pad) / Math.max(1, x1 - x0),
                     (vbh - 2 * pad) / Math.max(1, y1 - y0));
  const ox = (vbw - (x1 - x0) * k) / 2, oy = (vbh - (y1 - y0) * k) / 2;
  const P = ([x, y]) => [ox + (x - x0) * k, vbh - oy - (y - y0) * k];
  P.k = k;                       /* 公尺 → SVG 單位 */
  return P;
};

/* ---------- 一條路畫多粗（SVG 單位） ---------- */
const WGT = { free: 7.4, prov: 5.6, county: 4.2, main: 3.4, rail: 3.0 };

/* ---------- 地標 ---------- */
const place = (id) => {
  const p = DATA.places.find(q => q.id === id);
  if (!p) throw new Error(`far-map.json 裡沒有 ${id}`);
  if (!p.xy) throw new Error(
    `「${p.name}」還沒有座標（src: ${p.src}）——` +
    "不要憑印象擺，一個擺錯的地標比沒有那個地標更糟。要畫就先把座標填進 far-map.json");
  return p;
};
const road = (id) => {
  const r = DATA.roads.find(q => q.id === id);
  if (!r) throw new Error(`far-map.json 裡沒有 ${id}`);
  return r;
};
/* 有座標的地標（能畫的）與沒有的（要問使用者的） */
const HAVE = DATA.places.filter(p => p.xy && p.id !== "clinic");
const ASK  = DATA.places.filter(p => !p.xy);

/* ---------- 版面（排字用的，不是地理資料，所以留在這一支裡） ----------
 * t ＝ 標在整條路的幾成處；dx/dy ＝ 從那一點推開多少（SVG 單位）。
 * ⚠ 路名一律**畫成水平的**，不順著路轉 —— 410px 上斜的中文會糊掉，
 *   而這張圖的判準就是「小格上讀不讀得出來」。 */
const LBL = {
  rail:   { t: .12, dx:  12, dy:  26, anchor: "start"  },
  n1:     { t: .28, dx:  16, dy:  -6, anchor: "start"  },
  n3:     { t: .55, dx: -16, dy:  -6, anchor: "end"    },
  t3:     { t: .34, dx: -14, dy:  22, anchor: "end"    },
  t1d:    { t: .16, dx:  12, dy:  22, anchor: "start"  },
  c158:   { t: .22, dx:   0, dy: -16, anchor: "middle" },
  c154b:  { t: .90, dx: -12, dy:   6, anchor: "end"    },
  wenhua: { t: .12, dx:   0, dy: -14, anchor: "middle" },
  c149a:  { t: .45, dx:  14, dy:  20, anchor: "start"  },
  wenhua: { t: .99, dx:  14, dy:  30, anchor: "start"  },
};
/* 地標的字要往哪一邊推開，避免壓到路 */
const POFF = {
  station: { dx: -14, dy:  -6, anchor: "end"    },
  il3:     { dx: -14, dy:  -8, anchor: "end"    },
  il1:     { dx:  16, dy:  -8, anchor: "start"  },
  dlhs:    { dx:   0, dy: -22, anchor: "middle" },
  yuntech: { dx: -14, dy:  10, anchor: "end"    },
};
/* ⚠⚠⚠ 這一輪最重要的一件：**他列的八個地標裡只有「車站」是廣域尺度的。**
 *   圓環、派出所、中華電信、元大銀行、斗六高中、斗六家商、雲林縣政府 —— 七個全部落在
 *   市區那兩公里見方裡。一張 13 公里寬的圖上，它們會在同一撮 150px 裡疊成一團。
 *   所以地標分兩層，市區那一層放進**右下角那個放大的小圖**（inset）。 */
const TIER = { il3: "wide", il1: "wide", yuntech: "wide", station: "city",
               dlhs: "city",
               circle: "city", police: "city", cht: "city",
               yuanta: "city", dlvs: "city", county: "city" };
/* 小圖要畫哪幾條路（市區那一層） */
const CITY_ROADS = ["rail", "wenhua", "c154b", "t1d", "n3link"];
/* ⚠ 哪一層標哪幾條路名：**文化路與縣道１５４乙是市區尺度的**，
   放在 13 公里寬的廣域圖上只會擠在中間那一撮、把車站與診所壓掉。 */
/* ⚠ 文化路標在**廣域那一層的東段**（＝從國道３下來會接上的那一段）——
   放進小圖的話它會和斗六車站的字疊在一起，而小圖裡真正要靠字分辨的是車站與高中。 */
const WIDE_NAMES = ["n1", "n3", "t3", "t1d", "c158", "rail", "wenhua"];
const CITY_NAMES = ["c154b"];
/* 小圖自己的排字（和廣域那一層的位置不一樣，所以另外一張表） */
const LBL2 = {
  c154b:  { t: .52, dx:  10, dy:  22, anchor: "start"  },
};
/* 小圖裡地標的字要往哪一邊推（和廣域那一層不一樣，所以另外一張表） */
const POFF2 = {
  station: { dx:  -4, dy: -24, anchor: "middle" },
  dlhs:    { dx:  16, dy:  -2, anchor: "start"  },
};

/* ---------- 沿著折線取一點 ---------- */
const along = (pts, t) => {
  const seg = [];
  let total = 0;
  for (let i = 1; i < pts.length; i++) {
    const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    seg.push(d); total += d;
  }
  let want = total * t;
  for (let i = 0; i < seg.length; i++) {
    if (want <= seg[i] || i === seg.length - 1) {
      const r = seg[i] ? want / seg[i] : 0;
      return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * r,
              pts[i][1] + (pts[i + 1][1] - pts[i][1]) * r];
    }
    want -= seg[i];
  }
  return pts[0];
};

/* ---------- 鐵路：底線 ＋ 一段一段的枕木 ---------- */
const railTicks = (P, pts, step, len) => {
  const out = [];
  for (let i = 1; i < pts.length; i++) {
    const a = P(pts[i - 1]), b = P(pts[i]);
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
    if (!L) continue;
    const ux = (b[0] - a[0]) / L, uy = (b[1] - a[1]) / L;
    for (let d = step / 2; d < L; d += step) {
      const cx = a[0] + ux * d, cy = a[1] + uy * d;
      out.push(`M${(cx - uy * len).toFixed(1)} ${(cy + ux * len).toFixed(1)}`
             + `L${(cx + uy * len).toFixed(1)} ${(cy - ux * len).toFixed(1)}`);
    }
  }
  return out.join("");
};

/* ---------- 畫一層（廣域 或 小圖共用） ---------- */
const layer = ({ P, roads, marks, nameIds = [], lbl = LBL, poff = POFF, fs, wgt = 1,
                 clinicName = true, ids = null }) => {
  const d = (pts) => pts.map((p, i) => (i ? "L" : "M") + P(p).map(v => v.toFixed(1)).join(" ")).join("");
  const col = { free: BLUE, prov: SOFT, county: SOFT, main: RULE, rail: INK };
  const order = ["main", "county", "prov", "free", "rail"];
  const lines = roads.slice().sort((a, b) => order.indexOf(a.kind) - order.indexOf(b.kind))
    .map(r => r.kind === "rail"
      ? `<path d="${d(r.pts)}" fill="none" stroke="${INK}" stroke-width="${(2.6 * wgt).toFixed(1)}"/>`
        + `<path d="${railTicks(P, r.pts, 15 * wgt, 5.2 * wgt)}" fill="none" stroke="${INK}"`
        + ` stroke-width="${(2.2 * wgt).toFixed(1)}"/>`
      : `<path d="${d(r.pts)}" fill="none" stroke="${col[r.kind]}"`
        + ` stroke-width="${(WGT[r.kind] * wgt).toFixed(1)}"`
        + ` stroke-linecap="round" stroke-linejoin="round"/>`).join("");

  const rn = roads.filter(r => r.name && lbl[r.id] && nameIds.includes(r.id)).map(r => {
    const o = lbl[r.id], [px, py] = P(along(r.pts, o.t));
    return `<text class="rn${r.kind === "free" ? " free" : ""}" x="${(px + o.dx).toFixed(1)}"`
      + ` y="${(py + o.dy).toFixed(1)}" text-anchor="${o.anchor}">${r.name}</text>`;
  }).join("");

  let dots = "", nums = [];
  const list = (ids || []).map(id => place(id));
  if (marks !== "none") {
    dots = list.map((p, i) => {
      const [px, py] = P(p.xy), o = poff[p.id] || { dx: 0, dy: -18, anchor: "middle" };
      const s = p.kind === "ic"
        ? `<circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="${(9 * wgt).toFixed(1)}" fill="${BLUE}"/>`
          + `<circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="${(3.6 * wgt).toFixed(1)}" fill="${CARD}"/>`
        : p.kind === "rail"
        ? `<rect x="${(px - 8 * wgt).toFixed(1)}" y="${(py - 8 * wgt).toFixed(1)}"`
          + ` width="${(16 * wgt).toFixed(1)}" height="${(16 * wgt).toFixed(1)}" rx="3.5" fill="${INK}"/>`
        : `<circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="${(7.5 * wgt).toFixed(1)}" fill="${SOFT}"/>`;
      if (marks === "num") nums.push(p.name);
      const txt = marks === "num" ? String(i + 1) : p.name;
      return s + `<text class="pn" x="${(px + o.dx).toFixed(1)}" y="${(py + o.dy).toFixed(1)}"`
        + ` text-anchor="${o.anchor}">${txt}</text>`;
    }).join("");
  }

  const c = place("clinic"), [cx, cy] = P(c.xy);
  const bw = fs * 4.35, bh = fs * 1.72;
  const clinic = clinicName
    ? `<g class="me"><rect x="${(cx - bw / 2).toFixed(1)}" y="${(cy - bh / 2).toFixed(1)}"`
      + ` width="${bw.toFixed(1)}" height="${bh.toFixed(1)}" rx="${(bh * .28).toFixed(1)}" fill="${GREEN}"/>`
      + `<text class="mt" x="${cx.toFixed(1)}" y="${(cy + fs * .37).toFixed(1)}"`
      + ` text-anchor="middle">${c.name}</text></g>`
    : `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${(9 * wgt).toFixed(1)}" fill="${GREEN}"/>`;
  return { body: lines + rn + dots + clinic, nums };
};

/* ---------- 整張地圖 ---------- */
/* roads: 這一格要畫哪幾條；wide: 廣域那一層要標哪幾個地標；inset: 要不要右下角那個放大的小圖 */
const mapSvg = ({ roadIds, vbw, vbh, marks, fs, inset }) => {
  const roads = roadIds.map(road);
  const wideIds = HAVE.filter(p => TIER[p.id] === "wide" &&
    roadIds.some(() => true)).map(p => p.id);
  const cityIds = HAVE.filter(p => TIER[p.id] === "city").map(p => p.id);
  const shown = inset ? wideIds : wideIds.concat(cityIds);

  const pts = roads.flatMap(r => r.pts)
    .concat(shown.map(id => place(id).xy)).concat([[0, 0]]);
  const P = fitProj(pts, vbw, vbh, 46);
  const L = layer({ P, roads, marks, nameIds: WIDE_NAMES, fs, ids: shown });

  /* 比例尺：挑一個在圖上 90~230 單位之間、好唸的整數公里 */
  const km = [500, 1000, 2000, 5000].find(v => v * P.k >= 90 && v * P.k <= 260) || 1000;
  const barW = km * P.k;
  const bx = 30, by = vbh - 24;
  const bar = `<g><path d="M${bx} ${by}h${barW.toFixed(1)}M${bx} ${by - 6}v12`
    + `M${(bx + barW).toFixed(1)} ${by - 6}v12" fill="none" stroke="${SOFT}" stroke-width="2.4"/>`
    + `<text class="sct" x="${(bx + barW / 2).toFixed(1)}" y="${(by - 12).toFixed(1)}"`
    + ` text-anchor="middle">${km >= 1000 ? km / 1000 + " 公里" : km + " 公尺"}</text></g>`;
  /* 指北針：箭頭朝上，「北」在箭頭上面 */
  const nx = vbw - 34, ny = 30;
  const north = `<g><path d="M${nx} ${ny + 14}L${nx - 8} ${ny + 34}L${nx} ${ny + 28}`
    + `L${nx + 8} ${ny + 34}Z" fill="${SOFT}"/>`
    + `<text class="nst" x="${nx}" y="${ny + 6}" text-anchor="middle">北</text></g>`;

  /* ---- 右下角那個放大的小圖 ----
   * ⚠⚠⚠ 為什麼要它：使用者列的八個地標裡**只有「車站」是廣域尺度的**，
   *   其餘七個全部在市區那兩公里見方裡 —— 在 13 公里寬的圖上它們會疊成一團。
   *   一張圖裝不下兩個尺度，古典解就是**在同一張圖上開一個小窗**。 */
  let ins = "", insNums = [];
  if (inset) {
    const iw = Math.round(vbw * .42), ih = Math.round(iw * .80);
    const ix = vbw - iw - 18, iy = vbh - ih - 18;
    const cityRoads = CITY_ROADS.map(road);
    /* ⚠⚠ 小圖的範圍**寫死成以診所為中心的正方形**，不要跟著「現在有哪幾個地標」浮動 ——
       六個公家機關的座標一補進來，範圍就會自己變、他上一輪看過的那一張就不算數了。 */
    const R = 1100;
    const cpts = [[-R, -R], [R, R]];
    const IP = fitProj(cpts, iw, ih, 26);
    const IL = layer({ P: IP, roads: cityRoads, marks, nameIds: CITY_NAMES, lbl: LBL2,
                       poff: POFF2, fs: fs * .92, wgt: .8, ids: cityIds });
    insNums = IL.nums;
    /* ⚠ 小圖在廣域圖上涵蓋的是哪一塊，要用**算出來的**那一塊畫，不要隨手給一個小方框
       —— 不然那個虛線框會說謊（它是「放大的是這一塊」的唯一說明）。 */
    const cx0 = Math.min(...cpts.map(p => p[0])), cx1 = Math.max(...cpts.map(p => p[0]));
    const cy0 = Math.min(...cpts.map(p => p[1])), cy1 = Math.max(...cpts.map(p => p[1]));
    const a = P([cx0, cy1]), b = P([cx1, cy0]);
    const halo = `<rect x="${a[0].toFixed(1)}" y="${a[1].toFixed(1)}"`
      + ` width="${(b[0] - a[0]).toFixed(1)}" height="${(b[1] - a[1]).toFixed(1)}"`
      + ` rx="6" fill="none" stroke="${SOFT}" stroke-width="1.8" stroke-dasharray="6 5"/>`
      + `<path d="M${b[0].toFixed(1)} ${b[1].toFixed(1)}L${ix + 10} ${iy + 10}" fill="none"`
      + ` stroke="${SOFT}" stroke-width="1.4" stroke-dasharray="4 4"/>`;
    ins = halo + `<g transform="translate(${ix} ${iy})">`
      + `<rect x="0" y="0" width="${iw}" height="${ih}" rx="10" fill="${CARD}"`
      + ` stroke="${SOFT}" stroke-width="1.6"/>`
      + `<clipPath id="ic"><rect x="1" y="1" width="${iw - 2}" height="${ih - 2}" rx="9"/></clipPath>`
      + `<g clip-path="url(#ic)">${IL.body}</g>`
      + `<text class="ins" x="${iw - 12}" y="${(fs * 1.24).toFixed(0)}" text-anchor="end">市區放大</text></g>`;
  }

  const clip = `<clipPath id="mc"><rect x="0" y="0" width="${vbw}" height="${vbh}"/></clipPath>`;
  return { svg: `<svg viewBox="0 0 ${vbw} ${vbh}" width="${vbw}" height="${vbh}">${clip}`
    + `<rect width="${vbw}" height="${vbh}" fill="${CARD}"/>`
    + `<g clip-path="url(#mc)">${L.body}${bar}${north}${ins}</g></svg>`,
    nums: L.nums.concat(insNums), P };
};

/* ---------- 版型 ---------- */
/* ⚠⚠ 這是模板字串，CSS 註解裡不可以出現反引號（第九節第 8 條，這條線已經踩過四次）。
   ⚠⚠⚠ 小格 410px 只有 0.3796 倍，所以**任何要讀完的字都不可以小於 27px**
   （27 × 0.3796 ＝ 10.25）。這一張圖因此幾乎沒有「小字」可以用 —— 那是量出來的限制，
   不是排版偷懶（第 35-1 節那條 10px 的線）。 */
const MIN = Math.ceil(10 / K_SMALL);   /* 27 */
const css = (fs) => `
*{box-sizing:border-box;margin:0}
html,body{width:${W}px;height:${H}px}
body{background:${CARD};color:${INK};-webkit-font-smoothing:antialiased;
     font-family:"Noto Sans TC","WenQuanYi Zen Hei",sans-serif}
.sheet{width:${W}px;height:${H}px;display:flex;flex-direction:column;justify-content:center;
       padding:0 ${PAD}px;position:relative;overflow:hidden}
.tt{font-size:${Math.round(fs * 1.5)}px;font-weight:700;letter-spacing:.02em;
    padding-bottom:${Math.round(fs * .5)}px}
.rule{height:1px;background:${RULE}}
.map{padding:${Math.round(fs * .55)}px 0;display:flex;justify-content:center}
.map svg{display:block}
.legend{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));
        gap:${Math.round(fs * .26)}px ${Math.round(fs * .8)}px;
        padding-top:${Math.round(fs * .5)}px;font-size:${Math.max(MIN, Math.round(fs * .92))}px}
.legend span{display:flex;align-items:center;gap:${Math.round(fs * .3)}px}
.legend i{flex:none;width:${Math.round(fs * .96)}px;height:${Math.round(fs * .96)}px;border-radius:50%;
          background:${SOFT};color:${CARD};font-style:normal;font-weight:700;
          font-size:${Math.round(fs * .6)}px;display:flex;align-items:center;justify-content:center;
          font-family:Arial,Helvetica,sans-serif}
.foot{padding-top:${Math.round(fs * .55)}px;display:flex;align-items:center;
      gap:${Math.round(fs * .7)}px;font-size:${Math.max(MIN, Math.round(fs * .92))}px;letter-spacing:.01em}
.foot .a{color:${SOFT}}
.foot .t{display:flex;align-items:center;gap:${Math.round(fs * .28)}px;color:${INK};font-weight:700}
.foot .t svg{width:${Math.round(fs * .84)}px;height:${Math.round(fs * .84)}px;fill:${INK};display:block}
.rn{font-size:${Math.max(MIN, Math.round(fs * .95))}px;fill:${SOFT};font-weight:700;letter-spacing:.02em;
    paint-order:stroke;stroke:${CARD};stroke-width:5px;stroke-linejoin:round}
.rn.free{fill:${BLUE}}
.pn{font-size:${Math.max(MIN, Math.round(fs))}px;fill:${INK};font-weight:700;letter-spacing:.02em;
    paint-order:stroke;stroke:${CARD};stroke-width:5.5px;stroke-linejoin:round}
.mt{font-size:${Math.max(MIN, Math.round(fs * 1.02))}px;fill:${CARD};font-weight:700;letter-spacing:.04em}
.sct,.nst,.ins{font-size:${Math.max(MIN, Math.round(fs * .92))}px;fill:${SOFT};font-weight:700;
          paint-order:stroke;stroke:${CARD};stroke-width:4px;stroke-linejoin:round}
`;

const TELSVG = `<svg viewBox="0 0 24 24" aria-hidden="true">${TELICO}</svg>`;
const sheet = ({ title, svg, nums }) => `<div class="sheet">
  ${title ? `<div class="tt">${title}</div>` : ""}
  <div class="rule"></div>
  <div class="map">${svg}</div>
  <div class="rule"></div>
  ${nums && nums.length ? `<div class="legend">${nums.map((n, i) =>
      `<span><i>${i + 1}</i>${n}</span>`).join("")}</div>` : ""}
  <div class="foot"><span class="a">${ADDR}</span>
    <span class="t">${TELSVG}${PHONE}</span></div>
</div>`;

/* ---------- 「詳情」欄要貼的字 ----------
 * 一個一覽項目 ＝ 一張方形照片 ＋ 一段「詳情」，所以圖不必把每一件事都扛下來。
 * ⚠ 紅線：這個帳號沒有專人即時回覆，不可以出現「有問題隨時問」那一類的話（第十一之三節）。 */
const STA = Math.round(Math.hypot(...place("station").xy) / 10) * 10;
const detail = `開車或搭車來斗六的話，這是周邊的路線。\n`
  + `國道１號 ── 斗南交流道下，走台１丁往斗六市區。\n`
  + `國道３號 ── 斗六交流道下，往西南進市區、接文化路。\n`
  + `火車 ── 斗六車站下車，往東約 ${STA} 公尺。\n`
  + `${ADDR}　${PHONE}`;
for (const re of [/隨時(問|詢問|聯絡)/, /都可以問/, /即時回/, /小編/, /馬上回/])
  if (re.test(detail)) throw new Error(`「詳情」踩到紅線：${re}`);

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
if (fs.existsSync(path.join(OUT, FINAL_FILE))) fs.rmSync(path.join(OUT, FINAL_FILE));

const TITLE = "開車來芳仁牙醫";
/* 三組範圍：這一格要畫哪幾條路（範圍是**算出來的**，不是給半徑） */
const R_WIDE = ["n1", "n3", "t3", "t1d", "c158", "c154b", "wenhua", "n3link", "rail"];
const R_ALL  = R_WIDE.concat(["c149a"]);
const R_MID  = ["n3", "t1d", "c158", "c154b", "wenhua", "n3link", "rail"];
const R_CITY = ["t1d", "c154b", "wenhua", "n3link", "rail", "c158"];
const made = [];

const build = async (tag, name, { roadIds = R_WIDE, marks = "name", fs2 = 30,
                                  title = TITLE, inset = true } = {}) => {
  const vbw = W - 2 * PAD;
  const shell = (vbh) => {
    const m = mapSvg({ roadIds, vbw, vbh, marks, fs: fs2, inset });
    return { html: `<!doctype html><meta charset="utf-8"><style>${css(fs2)}</style>`
      + sheet({ title, svg: m.svg, nums: m.nums }), nums: m.nums };
  };
  let vbh = 640;
  for (let i = 0; i < 4; i++) {
    await page.setContent(shell(vbh).html);
    const got = await page.evaluate(() => {
      const s = document.querySelector(".sheet").getBoundingClientRect();
      const m = document.querySelector(".map").getBoundingClientRect();
      return s.height - m.height;
    });
    const room = H - got - 2;
    if (Math.abs(room - vbh) <= 1) break;
    vbh = Math.max(240, Math.round(room));
  }
  const S = shell(vbh);
  const K = mapSvg({ roadIds, vbw, vbh, marks, fs: fs2, inset }).P.k;
  await page.setContent(S.html);
  await page.waitForTimeout(240);

  const M = await page.evaluate(({ K_SMALL, BAND }) => {
    const px = (sel) => { const el = document.querySelector(sel);
      return el ? parseFloat(getComputedStyle(el).fontSize) : 0; };
    const kinds = { "標題": ".tt", "路名": ".rn", "地標名": ".pn", "診所": ".mt",
                    "比例尺": ".sct", "地址": ".foot .a", "電話": ".foot .t", "清單": ".legend span" };
    const sizes = Object.fromEntries(Object.entries(kinds)
      .map(([k, s]) => [k, +(px(s) * K_SMALL).toFixed(1)]));
    /* HTML 的溢出（畫布左右） */
    let over = 0;
    for (const el of document.querySelectorAll(".sheet > *, .sheet > * > *")) {
      const r = el.getBoundingClientRect();
      if (r.width && (r.left < -0.5 || r.right > 1080.5)) over++;
    }
    /* ⚠⚠ 地圖上的字是**畫在 viewBox 裡**的，掉出去會被裁掉而且不報錯 ——
       所以要一個一個量它的外框在不在 viewBox 內（症狀是「某一條路名不見了」）。 */
    const svg = document.querySelector(".map svg");
    const sr = svg.getBoundingClientRect();
    const cut = [...svg.querySelectorAll("text")].filter(t => {
      const r = t.getBoundingClientRect();
      return r.width && (r.left < sr.left - .5 || r.right > sr.right + .5
                      || r.top < sr.top - .5 || r.bottom > sr.bottom + .5);
    }).map(t => t.textContent);
    /* ⚠⚠ 小圖是另一個 clipPath，外面那一道量不到它 —— 症狀一樣是「某個字不見了」
       而每一個尺寸都對（同第 35-11 節那個坑）。所以小圖自己再量一次。 */
    const box = svg.querySelector("g[transform] rect");
    if (box) {
      const br = box.getBoundingClientRect();
      for (const t of svg.querySelectorAll("g[transform] text")) {
        const r = t.getBoundingClientRect();
        if (r.width && (r.left < br.left - .5 || r.right > br.right + .5
                     || r.top < br.top - .5 || r.bottom > br.bottom + .5))
          cut.push("（小圖）" + t.textContent);
      }
    }
    /* 大格只看得到中間那一條 */
    const top = (1080 - BAND) / 2, bot = 1080 - top;
    const cutBig = [".tt", ".foot", ".legend"].filter(s => {
      const el = document.querySelector(s); if (!el) return false;
      const r = el.getBoundingClientRect(); return r.height && (r.top < top || r.bottom > bot);
    });
    return { sizes, over, cut, cutBig,
             map: { w: +sr.width.toFixed(0), h: +sr.height.toFixed(0) } };
  }, { K_SMALL, BAND });

  await page.screenshot({ path: path.join(OUT, fileOf(tag)) });
  made.push({ tag, name, file: fileOf(tag), marks, fs: fs2, nums: S.nums.length, k: K, ...M });
  return M;
};

const CASES = [
  ["mid",   "⭐ 建議：國道１＋國道３＋台３＋鐵路，右下角開一個市區小圖", {}],
  ["nolens","同上，但不開市區小圖（地標全部擠在中間那一撮）", { inset: false }],
  ["all",   "多畫一條縣道１４９甲（東南方向）", { roadIds: R_ALL }],
  ["tight", "範圍收小：只到斗六市區與國道３交流道", { roadIds: R_MID }],
  ["city",  "範圍再收：只有市區（沒有國道）", { roadIds: R_CITY }],
  ["num",   "地標改成號碼 ＋ 底下列清單", { marks: "num" }],
  ["plain", "不放地標（只有路、車站、診所）", { marks: "none" }],
  ["big",   "字大一階（×1.15）", { fs2: 34 }],
  ["small", "字小一階（×0.87）", { fs2: 26 }],
  ["notitle", "沒有標題（版面全給地圖）", { title: "" }],
  ["t2",    "標題換一句：怎麼到芳仁牙醫", { title: "怎麼到芳仁牙醫" }],
];
for (const [tag, nm, o] of CASES) await build(tag, nm, o);

/* ---------- 主頁那三格的模擬 ----------
 * ⚠⚠ 這一張是這一輪最要緊的一張：三格已經被看診時間（大格）與停車圖（小格左）佔滿，
 *   而「主題與科別」原本排在小格右（第 34-4 節）。這一則要放哪一格是使用者的決定。 */
const b64 = (f) => fs.readFileSync(f).toString("base64");
const HOURS = path.join(ROOT, "preview", "line-post-hours", "fangren-hours-1080.png");
const DOOR  = path.join(OUT, "door-c.png");
const img = (f) => `data:image/png;base64,${b64(f)}`;
const MID = path.join(OUT, fileOf("mid"));
if (fs.existsSync(HOURS) && fs.existsSync(DOOR)) {
  const p2 = await browser.newPage({ viewport: { width: BIG_W + 24, height: BIG_H + SMALL + 32 } });
  await p2.setContent(`<style>*{margin:0}body{background:${PAPER};padding:8px;
    display:grid;gap:8px;grid-template-columns:${SMALL}px ${SMALL}px;width:${BIG_W + 24}px}
    .big{grid-column:1/3;width:${BIG_W}px;height:${BIG_H}px;object-fit:cover;border-radius:8px}
    .sm{width:${SMALL}px;height:${SMALL}px;object-fit:cover;border-radius:8px}</style>
    <img class="big" src="${img(HOURS)}"><img class="sm" src="${img(DOOR)}">
    <img class="sm" src="${img(MID)}">`);
  await p2.waitForTimeout(320);
  await p2.screenshot({ path: path.join(OUT, "far-profile-3up.png") });
  /* 小格實際大小（410px）—— 判準就在這一張上 */
  await p2.setViewportSize({ width: SMALL + 20, height: SMALL + 20 });
  await p2.setContent(`<style>*{margin:0}body{background:${PAPER};padding:10px}
    img{width:${SMALL}px;height:${SMALL}px;object-fit:cover;border-radius:8px;display:block}</style>
    <img src="${img(MID)}">`);
  await p2.waitForTimeout(200);
  await p2.screenshot({ path: path.join(OUT, "far-slot-410.png") });
  await p2.close();
}

/* ⚠⚠ 規格頁上那張「每個地標在小格上離診所幾 px」的表**不要手抄** ——
   數字寫進這一份，check 拿它去對（同 door-qr.json 的做法）。
   那張表是「為什麼要開一個市區小圖」的唯一證據，抄錯就等於證據錯了。 */
const KMID = made.find(m => m.tag === "mid").k;
fs.writeFileSync(path.join(OUT, "far-geo.json"), JSON.stringify({
  _說明: "far-mid.png 的比例尺，以及每個地標離診所多遠、在小格 410px 上是幾 px。post-map-far.mjs 寫的，不要手改。",
  k: +KMID.toFixed(5), slot: SMALL,
  places: DATA.places.filter(p => p.id !== "clinic").map(p => ({
    name: p.name, src: p.src,
    m: p.xy ? Math.round(Math.hypot(...p.xy)) : null,
    px410: p.xy ? +(Math.hypot(...p.xy) * KMID * K_SMALL).toFixed(1) : null,
  })),
}, null, 2) + "\n");
fs.writeFileSync(path.join(OUT, "far-detail.txt"), detail + "\n");
await browser.close();

/* ---------- 面板 ---------- */
const bad = [];
console.log("\n── 產出 ──");
for (const m of made) {
  console.log(`  ${m.file.padEnd(22)} ${m.name}`);
  console.log(`     地圖 ${m.map.w}×${m.map.h}　溢出 ${m.over}　`
    + `被裁掉的字 ${m.cut.length ? m.cut.join("、") : "沒有"}　`
    + `大格會切到 ${m.cutBig.length ? m.cutBig.join("、") : "沒有"}`);
  console.log(`     小格 410px 上：` + Object.entries(m.sizes).filter(([, v]) => v)
    .map(([k, v]) => `${k} ${v}${v < 10 ? " ⚠" : ""}`).join("　"));
  if (m.over) bad.push(`${m.file} 有 ${m.over} 個元素溢出畫布`);
  if (m.cut.length) bad.push(`${m.file} 有字被 viewBox 裁掉：${m.cut.join("、")}`);
  const tiny = Object.entries(m.sizes).filter(([, v]) => v && v < 10);
  if (tiny.length && ["mid", "num", "plain", "big"].includes(m.tag))
    bad.push(`${m.file} 有字在小格上小於 10px：` + tiny.map(([k, v]) => `${k} ${v}`).join("、"));
}

console.log("\n── ⚠⚠⚠ 還沒有座標、所以一顆都沒有畫上去的地標 ──");
for (const p of ASK) console.log(`  ・${p.name}`);
console.log(`  這 ${ASK.length} 個一個都不在使用者給的那兩張截圖上，容器又連不出去（proxy 403），`);
console.log("  所以查不到。**沒有憑印象擺** —— 擺錯位置的地標會讓外地人轉錯彎，比不標更糟。");
console.log("  要補：把座標填進 drafts/channels/far-map.json 的 xy（公尺，原點是診所），");
console.log("  src 改成 user，再跑一次這支就會畫上去。");

console.log("\n── 圖上現在有的地標（都是從那兩張截圖描出來的） ──");
for (const p of HAVE) console.log(`  ・${(p.name + "　").padEnd(8)} (${p.xy[0]}, ${p.xy[1]}) 公尺`
  + `　${TIER[p.id] === "wide" ? "廣域" : "市區小圖"}　src: ${p.src}`
  + (p.note ? `\n      ${p.note}` : ""));

console.log("\n── 「詳情」欄要貼的字 ──\n" + detail.split("\n").map(l => "  " + l).join("\n"));
if (bad.length) { console.log("\n⚠ 有問題："); for (const b of bad) console.log("  ・" + b); }
console.log(`\n共 ${made.length} 張 → ${path.relative(ROOT, OUT)}/`);

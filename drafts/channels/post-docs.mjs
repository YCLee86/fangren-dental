/* LINE 貼文用的第三張「主題與科別・醫師」圖 → preview/line-post-docs/*.png
 *   node drafts/channels/post-docs.mjs
 *
 * 使用者 2026-09-08：「Line商家帳號的貼文 還有一格 之前對話建議放主題與科別
 *   包括醫師的資訊 但只有一格 怎麼放七個醫師」
 *   → 回覆之後：「有點難想像 你們先做看看 **但因為門診表已經有七個科別
 *     所以不要只是又重複只列七個科別**」
 *
 * ⚠⚠⚠ 那句話就是這一張圖的規格：**大格（門診表）已經把七個科別名連同
 *   它們的圖案印過一次了**（那張圖底下有一排圖例）。所以這一格不可以再是
 *   一份科別清單 —— 它要接的是門診表**沒有**回答的那兩件事：
 *     ① **誰** —— 九位醫師（門診表上一個人名都沒有）
 *     ② **做得了什麼** —— 站上醫師卡的專長，二十三項（門診表上一項都沒有）
 *
 * ⚠⚠ 而「不要重複」還有一個免費的做法：**科別的名字整個不寫，只留圖案。**
 *   三格是一起看的，大格那排圖例已經教過「哪一顆是哪一科」，
 *   所以這一格直接用同一組形狀、同一組顏色，省下來的寬度全部給人名與專長。
 *   ⚠ 但這是一個賭注：有人可能只看到這一格。所以 Ⓓ 那一案把科別名寫回去，
 *     擺出來讓使用者比 —— **不要自己決定**。
 *
 * ⚠⚠⚠ 資料只有一個出處：index.html 的 #doctors 與 #topics。
 *   醫師的姓名、藥丸（部定專科的寫法）、專長與它各自的 data-spec、
 *   科別名、「9 位醫師」「6 個部定專科」那兩個數字，全部讀回來，一個字不重打。
 *   （同 post-hours.mjs 讀排班、tools/schema.mjs 讀營業時間。）
 *   ⚠ 尤其那兩個數字 —— index.html 的註解就寫著「改任何一位醫師的資歷欄都要
 *     回來數一次」，抄一份到這裡就是第二個會過期的真相。
 *
 * ⚠ 顏色一個都沒有新增：科別的圖案吃 post-hours.mjs 那一組「使用者挑的混合」，
 *   文字是 --ink／--ink-soft，底是 --card。浮水印照小格左（地圖）那一張：
 *   r1c2、4%、壓左上 —— 兩個小格並排，浮水印不一樣會讀成兩件事。
 * ⚠ 一律 headless_shell（CLAUDE.md 第九節第 18 條）。
 * ⚠ 容器裡沒有 Noto Sans TC，中文落到 WenQuanYi Zen Hei；字級與折行以真機為準。
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const OUT  = path.join(ROOT, "preview", "line-post-docs");
const SRC  = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");

/* ---------- 顏色（PALETTE.md，一個都沒有新增） ---------- */
const CARD = "#f4f4f5", RULE = "#cdd0d2", INK = "#2a2c27", SOFT = "#5c5f57";
/* ＝ post-hours.mjs 的 BRAND.mix（2026-09-07 使用者自己挑的那一組）。
   ⚠⚠ 這裡是第二份，所以下面有一道守門逐格比對 post-hours.mjs 裡的那一份 ——
   兩張圖並排在主頁上，顏色差一階就會被看出來。 */
const TONE = { general:"#5A6E4F", perio:"#436A67", endo:"#944449", kids:"#926833",
               ortho:"#31637F", prosth:"#394666", surg:"#6F5477" };
{
  const hs = fs.readFileSync(path.join(ROOT, "drafts", "channels", "post-hours.mjs"), "utf8");
  const blk = hs.slice(hs.indexOf("mix:  {"), hs.indexOf("mix:  {") + 400);
  for (const [id, c] of Object.entries(TONE)) {
    const m = blk.match(new RegExp(id + ':"(#[0-9A-Fa-f]{6})"'));
    if (!m) throw new Error(`post-hours.mjs 的 mix 那一組裡找不到 ${id}`);
    if (m[1].toUpperCase() !== c.toUpperCase())
      throw new Error(`${id} 的顏色和門診表那張對不上：這裡 ${c}、那裡 ${m[1]}`);
  }
}

/* ⚠ 形狀對照表也**照抄門診表那一張**（哪一科用哪一顆），理由同上。
   同樣有一道守門比對。 */
const SHAPE = { general:"r1c1", perio:"r1c2", ortho:"r3c3", endo:"r3c1",
                prosth:"r2c2", surg:"r2c3", kids:"r3c2" };
{
  const hs = fs.readFileSync(path.join(ROOT, "drafts", "channels", "post-hours.mjs"), "utf8");
  const blk = hs.slice(hs.indexOf("const SHAPE = {"), hs.indexOf("const SHAPE = {") + 260);
  for (const [id, sh] of Object.entries(SHAPE))
    if (!new RegExp(id + ':"' + sh + '"').test(blk))
      throw new Error(`${id} 的形狀和門診表那張對不上（這裡 ${sh}）`);
}

/* ⚠⚠ 2026-09-07 使用者在門診表那一輪指定「植牙・假牙重建　改成　假牙重建」。
   那一條只換那張圖上的顯示名，站上一個字都沒動 —— 這一張是同一組貼文，
   所以沿用同一份對照表（不然兩張圖對同一科有兩個名字）。 */
const DISP = { "植牙・假牙重建": "假牙重建" };
const disp = n => DISP[n] || n;

const shapeSvg = sh => fs.readFileSync(
  path.join(ROOT, "brand", "shapes", `shape-${sh}.svg`), "utf8")
  .replace(/<svg([^>]*?)(width|height)="[\d.]+"/g, "<svg$1")
  .replace(/<svg/, '<svg class="mk"');
const ALLSH = ["r1c1","r1c2","r1c3","r2c1","r2c2","r2c3","r3c1","r3c2","r3c3"];
const MK = Object.fromEntries(ALLSH.map(sh => [sh, shapeSvg(sh)]));
const AR = Object.fromEntries(ALLSH.map(sh => {
  const vb = fs.readFileSync(path.join(ROOT, "brand", "shapes", `shape-${sh}.svg`), "utf8")
    .match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/);
  if (!vb) throw new Error(`shape-${sh}.svg 讀不到 viewBox`);
  return [sh, +vb[1] / +vb[2]];
}));

/* ---------- 從 index.html 讀回來（唯一的出處） ---------- */
function parse() {
  /* 七科（#topics 那排標記），順序照站上 */
  const chips = SRC.slice(SRC.indexOf('<ul class="chips">'));
  const specs = [...chips.slice(0, chips.indexOf("</ul>")).matchAll(
    /data-spec="([a-z]+)"\s*>([^<]+)</g)].map(m => ({ id: m[1], name: m[2].trim() }))
    .filter(s => s.id !== "all");

  /* 九位醫師（#doctors） */
  const a0 = SRC.indexOf('<div class="docs">');
  const a1 = SRC.indexOf('data-for="doctors"');
  const docs = SRC.slice(a0, a1).split("<article").slice(1).map(a => {
    const strip = a.replace(/<!--[\s\S]*?-->/g, "");
    const spec = (strip.match(/data-spec="([a-z]+)"/) || [])[1];
    const name = (strip.match(/<h3>([^<]*)</) || [])[1];
    const role = (strip.match(/doc-role">([^<]*)</) || [])[1];
    const sk = [...((strip.match(/class="skills">([\s\S]*?)<\/dd>/) || [])[1] || "")
      .matchAll(/<span class="sk" data-spec="([a-z]+)">([^<]+)</g)]
      .map(m => ({ spec: m[1], text: m[2] }));
    return { spec, name, role, sk };
  });

  /* 窄帶那三格的數字（醫師人數／部定專科種數）—— 不要在這裡重數一次 */
  const band = SRC.slice(SRC.indexOf('<ul class="stats">'));
  const stats = [...band.slice(0, band.indexOf("</ul>")).matchAll(
    /<b>(\d+)<small>([^<]+)<\/small><\/b><span>([^<]+)</g)]
    .map(m => ({ n: +m[1], unit: m[2], label: m[3] }));

  if (specs.length !== 7) throw new Error(`科別讀到 ${specs.length} 個，應該是 7`);
  if (docs.length !== 9)  throw new Error(`醫師讀到 ${docs.length} 位，應該是 9`);
  const known = new Set(specs.map(s => s.id));
  for (const d of docs) {
    if (!d.name || !d.role) throw new Error(`醫師卡少了姓名或藥丸：${JSON.stringify(d)}`);
    if (!known.has(d.spec)) throw new Error(`醫師 ${d.name} 的科別不認識：${d.spec}`);
    if (!d.sk.length) throw new Error(`醫師 ${d.name} 讀不到專長`);
    for (const s of d.sk) if (!known.has(s.spec))
      throw new Error(`${d.name} 的專長「${s.text}」科別不認識：${s.spec}`);
  }
  const nDoc = stats.find(s => s.label.includes("醫師"));
  const nSpe = stats.find(s => s.label.includes("部定專科"));
  if (!nDoc || !nSpe) throw new Error("窄帶那三格讀不到「醫師駐診」或「部定專科」");
  /* ⚠ 這一道是資料一致性，不是版面：窄帶寫幾位，這張圖就有幾張醫師卡 */
  if (nDoc.n !== docs.length)
    throw new Error(`窄帶寫 ${nDoc.n} 位醫師，但 #doctors 有 ${docs.length} 張卡`);
  return { specs, docs, nDoc, nSpe };
}
const D = parse();

/* 每一科底下有誰（Ⓓ 用）。順序照站上醫師卡的順序，不重新排 */
const bySpec = D.specs.map(sp => ({ ...sp, docs: D.docs.filter(d => d.spec === sp.id) }));

/* ⚠⚠ 二十三項專長：照**專長自己的 data-spec** 分群，不是照那位醫師的科別
   （李侑津醫師的專長橫跨牙周／贋復／一般，站上那三顆標記本來就各自上色）。
   同一個詞出現在好幾位醫師身上時只留一次，順序照站上第一次出現的位置。 */
const skills = (() => {
  const seen = new Map();
  for (const d of D.docs) for (const s of d.sk)
    if (!seen.has(s.text)) seen.set(s.text, s.spec);
  const out = D.specs.map(sp => ({ ...sp,
    items: [...seen].filter(([, sc]) => sc === sp.id).map(([t]) => t) }));
  const n = out.reduce((a, g) => a + g.items.length, 0);
  if (n !== seen.size) throw new Error(`專長分群掉了東西：${n} vs ${seen.size}`);
  return out;
})();

/* ---------- 版面 ----------------------------------------------------
 * ⚠⚠⚠ 這一張是給**小格 410×410** 的（README 34-4 的「小格右」），
 *   所以難題和門診表那張相反：門診表在大格會被裁成中間 537 列，這一張
 *   方進方、整張都看得到，卡住的是**整張縮到 0.380× 之後還讀不讀得出來**。
 *   （同 og-topic-card 那一輪：**在成品的尺寸上量，不要在素材的尺寸上量。**）
 *   螢幕 10px ＝ 畫布 26.3px、螢幕 12px ＝ 畫布 31.6px。
 * ⚠ 所以這裡每一種字都印出「它在 410px 上是幾 px」，低於 10 就 throw
 *   （同小格左那張地圖：**那不是壞掉檢查，是讀起來對不對**）。
 */
const W = 1080, H = 1080, PAD = 40;
const SLOT = 410, SCALE = SLOT / W;              /* 小格倍率 0.3796 */
const BIG_W = 823, BIG_H = 409;                  /* 大格（這張圖不是給它的，但要印代價） */
const BAND = Math.round(W * (BIG_H / BIG_W));    /* 大格看得到的中間 537 列 */
const FLOOR = 10;                                /* 小格上「等於沒寫」的那條線 */
const px410 = v => v * SCALE;

/* 浮水印：照小格左那一張（地圖）—— 兩個小格並排，不一樣會讀成兩件事。
   ⚠ 寬度的唯一出處是 preview/line-booked/wm-sizes.json（等重換算，
   基準寫死 r3c1 畫 660 —— 換預設形狀不可以連基準一起換，見 README 35-15）。 */
const WMSH = "r1c2", WMA = .04, WMW0 = 660, WMREF = "r3c1", WMX = 440;
const WMBX = 60 / 660, WMBY = 50 / 660;
const WMSIZES = JSON.parse(fs.readFileSync(
  path.join(ROOT, "preview", "line-booked", "wm-sizes.json"), "utf8"));
const wmWidth = sh => {
  const a = WMSIZES[sh], b = WMSIZES[WMREF];
  if (!a || !b) throw new Error(`wm-sizes.json 裡沒有 ${sh}`);
  return Math.round(WMW0 * a.w / b.w);
};
const WMW = wmWidth(WMSH), WMH = WMW / WMSIZES[WMSH].ratio;

/* ---------- 圖案：等重（同門診表那一張的 half） ----------
 * ⚠⚠ 九顆的長寬比 1.00~3.08、墨佔外框 59.6~83.2%，同寬的話細長那幾顆會輕很多。
 *   墨面積開瀏覽器現量，量到之前 INK9 是 null ＝ 不加權。 */
let INK9 = null;
const wScale = id => INK9 ? Math.pow(INK9[SHAPE.general] / INK9[SHAPE[id]], .25) : 1;
const slotOf = base => INK9
  ? Math.max(...Object.keys(SHAPE).map(id => base * wScale(id))) : base;
/* 每一顆放在一樣寬的格子裡置中 —— 一列有幾顆，起點都落在同一組刻度上
   （門診表那一輪 2026-09-07 學到的：等重之後寬度不一樣，置中就對不齊）。 */
const mark = (id, base) => {
  const w = base * wScale(id), h = w / AR[SHAPE[id]];
  return `<span class="ic" style="width:${slotOf(base).toFixed(1)}px;height:${base}px;`
    + `color:${TONE[id]}"><svg-slot style="width:${w.toFixed(1)}px;height:${h.toFixed(1)}px">`
    + `</svg-slot>${MK[SHAPE[id]]}</span>`;
};

/* ---------- 標題與頁尾 ----------
 * ⚠ 頁尾那一行是**從窄帶那三格讀回來的**（9 位醫師駐診・6 個部定專科）。
 * ⚠⚠ 紅線：這個帳號沒有專人即時回覆，圖上與詳情都不可以出現
 *   「有問題隨時問」那一類的話（第十一之三節）。
 * ⚠ 網址寫在圖上只是讓人認得出來 —— 圖上的字點不下去，可以點的那一份在「詳情」欄
 *   （同小格左那張地圖的三條停車場網址）。 */
const SITE = "fangren.net";
const FOOT = `${D.nDoc.n} ${D.nDoc.unit}${D.nDoc.label}・${D.nSpe.n} ${D.nSpe.unit}${D.nSpe.label}`;

/* 四案各自的標題。⚠ 這幾個字是我們擬的，**使用者還沒看過**，規格頁上寫著。 */
const TITLE = {
  roster: "芳仁牙醫　駐診醫師",
  who:    "芳仁牙醫　誰在看",
  skills: "芳仁牙醫　做得了什麼",
  byspec: "芳仁牙醫　哪一科有誰",
};

const css = (fsz) => `
*{box-sizing:border-box;margin:0}
html,body{width:${W}px;height:${H}px}
body{background:${CARD};color:${INK};-webkit-font-smoothing:antialiased;
     font-family:"Noto Sans TC","WenQuanYi Zen Hei",sans-serif}
.sheet{width:${W}px;height:${H}px;position:relative;overflow:hidden;
       display:flex;flex-direction:column;padding:${PAD}px;justify-content:center}
/* 浮水印：壓在最上面、切出去一角（同小格左那張地圖 —— 那一張的地圖是不透明
   的 PNG，壓在後面會被切掉一塊；這一張沒有那個問題，但兩張並排要一樣） */
svg.wm{position:absolute;width:${WMW}px;height:${WMH.toFixed(1)}px;
       left:${(-WMX).toFixed(0)}px;top:${(-Math.round(WMH * WMBY)).toFixed(0)}px;
       color:${INK};opacity:${WMA};z-index:2;pointer-events:none}
.band{position:relative;z-index:1;display:flex;flex-direction:column;flex:1}
.hd{font-size:${fsz.title}px;font-weight:700;letter-spacing:.05em;line-height:1.4}
.rule{height:1px;background:${RULE};margin:${fsz.rule}px 0}
.body{flex:1;display:flex;flex-direction:column;justify-content:center}
.ft{display:flex;align-items:baseline;justify-content:space-between;
    font-size:${fsz.foot}px;color:${SOFT};letter-spacing:.03em;line-height:1.5}
.ft .u{color:${INK}}
.ic{flex:none;display:flex;align-items:center;justify-content:center}
svg.mk{width:100%;height:100%;display:block}
svg-slot{display:none}

/* Ⓐ 名冊：三欄三列，一格 ＝ 圖案 ＋ 姓名 ＋ 藥丸的字 */
.grid{display:grid;grid-template-columns:repeat(3,1fr);
      row-gap:${fsz.rowgap}px;column-gap:22px}
.cel{display:flex;flex-direction:column;align-items:center;text-align:center;gap:${fsz.celgap}px}
.cel .nm{font-size:${fsz.name}px;letter-spacing:.06em;line-height:1.2}
.cel .ro{font-size:${fsz.role}px;color:${SOFT};letter-spacing:.02em;line-height:1.3}

/* Ⓑ 一位一行：圖案 ＋ 姓名 ＋ 藥丸 ＋ 專長 */
.rows{display:flex;flex-direction:column}
.row{display:flex;align-items:center;gap:16px;padding:${fsz.rowpad}px 0}
.row + .row{border-top:1px solid ${RULE}}
.row .nm{font-size:${fsz.name}px;letter-spacing:.06em;flex:none;white-space:nowrap}
.row .sk{font-size:${fsz.role}px;color:${SOFT};letter-spacing:.02em;line-height:1.35}
.row .sk b{font-weight:400;color:${INK}}

/* Ⓒ 做得了什麼：專長排成一片，顏色就是科別 */
.chips{display:flex;flex-wrap:wrap;gap:${fsz.chipgap}px}
.chip{font-size:${fsz.chip}px;letter-spacing:.03em;line-height:1.2;
      border:1px solid currentColor;border-radius:9px;padding:${fsz.chippad}px 15px;
      display:flex;align-items:center;gap:9px;white-space:nowrap}

/* Ⓓ 一科一行：圖案 ＋ 科別名 ＋ 該科醫師 */
.srow{display:flex;align-items:center;gap:15px;padding:${fsz.rowpad}px 0}
.srow + .srow{border-top:1px solid ${RULE}}
.srow .sp{font-size:${fsz.name}px;letter-spacing:.04em;white-space:nowrap;
          width:${fsz.spw}px;flex:none}
.srow .who{font-size:${fsz.role}px;color:${SOFT};letter-spacing:.04em;line-height:1.35}
.srow .who b{font-weight:400;color:${INK};margin-right:14px}
`;

const WMARK = shapeSvg(WMSH).replace('class="mk"', 'class="wm"');
const shell = (tag, inner) => `<div class="sheet">${WMARK}<div class="band">
  <div class="hd">${TITLE[tag]}</div>
  <div class="rule"></div>
  <div class="body">${inner}</div>
  <div class="rule"></div>
  <div class="ft"><span>${FOOT}</span><span class="u">${SITE}</span></div>
</div></div>`;

/* ⚠ 專長要印幾項（Ⓑ）：全部印的話李侑津醫師那一行有七項、一定折行到三行，
   九行加起來就超出畫布。取前三項 —— **順序照站上，不重新挑**。 */
const NSK = 3;

const build = {
  roster: (m) => shell("roster", `<div class="grid">${D.docs.map(d =>
    `<div class="cel">${mark(d.spec, m.icon)}<div class="nm">${d.name}</div>`
    + `<div class="ro">${d.role}</div></div>`).join("")}</div>`),

  who: (m) => shell("who", `<div class="rows">${D.docs.map(d => `<div class="row">
      ${mark(d.spec, m.icon)}<div class="nm">${d.name}</div>
      <div class="sk"><b>${d.role}</b>　${d.sk.slice(0, NSK).map(s => s.text).join("・")}</div>
    </div>`).join("")}</div>`),

  skills: (m) => shell("skills", `<div class="chips">${skills.flatMap(g =>
    g.items.map(t => `<span class="chip" style="color:${TONE[g.id]}">`
      + `${mark(g.id, m.chipIcon)}<span style="color:${INK}">${t}</span></span>`)).join("")}</div>`),

  byspec: (m) => shell("byspec", `<div class="rows">${bySpec.map(sp => `<div class="srow">
      ${mark(sp.id, m.icon)}<div class="sp">${disp(sp.name)}</div>
      <div class="who">${sp.docs.map(d =>
        `<b>${d.name}</b>`).join("")}</div>
    </div>`).join("")}</div>`),
};

/* 四案各自的字級。⚠ 每一個都會被下面那道「小格上不可以小於 10px」擋一次 */
const FSZ = {
  roster: { title:46, foot:32, rule:26, name:52, role:30, icon:52,
            rowgap:44, celgap:14, chip:0, chipgap:0, chippad:0, rowpad:0, spw:0, chipIcon:0 },
  who:    { title:46, foot:32, rule:22, name:40, role:29, icon:40,
            rowgap:0, celgap:0, chip:0, chipgap:0, chippad:0, rowpad:15, spw:0, chipIcon:0 },
  skills: { title:46, foot:32, rule:26, name:0, role:0, icon:0,
            rowgap:0, celgap:0, chip:36, chipgap:16, chippad:12, rowpad:0, spw:0, chipIcon:30 },
  /* ⚠ spw 要放得下最長的那個科別名（「一般牙科・定期檢查」九個字 × 38 ＝ 356，再留一點空給右邊那一欄）——
     第一版給 260，那一行的醫師名直接壓在科別名上面**而且不報錯**
     （元素沒有溢出畫布，第①道守門抓不到）。下面第⑤道就是為這件事加的。 */
  byspec: { title:46, foot:32, rule:24, name:38, role:34, icon:40,
            rowgap:0, celgap:0, chip:0, chipgap:0, chippad:0, rowpad:16, spw:380, chipIcon:0 },
};

/* ---------- 對比度：字是要讀的、圖案是要認的 ---------- */
const lin = c => { c /= 255; return c <= .03928 ? c/12.92 : Math.pow((c+.055)/1.055, 2.4); };
const lum = h => { const n = parseInt(h.slice(1),16);
  return .2126*lin(n>>16&255) + .7152*lin(n>>8&255) + .0722*lin(n&255); };
const ratio = (a,b) => { const x=lum(a), y=lum(b); return (Math.max(x,y)+.05)/(Math.min(x,y)+.05); };
const hex2rgb = h => [1,3,5].map(i => parseInt(h.slice(i,i+2),16));
const rgb2hex = r => "#" + r.map(v => Math.max(0,Math.min(255,Math.round(v)))
  .toString(16).padStart(2,"0")).join("");
/* 浮水印壓在最上面，所以落在它下面的字與圖案要用「卡色疊上 4% 的墨」重算 */
const WMBG = rgb2hex(hex2rgb(CARD).map((v, i) => v * (1 - WMA) + hex2rgb(INK)[i] * WMA));
const CONTR = [["墨對底", ratio(INK, CARD)], ["柔墨對底", ratio(SOFT, CARD)],
               ["墨對浮水印", ratio(INK, WMBG)], ["柔墨對浮水印", ratio(SOFT, WMBG)]];
const ICON = D.specs.flatMap(s => [[`${disp(s.name)} 對底`, ratio(TONE[s.id], CARD)],
                                   [`${disp(s.name)} 對浮水印`, ratio(TONE[s.id], WMBG)]]);
{
  const bad = CONTR.filter(([, r]) => r < 4.5);
  if (bad.length) throw new Error("字過不了 AA：" + bad.map(([n,r]) => `${n} ${r.toFixed(2)}`).join("、"));
  /* 圖案是裝飾性圖形，門檻 3:1（同 iPad 那顆「往下滑」指標） */
  const b2 = ICON.filter(([, r]) => r < 3);
  if (b2.length) throw new Error("圖案不到 3:1：" + b2.map(([n,r]) => `${n} ${r.toFixed(2)}`).join("、"));
}

/* ---------- 「詳情」那一欄要貼的字 ----------
 * ⚠ 圖上的網址點不下去，可以點的在這裡（同小格左那張地圖的三條停車場網址）。
 * ⚠⚠ 七條科別網址就是站上七個著陸頁 —— 圖上放不下的由這一欄接。
 * ⚠⚠ 紅線：不可以出現「有問題隨時問」那一類的承諾。 */
const detail = `${FOOT}。\n`
  + D.specs.map(s => `${disp(s.name)}　https://fangren.net/topics/${s.id}/`).join("\n")
  + `\n醫師介紹　https://fangren.net/#doctors`;
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
for (const f of fs.readdirSync(OUT).filter(f => f.endsWith(".png"))) fs.rmSync(path.join(OUT, f));

/* 墨面積現量（九顆都量），等重要用 */
INK9 = await page.evaluate(async (list) => {
  const out = {}, S = 120;
  for (const [id, svg, ar] of list) {
    const img = new Image();
    img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(
      svg.replace(/<svg/, `<svg width="200" height="${200 / ar}"`));
    await img.decode();
    const cv = document.createElement("canvas"); cv.width = cv.height = S;
    const cx = cv.getContext("2d");
    cx.fillStyle = "#fff"; cx.fillRect(0, 0, S, S);
    const w = ar >= 1 ? S : S * ar, h = ar >= 1 ? S / ar : S;
    cx.drawImage(img, (S - w) / 2, (S - h) / 2, w, h);
    const d = cx.getImageData(0, 0, S, S).data;
    let ink = 0;
    for (let i = 0; i < d.length; i += 4) ink += (255 - (d[i] + d[i+1] + d[i+2]) / 3) / 255;
    out[id] = ink / (S / 30) ** 2;
  }
  return out;
}, ALLSH.map(sh => [sh, MK[sh].replace(/\s(width|height)="[\d.]+"/g, ""), AR[sh]]));
if (Object.values(INK9).some(v => !(v > 50)))
  throw new Error("墨面積量出來不對：" + JSON.stringify(INK9));

const CASES = [
  ["roster", "Ⓐ 九位醫師（不寫科別名）"],
  ["who",    "Ⓑ 醫師 ＋ 他在做的事"],
  ["skills", "Ⓒ 做得了什麼（二十三項專長）"],
  ["byspec", "Ⓓ 一科一行 ＋ 該科醫師"],
];
const made = [];
for (const [tag, label] of CASES) {
  const m = FSZ[tag];
  await page.setContent(`<!doctype html><meta charset="utf-8"><style>${css(m)}</style>${build[tag](m)}`);
  /* 等重的寬度是寫在 svg-slot 上的（模板裡先放一個佔位元素），這裡搬到真的 svg 上 ——
     ⚠ 直接把 style 寫進 MK 那串字會和它自己的屬性打架，形狀會靜靜地不見。 */
  await page.evaluate(() => {
    for (const s of document.querySelectorAll("svg-slot")) {
      const svg = s.parentElement.querySelector("svg.mk");
      svg.style.width = s.style.width; svg.style.height = s.style.height;
      s.remove();
    }
  });

  /* ── 守門①：溢出（浮水印是刻意切出去的，排除） ── */
  const over = await page.evaluate(() => [...document.querySelectorAll(".sheet *")]
    .filter(el => !el.closest("svg.wm"))
    .filter(el => { const r = el.getBoundingClientRect();
      return r.width && (r.right > 1080.5 || r.left < -.5 || r.bottom > 1080.5 || r.top < -.5);
    }).length);
  if (over) throw new Error(`${tag} 有 ${over} 個元素溢出畫布`);

  /* ── 守門②：⚠⚠ 不是壞掉檢查，是「讀起來對不對」──
     每一種字在小格 410px 上是幾 px。低於 10 ＝ 在那一格等於沒寫。 */
  const sizes = await page.evaluate(({ sc, floor }) => {
    const seen = new Map();
    for (const el of document.querySelectorAll(".sheet *")) {
      if (!el.childNodes.length) continue;
      const txt = [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim());
      if (!txt) continue;
      const cs = getComputedStyle(el);
      const key = el.className || el.tagName.toLowerCase();
      const px = parseFloat(cs.fontSize) * sc;
      if (!seen.has(key) || seen.get(key) > px) seen.set(key, px);
    }
    return [...seen].map(([k, v]) => ({ k, px: +v.toFixed(1), ok: v >= floor }));
  }, { sc: SCALE, floor: FLOOR });
  const tiny = sizes.filter(s => !s.ok);
  if (tiny.length) throw new Error(`${tag} 在小格 410px 上有字小於 ${FLOOR}px：`
    + tiny.map(s => `${s.k} ${s.px}px`).join("、"));

  /* ── 守門③：孤字（自己排出來的短句不算，只看會折行的那幾塊） ── */
  const orphan = await page.evaluate(() => {
    const rng = document.createRange(), out = [];
    for (const el of document.querySelectorAll(".sk,.ro,.who,.chip,.ft span")) {
      const t = el.textContent.trim();
      if (t.length < 3) continue;
      const lines = new Map();
      for (const n of el.childNodes) {
        if (n.nodeType !== 3) continue;
        for (let i = 0; i < n.textContent.length; i++) {
          if (!n.textContent[i].trim()) continue;
          rng.setStart(n, i); rng.setEnd(n, i + 1);
          const r = rng.getBoundingClientRect();
          const k = Math.round(r.top / 4);
          lines.set(k, (lines.get(k) || 0) + 1);
        }
      }
      const ls = [...lines.values()];
      if (ls.length > 1 && ls[ls.length - 1] === 1) out.push(t);
    }
    return out;
  });
  if (orphan.length) throw new Error(`${tag} 有孤字：${orphan.join(" / ")}`);

  /* ── 守門④：每一顆圖案都要塞得進自己的等寬格 ── */
  const clip = await page.evaluate(() => [...document.querySelectorAll(".ic")].filter(el => {
    const g = el.querySelector("svg").getBoundingClientRect(), b = el.getBoundingClientRect();
    return g.width > b.width + .5 || g.height > b.height + .5;
  }).length);
  if (clip) throw new Error(`${tag} 有 ${clip} 顆圖案比它自己的格子大`);

  /* ── 守門⑤：固定寬度的欄位撐破了沒 ──
     ⚠⚠ Ⓓ 的科別名欄是寫死寬度的（`nowrap`），字比它長的時候**不會換行、
     也不會溢出畫布，只會靜靜地壓在隔壁那一欄的字上面** —— 第①道守門抓不到，
     第一版就是這樣把「一般牙科・定期檢查」和「李柄輝」疊在一起。 */
  /* ⚠⚠⚠ 這裡**不可以用 scrollWidth** —— 那一欄是 overflow: visible，
     Chromium 對不能捲的元素回的 scrollWidth 就是 clientWidth，
     字明明凸出去了它還是回「剛剛好」。第一版就是這樣放行的。用 Range 量墨。 */
  const burst = await page.evaluate(() => {
    const rng = document.createRange();
    return [...document.querySelectorAll(".sp")].map(el => {
      rng.selectNodeContents(el);
      const ink = rng.getBoundingClientRect().width, box = el.getBoundingClientRect().width;
      return ink > box + .5
        ? `${el.textContent.trim()}（要 ${ink.toFixed(1)}、只有 ${box.toFixed(1)}）` : null;
    }).filter(Boolean);
  });
  if (burst.length) throw new Error(`${tag} 的欄位被字撐破：${burst.join("、")}`);
  /* ⚠ 「名字有沒有對齊同一條左緣」也要量 —— 上面那一道只擋「撐破」，
     欄寬夠、但某一列的名字自己往右跑（例如被前面那一欄推開）它抓不到。 */
  const align = await page.evaluate(() => {
    const xs = [...document.querySelectorAll(".who, .sk")]
      .map(el => +el.getBoundingClientRect().left.toFixed(1));
    return xs.length ? { min: Math.min(...xs), max: Math.max(...xs) } : null;
  });
  if (align && align.max - align.min > .5)
    throw new Error(`${tag} 的名字沒有對齊同一條左緣：${align.min}~${align.max}`);

  /* ⚠ 量的是 .body 裡那一塊真正的內容，不是 .band —— .band 是 flex 撐滿的，
     每一案都會回 1000，看不出哪一案在浪費空間（＝一個永遠會過的數字）。 */
  const b = await page.evaluate(() => {
    const el = document.querySelector(".body").firstElementChild;
    const r = el.getBoundingClientRect(), body = document.querySelector(".body").getBoundingClientRect();
    return { height: r.height, room: body.height - r.height };
  });
  await page.screenshot({ path: path.join(OUT, `post-docs-${tag}.png`) });
  made.push({ tag, label, b, sizes });
}

/* ---------- 主頁那三格（裁切模擬）＋ 小格實際大小 ---------- */
const HOURS = path.join(ROOT, "preview", "line-post-hours", "fangren-hours-1080.png");
const MAP   = path.join(ROOT, "preview", "line-post-map",   "fangren-map-1080.png");
for (const f of [HOURS, MAP]) if (!fs.existsSync(f))
  throw new Error(`找不到 ${path.relative(ROOT, f)} —— 先跑那一張的產生器`);
const b64 = f => fs.readFileSync(f).toString("base64");
const cell = (f, w, h) =>
  `<div style="width:${w}px;height:${h}px;overflow:hidden;background:${RULE}">
     <img src="data:image/png;base64,${b64(f)}"
          style="width:100%;height:100%;object-fit:cover;display:block"></div>`;

const page2 = await browser.newPage({ viewport: { width: BIG_W, height: BIG_H + 4 + SLOT } });
for (const { tag } of made) {
  await page2.setContent(`<!doctype html><meta charset="utf-8"><style>*{margin:0}</style>
    <div style="width:${BIG_W}px;background:#fff;display:flex;flex-direction:column;gap:4px">
      ${cell(HOURS, BIG_W, BIG_H)}
      <div style="display:flex;gap:3px">${cell(MAP, SLOT, SLOT)}${
        cell(path.join(OUT, `post-docs-${tag}.png`), SLOT, SLOT)}</div>
    </div>`);
  await page2.waitForFunction(() => [...document.images].every(i => i.complete && i.naturalWidth));
  await page2.screenshot({ path: path.join(OUT, `profile-3up-${tag}.png`) });
}
/* ⚠⚠⚠ Ⓐ／Ⓑ／Ⓒ 三案都押在一件事上：「大格那排圖例已經教過哪一顆是哪一科」。
 *   那件事要**量**，不可以用假設的 —— 主頁的大格只看得到門診表那張的中間 537 列，
 *   而圖例排在它的最底下。做法：把門診表那張 PNG 讀進 canvas，找出七科每一顆
 *   顏色的墨落在哪幾列，再看它在不在大格的可視範圍裡。 */
const legendCut = await page.evaluate(async ({ src, tone, top, bot }) => {
  const img = new Image(); img.src = src; await img.decode();
  const cv = document.createElement("canvas");
  cv.width = img.naturalWidth; cv.height = img.naturalHeight;
  cv.getContext("2d").drawImage(img, 0, 0);
  const d = cv.getContext("2d").getImageData(0, 0, cv.width, cv.height).data;
  const hit = Object.fromEntries(Object.keys(tone).map(k => [k, { min: 1e9, max: -1 }]));
  const rgb = Object.fromEntries(Object.entries(tone).map(([k, h]) =>
    [k, [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16))]));
  for (let y = 0; y < cv.height; y++) for (let x = 0; x < cv.width; x++) {
    const i = (y * cv.width + x) * 4;
    for (const [k, c] of Object.entries(rgb))
      if (Math.abs(d[i] - c[0]) < 6 && Math.abs(d[i+1] - c[1]) < 6 && Math.abs(d[i+2] - c[2]) < 6) {
        const h2 = hit[k]; if (y < h2.min) h2.min = y; if (y > h2.max) h2.max = y;
      }
  }
  return Object.entries(hit).map(([k, v]) => ({ id: k, min: v.min, max: v.max,
    inside: v.max >= 0 && v.max <= bot && v.min >= top }));
}, { src: "data:image/png;base64," + b64(HOURS), tone: TONE,
     top: (H - BAND) / 2, bot: H - (H - BAND) / 2 });

/* ⚠⚠ 四案並排在小格的**實際大小**上 —— 上面每一個數字都是量這個尺寸得來的，
   1080 的原圖上看起來明顯的，縮到 410px 常常就沒了。 */
const page3 = await browser.newPage({
  viewport: { width: SLOT * 2 + 6, height: SLOT * 2 + 6 } });
await page3.setContent(`<!doctype html><meta charset="utf-8"><style>*{margin:0}
  body{background:${RULE};display:flex;flex-wrap:wrap;gap:6px;width:${SLOT * 2 + 6}px}</style>`
  + made.map(m => cell(path.join(OUT, `post-docs-${m.tag}.png`), SLOT, SLOT)).join(""));
await page3.waitForFunction(() => [...document.images].every(i => i.complete && i.naturalWidth));
await page3.screenshot({ path: path.join(OUT, "slot-410.png") });

await browser.close();
fs.writeFileSync(path.join(OUT, "detail.txt"), detail + "\n");

/* ---------- 讀起來對不對（每次出圖都印） ---------- */
console.log(`\n── 讀回來的資料（唯一的出處是 index.html）──`);
console.log(`  七科　${D.specs.map(s => disp(s.name)).join("　")}`);
console.log(`  九位　${D.docs.map(d => `${d.name}（${disp(D.specs.find(s => s.id === d.spec).name)}）`).join("　")}`);
console.log(`  窄帶　${FOOT}`);
console.log(`  專長　${skills.reduce((a, g) => a + g.items.length, 0)} 項　`
  + skills.map(g => `${disp(g.name)}${g.items.length}`).join("／"));

console.log(`\n── 小格 410px 上每一種字有多大（低於 ${FLOOR}px ＝ 等於沒寫）──`);
for (const m of made) {
  console.log(`  ${m.label}`);
  for (const s of m.sizes.sort((a, b) => b.px - a.px))
    console.log(`      ${String(s.k).padEnd(14)} ${s.px.toFixed(1).padStart(5)}px`
      + (s.px < 12 ? "  ⚠ 貼著地板" : ""));
}

console.log(`\n── 版面（中間那一塊有多滿）──`);
for (const m of made)
  console.log(`  ${m.label.padEnd(24, "　")}內容 ${m.b.height.toFixed(0)}px`
    + `　上下各餘 ${(m.b.room / 2).toFixed(0)}px`
    + (m.b.room / 2 > 120 ? "　⚠ 空得可以再放大" : ""));
console.log(`  ⚠ 這一張是給**小格**的（方進方、整張都看得到），`
  + `所以沒有門診表那張的安全帶問題（大格只看得到中間 ${BAND} 列）。`);

console.log(`\n── ⚠⚠⚠ 大格會把門診表那排圖例切掉多少（Ⓐ／Ⓑ／Ⓒ 押的就是這排）──`);
console.log(`  大格看得到門診表那張的 y ${(H - BAND) / 2}~${H - (H - BAND) / 2}`);
for (const g of legendCut)
  console.log(`  ${disp(D.specs.find(s => s.id === g.id).name).padEnd(10, "　")}`
    + `墨在 y ${String(g.min).padStart(4)}~${String(g.max).padStart(4)}　`
    + (g.inside ? "看得到" : "⚠ 被切掉"));
{
  const cut = legendCut.filter(g => !g.inside);
  console.log(cut.length
    ? `  ⚠⚠ 有 ${cut.length} 科的圖例在主頁上看不完整 —— 所以「圖例已經教過」`
      + `這個前提**只成立一半**，Ⓓ 那一案存在的理由就是這個。`
    : `  七科的圖例在主頁上都看得到。`);
}

console.log(`\n── 對比 ──`);
for (const [n, r] of CONTR) console.log(`  ${n.padEnd(12, "　")}${r.toFixed(2)}　（門檻 4.5）`);
console.log(`  圖案最低　${Math.min(...ICON.map(c => c[1])).toFixed(2)}`
  + `　${ICON.reduce((a, b) => a[1] < b[1] ? a : b)[0]}　（門檻 3）`);
console.log(`  浮水印 ${WMSH}　${WMW}×${WMH.toFixed(0)}px・墨 ${(WMA * 100).toFixed(0)}%`
  + `　左邊切掉 ${WMX}px　底色 ${CARD} → ${WMBG}`);

console.log(`\n── 出圖 ──`);
for (const m of made) console.log(`  post-docs-${m.tag}.png　profile-3up-${m.tag}.png`);
console.log(`  slot-410.png（四案在小格的實際大小 —— 判準是這一張）`);
console.log(`\n── 「詳情」欄要貼的字 ──\n` + detail.split("\n").map(l => "  " + l).join("\n"));

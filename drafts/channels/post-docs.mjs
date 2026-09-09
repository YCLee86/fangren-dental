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
 * ⚠⚠ 2026-09-09 使用者：「保留 E F」「有些醫師專長是不同科的　更新一下」——
 *   所以現在只剩 Ⓔ／Ⓕ 兩案（差別只有專長那一行是一串字還是一排小塊），
 *   而**每一列印誰**改成照站上 `specHit()` 的規則算（本科**或**專長命中）。
 *   前面走過的 Ⓐ~Ⓓ 與 Ⓖ／Ⓗ 全部留在 git 裡，見下面 CASES 那一段。
 *
 * ⚠ 早期試過「科別的名字整個不寫、只留圖案」（大格那排圖例已經教過哪一顆是哪一科）——
 *   那是一個賭注，而且下面 legendCut 量出來只成立一半（三科的圖例會被大格切掉）。
 *   **Ⓔ／Ⓕ 都把科別名寫著，不靠它。**
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

/* ⚠⚠⚠ 2026-09-09 使用者：「有些醫師專長是不同科的　更新一下」——他是對的，
   而且那是一個**內部矛盾**不只是漏寫：合併之後一列是「這一科的專長 ＋ 這一科的醫師」，
   可是專長照**專長自己的 data-spec** 分群、醫師卻照**那張卡自己的 data-spec** 分，
   兩邊的分法不一樣，於是同一列裡的兩樣東西對不起來 ——
   有幾列印著某一位的專長，名字那一段卻只掛另一位（下面那個面板會現場舉例）。
   ⚠⚠ **修法不要自己發明：站上的篩選本來就有答案。** index.html 那支 `specHit()`
   寫著「專科 ＝ 那一科，**或**專長裡有一個詞屬於那一科」——按下牙周那顆標記，
   站上帶出來的就是李侑津**和**李柄輝。這裡照抄同一條規則，
   所以「這張圖印誰」＝「站上按那一科會亮誰」，不可能對不起來。
   ⚠ `home` ＝ 那張卡自己的科（站上按下去專科藥丸不會退色的那一位）。
   ⚠⚠ **順序改成「本科的排前面」，那是一個新的決定不是沿用** ——
   站上一個人只出現在一張卡上，所以「誰排前面」從來沒有意義；補進跨科的之後
   它突然開始說話了（CLAUDE.md 第九節第 28 條 ⑤）。照站上的卡序排的話，
   牙周那一列會變成「李柄輝（跨）李侑津」＝ 本科的那位站在後面。
   **本科群與跨科群內部仍然照站上的卡序，沒有再重排。** */
const bySpec = D.specs.map(sp => ({ ...sp,
  docs: D.docs.filter(d => d.spec === sp.id || d.sk.some(s => s.spec === sp.id))
              .map(d => ({ ...d, home: d.spec === sp.id }))
              .sort((a, b) => (b.home ? 1 : 0) - (a.home ? 1 : 0)) }));
for (const sp of bySpec) {
  if (!sp.docs.length) throw new Error(`${sp.name} 這一列一位醫師都沒有`);
}
/* 每一位都要出現在至少一列（漏掉一位在畫面上看不出來） */
for (const d of D.docs) if (!bySpec.some(sp => sp.docs.some(x => x.name === d.name)))
  throw new Error(`${d.name} 一列都沒有出現`);

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

/* 標題。⚠ 這幾個字是我們擬的，**使用者還沒看過**，規格頁上寫著。
   ⚠⚠ **四個合併案共用同一個標題是刻意的** —— 這一輪要比的是「同一份資訊怎麼排」，
   標題跟著換的話那把尺就同時動了兩件事，挑出來的不知道是排法還是標題。 */
const MERGED = "芳仁牙醫　科別與醫師";
const TITLE = { two: MERGED, twoc: MERGED };

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
/* ⚠⚠ 第二位醫師用斜體標籤只是為了掛「左邊留一個字寬」，**不是要斜體** ——
   歸正一定要下在最外層。第一版只寫在「.mtop .who i」上，Ⓗ 那一案的
   斜體標籤包在粗體裡、選擇器命中不到，兩位醫師的第二位就被畫成斜體，
   ⚠ 而且這一段自己就踩到那個老坑：**模板字串的 CSS 註解裡不能出現反引號**
   （這條線第五次），寫了整支腳本就在十幾行外報 SyntaxError。
   **而且每一道守門都過**（尺寸、對齊、溢出都沒事），只有把圖打開看才看得到。 */
i{font-style:normal}
/* ⚠ 兩位醫師之間那一個字寬**掛在 class 上不是掛在標籤上** ——
   Ⓗ 那一案的第二位包在粗體裡，寫成後代選擇器就命中不到、兩個名字會黏在一起
   （和上面那個斜體是同一個成因，一次修兩個）。 */
.n2{margin-left:${fsz.mnamegap}px}
.ic{flex:none;display:flex;align-items:center;justify-content:center}
svg.mk{width:100%;height:100%;display:block}
svg-slot{display:none}

.rows{display:flex;flex-direction:column}

/* ---------- Ⓔ／Ⓕ：Ⓒ ＋ Ⓓ 合併（一科一列，科別／專長／醫師三件都在） ----------
   ⚠ 兩案的資料一模一樣，差別只有專長那一行是「一串字」還是「一排小塊」。 */
.mrow{padding:${fsz.mpad}px 0}
.mrow + .mrow{border-top:1px solid ${RULE}}
.mtop{display:flex;align-items:center;gap:${fsz.mgap}px}
.mtop .sp{font-size:${fsz.name}px;letter-spacing:.04em;white-space:nowrap;flex:1}
/* 醫師：墨、不折行。⚠ 兩位以上的時候中間留一個字寬，不要用頓號 ——
   那一排在站上是好幾張獨立的卡，不是一個並列的詞。 */
.mtop .who{font-size:${fsz.role}px;letter-spacing:.06em;white-space:nowrap;flex:none}
/* ⚠⚠ 跨科的那幾位（本科不是這一科、只是專長裡有這一科的詞）用柔墨 ——
   照抄站上的做法：按下某一科，**專科藥丸 ≠ 那一科的就退成白底**（站上那個 tag-off）。
   ⚠ 這是一把尺（另一格全部同一階），**不要自己決定**。 */
.mtop .who .xd{color:${SOFT}}

/* 專長那一行：縮排對齊科別名的起點（圖案寬 ＋ 間距），柔墨 */
.msk{font-size:${fsz.sk}px;color:${SOFT};letter-spacing:.02em;line-height:1.4;
     margin-top:${fsz.msktop}px}
.mind{padding-left:var(--ind)}
/* Ⓕ 專長做成描邊小塊（＝ Ⓒ 那一套縮小版） */
.mchips{display:flex;flex-wrap:wrap;gap:${fsz.mchipgap}px;margin-top:${fsz.msktop}px}
.mchip{font-size:${fsz.sk}px;letter-spacing:.03em;line-height:1.2;white-space:nowrap;
       border:1px solid currentColor;border-radius:7px;padding:${fsz.mchippad}px 11px}
`;

const WMARK = shapeSvg(WMSH).replace('class="mk"', 'class="wm"');
const shell = (tag, inner) => `<div class="sheet">${WMARK}<div class="band">
  <div class="hd">${TITLE[tag]}</div>
  <div class="rule"></div>
  <div class="body">${inner}</div>
  <div class="rule"></div>
  <div class="ft"><span>${FOOT}</span><span class="u">${SITE}</span></div>
</div></div>`;

/* ⚠⚠ 合併之後**每一科的專長全部印**（不像 Ⓑ 那樣只取前三項）——
   Ⓑ 是「一位醫師一行」、最多的那位有七項會折三行；這裡是「一科一行」，
   最多的一科只有五項（一行放得下）。**不要順手沿用那個 slice。** */
const skOf = (id) => (skills.find(g => g.id === id) || { items: [] }).items;
/* 醫師之間留一個字寬，不用頓號 —— 站上那是好幾張獨立的卡，不是並列的詞。
   ⚠ `dim` ＝ 跨科的那幾位用柔墨（＝站上 `tag-off` 的意思），`flat` ＝ 全部同一階。 */
const docsOf = (sp, v) => sp.docs.map((d, i) => {
  const cls = [i ? "n2" : "", v === "dim" && !d.home ? "xd" : ""].filter(Boolean).join(" ");
  return cls ? `<i class="${cls}">${d.name}</i>` : d.name;
}).join("");

const build = {
  /* Ⓔ 兩行：科別＋醫師一行，專長縮排到第二行 */
  two: (m, v) => shell("two", `<div class="rows" style="--ind:${ind(m)}px">${bySpec.map(sp =>
    `<div class="mrow"><div class="mtop">${mark(sp.id, m.icon)}`
    + `<div class="sp">${disp(sp.name)}</div><div class="who">${docsOf(sp, v)}</div></div>`
    + `<div class="msk mind">${skOf(sp.id).join("・")}</div></div>`).join("")}</div>`),

  /* Ⓕ 同上，專長換成描邊小塊 */
  twoc: (m, v) => shell("twoc", `<div class="rows" style="--ind:${ind(m)}px">${bySpec.map(sp =>
    `<div class="mrow"><div class="mtop">${mark(sp.id, m.icon)}`
    + `<div class="sp">${disp(sp.name)}</div><div class="who">${docsOf(sp, v)}</div></div>`
    + `<div class="mchips mind" style="color:${TONE[sp.id]}">`
    + skOf(sp.id).map(t => `<span class="mchip">${t}</span>`).join("")
    + `</div></div>`).join("")}</div>`),
};
/* 第二行要縮排多少 ＝ 圖案那一格的寬 ＋ 它和科別名之間的間距（等寬格，所以算得出來） */
const ind = (m) => Math.round(slotOf(m.icon) + m.mgap);

/* 各案的字級。⚠ 每一個都會被下面那道「小格上不可以小於 10px」擋一次 */
const BASE = { title:46, foot:32, rule:24, name:0, role:0, icon:0, sk:0, mpad:0,
               mgap:15, mnamegap:16, msktop:0, mchipgap:0, mchippad:0 };
const FSZ = {
  /* ⚠⚠ 兩案的字級刻意完全相同（科別 36／醫師 31／專長 29）——
     這一輪比的是排法，字級跟著動的話那把尺就不乾淨了。 */
  two:  { ...BASE, name:36, role:31, sk:29, icon:38, mpad:12, msktop:5 },
  /* ⚠ Ⓕ 的列距（mpad 12 → 7）與間隙比 Ⓔ 緊，那不是漏改成一致 ——
     描邊小塊自己就比一行字高 12px，七列加起來 84px，不收就超出畫布。
     **它是被小塊的高度逼出來的，也正是這一案要付的代價。** */
  twoc: { ...BASE, name:36, role:31, sk:29, icon:38, mpad:7, msktop:6,
          mchipgap:10, mchippad:4 },
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

/* ⚠⚠⚠ 2026-09-09 使用者：「保留 E F」—— 所以 Ⓖ（三欄一列）與 Ⓗ（醫師和專長同一行）
   拿掉了，前一輪的 Ⓐ／Ⓑ 與兩張父案 Ⓒ／Ⓓ 也一起收乾淨。
   **每一案都留在 git 裡**：`git show d01e961 -- drafts/channels/post-docs.mjs`
   （Ⓐ／Ⓑ 更早，在 `ae10fa2`）—— 要回頭比就從那裡取，不要重畫。
   ⚠ 剩下的那把尺是**跨科的醫師要不要分深淺**（同一份資料，只有顏色不一樣）。 */
const CASES = [
  ["two",  "dim",  "Ⓔ 兩行（建議）"],
  ["twoc", "dim",  "Ⓕ 兩行・專長做成小塊"],
  ["two",  "flat", "Ⓔ2 兩行・醫師不分深淺"],
  ["twoc", "flat", "Ⓕ2 小塊・醫師不分深淺"],
];
const fileOf = (tag, v) => `post-docs-${tag}${v === "dim" ? "" : "-" + v}`;
const made = [];
for (const [tag, v, label] of CASES) {
  const m = FSZ[tag];
  await page.setContent(`<!doctype html><meta charset="utf-8"><style>${css(m)}</style>${build[tag](m, v)}`);
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
  /* ⚠⚠ 「對齊哪一邊」要跟著版面走，不可以一律量左緣 —— Ⓔ／Ⓕ 的醫師名是
     **靠右**的（flex 行尾），量左緣一定會有落差、那是對的不是錯的。第一版寫死量
     左緣，四個合併案全部誤報。**通則：守門要跟著這一版的版面走，不要跨案照抄。** */
  const align = await page.evaluate(() => {
    const edge = (sel, side) => {
      const xs = [...document.querySelectorAll(sel)]
        .map(el => +el.getBoundingClientRect()[side].toFixed(1));
      return xs.length > 1 ? Math.max(...xs) - Math.min(...xs) : 0;
    };
    return {
      whoR: edge(".mtop .who", "right"),   /* 醫師那一段靠右 */
      skL:  edge(".mind", "left"),         /* 縮排的那一行 */
    };
  });
  for (const [k, v] of Object.entries(align))
    if (v > .5) throw new Error(`${tag} 的 ${k} 沒有對齊同一條線：差 ${v.toFixed(1)}px`);

  /* ── ⚠⚠ 「有幾段專長被折行」也要是一個數字 ──
     跨科的醫師補進來之後，專長那一行沒有變、但第一行變長了；折行是這兩案
     可以接受的行為、不是壞掉，**但要印出來，不能只靠打開圖看**
     （CLAUDE.md 第九節第 28 條 ④：壞掉檢查擋不住醜）。 */
  const wrapped = await page.evaluate(() => {
    const rng = document.createRange();
    let n = 0, max = 1;
    for (const el of document.querySelectorAll(".msk, .mchips")) {
      const tops = new Set();
      for (const node of el.querySelectorAll("*").length && el.className.includes("mchips")
        ? el.children : [el]) {
        if (el.className.includes("mchips")) { tops.add(Math.round(node.getBoundingClientRect().top / 4)); continue; }
        for (const t of [...node.childNodes].filter(x => x.nodeType === 3 || x.nodeName !== "#text")) {
          const tn = t.nodeType === 3 ? t : t.firstChild;
          if (!tn || !tn.textContent) continue;
          for (let i = 0; i < tn.textContent.length; i++) {
            if (!tn.textContent[i].trim()) continue;
            rng.setStart(tn, i); rng.setEnd(tn, i + 1);
            tops.add(Math.round(rng.getBoundingClientRect().top / 4));
          }
        }
      }
      if (tops.size > 1) n++;
      max = Math.max(max, tops.size);
    }
    return { n, max };
  });

  /* ⚠ 量的是 .body 裡那一塊真正的內容，不是 .band —— .band 是 flex 撐滿的，
     每一案都會回 1000，看不出哪一案在浪費空間（＝一個永遠會過的數字）。 */
  const b = await page.evaluate(() => {
    const el = document.querySelector(".body").firstElementChild;
    const r = el.getBoundingClientRect(), body = document.querySelector(".body").getBoundingClientRect();
    return { height: r.height, room: body.height - r.height };
  });
  const file = fileOf(tag, v);
  await page.screenshot({ path: path.join(OUT, `${file}.png`) });
  made.push({ tag, v, file, label, b, sizes, wrapped });
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

/* ⚠ 主頁三格只做**建議的那兩案**（Ⓔ／Ⓕ）—— Ⓔ2／Ⓕ2 只有醫師的深淺不一樣，
   縮到 410px 之後三格那張看不出差別，每一案都做等於多兩張沒有人會開的圖。 */
const page2 = await browser.newPage({ viewport: { width: BIG_W, height: BIG_H + 4 + SLOT } });
for (const { file } of made.filter(m => m.v === "dim")) {
  await page2.setContent(`<!doctype html><meta charset="utf-8"><style>*{margin:0}</style>
    <div style="width:${BIG_W}px;background:#fff;display:flex;flex-direction:column;gap:4px">
      ${cell(HOURS, BIG_W, BIG_H)}
      <div style="display:flex;gap:3px">${cell(MAP, SLOT, SLOT)}${
        cell(path.join(OUT, `${file}.png`), SLOT, SLOT)}</div>
    </div>`);
  await page2.waitForFunction(() => [...document.images].every(i => i.complete && i.naturalWidth));
  await page2.screenshot({ path: path.join(OUT, `profile-3up-${file.replace("post-docs-", "")}.png`) });
}
/* ⚠⚠⚠ 「科別的名字整個不寫、只留圖案」那個做法押在一件事上：
 *   「大格那排圖例已經教過哪一顆是哪一科」（Ⓐ~Ⓒ 那幾案就是這樣做的）。
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

/* ⚠⚠ 四格並排在小格的**實際大小**上 —— 上面每一個數字都是量這個尺寸得來的，
   1080 的原圖上看起來明顯的，縮到 410px 常常就沒了。 */
/* ⚠ 高度要跟著格數算，不要寫死 —— 案數一改，寫死的高度會留下一大塊空白，
   而長寬比對得上實檔、守門抓不到（同 post-hours 那條 NCUT）。 */
const rows = Math.ceil(made.length / 2);
const page3 = await browser.newPage({
  viewport: { width: SLOT * 2 + 6, height: SLOT * rows + 6 * (rows - 1) } });
await page3.setContent(`<!doctype html><meta charset="utf-8"><style>*{margin:0}
  body{background:${RULE};display:flex;flex-wrap:wrap;gap:6px;width:${SLOT * 2 + 6}px}</style>`
  + made.map(m => cell(path.join(OUT, `${m.file}.png`), SLOT, SLOT)).join(""));
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

/* ⚠⚠⚠ 這一段是 2026-09-09 那一輪的重點：**每一列印誰**。
   規則 ＝ 站上 `specHit()`（本科 **或** 專長命中），所以「這張圖印誰」
   ＝「站上按那一科會亮誰」。跨科的那幾位用（跨）標出來，一眼看得到差別。 */
console.log(`\n── 每一科印誰（＝站上按那顆標記會亮起來的那幾位）──`);
for (const sp of bySpec) {
  const cross = sp.docs.filter(d => !d.home);
  console.log(`  ${disp(sp.name).padEnd(11, "　")}`
    + sp.docs.map(d => d.home ? d.name : `${d.name}（跨）`).join("　")
    + (cross.length ? `　←　跨科 ${cross.length} 位` : ""));
}
{
  const n = bySpec.reduce((a, sp) => a + sp.docs.filter(d => !d.home).length, 0);
  const eg = bySpec.find(sp => sp.docs.some(d => !d.home));
  console.log(`  ⚠ 補進來的跨科出現 ${n} 次 —— 改動前那 ${n} 次不見，`
    + `所以有幾列的專長和名字對不起來`
    + `（例：${disp(eg.name)}那一列印著 ${eg.docs.find(d => !d.home).name} 的專長，`
    + `名字卻只掛 ${eg.docs.find(d => d.home).name}）。`);
}

console.log(`\n── 小格 410px 上每一種字有多大（低於 ${FLOOR}px ＝ 等於沒寫）──`);
for (const m of made) {
  console.log(`  ${m.label}`);
  for (const s of m.sizes.sort((a, b) => b.px - a.px))
    console.log(`      ${String(s.k).padEnd(14)} ${s.px.toFixed(1).padStart(5)}px`
      + (s.px < 12 ? "  ⚠ 貼著地板" : ""));
}

console.log(`\n── 版面（中間那一塊有多滿・專長有沒有被折行）──`);
for (const m of made)
  console.log(`  ${m.label.padEnd(24, "　")}內容 ${m.b.height.toFixed(0)}px`
    + `　上下各餘 ${(m.b.room / 2).toFixed(0)}px`
    + `　折行 ${m.wrapped.n}/7 科（最多 ${m.wrapped.max} 行）`
    + (m.b.room / 2 > 120 ? "　⚠ 空得可以再放大" : ""));
console.log(`  ⚠ 這一張是給**小格**的（方進方、整張都看得到），`
  + `所以沒有門診表那張的安全帶問題（大格只看得到中間 ${BAND} 列）。`);

console.log(`\n── ⚠⚠⚠ 大格會把門診表那排圖例切掉多少（「只留圖案」那一路押的就是這排）──`);
console.log(`  大格看得到門診表那張的 y ${(H - BAND) / 2}~${H - (H - BAND) / 2}`);
for (const g of legendCut)
  console.log(`  ${disp(D.specs.find(s => s.id === g.id).name).padEnd(10, "　")}`
    + `墨在 y ${String(g.min).padStart(4)}~${String(g.max).padStart(4)}　`
    + (g.inside ? "看得到" : "⚠ 被切掉"));
{
  const cut = legendCut.filter(g => !g.inside);
  console.log(cut.length
    ? `  ⚠⚠ 有 ${cut.length} 科的圖例在主頁上看不完整 —— 所以「圖例已經教過」`
      + `這個前提**只成立一半**。Ⓔ／Ⓕ 兩案都把科別名寫著，不靠它。`
    : `  七科的圖例在主頁上都看得到。`);
}

console.log(`\n── 對比 ──`);
for (const [n, r] of CONTR) console.log(`  ${n.padEnd(12, "　")}${r.toFixed(2)}　（門檻 4.5）`);
console.log(`  圖案最低　${Math.min(...ICON.map(c => c[1])).toFixed(2)}`
  + `　${ICON.reduce((a, b) => a[1] < b[1] ? a : b)[0]}　（門檻 3）`);
console.log(`  浮水印 ${WMSH}　${WMW}×${WMH.toFixed(0)}px・墨 ${(WMA * 100).toFixed(0)}%`
  + `　左邊切掉 ${WMX}px　底色 ${CARD} → ${WMBG}`);

console.log(`\n── 出圖 ──`);
for (const m of made) console.log(`  ${m.file}.png`
  + (m.v === "dim" ? `　profile-3up-${m.file.replace("post-docs-", "")}.png` : ""));
console.log(`  slot-410.png（四格在小格的實際大小 —— 判準是這一張）`);
console.log(`\n── 「詳情」欄要貼的字 ──\n` + detail.split("\n").map(l => "  " + l).join("\n"));

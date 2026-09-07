/* 「衛教資訊」那一格的 Flex carousel（2026-08-28，第三輪）
 *
 * 結構：**一張圖看完 ＋ 想深入就點過去**。一格一個真實的問題，
 * hero 是診所自己的紙本懶人包（裁成橫的，見 handout-crop.mjs），
 * 底下兩顆：「看大圖」開原圖、「讀文章」到站上那一篇。
 * 圖負責當下就懂，文章負責讀得下去，兩邊不搶。
 *
 * ⚠⚠ 現在線上那一格是**廠商的預設值**（清一色植牙），其中
 *   「植牙流程 完整解析」開的 `q.1talk.co` 落到一串東京飯店的搜尋結果。
 *   這一份是要拿去換掉它的。
 *
 * ⚠ 圖還沒上線：JSON 裡寫的是**未來的網址** `https://fangren.net/assets/…`，
 *   檔案目前在 drafts/line-oa/handouts/（預覽器找不到 assets/ 就退到那裡）。
 *   真的要用之前，圖要先進 assets/ 並推上 main —— 而且授權要先確認
 *   （見 README「衛教資訊那一格：現況盤點」）。
 *
 *   node drafts/line-oa/health-carousel.mjs
 *   node drafts/line-oa/flex-preview.mjs health-carousel.json
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "../..");
const SITE = JSON.parse(fs.readFileSync(path.join(ROOT, "site.json"), "utf8")).url.replace(/\/$/, "");

/* ⚠⚠ 顏色**每一張跟著自己的紙本走，不跟科別走**（2026-08-28 使用者定的）。
   值由 handout-crop.mjs 從那圈外框取出來，寫在 handouts/colors.json，
   這裡不抄第二份。理由與那三個成因寫在 handout-crop.mjs 的檔頭。 */
const C = JSON.parse(fs.readFileSync(path.join(HERE, "handouts", "colors.json"), "utf8"));

/* 按鈕底色三案（見 button-color.mjs 的檔頭與 README 第四輪）：
     a 壓暗、飽和度不動、白字（第三輪的算法）
     b **原色一個值都不動**、字改深墨
     c 壓暗 ＋ 飽和度拉滿、白字
     e **能用白字就用白字，不能就用深墨字**（原色一律不動）—— 使用者 2026-08-28 選的
     d **原色 ＋ 白字** —— ⚠ 對比只有 1.74~2.32，遠低於 AA 的 4.5。
       這一案是使用者指名要看的，留著比較用，**不要當成可以直接上線的預設**。
   ⚠ 只影響**填色**那一顆；外框鈕的字與 ▌ 一律用 ink
     （原色壓在卡片底 #F4F4F5 上只有 1.9，當字看不見）。 */
const SCHEME = (process.argv[2] || "a").replace(/^--/, "");
/* bd ＝ 比較用：每一張出兩格（B 一格、D 一格），body 最上面多一行標記。 */
const PAIR = SCHEME === "bd";
if (!PAIR && (!"abcde".includes(SCHEME) || SCHEME.length !== 1)) throw new Error("scheme 只能是 a／b／c／d／e／bd");
const INK = "#2A2C27";
const hx = (r, g, b) => "#" + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("").toUpperCase();
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
const lm = (h) => { const c = [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255)
  .map((v) => v <= .03928 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4);
  return .2126 * c[0] + .7152 * c[1] + .0722 * c[2]; };
const RA = (a, b) => { const [x, y] = [lm(a), lm(b)].sort((m, n) => n - m); return (x + .05) / (y + .05); };
const vivid = (frame) => {
  const [h, , l] = r2h(...[1, 3, 5].map((i) => parseInt(frame.slice(i, i + 2), 16)));
  for (let L = l; L >= 0; L -= .004) { const t = hx(...h2r(h, 1, L)); if (RA(t, "#FFFFFF") >= 4.5) return t; }
  return hx(...h2r(h, 1, 0));
};
/* 填色鈕的底與字 */
/* ⚠ 有幾張的底太亮，白字撐不住 —— 那幾張在 CARDS 裡標 `fg: "ink"`，
   案 D（原色＋白字）會對它們單獨改用深墨字。使用者逐張指定的，不是算出來的。 */
const solid = (v, sc = SCHEME, fg) => sc === "b" ? [v.frame, INK]
  : sc === "c" ? [vivid(v.frame), "#FFFFFF"]
  : sc === "d" ? [v.frame, fg === "ink" ? INK : "#FFFFFF"]
  /* e：底一律用他挑的原色，字看那個底撐不撐得住白 */
  : sc === "e" ? [v.frame, RA(v.frame, "#FFFFFF") >= 4.5 ? "#FFFFFF" : INK]
  : [v.fill, "#FFFFFF"];

const CARDS = [
  { img: "perio", title: "嚴重牙周有救嗎",
    lead: "牙齒為什麼會搖、地基流失是怎麼回事；治療有哪些、能做什麼。",
    post: "/posts/perio-laser/" },
  { img: "calculus", title: "陳年牙結石清除",
    lead: "洗牙為什麼會痠、洗完為什麼覺得縫變大；牙齒會搖的話要特別治療。",
    post: "/posts/regular-checkup/" },
  { img: "caries", title: "超大蛀牙生死線",
    lead: "洞看起來不大、也不太痛，神經卻已經很近；清乾淨之後要填補、保神經，或做牙套。",
    post: "/posts/bioceramic/" },
  { img: "wisdom", title: "我的智齒該拔嗎",
    lead: "哪幾種智齒該處理、術前要看什麼、拔完要怎麼照顧。",
    post: "/posts/wisdom-tooth/" },
  { img: "aligner", fg: "ink", title: "我可以做隱形矯正嗎",
    lead: "傳統矯正器和透明牙套差在哪：材質、功能、關縫，還有戴起來的感覺。",
    post: "/posts/orthodontics/" },
  { img: "prosth", title: "假牙一體成型有啥好",
    lead: "什麼狀況需要做牙套、齒質要修掉多少；金屬、全瓷、全鋯各適合誰。",
    post: "/posts/crown-materials/" },
  { img: "implant", fg: "ink", title: "植牙眉角停看聽",
    lead: "術前要先做假牙模擬和斷層掃描；骨頭整合需要時間，植體和假牙零件都要有認證。",
    post: "/posts/missing-tooth/" },
  { img: "denture", title: "活動假牙有眉角",
    lead: "假牙做好只是開始：牙齦適應、回診調整，還有怎麼吃、怎麼洗。",
    post: "/posts/missing-tooth/" },
  { img: "whitening", fg: "ink", title: "我的牙齒不夠白",
    lead: "噴砂拋光、居家藥劑、冷光美白差在哪；做完會不會回色、會不會敏感。",
    post: null },
  { img: "xray", title: "拍片的輻射有多少",
    lead: "根尖片、全口片、斷層掃描各是多少；日常生活、搭飛機也有輻射，對照給你看。",
    post: null },
  /* ⚠⚠ 這兩張是**行政**不是衛教，group 標成 admin 之後另外成一組。
     成因是硬條件：LINE 的 carousel 最多 12 格，十二張紙本 ＋ 收尾那格就是 13。
     行政本來就比較像「診所資訊」的延伸，剛好順著這條線切。 */
  { img: "booking", title: "預約協議", group: "admin",
    lead: "分階段的療程診所會保留時段；要改期或取消，請至少兩天前告訴我們。",
    post: null },
  { img: "fees", title: "掛號與文件費用", group: "admin",
    lead: "掛號費、部分負擔、優待身分，以及診斷證明與病歷複製各是多少。",
    post: null },
];

/* 兩顆按鈕做成「可以點的 box」，不用原生 button —— 原生的放不進圖示，
   而且這一份要和 clinic-info-flex.json 那三顆長一樣（同一套外觀）。 */
const btn = (label, uri, color, { outline = false, fg = "#FFFFFF" } = {}) => ({
  type: "box", layout: "vertical",
  ...(outline
    ? { borderColor: color, borderWidth: "1px" }
    : { backgroundColor: color }),
  cornerRadius: "6px", height: "40px", justifyContent: "center",
  action: { type: "uri", label, uri },
  contents: [{
    type: "box", layout: "horizontal", justifyContent: "center", alignItems: "center", spacing: "md",
    contents: [{ type: "text", text: label, color: outline ? color : fg,
      size: "md", weight: "bold", flex: 0 }],
  }],
});

function make(c, sc, tag) {
  const { ink, hero } = C[c.img];
  const [bg, fg] = solid(C[c.img], sc, c.fg);
  const foot = [btn("看大圖", `${SITE}/assets/handout-${c.img}.jpg`, bg, { fg })];
  if (c.post) foot.push(btn("讀文章", SITE + c.post, ink, { outline: true }));
  return {
    type: "bubble", size: "mega",
    hero: {
      type: "image", url: `${SITE}/assets/handout-${c.img}-hero.jpg`,
      size: "full", aspectRatio: hero, aspectMode: "cover",
      action: { type: "uri", label: c.title, uri: `${SITE}/assets/handout-${c.img}.jpg` },
    },
    body: {
      type: "box", layout: "vertical", backgroundColor: "#F4F4F5",
      paddingAll: "16px", spacing: "md",
      contents: [
        ...(tag ? [{ type: "text", text: tag, size: "xxs", color: "#8E8E8E", weight: "bold" }] : []),
        { type: "box", layout: "baseline", spacing: "sm", contents: [
          { type: "text", text: "▌", size: "md", color: ink, flex: 0 },
          { type: "text", text: c.title, size: "lg", weight: "bold", color: "#2A2C27", flex: 0 },
        ]},
        { type: "text", text: c.lead, size: "sm", color: "#5C5F57", wrap: true },
      ],
    },
    footer: {
      type: "box", layout: "vertical", backgroundColor: "#F4F4F5",
      paddingAll: "16px", paddingTop: "0px", spacing: "sm", contents: foot,
    },
  };
}

const HEALTH = CARDS.filter((c) => c.group !== "admin");
const ADMIN = CARDS.filter((c) => c.group === "admin");

const bubbles = PAIR
  ? CARDS.flatMap((c) => [make(c, "b", "Ⓑ 原色＋深墨字"), make(c, "d", "Ⓓ 原色＋白字")])
  : HEALTH.map((c) => make(c, SCHEME));

/* 收尾那一格：站上還有另外九篇 */
const n = fs.readdirSync(path.join(ROOT, "posts")).filter((d) =>
  fs.existsSync(path.join(ROOT, "posts", d, "index.html"))).length;
/* 收尾那一格不屬於任何一張紙本，用站上一般牙科的套色。
   ⚠ 比較用的 bd 不要它 —— 那一格沒有紙本、兩案長得一樣，擺進去只是佔位置。 */
if (!PAIR) {
const html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
const GREEN = html.match(/\[data-spec=["']general["'][^{]*\{[^}]*--accent:\s*(#[0-9a-fA-F]{6})/)[1].toUpperCase();
bubbles.push({
  type: "bubble", size: "mega",
  hero: { type: "image", url: `${SITE}/assets/og-home.jpg`,
    size: "full", aspectRatio: "1200:628", aspectMode: "cover",
    action: { type: "uri", label: "到網站看看", uri: `${SITE}/#topics` } },
  body: {
    type: "box", layout: "vertical", backgroundColor: "#F4F4F5",
    paddingAll: "16px", spacing: "md",
    contents: [
      { type: "box", layout: "baseline", spacing: "sm", contents: [
        { type: "text", text: "▌", size: "md", color: GREEN, flex: 0 },
        { type: "text", text: "還有其他問題", size: "lg", weight: "bold", color: "#2A2C27", flex: 0 },
      ]},
      { type: "text", text: `站上另外還有 ${n} 篇，從刷牙、蛀牙、缺牙到矯正，一科一科分好了。`,
        size: "sm", color: "#5C5F57", wrap: true },
    ],
  },
  footer: {
    type: "box", layout: "vertical", backgroundColor: "#F4F4F5",
    paddingAll: "16px", paddingTop: "0px", spacing: "sm",
      contents: [btn("到網站看看　fangren.net", `${SITE}/#topics`, GREEN, { outline: true })],
  },
});
}

/* 一張一張看：每一格另外存一份單張的 bubble */
if (!PAIR) {
  const dir = path.join(HERE, "cards");
  fs.mkdirSync(dir, { recursive: true });
  for (const f of fs.readdirSync(dir)) fs.unlinkSync(path.join(dir, f));
  CARDS.forEach((c, i) => fs.writeFileSync(
    path.join(dir, `${String(i + 1).padStart(2, "0")}-${c.img}.json`),
    JSON.stringify(make(c, SCHEME), null, 2) + "\n"));
}

const sfx = SCHEME === "a" ? "" : "-" + SCHEME;
const out = { type: "carousel", contents: bubbles };
fs.writeFileSync(path.join(HERE, `health-carousel${sfx}.json`), JSON.stringify(out, null, 2) + "\n");
if (!PAIR) {
  const admin = { type: "carousel", contents: ADMIN.map((c) => make(c, SCHEME)) };
  fs.writeFileSync(path.join(HERE, `admin-carousel${sfx}.json`), JSON.stringify(admin, null, 2) + "\n");
  console.log(`行政 ${ADMIN.length} 格　→ admin-carousel${sfx}.json`);
}
console.log(`案 ${SCHEME.toUpperCase()}　${bubbles.length} 格　${Buffer.byteLength(JSON.stringify(out))} bytes（LINE 上限 12 格／50KB）`);
for (const c of CARDS) console.log(`  ${c.img.padEnd(10)} 框 ${C[c.img].frame} 填 ${solid(C[c.img], SCHEME, c.fg)[0]}${c.fg === "ink" ? "＋墨" : ""}  ${c.title.padEnd(11)}→ ${c.post ?? "⚠ 站上沒有對應文章"}`);

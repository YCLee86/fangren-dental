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

const CARDS = [
  { img: "perio", title: "嚴重牙周有救嗎",
    lead: "牙齒為什麼會搖、地基流失是怎麼回事；健保、水雷射、手術各能做到哪裡。",
    post: "/posts/perio-laser/" },
  { img: "wisdom", title: "我的智齒該拔嗎",
    lead: "哪幾種智齒該處理、術前要看什麼、拔完那一週會怎麼過。",
    post: "/posts/wisdom-tooth/" },
  { img: "prosth", title: "假牙一體成型有啥好",
    lead: "什麼狀況需要做牙套、齒質要修掉多少；金屬、全瓷、全鋯各適合誰。",
    post: "/posts/crown-materials/" },
  { img: "whitening", title: "我的牙齒不夠白",
    lead: "噴砂拋光、居家藥劑、冷光美白差在哪；做完會不會回色、會不會敏感。",
    post: null },
  { img: "xray", title: "拍片的輻射有多少",
    lead: "根尖片、全口片、斷層掃描各是多少；拿搭一趟飛機和日常生活來對照。",
    post: null },
  { img: "booking", title: "預約協議",
    lead: "分階段的療程診所會保留時段；要改期或取消，請至少兩天前告訴我們。",
    post: null },
  { img: "fees", title: "掛號與文件費用",
    lead: "掛號費、部分負擔、優待身分，以及診斷證明與病歷複製各是多少。",
    post: null },
];

/* 兩顆按鈕做成「可以點的 box」，不用原生 button —— 原生的放不進圖示，
   而且這一份要和 clinic-info-flex.json 那三顆長一樣（同一套外觀）。 */
const btn = (label, uri, color, { outline = false } = {}) => ({
  type: "box", layout: "vertical",
  ...(outline
    ? { borderColor: color, borderWidth: "1px" }
    : { backgroundColor: color }),
  cornerRadius: "6px", height: "40px", justifyContent: "center",
  action: { type: "uri", label, uri },
  contents: [{
    type: "box", layout: "horizontal", justifyContent: "center", alignItems: "center", spacing: "md",
    contents: [{ type: "text", text: label, color: outline ? color : "#FFFFFF",
      size: "md", weight: "bold", flex: 0 }],
  }],
});

const bubbles = CARDS.map((c) => {
  const { fill, ink, hero } = C[c.img];
  const foot = [btn("看大圖", `${SITE}/assets/handout-${c.img}.jpg`, fill)];
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
});

/* 收尾那一格：站上還有另外九篇 */
const n = fs.readdirSync(path.join(ROOT, "posts")).filter((d) =>
  fs.existsSync(path.join(ROOT, "posts", d, "index.html"))).length;
/* 收尾那一格不屬於任何一張紙本，用站上一般牙科的套色 */
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

const out = { type: "carousel", contents: bubbles };
const file = path.join(HERE, "health-carousel.json");
fs.writeFileSync(file, JSON.stringify(out, null, 2) + "\n");
console.log(`${bubbles.length} 格　${Buffer.byteLength(JSON.stringify(out))} bytes（LINE 上限 12 格／50KB）`);
for (const c of CARDS) console.log(`  ${c.img.padEnd(10)} 框 ${C[c.img].frame} 填 ${C[c.img].fill}  ${c.title.padEnd(11)}→ ${c.post ?? "⚠ 站上沒有對應文章"}`);

/* 「衛教資訊」那一格的 Flex carousel（2026-08-28）
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

/* 科別的套色從 index.html 讀回來，這裡不抄第二份（同 topics-carousel.mjs） */
const html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
const accent = {};
for (const m of html.matchAll(/--spec-([a-z]+):\s*(#[0-9a-fA-F]{6})/g)) accent[m[1]] = m[2].toUpperCase();
const ACC = (spec) => {
  const m = html.match(new RegExp(`\\[data-spec=["']${spec}["']\\][^{]*\\{[^}]*--accent:\\s*(#[0-9a-fA-F]{6})`));
  if (!m) throw new Error(`index.html 裡找不到 ${spec} 的 --accent`);
  return m[1].toUpperCase();
};

const CARDS = [
  {
    spec: "perio",
    title: "嚴重牙周有救嗎",
    lead: "牙齒為什麼會搖、地基流失是怎麼回事；健保、水雷射、手術各能做到哪裡。",
    img: "handout-perio",
    post: "/posts/perio-laser/",
    postLabel: "讀文章",
  },
  {
    spec: "surg",
    title: "我的智齒該拔嗎",
    lead: "哪幾種智齒該處理、術前要看什麼、拔完那一週會怎麼過。",
    img: "handout-wisdom",
    post: "/posts/wisdom-tooth/",
    postLabel: "讀文章",
  },
  {
    spec: "endo",
    title: "拍片的輻射有多少",
    lead: "根尖片、全口片、斷層掃描各是多少；拿搭一趟飛機和日常生活來對照。",
    img: "handout-xray",
    post: null,          // ⚠ 站上還沒有對應的文章 —— 這一格只有「看大圖」
    postLabel: null,
  },
];

const ICON = (n) => `${SITE}/assets/line-${n}.png`;

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
  const color = ACC(c.spec);
  const foot = [btn("看大圖", `${SITE}/assets/${c.img}.jpg`, color)];
  if (c.post) foot.push(btn(c.postLabel, SITE + c.post, color, { outline: true }));
  return {
    type: "bubble", size: "mega",
    hero: {
      type: "image", url: `${SITE}/assets/${c.img}-hero.jpg`,
      size: "full", aspectRatio: "1077:564", aspectMode: "cover",
      action: { type: "uri", label: c.title, uri: `${SITE}/assets/${c.img}.jpg` },
    },
    body: {
      type: "box", layout: "vertical", backgroundColor: "#F4F4F5",
      paddingAll: "16px", spacing: "md",
      contents: [
        { type: "box", layout: "baseline", spacing: "sm", contents: [
          { type: "text", text: "▌", size: "md", color, flex: 0 },
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
const GREEN = ACC("general");
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
for (const c of CARDS) console.log(`  ${c.spec.padEnd(7)} ${ACC(c.spec)}  ${c.title}　→ ${c.post ?? "⚠ 站上沒有對應文章"}`);

/* 「診療項目」那一格 → 七科的 Flex Carousel（2026-08-27）
 *
 * ⚠⚠ **每一格的內容都是從站上讀出來的，這一份不抄第二份**（同 CLAUDE.md 第十節第 1 條）：
 *   ・科別順序、科別色、醫師與專長 → index.html
 *   ・那一句病人的話、科別名　　　 → tools/topic-copy.mjs
 *   ・圖　　　　　　　　　　　　　 → assets/og-topic-<spec>.jpg（著陸頁的分享圖）
 *   所以文案一改、醫師一換、顏色一調，重跑這支就跟上，不會有第二份真相。
 *
 * 那一句為什麼取 `cases[0]`（病人自己的話），不取 lead／stance／close：
 *   ・`stance` 是**回應**上面那三句處境的，單獨抽出來會失去對象
 *     （牙周的「這三種我們都常遇到」抽出來沒有人知道是哪三種）。
 *   ・`cases[0]` 自給自足，而且正是 COPY.md 第九之一節說的那件事：
 *     會來這一頁的人不是想認識科別，是**帶著一個具體的擔心來的**。
 *   ・兒牙沒有 cases，它的第一組在 `groups[0].cases[0]`。
 *
 * 按鈕的字直接用該科的 `label`（＝站上 chips 上那幾個字），不另外發明；
 * 按鈕的底用該科的 `--accent`，和站上按下 chip 之後填滿的那一階同一顆。
 *
 * 用法：node drafts/line-oa/topics-carousel.mjs   →  drafts/line-oa/topics-carousel.json
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { TOPICS } from "../../tools/topic-copy.mjs";
import { LINE_TOPIC } from "./topic-copy-line.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "../..");
const SITE = JSON.parse(fs.readFileSync(path.join(ROOT, "site.json"), "utf8")).url.replace(/\/$/, "");
const html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
const plain = (s) => String(s).replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();

/* 1. 科別順序 ＝ 首頁 chips 那一排的順序（「全部」不算） */
const chips = [...html.matchAll(/<li><a href="\/topics\/([a-z]+)\/"[^>]*data-spec="([a-z]+)"/g)]
  .map((m) => m[2]);
if (chips.length !== 7) throw new Error(`chips 只解出 ${chips.length} 科，index.html 那一排的寫法變了`);

/* 2. 科別色 ＝ [data-spec="x"] 的 --accent（站上按下 chip 填滿的那一階） */
const accent = {};
for (const m of html.matchAll(/\[data-spec="([a-z]+)"\]\s*{\s*--accent:\s*(#[0-9a-f]{6})/gi)) {
  accent[m[1]] = m[2].toUpperCase();
}

/* 3. 醫師：規則和 tools/topics.mjs 第 7 步逐字相同 ——
      「本科的醫師」或「專長命中本科」才留。 */
const docs = (html.match(/\n\s*<article class="doc"[\s\S]*?<\/article>/g) || []).map((m) => ({
  spec: /class="doc" data-spec="([a-z]+)"/.exec(m)[1],
  name: plain(/<h3>([^<]+)</.exec(m)[1]),
  skills: [...m.matchAll(/class="sk" data-spec="([a-z]+)">([^<]+)</g)].map((x) => [x[1], plain(x[2])]),
}));
if (docs.length !== 9) throw new Error(`醫師只解出 ${docs.length} 位（站上是 9 位），markup 變了`);

const bubbles = chips.map((spec) => {
  const t = TOPICS[spec];
  if (!t) throw new Error(`topic-copy.mjs 沒有 ${spec}`);

  /* 那幾句：用 LINE 自己那一份（topic-copy-line.mjs），不是著陸頁的 cases。
     ⚠ 理由寫在那一份的檔頭：**讀者不同**。加 LINE 的人多半是到診所才加的，
       對自己的問題已經有基本認識，要的是「我這個狀況該點哪一格」，
       不是著陸頁那種「讓還沒有病識感的人覺得被看見」。 */
  const lt = LINE_TOPIC[spec];
  if (!lt?.open || !Array.isArray(lt.cases) || lt.cases.length < 3 || lt.cases.length > 4) {
    throw new Error(`${spec} 在 topic-copy-line.mjs 裡缺 open，或 cases 不是三到四句`);
  }
  const lines = lt.cases;

  const keep = docs.filter((d) => d.spec === spec || d.skills.some(([s]) => s === spec));
  const names = keep.map((d) => d.name);
  const skills = [...new Set(keep.flatMap((d) => d.skills.filter(([s]) => s === spec).map(([, n]) => n)))];
  if (!names.length) throw new Error(`${spec} 一位醫師都配不到，配對規則對不上了`);
  if (!skills.length) throw new Error(`${spec} 一個專長都配不到，配對規則對不上了`);

  const img = `assets/og-topic-${spec}.jpg`;
  if (!fs.existsSync(path.join(ROOT, img))) throw new Error(`${img} 不存在`);
  const url = `${SITE}/topics/${spec}/`;
  const row = (label, value) => ({
    type: "box", layout: "baseline", spacing: "sm",
    contents: [
      { type: "text", text: label, color: "#5C5F57", size: "xs", flex: 2 },
      { type: "text", text: value, color: "#2A2C27", size: "sm", flex: 7, wrap: true },
    ],
  });

  return {
    type: "bubble", size: "mega",
    hero: {
      type: "image", url: `${SITE}/${img}`, size: "full",
      aspectRatio: "1200:628", aspectMode: "cover",
      action: { type: "uri", label: t.label, uri: url },
    },
    body: {
      type: "box", layout: "vertical", backgroundColor: "#F4F4F5",
      paddingAll: "20px", paddingTop: "16px", spacing: "md",
      contents: [
        /* 開場是七科各自的一句（不是共用標題），所以它是這張卡最重的一行 */
        { type: "text", text: plain(lt.open), color: "#2A2C27", size: "sm", weight: "bold", wrap: true },
        /* note ＝ 接在開場後面、不加粗的第二句。只有需要多講一件事的科別才有
           （目前只有一般牙科：多久來一次是看風險）。它是同一個人繼續講話，
           不是另一個欄位，所以不加標題、不加分隔線。 */
        ...[lt.note ?? []].flat().map((n) => ({
          type: "text", text: plain(n), color: "#2A2C27", size: "sm", wrap: true, margin: "sm",
        })),
        {
          type: "box", layout: "vertical", spacing: "xs", margin: "md",
          contents: lines.map((x) => ({
            type: "box", layout: "baseline", spacing: "xs",
            contents: [
              { type: "text", text: "・", color: "#5C5F57", size: "sm", flex: 0 },
              { type: "text", text: plain(x), color: "#5C5F57", size: "sm", wrap: true },
            ],
          })),
        },
        { type: "separator", color: "#CDD0D2", margin: "lg" },
        /* rows ＝ 該科自己要多列的幾列（目前只有一般牙科：風險 → 做什麼）。
           ⚠ 擺在「醫師／專長」的**上面**、同一個標籤欄寬，所以整塊讀起來是
             一串對齊的欄位，不是又多一個區塊。 */
        ...(lt.rows ?? []).map(([k, v], i) => ({ ...row(k, v), ...(i === 0 ? { margin: "md" } : {}) })),
        { ...row("醫師", names.join("、")), margin: lt.rows ? "md" : "md" },
        row("專長", skills.join("、")),
      ],
    },
    footer: {
      type: "box", layout: "vertical", backgroundColor: "#F4F4F5",
      paddingAll: "16px", paddingTop: "0px",
      contents: [
        {
          type: "button", style: "primary", color: accent[spec], height: "sm",
          action: { type: "uri", label: t.label, uri: url },
        },
      ],
    },
  };
});

const out = { type: "carousel", contents: bubbles };
const file = path.join(HERE, "topics-carousel.json");
fs.writeFileSync(file, JSON.stringify(out, null, 2) + "\n");

const size = Buffer.byteLength(JSON.stringify(out));
console.log(`${bubbles.length} 科　${size} bytes（LINE 上限：carousel 12 格、整包 50KB）`);
for (const [i, spec] of chips.entries()) {
  const b = bubbles[i];
  const bc = b.body.contents;
  const bullets = bc.find((x) => x.layout === "vertical" && x.contents?.[0]?.layout === "baseline");
  console.log(`  ${spec.padEnd(8)} ${accent[spec]}  ${bc[0].text}`);
  for (const n of [LINE_TOPIC[spec].note ?? []].flat()) console.log(`  ${" ".repeat(8)} ${n}`);
  console.log(`  ${" ".repeat(8)} ・${bullets.contents.map((x) => x.contents[1].text).join("　・")}`);
  /* ⚠ 不要用寫死的索引印 —— note 這一行是選填的，有沒有它索引就會位移
     （2026-08-27 加 note 那一輪踩過，JSON 是對的、只有這幾行 log 掛掉）。 */
  for (const r of bc.filter((x) => x.layout === "baseline")) {
    console.log(`  ${" ".repeat(8)} ${r.contents[0].text} ${r.contents[1].text}`);
  }
}

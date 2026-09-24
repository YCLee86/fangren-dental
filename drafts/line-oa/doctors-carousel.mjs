/* 「醫師介紹」那一格 → 九位醫師的 Flex Carousel（2026-09-23）
 *
 * 起因（使用者，附現況兩張截圖）：「目前 line 商家帳號的醫師介紹圖卡長這樣。
 *   重新設計、有個重點要特別注意：這個圖卡的圖片非常大、我不喜歡。所以網站上
 *   特別放了比較小的圖示 在 line 上也要沿用這個概念」
 *
 * ⚠⚠ 所以這一版**沒有 hero**。照片是 body 裡一顆 76px 的圓 ＝ 站上 `.doc[data-face]`
 *   的 `--face: 76px`。現況那張卡的插畫佔了卡片高度的六成以上，字被擠到底下。
 *
 * ⚠⚠ **每一格的內容都是從 index.html 的 #doctors 讀出來的，這一份不抄第二份**
 *   （同 topics-carousel.mjs、CLAUDE.md 第十節第 1 條）：順序、名字、藥丸、專長、
 *   資歷、學歷、照片、科別色。醫師一換、照片一加，重跑這支就跟上。
 *   ⚠ 站上沒有照片的（2026-09-24 起只剩廖立揚；林晏妤、許馨文當天補上）這裡也沒有 —— 站上是純文字卡，
 *     這裡也是純文字卡。**不要補插畫或佔位圖**（廖立揚那張是使用者當天要求移除的）。
 *
 * ⚠ 照片網址用 `-400.jpg` 不用 `.webp`：LINE 的 Flex image 只吃 JPEG／PNG。
 *
 * 用法：node drafts/line-oa/doctors-carousel.mjs   →  drafts/line-oa/doctors-carousel.json
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import crypto from "node:crypto";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "../..");
const SITE = JSON.parse(fs.readFileSync(path.join(ROOT, "site.json"), "utf8")).url.replace(/\/$/, "");
const html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
const plain = (s) => String(s).replace(/<!--[\s\S]*?-->/g, "").replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();

/* 科別色 ＝ [data-spec="x"] 的 --accent（站上藥丸的底），字是 --on-fill（七科都是白） */
const accent = {};
for (const m of html.matchAll(/\[data-spec="([a-z]+)"\]\s*{\s*--accent:\s*(#[0-9a-f]{6})/gi)) {
  accent[m[1]] = m[2].toUpperCase();
}

/* ⚠ 先切出 #doctors 那一段再找 article —— 掃整頁會掃到註解與樣式表裡的字（第九節「掃整頁等於沒掃」） */
const sec = /<section id="doctors">([\s\S]*?)<\/section>/.exec(html);
if (!sec) throw new Error("index.html 找不到 <section id=\"doctors\">");
const arts = sec[1].match(/<article class="doc"[\s\S]*?<\/article>/g) || [];
if (arts.length !== 9) throw new Error(`醫師只解出 ${arts.length} 位（站上是 9 位），markup 變了`);

const docs = arts.map((a) => {
  const body = a.replace(/<!--[\s\S]*?-->/g, "");
  const spec = /data-spec="([a-z]+)"/.exec(body)[1];
  const h3 = /<h3>([^<]+)<span class="doc-role">([^<]+)<\/span><\/h3>/.exec(body);
  if (!h3) throw new Error("醫師的 h3 寫法變了：" + body.slice(0, 120));
  const dd = (label) => {
    const m = new RegExp(`<dt>${label}</dt><dd[^>]*>([\\s\\S]*?)</dd>`).exec(body);
    if (!m) throw new Error(`${h3[1]} 沒有「${label}」`);
    return m[1];
  };
  const skills = [...dd("專長").matchAll(/class="sk"[^>]*>([^<]+)</g)].map((x) => plain(x[1]));
  const lines = (label) => dd(label).split(/<br\s*\/?>/).map(plain).filter(Boolean);
  const face = /<img src="(assets\/doctor-[a-z-]+-400\.jpg)"/.exec(body)?.[1] ?? null;
  if (/data-face/.test(body) !== !!face) throw new Error(`${h3[1]} 的 data-face 與照片對不上`);
  if (face && !fs.existsSync(path.join(ROOT, face))) throw new Error(`${face} 不存在`);
  if (!accent[spec]) throw new Error(`${spec} 找不到 --accent`);
  return { spec, name: plain(h3[1]), role: plain(h3[2]), skills, exp: lines("資歷"), edu: lines("學歷"), face };
});

const ver = (f) => crypto.createHash("sha1").update(fs.readFileSync(path.join(ROOT, f))).digest("hex").slice(0, 8);
const INK = "#2A2C27", SOFT = "#5C5F57", CARD = "#F4F4F5", RULE = "#CDD0D2";
const FACE = 76; // ＝ 站上 .doc[data-face] 的 --face

const row = (label, value, first) => ({
  type: "box", layout: "baseline", spacing: "md", ...(first ? {} : { margin: "md" }),
  contents: [
    { type: "text", text: label, color: SOFT, size: "xs", flex: 0 },
    { type: "text", text: value, color: INK, size: "sm", wrap: true },
  ],
});

const bubbles = docs.map((d) => {
  /* 名字與藥丸疊成兩行：卡片 300、內距 20 ＋ 20、頭像 76 ＋ 間距 14，剩 170px；
     「贋復假牙專科醫師」的藥丸 ＋ 名字排成一行要 185px，放不下。九張一律兩行，才整齊。 */
  const title = {
    type: "box", layout: "vertical", spacing: "sm", justifyContent: "center",
    contents: [
      { type: "text", text: d.name, color: INK, size: "lg", weight: "bold" },
      {
        type: "box", layout: "horizontal",
        contents: [{
          type: "box", layout: "vertical", flex: 0, backgroundColor: accent[d.spec], cornerRadius: "8px",
          /* ⚠ 上 4 下 0，不是上下各 2（2026-09-23 使用者：「藥丸標籤的文字好像有點跑上去了」）。
             中文字的墨在行框裡偏上：上下各 2 時量到墨離塊頂 3.3、離塊底 8.3px。
             總內距維持 4px（塊高不變），整段往下挪 2px → 5.3／6.3，
             留 1px 偏上 ＝ 站上藥丸那個使用者點過頭的抬升量（約 1.5px）。 */
          paddingStart: "8px", paddingEnd: "8px", paddingTop: "4px", paddingBottom: "0px",
          contents: [{ type: "text", text: d.role, color: "#FFFFFF", size: "xs" }],
        }],
      },
    ],
  };
  const head = d.face
    ? {
        type: "box", layout: "horizontal", spacing: "14px", alignItems: "center",
        contents: [
          {
            type: "box", layout: "vertical", flex: 0, width: `${FACE}px`, height: `${FACE}px`,
            cornerRadius: `${FACE / 2}px`,
            /* ⚠ 網址後面帶 ?v=<檔案內容雜湊>（2026-09-24 加的）：林晏妤醫師換照片時檔名沒變，
               LINE 會照網址快取圖，同一個網址就一直顯示舊照片。帶雜湊之後照片一換網址就跟著換。 */
            contents: [{ type: "image", url: `${SITE}/${d.face}?v=${ver(d.face)}`, size: "full", aspectRatio: "1:1", aspectMode: "cover" }],
          },
          title,
        ],
      }
    : title;

  return {
    type: "bubble", size: "mega",
    body: {
      type: "box", layout: "vertical", backgroundColor: CARD, paddingAll: "20px",
      contents: [
        head,
        { type: "separator", color: RULE, margin: "lg" },
        { ...row("專長", d.skills.join("、"), true), margin: "lg" },
        row("資歷", d.exp.join("\n")),
        row("學歷", d.edu.join("\n")),
      ],
    },
  };
});

const out = { type: "carousel", contents: bubbles };
fs.writeFileSync(path.join(HERE, "doctors-carousel.json"), JSON.stringify(out, null, 2) + "\n");
/* 後台「Flex Message」那一格要的是這一份：外面多包一層 altText（通知列與聊天列表顯示的字） */
const msg = JSON.stringify({ type: "flex", altText: "芳仁牙醫的九位醫師", contents: out }, null, 2) + "\n";
fs.writeFileSync(path.join(HERE, "doctors-message.json"), msg);
/* 同一份也放上規格頁（2026-09-24）：使用者要用「已連動 LINE 官方帳號的 ChatGPT」送測試訊息，
   頁面上的「複製」按鈕讀的就是這一份，ChatGPT 也可以直接讀這個網址。不要手改，重跑這支。 */
fs.mkdirSync(path.join(ROOT, "preview/line-doctors"), { recursive: true });
fs.writeFileSync(path.join(ROOT, "preview/line-doctors/doctors-message.json"), msg);
const kb = (Buffer.byteLength(JSON.stringify(out)) / 1024).toFixed(1);
if (kb > 50) throw new Error(`carousel ${kb} KB，超過 LINE 的 50 KB 上限`);
console.log(`doctors-carousel.json　${docs.length} 位（有照片 ${docs.filter((d) => d.face).length} 位）　${kb} KB`);

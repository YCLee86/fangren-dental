/* 三顆按鈕的用字比較（2026-08-28）
 *
 * 一張 mega bubble ＝ 真正的卡片寬度（300px），把每一顆的候選逐行疊起來，
 * 樣式、字級、圖示、內距全部和 clinic-info-flex.json 那三顆**一模一樣** ——
 * 理由同 CLAUDE.md 第八節「提案頁要擺真的產出檔」：另外用 CSS 做一份的話，
 * 哪天真的那一份改了，這一頁就開始說謊。
 *
 *   node drafts/line-oa/button-labels.mjs
 *   node drafts/line-oa/flex-preview.mjs button-labels.json
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SRC = JSON.parse(fs.readFileSync(path.join(HERE, "clinic-info-flex.json"), "utf8"));

/* 三顆真的按鈕當模板，只換文字 —— 顏色、圓角、高度、圖示都不在這裡重寫 */
const [MAP_BTN, TEL_BTN] = SRC.footer.contents[0].contents;
const WEB_BTN = SRC.footer.contents[1];
const clone = (o) => JSON.parse(JSON.stringify(o));

function relabel(btn, text) {
  const b = clone(btn);
  const row = b.contents[0];
  row.contents[row.contents.length - 1].text = text;
  b.action.label = text.replace(/　.*/, "");
  return b;
}

const cap = (t) => ({
  type: "text", text: t, size: "xxs", color: "#8E8E8E", margin: "lg", weight: "bold",
});

/* ⚠ 每一顆都放在**真正的半格寬**（132px）裡比，不是攤開成整列 ——
   這一輪就是靠這個擋掉兩案：「開啟 Google 地圖」溢出 26px、
   「(05)5339-369」溢出 10.5px（文字 121.5 vs 可用 111）。 */
const MAPS = ["地圖導航", "Google 地圖", "Google 導航", "導航到診所"];
const TELS = ["致電診所", "打電話", "打給診所"];
const WEBS = [
  ["Ⓒ1 現況", "診所網站　fangren.net"],
  ["Ⓒ2", "認識芳仁"],
  ["Ⓒ3", "診所介紹與文章"],
  ["Ⓒ4", "醫師、科別與文章"],
  ["Ⓒ5", "認識芳仁　fangren.net"],
];

const body = { type: "box", layout: "vertical", backgroundColor: "#F4F4F5",
  paddingAll: "16px", spacing: "sm", contents: [] };
const push = (...xs) => body.contents.push(...xs);

push({ type: "text", text: "按鈕用字比較", size: "md", weight: "bold", color: "#2C5238" });
push({ type: "text", text: "每一顆都在真正的按鈕寬度裡（半格 132px、整格 248px）",
  size: "xxs", color: "#8E8E8E", wrap: true });

/* 兩顆一列並排 ＝ 各自都在半格寬，不是要一起選 */
const half = (btn, list, tag) => {
  for (let i = 0; i < list.length; i += 2) {
    const pair = list.slice(i, i + 2);
    push(cap(pair.map((t, k) => `${tag}${i + k + 1}${i + k ? "" : " 現況"}`).join("　　　　　　　")));
    push({ type: "box", layout: "horizontal", spacing: "sm",
      contents: pair.length === 2
        ? pair.map((t) => relabel(btn, t))
        : [relabel(btn, pair[0]), { type: "box", layout: "vertical", contents: [] }] });
  }
};
half(MAP_BTN, MAPS, "Ⓐ");
half(TEL_BTN, TELS, "Ⓑ");
for (const [label, w] of WEBS) { push(cap(label)); push(relabel(WEB_BTN, w)); }

const out = { type: "bubble", size: "mega", body };
fs.writeFileSync(path.join(HERE, "button-labels.json"), JSON.stringify(out, null, 2) + "\n");
console.log(`地圖 ${MAPS.length} 案・電話 ${TELS.length} 案・網站 ${WEBS.length} 案`);

/* hero 的四種做法擺在真正的卡片裡比（2026-08-28）
 *   node drafts/line-oa/hero-variants.mjs
 *   node drafts/line-oa/flex-preview.mjs hero-variants.json
 *   node drafts/line-oa/flex-preview.mjs hero-variants-2.json
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "../..");
const SITE = JSON.parse(fs.readFileSync(path.join(ROOT, "site.json"), "utf8")).url.replace(/\/$/, "");
const html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
const ACC = (spec) => html.match(
  new RegExp(`\\[data-spec=["']${spec}["']\\][^{]*\\{[^}]*--accent:\\s*(#[0-9a-fA-F]{6})`))[1].toUpperCase();

const RATIO = { a: "1076:562", b: "1124:588", c: "1124:842", d: "1124:842" };
const TITLE = { perio: "嚴重牙周有救嗎", wisdom: "我的智齒該拔嗎", xray: "拍片的輻射有多少" };
const LEAD = {
  perio: "牙齒為什麼會搖、地基流失是怎麼回事；健保、水雷射、手術各能做到哪裡。",
  wisdom: "哪幾種智齒該處理、術前要看什麼、拔完那一週會怎麼過。",
  xray: "根尖片、全口片、斷層掃描各是多少；拿搭一趟飛機和日常生活來對照。",
};
const SPEC = { perio: "perio", wisdom: "surg", xray: "endo" };

const btn = (label, color, { outline = false } = {}) => ({
  type: "box", layout: "vertical",
  ...(outline ? { borderColor: color, borderWidth: "1px" } : { backgroundColor: color }),
  cornerRadius: "6px", height: "40px", justifyContent: "center",
  action: { type: "uri", label, uri: SITE + "/" },
  contents: [{ type: "box", layout: "horizontal", justifyContent: "center", alignItems: "center",
    contents: [{ type: "text", text: label, color: outline ? color : "#FFFFFF",
      size: "md", weight: "bold", flex: 0 }] }],
});

function bubble(sheet, tag, caption) {
  const color = ACC(SPEC[sheet]);
  return {
    type: "bubble", size: "mega",
    hero: { type: "image", url: `${SITE}/assets/handout-${sheet}-hero${tag}.jpg`,
      size: "full", aspectRatio: RATIO[tag], aspectMode: "cover",
      action: { type: "uri", label: caption, uri: SITE + "/" } },
    body: { type: "box", layout: "vertical", backgroundColor: "#F4F4F5",
      paddingAll: "16px", spacing: "md", contents: [
        { type: "text", text: caption, size: "xxs", color: "#8E8E8E", weight: "bold" },
        { type: "box", layout: "baseline", spacing: "sm", contents: [
          { type: "text", text: "▌", size: "md", color, flex: 0 },
          { type: "text", text: TITLE[sheet], size: "lg", weight: "bold", color: "#2A2C27", flex: 0 }]},
        { type: "text", text: LEAD[sheet], size: "sm", color: "#5C5F57", wrap: true }]},
    footer: { type: "box", layout: "vertical", backgroundColor: "#F4F4F5",
      paddingAll: "16px", paddingTop: "0px", spacing: "sm",
      contents: [btn("看大圖", color), btn("讀文章", color, { outline: true })] },
  };
}

const one = [
  bubble("perio", "a", "Ⓐ 現況・無框　彩色 11.4%"),
  bubble("perio", "b", "Ⓑ 留外框　彩色 18.6%"),
  bubble("perio", "c", "Ⓒ 留外框＋加高 4:3　15.6%"),
  bubble("perio", "d", "Ⓓ Ⓒ＋青綠換成牙周的套色"),
];
const two = [
  bubble("wisdom", "b", "Ⓑ 智齒・原本的青綠"),
  bubble("wisdom", "d", "Ⓓ 智齒・換成口外的紫"),
  bubble("xray", "b", "Ⓑ 輻射・原本的青綠"),
  bubble("xray", "d", "Ⓓ 輻射・換成根管的紅"),
];
for (const [f, c] of [["hero-variants.json", one], ["hero-variants-2.json", two]]) {
  fs.writeFileSync(path.join(HERE, f), JSON.stringify({ type: "carousel", contents: c }, null, 2) + "\n");
  console.log(`${f}　${c.length} 格`);
}

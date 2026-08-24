/* 兒童牙科分享圖的參考圖：從站上已上線的兩張分享卡裁出來。
 *   node drafts/og-topic-kids-refs-crop.mjs
 *
 * ⚠ 一張參考圖只准提供一件事（TEAM.md 第一節第 10 號：不標用途會被整張抄走）。
 * ⚠ 小孩那張的來源刻意是**分享卡**（一般牙科左側那對母子），不是文章 HERO ——
 *   分享卡的臉是為 250px 畫的（更簡、更大），文章 HERO 的臉細節較多。
 *   站上唯一「為分享卡尺寸畫過的小孩」就是這一個。
 * ⚠ 椅子那張裁到醫師的一條腿，那是不得已（椅子被她擋掉一角）——
 *   餵圖時要註明「只看椅子的形狀，腿與顏色不要參考」。
 * ⚠ 醫師的臉不必再裁，沿用 drafts/endo-face-ref.jpg（同一張卡、同一個人）。
 */
import fs from "node:fs";
const mod = await import("/opt/node22/lib/node_modules/playwright/index.js");
const { chromium } = mod.default ?? mod;
const chrome = "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell";

/* ⚠ 後兩張的來源是**使用者 2026-08-24 傳來的兩張手機截圖**（Google 圖片搜尋
 *   「醫師帽」與「兒童牙科 刷手服」），那兩個檔在容器的暫存區、不會留下來 ——
 *   **裁好的成品已經進版控**，所以來源不在時自動略過那兩筆，不要當成壞掉。
 *   截圖裡有搜尋介面與商品文字，一律裁掉：參考圖上有字，模型會把字畫進畫面。 */
const UP = "/root/.claude/uploads/5abb3e14-d84b-5393-bf9a-8c45f9ed7983";
const JOBS = [
  { src: "assets/og-topic-general.jpg", out: "drafts/kids-child-ref.jpg",
    box: [150, 330, 225, 265], scale: 3.2, name: "小孩・分享卡尺寸下的畫法與頭身比" },
  { src: "assets/og-topic-perio.jpg",   out: "drafts/kids-chair-ref.jpg",
    box: [35, 190, 235, 390], scale: 2.6, name: "診療椅・形狀（只看形狀）" },
  { src: `${UP}/1fe994e9-image.png`,    out: "drafts/kids-cap-ref.jpg",
    box: [140, 1075, 330, 345], scale: 3.0, name: "綁帶式手術帽・形狀與印花的尺度" },
  { src: `${UP}/edffdb56-image.png`,    out: "drafts/kids-scrub-print-ref.jpg",
    box: [805, 1210, 275, 410], scale: 3.0, name: "印花刷手服・圖案大小與疏密" },
];

const browser = await chromium.launch({ executablePath: fs.existsSync(chrome) ? chrome : undefined });
const pg = await browser.newPage();
for (const j of JOBS) {
  if (!fs.existsSync(j.src)) { console.log("略過（來源不在）", j.out); continue; }
  const uri = `data:image/jpeg;base64,${fs.readFileSync(j.src).toString("base64")}`;
  const b64 = await pg.evaluate(async ({ uri, box, s }) => {
    const img = new Image(); img.src = uri; await img.decode();
    const [x, y, w, h] = box;
    const c = document.createElement("canvas");
    c.width = Math.round(w * s); c.height = Math.round(h * s);
    const g = c.getContext("2d"); g.imageSmoothingQuality = "high";
    g.drawImage(img, x, y, w, h, 0, 0, c.width, c.height);
    return c.toDataURL("image/jpeg", 0.92).split(",")[1];
  }, { uri, box: j.box, s: j.scale });
  fs.writeFileSync(j.out, Buffer.from(b64, "base64"));
  console.log(j.out, `${Math.round(j.box[2] * j.scale)}×${Math.round(j.box[3] * j.scale)}  ${j.name}`);
}
await browser.close();

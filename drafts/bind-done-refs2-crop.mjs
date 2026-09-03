/* 第二輪的風格參考圖：從截圖裡把「只有插畫」的部分裁出來（2026-09-03）
 *   node drafts/bind-done-refs2-crop.mjs
 *   → drafts/bind-done-ref-flat-1.jpg  國泰產險・跳舞那兩個人（平面線條、誇張動作）
 *   → drafts/bind-done-ref-flat-2.jpg  國泰產險・拉行李箱那個人（小圖示與亮點的用法）
 *
 * ⚠⚠ **使用者給的第三張（Gransta 那張多格海報）刻意不裁成參考圖**（原檔留在
 *   `drafts/bind-done-src-flat-3.jpg`）：它是**放射狀拼版**，每一格的角度都不一樣，
 *   整張轉 0／90／180／270 都會有人是躺著的 —— 餵進去等於教模型畫歪掉的身體；
 *   而且格子裡還有 MENU／OK!／COFFEE 的字。**它的優點改成寫進提示詞的文字**
 *   （白圓臉＋兩顆小圓點眼＋一條小嘴、背景物件只用細灰線不上色、平塗淡彩）。
 *
 * ⚠⚠ 為什麼一定要裁：**截圖裡的中文／日文字會被生成模型抄進畫面**
 *   （ILLUSTRATION.md 第七節第 4 條那條 no-text 的反面），而三張原檔都是滿滿的字
 *   （活動標題、日期、按鈕、日文文案、店家招牌、防犯カメラ的貼紙）。
 * ⚠ 一張參考圖只准提供一件事（第十二節之二），所以連 App 的介面與時間列也一起切掉。
 * ⚠ 第三張是橫拍的照片，海報本身是直的 —— 要轉 90° 才是正的。
 */
import fs from "node:fs";
const mod = await import("/opt/node22/lib/node_modules/playwright/index.js");
const { chromium } = mod.default ?? mod;
const chrome = "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell";

const JOBS = [
  { src: "drafts/bind-done-src-flat-1.png", out: "drafts/bind-done-ref-flat-1.jpg",
    box: [140, 1000, 860, 570], rot: 0 },
  /* ⚠ 上緣要從 1245 起 —— 1180 會把「正是時候」那四個字的下半截一起裁進來 */
  { src: "drafts/bind-done-src-flat-2.png", out: "drafts/bind-done-ref-flat-2.jpg",
    box: [710, 1245, 400, 545], rot: 0 },
];

const browser = await chromium.launch({ executablePath: fs.existsSync(chrome) ? chrome : undefined });
const pg = await browser.newPage();
for (const j of JOBS) {
  const mime = j.src.endsWith(".png") ? "image/png" : "image/jpeg";
  const uri = `data:${mime};base64,${fs.readFileSync(j.src).toString("base64")}`;
  const b64 = await pg.evaluate(async ({ uri, box, rot }) => {
    const img = new Image(); img.src = uri; await img.decode();
    const [x, y, w, h] = box;
    const swap = Math.abs(rot) === 90;
    const c = document.createElement("canvas");
    c.width = swap ? h : w; c.height = swap ? w : h;
    const g = c.getContext("2d");
    g.imageSmoothingQuality = "high";
    g.fillStyle = "#fff"; g.fillRect(0, 0, c.width, c.height);
    g.translate(c.width / 2, c.height / 2);
    g.rotate(rot * Math.PI / 180);
    g.drawImage(img, x, y, w, h, -w / 2, -h / 2, w, h);
    return c.toDataURL("image/jpeg", 0.9).split(",")[1];
  }, { uri, box: j.box, rot: j.rot });   /* ⚠ 要把 uri 一起傳進去 —— 只傳 j 的話
                                              裡面的 uri 是 undefined，Chromium 回
                                              「The source image cannot be decoded」
                                              而不是「undefined」，很容易誤判成檔案壞了 */
  fs.writeFileSync(j.out, Buffer.from(b64, "base64"));
  console.log(j.out, j.box.join(",") + (j.rot ? ` rot ${j.rot}` : ""),
    (fs.statSync(j.out).size / 1024).toFixed(0) + "KB");
}
await browser.close();

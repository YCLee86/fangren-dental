/* 顯微根管線稿的參考圖：從**分享圖的原檔**裁兩塊出來，放大 3 倍。
 *   node drafts/lineart-endo-refs-crop.mjs
 *
 * ⚠ 原檔是 drafts/og-topic-endo-src.jpg（1424×708），不是 assets/og-topic-endo.jpg ——
 *   成品上緣疊著玻璃帶，帶子會被當成畫面的一部分抄進去。
 * ⚠ 倍率 3 和一般牙科那次同一把尺：那次是 1422 寬的原檔 ×3 ＝ 成品座標的 3.55 倍；
 *   這一張原檔 1424 寬 ＝ 成品（1200）的 1.187 倍，×3 ＝ 3.56 倍，一樣。
 * ⚠ 存成 JPEG 0.92 不是 PNG —— 它只是拿去餵模型的參考圖，來源本身也是 JPEG。
 * ⚠ 姿勢參考**一定要含腿與椅子**（ILLUSTRATION.md 第十二節二）——
 *   這一張的動作是「坐著、上身前傾湊到目鏡」，坐姿整個寫在下半身與那張醫師椅上。
 * ⚠ 顯微鏡單獨再裁一張：器械的形狀**不要用文字描述**（ILLUSTRATION.md 第十之一節，
 *   〈生物陶瓷〉那一輪十二次才學到的），關節臂、鏡頭、目鏡的相對長度用圖給。
 */
import fs from "node:fs";
const mod = await import("/opt/node22/lib/node_modules/playwright/index.js");
const { chromium } = mod.default ?? mod;
const chrome = "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell";

const SRC = "drafts/og-topic-endo-src.jpg";
const SCALE = 3;
const JOBS = [
  /* 醫師：頭頂上方留一點 → 鞋子與椅腳都在裡面；扶著調焦鈕的兩手也帶到 */
  { out: "drafts/lineart-endo-pose-ref.jpg",  box: [452, 52, 438, 656], name: "醫師・坐著湊到目鏡（含腿與椅子）" },
  /* 顯微鏡：關節臂從左上進來 → 鏡頭、目鏡、旁邊那盞光 */
  { out: "drafts/lineart-endo-scope-ref.jpg", box: [140, 34, 570, 300], name: "顯微鏡・關節臂與鏡頭" },
];

const browser = await chromium.launch({ executablePath: fs.existsSync(chrome) ? chrome : undefined });
const pg = await browser.newPage();
const uri = `data:image/jpeg;base64,${fs.readFileSync(SRC).toString("base64")}`;
for (const j of JOBS) {
  const b64 = await pg.evaluate(async ({ uri, box, SCALE }) => {
    const img = new Image(); img.src = uri; await img.decode();
    const [x, y, w, h] = box;
    const c = document.createElement("canvas");
    c.width = Math.round(w * SCALE); c.height = Math.round(h * SCALE);
    const g = c.getContext("2d"); g.imageSmoothingQuality = "high";
    g.drawImage(img, x, y, w, h, 0, 0, c.width, c.height);
    return c.toDataURL("image/jpeg", 0.92).split(",")[1];
  }, { uri, box: j.box, SCALE });
  fs.writeFileSync(j.out, Buffer.from(b64, "base64"));
  console.log(j.out, `${Math.round(j.box[2] * SCALE)}×${Math.round(j.box[3] * SCALE)}  ${j.name}`);
}
await browser.close();

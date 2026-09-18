#!/usr/bin/env node
/* 約診卡單一版型：產生可直接送進 LINE 的測試資料與手機預覽頁。
 *
 *   node drafts/channels/single-card-flex.mjs
 *   node drafts/channels/single-card-flex.mjs --check
 *
 * 版面只取自 /preview/line-single-card/ 第 2、3 節：
 * ・預約成功：mega、18 顆帶子、不顯示約診狀態。
 * ・約診紀錄查詢：micro、13 顆帶子、同一輪播放四個約診狀態。
 *
 * 病人姓名與日期在正式串接時仍是變數；這裡只用明確標成「測試」的假資料，
 * 不把任何患者資料放進 repo 或測試訊息。
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..", "..");
const OUT = path.join(ROOT, "preview", "line-single-card", "test");
const CHECK = process.argv.includes("--check");
const HOST = "https://fangren.net/preview/line-single-card/";
const COLORS = {
  ink: "#2A2C27",
  soft: "#5C5F57",
  blue: "#4478B5",
  green: "#3F654A",
  orange: "#C28229",
  red: "#AE4F4D",
};

const topBox = (patient, date, booked) => ({
  type: "box",
  layout: "vertical",
  paddingAll: "14px",
  contents: [
    booked
      ? {
          type: "text",
          size: "md",
          color: COLORS.ink,
          wrap: true,
          contents: [
            { type: "span", text: patient, weight: "bold" },
            { type: "span", text: "　約好囉" },
          ],
        }
      : { type: "text", text: patient, size: "md", color: COLORS.soft, wrap: true },
    {
      type: "text",
      text: date,
      size: "lg",
      weight: "bold",
      color: COLORS.ink,
      margin: "6px",
      wrap: true,
    },
  ],
});

const band = (file, ratio) => ({
  type: "image",
  url: HOST + file,
  size: "full",
  aspectRatio: ratio,
  aspectMode: "fit",
});

const bookedBubble = (patient, date) => ({
  type: "bubble",
  size: "mega",
  body: {
    type: "box",
    layout: "vertical",
    paddingAll: "0px",
    backgroundColor: "#FFFFFF",
    contents: [
      topBox(patient, date, true),
      band("band-18-set.png", "1024:60"),
      {
        type: "box",
        layout: "vertical",
        paddingAll: "14px",
        contents: [
          {
            type: "text",
            text: "異動請在2天前(不含假日)與診所聯繫",
            size: "xs",
            color: COLORS.soft,
            wrap: true,
          },
          {
            type: "text",
            text: "看診前2天會再提醒一次，記得回覆喔～",
            size: "xs",
            color: COLORS.soft,
            margin: "5px",
            wrap: true,
          },
        ],
      },
    ],
  },
});

const statusRow = (label, color) => ({
  type: "box",
  layout: "horizontal",
  alignItems: "center",
  contents: [
    { type: "text", text: "約診狀態", size: "xs", color: COLORS.soft, flex: 0 },
    {
      type: "box",
      layout: "horizontal",
      backgroundColor: color,
      cornerRadius: "8px",
      paddingTop: "5px",
      paddingBottom: "5px",
      paddingStart: "8px",
      paddingEnd: "8px",
      margin: "9px",
      flex: 0,
      contents: [
        { type: "text", text: label, size: "xs", color: "#FFFFFF", weight: "bold", flex: 0 },
      ],
    },
    { type: "filler" },
  ],
});

const queryBubble = ({ patient, date, status, color }) => ({
  type: "bubble",
  size: "micro",
  body: {
    type: "box",
    layout: "vertical",
    paddingAll: "0px",
    backgroundColor: "#FFFFFF",
    contents: [
      topBox(patient, date, false),
      band("band-13-set.png", "1024:87"),
      {
        type: "box",
        layout: "vertical",
        paddingAll: "14px",
        contents: [statusRow(status, color)],
      },
    ],
  },
});

const appointments = [
  { patient: "〔測試患者 A〕", date: "2026/09/21\n星期一 09:30", status: "已排定", color: COLORS.blue },
  { patient: "〔測試患者 B〕", date: "2026/09/22\n星期二 14:00", status: "已確認", color: COLORS.green },
  { patient: "〔測試患者 C〕", date: "2026/09/23\n星期三 16:30", status: "未回覆", color: COLORS.orange },
  { patient: "〔測試患者 D〕", date: "2026/09/24\n星期四 11:00", status: "已取消", color: COLORS.red },
];

const messages = [
  {
    type: "flex",
    altText: "預約成功通知（測試）",
    contents: bookedBubble("〔測試患者〕", "2026/09/18 星期五 11:50"),
  },
  {
    type: "flex",
    altText: "約診紀錄查詢（四種狀態測試）",
    contents: { type: "carousel", contents: appointments.map(queryBubble) },
  },
];

const esc = (s) => String(s).replace(/[&<>\"]/g, (c) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;",
}[c]));
const pill = (s, c) => `<span class="pill" style="background:${c}">${esc(s)}</span>`;
const queryCard = (a) => `<article class="card query">
  <div class="pad top"><p class="patient">${esc(a.patient)}</p><p class="date">${esc(a.date).replace("\n", "<br>")}</p></div>
  <img class="band" src="../band-13-set.png" width="1024" height="87" alt="13 顆標誌帶">
  <div class="pad bottom"><div class="status"><span>約診狀態</span>${pill(a.status, a.color)}</div></div>
</article>`;

const html = `<!doctype html>
<html lang="zh-Hant-TW"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow,noarchive">
<title>芳仁牙醫診所　約診卡測試</title>
<style>
*{box-sizing:border-box}body{margin:0;background:#111;color:#2a2c27;font-family:"Noto Sans TC","PingFang TC","Microsoft JhengHei",sans-serif}
.wrap{max-width:760px;margin:auto;padding:28px 14px 70px}.head{color:#fff;margin:0 0 24px}.head h1{font-size:21px;margin:0 0 5px}.head p{color:#aaa;font-size:14px;line-height:1.6;margin:0}
h2{color:#fff;font-size:16px;margin:28px 0 10px}.stage{overflow-x:auto;padding:4px 0 10px}.row{display:flex;gap:12px;align-items:flex-start;width:max-content}
.card{overflow:hidden;background:#fff;border-radius:10px;flex:none}.booked{width:268px}.query{width:162px}.pad{padding:14px}.patient{font-size:16px;line-height:1.35;margin:0;color:#5c5f57}.booked .patient{color:#2a2c27}.date{font-size:19px;line-height:1.35;font-weight:700;margin:6px 0 0;white-space:nowrap}.query .date{white-space:normal}.fine{font-size:13px;line-height:1.35;color:#5c5f57;margin:0}.fine+.fine{margin-top:5px}.band{display:block;width:100%;height:auto}.status{display:flex;align-items:center;gap:9px;color:#5c5f57;font-size:13px;white-space:nowrap}.pill{display:inline-block;color:#fff;font-weight:700;border-radius:8px;padding:5px 8px;line-height:1}.note{color:#aaa;font-size:13px;line-height:1.65;margin:8px 0 0}a{color:#8fc8c3}
</style></head><body><main class="wrap">
<header class="head"><h1>約診卡　實際送出前測試</h1><p>只用假資料。版面依照單一版型第 2、3 節：預約成功 18 顆；約診查詢 13 顆與四個約診狀態。</p></header>
<h2>2　預約成功通知</h2><div class="stage"><article class="card booked">
  <div class="pad top"><p class="patient"><b>〔測試患者〕</b>　約好囉</p><p class="date">2026/09/18 星期五 11:50</p></div>
  <img class="band" src="../band-18-set.png" width="1024" height="60" alt="18 顆標誌帶">
  <div class="pad bottom"><p class="fine">異動請在2天前(不含假日)與診所聯繫</p><p class="fine">看診前2天會再提醒一次，記得回覆喔～</p></div>
</article></div><p class="note">單張 mega；不顯示約診狀態。</p>
<h2>3　約診紀錄查詢</h2><div class="stage"><div class="row">${appointments.map(queryCard).join("")}</div></div>
<p class="note">輪播 micro；四張依序驗證已排定、已確認、未回覆、已取消。</p>
<p class="note"><a href="messages.json">查看這一頁所用的 LINE Flex JSON</a></p>
</main></body></html>`;

const files = new Map([
  [path.join(OUT, "index.html"), Buffer.from(html, "utf8")],
  [path.join(OUT, "messages.json"), Buffer.from(JSON.stringify(messages, null, 2) + "\n", "utf8")],
]);
const changed = [];
for (const [file, data] of files) {
  const old = fs.existsSync(file) ? fs.readFileSync(file) : null;
  if (!old || !old.equals(data)) changed.push(path.relative(ROOT, file));
  if (!CHECK) {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, data);
  }
}
if (CHECK && changed.length) {
  console.error("✗ 需要重跑 single-card-flex.mjs：" + changed.join("、"));
  process.exit(1);
}
console.log(`✓ 約診卡測試：預約成功 1 張 ＋ 約診查詢 ${appointments.length} 個狀態`);
console.log("  preview/line-single-card/test/　messages.json");

#!/usr/bin/env node
// 約診卡的定案規格與現況對照 → preview/line-card-spec/
//
// 2026-09-14 使用者：「現在這個提案頁裡有很多我們內部反覆修改的版本。給廠商看的
// 只要最後定稿和現況對照就好。把需要的內容抽出來　另外做成新的提案頁」
//
// ⚠⚠⚠ 這一頁不新寫任何東西 —— 卡片、浮水印、那張表、兩則的對照，全部從
//   build-vendor.mjs import 過來（那一支的出處又是 vendor-log.json ＋
//   booked-card.json ＋ wm-sizes.json ＋ brand/shapes/）。再抄一份的話，
//   同一份規格會有兩個真相，而且兩邊各自都很正常。
//   → 所以 build-vendor.mjs 的寫檔關在「直接執行」底下，import 它不會順手
//     把 line-vendor 那一頁也重寫一次。
//
// ⚠⚠ 這一頁「沒有」的東西是刻意的，不是漏掉：在跑的十二則、綁定完成那兩個方向、
//   還沒有答案的題目、以及每一件怎麼走到定案的過程 —— 那些留在
//   /preview/line-vendor/（我們自己在追的那一頁）。守門有一道在盯。
import { mkdirSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import {
  CSS, esc, b, D, SC, SET, WM_A, INK, cmp, CARCMP,
  revisedHtml, wmTable, nine, compare, onCard, carNine, carCompare, settledHtml,
  設節表,
} from "./build-vendor.mjs";

/* ⚠⚠⚠ 「見第 N 節」那個號碼：同一段字在兩頁上的節號不一樣，寫死的話它不會壞、
   不報錯、畫面完全正常 —— 只是指到別節去了。資料裡寫 {{節:關鍵字}}，這裡給這一頁
   自己的一份對照；沒有列進來的關鍵字（訊息／綁定／待答）一被用到就 throw ——
   那正好是「那一段字提到這一頁沒有的東西」，要嘛改寫、要嘛把那一節搬過來。
   ⚠ 一定要排在組版之前：只有呼叫之後才組出來的字串會吃到這一份。 */
設節表({ 改版: "第 1 節", 浮水印: "第 2 節", 約診狀態: "第 3-2 節" });

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, "..", "..", "preview", "line-card-spec");

/* ⚠ 廠商送來的那三張截圖住在 preview/line-vendor/，這一頁在隔壁資料夾 ——
   所以要給 revisedHtml 一個前綴。圖不複製一份（那是同一張圖的第二個副本，
   換掉其中一張的時候另一張會靜靜地留在舊版）。 */
const 改 = D.改版;
const 規 = D.浮水印.規格;

const list = (rows) => `<ul class="spec">${rows.map((t) => `<li>${b(t)}</li>`).join("\n")}</ul>`;

const html = `<!doctype html>
<html lang="zh-Hant-TW">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow, noarchive">
<title>芳仁牙醫診所　約診卡　定案規格與現況對照</title>
<style>
${CSS}
</style>
</head>
<body>
<div class="wrap">

<h1>約診卡　定案規格與現況對照</h1>
<p class="lede">芳仁牙醫診所　更新於 ${esc(D.更新日)}<br>
這一頁只有兩件事：<b>預約成功通知</b>與<b>約診紀錄查詢</b>這兩則的<b>定案規格</b>，
以及和你們 ${esc(改.日)} 那一版的<b>現況對照</b>。<br>
七則訊息的文字、圖檔網址與 Flex 規格在另一頁：<a href="/preview/line-spec/">/preview/line-spec/</a></p>

<h2 class="h2">1　現況對照<span class="t">${esc(改.日)} 你們改的那一版，逐項對我們送過去的規格</span></h2>
${revisedHtml("../line-vendor/")}

<h2 class="h2">2　浮水印<span class="t">挑哪一顆、每一顆要填什麼、畫多大、擺在哪</span></h2>

<h3 class="h3">2-1　挑哪一顆</h3>
${list(規.挑哪一顆)}

<h3 class="h3">2-2　每一顆要填什麼</h3>
${list(規.欄位)}
${wmTable}
<p class="note">${b(規.表說)}</p>

<h3 class="h3">2-3　位置與大小</h3>
<div class="now" style="margin:1.1em 0 1.4em"><b>定案</b>
<ol>${D.浮水印.定案.條.map((t) => `<li><p class="d">${b(t)}</p></li>`).join("\n")}</ol></div>
<div class="rows">
<div class="row"><p class="k">你們現在送的</p><p class="v">${b(D.浮水印.現況)}</p></div>
<div class="row"><p class="k">大小與位置</p><p class="v">${b(D.浮水印.大小與位置)}</p></div>
<div class="row"><p class="k">要換的規則</p><p class="v">${b(D.浮水印.要確認)}</p></div>
<div class="row"><p class="k">請照這樣填</p><p class="v">${b(D.浮水印.接下來問什麼)}</p></div>
</div>

<h3 class="h3">2-4　九顆的形狀與色碼</h3>
<p class="note">${b(D.浮水印.顏色.說)}<br>
每一格<b>上面是原色</b>（看得出形狀與是哪一科），<b>虛線底下是它壓在卡片上真正的樣子</b>
（淡墨 <code>${esc(INK)}</code>，濃度 ${(WM_A * 100).toFixed(0)}%）。
兩張是同一份幾何、同一個相對寬度 —— <b>九顆的寬度不一樣是刻意的</b>（按墨的面積正規化，看起來才一樣重）。</p>
${nine}

<h2 class="h2">3　卡片<span class="t">兩則各用哪一階、內距、底色、哪一格不要限制行數</span></h2>

<h3 class="h3">3-1　卡片本身</h3>
${list(規.卡片)}

<h3 class="h3">3-2　約診狀態那一列<span class="t"></span></h3>
<p class="note">${b(SET._說明)}</p>
${settledHtml()}

<h2 class="h2">4　照這個規格畫出來的樣子<span class="t">卡片畫成兩則真正的寬度</span></h2>

<h3 class="h3">4-1　預約成功通知（單張 <code>mega</code>）</h3>
<h4 class="h4">同一張卡畫${cmp.組[0].格.length}次</h4>
<p style="font-size:.88rem;color:var(--soft);margin:0">${esc(cmp._說明)}</p>
${compare}
<p class="note">${b(cmp.量)}</p>

<h4 class="h4">九顆各自畫在卡片上該有的樣子</h4>
<p style="font-size:.88rem;color:var(--soft);margin:0">${b(D.浮水印.九顆上卡)}</p>
${onCard}

<h3 class="h3">4-2　約診紀錄查詢（輪播 <code>micro</code>）</h3>
<p class="note">${b(規.輪播模擬圖畫多寬)}</p>

<h4 class="h4">同一張卡畫${CARCMP.格.length}次</h4>
<p style="font-size:.88rem;color:var(--soft);margin:0">${b(CARCMP._說明)}</p>
${carCompare}

<h4 class="h4">九顆各自畫在卡片上該有的樣子</h4>
<p style="font-size:.88rem;color:var(--soft);margin:0">${b(D.浮水印.九顆上卡輪播)}</p>
${carNine}

<p class="foot">
這一頁是靜態的，內容有更新會直接改在同一個網址上。<br>
七則訊息的文字、圖檔網址與 Flex 規格：<a href="/preview/line-spec/">/preview/line-spec/</a>
</p>

</div>
</body>
</html>
`;

mkdirSync(OUT, { recursive: true });
writeFileSync(join(OUT, "index.html"), html);
console.log(`✓ preview/line-card-spec/index.html　${(html.length / 1024).toFixed(1)}KB`);
console.log(`  現況對照：對上 ${改.對上.length}／還開著 ${改.未對上.length}／看過收掉 ${改.收掉.length}`);
console.log(`  定案：浮水印 ${D.浮水印.定案.條.length} 條・約診狀態 ${SET.條.length} 條・那一列 ${SC.藥丸.值.length} 個值`);

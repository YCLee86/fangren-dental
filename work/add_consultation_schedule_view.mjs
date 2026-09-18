import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const path = "../outputs/clinic-assistant-model/assistant_skill_matrix_v1_pilot.xlsx";
const previewDir = "./consultation-view-preview";
const wb = await SpreadsheetFile.importXlsx(await FileBlob.load(path));

const navy = "#1F5E78";
const blue = "#DDEBF7";
const paleBlue = "#EAF5FA";
const amber = "#FFF2CC";
const red = "#FCE4D6";
const line = "#B7C9D3";
const dark = "#263238";

const sheet = wb.worksheets.add("諮詢排班視圖");
sheet.showGridLines = false;
sheet.getRange("A2").values = [["諮詢組療程與排班確認視圖"]];
sheet.getRange("A2:T2").format.font = { name: "Arial", size: 14, bold: true, color: dark };
sheet.getRange("A3:T3").format.borders = { bottom: { style: "thin", color: line } };
sheet.getRange("A4").values = [["顯示療程、人力需求、支援條件、確認進度與發布狀態；不帶入個別考核、事件或面談內容。"]];
sheet.getRange("A4:T4").format.font = { name: "Arial", size: 10, italic: true, color: "#607D8B" };

const cards = [
  ["A6:B6", "A7:B7", "A8:B8", "正式需求", `=COUNTIFS($B$11:$B$40,"正式")`, `=IF(A7=0,"尚無正式需求","筆")`],
  ["D6:E6", "D7:E7", "D8:E8", "可發布", `=COUNTIFS($B$11:$B$40,"正式",$S$11:$S$40,"可發布")`, `=IF(D7=0,"尚無可發布班次","筆")`],
  ["G6:H6", "G7:H7", "G8:H8", "諮詢組待處理", `=COUNTIFS($B$11:$B$40,"正式",$T$11:$T$40,"完成三週前療程標記")+COUNTIFS($B$11:$B$40,"正式",$T$11:$T$40,"完成一週前診前確認")`, `=IF(G7=0,"無待確認項目","筆")`],
  ["J6:K6", "J7:K7", "J8:K8", "助理主管待處理", `=COUNTIFS($B$11:$B$40,"正式",$T$11:$T$40,"通知助理主管處理人力異動")+COUNTIFS($B$11:$B$40,"正式",$T$11:$T$40,"等候助理主管完成人力或資格檢核")`, `=IF(J7=0,"無待處理項目","筆")`],
  ["M6:N6", "M7:N7", "M8:N8", "已釋出人力", `=COUNTIFS($B$11:$B$40,"正式",$S$11:$S$40,"人力已釋出")`, `=IF(M7=0,"無釋出項目","筆")`],
];
for (const [titleRange, valueRange, statusRange, title, valueFormula, statusFormula] of cards) {
  sheet.mergeCells(titleRange);
  sheet.mergeCells(valueRange);
  sheet.mergeCells(statusRange);
  sheet.getRange(titleRange.split(":")[0]).values = [[title]];
  sheet.getRange(valueRange.split(":")[0]).formulas = [[valueFormula]];
  sheet.getRange(statusRange.split(":")[0]).formulas = [[statusFormula]];
  sheet.getRange(titleRange).format = { fill: navy, font: { name: "Arial", size: 10, bold: true, color: "#FFFFFF" }, horizontalAlignment: "center", verticalAlignment: "center" };
  sheet.getRange(valueRange).format = { fill: blue, font: { name: "Arial", size: 14, bold: true, color: dark }, horizontalAlignment: "center", verticalAlignment: "center", numberFormat: "#,##0" };
  sheet.getRange(statusRange).format = { fill: paleBlue, font: { name: "Arial", size: 10, color: dark }, horizontalAlignment: "center", verticalAlignment: "center" };
}

const headers = ["需求編號", "資料狀態", "日期", "開始", "結束", "醫師", "治療項目", "模式代碼", "療程確認", "主跟診需求", "支援需求名額", "短時支援人數", "支援分鐘", "三週截止日", "一週截止日", "確認流程", "異動類型", "人力處理狀態", "發布狀態", "下一步"];
sheet.getRange("A10:T40").values = [headers, ...Array.from({ length: 30 }, () => Array(20).fill(null))];
const table = sheet.tables.add("A10:T40", true, "ConsultationScheduleView");
table.style = "TableStyleMedium2";
sheet.getRange("A10:T10").format = { fill: navy, font: { name: "Arial", size: 10, bold: true, color: "#FFFFFF" }, horizontalAlignment: "center", verticalAlignment: "center", wrapText: true };
sheet.getRange("A11:T40").format.font = { name: "Arial", size: 10, color: dark };
sheet.getRange("A11:T40").format.verticalAlignment = "center";

const formulas = [];
for (let r = 11; r <= 40; r++) {
  const src = r - 4;
  formulas.push([
    `=IF('班次需求輸入'!A${src}="","",'班次需求輸入'!A${src})`,
    `=IF($A${r}="","",'班次需求輸入'!K${src})`,
    `=IF($A${r}="","",'班次需求輸入'!B${src})`,
    `=IF($A${r}="","",'班次需求輸入'!C${src})`,
    `=IF($A${r}="","",'班次需求輸入'!D${src})`,
    `=IF($A${r}="","",'班次需求輸入'!E${src})`,
    `=IF($A${r}="","",_xlfn.XLOOKUP($A${r},'班次檢核總覽'!$A$7:$A$36,'班次檢核總覽'!$F$7:$F$36,"",0))`,
    `=IF($A${r}="","",'班次需求輸入'!F${src})`,
    `=IF($A${r}="","",'班次需求輸入'!G${src})`,
    `=IF($A${r}="","",'班次需求輸入'!H${src})`,
    `=IF($A${r}="","",_xlfn.XLOOKUP($A${r},'班次檢核總覽'!$A$7:$A$36,'班次檢核總覽'!$L$7:$L$36,0,0))`,
    `=IF($A${r}="","",_xlfn.XLOOKUP($A${r},'班次檢核總覽'!$A$7:$A$36,'班次檢核總覽'!$N$7:$N$36,0,0))`,
    `=IF($A${r}="","",'班次需求輸入'!J${src})`,
    `=IF($A${r}="","",'班次需求輸入'!M${src})`,
    `=IF($A${r}="","",'班次需求輸入'!P${src})`,
    `=IF($A${r}="","",'班次需求輸入'!X${src})`,
    `=IF($A${r}="","",_xlfn.XLOOKUP($A${r},'班次需求輸入'!$A$7:$A$36,'班次需求輸入'!$T$7:$T$36,"",0))`,
    `=IF($A${r}="","",_xlfn.XLOOKUP($A${r},'班次需求輸入'!$A$7:$A$36,'班次需求輸入'!$V$7:$V$36,"",0))`,
    `=IF($A${r}="","",_xlfn.XLOOKUP($A${r},'班次檢核總覽'!$A$7:$A$36,'班次檢核總覽'!$U$7:$U$36,"",0))`,
    `=IF($A${r}="","",IF($B${r}="範例","範例，不需處理",IF($S${r}="可發布","完成",IF($S${r}="人力已釋出","確認改派或結案",IF($P${r}="待三週前標記","完成三週前療程標記",IF($P${r}="待一週前確認","完成一週前診前確認",IF(OR($P${r}="人力異動待處理",$P${r}="人力釋出待處理"),"通知助理主管處理人力異動","等候助理主管完成人力或資格檢核")))))))`,
  ]);
}
sheet.getRange("A11:T40").formulas = formulas;
sheet.getRange("C11:C40").format.numberFormat = "yyyy-mm-dd";
sheet.getRange("D11:E40").format.numberFormat = "hh:mm";
sheet.getRange("N11:O40").format.numberFormat = "yyyy-mm-dd";
sheet.getRange("J11:M40").format.numberFormat = "#,##0";
sheet.getRange("T11:T40").conditionalFormats.add("containsText", { text: "完成三週", format: { fill: amber, font: { color: "#7F6000", bold: true } } });
sheet.getRange("T11:T40").conditionalFormats.add("containsText", { text: "完成一週", format: { fill: amber, font: { color: "#7F6000", bold: true } } });
sheet.getRange("T11:T40").conditionalFormats.add("containsText", { text: "通知助理主管", format: { fill: red, font: { color: "#9C0006", bold: true } } });
sheet.getRange("T11:T40").conditionalFormats.add("containsText", { text: "等候助理主管", format: { fill: amber, font: { color: "#7F6000", bold: true } } });

const widths = [14, 14, 14, 11, 11, 18, 22, 24, 20, 16, 16, 16, 14, 14, 14, 20, 16, 18, 22, 38];
for (let i = 0; i < widths.length; i++) {
  let n = i + 1, c = "";
  while (n > 0) { n--; c = String.fromCharCode(65 + (n % 26)) + c; n = Math.floor(n / 26); }
  sheet.getRange(`${c}:${c}`).format.columnWidth = widths[i];
}
sheet.freezePanes.freezeRows(10);
sheet.freezePanes.freezeColumns(2);
sheet.tabColor = navy;

const dashboard = wb.worksheets.getItem("主管工作台");
dashboard.getRange("H12").values = [["查看諮詢組視圖並更新三週／一週確認"]];
dashboard.getRange("I12").values = [["諮詢排班視圖、班次需求輸入"]];

const overview = wb.worksheets.getItem("續作總覽");
overview.getRange("C26:D26").values = [["諮詢組視圖已建立", "只顯示療程、人力、支援、確認與發布資訊"]];

wb.recalculate();
await fs.mkdir(previewDir, { recursive: true });
const image = await wb.render({ sheetName: "諮詢排班視圖", range: "A1:T18", scale: 1.2, format: "png" });
await fs.writeFile(`${previewDir}/諮詢排班視圖.png`, new Uint8Array(await image.arrayBuffer()));
console.log((await wb.inspect({ kind: "table", range: "諮詢排班視圖!A1:T16", include: "values,formulas", tableMaxRows: 18, tableMaxCols: 22, maxChars: 18000 })).ndjson);
console.log((await wb.inspect({ kind: "match", searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!|#SPILL!|#CALC!", options: { useRegex: true, maxResults: 300 }, maxChars: 10000 })).ndjson);
const out = await SpreadsheetFile.exportXlsx(wb);
await out.save(path);
console.log(`SAVED ${path}`);

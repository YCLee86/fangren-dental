import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const path = "../outputs/clinic-assistant-model/assistant_skill_matrix_v1_pilot.xlsx";
const previewDir = "./schedule-previews";
const fontName = "Arial";
const navy = "#1F5E78";
const paleBlue = "#EAF5FA";
const amber = "#FFF2CC";
const green = "#E2F0D9";
const red = "#FCE4D6";
const line = "#B7C9D3";

function col(n) {
  let s = "";
  while (n > 0) { n--; s = String.fromCharCode(65 + (n % 26)) + s; n = Math.floor(n / 26); }
  return s;
}

function addSheet(wb, name, title, note, headers, rows, tableName, widths) {
  const s = wb.worksheets.add(name);
  const last = col(headers.length);
  s.showGridLines = false;
  s.getRange("A2").values = [[title]];
  s.getRange(`A2:${last}2`).format.font = { name: fontName, size: 14, bold: true, color: "#263238" };
  s.getRange(`A3:${last}3`).format.borders = { bottom: { style: "thin", color: line } };
  s.getRange("A4").values = [[note]];
  s.getRange(`A4:${last}4`).format.font = { name: fontName, size: 10, italic: true, color: "#607D8B" };
  s.getRange(`A6:${last}${6 + rows.length}`).values = [headers, ...rows];
  const t = s.tables.add(`A6:${last}${6 + rows.length}`, true, tableName);
  t.style = "TableStyleMedium2";
  t.showBandedRows = true;
  s.getRange(`A6:${last}6`).format = { fill: navy, font: { name: fontName, size: 10, bold: true, color: "#FFFFFF" }, horizontalAlignment: "center", verticalAlignment: "center", wrapText: true };
  s.getRange(`A7:${last}${6 + rows.length}`).format.font = { name: fontName, size: 10, color: "#263238" };
  s.getRange(`A7:${last}${6 + rows.length}`).format.verticalAlignment = "center";
  widths.forEach((width, i) => { if (width) s.getRange(`${col(i + 1)}:${col(i + 1)}`).format.columnWidth = width; });
  s.freezePanes.freezeRows(6);
  return s;
}

const wb = await SpreadsheetFile.importXlsx(await FileBlob.load(path));

const fit = wb.worksheets.getItem("排班適配試算");
fit.getRange("V6").values = [["適配查找鍵"]];
fit.getRange("V6").format = { fill: navy, font: { name: fontName, size: 10, bold: true, color: "#FFFFFF" }, horizontalAlignment: "center" };
const fitKeys = [];
for (let r = 7; r <= 188; r++) fitKeys.push([`=$A${r}&"|"&$C${r}`]);
fit.getRange("V7:V188").formulas = fitKeys;
fit.getRange("V:V").format.columnWidth = 38;

const demandRows = Array.from({ length: 30 }, () => Array(12).fill(null));
demandRows[0] = ["S001", new Date("2026-09-21"), 9 / 24, 12 / 24, "李侑津醫師", "LJT-SCALING", "一般診已確認", 1, null, null, "範例", "可改成正式班次"];
demandRows[1] = ["S002", new Date("2026-09-21"), 14 / 24, 17 / 24, "李侑津醫師", "LJT-IMPLANT", "特殊療程已確認", 1, null, null, "範例", "示範高複雜度支援"];
demandRows[2] = ["S003", new Date("2026-09-21"), 17 / 24, 17.5 / 24, "李侑津醫師", "LJT-RPD-FINAL", "特殊療程已確認", 1, null, null, "範例", "示範 30 分鐘短時支援"];
const demand = addSheet(wb, "班次需求輸入", "班次與療程需求輸入", "黃色欄位由諮詢組或助理主管填寫。前三列是範例，不代表實際班表。", ["需求編號", "日期", "開始時間", "結束時間", "醫師", "模式代碼", "療程確認", "主跟診需求人數", "固定短時支援人數", "預設支援分鐘", "資料狀態", "備註"], demandRows, "ShiftDemandInput", [14, 14, 14, 14, 18, 22, 20, 18, 20, 18, 14, 38]);
demand.getRange("A7:H36").format.fill = amber;
demand.getRange("K7:L36").format.fill = amber;
demand.getRange("B7:B36").format.numberFormat = "yyyy-mm-dd";
demand.getRange("C7:D36").format.numberFormat = "hh:mm";
const demandFormulas = [];
for (let r = 7; r <= 36; r++) demandFormulas.push([
  `=IF($F${r}="","",_xlfn.XLOOKUP($F${r},'李醫師治療模式'!$A$7:$A$19,'李醫師治療模式'!$I$7:$I$19,"模式未建立",0))`,
  `=IF($F${r}="","",_xlfn.XLOOKUP($F${r},'李醫師治療模式'!$A$7:$A$19,'李醫師治療模式'!$J$7:$J$19,"",0))`,
]);
demand.getRange("I7:J36").formulas = demandFormulas;
demand.getRange("I7:J36").format.fill = paleBlue;
demand.getRange("F7:F36").dataValidation = { rule: { type: "list", formula1: "'李醫師治療模式'!$A$7:$A$19" } };
demand.getRange("G7:G36").dataValidation = { rule: { type: "list", values: ["待確認", "一般診已確認", "特殊療程已確認", "取消"] } };
demand.getRange("K7:K36").dataValidation = { rule: { type: "list", values: ["草稿", "正式", "範例", "取消"] } };
demand.tabColor = "#F4B183";

const assignRows = Array.from({ length: 60 }, () => Array(18).fill(null));
assignRows[0] = ["C001", "S001", "1001", null, "主跟診", 0, "否", null, null, null, null, null, null, null, null, null, null, "範例"];
assignRows[1] = ["C002", "S002", "1025", null, "主跟診", 0, "否", null, null, null, null, null, null, null, null, null, null, "範例"];
assignRows[2] = ["C003", "S002", "1001", null, "完整支援", 2, "是", null, null, null, null, null, null, null, null, null, null, "範例"];
assignRows[3] = ["C004", "S003", "1004", null, "主跟診", 0, "否", null, null, null, null, null, null, null, null, null, null, "範例"];
const assign = addSheet(wb, "排班配置輸入", "班次人員配置與即時檢核", "黃色欄位由助理主管填寫。公式會帶入能力候選、正式狀態、支援需求及時段衝突。", ["配置編號", "需求編號", "員工編號", "姓名", "角色", "可用支援名額", "當班可調度", "模式代碼", "能力試算結果", "正式狀態", "角色資格檢核", "支援占用名額", "日期", "開始時間", "結束時間", "時段重疊數", "配置狀態", "備註"], assignRows, "ShiftAssignments", [14, 14, 14, 16, 16, 16, 16, 22, 22, 28, 24, 16, 14, 14, 14, 16, 24, 30]);
assign.getRange("A7:C66").format.fill = amber;
assign.getRange("E7:G66").format.fill = amber;
assign.getRange("R7:R66").format.fill = amber;
const assignFormulas = [];
for (let r = 7; r <= 66; r++) assignFormulas.push([
  `=IF($C${r}="","",_xlfn.XLOOKUP($C${r},'試行員工主檔'!$A$7:$A$20,'試行員工主檔'!$B$7:$B$20,"員工未建立",0))`,
  `=IF($B${r}="","",_xlfn.XLOOKUP($B${r},'班次需求輸入'!$A$7:$A$36,'班次需求輸入'!$F$7:$F$36,"需求未建立",0))`,
  `=IF(OR($C${r}="",$H${r}=""),"",_xlfn.XLOOKUP($C${r}&"|"&$H${r},'排班適配試算'!$V$7:$V$188,'排班適配試算'!$S$7:$S$188,"未建立",0))`,
  `=IF(OR($C${r}="",$H${r}=""),"",_xlfn.XLOOKUP($C${r}&"|"&$H${r},'排班適配試算'!$V$7:$V$188,'排班適配試算'!$U$7:$U$188,"未建立",0))`,
  `=IF($E${r}="","",IF($E${r}="主跟診",$J${r},IF($E${r}="短時支援",_xlfn.XLOOKUP($C${r},'RPD支援者候選'!$A$7:$A$20,'RPD支援者候選'!$H$7:$H$20,"未建立",0),"支援資格待建")))`,
  `=IF($E${r}<>"主跟診",0,IF($I${r}="初步可條件排",IF(_xlfn.XLOOKUP($H${r},'李醫師治療模式'!$A$7:$A$19,'李醫師治療模式'!$F$7:$F$19,"",0)="高複雜度",2,1),0)+IFNA(_xlfn.XLOOKUP($B${r},'班次需求輸入'!$A$7:$A$36,'班次需求輸入'!$I$7:$I$36,0,0),0))`,
  `=IF($B${r}="","",_xlfn.XLOOKUP($B${r},'班次需求輸入'!$A$7:$A$36,'班次需求輸入'!$B$7:$B$36,"",0))`,
  `=IF($B${r}="","",_xlfn.XLOOKUP($B${r},'班次需求輸入'!$A$7:$A$36,'班次需求輸入'!$C$7:$C$36,"",0))`,
  `=IF($B${r}="","",_xlfn.XLOOKUP($B${r},'班次需求輸入'!$A$7:$A$36,'班次需求輸入'!$D$7:$D$36,"",0))`,
  `=IF(OR($C${r}="",$M${r}="",$N${r}="",$O${r}=""),0,COUNTIFS($C$7:$C$66,$C${r},$M$7:$M$66,$M${r},$N$7:$N$66,"<"&$O${r},$O$7:$O$66,">"&$N${r})-1)`,
  `=IF($B${r}="","",IF($P${r}>0,"時段衝突",IF($E${r}="主跟診",IF(LEFT($K${r},1)="待","候選，待完成資格","已檢核"),IF(OR($E${r}="完整支援",$E${r}="技術備援"),"支援資格待建",$K${r}))))`,
]);
assign.getRange("D7:D66").formulas = assignFormulas.map(r => [r[0]]);
assign.getRange("H7:Q66").formulas = assignFormulas.map(r => r.slice(1));
assign.getRange("D7:Q66").format.fill = paleBlue;
assign.getRange("M7:M66").format.numberFormat = "yyyy-mm-dd";
assign.getRange("N7:O66").format.numberFormat = "hh:mm";
assign.getRange("B7:B66").dataValidation = { rule: { type: "list", formula1: "'班次需求輸入'!$A$7:$A$36" } };
assign.getRange("C7:C66").dataValidation = { rule: { type: "list", formula1: "'試行員工主檔'!$A$7:$A$20" } };
assign.getRange("E7:E66").dataValidation = { rule: { type: "list", values: ["主跟診", "完整支援", "技術備援", "短時支援", "流動", "第二櫃台", "學習觀摩"] } };
assign.getRange("G7:G66").dataValidation = { rule: { type: "list", values: ["是", "否"] } };
assign.getRange("Q7:Q66").conditionalFormats.add("containsText", { text: "衝突", format: { fill: red, font: { color: "#9C0006", bold: true } } });
assign.freezePanes.freezeColumns(3);
assign.tabColor = "#F4B183";

const checkRows = Array.from({ length: 30 }, (_, i) => [demandRows[i][0], ...Array(17).fill(null)]);
const check = addSheet(wb, "班次檢核總覽", "班次人力與支援檢核", "每列對應一筆需求。『通過』必須同時滿足療程確認、正式主跟診、短時支援、支援容量及無時段衝突。", ["需求編號", "日期", "開始", "結束", "模式代碼", "治療項目", "療程確認", "主跟診需求", "已配置主跟診", "試算可用主跟診", "正式可用主跟診", "支援需求名額", "可用支援名額", "短時支援需求", "已配置短時支援", "衝突配置數", "班次結果", "下一步"], checkRows, "ShiftChecks", [14, 14, 12, 12, 22, 18, 20, 16, 18, 20, 20, 18, 18, 18, 20, 16, 24, 42]);
const checkFormulas = [];
for (let r = 7; r <= 36; r++) checkFormulas.push([
  `=IF($A${r}="","",_xlfn.XLOOKUP($A${r},'班次需求輸入'!$A$7:$A$36,'班次需求輸入'!$B$7:$B$36,"",0))`,
  `=IF($A${r}="","",_xlfn.XLOOKUP($A${r},'班次需求輸入'!$A$7:$A$36,'班次需求輸入'!$C$7:$C$36,"",0))`,
  `=IF($A${r}="","",_xlfn.XLOOKUP($A${r},'班次需求輸入'!$A$7:$A$36,'班次需求輸入'!$D$7:$D$36,"",0))`,
  `=IF($A${r}="","",_xlfn.XLOOKUP($A${r},'班次需求輸入'!$A$7:$A$36,'班次需求輸入'!$F$7:$F$36,"",0))`,
  `=IF($E${r}="","",_xlfn.XLOOKUP($E${r},'李醫師治療模式'!$A$7:$A$19,'李醫師治療模式'!$D$7:$D$19,"",0))`,
  `=IF($A${r}="","",_xlfn.XLOOKUP($A${r},'班次需求輸入'!$A$7:$A$36,'班次需求輸入'!$G$7:$G$36,"",0))`,
  `=IF($A${r}="","",_xlfn.XLOOKUP($A${r},'班次需求輸入'!$A$7:$A$36,'班次需求輸入'!$H$7:$H$36,"",0))`,
  `=IF($A${r}="","",COUNTIFS('排班配置輸入'!$B$7:$B$66,$A${r},'排班配置輸入'!$E$7:$E$66,"主跟診"))`,
  `=IF($A${r}="","",COUNTIFS('排班配置輸入'!$B$7:$B$66,$A${r},'排班配置輸入'!$E$7:$E$66,"主跟診",'排班配置輸入'!$I$7:$I$66,"<>不可正式排"))`,
  `=IF($A${r}="","",COUNTIFS('排班配置輸入'!$B$7:$B$66,$A${r},'排班配置輸入'!$E$7:$E$66,"主跟診",'排班配置輸入'!$J$7:$J$66,"初步可*"))`,
  `=IF($A${r}="","",SUMIFS('排班配置輸入'!$L$7:$L$66,'排班配置輸入'!$B$7:$B$66,$A${r}))`,
  `=IF($A${r}="","",SUMIFS('排班配置輸入'!$F$7:$F$66,'排班配置輸入'!$B$7:$B$66,$A${r},'排班配置輸入'!$G$7:$G$66,"是"))`,
  `=IF($A${r}="","",_xlfn.XLOOKUP($A${r},'班次需求輸入'!$A$7:$A$36,'班次需求輸入'!$I$7:$I$36,0,0))`,
  `=IF($A${r}="","",COUNTIFS('排班配置輸入'!$B$7:$B$66,$A${r},'排班配置輸入'!$E$7:$E$66,"短時支援"))`,
  `=IF($A${r}="","",SUMIFS('排班配置輸入'!$P$7:$P$66,'排班配置輸入'!$B$7:$B$66,$A${r}))`,
  `=IF($A${r}="","",IF($G${r}="待確認","療程待確認",IF($I${r}<$H${r},"缺主跟診配置",IF($K${r}<$H${r},"正式資格未完成",IF($O${r}<$N${r},"缺短時支援",IF($M${r}<$L${r},"支援容量不足",IF($P${r}>0,"人員時段衝突","通過")))))))`,
  `=IF($Q${r}="","",IF($Q${r}="通過","可發布",IF($Q${r}="療程待確認","完成三週前療程標記",IF($Q${r}="缺主跟診配置","指定主跟診助理",IF($Q${r}="正式資格未完成","完成能力／熟悉度／規則核定",IF($Q${r}="缺短時支援","指定 RPD 短時支援者",IF($Q${r}="支援容量不足","增加可調度支援者或改派",IF($Q${r}="人員時段衝突","調整人員或時段","主管複核")))))))`,
]);
check.getRange("B7:R36").formulas = checkFormulas;
check.getRange("B7:R36").format.fill = paleBlue;
check.getRange("B7:B36").format.numberFormat = "yyyy-mm-dd";
check.getRange("C7:D36").format.numberFormat = "hh:mm";
check.getRange("Q7:Q36").conditionalFormats.add("containsText", { text: "通過", format: { fill: green, font: { color: "#375623", bold: true } } });
check.getRange("Q7:Q36").conditionalFormats.add("containsText", { text: "缺", format: { fill: red, font: { color: "#9C0006", bold: true } } });
check.getRange("Q7:Q36").conditionalFormats.add("containsText", { text: "未完成", format: { fill: amber, font: { color: "#7F6000", bold: true } } });
check.freezePanes.freezeColumns(1);
check.tabColor = navy;

const overview = wb.worksheets.getItem("續作總覽");
overview.getRange("C13:D13").values = [["排班流程已建立", "182 組能力候選已接入需求、配置、支援容量與班次檢核"]];

wb.recalculate();
await fs.mkdir(previewDir, { recursive: true });
for (const [name, range] of [["班次需求輸入", "A1:L18"], ["排班配置輸入", "A1:R18"], ["班次檢核總覽", "A1:R18"]]) {
  const image = await wb.render({ sheetName: name, range, scale: 1, format: "png" });
  await fs.writeFile(`${previewDir}/${name}.png`, new Uint8Array(await image.arrayBuffer()));
}
console.log((await wb.inspect({ kind: "table", range: "班次檢核總覽!A6:R12", include: "values,formulas", tableMaxRows: 12, tableMaxCols: 20, maxChars: 16000 })).ndjson);
console.log((await wb.inspect({ kind: "match", searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!|#SPILL!|#CALC!", options: { useRegex: true, maxResults: 300 }, maxChars: 12000 })).ndjson);
const out = await SpreadsheetFile.exportXlsx(wb);
await out.save(path);
console.log(`SAVED ${path}`);

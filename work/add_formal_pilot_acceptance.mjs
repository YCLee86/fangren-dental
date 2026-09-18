import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const path = "../outputs/clinic-assistant-model/assistant_skill_matrix_v1_pilot.xlsx";
const previewDir = "./formal-pilot-acceptance-previews";
const navy = "#1F5E78";
const amber = "#FFF2CC";
const paleBlue = "#EAF5FA";
const green = "#E2F0D9";
const red = "#FCE4D6";
const line = "#B7C9D3";

let wb = await SpreadsheetFile.importXlsx(await FileBlob.load(path));
const pilot = wb.worksheets.add("正式試排驗收");
pilot.showGridLines = false;

pilot.getRange("A2:N2").merge();
pilot.getRange("A2").values = [["診所助理排班工具－正式試排驗收"]];
pilot.getRange("A2:N2").format.font = { name: "Arial", size: 15, bold: true, color: "#263238" };
pilot.getRange("A3:N3").format.borders = { bottom: { style: "thin", color: line } };
pilot.getRange("A4:N4").merge();
pilot.getRange("A4").values = [["選擇一筆非範例正式班次。系統條件全部通過後，再由主管完成驗收簽核。例外核定可支援個別班次營運，但不能取代正式試排；只有無例外且最終可發布的班次才能計入上線準備。"]];
pilot.getRange("A4:N4").format.font = { name: "Arial", size: 10, italic: true, color: "#607D8B" };

pilot.getRange("A6:N6").values = [["驗收班次編號", null, "目前下一步", null, null, null, "系統通過", null, "系統未通過", null, "人工簽核", null, "最終驗收", null]];
for (const range of ["A6:B6", "C6:F6", "G6:H6", "I6:J6", "K6:L6", "M6:N6"]) pilot.getRange(range).merge();
pilot.getRange("A6:N6").format = { fill: navy, font: { name: "Arial", size: 10, bold: true, color: "#FFFFFF" }, horizontalAlignment: "center", verticalAlignment: "center" };
for (const range of ["A7:B7", "C7:F7", "G7:H7", "I7:J7", "K7:L7", "M7:N7"]) pilot.getRange(range).merge();
pilot.getRange("A7").dataValidation = { rule: { type: "list", formula1: "'班次檢核總覽'!$A$7:$A$36" } };
pilot.getRange("C7").formulas = [[`=IF($A$7="","先選擇非範例正式班次",IF($I$7>0,"依下方未通過項目補齊班次資料",IF($K$7<>"已簽核","完成主管人工驗收與簽核","正式試排已完成")))`]];
pilot.getRange("G7").formulas = [[`=IF($A$7="",0,COUNTIFS($J$14:$J$25,"通過"))`]];
pilot.getRange("I7").formulas = [[`=IF($A$7="",12,COUNTIFS($J$14:$J$25,"<>通過"))`]];
pilot.getRange("K7").formulas = [[`=IF($A$7="","待驗收",IF(AND($C$28<>"",$C$28<>$A$7),"核定班次不一致",IF($C$29="退回","已退回",IF(AND($C$28=$A$7,$G$28<>"",$K$28<>"",$N$28<>"",$C$29="通過",$G$29<>""),"已簽核","待簽核"))))`]];
pilot.getRange("M7").formulas = [[`=IF($A$7="","待選擇班次",IF($I$7>0,"系統條件未完成",IF($K$7<>"已簽核","待人工驗收","驗收通過")))`]];
pilot.getRange("A7:B7").format = { fill: amber, font: { name: "Arial", size: 12, bold: true, color: "#263238" }, horizontalAlignment: "center", verticalAlignment: "center" };
pilot.getRange("C7:N7").format = { fill: paleBlue, font: { name: "Arial", size: 11, bold: true, color: "#263238" }, horizontalAlignment: "center", verticalAlignment: "center", wrapText: true };
pilot.getRange("M7:N7").conditionalFormats.add("containsText", { text: "驗收通過", format: { fill: green, font: { color: "#375623", bold: true } } });
pilot.getRange("M7:N7").conditionalFormats.add("containsText", { text: "未完成", format: { fill: red, font: { color: "#9C0006", bold: true } } });

pilot.getRange("A9:N9").merge();
pilot.getRange("A9").values = [["所選班次摘要"]];
pilot.getRange("A9:N9").format = { fill: "#D9EAF2", font: { name: "Arial", size: 10, bold: true, color: "#263238" } };
pilot.getRange("A10:N10").values = [["日期", null, null, "開始", null, null, "結束", null, null, "模式代碼", null, null, "治療項目", null]];
for (const range of ["A10:A10", "B10:C10", "D10:D10", "E10:F10", "G10:G10", "H10:I10", "J10:J10", "K10:L10", "M10:M10"]) {
  if (range.includes(":")) {
    const [a,b] = range.split(":");
    if (a !== b) pilot.getRange(range).merge();
  }
}
pilot.getRange("B10").formulas = [[`=IF($A$7="","",_xlfn.XLOOKUP($A$7,'班次檢核總覽'!$A$7:$A$36,'班次檢核總覽'!$B$7:$B$36,"",0))`]];
pilot.getRange("E10").formulas = [[`=IF($A$7="","",_xlfn.XLOOKUP($A$7,'班次檢核總覽'!$A$7:$A$36,'班次檢核總覽'!$C$7:$C$36,"",0))`]];
pilot.getRange("H10").formulas = [[`=IF($A$7="","",_xlfn.XLOOKUP($A$7,'班次檢核總覽'!$A$7:$A$36,'班次檢核總覽'!$D$7:$D$36,"",0))`]];
pilot.getRange("K10").formulas = [[`=IF($A$7="","",_xlfn.XLOOKUP($A$7,'班次檢核總覽'!$A$7:$A$36,'班次檢核總覽'!$E$7:$E$36,"",0))`]];
pilot.getRange("N10").formulas = [[`=IF($A$7="","",_xlfn.XLOOKUP($A$7,'班次檢核總覽'!$A$7:$A$36,'班次檢核總覽'!$F$7:$F$36,"",0))`]];
pilot.getRange("A10:N10").format = { font: { name: "Arial", size: 10, color: "#263238" }, verticalAlignment: "center" };
for (const cell of ["A10", "D10", "G10", "J10", "M10"]) pilot.getRange(cell).format = { fill: "#F7FBFD", font: { name: "Arial", size: 10, bold: true, color: "#263238" } };
pilot.getRange("B10:C10").format.numberFormat = "yyyy-mm-dd";
pilot.getRange("E10:F10").format.numberFormat = "hh:mm";
pilot.getRange("H10:I10").format.numberFormat = "hh:mm";

pilot.getRange("A13:N13").values = [["順序", "驗收條件", null, null, null, "目前值", null, null, null, "判定", null, "未通過時處理", null, null]];
for (const range of ["B13:E13", "F13:I13", "J13:K13", "L13:N13"]) pilot.getRange(range).merge();
pilot.getRange("A13:N13").format = { fill: navy, font: { name: "Arial", size: 10, bold: true, color: "#FFFFFF" }, horizontalAlignment: "center", verticalAlignment: "center", wrapText: true };

const checkLabels = [
  "班次編號存在且唯一", "資料狀態為正式", "療程已明確確認", "三週與一週確認流程完成",
  "主跟診配置數達需求", "正式可用主跟診達需求", "短時支援配置數達需求", "支援容量達需求",
  "無人員時段衝突", "班次安全結果通過", "未使用排班例外", "最終發布判定為可發布",
];
const currentFormulas = [
  `=IF($A$7="","",COUNTIFS('班次檢核總覽'!$A$7:$A$36,$A$7))`,
  `=IF($A$7="","",_xlfn.XLOOKUP($A$7,'班次檢核總覽'!$A$7:$A$36,'班次檢核總覽'!$R$7:$R$36,"未找到",0))`,
  `=IF($A$7="","",_xlfn.XLOOKUP($A$7,'班次檢核總覽'!$A$7:$A$36,'班次檢核總覽'!$G$7:$G$36,"未找到",0))`,
  `=IF($A$7="","",_xlfn.XLOOKUP($A$7,'班次檢核總覽'!$A$7:$A$36,'班次檢核總覽'!$S$7:$S$36,"未找到",0))`,
  `=IF($A$7="","",_xlfn.XLOOKUP($A$7,'班次檢核總覽'!$A$7:$A$36,'班次檢核總覽'!$I$7:$I$36,0,0)&"／"&_xlfn.XLOOKUP($A$7,'班次檢核總覽'!$A$7:$A$36,'班次檢核總覽'!$H$7:$H$36,0,0))`,
  `=IF($A$7="","",_xlfn.XLOOKUP($A$7,'班次檢核總覽'!$A$7:$A$36,'班次檢核總覽'!$K$7:$K$36,0,0)&"／"&_xlfn.XLOOKUP($A$7,'班次檢核總覽'!$A$7:$A$36,'班次檢核總覽'!$H$7:$H$36,0,0))`,
  `=IF($A$7="","",_xlfn.XLOOKUP($A$7,'班次檢核總覽'!$A$7:$A$36,'班次檢核總覽'!$O$7:$O$36,0,0)&"／"&_xlfn.XLOOKUP($A$7,'班次檢核總覽'!$A$7:$A$36,'班次檢核總覽'!$N$7:$N$36,0,0))`,
  `=IF($A$7="","",_xlfn.XLOOKUP($A$7,'班次檢核總覽'!$A$7:$A$36,'班次檢核總覽'!$M$7:$M$36,0,0)&"／"&_xlfn.XLOOKUP($A$7,'班次檢核總覽'!$A$7:$A$36,'班次檢核總覽'!$L$7:$L$36,0,0))`,
  `=IF($A$7="","",_xlfn.XLOOKUP($A$7,'班次檢核總覽'!$A$7:$A$36,'班次檢核總覽'!$P$7:$P$36,"未找到",0))`,
  `=IF($A$7="","",_xlfn.XLOOKUP($A$7,'班次檢核總覽'!$A$7:$A$36,'班次檢核總覽'!$Q$7:$Q$36,"未找到",0))`,
  `=IF($A$7="","",_xlfn.XLOOKUP($A$7,'班次檢核總覽'!$A$7:$A$36,'班次檢核總覽'!$V$7:$V$36,"未找到",0))`,
  `=IF($A$7="","",_xlfn.XLOOKUP($A$7,'班次檢核總覽'!$A$7:$A$36,'班次檢核總覽'!$W$7:$W$36,"未找到",0))`,
];
const statusFormulas = [
  `=IF($A$7="","待檢查",IF($F14=1,"通過","未通過"))`,
  `=IF($A$7="","待檢查",IF($F15="正式","通過","未通過"))`,
  `=IF($A$7="","待檢查",IF(OR($F16="一般診已確認",$F16="特殊療程已確認"),"通過","未通過"))`,
  `=IF($A$7="","待檢查",IF($F17="確認完成","通過","未通過"))`,
  `=IF($A$7="","待檢查",IF(_xlfn.XLOOKUP($A$7,'班次檢核總覽'!$A$7:$A$36,'班次檢核總覽'!$I$7:$I$36,0,0)>=_xlfn.XLOOKUP($A$7,'班次檢核總覽'!$A$7:$A$36,'班次檢核總覽'!$H$7:$H$36,0,0),"通過","未通過"))`,
  `=IF($A$7="","待檢查",IF(_xlfn.XLOOKUP($A$7,'班次檢核總覽'!$A$7:$A$36,'班次檢核總覽'!$K$7:$K$36,0,0)>=_xlfn.XLOOKUP($A$7,'班次檢核總覽'!$A$7:$A$36,'班次檢核總覽'!$H$7:$H$36,0,0),"通過","未通過"))`,
  `=IF($A$7="","待檢查",IF(_xlfn.XLOOKUP($A$7,'班次檢核總覽'!$A$7:$A$36,'班次檢核總覽'!$O$7:$O$36,0,0)>=_xlfn.XLOOKUP($A$7,'班次檢核總覽'!$A$7:$A$36,'班次檢核總覽'!$N$7:$N$36,0,0),"通過","未通過"))`,
  `=IF($A$7="","待檢查",IF(_xlfn.XLOOKUP($A$7,'班次檢核總覽'!$A$7:$A$36,'班次檢核總覽'!$M$7:$M$36,0,0)>=_xlfn.XLOOKUP($A$7,'班次檢核總覽'!$A$7:$A$36,'班次檢核總覽'!$L$7:$L$36,0,0),"通過","未通過"))`,
  `=IF($A$7="","待檢查",IF($F22=0,"通過","未通過"))`,
  `=IF($A$7="","待檢查",IF($F23="通過","通過","未通過"))`,
  `=IF($A$7="","待檢查",IF($F24="無例外","通過","未通過"))`,
  `=IF($A$7="","待檢查",IF($F25="可發布","通過","未通過"))`,
];
const actions = [
  "回到班次需求輸入確認編號", "將資料狀態改為正式", "完成一般診或特殊療程確認", "補齊三週標記與一週確認",
  "補足主跟診配置", "完成主跟診資格與正式狀態核定", "補足短時支援配置", "改派或增加具資格的支援者",
  "解除重疊配置", "依班次檢核結果修正人力與支援", "改用不需例外的正式班次", "排除所有阻擋後重新發布",
];
for (let i = 0; i < 12; i++) {
  const r = 14 + i;
  pilot.getRange(`A${r}`).values = [[i + 1]];
  for (const range of [`B${r}:E${r}`, `F${r}:I${r}`, `J${r}:K${r}`, `L${r}:N${r}`]) pilot.getRange(range).merge();
  pilot.getRange(`B${r}`).values = [[checkLabels[i]]];
  pilot.getRange(`F${r}`).formulas = [[currentFormulas[i]]];
  pilot.getRange(`J${r}`).formulas = [[statusFormulas[i]]];
  pilot.getRange(`L${r}`).values = [[actions[i]]];
}
pilot.getRange("A14:N25").format = { font: { name: "Arial", size: 10, color: "#263238" }, wrapText: true, verticalAlignment: "center" };
pilot.getRange("A14:E25").format.fill = "#F7FBFD";
pilot.getRange("F14:I25").format.fill = paleBlue;
pilot.getRange("J14:K25").format.fill = amber;
pilot.getRange("L14:N25").format.fill = "#FFFFFF";
pilot.getRange("J14:K25").conditionalFormats.add("containsText", { text: "通過", format: { fill: green, font: { color: "#375623", bold: true } } });
pilot.getRange("J14:K25").conditionalFormats.add("containsText", { text: "未通過", format: { fill: red, font: { color: "#9C0006", bold: true } } });

pilot.getRange("A27:N27").merge();
pilot.getRange("A27").values = [["主管人工驗收與簽核"]];
pilot.getRange("A27:N27").format = { fill: "#D9EAF2", font: { name: "Arial", size: 10, bold: true, color: "#263238" } };
pilot.getRange("A28:N29").values = [
  ["核定班次編號", null, null, null, "執行人", null, null, null, "執行日", null, null, null, "核定日", null],
  ["主管決定", null, null, null, "核定人", null, null, null, "備註", null, null, null, null, null],
];
for (const range of ["A28:B28", "C28:D28", "E28:F28", "G28:H28", "I28:J28", "K28:L28", "A29:B29", "C29:D29", "E29:F29", "G29:H29", "I29:J29", "K29:N29"]) pilot.getRange(range).merge();
for (const range of ["A28:B28", "E28:F28", "I28:J28", "M28", "A29:B29", "E29:F29", "I29:J29"]) pilot.getRange(range).format = { fill: "#F7FBFD", font: { name: "Arial", size: 10, bold: true, color: "#263238" } };
for (const range of ["C28:D28", "G28:H28", "K28:L28", "N28", "C29:D29", "G29:H29", "K29:N29"]) pilot.getRange(range).format = { fill: amber, font: { name: "Arial", size: 10, color: "#263238" }, wrapText: true };
pilot.getRange("C29").dataValidation = { rule: { type: "list", values: ["待驗收", "通過", "退回"] } };
pilot.getRange("K28:L28").format.numberFormat = "yyyy-mm-dd";
pilot.getRange("N28").format.numberFormat = "yyyy-mm-dd";
pilot.getRange("A31:N31").merge();
pilot.getRange("A32:N32").merge();
pilot.getRange("A31").values = [["先在 A7 選擇正式班次。十二項均通過後，在黃色簽核欄填入相同班次編號、執行人、執行日、主管決定、核定人與核定日。"]];
pilot.getRange("A32").values = [["主管決定為通過且簽核資料完整後，正式試排才會計入上線準備；更換 A7 班次時，原簽核不會自動套用。"]];
pilot.getRange("A31:N32").format = { font: { name: "Arial", size: 10, italic: true, color: "#607D8B" }, wrapText: true };

const widths = [8, 16, 16, 16, 16, 16, 16, 16, 16, 14, 14, 18, 18, 24];
for (let i = 0; i < widths.length; i++) pilot.getRange(`${String.fromCharCode(65 + i)}:${String.fromCharCode(65 + i)}`).format.columnWidth = widths[i];
pilot.freezePanes.freezeRows(13);
pilot.freezePanes.freezeColumns(1);
pilot.tabColor = "#70AD47";

wb.recalculate();
let out = await SpreadsheetFile.exportXlsx(wb);
await out.save(path);

wb = await SpreadsheetFile.importXlsx(await FileBlob.load(path));
const readiness = wb.worksheets.getItem("上線準備");
readiness.getRange("D21").formulas = [[`=IF('正式試排驗收'!$M$7="驗收通過",1,0)`]];
readiness.getRange("G21").values = [["正式試排驗收"]];
readiness.getRange("N21").values = [["選擇一筆非範例正式班次，完成十二項系統檢查與主管簽核"]];

const intake = wb.worksheets.getItem("正式資料收件");
intake.getRange("G20").values = [["正式試排驗收／班次需求輸入／排班配置輸入／班次檢核總覽"]];
intake.getRange("F20").values = [["非範例正式班次、療程確認、主跟診與支援配置、容量與衝突檢查、三週／一週確認、最終發布、主管驗收簽核"]];

const dashboard = wb.worksheets.getItem("主管工作台");
dashboard.getRange("A31:E31").values = [["正式試排驗收", null, "正式試排驗收", "十二項系統條件與主管簽核皆完成", null]];
dashboard.getRange("B31").formulas = [[`=IF('正式試排驗收'!$M$7="驗收通過",0,1)`]];
dashboard.getRange("E31").formulas = [[`=IF(B31=0,"正式試排已驗收通過","尚未完成正式試排驗收")`]];
dashboard.getRange("A31:E31").format.font = { name: "Arial", size: 10, color: "#263238" };
dashboard.getRange("A31:E31").format.borders = { bottom: { style: "hair", color: line } };
dashboard.getRange("B31").format = { fill: "#DDEBF7", font: { name: "Arial", size: 10, bold: true, color: "#263238" }, horizontalAlignment: "right", numberFormat: "#,##0" };
dashboard.getRange("E31").format = { fill: amber, font: { name: "Arial", size: 10, bold: true, color: "#7F6000" } };

const guide = wb.worksheets.getItem("主管操作導引");
guide.getRange("H16").values = [["最終發布判定可發布；正式試排另完成驗收簽核"]];
guide.getRange("E22").values = [["正式試排驗收、上線準備"]];
guide.getRange("G22:H22").values = [["完成正式試排、系統條件、權限、備份與教育確認", "正式試排驗收通過，且所有上線閘門均完成"]];

const overview = wb.worksheets.getItem("續作總覽");
overview.getRange("A36:D36").values = [["正式試排驗收", 12, "驗收流程已建立，尚待實際班次", "非範例正式班次須通過十二項系統條件與主管簽核；例外核定不可作為正式試排通過"]];
overview.getRange("B36").format.numberFormat = "#,##0";

wb.recalculate();
await fs.mkdir(previewDir, { recursive: true });
for (const [name, range] of [["正式試排驗收", "A1:N32"], ["上線準備", "A11:N25"], ["主管工作台", "A19:E31"], ["主管操作導引", "A11:K22"]]) {
  const image = await wb.render({ sheetName: name, range, scale: 1.08, format: "png" });
  await fs.writeFile(`${previewDir}/${name}.png`, new Uint8Array(await image.arrayBuffer()));
}
for (const range of ["正式試排驗收!A1:N32", "上線準備!A11:N25", "主管工作台!A20:E31", "主管操作導引!A11:K22", "續作總覽!A33:D36"]) {
  console.log((await wb.inspect({ kind: "table", range, include: "values,formulas", tableMaxRows: 35, tableMaxCols: 18, maxChars: 32000 })).ndjson);
}
console.log((await wb.inspect({ kind: "match", searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!|#SPILL!|#CALC!", options: { useRegex: true, maxResults: 500 }, maxChars: 12000 })).ndjson);
out = await SpreadsheetFile.exportXlsx(wb);
await out.save(path);
console.log(`SAVED ${path}`);

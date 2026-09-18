import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const path = "../outputs/clinic-assistant-model/assistant_skill_matrix_v1_pilot.xlsx";
const previewDir = "./schedule-confirmation-previews";
const wb = await SpreadsheetFile.importXlsx(await FileBlob.load(path));

const navy = "#1F5E78";
const amber = "#FFF2CC";
const paleBlue = "#EAF5FA";
const red = "#FCE4D6";
const line = "#B7C9D3";

const demand = wb.worksheets.getItem("班次需求輸入");
demand.getRange("A4").values = [["黃色欄位由諮詢組或助理主管填寫。前三列是範例，不代表實際班表；正式需求須完成三週標記、一週確認及必要的人力重檢。"]];

const confirmationHeaders = ["三週前截止日", "三週標記人", "三週標記日", "一週前截止日", "一週確認人", "一週確認日", "診前確認結果", "異動類型", "異動說明", "人力處理狀態", "處理主管", "確認流程狀態"];
const confirmationRows = Array.from({ length: 30 }, () => Array(12).fill(null));
demand.getRange("M6:X36").values = [confirmationHeaders, ...confirmationRows];
const confirmationTable = demand.tables.add("M6:X36", true, "ScheduleConfirmations");
confirmationTable.style = "TableStyleMedium2";
demand.getRange("M6:X6").format = { fill: navy, font: { name: "Arial", size: 10, bold: true, color: "#FFFFFF" }, horizontalAlignment: "center", verticalAlignment: "center", wrapText: true };
demand.getRange("M7:X36").format.font = { name: "Arial", size: 10, color: "#263238" };
demand.getRange("M7:M36").format.fill = paleBlue;
demand.getRange("P7:P36").format.fill = paleBlue;
demand.getRange("X7:X36").format.fill = paleBlue;
demand.getRange("N7:O36").format.fill = amber;
demand.getRange("Q7:W36").format.fill = amber;

const confirmationFormulas = [];
for (let r = 7; r <= 36; r++) {
  confirmationFormulas.push([
    `=IF($B${r}="","",$B${r}-21)`,
    `=IF($B${r}="","",$B${r}-7)`,
    `=IF($A${r}="","",IF(OR($G${r}="",$G${r}="待確認",$N${r}="",$O${r}=""),"待三週前標記",IF(OR($Q${r}="",$R${r}="",$S${r}=""),"待一週前確認",IF(OR($S${r}="影響人力",$T${r}<>"無異動"),IF(OR($U${r}="",$V${r}="",$W${r}="",$V${r}="未處理"),"人力異動待處理",IF(AND(OR($T${r}="療程取消",$T${r}="病患取消"),NOT(OR($V${r}="人力可調整",$V${r}="已改派",$V${r}="已結案"))),"人力釋出待處理","確認完成")),"確認完成"))))`,
  ]);
}
demand.getRange("M7:M36").formulas = confirmationFormulas.map((x) => [x[0]]);
demand.getRange("P7:P36").formulas = confirmationFormulas.map((x) => [x[1]]);
demand.getRange("X7:X36").formulas = confirmationFormulas.map((x) => [x[2]]);
for (const c of ["M", "O", "P", "R"]) demand.getRange(`${c}7:${c}36`).format.numberFormat = "yyyy-mm-dd";
demand.getRange("S7:S36").dataValidation = { rule: { type: "list", values: ["待確認", "無變更", "器械／材料更新", "影響人力"] } };
demand.getRange("T7:T36").dataValidation = { rule: { type: "list", values: ["無異動", "增加人力", "減少人力", "療程取消", "病患取消"] } };
demand.getRange("V7:V36").dataValidation = { rule: { type: "list", values: ["未處理", "已重新檢核", "人力可調整", "已改派", "已結案"] } };
demand.getRange("X7:X36").conditionalFormats.add("containsText", { text: "待處理", format: { fill: red, font: { color: "#9C0006", bold: true } } });
demand.getRange("X7:X36").conditionalFormats.add("containsText", { text: "待三週", format: { fill: amber, font: { color: "#7F6000", bold: true } } });
demand.getRange("X7:X36").conditionalFormats.add("containsText", { text: "待一週", format: { fill: amber, font: { color: "#7F6000", bold: true } } });

const demandWidths = { M: 16, N: 16, O: 14, P: 16, Q: 16, R: 14, S: 18, T: 16, U: 36, V: 18, W: 16, X: 20 };
for (const [c, width] of Object.entries(demandWidths)) demand.getRange(`${c}:${c}`).format.columnWidth = width;

const check = wb.worksheets.getItem("班次檢核總覽");
check.getRange("A4").values = [["每列對應一筆需求。可發布必須同時滿足療程確認、正式主跟診、短時支援、支援容量、無時段衝突及三週／一週確認流程。"]];
check.getRange("R6:U36").values = [["資料狀態", "確認流程狀態", "異動類型", "發布狀態"], ...Array.from({ length: 30 }, () => Array(4).fill(null))];
const releaseTable = check.tables.add("R6:U36", true, "ScheduleReleaseStatus");
releaseTable.style = "TableStyleMedium2";
check.getRange("R6:U6").format = { fill: navy, font: { name: "Arial", size: 10, bold: true, color: "#FFFFFF" }, horizontalAlignment: "center", verticalAlignment: "center", wrapText: true };
check.getRange("R7:U36").format.font = { name: "Arial", size: 10, color: "#263238" };
check.getRange("R7:U36").format.fill = paleBlue;

const releaseFormulas = [];
for (let r = 7; r <= 36; r++) {
  releaseFormulas.push([
    `=IF($A${r}="","",_xlfn.XLOOKUP($A${r},'班次需求輸入'!$A$7:$A$36,'班次需求輸入'!$K$7:$K$36,"",0))`,
    `=IF($A${r}="","",_xlfn.XLOOKUP($A${r},'班次需求輸入'!$A$7:$A$36,'班次需求輸入'!$X$7:$X$36,"",0))`,
    `=IF($A${r}="","",_xlfn.XLOOKUP($A${r},'班次需求輸入'!$A$7:$A$36,'班次需求輸入'!$T$7:$T$36,"",0))`,
    `=IF($A${r}="","",IF($R${r}="範例","範例，不發布",IF(AND(OR($T${r}="療程取消",$T${r}="病患取消"),$S${r}="確認完成"),"人力已釋出",IF($Q${r}<>"通過",$Q${r},IF($S${r}<>"確認完成",$S${r},"可發布")))))`,
  ]);
}
check.getRange("R7:U36").formulas = releaseFormulas;
check.getRange("U7:U36").conditionalFormats.add("containsText", { text: "待", format: { fill: amber, font: { color: "#7F6000", bold: true } } });
check.getRange("U7:U36").conditionalFormats.add("containsText", { text: "缺", format: { fill: red, font: { color: "#9C0006", bold: true } } });
check.getRange("U7:U36").conditionalFormats.add("containsText", { text: "衝突", format: { fill: red, font: { color: "#9C0006", bold: true } } });
check.getRange("R:R").format.columnWidth = 14;
check.getRange("S:S").format.columnWidth = 20;
check.getRange("T:T").format.columnWidth = 16;
check.getRange("U:U").format.columnWidth = 22;

const dashboard = wb.worksheets.getItem("主管工作台");
dashboard.getRange("D6").values = [["班次待處理"]];
dashboard.getRange("D7").formulas = [[`=COUNTIFS('班次檢核總覽'!$A$7:$A$36,"<>",'班次檢核總覽'!$R$7:$R$36,"<>範例",'班次檢核總覽'!$U$7:$U$36,"<>可發布",'班次檢核總覽'!$U$7:$U$36,"<>人力已釋出")`]];
dashboard.getRange("A13").values = [["班次待處理"]];
dashboard.getRange("D13").values = [["發布狀態為可發布或人力已釋出"]];
dashboard.getRange("E13").formulas = [[`=IF(B13=0,"無待處理班次","需完成資格、人力或確認流程")`]];
dashboard.getRange("H12").values = [["更新班次需求、三週標記與一週確認"]];
dashboard.getRange("I12").values = [["班次需求輸入、排班配置輸入"]];

const overview = wb.worksheets.getItem("續作總覽");
overview.getRange("C25:D25").values = [["療程確認流程已建立", "三週標記、一週確認、異動與發布狀態已接入班次檢核"]];

wb.recalculate();
await fs.mkdir(previewDir, { recursive: true });
for (const [name, range] of [
  ["班次需求輸入", "A1:X14"],
  ["班次檢核總覽", "A1:U14"],
  ["主管工作台", "A1:N23"],
]) {
  const image = await wb.render({ sheetName: name, range, scale: 1.15, format: "png" });
  await fs.writeFile(`${previewDir}/${name}.png`, new Uint8Array(await image.arrayBuffer()));
}

for (const range of ["班次需求輸入!A6:X12", "班次檢核總覽!A6:U12", "主管工作台!A6:E14"]) {
  console.log((await wb.inspect({ kind: "table", range, include: "values,formulas", tableMaxRows: 12, tableMaxCols: 26, maxChars: 16000 })).ndjson);
}
console.log((await wb.inspect({ kind: "match", searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!|#SPILL!|#CALC!", options: { useRegex: true, maxResults: 300 }, maxChars: 10000 })).ndjson);
const out = await SpreadsheetFile.exportXlsx(wb);
await out.save(path);
console.log(`SAVED ${path}`);

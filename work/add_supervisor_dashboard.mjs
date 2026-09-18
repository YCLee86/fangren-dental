import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const path = "../outputs/clinic-assistant-model/assistant_skill_matrix_v1_pilot.xlsx";
const previewDir = "./dashboard-preview";
const wb = await SpreadsheetFile.importXlsx(await FileBlob.load(path));

const navy = "#1F5E78";
const blue = "#DDEBF7";
const paleBlue = "#EAF5FA";
const amber = "#FFF2CC";
const red = "#FCE4D6";
const line = "#B7C9D3";
const dark = "#263238";

const sheet = wb.worksheets.add("主管工作台");
sheet.showGridLines = false;
sheet.getRange("A2").values = [["診所助理排班主管工作台"]];
sheet.getRange("A2:N2").format.font = { name: "Arial", size: 15, bold: true, color: dark };
sheet.getRange("A3:N3").format.borders = { bottom: { style: "thin", color: line } };
sheet.getRange("A4").values = [["先處理正式核定，再檢查班次；能力升級與資格恢復都必須保留主管核定。"]];
sheet.getRange("A4:N4").format.font = { name: "Arial", size: 10, italic: true, color: "#607D8B" };

const cards = [
  ["A6:B6", "A7:B7", "A8:B8", "待核定", `='主管核定中心'!A7`, `=IF(A7=0,"已完成","待處理")`],
  ["D6:E6", "D7:E7", "D8:E8", "班次異常", `=COUNTIFS('班次檢核總覽'!$A$7:$A$106,"<>",'班次檢核總覽'!$Q$7:$Q$106,"<>通過")`, `=IF(D7=0,"無異常","待處理")`],
  ["G6:H6", "G7:H7", "G8:H8", "30 天內複評", `=COUNTIFS('複評待辦'!$J$7:$J$62,"安排複評")+COUNTIFS('複評待辦'!$J$7:$J$62,"立即停止使用資格")`, `=IF(G7=0,"無近期項目","待處理")`],
  ["J6:K6", "J7:K7", "J8:K8", "可送升級核定", `=COUNTIFS('能力升級候選'!$M$7:$M$258,"可送主管核定",'能力升級候選'!$R$7:$R$258,"<>已核定升級")`, `=IF(J7=0,"無候選","待處理")`],
  ["M6:N6", "M7:N7", "M8:N8", "資格暫停／逾期", `=COUNTIFS('資格有效性'!$E$7:$E$62,"資格暫停")+COUNTIFS('資格有效性'!$E$7:$E$62,"逾期")`, `=IF(M7=0,"無恢復案件","待處理")`],
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
  sheet.getRange(statusRange).format = { fill: paleBlue, font: { name: "Arial", size: 10, bold: true, color: dark }, horizontalAlignment: "center", verticalAlignment: "center" };
  sheet.getRange(statusRange).conditionalFormats.add("containsText", { text: "待處理", format: { fill: amber, font: { color: "#7F6000", bold: true } } });
}

sheet.getRange("A11:E11").values = [["工作項目", "數量", "處理位置", "完成條件", "目前訊息"]];
sheet.getRange("A12:E17").values = [
  ["初始資料核定", null, "主管核定中心", "主管決定、生效日與核定人完整", null],
  ["班次異常", null, "班次檢核總覽", "班次結果為通過", null],
  ["半年複評", null, "複評待辦", "完成複評或安排可用補考日", null],
  ["能力 Ø 升 ◎", null, "能力升級候選", "證據符合且主管核定升級", null],
  ["資格恢復", null, "資格恢復處理", "補訓、複評、資料一致且主管核定", null],
  ["未建立資格", null, "考核紀錄輸入", "先完成正式考核與資格核定", null],
];
sheet.getRange("B12:B17").formulas = [[
  `='主管核定中心'!A7`,
], [
  `=D7`,
], [
  `=G7`,
], [
  `=J7`,
], [
  `=M7`,
], [
  `=COUNTIFS('資格有效性'!$E$7:$E$62,"未建立")`,
]];
sheet.getRange("E12:E17").formulas = [[
  `=IF(B12=0,"完成","仍有待核定")`,
], [
  `=IF(B13=0,"無異常","需調整人力或資格")`,
], [
  `=IF(B14=0,"無近期項目","需安排複評")`,
], [
  `=IF(B15=0,"無候選","可送主管核定")`,
], [
  `=IF(B16=0,"無恢復案件","需完成恢復程序")`,
], [
  `=IF(B17=0,"已建立","需先完成考核")`,
]];
sheet.getRange("A11:E17").format.font = { name: "Arial", size: 10, color: dark };
sheet.getRange("A11:E11").format = { fill: navy, font: { name: "Arial", size: 10, bold: true, color: "#FFFFFF" }, horizontalAlignment: "center", verticalAlignment: "center" };
sheet.getRange("B12:B17").format = { fill: blue, font: { name: "Arial", size: 10, bold: true, color: dark }, horizontalAlignment: "right", numberFormat: "#,##0" };
sheet.getRange("A12:E17").format.borders = { bottom: { style: "hair", color: line } };
sheet.getRange("E12:E17").conditionalFormats.add("containsText", { text: "需", format: { fill: amber, font: { color: "#7F6000", bold: true } } });
sheet.getRange("E12:E17").conditionalFormats.add("containsText", { text: "仍有", format: { fill: amber, font: { color: "#7F6000", bold: true } } });

sheet.getRange("G11:N11").values = [["每日操作順序", null, null, null, null, null, null, null]];
sheet.getRange("G11:N11").format = { fill: navy, font: { name: "Arial", size: 10, bold: true, color: "#FFFFFF" }, horizontalAlignment: "left" };
sheet.getRange("G12:H17").values = [
  ["1", "更新班次需求與配置"],
  ["2", "完成能力、熟悉度、要求與資格核定"],
  ["3", "查看班次結果並排除衝突或缺額"],
  ["4", "登錄考核、工作觀察及面談"],
  ["5", "處理能力升級候選"],
  ["6", "安排半年複評與資格恢復"],
];
sheet.getRange("I12:N17").values = [
  ["班次需求輸入、排班配置輸入", null, null, null, null, null],
  ["主管核定中心", null, null, null, null, null],
  ["班次檢核總覽", null, null, null, null, null],
  ["考核紀錄輸入、工作觀察輸入、面談與異議", null, null, null, null, null],
  ["能力升級候選", null, null, null, null, null],
  ["複評待辦、資格恢復處理", null, null, null, null, null],
];
sheet.getRange("G12:N17").format.font = { name: "Arial", size: 10, color: dark };
sheet.getRange("G12:G17").format = { fill: blue, font: { name: "Arial", size: 10, bold: true, color: dark }, horizontalAlignment: "center" };
sheet.getRange("G12:N17").format.borders = { bottom: { style: "hair", color: line } };

const widths = [22, 12, 3, 22, 34, 3, 8, 30, 30, 18, 12, 3, 22, 18];
widths.forEach((width, index) => sheet.getRange(`${String.fromCharCode(65 + index)}:${String.fromCharCode(65 + index)}`).format.columnWidth = width);
sheet.getRange("1:20").format.rowHeight = 20;
sheet.getRange("2:2").format.rowHeight = 26;
sheet.getRange("4:4").format.rowHeight = 22;
sheet.getRange("6:8").format.rowHeight = 22;
sheet.getRange("12:17").format.verticalAlignment = "middle";
sheet.freezePanes.freezeRows(4);
sheet.tabColor = navy;

const overview = wb.worksheets.getItem("續作總覽");
overview.getRange("C15:D15").values = [["主管工作台已建立", "每日待辦與操作順序集中顯示"]];

wb.recalculate();
await fs.mkdir(previewDir, { recursive: true });
const image = await wb.render({ sheetName: "主管工作台", range: "A1:N19", scale: 1.4, format: "png" });
await fs.writeFile(`${previewDir}/主管工作台.png`, new Uint8Array(await image.arrayBuffer()));
console.log((await wb.inspect({ kind: "table", range: "主管工作台!A1:N18", include: "values,formulas", tableMaxRows: 20, tableMaxCols: 16, maxChars: 18000 })).ndjson);
console.log((await wb.inspect({ kind: "match", searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!|#SPILL!|#CALC!", options: { useRegex: true, maxResults: 300 }, maxChars: 10000 })).ndjson);
const out = await SpreadsheetFile.exportXlsx(wb);
await out.save(path);
console.log(`SAVED ${path}`);

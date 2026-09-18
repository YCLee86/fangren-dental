import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const path = "../outputs/clinic-assistant-model/assistant_skill_matrix_v1_pilot.xlsx";
const previewDir = "./pending-rule-previews";
const wb = await SpreadsheetFile.importXlsx(await FileBlob.load(path));

const navy = "#1F5E78";
const amber = "#FFF2CC";
const line = "#B7C9D3";

function col(n) {
  let s = "";
  while (n > 0) { n--; s = String.fromCharCode(65 + (n % 26)) + s; n = Math.floor(n / 26); }
  return s;
}

function addInputSheet(name, title, note, headers, rowCount, tableName, widths) {
  const sheet = wb.worksheets.add(name);
  const last = col(headers.length);
  sheet.showGridLines = false;
  sheet.getRange("A2").values = [[title]];
  sheet.getRange(`A2:${last}2`).format.font = { name: "Arial", size: 14, bold: true, color: "#263238" };
  sheet.getRange(`A3:${last}3`).format.borders = { bottom: { style: "thin", color: line } };
  sheet.getRange("A4").values = [[note]];
  sheet.getRange(`A4:${last}4`).format.font = { name: "Arial", size: 10, italic: true, color: "#607D8B" };
  const rows = Array.from({ length: rowCount }, () => Array(headers.length).fill(null));
  sheet.getRange(`A6:${last}${6 + rowCount}`).values = [headers, ...rows];
  const table = sheet.tables.add(`A6:${last}${6 + rowCount}`, true, tableName);
  table.style = "TableStyleMedium2";
  sheet.getRange(`A6:${last}6`).format = { fill: navy, font: { name: "Arial", size: 10, bold: true, color: "#FFFFFF" }, horizontalAlignment: "center", verticalAlignment: "center", wrapText: true };
  sheet.getRange(`A7:${last}${6 + rowCount}`).format = { fill: amber, font: { name: "Arial", size: 10, color: "#263238" } };
  widths.forEach((width, i) => sheet.getRange(`${col(i + 1)}:${col(i + 1)}`).format.columnWidth = width);
  sheet.freezePanes.freezeRows(6);
  sheet.freezePanes.freezeColumns(2);
  sheet.tabColor = "#F4B183";
  return sheet;
}

const doctor = addInputSheet(
  "醫師模式規則輸入",
  "其他醫師治療模式與支援規則輸入",
  "只輸入各醫師與助理主管已確認的規則。未確認項目保持空白或標記待確認，不從舊能力表推定治療門檻。",
  ["規則編號", "醫師", "醫師型態", "模式代碼", "治療項目", "療程階段", "複雜度", "主跟診需求人數", "支援需求人數", "短時支援分鐘", "療程確認提前天數", "版本", "生效日", "核定狀態", "核定人", "備註"],
  150,
  "DoctorModeRuleInput",
  [16, 18, 16, 24, 24, 24, 16, 18, 18, 18, 20, 14, 14, 16, 16, 42],
);
doctor.getRange("C7:C156").dataValidation = { rule: { type: "list", values: ["固定型", "混合型"] } };
doctor.getRange("G7:G156").dataValidation = { rule: { type: "list", values: ["一般", "高複雜度"] } };
doctor.getRange("N7:N156").dataValidation = { rule: { type: "list", values: ["待確認", "已核定", "退回補件", "停用"] } };
doctor.getRange("M7:M156").format.numberFormat = "yyyy-mm-dd";

const mobility = addInputSheet(
  "流動層級規則輸入",
  "正職三級與兼職六級流動規則輸入",
  "流動級別是多項任務組合，不等同單項能力評等。請逐項輸入診所既有規則並完成版本核定。",
  ["規則編號", "能力路徑", "流動級別", "任務／技能代碼", "任務／技能名稱", "最低評等", "必要性", "版本", "生效日", "核定狀態", "核定人", "備註"],
  120,
  "MobilityLevelRuleInput",
  [16, 20, 16, 28, 30, 14, 16, 14, 14, 16, 16, 42],
);
mobility.getRange("B7:B126").dataValidation = { rule: { type: "list", values: ["正職助理路徑", "兼職流動路徑", "主管指定其他路徑"] } };
mobility.getRange("F7:F126").dataValidation = { rule: { type: "list", values: ["未評估", "※", "△", "Ø", "◎"] } };
mobility.getRange("G7:G126").dataValidation = { rule: { type: "list", values: ["必備", "參考"] } };
mobility.getRange("J7:J126").dataValidation = { rule: { type: "list", values: ["待確認", "已核定", "退回補件", "停用"] } };
mobility.getRange("I7:I126").format.numberFormat = "yyyy-mm-dd";

const grade = addInputSheet(
  "職級矩陣規則輸入",
  "Lv.1–Lv.10 正式職級矩陣輸入",
  "職級只能人工核定，不因能力變化自動升降。請輸入診所既有升級條件，並保留版本、生效日與核定人。",
  ["規則編號", "正式職級", "條件類型", "條件代碼／名稱", "最低標準", "必要性", "版本", "生效日", "核定狀態", "核定人", "備註"],
  150,
  "GradeMatrixRuleInput",
  [16, 14, 20, 32, 28, 16, 14, 14, 16, 16, 42],
);
grade.getRange("B7:B156").dataValidation = { rule: { type: "list", values: ["Lv.1", "Lv.2", "Lv.3", "Lv.4", "Lv.5", "Lv.6", "Lv.7", "Lv.8", "Lv.9", "Lv.10"] } };
grade.getRange("C7:C156").dataValidation = { rule: { type: "list", values: ["技能", "流動級別", "正式考核", "經驗條件", "主管核定條件", "其他"] } };
grade.getRange("F7:F156").dataValidation = { rule: { type: "list", values: ["必備", "參考"] } };
grade.getRange("I7:I156").dataValidation = { rule: { type: "list", values: ["待確認", "已核定", "退回補件", "停用"] } };
grade.getRange("H7:H156").format.numberFormat = "yyyy-mm-dd";

const dashboard = wb.worksheets.getItem("主管工作台");
dashboard.getRange("A20:E22").values = [
  ["其他醫師規則", 0, "醫師模式規則輸入", "逐位完成治療模式與支援規則核定", "待提供正式規則"],
  ["流動層級規則", 0, "流動層級規則輸入", "匯入正職三級與兼職六級", "待提供正式規則"],
  ["Lv.1–Lv.10 職級", 0, "職級矩陣規則輸入", "匯入正式職級矩陣", "待提供正式規則"],
];
dashboard.getRange("B20:B22").formulas = [
  [`=COUNTIFS('醫師模式規則輸入'!$N$7:$N$156,"已核定")`],
  [`=COUNTIFS('流動層級規則輸入'!$J$7:$J$126,"已核定")`],
  [`=COUNTIFS('職級矩陣規則輸入'!$I$7:$I$156,"已核定")`],
];
dashboard.getRange("A20:E22").format.font = { name: "Arial", size: 10, color: "#263238" };
dashboard.getRange("A20:E22").format.borders = { bottom: { style: "hair", color: line } };
dashboard.getRange("B20:B22").format = { fill: "#DDEBF7", font: { name: "Arial", size: 10, bold: true, color: "#263238" }, horizontalAlignment: "right", numberFormat: "#,##0" };
dashboard.getRange("E20:E22").format = { fill: amber, font: { name: "Arial", size: 10, bold: true, color: "#7F6000" } };

const overview = wb.worksheets.getItem("續作總覽");
overview.getRange("A21:D23").values = [
  ["其他醫師模式規則", null, "等待正式內容", "已建立匯入欄位，不推定臨床門檻"],
  ["正／兼職流動層級", null, "等待正式內容", "已建立正職三級、兼職六級匯入欄位"],
  ["Lv.1–Lv.10 職級矩陣", null, "等待正式內容", "已建立人工核定與版本欄位"],
];

wb.recalculate();
await fs.mkdir(previewDir, { recursive: true });
for (const [name, range] of [
  ["醫師模式規則輸入", "A1:P18"],
  ["流動層級規則輸入", "A1:L18"],
  ["職級矩陣規則輸入", "A1:K18"],
  ["主管工作台", "A1:N23"],
]) {
  const image = await wb.render({ sheetName: name, range, scale: 1.1, format: "png" });
  await fs.writeFile(`${previewDir}/${name}.png`, new Uint8Array(await image.arrayBuffer()));
}
for (const range of ["醫師模式規則輸入!A1:P10", "流動層級規則輸入!A1:L10", "職級矩陣規則輸入!A1:K10", "主管工作台!A11:E22"]) {
  console.log((await wb.inspect({ kind: "table", range, include: "values,formulas", tableMaxRows: 24, tableMaxCols: 18, maxChars: 15000 })).ndjson);
}
console.log((await wb.inspect({ kind: "match", searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!|#SPILL!|#CALC!", options: { useRegex: true, maxResults: 300 }, maxChars: 10000 })).ndjson);
const out = await SpreadsheetFile.exportXlsx(wb);
await out.save(path);
console.log(`SAVED ${path}`);

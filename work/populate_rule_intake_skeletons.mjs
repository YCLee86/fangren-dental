import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const path = "../outputs/clinic-assistant-model/assistant_skill_matrix_v1_pilot.xlsx";
const previewDir = "./rule-intake-previews";
const wb = await SpreadsheetFile.importXlsx(await FileBlob.load(path));

const navy = "#1F5E78";
const amber = "#FFF2CC";
const green = "#E2F0D9";
const red = "#FCE4D6";

const doctor = wb.worksheets.getItem("醫師模式規則輸入");
const doctors = [
  ["PENDING-DOC-01", "李柄輝醫師", null, null, null, null, null, null, null, null, null, null, null, "待確認", null, "來源工作簿已有能力資料；治療模式與門檻待正式確認"],
  ["PENDING-DOC-02", "廖立揚醫師", null, null, null, null, null, null, null, null, null, null, null, "待確認", null, "來源工作簿已有能力資料；治療模式與門檻待正式確認"],
  ["PENDING-DOC-03", "楊小瑩醫師", null, null, null, null, null, null, null, null, null, null, null, "待確認", null, "來源工作簿已有能力資料；治療模式與門檻待正式確認"],
  ["PENDING-DOC-04", "王俊偉醫師", null, null, null, null, null, null, null, null, null, null, null, "待確認", null, "來源工作簿已有能力資料；治療模式與門檻待正式確認"],
  ["PENDING-DOC-05", "許馨文醫師", null, null, null, null, null, null, null, null, null, null, null, "待確認", null, "來源工作簿已有能力資料；治療模式與門檻待正式確認"],
  ["PENDING-DOC-06", "林晏妤醫師", null, null, null, null, null, null, null, null, null, null, null, "待確認", null, "來源工作簿已有能力資料；治療模式與門檻待正式確認"],
  ["PENDING-DOC-07", "謝耀慶醫師", null, null, null, null, null, null, null, null, null, null, null, "待確認", null, "來源工作簿已有能力資料；治療模式與門檻待正式確認"],
  ["PENDING-DOC-08", "陳醫師", null, null, null, null, null, null, null, null, null, null, null, "待確認", null, "來源工作簿已有能力資料；治療模式與門檻待正式確認"],
];
doctor.getRange("A7:P14").values = doctors;
doctor.getRange("A4").values = [["已依來源工作簿預列其餘 8 位醫師。請逐位補上正式治療模式、療程階段、支援規則與核定資料；待確認列不會進入排班規則。"]];
doctor.getRange("N7:N156").conditionalFormats.add("containsText", { text: "已核定", format: { fill: green, font: { color: "#375623", bold: true } } });
doctor.getRange("N7:N156").conditionalFormats.add("containsText", { text: "退回", format: { fill: red, font: { color: "#9C0006", bold: true } } });

const mobility = wb.worksheets.getItem("流動層級規則輸入");
const mobilityRows = [
  ["PENDING-MOB-F1", "正職助理路徑", "正職流動第 1 級"],
  ["PENDING-MOB-F2", "正職助理路徑", "正職流動第 2 級"],
  ["PENDING-MOB-F3", "正職助理路徑", "正職流動第 3 級"],
  ["PENDING-MOB-P1", "兼職流動路徑", "兼職流動第 1 級"],
  ["PENDING-MOB-P2", "兼職流動路徑", "兼職流動第 2 級"],
  ["PENDING-MOB-P3", "兼職流動路徑", "兼職流動第 3 級"],
  ["PENDING-MOB-P4", "兼職流動路徑", "兼職流動第 4 級"],
  ["PENDING-MOB-P5", "兼職流動路徑", "兼職流動第 5 級"],
  ["PENDING-MOB-P6", "兼職流動路徑", "兼職流動第 6 級"],
].map(([id, pathName, level]) => [id, pathName, level, null, null, null, null, null, null, "待確認", null, "級別已預列；任務、最低評等與正式版本待提供"]);
mobility.getRange("A7:L15").values = mobilityRows;
mobility.getRange("A4").values = [["已預列正職 3 級與兼職 6 級。每個級別可向下新增多筆任務要求；未填任務且未核定時不會成為流動崗位門檻。"]];
mobility.getRange("J7:J126").conditionalFormats.add("containsText", { text: "已核定", format: { fill: green, font: { color: "#375623", bold: true } } });
mobility.getRange("J7:J126").conditionalFormats.add("containsText", { text: "退回", format: { fill: red, font: { color: "#9C0006", bold: true } } });

const grade = wb.worksheets.getItem("職級矩陣規則輸入");
const gradeRows = Array.from({ length: 10 }, (_, i) => [
  `PENDING-LV${String(i + 1).padStart(2, "0")}`,
  `Lv.${i + 1}`,
  null, null, null, null, null, null,
  "待確認",
  null,
  "職級已預列；正式條件、版本、生效日與核定人待提供",
]);
grade.getRange("A7:K16").values = gradeRows;
grade.getRange("A4").values = [["已預列 Lv.1–Lv.10。每個職級可向下新增多筆正式條件；職級異動仍須人工核定，不會因能力評等自動升降。"]];
grade.getRange("I7:I156").conditionalFormats.add("containsText", { text: "已核定", format: { fill: green, font: { color: "#375623", bold: true } } });
grade.getRange("I7:I156").conditionalFormats.add("containsText", { text: "退回", format: { fill: red, font: { color: "#9C0006", bold: true } } });

const dashboard = wb.worksheets.getItem("主管工作台");
dashboard.getRange("A20:E22").values = [
  ["其他醫師規則列", null, "醫師模式規則輸入", "必填欄位完整且狀態為已核定", null],
  ["流動層級規則列", null, "流動層級規則輸入", "任務條件完整且狀態為已核定", null],
  ["Lv.1–Lv.10 規則列", null, "職級矩陣規則輸入", "職級條件完整且狀態為已核定", null],
];
dashboard.getRange("B20:B22").formulas = [
  [`=COUNTIFS('醫師模式規則輸入'!$B$7:$B$156,"<>",'醫師模式規則輸入'!$N$7:$N$156,"<>已核定")`],
  [`=COUNTIFS('流動層級規則輸入'!$C$7:$C$126,"<>",'流動層級規則輸入'!$J$7:$J$126,"<>已核定")`],
  [`=COUNTIFS('職級矩陣規則輸入'!$B$7:$B$156,"<>",'職級矩陣規則輸入'!$I$7:$I$156,"<>已核定")`],
];
dashboard.getRange("E20:E22").formulas = [
  [`=IF(B20=0,IF(COUNTA('醫師模式規則輸入'!$B$7:$B$156)=0,"待提供正式規則","已完成規則列核定"),"仍有 "&B20&" 列待補或核定")`],
  [`=IF(B21=0,IF(COUNTA('流動層級規則輸入'!$C$7:$C$126)=0,"待提供正式規則","已完成規則列核定"),"仍有 "&B21&" 列待補或核定")`],
  [`=IF(B22=0,IF(COUNTA('職級矩陣規則輸入'!$B$7:$B$156)=0,"待提供正式規則","已完成規則列核定"),"仍有 "&B22&" 列待補或核定")`],
];
dashboard.getRange("E20:E22").format = { fill: amber, font: { name: "Arial", size: 10, bold: true, color: "#7F6000" } };

const overview = wb.worksheets.getItem("續作總覽");
overview.getRange("A21:D23").values = [
  ["其他醫師模式規則", 8, "待正式內容，收件骨架已預建", "已列出來源工作簿中的其餘 8 位醫師，不推定臨床門檻"],
  ["正／兼職流動層級", 9, "待正式內容，收件骨架已預建", "已預列正職 3 級與兼職 6 級；任務條件待提供"],
  ["Lv.1–Lv.10 職級矩陣", 10, "待正式內容，收件骨架已預建", "已預列 10 個正式職級；升級條件仍須人工核定"],
];
overview.getRange("B21:B23").format.numberFormat = "#,##0";

wb.recalculate();
await fs.mkdir(previewDir, { recursive: true });
for (const [name, range] of [
  ["醫師模式規則輸入", "A1:P16"],
  ["流動層級規則輸入", "A1:L17"],
  ["職級矩陣規則輸入", "A1:K18"],
  ["主管工作台", "A11:E24"],
]) {
  const image = await wb.render({ sheetName: name, range, scale: 1.15, format: "png" });
  await fs.writeFile(`${previewDir}/${name}.png`, new Uint8Array(await image.arrayBuffer()));
}

for (const range of [
  "醫師模式規則輸入!A4:P14",
  "流動層級規則輸入!A4:L15",
  "職級矩陣規則輸入!A4:K16",
  "主管工作台!A20:E22",
  "續作總覽!A21:D23",
]) {
  console.log((await wb.inspect({ kind: "table", range, include: "values,formulas", tableMaxRows: 20, tableMaxCols: 18, maxChars: 18000 })).ndjson);
}
console.log((await wb.inspect({ kind: "match", searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!|#SPILL!|#CALC!", options: { useRegex: true, maxResults: 300 }, maxChars: 10000 })).ndjson);

const out = await SpreadsheetFile.exportXlsx(wb);
await out.save(path);
console.log(`SAVED ${path}`);

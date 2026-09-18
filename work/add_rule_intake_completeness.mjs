import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const path = "../outputs/clinic-assistant-model/assistant_skill_matrix_v1_pilot.xlsx";
const previewDir = "./rule-intake-check-previews";
const wb = await SpreadsheetFile.importXlsx(await FileBlob.load(path));

const navy = "#1F5E78";
const paleBlue = "#EAF5FA";
const green = "#E2F0D9";
const amber = "#FFF2CC";
const red = "#FCE4D6";

function styleCheckColumn(sheet, headerCell, bodyRange, width) {
  sheet.getRange(headerCell).format = {
    fill: navy,
    font: { name: "Arial", size: 10, bold: true, color: "#FFFFFF" },
    horizontalAlignment: "center",
    verticalAlignment: "center",
    wrapText: true,
  };
  sheet.getRange(bodyRange).format = { fill: paleBlue, font: { name: "Arial", size: 10, color: "#263238" } };
  sheet.getRange(bodyRange.split(":")[0].replace(/\d+$/, "") + ":" + bodyRange.split(":")[0].replace(/\d+$/, "")).format.columnWidth = width;
  sheet.getRange(bodyRange).conditionalFormats.add("containsText", { text: "可發布", format: { fill: green, font: { color: "#375623", bold: true } } });
  sheet.getRange(bodyRange).conditionalFormats.add("containsText", { text: "未完整", format: { fill: red, font: { color: "#9C0006", bold: true } } });
  sheet.getRange(bodyRange).conditionalFormats.add("containsText", { text: "待補", format: { fill: amber, font: { color: "#7F6000", bold: true } } });
}

const doctor = wb.worksheets.getItem("醫師模式規則輸入");
doctor.getRange("Q6").values = [["收件檢核"]];
const doctorChecks = [];
for (let r = 7; r <= 156; r++) {
  doctorChecks.push([`=IF($B${r}="","",IF($N${r}="停用","停用",IF($N${r}="退回補件","退回補件",IF(OR($C${r}="",$D${r}="",$E${r}="",$F${r}="",$G${r}="",$H${r}="",$I${r}="",$K${r}="",$L${r}="",$M${r}="",$O${r}=""),IF($N${r}="已核定","已核定但資料未完整","待補欄位或核定"),IF($N${r}="已核定","可發布","待主管核定")))))`]);
}
doctor.getRange("Q7:Q156").formulas = doctorChecks;
styleCheckColumn(doctor, "Q6", "Q7:Q156", 24);

const mobility = wb.worksheets.getItem("流動層級規則輸入");
mobility.getRange("M6").values = [["收件檢核"]];
const mobilityChecks = [];
for (let r = 7; r <= 126; r++) {
  mobilityChecks.push([`=IF($C${r}="","",IF($J${r}="停用","停用",IF($J${r}="退回補件","退回補件",IF(OR($A${r}="",$B${r}="",$D${r}="",$E${r}="",$F${r}="",$G${r}="",$H${r}="",$I${r}="",$K${r}=""),IF($J${r}="已核定","已核定但資料未完整","待補欄位或核定"),IF($J${r}="已核定","可發布","待主管核定")))))`]);
}
mobility.getRange("M7:M126").formulas = mobilityChecks;
styleCheckColumn(mobility, "M6", "M7:M126", 24);

const grade = wb.worksheets.getItem("職級矩陣規則輸入");
grade.getRange("L6").values = [["收件檢核"]];
const gradeChecks = [];
for (let r = 7; r <= 156; r++) {
  gradeChecks.push([`=IF($B${r}="","",IF($I${r}="停用","停用",IF($I${r}="退回補件","退回補件",IF(OR($A${r}="",$C${r}="",$D${r}="",$E${r}="",$F${r}="",$G${r}="",$H${r}="",$J${r}=""),IF($I${r}="已核定","已核定但資料未完整","待補欄位或核定"),IF($I${r}="已核定","可發布","待主管核定")))))`]);
}
grade.getRange("L7:L156").formulas = gradeChecks;
styleCheckColumn(grade, "L6", "L7:L156", 24);

const dashboard = wb.worksheets.getItem("主管工作台");
dashboard.getRange("B20:B22").formulas = [
  [`=COUNTIFS('醫師模式規則輸入'!$Q$7:$Q$156,"<>",'醫師模式規則輸入'!$Q$7:$Q$156,"<>可發布",'醫師模式規則輸入'!$Q$7:$Q$156,"<>停用")`],
  [`=COUNTIFS('流動層級規則輸入'!$M$7:$M$126,"<>",'流動層級規則輸入'!$M$7:$M$126,"<>可發布",'流動層級規則輸入'!$M$7:$M$126,"<>停用")`],
  [`=COUNTIFS('職級矩陣規則輸入'!$L$7:$L$156,"<>",'職級矩陣規則輸入'!$L$7:$L$156,"<>可發布",'職級矩陣規則輸入'!$L$7:$L$156,"<>停用")`],
];
dashboard.getRange("E20:E22").formulas = [
  [`=IF(B20=0,IF(COUNTA('醫師模式規則輸入'!$B$7:$B$156)=0,"待提供正式規則","已完成規則列核定"),"仍有 "&B20&" 列待補或核定")`],
  [`=IF(B21=0,IF(COUNTA('流動層級規則輸入'!$C$7:$C$126)=0,"待提供正式規則","已完成規則列核定"),"仍有 "&B21&" 列待補或核定")`],
  [`=IF(B22=0,IF(COUNTA('職級矩陣規則輸入'!$B$7:$B$156)=0,"待提供正式規則","已完成規則列核定"),"仍有 "&B22&" 列待補或核定")`],
];

wb.recalculate();
await fs.mkdir(previewDir, { recursive: true });
for (const [name, range] of [
  ["醫師模式規則輸入", "A1:Q16"],
  ["流動層級規則輸入", "A1:M17"],
  ["職級矩陣規則輸入", "A1:L18"],
  ["主管工作台", "A11:E24"],
]) {
  const image = await wb.render({ sheetName: name, range, scale: 1.15, format: "png" });
  await fs.writeFile(`${previewDir}/${name}.png`, new Uint8Array(await image.arrayBuffer()));
}
for (const range of ["醫師模式規則輸入!A6:Q14", "流動層級規則輸入!A6:M15", "職級矩陣規則輸入!A6:L16", "主管工作台!A20:E22"]) {
  console.log((await wb.inspect({ kind: "table", range, include: "values,formulas", tableMaxRows: 16, tableMaxCols: 18, maxChars: 18000 })).ndjson);
}
console.log((await wb.inspect({ kind: "match", searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!|#SPILL!|#CALC!", options: { useRegex: true, maxResults: 300 }, maxChars: 10000 })).ndjson);
const out = await SpreadsheetFile.exportXlsx(wb);
await out.save(path);
console.log(`SAVED ${path}`);

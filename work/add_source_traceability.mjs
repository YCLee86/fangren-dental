import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const path = "../outputs/clinic-assistant-model/assistant_skill_matrix_v1_pilot.xlsx";
const previewDir = "./source-traceability-previews";
const navy = "#1F5E78";
const amber = "#FFF2CC";
const paleBlue = "#EAF5FA";
const green = "#E2F0D9";
const red = "#FCE4D6";
const line = "#B7C9D3";

const wb = await SpreadsheetFile.importXlsx(await FileBlob.load(path));

function extendMergedHeading(sheet, newEnd) {
  sheet.getRange(`A2:${newEnd}2`).unmerge();
  sheet.getRange(`A4:${newEnd}4`).unmerge();
  sheet.getRange(`A2:${newEnd}2`).merge();
  sheet.getRange(`A4:${newEnd}4`).merge();
}

function styleSourceColumns(sheet, range, headerRange, widths) {
  sheet.getRange(headerRange).format = {
    fill: navy,
    font: { name: "Arial", size: 10, bold: true, color: "#FFFFFF" },
    horizontalAlignment: "center",
    verticalAlignment: "center",
    wrapText: true,
  };
  sheet.getRange(range).format = {
    fill: amber,
    font: { name: "Arial", size: 10, color: "#263238" },
    wrapText: true,
    verticalAlignment: "center",
  };
  for (const [col, width] of widths) sheet.getRange(`${col}:${col}`).format.columnWidth = width;
}

function addCheckFormatting(sheet, range) {
  sheet.getRange(range).conditionalFormats.add("containsText", { text: "可發布", format: { fill: green, font: { color: "#375623", bold: true } } });
  sheet.getRange(range).conditionalFormats.add("containsText", { text: "重複", format: { fill: red, font: { color: "#9C0006", bold: true } } });
  sheet.getRange(range).conditionalFormats.add("containsText", { text: "已核定但", format: { fill: red, font: { color: "#9C0006", bold: true } } });
  sheet.getRange(range).conditionalFormats.add("containsText", { text: "待補來源", format: { fill: amber, font: { color: "#7F6000", bold: true } } });
}

const doctor = wb.worksheets.getItem("醫師模式規則輸入");
extendMergedHeading(doctor, "S");
doctor.getRange("A4").values = [["已依來源工作簿預列其餘 8 位醫師。每個正式模式使用一列；同一醫師有多個模式時請新增列並使用不同規則編號。治療模式、支援規則、核定資料、來源文件與來源定位都完整後，才可發布到排班規則。"]];
doctor.getRange("R6:S6").values = [["來源文件／版本", "來源定位"]];
styleSourceColumns(doctor, "R7:S156", "R6:S6", [["R", 34], ["S", 28]]);
doctor.getRange("Q7:Q156").conditionalFormats.deleteAll();
const doctorChecks = [];
for (let r = 7; r <= 156; r++) doctorChecks.push([`=IF(LEN($B${r})=0,"",IF($N${r}="停用","停用",IF($N${r}="退回補件","退回補件",IF(COUNTIFS($A$7:$A$156,$A${r})>1,"規則編號重複",IF(OR(LEN($C${r})=0,LEN($D${r})=0,LEN($E${r})=0,LEN($F${r})=0,LEN($G${r})=0,LEN($H${r})=0,LEN($I${r})=0,LEN($K${r})=0,LEN($L${r})=0,LEN($M${r})=0,LEN($O${r})=0),IF($N${r}="已核定","已核定但資料未完整","待補欄位或核定"),IF(OR(LEN($R${r})=0,LEN($S${r})=0),IF($N${r}="已核定","已核定但缺來源依據","待補來源依據"),IF($N${r}="已核定","可發布","待主管核定")))))))`]);
doctor.getRange("Q7:Q156").formulas = doctorChecks;
addCheckFormatting(doctor, "Q7:Q156");

const mobility = wb.worksheets.getItem("流動層級規則輸入");
extendMergedHeading(mobility, "O");
mobility.getRange("A4").values = [["已預列正職 3 級與兼職 6 級。每個級別可新增多筆任務要求；每列使用不同規則編號。任務條件、版本、生效與核定資料、來源文件及來源定位都完整後，才可發布為流動崗位門檻。"]];
mobility.getRange("N6:O6").values = [["來源文件／版本", "來源定位"]];
styleSourceColumns(mobility, "N7:O126", "N6:O6", [["N", 34], ["O", 28]]);
mobility.getRange("M7:M126").conditionalFormats.deleteAll();
const mobilityChecks = [];
for (let r = 7; r <= 126; r++) mobilityChecks.push([`=IF($C${r}="","",IF($J${r}="停用","停用",IF($J${r}="退回補件","退回補件",IF(COUNTIFS($A$7:$A$126,$A${r})>1,"規則編號重複",IF(OR($A${r}="",$B${r}="",$D${r}="",$E${r}="",$F${r}="",$G${r}="",$H${r}="",$I${r}="",$K${r}=""),IF($J${r}="已核定","已核定但資料未完整","待補欄位或核定"),IF(OR($N${r}="",$O${r}=""),IF($J${r}="已核定","已核定但缺來源依據","待補來源依據"),IF($J${r}="已核定","可發布","待主管核定")))))))`]);
mobility.getRange("M7:M126").formulas = mobilityChecks;
addCheckFormatting(mobility, "M7:M126");

const grade = wb.worksheets.getItem("職級矩陣規則輸入");
extendMergedHeading(grade, "N");
grade.getRange("A4").values = [["已預列 Lv.1–Lv.10。每個職級可新增多筆正式條件；每列使用不同規則編號。正式條件、版本、生效與核定資料、來源文件及來源定位都完整後才可發布；職級異動仍須人工核定。"]];
grade.getRange("M6:N6").values = [["來源文件／版本", "來源定位"]];
styleSourceColumns(grade, "M7:N156", "M6:N6", [["M", 34], ["N", 28]]);
grade.getRange("L7:L156").conditionalFormats.deleteAll();
const gradeChecks = [];
for (let r = 7; r <= 156; r++) gradeChecks.push([`=IF($B${r}="","",IF($I${r}="停用","停用",IF($I${r}="退回補件","退回補件",IF(COUNTIFS($A$7:$A$156,$A${r})>1,"規則編號重複",IF(OR($A${r}="",$C${r}="",$D${r}="",$E${r}="",$F${r}="",$G${r}="",$H${r}="",$J${r}=""),IF($I${r}="已核定","已核定但資料未完整","待補欄位或核定"),IF(OR($M${r}="",$N${r}=""),IF($I${r}="已核定","已核定但缺來源依據","待補來源依據"),IF($I${r}="已核定","可發布","待主管核定")))))))`]);
grade.getRange("L7:L156").formulas = gradeChecks;
addCheckFormatting(grade, "L7:L156");

const checklist = wb.worksheets.getItem("檢核表項目輸入");
extendMergedHeading(checklist, "R");
checklist.getRange("A4").values = [["黃色欄位由主管填寫。系統只預列七類與五項影像分項，不提供臨床步驟；每個項目需保存來源文件與來源定位。操作項目、通過標準、證據方式、核定與來源都完整後，才會計入版本發布；修訂時請新增版本與項目列，不覆寫舊版。"]];
checklist.getRange("Q6:R6").values = [["來源文件／版本", "來源定位"]];
styleSourceColumns(checklist, "Q7:R106", "Q6:R6", [["Q", 34], ["R", 28]]);
checklist.getRange("P7:P106").conditionalFormats.deleteAll();
const checklistChecks = [];
for (let r = 7; r <= 106; r++) checklistChecks.push([`=IF($A${r}="","",IF($K${r}="否","停用項目",IF(COUNTIFS($A$7:$A$106,$A${r})>1,"項目鍵重複",IF(OR($B${r}="",$C${r}="",$C${r}="未建立",$D${r}="",$D${r}="未建立",$E${r}="",$F${r}="",$G${r}="",$H${r}="",$I${r}="",$J${r}="",$L${r}="",$M${r}="",$N${r}=""),IF($L${r}="已核定","已核定但資料未完整","待補欄位或核定"),IF(OR($Q${r}="",$R${r}=""),IF($L${r}="已核定","已核定但缺來源依據","待補來源依據"),IF($L${r}<>"已核定","待主管核定",IF(COUNTIFS($B$7:$B$106,$B${r},$D$7:$D$106,$D${r},$E$7:$E$106,$E${r},$F$7:$F$106,$F${r},$K$7:$K$106,"是")>1,"項次重複","可發布")))))))`]);
checklist.getRange("P7:P106").formulas = checklistChecks;
addCheckFormatting(checklist, "P7:P106");

const intake = wb.worksheets.getItem("正式資料收件");
for (let r = 12; r <= 15; r++) {
  const existing = intake.getRange(`F${r}`).values[0][0];
  if (typeof existing === "string" && !existing.includes("來源文件")) intake.getRange(`F${r}`).values = [[`${existing}、來源文件、來源定位`]];
}
intake.getRange("N12:N15").formulas = [12, 13, 14, 15].map((r) => [`=IF($M${r}="已完成","保存正式來源、來源定位與核定紀錄",IF($M${r}="待提供","向診所索取正式資料包",IF($M${r}="待補收件資料","補填收件日與收件人",IF($M${r}="已收件，待核定","到指定工作表逐列建檔、補來源依據、核定與發布","到指定流程完成內部處理"))))`]);

const dashboard = wb.worksheets.getItem("主管工作台");
dashboard.getRange("D20:D22").values = [["必填欄位、來源依據與核定資料完整"], ["任務條件、來源依據與核定資料完整"], ["職級條件、來源依據與核定資料完整"]];

const guide = wb.worksheets.getItem("主管操作導引");
guide.getRange("G15:H15").values = [["先登記收件，再逐列填入正式條件、來源文件與來源定位並核定", "外部資料均已收件，且正式內容、來源依據與核定資料完整"]];

const overview = wb.worksheets.getItem("續作總覽");
overview.getRange("A35:D35").values = [["正式資料來源追溯", 4, "逐列來源閘門已建立", "醫師、流動層級、職級矩陣與檢核表項目均需來源文件及來源定位；重複編號與缺來源不得發布"]];
overview.getRange("B35").format.numberFormat = "#,##0";

wb.recalculate();
await fs.mkdir(previewDir, { recursive: true });
for (const [name, range] of [
  ["醫師模式規則輸入", "A1:S16"], ["流動層級規則輸入", "A1:O18"], ["職級矩陣規則輸入", "A1:N20"],
  ["檢核表項目輸入", "A1:R18"], ["正式資料收件", "A1:N20"], ["主管工作台", "A19:E30"],
]) {
  const image = await wb.render({ sheetName: name, range, scale: 1.0, format: "png" });
  await fs.writeFile(`${previewDir}/${name}.png`, new Uint8Array(await image.arrayBuffer()));
}
for (const range of [
  "醫師模式規則輸入!A6:S16", "流動層級規則輸入!A6:O18", "職級矩陣規則輸入!A6:N20",
  "檢核表項目輸入!A6:R18", "正式資料收件!A11:N20", "主管工作台!A20:E30", "續作總覽!A32:D35",
]) console.log((await wb.inspect({ kind: "table", range, include: "values,formulas", tableMaxRows: 30, tableMaxCols: 22, maxChars: 30000 })).ndjson);
console.log((await wb.inspect({ kind: "match", searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!|#SPILL!|#CALC!", options: { useRegex: true, maxResults: 500 }, maxChars: 12000 })).ndjson);
const out = await SpreadsheetFile.exportXlsx(wb);
await out.save(path);
console.log(`SAVED ${path}`);

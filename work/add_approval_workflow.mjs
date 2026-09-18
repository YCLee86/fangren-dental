import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const path = "../outputs/clinic-assistant-model/assistant_skill_matrix_v1_pilot.xlsx";
const previewDir = "./approval-previews";
const wb = await SpreadsheetFile.importXlsx(await FileBlob.load(path));
const navy = "#1F5E78", amber = "#FFF2CC", paleBlue = "#EAF5FA", green = "#E2F0D9", red = "#FCE4D6";

const ability = wb.worksheets.getItem("試行能力狀態");
const familiarity = wb.worksheets.getItem("試行熟悉度");
const requirements = wb.worksheets.getItem("李醫師能力要求");
const qualifications = wb.worksheets.getItem("資格有效性");
const expansion = wb.worksheets.getItem("適配要求展開");

const abilityValues = ability.getRange("A7:L258").values;
const famValues = familiarity.getRange("A7:K20").values;
const reqValues = requirements.getRange("A7:L59").values;
const qualValues = qualifications.getRange("A7:L62").values;

const approvalRows = [];
for (const r of abilityValues) approvalRows.push([`ABIL|${r[0]}|${r[2]}`, "能力評等", r[1], r[2], r[4], r[4], "待核定", null, null, null, null]);
for (const r of famValues) approvalRows.push([`FAM|${r[0]}|${r[2]}`, "跟診熟悉度", r[1], r[2], r[4], r[4], "待核定", null, null, null, null]);
for (const r of reqValues.filter(r => r[10] === "待確認")) approvalRows.push([`REQ|${r[1]}|${r[4]}`, "共通技能要求", r[2], `${r[1]}／${r[4]}`, r[6], "納入必備", "待核定", null, null, null, null]);
for (const r of qualValues) approvalRows.push([`QUAL|${r[0]}|${r[2]}`, "資格有效性", r[1], r[2], r[4], r[3], "待核定", null, null, null, null]);

const sheet = wb.worksheets.add("主管核定中心");
sheet.showGridLines = false;
sheet.getRange("A2").values = [["主管核定中心"]];
sheet.getRange("A2:K2").format.font = { name: "Arial", size: 14, bold: true, color: "#263238" };
sheet.getRange("A3:K3").format.borders = { bottom: { style: "thin", color: "#B7C9D3" } };
sheet.getRange("A4").values = [["逐筆核定能力、跟診熟悉度、共通技能要求與資格。黃色欄位由主管填寫；核定後會回寫排班適配與班次檢核。"]];
sheet.getRange("A4:K4").format.font = { name: "Arial", size: 10, italic: true, color: "#607D8B" };
sheet.getRange("A6:H6").values = [["待核定總數", "能力評等", "跟診熟悉度", "共通技能要求", "資格有效性", "已核定", "退回／暫停", "完成率"]];
sheet.getRange("A7:H7").formulas = [[
  `=COUNTIFS($G$12:$G$${11 + approvalRows.length},"待核定")`,
  `=COUNTIFS($B$12:$B$${11 + approvalRows.length},"能力評等",$G$12:$G$${11 + approvalRows.length},"待核定")`,
  `=COUNTIFS($B$12:$B$${11 + approvalRows.length},"跟診熟悉度",$G$12:$G$${11 + approvalRows.length},"待核定")`,
  `=COUNTIFS($B$12:$B$${11 + approvalRows.length},"共通技能要求",$G$12:$G$${11 + approvalRows.length},"待核定")`,
  `=COUNTIFS($B$12:$B$${11 + approvalRows.length},"資格有效性",$G$12:$G$${11 + approvalRows.length},"待核定")`,
  `=COUNTIFS($G$12:$G$${11 + approvalRows.length},"核定通過")`,
  `=COUNTIFS($G$12:$G$${11 + approvalRows.length},"退回補件")+COUNTIFS($G$12:$G$${11 + approvalRows.length},"暫停")`,
  `=IF(COUNTA($A$12:$A$${11 + approvalRows.length})=0,0,1-A7/COUNTA($A$12:$A$${11 + approvalRows.length}))`,
]];
sheet.getRange("A6:H6").format = { fill: navy, font: { name: "Arial", size: 10, bold: true, color: "#FFFFFF" }, horizontalAlignment: "center" };
sheet.getRange("A7:H7").format = { fill: paleBlue, font: { name: "Arial", size: 10, bold: true, color: "#263238" }, horizontalAlignment: "center" };
sheet.getRange("H7").format.numberFormat = "0.0%";

const headers = ["核定鍵", "核定類型", "員工／治療", "核定對象", "目前狀態", "建議內容", "主管決定", "生效日", "核定人", "核定備註", "核定結果"];
sheet.getRange(`A11:K${11 + approvalRows.length}`).values = [headers, ...approvalRows];
const table = sheet.tables.add(`A11:K${11 + approvalRows.length}`, true, "SupervisorApprovals");
table.style = "TableStyleMedium2";
sheet.getRange("A11:K11").format = { fill: navy, font: { name: "Arial", size: 10, bold: true, color: "#FFFFFF" }, horizontalAlignment: "center", verticalAlignment: "center", wrapText: true };
sheet.getRange(`A12:K${11 + approvalRows.length}`).format.font = { name: "Arial", size: 10, color: "#263238" };
sheet.getRange(`G12:J${11 + approvalRows.length}`).format.fill = amber;
sheet.getRange(`K12:K${11 + approvalRows.length}`).format.fill = paleBlue;
const resultFormulas = [];
for (let r = 12; r <= 11 + approvalRows.length; r++) resultFormulas.push([`=IF($G${r}="核定通過","已核定",IF($G${r}="不納入","不納入",IF($G${r}="退回補件","退回補件",IF($G${r}="暫停","資格暫停","待主管核定"))))`]);
sheet.getRange(`K12:K${11 + approvalRows.length}`).formulas = resultFormulas;
sheet.getRange(`G12:G${11 + approvalRows.length}`).dataValidation = { rule: { type: "list", values: ["待核定", "核定通過", "退回補件", "暫停", "不納入"] } };
sheet.getRange(`H12:H${11 + approvalRows.length}`).format.numberFormat = "yyyy-mm-dd";
const widths = [38, 18, 18, 34, 18, 20, 16, 14, 16, 42, 18];
widths.forEach((w, i) => sheet.getRange(`${String.fromCharCode(65 + i)}:${String.fromCharCode(65 + i)}`).format.columnWidth = w);
sheet.freezePanes.freezeRows(11);
sheet.freezePanes.freezeColumns(2);
sheet.tabColor = navy;

const approvalEnd = 11 + approvalRows.length;
const abilityStatus = [], abilityApprover = [], abilityDate = [];
for (let i = 0; i < abilityValues.length; i++) {
  const r = i + 7, key = `ABIL|${abilityValues[i][0]}|${abilityValues[i][2]}`;
  abilityStatus.push([`=IF($E${r}="未評估","未建立",_xlfn.XLOOKUP("${key}",'主管核定中心'!$A$12:$A$${approvalEnd},'主管核定中心'!$K$12:$K$${approvalEnd},"待主管核定",0))`]);
  abilityApprover.push([`=_xlfn.XLOOKUP("${key}",'主管核定中心'!$A$12:$A$${approvalEnd},'主管核定中心'!$I$12:$I$${approvalEnd},"",0)`]);
  abilityDate.push([`=_xlfn.XLOOKUP("${key}",'主管核定中心'!$A$12:$A$${approvalEnd},'主管核定中心'!$H$12:$H$${approvalEnd},"",0)`]);
}
ability.getRange("F7:F258").formulas = abilityStatus;
ability.getRange("I7:I258").formulas = abilityApprover;
ability.getRange("J7:J258").formulas = abilityDate;

const famStatus = [], famApprover = [], famDate = [];
for (let i = 0; i < famValues.length; i++) {
  const r = i + 7, key = `FAM|${famValues[i][0]}|${famValues[i][2]}`;
  famStatus.push([`=IF($E${r}="未評估","未建立",_xlfn.XLOOKUP("${key}",'主管核定中心'!$A$12:$A$${approvalEnd},'主管核定中心'!$K$12:$K$${approvalEnd},"待主管核定",0))`]);
  famApprover.push([`=_xlfn.XLOOKUP("${key}",'主管核定中心'!$A$12:$A$${approvalEnd},'主管核定中心'!$I$12:$I$${approvalEnd},"",0)`]);
  famDate.push([`=_xlfn.XLOOKUP("${key}",'主管核定中心'!$A$12:$A$${approvalEnd},'主管核定中心'!$H$12:$H$${approvalEnd},"",0)`]);
}
familiarity.getRange("F7:F20").formulas = famStatus;
familiarity.getRange("I7:I20").formulas = famApprover;
familiarity.getRange("J7:J20").formulas = famDate;

requirements.getRange("M6").values = [["要求查找鍵"]];
requirements.getRange("M6").format = { fill: navy, font: { name: "Arial", size: 10, bold: true, color: "#FFFFFF" }, horizontalAlignment: "center" };
const reqKeys = [], reqStatuses = [];
for (let i = 0; i < reqValues.length; i++) {
  const row = i + 7, key = `${reqValues[i][1]}|${reqValues[i][4]}`;
  reqKeys.push([key]);
  if (reqValues[i][10] === "待確認") reqStatuses.push([`=IF(_xlfn.XLOOKUP("REQ|${key}",'主管核定中心'!$A$12:$A$${approvalEnd},'主管核定中心'!$K$12:$K$${approvalEnd},"待主管核定",0)="已核定","已確認",IF(_xlfn.XLOOKUP("REQ|${key}",'主管核定中心'!$A$12:$A$${approvalEnd},'主管核定中心'!$K$12:$K$${approvalEnd},"待主管核定",0)="不納入","不納入","待確認"))`]);
  else reqStatuses.push([null]);
}
requirements.getRange("M7:M59").values = reqKeys;
for (let i = 0; i < reqValues.length; i++) if (reqValues[i][10] === "待確認") requirements.getRange(`K${i + 7}`).formulas = [reqStatuses[i]];
requirements.getRange("M:M").format.columnWidth = 46;

const qualStatuses = [];
for (let i = 0; i < qualValues.length; i++) {
  const r = i + 7, key = `QUAL|${qualValues[i][0]}|${qualValues[i][2]}`;
  qualStatuses.push([`=IF($D${r}="未評估","未建立",IF(_xlfn.XLOOKUP("${key}",'主管核定中心'!$A$12:$A$${approvalEnd},'主管核定中心'!$K$12:$K$${approvalEnd},"待主管核定",0)="已核定",IF(TODAY()>$G${r},"逾期","有效"),_xlfn.XLOOKUP("${key}",'主管核定中心'!$A$12:$A$${approvalEnd},'主管核定中心'!$K$12:$K$${approvalEnd},"待主管核定",0)))`]);
}
qualifications.getRange("E7:E62").formulas = qualStatuses;

const expansionValues = expansion.getRange("A7:Q734").values;
const reqLookupFormulas = [];
for (let i = 0; i < expansionValues.length; i++) {
  const r = i + 7;
  reqLookupFormulas.push([`=_xlfn.XLOOKUP($C${r}&"|"&$G${r},'李醫師能力要求'!$M$7:$M$59,'李醫師能力要求'!$K$7:$K$59,"待確認",0)`]);
}
expansion.getRange("I7:I734").formulas = reqLookupFormulas;

const overview = wb.worksheets.getItem("續作總覽");
overview.getRange("C11:D11").values = [["核定流程已建立", "能力、熟悉度、共通要求與資格均由主管核定中心回寫"]];

wb.recalculate();
await fs.mkdir(previewDir, { recursive: true });
const preview = await wb.render({ sheetName: "主管核定中心", range: "A1:K30", scale: 1, format: "png" });
await fs.writeFile(`${previewDir}/主管核定中心.png`, new Uint8Array(await preview.arrayBuffer()));
console.log((await wb.inspect({ kind: "table", range: "主管核定中心!A6:K18", include: "values,formulas", tableMaxRows: 20, tableMaxCols: 14, maxChars: 16000 })).ndjson);
console.log((await wb.inspect({ kind: "match", searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!|#SPILL!|#CALC!", options: { useRegex: true, maxResults: 300 }, maxChars: 12000 })).ndjson);
const out = await SpreadsheetFile.exportXlsx(wb);
await out.save(path);
console.log(`SAVED ${path}`);

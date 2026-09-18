import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const path = "../outputs/clinic-assistant-model/assistant_skill_matrix_v1_pilot.xlsx";
const previewDir = "./incident-preview";
const wb = await SpreadsheetFile.importXlsx(await FileBlob.load(path));

const navy = "#1F5E78";
const amber = "#FFF2CC";
const paleBlue = "#EAF5FA";
const red = "#FCE4D6";
const line = "#B7C9D3";

const sheet = wb.worksheets.add("事件與限制");
sheet.showGridLines = false;
sheet.getRange("A2").values = [["事件分級、暫時限制與資格暫停"]];
sheet.getRange("A2:R2").format.font = { name: "Arial", size: 14, bold: true, color: "#263238" };
sheet.getRange("A3:R3").format.borders = { bottom: { style: "thin", color: line } };
sheet.getRange("A4").values = [["只處理直接相關技能。第三級事件由主管決定是否暫停技能資格；安全限制在複核完成前維持。"]];
sheet.getRange("A4:R4").format.font = { name: "Arial", size: 10, italic: true, color: "#607D8B" };

const headers = ["事件編號", "發生日", "員工編號", "姓名", "技能代碼", "醫師", "模式代碼", "事件級別", "建議處理", "實際影響", "潛在影響", "事件說明", "主管決定", "限制起日", "限制迄日", "核定人", "限制狀態", "調查／複評狀態"];
const rows = Array.from({ length: 100 }, () => Array(headers.length).fill(null));
sheet.getRange("A6:R106").values = [headers, ...rows];
const table = sheet.tables.add("A6:R106", true, "IncidentRestrictions");
table.style = "TableStyleMedium2";
sheet.getRange("A6:R6").format = { fill: navy, font: { name: "Arial", size: 10, bold: true, color: "#FFFFFF" }, horizontalAlignment: "center", verticalAlignment: "center", wrapText: true };
sheet.getRange("A7:R106").format.font = { name: "Arial", size: 10, color: "#263238" };
sheet.getRange("A7:C106").format.fill = amber;
sheet.getRange("E7:H106").format.fill = amber;
sheet.getRange("J7:P106").format.fill = amber;
sheet.getRange("R7:R106").format.fill = amber;
sheet.getRange("D7:D106").format.fill = paleBlue;
sheet.getRange("I7:I106").format.fill = paleBlue;
sheet.getRange("Q7:Q106").format.fill = paleBlue;

const formulas = [];
for (let r = 7; r <= 106; r++) {
  formulas.push([
    `=IF($C${r}="","",_xlfn.XLOOKUP($C${r},'試行員工主檔'!$A$7:$A$20,'試行員工主檔'!$B$7:$B$20,"員工未建立",0))`,
    `=IF($H${r}="","",IF($H${r}="第一級","記錄觀察",IF($H${r}="第二級","檢視條件排班與 1:1 支援","暫停直接相關技能資格")))`,
    `=IF($A${r}="","",IF(OR($M${r}="",$N${r}="",$P${r}=""),"資料未完整",IF(OR($M${r}="暫停技能資格",$M${r}="條件排班 1:1"),IF(OR($O${r}="",$O${r}>=TODAY()),"生效中","已結束"),IF($M${r}="補訓後複評","待補訓／複評","無限制"))))`,
  ]);
}
sheet.getRange("D7:D106").formulas = formulas.map((x) => [x[0]]);
sheet.getRange("I7:I106").formulas = formulas.map((x) => [x[1]]);
sheet.getRange("Q7:Q106").formulas = formulas.map((x) => [x[2]]);
for (const c of ["B", "N", "O"]) sheet.getRange(`${c}7:${c}106`).format.numberFormat = "yyyy-mm-dd";
sheet.getRange("C7:C106").dataValidation = { rule: { type: "list", formula1: "'試行員工主檔'!$A$7:$A$20" } };
sheet.getRange("E7:E106").dataValidation = { rule: { type: "list", formula1: "'技能主檔_V1'!$A$7:$A$24" } };
sheet.getRange("G7:G106").dataValidation = { rule: { type: "list", formula1: "'李醫師治療模式'!$A$7:$A$19" } };
sheet.getRange("H7:H106").dataValidation = { rule: { type: "list", values: ["第一級", "第二級", "第三級"] } };
sheet.getRange("M7:M106").dataValidation = { rule: { type: "list", values: ["僅記錄觀察", "條件排班 1:1", "暫停技能資格", "補訓後複評", "結案無限制"] } };
sheet.getRange("R7:R106").dataValidation = { rule: { type: "list", values: ["待調查", "調查中", "待補訓", "待複評", "已結案"] } };
sheet.getRange("Q7:Q106").conditionalFormats.add("containsText", { text: "生效中", format: { fill: red, font: { color: "#9C0006", bold: true } } });
sheet.getRange("Q7:Q106").conditionalFormats.add("containsText", { text: "未完整", format: { fill: amber, font: { color: "#7F6000", bold: true } } });
const widths = [16, 14, 14, 16, 28, 18, 22, 14, 30, 30, 30, 42, 20, 14, 14, 16, 18, 20];
widths.forEach((width, i) => sheet.getRange(`${String.fromCharCode(65 + i)}:${String.fromCharCode(65 + i)}`).format.columnWidth = width);
sheet.freezePanes.freezeRows(6);
sheet.freezePanes.freezeColumns(3);
sheet.tabColor = "#C00000";

const ability = wb.worksheets.getItem("試行能力狀態");
const abilityValues = ability.getRange("A7:L258").values;
const abilityStatuses = [];
for (let i = 0; i < abilityValues.length; i++) {
  const r = i + 7;
  const approvalKey = `ABIL|${abilityValues[i][0]}|${abilityValues[i][2]}`;
  abilityStatuses.push([
    `=IF(COUNTIFS('事件與限制'!$C$7:$C$106,$A${r},'事件與限制'!$E$7:$E$106,$C${r},'事件與限制'!$M$7:$M$106,"暫停技能資格",'事件與限制'!$Q$7:$Q$106,"生效中")>0,"資格暫停",IF($E${r}="未評估","未建立",_xlfn.XLOOKUP("${approvalKey}",'主管核定中心'!$A$12:$A$372,'主管核定中心'!$K$12:$K$372,"待主管核定",0)))`,
  ]);
}
ability.getRange("F7:F258").formulas = abilityStatuses;

const qualification = wb.worksheets.getItem("資格有效性");
const qualificationValues = qualification.getRange("A7:L62").values;
const qualificationStatuses = [];
for (let i = 0; i < qualificationValues.length; i++) {
  const r = i + 7;
  const recoveryKey = `REC|${qualificationValues[i][0]}|${qualificationValues[i][2]}`;
  qualificationStatuses.push([
    `=IF(COUNTIFS('事件與限制'!$C$7:$C$106,$A${r},'事件與限制'!$E$7:$E$106,$C${r},'事件與限制'!$M$7:$M$106,"暫停技能資格",'事件與限制'!$Q$7:$Q$106,"生效中")>0,"資格暫停",IF(_xlfn.XLOOKUP("${recoveryKey}",'資格恢復處理'!$A$7:$A$62,'資格恢復處理'!$S$7:$S$62,"",0)="資格已恢復",IF(TODAY()>$G${r},"逾期","有效"),_xlfn.XLOOKUP("${recoveryKey}",'資格恢復處理'!$A$7:$A$62,'資格恢復處理'!$F$7:$F$62,"未建立",0)))`,
  ]);
}
qualification.getRange("E7:E62").formulas = qualificationStatuses;

const upgrade = wb.worksheets.getItem("能力升級候選");
const upgradeValues = upgrade.getRange("A7:R258").values;
const candidateStatuses = [];
for (let r = 7; r <= 258; r++) {
  candidateStatuses.push([
    `=IF($E${r}<>"Ø","不適用",IF(COUNTIFS('事件與限制'!$C$7:$C$106,$B${r},'事件與限制'!$E$7:$E$106,$D${r},'事件與限制'!$Q$7:$Q$106,"生效中")>0,"資格限制中",IF($F${r}<>"已核定","先完成基準核定",IF($K${r}>0,"有關鍵遺漏，先檢討",IF($G${r}<3,"尚缺成功觀察",IF($J${r}<2,"觀察日期不足",IF($L${r}<1,"待兩個月面談","可送主管核定")))))))`,
  ]);
}
upgrade.getRange("M7:M258").formulas = candidateStatuses;

const dashboard = wb.worksheets.getItem("主管工作台");
dashboard.getRange("A18:E18").values = [["事件限制", null, "事件與限制", "完成調查、補訓與複評後解除", null]];
dashboard.getRange("B18").formulas = [[`=COUNTIFS('事件與限制'!$Q$7:$Q$106,"生效中")`]];
dashboard.getRange("E18").formulas = [[`=IF(B18=0,"無生效限制","需處理事件限制")`]];
dashboard.getRange("A18:E18").format.font = { name: "Arial", size: 10, color: "#263238" };
dashboard.getRange("A18:E18").format.borders = { bottom: { style: "hair", color: line } };
dashboard.getRange("B18").format = { fill: "#DDEBF7", font: { name: "Arial", size: 10, bold: true, color: "#263238" }, horizontalAlignment: "right", numberFormat: "#,##0" };
dashboard.getRange("E18").conditionalFormats.add("containsText", { text: "需", format: { fill: amber, font: { color: "#7F6000", bold: true } } });
dashboard.getRange("G18:H18").values = [["7", "處理事件、限制與解除"]];
dashboard.getRange("I18:N18").values = [["事件與限制", null, null, null, null, null]];
dashboard.getRange("G18:N18").format.font = { name: "Arial", size: 10, color: "#263238" };
dashboard.getRange("G18").format = { fill: "#DDEBF7", font: { name: "Arial", size: 10, bold: true, color: "#263238" }, horizontalAlignment: "center" };
dashboard.getRange("G18:N18").format.borders = { bottom: { style: "hair", color: line } };

const overview = wb.worksheets.getItem("續作總覽");
overview.getRange("C19:D19").values = [["事件與限制流程已建立", "直接相關技能可暫停，結束後回復原核定狀態"]];

wb.recalculate();
await fs.mkdir(previewDir, { recursive: true });
for (const [name, range] of [["事件與限制", "A1:R18"], ["主管工作台", "A1:N19"]]) {
  const image = await wb.render({ sheetName: name, range, scale: 1.3, format: "png" });
  await fs.writeFile(`${previewDir}/${name}.png`, new Uint8Array(await image.arrayBuffer()));
}
for (const range of ["事件與限制!A1:R12", "主管工作台!A1:N19", "試行能力狀態!A6:F12", "資格有效性!A6:G12"]) {
  console.log((await wb.inspect({ kind: "table", range, include: "values,formulas", tableMaxRows: 20, tableMaxCols: 20, maxChars: 15000 })).ndjson);
}
console.log((await wb.inspect({ kind: "match", searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!|#SPILL!|#CALC!", options: { useRegex: true, maxResults: 300 }, maxChars: 10000 })).ndjson);
const out = await SpreadsheetFile.exportXlsx(wb);
await out.save(path);
console.log(`SAVED ${path}`);

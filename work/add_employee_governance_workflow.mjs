import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const path = "../outputs/clinic-assistant-model/assistant_skill_matrix_v1_pilot.xlsx";
const previewDir = "./employee-governance-previews";
const wb = await SpreadsheetFile.importXlsx(await FileBlob.load(path));

const navy = "#1F5E78";
const amber = "#FFF2CC";
const paleBlue = "#EAF5FA";
const green = "#E2F0D9";
const red = "#FCE4D6";
const line = "#B7C9D3";

const master = wb.worksheets.getItem("試行員工主檔");
const employees = master.getRange("A7:D20").values;

const sheet = wb.worksheets.add("員工治理核定");
sheet.showGridLines = false;
sheet.getRange("A2").values = [["員工能力路徑、培訓歸屬與正式職級核定"]];
sheet.getRange("A2:P2").format.font = { name: "Arial", size: 14, bold: true, color: "#263238" };
sheet.getRange("A3:P3").format.borders = { bottom: { style: "thin", color: line } };
sheet.getRange("A4").values = [["每次異動新增一筆，不覆蓋舊紀錄。能力路徑、組別、主管與正式職級都須人工核定；正式職級不直接作為排班放行條件。兩位兼職中有一人適用正職能力標準，身分仍待主管指定。"]];
sheet.getRange("A4:P4").format.font = { name: "Arial", size: 10, italic: true, color: "#607D8B" };

const headers = ["治理紀錄鍵", "員工編號", "姓名", "聘用型態", "原表職級", "核定能力路徑", "主要培訓組", "日常主管", "新正式職級", "生效日", "核定狀態", "核定人", "核定原因", "收件檢核", "歷程狀態", "生效員工鍵"];
const rows = Array.from({ length: 100 }, (_, i) => {
  if (i >= employees.length) return Array(16).fill(null);
  const [employeeId] = employees[i];
  return [`GOV-${employeeId}-001`, employeeId, null, null, null, null, null, null, null, null, "待核定", null, null, null, null, null];
});
sheet.getRange("A6:P106").values = [headers, ...rows];
const table = sheet.tables.add("A6:P106", true, "EmployeeGovernanceApproval");
table.style = "TableStyleMedium2";
sheet.getRange("A6:P6").format = { fill: navy, font: { name: "Arial", size: 10, bold: true, color: "#FFFFFF" }, horizontalAlignment: "center", verticalAlignment: "center", wrapText: true };
sheet.getRange("A7:P106").format.font = { name: "Arial", size: 10, color: "#263238" };
sheet.getRange("A7:B106").format.fill = amber;
sheet.getRange("C7:E106").format.fill = paleBlue;
sheet.getRange("F7:M106").format.fill = amber;
sheet.getRange("N7:P106").format.fill = paleBlue;

const sourceFormulas = [];
const workflowFormulas = [];
for (let r = 7; r <= 106; r++) {
  sourceFormulas.push([
    `=IF($B${r}="","",_xlfn.XLOOKUP($B${r},'試行員工主檔'!$A$7:$A$20,'試行員工主檔'!$B$7:$B$20,"未建立",0))`,
    `=IF($B${r}="","",_xlfn.XLOOKUP($B${r},'試行員工主檔'!$A$7:$A$20,'試行員工主檔'!$C$7:$C$20,"未建立",0))`,
    `=IF($B${r}="","",_xlfn.XLOOKUP($B${r},'試行員工主檔'!$A$7:$A$20,'試行員工主檔'!$D$7:$D$20,"未建立",0))`,
  ]);
  workflowFormulas.push([
    `=IF($B${r}="","",IF($K${r}="停用","停用",IF($K${r}="退回補件","退回補件",IF(OR($A${r}="",$F${r}="",$G${r}="",$H${r}="",$I${r}="",$J${r}="",$L${r}="",$M${r}=""),IF($K${r}="已核定","已核定但資料未完整","待補欄位或核定"),IF($K${r}="已核定","可生效","待主管核定")))))`,
    `=IF($B${r}="","",IF($N${r}<>"可生效","未生效",IF(COUNTIFS($B$7:$B$106,$B${r},$J$7:$J$106,$J${r},$N$7:$N$106,"可生效")>1,"同日重複核定",IF($J${r}>TODAY(),"待生效",IF(COUNTIFS($B$7:$B$106,$B${r},$N$7:$N$106,"可生效",$J$7:$J$106,">"&$J${r},$J$7:$J$106,"<="&TODAY())>0,"已由後續紀錄取代","生效中")))))`,
    `=IF($O${r}="生效中",$B${r},"")`,
  ]);
}
sheet.getRange("C7:E106").formulas = sourceFormulas;
sheet.getRange("N7:P106").formulas = workflowFormulas;

sheet.getRange("F7:F106").dataValidation = { rule: { type: "list", values: ["正職助理路徑", "兼職流動路徑", "主管指定其他路徑"] } };
sheet.getRange("I7:I106").dataValidation = { rule: { type: "list", values: ["Lv.1", "Lv.2", "Lv.3", "Lv.4", "Lv.5", "Lv.6", "Lv.7", "Lv.8", "Lv.9", "Lv.10"] } };
sheet.getRange("K7:K106").dataValidation = { rule: { type: "list", values: ["待核定", "已核定", "退回補件", "停用"] } };
sheet.getRange("J7:J106").format.numberFormat = "yyyy-mm-dd";
sheet.getRange("N7:N106").conditionalFormats.add("containsText", { text: "可生效", format: { fill: green, font: { color: "#375623", bold: true } } });
sheet.getRange("N7:N106").conditionalFormats.add("containsText", { text: "未完整", format: { fill: red, font: { color: "#9C0006", bold: true } } });
sheet.getRange("N7:N106").conditionalFormats.add("containsText", { text: "待補", format: { fill: amber, font: { color: "#7F6000", bold: true } } });
sheet.getRange("O7:O106").conditionalFormats.add("containsText", { text: "生效中", format: { fill: green, font: { color: "#375623", bold: true } } });
sheet.getRange("O7:O106").conditionalFormats.add("containsText", { text: "重複", format: { fill: red, font: { color: "#9C0006", bold: true } } });

const widths = [22, 14, 16, 14, 14, 22, 18, 18, 16, 14, 16, 16, 36, 24, 22, 18];
for (let i = 0; i < widths.length; i++) sheet.getRange(`${String.fromCharCode(65 + i)}:${String.fromCharCode(65 + i)}`).format.columnWidth = widths[i];
sheet.freezePanes.freezeRows(6);
sheet.freezePanes.freezeColumns(2);
sheet.tabColor = "#F4B183";

master.getRange("A4").values = [["聘用型態與原表職級保留來源資料；能力路徑、培訓組、主管與目前核定職級由員工治理核定的生效紀錄回寫。正式職級不直接作為排班放行條件。"]];
master.getRange("J6:L6").values = [["目前核定職級", "治理核定狀態", "治理生效日"]];
master.getRange("J6:L6").format = { fill: navy, font: { name: "Arial", size: 10, bold: true, color: "#FFFFFF" }, horizontalAlignment: "center", verticalAlignment: "center", wrapText: true };
master.getRange("J7:L20").format = { fill: paleBlue, font: { name: "Arial", size: 10, color: "#263238" } };
master.getRange("E7:G20").format.fill = paleBlue;
const currentRows = [];
for (let r = 7; r <= 20; r++) {
  currentRows.push([
    `=IF($A${r}="","",_xlfn.XLOOKUP($A${r},'員工治理核定'!$P$7:$P$106,'員工治理核定'!$F$7:$F$106,"待主管指定",0))`,
    `=IF($A${r}="","",_xlfn.XLOOKUP($A${r},'員工治理核定'!$P$7:$P$106,'員工治理核定'!$G$7:$G$106,"",0))`,
    `=IF($A${r}="","",_xlfn.XLOOKUP($A${r},'員工治理核定'!$P$7:$P$106,'員工治理核定'!$H$7:$H$106,"",0))`,
    `=IF($A${r}="","",_xlfn.XLOOKUP($A${r},'員工治理核定'!$P$7:$P$106,'員工治理核定'!$I$7:$I$106,"待主管核定",0))`,
    `=IF($A${r}="","",IF(COUNTIFS('員工治理核定'!$P$7:$P$106,$A${r})>0,"已核定生效",IF(COUNTIFS('員工治理核定'!$B$7:$B$106,$A${r})>0,"待主管核定","未建立")))`,
    `=IF($A${r}="","",_xlfn.XLOOKUP($A${r},'員工治理核定'!$P$7:$P$106,'員工治理核定'!$J$7:$J$106,"",0))`,
  ]);
}
master.getRange("E7:G20").formulas = currentRows.map((r) => r.slice(0, 3));
master.getRange("J7:L20").formulas = currentRows.map((r) => r.slice(3));
master.getRange("L7:L20").format.numberFormat = "yyyy-mm-dd";
master.getRange("E:E").format.columnWidth = 22;
master.getRange("F:G").format.columnWidth = 18;
master.getRange("J:K").format.columnWidth = 18;
master.getRange("L:L").format.columnWidth = 16;

const dashboard = wb.worksheets.getItem("主管工作台");
dashboard.getRange("A25:E25").values = [["員工治理核定", null, "員工治理核定", "能力路徑、培訓組、主管、職級、生效日與核定資料完整", null]];
dashboard.getRange("B25").formulas = [[`=COUNTIFS('員工治理核定'!$B$7:$B$106,"<>",'員工治理核定'!$N$7:$N$106,"<>可生效",'員工治理核定'!$K$7:$K$106,"<>停用")`]];
dashboard.getRange("E25").formulas = [[`=IF(B25=0,"無待核定員工治理紀錄","仍有 "&B25&" 筆待補或核定")`]];
dashboard.getRange("A25:E25").format.font = { name: "Arial", size: 10, color: "#263238" };
dashboard.getRange("A25:E25").format.borders = { bottom: { style: "hair", color: line } };
dashboard.getRange("B25").format = { fill: "#DDEBF7", font: { name: "Arial", size: 10, bold: true, color: "#263238" }, horizontalAlignment: "right", numberFormat: "#,##0" };
dashboard.getRange("E25").format = { fill: amber, font: { name: "Arial", size: 10, bold: true, color: "#7F6000" } };
dashboard.getRange("H13:I13").values = [["完成員工治理、能力、熟悉度、要求、資格及支援者核定", "員工治理核定、主管核定中心、支援者資格核定"]];

const overview = wb.worksheets.getItem("續作總覽");
overview.getRange("A28:D28").values = [["員工治理核定", 14, "流程已建立", "能力路徑、培訓組、主管與正式職級採人工核定並保留異動紀錄"]];
overview.getRange("B28").format.numberFormat = "#,##0";

wb.recalculate();
await fs.mkdir(previewDir, { recursive: true });
for (const [name, range] of [["員工治理核定", "A1:P22"], ["試行員工主檔", "A1:L20"], ["主管工作台", "A11:E25"]]) {
  const image = await wb.render({ sheetName: name, range, scale: 1.15, format: "png" });
  await fs.writeFile(`${previewDir}/${name}.png`, new Uint8Array(await image.arrayBuffer()));
}
for (const range of ["員工治理核定!A6:P20", "試行員工主檔!A6:L20", "主管工作台!A20:E25", "續作總覽!A24:D28"]) {
  console.log((await wb.inspect({ kind: "table", range, include: "values,formulas", tableMaxRows: 20, tableMaxCols: 18, maxChars: 18000 })).ndjson);
}
console.log((await wb.inspect({ kind: "match", searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!|#SPILL!|#CALC!", options: { useRegex: true, maxResults: 300 }, maxChars: 10000 })).ndjson);
const out = await SpreadsheetFile.exportXlsx(wb);
await out.save(path);
console.log(`SAVED ${path}`);

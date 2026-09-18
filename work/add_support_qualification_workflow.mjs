import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const path = "../outputs/clinic-assistant-model/assistant_skill_matrix_v1_pilot.xlsx";
const previewDir = "./support-qualification-previews";
const wb = await SpreadsheetFile.importXlsx(await FileBlob.load(path));

const navy = "#1F5E78";
const amber = "#FFF2CC";
const paleBlue = "#EAF5FA";
const green = "#E2F0D9";
const red = "#FCE4D6";
const line = "#B7C9D3";

const fit = wb.worksheets.getItem("排班適配試算");
const fitRows = fit.getRange("A7:V188").values;
const rows = fitRows.map((r) => [
  `SUP|${r[0]}|${r[2]}`,
  r[0], r[1], r[2], r[4], r[6], r[18], r[20], null,
  "待核定", null, null, null, null, null, null,
]);

const sheet = wb.worksheets.add("支援者資格核定");
sheet.showGridLines = false;
sheet.getRange("A2").values = [["完整支援者與技術備援者資格核定"]];
sheet.getRange("A2:P2").format.font = { name: "Arial", size: 14, bold: true, color: "#263238" };
sheet.getRange("A3:P3").format.borders = { bottom: { style: "thin", color: line } };
sheet.getRange("A4").values = [["完整支援者最多 2 個一般名額並可支援高複雜度；技術備援者最多 1 個一般名額，不能支援高複雜度。最終資格由主管核定。"]];
sheet.getRange("A4:P4").format.font = { name: "Arial", size: 10, italic: true, color: "#607D8B" };
const headers = ["支援資格鍵", "員工編號", "姓名", "模式代碼", "治療項目", "複雜度", "能力試算結果", "正式適配狀態", "建議支援類型", "主管決定", "生效日", "核定人", "核定備註", "支援資格結果", "核定名額上限", "可支援高複雜度"];
sheet.getRange("A6:P188").values = [headers, ...rows];
const table = sheet.tables.add("A6:P188", true, "SupportQualifications");
table.style = "TableStyleMedium2";
sheet.getRange("A6:P6").format = { fill: navy, font: { name: "Arial", size: 10, bold: true, color: "#FFFFFF" }, horizontalAlignment: "center", verticalAlignment: "center", wrapText: true };
sheet.getRange("A7:P188").format.font = { name: "Arial", size: 10, color: "#263238" };
sheet.getRange("I7:I188").format.fill = paleBlue;
sheet.getRange("J7:M188").format.fill = amber;
sheet.getRange("N7:P188").format.fill = paleBlue;

const formulas = [];
for (let r = 7; r <= 188; r++) {
  formulas.push([
    `=IF($G${r}<>"初步可獨立","不建議",IF($H${r}="初步可獨立","完整支援者","技術備援者"))`,
    `=IF($J${r}="暫停","資格暫停",IF($J${r}="不核定","不核定",IF($J${r}="核定完整支援者",IF($I${r}<>"完整支援者","核定條件未達",IF(OR($K${r}="",$L${r}=""),"核定資料未完整","完整支援者")),IF($J${r}="核定技術備援者",IF(AND($I${r}<>"完整支援者",$I${r}<>"技術備援者"),"核定條件未達",IF(OR($K${r}="",$L${r}=""),"核定資料未完整","技術備援者")),"待主管核定"))))`,
    `=IF($N${r}="完整支援者",2,IF($N${r}="技術備援者",1,0))`,
    `=IF($N${r}="完整支援者","是","否")`,
  ]);
}
sheet.getRange("I7:I188").formulas = formulas.map((x) => [x[0]]);
sheet.getRange("N7:P188").formulas = formulas.map((x) => x.slice(1));
sheet.getRange("J7:J188").dataValidation = { rule: { type: "list", values: ["待核定", "核定完整支援者", "核定技術備援者", "不核定", "暫停"] } };
sheet.getRange("K7:K188").format.numberFormat = "yyyy-mm-dd";
sheet.getRange("N7:N188").conditionalFormats.add("containsText", { text: "完整支援者", format: { fill: green, font: { color: "#375623", bold: true } } });
sheet.getRange("N7:N188").conditionalFormats.add("containsText", { text: "未達", format: { fill: red, font: { color: "#9C0006", bold: true } } });
sheet.getRange("N7:N188").conditionalFormats.add("containsText", { text: "未完整", format: { fill: amber, font: { color: "#7F6000", bold: true } } });
const widths = [38, 14, 16, 24, 22, 16, 22, 28, 20, 22, 14, 16, 36, 20, 16, 20];
for (let i = 0; i < widths.length; i++) sheet.getRange(`${String.fromCharCode(65 + i)}:${String.fromCharCode(65 + i)}`).format.columnWidth = widths[i];
sheet.freezePanes.freezeRows(6);
sheet.freezePanes.freezeColumns(3);
sheet.tabColor = navy;

const assign = wb.worksheets.getItem("排班配置輸入");
const roleChecks = [], configStatuses = [];
for (let r = 7; r <= 66; r++) {
  roleChecks.push([
    `=IF($E${r}="","",IF($E${r}="主跟診",$J${r},IF($E${r}="短時支援",_xlfn.XLOOKUP($C${r},'RPD支援者候選'!$A$7:$A$20,'RPD支援者候選'!$H$7:$H$20,"未建立",0),IF($E${r}="學習觀摩","學習觀摩，不計正式人力",IF(OR($E${r}="完整支援",$E${r}="技術備援",$E${r}="流動",$E${r}="第二櫃台"),IF(AND($E${r}="技術備援",_xlfn.XLOOKUP($H${r},'李醫師治療模式'!$A$7:$A$19,'李醫師治療模式'!$F$7:$F$19,"",0)="高複雜度"),"高複雜度不可由技術備援",IF($E${r}="完整支援",IF(_xlfn.XLOOKUP("SUP|"&$C${r}&"|"&$H${r},'支援者資格核定'!$A$7:$A$188,'支援者資格核定'!$N$7:$N$188,"未建立",0)<>"完整支援者","需要完整支援者",IF($F${r}>_xlfn.XLOOKUP("SUP|"&$C${r}&"|"&$H${r},'支援者資格核定'!$A$7:$A$188,'支援者資格核定'!$O$7:$O$188,0,0),"支援名額超過核定上限","支援資格通過")),IF(OR(_xlfn.XLOOKUP("SUP|"&$C${r}&"|"&$H${r},'支援者資格核定'!$A$7:$A$188,'支援者資格核定'!$N$7:$N$188,"未建立",0)="完整支援者",_xlfn.XLOOKUP("SUP|"&$C${r}&"|"&$H${r},'支援者資格核定'!$A$7:$A$188,'支援者資格核定'!$N$7:$N$188,"未建立",0)="技術備援者"),IF($F${r}>_xlfn.XLOOKUP("SUP|"&$C${r}&"|"&$H${r},'支援者資格核定'!$A$7:$A$188,'支援者資格核定'!$O$7:$O$188,0,0),"支援名額超過核定上限","支援資格通過"),"支援資格未核定"))),"角色未定義")))))`,
  ]);
  configStatuses.push([
    `=IF($B${r}="","",IF($P${r}>0,"時段衝突",IF($E${r}="主跟診",IF(LEFT($K${r},1)="待","候選，待完成資格","已檢核"),IF(OR($E${r}="完整支援",$E${r}="技術備援",$E${r}="流動",$E${r}="第二櫃台"),IF($K${r}="支援資格通過","已檢核",$K${r}),$K${r}))))`,
  ]);
}
assign.getRange("K7:K66").formulas = roleChecks;
assign.getRange("Q7:Q66").formulas = configStatuses;
assign.getRange("K7:K66").conditionalFormats.add("containsText", { text: "超過", format: { fill: red, font: { color: "#9C0006", bold: true } } });
assign.getRange("K7:K66").conditionalFormats.add("containsText", { text: "不可", format: { fill: red, font: { color: "#9C0006", bold: true } } });

const check = wb.worksheets.getItem("班次檢核總覽");
const availableCapacity = [];
for (let r = 7; r <= 36; r++) {
  availableCapacity.push([
    `=IF($A${r}="","",SUMIFS('排班配置輸入'!$F$7:$F$66,'排班配置輸入'!$B$7:$B$66,$A${r},'排班配置輸入'!$G$7:$G$66,"是",'排班配置輸入'!$K$7:$K$66,"支援資格通過"))`,
  ]);
}
check.getRange("M7:M36").formulas = availableCapacity;

const dashboard = wb.worksheets.getItem("主管工作台");
dashboard.getRange("A24:E24").values = [["支援資格核定", null, "支援者資格核定", "核定支援類型、生效日與核定人", null]];
dashboard.getRange("B24").formulas = [[`=COUNTIFS('支援者資格核定'!$N$7:$N$188,"待主管核定")`]];
dashboard.getRange("E24").formulas = [[`=IF(B24=0,"完成","仍有待核定")`]];
dashboard.getRange("A24:E24").format.font = { name: "Arial", size: 10, color: "#263238" };
dashboard.getRange("A24:E24").format.borders = { bottom: { style: "hair", color: line } };
dashboard.getRange("B24").format = { fill: "#DDEBF7", font: { name: "Arial", size: 10, bold: true, color: "#263238" }, horizontalAlignment: "right", numberFormat: "#,##0" };
dashboard.getRange("E24").conditionalFormats.add("containsText", { text: "待核定", format: { fill: amber, font: { color: "#7F6000", bold: true } } });
dashboard.getRange("H13").values = [["完成能力、熟悉度、要求、資格及支援者核定"]];
dashboard.getRange("I13").values = [["主管核定中心、支援者資格核定"]];

const overview = wb.worksheets.getItem("續作總覽");
overview.getRange("C27:D27").values = [["支援者資格流程已建立", "完整支援 2 名額、技術備援 1 名額與高複雜度限制已接入"]];

wb.recalculate();
await fs.mkdir(previewDir, { recursive: true });
for (const [name, range] of [["支援者資格核定", "A1:P20"], ["排班配置輸入", "A1:R14"], ["班次檢核總覽", "A1:U12"], ["主管工作台", "A11:E24"]]) {
  const image = await wb.render({ sheetName: name, range, scale: 1.15, format: "png" });
  await fs.writeFile(`${previewDir}/${name}.png`, new Uint8Array(await image.arrayBuffer()));
}
for (const range of ["支援者資格核定!A6:P14", "排班配置輸入!A6:R12", "班次檢核總覽!A6:U10", "主管工作台!A20:E24"]) {
  console.log((await wb.inspect({ kind: "table", range, include: "values,formulas", tableMaxRows: 12, tableMaxCols: 24, maxChars: 16000 })).ndjson);
}
console.log((await wb.inspect({ kind: "match", searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!|#SPILL!|#CALC!", options: { useRegex: true, maxResults: 300 }, maxChars: 10000 })).ndjson);
const out = await SpreadsheetFile.exportXlsx(wb);
await out.save(path);
console.log(`SAVED ${path}`);

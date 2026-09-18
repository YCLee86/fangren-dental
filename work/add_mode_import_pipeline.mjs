import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const path = "../outputs/clinic-assistant-model/assistant_skill_matrix_v1_pilot.xlsx";
const previewDir = "./mode-import-previews";
const navy = "#1F5E78";
const amber = "#FFF2CC";
const paleBlue = "#EAF5FA";
const green = "#E2F0D9";
const red = "#FCE4D6";
const line = "#B7C9D3";

const wb = await SpreadsheetFile.importXlsx(await FileBlob.load(path));

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
  sheet.getRange(`A2:${last}2`).merge();
  sheet.getRange(`A2:${last}2`).format = { font: { name: "Arial", size: 14, bold: true, color: "#263238" }, verticalAlignment: "center" };
  sheet.getRange(`A3:${last}3`).format.borders = { bottom: { style: "thin", color: line } };
  sheet.getRange("A4").values = [[note]];
  sheet.getRange(`A4:${last}4`).merge();
  sheet.getRange(`A4:${last}4`).format = { font: { name: "Arial", size: 10, italic: true, color: "#607D8B" }, wrapText: true };
  sheet.getRange(`A6:${last}${6 + rowCount}`).values = [headers, ...Array.from({ length: rowCount }, () => Array(headers.length).fill(null))];
  const table = sheet.tables.add(`A6:${last}${6 + rowCount}`, true, tableName);
  table.style = "TableStyleMedium2";
  sheet.getRange(`A6:${last}6`).format = { fill: navy, font: { name: "Arial", size: 10, bold: true, color: "#FFFFFF" }, horizontalAlignment: "center", verticalAlignment: "center", wrapText: true };
  sheet.getRange(`A7:${last}${6 + rowCount}`).format = { fill: amber, font: { name: "Arial", size: 10, color: "#263238" }, verticalAlignment: "center", wrapText: true };
  widths.forEach((width, i) => sheet.getRange(`${col(i + 1)}:${col(i + 1)}`).format.columnWidth = width);
  sheet.freezePanes.freezeRows(6);
  sheet.freezePanes.freezeColumns(3);
  sheet.tabColor = "#F4B183";
  return sheet;
}

const req = addInputSheet(
  "模式能力要求輸入",
  "其他醫師模式能力與資格要求輸入",
  "每列只登記一個模式×技能×角色要求。模式規則已發布、所有要求逐列發布，且醫師主管將該模式的要求集標記為已完整後，模式才會進入排班建檔清單；請勿從舊能力表推定門檻。",
  ["要求編號", "模式代碼", "醫師", "技能代碼", "人員角色", "必要性", "獨立最低評等", "條件排最低評等", "資格要求", "支援規則", "版本", "生效日", "核定狀態", "核定人", "來源文件／版本", "來源定位", "備註", "收件檢核", "下一步"],
  300,
  "ModeSkillRequirementInput",
  [18, 24, 18, 28, 18, 14, 18, 20, 18, 38, 14, 14, 16, 16, 32, 28, 38, 24, 42],
);
req.getRange("E7:E306").dataValidation = { rule: { type: "list", values: ["主跟診", "完整支援", "短時支援者"] } };
req.getRange("F7:F306").dataValidation = { rule: { type: "list", values: ["必備", "參考"] } };
req.getRange("G7:H306").dataValidation = { rule: { type: "list", values: ["※", "△", "Ø", "◎"] } };
req.getRange("I7:I306").dataValidation = { rule: { type: "list", values: ["不需複評", "需有效資格", "短時支援資格"] } };
req.getRange("M7:M306").dataValidation = { rule: { type: "list", values: ["待確認", "已核定", "退回補件", "停用"] } };
req.getRange("L7:L306").format.numberFormat = "yyyy-mm-dd";
const reqFormulas = [];
for (let r = 7; r <= 306; r++) {
  reqFormulas.push([
    `=IF($B${r}="","",IF($M${r}="停用","停用",IF($M${r}="退回補件","退回補件",IF(COUNTIFS($A$7:$A$306,$A${r})>1,"要求編號重複",IF(COUNTIFS('醫師模式規則輸入'!$D$7:$D$156,$B${r},'醫師模式規則輸入'!$B$7:$B$156,$C${r})<>1,"模式或醫師未建立",IF(COUNTIFS('技能主檔_V1'!$A$7:$A$200,$D${r},'技能主檔_V1'!$J$7:$J$200,"啟用")<>1,"技能未在主檔啟用",IF(OR($A${r}="",$E${r}="",$F${r}="",$G${r}="",$H${r}="",$I${r}="",$J${r}="",$K${r}="",$L${r}="",$N${r}=""),IF($M${r}="已核定","已核定但資料未完整","待補欄位或核定"),IF(OR($O${r}="",$P${r}=""),IF($M${r}="已核定","已核定但缺來源依據","待補來源依據"),IF($M${r}="已核定","可發布","待主管核定")))))))))`,
    `=IF($B${r}="","",IF($R${r}="可發布","回到醫師模式規則輸入，將能力要求集標記為已完整",IF(OR($R${r}="停用",$R${r}="退回補件"),"依狀態處理",IF(ISNUMBER(SEARCH("來源",$R${r})),"補齊來源文件與定位",IF(ISNUMBER(SEARCH("技能",$R${r})),"先完成技能名稱對照並發布技能主檔",IF(ISNUMBER(SEARCH("模式",$R${r})),"先建立相符的醫師模式規則","補齊欄位並完成主管核定"))))))`,
  ]);
}
req.getRange("R7:S306").formulas = reqFormulas;
req.getRange("R7:S306").format.fill = paleBlue;
req.getRange("R7:R306").conditionalFormats.add("containsText", { text: "可發布", format: { fill: green, font: { color: "#375623", bold: true } } });
req.getRange("R7:R306").conditionalFormats.add("containsText", { text: "未", format: { fill: red, font: { color: "#9C0006", bold: true } } });
req.getRange("R7:R306").conditionalFormats.add("containsText", { text: "待", format: { fill: amber, font: { color: "#7F6000", bold: true } } });

const doctor = wb.worksheets.getItem("醫師模式規則輸入");
doctor.getRange("A2:S2").unmerge();
doctor.getRange("A4:S4").unmerge();
doctor.getRange("A2:U2").merge();
doctor.getRange("A4:U4").merge();
doctor.getRange("A4").values = [["每個正式模式使用一列並保留來源依據。先完成模式規則，再到「模式能力要求輸入」逐列核定技能與資格門檻；只有所有要求均可發布，且主管將能力要求集標記為已完整，模式才會進入排班建檔清單。"]];
doctor.getRange("T6:U6").values = [["能力要求集狀態", "排班匯入狀態"]];
doctor.getRange("T7:T156").dataValidation = { rule: { type: "list", values: ["待建置", "已完整", "退回補件"] } };
doctor.getRange("T7:T14").values = Array.from({ length: 8 }, () => ["待建置"]);
const doctorImport = [];
for (let r = 7; r <= 156; r++) {
  doctorImport.push([`=IF($D${r}="","",IF($Q${r}<>"可發布","模式規則未發布",IF($T${r}<>"已完整","能力要求集未確認",IF(COUNTIFS('模式能力要求輸入'!$B$7:$B$306,$D${r})=0,"尚無能力要求",IF(COUNTIFS('模式能力要求輸入'!$B$7:$B$306,$D${r},'模式能力要求輸入'!$R$7:$R$306,"<>可發布")>0,"能力要求未全數發布",IF(COUNTIFS('模式能力要求輸入'!$B$7:$B$306,$D${r},'模式能力要求輸入'!$E$7:$E$306,"主跟診",'模式能力要求輸入'!$F$7:$F$306,"必備",'模式能力要求輸入'!$R$7:$R$306,"可發布")=0,"缺少主跟診必備要求","可匯入模式清單"))))))`]);
}
doctor.getRange("U7:U156").formulas = doctorImport;
doctor.getRange("T6:U6").format = { fill: navy, font: { name: "Arial", size: 10, bold: true, color: "#FFFFFF" }, horizontalAlignment: "center", verticalAlignment: "center", wrapText: true };
doctor.getRange("T7:T156").format = { fill: amber, font: { name: "Arial", size: 10, color: "#263238" } };
doctor.getRange("U7:U156").format = { fill: paleBlue, font: { name: "Arial", size: 10, color: "#263238" }, wrapText: true };
doctor.getRange("T:T").format.columnWidth = 22;
doctor.getRange("U:U").format.columnWidth = 26;
doctor.getRange("U7:U156").conditionalFormats.add("containsText", { text: "可匯入", format: { fill: green, font: { color: "#375623", bold: true } } });
doctor.getRange("U7:U156").conditionalFormats.add("containsText", { text: "未", format: { fill: amber, font: { color: "#7F6000", bold: true } } });

const modes = wb.worksheets.add("排班模式清單");
modes.showGridLines = false;
modes.getRange("A2:Q2").merge();
modes.getRange("A2").values = [["統一排班模式清單與安全匯入閘門"]];
modes.getRange("A2:Q2").format = { font: { name: "Arial", size: 14, bold: true, color: "#263238" } };
modes.getRange("A3:Q3").format.borders = { bottom: { style: "thin", color: line } };
modes.getRange("A4:Q4").merge();
modes.getRange("A4").values = [["李侑津醫師 13 個試行模式維持既有流程。其他醫師模式只有在規則、來源、能力要求與主管完整性確認都通過後，才會出現在 Q 欄的排班下拉清單；人員適配未建立時仍會在配置階段被擋下。"]];
modes.getRange("A4:Q4").format = { font: { name: "Arial", size: 10, italic: true, color: "#607D8B" }, wrapText: true };
const modeHeaders = ["模式代碼", "醫師", "治療項目", "療程階段", "複雜度", "主跟診需求", "支援需求", "支援分鐘", "提前確認天數", "來源規則", "模式規則狀態", "要求總數", "已發布要求", "主跟診必備要求", "要求集狀態", "排班建檔狀態", "排班下拉代碼"];
modes.getRange("A6:Q169").values = [modeHeaders, ...Array.from({ length: 163 }, () => Array(17).fill(null))];
const modeTable = modes.tables.add("A6:Q169", true, "UnifiedSchedulingModes");
modeTable.style = "TableStyleMedium2";
modes.getRange("A6:Q6").format = { fill: navy, font: { name: "Arial", size: 10, bold: true, color: "#FFFFFF" }, horizontalAlignment: "center", verticalAlignment: "center", wrapText: true };
modes.getRange("A7:Q169").format = { fill: paleBlue, font: { name: "Arial", size: 10, color: "#263238" }, verticalAlignment: "center", wrapText: true };

for (let i = 0; i < 13; i++) {
  const r = 7 + i;
  const src = 7 + i;
  modes.getRange(`A${r}:Q${r}`).formulas = [[
    `='李醫師治療模式'!A${src}`, `='李醫師治療模式'!B${src}`, `='李醫師治療模式'!D${src}`, `='李醫師治療模式'!E${src}`, `='李醫師治療模式'!F${src}`,
    `='李醫師治療模式'!G${src}`, `='李醫師治療模式'!I${src}`, `='李醫師治療模式'!J${src}`, `=IF('李醫師治療模式'!A${src}="","",21)`, `="李醫師試行V1"`, `="可發布"`,
    `=COUNTIFS('李醫師能力要求'!$B$7:$B$59,$A${r})`, `=COUNTIFS('李醫師能力要求'!$B$7:$B$59,$A${r},'李醫師能力要求'!$K$7:$K$59,"已確認")`, `=COUNTIFS('李醫師能力要求'!$B$7:$B$59,$A${r},'李醫師能力要求'!$F$7:$F$59,"主跟診",'李醫師能力要求'!$G$7:$G$59,"必備",'李醫師能力要求'!$K$7:$K$59,"已確認")`,
    `="既有試行"`, `="可供試行排班"`, `=$A${r}`,
  ]];
}
for (let i = 0; i < 150; i++) {
  const r = 20 + i;
  const src = 7 + i;
  modes.getRange(`A${r}:Q${r}`).formulas = [[
    `=IF('醫師模式規則輸入'!$D${src}="","",'醫師模式規則輸入'!$D${src})`, `=IF($A${r}="","",'醫師模式規則輸入'!$B${src})`, `=IF($A${r}="","",'醫師模式規則輸入'!$E${src})`, `=IF($A${r}="","",'醫師模式規則輸入'!$F${src})`, `=IF($A${r}="","",'醫師模式規則輸入'!$G${src})`,
    `=IF($A${r}="","",'醫師模式規則輸入'!$H${src})`, `=IF($A${r}="","",'醫師模式規則輸入'!$I${src})`, `=IF($A${r}="","",'醫師模式規則輸入'!$J${src})`, `=IF($A${r}="","",'醫師模式規則輸入'!$K${src})`, `=IF($A${r}="","",'醫師模式規則輸入'!$A${src})`, `=IF($A${r}="","",'醫師模式規則輸入'!$Q${src})`,
    `=IF($A${r}="","",COUNTIFS('模式能力要求輸入'!$B$7:$B$306,$A${r}))`, `=IF($A${r}="","",COUNTIFS('模式能力要求輸入'!$B$7:$B$306,$A${r},'模式能力要求輸入'!$R$7:$R$306,"可發布"))`, `=IF($A${r}="","",COUNTIFS('模式能力要求輸入'!$B$7:$B$306,$A${r},'模式能力要求輸入'!$E$7:$E$306,"主跟診",'模式能力要求輸入'!$F$7:$F$306,"必備",'模式能力要求輸入'!$R$7:$R$306,"可發布"))`,
    `=IF($A${r}="","",'醫師模式規則輸入'!$T${src})`,
    `=IF($A${r}="","",IF(COUNTIFS($A$7:$A$169,$A${r})>1,"模式代碼重複",IF('醫師模式規則輸入'!$U${src}="可匯入模式清單","可進入排班建檔",'醫師模式規則輸入'!$U${src})))`,
    `=IF(OR($P${r}="可進入排班建檔",$P${r}="可供試行排班"),$A${r},"")`,
  ]];
}
const modeWidths = [24, 18, 24, 20, 16, 16, 16, 16, 18, 20, 24, 14, 16, 20, 18, 26, 24];
modeWidths.forEach((width, i) => modes.getRange(`${col(i + 1)}:${col(i + 1)}`).format.columnWidth = width);
modes.getRange("F7:I169").format.numberFormat = "0";
modes.getRange("P7:P169").conditionalFormats.add("containsText", { text: "可", format: { fill: green, font: { color: "#375623", bold: true } } });
modes.getRange("P7:P169").conditionalFormats.add("containsText", { text: "未", format: { fill: amber, font: { color: "#7F6000", bold: true } } });
modes.getRange("P7:P169").conditionalFormats.add("containsText", { text: "重複", format: { fill: red, font: { color: "#9C0006", bold: true } } });
modes.freezePanes.freezeRows(6);
modes.freezePanes.freezeColumns(2);
modes.tabColor = "#5B9BD5";

const demand = wb.worksheets.getItem("班次需求輸入");
demand.getRange("F7:F36").dataValidation = { rule: { type: "list", formula1: "'排班模式清單'!$Q$7:$Q$169" } };
const demandModeFormulas = [];
for (let r = 7; r <= 36; r++) {
  demandModeFormulas.push([
    `=IF($F${r}="","",_xlfn.XLOOKUP($F${r},'排班模式清單'!$A$7:$A$169,'排班模式清單'!$G$7:$G$169,"模式未建立",0))`,
    `=IF($F${r}="","",_xlfn.XLOOKUP($F${r},'排班模式清單'!$A$7:$A$169,'排班模式清單'!$H$7:$H$169,"",0))`,
  ]);
  demand.getRange(`AB${r}`).formulas = [[`=IF($A${r}="","",IF(COUNTIFS('排班模式清單'!$A$7:$A$169,$F${r},'排班模式清單'!$B$7:$B$169,$E${r},'排班模式清單'!$Q$7:$Q$169,$F${r})=1,"通過","醫師或模式未通過匯入閘門"))`]];
  demand.getRange(`AC${r}`).formulas = [[`=IF($A${r}="","",IF(OR(NOT(ISNUMBER($H${r})),$H${r}<1,AND($I${r}<>"",OR(NOT(ISNUMBER($I${r})),$I${r}<0)),AND($J${r}<>"",OR(NOT(ISNUMBER($J${r})),$J${r}<=0))),"人力參數不正確",IF($H${r}<>_xlfn.XLOOKUP($F${r},'排班模式清單'!$A$7:$A$169,'排班模式清單'!$F$7:$F$169,-1,0),"主跟診人數與規則不符",IF($I${r}<>_xlfn.XLOOKUP($F${r},'排班模式清單'!$A$7:$A$169,'排班模式清單'!$G$7:$G$169,-1,0),"支援人數與規則不符",IF(AND($I${r}>0,$J${r}=""),"缺少支援分鐘",IF(AND($J${r}<>"",$J${r}<>_xlfn.XLOOKUP($F${r},'排班模式清單'!$A$7:$A$169,'排班模式清單'!$H$7:$H$169,"",0)),"支援分鐘與規則不符","通過"))))))`]];
}
demand.getRange("I7:J36").formulas = demandModeFormulas;
demand.getRange("AB6").values = [["醫師模式匯入檢核"]];

const assign = wb.worksheets.getItem("排班配置輸入");
for (let r = 7; r <= 66; r++) {
  assign.getRange(`L${r}`).formulas = [[`=IF($E${r}<>"主跟診",0,IF($I${r}="初步可條件排",IF(_xlfn.XLOOKUP($H${r},'排班模式清單'!$A$7:$A$169,'排班模式清單'!$E$7:$E$169,"",0)="高複雜度",2,1),0)+IFNA(_xlfn.XLOOKUP($B${r},'班次需求輸入'!$A$7:$A$36,'班次需求輸入'!$I$7:$I$36,0,0),0))`]];
}

const check = wb.worksheets.getItem("班次檢核總覽");
for (let r = 7; r <= 36; r++) {
  check.getRange(`F${r}`).formulas = [[`=IF($E${r}="","",_xlfn.XLOOKUP($E${r},'排班模式清單'!$A$7:$A$169,'排班模式清單'!$C$7:$C$169,"未建立",0))`]];
}

const dashboard = wb.worksheets.getItem("主管工作台");
dashboard.getRange("A34:E34").values = [["其他醫師模式匯入", null, "醫師模式規則輸入／模式能力要求輸入／排班模式清單", "規則與要求均發布，且要求集已確認完整", null]];
dashboard.getRange("B34").formulas = [[`=COUNTIFS('醫師模式規則輸入'!$B$7:$B$156,"<>",'醫師模式規則輸入'!$U$7:$U$156,"<>可匯入模式清單")`]];
dashboard.getRange("E34").formulas = [[`=IF(B34=0,"其他醫師模式匯入閘門均完成","仍有 "&B34&" 筆模式規則待完成能力要求匯入")`]];
dashboard.getRange("A34:E34").format.font = { name: "Arial", size: 10, color: "#263238" };
dashboard.getRange("A34:E34").format.borders = { bottom: { style: "hair", color: line } };
dashboard.getRange("B34").format = { fill: paleBlue, font: { name: "Arial", size: 10, bold: true, color: "#263238" }, horizontalAlignment: "right", numberFormat: "#,##0" };
dashboard.getRange("E34").format = { fill: amber, font: { name: "Arial", size: 10, bold: true, color: "#7F6000" }, wrapText: true };

const guide = wb.worksheets.getItem("主管操作導引");
guide.getRange("E15").values = [["正式資料收件、醫師模式規則輸入、模式能力要求輸入、排班模式清單、流動層級規則輸入、職級矩陣規則輸入、檢核表項目輸入"]];
guide.getRange("G15").values = [["先登記收件，逐列填入模式規則與能力／資格要求，完成來源、核定及要求集完整性確認"]];
guide.getRange("H15").values = [["模式規則與所有能力要求均可發布，要求集標記已完整，模式才出現在排班下拉清單"]];

const overview = wb.worksheets.getItem("續作總覽");
overview.getRange("A40:D40").values = [["其他醫師模式安全匯入", 300, "能力要求輸入、統一模式清單與雙重閘門已建立", "模式規則、逐項能力要求、來源及主管完整性確認全數通過後才進入排班建檔；人員適配未建立仍會在配置階段阻擋"]];
overview.getRange("B40").format.numberFormat = "#,##0";

wb.recalculate();
await fs.mkdir(previewDir, { recursive: true });
for (const [sheetName, range] of [
  ["醫師模式規則輸入", "A1:U20"],
  ["模式能力要求輸入", "A1:S18"],
  ["排班模式清單", "A1:Q24"],
  ["班次需求輸入", "A1:AF14"],
  ["主管工作台", "A19:E34"],
]) {
  const image = await wb.render({ sheetName, range, scale: 1.1, format: "png" });
  await fs.writeFile(`${previewDir}/${sheetName}.png`, new Uint8Array(await image.arrayBuffer()));
}

const formulaErrors = await wb.inspect({ kind: "match", searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A", options: { useRegex: true, maxResults: 300 }, summary: "mode import formula errors" });
console.log(formulaErrors.ndjson);
const out = await SpreadsheetFile.exportXlsx(wb);
await out.save(path);
console.log(`SAVED ${path}`);

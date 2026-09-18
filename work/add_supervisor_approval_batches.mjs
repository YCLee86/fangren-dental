import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const path = "../outputs/clinic-assistant-model/assistant_skill_matrix_v1_pilot.xlsx";
const previewDir = "./supervisor-approval-batch-previews";
const navy = "#1F5E78";
const amber = "#FFF2CC";
const paleBlue = "#EAF5FA";
const green = "#E2F0D9";
const red = "#FCE4D6";
const line = "#B7C9D3";

let wb = await SpreadsheetFile.importXlsx(await FileBlob.load(path));
const batch = wb.worksheets.add("主管核定批次");
batch.showGridLines = false;

batch.getRange("A2:N2").merge();
batch.getRange("A2").values = [["診所助理排班工具－主管核定批次"]];
batch.getRange("A2:N2").format.font = { name: "Arial", size: 15, bold: true, color: "#263238" };
batch.getRange("A3:N3").format.borders = { bottom: { style: "thin", color: line } };
batch.getRange("A4:N4").merge();
batch.getRange("A4").values = [["先為有待辦的工作流建立批次，再到原核定表逐筆處理。本頁不代替主管決定，也不會因批次標記完成而改寫能力、資格或排班結果；系統待辦歸零才代表該工作流完成。"]];
batch.getRange("A4:N4").format.font = { name: "Arial", size: 10, italic: true, color: "#607D8B" };

batch.getRange("A6:N6").values = [["尚未安排流程", null, "目前優先安排", null, null, null, "已有有效批次", null, "執行中批次", null, "系統已完成流程", null, "待辦項次合計", null]];
for (const range of ["A6:B6", "C6:F6", "G6:H6", "I6:J6", "K6:L6", "M6:N6"]) batch.getRange(range).merge();
batch.getRange("A6:N6").format = { fill: navy, font: { name: "Arial", size: 10, bold: true, color: "#FFFFFF" }, horizontalAlignment: "center", verticalAlignment: "center" };
for (const range of ["A7:B7", "C7:F7", "G7:H7", "I7:J7", "K7:L7", "M7:N7"]) batch.getRange(range).merge();
batch.getRange("A7").formulas = [[`=COUNTIFS($G$11:$G$18,"未安排")`]];
batch.getRange("C7").formulas = [[`=IF($G$11="未安排",$C$11,IF($G$12="未安排",$C$12,IF($G$13="未安排",$C$13,IF($G$14="未安排",$C$14,IF($G$15="未安排",$C$15,IF($G$16="未安排",$C$16,IF($G$17="未安排",$C$17,IF($G$18="未安排",$C$18,IF($I$7>0,"持續完成執行中批次","目前無未安排流程")))))))))`]];
batch.getRange("G7").formulas = [[`=COUNTIFS($G$11:$G$18,"已有批次")`]];
batch.getRange("I7").formulas = [[`=COUNTIFS($G$23:$G$42,"執行中")`]];
batch.getRange("K7").formulas = [[`=COUNTIFS($G$11:$G$18,"系統已完成")`]];
batch.getRange("M7").formulas = [[`=SUM($D$11:$D$18)`]];
batch.getRange("A7:N7").format = { fill: "#DDEBF7", font: { name: "Arial", size: 12, bold: true, color: "#263238" }, horizontalAlignment: "center", verticalAlignment: "center", wrapText: true };

const summaryHeaders = ["工作流代碼", "優先序", "核定工作流", "系統待辦", "有效批次數", "主要操作位置", "安排狀態", "下一步", null, null, null, null, null, null];
batch.getRange("A10:N10").values = [summaryHeaders];
batch.getRange("H10:N10").merge();
batch.getRange("A10:N10").format = { fill: navy, font: { name: "Arial", size: 10, bold: true, color: "#FFFFFF" }, horizontalAlignment: "center", verticalAlignment: "center", wrapText: true };
const summaryRows = [
  ["AP-01", 1, "資格暫停或逾期", null, null, "資格恢復處理／資格有效性"],
  ["AP-02", 2, "未建立必要資格", null, null, "考核紀錄輸入／主管核定中心"],
  ["AP-03", 3, "支援者資格核定", null, null, "支援者資格核定"],
  ["AP-04", 4, "初始能力、熟悉度、要求與資格", null, null, "主管核定中心"],
  ["AP-05", 5, "七類檢核表內容與版本", null, null, "檢核表項目輸入／檢核表版本"],
  ["AP-06", 6, "員工治理核定", null, null, "員工治理核定"],
  ["AP-07", 7, "技能名稱對照", null, null, "技能名稱對照"],
  ["AP-08", 8, "能力升級候選", null, null, "能力升級候選"],
];
batch.getRange("A11:F18").values = summaryRows;
const pendingFormulas = [
  `='主管工作台'!$M$7`, `='主管工作台'!$B$17`, `='主管工作台'!$B$24`, `='主管工作台'!$A$7`,
  `='主管工作台'!$B$27`, `='主管工作台'!$B$25`, `='主管工作台'!$B$26`, `='主管工作台'!$J$7`,
];
for (let i = 0; i < 8; i++) {
  const r = 11 + i;
  batch.getRange(`D${r}`).formulas = [[pendingFormulas[i]]];
  batch.getRange(`E${r}`).formulas = [[`=COUNTIFS($B$23:$B$42,$A${r},$G$23:$G$42,"未開始")+COUNTIFS($B$23:$B$42,$A${r},$G$23:$G$42,"執行中")`]];
  batch.getRange(`G${r}`).formulas = [[`=IF($D${r}=0,"系統已完成",IF($E${r}>0,"已有批次","未安排"))`]];
  batch.getRange(`H${r}:N${r}`).merge();
  batch.getRange(`H${r}`).formulas = [[`=IF($D${r}=0,"保存既有核定紀錄",IF($E${r}=0,"在下方建立一筆核定批次","依批次負責人與期限執行原核定表"))`]];
}
batch.getRange("A11:N18").format = { font: { name: "Arial", size: 10, color: "#263238" }, wrapText: true, verticalAlignment: "center" };
batch.getRange("A11:C18").format.fill = "#F7FBFD";
batch.getRange("D11:E18").format = { fill: paleBlue, font: { name: "Arial", size: 10, bold: true, color: "#263238" }, horizontalAlignment: "right", numberFormat: "#,##0" };
batch.getRange("F11:F18").format.fill = "#F7FBFD";
batch.getRange("G11:G18").format.fill = amber;
batch.getRange("H11:N18").format.fill = "#FFFFFF";
batch.getRange("G11:G18").conditionalFormats.add("containsText", { text: "系統已完成", format: { fill: green, font: { color: "#375623", bold: true } } });
batch.getRange("G11:G18").conditionalFormats.add("containsText", { text: "未安排", format: { fill: red, font: { color: "#9C0006", bold: true } } });

batch.getRange("A21:N21").merge();
batch.getRange("A21").values = [["核定批次紀錄"]];
batch.getRange("A21:N21").format = { fill: "#D9EAF2", font: { name: "Arial", size: 10, bold: true, color: "#263238" } };
const logHeaders = ["批次編號", "工作流代碼", "核定工作流", "預計處理量", "批次負責人", "預計完成日", "批次狀態", "完成日", "實際完成量", "複核人", "備註", "建立時待辦", "批次檢核", "下一步"];
batch.getRange("A22:N22").values = [logHeaders];
batch.getRange("A22:N22").format = { fill: navy, font: { name: "Arial", size: 10, bold: true, color: "#FFFFFF" }, horizontalAlignment: "center", verticalAlignment: "center", wrapText: true };
batch.getRange("A23:N42").format = { font: { name: "Arial", size: 10, color: "#263238" }, wrapText: true, verticalAlignment: "center" };
batch.getRange("A23:B42").format.fill = amber;
batch.getRange("C23:C42").format.fill = paleBlue;
batch.getRange("D23:L42").format.fill = amber;
batch.getRange("M23:N42").format.fill = paleBlue;
batch.getRange("B23:B42").dataValidation = { rule: { type: "list", formula1: "'主管核定批次'!$A$11:$A$18" } };
batch.getRange("G23:G42").dataValidation = { rule: { type: "list", values: ["未開始", "執行中", "已完成", "取消"] } };
batch.getRange("F23:F42").format.numberFormat = "yyyy-mm-dd";
batch.getRange("H23:H42").format.numberFormat = "yyyy-mm-dd";
batch.getRange("D23:D42").format.numberFormat = "#,##0";
batch.getRange("I23:I42").format.numberFormat = "#,##0";
batch.getRange("L23:L42").format.numberFormat = "#,##0";
for (let r = 23; r <= 42; r++) {
  batch.getRange(`C${r}`).formulas = [[`=IF($B${r}="","",_xlfn.XLOOKUP($B${r},$A$11:$A$18,$C$11:$C$18,"工作流未建立",0))`]];
  batch.getRange(`M${r}`).formulas = [[`=IF($A${r}="","",IF(COUNTIFS($A$23:$A$42,$A${r})>1,"批次編號重複",IF(OR($B${r}="",$D${r}="",$E${r}="",$F${r}="",$G${r}="",$L${r}=""),"待補批次資料",IF($D${r}<=0,"處理量需大於 0",IF($D${r}>$L${r},"處理量超過建立時待辦",IF($G${r}="已完成",IF(OR($H${r}="",$I${r}="",$J${r}=""),"待補完成證據","批次有效"),IF(OR($H${r}<>"",$I${r}<>"",$J${r}<>""),"完成證據與狀態不一致","批次有效")))))))`]];
  batch.getRange(`N${r}`).formulas = [[`=IF($A${r}="","",IF($M${r}="批次有效",IF($G${r}="已完成","回到工作流摘要確認剩餘待辦","依期限到原核定表逐筆處理"),IF($M${r}="批次編號重複","更換批次編號",IF($M${r}="待補完成證據","補填完成日、實際完成量與複核人","依批次檢核補齊或修正資料"))))`]];
}
batch.getRange("M23:M42").conditionalFormats.add("containsText", { text: "批次有效", format: { fill: green, font: { color: "#375623", bold: true } } });
batch.getRange("M23:M42").conditionalFormats.add("containsText", { text: "重複", format: { fill: red, font: { color: "#9C0006", bold: true } } });
batch.getRange("M23:M42").conditionalFormats.add("containsText", { text: "不一致", format: { fill: red, font: { color: "#9C0006", bold: true } } });

const widths = [16, 16, 34, 14, 18, 28, 18, 14, 14, 16, 30, 16, 28, 34];
for (let i = 0; i < widths.length; i++) batch.getRange(`${String.fromCharCode(65 + i)}:${String.fromCharCode(65 + i)}`).format.columnWidth = widths[i];
batch.freezePanes.freezeRows(22);
batch.freezePanes.freezeColumns(3);
batch.tabColor = "#8064A2";

wb.recalculate();
let out = await SpreadsheetFile.exportXlsx(wb);
await out.save(path);

wb = await SpreadsheetFile.importXlsx(await FileBlob.load(path));
const dashboard = wb.worksheets.getItem("主管工作台");
dashboard.getRange("A32:E32").values = [["主管核定批次", null, "主管核定批次", "每個有待辦的工作流均有未開始或執行中批次", null]];
dashboard.getRange("B32").formulas = [[`='主管核定批次'!$A$7`]];
dashboard.getRange("E32").formulas = [[`=IF(B32=0,"核定工作流皆已安排或完成","仍有 "&B32&" 個核定工作流未安排批次")`]];
dashboard.getRange("A32:E32").format.font = { name: "Arial", size: 10, color: "#263238" };
dashboard.getRange("A32:E32").format.borders = { bottom: { style: "hair", color: line } };
dashboard.getRange("B32").format = { fill: "#DDEBF7", font: { name: "Arial", size: 10, bold: true, color: "#263238" }, horizontalAlignment: "right", numberFormat: "#,##0" };
dashboard.getRange("E32").format = { fill: amber, font: { name: "Arial", size: 10, bold: true, color: "#7F6000" } };

const priorityFormula = `=IF($D$7>0,"先處理班次安全異常",IF($B$28>0,"處理排班例外申請",IF($M$7>0,"處理資格暫停或逾期",IF($G$7>0,"安排近期半年複評",IF('正式資料收件'!$G$7>0,"先收齊診所正式資料",IF($B$32>0,"安排主管核定批次",IF($A$7>0,"完成初始資料與資格核定",IF($B$27>0,"補齊七類檢核表內容與版本",IF($J$7>0,"處理能力升級候選",IF(SUM($B$20:$B$22)>0,"完成正式規則建檔與核定",IF($B$31>0,"完成正式試排驗收",IF($B$29>0,"完成上線準備閘門","今日無高優先待辦"))))))))))))`;
const locationFormula = `=IF($D$7>0,"班次檢核總覽／排班配置輸入",IF($B$28>0,"排班例外核定",IF($M$7>0,"資格恢復處理／資格有效性",IF($G$7>0,"複評待辦／考核紀錄輸入",IF('正式資料收件'!$G$7>0,"正式資料收件",IF($B$32>0,"主管核定批次",IF($A$7>0,"主管核定中心／支援者資格核定",IF($B$27>0,"檢核表版本／檢核表項目輸入",IF($J$7>0,"能力升級候選",IF(SUM($B$20:$B$22)>0,"正式資料收件／正式規則輸入",IF($B$31>0,"正式試排驗收",IF($B$29>0,"上線準備","主管工作台"))))))))))))`;
const completionFormula = `=IF($D$7>0,"最終發布判定為可發布、例外核定可發布或人力已釋出",IF($B$28>0,"安全閘門通過且例外有效，或完成退回／撤銷",IF($M$7>0,"完成補訓、複評與主管核定後恢復資格",IF($G$7>0,"完成複評，或安排符合規則的補考日",IF('正式資料收件'!$G$7>0,"外部資料包已提供，且收件日與收件人完整",IF($B$32>0,"每個有待辦工作流至少建立一筆未開始或執行中批次",IF($A$7>0,"主管決定、生效日與核定人完整",IF($B$27>0,"檢核項目與版本均核定發布",IF($J$7>0,"證據完整且主管核定升級",IF(SUM($B$20:$B$22)>0,"正式內容完整且狀態為已核定",IF($B$31>0,"十二項系統條件與主管簽核皆完成",IF($B$29>0,"所有系統閘門與人工確認完成","維持每日巡檢"))))))))))))`;
dashboard.getRange("I20").formulas = [[priorityFormula]];
dashboard.getRange("I21").formulas = [[locationFormula]];
dashboard.getRange("I22").formulas = [[completionFormula]];

const guide = wb.worksheets.getItem("主管操作導引");
guide.getRange("E14").values = [["主管核定批次、主管核定中心、支援者資格核定"]];
guide.getRange("G14:H14").values = [["先安排批次與負責人，再核對來源、主管決定、生效日與核定人", "每個有待辦工作流均有批次，且必要紀錄可生效"]];

const overview = wb.worksheets.getItem("續作總覽");
overview.getRange("A37:D37").values = [["主管核定批次", 8, "批次規劃與紀錄流程已建立", "八類核定工作流依安全與上線影響排序；保留批次範圍、負責人、期限、完成量與複核證據"]];
overview.getRange("B37").format.numberFormat = "#,##0";

wb.recalculate();
await fs.mkdir(previewDir, { recursive: true });
for (const [name, range] of [["主管核定批次", "A1:N42"], ["主管工作台", "A19:M32"], ["主管操作導引", "A11:K22"]]) {
  const image = await wb.render({ sheetName: name, range, scale: 1.05, format: "png" });
  await fs.writeFile(`${previewDir}/${name}.png`, new Uint8Array(await image.arrayBuffer()));
}
for (const range of ["主管核定批次!A1:N42", "主管工作台!A20:M32", "主管操作導引!A11:K22", "續作總覽!A34:D37"]) {
  console.log((await wb.inspect({ kind: "table", range, include: "values,formulas", tableMaxRows: 50, tableMaxCols: 18, maxChars: 36000 })).ndjson);
}
console.log((await wb.inspect({ kind: "match", searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!|#SPILL!|#CALC!", options: { useRegex: true, maxResults: 500 }, maxChars: 12000 })).ndjson);
out = await SpreadsheetFile.exportXlsx(wb);
await out.save(path);
console.log(`SAVED ${path}`);

import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const path = "../outputs/clinic-assistant-model/assistant_skill_matrix_v1_pilot.xlsx";
const previewDir = "./formal-data-intake-previews";
const navy = "#1F5E78";
const amber = "#FFF2CC";
const paleBlue = "#EAF5FA";
const green = "#E2F0D9";
const red = "#FCE4D6";
const line = "#B7C9D3";

let wb = await SpreadsheetFile.importXlsx(await FileBlob.load(path));
const intake = wb.worksheets.add("正式資料收件");
intake.showGridLines = false;

intake.getRange("A2:N2").merge();
intake.getRange("A2").values = [["診所助理排班工具－正式資料收件"]];
intake.getRange("A2:N2").format.font = { name: "Arial", size: 15, bold: true, color: "#263238" };
intake.getRange("A3:N3").format.borders = { bottom: { style: "thin", color: line } };
intake.getRange("A4:N4").merge();
intake.getRange("A4").values = [["此頁只管理資料包是否收到及後續處理狀態，不代替臨床內容或主管核定。外部正式資料請先登記收件日與收件人，再到指定工作表逐列建檔、核定與發布；內部核定與正式試排則直接依既有流程完成。"]];
intake.getRange("A4:N4").format.font = { name: "Arial", size: 10, italic: true, color: "#607D8B" };

const kpiHeaders = [
  ["待完成資料包", null, "目前下一步", null, null, null, "外部待提供", null, "已收待核定", null, "內部／試排待處理", null, "已完成", null],
];
intake.getRange("A6:N6").values = kpiHeaders;
for (const range of ["A6:B6", "C6:F6", "G6:H6", "I6:J6", "K6:L6", "M6:N6"]) intake.getRange(range).merge();
intake.getRange("A6:N6").format = { fill: navy, font: { name: "Arial", size: 10, bold: true, color: "#FFFFFF" }, horizontalAlignment: "center", verticalAlignment: "center" };
for (const range of ["A7:B7", "C7:F7", "G7:H7", "I7:J7", "K7:L7", "M7:N7"]) intake.getRange(range).merge();
intake.getRange("A7").formulas = [[`=COUNTIFS($M$12:$M$20,"<>已完成")`]];
intake.getRange("C7").formulas = [[`=IF($G$7>0,"先收齊診所正式資料",IF($I$7>0,"完成正式內容建檔與核定",IF($K$7>0,"完成內部核定與正式試排","所有收件工作完成")))`]];
intake.getRange("G7").formulas = [[`=COUNTIFS($B$12:$B$20,"外部正式資料",$I$12:$I$20,"<>已提供",$M$12:$M$20,"<>已完成")`]];
intake.getRange("I7").formulas = [[`=COUNTIFS($M$12:$M$20,"已收件，待核定")`]];
intake.getRange("K7").formulas = [[`=COUNTIFS($B$12:$B$20,"<>外部正式資料",$M$12:$M$20,"<>已完成")`]];
intake.getRange("M7").formulas = [[`=COUNTIFS($M$12:$M$20,"已完成")`]];
intake.getRange("A7:N7").format = { fill: "#DDEBF7", font: { name: "Arial", size: 12, bold: true, color: "#263238" }, horizontalAlignment: "center", verticalAlignment: "center", wrapText: true };

const headers = ["收件編號", "類型", "資料包／工作", "目前缺口", "預期數量／完成標準", "必填內容", "輸入／處理位置", "負責角色", "收件狀態", "收件日", "收件人", "系統完整性", "最終狀態", "下一步"];
const rows = [
  ["PKG-01", "外部正式資料", "其餘 8 位醫師正式治療模式", null, "8 位醫師皆完成正式規則核定", "醫師型態、模式代碼、治療項目、療程階段、複雜度、主跟診／支援人數、短時支援分鐘、確認提前天數、版本、生效日、核定狀態", "醫師模式規則輸入", "助理長／各組主管", "未提供", null, null, null, null, null],
  ["PKG-02", "外部正式資料", "正職 3 級＋兼職 6 級流動規則", null, "9 個層級皆完成正式規則核定", "能力路徑、層級、必要任務組合、最低評等、單人流動限制、備援要求、升級條件、版本、生效日、核定狀態", "流動層級規則輸入", "助理長／各組主管", "未提供", null, null, null, null, null],
  ["PKG-03", "外部正式資料", "Lv.1–Lv.10 正式職級矩陣", null, "10 個職級皆完成正式規則核定", "職級、必要能力路徑、技能／考核／培訓要求、核定、理由、生效日、版本", "職級矩陣規則輸入", "助理長", "未提供", null, null, null, null, null],
  ["PKG-04", "外部正式資料", "七類半年複評檢核表臨床內容", null, "7 類檢核表皆完成內容核定與發布", "項目類型、操作項目、通過標準、證據方式、生效日、核定人", "檢核表項目輸入／檢核表版本", "助理主管／助理長", "未提供", null, null, null, null, null],
  ["PKG-05", "內部核定", "技能來源名稱對照", null, "所有來源組合完成核定、拆分與發布", "標準技能代碼、主管決定、拆分方式、生效日、核定人", "技能名稱對照", "助理長／各組主管", "不適用", null, null, null, null, null],
  ["PKG-06", "內部核定", "員工治理資料", null, "14 位員工治理資料完成核定", "能力路徑、培訓組、主管、正式職級、生效日、核定人", "員工治理核定", "助理主管／助理長", "不適用", null, null, null, null, null],
  ["PKG-07", "內部核定", "支援者資格資料", null, "所有支援資格完成核定", "支援種類、名額、有效期間、核定人", "支援者資格核定", "助理主管", "不適用", null, null, null, null, null],
  ["PKG-08", "內部核定", "初始能力、熟悉度、要求與資格", null, "所有初始資料完成主管核定", "主管決定、生效日、核定人及必要說明", "主管核定中心", "助理主管／助理長", "不適用", null, null, null, null, null],
  ["PKG-09", "正式試排", "一筆非範例端到端正式班次", null, "至少 1 筆正式班次完成需求、配置、支援、確認與發布", "班次需求、主跟診、支援配置、三週／一週確認、最終發布", "班次需求輸入／排班配置輸入／班次檢核總覽", "助理主管／諮詢組", "不適用", null, null, null, null, null],
];
intake.getRange("A11:N20").values = [headers, ...rows];
intake.getRange("A11:N11").format = { fill: navy, font: { name: "Arial", size: 10, bold: true, color: "#FFFFFF" }, horizontalAlignment: "center", verticalAlignment: "center", wrapText: true };
intake.getRange("A12:N20").format = { font: { name: "Arial", size: 10, color: "#263238" }, wrapText: true, verticalAlignment: "center" };
intake.getRange("A12:H20").format.fill = "#F7FBFD";
intake.getRange("I12:K20").format.fill = amber;
intake.getRange("L12:N20").format.fill = paleBlue;

const gapFormulas = [
  `='主管工作台'!$B$20`, `='主管工作台'!$B$21`, `='主管工作台'!$B$22`, `='主管工作台'!$B$27`,
  `='主管工作台'!$B$26`, `='主管工作台'!$B$25`, `='主管工作台'!$B$24`, `='主管工作台'!$A$7`,
  `=IF('上線準備'!$D$21>=1,0,1)`,
];
for (let i = 0; i < gapFormulas.length; i++) intake.getRange(`D${12 + i}`).formulas = [[gapFormulas[i]]];
for (let r = 12; r <= 20; r++) {
  intake.getRange(`L${r}`).formulas = [[`=IF($D${r}=0,"系統條件完成","尚有缺口")`]];
  intake.getRange(`M${r}`).formulas = [[`=IF($L${r}="系統條件完成","已完成",IF($B${r}="外部正式資料",IF($I${r}="已提供",IF(AND($J${r}<>"",$K${r}<>""),"已收件，待核定","待補收件資料"),IF($I${r}="不適用","待提供","待提供")),"待內部處理"))`]];
  intake.getRange(`N${r}`).formulas = [[`=IF($M${r}="已完成","保存正式來源與核定紀錄",IF($M${r}="待提供","向診所索取正式資料包",IF($M${r}="待補收件資料","補填收件日與收件人",IF($M${r}="已收件，待核定","到指定工作表逐列建檔、核定與發布","到指定流程完成內部處理"))))`]];
}
intake.getRange("I12:I20").dataValidation = { rule: { type: "list", values: ["未提供", "已提供", "不適用"] } };
intake.getRange("J12:J20").format.numberFormat = "yyyy-mm-dd";
intake.getRange("M12:M20").conditionalFormats.add("containsText", { text: "已完成", format: { fill: green, font: { color: "#375623", bold: true } } });
intake.getRange("M12:M20").conditionalFormats.add("containsText", { text: "待提供", format: { fill: red, font: { color: "#9C0006", bold: true } } });
intake.getRange("M12:M20").conditionalFormats.add("containsText", { text: "待補", format: { fill: amber, font: { color: "#7F6000", bold: true } } });
intake.getRange("M12:M20").conditionalFormats.add("containsText", { text: "待核定", format: { fill: amber, font: { color: "#7F6000", bold: true } } });
intake.getRange("M12:M20").conditionalFormats.add("containsText", { text: "待內部", format: { fill: amber, font: { color: "#7F6000", bold: true } } });

const widths = [13, 16, 34, 12, 30, 56, 38, 24, 14, 14, 16, 18, 20, 34];
for (let i = 0; i < widths.length; i++) intake.getRange(`${String.fromCharCode(65 + i)}:${String.fromCharCode(65 + i)}`).format.columnWidth = widths[i];
intake.freezePanes.freezeRows(11);
intake.freezePanes.freezeColumns(3);
intake.tabColor = "#ED7D31";

// Export once so the new sheet has a stable identity before existing sheets reference it.
wb.recalculate();
let out = await SpreadsheetFile.exportXlsx(wb);
await out.save(path);

wb = await SpreadsheetFile.importXlsx(await FileBlob.load(path));
const dashboard = wb.worksheets.getItem("主管工作台");
dashboard.getRange("A30:E30").values = [["正式資料收件", null, "正式資料收件", "外部資料已收齊、內部核定與正式試排皆完成", null]];
dashboard.getRange("B30").formulas = [[`=COUNTIFS('正式資料收件'!$M$12:$M$20,"<>已完成")`]];
dashboard.getRange("E30").formulas = [[`=IF(B30=0,"正式資料收件與處理均完成","仍有 "&B30&" 個資料包／工作待完成")`]];
dashboard.getRange("A30:E30").format.font = { name: "Arial", size: 10, color: "#263238" };
dashboard.getRange("A30:E30").format.borders = { bottom: { style: "hair", color: line } };
dashboard.getRange("B30").format = { fill: "#DDEBF7", font: { name: "Arial", size: 10, bold: true, color: "#263238" }, horizontalAlignment: "right", numberFormat: "#,##0" };
dashboard.getRange("E30").format = { fill: amber, font: { name: "Arial", size: 10, bold: true, color: "#7F6000" } };

const priorityFormula = `=IF($D$7>0,"先處理班次安全異常",IF($B$28>0,"處理排班例外申請",IF($M$7>0,"處理資格暫停或逾期",IF($G$7>0,"安排近期半年複評",IF('正式資料收件'!$G$7>0,"先收齊診所正式資料",IF($A$7>0,"完成初始資料與資格核定",IF($B$27>0,"補齊七類檢核表內容與版本",IF($J$7>0,"處理能力升級候選",IF(SUM($B$20:$B$22)>0,"完成正式規則建檔與核定",IF($B$29>0,"完成上線準備閘門","今日無高優先待辦"))))))))))`;
const locationFormula = `=IF($D$7>0,"班次檢核總覽／排班配置輸入",IF($B$28>0,"排班例外核定",IF($M$7>0,"資格恢復處理／資格有效性",IF($G$7>0,"複評待辦／考核紀錄輸入",IF('正式資料收件'!$G$7>0,"正式資料收件",IF($A$7>0,"主管核定中心／支援者資格核定",IF($B$27>0,"檢核表版本／檢核表項目輸入",IF($J$7>0,"能力升級候選",IF(SUM($B$20:$B$22)>0,"正式資料收件／正式規則輸入",IF($B$29>0,"上線準備","主管工作台"))))))))))`;
const completionFormula = `=IF($D$7>0,"最終發布判定為可發布、例外核定可發布或人力已釋出",IF($B$28>0,"安全閘門通過且例外有效，或完成退回／撤銷",IF($M$7>0,"完成補訓、複評與主管核定後恢復資格",IF($G$7>0,"完成複評，或安排符合規則的補考日",IF('正式資料收件'!$G$7>0,"外部資料包已提供，且收件日與收件人完整",IF($A$7>0,"主管決定、生效日與核定人完整",IF($B$27>0,"檢核項目與版本均核定發布",IF($J$7>0,"證據完整且主管核定升級",IF(SUM($B$20:$B$22)>0,"正式內容完整且狀態為已核定",IF($B$29>0,"所有系統閘門與人工確認完成","維持每日巡檢"))))))))))`;
dashboard.getRange("I20").formulas = [[priorityFormula]];
dashboard.getRange("I21").formulas = [[locationFormula]];
dashboard.getRange("I22").formulas = [[completionFormula]];

const guide = wb.worksheets.getItem("主管操作導引");
guide.getRange("C15").values = [["正式規則與檢核表內容收件"]];
guide.getRange("D15").formulas = [[`=COUNTIFS('正式資料收件'!$B$12:$B$20,"外部正式資料",'正式資料收件'!$M$12:$M$20,"<>已完成")`]];
guide.getRange("E15").values = [["正式資料收件、醫師模式規則輸入、流動層級規則輸入、職級矩陣規則輸入、檢核表項目輸入"]];
guide.getRange("G15:J15").values = [["先登記收件，再逐列填入正式條件並核定", "外部資料均已收件且正式內容完整核定", "不得推定缺少的臨床門檻", "規則與檢核表版本發布"]];

const readiness = wb.worksheets.getItem("上線準備");
readiness.getRange("B7").formulas = [[`=IF('正式資料收件'!$G$7>0,"先收齊診所正式資料",IF(COUNTIFS($M$12:$M$21,"未完成")>0,"完成正式內容建檔、核定與正式試排",IF(COUNTIFS($M$22:$M$25,"<>已完成")>0,"完成主管人工確認","安排正式上線日期與責任人")))`]];
readiness.getRange("G15").values = [["正式資料收件、檢核表項目輸入、檢核表版本"]];
readiness.getRange("G17:G19").values = [["正式資料收件、醫師模式規則輸入"], ["正式資料收件、流動層級規則輸入"], ["正式資料收件、職級矩陣規則輸入"]];

const overview = wb.worksheets.getItem("續作總覽");
overview.getRange("A34:D34").values = [["正式資料收件", 9, "流程已建立，待診所提供與內部處理", "4 個外部正式資料包、4 個內部核定工作與 1 個正式試排集中追蹤，並同步主管工作台與上線準備"]];
overview.getRange("B34").format.numberFormat = "#,##0";

wb.recalculate();
await fs.mkdir(previewDir, { recursive: true });
for (const [name, range] of [["正式資料收件", "A1:N20"], ["主管工作台", "A19:M30"], ["主管操作導引", "A11:K22"], ["上線準備", "A1:N25"]]) {
  const image = await wb.render({ sheetName: name, range, scale: 1.08, format: "png" });
  await fs.writeFile(`${previewDir}/${name}.png`, new Uint8Array(await image.arrayBuffer()));
}
for (const range of ["正式資料收件!A1:N20", "主管工作台!A20:M30", "主管操作導引!A11:K22", "上線準備!A1:N25", "續作總覽!A31:D34"]) {
  console.log((await wb.inspect({ kind: "table", range, include: "values,formulas", tableMaxRows: 35, tableMaxCols: 16, maxChars: 30000 })).ndjson);
}
console.log((await wb.inspect({ kind: "match", searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!|#SPILL!|#CALC!", options: { useRegex: true, maxResults: 500 }, maxChars: 12000 })).ndjson);
out = await SpreadsheetFile.exportXlsx(wb);
await out.save(path);
console.log(`SAVED ${path}`);

import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const path = "../outputs/clinic-assistant-model/assistant_skill_matrix_v1_pilot.xlsx";
const previewDir = "./go-live-previews";
const navy = "#1F5E78";
const amber = "#FFF2CC";
const paleBlue = "#EAF5FA";
const green = "#E2F0D9";
const red = "#FCE4D6";
const line = "#B7C9D3";

let wb = await SpreadsheetFile.importXlsx(await FileBlob.load(path));
const readiness = wb.worksheets.add("上線準備");
readiness.showGridLines = false;
readiness.getRange("A2:N2").merge();
readiness.getRange("A2").values = [["診所助理排班工具－正式上線準備閘門"]];
readiness.getRange("A2:N2").format.font = { name: "Arial", size: 15, bold: true, color: "#263238" };
readiness.getRange("A3:N3").format.borders = { bottom: { style: "thin", color: line } };
readiness.getRange("A4:N4").merge();
readiness.getRange("A4").values = [["系統條件與人工營運確認都完成後，才可進入正式上線。此頁只判斷準備程度，不會改寫能力、資格、排班或發布結果；未提供的正式臨床規則仍須由助理長與主管補齊。"]];
readiness.getRange("A4:N4").format.font = { name: "Arial", size: 10, italic: true, color: "#607D8B" };

readiness.getRange("A6:A7").values = [["整體狀態"], ["下一步"]];
readiness.getRange("A6:A7").format = { fill: navy, font: { name: "Arial", size: 10, bold: true, color: "#FFFFFF" }, verticalAlignment: "center" };
readiness.getRange("B6:F6").merge();
readiness.getRange("B7:F7").merge();
readiness.getRange("B6").formulas = [[`=IF(COUNTIFS($M$12:$M$25,"<>已完成")=0,"可進入正式上線","尚有 "&COUNTIFS($M$12:$M$25,"<>已完成")&" 項未完成")`]];
readiness.getRange("B7").formulas = [[`=IF(COUNTIFS($M$12:$M$21,"未完成")>0,"先完成系統資料與正式規則",IF(COUNTIFS($M$22:$M$25,"<>已完成")>0,"完成主管人工確認","安排正式上線日期與責任人"))`]];
readiness.getRange("B6:F7").format = { fill: paleBlue, font: { name: "Arial", size: 11, bold: true, color: "#263238" }, wrapText: true };

readiness.getRange("G6:L6").values = [["系統阻擋", null, "人工待確認", null, "已通過正式試排", null]];
for (const pair of [["G6:H6"], ["I6:J6"], ["K6:L6"]]) readiness.getRange(pair[0]).merge();
readiness.getRange("G6:L6").format = { fill: navy, font: { name: "Arial", size: 10, bold: true, color: "#FFFFFF" }, horizontalAlignment: "center" };
readiness.getRange("G7:H7").merge();
readiness.getRange("I7:J7").merge();
readiness.getRange("K7:L7").merge();
readiness.getRange("G7").formulas = [[`=COUNTIFS($I$12:$I$25,"否",$M$12:$M$25,"<>已完成")`]];
readiness.getRange("I7").formulas = [[`=COUNTIFS($I$12:$I$25,"是",$M$12:$M$25,"<>已完成")`]];
readiness.getRange("K7").formulas = [[`=$D$21`]];
readiness.getRange("G7:L7").format = { fill: "#DDEBF7", font: { name: "Arial", size: 13, bold: true, color: "#263238" }, horizontalAlignment: "center" };

const headers = ["閘門編號", "類別", "上線前條件", "目前值", "目標／標準", "系統判定", "處理位置", "負責角色", "需人工確認", "人工確認", "確認日", "確認人", "最終狀態", "下一步／說明"];
const rows = [
  ["GL-01", "資料治理", "初始能力、熟悉度、要求與資格全部核定", null, 0, null, "主管核定中心", "助理主管／助理長", "否", "系統判定", null, null, null, "完成主管決定、生效日與核定人"],
  ["GL-02", "員工治理", "能力路徑、培訓組、主管與正式職級核定", null, 0, null, "員工治理核定", "助理主管／助理長", "否", "系統判定", null, null, null, "補齊 14 位員工治理資料"],
  ["GL-03", "技能治理", "技能來源名稱完成核定、拆分與發布", null, 0, null, "技能名稱對照", "助理長／各組主管", "否", "系統判定", null, null, null, "處理同義名稱、複合項目與代碼衝突"],
  ["GL-04", "考核治理", "七類半年複評檢核表全部發布", null, 0, null, "檢核表版本、檢核表項目輸入", "助理主管／助理長", "否", "系統判定", null, null, null, "填入正式操作項目、標準與證據方式"],
  ["GL-05", "支援治理", "支援者種類、名額與生效資料全部核定", null, 0, null, "支援者資格核定", "助理主管", "否", "系統判定", null, null, null, "完成完整支援者與技術備援者核定"],
  ["GL-06", "醫師規則", "其餘 8 位醫師正式治療模式規則核定", null, 0, null, "醫師模式規則輸入", "助理長／各組主管", "否", "系統判定", null, null, null, "匯入正式治療、階段與支援要求"],
  ["GL-07", "流動規則", "正職 3 級與兼職 6 級流動規則核定", null, 0, null, "流動層級規則輸入", "助理長／各組主管", "否", "系統判定", null, null, null, "匯入正式任務條件與升級標準"],
  ["GL-08", "職級規則", "Lv.1–Lv.10 正式職級矩陣核定", null, 0, null, "職級矩陣規則輸入", "助理長", "否", "系統判定", null, null, null, "匯入既有正式升級條件"],
  ["GL-09", "資格建置", "不得有未建立的必要資格", null, 0, null, "考核紀錄輸入、資格有效性", "助理主管", "否", "系統判定", null, null, null, "先完成正式考核與資格核定"],
  ["GL-10", "端到端試排", "至少一筆正式班次完成需求、配置、支援、確認與發布", null, 1, null, "班次需求輸入、排班配置輸入、班次檢核總覽", "助理主管／諮詢組", "否", "系統判定", null, null, null, "使用非範例班次完成一次正式試排"],
  ["GL-11", "操作確認", "主管已逐步演練主管操作導引", null, "人工確認", "需人工確認", "主管操作導引", "助理主管／助理長", "是", "待確認", null, null, null, "依十一步流程完成桌上演練"],
  ["GL-12", "權限確認", "各角色可見範圍與操作權限已確認", null, "人工確認", "需人工確認", "主管操作導引、諮詢排班視圖", "助理長", "是", "待確認", null, null, null, "確認諮詢組、醫師與排班人員的可見範圍"],
  ["GL-13", "版本備份", "正式上線檔已備份並指定版本保管人", null, "人工確認", "需人工確認", "診所檔案管理位置", "助理長／診所負責人", "是", "待確認", null, null, null, "建立唯讀備份與版本命名方式"],
  ["GL-14", "教育與責任", "使用人員已完成說明並指定異常處理責任人", null, "人工確認", "需人工確認", "主管操作導引", "助理長／各組主管", "是", "待確認", null, null, null, "完成說明、回報管道與上線日期"],
];
readiness.getRange("A11:N25").values = [headers, ...rows];
readiness.getRange("A11:N11").format = { fill: navy, font: { name: "Arial", size: 10, bold: true, color: "#FFFFFF" }, horizontalAlignment: "center", verticalAlignment: "center", wrapText: true };
readiness.getRange("A12:N25").format = { font: { name: "Arial", size: 10, color: "#263238" }, wrapText: true, verticalAlignment: "center" };
readiness.getRange("A12:H25").format.fill = "#F7FBFD";
readiness.getRange("I12:L25").format.fill = amber;
readiness.getRange("M12:N25").format.fill = paleBlue;

const currentFormulas = [
  `='主管工作台'!$A$7`, `='主管工作台'!$B$25`, `='主管工作台'!$B$26`, `='主管工作台'!$B$27`, `='主管工作台'!$B$24`,
  `='主管工作台'!$B$20`, `='主管工作台'!$B$21`, `='主管工作台'!$B$22`, `='主管工作台'!$B$17`,
  `=COUNTIFS('班次檢核總覽'!$R$7:$R$36,"正式",'班次檢核總覽'!$W$7:$W$36,"可發布")+COUNTIFS('班次檢核總覽'!$R$7:$R$36,"正式",'班次檢核總覽'!$W$7:$W$36,"例外核定可發布")`,
];
for (let i = 0; i < 10; i++) readiness.getRange(`D${12 + i}`).formulas = [[currentFormulas[i]]];
for (let r = 12; r <= 20; r++) readiness.getRange(`F${r}`).formulas = [[`=IF($D${r}<=$E${r},"系統條件完成","未完成")`]];
readiness.getRange("F21").formulas = [[`=IF($D21>=$E21,"系統條件完成","未完成")`]];

const finalStatus = [];
for (let r = 12; r <= 25; r++) {
  finalStatus.push([`=IF($I${r}="否",IF($F${r}="系統條件完成","已完成","未完成"),IF(AND($J${r}="已完成",$K${r}<>"",$L${r}<>""),"已完成",IF($J${r}="退回","未完成","待人工確認")))`]);
}
readiness.getRange("M12:M25").formulas = finalStatus;
readiness.getRange("J22:J25").dataValidation = { rule: { type: "list", values: ["待確認", "已完成", "退回"] } };
readiness.getRange("K22:K25").format.numberFormat = "yyyy-mm-dd";
readiness.getRange("M12:M25").conditionalFormats.add("containsText", { text: "已完成", format: { fill: green, font: { color: "#375623", bold: true } } });
readiness.getRange("M12:M25").conditionalFormats.add("containsText", { text: "未完成", format: { fill: red, font: { color: "#9C0006", bold: true } } });
readiness.getRange("M12:M25").conditionalFormats.add("containsText", { text: "待人工確認", format: { fill: amber, font: { color: "#7F6000", bold: true } } });

const widths = [14, 16, 40, 12, 16, 18, 34, 22, 14, 16, 14, 16, 18, 42];
for (let i = 0; i < widths.length; i++) readiness.getRange(`${String.fromCharCode(65 + i)}:${String.fromCharCode(65 + i)}`).format.columnWidth = widths[i];
readiness.freezePanes.freezeRows(11);
readiness.freezePanes.freezeColumns(3);
readiness.tabColor = "#A5A5A5";

wb.recalculate();
let out = await SpreadsheetFile.exportXlsx(wb);
await out.save(path);

wb = await SpreadsheetFile.importXlsx(await FileBlob.load(path));
const dashboard = wb.worksheets.getItem("主管工作台");
dashboard.getRange("A29:E29").values = [["上線準備", null, "上線準備", "系統條件與人工確認全部完成", null]];
dashboard.getRange("B29").formulas = [[`=COUNTIFS('上線準備'!$M$12:$M$25,"<>已完成")`]];
dashboard.getRange("E29").formulas = [[`=IF(B29=0,"可進入正式上線","仍有 "&B29&" 項上線條件未完成")`]];
dashboard.getRange("A29:E29").format.font = { name: "Arial", size: 10, color: "#263238" };
dashboard.getRange("A29:E29").format.borders = { bottom: { style: "hair", color: line } };
dashboard.getRange("B29").format = { fill: "#DDEBF7", font: { name: "Arial", size: 10, bold: true, color: "#263238" }, horizontalAlignment: "right", numberFormat: "#,##0" };
dashboard.getRange("E29").format = { fill: amber, font: { name: "Arial", size: 10, bold: true, color: "#7F6000" } };

const priorityFormula = `=IF($D$7>0,"先處理班次安全異常",IF($B$28>0,"處理排班例外申請",IF($M$7>0,"處理資格暫停或逾期",IF($G$7>0,"安排近期半年複評",IF($A$7>0,"完成初始資料與資格核定",IF($B$27>0,"補齊七類檢核表內容與版本",IF($J$7>0,"處理能力升級候選",IF(SUM($B$20:$B$22)>0,"補齊正式規則內容",IF($B$29>0,"完成上線準備閘門","今日無高優先待辦")))))))))`;
const locationFormula = `=IF($D$7>0,"班次檢核總覽／排班配置輸入",IF($B$28>0,"排班例外核定",IF($M$7>0,"資格恢復處理／資格有效性",IF($G$7>0,"複評待辦／考核紀錄輸入",IF($A$7>0,"主管核定中心／支援者資格核定",IF($B$27>0,"檢核表版本／檢核表項目輸入",IF($J$7>0,"能力升級候選",IF(SUM($B$20:$B$22)>0,"醫師模式、流動層級、職級矩陣規則輸入",IF($B$29>0,"上線準備","主管工作台")))))))))`;
const completionFormula = `=IF($D$7>0,"最終發布判定為可發布、例外核定可發布或人力已釋出",IF($B$28>0,"安全閘門通過且例外有效，或完成退回／撤銷",IF($M$7>0,"完成補訓、複評與主管核定後恢復資格",IF($G$7>0,"完成複評，或安排符合規則的補考日",IF($A$7>0,"主管決定、生效日與核定人完整",IF($B$27>0,"檢核項目與版本均核定發布",IF($J$7>0,"證據完整且主管核定升級",IF(SUM($B$20:$B$22)>0,"正式內容完整且狀態為已核定",IF($B$29>0,"所有系統閘門與人工確認完成","維持每日巡檢")))))))))`;
dashboard.getRange("I20").formulas = [[priorityFormula]];
dashboard.getRange("I21").formulas = [[locationFormula]];
dashboard.getRange("I22").formulas = [[completionFormula]];

const guide = wb.worksheets.getItem("主管操作導引");
guide.getRange("B6").formulas = [[`='主管工作台'!$I$20`]];
guide.getRange("B7").formulas = [[`='主管工作台'!$I$21`]];
guide.getRange("B8").formulas = [[`='主管工作台'!$I$22`]];
guide.getRange("A22:K22").values = [[11, "正式上線前", "上線準備閘門", null, "上線準備", "助理主管／助理長／診所負責人", "完成系統條件、正式試排、權限、備份與教育確認", "所有閘門狀態均為已完成", "不得以流程骨架取代正式資料", "安排正式上線日期", null]];
guide.getRange("D22").formulas = [[`='主管工作台'!$B$29`]];
guide.getRange("K22").formulas = [[`=IF($D22=0,"已完成","待處理")`]];
guide.getRange("A22:C22").format.fill = "#F7FBFD";
guide.getRange("D22").format.fill = paleBlue;
guide.getRange("E22:J22").format.fill = "#FFFFFF";
guide.getRange("K22").format.fill = amber;
guide.getRange("A22:K22").format = { font: { name: "Arial", size: 10, color: "#263238" }, wrapText: true, verticalAlignment: "center" };
guide.getRange("K22").conditionalFormats.add("containsText", { text: "已完成", format: { fill: green, font: { color: "#375623", bold: true } } });
guide.getRange("K22").conditionalFormats.add("containsText", { text: "待處理", format: { fill: amber, font: { color: "#7F6000", bold: true } } });

const overview = wb.worksheets.getItem("續作總覽");
overview.getRange("B32").values = [[11]];
overview.getRange("D32").values = [["十一步日常流程、角色可見範圍、安全底線、動態最高優先事項與上線準備閘門已接入主管工作台"]];
overview.getRange("A33:D33").values = [["正式上線準備閘門", 14, "流程已建立，尚未達標", "10 項系統條件與 4 項人工營運確認；正式資料與至少一筆正式試排完成後才可上線"]];
overview.getRange("B33").format.numberFormat = "#,##0";

wb.recalculate();
await fs.mkdir(previewDir, { recursive: true });
for (const [name, range] of [["上線準備", "A1:N25"], ["主管工作台", "A19:M29"], ["主管操作導引", "A1:K22"]]) {
  const image = await wb.render({ sheetName: name, range, scale: 1.12, format: "png" });
  await fs.writeFile(`${previewDir}/${name}.png`, new Uint8Array(await image.arrayBuffer()));
}
for (const range of ["上線準備!A1:N25", "主管工作台!A20:M29", "主管操作導引!A11:K22", "續作總覽!A31:D33"]) {
  console.log((await wb.inspect({ kind: "table", range, include: "values,formulas", tableMaxRows: 30, tableMaxCols: 16, maxChars: 24000 })).ndjson);
}
console.log((await wb.inspect({ kind: "match", searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!|#SPILL!|#CALC!", options: { useRegex: true, maxResults: 500 }, maxChars: 12000 })).ndjson);
out = await SpreadsheetFile.exportXlsx(wb);
await out.save(path);
console.log(`SAVED ${path}`);

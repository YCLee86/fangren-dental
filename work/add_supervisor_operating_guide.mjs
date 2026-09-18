import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const path = "../outputs/clinic-assistant-model/assistant_skill_matrix_v1_pilot.xlsx";
const previewDir = "./supervisor-guide-previews";
const wb = await SpreadsheetFile.importXlsx(await FileBlob.load(path));

const navy = "#1F5E78";
const amber = "#FFF2CC";
const paleBlue = "#EAF5FA";
const green = "#E2F0D9";
const red = "#FCE4D6";
const line = "#B7C9D3";

const priorityFormula = `=IF('主管工作台'!$D$7>0,"先處理班次安全異常",IF('主管工作台'!$B$28>0,"處理排班例外申請",IF('主管工作台'!$M$7>0,"處理資格暫停或逾期",IF('主管工作台'!$G$7>0,"安排近期半年複評",IF('主管工作台'!$A$7>0,"完成初始資料與資格核定",IF('主管工作台'!$B$27>0,"補齊七類檢核表內容與版本",IF('主管工作台'!$J$7>0,"處理能力升級候選",IF(SUM('主管工作台'!$B$20:$B$22)>0,"補齊正式規則內容","今日無高優先待辦"))))))))`;
const locationFormula = `=IF('主管工作台'!$D$7>0,"班次檢核總覽／排班配置輸入",IF('主管工作台'!$B$28>0,"排班例外核定",IF('主管工作台'!$M$7>0,"資格恢復處理／資格有效性",IF('主管工作台'!$G$7>0,"複評待辦／考核紀錄輸入",IF('主管工作台'!$A$7>0,"主管核定中心／支援者資格核定",IF('主管工作台'!$B$27>0,"檢核表版本／檢核表項目輸入",IF('主管工作台'!$J$7>0,"能力升級候選",IF(SUM('主管工作台'!$B$20:$B$22)>0,"醫師模式、流動層級、職級矩陣規則輸入","主管工作台"))))))))`;
const completionFormula = `=IF('主管工作台'!$D$7>0,"最終發布判定為可發布、例外核定可發布或人力已釋出",IF('主管工作台'!$B$28>0,"安全閘門通過且例外有效，或完成退回／撤銷",IF('主管工作台'!$M$7>0,"完成補訓、複評與主管核定後恢復資格",IF('主管工作台'!$G$7>0,"完成複評，或安排符合規則的補考日",IF('主管工作台'!$A$7>0,"主管決定、生效日與核定人完整",IF('主管工作台'!$B$27>0,"檢核項目與版本均核定發布",IF('主管工作台'!$J$7>0,"證據完整且主管核定升級",IF(SUM('主管工作台'!$B$20:$B$22)>0,"正式內容完整且狀態為已核定","維持每日巡檢"))))))))`;

const guide = wb.worksheets.add("主管操作導引");
guide.showGridLines = false;
guide.getRange("A2:K2").merge();
guide.getRange("A2").values = [["診所助理排班工具－主管操作導引"]];
guide.getRange("A2:K2").format.font = { name: "Arial", size: 15, bold: true, color: "#263238" };
guide.getRange("A3:K3").format.borders = { bottom: { style: "thin", color: line } };
guide.getRange("A4:K4").merge();
guide.getRange("A4").values = [["從目前待辦開始，依序完成療程確認、資料核定、人力配置、安全檢核與發布。黃色工作表通常需要人工輸入；藍色欄位與狀態由系統計算。正式規則、資格、考核與例外都必須保留核定紀錄。"]];
guide.getRange("A4:K4").format.font = { name: "Arial", size: 10, italic: true, color: "#607D8B" };

guide.getRange("A6:A8").values = [["目前最優先"], ["處理位置"], ["完成條件"]];
guide.getRange("A6:A8").format = { fill: navy, font: { name: "Arial", size: 10, bold: true, color: "#FFFFFF" }, verticalAlignment: "center" };
for (const row of [6, 7, 8]) guide.getRange(`B${row}:K${row}`).merge();
guide.getRange("B6").formulas = [[priorityFormula]];
guide.getRange("B7").formulas = [[locationFormula]];
guide.getRange("B8").formulas = [[completionFormula]];
guide.getRange("B6:K8").format = { fill: paleBlue, font: { name: "Arial", size: 11, bold: true, color: "#263238" }, wrapText: true, verticalAlignment: "center" };

const headers = ["順序", "處理時點", "工作項目", "待辦數", "主要操作位置", "負責角色", "必要輸入／動作", "完成條件", "不可略過", "完成後流向", "目前狀態"];
const workflows = [
  [1, "每日／三週前", "療程標記與一般診確認", null, "諮詢排班視圖、班次需求輸入", "諮詢組", "特殊療程或一般診明確標記；填標記人與日期", "三週標記資料完整", "空白不能視為一般診", "一週前診前確認", null],
  [2, "一週前／異動時", "診前確認與人力異動", null, "班次需求輸入、諮詢排班視圖", "跟診助理／諮詢組／助理主管", "確認療程、器械與注意事項；影響人力時重新檢查", "確認流程狀態為確認完成", "諮詢組不直接指定助理", "班次與支援配置", null],
  [3, "上線前／資料變更", "能力、熟悉度、資格與支援核定", null, "主管核定中心、支援者資格核定", "助理主管／助理長", "核對來源、主管決定、生效日與核定人", "所有必要紀錄可生效", "未核定資料不可正式排班", "班次適配與配置", null],
  [4, "收到正式制度時", "醫師、流動與職級規則收件", null, "醫師模式規則輸入、流動層級規則輸入、職級矩陣規則輸入", "助理長／各組主管", "逐列填完整正式條件並核定", "必填欄位完整且已核定", "不得推定缺少的臨床門檻", "規則版本發布", null],
  [5, "排班前／異動後", "班次、人力與支援檢核", null, "排班配置輸入、班次檢核總覽", "助理主管", "配置主跟診與支援者；排除資格、容量與時間衝突", "最終發布判定可發布", "學習觀摩不計正式人力", "諮詢組查看發布結果", null],
  [6, "僅限資料差異", "排班例外核定", null, "排班例外核定", "助理主管／助理長", "填佐證、補償措施、有效日與核定資料", "例外有效且限單一班次", "缺人、缺支援、容量不足、衝突不可例外", "例外核定可發布", null],
  [7, "新技能／未建立資格", "正式考核與檢核表版本", null, "檢核表版本、檢核表項目輸入、考核紀錄輸入", "考核人／助理主管", "先發布檢核表，再登錄正式考核與知悉", "考核可送主管核定", "必要步驟需提醒即未通過", "主管核定中心", null],
  [8, "到期前／未通過後", "半年複評與資格恢復", null, "複評待辦、資格恢復處理", "助理主管", "安排複評或補考；完成補訓、複評與核定", "資格有效或已恢復", "低頻高風險逾期無寬限", "回到排班適配", null],
  [9, "符合證據門檻時", "能力 Ø 升 ◎", null, "工作觀察輸入、面談與異議、能力升級候選", "助理主管", "三次成功觀察、至少兩日、一次面談且無關鍵遺漏", "主管人工核定升級", "條件達成不自動升級", "更新能力狀態", null],
  [10, "事件發生／限制解除", "事件、限制與異議", null, "事件與限制、面談與異議", "助理主管／助理長", "保存事件、影響技能、補訓、複評與最終決定", "限制已處理或依法維持", "只限制直接相關技能；安全暫停複核前維持", "資格恢復或持續限制", null],
];
guide.getRange("A11:K21").values = [headers, ...workflows];
guide.getRange("A11:K11").format = { fill: navy, font: { name: "Arial", size: 10, bold: true, color: "#FFFFFF" }, horizontalAlignment: "center", verticalAlignment: "center", wrapText: true };
guide.getRange("A12:K21").format = { font: { name: "Arial", size: 10, color: "#263238" }, wrapText: true, verticalAlignment: "center" };
guide.getRange("A12:C21").format.fill = "#F7FBFD";
guide.getRange("D12:D21").format.fill = paleBlue;
guide.getRange("E12:J21").format.fill = "#FFFFFF";
guide.getRange("K12:K21").format.fill = amber;

const taskCountFormulas = [
  `=COUNTIFS('班次需求輸入'!$A$7:$A$36,"<>",'班次需求輸入'!$K$7:$K$36,"正式",'班次需求輸入'!$X$7:$X$36,"待三週前標記")`,
  `=COUNTIFS('班次需求輸入'!$A$7:$A$36,"<>",'班次需求輸入'!$K$7:$K$36,"正式",'班次需求輸入'!$X$7:$X$36,"待一週前確認")+COUNTIFS('班次需求輸入'!$A$7:$A$36,"<>",'班次需求輸入'!$K$7:$K$36,"正式",'班次需求輸入'!$X$7:$X$36,"*待處理*")`,
  `='主管工作台'!$A$7+'主管工作台'!$B$24+'主管工作台'!$B$25+'主管工作台'!$B$26`,
  `=SUM('主管工作台'!$B$20:$B$22)`,
  `='主管工作台'!$D$7`,
  `='主管工作台'!$B$28`,
  `='主管工作台'!$B$17+'主管工作台'!$B$27`,
  `='主管工作台'!$G$7+'主管工作台'!$M$7+'主管工作台'!$B$16`,
  `='主管工作台'!$J$7`,
  `='主管工作台'!$B$18`,
];
const taskStatusFormulas = [];
for (let i = 0; i < 10; i++) {
  guide.getRange(`D${12 + i}`).formulas = [[taskCountFormulas[i]]];
  taskStatusFormulas.push([`=IF($D${12 + i}=0,"完成／無待辦","待處理")`]);
}
guide.getRange("K12:K21").formulas = taskStatusFormulas;
guide.getRange("K12:K21").conditionalFormats.add("containsText", { text: "完成", format: { fill: green, font: { color: "#375623", bold: true } } });
guide.getRange("K12:K21").conditionalFormats.add("containsText", { text: "待處理", format: { fill: amber, font: { color: "#7F6000", bold: true } } });

guide.getRange("A24:F24").values = [["角色", "主要介面", "可以查看", "不可查看", "可做決定", "交接對象"]];
guide.getRange("A24:F24").format = { fill: navy, font: { name: "Arial", size: 10, bold: true, color: "#FFFFFF" }, horizontalAlignment: "center", wrapText: true };
guide.getRange("A25:F29").values = [
  ["諮詢組", "諮詢排班視圖、班次需求輸入", "療程、人數、支援條件、確認與發布狀態", "個別考核、事件、面談細節", "標記療程、處理取消及通知人力需求", "助理主管"],
  ["助理主管", "主管工作台與各核定表", "能力、考核、觀察、事件、面談與排班資格", "依權限外資料", "日常核定、排班、支援、複評與限制", "助理長"],
  ["助理長", "主管工作台、版本與規則輸入", "全部治理與核定資料", "無", "發布規則、最終異議與重大例外", "診所負責人"],
  ["醫師", "不使用完整能力矩陣", "重大事件所需的具體資訊", "完整能力、考核與面談紀錄", "提供重大事件具體意見", "助理主管"],
  ["一般排班人員", "班次檢核總覽", "可獨立、可條件、不可排及所需支援", "個別考核、事件、面談細節", "依已發布結果排班", "助理主管"],
];
guide.getRange("A25:F29").format = { font: { name: "Arial", size: 10, color: "#263238" }, wrapText: true, verticalAlignment: "center" };
guide.getRange("A25:F29").format.fill = "#F7FBFD";

guide.getRange("H24:K24").merge();
guide.getRange("H24").values = [["安全底線"]];
guide.getRange("H24:K24").format = { fill: "#C55A11", font: { name: "Arial", size: 10, bold: true, color: "#FFFFFF" }, horizontalAlignment: "center" };
const safetyRows = [
  ["1", "未經主管核定的能力、資格與規則，不得作為正式排班放行依據。"],
  ["2", "△、※、未評估或資格暫停者，只能安排學習觀摩，不占正式人力。"],
  ["3", "高複雜度 Ø 必須有完整支援者 1:1；技術備援者不可替代。"],
  ["4", "缺主跟診、缺短時支援、支援容量不足、時段衝突及療程未確認不可例外。"],
  ["5", "正式職級 Lv.1–Lv.10 不直接代表當前排班資格。"],
  ["6", "事件原則上只限制直接相關技能；安全暫停在複核完成前維持。"],
];
guide.getRange("H25:K30").values = safetyRows.map(([n, text]) => [n, text, null, null]);
for (let r = 25; r <= 30; r++) guide.getRange(`I${r}:K${r}`).merge();
guide.getRange("H25:K30").format = { fill: "#FCE4D6", font: { name: "Arial", size: 10, color: "#9C0006" }, wrapText: true, verticalAlignment: "center" };
guide.getRange("H25:H30").format.font = { name: "Arial", size: 10, bold: true, color: "#9C0006" };

const widths = [8, 16, 24, 12, 30, 22, 38, 34, 34, 24, 16];
for (let i = 0; i < widths.length; i++) guide.getRange(`${String.fromCharCode(65 + i)}:${String.fromCharCode(65 + i)}`).format.columnWidth = widths[i];
guide.getRange("A:K").format.verticalAlignment = "center";
guide.freezePanes.freezeRows(11);
guide.freezePanes.freezeColumns(3);
guide.tabColor = "#5B9BD5";

const dashboard = wb.worksheets.getItem("主管工作台");
dashboard.getRange("G20:H22").values = [["目前最優先" , null], ["處理位置", null], ["完成條件", null]];
for (const r of [20, 21, 22]) dashboard.getRange(`G${r}:H${r}`).merge();
for (const r of [20, 21, 22]) dashboard.getRange(`I${r}:M${r}`).merge();
dashboard.getRange("G20:H22").format = { fill: navy, font: { name: "Arial", size: 10, bold: true, color: "#FFFFFF" }, verticalAlignment: "center" };
dashboard.getRange("I20").formulas = [[priorityFormula]];
dashboard.getRange("I21").formulas = [[locationFormula]];
dashboard.getRange("I22").formulas = [[completionFormula]];
dashboard.getRange("I20:M22").format = { fill: paleBlue, font: { name: "Arial", size: 10, bold: true, color: "#263238" }, wrapText: true, verticalAlignment: "center" };

dashboard.getRange("G24:M24").merge();
dashboard.getRange("G24").values = [["不可略過的安全底線"]];
dashboard.getRange("G24:M24").format = { fill: "#C55A11", font: { name: "Arial", size: 10, bold: true, color: "#FFFFFF" }, horizontalAlignment: "center" };
const dashboardSafety = [
  "缺人、缺支援、容量不足、時段衝突及療程未確認不可例外",
  "未發布檢核表不可作為正式考核依據",
  "正式職級不直接作為排班放行條件",
  "安全相關資格暫停在複核完成前維持",
];
for (let i = 0; i < dashboardSafety.length; i++) {
  const r = 25 + i;
  dashboard.getRange(`G${r}:M${r}`).merge();
  dashboard.getRange(`G${r}`).values = [[dashboardSafety[i]]];
}
dashboard.getRange("G25:M28").format = { fill: "#FCE4D6", font: { name: "Arial", size: 10, color: "#9C0006" }, wrapText: true };

const overview = wb.worksheets.getItem("續作總覽");
overview.getRange("A32:D32").values = [["主管操作導引", 10, "流程與優先順序已建立", "十步日常流程、角色可見範圍、安全底線及動態最高優先事項已接入主管工作台"]];
overview.getRange("B32").format.numberFormat = "#,##0";

wb.recalculate();
await fs.mkdir(previewDir, { recursive: true });
for (const [name, range] of [["主管操作導引", "A1:K30"], ["主管工作台", "A1:M28"]]) {
  const image = await wb.render({ sheetName: name, range, scale: 1.15, format: "png" });
  await fs.writeFile(`${previewDir}/${name}.png`, new Uint8Array(await image.arrayBuffer()));
}
for (const range of ["主管操作導引!A1:K21", "主管操作導引!A24:K30", "主管工作台!G20:M28", "續作總覽!A30:D32"]) {
  console.log((await wb.inspect({ kind: "table", range, include: "values,formulas", tableMaxRows: 35, tableMaxCols: 14, maxChars: 22000 })).ndjson);
}
console.log((await wb.inspect({ kind: "match", searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!|#SPILL!|#CALC!", options: { useRegex: true, maxResults: 500 }, maxChars: 12000 })).ndjson);
const out = await SpreadsheetFile.exportXlsx(wb);
await out.save(path);
console.log(`SAVED ${path}`);

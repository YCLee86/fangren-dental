import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const path = "../outputs/clinic-assistant-model/assistant_skill_matrix_v1_pilot.xlsx";
const previewDir = "./assessment-previews";
const wb = await SpreadsheetFile.importXlsx(await FileBlob.load(path));
const navy = "#1F5E78", amber = "#FFF2CC", paleBlue = "#EAF5FA", green = "#E2F0D9", red = "#FCE4D6", line = "#B7C9D3";

function col(n) { let s = ""; while (n > 0) { n--; s = String.fromCharCode(65 + n % 26) + s; n = Math.floor(n / 26); } return s; }
function addSheet(name, title, note, headers, rows, tableName, widths) {
  const s = wb.worksheets.add(name), last = col(headers.length);
  s.showGridLines = false;
  s.getRange("A2").values = [[title]];
  s.getRange(`A2:${last}2`).format.font = { name: "Arial", size: 14, bold: true, color: "#263238" };
  s.getRange(`A3:${last}3`).format.borders = { bottom: { style: "thin", color: line } };
  s.getRange("A4").values = [[note]];
  s.getRange(`A4:${last}4`).format.font = { name: "Arial", size: 10, italic: true, color: "#607D8B" };
  s.getRange(`A6:${last}${6 + rows.length}`).values = [headers, ...rows];
  const t = s.tables.add(`A6:${last}${6 + rows.length}`, true, tableName); t.style = "TableStyleMedium2";
  s.getRange(`A6:${last}6`).format = { fill: navy, font: { name: "Arial", size: 10, bold: true, color: "#FFFFFF" }, horizontalAlignment: "center", verticalAlignment: "center", wrapText: true };
  s.getRange(`A7:${last}${6 + rows.length}`).format.font = { name: "Arial", size: 10, color: "#263238" };
  widths.forEach((w, i) => { if (w) s.getRange(`${col(i + 1)}:${col(i + 1)}`).format.columnWidth = w; });
  s.freezePanes.freezeRows(6);
  return s;
}

const checklistRows = [
  ["CHK-STERIL-01", "器械清消流程", "V1 草案", new Date("2026-09-17"), "待內容確認", "關鍵必要／一般必要／觀察項目"],
  ["CHK-IMAGE-01", "影像操作（分項）", "V1 草案", new Date("2026-09-17"), "待內容確認", "PA、PANO、CT、側頭顱、手持 X 光機分項"],
  ["CHK-IMPLANT-01", "植牙相關準備", "V1 草案", new Date("2026-09-17"), "待內容確認", "低頻高風險"],
  ["CHK-PERIOSURG-01", "牙周手術相關準備", "V1 草案", new Date("2026-09-17"), "待內容確認", "低頻高風險"],
  ["CHK-MICROENDO-01", "顯微根管相關準備", "V1 草案", new Date("2026-09-17"), "待內容確認", "低頻高風險"],
  ["CHK-SEDATION-01", "舒眠手術相關準備", "V1 草案", new Date("2026-09-17"), "待內容確認", "低頻高風險"],
  ["CHK-RPD-FINAL-01", "RPD 印最終模", "V1 草案", new Date("2026-09-17"), "待內容確認", "低頻高風險"],
];
const checklist = addSheet("檢核表版本", "半年複評檢核表版本", "先建立七類檢核表的版本骨架。實際操作步驟須由助理主管確認後才能發布。", ["檢核表代碼", "適用技能／類別", "版本", "建立日", "發布狀態", "項目結構"], checklistRows, "ChecklistVersions", [24, 30, 18, 14, 18, 48]);
checklist.getRange("D7:D13").format.numberFormat = "yyyy-mm-dd";
checklist.getRange("E7:E13").format.fill = amber;

const assessmentRows = Array.from({ length: 100 }, () => Array(17).fill(null));
const assess = addSheet("考核紀錄輸入", "正式考核紀錄", "必要步驟若需提醒即未通過。通過後建議評等為 Ø；最終能力仍須進入主管核定中心。", ["考核編號", "考核日", "員工編號", "姓名", "技能代碼", "檢核表代碼", "檢核表版本", "考核人", "關鍵必要未通過數", "一般必要需提醒數", "觀察項目問題", "整體結果", "建議評等", "改善事項", "助理已知悉", "知悉日", "異議狀態"], assessmentRows, "AssessmentRecords", [16, 14, 14, 16, 28, 24, 16, 16, 20, 20, 20, 16, 14, 40, 16, 14, 18]);
assess.getRange("A7:C106").format.fill = amber; assess.getRange("E7:K106").format.fill = amber; assess.getRange("N7:Q106").format.fill = amber;
const assessFormulas = [];
for (let r = 7; r <= 106; r++) assessFormulas.push([
  `=IF($C${r}="","",_xlfn.XLOOKUP($C${r},'試行員工主檔'!$A$7:$A$20,'試行員工主檔'!$B$7:$B$20,"員工未建立",0))`,
  `=IF($A${r}="","",IF(OR($B${r}="",$C${r}="",$E${r}="",$F${r}="",$G${r}="",$H${r}=""),"資料未完整",IF(OR($I${r}>0,$J${r}>0),"未通過","通過")))`,
  `=IF($L${r}="通過","Ø",IF($L${r}="未通過","△",""))`,
]);
assess.getRange("D7:D106").formulas = assessFormulas.map(r => [r[0]]);
assess.getRange("L7:M106").formulas = assessFormulas.map(r => r.slice(1));
assess.getRange("D7:D106").format.fill = paleBlue; assess.getRange("L7:M106").format.fill = paleBlue;
assess.getRange("B7:B106").format.numberFormat = "yyyy-mm-dd"; assess.getRange("P7:P106").format.numberFormat = "yyyy-mm-dd";
assess.getRange("C7:C106").dataValidation = { rule: { type: "list", formula1: "'試行員工主檔'!$A$7:$A$20" } };
assess.getRange("E7:E106").dataValidation = { rule: { type: "list", formula1: "'技能主檔_V1'!$A$7:$A$24" } };
assess.getRange("F7:F106").dataValidation = { rule: { type: "list", formula1: "'檢核表版本'!$A$7:$A$13" } };
assess.getRange("O7:O106").dataValidation = { rule: { type: "list", values: ["待確認", "已知悉"] } };
assess.getRange("Q7:Q106").dataValidation = { rule: { type: "list", values: ["無異議", "提出異議", "複核中", "已結案"] } };
assess.tabColor = "#F4B183";

const obsRows = Array.from({ length: 200 }, () => Array(14).fill(null));
const obs = addSheet("工作觀察輸入", "工作觀察紀錄", "成功觀察須獨立完成、未經提醒且沒有關鍵遺漏；Ø 升 ◎ 至少需要三次、跨兩個工作日及面談檢視。", ["觀察編號", "日期", "員工編號", "姓名", "醫師", "模式代碼", "技能代碼", "獨立完成", "需要提醒", "關鍵遺漏", "觀察人", "備註", "成功觀察", "查找鍵"], obsRows, "WorkObservations", [16, 14, 14, 16, 18, 22, 28, 16, 16, 16, 16, 40, 16, 42]);
obs.getRange("A7:C206").format.fill = amber; obs.getRange("E7:L206").format.fill = amber;
const obsFormulas = [];
for (let r = 7; r <= 206; r++) obsFormulas.push([
  `=IF($C${r}="","",_xlfn.XLOOKUP($C${r},'試行員工主檔'!$A$7:$A$20,'試行員工主檔'!$B$7:$B$20,"員工未建立",0))`,
  `=IF($A${r}="","",IF(AND($H${r}="是",$I${r}="否",$J${r}="否"),"是","否"))`,
  `=IF(OR($C${r}="",$G${r}=""),"",$C${r}&"|"&$G${r})`,
]);
obs.getRange("D7:D206").formulas = obsFormulas.map(r => [r[0]]); obs.getRange("M7:N206").formulas = obsFormulas.map(r => r.slice(1));
obs.getRange("D7:D206").format.fill = paleBlue; obs.getRange("M7:N206").format.fill = paleBlue; obs.getRange("B7:B206").format.numberFormat = "yyyy-mm-dd";
obs.getRange("C7:C206").dataValidation = { rule: { type: "list", formula1: "'試行員工主檔'!$A$7:$A$20" } };
obs.getRange("F7:F206").dataValidation = { rule: { type: "list", formula1: "'李醫師治療模式'!$A$7:$A$19" } };
obs.getRange("G7:G206").dataValidation = { rule: { type: "list", formula1: "'技能主檔_V1'!$A$7:$A$24" } };
for (const c of ["H", "I", "J"]) obs.getRange(`${c}7:${c}206`).dataValidation = { rule: { type: "list", values: ["是", "否"] } };
obs.tabColor = "#F4B183";

const meetingRows = Array.from({ length: 100 }, () => Array(12).fill(null));
const meeting = addSheet("面談與異議", "面談、已知悉與異議複核", "已知悉只代表收到，不代表同意；複核人原則上不得與原考核人相同。", ["紀錄編號", "日期", "員工編號", "姓名", "類型", "關聯技能", "主管結論", "助理已知悉", "異議狀態", "複核人", "最終決定", "備註"], meetingRows, "InterviewAppeals", [16, 14, 14, 16, 18, 28, 40, 16, 18, 16, 24, 40]);
meeting.getRange("A7:C106").format.fill = amber; meeting.getRange("E7:L106").format.fill = amber;
const meetingNames = []; for (let r = 7; r <= 106; r++) meetingNames.push([`=IF($C${r}="","",_xlfn.XLOOKUP($C${r},'試行員工主檔'!$A$7:$A$20,'試行員工主檔'!$B$7:$B$20,"員工未建立",0))`]);
meeting.getRange("D7:D106").formulas = meetingNames; meeting.getRange("D7:D106").format.fill = paleBlue; meeting.getRange("B7:B106").format.numberFormat = "yyyy-mm-dd";
meeting.getRange("C7:C106").dataValidation = { rule: { type: "list", formula1: "'試行員工主檔'!$A$7:$A$20" } };
meeting.getRange("E7:E106").dataValidation = { rule: { type: "list", values: ["兩個月面談", "考核結果確認", "平時反映", "異議複核"] } };
meeting.getRange("H7:H106").dataValidation = { rule: { type: "list", values: ["待確認", "已知悉"] } };
meeting.getRange("I7:I106").dataValidation = { rule: { type: "list", values: ["無異議", "提出異議", "複核中", "已結案"] } };

const qual = wb.worksheets.getItem("資格有效性");
const qualRows = qual.getRange("A7:L62").values;
const dueRows = qualRows.map(r => [r[0], r[1], r[2], null, null, null, r[7], null, null, null]);
const due = addSheet("複評待辦", "半年複評待辦", "低頻高風險技能沒有寬限；其他技能只有在已排定補考日時才可啟用 30 天寬限。", ["員工編號", "姓名", "技能代碼", "目前評等", "資格狀態", "到期日", "寬限天數", "補考日", "剩餘天數", "處理建議"], dueRows, "RecheckTasks", [14, 16, 28, 14, 18, 14, 14, 14, 14, 42]);
const dueFormulas = [];
for (let i = 0; i < qualRows.length; i++) { const r = i + 7, src = i + 7; dueFormulas.push([
  `='資格有效性'!D${src}`, `='資格有效性'!E${src}`, `='資格有效性'!G${src}`, `='資格有效性'!I${src}`,
  `=IF($F${r}="","n.a.",$F${r}-TODAY())`,
  `=IF($E${r}="未建立","先完成考核",IF($E${r}="資格暫停","完成補訓與複評",IF($F${r}="","設定到期日",IF($I${r}<0,"立即停止使用資格",IF($I${r}<=30,"安排複評","尚未到期")))))`,
]); }
due.getRange("D7:I62").formulas = dueFormulas.map(r => r.slice(0, 5)); due.getRange("J7:J62").formulas = dueFormulas.map(r => [r[5]]);
due.getRange("D7:J62").format.fill = paleBlue; due.getRange("F7:F62").format.numberFormat = "yyyy-mm-dd"; due.getRange("H7:H62").format.numberFormat = "yyyy-mm-dd";
due.getRange("J7:J62").conditionalFormats.add("containsText", { text: "立即", format: { fill: red, font: { color: "#9C0006", bold: true } } });
due.getRange("J7:J62").conditionalFormats.add("containsText", { text: "安排", format: { fill: amber, font: { color: "#7F6000", bold: true } } });
due.tabColor = navy;

const overview = wb.worksheets.getItem("續作總覽");
overview.getRange("C12:D12").values = [["考核與複評流程已建立", "正式考核、觀察、面談異議及複評待辦已接入"]];
wb.recalculate();
await fs.mkdir(previewDir, { recursive: true });
for (const [name, range] of [["考核紀錄輸入", "A1:Q18"], ["工作觀察輸入", "A1:N18"], ["複評待辦", "A1:J24"]]) {
  const image = await wb.render({ sheetName: name, range, scale: 1, format: "png" });
  await fs.writeFile(`${previewDir}/${name}.png`, new Uint8Array(await image.arrayBuffer()));
}
console.log((await wb.inspect({ kind: "match", searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!|#SPILL!|#CALC!", options: { useRegex: true, maxResults: 300 }, maxChars: 12000 })).ndjson);
const out = await SpreadsheetFile.exportXlsx(wb); await out.save(path); console.log(`SAVED ${path}`);

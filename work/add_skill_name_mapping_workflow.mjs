import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const path = "../outputs/clinic-assistant-model/assistant_skill_matrix_v1_pilot.xlsx";
const previewDir = "./skill-mapping-previews";
const wb = await SpreadsheetFile.importXlsx(await FileBlob.load(path));

const navy = "#1F5E78";
const amber = "#FFF2CC";
const paleBlue = "#EAF5FA";
const green = "#E2F0D9";
const red = "#FCE4D6";
const line = "#B7C9D3";

const clean = (value) => String(value ?? "").replace(/[\r\n\t]+/g, " ").replace(/\s+/g, " ").trim();
const details = wb.worksheets.getItem("技能明細").getRange("A7:I1644").values;
const bySource = new Map();
for (const row of details) {
  const employeeId = clean(row[0]);
  const block = clean(row[3]);
  const category = clean(row[4]);
  const skill = clean(row[5]);
  const rating = clean(row[6]);
  if (!employeeId || !skill) continue;
  const key = `${block}|${category}|${skill}`;
  if (!bySource.has(key)) bySource.set(key, { block, category, skill, employees: new Set(), rated: new Set(), sourceRows: new Set() });
  const rec = bySource.get(key);
  rec.employees.add(employeeId);
  if (rating) rec.rated.add(employeeId);
  if (row[8] != null && clean(row[8])) rec.sourceRows.add(Number(row[8]));
}

const existing = new Map([
  ["病歷紀錄", ["病歷基本操作", "共通技能", "COMMON-RECORD"]],
  ["健保申報", ["健保申報", "共通技能", "COMMON-INSURANCE"]],
  ["X光片紀錄", ["X 光片紀錄", "共通技能", "COMMON-XRAY-RECORD"]],
  ["拍PA", ["拍 PA", "共通技術", "COMMON-PA"]],
  ["口掃機運用", ["口掃機運用", "共通技術", "COMMON-IOS"]],
]);
const newStandards = new Map([
  ["撤備台", ["撤台與備台", "流程技能", "FLOW-SETUP-CLEAR"]],
  ["器械清消流程", ["器械清潔消毒流程", "流程技能", "FLOW-STERILIZATION"]],
  ["認識治療項目", ["治療項目辨識", "流程技能", "FLOW-TREATMENT-RECOGNITION"]],
  ["替代跟診人員灌模", ["替代跟診灌模", "流程技能", "FLOW-CASTING"]],
  ["拍攝X光片(PANO)", ["PANO 影像操作", "共通技術", "COMMON-PANO"]],
  ["拍攝根尖片(用鱷魚夾)", ["PA 影像操作（鱷魚夾）", "共通技術", "COMMON-PA-CLAMP"]],
  ["拍攝根尖片(手壓片)", ["PA 影像操作（手壓片）", "共通技術", "COMMON-PA-HAND"]],
  ["開、關診工作", ["開診與關診", "流程技能", "FLOW-OPEN-CLOSE"]],
  ["備品補充+器械安全庫存", ["備品補充與器械安全庫存", "流程技能", "FLOW-SUPPLY-INVENTORY"]],
  ["基礎衛教", ["基礎衛教", "衛教技能", "EDU-BASIC"]],
  ["進階衛教", ["進階衛教", "衛教技能", "EDU-ADVANCED"]],
  ["掛號處理(含初診處理)開立一般收據及藥單", ["掛號、初診、一般收據與藥單處理", "櫃台技能", "FRONT-REGISTRATION"]],
  ["收費紀錄", ["收費紀錄", "櫃台技能", "FRONT-PAYMENT"]],
  ["病歷整理", ["病歷整理", "櫃台技能", "FRONT-RECORDS"]],
  ["治療同意書填寫", ["治療同意書填寫", "櫃台技能", "FRONT-CONSENT"]],
  ["與患者應對", ["患者應對", "櫃台技能", "FRONT-PATIENT-COMM"]],
  ["約診", ["約診處理", "櫃台技能", "FRONT-APPOINTMENT"]],
  ["報表製作", ["報表製作", "櫃台技能", "FRONT-REPORT"]],
  ["診斷證明書", ["診斷證明書處理", "櫃台技能", "FRONT-CERTIFICATE"]],
  ["牙統VPN", ["牙統 VPN 操作", "櫃台技能", "FRONT-DENTAL-VPN"]],
  ["病歷檢查核對", ["病歷檢查核對", "櫃台技能", "FRONT-RECORD-AUDIT"]],
  ["抽審資料處理", ["抽審資料處理", "櫃台技能", "FRONT-REVIEW-DOCS"]],
  ["CT照", ["CT 影像操作", "共通技術", "COMMON-CT"]],
  ["側頭顱照", ["側頭顱影像操作", "共通技術", "COMMON-CEPH"]],
  ["手持X光機", ["手持 X 光機操作", "共通技術", "COMMON-HANDHELD-XRAY"]],
  ["舒眠手術", ["舒眠手術相關準備", "高風險共通技術", "COMMON-SEDATION-PREP"]],
]);
const ljt = new Map([
  ["器械準備|洗牙", ["洗牙器械準備", "醫師＋治療專屬", "LJT-PREP-SCALING"]],
  ["器械準備|補牙", ["補牙器械準備", "醫師＋治療專屬", "LJT-PREP-FILLING"]],
  ["器械準備|牙周統合", ["牙周統合器械準備", "醫師＋治療專屬", "LJT-PREP-PERIO"]],
  ["器械準備|根管治療", ["一般根管器械準備", "醫師＋治療專屬", "LJT-PREP-RCT"]],
  ["器械準備|拔牙", ["拔牙器械準備", "醫師＋治療專屬", "LJT-PREP-EXTRACTION"]],
  ["器械準備|拆 crown/post", ["拆 crown/post 器械準備", "醫師＋治療專屬", "LJT-PREP-CROWNPOST"]],
  ["自費|固定假牙", ["固定假牙器械準備", "醫師＋治療專屬", "LJT-PREP-CROWN"]],
  ["自費|RPD", ["RPD 器械準備", "醫師＋治療專屬", "LJT-PREP-RPD"]],
  ["自費|噴砂美白", ["噴砂美白器械準備", "醫師＋治療專屬", "LJT-PREP-AIRPOLISH"]],
  ["手術|牙周手術", ["牙周手術相關準備", "高複雜度技術", "LJT-PREP-PERIOSURG"]],
  ["手術|顯微根管", ["顯微根管相關準備", "高複雜度技術", "LJT-PREP-MICROENDO"]],
  ["手術|植 牙", ["植牙相關準備", "高複雜度技術", "LJT-PREP-IMPLANT"]],
]);
const doctorIds = new Map([
  ["李侑津醫師", "LJT"], ["李柄輝醫師", "PENDING-DOC-01"], ["廖立揚醫師", "PENDING-DOC-02"],
  ["楊小瑩醫師", "PENDING-DOC-03"], ["王俊偉醫師", "PENDING-DOC-04"], ["許馨文醫師", "PENDING-DOC-05"],
  ["林晏妤醫師", "PENDING-DOC-06"], ["謝耀慶醫師", "PENDING-DOC-07"], ["陳醫師", "PENDING-DOC-08"],
]);

function suggestion(rec) {
  const { block, category, skill } = rec;
  if (skill === "跟診順暢度") return [`${block}跟診熟悉度`, "跟診熟悉度", `FAM|${doctorIds.get(block) ?? block}`, "路由跟診熟悉度"];
  if (skill === "拍PANO、PA") return ["PANO 與 PA 影像操作", "共通技術", "", "需拆分"];
  if (skill === "健保申報(初診pano)") return ["初診健保申報與 PANO", "共通技能", "", "待確認是否合併"];
  if (existing.has(skill)) return [...existing.get(skill), "已有既有對照"];
  if (block === "李侑津醫師" && ljt.has(`${category}|${skill}`)) return [...ljt.get(`${category}|${skill}`), "已有既有對照"];
  if (newStandards.has(skill)) return [...newStandards.get(skill), "建立新標準"];
  if (doctorIds.has(block)) {
    const normalizedSkill = skill === "植 牙" ? "植牙" : skill;
    return [`${block}－${normalizedSkill}`, "醫師＋治療專屬", "", "待確認是否合併"];
  }
  return [skill, "待主管分類", "", "待確認是否合併"];
}

const records = [...bySource.values()].map((rec, index) => {
  const [name, type, code, action] = suggestion(rec);
  return [
    `MAP-${String(index + 1).padStart(3, "0")}`, rec.block, rec.category || null, rec.skill,
    rec.employees.size, rec.rated.size, [...rec.sourceRows].sort((a, b) => a - b).join(", "),
    name, type, code || null, action, "待核定", null, null, null, null, null, null, null, null, null, null,
  ];
});

const sheet = wb.worksheets.add("技能名稱對照");
sheet.showGridLines = false;
sheet.getRange("A2:V2").merge();
sheet.getRange("A2").values = [["技能標準名稱與來源文字對照"]];
sheet.getRange("A2:V2").format.font = { name: "Arial", size: 14, bold: true, color: "#263238" };
sheet.getRange("A3:V3").format.borders = { bottom: { style: "thin", color: line } };
sheet.getRange("A4:V4").merge();
sheet.getRange("A4").values = [["每個工作區塊、分類與原始技能文字各保留一列。主管核定前不合併；複合影像項目須先拆分。跟診順暢度只路由至跟診熟悉度，不作為能力技能。黃色為主管輸入，藍色為系統計算或來源欄位。"]];
sheet.getRange("A4:V4").format.font = { name: "Arial", size: 10, italic: true, color: "#607D8B" };

const headers = ["對照鍵", "來源工作區塊", "來源分類", "來源技能文字", "納入員工數", "有評等人數", "原表列號", "建議標準名稱", "建議類型", "建議標準代碼", "建議處理", "主管決定", "核定標準名稱", "核定標準代碼", "生效日", "核定人", "備註", "收件檢核", "最終標準名稱", "最終標準代碼", "代碼檢核", "發布狀態"];
const lastRow = 6 + records.length;
sheet.getRange(`A6:V${lastRow}`).values = [headers, ...records];
const table = sheet.tables.add(`A6:V${lastRow}`, true, "SkillNameMapping");
table.style = "TableStyleMedium2";
sheet.getRange("A6:V6").format = { fill: navy, font: { name: "Arial", size: 10, bold: true, color: "#FFFFFF" }, horizontalAlignment: "center", verticalAlignment: "center", wrapText: true };
sheet.getRange(`A7:V${lastRow}`).format.font = { name: "Arial", size: 10, color: "#263238" };
sheet.getRange(`A7:K${lastRow}`).format.fill = paleBlue;
sheet.getRange(`L7:Q${lastRow}`).format.fill = amber;
sheet.getRange(`R7:V${lastRow}`).format.fill = paleBlue;

const formulas = [];
for (let r = 7; r <= lastRow; r++) {
  formulas.push([
    `=IF($A${r}="","",IF($L${r}="待核定","待主管核定",IF($L${r}="停用","停用",IF($L${r}="採用建議",IF($K${r}="需拆分","需完成拆分",IF(OR($H${r}="",$I${r}="",$J${r}="",$O${r}="",$P${r}=""),"待補建議或核定資料","可發布")),IF($L${r}="路由跟診熟悉度",IF(OR($H${r}="",$J${r}="",$O${r}="",$P${r}=""),"待補核定資料","可發布"),IF(OR($L${r}="另訂標準",$L${r}="不合併"),IF(OR($M${r}="",$N${r}="",$O${r}="",$P${r}=""),"待補最終名稱、代碼或核定資料","可發布"),"待主管核定"))))))`,
    `=IF($R${r}<>"可發布","",IF(OR($L${r}="採用建議",$L${r}="路由跟診熟悉度"),$H${r},$M${r}))`,
    `=IF($R${r}<>"可發布","",IF(OR($L${r}="採用建議",$L${r}="路由跟診熟悉度"),$J${r},$N${r}))`,
    `=IF($R${r}<>"可發布","未檢核",IF($T${r}="","缺少代碼",IF(COUNTIFS($T$7:$T$${lastRow},$T${r},$R$7:$R$${lastRow},"可發布",$S$7:$S$${lastRow},"<>"&$S${r})>0,"代碼對應多名稱","一致")))`,
    `=IF($A${r}="","",IF($R${r}<>"可發布",$R${r},IF($U${r}="一致","已發布",$U${r})))`,
  ]);
}
sheet.getRange(`R7:V${lastRow}`).formulas = formulas;
sheet.getRange(`L7:L${lastRow}`).dataValidation = { rule: { type: "list", values: ["待核定", "採用建議", "另訂標準", "不合併", "路由跟診熟悉度", "停用"] } };
sheet.getRange(`O7:O${lastRow}`).format.numberFormat = "yyyy-mm-dd";
sheet.getRange(`R7:R${lastRow}`).conditionalFormats.add("containsText", { text: "可發布", format: { fill: green, font: { color: "#375623", bold: true } } });
sheet.getRange(`R7:R${lastRow}`).conditionalFormats.add("containsText", { text: "需完成拆分", format: { fill: red, font: { color: "#9C0006", bold: true } } });
sheet.getRange(`U7:V${lastRow}`).conditionalFormats.add("containsText", { text: "代碼對應多名稱", format: { fill: red, font: { color: "#9C0006", bold: true } } });
sheet.getRange(`V7:V${lastRow}`).conditionalFormats.add("containsText", { text: "已發布", format: { fill: green, font: { color: "#375623", bold: true } } });

const widths = [14, 18, 16, 34, 12, 12, 18, 32, 20, 24, 20, 20, 32, 24, 14, 16, 30, 28, 32, 24, 22, 22];
for (let i = 0; i < widths.length; i++) sheet.getRange(`${String.fromCharCode(65 + i)}:${String.fromCharCode(65 + i)}`).format.columnWidth = widths[i];
sheet.getRange(`A6:V${lastRow}`).format.wrapText = true;
sheet.freezePanes.freezeRows(6);
sheet.freezePanes.freezeColumns(4);
sheet.tabColor = "#70AD47";

const skillMaster = wb.worksheets.getItem("技能主檔_V1");
skillMaster.getRange("A4").values = [["李侑津醫師試行技能與已確認共通技能先保留；所有來源名稱與跨醫師合併決定記錄於「技能名稱對照」，只有已發布的對照才可增修技能主檔。"]];

const dashboard = wb.worksheets.getItem("主管工作台");
dashboard.getRange("A26:E26").values = [["技能名稱對照", null, "技能名稱對照", "主管決定、標準名稱／代碼、生效日與核定人完整；複合項目已拆分", null]];
dashboard.getRange("B26").formulas = [[`=COUNTIFS('技能名稱對照'!$A$7:$A$${lastRow},"<>",'技能名稱對照'!$V$7:$V$${lastRow},"<>已發布",'技能名稱對照'!$L$7:$L$${lastRow},"<>停用")`]];
dashboard.getRange("E26").formulas = [[`=IF(B26=0,"技能名稱對照已全部發布","仍有 "&B26&" 筆待核定、補件或拆分")`]];
dashboard.getRange("A26:E26").format.font = { name: "Arial", size: 10, color: "#263238" };
dashboard.getRange("A26:E26").format.borders = { bottom: { style: "hair", color: line } };
dashboard.getRange("B26").format = { fill: "#DDEBF7", font: { name: "Arial", size: 10, bold: true, color: "#263238" }, horizontalAlignment: "right", numberFormat: "#,##0" };
dashboard.getRange("E26").format = { fill: amber, font: { name: "Arial", size: 10, bold: true, color: "#7F6000" } };
dashboard.getRange("H13:I13").values = [["完成員工治理、技能名稱、能力、熟悉度、要求、資格及支援者核定", "員工治理核定、技能名稱對照、主管核定中心、支援者資格核定"]];

const overview = wb.worksheets.getItem("續作總覽");
overview.getRange("A29:D29").values = [["技能名稱來源組合", records.length, "流程已建立", "保留原始文字與醫師脈絡；主管核定、複合項目拆分及代碼一致後才發布"]];
overview.getRange("B29").format.numberFormat = "#,##0";

wb.recalculate();
await fs.mkdir(previewDir, { recursive: true });
for (const [name, range] of [["技能名稱對照", "A1:V22"], ["主管工作台", "A20:E26"], ["技能主檔_V1", "A1:K24"]]) {
  const image = await wb.render({ sheetName: name, range, scale: 1.1, format: "png" });
  await fs.writeFile(`${previewDir}/${name}.png`, new Uint8Array(await image.arrayBuffer()));
}
for (const range of [`技能名稱對照!A6:V20`, "主管工作台!A20:E26", "續作總覽!A25:D29"]) {
  console.log((await wb.inspect({ kind: "table", range, include: "values,formulas", tableMaxRows: 20, tableMaxCols: 24, maxChars: 22000 })).ndjson);
}
console.log((await wb.inspect({ kind: "match", searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!|#SPILL!|#CALC!", options: { useRegex: true, maxResults: 500 }, maxChars: 12000 })).ndjson);
const out = await SpreadsheetFile.exportXlsx(wb);
await out.save(path);
console.log(`SAVED ${path} WITH ${records.length} SOURCE COMBINATIONS`);

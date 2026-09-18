import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const path = "../outputs/clinic-assistant-model/assistant_skill_matrix_v1_pilot.xlsx";
const previewDir = "./scheduling-exception-previews";
const navy = "#1F5E78";
const amber = "#FFF2CC";
const paleBlue = "#EAF5FA";
const green = "#E2F0D9";
const red = "#FCE4D6";
const line = "#B7C9D3";

let wb = await SpreadsheetFile.importXlsx(await FileBlob.load(path));
const exceptionSheet = wb.worksheets.add("排班例外核定");
exceptionSheet.showGridLines = false;
exceptionSheet.getRange("A2:U2").merge();
exceptionSheet.getRange("A2").values = [["排班例外核定與安全閘門"]];
exceptionSheet.getRange("A2:U2").format.font = { name: "Arial", size: 14, bold: true, color: "#263238" };
exceptionSheet.getRange("A3:U3").format.borders = { bottom: { style: "thin", color: line } };
exceptionSheet.getRange("A4:U4").merge();
exceptionSheet.getRange("A4").values = [["例外只處理已核定資料尚未回寫，或已另行核定的緊急規則，而且只限單一班次。缺主跟診、缺短時支援、支援容量不足、時段衝突及療程未確認一律不可例外；三週／一週確認流程仍須完成。"]];
exceptionSheet.getRange("A4:U4").format.font = { name: "Arial", size: 10, italic: true, color: "#607D8B" };

const headers = ["例外紀錄鍵", "需求編號", "班次日期", "原班次結果", "原發布狀態", "例外類型", "例外原因", "補償措施", "相關配置編號", "佐證／核定依據", "申請人", "申請日", "有效日期", "主管決定", "核定人", "核定日", "紀錄狀態", "收件檢核", "安全閘門", "生效狀態", "生效需求鍵"];
exceptionSheet.getRange("A6:U106").values = [headers, ...Array.from({ length: 100 }, () => Array(21).fill(null))];
const exceptionTable = exceptionSheet.tables.add("A6:U106", true, "SchedulingExceptions");
exceptionTable.style = "TableStyleMedium2";
exceptionSheet.getRange("A6:U6").format = { fill: navy, font: { name: "Arial", size: 10, bold: true, color: "#FFFFFF" }, horizontalAlignment: "center", verticalAlignment: "center", wrapText: true };
exceptionSheet.getRange("A7:B106").format.fill = amber;
exceptionSheet.getRange("C7:E106").format.fill = paleBlue;
exceptionSheet.getRange("F7:Q106").format.fill = amber;
exceptionSheet.getRange("R7:U106").format.fill = paleBlue;
exceptionSheet.getRange("A7:U106").format.font = { name: "Arial", size: 10, color: "#263238" };

const sourceFormulas = [];
const statusFormulas = [];
for (let r = 7; r <= 106; r++) {
  sourceFormulas.push([
    `=IF($B${r}="","",_xlfn.XLOOKUP($B${r},'班次檢核總覽'!$A$7:$A$36,'班次檢核總覽'!$B$7:$B$36,"需求未建立",0))`,
    `=IF($B${r}="","",_xlfn.XLOOKUP($B${r},'班次檢核總覽'!$A$7:$A$36,'班次檢核總覽'!$Q$7:$Q$36,"需求未建立",0))`,
    `=IF($B${r}="","",_xlfn.XLOOKUP($B${r},'班次檢核總覽'!$A$7:$A$36,'班次檢核總覽'!$U$7:$U$36,"需求未建立",0))`,
  ]);
  statusFormulas.push([
    `=IF($A${r}="","",IF(OR($Q${r}="已撤銷",$Q${r}="已結案"),$Q${r},IF(OR(LEN($B${r})=0,LEN($F${r})=0,LEN($G${r})=0,LEN($H${r})=0,LEN($I${r})=0,LEN($J${r})=0,LEN($K${r})=0,LEN($L${r})=0,LEN($M${r})=0,LEN($N${r})=0,LEN($O${r})=0,LEN($P${r})=0,LEN($Q${r})=0),"待補欄位",IF($N${r}<>"已核定","待主管核定",IF($P${r}<$L${r},"核定日早於申請日",IF($M${r}<>$C${r},"有效日須等於班次日期","資料完整"))))))`,
    `=IF($A${r}="","",IF($R${r}<>"資料完整",$R${r},IF($D${r}="通過","無需例外",IF(OR($D${r}="療程待確認",$D${r}="缺主跟診配置",$D${r}="缺短時支援",$D${r}="支援容量不足",$D${r}="人員時段衝突"),"不可例外："&$D${r},IF($D${r}="正式資格未完成",IF(OR($F${r}="已核定資料待回寫",$F${r}="緊急規則已另行核定"),"可限時核定","不可例外：類型不符"),"不可例外：未定義原因")))))`,
    `=IF($A${r}="","",IF($Q${r}<>"生效",$Q${r},IF($S${r}<>"可限時核定",$S${r},IF($M${r}<TODAY(),"已到期",IF(COUNTIFS($B$7:$B$106,$B${r},$N$7:$N$106,"已核定",$Q$7:$Q$106,"生效",$S$7:$S$106,"可限時核定",$M$7:$M$106,">="&TODAY())>1,"同一需求重複生效","例外有效")))))`,
    `=IF($T${r}="例外有效",$B${r},"")`,
  ]);
}
exceptionSheet.getRange("C7:E106").formulas = sourceFormulas;
exceptionSheet.getRange("R7:U106").formulas = statusFormulas;
exceptionSheet.getRange("F7:F106").dataValidation = { rule: { type: "list", values: ["已核定資料待回寫", "緊急規則已另行核定"] } };
exceptionSheet.getRange("N7:N106").dataValidation = { rule: { type: "list", values: ["待核定", "已核定", "退回補件"] } };
exceptionSheet.getRange("Q7:Q106").dataValidation = { rule: { type: "list", values: ["生效", "已撤銷", "已結案"] } };
for (const col of ["C", "L", "M", "P"]) exceptionSheet.getRange(`${col}7:${col}106`).format.numberFormat = "yyyy-mm-dd";
exceptionSheet.getRange("S7:T106").conditionalFormats.add("containsText", { text: "不可例外", format: { fill: red, font: { color: "#9C0006", bold: true } } });
exceptionSheet.getRange("T7:T106").conditionalFormats.add("containsText", { text: "例外有效", format: { fill: green, font: { color: "#375623", bold: true } } });
exceptionSheet.getRange("R7:R106").conditionalFormats.add("containsText", { text: "待補", format: { fill: amber, font: { color: "#7F6000", bold: true } } });
const widths = [18, 14, 14, 22, 24, 24, 38, 38, 18, 34, 16, 14, 14, 16, 16, 14, 14, 24, 28, 26, 18];
for (let i = 0; i < widths.length; i++) exceptionSheet.getRange(`${String.fromCharCode(65 + i)}:${String.fromCharCode(65 + i)}`).format.columnWidth = widths[i];
exceptionSheet.getRange("A6:U106").format.wrapText = true;
exceptionSheet.freezePanes.freezeRows(6);
exceptionSheet.freezePanes.freezeColumns(2);
exceptionSheet.tabColor = "#C55A11";

wb.recalculate();
let out = await SpreadsheetFile.exportXlsx(wb);
await out.save(path);

wb = await SpreadsheetFile.importXlsx(await FileBlob.load(path));
const checks = wb.worksheets.getItem("班次檢核總覽");
checks.getRange("A4").values = [["每列對應一筆需求。例外只允許已核定資料待回寫或已另行核定的緊急規則；缺人、缺支援、容量不足、時段衝突及療程未確認不可例外。最終發布仍須完成三週／一週確認流程。"]];
checks.getRange("V6:W6").values = [["例外核定狀態", "最終發布判定"]];
checks.getRange("V6:W6").format = { fill: navy, font: { name: "Arial", size: 10, bold: true, color: "#FFFFFF" }, horizontalAlignment: "center", verticalAlignment: "center", wrapText: true };
checks.getRange("V7:W36").format = { fill: paleBlue, font: { name: "Arial", size: 10, color: "#263238" } };
const checkFormulas = [];
for (let r = 7; r <= 36; r++) {
  checkFormulas.push([
    `=IF($A${r}="","",IF(COUNTIFS('排班例外核定'!$U$7:$U$106,$A${r})>0,"例外有效",IF(COUNTIFS('排班例外核定'!$B$7:$B$106,$A${r})>0,"例外申請未生效","無例外")))`,
    `=IF($A${r}="","",IF(OR($U${r}="可發布",$U${r}="人力已釋出",$U${r}="範例，不發布"),$U${r},IF(AND($V${r}="例外有效",$Q${r}="正式資格未完成",$S${r}="確認完成",$R${r}<>"範例"),"例外核定可發布",$U${r})))`,
  ]);
}
checks.getRange("V7:W36").formulas = checkFormulas;
checks.getRange("V:W").format.columnWidth = 24;
checks.getRange("W7:W36").conditionalFormats.add("containsText", { text: "可發布", format: { fill: green, font: { color: "#375623", bold: true } } });

const dashboard = wb.worksheets.getItem("主管工作台");
dashboard.getRange("D7").formulas = [[`=COUNTIFS('班次檢核總覽'!$A$7:$A$36,"<>",'班次檢核總覽'!$R$7:$R$36,"<>範例",'班次檢核總覽'!$W$7:$W$36,"<>可發布",'班次檢核總覽'!$W$7:$W$36,"<>例外核定可發布",'班次檢核總覽'!$W$7:$W$36,"<>人力已釋出")`]];
dashboard.getRange("A28:E28").values = [["排班例外核定", null, "排班例外核定", "安全閘門通過且限單一班次", null]];
dashboard.getRange("B28").formulas = [[`=COUNTIFS('排班例外核定'!$A$7:$A$106,"<>",'排班例外核定'!$T$7:$T$106,"<>例外有效",'排班例外核定'!$Q$7:$Q$106,"<>已撤銷",'排班例外核定'!$Q$7:$Q$106,"<>已結案")`]];
dashboard.getRange("E28").formulas = [[`=IF(B28=0,"無待處理例外","仍有 "&B28&" 筆例外待補或核定")`]];
dashboard.getRange("A28:E28").format.font = { name: "Arial", size: 10, color: "#263238" };
dashboard.getRange("A28:E28").format.borders = { bottom: { style: "hair", color: line } };
dashboard.getRange("B28").format = { fill: "#DDEBF7", font: { name: "Arial", size: 10, bold: true, color: "#263238" }, horizontalAlignment: "right", numberFormat: "#,##0" };
dashboard.getRange("E28").format = { fill: amber, font: { name: "Arial", size: 10, bold: true, color: "#7F6000" } };
dashboard.getRange("H14:I14").values = [["查看班次結果；安全缺口不可例外，資料回寫差異才可送例外核定", "班次檢核總覽、排班例外核定"]];

const consultation = wb.worksheets.getItem("諮詢排班視圖");
consultation.getRange("A4").values = [["顯示療程、人力需求、支援條件、確認進度與最終發布狀態；例外細節仍只由助理主管處理，不顯示個別考核、事件或面談內容。"]];
consultation.getRange("D7").formulas = [[`=COUNTIFS($B$11:$B$40,"正式",$S$11:$S$40,"可發布")+COUNTIFS($B$11:$B$40,"正式",$S$11:$S$40,"例外核定可發布")`]];
const consultStatus = [];
for (let r = 11; r <= 40; r++) {
  consultStatus.push([
    `=IF($A${r}="","",_xlfn.XLOOKUP($A${r},'班次檢核總覽'!$A$7:$A$36,'班次檢核總覽'!$W$7:$W$36,"",0))`,
    `=IF($A${r}="","",IF($B${r}="範例","範例，不需處理",IF(OR($S${r}="可發布",$S${r}="例外核定可發布"),"完成",IF($S${r}="人力已釋出","確認改派或結案",IF($P${r}="待三週前標記","完成三週前療程標記",IF($P${r}="待一週前確認","完成一週前診前確認",IF(OR($P${r}="人力異動待處理",$P${r}="人力釋出待處理"),"通知助理主管處理人力異動","等候助理主管完成人力或資格檢核")))))))`,
  ]);
}
consultation.getRange("S11:T40").formulas = consultStatus;

const overview = wb.worksheets.getItem("續作總覽");
overview.getRange("A31:D31").values = [["排班例外核定", 1, "安全閘門流程已建立", "僅限已核定資料待回寫或另行核定緊急規則；缺人、缺支援、容量與衝突不可例外"]];
overview.getRange("B31").format.numberFormat = "#,##0";
const dictionary = wb.worksheets.getItem("資料字典");
dictionary.getRange("C20").values = [["流程已建立"]];
dictionary.getRange("F20").values = [["正式人力與學習人員分開；班次例外須通過安全閘門、限單一班次並保留核定紀錄"]];

wb.recalculate();
await fs.mkdir(previewDir, { recursive: true });
for (const [name, range] of [["排班例外核定", "A1:U18"], ["班次檢核總覽", "A1:W12"], ["主管工作台", "A20:E28"], ["諮詢排班視圖", "A1:T13"]]) {
  const image = await wb.render({ sheetName: name, range, scale: 1.15, format: "png" });
  await fs.writeFile(`${previewDir}/${name}.png`, new Uint8Array(await image.arrayBuffer()));
}
for (const range of ["排班例外核定!A6:U10", "班次檢核總覽!A6:W10", "主管工作台!A24:E28", "諮詢排班視圖!A6:T13", "續作總覽!A29:D31"]) {
  console.log((await wb.inspect({ kind: "table", range, include: "values,formulas", tableMaxRows: 16, tableMaxCols: 25, maxChars: 22000 })).ndjson);
}
console.log((await wb.inspect({ kind: "match", searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!|#SPILL!|#CALC!", options: { useRegex: true, maxResults: 500 }, maxChars: 12000 })).ndjson);
out = await SpreadsheetFile.exportXlsx(wb);
await out.save(path);
console.log(`SAVED ${path}`);

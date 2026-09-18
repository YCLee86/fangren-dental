import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const path = "../outputs/clinic-assistant-model/assistant_skill_matrix_v1_pilot.xlsx";
const previewDir = "./checklist-workflow-previews";
const wb = await SpreadsheetFile.importXlsx(await FileBlob.load(path));

const navy = "#1F5E78";
const amber = "#FFF2CC";
const paleBlue = "#EAF5FA";
const green = "#E2F0D9";
const red = "#FCE4D6";
const line = "#B7C9D3";

const versions = wb.worksheets.getItem("檢核表版本");
versions.showGridLines = false;
versions.getRange("A2:R2").merge();
versions.getRange("A2").values = [["半年複評檢核表版本"]];
versions.getRange("A2:R2").format.font = { name: "Arial", size: 14, bold: true, color: "#263238" };
versions.getRange("A3:R3").format.borders = { bottom: { style: "thin", color: line } };
versions.getRange("A4:R4").merge();
versions.getRange("A4").values = [["七類檢核表採版本管理。實際操作項目、通過標準與證據方式須由助理主管填寫並核定；沒有已發布版本時，不可作為正式考核依據。"]];
versions.getRange("A4:R4").format.font = { name: "Arial", size: 10, italic: true, color: "#607D8B" };

const versionHeaders = ["檢核表代碼", "適用技能／類別", "版本", "建立日", "主管決定", "項目結構", "啟用項目數", "未完成項目數", "關鍵必要數", "一般必要數", "觀察項目數", "生效日", "核定人", "核定日", "備註", "收件檢核", "發布狀態", "已發布版本鍵"];
const originalRows = [
  ["CHK-STERIL-01", "器械清消流程", "V1 草案", 46282, "待內容確認", "關鍵必要／一般必要／觀察項目"],
  ["CHK-IMAGE-01", "影像操作（分項）", "V1 草案", 46282, "待內容確認", "PA、PANO、CT、側頭顱、手持 X 光機分項"],
  ["CHK-IMPLANT-01", "植牙相關準備", "V1 草案", 46282, "待內容確認", "低頻高風險"],
  ["CHK-PERIOSURG-01", "牙周手術相關準備", "V1 草案", 46282, "待內容確認", "低頻高風險"],
  ["CHK-MICROENDO-01", "顯微根管相關準備", "V1 草案", 46282, "待內容確認", "低頻高風險"],
  ["CHK-SEDATION-01", "舒眠手術相關準備", "V1 草案", 46282, "待內容確認", "低頻高風險"],
  ["CHK-RPD-FINAL-01", "RPD 印最終模", "V1 草案", 46282, "待內容確認", "低頻高風險"],
];
versions.getRange("A6:R13").values = [versionHeaders, ...originalRows.map((r) => [...r, ...Array(12).fill(null)])];
versions.getRange("A6:R6").format = { fill: navy, font: { name: "Arial", size: 10, bold: true, color: "#FFFFFF" }, horizontalAlignment: "center", verticalAlignment: "center", wrapText: true };
versions.getRange("A7:F13").format.fill = amber;
versions.getRange("G7:K13").format.fill = paleBlue;
versions.getRange("L7:O13").format.fill = amber;
versions.getRange("P7:R13").format.fill = paleBlue;
versions.getRange("A7:R13").format.font = { name: "Arial", size: 10, color: "#263238" };
versions.getRange("D7:D13").format.numberFormat = "yyyy-mm-dd";
versions.getRange("L7:L13").format.numberFormat = "yyyy-mm-dd";
versions.getRange("N7:N13").format.numberFormat = "yyyy-mm-dd";
versions.getRange("E7:E13").dataValidation = { rule: { type: "list", values: ["待內容確認", "送審", "已核定", "退回補件", "停用"] } };
const versionFormulas = [];
for (let r = 7; r <= 13; r++) {
  versionFormulas.push([
    `=COUNTIFS('檢核表項目輸入'!$B$7:$B$106,$A${r},'檢核表項目輸入'!$K$7:$K$106,"是")`,
    `=COUNTIFS('檢核表項目輸入'!$B$7:$B$106,$A${r},'檢核表項目輸入'!$K$7:$K$106,"是",'檢核表項目輸入'!$P$7:$P$106,"<>可發布")`,
    `=COUNTIFS('檢核表項目輸入'!$B$7:$B$106,$A${r},'檢核表項目輸入'!$G$7:$G$106,"關鍵必要",'檢核表項目輸入'!$P$7:$P$106,"可發布")`,
    `=COUNTIFS('檢核表項目輸入'!$B$7:$B$106,$A${r},'檢核表項目輸入'!$G$7:$G$106,"一般必要",'檢核表項目輸入'!$P$7:$P$106,"可發布")`,
    `=COUNTIFS('檢核表項目輸入'!$B$7:$B$106,$A${r},'檢核表項目輸入'!$G$7:$G$106,"觀察項目",'檢核表項目輸入'!$P$7:$P$106,"可發布")`,
  ]);
}
versions.getRange("G7:K13").formulas = versionFormulas;
const versionStatusFormulas = [];
for (let r = 7; r <= 13; r++) {
  versionStatusFormulas.push([
    `=IF($A${r}="","",IF($E${r}="停用","停用",IF($E${r}<>"已核定","待主管核定",IF(OR($A${r}="",$B${r}="",$C${r}="",$D${r}="",$L${r}="",$M${r}="",$N${r}=""),"待補版本核定資料",IF($G${r}=0,"尚無檢核項目",IF($H${r}>0,"仍有 "&$H${r}&" 項未完成","可發布"))))))`,
    `=IF($A${r}="","",IF($P${r}="可發布","已發布",$P${r}))`,
    `=IF($Q${r}="已發布",$A${r}&"|"&$C${r},"")`,
  ]);
}
versions.getRange("P7:R13").formulas = versionStatusFormulas;
versions.getRange("P7:P13").conditionalFormats.add("containsText", { text: "可發布", format: { fill: green, font: { color: "#375623", bold: true } } });
versions.getRange("P7:Q13").conditionalFormats.add("containsText", { text: "仍有", format: { fill: red, font: { color: "#9C0006", bold: true } } });
versions.getRange("Q7:Q13").conditionalFormats.add("containsText", { text: "已發布", format: { fill: green, font: { color: "#375623", bold: true } } });
const versionWidths = [22, 24, 14, 14, 18, 34, 12, 14, 12, 12, 12, 14, 16, 14, 30, 24, 22, 28];
for (let i = 0; i < versionWidths.length; i++) versions.getRange(`${String.fromCharCode(65 + i)}:${String.fromCharCode(65 + i)}`).format.columnWidth = versionWidths[i];
versions.getRange("A6:R13").format.wrapText = true;
versions.freezePanes.freezeRows(6);
versions.freezePanes.freezeColumns(2);

const itemSheet = wb.worksheets.add("檢核表項目輸入");
itemSheet.showGridLines = false;
itemSheet.getRange("A2:P2").merge();
itemSheet.getRange("A2").values = [["半年複評操作檢核項目輸入"]];
itemSheet.getRange("A2:P2").format.font = { name: "Arial", size: 14, bold: true, color: "#263238" };
itemSheet.getRange("A3:P3").format.borders = { bottom: { style: "thin", color: line } };
itemSheet.getRange("A4:P4").merge();
itemSheet.getRange("A4").values = [["黃色欄位由主管填寫。系統只預列七類與五項影像分項，不提供臨床步驟；操作項目、通過標準與證據方式完整且核定後，才會計入版本發布。每次修訂請建立新版本與新項目列，不覆寫舊版。"]];
itemSheet.getRange("A4:P4").format.font = { name: "Arial", size: 10, italic: true, color: "#607D8B" };
const itemHeaders = ["項目鍵", "檢核表代碼", "適用技能／類別", "版本", "技能分項", "項次", "項目類型", "操作檢核項目", "通過標準", "證據／紀錄方式", "啟用", "主管決定", "生效日", "核定人", "備註", "收件檢核"];
const skeletons = [
  ["CHK-STERIL-01", "器械清消流程"],
  ["CHK-IMAGE-01", "PA"], ["CHK-IMAGE-01", "PANO"], ["CHK-IMAGE-01", "CT"], ["CHK-IMAGE-01", "側頭顱"], ["CHK-IMAGE-01", "手持 X 光機"],
  ["CHK-IMPLANT-01", "植牙相關準備"], ["CHK-PERIOSURG-01", "牙周手術相關準備"],
  ["CHK-MICROENDO-01", "顯微根管相關準備"], ["CHK-SEDATION-01", "舒眠手術相關準備"], ["CHK-RPD-FINAL-01", "RPD 印最終模"],
];
const itemRows = Array.from({ length: 100 }, (_, i) => {
  if (i >= skeletons.length) return Array(16).fill(null);
  const [code, subitem] = skeletons[i];
  return [`ITEM-${String(i + 1).padStart(3, "0")}`, code, null, null, subitem, 1, null, null, null, null, "是", "待核定", null, null, null, null];
});
itemSheet.getRange("A6:P106").values = [itemHeaders, ...itemRows];
const itemTable = itemSheet.tables.add("A6:P106", true, "ChecklistItems");
itemTable.style = "TableStyleMedium2";
itemSheet.getRange("A6:P6").format = { fill: navy, font: { name: "Arial", size: 10, bold: true, color: "#FFFFFF" }, horizontalAlignment: "center", verticalAlignment: "center", wrapText: true };
itemSheet.getRange("A7:B106").format.fill = amber;
itemSheet.getRange("C7:D106").format.fill = paleBlue;
itemSheet.getRange("E7:O106").format.fill = amber;
itemSheet.getRange("P7:P106").format.fill = paleBlue;
itemSheet.getRange("A7:P106").format.font = { name: "Arial", size: 10, color: "#263238" };
const itemFormulas = [];
for (let r = 7; r <= 106; r++) {
  itemFormulas.push([
    `=IF($B${r}="","",_xlfn.XLOOKUP($B${r},'檢核表版本'!$A$7:$A$13,'檢核表版本'!$B$7:$B$13,"未建立",0))`,
    `=IF($B${r}="","",_xlfn.XLOOKUP($B${r},'檢核表版本'!$A$7:$A$13,'檢核表版本'!$C$7:$C$13,"未建立",0))`,
  ]);
}
itemSheet.getRange("C7:D106").formulas = itemFormulas;
const itemStatusFormulas = [];
for (let r = 7; r <= 106; r++) {
  itemStatusFormulas.push([
    `=IF($A${r}="","",IF($K${r}="否","停用項目",IF(OR($B${r}="",$C${r}="",$C${r}="未建立",$D${r}="",$D${r}="未建立",$E${r}="",$F${r}="",$G${r}="",$H${r}="",$I${r}="",$J${r}="",$L${r}="",$M${r}="",$N${r}=""),"待補欄位或核定",IF($L${r}<>"已核定","待主管核定",IF(COUNTIFS($B$7:$B$106,$B${r},$D$7:$D$106,$D${r},$E$7:$E$106,$E${r},$F$7:$F$106,$F${r},$K$7:$K$106,"是")>1,"項次重複","可發布")))))`,
  ]);
}
itemSheet.getRange("P7:P106").formulas = itemStatusFormulas;
itemSheet.getRange("G7:G106").dataValidation = { rule: { type: "list", values: ["關鍵必要", "一般必要", "觀察項目"] } };
itemSheet.getRange("K7:K106").dataValidation = { rule: { type: "list", values: ["是", "否"] } };
itemSheet.getRange("L7:L106").dataValidation = { rule: { type: "list", values: ["待核定", "已核定", "退回補件"] } };
itemSheet.getRange("M7:M106").format.numberFormat = "yyyy-mm-dd";
itemSheet.getRange("P7:P106").conditionalFormats.add("containsText", { text: "可發布", format: { fill: green, font: { color: "#375623", bold: true } } });
itemSheet.getRange("P7:P106").conditionalFormats.add("containsText", { text: "重複", format: { fill: red, font: { color: "#9C0006", bold: true } } });
const itemWidths = [16, 22, 24, 14, 22, 10, 16, 40, 38, 28, 10, 16, 14, 16, 30, 24];
for (let i = 0; i < itemWidths.length; i++) itemSheet.getRange(`${String.fromCharCode(65 + i)}:${String.fromCharCode(65 + i)}`).format.columnWidth = itemWidths[i];
itemSheet.getRange("A6:P106").format.wrapText = true;
itemSheet.freezePanes.freezeRows(6);
itemSheet.freezePanes.freezeColumns(4);
itemSheet.tabColor = "#F4B183";

const assessments = wb.worksheets.getItem("考核紀錄輸入");
assessments.getRange("R6:U6").values = [["檢核表版本狀態", "考核收件檢核", "正式採用狀態", "主管處理提示"]];
assessments.getRange("R6:U6").format = { fill: navy, font: { name: "Arial", size: 10, bold: true, color: "#FFFFFF" }, horizontalAlignment: "center", verticalAlignment: "center", wrapText: true };
assessments.getRange("R7:U206").format = { fill: paleBlue, font: { name: "Arial", size: 10, color: "#263238" } };
const assessmentFormulas = [];
for (let r = 7; r <= 206; r++) {
  assessmentFormulas.push([
    `=IF($A${r}="","",_xlfn.XLOOKUP($F${r}&"|"&$G${r},'檢核表版本'!$R$7:$R$13,'檢核表版本'!$Q$7:$Q$13,"未發布版本",0))`,
    `=IF($A${r}="","",IF(OR(LEN($B${r})=0,LEN($C${r})=0,LEN($E${r})=0,LEN($F${r})=0,LEN($G${r})=0,LEN($H${r})=0,LEN($I${r})=0,LEN($J${r})=0,LEN($L${r})=0,LEN($M${r})=0,LEN($O${r})=0),"待補欄位",IF($R${r}<>"已發布","檢核表版本未發布",IF(AND($L${r}="通過",OR($I${r}>0,$J${r}>0)),"結果與必要項目矛盾",IF(AND($L${r}="通過",$M${r}<>"Ø"),"通過後建議評等應為 Ø",IF($O${r}<>"已知悉","待助理知悉",IF($P${r}="","待補知悉日",IF(OR($Q${r}="有異議",$Q${r}="複核中"),"異議處理中","可送主管核定"))))))))`,
    `=IF($A${r}="","",IF($S${r}="可送主管核定","可進入主管核定",$S${r}))`,
    `=IF($A${r}="","",IF($R${r}<>"已發布","先發布檢核表版本",IF($S${r}="可送主管核定","送主管核定中心",IF($S${r}="異議處理中","先完成異議複核","補齊或更正考核資料"))))`,
  ]);
}
assessments.getRange("R7:U206").formulas = assessmentFormulas;
assessments.getRange("L7:L206").dataValidation = { rule: { type: "list", values: ["通過", "未通過"] } };
assessments.getRange("M7:M206").dataValidation = { rule: { type: "list", values: ["Ø", "△", "※"] } };
assessments.getRange("O7:O206").dataValidation = { rule: { type: "list", values: ["待知悉", "已知悉"] } };
assessments.getRange("Q7:Q206").dataValidation = { rule: { type: "list", values: ["無異議", "有異議", "複核中", "已結案"] } };
assessments.getRange("B7:B206").format.numberFormat = "yyyy-mm-dd";
assessments.getRange("P7:P206").format.numberFormat = "yyyy-mm-dd";
for (const [col, width] of [["R", 20], ["S", 28], ["T", 24], ["U", 24]]) assessments.getRange(`${col}:${col}`).format.columnWidth = width;
assessments.getRange("S7:T206").conditionalFormats.add("containsText", { text: "可送主管核定", format: { fill: green, font: { color: "#375623", bold: true } } });
assessments.getRange("S7:T206").conditionalFormats.add("containsText", { text: "矛盾", format: { fill: red, font: { color: "#9C0006", bold: true } } });

const dashboard = wb.worksheets.getItem("主管工作台");
dashboard.getRange("A27:E27").values = [["檢核表版本", null, "檢核表版本／檢核表項目輸入", "項目內容與版本核定完整", null]];
dashboard.getRange("B27").formulas = [[`=COUNTIFS('檢核表版本'!$A$7:$A$13,"<>",'檢核表版本'!$Q$7:$Q$13,"<>已發布",'檢核表版本'!$E$7:$E$13,"<>停用")`]];
dashboard.getRange("E27").formulas = [[`=IF(B27=0,"七類檢核表皆已發布","仍有 "&B27&" 類待補內容或核定")`]];
dashboard.getRange("A27:E27").format.font = { name: "Arial", size: 10, color: "#263238" };
dashboard.getRange("A27:E27").format.borders = { bottom: { style: "hair", color: line } };
dashboard.getRange("B27").format = { fill: "#DDEBF7", font: { name: "Arial", size: 10, bold: true, color: "#263238" }, horizontalAlignment: "right", numberFormat: "#,##0" };
dashboard.getRange("E27").format = { fill: amber, font: { name: "Arial", size: 10, bold: true, color: "#7F6000" } };
dashboard.getRange("H15:I15").values = [["確認檢核表版本已發布，再登錄考核、工作觀察及面談", "檢核表版本、檢核表項目輸入、考核紀錄輸入、工作觀察輸入、面談與異議"]];

const overview = wb.worksheets.getItem("續作總覽");
overview.getRange("A30:D30").values = [["半年複評檢核表", 7, "版本與項目流程已建立", "七類骨架、五項影像分項、主管核定與正式考核版本閘門已接入"]];
overview.getRange("B30").format.numberFormat = "#,##0";
const dictionary = wb.worksheets.getItem("資料字典");
dictionary.getRange("C15").values = [["流程已建立"]];
dictionary.getRange("F15").values = [["版本與操作項目須發布後才能供正式考核引用；保留關鍵必要、一般必要、觀察項目"]];
dictionary.getRange("F:F").format.columnWidth = 56;

const rechecks = wb.worksheets.getItem("複評待辦");
rechecks.getRange("I7:I206").format.numberFormat = "0";

wb.recalculate();
await fs.mkdir(previewDir, { recursive: true });
for (const [name, range] of [["檢核表版本", "A1:R13"], ["檢核表項目輸入", "A1:P18"], ["考核紀錄輸入", "A1:U12"], ["主管工作台", "A20:E27"]]) {
  const image = await wb.render({ sheetName: name, range, scale: 1.1, format: "png" });
  await fs.writeFile(`${previewDir}/${name}.png`, new Uint8Array(await image.arrayBuffer()));
}
for (const range of ["檢核表版本!A6:R13", "檢核表項目輸入!A6:P18", "考核紀錄輸入!A6:U10", "主管工作台!A24:E27", "續作總覽!A28:D30"]) {
  console.log((await wb.inspect({ kind: "table", range, include: "values,formulas", tableMaxRows: 20, tableMaxCols: 24, maxChars: 22000 })).ndjson);
}
console.log((await wb.inspect({ kind: "match", searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!|#SPILL!|#CALC!", options: { useRegex: true, maxResults: 500 }, maxChars: 12000 })).ndjson);
const out = await SpreadsheetFile.exportXlsx(wb);
await out.save(path);
console.log(`SAVED ${path}`);

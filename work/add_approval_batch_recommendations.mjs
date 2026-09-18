import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const path = "../outputs/clinic-assistant-model/assistant_skill_matrix_v1_pilot.xlsx";
const previewDir = "./approval-batch-recommendation-previews";
const navy = "#1F5E78";
const amber = "#FFF2CC";
const paleBlue = "#EAF5FA";
const green = "#E2F0D9";
const red = "#FCE4D6";
const line = "#B7C9D3";

const wb = await SpreadsheetFile.importXlsx(await FileBlob.load(path));
const batch = wb.worksheets.getItem("主管核定批次");

for (const range of ["A2:N2", "A4:N4"]) batch.getRange(range).unmerge();
batch.getRange("A2:P2").merge();
batch.getRange("A4:P4").merge();
batch.getRange("A3:P3").format.borders = { bottom: { style: "thin", color: line } };
batch.getRange("A4").values = [["先依建議單批量拆分工作，再到原核定表逐筆處理。建議值只用於規劃，不代填負責人、期限或主管決定；每批必須寫明範圍，且系統待辦歸零才代表工作流完成。"]];

batch.getRange("O6:P6").merge();
batch.getRange("O7:P7").merge();
batch.getRange("O6").values = [["目前建議批次"]];
batch.getRange("O7").formulas = [[`=SUM($J$11:$J$18)`]];
batch.getRange("O6:P6").format = { fill: navy, font: { name: "Arial", size: 10, bold: true, color: "#FFFFFF" }, horizontalAlignment: "center", verticalAlignment: "center" };
batch.getRange("O7:P7").format = { fill: "#DDEBF7", font: { name: "Arial", size: 12, bold: true, color: "#263238" }, horizontalAlignment: "center", verticalAlignment: "center" };

batch.getRange("H10:N10").unmerge();
for (let r = 11; r <= 18; r++) batch.getRange(`H${r}:N${r}`).unmerge();
batch.getRange("A10:N10").values = [["工作流代碼", "優先序", "核定工作流", "系統待辦", "有效批次數", "主要操作位置", "安排狀態", "下一步", "建議單批量", "建議批數", "建議啟動順序", "建議依據", "有效規劃量", "未規劃量"]];

const suggestedSizes = [5, 10, 25, 30, 1, 7, 25, 5];
const rationales = [
  "安全停排案件優先，小批逐筆確認恢復條件",
  "先以十項驗證考核與資格流程，再延續後續批次",
  "支援資格需核對類型與生效資料，建議每批二十五項",
  "工作量最大，建議每批三十項並固定抽查範圍",
  "七類檢核表各自核定，建議每一類獨立一批",
  "依員工小組分批，建議每批七人",
  "名稱對照可批量覆核；複合項目仍須逐項拆分",
  "有候選時採小批處理，保留觀察與面談證據",
];

for (let i = 0; i < 8; i++) {
  const r = 11 + i;
  batch.getRange(`I${r}`).values = [[suggestedSizes[i]]];
  batch.getRange(`J${r}`).formulas = [[`=IF($D${r}=0,0,ROUNDUP($D${r}/$I${r},0))`]];
  batch.getRange(`K${r}`).formulas = [[`=IF($D${r}=0,"不需啟動",IF($N${r}=0,"已完整規劃","第 "&$B${r}&" 順序"))`]];
  batch.getRange(`L${r}`).values = [[rationales[i]]];
  batch.getRange(`M${r}`).formulas = [[`=SUMIFS($D$23:$D$82,$B$23:$B$82,$A${r},$G$23:$G$82,"未開始",$M$23:$M$82,"批次有效")+SUMIFS($D$23:$D$82,$B$23:$B$82,$A${r},$G$23:$G$82,"執行中",$M$23:$M$82,"批次有效")`]];
  batch.getRange(`N${r}`).formulas = [[`=IF($D${r}=0,0,MAX(0,$D${r}-$M${r}))`]];
  batch.getRange(`E${r}`).formulas = [[`=COUNTIFS($B$23:$B$82,$A${r},$G$23:$G$82,"未開始",$M$23:$M$82,"批次有效")+COUNTIFS($B$23:$B$82,$A${r},$G$23:$G$82,"執行中",$M$23:$M$82,"批次有效")`]];
  batch.getRange(`G${r}`).formulas = [[`=IF($D${r}=0,"系統已完成",IF($N${r}=0,"規劃已涵蓋",IF($M${r}>0,"部分已規劃","未安排")))`]];
  batch.getRange(`H${r}`).formulas = [[`=IF($D${r}=0,"保存既有核定紀錄",IF($N${r}=0,"依批次負責人與期限執行原核定表",IF($M${r}=0,"建立第一筆核定批次","續建批次，補足 "&$N${r}&" 項未規劃量")))`]];
}

batch.getRange("A7").formulas = [[`=COUNTIFS($N$11:$N$18,">0")`]];
batch.getRange("C7").formulas = [[`=IF($N$11>0,$C$11,IF($N$12>0,$C$12,IF($N$13>0,$C$13,IF($N$14>0,$C$14,IF($N$15>0,$C$15,IF($N$16>0,$C$16,IF($N$17>0,$C$17,IF($N$18>0,$C$18,IF($I$7>0,"持續完成執行中批次","目前無未規劃流程")))))))))`]];
batch.getRange("G7").formulas = [[`=COUNTIFS($E$11:$E$18,">0")`]];
batch.getRange("I7").formulas = [[`=COUNTIFS($G$23:$G$82,"執行中",$M$23:$M$82,"批次有效")`]];
batch.getRange("A6").values = [["尚未涵蓋流程"]];

batch.getRange("A11:N18").format = { font: { name: "Arial", size: 10, color: "#263238" }, wrapText: true, verticalAlignment: "center" };
batch.getRange("A11:C18").format.fill = "#F7FBFD";
batch.getRange("D11:E18").format = { fill: paleBlue, font: { name: "Arial", size: 10, bold: true, color: "#263238" }, horizontalAlignment: "right", numberFormat: "#,##0" };
batch.getRange("F11:F18").format.fill = "#F7FBFD";
batch.getRange("G11:G18").format.fill = amber;
batch.getRange("H11:H18").format.fill = "#FFFFFF";
batch.getRange("I11:I18").format = { fill: amber, font: { name: "Arial", size: 10, bold: true, color: "#263238" }, horizontalAlignment: "right", numberFormat: "#,##0" };
batch.getRange("J11:K18").format.fill = paleBlue;
batch.getRange("J11:J18").format.numberFormat = "#,##0";
batch.getRange("L11:L18").format.fill = "#FFFFFF";
batch.getRange("M11:N18").format = { fill: paleBlue, font: { name: "Arial", size: 10, bold: true, color: "#263238" }, horizontalAlignment: "right", numberFormat: "#,##0" };
batch.getRange("G11:G18").conditionalFormats.add("containsText", { text: "規劃已涵蓋", format: { fill: green, font: { color: "#375623", bold: true } } });
batch.getRange("G11:G18").conditionalFormats.add("containsText", { text: "部分已規劃", format: { fill: amber, font: { color: "#7F6000", bold: true } } });

batch.getRange("A19:N19").merge();
batch.getRange("A19").values = [["建議單批量可由主管調整。建議批數依目前工作流待辦計算；不同工作流可能對應同一人。有效規劃量只計入資料完整且未開始或執行中的批次，各批範圍不得重疊。"]];
batch.getRange("A19:N19").format = { font: { name: "Arial", size: 10, italic: true, color: "#607D8B" }, wrapText: true };

batch.getRange("A21:N21").unmerge();
batch.getRange("A21:P21").merge();
batch.getRange("A21:P21").format = { fill: "#D9EAF2", font: { name: "Arial", size: 10, bold: true, color: "#263238" } };
batch.getRange("A22:P22").values = [["批次編號", "工作流代碼", "核定工作流", "預計處理量", "批次負責人", "預計完成日", "批次狀態", "完成日", "實際完成量", "複核人", "批次範圍／項目", "建立時待辦", "批次檢核", "下一步", "批量提示", "備註"]];
batch.getRange("A22:P22").format = { fill: navy, font: { name: "Arial", size: 10, bold: true, color: "#FFFFFF" }, horizontalAlignment: "center", verticalAlignment: "center", wrapText: true };
batch.getRange("A23:P82").format = { font: { name: "Arial", size: 10, color: "#263238" }, wrapText: true, verticalAlignment: "center" };
batch.getRange("A23:B82").format.fill = amber;
batch.getRange("C23:C82").format.fill = paleBlue;
batch.getRange("D23:L82").format.fill = amber;
batch.getRange("M23:O82").format.fill = paleBlue;
batch.getRange("P23:P82").format.fill = amber;
batch.getRange("B23:B82").dataValidation = { rule: { type: "list", formula1: "'主管核定批次'!$A$11:$A$18" } };
batch.getRange("G23:G82").dataValidation = { rule: { type: "list", values: ["未開始", "執行中", "已完成", "取消"] } };
batch.getRange("F23:F82").format.numberFormat = "yyyy-mm-dd";
batch.getRange("H23:H82").format.numberFormat = "yyyy-mm-dd";
for (const column of ["D", "I", "L"]) batch.getRange(`${column}23:${column}82`).format.numberFormat = "#,##0";

for (let r = 23; r <= 82; r++) {
  batch.getRange(`C${r}`).formulas = [[`=IF($B${r}="","",_xlfn.XLOOKUP($B${r},$A$11:$A$18,$C$11:$C$18,"工作流未建立",0))`]];
  batch.getRange(`M${r}`).formulas = [[`=IF($A${r}="","",IF(COUNTIFS($A$23:$A$82,$A${r})>1,"批次編號重複",IF(OR($B${r}="",$D${r}="",$E${r}="",$F${r}="",$G${r}="",$K${r}="",$L${r}=""),"待補批次資料",IF($D${r}<=0,"處理量需大於 0",IF($D${r}>$L${r},"處理量超過建立時待辦",IF($G${r}="已完成",IF(OR($H${r}="",$I${r}="",$J${r}=""),"待補完成證據","批次有效"),IF(OR($H${r}<>"",$I${r}<>"",$J${r}<>""),"完成證據與狀態不一致","批次有效")))))))`]];
  batch.getRange(`N${r}`).formulas = [[`=IF($A${r}="","",IF($M${r}="批次有效",IF($G${r}="已完成","回到工作流摘要確認剩餘待辦","依期限到原核定表逐筆處理"),IF($M${r}="批次編號重複","更換批次編號",IF($M${r}="待補完成證據","補填完成日、實際完成量與複核人","依批次檢核補齊或修正資料"))))`]];
  batch.getRange(`O${r}`).formulas = [[`=IF($A${r}="","",IF($M${r}<>"批次有效","先完成批次檢核",IF($D${r}>_xlfn.XLOOKUP($B${r},$A$11:$A$18,$I$11:$I$18,0,0),"高於建議單批量","在建議單批量內")))`]];
}
batch.getRange("M23:M82").conditionalFormats.add("containsText", { text: "批次有效", format: { fill: green, font: { color: "#375623", bold: true } } });
batch.getRange("M23:M82").conditionalFormats.add("containsText", { text: "重複", format: { fill: red, font: { color: "#9C0006", bold: true } } });
batch.getRange("M23:M82").conditionalFormats.add("containsText", { text: "不一致", format: { fill: red, font: { color: "#9C0006", bold: true } } });
batch.getRange("O23:O82").conditionalFormats.add("containsText", { text: "高於", format: { fill: amber, font: { color: "#7F6000", bold: true } } });

const widths = [16, 16, 34, 14, 18, 18, 18, 14, 14, 16, 34, 16, 24, 34, 22, 30];
for (let i = 0; i < widths.length; i++) batch.getRange(`${String.fromCharCode(65 + i)}:${String.fromCharCode(65 + i)}`).format.columnWidth = widths[i];
batch.getRange("P:P").format.columnWidth = 30;

const dashboard = wb.worksheets.getItem("主管工作台");
dashboard.getRange("A32:E32").values = [["主管核定批次", null, "主管核定批次", "每個有待辦工作流的有效規劃量涵蓋全部待辦", null]];
dashboard.getRange("B32").formulas = [[`='主管核定批次'!$A$7`]];
dashboard.getRange("E32").formulas = [[`=IF(B32=0,"核定工作流皆已完整規劃或完成","仍有 "&B32&" 個核定工作流尚未完整規劃")`]];

const guide = wb.worksheets.getItem("主管操作導引");
guide.getRange("G14").values = [["依建議單批量拆分，寫明各批範圍，再填實際負責人與期限並逐筆核定"]];
guide.getRange("H14").values = [["有效批次規劃量涵蓋全部待辦，且必要核定紀錄可生效"]];

const overview = wb.worksheets.getItem("續作總覽");
overview.getRange("A39:D39").values = [["主管批次建議", null, "批量與涵蓋檢核已建立", "依風險與覆核負荷提供可調整單批量；有效規劃量未涵蓋全部待辦時，工作流仍保持未完成"]];
overview.getRange("B39").formulas = [[`='主管核定批次'!$O$7`]];
overview.getRange("B39").format.numberFormat = "#,##0";

wb.recalculate();
await fs.mkdir(previewDir, { recursive: true });
for (const [sheetName, range] of [
  ["主管核定批次", "A1:P45"],
  ["主管工作台", "A19:M33"],
  ["主管操作導引", "A11:K22"],
]) {
  const image = await wb.render({ sheetName, range, scale: 1.05, format: "png" });
  await fs.writeFile(`${previewDir}/${sheetName}.png`, new Uint8Array(await image.arrayBuffer()));
}

for (const range of ["主管核定批次!A1:P30", "主管工作台!A28:E33", "主管操作導引!A11:K16", "續作總覽!A36:D39"]) {
  console.log((await wb.inspect({ kind: "table", range, include: "values,formulas", tableMaxRows: 35, tableMaxCols: 18, maxChars: 30000 })).ndjson);
}
console.log((await wb.inspect({ kind: "match", searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!|#SPILL!|#CALC!", options: { useRegex: true, maxResults: 500 }, maxChars: 12000 })).ndjson);

const out = await SpreadsheetFile.exportXlsx(wb);
await out.save(path);
console.log(`SAVED ${path}`);

import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const path = "../outputs/clinic-assistant-model/assistant_skill_matrix_v1_pilot.xlsx";
const previewDir = "./formal-shift-entry-previews";
const navy = "#1F5E78";
const paleBlue = "#EAF5FA";
const amber = "#FFF2CC";
const red = "#FCE4D6";
const green = "#E2F0D9";
const line = "#B7C9D3";

const wb = await SpreadsheetFile.importXlsx(await FileBlob.load(path));
const demand = wb.worksheets.getItem("班次需求輸入");

demand.getRange("A4").values = [["黃色欄位由諮詢組或助理主管填寫。第 7–9 列是範例；第 10–36 列是正式班次空白範本。請逐列填寫，不要另建第二份班表。正式需求須完成基本建檔、三週標記、一週確認及必要的人力重檢。"]];
demand.getRange("Y2:AF2").merge();
demand.getRange("Y2").values = [["正式班次建檔檢核"]];
demand.getRange("Y2:AF2").format.font = { name: "Arial", size: 14, bold: true, color: "#263238" };
demand.getRange("Y3:AF3").format.borders = { bottom: { style: "thin", color: line } };
demand.getRange("Y4:AF4").merge();
demand.getRange("Y4").values = [["藍色欄位由系統檢查需求編號、必填內容、日期時間、醫師模式與人力參數。正式班次只有顯示「可進入排班」後，才會進入人力配置與正式試排流程。"]];
demand.getRange("Y4:AF4").format.font = { name: "Arial", size: 10, italic: true, color: "#607D8B" };

const headers = ["編號檢核", "必填檢核", "日期時間檢核", "醫師模式檢核", "人力參數檢核", "基本建檔狀態", "正式流程狀態", "下一步"];
demand.getRange("Y6:AF36").values = [headers, ...Array.from({ length: 30 }, () => Array(8).fill(null))];
const validationTable = demand.tables.items.find((table) => table.name === "FormalShiftEntryValidation") ?? demand.tables.add("Y6:AF36", true, "FormalShiftEntryValidation");
validationTable.style = "TableStyleMedium2";
validationTable.showBandedRows = true;
demand.getRange("Y6:AF6").format = { fill: navy, font: { name: "Arial", size: 10, bold: true, color: "#FFFFFF" }, horizontalAlignment: "center", verticalAlignment: "center", wrapText: true };
demand.getRange("Y7:AF36").format = { fill: paleBlue, font: { name: "Arial", size: 10, color: "#263238" }, verticalAlignment: "center", wrapText: true };

const validationFormulas = [];
for (let r = 7; r <= 36; r++) {
  validationFormulas.push([
    `=IF($A${r}="","",IF(COUNTIFS($A$7:$A$36,$A${r})=1,"通過","編號重複"))`,
    `=IF($A${r}="","",IF(OR($B${r}="",$C${r}="",$D${r}="",$E${r}="",$F${r}="",$G${r}="",$H${r}="",$K${r}=""),"缺少必填","通過"))`,
    `=IF($A${r}="","",IF(OR(NOT(ISNUMBER($B${r})),NOT(ISNUMBER($C${r})),NOT(ISNUMBER($D${r}))),"日期或時間格式不正確",IF($D${r}<=$C${r},"結束時間須晚於開始","通過")))`,
    `=IF($A${r}="","",IF(COUNTIFS('李醫師治療模式'!$A$7:$A$19,$F${r},'李醫師治療模式'!$B$7:$B$19,$E${r})=1,"通過",IF(COUNTIFS('醫師模式規則輸入'!$D$7:$D$14,$F${r},'醫師模式規則輸入'!$B$7:$B$14,$E${r},'醫師模式規則輸入'!$Q$7:$Q$14,"可發布")=1,"通過","醫師或模式未發布")))`,
    `=IF($A${r}="","",IF(OR(NOT(ISNUMBER($H${r})),$H${r}<1,AND($I${r}<>"",OR(NOT(ISNUMBER($I${r})),$I${r}<0)),AND($J${r}<>"",OR(NOT(ISNUMBER($J${r})),$J${r}<=0))),"人力參數不正確",IF(AND($I${r}>0,$J${r}=""),"缺少支援分鐘","通過")))`,
    `=IF($A${r}="","",IF($K${r}="範例","範例",IF($K${r}="取消","已取消",IF($K${r}="草稿","草稿待完成",IF($K${r}<>"正式","資料狀態待選擇",IF(COUNTIFS($Y${r}:$AC${r},"通過")=5,"可進入排班","正式建檔未完成"))))))`,
    `=IF($A${r}="","",IF($K${r}<>"正式","不適用",IF($AD${r}<>"可進入排班","基本資料未完成",IF($X${r}="確認完成","確認完成",$X${r}))))`,
    `=IF($A${r}="","",IF($AD${r}="範例","範例不需發布",IF($AD${r}="已取消","已取消",IF($AD${r}="草稿待完成","完成基本欄位並改為正式",IF($AD${r}="資料狀態待選擇","選擇資料狀態",IF($AD${r}="正式建檔未完成","依左側未通過檢核修正",IF($X${r}<>"確認完成","依三週／一週確認欄位繼續處理","可進入正式試排驗收")))))))`,
  ]);
}
demand.getRange("Y7:AF36").formulas = validationFormulas;
demand.getRange("Y7:AF36").conditionalFormats.add("containsText", { text: "未完成", format: { fill: red, font: { color: "#9C0006", bold: true } } });
demand.getRange("Y7:AF36").conditionalFormats.add("containsText", { text: "重複", format: { fill: red, font: { color: "#9C0006", bold: true } } });
demand.getRange("Y7:AF36").conditionalFormats.add("containsText", { text: "不正確", format: { fill: red, font: { color: "#9C0006", bold: true } } });
demand.getRange("Y7:AF36").conditionalFormats.add("containsText", { text: "缺少", format: { fill: amber, font: { color: "#7F6000", bold: true } } });
demand.getRange("AD7:AD36").conditionalFormats.add("containsText", { text: "可進入排班", format: { fill: green, font: { color: "#375623", bold: true } } });
demand.getRange("AE7:AE36").conditionalFormats.add("containsText", { text: "確認完成", format: { fill: green, font: { color: "#375623", bold: true } } });

const widths = { Y: 16, Z: 16, AA: 22, AB: 22, AC: 20, AD: 20, AE: 20, AF: 40 };
for (const [column, width] of Object.entries(widths)) demand.getRange(`${column}:${column}`).format.columnWidth = width;

const check = wb.worksheets.getItem("班次檢核總覽");
const ids = [];
const safety = [];
const helperStatus = [];
for (let r = 7; r <= 36; r++) {
  ids.push([`=IF('班次需求輸入'!$A${r}="","",'班次需求輸入'!$A${r})`]);
  helperStatus.push([
    `=IF($A${r}="","",_xlfn.XLOOKUP($A${r},'班次需求輸入'!$A$7:$A$36,'班次需求輸入'!$AD$7:$AD$36,"正式建檔未完成",0))`,
    `=IF($A${r}="","",IF($G${r}="待確認","療程待確認",IF($I${r}<$H${r},"缺主跟診配置",IF($K${r}<$H${r},"正式資格未完成",IF($O${r}<$N${r},"缺短時支援",IF($M${r}<$L${r},"支援容量不足",IF($P${r}>0,"人員時段衝突","通過")))))))`,
  ]);
  safety.push([`=IF($A${r}="","",IF($X${r}="已取消","已取消",IF(OR($X${r}="範例",$X${r}="可進入排班"),$Y${r},"班次建檔未完成")))`]);
}
check.getRange("A7:A36").formulas = ids;
check.getRange("X6:Y36").values = [["基本建檔狀態", "人力安全結果"], ...Array.from({ length: 30 }, () => Array(2).fill(null))];
check.getRange("X7:Y36").formulas = helperStatus;
check.getRange("X6:Y6").format = { fill: navy, font: { name: "Arial", size: 10, bold: true, color: "#FFFFFF" }, horizontalAlignment: "center", verticalAlignment: "center", wrapText: true };
check.getRange("X7:Y36").format = { fill: paleBlue, font: { name: "Arial", size: 10, color: "#263238" }, verticalAlignment: "center", wrapText: true };
check.getRange("X:X").format.columnWidth = 20;
check.getRange("Y:Y").format.columnWidth = 22;
check.getRange("Q7:Q36").formulas = safety;
check.getRange("Q7:Q36").conditionalFormats.add("containsText", { text: "建檔", format: { fill: red, font: { color: "#9C0006", bold: true } } });

const dashboard = wb.worksheets.getItem("主管工作台");
dashboard.getRange("D7").formulas = [[`=COUNTIFS('班次需求輸入'!$A$7:$A$36,"<>",'班次需求輸入'!$K$7:$K$36,"<>範例",'班次檢核總覽'!$W$7:$W$36,"<>可發布",'班次檢核總覽'!$W$7:$W$36,"<>例外核定可發布",'班次檢核總覽'!$W$7:$W$36,"<>人力已釋出")`]];
dashboard.getRange("A33:E33").values = [["正式班次建檔", null, "班次需求輸入", "編號、必填、日期時間、醫師模式與人力參數均通過", null]];
dashboard.getRange("B33").formulas = [[`=COUNTIFS('班次需求輸入'!$A$7:$A$36,"<>",'班次需求輸入'!$K$7:$K$36,"正式",'班次需求輸入'!$AD$7:$AD$36,"<>可進入排班")`]];
dashboard.getRange("E33").formulas = [[`=IF(B33=0,"正式班次基本資料均可進入排班","仍有 "&B33&" 筆正式班次建檔未完成")`]];
dashboard.getRange("A33:E33").format.font = { name: "Arial", size: 10, color: "#263238" };
dashboard.getRange("A33:E33").format.borders = { bottom: { style: "hair", color: line } };
dashboard.getRange("B33").format = { fill: "#DDEBF7", font: { name: "Arial", size: 10, bold: true, color: "#263238" }, horizontalAlignment: "right", numberFormat: "#,##0" };
dashboard.getRange("E33").format = { fill: amber, font: { name: "Arial", size: 10, bold: true, color: "#7F6000" } };
dashboard.getRange("I20").formulas = [[`=IF($D$7>0,"先處理班次安全異常",IF($B$28>0,"處理排班例外申請",IF($M$7>0,"處理資格暫停或逾期",IF($G$7>0,"安排近期半年複評",IF('正式資料收件'!$G$7>0,"先收齊診所正式資料",IF($B$32>0,"安排主管核定批次",IF($A$7>0,"完成初始資料與資格核定",IF($B$27>0,"補齊七類檢核表內容與版本",IF($J$7>0,"處理能力升級候選",IF(SUM($B$20:$B$22)>0,"完成正式規則建檔與核定",IF($B$31>0,"完成正式試排驗收",IF($B$29>0,"完成上線準備閘門","今日無高優先待辦"))))))))))))`]];
dashboard.getRange("I21").formulas = [[`=IF($D$7>0,"班次需求輸入／班次檢核總覽／排班配置輸入",IF($B$28>0,"排班例外核定",IF($M$7>0,"資格恢復處理／資格有效性",IF($G$7>0,"複評待辦／考核紀錄輸入",IF('正式資料收件'!$G$7>0,"正式資料收件",IF($B$32>0,"主管核定批次",IF($A$7>0,"主管核定中心／支援者資格核定",IF($B$27>0,"檢核表版本／檢核表項目輸入",IF($J$7>0,"能力升級候選",IF(SUM($B$20:$B$22)>0,"正式資料收件／正式規則輸入",IF($B$31>0,"正式試排驗收",IF($B$29>0,"上線準備","主管工作台"))))))))))))`]];
dashboard.getRange("I22").formulas = [[`=IF($D$7>0,"正式班次基本建檔完成，且最終發布判定為可發布、例外核定可發布或人力已釋出",IF($B$28>0,"安全閘門通過且例外有效，或完成退回／撤銷",IF($M$7>0,"完成補訓、複評與主管核定後恢復資格",IF($G$7>0,"完成複評，或安排符合規則的補考日",IF('正式資料收件'!$G$7>0,"外部資料包已提供，且收件日與收件人完整",IF($B$32>0,"每個有待辦工作流至少建立一筆未開始或執行中批次",IF($A$7>0,"主管決定、生效日與核定人完整",IF($B$27>0,"檢核項目與版本均核定發布",IF($J$7>0,"證據完整且主管核定升級",IF(SUM($B$20:$B$22)>0,"正式內容完整且狀態為已核定",IF($B$31>0,"十二項系統條件與主管簽核皆完成",IF($B$29>0,"所有系統閘門與人工確認完成","維持每日巡檢"))))))))))))`]];

const guide = wb.worksheets.getItem("主管操作導引");
guide.getRange("E15").values = [["正式資料收件、醫師模式規則輸入、流動層級規則輸入、職級矩陣規則輸入、檢核表項目輸入"]];
guide.getRange("G15").values = [["先登記收件，再逐列填入正式條件、來源文件與來源定位並核定"]];
guide.getRange("H15").values = [["外部資料均已收件，且正式內容、來源依據與核定資料完整"]];
guide.getRange("E16").values = [["班次需求輸入、排班配置輸入、班次檢核總覽"]];
guide.getRange("G16").values = [["先完成正式班次基本建檔，再配置主跟診與支援者；排除資格、容量與時間衝突"]];
guide.getRange("H16").values = [["基本建檔狀態可進入排班，且最終發布判定可發布；正式試排另完成驗收簽核"]];

const overview = wb.worksheets.getItem("續作總覽");
overview.getRange("A38:D38").values = [["正式班次建檔", 27, "空白範本與逐列檢核已建立", "第 10–36 列可直接輸入正式班次；編號、必填、日期時間、醫師模式與人力參數未通過時，不進入安全放行"]];
overview.getRange("B38").format.numberFormat = "#,##0";

wb.recalculate();
await fs.mkdir(previewDir, { recursive: true });
for (const [sheetName, range] of [
  ["班次需求輸入", "A1:AF14"],
  ["班次檢核總覽", "A1:Y14"],
  ["主管工作台", "A19:M33"],
  ["主管操作導引", "A11:K22"],
]) {
  const image = await wb.render({ sheetName, range, scale: 1.05, format: "png" });
  await fs.writeFile(`${previewDir}/${sheetName}.png`, new Uint8Array(await image.arrayBuffer()));
}

for (const range of ["班次需求輸入!A6:AF12", "班次檢核總覽!A6:Y12", "主管工作台!A28:E33", "主管操作導引!A11:K16", "續作總覽!A35:D38"]) {
  console.log((await wb.inspect({ kind: "table", range, include: "values,formulas", tableMaxRows: 16, tableMaxCols: 34, maxChars: 24000 })).ndjson);
}
console.log((await wb.inspect({ kind: "match", searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!|#SPILL!|#CALC!", options: { useRegex: true, maxResults: 500 }, maxChars: 12000 })).ndjson);

const out = await SpreadsheetFile.exportXlsx(wb);
await out.save(path);
console.log(`SAVED ${path}`);

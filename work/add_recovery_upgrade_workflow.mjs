import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const path = "../outputs/clinic-assistant-model/assistant_skill_matrix_v1_pilot.xlsx";
const previewDir = "./recovery-upgrade-previews";
const wb = await SpreadsheetFile.importXlsx(await FileBlob.load(path));

const navy = "#1F5E78";
const amber = "#FFF2CC";
const paleBlue = "#EAF5FA";
const green = "#E2F0D9";
const red = "#FCE4D6";
const line = "#B7C9D3";

function col(n) {
  let s = "";
  while (n > 0) {
    n--;
    s = String.fromCharCode(65 + (n % 26)) + s;
    n = Math.floor(n / 26);
  }
  return s;
}

function addSheet(name, title, note, headers, rows, tableName, widths) {
  const sheet = wb.worksheets.add(name);
  const last = col(headers.length);
  sheet.showGridLines = false;
  sheet.getRange("A2").values = [[title]];
  sheet.getRange(`A2:${last}2`).format.font = { name: "Arial", size: 14, bold: true, color: "#263238" };
  sheet.getRange(`A3:${last}3`).format.borders = { bottom: { style: "thin", color: line } };
  sheet.getRange("A4").values = [[note]];
  sheet.getRange(`A4:${last}4`).format.font = { name: "Arial", size: 10, italic: true, color: "#607D8B" };
  sheet.getRange(`A6:${last}${6 + rows.length}`).values = [headers, ...rows];
  const table = sheet.tables.add(`A6:${last}${6 + rows.length}`, true, tableName);
  table.style = "TableStyleMedium2";
  sheet.getRange(`A6:${last}6`).format = {
    fill: navy,
    font: { name: "Arial", size: 10, bold: true, color: "#FFFFFF" },
    horizontalAlignment: "center",
    verticalAlignment: "center",
    wrapText: true,
  };
  sheet.getRange(`A7:${last}${6 + rows.length}`).format.font = { name: "Arial", size: 10, color: "#263238" };
  widths.forEach((width, i) => {
    if (width) sheet.getRange(`${col(i + 1)}:${col(i + 1)}`).format.columnWidth = width;
  });
  sheet.freezePanes.freezeRows(6);
  sheet.freezePanes.freezeColumns(2);
  return sheet;
}

const approval = wb.worksheets.getItem("主管核定中心");
const ability = wb.worksheets.getItem("試行能力狀態");
const qualification = wb.worksheets.getItem("資格有效性");
const abilityValues = ability.getRange("A7:L258").values;
const qualificationValues = qualification.getRange("A7:L62").values;
const approvalEnd = 372;

// Ability upgrade evidence and a separate supervisor decision. This sheet never auto-promotes.
const upgradeRows = abilityValues.map((r) => [
  `UPG|${r[0]}|${r[2]}`,
  r[0],
  r[1],
  r[2],
  r[4],
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  "待核定",
  null,
  null,
  null,
  null,
]);
const upgrade = addSheet(
  "能力升級候選",
  "Ø 升 ◎ 證據與主管核定",
  "至少三次成功觀察、跨兩個工作日且完成兩個月面談，才可送主管核定。符合條件不會自動升級。",
  ["升級鍵", "員工編號", "姓名", "技能代碼", "基準評等", "基準核定狀態", "成功觀察數", "首次成功日", "最近成功日", "觀察日證據", "關鍵遺漏數", "兩個月面談數", "候選狀態", "主管決定", "生效日", "核定人", "核定備註", "升級結果"],
  upgradeRows,
  "AbilityUpgradeCandidates",
  [38, 14, 16, 28, 14, 18, 16, 14, 14, 16, 16, 18, 26, 16, 14, 16, 38, 18],
);
const upgradeFormulas = [];
for (let r = 7; r <= 258; r++) {
  const key = abilityValues[r - 7][0] + "|" + abilityValues[r - 7][2];
  const approvalKey = `ABIL|${key}`;
  upgradeFormulas.push([
    `=IF($E${r}="未評估","未建立",_xlfn.XLOOKUP("${approvalKey}",'主管核定中心'!$A$12:$A$${approvalEnd},'主管核定中心'!$K$12:$K$${approvalEnd},"待主管核定",0))`,
    `=COUNTIFS('工作觀察輸入'!$C$7:$C$206,$B${r},'工作觀察輸入'!$G$7:$G$206,$D${r},'工作觀察輸入'!$M$7:$M$206,"是")`,
    `=IF($G${r}=0,"",_xlfn.MINIFS('工作觀察輸入'!$B$7:$B$206,'工作觀察輸入'!$C$7:$C$206,$B${r},'工作觀察輸入'!$G$7:$G$206,$D${r},'工作觀察輸入'!$M$7:$M$206,"是"))`,
    `=IF($G${r}=0,"",_xlfn.MAXIFS('工作觀察輸入'!$B$7:$B$206,'工作觀察輸入'!$C$7:$C$206,$B${r},'工作觀察輸入'!$G$7:$G$206,$D${r},'工作觀察輸入'!$M$7:$M$206,"是"))`,
    `=IF($G${r}=0,0,IF($H${r}=$I${r},1,2))`,
    `=COUNTIFS('工作觀察輸入'!$C$7:$C$206,$B${r},'工作觀察輸入'!$G$7:$G$206,$D${r},'工作觀察輸入'!$J$7:$J$206,"是")`,
    `=COUNTIFS('面談與異議'!$C$7:$C$106,$B${r},'面談與異議'!$F$7:$F$106,$D${r},'面談與異議'!$E$7:$E$106,"兩個月面談")`,
    `=IF($E${r}<>"Ø","不適用",IF($F${r}<>"已核定","先完成基準核定",IF($K${r}>0,"有關鍵遺漏，先檢討",IF($G${r}<3,"尚缺成功觀察",IF($J${r}<2,"觀察日期不足",IF($L${r}<1,"待兩個月面談","可送主管核定"))))))`,
    `=IF($M${r}<>"可送主管核定","尚未具備條件",IF($N${r}="不升級","維持原評等",IF($N${r}="核定升級",IF(OR($O${r}="",$P${r}=""),"核定資料未完整","已核定升級"),"待主管核定")))`,
  ]);
}
upgrade.getRange("F7:M258").formulas = upgradeFormulas.map((x) => x.slice(0, 8));
upgrade.getRange("R7:R258").formulas = upgradeFormulas.map((x) => [x[8]]);
upgrade.getRange("F7:M258").format.fill = paleBlue;
upgrade.getRange("N7:Q258").format.fill = amber;
upgrade.getRange("R7:R258").format.fill = paleBlue;
upgrade.getRange("H7:I258").format.numberFormat = "yyyy-mm-dd";
upgrade.getRange("O7:O258").format.numberFormat = "yyyy-mm-dd";
upgrade.getRange("N7:N258").dataValidation = { rule: { type: "list", values: ["待核定", "核定升級", "不升級"] } };
upgrade.getRange("M7:M258").conditionalFormats.add("containsText", { text: "可送主管核定", format: { fill: green, font: { color: "#375623", bold: true } } });
upgrade.getRange("M7:M258").conditionalFormats.add("containsText", { text: "關鍵遺漏", format: { fill: red, font: { color: "#9C0006", bold: true } } });
upgrade.tabColor = "#70AD47";

// Make the ability rating use the separately approved upgrade result while retaining the original baseline.
const abilityRatingFormulas = [];
for (let r = 7; r <= 258; r++) {
  const key = `UPG|${abilityValues[r - 7][0]}|${abilityValues[r - 7][2]}`;
  abilityRatingFormulas.push([
    `=IF(_xlfn.XLOOKUP("${key}",'能力升級候選'!$A$7:$A$258,'能力升級候選'!$R$7:$R$258,"",0)="已核定升級","◎",_xlfn.XLOOKUP("${key}",'能力升級候選'!$A$7:$A$258,'能力升級候選'!$E$7:$E$258,"未評估",0))`,
  ]);
}
ability.getRange("E7:E258").formulas = abilityRatingFormulas;

// Qualification restoration requires retraining, a passing matching assessment, and a supervisor decision.
const recoveryRows = qualificationValues.map((r) => [
  `REC|${r[0]}|${r[2]}`,
  r[0],
  r[1],
  r[2],
  r[3],
  null,
  r[5],
  r[6],
  null,
  null,
  null,
  null,
  null,
  "待核定",
  null,
  null,
  null,
  null,
  null,
]);
const recovery = addSheet(
  "資格恢復處理",
  "資格暫停與逾期恢復處理",
  "完成補訓、通過同員工同技能的複評考核並由主管核定後，才會回寫新的有效起日與到期日。",
  ["恢復鍵", "員工編號", "姓名", "技能代碼", "基準評等", "原資格狀態", "原有效起日", "原到期日", "停權／失效原因", "補訓完成日", "複評考核編號", "複評結果", "考核資料一致", "主管決定", "新生效日", "新到期日", "核定人", "核定備註", "恢復結果"],
  recoveryRows,
  "QualificationRecovery",
  [38, 14, 16, 28, 14, 18, 14, 14, 34, 14, 18, 16, 18, 16, 14, 14, 16, 38, 20],
);
const recoveryFormulas = [];
for (let r = 7; r <= 62; r++) {
  const q = qualificationValues[r - 7];
  const approvalKey = `QUAL|${q[0]}|${q[2]}`;
  recoveryFormulas.push([
    `=IF($E${r}="未評估","未建立",IF(_xlfn.XLOOKUP("${approvalKey}",'主管核定中心'!$A$12:$A$${approvalEnd},'主管核定中心'!$K$12:$K$${approvalEnd},"待主管核定",0)="已核定",IF(OR($H${r}="",TODAY()>$H${r}),"逾期","有效"),_xlfn.XLOOKUP("${approvalKey}",'主管核定中心'!$A$12:$A$${approvalEnd},'主管核定中心'!$K$12:$K$${approvalEnd},"待主管核定",0)))`,
    `=IF($K${r}="","",_xlfn.XLOOKUP($K${r},'考核紀錄輸入'!$A$7:$A$106,'考核紀錄輸入'!$L$7:$L$106,"考核編號不存在",0))`,
    `=IF($K${r}="","",IF(AND(_xlfn.XLOOKUP($K${r},'考核紀錄輸入'!$A$7:$A$106,'考核紀錄輸入'!$C$7:$C$106,"",0)=$B${r},_xlfn.XLOOKUP($K${r},'考核紀錄輸入'!$A$7:$A$106,'考核紀錄輸入'!$E$7:$E$106,"",0)=$D${r}),"符合","不符"))`,
    `=IF($F${r}="未建立","先完成考核",IF($F${r}="待主管核定","先完成資格核定",IF(AND($F${r}<>"資格暫停",$F${r}<>"逾期"),"無需恢復",IF($N${r}="不恢復","維持暫停",IF($N${r}="核定恢復",IF(AND($I${r}<>"",$J${r}<>"",$K${r}<>"",$L${r}="通過",$M${r}="符合",$O${r}<>"",$P${r}<>"",$Q${r}<>""),IF($P${r}<TODAY(),"新到期日已逾期","資格已恢復"),"恢復資料未完整"),"待完成恢復條件")))))`,
  ]);
}
recovery.getRange("F7:F62").formulas = recoveryFormulas.map((x) => [x[0]]);
recovery.getRange("L7:M62").formulas = recoveryFormulas.map((x) => x.slice(1, 3));
recovery.getRange("S7:S62").formulas = recoveryFormulas.map((x) => [x[3]]);
recovery.getRange("F7:H62").format.fill = paleBlue;
recovery.getRange("I7:K62").format.fill = amber;
recovery.getRange("L7:M62").format.fill = paleBlue;
recovery.getRange("N7:R62").format.fill = amber;
recovery.getRange("S7:S62").format.fill = paleBlue;
for (const c of ["G", "H", "J", "O", "P"]) recovery.getRange(`${c}7:${c}62`).format.numberFormat = "yyyy-mm-dd";
recovery.getRange("K7:K62").dataValidation = { rule: { type: "list", formula1: "'考核紀錄輸入'!$A$7:$A$106" } };
recovery.getRange("N7:N62").dataValidation = { rule: { type: "list", values: ["待核定", "核定恢復", "不恢復"] } };
recovery.getRange("S7:S62").conditionalFormats.add("containsText", { text: "資格已恢復", format: { fill: green, font: { color: "#375623", bold: true } } });
recovery.getRange("S7:S62").conditionalFormats.add("containsText", { text: "未完整", format: { fill: red, font: { color: "#9C0006", bold: true } } });
recovery.tabColor = "#70AD47";

// Recovery dates and status flow back to the authoritative qualification table.
const qualStatusFormulas = [];
const qualDateFormulas = [];
for (let r = 7; r <= 62; r++) {
  const key = `REC|${qualificationValues[r - 7][0]}|${qualificationValues[r - 7][2]}`;
  qualStatusFormulas.push([
    `=IF(_xlfn.XLOOKUP("${key}",'資格恢復處理'!$A$7:$A$62,'資格恢復處理'!$S$7:$S$62,"",0)="資格已恢復",IF(TODAY()>$G${r},"逾期","有效"),_xlfn.XLOOKUP("${key}",'資格恢復處理'!$A$7:$A$62,'資格恢復處理'!$F$7:$F$62,"未建立",0))`,
  ]);
  qualDateFormulas.push([
    `=IF(_xlfn.XLOOKUP("${key}",'資格恢復處理'!$A$7:$A$62,'資格恢復處理'!$S$7:$S$62,"",0)="資格已恢復",_xlfn.XLOOKUP("${key}",'資格恢復處理'!$A$7:$A$62,'資格恢復處理'!$O$7:$O$62,"",0),_xlfn.XLOOKUP("${key}",'資格恢復處理'!$A$7:$A$62,'資格恢復處理'!$G$7:$G$62,"",0))`,
    `=IF(_xlfn.XLOOKUP("${key}",'資格恢復處理'!$A$7:$A$62,'資格恢復處理'!$S$7:$S$62,"",0)="資格已恢復",_xlfn.XLOOKUP("${key}",'資格恢復處理'!$A$7:$A$62,'資格恢復處理'!$P$7:$P$62,"",0),_xlfn.XLOOKUP("${key}",'資格恢復處理'!$A$7:$A$62,'資格恢復處理'!$H$7:$H$62,"",0))`,
  ]);
}
qualification.getRange("E7:E62").formulas = qualStatusFormulas;
qualification.getRange("F7:G62").formulas = qualDateFormulas;

const overview = wb.worksheets.getItem("續作總覽");
overview.getRange("C13:D14").values = [
  ["能力升級流程已建立", "三次跨日成功觀察與面談後，仍須主管核定"],
  ["資格恢復流程已建立", "補訓、複評、資料一致與主管核定後回寫新效期"],
];

wb.recalculate();
await fs.mkdir(previewDir, { recursive: true });
for (const [name, range] of [
  ["能力升級候選", "A1:R20"],
  ["資格恢復處理", "A1:S20"],
  ["資格有效性", "A1:L16"],
  ["複評待辦", "A1:J24"],
]) {
  const image = await wb.render({ sheetName: name, range, scale: 1, format: "png" });
  await fs.writeFile(`${previewDir}/${name}.png`, new Uint8Array(await image.arrayBuffer()));
}

for (const range of [
  "能力升級候選!A6:R14",
  "資格恢復處理!A6:S14",
  "資格有效性!A6:L14",
  "複評待辦!A6:J14",
]) {
  const result = await wb.inspect({ kind: "table", range, include: "values,formulas", tableMaxRows: 12, tableMaxCols: 22, maxChars: 14000 });
  console.log(`\n--- ${range} ---\n${result.ndjson}`);
}
const errors = await wb.inspect({
  kind: "match",
  searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!|#SPILL!|#CALC!",
  options: { useRegex: true, maxResults: 300 },
  maxChars: 12000,
});
console.log(`\n--- FORMULA ERRORS ---\n${errors.ndjson}`);
const out = await SpreadsheetFile.exportXlsx(wb);
await out.save(path);
console.log(`SAVED ${path}`);

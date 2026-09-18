import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";
const path = "../outputs/clinic-assistant-model/assistant_skill_matrix_v1_pilot.xlsx";
const wb = await SpreadsheetFile.importXlsx(await FileBlob.load(path));
const sheet = wb.worksheets.getItem("班次檢核總覽");
const formulas = [];
for (let r = 7; r <= 36; r++) formulas.push([
  `=IF($Q${r}="","",IF($Q${r}="通過","可發布",IF($Q${r}="療程待確認","完成三週前療程標記",IF($Q${r}="缺主跟診配置","指定主跟診助理",IF($Q${r}="正式資格未完成","完成能力／熟悉度／規則核定",IF($Q${r}="缺短時支援","指定 RPD 短時支援者",IF($Q${r}="支援容量不足","增加可調度支援者或改派",IF($Q${r}="人員時段衝突","調整人員或時段","主管複核"))))))))`,
]);
sheet.getRange("R7:R36").formulas = formulas;
wb.recalculate();
console.log((await wb.inspect({ kind: "table", range: "班次檢核總覽!A6:R12", include: "values,formulas", tableMaxRows: 12, tableMaxCols: 20, maxChars: 16000 })).ndjson);
console.log((await wb.inspect({ kind: "match", searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!|#SPILL!|#CALC!", options: { useRegex: true, maxResults: 300 }, maxChars: 12000 })).ndjson);
const out = await SpreadsheetFile.exportXlsx(wb);
await out.save(path);

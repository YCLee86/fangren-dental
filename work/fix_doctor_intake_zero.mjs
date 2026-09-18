import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const path = "../outputs/clinic-assistant-model/assistant_skill_matrix_v1_pilot.xlsx";
const wb = await SpreadsheetFile.importXlsx(await FileBlob.load(path));
const doctor = wb.worksheets.getItem("醫師模式規則輸入");
const formulas = [];
for (let r = 7; r <= 156; r++) {
  formulas.push([`=IF($B${r}="","",IF($N${r}="停用","停用",IF($N${r}="退回補件","退回補件",IF(OR($C${r}="",$D${r}="",$E${r}="",$F${r}="",$G${r}="",NOT(ISNUMBER($H${r})),NOT(ISNUMBER($I${r})),NOT(ISNUMBER($K${r})),$L${r}="",$M${r}="",$O${r}=""),IF($N${r}="已核定","已核定但資料未完整","待補欄位或核定"),IF($N${r}="已核定","可發布","待主管核定")))))`]);
}
doctor.getRange("Q7:Q156").formulas = formulas;
wb.recalculate();
console.log((await wb.inspect({ kind: "table", range: "醫師模式規則輸入!A6:Q14", include: "values,formulas", tableMaxRows: 12, tableMaxCols: 18, maxChars: 14000 })).ndjson);
console.log((await wb.inspect({ kind: "match", searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!|#SPILL!|#CALC!", options: { useRegex: true, maxResults: 300 }, maxChars: 10000 })).ndjson);
const out = await SpreadsheetFile.exportXlsx(wb);
await out.save(path);
console.log(`SAVED ${path}`);

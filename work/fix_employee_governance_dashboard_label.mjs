import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const path = "../outputs/clinic-assistant-model/assistant_skill_matrix_v1_pilot.xlsx";
const wb = await SpreadsheetFile.importXlsx(await FileBlob.load(path));
const dashboard = wb.worksheets.getItem("主管工作台");
dashboard.getRange("D25").values = [["治理欄位與核定資料完整"]];
wb.recalculate();
console.log((await wb.inspect({ kind: "table", range: "主管工作台!A24:E25", include: "values,formulas", tableMaxRows: 4, tableMaxCols: 8, maxChars: 4000 })).ndjson);
console.log((await wb.inspect({ kind: "match", searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!|#SPILL!|#CALC!", options: { useRegex: true, maxResults: 300 }, maxChars: 8000 })).ndjson);
const out = await SpreadsheetFile.exportXlsx(wb);
await out.save(path);
console.log(`SAVED ${path}`);

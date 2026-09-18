import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const path = "../outputs/clinic-assistant-model/assistant_skill_matrix_v1_pilot.xlsx";
const wb = await SpreadsheetFile.importXlsx(await FileBlob.load(path));
const dashboard = wb.worksheets.getItem("主管工作台");

dashboard.getRange("B20:B22").formulas = [
  [`=COUNTIFS('醫師模式規則輸入'!$B$7:$B$156,"<>",'醫師模式規則輸入'!$Q$7:$Q$156,"<>可發布",'醫師模式規則輸入'!$Q$7:$Q$156,"<>停用")`],
  [`=COUNTIFS('流動層級規則輸入'!$C$7:$C$126,"<>",'流動層級規則輸入'!$M$7:$M$126,"<>可發布",'流動層級規則輸入'!$M$7:$M$126,"<>停用")`],
  [`=COUNTIFS('職級矩陣規則輸入'!$B$7:$B$156,"<>",'職級矩陣規則輸入'!$L$7:$L$156,"<>可發布",'職級矩陣規則輸入'!$L$7:$L$156,"<>停用")`],
];

wb.recalculate();
console.log((await wb.inspect({ kind: "table", range: "主管工作台!A20:E22", include: "values,formulas", tableMaxRows: 6, tableMaxCols: 8, maxChars: 6000 })).ndjson);
console.log((await wb.inspect({ kind: "match", searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!|#SPILL!|#CALC!", options: { useRegex: true, maxResults: 300 }, maxChars: 10000 })).ndjson);
const out = await SpreadsheetFile.exportXlsx(wb);
await out.save(path);
console.log(`SAVED ${path}`);

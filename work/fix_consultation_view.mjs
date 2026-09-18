import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const path = "../outputs/clinic-assistant-model/assistant_skill_matrix_v1_pilot.xlsx";
const previewPath = "./consultation-view-preview/諮詢排班視圖.png";
const wb = await SpreadsheetFile.importXlsx(await FileBlob.load(path));
const sheet = wb.worksheets.getItem("諮詢排班視圖");

const ids = [], changes = [], handling = [];
for (let r = 11; r <= 40; r++) {
  const src = r - 4;
  ids.push([`=IF('班次需求輸入'!A${src}="","",'班次需求輸入'!A${src})`]);
  changes.push([`=IF($A${r}="","",_xlfn.XLOOKUP($A${r},'班次需求輸入'!$A$7:$A$36,'班次需求輸入'!$T$7:$T$36,"",0))`]);
  handling.push([`=IF($A${r}="","",_xlfn.XLOOKUP($A${r},'班次需求輸入'!$A$7:$A$36,'班次需求輸入'!$V$7:$V$36,"",0))`]);
}
sheet.getRange("A11:A40").formulas = ids;
sheet.getRange("Q11:Q40").formulas = changes;
sheet.getRange("R11:R40").formulas = handling;
wb.recalculate();
const image = await wb.render({ sheetName: "諮詢排班視圖", range: "A1:T18", scale: 1.2, format: "png" });
await fs.writeFile(previewPath, new Uint8Array(await image.arrayBuffer()));
console.log((await wb.inspect({ kind: "table", range: "諮詢排班視圖!A10:T16", include: "values,formulas", tableMaxRows: 10, tableMaxCols: 22, maxChars: 14000 })).ndjson);
console.log((await wb.inspect({ kind: "match", searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!|#SPILL!|#CALC!", options: { useRegex: true, maxResults: 300 }, maxChars: 10000 })).ndjson);
const out = await SpreadsheetFile.exportXlsx(wb);
await out.save(path);

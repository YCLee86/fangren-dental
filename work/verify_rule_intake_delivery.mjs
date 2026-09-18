import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const path = "../outputs/clinic-assistant-model/assistant_skill_matrix_v1_pilot.xlsx";
const previewPath = "./rule-intake-final-dashboard.png";
const wb = await SpreadsheetFile.importXlsx(await FileBlob.load(path));

console.log((await wb.inspect({ kind: "table", range: "主管工作台!A20:E24", include: "values,formulas", tableMaxRows: 8, tableMaxCols: 8, maxChars: 8000 })).ndjson);
console.log((await wb.inspect({ kind: "table", range: "續作總覽!A21:D27", include: "values,formulas", tableMaxRows: 10, tableMaxCols: 8, maxChars: 8000 })).ndjson);
console.log((await wb.inspect({ kind: "match", searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!|#SPILL!|#CALC!", options: { useRegex: true, maxResults: 500 }, maxChars: 12000 })).ndjson);
const image = await wb.render({ sheetName: "主管工作台", range: "A11:E24", scale: 1.4, format: "png" });
await fs.writeFile(previewPath, new Uint8Array(await image.arrayBuffer()));
console.log(`RENDERED ${previewPath}`);

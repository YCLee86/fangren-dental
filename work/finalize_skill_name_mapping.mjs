import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const path = "../outputs/clinic-assistant-model/assistant_skill_matrix_v1_pilot.xlsx";
const previewPath = "./skill-mapping-final-dashboard.png";
const wb = await SpreadsheetFile.importXlsx(await FileBlob.load(path));

const dashboard = wb.worksheets.getItem("主管工作台");
dashboard.getRange("D26").values = [["核定資料完整、複合項目已拆分"]];
wb.recalculate();

console.log((await wb.inspect({ kind: "table", range: "主管工作台!A20:E26", include: "values,formulas", tableMaxRows: 10, tableMaxCols: 8, maxChars: 10000 })).ndjson);
console.log((await wb.inspect({ kind: "match", searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!|#SPILL!|#CALC!", options: { useRegex: true, maxResults: 500 }, maxChars: 12000 })).ndjson);
const image = await wb.render({ sheetName: "主管工作台", range: "A20:E26", scale: 1.4, format: "png" });
await fs.writeFile(previewPath, new Uint8Array(await image.arrayBuffer()));
const out = await SpreadsheetFile.exportXlsx(wb);
await out.save(path);
console.log(`SAVED ${path}`);

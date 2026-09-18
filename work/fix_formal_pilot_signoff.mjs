import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const path = "../outputs/clinic-assistant-model/assistant_skill_matrix_v1_pilot.xlsx";
const previewPath = "./formal-pilot-acceptance-previews/正式試排驗收.png";
const wb = await SpreadsheetFile.importXlsx(await FileBlob.load(path));
const pilot = wb.worksheets.getItem("正式試排驗收");

pilot.getRange("M28:N28").unmerge();
pilot.getRange("M28:N28").values = [["核定日", null]];
pilot.getRange("M28").format = { fill: "#F7FBFD", font: { name: "Arial", size: 10, bold: true, color: "#263238" }, verticalAlignment: "center" };
pilot.getRange("N28").format = { fill: "#FFF2CC", font: { name: "Arial", size: 10, color: "#263238" }, numberFormat: "yyyy-mm-dd", verticalAlignment: "center" };

wb.recalculate();
console.log((await wb.inspect({ kind: "table", range: "正式試排驗收!A27:N32", include: "values,formulas", tableMaxRows: 8, tableMaxCols: 16, maxChars: 8000 })).ndjson);
console.log((await wb.inspect({ kind: "match", searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!|#SPILL!|#CALC!", options: { useRegex: true, maxResults: 500 }, maxChars: 12000 })).ndjson);
const image = await wb.render({ sheetName: "正式試排驗收", range: "A1:N32", scale: 1.08, format: "png" });
await fs.writeFile(previewPath, new Uint8Array(await image.arrayBuffer()));
const out = await SpreadsheetFile.exportXlsx(wb);
await out.save(path);
console.log(`SAVED ${path}`);

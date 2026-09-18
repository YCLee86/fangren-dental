import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const path = "../outputs/clinic-assistant-model/assistant_skill_matrix_v1_pilot.xlsx";
const previewDir = "./checklist-workflow-final";
const wb = await SpreadsheetFile.importXlsx(await FileBlob.load(path));
await fs.mkdir(previewDir, { recursive: true });

for (const [name, range] of [["檢核表版本", "A1:R13"], ["檢核表項目輸入", "A1:P18"], ["考核紀錄輸入", "A1:U12"], ["主管工作台", "A20:E27"], ["複評待辦", "A1:J12"]]) {
  const image = await wb.render({ sheetName: name, range, scale: 1.25, format: "png" });
  await fs.writeFile(`${previewDir}/${name}.png`, new Uint8Array(await image.arrayBuffer()));
}

for (const range of ["檢核表版本!A6:R13", "檢核表項目輸入!A6:P18", "考核紀錄輸入!R6:U12", "主管工作台!A24:E27", "複評待辦!A6:J12"]) {
  console.log((await wb.inspect({ kind: "table", range, include: "values,formulas", tableMaxRows: 20, tableMaxCols: 22, maxChars: 16000 })).ndjson);
}
console.log((await wb.inspect({ kind: "match", searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!|#SPILL!|#CALC!", options: { useRegex: true, maxResults: 500 }, maxChars: 12000 })).ndjson);
console.log("VERIFIED");

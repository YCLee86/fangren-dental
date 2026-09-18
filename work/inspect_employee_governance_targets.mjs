import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const path = "../outputs/clinic-assistant-model/assistant_skill_matrix_v1_pilot.xlsx";
const previewDir = "./employee-governance-before";
const wb = await SpreadsheetFile.importXlsx(await FileBlob.load(path));

for (const range of ["試行員工主檔!A1:L20", "主管工作台!A1:M26", "續作總覽!A18:D30"]) {
  console.log((await wb.inspect({ kind: "table", range, include: "values,formulas", tableMaxRows: 32, tableMaxCols: 16, maxChars: 18000 })).ndjson);
}

await fs.mkdir(previewDir, { recursive: true });
for (const [name, range] of [["試行員工主檔", "A1:L20"], ["主管工作台", "A11:E26"]]) {
  const image = await wb.render({ sheetName: name, range, scale: 1.25, format: "png" });
  await fs.writeFile(`${previewDir}/${name}.png`, new Uint8Array(await image.arrayBuffer()));
}

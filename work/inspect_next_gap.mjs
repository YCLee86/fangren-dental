import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const path = "../outputs/clinic-assistant-model/assistant_skill_matrix_v1_pilot.xlsx";
const previewDir = "./next-gap-previews";
const wb = await SpreadsheetFile.importXlsx(await FileBlob.load(path));
console.log((await wb.inspect({ kind: "sheet", include: "id,name", maxChars: 16000 })).ndjson);

for (const range of [
  "資料字典!A1:F24",
  "試行員工主檔!A1:I24",
  "醫師模式規則輸入!A1:Q24",
  "流動層級規則輸入!A1:Q24",
  "職級矩陣規則輸入!A1:Q24",
  "主管工作台!A1:I26",
  "續作總覽!A14:F30",
]) {
  console.log((await wb.inspect({ kind: "table", range, include: "values,formulas", tableMaxRows: 30, tableMaxCols: 20, maxChars: 20000 })).ndjson);
}

await fs.mkdir(previewDir, { recursive: true });
for (const [name, range] of [
  ["醫師模式規則輸入", "A1:Q24"],
  ["流動層級規則輸入", "A1:Q24"],
  ["職級矩陣規則輸入", "A1:Q24"],
  ["主管工作台", "A1:I26"],
]) {
  const image = await wb.render({ sheetName: name, range, scale: 1.15, format: "png" });
  await fs.writeFile(`${previewDir}/${name}.png`, new Uint8Array(await image.arrayBuffer()));
}

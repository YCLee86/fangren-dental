import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const path = "../outputs/clinic-assistant-model/assistant_skill_matrix_v1_pilot.xlsx";
const previewDir = "./formal-shift-template-before";
const wb = await SpreadsheetFile.importXlsx(await FileBlob.load(path));

console.log((await wb.inspect({ kind: "sheet", include: "id,name", maxChars: 12000 })).ndjson);
for (const range of [
  "班次需求輸入!A1:X14",
  "排班配置輸入!A1:P14",
  "班次檢核總覽!A1:W14",
  "正式試排驗收!A1:N32",
  "主管操作導引!A1:K24",
  "主管工作台!A1:N34",
]) {
  console.log((await wb.inspect({
    kind: "table",
    range,
    include: "values,formulas",
    tableMaxRows: 35,
    tableMaxCols: 26,
    maxChars: 24000,
  })).ndjson);
}

await fs.mkdir(previewDir, { recursive: true });
for (const [sheetName, range] of [
  ["班次需求輸入", "A1:X14"],
  ["排班配置輸入", "A1:P14"],
  ["班次檢核總覽", "A1:W14"],
  ["正式試排驗收", "A1:N32"],
]) {
  const image = await wb.render({ sheetName, range, scale: 1.05, format: "png" });
  await fs.writeFile(`${previewDir}/${sheetName}.png`, new Uint8Array(await image.arrayBuffer()));
}

import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const path = "../outputs/clinic-assistant-model/assistant_skill_matrix_v1_pilot.xlsx";
const wb = await SpreadsheetFile.importXlsx(await FileBlob.load(path));
const previewDir = "./mode-pipeline-before";

for (const range of [
  "醫師模式規則輸入!A1:S20",
  "李醫師能力要求!A1:L59",
  "適配要求展開!A1:Q40",
  "排班適配試算!A1:V30",
  "班次需求輸入!A1:AF14",
  "排班配置輸入!A1:R14",
  "班次檢核總覽!A1:Y14",
  "技能主檔_V1!A1:K24",
  "資格有效性!A1:L14",
]) {
  const result = await wb.inspect({
    kind: "table",
    range,
    include: "values,formulas",
    tableMaxRows: 65,
    tableMaxCols: 32,
    maxChars: 40000,
  });
  console.log(`\n--- ${range} ---\n${result.ndjson}`);
}

await fs.mkdir(previewDir, { recursive: true });
for (const [sheetName, range] of [
  ["醫師模式規則輸入", "A1:S20"],
  ["李醫師能力要求", "A1:L24"],
  ["排班適配試算", "A1:V22"],
  ["班次需求輸入", "A1:AF14"],
]) {
  const image = await wb.render({ sheetName, range, scale: 1.1, format: "png" });
  await fs.writeFile(`${previewDir}/${sheetName}.png`, new Uint8Array(await image.arrayBuffer()));
}

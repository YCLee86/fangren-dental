import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const sourcePath = "../inputs/assistant_skill_matrix.xlsx";
const previewDir = "./previews";

await fs.mkdir(previewDir, { recursive: true });
const workbook = await SpreadsheetFile.importXlsx(await FileBlob.load(sourcePath));
const summary = await workbook.inspect({
  kind: "workbook,sheet,table,definedName,drawing",
  maxChars: 20000,
  tableMaxRows: 12,
  tableMaxCols: 14,
  tableMaxCellChars: 100,
});
console.log(summary.ndjson);

for (const sheet of workbook.worksheets.items) {
  const used = sheet.getUsedRange();
  const region = await workbook.inspect({
    kind: "region",
    sheetId: sheet.name,
    range: used?.address ?? "A1:Z40",
    maxChars: 12000,
  });
  console.log(`\n===== REGION ${sheet.name} =====\n${region.ndjson}`);
  const image = await workbook.render({
    sheetName: sheet.name,
    autoCrop: "all",
    scale: 1,
    format: "png",
  });
  const safeName = sheet.name.replace(/[\\/:*?"<>|]/g, "_");
  await fs.writeFile(`${previewDir}/${safeName}.png`, new Uint8Array(await image.arrayBuffer()));
}

import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const path = "../outputs/clinic-assistant-model/assistant_skill_matrix_v1_pilot.xlsx";
const previewDir = "./go-live-final";
const wb = await SpreadsheetFile.importXlsx(await FileBlob.load(path));
const sheet = wb.worksheets.getItem("上線準備");
sheet.getRange("B7").formulas = [[`=IF(COUNTIFS($M$12:$M$21,"未完成")>0,"先完成系統資料與正式規則",IF(COUNTIFS($M$22:$M$25,"<>已完成")>0,"完成主管人工確認","安排正式上線日期與責任人"))`]];
wb.recalculate();
await fs.mkdir(previewDir, { recursive: true });
for (const [name, range] of [["上線準備", "A1:N25"], ["主管工作台", "A19:M29"], ["主管操作導引", "A1:K22"]]) {
  const image = await wb.render({ sheetName: name, range, scale: 1.2, format: "png" });
  await fs.writeFile(`${previewDir}/${name}.png`, new Uint8Array(await image.arrayBuffer()));
}
console.log((await wb.inspect({ kind: "table", range: "上線準備!A6:N25", include: "values,formulas", tableMaxRows: 24, tableMaxCols: 16, maxChars: 18000 })).ndjson);
console.log((await wb.inspect({ kind: "match", searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!|#SPILL!|#CALC!", options: { useRegex: true, maxResults: 500 }, maxChars: 12000 })).ndjson);
const out = await SpreadsheetFile.exportXlsx(wb);
await out.save(path);
console.log(`SAVED ${path}`);

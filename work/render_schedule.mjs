import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";
const path = "../outputs/clinic-assistant-model/assistant_skill_matrix_v1_pilot.xlsx";
const dir = "./schedule-previews-final";
const wb = await SpreadsheetFile.importXlsx(await FileBlob.load(path));
await fs.mkdir(dir, { recursive: true });
for (const [name, range] of [["班次需求輸入", "A1:L18"], ["排班配置輸入", "A1:R18"], ["班次檢核總覽", "A1:R18"]]) {
  const preview = await wb.render({ sheetName: name, range, scale: 1, format: "png" });
  await fs.writeFile(`${dir}/${name}.png`, new Uint8Array(await preview.arrayBuffer()));
}
console.log((await wb.inspect({ kind: "match", searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!|#SPILL!|#CALC!", options: { useRegex: true, maxResults: 300 }, maxChars: 10000 })).ndjson);

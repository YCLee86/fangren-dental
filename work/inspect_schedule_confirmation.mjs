import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const path = "../outputs/clinic-assistant-model/assistant_skill_matrix_v1_pilot.xlsx";
const wb = await SpreadsheetFile.importXlsx(await FileBlob.load(path));

for (const spec of [
  ["班次需求輸入", "A1:L16"],
  ["班次檢核總覽", "A1:Q16"],
  ["排班配置輸入", "A1:R16"],
]) {
  const sheet = wb.worksheets.getItem(spec[0]);
  console.log(`\n--- ${spec[0]} values ---`);
  console.log(JSON.stringify(sheet.getRange(spec[1]).values));
  console.log(`\n--- ${spec[0]} formulas ---`);
  console.log(JSON.stringify(sheet.getRange(spec[1]).formulas));
}

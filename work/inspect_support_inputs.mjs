import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const path = "../outputs/clinic-assistant-model/assistant_skill_matrix_v1_pilot.xlsx";
const wb = await SpreadsheetFile.importXlsx(await FileBlob.load(path));
for (const spec of [["排班適配試算", "A1:V14"], ["李醫師治療模式", "A1:J19"], ["排班配置輸入", "A1:R12"], ["班次檢核總覽", "A1:U12"]]) {
  const sheet = wb.worksheets.getItem(spec[0]);
  console.log(`\n--- ${spec[0]} ---\n${JSON.stringify(sheet.getRange(spec[1]).values)}`);
}

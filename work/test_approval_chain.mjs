import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";
const path = "../outputs/clinic-assistant-model/assistant_skill_matrix_v1_pilot.xlsx";
const wb = await SpreadsheetFile.importXlsx(await FileBlob.load(path));
const approval = wb.worksheets.getItem("主管核定中心");
const values = approval.getRange("A12:K372").values;
const keys = [
  "ABIL|1001|LJT-PREP-SCALING",
  "ABIL|1001|COMMON-RECORD",
  "ABIL|1001|COMMON-INSURANCE",
  "ABIL|1001|COMMON-XRAY-RECORD",
  "FAM|1001|李侑津醫師",
  "REQ|LJT-SCALING|COMMON-RECORD",
  "REQ|LJT-SCALING|COMMON-INSURANCE",
  "REQ|LJT-SCALING|COMMON-XRAY-RECORD",
];
const rows = keys.map(key => {
  const i = values.findIndex(r => r[0] === key);
  if (i < 0) throw new Error(`Missing approval key ${key}`);
  return i + 12;
});
for (const r of rows) {
  approval.getRange(`G${r}:I${r}`).values = [["核定通過", new Date("2026-09-17"), "測試主管"]];
}
wb.recalculate();
const result = {
  fit: wb.worksheets.getItem("排班適配試算").getRange("O7:U7").values[0],
  assignment: wb.worksheets.getItem("排班配置輸入").getRange("I7:Q7").values[0],
  shift: wb.worksheets.getItem("班次檢核總覽").getRange("K7:R7").values[0],
};
console.log(JSON.stringify(result));

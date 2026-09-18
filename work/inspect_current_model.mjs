import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const path = "../outputs/clinic-assistant-model/assistant_skill_matrix_v1_pilot.xlsx";
const wb = await SpreadsheetFile.importXlsx(await FileBlob.load(path));

for (const range of [
  "資格有效性!A1:L14",
  "試行能力狀態!A1:L14",
  "工作觀察輸入!A1:N12",
  "面談與異議!A1:L12",
  "考核紀錄輸入!A1:Q12",
  "主管核定中心!A1:K18",
  "班次檢核總覽!A1:Q18",
  "續作總覽!A1:F18",
  "能力升級候選!A1:R12",
  "資格恢復處理!A1:S12",
  "班次需求輸入!A1:Q14",
  "排班配置輸入!A1:R14",
]) {
  const result = await wb.inspect({
    kind: "table",
    range,
    include: "values,formulas",
    tableMaxRows: 20,
    tableMaxCols: 20,
    maxChars: 20000,
  });
  console.log(`\n--- ${range} ---\n${result.ndjson}`);
}

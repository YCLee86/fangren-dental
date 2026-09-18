import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const path = "../outputs/clinic-assistant-model/assistant_skill_matrix_v1_pilot.xlsx";
const wb = await SpreadsheetFile.importXlsx(await FileBlob.load(path));

const errors = await wb.inspect({
  kind: "match",
  searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!|#SPILL!|#CALC!",
  options: { useRegex: true, maxResults: 500 },
  maxChars: 12000,
});

const support = await wb.inspect({
  kind: "table",
  range: "支援者資格核定!A6:P10",
  include: "values,formulas",
  tableMaxRows: 8,
  tableMaxCols: 18,
  maxChars: 12000,
});

const dashboard = await wb.inspect({
  kind: "table",
  range: "主管工作台!A20:E24",
  include: "values,formulas",
  tableMaxRows: 8,
  tableMaxCols: 8,
  maxChars: 6000,
});

console.log(errors.ndjson);
console.log(support.ndjson);
console.log(dashboard.ndjson);

import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";
const path = "../outputs/clinic-assistant-model/assistant_skill_matrix_v1_pilot.xlsx";
const wb = await SpreadsheetFile.importXlsx(await FileBlob.load(path));
const demand = wb.worksheets.getItem("班次需求輸入");
const assign = wb.worksheets.getItem("排班配置輸入");
const check = wb.worksheets.getItem("班次檢核總覽");

const originalStart = demand.getRange("C9").values[0][0];
demand.getRange("C9").values = [[16.5 / 24]];
assign.getRange("A11:C11").values = [["C005", "S003", "1001"]];
assign.getRange("E11:G11").values = [["短時支援", 0, "是"]];
wb.recalculate();
const overlap = [assign.getRange("P9").values[0][0], assign.getRange("P11").values[0][0]];
const shortSupport = check.getRange("O9:P9").values[0];

demand.getRange("C9").values = [[originalStart]];
assign.getRange("A11:C11").clear({ applyTo: "contents" });
assign.getRange("E11:G11").clear({ applyTo: "contents" });
wb.recalculate();
console.log(JSON.stringify({ overlap, shortSupport }));

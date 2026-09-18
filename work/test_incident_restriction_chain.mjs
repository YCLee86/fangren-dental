import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const path = "../outputs/clinic-assistant-model/assistant_skill_matrix_v1_pilot.xlsx";
const wb = await SpreadsheetFile.importXlsx(await FileBlob.load(path));
const incident = wb.worksheets.getItem("事件與限制");
const approvals = wb.worksheets.getItem("主管核定中心");
const ability = wb.worksheets.getItem("試行能力狀態");
const qualification = wb.worksheets.getItem("資格有效性");
const dashboard = wb.worksheets.getItem("主管工作台");

const approvalRows = approvals.getRange("A12:K372").values;
function approve(key) {
  const index = approvalRows.findIndex((r) => r[0] === key);
  if (index < 0) throw new Error(`Approval not found: ${key}`);
  const row = index + 12;
  approvals.getRange(`G${row}:I${row}`).values = [["核定通過", new Date("2026-09-17"), "流程測試主管"]];
}

approve("ABIL|1001|LJT-PREP-SCALING");
approve("QUAL|1001|LJT-PREP-PERIOSURG");
wb.recalculate();
const baseAbility = ability.getRange("F7").values[0][0];
const baseQualification = qualification.getRange("E7").values[0][0];

incident.getRange("A7:C7").values = [["INC-TEST-1", new Date("2026-09-17"), "1001"]];
incident.getRange("E7:H7").values = [["LJT-PREP-SCALING", "李侑津醫師", "LJT-SCALING", "第三級"]];
incident.getRange("J7:P7").values = [["需他人介入", "高風險未遂", "流程測試", "暫停技能資格", new Date("2026-09-17"), null, "流程測試主管"]];
incident.getRange("R7").values = [["待複評"]];
wb.recalculate();
const activeAbility = ability.getRange("F7").values[0][0];
const activeCount = dashboard.getRange("B18").values[0][0];

incident.getRange("O7").values = [[new Date("2026-09-16")]];
wb.recalculate();
const endedAbility = ability.getRange("F7").values[0][0];

incident.getRange("E7").values = [["LJT-PREP-PERIOSURG"]];
incident.getRange("O7").values = [[null]];
wb.recalculate();
const activeQualification = qualification.getRange("E7").values[0][0];

incident.getRange("O7").values = [[new Date("2026-09-16")]];
wb.recalculate();
const endedQualification = qualification.getRange("E7").values[0][0];

console.log(JSON.stringify({ baseAbility, baseQualification, activeAbility, activeCount, endedAbility, activeQualification, endedQualification }, null, 2));
if (baseAbility !== "已核定") throw new Error(`Expected approved baseline ability, got ${baseAbility}`);
if (baseQualification !== "有效") throw new Error(`Expected valid baseline qualification, got ${baseQualification}`);
if (activeAbility !== "資格暫停" || Number(activeCount) !== 1) throw new Error("Active incident did not suspend the related ability.");
if (endedAbility !== "已核定") throw new Error("Ended incident did not restore the prior ability status.");
if (activeQualification !== "資格暫停") throw new Error("Active incident did not suspend the related qualification.");
if (endedQualification !== "有效") throw new Error("Ended incident did not restore the prior qualification status.");
console.log("PASS: incident restrictions suspend only the related skill and restore its prior approved status when ended; no test data saved.");

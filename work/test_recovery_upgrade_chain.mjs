import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const path = "../outputs/clinic-assistant-model/assistant_skill_matrix_v1_pilot.xlsx";
const wb = await SpreadsheetFile.importXlsx(await FileBlob.load(path));

const upgrade = wb.worksheets.getItem("能力升級候選");
const ability = wb.worksheets.getItem("試行能力狀態");
const observations = wb.worksheets.getItem("工作觀察輸入");
const meetings = wb.worksheets.getItem("面談與異議");
const approvals = wb.worksheets.getItem("主管核定中心");
const assessments = wb.worksheets.getItem("考核紀錄輸入");
const recovery = wb.worksheets.getItem("資格恢復處理");
const qualification = wb.worksheets.getItem("資格有效性");
const recheck = wb.worksheets.getItem("複評待辦");

const upgradeValues = upgrade.getRange("A7:R258").values;
const targetIndex = upgradeValues.findIndex((r) => r[4] === "Ø");
if (targetIndex < 0) throw new Error("No Ø baseline found for upgrade test.");
const targetRow = targetIndex + 7;
const employeeId = upgradeValues[targetIndex][1];
const skillCode = upgradeValues[targetIndex][3];
const abilityRow = targetIndex + 7;

const approvalValues = approvals.getRange("A12:K372").values;
const abilityApprovalIndex = approvalValues.findIndex((r) => r[0] === `ABIL|${employeeId}|${skillCode}`);
if (abilityApprovalIndex < 0) throw new Error("Ability approval row not found.");
const abilityApprovalRow = abilityApprovalIndex + 12;
approvals.getRange(`G${abilityApprovalRow}:I${abilityApprovalRow}`).values = [["核定通過", new Date("2026-09-17"), "流程測試主管"]];

for (let i = 0; i < 3; i++) {
  const r = 7 + i;
  observations.getRange(`A${r}:C${r}`).values = [[`OBS-TEST-${i + 1}`, new Date("2026-09-18"), employeeId]];
  observations.getRange(`E${r}:K${r}`).values = [["李侑津醫師", "LJT-GENERAL", skillCode, "是", "否", "否", "流程測試主管"]];
}
wb.recalculate();
const sameDay = upgrade.getRange(`M${targetRow}`).values[0][0];

observations.getRange("B9").values = [[new Date("2026-09-19")]];
wb.recalculate();
const crossDayNoMeeting = upgrade.getRange(`M${targetRow}`).values[0][0];

meetings.getRange("A7:C7").values = [["MTG-TEST-1", new Date("2026-09-20"), employeeId]];
meetings.getRange("E7:G7").values = [["兩個月面談", skillCode, "觀察證據符合，送主管核定"]];
meetings.getRange("H7:L7").values = [["已知悉", "無異議", "流程測試主管", "送主管核定", "測試"]];
wb.recalculate();
const ready = upgrade.getRange(`M${targetRow}`).values[0][0];

upgrade.getRange(`N${targetRow}:P${targetRow}`).values = [["核定升級", new Date("2026-09-21"), "流程測試主管"]];
wb.recalculate();
const upgradeResult = upgrade.getRange(`R${targetRow}`).values[0][0];
const upgradedRating = ability.getRange(`E${abilityRow}`).values[0][0];

const recoveryValues = recovery.getRange("A7:S62").values;
const recoveryRow = 7;
const recoveryEmployee = recoveryValues[0][1];
const recoverySkill = recoveryValues[0][3];
const qualApprovalIndex = approvalValues.findIndex((r) => r[0] === `QUAL|${recoveryEmployee}|${recoverySkill}`);
if (qualApprovalIndex < 0) throw new Error("Qualification approval row not found.");
const qualApprovalRow = qualApprovalIndex + 12;
approvals.getRange(`G${qualApprovalRow}:I${qualApprovalRow}`).values = [["暫停", new Date("2026-09-17"), "流程測試主管"]];

assessments.getRange("A7:C7").values = [["ASM-REC-TEST", new Date("2026-09-22"), recoveryEmployee]];
assessments.getRange("E7:K7").values = [[recoverySkill, "CHK-PERIOSURG-01", "V1 草案", "流程測試主管", 0, 0, "無"]];
recovery.getRange(`I${recoveryRow}:K${recoveryRow}`).values = [["資格逾期測試", new Date("2026-09-21"), "ASM-REC-TEST"]];
recovery.getRange(`N${recoveryRow}:R${recoveryRow}`).values = [["核定恢復", new Date("2026-09-22"), new Date("2027-03-22"), "流程測試主管", "測試"]];
wb.recalculate();

const recoveryResult = recovery.getRange(`S${recoveryRow}`).values[0][0];
const qualStatus = qualification.getRange("E7").values[0][0];
const qualStart = qualification.getRange("F7").values[0][0];
const qualDue = qualification.getRange("G7").values[0][0];
const recheckDue = recheck.getRange("F7").values[0][0];
const recheckAdvice = recheck.getRange("J7").values[0][0];

console.log(JSON.stringify({
  upgrade: { employeeId, skillCode, sameDay, crossDayNoMeeting, ready, upgradeResult, upgradedRating },
  recovery: { recoveryEmployee, recoverySkill, recoveryResult, qualStatus, qualStart, qualDue, recheckDue, recheckAdvice },
}, null, 2));

if (sameDay !== "觀察日期不足") throw new Error(`Expected same-day boundary, got ${sameDay}`);
if (crossDayNoMeeting !== "待兩個月面談") throw new Error(`Expected meeting boundary, got ${crossDayNoMeeting}`);
if (ready !== "可送主管核定") throw new Error(`Expected ready candidate, got ${ready}`);
if (upgradeResult !== "已核定升級" || upgradedRating !== "◎") throw new Error("Upgrade chain failed.");
if (recoveryResult !== "資格已恢復" || qualStatus !== "有效") throw new Error("Recovery chain failed.");
if (Number(qualDue) !== Number(recheckDue)) throw new Error("Recovered due date did not flow to recheck task.");
console.log("PASS: upgrade and qualification recovery chains update end to end without saving test data.");

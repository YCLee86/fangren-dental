import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const source = "../outputs/clinic-assistant-model/assistant_skill_matrix_v1_pilot.xlsx";
const temp = "./formal-shift-entry-test.xlsx";
await fs.copyFile(source, temp);
let wb = await SpreadsheetFile.importXlsx(await FileBlob.load(temp));
const demand = wb.worksheets.getItem("班次需求輸入");

const baseline = {
  incompleteFormal: wb.worksheets.getItem("主管工作台").getRange("B33").values[0][0],
  firstBlankId: wb.worksheets.getItem("班次檢核總覽").getRange("A10").values[0][0],
};

demand.getRange("A10:H10").values = [["FS-001", new Date("2026-10-05"), 9 / 24, 11 / 24, "李侑津醫師", "LJT-SCALING", "一般診已確認", 1]];
demand.getRange("K10").values = [["正式"]];
wb.recalculate();
const validBasic = demand.getRange("Y10:AF10").values[0];
const checkLinked = wb.worksheets.getItem("班次檢核總覽").getRange("A10:Q10").values[0];
const dashboardAfterValid = wb.worksheets.getItem("主管工作台").getRange("B33").values[0][0];

demand.getRange("A11:H11").values = [["FS-001", new Date("2026-10-05"), 14 / 24, 13 / 24, "李柄輝醫師", "LJT-SCALING", "一般診已確認", 1]];
demand.getRange("K11").values = [["正式"]];
wb.recalculate();
const duplicateFirst = demand.getRange("Y10").values[0][0];
const invalidSecond = demand.getRange("Y11:AD11").values[0];
const secondCheckResult = wb.worksheets.getItem("班次檢核總覽").getRange("Q11").values[0][0];
const dashboardAfterInvalid = wb.worksheets.getItem("主管工作台").getRange("B33").values[0][0];

const errors = await wb.inspect({ kind: "match", searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!|#SPILL!|#CALC!", options: { useRegex: true, maxResults: 100 }, maxChars: 6000 });
const errorFree = !errors.ndjson.includes('"kind":"match"');

const assertions = {
  blankTemplateDoesNotCreateDemand: baseline.firstBlankId == null || baseline.firstBlankId === "",
  baselineHasNoIncompleteFormalShift: baseline.incompleteFormal === 0,
  validRowPassesFiveBasicChecks: validBasic.slice(0, 5).every((value) => value === "通過"),
  validRowCanEnterScheduling: validBasic[5] === "可進入排班",
  confirmationRemainsVisible: validBasic[6] === "待三週前標記" && validBasic[7].includes("三週"),
  newDemandFlowsToSafetyCheck: checkLinked[0] === "FS-001" && checkLinked[16] === "缺主跟診配置",
  validRowNotCountedAsInputDefect: dashboardAfterValid === 0,
  duplicateDetectedOnBothRows: duplicateFirst === "編號重複" && invalidSecond[0] === "編號重複",
  invalidTimeDetected: invalidSecond[2] === "結束時間須晚於開始",
  doctorModeMismatchDetected: invalidSecond[3] === "醫師或模式未發布",
  invalidFormalRowBlockedFromSafety: invalidSecond[5] === "正式建檔未完成" && secondCheckResult === "班次建檔未完成",
  dashboardCountsBothAffectedFormalRows: dashboardAfterInvalid === 2,
  formulaScanClear: errorFree,
};

const failed = Object.entries(assertions).filter(([, ok]) => !ok).map(([name]) => name);
console.log(JSON.stringify({ status: failed.length ? "FAIL" : "PASS", baseline, validBasic, checkResult: checkLinked[16], invalidSecond, dashboardAfterInvalid, assertions, failed }, null, 2));
if (failed.length) process.exitCode = 1;

await fs.rm(temp, { force: true });

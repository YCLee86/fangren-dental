import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const path = "../outputs/clinic-assistant-model/assistant_skill_matrix_v1_pilot.xlsx";
const wb = await SpreadsheetFile.importXlsx(await FileBlob.load(path));
const gov = wb.worksheets.getItem("員工治理核定");
const master = wb.worksheets.getItem("試行員工主檔");
const dashboard = wb.worksheets.getItem("主管工作台");
const fit = wb.worksheets.getItem("排班適配試算");

const fitBefore = fit.getRange("S7:U7").values[0];

gov.getRange("K7").values = [["已核定"]];
wb.recalculate();
const incomplete = {
  intake: gov.getRange("N7").values[0][0],
  history: gov.getRange("O7").values[0][0],
  masterStatus: master.getRange("K7").values[0][0],
  pending: dashboard.getRange("B25").values[0][0],
};

gov.getRange("F7:M7").values = [["正職助理路徑", "第一培訓組", "主管甲", "Lv.10", new Date("2026-09-01"), "已核定", "助理長", "初始治理核定"]];
wb.recalculate();
const active = {
  intake: gov.getRange("N7").values[0][0],
  history: gov.getRange("O7").values[0][0],
  activeKey: gov.getRange("P7").values[0][0],
  master: master.getRange("E7:G7").values[0],
  levelStatusDate: master.getRange("J7:L7").values[0],
  pending: dashboard.getRange("B25").values[0][0],
};

gov.getRange("A21:B21").values = [["GOV-1001-002", "1001"]];
gov.getRange("F21:M21").values = [["主管指定其他路徑", "專案培訓組", "主管乙", "Lv.10", new Date("2026-10-01"), "已核定", "助理長", "未來生效異動"]];
wb.recalculate();
const future = {
  oldHistory: gov.getRange("O7").values[0][0],
  newHistory: gov.getRange("O21").values[0][0],
  master: master.getRange("E7:G7").values[0],
};

gov.getRange("J21").values = [[new Date("2026-09-10")]];
wb.recalculate();
const replacement = {
  oldHistory: gov.getRange("O7").values[0][0],
  newHistory: gov.getRange("O21").values[0][0],
  master: master.getRange("E7:G7").values[0],
  levelStatusDate: master.getRange("J7:L7").values[0],
  fitAfter: fit.getRange("S7:U7").values[0],
};

console.log(JSON.stringify({ incomplete, active, future, replacement, fitBefore }, null, 2));
if (incomplete.intake !== "已核定但資料未完整" || incomplete.history !== "未生效" || incomplete.masterStatus !== "待主管核定" || Number(incomplete.pending) !== 14) throw new Error("Incomplete governance approval was not kept pending.");
if (active.intake !== "可生效" || active.history !== "生效中" || active.activeKey !== "1001") throw new Error("Complete governance approval did not become active.");
if (active.master.join("|") !== "正職助理路徑|第一培訓組|主管甲" || active.levelStatusDate[0] !== "Lv.10" || active.levelStatusDate[1] !== "已核定生效" || Number(active.pending) !== 13) throw new Error("Active governance did not flow back to the employee master or dashboard.");
if (future.oldHistory !== "生效中" || future.newHistory !== "待生效" || future.master.join("|") !== "正職助理路徑|第一培訓組|主管甲") throw new Error("Future governance replaced the current record too early.");
if (replacement.oldHistory !== "已由後續紀錄取代" || replacement.newHistory !== "生效中" || replacement.master.join("|") !== "主管指定其他路徑|專案培訓組|主管乙") throw new Error("Later effective governance did not replace the old record correctly.");
if (JSON.stringify(replacement.fitAfter) !== JSON.stringify(fitBefore)) throw new Error("Governance or formal level incorrectly changed scheduling fit.");
console.log("PASS: governance completeness, effective dating, history replacement, master roll-forward, dashboard counts, and separation from scheduling fit work without saving test data.");

import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const path = "../outputs/clinic-assistant-model/assistant_skill_matrix_v1_pilot.xlsx";
const wb = await SpreadsheetFile.importXlsx(await FileBlob.load(path));

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const doctor = wb.worksheets.getItem("醫師模式規則輸入");
const req = wb.worksheets.getItem("模式能力要求輸入");
const modes = wb.worksheets.getItem("排班模式清單");
const demand = wb.worksheets.getItem("班次需求輸入");

wb.recalculate();
assert(modes.getRange("Q7:Q19").values.filter((r) => r[0]).length === 13, "既有 13 個李醫師模式未完整保留");
assert(modes.getRange("Q20:Q169").values.filter((r) => r[0]).length === 0, "未完整的其他醫師模式不應進入排班下拉清單");
assert(doctor.getRange("U7:U14").values.every((r) => !String(r[0] ?? "").includes("可匯入")), "待補的醫師占位列不應可匯入");

doctor.getRange("A15:P15").values = [["TEST-DOC-01", "李柄輝醫師", "固定型", "TEST-MODE-01", "測試治療", "一般", "一般", 1, 0, null, 21, "TEST-V1", 46300, "已核定", "測試主管", "僅供記憶體測試"]];
doctor.getRange("R15:T15").values = [["測試規則文件 V1", "測試頁 1", "待建置"]];
req.getRange("A7:Q7").values = [["TEST-REQ-01", "TEST-MODE-01", "李柄輝醫師", "COMMON-RECORD", "主跟診", "必備", "◎", "Ø", "不需複評", "依正式規則", "TEST-V1", 46300, "已核定", "測試主管", "測試規則文件 V1", "測試頁 1", "僅供記憶體測試"]];
wb.recalculate();

assert(doctor.getRange("Q15").values[0][0] === "可發布", "完整模式規則應通過規則收件檢核");
assert(req.getRange("R7").values[0][0] === "可發布", "完整能力要求應通過收件檢核");
assert(doctor.getRange("U15").values[0][0] === "能力要求集未確認", "要求集未標記完整時不得匯入");
assert(!modes.getRange("Q28").values[0][0], "要求集未完整時不得出現在排班下拉清單");

doctor.getRange("T15").values = [["已完整"]];
wb.recalculate();
assert(doctor.getRange("U15").values[0][0] === "可匯入模式清單", "完整規則與要求集應可匯入");
assert(modes.getRange("P28").values[0][0] === "可進入排班建檔", "統一模式清單未正確放行完整模式");
assert(modes.getRange("Q28").values[0][0] === "TEST-MODE-01", "完整模式未出現在排班下拉欄");

demand.getRange("A10:H10").values = [["TEST-SHIFT-01", 46320, 0.375, 0.5, "李柄輝醫師", "TEST-MODE-01", "一般診已確認", 1]];
demand.getRange("K10").values = [["正式"]];
wb.recalculate();
assert(demand.getRange("AB10").values[0][0] === "通過", "已放行模式應通過醫師模式匯入檢核");
assert(demand.getRange("AC10").values[0][0] === "通過", "符合正式規則的人力參數應通過檢核");
assert(demand.getRange("AD10").values[0][0] === "可進入排班", "完整正式班次應可進入排班建檔");

doctor.getRange("T15").values = [["待建置"]];
wb.recalculate();
assert(!modes.getRange("Q28").values[0][0], "撤回要求集完整性後應立即移出排班下拉清單");
assert(demand.getRange("AB10").values[0][0] === "醫師或模式未通過匯入閘門", "撤回後既有班次應被匯入閘門阻擋");

const errors = await wb.inspect({ kind: "match", searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A", options: { useRegex: true, maxResults: 100 }, summary: "mode import test formula errors" });
const errorText = errors.ndjson ?? "";
assert(!/"matchCount":\s*[1-9]/.test(errorText), `公式錯誤：${errorText}`);

console.log("PASS mode import pipeline: baseline blocked, dual gate enforced, complete mode imported, demand validated, withdrawal re-blocked");

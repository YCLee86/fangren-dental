import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const sourcePath = "../inputs/assistant_skill_matrix.xlsx";
const outputDir = "../outputs/clinic-assistant-model";
const outputPath = `${outputDir}/assistant_skill_matrix_v1_pilot.xlsx`;
const previewDir = "./final-previews";
const fontName = "Microsoft JhengHei";
const colors = {
  navy: "#1F5E78",
  blue: "#D9EEF7",
  paleBlue: "#EAF5FA",
  green: "#E2F0D9",
  amber: "#FFF2CC",
  red: "#FCE4D6",
  gray: "#E7E6E6",
  dark: "#263238",
  line: "#B7C9D3",
};

function columnName(n) {
  let s = "";
  while (n > 0) {
    n--;
    s = String.fromCharCode(65 + (n % 26)) + s;
    n = Math.floor(n / 26);
  }
  return s;
}

function styleTitle(sheet, lastCol, title, note) {
  sheet.showGridLines = false;
  sheet.getRange("A2").values = [[title]];
  sheet.getRange(`A2:${lastCol}2`).format.font = { name: fontName, size: 14, bold: true, color: colors.dark };
  sheet.getRange(`A3:${lastCol}3`).format.borders = { bottom: { style: "thin", color: colors.line } };
  sheet.getRange("A4").values = [[note]];
  sheet.getRange(`A4:${lastCol}4`).format.font = { name: fontName, size: 10, italic: true, color: "#607D8B" };
}

function addDataSheet(workbook, name, title, note, headers, rows, tableName, widths = []) {
  const sheet = workbook.worksheets.add(name);
  const lastCol = columnName(headers.length);
  styleTitle(sheet, lastCol, title, note);
  sheet.getRange(`A6:${lastCol}${6 + rows.length}`).values = [headers, ...rows];
  const table = sheet.tables.add(`A6:${lastCol}${6 + rows.length}`, true, tableName);
  table.style = "TableStyleMedium2";
  table.showBandedRows = true;
  table.showFilterButton = true;
  sheet.getRange(`A6:${lastCol}6`).format = {
    fill: colors.navy,
    font: { name: fontName, size: 10, bold: true, color: "#FFFFFF" },
    horizontalAlignment: "center",
    verticalAlignment: "center",
    wrapText: true,
  };
  sheet.getRange(`A7:${lastCol}${6 + rows.length}`).format.font = { name: fontName, size: 10, color: colors.dark };
  sheet.getRange(`A7:${lastCol}${6 + rows.length}`).format.verticalAlignment = "center";
  sheet.getRange(`A6:${lastCol}${6 + rows.length}`).format.borders = {
    insideHorizontal: { style: "thin", color: "#DCE6EB" },
    bottom: { style: "thin", color: colors.line },
  };
  widths.forEach((width, i) => {
    if (width) sheet.getRange(`${columnName(i + 1)}:${columnName(i + 1)}`).format.columnWidth = width;
  });
  sheet.freezePanes.freezeRows(6);
  return sheet;
}

const workbook = await SpreadsheetFile.importXlsx(await FileBlob.load(sourcePath));
const detailSheet = workbook.worksheets.getItem("技能明細");
const detailValues = detailSheet.getRange("A6:I1644").values;
const detailHeaders = detailValues[0].map(String);
const detailRows = detailValues.slice(1).map((row) => Object.fromEntries(detailHeaders.map((h, i) => [h, row[i]])));
const liRows = detailRows.filter((r) => r["工作區塊"] === "李侑津醫師");

const staffMap = new Map();
for (const row of liRows) {
  const id = String(row["員工編號"] ?? "");
  if (!id || staffMap.has(id)) continue;
  staffMap.set(id, {
    id,
    name: String(row["姓名"] ?? ""),
    level: String(row["等級"] ?? "未評分"),
    employment: id.startsWith("2") ? "兼職" : "正職",
  });
}
const staff = [...staffMap.values()];

const dictionaryRows = [
  ["T01", "員工主檔", "是", "employee_id", "employee_id, name, employment_type, capability_path, active_flag", "人員識別、聘用型態與能力路徑分開保存"],
  ["T02", "組別與主管歷程", "是", "assignment_id", "assignment_id, employee_id, group_id, supervisor_id, start_date, end_date", "同一時間一個主要培訓組"],
  ["T03", "技能主檔", "是", "skill_id", "skill_id, standard_name, skill_type, risk_level, recheck_cycle_months, active_flag", "同義名稱另存來源文字"],
  ["T04", "崗位與任務主檔", "是", "task_id", "task_id, position_id, task_name, critical_flag, active_flag", "流動為崗位，限制落到具體任務"],
  ["T05", "醫師主檔", "是", "doctor_id", "doctor_id, doctor_name, practice_pattern, active_flag", "固定型或混合型"],
  ["T06", "治療模式與療程階段", "是", "mode_id", "mode_id, doctor_id, treatment_name, stage_name, complexity, version_id", "判定到醫師×治療×階段"],
  ["T07", "治療／崗位能力要求版本", "是", "requirement_id", "requirement_id, mode_id, skill_id, role_type, minimum_rating, support_rule, version_id", "已發布版本不可覆寫"],
  ["T08", "員工目前能力狀態", "是", "employee_skill_id", "employee_id, skill_id, rating, effective_status, source_type, approved_by, approved_at", "能力、訓練與有效性分開"],
  ["T09", "考核場次與檢核項目結果", "第二階段", "assessment_id", "assessment_id, employee_id, skill_id, checklist_version, result, assessor_id, assessed_at", "保留關鍵必要、一般必要、觀察項目"],
  ["T10", "工作觀察紀錄", "第二階段", "observation_id", "employee_id, skill_id, doctor_id, mode_id, observed_at, independent_flag, prompt_needed, critical_omission", "Ø 升 ◎ 的觀察證據"],
  ["T11", "跟診熟悉度", "是", "familiarity_id", "employee_id, doctor_id, familiarity_level, effective_status, approved_by, approved_at", "不等同技術能力"],
  ["T12", "資格有效性與複評排程", "是", "qualification_id", "employee_id, skill_id, valid_from, due_date, grace_end_date, status, retest_date", "高風險逾期無寬限"],
  ["T13", "人力需求", "第二階段", "demand_id", "slot_id, mode_id, required_count, required_skill_set, confirmed_status", "三週前標記特殊療程"],
  ["T14", "班次與人員配置", "第二階段", "assignment_id", "slot_id, employee_id, role, fit_result, exception_id", "正式人力與學習人員分開"],
  ["T15", "支援名額與短時支援預約", "第二階段", "support_booking_id", "slot_id, supporter_id, support_type, capacity_units, start_time, end_time", "一般 1 名額，高複雜度 2 名額"],
  ["T16", "事件、暫時限制與恢復紀錄", "第二階段", "incident_id", "employee_id, skill_id, severity, restriction, opened_at, restored_at", "只暫停直接相關資格"],
  ["T17", "面談、已知悉與異議複核", "第二階段", "review_id", "employee_id, review_type, decision, acknowledged_at, appeal_status, final_decider", "已知悉不代表同意"],
  ["T18", "職級與能力路徑歷程", "是", "level_history_id", "employee_id, formal_level, capability_path, effective_date, approved_by, reason", "正式職級不自動升降"],
];

const settingsRows = [
  ["能力評等", "RATING_ORDER", "未評估→※→△→Ø→◎", "已確認", "排班不得把空白視為不適用"],
  ["條件排班", "MAX_O_COUNT", 3, "已確認", "Ø 最多 3 項"],
  ["條件排班", "MAX_O_RATIO", 1 / 3, "已確認", "Ø 不超過必要技能三分之一"],
  ["支援容量", "DEFAULT_SUPPORT_UNITS", 2, "已確認", "完整支援者每班預設名額"],
  ["支援容量", "GENERAL_SUPPORT_COST", 1, "已確認", "一般 Ø 跟診或能力未完整流動人員"],
  ["支援容量", "HIGH_COMPLEXITY_COST", 2, "已確認", "高複雜度 1:1 支援"],
  ["支援容量", "BACKUP_SUPPORT_MAX", 1, "已確認", "技術備援者最多一個一般名額"],
  ["能力升級", "O_TO_A_OBSERVATIONS", 3, "已確認", "至少三次成功觀察"],
  ["能力升級", "O_TO_A_WORKDAYS", 2, "已確認", "至少兩個不同工作日"],
  ["能力升級", "INTERVIEW_REQUIRED", "是", "已確認", "至少一次兩個月面談檢視"],
  ["複評", "INITIAL_BASELINE_DATE", new Date("2026-09-01"), "已確認", "初始能力基準日"],
  ["複評", "FIRST_RECHECK_DUE", new Date("2027-03-01"), "已確認", "半年複評首次到期日"],
  ["複評", "STANDARD_GRACE_DAYS", 30, "已確認", "須先排定補考日期"],
  ["複評", "HIGH_RISK_GRACE_DAYS", 0, "已確認", "低頻高風險逾期立即暫停"],
  ["療程確認", "SPECIAL_TREATMENT_LEAD_WEEKS", 3, "已確認", "諮詢組標記特殊療程"],
  ["療程確認", "PREVISIT_CONFIRM_WEEKS", 1, "已確認", "跟診助理向醫師確認"],
  ["短時支援", "RPD_FINAL_DEFAULT_MINUTES", 30, "已確認", "可依個案調整"],
  ["治理", "RULE_VERSION", "V1", "已確認", "正式版本需生效日期"],
];

const skillRows = [
  ["LJT-PREP-SCALING", "洗牙器械準備", "醫師＋治療專屬", "李侑津醫師", "器械準備", "洗牙", "一般", "否", null, "啟用", "來源文字保留"],
  ["LJT-PREP-FILLING", "補牙器械準備", "醫師＋治療專屬", "李侑津醫師", "器械準備", "補牙", "一般", "否", null, "啟用", ""],
  ["LJT-PREP-PERIO", "牙周統合器械準備", "醫師＋治療專屬", "李侑津醫師", "器械準備", "牙周統合", "一般", "否", null, "啟用", ""],
  ["LJT-PREP-RCT", "一般根管器械準備", "醫師＋治療專屬", "李侑津醫師", "器械準備", "根管治療", "一般", "否", null, "啟用", ""],
  ["LJT-PREP-EXTRACTION", "拔牙器械準備", "醫師＋治療專屬", "李侑津醫師", "器械準備", "拔牙", "一般", "否", null, "啟用", ""],
  ["LJT-PREP-CROWNPOST", "拆 crown/post 器械準備", "醫師＋治療專屬", "李侑津醫師", "器械準備", "拆 crown/post", "一般", "否", null, "啟用", ""],
  ["LJT-PREP-CROWN", "固定假牙器械準備", "醫師＋治療專屬", "李侑津醫師", "自費", "固定假牙", "一般", "否", null, "啟用", ""],
  ["LJT-PREP-RPD", "RPD 器械準備", "醫師＋治療專屬", "李侑津醫師", "自費", "RPD", "一般", "否", null, "啟用", "一般 RPD 步驟"],
  ["LJT-RPD-FINAL", "RPD 印最終模", "技術", "李侑津醫師", "自費", "RPD 印最終模（拆分新增）", "高風險", "是", 6, "啟用", "來源表無獨立評等，須另行考核"],
  ["LJT-PREP-AIRPOLISH", "噴砂美白器械準備", "醫師＋治療專屬", "李侑津醫師", "自費", "噴砂美白", "一般", "否", null, "啟用", ""],
  ["LJT-PREP-PERIOSURG", "牙周手術相關準備", "高複雜度技術", "李侑津醫師", "手術", "牙周手術", "高風險", "是", 6, "啟用", ""],
  ["LJT-PREP-MICROENDO", "顯微根管相關準備", "高複雜度技術", "李侑津醫師", "手術", "顯微根管", "高風險", "是", 6, "啟用", ""],
  ["LJT-PREP-IMPLANT", "植牙相關準備", "高複雜度技術", "李侑津醫師", "手術", "植 牙", "高風險", "是", 6, "啟用", "標準名稱合併空格差異"],
  ["COMMON-RECORD", "病歷基本操作", "共通技能", "共通", "", "病歷紀錄", "一般", "否", null, "啟用", "跨醫師承認"],
  ["COMMON-INSURANCE", "健保申報", "共通技能", "共通", "", "健保申報", "一般", "否", null, "啟用", "跨醫師承認"],
  ["COMMON-XRAY-RECORD", "X 光片紀錄", "共通技能", "共通", "", "X光片紀錄", "一般", "否", null, "啟用", "跨醫師承認"],
  ["COMMON-PA", "拍 PA", "共通技術", "共通", "", "拍PA", "需半年複評", "是", 6, "啟用", "影像操作分項"],
  ["COMMON-IOS", "口掃機運用", "共通技術", "共通", "", "口掃機運用", "一般", "否", null, "啟用", "跨醫師承認"],
];

const modeRows = [
  ["LJT-SCALING", "李侑津醫師", "一般治療", "洗牙", "一般", "一般", 1, 1, 0, null, "可獨立配合", "V1", new Date("2026-09-17"), "試行", ""],
  ["LJT-FILLING", "李侑津醫師", "一般治療", "補牙", "一般", "一般", 1, 1, 0, null, "可獨立配合", "V1", new Date("2026-09-17"), "試行", ""],
  ["LJT-PERIO", "李侑津醫師", "一般治療", "牙周統合", "一般", "一般", 1, 1, 0, null, "可獨立配合", "V1", new Date("2026-09-17"), "試行", ""],
  ["LJT-RCT", "李侑津醫師", "一般治療", "一般根管治療", "一般", "一般", 1, 1, 0, null, "可獨立配合", "V1", new Date("2026-09-17"), "試行", ""],
  ["LJT-EXTRACTION", "李侑津醫師", "一般治療", "拔牙", "一般", "一般", 1, 1, 0, null, "可獨立配合", "V1", new Date("2026-09-17"), "試行", ""],
  ["LJT-CROWNPOST", "李侑津醫師", "一般治療", "拆 crown/post", "一般", "一般", 1, 1, 0, null, "可獨立配合", "V1", new Date("2026-09-17"), "試行", ""],
  ["LJT-CROWN", "李侑津醫師", "補綴／自費", "固定假牙", "一般", "一般", 1, 1, 0, null, "可獨立配合", "V1", new Date("2026-09-17"), "試行", ""],
  ["LJT-RPD", "李侑津醫師", "補綴／自費", "RPD", "一般步驟", "一般", 1, 1, 0, null, "可獨立配合", "V1", new Date("2026-09-17"), "試行", "一般 RPD 不需額外支援"],
  ["LJT-RPD-FINAL", "李侑津醫師", "補綴／自費", "RPD", "印最終模", "特殊階段", 1, 1, 1, 30, "可獨立配合", "V1", new Date("2026-09-17"), "試行", "三週前標記；短時支援"],
  ["LJT-AIRPOLISH", "李侑津醫師", "補綴／自費", "噴砂美白", "一般", "一般", 1, 1, 0, null, "可獨立配合", "V1", new Date("2026-09-17"), "試行", ""],
  ["LJT-PERIOSURG", "李侑津醫師", "高複雜度", "牙周手術", "一般", "高複雜度", 1, 2, 0, null, "可獨立配合", "V1", new Date("2026-09-17"), "試行", "Ø 時完整支援者 1:1"],
  ["LJT-MICROENDO", "李侑津醫師", "高複雜度", "顯微根管", "一般", "高複雜度", 1, 2, 0, null, "可獨立配合", "V1", new Date("2026-09-17"), "試行", "Ø 時完整支援者 1:1"],
  ["LJT-IMPLANT", "李侑津醫師", "高複雜度", "植牙", "一般", "高複雜度", 1, 2, 0, null, "可獨立配合", "V1", new Date("2026-09-17"), "試行", "Ø 時完整支援者 1:1"],
];

const modeToSkill = {
  "LJT-SCALING": "LJT-PREP-SCALING",
  "LJT-FILLING": "LJT-PREP-FILLING",
  "LJT-PERIO": "LJT-PREP-PERIO",
  "LJT-RCT": "LJT-PREP-RCT",
  "LJT-EXTRACTION": "LJT-PREP-EXTRACTION",
  "LJT-CROWNPOST": "LJT-PREP-CROWNPOST",
  "LJT-CROWN": "LJT-PREP-CROWN",
  "LJT-RPD": "LJT-PREP-RPD",
  "LJT-RPD-FINAL": "LJT-PREP-RPD",
  "LJT-AIRPOLISH": "LJT-PREP-AIRPOLISH",
  "LJT-PERIOSURG": "LJT-PREP-PERIOSURG",
  "LJT-MICROENDO": "LJT-PREP-MICROENDO",
  "LJT-IMPLANT": "LJT-PREP-IMPLANT",
};
const requirementRows = [];
for (const mode of modeRows) {
  const [modeId, , , treatment, stage, complexity] = mode;
  const supportRule = complexity === "高複雜度" ? "Ø 時完整支援者 1:1" : "依一般支援名額";
  requirementRows.push([`${modeId}-MAIN`, modeId, treatment, stage, modeToSkill[modeId], "主跟診", "必備", "◎", "Ø", supportRule, "已確認", "V1"]);
  for (const commonSkill of ["COMMON-RECORD", "COMMON-INSURANCE", "COMMON-XRAY-RECORD"]) {
    requirementRows.push([`${modeId}-${commonSkill}`, modeId, treatment, stage, commonSkill, "主跟診", "待確認", "◎", "Ø", "確認後才納入自動判定", "待確認", "V1"]);
  }
}
requirementRows.push(["LJT-RPD-FINAL-SUPPORT", "LJT-RPD-FINAL", "RPD", "印最終模", "LJT-RPD-FINAL", "短時支援者", "必備", "◎", "◎", "不要求李醫師完整跟診熟悉度；預設 30 分鐘", "已確認", "V1"]);

const sourceSkillMap = {
  "洗牙": "LJT-PREP-SCALING",
  "補牙": "LJT-PREP-FILLING",
  "牙周統合": "LJT-PREP-PERIO",
  "根管治療": "LJT-PREP-RCT",
  "拔牙": "LJT-PREP-EXTRACTION",
  "拆 crown/post": "LJT-PREP-CROWNPOST",
  "固定假牙": "LJT-PREP-CROWN",
  "RPD": "LJT-PREP-RPD",
  "噴砂美白": "LJT-PREP-AIRPOLISH",
  "牙周手術": "LJT-PREP-PERIOSURG",
  "顯微根管": "LJT-PREP-MICROENDO",
  "植 牙": "LJT-PREP-IMPLANT",
  "病歷紀錄": "COMMON-RECORD",
  "健保申報": "COMMON-INSURANCE",
  "X光片紀錄": "COMMON-XRAY-RECORD",
  "拍PA": "COMMON-PA",
  "口掃機運用": "COMMON-IOS",
};
const abilityRows = liRows
  .filter((r) => sourceSkillMap[String(r["技能項目"] ?? "")])
  .map((r) => {
    const rating = String(r["評等符號"] ?? "").trim();
    return [
      String(r["員工編號"]),
      String(r["姓名"]),
      sourceSkillMap[String(r["技能項目"])],
      String(r["技能項目"]),
      rating || "未評估",
      "待主管核定",
      "初始能力基準",
      new Date("2026-09-01"),
      "",
      "",
      Number(r["原表列號"]),
      `${String(r["員工編號"])}|${sourceSkillMap[String(r["技能項目"])]}`,
    ];
  });
for (const person of staff) {
  abilityRows.push([person.id, person.name, "LJT-RPD-FINAL", "RPD 印最終模（來源無獨立欄位）", "未評估", "未建立", "新增技能待考核", new Date("2026-09-17"), "", "", 35, `${person.id}|LJT-RPD-FINAL`]);
}

const familiarityMap = {
  "◎": "可獨立配合",
  "Ø": "可配合但需支援",
  "△": "學習中",
  "※": "學習中",
};
const familiarityRows = liRows
  .filter((r) => r["技能項目"] === "跟診順暢度")
  .map((r) => {
    const symbol = String(r["評等符號"] ?? "").trim();
    return [
      String(r["員工編號"]),
      String(r["姓名"]),
      "李侑津醫師",
      symbol || "空白",
      familiarityMap[symbol] ?? "未評估",
      "待主管核定",
      "由舊『跟診順暢度』初步轉換",
      new Date("2026-09-01"),
      "",
      "",
      `${String(r["員工編號"])}|李侑津醫師`,
    ];
  });

const abilityLookup = new Map(abilityRows.map((r) => [`${r[0]}|${r[2]}`, r[4]]));
const qualificationSkillIds = ["LJT-PREP-PERIOSURG", "LJT-PREP-MICROENDO", "LJT-PREP-IMPLANT", "LJT-RPD-FINAL"];
const qualificationRows = [];
for (const person of staff) {
  for (const skillId of qualificationSkillIds) {
    const rating = abilityLookup.get(`${person.id}|${skillId}`) ?? "未評估";
    const isFinal = skillId === "LJT-RPD-FINAL";
    qualificationRows.push([
      person.id,
      person.name,
      skillId,
      rating,
      isFinal ? "未建立" : "待主管核定",
      isFinal ? null : new Date("2026-09-01"),
      isFinal ? null : new Date("2027-03-01"),
      0,
      null,
      null,
      isFinal ? "來源表沒有獨立評等，須另行考核" : "低頻高風險；逾期立即暫停",
      `${person.id}|${skillId}`,
    ]);
  }
}

const employeeRows = staff.map((p) => [p.id, p.name, p.employment, p.level, "待主管指定", "", "", "在職", "來源工作簿"]);

const dictionary = addDataSheet(workbook, "資料字典", "第一版最小資料庫欄位", "18 張邏輯資料表的最小欄位；『第二階段』表示保留結構但本次尚未建資料。", ["表代碼", "邏輯資料表", "本次建置", "主鍵", "最小欄位", "用途／規則"], dictionaryRows, "MvpDataDictionary", [10, 24, 12, 20, 72, 44]);
dictionary.getRange(`E7:F${6 + dictionaryRows.length}`).format.wrapText = true;

const settings = addDataSheet(workbook, "模型設定", "能力與排班規則參數", "依 2026-09-17 已確認規則建立；參數值可版本化，不應直接覆蓋歷史規則。", ["規則類別", "參數代碼", "參數值", "確認狀態", "說明"], settingsRows, "ModelSettings", [16, 30, 24, 14, 52]);
settings.getRange("C17:C18").format.numberFormat = "yyyy-mm-dd";
settings.getRange("C9").format.numberFormat = "0.0%";

const skillsSheet = addDataSheet(workbook, "技能主檔_V1", "技能主檔 V1", "先建立李侑津醫師試行技能與共通技能；原始名稱保留，標準名稱供後續跨醫師合併。", ["技能代碼", "標準名稱", "技能類型", "來源工作區塊", "來源分類", "來源文字", "風險／複評類型", "半年複評", "週期（月）", "狀態", "備註"], skillRows, "SkillMasterV1", [24, 28, 20, 18, 14, 28, 18, 12, 12, 12, 42]);
skillsSheet.getRange(`K7:K${6 + skillRows.length}`).format.wrapText = true;

const modesSheet = addDataSheet(workbook, "李醫師治療模式", "李侑津醫師治療模式 V1", "一般診、補綴／自費與高複雜度分開；RPD 印最終模另列短時支援階段。", ["模式代碼", "醫師", "模式群組", "治療項目", "療程階段", "複雜度", "一般需求人數", "條件排支援名額", "固定短時支援人數", "預設支援分鐘", "跟診熟悉度要求", "版本", "生效日", "狀態", "備註"], modeRows, "LiTreatmentModes", [22, 16, 18, 20, 18, 16, 14, 16, 18, 16, 22, 10, 14, 12, 40]);
modesSheet.getRange(`M7:M${6 + modeRows.length}`).format.numberFormat = "yyyy-mm-dd";
modesSheet.getRange(`O7:O${6 + modeRows.length}`).format.wrapText = true;

const reqSheet = addDataSheet(workbook, "李醫師能力要求", "李侑津醫師能力要求 V1", "治療專屬技能已建；共通技能先列為待確認，不會直接視為已核定的排班門檻。", ["要求代碼", "模式代碼", "治療項目", "療程階段", "技能代碼", "人員角色", "必要性", "獨立最低評等", "條件排最低評等", "支援規則", "確認狀態", "版本"], requirementRows, "LiModeRequirements", [34, 22, 18, 16, 26, 16, 14, 16, 18, 46, 14, 10]);
reqSheet.getRange(`J7:J${6 + requirementRows.length}`).format.wrapText = true;

const employeeSheet = addDataSheet(workbook, "試行員工主檔", "試行員工主檔", "聘用型態依來源表正職／兼職區段匯入；能力路徑、組別與主管尚待指定。", ["員工編號", "姓名", "聘用型態", "原表職級", "能力路徑", "主要培訓組", "日常主管", "在職狀態", "資料來源"], employeeRows, "PilotEmployees", [14, 16, 14, 14, 20, 18, 18, 14, 24]);
employeeSheet.getRange(`E7:G${6 + employeeRows.length}`).format.fill = colors.amber;

const abilitySheet = addDataSheet(workbook, "試行能力狀態", "李侑津醫師試行能力狀態", "從來源表建立初始能力基準；共通技能暫取李醫師區塊資料，仍需跨醫師同義項目整併與主管核定。", ["員工編號", "姓名", "技能代碼", "來源技能文字", "目前評等", "有效狀態", "來源類型", "基準日", "核定人", "核定日", "原表列號", "查找鍵"], abilityRows, "PilotAbilityStatus", [14, 16, 28, 34, 14, 16, 18, 14, 16, 14, 14, 34]);
abilitySheet.getRange(`H7:H${6 + abilityRows.length}`).format.numberFormat = "yyyy-mm-dd";
abilitySheet.getRange(`J7:J${6 + abilityRows.length}`).format.numberFormat = "yyyy-mm-dd";
abilitySheet.getRange(`I7:J${6 + abilityRows.length}`).format.fill = colors.amber;
abilitySheet.getRange(`E7:E${6 + abilityRows.length}`).dataValidation = { rule: { type: "list", values: ["未評估", "※", "△", "Ø", "◎"] } };

const familiaritySheet = addDataSheet(workbook, "試行熟悉度", "李侑津醫師跟診熟悉度試行匯入", "舊『跟診順暢度』僅作初步轉換，正式熟悉度仍由助理回報、主管核定。", ["員工編號", "姓名", "醫師", "來源符號", "初步熟悉度", "有效狀態", "轉換依據", "基準日", "核定人", "核定日", "查找鍵"], familiarityRows, "PilotFamiliarity", [14, 16, 18, 14, 22, 16, 42, 14, 16, 14, 34]);
familiaritySheet.getRange(`H7:H${6 + familiarityRows.length}`).format.numberFormat = "yyyy-mm-dd";
familiaritySheet.getRange(`J7:J${6 + familiarityRows.length}`).format.numberFormat = "yyyy-mm-dd";
familiaritySheet.getRange(`I7:J${6 + familiarityRows.length}`).format.fill = colors.amber;
familiaritySheet.getRange(`E7:E${6 + familiarityRows.length}`).dataValidation = { rule: { type: "list", values: ["未評估", "學習中", "可配合但需支援", "可獨立配合"] } };

const qualificationSheet = addDataSheet(workbook, "資格有效性", "半年複評與資格有效性試行資料", "低頻高風險技能不給寬限。RPD 印最終模因來源無獨立欄位，先列未建立。", ["員工編號", "姓名", "技能代碼", "目前評等", "資格狀態", "有效起日", "到期日", "寬限天數", "補考日", "寬限到期日", "備註", "查找鍵"], qualificationRows, "PilotQualifications", [14, 16, 28, 14, 18, 14, 14, 14, 14, 16, 44, 34]);
qualificationSheet.getRange(`F7:G${6 + qualificationRows.length}`).format.numberFormat = "yyyy-mm-dd";
qualificationSheet.getRange(`I7:J${6 + qualificationRows.length}`).format.numberFormat = "yyyy-mm-dd";
qualificationSheet.getRange(`I7:J${6 + qualificationRows.length}`).format.fill = colors.amber;
qualificationSheet.getRange(`K7:K${6 + qualificationRows.length}`).format.wrapText = true;

const primaryRequirements = requirementRows.filter((r) => r[5] === "主跟診");
const expandedRows = [];
for (const person of staff) {
  for (const req of primaryRequirements) {
    const [, modeId, treatment, stage, skillId, , requiredness, independentMin, conditionalMin, supportRule, confirmStatus] = req;
    const mode = modeRows.find((m) => m[0] === modeId);
    expandedRows.push([
      person.id,
      person.name,
      modeId,
      treatment,
      stage,
      mode?.[5] ?? "",
      skillId,
      requiredness,
      confirmStatus,
      independentMin,
      conditionalMin,
      "",
      "",
      "",
      "",
      "",
      supportRule,
    ]);
  }
}

const expandedSheet = addDataSheet(
  workbook,
  "適配要求展開",
  "排班適配要求展開",
  "每列代表員工×治療模式×技能要求。待確認的共通技能納入試算，但不會直接形成正式資格。",
  ["員工編號", "姓名", "模式代碼", "治療項目", "療程階段", "複雜度", "技能代碼", "必要性", "要求確認狀態", "獨立最低評等", "條件排最低評等", "目前評等", "能力有效狀態", "技能判定", "跟診熟悉度", "熟悉度有效狀態", "支援規則"],
  expandedRows,
  "FitRequirementExpansion",
  [14, 16, 22, 18, 16, 16, 28, 14, 16, 16, 18, 14, 18, 16, 22, 18, 46],
);
const expandedLastRow = 6 + expandedRows.length;
const expandedFormulaRows = [];
for (let row = 7; row <= expandedLastRow; row++) {
  expandedFormulaRows.push([
    `=_xlfn.XLOOKUP($A${row}&"|"&$G${row},'試行能力狀態'!$L$7:$L$258,'試行能力狀態'!$E$7:$E$258,"未評估",0)`,
    `=_xlfn.XLOOKUP($A${row}&"|"&$G${row},'試行能力狀態'!$L$7:$L$258,'試行能力狀態'!$F$7:$F$258,"未建立",0)`,
    `=IF($L${row}="◎","符合獨立",IF($L${row}="Ø","符合條件","不符合"))`,
    `=_xlfn.XLOOKUP($A${row}&"|李侑津醫師",'試行熟悉度'!$K$7:$K$20,'試行熟悉度'!$E$7:$E$20,"未評估",0)`,
    `=_xlfn.XLOOKUP($A${row}&"|李侑津醫師",'試行熟悉度'!$K$7:$K$20,'試行熟悉度'!$F$7:$F$20,"未建立",0)`,
  ]);
}
expandedSheet.getRange(`L7:P${expandedLastRow}`).formulas = expandedFormulaRows;
expandedSheet.getRange(`L7:P${expandedLastRow}`).format.fill = colors.paleBlue;
expandedSheet.getRange(`Q7:Q${expandedLastRow}`).format.wrapText = true;
expandedSheet.freezePanes.freezeColumns(2);

const summaryRows = [];
for (const person of staff) {
  for (const mode of modeRows) {
    const [modeId, , group, treatment, stage, complexity, , , fixedSupport, supportMinutes] = mode;
    summaryRows.push([
      person.id,
      person.name,
      modeId,
      group,
      treatment,
      stage,
      complexity,
      modeToSkill[modeId],
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      fixedSupport,
      supportMinutes,
      "",
      "",
      "",
    ]);
  }
}

const fitSheet = addDataSheet(
  workbook,
  "排班適配試算",
  "員工 × 李侑津醫師治療模式適配試算",
  "試算先採用三項待確認共通技能；正式狀態仍受主管核定、資格有效性、班次支援容量與時間衝突限制。",
  ["員工編號", "姓名", "模式代碼", "模式群組", "治療項目", "療程階段", "複雜度", "主技能代碼", "要求技能數", "待確認要求數", "低於 Ø 項數", "Ø 項數", "Ø 比例", "跟診熟悉度", "資料核定狀態", "資格狀態", "固定短時支援人數", "預設支援分鐘", "能力試算結果", "支援需求", "正式狀態／待辦"],
  summaryRows,
  "FitSimulation",
  [14, 16, 22, 18, 18, 16, 16, 28, 14, 16, 14, 12, 12, 22, 18, 18, 18, 16, 22, 42, 34],
);
const fitLastRow = 6 + summaryRows.length;
const fitFormulaRows = [];
for (let row = 7; row <= fitLastRow; row++) {
  fitFormulaRows.push([
    `=COUNTIFS('適配要求展開'!$A$7:$A$${expandedLastRow},$A${row},'適配要求展開'!$C$7:$C$${expandedLastRow},$C${row})`,
    `=COUNTIFS('適配要求展開'!$A$7:$A$${expandedLastRow},$A${row},'適配要求展開'!$C$7:$C$${expandedLastRow},$C${row},'適配要求展開'!$I$7:$I$${expandedLastRow},"待確認")`,
    `=COUNTIFS('適配要求展開'!$A$7:$A$${expandedLastRow},$A${row},'適配要求展開'!$C$7:$C$${expandedLastRow},$C${row},'適配要求展開'!$N$7:$N$${expandedLastRow},"不符合")`,
    `=COUNTIFS('適配要求展開'!$A$7:$A$${expandedLastRow},$A${row},'適配要求展開'!$C$7:$C$${expandedLastRow},$C${row},'適配要求展開'!$L$7:$L$${expandedLastRow},"Ø")`,
    `=IF($I${row}=0,"n.a.",$L${row}/$I${row})`,
    `=_xlfn.XLOOKUP($A${row}&"|李侑津醫師",'試行熟悉度'!$K$7:$K$20,'試行熟悉度'!$E$7:$E$20,"未評估",0)`,
    `=IF(OR(COUNTIFS('適配要求展開'!$A$7:$A$${expandedLastRow},$A${row},'適配要求展開'!$C$7:$C$${expandedLastRow},$C${row},'適配要求展開'!$M$7:$M$${expandedLastRow},"<>已核定")>0,_xlfn.XLOOKUP($A${row}&"|李侑津醫師",'試行熟悉度'!$K$7:$K$20,'試行熟悉度'!$F$7:$F$20,"未建立",0)<>"已核定"),"待主管核定","已核定")`,
    `=IF($C${row}="LJT-RPD-FINAL","支援者另判",IF($G${row}="高複雜度",_xlfn.XLOOKUP($A${row}&"|"&$H${row},'資格有效性'!$L$7:$L$62,'資格有效性'!$E$7:$E$62,"未建立",0),"不需複評"))`,
    `=IF($K${row}>0,"不可正式排",IF(OR($N${row}="未評估",$N${row}="學習中"),"不可正式排",IF(AND($L${row}=0,$N${row}="可獨立配合"),"初步可獨立",IF(AND($L${row}<=3,$M${row}<=1/3,OR($N${row}="可獨立配合",$N${row}="可配合但需支援")),"初步可條件排","不可正式排"))))`,
    `=IF($C${row}="LJT-RPD-FINAL","固定短時支援 1 人／30 分鐘",IF($S${row}="初步可條件排",IF($G${row}="高複雜度","完整支援者 1:1（占 2 名額）","一般支援 1 名額"),"無"))`,
    `=IF($J${row}>0,"待確認共通技能門檻",IF($O${row}<>"已核定","待主管核定",IF(AND($G${row}="高複雜度",$P${row}<>"有效"),"資格未有效",$S${row})))`,
  ]);
}
fitSheet.getRange(`I7:O${fitLastRow}`).formulas = fitFormulaRows.map((r) => r.slice(0, 7));
fitSheet.getRange(`P7:P${fitLastRow}`).formulas = fitFormulaRows.map((r) => [r[7]]);
fitSheet.getRange(`S7:U${fitLastRow}`).formulas = fitFormulaRows.map((r) => r.slice(8));
fitSheet.getRange(`M7:M${fitLastRow}`).format.numberFormat = "0.0%";
fitSheet.getRange(`I7:U${fitLastRow}`).format.fill = colors.paleBlue;
fitSheet.getRange(`T7:U${fitLastRow}`).format.wrapText = true;
fitSheet.freezePanes.freezeColumns(2);
fitSheet.getRange(`S7:S${fitLastRow}`).conditionalFormats.add("containsText", { text: "初步可獨立", format: { fill: colors.green, font: { color: "#375623", bold: true } } });
fitSheet.getRange(`S7:S${fitLastRow}`).conditionalFormats.add("containsText", { text: "初步可條件排", format: { fill: colors.amber, font: { color: "#7F6000", bold: true } } });
fitSheet.getRange(`S7:S${fitLastRow}`).conditionalFormats.add("containsText", { text: "不可正式排", format: { fill: colors.red, font: { color: "#9C0006", bold: true } } });
fitSheet.getRange(`U7:U${fitLastRow}`).conditionalFormats.add("containsText", { text: "待", format: { fill: colors.amber, font: { color: "#7F6000", bold: true } } });

const supporterRows = staff.map((person) => [person.id, person.name, "LJT-RPD-FINAL", "", "", "", "否", "", ""]);
const supporterSheet = addDataSheet(
  workbook,
  "RPD支援者候選",
  "RPD 印最終模短時支援者候選",
  "此項支援不要求李侑津醫師完整跟診熟悉度；技能須為 ◎、能力已核定且資格有效。",
  ["員工編號", "姓名", "技能代碼", "目前評等", "能力有效狀態", "資格狀態", "需李醫師熟悉度", "候選結果", "原因"],
  supporterRows,
  "RpdSupportCandidates",
  [14, 16, 28, 14, 18, 18, 20, 22, 42],
);
const supporterLastRow = 6 + supporterRows.length;
const supporterFormulaRows = [];
for (let row = 7; row <= supporterLastRow; row++) {
  supporterFormulaRows.push([
    `=_xlfn.XLOOKUP($A${row}&"|LJT-RPD-FINAL",'試行能力狀態'!$L$7:$L$258,'試行能力狀態'!$E$7:$E$258,"未評估",0)`,
    `=_xlfn.XLOOKUP($A${row}&"|LJT-RPD-FINAL",'試行能力狀態'!$L$7:$L$258,'試行能力狀態'!$F$7:$F$258,"未建立",0)`,
    `=_xlfn.XLOOKUP($A${row}&"|LJT-RPD-FINAL",'資格有效性'!$L$7:$L$62,'資格有效性'!$E$7:$E$62,"未建立",0)`,
    `=IF(AND($D${row}="◎",$E${row}="已核定",$F${row}="有效"),"可列短時支援者","尚不可列入")`,
    `=IF($D${row}<>"◎","技能未達 ◎",IF($E${row}<>"已核定","能力尚未核定",IF($F${row}<>"有效","資格未有效","")))`,
  ]);
}
supporterSheet.getRange(`D7:F${supporterLastRow}`).formulas = supporterFormulaRows.map((r) => r.slice(0, 3));
supporterSheet.getRange(`H7:I${supporterLastRow}`).formulas = supporterFormulaRows.map((r) => r.slice(3));
supporterSheet.getRange(`D7:I${supporterLastRow}`).format.fill = colors.paleBlue;
supporterSheet.getRange(`I7:I${supporterLastRow}`).format.wrapText = true;
supporterSheet.getRange(`H7:H${supporterLastRow}`).conditionalFormats.add("containsText", { text: "可列短時支援者", format: { fill: colors.green, font: { color: "#375623", bold: true } } });
supporterSheet.getRange(`H7:H${supporterLastRow}`).conditionalFormats.add("containsText", { text: "尚不可列入", format: { fill: colors.red, font: { color: "#9C0006", bold: true } } });

const overview = workbook.worksheets.add("續作總覽");
overview.showGridLines = false;
styleTitle(overview, "J", "診所助理能力模型續作總覽", "已保留原始三張工作表；本次新增第一版最小資料結構與李侑津醫師試行資料。未經主管核定的轉換資料不直接視為可排班。 ");
overview.getRange("A6:D6").values = [["建置項目", "目前數量", "狀態", "說明"]];
overview.getRange("A7:A12").values = [["最小邏輯資料表"], ["試行技能"], ["治療模式／階段"], ["能力要求"], ["試行員工"], ["初始能力紀錄"]];
overview.getRange("B7:B12").formulas = [["=COUNTA('資料字典'!A7:A24)"], ["=COUNTA('技能主檔_V1'!A7:A100)"], ["=COUNTA('李醫師治療模式'!A7:A100)"], ["=COUNTA('李醫師能力要求'!A7:A200)"], ["=COUNTA('試行員工主檔'!A7:A100)"], ["=COUNTA('試行能力狀態'!A7:A500)"]];
overview.getRange("C7:C12").values = [["完成"], ["試行"], ["試行"], ["部分待確認"], ["待主管補充"], ["待主管核定"]];
overview.getRange("D7:D12").values = [["18 張表已定義最小欄位"], ["含共通技能、高複雜度與 RPD 印最終模"], ["13 個治療／療程階段"], ["治療專屬要求已建，共通技能門檻待逐項確認"], ["能力路徑、組別與主管尚未指定"], ["保留來源文字與原表列號"]];
overview.getRange("A13:D13").values = [["員工×治療模式試算", null, "候選結果", "182 組能力候選；正式狀態仍受規則核定與班次支援限制"]];
overview.getRange("B13").formulas = [["=COUNTA('排班適配試算'!A7:A300)"]];
overview.getRange("A6:D13").format.font = { name: fontName, size: 10, color: colors.dark };
overview.getRange("A6:D6").format = { fill: colors.navy, font: { name: fontName, size: 10, bold: true, color: "#FFFFFF" }, horizontalAlignment: "center", verticalAlignment: "center" };
overview.getRange("A7:D13").format.borders = { insideHorizontal: { style: "thin", color: "#DCE6EB" }, bottom: { style: "thin", color: colors.line } };
overview.getRange("A7:A13").format.font = { name: fontName, size: 10, bold: true, color: colors.dark };
overview.getRange("B7:B13").format.numberFormat = "#,##0";
overview.getRange("A15:D15").values = [["待確認事項", "影響", "建議負責人", "目前狀態"]];
overview.getRange("A16:D21").values = [
  ["逐模式確認病歷、健保與 X 光紀錄是否為必備", "影響正式排班門檻", "助理長／各組主管", "待確認"],
  ["核定由舊跟診順暢度轉換的熟悉度", "影響可獨立配合", "助理主管", "待確認"],
  ["補建 RPD 印最終模的獨立考核結果", "影響短時支援者資格", "助理主管", "待確認"],
  ["指定正職／兼職能力路徑、培訓組與主管", "影響培訓與權限", "助理長", "待確認"],
  ["匯入正職流動三級、兼職流動六級", "影響流動崗位判定", "助理長", "第二階段"],
  ["匯入 Lv.1～Lv.10 正式職級矩陣", "影響升級候選提示", "助理長", "第二階段"],
];
overview.getRange("A15:D15").format = { fill: colors.navy, font: { name: fontName, size: 10, bold: true, color: "#FFFFFF" }, horizontalAlignment: "center", verticalAlignment: "center" };
overview.getRange("A16:D21").format.font = { name: fontName, size: 10, color: colors.dark };
overview.getRange("A16:D21").format.borders = { insideHorizontal: { style: "thin", color: "#DCE6EB" }, bottom: { style: "thin", color: colors.line } };
overview.getRange("D16:D19").format.fill = colors.amber;
overview.getRange("D20:D21").format.fill = colors.gray;
overview.getRange("A:A").format.columnWidth = 42;
overview.getRange("B:B").format.columnWidth = 16;
overview.getRange("C:C").format.columnWidth = 22;
overview.getRange("D:D").format.columnWidth = 54;
overview.freezePanes.freezeRows(6);
overview.tabColor = colors.navy;
dictionary.tabColor = "#4F81BD";
settings.tabColor = "#4F81BD";

for (const sheet of [skillsSheet, modesSheet, reqSheet, employeeSheet, abilitySheet, familiaritySheet, qualificationSheet, expandedSheet]) {
  sheet.tabColor = "#9BBB59";
}
fitSheet.tabColor = colors.navy;
supporterSheet.tabColor = "#70AD47";

workbook.recalculate();
await fs.mkdir(outputDir, { recursive: true });
await fs.mkdir(previewDir, { recursive: true });

const checks = [
  ["續作總覽", "A1:D22"],
  ["資料字典", "A1:F24"],
  ["模型設定", "A1:E24"],
  ["技能主檔_V1", `A1:K${6 + skillRows.length}`],
  ["李醫師治療模式", `A1:O${6 + modeRows.length}`],
  ["李醫師能力要求", "A1:L26"],
  ["試行員工主檔", `A1:I${6 + employeeRows.length}`],
  ["試行能力狀態", "A1:L30"],
  ["試行熟悉度", `A1:K${6 + familiarityRows.length}`],
  ["資格有效性", "A1:L28"],
  ["適配要求展開", "A1:Q25"],
  ["排班適配試算", "A1:U28"],
  ["RPD支援者候選", `A1:I${6 + supporterRows.length}`],
];
for (const [sheetName, range] of checks) {
  const preview = await workbook.render({ sheetName, range, scale: 1, format: "png" });
  await fs.writeFile(`${previewDir}/${sheetName}.png`, new Uint8Array(await preview.arrayBuffer()));
}

const inspect = await workbook.inspect({ kind: "table", range: "續作總覽!A6:D21", include: "values,formulas", tableMaxRows: 30, tableMaxCols: 8, maxChars: 12000 });
console.log(inspect.ndjson);
const errors = await workbook.inspect({ kind: "match", searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!|#SPILL!|#CALC!", options: { useRegex: true, maxResults: 300 }, maxChars: 12000 });
console.log(errors.ndjson);

const output = await SpreadsheetFile.exportXlsx(workbook);
await output.save(outputPath);
console.log(`SAVED ${outputPath}`);

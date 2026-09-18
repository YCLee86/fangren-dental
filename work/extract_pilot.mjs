import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const sourcePath = "../inputs/assistant_skill_matrix.xlsx";
const workbook = await SpreadsheetFile.importXlsx(await FileBlob.load(sourcePath));
const sheet = workbook.worksheets.getItem("技能明細");
const rows = sheet.getRange("A6:I1644").values;
const headers = rows[0];
const data = rows.slice(1).map((row) => Object.fromEntries(headers.map((h, i) => [String(h), row[i]])));
const target = data.filter((r) => r["工作區塊"] === "李侑津醫師");
const skills = [...new Set(target.map((r) => `${r["分類"] ?? ""}|${r["技能項目"] ?? ""}`))];
const staff = [...new Set(target.map((r) => `${r["員工編號"]}|${r["姓名"]}|${r["等級"]}`))];
console.log(JSON.stringify({ skills, staff, sample: target.slice(0, 40) }, null, 2));

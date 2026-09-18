import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const path = "../outputs/clinic-assistant-model/assistant_skill_matrix_v1_pilot.xlsx";
const previewDir = "./skill-mapping-before";
const wb = await SpreadsheetFile.importXlsx(await FileBlob.load(path));
const details = wb.worksheets.getItem("技能明細").getRange("A7:I1644").values;

const clean = (value) => String(value ?? "").replace(/[\r\n\t]+/g, " ").replace(/\s+/g, " ").trim();
const normalize = (value) => clean(value)
  .replace(/\s*X\s*光\s*/gi, "X光")
  .replace(/\s*([()（）/+、,，])\s*/g, "$1")
  .replace(/crown/gi, "crown")
  .replace(/pano/gi, "PANO")
  .replace(/pa\b/gi, "PA")
  .toLowerCase();

const bySource = new Map();
for (const row of details) {
  const employeeId = clean(row[0]);
  const block = clean(row[3]);
  const category = clean(row[4]);
  const skill = clean(row[5]);
  if (!employeeId || !skill) continue;
  const key = `${block}|${category}|${skill}`;
  if (!bySource.has(key)) bySource.set(key, { block, category, skill, employees: new Set(), rows: new Set() });
  const rec = bySource.get(key);
  rec.employees.add(employeeId);
  if (row[8] != null) rec.rows.add(row[8]);
}

const normalizedGroups = new Map();
for (const rec of bySource.values()) {
  const key = normalize(rec.skill);
  if (!normalizedGroups.has(key)) normalizedGroups.set(key, []);
  normalizedGroups.get(key).push(rec);
}

const duplicateGroups = [...normalizedGroups.entries()]
  .filter(([, recs]) => new Set(recs.map((r) => r.skill)).size > 1)
  .map(([key, recs]) => ({ normalized: key, variants: [...new Set(recs.map((r) => r.skill))], contexts: recs.map((r) => `${r.block}/${r.category}`) }));

console.log(JSON.stringify({ sourceCombinations: bySource.size, normalizedNames: normalizedGroups.size, duplicateGroups }, null, 2));
console.log(JSON.stringify([...normalizedGroups.entries()].map(([normalized, recs]) => ({
  normalized,
  variants: [...new Set(recs.map((r) => r.skill))],
  contexts: recs.map((r) => ({ block: r.block, category: r.category, employees: r.employees.size })),
})), null, 2));
for (const range of ["技能主檔_V1!A1:K24", "資料字典!A6:F12", "主管工作台!A20:E26", "續作總覽!A14:D30"]) {
  console.log((await wb.inspect({ kind: "table", range, include: "values,formulas", tableMaxRows: 32, tableMaxCols: 14, maxChars: 16000 })).ndjson);
}

await fs.mkdir(previewDir, { recursive: true });
for (const [name, range] of [["技能主檔_V1", "A1:K24"], ["主管工作台", "A20:E26"]]) {
  const image = await wb.render({ sheetName: name, range, scale: 1.25, format: "png" });
  await fs.writeFile(`${previewDir}/${name}.png`, new Uint8Array(await image.arrayBuffer()));
}

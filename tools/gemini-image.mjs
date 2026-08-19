#!/usr/bin/env node
/* tools/gemini-image.mjs — 直接呼叫 Gemini 產圖，不必再手動貼到網頁上
   ------------------------------------------------------------------
   為什麼有這支：
     原本的流程是「Claude 寫提示詞 → 使用者複製 → 貼到 Gemini → 看圖 →
     回報問題 → Claude 改提示詞 → 再貼一次」。每一輪都要人在中間轉手，
     而且 Claude 看不到自己產出的圖，只能靠使用者形容。
     這支把中間那一段拿掉：提示詞寫進檔案 → 跑這支 → 圖直接落到硬碟上，
     Claude 自己看得到、自己改、自己再跑。使用者只要看最後幾張。

   零 npm 依賴（同全站規則）—— Node 20+ 內建的 fetch 就夠了。

   金鑰（三個地方擇一，由上往下找）：
     1. 環境變數 GEMINI_API_KEY
     2. 環境變數 GOOGLE_API_KEY
     3. repo 根目錄的 .gemini-key 檔（純文字一行，已進 .gitignore）
   ⚠ 這個 repo 是 public，金鑰絕對不要 commit。

   用法：
     node tools/gemini-image.mjs --check                  金鑰通不通、有哪些產圖模型
     node tools/gemini-image.mjs prompts/perio.txt        產一張
     node tools/gemini-image.mjs prompts/perio.txt --n 3  同一份提示詞產三張挑
     node tools/gemini-image.mjs prompts/perio.txt --ref assets/hero-arch-photo-1600.jpg
                                                         餵參考圖（ILLUSTRATION.md 第 19 條：
                                                         能餵參考圖就餵，比文字描述有效）
   常用旗標：
     --out <路徑>    輸出檔名（預設 gen/<提示詞檔名>-<序號>.png）
     --n <數>        產幾張（預設 1）
     --ar <比例>     長寬比，預設 16:9（文章 HERO 就是這個）
     --size 1K|2K|4K 輸出解析度，只有 Pro 系列吃得到
     --model <id>    指定模型（預設見下面 DEFAULT_MODEL）
     --ref <圖>      參考圖，可重複給好幾張

   ⚠ 每產一張圖，會在旁邊存一份 .prompt.txt，逐字記下當次用的提示詞。
     這是 ILLUSTRATION.md 第 19 條要求的：定稿的提示詞要留在 repo 裡，
     改圖要從「定稿那份」改，不要從零重寫。
*/

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const API = "https://generativelanguage.googleapis.com/v1beta";

/* 預設模型。Google 的產圖模型改名很勤，所以 --check 會把你的金鑰
   實際看得到的清單印出來，對不上就用 --model 指定。 */
const DEFAULT_MODEL = process.env.GEMINI_IMAGE_MODEL || "gemini-2.5-flash-image";

/* ---------- 金鑰 ---------- */

const readKey = () => {
  if (process.env.GEMINI_API_KEY) return process.env.GEMINI_API_KEY.trim();
  if (process.env.GOOGLE_API_KEY) return process.env.GOOGLE_API_KEY.trim();
  const f = path.join(ROOT, ".gemini-key");
  if (fs.existsSync(f)) {
    const k = fs.readFileSync(f, "utf8").trim();
    if (k) return k;
  }
  console.error(`
找不到 API 金鑰。三個地方擇一：

  1. 環境變數        export GEMINI_API_KEY=xxxxx
  2. 雲端 session    在 claude.ai/code 的環境設定裡加一個 GEMINI_API_KEY
  3. 本機檔案        把金鑰貼進 ${path.join(ROOT, ".gemini-key")}（一行就好）

金鑰去這裡拿（免費申請）： https://aistudio.google.com/apikey
⚠ 這個 repo 是 public，.gemini-key 已經在 .gitignore 裡，不要改成別的檔名。
`);
  process.exit(1);
};

/* ---------- 參數 ---------- */

const parseArgs = (argv) => {
  const o = { refs: [], n: 1, ar: "16:9", model: DEFAULT_MODEL, positional: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--check" || a === "--list") o.check = true;
    else if (a === "--out") o.out = argv[++i];
    else if (a === "--n") o.n = Math.max(1, parseInt(argv[++i], 10) || 1);
    else if (a === "--ar") o.ar = argv[++i];
    else if (a === "--size") o.size = String(argv[++i]).toUpperCase();
    else if (a === "--model") o.model = argv[++i];
    else if (a === "--ref") o.refs.push(argv[++i]);
    else if (a.startsWith("--")) { console.error(`不認得的旗標：${a}`); process.exit(1); }
    else o.positional.push(a);
  }
  return o;
};

/* ---------- 小工具 ---------- */

const mimeOf = (p) => {
  const e = path.extname(p).toLowerCase();
  if (e === ".png") return "image/png";
  if (e === ".webp") return "image/webp";
  if (e === ".gif") return "image/gif";
  return "image/jpeg";
};

const extOf = (mime) =>
  mime === "image/png" ? ".png" : mime === "image/webp" ? ".webp" : ".jpg";

/* PNG／JPEG 檔頭讀寬高（沒有 sharp 可用，同 build.mjs 的做法） */
const imageSize = (buf) => {
  if (buf.length > 24 && buf.readUInt32BE(0) === 0x89504e47)
    return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
  let i = 2;
  while (i < buf.length - 9) {
    if (buf[i] !== 0xff) { i++; continue; }
    const m = buf[i + 1];
    if (m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc)
      return { w: buf.readUInt16BE(i + 7), h: buf.readUInt16BE(i + 5) };
    i += 2 + buf.readUInt16BE(i + 2);
  }
  return null;
};

/* ---------- 呼叫 API ---------- */

const call = async (key, model, body) => {
  const r = await fetch(`${API}/models/${model}:generateContent`, {
    method: "POST",
    headers: { "x-goog-api-key": key, "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  const text = await r.text();
  let json = null;
  try { json = JSON.parse(text); } catch { /* 非 JSON，原樣往上丟 */ }
  if (!r.ok) {
    const msg = json?.error?.message || text.slice(0, 500);
    const err = new Error(msg);
    err.status = r.status;
    throw err;
  }
  return json;
};

/* responseModalities 與 imageConfig 各家模型吃的不一樣，
   被拒絕就退一階再試，不要讓使用者自己猜。 */
const generate = async (key, opt, parts) => {
  const variants = [];
  const cfgs = [
    { responseModalities: ["IMAGE"], imageConfig: { aspectRatio: opt.ar, ...(opt.size ? { imageSize: opt.size } : {}) } },
    { responseModalities: ["TEXT", "IMAGE"], imageConfig: { aspectRatio: opt.ar } },
    { responseModalities: ["TEXT", "IMAGE"] },
    {},
  ];
  let lastErr = null;
  for (const generationConfig of cfgs) {
    try {
      const body = { contents: [{ role: "user", parts }] };
      if (Object.keys(generationConfig).length) body.generationConfig = generationConfig;
      return await call(key, opt.model, body);
    } catch (e) {
      lastErr = e;
      // 400 有兩種：一種是「這個模型不吃這個欄位」，退一階再試就好；
      // 另一種是金鑰壞了／模型不存在／配額用完 —— 那個退幾階都一樣，直接放棄。
      const hopeless = /API key|permission|not found|quota|RESOURCE_EXHAUSTED|billing/i;
      if (e.status !== 400 || hopeless.test(e.message)) throw e;
      variants.push(e.message);
    }
  }
  lastErr.tried = variants;
  throw lastErr;
};

/* ---------- --check ---------- */

const check = async (key) => {
  const r = await fetch(`${API}/models?pageSize=200`, { headers: { "x-goog-api-key": key } });
  const j = await r.json();
  if (!r.ok) {
    console.error(`金鑰不通（HTTP ${r.status}）：${j?.error?.message || ""}`);
    process.exit(1);
  }
  console.log("✅ 金鑰可用。\n");
  const all = j.models || [];
  const img = all.filter(
    (m) => /image/i.test(m.name) || /image/i.test(m.description || "")
  );
  console.log(`會產圖的模型（${img.length} 個，--model 用左邊那個 id）：`);
  for (const m of img) {
    const id = m.name.replace(/^models\//, "");
    console.log(`  ${id.padEnd(38)} ${m.displayName || ""}`);
  }
  console.log(`\n目前預設：${DEFAULT_MODEL}`);
  if (!img.some((m) => m.name.replace(/^models\//, "") === DEFAULT_MODEL))
    console.log(`⚠ 預設那個不在清單裡，跑的時候要自己帶 --model`);
  console.log(`（全部 ${all.length} 個模型，這裡只列產圖的）`);
};

/* ---------- 主流程 ---------- */

const main = async () => {
  const opt = parseArgs(process.argv.slice(2));
  const key = readKey();

  if (opt.check) return check(key);

  const promptFile = opt.positional[0];
  if (!promptFile) {
    console.error("用法：node tools/gemini-image.mjs <提示詞檔> [旗標]\n" +
                  "      node tools/gemini-image.mjs --check\n" +
                  "詳見這支檔案開頭的註解。");
    process.exit(1);
  }
  if (!fs.existsSync(promptFile)) {
    console.error(`找不到提示詞檔：${promptFile}`);
    process.exit(1);
  }
  const prompt = fs.readFileSync(promptFile, "utf8").trim();
  if (!prompt) { console.error(`提示詞檔是空的：${promptFile}`); process.exit(1); }

  /* 參考圖（ILLUSTRATION.md 第 19 條：能餵就餵） */
  const parts = [{ text: prompt }];
  for (const ref of opt.refs) {
    if (!fs.existsSync(ref)) { console.error(`找不到參考圖：${ref}`); process.exit(1); }
    const buf = fs.readFileSync(ref);
    parts.push({ inline_data: { mime_type: mimeOf(ref), data: buf.toString("base64") } });
    const s = imageSize(buf);
    console.log(`參考圖：${ref}${s ? `（${s.w}×${s.h}）` : ""}`);
  }

  const base = opt.out
    ? opt.out.replace(/\.(png|jpg|jpeg|webp)$/i, "")
    : path.join("gen", path.basename(promptFile).replace(/\.[^.]+$/, ""));
  fs.mkdirSync(path.dirname(path.resolve(ROOT, base)), { recursive: true });

  console.log(`模型：${opt.model}　比例：${opt.ar}${opt.size ? `　解析度：${opt.size}` : ""}　張數：${opt.n}`);
  console.log(`提示詞：${promptFile}（${prompt.length} 字）\n`);

  const written = [];
  for (let i = 1; i <= opt.n; i++) {
    process.stdout.write(`[${i}/${opt.n}] 產圖中… `);
    let res;
    try {
      res = await generate(key, opt, parts);
    } catch (e) {
      console.log("失敗");
      console.error(`\n${e.message}`);
      if (e.tried?.length > 1) console.error(`（退階重試也失敗，試過 ${e.tried.length} 種請求格式）`);
      if (/quota|RESOURCE_EXHAUSTED/i.test(e.message))
        console.error("看起來是配額用完了 —— 免費層每天有上限，等一下或到 Google Cloud 開帳單。");
      process.exit(1);
    }

    const cand = res.candidates?.[0];
    const outParts = cand?.content?.parts || [];
    const imgPart = outParts.find((p) => p.inlineData || p.inline_data);
    const note = outParts.map((p) => p.text).filter(Boolean).join("\n").trim();

    if (!imgPart) {
      console.log("沒有圖");
      const reason = cand?.finishReason || res.promptFeedback?.blockReason || "";
      console.error(`\n模型沒有回圖${reason ? `（finishReason: ${reason}）` : ""}。`);
      if (note) console.error(`它說：${note}`);
      if (/SAFETY|PROHIBITED|BLOCK/i.test(reason))
        console.error("被安全過濾擋掉了 —— 通常是提示詞裡的醫療／人體描述踩到，換個講法再試。");
      process.exit(1);
    }

    const inline = imgPart.inlineData || imgPart.inline_data;
    const mime = inline.mimeType || inline.mime_type || "image/png";
    const buf = Buffer.from(inline.data, "base64");
    const suffix = opt.n > 1 ? `-${i}` : "";
    const out = path.resolve(ROOT, base + suffix + extOf(mime));
    fs.writeFileSync(out, buf);

    const s = imageSize(buf);
    console.log(`${path.relative(ROOT, out)}　${s ? `${s.w}×${s.h}　` : ""}${(buf.length / 1024).toFixed(0)}KB`);
    if (note) console.log(`      模型附註：${note.slice(0, 200)}`);
    written.push(out);

    /* 逐字存一份當次用的提示詞（ILLUSTRATION.md 第 19 條） */
    fs.writeFileSync(
      out.replace(/\.[^.]+$/, ".prompt.txt"),
      `# 模型：${opt.model}\n# 比例：${opt.ar}${opt.size ? `　解析度：${opt.size}` : ""}\n` +
        `# 提示詞來源：${promptFile}\n` +
        (opt.refs.length ? `# 參考圖：${opt.refs.join(", ")}\n` : "") +
        `\n${prompt}\n`,
      "utf8"
    );
  }

  console.log(`\n完成，${written.length} 張。提示詞已存成同名的 .prompt.txt。`);
};

main().catch((e) => { console.error(e); process.exit(1); });

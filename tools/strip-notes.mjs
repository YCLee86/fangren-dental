#!/usr/bin/env node
/* =============================================================================
   把設計註解從「要送給訪客的那一份」剝掉
   -----------------------------------------------------------------------------
   這一站的決策紀錄是寫在原始碼註解裡的（CLAUDE.md 一路都這樣要求），
   但 index.html 這種檔案**自己就是送給訪客的東西** —— 所以在 2026-08-13 之前，
   每一個開 fangren.net 的人都會連著 165 KB 的中文推導一起下載。
   實測：首頁 gzip 94.2 KB，其中 71.3 KB（76%）是註解。

   解法是**只剝 _site/ 裡的複本，原始碼一個字都不動**：
   ・註解留在版控裡，繼續當唯一的決策紀錄，Claude 開專案就讀得到
   ・訪客拿到的那一份完全看不到

   ⚠ 這裡**不是** minifier。只拿掉註解，不改任何一個位元組的程式碼、
   不重排、不縮短名稱、不合併空白。理由是這站沒有測試，能驗證的只有
   「畫面一模一樣」，而剝註解可以逐項證明，改寫程式碼不行。

   ⚠ 為什麼用狀態機不用正規式：註解的起始記號在字串裡是合法內容。
   CSS 的 content 屬性裡可以放註解的起始記號、沒加引號的 url() 裡可以有
   兩條斜線、樣板字串裡可以有兩條斜線、JS 的正規式字面值裡可以有斜線接星號
   —— naive 的「抓一對註解記號」正規式會從這些地方切下去，而且**不會報錯**，
   只會讓後面整段悄悄失效（同 CLAUDE.md 第九節那條結束標籤的坑）。
   目前的原始碼裡這四種一個都沒有，但這支工具是要一直跑下去的。

   ⚠⚠ 寫這一支的時候當場踩到 CLAUDE.md 第九節第 8 點：這段說明原本把
   那幾個記號**逐字貼上來**，其中一個就是註解的結束記號，整段註解因此
   提早關掉、檔案在那一行語法錯誤。要指這些記號一律用文字描述。
   ============================================================================= */

import vm from "node:vm";

/* 被拿掉的註解先換成一個哨兵字元，最後再決定那一行要不要整行刪掉。
   選 NUL 是因為它不可能出現在原始碼裡（進版控前已逐檔確認過）。 */
const NUL = "\u0000";

/* build 產生的區塊標記一定要留 —— 它們是 tools/build.mjs 下次寫檔的定位點。
   _site/ 是拋棄式的產物，理論上不會再被 build 讀到，留著是為了日後有人
   改動 build 與 dist 的先後順序時不會無聲炸掉。 */
const KEEP_HTML = /(?:POSTS|SEO|RELATED):(?:START|END)/;

/* 這些字元後面接的 `/` 是正規式的開頭，不是除號 */
const REGEX_OK_CHARS = new Set("(,=:[!&|?{};+-*%~^<>".split(""));
const REGEX_OK_WORDS = new Set(["return", "typeof", "instanceof", "in", "of",
  "new", "delete", "void", "throw", "case", "do", "else", "yield", "await"]);

/* -----------------------------------------------------------------------------
   收尾：整行只剩哨兵的就把那一行刪掉，其餘的把哨兵拿掉就好

   跨行的區塊註解整段換成**一個**哨兵，所以註解前後的程式碼會併成一行 ——
   那正是瀏覽器眼中本來的樣子。
   ⚠ 除了「整行都是註解」那種情形以外，一個空白字元都不會動：
   樣板字串跨行時尾端的空白是內容的一部分，順手 trim 會改到畫面。
----------------------------------------------------------------------------- */
function tidy(text) {
  if (!text.includes(NUL)) return text;
  return text
    .split("\n")
    .filter((line) => !(line.includes(NUL) && line.split(NUL).join("").trim() === ""))
    .map((line) => line.split(NUL).join(""))
    .join("\n");
}

/* -----------------------------------------------------------------------------
   CSS
----------------------------------------------------------------------------- */
export function stripCss(src) {
  let out = "";
  let i = 0;
  const n = src.length;

  while (i < n) {
    const c = src[i];

    if (c === "/" && src[i + 1] === "*") {
      const end = src.indexOf("*/", i + 2);
      i = end === -1 ? n : end + 2;
      out += NUL;
      continue;
    }

    if (c === '"' || c === "'") {
      const quote = c;
      out += c;
      i++;
      while (i < n) {
        if (src[i] === "\\") { out += src.slice(i, i + 2); i += 2; continue; }
        out += src[i];
        const done = src[i] === quote || src[i] === "\n"; // CSS 字串不跨行
        i++;
        if (done) break;
      }
      continue;
    }

    /* 沒加引號的 url(…)：裡面的 /* 是網址的一部分，不是註解 */
    if ((c === "u" || c === "U") &&
        src.slice(i, i + 4).toLowerCase() === "url(" &&
        !/[\w-]/.test(src[i - 1] ?? "")) {
      const end = src.indexOf(")", i);
      const stop = end === -1 ? n : end + 1;
      out += src.slice(i, stop);
      i = stop;
      continue;
    }

    out += c;
    i++;
  }
  return tidy(out);
}

/* -----------------------------------------------------------------------------
   JavaScript

   要認得字串、樣板字串（含 ${} 巢狀）、正規式字面值三種「註解記號在裡面
   也不算註解」的地方。`/` 是正規式還是除號，靠前一個有意義的字元判斷 ——
   這是標準的啟發式，剝完之後每一段都會再過一次語法檢查（見 checkHtml）。
----------------------------------------------------------------------------- */
export function stripJs(src) {
  let out = "";
  let i = 0;
  const n = src.length;
  let prev = "";      // 上一個有意義的字元
  let prevWord = "";  // 上一個識別字（判斷 return / 這種情形）
  const stack = [];   // "tmpl" = 樣板字串本體、"expr" = 樣板的 ${} 裡面

  while (i < n) {
    const c = src[i];
    const c2 = src[i + 1];

    /* 樣板字串本體：只認 \ 跳脫、結尾的反引號、以及 ${ */
    if (stack[stack.length - 1] === "tmpl") {
      if (c === "\\") { out += src.slice(i, i + 2); i += 2; continue; }
      out += c;
      i++;
      if (c === "`") { stack.pop(); prev = "`"; prevWord = ""; continue; }
      if (c === "$" && c2 === "{") { out += "{"; i++; stack.push("expr"); prev = "{"; prevWord = ""; }
      continue;
    }

    if (c === "/" && c2 === "*") {
      const end = src.indexOf("*/", i + 2);
      i = end === -1 ? n : end + 2;
      out += NUL;
      continue;
    }

    if (c === "/" && c2 === "/") {
      const end = src.indexOf("\n", i);
      i = end === -1 ? n : end;
      out += NUL;
      continue;
    }

    if (c === '"' || c === "'") {
      const quote = c;
      out += c;
      i++;
      while (i < n) {
        if (src[i] === "\\") { out += src.slice(i, i + 2); i += 2; continue; }
        out += src[i];
        const done = src[i] === quote || src[i] === "\n";
        i++;
        if (done) break;
      }
      prev = quote;
      prevWord = "";
      continue;
    }

    if (c === "`") { out += c; i++; stack.push("tmpl"); continue; }

    if (c === "}" && stack[stack.length - 1] === "expr") {
      out += c; i++; stack.pop(); prev = "}"; prevWord = "";
      continue;
    }

    if (c === "/") {
      const isRegex = prev === "" || REGEX_OK_CHARS.has(prev) || REGEX_OK_WORDS.has(prevWord);
      if (isRegex) {
        out += c;
        i++;
        let inClass = false;
        while (i < n) {
          const r = src[i];
          if (r === "\\") { out += src.slice(i, i + 2); i += 2; continue; }
          out += r;
          i++;
          if (r === "\n") break;               // 沒收尾的正規式，當場停手
          if (r === "[") inClass = true;
          else if (r === "]") inClass = false;
          else if (r === "/" && !inClass) break;
        }
        while (i < n && /[a-z]/.test(src[i])) { out += src[i]; i++; }  // 旗標
        prev = "/";
        prevWord = "";
        continue;
      }
      out += c; i++; prev = "/"; prevWord = "";
      continue;
    }

    if (/[A-Za-z_$]/.test(c)) {
      let j = i;
      while (j < n && /[\w$]/.test(src[j])) j++;
      const word = src.slice(i, j);
      out += word;
      i = j;
      prev = word[word.length - 1];
      prevWord = word;
      continue;
    }

    if (!/\s/.test(c)) { prev = c; prevWord = ""; }
    out += c;
    i++;
  }
  return tidy(out);
}

/* -----------------------------------------------------------------------------
   HTML

   ⚠ 找 </style> / </script> 用的是**原始文字**的位置，不是剝完之後的 ——
   HTML 解析器就是純字串比對，註解裡寫了那幾個字它一樣會當成結束標籤
   （CLAUDE.md 第九節第 8 點）。這裡跟著瀏覽器走，才不會兩邊看到的邊界不一樣。

   ⚠ <script type="application/ld+json"> 不能當 JS 剝：JSON 本來就沒有註解，
   拿 JS 的規則去掃它只會有機會弄壞結構化資料，沒有任何好處。
----------------------------------------------------------------------------- */
export function stripHtml(src) {
  let out = "";
  let i = 0;
  const n = src.length;
  const lower = src.toLowerCase();

  while (i < n) {
    if (lower.startsWith("<!--", i)) {
      let end = lower.indexOf("-->", i + 4);
      end = end === -1 ? n : end + 3;
      const raw = src.slice(i, end);
      out += KEEP_HTML.test(raw) ? raw : NUL;
      i = end;
      continue;
    }

    /* <style> 與 <script> 的內容不是 HTML，要換另一套規則去剝。
       標籤名後面一定要接空白或 `>`，否則 <scripting> 這種也會被認成 <script>。 */
    const tag = lower.startsWith("<style", i) ? "style"
      : lower.startsWith("<script", i) ? "script"
        : null;
    if (tag && /[\s>]/.test(src[i + tag.length + 1] ?? "")) {
      const open = src.indexOf(">", i);
      if (open !== -1) {
        let close = lower.indexOf(`</${tag}`, open + 1);
        if (close === -1) close = n;

        const attrs = src.slice(i, open + 1);
        const body = src.slice(open + 1, close);
        let cooked = body;
        if (tag === "style") {
          cooked = stripCss(body);
        } else if (!/\ssrc\s*=/i.test(attrs) &&
                   !/type\s*=\s*["'][^"']*(?:json|template|text\/plain)/i.test(attrs)) {
          cooked = stripJs(body);
        }
        out += attrs + cooked;
        i = close;
        continue;
      }
    }

    out += src[i];
    i++;
  }
  return tidy(out);
}

/* -----------------------------------------------------------------------------
   驗證：剝完之後每一段內嵌 JS 都要還過得了語法檢查，CSS 大括號要成對。

   這兩項擋掉的是「狀態機切錯地方」那一類災難 —— 那種錯誤在瀏覽器裡
   不會報錯，只會讓後面整段悄悄失效，所以一定要在建置時就攔下來。
----------------------------------------------------------------------------- */
export function checkHtml(html, name) {
  const problems = [];
  const lower = html.toLowerCase();

  let i = 0;
  while ((i = lower.indexOf("<script", i)) !== -1) {
    const open = html.indexOf(">", i);
    if (open === -1) break;
    const attrs = html.slice(i, open + 1);
    let close = lower.indexOf("</script", open + 1);
    if (close === -1) close = html.length;
    const body = html.slice(open + 1, close);
    const isJs = !/\ssrc\s*=/i.test(attrs) &&
      !/type\s*=\s*["'][^"']*(?:json|template|text\/plain)/i.test(attrs);
    if (isJs && body.trim()) {
      try { new vm.Script(body); }
      catch (err) { problems.push(`${name}: 內嵌 script 剝完之後語法壞了 — ${err.message}`); }
    }
    if (/json/i.test(attrs)) {
      try { JSON.parse(body); }
      catch (err) { problems.push(`${name}: JSON-LD 壞了 — ${err.message}`); }
    }
    i = close + 1;
  }

  i = 0;
  while ((i = lower.indexOf("<style", i)) !== -1) {
    const open = html.indexOf(">", i);
    if (open === -1) break;
    let close = lower.indexOf("</style", open + 1);
    if (close === -1) close = html.length;
    problems.push(...checkCss(html.slice(open + 1, close), name));
    i = close + 1;
  }
  return problems;
}

export function checkCss(css, name) {
  let depth = 0;
  let min = 0;
  for (const ch of css.replace(/"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/g, '""')) {
    if (ch === "{") depth++;
    else if (ch === "}") { depth--; if (depth < min) min = depth; }
  }
  const problems = [];
  if (depth !== 0) problems.push(`${name}: CSS 大括號沒收乾淨（差 ${depth}）`);
  if (min < 0) problems.push(`${name}: CSS 出現多餘的 }`);
  return problems;
}

export function checkJs(js, name) {
  if (!js.trim()) return [];
  try { new vm.Script(js); return []; }
  catch (err) { return [`${name}: JS 剝完之後語法壞了 — ${err.message}`]; }
}

/* -----------------------------------------------------------------------------
   依副檔名派工。回傳 { text, problems }
----------------------------------------------------------------------------- */
export function stripFile(name, src) {
  if (/\.html?$/i.test(name)) {
    const text = stripHtml(src);
    return { text, problems: checkHtml(text, name) };
  }
  if (/\.css$/i.test(name)) {
    const text = stripCss(src);
    return { text, problems: checkCss(text, name) };
  }
  if (/\.m?js$/i.test(name)) {
    const text = stripJs(src);
    return { text, problems: checkJs(text, name) };
  }
  return { text: src, problems: [] };
}

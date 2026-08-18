/* =============================================================================
   把註解從「要上線的那一份」拿掉（只作用在 _site/，原始檔一個字都不動）
   -----------------------------------------------------------------------------
   這個 repo 的註解寫得非常長 —— 那是刻意的，是專案最重要的資產之一
   （兩台電腦、手機 session、換人接手全靠它）。但它同時**會傳送給每一位訪客**：

       index.html      原始 303KB → brotli 131KB  ／ 去註解後 brotli 只剩 33KB
       assets/style.css 註解佔 56%

   所以做法是「原始檔留全部，_site/ 出去的那一份剝掉」。tools/dist.mjs 複製完
   之後呼叫這裡，Cloudflare 上線的是剝過的版本，git 裡的永遠是完整版。

   ⚠ 為什麼不用一行正規式（`s.replace(/<!--[\s\S]*?-->/g, "")`）：
     ・`<script>` 裡的字串可能含有 `<!--` 或 `-->`（HTML 註解沒有巢狀概念，
       正規式會從那裡一路吃到不該吃的地方）。
     ・CSS 的 `content: "/*"` 或 url() 裡的斜線星號會被當成註解開頭，
       吃掉後面整段規則 —— 而且**不會報錯**，只會靜靜地少掉樣式
       （CLAUDE.md 第九節第 8 條踩過同一類坑：註解裡多兩個字元就把整段關掉）。
     所以下面是一個真的會分辨「現在在哪一種內容裡」的掃描器。

   ⚠ **JavaScript 的註解刻意不碰。** 要正確剝掉 JS 註解得先分辨正規表達式字面
     （`/…/` 和 `/* …` 開頭一樣）、樣板字串與巢狀 `${}`，寫錯就是整支腳本語法錯誤。
     實測 JS 註解在這一站只佔傳輸量的一小部分，風險與報酬不成比例。

   ⚠ 剝掉的東西裡包含 `<!-- POSTS:START -->`／`SEO:START`／`RELATED:START`
     這些標記。**這不影響下一次建置** —— tools/build.mjs 讀寫的一律是 repo 根目錄
     的原始檔，_site/ 每次都是砍掉重建的產物。
   ============================================================================= */

/* 條件式註解（`<!--[if lt IE 9]>…`）真的會被舊瀏覽器當程式碼執行，不能剝。
   這一站沒有用到，留著這道判斷是為了日後有人加了也不會被默默吃掉。 */
const isConditional = (s, i) => s.startsWith("<!--[", i) || s.startsWith("<!--<!", i);

/* ---------------------------------------------------------------------------
   CSS：剝掉 slash-star 註解，但要先認得字串
   --------------------------------------------------------------------------- */
export function stripCss(css) {
  let out = "";
  let i = 0;
  const n = css.length;

  while (i < n) {
    const c = css[i];

    // 字串：整段照抄，裡面的斜線星號不算註解
    if (c === '"' || c === "'") {
      const quote = c;
      let j = i + 1;
      while (j < n) {
        if (css[j] === "\\") { j += 2; continue; }
        if (css[j] === quote) { j++; break; }
        // CSS 的字串不能跨行（除非反斜線續行），遇到換行就當它結束，
        // 免得少一個引號讓後面整份被當成字串
        if (css[j] === "\n") break;
        j++;
      }
      out += css.slice(i, j);
      i = j;
      continue;
    }

    // url(...) 不加引號的形式，裡面可能有斜線
    if (c === "u" && /^url\(/i.test(css.slice(i, i + 4))) {
      const close = css.indexOf(")", i);
      if (close !== -1) {
        out += css.slice(i, close + 1);
        i = close + 1;
        continue;
      }
    }

    // 註解
    if (c === "/" && css[i + 1] === "*") {
      const end = css.indexOf("*/", i + 2);
      if (end === -1) break;          // 沒關起來：後面整段丟掉，和瀏覽器的行為一致
      i = end + 2;
      // 註解原本的位置補一個空白，免得把兩個 token 黏成一個
      // （例如 `margin:0/**/auto` → `margin:0auto`）
      out += " ";
      continue;
    }

    out += c;
    i++;
  }
  return out;
}

/* ---------------------------------------------------------------------------
   HTML：剝掉 HTML 註解，順便剝掉 <style> 裡的 CSS 註解
   <script> 的內容原封不動送出去（理由見檔頭）
   --------------------------------------------------------------------------- */
export function stripHtml(html) {
  let out = "";
  let i = 0;
  const n = html.length;

  while (i < n) {
    const lt = html.indexOf("<", i);
    if (lt === -1) { out += html.slice(i); break; }

    out += html.slice(i, lt);
    i = lt;

    // ---- HTML 註解
    if (html.startsWith("<!--", i) && !isConditional(html, i)) {
      const end = html.indexOf("-->", i + 4);
      if (end === -1) break;          // 沒關起來：後面都是註解，丟掉
      i = end + 3;
      continue;
    }

    // ---- <script> / <style>：這兩種是 raw text element，
    //      內容不能當 HTML 解析，結束標籤要自己找
    const raw = /^<(script|style)\b/i.exec(html.slice(i, i + 8));
    if (raw) {
      const tag = raw[1].toLowerCase();
      const openEnd = html.indexOf(">", i);
      if (openEnd === -1) { out += html.slice(i); break; }

      const closeRe = new RegExp(`</${tag}\\s*>`, "i");
      const rest = html.slice(openEnd + 1);
      const m = closeRe.exec(rest);

      const openTag = html.slice(i, openEnd + 1);
      if (!m) { out += html.slice(i); break; }   // 沒有結束標籤，原樣送出

      const body = rest.slice(0, m.index);
      out += openTag + (tag === "style" ? stripCss(body) : body) + m[0];
      i = openEnd + 1 + m.index + m[0].length;
      continue;
    }

    // ---- 一般標籤：抄到 '>' 為止。屬性值裡可能有 '>'，所以要認引號
    let j = i + 1;
    let quote = null;
    while (j < n) {
      const ch = html[j];
      if (quote) { if (ch === quote) quote = null; }
      else if (ch === '"' || ch === "'") quote = ch;
      else if (ch === ">") { j++; break; }
      j++;
    }
    out += html.slice(i, j);
    i = j;
  }

  return out;
}

/* ⚠ **刻意沒有做「把剝完留下的空行收掉」。**
   history/ 的存檔頁整頁是 <pre>，那裡面的空行是內容的一部分，收掉就是改到頁面。
   而且收了也幾乎沒有好處：實測 brotli 之後差不到 1KB（連續換行本來就是
   壓縮演算法最擅長的東西）。省下來的是註解本身，不是它留下的空行。 */

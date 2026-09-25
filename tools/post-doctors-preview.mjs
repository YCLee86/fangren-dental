// 提案頁產生器：文章頁底下接「這一科的醫師」（2026-09-25）
//
//   node tools/post-doctors-preview.mjs
//
// 產出 preview/post-doctors/<slug>/index.html（十九篇文章的快照）＋ 一頁目錄。
// **快照，不要手改頁面** —— 改完這支重跑。定案上線時連同這支一起刪掉。
//
// 醫師名單不重抄：直接從 topics/<spec>/index.html 的 #doctors 撈
// （那一頁的名單已經是「專科或專長命中」、而且該科的專長已經套色）。
// 醫師卡的樣式也不重寫：從 index.html 的樣式表把 .doc／.docs／.sk 相關的規則抽出來，
// 所以「完整卡」那一格和首頁、著陸頁是同一份 CSS。
//
// ⚠ 提案頁的規矩（CLAUDE.md 第八節）：noindex、剝掉 SEO 區塊、計數器降級成
//   data-views（不 +1）、拿掉點擊與來源紀錄、切換條插在最後一個 </body> 前面、
//   class 一律 pv／pd 前綴。
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const OUT = path.join(ROOT, 'preview/post-doctors');
const rd = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');

const SPEC_NAME = {
  general: '一般牙科', perio: '牙周治療', ortho: '齒顎矯正', kids: '兒童牙科',
  surg: '口腔外科', prosth: '假牙與植牙', endo: '顯微根管',
};

// ---- 1. 從 index.html 抽醫師卡的 CSS -------------------------------------
function stripComments(css) { return css.replace(/\/\*[\s\S]*?\*\//g, ''); }
function parseBlocks(css) {
  // 回傳 [{prelude, body}]（body 是字串；@media 的 body 要再遞迴）
  const out = []; let i = 0;
  while (i < css.length) {
    const open = css.indexOf('{', i);
    if (open < 0) break;
    const prelude = css.slice(i, open).trim();
    let depth = 1, j = open + 1;
    while (j < css.length && depth) { if (css[j] === '{') depth++; else if (css[j] === '}') depth--; j++; }
    out.push({ prelude, body: css.slice(open + 1, j - 1) });
    i = j;
  }
  return out;
}
const WANT_SEL = /\.docs?\b|\.doc-|\.sk\b|\.skills\b/;
const WANT_VAR = /--(sk|role)-|--tint\b|--face/;
function pick(css) {
  let res = '';
  for (const b of parseBlocks(css)) {
    if (b.prelude.startsWith('@media') || b.prelude.startsWith('@supports')) {
      const inner = pick(b.body);
      if (inner.trim()) res += `${b.prelude} {\n${inner}}\n`;
    } else if (b.prelude.startsWith('@')) {
      continue;
    } else if (WANT_SEL.test(b.prelude)) {
      // 混在同一條裡的別的選擇器（.chips、.card-tag…）只留跟醫師卡有關的那幾個
      const sels = splitSel(b.prelude).filter((s) => WANT_SEL.test(s));
      res += `${sels.join(', ')} { ${b.body.trim()} }\n`;
    } else if (/^(html|:root)$/.test(b.prelude) && WANT_VAR.test(b.body)) {
      const decls = b.body.split(';').map((d) => d.trim()).filter((d) => /^--(sk|role)-|^--tint\b/.test(d));
      if (decls.length) res += `html { ${decls.join('; ')}; }\n`;
    }
  }
  return res;
}
function splitSel(s) {
  const out = []; let depth = 0, cur = '';
  for (const ch of s) {
    if (ch === '(') depth++; if (ch === ')') depth--;
    if (ch === ',' && depth === 0) { out.push(cur.trim()); cur = ''; } else cur += ch;
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
}
const home = rd('index.html');
const styles = [...home.matchAll(/<style>([\s\S]*?)<\/style>/g)].map((m) => m[1]).join('\n');
const DOC_CSS = pick(stripComments(styles));

// ---- 2. 每一科的醫師 -----------------------------------------------------
function docsOf(spec) {
  const t = rd(`topics/${spec}/index.html`);
  const sec = t.slice(t.indexOf('<section id="doctors">'));
  const a = sec.indexOf('<div class="docs">');
  const b = sec.indexOf('<p class="empty-note"');
  const html = sec.slice(a, b).replace(/\s*<\/div>\s*$/, '').replace('<div class="docs">', '').trim()
    .replaceAll('../../assets/', '/assets/');
  const items = [...html.matchAll(/<article class="doc"[\s\S]*?<\/article>/g)].map((m) => {
    const x = m[0];
    const docSpec = x.match(/data-spec="([a-z]+)"/)[1];
    const face = x.match(/<img src="([^"]+)"/)?.[1] || null;
    const webp = x.match(/<source type="image\/webp" srcset="([^"]+)"/)?.[1] || null;
    const h3 = x.match(/<h3>([^<]+)<span class="doc-role([^"]*)">([^<]+)<\/span>/);
    const skills = [...x.matchAll(/<span class="sk( tag-on)?" data-spec="[a-z]+">([^<]+)<\/span>/g)]
      .filter((s) => s[1]).map((s) => s[2]);
    return { raw: x, docSpec, face, webp, name: h3[1], roleCls: h3[2], role: h3[3], skills };
  });
  return { html, items };
}

// ---- 3. 三種密度 ---------------------------------------------------------
function blockFor(spec) {
  const { html, items } = docsOf(spec);
  const topic = `/topics/${spec}/#doctors`;
  const row = (d, withSkills) => `
        <li class="pd-row" data-spec="${d.docSpec}">
          <span class="pd-face">${d.face ? `<picture><source type="image/webp" srcset="${d.webp}"><img src="${d.face}" width="400" height="400" alt=""></picture>` : ''}</span>
          <span class="pd-main">
            <span class="pd-name">${d.name}<span class="doc-role${d.roleCls}">${d.role}</span></span>${withSkills && d.skills.length ? `
            <span class="pd-sk">${d.skills.map((s) => `<span class="sk tag-on" data-spec="${spec}">${s}</span>`).join('')}</span>` : ''}
          </span>
        </li>`;
  return `
<section class="pd" aria-labelledby="pd-h" data-spec="${spec}">
  <div class="pd-in">
    <div class="pd-head">
      <h2 id="pd-h">這一科的醫師</h2>
      <a class="pd-more" href="${topic}">${SPEC_NAME[spec]}・${items.length} 位<span aria-hidden="true"> ›</span></a>
    </div>
    <ul class="pd-rows" data-d="a">${items.map((d) => row(d, false)).join('')}
    </ul>
    <ul class="pd-rows" data-d="b">${items.map((d) => row(d, true)).join('')}
    </ul>
    <div class="docs" data-d="c">
      ${html}
    </div>
  </div>
</section>
`;
}

// ---- 4. 樣式（新元件用 pd- 前綴；切換條用 pv- 前綴）-----------------------
const PD_CSS = `
/* ===== 提案：文章頁的「這一科的醫師」（抽自 index.html 的醫師卡樣式）===== */
${DOC_CSS}
/* ===== 提案本身 ===== */
/* 文章頁的根字級不放大（首頁在 721 以上才有 --type-scale），圓角照 1 倍算 */
.pd { --type-scale: 1; }
.pd { padding-block: clamp(1.8rem, 5vw, 2.8rem); border-top: 1px solid var(--rule); }
.pd-in { width: 100%; margin-inline: auto; padding-inline: var(--pad); }
.pd[data-pos="wide"] .pd-in { max-width: var(--wide); }
.pd[data-pos="in"] { border-top: 0; padding-block: 1.6rem 0; }
.pd[data-pos="in"] .pd-in { max-width: none; padding-inline: 0; }
.pd-head { display: flex; align-items: baseline; justify-content: space-between; gap: .6rem 1rem; flex-wrap: wrap; margin-bottom: 1rem; }
.pd .pd-head h2 { display: flex; align-items: baseline; gap: .6rem; margin: 0;
  font-size: clamp(1.15rem, 3.4vw, 1.38rem); line-height: 1.55; color: var(--ink); }
/* 標題前那一小段枝條：和文章內文的 h2、首頁「醫師介紹」同一個做法 */
.pd .pd-head h2::before { content: ''; flex: 0 0 3px; align-self: center;
  height: 1.05em; border-radius: 2px; background: var(--accent); }
/* 放在內文裡的時候，文章的 ul／li／h3 規則會漏進來，這裡擋掉 */
.pd .pd-rows { margin: 0; padding: 0; }
.pd .pd-row { margin: 0; }
.pd .doc h3 { color: var(--ink); }
.pd-more { font-size: .9rem; color: var(--accent-deep); text-decoration: none; white-space: nowrap; }
.pd-more:hover { text-decoration: underline; text-underline-offset: 3px; }
.pd [data-d] { display: none; }
.pd[data-d="a"] [data-d="a"], .pd[data-d="b"] [data-d="b"] { display: grid; }
.pd[data-d="c"] .docs[data-d="c"] { display: grid; }
.pd-rows { list-style: none; margin: 0; padding: 0; gap: .7rem;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 17rem), 1fr)); }
.pd-row { display: grid; grid-template-columns: 52px 1fr; align-items: center; column-gap: .8rem;
  background: var(--card); border: 1px solid var(--rule); border-radius: 12px; padding: .7rem .9rem .7rem .7rem; }
.pd-face { width: 52px; height: 52px; }
.pd-face img { display: block; width: 52px; height: 52px; border-radius: 50%; object-fit: cover; }
.pd-main { display: grid; gap: .35rem; min-width: 0; }
.pd-name { font-weight: 700; font-size: 1.05rem; line-height: 1.5; display: flex; flex-wrap: wrap; align-items: center; column-gap: .5rem; }
.pd-name .doc-role { margin-left: 0; vertical-align: 0; }
.pd-sk { display: flex; flex-wrap: wrap; gap: .3rem; }
.pd .docs { grid-template-columns: repeat(auto-fill, minmax(min(100%, 19rem), 1fr)); }
.pd[data-pos="in"] .docs { grid-template-columns: 1fr; }
@media (min-width: 721px) { .pd[data-pos="in"] .docs { grid-template-columns: repeat(2, 1fr); } }

/* ===== 切換條 ===== */
.pv-bar { position: fixed; left: 0; right: 0; bottom: 0; z-index: 90; background: #1f2226; color: #eef0f1;
  font: 13px/1.4 system-ui, sans-serif; padding: 8px 10px calc(8px + env(safe-area-inset-bottom)); box-shadow: 0 -2px 10px rgba(0,0,0,.25); }
.pv-bar .pv-row { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
.pv-bar .pv-row + .pv-row { margin-top: 6px; }
.pv-bar .pv-lab { opacity: .7; min-width: 2.4em; }
.pv-bar button { font: inherit; color: inherit; background: #33373c; border: 1px solid #4a4f55; border-radius: 6px; padding: 4px 9px; }
.pv-bar button[aria-pressed="true"] { background: #eef0f1; color: #1f2226; border-color: #eef0f1; }
.pv-bar .pv-x { margin-left: auto; }
.pv-mini { position: fixed; right: 10px; bottom: 10px; z-index: 90; display: none; font: 13px system-ui; background: #1f2226; color: #eef0f1; border: 0; border-radius: 16px; padding: 6px 12px; }
body.pv-closed .pv-bar { display: none; } body.pv-closed .pv-mini { display: block; }
body:not(.pv-closed) { padding-bottom: 92px; }
`;

const BAR = `
<div class="pv-bar" role="region" aria-label="提案切換">
  <div class="pv-row"><span class="pv-lab">內容</span>
    <button type="button" data-k="d" data-v="a">Ⓐ 頭像＋名字</button>
    <button type="button" data-k="d" data-v="b">Ⓑ ＋這一科的專長</button>
    <button type="button" data-k="d" data-v="c">Ⓒ 完整醫師卡</button>
  </div>
  <div class="pv-row"><span class="pv-lab">位置</span>
    <button type="button" data-k="p" data-v="in">① 內文結尾</button>
    <button type="button" data-k="p" data-v="wide">② 延伸閱讀上方</button>
    <button type="button" class="pv-x" data-close>收起</button>
  </div>
</div>
<button type="button" class="pv-mini" data-open>提案 ▴</button>
<script>
(function () {
  var pd = document.querySelector('.pd');
  var inA = document.getElementById('pd-in'), wideA = document.getElementById('pd-wide');
  var q = new URLSearchParams(location.search), st = {};
  try { st = JSON.parse(sessionStorage.getItem('pv:pd') || '{}'); } catch (e) {}
  var s = { d: q.get('d') || st.d || 'b', p: q.get('p') || st.p || 'in' };
  if (!/^[abc]$/.test(s.d)) s.d = 'b';
  if (!/^(in|wide)$/.test(s.p)) s.p = 'in';
  function apply() {
    pd.dataset.d = s.d; pd.dataset.pos = s.p;
    (s.p === 'in' ? inA : wideA).appendChild(pd);
    document.querySelectorAll('.pv-bar [data-k]').forEach(function (b) {
      b.setAttribute('aria-pressed', String(s[b.dataset.k] === b.dataset.v));
    });
    try { sessionStorage.setItem('pv:pd', JSON.stringify(s)); } catch (e) {}
    var u = new URL(location.href); u.searchParams.set('d', s.d); u.searchParams.set('p', s.p);
    history.replaceState(null, '', u);
  }
  document.querySelectorAll('.pv-bar [data-k]').forEach(function (b) {
    b.addEventListener('click', function () { s[b.dataset.k] = b.dataset.v; apply(); });
  });
  document.querySelector('[data-close]').addEventListener('click', function () { document.body.classList.add('pv-closed'); });
  document.querySelector('[data-open]').addEventListener('click', function () { document.body.classList.remove('pv-closed'); });
  apply();
})();
</script>
`;

// ---- 5. 每一篇的快照 -----------------------------------------------------
fs.rmSync(OUT, { recursive: true, force: true });
const slugs = fs.readdirSync(path.join(ROOT, 'posts')).filter((s) => fs.existsSync(path.join(ROOT, 'posts', s, 'index.html'))).sort();
const list = [];
for (const slug of slugs) {
  let h = rd(`posts/${slug}/index.html`);
  const spec = h.match(/class="post-tag" href="\/topics\/([a-z]+)\//)?.[1];
  if (!spec) throw new Error(`${slug}: 找不到科別`);
  const title = h.match(/<h1>([^<]+)<\/h1>/)[1];

  // SEO 區塊整段換成 noindex
  h = h.replace(/<!-- SEO:START[\s\S]*?<!-- SEO:END -->/, '<meta name="robots" content="noindex, nofollow, noarchive">');
  if (!h.includes('noindex')) throw new Error(`${slug}: 沒有 SEO 區塊可換`);
  h = h.replace(/<title>([^<]*)<\/title>/, '<title>$1（提案預覽）</title>');
  // 計數器降級、拿掉紀錄
  h = h.replace(/data-views-self=/g, 'data-views=');
  h = h.replace(/\s*<script src="\.\.\/\.\.\/assets\/(click-log|source-log)\.js" defer><\/script>/g, '');
  // 路徑：同層文章指向提案頁自己，其餘改絕對路徑
  h = h.replace(/(["\s])\.\.\/\.\.\//g, '$1/');
  h = h.replace(/"\.\.\/([a-z0-9-]+)\/"/g, '"/preview/post-doctors/$1/"');

  // 兩個錨點
  const footAt = h.indexOf('<div class="post-foot">');
  if (footAt < 0) throw new Error(`${slug}: 沒有 post-foot`);
  h = h.slice(0, footAt) + '<div id="pd-in"></div>\n\n    ' + h.slice(footAt);
  const relAt = h.indexOf('<!-- RELATED:START');
  if (relAt < 0) throw new Error(`${slug}: 沒有 RELATED`);
  h = h.slice(0, relAt) + `<div id="pd-wide">${blockFor(spec)}</div>\n\n` + h.slice(relAt);

  // 樣式放 <head>（放 body 尾端會在開頁那一下閃出來）
  const headEnd = h.indexOf('</head>');
  h = h.slice(0, headEnd) + `<style>${PD_CSS}</style>\n` + h.slice(headEnd);
  const bodyEnd = h.lastIndexOf('</body>');
  h = h.slice(0, bodyEnd) + BAR + h.slice(bodyEnd);

  fs.mkdirSync(path.join(OUT, slug), { recursive: true });
  fs.writeFileSync(path.join(OUT, slug, 'index.html'), h);
  list.push({ slug, spec, title, n: docsOf(spec).items.length });
}

fs.writeFileSync(path.join(OUT, 'index.html'), `<!DOCTYPE html>
<html lang="zh-Hant-TW"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow, noarchive">
<title>文章頁的醫師資訊（提案）</title>
<style>
body { font: 16px/1.6 system-ui, sans-serif; margin: 0; padding: 16px; background: #f4f4f5; color: #2a2c27; }
main { max-width: 40rem; margin: 0 auto; } h1 { font-size: 1.25rem; } ul { padding: 0; list-style: none; }
li { margin: .4rem 0; } a { color: #2a6d69; } small { color: #5c5f57; }
</style></head><body><main>
<h1>文章頁的醫師資訊（提案）</h1>
<p>點任何一篇，頁面底部有切換條：內容三種 × 位置兩種。醫師名單照各科著陸頁。</p>
<ul>
${list.map((x) => `<li><a href="${x.slug}/">${x.title}</a><br><small>${SPEC_NAME[x.spec]}・${x.n} 位醫師</small></li>`).join('\n')}
</ul></main></body></html>
`);
console.log(`寫了 ${list.length} 篇 ＋ 目錄 → preview/post-doctors/`);
console.log(`抽出的醫師卡樣式 ${DOC_CSS.length} 字元`);

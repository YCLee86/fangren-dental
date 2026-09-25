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
// 首頁那一份的醫師卡要有錨點才跳得過去。代號沿用站上已經在用的那一套
// （形象照的檔名 doctor-<代號>-400.jpg、臉書那一顆的 data-doc），沒有照片也沒有臉書的才查這張表。
const HOME = '/preview/post-doctors/home/';
const SLUG_BY_NAME = { 廖立揚: 'liao-liyang' };
function docSlug(x, name) {
  const s = x.match(/doctor-([a-z-]+)-400\.jpg/)?.[1] || x.match(/data-doc="([a-z-]+)"/)?.[1] || SLUG_BY_NAME[name];
  if (!s) throw new Error(`${name}：找不到醫師代號，補進 SLUG_BY_NAME`);
  return s;
}
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
    const slug = docSlug(x, h3[1]);
    // 完整卡那一格：卡片上蓋一層透明連結（卡片裡可能已經有臉書那一顆 <a>，不能整張包成 <a>）
    const card = x.replace(/<\/article>$/, `  <a class="pd-go" href="${HOME}#doc-${slug}" aria-label="到首頁看${h3[1]}醫師的介紹"></a>\n        </article>`);
    return { raw: x, card, slug, docSpec, face, webp, name: h3[1], roleCls: h3[2], role: h3[3], skills };
  });
  return { html, items };
}

// ---- 3. 三種密度 ---------------------------------------------------------
function blockFor(spec) {
  const { items } = docsOf(spec);
  const topic = `/topics/${spec}/#doctors`;
  const row = (d, withSkills) => `
        <li class="pd-row" data-spec="${d.docSpec}">
          <span class="pd-face">${d.face ? `<picture><source type="image/webp" srcset="${d.webp}"><img src="${d.face}" width="400" height="400" alt=""></picture>` : ''}</span>
          <span class="pd-main">
            <span class="pd-name">${d.name}<span class="doc-role${d.roleCls}">${d.role}</span></span>${withSkills && d.skills.length ? `
            <span class="pd-sk">${d.skills.map((s) => `<span class="sk tag-on" data-spec="${spec}">${s}</span>`).join('')}</span>` : ''}
          </span>
          <span class="pd-chev" aria-hidden="true">›</span>
          <a class="pd-go" href="${HOME}#doc-${d.slug}" aria-label="到首頁看${d.name}醫師的介紹"></a>
        </li>`;
  return `
<section class="pd" id="pd" aria-labelledby="pd-h" data-spec="${spec}">
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
      ${items.map((d) => d.card).join('\n        ')}
    </div>
  </div>
</section>
`;
}

// ---- 3b. 兩個入口（2026-09-25 第三輪：使用者定「1＋2、不要頭像」）---------
// 1：頂端那一行的「N 位醫師 ›」。
// 2：首頁「回到最上面」那一顆的同一個概念 —— 右下角一顆玻璃小方塊，點下去捲到醫師那一塊。
//    外觀逐項照 index.html 的 .btt（44×44、--card 的 .80 ＋ blur 6px、無框線、柔墨 .82、
//    圓角 --frame-r、離右下角 20px），只換記號。記號三種給使用者挑（data-g）。
function peekFor(spec) {
  const n = docsOf(spec).items.length;
  return `<a class="pd-peek" href="#pd" data-pd-jump>${n} 位醫師<span aria-hidden="true"> ›</span></a>
        `;
}
function floatFor(spec) {
  const n = docsOf(spec).items.length;
  return `
<button class="pd-btt" type="button" data-pd-jump aria-label="看這一科的 ${n} 位醫師">
  <svg class="pd-g-a" viewBox="0 0 18 19.5" aria-hidden="true"><circle cx="9" cy="5.6" r="4.3"/><path d="M1.2 18.5c0-4.3 3.5-7.3 7.8-7.3s7.8 3 7.8 7.3"/></svg>
  <span class="pd-g-b" aria-hidden="true">醫師</span>
  <span class="pd-g-c" aria-hidden="true">醫師<svg viewBox="0 0 12 7" aria-hidden="true"><path d="M1 1l5 5 5-5"/></svg></span>
</button>
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
.pd-row { display: grid; grid-template-columns: 52px 1fr auto; align-items: center; column-gap: .8rem;
  background: var(--card); border: 1px solid var(--rule); border-radius: 12px; padding: .7rem .9rem .7rem .7rem; }
.pd-face { width: 52px; height: 52px; }
.pd-face img { display: block; width: 52px; height: 52px; border-radius: 50%; object-fit: cover; }
.pd-main { display: grid; gap: .35rem; min-width: 0; }
.pd-name { font-weight: 700; font-size: 1.05rem; line-height: 1.5; display: flex; flex-wrap: wrap; align-items: center; column-gap: .5rem; }
.pd-name .doc-role { margin-left: 0; vertical-align: 0; }
.pd-sk { display: flex; flex-wrap: wrap; gap: .3rem; }
/* 整張卡都可以按：透明連結蓋滿卡片；臉書那一顆墊在它上面，仍然按得到 */
.pd .doc, .pd-row { position: relative; transition: border-color .15s ease, box-shadow .15s ease; }
.pd-go { position: absolute; inset: 0; z-index: 1; border-radius: inherit; }
.pd .doc-fb { position: relative; z-index: 2; }
.pd .doc:hover, .pd-row:hover { border-color: var(--accent); box-shadow: var(--shadow); }
.pd-go:focus-visible { outline: 2px solid var(--accent-deep); outline-offset: 2px; }
.pd-chev { font-size: 1.4rem; line-height: 1; color: var(--ink-soft); }
.pd .docs { grid-template-columns: repeat(auto-fill, minmax(min(100%, 19rem), 1fr)); }
.pd[data-pos="in"] .docs { grid-template-columns: 1fr; }
@media (min-width: 721px) { .pd[data-pos="in"] .docs { grid-template-columns: repeat(2, 1fr); } }

/* ===== 入口 1：頂端那一行的「N 位醫師 ›」=====
   放在瀏覽數後面、夜間開關前面；手機上那一行本來就滿了（正式站 375 寬已經把開關擠到第二列），
   所以它自然換行、和開關排在第二列，不另外佔一列。 */
.crumbs a.pd-peek, .crumbs a.pd-peek:hover { color: var(--accent-deep); white-space: nowrap; }
body[data-pe="none"] .pd-peek, body[data-pe="float"] .pd-peek { display: none; }

/* ===== 入口 2：右下角那一顆（照首頁 .btt）===== */
.pd-btt {
  position: fixed; z-index: 20;
  right: calc(20px + env(safe-area-inset-right, 0px));
  bottom: calc(20px + var(--pv-h, 0px) + env(safe-area-inset-bottom, 0px));
  min-width: 44px; height: 44px; padding: 0;
  display: flex; align-items: center; justify-content: center;
  border: 0; border-radius: var(--frame-r, 8px);
  cursor: pointer; -webkit-tap-highlight-color: transparent;
  background-color: rgba(244, 244, 245, .8);
  -webkit-backdrop-filter: blur(6px) saturate(1.15); backdrop-filter: blur(6px) saturate(1.15);
  box-shadow: 0 1px 2px rgba(42, 44, 39, .07), 0 4px 10px rgba(42, 44, 39, .09);
  color: rgba(92, 95, 87, .82); font: inherit;
  opacity: 0; visibility: hidden; transform: translateY(6px);
  transition: opacity .22s ease, transform .22s ease, visibility .22s, background-color .18s ease, box-shadow .22s ease;
}
.pd-btt.is-on { opacity: 1; visibility: visible; transform: translateY(0); }
.pd-btt.is-lit { background-color: var(--card); }
@media (hover: hover) and (pointer: fine) {
  .pd-btt:hover { background-color: var(--card); box-shadow: 0 5px 10px rgba(42, 44, 39, .09), 0 16px 32px rgba(42, 44, 39, .16); }
}
.pd-btt:focus-visible { outline: 2px solid var(--teal); outline-offset: 3px; }
@media (prefers-reduced-motion: reduce) { .pd-btt { transform: none; transition: opacity .22s ease, visibility .22s; } }
html[data-theme="dark"] .pd-btt { background-color: color-mix(in srgb, var(--card) 80%, transparent);
  color: color-mix(in srgb, var(--ink-soft) 82%, transparent); }
/* 三種記號，一次只亮一種 */
.pd-btt > * { display: none; }
body[data-g="a"] .pd-g-a { display: block; }
body[data-g="b"] .pd-g-b, body[data-g="c"] .pd-g-c { display: inline-flex; }
.pd-g-a { width: 18px; height: 19.5px; overflow: visible; fill: none; stroke: currentColor; stroke-width: 1.4;
  stroke-linecap: round; stroke-linejoin: round; }
.pd-g-a * { vector-effect: non-scaling-stroke; }
.pd-g-b, .pd-g-c { align-items: center; gap: .3rem; font-size: .8rem; font-weight: 500; letter-spacing: .04em; line-height: 1; }
body[data-g="c"] .pd-btt { padding-inline: .7rem; }
.pd-g-c svg { width: 10px; height: 6px; overflow: visible; fill: none; stroke: currentColor; stroke-width: 1.4;
  stroke-linecap: round; stroke-linejoin: round; }

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
`;

const BAR = `
<div class="pv-bar" role="region" aria-label="提案切換">
  <div class="pv-row"><span class="pv-lab">按鈕</span>
    <button type="button" data-k="g" data-v="a">Ⓐ 人像</button>
    <button type="button" data-k="g" data-v="b">Ⓑ 醫師</button>
    <button type="button" data-k="g" data-v="c">Ⓒ 醫師 ﹀</button>
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
  // 內容、位置、入口三條尺已經定案（Ⓑ＋專長／① 內文結尾／1＋2），收成預設值、從切換條上拿掉；網址參數仍然吃得到
  var s = { d: q.get('d') || 'b', p: q.get('p') || 'in', e: q.get('e') || 'both', g: q.get('g') || st.g || 'a' };
  if (!/^(none|top|float|both)$/.test(s.e)) s.e = 'both';
  if (!/^[abc]$/.test(s.g)) s.g = 'a';
  if (!/^[abc]$/.test(s.d)) s.d = 'b';
  if (!/^(in|wide)$/.test(s.p)) s.p = 'in';
  function apply() {
    pd.dataset.d = s.d; pd.dataset.pos = s.p; document.body.dataset.pe = s.e; document.body.dataset.g = s.g;
    (s.p === 'in' ? inA : wideA).appendChild(pd);
    document.querySelectorAll('.pv-bar [data-k]').forEach(function (b) {
      b.setAttribute('aria-pressed', String(s[b.dataset.k] === b.dataset.v));
    });
    try { sessionStorage.setItem('pv:pd', JSON.stringify(s)); } catch (e) {}
    var u = new URL(location.href); u.searchParams.set('d', s.d); u.searchParams.set('p', s.p); u.searchParams.set('e', s.e); u.searchParams.set('g', s.g);
    history.replaceState(null, '', u);
    padPv(); floatCheck();
  }
  // 切換條的高度讓浮條墊在它上面
  var bar = document.querySelector('.pv-bar');
  function padPv() {
    var h = document.body.classList.contains('pv-closed') ? 0 : bar.offsetHeight;
    document.documentElement.style.setProperty('--pv-h', h + 'px');
    document.body.style.paddingBottom = h ? h + 'px' : '';
  }
  // 右下角那一顆：和首頁那一顆一樣「捲過半個螢幕才出現」，醫師那一塊進到畫面就收起來
  var fl = document.querySelector('.pd-btt');
  function vh() { return (window.visualViewport && visualViewport.height) || innerHeight; }
  function floatCheck() {
    var want = s.e === 'float' || s.e === 'both';
    var past = scrollY > vh() * 0.5;
    var reached = pd.getBoundingClientRect().top < vh();
    fl.classList.toggle('is-on', want && past && !reached);
  }
  addEventListener('scroll', floatCheck, { passive: true });
  addEventListener('resize', function () { padPv(); floatCheck(); });
  addEventListener('load', padPv);
  if (window.ResizeObserver) new ResizeObserver(padPv).observe(bar);
  // 兩個入口點下去：平滑捲到醫師那一塊（減少動態效果的話直接跳）
  document.querySelectorAll('[data-pd-jump]').forEach(function (a) {
    a.addEventListener('click', function (ev) {
      ev.preventDefault();
      if (a === fl) { fl.classList.add('is-lit'); setTimeout(function () { fl.classList.remove('is-lit'); }, 700); }
      var still = matchMedia('(prefers-reduced-motion: reduce)').matches;
      pd.scrollIntoView({ behavior: still ? 'auto' : 'smooth', block: 'start' });
    });
  });
  document.querySelectorAll('.pv-bar [data-k]').forEach(function (b) {
    b.addEventListener('click', function () { s[b.dataset.k] = b.dataset.v; apply(); });
  });
  document.querySelector('[data-close]').addEventListener('click', function () { document.body.classList.add('pv-closed'); padPv(); });
  document.querySelector('[data-open]').addEventListener('click', function () { document.body.classList.remove('pv-closed'); padPv(); });
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

  // 入口 1：放進頂端那一行（夜間開關前面）
  const tgAt = h.indexOf('<button class="theme-toggle"');
  if (tgAt < 0) throw new Error(`${slug}: 頂端那一行找不到夜間開關`);
  h = h.slice(0, tgAt) + peekFor(spec) + h.slice(tgAt);

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
  h = h.slice(0, bodyEnd) + floatFor(spec) + BAR + h.slice(bodyEnd);

  fs.mkdirSync(path.join(OUT, slug), { recursive: true });
  fs.writeFileSync(path.join(OUT, slug, 'index.html'), h);
  list.push({ slug, spec, title, n: docsOf(spec).items.length });
}

// ---- 6. 首頁的快照：醫師卡加上錨點 ---------------------------------------
// ⚠ 這是 index.html 的完整複本，第八節那幾件照做：路徑改絕對、SEO 區塊換 noindex、
//   計數器降級、拿掉三支紀錄、提示條插在最後一個 </body> 前面。
{
  let h = home;
  h = h.replace(/<!-- SEO:START[\s\S]*?<!-- SEO:END -->/, '<meta name="robots" content="noindex, nofollow, noarchive">');
  if (!h.includes('noindex')) throw new Error('首頁：沒有 SEO 區塊可換');
  h = h.replace(/<title>([^<]*)<\/title>/, '<title>$1（提案預覽）</title>');
  h = h.replace(/data-views-self=/g, 'data-views=');
  h = h.replace(/\s*<script src="assets\/(click-log|source-log|search-log)\.js" defer><\/script>/g, '');
  if (/(click|source|search)-log\.js/.test(h.slice(h.lastIndexOf('</style>')))) throw new Error('首頁：紀錄的 script 沒拿乾淨');
  h = h.replace(/(["'\s,(])(assets|posts|history)\//g, '$1/$2/');
  h = h.replace(/(["'\s,(])(favicon\.ico|site\.webmanifest)/g, '$1/$2');
  // 醫師卡加 id（放在 class 後面：schema.mjs 比對的是 class="doc" 緊接一個引號）
  const secA = h.indexOf('<section id="doctors">'), secB = h.indexOf('</section>', secA);
  let sec = h.slice(secA, secB), n = 0;
  sec = sec.replace(/<article class="doc"([^>]*)>([\s\S]*?)<\/article>/g, (m, attrs, body) => {
    n++;
    const name = body.match(/<h3>([^<]+)/)[1];
    return `<article class="doc" id="doc-${docSlug(m, name)}"${attrs}>${body}</article>`;
  });
  if (n !== 9) throw new Error(`首頁：醫師卡應該是 9 張，找到 ${n}`);
  h = h.slice(0, secA) + sec + h.slice(secB);
  const css = `<style>
/* 提案：從文章跳過來的那一張，外框亮一下再退掉 */
.doc:target { animation: pd-hit 2.4s ease-out 1; }
@keyframes pd-hit {
  0%, 35% { box-shadow: 0 0 0 3px var(--accent); border-color: var(--accent); }
  100%    { box-shadow: 0 0 0 3px transparent; }
}
@media (prefers-reduced-motion: reduce) { .doc:target { animation: none; box-shadow: 0 0 0 3px var(--accent); } }
.pv-back { position: fixed; left: 10px; bottom: 10px; z-index: 90; font: 13px system-ui, sans-serif;
  background: #1f2226; color: #eef0f1; border: 0; border-radius: 16px; padding: 7px 13px; }
</style>
`;
  const headEnd = h.indexOf('</head>');
  h = h.slice(0, headEnd) + css + h.slice(headEnd);
  const bodyEnd = h.lastIndexOf('</body>');
  h = h.slice(0, bodyEnd) + `<button type="button" class="pv-back" onclick="history.length > 1 ? history.back() : location.assign('/preview/post-doctors/')">‹ 回文章（提案預覽）</button>\n` + h.slice(bodyEnd);
  fs.mkdirSync(path.join(OUT, 'home'), { recursive: true });
  fs.writeFileSync(path.join(OUT, 'home', 'index.html'), h);
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

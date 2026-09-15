/* ==========================================================================
   兩顆 QR code 的守門　　node drafts/channels/check-qr.mjs
   ⚠⚠ 這一支最重要的一道是「真的解一次」——QR 最惡劣的失敗是
     「看起來完全正常但掃不出來」，畫面、尺寸、顏色全對也證明不了任何事。
     容器裡沒有解碼器的話它會**大聲說沒驗到**，不會安靜放行。
     臨時裝（只給驗證用、不是專案依賴）：
         pip install zxing-cpp opencv-python-headless
   ========================================================================== */
import { build, URL_LINE, URL_WEB, INK, LITE, PLATE, PNG_PX,
         ARROW, CURSOR, HOLE_X, WEB_DX, WEB_DY, BUBBLE, VB } from './qr-brand.mjs';
import { readFileSync, writeFileSync, mkdtempSync } from 'node:fs';
import { execFileSync, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { tmpdir } from 'node:os';

const HERE = dirname(fileURLToPath(import.meta.url));
const bad = [];
const ok  = m => console.log('  ✓ ' + m);
const no  = m => { bad.push(m); console.log('  ✗ ' + m); };

/* ① 重跑一次，和檔案裡的逐位比對 —— 最強的一道：不一樣就是有人手改了產出檔，
      或改了產生器卻忘了重跑 */
console.log('① 產出檔');
const r = spawnSync(process.execPath, [join(HERE, 'qr-brand.mjs'), '--check'], { encoding: 'utf8' });
/* ⚠ 產生器自己 throw 的時候 stdout 是空的，要把 stderr 一起印出來 ——
   不然這一道會變成一句看不懂的「對不上」 */
r.status === 0 ? ok('重跑之後逐位相同')
  : no('產出檔和產生器對不上：' + ((r.stdout || '').trim()
      || (r.stderr || '').split('\n').find(l => /Error/.test(l)) || '').trim());

/* ② 版型 */
console.log('② 版型');
const { line, web } = build();
const svgs = { line: line.svg, web: web.svg };
line.n === 37 ? ok('37×37 格（版本 5）') : no(`格數是 ${line.n}，不是 37`);
line.mouth === web.mouth
  ? ok(`兩顆碼上的嘴一樣大（${line.mouth} × 邊長）`)
  : no(`嘴不一樣大：${line.mouth} vs ${web.mouth}`);
for (const [k, s] of Object.entries(svgs)) {
  for (const [what, want] of [['深', INK], ['淺', LITE], ['底板', PLATE]])
    s.includes(want) ? null : no(`${k}：${what}色 ${want} 沒出現在檔案裡`);
  /* 定位點的圓角有上限：0.25 安全、0.5 開始掉、1.0 以上幾乎掃不到 */
  const rx = [...s.matchAll(/width="7" height="7" rx="([\d.]+)"/g)].map(m => +m[1]);
  rx.length === 3 && rx.every(v => v <= 0.25)
    ? ok(`${k}：三顆定位點圓角 ${rx[0]} 格（上限 0.25）`)
    : no(`${k}：定位點圓角 ${rx}（三顆、且都要 ≤0.25）`);
  s.includes('maskUnits="userSpaceOnUse"') ? null : no(`${k}：遮罩不見了`);
  /* 標誌外面那個 scale(1 -1) 一定要跟著（只抄 path 會上下顛倒又不報錯） */
  s.includes('scale(1 -1)') ? null : no(`${k}：標誌的 scale(1 -1) 掉了`);
}
/* ②之二 網站那顆的滑鼠游標
   ⚠⚠ 游標整個不見的話，版型、掃描、PNG 每一道都會過（碼還是碼）——
     只有把圖打開看才看得到。所以這裡直接找那條路徑。 */
web.svg.includes(ARROW) ? ok('網站那顆有游標') : no('網站那顆的游標不見了');
line.svg.includes(ARROW) ? no('LINE 那顆多了一個游標') : ok('LINE 那顆沒有游標');
/* ⚠⚠⚠ 牙洞是這顆標誌唯一的識別特徵，游標碰到就不是芳仁的標誌了。
   算的是「游標最左邊」（尖端再往左半條框線）離牙洞右緣多遠，換算成格。 */
{
  const half = VB[3] * BUBBLE.stroke / 2 / VB[2];      // 半條框線，以標誌寬為單位
  const gapMark = (CURSOR.tipx - half) - HOLE_X[1];
  const gap = +(gapMark * line.mouth * line.n).toFixed(2);   // 換算成「幾格」
  gap >= 0.3
    ? ok(`游標離牙洞 ${gap} 格（牙洞 ${HOLE_X[0].toFixed(3)}~${HOLE_X[1].toFixed(3)}、尖端 ${CURSOR.tipx}）`)
    : no(`游標離牙洞只剩 ${gap} 格 —— 快碰到牙洞了`);
}
/* 定稿那三個值真的寫回常數了 —— 改了畫面照樣正常、每一道尺寸守門都會過，
   而使用者挑的就是這三格（2026-09-15） */
for (const [what, got, want] of [['游標高度', CURSOR.h, 0.40],
                                 ['往右', +(WEB_DX * line.n).toFixed(2), 0.74],
                                 ['往下', +(WEB_DY * line.n).toFixed(2), 3.33]])
  got === want ? ok(`網站那顆 ${what} ${got}`) : no(`網站那顆 ${what} 是 ${got}，定稿是 ${want}`);

/* 兩顆碼的 id 不可以撞名（並排放在同一份文件裡時第二顆會去吃第一顆的 defs） */
const ids = a => [...a.matchAll(/id="([^"]+)"/g)].map(m => m[1]);
ids(line.svg).some(i => ids(web.svg).includes(i))
  ? no('兩顆碼的 id 撞名了')
  : ok('兩顆碼的 id 各自獨立');

/* ③ 真的掃一次 */
console.log('③ 掃描（六種大小 × 五種劣化）');
const py = `
import sys, json
try:
    import cv2, numpy as np, zxingcpp
except Exception as e:
    print(json.dumps({'skip': str(e)})); sys.exit(0)
def deg(img, blur, noise, ang):
    h, w = img.shape[:2]
    o = cv2.warpAffine(img, cv2.getRotationMatrix2D((w/2, h/2), ang, 1), (w, h), borderValue=(255,255,255))
    if blur:  o = cv2.GaussianBlur(o, (0,0), blur)
    if noise: o = np.clip(o.astype(np.int16) + np.random.RandomState(7).normal(0, noise, o.shape), 0, 255).astype(np.uint8)
    return o
out = {}
for name, want, files in json.load(sys.stdin):
    okc = tot = 0; miss = []
    for px, f in files:
        img = cv2.imread(f)
        for a in [(0,0,0), (px/300,0,0), (px/300,8,0), (px/300,8,5), (px/300,8,12)]:
            t = img if a == (0,0,0) else deg(img, *a); tot += 1
            rs = zxingcpp.read_barcodes(t)
            if rs and rs[0].text == want: okc += 1
            else: miss.append([px, a])
    out[name] = [okc, tot, miss]
print(json.dumps(out))
`;
const SIZES = [180, 240, 300, 400, 560, 800];
const tmp = mkdtempSync(join(tmpdir(), 'qrchk-'));
const CHROME = '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';
let rendered = true;
try {
  const shot = join(tmp, 'shot.mjs');
  writeFileSync(shot, `
import pkg from '/opt/node22/lib/node_modules/playwright/index.js'; const { chromium } = pkg;
const jobs = ${JSON.stringify(Object.entries(svgs).map(([k, s]) => [k, Buffer.from(s).toString('base64')]))};
const b = await chromium.launch({ executablePath: ${JSON.stringify(CHROME)} });
const p = await b.newPage();
for (const [k, b64] of jobs) for (const s of ${JSON.stringify(SIZES)}) {
  await p.setViewportSize({ width: s, height: s });
  await p.setContent('<body style="margin:0"><img src="data:image/svg+xml;base64,' + b64 + '" width="' + s + '" height="' + s + '">');
  await p.screenshot({ path: ${JSON.stringify(tmp)} + '/' + k + '-' + s + '.png' });
}
await b.close();`);
  execFileSync(process.execPath, [shot], { stdio: 'pipe' });
} catch (e) { rendered = false; }

if (!rendered) {
  no('⚠⚠ 沒有把圖畫出來（Chromium 不在），這一輪等於沒有掃過 —— 不要當成通過');
} else {
  const jobs = [['line', URL_LINE], ['web', URL_WEB]]
    .map(([k, u]) => [k, u, SIZES.map(s => [s, join(tmp, `${k}-${s}.png`)])]);
  const res = spawnSync('python3', ['-c', py], { input: JSON.stringify(jobs), encoding: 'utf8' });
  let d = {}; try { d = JSON.parse(res.stdout.trim().split('\n').pop()); } catch { d = { skip: res.stderr }; }
  if (d.skip) no(`⚠⚠ 沒有解碼器（${String(d.skip).split('\n')[0]}），這一輪等於沒有掃過 —— `
    + '不要當成通過。pip install zxing-cpp opencv-python-headless');
  else for (const [k, [o, t, miss]] of Object.entries(d))
    o === t ? ok(`${k} ${o}/${t}`) : no(`${k} 只有 ${o}/${t}，掃不出來的：${JSON.stringify(miss)}`);

  /* ④ 檔案裡那兩張 PNG 本人也要解得出來 ——
     ⚠ 不做逐位比對（換一版 Chromium 就會差幾個抗鋸齒的像素，那種守門遲早被拿掉），
       解得出來、尺寸對，才是這兩個檔要保證的事 */
  console.log('④ 檔案裡的 PNG');
  const jobs2 = [['line.png', URL_LINE, [[PNG_PX, join(HERE, 'qr', 'fangren-line-qr.png')]]],
                 ['web.png',  URL_WEB,  [[PNG_PX, join(HERE, 'qr', 'fangren-web-qr.png')]]]];
  const r2 = spawnSync('python3', ['-c', py], { input: JSON.stringify(jobs2), encoding: 'utf8' });
  let d2 = {}; try { d2 = JSON.parse(r2.stdout.trim().split('\n').pop()); } catch { d2 = { skip: 1 }; }
  if (d2.skip) no('⚠ PNG 沒驗到');
  else for (const [k, [o, t]] of Object.entries(d2))
    o === t ? ok(`${k} ${o}/${t}`) : no(`${k} 只有 ${o}/${t}`);
}

console.log(bad.length ? `\n✗ ${bad.length} 項沒過` : '\n✓ 全部通過');
process.exit(bad.length ? 1 : 0);

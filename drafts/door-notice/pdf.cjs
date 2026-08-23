const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const OUT = __dirname + '/';
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell' });
  /* ⚠⚠ 版面的高度是 JS 現算的（door-map-script 的 fit()），而 pdf() 會用 A4 的
     版面重排一次 —— 只呼叫 emulateMedia('print') 的話，fit() 還是用螢幕那個
     視窗算的，地圖會比紙高、被 .sh-map 的 overflow:hidden 切掉下緣（踩過）。
     做法：**視窗先調成 A4 在 96dpi 的像素大小（794×1123）**，再切 print 媒體，
     發一次 resize 讓 fit() 用正確的盒子重算，然後才輸出。 */
  const p = await b.newPage({ viewport: { width: 794, height: 1123 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('file:///home/user/fangren-dental/preview/clinic-map-door/index.html?orient=w', { waitUntil: 'load' });
  await p.emulateMedia({ media: 'print' });
  await p.waitForTimeout(800);
  await p.evaluate(() => window.dispatchEvent(new Event('resize')));
  await p.waitForTimeout(500);
  const m = await p.evaluate(() => {
    const box = document.querySelector('.sh-map').getBoundingClientRect();
    const svg = document.querySelector('.sh-map .map-svg').getBoundingClientRect();
    return { boxH: box.height.toFixed(1), svgH: svg.height.toFixed(1), boxW: box.width.toFixed(1), svgW: svg.width.toFixed(1) };
  });
  console.log('地圖盒 %s×%s，SVG %s×%s', m.boxW, m.boxH, m.svgW, m.svgH);
  await p.pdf({ path: OUT + '芳仁-門口停車告示-A4.pdf', printBackground: true, preferCSSPageSize: true,
                margin: { top: 0, right: 0, bottom: 0, left: 0 } });
  console.log('errs:', errs.join(';') || 'none');
  await b.close();
})();

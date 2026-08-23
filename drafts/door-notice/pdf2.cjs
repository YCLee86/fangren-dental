const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const OUT = __dirname + '/';
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell' });
  for (const [name, white] of [['芳仁-門口停車告示-A4.pdf', false], ['芳仁-門口停車告示-A4-白底.pdf', true]]) {
    const p = await b.newPage({ viewport: { width: 794, height: 1123 } });
    await p.goto('file:///home/user/fangren-dental/preview/clinic-map-door/index.html?orient=w', { waitUntil: 'load' });
    if (white) await p.addStyleTag({ content: '@media print { .sheet { background: #fff !important; } }' });
    await p.emulateMedia({ media: 'print' });
    await p.waitForTimeout(800);
    await p.evaluate(() => window.dispatchEvent(new Event('resize')));
    await p.waitForTimeout(500);
    await p.pdf({ path: OUT + name, printBackground: true, preferCSSPageSize: true,
                  margin: { top: 0, right: 0, bottom: 0, left: 0 } });
    console.log('寫出', name);
    await p.close();
  }
  await b.close();
})();

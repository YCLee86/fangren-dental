/* 口腔外科約診規則 —— 輸出 PDF（暫存，不進 _site）
   跑法：node drafts/surg-appt/pdf.cjs
   ⚠ 用 headless_shell，不要用完整版 chrome（CLAUDE.md 第九節第 18 條：
     完整版畫出來會比 --window-size 少 87px，而且不報錯）。
   ⚠ 這一頁的高度不是 JS 算的（不像 door-notice 的地圖），所以不必發 resize，
     但視窗仍然先調成 A4 在 96dpi 的像素大小（794×1123）再切 print 媒體。
   ⚠⚠ 字型：容器裡預設只有 WQY 正黑，產出來的 PDF 和診所電腦印出來的**不一樣**。
     要用站上第一順位的 Noto Sans TC 渲染，先抓字型（見同資料夾的 README.md）。 */
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const OUT = __dirname + '/';
const SRC = 'file:///home/user/fangren-dental/preview/surg-appointment/index.html';
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell' });
  for (const [name, q] of [
    ['芳仁-口腔外科約診規則-約診單-A4.pdf', '?ver=slip'],
    ['芳仁-口腔外科約診規則-公告-A4.pdf', '?ver=post'],
    ['芳仁-口腔外科約診規則-約診單-黑白-A4.pdf', '?ver=slip&ink=mono&bg=white'],
  ]) {
    const p = await b.newPage({ viewport: { width: 794, height: 1123 } });
    await p.goto(SRC + q, { waitUntil: 'load' });
    await p.emulateMedia({ media: 'print' });
    await p.waitForTimeout(500);
    /* 交件前一定要量一次：內容與頁尾之間還剩幾 mm。負的就是超出 A4。 */
    const slack = await p.evaluate(() => {
      const sheet = document.getElementById('sheet');
      const k = 210 / sheet.getBoundingClientRect().width;
      const foot = document.querySelector('.ap-foot').getBoundingClientRect();
      const blocks = [...sheet.children].filter(e => !e.classList.contains('ap-foot') && e.offsetParent !== null);
      return +((foot.top - blocks[blocks.length - 1].getBoundingClientRect().bottom) * k).toFixed(1);
    });
    if (slack < 0) throw new Error(name + '：內容超出 A4 ' + (-slack) + 'mm');
    await p.pdf({ path: OUT + name, printBackground: true, preferCSSPageSize: true,
                  margin: { top: 0, right: 0, bottom: 0, left: 0 } });
    console.log('寫出 %s（內容與頁尾之間空 %smm）', name, slack);
    await p.close();
  }
  await b.close();
})();

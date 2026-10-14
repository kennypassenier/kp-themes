// research/sidenav-minor: photographs every section of look.html in the given themes and widths, to look at.
//   node research/sidenav-minor/look-shots.mjs <outDir> <themes,comma> <widths,comma> [settleMs]
import { mkdirSync } from 'node:fs';
import { firefox } from 'playwright';
const [out, themeList, widthList, waitMs = '2500'] = process.argv.slice(2);
mkdirSync(out, { recursive: true });
const browser = await firefox.launch();
for (const width of widthList.split(',').map(Number)) {
  const ctx = await browser.newContext({ viewport: { width, height: width < 600 ? 800 : 900 }, reducedMotion: 'no-preference' });
  for (const theme of themeList.split(',')) {
    const tab = await ctx.newPage();
    await tab.goto('http://127.0.0.1:8761/research/sidenav-minor/look.html', { waitUntil: 'load' });
    await tab.evaluate(async (t) => {
      const { ensureRegister } = await import('/js/lazy-register.js');
      const { applyTheme } = await import('/js/theme-core.js');
      await ensureRegister(t, { pattern: '/css/{theme}-register.css' });
      applyTheme(t, { announce: false });
    }, theme);
    await tab.waitForTimeout(Number(waitMs));
    const sections = await tab.locator('section[data-review-item]').all();
    for (const [i, section] of sections.entries()) {
      await section.scrollIntoViewIfNeeded();
      await tab.waitForTimeout(3200 + i * 300);
      const id = await section.getAttribute('data-review-item');
      await section.screenshot({ path: `${out}/look-${theme}-${width}-${i + 1}-${id}.png` });
    }
    await tab.close();
  }
  await ctx.close();
}
await browser.close();

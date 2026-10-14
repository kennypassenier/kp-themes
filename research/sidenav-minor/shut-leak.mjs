// research/sidenav-minor: a shut panel leaves nothing of itself on the screen.
// For every theme it takes the frame page twice with the panel shut, as built
// and with ?plain (every option taken away), and compares the strip along the
// window's start edge pixel by pixel. A difference there is a shadow, a ghost or
// a rim that an option leaves behind a closed panel. (A peek strip is meant to
// differ; run this on the other pages.)
//
//   node research/sidenav-minor/shut-leak.mjs <page> [themes] [width]
import process from 'node:process';
import { firefox } from 'playwright';

const [page, themeList, widthArg] = process.argv.slice(2);
const themes = (
    themeList ?? 'formal,light,dark,cyberpunk,synthwave,pastel,terminal,forest,blueprint,solstice,brutalism,deco,phantom,grotesk,nostromo,titanium'
).split(',');
const width = Number(widthArg ?? 1000);
const base = process.env.BASE ?? 'http://127.0.0.1:8761';
const browser = await firefox.launch();
const context = await browser.newContext({ viewport: { width, height: 700 }, reducedMotion: 'no-preference' });
let leaks = 0;
for (const theme of themes) {
    /** @type {Buffer[]} */
    const shots = [];
    for (const query of ['', '&plain']) {
        const tab = await context.newPage();
        await tab.goto(`${base}/research/sidenav-minor/${page}.html?still&theme=${theme}${query}`, { waitUntil: 'load' });
        await tab.waitForFunction((t) => document.documentElement.getAttribute('data-theme') === t, theme, { timeout: 8000 });
        await tab.evaluate(() => document.fonts.ready);
        // Open and shut once, so the closing effect has run and the panel stands in its shut state.
        const toggle = tab.locator('.kp-sidenav__launcher [data-kp-sidenav-toggle]');
        await toggle.click();
        await tab.waitForTimeout(2200);
        await toggle.click();
        await tab.waitForTimeout(2400);
        await tab.mouse.move(width - 5, 690);
        shots.push(await tab.screenshot({ clip: { x: 0, y: 60, width: 90, height: 600 } }));
        await tab.close();
    }
    const same = shots[0].equals(shots[1]);
    if (!same) leaks += 1;
    console.log(`${theme.padEnd(10)} ${same ? 'nothing left behind' : 'LEAK: the shut panel differs from the plain page along the edge'}`);
}
await browser.close();
process.exit(leaks === 0 ? 0 : 1);

// Opens research/sidenav-minor/behaviour.html in Firefox, puts it in each
// theme and takes one full-page screenshot per theme and width.
//   node research/sidenav-minor/walk.mjs <outDir> <wait seconds> <theme,theme> <width,width> [--port 8772]
import { firefox } from '@playwright/test';
import { mkdirSync } from 'node:fs';
const [out, wait = '8', themeList = 'formal', widthList = '1280'] = process.argv.slice(2);
const portAt = process.argv.indexOf('--port');
const port = portAt === -1 ? 8772 : Number(process.argv[portAt + 1]);
mkdirSync(out, { recursive: true });
const b = await firefox.launch();
for (const width of widthList.split(',').map(Number)) {
    for (const theme of themeList.split(',')) {
        const p = await (await b.newContext({ viewport: { width, height: width < 600 ? 780 : 900 } })).newPage();
        p.on('pageerror', (e) => console.log('pageerror:', e.message));
        await p.goto(`http://127.0.0.1:${port}/research/sidenav-minor/behaviour.html`);
        await p.evaluate(async (t) => {
            const { ensureRegister } = await import('/js/lazy-register.js');
            const { applyTheme } = await import('/js/theme-core.js');
            await ensureRegister(t, { pattern: '/css/{theme}-register.css' });
            applyTheme(t, { announce: false });
        }, theme);
        await p.waitForTimeout(Number(wait) * 1000);
        await p.screenshot({ path: `${out}/${theme}-${width}.png`, fullPage: true });
        await p.context().close();
        console.log(`${theme} ${width}`);
    }
}
await b.close();

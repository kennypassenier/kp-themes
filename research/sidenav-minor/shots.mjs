// research/sidenav-minor: screenshots of the frame pages in Firefox, to look at.
//
//   python3 -m http.server 8761 --bind 127.0.0.1      # from the repository root
//   node research/sidenav-minor/shots.mjs <outDir> <page> <themes,comma> <widths,comma> [states=closed,open] [modes=push] [query]
//
// Each shot waits for the theme's effect to finish (no-preference motion).
import { mkdirSync } from 'node:fs';
import process from 'node:process';
import { firefox } from 'playwright';

const [out, page, themeList, widthList, stateList = 'closed,open', modeList = 'push', query = ''] = process.argv.slice(2);
const base = process.env.BASE ?? 'http://127.0.0.1:8761';
mkdirSync(out, { recursive: true });
const browser = await firefox.launch();
for (const width of widthList.split(',').map(Number)) {
    const context = await browser.newContext({ viewport: { width, height: width < 600 ? 760 : 700 }, reducedMotion: 'no-preference' });
    for (const theme of themeList.split(',')) {
        for (const mode of modeList.split(',')) {
            const tab = await context.newPage();
            await tab.goto(`${base}/research/sidenav-minor/${page}.html?still&theme=${theme}${query ? `&${query}` : ''}`, { waitUntil: 'load' });
            await tab.waitForFunction((t) => document.documentElement.getAttribute('data-theme') === t, theme, { timeout: 8000 });
            await tab.evaluate(() => document.fonts.ready);
            await tab.waitForTimeout(500);
            const arrange = await tab.evaluate(async (m) => {
                const { sidenavOf } = await import('/js/sidenav.js');
                const nav = document.querySelector('.kp-sidenav');
                const handle = sidenavOf(nav);
                if (!handle) return 'no handle';
                if (m === 'gutter') nav.setAttribute('data-kp-sidenav-reserve', '');
                if (m !== 'narrow') handle.setMode(m === 'over' ? 'over' : 'push');
                return 'ok';
            }, mode);
            if (arrange !== 'ok') console.log(theme, mode, arrange);
            await tab.waitForTimeout(400);
            for (const state of stateList.split(',')) {
                const toggle = tab.locator('.kp-sidenav__launcher [data-kp-sidenav-toggle]');
                const isOpen = (await tab.locator('.kp-sidenav').getAttribute('data-kp-sidenav-open')) === 'true';
                if ((state === 'open') !== isOpen) {
                    await toggle.click();
                    await tab.waitForTimeout(2600);
                } else await tab.waitForTimeout(300);
                await tab.mouse.move(width - 5, 5);
                await tab.screenshot({ path: `${out}/${page}-${theme}-${width}-${mode}-${state}.png` });
            }
            await tab.close();
        }
    }
    await context.close();
}
await browser.close();

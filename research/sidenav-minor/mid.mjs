// research/sidenav-minor: the panel part-way through its opening, with an option and
// without (?plain), side by side, in every theme: a contact sheet to look at. It
// presses the launcher, pauses every animation and transition that starts and seeks
// them all to the same share of their run, then photographs the window's start edge.
// An option that leaves the theme's own opening behind shows here: its chrome stands
// complete while the theme's still draws itself in.
//
//   node research/sidenav-minor/mid.mjs <outFile.png> <page> <share 0..1> [themes] [mode=push] [query]
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import process from 'node:process';
import { firefox } from 'playwright';

const [out, page, shareArg, themeList, mode = 'push', query = ''] = process.argv.slice(2);
const share = Number(shareArg);
const themes = (
    themeList ?? 'formal,light,dark,cyberpunk,synthwave,pastel,terminal,forest,blueprint,solstice,brutalism,deco,phantom,grotesk,nostromo,titanium'
).split(',');
const base = process.env.BASE ?? 'http://127.0.0.1:8761';
const browser = await firefox.launch();
const context = await browser.newContext({ viewport: { width: 900, height: 560 }, reducedMotion: 'no-preference' });
/** @type {{ theme: string, kind: string, data: string }[]} */
const cells = [];
for (const theme of themes) {
    for (const kind of ['option', 'plain']) {
        const tab = await context.newPage();
        await tab.goto(
            `${base}/research/sidenav-minor/${page}.html?still&theme=${theme}${kind === 'plain' ? '&plain' : ''}${query ? `&${query}` : ''}`,
            { waitUntil: 'load' },
        );
        await tab.waitForFunction((t) => document.documentElement.getAttribute('data-theme') === t, theme, { timeout: 8000 });
        await tab.evaluate(() => document.fonts.ready);
        await tab.waitForTimeout(500);
        await tab.evaluate(async (m) => {
            const { sidenavOf } = await import('/js/sidenav.js');
            const nav = document.querySelector('.kp-sidenav');
            const handle = sidenavOf(nav);
            if (m === 'gutter') nav.setAttribute('data-kp-sidenav-reserve', '');
            handle.setMode(m === 'over' ? 'over' : 'push');
        }, mode);
        await tab.waitForTimeout(700);
        await tab.evaluate((frac) => {
            document.querySelector('.kp-sidenav__launcher [data-kp-sidenav-toggle]').click();
            return new Promise((resolve) =>
                requestAnimationFrame(() =>
                    requestAnimationFrame(() => {
                        for (const a of document.getAnimations()) {
                            const t = a.effect?.getComputedTiming();
                            if (!t || !Number.isFinite(t.endTime)) continue;
                            a.pause();
                            a.currentTime = (t.delay ?? 0) + frac * (t.endTime - (t.delay ?? 0));
                        }
                        resolve(null);
                    }),
                ),
            );
        }, share);
        await tab.waitForTimeout(150);
        const png = await tab.screenshot({ clip: { x: 0, y: 0, width: 560, height: 420 } });
        cells.push({ theme, kind, data: png.toString('base64') });
        await tab.close();
    }
}
const html = `<body style="margin:0;background:#888;font:12px sans-serif;display:grid;grid-template-columns:repeat(4,280px);gap:4px">${cells
    .map(
        (c) =>
            `<figure style="margin:0"><img width="280" src="data:image/png;base64,${c.data}"/><figcaption style="color:#fff">${c.theme} ${c.kind}</figcaption></figure>`,
    )
    .join('')}</body>`;
const sheet = await context.newPage();
await sheet.setViewportSize({ width: 1140, height: 100 });
await sheet.setContent(html);
await sheet.waitForTimeout(300);
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, await sheet.screenshot({ fullPage: true }));
await browser.close();

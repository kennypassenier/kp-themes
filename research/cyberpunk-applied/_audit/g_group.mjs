// @ts-nocheck: scratch
import { firefox, chromium } from '@playwright/test';
import { serve, openTheme } from './lib.mjs';
const server = await serve();
const base = `http://127.0.0.1:${server.address().port}`;
for (const eng of ['firefox', 'chromium']) {
    const b = await (eng === 'chromium' ? chromium : firefox).launch();
    const { page } = await openTheme(b, `${base}/catalogue/navigation.html`);
    const t = page.locator('.kp-sidenav__category-toggle').first();
    await t.scrollIntoViewIfNeeded();
    const sample = async () =>
        page.evaluate(
            () =>
                new Promise((res) => {
                    const sub = document.querySelector('.kp-sidenav__submenu');
                    const tg = document.querySelector('.kp-sidenav__category-toggle');
                    const out = [];
                    const t0 = performance.now();
                    const f = () => {
                        out.push([
                            Math.round(performance.now() - t0),
                            Math.round(sub.getBoundingClientRect().height * 10) / 10,
                            getComputedStyle(tg, '::after').rotate,
                        ]);
                        if (performance.now() - t0 < 500) requestAnimationFrame(f);
                        else res(out);
                    };
                    requestAnimationFrame(f);
                }),
        );
    const wasOpen = await t.getAttribute('aria-expanded');
    const run = async () => {
        const p = sample();
        await t.click();
        return p;
    };
    const a = await run();
    await page.waitForTimeout(400);
    const c = await run();
    const poses = (x) => [...new Set(x.map((r) => r[1] + '/' + r[2]))].join(' ');
    console.log(eng, 'start', wasOpen, '\n A', poses(a), '\n B', poses(c));
    await b.close();
}
server.close();

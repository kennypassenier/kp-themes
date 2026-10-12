// @ts-nocheck: scratch: hover and press probe for parts the pointing audit could not scroll to
import { firefox } from '@playwright/test';
import { serve, openTheme } from './lib.mjs';
const server = await serve();
const base = `http://127.0.0.1:${server.address().port}`;
const b = await firefox.launch();
const { page } = await openTheme(b, `${base}/research/cyberpunk-applied/demo.html`);
for (const sel of [
    'button.kp-calendar__day:not([disabled])',
    '.kp-chart__source',
    '.kp-chart__plot',
    'a.kp-url',
    '.kp-button--sm',
    '.kp-datepicker__day',
]) {
    const loc = page.locator(sel);
    const n = await loc.count();
    let done = false;
    for (let i = 0; i < n && !done; i++) {
        const l = loc.nth(i);
        if (!(await l.isVisible())) continue;
        await l.evaluate((e) => e.scrollIntoView({ block: 'center' }));
        await page.waitForTimeout(300);
        const r = await l.boundingBox();
        if (!r || r.width < 2) continue;
        const read = () =>
            l.evaluate((e) => {
                const c = getComputedStyle(e);
                return {
                    p: c.getPropertyValue('--kp-cp-p').trim(),
                    shadow: c.boxShadow.slice(0, 70),
                    clip: c.clipPath.slice(0, 20),
                    t: c.translate + '/' + c.transform,
                };
            });
        await page.mouse.move(2, 2);
        await page.waitForTimeout(300);
        const rest = await read();
        await page.mouse.move(r.x + Math.min(r.width / 2, 20), r.y + r.height / 2);
        await page.waitForTimeout(400);
        const hov = await read();
        await page.mouse.down();
        await page.waitForTimeout(300);
        const act = await read();
        await page.mouse.up();
        await page.mouse.move(2, 2);
        console.log(sel, i, JSON.stringify({ rest, hov, act }));
        done = true;
    }
    if (!done) console.log(sel, 'no visible instance in the demo', n);
}
await b.close();
server.close();

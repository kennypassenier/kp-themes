// @ts-nocheck: scratch
import { firefox } from '@playwright/test';
import { serve, openTheme } from './lib.mjs';
const server = await serve();
const base = `http://127.0.0.1:${server.address().port}`;
const b = await firefox.launch();
const { page } = await openTheme(b, `${base}/catalogue/${process.argv[2]}.html`);
const loc = page.locator(process.argv[3]).first();
await loc.scrollIntoViewIfNeeded();
const read = () =>
    loc.evaluate((el) => {
        const a = getComputedStyle(el, '::after');
        return {
            p: getComputedStyle(el).getPropertyValue('--kp-cp-p'),
            t: getComputedStyle(el).getPropertyValue('--kp-cp-t'),
            size: a.backgroundSize.slice(-80),
            hov: el.matches(':hover'),
            parent: el.parentElement.className,
            lp: getComputedStyle(el.parentElement).getPropertyValue('--kp-cp-p'),
            lsw: getComputedStyle(el.closest('label') || el.parentElement).backgroundSize.slice(-60),
        };
    });
console.log('rest', await read());
await loc.hover();
await page.waitForTimeout(500);
console.log('hover', await read());
await b.close();
server.close();

// @ts-nocheck: scratch: focus one inline link by keyboard, shot it
import { firefox } from '@playwright/test';
import { serve, openTheme } from './lib.mjs';
const server = await serve();
const base = `http://127.0.0.1:${server.address().port}`;
const b = await firefox.launch();
const { page } = await openTheme(b, `${base}/catalogue/${process.argv[2]}.html`);
const sel = process.argv[3];
const loc = page.locator(sel).first();
await loc.scrollIntoViewIfNeeded();
await page.keyboard.press('Tab');
await loc.focus();
await page.waitForTimeout(700);
console.log(
    await loc.evaluate((el) => {
        const c = getComputedStyle(el);
        const a = getComputedStyle(el, '::after');
        const bb = getComputedStyle(el, '::before');
        return {
            fp: c.getPropertyValue('--kp-cp-fp'),
            bg: c.backgroundImage.slice(0, 80),
            outline: c.outlineStyle,
            aft: a.content + ' ' + a.backgroundImage.slice(0, 60),
            bef: bb.content,
            fv: el.matches(':focus-visible'),
            cls: el.className,
            text: el.textContent.slice(0, 30),
            parent: el.parentElement.tagName + '.' + el.parentElement.className,
        };
    }),
);
const r = await loc.boundingBox();
await page.screenshot({
    path: process.argv[4],
    clip: { x: Math.max(0, r.x - 16), y: Math.max(0, r.y - 16), width: r.width + 32, height: r.height + 32 },
});
await b.close();
server.close();

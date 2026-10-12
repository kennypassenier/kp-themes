// @ts-nocheck: scratch helper for the leftovers round: zoomed screenshots of cut parts at rest, hover and focus
import { firefox } from '@playwright/test';
import { serve, ROOT } from './lib.mjs';
const out = process.argv[2];
const server = await serve();
const base = `http://127.0.0.1:${server.address().port}`;
const b = await firefox.launch();
async function open(url) {
    const context = await b.newContext({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 8, reducedMotion: 'no-preference' });
    await context.addInitScript(() => localStorage.setItem('theme', 'cyberpunk'));
    const page = await context.newPage();
    await page.goto(url);
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(1200);
    await page.evaluate(() => {
        document.documentElement.setAttribute('data-theme', 'cyberpunk');
        for (const el of document.querySelectorAll('.cat-block[hidden], .cat-component[hidden], .cat-section[hidden], .cat-group[hidden]'))
            el.removeAttribute('hidden');
    });
    return page;
}
async function shot(page, sel, name, { pad = 8, n = 0 } = {}) {
    const loc = page.locator(sel).nth(n);
    await loc.scrollIntoViewIfNeeded();
    const r = await loc.boundingBox();
    await page.screenshot({
        path: `${out}/${name}.png`,
        clip: { x: Math.max(0, r.x - pad), y: Math.max(0, r.y - pad), width: r.width + pad * 2, height: r.height + pad * 2 },
    });
}
const targets = [
    ['field', 'input.kp-field__check[type=checkbox]', 'check'],
    ['table', 'td input.kp-field__check[type=checkbox]', 'check2'],
    ['data', '.kp-calendar__day', 'calday'],
    ['datepicker', '.kp-datepicker__day', 'dpday'],
    ['datepicker', '.kp-datepicker__title', 'dptitle'],
    ['table', '.kp-datatable__search', 'search'],
    ['structure', '.kp-accordion__item', 'accitem'],
];
for (const [pg, sel, name] of targets) {
    const page = await open(`${base}/catalogue/${pg}.html`);
    try {
        const loc = page.locator(sel).first();
        await shot(page, sel, `${name}-rest`);
        await loc.hover();
        await page.waitForTimeout(700);
        await shot(page, sel, `${name}-hover`);
        await page.mouse.move(0, 0);
        await page.keyboard.press('Tab');
        await loc.focus();
        await page.waitForTimeout(700);
        const f = await page.evaluate(() => document.activeElement?.className + ' ' + document.activeElement?.matches(':focus-visible'));
        console.log(name, 'active:', f);
        await shot(page, sel, `${name}-focus`);
    } catch (e) {
        console.log(name, 'ERR', e.message.split('\n')[0]);
    }
    await page.context().close();
}
await b.close();
server.close();

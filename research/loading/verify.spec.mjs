// The loading research demo against its twin on today's route [research/loading].
//
// Two pages with identical markup: research/loading/demo.html (shared
// stylesheets, the register fetched lazily, the scripts split per
// component and per hook) and research/loading/out/demo-today.html
// (every register linked, js/auto.js). The paint must be the same on
// both — under formal, and after a switch to cyberpunk — and the
// network log must show what each strategy claims: one register and the
// modules the markup asks for on the demo, twenty-two registers and
// everything on the twin.
//
// Not part of the suite: it lives beside the research it verifies. To
// run it, copy it to tests/tmp-loading-research.spec.mjs (the tmp-
// prefix is prettier-ignored for exactly this) and run
//   KP_TEST_PORT=4183 npx playwright test tests/tmp-loading-research.spec.mjs --project=firefox
// then delete the copy. The port keeps it off a server another checkout
// may be running (see playwright.config.mjs).

import { expect, test } from '@playwright/test';

const SPLIT = '/research/loading/demo.html';
const TODAY = '/research/loading/out/demo-today.html';

const SAMPLE = ['[data-kp-surface="hero"]', 'h1', 'mark', '.kp-button--primary', '.kp-card', '.kp-nav', '.kp-marquee', '#readout'];
const PROPS = ['color', 'backgroundColor', 'fontFamily', 'fontSize', 'borderColor', 'boxShadow', 'clipPath', 'letterSpacing', 'opacity'];

/** @param {import('@playwright/test').Page} page */
const paint = (page) =>
    page.evaluate(
        ([selectors, props]) =>
            selectors.map((selector) => {
                const el = document.querySelector(selector);
                if (!el) return `${selector}: absent`;
                const style = /** @type {Record<string, string>} */ (/** @type {unknown} */ (getComputedStyle(el)));
                return `${selector}: ${props.map((p) => `${p}=${style[p]}`).join(' ')}`;
            }),
        [SAMPLE, PROPS],
    );

/** @param {import('@playwright/test').Page} page */
const settle = (page) =>
    page.evaluate(async () => {
        await document.fonts.ready;
        for (const animation of document.getAnimations()) {
            try {
                if (animation.effect?.getTiming().iterations === Infinity) animation.cancel();
                else animation.finish();
            } catch {
                animation.cancel();
            }
        }
    });

/** @param {import('@playwright/test').Page} page */
const fetched = (page) =>
    page.evaluate(() => {
        const rows = performance
            .getEntriesByType('resource')
            .map((e) => ({ name: new URL(e.name).pathname, bytes: /** @type {PerformanceResourceTiming} */ (e).decodedBodySize }));
        const of = (/** @type {string} */ ext) => rows.filter((r) => r.name.endsWith(ext));
        return {
            css: of('.css').length,
            cssBytes: of('.css').reduce((a, r) => a + r.bytes, 0),
            registers: of('.css').filter((r) => r.name.includes('-register')).length,
            js: of('.js').length,
            jsBytes: of('.js').reduce((a, r) => a + r.bytes, 0),
            jsFiles: of('.js').map((r) => r.name.split('/').slice(-2).join('/')),
        };
    });

/** @param {import('@playwright/test').Browser} browser @param {string} url */
async function open(browser, url) {
    // Its own context, so the once-per-session memo of the reveals starts empty and the headline plays.
    const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await context.newPage();
    // Anything the page throws or warns is printed with the page's name: a
    // difference between the two routes may be an error on one of them.
    page.on('pageerror', (error) => console.log(`[${url}] pageerror: ${error.message}\n${error.stack ?? ''}`));
    page.on('console', (message) => {
        if (message.type() === 'error' || message.type() === 'warning') console.log(`[${url}] console.${message.type()}: ${message.text()}`);
    });
    await page.goto(url);
    await played(page);
    await settle(page);
    return page;
}

/** Both load-time reveals have run: the headline and the lede's marks (1.5 s delay plus the stagger, on today's route). */
const played = (/** @type {import('@playwright/test').Page} */ page) =>
    page.waitForFunction(
        () =>
            document.querySelector('h1')?.getAttribute('data-kp-reveal-state') === 'played' &&
            document.querySelector('[data-kp-reveal="emphasis"]')?.getAttribute('data-kp-reveal-state') === 'played',
        null,
        { timeout: 15000 },
    );

test('the split demo paints what today’s twin paints, under formal and after a switch to cyberpunk', async ({ browser }) => {
    const split = await open(browser, SPLIT);
    const today = await open(browser, TODAY);

    // The headline played on both and is visible [KT16: read until it is the value].
    for (const page of [split, today])
        await expect.poll(() => page.evaluate(() => getComputedStyle(/** @type {Element} */ (document.querySelector('h1'))).opacity)).toBe('1');
    expect(await paint(split)).toEqual(await paint(today));

    const before = { split: await fetched(split), today: await fetched(today) };
    expect(before.split.registers).toBe(1);
    expect(before.today.registers).toBe(22);
    expect(before.split.jsFiles).not.toContain('js/datatable.js');
    expect(before.today.jsFiles).toContain('js/datatable.js');

    for (const page of [split, today]) {
        await page.click('[data-kp-theme="cyberpunk"]');
        await page.waitForFunction(() => document.documentElement.dataset.theme === 'cyberpunk');
        await settle(page);
    }
    // The register arrives after the click on the split page; the paint is read until it matches.
    const states = (/** @type {import('@playwright/test').Page} */ page) =>
        page.evaluate(() => ({
            marks: [...document.querySelectorAll('mark')].map((m) => m.className),
            emphasis: document.querySelector('[data-kp-reveal="emphasis"]')?.getAttribute('data-kp-reveal-state'),
            headline: document.querySelector('h1')?.getAttribute('data-kp-reveal-state'),
            done: document.documentElement.hasAttribute('data-kp-effects-done'),
        }));
    console.log(JSON.stringify({ split: await states(split), today: await states(today) }));
    // Both paints are re-read on every poll: a snapshot of one page taken
    // once would compare the other against a moment that has passed.
    await expect
        .poll(async () => {
            const [a, b] = await Promise.all([paint(split), paint(today)]);
            return a.every((line, i) => line === b[i]) ? 'same' : JSON.stringify({ split: a, today: b }, null, 1);
        })
        .toBe('same');

    const after = { split: await fetched(split), today: await fetched(today) };
    expect(after.split.registers).toBe(2);
    expect(after.today.registers).toBe(22);
    console.log(JSON.stringify({ before, after }, null, 2));
});

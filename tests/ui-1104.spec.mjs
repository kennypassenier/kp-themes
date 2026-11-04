// Connection band, tab labels, a growing column, toolbar chips and the syncing state [ui-1104].
//
// Every assertion reads the paint (boxes, computed layout), at 1280 and 390, never an attribute alone. The fixture holds each
// part twice, today's default beside the opt-in, so a test compares the two in one page.

import { expect, test } from '@playwright/test';

const FIXTURE = '/tests/fixtures/ui-1104.html';
const WIDTHS = [1280, 390];

/** @param {import('@playwright/test').Page} page @param {number} width */
async function open(page, width) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(FIXTURE);
    await page.waitForSelector('[data-fixture-ready]');
}

/** How far the title stands from the band's top, per state. @param {import('@playwright/test').Page} page @param {string} id */
async function titleTops(page, id) {
    const tops = {};
    for (const [name, state, detail] of [
        ['offline', 'offline', {}],
        ['offline with a count', 'offline', { pending: 3 }],
        ['refused', 'refused', { why: 'The server refused the change and nothing was lost, try again in a moment.' }],
        ['reconnecting', 'reconnecting', {}],
        ['syncing', 'syncing', { pending: 2 }],
    ]) {
        tops[name] = await page.evaluate(
            ([i, s, d]) => {
                window.setConnection(document.getElementById(i), s, d);
                const q = (sel) => document.querySelector(`#${i} ${sel}`).getBoundingClientRect();
                return { top: q('.kp-connection__title').top - q('.kp-connection__band').top, band: q('.kp-connection__band').height, retry: q('.kp-connection__retry').width };
            },
            [id, state, detail],
        );
    }
    return tops;
}

for (const width of WIDTHS) {
    test.describe(`at ${width}`, () => {
        test('the steady band starts its words at the top in every state; the default does not', { tag: ['@component:feedback'] }, async ({ page }) => {
            await open(page, width);
            const steady = await titleTops(page, 'conn-steady');
            const tops = Object.values(steady).map((s) => s.top);
            expect(Math.max(...tops) - Math.min(...tops)).toBeLessThan(0.5);
            expect(new Set(Object.values(steady).map((s) => Math.round(s.band))).size).toBe(1);
            expect(new Set(Object.values(steady).map((s) => Math.round(s.retry))).size).toBe(1);
            const plain = Object.values(await titleTops(page, 'conn-default')).map((s) => s.top);
            expect(Math.max(...plain) - Math.min(...plain)).toBeGreaterThan(5);
        });

        test('syncing shows the info plate, a spinner, the count and an unreachable Retry', { tag: ['@component:feedback'] }, async ({ page }) => {
            await open(page, width);
            const banner = page.locator('#conn-default');
            await page.evaluate(() => window.setConnection(document.getElementById('conn-default'), 'syncing', { pending: 3 }));
            await expect(banner).toHaveAttribute('data-kp-state', 'syncing');
            await expect(banner.locator('.kp-connection__title')).toHaveText('Syncing 3 changes');
            await expect(banner.locator('.kp-connection__band')).toHaveClass(/kp-alert--info/);
            await expect(banner.locator('.kp-connection__mark .kp-spinner')).toHaveCount(1);
            await expect(banner.locator('.kp-connection__retry')).toHaveAttribute('data-kp-idle', '');
            await expect(banner.locator('.kp-connection__retry')).toHaveCSS('visibility', 'hidden');
            await page.evaluate(() => window.setConnection(document.getElementById('conn-default'), 'online'));
            await expect(banner.locator('.kp-connection__title')).toHaveText('Connected again');
        });

        test('wrapped tab labels take two lines, show whole words and keep the icons on one line', { tag: ['@component:navigation'] }, async ({ page }) => {
            await open(page, width);
            const m = await page.evaluate(() => {
                const read = (id) => {
                    const labels = [...document.querySelectorAll(`#${id} .kp-tabbar__label`)];
                    return {
                        cut: labels.some((l) => l.scrollWidth > l.clientWidth + 1 || l.scrollHeight > l.clientHeight + 1),
                        lines: Math.max(...labels.map((l) => Math.round(l.getBoundingClientRect().height / parseFloat(getComputedStyle(l).lineHeight)))),
                        icons: new Set([...document.querySelectorAll(`#${id} .kp-tabbar__icon`)].map((e) => Math.round(e.getBoundingClientRect().top))).size,
                    };
                };
                return { plain: read('tabs-default'), wrap: read('tabs-wrap') };
            });
            expect(m.wrap.cut).toBe(false);
            expect(m.wrap.icons).toBe(1);
            expect(m.wrap.lines).toBeLessThanOrEqual(2);
            if (width === 390) {
                expect(m.plain.cut).toBe(true);
                expect(m.wrap.lines).toBe(2);
            }
        });

        test('a grow column takes the room the others leave', { tag: ['@component:datatable'] }, async ({ page }) => {
            await open(page, width);
            const cols = await page.evaluate(() => {
                const read = (id) => [...document.querySelectorAll(`#${id} th`)].map((e) => e.getBoundingClientRect().width);
                return { plain: read('table-default'), grow: read('table-grow') };
            });
            // The description is the second column: wider with the hint, the meter beside it back at its own width.
            expect(cols.grow[1]).toBeGreaterThan(cols.plain[1] + 10);
            expect(cols.grow[2]).toBeLessThanOrEqual(cols.plain[2]);
        });

        test('wrapping chips stay inside the toolbar; the default line still scrolls on a phone', { tag: ['@component:data'] }, async ({ page }) => {
            await open(page, width);
            const m = await page.evaluate(() => {
                const read = (id) => {
                    const g = document.querySelector(`#${id} .kp-segmented--chips`);
                    const box = g.getBoundingClientRect();
                    return { scrolls: g.scrollWidth > g.clientWidth + 1, cut: [...g.children].some((c) => c.getBoundingClientRect().right > box.right + 1) };
                };
                return { plain: read('toolbar-default'), wrap: read('toolbar-wrap') };
            });
            expect(m.wrap).toEqual({ scrolls: false, cut: false });
            expect(m.plain.scrolls).toBe(width === 390);
        });
    });
}

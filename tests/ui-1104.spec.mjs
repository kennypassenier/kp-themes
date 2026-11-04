// Connection band, tab labels, a growing column, toolbar chips, the syncing state and the formal page title [ui-1104, chips-1270, title-1270].
//
// Every assertion reads the paint (boxes, computed layout), at 1280 and 390, never an attribute alone. The fixture holds each
// part twice, today's default beside the opt-in, so a test compares the two in one page.

import { expect, test } from '@playwright/test';
import { EFFECTS_REPEAT_ATTRIBUTE, noFlashSnippet } from '../js/no-flash.js';
import { MEMO_PREFIX, REPEAT_ATTRIBUTE } from '../js/effects-core/knobs.js';

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

        test('chips wrap by default and in a stacked toolbar; "scroll" keeps the one line [chips-1270]', { tag: ['@component:data'] }, async ({ page }) => {
            await open(page, width);
            const m = await page.evaluate(() => {
                const read = (id) => {
                    const g = document.querySelector(`#${id} .kp-segmented--chips`);
                    const group = g.closest('.kp-toolbar__group').getBoundingClientRect();
                    const box = g.getBoundingClientRect();
                    const rows = new Set([...g.children].map((c) => Math.round(c.getBoundingClientRect().top))).size;
                    return {
                        scrolls: g.scrollWidth > g.clientWidth + 1,
                        cut: [...g.children].some((c) => c.getBoundingClientRect().right > box.right + 1),
                        lastRight: Math.round(Math.max(...[...g.children].map((c) => c.getBoundingClientRect().right))),
                        groupRight: Math.round(group.right),
                        rows,
                    };
                };
                return {
                    plain: read('toolbar-default'),
                    wrap: read('toolbar-wrap'),
                    scroll: read('toolbar-scroll'),
                    stacked: read('toolbar-stacked'),
                    stackedScroll: read('toolbar-stacked-scroll'),
                };
            });
            for (const name of ['plain', 'wrap', 'stacked']) {
                expect(m[name].scrolls, `${name} does not scroll`).toBe(false);
                expect(m[name].cut, `${name} cuts no chip`).toBe(false);
                expect(m[name].lastRight, `${name} last chip inside its group`).toBeLessThanOrEqual(m[name].groupRight);
            }
            expect(m.plain).toEqual(m.wrap);
            // The stacked toolbar sits in a 14rem column: four chips never fit one row.
            expect(m.stacked.rows).toBeGreaterThan(1);
            expect(m.stackedScroll.scrolls).toBe(true);
            expect(m.stackedScroll.rows).toBe(1);
            expect(m.scroll.scrolls).toBe(width === 390);
            if (width === 390) expect(m.plain.rows).toBeGreaterThan(1);
            // Desktop is unchanged: one row of four chips.
            else expect(m.plain.rows).toBe(1);
        });
    });
}

// The formal page title [title-1270; Kenny, 2026-11-04, "Herbezoek en kortere veeg"].
const CONCEPT = '/examples/concept.html';

/** The page h1's clip, per frame, as the share of the title that shows (0 hidden, 1 whole). @param {import('@playwright/test').Page} page */
async function recordTitle(page) {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.addInitScript(() => {
        localStorage.setItem('theme', 'formal');
        window.__title = [];
        const tick = () => {
            const h = document.querySelector('h1[data-kp-reveal="headline"]');
            const m = h && getComputedStyle(h).clipPath.match(/inset\([^ ]+ (?:calc\()?([\d.]+)%/);
            if (h) window.__title.push([performance.now(), m ? 1 - parseFloat(m[1]) / 100 : 1]);
            requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    });
}

test.describe('the page title wipe and the repeat view [title-1270]', { tag: ['@component:page-effects'] }, () => {
    test('the snippet and the module name the same marker and memo prefix; repeat:false leaves the marker out', () => {
        expect(EFFECTS_REPEAT_ATTRIBUTE).toBe(REPEAT_ATTRIBUTE);
        expect(noFlashSnippet({ effects: true })).toContain(`'${MEMO_PREFIX}'`.replace(/'/g, '"'));
        expect(noFlashSnippet({ effects: true })).toContain(REPEAT_ATTRIBUTE);
        expect(noFlashSnippet({ effects: true, repeat: false })).not.toContain(REPEAT_ATTRIBUTE);
        expect(noFlashSnippet({ effects: false })).not.toContain(REPEAT_ATTRIBUTE);
    });

    test('the first view wipes the title in 240 ms, linear; the knob changes it', async ({ page }) => {
        await recordTitle(page);
        await page.setViewportSize({ width: 1280, height: 900 });
        await page.goto(CONCEPT);
        await page.locator('h1[data-kp-reveal="headline"].is-deciphered').waitFor();
        await page.waitForTimeout(600);
        const frames = await page.evaluate(() => window.__title);
        const start = frames.find(([, shown]) => shown > 0.02 && shown < 0.98);
        const at = (share) => frames.find(([t, shown]) => t >= start[0] && shown >= share)[0] - start[0];
        // Linear: half shown at about half the time, nine tenths at about nine tenths of 240 ms (a frame is 17 ms).
        expect(at(0.5)).toBeGreaterThan(90);
        expect(at(0.5)).toBeLessThan(150);
        expect(at(0.9)).toBeGreaterThan(190);
        expect(at(0.9)).toBeLessThan(250);
        await expect(page.locator('h1[data-kp-reveal="headline"]')).toHaveCSS('transition-duration', '0.24s');
        await page.evaluate(() => document.documentElement.style.setProperty('--kp-title-wipe-time', '600ms'));
        await expect(page.locator('h1[data-kp-reveal="headline"]')).toHaveCSS('transition-duration', '0.6s');
    });

    test('a repeat view shows the whole title from the first frame and never wipes it', async ({ page }) => {
        await recordTitle(page);
        await page.setViewportSize({ width: 1280, height: 900 });
        await page.goto(CONCEPT);
        await page.locator('h1[data-kp-reveal="headline"].is-deciphered').waitFor();
        await page.goto(CONCEPT);
        await page.locator('h1[data-kp-reveal="headline"][data-kp-reveal-state="rest"]').waitFor();
        await page.waitForTimeout(500);
        const frames = await page.evaluate(() => window.__title);
        expect(frames.length).toBeGreaterThan(5);
        expect(Math.min(...frames.map(([, shown]) => shown)), 'every frame shows the whole title').toBe(1);
    });
});

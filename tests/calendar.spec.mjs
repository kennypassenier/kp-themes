// The month heatmap [scope-143], port spec I.1.7 and the two I.1.6 points
// the round-two demo verified (research/dashboard-ports-2/README.md §5).
//
// Driven on catalogue/data.html#calendar, whose sample clock stands at
// 04/10/2026 14:40 in Brussels. The browser is put in New York for the whole
// file: every day the calendar names must still be the Brussels one (rule 52).

import { test, expect } from '@playwright/test';
import { waitForJudging } from './helpers/catalogue.mjs';
import { useEmptyRegister } from './helpers/empty-register.mjs';
import { ALL_THEMES } from './helpers/sweep-themes.mjs';
import { DEFAULT_STRINGS as S } from '../js/strings.js';

const URL = '/catalogue/data.html#calendar';
const WIDE = '#calendar [data-cat-calendar]:not(.cat-calendar-frame) [data-kp-calendar]';
const PHONE = '#calendar .cat-calendar-frame [data-kp-calendar]';

test.use({ timezoneId: 'America/New_York' });

/** @param {import('@playwright/test').Page} page */
const open = async (page) => {
    await useEmptyRegister(page.context());
    await page.goto(URL);
    await waitForJudging(page);
    await expect(page.locator(`${WIDE} [data-kp-date="2026-10-04"]`)).toBeVisible();
};

/** The rows of a calendar's grid: how many, how far their heights spread, and the grid's height. @param {import('@playwright/test').Locator} cal */
const rows = (cal) =>
    cal.evaluate((el) => {
        const heights = [...el.querySelectorAll('tbody tr')].map((r) => r.getBoundingClientRect().height);
        return {
            title: el.querySelector('.kp-calendar__title')?.textContent ?? '',
            count: heights.length,
            spread: Math.max(...heights) - Math.min(...heights),
            grid: Math.round(/** @type {HTMLElement} */ (el.querySelector('.kp-calendar__grid')).getBoundingClientRect().height * 2) / 2,
        };
    });

test(
    "October back to February: six rows every month, all one height (I.1.7 1) [scope-143]; today's ring and a title on one line in 19 themes [fix-98]",
    { tag: ['@component:data', '@component:catalogue'] },
    async ({ page }) => {
        await open(page);
        for (const sel of [WIDE, PHONE]) {
            const cal = page.locator(sel);
            const seen = [];
            for (let i = 0; i <= 8; i += 1) {
                seen.push(await rows(cal));
                if (i < 8) await cal.locator('[data-kp-calendar-prev]').click();
            }
            expect(seen.map((m) => m.title)).toEqual([
                'October 2026',
                'September 2026',
                'August 2026',
                'July 2026',
                'June 2026',
                'May 2026',
                'April 2026',
                'March 2026',
                'February 2026',
            ]);
            for (const m of seen) {
                expect(m.count, m.title).toBe(6);
                expect(m.spread, m.title).toBeLessThanOrEqual(0.5);
            }
            expect(new Set(seen.map((m) => m.grid)).size).toBe(1);
        }
        // fix-98, in all 22 themes, wide and in the phone pane: today's ring
        // reads 3:1 or more against its plate (1.29:1 in Shade (light)), and in
        // August, September and October the title and every nav button sit on
        // one line and the calendar keeps one height (the title took up to six
        // lines in nostromo's phone pane).
        const misses = [];
        for (const theme of ALL_THEMES) {
            await page.evaluate((t) => {
                document.documentElement.dataset.theme = t;
            }, theme);
            await page.evaluate(() => document.fonts.ready);
            for (const sel of [WIDE, PHONE]) {
                const cal = page.locator(sel);
                await cal.locator('[data-kp-calendar-today]').click();
                const heights = new Set();
                for (let i = 0; i < 3; i += 1) {
                    const got = await cal.evaluate((el) => {
                        const cv = document.createElement('canvas');
                        cv.width = cv.height = 1;
                        const cx = /** @type {CanvasRenderingContext2D} */ (cv.getContext('2d', { willReadFrequently: true }));
                        /** @param {string} c */
                        const rgb = (c) => {
                            cx.clearRect(0, 0, 1, 1);
                            cx.fillStyle = c;
                            cx.fillRect(0, 0, 1, 1);
                            return [...cx.getImageData(0, 0, 1, 1).data.slice(0, 3)];
                        };
                        /** @param {number[]} c */
                        const lum = (c) => {
                            const [r, g, b] = c.map((v) => (v / 255 <= 0.04045 ? v / 255 / 12.92 : ((v / 255 + 0.055) / 1.055) ** 2.4));
                            return 0.2126 * r + 0.7152 * g + 0.0722 * b;
                        };
                        const today = el.querySelector('[data-kp-today]');
                        let ring = 99;
                        if (today) {
                            const plate = lum(rgb(getComputedStyle(today).backgroundColor));
                            const shadow = getComputedStyle(today).boxShadow;
                            const ink = lum(rgb((shadow.match(/^[a-z-]+\((?:[^()]|\([^)]*\))*\)/) ?? ['transparent'])[0]));
                            ring = (Math.max(ink, plate) + 0.05) / (Math.min(ink, plate) + 0.05);
                        }
                        const nav = /** @type {HTMLElement} */ (el.querySelector('.kp-calendar__nav'));
                        /** The lines a label's text takes: its line boxes' distinct tops. @param {Element} n */
                        const lines = (n) => {
                            const range = document.createRange();
                            range.selectNodeContents(n);
                            return new Set([...range.getClientRects()].filter((r) => r.width > 0).map((r) => Math.round(r.top))).size;
                        };
                        return {
                            title: nav.querySelector('.kp-calendar__title')?.textContent ?? '',
                            wrapped: [...nav.children].filter(
                                (n) => lines(n) > 1 || n.getBoundingClientRect().right > el.getBoundingClientRect().right + 1,
                            ).length,
                            ring,
                            height: Math.round(el.getBoundingClientRect().height),
                        };
                    });
                    heights.add(got.height);
                    if (got.wrapped) misses.push(`${theme} ${got.title}: ${got.wrapped} of the nav on two lines`);
                    if (got.ring < 3) misses.push(`${theme} ${got.title}: today's ring ${got.ring.toFixed(2)}:1`);
                    if (i < 2) await cal.locator('[data-kp-calendar-prev]').click();
                }
                if (heights.size > 1) misses.push(`${theme}: the calendar's height moves with the month (${[...heights].join(', ')} px)`);
            }
        }
        expect(misses).toEqual([]);
    },
);

test(
    'the keys of a date grid: End, PageDown, Shift+PageUp (I.1.7 4) [scope-143]',
    { tag: ['@component:data', '@component:catalogue'] },
    async ({ page }) => {
        await open(page);
        const cal = page.locator(WIDE);
        await cal.locator('[data-kp-date="2026-10-01"]').focus();
        await page.keyboard.press('End');
        await expect(page.locator(':focus')).toHaveAttribute('data-kp-date', '2026-10-04');
        await page.keyboard.press('PageDown');
        await expect(page.locator(':focus')).toHaveAttribute('data-kp-date', '2026-11-04');
        await expect(cal.locator('.kp-calendar__title')).toHaveText('November 2026');
        await page.keyboard.press('Shift+PageUp');
        await expect(page.locator(':focus')).toHaveAttribute('data-kp-date', '2025-11-04');
        await expect(cal.locator('.kp-calendar__title')).toHaveText('November 2025');
        await page.keyboard.press('Home');
        await expect(page.locator(':focus')).toHaveAttribute('data-kp-date', '2025-11-03');
        await page.keyboard.press('ArrowUp');
        await expect(page.locator(':focus')).toHaveAttribute('data-kp-date', '2025-10-27');
        await expect(cal.locator('.kp-calendar__title')).toHaveText('October 2025');
    },
);

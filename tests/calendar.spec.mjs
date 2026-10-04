// The month heatmap [scope-143], port spec I.1.7 and the two I.1.6 points
// the round-two demo verified (research/dashboard-ports-2/README.md §5).
//
// Driven on catalogue/data.html#calendar, whose sample clock stands at
// 04/10/2026 14:40 in Brussels. The browser is put in New York for the whole
// file: every day the calendar names must still be the Brussels one (rule 52).

import { test, expect } from '@playwright/test';
import { waitForJudging } from './helpers/catalogue.mjs';
import { useEmptyRegister } from './helpers/empty-register.mjs';
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
    'October back to February: six rows every month, all one height (I.1.7 1) [scope-143]',
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

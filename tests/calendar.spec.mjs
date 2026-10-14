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

test.use({ timezoneId: 'America/New_York' });

/** @param {import('@playwright/test').Page} page */
const open = async (page) => {
    await useEmptyRegister(page.context());
    await page.goto(URL);
    await waitForJudging(page);
    await expect(page.locator(`${WIDE} [data-kp-date="2026-10-04"]`)).toBeVisible();
};

// The month-heatmap rows test (six rows every month, today's ring, title on one line in 16 themes)
// was deleted 2026-10-15, over 20 s (29.8 s), Kenny's rule.

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

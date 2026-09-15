// The date picker's month and year grids [scope-89].
//
// Kenny's answer to datepicker-jump, "Titel opent een raster": previous and
// next month were the only way through the calendar, so a date two years
// off took twenty-four clicks. The month title is now a button that opens
// the twelve months of its year, and the year title one that opens twelve
// years — by mouse and by keyboard, in both channels, without the panel
// changing size under the pointer.

import { readFileSync } from 'node:fs';
import { test, expect } from '@playwright/test';
import { DEFAULT_STRINGS as S } from '../js/strings.js';
import { waitForJudging } from './helpers/catalogue.mjs';
import { useEmptyRegister } from './helpers/empty-register.mjs';

const URL = '/tests/fixtures/components.html';
// The fixture's pickers sit under lang="nl", so the names are Dutch.
const MONTHS = Array.from({ length: 12 }, (_, i) => new Intl.DateTimeFormat('nl', { month: 'long' }).format(new Date(2026, i, 1)));
const THEME_NAMES = JSON.parse(readFileSync(new globalThis.URL('../themes/order.json', import.meta.url), 'utf8'));

const CHANNELS = [
    {
        name: 'framework-free',
        input: '[data-test="plain-date-input"]',
        open: '[data-test="plain-date-open"]',
        panel: '[data-test="plain-date-panel"]',
        limits: '[data-test="plain-date-limits"]',
    },
    {
        name: 'React',
        input: '[data-test="react-date"] .kp-field__input',
        open: '[data-test="react-date"] [data-kp-date-open]',
        panel: '[data-test="react-date"] .kp-datepicker__panel',
        limits: '[data-test="react-date-limits"]',
    },
];

/** @param {import('@playwright/test').Page} page @param {(typeof CHANNELS)[number]} channel @param {string} text */
async function openAt(page, channel, text) {
    await page.goto(URL);
    await page.locator(channel.input).fill(text);
    await page.locator(channel.open).click();
    const panel = page.locator(channel.panel);
    await expect(panel).toBeVisible();
    return panel;
}

/**
 * A framework-free picker with a minimum and a maximum, built on the fixture
 * page the way the gap-11 tests build theirs; the React one is in the fixture.
 *
 * @param {import('@playwright/test').Page} page
 */
async function addPlainLimits(page) {
    await page.evaluate(async () => {
        const { attachDatePickers } = await import('/js/datepicker.js');
        const host = document.createElement('div');
        host.lang = 'nl';
        host.innerHTML =
            '<div class="kp-datepicker" data-kp-datepicker data-kp-min="2026-03-15" data-kp-max="2027-06-10" data-test="plain-date-limits">' +
            '<input class="kp-field__input" id="plain-limits" type="text" data-kp-date-input value="13-09-2026" />' +
            '<button type="button" data-kp-date-open>open</button><div class="kp-datepicker__panel" data-kp-date-panel hidden></div></div>';
        document.body.prepend(host);
        attachDatePickers(host);
    });
}

for (const channel of CHANNELS) {
    test.describe(`date picker month and year grids — ${channel.name}`, { tag: ['@component:datepicker'] }, () => {
        test('the month title opens the twelve months of its year, the shown month marked and focused [scope-89]', async ({ page }) => {
            const panel = await openAt(page, channel, '13-09-2026');
            const title = panel.locator('.kp-datepicker__title');
            await expect(title).toHaveRole('button');
            // Its name says what it opens, and still holds what it shows.
            await expect(title).toHaveAttribute('aria-label', S.chooseMonth(S.monthTitle(MONTHS[8], 2026)));
            await title.click();

            const grid = panel.locator('[data-kp-view="months"]');
            await expect(grid).toHaveAttribute('role', 'grid');
            await expect(grid).toHaveAttribute('aria-label', S.monthGrid(2026));
            // The short names on the cells, where "September" ran out of a third of the grid; the full name as the cell's name.
            const short = await page.evaluate(() =>
                Array.from({ length: 12 }, (_, i) => new Intl.DateTimeFormat('nl', { month: 'short' }).format(new Date(2001, i, 1))),
            );
            await expect(grid.locator('[data-kp-month]')).toHaveText(short);
            await expect(grid.locator('[data-kp-month="2026-03"]')).toHaveAttribute('aria-label', S.monthTitle(MONTHS[2], 2026));
            await expect(panel.locator('[data-kp-day]')).toHaveCount(0);
            const september = grid.locator('[data-kp-month="2026-09"]');
            await expect(september).toHaveAttribute('aria-selected', 'true');
            await expect(september).toBeFocused();
            await expect(grid.locator('[tabindex="0"]')).toHaveCount(1);
            // The month cells are day cells to every register.
            await expect(september).toHaveClass(/\bkp-datepicker__day\b/);
            await expect(panel.locator('[aria-live]')).toHaveText(S.monthGrid(2026));

            await expect(title).toHaveText('2026');
            await expect(title).toHaveAttribute('aria-label', S.chooseYear(2026));
            // Previous and next move by a year here.
            await panel.getByRole('button', { name: S.nextYear, exact: true }).click();
            await expect(title).toHaveText('2027');
            await expect(grid.locator('[data-kp-month]').first()).toHaveAttribute('data-kp-month', '2027-01');
            await panel.getByRole('button', { name: S.previousYear, exact: true }).click();
            await panel.getByRole('button', { name: S.previousYear, exact: true }).click();
            await expect(title).toHaveText('2025');
        });

        test('the year title opens twelve years; a year and then a month land on that month’s days [scope-89]', async ({ page }) => {
            const panel = await openAt(page, channel, '13-09-2026');
            const title = panel.locator('.kp-datepicker__title');
            await title.click();
            await title.click();

            const grid = panel.locator('[data-kp-view="years"]');
            await expect(grid.locator('[data-kp-year]')).toHaveCount(12);
            const years = await grid.locator('[data-kp-year]').evaluateAll((cells) => cells.map((c) => Number(c.getAttribute('data-kp-year'))));
            expect(years).toContain(2026);
            expect(years).toEqual(Array.from({ length: 12 }, (_, i) => years[0] + i));
            await expect(grid).toHaveAttribute('aria-label', S.yearGrid(years[0], years[11]));
            await expect(grid.locator('[data-kp-year="2026"]')).toBeFocused();
            await expect(grid.locator('[data-kp-year="2026"]')).toHaveAttribute('aria-selected', 'true');
            await expect(title).toHaveText(S.yearRange(years[0], years[11]));
            await expect(panel.locator('[aria-live]')).toHaveText(S.yearGrid(years[0], years[11]));

            // Twelve years a step.
            await panel.getByRole('button', { name: S.nextYears, exact: true }).click();
            await expect(grid.locator('[data-kp-year]').first()).toHaveAttribute('data-kp-year', String(years[0] + 12));
            await panel.getByRole('button', { name: S.previousYears, exact: true }).click();
            await panel.getByRole('button', { name: S.previousYears, exact: true }).click();
            await expect(grid.locator('[data-kp-year]').first()).toHaveAttribute('data-kp-year', String(years[0] - 12));
            await grid.locator(`[data-kp-year="${years[0] - 12 + 3}"]`).click();

            const chosenYear = years[0] - 12 + 3;
            await expect(panel.locator('[data-kp-view="months"]')).toBeVisible();
            await expect(title).toHaveText(String(chosenYear));
            await panel.locator(`[data-kp-month="${chosenYear}-03"]`).click();

            await expect(panel.locator('[data-kp-view="days"]')).toBeVisible();
            await expect(title).toHaveText(S.monthTitle(MONTHS[2], chosenYear));
            await expect(panel.locator(`[data-kp-day="${chosenYear}-03-13"]`)).toBeFocused();
            await expect(panel.locator('[data-kp-day][tabindex="0"]')).toHaveCount(1);
            // Choosing a month moved the calendar, not the value.
            await expect(page.locator(channel.input)).toHaveValue('13-09-2026');
            await panel.locator(`[data-kp-day="${chosenYear}-03-20"]`).click();
            await expect(page.locator(channel.input)).toHaveValue(`20-03-${chosenYear}`);
        });

        test('the arrows, Home and End walk the month and year grids, and Escape steps back one view [scope-89]', async ({ page }) => {
            const panel = await openAt(page, channel, '13-09-2026');
            const title = panel.locator('.kp-datepicker__title');
            await title.focus();
            await page.keyboard.press('Enter');
            await expect(panel.locator('[data-kp-month="2026-09"]')).toBeFocused();

            await page.keyboard.press('ArrowRight');
            await expect(panel.locator('[data-kp-month="2026-10"]')).toBeFocused();
            await expect(panel.locator('[data-kp-month][tabindex="0"]')).toHaveCount(1);
            await page.keyboard.press('ArrowUp');
            await expect(panel.locator('[data-kp-month="2026-07"]')).toBeFocused();
            await page.keyboard.press('End');
            await expect(panel.locator('[data-kp-month="2026-09"]')).toBeFocused();
            await page.keyboard.press('Home');
            await expect(panel.locator('[data-kp-month="2026-07"]')).toBeFocused();
            // Past the edge of the drawn grid into the next year, as the days cross a month.
            await page.keyboard.press('ArrowDown');
            await page.keyboard.press('ArrowDown');
            await expect(panel.locator('[data-kp-month="2027-01"]')).toBeFocused();
            await expect(title).toHaveText('2027');
            await page.keyboard.press('ArrowLeft');
            await expect(panel.locator('[data-kp-month="2026-12"]')).toBeFocused();

            // Escape from the months: back to the days that were showing.
            await page.keyboard.press('Escape');
            await expect(panel).toBeVisible();
            await expect(title).toHaveText(S.monthTitle(MONTHS[8], 2026));
            await expect(panel.locator('[data-kp-day="2026-09-13"]')).toBeFocused();

            // Space on the title, twice, reaches the years.
            await title.focus();
            await page.keyboard.press(' ');
            await expect(panel.locator('[data-kp-month="2026-09"]')).toBeFocused();
            await title.focus();
            await page.keyboard.press(' ');
            await expect(panel.locator('[data-kp-year="2026"]')).toBeFocused();
            await page.keyboard.press('ArrowLeft');
            await expect(panel.locator('[data-kp-year="2025"]')).toBeFocused();
            await page.keyboard.press('ArrowDown');
            await expect(panel.locator('[data-kp-year="2028"]')).toBeFocused();
            // Twelve years from 2016 in rows of three: 2028 opens the next block, 2028 to 2039, and End is its row's last year.
            await expect(panel.locator('[data-kp-year]').first()).toHaveAttribute('data-kp-year', '2028');
            await page.keyboard.press('End');
            const endYear = 2030;
            await expect(panel.locator(`[data-kp-year="${endYear}"]`)).toBeFocused();
            await page.keyboard.press('Enter');
            await expect(panel.locator('[data-kp-view="months"]')).toBeVisible();
            await expect(title).toHaveText(String(endYear));
            await expect(panel.locator(`[data-kp-month="${endYear}-09"]`)).toBeFocused();

            // Escape from the years goes back to the months of the year that was showing.
            await title.focus();
            await page.keyboard.press('Enter');
            await page.keyboard.press('ArrowRight');
            await page.keyboard.press('Escape');
            await expect(panel.locator('[data-kp-view="months"]')).toBeVisible();
            await expect(title).toHaveText(String(endYear));
            await expect(panel.locator(`[data-kp-month="${endYear}-09"]`)).toBeFocused();
            await page.keyboard.press('Escape');
            await expect(panel.locator('[data-kp-view="days"]')).toBeVisible();
            // And Escape in the days still closes, back to the button.
            await page.keyboard.press('Escape');
            await expect(panel).toBeHidden();
            await expect(page.locator(channel.open)).toBeFocused();
            // Opened again, the calendar starts on the days.
            await page.locator(channel.open).click();
            await expect(panel.locator('[data-kp-view="days"]')).toBeVisible();
        });

        test('months and years wholly outside min and max are disabled [scope-89]', async ({ page }) => {
            await page.goto(URL);
            if (channel.name === 'framework-free') await addPlainLimits(page);
            const picker = page.locator(channel.limits);
            await picker.locator('[data-kp-date-input]').fill('13-09-2026');
            await picker.locator('[data-kp-date-open]').click();
            const panel = picker.locator('.kp-datepicker__panel');
            const title = panel.locator('.kp-datepicker__title');
            await title.click();

            // min 15 March 2026: March still holds days to choose.
            for (const m of ['01', '02']) await expect(panel.locator(`[data-kp-month="2026-${m}"]`)).toHaveAttribute('aria-disabled', 'true');
            for (const m of ['03', '09', '12']) await expect(panel.locator(`[data-kp-month="2026-${m}"]`)).not.toHaveAttribute('aria-disabled', /.*/);
            // A disabled month is not a way into its days. Forced: Playwright will not click what says it is disabled.
            await panel.locator('[data-kp-month="2026-01"]').click({ force: true });
            await expect(panel.locator('[data-kp-view="months"]')).toBeVisible();
            await panel.locator('[data-kp-month="2026-01"]').press('Enter');
            await expect(panel.locator('[data-kp-view="months"]')).toBeVisible();

            await panel.getByRole('button', { name: S.nextYear, exact: true }).click();
            // max 10 June 2027.
            for (const m of ['01', '06']) await expect(panel.locator(`[data-kp-month="2027-${m}"]`)).not.toHaveAttribute('aria-disabled', /.*/);
            for (const m of ['07', '12']) await expect(panel.locator(`[data-kp-month="2027-${m}"]`)).toHaveAttribute('aria-disabled', 'true');

            await title.click();
            await expect(panel.locator('[data-kp-year="2025"]')).toHaveAttribute('aria-disabled', 'true');
            await expect(panel.locator('[data-kp-year="2026"]')).not.toHaveAttribute('aria-disabled', /.*/);
            await expect(panel.locator('[data-kp-year="2027"]')).not.toHaveAttribute('aria-disabled', /.*/);
            await expect(panel.locator('[data-kp-year="2024"]')).toHaveAttribute('aria-disabled', 'true');
            await panel.locator('[data-kp-year="2024"]').click({ force: true });
            await expect(panel.locator('[data-kp-view="years"]')).toBeVisible();
        });

        test('the panel keeps its size across the days, the months and the years [scope-89]', async ({ page }) => {
            const panel = await openAt(page, channel, '13-09-2026');
            const size = () => panel.evaluate((el) => ({ w: el.getBoundingClientRect().width, h: el.getBoundingClientRect().height }));
            const days = await size();
            await panel.locator('.kp-datepicker__title').click();
            const months = await size();
            await panel.locator('.kp-datepicker__title').click();
            const years = await size();
            for (const [name, s] of Object.entries({ months, years })) {
                expect(Math.abs(s.w - days.w), `${name} width ${s.w} against the days' ${days.w}`).toBeLessThanOrEqual(1);
                expect(Math.abs(s.h - days.h), `${name} height ${s.h} against the days' ${days.h}`).toBeLessThanOrEqual(1);
            }
        });
    });
}

test('choosing a month fires the month event once, with the month it shows [scope-89]', { tag: ['@component:datepicker'] }, async ({ page }) => {
    const panel = await openAt(page, CHANNELS[0], '13-09-2026');
    await page.evaluate(() => {
        window.kpMonths = [];
        document.querySelector('[data-test="plain-date"]')?.addEventListener('kp-date-month', (e) => window.kpMonths.push(e.detail));
    });
    const title = panel.locator('.kp-datepicker__title');
    await title.click();
    await panel.getByRole('button', { name: S.nextYear, exact: true }).click();
    await panel.locator('[data-kp-month="2027-02"]').click();
    expect(await page.evaluate(() => window.kpMonths)).toEqual([{ year: 2027, month: 1 }]);
});

test(
    'the panel keeps its size across the three views, in every theme [scope-89]',
    { tag: ['@component:datepicker', '@sweep', '@component:catalogue'] },
    async ({ page }) => {
        await useEmptyRegister(page.context());
        await page.goto('/catalogue/datepicker.html');
        await waitForJudging(page);
        const picker = page.locator('#keyboard .kp-datepicker');
        const panel = picker.locator('[data-kp-date-panel]');
        const title = panel.locator('.kp-datepicker__title');
        /** Width and height, and every grid cell's content fitting its box. */
        const measure = () =>
            panel.evaluate((el) => {
                const box = el.getBoundingClientRect();
                const spill = [...el.querySelectorAll('[data-kp-month], [data-kp-year]')].filter((c) => c.scrollWidth > c.clientWidth + 1).length;
                return { w: box.width, h: box.height, spill };
            });
        for (const theme of THEME_NAMES) {
            await page.evaluate((name) => document.documentElement.setAttribute('data-theme', name), theme);
            await picker.locator('[data-kp-date-open]').click();
            await expect(panel).toBeVisible();
            const days = await measure();
            await title.click();
            await expect(panel.locator('[data-kp-view="months"]')).toBeVisible();
            const months = await measure();
            await title.click();
            await expect(panel.locator('[data-kp-view="years"]')).toBeVisible();
            const years = await measure();
            for (const [name, s] of Object.entries({ months, years })) {
                expect(Math.abs(s.w - days.w), `${theme}: ${name} width ${s.w} against the days' ${days.w}`).toBeLessThanOrEqual(1);
                expect(Math.abs(s.h - days.h), `${theme}: ${name} height ${s.h} against the days' ${days.h}`).toBeLessThanOrEqual(1);
                expect(s.spill, `${theme}: ${name} cells whose text runs out of the cell`).toBe(0);
            }
            await page.keyboard.press('Escape');
            await page.keyboard.press('Escape');
            await page.keyboard.press('Escape');
            await expect(panel).toBeHidden();
        }
    },
);

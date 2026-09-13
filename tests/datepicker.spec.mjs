// Date picker [TH43].
//
// The parsing is unit-tested in gates/gates.test.mjs. What needs a
// browser is the grid, and specifically the two things that decide
// whether anyone can use it without a mouse: exactly one day in the tab
// order, and arrows that cross a month boundary rather than stopping at
// the edge of the drawn grid.

import { readFileSync } from 'node:fs';
import { test, expect } from '@playwright/test';
import { DEFAULT_STRINGS as S } from '../js/strings.js';

const URL = '/tests/fixtures/components.html';
// The fixture's pickers sit under lang="nl", and since gap-11 the month
// names follow the picker's locale rather than the English dictionary.
const MONTHS = Array.from({ length: 12 }, (_, i) => new Intl.DateTimeFormat('nl', { month: 'long' }).format(new Date(2026, i, 1)));
// Both channels [AR7]. They share `parseDate` — two implementations of
// "is 31-02 a date" is exactly how the channels come to disagree — but the
// grid is written twice, so the grid is what this drives.
const CHANNELS = [
    {
        name: 'framework-free',
        input: '[data-test="plain-date-input"]',
        open: '[data-test="plain-date-open"]',
        panel: '[data-test="plain-date-panel"]',
    },
    {
        name: 'React',
        input: '[data-test="react-date"] .kp-field__input',
        open: '[data-test="react-date"] [data-kp-date-open]',
        panel: '[data-test="react-date"] .kp-datepicker__panel',
    },
];

for (const channel of CHANNELS) {
    test.describe(`date picker — ${channel.name}`, () => {
        test('typing a date is enough — the calendar never has to open [TH43]', async ({ page }) => {
            await page.goto(URL);
            const input = page.locator(channel.input);
            await input.fill('4-9-2026');
            // ISO in the attribute, Dutch on screen: parsing a localised string on
            // the server is how off-by-one-day bugs are born.
            await expect(input).toHaveAttribute('data-kp-date-value', '2026-09-04');
            await expect(page.locator(channel.panel)).toBeHidden();
        });

        test('an impossible date leaves no value behind [TH43]', async ({ page }) => {
            await page.goto(URL);
            const input = page.locator(channel.input);
            await input.fill('4-9-2026');
            await expect(input).toHaveAttribute('data-kp-date-value', '2026-09-04');
            await input.fill('31-02-2026');
            // A stale value under a rejected date is worse than no value: the
            // consumer would save the previous one.
            await expect(input).not.toHaveAttribute('data-kp-date-value', /.+/);
        });

        test('exactly one day is in the tab order [TH43]', async ({ page }) => {
            await page.goto(URL);
            await page.locator(channel.input).fill('4-9-2026');
            await page.locator(channel.open).click();
            const panel = page.locator(channel.panel);
            await expect(panel).toBeVisible();
            // Otherwise Tab walks 31 buttons to get out of a calendar.
            await expect(panel.locator('[data-kp-day][tabindex="0"]')).toHaveCount(1);
        });

        test('the arrows cross the month boundary [TH43]', async ({ page }) => {
            await page.goto(URL);
            await page.locator(channel.input).fill('01-09-2026');
            await page.locator(channel.open).click();
            const panel = page.locator(channel.panel);
            await expect(panel.locator('.kp-datepicker__title')).toHaveText(`${MONTHS[8]} 2026`);
            // Stopping at the edge of the drawn grid is the difference between a
            // calendar and a picture of one.
            await panel.locator('[data-kp-day="2026-09-01"]').press('ArrowLeft');
            await expect(panel.locator('.kp-datepicker__title')).toHaveText(`${MONTHS[7]} 2026`);
            await expect(panel.locator('[data-kp-day="2026-08-31"]')).toBeFocused();
        });

        test('PageDown moves a month, Enter takes the day [TH43]', async ({ page }) => {
            await page.goto(URL);
            const input = page.locator(channel.input);
            await input.fill('04-09-2026');
            await page.locator(channel.open).click();
            const panel = page.locator(channel.panel);
            await panel.locator('[data-kp-day="2026-09-04"]').press('PageDown');
            await expect(panel.locator('.kp-datepicker__title')).toHaveText(`${MONTHS[9]} 2026`);
            await panel.locator('[data-kp-day="2026-10-04"]').press('Enter');
            await expect(input).toHaveValue('04-10-2026');
            await expect(input).toHaveAttribute('data-kp-date-value', '2026-10-04');
            await expect(panel).toBeHidden();
        });

        test('every day says which month it is in [TH43]', async ({ page }) => {
            await page.goto(URL);
            await page.locator(channel.input).fill('04-09-2026');
            await page.locator(channel.open).click();
            // "4" alone tells a screen reader nothing about which month it is in.
            await expect(page.locator(`${channel.panel} [data-kp-day="2026-09-04"]`)).toHaveAttribute('aria-label', S.dayLabel(4, MONTHS[8], 2026));
        });

        test('Escape closes the grid and returns focus [TH43]', async ({ page }) => {
            await page.goto(URL);
            await page.locator(channel.input).fill('04-09-2026');
            const open = page.locator(channel.open);
            await open.click();
            await page.locator(`${channel.panel} [data-kp-day="2026-09-04"]`).press('Escape');
            await expect(page.locator(channel.panel)).toBeHidden();
            await expect(open).toBeFocused();
        });
    });
}

// ── gap-11, the date picker faults of catalogue batch 2 [2026-09-13] ──────

const THEME_NAMES = JSON.parse(readFileSync(new globalThis.URL('../themes/order.json', import.meta.url), 'utf8'));

/**
 * Pair every day with the heading painted above its column: the heading
 * whose left edge is the day's left edge. Read from the boxes, not from
 * the order the module appended them in [KT13].
 *
 * @param {import('@playwright/test').Locator} panel
 */
const headingPerDay = (panel) =>
    panel.evaluate((el) => {
        const headings = [...el.querySelectorAll('.kp-datepicker__weekday')].map((h) => ({
            x: Math.round(h.getBoundingClientRect().left),
            text: h.textContent,
        }));
        return [...el.querySelectorAll('[data-kp-day]')].map((day) => {
            const x = Math.round(day.getBoundingClientRect().left);
            return { iso: day.getAttribute('data-kp-day'), heading: headings.find((h) => Math.abs(h.x - x) <= 1)?.text ?? null };
        });
    });

for (const first of [0, 1, 2, 3, 4, 5, 6]) {
    test(`heading i names the weekday of column i when the week starts on ${first} — framework-free [gap-11]`, async ({ page }) => {
        // gap-11: js/datepicker.js indexed the Monday-first strings.weekdays with a Sunday-zero first day, so every heading sat one column off.
        await page.goto(URL);
        await page.evaluate(async (weekStart) => {
            const { attachDatePickers } = await import('/js/datepicker.js');
            const host = document.createElement('div');
            host.lang = 'en-GB';
            host.innerHTML =
                `<div class="kp-datepicker" data-kp-datepicker data-kp-week-starts-on="${weekStart}" data-test="weekstart">` +
                '<input class="kp-field__input" id="weekstart" type="text" data-kp-date-input value="13/09/2026" />' +
                '<button type="button" data-kp-date-open>open</button><div class="kp-datepicker__panel" data-kp-date-panel hidden></div></div>';
            document.body.prepend(host);
            attachDatePickers(host).handles[0]?.open();
        }, first);
        const pairs = await headingPerDay(page.locator('[data-test="weekstart"] [data-kp-date-panel]'));
        expect(pairs).toHaveLength(30);
        for (const { iso, heading } of pairs) {
            const weekday = new Date(`${iso}T00:00:00`).getDay();
            expect(heading, `${iso} sits under ${heading}`).toBe(S.weekdays[(weekday + 6) % 7]);
        }
    });
}

test('heading i names the weekday of column i under a Dutch page — React [gap-11]', async ({ page }) => {
    // gap-11: components/flow.jsx rotated the Monday-first dictionary by a Sunday-zero first day, the same fault as the framework-free grid.
    await page.goto(URL);
    await page.locator('[data-test="react-date"] .kp-field__input').fill('13-09-2026');
    await page.locator('[data-test="react-date"] [data-kp-date-open]').click();
    const pairs = await headingPerDay(page.locator('[data-test="react-date"] .kp-datepicker__panel'));
    const names = await page.evaluate(() =>
        [0, 1, 2, 3, 4, 5, 6].map((d) => new Intl.DateTimeFormat('nl', { weekday: 'short' }).format(new Date(2026, 8, 13 + d))),
    );
    expect(pairs).toHaveLength(30);
    for (const { iso, heading } of pairs) {
        // 13 September 2026 is a Sunday, so names[getDay()] is that weekday.
        expect(heading, `${iso} sits under ${heading}`).toBe(names[new Date(`${iso}T00:00:00`).getDay()]);
    }
});

for (const channel of CHANNELS) {
    test(`month and weekday names follow the picker's locale — ${channel.name} [gap-11]`, async ({ page }) => {
        // gap-11: the names came from the English dictionary whatever the lang, so a Dutch page read "September" over a Dutch date.
        await page.goto(URL);
        await page.locator(channel.input).fill('13-09-2026');
        await page.locator(channel.open).click();
        const panel = page.locator(channel.panel);
        const expected = await page.evaluate(() => ({
            month: new Intl.DateTimeFormat('nl', { month: 'long' }).format(new Date(2026, 8, 1)),
            weekdays: [0, 1, 2, 3, 4, 5, 6].map((d) => new Intl.DateTimeFormat('nl', { weekday: 'short' }).format(new Date(2026, 8, 13 + d))).sort(),
        }));
        await expect(panel.locator('.kp-datepicker__title')).toHaveText(S.monthTitle(expected.month, 2026));
        await expect(panel.locator('[data-kp-day="2026-09-04"]')).toHaveAttribute('aria-label', S.dayLabel(4, expected.month, 2026));
        const headings = (await panel.locator('.kp-datepicker__weekday').allTextContents()).sort();
        expect(headings).toEqual(expected.weekdays);
    });
}

test("a consumer's own month names still win over the locale's [gap-11, KT6]", async ({ page }) => {
    // gap-11: following the locale must not take away setStrings — the dictionary a consumer set is the way out.
    await page.goto(URL);
    const months = ['M1', 'M2', 'M3', 'M4', 'M5', 'M6', 'M7', 'M8', 'Negen', 'M10', 'M11', 'M12'];
    await page.evaluate(async (names) => {
        const { setStrings } = await import('/js/strings.js');
        setStrings({ months: names });
    }, months);
    await page.locator('[data-test="plain-date-input"]').fill('13-09-2026');
    await page.locator('[data-test="plain-date-open"]').click();
    await expect(page.locator('[data-test="plain-date-panel"] .kp-datepicker__title')).toHaveText(S.monthTitle('Negen', 2026));
});

test('a disabled day keeps aria-disabled and looks unavailable, in every theme [gap-11]', async ({ page }) => {
    // gap-11: a disabled day carried aria-disabled and nothing else, so it painted exactly like a day that can be chosen.
    await page.goto('/catalogue/datepicker.html');
    const off = page.locator('#limits [data-kp-day="2026-09-05"]');
    const on = page.locator('#limits [data-kp-day="2026-09-08"]');
    await expect(off).toHaveAttribute('aria-disabled', 'true');
    await expect(on).not.toHaveAttribute('aria-disabled', /.*/);
    const paint = (locator) =>
        locator.evaluate((el) => {
            const s = getComputedStyle(el);
            return ['color', 'opacity', 'text-decoration-line', 'background-color', 'background-image', 'border-top-color']
                .map((p) => s.getPropertyValue(p))
                .join(' | ');
        });
    for (const theme of THEME_NAMES) {
        await page.evaluate((name) => document.documentElement.setAttribute('data-theme', name), theme);
        await expect.poll(() => page.evaluate(() => document.documentElement.getAttribute('data-theme'))).toBe(theme);
        expect(await paint(off), `${theme}: the disabled 5th paints like the enabled 8th`).not.toBe(await paint(on));
    }
    // And the live module writes the same attribute it is styled by.
    await page.goto(URL);
    await page.evaluate(async () => {
        const { attachDatePickers } = await import('/js/datepicker.js');
        const host = document.createElement('div');
        host.lang = 'en-GB';
        host.innerHTML =
            '<div class="kp-datepicker" data-kp-datepicker data-kp-min="2026-09-07" data-test="limits">' +
            '<input class="kp-field__input" id="limits" type="text" data-kp-date-input value="13/09/2026" />' +
            '<button type="button" data-kp-date-open>open</button><div class="kp-datepicker__panel" data-kp-date-panel hidden></div></div>';
        document.body.prepend(host);
        attachDatePickers(host).handles[0]?.open();
    });
    await expect(page.locator('[data-test="limits"] [data-kp-day="2026-09-05"]')).toHaveAttribute('aria-disabled', 'true');
});

test('the calendar button sits on the line with the input [gap-11]', async ({ page }) => {
    // gap-11: the input took the whole row (inline-size: 100%) in a wrapping flex row, so the button always fell to the next line.
    await page.goto('/catalogue/datepicker.html');
    for (const id of ['dp-closed', 'dp-keys']) {
        const input = page.locator(`#${id}`);
        const button = page.locator(`.kp-datepicker:has(#${id}) [data-kp-date-open]`);
        const boxes = await Promise.all([input.boundingBox(), button.boundingBox()]);
        const [a, b] = /** @type {{ x: number, y: number, width: number, height: number }[]} */ (boxes);
        expect(b.y, `${id}: the button starts below the input`).toBeLessThan(a.y + a.height);
        expect(b.y + b.height, `${id}: the button ends above the input`).toBeGreaterThan(a.y);
        expect(b.x, `${id}: the button is not beside the input`).toBeGreaterThanOrEqual(a.x + a.width - 1);
    }
});

// Kenny's review note of 2026-09-13: the data table's date filter opened its
// calendar past the right edge of the window. The fix is the picker's own,
// so every picker near an edge is held here, in both channels and both
// writing directions.
for (const channel of CHANNELS) {
    for (const dir of ['ltr', 'rtl']) {
        test(`a picker at the ${dir === 'ltr' ? 'right' : 'left'} edge opens its calendar toward the inline start, inside the window — ${channel.name}, ${dir} [Kenny's note 1]`, async ({
            page,
        }) => {
            // Before, both channels: ltr, the panel ran to x=1374 of the page in a 1280px window (the page grew a sideways scroll); rtl, it started at x=-94.
            await page.setViewportSize({ width: 1280, height: 800 });
            await page.goto(URL);
            const picker = page.locator(channel.open).locator('xpath=ancestor::*[contains(concat(" ", @class, " "), " kp-datepicker ")][1]');
            await picker.evaluate((el, direction) => {
                const node = /** @type {HTMLElement} */ (el);
                node.dir = direction;
                // Ten rem wide, narrower than its calendar, and pushed to the inline end of its section.
                node.style.inlineSize = '10rem';
                node.style.marginInlineStart = 'auto';
                node.scrollIntoView({ block: 'center', inline: 'nearest' });
            }, dir);
            await page.locator(channel.open).click();
            const panel = page.locator(channel.panel);
            await expect(panel).toBeVisible();
            await expect
                .poll(() =>
                    panel.evaluate((el) => {
                        // In page coordinates, so a window that scrolled sideways to show the panel does not hide the overflow.
                        const box = el.getBoundingClientRect();
                        const page = document.documentElement;
                        return {
                            left: Math.round(box.left + scrollX) >= 0,
                            right: Math.round(box.right + scrollX) <= page.clientWidth,
                        };
                    }),
                )
                .toEqual({ left: true, right: true });
        });
    }
}

for (const channel of CHANNELS) {
    test(`opening the calendar puts focus on a day, and Escape closes it back to its button — ${channel.name}`, async ({ page }) => {
        // Before (React): focus stayed on the trigger when the calendar opened,
        // so the arrows moved nothing and Escape did nothing; the framework-free
        // channel already focused a day and closed on Escape.
        await page.goto(URL);
        await page.locator(channel.input).fill('4-9-2026');
        await page.locator(channel.open).click();
        await expect(page.locator(channel.panel)).toBeVisible();
        await expect(page.locator(`${channel.panel} [data-kp-day="2026-09-04"]`)).toBeFocused();
        await page.keyboard.press('Escape');
        await expect(page.locator(channel.panel)).toBeHidden();
        await expect(page.locator(channel.open)).toBeFocused();
    });
}

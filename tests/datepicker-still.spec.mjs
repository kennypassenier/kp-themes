// The month grid's pill and the catalogue's still calendars [scope-90].
//
// month-ellipse "Een pil": formal and sepia draw the chosen day as a circle,
// with a radius of 50%. A month or a year cell is wider than it is tall, so
// the same rule drew it as a stretched ellipse; a chosen month or year is a
// pill there now, and the chosen day stays a circle.
//
// frozen-calendars "Bijwerken": catalogue/datepicker.html shows open
// calendars that do not move, as copies of the markup the module builds, so
// every theme is judged on the same month. The module changed under them
// (the title became a button, the grid took an aria-label, a live region
// joined the panel) and the copies went on claiming to be exact. The test
// below builds each copy's live twin and compares the two, so the copies
// cannot fall behind the module again without a red test.

import { test, expect } from '@playwright/test';
import { waitForJudging } from './helpers/catalogue.mjs';
import { useEmptyRegister } from './helpers/empty-register.mjs';

/**
 * The radius a corner is drawn with, both axes, after the clamp CSS applies
 * when the radii of one side add up to more than the side is long.
 *
 * @param {import('@playwright/test').Locator} cell
 */
const drawnRadius = (cell) =>
    cell.evaluate((el) => {
        const style = getComputedStyle(el);
        const { width, height } = el.getBoundingClientRect();
        /** @param {string} value @param {number} length */
        const px = (value, length) => (value.endsWith('%') ? (Number.parseFloat(value) / 100) * length : Number.parseFloat(value));
        const corners = ['borderTopLeftRadius', 'borderTopRightRadius', 'borderBottomRightRadius', 'borderBottomLeftRadius'].map((name) => {
            const [h = '0', v = h] = String(style[/** @type {any} */ (name)]).split(/\s+/);
            return { h: px(h, width), v: px(v, height) };
        });
        const [tl, tr, br, bl] = /** @type {{ h: number, v: number }[]} */ (corners);
        const scale = Math.min(1, width / (tl.h + tr.h), width / (bl.h + br.h), height / (tl.v + bl.v), height / (tr.v + br.v));
        return { h: tl.h * scale, v: tl.v * scale, height, raw: style.borderTopLeftRadius };
    });

for (const theme of ['formal', 'sepia']) {
    test(
        `${theme}: a chosen month and a chosen year are pills, the chosen day a circle [scope-90]`,
        { tag: ['@component:datepicker'] },
        async ({ page }) => {
            await useEmptyRegister(page.context());
            await page.goto('/catalogue/datepicker.html');
            await waitForJudging(page);
            await page.evaluate((name) => document.documentElement.setAttribute('data-theme', name), theme);
            const picker = page.locator('#keyboard .kp-datepicker');
            const panel = picker.locator('[data-kp-date-panel]');
            await picker.locator('[data-kp-date-open]').click();
            await expect(panel).toBeVisible();

            const day = await drawnRadius(panel.locator('.kp-datepicker__day[aria-selected="true"]'));
            expect(day.raw, `${theme}: the chosen day's radius`).toBe('50%');

            for (const view of ['months', 'years']) {
                await panel.locator('.kp-datepicker__title').click();
                const cell = panel.locator(`[data-kp-view="${view}"] .kp-datepicker__day[aria-selected="true"]`);
                await expect(cell).toBeVisible();
                const r = await drawnRadius(cell);
                // An ellipse has a horizontal radius longer than its vertical one; a pill has both equal, and half the height.
                expect(Math.abs(r.h - r.v), `${theme}: the chosen ${view} cell's corner is ${r.h} by ${r.v} px (${r.raw})`).toBeLessThanOrEqual(0.5);
                expect(r.v, `${theme}: the chosen ${view} cell's radius against half its height ${r.height / 2}`).toBeGreaterThanOrEqual(
                    r.height / 2 - 0.5,
                );
            }
        },
    );
}

test(
    'the still calendars on the date picker page are the markup the module builds [scope-90]',
    { tag: ['@component:datepicker', '@component:catalogue'] },
    async ({ page }) => {
        await useEmptyRegister(page.context());
        await page.goto('/catalogue/datepicker.html');
        await waitForJudging(page);
        for (const block of ['open', 'limits', 'locale']) {
            const still = page.locator(`#${block} .kp-datepicker:not([data-kp-datepicker])`);
            const live = page.locator(`#${block} .kp-datepicker[data-kp-datepicker]`).first();
            await live.locator('[data-kp-date-open]').click();
            await expect(live.locator('[data-kp-date-panel]')).toBeVisible();
            /** Every element under the panel: its tag, its attributes but the ids, and its own text. */
            const shape = (/** @type {import('@playwright/test').Locator} */ picker) =>
                picker.locator('.kp-datepicker__panel').evaluate((panel) =>
                    [...panel.querySelectorAll('*')].map((el) => ({
                        tag: el.localName,
                        attributes: Object.fromEntries(
                            [...el.attributes].filter((a) => a.name !== 'id' && a.name !== 'style').map((a) => [a.name, a.value]),
                        ),
                        text: [...el.childNodes]
                            .filter((n) => n.nodeType === Node.TEXT_NODE)
                            .map((n) => n.textContent)
                            .join('')
                            .trim(),
                    })),
                );
            const liveShape = await shape(live);
            const stillShape = await shape(still);
            expect(liveShape.length, `#${block}: the live panel is empty`).toBeGreaterThan(0);
            expect(stillShape, `#${block}: the still calendar against its live twin`).toEqual(liveShape);
            // The ids differ by the twin's "-live"; the title's is the input's id and "-title" in both.
            const stillInput = await still.locator('.kp-field__input').getAttribute('id');
            await expect(still.locator('.kp-datepicker__title')).toHaveAttribute('id', `${stillInput}-title`);
            await page.keyboard.press('Escape');
        }
    },
);

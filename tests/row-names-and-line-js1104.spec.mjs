// What Medicine Cabinet needs, by markup the package already reads [js-1104; MedicineCabinet 04/11 items 3 and 4].
//
// Item 3: `{n}` in an attribute of a row editor's row (markup or template) is the row's number, so the time field's `data-kp-label`,
// the weekday picker's `aria-label` and the quantity's `data-kp-quantity-label` name each row's controls apart.
// Item 4: `.kp-addrow--line` in a form grid is one line of name, unit, Add and the line that says why not.

import { expect, test } from '@playwright/test';

test.describe('a row editor names its controls per row with {n} [js-1104]', () => {
    test('the time, weekdays and quantity names differ between a markup row and a row added from the template', { tag: ['@component:field'] }, async ({ page }) => {
        await page.goto('/tests/fixtures/row-editor-names.html');
        await expect(page.locator('[data-kp-rows-add]')).toHaveCount(1);
        await page.locator('[data-kp-rows-add]').click();
        await expect(page.locator('.kp-rows__row')).toHaveCount(2);
        const names = await page.evaluate(() =>
            [...document.querySelectorAll('.kp-rows__row')].map((row) => ({
                time: row.querySelector('.kp-time input[role="combobox"]')?.getAttribute('aria-label'),
                days: row.querySelector('.kp-weekdays')?.getAttribute('aria-label'),
                dose: row.querySelector('.kp-quantity input')?.getAttribute('aria-label'),
            })),
        );
        expect(names).toEqual([
            { time: 'Time of dose 1', days: 'Days of dose 1', dose: 'Amount of dose 1' },
            { time: 'Time of dose 2', days: 'Days of dose 2', dose: 'Amount of dose 2' },
        ]);
    });
});

test.describe('the add line in a form grid [js-1104]', () => {
    for (const width of [1280, 390]) {
        test(`name, unit and Add, and the refusal under them, at ${width}`, { tag: ['@component:field'] }, async ({ page }) => {
            await page.setViewportSize({ width, height: 800 });
            await page.goto('/tests/fixtures/add-row-line.html');
            await expect(page.locator('#line')).toHaveCount(1);
            const box = async (selector) => /** @type {{ x: number, y: number, width: number, height: number }} */ (await page.locator(selector).boundingBox());
            const name = await box('#form-name');
            const unit = await box('#form-unit');
            const add = await box('[data-kp-submit]');
            if (width >= 1000) {
                // One line: the unit right of the name, the button right of the unit, all on the same band.
                expect(unit.x).toBeGreaterThan(name.x + name.width - 1);
                expect(add.x).toBeGreaterThan(unit.x + unit.width - 1);
                expect(Math.abs(add.y - name.y)).toBeLessThanOrEqual(2);
            } else {
                // Stacked on a phone: the fields under each other, the button last, all inside the viewport.
                expect(unit.y).toBeGreaterThan(name.y + name.height - 1);
                expect(add.y).toBeGreaterThan(unit.y + unit.height - 1);
            }
            for (const b of [name, unit, add]) expect(b.x + b.width).toBeLessThanOrEqual(width);
            await page.evaluate(() => document.querySelector('#line').addEventListener('kp-addrow-add', (e) => /** @type {CustomEvent} */ (e).detail.waitUntil(Promise.resolve('That form exists already.'))));
            await page.fill('#form-name', 'Tablet');
            await page.press('#form-name', 'Enter');
            const refusal = page.locator('.kp-addrow__refusal');
            await expect(refusal).toHaveText('That form exists already.');
            await expect(refusal).toHaveAttribute('role', 'alert');
            expect((await refusal.boundingBox())?.y).toBeGreaterThan(name.y + name.height - 1);
            expect(await page.inputValue('#form-name')).toBe('Tablet');
        });
    }
});

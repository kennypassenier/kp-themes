// The add row's "Added x" names a select by its visible text, and the name is in the events' detail [js-1104; Kitchen kitchen.md:102].

import { expect, test } from '@playwright/test';

const FIXTURE = '/tests/fixtures/add-row.html';

test('a select named by data-kp-addrow-name announces the option text, not its id value', { tag: ['@component:field'] }, async ({ page }) => {
    await page.goto(FIXTURE);
    await expect(page.locator('[data-test="meal"][data-kp-select-attached]')).toHaveCount(1);
    const seen = await page.evaluate(async () => {
        const row = document.querySelector('#row');
        row.setAttribute('data-kp-addrow-name', 'meal');
        const select = /** @type {HTMLSelectElement} */ (row.querySelector('#new-meal'));
        Array.from(select.options).forEach((option, i) => (option.value = `id-${i + 1}`));
        select.value = 'id-2';
        const names = /** @type {string[]} */ ([]);
        row.addEventListener('kp-addrow-add', (e) => names.push(/** @type {CustomEvent} */ (e).detail.name));
        row.addEventListener('kp-addrow-added', (e) => names.push(/** @type {CustomEvent} */ (e).detail.name));
        /** @type {HTMLFormElement} */ (row).requestSubmit();
        await new Promise((resolve) => setTimeout(resolve, 300));
        return { live: row.querySelector('.kp-addrow__live')?.textContent, names };
    });
    expect(seen).toEqual({ live: 'Added Dinner', names: ['Dinner', 'Dinner'] });
});

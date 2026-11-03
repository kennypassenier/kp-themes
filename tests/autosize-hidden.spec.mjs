// A growing box in a closed `<details>` can wait until it shows [kit2-1103, Kitchen K6].
//
// Kitchen's recipe editor keeps each step's notes in a closed `<details>`: reading the computed style of such a box makes the
// browser lay the hidden content out, 60 ms a box, 2.9 s of the editor's 2.8 s-to-7 s opening for 41 steps. With
// `data-kp-autosize-hidden="skip"` the box is left alone while its content is not rendered and measured the moment it shows;
// the default (`measure`) is what it always was.
import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    await page.goto('/tests/fixtures/autosize-hidden.html');
    await page.waitForFunction(() => /** @type {any} */ (window).ready === true);
});

test('a skipping box in a closed details is not measured, a default one is', { tag: ['@component:field'] }, async ({ page }) => {
    await expect(page.locator('#skip-box')).not.toHaveAttribute('data-kp-autosize-engine-used', /.*/);
    await expect(page.locator('#measure-box')).toHaveAttribute('data-kp-autosize-engine-used', /css|js/);
});

test('a skipping box that is shown is measured at attach', { tag: ['@component:field'] }, async ({ page }) => {
    await expect(page.locator('#shown-box')).toHaveAttribute('data-kp-autosize-engine-used', /css|js/);
});

test('a skipping box is measured when its details opens, to the height of its text', { tag: ['@component:field'] }, async ({ page }) => {
    await page.locator('#skipping > summary').click();
    await expect(page.locator('#skip-box')).toHaveAttribute('data-kp-autosize-engine-used', /css|js/);
    const [skipped, reference] = await page.evaluate(async () => {
        const open = document.querySelector('#measuring');
        open.open = true;
        await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
        return [document.getElementById('skip-box').getBoundingClientRect().height, document.getElementById('measure-box').getBoundingClientRect().height];
    });
    expect(skipped).toBeGreaterThan(60);
    expect(Math.abs(skipped - reference)).toBeLessThan(1);
});

// Colour picker [TH57].
//
// Three sliders is not what this is for. The measurement beside them is:
// the same WCAG ratio the contrast gate uses, against the theme's own
// background. A picker that shows a colour and not whether anyone can
// read it is how the unreadable colours got in.

import { test, expect } from '@playwright/test';

const URL = '/tests/fixtures/components.html';

test('it reports the ratio and the verdict, not just a number [TH57]', async ({ page }) => {
    await page.goto(URL);
    const report = page.locator('[data-test="plain-color-contrast"]');
    // A bare 4.31 means nothing to anyone who does not know the thresholds
    // by heart, so the words are part of the contract.
    await expect(report).toContainText(':1 tegen --background');
    await expect(report).toContainText(/haalbaar|te weinig/);
});

test('moving a slider changes the measurement [TH57]', async ({ page }) => {
    await page.goto(URL);
    const lightness = page.locator('[data-test="plain-color-l"]');
    const report = page.locator('[data-test="plain-color-contrast"]');
    await lightness.fill('10');
    const dark = await report.textContent();
    await lightness.fill('95');
    const light = await report.textContent();
    expect(dark).not.toBe(light);
    // On formal's near-white background, a very dark colour reads and a
    // very light one does not. That is the whole point of the number.
    expect(dark).toContain('haalbaar');
    expect(light).toContain('te weinig');
});

test('the value is emitted as an authored hsl() string [TH57]', async ({ page }) => {
    await page.goto(URL);
    await page.locator('[data-test="plain-color-h"]').fill('40');
    // The same notation the tokens are authored in, so a consumer can paste
    // it into a theme without converting anything.
    await expect(page.locator('[data-test="plain-color-value"]')).toHaveText(/^hsl\(40, \d+%, \d+%\)$/);
});

test('a token that does not exist is said, not silently skipped [TH57]', async ({ page }) => {
    await page.goto(URL);
    await page.locator('[data-test="plain-color"]').evaluate((el) => {
        el.dataset.kpAgainst = '--niet-bestaand';
        el.querySelector('[data-kp-channel="h"]').dispatchEvent(new Event('input', { bubbles: true }));
    });
    // A picker that quietly stops measuring looks exactly like one saying
    // the colour is fine.
    await expect(page.locator('[data-test="plain-color-contrast"]')).toContainText('bestaat niet in dit thema');
});

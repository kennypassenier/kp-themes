// The grid, the nav bar and the space they are given [TH104, AR31].
//
// One suite over both channels (standing rule 7g): every case runs twice
// against the same fixture page, once over the framework-free markup that
// js/auto.js upgrades and once over the React components, and the
// assertions are identical.
//
// Every case that asserts the PACKAGE applies something carries, in a
// comment, the exact declaration removed to drive it red [KT3].

import { test, expect } from '@playwright/test';

const URL = '/tests/fixtures/container.html';

// The way out of the wrapper, both halves of KT6: a page that already
// establishes a container of its own turns the component's off, and the
// query still finds the outer one.
test('the React components hand the wrapper back [TH104, KT6]', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(URL);
    await page.waitForSelector('[data-test="react-grid-wide"] .kp-grid__tile');
    const wrappers = await page.evaluate(() => ({
        grid: document.querySelector('[data-test="react-grid-wide"]').parentElement.className,
        nav: document.querySelector('[data-test="react-nav-wide"]').parentElement.className,
    }));
    expect(wrappers.grid).toBe('kp-grid-wrap');
    expect(wrappers.nav).toBe('kp-nav-wrap');
});

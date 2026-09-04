// The showcase opens, and opens correctly [L9, AR14].
//
// L9's exit criterion ends with "and produces a showcase that opens" —
// not "the file exists". A generated page that throws on load is exactly
// the kind of thing a file-existence check reports as success.

import { test, expect } from '@playwright/test';
import { THEMES } from '../js/theme-registry.js';

test('the showcase renders every theme, with nothing failing on load', async ({ page }) => {
    const errors = [];
    page.on('pageerror', (e) => errors.push(String(e)));
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));

    await page.goto('/showcase/index.html');
    await page.waitForSelector('.kp-icon-button');

    // One block per theme, each wearing its own theme.
    await expect(page.locator('.sc-theme')).toHaveCount(THEMES.length);
    for (const theme of THEMES) {
        await expect(page.locator(`#theme-${theme.name}`)).toHaveAttribute('data-theme', theme.name);
    }

    // One picker, in the header, with an option per theme. It is not
    // inside the blocks: a picker there reads as broken, because the
    // block keeps its own theme on purpose [S1].
    expect(await page.locator('.sc-theme [data-kp-theme-picker]').count()).toBe(0);
    expect(await page.locator('.sc-header [data-kp-theme] ').count()).toBe(THEMES.length);

    expect(errors, 'the showcase logged errors while loading').toEqual([]);
});

test('picking a theme on the showcase changes the document, not the blocks', async ({ page }) => {
    await page.goto('/showcase/index.html');
    await page.waitForSelector('.kp-icon-button');

    await page.click('.kp-icon-button');
    await expect(page.locator('#showcase-theme-menu')).toBeVisible();
    await page.click('#showcase-theme-menu [data-kp-theme="terminal"]');

    await expect(page.locator('html')).toHaveAttribute('data-theme', 'terminal');
    // The menu closes itself: leaving it open after a choice makes it
    // look as though the click missed.
    await expect(page.locator('#showcase-theme-menu')).toBeHidden();
    // Each block keeps wearing its own theme, and its own typeface: that
    // is what makes the page a comparison rather than seven copies.
    await expect(page.locator('#theme-pastel')).toHaveAttribute('data-theme', 'pastel');
    const fonts = await page.evaluate(() => ({
        formal: getComputedStyle(document.querySelector('#theme-formal')).fontFamily.split(',')[0],
        terminal: getComputedStyle(document.querySelector('#theme-terminal')).fontFamily.split(',')[0],
    }));
    expect(fonts.formal).not.toBe(fonts.terminal);
});

test('the header wears the chosen theme, so the picker visibly does something', async ({ page }) => {
    await page.goto('/showcase/index.html');
    await page.waitForSelector('.kp-icon-button');

    const headerBg = () => page.evaluate(() => getComputedStyle(document.querySelector('.sc-header')).backgroundColor);
    const before = await headerBg();
    await page.click('.kp-icon-button');
    await page.click('#showcase-theme-menu [data-kp-theme="dark"]');
    expect(await headerBg()).not.toBe(before);
});

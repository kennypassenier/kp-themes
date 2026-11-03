// rguard-1103: the region guard's page-wide leave check, flush hook, per-field saved mark and registered editors (Habits 03/11).
import { expect, test } from '@playwright/test';

const PAGE = '/tests/fixtures/region-guard.html';
const ready = (/** @type {import('@playwright/test').Page} */ page) => page.waitForFunction(() => document.documentElement.hasAttribute('data-kp-auto-ready') && window.demo);
const question = (/** @type {import('@playwright/test').Page} */ page) => page.locator('[data-kp-confirm-dialog]');

test('a flush hook saves before the question and the question asks only if text is still unsaved [rguard-1103]', { tag: ['@component:overlays'] }, async ({ page }) => {
    await page.goto(PAGE);
    await ready(page);
    await page.locator('[data-test="notes-field"]').fill('milk');
    await page.evaluate(() => window.demo.leave());
    await expect(question(page)).toHaveCount(0);
    expect(await page.evaluate(() => [window.demo.state.saves, window.demo.state.left, window.demo.state.serverNotes])).toEqual([1, 1, 'milk']);
    // A rejected save is not silent: the question asks.
    await page.evaluate(() => (window.demo.state.fail = true));
    await page.locator('[data-test="notes-field"]').fill('milk and eggs');
    await page.evaluate(() => window.demo.leave());
    await expect(question(page)).toBeVisible();
    await question(page).locator('[data-kp-confirm-cancel]').click();
    expect(await page.evaluate(() => window.demo.state.left)).toBe(1);
});

test('two changed regions raise one question, and Discard lets both go [rguard-1103]', { tag: ['@component:overlays'] }, async ({ page }) => {
    await page.goto(PAGE);
    await ready(page);
    await page.evaluate(() => (window.demo.state.fail = true));
    await page.locator('[data-test="notes-field"]').fill('a');
    await page.locator('[data-test="plan-field"]').fill('b');
    expect(await page.evaluate(() => window.demo.pageChanged())).toBe(true);
    await page.evaluate(() => window.demo.leave());
    await expect(question(page)).toHaveCount(1);
    await question(page).locator('[data-kp-confirm-accept]').click();
    await expect(question(page)).toHaveCount(0);
    expect(await page.evaluate(() => [window.demo.state.left, window.demo.pageChanged()])).toEqual([1, false]);
});

test('markRegionSaved with a field makes dirty mean "differs from what the server holds" [rguard-1103]', { tag: ['@component:overlays'] }, async ({ page }) => {
    await page.goto(PAGE);
    await ready(page);
    const field = page.locator('[data-test="plan-field"]');
    await field.fill('draft');
    expect(await page.evaluate(() => window.demo.pageChanged())).toBe(true);
    await page.evaluate(() => {
        const plan = document.querySelector('[data-test="plan"]');
        window.demo.markRegionSaved(plan, plan.querySelector('input'));
    });
    expect(await page.evaluate(() => window.demo.pageChanged())).toBe(false);
    await field.fill('draft two');
    expect(await page.evaluate(() => window.demo.pageChanged())).toBe(true);
});

test('a registered non-form editor takes part in the page-wide check and flushes first [rguard-1103]', { tag: ['@component:overlays'] }, async ({ page }) => {
    await page.goto(PAGE);
    await ready(page);
    const off = await page.evaluate(() => {
        window.demo.stop = window.demo.register();
        return typeof window.demo.stop;
    });
    expect(off).toBe('function');
    await page.locator('[data-test="quick"]').fill('buy bread');
    expect(await page.evaluate(() => window.demo.pageChanged())).toBe(true);
    await page.evaluate(() => window.demo.leave());
    await expect(question(page)).toHaveCount(0);
    expect(await page.evaluate(() => [window.demo.state.left, window.demo.pageChanged()])).toEqual([1, false]);
    await page.locator('[data-test="quick"]').fill('again');
    await page.evaluate(() => window.demo.stop());
    expect(await page.evaluate(() => window.demo.pageChanged())).toBe(false);
});

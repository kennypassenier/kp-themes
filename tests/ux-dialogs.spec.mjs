// uxdialogs1101: the dialog, drawer and confirmation options Kenny answered on 2026-11-01 (the app review). Behaviour only:
// how each looks is judged on research/ux-dialogs-1101. Written beside the change; it runs with the release suite.
import { expect, test } from '@playwright/test';

const PAGE = '/tests/fixtures/ux-dialogs.html';
const ready = (/** @type {import('@playwright/test').Page} */ page) => page.waitForFunction(() => document.documentElement.hasAttribute('data-kp-auto-ready'));

test('a beside drawer leaves the list usable, marks its row, moves with a row and closes on Escape [uxdialogs1101]', { tag: ['@component:overlays'] }, async ({ page }) => {
    await page.goto(PAGE);
    await ready(page);
    await page.locator('[data-test="edit-soups"]').click();
    const drawer = page.locator('[data-test="beside"]');
    await expect(drawer).toBeVisible();
    // Drill: open it with showModal() in js/overlays/dialog-open.js and this is true.
    expect(await drawer.evaluate((d) => d.matches(':modal'))).toBe(false);
    await expect(page.locator('[data-test="row-soups"]')).toHaveAttribute('data-kp-drawer-current', '');
    await expect(page.locator('[data-test="edit-soups"]')).toHaveAttribute('aria-expanded', 'true');
    expect(await page.locator('[data-test="room"]').evaluate((el) => parseFloat(getComputedStyle(el).paddingInlineEnd))).toBeGreaterThan(300);
    await page.locator('[data-test="edit-pasta"]').click();
    await expect(page.locator('[data-test="row-pasta"]')).toHaveAttribute('data-kp-drawer-current', '');
    await expect(page.locator('[data-test="row-soups"]')).not.toHaveAttribute('data-kp-drawer-current', '');
    await page.keyboard.press('Escape');
    await expect(drawer).toBeHidden();
    await expect(page.locator('[data-kp-drawer-current]')).toHaveCount(0);
    await expect(page.locator('[data-test="edit-pasta"]')).toBeFocused();
});

test('a guarded drawer asks before a changed form closes, on Cancel and on Escape [uxdialogs1101]', { tag: ['@component:overlays'] }, async ({ page }) => {
    await page.goto(PAGE);
    await ready(page);
    await page.locator('[data-test="guarded-open"]').click();
    const drawer = page.locator('[data-test="guarded"]');
    await page.locator('[data-test="guarded-name"]').fill('Spaghetti carbonara');
    await page.locator('[data-test="guarded-cancel"]').click();
    const question = page.locator('[data-kp-confirm-dialog]');
    await expect(question).toBeVisible();
    await expect(question.locator('[data-kp-confirm-cancel]')).toHaveText('Keep editing');
    await question.locator('[data-kp-confirm-cancel]').click();
    await expect(drawer).toBeVisible();
    await page.locator('[data-test="guarded-name"]').press('Escape');
    await expect(question).toBeVisible();
    await question.locator('[data-kp-confirm-accept]').click();
    await expect(drawer).toBeHidden();
    // Unchanged, and a close that is an answer (save), close without a question.
    await page.locator('[data-test="guarded-open"]').click();
    await page.locator('[data-test="guarded-name"]').fill('Something else');
    await page.locator('[data-test="guarded-save"]').click();
    await expect(drawer).toBeHidden();
    await expect(question).toHaveCount(0);
});

test('a confirmation inside a replace dialog takes its place, with Back [uxdialogs1101]', { tag: ['@component:overlays', '@component:button'] }, async ({ page }) => {
    await page.goto(PAGE);
    await ready(page);
    await page.locator('[data-test="profiles-open"]').click();
    await page.locator('[data-test="profiles-delete"]').click();
    // Drill: drop stackHost() in js/components/confirm-dialog.js and a second modal opens.
    expect(await page.evaluate(() => document.querySelectorAll('dialog:modal').length)).toBe(1);
    await expect(page.locator('[data-test="profiles-row"]')).toBeHidden();
    const back = page.locator('[data-kp-confirm-cancel]');
    await expect(back).toHaveText('Back');
    await page.keyboard.press('Escape');
    await expect(page.locator('[data-test="profiles-row"]')).toBeVisible();
    await expect(page.locator('[data-test="profiles"]')).toBeVisible();
    await expect(page.locator('[data-test="profiles-delete"]')).toBeFocused();
});

test('Confirm takes its words from the phrase and the sentence is not said twice [uxdialogs1101]', { tag: ['@component:button', '@component:overlays'] }, async ({ page }) => {
    await page.goto(PAGE);
    await ready(page);
    await page.locator('[data-test="prune"]').click();
    const dialog = page.locator('[data-kp-confirm-dialog]');
    await expect(dialog.locator('[data-kp-confirm-accept]')).toHaveText('Prune 8 dead letters');
    await expect(dialog.locator('.kp-dialog__description')).toHaveText('Cancel leaves everything as it is.');
    await dialog.locator('[data-kp-confirm-cancel]').click();
    // A phrase that is not a question keeps the dictionary's word.
    await page.locator('[data-test="statement"]').click();
    await expect(dialog.locator('[data-kp-confirm-accept]')).toHaveText('Yes, do it');
});

test('a restorable action refuses the confirmation and says why [uxdialogs1101]', { tag: ['@component:button'] }, async ({ page }) => {
    const errors = /** @type {string[]} */ ([]);
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
    await page.goto(PAGE);
    await ready(page);
    await page.locator('[data-test="restorable"]').click();
    await expect(page.locator('[data-kp-confirm-dialog]')).toHaveCount(0);
    expect(errors.some((e) => /restorable/.test(e))).toBe(true);
});

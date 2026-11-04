// The undo toast has a key that reaches its Undo button, also from a text field [js-1104; MedicineCabinet 04/11].

import { expect, test } from '@playwright/test';

const FIXTURE = '/tests/fixtures/undo-focus.html';

/** Open the page, focus the field and raise a toast with the given options. @param {import('@playwright/test').Page} page @param {object} [options] */
async function toastFromField(page, options = {}) {
    await page.goto(FIXTURE);
    await page.waitForFunction(() => window.__ready === true);
    await page.locator('#qty').focus();
    await page.evaluate((o) => window.undoToast('Added 2 pills', { mode: 'revert', ms: 20000, undo: () => window.__undone++, ...o }), options);
    await expect(page.locator('.kp-toast--undo [data-kp-undo-button]')).toHaveCount(1);
}

/** Where the focus is: the element's id or its class. @param {import('@playwright/test').Page} page */
const focusAt = (page) => page.evaluate(() => (document.activeElement?.hasAttribute('data-kp-undo-button') ? 'undo-button' : document.activeElement?.id));

test.describe('the focus key of the undo toast [js-1104]', () => {
    test('Alt+Z from a text field puts the focus on Undo, Enter undoes, the focus goes back to the field', { tag: ['@component:feedback'] }, async ({ page }) => {
        await toastFromField(page);
        expect(await focusAt(page)).toBe('qty');
        await page.keyboard.press('Alt+Z');
        expect(await focusAt(page)).toBe('undo-button');
        await page.keyboard.press('Enter');
        await expect.poll(() => page.evaluate(() => window.__undone)).toBe(1);
        await expect.poll(() => focusAt(page)).toBe('qty');
    });

    test('data-kp-undo-focus-key moves the key, and none turns it off', { tag: ['@component:feedback'] }, async ({ page }) => {
        await toastFromField(page, { focusKey: 'Alt+J' });
        await page.keyboard.press('Alt+Z');
        expect(await focusAt(page)).toBe('qty');
        await page.keyboard.press('Alt+J');
        expect(await focusAt(page)).toBe('undo-button');
        await toastFromField(page, { focusKey: 'none' });
        await page.keyboard.press('Alt+Z');
        expect(await focusAt(page)).toBe('qty');
    });

    test('the page default on <html> is read, and with no toast the key does nothing', { tag: ['@component:feedback'] }, async ({ page }) => {
        await page.goto(FIXTURE);
        await page.waitForFunction(() => window.__ready === true);
        await page.evaluate(() => document.documentElement.setAttribute('data-kp-undo-focus-key', 'Alt+K'));
        await page.locator('#qty').focus();
        await page.keyboard.press('Alt+K');
        expect(await focusAt(page)).toBe('qty');
        await page.evaluate(() => window.undoToast('Done', { mode: 'revert', ms: 20000 }));
        await page.keyboard.press('Alt+K');
        expect(await focusAt(page)).toBe('undo-button');
    });

    test('Mod+Z still undoes outside a field, and never inside one', { tag: ['@component:feedback'] }, async ({ page }) => {
        await toastFromField(page);
        await page.keyboard.press('Control+Z');
        expect(await page.evaluate(() => window.__undone)).toBe(0);
        await page.locator('#other').focus();
        await page.keyboard.press('Control+Z');
        await expect.poll(() => page.evaluate(() => window.__undone)).toBe(1);
    });
});

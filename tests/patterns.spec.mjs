// The small patterns [TH51, TH53].
//
// The undo window is the one worth driving: an optimistic action that
// commits when it should have been taken back is the kind of defect
// nobody notices until data is gone.

import { test, expect } from '@playwright/test';
import { DEFAULT_STRINGS as S } from '../js/strings.js';

const URL = '/tests/fixtures/components.html';

test('the copy button copies the value and confirms in words [TH53]', async ({ page }) => {
    await page.goto(URL);
    // writeText is stubbed rather than the real clipboard granted: Firefox
    // has no clipboard-read permission in Playwright, and what is under
    // test is our code, not the browser's clipboard.
    await page.evaluate(() => {
        window.__copied = null;
        navigator.clipboard.writeText = async (text) => {
            window.__copied = text;
        };
    });
    const button = page.locator('[data-test="plain-copy"]');
    await button.click();
    expect(await page.evaluate(() => window.__copied)).toBe('a3f9-2b71');
    // The label itself changes: a colour flash is invisible to a screen
    // reader and to anyone who looked away for a second.
    await expect(button).toHaveText(S.copied);
    await expect(button).toHaveAttribute('data-kp-copied', '');
});

test('a refused clipboard is said out loud, not swallowed [TH53]', async ({ page }) => {
    await page.goto(URL);
    await page.evaluate(() => {
        navigator.clipboard.writeText = async () => {
            throw new Error('denied');
        };
    });
    const button = page.locator('[data-test="plain-copy"]');
    await button.click();
    // Silence here is how a copy button becomes the control people click
    // twice and then stop trusting.
    await expect(button).toHaveAttribute('data-kp-copy-failed', '');
    await expect(page.locator('.kp-toast')).toContainText(S.copyBlockedAnnouncement);
});

test('an optimistic delete hides the row and offers an undo [TH51]', async ({ page }) => {
    await page.goto(URL);
    const row = page.locator('[data-test="plain-undo-row"]');
    await expect(row).toBeVisible();
    await page.locator('[data-test="plain-undo"]').click();
    // Gone immediately: waiting for a server first is what makes an
    // interface feel slow, and the undo is what makes going first safe.
    await expect(row).toBeHidden();
    await expect(page.getByRole('button', { name: S.undo })).toBeVisible();
});

test('undo brings the row back and never commits [TH51]', async ({ page }) => {
    await page.goto(URL);
    await page.evaluate(() => {
        window.__committed = false;
        document.addEventListener('kp-action-commit', () => {
            window.__committed = true;
        });
    });
    await page.locator('[data-test="plain-undo"]').click();
    await page.getByRole('button', { name: S.undo }).click();
    await expect(page.locator('[data-test="plain-undo-row"]')).toBeVisible();

    // The fixture's window is 800 ms; well past it, nothing may have
    // committed. A click that was taken back must never reach the server.
    await page.waitForTimeout(1200);
    expect(await page.evaluate(() => window.__committed)).toBe(false);
});

test('left alone, the action commits once the window closes [TH51]', async ({ page }) => {
    await page.goto(URL);
    await page.evaluate(() => {
        window.__committed = 0;
        document.addEventListener('kp-action-commit', () => {
            window.__committed += 1;
        });
    });
    await page.locator('[data-test="plain-undo"]').click();
    expect(await page.evaluate(() => window.__committed)).toBe(0);
    await page.waitForTimeout(1200);
    expect(await page.evaluate(() => window.__committed)).toBe(1);
});

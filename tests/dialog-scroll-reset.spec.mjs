// A dialog opens at the top every time [scope-96].
//
// Kenny, 2026-09-15, dialog-scroll-reset "Bovenaan openen": on
// catalogue/overlays.html#dialog-long the sixty-row dialog, scrolled, closed
// and reopened, came back where it was left — 180px, and 360px the time
// after. A closed dialog keeps its scroll position; the package now puts the
// dialog and its body back at the top on every open, in both channels.
//
// Drilled per KT3 on 2026-09-15 in firefox: against b9dc0afb (no reset in
// js/overlays.js attachDialogs nor in components/overlays.jsx Dialog) every
// test here was red with the kept scroll position beside it below.

import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';
import { waitForJudging } from './helpers/catalogue.mjs';
import { useEmptyRegister } from './helpers/empty-register.mjs';

const THEMES = /** @type {string[]} */ (JSON.parse(readFileSync(new URL('../themes/order.json', import.meta.url), 'utf8')));

/**
 * The scroll positions of a dialog and of its body, once the paint has them.
 *
 * @param {import('@playwright/test').Locator} dialog
 */
const scrolls = (dialog) =>
    dialog.evaluate((el) => ({
        dialog: el.scrollTop,
        body: /** @type {HTMLElement | null} */ (el.querySelector(':scope > .kp-dialog__body'))?.scrollTop ?? 0,
    }));

/**
 * Scroll whichever of the dialog and its body scrolls, and report how far it went.
 *
 * @param {import('@playwright/test').Locator} dialog
 */
const scrollDown = (dialog) =>
    dialog.evaluate((el) => {
        const body = /** @type {HTMLElement | null} */ (el.querySelector(':scope > .kp-dialog__body'));
        for (const box of [el, ...(body ? [body] : [])]) box.scrollTop = 180;
        return Math.max(el.scrollTop, body?.scrollTop ?? 0);
    });

test.describe('a dialog opens at the top every time [overlays#dialog-long, scope-96]', { tag: ['@component:overlays'] }, () => {
    test(
        'catalogue: the sixty-row dialog, scrolled, closed and reopened twice, opens with its body at 0 in every theme',
        { tag: '@sweep' },
        async ({ page }) => {
            // Before: body 180 on the first reopen, 360 on the second, in every theme.
            test.setTimeout(180_000);
            await page.setViewportSize({ width: 1280, height: 720 });
            await useEmptyRegister(page.context());
            await page.goto('/catalogue/overlays.html');
            await waitForJudging(page);
            const trigger = page.locator('[data-kp-dialog="ov-long-live"]');
            const dialog = page.locator('#ov-long-live');
            const faults = [];
            for (const theme of THEMES) {
                await page.evaluate((name) => document.documentElement.setAttribute('data-theme', name), theme);
                for (let round = 1; round <= 2; round++) {
                    await trigger.click();
                    await expect(dialog).toBeVisible();
                    await expect.poll(() => dialog.evaluate((el) => el.matches(':modal'))).toBe(true);
                    const opened = await scrolls(dialog);
                    if (opened.dialog !== 0 || opened.body !== 0) faults.push(`${theme} open ${round}: dialog ${opened.dialog}, body ${opened.body}`);
                    await page.evaluate(() => {
                        const body = /** @type {HTMLElement} */ (document.querySelector('#ov-long-live > .kp-dialog__body'));
                        body.scrollTop += 180;
                    });
                    expect(
                        await dialog.evaluate((el) => /** @type {HTMLElement} */ (el.querySelector('.kp-dialog__body')).scrollTop),
                        `${theme}: the body scrolls`,
                    ).toBeGreaterThan(0);
                    await page.keyboard.press('Escape');
                    await expect(dialog).toBeHidden();
                }
                await trigger.click();
                await expect(dialog).toBeVisible();
                const last = await scrolls(dialog);
                if (last.dialog !== 0 || last.body !== 0) faults.push(`${theme} open 3: dialog ${last.dialog}, body ${last.body}`);
                await page.keyboard.press('Escape');
                await expect(dialog).toBeHidden();
            }
            expect(faults).toEqual([]);
        },
    );

    for (const channel of [
        // The framework-free fixture dialog has no body, and a dialog that
        // scrolls itself is put back at the top by both engines already
        // (measured 2026-09-15, 0 on every reopen), so its paragraph is
        // wrapped in the package's .kp-dialog__body, as the React one renders.
        { name: 'framework-free', root: '#plain', content: '[data-test="dialog"] p', wrap: true, dialog: '[data-test="dialog"]' },
        { name: 'react', root: '#react-components', content: '[data-test="dialog-body"]', wrap: false, dialog: 'dialog.kp-dialog' },
    ]) {
        test(`${channel.name}: a dialog scrolled, closed and reopened opens at 0, the dialog and its body`, async ({ page }) => {
            // Before: the body at 180 on every reopen, in both channels.
            await page.setViewportSize({ width: 1024, height: 600 });
            await page.goto('/tests/fixtures/components.html');
            await page.waitForSelector(`${channel.root} [data-test="dialog-open"]`);
            const root = page.locator(channel.root);
            const dialog = root.locator(channel.dialog).first();
            // Make the content taller than any window, so the dialog has something to scroll.
            await root
                .locator(channel.content)
                .first()
                .evaluate((el, wrap) => {
                    const self = /** @type {HTMLElement} */ (el);
                    if (wrap) {
                        const body = document.createElement('div');
                        body.className = 'kp-dialog__body';
                        self.replaceWith(body);
                        body.append(self);
                    }
                    self.style.display = 'block';
                    self.style.blockSize = '3000px';
                }, channel.wrap);
            const faults = [];
            for (let round = 1; round <= 3; round++) {
                await root.locator('[data-test="dialog-open"]').click();
                await expect(dialog).toBeVisible();
                const opened = await scrolls(dialog);
                if (opened.dialog !== 0 || opened.body !== 0) faults.push(`open ${round}: dialog ${opened.dialog}, body ${opened.body}`);
                expect(await scrollDown(dialog), 'the dialog or its body scrolls').toBeGreaterThan(0);
                await root.locator('[data-test="dialog-close"]').click();
                await expect(dialog).toBeHidden();
            }
            expect(faults).toEqual([]);
        });
    }
});

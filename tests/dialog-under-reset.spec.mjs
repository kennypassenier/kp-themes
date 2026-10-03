// A modal dialog opens in the middle of the window under a CSS reset, in
// every theme.
//
// JobTracker, 2026-10-03: Tailwind's preflight sets `margin: 0` on every
// element, which takes away the browser's own `margin: auto` on a dialog, and
// a dialog opened with showModal() landed in the top-left corner. The package
// now gives `.kp-dialog` its margin and a modal one its inset itself, in
// kp.components, which comes after Tailwind's layers in the order the README
// gives. The fixture copies the part of preflight that reaches a dialog.

import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';

const THEMES = /** @type {string[]} */ (JSON.parse(readFileSync(new URL('../themes/order.json', import.meta.url), 'utf8')));

test.describe('a modal dialog opens centred under a reset [dialog-under-reset]', { tag: ['@component:overlays', '@sweep'] }, () => {
    test.use({ reducedMotion: 'reduce' });

    test('in every theme, the dialog sits in the middle of the window', async ({ page }) => {
        await page.setViewportSize({ width: 1280, height: 800 });
        await page.goto('/tests/fixtures/dialog-under-reset.html');
        const off = [];
        for (const theme of THEMES) {
            const box = await page.evaluate(async (name) => {
                document.documentElement.setAttribute('data-theme', name);
                const dialog = /** @type {HTMLDialogElement} */ (document.querySelector('[data-test="dialog"]'));
                dialog.showModal();
                await Promise.all(dialog.getAnimations({ subtree: true }).map((a) => a.finished.catch(() => {})));
                const r = dialog.getBoundingClientRect();
                dialog.close();
                return { left: r.left, right: innerWidth - r.right, top: r.top, bottom: innerHeight - r.bottom };
            }, theme);
            // Centred: the space left and right of it, and above and below,
            // agree within two pixels (a register's frame may draw past it,
            // its box does not move).
            if (Math.abs(box.left - box.right) > 2 || Math.abs(box.top - box.bottom) > 2) off.push(`${theme} ${JSON.stringify(box)}`);
        }
        expect(off, 'dialogs not centred').toEqual([]);
    });
});

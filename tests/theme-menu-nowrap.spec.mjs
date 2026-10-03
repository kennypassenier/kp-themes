// Every row of the theme menu stays on one line, in every theme, the selected
// (bold) row included.
//
// JobTracker, 2026-10-03: in the React switcher the selected row broke onto
// two lines in high-contrast, shade-light and shade-dark. The list is placed
// against its button and took the button's width as its room; it is now as
// wide as its longest row, and a row does not wrap.

import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';

const THEMES = /** @type {string[]} */ (JSON.parse(readFileSync(new URL('../themes/order.json', import.meta.url), 'utf8')));

test.describe('the theme menu keeps every row on one line [theme-menu-nowrap]', { tag: ['@component:picker', '@sweep'] }, () => {
    test('in every theme, no row of the open menu wraps', async ({ page }) => {
        await page.setViewportSize({ width: 1280, height: 900 });
        const wrapped = [];
        for (const theme of THEMES) {
            await page.addInitScript((name) => {
                try {
                    localStorage.setItem('theme', name);
                } catch {
                    // no storage: the theme check below reports it
                }
            }, theme);
            await page.goto('/showcase/index.html');
            await page.waitForFunction((name) => document.documentElement.getAttribute('data-theme') === name, theme);
            await page.locator('.kp-theme-menu > .kp-icon-button').first().click();
            await expect(page.locator('.kp-theme-menu [role="option"]').first()).toBeVisible();
            const rows = await page.locator('.kp-theme-menu [role="option"]').evaluateAll((options) =>
                options.map((option) => {
                    const label = option.querySelector('.kp-theme-option__label') ?? option;
                    const range = document.createRange();
                    range.selectNodeContents(label);
                    const tops = new Set([...range.getClientRects()].filter((r) => r.width > 0).map((r) => Math.round(r.top)));
                    return { name: label.textContent?.trim(), lines: tops.size, overflow: option.scrollWidth > option.clientWidth + 1 };
                }),
            );
            for (const row of rows) if (row.lines > 1 || row.overflow) wrapped.push(`${theme}: ${row.name} (${row.lines} lines${row.overflow ? ', overflows' : ''})`);
            await page.keyboard.press('Escape');
        }
        expect(wrapped, 'rows of the theme menu that wrap').toEqual([]);
    });
});

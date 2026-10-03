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
    // 390 is the phone width JobTracker's sweep found it at.
    for (const width of [390, 1280])
        test(`in every theme, no row of the open menu wraps at ${width}px`, async ({ page }) => {
            await page.setViewportSize({ width, height: 900 });
            // The React switcher under the reset JobTracker has, in every register.
            await page.goto('/tests/fixtures/theme-menu-under-reset.html');
            const menu = page.locator('#react-mount .kp-theme-menu');
            const trigger = menu.locator('> .kp-icon-button');
            const options = menu.locator('[role="option"]');
            const wrapped = [];
            for (const theme of THEMES) {
                // Chosen through the menu itself, so the row under test is the
                // selected, bold one.
                if (!(await options.first().isVisible())) await trigger.click();
                await options.and(page.locator(`[data-kp-theme="${theme}"]`)).click();
                await page.waitForFunction((name) => document.documentElement.getAttribute('data-theme') === name, theme);
                if (!(await options.first().isVisible())) await trigger.click();
                await expect(options.first()).toBeVisible();
                const rows = await options.evaluateAll((all) =>
                    all.map((option) => {
                        const label = option.querySelector('.kp-theme-option__label') ?? option;
                        const range = document.createRange();
                        range.selectNodeContents(label);
                        const tops = new Set([...range.getClientRects()].filter((r) => r.width > 0).map((r) => Math.round(r.top)));
                        return { name: label.textContent?.trim(), lines: tops.size, overflow: option.scrollWidth > option.clientWidth + 1 };
                    }),
                );
                for (const row of rows)
                    if (row.lines > 1 || row.overflow) wrapped.push(`${theme}: ${row.name} (${row.lines} lines${row.overflow ? ', overflows' : ''})`);
            }
            expect(wrapped, 'rows of the theme menu that wrap').toEqual([]);
        });
});

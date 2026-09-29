// An indeterminate progress bar wears its stripes in every theme.
//
// The homelab dashboard (2026-09-29): `.kp-progress:indeterminate` draws its
// stripes as a background-image, and twenty registers set the track with the
// `background` shorthand one layer later, which reset the image — so a bar
// meaning "no idea yet" rendered as an empty track in all of them. The
// registers now set only the track's colour. Per theme on purpose: the
// fault lived in each register separately.

import { expect, test } from '@playwright/test';
import { readdirSync } from 'node:fs';

const THEMES = readdirSync(new URL('../themes/', import.meta.url), { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);

test('an indeterminate bar is striped in every theme', { tag: ['@sweep', '@component:feedback'] }, async ({ page }) => {
    test.setTimeout(120_000);
    // A catalogue page: it loads each theme's register, as an app does.
    await page.goto('/catalogue/table.html');
    await page.evaluate(() => {
        const bar = document.createElement('progress');
        bar.className = 'kp-progress';
        bar.dataset.test = 'bar';
        document.body.append(bar);
    });
    const unstriped = [];
    for (const theme of THEMES) {
        // Each register arrives with its theme; read the bar once it has.
        await page.evaluate(async (theme) => {
            (await import('/js/theme-core.js')).applyTheme(theme);
            const loaded = () =>
                [...document.querySelectorAll('link[rel="stylesheet"]')].some(
                    (link) => link.getAttribute('href')?.includes(`${theme}-register.css`) && /** @type {HTMLLinkElement} */ (link).sheet,
                );
            for (let i = 0; i < 60 && !loaded(); i += 1) await new Promise((resolve) => setTimeout(resolve, 50));
        }, theme);
        await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
        const image = await page.locator('[data-test="bar"]').evaluate((el) => getComputedStyle(el).backgroundImage);
        if (!image.includes('gradient')) unstriped.push(theme);
    }
    expect(unstriped, 'themes whose indeterminate bar has no stripes').toEqual([]);
});

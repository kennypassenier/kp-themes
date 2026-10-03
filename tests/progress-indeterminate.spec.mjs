// A busy bar never looks like a finished one, in every theme [scope-140].
//
// The homelab dashboard (2026-09-29) found the first form of this fault on
// `<progress class="kp-progress">`: twenty registers reset the stripes of
// the indeterminate bar, so "no idea yet" rendered as an empty track. Since
// 9.0.0 each register draws its own `.kp-progressbar`, busy state included,
// so the fault can come back in any one of them. The reading is taken
// standing still (reduced motion), where a moving band can no longer tell
// the two apart by motion alone. Per theme on purpose: the fault lived in
// each register separately.

import { expect, test } from '@playwright/test';
import { sweepThemes } from './helpers/sweep-themes.mjs';

const PARTS =
    '<span class="kp-progressbar__track" aria-hidden="true"><span class="kp-progressbar__fill"></span><span class="kp-progressbar__head"></span></span>';

test('a busy bar differs from a full one in every theme, standing still', { tag: ['@sweep', '@component:feedback'] }, async ({ page }) => {
    test.setTimeout(120_000);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    // A catalogue page: it loads each theme's register, as an app does.
    await page.goto('/catalogue/table.html');
    await page.evaluate((parts) => {
        const holder = document.createElement('div');
        holder.style.cssText = 'inline-size: 20rem; padding: 1rem';
        holder.innerHTML =
            `<div class="kp-progressbar" role="progressbar" aria-label="Done" aria-valuemin="0" aria-valuemax="100" aria-valuenow="100" style="--kp-value: 1" data-test="full">${parts}</div>` +
            `<div class="kp-progressbar" role="progressbar" aria-label="Busy" data-kp-indeterminate data-test="busy">${parts}</div>`;
        document.body.prepend(holder);
    }, PARTS);
    const alike = [];
    for (const theme of sweepThemes()) {
        // Each register arrives with its theme; read the bars once it has.
        await page.evaluate(async (theme) => {
            (await import('/js/theme-core.js')).applyTheme(theme);
            const loaded = () =>
                [...document.querySelectorAll('link[rel="stylesheet"]')].some(
                    (link) => link.getAttribute('href')?.includes(`${theme}-register.css`) && /** @type {HTMLLinkElement} */ (link).sheet,
                );
            for (let i = 0; i < 60 && !loaded(); i += 1) await new Promise((resolve) => setTimeout(resolve, 50));
        }, theme);
        await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
        const full = await page.locator('[data-test="full"]').screenshot({ animations: 'disabled' });
        const busy = await page.locator('[data-test="busy"]').screenshot({ animations: 'disabled' });
        if (full.equals(busy)) alike.push(theme);
    }
    expect(alike, 'themes whose busy bar paints exactly like a full one').toEqual([]);
});

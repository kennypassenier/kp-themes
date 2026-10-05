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

// Three sizes [Kenny, 2026-10-05: "zodat dit de kleine is, een midden en een
// grotere optie"]. Per theme, because each register multiplies its own
// drawing by --kp-progressbar-scale: the track is 1.5 and 2 times the small
// one on whole pixels, the reading beside it steps 13, 16, 18px on one line,
// and a busy bar still differs from a full one at every size.
test('the progress bar comes in three sizes in every theme', { tag: ['@sweep', '@component:feedback'] }, async ({ page }) => {
    test.setTimeout(180_000);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/catalogue/table.html');
    await page.evaluate((parts) => {
        const holder = document.createElement('div');
        holder.style.cssText = 'inline-size: 20rem; padding: 1rem';
        holder.innerHTML = ['', 'kp-progressbar--md', 'kp-progressbar--lg']
            .map(
                (size, i) =>
                    `<div class="kp-progress__wrap" data-test="row-${i}"><div class="kp-progressbar ${size}" role="progressbar" aria-label="Done" aria-valuenow="100" style="--kp-value: 1" data-test="full-${i}">${parts}</div><span class="kp-progress__value">100%</span></div>` +
                    `<div class="kp-progressbar ${size}" role="progressbar" aria-label="Busy" data-kp-indeterminate data-test="busy-${i}">${parts}</div>`,
            )
            .join('');
        document.body.prepend(holder);
    }, PARTS);
    const faults = [];
    for (const theme of sweepThemes()) {
        await page.evaluate(async (theme) => {
            (await import('/js/theme-core.js')).applyTheme(theme);
            const loaded = () =>
                [...document.querySelectorAll('link[rel="stylesheet"]')].some(
                    (link) => link.getAttribute('href')?.includes(`${theme}-register.css`) && /** @type {HTMLLinkElement} */ (link).sheet,
                );
            for (let i = 0; i < 60 && !loaded(); i += 1) await new Promise((resolve) => setTimeout(resolve, 50));
        }, theme);
        await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
        const read = await page.evaluate(() =>
            [0, 1, 2].map((i) => {
                const bar = /** @type {HTMLElement} */ (document.querySelector(`[data-test="full-${i}"]`));
                const value = /** @type {HTMLElement} */ (document.querySelector(`[data-test="row-${i}"] .kp-progress__value`));
                const line = parseFloat(getComputedStyle(value).lineHeight) || parseFloat(getComputedStyle(value).fontSize) * 1.6;
                return {
                    height: bar.getBoundingClientRect().height,
                    text: parseFloat(getComputedStyle(value).fontSize),
                    oneLine: value.getBoundingClientRect().height < line * 1.5,
                };
            }),
        );
        const [sm, md, lg] = read;
        if (md.height !== sm.height * 1.5 || lg.height !== sm.height * 2) faults.push(`${theme}: tracks ${sm.height}/${md.height}/${lg.height}px`);
        if (read.some((r) => r.height !== Math.round(r.height))) faults.push(`${theme}: a track off the pixel grid`);
        if (sm.text !== 13 || md.text !== 16 || lg.text !== 18) faults.push(`${theme}: readings ${sm.text}/${md.text}/${lg.text}px`);
        if (read.some((r) => !r.oneLine)) faults.push(`${theme}: a reading on two lines`);
        for (const i of [1, 2]) {
            const full = await page.locator(`[data-test="full-${i}"]`).screenshot({ animations: 'disabled' });
            const busy = await page.locator(`[data-test="busy-${i}"]`).screenshot({ animations: 'disabled' });
            if (full.equals(busy)) faults.push(`${theme}: busy paints like full at size ${i}`);
        }
    }
    expect(faults, 'themes whose three sizes are not the small bar at 1, 1.5 and 2').toEqual([]);
});

// Three faults the signature survey of 2026-10-03 measured in the package
// (research/signature-elements/README.md), each locked here:
//   - retro and cyberpunk drew every .kp-field__check square, so a radio
//     looked like a checkbox;
//   - cyberpunk styled .kp-wizard__step, a class the package never renders;
//   - the switch thumb travelled by inset-inline-start, a layout property,
//     in all 22 themes, where transform moves it without a layout.
// Written on the day; run with the suite at Kenny's release go (his rule of
// 2026-09-30), red on the commit before the fix.

import { expect, test } from '@playwright/test';

/** Switch the catalogue page to a theme and wait for its register. */
async function wear(page, theme) {
    await page.evaluate(async (theme) => {
        (await import('/js/theme-core.js')).applyTheme(theme);
        const loaded = () =>
            [...document.querySelectorAll('link[rel="stylesheet"]')].some(
                (link) => link.getAttribute('href')?.includes(`${theme}-register.css`) && /** @type {HTMLLinkElement} */ (link).sheet,
            );
        for (let i = 0; i < 60 && !loaded(); i += 1) await new Promise((resolve) => setTimeout(resolve, 50));
    }, theme);
    await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
}

for (const theme of ['retro', 'cyberpunk']) {
    test(`a radio is round in ${theme}, a checkbox is not`, { tag: ['@component:field', `@theme:${theme}`] }, async ({ page }) => {
        await page.goto('/catalogue/field.html');
        await wear(page, theme);
        const radio = page.locator('input[type="radio"].kp-field__check').first();
        const check = page.locator('input[type="checkbox"].kp-field__check').first();
        expect(await radio.evaluate((el) => getComputedStyle(el).borderTopLeftRadius)).toBe('50%');
        expect(await check.evaluate((el) => getComputedStyle(el).borderTopLeftRadius)).not.toBe('50%');
    });
}

test('cyberpunk styles the wizard steps the package renders', { tag: ['@component:structure', '@theme:cyberpunk'] }, async ({ page }) => {
    await page.goto('/catalogue/structure.html');
    await wear(page, 'cyberpunk');
    const step = page.locator('.kp-wizard__steps li').first();
    expect(await step.evaluate((el) => getComputedStyle(el).textTransform)).toBe('uppercase');
});

test('the switch thumb moves by transform, not by its inset', { tag: ['@component:switch'] }, async ({ page }) => {
    await page.goto('/catalogue/switch.html');
    const input = page.locator('.kp-switch__input').first();
    const read = () =>
        input.evaluate((el) => {
            const style = getComputedStyle(el, '::before');
            return { left: style.insetInlineStart, transform: style.transform };
        });
    await input.evaluate((el) => {
        /** @type {HTMLInputElement} */ (el).checked = false;
    });
    const off = await read();
    await input.evaluate((el) => {
        /** @type {HTMLInputElement} */ (el).checked = true;
    });
    const on = await read();
    expect(on.left, 'the inset stays where it was').toBe(off.left);
    expect(on.transform, 'the thumb travels by transform').not.toBe('none');
});

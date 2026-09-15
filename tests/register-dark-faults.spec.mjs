// Dark's measured register faults [scope-100], read on the catalogue.
//
// Three faults an agent measured in firefox at ee05b46e and Kenny selected
// in the register-faults form: a disabled button answered the pointer as a
// live one did (the ground 17 → 28, the brackets closing in, the label
// drawing in); the primary button lightened on hover to about 99% where
// its --primary-hover says 86%; and the chamfer's clip-path cut the
// dialog's shadow away, so a dialog lay flat on its backdrop.
//
// Drilled per KT3 on 2026-09-16, firefox, against c9f58c08 before the
// fixes: every test below went red, with the measured value in its
// "Before" line.

import { expect, test } from '@playwright/test';
import { waitForJudging } from './helpers/catalogue.mjs';
import { useEmptyRegister } from './helpers/empty-register.mjs';

/** @param {import('@playwright/test').Page} page @param {string} url */
const openDark = async (page, url) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.setViewportSize({ width: 1280, height: 900 });
    await useEmptyRegister(page.context());
    await page.goto(url);
    await waitForJudging(page);
    // catalogue/deps.css imports every register, so dark's rules are on the
    // page the moment the attribute is.
    await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'));
    await page.mouse.move(0, 0);
};

/** Everything hover may change on a button, in one reading. @param {import('@playwright/test').Locator} button */
const hoverPaint = (button) =>
    button.evaluate((el) => {
        const s = getComputedStyle(el);
        const before = getComputedStyle(el, '::before');
        const after = getComputedStyle(el, '::after');
        const label = el.querySelector('.kp-button__label');
        const edge = el.querySelector('.kp-button__edge');
        return {
            background: s.backgroundColor,
            border: s.borderColor,
            color: s.color,
            translate: s.translate,
            transform: s.transform,
            before: `${before.opacity} ${before.translate}`,
            after: `${after.opacity} ${after.translate}`,
            label: label ? getComputedStyle(label).scale : '',
            edge: edge ? getComputedStyle(edge).scale : '',
        };
    });

/** @param {import('@playwright/test').Locator} button */
const running = (button) => button.evaluate((el) => el.getAnimations({ subtree: true }).length);

test.describe('dark: the buttons under the pointer [scope-100]', { tag: ['@theme:dark', '@component:button'] }, () => {
    test('a disabled button paints at hover exactly what it paints at rest', async ({ page }) => {
        // Before: the plain and secondary disabled buttons' ground went
        // rgb(17, 19, 23) → rgb(28, 31, 38); the primary's rgb(233, 238, 241) →
        // about rgb(252, 253, 253), border too; on all three both brackets went
        // opacity 0 → 1 and translate ∓8px → 0.
        await openDark(page, '/catalogue/button.html');
        const buttons = page.locator('#states .cat-stage .kp-button:disabled');
        const count = await buttons.count();
        expect(count).toBeGreaterThanOrEqual(3);
        const faults = [];
        for (let i = 0; i < count; i++) {
            const button = buttons.nth(i);
            await button.scrollIntoViewIfNeeded();
            await page.mouse.move(0, 0);
            await expect.poll(() => running(button)).toBe(0);
            const rest = await hoverPaint(button);
            const box = /** @type {{ x: number, y: number, width: number, height: number }} */ (await button.boundingBox());
            await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
            await expect.poll(() => button.evaluate((el) => el.matches(':hover'))).toBe(true);
            await expect.poll(() => running(button)).toBe(0);
            const hovered = await hoverPaint(button);
            for (const key of /** @type {(keyof typeof rest)[]} */ (Object.keys(rest)))
                if (rest[key] !== hovered[key]) faults.push(`${await button.textContent()}: ${key} ${rest[key]} → ${hovered[key]}`);
            await page.mouse.move(0, 0);
        }
        expect(faults).toEqual([]);
    });

    test("the primary button's hover ground is its --primary-hover", async ({ page }) => {
        // Before: rest rgb(233, 238, 241) (93%), hover color(srgb 0.9878 0.9907
        // 0.9922), about 99% (`l + 6`), where --primary-hover is rgb(211, 222, 227).
        await openDark(page, '/catalogue/button.html');
        const button = page.locator('#variants .cat-stage .kp-button--primary:not(:disabled)').first();
        await button.scrollIntoViewIfNeeded();
        const token = await button.evaluate((el) => {
            const probe = document.createElement('span');
            probe.style.backgroundColor = 'var(--primary-hover)';
            el.parentElement?.append(probe);
            const value = getComputedStyle(probe).backgroundColor;
            probe.remove();
            return value;
        });
        expect(token).not.toBe('rgba(0, 0, 0, 0)');
        await button.hover();
        await expect.poll(() => button.evaluate((el) => getComputedStyle(el).backgroundColor)).toBe(token);
        await expect.poll(() => button.evaluate((el) => getComputedStyle(el).borderColor)).toBe(token);
        await page.mouse.move(0, 0);
    });
});

test.describe('dark: the dialog casts its shadow [scope-100]', { tag: ['@theme:dark', '@component:overlays'] }, () => {
    test('opened, the strip under the dialog paints differently with the dialog there than without it', async ({ page }) => {
        // Before: 0 of the strip's 9280 pixels changed when the dialog went
        // transparent — the chamfer's clip-path cut the 0 12px 28px shadow
        // away (1406px of it came back with the clip removed).
        await openDark(page, '/catalogue/overlays.html');
        await page.locator('[data-kp-dialog="ov-d1-live"]').click();
        const dialog = page.locator('#ov-d1-live');
        await expect.poll(() => dialog.evaluate((el) => /** @type {HTMLDialogElement} */ (el).matches(':modal'))).toBe(true);
        await expect.poll(() => dialog.evaluate((el) => el.getAnimations({ subtree: true }).length)).toBe(0);
        await page.mouse.move(0, 0);
        const box = /** @type {{ x: number, y: number, width: number, height: number }} */ (await dialog.boundingBox());
        // Under the dialog, clear of the chamfered corner, where a 12px drop
        // and a 28px blur land.
        const strip = { x: box.x + 24, y: box.y + box.height + 2, width: box.width - 48, height: 20 };
        // The shadow is declared in the theme's own ground, hsl(from
        // var(--background) … / 0.45), and on dark's backdrop that colour is
        // within 2 levels of what is already there: whether it paints at all
        // is read with the dialog's --background set to a probe colour, which
        // reaches the shadow and nothing under the dialog.
        await dialog.evaluate((el) => /** @type {HTMLElement} */ (el).style.setProperty('--background', 'rgb(255, 0, 0)'));
        const withDialog = await page.screenshot({ clip: strip, animations: 'disabled' });
        // Opacity is not inherited by ::backdrop, so the backdrop stays.
        await dialog.evaluate((el) => {
            /** @type {HTMLElement} */ (el).style.setProperty('transition', 'none');
            /** @type {HTMLElement} */ (el).style.setProperty('opacity', '0');
        });
        const without = await page.screenshot({ clip: strip, animations: 'disabled' });
        const changed = await page.evaluate(
            async ([one, two]) => {
                /** @param {string} data */
                const pixels = async (data) => {
                    const img = await new Promise((resolve, reject) => {
                        const image = new Image();
                        image.onload = () => resolve(image);
                        image.onerror = reject;
                        image.src = `data:image/png;base64,${data}`;
                    });
                    const canvas = document.createElement('canvas');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    const ctx = /** @type {CanvasRenderingContext2D} */ (canvas.getContext('2d'));
                    ctx.drawImage(img, 0, 0);
                    return ctx.getImageData(0, 0, img.width, img.height).data;
                };
                const [p, q] = await Promise.all([pixels(one), pixels(two)]);
                let n = 0;
                for (let i = 0; i < p.length; i += 4)
                    if (Math.max(Math.abs(p[i] - q[i]), Math.abs(p[i + 1] - q[i + 1]), Math.abs(p[i + 2] - q[i + 2])) >= 16) n++;
                return { changed: n, of: p.length / 4 };
            },
            [withDialog.toString('base64'), without.toString('base64')],
        );
        // At least a quarter of the strip: a shadow, not an antialiased edge.
        expect(changed.changed, JSON.stringify(changed)).toBeGreaterThanOrEqual(changed.of / 4);
    });
});

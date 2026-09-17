// A bar's panels stay inside the box that shows them, and a closed
// over-the-page side navigation is off screen [fix-39, fix-40].
//
// Two rejections from Kenny's catalogue review of 2026-09-16, firefox at a
// device pixel ratio of 2.222:
//
//   light `navigation--mega-menu` — "de Account dropdown verliest een deel
//   van het rechtergedeelte omdat het venster niet breed genoeg is,
//   mogelijks zo met elk thema. Als er niet genoeg plaats is moet het
//   dropdown item naar links bewegen tot zijn rechterkant de rechterkant
//   van het venster is en alles dus zichtbaar is".
//
//   brutalism `navigation--sidenav-over` — "Hier staat het menu al meer dan
//   volledig op de pagina voor ik het open. Het moet normaal toch 'uit het
//   zicht' zijn?"
//
// The first is not the window's edge, which fix-27 already answers. He was
// reading the block in the review dialog, whose stage carries `contain:
// strict` and `overflow: auto` (catalogue/catalogue.css,
// `.cat-review-dialog__stage`): the stage clips, `placeNavMenu` measured
// against `document.documentElement.clientWidth` alone, saw a panel that
// fitted the window, and left it where it was. Measured on
// catalogue/navigation.html#mega-menu in the review dialog, firefox, before
// the fix: the Account dropdown's right edge lay 70px past the stage at
// 1280, 83px at 1024 and 83px at 900, and `data-kp-nav-menu-end` was never
// written. So the fixture below copies that stage property for property and
// asks the same question at the three widths.
//
// The second is one line of brutalism's register: its label tag needs a
// positioned box, and `[data-theme='brutalism'] .kp-sidenav { position:
// relative }` took the `position: fixed` an `over` panel gets from the base
// away with it. In the flow the closed panel stands on the page.
//
// Red run first, in firefox on c4dfc1c2, before either change [KT3]:
//   · the six dropdown tests failed, each naming the pixels past the box
//     (`the dropdown lies inside the box that shows it … expected <= 0`).
//   · the mega-menu tests passed there already — the wide panel is lined up
//     with its bar, which is inside the box — and are kept as the guard
//     that the shift never pushes it out.
//   · the two sidenav tests failed under brutalism only, the closed panel
//     standing 240px inside the window and 240px inside its box.

import { expect, test } from '@playwright/test';
import { measured } from './paint.mjs';
import { sweepThemes } from './helpers/sweep-themes.mjs';

const FIXTURE = '/tests/fixtures/menu-in-window.html';

/** The widths Kenny's window passes through; his own was between the first two. */
const WIDTHS = [1280, 1024, 900];

/** The themes these sweeps run on at this level [scope-103]. */
const SWEEP = sweepThemes();

/**
 * Wear `theme`: its register loaded the way the lazy loader would, then the
 * attribute the whole cascade hangs from.
 *
 * @param {import('@playwright/test').Page} page @param {string} theme
 */
async function wear(page, theme) {
    await page.evaluate(
        (name) =>
            new Promise((done) => {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = `/css/${name}-register.css`;
                link.onload = done;
                link.onerror = done;
                document.head.append(link);
            }),
        theme,
    );
    await page.evaluate((name) => document.documentElement.setAttribute('data-theme', name), theme);
}

/**
 * How far a panel hangs out of the box that shows it, in pixels: the window
 * narrowed by every ancestor that clips. 0 when it is wholly inside.
 *
 * This is the reading the fault was invisible to. Measuring against the
 * window alone called a panel inside while the stage was cutting 83px off
 * its right side.
 *
 * @param {import('@playwright/test').Locator} locator
 * @param {string} message
 */
const outside = (locator, message) =>
    measured(
        locator,
        (el) => {
            let left = 0;
            let right = document.documentElement.clientWidth;
            for (let node = el.parentElement; node; node = node.parentElement) {
                const style = getComputedStyle(node);
                if (style.overflowX === 'visible' && !/\b(paint|strict|content)\b/.test(style.contain)) continue;
                const box = node.getBoundingClientRect();
                left = Math.max(left, box.left + node.clientLeft);
                right = Math.min(right, box.left + node.clientLeft + node.clientWidth);
            }
            const panel = el.getBoundingClientRect();
            if (panel.width === 0) return -1;
            // A rounding pixel is not a cut; anything a person can see is.
            return Math.round(Math.max(0, panel.right - right) + Math.max(0, left - panel.left));
        },
        undefined,
        message,
    );

test.describe('a bar panel stays inside the box that shows it', { tag: ['@component:navigation'] }, () => {
    for (const theme of SWEEP) {
        for (const width of WIDTHS) {
            test(`${theme} at ${width}px: the dropdown under the last item is not cut [fix-39]`, { tag: [`@theme:${theme}`] }, async ({ page }) => {
                await page.setViewportSize({ width, height: 800 });
                await page.goto(FIXTURE);
                await wear(page, theme);

                await page.locator('[data-test="clip-last-link"]').hover();
                const menu = page.locator('[data-test="clip-menu"]');
                await expect(menu).toBeVisible();

                await outside(menu, `${theme} at ${width}: the dropdown hangs out of the box that shows it, in pixels`).toBe(0);
            });

            test(`${theme} at ${width}px: the mega menu's panel is not cut [fix-39, scope-48]`, { tag: [`@theme:${theme}`] }, async ({ page }) => {
                await page.setViewportSize({ width, height: 800 });
                await page.goto(FIXTURE);
                await wear(page, theme);

                await page.locator('[data-test="clip-disclosure"]').click();
                const panel = page.locator('[data-test="clip-panel"]');
                await expect(panel).toBeVisible();

                await outside(panel, `${theme} at ${width}: the wide panel hangs out of the box that shows it, in pixels`).toBe(0);
            });
        }
    }
});

test.describe('a closed over-the-page side navigation is out of sight', { tag: ['@component:navigation'] }, () => {
    for (const theme of SWEEP) {
        test(
            `${theme}: closed, the panel is off screen, and opening still brings it in [fix-40]`,
            { tag: ['@sweep', `@theme:${theme}`] },
            async ({ page }) => {
                await page.setViewportSize({ width: 1280, height: 800 });
                await page.goto(FIXTURE);
                await wear(page, theme);

                const window_ = page.locator('[data-test="over-window"]');
                const scoped = page.locator('[data-test="over-scoped"]');

                // Away means translated out, not hidden: the panel is still
                // there, it is simply not on the screen. Read as the paint, so a
                // register that moves it differently is judged on where it ends
                // up and not on which property it used [KT13].
                await measured(
                    window_,
                    (el) => Math.round(el.getBoundingClientRect().right),
                    undefined,
                    `${theme}: the window-fixed panel, closed, reaches this far onto the screen`,
                ).toBeLessThanOrEqual(0);

                const box = await page.locator('[data-test="over-box"]').boundingBox();
                await measured(
                    scoped,
                    (el) => Math.round(el.getBoundingClientRect().right),
                    undefined,
                    `${theme}: the box-scoped panel, closed, reaches this far into its box`,
                ).toBeLessThanOrEqual(Math.round(box?.x ?? 0));

                // And the way in is intact: the same panel, opened, stands
                // wholly on the screen at the edge it came from.
                await page.locator('[data-test="over-window-toggle"]').click();
                await measured(
                    window_,
                    (el) => Math.round(el.getBoundingClientRect().left),
                    undefined,
                    `${theme}: opened, the panel comes to the window's edge`,
                ).toBe(0);
            },
        );
    }
});

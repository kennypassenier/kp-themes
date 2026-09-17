// The dropdown's closing fade, as a register must leave it [scope-100].
//
// The package fades `.kp-nav__menu` both ways: opacity, and `display` with
// `transition-behavior: allow-discrete`, so the panel stays displayed while it
// fades out. A register that writes its own `transition` for the menu
// replaces that list; without `display … allow-discrete` in it the panel is
// `display: none` from the first frame of closing while opening still fades
// (through `@starting-style`). Sepia and shade-dark did exactly that.

import { expect } from '@playwright/test';

/** The first dropdown item of the bar on the page. */
const ITEM = '.kp-nav__links > li:has(> .kp-nav__menu)';

/**
 * The computed transition of the menu names `display` as a discrete
 * transition with a duration — valid in both engines.
 *
 * @param {import('@playwright/test').Page} page
 */
export async function expectMenuDisplayTransition(page) {
    const t = await page
        .locator(`${ITEM} > .kp-nav__menu`)
        .first()
        .evaluate((m) => {
            const s = getComputedStyle(m);
            const props = s.transitionProperty.split(',').map((p) => p.trim());
            const durations = s.transitionDuration.split(',').map((d) => d.trim());
            const behaviors = s.transitionBehavior.split(',').map((b) => b.trim());
            const i = props.indexOf('display');
            return {
                props: s.transitionProperty,
                display: i,
                duration: i < 0 ? '' : durations[i % durations.length],
                behavior: i < 0 ? '' : behaviors[i % behaviors.length],
            };
        });
    expect(t.display, `the menu's transition names display (it names ${t.props})`).toBeGreaterThanOrEqual(0);
    expect(t.behavior, 'display transitions as a discrete property').toBe('allow-discrete');
    expect(parseFloat(t.duration), 'and takes time, so the panel stays while it fades').toBeGreaterThan(0);
}

/**
 * Open the first dropdown by its attribute, close it, and sample the menu's
 * display and opacity every frame for 400ms after closing. Returns the time
 * of the last frame on which the panel was still displayed with some opacity
 * left, and the distinct opacities seen on the way down.
 *
 * @param {import('@playwright/test').Page} page
 */
export async function measureMenuClose(page) {
    const item = page.locator(ITEM).first();
    await item.evaluate((li) => li.closest('nav')?.scrollIntoView({ block: 'center' }));
    await page.mouse.move(2, 2);
    await item.evaluate((li) => li.setAttribute('data-kp-nav-menu-open', ''));
    const menu = item.locator('> .kp-nav__menu');
    await expect.poll(() => menu.evaluate((m) => getComputedStyle(m).opacity)).toBe('1');
    return item.evaluate(
        (li) =>
            new Promise((resolve) => {
                const m = /** @type {HTMLElement} */ (li.querySelector(':scope > .kp-nav__menu'));
                /** @type {{ t: number, display: string, opacity: number }[]} */
                const samples = [];
                li.removeAttribute('data-kp-nav-menu-open');
                const t0 = performance.now();
                const frame = () => {
                    const s = getComputedStyle(m);
                    samples.push({ t: performance.now() - t0, display: s.display, opacity: Number(s.opacity) });
                    if (performance.now() - t0 < 400) requestAnimationFrame(frame);
                    else {
                        const shown = samples.filter((x) => x.display !== 'none' && x.opacity > 0 && x.opacity < 1);
                        resolve({
                            lastShownMs: shown.length ? Math.round(shown[shown.length - 1].t) : 0,
                            opacities: [...new Set(shown.map((x) => x.opacity.toFixed(2)))],
                        });
                    }
                };
                frame();
            }),
    );
}

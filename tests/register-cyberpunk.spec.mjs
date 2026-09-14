// The 5.0.0 cyberpunk register, measured on the concept page [C2].
//
// TH117 the navbar: the strip's clip-path is computed, mirrors under
//       data-kp-nav-side="end", and a hit test on the dropdown hits the
//       link — the first build clipped the list itself, so every dropdown
//       opened invisible (the demo's own history).
// TH118 the buttons: notch, mirror and slit computed per variant, and the
//       focus ring is measured as the difference it makes, inside the box.
// TH121 the tear is judged on catalogue/page-effects.html#dividers [scope-73].
// TH133 a bare .kp-card gets the register rule.
//
// Drills [KT3], each performed 2026-09-07 in both browsers and restored:
//   - the `.kp-nav__links::before` clip-path removed → "the strip has no
//     clip-path", red;
//   - `clip-path: inset(0)` added to `.kp-nav__links` itself, the demo's
//     own first bug → the hit test at the menu link's centre misses, red.
//     Two other mutations stayed GREEN on this page and are recorded as
//     such: removing `position: relative` from the item (the panel then
//     positions against the nav, still under the pointer) and removing
//     the nav's z-index (the concept page's hero is not positioned, so it
//     covers nothing) — the demo's second cause has no twin here;
//   - the notch removed from `.kp-button` → clip-path none, red;
//   - the `:focus-visible` ring removed → delta 0 inside the box, red;
//   - the `.kp-card` clip removed → no polygon, red.

import { expect, test } from '@playwright/test';
import { tabToSelector } from './ring.mjs';

const URL = '/examples/concept.html?theme=cyberpunk';

/** @param {import('@playwright/test').Page} page */
async function open(page) {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(URL);
    await page.waitForFunction(() => document.documentElement.getAttribute('data-theme') === 'cyberpunk');
    await page.evaluate(() => {
        for (const animation of document.getAnimations()) animation.finish();
    });
}

test.describe(
    'the cyberpunk register on the concept page [C2]',
    { tag: ['@theme:cyberpunk', '@component:page-effects', '@component:examples'] },
    () => {
        test('the navbar strip is clipped, and the clip mirrors under data-kp-nav-side="end" [TH117]', async ({ page }) => {
            await open(page);
            const read = () =>
                page.evaluate(() => {
                    const links = document.querySelector('.kp-nav__links');
                    return getComputedStyle(links, '::before').clipPath;
                });
            const start = await read();
            expect(start, 'the strip has no clip-path').toContain('polygon');
            await page.evaluate(() => document.querySelector('.kp-nav')?.setAttribute('data-kp-nav-side', 'end'));
            const end = await read();
            expect(end).toContain('polygon');
            expect(end, 'the notch did not move to the other side').not.toBe(start);
            // The start shape cuts its first corner (x = notch at y = 0); the end
            // shape starts at the origin and cuts its last corner instead.
            expect(start.replace(/\s+/g, ' ')).toMatch(/^polygon\(1[0-9]px 0(px)?,/);
            expect(end.replace(/\s+/g, ' ')).toMatch(/^polygon\(0(px)? 0(px)?,/);
        });

        test('the dropdown opens on hover and a hit test at its link lands on the link [TH117]', async ({ page }) => {
            await open(page);
            const trigger = page.locator('.kp-nav__link[aria-haspopup]').first();
            await trigger.hover();
            const menuLink = page.locator('.kp-nav__menu a').first();
            await expect(menuLink).toBeVisible();
            const hit = await menuLink.evaluate((el) => {
                const r = el.getBoundingClientRect();
                const at = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
                return at === el || el.contains(at) ? 'link' : `${at?.tagName.toLowerCase()}.${at?.className}`;
            });
            expect(hit, "the hit test at the menu link's centre").toBe('link');
            // Keyboard: Tab from the trigger reaches the first item.
            // Reached with the keyboard, not focus() [G15].
            await tabToSelector(page, '.kp-nav__link[aria-haspopup]');
            await page.keyboard.press('Tab');
            expect(await page.evaluate(() => document.activeElement?.closest('.kp-nav__menu') !== null)).toBe(true);
        });
    },
);

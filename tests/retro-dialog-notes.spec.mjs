// Kenny's two dialog notes of 2026-09-15, read where he read them: the review
// dialog on catalogue/overlays.html in FireDragon, zoomed to a device pixel
// ratio of 2.222. A Playwright viewport of 1920×1000 / 2.222 (864×450 CSS px)
// lays the page out as his window did; 1400×900 is the other review size.
//
//   overlays--dialog-parts · retro: "er is wat overlap met de titeltekst, de
//   'X'-knop en de scrollbar"
//   overlays--dialog-long · retro: "de popup werkte niet ... de eerste entry
//   helemaal boven mijn scherm was '02:19 1.60 bar Low' en ik kon niet
//   scrollen" [fix-36]
//
// Drilled per KT3 on 2026-09-15, against 4ccbca61 (the fix set aside):
//   - parts: the title's words ran 16px under the close button (right 749.3
//     against its left 733.3 at 864px) and the close button lay 8×8px over
//     the drawn bar's up arrow; red.
//   - long: in the review dialog the sixty-row dialog opened 2574px tall,
//     top at -837px (1400×900) and -1062px (864×450), body scrollTop stuck at
//     0 under the wheel and End; red in retro and formal.

import { test, expect } from '@playwright/test';
import { waitForJudging } from './helpers/catalogue.mjs';
import { useEmptyRegister } from './helpers/empty-register.mjs';

const SIZES = [
    { name: 'Kenny’s zoom (1920×1000 at 2.222)', width: 864, height: 450 },
    { name: '1400×900', width: 1400, height: 900 },
];

/** @param {import('@playwright/test').Page} page @param {string} theme @param {{ width: number, height: number }} size */
const openOverlays = async (page, theme, size) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width: size.width, height: size.height });
    await useEmptyRegister(page.context());
    await page.goto('/catalogue/overlays.html');
    await waitForJudging(page);
    await page.evaluate((name) => document.documentElement.setAttribute('data-theme', name), theme);
    await expect.poll(() => page.evaluate(() => document.documentElement.getAttribute('data-theme'))).toBe(theme);
};

/**
 * The title's words, the close button and the drawn bar of a dialog, as boxes.
 * The bar is where `watchScrollbar` (js/overlays.js) takes a press for it:
 * the end strip of the padding box, `--kp-scrollbar-size` wide.
 *
 * @param {import('@playwright/test').Locator} dialog
 */
const parts = (dialog) =>
    dialog.evaluate((el) => {
        const d = /** @type {HTMLElement} */ (el);
        /** @param {DOMRect} r */
        const box = (r) => ({ left: r.left, top: r.top, right: r.right, bottom: r.bottom });
        const title = /** @type {HTMLElement} */ (d.querySelector(':scope > .kp-dialog__title'));
        const words = document.createRange();
        words.selectNodeContents(title);
        const close = /** @type {HTMLElement} */ (d.querySelector(':scope > .kp-dialog__close'));
        const style = getComputedStyle(d);
        const size = parseFloat(style.getPropertyValue('--kp-scrollbar-size'));
        const inset = parseFloat(style.getPropertyValue('--kp-scrollbar-inset')) || 0;
        const r = d.getBoundingClientRect();
        const end = r.left + d.clientLeft + d.clientWidth - inset;
        const bar =
            size > 0
                ? { left: end - size, top: r.top + d.clientTop + inset, right: end, bottom: r.top + d.clientTop + d.clientHeight - inset }
                : null;
        return {
            words: box(words.getBoundingClientRect()),
            title: box(title.getBoundingClientRect()),
            close: box(close.getBoundingClientRect()),
            bar,
        };
    });

/** The overlap of two boxes in px², 0 when they only touch. */
const overlap = (a, b) =>
    Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left)) * Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));

test.describe('retro: a dialog’s title, close button and scrollbar never overlap', { tag: ['@theme:retro', '@component:overlays'] }, () => {
    for (const size of SIZES) {
        test(`dialog-parts at ${size.name}`, async ({ page }) => {
            await openOverlays(page, 'retro', size);
            const dialog = page.locator('#dialog-parts .cat-stage dialog.kp-dialog');
            await dialog.scrollIntoViewIfNeeded();
            const p = await parts(dialog);
            expect(p.bar, 'retro draws a bar on a dialog without a body').not.toBeNull();
            const bar = /** @type {NonNullable<typeof p.bar>} */ (p.bar);
            expect({
                wordsUnderClose: overlap(p.words, p.close),
                closeOnBar: overlap(p.close, bar),
                wordsOnBar: overlap(p.words, bar),
                titleOnBar: overlap(p.title, bar),
            }).toEqual({ wordsUnderClose: 0, closeOnBar: 0, wordsOnBar: 0, titleOnBar: 0 });
            // The package's promise (scope-60): the words stop at least half a rem short of the button.
            expect(p.close.left - p.words.right).toBeGreaterThanOrEqual(8);
        });
    }
});

test.describe(
    'a long dialog opened from the review dialog opens at its top, inside the window, and scrolls',
    { tag: ['@theme:retro', '@component:overlays', '@component:catalogue'] },
    () => {
        for (const theme of ['retro', 'formal']) {
            for (const size of SIZES) {
                test(`dialog-long in ${theme} at ${size.name}`, async ({ page }) => {
                    await openOverlays(page, theme, size);
                    await page.locator('#dialog-long [data-cat-dialog-block]').click();
                    await expect(page.locator('#cat-review-dialog')).toBeVisible();
                    await page.locator('#cat-review-dialog [data-kp-dialog="ov-long-live"]').click();
                    const dialog = page.locator('#ov-long-live');
                    await expect(dialog).toBeVisible();
                    const body = dialog.locator('.kp-dialog__body');

                    const frame = await dialog.evaluate((el) => {
                        const r = el.getBoundingClientRect();
                        return { top: r.top, bottom: r.bottom, left: r.left, right: r.right, width: innerWidth, height: innerHeight };
                    });
                    expect(frame.top, 'the dialog’s top edge is on screen').toBeGreaterThanOrEqual(0);
                    expect(frame.bottom, 'the dialog’s bottom edge is on screen').toBeLessThanOrEqual(frame.height);
                    expect(frame.left).toBeGreaterThanOrEqual(0);
                    expect(frame.right).toBeLessThanOrEqual(frame.width);

                    /** The first and last reading whose row is wholly inside the body's box. */
                    const inView = () =>
                        body.evaluate((el) => {
                            const b = el.getBoundingClientRect();
                            const rows = [...el.querySelectorAll('tbody tr')].filter((tr) => {
                                const r = tr.getBoundingClientRect();
                                return r.top >= b.top - 1 && r.bottom <= b.bottom + 1 && r.top >= 0 && r.bottom <= innerHeight;
                            });
                            const text = (/** @type {Element | undefined} */ tr) => tr?.querySelector('td')?.textContent?.trim();
                            return {
                                first: text(rows[0]),
                                last: text(rows.at(-1)),
                                scrollTop: el.scrollTop,
                                range: el.scrollHeight - el.clientHeight,
                            };
                        });

                    const start = await inView();
                    expect(start.first, 'opens at its first reading').toBe('02:00');
                    expect(start.range, 'the body is a scroll box').toBeGreaterThan(0);

                    // The wheel, over the rows, until the body stops moving.
                    const box = /** @type {{ x: number, y: number, width: number, height: number }} */ (await body.boundingBox());
                    await page.mouse.move(box.x + box.width / 2, box.y + Math.min(box.height / 2, 60));
                    for (let i = 0; i < 40 && (await inView()).last !== '02:59'; i++) {
                        await page.mouse.wheel(0, 600);
                        await page.waitForTimeout(50);
                    }
                    await expect.poll(async () => (await inView()).last, { message: 'the wheel reaches the last reading' }).toBe('02:59');

                    // The keyboard: Home back to the top, End to the last reading.
                    await body.focus();
                    await page.keyboard.press('Home');
                    await expect.poll(async () => (await inView()).first).toBe('02:00');
                    await page.keyboard.press('End');
                    await expect.poll(async () => (await inView()).last, { message: 'End reaches the last reading' }).toBe('02:59');
                });
            }
        }
    },
);

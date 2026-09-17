// Motion runs again after the still frame is lifted [fix-31, scope-103].
//
// To read a block's hash the review page holds every animation still:
// `stillAnimations()` in catalogue/block-hash.js finishes the finite ones,
// sets the infinite ones to time 0, reads, and gives them back the time
// they had. fix-31 was the release half of that, and Kenny found it with
// his eyes — "I don't see these running from side to side?" — on
// catalogue/media.html#marquee. The old release called `pause()` and
// `play()`, and a script's pause outranks `animation-play-state` for good:
// a band that was already resting off screen was paused by the script,
// released as "was not running", and never ran again.
//
// tests/catalogue-review.spec.mjs follows one band on the review page after
// judging, which is where Kenny met it. This measures the property itself,
// on a page with no catalogue on it: hold the package's own infinite
// animations, release them, and see whether they move — including the one
// case the correction turned on, an animation that was ALREADY still when
// it was held.
//
// Drilled 2026-09-16 in firefox against broken holds declared in the page,
// rather than by editing catalogue/block-hash.js. Two of them, because the
// three tests here fail to two different faults:
//
//   - the release fix-31 replaced (`pause()` on hold, `play()` on release
//     for what had been running): the already-still test red, the band
//     advancing 0 ms over 600 ms once the CSS pause was lifted, which is
//     fix-31 exactly. The other two stayed green — the correction was
//     about the already-still case and nothing else;
//   - a hold that pauses and a release that gives nothing back: the other
//     two red, band 0 ms and progress 0 ms over 600 ms.
//
// Against the shipped `stillAnimations()` all three are green.

import { expect, test } from '@playwright/test';

const PAGE = '/tests/fixtures/still-frame.html';
const TRACK = '[data-test="band"] [data-kp-marquee-track]';

/** How long the band is followed. One marquee pass is 42 s, so any motion at all shows here. */
const FOLLOW = 600;

/**
 * The advance of an element's own animation over FOLLOW ms, in ms.
 *
 * @param {import('@playwright/test').Page} page @param {string} selector
 */
const advance = (page, selector) =>
    page.evaluate(
        async ({ selector: s, follow }) => {
            const of = () => {
                const animation = document.querySelector(s)?.getAnimations()[0];
                return animation ? Number(animation.currentTime ?? 0) : null;
            };
            const before = of();
            await new Promise((resolve) => setTimeout(resolve, follow));
            const after = of();
            return before === null || after === null ? null : Math.round(after - before);
        },
        { selector, follow: FOLLOW },
    );

/**
 * Let the page render two frames. `animation-play-state` takes effect at the
 * next style recalculation, so a measurement taken in the same tick as the
 * attribute still reads one frame of the old state (17 ms, measured).
 *
 * @param {import('@playwright/test').Page} page
 */
const settle = (page) => page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));

/** The band is attached, laid out and moving before anything is held. */
const ready = async (/** @type {import('@playwright/test').Page} */ page) => {
    await page.goto(PAGE);
    await expect(page.locator('[data-test="band"][data-kp-marquee-ready]')).toHaveCount(1);
    await expect.poll(() => advance(page, TRACK), { timeout: 10_000 }).toBeGreaterThan(0);
};

test.describe('the still frame lets motion go again', { tag: ['@component:media', '@component:catalogue'] }, () => {
    test('an infinite animation runs again after a hold and release [fix-31]', async ({ page }) => {
        await ready(page);
        const held = await page.evaluate(async (selector) => {
            const { stillAnimations } = await import('/catalogue/block-hash.js');
            const release = stillAnimations();
            // Everything between the hold and the release is read
            // synchronously, as the review page reads it.
            const at = Number(document.querySelector(selector)?.getAnimations()[0]?.currentTime ?? -1);
            release();
            return at;
        }, TRACK);
        expect(held, 'the hold puts an infinite animation at time 0').toBe(0);
        expect(await advance(page, TRACK), 'the band stands still after the release').toBeGreaterThan(0);
    });

    test('an animation the CSS had already stopped runs when the CSS lets it [fix-31]', async ({ page }) => {
        await ready(page);
        // This is fix-31's own shape. `data-kp-paused` is what js/effects.js
        // writes on a band that has left the viewport, and the CSS pauses it;
        // the review page then reads the block with the band already still.
        await page.locator('[data-test="band"]').evaluate((el) => el.setAttribute('data-kp-paused', ''));
        await settle(page);
        expect(await advance(page, TRACK), 'the CSS must hold the band still').toBe(0);

        await page.evaluate(async () => {
            const { stillAnimations } = await import('/catalogue/block-hash.js');
            stillAnimations()();
        });

        // The band comes back into view: the CSS says run, and nothing a
        // script did while reading may outrank that.
        await page.locator('[data-test="band"]').evaluate((el) => el.removeAttribute('data-kp-paused'));
        await settle(page);
        await expect.poll(() => advance(page, TRACK), { timeout: 10_000 }).toBeGreaterThan(0);
    });

    test('a second kind of infinite animation survives the same hold [fix-31]', async ({ page }) => {
        // Not the marquee alone: the claim is about every infinite animation
        // the hash holds. The indeterminate progress bar is the other one on
        // the package's own pages.
        await page.goto(PAGE);
        const progress = '[data-test="progress"]';
        await expect.poll(() => advance(page, progress), { timeout: 10_000 }).toBeGreaterThan(0);
        await page.evaluate(async () => {
            const { stillAnimations } = await import('/catalogue/block-hash.js');
            stillAnimations()();
        });
        expect(await advance(page, progress), 'the stripes stand still after the release').toBeGreaterThan(0);
    });
});

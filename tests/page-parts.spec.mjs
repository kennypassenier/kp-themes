// Back to top, and a picture that holds its space [feat-page-1, feat-media-1].
//
// The last two pieces of the element list Kenny rated essential. Both were
// missing outright: the package had no back-to-top control of any kind,
// and of the component roots it declares not one was for a picture, so
// every page that wanted one at the top invented its own.
//
// Every assertion reads what the browser painted rather than the attribute
// the code just wrote [KT13].
//
// Drill [KT3], one pass over all three: the `[data-kp-to-top-shown]` rule
// removed, the focus call removed, and `aspect-ratio` removed, together —
// `2 passed, 3 failed`, and the three are the three tests those changes
// belong to. Restored, five green in 3.3 seconds.

import { expect, test } from '@playwright/test';
import { measured } from './paint.mjs';

const FIXTURE = '/tests/fixtures/page-parts.html';

/** @param {import('@playwright/test').Page} page @param {string} name */
const part = (page, name) => page.locator(`[data-test="${name}"]`);

test.describe('the last two pieces of the page', () => {
    test('back to top: not there at the top, there once you are down [feat-page-1]', async ({ page }) => {
        // Drill: the `[data-kp-to-top-shown]` rule removed from
        // css/components.css and this goes red — the control never becomes
        // visible, whatever the module writes.
        await page.goto(FIXTURE);
        const button = part(page, 'to-top');

        await measured(button, (el) => getComputedStyle(el).visibility, undefined, 'at the top there is nothing to go back to').toBe('hidden');

        await page.evaluate(() => window.scrollTo(0, 600));
        await measured(button, (el) => getComputedStyle(el).visibility, undefined, 'once the reader is down, it is there').toBe('visible');

        await page.evaluate(() => window.scrollTo(0, 0));
        await measured(button, (el) => getComputedStyle(el).visibility, undefined, 'and it goes away again by itself').toBe('hidden');
    });

    test('back to top: it takes the focus back, not only the view [feat-page-1]', async ({ page }) => {
        // The half that is usually missing. A control that only scrolls
        // leaves a keyboard reader at the bottom of the document with the
        // view at the top, which is worse than not moving at all.
        //
        // Drill: the `skipTo` call removed from attachToTop in
        // js/components.js and this goes red while the visibility test
        // stays green.
        await page.goto(FIXTURE);
        await page.evaluate(() => window.scrollTo(0, 600));
        await measured(part(page, 'to-top'), (el) => getComputedStyle(el).visibility, undefined, 'visible before the press').toBe('visible');

        await part(page, 'to-top').click();

        await expect.poll(() => page.evaluate(() => window.scrollY), { message: 'the view went back to the top' }).toBeLessThan(10);
        // The top of the document, not the main landmark. This test caught
        // the difference: on this page main starts 2737px down, and focusing
        // it scrolled straight back to 3476 — the control undid its own
        // journey. The focus moves without scrolling now.
        await expect
            .poll(() => page.evaluate(() => document.activeElement?.tagName), { message: 'and so did the focus, without moving the view back' })
            .toBe('BODY');
    });

    test('a picture holds its space before it has a picture in it [feat-media-1]', async ({ page }) => {
        // The frame with nothing in it at all is the state every page is in
        // for the first moments of its life, and the one that makes text
        // below jump when the bytes land.
        //
        // Drill: `aspect-ratio` removed from `.kp-media` and this goes red —
        // an empty frame collapses to nothing.
        await page.goto(FIXTURE);

        const empty = await part(page, 'media-empty').evaluate((el) => el.getBoundingClientRect());
        expect(empty.height, 'an empty frame still has a height').toBeGreaterThan(0);
        expect(empty.width / empty.height, 'and it is the ratio the token declares').toBeCloseTo(16 / 9, 1);

        const square = await part(page, 'media-square').evaluate((el) => el.getBoundingClientRect());
        expect(square.width / square.height, 'and a square one is square').toBeCloseTo(1, 1);
    });

    test('the picture fills its frame rather than stretching to it [feat-media-1]', async ({ page }) => {
        // A one-pixel image in a 16/9 frame is the worst case: without
        // object-fit it is drawn as a 16/9 smear of one colour, and nobody
        // notices until the photograph is a face.
        await page.goto(FIXTURE);

        await measured(part(page, 'media-img'), (el) => getComputedStyle(el).objectFit, undefined, 'the image covers its frame').toBe('cover');
        const [frame, image] = await page.evaluate(() => {
            const rect = (sel) => document.querySelector(sel).getBoundingClientRect();
            return [rect('[data-test="media"]'), rect('[data-test="media-img"]')];
        });
        expect(Math.round(image.width), 'and fills it exactly').toBe(Math.round(frame.width));
        expect(Math.round(image.height), 'in both directions').toBe(Math.round(frame.height));
    });

    test('a caption over a picture has a ground under it [feat-media-1, DI1]', async ({ page }) => {
        // The picture belongs to the consumer and can be any brightness.
        // Text laid straight on it is legible until somebody uploads a
        // bright one.
        await page.goto(FIXTURE);
        const overlay = part(page, 'media-overlay');

        await measured(overlay, (el) => getComputedStyle(el).backgroundImage, undefined, 'the caption sits on something').not.toBe('none');
        await measured(overlay, (el) => getComputedStyle(el).position, undefined, 'and it sits on the picture, not under it').toBe('absolute');
    });
});

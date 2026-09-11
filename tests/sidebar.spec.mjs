// A side navigation that can be put away [feat-nav-2, scope-10, stage 1.4].
//
// Measured before it existed: `.kp-sidebar` had been a two-column layout
// since round four — three knobs, a wrap threshold, and no way to hide,
// open or remember. On a narrow screen the aside simply stacked on top of
// the content, so every page using it opened on its navigation instead of
// on what the reader came for.
//
// One channel, deliberately. The nav toggle needed two because `NavBar` is
// a React component and both halves wire the same button [rule 7g]; the
// layout classes are CSS a consumer puts on their own markup in whatever
// framework they use, so there is one implementation and one suite.
//
// Every assertion reads what the browser painted rather than the attribute
// the code just wrote [KT13] — which is also how the module itself decides
// where it starts, because the state attribute has three values and only
// the paint knows what the width settled on.
//
// Drill [KT3]: the `@container kp-sidebar (max-width: 40rem)` block removed
// from css/layout.css — `1250 passed, 4 failed` in firefox, and the four
// are exactly the four narrow tests below: lines 60, 68, 87 and 102. The
// three wide tests, the remembering one and the opt-in one stay green,
// because the width they stand on is the other side of the same step.

import { expect, test } from '@playwright/test';
import { measured } from './paint.mjs';

const FIXTURE = '/tests/fixtures/sidebar.html';

/** @param {import('@playwright/test').Page} page @param {string} box */
const parts = (page, box) => ({
    toggle: page.locator(`[data-test="${box}-toggle"]`),
    aside: page.locator(`[data-test="${box}-aside"]`),
    main: page.locator(`[data-test="${box}-main"]`),
});

/** @param {import('@playwright/test').Locator} locator @param {string} message */
const width = (locator, message) => measured(locator, (el) => el.getBoundingClientRect().width, undefined, message);

test.describe('the sidebar that can be put away', () => {
    test('wide: the aside is on the screen before anything is pressed [stage 1.4]', async ({ page }) => {
        await page.goto(FIXTURE);
        const { toggle, aside } = parts(page, 'wide');

        await width(aside, 'wide: the aside starts painted').toBeGreaterThan(0);
        await expect(toggle, 'wide: the button says so without having been pressed').toHaveAttribute('aria-expanded', 'true');
    });

    test('wide: the toggle takes it away and brings it back [stage 1.4, KT6]', async ({ page }) => {
        await page.goto(FIXTURE);
        const { toggle, aside } = parts(page, 'wide');

        await toggle.click();
        await width(aside, 'wide: gone once pressed').toBe(0);
        await expect(toggle, 'wide: the button says it is closed').toHaveAttribute('aria-expanded', 'false');

        await toggle.click();
        await width(aside, 'wide: back again — every state this sets has a way out').toBeGreaterThan(0);
    });

    test('narrow: the aside is away until it is asked for [stage 1.4]', async ({ page }) => {
        await page.goto(FIXTURE);
        const { toggle, aside } = parts(page, 'narrow');

        await width(aside, 'narrow: the page opens on its content, not on its menu').toBe(0);
        await expect(toggle, 'narrow: the button says it is closed').toHaveAttribute('aria-expanded', 'false');
    });

    test('narrow: opening it covers the text rather than moving it [stage 1.4]', async ({ page }) => {
        await page.goto(FIXTURE);
        const { toggle, aside, main } = parts(page, 'narrow');

        const before = await main.evaluate((el) => el.getBoundingClientRect().y);
        await toggle.click();
        await width(aside, 'narrow: painted once open').toBeGreaterThan(0);

        // The overlay, measured as an overlay: the two boxes share the same
        // rows of the page. Kenny chose this default on the element list.
        const boxes = await page.evaluate(() => {
            const rect = (sel) => document.querySelector(sel).getBoundingClientRect();
            return { aside: rect('[data-test="narrow-aside"]'), main: rect('[data-test="narrow-main"]') };
        });
        expect(boxes.aside.top, 'narrow: the aside starts above the bottom of the text').toBeLessThan(boxes.main.bottom);
        expect(boxes.aside.bottom, 'narrow: and ends below its top — the two occupy the same band').toBeGreaterThan(boxes.main.top);
        expect(await main.evaluate((el) => el.getBoundingClientRect().y), 'narrow: the text did not move').toBeCloseTo(before, 0);
    });

    test('narrow: Escape and a click outside both close it [stage 1.4, KT6]', async ({ page }) => {
        await page.goto(FIXTURE);
        const { toggle, aside } = parts(page, 'narrow');

        await toggle.click();
        await width(aside, 'narrow: open before the key').toBeGreaterThan(0);
        await toggle.press('Escape');
        await width(aside, 'narrow: closed by Escape').toBe(0);

        await toggle.click();
        await width(aside, 'narrow: open before the click elsewhere').toBeGreaterThan(0);
        await page.locator('[data-test="wide-main"]').click();
        await width(aside, 'narrow: closed by a click outside it').toBe(0);
    });

    test('narrow: the drawer starts below its own button, not behind it [stage 1.4]', async ({ page }) => {
        // Kenny, looking at the demonstration page: the first link sat
        // partly behind the Menu button. The drawer covers the content —
        // that is what he chose — but covering the one control that closes
        // it is not part of the bargain.
        //
        // Drill: `inset-block-start` put back to 0, `1258 passed, 2 failed`
        // — this one, and the covering test beside it, because a drawer
        // starting at the very top with its own height no longer reaches
        // the text it is supposed to be covering.
        await page.goto(FIXTURE);
        const { toggle, aside } = parts(page, 'narrow');

        await toggle.click();
        await width(aside, 'open before the measurement').toBeGreaterThan(0);

        const boxes = await page.evaluate(() => {
            const rect = (sel) => document.querySelector(sel).getBoundingClientRect();
            return { toggle: rect('[data-test="narrow-toggle"]'), aside: rect('[data-test="narrow-aside"]') };
        });
        expect(boxes.aside.top, 'the drawer begins under the button that opened it').toBeGreaterThanOrEqual(boxes.toggle.bottom);
    });

    test('narrow: the push knob moves the text instead of covering it [stage 1.4, KT6]', async ({ page }) => {
        await page.goto(FIXTURE);
        const { toggle, aside, main } = parts(page, 'push');

        const before = await main.evaluate((el) => el.getBoundingClientRect().y);
        await toggle.click();
        await width(aside, 'push: painted once open').toBeGreaterThan(0);

        const boxes = await page.evaluate(() => {
            const rect = (sel) => document.querySelector(sel).getBoundingClientRect();
            return { aside: rect('[data-test="push-aside"]'), main: rect('[data-test="push-main"]') };
        });
        expect(boxes.aside.bottom, 'push: the aside ends where the text begins, and does not reach over it').toBeLessThanOrEqual(boxes.main.top + 1);
        expect(await main.evaluate((el) => el.getBoundingClientRect().y), 'push: the text moved down to make room').toBeGreaterThan(before);
    });

    test('the state survives a reload when the page asks it to [stage 1.4]', async ({ page }) => {
        await page.goto(FIXTURE);
        const { toggle, aside } = parts(page, 'memo');

        await width(aside, 'remembered: open on the first visit').toBeGreaterThan(0);
        await toggle.click();
        await width(aside, 'remembered: closed by the press').toBe(0);

        await page.reload();
        await width(aside, 'remembered: still closed on the way back in').toBe(0);
        await expect(toggle, 'remembered: and the button says so').toHaveAttribute('aria-expanded', 'false');

        // And out again, because a remembered state that cannot be
        // changed back is not a way out [KT6]. The frozen bar asks this
        // of all three states and this was the one it was missing.
        await toggle.click();
        await width(aside, 'remembered: open again by the same button').toBeGreaterThan(0);
        await page.reload();
        await width(aside, 'remembered: and that is what comes back').toBeGreaterThan(0);

        // Left as it was found: the key is this suite's own, and a test
        // that leaves state behind is a test the next one has to work
        // around.
        await page.evaluate(() => localStorage.removeItem('kp-test-sidebar'));
    });

    test('what the button announces follows the width, not the moment it was wired [feat-nav-2, KT13]', async ({ page }) => {
        // Live-found on the demonstration page, standing rule 8. The module
        // reads the paint once at attach and never again, so a window that
        // crosses the 40rem step leaves the button saying the opposite of
        // what is on the screen — and it fails silently, for exactly the
        // people who cannot see that it failed.
        await page.setViewportSize({ width: 1100, height: 800 });
        await page.goto(FIXTURE);
        const { toggle, aside } = parts(page, 'fluid');

        await width(aside, 'wide: the aside is painted').toBeGreaterThan(0);
        await expect(toggle, 'wide: and the button says so').toHaveAttribute('aria-expanded', 'true');

        await page.setViewportSize({ width: 420, height: 800 });
        await width(aside, 'narrow: the same aside is gone').toBe(0);
        await expect(toggle, 'narrow: and the button has to have noticed').toHaveAttribute('aria-expanded', 'false');

        await page.setViewportSize({ width: 1100, height: 800 });
        await width(aside, 'wide again: back on the screen').toBeGreaterThan(0);
        await expect(toggle, 'wide again: and said so again').toHaveAttribute('aria-expanded', 'true');
    });

    test('a sidebar nobody asked to hide keeps the layout it had [stage 1.4]', async ({ page }) => {
        // The opt-in, measured from the other side: the documentation site
        // and three example pages use .kp-sidebar as a plain two-column
        // layout, and this feature must not reach them.
        await page.goto('/examples/app-shell.html');
        const aside = page.locator('.kp-sidebar__aside').first();

        await width(aside, 'a plain sidebar is painted, with no attribute anywhere near it').toBeGreaterThan(0);
        await expect(page.locator('.kp-sidebar[data-kp-sidebar]'), 'and nothing on that page opted in').toHaveCount(0);
    });
});

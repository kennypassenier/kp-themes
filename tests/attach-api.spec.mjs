// What attach returns, and what it announces [feat-nav-1, feat-nav-2].
//
// The gap this closes was found by the stage 1.4 milestone gate and named
// by Kenny: two things these modules do reach no test at all. The event
// is the only way a consumer learns that the reader closed the thing —
// it is what you would build "remember this yourself" on. The detach is
// the way out every state in this package is supposed to have, and the
// one nothing had ever pulled.
//
// Measured before writing them: `grep -rn "NAV_TOGGLE_EVENT\|attachNavToggles" tests/`
// returned four hits and every one of them was inside a generated bundle
// under tests/fixtures/.build — not a single test. The nav toggle from
// stage 1.3 had exactly the same hole, so both are closed here together.
//
// The page attaches by hand instead of loading js/auto.js, because
// auto.js throws the handle away. That is correct for a consumer who
// wants one script tag, and it is precisely why a detach could sit
// unexercised through two milestones.
//
// Drill [KT3], run in two passes over the four:
//   · both `dispatchEvent` lines removed → `1257 passed, 2 failed`, and the
//     two are the two event tests
//   · every returned cleanup loop emptied → `1257 passed, 2 failed`, and the
//     two are the two detach tests
//
// That second pass emptied FOUR cleanup loops, because `attachConfirmations`
// and `attachSkipLinks` have one too, and only two tests noticed. Their
// detaches are as unexercised as these were before today; recorded as a
// queue item rather than quietly widened into this one.

import { expect, test } from '@playwright/test';
import { measured } from './paint.mjs';

const FIXTURE = '/tests/fixtures/attach-api.html';

/** @param {import('@playwright/test').Page} page */
const heard = (page) => page.evaluate(() => window.kpHeard);

test.describe('what attach returns, and what it announces', () => {
    test('the nav toggle says out loud that it opened, and that it closed [feat-nav-1]', async ({ page }) => {
        await page.goto(FIXTURE);
        const toggle = page.locator('[data-test="nav-toggle"]');

        await toggle.click();
        await toggle.click();

        // Two presses, two events, in that order and with the state in
        // them. A consumer who persists the choice reads exactly this.
        await expect
            .poll(async () => (await heard(page)).filter((e) => e.name === 'kp-nav-toggle').map((e) => e.open), {
                message: 'the nav announced open and then closed',
            })
            .toEqual([true, false]);
        expect((await heard(page)).find((e) => e.name === 'kp-nav-toggle')?.on, 'and it announced it on the nav itself').toBe('nav');
    });

    test('detaching the nav toggle gives the page back [feat-nav-1, KT6]', async ({ page }) => {
        await page.goto(FIXTURE);
        const toggle = page.locator('[data-test="nav-toggle"]');
        const links = page.locator('[data-test="nav-links"]');

        await toggle.click();
        await measured(links, (el) => el.getBoundingClientRect().height, undefined, 'open before the detach').toBeGreaterThan(0);

        await page.evaluate(() => window.kpDetach());

        // The paint, not the attribute: what a detach owes is a page that
        // looks the way it did before anything attached.
        await measured(links, (el) => el.getBoundingClientRect().height, undefined, 'the open state went with it').toBe(0);
        await expect(toggle, 'and the button stopped claiming anything').not.toHaveAttribute('aria-expanded', /.*/);

        const before = (await heard(page)).length;
        await toggle.click();
        await measured(links, (el) => el.getBoundingClientRect().height, undefined, 'a press after the detach does nothing').toBe(0);
        expect((await heard(page)).length, 'and says nothing either').toBe(before);
    });
});

// Staying put, and where an anchor lands [scope-10, stage 1.1 and 1.2].
//
// Measured on 2026-09-11 across css/, js/ and components/: the package
// contained zero occurrences of `sticky`, and zero of `scroll-behavior`,
// `scroll-padding` or `scroll-margin`. Nothing stayed put while a page
// scrolled, and no in-page link knew to clear whatever was stuck over it.
//
// The second half is the one that matters. Every page this package builds
// carries a skip link, and the person who uses it is the person who cannot
// see that its target went under the bar — so the test asserts the painted
// position of the target after following the link, not the declared value
// of a property.
//
// Both defaults change nothing for a page that does not ask, which is why
// the fixture asks: it sets the attribute and the offset the way a
// consumer would. A test against the defaults would only prove that
// nothing happened.
//
// The sticky test compares the bar against itself at two scroll positions
// rather than against a number. A number was tried first and was wrong for
// a reason that has nothing to do with the feature: the document's own
// margin decides where the top is, so the test would have been measuring
// that margin.
//
// There were three tests here. The third asserted that a stuck bar keeps
// its height, and the drill below is what removed it: with `position:
// sticky` gone it stayed green, because a bar that does not stick keeps
// its height too. It was measuring its own scaffolding (rule 7e), so it is
// gone rather than reworded.
//
// Drill [KT3], both halves run in firefox on 2026-09-11:
//   `scroll-padding-block-start` removed from the `html` rule in
//   css/layout.css — "the skip link clears the bar" red, the sticky test
//   green. 1238 passed, 1 failed.
//   `position: sticky` removed from `[data-kp-sticky]` — the sticky test
//   red, the skip-link test green, because with nothing stuck there is
//   nothing to clear. 1238 passed, 1 failed.

import { expect, test } from '@playwright/test';
import { measured } from './paint.mjs';

const FIXTURE = '/tests/fixtures/sticky.html';

/** The bar's own height in the fixture, which is also its scroll offset. */
const BAR = 64;

test.describe('staying put', () => {
    test('a bar with the attribute stays where it was while the page scrolls [stage 1.2]', async ({ page }) => {
        await page.goto(FIXTURE);
        const bar = page.locator('[data-case="bar"]');

        // Two scroll positions, both past the point where it sticks. The
        // claim is that a stuck bar does not move again — not that it never
        // moves at all, because it does move once: from wherever the
        // document's margin put it up to where it sticks.
        const start = await bar.evaluate((el) => el.getBoundingClientRect().y);

        await page.evaluate(() => scrollTo(0, 400));
        const stuck = await bar.evaluate((el) => el.getBoundingClientRect().y);
        expect(stuck, 'the bar rose to where it sticks').toBeLessThanOrEqual(start);

        await page.evaluate(() => scrollTo(0, 1400));
        await measured(
            bar,
            (el) => el.getBoundingClientRect().y,
            undefined,
            'the bar is painted in the same place a thousand pixels further down',
        ).toBeCloseTo(stuck, 0);
    });

    test('the skip link clears the bar instead of landing under it [stage 1.1]', async ({ page }) => {
        await page.goto(FIXTURE);

        // Follow the link the way its own user does, rather than scrolling
        // to the element: the fault this test exists about is in where the
        // browser stops, not in where the element is.
        await page.evaluate(() => {
            location.hash = '#target';
        });

        await measured(
            page.locator('[data-case="target"]'),
            (el) => el.getBoundingClientRect().y,
            undefined,
            'the skip target is painted below the bar, not behind it',
        ).toBeGreaterThanOrEqual(BAR - 1);
    });
});

// Smooth scrolling, and the guard it is read inside [scope-10, stage 1.1].
//
// Found missing by the stage-1 milestone report, which is the whole reason
// that gate exists: the feature was rated essential, was built, shipped in
// the layout layer, and `grep -rn "scroll-behavior" tests/` returned one
// hit — a comment. Kenny signed the gap off and asked for it closed before
// stage 1.4.
//
// This is one of the few places where the computed value IS the
// observable. What the property changes is how a LATER scroll animates,
// and a test that raced that animation would be exactly the flake standing
// rule 8a refuses. So the first test reads the value and the second — the
// one that matters — proves the cascade did the right thing under a media
// condition: a page that asked for `smooth` does not get it when the
// reader asked for less motion.
//
// Drill [KT3]: the `html { scroll-behavior }` rule moved out of its
// `@media (prefers-reduced-motion: no-preference)` block in
// css/layout.css — "the guard keeps smooth away" goes red in firefox with
// the value reading `smooth` under the preference, while the first test
// stays green.

const SMOOTH = '/tests/fixtures/smooth-scroll.html';

test.describe('smooth scrolling', () => {
    test('a page that asks for it gets it [stage 1.1]', async ({ page }) => {
        await page.emulateMedia({ reducedMotion: 'no-preference' });
        await page.goto(SMOOTH);
        await measured(
            page.locator('html'),
            (el) => getComputedStyle(el).scrollBehavior,
            undefined,
            'the knob reaches the root when nothing objects',
        ).toBe('smooth');
    });

    test('the guard keeps smooth away from a reader who asked for less [stage 1.1, DI7]', async ({ page }) => {
        await page.emulateMedia({ reducedMotion: 'reduce' });
        await page.goto(SMOOTH);
        await measured(
            page.locator('html'),
            (el) => getComputedStyle(el).scrollBehavior,
            undefined,
            'the same page, the same knob, and the preference wins',
        ).toBe('auto');
    });
});

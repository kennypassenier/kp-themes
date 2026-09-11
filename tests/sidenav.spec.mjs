// The side navigation [feat-nav-3].
//
// Kenny asked for a real one — "zoals mdbootstrap, met alle opties die die
// heeft" — after seeing that the package had none. The measurement behind
// that: `grep -l "kp-sidebar" css/*-register.css | wc -l` returned 0. The
// sidebar had never been a component, so no theme had ever been asked to
// style it, so there was nothing to look at.
//
// These tests hold the options that carry behaviour. What a theme does
// with it belongs to the register specs; what the component does belongs
// here.
//
// Every assertion reads what the browser painted rather than the attribute
// the module just wrote [KT13].
//
// Drill [KT3], four passes:
//   · the panel's own `inline-size` removed → `1266 passed, 2 failed`, the
//     side test and the slim test
//   · `offsetContent` made a no-op in js/sidenav.js → the push test red
//   · the accordion branch made unreachable → the accordion test red
//   · the slim width rule removed → the slim test red
//
// The first pass is the one worth keeping: its first version asked whether
// the panel was wider than 100px and stayed GREEN with the width removed,
// because the header text alone is wider than that. Rule 7e, caught by the
// drill it exists for.

import { expect, test } from '@playwright/test';
import { measured } from './paint.mjs';

const FIXTURE = '/tests/fixtures/sidenav.html';

/** @param {import('@playwright/test').Page} page @param {string} name */
const part = (page, name) => page.locator(`[data-test="${name}"]`);

/** @param {import('@playwright/test').Locator} locator @param {string} message */
const width = (locator, message) => measured(locator, (el) => el.getBoundingClientRect().width, undefined, message);

/** @param {import('@playwright/test').Locator} locator @param {string} message */
const left = (locator, message) => measured(locator, (el) => el.getBoundingClientRect().left, undefined, message);

test.describe('the side navigation', () => {
    test('side: the panel is part of the page from the start [feat-nav-3]', async ({ page }) => {
        // The width is the claim, not "wider than something". The first
        // version asked for more than 100px and stayed green with the rule
        // removed, because the header text alone is wider than that — a
        // test measuring its own scaffolding [rule 7e]. `--kp-sidenav-width`
        // defaults to 15rem, and 15rem at the root's 16px is 240.
        await page.goto(FIXTURE);

        await width(part(page, 'side'), 'side: exactly the width the token declares').toBeCloseTo(240, 0);
        await measured(part(page, 'side'), (el) => getComputedStyle(el).position, undefined, 'side: and in the flow, not over it').toBe('static');
    });

    test('over: away until the toggler is pressed, and it brings a backdrop [feat-nav-3]', async ({ page }) => {
        await page.goto(FIXTURE);
        const box = await part(page, 'over-box').boundingBox();
        const panel = part(page, 'over');

        // Away means translated out, not hidden: the box is still there,
        // it is just not on the screen. Measured against the box it lives
        // in rather than against a number.
        await measured(panel, (el) => el.getBoundingClientRect().right, undefined, 'over: starts outside its own box').toBeLessThanOrEqual(
            (box?.x ?? 0) + 1,
        );
        await expect(page.locator('.kp-sidenav__backdrop'), 'over: and no backdrop while it is away').toHaveCount(0);

        await part(page, 'over-toggle').click();

        await left(panel, 'over: on the screen once asked').toBeCloseTo(box?.x ?? 0, 0);
        await expect(page.locator('.kp-sidenav__backdrop'), 'over: the backdrop came with it').toHaveCount(1);
    });

    test('over: Escape, the backdrop and the toggler each close it [feat-nav-3, KT6]', async ({ page }) => {
        await page.goto(FIXTURE);
        const box = await part(page, 'over-box').boundingBox();
        const panel = part(page, 'over');
        const away = async (message) =>
            measured(panel, (el) => el.getBoundingClientRect().right, undefined, message).toBeLessThanOrEqual((box?.x ?? 0) + 1);

        await part(page, 'over-toggle').click();
        await left(panel, 'open before Escape').toBeCloseTo(box?.x ?? 0, 0);
        await page.keyboard.press('Escape');
        await away('closed by Escape');

        await part(page, 'over-toggle').click();
        await left(panel, 'open before the backdrop').toBeCloseTo(box?.x ?? 0, 0);
        await page.locator('.kp-sidenav__backdrop').click({ force: true });
        await away('closed by the backdrop');

        await part(page, 'over-toggle').click();
        await left(panel, 'open before the second press').toBeCloseTo(box?.x ?? 0, 0);
        await part(page, 'over-toggle').click();
        await away('closed by the toggler that opened it');
    });

    test('over: opening moves the focus in, closing gives it back [feat-nav-3]', async ({ page }) => {
        await page.goto(FIXTURE);
        const toggle = part(page, 'over-toggle');

        await toggle.click();
        await expect(part(page, 'over-first'), 'the first thing in the panel takes the focus').toBeFocused();

        await page.keyboard.press('Escape');
        await expect(toggle, 'and the button that opened it gets it back').toBeFocused();
    });

    test('push: the content makes room, and over does not [feat-nav-3]', async ({ page }) => {
        // The one thing CSS cannot do: the offset lands on an element the
        // component does not own. Drill: `offsetContent` made a no-op in
        // js/sidenav.js and this goes red while everything else stays green.
        await page.goto(FIXTURE);
        const content = part(page, 'push-content');

        const before = await content.evaluate((el) => el.getBoundingClientRect().left);
        await part(page, 'push-toggle').click();
        await measured(content, (el) => el.getBoundingClientRect().left, undefined, 'push: the content moved over').toBeGreaterThan(before);

        const overContent = part(page, 'over-box');
        const overBefore = await overContent.evaluate((el) => el.getBoundingClientRect().left);
        await part(page, 'over-toggle').click();
        expect(await overContent.evaluate((el) => el.getBoundingClientRect().left), 'over: nothing moves, because covering is the point').toBeCloseTo(
            overBefore,
            0,
        );
    });

    test('slim: the rail keeps the icons and loses the words [feat-nav-3]', async ({ page }) => {
        await page.goto(FIXTURE);
        const panel = part(page, 'slim');
        const full = await panel.evaluate((el) => el.getBoundingClientRect().width);

        await page.evaluate(async () => {
            const { sidenavOf } = await import('/js/sidenav.js');
            sidenavOf(document.getElementById('nav-slim'))?.setSlim(true);
        });

        await width(panel, 'slim: narrower than it was').toBeLessThan(full);
        await width(part(page, 'slim-footer'), 'slim: the words are gone').toBe(0);
        await width(part(page, 'slim-monogram'), 'slim: and what was kept for this moment is there').toBeGreaterThan(0);
        await width(part(page, 'slim-wordmark'), 'slim: while what it replaces is not').toBe(0);

        await page.evaluate(async () => {
            const { sidenavOf } = await import('/js/sidenav.js');
            sidenavOf(document.getElementById('nav-slim'))?.setSlim(false);
        });
        await width(panel, 'slim: and all the way back — every state has a way out').toBeCloseTo(full, 0);
    });

    test('accordion: opening one category closes the other [feat-nav-3]', async ({ page }) => {
        // Drill: the accordion branch removed from js/sidenav.js and this
        // goes red, because both submenus stay open at once.
        await page.goto(FIXTURE);
        // The submenu's own box, not the link inside it: a clipped list
        // still gives its children a height, and what a reader can see is
        // how tall the container grew.
        const one = page.locator('[data-test="cat-one"] .kp-sidenav__submenu');
        const two = page.locator('[data-test="cat-two"] .kp-sidenav__submenu');

        await measured(one, (el) => el.getBoundingClientRect().height, undefined, 'both categories start closed').toBe(0);

        await part(page, 'cat-one-toggle').click();
        await measured(one, (el) => el.getBoundingClientRect().height, undefined, 'the first opened').toBeGreaterThan(0);

        await part(page, 'cat-two-toggle').click();
        await measured(two, (el) => el.getBoundingClientRect().height, undefined, 'the second opened').toBeGreaterThan(0);
        await measured(one, (el) => el.getBoundingClientRect().height, undefined, 'and the first closed, which is what accordion means').toBe(0);
    });

    test('end: the panel comes from the other edge [feat-nav-3]', async ({ page }) => {
        await page.goto(FIXTURE);
        const box = await part(page, 'end-box').boundingBox();
        const panel = part(page, 'end');

        await measured(panel, (el) => el.getBoundingClientRect().left, undefined, 'end: starts past the far edge').toBeGreaterThanOrEqual(
            (box?.x ?? 0) + (box?.width ?? 0) - 1,
        );

        await part(page, 'end-toggle').click();
        await measured(panel, (el) => el.getBoundingClientRect().right, undefined, 'end: and lands against that same edge').toBeCloseTo(
            (box?.x ?? 0) + (box?.width ?? 0),
            0,
        );
    });
});

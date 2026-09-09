// Reading the paint without losing to a moment [TF1, TF3, 2026-09-09].
//
// A bare `locator.evaluate(el => getComputedStyle(el).x)` reads one moment
// and has no second chance. When the value arrives a tick later — because
// a transition is still running, because the effects module has not got to
// that element yet, because the machine is busy with fifteen other workers
// — the test is red for good and nothing about the package is wrong.
//
// That is how two retro tests failed in Kenny's verify run of 2026-09-09
// and passed on their own, and his rule about it is not negotiable: a test
// that gives a different answer under load is not a test.
//
// Measured the same day: 538 such reads across the suite, of which 63 sit
// AFTER a click, a hover or a press in 19 of the 25 register specs. Those
// 63 are the ones that can lose, and they are what these helpers are for.
// A read of something that is settled the moment the page exists — a
// border-radius, a font stack — is left alone on purpose; wrapping it
// would be noise.
//
// The cost is nothing when the value is already right: `expect.poll` calls
// once, gets the answer, and returns.

import { expect } from '@playwright/test';

/**
 * One computed property, read until it is the value.
 *
 * @param {import('@playwright/test').Locator} locator
 * @param {string} property  e.g. 'background-color'
 * @param {string} [message] shown when it never becomes the value
 */
export const style = (locator, property, message) =>
    expect.poll(() => locator.evaluate((el, p) => getComputedStyle(el).getPropertyValue(p), property), message ? { message } : undefined);

/**
 * One computed property of a pseudo-element, read until it is the value.
 *
 * @param {import('@playwright/test').Locator} locator
 * @param {string} pseudoElement  '::before', '::after', or '' for the element itself
 * @param {string} property
 * @param {string} [message]
 */
export const pseudoStyle = (locator, pseudoElement, property, message) =>
    expect.poll(
        () => locator.evaluate((el, [p, name]) => getComputedStyle(el, p).getPropertyValue(name), [pseudoElement, property]),
        message ? { message } : undefined,
    );

/**
 * Whatever the page computes, read until the answer stops changing the verdict.
 *
 * For the readings a single property cannot express — counting the insets
 * in a box-shadow, comparing two elements, measuring a box. The callback
 * runs in the page.
 *
 * @template T
 * @param {import('@playwright/test').Locator} locator
 * @param {(el: any, arg: any) => T} fn
 * @param {any} [arg]
 * @param {string} [message]
 */
export const measured = (locator, fn, arg, message) => expect.poll(() => locator.evaluate(fn, arg), message ? { message } : undefined);

/**
 * Wait until the boot overlay has actually left the page.
 *
 * Clicking Skip resolves when the click is dispatched, not when the
 * overlay is gone, and the overlay is `position: fixed; inset: 0` over
 * everything — so a hover or a click that lands while it is still there
 * lands on the overlay instead. Every spec with an arrival wants this
 * between the skip and the first assertion.
 *
 * Deliberately NOT `data-kp-effects-done` on `<html>`: measured on
 * examples/concept-retro.html on 2026-09-09, that attribute never lands,
 * because two `rule` reveals sit below the fold waiting for the viewport
 * and the module counts them as outstanding — correctly. "Everything has
 * played" and "the overlay is gone" are different questions.
 *
 * @param {import('@playwright/test').Page} page
 */
export const bootGone = (page) => expect(page.locator('.kp-boot')).toHaveCount(0);

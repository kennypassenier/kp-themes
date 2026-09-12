// gap-4 — the six themes that answered a hover with colour and a lift now
// have a gesture of their own, one per theme, out of that theme's world.
//
// Kenny, 2026-09-11: a hover on a button is not a simple colour change —
// it should feel like physical feedback from a console. He chose "per
// theme, like the quirks" on 2026-09-12 and approved all six.
//
// The number took four measurements to get right, and three of them were
// wrong because of the probe rather than the code: reading only the
// button's pseudo-elements and not the label's; splitting a string on a
// colon when the label itself carried two; and leaving the pointer where
// the previous page had left it, so the control was already hovered when
// the resting state was read. The list is six, not twelve.
//
// Drills [KT3], 2026-09-12 in firefox, each red on the test it names then
// green again — named at the test.
import { expect, test } from '@playwright/test';
import { pseudoStyle, style } from './paint.mjs';

/** @param {import('@playwright/test').Page} page @param {string} theme */
async function open(page, theme) {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto(`/examples/concept-${theme}.html`);
    const boot = page.locator('.kp-boot');
    if ((await boot.count()) > 0) {
        await boot.click();
        await expect(boot).toHaveCount(0, { timeout: 4000 });
    }
    // The plain button, named explicitly: `.kp-button` with `.first()`
    // reaches the hero's `--mirror` variant, which carries its own rules.
    const button = page.locator('[class="kp-button"]').first();
    await button.scrollIntoViewIfNeeded();
    // Park the pointer before reading anything at rest. Without this the
    // mouse sits where the last navigation left it and the control can
    // already be hovered — which is how three of four measurements of this
    // very thing came out wrong.
    await page.mouse.move(3, 3);
    await page.waitForTimeout(350);
    return button;
}

test('blueprint calls the control out as a measured length [gap-4]', async ({ page }) => {
    // Drilled: the hover's `opacity: 1` removed -> red on the witnesses.
    const button = await open(page, 'blueprint');
    await pseudoStyle(button, '::before', 'opacity', 'no call-out at rest').toBe('0');
    const paint = await button.evaluate((el) => {
        const b = getComputedStyle(el, '::before');
        return { colour: b.backgroundColor, width: b.width };
    });
    expect(paint.width, 'a witness line is a line').toBe('1px');
    await button.hover();
    await pseudoStyle(button, '::before', 'opacity', 'the leading witness').toBe('1');
    await pseudoStyle(button, '::after', 'opacity', 'and the trailing one').toBe('1');
});

test('deco opens a fan of rays out of the corner [gap-4]', async ({ page }) => {
    // Drilled: the `repeating-conic-gradient` removed -> red on the fan.
    const button = await open(page, 'deco');
    const fan = await button.evaluate((el) => getComputedStyle(el, '::before').backgroundImage);
    expect(fan, 'a sunburst, which is a repeating conic gradient').toMatch(/repeating-conic-gradient/);
    await pseudoStyle(button, '::before', 'opacity', 'closed at rest').toBe('0');
    await button.hover();
    await pseudoStyle(button, '::before', 'opacity', 'and open under the pointer').toBe('1');
});

test('formal draws its second rule just inside the first [gap-4]', async ({ page }) => {
    // Drilled: the `::after` border removed -> red on the second rule.
    const button = await open(page, 'formal');
    await pseudoStyle(button, '::after', 'opacity', 'one rule at rest').toBe('0');
    const inner = await button.evaluate((el) => {
        const a = getComputedStyle(el, '::after');
        return { width: a.borderTopWidth, style: a.borderTopStyle, inset: a.insetBlockStart };
    });
    expect(inner.style, 'a line, not a shadow').toBe('solid');
    expect(inner.width).toBe('1px');
    expect(Number.parseFloat(inner.inset), 'inside the first, not on it').toBeGreaterThan(0);
    await button.hover();
    await pseudoStyle(button, '::after', 'opacity', 'and two under the pointer').toBe('1');
});

test('light settles toward the paper instead of rising off it [gap-4]', async ({ page }) => {
    // Drilled: the hover's box-shadow removed -> red on the shadow
    // tightening. The reverse of shade-light on purpose, so those two do
    // not share a gesture.
    const button = await open(page, 'light');
    const blur = (shadow) => Number.parseFloat(shadow.match(/(-?[\d.]+)px (-?[\d.]+)px ([\d.]+)px/)?.[3] ?? 'NaN');
    const rest = await button.evaluate((el) => getComputedStyle(el).boxShadow);
    await button.hover();
    await style(button, 'translate', 'it settles toward the paper').toBe('0px 2px');
    const hot = await button.evaluate((el) => getComputedStyle(el).boxShadow);
    expect(blur(hot), 'and its shade tightens rather than spreading').toBeLessThan(blur(rest));
});

test('retro shows the accelerator, and only where one is marked [gap-4]', async ({ page }) => {
    // Its own fixture: the concept pages write labels as plain text, and
    // this gesture asks the consumer to mark a letter. A consumer who marks
    // nothing sees nothing, which is the second half of the test.
    //
    // Drilled: the hover rule's `border-block-end-color` removed -> red on
    // the underline arriving.
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto('/tests/fixtures/accelerator.html');
    const marked = page.locator('#marked [data-kp-key]');
    const transparent = 'rgba(0, 0, 0, 0)';
    await style(marked, 'border-bottom-color', 'nothing underlined at rest').toBe(transparent);
    await page.locator('#marked').hover();
    const ink = await page.locator('#marked').evaluate((el) => getComputedStyle(el).color);
    await style(marked, 'border-bottom-color', 'the accelerator, in the label’s own ink').toBe(ink);

    await page.locator('#plain').hover();
    expect(await page.locator('#plain [data-kp-key]').count(), 'a label that marks nothing has nothing to show').toBe(0);
});

test('terminal puts its own cursor after the label [gap-4]', async ({ page }) => {
    // The same block this theme draws inside its fields, on the same
    // keyframe and at the same rate — one cursor in this theme, not two.
    //
    // Drilled: the hover's `background-size` removed -> red on the cursor
    // appearing.
    const button = await open(page, 'terminal');
    await pseudoStyle(button, '::after', 'background-size', 'no cursor at rest').toBe('0px 0px');
    await button.hover();
    await pseudoStyle(button, '::after', 'animation-name', 'the theme’s own caret, not a second one').toBe('kp-caret');
    const lit = await button.evaluate((el) => getComputedStyle(el, '::after').backgroundImage);
    expect(lit, 'drawn in the signal').toMatch(/gradient/);
});

test('terminal’s cursor is there for someone who asked for less motion [gap-4, DI7]', async ({ page }) => {
    // The half the first version of this test could not see. The keyframe
    // sets `background-size` itself, so with motion allowed the hover's own
    // declaration is redundant and removing it changed nothing — the drill
    // reported false green. Under reduced motion the animation does not run
    // and that declaration is the only thing putting the cursor there.
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/examples/concept-terminal.html');
    const boot = page.locator('.kp-boot');
    if ((await boot.count()) > 0) {
        await boot.click();
        await expect(boot).toHaveCount(0, { timeout: 4000 });
    }
    const button = page.locator('[class="kp-button"]').first();
    await button.scrollIntoViewIfNeeded();
    await page.mouse.move(3, 3);
    await page.waitForTimeout(250);
    await pseudoStyle(button, '::after', 'background-size', 'no cursor at rest').toBe('0px 0px');
    await button.hover();
    await pseudoStyle(button, '::after', 'animation-name', 'nothing blinks').toBe('none');
    const size = await button.evaluate((el) => getComputedStyle(el, '::after').backgroundSize);
    expect(size, 'and the cursor stands there anyway').not.toBe('0px 0px');
});

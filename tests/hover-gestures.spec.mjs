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
import { pseudoStyle } from './paint.mjs';

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

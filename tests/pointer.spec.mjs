// The pointer bus [scope-16]: the spectral instrument's oxide film is a
// conic gradient whose start angle follows the pointer, and a gradient
// cannot read a pointer. `--kp-pointer: track` makes the effects module
// write the position down; nothing else in the package does.
//
// Drilled 2026-09-12 in firefox (each red on the test it names, then green
// again): `pointerBus()` removed from attachEffects -> red on "the bus
// writes"; the `reduced()` guard removed -> red on "reduced motion asks it
// not to"; the cleanup's removeProperty removed -> red on "detach gives the
// stylesheet its value back".
import { expect, test } from '@playwright/test';
import { measured } from './paint.mjs';

const px = (page) => page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--kp-px').trim());

test('the bus writes the pointer position, once the theme asks for it [scope-16]', async ({ page }) => {
    await page.goto('/tests/fixtures/pointer.html');
    expect(await px(page), 'the declared default stands before anything moves').toBe('0.5');
    const box = page.viewportSize();
    await page.mouse.move(Math.round(box.width * 0.2), Math.round(box.height * 0.4));
    // Polled: the write happens on the next animation frame, not in the
    // handler, so a single read after the move lands before it [fix-1].
    await measured(page.locator('html'), (el) => getComputedStyle(el).getPropertyValue('--kp-px').trim(), undefined, 'the bus writes x').not.toBe(
        '0.5',
    );
    const left = Number(await px(page));
    expect(left, 'and it is a fraction of the viewport').toBeGreaterThanOrEqual(0);
    expect(left, 'never past the far edge').toBeLessThanOrEqual(1);
    await page.mouse.move(Math.round(box.width * 0.9), Math.round(box.height * 0.4));
    await measured(
        page.locator('html'),
        (el) => Number(getComputedStyle(el).getPropertyValue('--kp-px')),
        undefined,
        'moving right raises x',
    ).toBeGreaterThan(left);
});

test('nothing is written for someone who asked for less motion [scope-16, DI7]', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/tests/fixtures/pointer.html');
    const box = page.viewportSize();
    await page.mouse.move(Math.round(box.width * 0.9), Math.round(box.height * 0.8));
    await page.waitForTimeout(200);
    expect(await px(page), 'a colour that follows your hand is movement too').toBe('0.5');
});

test('detach gives the stylesheet its own value back [scope-16, KT6]', async ({ page }) => {
    await page.goto('/tests/fixtures/pointer.html');
    const box = page.viewportSize();
    await page.mouse.move(Math.round(box.width * 0.85), Math.round(box.height * 0.3));
    await measured(page.locator('html'), (el) => getComputedStyle(el).getPropertyValue('--kp-px').trim(), undefined, 'the bus wrote').not.toBe('0.5');
    await page.evaluate(() => window.kpEffects.detach());
    expect(await px(page), 'what the module wrote, the module removes').toBe('0.5');
});

test('a theme that does not ask keeps its own value [scope-16]', async ({ page }) => {
    await page.goto('/tests/fixtures/pointer.html?track=off');
    const box = page.viewportSize();
    await page.mouse.move(Math.round(box.width * 0.9), Math.round(box.height * 0.9));
    await page.waitForTimeout(200);
    expect(await px(page), 'no knob, no listener').toBe('');
});

// ── Phase 7: the half that was never read, and the theme it was for ────
//
// `--kp-py` is written by js/effects.js beside `--kp-px` and was read by
// no test at all; a bus that wrote the x twice would have passed every
// assertion in this file. And the spectral instrument — `dark` — is the
// theme this feature exists for, while the only angle-follows-hand
// assertion lived on titanium and on the synthetic fixture above.
//
// Drilled 2026-09-12 in firefox: the `--kp-py` write removed from
// js/effects.js and the bundle regenerated -> red on the vertical; the
// `--kp-pointer: track` declaration removed from css/dark-register.css ->
// red on dark asking for the bus.
const py = (page) => page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--kp-py').trim());

test('the bus writes the vertical too, not the horizontal twice [scope-16]', async ({ page }) => {
    await page.goto('/tests/fixtures/pointer.html');
    expect(await py(page), 'the declared default stands before anything moves').toBe('0.5');
    const box = page.viewportSize();

    // A point whose two coordinates differ, so one written for the other
    // cannot pass: a fifth across, four fifths down.
    await page.mouse.move(Math.round(box.width * 0.2), Math.round(box.height * 0.8));
    await expect.poll(() => py(page)).not.toBe('0.5');

    const x = Number(await px(page));
    const y = Number(await py(page));
    expect(y, 'the vertical follows the hand down the page').toBeGreaterThan(0.6);
    expect(x, 'and the horizontal is its own value, not a copy').toBeLessThan(0.4);
});

test('the spectral instrument asks for the bus and receives it [scope-16]', async ({ page }) => {
    await page.goto('/showcase/themes/dark.html');

    // dark declares `--kp-pointer: track`, which is what arms the bus.
    const asks = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--kp-pointer').trim());
    expect(asks, 'dark asks the module to track the pointer').toBe('track');

    const box = page.viewportSize();
    await page.mouse.move(Math.round(box.width * 0.75), Math.round(box.height * 0.3));
    await expect.poll(() => px(page)).not.toBe('0.5');
    expect(Number(await px(page)), 'the written value follows the hand across').toBeGreaterThan(0.6);
});

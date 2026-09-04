// The cyberpunk effects, and the promise they make to everyone else
// [Phase 7, DI7, TH14].
//
// These four components had no test at all. What they promise is not the
// animation — it is that outside cyberpunk, and for anyone who asked for
// less motion, the text is simply the text. A screen reader gets the real
// string either way, through aria-label.
//
// BootSequence is not here: it needs the optional `motion` peer, which
// this package does not install. That gap is recorded rather than papered
// over — see docs/TEST_PLAN.md.

import { test, expect } from '@playwright/test';

const PAGE = '/tests/fixtures/components.html';

test('outside cyberpunk the effects are just the text', async ({ page }) => {
    await page.goto(PAGE);
    // The fixture wears formal, so the effects must be inert.
    await expect(page.locator('#react-components [data-test="decipher"]')).toHaveText('ONTCIJFEREN');
    await expect(page.locator('#react-components [data-test="scramble"]')).toHaveText('1284');
});

test('under reduced motion the effects are just the text, in cyberpunk too [DI7]', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(PAGE);
    await page.evaluate(() => {
        document.documentElement.dataset.theme = 'cyberpunk';
    });
    // No settling time: the point is that nothing ever scrambles.
    await expect(page.locator('#react-components [data-test="decipher"]')).toHaveText('ONTCIJFEREN');
    await expect(page.locator('#react-components [data-test="scramble"]')).toHaveText('1284');
});

test('the real text reaches a screen reader whatever the effect does', async ({ page }) => {
    await page.goto(PAGE);
    // aria-label carries the string, so the scrambling glyphs are never
    // the only copy of it — they are aria-hidden decoration over the top.
    await expect(page.locator('#react-components [data-test="decipher"] [aria-label]')).toHaveAttribute('aria-label', 'ONTCIJFEREN');
    await expect(page.locator('#react-components [data-test="scramble"] [aria-label]')).toHaveAttribute('aria-label', '1284');
});

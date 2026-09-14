// The intro inspector and the intro words per theme [scope-84].
//
// Kenny, 2026-09-15: a catalogue page where the intros can be looked at and
// played at a chosen speed, and intro words that belong to their theme
// ("Cyberpunk teksten passen niet bij een blueprint"). What a person cannot
// see on that page without a stopwatch or a second theme is held here: the
// speed knob really scales the arrival, the default is untouched, Play plays
// again although the arrival is once per session, synthwave no longer speaks
// cyberpunk, and a theme with no words of its own gets the neutral ones.
//
// Red first, 2026-09-15, firefox, against js/effects.js and js/strings.js as
// they stood at 9e628e61 (the page and the frame already in place): the
// half-speed arrival took the same time as the default one (ratio 1.0),
// synthwave's line read "▶ Calibrating neural uplink", and the neutral line
// read the same. The default duration and the replay were green on both.

import { expect, test } from '@playwright/test';
import { waitForJudging } from './helpers/catalogue.mjs';

const FRAME = '/catalogue/frame/intro.html';

/** Record when the arrival overlay appears and when it goes, from the first script on. */
async function stopwatch(page) {
    await page.addInitScript(() => {
        const record = { start: 0, end: 0, lines: /** @type {string[]} */ ([]) };
        Object.assign(window, { kpIntro: record });
        new MutationObserver(() => {
            const overlay = document.querySelector('.kp-boot');
            if (overlay && !record.start) record.start = performance.now();
            const text = overlay?.querySelector('.kp-boot__line')?.textContent;
            if (text && record.lines.at(-1) !== text) record.lines.push(text);
            if (!overlay && record.start && !record.end) record.end = performance.now();
        }).observe(document, { childList: true, subtree: true, characterData: true });
    });
}

/** Play one theme's arrival in the frame and return how long the overlay stood, and every line it showed. */
async function playFrame(page, query) {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await stopwatch(page);
    await page.goto(`${FRAME}?${new URLSearchParams({ play: '1', ...query })}`);
    await page.waitForFunction(() => window.kpIntro.end > 0, null, { timeout: 15_000 });
    return page.evaluate(() => ({ elapsed: window.kpIntro.end - window.kpIntro.start, lines: window.kpIntro.lines }));
}

test.describe('the arrival speed knob, --kp-arrival-rate [scope-84]', { tag: ['@component:page-effects', '@theme:terminal'] }, () => {
    test('unset, terminal boots in its own time: four steps of 190 ms, 320 ms, and the tube going off', async ({ page }) => {
        const { elapsed } = await playFrame(page, { theme: 'terminal' });
        // 4 × 190 + 320 + 420 (kp-tube-off) = 1500 ms, with room for a busy machine.
        expect(elapsed).toBeGreaterThan(1300);
        expect(elapsed).toBeLessThan(2200);
    });

    test('at 0.5 the same arrival takes twice as long', async ({ browser }) => {
        const one = await browser.newPage();
        const half = await browser.newPage();
        const atOne = await playFrame(one, { theme: 'terminal', rate: '1' });
        const atHalf = await playFrame(half, { theme: 'terminal', rate: '0.5' });
        const ratio = atHalf.elapsed / atOne.elapsed;
        expect(ratio, `1×: ${Math.round(atOne.elapsed)} ms, 0.5×: ${Math.round(atHalf.elapsed)} ms`).toBeGreaterThan(1.7);
        expect(ratio).toBeLessThan(2.3);
        expect(atHalf.lines.at(-1), 'the same sequence, only slower').toBe(atOne.lines.at(-1));
        await one.close();
        await half.close();
    });
});

test.describe('the intro words per theme [scope-84]', { tag: ['@component:page-effects'] }, () => {
    test("synthwave boots in its own words, not in cyberpunk's", { tag: ['@theme:synthwave'] }, async ({ page }) => {
        const { lines } = await playFrame(page, { theme: 'synthwave', rate: '2' });
        const all = lines.join('\n');
        expect(all).not.toContain('Calibrating neural uplink');
        expect(lines[0]).toMatch(/^▶ Play\nTracking \d+%/);
        expect(lines.at(-1)).toBe('▶ Play\nTracking 100%\nPress start');
    });

    test('a theme that asks for a boot and has no words of its own shows the neutral ones', { tag: ['@theme:formal'] }, async ({ page }) => {
        await page.emulateMedia({ reducedMotion: 'no-preference' });
        await page.goto(`${FRAME}?theme=formal`);
        const text = await page.evaluate(async () => {
            document.documentElement.style.setProperty('--kp-arrival', 'boot');
            const { attachEffects } = await import('/js/effects.js');
            attachEffects(document);
            return document.querySelector('.kp-boot__line')?.textContent ?? '';
        });
        expect(text).toMatch(/^Loading\nProgress \d+%/);
        for (const other of ['Calibrating', 'Tracking', 'BIOS', 'phantom']) expect(text).not.toContain(other);
    });
});

test.describe('the intro inspector page [scope-84]', { tag: ['@component:catalogue', '@component:page-effects'] }, () => {
    test('Play plays the arrival, and plays it again although it is once per session', { tag: ['@theme:terminal'] }, async ({ page }) => {
        await page.emulateMedia({ reducedMotion: 'no-preference' });
        await page.goto('/catalogue/intros.html');
        await waitForJudging(page);
        const block = page.locator('#intro-terminal');
        const frame = page.frameLocator('#intro-terminal iframe');
        await block.locator('[data-cat-intro-rate]').fill('2');
        await expect(block.locator('[data-cat-intro-rate-value]')).toHaveText('2.0×');
        await expect(block.locator('[data-cat-intro-words]')).toContainText('PHOSPHOR PROFILE');

        for (const round of [1, 2]) {
            await block.locator('[data-cat-intro-play]').click();
            await expect(frame.locator('.kp-boot'), `play ${round} shows the overlay`).toHaveCount(1);
            await expect(block, `play ${round} ends`).toHaveAttribute('data-cat-intro-state', 'ended', { timeout: 10_000 });
            await expect(block.locator('[data-cat-intro-status]')).toContainText(/Played in \d+ ms/);
            await expect(block.locator('[data-cat-intro-live]')).toContainText('READY.');
        }
    });

    test(
        'under reduced motion the page says so, stays at rest, and plays only when asked to anyway',
        { tag: ['@theme:phantom'] },
        async ({ page }) => {
            await page.emulateMedia({ reducedMotion: 'reduce' });
            await page.goto('/catalogue/intros.html');
            await waitForJudging(page);
            const notice = page.locator('[data-cat-intro-reduced]');
            await expect(notice).toBeVisible();
            const block = page.locator('#intro-phantom');
            await block.locator('[data-cat-intro-play]').click();
            await expect(block).toHaveAttribute('data-cat-intro-state', 'rested');
            await notice.getByText('Play anyway for inspection').click();
            await block.locator('[data-cat-intro-play]').click();
            await expect(page.frameLocator('#intro-phantom iframe').locator('.kp-boot__line')).toHaveText('phantom');
            await expect(block).toHaveAttribute('data-cat-intro-state', 'ended', { timeout: 10_000 });
        },
    );

    test('every theme without an intro is named in one line', async ({ page }) => {
        await page.goto('/catalogue/intros.html');
        const line = page.locator('[data-cat-intro-none]');
        await expect(line).toHaveText(/^No intro: formal, /);
        await expect(line).not.toContainText('Declares an intro but has no block');
        for (const theme of ['synthwave', 'terminal', 'retro', 'phantom']) await expect(line).not.toContainText(theme);
    });
});

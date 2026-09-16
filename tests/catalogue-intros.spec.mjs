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
import { useEmptyRegister, useRegister } from './helpers/empty-register.mjs';

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

// Gathered by "Every component, one page" [fix-43]. Kenny judges from
// catalogue/index.html, which copies a block's markup and runs the page's own
// scripts not at all: the four intro blocks arrived there without the module
// that wires them, so Play did nothing and the words beside the window stayed
// empty ("er gebeurt niks als oik op play druk?", 2026-09-16, four
// rejections). The inspector's own page was and is green, which is why nothing
// caught it.
test.describe('the intro blocks work where they are judged [fix-43]', { tag: ['@component:catalogue'] }, () => {
    test.describe.configure({ timeout: 180_000 });

    test('Play plays the arrival on the review page too', { tag: ['@theme:terminal'] }, async ({ page, context }) => {
        await useEmptyRegister(context);
        await page.emulateMedia({ reducedMotion: 'no-preference' });
        await page.goto('/catalogue/index.html');
        await waitForJudging(page, { timeout: 120_000 });

        const block = page.locator('#intros--intro-terminal');
        await expect(block.locator('[data-cat-intro-words]')).toContainText('PHOSPHOR PROFILE');
        await block.locator('[data-cat-intro-play]').click();
        await expect(block).toHaveAttribute('data-cat-intro-state', 'ended', { timeout: 30_000 });
        await expect(block.locator('[data-cat-intro-status]')).toContainText(/Played in \d+ ms/);
        await expect(block.locator('[data-cat-intro-live]')).toContainText('READY.');
    });
});

// Het thema van de intro [scope-86, intro-verdict-theme]: a block on the intro
// page is judged in the theme its window plays, whatever theme the page
// around it wears. The block declares it (`data-cat-theme`), and the verdict,
// the label by the buttons, the note and the prompt's verdict line all follow
// that declaration; a block without one keeps the page theme.
//
// Red first, 2026-09-15, firefox, on 77f4b2fd: approving #intro-synthwave in
// formal stored the verdict under formal and the label read "Formal".
test.describe('the verdict of an intro block is kept under its own theme [scope-86]', { tag: ['@component:catalogue'] }, () => {
    const JUDGEMENTS = 'kp-catalogue-judgements:v3';
    const ENGINE_LABEL = { firefox: 'Firefox', chromium: 'Chromium', webkit: 'WebKit' };

    test.beforeEach(async ({ context }) => {
        await useRegister(context);
    });

    /** @param {import('@playwright/test').Page} page @param {string} theme */
    const setTheme = (page, theme) => page.evaluate((name) => import('/js/theme-core.js').then((m) => m.applyTheme(name)), theme);

    /** @param {import('@playwright/test').Page} page @param {string} key */
    const storedThemes = (page, key) =>
        page.evaluate(([store, block]) => Object.keys(JSON.parse(localStorage.getItem(store) ?? '{}')[block] ?? {}), [JUDGEMENTS, key]);

    test(
        'approving the synthwave intro while the page wears formal records it under synthwave',
        { tag: ['@theme:synthwave'] },
        async ({ page, browserName }) => {
            const engine = ENGINE_LABEL[browserName];
            await page.goto('/catalogue/intros.html');
            await waitForJudging(page);
            expect(await page.evaluate(() => document.documentElement.getAttribute('data-theme'))).toBe('formal');
            const block = page.locator('#intro-synthwave');
            const state = block.locator('.cat-judge [data-cat-approval-state]');
            await expect(state).toHaveText(`Not yet judged · Synthwave · ${engine}`);
            await expect(block.locator('.cat-judge label')).toHaveText('Note for Synthwave');

            await block.locator('.cat-judge [data-cat-verdict="approved"]').click();
            await expect(state).toHaveText(`Approved · Synthwave · ${engine}`);
            // Since scope-111 the intro page is a component page, so its blocks
            // are judged under the review page's key, not under their own page.
            expect(await storedThemes(page, 'intros--intro-synthwave')).toEqual(['synthwave']);
            // The other blocks keep their own themes and are still open.
            await expect(page.locator('#intro-terminal .cat-judge [data-cat-approval-state]')).toHaveText(`Not yet judged · Terminal · ${engine}`);

            const prompt = await page.evaluate(() => import('/catalogue/review-state.js').then((m) => m.buildPrompt().text));
            expect(prompt).toContain('Theme Synthwave:');
            expect(prompt).toMatch(new RegExp(`intros--intro-synthwave · synthwave · ${browserName} · approved · \\w+`));
            expect(prompt).not.toContain('· formal ·');

            // Another page theme: the block is still judged, in its own theme, with the same hash.
            for (const theme of ['nostromo', 'cyberpunk']) {
                await setTheme(page, theme);
                await waitForJudging(page);
                await expect(state, `page in ${theme}`).toHaveText(`Approved · Synthwave · ${engine}`);
            }
        },
    );

    test('a block that declares no theme is still judged in the page theme', { tag: ['@component:button'] }, async ({ page, browserName }) => {
        await page.goto('/catalogue/button.html');
        await waitForJudging(page);
        const block = page.locator('#variants');
        await block.locator('.cat-judge [data-cat-verdict="approved"]').click();
        expect(await storedThemes(page, 'button--variants')).toEqual(['formal']);
        await block.evaluate((el) => el.removeAttribute('hidden'));
        await expect(block.locator('.cat-judge [data-cat-approval-state]')).toHaveText(`Approved · Formal · ${ENGINE_LABEL[browserName]}`);
    });
});

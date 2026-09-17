// The deco register [S48, LIFT_PLAN row 8]: the approved concept demo
// "The Gilded Ascent" (2026-09-08) reproduced by the package, measured on
// the concept page under deco in both channels.
//
// What the demo showed and this suite holds: the headline framed by a
// concentric gold cartouche (three inset steps, a chevron corner cut) that
// scales in once, the rule under a heading fading toward transparent, the
// dossier's jewel (emerald) redactions covered until the "Open the file"
// trigger clears them staggered, the focus ring answered by the base
// layer's own default (no register override, since the derived tokens
// already equal foreground/background), the nav dropdown styled (KT14),
// and the whole approved inventory. The double-rule divider and the lede's
// gold highlight are judged by eye on the catalogue since scope-73
// (page-effects#dividers, page-effects#lede-marks).
//
// Drills [KT3], performed 2026-09-08 in chromium, repeated the same
// day in firefox (each one red on the test it names, then restored green
// in both browsers) [G13]:
//   - the cartouche's `::before` frame (box-shadow + clip-path) removed →
//     no frame paints around the headline, red on "the cartouche frames";
//   - the armed redaction rule (`[data-kp-effects] mark:not(.is-cleared)`)
//     removed → the dossier's words are readable from the first paint, red
//     on "the redactions are jewel plates".

import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';
import { animationsSeen, recordAnimations } from './paint.mjs';

const INVENTORY = JSON.parse(readFileSync(new URL('../showcase/concept-demo.json', import.meta.url), 'utf8')).elements;

const CHANNELS = [
    ['framework-free', '/examples/concept-deco.html'],
    ['React', '/tests/fixtures/examples.html?example=concept&copy=deco'],
];

/**
 * @param {import('@playwright/test').Page} page
 * @param {string} url
 * @param {{ reduced?: boolean }} [options]
 */
async function open(page, url, { reduced = false } = {}) {
    await page.emulateMedia({ reducedMotion: reduced ? 'reduce' : 'no-preference' });
    await page.addInitScript(() => {
        try {
            localStorage.setItem('theme', 'deco');
        } catch {
            // no storage: the page keeps its served theme
        }
    });
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(url);
    await page.waitForFunction(() => document.documentElement.getAttribute('data-theme') === 'deco');
    await expect(page.locator('[data-kp-surface="app"]').first()).toBeVisible();
}

/** @param {import('@playwright/test').Locator} locator @param {string} pseudo @param {string[]} props */
const pseudo = (locator, pseudo, props) =>
    locator.evaluate(
        (el, [p, names]) => {
            const style = getComputedStyle(el, p);
            return Object.fromEntries(names.map((n) => [n, style.getPropertyValue(n)]));
        },
        [pseudo, props],
    );

/** @param {import('@playwright/test').Page} page */
const settled = (page) =>
    page.evaluate(() =>
        Promise.all(
            document
                .getAnimations()
                .filter((a) => a.effect?.getTiming().iterations !== Infinity)
                .map((a) => a.finished.catch(() => {})),
        ),
    );

/** The computed value of a token, as the browser would paint it. */
const paint = (/** @type {import('@playwright/test').Page} */ page, /** @type {string} */ token) =>
    page.evaluate((t) => {
        const s = document.createElement('span');
        s.style.color = getComputedStyle(document.documentElement).getPropertyValue(t).trim();
        document.body.append(s);
        const v = getComputedStyle(s).color;
        s.remove();
        return v;
    }, token);

for (const [channel, url] of CHANNELS) {
    test.describe(`the deco register, ${channel}`, { tag: ['@theme:deco', '@component:page-effects', '@component:examples'] }, () => {
        test('there is no arrival: the page is simply there, and every reveal is at rest under reduced motion', async ({ page }) => {
            await open(page, url);
            expect(await page.locator('.kp-boot').count(), 'the cartouche is not a boot overlay').toBe(0);
            await open(page, url, { reduced: true });
            expect(await page.locator('.kp-boot').count()).toBe(0);
            await expect(page.locator('[data-kp-reveal="headline"]').first()).toHaveClass(/is-deciphered/);
            const h1 = page.locator('[data-kp-surface="hero"] h1[data-kp-reveal="headline"]').first();
            expect(await h1.evaluate((el) => getComputedStyle(el).animationName), 'the frame does not scale in under reduced motion').toBe('none');
            expect(await h1.evaluate((el) => getComputedStyle(el).opacity), 'and it is fully visible at rest').toBe('1');
        });

        test('the cartouche frames the headline: three concentric steps, a chevron bite, scaling in once [S49]', async ({ page }) => {
            // Armed before the page exists: the cartouche scales in once
            // and stops, so a read one moment later is a race and a poll
            // for a value that has already left never finds it [fix-1].
            await recordAnimations(page);
            await open(page, url);
            const h1 = page.locator('[data-kp-surface="hero"] h1[data-kp-reveal="headline"]').first();
            const frame = await pseudo(h1, '::before', ['box-shadow', 'clip-path', 'position']);
            expect(frame.position).toBe('absolute');
            // Three inset box-shadow layers: primary, background, foreground.
            const layers = frame['box-shadow'].split(/,(?![^(]*\))/);
            expect(layers.length, 'three concentric steps').toBe(3);
            for (const layer of layers) expect(layer).toMatch(/inset/);
            expect(frame['clip-path'], 'the chevron corner cut').toMatch(/polygon\(/);
            await animationsSeen(page, 'the cartouche scales in on its own keyframe').toContain('kp-cartouche-in');
            await settled(page);
            await expect.poll(async () => h1.evaluate((el) => getComputedStyle(el).opacity)).toBe('1');
            // The base layer's shared double-rule flourish is neutralised here:
            // the hero headline gets the cartouche, not a second underline.
            const after = await pseudo(h1, '::after', ['content']);
            expect(after.content, 'no extra rule under the framed headline').toBe('none');
        });

        test('the rule fades toward transparent under a heading, drawn once when it enters the viewport [TH122]', async ({ page }) => {
            await open(page, url);
            const rule = page.locator('[data-kp-reveal="rule"]').first();
            await rule.scrollIntoViewIfNeeded();
            await expect(rule).toHaveClass(/is-in/, { timeout: 5000 });
            const bar = await pseudo(rule, '::after', ['background-image', 'animation-name', 'animation-duration']);
            expect(bar['background-image']).toMatch(/linear-gradient/);
            expect(bar['animation-name']).toBe('kp-rule-in');
            expect(parseFloat(bar['animation-duration'])).toBeCloseTo(0.6, 2);
            await settled(page);
            await expect.poll(async () => (await pseudo(rule, '::after', ['transform'])).transform).toMatch(/^(none|matrix\(1, 0, 0, 1, 0, 0\))$/);
        });

        test('the dossier: jewel redactions covered until the trigger clears them, staggered [TH120]', async ({ page }) => {
            await open(page, url);
            const dossier = page.locator('.kp-card[data-kp-reveal="emphasis"]');
            const mark = dossier.locator('mark').first();
            // Covered while armed and not yet cleared: the accent plate hides
            // the ink (background and colour both the accent token).
            const covered = await pseudo(mark, '', ['background-color', 'color']);
            expect(covered['background-color']).toBe(await paint(page, '--accent'));
            expect(covered.color).toBe(covered['background-color']);
            await dossier.locator('[data-kp-reveal-trigger]').click();
            await expect(mark).toHaveClass(/is-cleared/);
            await settled(page);
            const cleared = await pseudo(mark, '', ['background-color', 'color']);
            expect(cleared['background-color'], 'transparent once cleared').toBe('rgba(0, 0, 0, 0)');
            expect(cleared.color).toBe(await paint(page, '--foreground'));
        });

        test('the approved inventory is whole on the page [S46]', async ({ page }) => {
            await open(page, url);
            const html = (await page.content()).replace(/=""/g, '');
            for (const { what, marker } of INVENTORY) {
                if (channel === 'React' && /theme-picker|theme-status/.test(marker)) continue;
                expect(html, `the page lacks ${what}`).toContain(marker);
            }
        });
    });
}

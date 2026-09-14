// The shrinking header [scope-48 wave 2].
//
// Two halves. The first is research/navbar finding 2, which had to be closed
// before the modifier could mean anything: a compact state lowers
// `--kp-nav-pad-block`, and a register that set `.kp-nav`'s block padding
// directly ignored the knob — so under that register the bar did not shrink
// at all. The research named three registers; at 15f391e6 the test below
// named twelve (brutalism, cyberpunk, dark, deco, formal, pastel, phantom,
// retro, sepia, synthwave, terminal, titanium), each still at its own
// padding with the knob set to 5px.
//
// The second half is the behaviour, driven through both channels [AR7]:
// the framework-free page declares `.kp-nav-wrap--sticky`, the React page
// renders NavBar with `sticky`, and every test runs against both.
//
// Drill [KT3], firefox, 2026-09-14, before the catalogue test was added:
// `stickyNav` in js/components.js made to return at once, and the
// transition moved out of its reduced-motion guard. 10 failed, 2 passed:
// in both channels the compact, anchor,
// Tab and motion-guard tests, and the agreement test; the finding-2 sweep
// too, because the unguarded transition was still running when it read.
// The two skip-link tests stayed green — nothing there depends on either.

import { expect, test } from '@playwright/test';
import { THEMES } from '../js/theme-registry.js';
import { useEmptyRegister } from './helpers/empty-register.mjs';
import { waitForJudging } from './helpers/catalogue.mjs';

/** @param {import('@playwright/test').Page} page */
async function loadEveryRegister(page) {
    await page.evaluate(
        (names) =>
            Promise.all(
                names.map(
                    (name) =>
                        new Promise((done) => {
                            const link = document.createElement('link');
                            link.rel = 'stylesheet';
                            link.href = `/css/${name}-register.css`;
                            link.onload = done;
                            link.onerror = done;
                            document.head.append(link);
                        }),
                ),
            ),
        THEMES.map((theme) => theme.name),
    );
}

test(
    'the bar reads its block padding from --kp-nav-pad-block in every theme [scope-48, research/navbar finding 2]',
    { tag: ['@component:navigation', '@sweep'] },
    async ({ page }) => {
        await page.emulateMedia({ reducedMotion: 'reduce' });
        await page.goto('/tests/fixtures/nav-sticky.html');
        await loadEveryRegister(page);
        const wrap = page.locator('[data-test="wrap"]');
        await wrap.evaluate((el) => /** @type {HTMLElement} */ (el).style.setProperty('--kp-nav-pad-block', '5px'));
        /** @type {string[]} */
        const ignored = [];
        for (const theme of THEMES) {
            await page.evaluate((name) => document.documentElement.setAttribute('data-theme', name), theme.name);
            const padding = await page.locator('[data-test="nav"]').evaluate((el) => {
                const style = getComputedStyle(el);
                return `${style.paddingTop} ${style.paddingBottom}`;
            });
            if (padding !== '5px 5px') ignored.push(`${theme.name}: ${padding}`);
        }
        expect(ignored, 'themes whose bar ignores the knob').toEqual([]);
    },
);

// sticky-shrink "De helft" [scope-85]: the compact bar keeps half of its own
// block padding, per side, instead of a fixed 0.125rem. Cyberpunk, synthwave
// and terminal pad the top and the bottom differently; retro rests at 3px.
// Red at aa1c7b6d, firefox: every compact bar at 2px 2px, 42 of the 44
// sides wrong — synthwave's bottom larger than its 0px rest. Only retro's
// two sides passed, 2px being within half a pixel of 1.5px.
test(
    'the compact bar keeps half of its own block padding, per side, in every theme [scope-85]',
    { tag: ['@component:navigation', '@sweep'] },
    async ({ page }) => {
        await page.emulateMedia({ reducedMotion: 'reduce' });
        await page.goto('/tests/fixtures/nav-sticky.html');
        await loadEveryRegister(page);
        const wrap = page.locator('[data-test="wrap"]');
        const nav = page.locator('[data-test="nav"]');
        const padding = () =>
            nav.evaluate((el) => {
                const style = getComputedStyle(el);
                return [parseFloat(style.paddingTop), parseFloat(style.paddingBottom)];
            });
        /** @type {string[]} */
        const wrong = [];
        for (const theme of THEMES) {
            await page.evaluate((name) => document.documentElement.setAttribute('data-theme', name), theme.name);
            await page.evaluate(() => scrollTo(0, 0));
            await expect(wrap).not.toHaveAttribute('data-kp-nav-compact');
            const rest = await padding();
            await page.evaluate(() => scrollTo(0, 600));
            await expect(wrap).toHaveAttribute('data-kp-nav-compact', '');
            const compact = await padding();
            ['top', 'bottom'].forEach((side, i) => {
                if (Math.abs(compact[i] - rest[i] / 2) > 0.5 || compact[i] > rest[i]) {
                    wrong.push(`${theme.name} ${side}: rest ${rest[i]}px, compact ${compact[i]}px`);
                }
            });
        }
        expect(wrong, 'sides whose compact padding is not half of rest').toEqual([]);
    },
);

const CHANNELS = [
    { channel: 'free', url: '/tests/fixtures/nav-sticky.html' },
    { channel: 'react', url: '/tests/fixtures/nav-sticky-react.html' },
];

/** @param {import('@playwright/test').Page} page */
const wrapOf = (page) => page.locator('.kp-nav-wrap');

/** @param {import('@playwright/test').Locator} locator */
const box = (locator) => locator.evaluate((el) => el.getBoundingClientRect().toJSON());

/** A computed transition-duration that moves nothing. */
const NO_TIME = /^0s(, 0s)*$/;

test.describe('the shrinking header', { tag: ['@component:navigation'] }, () => {
    for (const { channel, url } of CHANNELS) {
        test(`${channel}: scrolling past the threshold makes the bar compact and shorter, and scrolling back restores it`, async ({ page }) => {
            await page.emulateMedia({ reducedMotion: 'reduce' });
            await page.goto(url);
            const wrap = wrapOf(page);
            await expect(wrap).toHaveCount(1);
            await expect(wrap).not.toHaveAttribute('data-kp-nav-compact');
            const rest = (await box(wrap)).height;

            await page.evaluate(() => scrollTo(0, 400));
            await expect(wrap, 'the bar turned compact').toHaveAttribute('data-kp-nav-compact', '');
            await expect.poll(async () => (await box(wrap)).height, { message: 'the compact bar is shorter' }).toBeLessThan(rest - 4);
            await expect.poll(async () => (await box(wrap)).top, { message: 'and it is stuck to the top' }).toBeCloseTo(0, 0);

            await page.evaluate(() => scrollTo(0, 0));
            await expect(wrap, 'the bar is back at rest').not.toHaveAttribute('data-kp-nav-compact');
            await expect.poll(async () => (await box(wrap)).height, { message: 'at its own height' }).toBeCloseTo(rest, 0);
        });

        test(`${channel}: the shrink is animated only when the reader has not asked for less motion [DI7]`, async ({ page }) => {
            const duration = () => page.locator('.kp-nav-wrap > .kp-nav').evaluate((el) => getComputedStyle(el).transitionDuration);
            await page.emulateMedia({ reducedMotion: 'no-preference' });
            await page.goto(url);
            await expect(wrapOf(page)).toHaveCount(1);
            expect(await duration(), 'the padding moves').not.toMatch(NO_TIME);
            await page.emulateMedia({ reducedMotion: 'reduce' });
            expect(await duration(), 'and does not under the preference').toMatch(NO_TIME);
        });

        test(`${channel}: a followed anchor lands below the sticky bar, not under it`, async ({ page }) => {
            await page.emulateMedia({ reducedMotion: 'reduce' });
            await page.goto(url);
            const wrap = wrapOf(page);
            await expect(wrap).toHaveCount(1);
            await page.locator('.kp-nav__link[href="#target"]').click();
            await expect.poll(() => page.evaluate(() => scrollY), { message: 'the page moved to the target' }).toBeGreaterThan(400);
            await expect
                .poll(async () => (await box(page.locator('[data-test="target"]'))).top - (await box(wrap)).bottom, {
                    message: 'target top minus bar bottom',
                })
                .toBeGreaterThanOrEqual(-0.5);
        });

        test(`${channel}: an element reached with Tab is scrolled out from under the sticky bar`, async ({ page }) => {
            await page.emulateMedia({ reducedMotion: 'reduce' });
            await page.goto(url);
            const wrap = wrapOf(page);
            const late = page.locator('[data-test="late-link"]');
            await expect(wrap).toHaveCount(1);
            // Both links go under the bar: the late one ends up a few pixels
            // below the top of the window, inside the bar's height.
            await late.evaluate((el) => scrollBy(0, el.getBoundingClientRect().top - 4));
            await expect.poll(async () => (await box(late)).top, { message: 'the link is under the bar' }).toBeLessThan((await box(wrap)).bottom);
            await page.locator('[data-test="before-late"]').evaluate((el) => /** @type {HTMLElement} */ (el).focus({ preventScroll: true }));
            await page.keyboard.press('Tab');
            await expect(late).toBeFocused();
            await expect
                .poll(async () => (await box(late)).top - (await box(wrap)).bottom, { message: 'focused link top minus bar bottom' })
                .toBeGreaterThanOrEqual(-0.5);
        });

        test(`${channel}: the skip link stays the first thing Tab reaches`, async ({ page }) => {
            await page.goto(url);
            await expect(wrapOf(page)).toHaveCount(1);
            await page.keyboard.press('Tab');
            await expect(page.locator('.kp-skip-link')).toBeFocused();
            const before = await page.evaluate(() => {
                const skip = document.querySelector('.kp-skip-link');
                const wrap = document.querySelector('.kp-nav-wrap');
                return skip !== null && wrap !== null && (skip.compareDocumentPosition(wrap) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0;
            });
            expect(before, 'the skip link comes before the bar in the document').toBe(true);
        });
    }

    test('both channels compact the bar to the same height and hand the same offset to the page', async ({ page }) => {
        await page.emulateMedia({ reducedMotion: 'reduce' });
        /** @type {{ rest: number, compact: number, offset: string }[]} */
        const readings = [];
        for (const { url } of CHANNELS) {
            await page.goto(url);
            const wrap = wrapOf(page);
            await expect(wrap).toHaveCount(1);
            const rest = (await box(wrap)).height;
            await page.evaluate(() => scrollTo(0, 600));
            await expect(wrap).toHaveAttribute('data-kp-nav-compact', '');
            await expect.poll(async () => (await box(wrap)).height).toBeLessThan(rest - 4);
            const compact = (await box(wrap)).height;
            await expect.poll(() => page.evaluate(() => getComputedStyle(document.documentElement).scrollPaddingTop)).toBe(`${compact}px`);
            readings.push({ rest, compact, offset: `${compact}px` });
        }
        expect(readings[1], 'the React bar matches the framework-free one').toEqual(readings[0]);
    });

    test('a bar in a box that scrolls on its own shrinks with that box, and its anchors clear it [catalogue #bar-sticky]', async ({ page }) => {
        await page.emulateMedia({ reducedMotion: 'reduce' });
        await useEmptyRegister(page.context());
        await page.goto('/catalogue/navigation.html');
        await waitForJudging(page);
        const wrap = page.locator('#bar-sticky .kp-nav-wrap--sticky');
        const frame = page.locator('#bar-sticky [data-kp-nav-sticky-root]');
        await expect(frame, 'the box that scrolls is the one the module found').toHaveCount(1);
        const rest = (await box(wrap)).height;

        await frame.evaluate((el) => el.scrollTo(0, 200));
        await expect(wrap).toHaveAttribute('data-kp-nav-compact', '');
        await expect.poll(async () => (await box(wrap)).height).toBeLessThan(rest - 4);
        await expect
            .poll(async () => (await box(wrap)).top - (await box(frame)).top, { message: 'stuck to the box, not the window' })
            .toBeLessThan(2);

        await frame.evaluate((el) => el.scrollTo(0, 0));
        await expect(wrap).not.toHaveAttribute('data-kp-nav-compact');
        await wrap.locator('a[href="#bar-sticky-3"]').click();
        await expect
            .poll(async () => (await box(page.locator('#bar-sticky-3'))).top - (await box(wrap)).bottom, { message: 'heading top minus bar bottom' })
            .toBeGreaterThanOrEqual(-0.5);
    });
});

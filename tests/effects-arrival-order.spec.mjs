// The headline reveal waits for the arrival [scope-86, reveal-under-intro].
//
// In the four themes that perform an arrival (synthwave, terminal, retro
// and phantom) the headline reveal used to start at the same moment as the
// overlay and was over before the overlay went, so a first visit never saw
// it (research/intro-loading/README.md, section 1). These tests time both
// on the page's own clock: the moment the overlay leaves the document and
// the moment the headline is first touched by its routine (a class, or its
// children replaced). A theme without an arrival keeps its timing.
//
// Red on 77f4b2fd: every intro theme's headline started before the overlay
// was removed.

import { expect, test } from '@playwright/test';

const CHANNELS = [
    ['framework-free', '/examples/concept.html'],
    ['React', '/tests/fixtures/examples.html?example=concept'],
];

const INTRO_THEMES = ['synthwave', 'terminal', 'retro', 'phantom'];

/**
 * Record, from the first script on, when the arrival overlay was added and
 * removed and when the first headline was first touched.
 *
 * @param {import('@playwright/test').Page} page
 * @param {string} theme
 */
async function instrument(page, theme) {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.addInitScript((name) => {
        try {
            localStorage.setItem('theme', name);
        } catch {
            // no storage: the page keeps its served theme
        }
        /** @type {{ bootAdded: number | null, bootRemoved: number | null, headlineStart: number | null }} */
        const times = { bootAdded: null, bootRemoved: null, headlineStart: null };
        // @ts-ignore
        window.kpOrder = times;
        const isBoot = (/** @type {Node} */ n) => n instanceof Element && n.classList.contains('kp-boot');
        new MutationObserver((records) => {
            const now = performance.now();
            for (const r of records) {
                if (r.type === 'childList') {
                    if (times.bootAdded === null && [...r.addedNodes].some(isBoot)) times.bootAdded = now;
                    if (times.bootRemoved === null && [...r.removedNodes].some(isBoot)) times.bootRemoved = now;
                }
                const target = r.target instanceof Element ? r.target : r.target.parentElement;
                const headline = target?.closest('[data-kp-reveal="headline"]');
                if (times.headlineStart !== null || !headline) continue;
                if (headline !== document.querySelector('[data-kp-reveal="headline"]')) continue;
                if (r.type === 'attributes' && r.attributeName === 'class') times.headlineStart = now;
                // A routine replaces the headline's text; the parser only
                // ever adds it, so a removal is the routine's first touch.
                if (r.type === 'childList' && r.target === headline && r.removedNodes.length > 0) times.headlineStart = now;
            }
        }).observe(document, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });
    }, theme);
    await page.setViewportSize({ width: 1280, height: 900 });
}

/** @param {import('@playwright/test').Page} page */
const readTimes = (page) =>
    // @ts-ignore
    page.evaluate(() => ({ ...window.kpOrder }));

for (const [channel, url] of CHANNELS) {
    test.describe(`the headline reveal after the arrival, ${channel}`, { tag: ['@component:page-effects', '@component:examples'] }, () => {
        for (const theme of INTRO_THEMES) {
            test(`${theme}: the headline reveal starts once the arrival overlay is removed [scope-86]`, async ({ page }) => {
                await instrument(page, theme);
                await page.goto(url);
                await page.waitForFunction(() => document.documentElement.getAttribute('data-theme') !== null);
                // The arrival plays out on its own timers, 1.2 to 1.9 s.
                await page.waitForFunction(
                    () => {
                        // @ts-ignore
                        const t = window.kpOrder;
                        return t.bootRemoved !== null && t.headlineStart !== null;
                    },
                    null,
                    { timeout: 8000 },
                );
                const t = await readTimes(page);
                expect(t.bootAdded, 'the arrival played').not.toBeNull();
                expect(t.headlineStart, `headline started ${t.headlineStart} ms, overlay removed ${t.bootRemoved} ms`).toBeGreaterThanOrEqual(
                    /** @type {number} */ (t.bootRemoved),
                );
                await expect(page.locator('[data-kp-reveal="headline"]').first()).toHaveAttribute('data-kp-reveal-state', 'played', {
                    timeout: 5000,
                });
            });
        }

        test('synthwave: with the arrival skipped, the headline reveal starts right after [scope-86]', async ({ page }) => {
            await instrument(page, 'synthwave');
            await page.goto(url);
            await page.locator('.kp-boot__skip').click();
            await page.waitForFunction(
                () => {
                    // @ts-ignore
                    const t = window.kpOrder;
                    return t.bootRemoved !== null && t.headlineStart !== null;
                },
                null,
                { timeout: 5000 },
            );
            const t = await readTimes(page);
            const gap = /** @type {number} */ (t.headlineStart) - /** @type {number} */ (t.bootRemoved);
            expect(gap, `headline started ${t.headlineStart} ms, overlay removed ${t.bootRemoved} ms`).toBeGreaterThanOrEqual(0);
            expect(gap).toBeLessThan(250);
        });

        test('synthwave, seen this session: no arrival, and the headline is not held back [scope-86]', async ({ page }) => {
            await instrument(page, 'synthwave');
            await page.goto(url);
            await page.locator('.kp-boot__skip').click();
            await expect(page.locator('.kp-boot')).toHaveCount(0, { timeout: 3000 });
            await page.reload();
            await expect(page.locator('[data-kp-surface="app"]').first()).toBeVisible();
            expect(await page.locator('.kp-boot').count()).toBe(0);
            // Seen this session: the headline rests at once, as before.
            await expect(page.locator('[data-kp-reveal="headline"]').first()).toHaveAttribute('data-kp-reveal-state', 'rest', { timeout: 2000 });
        });

        test('cyberpunk has no arrival, and its headline reveal starts as the module attaches [scope-86]', async ({ page }) => {
            await instrument(page, 'cyberpunk');
            await page.goto(url);
            await page.waitForFunction(
                () => {
                    // @ts-ignore
                    return window.kpOrder.headlineStart !== null;
                },
                null,
                { timeout: 5000 },
            );
            const t = await readTimes(page);
            const attached = await page.evaluate(() => performance.getEntriesByType('navigation')[0].toJSON().domContentLoadedEventEnd);
            expect(t.bootAdded, 'no arrival').toBeNull();
            // The module attaches at DOMContentLoaded (framework-free) or at
            // the first render (React); the decipher starts in that same task.
            expect(
                /** @type {number} */ (t.headlineStart) - attached,
                `headline started ${t.headlineStart} ms, DOMContentLoaded ${attached} ms`,
            ).toBeLessThan(600);
        });
    });
}

// The help drawer and the guided tour, in the browser [scope-143].
//
// Two tests that lock the rules of the homelab port spec's list I.3.7 on
// catalogue/overlays.html#drawer and #help-tour: the tour end to end at
// 1280 px (I.3.7 1 to 4, 6, 7), and the phone width (I.3.7 5, the drawer at
// the end edge, a tour from Help handing the focus back to Help, a tour over
// the phone pane's tab bar). The pure halves are gates/tour.test.mjs.

import { test, expect } from '@playwright/test';
import { waitForJudging } from './helpers/catalogue.mjs';
import { useEmptyRegister } from './helpers/empty-register.mjs';
import { autoReady } from './helpers/auto-ready.mjs';

/** The live target, not the frozen copy the block shows for the eye. */
const TARGET = '[data-kp-tour-target]:not([aria-label="Areas, frozen"])';
const CARD = 'dialog.kp-tour';

/** @param {import('@playwright/test').Page} page @param {{ width: number, height: number }} size @param {string} [query] */
const open = async (page, size, query = '') => {
    await page.setViewportSize(size);
    await useEmptyRegister(page.context());
    await page.goto(`/catalogue/overlays.html${query}`);
    await waitForJudging(page);
    await autoReady(page);
};

/** The card against its target and the window: the gap, whether it covers it, the target in view, the two side gutters. @param {import('@playwright/test').Page} page */
const placement = (page) =>
    page.evaluate((selector) => {
        const c = /** @type {Element} */ (document.querySelector('dialog.kp-tour')).getBoundingClientRect();
        const t = /** @type {Element} */ (document.querySelector(selector)).getBoundingClientRect();
        return {
            gap: Math.round((c.top >= t.bottom ? c.top - t.bottom : t.top - c.bottom) * 2) / 2,
            covers: !(c.bottom <= t.top || c.top >= t.bottom || c.right <= t.left || c.left >= t.right),
            inView: t.top >= -0.5 && t.bottom <= window.innerHeight + 0.5,
            gutters: [Math.round(c.left), Math.round(window.innerWidth - c.right)],
        };
    }, TARGET);

test(
    'the tour end to end: an exact count, the card 12 px from its ringed target and following it, Esc, memory, decorate, ?tour (I.3.7 1-4, 6, 7) [scope-143]',
    { tag: ['@component:overlays', '@component:catalogue'] },
    async ({ page }) => {
        await open(page, { width: 1280, height: 800 });
        // Automated: it does not start by itself.
        await expect(page.locator(CARD)).toHaveCount(0);
        await expect(page.locator('[data-cat-tour-log]')).toContainText('driven by a script');
        await page.locator('[data-cat-tour="start"]').click();
        await expect(page.locator(`${CARD} .kp-tour__count`)).toHaveText('1 of 5');
        let at = await placement(page);
        expect([at.gap, at.covers, at.inView]).toEqual([12, false, true]);
        const look = await page
            .locator(TARGET)
            .evaluate((el) => [getComputedStyle(el).outlineStyle, /\b\d{3,}px\b/.test(getComputedStyle(el).boxShadow)]);
        expect(look, 'a ring, and the rest of the page dimmed').toEqual(['solid', true]);
        await page.evaluate(() => window.scrollBy(0, 200));
        await expect.poll(async () => (await placement(page)).gap).toBe(12);
        for (const n of [2, 3, 4, 5]) {
            await page.locator(`${CARD} .kp-button--primary`).click();
            await expect(page.locator(`${CARD} .kp-tour__count`)).toHaveText(`${n} of 5`);
        }
        await expect(page.locator(`${CARD} .kp-button--primary`)).toHaveText('Done');
        at = await placement(page);
        expect([at.gap, at.covers]).toEqual([12, false]);
        await page.keyboard.press('Escape');
        await expect(page.locator(CARD)).toHaveCount(0);
        await expect(page.locator('[data-cat-tour="start"]')).toBeFocused();
        expect(await page.evaluate(() => localStorage.getItem('kp-remember:tour:catalogue:done'))).toBe('true');
        // decorate gets the three buttons; no step on the page means no tour.
        const api = await page.evaluate(() =>
            import('/js/tour.js').then(({ startTour }) => {
                /** @type {string[]} */
                const kinds = [];
                startTour([{ target: '[data-cat-tour-step="readings"]', title: 'Readings', text: 'Today.' }], {
                    decorate: (_, info) => kinds.push(info.kind),
                })?.end();
                return { kinds: kinds.sort(), none: startTour([{ target: '#no-such-part', title: 'a', text: 'b' }]) };
            }),
        );
        expect(api).toEqual({ kinds: ['tour-back', 'tour-next', 'tour-skip'], none: null });
        // ?tour always starts it, remembered or not.
        await open(page, { width: 1280, height: 800 }, '?tour');
        await expect(page.locator(`${CARD} .kp-tour__count`)).toHaveText('1 of 5');
    },
);

test(
    'on a phone: the card 16 px from both edges, the drawer at the end edge at full height, Help gets the focus back, the tab bar toured (I.3.7 5) [scope-143]',
    { tag: ['@component:overlays', '@component:catalogue'] },
    async ({ page }) => {
        await open(page, { width: 390, height: 844 });
        await page.locator('[data-cat-tour="start"]').click();
        await expect(page.locator(CARD)).toBeVisible();
        expect((await placement(page)).gutters).toEqual([16, 16]);
        await page.keyboard.press('Escape');
        // The drawer: the end edge, the full height, the foot at the bottom, each word over its meaning.
        const help = page.locator('#drawer [data-kp-dialog="ov-dr-help"]');
        await help.click();
        const box = await page.locator('#ov-dr-help').evaluate((el) => {
            const d = el.getBoundingClientRect();
            const foot = /** @type {Element} */ (el.querySelector('.kp-drawer__foot')).getBoundingClientRect();
            return [
                Math.round(window.innerWidth - d.right),
                Math.round(d.top),
                Math.round(window.innerHeight - d.bottom),
                Math.round(window.innerHeight - foot.bottom),
            ];
        });
        expect(box).toEqual([0, 0, 0, 0]);
        // A tour from Help hands the focus back to the Help button.
        await page.locator('#ov-dr-help [data-cat-tour="help"]').click();
        await expect(page.locator(CARD)).toBeVisible();
        await page.keyboard.press('Escape');
        await expect(help).toBeFocused();
        // The tour over the phone pane reaches its tab bar, the card beside it, not on it.
        await page.locator('[data-cat-tour="phone"]').click();
        await expect(page.locator(TARGET)).toHaveAttribute('data-cat-tour-phone', 'areas');
        const at = await placement(page);
        expect([at.gap, at.covers]).toEqual([12, false]);
        expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBe(0);
    },
);

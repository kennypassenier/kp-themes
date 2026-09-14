// A bar's dropdown stays in the window, and the mega menu [fix-27, scope-48].
//
// fix-27, Kenny's note on catalogue/navigation.html, grotesk, 2026-09-14: the
// dropdown under the last bar item ran past the window's right edge. The
// panel hung from its item's start edge whatever lay beyond it. What holds
// now, in every theme and both channels: the dropdown under the last item of
// a bar whose links sit at the window's end, opened by hovering its link,
// lies inside the window — at 1400px and at 420px — and so does the mega
// menu's wide panel under its button, which lines up with the bar's edges.
//
// The mega menu (scope-48, wave 2; research/navbar/README.md, "Mega menu"
// and its accessibility row): a `data-kp-nav-disclosure` button with
// `aria-expanded` and `aria-controls`, a panel of plain lists with headings,
// opened by a press and never by hovering, closed by the button, by Escape
// (the focus back on the button) and by a click outside; Tab walks its
// links; one panel open at a time. Every assertion reads the paint — a
// panel is open when it has a box, not when it has an attribute [KT13].

import { expect, test } from '@playwright/test';
import { THEMES } from '../js/theme-registry.js';

const FIXTURE = '/tests/fixtures/nav-menu.html';

/** The two channels, by the prefix their test names carry. */
const CHANNELS = ['free', 'react'];

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

/** @param {import('@playwright/test').Page} page @param {string} channel */
const parts = (page, channel) => {
    const root = page.locator(`[data-test="${channel}"]`);
    const items = root.locator('.kp-nav__links > li');
    return {
        nav: root.locator('.kp-nav'),
        last: items.last(),
        lastLink: items.last().locator('> .kp-nav__link'),
        menu: items.last().locator('> .kp-nav__menu'),
        button: items.nth(1).locator('> [data-kp-nav-disclosure]'),
        panel: items.nth(1).locator('> .kp-nav__menu--wide'),
        button2: items.nth(2).locator('> [data-kp-nav-disclosure]'),
        panel2: items.nth(2).locator('> .kp-nav__menu--wide'),
        firstLink: items.nth(1).locator('> .kp-nav__menu--wide a').first(),
        lastPanelLink: items.nth(1).locator('> .kp-nav__menu--wide a').last(),
        outside: page.locator(`[data-test="${channel}-outside"]`),
    };
};

/** A box's painted height: 0 when it is not displayed. @param {import('@playwright/test').Locator} locator */
const painted = (locator) => expect.poll(() => locator.evaluate((el) => el.getBoundingClientRect().height));

/**
 * Where a box lies against the window, or why it is not measured.
 *
 * @param {import('@playwright/test').Locator} locator
 * @returns {Promise<string | null>} null when inside
 */
const outsideWindow = (locator) =>
    locator.evaluate(async (el) => {
        // The box is displayed a frame after the hover at the latest.
        for (let i = 0; i < 20 && el.getBoundingClientRect().width === 0; i++) await new Promise((r) => requestAnimationFrame(r));
        const box = el.getBoundingClientRect();
        const view = document.documentElement.clientWidth;
        if (box.width === 0) return 'not painted';
        if (box.left < -0.5) return `${(-box.left).toFixed(1)}px past the left edge`;
        if (box.right > view + 0.5)
            return `${(box.right - view).toFixed(1)}px past the right edge (${Math.round(box.left)}–${Math.round(box.right)} of ${view})`;
        return null;
    });

test(
    'the dropdown under a bar’s last item, and the mega menu’s panel, stay inside the window in every theme, both channels [fix-27]',
    { tag: ['@component:navigation', '@sweep'] },
    async ({ page }) => {
        test.setTimeout(240_000);
        await page.emulateMedia({ reducedMotion: 'reduce' });
        await page.setViewportSize({ width: 1400, height: 900 });
        await page.goto(FIXTURE);
        await expect(page.locator('[data-test="react"] .kp-nav')).toBeVisible();
        await loadEveryRegister(page);
        /** @type {string[]} */
        const faults = [];
        for (const width of [1400, 420]) {
            await page.setViewportSize({ width, height: 900 });
            for (const theme of THEMES) {
                await page.evaluate((name) => document.documentElement.setAttribute('data-theme', name), theme.name);
                for (const channel of CHANNELS) {
                    const { lastLink, menu, button, panel } = parts(page, channel);
                    await page.mouse.move(0, 890);
                    await lastLink.hover();
                    const menuFault = await outsideWindow(menu);
                    if (menuFault) faults.push(`${theme.name}, ${width}px, ${channel}: the dropdown lies ${menuFault}`);
                    await page.mouse.move(0, 890);
                    // The panel only exists once the mega menu does; before it,
                    // the dropdown alone is what this measures.
                    if ((await button.count()) === 0 || (await button.getAttribute('aria-expanded')) === null) continue;
                    await button.click();
                    const panelFault = await outsideWindow(panel);
                    if (panelFault) faults.push(`${theme.name}, ${width}px, ${channel}: the mega menu's panel lies ${panelFault}`);
                    const span = await panel.evaluate((el) => {
                        const box = el.getBoundingClientRect();
                        const bar = /** @type {Element} */ (el.closest('.kp-nav')).getBoundingClientRect();
                        return Math.max(Math.abs(box.left - bar.left), Math.abs(box.right - bar.right));
                    });
                    if (span > 1.5)
                        faults.push(`${theme.name}, ${width}px, ${channel}: the mega menu's panel misses the bar's edges by ${span.toFixed(1)}px`);
                    await button.click();
                    await page.evaluate(() => /** @type {HTMLElement | null} */ (document.activeElement)?.blur());
                }
            }
        }
        expect(faults).toEqual([]);
    },
);

test.describe('the mega menu', { tag: ['@component:navigation'] }, () => {
    test.beforeEach(async ({ page }) => {
        await page.emulateMedia({ reducedMotion: 'reduce' });
        await page.setViewportSize({ width: 1400, height: 900 });
        await page.goto(FIXTURE);
        await expect(page.locator('[data-test="react"] .kp-nav')).toBeVisible();
    });

    for (const channel of CHANNELS) {
        test(`${channel}: the button is a disclosure, closed, that names its panel [scope-48]`, async ({ page }) => {
            const { button, panel } = parts(page, channel);
            await expect(button).toHaveAttribute('aria-expanded', 'false');
            const id = await panel.getAttribute('id');
            expect(id, `${channel}: the panel has an id to be named by`).toBeTruthy();
            await expect(button).toHaveAttribute('aria-controls', /** @type {string} */ (id));
            expect(await panel.locator('[role="menu"], [role="menuitem"]').count(), `${channel}: plain lists, not a menu`).toBe(0);
            expect(await panel.locator('h2, h3, h4, h5, h6').count(), `${channel}: each group has its heading`).toBe(3);
            await painted(panel).toBe(0);
        });

        test(`${channel}: hovering does not open it; a press does, and a second press closes it [scope-48]`, async ({ page }) => {
            const { button, panel } = parts(page, channel);
            await button.hover();
            await page.waitForTimeout(100);
            await painted(panel).toBe(0);
            await button.click();
            await painted(panel).toBeGreaterThan(0);
            await expect(button).toHaveAttribute('aria-expanded', 'true');
            await button.click();
            await painted(panel).toBe(0);
            await expect(button).toHaveAttribute('aria-expanded', 'false');
        });

        test(`${channel}: the panel spans the bar, in columns [scope-48]`, async ({ page }) => {
            const { button, panel, nav } = parts(page, channel);
            await button.click();
            await painted(panel).toBeGreaterThan(0);
            const bar = await nav.evaluate((el) => el.getBoundingClientRect().width);
            const box = await panel.evaluate((el) => el.getBoundingClientRect().width);
            expect(box, `${channel}: the panel is the bar's width`).toBeGreaterThan(bar - 2);
            const columns = await panel.evaluate((el) => new Set([...el.children].map((g) => Math.round(g.getBoundingClientRect().left))).size);
            expect(columns, `${channel}: three groups side by side`).toBe(3);
        });

        test(`${channel}: the keyboard opens it, Tab walks its links, Escape closes it and returns the focus [scope-48]`, async ({ page }) => {
            const { button, panel, firstLink, lastPanelLink } = parts(page, channel);
            await button.focus();
            await painted(panel).toBe(0);
            await page.keyboard.press('Enter');
            await painted(panel).toBeGreaterThan(0);
            await page.keyboard.press('Tab');
            await expect(firstLink).toBeFocused();
            for (let i = 0; i < 5; i++) await page.keyboard.press('Tab');
            await expect(lastPanelLink).toBeFocused();
            await page.keyboard.press('Escape');
            await painted(panel).toBe(0);
            await expect(button).toBeFocused();
            await expect(button).toHaveAttribute('aria-expanded', 'false');
            await page.keyboard.press('Space');
            await painted(panel).toBeGreaterThan(0);
        });

        test(`${channel}: one panel open at a time [scope-48]`, async ({ page }) => {
            const { button, panel, button2, panel2 } = parts(page, channel);
            await button.click();
            await painted(panel).toBeGreaterThan(0);
            await button2.click();
            await painted(panel2).toBeGreaterThan(0);
            await painted(panel).toBe(0);
            await expect(button).toHaveAttribute('aria-expanded', 'false');
        });

        test(`${channel}: a click outside closes it [scope-48]`, async ({ page }) => {
            const { button, panel } = parts(page, channel);
            await button.click();
            await painted(panel).toBeGreaterThan(0);
            await page.mouse.click(700, 880);
            await painted(panel).toBe(0);
            await expect(button).toHaveAttribute('aria-expanded', 'false');
        });

        test(`${channel}: a click inside the panel leaves it open [scope-48]`, async ({ page }) => {
            const { button, panel } = parts(page, channel);
            await button.click();
            await painted(panel).toBeGreaterThan(0);
            await panel.locator('.kp-nav__menu-heading').first().click();
            await painted(panel).toBeGreaterThan(0);
        });
    }
});

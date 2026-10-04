// The menu button with its rich menu, in the browser [scope-143].
//
// Two tests that lock the rules of the homelab port spec's list B7 on
// catalogue/overlays.html#menu-button: the keyboard path end to end (B7 1 to
// 4, 6, 7), and every state keeping its row height inside the screen (B7 5,
// 8, 9 and B6: a refill that waits, loading, empty, twenty-four entries, the
// phone width). B7 10 (contrast in every theme) waits for each register
// (gates/register-pending.json). The pure halves are gates/menu-button.test.mjs.

import { test, expect } from '@playwright/test';
import { waitForJudging } from './helpers/catalogue.mjs';
import { useEmptyRegister } from './helpers/empty-register.mjs';
import { autoReady } from './helpers/auto-ready.mjs';

const OWN = '#menu-button [data-kp-key="pump-house-own"]';

/** @param {import('@playwright/test').Page} page @param {{ width: number, height: number }} size */
const open = async (page, size) => {
    await page.setViewportSize(size);
    await useEmptyRegister(page.context());
    await page.goto('/catalogue/overlays.html');
    await waitForJudging(page);
    await autoReady(page);
};

/** @param {import('@playwright/test').Page} page */
const focusedLabel = (page) => page.evaluate(() => document.activeElement?.querySelector('.kp-menu__label')?.textContent ?? '');

test(
    'the keys of a menu, end to end: open, move, a disabled entry that says why, Esc, Tab and a pick (B7 1-4, 6, 7) [scope-143]',
    { tag: ['@component:overlays', '@component:catalogue'] },
    async ({ page }) => {
        await open(page, { width: 1280, height: 800 });
        await page.evaluate(() => {
            const w = /** @type {any} */ (window);
            w.__escapes = 0;
            w.__picks = [];
            document.addEventListener('keydown', (e) => e.key === 'Escape' && (w.__escapes += 1));
            document.addEventListener('kp-menu-select', (e) => w.__picks.push(/** @type {CustomEvent} */ (e).detail.value));
        });
        const button = page.locator(`${OWN} > button`);
        const menu = page.locator(`${OWN} > [role="menu"]`);
        await button.focus();
        await page.keyboard.press('ArrowDown');
        await expect(menu).toBeVisible();
        expect(await focusedLabel(page)).toBe('Restart the pumps');
        // The disabled entry takes the focus, keeps its hint and says why under it; Enter does nothing.
        await page.keyboard.press('r');
        expect(await focusedLabel(page)).toBe('Run a pressure test');
        const described = await page.evaluate(() => ({
            disabled: document.activeElement?.getAttribute('aria-disabled'),
            words: (document.activeElement?.getAttribute('aria-describedby') ?? '')
                .split(' ')
                .map((id) => document.getElementById(id)?.textContent)
                .join(' | '),
        }));
        expect(described).toEqual({
            disabled: 'true',
            words: 'Close the ring main valve and measure for ten minutes | Not while a field engineer is on site',
        });
        await page.keyboard.press('Enter');
        await expect(menu).toBeVisible();
        await page.keyboard.press('End');
        expect(await focusedLabel(page)).toBe('Archive this pump house…');
        await page.keyboard.press('ArrowDown');
        expect(await focusedLabel(page)).toBe('Restart the pumps');
        // Each group is a role=group named by its heading, in small capitals.
        const groups = await menu.evaluate((m) =>
            [...m.querySelectorAll('[role="group"]')].map((g) => {
                const h = /** @type {HTMLElement} */ (document.getElementById(g.getAttribute('aria-labelledby') ?? ''));
                return `${h.textContent}:${getComputedStyle(h).textTransform}`;
            }),
        );
        expect(groups).toEqual(['Run:uppercase', 'Readings:uppercase', 'Records:uppercase']);
        // Esc is the menu's own: the page's listener hears nothing, and the focus is back on the button.
        await page.keyboard.press('Escape');
        await expect(menu).toBeHidden();
        await expect(button).toBeFocused();
        // Tab closes it and moves on past the button.
        await page.keyboard.press('ArrowDown');
        await page.keyboard.press('Tab');
        await expect(menu).toBeHidden();
        expect(
            await page.evaluate((selector) => {
                const wrapper = /** @type {Element} */ (document.querySelector(selector));
                const a = document.activeElement;
                return !!a && !wrapper.contains(a) && !!(wrapper.compareDocumentPosition(a) & Node.DOCUMENT_POSITION_FOLLOWING);
            }, OWN),
        ).toBe(true);
        // A click outside closes it; a click on an entry picks it and closes it.
        await button.click();
        await page.mouse.click(2, 2);
        await expect(menu).toBeHidden();
        await button.click();
        await menu.locator('[role="menuitem"]', { hasText: 'Switch to the spare pump' }).click();
        await expect(menu).toBeHidden();
        expect(await page.evaluate(() => [/** @type {any} */ (window).__escapes, /** @type {any} */ (window).__picks])).toEqual([0, ['spare']]);
    },
);

test(
    'every state keeps a real row’s height inside the screen: a refill waits, loading, empty, twenty-four, a phone (B7 5, 8, 9; B6) [scope-143]',
    { tag: ['@component:overlays', '@component:catalogue'] },
    async ({ page }) => {
        await open(page, { width: 390, height: 844 });
        const button = page.locator(`${OWN} > button`);
        const items = page.locator(`${OWN} [role="menuitem"]`);
        // A refill while open waits until the menu closes; decorate is handed the button and the new entries.
        await button.click();
        const row = (await items.first().boundingBox())?.height ?? 0;
        const decorated = await page.evaluate(
            (selector) =>
                import('/js/menu-button.js').then(({ attachMenuButtons, setMenu }) => {
                    /** @type {string[]} */
                    const kinds = [];
                    const host = document.createElement('div');
                    host.innerHTML =
                        '<div class="kp-menu-button" data-kp-menu-button data-kp-key="probe"><button type="button">More ▾</button><div class="kp-menu kp-menu--rich" role="menu" aria-label="Probe"></div></div>';
                    document.body.append(host);
                    const detach = attachMenuButtons(host, { decorate: (_, info) => kinds.push(`${info.kind}:${info.index ?? ''}`) });
                    setMenu(/** @type {Element} */ (host.firstElementChild), [{ group: 'Run', items: [{ label: 'A' }, { label: 'B' }] }]);
                    detach();
                    host.remove();
                    setMenu(/** @type {Element} */ (document.querySelector(selector)), [
                        { group: 'Run', items: [{ label: 'Silence the door alarm', hint: 'For one hour' }] },
                    ]);
                    return kinds;
                }),
            OWN,
        );
        expect(decorated).toEqual(['menu-button:', 'menu-item:0', 'menu-item:1']);
        await expect(items).toHaveCount(7);
        await page.keyboard.press('Escape');
        await expect(items).toHaveCount(1);
        // In a narrow page header the open menu spans the actions, with no sideways scroll.
        for (const key of ['pump-house-more', 'pump-house-more-phone']) {
            const wrapper = `#menu-button [data-kp-key="${key}"]`;
            await page.locator(`${wrapper} > button`).click();
            const edges = await page.evaluate((selector) => {
                const m = /** @type {Element} */ (document.querySelector(`${selector} > [role="menu"]`)).getBoundingClientRect();
                const a = /** @type {Element} */ (
                    /** @type {Element} */ (document.querySelector(selector)).closest('.kp-page-header__actions')
                ).getBoundingClientRect();
                return [
                    Math.abs(m.left - a.left) <= 1,
                    Math.abs(m.right - a.right) <= 1,
                    document.documentElement.scrollWidth - document.documentElement.clientWidth,
                ];
            }, wrapper);
            expect(edges, key).toEqual([true, true, 0]);
            await page.keyboard.press('Escape');
        }
        // Loading: one grey entry at a real row's height.
        await page.locator('#menu-button [data-cat-menu="loading"]').click();
        await button.click();
        const loading = page.locator(`${OWN} [data-kp-loading]`);
        await expect(loading).toHaveAttribute('aria-disabled', 'true');
        expect(Math.abs(((await loading.boundingBox())?.height ?? 0) - row)).toBeLessThanOrEqual(1);
        await page.keyboard.press('Escape');
        // Twenty-four: the menu scrolls inside itself and End keeps the focus in view.
        await page.locator('#menu-button [data-cat-menu="many"]').click();
        await button.focus();
        await page.keyboard.press('ArrowDown');
        await page.keyboard.press('End');
        expect(
            await page.evaluate((selector) => {
                const menu = /** @type {HTMLElement} */ (document.querySelector(`${selector} > [role="menu"]`));
                const a = /** @type {Element} */ (document.activeElement).getBoundingClientRect();
                const m = menu.getBoundingClientRect();
                return [menu.scrollHeight > menu.clientHeight + 1, a.top >= m.top - 1 && a.bottom <= m.bottom + 1];
            }, OWN),
        ).toEqual([true, true]);
        await page.keyboard.press('Escape');
        // Empty: the button stays grey and says why; `data-kp-menu-empty="hide"` takes the phone one away.
        await page.locator('#menu-button [data-cat-menu="empty"]').click();
        await expect(button).toHaveAttribute('aria-disabled', 'true');
        await expect(button).toHaveAttribute('title', 'Nothing to do here right now.');
        await expect(page.locator('#menu-button [data-kp-key="pump-house-more-phone"]')).toBeHidden();
        // One entry has no heading.
        await expect(page.locator('#menu-button [data-kp-key="reservoir-more"] .kp-menu__heading')).toHaveCount(0);
    },
);

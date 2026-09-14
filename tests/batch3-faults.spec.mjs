// The faults of catalogue batch 3 that Kenny approved on 2026-09-13 [gap-12].
//
// Four groups — the nav and the tabs, the structure components, the copy
// button and back-to-top, and the attributes a page attaches without
// React. Every test here was run on the code before its repair and was
// red for the reason it names; the number in each comment is what that
// run measured.
//
// Most of them sweep all twenty-two themes on the catalogue page the fault
// was found on, because most of these faults were a register in a later
// cascade layer beating a state the components layer declared — and a
// sweep over one theme would have called that green.
//
// Every assertion reads what the browser painted, never the attribute the
// test or the module wrote [KT13], and reads it until it is the value
// [KT16]: a sweep is polled as a whole.

import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';
import { waitForJudging } from './helpers/catalogue.mjs';
import { useEmptyRegister } from './helpers/empty-register.mjs';
import { measured } from './paint.mjs';

const THEMES = /** @type {string[]} */ (JSON.parse(readFileSync(new globalThis.URL('../themes/order.json', import.meta.url), 'utf8')));

/**
 * Run `probe` in the page under every theme and collect what it reports.
 * The probe returns null when the theme is right, or a sentence saying
 * what it painted instead. Polled as a whole [KT16].
 *
 * @param {import('@playwright/test').Page} page
 * @param {(arg: any) => string | null} probe
 * @param {any} [arg]
 */
const sweep = (page, probe, arg) =>
    expect
        .poll(
            async () => {
                const faults = [];
                for (const theme of THEMES) {
                    await page.evaluate((name) => document.documentElement.setAttribute('data-theme', name), theme);
                    const fault = await page.evaluate(probe, arg);
                    if (fault) faults.push(`${theme}: ${fault}`);
                }
                return faults;
            },
            { timeout: 15000 },
        )
        .toEqual([]);

/** Everything a state could be told apart by, as one string. Runs in the page. */
const PAINT = `(el) => {
    const c = getComputedStyle(el);
    return [c.backgroundColor, c.backgroundImage, c.color, c.fontWeight, c.fontStyle, c.textDecorationLine, c.boxShadow,
        c.borderTopColor, c.borderTopStyle, c.borderTopWidth, c.borderInlineStartColor, c.borderInlineStartWidth,
        c.outlineStyle, c.outlineColor, c.opacity, c.transform, c.translate].join(' | ');
}`;

test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    // The catalogue pages hide a block once it is judged; these tests read the
    // blocks, whatever the committed register says about them.
    await useEmptyRegister(page.context());
});

// --- 1 · The nav dropdown and the tab row ----------------------------------

test('a nav dropdown declared open with data-kp-nav-menu-open is painted open in every theme, and closes when the declaration goes [gap-12]', async ({
    page,
}) => {
    // Before: the panel opened only on :hover and :focus-within, so a page had no way to show it open — 0px tall with the attribute set, all 22 themes.
    await page.goto('/catalogue/navigation.html');
    await page.mouse.move(1, 1);
    const item = page.locator('#dropdown .kp-nav__links > li:has(> .kp-nav__menu)').first();
    const menu = item.locator(':scope > .kp-nav__menu');
    await item.evaluate((el) => el.removeAttribute('data-kp-nav-menu-open'));
    await measured(menu, (el) => el.getBoundingClientRect().height, undefined, 'closed with nothing declared').toBe(0);

    await item.evaluate((el) => el.setAttribute('data-kp-nav-menu-open', ''));
    await sweep(page, () => {
        const panel = /** @type {HTMLElement} */ (document.querySelector('#dropdown .kp-nav__menu'));
        const item = /** @type {HTMLElement} */ (panel.parentElement);
        const box = panel.getBoundingClientRect();
        const style = getComputedStyle(panel);
        if (box.height === 0) return 'not painted';
        if (style.opacity !== '1') return `opacity ${style.opacity}`;
        if (!['none', '0px', '0px 0px'].includes(style.translate)) return `still shifted by ${style.translate}, the closed position`;
        // Where hover puts it: under its item, over the stage rather than in the flow.
        if (Math.abs(box.top - item.getBoundingClientRect().bottom) > 1)
            return `${Math.round(box.top - item.getBoundingClientRect().bottom)}px from its item`;
        if (style.position !== 'absolute') return `position ${style.position}`;
        return null;
    });

    // The way out is the declaration itself [KT6].
    await item.evaluate((el) => el.removeAttribute('data-kp-nav-menu-open'));
    await measured(menu, (el) => el.getBoundingClientRect().height, undefined, 'closed again once the declaration is gone').toBe(0);
});

test('the selected tab is scrolled into view when it changes from outside [gap-12]', async ({ page }) => {
    // Before: selectTab(list, 8) left the ninth tab at 1030px against a row that ends at 686px.
    await page.goto('/catalogue/navigation.html');
    const list = page.locator('#tabs-many [role="tablist"]');
    /** @param {number} index */
    const inView = (index) =>
        measured(
            list,
            (el, i) => {
                const tab = el.querySelectorAll('[role="tab"]')[i].getBoundingClientRect();
                const row = el.getBoundingClientRect();
                return tab.left >= row.left - 0.5 && tab.right <= row.right + 0.5;
            },
            index,
            `tab ${index + 1} is inside the row`,
        ).toBe(true);

    for (const index of [8, 0, 5]) {
        await page.evaluate(async (i) => {
            const { selectTab } = await import('/js/overlays.js');
            selectTab(/** @type {Element} */ (document.querySelector('#tabs-many [role="tablist"]')), i);
        }, index);
        await inView(index);
    }
});

// --- 2 · Structure ---------------------------------------------------------

test('a horizontal split stacks its panes with a horizontal separator in every theme, and the arrows move it [gap-12]', async ({ page }) => {
    // Before: data-kp-orientation="horizontal" laid out as columns — panes side by side at x 286 and 770, the separator 10px wide and 222px tall.
    await page.goto('/catalogue/structure.html');
    await sweep(page, () => {
        const split = /** @type {HTMLElement} */ (document.querySelectorAll('#split .kp-split')[1]);
        const [first, second] = [...split.querySelectorAll('.kp-split__pane')].map((el) => el.getBoundingClientRect());
        const bar = /** @type {HTMLElement} */ (split.querySelector('.kp-split__separator')).getBoundingClientRect();
        const whole = split.getBoundingClientRect();
        const faults = [];
        if (!(bar.top >= first.bottom - 1 && second.top >= bar.bottom - 1)) faults.push('the panes are not above and below the separator');
        if (bar.width < whole.width * 0.9) faults.push(`the separator is ${Math.round(bar.width)}px wide in a ${Math.round(whole.width)}px split`);
        if (bar.height < 1 || bar.height > 16) faults.push(`the separator is ${Math.round(bar.height)}px tall`);
        return faults.length ? faults.join('; ') : null;
    });

    await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'formal'));
    const firstPane = page.locator('#split .kp-split').nth(1).locator('.kp-split__pane').first();
    const before = await firstPane.evaluate((el) => el.getBoundingClientRect().height);
    await page.locator('#split .kp-split').nth(1).locator('.kp-split__separator').focus();
    await page.keyboard.press('Shift+ArrowDown');
    await measured(firstPane, (el) => el.getBoundingClientRect().height, undefined, 'Shift+Down makes the top pane taller').toBeGreaterThan(
        before + 5,
    );
});

test('a row being dragged is visibly marked in every theme, and the mark goes on release [gap-12]', async ({ page }) => {
    // Before: the row under a held handle (data-kp-dragging, written by the module) painted exactly like it did at rest, all 22 themes.
    await page.goto('/catalogue/structure.html');
    await waitForJudging(page);
    const row = page.locator('#reorder [data-kp-item="pressure"]');
    const handle = row.locator('[data-kp-handle]');
    const faults = [];
    for (const theme of THEMES) {
        await page.evaluate((name) => document.documentElement.setAttribute('data-theme', name), theme);
        // In the middle of the window, and the handle itself under the pointer. A
        // theme changes the page's height, and scrollIntoViewIfNeeded counts a
        // handle as in view while the catalogue's two sticky bars cover it: from
        // forest on the pointer pressed the review count, and in high-contrast
        // the bar's home link, which left the page (measured 2026-09-14).
        await row.evaluate((el) => el.scrollIntoView({ block: 'center' }));
        await handle.hover();
        const box = /** @type {{ x: number, y: number, width: number, height: number }} */ (await handle.boundingBox());
        await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
        expect(
            await page.evaluate(
                ([x, y]) => document.elementFromPoint(x, y)?.closest('[data-kp-handle]') !== null,
                [box.x + box.width / 2, box.y + box.height / 2],
            ),
            `${theme}: the pointer is on the handle`,
        ).toBe(true);
        const rest = await row.evaluate((el, paint) => eval(paint)(el), PAINT);
        await page.mouse.down();
        await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2 + 1);
        let held = rest;
        for (let attempt = 0; attempt < 10 && held === rest; attempt++) {
            await page.waitForTimeout(30);
            held = await row.evaluate((el, paint) => eval(paint)(el), PAINT);
        }
        await page.mouse.up();
        if (held === rest) faults.push(theme);
        await measured(row, (el, paint) => eval(paint)(el), PAINT, `${theme}: the mark goes on release`).toBe(rest);
    }
    expect(faults).toEqual([]);
});

test('the wizard says why it refuses Next when it is not inside a form, and the message goes once the field is filled [gap-12]', async ({ page }) => {
    // Before: Next was refused with the error holder still hidden and empty (0px tall) and no aria-invalid, because only js/forms.js writes the message and it listens inside form[data-kp-form] alone.
    await page.goto('/catalogue/structure.html');
    const wizard = page.locator('#wizard-live .kp-wizard');
    const field = wizard.locator('#st-live-ref');
    const error = wizard.locator('[data-kp-field-error]');

    await wizard.locator('[data-kp-wizard-next]').click();
    await measured(error, (el) => el.getBoundingClientRect().height, undefined, 'the message is painted').toBeGreaterThan(0);
    await measured(error, (el) => el.textContent?.trim().length ?? 0, undefined, 'and says something').toBeGreaterThan(0);
    await expect(field).toBeFocused();
    await expect(field).toHaveAttribute('aria-invalid', 'true');
    await expect(wizard.locator('[data-kp-step-label]').first()).toHaveAttribute('aria-current', 'step');

    // The way out: filling the field takes the message away [KT6].
    await field.fill('INC-4471');
    await measured(error, (el) => el.getBoundingClientRect().height, undefined, 'the message goes once the field is valid').toBe(0);
    await wizard.locator('[data-kp-wizard-next]').click();
    await measured(
        wizard.locator('[data-kp-step]').nth(1),
        (el) => el.getBoundingClientRect().height,
        undefined,
        'and Next moves on',
    ).toBeGreaterThan(0);
});

// --- 3 · The copy button ---------------------------------------------------

// --- 4 · Attached without React --------------------------------------------

test('data-kp-sidenav-slim-toggle collapses and expands the slim rail it controls, says which, and fires the slim event [gap-12]', async ({
    page,
}) => {
    // Before: a button carrying the attribute did nothing — the rail stayed at its full width, no event, no aria-expanded.
    await page.goto('/catalogue/navigation.html');
    await page.evaluate(() => {
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = 'Rail';
        button.id = 'test-slim-toggle';
        button.setAttribute('data-kp-sidenav-slim-toggle', '');
        button.setAttribute('aria-controls', 'nv-slim-c');
        document.querySelector('#sidenav-slim')?.append(button);
        /** @type {any} */ (window).slimEvents = [];
        document
            .getElementById('nv-slim-c')
            ?.addEventListener('kp-sidenav-slim', (event) =>
                /** @type {any} */ (window).slimEvents.push(/** @type {CustomEvent} */ (event).detail.collapsed),
            );
    });
    const rail = page.locator('#nv-slim-c');
    const button = page.locator('#test-slim-toggle');
    const full = await rail.evaluate((el) => el.getBoundingClientRect().width);

    await button.click();
    await measured(rail, (el) => el.getBoundingClientRect().width, undefined, 'collapsed: narrower').toBeLessThan(full - 40);
    await expect(button).toHaveAttribute('aria-expanded', 'false');

    await button.click();
    await measured(rail, (el) => el.getBoundingClientRect().width, undefined, 'expanded again: the full width').toBeGreaterThan(full - 1);
    await expect(button).toHaveAttribute('aria-expanded', 'true');
    expect(await page.evaluate(() => /** @type {any} */ (window).slimEvents)).toEqual([true, false]);

    // A toggle that names another panel leaves this one alone.
    const other = page.locator('#nv-slim-a');
    const otherWidth = await other.evaluate((el) => el.getBoundingClientRect().width);
    await button.click();
    await measured(other, (el) => el.getBoundingClientRect().width, undefined, 'the rail it does not control is untouched').toBe(otherWidth);
});

test('data-kp-palette-open opens the command palette through its own open, so the open event fires and the list is filtered [gap-12]', async ({
    page,
}) => {
    // Before: a button carrying the attribute did nothing — the dialog stayed closed and kp-palette-open never fired.
    await page.goto('/catalogue/page.html');
    await page.evaluate(() => {
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = 'Commands';
        button.id = 'test-palette-open';
        button.setAttribute('data-kp-palette-open', 'pg-pal-live');
        document.querySelector('#palette')?.append(button);
        /** @type {any} */ (window).paletteEvents = [];
        document
            .getElementById('pg-pal-live')
            ?.addEventListener('kp-palette-open', (event) =>
                /** @type {any} */ (window).paletteEvents.push(/** @type {CustomEvent} */ (event).detail.open),
            );
    });
    const dialog = page.locator('#pg-pal-live');
    await page.locator('#test-palette-open').click();
    await measured(dialog, (el) => el.getBoundingClientRect().height, undefined, 'the palette is painted').toBeGreaterThan(0);
    await expect(dialog.locator('.kp-palette__input')).toBeFocused();
    await expect(dialog.locator('.kp-palette__status')).toHaveText(/\d+ commands?/);
    expect(await page.evaluate(() => /** @type {any} */ (window).paletteEvents)).toEqual([true]);

    await page.keyboard.press('Escape');
    await measured(dialog, (el) => el.getBoundingClientRect().height, undefined, 'Escape closes it').toBe(0);
    expect(await page.evaluate(() => /** @type {any} */ (window).paletteEvents)).toEqual([true, false]);
});

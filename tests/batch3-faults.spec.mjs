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

test('in the collapsed bar the dropdown is a list in the flow, with no panel ground, frame or shadow in any theme [gap-12]', async ({ page }) => {
    // Before: 20 of 22 kept a ground (formal rgb(253, 253, 252)), light kept its shadow and high-contrast its 2px frame — every register's panel rule beat the reset in kp.components.
    await page.goto('/catalogue/navigation.html');
    await sweep(page, () => {
        const panel = /** @type {HTMLElement} */ (document.querySelector('#bar-collapsed .kp-nav[data-kp-nav-open] .kp-nav__menu'));
        const style = getComputedStyle(panel);
        const faults = [];
        if (!/^(transparent|rgba\(\d+, \d+, \d+, 0\))$/.test(style.backgroundColor)) faults.push(`ground ${style.backgroundColor}`);
        if (style.backgroundImage !== 'none') faults.push(`ground image ${style.backgroundImage}`);
        for (const side of ['Top', 'Right', 'Bottom', 'Left']) {
            if (
                style.getPropertyValue(`border-${side.toLowerCase()}-style`) !== 'none' &&
                parseFloat(style.getPropertyValue(`border-${side.toLowerCase()}-width`)) > 0
            )
                faults.push(`${side.toLowerCase()} frame`);
        }
        if (style.boxShadow !== 'none') faults.push(`shadow ${style.boxShadow}`);
        if (style.position !== 'static') faults.push(`position ${style.position}`);
        return faults.length ? faults.join('; ') : null;
    });
});

test('a tab row longer than its box scrolls inside the box in every theme, and never widens the pane [gap-12]', async ({ page }) => {
    // Before: the row ran 344px past a 384px pane (last tab at 1030 against a pane edge at 703), all 22 themes.
    await page.goto('/catalogue/navigation.html');
    await sweep(page, () => {
        const list = /** @type {HTMLElement} */ (document.querySelector('#tabs-many .kp-tabs__list'));
        const pane = /** @type {HTMLElement} */ (list.closest('.cat-resize'));
        const row = list.getBoundingClientRect();
        if (row.right > pane.getBoundingClientRect().right + 0.5)
            return `the row ends ${Math.round(row.right - pane.getBoundingClientRect().right)}px past the pane`;
        if (pane.scrollWidth > pane.clientWidth + 1) return `the pane scrolls by ${pane.scrollWidth - pane.clientWidth}px`;
        if (list.scrollWidth <= list.clientWidth) return 'the row does not scroll, so some tabs are unreachable';
        return null;
    });

    // A row that fits is not a scroller: a scroller clips what a register
    // draws past the row's edge, which several do for the selected tab.
    const fitting = page.locator('#tabs .kp-tabs__list').first();
    await measured(fitting, (el) => getComputedStyle(el).overflowX, undefined, 'a row that fits does not scroll').toBe('visible');
    // And the long row stops scrolling once its pane is wide enough. Three
    // tabs go first, so "wide enough" does not hang on one theme's face.
    await page.evaluate(() => {
        document.documentElement.setAttribute('data-theme', 'formal');
        for (const tab of [...document.querySelectorAll('#tabs-many [role="tab"]')].slice(-3)) tab.remove();
    });
    await page.locator('#tabs-many .cat-resize').evaluate((el) => (el.style.inlineSize = '80rem'));
    await measured(page.locator('#tabs-many .kp-tabs__list'), (el) => getComputedStyle(el).overflowX, undefined, 'widened, it stops scrolling').toBe(
        'visible',
    );
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

test('a selected tree item is visibly different from its unselected sibling in every theme [gap-12]', async ({ page }) => {
    // Before: readings-0240.csv (aria-selected="true") and pump-log.txt painted identically in all 22 themes.
    await page.goto('/catalogue/structure.html');
    await page.mouse.move(1, 1);
    await sweep(
        page,
        (paint) => {
            const read = eval(paint);
            const items = [...document.querySelectorAll('#tree [role="treeitem"]')];
            const selected = items.find((el) => el.getAttribute('aria-selected') === 'true');
            const other = items.find((el) => el.textContent?.trim() === 'pump-log.txt');
            return read(selected) === read(other) ? 'selected paints like unselected' : null;
        },
        PAINT,
    );
});

test('an unbreakable tree label wraps inside its pane in every theme [gap-12]', async ({ page }) => {
    // Before: the 64-character file name pushed the 320px pane to a scroll width of 632px.
    await page.goto('/catalogue/structure.html');
    await sweep(page, () => {
        const tree = /** @type {HTMLElement} */ (document.querySelector('#tree-deep .kp-tree'));
        const pane = /** @type {HTMLElement} */ (tree.closest('.cat-resize'));
        return pane.scrollWidth > pane.clientWidth + 1 ? `the pane scrolls by ${pane.scrollWidth - pane.clientWidth}px` : null;
    });
});

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
    const row = page.locator('#reorder [data-kp-item="pressure"]');
    const handle = row.locator('[data-kp-handle]');
    const faults = [];
    for (const theme of THEMES) {
        await page.evaluate((name) => document.documentElement.setAttribute('data-theme', name), theme);
        await handle.scrollIntoViewIfNeeded();
        const box = /** @type {{ x: number, y: number, width: number, height: number }} */ (await handle.boundingBox());
        await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
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

test('a copied button keeps the success plate in every theme, hovered or not [gap-12]', async ({ page }) => {
    // Before: 18 of 22 painted the ghost button's own ground over the success colour (dark: rgba(0, 0, 0, 0) against rgb(24, 57, 44)); only formal, light, high-contrast and solstice kept it.
    await page.goto('/catalogue/data.html');
    const copied = page.locator('#copyable [data-kp-copied]');
    await copied.scrollIntoViewIfNeeded();
    for (const hovered of [false, true]) {
        if (hovered) await copied.hover();
        else await page.mouse.move(1, 1);
        await sweep(page, () => {
            const button = /** @type {HTMLElement} */ (document.querySelector('#copyable [data-kp-copied]'));
            const probe = document.createElement('span');
            probe.style.setProperty('background-color', 'var(--success)');
            probe.style.setProperty('color', 'var(--success-foreground)');
            button.parentElement?.append(probe);
            const wanted = { ground: getComputedStyle(probe).backgroundColor, ink: getComputedStyle(probe).color };
            probe.remove();
            const style = getComputedStyle(button);
            if (style.backgroundColor !== wanted.ground) return `ground ${style.backgroundColor}, success is ${wanted.ground}`;
            if (style.color !== wanted.ink) return `ink ${style.color}, success-foreground is ${wanted.ink}`;
            return null;
        });
    }
});

test('a copy the clipboard refused is visibly different from an idle copy button in every theme [gap-12]', async ({ page }) => {
    // Before: data-kp-copy-failed painted exactly like idle in all 22 themes; only a toast said anything.
    await page.goto('/catalogue/data.html');
    await page.mouse.move(1, 1);
    await sweep(
        page,
        (paint) => {
            const read = eval(paint);
            const [idle, , failed] = document.querySelectorAll('#copyable .kp-copyable__button');
            return read(idle) === read(failed) ? 'failed paints like idle' : null;
        },
        PAINT,
    );
});

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

test('a theme picker written as a list has no list indent and no markers in any theme [gap-12]', async ({ page }) => {
    // Before: the first option sat 40px in from the list's edge (the browser's padding-inline-start), all 22 themes.
    await page.goto('/catalogue/page.html');
    await sweep(page, () => {
        const list = /** @type {HTMLElement} */ (document.querySelector('#theme-buttons ul[data-kp-theme-picker]'));
        const first = /** @type {HTMLElement} */ (list.querySelector('[data-kp-theme]'));
        const indent = first.getBoundingClientRect().left - list.getBoundingClientRect().left;
        if (indent > 0.5) return `the first option is ${Math.round(indent)}px in`;
        const marker = getComputedStyle(/** @type {Element} */ (list.querySelector('li')), '::marker').content;
        if (getComputedStyle(list).listStyleType !== 'none' && marker !== 'none') return `markers: ${getComputedStyle(list).listStyleType}`;
        return null;
    });
});

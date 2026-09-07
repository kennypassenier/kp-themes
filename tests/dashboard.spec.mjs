// W4, the assembly milestone: a dashboard that does its job.
//
// The other four milestones of this round each run along a seam — the
// button, the dialog, the grid, the scroll boundary — and every one of
// them is green. "Wire it all together" falls into no seam, so it falls
// into no exit criterion, and a package can ship six green milestones
// and a dashboard nobody can operate.
//
// So this suite is a JOURNEY rather than an inventory, on a page shaped
// like a real consumer's (tests/fixtures/dashboard.html): a data table,
// row actions in a menu on the popover layer, a destructive item in that
// menu. With the keyboard alone, in both channels and both browsers:
//
//   1. Tab to the row's menu trigger and open the menu.
//   2. Reach the destructive item.
//   3. Activate it — the confirmation opens [TH107].
//   4. Escape or Cancel — the dialog closes, the menu is SHOWN AGAIN and
//      focus is back on the destructive item, not on <body>. showModal()
//      light-dismisses an open popover, so this one has to be re-shown
//      deliberately [AR28].
//   5. Activate it again and confirm — the action runs EXACTLY ONCE and
//      the row is gone [AR27].
//
// What runs over all 24 themes and what runs over one:
//
//   Once (formal, plus a second pass under cyberpunk because the register
//   rewrites `.kp-button` and the destructive control is one) — every
//   assertion about BEHAVIOUR. Which element the keyboard reaches, what
//   opens, what the lock lets through and what the DOM holds afterwards
//   comes from js/components.js and the browser; a theme is a set of
//   colour, spacing, radius and font tokens (themes/*/tokens.json) and
//   cannot change any of it. Twenty-four runs of it would be twenty-four
//   times the cost for one measurement.
//
//   All 24 — the focus indicator on the destructive control, twice: once
//   as the theme DECLARES it and once as the browser PAINTS it. This is
//   theme-dependent twice over. W0 repaired a two-part ring that
//   `.kp-button` had been erasing in every theme, and the control this
//   journey ends on is a `.kp-button` inside `.kp-popover`, which sets
//   `overflow: auto` and a padding of 4px — while the themes set their
//   own `--kp-space-*`, `--radius` and `--fx-shadow-offset`. Whether a
//   ring 4px wide survives that box is a question per theme, and only
//   counting paint can answer it.

import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { bothHalves, indicator, paintedFocusPixels, tabTo, wearTheme } from './ring.mjs';

const PAGE = '/tests/fixtures/dashboard.html';

/** @type {string[]} */
const THEMES = JSON.parse(readFileSync(new URL('../themes/order.json', import.meta.url), 'utf8'));

const CHANNELS = [
    { name: 'framework-free', prefix: 'plain', rows: '#plain tbody tr', menu: (/** @type {string} */ row) => `#plain-menu-${row}` },
    { name: 'React', prefix: 'react', rows: '#react tbody tr', menu: (/** @type {string} */ row) => `#react-menu-${row}` },
];

/** @param {import('@playwright/test').Page} page */
async function ready(page) {
    await page.waitForSelector('[data-test="plain-menu-trigger-r1"]');
    await page.waitForSelector('[data-test="react-menu-trigger-r1"]');
    await page.evaluate(() => (window.__acts = []));
}

/** What the consumer's own handler ran. @param {import('@playwright/test').Page} page */
const acts = (page) => page.evaluate(() => window.__acts);

/** Where the keyboard is, by data-test — or the tag name, which is how `BODY` shows up. */
const focused = (/** @type {import('@playwright/test').Page} */ page) =>
    page.evaluate(() => document.activeElement?.getAttribute('data-test') ?? document.activeElement?.tagName ?? 'none');

/**
 * Steps 1 and 2 of the journey: open the row's menu with the keyboard
 * and land on the destructive item inside it.
 *
 * Nothing here is a click. `popovertarget` opens on Enter because it is
 * a button, and Tab walks into the open popover because the browser puts
 * a showing popover after its invoker in the sequential focus order —
 * both of them the platform's, which is why js/overlays.js has no menu
 * code at all.
 *
 * @param {import('@playwright/test').Page} page
 * @param {{ prefix: string, menu: (row: string) => string }} channel
 * @param {string} row
 */
async function openMenu(page, channel, row) {
    await tabTo(page, `${channel.prefix}-menu-trigger-${row}`, 80);
    await page.keyboard.press('Enter');
    await expect(page.locator(channel.menu(row))).toBeVisible();
    await tabTo(page, `${channel.prefix}-delete-${row}`, 6);
}

for (const channel of CHANNELS) {
    // ── The journey ───────────────────────────────────────────────────
    //
    // Behaviour, so: two themes rather than 24, and the second one only
    // because the cyberpunk register hooks `.kp-button` since W0.
    for (const theme of ['formal', 'cyberpunk']) {
        test(`the journey: a row is deleted with the keyboard alone, exactly once — ${channel.name}, ${theme} [W4, TH107, AR27, AR28]`, async ({
            page,
        }) => {
            await page.setViewportSize({ width: 1280, height: 900 });
            await page.goto(PAGE);
            await ready(page);
            await wearTheme(page, theme);

            const before = await page.locator(channel.rows).count();
            expect(before).toBe(3);

            // 1 + 2. The menu opens from the keyboard and the destructive
            // item is reachable from the keyboard.
            await openMenu(page, channel, 'r1');
            const item = page.locator(`[data-test="${channel.prefix}-delete-r1"]`);
            await expect(item).toBeFocused();

            // 3. Activating it asks rather than acts.
            await page.keyboard.press('Enter');
            const dialog = page.locator('[data-kp-confirm-dialog]');
            await expect(dialog).toHaveCount(1);
            await expect(dialog.locator('.kp-dialog__title')).toHaveText('Delete Bakker?');
            expect(await page.evaluate(() => document.querySelector('[data-kp-confirm-dialog]')?.matches(':modal'))).toBe(true);
            expect(await acts(page), 'the question must not act').toEqual([]);

            // 4a. Escape. The menu comes back and the keyboard is on the
            // item it left, not on <body>.
            //
            // Drill [KT3]: the `displaced` restore loop removed from
            // openConfirmation() in js/components.js — "expected visible,
            // received hidden" on the menu, in both channels and both
            // browsers.
            await page.keyboard.press('Escape');
            await expect(dialog).toHaveCount(0);
            await expect(page.locator(channel.menu('r1')), 'the menu showModal() displaced is shown again').toBeVisible();
            expect(await focused(page)).toBe(`${channel.prefix}-delete-r1`);
            expect(await acts(page)).toEqual([]);

            // 4b. And Cancel, reached with the keyboard from inside the
            // dialog, does the same.
            await page.keyboard.press('Enter');
            await expect(dialog).toHaveCount(1);
            expect(await page.evaluate(() => document.activeElement?.hasAttribute('data-kp-confirm-cancel'))).toBe(true);
            await page.keyboard.press('Enter');
            await expect(dialog).toHaveCount(0);
            await expect(page.locator(channel.menu('r1'))).toBeVisible();
            expect(await focused(page)).toBe(`${channel.prefix}-delete-r1`);
            expect(await acts(page)).toEqual([]);

            // 5. Once more, and this time take it. Tab reaches the accept
            // button; the dialog opens on Cancel so a stray Enter is not
            // the destructive answer.
            //
            // Drill [KT3]: the `unlocked === button` branch removed from
            // onDialogClick() in js/components.js (framework-free) and the
            // `unlocked.current` branch from handle() in
            // components/button.jsx (React) — the re-fired click is caught
            // by the listener that opened the dialog, so the dialog opens
            // again and the row is still there: `acts: []`, 3 rows.
            await page.keyboard.press('Enter');
            await expect(dialog).toHaveCount(1);
            await page.keyboard.press('Tab');
            expect(await page.evaluate(() => document.activeElement?.hasAttribute('data-kp-confirm-accept'))).toBe(true);
            await page.keyboard.press('Enter');

            await expect(dialog).toHaveCount(0);
            await expect(page.locator(`[data-test="${channel.prefix}-delete-r1"]`)).toHaveCount(0);
            await expect(page.locator(channel.rows), 'the row is gone').toHaveCount(before - 1);
            expect(await acts(page), 'exactly once').toEqual([`${channel.prefix === 'plain' ? 'plain' : 'react'}:r1`]);
            // The two rows it did not point at are untouched.
            await expect(page.locator(`[data-test="${channel.prefix}-menu-trigger-r0"]`)).toHaveCount(1);
            await expect(page.locator(`[data-test="${channel.prefix}-menu-trigger-r2"]`)).toHaveCount(1);
        });
    }

    // The same journey in a 320px viewport, where W2's container query
    // has turned the table into cards and W3's wrapper is the only thing
    // allowed to scroll. Behaviour again, so one theme — but a second
    // LAYOUT, because that is what changed under it.
    test(`the journey survives the narrow layout, and the page does not scroll sideways — ${channel.name} [W4, TH104, TH113]`, async ({ page }) => {
        await page.setViewportSize({ width: 320, height: 900 });
        await page.goto(PAGE);
        await ready(page);

        // The narrow layout is really the narrow one: without this the
        // test could be driving the wide table and reporting nothing.
        // Drill [KT3]: the `@container kp-table (max-width: 40rem)` block
        // removed from css/components.css — "table-cell" in both channels
        // and both browsers, and the wrapper measurement below goes with it.
        // `not table-cell` rather than a value: the query lays the cells
        // out as blocks and a later rule inside it makes the ones with a
        // `data-label` flex, so naming one of them would pin the wrong
        // thing.
        expect(
            await page.evaluate((sel) => getComputedStyle(/** @type {Element} */ (document.querySelector(sel))).display, `${channel.rows} td`),
        ).not.toBe('table-cell');

        await openMenu(page, channel, 'r0');
        await page.keyboard.press('Enter');
        await expect(page.locator('[data-kp-confirm-dialog]')).toHaveCount(1);
        await page.keyboard.press('Tab');
        await page.keyboard.press('Enter');
        await expect(page.locator('[data-kp-confirm-dialog]')).toHaveCount(0);
        await expect(page.locator(channel.rows)).toHaveCount(2);
        expect(await acts(page)).toHaveLength(1);

        // Nothing on the assembled page pushes it sideways — and the box
        // that would have to give first does not either.
        //
        // Two measurements, because the first one alone would have been a
        // test that cannot fail. Drill [KT3]: the shared
        // `max-inline-size: 100%` / `overflow-wrap: anywhere` rule
        // removed from css/components.css [AR32]. The PAGE stayed 320/320
        // in both channels — W3's `.kp-table-wrap` absorbed it — and the
        // WRAPPER read 354 against a client width of 304, in both
        // channels and both browsers. So AR32's floor is what keeps the
        // reference inside its card, and this is where it shows.
        const sideways = await page.evaluate(
            (sel) => {
                const doc = /** @type {HTMLElement} */ (document.scrollingElement);
                const wrap = /** @type {HTMLElement} */ (document.querySelector(sel));
                return {
                    page: { scrollWidth: doc.scrollWidth, clientWidth: doc.clientWidth },
                    wrap: { scrollWidth: wrap.scrollWidth, clientWidth: wrap.clientWidth },
                };
            },
            `${channel.rows.split(' ')[0]} .kp-table-wrap`,
        );
        expect(
            sideways.page.scrollWidth,
            `the page scrolls sideways: ${sideways.page.scrollWidth} > ${sideways.page.clientWidth}`,
        ).toBeLessThanOrEqual(sideways.page.clientWidth);
        expect(
            sideways.wrap.scrollWidth,
            `the card scrolls sideways inside the table wrapper: ${sideways.wrap.scrollWidth} > ${sideways.wrap.clientWidth}`,
        ).toBeLessThanOrEqual(sideways.wrap.clientWidth);
    });

    // ── The focus indicator, all 24 themes ────────────────────────────
    //
    // Drill [KT3]: the `.kp-button:focus-visible` block removed from
    // css/components.css — the composed ring falls back to the brutalist
    // offset alone, `0px 0px 0px 0px` on the inner half, and all 24
    // themes are named, in both channels and both browsers. The same
    // removal takes the painted measurement below to 0 in 20 of them.
    test(`both halves of the focus ring reach the destructive item in the row menu, all 24 themes — ${channel.name} [W4, AR30, DI2]`, async ({
        page,
    }) => {
        await page.setViewportSize({ width: 1280, height: 900 });
        await page.goto(PAGE);
        await ready(page);
        await openMenu(page, channel, 'r1');

        /** @type {string[]} */
        const broken = [];
        for (const theme of THEMES) {
            await wearTheme(page, theme);
            const found = await indicator(page, `${channel.prefix}-delete-r1`);
            expect(found.focused, `${theme}: the keyboard lost the menu item`).toBe(true);
            const { outer, inner } = bothHalves(found);
            if (!outer || !inner) broken.push(`${theme}: outline ${found.outlineStyle} ${found.outlineWidth}px, shadow ${found.boxShadow}`);
        }
        expect(broken, `half a ring on the destructive menu item in:\n${broken.join('\n')}`).toEqual([]);
    });

    // What the theme declares and what the browser paints are different
    // questions: `.kp-popover` sets `overflow: auto` and 4px of padding,
    // and a ring is 4px wide. Computed style would report a ring the
    // popover had cut off, exactly as it reported one a clip-path had
    // cut off in AR30 (`green 784 -> 0`).
    //
    // And it is kept BESIDE the declared measurement rather than instead
    // of it, because it is the weaker of the two in one direction:
    // drilling the ring away leaves 4 of the 24 themes still painting
    // something --focus-ring-coloured next to the item — high-contrast,
    // brutalism, grotesk and nishiki, whose `--border-strong` equals
    // their `--focus-ring`, so the popover's own 1px border is counted.
    // Neither measurement alone would have caught both faults.
    test(`the focus indicator PAINTS on the destructive item inside the menu, all 24 themes — ${channel.name} [W4, AR30]`, async ({ page }) => {
        test.slow();
        await page.setViewportSize({ width: 1280, height: 900 });
        await page.goto(PAGE);
        await ready(page);
        await openMenu(page, channel, 'r1');

        /** @type {string[]} */
        const blank = [];
        for (const theme of THEMES) {
            await wearTheme(page, theme);
            const painted = await paintedFocusPixels(page, `${channel.prefix}-delete-r1`, { settleMs: 150 });
            if (painted === 0) blank.push(theme);
        }
        expect(blank, `the focus indicator painted 0 pixels in:\n${blank.join('\n')}`).toEqual([]);
    });

    // The confirmation's own buttons are built by js/components.js at
    // runtime and exist on no page any other suite measures per theme.
    // The keyboard lands on Cancel, so Cancel is the one that has to show
    // where it is.
    test(`the confirmation's buttons carry both halves of the ring, all 24 themes — ${channel.name} [W4, TH107, DI2]`, async ({ page }) => {
        await page.setViewportSize({ width: 1280, height: 900 });
        await page.goto(PAGE);
        await ready(page);
        await openMenu(page, channel, 'r1');
        await page.keyboard.press('Enter');
        await expect(page.locator('[data-kp-confirm-dialog]')).toHaveCount(1);
        // The dialog's buttons carry no data-test of their own — they are
        // the package's markup, not the fixture's — so one is put on them
        // here rather than into js/components.js, where it would ship.
        await page.evaluate(() => {
            document.querySelector('[data-kp-confirm-cancel]')?.setAttribute('data-test', 'confirm-cancel');
            document.querySelector('[data-kp-confirm-accept]')?.setAttribute('data-test', 'confirm-accept');
        });

        /** @type {string[]} */
        const broken = [];
        for (const theme of THEMES) {
            await wearTheme(page, theme);
            const found = await indicator(page, 'confirm-cancel');
            expect(found.focused, `${theme}: the keyboard is not on Cancel`).toBe(true);
            const { outer, inner } = bothHalves(found);
            if (!outer || !inner) broken.push(`${theme}: outline ${found.outlineStyle} ${found.outlineWidth}px, shadow ${found.boxShadow}`);
        }
        expect(broken, `half a ring on the confirmation's Cancel in:\n${broken.join('\n')}`).toEqual([]);
    });
}

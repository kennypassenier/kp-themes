// The words beside a checkbox or a radio sit on the control's centre, and
// ticking it moves no word [scope-92].
//
// Kenny's review notes of 2026-09-15, FireDragon: in synthwave and cyberpunk
// the text beside a checkbox in the data table sat at the height of the box's
// bottom, and the radios on the field page did the same — "vertically
// centred, for all themes". In cyberpunk the text also rose by a few pixels
// when the box was ticked and fell back when it was unticked (a live-found
// fault).
//
// The cause was one alignment: `.kp-field--check` and `.kp-field__option`
// aligned their items on the baseline. A native checkbox's baseline is
// roughly its bottom, so the text's baseline lined up with the box's
// bottom. A register that draws its own box (`appearance: none` and a grid
// whose only child is the `::before` mark) has no baseline of its own while
// unticked, so the browser synthesizes one from the box's bottom edge; once
// ticked, the mark is a grid item and the box's baseline becomes the mark's
// bottom, a few pixels higher — so the text moved with the state.
//
// Measured, never inferred [KT13]: the text's box is a Range over the words
// the control is labelled by (all their lines, so a label that wraps is
// centred as a block), the control's box its border box, and the shift is
// the text's top before and after the state flips.

import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';
import { waitForJudging } from './helpers/catalogue.mjs';
import { useEmptyRegister } from './helpers/empty-register.mjs';

const THEMES = /** @type {string[]} */ (JSON.parse(readFileSync(new globalThis.URL('../themes/order.json', import.meta.url), 'utf8')));

/** How far the text's centre may sit from the control's, in CSS px. */
const CENTRE_TOLERANCE = 1;

/** @param {import('@playwright/test').Page} page @param {string} theme */
const wear = async (page, theme) => {
    await page.evaluate((name) => document.documentElement.setAttribute('data-theme', name), theme);
    await expect.poll(() => page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--primary') !== '')).toBe(true);
};

/**
 * Every visible checkbox and radio under `scope` that has words beside it:
 * the centre offset in both states and the shift of its words on a flip.
 *
 * @param {import('@playwright/test').Page} page
 * @param {string} scope
 */
const measure = (page, scope) =>
    page.evaluate(async (selector) => {
        const frame = () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
        /** @param {Element} box */
        const wordsOf = (box) => {
            const option = box.closest('.kp-field__option, .kp-datatable__column-option');
            if (option) return option;
            if (box.id) return document.querySelector(`label[for="${CSS.escape(box.id)}"]`);
            return null;
        };
        /** The box of the words: every line of them, the control itself left out. @param {Element} host @param {Element} box */
        const textRect = (host, box) => {
            const range = document.createRange();
            range.selectNodeContents(host);
            if (host.contains(box)) range.setStartAfter(box);
            const lines = [...range.getClientRects()].filter((r) => r.width > 0 && r.height > 0);
            if (lines.length === 0) return null;
            const top = Math.min(...lines.map((r) => r.top));
            const bottom = Math.max(...lines.map((r) => r.bottom));
            return { top, height: bottom - top };
        };
        const rows = [];
        const boxes = [
            ...document.querySelectorAll(
                selector
                    .split(',')
                    .map((one) => `${one.trim()} input.kp-field__check`)
                    .join(', '),
            ),
        ].filter((el) => /** @type {HTMLElement} */ (el).offsetParent !== null);
        for (const el of boxes) {
            const box = /** @type {HTMLInputElement} */ (el);
            const host = wordsOf(box);
            if (!host) continue;
            const initial = box.checked;
            const read = () => {
                const t = textRect(host, box);
                const b = box.getBoundingClientRect();
                return t ? { top: t.top, offset: t.top + t.height / 2 - (b.top + b.height / 2) } : null;
            };
            box.checked = false;
            await frame();
            const off = read();
            box.checked = true;
            await frame();
            const on = read();
            box.checked = initial;
            if (!off || !on) continue;
            rows.push({
                name: (host.textContent ?? '').trim().slice(0, 40),
                type: box.type,
                offOffset: off.offset,
                onOffset: on.offset,
                shift: on.top - off.top,
            });
        }
        await frame();
        return rows;
    }, scope);

/**
 * @param {string} theme
 * @param {Awaited<ReturnType<typeof measure>>} rows
 */
const faults = (theme, rows) =>
    rows.flatMap((r) => {
        const out = [];
        const worst = Math.max(Math.abs(r.offOffset), Math.abs(r.onOffset));
        if (worst > CENTRE_TOLERANCE)
            out.push(
                `${theme} ${r.type} "${r.name}": text centre ${r.offOffset.toFixed(2)}px off / ${r.onOffset.toFixed(2)}px on from the control's`,
            );
        if (Math.abs(r.shift) > 0.01) out.push(`${theme} ${r.type} "${r.name}": text moves ${r.shift.toFixed(2)}px when ticked`);
        return out;
    });

/** @param {import('@playwright/test').Page} page @param {string} url */
const open = async (page, url) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width: 1280, height: 900 });
    await useEmptyRegister(page.context());
    await page.goto(url);
    await waitForJudging(page);
};

/** @param {import('@playwright/test').Page} page */
const openFilters = async (page) => {
    const toggle = page.locator('#datatable [data-kp-datatable-filter-toggle]');
    if ((await toggle.getAttribute('aria-expanded')) !== 'true') await toggle.click();
    await expect(page.locator('#datatable .kp-field__option').first()).toBeVisible();
};

/** @param {import('@playwright/test').Page} page */
const openColumns = async (page) => {
    const toggle = page.locator('#datatable-columns .kp-datatable__columns-toggle');
    if ((await toggle.getAttribute('aria-expanded')) !== 'true') await toggle.click();
    await expect(page.locator('#datatable-columns .kp-datatable__column-option').first()).toBeVisible();
};

// Kenny may browse zoomed: 1.25 is a desktop scaled by a quarter. Firefox
// takes it as a preference at launch, chromium as a context's scale.
const RATIOS = [1, 1.25];

/**
 * A page at `ratio`, in a browser of the project's engine launched for it.
 *
 * @param {import('@playwright/test').BrowserType} browserType
 * @param {string} browserName
 * @param {string | undefined} baseURL
 * @param {number} ratio
 */
const pageAt = async (browserType, browserName, baseURL, ratio) => {
    const firefox = browserName === 'firefox';
    const browser = await browserType.launch(firefox ? { firefoxUserPrefs: { 'layout.css.devPixelsPerPx': String(ratio) } } : {});
    const context = await browser.newContext({ baseURL, deviceScaleFactor: ratio });
    const page = await context.newPage();
    return { browser, page };
};

for (const ratio of RATIOS) {
    test(
        `the words beside every checkbox and radio on the field page sit on its centre and stay put when ticked, in every theme, devicePixelRatio ${ratio} [scope-92]`,
        { tag: ['@component:field', '@sweep'] },
        async ({ playwright, browserName, baseURL }) => {
            // Before (firefox, both ratios): the words sat 4 to 6px below the
            // control's centre in every theme but these three, and 28.6px in
            // brutalism, deco and nostromo, whose long label went down to a
            // line of its own under the box (25.2px in cyberpunk). Ticking
            // moved them 6.0px in brutalism, 5.2px in dark and titanium,
            // 4.4px in cyberpunk's inline radio row and 2.2px in retro.
            test.setTimeout(180_000);
            const { browser, page } = await pageAt(playwright[browserName], browserName, baseURL, ratio);
            try {
                await open(page, '/catalogue/field.html');
                expect(await page.evaluate(() => devicePixelRatio)).toBe(ratio);
                const found = [];
                for (const theme of THEMES) {
                    await wear(page, theme);
                    const rows = await measure(page, '#choices, #invalid');
                    expect(rows.length, `${theme}: no choices measured`).toBeGreaterThanOrEqual(10);
                    found.push(...faults(theme, rows));
                }
                expect(found, found.join('\n')).toEqual([]);
            } finally {
                await browser.close();
            }
        },
    );

    test(
        `the words beside the data table's checkboxes sit on the box's centre and stay put when ticked, in every theme, devicePixelRatio ${ratio} [scope-92]`,
        { tag: ['@component:datatable', '@sweep'] },
        async ({ playwright, browserName, baseURL }) => {
            // Before (firefox, both ratios): the filter and column choices'
            // words 3.7 to 6.2px below the box's centre in every theme (lapis
            // the worst), and ticking moved them 6.0px in brutalism, 5.2px in
            // dark and titanium, 3.1px in cyberpunk and 2.0px in retro.
            test.setTimeout(180_000);
            const { browser, page } = await pageAt(playwright[browserName], browserName, baseURL, ratio);
            try {
                await open(page, '/catalogue/table.html');
                const found = [];
                for (const theme of THEMES) {
                    await wear(page, theme);
                    await openFilters(page);
                    const rows = await measure(page, '#datatable');
                    await openColumns(page);
                    rows.push(...(await measure(page, '#datatable-columns')));
                    expect(rows.length, `${theme}: no choices measured`).toBeGreaterThanOrEqual(5);
                    found.push(...faults(theme, rows));
                }
                expect(found, found.join('\n')).toEqual([]);
            } finally {
                await browser.close();
            }
        },
    );
}

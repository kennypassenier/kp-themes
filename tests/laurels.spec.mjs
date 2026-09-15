// The laurels as wreaths and the platforms as store badges, in shade-light
// [scope-93].
//
// Kenny, 2026-09-15, the light-theme review form: laurels-direction
// "B · Wreaths" from research/laurels/demo.html — each claim between two
// drawn laurel branches, the platforms as app-store badges — and then, the
// same day, the correction: for shade-light only, the theme he commented on.
// The complaint that opened the research was shade-light's: the value `b`
// set to `display: block` left the accent dot alone on the first line, and a
// pill's round ends went around two lines of text. The other twenty-one
// themes keep their laurels and platforms as they were.
//
// Before, on 74d9ac73 (firefox): shade-light's `::before` was the dot, not a
// branch, so every claim failed "two branches"; each claim was a pill, which
// "no claim is boxed" refuses; and no platform had a badge ground.
//
// Measured, never inferred [KT13]: the claim's text box is a Range over the
// item's contents (every line of the value and the label), the branches are
// the item's `::before` and `::after` as the browser resolved them, and the
// badges are their painted boxes.

import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';
import { waitForJudging } from './helpers/catalogue.mjs';
import { useEmptyRegister } from './helpers/empty-register.mjs';

const ALL = /** @type {string[]} */ (JSON.parse(readFileSync(new globalThis.URL('../themes/order.json', import.meta.url), 'utf8')));

/** The one theme that wears the wreaths [scope-93]. */
const WREATHED = ['shade-light'];

/** The themes that keep their own laurels and platforms. */
const OTHERS = ALL.filter((theme) => !WREATHED.includes(theme));

/** How far the text may sit off the claim's centre, in CSS px. */
const CENTRE_TOLERANCE = 1;

/** @param {import('@playwright/test').Page} page @param {string} theme */
const wear = async (page, theme) => {
    await page.evaluate((name) => document.documentElement.setAttribute('data-theme', name), theme);
    await expect.poll(() => page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--primary') !== '')).toBe(true);
};

/** @param {import('@playwright/test').Page} page */
const open = async (page) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await useEmptyRegister(page.context());
    await page.goto('/catalogue/media.html');
    await waitForJudging(page);
    await expect(page.locator('#laurels .kp-laurels').first()).toBeVisible();
};

// Kenny browses zoomed: 1.25 is a desktop scaled by a quarter. Firefox takes
// it as a preference at launch, chromium as a context's scale.
const RATIOS = [1, 1.25];

/**
 * @param {import('@playwright/test').BrowserType} browserType
 * @param {string} browserName
 * @param {string | undefined} baseURL
 * @param {number} ratio
 */
const pageAt = async (browserType, browserName, baseURL, ratio) => {
    const firefox = browserName === 'firefox';
    const browser = await browserType.launch(firefox ? { firefoxUserPrefs: { 'layout.css.devPixelsPerPx': String(ratio) } } : {});
    const context = await browser.newContext({ baseURL, deviceScaleFactor: ratio, viewport: { width: 1400, height: 900 } });
    const page = await context.newPage();
    return { browser, page };
};

/**
 * Every claim in the block, measured: its text box against its own box, and
 * both branches as resolved. `direction` sets `dir` on the lists first;
 * `scale` multiplies the lists' font size first.
 *
 * @param {import('@playwright/test').Page} page
 * @param {{ direction?: 'ltr' | 'rtl', scale?: number }} [options]
 */
const claims = (page, { direction = 'ltr', scale = 1 } = {}) =>
    page.evaluate(
        async ({ direction, scale }) => {
            const frame = () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
            const lists = [...document.querySelectorAll('#laurels .kp-laurels')];
            const kept = lists.map((list) => ({ list, dir: list.getAttribute('dir'), size: /** @type {HTMLElement} */ (list).style.fontSize }));
            for (const list of lists) {
                list.setAttribute('dir', direction);
                if (scale !== 1) {
                    const base = parseFloat(getComputedStyle(list).fontSize);
                    /** @type {HTMLElement} */ (list).style.fontSize = `${base * scale}px`;
                }
            }
            await frame();
            const out = [];
            for (const li of lists.flatMap((list) => [...list.querySelectorAll(':scope > li')])) {
                const box = li.getBoundingClientRect();
                const range = document.createRange();
                range.selectNodeContents(li);
                const rects = [...range.getClientRects()].filter((r) => r.width > 0 && r.height > 0);
                const text = {
                    left: Math.min(...rects.map((r) => r.left)),
                    right: Math.max(...rects.map((r) => r.right)),
                    top: Math.min(...rects.map((r) => r.top)),
                    bottom: Math.max(...rects.map((r) => r.bottom)),
                };
                /** @param {'::before' | '::after'} which */
                const branch = (which) => {
                    const s = getComputedStyle(li, which);
                    return {
                        content: s.content,
                        width: parseFloat(s.width) || 0,
                        height: parseFloat(s.height) || 0,
                        mask: s.maskImage || s.webkitMaskImage || '',
                        paint: s.backgroundColor,
                        mirrored: /^matrix\(-1,/.test(s.transform.replace(/\s/g, '')),
                    };
                };
                out.push({
                    name: (li.querySelector('b')?.textContent ?? li.textContent ?? '').trim(),
                    rtl: getComputedStyle(li).direction === 'rtl',
                    box: { left: box.left, right: box.right, width: box.width },
                    text,
                    before: branch('::before'),
                    after: branch('::after'),
                });
            }
            for (const { list, dir, size } of kept) {
                if (dir === null) list.removeAttribute('dir');
                else list.setAttribute('dir', dir);
                /** @type {HTMLElement} */ (list).style.fontSize = size;
            }
            await frame();
            return out;
        },
        { direction, scale },
    );

/**
 * The faults of one theme's claims: two branches drawn from a vector, as tall
 * as the text, equally wide, the text centred between them, the branch on
 * the left drawn as drawn and the one on the right mirrored.
 *
 * @param {string} theme
 * @param {Awaited<ReturnType<typeof claims>>} rows
 */
const branchFaults = (theme, rows) =>
    rows.flatMap((r) => {
        const out = [];
        const where = `${theme}${r.rtl ? ' rtl' : ''} "${r.name}"`;
        for (const [side, b] of /** @type {const} */ ([
            ['::before', r.before],
            ['::after', r.after],
        ])) {
            if (b.content === 'none' || b.content === 'normal') out.push(`${where}: no ${side} branch`);
            if (!/data:image\/svg\+xml/.test(b.mask))
                out.push(`${where}: the ${side} branch is not a drawn vector mask (${b.mask.slice(0, 40) || 'none'})`);
            if (b.width < 8) out.push(`${where}: the ${side} branch is ${b.width.toFixed(1)}px wide`);
            if (b.height < r.text.bottom - r.text.top - 1)
                out.push(`${where}: the ${side} branch is ${b.height.toFixed(1)}px tall beside ${(r.text.bottom - r.text.top).toFixed(1)}px of text`);
            if (/rgba\(0, 0, 0, 0\)|transparent/.test(b.paint)) out.push(`${where}: the ${side} branch is not painted`);
        }
        if (Math.abs(r.before.width - r.after.width) > 0.5)
            out.push(`${where}: branches ${r.before.width.toFixed(1)}px and ${r.after.width.toFixed(1)}px wide`);
        const leftGap = r.text.left - r.box.left;
        const rightGap = r.box.right - r.text.right;
        if (Math.abs(leftGap - rightGap) > 2 * CENTRE_TOLERANCE)
            out.push(`${where}: text ${leftGap.toFixed(1)}px from the left edge, ${rightGap.toFixed(1)}px from the right`);
        if (Math.min(leftGap, rightGap) < r.before.width - 0.5)
            out.push(
                `${where}: text runs into a branch (${Math.min(leftGap, rightGap).toFixed(1)}px beside a ${r.before.width.toFixed(1)}px branch)`,
            );
        const left = r.rtl ? r.after : r.before;
        const right = r.rtl ? r.before : r.after;
        if (left.mirrored || !right.mirrored)
            out.push(`${where}: the branches face the wrong way (left mirrored ${left.mirrored}, right ${right.mirrored})`);
        return out;
    });

for (const ratio of RATIOS) {
    test(
        `every claim sits between two laurel branches, symmetric around its text, in ltr and rtl and at twice the font size, in shade-light, devicePixelRatio ${ratio} [scope-93]`,
        { tag: ['@component:media', '@theme:shade-light'] },
        async ({ playwright, browserName, baseURL }) => {
            test.setTimeout(180_000);
            const { browser, page } = await pageAt(playwright[browserName], browserName, baseURL, ratio);
            try {
                await open(page);
                expect(await page.evaluate(() => devicePixelRatio)).toBe(ratio);
                const found = [];
                for (const theme of WREATHED) {
                    await wear(page, theme);
                    const ltr = await claims(page);
                    expect(ltr.length, `${theme}: no claims measured`).toBeGreaterThanOrEqual(5);
                    found.push(...branchFaults(theme, ltr));
                    found.push(...branchFaults(theme, await claims(page, { direction: 'rtl' })));
                    // Scales with the font: twice the size, twice the branch.
                    const big = await claims(page, { scale: 2 });
                    big.forEach((r, i) => {
                        const ratioOf = r.before.width / ltr[i].before.width;
                        if (!(ratioOf > 1.9 && ratioOf < 2.1))
                            found.push(`${theme} "${r.name}": at twice the font size the branch is ${ratioOf.toFixed(2)} times as wide`);
                    });
                }
                expect(found, found.join('\n')).toEqual([]);
            } finally {
                await browser.close();
            }
        },
    );
}

test(
    'no claim is boxed: the value is one line centred over its label, louder than it, and every claim fits its pane, in shade-light [scope-93]',
    { tag: ['@component:media', '@theme:shade-light'] },
    async ({ page }) => {
        await page.setViewportSize({ width: 1400, height: 900 });
        await open(page);
        const found = [];
        for (const theme of WREATHED) {
            await wear(page, theme);
            const rows = await page.evaluate(() =>
                [...document.querySelectorAll('#laurels .kp-laurels > li')].map((li) => {
                    const s = getComputedStyle(li);
                    const value = /** @type {HTMLElement} */ (li.querySelector('b'));
                    const valueRange = document.createRange();
                    valueRange.selectNodeContents(value);
                    const valueLines = [...valueRange.getClientRects()].filter((r) => r.width > 0);
                    const label = [...li.childNodes].find((n) => n.nodeType === Node.TEXT_NODE && (n.textContent ?? '').trim() !== '');
                    const labelRange = document.createRange();
                    if (label) labelRange.selectNodeContents(label);
                    const labelRects = label ? [...labelRange.getClientRects()].filter((r) => r.width > 0) : [];
                    const box = li.getBoundingClientRect();
                    const pane = /** @type {Element} */ (li.closest('.cat-resize, .cat-stage'));
                    const paneBox = pane.getBoundingClientRect();
                    const v = value.getBoundingClientRect();
                    return {
                        name: (value.textContent ?? '').trim(),
                        boxed:
                            parseFloat(s.borderTopWidth) > 0 ||
                            parseFloat(s.borderInlineStartWidth) > 0 ||
                            !/rgba\(0, 0, 0, 0\)|transparent/.test(s.backgroundColor) ||
                            s.backgroundImage !== 'none',
                        valueLines: new Set(valueLines.map((r) => Math.round(r.top))).size,
                        valueCentre: (v.left + v.right) / 2,
                        boxCentre: (box.left + box.right) / 2,
                        valueBottom: v.bottom,
                        labelTop: labelRects.length ? Math.min(...labelRects.map((r) => r.top)) : null,
                        valueSize: parseFloat(getComputedStyle(value).fontSize),
                        labelSize: parseFloat(s.fontSize),
                        overflow: Math.max(paneBox.left - box.left, box.right - paneBox.right),
                    };
                }),
            );
            expect(rows.length, `${theme}: no claims`).toBeGreaterThanOrEqual(5);
            for (const r of rows) {
                const where = `${theme} "${r.name}"`;
                if (r.boxed) found.push(`${where}: the claim is drawn in a box or a pill`);
                if (r.valueLines !== 1) found.push(`${where}: the value runs over ${r.valueLines} lines`);
                if (Math.abs(r.valueCentre - r.boxCentre) > CENTRE_TOLERANCE)
                    found.push(`${where}: the value's centre is ${(r.valueCentre - r.boxCentre).toFixed(1)}px off the claim's`);
                if (r.labelTop === null) found.push(`${where}: no label`);
                else if (r.labelTop < r.valueBottom - 1) found.push(`${where}: the label starts beside the value, not under it`);
                if (!(r.valueSize > r.labelSize))
                    found.push(`${where}: the value (${r.valueSize}px) is not larger than its label (${r.labelSize}px)`);
                if (r.overflow > 0.5) found.push(`${where}: the claim runs ${r.overflow.toFixed(1)}px out of its pane`);
            }
        }
        expect(found, found.join('\n')).toEqual([]);
    },
);

test(
    'the platforms are store badges on one line at 1400px: an inverted ground, the name on one line, the glyph beside it, in shade-light [scope-93]',
    { tag: ['@component:media', '@theme:shade-light'] },
    async ({ page }) => {
        await page.setViewportSize({ width: 1400, height: 900 });
        await open(page);
        const found = [];
        for (const theme of WREATHED) {
            await wear(page, theme);
            const rows = await page.evaluate(() => {
                const ctx = /** @type {CanvasRenderingContext2D} */ (document.createElement('canvas').getContext('2d', { willReadFrequently: true }));
                /** @param {string} css */
                const rgb = (css) => {
                    ctx.clearRect(0, 0, 1, 1);
                    ctx.fillStyle = '#000';
                    ctx.fillStyle = css;
                    ctx.fillRect(0, 0, 1, 1);
                    const d = ctx.getImageData(0, 0, 1, 1).data;
                    return { rgb: [d[0] / 255, d[1] / 255, d[2] / 255], alpha: d[3] / 255 };
                };
                /** @param {number[]} c */
                const lum = ([r, g, b]) => {
                    /** @param {number} u */
                    const f = (u) => (u <= 0.03928 ? u / 12.92 : ((u + 0.055) / 1.055) ** 2.4);
                    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
                };
                /** @param {number[]} a @param {number[]} b */
                const contrast = (a, b) => {
                    const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
                    return (hi + 0.05) / (lo + 0.05);
                };
                return [...document.querySelectorAll('#laurels .kp-platforms')].map((row) => {
                    const pane = /** @type {Element} */ (row.closest('.cat-resize, .cat-stage'));
                    const paneBox = pane.getBoundingClientRect();
                    return {
                        narrow: pane.classList.contains('cat-resize'),
                        badges: [...row.children].map((badge) => {
                            const s = getComputedStyle(badge);
                            const ground = rgb(s.backgroundColor);
                            const ink = rgb(s.color);
                            const name = [...badge.childNodes]
                                .filter((n) => n.nodeType === Node.TEXT_NODE && (n.textContent ?? '').trim() !== '')
                                .at(-1);
                            const range = document.createRange();
                            if (name) range.selectNodeContents(name);
                            const nameLines = name
                                ? new Set([...range.getClientRects()].filter((r) => r.width > 0).map((r) => Math.round(r.top))).size
                                : 0;
                            const nameBox = name ? range.getBoundingClientRect() : null;
                            const glyph = badge.querySelector('svg');
                            const g = glyph?.getBoundingClientRect();
                            const small = badge.querySelector('small')?.getBoundingClientRect();
                            const box = badge.getBoundingClientRect();
                            return {
                                name: (name?.textContent ?? '').trim(),
                                top: box.top,
                                ground: ground.alpha,
                                contrast: contrast(ground.rgb, ink.rgb),
                                nameLines,
                                glyphBeside: g && nameBox ? g.right <= nameBox.left + 0.5 || g.left >= nameBox.right - 0.5 : null,
                                smallAbove:
                                    small && nameBox
                                        ? (small.top + small.bottom) / 2 < nameBox.top && small.bottom <= (nameBox.top + nameBox.bottom) / 2
                                        : null,
                                overflow: Math.max(paneBox.left - box.left, box.right - paneBox.right),
                            };
                        }),
                    };
                });
            });
            expect(rows.length, `${theme}: no platforms rows`).toBeGreaterThanOrEqual(2);
            for (const row of rows) {
                expect(row.badges.length, `${theme}: an empty platforms row`).toBeGreaterThanOrEqual(2);
                const tops = row.badges.map((b) => b.top);
                if (!row.narrow && Math.max(...tops) - Math.min(...tops) > 1) found.push(`${theme}: the badges wrap to a second line at 1400px`);
                for (const b of row.badges) {
                    const where = `${theme}${row.narrow ? ' narrow' : ''} "${b.name}"`;
                    if (b.ground < 1) found.push(`${where}: the badge has no solid ground (alpha ${b.ground})`);
                    if (b.contrast < 4.5) found.push(`${where}: name on ground ${b.contrast.toFixed(2)}:1`);
                    if (b.nameLines !== 1) found.push(`${where}: the name runs over ${b.nameLines} lines`);
                    if (b.glyphBeside === false) found.push(`${where}: the glyph is not beside the name`);
                    if (b.smallAbove === false) found.push(`${where}: the small line is not above the name`);
                    if (b.overflow > 0.5) found.push(`${where}: the badge runs ${b.overflow.toFixed(1)}px out of its pane`);
                }
            }
        }
        expect(found, found.join('\n')).toEqual([]);
    },
);

test(
    'the other twenty-one themes wear no wreath and no store badge: their laurels and platforms are their own [scope-93]',
    { tag: ['@component:media', '@sweep'] },
    async ({ page }) => {
        // The correction of 2026-09-15: the wreaths are shade-light's answer
        // alone. A branch mask or the badge plate reaching another theme is a
        // theme changed that Kenny did not ask to change.
        await page.setViewportSize({ width: 1400, height: 900 });
        await open(page);
        const found = [];
        for (const theme of OTHERS) {
            await wear(page, theme);
            const rows = await page.evaluate(() => ({
                branches: [...document.querySelectorAll('#laurels .kp-laurels > li')].flatMap((li) =>
                    ['::before', '::after']
                        .map((which) => getComputedStyle(li, which))
                        .filter((s) => /data:image\/svg\+xml/.test(s.maskImage || s.webkitMaskImage || ''))
                        .map(() => (li.querySelector('b')?.textContent ?? '').trim()),
                ),
                grids: [...document.querySelectorAll('#laurels .kp-laurels > li')].filter((li) => getComputedStyle(li).display === 'grid').length,
                plates: [...document.querySelectorAll('#laurels .kp-platforms > span')].filter((span) => {
                    const s = getComputedStyle(span);
                    const root = getComputedStyle(document.documentElement);
                    const probe = document.createElement('i');
                    probe.style.color = root.getPropertyValue('--foreground');
                    document.body.append(probe);
                    const ink = getComputedStyle(probe).color;
                    probe.remove();
                    return s.display === 'inline-grid' && s.backgroundColor === ink;
                }).length,
            }));
            for (const name of rows.branches) found.push(`${theme} "${name}": a laurel branch is drawn`);
            if (rows.grids > 0) found.push(`${theme}: ${rows.grids} claims are laid out as a wreath grid`);
            if (rows.plates > 0) found.push(`${theme}: ${rows.plates} platforms are store badges`);
        }
        expect(found, found.join('\n')).toEqual([]);
    },
);

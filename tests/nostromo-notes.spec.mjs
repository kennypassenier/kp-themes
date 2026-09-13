// The direct fixes from Kenny's nostromo notes, read in every theme
// [scope-55, scope-57, scope-60].
//
// Kenny's first full pass through one theme on the review page left
// twenty-three notes; the form of 2026-09-13 approved these as direct
// fixes. Each is read on the catalogue page where he saw it, in all
// twenty-two themes, because a fault he found in nostromo was, measured,
// usually a fault in more than one.
//
// Drilled per KT3 on 2026-09-13: every test ran against the code before the
// fixes and went red, with the measured values recorded beside each.

import { readFileSync } from 'node:fs';
import { test, expect } from '@playwright/test';
import { contrast } from '../gates/colour.mjs';

const THEME_NAMES = JSON.parse(readFileSync(new globalThis.URL('../themes/order.json', import.meta.url), 'utf8'));

/** @param {import('@playwright/test').Page} page @param {string} theme */
const wear = async (page, theme) => {
    await page.evaluate((name) => document.documentElement.setAttribute('data-theme', name), theme);
    await expect.poll(() => page.evaluate(() => document.documentElement.getAttribute('data-theme'))).toBe(theme);
};

/** @param {import('@playwright/test').Page} page @param {string} url */
const open = async (page, url) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(url);
};

/**
 * Installs `window.kpPaint`: an element's ink and the colour it actually
 * sits on, every translucent ground on the way up composited, both as sRGB.
 * A canvas resolves whatever notation the browser reports (Firefox writes
 * `color(srgb …)` for a colour with alpha).
 *
 * @param {import('@playwright/test').Page} page
 */
const installPaint = (page) =>
    page.evaluate(() => {
        const ctx = /** @type {CanvasRenderingContext2D} */ (document.createElement('canvas').getContext('2d', { willReadFrequently: true }));
        /** @param {string} css @returns {number[]} rgba, alpha 0..1 */
        const rgba = (css) => {
            ctx.clearRect(0, 0, 1, 1);
            ctx.fillStyle = '#000';
            ctx.fillStyle = css;
            ctx.fillRect(0, 0, 1, 1);
            const d = ctx.getImageData(0, 0, 1, 1).data;
            return [d[0], d[1], d[2], d[3] / 255];
        };
        /** @param {Element} el */
        const ground = (el) => {
            /** @type {number[][]} */
            const layers = [];
            for (let e = /** @type {Element | null} */ (el); e; e = e.parentElement) {
                const c = rgba(getComputedStyle(e).backgroundColor);
                if (c[3] > 0) layers.push(c);
                if (c[3] >= 1) break;
            }
            let out = [255, 255, 255];
            for (const c of layers.reverse()) out = out.map((v, i) => Math.round(c[i] * c[3] + v * (1 - c[3])));
            return out;
        };
        /** @param {Element} el */
        const paint = (el) => {
            const ink = rgba(getComputedStyle(el).color);
            const under = ground(el);
            return { ink: ink.slice(0, 3).map((v, i) => Math.round(v * ink[3] + under[i] * (1 - ink[3]))), ground: under };
        };
        /** @type {any} */ (window).kpPaint = paint;
    });

test('nostromo’s badge is a pill, also when its text wraps onto two lines [scope-55]', async ({ page }) => {
    // Before: 3.2px corners on a 42px-tall wrapped badge (radius 0.2rem).
    await open(page, '/catalogue/feedback.html');
    await wear(page, 'nostromo');
    const shape = await page
        .locator('#badge-long .kp-badge')
        .first()
        .evaluate((el) => ({
            height: el.getBoundingClientRect().height,
            radius: Number.parseFloat(getComputedStyle(el).borderTopLeftRadius),
            lines: el.getClientRects().length,
            lineHeight: Number.parseFloat(getComputedStyle(el).lineHeight) || 20,
        }));
    expect(shape.height, 'the long badge wraps in the narrow pane').toBeGreaterThan(shape.lineHeight * 1.5);
    expect(shape.radius).toBeGreaterThanOrEqual(shape.height / 2);
});

test('a marked accelerator letter never splits its button’s label, in every theme [scope-57]', async ({ page }) => {
    // Before: 8px between the marked letter and the next glyph in 21 themes ("S ave"), 5.2px in phantom, and
    // the space in "Save as…" collapsed to nothing with the 8px flex gap in its place.
    // Each marked button is laid beside an unmarked twin — the same label as one text run — and the glyphs on
    // either side of the letter must sit where the twin puts them.
    await open(page, '/catalogue/button.html');
    const split = [];
    for (const theme of THEME_NAMES) {
        await wear(page, theme);
        const gaps = await page.locator('#accelerator .kp-button').evaluateAll((buttons) =>
            buttons.map((b) => {
                /** The box of the character at `index` in the button's text. @param {Element} root @param {number} index */
                const box = (root, index) => {
                    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
                    let at = 0;
                    for (let n = walker.nextNode(); n; n = walker.nextNode()) {
                        const len = (n.textContent ?? '').length;
                        if (index < at + len) {
                            const range = document.createRange();
                            range.setStart(n, index - at);
                            range.setEnd(n, index - at + 1);
                            return range.getBoundingClientRect();
                        }
                        at += len;
                    }
                    throw new Error(`no character ${index}`);
                };
                const key = /** @type {HTMLElement} */ (b.querySelector('[data-kp-key]'));
                const text = b.textContent ?? '';
                let keyAt = 0;
                const walker = document.createTreeWalker(b, NodeFilter.SHOW_TEXT);
                for (let n = walker.nextNode(); n && !key.contains(n); n = walker.nextNode()) keyAt += (n.textContent ?? '').length;
                const twin = /** @type {HTMLElement} */ (b.cloneNode(true));
                const twinKey = /** @type {HTMLElement} */ (twin.querySelector('[data-kp-key]'));
                twinKey.replaceWith(document.createTextNode(twinKey.textContent ?? ''));
                twin.normalize();
                twin.style.position = 'absolute';
                twin.style.visibility = 'hidden';
                b.after(twin);
                /** @param {Element} root */
                const around = (root) => {
                    const k = box(root, keyAt);
                    const after = box(root, keyAt + 1).left - k.right;
                    let before = null;
                    let p = keyAt - 1;
                    while (p >= 0 && /\s/.test(text[p])) p -= 1;
                    // Only a glyph of the same label, not an icon's.
                    if (p >= 0 && !b.querySelector('[aria-hidden="true"]')) before = k.left - box(root, p).right;
                    return { after, before };
                };
                const marked = around(b);
                const plain = around(twin);
                twin.remove();
                return { label: text.replace(/\s+/g, ' ').trim(), marked, plain };
            }),
        );
        for (const g of gaps) {
            if (Math.abs(g.marked.after - g.plain.after) > 1)
                split.push(`${theme} "${g.label}": ${g.marked.after.toFixed(1)}px after the marked letter, ${g.plain.after.toFixed(1)}px unmarked`);
            if (g.marked.before !== null && g.plain.before !== null && Math.abs(g.marked.before - g.plain.before) > 1)
                split.push(
                    `${theme} "${g.label}": ${g.marked.before.toFixed(1)}px before the marked letter, ${g.plain.before.toFixed(1)}px unmarked`,
                );
        }
    }
    expect(split).toEqual([]);
});

test('a button with an icon and a marked label keeps the icon’s gap, in every theme [scope-57]', async ({ page }) => {
    // A guard, not a drill: the fix for the split must not close the gap
    // between an icon and its label. Compared with the plain icon button.
    await open(page, '/catalogue/button.html');
    const moved = [];
    for (const theme of THEME_NAMES) {
        await wear(page, theme);
        const gap = (/** @type {string} */ selector) =>
            page.locator(selector).evaluate((b) => {
                const icon = /** @type {HTMLElement} */ (b.querySelector('[aria-hidden="true"]'));
                const range = document.createRange();
                const text = [...b.childNodes].find(
                    (n) =>
                        (n.nodeType === Node.TEXT_NODE && (n.textContent ?? '').trim()) ||
                        (n instanceof HTMLElement && n.hasAttribute('data-kp-key')),
                );
                if (text instanceof HTMLElement) return text.getBoundingClientRect().left - icon.getBoundingClientRect().right;
                const t = /** @type {Text} */ (text);
                const at = (t.textContent ?? '').search(/\S/);
                range.setStart(t, at);
                range.setEnd(t, at + 1);
                return range.getBoundingClientRect().left - icon.getBoundingClientRect().right;
            });
        const plain = await gap('#icons .kp-button:first-child');
        const marked = await gap('#accelerator [data-cat-icon-key]');
        if (Math.abs(plain - marked) > 1.5) moved.push(`${theme}: ${marked.toFixed(1)}px with a marked letter, ${plain.toFixed(1)}px without`);
    }
    expect(moved).toEqual([]);
});

test('the progress label reads at 4.5:1 on what is behind it, in every theme [scope-60]', async ({ page }) => {
    // Before: 20 registers painted .kp-progress__value as a plate in --primary
    // under the muted label — formal 1.53, dark 2.12, nostromo 2.20.
    await open(page, '/catalogue/feedback.html');
    await installPaint(page);
    const faint = [];
    for (const theme of THEME_NAMES) {
        await wear(page, theme);
        const p = await page.locator('#progress .kp-progress__value').evaluate((el) => /** @type {any} */ (window).kpPaint(el));
        const ratio = contrast(p.ink, p.ground);
        if (ratio < 4.5) faint.push(`${theme}: ${ratio.toFixed(2)} (rgb ${p.ink} on rgb ${p.ground})`);
    }
    expect(faint).toEqual([]);
});

test('the filled bar follows the holder’s shape, in every theme [scope-60]', async ({ page }) => {
    // Before: the fill was square (0px) in every theme, under holders rounded up to a pill.
    await open(page, '/catalogue/feedback.html');
    const square = [];
    for (const theme of THEME_NAMES) {
        await wear(page, theme);
        const shape = await page.locator('#progress .kp-progress[value="35"]').evaluate((el) => {
            const s = getComputedStyle(el);
            const bar = getComputedStyle(el, '::-moz-progress-bar');
            const box = el.getBoundingClientRect();
            const inset = Number.parseFloat(s.borderTopWidth) + Number.parseFloat(s.paddingTop);
            const inner = box.height - 2 * inset;
            const holder = Math.min(Number.parseFloat(s.borderTopRightRadius), box.height / 2);
            return {
                holder,
                inner,
                fill: Math.min(Number.parseFloat(bar.borderTopRightRadius) || 0, inner / 2),
                wanted: Math.max(0, Math.min(holder - inset, inner / 2)),
            };
        });
        if (Math.abs(shape.fill - shape.wanted) > 2)
            square.push(
                `${theme}: fill ${shape.fill.toFixed(1)}px in a holder of ${shape.holder.toFixed(1)}px (wanted ${shape.wanted.toFixed(1)}px)`,
            );
    }
    expect(square).toEqual([]);
});

test('toasts wear their severity on the alert tokens, in every theme [scope-60]', async ({ page }) => {
    // Before: the four variant toasts painted exactly like the plain one in 18 themes; nowhere did one wear its plate.
    await open(page, '/catalogue/feedback.html');
    const TOKENS = { success: '--success', info: '--info', warning: '--warning', destructive: '--destructive' };
    const wrong = [];
    for (const theme of THEME_NAMES) {
        await wear(page, theme);
        for (const [variant, token] of Object.entries(TOKENS)) {
            const read = await page.evaluate(
                ([v, t]) => {
                    const el = /** @type {HTMLElement} */ (document.querySelector(`#toasts .kp-toast--${v}`));
                    const probe = document.createElement('span');
                    el.append(probe);
                    probe.style.backgroundColor = `var(${t})`;
                    probe.style.color = `var(${t}-foreground)`;
                    const want = { plate: getComputedStyle(probe).backgroundColor, ink: getComputedStyle(probe).color };
                    probe.remove();
                    const s = getComputedStyle(el);
                    return { plate: s.backgroundColor, ink: s.color, want };
                },
                [variant, token],
            );
            if (read.plate !== read.want.plate || read.ink !== read.want.ink)
                wrong.push(`${theme} ${variant}: ${read.ink} on ${read.plate}, wanted ${read.want.ink} on ${read.want.plate}`);
        }
    }
    expect(wrong).toEqual([]);
});

test('every word on a severity toast reads at 4.5:1, its buttons included, in every theme [scope-60]', async ({ page }) => {
    await open(page, '/catalogue/feedback.html');
    await installPaint(page);
    const faint = [];
    for (const theme of THEME_NAMES) {
        await wear(page, theme);
        const reads = await page
            .locator('#toasts [class*="kp-toast--"], #toasts [class*="kp-toast--"] button')
            .evaluateAll((els) => els.map((el) => ({ what: el.className, .../** @type {any} */ (window).kpPaint(el) })));
        for (const r of reads) {
            const ratio = contrast(r.ink, r.ground);
            if (ratio < 4.5) faint.push(`${theme} ${r.what}: ${ratio.toFixed(2)}`);
        }
    }
    expect(faint).toEqual([]);
});

test('the dialog title keeps at least 0.5rem from its close button, in every theme [scope-60]', async ({ page }) => {
    // Before: the title's words ran under the close button in 12 themes (formal −24px, phantom −27px).
    await open(page, '/catalogue/overlays.html');
    const close = [];
    for (const theme of THEME_NAMES) {
        await wear(page, theme);
        const gap = await page.locator('#dialog-parts .kp-dialog').evaluate((dialog) => {
            const button = /** @type {HTMLElement} */ (dialog.querySelector('.kp-dialog__close')).getBoundingClientRect();
            const title = /** @type {HTMLElement} */ (dialog.querySelector('.kp-dialog__title'));
            const range = document.createRange();
            range.selectNodeContents(title);
            const beside = [...range.getClientRects()].filter((r) => r.bottom > button.top && r.top < button.bottom);
            const rem = Number.parseFloat(getComputedStyle(document.documentElement).fontSize);
            return { gap: beside.length ? Math.min(...beside.map((r) => button.left - r.right)) : Infinity, rem };
        });
        if (gap.gap < gap.rem / 2 - 0.5) close.push(`${theme}: ${gap.gap.toFixed(1)}px`);
    }
    expect(close).toEqual([]);
});

test('pagination marks the current page once, with no dot beside it, in every theme [scope-60]', async ({ page }) => {
    // Before: nostromo drew its nav LED (an 8px dot) in front of the current page number, beside the plate that already marks it.
    await open(page, '/catalogue/navigation.html');
    const dotted = [];
    for (const theme of THEME_NAMES) {
        await wear(page, theme);
        const marks = await page.locator('#pagination [aria-current="page"]').evaluateAll((els) =>
            els.map((el) =>
                ['::before', '::after'].filter((p) => {
                    const s = getComputedStyle(el, p);
                    return (
                        s.content !== 'none' &&
                        s.content !== 'normal' &&
                        s.display !== 'none' &&
                        (Number.parseFloat(s.width) > 0 || s.content !== '""')
                    );
                }),
            ),
        );
        for (const m of marks) if (m.length) dotted.push(`${theme}: ${m.join(', ')}`);
    }
    expect(dotted).toEqual([]);
});

test('laurels and platforms keep inner spacing where they draw a box, in every theme [scope-60]', async ({ page }) => {
    // Before: nostromo boxed each laurel (a border and a card ground) with 0px between the words and the box.
    await open(page, '/catalogue/media.html');
    const tight = [];
    for (const theme of THEME_NAMES) {
        await wear(page, theme);
        const items = await page.locator('#laurels .kp-laurels > li, #laurels .kp-platforms > span').evaluateAll((els) =>
            els.map((el) => {
                const s = getComputedStyle(el);
                const boxed =
                    s.backgroundColor !== 'rgba(0, 0, 0, 0)' ||
                    ['Top', 'Right', 'Bottom', 'Left'].filter(
                        (side) => Number.parseFloat(s.getPropertyValue(`border-${side.toLowerCase()}-width`)) > 0,
                    ).length >= 3;
                const rem = Number.parseFloat(getComputedStyle(document.documentElement).fontSize);
                return {
                    what: el.tagName.toLowerCase() === 'li' ? 'laurel' : 'platform',
                    boxed,
                    inline: Math.min(Number.parseFloat(s.paddingLeft), Number.parseFloat(s.paddingRight)),
                    block: Math.min(Number.parseFloat(s.paddingTop), Number.parseFloat(s.paddingBottom)),
                    rem,
                };
            }),
        );
        for (const item of items) {
            if (item.boxed && (item.inline < item.rem * 0.375 || item.block < item.rem * 0.125))
                tight.push(`${theme} ${item.what}: ${item.block}px / ${item.inline}px inside its box`);
        }
    }
    expect([...new Set(tight)]).toEqual([]);
});

test('the theme menu scrolls inside its rounded corners, in both shapes and every theme [scope-60]', async ({ page }) => {
    // Before: the rounded popover was itself the scroll box in every theme with a radius (formal 6px, nostromo 12px, pastel 17.6px…),
    // so its scrollbar ran into the corners. Headless browsers draw no scrollbar to photograph, so this reads the geometry: the box
    // that scrolls has square corners and sits inside a rounded box that clips it.
    await open(page, '/catalogue/page.html');
    const outside = [];
    for (const theme of THEME_NAMES) {
        await wear(page, theme);
        for (const shape of ['#theme-menu .kp-theme-menu', '#theme-menu-react .kp-theme-menu']) {
            const read = await page.locator(shape).evaluate((menu) => {
                const all = /** @type {HTMLElement[]} */ ([...menu.querySelectorAll('*')]);
                const scroller = all.find((el) => {
                    const s = getComputedStyle(el);
                    return /(auto|scroll)/.test(s.overflowY) && el.scrollHeight > el.clientHeight + 1;
                });
                if (!scroller) return { fault: 'nothing scrolls' };
                const s = getComputedStyle(scroller);
                const radius = Math.max(
                    Number.parseFloat(s.borderTopRightRadius),
                    Number.parseFloat(s.borderBottomRightRadius),
                    Number.parseFloat(s.borderTopLeftRadius),
                    Number.parseFloat(s.borderBottomLeftRadius),
                );
                if (radius > 0) return { fault: `the scroll box itself has ${radius}px corners` };
                // Square inside rounded: the rounded box around it must clip.
                for (let e = scroller.parentElement; e && e !== menu; e = e.parentElement) {
                    const a = getComputedStyle(e);
                    const r = Math.max(Number.parseFloat(a.borderTopRightRadius), Number.parseFloat(a.borderBottomRightRadius));
                    if (r > 0 && a.overflowY === 'visible' && a.clipPath === 'none')
                        return { fault: `the ${r}px box around the scroll box does not clip it` };
                }
                return { fault: null };
            });
            if (read.fault) outside.push(`${theme} ${shape.startsWith('#theme-menu-react') ? 'React' : 'markup'}: ${read.fault}`);
        }
    }
    expect(outside).toEqual([]);
});

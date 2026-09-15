// Every redaction covers its phrase, in every theme [fix-33, Kenny 2026-09-15].
//
// Kenny's look at catalogue/page-effects.html#dossier in formal, pastel and
// grotesk (FireDragon): the third redaction was over twice the height of the
// others, covered none of its words and sat in front of "the contractor".
// The cause is CSS: seven registers drew the bar as an absolutely positioned
// `mark::after` on an inline `<mark>` that may wrap. When it wraps, the
// bar's containing block is not a box per line but the rectangle from the
// start of the first fragment to the end of the last one (CSS 2 §10.1, item
// 4) — the end of one line and the start of the next give a narrow box two
// lines tall, left of where the words are. Kenny's answer (scope-93): each
// of those registers paints the bar as the phrase's own background, cloned
// onto every line (`box-decoration-break: clone`), as lapis, nostromo and
// forest already did. High-contrast (inline-block) and the registers whose
// marks never wrap (`white-space: nowrap`) kept theirs.
//
// What this reads, per theme and per redaction, is what the browser paints
// [KT13], not the rule that paints it — the registers use pseudo bars, the
// mark's own background, clip-paths and patterns, and a reading of any one
// of them would pass the others by construction. The card is screenshotted
//   - as it is;
//   - with only that mark's text made transparent: any pixel that changes
//     inside the text's rectangles is a glyph the redaction did not hide;
//   - with only that mark's paint and text switched off: the pixels that
//     differ from the first shot are the redaction, per line of the phrase;
//   - with the paint still off and the text in one flat ink: the pixels that
//     differ from the previous shot are where the words' glyphs are.
// The bar, per line of the phrase: the redaction contains the words' ink
// (1px of rounding allowed); overall, it is no taller than a quarter more
// than one line box per line the phrase takes; and no glyph pixel shows.
//
// Two ways to lay the phrase out. As the page does at 1920×1000 and
// 1400×900 — the widths Kenny reviews at, where in this firefox only
// nostromo's and shade-light's third phrase happens to break. And at its
// break: the paragraph narrowed, phrase by phrase, until the phrase — allowed
// to wrap for that one measurement — would break over two lines, then
// measured as the theme lays it out at that width. That is the case Kenny's
// window met, whatever his font sizes, and it reaches every theme.
//
// Drill [KT3], firefox, 2026-09-15: on be9c034a, "at the break" lists
// formal, pastel, sepia, blueprint, solstice, shade-light and grotesk, and
// both review sizes list shade-light (a bar 5×44px at the end of the first
// line); after the seven registers' change all three are green. Taking only
// `box-decoration-break: clone` out of formal stays green, and that is the
// finding rather than a gap: a background on an inline already paints each
// line's fragment, and clone only gives each fragment its own padding and
// radius.
//
// Firefox only — see the skip in beforeEach.

import { readFileSync } from 'node:fs';
import process from 'node:process';
import { expect, test } from '@playwright/test';
import { waitForJudging } from './helpers/catalogue.mjs';
import { useEmptyRegister } from './helpers/empty-register.mjs';

const THEMES = /** @type {string[]} */ (JSON.parse(readFileSync(new globalThis.URL('../themes/order.json', import.meta.url), 'utf8')));

const VIEWPORTS = [
    { width: 1920, height: 1000 },
    { width: 1400, height: 900 },
];

/** Rounding allowed on each edge, in CSS pixels. */
const SLACK = 1;

test.describe.configure({ timeout: 300_000 });

/** The probe rules: one mark without its paint, its words in one flat ink, its words gone, a phrase allowed to wrap, and nothing moving. */
const PROBE_CSS = `
    *, *::before, *::after { transition: none !important; }
    mark:is([data-probe='bare'], [data-probe='ink']),
    mark:is([data-probe='bare'], [data-probe='ink'])::before,
    mark:is([data-probe='bare'], [data-probe='ink'])::after {
        background: none !important; box-shadow: none !important; border-color: transparent !important; clip-path: none !important;
        outline: none !important; text-decoration: none !important; filter: none !important; opacity: 1 !important;
        color: transparent !important; -webkit-text-fill-color: transparent !important; text-shadow: none !important;
    }
    mark:is([data-probe='bare'], [data-probe='ink'])::before, mark:is([data-probe='bare'], [data-probe='ink'])::after { content: none !important; }
    mark[data-probe='ink'] { color: #f0f !important; -webkit-text-fill-color: #f0f !important; }
    [data-probe-text] { color: transparent !important; -webkit-text-fill-color: transparent !important; text-shadow: none !important; }
    mark[data-probe-wrap] { white-space: normal !important; }
`;

/**
 * Decode two PNG screenshots in the page and compare them: the bounding box
 * of the pixels that differ, overall and inside each horizontal band, and
 * the count of them inside each rectangle. Runs in the page.
 *
 * @param {[string, string, {left:number, top:number, right:number, bottom:number}[], {top:number, bottom:number}[]]} args
 */
const compare = async ([a, b, rects, bands]) => {
    /** @param {string} b64 */
    const load = async (b64) => {
        const bitmap = await createImageBitmap(await (await fetch(`data:image/png;base64,${b64}`)).blob());
        const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
        const ctx = /** @type {OffscreenCanvasRenderingContext2D} */ (canvas.getContext('2d'));
        ctx.drawImage(bitmap, 0, 0);
        return ctx.getImageData(0, 0, bitmap.width, bitmap.height);
    };
    /** @typedef {{left:number, top:number, right:number, bottom:number}} Box */
    /** @param {Box | null} box @param {number} x @param {number} y @returns {Box} */
    const grow = (box, x, y) => {
        if (!box) return { left: x, top: y, right: x + 1, bottom: y + 1 };
        box.left = Math.min(box.left, x);
        box.top = Math.min(box.top, y);
        box.right = Math.max(box.right, x + 1);
        box.bottom = Math.max(box.bottom, y + 1);
        return box;
    };
    const [one, two] = await Promise.all([load(a), load(b)]);
    const w = Math.min(one.width, two.width);
    const h = Math.min(one.height, two.height);
    /** @type {Box | null} */
    let box = null;
    /** @type {(Box | null)[]} */
    const inBand = bands.map(() => null);
    const inside = rects.map(() => 0);
    for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
            const i = (y * one.width + x) * 4;
            const j = (y * two.width + x) * 4;
            const d = Math.abs(one.data[i] - two.data[j]) + Math.abs(one.data[i + 1] - two.data[j + 1]) + Math.abs(one.data[i + 2] - two.data[j + 2]);
            if (d <= 24) continue;
            box = grow(box, x, y);
            bands.forEach((band, k) => {
                if (y >= band.top && y < band.bottom) inBand[k] = grow(inBand[k], x, y);
            });
            rects.forEach((r, k) => {
                if (x >= Math.floor(r.left) && x < Math.ceil(r.right) && y >= Math.floor(r.top) && y < Math.ceil(r.bottom)) inside[k]++;
            });
        }
    }
    return { box, inBand, inside };
};

/**
 * Where each phrase sits, relative to the card.
 *
 * @param {import('@playwright/test').Locator} card
 */
const readMarks = (card) =>
    card.evaluate((el) => {
        const origin = el.getBoundingClientRect();
        return [...el.querySelectorAll('mark')].map((mark) => {
            const range = document.createRange();
            range.selectNodeContents(mark);
            const rects = [...range.getClientRects()]
                .filter((r) => r.width > 0.5)
                .map((r) => ({ left: r.left - origin.left, top: r.top - origin.top, right: r.right - origin.left, bottom: r.bottom - origin.top }));
            const p = /** @type {HTMLElement} */ (mark.parentElement);
            let lineHeight = Number.parseFloat(getComputedStyle(p).lineHeight);
            if (!Number.isFinite(lineHeight)) lineHeight = 1.2 * Number.parseFloat(getComputedStyle(p).fontSize);
            const lines = new Set(rects.map((r) => Math.round(r.top))).size;
            return { text: mark.textContent ?? '', rects, lineHeight, lines };
        });
    });

/**
 * One phrase, measured as it lies: its text, its ink, its redaction.
 *
 * @param {import('@playwright/test').Locator} card
 * @param {number} index
 */
async function measureMark(card, index) {
    const page = card.page();
    const mark = (await readMarks(card))[index];
    const shot = async () => (await card.screenshot({ animations: 'disabled', caret: 'hide' })).toString('base64');
    /** @param {string | null} state */
    const probe = (state) =>
        card.evaluate(
            (el, [i, s]) => {
                const m = el.querySelectorAll('mark')[/** @type {number} */ (i)];
                const span = m.querySelector(':scope > [data-probe-text]');
                if (span) span.replaceWith(...span.childNodes);
                m.removeAttribute('data-probe');
                if (s === 'wordless') {
                    const words = document.createElement('span');
                    words.setAttribute('data-probe-text', '');
                    while (m.firstChild) words.append(m.firstChild);
                    m.append(words);
                } else if (s) m.setAttribute('data-probe', /** @type {string} */ (s));
            },
            [index, state],
        );
    const whole = await shot();
    await probe('wordless');
    const wordless = await shot();
    await probe('bare');
    const bare = await shot();
    await probe('ink');
    const inked = await shot();
    await probe(null);
    // One band per line of the phrase, the height of its text: a wider band
    // would reach into the next line's fragment of the same phrase.
    const bands = mark.rects.map((r) => ({ top: Math.floor(r.top), bottom: Math.ceil(r.bottom) }));
    const shows = await page.evaluate(compare, [whole, wordless, mark.rects, []]);
    const ink = await page.evaluate(compare, [inked, bare, [], bands]);
    const paint = await page.evaluate(compare, [whole, bare, [], bands]);
    return { ...mark, index, ink: ink.inBand, box: paint.box, bars: paint.inBand, showing: shows.inside.reduce((a, b) => a + b, 0) };
}

/**
 * Narrow the phrase's paragraph until the phrase, allowed to wrap, would
 * break over two lines; false when it never does (an atomic mark).
 *
 * @param {import('@playwright/test').Locator} card
 * @param {number} index
 */
const narrowUntilItBreaks = (card, index) =>
    card.evaluate((el, i) => {
        const m = el.querySelectorAll('mark')[i];
        const p = /** @type {HTMLElement} */ (m.parentElement);
        const full = p.getBoundingClientRect().width;
        m.setAttribute('data-probe-wrap', '');
        const range = document.createRange();
        range.selectNodeContents(m);
        let found = false;
        for (let w = Math.floor(full); w > full * 0.3; w -= 2) {
            p.style.inlineSize = `${w}px`;
            if (new Set([...range.getClientRects()].filter((r) => r.width > 0.5).map((r) => Math.round(r.top))).size > 1) {
                found = true;
                break;
            }
        }
        m.removeAttribute('data-probe-wrap');
        if (!found) p.style.inlineSize = '';
        return found;
    }, index);

/** @param {import('@playwright/test').Locator} card */
const widen = (card) =>
    card.evaluate((el) => {
        for (const p of el.querySelectorAll('p')) /** @type {HTMLElement} */ (p).style.inlineSize = '';
    });

/** @param {import('@playwright/test').Page} page @param {string} theme */
async function setTheme(page, theme) {
    await page.evaluate((name) => import('/js/theme-core.js').then((m) => m.applyTheme(name)), theme);
    await waitForJudging(page);
    await page.waitForFunction((name) => document.documentElement.getAttribute('data-theme') === name, theme);
    const card = page.locator('#dossier [data-cat-effect="armed"] .kp-card');
    await expect(card).toBeVisible();
    await card.scrollIntoViewIfNeeded();
    await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
    return card;
}

/**
 * The faults in one measured phrase, and its line for the report.
 *
 * @param {string} theme @param {Awaited<ReturnType<typeof measureMark>>} row
 */
function judge(theme, row) {
    const px = (/** @type {number} */ n) => n.toFixed(1);
    const rect = (/** @type {{left:number, top:number, right:number, bottom:number} | null} */ r) =>
        r ? `[${px(r.left)},${px(r.top)} ${px(r.right - r.left)}×${px(r.bottom - r.top)}]` : 'none';
    const tallest = Math.max(row.lineHeight, ...row.rects.map((r) => r.bottom - r.top));
    const line =
        `${theme} #${row.index + 1} "${row.text}": text ${row.rects.map(rect).join(' ')}, ink ${row.ink.map(rect).join(' ')}, ` +
        `redaction ${rect(row.box)} (per line ${row.bars.map(rect).join(' ')}), lines ${row.lines}, line box ${px(row.lineHeight)}, glyph pixels showing ${row.showing}`;
    const why = [];
    if (!row.box) why.push('paints nothing');
    else {
        row.ink.forEach((ink, k) => {
            const bar = row.bars[k];
            if (!ink) return;
            if (!bar || ink.left < bar.left - SLACK || ink.right > bar.right + SLACK || ink.top < bar.top - SLACK || ink.bottom > bar.bottom + SLACK)
                why.push(`line ${k + 1}: redaction ${rect(bar)} does not contain the words' ink ${rect(ink)}`);
        });
        const height = row.box.bottom - row.box.top;
        if (height > row.lines * tallest * 1.25) why.push(`redaction ${height}px tall over ${row.lines} line(s) of ${px(tallest)}px`);
    }
    if (row.showing > 0) why.push(`${row.showing} glyph pixels show through`);
    return { line, fault: why.length ? `${theme} #${row.index + 1} "${row.text}": ${why.join('; ')}` : null };
}

test.beforeEach(async ({ context, page, browserName }) => {
    // Firefox only, for now. In chromium the catalogue's reading of its
    // blocks never finishes once the theme reaches dark (measured on
    // be9c034a's own stylesheets, 15 s per theme, without this spec's probes),
    // and the screenshots this spec compares then differ by more than the
    // redaction: a bar read 42 to 71px tall in light, forest, sepia,
    // shade-dark and nostromo, a different set on each run. That is a fault
    // of the page, open for Kenny; a comparison that answers differently per
    // run is not a test [RULES, 2026-09-09].
    test.skip(browserName === 'chromium', 'the catalogue reading never settles in chromium from dark on');
    await useEmptyRegister(context);
    // The covered state is the armed one, which a reader who asked for less motion never sees.
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.addInitScript((css) => {
        addEventListener('DOMContentLoaded', () => {
            const style = document.createElement('style');
            style.textContent = css;
            document.head.append(style);
        });
    }, PROBE_CSS);
});

for (const viewport of VIEWPORTS) {
    test(
        `every redaction on the dossier covers its phrase as the page lays it out at ${viewport.width}×${viewport.height} [fix-33]`,
        { tag: ['@sweep', '@component:page-effects'] },
        async ({ page }) => {
            await page.setViewportSize(viewport);
            await page.goto('/catalogue/page-effects.html#dossier');
            await waitForJudging(page);
            /** @type {string[]} */
            const faults = [];
            /** @type {string[]} */
            const report = [];
            for (const theme of THEMES) {
                const card = await setTheme(page, theme);
                for (let i = 0; i < 3; i++) {
                    const { line, fault } = judge(theme, await measureMark(card, i));
                    report.push(line);
                    if (fault) faults.push(fault);
                }
            }
            if (process.env.KP_REDACTION_REPORT) console.log(`as laid out, ${viewport.width}×${viewport.height}\n${report.join('\n')}`);
            expect(faults).toEqual([]);
        },
    );
}

test(
    'every redaction on the dossier covers its phrase wherever the line breaks it [fix-33]',
    { tag: ['@sweep', '@component:page-effects'] },
    async ({ page }) => {
        await page.setViewportSize(VIEWPORTS[1]);
        await page.goto('/catalogue/page-effects.html#dossier');
        await waitForJudging(page);
        /** @type {string[]} */
        const faults = [];
        /** @type {string[]} */
        const report = [];
        for (const theme of THEMES) {
            const card = await setTheme(page, theme);
            for (let i = 0; i < 3; i++) {
                const breaks = await narrowUntilItBreaks(card, i);
                const { line, fault } = judge(theme, await measureMark(card, i));
                report.push(`${breaks ? 'at its break' : 'never breaks'}: ${line}`);
                if (fault) faults.push(fault);
                await widen(card);
            }
        }
        if (process.env.KP_REDACTION_REPORT) console.log(`at the break\n${report.join('\n')}`);
        expect(faults).toEqual([]);
    },
);

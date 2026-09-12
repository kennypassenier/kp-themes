// The six surfaces of "showing data" and the browser's own hooks, swept
// over every theme [data-surfaces, Kenny 2026-09-12].
//
// Phase 7 found these declared in css/components.css and in all twenty-two
// registers — roughly a hundred and thirty rules — and read by no browser
// test at all. gates/check-register-coverage.mjs forces every register to
// carry a rule for them, and accepts any rule with a non-empty body: so
// the rules existed because a gate demanded them, and nothing anywhere
// measured what they drew. The case that made it worth closing rather
// than recording is the masked value: a register that loses the masking
// puts a password or an account number on screen in plain sight, and the
// first report would come from a consumer.
//
// The bar is deliberately about the PROPERTY each surface promises, not
// about a particular look — a theme may style these however it likes, and
// most do. What no theme may do is take the promise away.
//
// Drilled 2026-09-12 in firefox, one removal per assertion; the record is
// beside each test.
import { readdirSync } from 'node:fs';
import { expect, test } from '@playwright/test';
import { wearTheme } from './ring.mjs';

const PAGE = '/tests/fixtures/data-surfaces.html';

const THEMES = readdirSync(new URL('../showcase/themes/', import.meta.url))
    .filter((n) => n.endsWith('.html'))
    .map((n) => n.slice(0, -'.html'.length));

test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(PAGE);
});

// Drill: `letter-spacing` and the mono family removed from `.kp-masked` in
// css/components.css -> red on every theme, "the masked value is set in
// the body face". Restored: green.
test('a masked value keeps its own shape in every theme [data-surfaces]', async ({ page }) => {
    const broken = [];
    for (const theme of THEMES) {
        await wearTheme(page, theme);
        const seen = await page.locator('[data-test="masked"]').evaluate((el) => {
            const s = getComputedStyle(el);
            return { family: s.fontFamily, spacing: s.letterSpacing };
        });
        // A masked value is monospaced and spaced out, so the dots read as
        // a fixed number of hidden characters rather than as a word.
        const mono = /mono|consol|courier|menlo/i.test(seen.family);
        const spaced = Number.parseFloat(seen.spacing) > 0;
        if (!mono || !spaced) broken.push(`${theme}: family ${seen.family.slice(0, 30)}, spacing ${seen.spacing}`);
    }
    expect(broken, `the masked value lost its shape in:\n${broken.join('\n')}`).toEqual([]);
});

// Drill: `font-variant-numeric` removed from the `.kp-numeric` rule ->
// red on every theme. Restored: green.
test('numerals line up in a column in every theme [data-surfaces]', async ({ page }) => {
    const broken = [];
    for (const theme of THEMES) {
        await wearTheme(page, theme);
        for (const which of ['numeric', 'timestamp']) {
            const seen = await page.locator(`[data-test="${which}"]`).evaluate((el) => getComputedStyle(el).fontVariantNumeric);
            if (!seen.includes('tabular-nums')) broken.push(`${theme} ${which}: ${seen}`);
        }
    }
    expect(broken, `digits do not line up in:\n${broken.join('\n')}`).toEqual([]);
});

// Drill: `text-overflow: ellipsis` removed from `.kp-truncate` -> red on
// every theme, "the text is cut with no sign that it was". Restored: green.
test('truncated text says it was truncated in every theme [data-surfaces]', async ({ page }) => {
    const broken = [];
    for (const theme of THEMES) {
        await wearTheme(page, theme);
        const seen = await page.locator('[data-test="truncate"]').evaluate((el) => {
            const s = getComputedStyle(el);
            return { overflow: s.textOverflow, wrap: s.whiteSpace, clipped: el.scrollWidth > el.clientWidth, title: el.title.length };
        });
        // Cut short AND marked as cut: an ellipsis, one line, and the whole
        // string still reachable through the title.
        if (seen.overflow !== 'ellipsis' || seen.wrap !== 'nowrap' || !seen.clipped || seen.title === 0)
            broken.push(`${theme}: ${seen.overflow} / ${seen.wrap} / clipped ${seen.clipped} / title ${seen.title}`);
    }
    expect(broken, `truncation hides data rather than shortening it in:\n${broken.join('\n')}`).toEqual([]);
});

// Drill: the `border` removed from `.kp-empty` -> red on every theme, "an
// empty state that is indistinguishable from a blank area". Restored: green.
test('an empty state looks like one in every theme [data-surfaces]', async ({ page }) => {
    const broken = [];
    for (const theme of THEMES) {
        await wearTheme(page, theme);
        const seen = await page.locator('[data-test="empty"]').evaluate((el) => {
            const s = getComputedStyle(el);
            return { w: Number.parseFloat(s.borderTopWidth), style: s.borderTopStyle, bg: s.backgroundColor, pad: Number.parseFloat(s.paddingTop) };
        });
        // Either a boundary or a ground of its own, and room to breathe:
        // what it may not be is nothing at all.
        const bounded = seen.w > 0 && seen.style !== 'none';
        const grounded = seen.bg !== 'rgba(0, 0, 0, 0)' && seen.bg !== 'transparent';
        if ((!bounded && !grounded) || seen.pad <= 0)
            broken.push(`${theme}: border ${seen.w}px ${seen.style}, ground ${seen.bg}, padding ${seen.pad}`);
    }
    expect(broken, `an empty state is indistinguishable from a blank area in:\n${broken.join('\n')}`).toEqual([]);
});

// Drill: `overflow-wrap: anywhere` removed from the `.kp-url, .kp-id` rule
// -> red on every theme, the identifier pushing its box sideways.
test('a long identifier wraps rather than pushing the page sideways [data-surfaces]', async ({ page }) => {
    const broken = [];
    for (const theme of THEMES) {
        await wearTheme(page, theme);
        const seen = await page.locator('[data-test="id"]').evaluate((el) => getComputedStyle(el).overflowWrap);
        if (!/anywhere|break-word/.test(seen)) broken.push(`${theme}: ${seen}`);
    }
    expect(broken, `a long identifier cannot wrap in:\n${broken.join('\n')}`).toEqual([]);
});

// ── The browser's own hooks ───────────────────────────────────────────
//
// Drill: `::placeholder` colour removed from css/_rules.css -> red on
// every theme, the placeholder reading as a filled-in value.
test('a placeholder is told apart from a value in every theme [data-surfaces]', async ({ page }) => {
    const broken = [];
    for (const theme of THEMES) {
        await wearTheme(page, theme);
        const seen = await page.locator('[data-test="placeholder"]').evaluate((el) => {
            const s = getComputedStyle(el);
            const p = getComputedStyle(el, '::placeholder');
            return { value: s.color, placeholder: p.color };
        });
        if (seen.placeholder === seen.value) broken.push(`${theme}: both ${seen.value}`);
    }
    expect(broken, `a placeholder reads as a filled-in value in:\n${broken.join('\n')}`).toEqual([]);
});

// Drill: the `:disabled` rule removed from css/components.css -> red on
// every theme, a locked field looking exactly like an open one.
test('a disabled field says it is disabled in every theme [data-surfaces]', async ({ page }) => {
    const broken = [];
    for (const theme of THEMES) {
        await wearTheme(page, theme);
        const seen = await page.evaluate(() => {
            const read = (sel) => {
                const s = getComputedStyle(document.querySelector(sel));
                return `${s.backgroundColor}|${s.color}|${s.opacity}|${s.borderColor}|${s.cursor}`;
            };
            return { open: read('[data-test="placeholder"]'), locked: read('[data-test="disabled"]') };
        });
        if (seen.open === seen.locked) broken.push(`${theme}: a locked field paints exactly as an open one`);
    }
    expect(broken, `a disabled field is indistinguishable in:\n${broken.join('\n')}`).toEqual([]);
});

// Drill: `accent-color` removed from the theme block in css/themes.css ->
// red on every theme, the checkbox painting in the browser's own blue.
test('the browser paints its own controls in the theme in every theme [data-surfaces]', async ({ page }) => {
    const broken = [];
    for (const theme of THEMES) {
        await wearTheme(page, theme);
        const value = await page.locator('[data-test="checkbox"]').evaluate((el) => getComputedStyle(el).accentColor);
        if (value === 'auto') broken.push(`${theme}: ${value}`);
    }
    expect(broken, `the browser paints its own controls in its own colours in:\n${broken.join('\n')}`).toEqual([]);
});

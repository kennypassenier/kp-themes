// The utility API measured on real components [TH93, AR17].
//
// One test per family. Each measures the utility ON a component that
// sets the same property itself, next to the same component without the
// utility, because the promise of the utilities layer is that it wins
// inside a component without !important. A bare div would pass with the
// layer order broken and prove nothing.
//
// Every test here was drilled per KT3: the rule it measures was removed
// from css/utilities.css and the test went red. The removed rule is
// named in the comment above each one.

import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';

const FIXTURE = '/tests/fixtures/utilities.html';

/** @type {string[]} */
const THEMES = JSON.parse(readFileSync(new URL('../themes/order.json', import.meta.url), 'utf8'));

const box = (page, name) =>
    page.evaluate((n) => {
        const el = document.querySelector(`[data-test="${n}"]`);
        const r = el.getBoundingClientRect();
        const s = getComputedStyle(el);
        return {
            width: r.width,
            left: r.left,
            right: r.right,
            top: r.top,
            bottom: r.bottom,
            display: s.display,
            padding: s.paddingTop,
            paddingLeft: s.paddingLeft,
            gap: s.columnGap,
            fontSize: s.fontSize,
            fontWeight: s.fontWeight,
            textTransform: s.textTransform,
            lineHeight: s.lineHeight,
            maxInlineSize: s.maxInlineSize,
        };
    }, name);

/** Resolve a token the way the page does, so a test compares against the
 * theme rather than against a number typed here. */
const token = (page, name) =>
    page.evaluate((n) => {
        const el = document.createElement('span');
        el.style.setProperty('--probe', `var(${n})`);
        document.body.append(el);
        const v = getComputedStyle(el).getPropertyValue('--probe').trim();
        el.remove();
        return v;
    }, name);

/** A length token in pixels, resolved by the browser rather than by
 * assuming a 16px root. */
const px = (page, expr) =>
    page.evaluate((e) => {
        const el = document.createElement('div');
        el.style.position = 'absolute';
        el.style.inlineSize = e;
        document.body.append(el);
        const w = el.getBoundingClientRect().width;
        el.remove();
        return w;
    }, expr);

test.describe('the utility API', () => {
    test.beforeEach(async ({ page }) => {
        await page.setViewportSize({ width: 1280, height: 900 });
        await page.goto(FIXTURE);
    });

    // Drill: removing `padding` from .kp-p-2xl leaves the card's own padding.
    test('a spacing utility replaces a component its own padding [TH93]', async ({ page }) => {
        const withUtility = await box(page, 'spacing');
        const plain = await box(page, 'spacing-plain');
        expect(withUtility.padding).not.toBe(plain.padding);
        const wanted = await px(page, await token(page, '--kp-space-2xl'));
        expect(Number.parseFloat(withUtility.padding)).toBeCloseTo(wanted, 1);
    });

    // The same class follows the theme rather than a number typed here:
    // retuning the token moves the padding with it.
    test('a spacing utility follows the token when a theme retunes it [TH93]', async ({ page }) => {
        const before = Number.parseFloat((await box(page, 'spacing')).padding);
        await page.evaluate(() => {
            document.documentElement.style.setProperty('--kp-space-2xl', '3rem');
        });
        const after = Number.parseFloat((await box(page, 'spacing')).padding);
        expect(after).not.toBeCloseTo(before, 1);
        expect(after).toBeCloseTo(await px(page, '3rem'), 1);
    });

    // Drill: removing `column-gap` from .kp-gap-2xl leaves the row's own gap.
    test('a gap utility replaces a container its own gap [TH93]', async ({ page }) => {
        const a = await box(page, 'gap-a');
        const b = await box(page, 'gap-b');
        const wanted = await px(page, await token(page, '--kp-space-2xl'));
        expect(b.left - a.right).toBeCloseTo(wanted, 0);
        // And it is genuinely wider than what the row sets on its own.
        const own = await px(page, await token(page, '--kp-row-gap, var(--kp-space-sm)'));
        expect(wanted).toBeGreaterThan(own);
    });

    // Drill: removing `display` from .kp-d-block leaves the button inline-flex.
    test('a display utility beats a component its own display [TH93]', async ({ page }) => {
        expect((await box(page, 'display')).display).toBe('block');
        expect((await box(page, 'display-plain')).display).not.toBe('block');
    });

    // Drill: removing `justify-content` from .kp-justify-between packs the
    // two badges against the start of the row.
    test('an alignment utility beats a container its own alignment [TH93]', async ({ page }) => {
        const row = await box(page, 'flex');
        const a = await box(page, 'flex-a');
        const b = await box(page, 'flex-b');
        expect(a.left - row.left).toBeLessThan(2);
        expect(row.right - b.right).toBeLessThan(2);
        // The two are actually pushed apart, not merely both present.
        expect(b.left - a.right).toBeGreaterThan(row.width / 2);
    });

    // Drill: removing `font-weight` from .kp-fw-bold, `text-transform` from
    // .kp-tt-upper or `line-height` from .kp-lh-loose each returns the badge
    // to its own value.
    test('text utilities beat a component its own type settings [TH93]', async ({ page }) => {
        const styled = await box(page, 'text');
        const plain = await box(page, 'text-plain');
        expect(styled.fontWeight).toBe('700');
        expect(styled.fontWeight).not.toBe(plain.fontWeight);
        expect(styled.textTransform).toBe('uppercase');
        expect(styled.textTransform).not.toBe(plain.textTransform);
        expect(Number.parseFloat(styled.lineHeight)).toBeGreaterThan(Number.parseFloat(plain.lineHeight));
    });

    // Drill: removing `inline-size` from .kp-w-full shrinks the button back
    // to its own content width.
    test('a width utility beats a component its own width [TH93]', async ({ page }) => {
        const full = await box(page, 'size');
        const auto = await box(page, 'size-plain');
        expect(full.width).toBeGreaterThan(auto.width * 2);
        const body = await page.evaluate(() => document.body.clientWidth);
        expect(full.width).toBeCloseTo(body, 0);
    });

    // Drill: removing `max-inline-size` from .kp-max-w-prose lets the
    // paragraph run the full width of the body.
    test('a measure utility reads the same knob its layout class does [TH93]', async ({ page }) => {
        const prose = await box(page, 'size-prose');
        const body = await page.evaluate(() => document.body.clientWidth);
        expect(prose.width).toBeLessThan(body);
        await page.evaluate(() => {
            document.documentElement.style.setProperty('--kp-prose-max', '10ch');
        });
        const narrowed = await box(page, 'size-prose');
        expect(narrowed.width).toBeLessThan(prose.width);
    });

    // Drill: remove `font-size` from .kp-fs-md in css/utilities.css and
    // the badge keeps its own smaller size, so the two read the same.
    test('a font-size utility reads the declared step [TH93, TH94]', async ({ page }) => {
        const styled = await box(page, 'text');
        const plain = await box(page, 'text-plain');
        expect(styled.fontSize).not.toBe(plain.fontSize);
        expect(Number.parseFloat(styled.fontSize)).toBeCloseTo(await px(page, await token(page, '--kp-text-md')), 1);
    });

    // TH94's second half, and it was already true before this round: the
    // browser's own defaults give a descending ladder. The test exists so
    // that a theme cannot quietly flatten it.
    test('h1 to h6 descend strictly in every theme [TH94]', async ({ page }) => {
        await page.evaluate(() => {
            const box = document.createElement('div');
            box.dataset.test = 'headings';
            box.innerHTML = [1, 2, 3, 4, 5, 6].map((n) => `<h${n}>H${n}</h${n}>`).join('');
            document.body.append(box);
        });
        /** @type {string[]} */
        const flat = [];
        for (const theme of THEMES) {
            const sizes = await page.evaluate((t) => {
                document.documentElement.setAttribute('data-theme', t);
                return [1, 2, 3, 4, 5, 6].map((n) =>
                    Number.parseFloat(getComputedStyle(document.querySelector(`[data-test="headings"] h${n}`)).fontSize),
                );
            }, theme);
            if (!sizes.every((v, i) => i === 0 || v < sizes[i - 1])) flat.push(`${theme}: ${sizes.join(', ')}`);
        }
        expect(flat, `the ladder is not strictly descending in: ${flat.join(' | ')}`).toEqual([]);
    });
});

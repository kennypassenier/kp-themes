// The layout layer, measured [TH90, TH91, TH92, AR17].
//
// One test per class, each pinning the property that class exists for, on
// a fixture that loads the package and styles nothing itself [KT3]. The
// drill per test is recorded in its own comment: which rule was removed
// from css/layout.css to watch it go red.
//
// The last test is the one the round turns on. AR17 replaced "utilities
// load last so they win" with cascade layers, because `.kp-table td`
// outranks `.kp-text-end` on specificity whatever the file order. That
// test fails on any build where the layers are gone.

import { test, expect } from '@playwright/test';

const FIXTURE = '/tests/fixtures/layout.html';

/** @param {import('@playwright/test').Page} page @param {string} name */
const box = (page, name) =>
    page.evaluate((n) => {
        const el = document.querySelector(`[data-test="${n}"]`);
        const r = el.getBoundingClientRect();
        const s = getComputedStyle(el);
        return {
            top: r.top,
            bottom: r.bottom,
            left: r.left,
            right: r.right,
            width: r.width,
            textAlign: s.textAlign,
            color: s.color,
            opacity: s.opacity,
            cursor: s.cursor,
            fontFamily: s.fontFamily,
            columns: s.gridTemplateColumns,
            marginTop: s.marginTop,
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

test.describe('the layout layer', () => {
    test.beforeEach(async ({ page }) => {
        await page.setViewportSize({ width: 1280, height: 900 });
        await page.goto(FIXTURE);
    });

    // Drill: removing `max-inline-size` from .kp-page makes the page span
    // the whole 1280 and this fails.
    test('.kp-page caps its measure and centres [TH90]', async ({ page }) => {
        const p = await box(page, 'page');
        // Against the declared maximum, not against the window: the body's
        // own default margin already makes it narrower than 1280, and the
        // first drill of this test passed with the rule removed [KT3].
        // The knob carries its default inside the rule rather than being a
        // declared token, so the probe asks for the same default the CSS
        // does. And the box is content-box, so its padding sits outside the
        // measure.
        const max = Number.parseFloat(await token(page, '--kp-page-max, 64rem')) * 16;
        const pad = await page.evaluate(() => {
            const s = getComputedStyle(document.querySelector('[data-test="page"]'));
            return Number.parseFloat(s.paddingLeft) + Number.parseFloat(s.paddingRight);
        });
        expect(p.width).toBeLessThanOrEqual(max + pad + 1);
        // Centred: the gap left of it equals the gap right of it.
        expect(Math.abs(p.left - (1280 - p.right))).toBeLessThan(2);
    });

    // Drill: removing `gap` from .kp-stack drops the distance to 0 and this
    // fails — which is exactly the fault the round started from.
    test('.kp-stack puts real space between two adjacent children [TH90]', async ({ page }) => {
        const a = await box(page, 'stack-a');
        const b = await box(page, 'stack-b');
        expect(b.top - a.bottom).toBeGreaterThan(4);
    });

    // Drill: removing `align-items` from .kp-row--end leaves the button
    // aligned to the centre and its bottom no longer meets the field's.
    test('.kp-row--end lines its controls up on their bottom edge [TH90]', async ({ page }) => {
        const button = await box(page, 'row-button');
        const row = await box(page, 'row');
        expect(Math.abs(button.bottom - row.bottom)).toBeLessThan(2);
    });

    // Drill: removing `justify-content` from .kp-row--between pulls the
    // right-hand item back against the left one.
    test('.kp-row--between pushes its ends apart [TH90]', async ({ page }) => {
        const row = await box(page, 'between');
        const right = await box(page, 'between-right');
        expect(row.right - right.right).toBeLessThan(2);
    });

    // Drill: removing `grid-template-columns` from .kp-autogrid leaves one
    // column at every width and the two counts below are equal.
    test('.kp-autogrid takes more columns when it has more room [TH90]', async ({ page }) => {
        const wide = (await box(page, 'autogrid')).columns.split(' ').length;
        await page.setViewportSize({ width: 480, height: 900 });
        const narrow = (await box(page, 'autogrid')).columns.split(' ').length;
        expect(wide).toBeGreaterThan(narrow);
    });

    // Drill: removing `min-inline-size` from .kp-sidebar__main lets the two
    // sit side by side at every width, so they never stack.
    test('.kp-sidebar drops its aside below when the room runs out [TH90]', async ({ page }) => {
        const asideWide = await box(page, 'sidebar-aside');
        const mainWide = await box(page, 'sidebar-main');
        expect(asideWide.top).toBeLessThan(mainWide.bottom);
        await page.setViewportSize({ width: 420, height: 900 });
        const aside = await box(page, 'sidebar-aside');
        const main = await box(page, 'sidebar-main');
        expect(aside.top).toBeGreaterThanOrEqual(main.bottom - 1);
    });

    // Drill: removing `margin-block-start` from .kp-section leaves the two
    // sections touching.
    test('.kp-section adds room above itself, except first [TH90]', async ({ page }) => {
        const second = await box(page, 'section-second');
        expect(Number.parseFloat(second.marginTop)).toBeGreaterThan(8);
        const first = await box(page, 'section-first');
        expect(Number.parseFloat(first.marginTop)).toBe(0);
    });

    // Drill: removing `max-inline-size` from .kp-center makes it as wide as
    // the page.
    test('.kp-center caps its width and sits in the middle [TH90]', async ({ page }) => {
        const page_ = await box(page, 'page');
        const c = await box(page, 'center');
        // Against its own cap: without the rule it fills the page's content
        // box, which is already narrower than the page's border box, and
        // the first drill passed [KT3].
        const max = Number.parseFloat(await token(page, '--kp-center-max, 28rem')) * 16;
        expect(c.width).toBeLessThanOrEqual(max + 1);
        expect(Math.abs(c.left - page_.left - (page_.right - c.right))).toBeLessThan(2);
    });

    // Drill: removing `max-inline-size` from .kp-prose lets the paragraph
    // run the full width of the page.
    test('.kp-prose stops at a readable measure [TH91]', async ({ page }) => {
        // Against a paragraph in the same flow that has no measure: the
        // page's content box is narrower than the page itself, so comparing
        // with the page passed even with the rule removed [KT3].
        const plain = await box(page, 'muted');
        const prose = await box(page, 'prose');
        expect(prose.width).toBeLessThan(plain.width);
    });

    // Drill: removing `color` from .kp-text-muted leaves it the body ink,
    // and the two colours below become equal.
    test('.kp-text-muted paints the muted token, not the body ink [TH91]', async ({ page }) => {
        const muted = await box(page, 'muted');
        const token = await page.evaluate(() => {
            const el = document.createElement('span');
            el.style.color = 'var(--muted-foreground)';
            document.body.append(el);
            const c = getComputedStyle(el).color;
            el.remove();
            return c;
        });
        expect(muted.color).toBe(token);
        const body = await page.evaluate(() => getComputedStyle(document.body).color);
        expect(muted.color).not.toBe(body);
    });

    // Drill: removing `text-align` from either class returns them to start.
    test('.kp-text-end and .kp-text-center align their text [TH91]', async ({ page }) => {
        expect((await box(page, 'text-end')).textAlign).toBe('end');
        expect((await box(page, 'text-center')).textAlign).toBe('center');
    });

    // Drill: removing `font-family` from .kp-mono leaves it the body face.
    test('.kp-mono uses the theme its own monospace face [TH91]', async ({ page }) => {
        const mono = await box(page, 'mono');
        const body = await page.evaluate(() => getComputedStyle(document.body).fontFamily);
        expect(mono.fontFamily).not.toBe(body);
        // The package's own mono face, not merely something monospace. The
        // element is a <span>, because a <code> is monospace by user-agent
        // default and components.css gives it the same face, so both the
        // /mono/ check and the token check passed with the rule removed
        // [KT3]. That drill also found the rule reading a token no theme
        // declares; it now reads --font-mono like the rest of the package.
        const face = (await token(page, '--kp-mono-face, var(--font-mono, ui-monospace, SFMono-Regular, Menlo, monospace)')).replaceAll(/["']/g, '');
        expect(mono.fontFamily.replaceAll(/["']/g, '')).toBe(face);
    });

    // Drill: removing `overflow-wrap: anywhere` from .kp-code-block lets a
    // 72-character key push the page wider than the window.
    test('.kp-code-block breaks a long key instead of widening the page [TH91]', async ({ page }) => {
        await page.setViewportSize({ width: 320, height: 900 });
        // The element itself, not the document: the page did not scroll
        // even with the rule removed, so the first drill passed [KT3].
        const overflows = await page.evaluate(() => {
            const el = document.querySelector('[data-test="code"]');
            return el.scrollWidth > el.clientWidth + 1;
        });
        expect(overflows).toBe(false);
    });

    // Drill: removing the [aria-busy='true'] rule makes the two buttons
    // identical, which is the state standing rule 31 exists to prevent.
    test('a busy control looks different from an idle one [TH92]', async ({ page }) => {
        const idle = await box(page, 'idle');
        const busy = await box(page, 'busy');
        expect(busy.opacity).not.toBe(idle.opacity);
        expect(busy.cursor).toBe('progress');
    });

    // The one AR17 turns on. `.kp-table td` is (0,1,1) and `.kp-text-end`
    // is (0,1,0), so before the layers this cell stayed on `start` however
    // late the utility loaded — measured at the Phase 4 gate.
    // Drill: removing the `@layer kp.components` wrapper from
    // css/components.css puts the cell back to `start` — unlayered CSS
    // beats layered CSS, so `.kp-table td` wins again. Removing the order
    // statement alone does NOT: the layers are also ordered by first
    // appearance, and the first drill of this test passed because of it.
    test('a layout class beats a component rule of higher specificity [AR17]', async ({ page }) => {
        expect((await box(page, 'cell-end')).textAlign).toBe('end');
    });
});

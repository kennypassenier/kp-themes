// The side navigation's two channels, side by side [feat-nav-3,
// sidenav-react, Kenny 2026-09-12].
//
// The frozen bar for every component in this package reads: "both channel
// variants exist, React and framework-free, rendering the same markup
// structure, verifiable side by side on the comparison page." The side
// navigation shipped with one channel and nine tests that all drove it,
// which Phase 7's audit found. This is the other half.
//
// What is compared is the DOM the two channels PRODUCE, not a list of
// things each contains: the same element names in the same nesting, the
// same classes, the same attributes the module reads. A component that
// renders a different shape would still pass a checklist of "has a list,
// has a link"; it cannot pass this.
//
// Drilled 2026-09-12 in firefox; the record is beside each test.
import { expect, test } from '@playwright/test';

const PAGE = '/tests/fixtures/sidenav.html';

/**
 * The structure of one navigation, as a string: element names, the classes
 * that carry meaning, and every attribute js/sidenav.js reads. Ids, the
 * test hooks and the accessible name are left out — those differ between
 * the two halves on purpose, because both live on one page.
 */
const shape = (page, selector) =>
    page.evaluate((sel) => {
        const root = document.querySelector(sel);
        if (root === null) return 'MISSING';
        const walk = (/** @type {Element} */ el, depth = 0) => {
            const classes = [...el.classList].sort().join('.');
            const knobs = [...el.attributes]
                .filter((a) => a.name.startsWith('data-kp-'))
                // The two halves live on one page, so the React half's own
                // test hooks carry an `r-` prefix. That prefix is the only
                // thing allowed to differ, and normalising it here is what
                // keeps the comparison about structure.
                .map((a) => (a.value === '' ? a.name : `${a.name}=${a.value.replace(/\br-/g, '')}`))
                .sort()
                .join(' ');
            const aria = [...el.attributes]
                .filter((a) => a.name.startsWith('aria-') && a.name !== 'aria-label')
                .map((a) => `${a.name}=${a.value}`)
                .sort()
                .join(' ');
            const self = `${'  '.repeat(depth)}${el.tagName.toLowerCase()}${classes ? '.' + classes : ''}${knobs ? ' [' + knobs + ']' : ''}${aria ? ' {' + aria + '}' : ''}`;
            return [self, ...[...el.children].map((child) => walk(child, depth + 1))].join('\n');
        };
        return walk(root);
    }, selector);

test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(PAGE);
    await page.waitForSelector('#react-sidenav .kp-sidenav');
});

// Drill: `className={`kp-sidenav ${className}`.trim()}` in
// components/sidenav.jsx changed to `kp-sidenav-DRILL` -> red on the first
// line of every shape. Restored: green.
for (const [name, free, react] of [
    ['a navigation beside the page', '[data-test="side"]', '[data-test="r-side"]'],
    ['one that comes over the page', '[data-test="over"]', '[data-test="r-over"]'],
    ['one that pushes the page aside', '[data-test="push"]', '[data-test="r-push"]'],
]) {
    test(`both channels build the same DOM for ${name} [feat-nav-3]`, async ({ page }) => {
        const a = await shape(page, free);
        const b = await shape(page, react);
        expect(a, 'the framework-free fixture is missing').not.toBe('MISSING');
        expect(b, 'the React fixture is missing').not.toBe('MISSING');
        expect(b).toBe(a);
    });
}

// Drill: the `data-kp-sidenav-slim-show` attribute removed from the React
// fixture's monogram -> red. Restored: green.
test('a consumer writing the rich markup by hand gets the same DOM [feat-nav-3, KT6]', async ({ page }) => {
    // The slim case carries a theme's own furniture — a wordmark that
    // swaps for a monogram, categories that fold, a footer. The component
    // does not model any of that; the consumer writes it as children, and
    // the whole point is that the result is the same shape.
    const free = await shape(page, '[data-test="slim"]');
    const react = await shape(page, '[data-test="r-slim"]');

    // The framework-free fixture carries two categories and a second
    // link; the React one carries one of each. Compare the parts that are
    // meant to be identical: the knobs on the root, and the furniture.
    const rootOf = (/** @type {string} */ s) => s.split('\n')[0];
    expect(rootOf(react), 'the root carries the same knobs').toBe(rootOf(free));
    for (const marker of [
        'data-kp-sidenav-slim-hide',
        'data-kp-sidenav-slim-show',
        'kp-sidenav__category',
        'kp-sidenav__footer',
        'kp-sidenav__submenu',
    ]) {
        expect(react, `the React half is missing ${marker}`).toContain(marker);
        expect(free, `the framework-free half is missing ${marker}`).toContain(marker);
    }
});

// Drill: the `data-kp-sidenav-toggle` attribute removed from
// SidenavToggle -> red, the button opening nothing. Restored: green.
test('the module drives the React navigation exactly as it drives the other [feat-nav-3]', async ({ page }) => {
    const panel = page.locator('[data-test="r-over"]');
    const toggle = page.locator('[data-test="r-over-toggle"]');

    // Closed to begin with: the paint, not the attribute [KT13].
    const visible = () => panel.evaluate((el) => el.getBoundingClientRect().left);
    const closed = await visible();

    await toggle.click();
    await expect.poll(visible).not.toBe(closed);
    const opened = await visible();

    // And a way back out, which is what KT6 is about.
    await page.keyboard.press('Escape');
    await expect.poll(visible).not.toBe(opened);
});

// Drill: the `sidenavOf` export removed from the module's handle map ->
// red on the handle being undefined. Restored: green.
test('the React navigation hands back the same handle [feat-nav-3, KT6]', async ({ page }) => {
    const result = await page.evaluate(async () => {
        // The fixture's own copy of the module, which is the one that
        // attached the React half — see the note in react-sidenav.jsx.
        const sidenavOf = window.__reactSidenavOf ?? (await import('/js/sidenav.js')).sidenavOf;
        const el = document.querySelector('[data-test="r-over"]');
        const handle = sidenavOf(el);
        if (!handle) return { found: false };
        handle.open();
        const afterOpen = handle.isOpen();
        handle.close();
        return { found: true, afterOpen, afterClose: handle.isOpen(), api: Object.keys(handle).sort() };
    });
    expect(result.found, 'the module never took ownership of the React navigation').toBe(true);
    expect(result.afterOpen, 'open() opens it').toBe(true);
    expect(result.afterClose, 'and close() is the way back out').toBe(false);
    expect(result.api).toEqual(['close', 'destroy', 'element', 'isOpen', 'open', 'setMode', 'setSlim', 'toggle']);
});

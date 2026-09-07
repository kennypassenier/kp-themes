// The documentation site renders [TH100, TH101, KT3].
//
// The three site gates read files. None of them opens a page, and the
// three faults that matters for are exactly the ones a file cannot show:
// a page whose example markup is broken and draws nothing, a page that
// throws while attaching the behaviour its own snippet demonstrates, and
// a navigation entry pointing at a page the generator does not write.
//
// The drill per test is in its own comment: which rule or which line was
// removed to watch it go red [KT3].

import { test, expect } from '@playwright/test';
import { DESCRIPTORS, GROUPS } from '../gates/site/descriptors.mjs';

/** The nine sections S27 asks of every component page. */
const SECTIONS = ['when', 'example', 'markup', 'react', 'props', 'events', 'knobs', 'a11y', 'variants'];

for (const descriptor of DESCRIPTORS) {
    // Drill: emptying `examples` for one descriptor and regenerating
    // leaves a page with no live block at all. Drilled on `card`:
    // "expected: > 0, received: 0" on the page's own name, then restored.
    test(`${descriptor.id} carries its nine sections and draws every example [TH100]`, async ({ page }) => {
        /** @type {string[]} */
        const errors = [];
        page.on('pageerror', (e) => errors.push(String(e)));
        page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));

        await page.goto(`/site/components/${descriptor.id}.html`);

        // The sections, by name and in order: a page missing one of them
        // is a page that answers eight of the nine questions.
        expect(await page.locator('[data-sc-section]').evaluateAll((els) => els.map((el) => el.getAttribute('data-sc-section')))).toEqual(SECTIONS);

        const live = page.locator('[data-sc-live]');
        // Both halves: a page shows what its descriptor promises, and a
        // descriptor that promises nothing is not a documented unit.
        expect(descriptor.examples.length, `${descriptor.id} has no example at all`).toBeGreaterThan(0);
        await expect(live).toHaveCount(descriptor.examples.length);
        for (let i = 0; i < descriptor.examples.length; i++) {
            const box = await live.nth(i).boundingBox();
            expect(box, `${descriptor.id} example ${i} has no box at all`).not.toBeNull();
            // A box with nothing in it is 2px of padding and a border. The
            // examples that draw least — a footer, a single badge — clear
            // 24px comfortably; an empty one does not.
            expect(box?.height ?? 0, `${descriptor.id} example ${i} drew nothing`).toBeGreaterThan(24);
        }

        expect(errors, `${descriptor.id} logged errors while loading`).toEqual([]);
    });
}

// A page of a design system that scrolls sideways on a phone is evidence
// against the design system (DI11, SC 1.4.10).
//
// The exception list gives a reason per line, and it has exactly one.
// Drill: this was written before the generated tables were put in
// `.kp-table-wrap`, and it was red on 37 of the 42 pages — the widest was
// the theme switcher at 875px in a 360px viewport. It is the reason the
// wrapper is there.
const SIDEWAYS_EXCEPTIONS = {
    // MR-R6-2: `.kp-shortcuts` is content-box, so the sheet is 373px wide
    // at this viewport. A component's defect, and its repair changes the
    // sheet's width everywhere, so it is Kenny's to take.
    'shortcut-sheet': 'MR-R6-2',
};

test('no documentation page scrolls sideways at 360px [DI11]', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    /** @type {string[]} */
    const sideways = [];
    for (const descriptor of DESCRIPTORS) {
        await page.goto(`/site/components/${descriptor.id}.html`);
        const { scroll, view } = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, view: window.innerWidth }));
        // A pixel of tolerance: a fractional layout rounds up.
        if (scroll > view + 1 && SIDEWAYS_EXCEPTIONS[descriptor.id] === undefined) sideways.push(`${descriptor.id} (${scroll} > ${view})`);
    }
    expect(sideways, 'these pages make the reader scroll sideways').toEqual([]);
});

// Drill: removing `min-height` from `.kp-button` in css/components.css
// dropped the measured height to 33.19px — the padding and the line box,
// which is what a button is without the rule — and this failed on it.
// Restored after.
test('the package’s own stylesheet paints the live examples, not the site’s [KT3]', async ({ page }) => {
    await page.goto('/site/components/button.html');
    const height = await page
        .locator('[data-sc-live] .kp-button')
        .first()
        .evaluate((el) => el.getBoundingClientRect().height);
    // --kp-control-height, 2.25rem at the root font size the site uses.
    expect(height).toBeGreaterThanOrEqual(36);
});

// Drill: `up` in gates/site/chrome.mjs is what turns a page's depth into
// the `../` prefix on every navigation href. Cutting it by one and
// regenerating left every entry resolving one directory too deep —
// /site/site/index.html — and this went red on the first of them with a
// 404. Restored.
test('every navigation entry leads to a page that exists [TH100]', async ({ page, request }) => {
    await page.goto('/site/index.html');
    const hrefs = await page.locator('.sc-nav__link').evaluateAll((els) => els.map((el) => /** @type {HTMLAnchorElement} */ (el).href));
    // The four fixed entries plus one per documented unit.
    expect(hrefs.length).toBe(4 + DESCRIPTORS.length);
    for (const href of hrefs) {
        const response = await request.get(href);
        expect(response.status(), `${href} is in the navigation and does not exist`).toBe(200);
    }
    // And the groups the navigation shows are the ones the descriptors
    // ask for: a descriptor in a group nobody lists is a page reachable
    // only by its URL.
    const groups = await page.locator('.sc-nav__title').evaluateAll((els) => els.map((el) => el.textContent));
    for (const descriptor of DESCRIPTORS) {
        expect(GROUPS, `${descriptor.id} sits in the group "${descriptor.group}", which GROUPS does not list`).toContain(descriptor.group);
        expect(groups, `nothing in the navigation shows the group "${descriptor.group}"`).toContain(descriptor.group);
    }
});

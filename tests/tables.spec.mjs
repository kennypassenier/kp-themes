// The table layers [R3, TH95, TH96].
//
// One suite over both channels (standing rule 7g): every case runs twice
// against the same fixture page, once over the framework-free markup that
// js/tables.js upgrades and once over the React components, and the
// assertions are identical — a difference between the channels shows up
// as a failure rather than as a shrug.
//
// Every case that asserts the PACKAGE applies something carries, in a
// comment, the exact declaration removed to drive it red [KT3]. Each of
// those drills was performed; the report of R3 lists them.

import { test, expect } from '@playwright/test';

const URL = '/tests/fixtures/tables.html';

/** The 70-character identifier both channels put in the breakable cell. */
const IDENTIFIER = 'a3f92b71c4d5e6f708192a3b4c5d6e7f8091a2b3c4d5e6f708192a3b4c5d6e7f809125';
const NOTE = 'A note long enough that no column can hold it, which is the whole point of a truncated cell.';

const CHANNELS = ['plain', 'react'];

/** Both mounts are on the page before anything is measured. */
async function open(page) {
    await page.goto(URL);
    await page.waitForSelector('[data-test="react-datatable-cards"] table');
}

for (const channel of CHANNELS) {
    const host = (name) => `[data-test="${channel}-${name}"]`;

    test(`${channel}: the scroll region is a named region in the tab order [TH95]`, async ({ page }) => {
        await open(page);
        const wrap = page.locator(`${host('region')} .kp-table-wrap`);
        // Drill: with `wrap.setAttribute('tabindex', '0')` removed from
        // attachTableRegions() in js/tables.js and `tabIndex={region ? 0 :
        // undefined}` removed from components/table.jsx and
        // components/datatable.jsx, this reads null — red in both
        // channels and both browsers.
        await expect(wrap).toHaveAttribute('tabindex', '0');
        await expect(wrap).toHaveAttribute('role', 'region');
        // The label names the table: it comes from the caption, in both
        // channels, and is not a string written into either of them [KT5].
        // Drill: with the caption dropped from the name — the two lines
        // reading `table?.caption` in js/tables.js and the
        // `typeof caption === 'string' ? caption : …` in both components —
        // the region falls back to the dictionary's "Table" and this
        // fails, in both channels and both browsers.
        await expect(wrap).toHaveAttribute('aria-label', 'Quarterly revenue');

        await page.locator(host('region-before')).focus();
        await page.keyboard.press('Tab');
        const reached = await page.evaluate(
            (selector) => document.activeElement === document.querySelector(selector),
            `${host('region')} .kp-table-wrap`,
        );
        expect(reached).toBe(true);
    });

    test(`${channel}: the scroll region scrolls with the arrow keys [TH95]`, async ({ page }) => {
        await open(page);
        const selector = `${host('region')} .kp-table-wrap`;
        const overflows = await page.evaluate((s) => {
            const el = document.querySelector(s);
            return el.scrollWidth > el.clientWidth;
        }, selector);
        // Without an overflow there is nothing to scroll and the case would
        // pass on a table that fits: the fixture keeps it 300px wide.
        expect(overflows).toBe(true);

        await page.locator(host('region-before')).focus();
        await page.keyboard.press('Tab');
        // Drill: with `overflow-x: auto` removed from .kp-table-wrap in
        // css/components.css the wrapper is not a scroll container, and
        // scrollLeft stays 0 however often the key is pressed.
        for (let i = 0; i < 5; i++) await page.keyboard.press('ArrowRight');
        await expect.poll(async () => page.evaluate((s) => document.querySelector(s).scrollLeft, selector)).toBeGreaterThan(0);
    });

    test(`${channel}: a 70-character identifier in a .kp-cell-break cell stays inside its container at 320px [TH96]`, async ({ page }) => {
        await page.setViewportSize({ width: 320, height: 800 });
        await open(page);
        const measured = await page.evaluate(
            (selector) => {
                const wrap = document.querySelector(selector);
                const table = wrap.querySelector('table');
                const cell = [...wrap.querySelectorAll('td')].find((td) => td.classList.contains('kp-cell-break'));
                return { wrap: wrap.clientWidth, table: table.scrollWidth, text: cell.textContent.trim() };
            },
            `${host('break')} .kp-table-wrap`,
        );
        expect(measured.text).toBe(IDENTIFIER);
        // Drill: with BOTH declarations removed from .kp-cell-break the
        // identifier is one unbreakable word and the table is wider than
        // its container — red in both channels and both browsers.
        // Removing only `overflow-wrap: anywhere` leaves it green:
        // `word-break: break-word` carries it on its own in Chromium and
        // Firefox, so the rule this measures is the pair, not either line.
        // (The first cut of this fixture used a hyphenated identifier,
        // which browsers break at the hyphens; the drill stayed green and
        // said so, which is what the drill is for.)
        expect(measured.table).toBeLessThanOrEqual(measured.wrap + 1);
    });

    test(`${channel}: a .kp-cell-truncate cell shows an ellipsis and keeps the full value [TH96]`, async ({ page }) => {
        await page.setViewportSize({ width: 320, height: 800 });
        await open(page);
        const measured = await page.evaluate(
            (selector) => {
                const cell = document.querySelector(selector);
                const style = getComputedStyle(cell);
                return {
                    overflow: style.textOverflow,
                    wrapping: style.whiteSpace,
                    clipped: cell.scrollWidth > cell.clientWidth,
                    text: cell.textContent.trim(),
                    title: cell.getAttribute('title'),
                    lines: Math.round(cell.getBoundingClientRect().height),
                };
            },
            `${host('truncate')} td.kp-cell-truncate`,
        );
        // Drill: with `text-overflow: ellipsis` removed from
        // .kp-cell-truncate this reads "clip" and the case fails. Drilled
        // a second time on `max-inline-size`: without it the nowrap cell
        // makes its column as wide as the whole sentence, nothing is ever
        // clipped, and `clipped` reads false.
        expect(measured.overflow).toBe('ellipsis');
        expect(measured.wrapping).toBe('nowrap');
        expect(measured.clipped).toBe(true);
        // Reachable: the whole value is still in the cell — a reader with a
        // screen reader hears it, find-in-page finds it, a copy takes it —
        // and the pointer gets it from the title both channels carry.
        expect(measured.text).toBe(NOTE);
        expect(measured.title).toBe(NOTE);
    });

    test(`${channel}: a .kp-col-low column is there at 1280 and gone at 480, header and cells together [TH96]`, async ({ page }) => {
        await open(page);
        const shown = (selector) => page.evaluate((s) => [...document.querySelectorAll(s)].map((el) => getComputedStyle(el).display), selector);
        const cells = `${host('priority')} .kp-col-low`;

        await page.setViewportSize({ width: 1280, height: 800 });
        const wide = await shown(cells);
        expect(wide.length).toBe(2); // the header and its one cell
        expect(wide.every((display) => display !== 'none')).toBe(true);

        await page.setViewportSize({ width: 480, height: 800 });
        // Drill: with `display: none` removed from the .kp-col-low rule in
        // the @container block, both stay visible at 480 and this fails.
        await expect.poll(async () => (await shown(cells)).join()).toBe('none,none');
    });

    test(`${channel}: a plain table in a 400px container falls into cards while the viewport stays 1280 [TH96]`, async ({ page }) => {
        await page.setViewportSize({ width: 1280, height: 800 });
        await open(page);
        const measured = await page.evaluate((selector) => {
            const table = document.querySelector(`${selector} table`);
            const cell = table.querySelector('tbody td');
            return {
                viewport: window.innerWidth,
                container: document.querySelector(`${selector} .kp-table-wrap`).clientWidth,
                head: getComputedStyle(table.querySelector('thead')).position,
                cell: getComputedStyle(cell).display,
                // The rendered width of the ::before box, which is the
                // column's name and nothing else: an empty data-label
                // measures 0px in both browsers, so this says the label is
                // there rather than merely that a box is.
                label: Number.parseFloat(getComputedStyle(cell, '::before').width),
            };
        }, host('cards'));
        expect(measured.viewport).toBe(1280);
        expect(measured.container).toBeLessThanOrEqual(400);
        // Drill: with `container-type` removed from .kp-table-wrap the
        // @container block never matches, the head stays static and the
        // cell stays a table-cell — the case fails on all three.
        expect(measured.head).toBe('absolute');
        expect(measured.cell).toBe('flex');
        // Drill: with `content: attr(data-label)` removed from the card
        // rule, and again with data-label removed from the cells that
        // components/table.jsx writes, this measures 0px.
        expect(measured.label).toBeGreaterThan(10);
    });

    test(`${channel}: the DataTable falls into cards in a 400px container while the viewport stays 1280 [TH96]`, async ({ page }) => {
        await page.setViewportSize({ width: 1280, height: 800 });
        await open(page);
        const measured = await page.evaluate((selector) => {
            const table = document.querySelector(`${selector} table`);
            const cell = table.querySelector('tbody td');
            return {
                viewport: window.innerWidth,
                head: getComputedStyle(table.querySelector('thead')).position,
                cell: getComputedStyle(cell).display,
                label: Number.parseFloat(getComputedStyle(cell, '::before').width),
            };
        }, host('datatable-cards'));
        expect(measured.viewport).toBe(1280);
        // Drill: the same removal as the plain table's — without
        // `container-type` on .kp-table-wrap this reads "static".
        expect(measured.head).toBe('absolute');
        expect(measured.cell).toBe('flex');
        // Drill: the same removal as the plain table's — without the
        // label the ::before box measures 0px.
        expect(measured.label).toBeGreaterThan(10);
    });
}

// AR24's own measurement, kept as a test rather than as a note: the
// decision rests on `container-type: inline-size` not changing how
// .kp-table-wrap sizes, and a note cannot go red when that stops being
// true. Measured at the build of R3, both browsers: 500 -> 500 in normal
// flow and inside .kp-datatable; a wrap in a shrink-to-fit box (a flex
// row, an inline-block) does change, which is why the user guide says so.
test('container-type does not change how .kp-table-wrap sizes in normal flow [TH96, AR24]', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await open(page);
    const measured = await page.evaluate(() => {
        const wrap = document.querySelector('[data-test="plain-priority"] .kp-table-wrap');
        const withContainer = Math.round(wrap.getBoundingClientRect().width);
        const type = getComputedStyle(wrap).containerType;
        wrap.style.containerType = 'normal';
        const without = Math.round(wrap.getBoundingClientRect().width);
        wrap.style.containerType = '';
        return { withContainer, without, type };
    });
    expect(measured.type).toBe('inline-size');
    expect(measured.withContainer).toBe(measured.without);
});

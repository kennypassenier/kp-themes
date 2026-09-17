// Remembered state [Kenny, 2026-09-16].
//
// "de sidenav moet zijn state onthouden, ik heb bv de components dropdown
// gesloten en klik op een link, dan moet die nog altijd dicht zijn. Dit
// gedrag moet tellen voor alle elementen waar dit verwacht wordt door een
// user." And: "en die key in localStorage moet niet hardcoded zijn, stel
// dat we twee van dezelfde elementen naast mekaar op de pagina willen
// ofzo".
//
// So this file asks five questions of every component that remembers:
// does the state survive a reload, do two of the same component with
// different names stay apart, does one with no name write nothing at all,
// does a page with no storage still work, and is the state already right
// at the first frame rather than a beat later.
//
// Every assertion reads the paint rather than the attribute the module
// just wrote [KT13]: a collapsed group is a submenu with no height, a
// hidden column is a header with no box, a sort is the order of the rows.
//
// Red before the change (KT3), the whole file against e20d3dfc with
// js/remember.js present but nothing wired to it: 13 failed, 1 passed —
// the one that passes is "a panel with no name writes nothing", which is
// true of a package that remembers nothing at all.

import { expect, test } from '@playwright/test';
import { measured } from './paint.mjs';

const FIXTURE = '/tests/fixtures/remember.html';

/** @param {import('@playwright/test').Page} page @param {string} name */
const part = (page, name) => page.locator(`[data-test="${name}"]`);

/** The painted height of a box: 0 when it is folded away. @param {import('@playwright/test').Locator} locator @param {string} message */
const height = (locator, message) => measured(locator, (el) => Math.round(el.getBoundingClientRect().height), undefined, message);

/** @param {import('@playwright/test').Locator} locator @param {string} message */
const width = (locator, message) => measured(locator, (el) => Math.round(el.getBoundingClientRect().width), undefined, message);

/**
 * Wait until a state has actually been written before reloading on it. A
 * `<details>` fires its `toggle` in a task of its own, so under load the
 * reload can beat the write it is meant to be testing [KT16].
 *
 * @param {import('@playwright/test').Page} page
 * @param {string} key
 * @param {string} value the stored JSON
 */
const settled = (page, key, value) =>
    expect.poll(() => page.evaluate((k) => localStorage.getItem(k), key), { message: `${key} is ${value}` }).toBe(value);

/** The submenu of one sidenav group. @param {import('@playwright/test').Page} page @param {string} group */
const submenu = (page, group) => part(page, group).locator('.kp-sidenav__submenu');

/** Everything this package wrote into storage, so a test can say "nothing". @param {import('@playwright/test').Page} page */
const stored = (page) =>
    page.evaluate(() => {
        /** @type {Record<string, string>} */
        const all = {};
        for (let at = 0; at < localStorage.length; at += 1) {
            const key = localStorage.key(at);
            if (key !== null && key.startsWith('kp-remember:')) all[key] = localStorage.getItem(key) ?? '';
        }
        return all;
    });

test.describe('remembered state', { tag: ['@component:navigation', '@component:structure', '@component:datatable'] }, () => {
    test('the side navigation: a group closed before a reload is still closed after it [Kenny]', async ({ page }) => {
        await page.goto(FIXTURE);
        await height(submenu(page, 'nav-group-components'), 'the group starts open').toBeGreaterThan(0);

        await part(page, 'nav-group-components-toggle').click();
        await height(submenu(page, 'nav-group-components'), 'and closes when it is pressed').toBe(0);

        await page.reload();
        await height(submenu(page, 'nav-group-components'), 'and is STILL closed on the page the link led to').toBe(0);
        // The other group was never touched, so it is what the markup says.
        await height(submenu(page, 'nav-group-pages'), 'the group nobody touched is still open').toBeGreaterThan(0);
    });

    test('the side navigation: the collapsed rail and the closed panel both survive [gap-12]', async ({ page }) => {
        await page.goto(FIXTURE);
        const panel = part(page, 'nav');
        const wide = await panel.evaluate((el) => Math.round(el.getBoundingClientRect().width));

        await part(page, 'nav-rail-toggle').click();
        // The rail slides, so the width only settles a moment later: the
        // thing to assert is that it is narrower, never a number read
        // mid-transition [fix-1].
        await measured(panel, (el) => Math.round(el.getBoundingClientRect().width), undefined, 'the rail narrows').toBeLessThan(wide);
        await page.reload();
        await width(panel, 'and is still a rail after a reload').toBeLessThan(wide);

        await part(page, 'nav-toggle').click();
        await width(panel, 'the panel was closed: a side panel that is shut takes no room').toBe(0);
        await page.reload();
        await width(panel, 'and is shut again after the reload').toBe(0);
    });

    test('two panels with different names keep separate state [Kenny: twee van dezelfde elementen]', async ({ page }) => {
        await page.goto(FIXTURE);
        await part(page, 'nav-group-components-toggle').click();
        await page.reload();

        await height(submenu(page, 'nav-group-components'), 'the first panel remembers its own group').toBe(0);
        await height(submenu(page, 'nav-two-group'), 'the second panel, same group name, is untouched').toBeGreaterThan(0);

        const keys = Object.keys(await stored(page));
        expect(
            keys.some((key) => key.includes(':fixture-nav:')),
            'the key carries the name the element gave itself',
        ).toBe(true);
        expect(
            keys.some((key) => key.includes(':fixture-nav-second:')),
            'and the second name has not been written yet',
        ).toBe(false);
    });

    test('a panel with no data-kp-remember writes nothing at all', async ({ page }) => {
        await page.goto(FIXTURE);
        await part(page, 'nav-plain-group-toggle').click();
        await height(submenu(page, 'nav-plain-group'), 'it still closes').toBe(0);

        await page.reload();
        await height(submenu(page, 'nav-plain-group'), 'and comes back at the markup default').toBeGreaterThan(0);
        const keys = Object.keys(await stored(page));
        expect(
            keys.filter((key) => key.includes('nav-plain')),
            'and nothing of its own reached storage',
        ).toEqual([]);
    });

    test('two panels with the SAME name: the second is refused, says so, and keeps its default', async ({ page }) => {
        /** @type {string[]} */
        const warnings = [];
        page.on('console', (message) => {
            if (message.type() === 'warning') warnings.push(message.text());
        });
        const clashes = [];
        await page.exposeFunction('kpClash', (/** @type {string} */ name) => clashes.push(name));
        await page.addInitScript(() => {
            document.addEventListener('kp-remember-clash', (event) => {
                // @ts-ignore the test's own bridge
                window.kpClash(/** @type {CustomEvent} */ (event).detail.name);
            });
        });
        await page.goto(FIXTURE);

        await part(page, 'nav-group-components-toggle').click();
        await height(submenu(page, 'nav-group-components'), 'the owner closes').toBe(0);
        await height(submenu(page, 'nav-clash-group'), 'and the impostor is not dragged along').toBeGreaterThan(0);

        await page.reload();
        await height(submenu(page, 'nav-clash-group'), 'after a reload it is still at its markup default').toBeGreaterThan(0);
        expect(
            warnings.some((text) => text.includes('fixture-nav')),
            'and the clash was said out loud',
        ).toBe(true);
        expect(clashes, 'as an event on the element that was refused').toContain('fixture-nav');
    });

    test('the accordion: a section opened stays open, and its neighbour is not remembered', async ({ page }) => {
        await page.goto(FIXTURE);
        // The section's own box, not its body's: a closed <details> keeps
        // its content in a skipped subtree whose box still measures [KT13].
        const shut = await part(page, 'faq-two').evaluate((el) => Math.round(el.getBoundingClientRect().height));
        const neighbourShut = await part(page, 'faq-one').evaluate((el) => Math.round(el.getBoundingClientRect().height));

        await part(page, 'faq-two-summary').click();
        await height(part(page, 'faq-two'), 'it opens').toBeGreaterThan(shut);
        const wide = await part(page, 'faq-two').evaluate((el) => Math.round(el.getBoundingClientRect().height));
        await part(page, 'faq-one-summary').click();
        await settled(page, 'kp-remember:disclosure:faq-pressure:open', 'true');

        await page.reload();
        await height(part(page, 'faq-two'), 'the named section is open again').toBe(wide);
        await height(part(page, 'faq-one'), 'the unnamed one is closed again').toBe(neighbourShut);
    });

    test('the split pane: the divider stays where it was left [TH55]', async ({ page }) => {
        await page.goto(FIXTURE);
        const left = part(page, 'split').locator('.kp-split__pane').first();
        const before = await left.evaluate((el) => Math.round(el.getBoundingClientRect().width));

        await part(page, 'split-divider').focus();
        for (let press = 0; press < 5; press += 1) await page.keyboard.press('ArrowRight');
        const moved = await left.evaluate((el) => Math.round(el.getBoundingClientRect().width));
        expect(moved, 'the divider actually moved').toBeGreaterThan(before);

        await page.reload();
        await width(left, 'and the pane comes back at the width it was left at').toBe(moved);
    });

    test('the tree: a branch closed stays closed [TH45]', async ({ page }) => {
        await page.goto(FIXTURE);
        const branch = part(page, 'tree-documents').locator('[role="group"]');
        await height(branch, 'the branch starts open').toBeGreaterThan(0);

        await part(page, 'tree-documents').locator('.kp-tree__label').first().click();
        await height(branch, 'and closes on a click').toBe(0);

        await page.reload();
        await height(branch, 'and is still closed after a reload').toBe(0);
        await height(part(page, 'tree-downloads').locator('[role="group"]'), 'the other branch is untouched').toBeGreaterThan(0);
    });

    test('the data table: the density chosen survives a reload', async ({ page }) => {
        await page.goto(FIXTURE);
        const row = part(page, 'table').locator('tbody tr').first();
        const comfortable = await row.evaluate((el) => Math.round(el.getBoundingClientRect().height));

        await part(page, 'table-density').selectOption('compact');
        await height(row, 'compact rows are shorter').toBeLessThan(comfortable);
        const compactHeight = await row.evaluate((el) => Math.round(el.getBoundingClientRect().height));

        await page.reload();
        await height(row, 'and the table is compact again without being asked').toBe(compactHeight);
    });

    test('the data table: the sort survives a reload', async ({ page }) => {
        await page.goto(FIXTURE);
        const first = part(page, 'table').locator('tbody tr td').first();
        await expect(first, 'the rows start in the order the markup wrote them').toHaveText('INC-3');

        await part(page, 'table-head-reference').click();
        await expect(first, 'and sort on the reference').toHaveText('INC-1');

        await page.reload();
        await expect(first, 'the sorted order is what the reader comes back to').toHaveText('INC-1');
    });

    test('the data table: a column put away stays away', async ({ page }) => {
        await page.goto(FIXTURE);
        const site = part(page, 'table-head-site');
        await width(site, 'the column starts visible').toBeGreaterThan(0);

        await part(page, 'table').locator('[data-kp-datatable-columns-toggle]').click();
        await part(page, 'table').locator('[data-kp-datatable-column]').nth(1).uncheck();
        await width(site, 'and goes away when it is unticked').toBe(0);

        await page.reload();
        await width(site, 'and is still away after a reload').toBe(0);
        await width(part(page, 'table-head-hours'), 'the column nobody touched is still there').toBeGreaterThan(0);
    });

    test('a page whose localStorage throws works at its defaults [KT6]', async ({ page }) => {
        await page.addInitScript(() => {
            Object.defineProperty(window, 'localStorage', {
                configurable: true,
                get() {
                    throw new DOMException('The operation is insecure.', 'SecurityError');
                },
            });
        });
        /** @type {string[]} */
        const errors = [];
        page.on('pageerror', (error) => errors.push(error.message));
        await page.goto(FIXTURE);

        await height(submenu(page, 'nav-group-components'), 'the group is at its markup default').toBeGreaterThan(0);
        await part(page, 'nav-group-components-toggle').click();
        await height(submenu(page, 'nav-group-components'), 'and still opens and closes').toBe(0);
        await part(page, 'split-divider').focus();
        await page.keyboard.press('ArrowRight');
        await part(page, 'faq-two-summary').click();
        await height(part(page, 'faq-two').locator('.kp-accordion__body'), 'the accordion works too').toBeGreaterThan(0);
        expect(errors, 'and nothing threw').toEqual([]);
    });

    test('nothing flashes: the remembered state is on the markup at DOMContentLoaded and at the first frame', async ({ page }) => {
        await page.goto(FIXTURE);
        await part(page, 'nav-group-components-toggle').click();
        await part(page, 'faq-two-summary').click();
        await part(page, 'split-divider').focus();
        for (let press = 0; press < 5; press += 1) await page.keyboard.press('ArrowRight');
        const value = await part(page, 'split-divider').getAttribute('aria-valuenow');
        await settled(page, 'kp-remember:disclosure:faq-pressure:open', 'true');
        await settled(page, 'kp-remember:split:fixture-panes:value', String(value));

        await page.reload();
        await page.waitForLoadState('load');
        const at = await page.evaluate(() => /** @type {any} */ (window).__kpAt);

        expect(at.dcl.groups[0], 'the closed group was closed before DOMContentLoaded').toBe(false);
        expect(at.dcl.groups[1], 'and the open one was open').toBe(true);
        expect(at.dcl.faqOpen, 'the accordion section was open before DOMContentLoaded').toBe(true);
        expect(at.dcl.splitValue, 'and the divider was where it was left').toBe(value);

        // And no frame the browser offered from then on showed anything
        // else. DOMContentLoaded is the marker rather than `readyState`,
        // which turns "interactive" BEFORE the deferred module runs — the
        // window a DOM-dependent restore cannot reach, and the reason the
        // theme's own no-flash answer is an inline snippet instead.
        const painted = at.frames.filter((/** @type {any} */ look) => look.afterDcl);
        expect(painted.length, 'the page offered at least one frame after DOMContentLoaded').toBeGreaterThan(0);
        for (const look of painted) {
            expect(look.groups[0], `frame at readyState=${look.readyState}: the group is closed`).toBe(false);
            expect(look.faqOpen, `frame at readyState=${look.readyState}: the section is open`).toBe(true);
            expect(look.splitValue, `frame at readyState=${look.readyState}: the divider is where it was`).toBe(value);
        }
    });

    test('the key is composed from the element, never hardcoded', async ({ page }) => {
        await page.goto(FIXTURE);
        await part(page, 'nav-group-components-toggle').click();
        await part(page, 'faq-two-summary').click();
        // Polled: a <details> fires its `toggle` in a task of its own, so the
        // write lands a beat after the click that caused it [KT16].
        await expect
            .poll(async () => Object.keys(await stored(page)).sort(), { message: 'each state sits under the name its element gave itself' })
            .toEqual(expect.arrayContaining(['kp-remember:disclosure:faq-pressure:open', 'kp-remember:sidenav:fixture-nav:groups']));
        // The shape, said once: prefix, component, name, slot.
        const keys = Object.keys(await stored(page));
        for (const key of keys) expect(key.split(':'), `${key} has the four segments`).toHaveLength(4);
    });
});

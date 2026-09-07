// The ten example pages, in both channels [TH98, AR20].
//
// The pages are generated from one descriptor list (showcase/examples.mjs)
// and rendered twice: as framework-free markup a server writes, committed
// under examples/, and as React elements built from the same tree
// (showcase/examples-react.jsx), mounted in tests/fixtures/examples.html.
// Ten pages written twice by hand would be twenty artefacts that drift;
// one tree with two renderers is one.
//
// What this suite measures, per page:
//
//  1. Both channels render it — the landmarks are there and neither
//     channel throws.
//  2. The two channels agree on class names and role/aria-current per
//     element in document order. That is exactly AR20's narrowed
//     comparison: it is immune to attribute order, empty attributes,
//     style serialisation and letter case, and it is the thing that
//     catches an adapter in showcase/examples.mjs drifting from the
//     component it mirrors.
//  3. The two shapes the chassis-rs report named are on the
//     list-with-form page and behave: two fields with a button on one
//     row, and a table cell holding a 70-character value.
//
// AR20 says this out loud: it is documentation hygiene, not parity proof.
// The behaviour suites are what prove the two channels agree.
//
// The drills, run 2026-09-06 (KT3):
//
//   the channel comparison — the framework-free Alert adapter in
//   showcase/examples.mjs given `class: 'DRILL-removed'` instead of
//   `kp-alert__body`. Red on login and empty-and-error, printing the
//   missing "span|kp-alert__body||" line in document order. Restored:
//   green. This is the AR20 defect the decision itself names, injected on
//   purpose.
//
//   two fields and a button on one row — `display: flex` removed from
//   `.kp-row` in css/layout.css. Red in BOTH channels: the three tops
//   spread 118px instead of under 40. Restored: green.
//
//   the 70-character cell is a content assertion about the descriptor,
//   not about a rule the package applies, so there is nothing to remove.
//   It exists so TH99 has the shape to measure.

import { expect, test } from '@playwright/test';
import { EXAMPLES, INLINE_STYLE_EXCEPTIONS } from '../showcase/examples.mjs';

/** @param {string} id */
const staticUrl = (id) => `/examples/${id}.html`;
/** @param {string} id */
const reactUrl = (id) => `/tests/fixtures/examples.html?example=${id}`;

/**
 * Class names and roles per element in document order [AR20].
 *
 * Deliberately not innerHTML: the two channels legitimately differ in
 * attribute order, in how a boolean attribute is written and in what an
 * empty attribute looks like, and comparing the whole string would put
 * an exception on every page on the first day.
 *
 * @param {import('@playwright/test').Page} page
 * @param {string} root
 */
const shape = (page, root) =>
    page.evaluate((sel) => {
        const el = document.querySelector(sel);
        if (!el) return [];
        return [...el.querySelectorAll('*')]
            .filter((n) => !['SCRIPT', 'STYLE', 'TEMPLATE'].includes(n.tagName))
            .map((n) => {
                const classes = [...n.classList].sort().join(' ');
                return `${n.tagName.toLowerCase()}|${classes}|${n.getAttribute('role') ?? ''}|${n.getAttribute('aria-current') ?? ''}`;
            });
    }, root);

test.describe('the ten example pages', () => {
    test('the descriptor list holds the ten pages TH98 names and the concept demo', () => {
        expect(EXAMPLES.map((e) => e.id)).toEqual([
            'app-shell',
            'login',
            'list-with-form',
            'settings',
            'wizard',
            'empty-and-error',
            'hero',
            'pricing-and-testimonials',
            'article',
            'profile',
            // The concept demo joined at round six's C0 [TH126, AR42]: the
            // page every new theme is tried on, rendered under a theme by
            // `?theme=<name>`.
            'concept',
        ]);
    });

    for (const example of EXAMPLES) {
        test(`${example.id} renders in the framework-free channel [TH98]`, async ({ page }) => {
            /** @type {string[]} */
            const problems = [];
            page.on('pageerror', (error) => problems.push(String(error)));
            page.on('console', (message) => {
                if (message.type() === 'error') problems.push(message.text());
            });
            await page.setViewportSize({ width: 1280, height: 900 });
            await page.goto(staticUrl(example.id));
            await expect(page.locator('main#main.kp-page')).toBeVisible();
            await expect(page.locator('nav.kp-nav')).toBeVisible();
            for (const selector of example.probes) await expect(page.locator(selector).first()).toBeVisible();
            expect(problems).toEqual([]);
        });

        test(`${example.id} renders in the React channel [TH98]`, async ({ page }) => {
            /** @type {string[]} */
            const problems = [];
            page.on('pageerror', (error) => problems.push(String(error)));
            page.on('console', (message) => {
                if (message.type() === 'error') problems.push(message.text());
            });
            await page.setViewportSize({ width: 1280, height: 900 });
            await page.goto(reactUrl(example.id));
            await expect(page.locator('main#main.kp-page')).toBeVisible();
            await expect(page.locator('nav.kp-nav')).toBeVisible();
            for (const selector of example.probes) await expect(page.locator(selector).first()).toBeVisible();
            expect(problems).toEqual([]);
        });

        test(`${example.id}: the two channels write the same classes and roles [AR20]`, async ({ page }) => {
            await page.setViewportSize({ width: 1280, height: 900 });
            await page.goto(staticUrl(example.id));
            const free = await shape(page, 'body');
            await page.goto(reactUrl(example.id));
            const react = await shape(page, '#react-mount');
            expect(react).toEqual(free);
        });
    }

    // The two shapes the chassis-rs report named, on the page TH98 puts
    // them on, so TH99 has something to measure.
    for (const [channel, url] of [
        ['framework-free', staticUrl('list-with-form')],
        ['React', reactUrl('list-with-form')],
    ]) {
        test(`list-with-form: two fields and a button on one row, ${channel} [TH98]`, async ({ page }) => {
            await page.setViewportSize({ width: 1280, height: 900 });
            await page.goto(url);
            const row = page.locator('[data-example="filter-row"]');
            await expect(row.locator('.kp-field')).toHaveCount(2);
            const tops = await row.evaluate((el) => {
                const parts = [...el.querySelectorAll('.kp-field, button')];
                return parts.map((p) => p.getBoundingClientRect().top);
            });
            expect(tops.length).toBe(3);
            // One row means one row: the three tops sit within a line of
            // each other. The button is aligned on the field's bottom
            // edge by .kp-row--end, so the tops differ by less than the
            // height of a field.
            expect(Math.max(...tops) - Math.min(...tops)).toBeLessThan(40);
        });

        test(`list-with-form: a table cell holds a 70-character value, ${channel} [TH98]`, async ({ page }) => {
            await page.setViewportSize({ width: 1280, height: 900 });
            await page.goto(url);
            const cell = page.locator('[data-example="long-cell"]');
            const text = (await cell.textContent()) ?? '';
            expect(text.trim().length).toBeGreaterThanOrEqual(70);
        });
    }

    test('every example is linked from the index [TH98]', async ({ page }) => {
        await page.goto('/examples/index.html');
        for (const example of EXAMPLES) {
            await expect(page.locator(`a[href="${example.id}.html"]`)).toHaveCount(1);
        }
    });

    // Kenny pressed Next on the published wizard page on 2026-09-07 and
    // got a white flash and the first step back. The page drew a wizard
    // without being one: no [data-kp-wizard], no [data-kp-step], and a
    // `type="submit"` button labelled Next, so pressing it submitted the
    // form and reloaded the page. Eleven gates and the whole browser suite
    // were green on it, because none of them pressed the button.
    //
    // Drill [KT3]: remove `data-kp-wizard` from the descriptor in
    // showcase/examples.mjs and regenerate — js/auto.js then attaches
    // nothing and the step never leaves 1.
    test('the wizard example advances a step when Next is pressed [TH48, TH98]', async ({ page }) => {
        await page.goto('/examples/wizard.html');
        const steps = page.locator('[data-kp-step]');
        await expect(steps).toHaveCount(3);

        const visible = async () => steps.evaluateAll((els) => els.findIndex((el) => !el.hasAttribute('hidden')));
        expect(await visible(), 'the wizard starts on the first step').toBe(0);

        // A real press, not a dispatched event: the fault was that pressing
        // it navigated, and only a press can show that it no longer does.
        const before = page.url();
        await page.locator('[data-kp-wizard-next]').click();
        expect(await visible(), 'Next moved the wizard on').toBe(1);
        expect(page.url(), 'Next navigated instead of changing step').toBe(before);

        await page.locator('[data-kp-wizard-back]').click();
        expect(await visible(), 'Back moved the wizard back').toBe(0);
    });

    test('the inline-style exceptions name pages that exist [TH109]', () => {
        const ids = new Set(EXAMPLES.map((e) => e.id));
        for (const exception of INLINE_STYLE_EXCEPTIONS) {
            expect(ids.has(exception.page), `${exception.page} is not an example`).toBe(true);
            expect(exception.why.length).toBeGreaterThan(20);
        }
    });
});

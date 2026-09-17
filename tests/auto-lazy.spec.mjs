// js/auto.js fetches only the modules a page needs, and the page ends up
// exactly as it did when every module was attached [scope-115].
//
// Until 6.1.0 the entry imported twenty modules unconditionally and called
// every attach function on the whole document. Now it asks the document
// which components it carries and `import()`s only those. The risk is one
// thing only: a selector missing from a module's `when`, so a page that
// carries the component never fetches its module and the component sits
// there dead, silently.
//
// So every page that loads js/auto.js is opened twice: once as it is, and
// once with the old entry served in its place (tests/fixtures/auto-eager.txt,
// js/auto.js as 6.1.0 shipped it, verbatim). What each attach function leaves
// behind in the markup — the attributes it sets, the elements it adds — is
// read from both and must be the same. A generated id is read with its
// digits masked, because the order modules arrive in decides the counter.
//
// Drilled 2026-09-17 in firefox: `select` taken out of the combobox module's
// `when` in js/auto.js → 32 of 145 pages red, each naming the drawn select's
// listbox as "only with every module attached". Restored green.
//
// What this cannot see is a module that only listens: an attach function that
// adds a handler and writes nothing leaves the markup the same either way.
// Those were found by reading every attach function (2026-09-17), and the four
// modules with such behaviour on every page are loaded unconditionally.

import { readFileSync, readdirSync } from 'node:fs';
import { expect, test } from '@playwright/test';

const ROOT = new URL('../', import.meta.url);
const EAGER = readFileSync(new URL('fixtures/auto-eager.txt', import.meta.url), 'utf8');

/** Every page under these folders that loads js/auto.js. */
const PAGES = ['tests/fixtures', 'examples', 'catalogue', 'site/components']
    .flatMap((dir) => readdirSync(new URL(`${dir}/`, ROOT)).map((name) => `${dir}/${name}`))
    .filter((path) => path.endsWith('.html') && /src="[^"]*js\/auto\.js"/.test(readFileSync(new URL(path, ROOT), 'utf8')))
    .sort();

/** The attributes an attach function never sets or sets to a moment, not a state. */
const VOLATILE = new Set(['style', 'data-kp-effects-done', 'data-kp-auto-ready', 'data-n1', 'data-n2']);
/** Attributes whose values carry a generated counter. */
const ID_LIKE = /^(id|for|aria-controls|aria-labelledby|aria-describedby|aria-owns|aria-activedescendant|list|form|data-kp-for)$/;

/** @param {import('@playwright/test').Page} page */
const settle = (page) =>
    page.evaluate(async () => {
        await document.fonts.ready;
        await new Promise((resolve) => setTimeout(resolve, 400));
        await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    });

/** @param {import('@playwright/test').Page} page */
const markup = (page) =>
    page.evaluate(
        ([volatile, idLike]) => {
            const skip = new Set(volatile);
            const ids = new RegExp(idLike);
            const out = [];
            const walk = (/** @type {Element} */ el, /** @type {string} */ path) => {
                const attrs = [...el.attributes]
                    .filter((a) => !skip.has(a.name))
                    .map((a) => `${a.name}=${ids.test(a.name) ? a.value.replace(/[-_][A-Za-z0-9]+$/, '-*').replace(/\d+/g, 'N') : a.value}`)
                    .sort();
                out.push(`${path} ${el.localName} ${attrs.join(' ')}`);
                [...el.children].forEach((child, i) => walk(child, `${path}/${i}`));
            };
            walk(document.documentElement, 'html');
            return out;
        },
        [[...VOLATILE], ID_LIKE.source],
    );

/**
 * The markup once it has stopped moving: read until two readings 300ms apart
 * agree. The catalogue's own pages compose their sections from fetched pages
 * after load, so a single reading caught one side mid-composition.
 * @param {import('@playwright/test').Page} page
 */
const stable = async (page) => {
    await settle(page);
    let before = await markup(page);
    for (let i = 0; i < 20; i++) {
        await page.waitForTimeout(300);
        const now = await markup(page);
        if (now.join('\n') === before.join('\n')) return now;
        before = now;
    }
    return before;
};

test.describe.configure({ mode: 'parallel' });

for (const path of PAGES) {
    test(
        `${path} ends up the same as with every module attached [scope-115]`,
        { tag: ['@sweep', '@component:bundle'] },
        async ({ page, browser }) => {
            await page.emulateMedia({ reducedMotion: 'reduce' });
            await page.goto(`/${path}`);
            await page.waitForLoadState('load');
            await page.waitForSelector('html[data-kp-auto-ready]', { state: 'attached' });
            const lazy = await stable(page);

            const context = await browser.newContext();
            const eager = await context.newPage();
            await eager.emulateMedia({ reducedMotion: 'reduce' });
            await eager.route('**/js/auto.js', (route) => route.fulfill({ status: 200, contentType: 'text/javascript', body: EAGER }));
            await eager.goto(new URL(`/${path}`, page.url()).href);
            await eager.waitForLoadState('load');
            const whole = await stable(eager);
            await context.close();

            expect(
                lazy.filter((line) => !whole.includes(line)),
                'only in the lazy page',
            ).toEqual([]);
            expect(
                whole.filter((line) => !lazy.includes(line)),
                'only with every module attached',
            ).toEqual([]);
        },
    );
}

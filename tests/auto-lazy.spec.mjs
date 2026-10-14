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
// js/auto.js as 6.1.0 shipped it, verbatim — and, since scope-117, js/effects.js
// as 6.1.0 shipped it, in tests/fixtures/effects-eager.txt, before its hooks
// moved into js/effects/). What each attach function leaves
// behind in the markup — the attributes it sets, the elements it adds — is
// read from both and must be the same. A generated id is read with its
// digits masked, because the order modules arrive in decides the counter.
//
// Drilled 2026-09-17 in firefox: `select` taken out of the combobox module's
// `when` in js/auto.js → 32 of 145 pages red, each naming the drawn select's
// listbox as "only with every module attached". Restored green.
// Drilled again for the effects split (scope-117): the marquee hook never
// fetched → 27 of 145 pages red. Restored green.
//
// What this cannot see is a module that only listens: an attach function that
// adds a handler and writes nothing leaves the markup the same either way.
// Those were found by reading every attach function (2026-09-17), and the four
// modules with such behaviour on every page are loaded unconditionally.

import { readFileSync, readdirSync } from 'node:fs';
import { expect, test } from '@playwright/test';
import { NEEDS } from '../js/auto.js';

const ROOT = new URL('../', import.meta.url);
// A module born after 6.1.0 that writes markup is attached on the eager side
// too, or the comparison would read its own additions as a missing `when`:
// js/progressbar.js writes the track, fill and head into a one-line bar
// [scope-140]; the dashboard components [scope-143] write shared action
// columns, sparklines, KPI toggles and strips, the attention band's order,
// the chart's drawing and the "updated ago" labels; the graph writes its kind
// bar and the menu button its aria wiring. (js/log.js, also later, writes only
// `style`, which is volatile.) They are static imports run inside `attachAll()`,
// not calls appended at load, so a page that composes itself later and calls
// `attachAll(host)` (the catalogue index) gets them on the eager side too.
const EXTRA = [
    ['./progressbar.js', 'attachProgressbars'],
    ['./actions.js', 'attachActionColumns'],
    ['./kpi.js', 'attachSparklines'],
    ['./kpi.js', 'attachKpiToggles'],
    ['./kpi.js', 'attachKpiStrips'],
    ['./attention.js', 'attachAttention'],
    ['./tiles.js', 'attachTileSets'],
    ['./freshness.js', 'attachAgo'],
    ['./chart.js', 'attachCharts'],
    ['./graph.js', 'attachGraphs'],
    ['./menu-button.js', 'attachMenuButtons'],
];
const EAGER = readFileSync(new URL('fixtures/auto-eager.txt', import.meta.url), 'utf8')
    .replace(/^/, EXTRA.map(([from, name], i) => `import { ${name} as extra${i} } from '${from}';\n`).join(''))
    .replace('        attachGrids(root),\n    ];', `        attachGrids(root),\n${EXTRA.map((_, i) => `        extra${i}(root),\n`).join('')}    ];`);
if (!EAGER.includes('extra0(root)')) throw new Error('the eager entry no longer ends its attach list with attachGrids(root)');
/** js/effects.js as 6.1.0 shipped it, one module with every hook in it [scope-117]. */
const EFFECTS_EAGER = readFileSync(new URL('fixtures/effects-eager.txt', import.meta.url), 'utf8');

/** Every page under these folders that loads js/auto.js. */
const ALL_PAGES = ['tests/fixtures', 'examples', 'catalogue', 'site/components']
    .flatMap((dir) => readdirSync(new URL(`${dir}/`, ROOT)).map((name) => `${dir}/${name}`))
    .filter((path) => path.endsWith('.html') && /src="[^"]*js\/auto\.js"/.test(readFileSync(new URL(path, ROOT), 'utf8')))
    .sort();

/** The `kp-` classes a script names: a class only a stylesheet reads asks nothing of the loader. */
const SCRIPTED = new Set(
    ['js/', 'js/effects/']
        .flatMap((dir) =>
            readdirSync(new URL(dir, ROOT))
                .filter((name) => name.endsWith('.js'))
                .map((name) => readFileSync(new URL(`${dir}${name}`, ROOT), 'utf8')),
        )
        .flatMap((source) => [...source.matchAll(/(?<![\w-])(kp-[a-z0-9]+(?:[-_]{1,2}[a-z0-9]+)*)/g)].map((m) => m[1])),
);

/**
 * What a page can ask of the loader, read from its markup: every `kp-` class a
 * script names, every `data-kp-` attribute, the bare elements a module acts on, and per
 * module the exact set of its `when` selectors the page carries (a module
 * attached through one selector alone is a different case from the same
 * module reached through two).
 * @param {string} html
 */
const asks = (html) => {
    const found = new Set();
    for (const m of html.matchAll(/\bclass="([^"]*)"/g)) for (const c of m[1].split(/\s+/)) if (SCRIPTED.has(c)) found.add(`.${c}`);
    for (const m of html.matchAll(/\s(data-kp-[a-z0-9-]+)/g)) found.add(`[${m[1]}]`);
    for (const m of html.matchAll(/<(select|mark|dialog|details|input|textarea)\b/g)) found.add(m[1]);
    for (const need of NEEDS) {
        const carried = need.when
            .split(',')
            .map((one) => one.trim())
            .filter((one) => found.has(one));
        if (carried.length) found.add(`${need.name}:${carried.join('+')}`);
    }
    return found;
};

/**
 * The pages read [Kenny, form v9, 2026-10-04: from 148 to the pages that ask
 * something no other does]. The catalogue and the fixtures always; beyond
 * them, the fewest of the example and site pages that together ask
 * everything those ask and the always-read pages do not. 22 compare and 22
 * concept pages are one markup each in 22 themes, and a component's site
 * page repeats its catalogue page, so most of them add nothing. Computed, not
 * listed: a new page that asks something new is read without anyone adding it.
 */
const PAGES = (() => {
    const asked = new Map(ALL_PAGES.map((path) => [path, asks(readFileSync(new URL(path, ROOT), 'utf8'))]));
    const always = ALL_PAGES.filter((path) => path.startsWith('catalogue/') || path.startsWith('tests/fixtures/'));
    const covered = new Set(always.flatMap((path) => [...(asked.get(path) ?? [])]));
    const rest = ALL_PAGES.filter((path) => !always.includes(path));
    const chosen = [];
    for (;;) {
        const gain = (/** @type {string} */ path) => [...(asked.get(path) ?? [])].filter((one) => !covered.has(one)).length;
        const best = rest.filter((path) => !chosen.includes(path)).sort((a, b) => gain(b) - gain(a) || a.localeCompare(b))[0];
        if (!best || gain(best) === 0) break;
        chosen.push(best);
        for (const one of asked.get(best) ?? []) covered.add(one);
    }
    return [...always, ...chosen].sort();
})();

/** The attributes an attach function never sets or sets to a moment, not a state. */
const VOLATILE = new Set(['style', 'data-kp-effects-done', 'data-kp-auto-ready', 'data-kp-settling', 'data-n1', 'data-n2']);
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
                // `<time class="kp-ago">` writes datetime and title from the
                // clock: two loads a second apart differ there, in both channels.
                const clock = el.matches('time.kp-ago');
                const attrs = [...el.attributes]
                    .filter((a) => !skip.has(a.name) && !(clock && (a.name === 'datetime' || a.name === 'title')))
                    .map((a) => `${a.name}=${ids.test(a.name) ? a.value.replace(/[-_][A-Za-z0-9]+$/, '-*').replace(/\d+/g, 'N') : a.value}`)
                    .sort();
                // By depth, not by sibling position: an element one side adds at
                // the top of the body (a toast region, an overlay) must not shift
                // every path after it and read as a thousand changes.
                out.push(`${path} ${el.localName} ${attrs.join(' ')}`);
                for (const child of el.children) walk(child, `${path}/`);
            };
            // The root's own attributes, and the body: the head holds the lazily
            // linked registers, whose order follows the network, not a module.
            const root = document.documentElement;
            out.push(
                `html ${[...root.attributes]
                    .filter((a) => !skip.has(a.name))
                    .map((a) => `${a.name}=${a.value}`)
                    .sort()
                    .join(' ')}`,
            );
            walk(document.body, 'body');
            return out;
        },
        [[...VOLATILE], ID_LIKE.source],
    );

/**
 * The markup once it has stopped moving: read until two readings 300ms apart
 * agree. The catalogue's own pages compose their sections from fetched pages
 * after load, so a single reading caught one side mid-composition.
 * The catalogue index composes in two steps, about 1 s and about 5 s after
 * load, so for it a plateau must hold for 4.5 s, not 300 ms.
 * @param {import('@playwright/test').Page} page
 * @param {number} [quiet] how many readings 300ms apart must keep agreeing
 */
const stable = async (page, quiet = 1) => {
    await settle(page);
    let before = await markup(page);
    let agreed = 0;
    for (let i = 0; i < 60; i++) {
        await page.waitForTimeout(300);
        const now = await markup(page);
        if (now.join('\n') === before.join('\n')) {
            agreed += 1;
            if (agreed >= quiet) return now;
        } else agreed = 0;
        before = now;
    }
    return before;
};

/** Pages that compose themselves from fetched pages in several steps. */
const SLOW_COMPOSE = new Set(['catalogue/index.html']);

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
            const quiet = SLOW_COMPOSE.has(path) ? 15 : 1;
            if (SLOW_COMPOSE.has(path)) test.setTimeout(90_000);
            const lazy = await stable(page, quiet);

            const context = await browser.newContext();
            const eager = await context.newPage();
            await eager.emulateMedia({ reducedMotion: 'reduce' });
            await eager.route('**/js/auto.js', (route) => route.fulfill({ status: 200, contentType: 'text/javascript', body: EAGER }));
            await eager.route('**/js/effects.js', (route) => route.fulfill({ status: 200, contentType: 'text/javascript', body: EFFECTS_EAGER }));
            await eager.goto(new URL(`/${path}`, page.url()).href);
            await eager.waitForLoadState('load');
            const whole = await stable(eager, quiet);
            await context.close();

            /** Lines as counts, so a duplicate on one side is a difference too. @param {string[]} a @param {string[]} b */
            const beyond = (a, b) => {
                const left = new Map();
                for (const line of b) left.set(line, (left.get(line) ?? 0) + 1);
                return a.filter((line) => {
                    const n = left.get(line) ?? 0;
                    if (n === 0) return true;
                    left.set(line, n - 1);
                    return false;
                });
            };
            expect(beyond(lazy, whole), 'only in the lazy page').toEqual([]);
            expect(beyond(whole, lazy), 'only with every module attached').toEqual([]);
        },
    );
}

// Writes the showcase page and the bare per-theme fixtures [L5, AR14].
//
// Kenny chose the simple showcase: seven theme blocks on one page, because
// looking and comparing is what that page is for. Three things cannot be
// verified there, because they exist once per document — the light-or-dark
// declaration of DI6 (one scrollbar, one autofill treatment per page), the
// narrow-viewport reflow of DI11, and the print stylesheet of TH36. So the
// same specimens are also written out one theme per page, bare, and only
// the tests open those. Without them those three would sit in the
// documents as "tested" while nothing tested them.
//
// Generated rather than authored, and `--check` fails when the pages and
// their source disagree, for the same reason css/themes.css is: a showcase
// that has drifted from the code shows the wrong thing convincingly.
//
// Usage:
//   node gates/generate-showcase.mjs           write the pages
//   node gates/generate-showcase.mjs --check   exit 1 if either would change

import { mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import process from 'node:process';
import { SPECIMENS } from '../showcase/specimens.mjs';
import { THEMES } from '../js/theme-registry.js';
import { themeOptionsMarkup, THEME_MENU_ICON } from '../js/theme-picker.js';
import { getStrings } from '../js/strings.js';

const OUT = new URL('../showcase/', import.meta.url);
const FIXTURES = new URL('themes/', OUT);

const STYLE = readFileSync(new URL('showcase.css', OUT), 'utf8');

/**
 * The typefaces a theme names, as Google Fonts families [R0].
 *
 * Nothing in the package loads a webfont — the tokens name a face and a
 * consumer loads it (S19) — so until now the showcase showed every theme
 * in its fallback stack, and a third of a theme's character is its
 * letter. The showcase and the fixtures load the faces themselves, from
 * the same token values the stylesheet carries, so the list cannot
 * drift from the theme. Regular weight only: the API refuses a weight a
 * family does not have, and a synthesised bold on a showcase is a
 * smaller lie than a missing face.
 *
 * @param {string} name
 * @returns {string[]}
 */
function familiesOf(name) {
    /** @type {{entries: Array<{token?: string, value?: string}>}} */
    const source = JSON.parse(readFileSync(new URL(`../themes/${name}/tokens.json`, import.meta.url), 'utf8'));
    /** @type {string[]} */
    const families = [];
    for (const entry of source.entries) {
        if (entry.token !== 'theme-font-body' && entry.token !== 'theme-font-display') continue;
        const first = /^'([^']+)'/.exec(entry.value ?? '');
        if (first && !families.includes(first[1])) families.push(first[1]);
    }
    return families;
}

/** @param {string[]} families @returns {string} */
function fontLinks(families) {
    if (families.length === 0) return '';
    const query = families.map((f) => `family=${encodeURIComponent(f).replace(/%20/g, '+')}`).join('&');
    return (
        `<link rel="preconnect" href="https://fonts.googleapis.com" />\n` +
        `        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />\n` +
        `        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?${query}&display=swap" data-sc-fonts />`
    );
}

/** @param {string} theme @param {{all?: boolean}} [options] */
function specimenBlocks(theme, { all = true } = {}) {
    return SPECIMENS.filter((s) => all || !s.fixturesOnly)
        .map(
            (s) =>
                `<section class="sc-specimen" id="${theme}-${s.id}" data-specimen="${s.id}">\n` +
                `                <h3>${s.title}</h3>\n` +
                `                <p class="sc-note">${s.note}</p>\n` +
                `                ${s.html(theme)}\n` +
                `            </section>`,
        )
        .join('\n            ');
}

/**
 * The comparison page [TH88]: two halves, a picker each, one scroll.
 *
 * Kenny at round three's plan gate: the page of one block per theme had
 * become unwieldy for the one thing it is for, comparing. So every
 * specimen is rendered twice, left and right, each half wearing the
 * theme its own picker chose, and the two halves are one CSS grid — a
 * specimen on the left sits in the same grid row as its twin on the
 * right, so the halves cannot drift apart while the page scrolls.
 *
 * The side pickers are the showcase's own, on purpose: the package's
 * picker sets the document theme, and here nothing should. They reuse
 * the package's option markup and menu styling, and a small script below
 * wires them to their half and remembers the choice.
 */
function showcase() {
    const shown = SPECIMENS.filter((s) => !s.fixturesOnly);
    const s = getStrings();
    /** @param {'left' | 'right'} side @param {string} theme @param {number} column */
    const pane = (side, theme, column) => {
        const menuId = `sc-menu-${side}`;
        const bar =
            `            <div class="sc-cell sc-side" style="grid-row: 1; grid-column: ${column}">\n` +
            `                <span class="kp-theme-menu"><button type="button" class="kp-icon-button" popovertarget="${menuId}" aria-label="${s.themePicker}" style="anchor-name: --${menuId}">${THEME_MENU_ICON}</button>` +
            `<div popover="auto" id="${menuId}" class="kp-popover" style="position-anchor: --${menuId}"><ul class="kp-menu" data-sc-picker="${side}" aria-label="${s.themePicker}">${themeOptionsMarkup()}</ul></div></span>\n` +
            `                <h2 class="sc-side__name" data-sc-name="${side}"></h2>\n` +
            `            </div>`;
        const cells = shown
            .map(
                (spec, i) =>
                    `            <section class="sc-specimen sc-cell" id="${side}-${spec.id}" data-specimen="${spec.id}" style="grid-row: ${i + 2}; grid-column: ${column}">\n` +
                    `                <h3>${spec.title}</h3>\n` +
                    `                <p class="sc-note">${spec.note}</p>\n` +
                    `                ${spec.html(`${side}-${theme}`)}\n` +
                    `            </section>`,
            )
            .join('\n');
        return `        <section class="sc-pane sc-theme" data-sc-side="${side}" data-theme="${theme}" id="pane-${side}">\n${bar}\n${cells}\n        </section>`;
    };

    return `<!doctype html>
<html lang="en">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>kp-themes — showcase</title>
        ${fontLinks([...new Set(THEMES.flatMap((t) => familiesOf(t.name)))])}
        <link rel="stylesheet" href="../css/themes.css" />
        <link rel="stylesheet" href="../css/components.css" />
        <style>
${STYLE}        </style>
    </head>
    <body>
        <header class="sc-header">
            <h1>kp-themes</h1>
            <p>
                Twee helften, elk met een eigen thema uit de picker erboven; alles staat links én rechts, en de pagina scrollt als één
                geheel, zodat je twee thema's naast elkaar vergelijkt in plaats van ze onder elkaar te zoeken. Wat je ziet is de
                gegenereerde stylesheet, niet een screenshot — deze pagina wordt geschreven door <code>gates/generate-showcase.mjs</code>
                en loopt rood in de gates zodra ze afwijkt van de code.
            </p>
            <p>
                Alles hier is framework-vrij: dit is wat een consumer zonder npm krijgt. Het React-kanaal staat er niet op — dat heeft een
                bundle nodig en dit package heeft geen bouwstap. De vergelijking tussen beide kanalen gebeurt waar wel een bundle is, in de
                browsertests, en wordt daar gemeten in plaats van bekeken.
            </p>
        </header>
        <div class="sc-panes">
${pane('left', 'formal', 1)}
${pane('right', 'dark', 2)}
        </div>
        <script>
            // Before first paint: each half wears what it wore last time.
            (function () {
                try {
                    for (var side of ['left', 'right']) {
                        var t = localStorage.getItem('showcase.' + side);
                        var pane = document.getElementById('pane-' + side);
                        if (t && pane) pane.dataset.theme = t;
                    }
                } catch (e) {}
            })();
        </script>
        <script type="module">
            import { THEMES, isTheme } from '../js/theme-core.js';

            // The side pickers [TH88]: showcase-only, so they deliberately do
            // not carry data-kp-theme-picker — the package's picker would set
            // the document theme, and here each half has its own.
            const label = (name) => THEMES.find((t) => t.name === name)?.label ?? name;
            for (const list of document.querySelectorAll('[data-sc-picker]')) {
                const side = list.dataset.scPicker;
                const pane = document.getElementById('pane-' + side);
                const name = document.querySelector('[data-sc-name="' + side + '"]');
                const mark = () => {
                    const current = isTheme(pane.dataset.theme) ? pane.dataset.theme : 'formal';
                    pane.dataset.theme = current;
                    name.textContent = label(current);
                    for (const option of list.querySelectorAll('[data-kp-theme]')) {
                        const selected = option.dataset.kpTheme === current;
                        option.setAttribute('aria-pressed', String(selected));
                        option.dataset.selected = String(selected);
                        option.classList.toggle('is-selected', selected);
                    }
                };
                list.addEventListener('click', (event) => {
                    const option = event.target.closest('[data-kp-theme]');
                    if (!option || !isTheme(option.dataset.kpTheme)) return;
                    pane.dataset.theme = option.dataset.kpTheme;
                    try {
                        localStorage.setItem('showcase.' + side, option.dataset.kpTheme);
                    } catch {}
                    mark();
                    list.closest('[popover]')?.hidePopover();
                });
                mark();
            }
            // Pure modules since 3.0.0 [KT6]: nothing attaches on import.
            // One call wires the whole page, contracts included [DI4, DI10].
            const { attachAll } = await import('../js/auto.js');
            attachAll();
        </script>
    </body>
</html>
`;
}

/**
 * One theme, nothing else. The tests open these: a document has exactly one
 * colour scheme, one scrollbar and one viewport, so the three checks that
 * are per-document cannot run on a page carrying seven themes at once.
 *
 * @param {{name: string, label: string, dark: boolean}} theme
 */
function fixture(theme) {
    return `<!doctype html>
<html lang="en" data-theme="${theme.name}">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>kp-themes — ${theme.label}</title>
        ${fontLinks(familiesOf(theme.name))}
        <link rel="stylesheet" href="../../css/themes.css" />
        <link rel="stylesheet" href="../../css/components.css" />
        <style>
${STYLE}        </style>
    </head>
    <body>
        <main class="sc-theme">
            <h2>${theme.label}</h2>
            ${specimenBlocks(theme.name)}
        </main>
        <script type="module" src="../../js/auto.js"></script>
    </body>
</html>
`;
}

const pages = [
    { path: new URL('index.html', OUT), name: 'showcase/index.html', content: showcase() },
    ...THEMES.map((t) => ({
        path: new URL(`${t.name}.html`, FIXTURES),
        name: `showcase/themes/${t.name}.html`,
        content: fixture(t),
    })),
];

if (process.argv.includes('--check')) {
    let stale = 0;
    for (const page of pages) {
        let current = '';
        try {
            current = readFileSync(page.path, 'utf8');
        } catch {
            current = '';
        }
        if (current !== page.content) {
            stale++;
            console.error(`${page.name} does not match its source.`);
        }
    }
    // A fixture left behind by a theme that no longer exists is drift too,
    // and the kind that keeps passing: the tests would happily go on
    // measuring a page nothing generates any more.
    const expected = new Set(THEMES.map((t) => `${t.name}.html`));
    for (const file of readdirSync(FIXTURES)) {
        if (!expected.has(file)) {
            stale++;
            console.error(`showcase/themes/${file} belongs to no theme.`);
        }
    }
    if (stale > 0) {
        console.error('Run `npm run generate:showcase` and commit the result.');
        process.exit(1);
    }
    console.log(`Showcase: 1 page and ${THEMES.length} fixtures match their source.`);
    process.exit(0);
}

mkdirSync(FIXTURES, { recursive: true });
for (const file of readdirSync(FIXTURES)) rmSync(new URL(file, FIXTURES));
for (const page of pages) writeFileSync(page.path, page.content);
console.log(`wrote showcase/index.html and ${THEMES.length} bare fixtures.`);

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

const OUT = new URL('../showcase/', import.meta.url);
const FIXTURES = new URL('themes/', OUT);

const STYLE = readFileSync(new URL('showcase.css', OUT), 'utf8');

/** @param {string} theme */
function specimenBlocks(theme) {
    return SPECIMENS.map(
        (s) =>
            `<section class="sc-specimen" id="${theme}-${s.id}" data-specimen="${s.id}">\n` +
            `                <h3>${s.title}</h3>\n` +
            `                <p class="sc-note">${s.note}</p>\n` +
            `                ${s.html(theme)}\n` +
            `            </section>`,
    ).join('\n            ');
}

const NO_FLASH = `<script>
            (function () {
                try {
                    var t = localStorage.getItem('theme');
                    if (t) document.documentElement.dataset.theme = t;
                } catch (e) {}
            })();
        </script>`;

/** The comparison page: seven blocks, one per theme, all on one document. */
function showcase() {
    const blocks = THEMES.map(
        (t) =>
            `        <article class="sc-theme" data-theme="${t.name}" id="theme-${t.name}">\n` +
            `            <h2>${t.label}<small>${t.dark ? 'donker' : 'licht'}</small></h2>\n` +
            `            ${specimenBlocks(t.name)}\n` +
            `        </article>`,
    ).join('\n');

    return `<!doctype html>
<html lang="nl">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>kp-themes — showcase</title>
        ${NO_FLASH}
        <link rel="stylesheet" href="../css/themes.css" />
        <link rel="stylesheet" href="../css/components.css" />
        <style>
${STYLE}        </style>
    </head>
    <body>
        <header class="sc-header">
            <h1>kp-themes</h1>
            <p>
                Elk blok hieronder draagt zijn eigen thema. Wat je ziet is de gegenereerde stylesheet, niet een screenshot — deze pagina wordt
                geschreven door <code>gates/generate-showcase.mjs</code> en loopt rood in de gates zodra ze afwijkt van de code.
            </p>
            <p>
                Alles hier is framework-vrij: dit is wat een consumer zonder npm krijgt. Het React-kanaal staat er niet op — dat heeft een
                bundle nodig en dit package heeft geen bouwstap. De vergelijking tussen beide kanalen gebeurt waar wel een bundle is, in de
                browsertests, en wordt daar gemeten in plaats van bekeken.
            </p>
        </header>
${blocks}
        <script type="module">
            import { THEMES } from '../js/theme-registry.js';

            // Every picker on this page renders the same seven options.
            // The blocks each wear their own theme, so a picker inside one
            // shows that block's colours while switching the document.
            for (const host of document.querySelectorAll('[data-kp-theme-picker]')) {
                for (const t of THEMES) {
                    const b = document.createElement('button');
                    b.type = 'button';
                    b.dataset.kpTheme = t.name;
                    b.innerHTML = \`<span class="kp-swatch" data-theme="\${t.name}"></span>\`;
                    b.append(t.label);
                    host.append(b);
                }
            }
            await import('../js/theme-picker.js');
            // The contracts are enforced on this page too: a specimen that
            // broke one should be visibly refused here, not only in the
            // tests [DI4, DI10].
            await import('../js/components.js');
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
<html lang="nl" data-theme="${theme.name}">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>kp-themes — ${theme.label}</title>
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
        <script type="module" src="../../js/components.js"></script>
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

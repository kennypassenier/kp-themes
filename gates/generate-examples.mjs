// Writes the ten example pages and their index [TH98, T11, AR22].
//
// The same machinery as gates/generate-showcase.mjs, extended rather than
// replaced (T11: the existing generators grow, no static site generator
// arrives). The pages are committed, `--check` fails when they no longer
// match their source, and the source is showcase/examples.mjs.
//
// What a page is allowed to contain is the point of the exercise: four
// stylesheet links, the markup, and one module script. No page-local
// <style>, no style attribute outside the exception list — that is
// TH109, and gates/check-inline-styles.mjs is what enforces it.
//
// Usage:
//   node gates/generate-examples.mjs           write the pages
//   node gates/generate-examples.mjs --check   exit 1 if any would change

import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import process from 'node:process';
import { EXAMPLES, conceptBody, el, renderHTML } from '../showcase/examples.mjs';
import { CONCEPT_COPY, DEFAULT_COPY_THEME, conceptCopy } from '../showcase/concept-copy.mjs';
import { THEMES } from '../js/theme-registry.js';
import { noFlashSnippet } from '../js/no-flash.js';
import { comparePages } from './generate-compare.mjs';

const OUT = new URL('../examples/', import.meta.url);

/* The head script: the stored theme before the stylesheet (TH23) and the
 * effects armed before first paint (AR34), in one inline snippet. */
/** The stylesheets a page loads, in cascade order [AR17]. */
// The two registers are opt-in for a consumer (README) and were left off
// these pages by omission rather than by decision -- no generator said a
// word about them either way. The consequence was that picking cyberpunk
// or retro here showed a theme that was not that theme, which is KT8
// verbatim. Kenny found it on the published site on 2026-09-07 and chose
// to load them: a page that exists to show what a theme looks like shows
// it whole.
// fonts.css joined at round six's C4 (T19): a page that exists to show a
// theme shows it in its own face.
const SHEETS = [
    'fonts.css',
    'themes.css',
    'components.css',
    'layout.css',
    'utilities.css',
    'cyberpunk-register.css',
    'retro-register.css',
    'synthwave-register.css',
    'phantom-register.css',
    'terminal-register.css',
    'brutalism-register.css',
    'woodblock-register.css',
    'pastel-register.css',
    'shade-light-register.css',
    'ticker-register.css',
    'forest-register.css',
    'deco-register.css',
    'light-register.css',
    'grotesk-register.css',
    'blueprint-register.css',
    'nostromo-register.css',
    'dark-register.css',
    'academia-register.css',
    'formal-register.css',
    'sepia-register.css',
    'solstice-register.css',
    'mono-register.css',
    'high-contrast-register.css',
    'lapis-register.css',
    'shade-dark-register.css',
];

/**
 * @param {string} title
 * @param {string} body
 * @returns {string}
 */
function page(title, body, { themeFromQuery = false, theme = '' } = {}) {
    const links = SHEETS.map((sheet) => `        <link rel="stylesheet" href="../css/${sheet}" />`).join('\n');
    // The concept demo opts in to `?theme=<name>` [AR42]; no other page
    // does, so a query parameter never changes a page that did not ask.
    // A per-theme concept page (S49, A1) also wears its own theme from the
    // markup, so the words and the tokens arrive together with no script.
    const attrs = [themeFromQuery ? ' data-kp-theme-from-query' : '', theme ? ` data-theme="${theme}"` : ''].join('');
    const html = `<html lang="en"${attrs}>`;
    return `<!doctype html>
${html}
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>kp-themes — ${title}</title>
        <script>
            ${noFlashSnippet({ effects: true }).replace(/\n/g, '\n            ')}
        </script>
${links}
    </head>
    <body>
${body}
        <script type="module" src="../js/auto.js"></script>
    </body>
</html>
`;
}

/**
 * The index: the ten pages with the one line each says about itself.
 *
 * It is built from the same classes the pages are, so it is evidence
 * rather than chrome. R6 hangs the site navigation off this same list.
 */
function index() {
    const body = [
        el(
            'main',
            { id: 'main', class: 'kp-page' },
            el(
                'div',
                { class: 'kp-stack' },
                el('h1', {}, 'Example pages'),
                el(
                    'p',
                    { class: 'kp-prose kp-text-muted' },
                    'Ten screens built out of css/layout.css, css/utilities.css and the component classes, and nothing else. ' +
                        'Every one of them is generated from one descriptor and rendered in both channels.',
                ),
                el(
                    'ul',
                    { class: 'kp-stack' },
                    EXAMPLES.filter((example) => example.id !== 'concept').map((example) =>
                        el(
                            'li',
                            {},
                            el('a', { href: `${example.id}.html` }, example.title),
                            el('p', { class: 'kp-text-muted kp-prose' }, example.note),
                        ),
                    ),
                ),
                // The concept demo, once per theme [TH126, S46, AR42]: one
                // page, twenty-four URLs, so the approval form for a theme
                // names a link Kenny opens rather than a file in git.
                el('h2', {}, 'The concept demo, per theme'),
                el(
                    'p',
                    { class: 'kp-prose kp-text-muted' },
                    'The page every new theme is tried on before a token is written. A theme whose concept demo Kenny approved ' +
                        'has its own page in its own words (S49); a theme that has not been lifted yet wears the default page and ' +
                        'answers the hooks quietly, and that is what quiet looks like.',
                ),
                el(
                    'p',
                    { class: 'kp-prose' },
                    el('a', { href: 'concept.html' }, 'The concept demo'),
                    ' under the theme this page is wearing, or under any of the themes by name:',
                ),
                el(
                    'ul',
                    { class: 'kp-row' },
                    THEMES.map((theme) =>
                        el(
                            'li',
                            {},
                            el(
                                'a',
                                {
                                    href:
                                        theme.name in CONCEPT_COPY && theme.name !== DEFAULT_COPY_THEME
                                            ? `concept-${theme.name}.html`
                                            : `concept.html?theme=${theme.name}`,
                                },
                                theme.label,
                            ),
                        ),
                    ),
                ),
                el(
                    'p',
                    { class: 'kp-prose' },
                    el('a', { href: 'compare.html' }, 'Old against new'),
                    ': one page per theme, the same demo under the 4.0.0 release on the left and the current build on the right, the differences marked.',
                ),
            ),
        ),
    ];
    return page('example pages', renderHTML(body, 8));
}

const pages = [
    { name: 'examples/index.html', file: 'index.html', content: index() },
    // The compare index, one page per theme and the two frames [MR-R6-COMPARE].
    ...comparePages(),
    ...EXAMPLES.map((example) => ({
        name: `examples/${example.id}.html`,
        file: `${example.id}.html`,
        content: page(example.title, renderHTML(example.body, 8), { themeFromQuery: example.id === 'concept' }),
    })),
    // One concept page per theme with an approved demo [S49, A1 of
    // 2026-09-08]: the same structure and the same markers (S46, KT11),
    // the theme's own words. The default page keeps the picker and stays
    // the place to compare all twenty-five under one set of words.
    ...Object.keys(CONCEPT_COPY)
        .filter((theme) => theme !== DEFAULT_COPY_THEME)
        .map((theme) => ({
            name: `examples/concept-${theme}.html`,
            file: `concept-${theme}.html`,
            content: page('Concept demo', renderHTML(conceptBody(conceptCopy(theme)), 8), { themeFromQuery: true, theme }),
        })),
];

if (process.argv.includes('--check')) {
    let stale = 0;
    for (const item of pages) {
        let current = '';
        try {
            current = readFileSync(new URL(item.file, OUT), 'utf8');
        } catch {
            current = '';
        }
        if (current !== item.content) {
            stale++;
            console.error(`${item.name} does not match its source.`);
        }
    }
    // A page left behind by an example that no longer exists is drift of
    // the kind that keeps passing: the gates would go on measuring a page
    // nothing generates any more.
    const expected = new Set(pages.map((item) => item.file));
    for (const file of readdirSync(OUT)) {
        if (!expected.has(file)) {
            stale++;
            console.error(`examples/${file} belongs to no example.`);
        }
    }
    if (stale > 0) {
        console.error('Run `npm run generate:examples` and commit the result.');
        process.exit(1);
    }
    // AR26: the number comes from the descriptor list, not from the
    // directory the generator just wrote.
    console.log(`Examples: ${EXAMPLES.length} pages and their index match their source.`);
    process.exit(0);
}

mkdirSync(OUT, { recursive: true });
for (const item of pages) writeFileSync(new URL(item.file, OUT), item.content);
console.log(`wrote ${EXAMPLES.length} example pages and their index.`);

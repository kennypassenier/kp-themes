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
import { EXAMPLES, el, renderHTML } from '../showcase/examples.mjs';
import { THEMES } from '../js/theme-registry.js';
import { noFlashSnippet } from '../js/no-flash.js';

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
const SHEETS = ['fonts.css', 'themes.css', 'components.css', 'layout.css', 'utilities.css', 'cyberpunk-register.css', 'retro-register.css'];

/**
 * @param {string} title
 * @param {string} body
 * @returns {string}
 */
function page(title, body, { themeFromQuery = false } = {}) {
    const links = SHEETS.map((sheet) => `        <link rel="stylesheet" href="../css/${sheet}" />`).join('\n');
    // The concept demo opts in to `?theme=<name>` [AR42]; no other page
    // does, so a query parameter never changes a page that did not ask.
    const html = themeFromQuery ? '<html lang="en" data-kp-theme-from-query>' : '<html lang="en">';
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
                    'The page every new theme is tried on before a token is written. The same file under every theme; ' +
                        'a theme that has not been lifted yet answers the hooks quietly, and that is what quiet looks like.',
                ),
                el(
                    'p',
                    { class: 'kp-prose' },
                    el('a', { href: 'concept.html' }, 'The concept demo'),
                    ' under the theme this page is wearing, or under one of the twenty-four by name:',
                ),
                el(
                    'ul',
                    { class: 'kp-row' },
                    THEMES.map((theme) => el('li', {}, el('a', { href: `concept.html?theme=${theme.name}` }, theme.label))),
                ),
                el(
                    'p',
                    { class: 'kp-prose' },
                    el('a', { href: 'compare.html?theme=cyberpunk' }, 'Old against new'),
                    ': the same demo under the 4.0.0 release on the left and the current build on the right, for any theme.',
                ),
            ),
        ),
    ];
    return page('example pages', renderHTML(body, 8));
}

/**
 * The concept demo under the 4.0.0 bundle [MR-R6-COMPARE]: the same
 * descriptor body, the release's own dist/kp-themes.css and kp-themes.js
 * vendored under showcase/baseline/4.0.0/ and held to that release's
 * SHA256SUMS by gates/check-baseline.mjs. What a consumer with the old
 * stylesheet sees on the new markup, which is what the compare page puts
 * beside the current build. The 4.0.0 script knows no `?theme=`; the
 * compare page sets the theme on both documents itself.
 */
function baselineConcept() {
    const concept = EXAMPLES.find((example) => example.id === 'concept');
    if (!concept) throw new Error('no concept example');
    return `<!doctype html>
<html lang="en">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>kp-themes — ${concept.title}, under 4.0.0</title>
        <link rel="stylesheet" href="../showcase/baseline/4.0.0/kp-themes.css" />
    </head>
    <body>
${renderHTML(concept.body, 8)}
        <script type="module" src="../showcase/baseline/4.0.0/kp-themes.js"></script>
    </body>
</html>
`;
}

/**
 * The compare page [MR-R6-COMPARE]: 4.0.0 on the left, the current build
 * on the right, the same theme in both from `?theme=<name>`, each in its
 * own frame. Kenny asked for it during C0: "de oude vs de nieuwe versie
 * links vs rechts vergelijken". The frames are sized by attribute, not
 * style (TH109); the script below is the page's only behaviour and sets
 * the theme on both documents once they have loaded.
 */
function compare() {
    const body = [
        el(
            'main',
            { id: 'main', class: 'kp-page' },
            el(
                'div',
                { class: 'kp-stack' },
                el('h1', {}, 'Old against new'),
                el(
                    'p',
                    { class: 'kp-prose kp-text-muted' },
                    'The concept demo twice: on the left under the 4.0.0 release, on the right under the current build, the same theme in both. ' +
                        'Pick a theme below; the choice lands in the address bar so a link carries it.',
                ),
                el(
                    'ul',
                    { class: 'kp-row', id: 'compare-themes' },
                    THEMES.map((theme) =>
                        el('li', {}, el('a', { href: `compare.html?theme=${theme.name}`, 'data-theme-link': theme.name }, theme.label)),
                    ),
                ),
                el(
                    'div',
                    { class: 'kp-autogrid', 'data-kp-compare': '' },
                    el(
                        'section',
                        { class: 'kp-stack', 'aria-labelledby': 'compare-old' },
                        el('h2', { id: 'compare-old' }, '4.0.0'),
                        el('iframe', {
                            src: 'concept-4.0.0.html',
                            title: 'The concept demo under 4.0.0',
                            width: '100%',
                            height: '900',
                            'data-compare-side': 'old',
                        }),
                    ),
                    el(
                        'section',
                        { class: 'kp-stack', 'aria-labelledby': 'compare-new' },
                        el('h2', { id: 'compare-new' }, 'Current build'),
                        el('iframe', {
                            src: 'concept.html',
                            title: 'The concept demo under the current build',
                            width: '100%',
                            height: '900',
                            'data-compare-side': 'new',
                        }),
                    ),
                ),
            ),
        ),
    ];
    const script = `
        <script type="module">
            // The theme from the query on both frames, once each has loaded;
            // the 4.0.0 script knows no query parameter, so the page sets the
            // attribute itself. Same origin, so the documents are reachable.
            const theme = new URLSearchParams(location.search).get('theme');
            const frames = document.querySelectorAll('iframe[data-compare-side]');
            const apply = (frame) => {
                if (!theme) return;
                try {
                    frame.contentDocument?.documentElement.setAttribute('data-theme', theme);
                } catch {
                    // A frame not yet reachable applies on load below.
                }
            };
            for (const frame of frames) {
                frame.addEventListener('load', () => apply(frame));
                apply(frame);
            }
            if (theme) document.documentElement.setAttribute('data-theme', theme);
            for (const link of document.querySelectorAll('[data-theme-link]')) {
                if (link.getAttribute('data-theme-link') === theme) link.setAttribute('aria-current', 'page');
            }
        </script>`;
    return page('old against new', renderHTML(body, 8) + script, { themeFromQuery: true });
}

const pages = [
    { name: 'examples/index.html', file: 'index.html', content: index() },
    { name: 'examples/compare.html', file: 'compare.html', content: compare() },
    { name: 'examples/concept-4.0.0.html', file: 'concept-4.0.0.html', content: baselineConcept() },
    ...EXAMPLES.map((example) => ({
        name: `examples/${example.id}.html`,
        file: `${example.id}.html`,
        content: page(example.title, renderHTML(example.body, 8), { themeFromQuery: example.id === 'concept' }),
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

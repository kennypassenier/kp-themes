// Generates css/themes.css and js/theme-registry.js from the per-theme
// token source (T3, AR2, AR11).
//
// The stylesheet is assembled, not authored: generated token blocks
// between two hand-written partials. Most of that file is not tokens —
// the texture layer, the per-theme flourishes, the body rule, the
// scrollbar — and none of it is expressible as a colour token, so it
// lives in css/_rules.css and is concatenated unchanged.
//
// Nothing here may vary between runs (AR3): no timestamps, no host
// names, no commit hashes. `npm run generate -- --check` asserts the
// file on disk already matches, which is what the gates call.
//
// Usage:
//   node gates/generate-themes.mjs           write the artefacts
//   node gates/generate-themes.mjs --check   exit 1 if either would change

import { readFileSync, writeFileSync } from 'node:fs';

import process from 'node:process';
import { block, heroBlock } from './themes-blocks.mjs';

export { HERO_REMAP, HERO_INTERACTIVE, isDark } from './themes-blocks.mjs';

const ORDER = JSON.parse(readFileSync(new URL('../themes/order.json', import.meta.url), 'utf8'));
const OUT = new URL('../css/themes.css', import.meta.url);
const REGISTRY = new URL('../js/theme-registry.js', import.meta.url);

const CONFIG = JSON.parse(readFileSync(new URL('config.json', import.meta.url), 'utf8'));


/**
 * Who this stylesheet is, in a form JavaScript can read [TH97, AR10 as
 * amended by AR25].
 *
 * AR10 put the version in the marker comment and argued that a banner
 * bought nothing. That argument was right about banners and wrong about
 * the reader: it assumed the reader was a person. The mismatch this
 * package actually has to detect lives on a consumer's page — a
 * css/themes.css vendored at one version beside a js/ from another, which
 * is exactly how almanac ended up with twenty-four themes in its
 * stylesheet and eleven in its JavaScript — and a comment is the one
 * place getComputedStyle cannot look.
 *
 * Two properties, not one. The version says which build; the name list
 * says what that build actually contains, which is the fact a page cares
 * about and the fact a hand-edited file can get wrong while the version
 * still agrees.
 *
 * Outside the cascade layers, with the other token declarations [AR17].
 *
 * @param {string} version
 * @returns {string}
 */
function identity(version) {
    return [
        '/* The identity of this file, machine readable [TH97, AR25]. The comment',
        '   above says the same thing to a person; these two say it to the',
        '   JavaScript on the page, which is where a vendored stylesheet from one',
        '   version meets a registry from another. js/diagnostics.js reads them. */',
        ':root {',
        `    --kp-themes-version: '${version}';`,
        `    --kp-themes-names: '${ORDER.join(' ')}';`,
        '}',
    ].join('\n');
}

function build() {
    const dir = new URL('../themes/', import.meta.url);
    // AR10: the version goes inside the marker comment that has been this
    // file's recognition point for as long as it has existed. No banner
    // above it, no timestamp, no hash — a timestamp would also break AR3,
    // which says nothing here may vary between runs.
    const version = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8')).version;
    const header = readFileSync(new URL('../css/_header.css', import.meta.url), 'utf8').replace(
        '/* @kp-soft/themes — css/themes.css',
        `/* @kp-soft/themes v${version} — css/themes.css`,
    );
    const rules = readFileSync(new URL('../css/_rules.css', import.meta.url), 'utf8');
    // Unlayered, and last: see the header of css/_print.css for why a
    // layered print override loses to every theme's own tokens.
    const print = readFileSync(new URL('../css/_print.css', import.meta.url), 'utf8');
    // Unlayered and after the token blocks, for the reason css/_density.css
    // states in its own header.
    const density = readFileSync(new URL('../css/_density.css', import.meta.url), 'utf8');
    const sources = ORDER.map(/** @param {string} name */ (name) => JSON.parse(readFileSync(new URL(`${name}/tokens.json`, dir), 'utf8')));
    const blocks = sources.map(block);
    // The hero surface, per theme [TH116, AR38], after the token blocks
    // and before the authored rules; _rules.css begins with its own blank
    // line.
    const heroes = [
        '/* The hero surface, per theme [TH116, AR38]: what a component reads inside',
        "   [data-kp-surface='hero'] is remapped to the theme's hero sources, with the",
        '   states derived for the hero ground. Generated; the register layers above. */',
        '@layer kp.base {',
        ...sources.map(heroBlock),
        '}',
    ].join('\n');
    return `${header}\n${identity(version)}\n\n${blocks.join('\n\n')}\n\n${heroes}\n${rules}\n${density}\n${print}`;
}

/**
 * The client-side theme record, generated rather than typed [AR11].
 *
 * The hook used to carry each theme's background, foreground and primary
 * colour as text — 21 values duplicating css/themes.css, measured on
 * 2026-09-04 as not yet diverging. The swatch now reads the live custom
 * properties instead, so those colours are gone; what is left is the label
 * and whether the theme is dark, and even that is read from the token
 * source rather than kept in step by hand. `dark` comes from the theme's
 * own `color-scheme`, which is the same declaration DI6 gates, so the
 * picker cannot believe in a fourth dark theme the stylesheet does not
 * have. (kyu did, which is why one of the picker's five tests is about it.)
 */
function registry() {
    const dir = new URL('../themes/', import.meta.url);
    const version = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8')).version;
    const themes = ORDER.map(
        /** @param {string} name */ (name) => {
            const t = JSON.parse(readFileSync(new URL(`${name}/tokens.json`, dir), 'utf8'));
            const scheme = t.entries.find(/** @param {any} e */ (e) => e.token === 'color-scheme')?.value;
            if (t.label === undefined) throw new Error(`themes/${name}/tokens.json declares no label`);
            if (scheme === undefined) throw new Error(`themes/${name}/tokens.json declares no color-scheme`);
            return `    { name: '${name}', label: '${t.label}', dark: ${scheme === 'dark'} },`;
        },
    );
    return [
        '// GENERATED by gates/generate-themes.mjs from themes/*/tokens.json.',
        '// Do not edit: `npm run gates` fails when this file and the token',
        '// source disagree. Add a theme by adding its token file and its name',
        '// to themes/order.json.',
        '',
        '/**',
        ' * Every theme name there is [KT4].',
        ' *',
        ' * A union rather than `string`, so a typo is a compile error for a',
        ' * consumer instead of a silent fallback to `formal` at runtime. It is',
        ' * generated for the same reason the list below is: two consumers were',
        ' * measured on 2026-09-04 carrying a hand-kept copy of which themes',
        ' * exist, and both had it wrong.',
        ' *',
        ` * @typedef {${ORDER.map(/** @param {string} n */ (n) => `'${n}'`).join(' | ')}} ThemeName`,
        ' */',
        '',
        '/** @typedef {{name: ThemeName, label: string, dark: boolean}} ThemeRecord */',
        '',
        '/** @type {readonly ThemeRecord[]} */',
        'export const THEMES = Object.freeze([',
        ...themes,
        ']);',
        '',
        '/**',
        ' * The theme a visitor gets before choosing, and the answer to any',
        ' * unknown value.',
        ' *',
        ' * @type {ThemeName}',
        ' */',
        "export const DEFAULT_THEME = 'formal';",
        '',
        '/** The localStorage key. Contract value: consumers read it too [TH26]. */',
        "export const STORAGE_KEY = 'theme';",
        '',
        '/**',
        ' * The version this registry was generated from [TH97, AR25].',
        ' *',
        ' * The other half of the pair css/themes.css declares as',
        ' * `--kp-themes-version`. Comparing the two inside this repository can',
        ' * never fail — they come from the same commit — so the comparison that',
        ' * matters happens in the browser, on a page where the two files may',
        ' * have arrived separately. js/diagnostics.js does it.',
        ' */',
        `export const VERSION = '${version}';`,
        '',
    ].join('\n');
}

const artefacts = [
    { url: OUT, name: 'css/themes.css', content: build() },
    { url: REGISTRY, name: 'js/theme-registry.js', content: registry() },
];

if (process.argv.includes('--check')) {
    let stale = 0;
    for (const a of artefacts) {
        let current = '';
        try {
            current = readFileSync(a.url, 'utf8');
        } catch {
            current = '';
        }
        if (current !== a.content) {
            stale++;
            console.error(`${a.name} does not match its source.`);
        }
    }
    if (stale > 0) console.error('Run `npm run generate` and commit the result.');
    else console.log(`${artefacts.length} generated files match their source (${ORDER.length} themes).`);
    // scope-96: the tear check that ran here is gone with cyberpunk's
    // razor tear, the only theme it generated.
    process.exit(stale > 0 ? 1 : 0);
}

for (const a of artefacts) writeFileSync(a.url, a.content);
console.log(`wrote ${artefacts.map((a) => a.name).join(' and ')} from ${ORDER.length} theme sources.`);

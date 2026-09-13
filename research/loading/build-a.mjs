// Strategy (a): one stylesheet per theme.
//
// research/loading/out/a/kp-<theme>.css = that theme's token block and
// its hero remap out of css/themes.css, the shared rules that follow the
// token blocks (texture layer, base rules, density, print), the
// @font-face blocks the theme names, css/components.css, the theme's own
// register, css/layout.css and css/utilities.css — in the bundle's own
// order, so nothing about which rule wins changes. A page links that one
// file and nothing else.
//
// css/themes.css is parsed as text rather than regenerated from
// themes/<name>/tokens.json: the generator is not importable without
// writing its outputs, and a text split proves the point just as well —
// the numbers here are what a generator would produce, because the
// pieces are the generator's own output cut at its own seams.
//
// Usage: node research/loading/build-a.mjs

import { fileURLToPath } from 'node:url';
import { OUT, minCss, read, sizes, sum, write } from './measure.mjs';

const ORDER = /** @type {string[]} */ (JSON.parse(read('themes/order.json')));
const THEMES_CSS = read('css/themes.css');
const FONTS_CSS = read('css/fonts.css');
/** out/a/ sits four directories under the repository root. */
const UP = '../../../../';

/**
 * The block that starts at the first match of `re` after `from`, brace-matched.
 *
 * @param {string} text @param {RegExp} re @param {number} [from]
 */
function block(text, re, from = 0) {
    const m = re.exec(text.slice(from));
    if (!m) throw new Error(`no block matching ${re}`);
    const start = from + m.index;
    let depth = 0;
    for (let i = text.indexOf('{', start); i < text.length; i++) {
        if (text[i] === '{') depth++;
        else if (text[i] === '}' && --depth === 0) return { start, end: i + 1, text: text.slice(start, i + 1) };
    }
    throw new Error(`unbalanced block at ${start}`);
}

const tokenRe = (/** @type {string} */ t) =>
    t === 'formal' ? /^:root,\n\[data-theme='formal'\] \{/m : new RegExp(`^\\[data-theme='${t}'\\] \\{`, 'm');
const heroRe = (/** @type {string} */ t) =>
    t === 'formal'
        ? /^    :root \[data-kp-surface='hero'\],\n    \[data-theme='formal'\] \[data-kp-surface='hero'\] \{/m
        : new RegExp(`^    \\[data-theme='${t}'\\] \\[data-kp-surface='hero'\\] \\{`, 'm');

/** css/themes.css cut at its generator's seams: header, one token block per theme, one hero remap per theme, the shared tail. */
export function splitThemes(css = THEMES_CSS) {
    const first = block(css, tokenRe('formal'));
    const header = css.slice(0, first.start);
    /** @type {Record<string, string>} */
    const tokens = {};
    let lastEnd = first.end;
    for (const t of ORDER) {
        const b = block(css, tokenRe(t));
        tokens[t] = b.text;
        lastEnd = Math.max(lastEnd, b.end);
    }
    const heroLayer = block(css, /^@layer kp\.base \{/m, lastEnd);
    /** @type {Record<string, string>} */
    const hero = {};
    for (const t of ORDER) hero[t] = block(heroLayer.text, heroRe(t)).text;
    const tail = css.slice(heroLayer.end);
    return { header, tokens, hero, tail };
}

/**
 * The @font-face blocks a theme names, read from the "named by" note the
 * fonts generator writes above each family. A family named by "the
 * registers" is kept for every theme.
 *
 * @param {string} theme
 */
export function fontsFor(theme, css = FONTS_CSS) {
    const headerEnd = css.indexOf('*/') + 2;
    const families = css
        .slice(headerEnd)
        .split(/\n(?=\/\* )/)
        .filter((s) => s.trim());
    const kept = families.filter((segment) => {
        const m = /named by ([^*]+?) \*\//.exec(segment);
        if (!m) return true;
        const names = m[1].split(/,\s*/).map((s) => s.trim());
        return names.includes(theme) || names.some((n) => n.startsWith('the '));
    });
    return `${css.slice(0, headerEnd)}\n${kept.join('\n')}`.replaceAll("url('../fonts/", `url('${UP}fonts/`);
}

/**
 * The one stylesheet for a theme, as named parts in load order.
 *
 * @param {string} theme
 * @returns {[string, string][]}
 */
export function partsFor(theme) {
    const { header, tokens, hero, tail } = splitThemes();
    const ownTokens = tokens[theme].replace(/^[^{]*\{/, `:root,\n[data-theme='${theme}'] {`);
    const ownHero = hero[theme].replace(/^[^{]*\{/, `    :root [data-kp-surface='hero'],\n    [data-theme='${theme}'] [data-kp-surface='hero'] {`);
    const themes = `${header}${ownTokens}\n\n/* The hero surface for this theme [TH116, AR38]. */\n@layer kp.base {\n${ownHero}\n}\n${tail}`;
    return [
        ['fonts (the faces this theme names)', fontsFor(theme)],
        ['themes (one token block, one hero remap, the shared rules)', themes],
        ['components', read('css/components.css')],
        [`${theme}-register`, read(`css/${theme}-register.css`)],
        ['layout', read('css/layout.css')],
        ['utilities', read('css/utilities.css')],
    ];
}

export default async function buildA() {
    /** @type {Record<string, import('./measure.mjs').Sizes>} */
    const perTheme = {};
    /** @type {Record<string, Record<string, import('./measure.mjs').Sizes>>} */
    const parts = {};
    for (const theme of ORDER) {
        const list = partsFor(theme);
        const css = `/* research/loading/out/a/kp-${theme}.css — strategy (a): everything the ${theme} theme needs, and nothing another theme needs.\n   Generated by research/loading/build-a.mjs from css/*.css — a prototype, not a shipped file. */\n\n${list.map(([, text]) => text.trimEnd()).join('\n\n')}\n`;
        write(new URL(`a/kp-${theme}.css`, OUT), css);
        write(new URL(`a/kp-${theme}.min.css`, OUT), await minCss(css));
        perTheme[theme] = await sizes(css, 'css');
        if (theme === 'cyberpunk' || theme === 'formal') {
            parts[theme] = {};
            for (const [name, text] of list) parts[theme][name] = await sizes(text, 'css');
        }
    }

    // A sample page: examples/login.html with its twenty-seven links
    // replaced by one. The stored-theme line of the head snippet is taken
    // out, because on a page whose stylesheet IS one theme a stored
    // choice of another would be the fault this strategy carries (see
    // the README), not a demonstration.
    const login = read('examples/login.html')
        .replace(/(        <link rel="stylesheet" href="\.\.\/css\/[^"]+" \/>\n)+/, '        <link rel="stylesheet" href="kp-cyberpunk.css" />\n')
        .replace('<html lang="en">', '<html lang="en" data-theme="cyberpunk">')
        .replace('../js/auto.js', `${UP}js/auto.js`)
        .replace(/\s*var t = localStorage\.getItem\("theme"\);\n\s*if \(t\) document\.documentElement\.setAttribute\("data-theme", t\);/, '');
    if (!login.includes('kp-cyberpunk.css') || login.includes('localStorage')) throw new Error('the sample page did not take the replacements');
    write(new URL('a/login-cyberpunk.html', OUT), login);

    const all = Object.values(perTheme);
    const result = {
        strategy: 'a',
        perTheme,
        parts,
        heaviest: ORDER.reduce((a, b) => (perTheme[a].min >= perTheme[b].min ? a : b)),
        lightest: ORDER.reduce((a, b) => (perTheme[a].min <= perTheme[b].min ? a : b)),
        /** What generating all twenty-two costs on disk, authored and minified. */
        allOnDisk: sum(all),
        switchCost: 'a whole second stylesheet: the target theme’s own file, nothing shared between the two on the wire',
    };
    write(new URL('a/sizes.json', OUT), JSON.stringify(result, null, 4) + '\n');
    return result;
}

if (import.meta.url === `file://${process.argv[1]}`) {
    const r = await buildA();
    console.log(`(a) ${ORDER.length} per-theme stylesheets written to ${fileURLToPath(new URL('a/', OUT))}`);
    for (const [t, s] of Object.entries(r.perTheme)) console.log(`  kp-${t}.css ${s.raw} raw ${s.rawGz} gz | min ${s.min} raw ${s.minGz} gz`);
}

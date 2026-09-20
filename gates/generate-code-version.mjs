// What a block is made of, as numbers [scope-114, scope-116].
//
// Kenny, 2026-09-16: "Een component is de som van html+css+js+browserkeuze,
// daarop moet de hash gebaseerd zijn. Hoe het rendered kan mij geen fucking
// kloten schelen … Als ik iets goedkeur op 125% dan is het voor alle zoom
// levels goedgekeurd."
//
// And 2026-09-17, when the JavaScript split moved one digest over all of js/
// and so every one of the 3062 pairs: "alles, dus ook js code mag alleen
// meetellen als het relevant is voor de component zelf. Enkel dingen die de
// component zelf raken mogen in de hash verwerkt worden."
//
// So the code is digested per thing a block can use, not per folder:
//
//   families    every `kp-*` class family and `data-kp-*` attribute a
//               stylesheet names, each with a digest of the CSS lines whose
//               selector names it — `shared` for the package's stylesheets,
//               one per theme for that theme's register. A block pays for the
//               families its own markup carries.
//   modules     per module the loader attaches by selector (js/auto.js's
//               NEEDS), a digest of that one file and the selector it acts
//               through. A block pays for a module when its own markup
//               matches that selector, which is exactly when the page loads
//               it [scope-136].
//   components  per component in tests/tags.json, a digest of the modules
//               (js/, components/) the map assigns to it that the loader does
//               NOT attach by selector — helpers, the effects, the React
//               components — and the families those modules write that the
//               markup does not show (the boot screen effects.js draws). A
//               block pays for the components its families belong to.
//   base        the CSS lines that name no family (`:root`, bare elements,
//               keyframes) and the dictionary every component speaks from.
//   themes      per theme, its tokens and the register lines that name no
//               family.
//
// Left out on purpose: `js/auto.js`, the loader. It decides when a module
// arrives, not what a block is; tests/auto-lazy.spec.mjs proves every page
// that loads it ends up with the markup the eager loader of 6.1.0 left.
//
//   node gates/generate-code-version.mjs            write catalogue/code-version.json
//   node gates/generate-code-version.mjs --check    refuse when it is stale
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import process from 'node:process';
import * as prettier from 'prettier';

// The loader's own table: every module it attaches, and the selector it acts
// through [scope-136]. Read here rather than restated, so the hash and the page
// cannot drift apart; `js/auto.js` imports cleanly outside a browser.
const { NEEDS } = await import('../js/auto.js');
/** `js/<name>.js` for each need, with the selector that brings it in. */
const ATTACHED_BY_SELECTOR = new Map(NEEDS.map((need) => [`js/${need.name}.js`, need.when]));
import { loadMap, ruleFor, selectorChains, vocabularyOf, withoutComments } from './tags.mjs';

const root = new URL('../', import.meta.url);
export const CODE_VERSION = 'catalogue/code-version.json';

/**
 * The loader and what it attaches through: when a module arrives, not what a
 * block is [scope-116, scope-117]. tests/auto-lazy.spec.mjs holds both.
 */
export const NOT_A_BLOCK_INPUT = new Set(['js/auto.js', 'js/as-of.js']);

/**
 * Blocks whose component is drawn somewhere their markup does not show: a
 * theme intro plays in a frame, from effects.js, and its block carries only
 * the frame and the controls. The marker attribute names the component.
 */
export const MARKERS = { 'data-cat-intro': ['page-effects'] };

/**
 * The version is not a change to a block [scope-114]. `css/themes.css` and
 * `js/theme-registry.js` carry `--kp-themes-version` and `VERSION`; a release
 * that only raises the number must not send a pair back to Kenny.
 * @param {string | Buffer} text
 */
export const withoutTheVersion = (/** @type {string | Buffer} */ text) =>
    String(text).replace(/(?<![\w.])v?\d+\.\d+\.\d+(?:-[\w.]+)?(?![\w.])/g, '<version>');

/** @param {string[]} parts in a fixed order */
const digest = (parts) => {
    const hash = createHash('sha256');
    for (const part of parts) hash.update(`${part}\n`);
    return hash.digest('hex').slice(0, 16);
};

/**
 * The families a stretch of CSS selectors or markup names: `.kp-button--primary`
 * and `kp-button__label` are `kp-button`, `[data-kp-reveal='headline']` is
 * `data-kp-reveal`. The same reading catalogue/block-hash.js gives a block.
 * @param {string} text
 * @returns {string[]}
 */
export const familiesIn = (text) => [...new Set([...text.matchAll(/(?<![\w-])((?:data-)?kp-[a-z0-9]+(?:-[a-z0-9]+)*)/g)].map((m) => m[1]))].sort();

/**
 * One stylesheet's lines, bucketed by the families their selectors name.
 * Comments are blanked first, so a comment moves nothing; a line is its text,
 * not its number, so a line added above moves nothing either.
 * @param {string} css
 * @returns {{ families: Map<string, string[]>, unnamed: string[], themed: Map<string, string[]> }}
 */
export function bucketsOf(css) {
    const text = withoutTheVersion(css);
    const chains = selectorChains(text);
    const lines = withoutComments(text).split('\n');
    /** @type {Map<string, string[]>} */
    const families = new Map();
    /** @type {string[]} */
    const unnamed = [];
    /** @type {Map<string, string[]>} */
    const themed = new Map();
    lines.forEach((raw, i) => {
        const line = raw.trim();
        if (!line) return;
        const chain = chains(i + 1);
        // A keyframe's name is not a family a block carries: the rule that
        // runs it names its family, and the frames belong to everyone.
        const keyframes = chain.some((part) => part.startsWith('@keyframes'));
        // Innermost first: `.kp-card { .kp-button {…} }` belongs to what the
        // inner rule names, and a declaration line belongs to its rule.
        /** @type {string[]} */
        let named = [];
        if (!keyframes) for (let n = chain.length - 1; n >= 0 && named.length === 0; n--) named = familiesIn(chain[n] ?? '');
        if (named.length === 0) {
            // css/themes.css holds each theme's tokens under its own
            // `[data-theme='x']`: those lines are that theme's, not everyone's.
            const theme = keyframes ? undefined : /data-theme\s*=\s*['"]?([a-z-]+)/.exec(chain.join(' '))?.[1];
            if (theme) themed.set(theme, [...(themed.get(theme) ?? []), line]);
            else unnamed.push(line);
            return;
        }
        for (const family of named) families.set(family, [...(families.get(family) ?? []), line]);
    });
    return { families, unnamed, themed };
}

/**
 * The components a family belongs to by tests/tags.json's selector map — the
 * longest dash-separated prefix the map names — as catalogue/block-hash.js's
 * `componentsOf` reads it.
 * @param {string} name
 * @param {Record<string, string[]>} selectors
 * @returns {string[]}
 */
export function componentsOf(name, selectors) {
    const segments = name.split('-');
    for (let n = segments.length; n >= 2; n--) {
        const found = selectors[segments.slice(0, n).join('-')];
        if (found) return found.filter((tag) => tag.startsWith('@component:')).map((tag) => tag.slice('@component:'.length));
    }
    return [];
}

const files = (/** @type {string} */ dir, /** @type {(name: string) => boolean} */ keep) =>
    existsSync(new URL(dir, root))
        ? readdirSync(new URL(dir, root))
              .filter(keep)
              .sort()
              .map((name) => `${dir}${name}`)
        : [];

const read = (/** @type {string} */ path) => readFileSync(new URL(path, root), 'utf8');

/**
 * The page-wide selectors: a rule whose innermost compound is one of these
 * shapes the whole document, so every block pays for it [scope-137].
 */
const PAGE_WIDE = new Set([':root', ':host', 'html', 'body', '*', '::selection', '::backdrop']);

/** State and pseudo-elements, which say WHEN a rule paints, not WHAT it paints. */
const STATE =
    /::?(?:hover|focus|focus-visible|focus-within|active|visited|target|disabled|checked|enabled|indeterminate|placeholder-shown|read-only|open|first-line|first-letter|before|after|marker|selection|backdrop|placeholder|file-selector-button|-moz-[a-z-]+|-webkit-[a-z-]+)\b(?:\([^)]*\))?/g;

/**
 * The compound a selector ends on, stripped of state: `.kp-card .kp-button:hover`
 * is `.kp-button`, `[data-theme='dark'] .kp-log dt` is `dt` [scope-137].
 *
 * The rightmost compound rather than the whole selector, because a block is
 * read as a fragment: a rule written `.kp-card .kp-button` applies to a button
 * in a block whose card sits on the page around it, and a hash that missed
 * that would let a real change through. It over-reaches instead, which costs
 * a judgement that was not needed and never skips one that was.
 * @param {string} selector @returns {string}
 */
export function rightmostCompound(selector) {
    const parts = selector
        .replace(STATE, '')
        .split(/[\s>+~]+/)
        .map((part) => part.trim())
        .filter(Boolean);
    // `.kp-menu > *` is the menu's rule, not everyone's, and neither is
    // `.kp-log__line > :first-child`: a universal or a bare pseudo-class on
    // the right says "the children of", so the anchor is the compound before
    // it. Without that, a bucket called `:first-child` lands in nearly every
    // block and the hash is wide again for no reason.
    for (let n = parts.length - 1; n >= 0; n--) if (parts[n] !== '*' && !parts[n].startsWith(':')) return parts[n];
    return parts[parts.length - 1] ?? '';
}

/** Split a selector list on its top-level commas: `:where(ul, ol), .x` is two. @param {string} list */
export function selectorList(list) {
    /** @type {string[]} */
    const out = [];
    let depth = 0;
    let current = '';
    for (const ch of list) {
        if (ch === '(' || ch === '[') depth += 1;
        else if (ch === ')' || ch === ']') depth -= 1;
        if (ch === ',' && depth === 0) {
            out.push(current);
            current = '';
        } else current += ch;
    }
    if (current.trim()) out.push(current);
    return out.map((one) => one.trim()).filter(Boolean);
}

/**
 * Per line of a stylesheet, the preludes open around it [scope-137]. A line
 * that is still building something — a selector list spread over three lines,
 * a `box-shadow` whose value runs over four — is settled when the next `{`
 * or `;` says which it was: the first makes it part of the rule it opens, the
 * second leaves it in the rule it already sits in.
 * @param {string} css
 * @returns {string[][]} the preludes for each line, outermost first
 */
function lineContexts(css) {
    const text = withoutComments(css).replace(/"(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'/g, (q) => q.replace(/[{};]/g, ' '));
    /** @type {string[][]} */
    const context = [];
    /** @type {number[]} */
    let waiting = [];
    /** @type {string[]} */
    const stack = [];
    let prelude = '';
    let line = 0;
    const settle = (/** @type {string[]} */ where) => {
        for (const idx of waiting) context[idx] = [...where];
        waiting = [];
    };
    for (const ch of text) {
        if (ch === '\n') {
            if (prelude.trim()) waiting.push(line);
            else context[line] = [...stack];
            prelude += ' ';
            line += 1;
        } else if (ch === '{') {
            stack.push(prelude.trim());
            prelude = '';
            settle(stack);
        } else if (ch === '}') {
            settle(stack);
            stack.pop();
            prelude = '';
        } else if (ch === ';') {
            settle(stack);
            prelude = '';
        } else prelude += ch;
    }
    settle(stack);
    for (let i = 0; i <= line; i++) context[i] ??= [];
    return context;
}

/**
 * One stylesheet's lines, bucketed by the rule they belong to [scope-137]:
 * the condition around it, and the compound its selector ends on. Keyframes
 * and font faces come back on their own, because what runs them decides who
 * pays for them, and a brace on its own line is nobody's.
 * @param {string} css
 * @returns {{ rules: Map<string, string[]>, keyframes: Map<string, string[]>, faces: { family: string, lines: string[] }[], page: string[], themed: Map<string, string[]> }}
 */
export function ruleBucketsOf(css) {
    const text = withoutTheVersion(css);
    const context = lineContexts(text);
    const lines = withoutComments(text).split('\n');
    /** @type {Map<string, string[]>} */
    const rules = new Map();
    /** @type {Map<string, string[]>} */
    const keyframes = new Map();
    /** @type {Map<number, { family: string, lines: string[] }>} */
    const openFaces = new Map();
    /** @type {string[]} */
    const page = [];
    /** @type {Map<string, string[]>} */
    const themed = new Map();
    let face = 0;
    lines.forEach((raw, i) => {
        const line = raw.trim();
        if (!line || line === '}' || line === '{') return;
        const preludes = context[i] ?? [];
        const atRules = preludes.filter((p) => p.startsWith('@'));
        const frames = atRules.find((p) => p.startsWith('@keyframes'));
        if (frames) {
            if (line.startsWith('@keyframes')) return;
            const name = frames.split(/\s+/)[1] ?? '?';
            keyframes.set(name, [...(keyframes.get(name) ?? []), line]);
            return;
        }
        if (atRules.some((p) => p.startsWith('@font-face'))) {
            if (line.startsWith('@font-face')) {
                face += 1;
                return;
            }
            const open = openFaces.get(face) ?? { family: '', lines: [] };
            open.lines.push(line);
            const named = /font-family:\s*['"]?([^;'"]+)/.exec(line)?.[1]?.trim();
            if (named) open.family = named;
            openFaces.set(face, open);
            return;
        }
        // An at-rule's own line carries the condition, which is part of every
        // key under it; storing it as well would move those keys twice.
        if (line.startsWith('@')) return;
        const condition = atRules.filter((p) => !p.startsWith('@layer')).join(' § ');
        const theme = /data-theme\s*=\s*['"]?([a-z-]+)/.exec(preludes.join(' '))?.[1];
        const selectors = preludes.filter((p) => !p.startsWith('@'));
        /** @type {string[]} */
        let rights = [];
        for (let n = selectors.length - 1; n >= 0 && rights.length === 0; n--) {
            rights = [
                ...new Set(
                    selectorList(selectors[n])
                        .map((one) => rightmostCompound(one).replace(/^&/, ''))
                        .filter((one) => one && one !== '&'),
                ),
            ];
        }
        // A rule on the theme's own root carries that theme's tokens, which
        // every block of it reads through var(); it belongs to the theme.
        const root = rights.some((one) => PAGE_WIDE.has(one) || /^\[data-theme/.test(one));
        if (rights.length === 0 || root || condition.includes('print')) {
            if (theme) themed.set(theme, [...(themed.get(theme) ?? []), line]);
            else page.push(line);
            return;
        }
        for (const right of rights) {
            const key = `${theme ?? ''}||${condition}||${right}`;
            rules.set(key, [...(rules.get(key) ?? []), line]);
        }
    });
    return { rules, keyframes, faces: [...openFaces.values()], page, themed };
}

/** The digests catalogue/block-hash.js reads, version 6 [scope-116]. */
export function codeVersion() {
    const map = loadMap();
    const vocabulary = vocabularyOf(map);
    const themes = /** @type {string[]} */ (JSON.parse(read('themes/order.json')));

    /** @type {Map<string, string[]>} */
    const ruleLines = new Map();
    /** @type {Map<string, string[]>} */
    const keyframeLines = new Map();
    /** @type {{ family: string, lines: string[] }[]} */
    const allFaces = [];
    /** @type {string[]} */
    const base = [];
    /** @type {Record<string, string[]>} */
    const themeBase = Object.fromEntries(themes.map((t) => [t, [read(`themes/${t}/tokens.json`)]]));

    for (const file of files('css/', (name) => name.endsWith('.css'))) {
        if (ruleFor(file, map, vocabulary)?.rule.none) continue;
        const theme = /^css\/(.+)-register\.css$/.exec(file)?.[1];
        const buckets = ruleBucketsOf(read(file));
        for (const [key, lines] of buckets.rules) {
            const [named, condition, right] = key.split('||');
            // A register's rules are its theme's even where the selector
            // carries no `[data-theme]`: the file is only served with it.
            const full = `${named || theme || ''}||${condition}||${right}`;
            ruleLines.set(full, [...(ruleLines.get(full) ?? []), `${file}\0`, ...lines]);
        }
        for (const [name, lines] of buckets.keyframes) keyframeLines.set(name, [...(keyframeLines.get(name) ?? []), `${file}\0`, ...lines]);
        allFaces.push(...buckets.faces);
        if (theme && themeBase[theme]) themeBase[theme].push(`${file}\0`, ...buckets.page);
        else if (!theme) base.push(`${file}\0`, ...buckets.page);
        for (const [named, lines] of buckets.themed) {
            if (themeBase[named]) themeBase[named].push(`${file}\0`, ...lines);
            else base.push(`${file}\0`, ...lines);
        }
    }

    // A keyframe belongs to the rules that run it [scope-137]: the frames
    // move with whoever animates them, and one nobody runs is everyone's.
    const runs = (/** @type {string} */ text, /** @type {string} */ name) => new RegExp(`(^|[\\s,:])${name}([\\s,;)]|$)`).test(text);
    const unrun = new Set(keyframeLines.keys());
    for (const [key, lines] of ruleLines) {
        const text = lines.join('\n');
        for (const [name, frames] of keyframeLines) {
            if (!runs(text, name)) continue;
            unrun.delete(name);
            ruleLines.set(key, [...lines, `@keyframes ${name}\0`, ...frames]);
        }
    }
    for (const name of unrun) base.push(`@keyframes ${name}\0`, ...(keyframeLines.get(name) ?? []));

    // A face belongs to the themes that ask for it by name [scope-137]:
    // measured 2026-09-20, 47 of 62 are named by exactly one theme.
    for (const face of allFaces) {
        const wanted = themes.filter((t) => {
            const tokens = JSON.parse(read(`themes/${t}/tokens.json`));
            return tokens.entries.some(
                (/** @type {{ token?: string, value?: string }} */ entry) =>
                    entry.token?.startsWith('theme-font-') &&
                    new RegExp(`(^|[,'"\\s])${face.family.replace(/[.*+?^$()|[\]\\]/g, '\\$&')}([,'"\\s]|$)`).test(entry.value ?? ''),
            );
        });
        if (wanted.length === 0) base.push(`@font-face ${face.family}\0`, ...face.lines);
        else for (const t of wanted) themeBase[t].push(`@font-face ${face.family}\0`, ...face.lines);
    }

    /** @type {Record<string, { modules: string[], families: Set<string> }>} */
    const components = {};
    /** @type {Record<string, { digest: string, when: string }>} */
    const bySelector = {};
    for (const file of [
        ...files('js/', (n) => n.endsWith('.js')),
        ...files('js/effects/', (n) => n.endsWith('.js')),
        ...files('components/', (n) => n.endsWith('.jsx')),
    ]) {
        if (NOT_A_BLOCK_INPUT.has(file)) continue;
        const hit = ruleFor(file, map, vocabulary);
        if (!hit || hit.rule.none) continue;
        const source = withoutTheVersion(read(file));
        if (hit.rule.all) {
            base.push(`${file}\0`, source);
            continue;
        }
        const named = (hit.rule.tags ?? [])
            .filter((/** @type {string} */ t) => t.startsWith('@component:'))
            .map((/** @type {string} */ t) => t.slice('@component:'.length));
        // A module that no component claims is everyone's.
        if (named.length === 0) base.push(`${file}\0`, source);
        // A module the loader attaches by selector is its own input: the
        // block that matches the selector is the block that loads it, and no
        // other block of the component pays for it [scope-136].
        const when = ATTACHED_BY_SELECTOR.get(file);
        if (when !== undefined) bySelector[file] = { digest: digest([`${file}\0`, source]), when };
        for (const name of named) {
            components[name] ??= { modules: [], families: new Set() };
            if (when === undefined) components[name].modules.push(`${file}\0`, source);
            for (const f of familiesIn(source)) components[name].families.add(f);
        }
    }

    return {
        $comment:
            'What a block is made of [scope-114, scope-116]: per CSS family and per component, the code that shapes it, as digests. ' +
            'catalogue/block-hash.js reads the families a block names, the components those belong to and the modules its markup asks the loader for, so a change asks only about the blocks it touches. ' +
            'Written by gates/generate-code-version.mjs.',
        base: digest(base),
        modules: Object.fromEntries(
            Object.keys(bySelector)
                .sort()
                .map((file) => [file, bySelector[file]]),
        ),
        themes: Object.fromEntries(themes.map((t) => [t, digest(themeBase[t])])),
        rules: Object.fromEntries([...ruleLines.keys()].sort().map((key) => [key, digest(/** @type {string[]} */ (ruleLines.get(key)))])),
        components: Object.fromEntries(
            Object.keys(components)
                .sort()
                .map((name) => [
                    name,
                    {
                        modules: components[name].modules.length ? digest(components[name].modules) : '-',
                        // Only what the module draws of its own: a family another
                        // component owns (the confirm dialog's `kp-button`) is that
                        // component's, and a block carrying it pays for it there.
                        families: [...components[name].families]
                            .filter((f) => {
                                const owners = componentsOf(f, map.selectors);
                                return owners.length === 0 || owners.includes(name);
                            })
                            .sort(),
                    },
                ]),
        ),
        selectors: map.selectors,
        markers: MARKERS,
    };
}

async function main() {
    const file = new URL(CODE_VERSION, root);
    // Written as the formatter would write it, so `prettier --check .` and
    // `--check` here agree on one byte sequence.
    const options = (await prettier.resolveConfig(fileURLToPath(file))) ?? {};
    const wanted = await prettier.format(JSON.stringify(codeVersion()), { ...options, parser: 'json' });
    if (process.argv.includes('--check')) {
        const there = existsSync(file) ? readFileSync(file, 'utf8') : '';
        if (there !== wanted) {
            console.error(`${CODE_VERSION} is not what the code says [scope-116]; run node gates/generate-code-version.mjs`);
            process.exit(1);
        }
        const { rules, modules, components } = codeVersion();
        console.log(
            `code version: ${Object.keys(rules).length} rule buckets, ${Object.keys(modules).length} modules by selector, ${Object.keys(components).length} components, current.`,
        );
        return;
    }
    writeFileSync(fileURLToPath(file), wanted);
    console.log(`${CODE_VERSION}: written.`);
}

if (import.meta.url === `file://${process.argv[1]}`) await main();

// Tags decide what runs [scope-33, Kenny 2026-09-13].
//
// Every browser test carries `@component:<name>`, `@theme:<name>` or
// `@sweep` through Playwright's own tag mechanism, and `tests/tags.json`
// says which tags a changed file needs. This module is the one place that
// reads both: the gate (gates/check-tags.mjs) asks it whether every test is
// tagged, and `npm run test:tags` asks it what a change selects.
//
// It replaces gates/affected.mjs, whose answer for any stylesheet or module
// was the whole suite. The price of the narrower answer is written down, not
// hidden: a building-level run trusts the map, the commit level adds every
// `@sweep` test, and a release still runs everything in both engines. The
// map was measured once against the old selection before it was trusted
// (standing rule 7i); the numbers are under `measured` in tests/tags.json.
//
// Three decisions make the map honest rather than clever:
//
//   1. A stylesheet change is read rule by rule. The changed lines of
//      css/components.css resolve to the selectors of the rules they sit in,
//      and `.kp-datatable__x` names the data table. A changed line in a rule
//      that names no component — a custom property on `:root`, a keyframe, a
//      rule for bare elements — falls back to `@sweep` and every component
//      the file defines, because nothing narrower can be claimed.
//   2. A register change selects its theme (`@theme:<theme>`: its own spec
//      and its slice of every per-theme sweep) plus the sweeps of the
//      components whose rules it restyles (`@sweep` AND `@component:x`).
//      A keyframe declared in five registers still governs whichever loads
//      last; that coupling is what the commit level's `@sweep` is for.
//   3. A changed spec file runs whole, and a changed helper or fixture runs
//      the specs that name it — selected by file, not by tag, because the
//      file is the exact unit there.
//
// Only comment moved in a stylesheet: nothing runs, as before — the minified
// twin a page loads carries no comments.

import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join, relative } from 'node:path';
import process from 'node:process';
import * as acorn from 'prettier/plugins/acorn';

export const ROOT = fileURLToPath(new URL('../', import.meta.url));
const TESTS = join(ROOT, 'tests');

/** @returns {any} the map */
export const loadMap = () => JSON.parse(readFileSync(join(TESTS, 'tags.json'), 'utf8'));

/** @returns {string[]} */
export const themeNames = () => JSON.parse(readFileSync(join(ROOT, 'themes/order.json'), 'utf8'));

/** @param {string} css @returns {string} the stylesheet with its comments blanked, line breaks kept */
export const withoutComments = (css) => css.replace(/\/\*[\s\S]*?\*\//g, (c) => c.replace(/[^\n]/g, ' '));

/** @param {string[]} args @returns {string} */
const git = (args) =>
    execFileSync('git', ['-C', ROOT, ...args], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, stdio: ['ignore', 'pipe', 'pipe'] });

// ─── Reading the tests ─────────────────────────────────────────────────────

const DECLARING = new Set([
    '',
    'only',
    'skip',
    'fixme',
    'fail',
    'slow',
    'describe',
    'describe.only',
    'describe.skip',
    'describe.fixme',
    'describe.serial',
    'describe.parallel',
    'describe.serial.only',
    'describe.parallel.only',
]);

/** @param {any} callee @returns {string | null} `''` for test(), `describe` for test.describe(), … */
function testApi(callee) {
    const parts = [];
    let n = callee;
    while (n.type === 'MemberExpression' && !n.computed) {
        parts.unshift(n.property.name);
        n = n.object;
    }
    if (n.type !== 'Identifier' || n.name !== 'test') return null;
    const path = parts.join('.');
    return DECLARING.has(path) ? path : null;
}

/**
 * Every test and describe a spec file declares, with the tags written on it.
 * A declaration is a `test…(title, [details,] fn)` call whose last argument is
 * a function — `test.skip(condition, reason)` is not one.
 *
 * @param {string} source
 * @returns {Promise<{ kind: 'test' | 'describe', line: number, title: string, tags: string[], parent: number, start: number, end: number, fnStart: number, details: any, text: string }[]>}
 *   `tags` holds each tag as written: a literal, or a template's source with `${…}` left in.
 */
export async function declarations(source) {
    const ast = await acorn.parsers.acorn.parse(source, /** @type {any} */ ({}));
    /** @type {any[]} */
    const found = [];
    /** @param {any} node @param {number} parent */
    const walk = (node, parent) => {
        if (!node || typeof node.type !== 'string') return;
        if (node.type === 'CallExpression') {
            const api = testApi(node.callee);
            const args = node.arguments;
            const last = args[args.length - 1];
            if (api !== null && args.length >= 2 && last && /Function/.test(last.type) && !/Function/.test(args[0].type)) {
                const details = args.length >= 3 && args[1].type === 'ObjectExpression' ? args[1] : null;
                /** @type {string[]} */
                const tags = [];
                const tagProp = details?.properties.find((/** @type {any} */ p) => p.key && (p.key.name === 'tag' || p.key.value === 'tag'));
                if (tagProp) {
                    const v = tagProp.value;
                    const items = v.type === 'ArrayExpression' ? v.elements : [v];
                    for (const item of items) {
                        if (item.type === 'Literal') tags.push(String(item.value));
                        else if (item.type === 'TemplateLiteral') tags.push(source.slice(item.start + 1, item.end - 1));
                        else tags.push(`<${source.slice(item.start, item.end)}>`);
                    }
                }
                const index = found.length;
                found.push({
                    kind: api.startsWith('describe') ? 'describe' : 'test',
                    line: source.slice(0, node.start).split('\n').length,
                    title: source.slice(args[0].start, args[0].end),
                    tags,
                    parent,
                    start: node.start,
                    end: node.end,
                    fnStart: last.start,
                    details,
                    text: source.slice(node.start, node.end),
                });
                for (const a of args) walk(a, index);
                return;
            }
        }
        for (const key of Object.keys(node)) {
            if (key === 'loc' || key === 'range') continue;
            const v = node[key];
            if (Array.isArray(v)) for (const x of v) walk(x, parent);
            else if (v && typeof v.type === 'string') walk(v, parent);
        }
    };
    walk(ast, -1);
    return found;
}

/**
 * What is wrong with one tag as written, or null.
 *
 * @param {string} tag @param {{ components: Set<string>, themes: Set<string> }} vocabulary
 */
export function tagProblem(tag, { components, themes }) {
    if (tag === '@sweep') return null;
    const m = tag.match(/^@(component|theme):(.+)$/);
    if (!m) return `"${tag}" is not @sweep, @component:<name> or @theme:<name>`;
    if (m[2].includes('${')) return /^\$\{[^}]+\}$/.test(m[2]) ? null : `"${tag}" mixes a name and an expression`;
    if (m[1] === 'component' && !components.has(m[2])) return `"${tag}" names no component in tests/tags.json`;
    if (m[1] === 'theme' && !themes.has(m[2])) return `"${tag}" names no theme in themes/order.json`;
    return null;
}

/** @returns {string[]} spec files, relative to the repository */
export const specFiles = () =>
    readdirSync(TESTS)
        .filter((f) => f.endsWith('.spec.mjs'))
        .sort()
        .map((f) => `tests/${f}`);

// ─── Reading a change ──────────────────────────────────────────────────────

/**
 * The changed line numbers on each side of a diff.
 *
 * @param {string} diff `git diff -U0` output for one file
 * @returns {{ before: number[], after: number[] }}
 */
export function changedLines(diff) {
    const before = [];
    const after = [];
    for (const m of diff.matchAll(/^@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@/gm)) {
        const [a, b, c, d] = [Number(m[1]), m[2] === undefined ? 1 : Number(m[2]), Number(m[3]), m[4] === undefined ? 1 : Number(m[4])];
        for (let i = 0; i < b; i++) before.push(a + i);
        for (let i = 0; i < d; i++) after.push(c + i);
    }
    return { before, after };
}

/**
 * The selector chain around every line of a stylesheet: for line n, the
 * preludes of the blocks that are open on it, outermost first, plus the text
 * of the line itself (a changed selector names what it changed).
 *
 * @param {string} css @returns {(line: number) => string[]}
 */
export function selectorChains(css) {
    const text = withoutComments(css).replace(/"(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'/g, (s) => s.replace(/[{};]/g, ' '));
    /** @type {string[][]} */
    const perLine = [[]];
    /** @type {string[]} */
    const stack = [];
    let prelude = '';
    for (const ch of text) {
        if (ch === '\n') {
            perLine.push([...stack]);
            prelude += ' ';
        } else if (ch === '{') {
            stack.push(prelude.trim());
            prelude = '';
        } else if (ch === '}') {
            stack.pop();
            prelude = '';
        } else if (ch === ';') prelude = '';
        else prelude += ch;
    }
    const lines = text.split('\n');
    return (line) => [...(perLine[line - 1] ?? []), lines[line - 1] ?? ''];
}

/**
 * The tags one selector chain names, innermost rule first; `null` when no
 * rule in the chain names a component or a theme.
 *
 * @param {string[]} chain @param {Record<string, string[]>} selectors @param {Set<string>} themes
 * @returns {{ components: string[], themes: string[] } | null}
 */
export function chainTags(chain, selectors, themes) {
    for (let i = chain.length - 1; i >= 0; i--) {
        const part = chain[i];
        const comps = new Set();
        const named = new Set();
        for (const m of part.matchAll(/data-theme\s*=\s*['"]?([a-z-]+)/g)) if (themes.has(m[1])) named.add(`@theme:${m[1]}`);
        for (const m of part.matchAll(/(?:\.|\[|@keyframes\s+)((?:data-)?kp-[a-z0-9]+(?:-[a-z0-9]+)*)/g)) {
            const root = m[1].replace(/__.*$/, '');
            const segments = root.split('-');
            for (let n = segments.length; n >= 2; n--) {
                const key = segments.slice(0, n).join('-');
                if (selectors[key]) {
                    for (const t of selectors[key]) comps.add(t);
                    break;
                }
            }
        }
        if (comps.size || named.size) return { components: [...comps], themes: [...named] };
        // a line with only a declaration on it names nothing; look outward
    }
    return null;
}

/** @param {string} pattern @returns {{ re: RegExp, names: string[] }} */
function compile(pattern) {
    const names = [];
    let re = '';
    for (let i = 0; i < pattern.length; i++) {
        const ch = pattern[i];
        if (pattern.startsWith('**/', i)) {
            re += '(?:.*/)?';
            i += 2;
        } else if (pattern.startsWith('**', i)) {
            re += '.*';
            i += 1;
        } else if (ch === '*') re += '[^/]*';
        else if (ch === '{') {
            const close = pattern.indexOf('}', i);
            names.push(pattern.slice(i + 1, close));
            re += '([a-z0-9-]+)';
            i = close;
        } else re += ch.replace(/[.+?^$()|[\]\\]/g, '\\$&');
    }
    return { re: new RegExp(`^${re}$`), names };
}

/**
 * The rule a path falls under, with its captures filled in.
 *
 * @param {string} file @param {any} map @param {{ components: Set<string>, themes: Set<string> }} vocabulary
 * @returns {{ rule: any, captures: Record<string, string> } | null}
 */
export function ruleFor(file, map, vocabulary) {
    for (const rule of map.rules) {
        const { re, names } = compile(rule.path);
        const m = file.match(re);
        if (!m) continue;
        /** @type {Record<string, string>} */
        const captures = {};
        let fits = true;
        names.forEach((name, i) => {
            captures[name] = m[i + 1];
            if (name === 'theme' && !vocabulary.themes.has(m[i + 1])) fits = false;
            if (name === 'component' && !vocabulary.components.has(m[i + 1])) fits = false;
        });
        if (fits) return { rule, captures };
    }
    return null;
}

/** @param {any} map */
export const vocabularyOf = (map) => ({ components: new Set(Object.keys(map.components)), themes: new Set(themeNames()) });

/**
 * The specs that name a file: by its path from tests/, by its basename, or
 * through a spec that imports it.
 *
 * @param {string} file @returns {string[]}
 */
export function specsNaming(file) {
    // A React fixture is named through the page that loads its build
    // (tests/fixtures/react-x.jsx → .build/react-x.js → x.html), so the names
    // are followed through the fixture pages and helpers until nothing new turns up.
    const nameOf = (/** @type {string} */ f) => {
        const base = f.split('/').pop() ?? f;
        return [base, base.replace(/\.jsx$/, '.js')];
    };
    const helpers = readdirSync(join(TESTS, 'fixtures'))
        .filter((f) => /\.(html|mjs|jsx)$/.test(f))
        .map((f) => `tests/fixtures/${f}`)
        .concat(
            readdirSync(TESTS)
                .filter((f) => /\.mjs$/.test(f) && !f.endsWith('.spec.mjs'))
                .map((f) => `tests/${f}`),
        )
        .concat(readdirSync(join(TESTS, 'helpers')).map((f) => `tests/helpers/${f}`));
    const names = new Set(nameOf(file));
    const reached = new Set([file]);
    for (let grew = true; grew;) {
        grew = false;
        for (const h of helpers) {
            if (reached.has(h)) continue;
            const src = readFileSync(join(ROOT, h), 'utf8');
            if ([...names].some((n) => src.includes(n))) {
                reached.add(h);
                for (const n of nameOf(h)) names.add(n);
                grew = true;
            }
        }
    }
    return specFiles().filter((spec) => {
        const src = readFileSync(join(ROOT, spec), 'utf8');
        return [...names].some((n) => src.includes(n));
    });
}

/**
 * What a set of changed files selects.
 *
 * @param {{ file: string, before: string | null, after: string | null, diff: string }[]} changes
 *   the content on each side (null where the file does not exist) and the `git diff -U0` between them
 * @returns {{ all: boolean, terms: string[][], specs: string[], reasons: { file: string, why: string }[] }}
 *   `terms` is an OR of AND-lists of tags; `specs` are whole files
 */
export function select(changes) {
    const map = loadMap();
    const vocabulary = vocabularyOf(map);
    /** @type {Map<string, string[]>} */
    const terms = new Map();
    const specs = new Set();
    const reasons = [];
    let all = false;
    /** @param {string[]} t */
    const add = (t) => terms.set([...t].sort().join(' '), [...t].sort());

    for (const change of changes) {
        const { file } = change;
        const hit = ruleFor(file, map, vocabulary);
        if (!hit) {
            all = true;
            reasons.push({ file, why: 'no rule in tests/tags.json — everything runs, and the gate refuses the map' });
            continue;
        }
        const { rule, captures } = hit;
        const fill = (/** @type {string} */ t) => t.replace(/\{(\w+)\}/g, (_, k) => captures[k]);
        if (rule.none) {
            reasons.push({ file, why: `none: ${rule.none}` });
            continue;
        }
        if (rule.all) {
            all = true;
            reasons.push({ file, why: `everything: ${rule.all}` });
            continue;
        }
        if (rule.spec) {
            if (change.after !== null) specs.add(file);
            reasons.push({ file, why: change.after === null ? 'a removed spec: nothing left to run' : 'the spec file, whole' });
            continue;
        }
        if (rule.referenced) {
            const naming = specsNaming(file);
            for (const s of naming) specs.add(s);
            if (naming.length === 0 && change.after !== null) {
                // imported by the server or read some other way the names do not show: no claim to narrow it
                all = true;
                reasons.push({ file, why: 'everything: named by no spec, fixture page or helper' });
                continue;
            }
            reasons.push({ file, why: naming.length ? `named by ${naming.join(', ')}` : 'removed, and named by no spec' });
            continue;
        }
        if (file.endsWith('.css') && change.before !== null && change.after !== null) {
            const flat = (/** @type {string} */ s) => withoutComments(s).replace(/\s+/g, ' ').trim();
            if (flat(change.before) === flat(change.after)) {
                reasons.push({ file, why: 'only comment changed' });
                continue;
            }
        }
        const fixed = (rule.tags ?? []).map(fill);
        for (const t of fixed) add([t]);
        if (!rule.css) {
            reasons.push({ file, why: fixed.join(' ') });
            continue;
        }

        // Rule by rule.
        const { before, after } = changedLines(change.diff);
        /** @type {Set<string>} */
        const found = new Set();
        let unresolved = 0;
        for (const [side, lines] of /** @type {const} */ ([
            ['before', before],
            ['after', after],
        ])) {
            const text = change[side];
            if (text === null) continue;
            const chains = selectorChains(text);
            const masked = withoutComments(text).split('\n');
            for (const line of lines) {
                if ((masked[line - 1] ?? '').trim() === '') continue;
                const named = chainTags(chains(line), map.selectors, vocabulary.themes);
                if (!named) {
                    unresolved++;
                    continue;
                }
                for (const t of [...named.components, ...named.themes]) found.add(t);
            }
        }
        const extra = [];
        for (const t of found) {
            if (rule.css === 'sweeps' && t.startsWith('@component:')) {
                add(['@sweep', t]);
                extra.push(`@sweep+${t}`);
            } else if (rule.css === 'sweeps' && (t === '@sweep' || fixed.includes(t))) {
                // a register's sweeps are already narrowed to components; its own theme is already selected
            } else {
                add([t]);
                extra.push(t);
            }
        }
        if (unresolved && rule.fallback) {
            for (const t of rule.fallback) {
                if (t !== '*file') {
                    add([t]);
                    extra.push(t);
                    continue;
                }
                const whole = chainsOfFile(change.after ?? change.before ?? '', map.selectors, vocabulary.themes);
                for (const c of whole) add([c]);
                extra.push(`every component in the file (${whole.length})`);
            }
        }
        reasons.push({
            file,
            why: `${[...fixed, ...extra].join(' ') || 'no tag'}${unresolved ? ` — ${unresolved} changed line(s) in a rule naming no component${rule.fallback ? ', so the fallback' : ''}` : ''}`,
        });
    }
    return { all, terms: [...terms.values()], specs: [...specs].sort(), reasons };
}

/** @param {string} css @param {Record<string, string[]>} selectors @param {Set<string>} themes @returns {string[]} */
function chainsOfFile(css, selectors, themes) {
    const tags = new Set();
    const chains = selectorChains(css);
    const count = css.split('\n').length;
    for (let line = 1; line <= count; line++) {
        const named = chainTags(chains(line), selectors, themes);
        if (named) for (const t of named.components) if (t !== '@sweep') tags.add(t);
    }
    return [...tags].sort();
}

// ─── From a selection to Playwright ───────────────────────────────────────

const escape = (/** @type {string} */ s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
/** A tag, whole: `@component:table` must not match `@component:tables`. */
const tagPattern = (/** @type {string} */ t) => `(?:^|\\s)${escape(t)}(?=\\s|$)`;

/**
 * The `--grep` for a level, or null for "no filter" (everything).
 *
 * Playwright matches `--grep` against the title path — project, file,
 * describes, title — followed by the tags, joined by spaces. A file is
 * matched by its name as the title path writes it.
 *
 * @param {{ all: boolean, terms: string[][], specs: string[] }} selection
 * @param {'building' | 'commit' | 'engines' | 'release'} level
 * @returns {string | null | ''} null: every test; '': nothing to run
 */
export function grepFor(selection, level) {
    if (level === 'release' || selection.all) return null;
    const terms = [...selection.terms];
    if (level === 'commit' || level === 'engines') terms.push(['@sweep']);
    const parts = terms.map((and) => (and.length === 1 ? tagPattern(and[0]) : `^${and.map((t) => `(?=[\\s\\S]*${tagPattern(t)})`).join('')}`));
    for (const spec of selection.specs) parts.push(`(?:^|\\s)${escape(relative('tests', spec))}\\s`);
    return parts.length ? parts.join('|') : '';
}

/**
 * The changes to read.
 *
 * @param {{ files?: string[], commit?: string, base?: string }} options
 *   `commit`: what that commit changed; `files`: those paths, working tree
 *   against HEAD; neither: everything since `git merge-base HEAD main`, plus
 *   uncommitted and untracked files
 */
export function changes({ files, commit, base } = {}) {
    const show = (/** @type {string} */ ref, /** @type {string} */ file) => {
        try {
            return git(['show', `${ref}:${file}`]);
        } catch {
            return null;
        }
    };
    const disk = (/** @type {string} */ file) => (existsSync(join(ROOT, file)) ? readFileSync(join(ROOT, file), 'utf8') : null);

    if (commit) {
        const listed = git(['diff', '--name-only', `${commit}^`, commit])
            .split('\n')
            .filter(Boolean);
        return listed.map((file) => ({
            file,
            before: show(`${commit}^`, file),
            after: show(commit, file),
            diff: git(['diff', '-U0', `${commit}^`, commit, '--', file]),
        }));
    }
    const ref = files ? 'HEAD' : (base ?? git(['merge-base', 'HEAD', 'main']).trim());
    const listed =
        files ??
        [...new Set([...git(['diff', '--name-only', ref]).split('\n'), ...git(['ls-files', '--others', '--exclude-standard']).split('\n')])].filter(
            Boolean,
        );
    return listed.map((file) => {
        const before = show(ref, file);
        const after = disk(file);
        let diff = '';
        if (before !== null) diff = git(['diff', '-U0', ref, '--', file]);
        // A path named with --files but not changed is read as changed whole:
        // the question then is what that file reaches, not what moved in it.
        const whole = after !== null && (before === null || (files !== undefined && diff === ''));
        if (whole) diff = `@@ -0,0 +1,${after.split('\n').length} @@`;
        return { file, before: whole ? null : before, after, diff };
    });
}

// `node gates/tags.mjs [paths…]` prints what those paths (or, with none, the
// branch since `git merge-base HEAD main`) select, as JSON. Behind the
// entry-point check, because gates/check-tags.mjs and gates/run-tags.mjs
// import this module [fix-13].
if (import.meta.url === `file://${process.argv[1]}`) {
    const paths = process.argv.slice(2);
    console.log(JSON.stringify(select(changes(paths.length ? { files: paths } : {})), null, 2));
}

// Choosing the specs a change touches: those naming the changed files, plus the tag selection.

import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT, TESTS, loadMap, withoutComments } from './repo.mjs';
import { ruleFor, specFiles, vocabularyOf } from './vocabulary.mjs';
import { changes } from './changes.mjs';
import { chainTags, chainsOfFile, changedLines, onlyTheVersionMoved, selectorChains } from './css-chains.mjs';

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
        // A release bumps the version in package.json and nothing else there:
        // that reaches no test [Kenny, form v9, 2026-10-04, "Alleen wat
        // veranderde" — without this every release selected everything].
        if (rule.all && onlyTheVersionMoved(change)) {
            reasons.push({ file, why: 'none: only the version moved' });
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

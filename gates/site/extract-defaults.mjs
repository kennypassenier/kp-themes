// Does the prose match the code? [AR21]
//
// A prop's default is written twice: once in the JSDoc a reader sees
// ("Default true."), once in the destructuring the browser runs
// (`wrap = true`). Nothing has ever compared them, and the site is about
// to publish the first of the two — so this reads both and reports where
// they differ.
//
// It reports; it does not fix. A disagreement is either a stale sentence
// or a changed default, and which one it is belongs to whoever owns the
// component, not to the documentation plumbing.
//
// Three outcomes, all counted: agreed, disagreed, and "documented but the
// destructuring has no default", which is usually a value applied further
// in — a hook, a fallback at the use site — and is a weaker claim rather
// than a wrong one.
//
// Usage: node gates/site/extract-defaults.mjs

import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import process from 'node:process';
import { matchingBracket, stripComments } from './source.mjs';
import { documentedDefault } from './extract-props.mjs';

const DIR = fileURLToPath(new URL('../../components/', import.meta.url));

/** @typedef {{ component: string, module: string, prop: string, documented: string, actual: string | null, agrees: boolean, comparable: boolean }} Comparison */

/**
 * The `@property` lines of every `@typedef {object} XProps` block.
 *
 * @param {string} source one .jsx file
 * @returns {Map<string, Map<string, string>>} props type -> prop -> the documented default, where one is stated
 */
export function documentedDefaults(source) {
    /** @type {Map<string, Map<string, string>>} */
    const types = new Map();

    for (const block of source.matchAll(/\/\*\*[\s\S]*?\*\//g)) {
        const text = block[0];
        const typedef = /@typedef \{object\} (\w+Props)/.exec(text);
        if (!typedef) continue;
        /** @type {Map<string, string>} */
        const props = new Map();

        const flat = text
            .split('\n')
            .map((line) => line.replace(/^\s*\* ?/, ''))
            .join('\n');
        for (const property of flat.matchAll(/@property \{/g)) {
            const open = (property.index ?? 0) + property[0].length - 1;
            const afterType = flat.slice(matchingBracket(flat, open) + 1);
            const named = /^\s*(?:\[(\w+)(?:=[^\]]*)?\]|(\w+))([\s\S]*?)(?=@property |$)/.exec(afterType);
            if (!named) continue;
            const name = named[1] ?? named[2] ?? '';
            const stated = documentedDefault((named[3] ?? '').replace(/\s+/g, ' ').trim());
            if (name !== '' && stated !== null) props.set(name, stated);
        }
        types.set(typedef[1] ?? '', props);
    }

    return types;
}

/**
 * The top-level entries of a destructuring pattern, with their defaults.
 *
 * @param {string} pattern the text between the pattern's braces
 * @returns {Map<string, string | null>}
 */
export function destructuredDefaults(pattern) {
    /** @type {Map<string, string | null>} */
    const entries = new Map();
    let depth = 0;
    let start = 0;
    /** @type {string[]} */
    const parts = [];
    for (let i = 0; i <= pattern.length; i++) {
        const ch = pattern[i];
        if (ch === '{' || ch === '(' || ch === '[') depth++;
        else if (ch === '}' || ch === ')' || ch === ']') depth--;
        if (i === pattern.length || (ch === ',' && depth === 0)) {
            parts.push(pattern.slice(start, i));
            start = i + 1;
        }
    }

    for (const part of parts) {
        const entry = part.trim();
        if (entry === '' || entry.startsWith('...')) continue;
        const head = /^(\w+)\s*(?::\s*[\w{}[\], ]+?)?\s*(?:=\s*([\s\S]+))?$/.exec(entry);
        if (!head) continue;
        entries.set(head[1] ?? '', head[2] === undefined ? null : head[2].replace(/\s+/g, ' ').trim());
    }

    return entries;
}

/**
 * A literal reduced to the value it denotes, so `': '` and `": "` are the
 * same default written two ways. Anything that is not a literal returns
 * null and is reported as not comparable rather than as a disagreement.
 *
 * @param {string} text
 * @returns {string | null}
 */
export function literal(text) {
    const trimmed = text.trim();
    if (trimmed === 'true' || trimmed === 'false') return trimmed;
    if (/^-?\d+(?:\.\d+)?$/.test(trimmed)) return String(Number(trimmed));
    const quoted = /^(['"])([\s\S]*)\1$/.exec(trimmed);
    return quoted ? (quoted[2] ?? '') : null;
}

/**
 * @returns {{ comparisons: Comparison[], expected: number, agreed: number, disagreed: Comparison[], missing: Comparison[] }}
 */
export function extractDefaults() {
    const files = readdirSync(DIR)
        .filter((f) => f.endsWith('.jsx'))
        .sort();

    /** @type {Comparison[]} */
    const comparisons = [];

    for (const file of files) {
        const module = `components/${file}`;
        const source = readFileSync(DIR + file, 'utf8');
        const documented = documentedDefaults(source);
        const code = stripComments(source);

        for (const fn of source.matchAll(/function (\w+)\s*\(/g)) {
            const before = source.slice(0, fn.index ?? 0);
            const doc = before.slice(before.lastIndexOf('/**'));
            const propsType = /@param \{(\w+Props)/.exec(doc)?.[1];
            const props = propsType === undefined ? undefined : documented.get(propsType);
            if (!props || props.size === 0) continue;

            // The function's own text, found in the stripped copy so a
            // commented-out example cannot be mistaken for the signature.
            const at = code.indexOf(`function ${fn[1]}`);
            if (at < 0) continue;
            const params = code.slice(matchingBracket(code, code.indexOf('(', at)) + 1);
            const open = code.indexOf('{', code.indexOf('(', at));
            if (open < 0 || params === '') continue;
            const pattern = code.slice(open + 1, matchingBracket(code, open));
            const actual = destructuredDefaults(pattern);

            for (const [prop, stated] of props) {
                const found = actual.has(prop) ? (actual.get(prop) ?? null) : null;
                const left = literal(stated);
                const right = found === null ? null : literal(found);
                comparisons.push({
                    component: (fn[1] ?? '').replace(/Inner$/, ''),
                    module,
                    prop,
                    documented: stated,
                    actual: found,
                    agrees: left !== null && right !== null && left === right,
                    comparable: left !== null && right !== null,
                });
            }
        }
    }

    return {
        comparisons,
        // AR26: every documented literal default is a comparison this
        // check owes an answer for.
        expected: comparisons.length,
        agreed: comparisons.filter((c) => c.agrees).length,
        disagreed: comparisons.filter((c) => c.comparable && !c.agrees),
        missing: comparisons.filter((c) => !c.comparable),
    };
}

if (import.meta.url === `file://${process.argv[1]}`) {
    const result = extractDefaults();
    console.log(
        `Defaults: ${result.agreed} of ${result.expected} documented defaults match the destructuring; ` +
            `${result.disagreed.length} disagree, ${result.missing.length} could not be compared.`,
    );
    for (const c of result.disagreed) console.log(`  ${c.module} ${c.component}.${c.prop}: documented ${c.documented}, code has ${c.actual}`);
    for (const c of result.missing)
        console.log(`  ${c.module} ${c.component}.${c.prop}: documented ${c.documented}, code has ${c.actual ?? 'no default here'}`);
}

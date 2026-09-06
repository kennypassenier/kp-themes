// The props table, from the declarations tsc generated [AR21, TH100].
//
// Not from the `@typedef` blocks. tsc has already resolved the
// intersection with `HTMLAttributes`, the forwarded ref and the
// optionality, and `gates/check-types.mjs` fails when the declarations
// drift from the sources — so reading the JSDoc means writing a second
// parser whose disagreements with tsc would be nobody's fault and
// everybody's problem.
//
// The mapping rule is stated rather than guessed: **an exported
// component `X` is documented by the type `XProps`.** It holds for all
// 33 components today. An export that does not fit is reported with the
// reason (a helper function, a constant, props written inline) and never
// silently skipped — silence is how a component would go undocumented
// while the count still looked right (AR26).
//
// Usage: node gates/site/extract-props.mjs

import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import process from 'node:process';
import { matchingBracket } from './source.mjs';

const DIR = fileURLToPath(new URL('../../components/', import.meta.url));

/** @typedef {{ name: string, optional: boolean, type: string, description: string, documentedDefault: string | null }} Prop */
/** @typedef {{ name: string, declaration: string, module: string, propsType: string, exported: 'default' | 'named', props: Prop[] }} Component */
/** @typedef {{ name: string, declaration: string, kind: string, why: string, props: Prop[] }} Unmapped */

/** @param {string} comment a /** ... *\/ block */
function cleanDoc(comment) {
    return comment
        .replace(/^\/\*\*/, '')
        .replace(/\*\/$/, '')
        .split('\n')
        .map((line) => line.replace(/^\s*\* ?/, '').trim())
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim();
}

/**
 * A documented default, when the sentence states a value rather than a
 * policy. "Default true." is checkable; "Default: the dictionary's" is
 * prose about where the value comes from and is left alone.
 *
 * @param {string} description
 * @returns {string | null}
 */
export function documentedDefault(description) {
    const literal = /Default:?\s+(true|false|-?\d+(?:\.\d+)?|'[^']*'|"[^"]*")\.?(?:\s|$)/.exec(description);
    return literal?.[1] ?? null;
}

/**
 * The members of one object type, at its own level only.
 *
 * @param {string} body the text between the outer braces
 * @param {string} declaration for the error message
 * @returns {Prop[]}
 */
export function parseMembers(body, declaration = '<string>') {
    /** @type {Prop[]} */
    const props = [];
    let i = 0;
    let doc = '';

    while (i < body.length) {
        const rest = body.slice(i);
        const space = /^\s+/.exec(rest);
        if (space) {
            i += space[0].length;
            continue;
        }
        const comment = /^\/\*\*[\s\S]*?\*\//.exec(rest);
        if (comment) {
            doc = cleanDoc(comment[0]);
            i += comment[0].length;
            continue;
        }
        const head = /^(readonly\s+)?([A-Za-z_$][\w$]*|'[^']*'|"[^"]*")(\?)?\s*:/.exec(rest);
        if (!head) {
            // Not a named member: an index signature or a call signature.
            // Skipping one silently would drop a prop, so this stops.
            const line = body.slice(0, i).split('\n').length;
            throw new Error(`${declaration}: line ${line} of a props type is not a named member: ${rest.slice(0, 60).replace(/\n/g, ' ')}`);
        }
        let j = i + head[0].length;
        let depth = 0;
        while (j < body.length) {
            const ch = body[j];
            if (ch === '{' || ch === '(' || ch === '[') depth++;
            else if (ch === '}' || ch === ')' || ch === ']') depth--;
            else if (ch === ';' && depth === 0) break;
            j++;
        }
        const type = body
            .slice(i + head[0].length, j)
            .replace(/\s+/g, ' ')
            .trim();
        props.push({
            name: (head[2] ?? '').replace(/['"]/g, ''),
            optional: head[3] === '?',
            type,
            description: doc,
            documentedDefault: documentedDefault(doc),
        });
        doc = '';
        i = j + 1;
    }

    return props;
}

/**
 * Every value export of one declaration file, with the type text tsc gave
 * it — that text is what says whether it is a component.
 *
 * @param {string} source
 * @returns {{ name: string, exported: 'default' | 'named', form: 'const' | 'function', type: string }[]}
 */
export function valueExports(source) {
    /** @type {{ name: string, exported: 'default' | 'named', form: 'const' | 'function', type: string }[]} */
    const found = [];
    const defaults = new Set([...source.matchAll(/^export default (\w+);/gm)].map((m) => m[1]));

    for (const match of source.matchAll(/^(export )?declare (const|function) (\w+)\s*(:|\()/gm)) {
        const name = match[3] ?? '';
        const isExported = match[1] !== undefined || defaults.has(name);
        if (!isExported) continue;
        const start = (match.index ?? 0) + match[0].length;
        let end = start;
        let depth = 0;
        while (end < source.length) {
            const ch = source[end];
            if (ch === '{' || ch === '(' || ch === '<' || ch === '[') depth++;
            else if (ch === '}' || ch === ')' || ch === '>' || ch === ']') depth--;
            else if (ch === ';' && depth <= 0) break;
            end++;
        }
        found.push({
            name,
            exported: defaults.has(name) ? 'default' : 'named',
            form: match[2] === 'function' ? 'function' : 'const',
            type: source.slice(start, end).replace(/\s+/g, ' ').trim(),
        });
    }

    // `export { TOAST_MS };` re-exports a constant that lives elsewhere.
    for (const match of source.matchAll(/^export \{ ([^}]+) \};/gm)) {
        for (const name of (match[1] ?? '').split(',').map((n) => n.trim())) {
            if (name !== '' && !found.some((f) => f.name === name)) found.push({ name, exported: 'named', form: 'const', type: '' });
        }
    }

    return found;
}

/**
 * @returns {{ components: Component[], unmapped: Unmapped[], orphanTypes: string[], expected: { exports: number, propsTypes: number }, found: { mapped: number, props: number } }}
 */
export function extractProps() {
    const files = readdirSync(DIR)
        .filter((f) => f.endsWith('.d.ts'))
        .sort();

    /** @type {Component[]} */
    const components = [];
    /** @type {Unmapped[]} */
    const unmapped = [];
    /** @type {string[]} */
    const orphanTypes = [];
    let expectedExports = 0;
    let expectedTypes = 0;

    for (const file of files) {
        const declaration = `components/${file}`;
        const module = `components/${file.replace(/\.d\.ts$/, '.jsx')}`;
        const source = readFileSync(DIR + file, 'utf8');

        /** @type {Map<string, Prop[]>} */
        const propsTypes = new Map();
        for (const match of source.matchAll(/^export type (\w+Props) = \{/gm)) {
            const open = source.indexOf('{', match.index ?? 0);
            const body = source.slice(open + 1, matchingBracket(source, open));
            propsTypes.set(match[1] ?? '', parseMembers(body, declaration));
            expectedTypes++;
        }

        const exports = valueExports(source);
        expectedExports += exports.length;

        for (const entry of exports) {
            const isComponent = /ForwardRefExoticComponent|JSX\.Element/.test(entry.type);
            const propsType = `${entry.name}Props`;
            const props = propsTypes.get(propsType);

            if (isComponent && props) {
                components.push({ name: entry.name, declaration, module, propsType, exported: entry.exported, props });
                continue;
            }
            if (isComponent) {
                // A component whose props tsc inlined has no XProps to
                // read; the site needs to know, because its page would
                // otherwise carry an empty table that looks complete. The
                // inline members are parsed anyway and travel with the
                // report, so the page can be written — but the export
                // stays unmapped, because the rule was not met.
                // For `declare function X({ a }: { a?: string })` the first
                // brace is the destructuring pattern, not the type.
                const typeText = entry.form === 'function' ? entry.type.replace(/^\s*\{[^{}]*\}\s*:\s*/, '') : entry.type;
                const open = typeText.indexOf('{');
                unmapped.push({
                    name: entry.name,
                    declaration,
                    kind: 'component',
                    why: `no type ${propsType}; its props are written inline in the declaration`,
                    props: open < 0 ? [] : parseMembers(typeText.slice(open + 1, matchingBracket(typeText, open)), declaration),
                });
                continue;
            }
            unmapped.push({
                name: entry.name,
                declaration,
                kind: entry.type.startsWith('(') || entry.type === '' ? 'function or constant' : 'value',
                why: 'not a component: the declaration is neither a forwardRef nor a function returning JSX',
                props: [],
            });
        }

        for (const [type] of propsTypes) {
            if (!components.some((c) => c.declaration === declaration && c.propsType === type)) orphanTypes.push(`${declaration}: ${type}`);
        }
    }

    return {
        components,
        unmapped,
        orphanTypes,
        expected: { exports: expectedExports, propsTypes: expectedTypes },
        found: { mapped: components.length, props: components.reduce((sum, c) => sum + c.props.length, 0) },
    };
}

if (import.meta.url === `file://${process.argv[1]}`) {
    const result = extractProps();
    // AR26: the expectation is the number of exports the declarations
    // contain, so "found nothing" is arithmetic rather than success.
    console.log(
        `Props: ${result.found.mapped} components carrying ${result.found.props} props, ` +
            `from ${result.expected.exports} value exports and ${result.expected.propsTypes} props types across components/*.d.ts.`,
    );
    for (const entry of result.unmapped) console.log(`  unmapped ${entry.declaration} ${entry.name} (${entry.kind}): ${entry.why}`);
    for (const orphan of result.orphanTypes) console.log(`  props type with no component: ${orphan}`);
    if (result.found.mapped === 0) {
        console.error('Props: no component mapped at all, which cannot be right.');
        process.exit(1);
    }
}

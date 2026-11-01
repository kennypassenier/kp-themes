// The theme signatures [scope-97]: reading them, validating them against
// themes/signature.schema.json, and checking that what they cite exists.
//
// A signature is only worth reading if it cannot lie. So every entry carries
// proof — a selector, keyframes or custom property in a named stylesheet, or
// a token in the theme's tokens.json — and `proofProblems` refuses proof the
// file does not contain. The page (gates/generate-portraits.mjs), the browser
// test (tests/theme-portraits.spec.mjs) and the advice check
// (gates/advice-signature.mjs) read the signatures through this module.
//
// No dependency: the validator below covers the part of JSON Schema the
// schema uses (type, required, properties, additionalProperties, items,
// minItems, minLength, maxLength, pattern, enum, const, anyOf, oneOf,
// if/then/else and local $ref), and refuses a keyword it does not know, so a
// schema that grows past it fails loudly instead of validating nothing.

import { existsSync, readFileSync } from 'node:fs';
export { validate } from './signature-validate.mjs';

const root = new URL('../', import.meta.url);

/** @param {string} path */
const read = (path) => readFileSync(new URL(path, root), 'utf8');

export const SCHEMA_PATH = 'themes/signature.schema.json';

/** The themes that have a signature, in the order of themes/order.json. */
export function signedThemes() {
    /** @type {string[]} */
    const order = JSON.parse(read('themes/order.json'));
    return order.filter((theme) => existsSync(new URL(`themes/${theme}/signature.json`, root)));
}

/** @param {string} theme */
export function readSignature(theme) {
    return JSON.parse(read(`themes/${theme}/signature.json`));
}

export function readSchema() {
    return JSON.parse(read(SCHEMA_PATH));
}


/* ------------------------------------------------------------------ CSS */

/**
 * The style rules of a stylesheet, flat: each with its selector list (split at
 * top-level commas, whitespace collapsed), its declarations and the at-rules
 * around it. Comments are dropped and keyframe stops are not style rules. A
 * scanner, not a parser: it is enough for the package's own stylesheets.
 *
 * @param {string} css
 * @returns {{ selectors: string[], body: string, context: string[] }[]}
 */
export function styleRules(css) {
    const text = css.replace(/\/\*[\s\S]*?\*\//g, ' ');
    /** @type {{ selectors: string[], body: string, context: string[] }[]} */
    const rules = [];
    /** @type {string[]} */
    const stack = [];
    let start = 0;
    let quote = '';
    for (let i = 0; i < text.length; i++) {
        const c = text[i];
        if (quote) {
            if (c === '\\') i++;
            else if (c === quote) quote = '';
            continue;
        }
        if (c === '"' || c === "'") {
            quote = c;
            continue;
        }
        if (c === ';') {
            start = i + 1;
            continue;
        }
        if (c === '{') {
            const prelude = text.slice(start, i).replace(/\s+/g, ' ').trim();
            if (prelude.startsWith('@') || stack.some((s) => s.startsWith('@keyframes'))) {
                stack.push(prelude);
                start = i + 1;
                continue;
            }
            // A style rule: read its body to the matching brace.
            let depth = 1;
            let j = i + 1;
            let q = '';
            for (; j < text.length && depth > 0; j++) {
                const d = text[j];
                if (q) {
                    if (d === '\\') j++;
                    else if (d === q) q = '';
                } else if (d === '"' || d === "'") q = d;
                else if (d === '{') depth++;
                else if (d === '}') depth--;
            }
            rules.push({ selectors: splitSelectors(prelude), body: text.slice(i + 1, j - 1), context: [...stack] });
            i = j - 1;
            start = j;
            continue;
        }
        if (c === '}') {
            stack.pop();
            start = i + 1;
        }
    }
    return rules;
}

/** @param {string} list */
export function splitSelectors(list) {
    /** @type {string[]} */
    const parts = [];
    let depth = 0;
    let quote = '';
    let current = '';
    for (const c of list) {
        if (quote) {
            if (c === quote) quote = '';
        } else if (c === '"' || c === "'") quote = c;
        else if (c === '(' || c === '[') depth++;
        else if (c === ')' || c === ']') depth--;
        else if (c === ',' && depth === 0) {
            parts.push(current.replace(/\s+/g, ' ').trim());
            current = '';
            continue;
        }
        current += c;
    }
    if (current.trim()) parts.push(current.replace(/\s+/g, ' ').trim());
    return parts;
}

/** @param {string} css @param {string} name */
export const hasKeyframes = (css, name) => new RegExp(`@keyframes\\s+${name.replace(/[-]/g, '\\-')}\\s*\\{`).test(css);

/** @param {string} css @param {string} property */
export const declaresProperty = (css, property) =>
    new RegExp(`(^|[\\s;{])${property.replace(/[-]/g, '\\-')}\\s*:`).test(css.replace(/\/\*[\s\S]*?\*\//g, ' '));

/* ---------------------------------------------------------------- proof */

/**
 * Every proof object in a signature, with where it sits.
 * @param {any} value
 * @param {string} [at]
 * @returns {{ at: string, proof: any }[]}
 */
export function proofsIn(value, at = '') {
    if (Array.isArray(value)) return value.flatMap((item, i) => proofsIn(item, `${at}/${i}`));
    if (value === null || typeof value !== 'object') return [];
    /** @type {{ at: string, proof: any }[]} */
    const found = [];
    for (const [key, child] of Object.entries(value)) {
        if (key === 'proof' && Array.isArray(child)) child.forEach((proof, i) => found.push({ at: `${at}/proof/${i}`, proof }));
        else found.push(...proofsIn(child, `${at}/${key}`));
    }
    return found;
}

/**
 * What a signature cites and its files do not contain.
 * @param {any} signature
 * @param {(path: string) => string} [load]
 * @returns {string[]}
 */
export function proofProblems(signature, load = read) {
    /** @type {Map<string, string>} */
    const cache = new Map();
    /** @type {Map<string, Set<string>>} */
    const selectorCache = new Map();
    const file = (/** @type {string} */ path) => {
        if (!cache.has(path)) cache.set(path, load(path));
        return /** @type {string} */ (cache.get(path));
    };
    const selectors = (/** @type {string} */ path) => {
        if (!selectorCache.has(path)) selectorCache.set(path, new Set(styleRules(file(path)).flatMap((r) => r.selectors)));
        return /** @type {Set<string>} */ (selectorCache.get(path));
    };
    /** @type {string[]} */
    const problems = [];
    for (const { at, proof } of proofsIn(signature)) {
        let text;
        try {
            text = file(proof.file);
        } catch {
            problems.push(`${at}: ${proof.file} does not exist`);
            continue;
        }
        if (proof.token !== undefined) {
            if (!proof.file.endsWith('tokens.json')) problems.push(`${at}: a token is proven in a tokens.json, not in ${proof.file}`);
            else if (!JSON.parse(text).entries.some((/** @type {any} */ e) => e.token === proof.token))
                problems.push(`${at}: ${proof.file} declares no token ${proof.token}`);
        }
        if (proof.selector !== undefined) {
            const wanted = proof.selector.replace(/\s+/g, ' ').trim();
            if (!selectors(proof.file).has(wanted)) problems.push(`${at}: ${proof.file} has no rule for ${wanted}`);
        }
        if (proof.keyframes !== undefined && !hasKeyframes(text, proof.keyframes))
            problems.push(`${at}: ${proof.file} has no @keyframes ${proof.keyframes}`);
        if (proof.property !== undefined && !declaresProperty(text, proof.property))
            problems.push(`${at}: ${proof.file} declares no ${proof.property}`);
        const signedTheme = /^themes\/([a-z-]+)\/tokens\.json$/.exec(proof.file)?.[1] ?? /^css\/([a-z-]+)-register\.css$/.exec(proof.file)?.[1];
        if (signedTheme && signedTheme !== signature.theme && proof.file.startsWith('themes/'))
            problems.push(`${at}: cites another theme's tokens (${proof.file})`);
    }
    return problems;
}

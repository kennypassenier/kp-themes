// One selector parser for the gates that read rules [AR36, AR37].
//
// check-hooks.mjs asks "does this stylesheet have a rule with exactly this
// selector and a non-empty body"; check-register-coverage.mjs asks "which
// component roots does the register name". The critic's objection to the
// first draft was that one gate inferred what the other refused to infer,
// with two parsers and two opinions of "answered". This is the one
// parser both read.
//
// It is a rule parser, not a CSS parser: it walks braces, skips comments,
// splits selector lists on commas outside parentheses, and records the
// body of every rule that is not an at-rule block. `@layer`, `@media` and
// `@supports` blocks are entered, not recorded; `@keyframes` blocks are
// skipped whole, because `50%` is not a selector.

/**
 * @typedef {{ selector: string, body: string, line: number }} Rule
 */

/**
 * Every rule in a stylesheet, keyed by selector as written (whitespace
 * collapsed). A selector list `a, b { … }` yields one rule per selector,
 * each with the same body.
 *
 * @param {string} source
 * @returns {Map<string, Rule[]>}
 */
export function rulesOf(source) {
    /** @type {Map<string, Rule[]>} */
    const out = new Map();
    const text = source.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '));
    let i = 0;
    /** @type {string[]} */
    const stack = [];
    let head = '';
    let headStart = 0;
    while (i < text.length) {
        const ch = text[i];
        if (ch === '{') {
            const selector = head.trim();
            if (selector.startsWith('@keyframes') || selector.startsWith('@font-face') || selector.startsWith('@property')) {
                // Skip the whole block; its contents are not selectors.
                let depth = 1;
                i++;
                while (i < text.length && depth > 0) {
                    if (text[i] === '{') depth++;
                    else if (text[i] === '}') depth--;
                    i++;
                }
                head = '';
                headStart = i;
                continue;
            }
            if (selector.startsWith('@')) {
                stack.push('@');
                head = '';
                i++;
                headStart = i;
                continue;
            }
            // A style rule: read its body up to the matching brace. Nested
            // rules (CSS nesting) are not used in this package; a nested
            // brace is treated as part of the body.
            let depth = 1;
            let j = i + 1;
            while (j < text.length && depth > 0) {
                if (text[j] === '{') depth++;
                else if (text[j] === '}') depth--;
                j++;
            }
            const body = text.slice(i + 1, j - 1);
            const line = text.slice(0, headStart).split('\n').length;
            for (const part of splitSelectors(selector)) {
                const key = part.replace(/\s+/g, ' ').trim();
                if (key === '') continue;
                const list = out.get(key) ?? [];
                list.push({ selector: key, body, line });
                out.set(key, list);
            }
            i = j;
            head = '';
            headStart = i;
            continue;
        }
        if (ch === '}') {
            stack.pop();
            head = '';
            i++;
            headStart = i;
            continue;
        }
        if (ch === ';' && head.trim() !== '' && stack.length > 0 && head.includes('@')) {
            // An at-statement like `@import` or `@layer a, b;` inside a block.
            head = '';
            i++;
            headStart = i;
            continue;
        }
        head += ch;
        i++;
    }
    return out;
}

/**
 * Split a selector list on commas outside parentheses.
 *
 * @param {string} selector
 * @returns {string[]}
 */
export function splitSelectors(selector) {
    /** @type {string[]} */
    const out = [];
    let depth = 0;
    let current = '';
    for (const ch of selector) {
        if (ch === '(') depth++;
        else if (ch === ')') depth--;
        if (ch === ',' && depth === 0) {
            out.push(current);
            current = '';
            continue;
        }
        current += ch;
    }
    out.push(current);
    return out;
}

/**
 * The `.kp-*` component roots a selector names as its subject: the last
 * compound of each selector, stripped of pseudo-classes, pseudo-elements
 * and attribute selectors, when that compound carries a `.kp-<root>`
 * class without a `__` or `--` suffix.
 *
 * `.kp-card__title` names no root (it is an element of one);
 * `.kp-card:hover::after` names `card`; `[data-theme='x'] .kp-card`
 * names `card`; `.kp-card .kp-badge` names `badge` only — the subject.
 *
 * @param {string} selector
 * @returns {string[]}
 */
export function subjectRoots(selector) {
    const compound = lastCompound(selector);
    const stripped = compound.replace(/::?[a-zA-Z-]+(\([^)]*\))?/g, '').replace(/\[[^\]]*\]/g, '');
    /** @type {string[]} */
    const roots = [];
    // The whole class token, underscores included, so `.kp-card__title`
    // is read as an element of `card` and not as `card` itself.
    for (const m of stripped.matchAll(/\.kp-([a-z][a-z0-9_-]*)/g)) {
        const name = m[1];
        if (name.includes('__')) continue;
        if (/--/.test(name)) continue;
        roots.push(name);
    }
    return roots;
}

/** @param {string} selector @returns {string} */
function lastCompound(selector) {
    // Split on descendant/child/sibling combinators outside brackets and
    // parentheses; the subject is the last piece.
    let depth = 0;
    let bracket = 0;
    let current = '';
    /** @type {string[]} */
    const parts = [];
    for (const ch of selector) {
        if (ch === '(') depth++;
        else if (ch === ')') depth--;
        else if (ch === '[') bracket++;
        else if (ch === ']') bracket--;
        if (depth === 0 && bracket === 0 && /[\s>+~]/.test(ch)) {
            if (current !== '') parts.push(current);
            current = '';
            continue;
        }
        current += ch;
    }
    if (current !== '') parts.push(current);
    return parts[parts.length - 1] ?? '';
}

/**
 * Every `.kp-*` root a stylesheet declares: a class `.kp-<root>` used as
 * a subject anywhere, without a `__` or `--` suffix. This is what
 * check-register-coverage.mjs reads from css/components.css at run time,
 * so the list of roots cannot go stale.
 *
 * @param {string} source
 * @returns {Set<string>}
 */
export function declaredRoots(source) {
    /** @type {Set<string>} */
    const out = new Set();
    // Anywhere in the selector, not only the subject: a root that only ever
    // appears as an ancestor (`.kp-tabs > .kp-tabs__list`) is still a root
    // the register has to answer.
    for (const [selector] of rulesOf(source)) {
        const stripped = selector.replace(/::?[a-zA-Z-]+(\([^)]*\))?/g, '').replace(/\[[^\]]*\]/g, '');
        for (const m of stripped.matchAll(/\.kp-([a-z][a-z0-9_-]*)/g)) {
            if (m[1].includes('__') || /--/.test(m[1])) continue;
            out.add(m[1]);
        }
    }
    return out;
}

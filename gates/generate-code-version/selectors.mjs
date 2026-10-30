// Splitting selectors and bucketing a stylesheet's rules by the family they name.

import { withoutComments } from '../tags.mjs';
import { read, withoutTheVersion } from './sources.mjs';
import { root } from './config.mjs';

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

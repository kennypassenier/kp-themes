// Reading changed CSS as selector chains, and the tags a chain names.

import { withoutComments } from './repo.mjs';

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

/** @param {string} css @param {Record<string, string[]>} selectors @param {Set<string>} themes @returns {string[]} */
export function chainsOfFile(css, selectors, themes) {
    const tags = new Set();
    const chains = selectorChains(css);
    const count = css.split('\n').length;
    for (let line = 1; line <= count; line++) {
        const named = chainTags(chains(line), selectors, themes);
        if (named) for (const t of named.components) if (t !== '@sweep') tags.add(t);
    }
    return [...tags].sort();
}

/**
 * Whether a JSON file changed in its `version` field alone.
 * @param {{ file: string, before: string | null, after: string | null }} change
 */
export function onlyTheVersionMoved({ file, before, after }) {
    if (!file.endsWith('.json') || before === null || after === null) return false;
    try {
        const [a, b] = [JSON.parse(before), JSON.parse(after)];
        if (a.version === b.version) return false;
        delete a.version;
        delete b.version;
        return JSON.stringify(a) === JSON.stringify(b);
    } catch {
        return false;
    }
}

// ─── From a selection to Playwright ───────────────────────────────────────

// Every theme answers every hook [S45, AR36].
//
// The hook vocabulary is a contract beside the 81 tokens: a consumer
// writes `data-kp-surface`, `<mark>`, `data-kp-reveal`, `data-kp-divider`
// or a heading inside a surface, and the active theme decides what that
// looks like. A theme's answer may be quiet — "no reveal, the element
// stands in its rest state" — but it may not be missing, because a
// missing answer is the silence S45 exists to end.
//
// The answers live in ONE matrix, themes/hooks.json: a `default` row and
// a row per theme that overrides one hook at a time. The critic's
// objection to the first draft (24 manifests where 23 carry no
// information) is why it is one file; the objection that "the selector
// exists in the named stylesheet" let formal cite cyberpunk's rule is why
// a non-quiet answer must name a selector that contains
// `[data-theme='<that theme>']`, checked as written. The default row is
// the one place an unscoped selector is allowed, because it IS the shared
// base rule.
//
// What fails:
//   - a theme in themes/order.json with no row
//   - a hook with no answer in the default row and none in the theme row
//   - a quiet answer without a reason
//   - a non-quiet answer whose stylesheet does not exist, whose selector
//     does not appear in it as a rule with a non-empty body, or (theme
//     rows only) whose selector is not scoped to that theme
//   - a theme row naming a theme that does not exist, or a hook that
//     does not exist — a row nobody reads is drift waiting to happen
//
// AR26: it prints how many answers it checked.
//
// Usage: node gates/check-hooks.mjs

import { readFileSync } from 'node:fs';
import process from 'node:process';
import { rulesOf } from './selectors.mjs';

const root = new URL('../', import.meta.url);

/**
 * @typedef {{ quiet: string } | { css: string, selector: string }} Answer
 * @typedef {{ hooks: Record<string, string>, default: Record<string, Answer>, themes: Record<string, Record<string, Answer>> }} Matrix
 */

/**
 * Check a matrix against a theme list and a stylesheet reader.
 *
 * @param {Matrix} matrix
 * @param {string[]} themes every theme name the package ships
 * @param {(css: string) => string | null} read repo-relative stylesheet, or null when absent
 * @returns {{ checked: number, problems: string[] }}
 */
export function audit(matrix, themes, read) {
    /** @type {string[]} */
    const problems = [];
    let checked = 0;
    const hooks = Object.keys(matrix.hooks ?? {});
    if (hooks.length === 0) problems.push('the matrix names no hooks');

    /** @type {Map<string, Map<string, import('./selectors.mjs').Rule[]>>} */
    const cache = new Map();
    /** @param {string} css @returns {Map<string, import('./selectors.mjs').Rule[]> | null} */
    const rules = (css) => {
        if (cache.has(css)) return cache.get(css) ?? null;
        const source = read(css);
        const parsed = source === null ? null : rulesOf(source);
        cache.set(css, parsed ?? new Map());
        return parsed;
    };

    /**
     * @param {string} where
     * @param {string} hook
     * @param {Answer} answer
     * @param {string | null} theme null for the default row
     */
    const check = (where, hook, answer, theme) => {
        checked++;
        if ('quiet' in answer) {
            if (typeof answer.quiet !== 'string' || answer.quiet.trim() === '') problems.push(`${where}: ${hook} is quiet without a reason`);
            return;
        }
        if (typeof answer.css !== 'string' || typeof answer.selector !== 'string') {
            problems.push(`${where}: ${hook} is neither quiet nor a { css, selector } answer`);
            return;
        }
        const parsed = rules(answer.css);
        if (parsed === null) {
            problems.push(`${where}: ${hook} names ${answer.css}, which does not exist`);
            return;
        }
        const found = parsed.get(answer.selector);
        if (!found || !found.some((rule) => rule.body.trim() !== '')) {
            problems.push(
                `${where}: ${hook} names selector \`${answer.selector}\` and ${answer.css} has no rule with that selector and a non-empty body`,
            );
            return;
        }
        if (theme !== null && !answer.selector.includes(`[data-theme='${theme}']`)) {
            problems.push(
                `${where}: ${hook} names \`${answer.selector}\`, which is not scoped to [data-theme='${theme}'] — a theme's own answer must be its own rule`,
            );
        }
    };

    for (const [hook, answer] of Object.entries(matrix.default ?? {})) {
        if (!hooks.includes(hook)) problems.push(`default: ${hook} is not a hook the matrix names`);
        else check('default', hook, answer, null);
    }
    for (const theme of themes) {
        const row = matrix.themes?.[theme];
        if (row === undefined) {
            problems.push(`${theme}: no row in themes/hooks.json (an empty row means "the default answers")`);
            continue;
        }
        for (const hook of hooks) {
            const own = row[hook];
            if (own !== undefined) check(theme, hook, own, theme);
            else if (matrix.default?.[hook] === undefined) problems.push(`${theme}: ${hook} is answered neither by the theme nor by the default row`);
        }
        for (const hook of Object.keys(row)) if (!hooks.includes(hook)) problems.push(`${theme}: ${hook} is not a hook the matrix names`);
    }
    for (const theme of Object.keys(matrix.themes ?? {})) {
        if (!themes.includes(theme)) problems.push(`${theme}: a row for a theme that does not ship`);
    }
    return { checked, problems };
}

if (import.meta.url === `file://${process.argv[1]}`) {
    const matrix = /** @type {Matrix} */ (JSON.parse(readFileSync(new URL('themes/hooks.json', root), 'utf8')));
    const themes = /** @type {string[]} */ (JSON.parse(readFileSync(new URL('themes/order.json', root), 'utf8')));
    const { checked, problems } = audit(matrix, themes, (css) => {
        try {
            return readFileSync(new URL(css, root), 'utf8');
        } catch {
            return null;
        }
    });
    if (problems.length > 0) {
        console.error(`Every theme answers every hook [S45]. These do not:\n${problems.join('\n')}`);
        process.exit(1);
    }
    if (checked === 0) {
        console.error('gate broke: checked no answers, which cannot be right while themes/hooks.json exists.');
        process.exit(1);
    }
    console.log(`Hooks: ${themes.length} themes answer ${Object.keys(matrix.hooks).length} hooks (${checked} answers checked, quiet or scoped).`);
}

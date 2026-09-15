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
// And the divider's shape knob [scope-93], from the dividerShapes entry of
// the same matrix: every value has its @scope rule and the plain rule that
// writes its name (Firefox needs it to tell sibling shapes apart), the
// stylesheet draws no value the matrix does not name, and a theme whose
// default is a shape (pastel: pearls) draws exactly that shape's mask in
// its own register.
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

/**
 * The @scope blocks of a stylesheet: prelude root and limit as written
 * (whitespace collapsed) and the body between the braces.
 *
 * @param {string} source
 * @returns {{ root: string, limit: string, body: string }[]}
 */
export function scopesOf(source) {
    const text = source.replace(/\/\*[\s\S]*?\*\//g, ' ');
    const out = [];
    for (const match of text.matchAll(/@scope\s*\(([^{]*?)\)\s*to\s*\(([^{]*)\)\s*\{/g)) {
        let depth = 1;
        let j = (match.index ?? 0) + match[0].length;
        const start = j;
        while (j < text.length && depth > 0) {
            if (text[j] === '{') depth++;
            else if (text[j] === '}') depth--;
            j++;
        }
        const collapse = (/** @type {string} */ s) => s.replace(/\s+/g, ' ').trim();
        out.push({ root: collapse(match[1] ?? ''), limit: collapse(match[2] ?? ''), body: text.slice(start, j - 1) });
    }
    return out;
}

/**
 * The declarations of every rule inside a block, later ones winning, values
 * with their whitespace collapsed.
 *
 * @param {string} body
 * @returns {Map<string, string>}
 */
export function declarationsOf(body) {
    /** @type {Map<string, string>} */
    const out = new Map();
    for (const rule of body.matchAll(/\{([^{}]*)\}/g)) {
        let depth = 0;
        let current = '';
        const parts = [];
        for (const ch of rule[1] ?? '') {
            if (ch === '(') depth++;
            else if (ch === ')') depth--;
            if (ch === ';' && depth === 0) {
                parts.push(current);
                current = '';
                continue;
            }
            current += ch;
        }
        parts.push(current);
        for (const part of parts) {
            const colon = part.indexOf(':');
            if (colon < 0) continue;
            const name = part.slice(0, colon).trim();
            if (name === '') continue;
            out.set(
                name,
                part
                    .slice(colon + 1)
                    .replace(/\s+/g, ' ')
                    .trim(),
            );
        }
    }
    return out;
}

/** The mask declarations a shape is, and a theme default must repeat. */
const MASK = ['mask-image', 'mask-size', 'mask-position', 'mask-repeat'];

/**
 * The divider shape knob against its stylesheet and its theme defaults
 * [scope-93]. Every value has a scope whose root names it and whose limit is
 * any other value, so the nearest attribute wins; the drawing scope runs
 * from any value but the restore value to the restore value; the stylesheet
 * draws no value the list does not name; and a theme whose default is a
 * shape draws that shape's mask in its own divider rule, declaration for
 * declaration, so the register and the knob cannot drift apart.
 *
 * @param {Matrix & { dividerShapes?: { attribute: string, css: string, restore: string, values: Record<string, string>, defaults?: Record<string, string> } }} matrix
 * @param {string[]} themes
 * @param {(css: string) => string | null} read
 * @returns {{ checked: number, problems: string[] }}
 */
export function auditShapes(matrix, themes, read) {
    const problems = [];
    let checked = 0;
    const knob = matrix.dividerShapes;
    if (knob === undefined) return { checked, problems: ['themes/hooks.json has no dividerShapes entry'] };
    const source = read(knob.css);
    if (source === null) return { checked, problems: [`dividerShapes names ${knob.css}, which does not exist`] };
    const attr = knob.attribute;
    const scopes = scopesOf(source);
    const values = Object.keys(knob.values ?? {});
    if (values.length === 0) problems.push('dividerShapes names no values');

    const drawing = scopes.find((s) => s.root === `[${attr}]:not([${attr}='${knob.restore}'])` && s.limit === `[${attr}='${knob.restore}']`);
    checked++;
    if (!drawing || declarationsOf(drawing.body).size === 0) {
        problems.push(`${knob.css}: no drawing scope from [${attr}] but '${knob.restore}' to [${attr}='${knob.restore}'] with declarations`);
    }

    /** @type {Map<string, Map<string, string>>} */
    const shapes = new Map();
    for (const value of values) {
        checked++;
        const scope = scopes.find((s) => s.root === `[${attr}='${value}']` && s.limit === `[${attr}]:not([${attr}='${value}'])`);
        const declared = scope ? declarationsOf(scope.body) : new Map();
        if (!scope || declared.size === 0) {
            problems.push(`${knob.css}: the shape '${value}' has no scope from [${attr}='${value}'] to any other value with declarations`);
            continue;
        }
        shapes.set(value, declared);
    }

    // Each value, the restore value too, writes its own name on the element
    // that carries it: without that rule Firefox shares one computed style
    // between sibling roots and every row draws the first row's shape.
    const plain = rulesOf(source);
    for (const value of [...values, knob.restore]) {
        checked++;
        const rule = plain.get(`[${attr}='${value}']`);
        const own = rule ? declarationsOf(rule.map((r) => `{${r.body}}`).join('\n')) : new Map();
        if (own.get('--kp-divider-shape') !== value) {
            problems.push(
                `${knob.css}: no rule [${attr}='${value}'] { --kp-divider-shape: ${value}; } — without it Firefox lets sibling shapes share one style`,
            );
        }
    }

    const named = new Set([...source.replace(/\/\*[\s\S]*?\*\//g, ' ').matchAll(new RegExp(`\\[${attr}='([^']*)'\\]`, 'g'))].map((m) => m[1]));
    for (const value of named) {
        if (value !== knob.restore && !values.includes(value))
            problems.push(`${knob.css} draws the shape '${value}', which dividerShapes does not name`);
    }

    const base = drawing ? declarationsOf(drawing.body) : new Map();
    for (const [theme, value] of Object.entries(knob.defaults ?? {})) {
        checked++;
        if (!themes.includes(theme)) {
            problems.push(`dividerShapes: a default for ${theme}, a theme that does not ship`);
            continue;
        }
        const shape = shapes.get(value);
        if (!values.includes(value) || shape === undefined) {
            problems.push(`dividerShapes: ${theme}'s default '${value}' is not a drawn shape`);
            continue;
        }
        const answer = matrix.themes?.[theme]?.divider;
        if (answer === undefined || 'quiet' in answer) {
            problems.push(`${theme}: its default divider is '${value}', but its row in themes/hooks.json does not answer the divider with a rule`);
            continue;
        }
        const register = read(answer.css);
        const rule = register === null ? undefined : rulesOf(register).get(answer.selector);
        if (!rule) {
            problems.push(`${theme}: its divider answer \`${answer.selector}\` is not a rule in ${answer.css}`);
            continue;
        }
        const own = declarationsOf(rule.map((r) => `{${r.body}}`).join('\n'));
        for (const property of MASK) {
            const want = shape.get(property) ?? base.get(property);
            if (own.get(property) !== want) {
                problems.push(
                    `${theme}: its divider draws ${property}: ${own.get(property) ?? '(nothing)'}, but the shape '${value}' is ${property}: ${want}`,
                );
            }
        }
    }
    return { checked, problems };
}

if (import.meta.url === `file://${process.argv[1]}`) {
    const matrix = /** @type {Matrix} */ (JSON.parse(readFileSync(new URL('themes/hooks.json', root), 'utf8')));
    const themes = /** @type {string[]} */ (JSON.parse(readFileSync(new URL('themes/order.json', root), 'utf8')));
    /** @param {string} css */
    const read = (css) => {
        try {
            return readFileSync(new URL(css, root), 'utf8');
        } catch {
            return null;
        }
    };
    const { checked, problems } = audit(matrix, themes, read);
    const shapes = auditShapes(matrix, themes, read);
    if (problems.length > 0) {
        console.error(`Every theme answers every hook [S45]. These do not:\n${problems.join('\n')}`);
        process.exit(1);
    }
    if (shapes.problems.length > 0) {
        console.error(`The divider shape knob does not hold [scope-93]:\n${shapes.problems.join('\n')}`);
        process.exit(1);
    }
    if (checked === 0 || shapes.checked === 0) {
        console.error('gate broke: checked no answers, which cannot be right while themes/hooks.json exists.');
        process.exit(1);
    }
    console.log(`Hooks: ${themes.length} themes answer ${Object.keys(matrix.hooks).length} hooks (${checked} answers checked, quiet or scoped).`);
    console.log(`Divider shapes: ${shapes.checked} checked (the drawing scope, every value's scope and name rule, every theme default).`);
}

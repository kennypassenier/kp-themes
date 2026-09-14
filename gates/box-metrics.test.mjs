// A control's height and a table row's height are the package's [scope-80].
//
// Option E of research/uniform-size/, as Kenny chose it on 2026-09-14: the
// block metrics of the one-line boxes a user touches most are fixed by
// css/components.css in all 22 themes, and a register keeps everything else
// — its inline padding, its type, its border and its paint. The research
// measured why: the size tokens were already identical in every
// tokens.json, and the registers bypassed them. Five of them pinned their
// buttons at 48 or 46.4px (`min-block-size: calc(3rem + …)`), four padded
// their fields past the floor, and `line-height: normal` let each face's
// own ascent decide the rest: a form card 390 to 459px across the themes.
//
// Registers sit in a later layer than the components (`@layer kp.base,
// kp.components, kp.register, …`), so the package cannot win by the
// cascade. This test is what keeps it the package's: it refuses a register
// rule whose subject is one of the covered boxes and that declares one of
// the box's block metrics, and a register that restates one of the tokens
// the heights are made of.
//
// Run: node --test gates/

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { rulesOf, splitSelectors } from './selectors.mjs';

const CSS = new URL('../css/', import.meta.url);

/**
 * The covered boxes, by what their subject compound carries.
 *
 * The button in every size and variant; the field — which is also the
 * select, the date field's input and the inline editor — except the
 * multi-line one, which is a text box and keeps its block padding; the
 * combobox input, which is also the tag input's; and a table's header and
 * body cells, whose block size is the row's height.
 */
export const COVERED = [
    { name: '.kp-button', matches: (/** @type {string} */ compound) => /\.kp-button(?:--[\w-]+)?(?![\w-])/.test(compound) },
    { name: '.kp-field__input', matches: (/** @type {string} */ compound) => /\.kp-field__input(?![\w-])/.test(compound) },
    { name: '.kp-combobox__input', matches: (/** @type {string} */ compound) => /\.kp-combobox__input(?![\w-])/.test(compound) },
    {
        name: '.kp-table th, td, tr',
        matches: (/** @type {string} */ compound, /** @type {string} */ selector) =>
            /^(?:th|td|tr)(?![\w-])/.test(compound) && /\.kp-(?:data)?table(?![\w-])/.test(selector),
    },
];

/** The block metrics of a covered box. */
export const BLOCK_METRICS = [
    'height',
    'min-height',
    'max-height',
    'block-size',
    'min-block-size',
    'max-block-size',
    'line-height',
    'padding',
    'padding-block',
    'padding-block-start',
    'padding-block-end',
    'padding-top',
    'padding-bottom',
];

/** The tokens the heights are made of: a register may not restate them either. */
export const PACKAGE_TOKENS = [
    '--kp-control-height',
    '--kp-control-padding-block',
    '--kp-control-line-height',
    '--kp-line-height',
    '--kp-row-height',
    '--kp-button-height-sm',
    '--kp-button-height-lg',
    '--kp-button-padding-block-sm',
    '--kp-button-padding-block-lg',
    '--kp-table-cell-block',
];

/**
 * Declarations a register may keep, each with its reason. Listed rather than
 * pattern-matched, so adding one is a decision somebody makes on purpose.
 *
 * @type {Record<string, string>}
 */
export const MAY_KEEP = {
    "retro-register.css [data-theme='retro'] .kp-button:active:not(:disabled) padding-block":
        'the pressed label steps one pixel down, as the original did: a pixel of block padding moved from the bottom to the top of a box that centres its label, so the box keeps its height.',
};

/**
 * The subject compounds of one selector: its last compound, and each branch
 * of an `:is()` or `:where()` in it. `:not()` names what the subject is not,
 * so its contents are dropped; a pseudo-element is not the box, so a subject
 * that carries one is none.
 *
 * @param {string} selector
 * @returns {string[]}
 */
export function subjects(selector) {
    // The last compound: split on combinators outside parentheses.
    let depth = 0;
    let start = 0;
    for (let i = 0; i < selector.length; i++) {
        const ch = selector[i];
        if (ch === '(' || ch === '[') depth++;
        else if (ch === ')' || ch === ']') depth--;
        else if (depth === 0 && /[\s>+~]/.test(ch)) start = i + 1;
    }
    const last = selector.slice(start).trim();
    if (last.includes('::') || /:(?:before|after)(?![\w-])/.test(last)) return [];
    const withoutNot = last.replace(/:not\((?:[^()]|\([^()]*\))*\)/g, '');
    const alternatives = [];
    const is = withoutNot.match(/:(?:is|where)\(((?:[^()]|\([^()]*\))*)\)/);
    if (is) {
        const outside = withoutNot.replace(is[0], '');
        for (const branch of splitSelectors(is[1])) alternatives.push(`${branch.trim()}${outside}`);
    } else alternatives.push(withoutNot);
    return alternatives;
}

/**
 * Every register declaration that sets a covered box's block metric or a
 * package token.
 *
 * @param {string} source the stylesheet
 * @param {string} file its name, for the message and for MAY_KEEP
 * @param {{ themedOnly?: boolean }} [options] themedOnly: read only rules scoped to a `[data-theme]` (css/_rules.css)
 * @returns {string[]}
 */
export function boxMetricViolations(source, file, { themedOnly = false } = {}) {
    /** @type {string[]} */
    const out = [];
    for (const [selector, rules] of rulesOf(source)) {
        if (themedOnly && !selector.includes('[data-theme')) continue;
        const covered = subjects(selector)
            .map((compound) => COVERED.find((c) => c.matches(compound, selector)))
            .filter(Boolean);
        for (const { body, line } of rules) {
            for (const declaration of body.split(';')) {
                const m = declaration.match(/^\s*(--[\w-]+|[a-z-]+)\s*:\s*([\s\S]*)$/);
                if (!m) continue;
                const [, property, value] = m;
                const where = `css/${file}:${line} \`${selector}\``;
                if (PACKAGE_TOKENS.includes(property)) {
                    out.push(`${where} restates ${property}, a token the package's control and row heights are made of [scope-80]`);
                    continue;
                }
                if (covered.length === 0 || !BLOCK_METRICS.includes(property)) continue;
                if (MAY_KEEP[`${file} ${selector} ${property}`]) continue;
                out.push(
                    `${where} sets \`${property}: ${value.trim()}\` on ${covered[0]?.name}. A control's height, a table row's height and their line height ` +
                        `are the package's in every theme [scope-80]; a register keeps its inline padding (\`padding-inline\`), type, border and paint.`,
                );
            }
        }
    }
    return out;
}

test('no register sets the block metrics of a control or a table row [scope-80]', () => {
    /** @type {string[]} */
    const found = [];
    for (const file of readdirSync(CSS)
        .filter((name) => name.endsWith('-register.css'))
        .sort()) {
        found.push(...boxMetricViolations(readFileSync(new URL(file, CSS), 'utf8'), file));
    }
    found.push(...boxMetricViolations(readFileSync(new URL('_rules.css', CSS), 'utf8'), '_rules.css', { themedOnly: true }));
    assert.deepEqual(found, [], `\n${found.join('\n')}`);
});

test('every entry of MAY_KEEP still names a declaration that exists [scope-80]', () => {
    for (const key of Object.keys(MAY_KEEP)) {
        const [file, ...rest] = key.split(' ');
        const property = rest.pop();
        const selector = rest.join(' ');
        const rules = rulesOf(readFileSync(new URL(file, CSS), 'utf8')).get(selector) ?? [];
        assert.ok(
            rules.some(({ body }) => new RegExp(`(^|;)\\s*${property}\\s*:`).test(body)),
            `MAY_KEEP names ${key}, which no longer exists: take the entry out`,
        );
    }
});

test('the guard reads subjects, not mentions [scope-80]', () => {
    const scoped = (/** @type {string} */ css) => boxMetricViolations(`@layer kp.register {\n${css}\n}`, 'x-register.css');
    // Each of the five old pins, in the shapes the registers wrote them.
    assert.equal(scoped("[data-theme='x'] .kp-button { min-block-size: calc(3rem + var(--kp-control-height, 2.25rem) - 2.25rem); }").length, 1);
    assert.equal(scoped("[data-theme='x'] [data-kp-surface='hero'] .kp-row > .kp-button { min-height: 2.5rem; }").length, 1);
    assert.equal(scoped("[data-theme='x'] .kp-button--sm { padding: 0.4rem 1rem; }").length, 1);
    assert.equal(scoped("[data-theme='x'] .kp-field__input, [data-theme='x'] .kp-palette__input { padding: 1rem 0.8rem; }").length, 1);
    assert.equal(scoped("[data-theme='x'] :is(.kp-tab, .kp-button):hover { line-height: 2; }").length, 1);
    assert.equal(scoped("[data-theme='x'] .kp-table td { block-size: 3rem; }").length, 1);
    assert.equal(scoped("[data-theme='x'] { --kp-control-height: 3rem; }").length, 1);
    // What a register keeps.
    assert.deepEqual(scoped("[data-theme='x'] .kp-button { padding-inline: 1.6rem; font-size: 1.05rem; border: 2px solid; }"), []);
    assert.deepEqual(scoped("[data-theme='x'] .kp-button::before { height: 100%; line-height: 1; }"), []);
    assert.deepEqual(scoped("[data-theme='x'] .kp-button .kp-button__label { line-height: 1; }"), []);
    assert.deepEqual(scoped("[data-theme='x'] .kp-field__input--multiline { min-height: 6rem; }"), []);
    assert.deepEqual(scoped("[data-theme='x'] .kp-tab:not(.kp-button) { padding: 0.3rem 0.75rem; }"), []);
    assert.deepEqual(scoped("[data-theme='x'] .kp-shortcuts td { padding: 1rem; }"), []);
});

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
// Option B followed on 2026-09-15 [scope-87]: headings (h1 to h6, card,
// dialog and footer titles), form labels and help text, tabs, badges, the
// bar's links, its dropdown and mega-menu links and its search trigger,
// the side navigation's rows, the breadcrumb and the pagination take their
// type size, line height and block padding from the package too — as
// tokens in css/_rules.css and css/components.css, at titanium's values,
// the median theme's [scope-82]. A register keeps colour, border, face,
// case, letter spacing and ornaments. Letter spacing and capitals still
// widen a line, so B promises nearly equal, not identical.
//
// scope-88 added three boxes on 2026-09-15: the bar's call to action
// (`.kp-nav__link--cta`, a bar link the link matcher's `(?![\w-])` did not
// reach), a field's error and the side navigation's title. Nine
// declarations in six registers on 6dd76c6c, none after.
//
// Run: node --test gates/

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { rulesOf, splitSelectors } from './selectors.mjs';
import { BLOCK_METRICS, COVERED, COVERED_TYPE, MAY_KEEP, PACKAGE_TOKENS } from './box-metrics-data.mjs';
export { COVERED, TYPE_METRICS, COVERED_TYPE, BLOCK_METRICS, PACKAGE_TOKENS, MAY_KEEP } from './box-metrics-data.mjs';

const CSS = new URL('../css/', import.meta.url);


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
        const typeCovered = subjects(selector)
            .map((compound) => COVERED_TYPE.find((c) => c.matches(compound, selector)))
            .filter((c) => c !== undefined);
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
                if (MAY_KEEP[`${file} ${selector} ${property}`]) continue;
                const typed = typeCovered.find((c) => c.properties.includes(property));
                if (covered.length === 0 && typed) {
                    out.push(
                        `${where} sets \`${property}: ${value.trim()}\` on ${typed.name}: its type size, line height and block padding are the package's [scope-87]; ` +
                            `a register keeps \`padding-inline\`, colour, border, face, case, letter spacing and ornaments.`,
                    );
                    continue;
                }
                if (covered.length === 0 || !BLOCK_METRICS.includes(property)) continue;
                out.push(
                    `${where} sets \`${property}: ${value.trim()}\` on ${covered[0]?.name}. A control's height, a table row's height and their line height ` +
                        `are the package's in every theme [scope-80]; a register keeps its inline padding (\`padding-inline\`), type, border and paint.`,
                );
            }
        }
    }
    return out;
}

test('no register sets the block metrics of a control or a table row, or the type metrics of a heading, label, tab, badge or navigation link [scope-80, scope-87]', () => {
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
    assert.deepEqual(scoped("[data-theme='x'] .kp-tab:not(.kp-button) { padding-inline: 0.75rem; }"), []);
    assert.deepEqual(scoped("[data-theme='x'] .kp-shortcuts td { padding: 1rem; }"), []);
});

test('option B reads type metrics on headings, labels, tabs, badges and navigation, not their ornaments [scope-87]', () => {
    const scoped = (/** @type {string} */ css) => boxMetricViolations(`@layer kp.register {\n${css}\n}`, 'x-register.css');
    // Shapes the registers of 4783e3f wrote.
    assert.equal(scoped("[data-theme='x'] h1, [data-theme='x'] h2 { line-height: 1.05; }").length, 2);
    assert.equal(scoped("[data-theme='x'] [data-kp-surface] h1 { font-size: var(--kp-text-display); }").length, 1);
    assert.equal(scoped("[data-theme='x'] .kp-card__title { font-size: 1.9rem; }").length, 1);
    assert.equal(scoped("[data-theme='x'] .kp-footer h4 { font-size: 0.72rem; }").length, 1);
    assert.equal(scoped("[data-theme='x'] .kp-field__label { font-size: 0.68rem; }").length, 1);
    assert.equal(scoped("[data-theme='x'] .kp-badge { font-size: 0.72rem; }").length, 1);
    assert.equal(scoped("[data-theme='x'] .kp-tab { padding: 0.3rem 0.75rem; }").length, 1);
    assert.equal(scoped("[data-theme='x'] .kp-nav__link { padding: 0.7rem 1.1rem 1.2rem; font-size: 0.9rem; }").length, 2);
    assert.equal(scoped("[data-theme='x'] .kp-nav__menu a { padding: 0.25rem 1.4rem; }").length, 1);
    assert.equal(scoped("[data-theme='x'] .kp-nav__search .kp-nav__search-trigger { font-size: inherit; }").length, 1);
    assert.equal(scoped("[data-theme='x'] .kp-nav__links { font-size: 0.72rem; }").length, 1);
    assert.equal(scoped("[data-theme='x'] .kp-sidenav__link, [data-theme='x'] .kp-sidenav__category-toggle { padding: 0.6rem 1.1rem; }").length, 2);
    assert.equal(scoped("[data-theme='x'] .kp-breadcrumb, [data-theme='x'] .kp-pagination { font-size: 0.85rem; }").length, 2);
    assert.equal(scoped("[data-theme='x'] { --kp-nav-link-size: 1rem; }").length, 1);
    // scope-88: the shapes the registers of 6dd76c6c wrote.
    assert.equal(scoped("[data-theme='x'] .kp-nav__link--cta { padding: 0.55rem 1.3rem; }").length, 1);
    assert.equal(scoped("[data-theme='x'] .kp-nav__link--cta:active { padding: calc(0.25rem + 1px) 0.9rem; }").length, 1);
    assert.equal(scoped("[data-theme='x'] .kp-field__error { font-size: 0.7rem; }").length, 1);
    assert.equal(scoped("[data-theme='x'] .kp-sidenav__title { font-size: 0.625rem; }").length, 1);
    assert.equal(scoped("[data-theme='x'] { --kp-field-error-size: 1rem; --kp-sidenav-title-size: 1rem; }").length, 2);
    assert.deepEqual(scoped("[data-theme='x'] .kp-nav__link--cta { padding-inline: 1.3rem; font-weight: 700; }"), []);
    assert.deepEqual(scoped("[data-theme='x'] .kp-field__error::before { content: '!! '; font-size: 0.7rem; }"), []);
    // What a register keeps: inline padding, face, case, spacing, ornaments, the strip's own layout.
    assert.deepEqual(scoped("[data-theme='x'] .kp-nav__link { padding-inline: 1.1rem; letter-spacing: 0.18em; text-transform: uppercase; }"), []);
    assert.deepEqual(scoped("[data-theme='x'] .kp-nav__link::after { height: 4px; bottom: 0; }"), []);
    assert.deepEqual(scoped("[data-theme='x'] .kp-nav__links { padding: 0.5rem; gap: 1rem; }"), []);
    assert.deepEqual(scoped("[data-theme='x'] .kp-card__title { font-family: var(--theme-font-display); font-weight: 700; }"), []);
    assert.deepEqual(scoped("[data-theme='x'] .kp-tag { font-size: 0.72rem; }"), []);
});

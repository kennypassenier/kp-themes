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

/** The type metrics option B adds to a box's block metrics [scope-87]. */
export const TYPE_METRICS = ['font', 'font-size', 'line-height'];

/**
 * The boxes option B covers [scope-87], each with the properties a register
 * may not set on it. A trail or a link strip is covered for its type only:
 * its descendants inherit the size, and its own padding is layout.
 *
 * @type {{ name: string, properties: string[], matches: (compound: string, selector: string) => boolean }[]}
 */
export const COVERED_TYPE = [];

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

COVERED_TYPE.push(
    {
        name: 'a heading (h1–h6, .kp-card__title, .kp-dialog__title)',
        properties: [...TYPE_METRICS, ...BLOCK_METRICS],
        matches: (compound) => /^h[1-6](?![\w-])/.test(compound) || /\.kp-(?:card|dialog)__title(?![\w-])/.test(compound),
    },
    {
        name: '.kp-field__label / .kp-field__help',
        properties: [...TYPE_METRICS, ...BLOCK_METRICS],
        matches: (compound) => /\.kp-field__(?:label|help)(?![\w-])/.test(compound),
    },
    { name: '.kp-tab', properties: [...TYPE_METRICS, ...BLOCK_METRICS], matches: (compound) => /\.kp-tab(?![\w-])/.test(compound) },
    { name: '.kp-badge', properties: [...TYPE_METRICS, ...BLOCK_METRICS], matches: (compound) => /\.kp-badge(?:--[\w-]+)?(?![\w-])/.test(compound) },
    {
        name: 'a bar link (.kp-nav__link, .kp-nav__disclosure, .kp-nav__search-trigger, a dropdown or mega-menu link)',
        properties: [...TYPE_METRICS, ...BLOCK_METRICS],
        matches: (compound, selector) =>
            /\.kp-nav__(?:link|disclosure|search-trigger)(?![\w-])/.test(compound) ||
            (/^a(?![\w-])/.test(compound) && /\.kp-nav__(?:menu|group)(?![\w-])/.test(selector)),
    },
    { name: '.kp-nav__links', properties: TYPE_METRICS, matches: (compound) => /\.kp-nav__links(?![\w-])/.test(compound) },
    {
        name: '.kp-sidenav__link',
        properties: [...TYPE_METRICS, ...BLOCK_METRICS],
        matches: (compound) => /\.kp-sidenav__(?:link|category-toggle)(?![\w-])/.test(compound),
    },
    // scope-88: the bar's call to action, a field's error and the side navigation's title.
    {
        name: '.kp-nav__link--cta',
        properties: [...TYPE_METRICS, ...BLOCK_METRICS],
        matches: (compound) => /\.kp-nav__link--cta(?![\w-])/.test(compound),
    },
    { name: '.kp-field__error', properties: [...TYPE_METRICS, ...BLOCK_METRICS], matches: (compound) => /\.kp-field__error(?![\w-])/.test(compound) },
    {
        name: '.kp-sidenav__title',
        properties: [...TYPE_METRICS, ...BLOCK_METRICS],
        matches: (compound) => /\.kp-sidenav__title(?![\w-])/.test(compound),
    },
    {
        name: '.kp-breadcrumb / .kp-pagination',
        properties: TYPE_METRICS,
        matches: (compound) => /\.kp-(?:breadcrumb|pagination)(?![\w-])/.test(compound),
    },
    {
        name: 'a breadcrumb or pagination item',
        properties: [...TYPE_METRICS, ...BLOCK_METRICS],
        matches: (compound, selector) =>
            /^(?:a|li|span|button)(?![\w-])|^\[aria-current/.test(compound) && /\.kp-(?:breadcrumb|pagination)(?![\w-])/.test(selector),
    },
);

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
    // Option B [scope-87].
    '--kp-heading-line-height',
    '--kp-h1-size',
    '--kp-h2-size',
    '--kp-h3-size',
    '--kp-h4-size',
    '--kp-h5-size',
    '--kp-h6-size',
    '--kp-display-line-height',
    '--kp-card-title-size',
    '--kp-dialog-title-size',
    '--kp-footer-heading-size',
    '--kp-field-label-size',
    '--kp-field-help-size',
    '--kp-badge-size',
    '--kp-badge-line-height',
    '--kp-badge-padding-block',
    '--kp-tab-size',
    '--kp-tab-padding-block',
    '--kp-nav-link-size',
    '--kp-nav-link-padding-block',
    '--kp-nav-menu-link-size',
    '--kp-nav-menu-link-padding-block',
    '--kp-sidenav-link-size',
    '--kp-sidenav-link-padding-block',
    '--kp-sidenav-item-pad',
    '--kp-breadcrumb-size',
    '--kp-pagination-size',
    // scope-88.
    '--kp-field-error-size',
    '--kp-sidenav-title-size',
];

/**
 * Declarations a register may keep, each with its reason. Listed rather than
 * pattern-matched, so adding one is a decision somebody makes on purpose.
 *
 * @type {Record<string, string>}
 */
export const MAY_KEEP = {
    // The button's own entry went on 2026-09-15 (Kenny's retro notes): its
    // pressed step is painted now, not padded, so it keeps no block metric.
    // scope-89: "Dezelfde uitzondering als de knop".
    "retro-register.css [data-theme='retro'] .kp-nav__link--cta:active padding-block":
        "the pressed call to action steps one pixel down, as the button does and as the original did: a pixel of the package's block padding moved from the bottom to the top, so the link keeps its height.",
    // Option B [scope-87]: block padding that is a painted bar's or a frame's inset, not the heading's size.
    "_rules.css [data-theme='retro'] h1 padding":
        "the h1 is a 1995 window's title bar, a gradient plate: its inset is the plate's, and without it the words touch the bar's edges.",
    "retro-register.css [data-theme='retro'] [data-kp-surface] h1 padding":
        "undoes the title-bar inset above on a surface's headline, which is not drawn as a bar: the headline keeps the package's zero.",
    "retro-register.css [data-theme='retro'] .kp-dialog__title padding":
        "the dialog's title is the window's title bar, the same gradient plate: three pixels of inset around the words.",
    "deco-register.css [data-theme='deco'] [data-kp-surface] h1[data-kp-reveal='headline'] padding":
        'the headline is set in a cartouche, a stepped frame drawn around it: the padding is the room between the frame and the words.',
    "terminal-register.css [data-theme='terminal'] [data-kp-surface] h1 min-block-size":
        'the headline is typed out character by character; the floor holds two lines of room so the page below does not jump while it types.',
    "cyberpunk-register.css [data-theme='cyberpunk'] [data-kp-surface] h2 padding-top":
        'the room above the words where the four corner brackets are painted (background gradients): without it the brackets cross the letters.',
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

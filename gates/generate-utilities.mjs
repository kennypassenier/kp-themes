// The utility API, generated from one source [TH93, AR23].
//
// A utility is a single-purpose class: one declaration, no state, no
// variant. They live in `@layer kp.utilities`, the last layer, so a
// utility beats a component's own value without anyone reaching for
// `!important` (AR17).
//
// Generated rather than written by hand, for the reason every other
// generated file here is: 116 classes written out once are 116 chances
// to typo a token name. The families and their values are the source
// below; `css/utilities.css` is the output; `--check` fails when the two
// drift, exactly like css/themes.css.
//
// The documented list in `docs/UTILITIES.md` is NOT generated. It is
// written by hand and `gates/check-utilities.mjs` lays it beside this
// output in both directions. A generated list could not disagree with a
// generated stylesheet, so it would measure nothing.
//
// No breakpoint variants: a `.kp-p-md@md` family multiplies this by the
// number of breakpoints and every one of them has to be documented and
// tested. The layout layer does responsive work with container queries
// instead (TH96).
//
// Usage:
//   node gates/generate-utilities.mjs           write css/utilities.css
//   node gates/generate-utilities.mjs --check   exit 1 if it would change

import { readFileSync, writeFileSync } from 'node:fs';
import process from 'node:process';

const OUT = new URL('../css/utilities.css', import.meta.url);

/** The spacing scale R0 declared in all 24 themes, plus a zero step. */
export const STEPS = ['0', 'xs', 'sm', 'md', 'lg', 'xl', '2xl'];

/** @param {string} step */
const space = (step) => (step === '0' ? '0' : `var(--kp-space-${step})`);

/**
 * @typedef {[string, string]} Declaration a property and its value
 * @typedef {[string, Declaration[]]} Rule a class name and what it sets
 */

/**
 * The families, in the order they appear in the stylesheet.
 *
 * Each entry yields `[className, declarations]`. A declaration that is a
 * fixed keyword carries its own knob so a consumer can retune it (KT6);
 * one that reads the scale needs no second knob, because the token IS
 * the knob.
 */
export const FAMILIES = [
    {
        id: 'spacing',
        title: 'Spacing',
        note: 'Logical properties, so they follow the writing direction.',
        /** @returns {Rule[]} */
        classes: () => {
            const sides = [
                ['p', 'padding'],
                ['px', 'padding-inline'],
                ['py', 'padding-block'],
                ['m', 'margin'],
                ['mt', 'margin-block-start'],
                ['mb', 'margin-block-end'],
            ];
            /** @type {Rule[]} */
            const out = [];
            for (const [prefix, property] of sides) {
                for (const step of STEPS) {
                    out.push([`kp-${prefix}-${step}`, [[property, space(step)]]]);
                }
            }
            out.push(['kp-mx-auto', [['margin-inline', 'auto']]]);
            return out;
        },
    },
    {
        id: 'gap',
        title: 'Gap',
        note: 'For a flex or grid container; inert on anything else.',
        /** @returns {Rule[]} */
        classes: () => {
            /** @type {Rule[]} */
            const out = [];
            for (const [prefix, property] of [
                ['gap', 'gap'],
                ['gap-x', 'column-gap'],
                ['gap-y', 'row-gap'],
            ]) {
                for (const step of STEPS) {
                    out.push([`kp-${prefix}-${step}`, [[property, space(step)]]]);
                }
            }
            return out;
        },
    },
    {
        id: 'display',
        title: 'Display',
        note: '`.kp-d-grid` carries the `d-` prefix because `.kp-grid` is already the dashboard grid component.',
        /** @returns {Rule[]} */
        classes: () =>
            [
                ['block', 'block'],
                ['inline', 'inline'],
                ['inline-block', 'inline-block'],
                ['flex', 'flex'],
                ['inline-flex', 'inline-flex'],
                ['grid', 'grid'],
                ['none', 'none'],
            ].map(([name, value]) => /** @type {Rule} */ ([`kp-d-${name}`, [['display', `var(--kp-d-${name}, ${value})`]]])),
    },
    {
        id: 'flex',
        title: 'Flex and grid alignment',
        note: 'Works on a grid container too: both box models read these properties.',
        /** @returns {Rule[]} */
        classes: () => {
            /** @type {Rule[]} */
            const out = [];
            for (const [name, value] of [
                ['start', 'flex-start'],
                ['center', 'center'],
                ['end', 'flex-end'],
                ['stretch', 'stretch'],
                ['baseline', 'baseline'],
            ]) {
                out.push([`kp-items-${name}`, [['align-items', value]]]);
            }
            for (const [name, value] of [
                ['start', 'flex-start'],
                ['center', 'center'],
                ['end', 'flex-end'],
                ['between', 'space-between'],
                ['around', 'space-around'],
            ]) {
                out.push([`kp-justify-${name}`, [['justify-content', value]]]);
            }
            for (const [name, value] of [
                ['row', 'row'],
                ['column', 'column'],
            ]) {
                out.push([`kp-flex-${name}`, [['flex-direction', value]]]);
            }
            for (const name of ['wrap', 'nowrap']) {
                out.push([`kp-flex-${name}`, [['flex-wrap', name]]]);
            }
            for (const [name, value] of [
                ['1', '1 1 0%'],
                ['auto', '1 1 auto'],
                ['none', '0 0 auto'],
            ]) {
                out.push([`kp-flex-${name}`, [['flex', value]]]);
            }
            for (const [name, value] of [
                ['start', 'flex-start'],
                ['center', 'center'],
                ['end', 'flex-end'],
                ['stretch', 'stretch'],
            ]) {
                out.push([`kp-self-${name}`, [['align-self', value]]]);
            }
            return out;
        },
    },
    {
        id: 'text',
        title: 'Text',
        note: 'No `.kp-truncate`: css/components.css already declares it, with a display and a max-width this family would drop. The collision gate found that. The font-size family reads the three steps the components actually use; there are three rather than six because the scale has three, and inventing steps nothing uses would be inventing values. Alignment, the muted colour, the mono face and the prose measure are layout classes (TH91), not utilities.',
        /** @returns {Rule[]} */
        classes: () => {
            /** @type {Rule[]} */
            const out = [];
            for (const step of ['xs', 'sm', 'md']) {
                out.push([`kp-fs-${step}`, [['font-size', `var(--kp-text-${step})`]]]);
            }
            for (const [name, value] of [
                ['normal', '400'],
                ['medium', '500'],
                ['semibold', '600'],
                ['bold', '700'],
            ]) {
                out.push([`kp-fw-${name}`, [['font-weight', `var(--kp-fw-${name}, ${value})`]]]);
            }
            for (const [name, value] of [
                ['upper', 'uppercase'],
                ['lower', 'lowercase'],
                ['capitalize', 'capitalize'],
            ]) {
                out.push([`kp-tt-${name}`, [['text-transform', value]]]);
            }
            out.push(['kp-text-nowrap', [['white-space', 'nowrap']]]);
            out.push(['kp-text-balance', [['text-wrap', 'balance']]]);
            out.push(['kp-text-pretty', [['text-wrap', 'pretty']]]);
            for (const [name, value] of [
                ['tight', '1.25'],
                ['normal', '1.5'],
                ['loose', '1.75'],
            ]) {
                out.push([`kp-lh-${name}`, [['line-height', `var(--kp-lh-${name}, ${value})`]]]);
            }
            return out;
        },
    },
    {
        id: 'size',
        title: 'Width and height',
        note: 'The three measures read the same knobs the layout containers do, so retuning `--kp-prose-max` moves both.',
        /** @returns {Rule[]} */
        classes: () => {
            /** @type {Rule[]} */
            const out = [];
            for (const [name, value] of [
                ['full', '100%'],
                ['auto', 'auto'],
                ['min', 'min-content'],
                ['max', 'max-content'],
                ['fit', 'fit-content'],
            ]) {
                out.push([`kp-w-${name}`, [['inline-size', value]]]);
            }
            for (const [name, knob, fallback] of [
                ['prose', '--kp-prose-max', '65ch'],
                ['center', '--kp-center-max', '28rem'],
                ['page', '--kp-page-max', '64rem'],
            ]) {
                out.push([`kp-max-w-${name}`, [['max-inline-size', `var(${knob}, ${fallback})`]]]);
            }
            for (const [name, value] of [
                ['full', '100%'],
                ['auto', 'auto'],
            ]) {
                out.push([`kp-h-${name}`, [['block-size', value]]]);
            }
            return out;
        },
    },
];

/**
 * Every generated class name, in stylesheet order.
 * @returns {string[]}
 */
export function names() {
    return FAMILIES.flatMap((f) => f.classes().map((entry) => String(entry[0])));
}

/** The whole stylesheet as a string. */
export function render() {
    const head = [
        '/* Generated by gates/generate-utilities.mjs — do not edit by hand. */',
        '/* The utility API [TH93]. The documented list is docs/UTILITIES.md, */',
        '/* written by hand; gates/check-utilities.mjs holds the two together. */',
        '',
        '@layer kp.utilities {',
    ];
    const body = [];
    for (const family of FAMILIES) {
        body.push(`    /* ${family.title} — ${family.note} */`);
        for (const [name, declarations] of family.classes()) {
            body.push(`    .${name} {`);
            for (const [property, value] of declarations) {
                body.push(`        ${property}: ${value};`);
            }
            body.push('    }');
            body.push('');
        }
    }
    return `${[...head, ...body].join('\n').trimEnd()}\n}\n`;
}

if (import.meta.url === `file://${process.argv[1]}`) {
    const wanted = render();
    const check = process.argv.includes('--check');
    let current = '';
    try {
        current = readFileSync(OUT, 'utf8');
    } catch {
        current = '';
    }
    if (check) {
        if (current !== wanted) {
            console.error('css/utilities.css does not match its source — run `npm run generate:utilities`.');
            process.exit(1);
        }
        console.log(`The utility API matches its source (${names().length} classes).`);
    } else {
        writeFileSync(OUT, wanted);
        console.log(`Wrote css/utilities.css (${names().length} classes).`);
    }
}

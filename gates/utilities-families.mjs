// The utility families of css/utilities.css: the spacing scale and, per family, the class names and the rules each writes (gates/generate-utilities.mjs).

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

// The knobs a consumer may set [AR21, TH100, KT6].
//
// `--kp-*` is the other half of the framework-free API: 51 custom
// properties the component stylesheet reads, every one with a fallback,
// so setting none of them is the supported case and setting one is a
// documented adjustment. They are the CSS answer to "every feature
// configurable with a default" (KT6).
//
// The family comes from the rule that reads the knob, not from its name:
// `--kp-control-height` is read by `.kp-button` and `.kp-field__input`,
// which is more useful on a page than the guess "control". Where a knob
// is read in several families they are all reported.
//
// One knob is declared and never read through `var()`:
// `--kp-breakpoint-narrow` at css/components.css:1586 is a contract value
// written into a media query, because a media query cannot read a custom
// property. It is reported as such rather than dropped — dropping it is
// how the count would come out at 50 and look right.
//
// Usage: node gates/site/extract-knobs.mjs

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import process from 'node:process';
import { matchingBracket } from './source.mjs';

const FILE = fileURLToPath(new URL('../../css/components.css', import.meta.url));

/** @typedef {{ name: string, defaults: string[], families: string[], selectors: string[], read: boolean, declared: boolean }} Knob */

/**
 * CSS has no line comments, so the block form is the whole job.
 *
 * @param {string} source
 */
export function stripCssComments(source) {
    return source.replace(/\/\*[\s\S]*?\*\//g, ' ');
}

/**
 * The component family a selector belongs to: the first `.kp-x` class or
 * `[data-kp-x]` hook in it, minus any BEM element or modifier.
 *
 * @param {string} selector
 * @returns {string | null}
 */
export function familyOf(selector) {
    const klass = /\.kp-([a-z0-9]+)/.exec(selector);
    if (klass) return klass[1] ?? null;
    const hook = /\[data-kp-([a-z0-9]+)/.exec(selector);
    return hook?.[1] ?? null;
}

/**
 * @param {string} [source] the stylesheet, for the tests
 * @returns {{ knobs: Knob[], expected: number, readCount: number, unread: string[] }}
 */
export function extractKnobs(source = readFileSync(FILE, 'utf8')) {
    const css = stripCssComments(source);
    /** @type {Map<string, Knob>} */
    const knobs = new Map();

    /** @param {string} name @returns {Knob} */
    const knob = (name) => {
        let entry = knobs.get(name);
        if (!entry) {
            entry = { name, defaults: [], families: [], selectors: [], read: false, declared: false };
            knobs.set(name, entry);
        }
        return entry;
    };

    /** @type {string[]} */
    const stack = [];
    let prelude = '';
    let i = 0;

    while (i < css.length) {
        const ch = css[i];

        if (ch === '{') {
            stack.push(prelude.replace(/\s+/g, ' ').trim());
            prelude = '';
            i++;
            continue;
        }
        if (ch === '}') {
            stack.pop();
            prelude = '';
            i++;
            continue;
        }
        if (ch === ';') {
            prelude = '';
            i++;
            continue;
        }

        const read = /^var\(\s*(--kp-[a-z0-9-]+)/.exec(css.slice(i));
        if (read) {
            const entry = knob(read[1] ?? '');
            entry.read = true;
            const close = matchingBracket(css, css.indexOf('(', i));
            const inside = css.slice(i + read[0].length, close);
            const fallback = inside.startsWith(',') ? inside.slice(1).replace(/\s+/g, ' ').trim() : '';
            if (fallback !== '' && !entry.defaults.includes(fallback)) entry.defaults.push(fallback);
            // The innermost selector is the rule; an at-rule prelude
            // (`@media …`) is a condition, not a component.
            const selector = [...stack].reverse().find((s) => s !== '' && !s.startsWith('@')) ?? '';
            if (selector !== '' && !entry.selectors.includes(selector)) entry.selectors.push(selector);
            const family = familyOf(selector);
            if (family && !entry.families.includes(family)) entry.families.push(family);
            prelude += read[0];
            i += read[0].length;
            continue;
        }

        const declared = /^(--kp-[a-z0-9-]+)\s*:/.exec(css.slice(i));
        if (declared) {
            knob(declared[1] ?? '').declared = true;
            prelude += declared[0];
            i += declared[0].length;
            continue;
        }

        prelude += ch;
        i++;
    }

    // AR26: the universe is every `--kp-*` the file contains, comments
    // included — a knob mentioned only in a comment is still a knob
    // somebody wrote down, and it has to be accounted for by name.
    for (const match of source.matchAll(/--kp-[a-z0-9-]+/g)) knob(match[0]);

    const all = [...knobs.values()].sort((a, b) => a.name.localeCompare(b.name));
    return {
        knobs: all,
        expected: all.length,
        readCount: all.filter((k) => k.read).length,
        unread: all.filter((k) => !k.read).map((k) => k.name),
    };
}

if (import.meta.url === `file://${process.argv[1]}`) {
    const result = extractKnobs();
    const placed = result.knobs.filter((k) => k.families.length > 0).length;
    const withDefault = result.knobs.filter((k) => k.defaults.length > 0).length;
    console.log(
        `Knobs: ${result.readCount} of ${result.expected} --kp-* custom properties in css/components.css are read through var(), ` +
            `${withDefault} carry a fallback, ${placed} could be placed in a component family.`,
    );
    for (const name of result.unread) console.log(`  never read through var(): ${name}`);
    if (result.expected === 0) {
        console.error('Knobs: none found, which cannot be right.');
        process.exit(1);
    }
}

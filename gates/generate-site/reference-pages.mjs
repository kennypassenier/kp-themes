// The layout and utilities reference pages.

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { escape, section, shell } from '../site/chrome.mjs';
import { FAMILIES } from '../generate-utilities.mjs';
import { ROOT, UTILITY_COUNT } from './config.mjs';
/** @typedef {import('./types.mjs').Nav} Nav */

/**
 * The layout layer, read out of the stylesheet that ships it.
 *
 * Read from the stylesheet rather than from a prose document: a class
 * renamed in css/layout.css changes this page, where a document would keep
 * its old claim [AR21]. The comment directly above each rule is the
 * explanation printed beside it, and it carries the rule's knob defaults;
 * docs/LAYOUT.md, which used to hold that prose a second time, went at
 * scope-77.
 */
function layoutClasses() {
    const css = readFileSync(join(ROOT, 'css/layout.css'), 'utf8');
    /** @type {{selector: string, comment: string, knobs: string[]}[]} */
    const out = [];
    // Each rule is preceded by the comment that explains it, and every
    // knob it reads is a `var(--kp-…, ` in its body.
    const rule = /(?:\/\* ([^*]*?)\*\/\s*)?^ {4}([.[][^{\n]*?) \{\n([\s\S]*?)^ {4}\}/gm;
    for (const match of css.matchAll(rule)) {
        const [, comment, selector, body] = match;
        const knobs = [...body.matchAll(/var\((--kp-[a-z0-9-]+)/g)].map((m) => m[1]);
        out.push({
            selector: selector.trim(),
            comment: (comment ?? '').replace(/\s+/g, ' ').trim(),
            knobs: [...new Set(knobs)],
        });
    }
    return out;
}

/** @param {Nav} nav */
export function layoutPage(nav) {
    const classes = layoutClasses();
    const knobs = [...new Set(classes.flatMap((c) => c.knobs))].sort();
    const rows = classes
        .map(
            (c) =>
                `                            <tr><td><code>${escape(c.selector)}</code></td><td>${escape(c.comment)}</td><td>${c.knobs.map((k) => `<code>${escape(k)}</code>`).join(', ') || '—'}</td></tr>`,
        )
        .join('\n');
    return shell({
        title: 'Layout layer',
        description: 'The layout classes, what each one is for, and the knobs it reads.',
        depth: 1,
        nav,
        current: 'site/layout.html',
        body: [
            `                <header class="kp-section">
                    <h1 class="kp-fw-bold">Layout layer</h1>
                    <p class="kp-prose">Classes for the shape of a page, in the cascade layer after the components, so a layout class wins on a component that sets the same property itself. Every value reads a knob whose default is the theme spacing scale.</p>
                </header>`,
            section(
                'classes',
                `The ${classes.length} rules`,
                `                    <div class="sc-example__live"><table class="kp-table"><thead><tr><th>Selector</th><th>What it is for</th><th>Knobs</th></tr></thead><tbody>\n${rows}\n                    </tbody></table></div>`,
            ),
            section(
                'knobs',
                `The ${knobs.length} knobs`,
                `                    <p class="kp-prose">Set any of these on a page, a theme or a single element. Each falls back to the scale.</p>
                    <ul class="kp-row kp-gap-sm">\n${knobs.map((k) => `                        <li><code>${escape(k)}</code></li>`).join('\n')}\n                    </ul>`,
            ),
        ].join('\n'),
    });
}

/** The utility API, read out of the generator that writes it [AR21]. */
/** @param {Nav} nav */
export function utilitiesPage(nav) {
    const families = FAMILIES.map((family) => {
        const rows = family
            .classes()
            .map(
                (entry) =>
                    `                            <tr><td><code>.${escape(String(entry[0]))}</code></td><td><code>${escape(entry[1].map(([prop, value]) => `${prop}: ${value}`).join('; '))}</code></td></tr>`,
            )
            .join('\n');
        return section(
            family.id,
            family.title,
            `                    <p class="kp-prose">${escape(family.note)}</p>
                    <div class="sc-example__live"><table class="kp-table"><thead><tr><th>Class</th><th>What it sets</th></tr></thead><tbody>\n${rows}\n                    </tbody></table></div>`,
        );
    }).join('\n');
    return shell({
        title: 'Utility API',
        description: 'Every generated utility class and the declaration it carries.',
        depth: 1,
        nav,
        current: 'site/utilities.html',
        body: [
            `                <header class="kp-section">
                    <h1 class="kp-fw-bold">Utility API</h1>
                    <p class="kp-prose">${UTILITY_COUNT} single-purpose classes in the last cascade layer, so a utility beats a component value without an override. There are no breakpoint variants; the layout containers do responsive work instead.</p>
                </header>`,
            families,
        ].join('\n'),
    });
}

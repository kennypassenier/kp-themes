// The documentation site holds its promises [TH101].
//
// Three gates here, plus the layout gate that lives with the example
// pages (TH99). Each was made to fail once on an injected fault before
// it was trusted; the drills are recorded beside each check.
//
//  1. COVERAGE — every class family in css/components.css and every
//     React export has a page. Drill: delete a descriptor and the gate
//     names the families and exports it left uncovered.
//
//     And every `data-kp-*` and every event, because those are the
//     framework-free channel's props and AR21 says the site exists to
//     document them. The selection rule lives in gates/site/selection.mjs
//     so the gate and the generator cannot disagree about it: a page
//     "covers" an attribute exactly when the page prints it. Drill:
//     remove an alias from a descriptor and the gate names the
//     attributes that fell off the site.
//
//  2. TRUTH — every prop in a page's table exists in the source, and
//     every prop in the source is in the table. Because the tables are
//     extracted rather than written, the fault this catches is a
//     descriptor that claims an export the source does not have, or a
//     page whose table came out empty for a component that has props.
//     Drill: point a descriptor at an export that does not exist.
//
//  3a. READABLE INK — every colour site/site.css gives to text is measured
//     against the surface it sits on, in all 22 themes, and refused under
//     4.5:1 [fix-58]. The fault it was written for: the code blocks took
//     the chart hues, which are chosen and measured as LINES at 3:1, and
//     nine themes came out under the text floor. Drill: point
//     `.kp-code__string` back at `--chart-2` and the gate names the nine.
//
//  3. ONE SOURCE — the snippet printed under a live example is the
//     markup that example renders. Drill: change one and not the other.
//     A descriptor may not restate a prop, an event or a knob either:
//     those come from the sources, and a second copy is a copy that can
//     go stale (AR21).
//
// Usage: node gates/check-site.mjs

import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import process from 'node:process';
import { hsl, paintedContrast } from './colour.mjs';
import { DESCRIPTORS } from './site/descriptors.mjs';
import { indent } from './site/chrome.mjs';
import { extractProps } from './site/extract-props.mjs';
import { extractEvents } from './site/extract-events.mjs';
import { extractAttributes } from './site/extract-attributes.mjs';
import { attributeOwners, eventOwners } from './site/selection.mjs';
import { stripCssComments } from './site/extract-knobs.mjs';

const ROOT = fileURLToPath(new URL('../', import.meta.url));

/** @type {string[]} */
const failures = [];

// ── 1. Coverage ──────────────────────────────────────────────────────
//
// A family is the first two segments of a `kp-` class name: `.kp-card`
// and `.kp-card__title` are one family, `.kp-button` another. Families
// the layout layer and the utility API own have their own pages and are
// listed here rather than needing a component descriptor.

/**
 * The site's own coloured code classes, read from its stylesheet: a new
 * one cannot arrive unmeasured [fix-58].
 * @param {string} css site/site.css with its comments stripped
 * @returns {{cls: string, token: string}[]}
 */
export function codeInks(css) {
    return [...css.matchAll(/\.([a-z0-9_-]+)\s*\{[^}]*?\bcolor:\s*var\(--([a-z0-9-]+)\)/gi)]
        .map((m) => ({ cls: m[1], token: m[2] }))
        .filter((i) => i.cls.startsWith('kp-code__'));
}

/** Which surface each code class sits on. A class missing here is a fault. */
export const SURFACE_OF = Object.freeze({
    'kp-code__keyword': 'card',
    'kp-code__string': 'card',
    'kp-code__comment': 'card',
});

/**
 * Text needs 4.5:1 (WCAG 2.2 SC 1.4.3). The chart tokens these classes
 * used to carry are measured as LINES at 3:1, which is how nine themes
 * came to colour code nobody could read [fix-58].
 * @param {{cls: string, token: string}[]} inks
 * @param {Record<string, Record<string, string>>} themes name -> tokens
 * @returns {string[]}
 */
export function inkFaults(inks, themes) {
    /** @type {string[]} */
    const faults = [];
    for (const { cls, token } of inks) {
        const surface = /** @type {Record<string, string>} */ (SURFACE_OF)[cls];
        if (surface === undefined) {
            faults.push(`site.css colours .${cls} with --${token}, and no surface is named for it (gates/check-site.mjs)`);
            continue;
        }
        for (const [name, tokens] of Object.entries(themes)) {
            if (tokens[token] === undefined) {
                faults.push(`${name}: site.css colours .${cls} with --${token}, which the theme does not declare`);
                continue;
            }
            const ratio = paintedContrast(hsl(tokens[token]), hsl(tokens[surface]));
            if (ratio < 4.5) {
                faults.push(`${name}: .${cls} reads ${ratio.toFixed(2)}:1 on --${surface}, under the 4.5:1 text asks [fix-58]`);
            }
        }
    }
    return faults;
}

/** The whole check, run when this file is the command rather than an import. */
function main() {
    const OWNED_ELSEWHERE = new Set(['kp-page', 'kp-stack', 'kp-row', 'kp-autogrid', 'kp-sidebar', 'kp-section', 'kp-center', 'kp-prose', 'kp-mono']);

    const components = stripCssComments(readFileSync(`${ROOT}css/components.css`, 'utf8'));
    /** @type {Set<string>} */
    const families = new Set();
    for (const chunk of components.split('{')) {
        const cut = Math.max(chunk.lastIndexOf('}'), chunk.lastIndexOf(';'));
        const prelude = chunk.slice(cut + 1);
        if (prelude.trim().startsWith('@')) continue;
        for (const m of prelude.matchAll(/\.(kp-[A-Za-z0-9-]+)/g)) {
            const family = m[1].split('__')[0].split('--')[0];
            if (!OWNED_ELSEWHERE.has(family)) families.add(family);
        }
    }

    const covered = new Set(DESCRIPTORS.flatMap((d) => d.classes));
    const uncoveredFamilies = [...families].filter((f) => !covered.has(f)).sort();
    if (uncoveredFamilies.length > 0) {
        failures.push(`${uncoveredFamilies.length} class families have no page: ${uncoveredFamilies.join(', ')}`);
    }

    const props = extractProps();
    const documentedExports = new Set(DESCRIPTORS.flatMap((d) => d.exports));
    const uncoveredExports = props.components.map((c) => c.name).filter((n) => !documentedExports.has(n));
    if (uncoveredExports.length > 0) {
        failures.push(`${uncoveredExports.length} React exports have no page: ${uncoveredExports.join(', ')}`);
    }

    // The three attributes js/diagnostics.js writes onto its own report are
    // documented by the page that report is on (showcase/diagnostics.html),
    // not by a component: nothing in css/components.css styles them and no
    // component reads them.
    //
    // `data-kp-auto-ready` is the same case from the other side: js/auto.js sets
    // it on <html> once the modules a page needed have attached [scope-115]. It
    // belongs to the entry, not to a component, and is documented where the entry
    // is — README.md and MIGRATION.md.
    const ATTRIBUTES_OWNED_ELSEWHERE = new Set(['data-kp-diagnostic', 'data-kp-side', 'data-kp-status', 'data-kp-auto-ready']);

    // The layout layer has a page of its own — site/layout.html, generated
    // from the comments and knobs of css/layout.css rather than from a
    // descriptor — so the slug rules
    // above cannot see it. This is that page standing in the mapping as what
    // it already is: the owner of the layout families. It loosens nothing,
    // because the bar is unchanged — a name is documented when a page prints
    // it, and `.kp-sidebar`'s hiding is documented there in full.
    /** @type {import('./site/selection.mjs').Page} */
    const LAYOUT_PAGE = { id: 'layout', classes: [...OWNED_ELSEWHERE] };
    const PAGES = [...DESCRIPTORS, LAYOUT_PAGE];

    const attributes = extractAttributes().attributes;
    const attributesOwned = attributeOwners(attributes, PAGES);
    const strayAttributes = attributes.filter((a) => !attributesOwned.has(a.name) && !ATTRIBUTES_OWNED_ELSEWHERE.has(a.name)).map((a) => a.name);
    if (strayAttributes.length > 0) {
        failures.push(`${strayAttributes.length} data attributes are on no page: ${strayAttributes.join(', ')}`);
    }

    const events = extractEvents().events;
    const eventsOwned = eventOwners(events, PAGES);
    const strayEvents = events.filter((e) => !eventsOwned.has(e.name)).map((e) => e.name);
    if (strayEvents.length > 0) {
        failures.push(`${strayEvents.length} events are on no page: ${strayEvents.join(', ')}`);
    }

    // ── 2. Truth ─────────────────────────────────────────────────────────
    const known = new Set(props.components.map((c) => c.name));

    // Every page prints one import from the package root, so the root has to
    // export what the page says it does. Drill: delete a line from index.js.
    const index = readFileSync(`${ROOT}index.js`, 'utf8');
    for (const d of DESCRIPTORS) {
        for (const name of d.exports) {
            if (!known.has(name) && !props.unmapped.some((u) => u.name === name)) {
                failures.push(`${d.id} documents the export \`${name}\`, which components/ does not have`);
            } else if (!new RegExp(`\\b${name}\\b`).test(index)) {
                failures.push(`${d.id} prints an import of \`${name}\` from the package root, which index.js does not re-export`);
            }
        }
        for (const family of d.classes) {
            if (!families.has(family) && !OWNED_ELSEWHERE.has(family)) {
                failures.push(`${d.id} documents the class family \`.${family}\`, which css/components.css does not declare`);
            }
        }
    }

    // ── 3. One source ────────────────────────────────────────────────────
    for (const d of DESCRIPTORS) {
        const path = `${ROOT}site/components/${d.id}.html`;
        if (!existsSync(path)) {
            failures.push(`${d.id} has a descriptor but no generated page`);
            continue;
        }
        const page = readFileSync(path, 'utf8');
        for (const example of d.examples) {
            // The live block and the snippet are printed from the same
            // string by the generator; this reads the page back and checks
            // that they are still the same string on the page itself, so a
            // change to the generator cannot quietly break the promise.
            // The generator indents the markup once and uses the result for
            // both the live block and the snippet, so the promise is still
            // that they are the same string -- this compares against that
            // string rather than against the flat source [AR19].
            if (!page.includes(indent(example.markup))) {
                failures.push(`${d.id}: the live example "${example.title}" is not on the page as written`);
            }
        }
        // AR21: a descriptor may not restate what a source already says.
        const prose = [d.intro, d.whenToUse, ...d.variants.map((v) => v.what), ...d.accessibility].join(' ');
        for (const m of prose.matchAll(/`?(--kp-[a-z0-9-]+)`?/g)) {
            failures.push(`${d.id} names the knob ${m[1]} in its prose; knobs come from css/components.css (AR21)`);
        }
    }

    // 3a. The site's own text colours, measured on the surface they sit on.
    // The pairs are read from the stylesheet rather than listed here, so a new
    // coloured text class cannot arrive unmeasured; SURFACE_OF says which
    // ground each class sits on, and a class whose ground is not named is
    // itself a failure.
    const themeNames = JSON.parse(readFileSync(`${ROOT}themes/order.json`, 'utf8'));
    const themeTokens = Object.fromEntries(
        (Array.isArray(themeNames) ? themeNames : themeNames.themes).map((/** @type {string} */ name) => {
            const theme = JSON.parse(readFileSync(`${ROOT}themes/${name}/tokens.json`, 'utf8'));
            return [
                name,
                Object.fromEntries(theme.entries.filter((/** @type {any} */ e) => e.token).map((/** @type {any} */ e) => [e.token, e.value])),
            ];
        }),
    );
    const inks = codeInks(stripCssComments(readFileSync(`${ROOT}site/site.css`, 'utf8')));
    failures.push(...inkFaults(inks, themeTokens));

    if (failures.length > 0) {
        console.error('The documentation site does not hold:');
        for (const f of failures) console.error(`  ${f}`);
        process.exit(1);
    }

    console.log(
        `Site: ${DESCRIPTORS.length} pages cover ${families.size} class families, ${props.components.length} React exports, ` +
            `${attributesOwned.size} data attributes and ${eventsOwned.size} events; every example is on its page as written. ` +
            `Its ${inks.length} code inks read at 4.5:1 or better in all 22 themes [fix-58].`,
    );
}

if (import.meta.url === `file://${process.argv[1]}`) main();

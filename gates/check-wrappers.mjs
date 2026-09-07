// A converted component sits inside a wrapper that establishes its
// container [TH104, AR31, AR26].
//
// AR31 refused the runtime warning the draft asked for, and this is what
// replaced it. The warning had nowhere to live and reached nobody:
// `kp-nav` appears in zero JavaScript files — the navigation bar is CSS
// plus server-rendered markup, there is no attach function — and
// `chassis.js` calls four attach functions, of which `attachGrids` and
// `attachAll` are neither. It would also have been depth-blind: a
// container query binds to the NEAREST container at any depth, so a
// consumer who put `container-type` on `.kp-page` would have got a
// correct layout and a warning, on every page load, forever.
//
// So the evidence moves to where it can be measured: this package's own
// pages. A page here that draws a converted component without a wrapper
// is a page shipping the wide form in every box, and it is also the
// example a consumer copies.
//
// AR26 — what this expects to check comes from the SOURCE. The container
// names, and the classes that establish them, are read out of
// `css/components.css`: every `@container NAME (…)` block and every
// `container: NAME / inline-size` declaration. A conversion that arrives
// without an entry in REQUIRED below is a failure of its own, so a new
// `@container` name cannot quietly fall outside this check.
//
// Drilled red once, 2026-09-07 (rule 7d):
//
//   missing-wrapper — the `.kp-nav-wrap` div removed from the NavBar
//                     entry of showcase/examples.mjs and the example
//                     pages regenerated: ten findings, one per page that
//                     draws a bar, each naming line 15, where the <nav>
//                     opens.
//   unlisted        — `@container kp-card (max-width: 20rem)` added to
//                     css/components.css: "the stylesheet queries a
//                     container named `kp-card`, and REQUIRED says
//                     nothing about it".
//
// Both restored, and the gate green again over 65 components on 82
// pages.
//
// Usage: node gates/check-wrappers.mjs

import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import process from 'node:process';

const ROOT = fileURLToPath(new URL('../', import.meta.url));

/**
 * What a container name means for the markup on a page: which element
 * has to be inside the wrapper, and why it is that element.
 *
 * The list is here rather than derived, because no stylesheet says which
 * ELEMENT a consumer writes — only which selectors a query affects, and
 * those are descendants of the thing that matters. It is held honest
 * from the other side: a container name the stylesheet queries and this
 * list does not name is a failure.
 *
 * @type {Array<{ container: string, class: string, attribute?: string, why: string }>}
 */
export const REQUIRED = [
    {
        container: 'kp-grid',
        class: 'kp-grid',
        why: 'The query changes `grid-template-columns` on `.kp-grid` itself, so the container has to be one element up [TH104].',
    },
    {
        container: 'kp-nav',
        class: 'kp-nav',
        why: 'The query changes the bar’s own inline padding, so the container has to be one element up [TH104].',
    },
    {
        container: 'kp-table',
        class: 'kp-table',
        attribute: 'data-kp-cards',
        // A plain table without the attribute asks for nothing: the card
        // layout is opt-in, so only a table that opted in needs a
        // container to opt in against [TH96].
        why: 'A table that asked for the card layout needs the width of its own box to decide, and the query rewrites the table itself [TH96].',
    },
];

/** Page sets this gate reads. The site is included because it renders the components live, not only as escaped snippets. */
const PAGE_SETS = ['examples', 'showcase', 'showcase/themes', 'site', 'site/components'];

/** Elements HTML closes for you: they open and close on the same tag. */
const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);

/** Elements whose contents are raw text rather than markup. */
const RAW = new Set(['script', 'style']);

/**
 * Container names the stylesheet actually queries.
 * @param {string} css
 * @returns {Set<string>}
 */
export function queried(css) {
    return new Set([...css.matchAll(/@container\s+([A-Za-z][\w-]*)\s*\(/g)].map((m) => m[1]));
}

/**
 * Which classes establish which named container: `.x { container: NAME /
 * inline-size }`. More than one class may establish the same name — the
 * nearest one wins at runtime, and any of them satisfies this check.
 *
 * @param {string} css
 * @returns {Map<string, string[]>}
 */
export function establishers(css) {
    /** @type {Map<string, string[]>} */
    const found = new Map();
    // Split on `{` and read the prelude before each block, the same way
    // check-migration.mjs reads declared class names.
    const clean = css.replaceAll(/\/\*[\s\S]*?\*\//g, '');
    const blocks = clean.split('{');
    for (let i = 1; i < blocks.length; i += 1) {
        const body = blocks[i].split('}')[0];
        const match = body.match(/(?:^|;)\s*container(?:-name)?\s*:\s*([A-Za-z][\w-]*)/);
        if (match === null) continue;
        const prelude = blocks[i - 1].slice(Math.max(blocks[i - 1].lastIndexOf('}'), blocks[i - 1].lastIndexOf(';')) + 1);
        for (const m of prelude.matchAll(/\.(kp-[A-Za-z0-9_-]+)/g)) {
            const list = found.get(match[1]) ?? [];
            if (!list.includes(m[1])) list.push(m[1]);
            found.set(match[1], list);
        }
    }
    return found;
}

/** The class list and the attribute names of one start tag. @param {string} tag */
function attributesOf(tag) {
    const classes = new Set((tag.match(/\sclass\s*=\s*"([^"]*)"/)?.[1] ?? '').split(/\s+/).filter(Boolean));
    const attributes = new Set([...tag.matchAll(/\s([A-Za-z_:][-\w:.]*)(?=[\s/>=])/g)].map((m) => m[1].toLowerCase()));
    return { classes, attributes };
}

/**
 * Every converted component a page draws, and whether it sits inside a
 * wrapper that establishes its container.
 *
 * The walk keeps a stack of the class lists of the elements still open,
 * so "inside a wrapper" is answered by ancestry rather than by proximity
 * in the text. The element itself does not count: a container query
 * styles a container's contents, never the container.
 *
 * @param {string} html
 * @param {Array<{ container: string, class: string, attribute?: string, why: string }>} required
 * @param {Map<string, string[]>} wrappers
 * @returns {Array<{ line: number, class: string, container: string, wrappers: string[], wrapped: boolean }>}
 */
export function drawn(html, required, wrappers) {
    /** @type {Array<{ line: number, class: string, container: string, wrappers: string[], wrapped: boolean }>} */
    const found = [];
    /** @type {Set<string>[]} */
    const stack = [];
    /** @type {string | null} */
    let raw = null;

    for (const match of html.matchAll(/<(\/?)([a-zA-Z][a-zA-Z0-9-]*)((?:"[^"]*"|'[^']*'|[^>"'])*?)(\/?)>/g)) {
        const [, closing, rawName, attributes, selfClosing] = match;
        const name = rawName.toLowerCase();
        if (raw !== null) {
            if (closing && name === raw) raw = null;
            continue;
        }
        if (closing) {
            stack.pop();
            continue;
        }
        if (RAW.has(name)) {
            raw = name;
            continue;
        }
        if (selfClosing !== '' || VOID.has(name)) continue;

        const { classes, attributes: names } = attributesOf(` ${attributes} `);
        for (const entry of required) {
            if (!classes.has(entry.class)) continue;
            if (entry.attribute !== undefined && !names.has(entry.attribute)) continue;
            const allowed = wrappers.get(entry.container) ?? [];
            found.push({
                line: html.slice(0, match.index).split('\n').length,
                class: entry.class,
                container: entry.container,
                wrappers: allowed,
                wrapped: stack.some((ancestor) => allowed.some((cls) => ancestor.has(cls))),
            });
        }
        stack.push(classes);
    }
    return found;
}

if (import.meta.url === `file://${process.argv[1]}`) {
    const css = readFileSync(`${ROOT}css/components.css`, 'utf8');
    const wrappers = establishers(css);
    const names = queried(css);

    /** @type {string[]} */
    const failures = [];

    // AR26 from the other side: the stylesheet decides what has to be
    // checked, and a conversion arriving without an entry here is the
    // failure. This is what stops a future `@container` name from being
    // outside the gate by accident.
    for (const name of names) {
        if (!REQUIRED.some((entry) => entry.container === name)) {
            failures.push(`[unlisted] the stylesheet queries a container named \`${name}\`, and REQUIRED says nothing about it.`);
        }
    }
    for (const entry of REQUIRED) {
        if (!names.has(entry.container)) {
            failures.push(`[stale] REQUIRED names \`${entry.container}\`, and no @container block queries it any more — remove the entry.`);
        }
        if ((wrappers.get(entry.container) ?? []).length === 0) {
            failures.push(`[stale] nothing in css/components.css establishes a container named \`${entry.container}\`.`);
        }
        if (entry.why.trim().length < 40) failures.push(`[stale] the entry for \`${entry.container}\` carries no real reason.`);
    }

    /** @type {string[]} */
    const pages = [];
    for (const set of PAGE_SETS) {
        for (const file of readdirSync(`${ROOT}${set}`)) {
            if (file.endsWith('.html')) pages.push(`${set}/${file}`);
        }
    }

    let components = 0;
    for (const page of pages) {
        const html = readFileSync(ROOT + page, 'utf8');
        for (const finding of drawn(html, REQUIRED, wrappers)) {
            components += 1;
            if (finding.wrapped) continue;
            failures.push(
                `[missing-wrapper] ${page}:${finding.line} — \`.${finding.class}\` with no ancestor establishing the \`${finding.container}\` ` +
                    `container. Wrap it in ${finding.wrappers.map((w) => `\`.${w}\``).join(' or ')}.`,
            );
        }
    }

    // AR26: the number this expected to check, and it comes from the
    // pages themselves rather than from a constant. A generator that
    // stopped drawing the components altogether would otherwise pass.
    if (components === 0) failures.push('[stale] no converted component was found on any page — this gate checked nothing.');

    if (failures.length > 0) {
        for (const failure of failures) console.error(failure);
        console.error(`\n${failures.length} wrapper violation(s) over ${pages.length} pages.`);
        process.exit(1);
    }
    console.log(
        `Wrappers: ${components} converted component(s) over ${pages.length} example, showcase and site pages ` +
            `(${[...names].sort().join(', ')}) all sit inside a container that carries them.`,
    );
}

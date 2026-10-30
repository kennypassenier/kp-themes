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

import process from 'node:process';
import { readFileSync, readdirSync } from 'node:fs';
import { PAGE_SETS, ROOT } from './check-wrappers/config.mjs';
import { establishers, queried } from './check-wrappers/css-scan.mjs';
import { REQUIRED } from './check-wrappers/required.mjs';
import { drawn } from './check-wrappers/html-scan.mjs';

export { REQUIRED } from './check-wrappers/required.mjs';
export { queried, establishers } from './check-wrappers/css-scan.mjs';
export { drawn } from './check-wrappers/html-scan.mjs';

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
        if (entry.self && !(wrappers.get(entry.container) ?? []).includes(entry.class)) {
            failures.push(`[stale] \`${entry.container}\` is listed as the own container of \`.${entry.class}\`, which does not establish it.`);
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

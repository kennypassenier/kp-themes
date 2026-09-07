// The utility API holds its promises [TH93, AR23].
//
// Three checks, all of them able to fail:
//
//  1. The generated stylesheet and the hand-written list in
//     docs/UTILITIES.md name the same classes, in both directions. The
//     list is written by hand precisely so this can go red; a generated
//     list compared against a generated stylesheet measures nothing.
//
//  2. No generated name collides with a class the package already
//     declares by hand. `.kp-grid` was already the dashboard grid, which
//     is why the display utility is `.kp-d-grid`. The number of existing
//     names is printed, because a collision check that silently compares
//     against an empty set passes forever.
//
//  3. Every generated class appears exactly once in the stylesheet, and
//     the stylesheet declares nothing outside `@layer kp.utilities`.
//
// Usage: node gates/check-utilities.mjs

import { readFileSync } from 'node:fs';
import process from 'node:process';
import { names } from './generate-utilities.mjs';

/** @param {string} rel */
const read = (rel) => readFileSync(new URL(rel, import.meta.url), 'utf8');

/** Class names a stylesheet declares in a selector, `.` stripped. */
/**
 * @param {string} css
 * @returns {Set<string>}
 */
function declared(css) {
    // Comments out first, then split on `{`: every chunk holds a
    // declaration body followed by the next selector prelude, and the
    // prelude is whatever follows the last `}` or `;`. Splitting on `}`
    // instead loses the prelude entirely and reports an empty set --
    // which is how the first version of this gate passed while comparing
    // against nothing.
    const clean = css.replaceAll(/\/\*[\s\S]*?\*\//g, '');
    const found = new Set();
    for (const chunk of clean.split('{')) {
        const cut = Math.max(chunk.lastIndexOf('}'), chunk.lastIndexOf(';'));
        const prelude = chunk.slice(cut + 1);
        if (prelude.trim().startsWith('@')) continue;
        for (const m of prelude.matchAll(/\.(kp-[A-Za-z0-9_-]+)/g)) found.add(m[1]);
    }
    return found;
}

const AUTHORED = [
    '../css/themes.css',
    '../css/components.css',
    '../css/cyberpunk-register.css',
    '../css/retro-register.css',
    '../css/layout.css',
    '../css/tailwind-bridge.css',
];

/** @type {string[]} */
const generated = names();
const failures = [];

// 1 — the documented list
const doc = read('../docs/UTILITIES.md');
const documented = new Set([...doc.matchAll(/`\.(kp-[A-Za-z0-9_-]+)`/g)].map((m) => m[1]));
const undocumented = generated.filter((n) => !documented.has(n));
const phantom = [...documented].filter((n) => !generated.includes(n));
if (undocumented.length > 0) {
    failures.push(`generated but not in docs/UTILITIES.md: ${undocumented.join(', ')}`);
}
if (phantom.length > 0) {
    failures.push(`in docs/UTILITIES.md but not generated: ${phantom.join(', ')}`);
}

// 2 — collisions with what the package already declares by hand
const existing = new Set();
for (const rel of AUTHORED) for (const n of declared(read(rel))) existing.add(n);
const collisions = generated.filter((n) => existing.has(n));
if (collisions.length > 0) {
    failures.push(`a utility name is already declared by hand: ${collisions.join(', ')}`);
}

// 3 — the stylesheet itself
const css = read('../css/utilities.css');
if (!css.includes('@layer kp.utilities {')) {
    failures.push('css/utilities.css does not open @layer kp.utilities');
}
const inSheet = declared(css);
for (const n of generated) {
    const count = [...css.matchAll(new RegExp(`\\.${n}\\s*\\{`, 'g'))].length;
    if (count !== 1) failures.push(`.${n} is declared ${count} times in css/utilities.css`);
}
for (const n of inSheet) {
    if (!generated.includes(n)) failures.push(`.${n} is in css/utilities.css but not in the source`);
}

if (failures.length > 0) {
    console.error('The utility API does not hold:');
    for (const f of failures) console.error(`  ${f}`);
    process.exit(1);
}

console.log(
    `Utilities: ${generated.length} generated classes, all documented, none colliding with the ${existing.size} class names the package declares by hand.`,
);

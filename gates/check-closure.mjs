// The import closure of the vendored modules stays exactly the vendored
// modules [AR28, W1, round five's Phase 5 gate H1].
//
// chassis-rs does not consume this package over npm. It bakes eight of
// our files into a Rust binary with `include_bytes!` and serves them
// under a content hash: `css/themes.css`, `css/components.css` and the
// six JavaScript modules below. Their own gate checks that the eight
// copies match our release manifest byte-for-byte — which says nothing
// at all about whether those eight are enough to RUN.
//
// They are enough only because the six are closed under import. Add one
// edge from `js/components.js` to `js/overlays.js` and `/static/kp/overlays.js`
// is a 404, the module graph fails, and their whole `chassis.js` dies:
// the theme picker, the contract enforcer, the confirmations and the
// skip links with it. Nothing on their side would go red, because their
// gate checks the files they copied rather than the closure those files
// need. That is R4-LOCALE one round later with an empty dashboard
// instead of hand-written CSS.
//
// So the check lives here, where the edge is added. It is the reason
// AR28 writes the confirmation dialog into `js/components.js` rather
// than importing it from `js/overlays.js`, and without this gate that
// decision survives exactly as long as somebody remembers it.
//
// The set is derivable from this repository alone (standing rule 35: a
// gate may not depend on a path to a sibling project). `js/auto.js`
// names every attach function; chassis.js calls four of them —
// `enforceContracts`, `attachConfirmations`, `attachSkipLinks` and
// `attachThemePickers` — plus `applyStoredTheme` for the no-flash boot.
// Those live in `js/components.js`, `js/theme-picker.js` and
// `js/no-flash.js`, and their closure adds `js/theme-core.js`,
// `js/theme-registry.js` and `js/strings.js`. Six, and the gate proves
// the closure is still exactly six rather than trusting the sentence.
//
// Drilled red before it was trusted (standing rule 7d), twice:
//   1. `import { toast } from './overlays.js'` added to js/components.js
//      — the exact edge AR28 refuses. Reported
//      `js/components.js → js/overlays.js`, exit 1.
//   2. `import { createRoot } from 'react-dom/client'` added to
//      js/theme-picker.js — a bare specifier, which cannot resolve from a
//      directory of static files at all. Reported
//      `js/theme-picker.js → react-dom/client`, exit 1.
//
// Usage: node gates/check-closure.mjs

import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, normalize, relative } from 'node:path';
import process from 'node:process';

const ROOT = fileURLToPath(new URL('../', import.meta.url));

/**
 * The six JavaScript modules chassis-rs bakes into its binary.
 *
 * A file leaves this list only when chassis-rs stops vendoring it, and
 * joins it only when they start — it is a record of somebody else's
 * build, not a preference of ours.
 */
export const VENDORED = [
    // applyStoredTheme(), the no-flash boot.
    'js/no-flash.js',
    // The theme names, the storage key and the version constant.
    'js/theme-registry.js',
    // applyTheme(), currentTheme(), the change event.
    'js/theme-core.js',
    // attachThemePickers().
    'js/theme-picker.js',
    // Every user-visible string, which every module above reads [KT5].
    'js/strings.js',
    // enforceContracts(), attachConfirmations(), attachSkipLinks().
    'js/components.js',
];

/** A static import or re-export specifier, and the dynamic form. */
const SPECIFIER = /(?:^|\n)\s*(?:import|export)[\s\S]*?from\s*['"]([^'"]+)['"]|\bimport\(\s*['"]([^'"]+)['"]\s*\)/g;

/**
 * Every module specifier `source` imports, in source order.
 *
 * @param {string} source
 * @returns {string[]}
 */
export function specifiers(source) {
    const masked = source
        .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '))
        .replace(/(^|[^:])\/\/[^\n]*/g, (m) => m.replace(/[^\n]/g, ' '));
    /** @type {string[]} */
    const out = [];
    for (const match of masked.matchAll(SPECIFIER)) {
        const found = match[1] ?? match[2];
        if (found !== undefined) out.push(found);
    }
    return out;
}

/**
 * Walk the import graph from `entries` and report every file reached.
 *
 * @param {string[]} entries paths relative to the package root
 * @param {(file: string) => string} read
 * @returns {{ reached: Map<string, string[]>, missing: string[] }} each file with the chain that reached it
 */
export function closure(entries, read) {
    /** @type {Map<string, string[]>} */
    const reached = new Map();
    /** @type {string[]} */
    const missing = [];
    /** @type {{ file: string, chain: string[] }[]} */
    const queue = entries.map((file) => ({ file, chain: [file] }));

    while (queue.length > 0) {
        const { file, chain } = /** @type {{ file: string, chain: string[] }} */ (queue.shift());
        if (reached.has(file)) continue;
        reached.set(file, chain);
        /** @type {string} */
        let source;
        try {
            source = read(file);
        } catch {
            missing.push(file);
            continue;
        }
        for (const specifier of specifiers(source)) {
            // A bare specifier cannot resolve at all from a directory of
            // static files, which is how the vendored copies are served.
            const next = specifier.startsWith('.') ? normalize(join(dirname(file), specifier)) : specifier;
            queue.push({ file: next, chain: [...chain, next] });
        }
    }
    return { reached, missing };
}

if (import.meta.url === `file://${process.argv[1]}`) {
    const read = (/** @type {string} */ file) => {
        const path = join(ROOT, file);
        if (!existsSync(path) || relative(ROOT, path).startsWith('..')) throw new Error(file);
        return readFileSync(path, 'utf8');
    };

    const vendored = new Set(VENDORED);
    const { reached, missing } = closure(VENDORED, read);

    let failed = 0;
    for (const file of VENDORED) {
        if (!existsSync(join(ROOT, file))) {
            failed++;
            console.error(`${file} is on the vendored list and does not exist.`);
        }
    }
    for (const [file, chain] of reached) {
        if (vendored.has(file)) continue;
        failed++;
        console.error(
            `${file} is outside the set chassis-rs bakes in, and the vendored modules reach it:\n` +
                `  ${chain.join(' → ')}\n` +
                `  Serving the vendored copies alone would 404 on it and take the whole module graph down (AR28).`,
        );
    }
    for (const file of missing) {
        // Anything outside the set was already reported above with its
        // chain; what is left is a vendored file that has gone.
        if (!vendored.has(file)) continue;
        failed++;
        console.error(`${file} is on the vendored list and cannot be read: ${(reached.get(file) ?? [file]).join(' → ')}`);
    }

    if (failed > 0) {
        console.error(`\n${failed} import(s) outside the vendored closure.`);
        process.exit(1);
    }
    console.log(`Closure: the ${VENDORED.length} vendored modules import nothing outside themselves (AR28).`);
}

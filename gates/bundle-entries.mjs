// The entries of the split bundle in dist/js/, derived from the package's own export map [entries-1102].
//
// Every `./js/<name>` export of package.json whose file is a facade `js/<module>.js` gets a stable, unhashed
// entry `dist/js/<name>.js` beside the three that were always there (auto, core, lazy-register are among them:
// `./js/core` is js/theme-core.js). A component added to the export map therefore gets its entry on the next
// `npm run generate:bundle`, with its types and its `./dist/js/<name>` export; nothing here is a list to keep.
//
// The entries share the chunks of auto.js and of each other, so a page that imports `toast` from
// dist/js/overlays.js and `applyTheme` from dist/js/core.js holds one state instance and loads only what those
// two modules import, where dist/js/index.js loads every module.

import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/** A facade the bundle can build: `./js/<module>.js`, never a minified twin. */
const FACADE = /^\.\/js\/[a-z-]+\.js$/;

/** @param {unknown} entry an export's value: a path, or `{ types, default }` */
const defaultOf = (entry) => (typeof entry === 'string' ? entry : /** @type {{default?: string}} */ (entry)?.default);

/**
 * @param {string} root
 * @returns {Record<string, any>} the package.json
 */
export function readPackage(root) {
    return JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
}

/**
 * The entries of the split bundle: the published name under dist/js/ and the module it is.
 * @param {Record<string, any>} pkg package.json
 * @returns {{ out: string, module: string }[]} sorted by name
 */
export function entriesOf(pkg) {
    /** @type {{ out: string, module: string }[]} */
    const out = [];
    for (const [key, entry] of Object.entries(pkg.exports ?? {})) {
        const target = defaultOf(entry);
        if (!key.startsWith('./js/') || typeof target !== 'string' || !FACADE.test(target) || target.includes('.min.')) continue;
        out.push({ out: key.slice('./js/'.length), module: target.slice(2) });
    }
    return out.sort((a, b) => a.out.localeCompare(b.out));
}

/** The `./dist/js/<name>` export of one entry. */
const exportFor = (/** @type {string} */ name) => ({ types: `./dist/js/${name}.d.ts`, default: `./dist/js/${name}.js` });

/**
 * The export map with the split bundle's entries as they must be: every derived entry and `index`, in order,
 * where the `./dist/js/<name>` exports stood. Other exports keep their place.
 * @param {Record<string, any>} pkg
 * @returns {Record<string, any>}
 */
export function exportsWithEntries(pkg) {
    const wanted = [...entriesOf(pkg).map((e) => e.out), 'index'];
    const mine = (/** @type {string} */ key) => /^\.\/dist\/js\/[a-z-]+$/.test(key) && key !== './dist/js/min' && /dist\/js\/[a-z-]+\.js$/.test(defaultOf(pkg.exports[key]) ?? '');
    /** @type {Record<string, any>} */
    const next = {};
    let placed = false;
    for (const [key, value] of Object.entries(pkg.exports)) {
        if (mine(key)) {
            if (!placed) for (const name of wanted) next[`./dist/js/${name}`] = exportFor(name);
            placed = true;
            continue;
        }
        next[key] = value;
    }
    if (!placed) throw new Error('package.json has no ./dist/js/<name> export to place the entries at');
    return next;
}

/**
 * Whether package.json's exports carry exactly the split bundle's entries.
 * @param {string} root
 * @returns {boolean}
 */
export function exportsAreCurrent(root) {
    const pkg = readPackage(root);
    return JSON.stringify(exportsWithEntries(pkg)) === JSON.stringify(pkg.exports);
}

/**
 * package.json as it must be written for its exports to carry the entries (the file keeps its four-space layout).
 * @param {string} root
 * @returns {string}
 */
export function packageTextWithEntries(root) {
    const pkg = readPackage(root);
    pkg.exports = exportsWithEntries(pkg);
    return JSON.stringify(pkg, null, 4) + '\n';
}

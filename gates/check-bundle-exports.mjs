// No export name lost against the last release [qty-1103; Medicine Cabinet 03/11].
//
// 12.4.0 shipped without `getQuantity`: js/quantity.js turned its re-export into an import plus a bare `export { … }`,
// the flat-name generator did not see it, and every Medicine Cabinet page failed to load. This gate reads the export
// list of each shipped bundle and refuses a name the last release tag exported and this tree does not. A major version
// above the tag's may remove names on purpose (that is what a breaking release is for), so it then only reports them.
//
// Usage: node gates/check-bundle-exports.mjs

import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import process from 'node:process';

/** The bundles a consumer imports by name. */
export const BUNDLES = ['dist/js/index.js', 'dist/kp-themes.min.js'];

const ROOT = new URL('../', import.meta.url).pathname;

/**
 * The names an esbuild bundle exports: every `export { a as b, c }` list, by the exported name.
 * @param {string} source
 * @returns {Set<string>}
 */
export function exportedNames(source) {
    const names = new Set();
    for (const list of source.matchAll(/export\s*\{([^}]*)\}/g)) {
        for (const item of list[1].split(',')) {
            const name = item.trim().split(/\s+as\s+/).pop()?.trim();
            if (name) names.add(name);
        }
    }
    return names;
}

/** @param {string[]} args @returns {string} */
const git = (args) => execFileSync('git', args, { cwd: ROOT, encoding: 'utf8', maxBuffer: 256 * 1024 * 1024 });

/** The newest release tag reachable from HEAD; throws when there is none, so a clone without tags fails loudly. */
function lastTag() {
    return git(['describe', '--tags', '--abbrev=0', '--match', 'v[0-9]*']).trim();
}

const major = (/** @type {string} */ version) => Number(version.replace(/^v/, '').split('.')[0]);

function main() {
    const tag = lastTag();
    const version = JSON.parse(readFileSync(`${ROOT}package.json`, 'utf8')).version;
    const breaking = major(version) > major(tag);
    let lost = 0;
    for (const bundle of BUNDLES) {
        const before = exportedNames(git(['show', `${tag}:${bundle}`]));
        const now = exportedNames(readFileSync(`${ROOT}${bundle}`, 'utf8'));
        const gone = [...before].filter((name) => !now.has(name)).sort();
        for (const name of gone) console.error(`${bundle}: \`${name}\` was exported by ${tag} and is not any more.`);
        lost += gone.length;
        if (!gone.length) console.log(`Bundle exports: ${bundle} keeps all ${before.size} names of ${tag} (${now.size} now).`);
    }
    if (lost && !breaking) {
        console.error(`${lost} export name(s) lost against ${tag}. Restore them, or raise the major version for a breaking release.`);
        process.exit(1);
    }
    if (lost) console.log(`${lost} name(s) removed in a major release (${version} over ${tag}); allowed.`);
}

main();

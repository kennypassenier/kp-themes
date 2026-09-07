// The checksum manifest holds every file a consumer can copy [TH103, AR26].
//
// SHA256SUMS exists for the consumer who has no npm to verify anything for
// them: kyu and almanac both vendor css/themes.css into a static directory
// by hand. That list was hand-kept, and a hand-kept list of what the
// package offers drifts the moment the package offers something new — by
// 3.1.1 it had missed `js/strings.js`, added in 2.0.0 and the file a
// consumer overriding the dictionary is most likely to copy, and
// `css/retro-register.css`, added in 3.1.0.
//
// So the list is checked against the SOURCE of the truth rather than
// against itself: `exports` in package.json, which is the package's own
// statement of what it offers. AR26: the number this gate expects comes
// from there and never from globbing css/ and js/, which would find
// exactly the files that are there and pass by construction.
//
// **What counts as copyable.** Every concrete export target under `css/`,
// `js/` or `dist/`. `dist/` joined the rule when the bundle arrived at R7:
// it is two more files a consumer copies into a static directory, and
// without the prefix they fell outside the rule silently -- the same
// shape TH103 exists to prevent. Deliberately excluded, each for a
// reason:
//
//   - the subpath patterns (`./components/*`, `./themes/*`, `./fx/*`):
//     a pattern names a directory, and enumerating it means globbing,
//     which AR26 forbids for exactly this number.
//   - the `types` condition of an entry: a `.d.ts` is for a type checker
//     that got the package from npm, and npm verified its own tarball.
//   - `.jsx` files, `index.js`, `hooks/` and `fx/`: the React channel
//     arrives through npm for the same reason. The manifest is for the
//     half a person copies by hand, and that half is the stylesheets and
//     the framework-free modules. The walk stays inside that half too:
//     `fx/when.js` is the same shape as `js/locale.js` -- imported by
//     four `.jsx` effects and exported by nothing -- and it stays out,
//     because nobody vendors `.jsx`.
//   - `./package.json`: npm ships and verifies it whatever we say.
//
// **And what those files import** (R4-LOCALE, 2026-09-07). Being an
// export is not the property that matters -- having to be copied is.
// `js/locale.js` was never an export, yet `js/datepicker.js`,
// `js/datatable.js` and `js/upload.js` all import it, so a consumer
// vendoring the date picker copied a file that broke on its own import.
// The gate therefore walks the import graph from every copyable export
// and expects what it reaches. Measured when the rule changed: from 33
// copyable exports the walk reaches exactly one file that is not itself
// one. Kenny chose this over exporting the file, because a measure that
// fits only the place a fault showed up meets you again somewhere else,
// and this one adds no public name to the package.
//
// A new export under css/ or js/ therefore lands in this gate's expected
// list the moment it is declared, and so does a new file that one of them
// starts importing. The manifest has to grow with either. That is the
// property TH103 asks for: a new file cannot silently fall outside
// again.
//
// **Drilled red three times, 2026-09-06**, and once more when the rule
// grew: `js/strings.js` deleted from FILES; a new export declared and not
// added; a file in FILES that is neither exported nor imported. And on
// 2026-09-07, the walk itself — an export made to import a module nothing
// else reaches, which the gate then demanded by name.
//
// Usage: node gates/check-manifest.mjs

import { readFileSync } from 'node:fs';
import process from 'node:process';
import { FILES } from './checksums.mjs';

/**
 * The export targets a vendoring consumer copies, from `exports` alone.
 *
 * @param {{exports?: Record<string, string | Record<string, string>>}} pkg
 * @param {{follow?: boolean}} [options] follow imports as well (default true)
 * @returns {string[]} repo-relative paths, sorted
 */
export function copyableExports(pkg, { follow = true } = {}) {
    /** @type {Set<string>} */
    const found = new Set();
    for (const [name, entry] of Object.entries(pkg.exports ?? {})) {
        // A pattern is a directory, and a directory is a glob.
        if (name.includes('*')) continue;
        // `default` is the file that runs; `types` is the declaration
        // beside it, which is npm's business and not a vendored file.
        const target = typeof entry === 'string' ? entry : entry.default;
        if (typeof target !== 'string' || target.includes('*')) continue;
        const path = target.replace(/^\.\//, '');
        // `fonts/` joined the rule at round six's C0 (AR39): a shipped face
        // is a file a consumer copies exactly like a stylesheet, and the
        // critic showed this gate REFUSED font files as written.
        if (!/^(css|js|dist|fonts)\//.test(path)) continue;
        if (!/\.(css|js|woff2)$/.test(path)) continue;
        found.add(path);
    }
    if (follow) for (const path of [...found]) reachableFrom(path, found);
    return [...found].sort();
}

/**
 * Add every file `entry` imports, and what those import in turn.
 *
 * A relative import in a module a consumer copies is a file they have to
 * copy with it, whether or not the package calls it an export. Only
 * relative specifiers count: a bare one is a dependency, and this package
 * has none at runtime.
 *
 * @param {string} entry repo-relative path
 * @param {Set<string>} found mutated
 */
function reachableFrom(entry, found) {
    let source;
    try {
        source = readFileSync(new URL(`../${entry}`, import.meta.url), 'utf8');
    } catch {
        return;
    }
    const dir = entry.slice(0, entry.lastIndexOf('/'));
    for (const spec of references(source)) {
        const target = normalise(`${dir}/${spec}`);
        if (!/\.(css|js|woff2)$/.test(target)) continue;
        if (found.has(target)) continue;
        found.add(target);
        reachableFrom(target, found);
    }
}

/**
 * The relative files a source refers to: `import`/`from` specifiers in a
 * module, and `url(…)` references in a stylesheet — `url(../fonts/x.woff2)`
 * in css/fonts.css is a file the consumer who copies the stylesheet has
 * to copy with it (AR39). Only relative references count: a bare
 * specifier is a dependency (this package has none at runtime) and a
 * `data:` URI carries its bytes in the stylesheet.
 *
 * @param {string} source
 * @returns {string[]}
 */
export function references(source) {
    /** @type {string[]} */
    const out = [];
    for (const match of source.matchAll(/(?:from|import)\s*'(\.[^']+)'/g)) out.push(match[1]);
    for (const match of source.matchAll(/url\(\s*['"]?(\.[^'")]+)['"]?\s*\)/g)) out.push(match[1]);
    return out;
}

/**
 * Resolve `.` and `..` in a repo-relative path, without touching disk.
 * @param {string} path
 * @returns {string}
 */
function normalise(path) {
    /** @type {string[]} */
    const out = [];
    for (const part of path.split('/')) {
        if (part === '.' || part === '') continue;
        if (part === '..') out.pop();
        else out.push(part);
    }
    return out.join('/');
}

if (import.meta.url === `file://${process.argv[1]}`) {
    const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
    const expected = copyableExports(pkg);
    if (expected.length === 0) {
        console.error('gate broke: package.json declares no copyable exports, which cannot be right.');
        process.exit(1);
    }

    let failed = 0;
    for (const path of expected) {
        if (!FILES.includes(path)) {
            failed++;
            console.error(
                `${path} is a file a consumer copies — an export under css/, js/ or dist/, or something one of those imports — and is not in the manifest. Add it to FILES in gates/checksums.mjs.`,
            );
        }
    }
    for (const path of FILES) {
        if (!expected.includes(path)) {
            failed++;
            console.error(
                `${path} is in the manifest and is neither an export under css/, js/ or dist/ nor a file one of them imports — remove it, or declare it in "exports".`,
            );
        }
    }

    if (failed > 0) {
        console.error(`\n${failed} difference(s) between the manifest and what the package offers.`);
        process.exit(1);
    }
    // Named apart, because "34 exports" would be false: one of them is a
    // file no export names, reached by walking what they import.
    const declared = copyableExports(pkg, { follow: false }).length;
    console.log(`Manifest: ${declared} copyable exports plus ${expected.length - declared} file(s) they import, all ${FILES.length} checksummed.`);
}

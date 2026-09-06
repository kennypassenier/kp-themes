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
// **What counts as copyable.** Every concrete export target under `css/`
// or `js/`. Deliberately excluded, each for a reason:
//
//   - the subpath patterns (`./components/*`, `./themes/*`, `./fx/*`):
//     a pattern names a directory, and enumerating it means globbing,
//     which AR26 forbids for exactly this number.
//   - the `types` condition of an entry: a `.d.ts` is for a type checker
//     that got the package from npm, and npm verified its own tarball.
//   - `.jsx` files, `index.js`, `hooks/` and `fx/`: the React channel
//     arrives through npm for the same reason. The manifest is for the
//     half a person copies by hand, and that half is the stylesheets and
//     the framework-free modules.
//   - `./package.json`: npm ships and verifies it whatever we say.
//
// A new export under css/ or js/ therefore lands in this gate's expected
// list the moment it is declared, and the manifest has to grow with it.
// That is the property TH103 asks for: a new file cannot silently fall
// outside again.
//
// **Drilled red three times, 2026-09-06.** `js/strings.js` deleted from
// FILES: "js/strings.js is an export a consumer can copy and is not in the
// manifest". A new export declared and not added — `"./js/locale":
// "./js/locale.js"` — same sentence about js/locale.js, which is the
// property TH103 asks for. `js/locale.js` added to FILES without an
// export: "is in the manifest and is not an export under css/ or js/".
//
// Usage: node gates/check-manifest.mjs

import { readFileSync } from 'node:fs';
import process from 'node:process';
import { FILES } from './checksums.mjs';

/**
 * The export targets a vendoring consumer copies, from `exports` alone.
 *
 * @param {{exports?: Record<string, string | Record<string, string>>}} pkg
 * @returns {string[]} repo-relative paths, sorted
 */
export function copyableExports(pkg) {
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
        if (!/^(css|js)\//.test(path)) continue;
        if (!/\.(css|js)$/.test(path)) continue;
        found.add(path);
    }
    return [...found].sort();
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
            console.error(`${path} is an export a consumer can copy and is not in the manifest — add it to FILES in gates/checksums.mjs.`);
        }
    }
    for (const path of FILES) {
        if (!expected.includes(path)) {
            failed++;
            console.error(`${path} is in the manifest and is not an export under css/ or js/ — remove it, or declare it in "exports".`);
        }
    }

    if (failed > 0) {
        console.error(`\n${failed} difference(s) between the manifest and what the package offers.`);
        process.exit(1);
    }
    console.log(`Manifest: ${expected.length} copyable exports, all ${FILES.length} of them checksummed.`);
}

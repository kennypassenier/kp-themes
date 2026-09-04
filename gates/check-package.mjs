// What actually ships [Phase 9].
//
// The first field test installed the package the way a consumer does and
// found the whole framework-free channel missing: `files` in package.json
// still listed the directories that existed before L4, so `js/` was never
// published. Every export under `@kp-soft/themes/js/*` was a broken
// import, and the React entry point failed too, because index.js imports
// from there.
//
// 180 browser tests, ten gates and a hardening round were all blind to it
// for the same reason: they run against the repository, and a consumer
// runs against the tarball. This gate closes the distance without a
// network call — it compares what `exports` promises against what `files`
// includes, which is the whole of that defect.
//
// Usage: node gates/check-package.mjs

import { readFileSync, existsSync } from 'node:fs';
import process from 'node:process';

const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));

/**
 * The directory or file `files` would have to list for a path to ship.
 * npm includes a directory wholesale, so `js/theme-core.js` ships as long
 * as `js` is listed.
 *
 * @param {string} target e.g. "./js/theme-core.js"
 */
function covered(target) {
    const clean = target.replace(/^\.\//, '');
    // npm ships these whatever `files` says, so listing them would be
    // noise and demanding them would be a false alarm.
    if (['package.json', 'README.md', 'LICENSE'].includes(clean)) return true;
    return (pkg.files ?? []).some(/** @param {string} entry */ (entry) => clean === entry || clean.startsWith(`${entry}/`));
}

if (import.meta.url === `file://${process.argv[1]}`) {
    let failed = 0;
    let checked = 0;

    const targets = Object.entries(pkg.exports ?? {});
    if (targets.length === 0) {
        console.error('gate broke: package.json declares no exports, which cannot be right.');
        process.exit(1);
    }

    for (const [name, target] of targets) {
        if (typeof target !== 'string') continue;
        checked++;

        // On disk at all? A stale export outlives the file it names.
        if (!existsSync(new URL(`../${target.replace(/^\.\//, '')}`, import.meta.url))) {
            failed++;
            console.error(`${name} points at ${target}, which does not exist.`);
            continue;
        }
        if (!covered(target)) {
            failed++;
            console.error(
                `${name} points at ${target}, which "files" does not include — so it is on disk and not in the tarball. ` +
                    `Add its directory to "files" in package.json.`,
            );
        }
    }

    // index.js is the main entry and imports across the package; a
    // directory it reaches that is not published breaks it on install.
    const index = readFileSync(new URL('../index.js', import.meta.url), 'utf8');
    for (const match of index.matchAll(/from '\.\/([a-z-]+)\//g)) {
        checked++;
        if (!(pkg.files ?? []).includes(match[1])) {
            failed++;
            console.error(`index.js imports from ./${match[1]}/, which "files" does not include.`);
        }
    }

    if (failed > 0) {
        console.error(`\n${failed} thing(s) the package promises and would not ship.`);
        process.exit(1);
    }
    console.log(`Package: ${checked} export paths and entry-point imports are all published.`);
}

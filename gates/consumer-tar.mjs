// The consumer tarball [CF1, 2026-09-09].
//
// chassis-rs found this the first time anyone consumed a release from the
// outside (their R3): the release attaches eight assets, while the
// checksum manifest beside them names 231 copyable files. The six
// JavaScript modules a baking consumer needs, the twenty-five registers,
// css/layout.css and css/utilities.css were in none of them, so they
// pulled thirty-odd files off the git tag one by one and verified each
// against SHA256SUMS. Nothing was broken; it was simply work the release
// should have saved them.
//
// Kenny's answer at CF1 was the tarball whose contents cannot go stale:
// it is built FROM the manifest rather than from a list somebody keeps.
// A hand-written list of thirty-three files is exactly the drift KT7 and
// TH130 exist about — two lists promising the same thing with nothing
// laying them side by side — and this way there is only ever one list.
//
// Two exclusions, both patterns rather than names:
//
//   - `fonts/` — five megabytes of woff2 that already ship as fonts.tar.
//     A consumer that wants the faces takes that asset; one that vendors
//     a stylesheet does not want them in the same download.
//   - `*.map` — four megabytes of source maps for the minified twins.
//     They are debugging aid, not something a consumer serves, and they
//     are on the tag for whoever wants them.
//
// What remains is roughly 4.6 MB over 92 files: the authored stylesheets
// including every register, the minified twins, both bundles, and every
// published JavaScript module.
//
// Usage:
//   node gates/consumer-tar.mjs            write consumer.tar
//   node gates/consumer-tar.mjs --list     print what would go in it

import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import process from 'node:process';

const ROOT = fileURLToPath(new URL('../', import.meta.url));

/** Left out of the tarball, with the reason in the header above. */
export const EXCLUDED = [/^fonts\//, /\.map$/];

/**
 * The files the tarball carries, read from the manifest itself.
 *
 * @param {string} manifest the contents of SHA256SUMS
 * @returns {string[]} paths, in the manifest's own order
 */
export function contents(manifest) {
    return manifest
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => line.split(/\s+/).slice(1).join(' '))
        .filter((path) => path && !EXCLUDED.some((rule) => rule.test(path)));
}

if (import.meta.url === `file://${process.argv[1]}`) {
    const manifestPath = join(ROOT, 'SHA256SUMS');
    if (!existsSync(manifestPath)) {
        console.error('SHA256SUMS is missing. Run `npm run checksums` first — the tarball is built from it, not from a list.');
        process.exit(1);
    }
    const files = contents(readFileSync(manifestPath, 'utf8'));
    if (files.length === 0) {
        console.error('the manifest named no files the tarball would carry, which cannot be right.');
        process.exit(1);
    }
    if (process.argv.includes('--list')) {
        for (const file of files) console.log(file);
        process.exit(0);
    }
    // SHA256SUMS travels with the tarball: a consumer unpacking it can
    // verify every file it just received without a second download.
    execFileSync('tar', ['-cf', join(ROOT, 'consumer.tar'), '-C', ROOT, 'SHA256SUMS', ...files], { stdio: 'inherit' });
    const bytes = readFileSync(join(ROOT, 'consumer.tar')).length;
    console.log(`consumer.tar: ${files.length} file(s) from the manifest plus SHA256SUMS, ${(bytes / 1048576).toFixed(1)} MB.`);
    // The manifest inside is the release's own, unfiltered — one file,
    // one meaning [KT10]. That means it names the fonts and the source
    // maps this tarball leaves out, so the bare `sha256sum -c` reports
    // them as unreadable and buries 92 OK lines under 139 warnings. The
    // flag is the difference between a clean verification and a wall of
    // false failures, so it is printed here rather than left to be found.
    console.log('verify it with:  tar -xf consumer.tar && sha256sum -c --ignore-missing SHA256SUMS');
}

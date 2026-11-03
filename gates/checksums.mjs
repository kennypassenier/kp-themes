// SHA256SUMS for the artefacts a consumer takes [L9, TH18].
//
// Ecosystem norm N2, applied to a CSS file: someone vendoring
// css/themes.css into a Rust binary's static directory has no npm to
// verify anything for them, so the tag carries checksums they can check
// by hand. kyu and almanac both vendor rather than install.
//
// The list is what a consumer actually copies, not everything in the
// repository — a checksum for a test fixture would be noise, and noise in
// a verification file is how verification stops happening.
//
// Usage:
//   node gates/checksums.mjs           print the file
//   node gates/checksums.mjs --write   write SHA256SUMS
//   node gates/checksums.mjs --maps [--write]   the opt-in source maps: SHA256SUMS.maps [maps-1102]

import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import process from 'node:process';
import { DIST_FILES, DIST_MAP_FILES } from './checksums-dist.mjs';
import { SPLIT_FILES, SPLIT_MAP_FILES } from './checksums-split.mjs';
import { FACADE_FILES } from './checksums-facades.mjs';
import { JS_FILES } from './checksums-js.mjs';
import { PART_FILES } from './checksums-parts.mjs';
import { CONTROLLER_PART_FILES } from './checksums-parts-controllers.mjs';
import { CONTROLLER_PART_FILES_1B } from './checksums-parts-controllers-1b.mjs';
import { CONTROLLER_PART_FILES_2 } from './checksums-parts-controllers-2.mjs';
import { CONTROLLER_PART_FILES_2B } from './checksums-parts-controllers-2b.mjs';

/**
 * What a consumer copies [TH103].
 *
 * Hand-kept until 3.1.1 and therefore wrong: it had missed js/strings.js
 * (2.0.0) and css/retro-register.css (3.1.0), the two files a consumer
 * overriding the dictionary or loading the retro register would take. It
 * is still written out here rather than derived, because a checksum file
 * that computes its own contents verifies nothing — but
 * gates/check-manifest.mjs now lays this list beside `exports` in
 * package.json and goes red on any difference in either direction, so a
 * new file cannot fall outside it silently again.
 */
export const FILES = [
    'css/_rules.css',
    'css/components.css',
    'css/cyberpunk-register.css',
    'css/layout.css',
    'css/synthwave-register.css',
    'css/brutalism-register.css',
    'css/titanium-register.css',
    'css/pastel-register.css',
    'css/forest-register.css',
    'css/deco-register.css',
    'css/blueprint-register.css',
    'css/nostromo-register.css',
    'css/dark-register.css',
    'css/formal-register.css',
    'css/solstice-register.css',
    'css/tailwind-bridge.css',
    'css/fonts.css',
    'css/themes.css',
    'css/utilities.css',
    'dist/kp-themes.css',
    'dist/kp-themes.js',
    ...DIST_FILES,
    // The split bundle in dist/js/, generated with it [load-1102].
    ...SPLIT_FILES,
    // One facade per public dist/js entry over the single bundle, generated with it [superset-1103].
    ...FACADE_FILES,
    ...JS_FILES,
    // The shipped fonts [T19, AR39]: every file under fonts/ that
    // fonts/families.json names — the faces, each family's LICENSE, the
    // plan itself and the kanji list — derived rather than typed, because
    // fifty-five hand-kept paths would be the 3.1.1 fault at scale.
    ...fontFiles(),
    // The files under js/<name>/ of the split modules: gates/checksums-parts.mjs.
    ...PART_FILES,
    ...CONTROLLER_PART_FILES,
    ...CONTROLLER_PART_FILES_1B,
    ...CONTROLLER_PART_FILES_2,
    ...CONTROLLER_PART_FILES_2B,
];

/**
 * The source maps a consumer can opt into [maps-1102]: no shipped file but dist/kp-themes.min.js names one, so they
 * are not in FILES and not in SHA256SUMS. They are listed in SHA256SUMS.maps, which a vendoring script can add on purpose.
 */
export const MAP_FILES = [...DIST_MAP_FILES, ...SPLIT_MAP_FILES];

/**
 * @returns {string[]} the paths under fonts/ a consumer copies, in a stable order
 */
export function fontFiles() {
    /** @type {Record<string, any>} */
    const families = JSON.parse(readFileSync(new URL('../fonts/families.json', import.meta.url), 'utf8'));
    delete families['//'];
    const out = ['fonts/families.json', 'fonts/jis-level-1.txt'];
    for (const [slug, family] of Object.entries(families)) {
        if (family.reservedFontName && !family.subset) continue;
        out.push(`fonts/${slug}/LICENSE`);
        for (const face of family.faces) {
            for (const script of face.scripts) out.push(`fonts/${slug}/${face.file}${face.scripts.length > 1 ? `-${script}` : ''}.woff2`);
        }
    }
    return out;
}

export function checksums(files = FILES) {
    return (
        files.map((f) => {
            const bytes = readFileSync(new URL(`../${f}`, import.meta.url));
            return `${createHash('sha256').update(bytes).digest('hex')}  ${f}`;
        }).join('\n') + '\n'
    );
}

if (import.meta.url === `file://${process.argv[1]}`) {
    const maps = process.argv.includes('--maps');
    const list = maps ? MAP_FILES : FILES;
    const name = maps ? 'SHA256SUMS.maps' : 'SHA256SUMS';
    const text = checksums(list);
    if (process.argv.includes('--write')) {
        writeFileSync(new URL(`../${name}`, import.meta.url), text);
        console.log(`wrote ${name} for ${list.length} files.`);
    } else {
        process.stdout.write(text);
    }
}
